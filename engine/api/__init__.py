# File: engine/api/__init__.py
from flask import Flask
from .upload_routes import upload_blueprint
from .midi_routes import midi_blueprint
from .processing_routes import processing_blueprint
from .status_routes import status_blueprint

def create_app():
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(upload_blueprint)
    app.register_blueprint(midi_blueprint)
    app.register_blueprint(processing_blueprint)
    app.register_blueprint(status_blueprint)

    return app
