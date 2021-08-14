import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt }
) =>
  axios(token)
    .get(url, {
      query: {
        baiguullagiinId,
        $or: [
          { ner: { $regex: search, $options: "i" } },
          { id: { $regex: search, $options: "i" } },
        ],
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useLanguu(token, baiguullagiinId) {
  const [khuudaslalt, setLanguuKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/languu", token, baiguullagiinId, khuudaslalt]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setLanguuKhuudaslalt,
    languuniiGaralt: data,
    languuniiJagsaaltMutate: mutate,
  };
}

export default useLanguu;
