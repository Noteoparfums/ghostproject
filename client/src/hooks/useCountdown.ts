import { useState, useEffect, useRef } from 'react';

export function useCountdown(initialSeconds: number, onComplete: () => void, autoStart = true) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(!autoStart);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      onCompleteRef.current();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onCompleteRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isPaused]);

  const togglePause = () => setIsPaused((prev) => !prev);
  const reset = (secs = initialSeconds) => {
    setSecondsLeft(secs);
    setIsPaused(!autoStart);
  };

  return {
    secondsLeft,
    isPaused,
    togglePause,
    reset,
  };
}
export default useCountdown;
