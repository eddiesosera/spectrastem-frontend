// File: frontend/pages/Processing/ResultsPage.tsx

import React from "react";
import { useLocation } from "react-router-dom";
import Wizard from "../../../components/Feedback/Wizard/wizard";
import ExtractedStems from "./ExtractedStems";
import ExtractedMidi from "./ExtractedMidi";

const ResultsPage: React.FC = () => {
  const location = useLocation();

  const ShowMethodResults = () => {
    return location.pathname === "/process/results/stems" ? (
      <ExtractedStems />
    ) : (
      location.pathname === "/process/results/midi" && <ExtractedMidi />
    );
  };
  return (
    <Wizard>
      <ShowMethodResults />
    </Wizard>
  );
};

export default ResultsPage;
