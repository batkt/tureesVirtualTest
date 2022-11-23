import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  query,
  barilgiinId,
  davkhar,
  { search, ...khuudaslalt }
) =>
  axios(token)
    .post(url, {
      barilgiinId,
      davkhar,
      query: {
        $or: [
          { ner: { $regex: search, $options: "i" } },
          { register: { $regex: search, $options: "i" } },
          { utas: { $regex: search, $options: "i" } },
        ],
        ...query,
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useKhariltsagchDavkhraarAvya(token, query, davkhar) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    search: "",
  });
  const { data } = useSWR(
    !!token
      ? [
          "khariltsagchDavkhraarAvya",
          token,
          query,
          barilgiinId,
          davkhar,
          khuudaslalt,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setKhariltsagchKhuudaslalt: setKhuudaslalt,
    jagsaalt: data,
  };
}
export default useKhariltsagchDavkhraarAvya;
