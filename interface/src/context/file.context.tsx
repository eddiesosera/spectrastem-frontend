// FileContext.tsx
import React, { createContext, useState } from "react";
import { ReactNode } from "react";

interface FileContextProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File) => void;
}

export const FileContext = createContext<FileContextProps>({
  uploadedFile: null,
  setUploadedFile: () => {},
});

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <FileContext.Provider value={{ uploadedFile, setUploadedFile }}>
      {children}
    </FileContext.Provider>
  );
};
