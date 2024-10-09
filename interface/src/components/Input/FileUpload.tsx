// File: frontend/components/Input/FileUpload.tsx
import React, { useState } from "react";
import axios from "axios";
import FormatSelector from "./FormatSelector";
import { useNavigate } from "react-router-dom";

// interface FileUploadProps {
//   onUploadSuccess: (trackName: string) => void;
// }

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [format, setFormat] = useState<string>("mp3");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file size (limit to 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError("File exceeds the size limit of 50MB.");
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (
        response.status === 200 &&
        response.data.message === "Processing completed successfully"
      ) {
        // Navigate to the results page with the response data
        navigate("/results", { state: { data: response.data } });
        setError(null);
      } else {
        setError(response.data.error || "Unexpected response from the server.");
      }
    } catch (err) {
      setError("An error occurred during upload: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Your Audio</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".mp3,.wav,.flac,.ogg,.aac"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}

        <FormatSelector format={format} setFormat={setFormat} />

        <button type="submit" disabled={loading || !file}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
