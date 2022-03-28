import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const toololtAvya = (url, token, barilgiinId) =>
  axios(token)
    .get(url, { params: { barilgiinId } })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export default function useTalbainToololt(token) {
  const { barilgiinId } = useAuth();
  const { data, mutate } = useSWR(
    !!token && !!barilgiinId ? ["/talbainTooAvya", token, barilgiinId] : null,
    toololtAvya,
    { revalidateOnFocus: false }
  );
  return { talbainToololt: data, talbainToololtMutate: mutate };
}
