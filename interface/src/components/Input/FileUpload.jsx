// File: src/components/Input/FileUpload.jsx

import React, { useState, useRef, useEffect } from "react";
import WaveSurferModule from "../../utils/ui/wavesurfer.utils"; // Adjust the path as needed
import Dropzone from "./../../../node_modules/react-dropzone-uploader/dist/Dropzone";
// s

const FileUpload = () => {
  // State variables
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loop, setLoop] = useState(false);

  // Ref for WaveSurferModule instance
  const waveSurferRef = useRef(null);

  // Callback ref for the container
  const setWaveContainer = (element) => {
    if (element && !waveSurferRef.current) {
      console.log("Initializing WaveSurfer with container:", element);
      try {
        waveSurferRef.current = new WaveSurferModule(element);
        waveSurferRef.current.initialize();
      } catch (err) {
        console.error("Error initializing WaveSurferModule:", err);
        setError("Failed to initialize WaveSurfer.");
      }
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        // 50MB limit
        setError("File exceeds the size limit of 50MB.");
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
        setIsLoading(true);
        waveSurferRef.current.loadAudio(selectedFile);
        waveSurferRef.current.wavesurfer.on("ready", () => {
          setIsLoading(false);
        });
      }
    }
  };

  const togglePlayPause = () => {
    waveSurferRef.current.playPause();
    setIsPlaying(!isPlaying);
  };

  const speedUp = () => {
    const newRate = Math.min(playbackRate + 0.5, 3);
    waveSurferRef.current.setPlaybackRate(newRate);
    setPlaybackRate(newRate);
  };

  const slowDown = () => {
    const newRate = Math.max(playbackRate - 0.5, 0.5);
    waveSurferRef.current.setPlaybackRate(newRate);
    setPlaybackRate(newRate);
  };

  const toggleLoopHandler = () => {
    waveSurferRef.current.toggleLoop();
    setLoop(!loop);
  };

  const restartPlayback = () => {
    waveSurferRef.current.restartPlayback();
    setIsPlaying(true);
  };

  const extractAudio = async () => {
    const wavBlob = await waveSurferRef.current.extractAudio();
    if (wavBlob) {
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "extracted_region.wav";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      console.log("Audio region extracted and downloaded.");
    }
  };

  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);
  };

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Audio File Upload and Editor</h2>
      <input type="file" onChange={handleFileChange} accept="audio/*" />
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        accept="audio/*"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoading && (
        <div style={{ marginTop: "20px", fontWeight: "bold" }}>Loading...</div>
      )}
      <div
        ref={setWaveContainer}
        style={{
          marginTop: "20px",
          border: "1px solid #ddd",
          width: "100%",
          height: "100px", // Ensure defined height
          position: "relative", // Ensure relative positioning
        }}
      />
      {file && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={togglePlayPause} style={buttonStyle}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={speedUp} style={buttonStyle}>
            Speed Up
          </button>
          <button onClick={slowDown} style={buttonStyle}>
            Slow Down
          </button>
          <button onClick={toggleLoopHandler} style={buttonStyle}>
            {loop ? "Disable Loop" : "Enable Loop"}
          </button>
          <button onClick={restartPlayback} style={buttonStyle}>
            Restart
          </button>
          <button onClick={extractAudio} style={buttonStyle}>
            Extract Audio
          </button>
        </div>
      )}
    </div>
  );
};

// Styling for buttons
const buttonStyle = {
  marginRight: "10px",
  padding: "10px 15px",
  fontSize: "14px",
  cursor: "pointer",
};

export default FileUpload;
