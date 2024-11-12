// interface/src/pages/Processing/ResultsPages/ExtractedMidi.tsx

import React, { useState } from "react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";

interface ExtractedMidiProps {
  midiFiles: { [key: string]: string };
}

const ExtractedMidi: React.FC<ExtractedMidiProps> = ({ midiFiles }) => {
  // State to manage playback status for each MIDI file
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});

  // Function to handle MIDI playback
  const handlePlay = async (filename: string, url: string) => {
    if (isPlaying[filename]) {
      // If already playing, stop the playback
      setIsPlaying((prev) => ({ ...prev, [filename]: false }));
      Tone.Transport.stop();
      Tone.Transport.cancel(); // Clear scheduled events
      return;
    }

    try {
      // Resume AudioContext if not already running
      if (Tone.context.state !== "running") {
        await Tone.context.resume();
      }

      // Fetch the MIDI file as an ArrayBuffer
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();

      // Parse the MIDI file
      const midi = new Midi(arrayBuffer);

      // Create a sampler with a piano SoundFont
      const sampler = new Tone.Sampler({
        urls: {
          A0: "A0.mp3",
          C1: "C1.mp3",
          "D#1": "Ds1.mp3",
          "F#1": "Fs1.mp3",
          A1: "A1.mp3",
          C2: "C2.mp3",
          "D#2": "Ds2.mp3",
          "F#2": "Fs2.mp3",
          A2: "A2.mp3",
          C3: "C3.mp3",
          "D#3": "Ds3.mp3",
          "F#3": "Fs3.mp3",
          A3: "A3.mp3",
          C4: "C4.mp3",
          "D#4": "Ds4.mp3",
          "F#4": "Fs4.mp3",
          A4: "A4.mp3",
          C5: "C5.mp3",
          "D#5": "Ds5.mp3",
          "F#5": "Fs5.mp3",
          A5: "A5.mp3",
          C6: "C6.mp3",
          "D#6": "Ds6.mp3",
          "F#6": "Fs6.mp3",
          A6: "A6.mp3",
          C7: "C7.mp3",
          "D#7": "Ds7.mp3",
          "F#7": "Fs7.mp3",
          A7: "A7.mp3",
          C8: "C8.mp3",
        },
        release: 1,
        baseUrl: "https://tonejs.github.io/audio/salamander/",
      }).toDestination();

      // Wait for the sampler to load all samples
      await sampler.loaded;

      // Schedule each note
      midi.tracks.forEach((track) => {
        if (track.notes.length === 0) return;

        track.notes.forEach((note) => {
          sampler.triggerAttackRelease(
            note.name,
            note.duration,
            note.time,
            note.velocity
          );
        });
      });

      // Start the Transport
      Tone.Transport.start();
      setIsPlaying((prev) => ({ ...prev, [filename]: true }));

      // Stop playback when MIDI ends
      Tone.Transport.scheduleOnce(() => {
        setIsPlaying((prev) => ({ ...prev, [filename]: false }));
        Tone.Transport.stop();
        Tone.Transport.cancel();
      }, midi.duration + 1); // Add a buffer to ensure all notes are played
    } catch (error) {
      console.error("Error playing MIDI file:", error);
      setIsPlaying((prev) => ({ ...prev, [filename]: false }));
      alert(`Failed to play MIDI file "${filename}". Please try again.`);
    }
  };

  return (
    <div className="midi-container">
      <h3 className="text-xl font-bold mb-4">Extracted MIDI Files</h3>
      <ul>
        {Object.entries(midiFiles).map(([filename, url]) => (
          <li key={filename} className="mb-4 flex items-center justify-between">
            <div>
              <a
                href={url}
                download={filename}
                className="text-blue-500 underline mr-4"
              >
                {filename}
              </a>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handlePlay(filename, url)}
                className={`${
                  isPlaying[filename] ? "bg-red-500" : "bg-green-500"
                } text-white px-4 py-2 rounded mr-2`}
              >
                {isPlaying[filename] ? "Stop" : "Play"}
              </button>
              <a
                href={url}
                download={filename}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Download
              </a>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500 mt-4">
        Note: Playback relies on your browser's Web Audio API. Ensure sound is
        enabled and your device's volume is up.
      </p>
    </div>
  );
};

export default ExtractedMidi;
