// interface/utils/estimation.ts

export interface EstimationParams {
  duration: number; // in seconds
  size: number; // in KB
  uploadSpeed?: number; // in KB/s (optional)
}

/**
 * Estimates the remaining time for processing based on duration, size, and upload speed.
 * @param params Estimation parameters.
 * @returns Estimated time in seconds.
 */
export const estimateRemainingTime = ({
  duration,
  size,
  uploadSpeed,
}: EstimationParams): number => {
  // Base constants from the given ratio
  const baseDuration = 11; // seconds
  const baseSize = 480; // KB
  const baseProcessingTime = 180; // seconds

  // Calculate processing time based on duration and size
  const processingTime =
    baseProcessingTime * (duration / baseDuration) * (size / baseSize);

  let uploadTime = 0;
  if (uploadSpeed && uploadSpeed > 0) {
    uploadTime = size / uploadSpeed; // seconds
  }

  const totalEstimatedTime = Math.ceil(uploadTime + processingTime);

  return totalEstimatedTime;
};
