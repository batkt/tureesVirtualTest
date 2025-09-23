import React, { useState, useCallback, useEffect, Suspense } from "react";
import { Modal, Button, Checkbox, Spin } from "antd";
import { format, isValid } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import { url } from "services/uilchilgee";
import { useTranslation } from "react-i18next";
import LinkPreview from "./LinkPreview";
import { extractUrls } from "../../utils/linkUtils";

const NotificationModal = React.memo(
  ({
    visible,
    data,
    onClose,
    onDontShowAgain,
    permanentlyDismissed,
    setPermanentlyDismissed,
    messageTitle,
    messageDetails,
    messageDate,
    isMessageModal = false,
    token,
  }) => {
    const [dontShowAgainChecked, setDontShowAgainChecked] = useState(
      data?.adminMedegdelId
        ? permanentlyDismissed.has(data.adminMedegdelId)
        : false
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
      setDontShowAgainChecked(
        data?.adminMedegdelId
          ? permanentlyDismissed.has(data.adminMedegdelId)
          : false
      );
    }, [data, permanentlyDismissed]);

    const handleCheckboxChange = useCallback((e) => {
      e.stopPropagation();
      setDontShowAgainChecked(e.target.checked);
    }, []);

    const NotificationModalLoading = () => (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );

    const handleClose = useCallback(
      async (e) => {
        e?.stopPropagation();

        if (!data) {
          onClose?.();
          return;
        }

        setIsSubmitting(true);

        try {
          const success = await onClose(dontShowAgainChecked);

          if (success !== false) {
            setDontShowAgainChecked(false);

            if (dontShowAgainChecked) {
              const notifId = data._id || uuidv4();
              onDontShowAgain?.(notifId, dontShowAgainChecked);
            }
          } else {
            setDontShowAgainChecked(false);
          }
        } catch (error) {
          setDontShowAgainChecked(false);
        } finally {
          setIsSubmitting(false);
        }
      },
      [data, dontShowAgainChecked, onClose, onDontShowAgain]
    );

    if (!visible || !data) return null;

    const displayData = getDisplayData({
      isMessageModal,
      data,
      messageTitle,
      messageDetails,
      messageDate,
    });

    const cleanedContent =
      typeof displayData?.content === "string"
        ? displayData.content
            .replace(/<br\s*\/?>/gi, "")
            .replace(/<p>(?:\s|&nbsp;)+/gi, "<p>")
            .replace(/<p([^>]*)>/g, '<p$1 style="text-align:justify;">')
            .replace(/<div([^>]*)>/g, '<div$1 style="text-align:justify;">')
        : "";

    const ContentWithLinkPreviews = ({ content }) => {
      if (!content) return null;

      const urls = extractUrls(content);

      if (urls.length === 0) {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
      }

      const firstUrl = urls[0];

      let cleanContent = content;
      urls.forEach((urlObj) => {
        cleanContent = cleanContent.replace(urlObj.url, "");
      });

      cleanContent = cleanContent
        .replace(/\s+/g, " ")
        .replace(/<p>\s*<\/p>/g, "")
        .replace(/<div>\s*<\/div>/g, "")
        .trim();

      return (
        <div className="space-y-3">
          {cleanContent && (
            <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
          )}

          <div className="flex items-center justify-center">
            <LinkPreview
              url={firstUrl.url}
              className="sm:w-10/12 lg:w-11/12"
              height={300}
            />
          </div>
        </div>
      );
    };

    function getDisplayData({
      isMessageModal,
      data,
      messageTitle,
      messageDetails,
      messageDate,
    }) {
      const formatDate = (dateInput) => {
        if (!dateInput) return "N/A";
        if (typeof dateInput === "string" && dateInput.includes("оны"))
          return dateInput;
        const date =
          dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (!isValid(date)) return "N/A";
        return format(date, "yyyy-MM-dd HH:mm");
      };

      const formatTitleDate = (dateInput) => {
        if (!dateInput) return "Мэдэгдлийн гарчиг байхгүй байна";
        if (typeof dateInput === "string" && dateInput.includes("оны"))
          return dateInput;
        const date =
          dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (!isValid(date)) return "Мэдэгдлийн гарчиг байхгүй байна";
        const year = format(date, "yyyy");
        const month = format(date, "M");
        const day = format(date, "d");
        return `${year} оны ${month} сарын ${day}-ны өдөр`;
      };

      if (isMessageModal) {
        const titleSource =
          messageTitle ||
          (messageDate ? formatTitleDate(messageDate) : data?.title);
        return {
          title: titleSource,
          content:
            messageDetails ||
            data?.message ||
            "Мэдэгдлийн агуулга байхгүй байна",
          date: formatDate(messageDate),
          image: data?.zurag || null,
          system: "Систем",
          isSuccess: false,
          register: "Тодорхойгүй",
        };
      } else if (data) {
        const titleSource =
          messageTitle || (messageDate ? formatTitleDate(data) : data?.title);
        return {
          title: titleSource,
          content: data.message || "Мэдэгдлийн агуулга байхгүй байна",
          date: formatDate(data.createdAt),
          image: data.zurag || null,
          system: data.system || "Систем",
          isSuccess: data.success || false,
          register: data.baiguullagaRegister || "Тодорхойгүй",
        };
      }
      return null;
    }

    const isValidImageUrl = (url) =>
      !isMessageModal &&
      typeof url === "string" &&
      (url.startsWith("data:image") ||
        url.startsWith("http") ||
        url.startsWith("/"));

    return (
      <div className="update-modal">
        <Modal
          title={
            <div className="flex flex-col items-center py-1">
              <div className="h-1" />
              <div className="text-base font-medium text-center text-gray-800 dark:text-gray-200 sm:text-sm">
                {t("📢 ШИНЭЧЛЭЛТИЙН МЭДЭЭ 📢")}
              </div>
              <div className="h-3" />
              <div className="text-sm text-center text-gray-700 dark:text-gray-300 sm:text-base">
                {displayData?.title}
              </div>
              <div className="h-1" />
            </div>
          }
          open={visible}
          onCancel={handleClose}
          centered
          closable={false}
          destroyOnClose
          maskClosable={false}
          zIndex={3000}
          width={900}
          getPopupContainer={() => document.body}
          footer={
            <div className="flex items-center p-2 sm:p-4">
              {!isMessageModal ? (
                <div className="flex flex-col items-center justify-between w-full gap-2 sm:flex-row sm:gap-0">
                  <Checkbox
                    checked={dontShowAgainChecked}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  >
                    <span className="text-xs text-gray-800 select-none dark:text-gray-200 sm:text-sm">
                      {t("Дахин харуулахгүй")}
                    </span>
                  </Checkbox>
                  <Button
                    type="primary"
                    onClick={handleClose}
                    loading={isSubmitting}
                    className="w-full px-4 py-1 text-xs sm:w-auto sm:px-6 sm:py-2 sm:text-sm"
                  >
                    {isSubmitting ? t("Хадгалж байна...") : t("Хаах")}
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end w-full">
                  <Button
                    type="primary"
                    onClick={handleClose}
                    className="w-full px-4 py-1 text-xs text-black bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 sm:w-auto sm:px-6 sm:py-2 sm:text-sm"
                  >
                    {t("Хаах")}
                  </Button>
                </div>
              )}
            </div>
          }
          bodyStyle={{
            maxHeight: "60vh",
            overflowY: "auto",
            padding: "1rem",
          }}
        >
          <Suspense fallback={<NotificationModalLoading />}>
            <div className="mb-1 space-y-3 sm:mb-2">
              <div className="space-y-5 sm:space-y-4">
                <div className="w-full">
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="text-sm text-left text-gray-800 dark:text-gray-200 sm:text-base">
                      {t("Нийтэлсэн")}
                    </div>
                    <div className="text-sm text-right text-gray-800 dark:text-gray-200 sm:text-base">
                      {displayData.date}
                    </div>
                  </div>
                </div>
                {isValidImageUrl(displayData.image) && (
                  <div className="flex justify-center">
                    <img
                      src={
                        displayData.image.startsWith("data:image") ||
                        displayData.image.startsWith("http")
                          ? displayData.image
                          : `${url}/notificationImage/${displayData.image}`
                      }
                      alt={`Notification image for ${displayData.title}`}
                      className="h-auto max-w-full rounded-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="sm:space-y-2">
                  <div className="p-2 overflow-y-auto bg-gray-100 rounded-lg max-h-96 dark:bg-gray-700 sm:p-4">
                    <ContentWithLinkPreviews content={cleanedContent} />
                  </div>
                  {!isMessageModal && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm"></div>
                  )}
                </div>
              </div>
            </div>
          </Suspense>
        </Modal>
      </div>
    );
  }
);

NotificationModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  data: PropTypes.object,
  onClose: PropTypes.func,
  onDontShowAgain: PropTypes.func,
  permanentlyDismissed: PropTypes.instanceOf(Set).isRequired,
  setPermanentlyDismissed: PropTypes.func.isRequired,
  messageDetails: PropTypes.string,
  messageTitle: PropTypes.string,
  messageDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  isMessageModal: PropTypes.bool,
  token: PropTypes.string.isRequired,
};

export default NotificationModal;
