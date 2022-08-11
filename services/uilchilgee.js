import { notification } from "antd";
import axios from "axios";
import socketIOClient from "socket.io-client";
import _ from "lodash";

// function hostnameAvya() {
//   return global.window?.location?.hostname
// }

//export const url = `http://${hostnameAvya() || 'localhost'}:8081`;
//export const url = `http://localhost:8081`;
//export const url = "http://192.168.0.103:8081"
export const url = "https://turees.zevtabs.mn";

export const socket = () => socketIOClient(url, { transports: ["websocket"] });

export const aldaaBarigch = (e) => {
  if (e?.response?.data?.aldaa === "jwt expired") {
    window.location.href = "/";
  } else if (!!e?.response?.data?.aldaa)
    notification.error({
      description: e?.response?.data?.aldaa,
      message: "Алдаа",
    });
  else if (!!e?.response?.errors)
    notification.error({
      description: JSON.stringify(e?.response?.errors),
      message: "Алдаа",
    });
  else notification.error({ description: JSON.stringify(e), message: "Алдаа" });
};

/*axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
});*/

const uilchilgee = (token) => {
  const headers = {
    "Content-type": "application/json",
  };
  if (!!token) headers["Authorization"] = `bearer ${token}`;
  return axios.create({
    baseURL:
      typeof window === "undefined"
        ? "http://103.143.40.230:8081"
        : url + "/api",
    headers,
  });
};

export default uilchilgee;
