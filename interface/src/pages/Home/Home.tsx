import React, { useEffect, useState } from "react";
import Waveform from "../../components/Input/Waveform/waveform";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import FileUpload from "./../../components/Input/FileUpload";
import Dropzone, {
  IDropzoneProps,
  ILayoutProps,
  IPreviewProps,
} from "react-dropzone-uploader";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { io } from "socket.io-client";
import { steps } from "../Processing/steps";
import Wizard from "../../components/Feedback/Wizard/wizard";

const Home: React.FC = () => {
  const userSubscription = useSelector(
    (state: RootState) => state.user.userDetails.accountType
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Access the environment variable using import.meta.env.VITE_API_BASE_URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const formatBytes = (bytes: number) => `${(bytes / 1024)?.toFixed(2)} KB`;
  const formatDuration = (duration: number) =>
    `${duration?.toFixed(2)} seconds`;

  const getUploadParams: IDropzoneProps["getUploadParams"] = () => {
    return { url: `${API_BASE_URL}/api/upload-audio` };
  };

  const handleChangeStatus: IDropzoneProps["onChangeStatus"] = (
    { meta, file },
    status
  ) => {
    console.log(status, meta, file);
    setUploadedFile(file);
  };

  const handleSubmit: IDropzoneProps["onSubmit"] = (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
  };

  // Custom Input Component
  const CustomInputContent: React.FC = () => (
    <div className="flex flex-col g-4 justify-centre wrap">
      <div>
        <ArrowUpIcon className="size-6" />
      </div>
      <p>Upload Track</p>
      <p>Only mp3, wav, flac, ogg, aac</p>
    </div>
  );

  // Custom Layout Component
  const CustomLayout: React.FC<ILayoutProps> = ({
    input,
    previews,
    dropzoneProps,
  }) => (
    <div
      {...dropzoneProps}
      className="flex-grow flex"
      style={{
        border: "1px dashed #DDDCE5",
        padding: "20px",
        background: "linear-gradient(90deg, #C7C0FF 0%, #FFE8F7 100%)",
        overflow: "hidden",
      }}
      key={1}
    >
      {previews}
      {!uploadedFile && <div key={1}>{input}</div>}
    </div>
  );

  const Preview: React.FC<IPreviewProps> = ({
    className,
    meta: {
      name = "",
      percent = 0,
      size = 0,
      previewUrl,
      status,
      duration,
      validationError,
    },
    canRemove,
    remove,
    file,
    extra: { minSizeBytes },
  }) => {
    const title = `${name || "?"}, ${formatBytes(size)}, ${formatDuration(
      duration
    )}`;

    return (
      <div key={1} className="flex flex-grow">
        <Wizard steps={steps} />
      </div>
      // <div className={className}>
      //   <Waveform audioFile={uploadedFile} />
      //   <span>{title}</span>
      //   {status === "error_file_size" && (
      //     <span>{size < minSizeBytes ? "File too small" : "File too big"}</span>
      //   )}
      //   {status === "error_validation" && (
      //     <span>{String(validationError)}</span>
      //   )}
      //   {canRemove && <button onClick={remove}>Remove</button>}
      // </div>
    );
  };

  useEffect(() => {}, [uploadedFile]);

  useEffect(() => {
    // Initialize socket without namespace
    const socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("status", (data: any) => {
      console.log(`[${data.level.toUpperCase()}] ${data.message}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-grow flex-col h-full">
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        accept="audio/*"
        inputContent={<CustomInputContent />}
        PreviewComponent={Preview}
        LayoutComponent={CustomLayout}
        key={1}
        multiple={false}
        maxFiles={1}
      />
      {/* Account type: {userSubscription} */}
    </div>
  );
};

export default Home;
