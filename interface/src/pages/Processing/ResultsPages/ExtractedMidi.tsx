import React from "react";
import { useLocation } from "react-router-dom";

const ExtractedMidi: React.FC = () => {
  const location = useLocation();
  const data = location?.state?.data;

  if (!data) {
    return <div>Error: No data available.</div>;
  }

  // Extract data
  // const trackName = data.stems?.track_name || data.midi?.track_name;
  const midiData = data.midi;
  return (
    <div>
      <h1>Extracted Midi</h1>
      {midiData && (
        <div>
          <h3>Generated MIDI Files:</h3>
          <ul>
            {Object.entries(midiData).map(([midiName, midiUrl]) => (
              <li key={midiName}>
                <a href={midiUrl as string} download>
                  {midiName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExtractedMidi;
