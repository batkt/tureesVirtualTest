import axios, { socket, aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useAuth } from "services/auth";
import _ from "lodash";

const fetcher = (
  url,
  token,
  khariltsagchiinId,
  { jagsaalt, search, ...khuudaslalt },
  query,
  order
) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: {
          khariltsagchiinId,
          $or: [{ message: { $regex: search, $options: "i" } }],
          ...query,
        },
        order: { createdAt: -1, ...order },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useSanalGomdol(token, khariltsagchiinId, query, order) {
  const { baiguullaga } = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    jagsaalt: [],
    search: "",
  });
  const { data, mutate } = useSWR(
    !!token
      ? ["/sanalGomdol", token, khariltsagchiinId, khuudaslalt, query, order]
      : null,
    fetcher
  );

  function sonorduulgaKharlaa(id) {
    axios(token)
      .post("/sanalKharlaa", { id })
      .then(({ data, status }) => {
        if (status === 200 && data === "Amjilttai") {
          mutate();
        }
      });
  }

  useEffect(() => {
    setKhuudaslalt({
      khuudasniiDugaar: 1,
      khuudasniiKhemjee: 10,
      search: "",
      jagsaalt: [],
    });
  }, [khariltsagchiinId]);

  useEffect(() => {
    if (baiguullaga?._id) {
      socket().on(`baiguullaga${baiguullaga?._id}`, (sonorduulga) => {
        if (sonorduulga.khariltsagchiinId === khariltsagchiinId) mutate();
      });
    }
    return () => {
      socket().off(`baiguullaga${baiguullaga?._id}`);
    };
  }, [khariltsagchiinId]);

  function nextSonorduulga() {
    if (data?.khuudasniiDugaar < data?.niitKhuudas)
      setKhuudaslalt((a) => ({
        ...a,
        khuudasniiDugaar: a.khuudasniiDugaar + 1,
        jagsaalt: [...khuudaslalt.jagsaalt, ...(data?.jagsaalt || [])],
      }));
  }

  function resetSonorduulga() {
    setKhuudaslalt({
      khuudasniiDugaar: 1,
      khuudasniiKhemjee: 20,
      search: "",
      jagsaalt: [],
    });
    mutate();
  }

  return {
    setKhuudaslalt,
    sonorduulga: data,
    sonorduulgaMutate: mutate,
    jagsaalt: khuudaslalt.jagsaalt,
    resetSonorduulga,
    nextSonorduulga,
    sonorduulgaKharlaa,
  };
}

export default useSanalGomdol;
