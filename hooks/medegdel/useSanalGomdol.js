import axios, { socket, aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useAuth } from "services/auth";
import _ from "lodash";

const fetcher = (url, token, khariltsagchiinId, { jagsaalt, ...khuudaslalt }) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: { khariltsagchiinId },
        order: { createdAt: -1, kharsanEsekh: 0 },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useSanalGomdol(token, khariltsagchiinId) {
  const { baiguullaga } = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!khariltsagchiinId
      ? ["/sanalGomdol", token, khariltsagchiinId, khuudaslalt]
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
