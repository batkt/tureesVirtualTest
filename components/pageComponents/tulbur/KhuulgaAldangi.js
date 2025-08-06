import _ from "lodash";
import React, { useEffect, useRef } from "react";
import GuilgeeniiTuukhAldangi from "./GuilgeeniiTuukhAldangi";

function KhuulgaAldangi(
  { data, token, ognoo, onFinish, destroy, ajiltan, barilgiinId, shineOgnoo },
  ref
) {
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
      excelTatakh() {
        refTuukh.current.excelTatakh();
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
    <div className="flex flex-col space-y-2">
      <GuilgeeniiTuukhAldangi
        ajiltan={ajiltan}
        barilgiinId={barilgiinId}
        ref={refTuukh}
        data={data}
        token={token}
        ognoo={ognoo}
        refreshData={onFinish}
      />
    </div>
  );
}

export default React.forwardRef(KhuulgaAldangi);
