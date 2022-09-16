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
  query = {}
) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: {
          barilgiinId,
          baiguullagiinId,
          $or: [{ ner: { $regex: search, $options: "i" } }],
          ...query,
        },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useZardal(token, baiguullagiinId, query) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setZardalKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 500,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/zardal", token, baiguullagiinId, khuudaslalt, barilgiinId, query]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    setZardalKhuudaslalt,
    zardalGaralt: data,
    zardalMutate: mutate,
    isValidating,
  };
}

export default useZardal;
