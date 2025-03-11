import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  query,
  barilgiinId,
  { search, ...khuudaslalt },
  tuluv
) =>
  axios(token)
    .post(url, {
      barilgiinId,
      query: {
        $and: [
          {
            $or: [
              { ner: { $regex: search, $options: "i" } },
              { register: { $regex: search, $options: "i" } },
              { utas: { $regex: search, $options: "i" } },
              // { "geree.gereeniiDugaar": { $regex: search, $options: "i" } },
              // { "geree.talbainDugaar": { $regex: search, $options: "i" } },
            ],
          },
          tuluv !== null
            ? {
                $or: !!tuluv
                  ? [{ idevkhiteiEsekh: true }]
                  : [
                      { idevkhiteiEsekh: { $exists: false } },
                      { idevkhiteiEsekh: false },
                    ],
              }
            : {},
        ],
        ...query,
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useKhariltsagchDavkhraarAvya(token, query, tuluv) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    search: "",
  });
  const { data } = useSWR(
    !!token
      ? [
          "khariltsagchDavkhraarAvya",
          token,
          query,
          barilgiinId,
          khuudaslalt,
          tuluv,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhariltsagchKhuudaslalt: setKhuudaslalt,
    jagsaalt: data,
  };
}
export default useKhariltsagchDavkhraarAvya;
