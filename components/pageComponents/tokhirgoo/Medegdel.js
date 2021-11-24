import React, { useState } from "react";
import { Button, InputNumber, notification, Switch } from "antd";
import uilchilgee, { url } from "services/uilchilgee";

import {useAjiltniiJagsaalt} from "hooks/useAjiltan";

function Medegdel({
  token,
  baiguullaga,
  baiguullagaMutate
}) {
  const [medegdelTokhirgoo,setMedegdelTokhirgoo] = useState(null)

  const khungulultiinTokhirgooKhadgalya = () => {
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
                  <div className="font-medium">Хөнгөлөлтийн хувь тохируулах</div> 
                  <div className="text-gray-600">Гараас гэрээ байгуулахад хөнгөлж болох дээд хувь</div>
              </div>
              <div className="ml-auto">
                <InputNumber value={baiguullaga?.tokhirgoo?.deedKhungulultiinKhuvi} max={100} min={0} onChange={(v)=>setMedegdelTokhirgoo(a=>({...(a || {}),'tokhirgoo.deedKhungulultiinKhuvi':v}))}/>
              </div>
            </div>
          </div>
          <div className={`flex items-center pt-2 px-5 pb-2 border-b justify-end border-gray-200 dark:border-dark-5 ${!!medegdelTokhirgoo ? 'flex' : 'hidden'}`}>
            <Button type='primary' onClick={khungulultiinTokhirgooKhadgalya}>Хадгалах</Button>
          </div>
        </div>
      </div>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
        <div className='intro-y box mt-5 lg:mt-0'>
          <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
            <h2 className="font-medium text-base mr-auto dark:text-gray-200">
              Апп тохиргоо
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Хөнгөлөлт идэвхижүүлэх</div> 
                  <div className="text-gray-600">Менежер бүрт хөнгөлөлт оруулах боломжийг бий болгох</div>
              </div>
              <div className="ml-auto">
                <Switch checked={baiguullaga?.tokhirgoo?.bukhAjiltanKhungulultOruulakhEsekh} onChange={(v)=>setMedegdelTokhirgoo(a=>({...(a || {}),'tokhirgoo.bukhAjiltanKhungulultOruulakhEsekh':v}))}/>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Хөнгөлөлтийн хувь тохируулах</div> 
                  <div className="text-gray-600">Гараас гэрээ байгуулахад хөнгөлж болох дээд хувь</div>
              </div>
              <div className="ml-auto">
                <InputNumber value={baiguullaga?.tokhirgoo?.deedKhungulultiinKhuvi} max={100} min={0} onChange={(v)=>setMedegdelTokhirgoo(a=>({...(a || {}),'tokhirgoo.deedKhungulultiinKhuvi':v}))}/>
              </div>
            </div>
          </div>
          <div className={`flex items-center pt-2 px-5 pb-2 border-b justify-end border-gray-200 dark:border-dark-5 ${!!medegdelTokhirgoo ? 'flex' : 'hidden'}`}>
            <Button type='primary' onClick={khungulultiinTokhirgooKhadgalya}>Хадгалах</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Medegdel;
