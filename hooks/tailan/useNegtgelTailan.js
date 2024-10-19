import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

function searchGenerator(keys, search) {
  if (keys.length > 0)
    return keys.map((key) => ({ [key]: { $regex: search, $options: "i" } }));
  return undefined;
}

const fetcher = (url, token, query, searchKeys, { search = "", ...khuudaslalt },) =>
  axios(token)
    .post(url, {
      ...khuudaslalt,
      ...query,
      query: {
        $or: searchGenerator(searchKeys, search),
      }
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useNegtgelTailan(token, query, searchKeys, khuudasniiKhemjee) {
  const [khuudaslalt, setTailanKhuudaslalt] = useState({
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    khuudasniiDugaar: 1,
    search: "",
  });
  const { data, mutate, isValidating } = useSWR(
    !!token
      ? ["/negtgelTailanAvya", token, query, searchKeys, khuudaslalt]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    tailanGaralt: data,
    tailanMutate: mutate,
    unshijBaina: isValidating,
    setTailanKhuudaslalt,
  };
}

export default useNegtgelTailan;
