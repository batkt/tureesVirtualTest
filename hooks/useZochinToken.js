import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
const dataAvya = (baiguullagiinId) =>
  uilchilgee()
    .get(`/zochiniiTokenAvya/${baiguullagiinId}`)
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useZochinToken(baiguullagiinId) {
  const { data, mutate } = useSWR(
    !!baiguullagiinId ? [baiguullagiinId] : null,
    dataAvya,
    { revalidateOnFocus: false }
  );
  return { token: data, tokenMutate: mutate };
}
