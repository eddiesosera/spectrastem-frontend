// interface/pages/Processing/ResultsPages/ResultsPage.tsx

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { FileContext } from "../../../context/FileContext";
import { Button } from "../../../components/Button/button";
import { FileContext } from "../../../context/file.context";
import ExtractedMidi from "./ExtractedMidi";
import ExtractedStems from "./ExtractedStems";

const ResultsPage: React.FC = () => {
  const { method, trackName } = useParams<{
    method: string;
    trackName: string;
  }>();
  const { fetchResult } = useContext(FileContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!method || !trackName) {
          throw new Error("Invalid parameters provided.");
        }

        // console.log(
        //   "Fetching results for method:",
        //   method,
        //   "and trackName:",
        //   trackName
        // );

        const fetchedData = await fetchResult(method, trackName);
        console.log("Fetched Data:", fetchedData);

        if (fetchedData) {
          setData(fetchedData);
          setLoading(false);
        } else {
          throw new Error("No data found for the provided track.");
        }
      } catch (err: any) {
        console.error("Error fetching results:", err);
        setError(
          err.message ||
            "It seems we couldn’t retrieve the processed file. Please try again."
        );
        setLoading(false);
      }
    };

    fetchResults();
  }, [method, trackName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <p className="text-lg text-gray-700">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h2 className="text-xl font-bold text-red-700">Error</h2>
        <p className="text-md text-gray-700 mt-2">{error}</p>
        <Button type="fill" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {method === "midi" && data?.midi?.midi_files && (
        <ExtractedMidi midiFiles={data.midi.midi_files} />
      )}
      {method === "stems" && data?.stems && (
        <ExtractedStems stems={data.stems.stems} />
      )}
      {/* Handle cases where expected data is missing */}
      {(method === "midi" && !data?.midi?.midi_files) ||
      (method === "stems" && !data?.stems) ? (
        <div className="flex flex-col items-center justify-center h-full p-6">
          <p className="text-gray-700">No results available.</p>
        </div>
      ) : null}
    </div>
  );
};

export default ResultsPage;
