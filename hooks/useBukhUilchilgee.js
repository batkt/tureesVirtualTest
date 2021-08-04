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
    .post(url, {
      query: {
        baiguullagiinId,
        $or: [{ ner: { $regex: search, $options: "i" } }, { "baraanuud.id": { $regex: search, $options: "i" } }],
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useUilchilgee(token, baiguullagiinId) {
  const [khuudaslalt, setUilchilgeeniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/bukhUilchilgeeniiJagsaaltAvya", token, baiguullagiinId, khuudaslalt]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setUilchilgeeniiKhuudaslalt,
    uilchilgeeniiGaralt: data,
    uilchilgeeMutate: mutate,
  };
}

export default useUilchilgee