import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, baiguullagiinId, { search, ...khuudaslalt },barilgiinId) =>
  axios(token)
    .get(url, {params:{
      query: {
        barilgiinId,
        baiguullagiinId
      },
      ...khuudaslalt,
    }})
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useGereeniiZagvar(token, baiguullagiinId) {
  const {barilgiinId} = useAuth()
  const [khuudaslalt, setGereeniiZagvarKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/gereeniiZagvar", token, baiguullagiinId, khuudaslalt,barilgiinId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setGereeniiZagvarKhuudaslalt,
    gereeniiZagvarGaralt: data,
    gereeniiZagvarMutate: mutate,
  };
}

export default useGereeniiZagvar;
