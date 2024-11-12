// interface/components/EstimatedTimeLeft.tsx

import React, { useContext } from "react";
import { TimerContext } from "../../../context/timer.context";

/**
 * Formats seconds into MM:SS format.
 * @param seconds Number of seconds.
 * @returns Formatted time string.
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedMins = mins.toString().padStart(2, "0");
  const formattedSecs = secs.toString().padStart(2, "0");
  return `${formattedMins}:${formattedSecs}`;
};

/**
 * Displays the estimated time left for processing.
 */
const EstimatedTimeLeft: React.FC = () => {
  const { remainingTime } = useContext(TimerContext);

  if (remainingTime <= 0) {
    return null;
  }

  return (
    <p className="text-sm text-gray-500 mt-2">
      Estimated Time Left: {formatTime(remainingTime)}
    </p>
  );
};

export default EstimatedTimeLeft;
