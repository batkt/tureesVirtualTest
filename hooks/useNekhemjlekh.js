import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";

const fetcher = (url, token, ognoo, { search, jagsaalt, ...khuudaslalt }) =>
  axios(token)
    .post(url, {
      ognoo: moment(ognoo).endOf("month").format("YYYY-MM-DD 23:59:59"),
      query: {
        query: {},
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useNekhemjlekh(token, ognoo) {
  const [khuudaslalt, setNekhemjlelKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!ognoo
      ? ["/eneSardTulukhJagsaaltAvya", token, ognoo, khuudaslalt]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setNekhemjlelKhuudaslalt,
    nekhemjlel: data,
    nekhemjlelMutate: mutate,
  };
}

export default useNekhemjlekh;
