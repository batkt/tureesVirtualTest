class ServiceWorkerHelper {
  constructor() {
    this.swRegistration = null;
    this.isSupported = false; 
    this.onPaymentSavedOffline = null;

    // Only check for service worker support on client side
    if (this.isClientSide()) {
      this.isSupported = "serviceWorker" in navigator;
    }
  }

  isClientSide() {
    return typeof window !== "undefined" && typeof navigator !== "undefined";
  }

  setPaymentSavedOfflineHandler(callback) {
    this.onPaymentSavedOffline = callback;
  }

  async registerServiceWorker() {
    // Early return if not on client side or not supported
    if (!this.isClientSide() || !this.isSupported) {
      console.warn("Service Worker is not supported or not on client side");
      return false;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log(
        "Service Worker registered successfully:",
        this.swRegistration
      );

      // Set up update listener
      this.setupUpdateListener();

      // Set up message listener
      this.setupMessageListener();

      return true;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return false;
    }
  }

  setupUpdateListener() {
    if (!this.swRegistration) return;

    this.swRegistration.addEventListener("updatefound", () => {
      const newWorker = this.swRegistration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            this.onServiceWorkerUpdate();
          }
        });
      }
    });
  }

  setupMessageListener() {
    if (!this.isClientSide()) return;

    navigator.serviceWorker.addEventListener(
      "message",
      this.handleServiceWorkerMessage
    );
  }

  handleServiceWorkerMessage = (event) => {
    // Ensure event and event.data exist
    if (!event || !event.data) {
      console.warn("Received invalid service worker message:", event);
      return;
    }

    const { type, payment, data } = event.data;

    switch (type) {
      case "OFFLINE_LOGIN_SUCCESS":
        console.log("Offline login successful");
        break;

      case "CACHE_UPDATED":
        console.log("Cache updated, refreshing page...");
        if (this.isClientSide()) {
          window.location.reload();
        }
        break;

      case "SYNC_COMPLETED":
        console.log("Sync completed, refreshing page...");
        if (this.isClientSide()) {
          window.location.reload();
        }
        break;

      case "PAYMENT_SAVED_OFFLINE":
        console.log("Payment saved offline:", payment);
        if (this.onPaymentSavedOffline && typeof this.onPaymentSavedOffline === 'function') {
          this.onPaymentSavedOffline(payment);
        }
        break;

      default:
        console.log("Unhandled service worker message:", type, data);
    }
  };

  onServiceWorkerUpdate() {
    if (!this.isClientSide()) return;
    
    // Use a more user-friendly approach
    try {
      if (confirm("A new version is available. Reload to update?")) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error showing update prompt:", error);
      // Fallback to direct reload
      window.location.reload();
    }
  }

  async sendMessage(message) {
    if (!this.isClientSide() || !this.isSupported) {
      console.warn("Cannot send message: not on client side or not supported");
      return false;
    }

    if (!navigator.serviceWorker.controller) {
      console.warn("No active service worker controller");
      return false;
    }

    try {
      navigator.serviceWorker.controller.postMessage(message);
      return true;
    } catch (error) {
      console.error("Error sending message to service worker:", error);
      return false;
    }
  }

  async clearOfflineData() {
    return this.sendMessage({ type: "CLEAR_OFFLINE_DATA" });
  }

  isServiceWorkerActive() {
    return (
      this.isClientSide() &&
      this.isSupported && 
      navigator.serviceWorker.controller !== null
    );
  }

  async waitForServiceWorker() {
    if (!this.isClientSide() || !this.isSupported) {
      console.warn("Cannot wait for service worker: not supported or not on client side");
      return false;
    }

    try {
      await navigator.serviceWorker.ready;
      return true;
    } catch (error) {
      console.error("Service worker not ready:", error);
      return false;
    }
  }

  async unregisterServiceWorker() {
    if (!this.isClientSide() || !this.swRegistration) {
      console.warn("Cannot unregister: not on client side or no registration");
      return false;
    }

    try {
      const result = await this.swRegistration.unregister();
      console.log("Service Worker unregistered:", result);
      this.swRegistration = null; // Clear the registration
      return result;
    } catch (error) {
      console.error("Service Worker unregistration failed:", error);
      return false;
    }
  }

  async updateServiceWorker() {
    if (!this.isClientSide() || !this.swRegistration) {
      console.warn("Cannot update: not on client side or no registration");
      return false;
    }

    try {
      await this.swRegistration.update();
      return true;
    } catch (error) {
      console.error("Service Worker update failed:", error);
      return false;
    }
  }

  // Method to safely get registration status
  getRegistrationStatus() {
    if (!this.isClientSide()) {
      return { supported: false, registered: false, active: false };
    }

    return {
      supported: this.isSupported,
      registered: !!this.swRegistration,
      active: this.isServiceWorkerActive(),
    };
  }

  // Cleanup method for removing event listeners
  cleanup() {
    if (!this.isClientSide()) return;

    try {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener(
          "message",
          this.handleServiceWorkerMessage
        );
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  }
}

// Create instance only on client side
export const swHelper =
  typeof window !== "undefined" && typeof navigator !== "undefined"
    ? new ServiceWorkerHelper()
    : null;

// Export safe wrapper functions
export const registerServiceWorker = async () => {
  if (!swHelper) {
    console.warn("Service Worker helper not available (likely SSR)");
    return false;
  }
  return await swHelper.registerServiceWorker();
};

export const sendMessageToSW = (message) => {
  if (!swHelper) {
    console.warn("Service Worker helper not available (likely SSR)");
    return false;
  }
  return swHelper.sendMessage(message);
};

export const clearOfflineDataViaSW = async () => {
  if (!swHelper) {
    console.warn("Service Worker helper not available (likely SSR)");
    return false;
  }
  return await swHelper.clearOfflineData();
};

export const isServiceWorkerActive = () => {
  if (!swHelper) {
    return false;
  }
  return swHelper.isServiceWorkerActive();
};

export const waitForServiceWorker = async () => {
  if (!swHelper) {
    console.warn("Service Worker helper not available (likely SSR)");
    return false;
  }
  return await swHelper.waitForServiceWorker();
};

export const updateServiceWorker = async () => {
  if (!swHelper) {
    console.warn("Service Worker helper not available (likely SSR)");
    return false;
  }
  return await swHelper.updateServiceWorker();
};

export const getServiceWorkerStatus = () => {
  if (!swHelper) {
    return { supported: false, registered: false, active: false };
  }
  return swHelper.getRegistrationStatus();
};

export const cleanupServiceWorker = () => {
  if (swHelper) {
    swHelper.cleanup();
  }
};