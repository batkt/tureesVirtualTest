import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, barilgiinId) => {
  return axios(token)
    .post(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useKhuudasniiJagsaalt(token) {
  const { data, mutate } = useSWR(
    !!token ? ["/erkhiinMedeelelAvya", token] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    khuudasniiJagsaalt: data,
    eBarimtKhuudasniiJagsaaltMutate: mutate,
  };
}

export default useKhuudasniiJagsaalt;
