import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, { search, jagsaalt, ...khuudaslalt },barilgiinId) =>
  axios(token)
    .get(url, {params:{
      query: {
        barilgiinId
      },
      order:{
        createAt: -1
      },
      ...khuudaslalt,
    }})
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useMedegdel(token) {
  const {barilgiinId} = useAuth()
  const [khuudaslalt, setMedegdelKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
  });
  const { data, mutate } = useSWR(
    !!token
      ? ["/medegdel", token, khuudaslalt,barilgiinId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setMedegdelKhuudaslalt,
    medegdel: data,
    medegdelMutate: mutate,
  };
}

export default useMedegdel;
