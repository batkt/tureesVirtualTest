import axios from "axios";

export const FSM_BASE_URL = "http://103.143.40.175:8000";

/** Base axios instance (no auth) */
const fsmApi = axios.create({
  baseURL: FSM_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Returns an axios instance with the Bearer token injected.
 * Usage: fsmApi.withAuth(token).get("/projects")
 */
fsmApi.withAuth = (token) =>
  axios.create({
    baseURL: FSM_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

export default fsmApi;
