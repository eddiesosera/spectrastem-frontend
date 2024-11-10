// audioAPI.ts
import axios from "axios";
import { MidiResponse, StemsResponse } from "../interface/engine_responses";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Unified API request for file processing
export const uploadAndProcessFile = async (
  audioBlob: Blob,
  options: {
    generateMIDI: boolean;
    processStems: boolean;
    stemsType: "all" | "vocals_instrumentals";
  }
): Promise<{ status: string; results?: MidiResponse | StemsResponse }> => {
  const formData = new FormData();
  formData.append("file", audioBlob);
  formData.append("generate_midi", options.generateMIDI.toString());
  formData.append("process_stems", options.processStems.toString());
  formData.append("stems_type", options.stemsType);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/upload-audio`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error during file processing:", error);
    throw new Error(
      error.response?.data?.message || "An unexpected error occurred."
    );
  }
};
