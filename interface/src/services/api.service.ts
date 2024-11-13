// interface/services/api.service.ts

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the expected response structure from the upload endpoint
interface UploadResponse {
  status: string;
  track_name: string;
  generate_midi: boolean;
  process_stems: boolean;
  results?: {
    stems?: { [key: string]: string };
    midi_files?: { [key: string]: string };
  };
  message?: string;
}

// Unified API request for file processing
export const uploadAndProcessFile = async (
  audioBlob: Blob,
  options: {
    generateMIDI: boolean;
    processStems: boolean;
    stemsType?: "all" | "vocals_instrumentals";
  }
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", audioBlob);
  formData.append("generate_midi", options.generateMIDI.toString());
  formData.append("process_stems", options.processStems.toString());
  if (options.stemsType) {
    formData.append("stems_type", options.stemsType);
  }

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

// Define the expected response structure from the status endpoint
interface StatusResponse {
  status: string;
  results?: {
    stems?: { [key: string]: string };
    midi_files?: { [key: string]: string };
  };
  message?: string;
}

// Check processing status
export const checkProcessingStatus = async (
  trackName: string
): Promise<StatusResponse> => {
  try {
    const encodedTrackName = encodeURIComponent(trackName);
    const response = await fetch(
      `${API_BASE_URL}/api/status/${encodedTrackName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch status.");
    }

    const data: StatusResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error;
  }
};
