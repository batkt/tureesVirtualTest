import React, { useState, useEffect } from "react";
import { R2WPlayer } from "./R2WPlayer.min";

function R2WPlayerComponent({ Camer, USER, PASSWD }) {
  const [rtspUrl, setRtspUrl] = useState(
    `rtsp://${USER}:${PASSWD}@${Camer}:554/stream`
  );
  console.log("url", rtspUrl);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const newPlayer = new R2WPlayer({
      serverPath: "http://127.0.0.1:8083",
      containerId: "videoContainer",
      logEnabled: true,
      style: {
        controls: true,
      },
      onconnectionstatechange: (state) => {
        console.log("tuluv:", state);
      },
    });

    setPlayer(newPlayer);

    return () => {
      if (newPlayer) {
        newPlayer.destroy();
      }
    };
  }, []);

  const play = () => {
    if (player) {
      player.play(rtspUrl);
    }
  };

  const destroy = () => {
    if (player) {
      player.destroy();
    }
  };

  const handleInputChange = (e) => {
    setRtspUrl(e.target.value);
  };

  return (
    <div>
      <div
        id="videoContainer"
        style={{ border: "0", width: "100%", height: "100%" }}
      ></div>
      <br />
      <input
        type="text"
        id="rtspUrl"
        value={rtspUrl}
        style={{ width: "704px" }}
        onChange={handleInputChange}
      />
      <br />
      <input
        type="button"
        value="Тоглуулах"
        style={{ width: "100px" }}
        onClick={play}
      />
      &nbsp;&nbsp;
      <input
        type="button"
        value="Цуцлах"
        style={{ width: "100px" }}
        onClick={destroy}
      />
    </div>
  );
}

export default R2WPlayerComponent;
