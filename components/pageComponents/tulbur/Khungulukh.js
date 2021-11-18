import { Divider, InputNumber,Input, notification } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import uilchilgee from "services/uilchilgee";
import moment from 'moment'
import { CloseCircleOutlined } from "@ant-design/icons";

function Table({data,updateMyData}) {
  return (
    <div className='table w-full'>
      <div className='table-row'>
        <div className='table-cell text-center dark:text-gray-100'>
          №
        </div>
        <div className='table-cell text-center w-20 dark:text-gray-100'>
          Огноо
        </div>
        <div className='table-cell text-center w-14 dark:text-gray-100'>
          Хувь
        </div>
        <div className='table-cell text-center dark:text-gray-100'>
          Төлөх дүн
        </div>
        <div className='table-cell text-center dark:text-gray-100'>
          Тайлбар
        </div>
      </div>
      {data?.map((mur,index)=>
      <div className='table-row mt-2' key={index+'khyamdral'}>
        <div className='table-cell text-center p-1'>
          {index + 1}.
        </div>
        <div className='table-cell w-20' >
          {moment(mur.ognoo).format('YYYY-MM-DD')}
        </div>
        <div className='table-cell w-14'>
          <InputNumber style={{width:'100%'}}  placeholder='Хөнгөлөх хувь' title='Хөнгөлөх хувь' min={0} max={100} value={mur.khyamdral} onChange={(v)=>updateMyData(index,'khyamdral',v)}/>
        </div>
        <div className='table-cell '>
          <InputNumber style={{width:'100%'}} formatter={(value) =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/\$\s?|(,*)/g, "")} placeholder='Төлөх дүн' value={mur.tulukhDun} min={0} onChange={(v)=>updateMyData(index,'tulukhDun',v)}/>
        </div>
        <div className='table-cell '>
          <Input style={{width:'100%'}} placeholder='Тайлбар' value={mur.tailbar} onChange={({target})=>updateMyData(index,'tailbar',target.value)}/>
        </div>
        <div className='table-cell fill-current text-red-500 cursor-pointer p-2'>
          <CloseCircleOutlined />
        </div>
      </div>
    )}
    </div>
  )}
  
function VoucheraarTootsooKhiikh({ data, token, onFinish, destroy }, ref) {

  const [dun,setDun] = useState(0)
  const [sar,setSar] = useState(0)
  const [jagsaalt,setJagsaalt] = useState([])

  useEffect(()=>{
    var jdata = []
    const ognoo = moment(data?.gereeniiOgnoo)
    new Array(sar || 0).fill('').map((mur,index)=>{
      data?.tulukhUdur.forEach((udur)=>{
        jdata.push({
          ognoo:moment(`${ognoo}`).add(index+1,'month').set('date',udur),
          khyamdral:0,
          tulukhDun:data?.sariinTurees
        })
      })
    })
    console.log('jdata',jdata,data?.tulukhUdur,sar)
    setJagsaalt([...jdata])
  },[sar])

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        if(!dun)
        {
          notification.warning({message:'Та гэрээгээ сонгоно уу'})
          return
        }
        uilchilgee(token).post('/tulultKhadgalya',{
          turul:'voucher',
          tulsunDun:dun,
          ognoo:new Date(),
          gereeniiId:data?._id,
        }).then(({data})=>{
          notification.success({placement:'bottomRight',message:'Амжилттай'})
          _.isFunction(onFinish) && onFinish();
          destroy();
        })
      },
    }),
    [dun]
  );

  const updateMyData = (rowIndex, columnId, value) => {
    setJagsaalt(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const val = {
            ...old[rowIndex],
            [columnId]: value,
          }
          const tulukhDun = (data?.sariinTurees / data?.tulukhUdur.length)
          if(columnId === 'khyamdral')
          val['tulukhDun'] =  tulukhDun - (tulukhDun * value / 100)
          return {...val}
        }
        return row
      })
    )
  }
 

  return (
    <div className="flex flex-col space-y-2">
      <div className='flex flex-row space-x-2 items-center'>
        <label>Хөнгөлөх сар</label>
        <InputNumber placeholder='сар' onChange={setSar}/>
      </div>
      <Divider/>
      <label>Хөнгөлөлт оруулах</label>
      <Table
              className='mt-2'
              data={jagsaalt}
              updateMyData={updateMyData}
            />
    </div>
  );
}

export default React.forwardRef(VoucheraarTootsooKhiikh);