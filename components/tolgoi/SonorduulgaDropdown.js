import React, {
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import { Empty, Spin, Checkbox, Button } from "antd";
import { BellOutlined, LeftOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

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
      sonorduulga: "/khyanalt/duudlaga/duudlaga",
    },
    user: {
      daalgavar: "/khyanalt/daalgavar",
      sanal: "/khyanalt/medegdel/sanalKhuselt",
      gomdol: "/khyanalt/medegdel/sanalKhuselt",
      medegdel: "/khyanalt/medegdel",
      sonorduulga: "/khyanalt/duudlaga/duudlaga",
    },
  };

  const routes = ajiltan.erkh === "Admin" ? baseRoutes.admin : baseRoutes.user;
  return routes[mur.turul] || "";
};

const SonorduulgaDropdown = React.memo(
  ({
    ajiltan,
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
  }) => {
    const { t } = useTranslation();
    const scrollRef = useRef(null);
    const [dontShowAgainStates, setDontShowAgainStates] = useState(new Map());
    const [previousScrollTop, setPreviousScrollTop] = useState(0);
    const [localReadNotifications, setLocalReadNotifications] = useState(
      new Set()
    );
    const isFirstMount = useRef(true);

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

    const handleScroll = useCallback(
      _.debounce((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

        setPreviousScrollTop(scrollTop);

        if (distanceFromBottom <= 50 && !isLoadingMore && hasMore && loadMore) {
          loadMore();
        }
      }, 200),
      [isLoadingMore, hasMore, loadMore]
    );

    const handleCheckboxChange = useCallback((notificationId, checked) => {
      setDontShowAgainStates((prev) => {
        const newMap = new Map(prev);
        newMap.set(notificationId, checked);
        return newMap;
      });
    }, []);

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
            console.error("Failed to mark notification as read:", error);
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

    const handleNotificationClick = useCallback(
      async (e, mur) => {
        e.preventDefault();

        if (mur._id) {
          markAsReadLocally(mur._id);
        }

        if (sonorduulgaKharlaa) {
          try {
            await sonorduulgaKharlaa(mur?.object?._id, mur?._id);
          } catch (error) {
            console.error("Failed to mark notification as read:", error);
          }
        }

        window.location.href = e.target.href;
      },
      [sonorduulgaKharlaa, markAsReadLocally]
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
          <div className="mail-dropdown-header sticky top-0 z-10 rounded-t-lg bg-gradient-to-r from-green-400 to-green-500 p-3 text-white">
            <div className="flex items-center justify-between">
              <span className="text-md font-medium">{t("Сонордуулга")}</span>
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
        <div className="mail-dropdown-header sticky top-0 z-10 rounded-t-lg bg-gradient-to-r from-green-400 to-green-500 p-3 text-white">
          <div className="flex items-center justify-between">
            <span className="text-md font-medium">{t("Сонордуулга")}</span>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="space-y-2 overflow-y-auto rounded-md bg-white p-3 transition-all duration-200 ease-in-out dark:bg-gray-800"
          onScroll={handleScroll}
          style={{
            maxHeight: "calc(60vh - 60px)",
            scrollBehavior: "smooth",
          }}
        >
          {optimizedSonorduulga.length > 0 ? (
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
                    className={`w-full overflow-hidden rounded-xl border-2 transition-all duration-200 ease-in-out ${
                      !isRead
                        ? "border-green-300 bg-white dark:bg-gray-800"
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
                      className="flex cursor-pointer items-center justify-between p-4 transition-colors duration-150 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex flex-1 items-center space-x-3">
                        <div className="relative">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 transition-colors duration-150 dark:bg-green-900">
                            <BellOutlined className="text-sm text-green-500 dark:text-green-300" />
                          </div>
                          {!isRead && (
                            <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-red-500"></div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs font-medium text-gray-800 transition-colors duration-150 dark:text-gray-200">
                            {displayData.title}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="rounded-full px-2 py-1 text-xs text-white">
                          <p className="truncate text-xs text-black transition-colors duration-150 dark:text-white">
                            {format(
                              new Date(mur.createdAt),
                              "yyyy-MM-dd HH:mm"
                            )}
                          </p>
                        </div>
                        {mur.turul === "daalgavar" ? (
                          <div className="flex justify-center rounded-md bg-green-500 px-2 py-1 text-xs text-white transition-all duration-150">
                            {t("Даалгавар")}
                          </div>
                        ) : mur.turul === "sanal" ? (
                          <div className="flex justify-center rounded-md bg-yellow-500 px-2 py-1 text-xs text-white transition-all duration-150">
                            {t("Санал")}
                          </div>
                        ) : mur.turul === "gomdol" ? (
                          <div className="flex justify-center rounded-md bg-red-500 px-2 py-1 text-xs text-white transition-all duration-150">
                            {t("Гомдол")}
                          </div>
                        ) : mur.turul === "medegdel" ? (
                          <div className="flex justify-center rounded-md bg-blue-500 px-2 py-1 text-xs text-white transition-all duration-150">
                            {t("Мэдэгдэл")}
                          </div>
                        ) : mur.turul === "duudlaga" ? (
                          <div className="flex justify-center rounded-md bg-blue-500 px-2 py-1 text-xs text-white transition-all duration-150">
                            {t("Дуудлага")}
                          </div>
                        ) : mur.turul === "shaardlaga" ? (
                          <div className="flex justify-center rounded-md bg-blue-500 px-2 py-1 text-xs text-white transition-all duration-150">
                            {t("Шаардлага")}
                          </div>
                        ) : null}
                        <LeftOutlined
                          className={`text-gray-400 transition-all duration-200 ease-in-out dark:text-gray-500 ${
                            isExpanded ? "-rotate-90" : "rotate-0"
                          }`}
                        />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="animate-in slide-in-from-top relative px-4 pb-4 text-gray-600 duration-200 dark:text-gray-300">
                        <div className="border-t pt-3 dark:border-gray-600">
                          <div
                            dangerouslySetInnerHTML={{ __html: cleanedContent }}
                            className="mb-3 rounded p-2 text-sm leading-relaxed transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-600"
                          />

                          <a
                            href={
                              mur.turul === "duudlaga"
                                ? `/khyanalt/duudlaga/duudlaga?id=${idAwyaa(
                                    mur
                                  )}&notificationTurul=${mur?.turul}`
                                : `${hrefAvya(mur, ajiltan)}?id=${idAwyaa(
                                    mur
                                  )}&notificationTurul=${mur?.turul}`
                            }
                            onClick={(e) => handleNotificationClick(e, mur)}
                            className="block text-sm text-blue-600 transition-colors duration-150 hover:text-blue-800 hover:underline"
                          >
                            {t("Дэлгэрэнгүй харах")}
                          </a>
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
                    {t("Ачааллаж байна")}...
                  </span>
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
};

export default SonorduulgaDropdown;
