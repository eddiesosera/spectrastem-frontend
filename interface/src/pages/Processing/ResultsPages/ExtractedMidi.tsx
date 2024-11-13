// interface/pages/Processing/ResultsPages/ExtractedMidi.tsx

import React from "react";

interface ExtractedMidiProps {
  midiFiles: { [key: string]: string };
}

const ExtractedMidi: React.FC<ExtractedMidiProps> = ({ midiFiles }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold">MIDI Files:</h3>
      <ul className="list-disc list-inside">
        {Object.entries(midiFiles).map(([name, url]) => (
          <li key={name} className="mt-2">
            <a href={url} download className="text-blue-500 underline">
              {name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExtractedMidi;
