import { Tag } from "antd"
import React from "react"

function AjiltanTile({ ovog, ner, utas, register, albanTushaal, mail }) {
  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{register}</div>

        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {mail}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{ovog + " " + ner}</div>
        <div className="ml-auto font-medium">{utas}</div>
      </div>
      <div className="mt-1 flex flex-row justify-between border-t-2">
        <div className="flex flex-col">
          <div className="font-medium text-green-500 dark:text-green-400">
            <Tag color={"blue"}>
              <span>{albanTushaal}</span>
            </Tag>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AjiltanTile
