
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()


class Config:
    """Base configuration."""
    DEBUG = False
    TESTING = False

    # AWS S3 Configuration
    # Accessing the values from the .env file
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_BUCKET_NAME = os.getenv('AWS_BUCKET_NAME')
    AWS_REGION = os.getenv('AWS_REGION')

    print(f"AWS Access Key: {AWS_ACCESS_KEY_ID}")
    # File size limit (50MB max by default)
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50 MB
    
    # Allowed file extensions
    ALLOWED_EXTENSIONS = {'mp3', 'wav', 'flac', 'ogg', 'aac'}

    # Demucs processing configuration
    DEMUCS_MODEL = 'mdx_extra_q'  # Default model
    DEMUCS_OUTPUT_DIR = './stems_output'
    DEMUCS_OPTIONS = '--no-split --filename {stem}.wav'
    
    # Clean up local files after processing
    CLEANUP_AFTER_PROCESSING = True

    # Debugging and logging
    LOGGING_LEVEL = os.getenv('LOGGING_LEVEL', 'INFO')


class DevelopmentConfig(Config):
    """Development environment configuration."""
    DEBUG = True


class ProductionConfig(Config):
    """Production environment configuration."""
    DEBUG = False


# Dynamically select configuration based on the environment
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
}

# Load configuration based on environment variable, default to development
active_config = config.get(os.getenv('FLASK_ENV', 'development'))()
