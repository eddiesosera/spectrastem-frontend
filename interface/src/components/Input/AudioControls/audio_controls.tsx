// src/components/AudioControls/AudioControls.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { play, pause } from "../../../redux/slices/playback.slice";
import WaveSurfer from "wavesurfer.js";

const AudioControls: React.FC<{ wavesurfer: WaveSurfer | null }> = ({
  wavesurfer,
}) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state: RootState) => state.playback.isPlaying);

  const handlePlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
      dispatch(isPlaying ? pause() : play());
    }
  };

  const handleRestart = () => {
    if (wavesurfer) {
      const regions = wavesurfer.regions.list;
      const activeRegion = Object.values(regions)[0];
      if (activeRegion) {
        wavesurfer.seekTo(activeRegion.start / wavesurfer.getDuration());
        wavesurfer.play();
        dispatch(play());
      }
    }
  };

  return (
    <div className="audio-controls">
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={handleRestart}>Restart</button>
    </div>
  );
};

export default AudioControls;
