import os
import logging

UPLOAD_FOLDER = './uploads'

def save_file(file, filename):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    logging.info(f'File saved at {file_path}')
    return file_path

def is_file_processed(track_name):
    output_dir = f"./stems_output/{track_name}"
    return os.path.exists(output_dir)
