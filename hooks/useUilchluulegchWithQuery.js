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
  order,
) => {
  return axios(token)
    .get(url, {
      params: {
        order: order,
        ...khuudaslalt,
        query: {
          baiguullagiinId,
          barilgiinId,
          ...query,
        },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useUilchluulegchWithQuery(
  token,
  baiguullagiinId,
  query,
  orjIrsenBarilgiinId,
  order,
) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setUilchluulegchKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId && !!query
      ? [
          "/zogsoolUilchluulegch",
          token,
          baiguullagiinId,
          khuudaslalt,
          orjIrsenBarilgiinId ? orjIrsenBarilgiinId : barilgiinId,
          query,
          order,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );
  return {
    setUilchluulegchKhuudaslalt,
    uilchluulegchGaralt: data,
    uilchluulegchMutate: mutate,
    isValidating,
  };
}

export default useUilchluulegchWithQuery;
