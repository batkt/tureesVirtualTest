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
  { search, jagsaalt, ...khuudaslalt },
  barilgiinId,
  query = {},
  order
) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: {
          barilgiinId,
          baiguullagiinId,
          ...searchGenerator(search, ["dugaar", "tailbar", "burtgesenAjiltaniiNer"]),
          ...query,
        },
        order,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useBlockMashin(token, baiguullagiinId, query, order) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setBlockMashinKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 500,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          "/blockMashin",
          token,
          baiguullagiinId,
          khuudaslalt,
          barilgiinId,
          query,
          order,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    setBlockMashinKhuudaslalt,
    blockMashinGaralt: data,
    blockMashinMutate: mutate,
  };
}

export default useBlockMashin;
