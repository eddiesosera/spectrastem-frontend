// interface/components/Feedback/Wizard/Wizard.tsx

import React, { useCallback, useEffect } from "react";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { steps } from "../../../pages/Processing/steps";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

interface WizardProps {
  children: React.ReactElement;
  header?: React.ReactNode;
  headerRightEl?: React.ReactNode;
  headerLeftPrevElShow?: boolean;
  footer?: React.ReactNode;
  footerEls?: React.ReactNode[];
  footerNextElShow?: boolean;
  setHandleNext?: (handleNext: () => void) => void;
  setHandlePrevious?: (handlePrevious: () => void) => void;
}

const Wizard: React.FC<WizardProps> = ({
  children,
  header,
  headerLeftPrevElShow = true,
  headerRightEl,
  footer,
  footerEls,
  footerNextElShow = false,
  setHandleNext,
  setHandlePrevious,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Find the current step index based on the current URL using matchPath
  const currentStepIndex = steps.findIndex((step) =>
    matchPath({ path: step.url, end: true }, location.pathname)
  );

  // Functions to handle navigation
  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      navigate(steps[currentStepIndex + 1].url);
    }
  }, [currentStepIndex, navigate]);

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      navigate(steps[currentStepIndex - 1].url);
    }
  }, [currentStepIndex, navigate]);

  // Set handleNext and handlePrevious only once when the component mounts
  useEffect(() => {
    if (setHandleNext) setHandleNext(() => handleNext);
    if (setHandlePrevious) setHandlePrevious(() => handlePrevious);
  }, [handleNext, handlePrevious, setHandleNext, setHandlePrevious]);

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
    <div className="flex flex-col items-center align-center justify-center h-auto mt-4">
      {currentStep.img}
      <h2 className="text-2xlg font-bold">{currentStep.name}</h2>
      <p className="text-gray-500 text-sm">{currentStep.description}</p>
    </div>
  );

  // Default Header
  const defaultHeader = (
    <div
      className={`wizard-header flex flex-row p-4 border-b border-gray-200 gap-4 items-center ${
        headerRightEl
          ? "justify-between"
          : !headerLeftPrevElShow
          ? "justify-center"
          : ""
      }`}
    >
      {headerLeftPrevElShow && (
        <div onClick={handlePrevious}>
          <ChevronLeftIcon className="w-5 h-5 cursor-pointer" />
        </div>
      )}
      <h1 className="text-lg font-bold">{steps[currentStepIndex].name}</h1>
      {headerRightEl}
    </div>
  );

  // Default Footer
  const defaultFooter = (
    <div className="wizard-footer p-4 border-t border-gray-200 flex justify-center gap-5">
      {footerEls?.map((el, idx) => (
        <React.Fragment key={idx}>{el}</React.Fragment>
      ))}

      {footerNextElShow && currentStepIndex < steps.length - 1 && (
        <button
          onClick={handleNext}
          className="next-button bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      )}
    </div>
  );

  return (
    <div className="wizard flex flex-grow p-4 w-full h-full bg-[#F5F4FB]">
      <div className="wizard-inner flex gap-4 w-full h-full">
        <div className="wizard-container flex flex-col flex-grow p-6 bg-white rounded-[1.25rem] border border-[#D2D2D2] justify-between h-full">
          {header !== undefined ? header : defaultHeader}
          <div className="wizard-content flex flex-col flex-grow h-full p-6 justify-center">
            {React.cloneElement(children, {
              handleNext,
              handlePrevious,
              currentStepIndex,
              totalSteps: steps.length,
            })}
          </div>
          {footer !== undefined ? footer : defaultFooter}
        </div>
        <div className="wizard-sidebar h-full w-1/3 bg-wizard-s-bg rounded-[1.25rem] border border-[#D2D2D2] p-6">
          <ProgressBar steps={steps} currentStepIndex={currentStepIndex} />
          <StepContent currentStep={steps[currentStepIndex]} />
        </div>
      </div>
    </div>
  );
};

export default Wizard;
