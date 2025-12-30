import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const searchGenerator = (search, fields) => {
  if (!!search && !!fields)
    return {
      $or: fields.map((key) => ({ [key]: { $regex: search, $options: "i" } })),
    };
  else return {};
};

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

  body.query = {
    ...searchGenerator(search, ["ner", "register", "utas"]),
    ...query,
  };

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
