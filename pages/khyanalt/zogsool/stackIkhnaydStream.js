import axios from "axios";
import R2WPlayerComponent from "components/streamPlayer";
import React, { useEffect, useState } from "react";

function StackIkhNaydStream({ barilgiinId }) {
  const [cameraIps, setCameraIps] = useState([]);

  useEffect(() => {
    axios
      .get("https://turees.zevtabs.mn/api/zogsooliinIpAvaya/" + barilgiinId)
      .then(function (response) {
        if (!!response) setCameraIps(response?.data?.ip);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log("cameraIps", cameraIps);

  return (
    <div className="grid md:grid-cols-2">
      {cameraIps?.map((mur, index) => {
        console.log("mur", mur);
        return (
          <div key={index} className="border">
            <div className="h-[200px] w-[300px] sm:h-[300px] sm:w-[400px] xl:h-[400px] xl:w-[600px]">
              <R2WPlayerComponent
                Camer={mur}
                PASSWD={"123456"}
                USER={"admin"}
                nemelteer={true}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StackIkhNaydStream;
