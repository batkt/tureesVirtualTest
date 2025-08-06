import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import { useState } from "react";

const baiguullagaIdgaarAvya = (url, token) =>
  axios(token)
    .post(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

export default function useBaiguullagaIdgaarAvya(token) {
  const { data, mutate } = useSWR(
    !!token ? ["/baiguullagaIdgaarAvya", token] : null,
    baiguullagaIdgaarAvya,
    { revalidateOnFocus: false }
  );
  return { baiguullagaIdgaarAvya: data, baiguullagaIdgaarAvyaMutate: mutate };
}
