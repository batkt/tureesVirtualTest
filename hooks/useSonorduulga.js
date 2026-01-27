import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "services/auth";

const filterDismissedNotifications = (notifications, keepDismissed = false) => {
  if (keepDismissed) {
    return notifications;
  }
  return notifications.filter(
    (notification) => !notification.dakhijKharikhEsekh
  );
};

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
                    $in: ["daalgavar", "setgegdel"],
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

  // useEffect(() => {
  //   if (ajiltan?._id) {
  //     socket().on(`ajiltan${ajiltan?._id}`, (res) => {
  //       if (res.type === "logout" && res?.ip) {
  //         toast.warn(
  //           "" +
  //             res.ip +
  //             " IP-тай төхөөрөмжөөс давхар нэвтэрсэн тул таны холболт саллаа.",
  //           5
  //         );
  //         setTimeout(() => {
  //           window.location.href = "/";
  //         }, 4000);
  //       }
  //     });
  //   }
  //   return () => {
  //     socket().off(`ajiltan${ajiltan?._id}`);
  //   };
  // }, [ajiltan]);

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
