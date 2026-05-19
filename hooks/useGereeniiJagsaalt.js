import { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";

const searchGenerator = (search, fields) => {
  if (!!search && !!fields)
    return {
      $or: fields.map((key) => ({ [key]: { $regex: search, $options: "i" } })),
    };
  else return {};
};

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
          ...searchGenerator(search, [
            "register",
            "customerTin",
            "talbainDugaar",
            "gereeniiDugaar",
            "utas",
            "ovog",
            "ner",
          ]),
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
  return useMemo(
    () => ({
      gereeniiMedeelel: data,
      isValidating,
      gereeniiMedeelelMutate: mutate,
      setGereeniiKhuudaslalt,
    }),
    [data, isValidating, mutate],
  );
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
const fetcherGuilgee = (url, token, gereeniiId, ognoo, shineOgnoo) => {
  let params = {
    duusakhOgnoo: (Array.isArray(shineOgnoo) && shineOgnoo.length > 1)
      ? moment(shineOgnoo[1]).endOf("month").format("YYYY-MM-DD 23:59:59")
      : "2100-12-31 23:59:59",
  };
  if (Array.isArray(shineOgnoo) && shineOgnoo.length > 1) {
    params.shineOgnoo = {
      startOgnoo: moment(shineOgnoo[0])
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss"),
      endOgnoo: moment(shineOgnoo[1])
        .endOf("month")
        .format("YYYY-MM-DD HH:mm:ss"),
    };
  }

  return axios(token)
    .get(`${url}/${gereeniiId}`, {
      params: params,
    })
    .then((res) => {
      var avlagaUldegdel = 0;
      var aldangiUldegdel = 0;
      res.data.forEach((x) => {
        avlagaUldegdel =
          avlagaUldegdel +
          (x?.tulukhDun || 0) -
          (x?.tulsunDun || 0) -
          (x?.khyamdral || 0);
        aldangiUldegdel =
          aldangiUldegdel +
          (x?.tulukhAldangi || 0) -
          (x?.tulsunAldangi || 0);
        if (x.turul === "khyamdral" && avlagaUldegdel < 0)
          x.uldegdel = aldangiUldegdel > 0 ? aldangiUldegdel : 0;
        else x.uldegdel = avlagaUldegdel + aldangiUldegdel;
      });
      return res.data;
    })
    .catch(aldaaBarigch);
};

export function useGereeGuilgee(token, gereeniiId, ognoo, shineOgnoo) {
  const { data, mutate } = useSWR(
    !!token
      ? ["/gereeniiTulultAvya", token, gereeniiId, ognoo, shineOgnoo]
      : null,
    fetcherGuilgee,
    { revalidateOnFocus: false }
  );
  return {
    guilgeeniiTuukh: data,
    guilgeeniiTuukhMutate: mutate,
  };
}

export default useGereeniiJagsaalt;
