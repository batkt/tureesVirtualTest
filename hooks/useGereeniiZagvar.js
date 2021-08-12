import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, baiguullagiinId, { search, ...khuudaslalt }) =>
  axios(token)
    .get(url, {
      order: { createdAt: -1 },
      query: {
        baiguullagiinId,
        $or: [
          { ner: { $regex: search, $options: "i" } },
          { utas: { $regex: search } },
          { "mashinuud.dugaar": { $regex: search, $options: "i" } },
        ],
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useGereeniiZagvar(token, baiguullagiinId) {
  const [khuudaslalt, setGereeniiZagvarKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/gereeniiZagvar", token, baiguullagiinId, khuudaslalt]
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
