# File: engine/api/processing_routes.py
from flask import Blueprint, request, jsonify
import logging

processing_blueprint = Blueprint('processing', __name__)
processing_status = {}  # This should be shared or accessed from a shared module

@processing_blueprint.route('/api/status/<track_name>', methods=['GET'])
def get_processing_status(track_name):
    status_info = processing_status.get(track_name)
    if not status_info:
        logging.warning(f"Status for {track_name} not found.")
        return jsonify({"error": "Status not found"}), 404

    logging.info(f"Returning status for {track_name}: {status_info}")
    return jsonify(status_info), 200
