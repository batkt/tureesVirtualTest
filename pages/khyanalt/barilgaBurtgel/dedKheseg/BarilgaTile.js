import React from "react"


function BarilgaTile({
  ner,
  khayag,
  talbainKhemjee,
  
}) {
  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{ner}</div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {khayag}
        </div>
        <div className="flex w-full flex-row dark:text-gray-100">
        <div>{talbainKhemjee + "м2"}</div>
      </div>
      </div>    
    </div>
  )
}

export default BarilgaTile
