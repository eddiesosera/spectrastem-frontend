import { configureStore } from "@reduxjs/toolkit";
import playbackReducer from "./slices/playback.slice";
import userReducer from "./slices/user.slice";
import audioReducer from "./slices/audio.slice";

const store = configureStore({
  reducer: {
    playback: playbackReducer,
    user: userReducer,
    audio: audioReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
