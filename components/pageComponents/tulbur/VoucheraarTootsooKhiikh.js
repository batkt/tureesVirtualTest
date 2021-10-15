import { InputNumber, notification } from "antd";
import _ from "lodash";
import React, { useState } from "react";
import uilchilgee from "services/uilchilgee";

function VoucheraarTootsooKhiikh({ data, token, onFinish, destroy }, ref) {

  const [dun,setDun] = useState(0)

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
      <label className="">Ваучераар тооцоо хийх</label>
      <InputNumber formatter={(value) =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/\$\s?|(,*)/g, "")} placeholder="Ваучер дүн" style={{ width: "100%" }} onChange={setDun}/>
    </div>
  );
}

export default React.forwardRef(VoucheraarTootsooKhiikh);
