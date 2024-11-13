// interface/pages/Processing/steps.tsx

import {
  MediaSelectSVG,
  ProcessingSVG,
  ResultsSVG,
} from "./processSVG/process._svgs";

export const steps = [
  {
    name: "Segment",
    url: "/process/select-segment",
    description: "Select the audio segment to process.",
    img: <MediaSelectSVG />,
  },
  {
    name: "Processing",
    url: "/process/processing-audio",
    description: "Your audio is being processed.",
    img: <ProcessingSVG />,
  },
  {
    name: "Results",
    url: "/process/results/*", // Changed to wildcard to match any results path
    description: "Your results are ready.",
    img: <ResultsSVG />,
  },
];
