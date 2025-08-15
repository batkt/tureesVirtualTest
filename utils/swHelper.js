// utils/registerServiceWorker.js
class ServiceWorkerHelper {
  constructor() {
    this.swRegistration = null;
    this.isSupported = typeof window !== "undefined" && "serviceWorker" in navigator;
    this.onPaymentSavedOffline = null;
  }

  isClientSide() {
    return typeof window !== "undefined";
  }

  async register() {
    if (!this.isClientSide() || !this.isSupported) {
      console.warn("Service Worker not supported or not on client side");
      return false;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      console.log("Service Worker registered:", this.swRegistration);

      // Listen for updates
      this.swRegistration.addEventListener("updatefound", () => {
        const newWorker = this.swRegistration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              this.onServiceWorkerUpdate();
            }
          });
        }
      });

      // Listen for messages from SW
      navigator.serviceWorker.addEventListener("message", this.handleMessage);

      return true;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return false;
    }
  }

  handleMessage = (event) => {
    if (!event?.data) return;
    const { type, payment, data } = event.data;

    switch (type) {
      case "OFFLINE_LOGIN_SUCCESS":
        console.log("Offline login successful");
        break;

      case "CACHE_UPDATED":
        console.log("Cache updated, refreshing page...");
        if (this.isClientSide()) window.location.reload();
        break;

      case "SYNC_COMPLETED":
        console.log("Sync completed, refreshing page...");
        if (this.isClientSide()) window.location.reload();
        break;

      case "PAYMENT_SAVED_OFFLINE":
        console.log("Payment saved offline:", payment);
        if (typeof this.onPaymentSavedOffline === "function") {
          this.onPaymentSavedOffline(payment);
        }
        break;

      default:
        console.log("Unhandled SW message:", type, data);
    }
  };

  onServiceWorkerUpdate() {
    if (!this.isClientSide()) return;
    if (confirm("A new version is available. Reload to update?")) window.location.reload();
  }

  setPaymentSavedOfflineHandler(callback) {
    this.onPaymentSavedOffline = callback;
  }

  sendMessage(msg) {
    if (!this.isClientSide() || !navigator.serviceWorker.controller) return false;
    navigator.serviceWorker.controller.postMessage(msg);
    return true;
  }

  clearOfflineData() {
    return this.sendMessage({ type: "CLEAR_OFFLINE_DATA" });
  }

  isActive() {
    return this.isClientSide() && !!navigator.serviceWorker.controller;
  }

  async waitForServiceWorker() {
    if (!this.isClientSide() || !this.isSupported) return false;
    try {
      await navigator.serviceWorker.ready;
      return true;
    } catch (err) {
      console.error("Service worker not ready:", err);
      return false;
    }
  }

  async unregister() {
    if (!this.isClientSide() || !this.swRegistration) return false;
    try {
      const result = await this.swRegistration.unregister();
      this.swRegistration = null;
      console.log("Service Worker unregistered:", result);
      return result;
    } catch (err) {
      console.error("Unregistration failed:", err);
      return false;
    }
  }

  cleanup() {
    if (!this.isClientSide()) return;
    try {
      navigator.serviceWorker.removeEventListener("message", this.handleMessage);
    } catch (err) {
      console.error("Error during cleanup:", err);
    }
  }
}

// Create instance only on client side
export const swHelper =
  typeof window !== "undefined" && typeof navigator !== "undefined"
    ? new ServiceWorkerHelper()
    : null;

// Safe wrapper functions
export const registerServiceWorker = () => swHelper?.register();
export const sendMessageToSW = (msg) => swHelper?.sendMessage(msg);
export const clearOfflineDataViaSW = () => swHelper?.clearOfflineData();
export const isServiceWorkerActive = () => swHelper?.isActive();
export const waitForServiceWorker = () => swHelper?.waitForServiceWorker();
export const unregisterServiceWorker = () => swHelper?.unregister();
export const getServiceWorkerStatus = () => {
  if (!swHelper) return { supported: false, registered: false, active: false };
  return {
    supported: swHelper.isSupported,
    registered: !!swHelper.swRegistration,
    active: swHelper.isActive(),
  };
};
export const cleanupServiceWorker = () => swHelper?.cleanup();
