import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token, query, barilgiinId, davkhar) =>
  axios(token)
    .post(url, {
      barilgiinId,
      davkhar,
      query: {
        ...query,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useKhariltsagchDavkhraarAvya(token, query, davkhar) {
  const { barilgiinId } = useAuth();
  const { data } = useSWR(
    !!token
      ? ["khariltsagchDavkhraarAvya", token, query, barilgiinId, davkhar]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    jagsaalt: data,
  };
}
export default useKhariltsagchDavkhraarAvya;
