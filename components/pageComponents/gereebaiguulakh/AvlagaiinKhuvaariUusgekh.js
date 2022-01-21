import React, { useEffect } from 'react';
import { Input, InputNumber } from 'antd';
import moment from 'moment'
import { CloseCircleOutlined } from '@ant-design/icons';

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
    )
    
}

function AvlagaiinKhuvaariUusgekh({value,onChange,ugugdul}) {
  const [jagsaalt,setJagsaalt] = React.useState(value?.guilgeenuud || [])
  const {gereeniiOgnoo,tulukhUdur=[],sariinTurees} = ugugdul

  useEffect(()=>{
    var data = []
    const ognoo = moment(moment(gereeniiOgnoo).format('YYYY-MM-DD hh:mm:ss'))
    new Array(ugugdul?.khugatsaa || 0).fill('').map((mur,index)=>{
      tulukhUdur.forEach((udur)=>{
        data.push({
          ognoo:moment(`${ognoo}`).add(index+1,'month').set('date',udur),
          khyamdral:0,
          tulukhDun:ugugdul.talbainNiitUne
        })
      })
    })
    setJagsaalt([...data])
    onChange({guilgeenuud:data})
  },[])

  const updateMyData = (rowIndex, columnId, value) => {
    setJagsaalt(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const val = {
            ...old[rowIndex],
            [columnId]: value,
          }
          const tulukhDun = (sariinTurees / tulukhUdur.length)
          if(columnId === 'khyamdral')
          val['tulukhDun'] =  tulukhDun - (tulukhDun * value / 100)
          return {...val}
        }
        return row
      })
    )
  }
 
  return(
      <div className='w-full'>
          <div className='divide-y-2 space-y-2'>
            <Table
              className='mt-2'
              data={jagsaalt}
              updateMyData={updateMyData}
            />
          </div>
      </div>
  )
}

export default AvlagaiinKhuvaariUusgekh