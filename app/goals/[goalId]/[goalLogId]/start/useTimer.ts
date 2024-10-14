import { useState, useRef, useEffect } from 'react';

export function useTimer(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime); // Time left in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start the timer
  const startTimer = () => {
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
  };

  // Pause the timer
  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
  };

  // Reset the timer to any value
  const resetTimer = (newTime: number = initialTime) => {
    pauseTimer();
    setTimeLeft(newTime); // Dynamically reset the timer to the passed value
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current as NodeJS.Timeout);
    };
  }, []);

  return { timeLeft, isRunning, startTimer, pauseTimer, resetTimer };
}
