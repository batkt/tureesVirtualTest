import React from 'react'
import formatNumber from 'tools/function/formatNumber'
import uilchilgee from 'services/uilchilgee'
const { DatePicker, InputNumber } = require("antd")
const moment = require('moment')

const Sungakh = React.forwardRef(({token,destroy,confirm,data},ref)=> {
    const [sar,setSar] = React.useState(1)
    const [duusakhOgnoo,setDuusakhOgnoo] = React.useState(moment(data?.duusakhOgnoo).add(1,'month'))

    React.useEffect(()=>{
      setDuusakhOgnoo(moment(data?.duusakhOgnoo).add(sar,'month'))
    },[sar])

    React.useImperativeHandle(
      ref,
      () => ({
          khadgalya() {
            uilchilgee(token).post('/gereeSungaya',{
              "gereeniiId" : data?._id,
              duusakhOgnoo
          }).then(({data})=>{
              confirm(duusakhOgnoo)
              destroy()
            })
          },
          khaaya() {
              destroy()
          },
      }),
      [duusakhOgnoo],
    )
  
    return(
      <div className='space-y-2 w-full'>
        <div className='space-y-2 w-full font-medium'>
          <div className='w-full flex flex-row justify-between'>
            <div className='text-right'>Эхлэх огноо:</div>
            <div>{moment(data?.gereeniiOgnoo).format('YYYY-MM-DD')}</div>
          </div>
          <div className='w-full flex flex-row justify-between'>
            <div className='text-right'>Дуусах огноо:</div>
            <div>{moment(data?.duusakhOgnoo).format('YYYY-MM-DD')}</div>
          </div>
          <div className='w-full flex flex-row justify-between'>
            <div className='text-right'>Ашигласан хоног:</div>
            <div>{moment(new Date()).diff(moment(data?.gereeniiOgnoo),'day')}</div>
          </div>
          <div className='w-full flex flex-row justify-between'>
            <div className='text-right'>Авлагын дүн:</div>
            <div>{formatNumber(data?.uldegdel)}</div>
          </div>
          <div className='w-full flex flex-row justify-between'>
            <div className='text-right'>Сунгах сар:</div>
            <InputNumber style={{width:'60%'}} value={sar} onChange={setSar}/>
          </div>
          <div className='w-full flex flex-row justify-between'>
            <div className='text-right'>Дуусгах огноо:</div>
            <DatePicker style={{width:'60%'}} value={duusakhOgnoo} onChange={setDuusakhOgnoo}/>
          </div>
        </div>
      </div>
    )
})

export default Sungakh