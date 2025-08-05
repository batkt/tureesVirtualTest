import React, { useState, useCallback, Suspense } from "react";
import { Modal, Button, Checkbox, Spin } from "antd";
import { format, isValid } from "date-fns"; // Add isValid
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import { url } from "services/uilchilgee";
import { useTranslation } from "react-i18next";

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
  }) => {
    const [dontShowAgainChecked, setDontShowAgainChecked] = useState(
      data?._id ? permanentlyDismissed.has(data._id) : false
    );
    const { t } = useTranslation();

    const displayData = getDisplayData({ isMessageModal, data, messageTitle, messageDetails, messageDate });

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
      (e) => {
        e?.stopPropagation();
        if (data && !isMessageModal) {
          const notifId = data._id || uuidv4();
          if (dontShowAgainChecked) {
            const newDismissed = new Set(permanentlyDismissed);
            newDismissed.add(notifId);
            setPermanentlyDismissed(newDismissed);
            localStorage.setItem(
              "permanentlyDismissedNotifications",
              JSON.stringify([...newDismissed])
            );
            onDontShowAgain?.(notifId, dontShowAgainChecked);
          } else if (permanentlyDismissed.has(notifId)) {
            const newDismissed = new Set(permanentlyDismissed);
            newDismissed.delete(notifId);
            setPermanentlyDismissed(newDismissed);
            localStorage.setItem(
              "permanentlyDismissedNotifications",
              JSON.stringify([...newDismissed])
            );
            onDontShowAgain?.(notifId, dontShowAgainChecked);
          }
        }
        setDontShowAgainChecked(false);
        onClose?.();
      },
      [
        data,
        dontShowAgainChecked,
        permanentlyDismissed,
        setPermanentlyDismissed,
        onDontShowAgain,
        onClose,
        isMessageModal,
      ]
    );

    if (!visible || !displayData) return null;

    const cleanedContent =
      typeof displayData?.content === "string"
        ? displayData.content.replace(/<p>(<br\s*\/?>|\s|&nbsp;)+/i, "<p>")
        : "";

  function getDisplayData({ isMessageModal, data, messageTitle, messageDetails, messageDate }) {
  const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    
    // If it's already a formatted string (contains "оны"), return as is
    if (typeof dateInput === 'string' && dateInput.includes('оны')) {
      return dateInput;
    }
    
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (!isValid(date)) return "N/A";
    return format(date, "yyyy-MM-dd HH:mm");
  };

  const formatTitleDate = (dateInput) => {
    if (!dateInput) return "Мэдэгдлийн гарчиг байхгүй байна";
    
    // If it's already a formatted string (contains "оны"), return as is
    if (typeof dateInput === 'string' && dateInput.includes('оны')) {
      return dateInput;
    }
    
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (!isValid(date)) return "Мэдэгдлийн гарчиг байхгүй байна";
    const year = format(date, "yyyy");
    const month = format(date, "M");
    const day = format(date, "d");
    return `${year} оны ${month} сарын ${day}-ны өдөр`; 
  };

  if (isMessageModal) {
    // Use messageTitle directly if it's provided (it's already formatted)
    // Otherwise, try to format messageDate, or fall back to data.title
    const titleSource = messageTitle || (messageDate ? formatTitleDate(messageDate) : data?.title);
    
    return {
      title: titleSource,
      content: messageDetails || data?.message || "Мэдэгдлийн агуулга байхгүй байна",
      date: formatDate(messageDate),
      image: data?.zurag || null,
      system: "Систем",
      isSuccess: false,
      register: "Тодорхойгүй",
    };
  } else if (data) {
    const titleSource = messageTitle || (messageDate ? formatTitleDate(data) : data?.title);
    
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
      (url.startsWith("data:image") || url.startsWith("http") || url.startsWith("/"));

    return (
      <Modal
        title={
          <div className="flex flex-col items-center py-1">
            <div className="h-1" />
            <div className="sm:text-sm text-base font-medium text-center text-gray-800 dark:text-gray-200">
              {t("📢 ШИНЭЧЛЭЛТИЙН МЭДЭЭ 📢")}
            </div>
            <div className="h-3" />
            <div className="text-sm sm:text-base text-center text-gray-700 dark:text-gray-300">
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
              <div className="flex items-center justify-between w-full flex-col sm:flex-row gap-2 sm:gap-0">
                <Checkbox checked={dontShowAgainChecked} onChange={handleCheckboxChange}>
                  <span className="select-none text-gray-800 dark:text-gray-200 text-xs sm:text-sm">
                    {t("Дахин харуулахгүй")}
                  </span>
                </Checkbox>
                <Button
                  type="primary"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-4 py-1 sm:px-6 sm:py-2 text-xs sm:text-sm"
                >
                  {t("Хаах")}
                </Button>
              </div>
            ) : (
              <div className="flex justify-end w-full">
                <Button
                type="primary"
                  onClick={handleClose}
                  className="bg-gray-100 text-black dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 w-full sm:w-auto px-4 py-1 sm:px-6 sm:py-2 text-xs sm:text-sm"
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
          <div className="mb-1 sm:mb-2 space-y-3">
            <div className="space-y-5 sm:space-y-4">
             <div className="w-full">
              <div className="flex flex-row items-center justify-between w-full">
                <div className="text-left text-sm sm:text-base text-gray-800 dark:text-gray-200">
                  {t("Нийтэлсэн")}
                </div>
                <div className="text-right text-sm sm:text-base text-gray-800 dark:text-gray-200">
                  {displayData.date}
                </div>
              </div>
            </div>
              {isValidImageUrl(displayData.image) && (
                <div className="flex justify-center">
                  <img
                    src={
                      displayData.image.startsWith("data:image") || displayData.image.startsWith("http")
                        ? displayData.image
                        : `${url}/notificationImage/${displayData.image}`
                    }
                    alt={`Notification image for ${displayData.title}`}
                    className="max-w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="sm:space-y-2">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-4 rounded-lg overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: cleanedContent }} />
                </div>
                {!isMessageModal && (
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400"></div>
                )}
              </div>
            </div>
          </div>
        </Suspense>
      </Modal>
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
  messageDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  isMessageModal: PropTypes.bool,
};

export default NotificationModal;