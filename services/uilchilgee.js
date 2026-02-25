import { notification } from "antd";
import axios from "axios";
import socketIOClient from "socket.io-client";
import _ from "lodash";
import { t } from "i18next";
//production
export const url =
  process.env.NEXT_PUBLIC_URL || "https://turees.zevtabs.mn/api";
export const socket = () =>
  socketIOClient(
    process.env.NEXT_PUBLIC_SOCKET || "https://turees.zevtabs.mn",
    {
      transports: ["websocket"],
    },
  );
// test
// export const url = "http://103.143.40.175:8081";
// export const socket = () =>
//   socketIOClient("http://103.143.40.175:8081", {
//     transports: ["websocket"],
//   });

export const aldaaBarigch = (e) => {
  if (
    e?.response?.data?.offline ||
    e?.message === "Network Error" ||
    e?.code === "ERR_NETWORK"
  ) {
    return;
  }

  if (
    e?.response?.data?.aldaa === "jwt expired" ||
    e?.response?.data?.aldaa === "jwt malformed"
  ) {
    window.location.href = "/";
  } else if (!!e?.response?.data?.aldaa) {
    // CRITICAL FIX: Ensure aldaa is always a string
    let aldaaMsg;

    if (typeof e.response.data.aldaa === "string") {
      aldaaMsg = e.response.data.aldaa;
    } else if (typeof e.response.data.aldaa === "object") {
      aldaaMsg =
        e.response.data.aldaa.message || JSON.stringify(e.response.data.aldaa);
    } else {
      aldaaMsg = String(e.response.data.aldaa);
    }

    notification.warning({
      description: t(aldaaMsg),
      message: t("Анхааруулга"),
    });
  }
};

export const togloomUilchilgee = (token) => {
  const headers = {
    "Content-type": "application/json",
  };
  if (!!token) headers["Authorization"] = `bearer ${token}`;
  return axios.create({
    baseURL: "http://localhost:5000/api",
    headers,
  });
};

export const zogsoolUilchilgee = (token) => {
  const headers = {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  if (!!token) headers["Authorization"] = `bearer ${token}`;
  return axios.create({
    baseURL: "http://localhost:5000/api",
    headers,
  });
};

const uilchilgee = (token) => {
  const headers = {
    "Content-type": "application/json",
  };
  if (!!token) headers["Authorization"] = `bearer ${token}`;
  return axios.create({
    baseURL:
      typeof window === "undefined"
        ? process.env.HTTP_URL || "http://103.143.40.230:8081"
        : url,
    headers,
  });
};

export default uilchilgee;
