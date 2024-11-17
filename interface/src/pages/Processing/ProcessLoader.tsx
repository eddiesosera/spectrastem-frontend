// interface/pages/Processing/ProcessLoaderPage.tsx

import React, { useEffect, useContext, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import Wizard from "../../components/Feedback/Wizard/Wizard";
// import { FileContext } from "../../context/FileContext";
// import { TimerContext } from "../../context/TimerContext";
import { WaveSpinner } from "react-spinners-kit";
import { TimerContext } from "../../context/timer.context";
import { FileContext } from "../../context/file.context";
import Wizard from "../../components/Feedback/Wizard/wizard";
import { checkProcessingStatus } from "../../services/api.service";

interface LocationState {
  trackName: string;
  generateMIDI: boolean;
  processStems: boolean;
}

const ProcessLoaderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackName, generateMIDI, processStems } = (location.state ||
    {}) as LocationState;
  const { setUploadStatus, setError } = useContext(FileContext);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!trackName) {
      // If no trackName is provided, navigate back to select segment
      console.error("No trackName provided in navigation state.");
      navigate("/process/select-segment");
      return;
    }

    const fetchStatus = async () => {
      try {
        console.log(`Checking status for track: ${trackName}`);
        const status = await checkProcessingStatus(trackName);
        console.log("Received status:", status);

        if (status.status === "Completed") {
          console.log("Processing completed.");
          setUploadStatus("Completed");
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log("Polling cleared.");
          }

          // Navigate to Results Page based on the method
          if (generateMIDI) {
            navigate(`/process/results/midi/${trackName}`);
          } else if (processStems) {
            navigate(`/process/results/stems/${trackName}`);
          } else {
            throw new Error("No valid processing method selected.");
          }
        } else if (status.status === "Error") {
          throw new Error(status.message || "Processing failed.");
        } else {
          console.log("Processing still ongoing.");
        }
      } catch (error: any) {
        console.error("Error during processing:", error);
        setError(error.message || "An unexpected error occurred.");
        setUploadStatus("Error");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          console.log("Polling cleared.");
        }
        navigate("/process/select-segment");
      }
    };

    // Initial status check
    fetchStatus();

    // Set up polling every 5 seconds
    intervalRef.current = setInterval(fetchStatus, 5000);
    console.log("Polling started.");

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log("Polling cleared on unmount.");
      }
    };
  }, [
    trackName,
    generateMIDI,
    processStems,
    navigate,
    setError,
    setUploadStatus,
  ]);

  return (
    <Wizard>
      <div className="flex flex-col items-center justify-center h-full p-6">
        <WaveSpinner className="size-6" size={50} color="#534BAF" />
        <p className="text-lg text-gray-700 mt-4">Processing your file...</p>
      </div>
    </Wizard>
  );
};

export default ProcessLoaderPage;
