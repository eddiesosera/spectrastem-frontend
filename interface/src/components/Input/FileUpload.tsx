// File: src/components/FileUpload.tsx

import React, { useState } from "react";
import axios from "axios";

interface Stems {
  [key: string]: string;
}

interface Progress {
  [key: string]: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [stems, setStems] = useState<Stems | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentStem, setCurrentStem] = useState<string>("initializing");
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  // Handle form submission to upload the file
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true); // Show loading state
    setError(null); // Reset error
    setStems(null);
    setProgress(null);
    setCurrentStem("initializing");

    try {
      // Make a POST request to upload the file
      const response = await axios.post(
        "http://127.0.0.1:5000/api/upload-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { track_name } = response.data;

      // Start polling for progress updates
      pollProgress(track_name);
    } catch (error) {
      console.error("Error uploading the file:", error);
      setError("There was an error processing the file.");
      setLoading(false); // Hide loading state
    }
  };

  // Function to poll the backend for progress updates
  const pollProgress = (trackName: string) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/progress/${trackName}`
        );
        const status = response.data;

        // Update the frontend based on the status
        if (status.error) {
          setError(status.error);
          setLoading(false);
          clearInterval(intervalId);
          return;
        }

        // Update progress state
        setProgress(status.stems);
        setCurrentStem(status.current_stem);

        // Check if all stems are completed
        if (status.status === "completed") {
          // All stems are completed
          // Update state with the paths to the stems
          setStems({
            vocals: `http://127.0.0.1:5000/stems/${trackName}/vocals.wav`,
            drums: `http://127.0.0.1:5000/stems/${trackName}/drums.wav`,
            bass: `http://127.0.0.1:5000/stems/${trackName}/bass.wav`,
            other: `http://127.0.0.1:5000/stems/${trackName}/other.wav`,
          });
          setError(null);
          setLoading(false);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error checking progress:", error);
        setError("There was an error checking progress.");
        setLoading(false);
        clearInterval(intervalId);
      }
    }, 1000); // Poll every 1 second
  };

  return (
    <div>
      <h2>Upload an Audio File for Stem Separation</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {loading && (
        <div>
          <p>Processing... Please wait.</p>
          <p>
            Current Stem:{" "}
            {currentStem === "none"
              ? "Completed"
              : currentStem.charAt(0).toUpperCase() + currentStem.slice(1)}
          </p>
          {progress && (
            <ul>
              {["vocals", "drums", "bass", "other"].map((stem) => (
                <li key={stem}>
                  {stem.charAt(0).toUpperCase() + stem.slice(1)}:{" "}
                  {progress[stem]}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {stems && (
        <div>
          <h3>Separated Stems</h3>
          {["vocals", "drums", "bass", "other"].map((stem) => (
            <div key={stem}>
              <h4>{stem.charAt(0).toUpperCase() + stem.slice(1)}</h4>
              <audio controls src={stems[stem]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
