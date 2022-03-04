import React, { useMemo, useRef, useState } from 'react'
import Admin from 'components/Admin'
import _ from "lodash"
import { Button, DatePicker, Space, Table } from 'antd'
import { FileExcelOutlined } from '@ant-design/icons'
import ZardalBurtgekh from 'components/pageComponents/zardal/ZardalBurtgekh'
import { useAuth } from "services/auth"
import { modal } from "components/ant/Modal"
import shalgaltKhiikh from 'services/shalgaltKhiikh'
import useZardal from 'hooks/useZardal'
import useSWR from 'swr'
import createMethod from 'tools/function/crud/createMethod'
import getListMethod from 'tools/function/crud/getListMethod'
import formatNumber from 'tools/function/formatNumber'
import moment from 'moment'

const useZardaliinDun = (token,barilgiinId,idnuud,ognoo) =>{
  const {data} = useSWR(['zardliinDunAvya',ognoo,idnuud],(url,ognoo,idnuud)=>createMethod(url,token,{barilgiinId,idnuud,ekhlekhOgnoo:moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'), duusakhOgnoo:moment(ognoo[1]).format('YYYY-MM-DD 23:59:59')}).then(a=>a.data),{revalidateOnFocus:false})
  return {zardaliinDun:data}
}

const useDansniiKhuulga = (token,barilgiinId,zardliinBulgiinId,ognoo) =>{
  
  const [khuudaslalt, setDansniiKhuulgaKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search:''
  });

  const {data,mutate} = useSWR(['bankniiGuilgee',ognoo,zardliinBulgiinId,khuudaslalt],(url,ognoo,zardliinBulgiinId,{search,...khuudaslalt})=>getListMethod(url,token,{
    ...khuudaslalt,
    query:{
      barilgiinId,
      zardliinBulgiinId,
      $or:[
        {'TxDt':{$gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),$lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59')}},
        {'tranDate':{$gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),$lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59')}}
      ]
    },
    select:{TxDt:1,dansniiDugaar:1,Amt:1,CtActnName:1}
  }).then(a=>a.data),{revalidateOnFocus:false})

  return {
    dansniiKhuulgaGaralt:data,
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaMutate:mutate
  }
}

function pusher(list,zardal) {
  if(!!zardal?.dedKhesguud && zardal?.dedKhesguud.length > 0)
    zardal?.dedKhesguud.forEach(a=>pusher(list,a))
  list.push(zardal?._id)
}

function ZardalMur({zardal,index,parent,token,barilgiinId,ognoo,baiguullagiinId}) {

  const [showDed,setShowDed] = useState(false)

  const Idnuud=useMemo(()=>{
    let idnuud = []
    pusher(idnuud,zardal)
    return idnuud
  },[zardal])

  const {zardaliinDun} = useZardaliinDun(token,barilgiinId,Idnuud,ognoo)

  const {
    dansniiKhuulgaGaralt,
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaMutate,
  } = useDansniiKhuulga(
    token,
    barilgiinId,
    zardal?._id,
    ognoo
  )
  
  return (
    <div className='w-full space-y-4'>
      <div className='w-full flex flex-row space-x-4'>
        <div className='w-8 h-8 text-center flex items-center justify-center box cursor-pointer rounded-sm' onClick={()=>setShowDed(!showDed)}>{zardal.dedKhesguud ? (showDed ? '-' : '+') : ''}</div>
        <div className='box rounded-sm px-2 flex items-center' style={{width:'calc(100% - 21.25rem)'}}>{zardal.ner}</div>
        <div className='box rounded-sm px-2 flex items-center w-80'>{formatNumber(zardaliinDun || 0)}₮</div>
      </div>
      {showDed && zardal.dedKhesguud && <div className='w-full pl-12'>
        <Zardal zardaluud={zardal.dedKhesguud} token={token} barilgiinId={barilgiinId} ognoo={ognoo} baiguullagiinId={baiguullagiinId}/>
      </div>}
      {showDed &&  dansniiKhuulgaGaralt && dansniiKhuulgaGaralt?.jagsaalt?.map((a)=>(
          <div className='w-full pl-12 flex flex-row space-x-4' key={a?._id}>
              <div className='w-8 h-8 box text-center rounded-sm flex items-center justify-center'>{index+1}</div>
              <div className='box rounded-sm px-2 flex items-center' style={{width:'calc(100% - 63.25rem)'}}>{a.dansniiDugaar}</div>
              <div className='box rounded-sm px-2 flex items-center w-80'>{a.CtActnName}</div>
              <div className='box rounded-sm px-2 flex items-center w-80'>{moment(a.TxDt).format('YYYY-MM-DD')}</div>
              <div className='box rounded-sm px-2 flex items-center w-80'>{formatNumber(a.Amt || 0)}₮</div>
          </div>
        ))
      }
    </div>
  )
}

function Zardal({zardaluud,parent,token,barilgiinId,ognoo,baiguullagiinId}) {
  return <div className='w-full space-y-4'>
    {zardaluud?.map((a,i)=>(<ZardalMur key={a?._id} zardal={a} index={i} parent={parent} ognoo={ognoo} token={token} baiguullagiinId={baiguullagiinId} barilgiinId={barilgiinId}/>))}
  </div>
}


function zardal({token}) {
  const {barilgiinId,baiguullaga} = useAuth()
  const zardalRef = useRef(null)
  const [ognoo,setOgnoo] = useState([moment(),moment()])

  const {zardalGaralt,setZardalKhuudaslalt,zardalMutate} = useZardal(token,baiguullaga?._id)

  function onRefresh() {
    zardalMutate()
  }

  function zardalBurtgekh(data) {
    const footer = [
      <Space>
        <Button onClick={() => zardalRef.current.khaaya()}>Хаах</Button>
        <Button style={{ backgroundColor: "#209669", color: "#ffffff" }} onClick={() => zardalRef.current.khadgalya()}>Хадгалах</Button>
      </Space>
    ]
    modal({
      title: "Зардалын бүлэг үүсгэх",
      icon: <FileExcelOutlined />,
      content: (
        <ZardalBurtgekh
          ref={zardalRef}
          token={token}
          onRefresh={onRefresh}
          barilgiinId={barilgiinId}
          data={data}
        />
      ),
      footer,
    })
  }

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "№",
        width: "3rem",
        align: "center",
        render: (text, record, index) => index + 1
      },
      { title: 'Нэр', dataIndex: 'ner', key: 'Нэр' }
    ];
    if(!record?.dedKhesguud)
    return undefined
    return <Table columns={columns} dataSource={record?.dedKhesguud} pagination={false} expandable={{ expandedRowRender }}/>;
  };

  return (
    <Admin
      title="Дансны хуулга"
      khuudasniiNer="zardal"
      className="p-0 md:p-4"
    >
      <div className="col-span-12 grid w-full grid-cols-12 gap-4">
        {[
            { too: 0, utga: "Нийт" },
            {
              too:  0,
              utga: "Тодорхойгүй",
            },
            { too: 0, utga: "Холбогдсон" },
            {
              too:  0,
              utga: "Магадлалтай",
            },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className="intro-y zoom-in col-span-12 cursor-pointer rounded-xl border-2 border-green-600 md:col-span-6 lg:col-span-3 box"
              >
                <div className="h-full rounded-xl">
                  <div className="rounded-xl p-3">
                    <div className="flex">
                      <div>
                        <div className="text-3xl font-bold text-green-600">
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {mur.utga}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-2xl text-green-600">
                          {mur.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )
        })}
      </div>
      <div className="col-span-12 space-y-5">
        <DatePicker.RangePicker value={ognoo} onChange={setOgnoo}/>
        <button
          style={{
            backgroundColor: "#209669",
            display: "flex",
            justifyContent: "end",
          }}
          className="dropdown-toggle btn box mt-8 ml-auto w-full  bg-green-500 px-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 md:mt-0 md:w-auto"
          aria-expanded="false"
          onClick={()=>zardalBurtgekh()}
        >
          <span className="flex h-5 w-5 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-plus h-4 w-4"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </span>
          <span>Зардал бүртгэх</span>
        </button>
        <Zardal parent={true} zardaluud={zardalGaralt?.jagsaalt || []} baiguullagiinId={baiguullaga?._id} token={token} barilgiinId={barilgiinId} ognoo={ognoo}/>
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default zardal