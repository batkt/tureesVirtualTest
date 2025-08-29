import { notification } from "antd";
import axios from "axios";
import socketIOClient from "socket.io-client";
import _ from "lodash";
import getConfig from "next/config";
import { t } from "i18next";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export const url = publicRuntimeConfig.URL || "https://turees.zevtabs.mn/api";

// Singleton socket instance
let socketInstance = null;

// Enhanced socket function with singleton pattern
export const socket = () => {
  if (!socketInstance) {
    socketInstance = socketIOClient(
      publicRuntimeConfig.SOCKET || "https://turees.zevtabs.mn",
      {
        transports: ["websocket", "polling"],
        upgrade: true,
        rememberUpgrade: true,
        timeout: 20000,
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10, // Increased
        reconnectionDelayMax: 3000, // Reduced
        maxReconnectionAttempts: 15, // Increased
        forceNew: false, // Important: reuse connection
      }
    );

    // Global socket event handlers
    socketInstance.on("connect", () => {
      console.log("Socket connected globally:", socketInstance.id);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected globally:", reason);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
    });
  }

  return socketInstance;
};

// Function to reset socket (use if needed for debugging)
export const resetSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const aldaaBarigch = (e) => {
  if (
    e?.response?.data?.aldaa === "jwt expired" ||
    e?.response?.data?.aldaa === "jwt malformed"
  ) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  } else if (!!e?.response?.data?.aldaa) {
    notification.warning({
      description: t(e?.response?.data?.aldaa),
      message: t("Анхааруулга"),
    });
  }
};

const uilchilgee = (token) => {
  const headers = {
    "Content-type": "application/json",
  };
  if (!!token) headers["Authorization"] = `bearer ${token}`;
  return axios.create({
    baseURL:
      typeof window === "undefined"
        ? serverRuntimeConfig.HTTP_URL || "http://103.143.40.230:8081"
        : url,
    headers,
  });
};

export default uilchilgee;
