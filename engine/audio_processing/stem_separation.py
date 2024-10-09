# File: engine/audio_processing/stem_separation.py

import os
import subprocess
import logging
import sys

def separate_audio_with_demucs(file_path, stems_to_process, output_dir):
    abs_file_path = os.path.abspath(file_path)
    python_executable = sys.executable

    # Construct the Demucs command
    command = [
        python_executable,
        "-m", "demucs",
        abs_file_path,
        "-o", output_dir,
        "-n", "mdx_extra_q",
        "--filename", "{stem}.{ext}",
        "--mp3"
    ]

    logging.info(f"Running Demucs command: {' '.join(command)}")

    # Run the command synchronously and capture the output
    result = subprocess.run(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Log the output and errors
    if result.stdout:
        logging.info(f"Demucs output: {result.stdout}")
    if result.stderr:
        logging.error(f"Demucs error: {result.stderr}")

    return result
