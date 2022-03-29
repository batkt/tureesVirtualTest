import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

function getSearch(search) {
  var fallback = [
    { kod: { $regex: search, $options: "i" } },
    { tailbar: { $regex: search, $options: "i" } },
  ];
  if (/^\d+$/.test(search)) {
    fallback.push({ talbainKhemjee: search });
  }
  return fallback;
}

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  barilgiinId,
  query,
  order
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          baiguullagiinId,
          barilgiinId,
          $or: getSearch(search),
          ...query,
        },
        ...khuudaslalt,
        order,
        collation: { locale: "mn", numericOrdering: true },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useTalbai(token, baiguullagiinId, query, order) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setTalbaiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 1000,
    search: "",
    jagsaalt: [],
  });

  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          "/talbai",
          token,
          baiguullagiinId,
          khuudaslalt,
          barilgiinId,
          query,
          order,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setTalbaiKhuudaslalt,
    talbainiiGaralt: data,
    talbainiiJagsaaltMutate: mutate,
  };
}

export default useTalbai;
