import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import { useAuth } from "services/auth";

const searchGenerator = (search, fields) => {
  if (!!search && !!fields)
    return {
      $or: fields.map((key) => ({ [key]: { $regex: search, $options: "i" } })),
    };
  else return {};
};

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
          ...searchGenerator(search, [
            "guilgeeKhiisenAjiltniiNer",
            "shaltgaan",
            "khamaataiGereenuud.gereeniiDugaar",
          ]),
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
