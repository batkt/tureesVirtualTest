import React, { useState } from "react";
import { Button, InputNumber, notification } from "antd";
import uilchilgee from "services/uilchilgee";

import {useAjiltniiJagsaalt} from "hooks/useAjiltan";

function AshiglaltiinZardal({
  token,
  baiguullaga,
  baiguullagaMutate
}) {

  const [sukhTokhirgoo,setSukhTokhirgoo] = useState(null)

  const sukhTokhirgooKhadgalya = () => {
    uilchilgee(token).post('/baiguullagaTokhirgooZasya',{tokhirgoo:sukhTokhirgoo}).then(({data})=>{
      if(data === 'Amjilttai'){
        notification.success({message:'Амжилттай засагдлаа'})
        setSukhTokhirgoo(null)
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
              Ус
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Цэвэр ус/<label className='text-red-500 font-medium'>Халуун</label>/</div> 
                  <div className="text-gray-600">Менежер бүрт хөнгөлөлт оруулах боломжийг бий болгох</div>
              </div>
              <div className="ml-auto">
                <InputNumber value={baiguullaga?.SUKH?.tseverUsKhaluun} max={100} min={0} onChange={(v)=>setSukhTokhirgoo(a=>({...(a || {}),'SUKH.tseverUsKhaluun':v}))}/>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Цэвэр ус/<label className='text-blue-500 font-medium'>Хүйтэн</label>/</div> 
                  <div className="text-gray-600">Менежер бүрт хөнгөлөлт оруулах боломжийг бий болгох</div>
              </div>
              <div className="ml-auto">
                <InputNumber value={baiguullaga?.SUKH?.tseverUsKhuiten} max={100} min={0} onChange={(v)=>setSukhTokhirgoo(a=>({...(a || {}),'SUKH.tseverUsKhuiten':v}))}/>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Бохир ус</div> 
                  <div className="text-gray-600">Гараас гэрээ байгуулахад хөнгөлж болох дээд хувь</div>
              </div>
              <div className="ml-auto">
                <InputNumber value={baiguullaga?.SUKH?.bokhirUs} max={100} min={0} onChange={(v)=>setSukhTokhirgoo(a=>({...(a || {}),'SUKH.bokhirUs':v}))}/>
              </div>
            </div>
          </div>
          
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Халуун ус халаасан дулаан</div> 
                  <div className="text-gray-600">Гараас гэрээ байгуулахад хөнгөлж болох дээд хувь</div>
              </div>
              <div className="ml-auto">
                <InputNumber value={baiguullaga?.SUKH?.khaluunUsKhalaasanDulaan} max={100} min={0} onChange={(v)=>setSukhTokhirgoo(a=>({...(a || {}),'SUKH.khaluunUsKhalaasanDulaan':v}))}/>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Усны суурь хураамж</div> 
                  <div className="text-gray-600">Гараас гэрээ байгуулахад хөнгөлж болох дээд хувь</div>
              </div>
              <div className="ml-auto">
                <InputNumber value={baiguullaga?.SUKH?.usniiSuuriKhuraamj} max={100} min={0} onChange={(v)=>setSukhTokhirgoo(a=>({...(a || {}),'SUKH.usniiSuuriKhuraamj':v}))}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
        <div className='intro-y box mt-5 lg:mt-0'>
          <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
            <h2 className="font-medium text-base mr-auto dark:text-gray-200">
              Халаалт
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Халаалт</div> 
                  <div className="text-gray-600">Менежер бүрт хөнгөлөлт оруулах боломжийг бий болгох</div>
              </div>
              <div className="ml-auto">
                <InputNumber value={baiguullaga?.SUKH?.khalaalt} max={100} min={0} onChange={(v)=>setSukhTokhirgoo(a=>({...(a || {}),'SUKH.khalaalt':v}))}/>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Дулааны суурь хураамж</div> 
                  <div className="text-gray-600">Менежер бүрт хөнгөлөлт оруулах боломжийг бий болгох</div>
              </div>
              <div className="ml-auto">
                <InputNumber value={baiguullaga?.SUKH?.dulaaniiSuuriKhuraamj} max={100} min={0} onChange={(v)=>setSukhTokhirgoo(a=>({...(a || {}),'SUKH.dulaaniiSuuriKhuraamj':v}))}/>
              </div>
            </div>
          </div>
          <div className={`flex items-center pt-2 px-5 pb-2 border-b justify-end border-gray-200 dark:border-dark-5 ${!!sukhTokhirgoo ? 'flex' : 'hidden'}`}>
            <Button type='primary' onClick={sukhTokhirgooKhadgalya}>Хадгалах</Button>
          </div>
        </div>
        
      </div>
      
    </>
  );
}

export default AshiglaltiinZardal;
