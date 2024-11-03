import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setLoopRegion } from "../../../redux/slices/audio.slice";
import "./waveform.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface WaveformPreview {
  audioFile: any;
}

const Waveform: React.FC<WaveformPreview> = ({ audioFile }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const dispatch = useDispatch();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // Store the uploaded file
  const [isPlaying, setIsPlaying] = useState(false); // Play/pause state
  const [uploadStatus, setUploadStatus] = useState(""); // Status of upload
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userSubscription = useSelector(
    (state: RootState) => state.user.userDetails.accountType
  );
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Function to handle audio file upload to the Spectrastem server
  const handleFileSubmit = async () => {
    console.log("Uploading started");
    if (!uploadedFile) {
      setUploadStatus("No file selected for upload.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", audioFile); // Add the file to the form data
    formData.append("process_stems", String(true));

    try {
      console.log("Sending tp server: " + formData.get("process_stems"));
      const response = await axios.post(
        `${API_BASE_URL}/api/upload-audio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (
        response.status === 200 &&
        response.data.message === "Processing completed successfully"
      ) {
        // Navigate to the results page with the response data
        navigate("/results", { state: { data: response.data } });
        setError(null);
      } else {
        setError(response.data.error || "Unexpected response from the server.");
      }
    } catch (err) {
      setError("An error occurred during upload: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (audioFile) {
      setUploadedFile(audioFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (wavesurfer.current && e.target?.result) {
          wavesurfer.current.load(e.target.result as string); // Load audio file into WaveSurfer
        }
      };
      reader.readAsDataURL(audioFile);
    }

    // Initialize Waveform
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#cbc6d7",
        progressColor: "#57398e",
        cursorColor: "#212121",
        cursorWidth: 2,
        barWidth: 3,
        barGap: 1,
        barRadius: 30,
        height: 200,
        plugins: [
          RegionsPlugin.create({
            regions: [],
            dragSelection: {
              slop: 5,
            },
          }),
        ],
      });

      // Get duration of audio file
      wavesurfer?.current?.on("ready", () => {
        const duration = wavesurfer.current?.getDuration();
        let region;
        if (duration && duration <= 30) {
          region = { start: 0, end: duration };
        } else {
          region =
            userSubscription === "premium"
              ? { start: 0, end: duration }
              : { start: 0, end: 30 }; // Limit to 30 seconds for non-premium users
        }
        wavesurfer.current?.addRegion({
          ...region,
          loop: true,
          color: "rgba(59, 130, 246, 0.1)",
        });
        dispatch(setLoopRegion(region));
      });

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      };
    }
  }, [waveformRef, dispatch, userSubscription, audioFile]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      {uploadStatus}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Waveform display */}
      <div id="waveform" ref={waveformRef}></div>

      {/* Play/Pause button */}
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>

      {/* Upload button */}
      <button onClick={handleFileSubmit} disabled={loading || !audioFile}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Upload status */}
      <p>{uploadStatus}</p>
    </div>
  );
};

export default Waveform;
