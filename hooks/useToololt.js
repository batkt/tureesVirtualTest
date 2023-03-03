import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment"
import useSWR from "swr";
const tooAvya = (url, token, ognoo) => 
  uilchilgee(token)
    .post(url, ognoo ? {
      ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
    } : undefined)
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useToololt(url, token, ognoo) {
  const { data, mutate } = useSWR(
    !!token ? [url, token, ognoo] : null,
    tooAvya,
    { revalidateOnFocus: false }
  );
  return { toololt: data, toololtMutate: mutate };
}