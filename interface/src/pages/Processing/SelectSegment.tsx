// SelectSegment.tsx
import React from "react";
import Wizard from "../../components/Feedback/Wizard/wizard";

interface SelectSegmentProps {
  handleNext: () => void;
  handlePrevious: () => void;
  currentStepIndex: number;
  totalSteps: number;
}

const SelectSegment: React.FC<SelectSegmentProps> = (props) => {
  // Component logic and state

  // Optional custom header
  const customHeader = (
    <div className="custom-header">
      <h1>Custom Segment Selection Header</h1>
      {/* Additional header content */}
    </div>
  );

  // Optional custom footer
  const customFooter = (
    <div className="custom-footer">
      <button onClick={props.handlePrevious}>Back</button>
      <button onClick={props.handleNext}>Proceed</button>
    </div>
  );

  return (
    <Wizard header={customHeader} footer={customFooter}>
      <div>
        {/* Step-specific content */}
        <p>Select the audio segment to process.</p>
        {/* Use props.handleNext and props.handlePrevious if needed */}
      </div>
    </Wizard>
  );
};

export default SelectSegment;
