import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  query,
) => {
  return axios(token)
    .get(url, {
      params: {
        query,
      },
    })
    .then((res) => { return res.data})
    .catch(aldaaBarigch);
}

export function useNekhemjlekhiinTuukh(token, query, defaultKhuudaslalt) {
  const [khuudaslalt, setNekhemjlekhiinTuukhKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: defaultKhuudaslalt ? defaultKhuudaslalt : 100,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token ? ["/nekhemjlekhiinTuukh", token, query, khuudaslalt]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setNekhemjlekhiinTuukhKhuudaslalt,
    nekhemjlekhiinTuukhJagsaalt: data,
    nekhemjlekhiinTuukhJagsaaltMutate: mutate,
  };
}

