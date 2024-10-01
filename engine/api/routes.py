from flask import Blueprint, jsonify

audio_blueprint = Blueprint('audio', __name__)

# Test Route
@audio_blueprint.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Python Engine!"}), 200
