import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const mashiniiTooAvya = (url, token, barilgiinId) =>
  axios(token)
    .post(url, { barilgiinId: barilgiinId })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useMashinToololt(token, barilgiinId) {
  const { data, mutate } = useSWR(
    !!token ? ["/mashiniiTooAvya", token, barilgiinId] : null,
    mashiniiTooAvya,
    { revalidateOnFocus: false }
  );
  return { mashinToololt: data, mashinToololtMutate: mutate };
}

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
          ...searchGenerator(search, [
            "turul",
            "ezemshigchiinNer",
            "ezemshigchiinRegister",
            "ezemshigchiinUtas",
            "dugaar",
            "cameraIP",
          ]),
          ...query,
        },
        order,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useMashin(token, baiguullagiinId, query, order) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setMashinKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 500,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          "/mashin",
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
    setMashinKhuudaslalt,
    mashinGaralt: data,
    mashinMutate: mutate,
    isValidating,
  };
}

export default useMashin;
