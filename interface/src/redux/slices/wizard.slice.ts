import { WizardActionTypes } from "../../interface/components/wizard_steps_interface";
import { NEXT_STEP, PREVIOUS_STEP } from "../actions/wizard_actions";

interface WizardState {
  currentIndex: number;
}

const initialState: WizardState = {
  currentIndex: 0,
};

export const wizardReducer = (
  state = initialState,
  action: WizardActionTypes
) => {
  switch (action.type) {
    case NEXT_STEP:
      return { ...state, currentIndex: state.currentIndex + 1 };
    case PREVIOUS_STEP:
      return {
        ...state,
        currentIndex: state.currentIndex > 0 ? state.currentIndex - 1 : 0,
      };
    default:
      return state;
  }
};
