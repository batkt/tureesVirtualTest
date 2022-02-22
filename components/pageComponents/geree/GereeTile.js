import { Tag } from "antd"
import moment from "moment"
import React from "react"
import formatNumber from "tools/function/formatNumber"

function GereeTile({
  ovog,
  ner,
  utas,
  gereeniiDugaar,
  talbainDugaar,
  talbainKhemjee,
  sariinTurees,
  gereeniiOgnoo,
  duusakhOgnoo,
  burtgesenAjiltaniiNer,
  ...ugugdul
}) {
  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{ner}</div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {gereeniiDugaar}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{utas}</div>
        <div className="ml-auto font-medium">{talbainDugaar}</div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{moment(gereeniiOgnoo).format("YYYY-MM-DD")}</div>
        <div className="ml-auto font-medium">
          {moment(duusakhOgnoo).format("YYYY-MM-DD")}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{talbainKhemjee + "м2"}</div>
        <div className="ml-auto font-medium">{formatNumber(sariinTurees)}₮</div>
      </div>
    </div>
  )
}

export default GereeTile
