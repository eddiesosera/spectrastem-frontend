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

  // ProgressBar Component
  const ProgressBar: React.FC<{ steps: any[]; currentStepIndex: number }> = ({
    steps,
    currentStepIndex,
  }) => (
    <div className="wizard-progress-bar bg-white rounded-lg p-6 shadow-sm mb-8">
      <div className="flex justify-between items-center w-full">
        {steps.slice(0, 3).map((step, index) => (
          <div key={step.url} className="flex-1 flex items-center w-full">
            {/* Step Circle */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index === currentStepIndex
                  ? "bg-black text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {index + 1}
            </div>

            {/* Step Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 ${
                  index < currentStepIndex ? "bg-black" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 w-full">
        {steps.slice(0, 3).map((step, index) => (
          <div
            key={step.url}
            className={`text-center text-xs font-semibold ${
              index === currentStepIndex ? "text-black" : "text-gray-500"
            }`}
          >
            {step.name}
          </div>
        ))}
      </div>
    </div>
  );

  // StepContent Component for displaying the step image, title, and description
  const StepContent: React.FC<{ currentStep: any }> = ({ currentStep }) => (
    <div className="flex flex-col items-center">
      {/* Step Image */}
      {/* <img
        src={currentStep.image} // Ensure each step object has an `image` URL
        alt={currentStep.name}
        className="w-24 h-24 mb-4"
      /> */}
      {currentStep.img}
      {/* Step Title */}
      <h2 className="text-lg font-bold">{currentStep.name}</h2>
      {/* Step Description */}
      <p className="text-gray-500 text-sm">{currentStep.description}</p>
    </div>
  );

  // Default Header
  const defaultHeader = (
    <div className="wizard-header p-4 border-b border-gray-200">
      <h1 className="text-lg font-bold">{steps[currentStepIndex].name}</h1>
    </div>
  );

  // Default Footer
  const defaultFooter = (
    <div className="wizard-footer p-4 border-t border-gray-200 flex justify-between">
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
    </div>
  );

  return (
    <div className="wizard flex flex-grow p-4 w-full h-full p-4 bg-[#F5F4FB]">
      <div className="wizard-inner flex gap-4 w-full h-full">
        <div className="wizard-container flex flex-col flex-grow p-6 g-4 bg-white rounded-[1.25rem] border border-[#D2D2D2] justify-between h-full">
          {/* Header */}
          {header !== undefined ? header : defaultHeader}

          {/* Content */}
          <div className="wizard-content flex flex-col flex-grow h-full p-6 justify-center align-center">
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

        {/* Sidebar with Progress Bar and Step Details */}
        <div className="wizard-sidebar w-1/3 bg-wizard-s-bg rounded-[1.25rem] border border-[#D2D2D2] p-6">
          <ProgressBar steps={steps} currentStepIndex={currentStepIndex} />
          <StepContent currentStep={steps[currentStepIndex]} />
        </div>
      </div>
    </div>
  );
};

export default Wizard;
