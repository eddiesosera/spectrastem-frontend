import os
import shutil
import logging

def ensure_directory_exists(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
        logging.info(f"Created directory: {directory}")
    else:
        logging.info(f"Directory already exists: {directory}")

def delete_directory(directory):
    try:
        if os.path.exists(directory):
            shutil.rmtree(directory)
            logging.info(f"Deleted directory: {directory}")
        else:
            logging.warning(f"Directory not found: {directory}")
    except Exception as e:
        logging.error(f"Error deleting directory {directory}: {str(e)}")

def delete_file(file_path):
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logging.info(f"Deleted file: {file_path}")
        else:
            logging.warning(f"File not found: {file_path}")
    except Exception as e:
        logging.error(f"Error deleting file {file_path}: {str(e)}")
