from flask import Flask
from api.routes import audio_blueprint
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow Cross-Origin requests from React frontend

# Register the API routes blueprint
app.register_blueprint(audio_blueprint)

if __name__ == "__main__":
    app.run(debug=True)
