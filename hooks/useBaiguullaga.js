import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, baiguullagiinId) =>
  axios(token)
    .get(`${url}/${baiguullagiinId}`)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useBaiguullaga(token, baiguullagiinId) {
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? ["/baiguullaga", token, baiguullagiinId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return { baiguullaga: data, baiguullagaMutate: mutate };
}

export default useBaiguullaga;
