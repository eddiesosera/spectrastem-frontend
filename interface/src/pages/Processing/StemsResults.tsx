// File: frontend/pages/Processing/ResultsPage.tsx

import React from "react";
import { useLocation } from "react-router-dom";

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const data = location.state?.data;

  if (!data) {
    return <div>Error: No data available.</div>;
  }

  // Extract data
  const trackName = data.stems?.track_name || data.midi?.track_name;
  const stemsData = data.stems?.stems;
  const midiData = data.midi?.midi_files;

  return (
    <div>
      <h2>Processing Completed for {trackName}</h2>

      {stemsData && (
        <div>
          <h3>Extracted Stems:</h3>
          <ul>
            {Object.entries(stemsData).map(([stemName, stemUrl]) => (
              <li key={stemName}>
                <h4>{stemName}</h4>
                <audio controls>
                  <source src={stemUrl as string} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              </li>
            ))}
          </ul>
        </div>
      )}

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

export default ResultsPage;
