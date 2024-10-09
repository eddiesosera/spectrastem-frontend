from flask import Blueprint, jsonify
from utils.status_tracker import get_status
import logging

status_blueprint = Blueprint('status', __name__)

@status_blueprint.route('/api/status/<track_name>', methods=['GET'])
def get_processing_status(track_name):
    # Ensure consistent track name formatting
    track_name = track_name.strip()

    status = get_status(track_name)
    if status["status"] == "Not Found":
        logging.warning(f"Status for {track_name} not found.")
        return jsonify({"error": "Status not found"}), 404

    logging.info(f"Returning status for {track_name}: {status}")
    return jsonify(status), 200