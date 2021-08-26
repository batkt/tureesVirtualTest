import React from 'react';
import { Button,  DatePicker, InputNumber } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment'
import { CloseCircleOutlined, MenuOutlined } from '@ant-design/icons';

function Table({data,updateMyData}) {
    return (
      <div className='table w-full'>
        <div className='table-row'>
          <div className='table-cell text-center'>
            №
          </div>
          <div className='table-cell text-center'>
          Огноо
          </div>
          <div className='table-cell text-center'>
          Хөнгөлөх хувь
          </div>
          <div className='table-cell text-center'>
          Төлөх дүн
          </div>
        </div>
        {data?.map((mur,index)=>
        <div className='table-row mt-2' key={index+'khyamdral'}>
          <div className='table-cell text-center'>
            {index + 1}
          </div>
          <div className='table-cell ' >
            <DatePicker style={{width:'100%'}} placeholder='Огноо' disabled value={mur.ognoo} onChange={(v)=>updateMyData(index,'ognoo',v)}/>
          </div>
          <div className='table-cell '>
            <InputNumber style={{width:'100%'}} placeholder='Хөнгөлөх хувь' title='Хөнгөлөх хувь' min={0} max={100} value={mur.khyamdral} onChange={(v)=>updateMyData(index,'khyamdral',v)}/>
          </div>
          <div className='table-cell '>
            <InputNumber style={{width:'100%'}} placeholder='Төлөх дүн' value={mur.tulukhDun} min={0} onChange={(v)=>updateMyData(index,'tulukhDun',v)}/>
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
  const [isModalVisible,setIsModalVisible] = React.useState(false)
  const [jagsaalt,setJagsaalt] = React.useState(value?.guilgeenuud || [])
  const {gereeniiOgnoo,tulukhUdur=[],sariinTurees} = ugugdul
  const handleVisible = () => {
    setIsModalVisible(!isModalVisible)
  }

  const sarOruulya = (v) => {
    var data = []
    const ognoo = moment(gereeniiOgnoo)
    new Array(v).fill('').map((mur,index)=>{
      tulukhUdur.forEach((udur)=>{
        data.push({
          ognoo:moment(`${ognoo}`).add(index+1,'month').set('date',udur),
          khyamdral:0,
          tulukhDun:0
        })
      })
    })
    setJagsaalt(data)
  }

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
  const onOk = ()=>{
    onChange({guilgeenuud:jagsaalt})
    setIsModalVisible(false)
  }
 
  return(
      <div className='w-full'>
        <Button
          onClick={handleVisible}
          type="primary"
          icon={<MenuOutlined/>}
          style={{width:'100%'}}
        >
          Хөнгөлөлт оруулах
        </Button>
        <Modal closable={false} title="Хугацааны хөнгөлөлт оруулах" visible={isModalVisible} okText='Хадгалах' cancelText='Хаах' onOk={onOk} onCancel={handleVisible}>
          <div>
            <InputNumber style={{width:'100%'}} min={0} max={12} defaultValue={jagsaalt.length} placeholder='Хөнгөлөх сар' onChange={sarOruulya}/>
            <Table
              className='mt-2'
              data={jagsaalt}
              updateMyData={updateMyData}
            />
          </div>
        </Modal>
      </div>
  )
}

export default AvlagaiinKhuvaariUusgekh