import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";
import { useAuth } from "services/auth";

const fetcher = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  query,
  order
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          ...query,
        },
        order,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useSurveyJagsaalt(token, baiguullagiinId, query, order) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setSurveyKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/survey", token, khuudaslalt, query, order]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setSurveyKhuudaslalt,
    surveyGaralt: data,
    surveyMutate: mutate,
  };
}
export default useSurveyJagsaalt;
