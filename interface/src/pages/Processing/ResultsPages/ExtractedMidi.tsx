// ExtractedMidi.tsx
import React from "react";

interface ExtractedMidiProps {
  midiFiles: string[];
}

const ExtractedMidi: React.FC<ExtractedMidiProps> = ({ midiFiles }) => {
  return (
    <div>
      <h2>Generated MIDI Files</h2>
      <ul>
        {midiFiles.map((file, index) => (
          <li key={index}>
            <a href={file} target="_blank" rel="noopener noreferrer">
              MIDI File {index + 1}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExtractedMidi;
