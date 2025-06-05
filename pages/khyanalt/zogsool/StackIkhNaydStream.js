import axios from "axios";
import R2WPlayerComponent from "components/streamPlayer";
import React, { useEffect, useState } from "react";
import uilchilgee from "services/uilchilgee";

function StackIkhNaydStream({ barilgiinId, token }) {
  const [cameraIps, setCameraIps] = useState([]);

  useEffect(() => {
    uilchilgee(token)
      .get("https://turees.zevtabs.mn/api/zogsooliinIpAvaya/" + barilgiinId)
      .then(function (response) {
        if (!!response) setCameraIps(response?.data?.ip);
      })
      .catch((err) => { });
  }, []);


  return (
    <div className="grid md:grid-cols-2">
      {cameraIps?.map((mur, index) => {
        return (
          <div key={index} className="border">
            <div className="h-[200px] w-[300px] sm:h-[300px] sm:w-[400px] xl:h-[400px] xl:w-[600px]">
              <R2WPlayerComponent
                // Camer={mur}
                // PASSWD={"123456"}
                // USER={"admin"}
                // ROOT={"stream"}
                // PORT={554}
                // nemelteer={true}
                Camer={camerVal[1]}
                PASSWD={parkingJagsaalt?.[0]?.tokhirgoo?.PASSWD}
                PORT={parkingJagsaalt?.[0]?.tokhirgoo?.PORT}
                ROOT={parkingJagsaalt?.[0]?.tokhirgoo?.ROOT}
                USER={parkingJagsaalt?.[0]?.tokhirgoo?.USER}
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
