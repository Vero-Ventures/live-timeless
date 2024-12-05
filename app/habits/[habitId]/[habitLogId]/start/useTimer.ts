import { useState, useEffect, useCallback, useRef } from "react";

export function useTimer(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  }, [isRunning]);

  const pauseTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
  }, [isRunning]);

  const setTimer = useCallback((newTime: number) => {
    setTimeLeft(newTime);
    if (timerRef.current) {
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current as NodeJS.Timeout);
      }
    };
  }, []);

  return { timeLeft, startTimer, pauseTimer, setTimer, isRunning };
}
