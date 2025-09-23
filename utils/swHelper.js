export async function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    // Шинэчлэлтийг автомат шинэчлэлтгүйгээр зохицуулах
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          console.log("Шинэ service worker суулгагдлаа");
        }
      });
    });

    return registration;
  } catch (error) {
    throw error;
  }
}

// Давтагдахаас сэргийлэх синк функц
let syncTimeout = null;
const SYNC_DEBOUNCE_TIME = 2000; // 2 секунд

export function triggerSync() {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  syncTimeout = setTimeout(() => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "TRIGGER_SYNC",
      });
    }
    syncTimeout = null;
  }, SYNC_DEBOUNCE_TIME);
}
