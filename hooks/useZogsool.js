import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";

const zogsoolTooAvya = (url, token, ognoo) =>
  axios(token)
    .post(url, {
      ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useZogsoolToololt(token, ognoo) {
  const { data, mutate } = useSWR(
    !!token ? ["/zogsooliinTooAvya", token, ognoo] : null,
    zogsoolTooAvya,
    { revalidateOnFocus: false }
  );
  return { zogsoolToololt: data, zogsoolToololtMutate: mutate };
}

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  barilgiinId,
  query = {},
  order
) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: {
          baiguullagiinId,
          $or: [{ car_number: { $regex: search, $options: "i" } }],
          ...query,
        },
        order,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useZogsool(token, baiguullagiinId, query, order) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setZogsoolKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 500,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          "/zogsool",
          token,
          baiguullagiinId,
          khuudaslalt,
          barilgiinId,
          query,
          order,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setZogsoolKhuudaslalt,
    zogsoolGaralt: data,
    zogsoolMutate: mutate,
  };
}

export default useZogsool;
