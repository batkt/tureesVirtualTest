import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = async (
  url,
  token,
  query,
  barilgiinId,
  davkhar,
  khuudaslalt,
  tuluv
) => {
  const { search, ...rest } = khuudaslalt;

  const body = {
    barilgiinId,
    davkhar,
    idevkhiteiEsekh: tuluv,
    ...rest,
  };

  if (search && search.trim() !== "") {
    body.query = {
      $or: [
        { ner: { $regex: search, $options: "i" } },
        { register: { $regex: search, $options: "i" } },
        { utas: { $regex: search, $options: "i" } },
      ],
      ...query,
    };
  } else if (query) {
    body.query = query;
  }

  try {
    const res = await axios(token).post(url, body);
    return res.data;
  } catch (err) {
    aldaaBarigch(err);
    return null;
  }
};

function useKhariltsagchDavkhraarAvya(token, query, davkhar, tuluv) {
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
          tuluv,
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
