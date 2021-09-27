import { useState } from "react";
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
  { search, jagsaalt, ...khuudaslalt }
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          baiguullagiinId,
          $or: getSearch(search),
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useTalbai(token, baiguullagiinId) {
  const [khuudaslalt, setTalbaiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/talbai", token, baiguullagiinId, khuudaslalt]
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
