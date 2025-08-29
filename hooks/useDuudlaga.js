"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useSWR from "swr";
import uilchilgee, { aldaaBarigch, socket } from "services/uilchilgee";
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
  const socketRef = useRef(null);
  const roomNameRef = useRef(null);

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
    shouldFetch
      ? ["/appWebDuudlaga", baiguullagiinId, khuudaslalt, order]
      : null,
    ([url, id, khuudaslalt, order]) =>
      fetcher(url + id, token, { ...requestBody, ...khuudaslalt, order }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 0,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      dedupingInterval: 1000, // Reduced from 2000ms
    }
  );

  // Socket setup with proper cleanup
  useEffect(() => {
    if (!shouldFetch || !baiguullagiinId) return;

    const roomName = "appWebDuudlaga" + baiguullagiinId;
    roomNameRef.current = roomName;

    // Use singleton socket instance
    if (!socketRef.current) {
      socketRef.current = socket();
    }

    const socketInstance = socketRef.current;

    console.log("=== DUUDLAGA SOCKET SETUP ===");
    console.log("baiguullagiinId:", baiguullagiinId);
    console.log("roomName:", roomName);
    console.log("Socket ID:", socketInstance.id);
    console.log("==============================");

    const handleDuudlagaUpdate = (data) => {
      console.log("Socket event received:", data);

      // More lenient condition for updates
      if (
        !data ||
        !data.baiguullagiinId ||
        data.baiguullagiinId === baiguullagiinId
      ) {
        console.log("Triggering data refresh...");

        // Use bound mutate with revalidate: true
        mutate(undefined, { revalidate: true });
      }
    };

    const handleSocketConnect = () => {
      console.log("Socket connected, joining room:", roomName);
      socketInstance.emit("join", roomName);
    };

    const handleSocketDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
    };

    const handleConnectError = (err) => {
      console.error("Socket connection error:", err);
    };

    // Join room immediately if already connected
    if (socketInstance.connected) {
      socketInstance.emit("join", roomName);
      console.log("Immediately joined room:", roomName);
    }

    // Set up event listeners
    const events = [
      "newDuudlaga",
      "duudlagaStatusChanged",
      "duudlagaUpdated",
      "duudlagaDeleted",
      "duudlagaCreated",
    ];

    events.forEach((event) => {
      socketInstance.on(event, handleDuudlagaUpdate);
    });

    // Connection management listeners
    socketInstance.on("connect", handleSocketConnect);
    socketInstance.on("disconnect", handleSocketDisconnect);
    socketInstance.on("connect_error", handleConnectError);

    // Cleanup function
    return () => {
      console.log("Cleaning up socket listeners for room:", roomName);

      // Remove event listeners
      events.forEach((event) => {
        socketInstance.off(event, handleDuudlagaUpdate);
      });

      socketInstance.off("connect", handleSocketConnect);
      socketInstance.off("disconnect", handleSocketDisconnect);
      socketInstance.off("connect_error", handleConnectError);

      // Leave room
      if (socketInstance.connected) {
        socketInstance.emit("leave", roomName);
        console.log("Left room:", roomName);
      }
    };
  }, [shouldFetch, baiguullagiinId, mutate]);

  // Separate effect for search/pagination changes
  useEffect(() => {
    if (shouldFetch) {
      // Debounce the mutation for search
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

        // Force immediate refresh without debounce
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

        // Force refresh
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

        // Remove optimistic update and just force refresh
        await mutate(undefined, { revalidate: true });

        return result.data;
      } catch (err) {
        console.error("Error updating duudlaga status:", err);
        aldaaBarigch(err);
        // Still refresh on error to ensure consistency
        mutate(undefined, { revalidate: true });
        throw err;
      }
    },
    [token, mutate]
  );

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
