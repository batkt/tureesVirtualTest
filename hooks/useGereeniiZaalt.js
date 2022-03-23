import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, ...khuudaslalt },
  barilgiinId
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          baiguullagiinId,
          barilgiinId,
          $or: [
            { kharagdakhDugaar: { $regex: search, $options: "i" } },
            { zaalt: { $regex: search, $options: "i" } },
            { khamaarakhKheseg: { $regex: search, $options: "i" } },
          ],
        },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useGereeniiZaalt(token, baiguullagiinId) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setGereeniiZaaltKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/gereeniiZaalt", token, baiguullagiinId, khuudaslalt, barilgiinId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setGereeniiZaaltKhuudaslalt,
    gereeniiZaaltGaralt: data,
    gereeniiZaaltMutate: mutate,
  };
}

export default useGereeniiZaalt;
