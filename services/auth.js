import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { message } from "antd";
import { setCookie, parseCookies } from "nookies";
import uilchilgee from "./uilchilgee";
import { ekhniiTsonkhruuOchyo } from "tools/logic/khereglegchiinErkhiinTokhirgoo";
import useAjiltan from "hooks/useAjiltan";
import useBaiguullaga from "hooks/useBaiguullaga";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { getCachedPermissionsData } from "../utils/offlineAuth";

import {
  attemptLogin,
  storeLoginData,
  clearOfflineData,
  isOnline as utilsIsOnline,
  getCachedUserData,
  getCachedToken,
  hasValidOfflineAuth,
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

  useEffect(() => {
    (async () => {
      const { barilgiinId } = await parseCookies();
      if (barilgiinId && barilgiinId !== "undefined")
        setBarilgiinId(barilgiinId);
    })();
  }, []);

  const barilgaSoliyo = (id, ajiltan) => {
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
  };

  return { barilgiinId, barilgaSoliyo };
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [baiguulgiinErkhiinJagsaalt, setBaiguulgiinErkhiinJagsaalt] = useState([]);
  
  const { ajiltan, ajiltanMutate } = useAjiltan(token);
  const { baiguullaga, baiguullagaMutate } = useBaiguullaga(
    token,
    ajiltan?.baiguullagiinId
  );
  const { barilgaSoliyo, barilgiinId } = useBarilga();
  const { t } = useTranslation();

  // Refs to prevent multiple initializations
  const hasInitialized = useRef(false);
  const networkListenersAttached = useRef(false);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize everything once on client side
  useEffect(() => {
    if (!isClient || hasInitialized.current) return;
    
    hasInitialized.current = true;
    
    const initializeApp = async () => {
      await initializeServiceWorker();
      await initializeAuthState();
      setupNetworkListeners();
      
      try {
        const data = await getCachedPermissionsData();
        console.log("Кэшинээс уншсан эрхийн өгөгдөл:", data);
      } catch (error) {
        console.warn("Кэшинээс эрхийн өгөгдөл авахад алдаа гарлаа:", error);
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
      console.warn("Сервис воркер дэмжигдэхгүй байна");
      return;
    }

    try {
      await registerServiceWorker();
      console.log("Сервис воркер амжилттай ажиллалаа");
    } catch (error) {
      console.warn("Сервис воркерийн эхлэлт амжилтгүй:", error);
    }
  };

  const initializeAuthState = async () => {
    try {
      const d = parseCookies();
      const storedToken = d?.tureestoken;

      if (!storedToken && !isOnline()) {
        const hasOfflineAuth = await hasValidOfflineAuth();
        if (hasOfflineAuth) {
          message.info(t("Оффлайн горимд нэвтрэх боломжтой"));
        }
      } else if (storedToken) {
        setToken(storedToken);
      }

      const erkh = localStorage.getItem("baiguulgiinErkhiinJagsaalt");
      setBaiguulgiinErkhiinJagsaalt(JSON.parse(erkh) || []);
    } catch (error) {
      console.error("Нэвтрэх төлөв эхлүүлэхэд алдаа гарлаа:", error);
    }
  };

  const setupNetworkListeners = () => {
    if (networkListenersAttached.current || typeof window === "undefined") return;
    
    networkListenersAttached.current = true;
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
  };

  const handleOnline = () => {
    const wasOffline = isOfflineMode;
    setIsOfflineMode(false);
    message.success(t("Интернэт холбогдлоо"));

    if (wasOffline) {
      syncOfflineData();
    }
  };

  const handleOffline = () => {
    setIsOfflineMode(true);
    message.warning(
      t("Таны интернэт тасарсан байна. Оффлайн горимд ажиллаж байна."),
      0
    );
  };

  const syncOfflineData = async () => {
    console.log("Оффлайн өгөгдөл синк хийж байна...");
    if (token) {
      try {
        ajiltanMutate();
        baiguullagaMutate();
      } catch (error) {
        console.warn("Өгөгдөл синк хийхэд алдаа гарлаа:", error);
      }
    }
  };

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
              console.warn("Эрхийн мэдээлэл татахад алдаа гарлаа, оффлайн горимын эрх хадгалж байна");
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
                await storeLoginData(khereglech, loginResult);
                console.log("Оффлайн нэвтрэлтийн өгөгдөл амжилттай хадгалагдлаа");
              } catch (e) {
                console.warn("Оффлайн нэвтрэлтийн өгөгдөл хадгалахад алдаа гарлаа", e);
              }

              resolve(loginResult);
            } else {
              reject(
                new Error("Байгууллагын эрхийн тохиргоо хийгдээгүй байна")
              );
            }
          } else {
            reject(new Error("Хэрэглэгчийн мэдээлэл буруу байна"));
          }
        })
        .catch(reject);
    });
  };

  const processSuccessfulLogin = async (loginData, isOffline = false) => {
    const { token: loginToken, result, permissionsData } = loginData;

    setCookie(null, "tureestoken", loginToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    setToken(loginToken);
    ajiltanMutate(result);

    if (result?.barilguud?.length > 0 || result.erkh === "Admin") {
      let solikhBarilgaOldsonEsekh = false;
      if (Array.isArray(result?.salbaruud)) {
        for (const salbar of result.salbaruud) {
          if (result.erkh !== "Admin") {
            for (const barilga of result.barilguud) {
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
          message.warn(t("Лицензийн хугацаа дууссан байна!"));
          return;
        }
      } else {
        message.warn(t("Лицензийн хугацаа дууссан байна!"));
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
      message.success(t("Оффлайн горимд амжилттай нэвтэрлээ"));
    } else {
      message.success(t("Амжилттай нэвтэрлээ"));
    }
  };

  // Memoize the auth object with stable dependencies
  const auth = useMemo(
    () => ({
      newterya: async (khereglech) => {
        if (!khereglech.nevtrekhNer) {
          message.warning(t("Нэвтрэх нэрийг бөглөнө үү"));
          return;
        }
        if (!khereglech.nuutsUg) {
          message.warning(t("Нууц үгийг бөглөнө үү"));
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
            message.error(loginResult.error || t("Нэвтрэлт амжилтгүй боллоо"));
          }
        } catch (error) {
          console.error("Нэвтрэх явцад алдаа гарлаа:", error);
          message.error(t("Нэвтрэх үед алдаа гарлаа"));
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
          console.error("Гарах үед алдаа гарлаа:", error);
          window.location.href = "/";
        }
      },

      hasOfflineAccess: async () => {
        return await hasValidOfflineAuth();
      },

      getCachedUserData: async () => {
        return await getCachedUserData();
      },

      getCachedToken: async () => {
        return await getCachedToken();
      },

      clearOfflineDataOnly: async () => {
        try {
          await clearOfflineData();
          message.success(t("Оффлайн өгөгдөл устгагдлаа"));
        } catch (error) {
          console.error("Оффлайн өгөгдөл устгахад алдаа гарлаа:", error);
          message.error(t("Оффлайн өгөгдөл устгахад алдаа гарлаа"));
        }
      },

      forceSyncData: async () => {
        if (isOnline() && token) {
          try {
            await syncOfflineData();
            message.success(t("Өгөгдөл амжилттай синк хийгдлээ"));
          } catch (error) {
            console.error("Синк хийхэд алдаа гарлаа:", error);
            message.error(t("Синк хийхэд алдаа гарлаа"));
          }
        } else {
          message.warning(t("Интернэт холболт шаардлагатай"));
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
    ]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
