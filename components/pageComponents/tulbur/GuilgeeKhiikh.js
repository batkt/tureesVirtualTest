import { Divider, Input, InputNumber, notification, Radio } from "antd";
import _ from "lodash";
import React, { useState } from "react";
import uilchilgee from "services/uilchilgee";

function GuilgeeKhiikh({ data, token, onFinish, destroy }, ref) {

  const [dun,setDun] = useState(0)
  const [turul,setTurul] = useState('Ваучераар тооцоо хийх')

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

  return (
    <div className="flex flex-col space-y-2">
      <div className='flex justify-center'> 
        <Radio.Group onChange={(e)=>setTurul(e.target.value)} value={turul}>
          <Radio value={'Ваучераар тооцоо хийх'}>Ваучераар тооцоо хийх</Radio>
          <Radio value={'Авлага үүсгэх'}>Авлага үүсгэх</Radio>
        </Radio.Group>
      </div>
      <Divider/>
      <label className="">{turul}</label>
      <InputNumber formatter={(value) =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/\$\s?|(,*)/g, "")} placeholder="Дүн" style={{ width: "100%" }} onChange={setDun}/>
      {turul === 'Авлага үүсгэх' && <Input.TextArea placeholder='Тайлбар'/>}
    </div>
  );
}

export default React.forwardRef(GuilgeeKhiikh);
