import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  barilgiinId,
  query = {},
  order
) => {
  return axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: {
          baiguullagiinId,
          barilgiinId,
          ...query,
        },
        order,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useUilchluulegchToo(token, baiguullagiinId, query, order) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setUilchluulegchTooKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          "/zogsoolUilchluulegch/TooAvya",
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
    setUilchluulegchTooKhuudaslalt,
    uilchluulegchTooGaralt: data,
    uilchluulegchTooMutate: mutate,
  };
}

export default useUilchluulegchToo;
