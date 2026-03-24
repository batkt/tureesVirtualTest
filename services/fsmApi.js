import axios from "axios";
import { io } from "socket.io-client";

export const FSM_BASE_URL = "http://103.143.40.175:8000";
export const FSM_BASE_URL_ZEV = "https://fsm.zevtabs.mn";

/** Base axios instance (no auth) */
const fsmApi = axios.create({
  baseURL: FSM_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Returns an axios instance with the Bearer token injected.
 * Usage: fsmApi.withAuth(token).get("/projects")
 */
fsmApi.withAuth = (token, baseURL = FSM_BASE_URL) =>
  axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

/** FSM Socket.IO client */
export const fsmSocket = (baseURL = FSM_BASE_URL) =>
  io(baseURL, {
    transports: ["websocket", "polling"],
  });

export default fsmApi;
