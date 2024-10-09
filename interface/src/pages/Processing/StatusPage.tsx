// File: frontend/pages/Processing/StatusPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface ProcessingStatus {
  status: string;
  current_stem?: string;
  stems?: Record<string, string>; // Object with stem names as keys and URLs as values
}

const StatusPage: React.FC = () => {
  const { trackName } = useParams<{ trackName: string }>();

  const [status, setStatus] = useState<string>("Processing...");
  const [currentStem, setCurrentStem] = useState<string>("");
  const [stems, setStems] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  // Decode the track name if necessary
  const decodedTrackName = trackName ? decodeURIComponent(trackName) : "";

  useEffect(() => {
    if (!decodedTrackName) return;

    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/status/${encodeURIComponent(
            decodedTrackName
          )}`
        );
        const data: ProcessingStatus = response.data;
        setStatus(data.status);
        setCurrentStem(data.current_stem || "");

        if (data.stems) {
          setStems(data.stems);
        }
      } catch (err) {
        setError("Failed to fetch processing status. Error info: " + err);
      }
    };

    // Fetch status immediately on component mount
    fetchStatus();

    // Set up polling every 5 seconds
    const intervalId = setInterval(fetchStatus, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [decodedTrackName]);

  if (!trackName) {
    return <div>Error: Track name not provided.</div>;
  }

  return (
    <div>
      <h2>Processing Status for {decodedTrackName}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Status: {status}</p>
      {currentStem && <p>Current Stem: {currentStem}</p>}

      {Object.keys(stems).length > 0 && (
        <div>
          <h3>Extracted Stems:</h3>
          <ul>
            {Object.entries(stems).map(([stemName, stemUrl]) => (
              <li key={stemName}>
                <h4>{stemName}</h4>
                <audio controls>
                  <source src={stemUrl} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusPage;
