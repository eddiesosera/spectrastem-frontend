import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import Wizard from "../../components/Feedback/Wizard/wizard";
import { steps } from "../Processing/steps";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles);
    setUploadedFile(acceptedFiles[0]);
    navigate("/process/select-segment");
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: "audio/*",
    multiple: false,
    // Disable the dropzone when a file is uploaded
    disabled: uploadedFile !== null,
  });

  return (
    <div className="flex flex-grow flex-col h-full dropzone-wrapper">
      {!uploadedFile ? (
        // Render the dropzone when there's no uploaded file
        <div
          {...getRootProps()}
          className="flex-grow flex items-center"
          style={{
            // border: "1px dashed #DDDCE5",
            padding: "20px",
            background: isDragActive
              ? "linear-gradient(90deg, #DAF7F2 0%, #FCFFE8 100%)"
              : "linear-gradient(90deg, #C7C0FF 0%, #FFE8F7 100%)",
            overflow: "hidden",
          }}
        >
          <input {...getInputProps()} />
          <CustomInputContent />
        </div>
      ) : (
        // Render the Wizard component without the dropzone's event handlers
        <div
          className="flex-grow flex items-center"
          style={{
            border: "1px dashed #DDDCE5",
            padding: "20px",
            background: "linear-gradient(90deg, #C7C0FF 0%, #FFE8F7 100%)",
            overflow: "hidden",
          }}
        >
          <Wizard steps={steps} />
        </div>
      )}
    </div>
  );
};

const CustomInputContent: React.FC = () => (
  <div className="flex flex-col g-4 justify-center wrap gap-5 items-center w-full cursor-pointer">
    <div className="rounded-full bg-white p-5 w-fit">
      <ArrowUpTrayIcon
        fontWeight={700}
        className="size-6 text-[#14181F] font-extrabold"
      />
    </div>
    <div className="flex flex-col gap-5 items-center">
      <p className="text-2xl size-6 font-bold text-[#14181F] w-fit">
        Upload Audio to Start
      </p>
      <div className="flex flex-col gap-[0.25px] items-center">
        <p className="text-sm size-6 text-[#14181F] w-fit">
          Drag 'n Drop or Click to select files.
        </p>
        <p className="text-sm size-6 text-[#69677F] w-fit">
          Only mp3, wav, flac, ogg, aac
        </p>
      </div>
    </div>
  </div>
);

export default Home;
