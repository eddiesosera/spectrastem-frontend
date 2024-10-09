// File: frontend/pages/Processing/ResultsPage.tsx

import React from "react";
import { useLocation } from "react-router-dom";

interface ProcessingResult {
  track_name: string;
  stems: { [key: string]: string };
}

const ResultsPage: React.FC = () => {
  const location = useLocation<{ data: ProcessingResult }>();
  const data = location.state?.data;

  if (!data) {
    return <div>Error: No data available.</div>;
  }

  const { track_name, stems } = data;

  // Function to determine MIME type based on file extension
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
        <h3>Extracted Stems:</h3>
        <ul>
          {Object.entries(stems).map(([stemName, stemUrl]) => (
            <li key={stemName}>
              <h4>{stemName}</h4>
              <audio controls crossOrigin="anonymous">
                <source src={stemUrl} type={getMimeType(stemName)} />
                Your browser does not support the audio tag.
              </audio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultsPage;
