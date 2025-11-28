import { useEffect, useRef } from "react";

export const useKeyboardTovchlol = (tovch, callback) => {
  const callbackRef = useRef(callback);

  // Update ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "F4" ||
        event.key === "F1" ||
        event.key === "F2" ||
        event.key === "+" ||
        event.key === "F5"
      ) {
        event.preventDefault();
      }
      if (tovch === event.key) {
        callbackRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tovch]); // Remove callback from dependencies
};
