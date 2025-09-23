import { useState } from "react";
import { useAuth } from "services/auth";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  baiguullagiinId,
  { search, ...khuudaslalt },
  barilgiinId,
  query,
  order
) =>
  axios(token)
    .get(url, {
      params: {
        order: order,
        query: {
          baiguullagiinId,
          barilgiinId,
          zochinUrikhEsekh: true,
          $or: [
            { ner: { $regex: search, $options: "i" } },
            { register: { $regex: search, $options: "i" } },
            { customerTin: { $regex: search, $options: "i" } },
            { utas: { $regex: search, $options: "i" } },
          ],
          ...query,
        },
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

const fetcherToololt = (url, token, barilgiinId) =>
  axios(token)
    .get(`${url}/${barilgiinId}`)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useZochin(token, baiguullagiinId, khuudasniiKhemjee, query, order) {
  const { barilgiinId } = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 10,
    search: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const { data, mutate, isValidating } = useSWR(
    !!token && !!baiguullagiinId && !!barilgiinId
      ? [
          "khariltsagch",
          token,
          baiguullagiinId,
          khuudaslalt,
          barilgiinId,
          query,
          order,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Машины дугаар давхцал шалгах функц
  const checkMachineNumberExists = async (mashiniiDugaar, excludeId = null) => {
    if (!token || !baiguullagiinId || !barilgiinId) {
      return false;
    }

    try {
      const query = {
        baiguullagiinId,
        barilgiinId,
        mashiniiDugaar,
        tuluv: { $nin: [-1] },
      };

      if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const response = await axios(token).get("/khariltsagch", {
        params: {
          query,
          khuudasniiKhemjee: 1,
        },
      });

      return response.data?.jagsaalt?.length > 0;
    } catch (error) {
      return false;
    }
  };

  const zochinHadgalya = async (zochinMedeelel) => {
    if (!token || !baiguullagiinId) {
      throw new Error("Шаардлагатай параметрүүд дутуу байна");
    }

    setIsLoading(true);

    try {
      const {
        _id,
        mashiniiDugaar,
        ezemshigchiinUtas,
        tukhainBaaziinKholbolt,
        khariltsagchMedeelel,
        mashinMedeelel,
        ...busadMedeelel
      } = zochinMedeelel;

      if (!mashiniiDugaar || !ezemshigchiinUtas) {
        throw new Error(
          "Машины дугаар болон эзэмшигчийн утас заавал шаардлагатай"
        );
      }

      // Машины дугаар давхцал шалгах (зөвхөн машины дугаар байгаа тохиолдолд)
      // _id байгаа бол засварлаж байгаа гэсэн үг, тухайн бичлэгийг хасаж шалгана
      if (mashiniiDugaar && !mashiniiDugaar.startsWith("TEMP_")) {
        const machineExists = await checkMachineNumberExists(
          mashiniiDugaar,
          _id
        );
        if (machineExists) {
          throw new Error("Энэ дугаартай машин аль хэдийн бүртгэгдсэн байна");
        }
      }

      const requestData = {
        mashiniiDugaar,
        baiguullagiinId,
        barilgiinId,
        ezemshigchiinUtas,
        tukhainBaaziinKholbolt: tukhainBaaziinKholbolt || null,
        khariltsagchMedeelel: khariltsagchMedeelel || null,
        mashinMedeelel: mashinMedeelel || null,
        ...busadMedeelel,
      };

      const response = await axios(token).post("/zochinHadgalya", requestData);

      await mutate();
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const khariltsagchHadgalya = async (
    khariltsagchMedeelel,
    ezemshigchiinUtas,
    tukhainBaaziinKholbolt = null
  ) => {
    const zochinMedeelel = {
      mashiniiDugaar: "TEMP_" + Date.now(),
      ezemshigchiinUtas,
      tukhainBaaziinKholbolt,
      khariltsagchMedeelel,
      mashinMedeelel: null,
    };

    return await zochinHadgalya(zochinMedeelel);
  };

  const mashinHadgalya = async (
    mashinMedeelel,
    tukhainBaaziinKholbolt = null
  ) => {
    if (!mashinMedeelel.dugaar || !mashinMedeelel.ezemshigchiinUtas) {
      throw new Error(
        "Машины дугаар болон эзэмшигчийн утас заавал шаардлагатай"
      );
    }

    // Машины дугаар давхцал шалгах (шинэ бүртгэлд зориулсан)
    // Хэрэв засварлаж байгаа бол zochinHadgalya функцийг ашиглана уу
    const machineExists = await checkMachineNumberExists(mashinMedeelel.dugaar);
    if (machineExists) {
      throw new Error("Энэ дугаартай машин аль хэдийн бүртгэгдсэн байна");
    }

    const zochinMedeelel = {
      mashiniiDugaar: mashinMedeelel.dugaar,
      ezemshigchiinUtas: mashinMedeelel.ezemshigchiinUtas,
      tukhainBaaziinKholbolt,
      khariltsagchMedeelel: null,
      mashinMedeelel,
    };

    return await zochinHadgalya(zochinMedeelel);
  };

  return {
    setZochinKhuudaslalt: setKhuudaslalt,
    zochinGaralt: data,
    zochinMutate: mutate,
    isValidating,
    zochinHadgalya,
    khariltsagchHadgalya,
    mashinHadgalya,
    checkMachineNumberExists,
    isLoading,
  };
}

export function useZochinToololt(token) {
  const { barilgiinId } = useAuth();
  const { data, mutate, isValidating } = useSWR(
    token ? ["/khariltsagchiinTooAvya", token, barilgiinId] : null,
    fetcherToololt,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    khariltsagchToololt: data,
    khariltsagchToololtMutate: mutate,
    isValidating,
  };
}

export { useZochin };
export default useZochin;
