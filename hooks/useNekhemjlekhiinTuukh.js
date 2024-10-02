import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  query,
  order,
  { ...khuudaslalt },
) => {
  return axios(token)
    .get(url, {
      params: {
        query,
        order,
        ...khuudaslalt
      },
    })
    .then((res) => { return res.data})
    .catch(aldaaBarigch);
}

export function useNekhemjlekhiinTuukh(token, query, order, defaultKhuudaslalt) {
  const [khuudaslalt, setNekhemjlekhiinTuukhKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: defaultKhuudaslalt ? defaultKhuudaslalt : 1000,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token ? ["/nekhemjlekhiinTuukh", token, query, order, khuudaslalt]
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

