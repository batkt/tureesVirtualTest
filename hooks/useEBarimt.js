import { useState, useMemo } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";
import { useAuth } from "services/auth";

function searchGenerator(keys, search) {
  if (keys.length > 0)
    return keys.map((key) => ({ [key]: { $regex: search, $options: "i" } }));
  return undefined;
}

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
          $or: searchGenerator(searchKeys, search),
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
  const queryWithArchive = useMemo(() => {
    try {
      if (!query) return query;
      const createdAt = query.createdAt;
      if (!createdAt || !createdAt.$gte || !createdAt.$lte) return query;
      const start = moment(createdAt.$gte);
      const end = moment(createdAt.$lte);
      const now = moment();

      if (
        start.year() === end.year() &&
        start.month() === end.month() &&
        !(start.year() === now.year() && start.month() === now.month())
      ) {
        const y = start.year();
        const m = String(start.month() + 1).padStart(2, "0");
        const archiveName = `ebarimtShine${y}${m}`;
        console.log("Archive data:", {
          archiveName,
          year: y,
          month: m,
          startDate: start.format("YYYY-MM-DD"),
          endDate: end.format("YYYY-MM-DD"),
          query: { ...query, archiveName },
        });
        return { ...query, archiveName };
      }
      return query;
    } catch (e) {
      console.error("aldaa:", e);
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
