// File: frontend/utils/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

// Upload audio file
export const uploadAudioFile = async (formData: FormData) => {
  return await axios.post(`${API_BASE_URL}/api/upload-audio`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Check file processing status
export const checkFileStatus = async (trackName: string) => {
  return await axios.get(`${API_BASE_URL}/api/status/${trackName}`);
};
