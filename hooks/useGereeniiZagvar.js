import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, ...khuudaslalt },
  barilgiinId,
  query
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          ...query,
          barilgiinId,
          baiguullagiinId,
          $or: [{ ner: { $regex: search, $options: "i" } }],
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useGereeniiZagvar(token, baiguullagiinId, bId, query) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setGereeniiZagvarKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
  });

  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          "/gereeniiZagvar",
          token,
          baiguullagiinId,
          khuudaslalt,
          barilgiinId || bId,
          query,
        ]
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
