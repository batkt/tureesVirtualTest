import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import { useAuth } from "services/auth";

const fetcher = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  query,
  baiguullagiinId,
  barilgiinId
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          baiguullagiinId,
          barilgiinId,
          $or: [
            { guilgeeKhiisenAjiltniiNer: { $regex: search, $options: "i" } },
            { shaltgaan: { $regex: search, $options: "i" } },
            { gereeniiDugaar: { $regex: search, $options: "i" } },
            { turul: { $regex: search, $options: "i" } },
            { khungulukhKhuvi: search },
          ],
          ...query,
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useKhungulultTuukh(token, baiguullagiinId, query) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          "/khungulultiinTuukh",
          token,
          khuudaslalt,
          query,
          baiguullagiinId,
          barilgiinId,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhuudaslalt,
    khungulultTuukh: data,
    khungulultTuukhMutate: mutate,
    isValidating2: isValidating,
  };
}

export default useKhungulultTuukh;
