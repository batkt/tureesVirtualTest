import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcherJagsaalt = (
  url,
  token,
  baiguullagiinId,
  { search = "", ...khuudaslalt },
  query,
  barilgiinId,
  select
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          baiguullagiinId,
          barilguud: barilgiinId,
          erkh: { $nin: ["Admin"] },
          $or: [
            { ner: { $regex: search, $options: "i" } },
            { register: { $regex: search, $options: "i" } },
            { utas: { $regex: search, $options: "i" } },
          ],
          ...query,
        },
        select,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useAjiltniiJagsaalt(token, baiguullagiinId, barilgiinId, query) {
  const [khuudaslalt, setAjiltniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
  });
  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/ajiltan", token, baiguullagiinId, khuudaslalt, query, barilgiinId]
      : null,
    fetcherJagsaalt,
    { revalidateOnFocus: false }
  );
  return {
    ajilchdiinGaralt: data,
    ajiltniiJagsaaltMutate: mutate,
    setAjiltniiKhuudaslalt,
    isValidating,
  };
}

const fetcher = (url, token) =>
  axios(token)
    .post(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useAjiltan(token) {
  const { data, error, mutate } = useSWR(
    !!token ? [`/tokenoorAjiltanAvya`, token] : null,
    fetcher
  );

  return { ajiltan: data, error, isLoading: !data, ajiltanMutate: mutate };
}

export default useAjiltan;
