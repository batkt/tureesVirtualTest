import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token) =>
  axios(token)
    .post("/" + url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useTailan(ner, token) {
  const { data } = useSWR(!!token && !!ner ? [ner, token] : null, fetcher, {
    revalidateOnFocus: false,
  });
  return {
    data: data,
  };
}

export default useTailan;
