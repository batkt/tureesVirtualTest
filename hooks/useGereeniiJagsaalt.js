import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token,baiguullagiinId,khuudaslalt) =>
  axios(token)
    .get(url,{params:{query:{baiguullagiinId},...khuudaslalt}})
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useGereeniiJagsaalt(token,baiguullagiinId) {
  const [khuudaslalt, setGereeniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
  });

  const { data, mutate } = useSWR(token && baiguullagiinId ? ["/geree", token,baiguullagiinId,khuudaslalt] : null, fetcher, {
    revalidateOnFocus: false,
  });
  return { gereeniiMedeelel: data,gereeniiMedeelelMutate:mutate,setGereeniiKhuudaslalt };
}

export default useGereeniiJagsaalt;
