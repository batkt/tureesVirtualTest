import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, query, order, khuudaslalt) => {
  return axios(token)
    .get(url, {
      params: {
        query,
        order,
        ...khuudaslalt,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch(aldaaBarigch);
};

export function mailtuukh(token, query, order, defaultKhuudaslalt) {
  const [khuudaslalt, setmailtuukh] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: defaultKhuudaslalt || 1000,
    search: "",
    jagsaalt: [],
  });

  const { data, mutate } = useSWR(
    !!token ? ["/maililgeesenKhariu", token, query, order, khuudaslalt] : null,
    fetcher,
    { revalidateOnFocus: false }
  );

    return {
    setmailtuukh,
    mailtuukhmailtuukhJagsaalt: data?.jagsaalt || [],
    nmailtuukhJagsaaltMutate: mutate,
    };
}
