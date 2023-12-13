import React, { useState, useEffect, useMemo } from "react";
import { R2WPlayer } from "./R2WPlayer.min";

function R2WPlayerComponent({ Camer, USER, PASSWD, nemelteer, PORT, ROOT }) {
  const rtspUrl = useMemo(() => {
    return `rtsp://${USER}:${PASSWD}@${Camer}:${PORT}/${ROOT}`;
  }, [Camer, USER, PASSWD, PORT, ROOT]);

  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (player) {
      player.destroy();
    }
    const newPlayer = new R2WPlayer({
      serverPath: "http://127.0.0.1:8083",
      containerId: `videoContainer${Camer}`,
      crossOriginIsolated: true,
      logEnabled: true,
      onconnectionstatechange: (state) => {
        console.log("tuluv:", state);
      },
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
  }, [Camer, nemelteer]);

  useEffect(() => {
    if (Camer && player) {
      player.play(rtspUrl);
    }
  }, [Camer, player, rtspUrl]);

  return <div id={`videoContainer${Camer}`} className="h-full w-full"></div>;
}

export default R2WPlayerComponent;
