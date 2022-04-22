import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import { useAuth } from "services/auth";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  barilgiinId
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          barilgiinId,
          $or: [{ ner: { $regex: search, $options: "i" } }],
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useNekhemjlekhiinZagvar(token) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setNekhemjlekhiinZagvarKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token ? ["/nekhemjlekhiinZagvar", token, khuudaslalt, barilgiinId] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setNekhemjlekhiinZagvarKhuudaslalt,
    nekhemjlekhiinZagvar: data,
    nekhemjlekhiinZagvarMutate: mutate,
  };
}

export default useNekhemjlekhiinZagvar;
