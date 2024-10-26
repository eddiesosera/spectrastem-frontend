import React, { useEffect } from "react";
import Waveform from "../../components/Input/Waveform/waveform";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import FileUpload from "./../../components/Input/FileUpload";
import Dropzone, {
  IDropzoneProps,
  ILayoutProps,
  IPreviewProps,
} from "react-dropzone-uploader";

const Home: React.FC = () => {
  const userSubscription = useSelector(
    (state: RootState) => state.user.userDetails.accountType
  );

  // Access the environment variable using import.meta.env.VITE_API_BASE_URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    console.log("API_BASE_URL:", API_BASE_URL);
  }, []);

  const formatBytes = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`;
  const formatDuration = (duration: number) => `${duration.toFixed(2)} seconds`;

  const getUploadParams: IDropzoneProps["getUploadParams"] = () => {
    return { url: "https://httpbin.org/post" };
  };

  const handleChangeStatus: IDropzoneProps["onChangeStatus"] = (
    { meta, file },
    status
  ) => {
    console.log(status, meta, file);
  };

  const handleSubmit: IDropzoneProps["onSubmit"] = (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
  };

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
    extra: { minSizeBytes },
  }) => {
    let title = `${name || "?"}, ${formatBytes(size)}`;
    if (duration) title = `${title}, ${formatDuration(duration)}`;

    return (
      <div className={className}>
        <span>{title}</span>
        {status === "error_file_size" && (
          <span>{size < minSizeBytes ? "File too small" : "File too big"}</span>
        )}
        {status === "error_validation" && (
          <span>{String(validationError)}</span>
        )}
        {canRemove && <button onClick={remove}>Remove</button>}
      </div>
    );
  };

  return (
    <div>
      <div className="p-4">Home</div>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        accept="image/*,audio/*,video/*"
        inputContent="Drop Files Here"
        PreviewComponent={Preview}
      />
      <Waveform />
      Account type: {userSubscription}
    </div>
  );
};

export default Home;
