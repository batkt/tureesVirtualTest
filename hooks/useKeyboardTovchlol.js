import { useEffect } from "react";

export const useKeyboardTovchlol = (tovch, callback) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "F4" ||
        event.key === "F1" ||
        event.key === "F2" ||
        event.key === "+"
      ) {
        event.preventDefault();
      }
      if (tovch === event.key) {
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tovch, callback]);
};
