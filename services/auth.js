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
import { toast } from "sonner";
import { setCookie, parseCookies } from "nookies";
import uilchilgee, { url as API_URL } from "./uilchilgee";
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

const isOnline = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return true;
  }
  return navigator.onLine;
};
// Heartbeat check to detect real network connectivity using the API server
const HEARTBEAT_URL = API_URL || "http://103.143.40.175:8081";
// const HEARTBEAT_URL = API_URL || "https://turees.zevtabs.mn/api";
const heartbeatCheck = async (url = HEARTBEAT_URL, timeout = 5000) => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    // Use a proper API endpoint instead of no-cors HEAD request
    const checkUrl = `${url}/api/health?_t=${Date.now()}`;

    const response = await fetch(checkUrl, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(id);

    // Check if we got a response and it's from our server
    return response.ok || response.status < 500;
  } catch (error) {
    // Network error, timeout, or abort - definitely offline
    return false;
  }
};

const AuthContext = createContext({});

export const useBarilga = () => {
  const [barilgiinId, setBarilgiinId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const barilgaSoliyo = useCallback((id, ajiltan) => {
    const tukhainBarilga = ajiltan?.salbaruud?.find(
      (salbar) => salbar?.salbariinId === id,
    );
    if (!tukhainBarilga && ajiltan?.erkh !== "Admin") {
      toast.warning("Ажилтанд барилгын тохиргоо хийгдээгүй байна");
      return;
    } else {
      if (
        moment(tukhainBarilga?.duusakhOgnoo)
          .startOf("day")
          .isBefore(moment().startOf("day"))
      ) {
        toast.warning("Тухайн барилгын лиценз дууссан байна");
        return;
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
  // Initialize isOfflineMode based on navigator.onLine immediately
  const [isOfflineMode, setIsOfflineMode] = useState(() => {
    if (typeof navigator !== "undefined") {
      return !navigator.onLine;
    }
    return false;
  });
  const heartbeatInterval = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [baiguulgiinErkhiinJagsaalt, setBaiguulgiinErkhiinJagsaalt] = useState(
    [],
  );

  const { ajiltan, ajiltanMutate } = useAjiltan(token);
  const { baiguullaga, baiguullagaMutate } = useBaiguullaga(
    token,
    ajiltan?.baiguullagiinId,
  );
  const { barilgaSoliyo, barilgiinId } = useBarilga();
  const { t } = useTranslation();

  const syncOfflineData = useCallback(async () => {
    if (token) {
      try {
        ajiltanMutate();
        baiguullagaMutate();
        toast.success("Өгөгдөл шинэчлэгдлээ");
      } catch (error) {}
    }
  }, [token, ajiltanMutate, baiguullagaMutate]);

  const hasInitialized = useRef(false);
  const isOfflineModeRef = useRef(isOfflineMode);

  useEffect(() => {
    isOfflineModeRef.current = isOfflineMode;
  }, [isOfflineMode]);

  useEffect(() => {
    setIsClient(true);
    // Immediately check navigator.onLine on client mount
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOfflineMode(true);
    }
  }, []);

  // Heartbeat effect for real network detection
  useEffect(() => {
    if (!isClient) return;

    // Network detection based on browser events only - no polling
    const handleOnline = async () => {
      const wasOffline = isOfflineModeRef.current;
      // Verify actual connectivity before switching to online mode
      const online = await heartbeatCheck();
      if (online) {
        setIsOfflineMode(false);
        toast.success("Интернэт холбогдлоо");
        if (wasOffline) syncOfflineData();
      }
    };

    const handleOffline = () => {
      setIsOfflineMode(true);
      toast.warning(
        "Таны интернэт тасарсан байна. Интернетгүй орчинд ажиллаж байна.",
        0,
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial state once only
    const checkInitialState = async () => {
      const navOnline =
        typeof navigator !== "undefined" ? navigator.onLine : true;
      if (!navOnline && !isOfflineModeRef.current) {
        setIsOfflineMode(true);
        toast.warning(
          "Таны интернэт тасарсан байна. Интернетгүй орчинд ажиллаж байна.",
          0,
        );
      }
    };
    checkInitialState();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isClient, syncOfflineData]);

  useEffect(() => {
    if (!isClient || hasInitialized.current) return;

    hasInitialized.current = true;

    const initializeApp = async () => {
      try {
        await initializeAuthState();
        try {
          await getCachedPermissionsData();
        } catch (error) {}
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initializeApp();

    return () => {};
  }, [isClient]);

  const initializeAuthState = async () => {
    try {
      const d = parseCookies();
      const storedToken = d?.tureestoken;

      if (storedToken) {
        setToken(storedToken);
      }

      const erkh = localStorage.getItem("baiguulgiinErkhiinJagsaalt");
      setBaiguulgiinErkhiinJagsaalt(JSON.parse(erkh) || []);
    } catch (error) {}
  };

  const performOnlineLogin = async (khereglech) => {
    return new Promise((resolve, reject) => {
      uilchilgee()
        .post("/ajiltanNevtrey", khereglech)
        .then(async ({ data, status }) => {
          if (status === 200 && data) {
            // Handle both response structures: {result, token} or {data: {result, token}}
            const token = data.token || data.data?.token;
            const result = data.result || data.data?.result;

            if (!token || !result) {
              reject(new Error("Хэрэглэгчийн мэдээлэл буруу байна"));
              return;
            }

            let permissionsData = null;

            try {
              const res = await uilchilgee(token).post("/erkhiinMedeelelAvya");
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
                token: token,
                result: result,
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
            toast.error("Лицензийн хугацаа дууссан байна", {
              description: "Админтай холбогдоно уу",
              duration: 5000,
            });
            return;
          }
        } else {
          toast.error("Лицензийн хугацаа дууссан байна", {
            description: "Админтай холбогдоно уу",
            duration: 5000,
          });
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
            offlinePermissions,
          );
        }
      }

      if (isOffline) {
        toast.success("Интернетгүй үед амжилттай нэвтэрлээ", {
          description: "Та одоо оффлайн горимд ажиллаж байна",
          duration: 3000,
        });
      }
    },
    [ajiltanMutate, barilgaSoliyo],
  );

  const auth = useMemo(
    () => ({
      newterya: async (khereglech) => {
        if (!khereglech.nevtrekhNer) {
          toast.warning("Нэвтрэх нэрийг бөглөнө үү");
          return;
        }
        if (!khereglech.nuutsUg) {
          toast.warning("Нууц үгийг бөглөнө үү");
          return;
        }
        if (khereglech.namaigsana) {
          localStorage.setItem("newtrekhNerTurees", khereglech.nevtrekhNer);
        }

        try {
          const loginResult = await attemptLogin(
            khereglech,
            performOnlineLogin,
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
            toast.error(loginResult.error || "Нэвтрэлт амжилтгүй боллоо");
          }
        } catch (error) {
          const errorMessage =
            error.message || error.toString() || "Нэвтрэх явцад алдаа гарлаа";
          toast.warning(errorMessage);
        }
      },

      garya: async () => {
        setCookie(null, "tureestoken", "", { maxAge: -1, path: "/" });
        setCookie(null, "barilgiinId", "", { maxAge: -1, path: "/" });

        localStorage.removeItem("baiguulgiinErkhiinJagsaalt");
        localStorage.removeItem("newtrekhNerTurees");

        setToken(null);
        setIsOfflineMode(false);

        clearOfflineAuth().catch(() => {});

        if (typeof window !== "undefined") {
          window.location.href = "/";
          return;
        }
      },

      hasOfflineAccess: async () => {
        return await hasOfflineAuth();
      },

      clearOfflineDataOnly: async () => {
        try {
          await clearOfflineAuth();
          toast.success("Интернетгүй үеийн мэдээлэл устгагдлаа");
        } catch (error) {
          toast.error("Интернетгүй үеийн мэдээлэл устгахад алдаа гарлаа");
        }
      },

      forceSyncData: async () => {
        if (isOnline() && token) {
          try {
            await syncOfflineData();
            toast.success("Мэдээлэл амжилттай шинэчлэгдлээ хийгдлээ");
          } catch (error) {
            toast.error("Шинэчлэл хийхэд алдаа гарлаа");
          }
        } else {
          toast.warning("Интернэт холболт шаардлагатай");
        }
      },

      isOfflineMode,
      isOnline: !isOfflineMode,
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
    ],
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
