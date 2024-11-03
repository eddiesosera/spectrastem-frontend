import React from "react";
import { IStepProps } from "../../../interface/components/wizard_steps_interface";
import ProgressBarStepper from "./wizard_progress_bar";

const WizardStep: React.FC<IStepProps> = ({
  design,
  name,
  index,
  totalSteps,
  description,
  previous,
  next,
}) => {
  return (
    <div className="flex flex-grow w-full">
      {/* Left Section */}
      <div className="w-3/5 p-5 bg-white rounded-md shadow-md flex flex-col justify-between">
        <div className="text-lg font-bold mb-4">{name}</div>
        <div className="bg-gray-100 p-10 rounded">{design}</div>
        <div className="mt-5 text-center font-medium">Footer</div>
      </div>

      {/* Right Section */}
      <div className="w-2/5 p-5 flex flex-grow flex flex-col justify-between">
        <ProgressBarStepper name={name} index={index} totalSteps={totalSteps} />
        <div className="flex flex-col items-center mt-5">
          <div className="text-lg font-bold">{name}</div>
          <div className="text-gray-500">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default WizardStep;
