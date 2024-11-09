// Home.tsx
import React, { useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { FileContext } from "../../context/file.context";
// import { setCurrentAudio } from "../../redux/actions/audioActions";

const Home: React.FC = () => {
  const { setUploadedFile } = useContext(FileContext);
  const navigate = useNavigate();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log("Files dropped:", acceptedFiles);
      setUploadedFile(acceptedFiles[0]);
      navigate("/process/select-segment");
    },
    [setUploadedFile, navigate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: "audio/*",
    multiple: false,
  });

  return (
    <div className="flex flex-grow flex-col h-full dropzone-wrapper">
      <div
        {...getRootProps()}
        className="flex-grow flex items-center"
        style={{
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
