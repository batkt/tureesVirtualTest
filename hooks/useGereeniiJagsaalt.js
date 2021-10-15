import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, baiguullagiinId, {search='',...khuudaslalt}, register,query) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          register,
          baiguullagiinId,
          $or:[{register:{$regex:search,$options:'i'}},{talbainDugaar:{$regex:search,$options:'i'}},{gereeniiDugaar:{$regex:search,$options:'i'}},{utas:{$regex:search,$options:'i'}}],
          ...query
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

const fetcherToololt = (url, token) =>
  axios(token)
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useGereeniiJagsaalt(token, baiguullagiinId, register,query) {
  const [khuudaslalt, setGereeniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
  });

  const { data, mutate } = useSWR(
    token && baiguullagiinId
      ? ["/geree", token, baiguullagiinId, khuudaslalt, register,query]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    gereeniiMedeelel: data,
    gereeniiMedeelelMutate: mutate,
    setGereeniiKhuudaslalt,
  };
}
export function useGereeniiJagsaaltToollolt(token) {
  const { data, mutate } = useSWR(
    token ? ["/toololtAvya", token] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    gereeToollolt: data,
    gereeToolloltMutate: mutate,
  };
}

export default useGereeniiJagsaalt;
