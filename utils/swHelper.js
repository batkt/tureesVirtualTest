class ServiceWorkerHelper {
  constructor() {
    this.swRegistration = null;
    this.isSupported = false; 
    this.onPaymentSavedOffline = null;

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      this.isSupported = "serviceWorker" in navigator;
    }
  }

  setPaymentSavedOfflineHandler(callback) {
    this.onPaymentSavedOffline = callback;
  }

  async registerServiceWorker() {
    if (!this.isSupported) {
      console.warn("Service Worker is not supported in this browser");
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

      this.swRegistration.addEventListener("updatefound", () => {
        const newWorker = this.swRegistration.installing;
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            this.onServiceWorkerUpdate();
          }
        });
      });

      navigator.serviceWorker.addEventListener(
        "message",
        this.handleServiceWorkerMessage
      );

      return true;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return false;
    }
  }

  handleServiceWorkerMessage = (event) => {
    const { type, payment, data } = event.data || {};

    switch (type) {
      case "OFFLINE_LOGIN_SUCCESS":
        console.log("Offline login successful");
        break;

      case "CACHE_UPDATED":
        console.log("Cache updated, refreshing page...");
        window.location.reload();
        break;

      case "SYNC_COMPLETED":
        console.log("Sync completed, refreshing page...");
        window.location.reload();
        break;

      case "PAYMENT_SAVED_OFFLINE":
        console.log("Payment saved offline:", payment);
        if (this.onPaymentSavedOffline) {
          this.onPaymentSavedOffline(payment);
        }
        break;

      default:
        console.log("Unhandled service worker message:", type, data);
    }
  };

  onServiceWorkerUpdate() {
    if (confirm("A new version is available. Reload to update?")) {
      window.location.reload();
    }
  }

  async sendMessage(message) {
    if (!this.isSupported || !navigator.serviceWorker.controller) {
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
      this.isSupported && typeof navigator !== "undefined" &&
      navigator.serviceWorker.controller
    );
  }

  async waitForServiceWorker() {
    if (!this.isSupported) return false;
    try {
      await navigator.serviceWorker.ready;
      return true;
    } catch (error) {
      console.error("Service worker not ready:", error);
      return false;
    }
  }

  async unregisterServiceWorker() {
    if (!this.swRegistration) return false;
    try {
      const result = await this.swRegistration.unregister();
      console.log("Service Worker unregistered:", result);
      return result;
    } catch (error) {
      console.error("Service Worker unregistration failed:", error);
      return false;
    }
  }

  async updateServiceWorker() {
    if (!this.swRegistration) return false;
    try {
      await this.swRegistration.update();
      return true;
    } catch (error) {
      console.error("Service Worker update failed:", error);
      return false;
    }
  }
}

export const swHelper =
  typeof window !== "undefined" ? new ServiceWorkerHelper() : null;

export const registerServiceWorker = () =>
  swHelper?.registerServiceWorker();

export const sendMessageToSW = (message) =>
  swHelper?.sendMessage(message);

export const clearOfflineDataViaSW = () =>
  swHelper?.clearOfflineData();

export const isServiceWorkerActive = () =>
  swHelper?.isServiceWorkerActive();

export const waitForServiceWorker = () =>
  swHelper?.waitForServiceWorker();

export const updateServiceWorker = () =>
  swHelper?.updateServiceWorker();
