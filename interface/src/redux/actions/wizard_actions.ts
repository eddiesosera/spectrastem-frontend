export const NEXT_STEP = "NEXT_STEP";
export const PREVIOUS_STEP = "PREVIOUS_STEP";

export const nextStep = () => ({
  type: NEXT_STEP,
});

export const previousStep = () => ({
  type: PREVIOUS_STEP,
});
