// src/components/Input/Waveform/waveform.tsx

import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js"; // Correct import for v6.x
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setLoopRegion } from "../../../redux/slices/audio.slice";
import "./waveform.css"; // Ensure your styles are updated accordingly
import { useNavigate } from "react-router-dom";
import { GooSpinner } from "react-spinners-kit";
import {
  ArrowPathRoundedSquareIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/solid";
import { RiSpeedUpFill } from "react-icons/ri";
import Dropdown from "../../Dropdown/dropdown";
import { DropdownHeader } from "../../Dropdown/dropdown_header";
import { IoCrop } from "react-icons/io5";
import { Button } from "../../Button/button";

interface WaveformPreview {
  audioFile: File | null;
}

const Waveform: React.FC<WaveformPreview> = ({ audioFile }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformReady, setWaveformReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [currentSpeed, setCurrentSpeed] = useState<number>(1);
  const [loopRegion, setLoopRegion] = useState<any>(null); // Track the loop region
  const navigate = useNavigate();
  const userSubscription = useSelector(
    (state: RootState) => state.user.userDetails.accountType
  );

  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer with Regions Plugin
    wavesurferRef.current = WaveSurfer.create({
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

    const wavesurfer = wavesurferRef.current;

    // Load audio file
    if (audioFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && wavesurfer) {
          wavesurfer.load(e.target.result as string);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading audio file:", error);
        setError("Failed to load audio file.");
        setWaveformReady(false);
      };
      reader.readAsDataURL(audioFile);
    }

    // Event handler when WaveSurfer is ready
    const handleReady = () => {
      setWaveformReady(true);
      const duration = wavesurfer.getDuration();

      // Define region data based on subscription and duration
      let regionData;
      if (duration <= 30) {
        regionData = { start: 0, end: duration };
      } else {
        regionData =
          userSubscription === "premium"
            ? { start: 0, end: duration }
            : { start: 0, end: 30 };
      }

      // Add the looping region
      const newRegion = wavesurfer.addRegion({
        ...regionData,
        loop: isLooping,
        id: "loop-region",
        color: "rgba(59, 130, 246, 0.5)",
        drag: true,
        resize: true,
      });

      setLoopRegion(newRegion);
      dispatch(setLoopRegion(regionData));
    };

    // Event handler when a region is updated
    const handleRegionUpdateEnd = (region: any) => {
      if (region.id === "loop-region") {
        dispatch(setLoopRegion({ start: region.start, end: region.end }));
        console.log("Loop region updated:", region.start, region.end);
      }
    };

    // Event handler when playback leaves a region
    const handleRegionOut = (region: any) => {
      if (region.id === "loop-region" && isLooping) {
        console.log("Looping region:", region.id);
        region.play();
      }
    };

    // Attach event listeners
    wavesurfer.on("ready", handleReady);
    wavesurfer.on("region-update-end", handleRegionUpdateEnd);
    wavesurfer.on("region-out", handleRegionOut);

    // Cleanup on unmount
    return () => {
      wavesurfer.un("ready", handleReady);
      wavesurfer.un("region-update-end", handleRegionUpdateEnd);
      wavesurfer.un("region-out", handleRegionOut);
      wavesurfer.destroy();
    };
  }, [audioFile, dispatch, isLooping, userSubscription]);

  // Update playback rate when currentSpeed changes
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(currentSpeed);
    }
  }, [currentSpeed]);

  // Update looping when isLooping changes
  useEffect(() => {
    if (loopRegion) {
      loopRegion.update({ loop: isLooping });
      console.log("Looping updated:", isLooping);
    }
  }, [isLooping, loopRegion]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      setIsPlaying(false);
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
    // Implement cropping functionality
    alert("Crop functionality is not implemented yet.");
  };

  return (
    <div className="flex flex-col flex-grow gap-8 w-full h-full items-center justify-center">
      {error && <p style={{ color: "red" }}>{error}</p>}

      {waveformReady && <div className="text-sm">{audioFile?.name}</div>}

      {/* Loader */}
      {!waveformReady && (
        <div className="flex flex-col items-center justify-center gap-8 select-none">
          <div className="flex flex-col items-center justify-center">
            <GooSpinner size={30} color="#534BAF" loading={!waveformReady} />
            <p className="text-base">Loading audio...</p>
          </div>
          <Button type="danger" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </div>
      )}

      {/* Waveform */}
      <div
        className="w-full h-fit p-2 py-4 border rounded-lg bg-[#FAFAFA]"
        style={{ display: waveformReady ? "block" : "none" }}
      >
        <div
          id="waveform"
          ref={waveformRef}
          style={{ width: "100%", height: "100px" }}
        ></div>
      </div>

      <div className="flex items-center text-sm text-gray-500">
        Crop your file in a DAW. Cropping feature in progress.
      </div>

      {/* Controls */}
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
            <div onClick={handleStop}>
              <StopIcon className="size-6 cursor-pointer" />
            </div>
          </div>
        )}

        {waveformReady && (
          <div className="w-fit">
            <Dropdown
              id="waveform-speed"
              header={
                <DropdownHeader
                  label={
                    <div className="flex flex-row w-auto items-center justify-center gap-1">
                      <RiSpeedUpFill className="size-6" />
                      <div className="flex flex-row w-[70px]">
                        {`Speed ${currentSpeed}x`}
                      </div>
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
                  ${
                    isLooping
                      ? "border border-[#AAAAAA]"
                      : "border border-white"
                  }`}
              onClick={() => setIsLooping(!isLooping)}
            >
              <ArrowPathRoundedSquareIcon className="size-6 cursor-pointer" />
              <div className="text-xs">Loop</div>
            </div>
          )}

          {waveformReady && (
            <Button type="outline" onClick={cropAudio}>
              <IoCrop className="size-6 cursor-pointer" />{" "}
              <div className="text-xs">Crop</div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Waveform;
