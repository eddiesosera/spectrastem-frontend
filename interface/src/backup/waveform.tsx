import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setLoopRegion } from "../../../redux/slices/audio.slice";
import "./waveform.css";

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
  const userSubscription = useSelector(
    (state: RootState) => state.user.userDetails.accountType
  );

  // Handle file upload from desktop
  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setUploadedFile(file);
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       if (wavesurfer.current && e.target?.result) {
  //         wavesurfer.current.load(e.target.result as string); // Load audio file into WaveSurfer
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // Function to handle audio file upload to the Spectrastem server
  const handleFileSubmit = async () => {
    if (!uploadedFile) {
      setUploadStatus("No file selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile); // Add the file to the form data

    try {
      setUploadStatus("Uploading...");
      const response = await fetch("http://localhost:5000/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json(); // Get response from server
        setUploadStatus("Upload successful!");
        console.log("Server response:", result); // Handle the server response
      } else {
        setUploadStatus("Upload failed.");
      }
    } catch (error) {
      setUploadStatus("Error occurred during upload.");
      console.error("Upload error:", error);
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
  }, [waveformRef, dispatch, userSubscription]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      {/* File upload input */}
      {/* <input type="file" accept="audio/*" onChange={handleFileUpload} /> */}

      {/* Waveform display */}
      <div id="waveform" ref={waveformRef}></div>

      {/* Play/Pause button */}
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>

      {/* Upload button */}
      <button onClick={handleFileSubmit}>Upload to Spectrastem Server</button>

      {/* Upload status */}
      <p>{uploadStatus}</p>
    </div>
  );
};

export default Waveform;
