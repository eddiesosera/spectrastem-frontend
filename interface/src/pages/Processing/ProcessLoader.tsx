// ProcessLoader.tsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FileContext } from "../../context/file.context";
import { WaveSpinner } from "react-spinners-kit";
import { Button } from "../../components/Button/button";

const ProcessLoader: React.FC = () => {
  const { uploadStatus, error, setUploadStatus } = useContext(FileContext);
  const navigate = useNavigate();
  const [loaderColour, setLoaderColour] = useState<string>("#534BAF");

  useEffect(() => {
    if (uploadStatus === "Completed") {
      navigate("/process/results");
    } else if (uploadStatus === "Error") {
      // Stay on this page to show error message
    }
  }, [uploadStatus, navigate]);

  const handleCancel = () => {
    setUploadStatus("Idle");
    navigate("/");
  };

  return (
    <div className="flex flex-col flex-grow gap-8 w-full h-full items-center justify-center">
      {uploadStatus === "Error" ? (
        <div className="error-container text-center">
          <h2 className="text-2xl font-bold text-red-600">Processing Failed</h2>
          <p className="text-md text-gray-700 mt-2">
            {error || "An unexpected error occurred."}
          </p>
          <Button type="fill" onClick={handleCancel} className="mt-4">
            Retry
          </Button>
        </div>
      ) : (
        <>
          <WaveSpinner
            size={30}
            color={loaderColour}
            loading={
              uploadStatus === "Uploading" || uploadStatus === "Processing"
            }
          />
          <p>
            {uploadStatus === "Processing"
              ? "Processing audio..."
              : "Uploading audio..."}
          </p>
        </>
      )}
    </div>
  );
};

export default ProcessLoader;
