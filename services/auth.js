import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
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
// Offline auth utilities
import {
  attemptLogin,
  storeLoginData,
  clearOfflineData,
  isOnline as utilsIsOnline,
  getCachedUserData,
  getCachedToken,
  hasValidOfflineAuth,
} from "../utils/offlineAuth";

// Service worker helper
import { registerServiceWorker } from "../utils/swHelper";

// Safe isOnline function that works in both client and server environments
const isOnline = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return true; // Assume online during SSR
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
  const { ajiltan, ajiltanMutate } = useAjiltan(token);
  const [baiguulgiinErkhiinJagsaalt, setBaiguulgiinErkhiinJagsaalt] = useState(
    []
  );
  const { baiguullaga, baiguullagaMutate } = useBaiguullaga(
    token,
    ajiltan?.baiguullagiinId
  );
  const { barilgaSoliyo, barilgiinId } = useBarilga();

  const { t } = useTranslation();

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      initializeServiceWorker();
      initializeAuthState();
      setupNetworkListeners();
      
      // Initialize cached permissions data
      getCachedPermissionsData().then((data) => {
        console.log("Cached permissions data:", data);
      }).catch((error) => {
        console.warn("Failed to get cached permissions data:", error);
      });

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  const initializeServiceWorker = async () => {
    try {
      await registerServiceWorker();
      console.log("Service Worker initialized");
    } catch (error) {
      console.warn("Service Worker initialization failed:", error);
    }
  };

  const initializeAuthState = async () => {
    if (typeof window === "undefined") return; // prevent SSR crash
    
    try {
      const d = parseCookies();
      const storedToken = d?.tureestoken;

      if (!storedToken && !isOnline()) {
        const hasOfflineAuth = await hasValidOfflineAuth();
        if (hasOfflineAuth) {
          message.info(t("Офлайн горимд нэвтрэх боломжтой"));
        }
      } else if (storedToken) {
        setToken(storedToken);
      }

      const erkh = localStorage.getItem("baiguulgiinErkhiinJagsaalt");
      setBaiguulgiinErkhiinJagsaalt(JSON.parse(erkh) || []);
    } catch (error) {
      console.error("Error initializing auth state:", error);
    }
  };

  const setupNetworkListeners = () => {
    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }
  };

  const handleOnline = () => {
    setIsOfflineMode(false);
    message.success(t("Интернэтэд холбогдлоо"));

    if (isOfflineMode) {
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
    console.log("Syncing offline data...");
    if (token) {
      try {
        ajiltanMutate();
        baiguullagaMutate();
      } catch (error) {
        console.warn("Failed to sync data:", error);
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
              console.warn(
                "Failed to fetch permissions, storing minimal offline permissions"
              );
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
                console.log("Offline login data stored successfully");
              } catch (e) {
                console.warn("Failed to store offline login data", e);
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
      // Offline: use cached permissions data from offlineAuth.js
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
      message.success(t("Офлайн горимд амжилттай нэвтэрлээ"));
    } else {
      message.success(t("Амжилттай нэвтэрлээ"));
    }
  };

  const auth = useMemo(
    () => ({
      newterya: async (khereglech) => {
        if (!khereglech.nevtrekhNer) {
          message.warning(t("Нэвтрэх нэр талбарыг бөглөнө үү"));
          return;
        }
        if (!khereglech.nuutsUg) {
          message.warning(t("Нууц үг талбарыг бөглөнө үү"));
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
            message.error(loginResult.error || t("Нэвтрэх амжилтгүй"));
          }
        } catch (error) {
          console.error("Login error:", error);
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
          console.error("Logout error:", error);
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
          message.success(t("Офлайн өгөгдөл устгагдлаа"));
        } catch (error) {
          console.error("Error clearing offline data:", error);
          message.error(t("Офлайн өгөгдөл устгахад алдаа гарлаа"));
        }
      },

      forceSyncData: async () => {
        if (isOnline() && token) {
          try {
            await syncOfflineData();
            message.success(t("Өгөгдөл амжилттай синк хийгдлээ"));
          } catch (error) {
            console.error("Sync error:", error);
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