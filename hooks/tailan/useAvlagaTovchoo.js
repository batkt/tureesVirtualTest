import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const searchGenerator = (search, fields) => {
  if (!!search && !!fields)
    return {
      $or: fields.map((key) => ({ [key]: { $regex: search, $options: "i" } })),
    };
  else return {};
};

const fetcher = (url, token, query, searchKeys, { search = "", ...khuudaslalt }) =>
  axios(token)
    .post(url, {
      ...khuudaslalt,
      ...query,
      ...searchGenerator(search, searchKeys),
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useAvlagaTovchoo(token, query, searchKeys, khuudasniiKhemjee) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    khuudasniiDugaar: 1,
    search: "",
  });

  const { data, mutate, isValidating } = useSWR(
    !!token ? ["/avlagaTovchoo", token, query, searchKeys, khuudaslalt] : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    avlagaTovchoo: data,
    avlagaTovchooMutate: mutate,
    unshijBaina: isValidating,
    setKhuudaslalt,
  };
}

const detailFetcher = (url, token, body) =>
  axios(token)
    .post(url, body)
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useavlagaTovchooDelgerengui(token, gereeniiDugaar, ekhlekhOgnoo, duusakhOgnoo, baiguullagiinId, barilgiinId, tukhainBaaziinKholbolt) {
  const { data, isValidating } = useSWR(
    !!token && !!gereeniiDugaar
      ? ["/avlagaTovchooDelgerengui", token, gereeniiDugaar, ekhlekhOgnoo, duusakhOgnoo]
      : null,
    (url, token) =>
      detailFetcher(url, token, {
        gereeniiDugaar,
        ekhlekhOgnoo,
        duusakhOgnoo,
        baiguullagiinId,
        barilgiinId,
        tukhainBaaziinKholbolt,
      }),
    { revalidateOnFocus: false }
  );

  // Fetch full geree document to get aldangi/baritsaa guilgeenuud + baritsaa fields
  const { data: gereeData, isValidating: gereeLoading } = useSWR(
    !!token && !!gereeniiDugaar
      ? ["/avlagaTovchooDelgerengui/full", token, gereeniiDugaar, baiguullagiinId, barilgiinId]
      : null,
    () =>
      detailFetcher("/avlagaTovchooGereeAvya", token, {
        gereeniiDugaar,
        ekhlekhOgnoo,
        duusakhOgnoo,
        baiguullagiinId,
        barilgiinId,
        tukhainBaaziinKholbolt,
      }),
    { revalidateOnFocus: false }
  );

  return {
    detail: data,
    gereeDetail: gereeData,
    detailUnshijBaina: isValidating || gereeLoading,
  };
}

export default useAvlagaTovchoo;
