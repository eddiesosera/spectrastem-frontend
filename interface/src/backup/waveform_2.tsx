import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setLoopRegion } from "../../../redux/slices/audio.slice";
import "./waveform.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GooSpinner } from "react-spinners-kit";
import {
  ArrowPathRoundedSquareIcon,
  PauseIcon,
  PlayIcon,
  ScissorsIcon,
  StopIcon,
} from "@heroicons/react/24/solid";
import { RiSpeedUpFill } from "react-icons/ri";
import Dropdown from "../../Dropdown/dropdown";
import { DropdownHeader } from "../../Dropdown/dropdown_header";
import { IoCrop } from "react-icons/io5";
import { Button } from "../../Button/button";

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
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [currentSpeed, setCurrentSpeed] = useState<number>(1);
  const [isCropHover, setIsCropHover] = useState<boolean>(false);
  const navigate = useNavigate();
  const [segmentDuration, setSegmentDuration] = useState<number>(30); //30 second segment by default
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
        height: 100,
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
      console.log(audioFile);
    }
  };

  const speedOptions = [
    {
      label: "0.5x",
      value: 0.5,
      onClick: () => setCurrentSpeed(0.5),
    },
    {
      label: "1x (Normal)",
      value: 1,
      onClick: () => setCurrentSpeed(1),
    },
    {
      label: "1.5x",
      value: 1.5,
      onClick: () => setCurrentSpeed(1.5),
    },
  ];

  const cropAudio = () => {
    // Crops audio to selected segment and replaces the audio file in the audio file state in the global file context which should trigger a re-render.
  };

  return (
    <div className="flex flex-col flex-grow gap-8 w-full h-full items-center justify-center">
      {error && <p style={{ color: "red" }}>{error}</p>}

      {waveformReady && <div className="text-sm">{audioFile?.name}</div>}

      {/* Loader */}
      {!waveformReady && (
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col items-center justify-center">
            <GooSpinner size={30} color="#534BAF" loading={!waveformReady} />
            <p className="text-base">Loading audio...</p>
          </div>
          <Button type="danger" onClick={() => alert("cropping audio")}>
            Cancel
          </Button>
        </div>
      )}

      <div
        className="w-full h-fit p-2 py-4 border rounded-lg bg-[#FAFAFA]"
        style={{ display: waveformReady ? "block" : "none" }}
      >
        <div
          id="waveform"
          ref={waveformRef}
          style={{ display: waveformReady ? "block" : "none" }}
        ></div>
      </div>

      <div className="waveform-controls flex flex-row items-center justify-center gap-8">
        {waveformReady && (
          <div className="flex flex-row gap-2 border p-2 px-4 rounded-full">
            {/* Play/Pause button */}

            <div onClick={handlePlayPause}>
              {isPlaying ? (
                <PauseIcon className="size-6 cursor-pointer" />
              ) : (
                <PlayIcon className="size-6 cursor-pointer" />
              )}
            </div>

            {/* Stop/Restart button */}
            {waveformReady && (
              <div onClick={handlePlayPause}>
                <StopIcon className="size-6 cursor-pointer" />
              </div>
            )}
          </div>
        )}

        {waveformReady && (
          <div className="w-[137px]">
            <Dropdown
              id="waveform-speed"
              header={
                <DropdownHeader
                  label={
                    <div className="flex flex-row items-center justify-center gap-1">
                      <RiSpeedUpFill className="size-6" />
                      <div>Speed ({currentSpeed}x)</div>
                    </div>
                  }
                  dropdownId="waveform-speed"
                />
              }
              items={speedOptions}
            />
          </div>
        )}

        <div className="flex flex-row gap-2">
          {waveformReady && (
            <div
              className={`flex flex-row items-center justify-center gap-1 radius p-2 rounded-md cursor-pointer hover:border-[#DDDDDD]
            ${isLooping ? "border border-[#AAAAAA]" : "border border-white"}`}
              onClick={() => setIsLooping(!isLooping)}
            >
              <ArrowPathRoundedSquareIcon className="size-6 cursor-pointer" />
              <div className="text-xs">Loop</div>
            </div>
          )}

          {waveformReady && (
            <Button type="outline" onClick={() => cropAudio()}>
              <IoCrop className="size-6 cursor-pointer" />{" "}
              <div className="text-xs">Crop</div>
            </Button>
          )}
        </div>

        {/* Upload status */}
        <p>{uploadStatus}</p>
      </div>
    </div>
  );
};

export default Waveform;
