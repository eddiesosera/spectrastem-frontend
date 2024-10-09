from flask import Flask
from api.upload_routes import upload_blueprint
from api.processing_routes import processing_blueprint
from api.storage_routes import storage_blueprint
from api.status_routes import status_blueprint
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Set up logging
logging.basicConfig(level=logging.INFO)

# Register the API routes
app.register_blueprint(upload_blueprint)
app.register_blueprint(processing_blueprint)
app.register_blueprint(storage_blueprint)
app.register_blueprint(status_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
