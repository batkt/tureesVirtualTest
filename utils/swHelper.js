export async function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.warn("Service Worker дэмжигдэхгүй байна");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      updateViaCache: "none",
    });

    // Prevent infinite reload loops
    let isUpdating = false;

    registration.addEventListener("updatefound", () => {
      if (isUpdating) return;
      isUpdating = true;

      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed") {
          // Only notify if there's an active service worker (update scenario)
          if (navigator.serviceWorker.controller) {
            // Don't auto-reload - just wait for the new worker to activate
            // The new worker will take control on next page load

            isUpdating = false;
          } else {
            // First install, no need to reload
            isUpdating = false;
          }
        } else if (newWorker.state === "activated") {
          // New worker is now active, but don't auto-reload
          // Let it take effect naturally on next navigation
          isUpdating = false;
        }
      });
    });

    // Check for updates periodically, but not too frequently
    // Reduced frequency to prevent excessive update checks
    setInterval(() => {
      if (!isUpdating) {
        registration.update();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes instead of every minute

    return registration;
  } catch (error) {
    throw error;
  }
}

export async function unregisterServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
    }
  } catch (error) {
    // ignore
  }
}

let syncTimeout = null;
const SYNC_DEBOUNCE_TIME = 2000;

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
