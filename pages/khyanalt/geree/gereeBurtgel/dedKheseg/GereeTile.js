import { Tag } from "antd"
import moment from "moment"
import React from "react"
import formatNumber from "tools/function/formatNumber"

const tuluvStyle = {
  display: "flex",
  fontSize: "0.8rem",
  fontWeight: "bold",
  justifyContent: "space-between",
}

function Tuluv({ ugugdul }) {
  var tuluv = ""
  let color = "geekblue"
  switch (ugugdul.tuluv) {
    case "1":
      tuluv = "ХУВААРИЛАГДСАН"
      color = "orange"
      break
    case "2":
      tuluv = "ХИЙГДЭЖ БАЙНА"

      break
    case "3":
      tuluv = "ДУУССАН"
      color = "green"
      break
    case "-1":
      tuluv = "ЦУЦЛАГДСАН"
      color = "red"
      break
    default:
      break
  }
  return (
    <div style={tuluvStyle} className="whitespace-nowrap">
      <Tag color={color}>
        <span>{tuluv}</span>
      </Tag>
    </div>
  )
}

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
        <div className="font-bold dark:text-gray-100">{gereeniiDugaar}</div>
        <div className="space-x-2 font-bold dark:text-gray-100">
          {"-" + ner}
        </div>
        <div className="space-x-2 font-bold dark:text-gray-100">
          {"-" + utas}
        </div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {moment(gereeniiOgnoo).format("YYYY-MM-DD")}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{talbainDugaar}</div>
        <div className="ml-auto font-medium">
          {moment(duusakhOgnoo).format("YYYY-MM-DD")}
        </div>
      </div>
      <div className="mt-1 flex flex-row justify-between border-t-2">
        <div className="flex flex-col">
          <div className="font-medium text-green-500 dark:text-green-400">
            {formatNumber(sariinTurees)}₮
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-medium text-blue-700 dark:text-blue-400">
            {burtgesenAjiltaniiNer}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GereeTile
