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
import { WaveSpinner } from "react-spinners-kit";
import Waveform from "../../components/Input/Waveform/waveform";

const SelectSegment: React.FC = () => {
  const { uploadedFile, setUploadedFile, setUploadStatus, setError } =
    useContext(FileContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handles file upload from the input.
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  /**
   * Handles the Generate MIDI action.
   */
  const handleGenerateMIDI = async () => {
    if (!uploadedFile) {
      setError("No file uploaded.");
      return;
    }

    setIsLoading(true);
    setUploadStatus("Uploading");
    console.log("Upload started");

    try {
      // Initiate the upload and processing
      const response = await uploadAndProcessFile(uploadedFile, {
        generateMIDI: true,
        processStems: false,
      });

      console.log("Upload response:", response); // Debugging log

      if (response.status === "Uploaded") {
        const uniqueTrackName = response.track_name;
        setUploadStatus("Processing");

        // Navigate to Process Loader Page
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
      setError(
        error.message || "An unexpected error occurred during MIDI generation."
      );
      setUploadStatus("Error");
    } finally {
      setIsLoading(false);
      console.log("Upload ended");
    }
  };

  /**
   * Handles the Extract Stems option selection.
   * @param type Type of stem separation.
   */
  const handleStemsOptionSelect = async (
    type: "all" | "vocals_instrumentals"
  ) => {
    if (!uploadedFile) {
      setError("No file uploaded.");
      return;
    }

    setIsLoading(true);
    setUploadStatus("Uploading");
    console.log("Stems upload started");

    try {
      // Initiate the upload and processing
      const response = await uploadAndProcessFile(uploadedFile, {
        generateMIDI: false,
        processStems: true,
        stemsType: type,
      });

      console.log("Stems upload response:", response); // Debugging log

      if (response.status === "Uploaded") {
        const uniqueTrackName = response.track_name;
        setUploadStatus("Processing");

        // Navigate to Process Loader Page
        navigate("/process/processing-audio", {
          state: {
            trackName: uniqueTrackName,
            generateMIDI: false,
            processStems: true,
          },
        });
      } else {
        throw new Error(response.message || "File processing failed.");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
      setUploadStatus("Error");
    } finally {
      setIsLoading(false);
      console.log("Stems upload ended");
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
      {isLoading ? (
        // Show loader and uploading text
        <div className="flex flex-col items-center justify-center gap-4">
          <WaveSpinner className="size-6" size={30} color="#534BAF" />
          <p className="text-lg text-gray-700">Uploading...</p>
        </div>
      ) : (
        // Show waveform and file selection when not loading
        <div className="flex flex-col items-center justify-center h-full p-6">
          {uploadedFile && <Waveform audioFile={uploadedFile} />}
        </div>
      )}
    </Wizard>
  );
};

/**
 * Retrieves the current upload speed.
 * Implement this function to calculate actual upload speed if desired.
 * For simplicity, it returns undefined to exclude upload time from estimation.
 * @returns Upload speed in KB/s or undefined.
 */
const getUploadSpeed = (): number | undefined => {
  // Implement logic to measure upload speed if needed
  // This could involve tracking upload progress and calculating speed
  // For now, return undefined to exclude upload time
  return undefined;
};

export default SelectSegment;
