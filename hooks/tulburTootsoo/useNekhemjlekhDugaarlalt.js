import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token) =>
  axios(token)
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useNekhemjlekhDugaarlalt(token) {
  const { data, mutate } = useSWR(
    !!token ? ["/nekhemjlekhiinDugaarlaltAvya", token] : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  function dugaarlaltKhadgalya(dugaar, callback) {
    axios(token)
      .post("/nekhemjlekhiinDugaarlaltKhadgalya", { dugaar })
      .then(callback);
  }

  return {
    dugaarlalt: data,
    dugaarlaltMutate: mutate,
    dugaarlaltKhadgalya,
  };
}

export default useNekhemjlekhDugaarlalt;
