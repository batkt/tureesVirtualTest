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
      console.warn("Service Worker дэмжигдээгүй эсвэл клиент талд ажиллахгүй байна");
      return false;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      console.log("Service Worker амжилттай бүртгэгдлээ:", this.swRegistration);

      // Шинэчлэл илрүүлэх
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

      // SW-аас ирсэн мессежүүдийг сонсох
      navigator.serviceWorker.addEventListener("message", this.handleMessage);

      return true;
    } catch (error) {
      console.error("Service Worker бүртгэхэд алдаа гарлаа:", error);
      return false;
    }
  }

  handleMessage = (event) => {
    if (!event?.data) return;
    const { type, payment, data } = event.data;

    switch (type) {
      case "OFFLINE_LOGIN_SUCCESS":
        console.log("Оффлайн нэвтрэлт амжилттай");
        break;

      case "CACHE_UPDATED":
        console.log("Кэш шинэчлэгдлээ, хуудас дахин ачаалж байна...");
        if (this.isClientSide()) window.location.reload();
        break;

      case "SYNC_COMPLETED":
        console.log("Синк дууслаа:", data?.results);
        if (data?.reloadPage && this.isClientSide()) {
          console.log("Шинэ өгөгдөл синк хийсэн тул хуудсыг дахин ачаалж байна...");
          window.location.reload();
        }
        break;

      case "PAYMENT_SAVED_OFFLINE":
        console.log("Төлбөр оффлайн хадгалагдлаа:", payment);
        if (typeof this.onPaymentSavedOffline === "function") {
          this.onPaymentSavedOffline(payment);
        }
        break;

      default:
        console.log("Танигдаагүй SW мессеж:", type, data);
    }
  };

  onServiceWorkerUpdate() {
    if (!this.isClientSide()) return;
    if (confirm("Шинэ хувилбар байна. Та хуудсыг дахин ачаалж шинэчлэлт авах уу?")) {
      window.location.reload();
    }
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
      console.error("Service Worker бэлэн биш байна:", err);
      return false;
    }
  }

  async unregister() {
    if (!this.isClientSide() || !this.swRegistration) return false;
    try {
      const result = await this.swRegistration.unregister();
      this.swRegistration = null;
      console.log("Service Worker бүртгэл цуцлагдлаа:", result);
      return result;
    } catch (err) {
      console.error("Service Worker бүртгэл цуцлахад алдаа гарлаа:", err);
      return false;
    }
  }

  cleanup() {
    if (!this.isClientSide()) return;
    try {
      navigator.serviceWorker.removeEventListener("message", this.handleMessage);
    } catch (err) {
      console.error("Цэвэрлэгээ хийх үед алдаа гарлаа:", err);
    }
  }
}

// Client талд инстанс үүсгэх
export const swHelper =
  typeof window !== "undefined" && typeof navigator !== "undefined"
    ? new ServiceWorkerHelper()
    : null;

// Аюулгүй wrapper функцууд
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
