import useSWR from "swr";
import { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

function searchGenerator(keys, search) {
  if (keys.length > 0)
    return keys.map((key) => ({ [key]: { $regex: search, $options: "i" } }));
  return undefined;
}

function fetcher(
  token,
  url,
  query,
  order,
  select,
  { search = "", jagsaalt, ...khuudaslalt },
  searchKeys = []
) {
  return uilchilgee(token)
    .get(url, {
      params: {
        query: {
          ...query,
          $or: searchGenerator(searchKeys, search),
        },
        order,
        select,
        ...khuudaslalt,
      },
    })
    .then((a) => a.data)
    .catch(aldaaBarigch);
}

var timeout = null;

function useJagsaalt(url, query, order, select, searchKeys, supToken) {
  const { token } = useAuth();

  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 500,
    search: "",
    jagsaalt: [],
  });

  const { data, mutate, isValidating } = useSWR(
    (token || supToken) && url
      ? [token || supToken, url, query, order, select, khuudaslalt, searchKeys]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  function next() {
    if (!!data)
      if (khuudaslalt?.khuudasniiDugaar < data?.niitKhuudas) {
        setKhuudaslalt((a) => {
          a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
          a.khuudasniiDugaar += 1;
          return { ...a };
        });
      }
  }

  function refresh() {
    setKhuudaslalt((a) => {
      a.jagsaalt = [];
      a.khuudasniiDugaar = 1;
      return { ...a };
    });
    mutate();
  }

  function onSearch(search) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      setKhuudaslalt((a) => {
        a.search = search;
        a.jagsaalt = [];
        a.khuudasniiDugaar = 1;
        return {
          ...a,
        };
      });
    }, 300);
  }

  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt, data]);

  return {
    data,
    mutate,
    jagsaalt,
    next,
    refresh,
    onSearch,
    isValidating,
    setKhuudaslalt,
    khuudaslalt,
  };
}

export default useJagsaalt;
