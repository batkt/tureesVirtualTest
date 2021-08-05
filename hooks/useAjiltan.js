import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcherJagsaalt = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  query = {}
) =>
  axios(token)
    .post(url, {
      query: {
        baiguullagiinId,
        erkh: { $nin: ["Admin"] },
        $or: [{ ner: { $regex: search, $options: "i" } }],
        ...query
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useAjiltniiJagsaalt(token, baiguullagiinId, query) {
  const [khuudaslalt, setAjiltniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/ajilchdiinJagsaaltAvya", token, baiguullagiinId, khuudaslalt, query]
      : null,
    fetcherJagsaalt,
    { revalidateOnFocus: false }
  );
  return {
    ajilchdiinGaralt: data,
    ajiltniiJagsaaltMutate: mutate,
    setAjiltniiKhuudaslalt,
  };
}

const fetcher = (url, token) =>
  axios(token)
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useAjiltan(token) {
  const { data, error, mutate } = useSWR(
    !!token ? [`/api/ajiltan/${token}`, token] : null,
    fetcher
  );

  return { ajiltan: data, error, isLoading: !data, ajiltanMutate: mutate };
}

export default useAjiltan