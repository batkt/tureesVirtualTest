import { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import axios from "axios";

const uilchilgee = (token) => {
  const headers = {
    "Content-type": "application/json",
  };
  if (!!token) headers["Authorization"] = `bearer ${token}`;
  return axios.create({
    baseURL: "https://zevtabs.mn/api",
    headers,
  });
};

const fetcher = (url, token, id) =>
  uilchilgee(token)
    .get(`${url}/${id}`)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useZaavar(token, id) {
  const { data, mutate } = useSWR(
    !!token && !!id ? ["/tsonkhniiMedeelel", token, id] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    tsonkh: data,
    tsonkhMutate: mutate,
  };
}

export default useZaavar;
