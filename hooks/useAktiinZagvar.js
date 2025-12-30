import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

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
  baiguullagiinId,
  { search, ...khuudaslalt },
  barilgiinId
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          barilgiinId,
          baiguullagiinId,
          ...searchGenerator(search, ["ner"]),
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useAktiinZagvar(token, baiguullagiinId, bId) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setAktiinZagvarKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
  });

  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          "/aktiinZagvar",
          token,
          baiguullagiinId,
          khuudaslalt,
          barilgiinId || bId,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setAktiinZagvarKhuudaslalt,
    aktiinZagvarGaralt: data,
    aktiinZagvarMutate: mutate,
  };
}

export default useAktiinZagvar;
