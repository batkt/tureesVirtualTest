import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";
import _ from "lodash";
import { useAuth } from "services/auth";
function getSearch(search, bank) {
  if (!search || !search.trim()) return null;
  const or = [
    {
      [bank === "tdb"
        ? "TxAddInf"
        : bank === "golomt"
        ? "tranDesc"
        : "description"]: { $regex: search, $options: "i" },
    },
    {
      kholbosonTalbainId: { $regex: search, $options: "i" },
    },
    {
      [bank === "tdb"
        ? "CtAcntOrg"
        : bank === "golomt"
        ? "accNum"
        : "relatedAccount"]: { $regex: search, $options: "i" },
    },
  ];
  if (/^\d+$/.test(search)) {
    or.push({
      [bank === "tdb" ? "Amt" : "amount"]: Number(search),
    });
  }
  return or;
}

const searchFilter = getSearch(search, dans?.bank);

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  dans,
  ognoo,
  order = {},
  query,
  barilgiinId
) => 
  axios(token)
    .get(url, {
      params: {
        order: order,
        query: {
          dansniiDugaar: dans?.dugaar,
          barilgiinId,
          baiguullagiinId,
          [`${
            dans?.bank === "tdb"
              ? "Amt"
              : dans?.bank === "golomt"
              ? "tranAmount"
              : "amount"
          }`]: { $gt: 0 },
          [`${dans?.bank === "tdb" ? "TxDt" : "tranDate"}`]: {
            $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
          },
          ...(searchFilter ? { $or: searchFilter } : {}),
          ...query,
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useDansKhuulga(token, baiguullagiinId, dans, ognoo, order, query) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setDansniiKhuulgaKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
  });
  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId && !!dans && !!ognoo
      ? [
          "/bankniiGuilgee",
          token,
          baiguullagiinId,
          khuudaslalt,
          dans,
          ognoo,
          order,
          query,
          barilgiinId,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaGaralt: data,
    dansniiKhuulgaMutate: mutate,
    isValidating,
  };
}

export default useDansKhuulga;
