import _ from "lodash";
import React, { useEffect, useRef } from "react";
import GuilgeeniiTuukh from "./GuilgeeniiTuukh";

function Khuulga({ data, token, ognoo, onFinish, destroy }, ref) {
  const refTuukh = useRef(null);

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish);
        destroy();
      },
      khevlekh() {
        refTuukh.current.khevlekh();
      },
    }),
    [refTuukh]
  );

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <div className="flex h-[76vh] flex-col space-y-2 overflow-y-auto">
      <GuilgeeniiTuukh
        ref={refTuukh}
        data={data}
        token={token}
        ognoo={ognoo}
        refreshData={onFinish}
      />
    </div>
  );
}

export default React.forwardRef(Khuulga);
