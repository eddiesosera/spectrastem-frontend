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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [waveformReady, setWaveformReady] = useState<boolean>(false); // Track waveform readiness
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userSubscription = useSelector(
    (state: RootState) => state.user.userDetails.accountType
  );
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFileSubmit = async () => {
    if (!uploadedFile) {
      setUploadStatus("No file selected for upload.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("process_stems", String(true));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/upload-audio`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (
        response.status === 200 &&
        response.data.message === "Processing completed successfully"
      ) {
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
          wavesurfer.current.load(e.target.result as string);
          setWaveformReady(false); // Set to false before loading to avoid premature display
        }
      };
      reader.readAsDataURL(audioFile);
    }

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
            dragSelection: { slop: 5 },
          }),
        ],
      });

      // Attach "ready" event handler
      wavesurfer.current.once("ready", () => {
        console.log("WaveSurfer 'ready' event fired."); // Debug log
        const duration = wavesurfer.current?.getDuration();
        let region;
        if (duration && duration <= 30) {
          region = { start: 0, end: duration };
        } else {
          region =
            userSubscription === "premium"
              ? { start: 0, end: duration }
              : { start: 0, end: 30 };
        }
        wavesurfer.current?.addRegion({
          ...region,
          loop: true,
          color: "rgba(59, 130, 246, 0.1)",
        });
        dispatch(setLoopRegion(region));
        setWaveformReady(true); // Ensure waveformReady is updated here
      });

      // Fallback: Set waveformReady to true after a delay if ready event doesn't fire
      setTimeout(() => {
        if (!waveformReady) {
          console.log("Waveform load fallback triggered.");
          setWaveformReady(true);
        }
      }, 3000); // 3 seconds fallback delay

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      };
    }
  }, [audioFile, dispatch, userSubscription]);

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

      {/* Loader */}
      {!waveformReady && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="loader"></div> {/* Add CSS for loader animation */}
          <p>Loading waveform...</p>
        </div>
      )}

      {/* Waveform display */}
      <div
        id="waveform"
        ref={waveformRef}
        style={{ display: waveformReady ? "block" : "none" }}
      ></div>

      {/* Play/Pause button */}
      <button onClick={handlePlayPause} disabled={!waveformReady}>
        {isPlaying ? "Pause" : "Play"}
      </button>

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
