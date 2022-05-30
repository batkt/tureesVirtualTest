import useSWR from "swr";
import { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

function fetcher(
  token,
  url,
  query,
  order,
  select,
  { search = "", jagsaalt, ...khuudaslalt }
) {
  return uilchilgee(token)
    .get(url, {
      params: {
        query,
        order,
        select,
        ...khuudaslalt,
      },
    })
    .then((a) => a.data)
    .catch(aldaaBarigch);
}

function useJagsaalt(url, query, order, select) {
  const { token } = useAuth();

  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: "",
    jagsaalt: [],
  });

  const { data, mutate } = useSWR(
    token && url ? [token, url, query, order, select, khuudaslalt] : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  function next() {
    if (!!data)
      setKhuudaslalt((a) => {
        a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
        a.khuudasniiDugaar += 1;
        return { ...a };
      });
  }

  function refresh() {
    setKhuudaslalt((a) => {
      a.jagsaalt = [];
      a.khuudasniiDugaar = 1;
      return { ...a };
    });
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

  return { data, mutate, jagsaalt, next, refresh, onSearch };
}

export default useJagsaalt;
