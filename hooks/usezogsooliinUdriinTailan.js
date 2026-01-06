import { useState, useMemo } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";

const fetcher = (
  url,
  token,
  barilgiinId,
  duusakhOgnoo,
  ekhlekhOgnoo,
  garsanKhaalga,
  baiguullagiinId,
  query
) => {
  return axios(token)
    .post(url, {
      barilgiinId,
      ekhlekhOgnoo: moment(ekhlekhOgnoo).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(duusakhOgnoo).format("YYYY-MM-DD 23:59:59"),
      garsanKhaalga: garsanKhaalga,
      baiguullagiinId,
      ...query,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function usezogsooliinUdriinTailan(
  token,
  barilgiinId,
  duusakhOgnoo,
  ekhlekhOgnoo,
  garsanKhaalga,
  baiguullagiinId,
  query
) {
  const [currentArchiveName, setCurrentArchiveName] = useState(null);
  const [isMultiMonth, setIsMultiMonth] = useState(false);

  const archiveInfo = useMemo(() => {
    try {
      if (!ekhlekhOgnoo || !duusakhOgnoo) {
        setCurrentArchiveName(null);
        setIsMultiMonth(false);
        return { archiveName: null, isMultiMonth: false };
      }

      const start = moment(ekhlekhOgnoo);
      const end = moment(duusakhOgnoo);
      const now = moment();

      const isMultiMonthQuery =
        start.year() !== end.year() || start.month() !== end.month();

      if (isMultiMonthQuery) {
        setIsMultiMonth(true);
        setCurrentArchiveName("multi-month");
        return { archiveName: "multi-month", isMultiMonth: true };
      }

      setIsMultiMonth(false);

      const isCurrentMonth =
        start.year() === now.year() && start.month() === now.month();

      if (!isCurrentMonth) {
        const y = start.year();
        const m = String(start.month() + 1).padStart(2, "0");
        const archiveName = `Uilchluulegch${y}${m}`;
        setCurrentArchiveName(archiveName);
        return { archiveName, isMultiMonth: false };
      }

      setCurrentArchiveName(null);
      return { archiveName: null, isMultiMonth: false };
    } catch (e) {
      console.error("Archive calculation error:", e);
      setCurrentArchiveName(null);
      setIsMultiMonth(false);
      return { archiveName: null, isMultiMonth: false };
    }
  }, [ekhlekhOgnoo, duusakhOgnoo]);

  const queryWithArchive = useMemo(() => {
    if (archiveInfo.archiveName) {
      return { ...query, archiveName: archiveInfo.archiveName };
    }
    return query;
  }, [query, archiveInfo.archiveName]);

  const { data, mutate, isValidating } = useSWR(
    !!token
      ? [
          "/zogsooliinUdriinTailanAvya",
          token,
          barilgiinId,
          duusakhOgnoo,
          ekhlekhOgnoo,
          garsanKhaalga,
          baiguullagiinId,
          queryWithArchive,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    zogsoolTulburMedeelel: data?.data || data || [],
    zogsoolTulburMedeelelMutate: mutate,
    zogsooliinUdriinTailanUnshijBaina: isValidating,
    archiveName: data?.archiveName || currentArchiveName,
    isMultiMonth: data?.archiveName === "multi-month" || isMultiMonth,
    collections: data?.collections || [],
  };
}

export default usezogsooliinUdriinTailan;
