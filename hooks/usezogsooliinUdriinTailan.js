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
  garsanKhaalga,
  baiguullagiinId
) => {
  return axios(token)
    .post(url, {
      barilgiinId,
      ekhlekhOgnoo: moment(ekhlekhOgnoo).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(duusakhOgnoo).format("YYYY-MM-DD 23:59:59"),
      garsanKhaalga: garsanKhaalga,
      baiguullagiinId,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function usezogsooliinUdriinTailan(
  token,
  barilgiinId,
  duusakhOgnoo,
  ekhlekhOgnoo,
  garsanKhaalga,
  baiguullagiinId
) {
  const { data, mutate } = useSWR(
    !!token
      ? [
          "/zogsooliinUdriinTailanAvya",
          token,
          barilgiinId,
          duusakhOgnoo,
          ekhlekhOgnoo,
          garsanKhaalga,
          baiguullagiinId,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    zogsoolTulburMedeelel: data,
    zogsoolTulburMedeelelMutate: mutate,
  };
}

export default usezogsooliinUdriinTailan;
