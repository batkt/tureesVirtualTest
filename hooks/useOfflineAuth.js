import { useState, useEffect, useRef } from "react";

export default function useOfflineAuth() {
  const [isOffline, setIsOffline] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasOfflineCredentials, setHasOfflineCredentials] = useState(false);

  // Олон удаа эхлэхээс сэргийлэх
  const hasInitialized = useRef(false);
  const networkListenersAttached = useRef(false);

  // Клиент тал эхлэх
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setIsClient(true);

      if (typeof navigator !== "undefined") {
        const online = navigator.onLine;
        setIsOffline(!online);
      }
    }
  }, []);

  // Сүлжээний сонсогчид - нэг удаа холбох
  useEffect(() => {
    if (
      !isClient ||
      networkListenersAttached.current ||
      typeof navigator === "undefined"
    ) {
      return;
    }

    networkListenersAttached.current = true;

    function onOnline() {
      setIsOffline(false);
      // Энд автомат шинэчлэлт үү - зөвхөн төлөв шинэчлэнэ
    }

    function onOffline() {
      setIsOffline(true);
      // Энд автомат шинэчлэлтгүй - зөвхөн төлөв шинэчлэнэ
    }

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      networkListenersAttached.current = false;
    };
  }, [isClient]);

  // Service Worker сонсогчид - АВТОМАТ ШИНЭЧЛЭЛТГҮЙ
  useEffect(() => {
    if (
      !isClient ||
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    const handleServiceWorkerMessage = (event) => {
      const { data } = event;

      if (!data?.type) return;

      switch (data.type) {
        case "SYNC_COMPLETED":
          break;

        case "CACHE_UPDATED":
          break;

        case "PAYMENT_SAVED_OFFLINE":
          break;

        default:
          break;
      }
    };

    navigator.serviceWorker.addEventListener(
      "message",
      handleServiceWorkerMessage
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "message",
        handleServiceWorkerMessage
      );
    };
  }, [isClient]);

  // Туслах функцууд
  async function checkOfflineCredentials() {
    try {
      const available = await hasOfflineAuth();
      setHasOfflineCredentials(available);
    } catch (error) {
      setHasOfflineCredentials(false);
    }
  }

  async function performLogin(credentials, onlineLoginFunction) {
    try {
      const result = await attemptLogin(credentials, onlineLoginFunction);
      return result;
    } catch (error) {
      throw error;
    }
  }

  return {
    isOffline,
    hasOfflineCredentials,
    performLogin,
    checkOfflineCredentials,
  };
}
