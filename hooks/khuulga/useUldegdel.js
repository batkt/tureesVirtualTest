import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, dansniiDugaar) =>
  axios(token)
    .post(url, { dansniiDugaar })
    .then((res) => res.data?.uldegdel || 0)
    .catch(aldaaBarigch);

function useUldegdel(token, dansniiDugaar) {
  const { data, mutate } = useSWR(
    !!token && !!dansniiDugaar
      ? [`/dansniiUldegdelAvya`, token, dansniiDugaar]
      : null,
    fetcher
  );

  return { uldegdel: data, uldegdelMutate: mutate };
}

export default useUldegdel;
