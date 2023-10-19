import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search = "", ...khuudaslalt },
  register,
  query,
  tooAvakhEsekh,
  barilgiinId,
  { uldegdel, ...order } = { createAt: -1 },
  select
) =>
  axios(token)
    .get(url + `${tooAvakhEsekh ? "/tooAvya" : ""}`, {
      params: {
        query: {
          register,
          barilgiinId,
          baiguullagiinId,
          $or: [
            { register: { $regex: search, $options: "i" } },
            { talbainDugaar: { $regex: search, $options: "i" } },
            { gereeniiDugaar: { $regex: search, $options: "i" } },
            { utas: { $regex: search, $options: "i" } },
            { ovog: { $regex: search, $options: "i" } },
            { ner: { $regex: search, $options: "i" } },
          ],
          ...query,
        },
        order: order,
        collation: {
          locale: "mn",
          numericOrdering: true,
          maxVariable: "space",
          alternate: "shifted",
        },
        select,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

const fetcherToololt = (url, token, barilgiinId) =>
  axios(token)
    .post(url, { barilgiinId })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useGereeniiJagsaalt(
  token,
  baiguullagiinId,
  register,
  query,
  tooAvakhEsekh,
  khuudasniiKhemjee,
  order,
  select
) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setGereeniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    search: "",
  });

  const { data, mutate, isValidating } = useSWR(
    token && baiguullagiinId
      ? [
          "/geree",
          token,
          baiguullagiinId,
          khuudaslalt,
          register,
          query,
          tooAvakhEsekh,
          barilgiinId,
          order,
          select,
        ]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    gereeniiMedeelel: data,
    isValidating,
    gereeniiMedeelelMutate: mutate,
    setGereeniiKhuudaslalt,
  };
}
export function useGereeniiJagsaaltToollolt(token) {
  const { barilgiinId } = useAuth();
  const { data, mutate } = useSWR(
    token ? ["/gereeniiToololtAvya", token, barilgiinId] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    gereeToollolt: data,
    gereeToolloltMutate: mutate,
  };
}
const fetcherGuilgee = (url, token, gereeniiId, ognoo) =>
    axios(token)
        .get(`${url}/${gereeniiId}`, {
            params: {
                duusakhOgnoo: moment(ognoo[1])
                    .endOf("month")
                    .format("YYYY-MM-DD 23:59:59"),
            },
        })
        .then((res) => {
            var uldegdel = 0;
            res.data.forEach((x) => {
                uldegdel =
                    uldegdel +
                    (x?.tulukhDun || 0 - (x?.tulsunDun || 0) - (x?.khyamdral || 0));
                if (x.turul === "khyamdral" && uldegdel < 0) x.uldegdel = 0;
                else x.uldegdel = uldegdel;
            });
            return res.data;
        })
        .catch(aldaaBarigch);


export function useGereeGuilgee(token, gereeniiId, ognoo) {
    const { data, mutate } = useSWR(
        !!token ? ["/gereeniiTulultAvya", token, gereeniiId, ognoo] : null,
        fetcherGuilgee,
        { revalidateOnFocus: false }
    );
    return {
        guilgeeniiTuukh: data,
        guilgeeniiTuukhMutate: mutate,
    };
}

export default useGereeniiJagsaalt;
