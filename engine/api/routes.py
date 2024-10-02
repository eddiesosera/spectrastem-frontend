# File: engine/api/routes.py

from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import logging
import boto3
import threading
from audio_processing.stem_separation import separate_audio_with_demucs
import shutil
from botocore.exceptions import NoCredentialsError

# AWS S3 setup
s3 = boto3.client('s3')
BUCKET_NAME = os.getenv('AWS_BUCKET_NAME')

audio_blueprint = Blueprint('audio', __name__)

# Folders for uploads and stems
UPLOAD_FOLDER = './uploads'
STEM_FOLDER = './stems_output'
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'flac', 'ogg', 'aac'}
MAX_FILE_SIZE_MB = 50

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(STEM_FOLDER, exist_ok=True)

# Dictionary to keep track of processing status
processing_status = {}

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# File size validator
def validate_file_size(file):
    file.seek(0, os.SEEK_END)
    size_in_bytes = file.tell()
    file.seek(0)
    size_in_mb = size_in_bytes / (1024 * 1024)
    return size_in_mb <= MAX_FILE_SIZE_MB

@audio_blueprint.route('/api/upload-audio', methods=['POST'])
def upload_audio():
    if 'file' not in request.files:
        logging.error('No file part in the request')
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        logging.error('No file selected')
        return jsonify({"error": "No file selected"}), 400

    # Check file format
    if not allowed_file(file.filename):
        logging.error(f'File format not allowed: {file.filename}')
        return jsonify({"error": "Invalid file format. Allowed formats are mp3, wav, flac, ogg, aac."}), 400

    # Check file size
    if not validate_file_size(file):
        logging.error(f'File too large: {file.filename}')
        return jsonify({"error": f"File exceeds the size limit of {MAX_FILE_SIZE_MB}MB."}), 400

    # Get the output format from the request (mp3 or wav), default to mp3
    output_format = request.form.get('format', 'mp3')

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
        processing_thread = threading.Thread(target=process_audio_async, args=(file_path, track_name, output_format))
        processing_thread.start()

        # Return the initial response to the frontend
        return jsonify({
            "message": "File uploaded successfully, processing started.",
            "track_name": track_name
        }), 202

    except Exception as e:
        logging.error(f'Error processing file: {str(e)}')
        return jsonify({"error": "An error occurred during processing"}), 500

# Processing function
def process_audio_async(file_path, track_name, output_format):
    try:
        stems = ['vocals', 'drums', 'bass', 'other']
        output_dir = os.path.abspath(os.path.join(STEM_FOLDER, track_name))

        for stem in stems:
            processing_status[track_name]['current_stem'] = stem
            processing_status[track_name]['stems'][stem] = 'processing'

            # Call the separation function for the current stem
            demucs_process = separate_audio_with_demucs(file_path, stem, output_dir, output_format)

            # Wait for the Demucs process to finish
            demucs_process.wait()

            # Check for errors
            if demucs_process.returncode != 0:
                raise Exception(f"Demucs failed for stem {stem}")

            # Upload to AWS S3 and return pre-signed URL
            upload_to_s3(output_dir, f"{stem}.{output_format}", track_name)

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

# Upload to AWS S3 function
def upload_to_s3(directory, filename, track_name):
    try:
        file_path = os.path.join(directory, filename)
        s3.upload_file(file_path, BUCKET_NAME, f"stems/{track_name}/{filename}")
        logging.info(f"Uploaded {filename} to S3")

        # Return the pre-signed URL for downloading
        return s3.generate_presigned_url('get_object', Params={'Bucket': BUCKET_NAME, 'Key': f"stems/{track_name}/{filename}"}, ExpiresIn=3600)
    except NoCredentialsError:
        logging.error("AWS credentials not available.")
    except Exception as e:
        logging.error(f"Error uploading to S3: {str(e)}")
