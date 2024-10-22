import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoopRegion {
  start: number;
  end: number;
}

interface ExtractedSegment {
  id: string;
  start: number;
  end: number;
  blob: Blob;
  url: string;
}

interface AudioState {
  currentAudio: string | null; // URL or Blob URL
  loopRegion: LoopRegion;
  extractedSegments: ExtractedSegment[];
}

const initialState: AudioState = {
  currentAudio: null,
  loopRegion: { start: 0, end: 30 }, // Default to first 30 seconds
  extractedSegments: [],
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setCurrentAudio(state, action: PayloadAction<string>) {
      state.currentAudio = action.payload;
      // Reset loop region when a new audio is loaded
      state.loopRegion = { start: 0, end: 30 };
      state.extractedSegments = [];
    },
    setLoopRegion(state, action: PayloadAction<LoopRegion>) {
      state.loopRegion = action.payload;
    },
    addExtractedSegment(state, action: PayloadAction<ExtractedSegment>) {
      state.extractedSegments.push(action.payload);
    },
    replaceCurrentAudio(state, action: PayloadAction<string>) {
      state.currentAudio = action.payload;
      // Reset loop region or maintain it based on requirements
    },
    clearAudioState(state) {
      state.currentAudio = null;
      state.loopRegion = { start: 0, end: 30 };
      state.extractedSegments = [];
    },
  },
});

export const {
  setCurrentAudio,
  setLoopRegion,
  addExtractedSegment,
  replaceCurrentAudio,
  clearAudioState,
} = audioSlice.actions;

export default audioSlice.reducer;
