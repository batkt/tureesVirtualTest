import { Popconfirm } from "antd"
import React from "react"
import axios, { aldaaBarigch } from "services/uilchilgee"
import useSWR from "swr"
import moment from "moment"
import formatNumber from "tools/function/formatNumber"
import { DeleteOutlined } from "@ant-design/icons"
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

function GuilgeeniiTuukh({ token, data,refreshData }) {
  const { guilgeeniiTuukh } = useGuilgee(token, data?._id)

  function tulultUstgaya({guilgeeniiId,tulsunDun,_id}) {
    axios(token).post('/tulultUstgaya',{guilgeeniiId,gereeniiId:data?._id,tulsunDun,objectiinId:_id}).then(({data})=>{
      console.log(data)
      refreshData()
    })
  }

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
        <div className="ml-12 grid grid-cols-7 text-gray-700 dark:text-gray-500 bg-gray-50 border-b border-gray-200 hover:bg-green-100">
          <div className='p-1'>{i + 1}</div>
          <div className='p-1'>{moment(a.ognoo).format("YYYY-MM-DD")}</div>
          <div className='p-1'>{formatNumber(a.undsenDun, 0)}</div>
          <div className='p-1'>{formatNumber(a.khyamdral, 0)}</div>
          <div className='p-1'>{formatNumber(a.tulukhDun, 0)}</div>
          <div className='p-1'>{formatNumber(a.tulsunDun, 0)}</div>
          <div className='flex flex-row px-1 items-center'>
            {a.turul}
            {(a.turul === 'voucher' || a.turul === 'bank') && <Popconfirm
              title="Төлөлт устгах уу?"
              okText="Тийм"
              cancelText="Үгүй"
              onConfirm={() => tulultUstgaya(a)}
            >
              <div className='ml-auto flex items-center justify-center rounded-full p-1 border text-red-500 w-6 h-6 cursor-pointer' >
                <DeleteOutlined style={{}}/>
              </div>
            </Popconfirm>}
          </div>
        </div>
      ))}
    </React.Fragment>
  )
}

export default GuilgeeniiTuukh
