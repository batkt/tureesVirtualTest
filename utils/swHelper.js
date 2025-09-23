export async function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          console.log("⚡️ New service worker installed, waiting to activate");
        }
      });
    });

    if (navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then((reg) => {
        if ("sync" in reg) {
          reg.sync.register("sync-payments").catch((err) => {
            console.warn(
              "Background sync failed, fallback to manual sync:",
              err
            );
            triggerSync();
          });
        } else {
          console.log("Background sync not supported, triggering manual sync");
          triggerSync();
        }
      });
    }

    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
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
    } else {
      console.warn("No active service worker to trigger sync");
    }
    syncTimeout = null;
  }, SYNC_DEBOUNCE_TIME);
}

export async function getPendingPaymentsFromSW() {
  return new Promise((resolve) => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data?.payments || []);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: "GET_PENDING_PAYMENTS" },
        [channel.port2]
      );
    } else {
      resolve([]);
    }
  });
}

export function clearSWCache() {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" });
  }
}
