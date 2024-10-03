import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, ...khuudaslalt },
  barilgiinId,
  query,
  order
) =>
  axios(token)
    .get(url, {
      params: {
        order: order,
        query: {
          baiguullagiinId,
          barilgiinId,
          $or: [
            { ner: { $regex: search, $options: "i" } },
            { register: { $regex: search, $options: "i" } },
            { customerTin: { $regex: search, $options: "i" } },
            { utas: { $regex: search, $options: "i" } },
          ],
          ...query,
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

const fetcherToololt = (url, token, barilgiinId) =>
  axios(token)
    .get(`${url}/${barilgiinId}`)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useKhariltsagch(
  token,
  baiguullagiinId,
  khuudasniiKhemjee,
  query,
  order
) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 10,
    search: "",
  });
  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId && !!barilgiinId
      ? [
          "khariltsagch",
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
    setKhariltsagchKhuudaslalt: setKhuudaslalt,
    khariltsagchiinGaralt: data,
    khariltsagchMutate: mutate,
    isValidating,
  };
}
export function useKhariltsagchToololt(token) {
  const { barilgiinId } = useAuth();
  const { data, mutate, isValidating } = useSWR(
    token ? ["/khariltsagchiinTooAvya", token, barilgiinId] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    khariltsagchToololt: data,
    khariltsagchToololtMutate: mutate,
    isValidating,
  };
}

export default useKhariltsagch;
