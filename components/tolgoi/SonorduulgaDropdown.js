import React, { useMemo, useEffect, useCallback, useRef, useState } from "react";
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
    },
    user: {
      daalgavar: "/khyanalt/daalgavar",
      sanal: "/khyanalt/medegdel/sanalKhuselt",
      gomdol: "/khyanalt/medegdel/sanalKhuselt",
      medegdel: "/khyanalt/medegdel",
    },
  };

  const routes = ajiltan.erkh === "Admin" ? baseRoutes.admin : baseRoutes.user;
  return routes[mur.turul] || "";
};

const SonorduulgaDropdown = React.memo(({
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

  useEffect(() => {
    if (isVisible && !isInitialLoading && scrollRef.current && allNotifications?.length > 0) {
      scrollRef.current.scrollTop = 0;
     
    }
  }, [isVisible, isInitialLoading, allNotifications?.length]);

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      if (distanceFromBottom <= 50 && !isLoadingMore && hasMore && loadMore) {
        loadMore();
      }
    },
    [isLoadingMore, hasMore, loadMore, allNotifications?.length]
  );

  const handleCheckboxChange = useCallback((notificationId, checked) => {
    setDontShowAgainStates(prev => {
      const newMap = new Map(prev);
      newMap.set(notificationId, checked);
      return newMap;
    });
  }, []);

  const optimizedSonorduulga = useMemo(() => {
    if (!allNotifications) return [];
    
    return allNotifications.map((mur) => ({
      ...mur,
      object: { ...mur.object, zurag: undefined },
    }));
  }, [allNotifications]);

  const getDisplayData = useCallback((mur) => {
    const { turul, message, khariltsagchiinNer, _id, tailbar, ajiltniiNer, title } = mur?.object || {};
    
    return {
      title: mur?.title || title || khariltsagchiinNer || ajiltniiNer || "",
      content: message || title || tailbar || mur?.message || t("Мэдэгдлийн агуулга байхгүй байна."),
      turul: mur.turul
    };
  }, [t]);

  const SonorduulgaLoading = () => (
    <div className="flex items-center justify-center h-64">
      <Spin size="large" />
    </div>
  );

  if (isInitialLoading) {
    return (
      <div
        className="mail-dropdown-container w-full max-w-sm sm:w-[400px] h-[60vh] overflow-y-auto z-[1000]"
        style={{
          width: "400px",
          height: "60vh",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
        <div className="sticky top-0 z-10 mail-dropdown-header bg-gradient-to-r from-green-400 to-green-500 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-md">{t("Сонородуулга")}</span>
          </div>
        </div>
        <SonorduulgaLoading />
      </div>
    );
  }

  return (
    <div
      className="mail-dropdown-container w-full max-w-sm sm:w-[400px] h-[60vh] overflow-y-auto z-[1000]"
      style={{
        width: "400px",
        height: "60vh",
        overflowY: "auto",
        zIndex: 1000,
      }}
    >
      <div className="sticky top-0 z-10 mail-dropdown-header bg-gradient-to-r from-green-400 to-green-500 text-white p-3 rounded-t-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium text-md">{t("Сонордуулга")}</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="overflow-y-auto rounded-md bg-white dark:bg-gray-800 p-3 space-y-2 no-transition-initial"
        onScroll={handleScroll}
        style={{ maxHeight: 'calc(60vh - 60px)' }}
        key={`scroll-container-${isVisible}`} 
      >
        {optimizedSonorduulga.length > 0 ? (
          <>
            {optimizedSonorduulga.map((mur, index) => {
            const isExpanded = expandedNotifications === index;
            const displayData = getDisplayData(mur);
            const notifId = mur._id;
            const isDismissed = permanentlyDismissed.has(notifId);

            if (isDismissed) return null;

            const cleanedContent = displayData?.content
              ?.replace(/<p>(<br\s*\/?>|\s|&nbsp;)+/gi, '<p>')
              ?.replace(/<p>(<br\s*\/?>|&nbsp;|\s)*<\/p>/gi, '')
              ?.replace(/^(\s|<br\s*\/?>)+/i, '');

            return (
              <div
                key={`sonorduulga${mur._id || index}`}
                className={`w-full overflow-hidden rounded-xl border-2 ${
                  !mur.kharsanEsekh
                    ? "border-green-300 bg-white dark:bg-gray-800"
                    : "border-gray-200 dark:border-gray-600"
                }`}
              >
                <div
                  onClick={() => handleExpansionToggle && handleExpansionToggle(index, mur?.object?._id, mur?._id)}
                  className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="relative">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <BellOutlined className="text-green-500 dark:text-green-300 text-sm" />
                      </div>
                      {!mur.kharsanEsekh && (
                        <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200 text-xs">
                        {displayData.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-white px-2 py-1 rounded-full text-xs">
                      <p className="text-xs text-black dark:text-white truncate">
                        {format(new Date(mur.createdAt), "yyyy-MM-dd HH:mm")}
                      </p>
                    </div>
                    {mur.turul === "daalgavar" ? (
                      <div className="flex justify-center rounded-md bg-green-500 px-2 py-1 text-white text-xs">
                        {t("Даалгавар")}
                      </div>
                    ) : mur.turul === "sanal" ? (
                      <div className="flex justify-center rounded-md bg-yellow-500 px-2 py-1 text-white text-xs">
                        {t("Санал")}
                      </div>
                    ) : mur.turul === "gomdol" ? (
                      <div className="flex justify-center rounded-md bg-red-500 px-2 py-1 text-white text-xs">
                        {t("Гомдол")}
                      </div>
                    ) : mur.turul === "medegdel" ? (
                      <div className="flex justify-center rounded-md bg-blue-500 px-2 py-1 text-white text-xs">
                        {t("Мэдэгдэл")}
                      </div>
                    ) : mur.turul === "shaardlaga" ? (
                      <div className="flex justify-center rounded-md bg-blue-500 px-2 py-1 text-white text-xs">
                        {t("Шаардлага")}
                      </div>
                    ) : null}
                    <LeftOutlined
                      className={`transition-transform text-gray-400 dark:text-gray-500 ${
                        isExpanded ? "-rotate-90" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="relative z-1000 px-4 pb-4 text-gray-600 dark:text-gray-300">
                    <div className="border-t pt-3 dark:border-gray-600">
                      <div
                        dangerouslySetInnerHTML={{ __html: cleanedContent }}
                       
                        className="text-sm leading-relaxed mb-3   dark:hover:bg-gray-600 p-2 rounded"
                      />
                      
                      <a
                        href={`${hrefAvya(mur, ajiltan)}?id=${idAwyaa(mur)}&notificationTurul=${mur?.turul}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sonorduulgaKharlaa) {
                            sonorduulgaKharlaa(mur?.object?._id, mur?._id);
                          }
                          window.location.href = e.target.href;
                        }}
                        className="text-blue-600 hover:underline text-sm block"
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
            <div className="flex items-center justify-center p-4">
              <Spin size="small" />
              <span className="ml-2 text-sm text-gray-500">{t("Ачааллаж байна")}...</span>
            </div>
          )}

          {!hasMore && optimizedSonorduulga.length > 0 && (
            <div className="flex items-center justify-center p-4 text-gray-500 dark:text-gray-400 text-sm">
              {t("Илүү мэдэгдэл байхгүй")}
            </div>
          )}
        </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Empty description={t("Хоосон байна")} />
          </div>
        )}
      </div>
    </div>
  );
});

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