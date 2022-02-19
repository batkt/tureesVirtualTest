import { Tag } from "antd"
import moment from "moment"
import React from "react"
import formatNumber from "tools/function/formatNumber"

function TureeslegchTile({
  mashinDugaar,
  talbai,
  orsonOgnoo,
  garsanOgnoo,
  khugatsaa,
  tsagiinUnelgee,
  tulukhDun,
  utas,
}) {
  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{mashinDugaar}</div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {khugatsaa}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{utas}</div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {talbai}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{moment(orsonOgnoo).format("YYYY-MM-DD")}</div>
        <div className="ml-auto font-medium">
          {moment(garsanOgnoo).format("YYYY-MM-DD")}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        {formatNumber(tsagiinUnelgee)}₮
        <div className="ml-auto font-medium">
          <div className="ml-auto font-medium">{formatNumber(tulukhDun)}₮</div>
        </div>
      </div>
    </div>
  )
}

export default TureeslegchTile
