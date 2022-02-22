import moment from "moment"
import React from "react"
import formatNumber from "tools/function/formatNumber"

function DansniiKhuulgaTile({
  Amt,
  CtAcntOrg,
  TxTime,
  tranDate,
}) {
  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{TxTime}</div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {CtAcntOrg}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{formatNumber(Amt)}</div>
        <div className="ml-auto font-medium">
          {moment(tranDate).format("YYYY-MM-DD")}
        </div>
      </div>
    </div>
  )
}

export default DansniiKhuulgaTile
