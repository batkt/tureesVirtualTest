import React, { useState, useEffect, useMemo } from "react";
import { R2WPlayer } from "./R2WPlayer.min";

function R2WPlayerComponent({ Camer, USER, PASSWD, nemelteer, PORT, ROOT }) {
  var reset = false;
  var umnukhUtga = false;
  const rtspUrl = useMemo(() => {
    if (USER && PASSWD) {
      return `rtsp://${USER}:${PASSWD}@${Camer}:${PORT}/${ROOT}`;
    } else {
      return `rtsp://${Camer}:${PORT}/${ROOT}`;
    }
  }, [Camer, USER, PASSWD, PORT, ROOT]);

  const [player, setPlayer] = useState(null);

  useEffect(() => {
    umnukhUtga = reset;
    const newPlayer = new R2WPlayer({
      serverPath: "http://127.0.0.1:8083",
      containerId: `videoContainer${Camer}`,
      crossOriginIsolated: true,
      logEnabled: true,
      onconnectionstatechange: (state) => {
        console.log("tuluv:", state);
        if (state == "failed") {
          this.reset = !this.umnukhUtga;
        }
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
  }, [Camer, reset]);

  useEffect(() => {
    if (Camer && player) {
      player.play(rtspUrl);
    }
  }, [Camer, player]);

  return <div id={`videoContainer${Camer}`} className="h-full w-full"></div>;
}

export default R2WPlayerComponent;
