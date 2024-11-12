// interface/context/FileContext.tsx

import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type UploadStatus = "Idle" | "Uploading" | "Processing" | "Completed" | "Error";

interface MidiResults {
  message: string;
  midi_files: { [key: string]: string };
}

interface ProcessingResults {
  stems?: { [key: string]: string };
  midi?: MidiResults;
  message?: string;
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
});

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("Idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData>(null);

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
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
