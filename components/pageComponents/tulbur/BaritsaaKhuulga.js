import _ from "lodash";
import React, { useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import useSWR from "swr";

const fetcher = (url, token, gereeniiId) =>
  axios(token)
    .get(`${url}/${gereeniiId}`)
    .then((res) => {
      return res.data
    })
    .catch(aldaaBarigch)


function useBaritsaa(token, gereeniiId) {
  const { data, mutate } = useSWR(
    !!token ? ["/baritsaaTulultAvya", token, gereeniiId] : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    baritsaaKhuulga: data,
    baritsaaKhuulgaMutate: mutate,
  }
}

function BaritsaaKhuulga({ data, token, onFinish, destroy }, ref) {

  console.log(data,token)

  const {baritsaaKhuulga,baritsaaKhuulgaMutate} = useBaritsaa(token,data?._id)
  
  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      }
    }),
    []
  );


  return (
    <div className="flex flex-col space-y-2">
      <div className="p-1 grid grid-cols-5 text-gray-700 dark:text-gray-400 bg-gray-200 dark:bg-gray-800  border-b border-gray-200">
          <div>№</div>
          <div>Огноо</div>
          <div>Орлого</div>
          <div>Зарлага</div>
          <div>Тайлбар</div>
        </div>
        {baritsaaKhuulga?.map((a, i) => (
          <div className="grid grid-cols-5 text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 hover:bg-green-100">
            <div className="p-1">{i + 1}</div>
            <div className="p-1">{moment(a.ognoo).format("YYYY-MM-DD")}</div>
            <div className="p-1">{formatNumber(a.orlogo, 0)}</div>
            <div className="p-1">{formatNumber(a.zarlaga, 0)}</div>
            <div className="flex justify-between p-1">
              {a.tailbar}
              {(a.turul === "avlaga" ||
                a.turul === "voucher" ||
                a.turul === "barter" ||
                a.turul === "bank" ||
                a.turul === "khyamdral"||
                a.turul === "baritsaa") && (
                <div className="contents justify-between">
                  <Popconfirm
                    title="Төлөлт устгах уу?"
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={() => tulultUstgaya(a)}
                  >
                    <div className="ml-auto flex items-center justify-center rounded-full p-1 border text-red-500 w-6 h-6 cursor-pointer hide-on-print">
                      <DeleteOutlined />
                    </div>
                  </Popconfirm>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

export default React.forwardRef(BaritsaaKhuulga);
