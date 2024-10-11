// File: frontend/pages/Processing/ResultsPage.tsx

import React from "react";
import { useLocation } from "react-router-dom";

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const data = location.state!.data;

  if (!data) {
    return <div>Error: No data available.</div>;
  }

  const { track_name, stems, midi_files } = data;

  const getMimeType = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "mp3":
        return "audio/mpeg";
      case "wav":
        return "audio/wav";
      case "flac":
        return "audio/flac";
      case "ogg":
        return "audio/ogg";
      case "aac":
        return "audio/aac";
      default:
        return "application/octet-stream";
    }
  };

  return (
    <div>
      <h2>Processing Completed for {track_name}</h2>
      <div>
        {stems && (
          <div>
            <h3>Extracted Stems:</h3>
            <ul>
              {Object.entries(stems).map(([stemName, stemUrl]) => (
                <li key={stemName}>
                  <h4>{stemName}</h4>
                  <audio controls>
                    <source src={stemUrl} type={getMimeType(stemUrl)} />
                    Your browser does not support the audio tag.
                  </audio>
                </li>
              ))}
            </ul>
          </div>
        )}

        {midi_files && (
          <div>
            <h3>Generated MIDI Files:</h3>
            <ul>
              {Object.entries(midi_files).map(([midiName, midiUrl]) => (
                <li key={midiName}>
                  <a href={midiUrl} download>
                    {midiName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
