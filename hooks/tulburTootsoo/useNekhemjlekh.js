import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import { useAuth } from "services/auth";
import useSWR from "swr";
import moment from "moment";

const queryAvya = (davkhar, ilgeekhTurul) => {
  const query = {};
  if (ilgeekhTurul === "davkharaar" && davkhar) query.davkhar = davkhar;
  return query;
};

const fetcher = (
  url,
  token,
  ognoo,
  { search, jagsaalt, ...khuudaslalt },
  davkhar,
  barilgiinId,
  ilgeekhTurul,
  olnoorSaraarEsekh,
  _id
) =>
  axios(token)
    .post(url, {
      barilgiinId,
      olnoorSaraarEsekh,
      ekhlekhOgnoo: olnoorSaraarEsekh ? moment().startOf("month").format("YYYY-MM-DD 00:00:00") : moment(ognoo).startOf("month").format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(ognoo).endOf("month").format("YYYY-MM-DD 23:59:59"),
      nekhemjlekhAvakhOgnoo: ognoo.format("YYYY-MM-DD 23:59:59"),
      query: {
        query: {
          ...queryAvya(davkhar, ilgeekhTurul),
          $or: [
            { ner: { $regex: search, $options: "i" } },
            { register: { $regex: search, $options: "i" } },
            { talbainDugaar: { $regex: search, $options: "i" } },
            { gereeniiDugaar: { $regex: search, $options: "i" } },
            { utas: { $regex: search, $options: "i" } },
          ],
          _id,
        },
        ...khuudaslalt,
      },
    })
    .then((res) => {
      if (ilgeekhTurul === "avlagaar" && res.data)
        return {
          ...res.data,
          jagsaalt: res.data?.jagsaalt?.filter((a) => a.niitUldegdel > 0),
        };
      return res.data;
    })
    .catch(aldaaBarigch);

function useNekhemjlekh(
  token,
  ognoo,
  davkhar,
  ilgeekhTurul,
  olnoorSaraarEsekh,
  mbarilgiinId,
  _id
) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setNekhemjlelKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 1000,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate, isValidating } = useSWR(
    !!token
      ? [
          "/eneSardTulukhJagsaaltAvya",
          token,
          ognoo,
          khuudaslalt,
          davkhar,
          barilgiinId || mbarilgiinId,
          ilgeekhTurul,
          olnoorSaraarEsekh,
          _id,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setNekhemjlelKhuudaslalt,
    nekhemjlel: data,
    nekhemjlelMutate: mutate,
    isValidating,
  };
}

export default useNekhemjlekh;
