# File: engine/api/routes.py

from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import logging
import threading
from audio_processing.stem_separation import separate_audio_with_demucs
import shutil

audio_blueprint = Blueprint('audio', __name__)

# Folders for uploads and stems
UPLOAD_FOLDER = './uploads'
STEM_FOLDER = './stems_output'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(STEM_FOLDER, exist_ok=True)

# Dictionary to keep track of processing status
processing_status = {}

@audio_blueprint.route('/api/upload-audio', methods=['POST'])
def upload_audio():
    if 'file' not in request.files:
        logging.error('No file part in the request')
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        logging.error('No file selected')
        return jsonify({"error": "No file selected"}), 400

    try:
        # Save the uploaded file
        filename = secure_filename(file.filename)
        track_name = os.path.splitext(filename)[0]
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        logging.info(f'File saved at {file_path}')

        # Initialize processing status
        processing_status[track_name] = {
            'status': 'processing',
            'current_stem': 'initializing',
            'stems': {stem: 'pending' for stem in ['vocals', 'drums', 'bass', 'other']},
            'error': None
        }

        # Start the Demucs processing in a separate thread
        processing_thread = threading.Thread(target=process_audio_async, args=(file_path, track_name))
        processing_thread.start()

        # Return the initial response to the frontend
        return jsonify({
            "message": "File uploaded successfully, processing started.",
            "track_name": track_name
        }), 202

    except Exception as e:
        logging.error(f'Error processing file: {str(e)}')
        return jsonify({"error": "An error occurred during processing"}), 500

def process_audio_async(file_path, track_name):
    try:
        stems = ['vocals', 'drums', 'bass', 'other']
        output_dir = os.path.abspath(os.path.join(STEM_FOLDER, track_name))

        for stem in stems:
            processing_status[track_name]['current_stem'] = stem
            processing_status[track_name]['stems'][stem] = 'processing'

            # Call the separation function for the current stem
            demucs_process = separate_audio_with_demucs(file_path, stem, output_dir)

            # Read Demucs output in real-time (optional)
            while True:
                line = demucs_process.stdout.readline()
                if not line:
                    break
                decoded_line = line.strip()
                logging.info(f"Demucs output: {decoded_line}")

            # Wait for the Demucs process to finish
            demucs_process.wait()

            # Check for errors
            if demucs_process.returncode != 0:
                raise Exception(f"Demucs failed for stem {stem}")

            # Update stem status to completed
            processing_status[track_name]['stems'][stem] = 'completed'
            logging.info(f"{stem} stem completed for {track_name}")

        # Update overall processing status
        processing_status[track_name]['status'] = 'completed'
        processing_status[track_name]['current_stem'] = 'none'
        logging.info(f"All stems processed for {file_path}")

    except Exception as e:
        logging.error(f'Error processing file: {str(e)}')
        processing_status[track_name]['status'] = 'error'
        processing_status[track_name]['error'] = str(e)

@audio_blueprint.route('/api/progress/<track_name>', methods=['GET'])
def check_progress(track_name):
    status = processing_status.get(track_name)
    if status:
        return jsonify(status), 200
    else:
        return jsonify({"error": "Track not found"}), 404

# Serve the separated stem files
@audio_blueprint.route('/stems/<track_name>/<stem_name>.wav')
def serve_stems(track_name, stem_name):
    directory = os.path.abspath(os.path.join(STEM_FOLDER, track_name))
    filename = f"{stem_name}.wav"
    return send_from_directory(directory, filename)
