import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";
import { useAuth } from "services/auth";
import { useState } from "react";

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
  ognoo,
  barilgiinId,
  { search, ...khuudaslalt },
  query = {},
  showTsutslagdsanAvlaga = false,
  baiguullagiinId = null
) => {
  return axios(token)
    .post(url, {
      barilgiinId,
      baiguullagiinId: baiguullagiinId || query?.baiguullagiinId,
      ekhlekhOgnoo: moment(ognoo[0])
        .startOf("month")
        .format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(ognoo[1])
        .endOf("month")
        .format("YYYY-MM-DD 23:59:59"),
      showTsutslagdsanAvlaga,
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
    })
    .then((res) => res.data)
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

  const { data, mutate } = useSWR(
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
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    eneSardTuluuguiGereenuud: data,
    eneSardTuluuguiGereenuudMutate: mutate,
    setEneSardTuluuguiGereenuud,
  };
}

export default useEneSardTuluuguiGereenuudAvya;
