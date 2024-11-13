// interface/context/FileContext.tsx

import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import {
  uploadAndProcessFile,
  checkProcessingStatus,
} from "../services/api.service";

type UploadStatus = "Idle" | "Uploading" | "Processing" | "Completed" | "Error";

interface MidiResults {
  message: string;
  midi_files: { [key: string]: string };
}

interface StemsResults {
  [key: string]: string;
}

interface ProcessingResults {
  stems?: StemsResults;
  midi?: MidiResults;
  trackName?: string;
  status?: string;
}

type ResultData = ProcessingResults | null;

interface FileContextProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File) => void;
  uploadStatus: UploadStatus;
  setUploadStatus: Dispatch<SetStateAction<UploadStatus>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  result: ResultData;
  setResult: Dispatch<SetStateAction<ResultData>>;
  fetchResult: (method: string, trackName: string) => Promise<ResultData>;
}

export const FileContext = createContext<FileContextProps>({
  uploadedFile: null,
  setUploadedFile: () => {},
  uploadStatus: "Idle",
  setUploadStatus: () => {},
  error: null,
  setError: () => {},
  result: null,
  setResult: () => {},
  fetchResult: async () => null,
});

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("Idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData>(null);

  const fetchResult = async (
    method: string,
    trackName: string
  ): Promise<ResultData> => {
    try {
      const status = await checkProcessingStatus(trackName);
      console.log("Processing Status:", status); // Debugging log

      if (status.status === "Completed") {
        let processedResults: ProcessingResults = {
          status: status.status,
          trackName: trackName,
        };
        if (method === "midi" && status.results?.midi?.midi_files) {
          processedResults.midi = {
            message: status.results.midi.message,
            midi_files: status.results.midi.midi_files,
          };
        }
        if (method === "stems" && status.results?.stems) {
          processedResults.stems = status.results.stems;
        }

        setResult(processedResults);
        return processedResults;
      } else if (status.status === "Error") {
        throw new Error(status.message || "Processing failed.");
      } else {
        // Still processing
        return null;
      }
    } catch (err: any) {
      console.error("Error fetching results:", err);
      throw new Error(err.message || "Failed to fetch the processed file.");
    }
  };

  return (
    <FileContext.Provider
      value={{
        uploadedFile,
        setUploadedFile,
        uploadStatus,
        setUploadStatus,
        error,
        setError,
        result,
        setResult,
        fetchResult,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
