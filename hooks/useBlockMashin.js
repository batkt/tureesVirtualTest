import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

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
          $or: [
            { dugaar: { $regex: search, $options: "i" } },
            { tailbar: { $regex: search, $options: "i" } },
            { burtgesenAjiltaniiNer: { $regex: search, $options: "i" } },
          ],
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
