import React from "react";
import { IWizardProps } from "../../../interface/components/wizard_steps_interface";
import WizardStep from "./wizard_step";
import { useDispatch, useSelector } from "react-redux";
import { nextStep, previousStep } from "../../../redux/actions/wizard_actions";

interface RootState {
  currentIndex: number;
}

const Wizard: React.FC<IWizardProps> = ({ steps }) => {
  // Use correct typing for the Redux state
  const currentIndex = useSelector((state: RootState) => state.currentIndex);
  const dispatch = useDispatch();

  // Navigation methods
  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      dispatch(nextStep());
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      dispatch(previousStep());
    }
  };

  // Safely handle the current design
  const currentDesign = steps[currentIndex]?.design;
  const designWithMethods = currentDesign
    ? React.cloneElement(currentDesign as React.ReactElement, {
        handleNext,
        handlePrevious,
      })
    : null;

  // Render the WizardStep with props
  return (
    <div className="w-full flex flex-grow">
      <WizardStep
        design={designWithMethods}
        name={steps[currentIndex]?.name || ""}
        index={currentIndex}
        totalSteps={steps.length}
        description={steps[currentIndex]?.description || ""}
      />
    </div>
  );
};

export default Wizard;
