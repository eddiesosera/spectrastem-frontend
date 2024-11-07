import React from "react";

interface WizardStepProps {
  design: React.ReactNode;
  name: string;
  index: number;
  totalSteps: number;
  description: string;
  handleNext: () => void;
  handlePrevious: () => void;
}

const WizardStep: React.FC<WizardStepProps> = ({
  design,
  name,
  index,
  totalSteps,
  description,
  handleNext,
  handlePrevious,
}) => {
  return (
    <div className="wizard-step">
      <h2>{name}</h2>
      <p>{description}</p>
      <div className="design-content">{design}</div>
      <div className="navigation-buttons">
        {index > 0 && (
          <button onClick={handlePrevious} className="prev-button">
            Previous
          </button>
        )}
        {index < totalSteps - 1 && (
          <button onClick={handleNext} className="next-button">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardStep;
