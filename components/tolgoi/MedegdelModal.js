import React, { useState, useCallback, Suspense } from "react";
import { Modal, Button, Checkbox, Spin } from "antd";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { url } from "services/uilchilgee";

const NotificationModal = React.memo(
  ({
    visible,
    data,
    onClose,
    onDontShowAgain,
    permanentlyDismissed,
    setPermanentlyDismissed,
    messageDetails,
    isMessageModal = false,
  }) => {
    const [dontShowAgainChecked, setDontShowAgainChecked] = useState(false);

    const displayData = getDisplayData({ isMessageModal, data, messageDetails });

    const uuidv4 = generateUUID;

    function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const rand = (Math.random() * 16) | 0;
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}


    const handleCheckboxChange = useCallback((e) => {
      e.stopPropagation();
      setDontShowAgainChecked(e.target.checked);
    }, []);

    const NotificationModalLoading = () => (
      <div className="flex items-center justify-center h-32">
        <Spin size="large" />
      </div>
    );

    const handleClose = useCallback(() => {
      if (data && !isMessageModal) {
        const notifId = data._id || uuidv4();
        if (dontShowAgainChecked) {
          const newDismissed = new Set(permanentlyDismissed);
          newDismissed.add(notifId);
          setPermanentlyDismissed(newDismissed);
          localStorage.setItem("permanentlyDismissedNotifications", JSON.stringify([...newDismissed]));
        }
        onDontShowAgain?.(notifId, dontShowAgainChecked);
      }
      setDontShowAgainChecked(false);
      onClose?.();
    }, [data, dontShowAgainChecked, permanentlyDismissed, setPermanentlyDismissed, onDontShowAgain, onClose, isMessageModal]);

    if (!visible) return null;
function getDisplayData({ isMessageModal, data, messageDetails }) {
  if (isMessageModal) {
    return {
      title: data?.title || "ШИНЭЧЛЭЛТИЙН МЭДЭЭ",
     content: data?.message || "Мэдэгдлийн агуулга байхгүй байна",
      date: format(new Date(), "yyyy-MM-dd HH:mm"),
      image: data?.zurag || null,
      system: "Систем",
      isSuccess: false,
      register: "Тодорхойгүй",
    };
  } else if (data) {
    return {
      title: data.title || "ШИНЭЧЛЭЛТИЙН МЭДЭЭ",
      content: data.message || "Мэдэгдлийн агуулга байхгүй байна",
      date: data.createdAt
        ? format(new Date(data.createdAt), "yyyy-MM-dd HH:mm")
        : "N/A",
      image: data.zurag || null,
      system: data.system || "Систем",
      isSuccess: data.success || false,
      register: data.baiguullagaRegister || "Тодорхойгүй",
    };
  }
  return null;
}

    if (!displayData) return null;

    const isValidImageUrl = (url) =>
      !isMessageModal &&
      typeof url === "string" &&
      (url.startsWith("data:image") || url.startsWith("http") || url.startsWith("/"));

    return (
     <Modal
  aria-labelledby="notification-modal-title"
  className="notification-modal w-[850px] max-w-full"
  width={850}
  title={
    <div className="text-lg font-bold dark:text-white text-center px-6 pt-4 pb-2  dark:border-gray-600 bg-white dark:bg-gray-800 sticky top-0 z-10">
      📢 ШИНЭЧЛЭЛТИЙН МЭДЭЭ 📢
    </div>
  }
  open={visible}
  onCancel={handleClose}
  centered
  closable={false}
  destroyOnClose
  maskClosable={false}
  footer={
    <div className="sticky bottom-0 z-10 bg-white dark:bg-gray-800  dark:border-gray-700 w-full">
      {!isMessageModal ? (
        <div className="flex justify-between  items-center w-full px-6 py-4">
          <Checkbox checked={dontShowAgainChecked} onChange={handleCheckboxChange}>
             <span className="select-none">Дахин харуулахгүй байх</span>
          </Checkbox>
          <Button onClick={handleClose} className="px-6 text-white ">
            <span className="text-black dark:text-white" >Хаах</span>
          </Button>
        </div>
      ) : (
        <div className="flex justify-end w-full px-6 py-4">
          <Button onClick={handleClose} className="px-6">
            Хаах
          </Button>
        </div>
      )}
    </div>
  }
  zIndex={1000}
>
  <Suspense fallback={<NotificationModalLoading />}>
    <div className="max-h-[65vh] overflow-y-auto p-6">
      <div className="flex flex-col items-center">
        {!isMessageModal && (
          <span className="font-medium text-lg dark:text-white mb-4">
            {displayData.title}
          </span>
        )}

        {isValidImageUrl(displayData.image) && (
          <div className="mb-4 w-full">
            <img
              src={
                displayData.image.startsWith("data:image") || displayData.image.startsWith("http")
                  ? displayData.image
                  : `${url}/notificationImage/${displayData.image}`
              }
              alt={`Notification image for ${displayData.title}`}
              className="w-full h-auto max-h-[16rem] object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="w-full">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <div
              className="text-gray-800 dark:text-gray-200 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: displayData.content }}
            />
          </div>

          {!isMessageModal && (
            <div className="flex justify-center items-center text-gray-500 dark:text-gray-400">
              <span>{displayData.date}</span>
            </div>
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
  isMessageModal: PropTypes.bool,
};

export default NotificationModal;