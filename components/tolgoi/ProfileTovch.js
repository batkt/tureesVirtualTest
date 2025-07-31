import {
  LogoutOutlined,
  QuestionOutlined,
  SettingOutlined,
  MailOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Menu, Tooltip, Empty, Button, Spin } from "antd";
import Link from "next/link";
import React, { useState, useEffect, Suspense, lazy, useCallback } from "react";
import moment from "moment";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import useSonorduulga from "hooks/useSonorduulga";
import { FiSend } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { socket } from "../../services/uilchilgee";
import { useAuth } from "services/auth";
import NotificationModal from "./MedegdelModal";
import getDisplayData  from "./MedegdelModal";

const SanalKhuseltIlgeekh = lazy(() => import("./SanalKhuseltIlgeekh"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <Spin size="small" />
  </div>
);

function idAwyaa(mur) {
  var id = undefined;
  switch (mur.turul) {
    case "setgegdel":
      id = mur?.object?.daalgavriinId;
      break;
    case "daalgavar":
      id = mur?.object?._id;
      break;
    case "medegdel":
      id = mur?.object?._id;
      break;
    case "medegdelAdmin":
      id = mur?.object?._id;
      break;
    default:
      id = mur?.object?.khariltsagchiinId;
      break;
  }
  return id;
}

function hrefAvya(mur, ajiltan) {
  var href = "";
  if (ajiltan.erkh === "Admin")
    switch (mur.turul) {
      case "daalgavar":
        href = "/khyanalt/daalgavar/admin";
        break;
      case "sanal":
      case "gomdol":
        href = `/khyanalt/medegdel/sanalKhuselt`;
        break;
      case "setgegdel":
        href = "/khyanalt/daalgavar/admin";
        break;
      case "medegdel":
        href = "/khyanalt/daalgavar/admin";
        break;
      case "medegdelAdmin":
        href = "/khyanalt/medegdel/admin";
        break;
      default:
        break;
    }
  else {
    switch (mur.turul) {
      case "daalgavar":
        href = "/khyanalt/daalgavar";
        break;
      case "sanal":
      case "gomdol":
        href = `/khyanalt/medegdel/sanalKhuselt`;
        break;
      case "setgegdel":
        href = "/khyanalt/daalgavar";
        break;
      case "medegdel":
        href = "/khyanalt/daalgavar/admin";
        break;
      case "medegdelAdmin":
        href = "/khyanalt/medegdel";
        break;
      default:
        break;
    }
  }
  return href;
}

function ProfileTovch({ ajiltan, garya, token, setShowTuslamj, showSanalKhuselt }) {
  const {
    sonorduulga,
    sonorduulgaMutate,
    jagsaalt,
    setKhuudaslalt,
    kharaaguiToo,
  } = useSonorduulga(token, ajiltan?._id);
  const { t } = useTranslation();
  const { baiguullaga, barilgiinId } = useAuth();

  const [realTimeNotifications, setRealTimeNotifications] = useState([]);
 const [notificationModal, setNotificationModal] = useState({
  visible: false,
  data: null,
  isMessageModal: false,
  messageDetails: null,
});

  const [sessionDismissedNotifications, setSessionDismissedNotifications] = useState(new Set());
  const [permanentlyDismissed, setPermanentlyDismissed] = useState(() => {
    if (typeof window === "undefined") return new Set();
    const saved = localStorage.getItem("permanentlyDismissedNotifications");
    return new Set(saved ? JSON.parse(saved) : []);
  });

  const handleNotificationClose = useCallback(() => {
    if (notificationModal.data && !notificationModal.isMessageModal) {
      const notifId = notificationModal.data._id || uuidv4();
      setSessionDismissedNotifications((prev) => new Set([...prev, notifId]));
    }
    setNotificationModal({ visible: false, data: null, isMessageModal: false, messageDetails: null });
  }, [notificationModal]);

  const handleDontShowAgain = useCallback((notifId, dontShowAgain) => {
    if (notifId && dontShowAgain) {
      setSessionDismissedNotifications((prev) => new Set([...prev, notifId]));
    }
    setNotificationModal({ visible: false, data: null, isMessageModal: false, messageDetails: null });
  }, []);

  const handleMessageClick = useCallback((message, e) => {
    e?.stopPropagation();
    setNotificationModal({
      visible: true,
      isMessageModal: true,
      messageDetails: message,
      data: null,
    });
  }, []);

  const handleTestButtonClick = useCallback(() => {
    handleMessageClick("This is a test message");
  }, [handleMessageClick]);

  const showLatestNotificationOnLogin = useCallback(() => {
    const adminNotifications = [
      ...realTimeNotifications,
      ...jagsaalt,
      ...(sonorduulga?.jagsaalt || []),
    ].filter((mur) => mur?.turul === "medegdelAdmin");

    if (adminNotifications.length === 0) return;

    const sortedNotifications = adminNotifications.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const latestNotification = sortedNotifications[0];
    const latestNotifId = latestNotification._id || "latest-notification";

    if (
      !permanentlyDismissed.has(latestNotifId) &&
      !sessionDismissedNotifications.has(latestNotifId)
    ) {
      setNotificationModal({
        visible: true,
        data: { ...latestNotification, _id: latestNotifId },
        isMessageModal: false,
        messageDetails: null,
      });
    }
  }, [
    realTimeNotifications,
    jagsaalt,
    sonorduulga?.jagsaalt,
    permanentlyDismissed,
    sessionDismissedNotifications,
  ]);

  useEffect(() => {
    if (!baiguullaga?._id) return;

    const handleAdminNotification = (data) => {
      console.log("Received admin notification:", data);
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

      if (validNotifications.length === 0) {
        console.warn("No valid notifications received or all notifications dismissed");
        return;
      }

      setRealTimeNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n._id));
        const newUnique = validNotifications.filter((n) => !existingIds.has(n._id));
        return [...newUnique, ...prev].slice(0, 50);
      });

      const latestNotification = validNotifications[0];
      const latestNotifId = latestNotification._id || latestNotification.id || "default-notification";

      if (
        !sessionDismissedNotifications.has(latestNotifId) &&
        !permanentlyDismissed.has(latestNotifId)
      ) {
        setNotificationModal({
          visible: true,
          data: {
            ...latestNotification,
            _id: latestNotifId,
            title: latestNotification.title || latestNotification.garchig || "Шинэ мэдэгдэл",
            message:
              latestNotification.message ||
              latestNotification.tailbar ||
              "Мэдэгдлийн агуулга байхгүй байна.",
            system: latestNotification.system || "Систем",
            success: latestNotification.success !== undefined
              ? latestNotification.success
              : latestNotification.kharsanEsekh === true,
            createdAt: latestNotification.createdAt || new Date(),
            baiguullagaRegister:
              latestNotification.baiguullagaRegister ||
              latestNotification.baiguullagiinId ||
              "Тодорхойгүй",
            zurag: latestNotification.zurag,
          },
          isMessageModal: false,
          messageDetails: null,
        });
      }

      sonorduulgaMutate();
    };

    const eventName = `adminMedegdelilgeeyeSocket${baiguullaga._id}`;
    socket().on(eventName, handleAdminNotification);

    return () => {
      socket().off(eventName, handleAdminNotification);
    };
  }, [baiguullaga?._id, sonorduulgaMutate, sessionDismissedNotifications, permanentlyDismissed]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (baiguullaga?._id && (jagsaalt.length > 0 || sonorduulga?.jagsaalt?.length > 0)) {
        showLatestNotificationOnLogin();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [baiguullaga?._id, jagsaalt, sonorduulga?.jagsaalt, showLatestNotificationOnLogin]);

  const allNotifications = [
    ...realTimeNotifications,
    ...jagsaalt,
    ...(sonorduulga?.jagsaalt || []),
  ].filter((mur) => mur?.turul === "medegdelAdmin");

  const medegdelAdminCount = allNotifications.filter((mur) => !mur.kharsanEsekh).length;

  function sonorduulgaKharlaa(id, sonorduulgaId) {
    uilchilgee(token)
      .post("/sanalKharlaa", { id, sonorduulgaId })
      .then(() => sonorduulgaMutate())
      .catch(aldaaBarigch);
  }

  function onScroll(e) {
    if (
      e.target.scrollHeight - e.target.scrollTop - 1 < e.target.clientHeight &&
      !!sonorduulga &&
      sonorduulga?.jagsaalt.length === 20
    ) {
      setKhuudaslalt((kh) => ({
        khuudasniiDugaar: kh.khuudasniiDugaar + 1,
        khuudasniiKhemjee: 20,
        jagsaalt: [...kh.jagsaalt, ...sonorduulga?.jagsaalt],
      }));
    }
  }

  const [expandedNotifications, setExpandedNotifications] = useState(new Set());

  const MailDropdown = (
    <Suspense fallback={<LoadingSpinner />}>
      <div
        className="mail-dropdown-container"
        style={{
          width: "400px",
          height: "80vh",
          overflowY: "auto",
        }}
      >
        <div className="mail-dropdown-header bg-gradient-to-r from-green-400 to-green-500 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-lg">{t("Шинчэлэлтийн мэдээ")}</span>
          </div>
        </div>
        <div className="overflow-y-auto bg-white dark:bg-gray-800 p-3 space-y-2">
          {allNotifications.length > 0 ? (
            allNotifications.map((mur, index) => {
              const { turul, message, khariltsagchiinNer, _id, tailbar, ajiltniiNer, title } =
                mur?.object || {};

              const isExpanded = expandedNotifications.has(index);
              const displayTitle = mur?.title || title || khariltsagchiinNer || ajiltniiNer || "";
              const displayMessage =
                message || title || tailbar || mur?.message || t("Мэдэгдлийн агуулга байхгүй байна.");

              return (
                <div
                  key={`mail${index}`}
                  className={`w-full overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                    !mur.kharsanEsekh ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <div
                    onClick={() => {
                      const newSet = new Set(expandedNotifications);
                      if (newSet.has(index)) {
                        newSet.delete(index);
                      } else {
                        newSet.add(index);
                        sonorduulgaKharlaa(_id, mur?._id);
                      }
                      setExpandedNotifications(newSet);
                    }}
                    className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                          <MailOutlined className="text-blue-600 dark:text-blue-400 text-sm" />
                        </div>
                        {!mur.kharsanEsekh && (
                          <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate text-sm">
                          {displayTitle}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-white px-2 py-1 rounded-full text-xs">
                        <p className="text-xs text-black dark:text-white truncate">
                          {moment(mur.createdAt).format("MM-DD HH:mm")}
                        </p>
                      </div>
                      <LeftOutlined
                        className={`transition-all duration-300 text-gray-400 dark:text-gray-500 ${
                          isExpanded ? "-rotate-90" : "rotate-0"
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className={`px-4 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:bg-gray-200 ${
                      isExpanded ? "max-h-48 overflow-y-auto pb-4 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <div className="border-t pt-3 dark:border-gray-600">
                      <p
                        className="text-sm leading-relaxed mb-3 cursor-pointer"
                        onClick={(e) => handleMessageClick(displayMessage, e, _id)}
                      >
                        {displayMessage}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full">
              <Empty description={t("Хоосон байна")} />
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="flex h-8 items-center justify-end gap-1 md:gap-3">
        <Dropdown
          trigger={["click"]}
          overlay={MailDropdown}
          placement="bottomRight"
          overlayClassName="mail-dropdown-overlay"
          getPopupContainer={(trigger) => trigger.parentNode}
        >
          <button
            className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 dark:text-white transition-all duration-200"
          >
            <Badge count={medegdelAdminCount} dot>
              <MailOutlined
                className="h-5 w-5 text-gray-600 dark:text-white hover:text-blue-600 transition-colors duration-200"
                style={{
                  animation: medegdelAdminCount > 0 ? "mailFly 2s infinite" : "none",
                  fontSize: "18px",
                }}
              />
            </Badge>
          </button>
        </Dropdown>

        <Dropdown
          trigger="click"
          overlay={
            <Suspense fallback={<LoadingSpinner />}>
              <Menu>
                <Menu.Item>{t("Сонордуулга")}</Menu.Item>
                <Menu.Divider />
                <div style={{ maxHeight: "70vh", overflow: "auto" }} onScroll={onScroll}>
                  {[...jagsaalt, ...(sonorduulga?.jagsaalt || [])].map((mur, i) => {
                    const { turul, message, khariltsagchiinNer, _id, tailbar, ajiltniiNer, ajiltniiId, title } =
                      mur?.object || {};
                    return (
                      <Menu.Item
                        key={`sonorduulga${i}`}
                        onClick={() => sonorduulgaKharlaa(_id, mur?._id)}
                        className={`${mur.kharsanEsekh ? "kharsanSonorduulga opacity-70" : "kharaaguiSonorduulga"}`}
                      >
                        <Link
                          href={{
                            pathname: hrefAvya(mur, ajiltan),
                            query: { id: idAwyaa(mur), notificationTurul: mur?.turul },
                          }}
                        >
                          <div className="relative flex cursor-pointer items-center justify-between space-x-2">
                            <div className="flex" style={{ maxWidth: `2.5rem` }}>
                              <Tooltip title={khariltsagchiinNer}>
                                <img
                                  alt={khariltsagchiinNer}
                                  className={`zoom-in h-10 w-10 rounded-full bg-white`}
                                  src={"/profile.svg"}
                                />
                              </Tooltip>
                              {!mur.kharsanEsekh && (
                                <div className="bg-theme-9 absolute left-0 bottom-0 h-3 w-3 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="grid w-60 grid-cols-2 overflow-hidden">
                              <div className="col-span-1">
                                <a className="font-medium">{khariltsagchiinNer || ajiltniiNer || mur?.title}</a>
                                <div
                                  className="z-50 flex pr-4 flex-row overflow-hidden whitespace-nowrap text-gray-600 dark:text-gray-300"
                                  style={{ textOverflow: "ellipsis" }}
                                >
                                  <div className="truncate">{message || tailbar || title || mur?.message}</div>
                                </div>
                              </div>
                              <div className="col-span-1 space-y-2">
                                <div className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                                  {moment(mur.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                                </div>
                                <div>
                                  {mur.turul === "daalgavar" ? (
                                    <div className="flex justify-center rounded-md bg-green-500 px-2 text-white">
                                      {t("Даалгавар")}
                                    </div>
                                  ) : mur.turul === "sanal" ? (
                                    <div className="flex justify-center rounded-md bg-yellow-500 px-2 text-white">
                                      {t("Санал")}
                                    </div>
                                  ) : mur.turul === "gomdol" ? (
                                    <div className="flex justify-center rounded-md bg-red-500 px-2 text-white">
                                      {t("Гомдол")}
                                    </div>
                                  ) : mur.turul === "medegdel" ? (
                                    <div className="flex justify-center rounded-md bg-blue-500 px-2 text-white">
                                      {t("Мэдэгдэл")}
                                    </div>
                                  ) : mur.turul === "shaardlaga" ? (
                                    <div className="flex justify-center rounded-md bg-blue-500 px-2 text-white">
                                      {t("Шаардлага")}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Menu.Item>
                    );
                  })}
                  {!!sonorduulga && !(sonorduulga?.jagsaalt?.length > 0) && (
                    <Menu.Item>
                      <Empty description="Хоосон байна" />
                    </Menu.Item>
                  )}
                </div>
              </Menu>
            </Suspense>
          }
        >
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 dark:text-white"
          >
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
          overlay={
            <Suspense fallback={<LoadingSpinner />}>
              <Menu>
                <Menu.Item className="profileMenuItem">
                  <div className="text-lg font-medium text-white">{`${(ajiltan?.ovog && ajiltan?.ovog[0]) || ""}.${
                    ajiltan?.ner
                  }`}</div>
                  <div className="text-sm font-medium text-gray-200">{ajiltan?.albanTushaal}</div>
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
                <Menu.Item key="1" className="profileMenuItem" onClick={() => setShowTuslamj(true)}>
                  <div className="flex w-44 items-center space-x-2 text-white">
                    <QuestionOutlined />
                    <span>{t("Тусламж")}</span>
                  </div>
                </Menu.Item>
                <Menu.Item key="2" className="profileMenuItem" onClick={() => showSanalKhuselt(ajiltan)}>
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
          }
          trigger="click"
          className="cursor-pointer"
        >
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
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
        />
      </div>
    </Suspense>
  );
}

export default ProfileTovch;