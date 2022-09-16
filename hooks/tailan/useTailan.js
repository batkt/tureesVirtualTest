import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, shuult) =>
  axios(token)
    .post("/" + url, shuult)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useTailan(ner, token, shuult) {
  const { data, mutate, isValidating } = useSWR(
    !!token && !!ner ? [ner, token, shuult] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    tailanGaralt: data,
    tailanMutate: mutate,
    isValidating,
  };
}

export default useTailan;
