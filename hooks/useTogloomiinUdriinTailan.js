import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";

const fetcher = (
  url,
  token,
  barilgiinId,
  duusakhOgnoo,
  ekhlekhOgnoo,
  baiguullagiinId,
  query
) => {
  return axios(token)
    .post(url, {
      barilgiinId,
      ekhlekhOgnoo: moment(ekhlekhOgnoo).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(duusakhOgnoo).format("YYYY-MM-DD 23:59:59"),
      baiguullagiinId,
      ...query,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useTogloomiinUdriinTailan(
  token,
  barilgiinId,
  duusakhOgnoo,
  ekhlekhOgnoo,
  baiguullagiinId,
  query
) {
  const { data, mutate, isValidating } = useSWR(
    !!token
      ? [
          "/togloomiinTuvUdriinTailanAvya",
          token,
          barilgiinId,
          duusakhOgnoo,
          ekhlekhOgnoo,
          baiguullagiinId,
          query,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    togloomTulburMedeelel: data,
    togloomTulburMedeelelMutate: mutate,
    togloomiinUdriinTailanUnshijBaina: isValidating,
  };
}

export default useTogloomiinUdriinTailan;
