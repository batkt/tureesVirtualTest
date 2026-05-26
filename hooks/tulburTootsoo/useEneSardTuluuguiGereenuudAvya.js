import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { useAuth } from "services/auth";

const searchGenerator = (search, fields) => {
  if (!!search && !!fields)
    return {
      $or: fields.map((key) => ({ [key]: { $regex: search, $options: "i" } })),
    };
  else return {};
};

const buildBody = (
  ognoo,
  barilgiinId,
  khuudaslalt,
  query,
  search,
  showTsutslagdsanAvlaga,
  baiguullagiinId
) => ({
  barilgiinId,
  baiguullagiinId: baiguullagiinId || query?.baiguullagiinId,
  ekhlekhOgnoo: moment(ognoo[0])
    .startOf("month")
    .toISOString(),
  duusakhOgnoo: moment(ognoo[1])
    .endOf("month")
    .toISOString(),
  showTsutslagdsanAvlaga: showTsutslagdsanAvlaga === true,
  query: {
    ...khuudaslalt,
    query: {
      barilgiinId,
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
  },
});

const fetcher = (
  url,
  token,
  ognoo,
  barilgiinId,
  { search, ...khuudaslalt },
  query = {},
  showTsutslagdsanAvlaga = false,
  baiguullagiinId = null
) => {
  const body = buildBody(
    ognoo,
    barilgiinId,
    khuudaslalt,
    query,
    search,
    showTsutslagdsanAvlaga,
    baiguullagiinId
  );
  return axios(token)
    .post(url, body)
    .then((res) => {
      return res.data;
    })
    .catch(aldaaBarigch);
};


function useEneSardTuluuguiGereenuudAvya(
  token,
  ognoo,
  query,
  showTsutslagdsanAvlaga = false
) {
  const { barilgiinId, baiguullaga } = useAuth();

  const [khuudaslalt, setEneSardTuluuguiGereenuud] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 500,
    search: "",
  });

  const fetchKey =
    !!token && !!barilgiinId
      ? [
        "/eneSardTuluuguiGereenuudAvya",
        token,
        ognoo,
        barilgiinId,
        khuudaslalt,
        query,
        showTsutslagdsanAvlaga,
        baiguullaga?._id,
      ]
      : null;

  const chosenFetcher = useCallback(
    (...args) => {
      return fetcher(...args);
    },
    []
  );

  const { data, mutate, isValidating } = useSWR(fetchKey, chosenFetcher, {
    revalidateOnFocus: false,
  });

  return {
    eneSardTuluuguiGereenuud: data,
    eneSardTuluuguiGereenuudMutate: mutate,
    setEneSardTuluuguiGereenuud,
    isValidating,
  };
}

export default useEneSardTuluuguiGereenuudAvya;
