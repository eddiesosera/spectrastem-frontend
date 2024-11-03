import WizardStep from "../../components/Feedback/Wizard/wizard_step";

export const steps = [
  {
    name: "Segment Selection",
    component: (
      <WizardStep
        design={<div>Design 1</div>}
        name="Segment Selection"
        description="Select the audio segment to process."
      />
    ),
  },
  {
    name: "Choose Method",
    component: (
      <WizardStep
        design={<div>Design 2</div>}
        name="Choose Method"
        description="Choose how you want to process the audio."
      />
    ),
  },
  {
    name: "Processing Audio",
    component: (
      <WizardStep
        design={<div>Design 3</div>}
        name="Processing Audio"
        description="Your audio is being processed."
      />
    ),
  },
  {
    name: "Extracted Stems",
    component: (
      <WizardStep
        design={<div>Design 4</div>}
        name="Extracted Stems"
        description="Your stems are ready."
      />
    ),
  },
  {
    name: "Extracted MIDI",
    component: (
      <WizardStep
        design={<div>Design 5</div>}
        name="Extracted MIDI"
        description="Your MIDI file is ready."
      />
    ),
  },
];
