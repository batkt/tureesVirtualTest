import React from 'react';
import { Button,  DatePicker, InputNumber } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment'
import { CloseCircleOutlined, MenuOutlined } from '@ant-design/icons';

function Table({data,updateMyData}) {
    return data?.map((mur,index)=>
        <div className='w-full flex flex-row space-x-2 mt-2 text-center items-center' key={index+'khyamdral'}>
          <div >
            {index + 1}
          </div>
          <DatePicker placeholder='Огноо' disabled value={mur.ognoo} onChange={(v)=>updateMyData(index,'ognoo',v)}/>
          <InputNumber placeholder='Хөнгөлөх хувь' value={mur.khyamdral} onChange={(v)=>updateMyData(index,'khyamdral',v)}/>
          <InputNumber placeholder='Хөнгөлөх дүн' value={mur.tulukhDun} onChange={(v)=>updateMyData(index,'tulukhDun',v)}/>
          <div className='fill-current text-red-500 cursor-pointer'>
            <CloseCircleOutlined />
          </div>
        </div>
      )
    
}

function AvlagaiinKhuvaariUusgekh({value,onChange,ugugdul}) {
  const [isModalVisible,setIsModalVisible] = React.useState(false)
  const [jagsaalt,setJagsaalt] = React.useState(value?.guilgeenuud || [])
  const {ekhlekhOgnoo,tulukhUdur=[],sariinTurees} = ugugdul

  const handleVisible = () => {
    setIsModalVisible(!isModalVisible)
  }

  const sarOruulya = (v) => {
    var data = []
    const ognoo = moment(ekhlekhOgnoo)
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
        <Modal closable={false} title="Basic Modal" visible={isModalVisible} okText='Хадгалах' cancelText='Хаах' onOk={onOk} onCancel={handleVisible}>
          <div>
            <InputNumber style={{width:'100%'}} placeholder='Хөнгөлөх сар' onChange={sarOruulya}/>
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