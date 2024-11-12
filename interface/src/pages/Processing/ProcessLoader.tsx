// interface/pages/ProcessLoaderPage.tsx

import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Wizard from "../../components/Feedback/Wizard/wizard";
import { FileContext } from "../../context/file.context";
import { TimerContext } from "../../context/timer.context";
// import EstimatedTimeLeft from "../../components/EstimatedTimeLeft"; // Corrected import path
import { WaveSpinner } from "react-spinners-kit";
import EstimatedTimeLeft from "../../components/Feedback/EstimatedTimeLeft/estimated_time_left";

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
  const { remainingTime } = useContext(TimerContext);

  useEffect(() => {
    if (!trackName) {
      // If no trackName is provided, navigate back to select segment
      navigate("/process/select-segment");
      return;
    }

    const startProcessing = () => {
      try {
        // Set up an interval to check remainingTime every second
        const intervalId = setInterval(() => {
          if (remainingTime <= 0) {
            clearInterval(intervalId);
            // Navigate to Results Page with absolute path and trackName
            if (generateMIDI) {
              navigate(`/process/results/midi/${trackName}`);
            } else if (processStems) {
              navigate(`/process/results/stems/${trackName}`);
            }
          }
        }, 1000);
      } catch (error: any) {
        setError(error.message || "Processing failed.");
        setUploadStatus("Error");
        navigate("/process/select-segment");
      }
    };

    startProcessing();

    // Cleanup function to clear interval if component unmounts
    return () => {
      // Clear the interval to prevent memory leaks
      // Note: The interval is already cleared when remainingTime <= 0
    };
  }, [
    trackName,
    generateMIDI,
    processStems,
    navigate,
    setError,
    setUploadStatus,
    remainingTime,
  ]);

  return (
    <Wizard>
      <div className="flex flex-col items-center justify-center h-full p-6">
        <WaveSpinner className="size-6" size={30} color="#534BAF" />
        <p className="text-lg text-gray-700 mt-4">Processing your file...</p>
        <EstimatedTimeLeft />
      </div>
    </Wizard>
  );
};

export default ProcessLoaderPage;
