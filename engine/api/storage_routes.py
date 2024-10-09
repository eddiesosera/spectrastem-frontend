from flask import Blueprint, jsonify
from utils.aws_s3 import upload_to_s3
import os
import logging

storage_blueprint = Blueprint('storage', __name__)

@storage_blueprint.route('/api/cleanup/<track_name>', methods=['DELETE'])
def cleanup_local_and_s3(track_name):
    local_dir = f"./stems_output/{track_name}"
    try:
        if os.path.exists(local_dir):
            os.rmdir(local_dir)
            logging.info(f"Deleted local directory for {track_name}")
        # Add S3 cleanup if needed
        return jsonify({"message": f"Cleanup completed for {track_name}"}), 200
    except Exception as e:
        logging.error(f"Error during cleanup: {e}")
        return jsonify({"error": "Error during cleanup"}), 500
