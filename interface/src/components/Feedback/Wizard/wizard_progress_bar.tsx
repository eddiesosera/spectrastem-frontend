import React from "react";

interface StepProps {
  name: string;
  index: number;
  totalSteps: number;
}

const ProgressBarStepper: React.FC<StepProps> = ({
  name,
  index,
  totalSteps,
}) => {
  return (
    <div className="flex items-center bg-gray-100 p-4 rounded-lg">
      {Array.from({ length: totalSteps }).map((_, stepIndex) => (
        <div key={stepIndex} className="flex items-center w-full">
          {/* Step Circle */}
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              stepIndex <= index
                ? "bg-black text-white"
                : "bg-white text-gray-400 border border-gray-300"
            }`}
          >
            {stepIndex + 1}
          </div>

          {/* Step Title */}
          <div
            className={`ml-2 text-xs ${
              stepIndex === index ? "font-semibold text-black" : "text-gray-400"
            }`}
          >
            {name}
          </div>

          {/* Connecting Line */}
          {stepIndex < totalSteps - 1 && (
            <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBarStepper;
