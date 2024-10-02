# File: engine/wsgi.py

from flask import Flask
from api.routes import audio_blueprint
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Set up logging
logging.basicConfig(level=logging.INFO)

# Register the API routes
app.register_blueprint(audio_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
