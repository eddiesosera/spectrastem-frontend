# File: engine/audio_processing/midi_generation.py
import os
import logging
import librosa
import pretty_midi

def generate_midi_from_audio(file_path, output_dir):
    try:
        # Load the audio file
        y, sr = librosa.load(file_path, sr=None)
        
        # Use librosa to extract pitch (chromagram) and convert to MIDI
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        tempo, beat_frames = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr)
        pitches, magnitudes = librosa.core.piptrack(y=y, sr=sr)
        
        # Create a PrettyMIDI object
        midi = pretty_midi.PrettyMIDI()
        instrument = pretty_midi.Instrument(program=0)
        
        # Iterate through pitches to add MIDI notes
        for pitch in pitches:
            # Filter out low magnitudes
            if magnitudes.max() > 0.1:
                note_number = int(librosa.hz_to_midi(pitch))
                note = pretty_midi.Note(
                    velocity=100, pitch=note_number, start=0, end=1  # Simplified example
                )
                instrument.notes.append(note)
        
        # Save the MIDI file
        midi.instruments.append(instrument)
        output_path = os.path.join(output_dir, "output.mid")
        midi.write(output_path)

        logging.info(f"MIDI file generated at {output_path}")
        return output_path

    except Exception as e:
        logging.error(f"Error during MIDI generation: {e}")
        raise
