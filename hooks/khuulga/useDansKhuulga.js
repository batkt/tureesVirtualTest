import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";
import _ from "lodash";
import { useAuth } from "services/auth"
function getSearch(search){
  var fallback = [{ description: { $regex: search, $options: "i" } }]
  fallback.push({ relatedAccount:{ $regex: search, $options: "i" }})
  if(/^\d+$/.test(search)){
    fallback.push({ amount: search})
  }
  return fallback
}

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  dans,
  ognoo,
  order={},
  query,
  barilgiinId
) =>
  axios(token)
    .get(url,{params:{
      order,
      query:{
        dansniiDugaar: dans.number,
        barilgiinId,
        baiguullagiinId,
        amount:{ $gt: 0 },
        tranDate:{$gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),$lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),},
        $or: getSearch(search),
        ...query
      },
      ...khuudaslalt
    }})
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useDansKhuulga(token, baiguullagiinId, dans, ognoo,order,query) {
  const {barilgiinId} = useAuth()
  const [khuudaslalt, setDansniiKhuulgaKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search:''
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId && !!dans && !!ognoo
      ? [
          "/bankniiGuilgee",
          token,
          baiguullagiinId,
          khuudaslalt,
          dans,
          ognoo,
          order,
          query,
          barilgiinId
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaGaralt: data,
    dansniiKhuulgaMutate: mutate,
  };
}

export default useDansKhuulga;
