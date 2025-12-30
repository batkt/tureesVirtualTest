import { useState, useMemo } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";
import { useAuth } from "services/auth";

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
  { search, jagsaalt, ...khuudaslalt },
  query,
  baiguullagiinId,
  barilgiinId,
  order,
  searchKeys = []
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          baiguullagiinId,
          barilgiinId,
          ...query,
          ...searchGenerator(search, searchKeys),
        },
        order,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

const fetcherToololt = (url, token, query) =>
  axios(token)
    .post(url, query)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useEBarimt(token, baiguullagiinId, query, order, searchKeys) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setEBarimtKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 500,
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
        const archiveName = `ebarimtShine${y}${m}`;
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
          "/ebarimtJagsaaltAvya",
          token,
          khuudaslalt,
          queryWithArchive,
          baiguullagiinId,
          barilgiinId,
          order,
          searchKeys,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    setEBarimtKhuudaslalt,
    eBarimtGaralt: data,
    eBarimtMutate: mutate,
    isValidating,
    archiveName: data?.archiveName || currentArchiveName,
    isMultiMonth: data?.archiveName === "multi-month" || isMultiMonth,
    collections: data?.collections || [],
  };
}

export function useBarimtToollolt(token, query) {
  const { data, mutate } = useSWR(
    token ? ["/ebarimtToololtAvya", token, query] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    ebarimtiinToololt: data,
    ebarimtiinToololtMutate: mutate,
  };
}

export default useEBarimt;
