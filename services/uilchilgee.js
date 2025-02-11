import { notification } from "antd";
import axios from "axios";
import socketIOClient from "socket.io-client";
import _ from "lodash";
import getConfig from "next/config";
import { t } from "i18next";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export const url =
  //  "http://192.168.1.13:8081";
  publicRuntimeConfig.URL || "https://turees.zevtabs.mn/api";

export const socket = () =>
  socketIOClient(publicRuntimeConfig.SOCKET || "https://turees.zevtabs.mn", {
    transports: ["websocket"],
  });

export const aldaaBarigch = (e) => {
  if (e?.response?.data?.aldaa === "jwt expired" || e?.response?.data?.aldaa === "jwt malformed") 
    window.location.href = "/";
  else if (!!e?.response?.data?.aldaa)
    notification.warning({
      description: t(e?.response?.data?.aldaa),
      message: t("Анхааруулга"),
    });
};

/*axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
});*/

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
        ? serverRuntimeConfig.HTTP_URL || "http://103.143.40.230:8081"
        : url,
    headers,
  });
};

export default uilchilgee;
