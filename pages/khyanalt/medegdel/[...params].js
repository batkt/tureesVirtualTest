import React, { useState } from 'react';
import Admin from "components/Admin"
import shalgaltKhiikh from 'services/shalgaltKhiikh';
import readMethod from 'tools/function/crud/readMethod';
import uilchilgee,{aldaaBarigch} from 'services/uilchilgee';
import useSanalGomdol from 'hooks/medegdel/useSanalGomdol'
import ZagvarUusgekh from 'components/pageComponents/medegdel/ZagvarUusgekh'
import { Input, Spin } from 'antd';
import moment from 'moment'
import getListMethod from 'tools/function/crud/getListMethod';
import formatNumber from "tools/function/formatNumber";
import useSWR from 'swr';

function GereeniiUldegdel({label='', ugugdul, token, barilgiinId }) {
  const { data } = useSWR(
    !!ugugdul?.gereeniiDugaar && !!barilgiinId
      ? ["/uldegdelBodyo", barilgiinId, ugugdul?.gereeniiDugaar]
      : null,
    (url, barilgiinId, gereeniiDugaar) =>
      uilchilgee(token)
        .post(url, { barilgiinId, gereeniiDugaar })
        .then(({ data }) => data).catch(aldaaBarigch),
    {
      revalidateOnFocus: false,
    }
  )

  return (
    <div
      className={`font-medium ${
        data?.uldegdel > 0 ? "text-red-500" : "text-green-500"
      }`}
    >
      {!data ? <Spin size="small" /> : `${label}:${formatNumber(data?.uldegdel)}`}
    </div>
  )
}

function Geree({data,token}){

  return (
  <div key={data._id} className='border-2 border-green-400 rounded-md grid grid-cols-5'>
    <div className='p-2 text-center flex flex-col justify-center h-full bg-green-500 text-white'>
      <div className='font-medium text-xl text-gray-50'>{data.talbainDugaar}</div>
      <div className='font-medium text-gray-200'>
        {data.talbainKhemjee}m2
      </div>
    </div>
    <div className='col-span-4 p-2 divide-y space-y-3'>
    <div className='flex flex-row justify-between text-center'>
      <div>
        <div className='text-xs text-gray-500'>Гэрээний дугаар</div>
        <div>{data.gereeniiDugaar}</div>
      </div>
      <div>
        <div className='text-xs text-gray-500'>Эхлэх огноо</div>
        <div>{moment(data.gereeniiOgnoo).format('YYYY-MM-DD')}</div>
      </div>
      {`--->`}
      <div>
        <div className='text-xs text-gray-500'>Дуусах огноо</div>
        <div>{moment(data.duusakhOgnoo).format('YYYY-MM-DD')}</div>
      </div>
    </div>
    <div className='flex flex-row justify-between'>
    <div>
      <label>Сарын түрээс:</label>
      {formatNumber(data.sariinTurees)}
    </div>
    <GereeniiUldegdel label='Үлдэгдэл' ugugdul={data} token={token} barilgiinId={data.barilgiinId} />
    </div>
    </div>
  </div>)
}

function index({token,data}) {
    const [content,setContent] = useState('')
    const [body,onTextChange] = useState('')
    const [title,setTitle] = useState('')
    const [loading,setLoading] = useState(false)
    const {sonorduulga,sonorduulgaMutate} = useSanalGomdol(token,data)
    const {khariltsagch,gereenuud} = data || {}

    async function msgIlgeeye() {
      if(loading)
      {
          message.warning('Хүсэлт илгээгдсэн байна')
          return
      }

      setLoading(true)
      uilchilgee(token).post(`/sonorduulgaIlgeeye`,{firebaseToken:khariltsagch.firebaseToken,khariltsagchiinId:khariltsagch._id,barilgiinId:khariltsagch.barilgiinId,khariltsagchiinNer:khariltsagch.ner,medeelel:{title,body}}).then(({data})=>{
          if(!!data?.successCount)
          {
              sonorduulga.jagsaalt.unshift({khariltsagchiinId:khariltsagch._id,barilgiinId:khariltsagch.barilgiinId,khariltsagchiinNer:khariltsagch.ner,title,message:body,turul:'medegdel'})
              sonorduulgaMutate({...sonorduulga},false)
              notification.success({message:'СМС Амжилттай илгээлээ'})
              setLoading(false)
          }
      }).catch(e=>{
          setLoading(false)
          aldaaBarigch(e)
      })
  }

  return (
    <Admin dedKhuudas title="Мэдэгдэл" khuudasniiNer="medegdel" className="p-0 md:p-4" onSearch={(search) => setKhuudaslalt && setKhuudaslalt(a=>({...a,search}))}>
      <div className='col-span-3 p-5 box'>
        {gereenuud?.map(a=><Geree data={a} token={token} key={a._id} className='p-2 border-2 border-green-400 rounded-md '/>)}
      </div>
      <div className='col-span-9'>
      <div className="h-full flex flex-col box">
            <div className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-dark-5 px-5 py-4">
                {khariltsagch && <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit relative">
                        <img alt="Rubick Tailwind HTML Admin Template" className="rounded-full" src="/profile.svg"/>
                    </div>
                    <div className="ml-3 mr-auto">
                        <div className="font-medium text-base">{khariltsagch?.ner}</div>
                        <div className="text-gray-600 text-xs sm:text-sm">{khariltsagch?.utas} <span className="mx-1">•</span> SMS</div>
                    </div>
                </div>}
                <div className='flex items-center ml-auto space-x-2 font-medium'>
                  
                </div>
            </div>
            <div className='p-5 overflow-y-auto flex flex-col-reverse' style={{maxHeight:'calc(100vh - 28rem)'}}>
                {
                    sonorduulga?.jagsaalt?.map((a,i)=>{
                        return(
                            <div className={`relative w-1/3 p-3 bg-green-500 rounded-xl border border-green-200 flex flex-col mt-8 ${a.turul === 'medegdel' ? 'bg-blue-500 ml-auto rounded-br-none' : 'rounded-bl-none'}`}>
                                <span className='text-white'>{a.message}</span>
                                <span className='text-gray-500 font-medium text-xs absolute -bottom-5'>{moment(a.createdAt).format('YYYY-MM-DD hh:mm')}</span>
                                <span className='text-gray-500 right-0 absolute -bottom-5'>{a.turul}</span>
                            </div>
                        )
                    })
                }
            </div>
            {sonorduulga && <div className='w-full p-2 mt-auto'>
                <Input placeholder='Гарчиг' value={title} onChange={({target})=>setTitle(target.value)}/>
                <ZagvarUusgekh change={setContent} value={content} onTextChange={onTextChange}/>
            </div>}
            
            <div className='w-full flex justify-end items-center space-x-2 p-2'>
                <label className='font-medium'>СМС Илгээх</label>
                <div onClick={msgIlgeeye} className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 bg-green-600 text-white rounded-full flex-none flex items-center justify-center"> 
                    {loading ? <Spin size='small'/> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg> }
                </div>
            </div>
        </div>
      </div>
    </Admin>
  );
}

const ugudulAvchirya = async (ctx,session) => {
  const {data} = await readMethod('sanalGomdol',session?.tureestoken,ctx.query.params[1])
  const khariltsagch = await readMethod('khariltsagch',session?.tureestoken,data?.khariltsagchiinId)
  const gereenuud = await getListMethod('geree',session?.tureestoken,{query:{register:khariltsagch?.data?.register}})
  data.khariltsagch = khariltsagch?.data
  data.gereenuud = gereenuud?.data?.jagsaalt
  return data
}

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx,ugudulAvchirya);

export default index;
