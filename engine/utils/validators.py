import os

ALLOWED_EXTENSIONS = {'mp3', 'wav', 'flac', 'ogg', 'aac'}
MAX_FILE_SIZE_MB = 50

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file_size(file):
    file.seek(0, os.SEEK_END)
    size_in_bytes = file.tell()
    file.seek(0)
    size_in_mb = size_in_bytes / (1024 * 1024)
    return size_in_mb <= MAX_FILE_SIZE_MB
