import React, {
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import { Empty, Spin, Checkbox, Button } from "antd";
import { BellOutlined, LeftOutlined, CloseOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
const formatMessage = (msg) => {
  if (!msg) return "";
  let formatted = msg;
  // Translate priorities
  formatted = formatted.replace(/\bengiin\b/gi, "Энгийн");
  formatted = formatted.replace(/\byaraltai\b/gi, "Яаралтай");
  formatted = formatted.replace(/\bnen yaraltai\b/gi, "Нэн яаралтай");
  formatted = formatted.replace(/\bbaga\b/gi, "Бага");
  
  // Format ISO dates (pattern: YYYY-MM-DDTHH:mm:ss.sssZ)
  const isoDateRegex = /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\b/g;
  formatted = formatted.replace(isoDateRegex, (match) => {
    try {
      return format(new Date(match), "yyyy-MM-dd");
    } catch (e) {
      return match;
    }
  });

  return formatted;
};

const idAwyaa = (mur) => {
  switch (mur.turul) {
    case "setgegdel":
      return mur?.object?.daalgavriinId;
    case "daalgavar":
    case "medegdel":
      return mur?.object?._id;
    default:
      return mur?.object?.khariltsagchiinNer;
  }
};

const hrefAvya = (mur, ajiltan) => {
  const baseRoutes = {
    admin: {
      daalgavar: "/khyanalt/daalgavar/admin",
      sanal: "/khyanalt/medegdel/sanalKhuselt",
      gomdol: "/khyanalt/medegdel/sanalKhuselt",
      medegdel: "/khyanalt/medegdel",
      sonorduulga: "/khyanalt/medegdel/duudlaga",
    },
    user: {
      daalgavar: "/khyanalt/daalgavar",
      sanal: "/khyanalt/medegdel/sanalKhuselt",
      gomdol: "/khyanalt/medegdel/sanalKhuselt",
      medegdel: "/khyanalt/medegdel",
      sonorduulga: "/khyanalt/medegdel/duudlaga",
    },
  };

  const routes = ajiltan.erkh === "Admin" ? baseRoutes.admin : baseRoutes.user;
  return routes[mur.turul] || "";
};

const getTurulInfo = (turul) => {
  const turulMap = {
    duudlaga: {
      label: "Дуудлага",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    daalgavar: {
      label: "Даалгавар",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    medegdel: {
      label: "Мэдэгдэл",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    gomdol: {
      label: "Гомдол",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    sanal: {
      label: "Санал",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    setgegdel: {
      label: "Сэтгэгдэл",
      color:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    },
    medegdelAdmin: {
      label: "Админ мэдэгдэл",
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
    medegdelAdminAppWeb: {
      label: "Админ мэдэгдэл",
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
  };

  return (
    turulMap[turul] || {
      label: turul,
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      icon: "📄",
    }
  );
};

const SonorduulgaDropdown = React.memo(
  ({
    handleMessageClick,
    expandedNotifications,
    handleExpansionToggle,
    sonorduulgaKharlaa,
    allNotifications,
    isLoadingMore,
    hasMore,
    isInitialLoading,
    loadMore,
    isVisible,
    permanentlyDismissed = new Set(),
    setPermanentlyDismissed,
    onDontShowAgain,
    fsmNotifications = [],
    fsmUnreadCount = 0,
    fsmLoading = false,
    markFsmAsRead,
    markAllFsmAsRead,
    onClose,
  }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("system"); // system or service
    const scrollRef = useRef(null);
    const [dontShowAgainStates, setDontShowAgainStates] = useState(new Map());
    const [previousScrollTop, setPreviousScrollTop] = useState(0);
    const [localReadNotifications, setLocalReadNotifications] = useState(
      new Set()
    );
    const router = useRouter();
    const isFirstMount = useRef(true);

    const handleScroll = useCallback(() => {
      if (!scrollRef.current || isLoadingMore || !hasMore) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const threshold = 100;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      if (isNearBottom) {
        loadMore();
      }
    }, [isLoadingMore, hasMore, loadMore]);

    useEffect(() => {
      if (isVisible && !isInitialLoading && scrollRef.current) {
        if (isFirstMount.current) {
          scrollRef.current.scrollTop = 0;
          isFirstMount.current = false;
        }
      }
    }, [isVisible, isInitialLoading]);

    useEffect(() => {
      if (!isVisible) {
        isFirstMount.current = true;
      }
    }, [isVisible]);

    useEffect(() => {
      if (scrollRef.current && !isInitialLoading) {
        const currentScrollTop = scrollRef.current.scrollTop;
        if (currentScrollTop > 0) {
          setPreviousScrollTop(currentScrollTop);
        }
      }
    }, [allNotifications?.length, isInitialLoading]);

    useEffect(() => {
      if (scrollRef.current && !isLoadingMore && previousScrollTop > 0) {
        const timeoutId = setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = previousScrollTop;
          }
        }, 50);

        return () => clearTimeout(timeoutId);
      }
    }, [isLoadingMore, previousScrollTop]);

    const markAsReadLocally = useCallback((notificationId) => {
      setLocalReadNotifications((prev) => new Set([...prev, notificationId]));
    }, []);

    const handleExpansionToggleWithRead = useCallback(
      async (index, objectId, notificationId) => {
        if (notificationId) {
          markAsReadLocally(notificationId);
        }

        if (sonorduulgaKharlaa && objectId && notificationId) {
          try {
            await sonorduulgaKharlaa(objectId, notificationId);
          } catch (error) {
            setLocalReadNotifications((prev) => {
              const newSet = new Set(prev);
              newSet.delete(notificationId);
              return newSet;
            });
          }
        }

        if (handleExpansionToggle) {
          handleExpansionToggle(index, objectId, notificationId);
        }
      },
      [handleExpansionToggle, markAsReadLocally, sonorduulgaKharlaa]
    );

    const optimizedSonorduulga = useMemo(() => {
      if (!allNotifications) return [];

      return allNotifications.map((mur) => ({
        ...mur,
        object: { ...mur.object, zurag: undefined },
      }));
    }, [allNotifications]);

    const getDisplayData = useCallback(
      (mur) => {
        const {
          turul,
          message,
          khariltsagchiinNer,
          _id,
          tailbar,
          ajiltniiNer,
          title,
        } = mur?.object || {};

        return {
          title: mur?.title || title || khariltsagchiinNer || ajiltniiNer || "",
          content:
            message ||
            title ||
            tailbar ||
            mur?.message ||
            t("Мэдэгдлийн агуулга байхгүй байна."),
          turul: mur.turul,
        };
      },
      [t]
    );

    const SonorduulgaLoading = () => (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );

    if (isInitialLoading) {
      return (
        <div
          className="mail-dropdown-container z-[1000] h-[60vh] w-full max-w-sm overflow-y-auto sm:w-[400px]"
          style={{
            width: "400px",
            height: "60vh",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          <div className="mail-dropdown-header sticky top-0 z-10 rounded-t-2xl border-b-2 border-green-400 bg-white p-0 text-white shadow-lg dark:border-green-600 dark:bg-gray-800">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-t-lg">
              <span className="text-md font-medium">{t("Сонордуулга")}</span>
              <button
                onClick={onClose}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <CloseOutlined className="text-sm text-white" />
              </button>
            </div>
            <div className="flex w-full border-b dark:border-gray-700">
              <button 
                onClick={() => setActiveTab("system")}
                className={`flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === 'system' ? 'text-green-600 border-b-2 border-green-600 dark:text-green-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Систем ({allNotifications?.length || 0})
              </button>
              <button 
                onClick={() => setActiveTab("service")}
                className={`flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === 'service' ? 'text-green-600 border-b-2 border-green-600 dark:text-green-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t("Үйлчилгээ сонордуулга")} ({fsmUnreadCount})
              </button>
            </div>
          </div>
          <SonorduulgaLoading />
        </div>
      );
    }

    return (
      <div
        className="mail-dropdown-container z-[1000] h-[60vh] w-full max-w-sm overflow-y-auto sm:w-[400px]"
        style={{
          width: "400px",
          height: "60vh",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
        <div className="mail-dropdown-header sticky top-0 z-10 rounded-t-lg border-b-2 border-green-400 bg-white p-0 text-white shadow-lg dark:border-green-600 dark:bg-gray-800">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-t-lg">
            <span className="text-md font-medium">{t("Сонордуулга")}</span>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <CloseOutlined className="text-sm text-white" />
            </button>
          </div>
          <div className="flex w-full border-b dark:border-gray-700">
              <button 
                onClick={() => setActiveTab("system")}
                className={`flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === 'system' ? 'text-green-600 border-b-2 border-green-600 dark:text-green-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Систем
              </button>
              <button 
                onClick={() => setActiveTab("service")}
                className={`flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === 'service' ? 'text-green-600 border-b-2 border-green-600 dark:text-green-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t("Үйлчилгээ сонордуулга")}
                {fsmUnreadCount > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[9px]">{fsmUnreadCount}</span>}
              </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="no-transition-initial space-y-2 overflow-y-auto rounded-md bg-white p-3 dark:bg-gray-800"
        >
          {activeTab === "system" ? (
            optimizedSonorduulga.length > 0 ? (
            <>
              {optimizedSonorduulga.map((mur, index) => {
                const isExpanded = expandedNotifications === index;
                const displayData = getDisplayData(mur);
                const notifId = mur._id;
                const isDismissed = permanentlyDismissed.has(notifId);

                const isRead =
                  mur.kharsanEsekh || localReadNotifications.has(notifId);

                if (isDismissed) return null;

                const cleanedContent = displayData?.content
                  ?.replace(/<p>(<br\s*\/?>|\s|&nbsp;)+/gi, "<p>")
                  ?.replace(/<p>(<br\s*\/?>|&nbsp;|\s)*<\/p>/gi, "")
                  ?.replace(/^(\s|<br\s*\/?>)+/i, "");

                return (
                  <div
                    key={`sonorduulga${mur._id || index}`}
                    className={`w-full overflow-hidden rounded-xl border-2 ${
                      !isRead
                        ? "border-green-300 bg-white dark:bg-gray-800 "
                        : "border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <div
                      onClick={() =>
                        handleExpansionToggleWithRead(
                          index,
                          mur?.object?._id,
                          mur?._id
                        )
                      }
                      className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex flex-1 items-center space-x-3">
                        <div className="relative">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <BellOutlined className="text-sm text-green-500 dark:text-green-300" />
                          </div>
                          {!isRead && (
                            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-red-500"></div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs font-medium text-gray-800 dark:text-gray-200">
                            {displayData.title}
                          </h3>
                          <div className="mt-1 flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                getTurulInfo(mur.turul).color
                              }`}
                            >
                              <span className="mr-1">
                                {getTurulInfo(mur.turul).icon}
                              </span>
                              {getTurulInfo(mur.turul).label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="rounded-full px-2 py-1 text-xs text-white">
                          <p className="truncate text-xs text-black dark:text-white">
                            {format(
                              new Date(mur.createdAt),
                              "yyyy-MM-dd HH:mm"
                            )}
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
                            onClick={(e) => {
                              handleMessageClick(
                                displayData.title,
                                displayData.content,
                                mur.createdAt,
                                e,
                                mur._id
                              );
                              router.push("/khyanalt/medegdel/duudlaga");
                            }}
                            className="mb-3 max-h-[100px] cursor-pointer overflow-y-auto rounded p-2 text-sm leading-relaxed hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: cleanedContent,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoadingMore && (
                <div className="flex items-center justify-center p-4 transition-opacity duration-200">
                  <Spin size="small" />
                  <span className="ml-2 animate-pulse text-sm text-gray-500">
                    {t("Ачаалж байна")}...
                  </span>
                </div>
              )}

              {hasMore && optimizedSonorduulga.length > 0 && (
                <div className="flex items-center justify-center p-4">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    {isLoadingMore ? t("Ачаалж байна...") : t("Илүү ачаалах")}
                  </button>
                </div>
              )}

              {!hasMore && optimizedSonorduulga.length > 0 && (
                <div className="flex items-center justify-center p-4 text-sm text-gray-500 transition-colors duration-150 dark:text-gray-400">
                  {t("Илүү мэдэгдэл байхгүй")}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center transition-opacity duration-200">
              <Empty description={t("Хоосон байна")} />
            </div>
          )
        ) : (
          <>
              {!fsmLoading && fsmUnreadCount > 0 && (
                <div className="flex justify-end pb-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (markAllFsmAsRead) markAllFsmAsRead();
                    }}
                    className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                  >
                    {t("Бүгдийг уншсан")}
                  </button>
                </div>
              )}
              {fsmLoading && fsmNotifications.length === 0 ? (
                <SonorduulgaLoading />
              ) : fsmNotifications.length > 0 ? (
                fsmNotifications.map((notif, index) => (
                  <div
                    key={`fsm-${notif._id}`}
                    className={`w-full overflow-hidden rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      !notif.kharsanEsekh
                        ? "border-green-300 bg-white dark:bg-gray-800"
                        : "border-gray-200 dark:border-gray-600"
                    }`}
                    onClick={async () => {
                      if (markFsmAsRead) await markFsmAsRead(notif._id);
                      
                      // Priority 1: Direct URL from notification
                      if (notif.url) {
                        router.push(notif.url);
                      } 
                      // Priority 2: Structured data (taskId, projectId)
                      else if (notif.taskId || (notif.data && notif.data.taskId)) {
                        const tId = notif.taskId || notif.data.taskId;
                        router.push(`/khyanalt/uilchilgee/tuluvluguu?taskId=${tId}${notif.turul === 'chat' ? '&chat=open' : ''}`);
                      }
                      else if (notif.projectId || (notif.data && notif.data.projectId)) {
                        const pId = notif.projectId || notif.data.projectId;
                        router.push(`/khyanalt/uilchilgee/tuluvluguu?projectId=${pId}`);
                      }
                      // Priority 3: Fallback map based on type
                      else {
                        const pathMap = {
                          taskCompleted: "/khyanalt/uilchilgee/tuluvluguu",
                          newTask: "/khyanalt/uilchilgee/tuluvluguu",
                          taskAdded: "/khyanalt/uilchilgee/tuluvluguu",
                          taskUpdated: "/khyanalt/uilchilgee/tuluvluguu",
                          chat: "/khyanalt/uilchilgee/tuluvluguu",
                          message: "/khyanalt/uilchilgee/tuluvluguu",
                          inventoryLow: "/khyanalt/uilchilgee/baraaMaterial",
                          newCustomer: "/khyanalt/uilchilgee/uilchluulegch"
                        };
                        router.push(pathMap[notif.turul] || "/khyanalt/uilchilgee/khynalt");
                      }
                      onClose?.();
                    }}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex flex-1 items-center space-x-3">
                        <div className="relative">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <BellOutlined className="text-sm text-blue-500 dark:text-blue-300" />
                          </div>
                          {!notif.kharsanEsekh && (
                            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-red-500"></div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            {formatMessage(notif.title)}
                          </h3>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 whitespace-pre-wrap line-clamp-3">
                             {formatMessage(notif.message)}
                          </p>
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-400 shrink-0 ml-2">
                         {format(new Date(notif.createdAt), "MM/dd HH:mm")}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center p-10">
                   <Empty description={t("Мэдэгдэл байхгүй")} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);

SonorduulgaDropdown.propTypes = {
  ajiltan: PropTypes.object.isRequired,
  handleMessageClick: PropTypes.func,
  expandedNotifications: PropTypes.instanceOf(Set).isRequired,
  handleExpansionToggle: PropTypes.func,
  sonorduulgaKharlaa: PropTypes.func,
  allNotifications: PropTypes.array,
  isLoadingMore: PropTypes.bool,
  hasMore: PropTypes.bool,
  isInitialLoading: PropTypes.bool,
  loadMore: PropTypes.func,
  isVisible: PropTypes.bool,
  permanentlyDismissed: PropTypes.instanceOf(Set),
  setPermanentlyDismissed: PropTypes.func,
  onDontShowAgain: PropTypes.func,
};

SonorduulgaDropdown.defaultProps = {
  allNotifications: [],
  isLoadingMore: false,
  hasMore: true,
  isInitialLoading: true,
  isVisible: false,
  permanentlyDismissed: new Set(),
  loadMore: () => {},
};

export default SonorduulgaDropdown;
