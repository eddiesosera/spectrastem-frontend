# File: engine/api/upload_routes.py
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from utils.validators import allowed_file, validate_file_size
from audio_processing.stem_separation import separate_audio_with_demucs
from utils.aws_s3 import upload_to_s3
from utils.status_tracker import update_status
import os
import logging
# import fcntl

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

    # Process audio synchronously and return response
    return process_audio_from_upload(file_path, track_name)

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
            return jsonify({"error": "Demucs processing failed"}), 500

        # Update status to "Uploading to S3"
        update_status(track_name, "Processing", "Uploading to S3")

        # Upload the stems to S3
        s3_urls = upload_to_s3(output_dir, track_name)

        # Update status to "Completed"
        update_status(track_name, "Completed", "Done", stems=s3_urls)

        logging.info(f"Processing completed successfully for {track_name}")
        return jsonify({
            "message": "Processing completed successfully",
            "track_name": track_name,
            "status": "Completed",
            "stems": s3_urls  # s3_urls is a dictionary of stem names and URLs
        }), 200

    except Exception as e:
        logging.error(f"Error during processing: {e}")
        return jsonify({"error": "Error during processing", "details": str(e)}), 500