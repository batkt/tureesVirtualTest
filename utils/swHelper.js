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
          // Only reload if there's an active service worker (update scenario)
          if (navigator.serviceWorker.controller) {
            // Don't auto-reload, let user control it
            // Or add a debounce to prevent infinite loops
            const shouldReload = confirm(
              "Шинэ хувилбар байна. Хуудсыг дахин ачаалах уу?"
            );
            if (shouldReload) {
              // Add a small delay to prevent immediate reload loops
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }
            isUpdating = false;
          } else {
            // First install, no need to reload
            isUpdating = false;
          }
        } else if (newWorker.state === "activated") {
          isUpdating = false;
        }
      });
    });

    // Check for updates periodically, but not too frequently
    setInterval(() => {
      if (!isUpdating) {
        registration.update();
      }
    }, 60000); // Check every minute

    return registration;
  } catch (error) {
    throw error;
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
