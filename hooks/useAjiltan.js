import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcherJagsaalt = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  query = {},
  barilgiinId
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
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useAjiltniiJagsaalt(token, baiguullagiinId, query) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setAjiltniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    search: "",
    jagsaalt: [],
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
