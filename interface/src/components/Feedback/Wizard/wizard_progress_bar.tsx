import React from "react";

interface StepProps {
  steps: { name: string }[]; // Array of step names for more flexibility
  currentIndex: number; // Current active step
}

const ProgressBarStepper: React.FC<StepProps> = ({ steps, currentIndex }) => {
  return (
    <div className="relative flex items-center bg-gray-100 p-4 rounded-lg">
      {/* Full-width background line behind steps */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>

      {steps.map((step, stepIndex) => (
        <div
          key={stepIndex}
          className="flex flex-col items-center text-center relative z-10 w-full"
        >
          {/* Step Circle */}
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
              stepIndex < currentIndex
                ? "bg-gray-500 text-white" // Completed step
                : stepIndex === currentIndex
                ? "bg-black text-white" // Active step
                : "bg-white text-gray-400 border border-gray-300" // Inactive step
            }`}
          >
            {stepIndex + 1}
          </div>

          {/* Step Title */}
          <span
            className={`text-xs ${
              stepIndex === currentIndex
                ? "font-semibold text-black" // Active step title
                : stepIndex < currentIndex
                ? "text-gray-500" // Completed step title
                : "text-gray-400" // Inactive step title
            }`}
          >
            {step.name}
          </span>

          {/* Connecting Line */}
          {stepIndex < steps.length - 1 && (
            <div className="absolute top-4 right-0 w-full h-0.5 bg-gray-300 z-0"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBarStepper;
