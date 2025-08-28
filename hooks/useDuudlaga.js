"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useSWR from "swr";
import uilchilgee, { aldaaBarigch, socket } from "services/uilchilgee";
import { useAuth } from "services/auth";

let globalSocket = null;
const activeRooms = new Set();
const socketRefCount = new Map();

function searchGenerator(keys, search) {
  if (keys.length > 0 && search.trim()) {
    return keys.map((key) => ({ [key]: { $regex: search, $options: "i" } }));
  }
  return undefined;
}

const fetcher = async (url, token, params) => {
  try {
    const res = await uilchilgee(token).post(url, params);
    return res.data;
  } catch (e) {
    aldaaBarigch(e);
    return { jagsaalt: [] };
  }
};

function useDuudlaga(
  token,
  baiguullagiinId,
  query = {},
  order = {},
  searchKeys = []
) {
  const { barilgiinId } = useAuth();
  const socketInitialized = useRef(false);
  const currentRoomName = useRef(null);

  const [khuudaslalt, setDuudlagaKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 500,
    search: "",
    jagsaalt: [],
    tailbar: "",
  });

  const requestBody = {
    baiguullagiinId,
    barilgiinId,
    ...query,
    tailbar: "",
    $or: searchGenerator(searchKeys, khuudaslalt.search),
  };

  const shouldFetch = token && baiguullagiinId;

  const { data, mutate, isValidating } = useSWR(
    shouldFetch ? ["/appWebDuudlaga" + baiguullagiinId] : null,
    (url) => fetcher(url, token, { ...requestBody, ...khuudaslalt, order }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  const initializeSocket = useCallback(() => {
    if (!globalSocket) {
      console.log("Initializing new socket connection");
      globalSocket = socket();

      globalSocket.on("connect", () => {
        console.log("Socket connected");

        activeRooms.forEach((room) => {
          globalSocket.emit("join", room);
          console.log(`Rejoined room: ${room}`);
        });
      });

      globalSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      globalSocket.on("reconnect", () => {
        console.log("Socket reconnected");

        activeRooms.forEach((room) => {
          globalSocket.emit("join", room);
          console.log(`Rejoined room: ${room}`);
        });
      });

      globalSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    }
    return globalSocket;
  }, []);

  const handleSocketEvent = useCallback(
    (eventType, payload) => {
      console.log(`Socket event received [${eventType}]:`, payload);
      mutate();
    },
    [mutate]
  );

  useEffect(() => {
    if (!shouldFetch || socketInitialized.current) return;

    const roomName = "appWebDuudlaga" + baiguullagiinId;
    currentRoomName.current = roomName;

    console.log("=== SOCKET DEBUG INFO ===");
    console.log("baiguullagiinId:", baiguullagiinId);
    console.log("roomName:", roomName);
    console.log("========================");

    const socketInstance = initializeSocket();

    socketRefCount.set(roomName, (socketRefCount.get(roomName) || 0) + 1);

    const joinRoom = () => {
      if (!activeRooms.has(roomName)) {
        socketInstance.emit("join", roomName);
        activeRooms.add(roomName);
        console.log(`Joined room: ${roomName}`);
      }
    };

    if (socketInstance.connected) {
      joinRoom();
    } else {
      socketInstance.once("connect", joinRoom);
    }

    const events = [
      roomName,
      "newDuudlaga",
      "duudlagaStatusChanged",
      "duudlagaUpdated",
      "duudlagaDeleted",
      "duudlagaCreated",
    ];

    const eventHandlers = events.map((event) => ({
      event,
      handler: (payload) => handleSocketEvent(event, payload),
    }));

    eventHandlers.forEach(({ event, handler }) => {
      socketInstance.on(event, handler);
    });

    socketInitialized.current = true;

    return () => {
      if (socketInstance && currentRoomName.current) {
        const room = currentRoomName.current;

        eventHandlers.forEach(({ event, handler }) => {
          socketInstance.off(event, handler);
        });

        const refCount = socketRefCount.get(room) || 0;
        if (refCount <= 1) {
          socketRefCount.delete(room);
          activeRooms.delete(room);
          if (socketInstance.connected) {
            socketInstance.emit("leave", room);
            console.log(`Left room: ${room}`);
          }
        } else {
          socketRefCount.set(room, refCount - 1);
        }

        if (activeRooms.size === 0 && globalSocket) {
          console.log("Disconnecting global socket - no active rooms");
          globalSocket.disconnect();
          globalSocket = null;
        }
      }
    };
  }, [shouldFetch, baiguullagiinId, handleSocketEvent, initializeSocket]);

  useEffect(() => {
    if (shouldFetch) {
      mutate();
    }
  }, [khuudaslalt, shouldFetch, mutate]);

  return {
    setDuudlagaKhuudaslalt,
    duudlagaGaralt: data,
    duudlagaMutate: mutate,
    isValidating,
  };
}

export default useDuudlaga;
