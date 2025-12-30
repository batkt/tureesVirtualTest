import { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";

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
    const defaultOr = or || [
      { mashiniiDugaar: { $regex: search, $options: "i" } },
    ];
    params.query.$or = defaultOr;
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
  const { barilgiinId } = useAuth();
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

  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId
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

  return {
    setUilchluulegchKhuudaslalt,
    uilchluulegchGaralt: data,
    uilchluulegchMutate: mutate,
    isValidating,
    archiveName: data?.archiveName || currentArchiveName,
    isMultiMonth: data?.archiveName === "multi-month" || isMultiMonth,
    collections: data?.collections || [],
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

export default useUilchluulegch;
