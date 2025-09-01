"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { parseCookies } from "nookies";
import updateMethod from "tools/function/crud/updateMethod";

const fetcher = async (url, token, params) => {
  try {
    const res = await uilchilgee(token).post(url, params);
    return res.data;
  } catch (e) {
    aldaaBarigch(e);
    return { jagsaalt: [] };
  }
};

function useDuudlaga(baiguullagiinId, query = {}, order = {}, searchKeys = []) {
  const cookieData = parseCookies();
  const token = cookieData.tureestoken;

  const [khuudaslalt, setDuudlagaKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 500,
    search: "",
    jagsaalt: [],
    tailbar: "",
  });

  const requestBody = {
    baiguullagiinId,
    ...query,
    tailbar: "",
    ...(searchKeys.length > 0 &&
      khuudaslalt.search.trim() && {
        $or: searchKeys.map((key) => ({
          [key]: { $regex: khuudaslalt.search, $options: "i" },
        })),
      }),
  };

  const shouldFetch = token && baiguullagiinId;

  const { data, mutate, isValidating } = useSWR(
    shouldFetch ? ["/sonorduulga", baiguullagiinId, khuudaslalt, order] : null,
    ([url, id, khuudaslalt, order]) =>
      fetcher(url + id, token, { ...requestBody, ...khuudaslalt, order }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 0,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      dedupingInterval: 1000,
    }
  );

  useEffect(() => {
    if (shouldFetch) {
      const timeoutId = setTimeout(() => {
        mutate();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [khuudaslalt.search, khuudaslalt.khuudasniiDugaar, shouldFetch, mutate]);

  const sendDuudlaga = useCallback(
    async (duudlagaData) => {
      if (
        !duudlagaData.khariltsagchiinNer ||
        !duudlagaData.khariltsagchiinUtas
      ) {
        throw new Error("User information (name, phone) is required");
      }

      const payload = {
        baiguullagiinId: duudlagaData.baiguullagiinId,
        khariltsagchiinId: duudlagaData.khariltsagchiinId,
        barilgiinId: duudlagaData.barilgiinId || "",
        title: duudlagaData.title,
        message: duudlagaData.message,
        duudlagiinTurul: duudlagaData.duudlagiinTurul,
        khariltsagchiinNer: duudlagaData.khariltsagchiinNer,
        khariltsagchiinUtas: duudlagaData.khariltsagchiinUtas,
        khariltsagchiinGereeniiDugaar:
          duudlagaData.khariltsagchiinGereeniiDugaar,
        khariltsagchiinTalbainDugaar: duudlagaData.khariltsagchiinTalbainDugaar,
        khariltsagchiinRegister: duudlagaData.khariltsagchiinRegister || "",
        tukhainBaaziinKholbolt:
          duudlagaData.tukhainBaaziinKholbolt || "default",
      };

      try {
        const result = await uilchilgee(token).post("/sonorduulga", payload);
        await mutate(undefined, { revalidate: true });
        return result.data;
      } catch (error) {
        console.error("Error sending duudlaga:", error);
        aldaaBarigch(error);
        throw error;
      }
    },
    [token, mutate]
  );

  const updateDuudlaga = useCallback(
    async (duudlagaId, updateData) => {
      try {
        const result = await updateMethod("sonorduulga", token, {
          _id: duudlagaId,
          ...updateData,
        });
        await mutate(undefined, { revalidate: true });
        return result.data;
      } catch (error) {
        console.error("Error updating duudlaga:", error);
        throw error;
      }
    },
    [token, mutate]
  );

  const updateDuudlagaStatus = useCallback(
    async (duudlagaId, newStatus, reason) => {
      try {
        const updateData = {
          tuluv: newStatus,
          updatedAt: new Date().toISOString(),
          ...(reason && { tailbar: reason }),
        };

        const result = await updateMethod("sonorduulga", token, {
          _id: duudlagaId,
          ...updateData,
        });

        await mutate(undefined, { revalidate: true });
        return result.data;
      } catch (err) {
        console.error("Error updating duudlaga status:", err);
        aldaaBarigch(err);
        mutate(undefined, { revalidate: true });
        throw err;
      }
    },
    [token, mutate]
  );
  const duudlagaMutate = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    setDuudlagaKhuudaslalt,
    duudlagaGaralt: data,
    duudlagaMutate: mutate,
    isValidating,
    isLoading: !data && shouldFetch,
    sendDuudlaga,
    updateDuudlaga,
    updateDuudlagaStatus,
  };
}

export default useDuudlaga;
