import { Badge, Table } from "antd"
import React, { Fragment } from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"
import moment from "moment"
import formatNumber from "tools/function/formatNumber"
const fetcher = (url, token, gereeniiId) =>
  axios(token)
    .get(`${url}/${gereeniiId}`)
    .then((res) => res.data)
    .catch(aldaaBarigch)

function useGuilgee(token, gereeniiId) {
  const { data, mutate } = useSWR(
    !!token ? ["/gereeniiTulultAvya", token, gereeniiId] : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  return {
    guilgeeniiTuukh: data,
    guilgeeniiTuukhMutate: mutate,
  }
}

function GuilgeeniiTuukh({ token, data }) {
  const { guilgeeniiTuukh } = useGuilgee(token, data?._id)
  /*'/gereeniiTulultAvya/:gereeniiId'*/
  return (
    <React.Fragment>
      <div className="ml-12 p-1 grid grid-cols-7 text-gray-700 dark:text-gray-500 bg-gray-100 border-b border-gray-200">
        <div>№</div>
        <div>Огноо</div>
        <div>Түрээс</div>
        <div>Хямдрал</div>
        <div>Төлөх дүн</div>
        <div>Төлсөн дүн</div>
        <div>Хэлбэр</div>
      </div>
      {guilgeeniiTuukh?.map((a, i) => (
        <div className="ml-12 p-1 grid grid-cols-7 text-gray-700 dark:text-gray-500 bg-gray-50 border-b border-gray-200 hover:bg-green-100">
          <div>{i + 1}</div>
          <div>{moment(a.ognoo).format("YYYY-MM-DD")}</div>
          <div>{formatNumber(a.undsenDun, 0)}</div>
          <div>{formatNumber(a.khyamdral, 0)}</div>
          <div>{formatNumber(a.tulukhDun, 0)}</div>
          <div>{formatNumber(a.tulsunDun, 0)}</div>
          <div>{a.turul}</div>
        </div>
      ))}
    </React.Fragment>
  )
}

export default GuilgeeniiTuukh
