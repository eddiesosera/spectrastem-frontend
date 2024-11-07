// Wizard.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { steps } from "../../../pages/Processing/steps";

interface WizardProps {
  children: React.ReactElement;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Wizard: React.FC<WizardProps> = ({ children, header, footer }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Find the current step index based on the current URL
  const currentStepIndex = steps.findIndex(
    (step) => step.url === location.pathname
  );

  // Functions to handle navigation
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      navigate(steps[currentStepIndex + 1].url);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      navigate(steps[currentStepIndex - 1].url);
    }
  };

  // If the current URL does not match any step, display an error or redirect
  if (currentStepIndex === -1) {
    return <div>Error: Invalid step.</div>;
  }

  // Default Header
  const defaultHeader = (
    <div className="wizard-header">
      <h1>{steps[currentStepIndex].name}</h1>
      {/* You can add more default header content here */}
    </div>
  );

  // Default Footer
  const defaultFooter = (
    <div className="wizard-footer">
      {currentStepIndex > 0 && (
        <button onClick={handlePrevious} className="prev-button">
          Previous
        </button>
      )}
      {currentStepIndex < steps.length - 1 && (
        <button onClick={handleNext} className="next-button">
          Next
        </button>
      )}
      {/* You can add more default footer content here */}
    </div>
  );

  return (
    <div className="wizard-container">
      {/* Header */}
      {header !== undefined ? header : defaultHeader}

      {/* Content */}
      <div className="wizard-content">
        {React.cloneElement(children, {
          handleNext,
          handlePrevious,
          currentStepIndex,
          totalSteps: steps.length,
        })}
      </div>

      {/* Footer */}
      {footer !== undefined ? footer : defaultFooter}
    </div>
  );
};

export default Wizard;
