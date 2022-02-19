import { Tag } from "antd"
import moment from "moment"
import React from "react"
import formatNumber from "tools/function/formatNumber"


function TalbaiTile({
  kod,
  talbainKhemjee,
  talbainNegjUne,
  talbainNiitUne,
  davkhar,
  ...ugugdul
}) {
  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{kod}</div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {talbainKhemjee  + "м2"}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{formatNumber(talbainNegjUne)}₮</div>
        <div className="ml-auto font-medium">{formatNumber(talbainNiitUne)}₮</div>
      </div>
      
    </div>
  )
}

export default TalbaiTile
