import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token) =>
  axios(token)
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useDans(token) {
  const { data, mutate } = useSWR(
    !!token ? [`/bankniiDansniiJagsaaltAvya`, token] : null,
    fetcher
  );

  return { dans: data, dansMutate: mutate };
}

export default useDans;
