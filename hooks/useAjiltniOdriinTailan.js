import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
const fetcher = (
  url,
  token,
  barilgiinId,
  duusakhOgnoo,
  ekhlekhOgnoo,
  garsanKhaalga,
  baiguullagiinId,
  query
) => {
  return axios(token)
    .post(url, {
      barilgiinId,
      ekhlekhOgnoo,
      duusakhOgnoo,
      garsanKhaalga: garsanKhaalga,
      baiguullagiinId,
      ...query,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useAjiltniOdriinTailan(
  token,
  barilgiinId,
  duusakhOgnoo,
  ekhlekhOgnoo,
  garsanKhaalga,
  baiguullagiinId,
  query
) {
  const shouldFetch =
    !!token &&
    !!barilgiinId &&
    !!ekhlekhOgnoo &&
    !!garsanKhaalga &&
    !!baiguullagiinId;

  const { data, mutate, isValidating } = useSWR(
    shouldFetch
      ? [
          "/zogsooliinUdriinTailanAvya",
          token,
          barilgiinId,
          duusakhOgnoo,
          ekhlekhOgnoo,
          garsanKhaalga,
          baiguullagiinId,
          query,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    zogsoolTulburMedeelel: data,
    zogsoolTulburMedeelelMutate: mutate,
    zogsooliinUdriinTailanUnshijBaina: isValidating,
  };
}

export default useAjiltniOdriinTailan;
