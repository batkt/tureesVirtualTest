import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";

const fetcher = (
  url,
  token,
  barilgiinId,
  ognoo,
  searchUtga,
  baiguullagiinId
) => {
  return axios(token)
    .post(url, {
      barilgiinId,
      ognoo: moment(ognoo).format("YYYY-MM-DD 23:59:59"),
      searchUtga,
      baiguullagiinId,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useTuluuguiMashiniiTailan(
  token,
  barilgiinId,
  ognoo,
  searchUtga,
  baiguullagiinId
) {
  const { data, mutate, isValidating } = useSWR(
    !!token
      ? [
          "/zogsooliinTuluuguiMashiniiTailanAvya",
          token,
          barilgiinId,
          ognoo,
          searchUtga,
          baiguullagiinId,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    tuluuguiMashiniiMedeelel: data,
    tuluuguiMashiniiMedeelelMutate: mutate,
    tuluuguiMashiniiMedeelelUnshijBaina: isValidating,
  };
}

export default useTuluuguiMashiniiTailan;
