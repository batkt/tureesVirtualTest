import { notification } from "antd";
import axios, { socket, aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import Sonorduulga from "components/sonorduulga";
import { useEffect, useState } from "react";
import { useAuth } from "services/auth";

const fetcher = (
  url,
  token,
  baiguullagiinId,
  barilgiinId,
  { jagsaalt, ...khuudaslalt }
) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: { baiguullagiinId, barilgiinId },
        order: { createdAt: -1 },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

const tooFetcher = (
  url,
  token,
  baiguullagiinId,
  barilgiinId,
  { jagsaalt, ...khuudaslalt }
) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: { baiguullagiinId, barilgiinId, kharsanEsekh: { $ne: true } },
        order: { createdAt: -1 },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

var sonorduulgaId = null;

function useSonorduulga(token) {
  const { baiguullaga, barilgiinId } = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullaga?._id
      ? ["/sonorduulga", token, baiguullaga?._id, barilgiinId, khuudaslalt]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  const too = useSWR(
    !!token && !!baiguullaga?._id
      ? [
          "/sonorduulga/tooAvya",
          token,
          baiguullaga?._id,
          barilgiinId,
          khuudaslalt,
        ]
      : null,
    tooFetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (baiguullaga?._id) {
      socket().on(`baiguullaga${baiguullaga?._id}`, (sonorduulga) => {
        console.log("sonorduulga", sonorduulga);
        const key = `${Math.floor(Math.random() * 100)}+${Date.now()}`;
        mutate();
        too.mutate();
        if (!!sonorduulga && sonorduulgaId !== sonorduulga?._id) {
          function onClose() {
            notification.close(key);
          }

          notification.open({
            key: key,
            message: (
              <Sonorduulga token={token} {...sonorduulga} onClose={onClose} />
            ),
            closeIcon: () => null,
            duration: 100000,
          });
          sonorduulgaId = sonorduulga?._id;
        }
      });
    }
    return () => {
      socket().off(`baiguullaga${baiguullaga?._id}`);
    };
  }, [baiguullaga]);

  return {
    setKhuudaslalt,
    sonorduulga: data,
    kharaaguiToo: too?.data?.niitMur,
    sonorduulgaMutate: mutate,
    jagsaalt: khuudaslalt.jagsaalt,
  };
}

export default useSonorduulga;
