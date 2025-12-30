import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Loader from "./loader";
import { Button, Drawer, Switch, Tooltip, Alert } from "antd";
import { toast } from "sonner";
import {
  CloseOutlined,
  LeftOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import { useAuth } from "../services/auth";
import NTses from "./tolgoi/Tses";
import MTses from "./tolgoi/MTses";
import _ from "lodash";
import { socket } from "../services/uilchilgee";
import ProfileTovch from "./tolgoi/ProfileTovch";
import useErkh from "../tools/logic/khereglegchiinErkhiinTokhirgoo";
import { useThemeValue } from "pages";
import moment from "moment";
import Updater from "./Updater";
import Zaavar from "./Zaavar";
import MsgToololt from "./MsgToololt";
import { TbArrowBarLeft } from "react-icons/tb";
import Tuslamj from "./tolgoi/tuslamj";
import { FiSend } from "react-icons/fi";
import { SiAnydesk } from "react-icons/si";
import { modal } from "./ant/Modal";
import SanalKhuseltIlgeekh from "./tolgoi/SanalKhuseltIlgeekh";
import { useTranslation } from "react-i18next";
import Snowfall from "react-snowfall";

const saveOfflinePayment = async (paymentData) => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const request = indexedDB.open("turees-db", 2);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("offline-payments")) {
        db.createObjectStore("offline-payments", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction("offline-payments", "readwrite");
      const store = tx.objectStore("offline-payments");

      const addRequest = store.add({
        ...paymentData,
        timestamp: Date.now(),
        synced: false,
      });

      addRequest.onsuccess = () => resolve(addRequest.result);
      addRequest.onerror = () => reject(addRequest.error);
    };

    request.onerror = () => reject(request.error);
  });
};

const getPendingPayments = async () => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof indexedDB === "undefined") {
      resolve([]);
      return;
    }

    const request = indexedDB.open("turees-db", 2);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction("offline-payments", "readonly");
      const store = tx.objectStore("offline-payments");

      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () =>
        resolve(getAllRequest.result.filter((p) => !p.synced));
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };

    request.onerror = () => reject(request.error);
  });
};



function Admin({
  title,
  khuudasniiNer,
  onSearch,
  children,
  className,
  dedKhuudas,
  hideSearch,
  onBack,
  tsonkhniiId,
  loading,
  setNeesenEsekh,
  setTurulZagvar,
  fixedZagvarNeegdsenEsekh,
  onChangeBarilga,
  searchUtga,
  khailtDoubleClick,
  suggestionData,
}) {
  const [mSearch, setMSearch] = useState(false);
  const { themeValue, setTheme } = useThemeValue();
  const [showTuslamj, setShowTuslamj] = useState(false);
  const router = useRouter();
  const {
    ajiltan,
    token,
    baiguullaga,
    garya,
    ajiltniiJagsaalt,
    ajiltanNemya,
    setToken,
    ajiltanKhasya,
    barilgaSoliyo,
    barilgiinId,
    baiguulgiinErkhiinJagsaalt,
  } = useAuth();

  const khuudasnuud = useErkh(ajiltan, baiguulgiinErkhiinJagsaalt);
  const sanalKhuseltRef = React.useRef(null);
  const [visible, setVisible] = useState(false);
  const [showSidehelpBar, setShowSidehelpBar] = useState(false);
  const { i18n, t } = useTranslation();

  const [isOnline, setIsOnline] = useState(true);
  const [focusaasGarsan, setFocusaasGarsan] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [syncStatus, setSyncStatus] = useState("idle");
  const [offlinePayments, setOfflinePayments] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const hasReloadedThisSession = useRef(false);
  const lastSyncTime = useRef(0);
  const syncTimeoutRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    socket().on(`autoLogout${baiguullaga?._id}`, (khariu) => {
      garya();
    });

    return () => {
      socket().off(`autoLogout${baiguullaga?._id}`);
    };
  }, [baiguullaga?._id]);

  useEffect(() => {
    if (!isClient) return;

    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
      setIsOffline(!navigator.onLine);

      const handleOnline = async () => {
        setIsOffline(false);
        setIsOnline(true);

        const now = Date.now();
        const timeSinceLastSync = now - lastSyncTime.current;

        if (timeSinceLastSync < 10000) {
          return;
        }

        setSyncStatus("syncing");
        lastSyncTime.current = now;

        if ("serviceWorker" in navigator) {
          try {
            const registration = await navigator.serviceWorker.ready;

            if (syncTimeoutRef.current) {
              clearTimeout(syncTimeoutRef.current);
              syncTimeoutRef.current = null;
            }

            syncTimeoutRef.current = setTimeout(async () => {
              try {
                if ("sync" in window.ServiceWorkerRegistration.prototype) {
                  await registration.sync.register("sync-payments");
                } else {
                  navigator.serviceWorker.controller?.postMessage({
                    type: "TRIGGER_SYNC",
                    tag: "sync-payments",
                  });
                }
              } catch (syncError) {
                setSyncStatus("idle");
              }
            }, 2000); // 2 second delay
          } catch (error) {
            setSyncStatus("idle");
          }
        }
      };

      const handleOffline = () => {
        setIsOffline(true);
        setIsOnline(false);
        setSyncStatus("idle");

        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
          syncTimeoutRef.current = null;
        }
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
      };
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      const handler = (event) => {
        const { data } = event;

        if (!data?.type) return;

        switch (data.type) {
          case "PAYMENT_SAVED_OFFLINE":
            setOfflinePayments((prev) => [...prev, data.payment]);
            if (!navigator.onLine) {
              toast.info(
                t(
                  "Төлбөр интернетгүй үед хадгалагдлаа, Интернет холбогдох үед төлөв өөрчлөгдөх болно."
                ),
                {
                  duration: 10000,
                }
              );
            }
            break;

          case "SYNC_COMPLETED":
            const now = Date.now();
            const timeSinceLastMessage = now - lastSyncTime.current;

            if (data.results?.successful > 0) {
              if (timeSinceLastMessage > 5000) {
                toast.success(
                  `Төлбөрийн синк амжилттай (${data.results.successful})`,
                  {
                    duration: 3000,
                  }
                );
              }
            } else if (
              data.results?.successful === 0 &&
              timeSinceLastMessage > 5000
            ) {
              toast.info("Синк хийх зүйл олдсонгүй", {
                duration: 3000,
              });
            }

            setSyncStatus("idle");
            loadPendingPayments();
            break;

          default:
            break;
        }
      };

      navigator.serviceWorker.addEventListener("message", handler);

      return () => {
        navigator.serviceWorker.removeEventListener("message", handler);
      };
    }
  }, [isClient, t]);

  useEffect(() => {
    if (!isClient) return;
    loadPendingPayments();
  }, [isClient]);

  async function getPendingPaymentsFromSW() {
    return new Promise((resolve) => {
      if (
        typeof navigator !== "undefined" &&
        "serviceWorker" in navigator &&
        navigator.serviceWorker.controller
      ) {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.payments || []);
        };
        navigator.serviceWorker.controller.postMessage(
          { type: "GET_PENDING_PAYMENTS" },
          [messageChannel.port2]
        );
      } else {
        resolve([]);
      }
    });
  }

  async function loadPendingPayments() {
    try {
      const pending = await getPendingPaymentsFromSW();
      setPendingPayments(pending);
    } catch (error) {}
  }

  async function triggerManualSync() {
    if (
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator &&
      navigator.onLine
    ) {
      setSyncStatus("syncing");
      navigator.serviceWorker.controller?.postMessage({ type: "TRIGGER_SYNC" });
    } else {
      toast.warning("Интернет холболт байхгүй байна", {
        duration: 3000,
      });
    }
  }

  const getPaymentStatus = (payment) => {
    if (payment?.synced) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Төлөгдсөн
        </span>
      );
    }

    if (payment?.retryCount >= 5) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          Алдаа гарлаа
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        <svg
          className="mr-1 h-3 w-3 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        Шинэчлэлт хүлээгдэж байна ({payment.retryCount || 0}/5)
      </span>
    );
  };
  function getOS() {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return null;
    }
    var userAgent = navigator.userAgent,
      platform = navigator.platform,
      macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
      windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
      iosPlatforms = ["iPhone", "iPad", "iPod"],
      os = null;
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = "/anydeskMacOs.dmg";
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = "https://apps.apple.com/us/app/anydesk/id1176131273";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = "/AnyDeskWindows.exe";
    } else if (/Android/.test(userAgent)) {
      os =
        "https://play.google.com/store/apps/details?id=com.anydesk.anydeskandroid";
    } else if (!os && /Linux/.test(platform)) {
      os = "https://anydesk.com/en/downloads/linux";
    }
    return os;
  }

  function onClickSearch() {
    if (typeof document === "undefined") return; // Safety check
    if (mSearch) {
      const search = document.getElementById("search");
      if (!search) return; // Safety check
      document.getElementById("mobileSearch")?.classList.remove("hidden");
      search.classList.add("hidden");
      document.getElementById("garchig")?.classList.remove("hidden");
      const input = search.getElementsByTagName("input")[0];
      if (input) input.value = "";
      onSearch && onSearch("");
    } else {
      document.getElementById("mobileSearch")?.classList.add("hidden");
      const searchElement = document.getElementById("search");
      if (searchElement) searchElement.classList.remove("hidden");
      document.getElementById("garchig")?.classList.add("hidden");
    }
    setMSearch(!mSearch);
  }

  function showSanalKhuselt(ajiltan) {
    const footer = [
      <Button onClick={() => sanalKhuseltRef.current.khaaya()}>
        {t("Хаах")}
      </Button>,
      <Button
        className="space-x-2"
        icon={<FiSend />}
        type="primary"
        onClick={() => sanalKhuseltRef.current.ilgeeye()}
      >
        {t("Илгээх")}
      </Button>,
    ];
    modal({
      title: t("Системтэй холбоотой санал хүсэлт илгээх"),
      icon: <FiSend />,
      content: <SanalKhuseltIlgeekh ref={sanalKhuseltRef} ajiltan={ajiltan} />,
      footer,
    });
  }

  const license = useMemo(() => {
    const ognoo = moment(new Date()).format("YYYY-MM-DD");
    let duusakh = moment(ajiltan?.duusakhOgnoo).format("YYYY-MM-DD");
    if (Array.isArray(ajiltan?.salbaruud) && ajiltan?.salbaruud?.length > 0) {
      let tukhainDuusakhOgnoo = ajiltan?.salbaruud?.find(
        (mur) => mur.salbariinId === barilgiinId
      )?.duusakhOgnoo;
      duusakh = moment(tukhainDuusakhOgnoo).format("YYYY-MM-DD");
    }
    const khonog = moment(duusakh).diff(moment(ognoo), "days");
    return <span className="font-bold text-red-500">{khonog}</span>;
  }, [ajiltan, barilgiinId]);

  const barilguud = useMemo(() => {
    return baiguullaga?.barilguud?.filter(
      (a) =>
        !!ajiltan?.barilguud?.find((b) => b === a._id) ||
        ajiltan?.erkh === "Admin"
    );
  }, [baiguullaga, ajiltan]);

  const images = useMemo(() => {
    if (typeof window === "undefined") return [];
    const snowflake1 = document.createElement("img");
    snowflake1.src = "/snowflake.png";
    const snowflake2 = document.createElement("img");
    snowflake2.src = "/snowflake1.png";
    return [snowflake1, snowflake2];
  }, []);

  const [currentNotification, setCurrentNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Don't render certain elements during SSR
  if (!isClient) {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden bg-green-600 px-3 pb-5 dark:bg-gray-900 md:flex md:flex-row md:px-6 md:py-4">
        <Head>
          <title>{t(title)}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex min-h-screen items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        visible === true && setVisible(false);
        showSidehelpBar === true && setShowSidehelpBar(false);
        !!setTurulZagvar &&
          fixedZagvarNeegdsenEsekh === true &&
          setTurulZagvar(false);
      }}
      className="relative min-h-screen w-screen overflow-hidden bg-green-600 px-3 pb-5 dark:bg-gray-900 md:flex md:flex-row md:px-6 md:py-4"
    >
      {syncStatus === "syncing" && (
        <div className="fixed left-0 right-0 top-16 z-50 mb-4 rounded border-l-4 border-blue-500 bg-blue-100 p-4 text-blue-700">
          <div className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <p className="text-sm font-medium">
              Шинэчлэл хийгдэж байна...Хуудсыг дахин ачаалална уу
            </p>
          </div>
        </div>
      )}
      {isOffline && (
        <Alert
          style={{ bottom: 20 }}
          className="absolute bg-red-100"
          message="Интернэт холболтоо шалгана уу!"
          type="error"
          showIcon
        />
      )}

      <Drawer
        placement={"right"}
        closable={false}
        onClose={() => setShowTuslamj(false)}
        visible={showTuslamj}
        key={"righttuslamj"}
        width={600}
        bodyStyle={{ padding: "10px 0" }}
      >
        <Tuslamj />
      </Drawer>

      {moment(new Date()).format("MM") === "12" ? (
        <Snowfall
          images={images}
          radius={[3, 20]}
          snowflakeCount={100}
          speed={[0.5, 1.5]}
          wind={[-0.3, 0.5]}
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        />
      ) : null}

      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-1/3 z-50 flex h-48 items-center transition-all ${
          showSidehelpBar
            ? "right-0"
            : `${
                visible === true
                  ? "-right-full md:-right-[10.5rem]"
                  : "-right-[11.25rem] md:-right-[10.5rem]"
              } delay-200 `
        }`}
      >
        <div
          onClick={() => setShowSidehelpBar(!showSidehelpBar)}
          className={`text-2xl ${
            showSidehelpBar
              ? "bg-white text-green-500 dark:border-green-500 dark:bg-gray-800"
              : " bg-yellow-500 text-white"
          } flex  h-11  w-10 cursor-pointer items-center justify-center rounded-l-lg border border-r-0 transition-all`}
        >
          <TbArrowBarLeft
            className="transition-all duration-200"
            style={{ rotate: showSidehelpBar ? "180deg" : "0deg" }}
          />
        </div>
        <div
          className={`overflow-hidden ${
            showSidehelpBar
              ? "h-48 rounded-l-lg border-r-0 bg-white delay-200 dark:bg-gray-800"
              : "h-11 border-none bg-green-600 dark:bg-gray-900"
          } flex w-48 flex-col border py-5 pl-3 transition-all dark:border-green-500`}
        >
          <div
            className={`flex h-full w-full flex-col justify-between ${
              showSidehelpBar
                ? "visible opacity-100 delay-200"
                : "invisible opacity-0"
            }`}
          >
            <div
              className={`group cursor-pointer rounded-l-lg border border-r-0 transition-all hover:scale-105 hover:bg-green-100 dark:border-green-500 dark:hover:bg-green-600 dark:hover:bg-opacity-30 `}
              onClick={() => {
                setShowTuslamj(true);
                setShowSidehelpBar(false);
              }}
            >
              <div
                className={`flex w-44 items-center space-x-2 p-1 text-black dark:text-gray-200 `}
              >
                <div className="rounded-md border bg-green-600 p-2 text-white transition-colors group-hover:bg-green-500">
                  <QuestionOutlined />
                </div>
                <div className="font-medium">{t("Тусламж")}</div>
              </div>
            </div>
            <div
              className={`group cursor-pointer rounded-l-lg border border-r-0 transition-all hover:scale-105 hover:bg-yellow-100 dark:border-green-500 dark:hover:bg-yellow-600 dark:hover:bg-opacity-30 `}
              onClick={() => {
                showSanalKhuselt(ajiltan);
                setShowSidehelpBar(false);
              }}
            >
              <div
                className={`flex w-44 items-center space-x-2 p-1 text-black dark:text-gray-200 ${
                  showSidehelpBar
                    ? "visible opacity-100 delay-200"
                    : "invisible opacity-0"
                }`}
              >
                <div className="rounded-md border bg-yellow-600 p-2 text-white transition-colors group-hover:bg-yellow-500">
                  <FiSend />
                </div>
                <div className="font-medium">{t("Санал хүсэлт")}</div>
              </div>
            </div>
            <div
              className={`group cursor-pointer rounded-l-lg border border-r-0 transition-all hover:scale-105 hover:bg-red-100 dark:border-green-500 dark:hover:bg-red-600 dark:hover:bg-opacity-30 ${
                showSidehelpBar ? "visible opacity-100" : "invisible opacity-0"
              }`}
              onClick={() => {
                const osUrl = getOS();
                if (osUrl && typeof window !== "undefined") {
                  window.location.assign(osUrl);
                }
                setShowSidehelpBar(false);
              }}
            >
              <div
                className={`flex w-44 items-center space-x-2 p-1 text-black dark:text-gray-200 ${
                  showSidehelpBar
                    ? "visible opacity-100 delay-200"
                    : "invisible opacity-0"
                }`}
              >
                <div className="rounded-md border bg-red-600 p-2 text-white transition-colors group-hover:bg-red-500">
                  <SiAnydesk />
                </div>
                <div className="font-medium">{t("AnyDesk татах")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Head>
        <title>{t(title)}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Updater /> */}

      <div className="flex items-center justify-between py-4">
        {dedKhuudas && (
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 md:hidden"
            onClick={() =>
              _.isFunction(onBack) ? onBack(router.back) : router.back()
            }
          >
            <LeftOutlined
              style={{ fontSize: "15px" }}
              className="flex items-center justify-center text-gray-50"
            />
          </button>
        )}
        <div className="flex gap-2 md:hidden">
          <img
            className="h-10 w-10 "
            alt={baiguullaga?.ner}
            src={
              baiguullaga?.zurgiinNer
                ? `${process.env.NEXT_PUBLIC_API_URL}/logoAvya/${baiguullaga?.zurgiinNer}`
                : "/rent.png"
            }
          />
          {barilguud?.length > 0 ? (
            <div className="relative mt-2 inline-block">
              <select
                defaultValue={barilgiinId}
                value={barilgiinId}
                onChange={({ target }) => barilgaSoliyo(target.value, ajiltan)}
                className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-1 pr-8 leading-tight text-black shadow hover:border-gray-500 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
              >
                {barilguud?.map((a) => (
                  <option
                    key={a?._id}
                    className=""
                    value={a?._id}
                    disabled={a.disabled}
                  >
                    {a?.ner}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          ) : (
            _.get(barilguud, "0.ner")
          )}
        </div>
        {!dedKhuudas && (
          <button
            className="border-none outline-none md:hidden"
            onClick={() => {
              setVisible(!visible);
              !!setNeesenEsekh && setNeesenEsekh(!visible);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-bar-chart-2 h-8 w-8 -rotate-90 text-white"
            >
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </button>
        )}
      </div>

      {!dedKhuudas && (
        <NTses
          khuudasnuud={khuudasnuud}
          baiguullaga={baiguullaga}
          khuudasniiNer={khuudasniiNer}
          ajiltan={ajiltan}
          ajiltniiJagsaalt={ajiltniiJagsaalt}
          ajiltanNemya={ajiltanNemya}
          setToken={setToken}
          onChangeBarilga={onChangeBarilga}
          ajiltanKhasya={ajiltanKhasya}
          barilgaSoliyo={barilgaSoliyo}
          barilgiinId={barilgiinId}
        />
      )}

      {!dedKhuudas && (
        <MTses
          visible={visible}
          khuudasnuud={khuudasnuud}
          khuudasniiNer={khuudasniiNer}
        />
      )}

      <h2
        id="garchig"
        className="-mt-4 ml-3 flex text-base font-semibold text-white md:hidden"
      >
        {t(title)}
      </h2>

      <div
        className={`rounded-3xl bg-gray-100 dark:bg-gray-800 md:px-2 ${
          dedKhuudas ? "w-full" : "main"
        }`}
      >
        <div className="flex h-12 flex-row justify-between border-b p-2 ">
          <div className="flex">
            {dedKhuudas && (
              <button
                className="hidden h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 md:flex"
                onClick={() =>
                  _.isFunction(onBack) ? onBack(router.back) : router.back()
                }
              >
                <LeftOutlined
                  style={{ fontSize: "15px" }}
                  className="flex items-center justify-center dark:text-gray-50"
                />
              </button>
            )}
            <h2
              id="garchig"
              className="ml-3 hidden items-center justify-center text-base font-semibold text-green-800 dark:text-gray-200 md:flex"
            >
              {t(title)}
            </h2>
          </div>
          <div className="flex w-full flex-row justify-between md:w-auto md:space-x-3 lg:space-x-6">
            {token && baiguullaga?._id && barilgiinId && (
              <div className="hidden h-8 items-center justify-center md:flex ">
                <MsgToololt
                  token={token}
                  baiguullagiinId={baiguullaga?._id}
                  barilgiinId={barilgiinId}
                  msgNegjUne={baiguullaga?.tokhirgoo?.msgNegjUne || 100}
                />
              </div>
            )}
            {tsonkhniiId && (
              <div className="hidden h-8 items-center justify-center md:flex ">
                <Zaavar token={token} id={tsonkhniiId} />
              </div>
            )}
            <div className="hidden h-8 items-center justify-center md:flex">
              <div className="mr-4 hidden whitespace-nowrap text-gray-700 dark:text-gray-300 lg:flex">
                Dark Mode
              </div>
              <Switch
                className="bg-green-500"
                checked={themeValue}
                checkedChildren={
                  <svg className="" focusable="false" viewBox="0 0 24 24">
                    <path d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"></path>
                  </svg>
                }
                unCheckedChildren={
                  <svg className="" focusable="false" viewBox="0 0 24 24">
                    <path d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path>
                  </svg>
                }
                onChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
            <div className="flex w-6 gap-2 transition-all hover:scale-105">
              {i18n.language === "en" ? (
                <img
                  onClick={() => {
                    i18n.changeLanguage("mn");
                    window.localStorage.setItem("Localelanguage", "mn");
                  }}
                  className={`w-full cursor-pointer object-contain transition-all`}
                  src="/MN.png"
                />
              ) : (
                <img
                  onClick={() => {
                    i18n.changeLanguage("en");
                    window.localStorage.setItem("Localelanguage", "en");
                  }}
                  className={`w-full cursor-pointer object-contain transition-all`}
                  src="/UK.png"
                />
              )}
            </div>
            <div className="hidden items-center justify-center md:flex">
              {t("Лиценз")}- {license}
            </div>
            {!hideSearch ? (
              <>
                <div
                  id="search"
                  className="relative ml-2 w-40 text-gray-700 dark:text-gray-300 xl:w-56"
                >
                  <input
                    onFocus={() => setFocusaasGarsan(false)}
                    onBlur={() =>
                      setTimeout(() => {
                        setFocusaasGarsan(true);
                      }, 200)
                    }
                    ref={searchUtga ? searchUtga : undefined}
                    onDoubleClick={khailtDoubleClick}
                    onClick={() => {
                      if (searchUtga) {
                        searchUtga.current.select();
                      }
                    }}
                    onChange={({ target }) => {
                      if (!!onSearch) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = setTimeout(function () {
                          if (
                            !target.value?.includes("\\") &&
                            !target.value?.includes("[") &&
                            !target.value?.includes("]")
                          )
                            onSearch(target.value);
                        }, 800);
                      }
                    }}
                    type="text"
                    className="box w-40 bg-white px-3 py-1 pr-10 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 dark:bg-gray-900 xl:w-56"
                    placeholder={`${t("Хайлт")}...`}
                  />
                  {mSearch ? (
                    <CloseOutlined
                      onClick={onClickSearch}
                      className="feather feather-search absolute inset-y-0 right-0 my-auto mr-2 h-4 w-4"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-search absolute inset-y-0 right-0 my-auto mr-3 mt-2 h-4 w-4"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  )}
                  {suggestionData &&
                    searchUtga?.current?.value !== "" &&
                    !focusaasGarsan && (
                      <div
                        onClick={() => setFocusaasGarsan(false)}
                        className="box relative z-20 mt-[2px] max-h-[200px] w-40 overflow-y-auto px-3 py-1 pr-10 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 xl:w-56"
                      >
                        {suggestionData.length > 0 ? (
                          suggestionData.map((mur, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setFocusaasGarsan(false);
                                if (searchUtga) {
                                  searchUtga.current.value = mur.mashiniiDugaar;
                                  if (!!onSearch) {
                                    clearTimeout(timeoutRef.current);
                                    timeoutRef.current = setTimeout(function () {
                                      onSearch(mur.mashiniiDugaar);
                                    }, 800);
                                  }
                                  setFocusaasGarsan(true);
                                }
                              }}
                              className="w-full cursor-pointer py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                              {mur.mashiniiDugaar}
                            </div>
                          ))
                        ) : (
                          <div>Машин олдсонгүй</div>
                        )}
                      </div>
                    )}
                </div>
              </>
            ) : (
              <div></div>
            )}
            <div className="right-5 flex gap-1 sm:gap-5">
              <Tooltip
                placement="bottom"
                title={
                  <div>Лицензийн хугацаа дуусахад хоног үлдлээ: {license}</div>
                }
              >
                <div className="ml-1 mr-2 flex items-center gap-1 text-base md:hidden">
                  {license} :{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-clock h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </Tooltip>
              <ProfileTovch
                ajiltan={ajiltan}
                garya={garya}
                token={token}
                showSanalKhuselt={showSanalKhuselt}
                setShowTuslamj={setShowTuslamj}
              />
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-12 gap-6 ${className} relative`}>
          {loading && <Loader />}
          {children}
        </div>
      </div>
      <div
        className={`fixed bottom-[1.7rem] z-40 ${
          visible === true ? "-right-full" : "right-5"
        } flex h-8 items-center justify-center rounded-3xl bg-green-600 px-3 py-5 shadow-md transition-all duration-500 dark:bg-gray-900 md:hidden`}
      >
        <div className="mr-4 flex whitespace-nowrap text-white dark:text-gray-300">
          Dark Mode
        </div>
        <Switch
          checked={themeValue}
          onClick={() => setTheme(themeValue ? "light" : "dark")}
        />
      </div>
      {showNotificationModal && currentNotification && (
        <div className="pointer-events-none fixed inset-0 flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end sm:p-6 ">
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="p-4">
              <div className="flex items-start">
                {currentNotification.image && (
                  <div className="mr-3 flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={currentNotification.image}
                      alt="Notification"
                    />
                  </div>
                )}
                <div className="flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    {currentNotification.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {currentNotification.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {moment(currentNotification.date).format(
                      "YYYY-MM-DD HH:mm"
                    )}
                  </p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    onClick={() => setShowNotificationModal(false)}
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Admin;
