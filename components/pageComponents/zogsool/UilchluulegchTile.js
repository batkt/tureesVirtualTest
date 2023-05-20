import moment from "moment";
import React from "react";
import formatNumber from "tools/function/formatNumber";

function UilchluulegchTile({
  dugaar,
  ezemshigchiinNer,
  createdAt,
  turul,
  ezemshigchiinUtas,
}) {
  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{dugaar}</div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {}
        </div>
      </div>

      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{ezemshigchiinNer}</div>
        <div className="ml-auto font-medium">{turul}</div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        {ezemshigchiinUtas}
        <div className="ml-auto font-medium">
          <div className="ml-auto font-medium">
            {moment(createdAt).format("YYYY-MM-DD HH:MM:SS")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UilchluulegchTile;
