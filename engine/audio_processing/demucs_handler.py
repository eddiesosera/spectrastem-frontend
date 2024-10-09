# File: engine/audio_processing/demucs_handler.py
import subprocess
import os
import logging
import sys

def run_demucs(file_path, output_dir):
    try:
        abs_file_path = os.path.abspath(file_path)
        os.makedirs(output_dir, exist_ok=True)

        # Use the current Python executable path
        python_executable = sys.executable

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

        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Monitor the output from Demucs
        for stdout_line in iter(process.stdout.readline, ''):
            logging.info(f"Demucs Output: {stdout_line.strip()}")
        
        for stderr_line in iter(process.stderr.readline, ''):
            logging.error(f"Demucs Error: {stderr_line.strip()}")

        process.stdout.close()
        process.stderr.close()
        process.wait()

        if process.returncode != 0:
            logging.error(f"Demucs failed with return code {process.returncode}")
            raise Exception(f"Demucs process failed with return code {process.returncode}")

        logging.info(f"Demucs completed successfully for {file_path}")

    except Exception as e:
        logging.error(f"Error during Demucs execution: {e}")
        raise
