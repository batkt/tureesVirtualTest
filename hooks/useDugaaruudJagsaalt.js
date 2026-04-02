import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";

const fetcher = (url, token, mashiniiId, ognoo, shineOgnoo) => {
  let params = {
    duusakhOgnoo: moment(ognoo[1]).endOf("month").format("YYYY-MM-DD 23:59:59"),
  };
  if (Array.isArray(shineOgnoo) && shineOgnoo.length > 1) {
    params.shineOgnoo = {
      startOgnoo: moment(shineOgnoo[0])
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss"),
      endOgnoo: moment(shineOgnoo[1])
        .endOf("month")
        .format("YYYY-MM-DD HH:mm:ss"),
    };
  }

  return axios(token)
    .get(`${url}/${mashiniiId}`, {
      params: params,
    })
    .then((res) => {
      return res.data;
    })
    .catch(aldaaBarigch);
};

export function useDugaaruud(token, mashiniiId, ognoo, shineOgnoo) {
  const { data, mutate } = useSWR(
    !!token
      ? ["/mashiniiDugaaruud", token, mashiniiId, ognoo, shineOgnoo]
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );
  return {
    dugaaruudTuukh: data,
    dugaaruudTuukhMutate: mutate,
  };
}
