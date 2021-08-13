import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token) =>
  axios(token)
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useGereeniiJagsaalt(token) {
  const { data, mutate } = useSWR(token ? ["/geree", token] : null, fetcher, {
    revalidateOnFocus: false,
  });
  return { gereeniiMedeelel: data };
}

export default useGereeniiJagsaalt;
