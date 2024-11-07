export interface IWizardStepProps {
  design: React.ReactNode;
  name: string;
  index: number;
  totalSteps: number;
  description: string;
  previous?: (currentIndex: number) => void;
  next?: (currentIndex: number) => void;
}

export interface IWizardProps {
  steps: IWizardStepProps[];
  audioFile: File | null;
  onStepChange?: (currentIndex: number) => void;
}

export interface IStepDesignProps {
  data: any;
  handleNext: () => void;
  handlePrevious: () => void;
}

export const NEXT_STEP = "NEXT_STEP";
export const PREVIOUS_STEP = "PREVIOUS_STEP";

export interface NextStepAction {
  type: typeof NEXT_STEP;
}

export interface PreviousStepAction {
  type: typeof PREVIOUS_STEP;
}

export type WizardActionTypes = NextStepAction | PreviousStepAction;
