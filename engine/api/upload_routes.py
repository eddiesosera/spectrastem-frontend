# File: engine/api/upload_routes.py
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from utils.validators import allowed_file, validate_file_size
from audio_processing.stem_separation import separate_audio_with_demucs
from audio_processing.midi_generation import generate_midi_from_audio
from audio_processing.midi_generation import generate_midi_with_basic_pitch
from utils.aws_s3 import upload_to_s3
from utils.status_tracker import update_status
import os
import logging

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

upload_blueprint = Blueprint('upload', __name__)

@upload_blueprint.route('/api/upload-audio', methods=['POST'])
def upload_audio():
    if 'file' not in request.files:
        logging.error('No file part in the request')
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        logging.error('No file selected')
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        logging.error(f'File format not allowed: {file.filename}')
        return jsonify({"error": "Invalid file format. Allowed formats are mp3, wav, flac, ogg, aac."}), 400

    if not validate_file_size(file):
        logging.error(f'File too large: {file.filename}')
        return jsonify({"error": f"File exceeds the size limit of 50MB."}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    logging.info(f'File saved at {file_path}')

    track_name = filename  # Use full filename including extension

    # Trigger processing for both MIDI and stem separation
    responses = {}
    process_stems = request.form.get('process_stems', 'true').lower() == 'true'
    generate_midi = request.form.get('generate_midi', 'true').lower() == 'true'

    # Process stem separation if selected
    if process_stems:
        stem_response = process_audio_from_upload(file_path, track_name)
        responses["stems"] = stem_response

    # Generate MIDI if selected
    if generate_midi:
        midi_response = process_midi_generation(file_path, track_name)
        responses["midi"] = midi_response

    return jsonify(responses), 200

def process_audio_from_upload(file_path, track_name):
    try:
        logging.info(f"Triggering audio processing for {track_name}")

        # Update status to "Processing"
        update_status(track_name, "Processing", "Demucs Starting")

        # Start the stem separation process
        output_dir = f"./stems_output/{track_name}"
        result = separate_audio_with_demucs(file_path, "two_stems", output_dir)

        # Check if the process completed successfully
        if result.returncode != 0:
            logging.error(f"Demucs failed with return code {result.returncode}")
            update_status(track_name, "Failed", "Error during Demucs processing")
            return {"error": "Demucs processing failed"}

        # Update status to "Uploading to S3"
        update_status(track_name, "Processing", "Uploading to S3")

        # Upload the stems to S3
        s3_urls = upload_to_s3(output_dir, track_name, s3_subfolder='stems')

        # Update status to "Completed"
        update_status(track_name, "Completed", "Done", stems=s3_urls)

        logging.info(f"Processing completed successfully for {track_name}")
        return {
            "message": "Processing completed successfully",
            "track_name": track_name,
            "status": "Completed",
            "stems": s3_urls
        }

    except Exception as e:
        logging.error(f"Error during processing: {e}")
        update_status(track_name, "Failed", "Error during processing")
        return {"error": "Error during processing", "details": str(e)}

def process_midi_generation(file_path, track_name):
    try:
        logging.info(f"Triggering MIDI generation for {track_name}")

        # Update status to "Processing"
        update_status(track_name, "Processing", "MIDI Generation Starting")

        # Create output directory for MIDI files
        output_dir = f"./midis/{track_name}"
        os.makedirs(output_dir, exist_ok=True)

        # Generate MIDI file using Basic Pitch
        midi_file_path = generate_midi_with_basic_pitch(file_path, output_dir)

        if not midi_file_path:
            raise Exception("MIDI generation failed.")

        # Upload MIDI file to S3 under the 'midis' folder
        midi_s3_urls = upload_to_s3(output_dir, track_name, s3_subfolder='midis')

        # Update status to "Completed"
        update_status(track_name, "Completed", "MIDI Generation Done", midi=midi_s3_urls)

        logging.info(f"MIDI generation completed successfully for {track_name}")
        return {
            "message": "MIDI generation completed successfully",
            "track_name": track_name,
            "status": "Completed",
            "midi_files": midi_s3_urls
        }

    except Exception as e:
        logging.error(f"Error during MIDI generation: {e}")
        update_status(track_name, "Failed", "Error during MIDI generation")
        return {"error": "Error during MIDI generation", "details": str(e)}