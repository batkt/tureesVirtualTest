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
        $or: [{ ner: { $regex: search, $options: "i" } }, { id: { $regex: search, $options: "i" } }],
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useBaraa(token, baiguullagiinId) {
  const [khuudaslalt, setBaraaiiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/baraaniiJagsaaltAvya", token, baiguullagiinId, khuudaslalt]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setBaraaiiKhuudaslalt,
    baraaiiGaralt: data,
    baraaiiMutate: mutate,
  };
}

export default useBaraa