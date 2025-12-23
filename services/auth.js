import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { message } from "antd";
import { setCookie, parseCookies } from "nookies";
import uilchilgee from "./uilchilgee";
import { ekhniiTsonkhruuOchyo } from "tools/logic/khereglegchiinErkhiinTokhirgoo";
import useAjiltan from "hooks/useAjiltan";
import useBaiguullaga from "hooks/useBaiguullaga";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  attemptLogin,
  saveOfflineAuth,
  clearOfflineAuth,
  hasOfflineAuth,
  getCachedPermissionsData,
} from "../utils/offlineAuth";
import { registerServiceWorker } from "../utils/swHelper";

const isOnline = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return true;
  }
  return navigator.onLine;
};

const AuthContext = createContext({});

export const useBarilga = () => {
  const [barilgiinId, setBarilgiinId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const barilgaSoliyo = useCallback((id, ajiltan) => {
    const tukhainBarilga = ajiltan?.salbaruud?.find(
      (salbar) => salbar?.salbariinId === id
    );
    if (!tukhainBarilga && ajiltan?.erkh !== "Admin") {
      return message.warn("Ажилтанд барилгын тохиргоо хийгдээгүй байна");
    } else {
      if (
        moment(tukhainBarilga?.duusakhOgnoo)
          .startOf("day")
          .isBefore(moment().startOf("day"))
      ) {
        return message.warn("Тухайн барилгын лиценз дууссан байна");
      }
    }
    setBarilgiinId(id);
    setCookie(null, "barilgiinId", id, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }, []);

  useEffect(() => {
    if (isInitialized) return;

    const initializeBarilga = async () => {
      try {
        const cookies = parseCookies();
        const { barilgiinId: cookieBarilgiinId } = cookies;

        if (cookieBarilgiinId && cookieBarilgiinId !== "undefined") {
          setBarilgiinId(cookieBarilgiinId);
        }
        setIsInitialized(true);
      } catch (error) {
        setIsInitialized(true);
      }
    };

    initializeBarilga();
  }, [isInitialized]);

  return { barilgiinId, barilgaSoliyo };
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [baiguulgiinErkhiinJagsaalt, setBaiguulgiinErkhiinJagsaalt] = useState(
    []
  );

  const { ajiltan, ajiltanMutate } = useAjiltan(token);
  const { baiguullaga, baiguullagaMutate } = useBaiguullaga(
    token,
    ajiltan?.baiguullagiinId
  );
  const { barilgaSoliyo, barilgiinId } = useBarilga();
  const { t } = useTranslation();

  const hasInitialized = useRef(false);
  const networkListenersAttached = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || hasInitialized.current) return;

    hasInitialized.current = true;

    const initializeApp = async () => {
      try {
        await initializeServiceWorker();
        await initializeAuthState();
        setupNetworkListeners();

        try {
          await getCachedPermissionsData();
        } catch (error) {}
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initializeApp();

    return () => {
      if (networkListenersAttached.current) {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        networkListenersAttached.current = false;
      }
    };
  }, [isClient]);

  const initializeServiceWorker = async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    try {
      await registerServiceWorker();
    } catch (error) {}
  };

  const initializeAuthState = async () => {
    try {
      const d = parseCookies();
      const storedToken = d?.tureestoken;

      if (!storedToken && !isOnline()) {
        const hasOfflineCredentials = await hasOfflineAuth();
        if (hasOfflineCredentials) {
          message.info("Оффлайн горимд нэвтрэх боломжтой байна");
        }
      } else if (storedToken) {
        setToken(storedToken);
      }

      const erkh = localStorage.getItem("baiguulgiinErkhiinJagsaalt");
      setBaiguulgiinErkhiinJagsaalt(JSON.parse(erkh) || []);
    } catch (error) {}
  };

  const setupNetworkListeners = () => {
    if (networkListenersAttached.current || typeof window === "undefined")
      return;

    networkListenersAttached.current = true;
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
  };

  const handleOnline = useCallback(() => {
    const wasOffline = isOfflineMode;
    setIsOfflineMode(false);
    message.success("Интернэт холбогдлоо");

    if (wasOffline) {
      syncOfflineData();
    }
  }, [isOfflineMode]);

  const handleOffline = useCallback(() => {
    setIsOfflineMode(true);
    message.warning(
      "Таны интернэт тасарсан байна. Интернетгүй орчинд ажиллаж байна.",
      0
    );
  }, []);

  const syncOfflineData = useCallback(async () => {
    if (token) {
      try {
        ajiltanMutate();
        baiguullagaMutate();
        message.success("Өгөгдөл шинэчлэгдлээ");
      } catch (error) {}
    }
  }, [token, ajiltanMutate, baiguullagaMutate]);

  const performOnlineLogin = async (khereglech) => {
    return new Promise((resolve, reject) => {
      uilchilgee()
        .post("/ajiltanNevtrey", khereglech)
        .then(async ({ data, status }) => {
          if (status === 200 && data) {
            let permissionsData = null;

            try {
              const res = await uilchilgee(data.token).post(
                "/erkhiinMedeelelAvya"
              );
              permissionsData = res.data;
            } catch (error) {
              permissionsData = { moduluud: [], offlineFallback: true };
            }

            if (
              permissionsData &&
              (permissionsData.moduluud?.length > 0 ||
                permissionsData.offlineFallback)
            ) {
              const loginResult = {
                token: data.token,
                result: data.result,
                permissionsData,
              };

              try {
                await saveOfflineAuth(khereglech, loginResult);
              } catch (e) {}

              resolve(loginResult);
            } else {
              reject(new Error("Хуудсыг дахин ачаалална уу"));
            }
          } else {
            reject(new Error("Хэрэглэгчийн мэдээлэл буруу байна"));
          }
        })
        .catch(reject);
    });
  };

  const processSuccessfulLogin = useCallback(
    async (loginData, isOffline = false) => {
      const { token: loginToken, result, permissionsData } = loginData;

      setCookie(null, "tureestoken", loginToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      setToken(loginToken);
      ajiltanMutate(result);

      // Clear login page from service worker cache after successful login
      if (
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        navigator.serviceWorker.controller
      ) {
        try {
          // Send message to service worker to clear login page cache
          navigator.serviceWorker.controller.postMessage({
            type: "CLEAR_LOGIN_CACHE",
          });

          // Also directly clear cache if possible
          if ("caches" in window) {
            const cacheNames = await caches.keys();
            for (const cacheName of cacheNames) {
              const cache = await caches.open(cacheName);
              const loginPageUrls = [
                new Request("/", { method: "GET" }),
                new Request("/login", { method: "GET" }),
              ];
              await Promise.all(
                loginPageUrls.map((url) => cache.delete(url).catch(() => {}))
              );
            }
          }
        } catch (error) {
          // Silently fail if cache clearing doesn't work
          console.debug("Cache clear attempt:", error);
        }
      }

      if (result?.barilguud?.length > 0 || result?.erkh === "Admin") {
        let solikhBarilgaOldsonEsekh = false;
        if (Array.isArray(result?.salbaruud)) {
          for (const salbar of result?.salbaruud || []) {
            if (result?.erkh !== "Admin") {
              for (const barilga of result?.barilguud || []) {
                if (salbar?.salbariinId === barilga) {
                  if (
                    moment(salbar?.duusakhOgnoo)
                      .startOf("day")
                      .isAfter(moment().startOf("day"))
                  ) {
                    solikhBarilgaOldsonEsekh = true;
                    barilgaSoliyo(salbar?.salbariinId, result);
                    break;
                  }
                }
              }
            } else if (
              moment(salbar?.duusakhOgnoo)
                .startOf("day")
                .isAfter(moment().startOf("day"))
            ) {
              solikhBarilgaOldsonEsekh = true;
              barilgaSoliyo(salbar?.salbariinId, result);
              break;
            }
          }
          if (!solikhBarilgaOldsonEsekh) {
            message.warn("Лицензийн хугацаа дууссан байна!");
            return;
          }
        } else {
          message.warn("Лицензийн хугацаа дууссан байна!");
          return;
        }
      }

      if (!isOffline && permissionsData) {
        ekhniiTsonkhruuOchyo(result, loginToken, setBaiguulgiinErkhiinJagsaalt);
      } else if (isOffline) {
        const offlinePermissions = permissionsData;
        if (offlinePermissions) {
          ekhniiTsonkhruuOchyo(
            result,
            loginToken,
            setBaiguulgiinErkhiinJagsaalt,
            offlinePermissions
          );
        }
      }

      if (isOffline) {
        message.success("Интернетгүй үед амжилттай нэвтэрлээ");
      } else {
        message.success("Амжилттай нэвтэрлээ");
      }
    },
    [ajiltanMutate, barilgaSoliyo]
  );

  const auth = useMemo(
    () => ({
      newterya: async (khereglech) => {
        if (!khereglech.nevtrekhNer) {
          message.warning("Нэвтрэх нэрийг бөглөнө үү");
          return;
        }
        if (!khereglech.nuutsUg) {
          message.warning("Нууц үгийг бөглөнө үү");
          return;
        }

        if (khereglech.namaigsana) {
          localStorage.setItem("newtrekhNerTurees", khereglech.nevtrekhNer);
        }

        try {
          const loginResult = await attemptLogin(
            khereglech,
            performOnlineLogin
          );

          if (loginResult.success) {
            if (loginResult.mode === "offline") {
              setIsOfflineMode(true);
              processSuccessfulLogin(loginResult.data, true);
            } else {
              setIsOfflineMode(false);
              processSuccessfulLogin(loginResult.data, false);
            }
          } else {
            message.error(loginResult.error || "Нэвтрэлт амжилтгүй боллоо");
          }
        } catch (error) {
          const errorMessage =
            error.message || error.toString() || "Нэвтрэх явцад алдаа гарлаа";
          message.warning(errorMessage);
        }
      },

      garya: async () => {
        try {
          setCookie(null, "tureestoken", "", { maxAge: -1, path: "/" });
          setCookie(null, "barilgiinId", "", { maxAge: -1, path: "/" });
          localStorage.removeItem("baiguulgiinErkhiinJagsaalt");
          localStorage.removeItem("newtrekhNerTurees");

          setToken(null);
          setIsOfflineMode(false);

          window.location.href = "/";
        } catch (error) {
          window.location.href = "/";
        }
      },

      hasOfflineAccess: async () => {
        return await hasOfflineAuth();
      },

      clearOfflineDataOnly: async () => {
        try {
          await clearOfflineAuth();
          message.success("Интернетгүй үеийн мэдээлэл устгагдлаа");
        } catch (error) {
          message.error("Интернетгүй үеийн мэдээлэл устгахад алдаа гарлаа");
        }
      },

      forceSyncData: async () => {
        if (isOnline() && token) {
          try {
            await syncOfflineData();
            message.success("Мэдээлэл амжилттай шинэчлэгдлээ хийгдлээ");
          } catch (error) {
            message.error("Шинэчлэл хийхэд алдаа гарлаа");
          }
        } else {
          message.warning("Интернэт холболт шаардлагатай");
        }
      },

      isOfflineMode,
      isOnline: isOnline(),
      token,
      ajiltan,
      baiguullaga,
      baiguullagaMutate,
      ajiltanMutate,
      setToken,
      barilgaSoliyo,
      barilgiinId,
      baiguulgiinErkhiinJagsaalt,
    }),
    [
      token,
      ajiltan,
      baiguullaga,
      barilgiinId,
      baiguulgiinErkhiinJagsaalt,
      isOfflineMode,
      barilgaSoliyo,
      processSuccessfulLogin,
      syncOfflineData,
      ajiltanMutate,
      baiguullagaMutate,
    ]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
