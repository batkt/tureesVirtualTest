import React, { useState, useEffect, useMemo, useCallback } from "react";
import { R2WPlayer } from "./R2WPlayer.min";

function R2WPlayerComponent({ Camer, USER, PASSWD, nemelteer, PORT, ROOT }) {
  const [reset, setReset] = useState(false);
  const [connectionState, setConnectionState] = useState("connecting");

  const rtspUrl = useMemo(() => {
    if (USER && PASSWD) {
      return `rtsp://${USER}:${PASSWD}@${Camer}:${PORT}/${ROOT}`;
    } else {
      return `rtsp://${Camer}:${PORT}/${ROOT}`;
    }
  }, [Camer, USER, PASSWD, PORT, ROOT]);

  const [player, setPlayer] = useState(null);

  const conntectionSetlekh = useCallback((state) => {
    setConnectionState(state);
  }, []);

  useEffect(() => {
    const newPlayer = new R2WPlayer({
      serverPath: window.location.origin + "/stream",
      containerId: `videoContainer${Camer}`,
      crossOriginIsolated: true,
      logEnabled: true,
      onconnectionstatechange: conntectionSetlekh,

      // onconnectionstatechange: (state) => {
      //   // if (state === "failed") {
      //   //   setReset(true);
      //   // }
      // },
      style: {
        controls: nemelteer ? true : false,
      },
    });

    setPlayer(newPlayer);

    return () => {
      if (newPlayer) {
        newPlayer.destroy();
      }
    };
  }, [Camer, reset]);

  useEffect(() => {
    if (Camer && player) {
      player.play(rtspUrl);
    }
  }, [Camer, player, rtspUrl]);

  useEffect(() => {
    if (reset && player) {
      player.reset();
      //setReset(false);
    }
  }, [reset, player]);

  useEffect(() => {
    let retryTimeout;
    if (connectionState === "failed") {
      retryTimeout = setTimeout(() => {
        if (player) {
          player.play(rtspUrl);
        }
      }, 2000);
    }

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [connectionState, player, rtspUrl]);

  return <div id={`videoContainer${Camer}`} className="h-full w-full"></div>;
}

export default R2WPlayerComponent;
