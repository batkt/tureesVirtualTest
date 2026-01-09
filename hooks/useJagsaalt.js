import useSWR from "swr";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useAuth } from "services/auth";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { getCache, setCache, searchCacheByPrefix } from "../utils/indexedDB";

const searchGenerator = (search, fields) => {
  if (!!search && !!fields)
    return {
      $or: fields.map((key) => ({ [key]: { $regex: search, $options: "i" } })),
    };
  else return {};
};

function fetcher(
  token,
  url,
  query,
  order,
  select,
  { search = "", jagsaalt, ...khuudaslalt },
  searchKeys = []
) {
  return uilchilgee(token)
    .get(url, {
      params: {
        query: {
          ...query,
          ...searchGenerator(search, searchKeys),
        },
        order,
        select,
        ...khuudaslalt,
      },
    })
    .then((a) => a.data)
    .catch(aldaaBarigch);
}

var timeout = null;

function useJagsaalt(
  url,
  query,
  order,
  select,
  searchKeys,
  supToken,
  khuudasniiKhemjee
) {
  const { token, isOfflineMode, isOnline } = useAuth();

  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee:
      !!khuudasniiKhemjee && khuudasniiKhemjee > 0 ? khuudasniiKhemjee : 100,
    search: "",
    jagsaalt: [],
  });

  const cacheKey = useMemo(() => {
    try {
      const base = {
        url,
        query,
        order,
        select,
        searchKeys,

        page: khuudaslalt?.khuudasniiDugaar,
        pageSize: khuudaslalt?.khuudasniiKhemjee,
        search: khuudaslalt?.search,
      };
      return `cache:jagsaalt:${url}|${JSON.stringify(base)}`;
    } catch (e) {
      return `cache:jagsaalt:${url}`;
    }
  }, [
    url,
    query,
    order,
    select,
    searchKeys,
    khuudaslalt?.khuudasniiDugaar,
    khuudaslalt?.khuudasniiKhemjee,
    khuudaslalt?.search,
  ]);

  const orgId = query?.baiguullagiinId;
  const barilgaId = query?.barilgiinId;

  const primaryCacheKey = useMemo(() => {
    return `${url}:${orgId || "none"}:${barilgaId || "none"}`;
  }, [url, orgId, barilgaId]);

  const simpleCacheKeyBoth = useMemo(() => {
    try {
      const base = {
        url,
        query: { baiguullagiinId: orgId, barilgiinId: barilgaId },
        page: 1,
        pageSize: khuudaslalt?.khuudasniiKhemjee,
        search: "",
      };
      return `cache:jagsaalt:${url}|${JSON.stringify(base)}`;
    } catch (e) {
      return `cache:jagsaalt:${url}|simple`;
    }
  }, [url, orgId, barilgaId, khuudaslalt?.khuudasniiKhemjee]);

  const simpleCacheKeyBarilgaOnly = useMemo(() => {
    try {
      const base = {
        url,
        query: { barilgiinId: barilgaId },
        page: 1,
        pageSize: khuudaslalt?.khuudasniiKhemjee,
        search: "",
      };
      return `cache:jagsaalt:${url}|${JSON.stringify(base)}`;
    } catch (e) {
      return `cache:jagsaalt:${url}|simple-b`;
    }
  }, [url, barilgaId, khuudaslalt?.khuudasniiKhemjee]);

  const [offlineCache, setOfflineCache] = useState([]);

  const [navOnline, setNavOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentOnline = navigator.onLine;
    if (currentOnline !== navOnline) {
      setNavOnline(currentOnline);
    }

    const handleOnline = () => setNavOnline(true);
    const handleOffline = () => setNavOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const shouldFetch = (token || supToken) && url && navOnline && !isOfflineMode;

  const { data, mutate, isValidating } = useSWR(
    shouldFetch
      ? [token || supToken, url, query, order, select, khuudaslalt, searchKeys]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    (async () => {
      if (data && Array.isArray(data?.jagsaalt) && data.jagsaalt.length > 0) {
        try {
          await setCache(primaryCacheKey, data.jagsaalt);
          await setCache(cacheKey, data.jagsaalt);

          if (orgId && barilgaId) {
            await setCache(simpleCacheKeyBoth, data.jagsaalt);
          }
          if (barilgaId) {
            await setCache(simpleCacheKeyBarilgaOnly, data.jagsaalt);
          }
        } catch (e) {}
      }
    })();
  }, [
    data,
    cacheKey,
    primaryCacheKey,
    simpleCacheKeyBoth,
    simpleCacheKeyBarilgaOnly,
    orgId,
    barilgaId,
    url,
  ]);

  useEffect(() => {
    (async () => {
      if (!shouldFetch || !data) {
        let cached = await getCache(primaryCacheKey);

        if (!Array.isArray(cached) || cached.length === 0) {
          cached = await getCache(cacheKey);
        }

        if (!Array.isArray(cached) || cached.length === 0) {
          const c2 = await getCache(simpleCacheKeyBoth);

          if (Array.isArray(c2) && c2.length > 0) {
            cached = c2;
          } else {
            const c3 = await getCache(simpleCacheKeyBarilgaOnly);

            if (Array.isArray(c3) && c3.length > 0) {
              cached = c3;
            }
          }
        }

        if ((!Array.isArray(cached) || cached.length === 0) && url) {
          const prefixResult = await searchCacheByPrefix(`${url}:`);
          if (Array.isArray(prefixResult) && prefixResult.length > 0) {
            cached = prefixResult;
          } else if (
            prefixResult?.jagsaalt &&
            Array.isArray(prefixResult.jagsaalt)
          ) {
            cached = prefixResult.jagsaalt;
          }
        }

        setOfflineCache(Array.isArray(cached) ? cached : []);
      } else {
        setOfflineCache([]);
      }
    })();
  }, [
    shouldFetch,
    data,
    cacheKey,
    primaryCacheKey,
    simpleCacheKeyBoth,
    simpleCacheKeyBarilgaOnly,
    navOnline,
    isOfflineMode,
    url,
  ]);

  function next() {
    if (!!data)
      if (khuudaslalt?.khuudasniiDugaar < data?.niitKhuudas) {
        setKhuudaslalt((a) => {
          a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
          a.khuudasniiDugaar += 1;
          return { ...a };
        });
      }
  }

  function refresh() {
    setKhuudaslalt((a) => {
      a.jagsaalt = [];
      a.khuudasniiDugaar = 1;
      return { ...a };
    });
    mutate();
  }

  function onSearch(search) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      setKhuudaslalt((a) => {
        a.search = search;
        a.jagsaalt = [];
        a.khuudasniiDugaar = 1;
        return {
          ...a,
        };
      });
    }, 300);
  }

  const jagsaalt = useMemo(() => {
    const serverList = data?.jagsaalt || [];
    const baseList = khuudaslalt?.jagsaalt || [];

    // When offline, prioritize offline cache
    if (!shouldFetch && offlineCache.length > 0) {
      return offlineCache;
    }

    if (serverList.length > 0) {
      return [...baseList, ...serverList];
    }
    if (offlineCache.length > 0) {
      return offlineCache;
    }
    return baseList;
  }, [khuudaslalt, data, offlineCache, shouldFetch]);

  return {
    data,
    mutate,
    jagsaalt,
    next,
    refresh,
    onSearch,
    isValidating,
    setKhuudaslalt,
    khuudaslalt,
  };
}

export default useJagsaalt;
