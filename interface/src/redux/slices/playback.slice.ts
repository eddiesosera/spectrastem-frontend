import { createSlice } from "@reduxjs/toolkit";

interface PlaybackState {
  isPlaying: boolean;
  playbackRate: number;
  pitch: number;
}

const initialState: PlaybackState = {
  isPlaying: false,
  playbackRate: 1.0,
  pitch: 1.0,
};

const playbackSlice = createSlice({
  name: "playback",
  initialState,
  reducers: {
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    setPlaybackRate: (state, action) => {
      state.playbackRate = action.payload;
    },
    setPitch: (state, action) => {
      state.pitch = action.payload;
    },
  },
});

export const { play, pause, setPlaybackRate, setPitch } = playbackSlice.actions;
export default playbackSlice.reducer;
