import React, { useEffect, useRef, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

function Stream1({ ip }) {
  const ws = useRef(null);
  const [onOpen, setOnOpen] = useState(false);
  useEffect(() => {
    if (!!ip) {
      const url =
        ip === "192.168.1.54"
          ? `ws://192.168.1.54:9080/ws?token=db1f2387-766d-29b5-41d2-43dbea5bd7fc&channel=1`
          : "ws://192.168.1.57:9080/ws?token=d8142256-e92f-57fe-60e4-2aa83de7832c&channel=1";
      try {
        ws.current = new WebSocket(url);
        ws.current.binaryType = "arraybuffer";
        ws.current.onopen = () => {
          console.log("WebSocket kholbolt amjilttai");
          setOnOpen(true);
        };
        ws.current.onclose = () => {
          console.log("WebSocket kholbolt amjiltgui bolloo");
        };
      } catch (e) {
        console.log(e.message);
      }
    } else {
      if (ws.current) {
        ws.current.close();
      }
      setOnOpen(false);
    }
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [ip]);

  useEffect(() => {
    if (onOpen) {
      // console.log('464666545646111111', onOpen);
      ws.current.onmessage = async (event) => {
        const imageData = event.data;
        const canvas = document.getElementById("canvas1");
        const ctx = canvas.getContext("2d");
        const imgWidth = 650;
        const imgHeight = 450;
        try {
          const blob = new Blob([imageData]);
          const imageBitmap = await createImageBitmap(blob);
          ctx.drawImage(imageBitmap, 0, 0, imgWidth, imgHeight);
        } catch (error) {
          console.error("Error decoding image:", error);
        }
      };
    } else {
      if (!!ws.current?.onmessage) ws.current.onmessage = null;
    }
    return () => {
      if (!!ws.current?.onmessage) ws.current.onmessage = null;
    };
  }, [onOpen]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <canvas id="canvas1" width="650" height="450" />
    </div>
  );
}

export function Stream2({ ip }) {
  const ws2 = useRef(null);
  const [onOpen, setOnOpen] = useState(false);

  useEffect(() => {
    if (!!ip) {
      const url =
        ip === "192.168.1.56"
          ? `ws://${ip}:9080/ws`
          : "ws://192.168.1.55:9080/ws?token=b6aafed0-35b1-7a98-97b5-e7a797fe9b4a&channel=1";
      // console.log('url111', url);
      try {
        ws2.current = new WebSocket(url);
        ws2.current.binaryType = "arraybuffer";
        ws2.current.onopen = () => {
          console.log("WebSocket kholbolt amjilttai");
          setOnOpen(true);
        };
        ws2.current.onclose = () => {
          console.log("WebSocket kholbolt amjiltgui bolloo");
        };
      } catch (e) {
        console.log(e.message);
      }
    } else {
      if (ws2.current) {
        ws2.current.close();
      }
      setOnOpen(false);
    }
    return () => {
      if (ws2.current) {
        ws2.current.close();
      }
    };
  }, [ip]);

  useEffect(() => {
    if (onOpen) {
      ws2.current.onmessage = async (event) => {
        const imageData = event.data;
        const canvas = document.getElementById("canvas2");
        const ctx = canvas.getContext("2d");
        const imgWidth = 650;
        const imgHeight = 450;
        try {
          const blob = new Blob([imageData]);
          const imageBitmap = await createImageBitmap(blob);
          ctx.drawImage(imageBitmap, 0, 0, imgWidth, imgHeight);
        } catch (error) {
          console.error("Error decoding image:", error);
        }
      };
    } else {
      if (!!ws2.current?.onmessage) ws2.current.onmessage = null;
    }
    return () => {
      if (!!ws2.current?.onmessage) ws2.current.onmessage = null;
    };
  }, [onOpen]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <canvas id="canvas2" width="650" height="450" />
    </div>
  );
}

export function SocketStream({ ip, PORT, TOKEN, CHANNEL }) {
  const ws2 = useRef(null);
  const [onOpen, setOnOpen] = useState(false);

  useEffect(() => {
    if (!!ip) {
      const url = `ws://${ip}:${PORT}/ws?token=${TOKEN}&channel=${CHANNEL}`;
      try {
        ws2.current = new WebSocket(url);
        ws2.current.binaryType = "arraybuffer";
        ws2.current.onopen = () => {
          console.log("WebSocket kholbolt amjilttai");
          setOnOpen(true);
        };
        ws2.current.onclose = () => {
          console.log("WebSocket kholbolt amjiltgui bolloo");
        };
      } catch (e) {
        console.log(e.message);
      }
    } else {
      if (ws2.current) {
        ws2.current.close();
      }
      setOnOpen(false);
    }
    return () => {
      if (ws2.current) {
        ws2.current.close();
      }
    };
  }, [ip]);

  useEffect(() => {
    if (onOpen) {
      ws2.current.onmessage = async (event) => {
        const imageData = event.data;
        const canvas = document.getElementById("canvas2");
        const ctx = canvas.getContext("2d");
        const imgWidth = 650;
        const imgHeight = 450;
        try {
          const blob = new Blob([imageData]);
          const imageBitmap = await createImageBitmap(blob);
          ctx.drawImage(imageBitmap, 0, 0, imgWidth, imgHeight);
        } catch (error) {
          console.error("Error decoding image:", error);
        }
      };
    } else {
      if (!!ws2.current?.onmessage) ws2.current.onmessage = null;
    }
    return () => {
      if (!!ws2.current?.onmessage) ws2.current.onmessage = null;
    };
  }, [onOpen]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <canvas id="canvas2" width="650" height="450" />
    </div>
  );
}

export default Stream1;
