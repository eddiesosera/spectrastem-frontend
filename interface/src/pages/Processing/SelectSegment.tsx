// interface/pages/SelectSegment.tsx

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadAndProcessFile } from "../../services/api.service";
import { FileContext } from "../../context/file.context";
import { TimerContext } from "../../context/timer.context";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Button } from "../../components/Button/button";
import Dropdown from "../../components/Dropdown/dropdown";
import Wizard from "../../components/Feedback/Wizard/wizard";

const SelectSegment: React.FC = () => {
  const { uploadedFile, setUploadedFile, setUploadStatus, setError } =
    useContext(FileContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleGenerateMIDI = async () => {
    if (!uploadedFile) {
      setError("No file uploaded.");
      return;
    }

    setIsLoading(true);
    setUploadStatus("Uploading");
    try {
      const response = await uploadAndProcessFile(uploadedFile, {
        generateMIDI: true,
        processStems: false,
      });

      console.log("Upload Response:", response); // Debugging log

      if (response.status === "Uploaded") {
        const uniqueTrackName = response.track_name;
        setUploadStatus("Processing");

        // Navigate to ProcessLoader without setting remainingTime
        navigate("/process/processing-audio", {
          state: {
            trackName: uniqueTrackName,
            generateMIDI: true,
            processStems: false,
          },
        });
      } else {
        setError(response.message || "File processing failed.");
        setUploadStatus("Error");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
      setUploadStatus("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStemsOptionSelect = async (
    type: "all" | "vocals_instrumentals"
  ) => {
    if (!uploadedFile) {
      setError("No file uploaded.");
      return;
    }

    setIsLoading(true);
    setUploadStatus("Uploading");
    try {
      const response = await uploadAndProcessFile(uploadedFile, {
        generateMIDI: false,
        processStems: true,
        stemsType: type,
      });

      console.log("Upload Response:", response); // Debugging log

      if (response.status === "Uploaded") {
        const uniqueTrackName = response.track_name;
        setUploadStatus("Processing");

        // Navigate to ProcessLoader without setting remainingTime
        navigate("/process/processing-audio", {
          state: {
            trackName: uniqueTrackName,
            generateMIDI: false,
            processStems: true,
          },
        });
      } else {
        setError(response.message || "File processing failed.");
        setUploadStatus("Error");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
      setUploadStatus("Error");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Custom header for the Extract Stems dropdown.
   */
  const CustomDropdownHeader = () => (
    <div
      className={`flex items-center justify-between gap-2 px-4 py-2 bg-[#534BAF] hover:bg-[#934BAF] text-white rounded-lg cursor-pointer ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <span className="text-sm">Extract Stems</span>
      <ChevronDownIcon className="w-4 h-4" />
    </div>
  );

  /**
   * Rendered Generate MIDI button.
   */
  const GenerateMidiButton = () => (
    <Button
      type="fill"
      onClick={handleGenerateMIDI}
      disabled={isLoading}
      className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
    >
      Generate MIDI
    </Button>
  );

  /**
   * Rendered Extract Stems dropdown.
   */
  const ExtractStemsDropdown = () => (
    <Dropdown
      id="extractStemsDropdown"
      header={<CustomDropdownHeader />}
      items={[
        {
          label: "All Tracks",
          onClick: () => handleStemsOptionSelect("all"),
          disabled: isLoading,
        },
        {
          label: "Vocals & Instrumentals",
          onClick: () => handleStemsOptionSelect("vocals_instrumentals"),
          disabled: isLoading,
        },
      ]}
      alignTop
    />
  );

  return (
    <Wizard
      headerRightEl={null}
      footerEls={[
        <GenerateMidiButton key="generate-midi" />,
        <ExtractStemsDropdown key="extract-stems-dropdown" />,
      ]}
    >
      <div className="flex flex-col items-center justify-center h-full p-6">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          disabled={isLoading}
          className="mb-4"
        />
        {uploadedFile && (
          <p className="text-gray-700">Selected File: {uploadedFile.name}</p>
        )}
      </div>
    </Wizard>
  );
};

export default SelectSegment;
