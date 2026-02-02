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

const fetcher = (url, token, query, searchKeys, { search = "", ...khuudaslalt }) => {
  const searchQuery = searchGenerator(search, searchKeys);
  
  return axios(token)
    .post(url, {
      ...khuudaslalt,
      ...query,
      ...(Object.keys(searchQuery).length > 0 ? searchQuery : {}),
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

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
