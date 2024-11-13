// interface/pages/Processing/ResultsPages/ResultsPage.tsx

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { FileContext } from "../../../context/FileContext";
import { Button } from "../../../components/Button/button";
import { FileContext } from "../../../context/file.context";
import ExtractedMidi from "./ExtractedMidi";
import ExtractedStems from "./ExtractedStems";
import Wizard from "../../../components/Feedback/Wizard/wizard";
import Confetti from "react-confetti";

const ResultsPage: React.FC = () => {
  const { method, trackName } = useParams<{
    method: string;
    trackName: string;
  }>();
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
      // Accessing 'midi' or 'stems' directly from 'result'
      if (method === "midi" && result.midi && result.midi.midi_files) {
        return <ExtractedMidi midiFiles={result.midi.midi_files} />;
      } else if (method === "stems" && result.stems) {
        return <ExtractedStems stems={result.stems.stems} />;
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
        <div className="text-center">
          <p className="text-md text-gray-700 mt-2">
            It seems we couldn’t retrieve the processed file. Please try again.
          </p>
          <Button type="fill" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      );
    }
  };

  return (
    <Wizard>
      <div className="flex flex-col flex-grow h-full p-6 justify-center items-center">
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
