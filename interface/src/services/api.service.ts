// src/services/serverApi.ts
import axios from "axios";
import { MidiResponse, StemsResponse } from "../interface/engine_responses";

const API_BASE_URL = process.env.API_BASE_URL;
console.log(API_BASE_URL);

export const extractStems = async (audioBlob: Blob): Promise<StemsResponse> => {
  const formData = new FormData();
  formData.append("audio", audioBlob);

  const response = await axios.post(`${API_BASE_URL}/extract-stems`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const generateMIDI = async (audioBlob: Blob): Promise<MidiResponse> => {
  const formData = new FormData();
  formData.append("audio", audioBlob);

  const response = await axios.post(`${API_BASE_URL}/generate-midi`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
