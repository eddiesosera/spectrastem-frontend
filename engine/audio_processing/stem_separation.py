# File: engine/audio_processing/stem_separation.py

import os
import subprocess
import logging
import sys

def separate_audio_with_demucs(file_path, stems_to_process, output_dir):
    # Convert the relative file path to an absolute path
    abs_file_path = os.path.abspath(file_path)

    # Use the Python executable to run Demucs
    python_executable = sys.executable  # Gets the path to the Python interpreter being used

    # Construct the Demucs command
    command = [
        python_executable,
        "-u",  # Unbuffered stdout and stderr
        "-m", "demucs",
        abs_file_path,
        "-o", output_dir,
        "-n", "mdx_extra_q",
        "--filename", "{stem}.{ext}",
        "--two-stems", stems_to_process
    ]

    # Log the command being run
    logging.info(f"Command being run: {' '.join(command)}")

    try:
        # Run the command using subprocess, capturing stdout and stderr
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            bufsize=1,
            text=True
        )
        return process
    except Exception as e:
        raise Exception(f"Demucs failed to start: {e}")
