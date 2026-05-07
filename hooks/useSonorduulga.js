import axios, { aldaaBarigch, socket } from "services/uilchilgee";
import useSWR from "swr";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "services/auth";
import { notification } from "antd";
import { useRouter } from "next/router";

const filterDismissedNotifications = (notifications, keepDismissed = false) => {
  if (keepDismissed) {
    return notifications;
  }
  return notifications.filter(
    (notification) => !notification.dakhijKharikhEsekh
  );
};

const globalSeenIds = new Set();

const fetcher = (
  url,
  token,
  baiguullagiinId,
  barilgiinId,
  ajiltniiId,
  { jagsaalt, ...khuudaslalt }
) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: {
          baiguullagiinId,
          barilgiinId,
          $or: [
            { baiguullagiinId, barilgiinId },
            {
              $and: [
                {
                  khuleenAvagchiinId: ajiltniiId,
                },
                {
                  turul: {
                    $in: ["daalgavar", "setgegdel", "sanal", "gomdol", "shaardlaga", "sanalKhuselt"],
                  },
                },
              ],
            },
          ],
        },
        order: { createdAt: -1 },
      },
    })
    .then((res) => {
      const filtered = {
        ...res.data,
      };
      return filtered;
    })
    .catch(aldaaBarigch);

const tooFetcher = (
  url,
  token,
  baiguullagiinId,
  barilgiinId,
  ajiltniiId,
  { jagsaalt, ...khuudaslalt }
) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: {
          baiguullagiinId,
          barilgiinId,
          kharsanEsekh: { $ne: true },
          ajiltniiId: {
            $ne: "nevtersenAjiltniiId",
          },
          khariltsagchiinId: { $exists: false },
          turul: { $nin: ["medegdelAdmin", "medegdelAdminAppWeb"] },
        },
        order: { createdAt: -1 },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

const paginationFetcher = (
  url,
  token,
  baiguullagiinId,
  barilgiinId,
  ajiltniiId,
  page = 1,
  pageSize = 20
) =>
  axios(token)
    .get(url, {
      params: {
        khuudasniiDugaar: page,
        khuudasniiKhemjee: pageSize,
        query: {
          baiguullagiinId,
          barilgiinId,
          $or: [
            { baiguullagiinId, barilgiinId },
            {
              $and: [
                {
                  khuleenAvagchiinId: ajiltniiId,
                },
              ],
            },
          ],
          turul: { $nin: ["medegdelAdmin", "medegdelAdminAppWeb"] },
        },
        order: { createdAt: -1 },
      },
    })
    .then((res) => {
      return {
        ...res.data,
      };
    })
    .catch(aldaaBarigch);

function useSonorduulga(token) {
  const router = useRouter();
  const { baiguullaga, barilgiinId, ajiltan } = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    jagsaalt: [],
  });

  const [allNotifications, setAllNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { data, mutate } = useSWR(
    !!token && !!baiguullaga?._id
      ? [
          "/sonorduulga",
          token,
          baiguullaga?._id,
          barilgiinId,
          ajiltan?._id,
          khuudaslalt,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const too = useSWR(
    !!token && !!baiguullaga?._id
      ? [
          "/sonorduulga/tooAvya",
          token,
          baiguullaga?._id,
          barilgiinId,
          ajiltan?._id,
          khuudaslalt,
        ]
      : null,
    tooFetcher,
    { revalidateOnFocus: false }
  );

  const fetchNotifications = useCallback(
    async (page = 1, append = false, pageSize = 20) => {
      if (!token || !baiguullaga?._id) {
        return;
      }

      if (page > 1) {
        setIsLoadingMore(true);
      }

      try {
        const response = await paginationFetcher(
          "/sonorduulga",
          token,
          baiguullaga._id,
          barilgiinId,
          ajiltan?._id,
          page,
          pageSize
        );

        const newNotifications = response?.jagsaalt || [];

        if (append && page > 1) {
          setAllNotifications((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const uniqueNew = newNotifications.filter(
              (item) => !existingIds.has(item._id)
            );
            return [...prev, ...uniqueNew];
          });
        } else {
          setAllNotifications(newNotifications);
        }

        setCurrentPage(page);

        if (newNotifications.length < pageSize) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        aldaaBarigch(error);
      } finally {
        setIsLoadingMore(false);
        setIsInitialLoading(false);
      }
    },
    [token, baiguullaga?._id, barilgiinId, ajiltan?._id]
  );

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchNotifications(currentPage + 1, true);
    } else {
    }
  }, [currentPage, isLoadingMore, hasMore, fetchNotifications]);

  useEffect(() => {
    if (token && baiguullaga?._id) {
      fetchNotifications(1, false);
    }
  }, [token, baiguullaga?._id, fetchNotifications]);


  useEffect(() => {
    if (ajiltan?._id && baiguullaga?._id) {
      const eventName = `khariltsagch${ajiltan._id}`;
      const appWebEventName = `appWebDuudlaga${baiguullaga._id}`;
      const socketInstance = socket();

      const handleNotification = (notif) => {
        if (notif && notif._id) {
          if (globalSeenIds.has(notif._id)) return;
          globalSeenIds.add(notif._id);
          // Keep the set size manageable
          if (globalSeenIds.size > 50) {
            const firstEntry = globalSeenIds.values().next().value;
            globalSeenIds.delete(firstEntry);
          }

          const isDuudlaga = notif.turul === "duudlaga";
          if (isDuudlaga) {
            let msg = "Шинэ дуудлага";
            let desc = "Шинэ дуудлага ирлээ";
            let href = "/khyanalt/medegdel/duudlaga";

            if (notif.duudlagiinTurul === "sanal") {
              msg = "Шинэ санал хүсэлт";
              desc = "Шинэ санал хүсэлт ирлээ";
              href = "/khyanalt/medegdel/sanalKhuselt";
            } else if (notif.duudlagiinTurul === "gomdol") {
              msg = "Шинэ гомдол";
              desc = "Шинэ гомдол ирлээ";
              href = "/khyanalt/medegdel/sanalKhuselt";
            } else if (notif.duudlagiinTurul === "shaardlaga") {
              msg = "Шинэ шаардлага";
              desc = "Шинэ шаардлага ирлээ";
              href = "/khyanalt/medegdel/shaardlaga";
            }

            notification.success({
              message: msg,
              description: desc,
              duration: 10,
              onClick: () => {
                router.push(href);
              },
            });
          } else {
            let href = "/khyanalt/medegdel";
            if (notif.turul === "shaardlaga") {
              href = "/khyanalt/medegdel/shaardlaga";
            } else if (notif.turul === "sanal" || notif.turul === "gomdol") {
              href = "/khyanalt/medegdel/sanalKhuselt";
            }

            notification.success({
              message: notif.title || "Шинэ мэдэгдэл",
              description: notif.message || "Шинэ мэдэгдэл ирлээ",
              duration: 7,
              onClick: () => {
                router.push(href);
              },
            });
          }

    
          mutate();
          too.mutate();
          fetchNotifications(1, false);
        }
      };

      socketInstance.on(eventName, handleNotification);
      socketInstance.on(appWebEventName, handleNotification);

      return () => {
        socketInstance.off(eventName, handleNotification);
        socketInstance.off(appWebEventName, handleNotification);
      };
    }
  }, [ajiltan?._id, baiguullaga?._id, mutate, too, fetchNotifications]);

  return {
    setKhuudaslalt,
    sonorduulga: data,
    kharaaguiToo: too?.data?.niitMur,
    sonorduulgaMutate: mutate,
    jagsaalt: data?.jagsaalt || [],
    tooMutate: too.mutate,
    allNotifications,
    currentPage,
    isLoadingMore,
    hasMore,
    isInitialLoading,
    loadMore,
    fetchNotifications,
  };
}

export default useSonorduulga;
