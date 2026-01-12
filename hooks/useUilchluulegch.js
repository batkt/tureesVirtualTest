import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import { openDB, STORES, searchCacheByPrefix } from "../utils/indexedDB";
import moment from "moment";

const searchGenerator = (search, fields) => {
  if (!!search && !!fields)
    return {
      $or: fields.map((key) => ({ [key]: { $regex: search, $options: "i" } })),
    };
  else return {};
};

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  barilgiinId,
  query = {},
  order,
  or
) => {
  const params = {
    ...khuudaslalt,
    query: {
      baiguullagiinId,
      barilgiinId,
      ...query,
    },
    order,
  };

  if (search && search.trim()) {
    if (or && Array.isArray(or) && or.length > 0) {
  
      params.query.$or = or;
    } else {
       
      const searchResult = searchGenerator(search, ["mashiniiDugaar"]);
      if (searchResult.$or) {
        params.query.$or = searchResult.$or;
      }
    }
  }

  return axios(token)
    .get(url, { params })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useUilchluulegch(
  token,
  baiguullagiinId,
  query,
  order,
  or,
  defaultKhuudaslalt
) {
  const { barilgiinId, isOfflineMode, isOnline } = useAuth();
  const [khuudaslalt, setUilchluulegchKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: defaultKhuudaslalt ? defaultKhuudaslalt : 100,
    search: "",
    jagsaalt: [],
  });

  const [currentArchiveName, setCurrentArchiveName] = useState(null);
  const [isMultiMonth, setIsMultiMonth] = useState(false);

  const queryWithArchive = useMemo(() => {
    try {
      if (!query) return query;

      const createdAt = query.createdAt;

      if (!createdAt || !createdAt.$gte || !createdAt.$lte) {
        const now = moment();
        const defaultQuery = {
          ...query,
          createdAt: {
            $gte: now.clone().startOf("month").toDate(),
            $lte: now.clone().endOf("month").toDate(),
          },
        };
        setCurrentArchiveName(null);
        setIsMultiMonth(false);
        return defaultQuery;
      }

      const start = moment(createdAt.$gte);
      const end = moment(createdAt.$lte);
      const now = moment();

      const isMultiMonthQuery =
        start.year() !== end.year() || start.month() !== end.month();

      if (isMultiMonthQuery) {
        setIsMultiMonth(true);
        setCurrentArchiveName("multi-month");
        return query;
      }

      setIsMultiMonth(false);

      if (!(start.year() === now.year() && start.month() === now.month())) {
        const y = start.year();
        const m = String(start.month() + 1).padStart(2, "0");
        const archiveName = `Uilchluulegch${y}${m}`;
        setCurrentArchiveName(archiveName);

        return { ...query, archiveName };
      }

      setCurrentArchiveName(null);
      return query;
    } catch (e) {
      console.error("aldaa:", e);
      setCurrentArchiveName(null);
      setIsMultiMonth(false);
      return query;
    }
  }, [query]);

  const shouldFetch =
    !!token && !!baiguullagiinId && isOnline && !isOfflineMode;

  const { data, mutate, isValidating } = useSWR(
    shouldFetch
      ? [
          "/zogsoolUilchluulegch",
          token,
          baiguullagiinId,
          khuudaslalt,
          barilgiinId,
          queryWithArchive,
          order,
          or,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const [offlineCacheData, setOfflineCacheData] = useState(null);
  const cacheKey = useMemo(() => {
    const base = "/zogsoolUilchluulegch";
    const org = baiguullagiinId || "";
    const bid = barilgiinId || "";
    const q = queryWithArchive ? JSON.stringify(queryWithArchive) : "";
    const o = order ? JSON.stringify(order) : "";
    return `${base}:${org}:${bid}:${q}:${o}`;
  }, [baiguullagiinId, barilgiinId, queryWithArchive, order]);
  const simpleCacheKey = useMemo(() => {
    const base = "/zogsoolUilchluulegch";
    const org = baiguullagiinId || "";
    const bid = barilgiinId || "";
    return `${base}:${org}:${bid}`;
  }, [baiguullagiinId, barilgiinId]);

 
  useEffect(() => {
    (async () => {
      try {
        if (data && Array.isArray(data?.jagsaalt)) {
          const db = await openDB();
          const wrapped = { value: data, savedAt: new Date().toISOString() };
         
          await db.put(STORES.CACHE, wrapped, cacheKey);
          await db.put(STORES.CACHE, wrapped, simpleCacheKey);
        }
      } catch (e) {}
    })();
  }, [data, cacheKey, simpleCacheKey]);

  
  useEffect(() => {
    (async () => {
      try {
        const isBrowser = typeof navigator !== "undefined";
        
        const isOffline = isOfflineMode || !isOnline;
        const shouldLoadCache = isBrowser && (isOffline || !data);

         

        if (shouldLoadCache) {
          const db = await openDB();
          // Try simple key first (more reliable for offline)
          let cached = await db.get(STORES.CACHE, simpleCacheKey);
           

          if (!cached?.value) {
            // Fallback to specific key
            cached = await db.get(STORES.CACHE, cacheKey);
             
          }

           
          if (!cached?.value) {
            
            const prefixResult = await searchCacheByPrefix(
              "/zogsoolUilchluulegch:"
            );
            if (prefixResult) {
              cached = { value: prefixResult };
               
            }
          }

          if (cached?.value) {
            
            setOfflineCacheData(cached.value);
          } else {
            setOfflineCacheData(null);
          }
        } else if (!isOffline && data) {
         
          setOfflineCacheData(null);
        }
      } catch (e) {
         
        setOfflineCacheData(null);
      }
    })();
  }, [data, cacheKey, simpleCacheKey, isOfflineMode, isOnline]);

  const effectiveData =
    isOfflineMode || !isOnline ? offlineCacheData || data : data;

  
  const updateOfflineItem = useCallback(
    async (itemId, updateFn) => {
 
      setOfflineCacheData((prevData) => {
        if (!prevData || !prevData.jagsaalt) return prevData;
        const newJagsaalt = prevData.jagsaalt.map((item) => {
          if (item._id === itemId) {
            return updateFn(item);
          }
          return item;
        });
        const newData = { ...prevData, jagsaalt: newJagsaalt };

      
        (async () => {
          try {
            const db = await openDB();
            const wrapped = {
              value: newData,
              savedAt: new Date().toISOString(),
            };
            await db.put(STORES.CACHE, wrapped, simpleCacheKey);
          } catch (e) {
            console.error("[updateOfflineItem] Cache update error:", e);
          }
        })();

        return newData;
      });
    },
    [simpleCacheKey]
  );

 
  const removeOfflineItem = useCallback(
    async (itemId) => {
      setOfflineCacheData((prevData) => {
        if (!prevData || !prevData.jagsaalt) return prevData;
        const newJagsaalt = prevData.jagsaalt.filter(
          (item) => item._id !== itemId
        );
        const newData = {
          ...prevData,
          jagsaalt: newJagsaalt,
          niitMur: (prevData.niitMur || newJagsaalt.length) - 1,
        };

       
        (async () => {
          try {
            const db = await openDB();
            const wrapped = {
              value: newData,
              savedAt: new Date().toISOString(),
            };
            await db.put(STORES.CACHE, wrapped, simpleCacheKey);
          } catch (e) {
            console.error("[removeOfflineItem] Cache update error:", e);
          }
        })();

        return newData;
      });
    },
    [simpleCacheKey]
  );

  return {
    setUilchluulegchKhuudaslalt,
    uilchluulegchGaralt: effectiveData,
    uilchluulegchMutate: mutate,
    isValidating,
    archiveName: effectiveData?.archiveName || currentArchiveName,
    isMultiMonth: effectiveData?.archiveName === "multi-month" || isMultiMonth,
    collections: effectiveData?.collections || [],
    updateOfflineItem,
    removeOfflineItem,
    offlineCacheData,
    setOfflineCacheData,
  };
}

const fetcherToololt = (url, token, barilgiinId, query) => {
  if (!!barilgiinId)
    return axios(token)
      .post(url, { barilgiinId, ...query })
      .then((res) => res.data)
      .catch(aldaaBarigch);
};

const fetcherDun = (url, token, query) => {
  return axios(token)
    .post(url, { ...query })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

export function useUilchluulegchToololt(token, query) {
  const { barilgiinId } = useAuth();
  const { data, mutate } = useSWR(
    !!token
      ? ["/zogsoolUilchluulegchdiinToo", token, barilgiinId, query]
      : null,
    fetcherToololt,
    { revalidateOnFocus: false }
  );
  return { uilchiluulegchToololt: data, uilchiluulegchToololtMutate: mutate };
}

export function useUilchluulegchZogsoolToo(token, query) {
  const { barilgiinId } = useAuth();
  const { data, mutate } = useSWR(
    !!token
      ? ["/zogsoolTusBurUilchluulegchdiinToo", token, barilgiinId, query]
      : null,
    fetcherToololt,
    { revalidateOnFocus: false }
  );
  return { zogsoolTusBuriinToo: data, zogsoolTusBuriinTooMutate: mutate };
}


export default useUilchluulegch;
