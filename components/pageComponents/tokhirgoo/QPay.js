import React, { useState } from "react";
import { Button, Input, notification } from "antd";
import uilchilgee, { url } from "services/uilchilgee";

function QPay({
  token,
  baiguullaga,
  baiguullagaMutate
}) {
  const [medegdelTokhirgoo,setMedegdelTokhirgoo] = useState(null)

  const khungulultiinTokhirgooKhadgalya = () => {
    console.log(medegdelTokhirgoo)
    uilchilgee(token).post('/baiguullagaTokhirgooZasya',{tokhirgoo:medegdelTokhirgoo}).then(({data})=>{
      if(data === 'Amjilttai'){
        notification.success({message:'Амжилттай засагдлаа'})
        setMedegdelTokhirgoo(null)
        baiguullagaMutate()
      }
    })
  }

  return (
    <>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
        <div className='intro-y box mt-5 lg:mt-0'>
          <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
            <h2 className="font-medium text-base mr-auto dark:text-gray-200">
              СМС тохиргоо
            </h2>
          </div>
          
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Qpay Нэвтрэх нэр</div> 
                  <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input value={baiguullaga?.tokhirgoo?.qpayUsername} max={100} min={0} onChange={({target})=>setMedegdelTokhirgoo(a=>({...(a || {}),'tokhirgoo.qpayUsername':target.value}))}/>
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
                <Input value={baiguullaga?.tokhirgoo?.qpayPassword} max={100} min={0} onChange={({target})=>setMedegdelTokhirgoo(a=>({...(a || {}),'tokhirgoo.qpayPassword':target.value}))}/>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Qpay Нэхэмжлэхийн</div> 
                  <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input value={baiguullaga?.tokhirgoo?.qpayInvoiceCode} max={100} min={0} onChange={({target})=>setMedegdelTokhirgoo(a=>({...(a || {}),'tokhirgoo.qpayInvoiceCode':target.value}))}/>
              </div>
            </div>
          </div>
          <div className={`flex items-center pt-2 px-5 pb-2 border-b justify-end border-gray-200 dark:border-dark-5 ${!!medegdelTokhirgoo ? 'flex' : 'hidden'}`}>
            <Button type='primary' onClick={khungulultiinTokhirgooKhadgalya}>Хадгалах</Button>
          </div>
        </div>
      </div>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
      </div>
    </>
  );
}

export default QPay;
