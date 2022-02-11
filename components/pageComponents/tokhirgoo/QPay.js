import React, { useEffect, useState } from "react";
import { Button, Input, notification } from "antd";
import uilchilgee from "services/uilchilgee";
import useDans from "hooks/useDans"
import updateMethod from "tools/function/crud/updateMethod";

function QPay({
  token,
  baiguullaga,
  baiguullagaMutate
}) {
  const [qpayTokhirgoo,setQpayTokhirgoo] = useState(null)
  const [dansTokhirgoo,setDansTokhirgoo] = useState(null)
  const {dansGaralt} = useDans(token,baiguullaga?._id)

  useEffect(()=>{
    const qpay = dansGaralt?.jagsaalt?.find(a=> !!a.qpayUsername)
    if(!!qpay){
      const {qpayUsername,qpayPassword} = qpay
      setQpayTokhirgoo({qpayUsername,qpayPassword})
    }
  },[dansGaralt])

  const dansKhadgalya = () => {
    dansTokhirgoo?.map((mur,index,array)=>updateMethod('dans',token,{...mur,...qpayTokhirgoo}).then(({data})=>{
      if(data === 'Amjilttai' && (array.length-1) === index){
        notification.success({message:'Амжилттай хадгаллаа'})
      }
    }))
  }

  const undseneerKhadgalya = () => {
    dansGaralt?.jagsaalt?.map((mur,index,array)=>updateMethod('dans',token,{...mur,...qpayTokhirgoo}).then(({data})=>{
      if(data === 'Amjilttai' && (array.length-1) === index){
        notification.success({message:'Амжилттай хадгаллаа'})
      }
    }))
  }

  return (
    <>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
        <div className='intro-y box mt-5 lg:mt-0'>
          <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
            <h2 className="font-medium text-base mr-auto dark:text-gray-200">
              QPay тохиргоо
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Qpay Нэвтрэх нэр</div> 
                  <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input value={qpayTokhirgoo?.qpayUsername} onChange={({target})=>setQpayTokhirgoo(a=>({...(a || {}),qpayUsername:target.value}))}/>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Qpay Нэвтрэх нууц үг</div> 
                  <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input value={qpayTokhirgoo?.qpayPassword} onChange={({target})=>setQpayTokhirgoo(a=>({...(a || {}),qpayPassword:target.value}))}/>
              </div>
            </div>
          </div>
          <div className={`flex items-center pt-2 px-5 pb-2 border-b justify-end border-gray-200 dark:border-dark-5 ${!!qpayTokhirgoo ? 'flex' : 'hidden'}`}>
            <Button type='primary' onClick={undseneerKhadgalya}>Хадгалах</Button>
          </div>
        </div>
      </div>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
      <div className='intro-y box mt-5 lg:mt-0'>
          <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
            <h2 className="font-medium text-base mr-auto dark:text-gray-200">
              Данс тохиргоо
            </h2>
          </div>
          {dansGaralt?.jagsaalt?.map((dans)=>
            <div className="box">
              <div className="grid grid-cols-5 gap-2 p-5">
                <div className="">
                  <div className="font-medium">Данс</div> 
                  <div>{dans.dugaar}</div>
                </div>
                <div className="">
                    <div className="font-medium">Дансны нэр</div>
                    <div>{dans.dansniiNer}</div>
                </div>
                <div className="">
                    <div className="font-medium">Валют</div>
                    <div>{dans.valyut}</div>
                </div>
                <div className="col-span-2">
                  <Input defaultValue={dans?.qpayInvoiceCode} placeholder="Нэхэмжлэхийн дугаар" onChange={({target})=>setDansTokhirgoo(a=>{
                      const index = a?.findIndex(a=>a._id === dans._id)
                      if(!!a && index !== undefined && index !== -1){
                        a[index]._id=dans?._id,
                        a[index].qpayInvoiceCode = target.value
                        a[index].qpayAshiglakhEsekh = true
                        return [...a]
                      }
                      else {
                        const jagsaalt = a || []
                        jagsaalt.push({_id:dans?._id,qpayInvoiceCode:target.value,qpayAshiglakhEsekh:true})
                        return [...jagsaalt]
                      }
                    })
                  }/>
                </div>
              </div>
            </div>
          )}
          <div className={`flex items-center pt-2 px-5 pb-2 border-b justify-end border-gray-200 dark:border-dark-5 ${!!dansTokhirgoo ? 'flex' : 'hidden'}`}>
            <Button type='primary' onClick={dansKhadgalya}>Хадгалах</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default QPay;
