import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";
import { useAuth } from "services/auth";

const guilgeeniiToololtFetcher = (
  url,
  token,
  ognoo,
  barilgiinId,
  baiguullagiinId,
  showTsutslagdsanAvlagaColumn
) => {
  return axios(token)
    .post(url, {
      barilgiinId,
      baiguullagiinId,
      ekhlekhOgnoo: moment(ognoo?.[0])?.startOf("month")?.toISOString(),
      duusakhOgnoo: moment(ognoo?.[1])?.endOf("month")?.toISOString(),
      showTsutslagdsanAvlagaColumn: !!showTsutslagdsanAvlagaColumn,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

const eneSardTuluuguiFetcher = (url, token, ognoo, barilgiinId) => {
  return axios(token)
    .post(url, {
      barilgiinId,
      ekhlekhOgnoo: moment(ognoo?.[0])?.startOf("month")?.toISOString(),
      duusakhOgnoo: moment(ognoo?.[1])?.endOf("month")?.toISOString(),
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useGuilgeeniiToololtAvya(
  token,
  ognoo,
  barilgiinId,
  baiguullagiinId,
  showTsutslagdsanAvlagaColumn
) {
  const { data, mutate } = useSWR(
    !!token && ognoo?.[0] && ognoo?.[1]
      ? [
          "/guilgeeniiToololtAvya",
          token,
          ognoo,
          barilgiinId,
          baiguullagiinId,
          showTsutslagdsanAvlagaColumn,
        ]
      : null,
    guilgeeniiToololtFetcher,
    { revalidateOnFocus: false }
  );
  return { guilgeeniiToololt: data, guilgeeniiToololtMutate: mutate };
}
export function useTuluugiiGereeniiToololtAvya(token, ognoo) {
  const { barilgiinId } = useAuth();
  const { data, mutate } = useSWR(
    !!token
      ? ["/eneSardTuluuguiGereeniiTooAvya", token, ognoo, barilgiinId]
      : null,
    eneSardTuluuguiFetcher,
    { revalidateOnFocus: false }
  );
  return { tolooguiGereeniiToo: data, tolooguiGereeniiTooMutate: mutate };
}

export default useGuilgeeniiToololtAvya;
