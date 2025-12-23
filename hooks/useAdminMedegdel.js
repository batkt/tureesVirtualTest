import { useState, useEffect, useCallback, useMemo } from "react";
import { format, isValid } from "date-fns";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { socket } from "services/uilchilgee";
import { useAuth } from "services/auth";
import useSonorduulga from "hooks/useSonorduulga";

const useAdminMedegdel = (token, ajiltanId, options = {}) => {
  const { skipAutoShow = false, enableRealTimeUpdates = true } = options;

  const { t } = useTranslation();
  const { baiguullaga } = useAuth();
  const { sonorduulga, sonorduulgaMutate, jagsaalt } = useSonorduulga(
    token,
    ajiltanId
  );

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
  const [permanentlyDismissed, setPermanentlyDismissed] = useState(new Set());
  const [animateMail, setAnimateMail] = useState(false);
  const [hasShownNotificationThisSession, setHasShownNotificationThisSession] =
    useState(false);
  const [serverSyncStatus, setServerSyncStatus] = useState(new Map());

  const formatDate = useCallback((dateInput) => {
    if (!dateInput) return "N/A";
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return isValid(date) ? format(date, "yyyy-MM-dd HH:mm") : "N/A";
  }, []);

  const shouldShowNotification = useCallback(
    (notification) =>
      !Array.isArray(notification?.dakhijKharakhguiAjiltniiIdnuud) ||
      !notification.dakhijKharakhguiAjiltniiIdnuud.includes(ajiltanId),
    [ajiltanId]
  );

  const allNotifications = useMemo(() => {
    const allSources = [
      ...(jagsaalt || []),
      ...(sonorduulga?.jagsaalt || []),
      ...realTimeNotifications,
    ];

    const adminNotifications = allSources
      .filter((mur) => mur?.turul === "medegdelAdmin" && mur?._id)
      .map((mur) => ({
        ...mur,
        object: { ...mur.object, zurag: undefined },
      }));

    const uniqueNotifications = new Map();

    adminNotifications.forEach((notification) => {
      const id = notification._id;
      if (!uniqueNotifications.has(id)) {
        uniqueNotifications.set(id, notification);
      } else {
        const existing = uniqueNotifications.get(id);
        const existingDate = new Date(
          existing.updatedAt || existing.createdAt || 0
        );
        const newDate = new Date(
          notification.updatedAt || notification.createdAt || 0
        );

        if (newDate >= existingDate) {
          uniqueNotifications.set(id, notification);
        }
      }
    });

    return Array.from(uniqueNotifications.values()).sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [realTimeNotifications, jagsaalt, sonorduulga?.jagsaalt]);

  const medegdelAdminCount = useMemo(() => {
    return allNotifications.filter((mur) => !mur.kharsanEsekh).length;
  }, [allNotifications]);

  useEffect(() => {
    if (
      (jagsaalt?.length > 0 || sonorduulga?.jagsaalt?.length > 0) &&
      realTimeNotifications.length > 0
    ) {
      const existingIds = new Set([
        ...(jagsaalt || []).map((n) => n._id),
        ...(sonorduulga?.jagsaalt || []).map((n) => n._id),
      ]);

      setRealTimeNotifications((prev) =>
        prev.filter((n) => !existingIds.has(n._id))
      );
    }
  }, [jagsaalt, sonorduulga?.jagsaalt]);

  const saveDontShowAgainToServer = useCallback(
    async (adminMedegdelId) => {
      if (!token || !adminMedegdelId) return { success: false };

      setServerSyncStatus(
        (prev) => new Map(prev.set(adminMedegdelId, "syncing"))
      );

      try {
        const response = await uilchilgee(token).post("/adminMedegdelZasakh", {
          adminMedegdelId,
          ajiltniiId: ajiltanId,
        });

        setServerSyncStatus(
          (prev) => new Map(prev.set(adminMedegdelId, "synced"))
        );

        setTimeout(() => {
          sonorduulgaMutate();
        }, 300);

        return {
          success: true,
          response: response.data,
        };
      } catch (error) {
        setServerSyncStatus(
          (prev) => new Map(prev.set(adminMedegdelId, "error"))
        );
        toast.error(t("Тохиргоо хадгалахад алдаа гарлаа"), {
          duration: 4000,
        });
        aldaaBarigch(error);
        return { success: false, error };
      }
    },
    [token, t, ajiltanId, sonorduulgaMutate]
  );

  const handleNotificationClose = useCallback(
    async (data, dontShowAgainChecked) => {
      if (!data) {
        setNotificationModal({
          visible: false,
          data: null,
          isMessageModal: false,
          messageDetails: null,
          messageTitle: null,
          messageDate: null,
        });
        return true;
      }

      if (notificationModal.isMessageModal) {
        setNotificationModal({
          visible: false,
          data: null,
          isMessageModal: false,
          messageDetails: null,
          messageTitle: null,
          messageDate: null,
        });
        return true;
      }

      const notifId = data._id || Date.now().toString();
      const adminMedegdelId = data.adminMedegdelId;

      let serverUpdateResult = { success: true };

      if (adminMedegdelId && dontShowAgainChecked) {
        serverUpdateResult = await saveDontShowAgainToServer(
          adminMedegdelId,
          true
        );

        if (serverUpdateResult.success) {
          const newDismissed = new Set(permanentlyDismissed);
          newDismissed.add(notifId);

          setPermanentlyDismissed(newDismissed);
          setRealTimeNotifications((prev) =>
            prev.filter((notif) => notif._id !== notifId)
          );

          toast.success(t("Тохиргоо хадгаллаа"), {
            duration: 3000,
          });
        } else return false;
      } else if (
        adminMedegdelId &&
        !dontShowAgainChecked &&
        permanentlyDismissed.has(notifId)
      ) {
        serverUpdateResult = await saveDontShowAgainToServer(
          adminMedegdelId,
          false
        );

        if (serverUpdateResult.success) {
          const newDismissed = new Set(permanentlyDismissed);
          newDismissed.delete(notifId);
          setPermanentlyDismissed(newDismissed);

          toast.success(t("Тохиргоо цуцаллаа"), {
            duration: 3000,
          });
        }
      }

      setSessionDismissedNotifications((prev) => new Set([...prev, notifId]));

      setNotificationModal({
        visible: false,
        data: null,
        isMessageModal: false,
        messageDetails: null,
        messageTitle: null,
        messageDate: null,
      });

      return serverUpdateResult.success;
    },
    [
      notificationModal.isMessageModal,
      permanentlyDismissed,
      saveDontShowAgainToServer,
      t,
    ]
  );

  const handleDontShowAgain = useCallback((notifId, dontShowAgain) => {
    if (notifId && dontShowAgain) {
      setSessionDismissedNotifications((prev) => new Set([...prev, notifId]));
      setPermanentlyDismissed((prev) => new Set([...prev, notifId]));
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
          messageDate: formatDate(createdAt),
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
    const latestNotifId =
      latestNotification.adminMedegdelId ||
      latestNotification._id ||
      "latest-notification";

    if (
      shouldShowNotification(latestNotification) &&
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
    shouldShowNotification,
  ]);

  const handleAdminNotification = useCallback(
    (data) => {
      const notifications = Array.isArray(data) ? data : [data];
      const validNotifications = notifications.filter((notif) => {
        const notifId = notif._id || notif.id || "default-notification";
        return (
          notif?.turul === "medegdelAdmin" &&
          shouldShowNotification(notif) &&
          !sessionDismissedNotifications.has(notifId) &&
          !permanentlyDismissed.has(notifId)
        );
      });

      if (validNotifications.length === 0) return;

      requestAnimationFrame(() => {
        setRealTimeNotifications((prev) => {
          const allExistingIds = new Set([
            ...prev.map((n) => n._id),
            ...(jagsaalt || []).map((n) => n._id),
            ...(sonorduulga?.jagsaalt || []).map((n) => n._id),
          ]);

          const newUnique = validNotifications
            .map((notif) => ({
              ...notif,
              object: { ...notif.object, zurag: undefined },
            }))
            .filter((n) => n._id && !allExistingIds.has(n._id));

          if (newUnique.length === 0) return prev;

          return [...newUnique, ...prev].slice(0, 50);
        });

        const latestNotification = validNotifications[0];
        const latestNotifId =
          latestNotification._id ||
          latestNotification.id ||
          "default-notification";

        const allExistingIds = new Set([
          ...(jagsaalt || []).map((n) => n._id),
          ...(sonorduulga?.jagsaalt || []).map((n) => n._id),
        ]);

        if (
          latestNotification._id &&
          !allExistingIds.has(latestNotifId) &&
          shouldShowNotification(latestNotification) &&
          !sessionDismissedNotifications.has(latestNotifId) &&
          !permanentlyDismissed.has(latestNotifId)
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
              createdAt: formatDate(latestNotification.createdAt),
              baiguullagaRegister:
                latestNotification.baiguullagaRegister ||
                latestNotification.baiguullagiinId ||
                "Тодорхойгүй",
              adminMedegdelId:
                latestNotification.adminMedegdelId || latestNotification._id,
            },
            isMessageModal: false,
            messageTitle: null,
            messageDetails: null,
            messageDate: null,
          });
        }

        setTimeout(() => {
          sonorduulgaMutate();
        }, 1000);
      });
    },
    [
      sessionDismissedNotifications,
      permanentlyDismissed,
      sonorduulgaMutate,
      jagsaalt,
      sonorduulga?.jagsaalt,
      formatDate,
      shouldShowNotification,
    ]
  );

  useEffect(() => {
    if (!enableRealTimeUpdates || !baiguullaga?._id) return;

    const eventName = `adminMedegdelilgeeyeSocket${baiguullaga._id}`;
    const socketInstance = socket();

    socketInstance.on(eventName, handleAdminNotification);

    return () => {
      socketInstance.off(eventName, handleAdminNotification);
    };
  }, [enableRealTimeUpdates, baiguullaga?._id, handleAdminNotification]);

  useEffect(() => {
    if (skipAutoShow || hasShownNotificationThisSession) return;

    const timer = setTimeout(() => {
      if (
        baiguullaga?._id &&
        (jagsaalt?.length > 0 || sonorduulga?.jagsaalt?.length > 0)
      ) {
        showLatestNotificationOnLogin();
        setHasShownNotificationThisSession(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    skipAutoShow,
    hasShownNotificationThisSession,
    baiguullaga?._id,
    jagsaalt,
    sonorduulga?.jagsaalt,
    showLatestNotificationOnLogin,
  ]);

  useEffect(() => {
    if (medegdelAdminCount <= 0) return;

    const interval = setInterval(() => {
      setAnimateMail(true);

      const timeout = setTimeout(() => {
        setAnimateMail(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }, 5000);

    return () => clearInterval(interval);
  }, [medegdelAdminCount]);

  return {
    allNotifications,
    medegdelAdminCount,
    notificationModal,
    permanentlyDismissed,
    animateMail,
    serverSyncStatus,

    setPermanentlyDismissed,

    handleNotificationClose,
    handleDontShowAgain,
    handleMessageClick,
    showLatestNotificationOnLogin,

    formatDate,
    saveDontShowAgainToServer,
  };
};

export default useAdminMedegdel;
