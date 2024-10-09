from utils.file_utils import delete_directory, delete_file
import os
import logging

# Cleanup logic for removing temporary files after processing
def cleanup_local_files(track_name):
    try:
        directory = f"./stems_output/{track_name}"
        upload_file = f"./uploads/{track_name}"
        
        # Delete stems directory
        delete_directory(directory)
        
        # Delete the original uploaded file
        delete_file(upload_file)
        
        logging.info(f"Cleaned up local files for track: {track_name}")
    
    except Exception as e:
        logging.error(f"Error during cleanup for {track_name}: {str(e)}")

# Function to delete files older than X days (for future use)
def delete_old_files(directory, days_old):
    current_time = os.path.getmtime(directory)
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        file_age = (current_time - os.path.getmtime(file_path)) / (24 * 3600)  # Convert to days
        
        if file_age > days_old:
            if os.path.isfile(file_path):
                delete_file(file_path)
            elif os.path.isdir(file_path):
                delete_directory(file_path)
            logging.info(f"Deleted old file: {file_path}")
