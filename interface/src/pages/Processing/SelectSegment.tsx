// SelectSegment.tsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileContext } from "../../context/file.context";
// import { uploadAndProcessFile } from "../../api/audioAPI";
import Wizard from "../../components/Feedback/Wizard/wizard";
import Waveform from "../../components/Input/Waveform/waveform";
import { Button } from "../../components/Button/button";
import Dropdown from "../../components/Dropdown/dropdown";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"; // For the dropdown icon
import { uploadAndProcessFile } from "../../services/api.service";

const SelectSegment: React.FC = () => {
  const { uploadedFile, setUploadStatus, setError, setResult } =
    useContext(FileContext);
  const navigate = useNavigate();
  const [processingOptions, setProcessingOptions] = React.useState({
    generateMIDI: false,
    processStems: true,
    stemsType: "all" as "all" | "vocals_instrumentals",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!uploadedFile) {
      navigate("/");
    }
  }, [uploadedFile, navigate]);

  if (!uploadedFile) {
    return null;
  }

  const handleGenerateMIDI = async () => {
    setUploadStatus("Uploading");
    navigate("/process/processing-audio");

    try {
      const result = await uploadAndProcessFile(
        uploadedFile,
        processingOptions
      );
      if (result.status === "Completed") {
        setResult(result.results);
        setUploadStatus("Completed");
      } else {
        throw new Error(result.message || "File processing failed.");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
      setUploadStatus("Error");
    }
  };

  const handleStemsOptionSelect = async (
    type: "all" | "vocals_instrumentals"
  ) => {
    setProcessingOptions((prevOptions) => ({
      ...prevOptions,
      stemsType: type,
    }));
    setUploadStatus("Uploading");
    navigate("/process/processing-audio");

    try {
      const result = await uploadAndProcessFile(uploadedFile, {
        ...processingOptions,
        stemsType: type,
      });
      if (result.status === "Completed") {
        setResult(result.results);
        setUploadStatus("Completed");
      } else {
        throw new Error(result.message || "File processing failed.");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
      setUploadStatus("Error");
    }
  };

  // Custom-styled DropdownHeader for SelectSegment
  const CustomDropdownHeader = () => (
    <div
      className="flex items-center justify-between gap-2 px-4 py-2 bg-[#534BAF] hover:bg-[#934BAF] text-white rounded-lg cursor-pointer hover:bg-purple-700"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <span className="text-sm">Extract Stems</span>
      {isDropdownOpen ? (
        <ChevronUpIcon className="w-4 h-4" />
      ) : (
        <ChevronDownIcon className="w-4 h-4" />
      )}
    </div>
  );

  const GenerateMidiButton = () => (
    <Button type="fill" onClick={handleGenerateMIDI}>
      Generate MIDI
    </Button>
  );

  const ExtractStemsDropdown = () => (
    <Dropdown
      id="extractStemsDropdown"
      header={<CustomDropdownHeader />}
      items={[
        { label: "All Tracks", onClick: () => handleStemsOptionSelect("all") },
        {
          label: "Vocals & Instrumentals",
          onClick: () => handleStemsOptionSelect("vocals_instrumentals"),
        },
      ]}
      alignTop
    />
  );

  return (
    <Wizard
      headerRightEl={null}
      footerEls={[<GenerateMidiButton />, <ExtractStemsDropdown />]}
    >
      <div>
        <Waveform audioFile={uploadedFile} />
      </div>
    </Wizard>
  );
};

export default SelectSegment;
