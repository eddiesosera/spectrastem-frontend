# File: engine/api/midi_generation_routes.py
from flask import Blueprint, request, jsonify
from audio_processing.midi_generation import generate_midi_from_audio
from utils.aws_s3 import upload_to_s3
from utils.status_tracker import update_status
import os
import logging

midi_blueprint = Blueprint('midi', __name__)

@midi_blueprint.route('/api/generate-midi', methods=['POST'])
def generate_midi():
    file_path = request.json.get('file_path')
    track_name = request.json.get('track_name')

    if not file_path or not track_name:
        logging.error("File path or track name is missing.")
        return jsonify({"error": "File path and track name are required."}), 400

    try:
        # Update status to "Processing"
        update_status(track_name, "Processing", "Generating MIDI")

        # Create output directory for MIDI files
        output_dir = f"./midi_output/{track_name}"
        os.makedirs(output_dir, exist_ok=True)

        # Generate MIDI file
        midi_file_path = generate_midi_from_audio(file_path, output_dir)

        # Upload MIDI file to S3
        s3_urls = upload_to_s3(output_dir, track_name)

        # Update status to "Completed"
        update_status(track_name, "Completed", "MIDI Generation Done", stems=s3_urls)

        logging.info(f"MIDI generation completed successfully for {track_name}")
        return jsonify({
            "message": "MIDI generation completed successfully",
            "track_name": track_name,
            "status": "Completed",
            "midi_files": s3_urls
        }), 200

    except Exception as e:
        logging.error(f"Error during MIDI generation: {e}")
        update_status(track_name, "Failed", "Error during MIDI generation")
        return jsonify({"error": "Error during MIDI generation", "details": str(e)}), 500
