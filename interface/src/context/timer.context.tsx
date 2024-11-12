// interface/context/TimerContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";

interface TimerContextProps {
  remainingTime: number; // in seconds
  setRemainingTime: (time: number) => void;
}

export const TimerContext = createContext<TimerContextProps>({
  remainingTime: 0,
  setRemainingTime: () => {},
});

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    if (remainingTime <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime]);

  return (
    <TimerContext.Provider value={{ remainingTime, setRemainingTime }}>
      {children}
    </TimerContext.Provider>
  );
};
