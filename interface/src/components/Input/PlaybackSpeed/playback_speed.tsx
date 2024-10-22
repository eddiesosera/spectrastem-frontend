import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPlaybackRate } from "../../../redux/slices/playback.slice";
import { RootState } from "../../../redux/store";
import WaveSurfer from "wavesurfer.js";

const PlaybackSpeed: React.FC<{ wavesurfer: WaveSurfer | null }> = ({
  wavesurfer,
}) => {
  const dispatch = useDispatch();
  const playbackRate = useSelector(
    (state: RootState) => state.playback.playbackRate
  );

  const handleSpeedChange = (rate: number) => {
    dispatch(setPlaybackRate(rate));
    if (wavesurfer) {
      wavesurfer.setPlaybackRate(rate);
      // Pitch adjustment can be handled via Web Audio API if necessary
    }
  };

  return (
    <div className="playback-speed">
      <label>Speed:</label>
      <select
        value={playbackRate}
        onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
      >
        <option value={0.5}>0.5x</option>
        <option value={0.75}>0.75x</option>
        <option value={1}>1x</option>
        <option value={1.5}>1.5x</option>
        <option value={2}>2x</option>
      </select>
    </div>
  );
};

export default PlaybackSpeed;
