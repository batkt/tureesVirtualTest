import React, { useState } from "react";
import { Button, notification, Switch } from "antd";
import uilchilgee,{ url } from "services/uilchilgee";

import {useAjiltniiJagsaalt} from "hooks/useAjiltan";

function KhuviinMedeelel({
  ajiltan = {},
  token,
  ajiltanMutate,
  baiguullaga,
  baiguullagaMutate
}) {
  const {ajilchdiinGaralt,ajiltniiJagsaaltMutate} = useAjiltniiJagsaalt(token,ajiltan?.baiguullagiinId)
  
  const [ajiltniiTokhirgoo,setAjiltniiTokhirgoo] = useState(null)
  const [gereeTokhirgoo,setGereeTokhirgoo] = useState(null)

  const ajiltniiTokhirgooKhadgalya = () => {
    const ajiltnuud = []
    for(const ajiltan in ajiltniiTokhirgoo)
    ajiltnuud.push({_id:ajiltan,utga:ajiltniiTokhirgoo[ajiltan]})
    ajiltniiTokhirgoo?.turul = 'tokhirgoo.gereeZasakhErkh'
    ajiltniiTokhirgoo.ajiltnuud = ajiltnuud
    uilchilgee(token).post('/ajiltniiTokhirgooZasya',ajiltniiTokhirgoo).then(({data})=>{
      if(data === 'Amjilttai'){
        ajiltniiJagsaaltMutate()
        notification.success({message:'Амжилттай засагдлаа'})
        setAjiltniiTokhirgoo(null)
      }
    })
  }

  const gereeTokhirgooKhadgalya = () => {
    uilchilgee(token).post('/baiguullagaTokhirgooZasya',{tokhirgoo:gereeTokhirgoo}).then(({data})=>{
      if(data === 'Amjilttai'){
        notification.success({message:'Амжилттай засагдлаа'})
        setGereeTokhirgoo(null)
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
               Гэрээ засах эрх ажилтнаар
            </h2>
          </div>
          {
            ajilchdiinGaralt?.jagsaalt?.map((a)=>
              <div className="box" key={a?._id}>
                <div className="flex flex-col lg:flex-row items-center p-5">
                  <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                  <img
                    alt={a?.ner}
                    src={
                      a?.zurgiinNer
                        ? `${url}/ajiltniiZuragAvya/${a?.baiguullagiinId}/${a?.zurgiinNer}`
                        : "/profile.svg"
                    }
                    className="rounded-full"
                  />
                  </div>
                  <div className="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                    <a className="font-medium">{a?.ner}</a> 
                    <div className="text-gray-600 text-xs mt-0.5">{a?.erkh}</div>
                  </div>
                  <div className="flex mt-4 lg:mt-0">
                    <Switch defaultChecked={a?.tokhirgoo?.gereeZasakhErkh || false} onChange={(v)=>setAjiltniiTokhirgoo(o=>({...(o || {}),[a._id]:v}))}/>
                  </div>
                </div>
              </div>
            )
          }
          <div className={`flex items-center pt-2 px-5 pb-2 border-b justify-end border-gray-200 dark:border-dark-5 ${!!ajiltniiTokhirgoo ? 'flex' : 'hidden'}`}>
            <Button type='primary' onClick={ajiltniiTokhirgooKhadgalya}>Хадгалах</Button>
          </div>
        </div>
      </div>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
        <div className='intro-y box mt-5 lg:mt-0'>
          <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
            <h2 className="font-medium text-base mr-auto dark:text-gray-200">
              Нийтээр хөнгөлөх
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Гэрээ автоматаар сунгах</div> 
                  <div className="text-gray-600">Менежер бүрт хөнгөлөлт оруулах боломжийг бий болгох</div>
              </div>
              <div className="ml-auto">
                <Switch defaultChecked={baiguullaga?.tokhirgoo?.gereeAvtomataarSungakhEsekh} onChange={(v)=>setGereeTokhirgoo(a=>({...(a || {}),'tokhirgoo.gereeAvtomataarSungakhEsekh':v}))}/>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Гэрээ нийтээр засвар оруулах</div> 
                  <div className="text-gray-600">Гараас гэрээ байгуулахад хөнгөлж болох дээд хувь</div>
              </div>
              <div className="ml-auto">
                <Switch defaultChecked={baiguullaga?.tokhirgoo?.bukhAjiltanGereendZasvarOruulakhEsekh} onChange={(v)=>setGereeTokhirgoo(a=>({...(a || {}),'tokhirgoo.bukhAjiltanGereendZasvarOruulakhEsekh':v}))}/>
              </div>
            </div>
          </div>
          <div className={`flex items-center pt-2 px-5 pb-2 border-b justify-end border-gray-200 dark:border-dark-5 ${!!gereeTokhirgoo ? 'flex' : 'hidden'}`}>
            <Button type='primary' onClick={gereeTokhirgooKhadgalya}>Хадгалах</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default KhuviinMedeelel;
