import moment from "moment";
import React from "react";
import formatNumber from "tools/function/formatNumber";

function TureeslegchTile({
  car_number,
  check_in_time,
  check_out_time,
  khugatsaa,
  tsagiinUnelgee,
  tulukhDun,
  utas,
}) {
  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{car_number}</div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {khugatsaa}
        </div>
      </div>

      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{moment(check_in_time).format("YYYY-MM-DD HH:MM:SS")}</div>
        <div className="ml-auto font-medium">
          {moment(check_out_time).format("YYYY-MM-DD HH:MM:SS")}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        {formatNumber(tsagiinUnelgee)}₮
        <div className="ml-auto font-medium">
          <div className="ml-auto font-medium">{formatNumber(tulukhDun)}₮</div>
        </div>
      </div>
    </div>
  );
}

export default TureeslegchTile;
