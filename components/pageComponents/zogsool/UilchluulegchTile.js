import moment from "moment";
import { TsagToololt } from "pages/khyanalt/zogsool/camera";
import React from "react";
import formatNumber from "tools/function/formatNumber";

function UilchluulegchTile({
  dugaar,
  ezemshigchiinNer,
  createdAt,
  turul,
  ezemshigchiinUtas,
  ...props
}) {
  const minToHour = (m) => {
    let res;
    if (m < 60) res = m + " мин";
    else {
      const h = Math.floor(m / 60);
      const min = m % 60;
      res = h + " цаг " + (min && min + " мин");
    }
    return res;
  };
  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">
          {moment(createdAt).format("YYYY-MM-DD HH:MM:SS")}
        </div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {props?.mashiniiDugaar}
        </div>
      </div>

      <div className="flex w-full flex-row dark:text-gray-100">
        <div>
          {props?.tuukh?.[0]?.tsagiinTuukh?.[0]?.garsanTsag ? (
            minToHour(
              props?.tuukh?.reduce(
                (a, b) => a + (b?.niitKhugatsaa || 0),
                0 || 0
              )
            )
          ) : (
            <TsagToololt
              ekhlekhTsag={props?.tuukh?.[0]?.tsagiinTuukh?.[0]?.orsonTsag || 0}
            />
          )}
        </div>
        <div className="ml-auto font-medium">
          {formatNumber(props?.tuukh?.[0]?.tulukhDun || 0) + "₮"}
        </div>
      </div>
    </div>
  );
}

export default UilchluulegchTile;
