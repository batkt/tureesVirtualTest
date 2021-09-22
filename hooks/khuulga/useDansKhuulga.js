import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";
const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  dans,
  ognoo
) =>
  axios(token)
    .post(url, {
      dansniiDugaar: dans.number,
      ekhlekhOgnoo: moment(ognoo[0]).format("YYYYMMDD"),
      duusakhOgnoo: moment(ognoo[1]).format("YYYYMMDD"),
      query: {
        baiguullagiinId,
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useDansKhuulga(token, baiguullagiinId, dans, ognoo) {
  const [khuudaslalt, setDansniiKhuulgaKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId && !!dans && !!ognoo
      ? [
          "/bankniiDansniiKhuulgaAvya",
          token,
          baiguullagiinId,
          khuudaslalt,
          dans,
          ognoo,
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
