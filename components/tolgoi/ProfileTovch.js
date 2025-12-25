import {
  LogoutOutlined,
  QuestionOutlined,
  SettingOutlined,
  MailOutlined,
  LeftOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Menu, Empty, Spin, Input } from "antd";
import Link from "next/link";
import React, {
  useState,
  useEffect,
  Suspense,
  lazy,
  useCallback,
  useMemo,
} from "react";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import useSonorduulga from "hooks/useSonorduulga";
import useAdminMedegdel from "hooks/useAdminMedegdel";
import { FiSend } from "react-icons/fi";
import { useTranslation } from "react-i18next";
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
    tooMutate,
    kharaaguiToo,
    allNotifications: paginatedNotifications,
    isLoadingMore,
    hasMore,
    isInitialLoading,
    loadMore,
    fetchNotifications,
  } = useSonorduulga(token, ajiltan?._id);

  const {
    allNotifications,
    medegdelAdminCount,
    notificationModal,
    permanentlyDismissed,
    animateMail,
    setPermanentlyDismissed,
    handleNotificationClose,
    handleDontShowAgain,
    handleMessageClick,
    formatDate,
  } = useAdminMedegdel(token, ajiltan?._id);

  const { t } = useTranslation();

  const [expandedNotifications, setExpandedNotifications] = useState(null);
  const [sonorduulgaDropdownVisible, setSonorduulgaDropdownVisible] =
    useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mailSearchQuery, setMailSearchQuery] = useState("");

  const sonorduulgaKharlaa = useCallback(
    async (id, sonorduulgaId) => {
      try {
        await uilchilgee(token).post("/sanalKharlaa", { id, sonorduulgaId });
        sonorduulgaMutate();
        tooMutate();
      } catch (error) {
        aldaaBarigch(error);
      }
    },
    [token, sonorduulgaMutate, tooMutate]
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

  const handleModalClose = useCallback(
    async (dontShowAgainChecked = false) => {
      const success = await handleNotificationClose(
        notificationModal.data,
        dontShowAgainChecked
      );
      return success;
    },
    [handleNotificationClose, notificationModal.data]
  );

  const handleMailDropdownClose = useCallback(() => {
    setDropdownVisible(false);
    setExpandedNotifications(null);
    setMailSearchQuery("");
  }, []);

  const handleSonorduulgaDropdownClose = useCallback(() => {
    setSonorduulgaDropdownVisible(false);
    setExpandedNotifications(null);
  }, []);

  const filteredNotifications = useMemo(() => {
    if (!mailSearchQuery.trim()) {
      return allNotifications;
    }

    const searchTerm = mailSearchQuery.toLowerCase().trim();

    return allNotifications.filter((mur) => {
      const {
        turul,
        message,
        khariltsagchiinNer,
        _id,
        tailbar,
        ajiltniiNer,
        title,
      } = mur?.object || {};

      const displayTitle = (
        mur?.title ||
        title ||
        khariltsagchiinNer ||
        ajiltniiNer ||
        ""
      )
        .replace(/<[^>]+>/g, "")
        .toLowerCase();

      const displayMessage = (
        message ||
        (title ? `${title}-ны өдөр` : null) ||
        tailbar ||
        mur?.message ||
        ""
      ).toLowerCase();

      // Search in title, message, and notification type
      return (
        displayTitle.includes(searchTerm) ||
        displaytoastincludes(searchTerm) ||
        (turul && turul.toLowerCase().includes(searchTerm))
      );
    });
  }, [allNotifications, mailSearchQuery]);

  const handleSearchChange = useCallback((e) => {
    setMailSearchQuery(e.target.value);
    setExpandedNotifications(null);
  }, []);

  const clearSearch = useCallback(() => {
    setMailSearchQuery("");
    setExpandedNotifications(null);
  }, []);

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
          <div className="mail-dropdown-header sticky top-0 z-10 rounded-t-lg bg-gradient-to-r from-green-800 to-green-500 p-3 text-white">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-md font-medium">
                {t("Шинэчлэлтийн мэдээ")}
              </span>
              <button
                onClick={handleMailDropdownClose}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <CloseOutlined className="text-sm text-white" />
              </button>
            </div>
            <div className="relative">
              <Input
                className="box text-sm"
                placeholder={t("Хайх...")}
                value={mailSearchQuery}
                onChange={handleSearchChange}
                prefix={<SearchOutlined className="text-gray-400" />}
                suffix={
                  mailSearchQuery && (
                    <button
                      onClick={clearSearch}
                      className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-200"
                    >
                      <CloseOutlined className="text-xs text-gray-400" />
                    </button>
                  )
                }
                size="small"
              />
            </div>
          </div>
          <div className="no-transition-initial space-y-2 overflow-y-auto rounded-md bg-white p-3 dark:bg-gray-800">
            {filteredNotifications.length > 0 ? (
              <>
                {mailSearchQuery && (
                  <div className="mb-2 px-2 text-xs text-gray-500 dark:text-gray-400">
                    {t("{{count}} илэрц олдлоо", {
                      count: filteredNotifications.length,
                    })}
                  </div>
                )}
                {filteredNotifications.map((mur, index) => {
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

                  const cleanedContent = displayTitle
                    ?.replace(/<p>(<br\s*\/?>|\s|&nbsp;)+/gi, "<p>")
                    ?.replace(/<p>(<br\s*\/?>|&nbsp;|\s)*<\/p>/gi, "")
                    ?.replace(/^(\s|<br\s*\/?>)+/i, "")
                    ?.replace(/<mark[^>]*>/gi, "")
                    ?.replace(/<\/mark>/gi, "");

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
                            <h3
                              className="text-xs font-medium text-gray-800 dark:text-gray-200"
                              dangerouslySetInnerHTML={{
                                __html: cleanedContent,
                              }}
                            />
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
                              dangerouslySetInnerHTML={{
                                __html: mailSearchQuery
                                  ? highlightText(
                                      cleanedContent,
                                      mailSearchQuery
                                    )
                                  : cleanedContent,
                              }}
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
                })}
              </>
            ) : mailSearchQuery ? (
              <div className="flex h-full items-center justify-center">
                <Empty
                  description={
                    <span className="text-gray-500 dark:text-gray-400">
                      {t("«{{query}}» хайлтаар илэрц олдсонгүй", {
                        query: mailSearchQuery,
                      })}
                    </span>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
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
      filteredNotifications,
      expandedNotifications,
      mailSearchQuery,
      t,
      handleMessageClick,
      handleExpansionToggle,
      formatDate,
      handleMailDropdownClose,
      handleSearchChange,
      clearSearch,
    ]
  );

  const ProfileDropdown = useMemo(
    () => (
      <Suspense fallback={<LoadingSpinner />}>
        <Menu className="bg-green-600">
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
            <Link href="/khyanalt/tokhirgoo" legacyBehavior>
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
          visible={dropdownVisible}
          onVisibleChange={(visible) => {
            setDropdownVisible(visible);
            if (!visible) {
              setExpandedNotifications(null);
              setMailSearchQuery("");
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
                handleMessageClick={fetchNotifications}
                expandedNotifications={expandedNotifications}
                handleExpansionToggle={handleExpansionToggle}
                sonorduulgaKharlaa={sonorduulgaKharlaa}
                allNotifications={paginatedNotifications}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                isInitialLoading={isInitialLoading}
                loadMore={loadMore}
                isVisible={sonorduulgaDropdownVisible}
                onClose={handleSonorduulgaDropdownClose}
              />
            </Suspense>
          }
          visible={sonorduulgaDropdownVisible}
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
          onClose={handleModalClose}
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
