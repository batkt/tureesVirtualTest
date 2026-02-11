import { useEffect, useMemo, useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";
import { openDB, STORES } from "../utils/indexedDB";

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
  var defaultOr = [];
  if (!!or && Array.isArray(or) && or.length > 0) {
    or.forEach((element) => {
      defaultOr.push(element);
    });
  }

  const queryParams = {
    baiguullagiinId,
    barilgiinId,
    ...query,
  };

  if (search && search.trim() !== "") {
    queryParams.mashiniiDugaar = { $regex: search, $options: "i" };
  }

  if (defaultOr.length > 0) {
    queryParams.$or = defaultOr;
  }

  return axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: queryParams,
        order,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useUilchluulegchZogsool(
  token,
  baiguullagiinId,
  query,
  order,
  or,
  defaultKhuudaslalt
) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setUilchluulegchKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: defaultKhuudaslalt ? defaultKhuudaslalt : 100,
    search: "",
    jagsaalt: [],
  });
  const [offlineCacheData, setOfflineCacheData] = useState(null);
  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId
      ? [
        "/zogsoolUilchluulegchJagsaalt",
        token,
        baiguullagiinId,
        khuudaslalt,
        barilgiinId,
        query,
        order,
        or,
      ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );


  const cacheKey = useMemo(() => {
    const base = "/zogsoolUilchluulegchJagsaalt";
    const org = baiguullagiinId || "";
    const bid = barilgiinId || "";
    const q = query ? JSON.stringify(query) : "";
    const o = order ? JSON.stringify(order) : "";
    const k = khuudaslalt ? JSON.stringify(khuudaslalt) : "";
    return `${base}:${org}:${bid}:${q}:${o}:${k}`;
  }, [baiguullagiinId, barilgiinId, query, order, khuudaslalt]);


  useEffect(() => {
    (async () => {
      try {
        if (data && Array.isArray(data?.jagsaalt)) {
          const db = await openDB();
          await db.put(
            STORES.CACHE,
            { value: data, savedAt: new Date().toISOString() },
            cacheKey
          );
        }
      } catch (e) {

      }
    })();
  }, [data, cacheKey]);
  const effectiveData = offlineCacheData || data;
  return {
    setUilchluulegchKhuudaslalt,
    uilchluulegchGaralt: effectiveData,
    uilchluulegchMutate: mutate,
    isValidating,
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
export function useUilchluulegchdiinDunAvay(token, query) {
  const { data, mutate } = useSWR(
    !!token ? ["/zogsoolUilchluulegchdiinDunAvay", token, query] : null,
    fetcherDun,
    { revalidateOnFocus: false }
  );
  return { uilchluulegchdiinDun: data, uilchluulegchdiinDunMutate: mutate };
}

export default useUilchluulegchZogsool;
