import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const searchGenerator = (search, fields) => {
  if (!!search && !!fields) {
    const or = fields.map((key) => ({
      [key]: { $regex: search, $options: "i" },
    }));
    if (/^\d+$/.test(search)) {
      or.push({ talbainKhemjee: search });
    }
    return { $or: or };
  }
  return {};
};

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  barilgiinId,
  query,
  order
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          baiguullagiinId,
          barilgiinId,
          ...searchGenerator(search, ["kod", "tailbar", "tooluuriinDugaar"]),
          ...query,
        },
        ...khuudaslalt,
        order,
        collation: { locale: "mn", numericOrdering: true },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useTalbai(token, baiguullagiinId, query, order) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setTalbaiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  });

  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          "/talbai",
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
    setTalbaiKhuudaslalt,
    talbainiiGaralt: data,
    talbainiiJagsaaltMutate: mutate,
    isValidating,
  };
}

export default useTalbai;
