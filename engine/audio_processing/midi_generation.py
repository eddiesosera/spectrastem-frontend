# File: engine/audio_processing/midi_generation.py

import os
import logging
import librosa
import pretty_midi
import warnings
from utils.status_tracker import update_status
from utils.aws_s3 import upload_to_s3  # Corrected import
from basic_pitch.inference import predict_and_save
# help(predict_and_save)

# Suppress specific warnings if desired
warnings.filterwarnings("ignore", message="numpy.dtype size changed")

def generate_midi_from_audio(file_path, output_dir):
    """
    Generate a MIDI file from an audio file and save it to the specified directory.

    Args:
        file_path (str): The path to the input audio file.
        output_dir (str): The directory to save the generated MIDI file.

    Returns:
        str: The path to the generated MIDI file, or None if an error occurred.
    """
    try:
        # Load the audio file
        y, sr = librosa.load(file_path, sr=None, mono=True)

        # Perform harmonic-percussive source separation
        y_harmonic, _ = librosa.effects.hpss(y)

        # Detect pitches and magnitudes using piptrack
        pitches, magnitudes = librosa.core.piptrack(y=y_harmonic, sr=sr)

        # Initialize PrettyMIDI object
        midi_data = pretty_midi.PrettyMIDI()
        piano_program = pretty_midi.instrument_name_to_program('Acoustic Grand Piano')
        piano = pretty_midi.Instrument(program=piano_program)

        # Iterate over time frames
        time_steps = pitches.shape[1]
        for t in range(time_steps):
            # Get the pitches and magnitudes at time t
            pitch_slice = pitches[:, t]
            magnitude_slice = magnitudes[:, t]

            # Select the pitch with the highest magnitude
            index = magnitude_slice.argmax()
            pitch = pitch_slice[index]
            magnitude = magnitude_slice[index]

            # Threshold to filter out low magnitudes
            if magnitude > 0:
                # Convert pitch from frequency to MIDI note number
                midi_note = int(librosa.hz_to_midi(pitch))

                # Create a Note instance
                note = pretty_midi.Note(
                    velocity=100,
                    pitch=midi_note,
                    start=librosa.frames_to_time(t, sr=sr),
                    end=librosa.frames_to_time(t + 1, sr=sr)
                )
                piano.notes.append(note)

        # Add the instrument to the PrettyMIDI object
        midi_data.instruments.append(piano)

        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)

        # Save the MIDI file
        midi_filename = os.path.splitext(os.path.basename(file_path))[0] + '.mid'
        midi_file_path = os.path.join(output_dir, midi_filename)
        midi_data.write(midi_file_path)

        logging.info(f"MIDI file generated at {midi_file_path}")
        return midi_file_path

    except Exception as e:
        logging.error(f"Error generating MIDI: {e}")
        return None

def generate_midi_from_stems(stems_dir, midi_output_dir):
    """
    Generate MIDI files from audio stems and save them to the specified directory.

    Args:
        stems_dir (str): The directory containing audio stems.
        midi_output_dir (str): The directory to save the generated MIDI files.

    Returns:
        dict: A dictionary containing MIDI filenames and their paths.
    """
    midi_files = {}
    os.makedirs(midi_output_dir, exist_ok=True)

    try:
        for stem_file in os.listdir(stems_dir):
            if not stem_file.lower().endswith(('.mp3', '.wav', '.flac', '.ogg', '.aac')):
                continue  # Skip files that are not audio files

            stem_path = os.path.join(stems_dir, stem_file)
            logging.info(f"Generating MIDI for {stem_file}")

            try:
                midi_file_path = generate_midi_from_audio(stem_path, midi_output_dir)
                if midi_file_path:
                    midi_filename = os.path.basename(midi_file_path)
                    midi_files[midi_filename] = midi_file_path
                else:
                    logging.error(f"Failed to generate MIDI for {stem_file}")

            except Exception as e:
                logging.error(f"Error during MIDI generation for {stem_file}: {e}")

    except Exception as e:
        logging.error(f"Error during MIDI generation: {e}")

    return midi_files

def generate_midi_with_basic_pitch(file_path, output_dir, onset_threshold=0.5, frame_threshold=0.3, minimum_note_length=127.7):
    """
    Generate a MIDI file from an audio file using Basic Pitch.

    Args:
        file_path (str): Path to the input audio file.
        output_dir (str): Directory to save the generated MIDI file.
        onset_threshold (float): Threshold for onset detection (default: 0.5).
        frame_threshold (float): Threshold for frame activation (default: 0.3).
        minimum_note_length (float): Minimum note length in milliseconds (default: 127.7).

    Returns:
        str: Path to the generated MIDI file, or None if an error occurred.
    """
    try:
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)

        # Load the model explicitly
        model_path = "models/midi/basic_pitch/nmp.onnx"  # Update to the actual model path
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}. Please ensure the model is downloaded correctly.")

        # Run prediction and save MIDI
        predict_and_save(
            audio_path_list=[file_path],   # Positional argument: audio_path_list
            output_directory=output_dir,   # Positional argument: output_directory
            save_midi=True,
            sonify_midi=False,
            save_model_outputs=False,
            save_notes=True,
            model_or_model_path=model_path,  # Path to the ONNX model
            onset_threshold=onset_threshold,
            frame_threshold=frame_threshold,
            minimum_note_length=minimum_note_length,
            minimum_frequency=50.0,         # Optional: adjust as needed
            maximum_frequency=5000.0,       # Optional: adjust as needed
            melodia_trick=True,             # Optional: use melodia post-processing
        )

        # The MIDI file is saved in the output directory with the same base name
        midi_filename = os.path.splitext(os.path.basename(file_path))[0] + '.mid'
        midi_file_path = os.path.join(output_dir, midi_filename)

        logging.info(f"MIDI file generated at {midi_file_path}")
        return midi_file_path

    except Exception as e:
        logging.error(f"Error generating MIDI with Basic Pitch: {e}")
        return None