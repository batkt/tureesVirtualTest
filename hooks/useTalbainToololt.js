import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const toololtAvya = (url, token, barilgiinId) =>
  axios(token)
    .get(url, { params: { barilgiinId } })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export default function useTalbainToololt(token, barilgiinId) {
  const { data, mutate } = useSWR(
    !!token ? ["/talbainTooAvya", token, barilgiinId] : null,
    toololtAvya,
    { revalidateOnFocus: false }
  );
  return { talbainToololt: data, talbainToololtMutate: mutate };
}
