// AudioPlayer.tsx
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { IoDownload, IoVolumeHigh, IoVolumeOff } from "react-icons/io5";
import { RiDownloadLine } from "react-icons/ri";
import WaveSurfer from "wavesurfer.js";

interface AudioPlayerProps {
  audioSrc: string;
  fileName: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc, fileName }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#cbc6d7",
        progressColor: "#57398e",
        cursorColor: "#212121",
        cursorWidth: 2,
        barWidth: 3,
        barGap: 1,
        barRadius: 30,
        height: 30,
        responsive: true,
        normalize: true,
        volume: 1, // Set initial volume to 1 (not muted)
      });

      waveSurferRef?.current?.load(audioSrc);

      // Cleanup on component unmount
      return () => {
        waveSurferRef.current?.destroy();
      };
    }
  }, [audioSrc]);

  const handlePlayPause = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (waveSurferRef.current) {
      if (isMuted) {
        waveSurferRef.current.setVolume(1); // Unmute by setting volume to 1
      } else {
        waveSurferRef.current.setVolume(0); // Mute by setting volume to 0
      }
      setIsMuted(!isMuted); // Toggle mute state
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(audioSrc);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "audio-file"; // Specify the download file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the object URL to free up memory
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md">
      <div className="flex flex-row justify-center items-center items-center space-x-4 mb-4">
        {/* Play/Pause button */}
        <button
          onClick={handlePlayPause}
          className="bg-gray-800 text-white p-2 rounded-full focus:outline-none hover:bg-gray-700"
        >
          {isPlaying ? (
            <PauseIcon className="h-6 w-6" />
          ) : (
            <PlayIcon className="h-6 w-6" />
          )}
        </button>

        {/* Mute button */}
        <button
          onClick={handleMute}
          className="bg-gray-800 text-white p-2 rounded-full focus:outline-none hover:bg-gray-700"
        >
          {isMuted ? (
            <IoVolumeOff className="h-6 w-6" />
          ) : (
            <IoVolumeHigh className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Waveform container */}
      <div ref={waveformRef} className="w-full h-12 mb-4"></div>

      {/* Track details and download */}
      <div className="flex items-center justify-between">
        <span className="text-gray-600 font-semibold">{fileName}</span>
        <button
          onClick={handleDownload}
          className="text-gray-500 hover:text-gray-700 flex items-center space-x-2"
        >
          <span>Download</span>
          <RiDownloadLine className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
