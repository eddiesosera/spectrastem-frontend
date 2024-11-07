import { configureStore } from "@reduxjs/toolkit";
import playbackReducer from "./slices/playback.slice";
import userReducer from "./slices/user.slice";
import audioReducer from "./slices/audio.slice";
import wizardReducer from "./slices/wizard.slice";
// import { wizardReducer } from "./slices/wizard.slice";

const store = configureStore({
  reducer: {
    playback: playbackReducer,
    user: userReducer,
    audio: audioReducer,
    wizard: wizardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
