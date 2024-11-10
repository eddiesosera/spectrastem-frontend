// ResultsPage.tsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Wizard from "../../../components/Feedback/Wizard/wizard";
import ExtractedStems from "./ExtractedStems";
import ExtractedMidi from "./ExtractedMidi";
import Confetti from "react-confetti";
import { FileContext } from "../../../context/file.context";
import { Button } from "../../../components/Button/button";

const ResultsPage: React.FC = () => {
  const { result, uploadStatus, error } = useContext(FileContext);
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    if (uploadStatus === "Completed" && result) {
      setShowConfetti(true); // Trigger confetti on successful completion
    } else if (uploadStatus === "Error") {
      // Stay on the page to display error
    }
  }, [uploadStatus, result]);

  const handleRetry = () => {
    navigate("/process/select-segment");
  };

  const ShowMethodResults = () => {
    if (result) {
      if ("midiFiles" in result) {
        return <ExtractedMidi midiFiles={result.midiFiles} />;
      } else if ("stems" in result) {
        return <ExtractedStems stems={result.stems} />;
      } else {
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-700">
              Invalid Result Data
            </h2>
            <p className="text-md text-gray-700 mt-2">
              It seems we couldn’t retrieve the processed file. Please try
              again.
            </p>
            <Button type="fill" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        );
      }
    } else {
      return (
        <p className="text-md text-gray-700 mt-2 text-sm text-red-700">
          It seems we couldn’t retrieve the processed file. Please try again.
        </p>
      );
    }
  };

  return (
    <Wizard>
      <div className="flex flex-col flex-grow h-full p-6 justify-center align-center">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

        {uploadStatus === "Error" ? (
          <div className="error-container text-center">
            <h2 className="text-2xl font-bold text-red-600">
              Processing Failed
            </h2>
            <p className="text-md text-gray-700 mt-2">
              {error ||
                "An unexpected error occurred during processing. Please try again or contact support."}
            </p>
            <Button type="fill" onClick={handleRetry} className="mt-4">
              Retry
            </Button>
          </div>
        ) : (
          <ShowMethodResults />
        )}
      </div>
    </Wizard>
  );
};

export default ResultsPage;
