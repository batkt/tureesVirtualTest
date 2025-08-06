import {
  LogoutOutlined,
  QuestionOutlined,
  SettingOutlined,
  MailOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Menu, Empty, Spin } from "antd";
import Link from "next/link";
import React, {
  useState,
  useEffect,
  Suspense,
  lazy,
  useCallback,
  useMemo,
} from "react";
import { format, isValid } from "date-fns";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import useSonorduulga from "hooks/useSonorduulga";
import { FiSend } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { socket } from "../../services/uilchilgee";
import { useAuth } from "services/auth";
import NotificationModal from "./MedegdelModal";

const SonorduulgaDropdown = lazy(() => import("./SonorduulgaDropdown"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <Spin size="small" />
  </div>
);

function ProfileTovch({
  ajiltan,
  garya,
  token,
  setShowTuslamj,
  showSanalKhuselt,
}) {
  const {
    sonorduulga,
    sonorduulgaMutate,
    jagsaalt,
    setKhuudaslalt,
    kharaaguiToo,
    allNotifications: paginatedNotifications,
    currentPage,
    isLoadingMore,
    hasMore,
    isInitialLoading,
    loadMore,
    fetchNotifications,
    refreshNotifications,
  } = useSonorduulga(token, ajiltan?._id);
  const { t } = useTranslation();
  const { baiguullaga } = useAuth();
  const [realTimeNotifications, setRealTimeNotifications] = useState([]);
  const [notificationModal, setNotificationModal] = useState({
    visible: false,
    data: null,
    isMessageModal: false,
    messageTitle: null,
    messageDetails: null,
    messageDate: null,
  });
  const [sessionDismissedNotifications, setSessionDismissedNotifications] =
    useState(new Set());
  const [expandedNotifications, setExpandedNotifications] = useState(null);
  const [sonorduulgaDropdownVisible, setSonorduulgaDropdownVisible] =
    useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [animateMail, setAnimateMail] = useState(false);

  const [permanentlyDismissed, setPermanentlyDismissed] = useState(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem("permanentlyDismissedNotifications");
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  const formatDate = useCallback((dateInput) => {
    if (!dateInput) return "N/A";
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return isValid(date) ? format(date, "yyyy-MM-dd HH:mm") : "N/A";
  }, []);

  const allNotifications = useMemo(() => {
    const combined = [
      ...realTimeNotifications,
      ...jagsaalt,
      ...(sonorduulga?.jagsaalt || []),
    ]
      .filter((mur) => mur?.turul === "medegdelAdmin")
      .map((mur) => ({
        ...mur,
        object: { ...mur.object, zurag: undefined },
      }));

    const seen = new Set();
    return combined.filter((notification) => {
      const id = notification._id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [realTimeNotifications, jagsaalt, sonorduulga?.jagsaalt]);

  const medegdelAdminCount = useMemo(() => {
    return allNotifications.filter((mur) => !mur.kharsanEsekh).length;
  }, [allNotifications]);

  const allSonorduulga = useMemo(() => {
    return [...jagsaalt, ...(sonorduulga?.jagsaalt || [])].map((mur) => ({
      ...mur,
      object: { ...mur.object, zurag: undefined },
    }));
  }, [jagsaalt, sonorduulga?.jagsaalt]);

  useEffect(() => {
    if (medegdelAdminCount > 0) {
      const interval = setInterval(() => {
        setAnimateMail(true);
        setTimeout(() => setAnimateMail(false), 3000);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [medegdelAdminCount]);

  const handleNotificationClose = useCallback(() => {
    if (notificationModal.data && !notificationModal.isMessageModal) {
      const notifId = notificationModal.data._id || Date.now().toString();
      setSessionDismissedNotifications((prev) => new Set([...prev, notifId]));
    }
    setNotificationModal({
      visible: false,
      data: null,
      isMessageModal: false,
      messageDetails: null,
      messageTitle: null,
      messageDate: null,
    });
  }, [notificationModal.data, notificationModal.isMessageModal]);

  const handleDontShowAgain = useCallback((notifId, dontShowAgain) => {
    if (notifId && dontShowAgain) {
      setSessionDismissedNotifications((prev) => new Set([...prev, notifId]));
      setPermanentlyDismissed((prev) => {
        const updated = new Set([...prev, notifId]);
        localStorage.setItem(
          "permanentlyDismissedNotifications",
          JSON.stringify([...updated])
        );
        return updated;
      });
    }
    setNotificationModal({
      visible: false,
      data: null,
      isMessageModal: false,
      messageDetails: null,
      messageTitle: null,
      messageDate: null,
    });
  }, []);

  const handleMessageClick = useCallback(
    (title, message, createdAt, e, _id) => {
      e?.stopPropagation();
      requestAnimationFrame(() => {
        setNotificationModal({
          visible: true,
          isMessageModal: true,
          messageTitle: title,
          messageDetails: message,
          messageDate: formatDate(createdAt), // Validate and format date
          data: { title, message, _id, createdAt },
        });
      });
    },
    [formatDate]
  );

  const showLatestNotificationOnLogin = useCallback(() => {
    const adminNotifications = allNotifications;

    if (adminNotifications.length === 0) return;

    const sortedNotifications = adminNotifications.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    const latestNotification = sortedNotifications[0];
    const latestNotifId = latestNotification._id || "latest-notification";

    if (
      !permanentlyDismissed.has(latestNotifId) &&
      !sessionDismissedNotifications.has(latestNotifId)
    ) {
      setNotificationModal({
        visible: true,
        data: {
          ...latestNotification,
          _id: latestNotifId,
          createdAt: formatDate(latestNotification.createdAt),
        },
        isMessageModal: false,
        messageTitle: null,
        messageDetails: null,
        messageDate: null,
      });
    }
  }, [
    allNotifications,
    permanentlyDismissed,
    sessionDismissedNotifications,
    formatDate,
  ]);

  const handleAdminNotification = useCallback(
    (data) => {
      const notifications = Array.isArray(data) ? data : [data];
      const validNotifications = notifications.filter((notif) => {
        const notifId = notif._id || notif.id || "default-notification";
        return (
          notif &&
          (notif.message || notif.title || notif.tailbar) &&
          !sessionDismissedNotifications.has(notifId) &&
          !permanentlyDismissed.has(notifId)
        );
      });

      if (validNotifications.length === 0) return;

      requestAnimationFrame(() => {
        setRealTimeNotifications((prev) => {
          const allExistingIds = new Set([
            ...prev.map((n) => n._id),
            ...jagsaalt.map((n) => n._id),
            ...(sonorduulga?.jagsaalt || []).map((n) => n._id),
          ]);

          const newUnique = validNotifications
            .map((notif) => ({
              ...notif,
              object: { ...notif.object, zurag: undefined },
              createdAt: formatDate(notif.createdAt), // Validate and format date
            }))
            .filter((n) => !allExistingIds.has(n._id));

          return [...newUnique, ...prev].slice(0, 50);
        });

        const latestNotification = validNotifications[0];
        const latestNotifId =
          latestNotification._id ||
          latestNotification.id ||
          "default-notification";

        const allExistingIds = new Set([
          ...jagsaalt.map((n) => n._id),
          ...(sonorduulga?.jagsaalt || []).map((n) => n._id),
        ]);

        if (
          !sessionDismissedNotifications.has(latestNotifId) &&
          !permanentlyDismissed.has(latestNotifId) &&
          !allExistingIds.has(latestNotifId)
        ) {
          setNotificationModal({
            visible: true,
            data: {
              ...latestNotification,
              _id: latestNotifId,
              title:
                latestNotification.title ||
                latestNotification.garchig ||
                "Шинэ мэдэгдэл",
              message:
                latestNotification.message ||
                latestNotification.tailbar ||
                "Мэдэгдлийн агуулга байхгүй байна.",
              system: latestNotification.system || "Систем",
              success:
                latestNotification.success !== undefined
                  ? latestNotification.success
                  : latestNotification.kharsanEsekh === true,
              createdAt: formatDate(latestNotification.createdAt), // Validate and format date
              baiguullagaRegister:
                latestNotification.baiguullagaRegister ||
                latestNotification.baiguullagiinId ||
                "Тодорхойгүй",
            },
            isMessageModal: false,
            messageTitle: null,
            messageDetails: null,
            messageDate: null,
          });
        }

        sonorduulgaMutate();
      });
    },
    [
      sessionDismissedNotifications,
      permanentlyDismissed,
      sonorduulgaMutate,
      jagsaalt,
      sonorduulga?.jagsaalt,
      formatDate,
    ]
  );

  useEffect(() => {
    if (!baiguullaga?._id) return;

    const eventName = `adminMedegdelilgeeyeSocket${baiguullaga._id}`;
    const socketInstance = socket();

    socketInstance.on(eventName, handleAdminNotification);

    return () => {
      socketInstance.off(eventName, handleAdminNotification);
    };
  }, [baiguullaga?._id, handleAdminNotification]);

  useEffect(() => {
    let hasShown = false;
    const timer = setTimeout(() => {
      if (
        baiguullaga?._id &&
        (jagsaalt.length > 0 || sonorduulga?.jagsaalt?.length > 0) &&
        !hasShown
      ) {
        showLatestNotificationOnLogin();
        hasShown = true;
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    baiguullaga?._id,
    jagsaalt,
    sonorduulga?.jagsaalt,
    showLatestNotificationOnLogin,
  ]);

  const sonorduulgaKharlaa = useCallback(
    (id, sonorduulgaId) => {
      uilchilgee(token)
        .post("/sanalKharlaa", { id, sonorduulgaId })
        .then(() => sonorduulgaMutate())
        .catch(aldaaBarigch);
    },
    [token, sonorduulgaMutate]
  );

  const handleExpansionToggle = useCallback(
    (index, _id, murId) => {
      setExpandedNotifications((prev) => {
        if (prev === index) {
          return null;
        } else {
          sonorduulgaKharlaa(_id, murId);
          return index;
        }
      });
    },
    [sonorduulgaKharlaa]
  );

  const MailDropdown = useMemo(
    () => (
      <Suspense fallback={<LoadingSpinner />}>
        <div
          className="mail-dropdown-container z-[1000] h-[60vh] w-full max-w-sm overflow-y-auto sm:w-[400px]"
          style={{
            width: "400px",
            height: "60vh",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          <div className="mail-dropdown-header sticky top-0 z-10 rounded-t-lg bg-gradient-to-r from-green-400 to-green-500 p-3 text-white">
            <div className="flex items-center justify-between">
              <span className="text-md font-medium">
                {t("Шинэчлэлтийн мэдээ")}
              </span>
            </div>
          </div>
          <div className="no-transition-initial space-y-2 overflow-y-auto rounded-md bg-white p-3 dark:bg-gray-800">
            {allNotifications.length > 0 ? (
              allNotifications.map((mur, index) => {
                const {
                  turul,
                  message,
                  khariltsagchiinNer,
                  _id,
                  tailbar,
                  ajiltniiNer,
                  title,
                  date,
                } = mur?.object || {};
                const isExpanded = expandedNotifications === index;
                const displayTitle = (
                  mur?.title ||
                  title ||
                  khariltsagchiinNer ||
                  ajiltniiNer ||
                  ""
                ).replace(/<[^>]+>/g, "");
                const displayMessage =
                  message ||
                  (title ? `${title}-ны өдөр` : null) ||
                  tailbar ||
                  mur?.message ||
                  t("Мэдэгдлийн агуулга байхгүй байна.");
                const displayDate = formatDate(mur.createdAt);

                const cleanedContent = displayMessage
                  ?.replace(/<p>(<br\s*\/?>|\s|&nbsp;)+/gi, "<p>")
                  ?.replace(/<p>(<br\s*\/?>|&nbsp;|\s)*<\/p>/gi, "")
                  ?.replace(/^(\s|<br\s*\/?>)+/i, "");

                return (
                  <div
                    key={`mail${index}`}
                    className={`w-full overflow-hidden rounded-xl border-2 ${
                      !mur.kharsanEsekh
                        ? "border-green-300 bg-white dark:bg-gray-800 "
                        : "border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <div
                      onClick={() =>
                        handleExpansionToggle(index, _id, mur?._id)
                      }
                      className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex flex-1 items-center space-x-3">
                        <div className="relative">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <MailOutlined className="text-sm text-green-500 dark:text-green-300" />
                          </div>
                          {!mur.kharsanEsekh && (
                            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-red-500"></div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs font-medium text-gray-800 dark:text-gray-200">
                            {displayTitle}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="rounded-full px-2 py-1 text-xs text-white">
                          <p className="truncate text-xs text-black dark:text-white">
                            {displayDate}
                          </p>
                        </div>
                        <LeftOutlined
                          className={`text-gray-400 transition-transform dark:text-gray-500 ${
                            isExpanded ? "-rotate-90" : "rotate-0"
                          }`}
                        />
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="z-1000 relative px-4 pb-4 text-gray-600 dark:text-gray-300">
                        <div className="border-t pt-3 dark:border-gray-600">
                          <div
                            dangerouslySetInnerHTML={{ __html: cleanedContent }}
                            onClick={(e) =>
                              handleMessageClick(
                                displayTitle,
                                displayMessage,
                                mur.createdAt,
                                e,
                                _id
                              )
                            }
                            className="mb-3 max-h-[100px] cursor-pointer overflow-y-auto rounded p-2 text-sm leading-relaxed hover:bg-gray-100 dark:hover:bg-gray-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex h-full items-center justify-center">
                <Empty description={t("Хоосон байна")} />
              </div>
            )}
          </div>
        </div>
      </Suspense>
    ),
    [
      allNotifications,
      expandedNotifications,
      t,
      handleMessageClick,
      handleExpansionToggle,
      formatDate,
    ]
  );

  const ProfileDropdown = useMemo(
    () => (
      <Suspense fallback={<LoadingSpinner />}>
        <Menu className="bg-green-500">
          <Menu.Item className="profileMenuItem">
            <div className="text-lg font-medium text-white">{`${
              (ajiltan?.ovog && ajiltan?.ovog[0]) || ""
            }.${ajiltan?.ner}`}</div>
            <div className="text-sm font-medium text-gray-200">
              {ajiltan?.albanTushaal}
            </div>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="0" className="profileMenuItem">
            <Link href="/khyanalt/tokhirgoo">
              <a>
                <div className="flex w-44 items-center space-x-2 text-white dark:text-gray-100">
                  <SettingOutlined />
                  <span>{t("Тохиргоо")}</span>
                </div>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item
            key="1"
            className="profileMenuItem"
            onClick={() => setShowTuslamj(true)}
          >
            <div className="flex w-44 items-center space-x-2 text-white">
              <QuestionOutlined />
              <span>{t("Тусламж")}</span>
            </div>
          </Menu.Item>
          <Menu.Item
            key="2"
            className="profileMenuItem"
            onClick={() => showSanalKhuselt(ajiltan)}
          >
            <div className="flex w-44 items-center space-x-2 text-white">
              <FiSend />
              <span>{t("Санал хүсэлт")}</span>
            </div>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="3" onClick={garya} className="profileMenuItem">
            <div className="flex w-44 items-center space-x-2 text-white">
              <LogoutOutlined />
              <span>{t("Гарах")}</span>
            </div>
          </Menu.Item>
        </Menu>
      </Suspense>
    ),
    [ajiltan, t, setShowTuslamj, showSanalKhuselt, garya]
  );

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <style jsx>{`
        @keyframes buzz {
          0% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-2px) rotate(-2deg);
          }
          40% {
            transform: translateX(2px) rotate(2deg);
          }
          60% {
            transform: translateX(-2px) rotate(-2deg);
          }
          80% {
            transform: translateX(2px) rotate(2deg);
          }
          100% {
            transform: translateX(0);
          }
        }
        .buzz-animation {
          animation: buzz 0.4s ease-in-out;
        }
      `}</style>
      <div className="flex h-8 items-center justify-end gap-1 md:gap-3">
        <Dropdown
          trigger={["click"]}
          overlay={MailDropdown}
          placement="bottomRight"
          onVisibleChange={(visible) => {
            setDropdownVisible(visible);
            if (!visible) {
              setExpandedNotifications(null);
            }
          }}
          overlayClassName="mail-dropdown-overlay"
          overlayStyle={{ zIndex: 1000 }}
          getPopupContainer={(trigger) => trigger.parentNode}
        >
          <button
            className={`relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 dark:text-white dark:hover:bg-gray-700 ${
              animateMail && medegdelAdminCount > 0 ? "buzz-animation" : ""
            }`}
          >
            <Badge count={medegdelAdminCount} dot>
              <MailOutlined
                className="h-5 w-5 text-gray-600 hover:text-green-600 dark:text-white"
                style={{ fontSize: "18px" }}
              />
            </Badge>
          </button>
        </Dropdown>
        <Dropdown
          trigger={["click"]}
          overlay={
            <Suspense fallback={<LoadingSpinner />}>
              <SonorduulgaDropdown
                ajiltan={ajiltan}
                handleMessageClick={handleMessageClick}
                expandedNotifications={expandedNotifications}
                handleExpansionToggle={handleExpansionToggle}
                sonorduulgaKharlaa={sonorduulgaKharlaa}
                allNotifications={paginatedNotifications}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                isInitialLoading={isInitialLoading}
                loadMore={loadMore}
                isVisible={sonorduulgaDropdownVisible}
              />
            </Suspense>
          }
          onVisibleChange={(visible) => {
            setSonorduulgaDropdownVisible(visible);
            if (!visible) {
              setExpandedNotifications(null);
            }
          }}
          placement="bottomRight"
          overlayClassName="sonorduulga-dropdown-overlay"
          getPopupContainer={(trigger) => trigger.parentNode}
        >
          <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 dark:text-white dark:hover:bg-gray-700">
            <Badge count={kharaaguiToo} dot>
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
                className="feather feather-bell mx-auto block h-5 w-5 dark:text-white"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </Badge>
          </button>
        </Dropdown>
        <Dropdown
          overlayClassName="profile"
          overlay={ProfileDropdown}
          trigger={["click"]}
          className="cursor-pointer"
        >
          <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 dark:hover:bg-gray-700">
            <img
              alt={ajiltan?.ner}
              src={
                ajiltan?.zurgiinNer
                  ? `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}`
                  : (ajiltan?.register?.replace(/^\D+/g, "") % 100) / 10 < 1
                  ? "/profileFemale.svg"
                  : "/profile.svg"
              }
              className="h-8 w-8 rounded-full bg-gray-200 p-1 shadow-xl"
              loading="lazy"
              onError={(e) => (e.target.src = "/profile.svg")}
            />
          </button>
        </Dropdown>

        <NotificationModal
          visible={notificationModal.visible}
          data={notificationModal.data}
          onClose={handleNotificationClose}
          onDontShowAgain={handleDontShowAgain}
          permanentlyDismissed={permanentlyDismissed}
          setPermanentlyDismissed={setPermanentlyDismissed}
          isMessageModal={notificationModal.isMessageModal}
          messageDetails={notificationModal.messageDetails}
          messageTitle={notificationModal.messageTitle}
          messageDate={notificationModal.messageDate}
          token={token}
        />
      </div>
    </Suspense>
  );
}

export default React.memo(ProfileTovch);
