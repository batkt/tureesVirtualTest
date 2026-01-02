import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  barilgiinId,
  query = {},
  order,
  or
) => {
  var defaultOr = [];
  if (!!or) {
    or.forEach((element) => {
      defaultOr.push(element);
    });
  } else defaultOr.push({ mashiniiDugaar: { $regex: search, $options: "i" } });
  return axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: {
          baiguullagiinId,
          barilgiinId,
          $or: defaultOr,
          ...query,
        },
        order,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useUilchluulegchZogsool(
  token,
  baiguullagiinId,
  query,
  order,
  or,
  defaultKhuudaslalt
) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setUilchluulegchKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: defaultKhuudaslalt ? defaultKhuudaslalt : 100,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId
      ? [
          "/zogsoolUilchluulegch",
          token,
          baiguullagiinId,
          khuudaslalt,
          barilgiinId,
          query,
          order,
          or,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setUilchluulegchKhuudaslalt,
    uilchluulegchGaralt: data,
    uilchluulegchMutate: mutate,
    isValidating,
  };
}
const fetcherToololt = (url, token, barilgiinId, query) => {
  if (!!barilgiinId)
    return axios(token)
      .post(url, { barilgiinId, ...query })
      .then((res) => res.data)
      .catch(aldaaBarigch);
};
const fetcherDun = (url, token, query) => {
  return axios(token)
    .post(url, { ...query })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

export function useUilchluulegchToololt(token, query) {
  const { barilgiinId } = useAuth();
  const { data, mutate } = useSWR(
    !!token
      ? ["/zogsoolUilchluulegchdiinToo", token, barilgiinId, query]
      : null,
    fetcherToololt,
    { revalidateOnFocus: false }
  );
  return { uilchiluulegchToololt: data, uilchiluulegchToololtMutate: mutate };
}
export function useUilchluulegchZogsoolToo(token, query) {
  const { barilgiinId } = useAuth();
  const { data, mutate } = useSWR(
    !!token
      ? ["/zogsoolTusBurUilchluulegchdiinToo", token, barilgiinId, query]
      : null,
    fetcherToololt,
    { revalidateOnFocus: false }
  );
  return { zogsoolTusBuriinToo: data, zogsoolTusBuriinTooMutate: mutate };
}
export function useUilchluulegchdiinDunAvay(token, query) {
  const { data, mutate } = useSWR(
    !!token ? ["/zogsoolUilchluulegchdiinDunAvay", token, query] : null,
    fetcherDun,
    { revalidateOnFocus: false }
  );
  return { uilchluulegchdiinDun: data, uilchluulegchdiinDunMutate: mutate };
}

export default useUilchluulegchZogsool;
