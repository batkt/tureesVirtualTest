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
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

const mergeFetcher = async (
  url,
  token,
  ognoo,
  barilgiinId,
  khuudaslalt,
  query,
  baiguullagiinId
) => {
  const { search, ...rest } = khuudaslalt || {};
  const pagination = rest;
  const [activeRes, withCancelledRes] = await Promise.all([
    axios(token)
      .post(
        url,
        buildBody(ognoo, barilgiinId, pagination, query, search, false, baiguullagiinId)
      )
      .then((r) => r.data)
      .catch(aldaaBarigch),
    axios(token)
      .post(
        url,
        buildBody(ognoo, barilgiinId, pagination, query, search, true, baiguullagiinId)
      )
      .then((r) => r.data)
      .catch(aldaaBarigch),
  ]);
  if (!activeRes || !withCancelledRes) return activeRes || withCancelledRes;
  const activeIds = new Set((activeRes?.jagsaalt || []).map((x) => x._id));
  const cancelledIds = new Set();
  const cancelledOnly = (withCancelledRes?.jagsaalt || []).filter((x) => {
    if (!(x?.tuluv == -1 || x?.tuluv === -1)) return false;
    if (activeIds.has(x._id)) return false;
    if (cancelledIds.has(x._id)) return false;
    cancelledIds.add(x._id);
    return true;
  });
  const seenIds = new Set();
  const mergedJagsaalt = [...(activeRes?.jagsaalt || []), ...cancelledOnly].filter(
    (x) => {
      const id = x?._id;
      if (!id || seenIds.has(id)) return false;
      seenIds.add(id);
      return true;
    }
  );
  return {
    ...activeRes,
    jagsaalt: mergedJagsaalt,
    niitMur: mergedJagsaalt.length,
    niitTuluvluguut:
      withCancelledRes?.niitTuluvluguut ?? activeRes?.niitTuluvluguut,
  };
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
      if (showTsutslagdsanAvlaga) {
        const [url, token, ognoo, barilgiinId, khuudaslalt, query, , baiguullagiinId] = args;
        return mergeFetcher(
          url,
          token,
          ognoo,
          barilgiinId,
          khuudaslalt,
          query,
          baiguullagiinId
        );
      }
      return fetcher(...args);
    },
    [showTsutslagdsanAvlaga]
  );

  const { data, mutate } = useSWR(fetchKey, chosenFetcher, {
    revalidateOnFocus: false,
  });

  return {
    eneSardTuluuguiGereenuud: data,
    eneSardTuluuguiGereenuudMutate: mutate,
    setEneSardTuluuguiGereenuud,
  };
}

export default useEneSardTuluuguiGereenuudAvya;
