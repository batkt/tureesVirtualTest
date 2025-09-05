import { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  baiguullagiinId,
  khuudaslalt,
  barilgiinId,
  query
) => {
  const { search, ...pagination } = khuudaslalt;

  return axios(token)
    .get(url, {
      params: {
        query: {
          ...query,
          barilgiinId,
          baiguullagiinId,
          ...(search && {
            $or: [
              { originalname: { $regex: search, $options: "i" } },
              { filename: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          }),
        },
        ...pagination,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useZurgiinZagvar(token, baiguullagiinId, bId, query = {}) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 50,
    search: "",
  });

  const swrKey = useMemo(() => {
    if (!token || !baiguullagiinId) return null;

    return [
      "/zuragKhadgalya",
      token,
      baiguullagiinId,
      JSON.stringify(khuudaslalt),
      barilgiinId || bId,
      JSON.stringify(query),
    ];
  }, [token, baiguullagiinId, khuudaslalt, barilgiinId, bId, query]);

  const { data, mutate, error, isValidating } = useSWR(
    swrKey,
    () =>
      fetcher(
        "/zuragKhadgalya",
        token,
        baiguullagiinId,
        khuudaslalt,
        barilgiinId || bId,
        query
      ),
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
      dedupingInterval: 60000,

      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    setKhuudaslalt,
    zurgiinZagvarGaralt: data,
    zurgiinZagvarMutate: mutate,
    zurgiinZagvarError: error,
    zurgiinZagvarLoading: !data && !error,
    zurgiinZagvarValidating: isValidating,
  };
}

export default useZurgiinZagvar;
