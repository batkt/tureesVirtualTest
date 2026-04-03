import _ from "lodash";
import React, { useEffect, useRef } from "react";
import DugaaruudTuukh from "./DugaaruudTuukh";

function DugaarKharya(
  { data, token, ognoo, onFinish, destroy, ajiltan, barilgiinId },
  ref,
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
    [refTuukh],
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
    <div
      className="flex flex-col space-y-2 overflow-x-auto"
      style={{ height: "calc(90vh - 12rem)" }}
    >
      <DugaaruudTuukh
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

export default React.forwardRef(DugaarKharya);
