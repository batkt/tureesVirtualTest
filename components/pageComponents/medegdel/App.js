import { Input, notification, Spin } from 'antd'
import React, { useState } from 'react'
import useKhariltsagch from 'hooks/useKhariltsagch'
import ZagvarUusgekh from './ZagvarUusgekh'
import uilchilgee, { aldaaBarigch } from 'services/uilchilgee'

const query = {firebaseToken:{$exists:true}}

function App({token,baiguullaga,khariltsagch,setKhariltsagch}) {
    const {khariltsagchiinGaralt,setKhuudaslalt} = useKhariltsagch(token,baiguullaga?._id,undefined,query)

    return (
        <>
            <div className="box p-5 mt-5">
                <div className="text-gray-700 dark:text-gray-300">
                    <Input.Search placeholder='Харилцагч хайх /Утас , Нэр, Регистр/' onSearch={search => setKhuudaslalt(a=>({...a,search}))}/>
                </div>
                <div className="overflow-y-auto scrollbar-hidden h-80 mt-5">
                    {khariltsagchiinGaralt?.jagsaalt?.map((mur,index)=>
                        <div className={`cursor-pointer flex flex-row space-x-2 items-center p-2 rounded-md ${khariltsagch?._id === mur?._id ? 'bg-green-100' : ''} `} key={mur?._id} onClick={()=>{
                                setKhariltsagch(mur)
                            }}>
                            <div className="w-10 h-10 flex-none image-fit rounded-full relative">
                                <img alt="Rubick" className="rounded-full" src="/profile.svg"/>
                                <div className="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="text-xs text-gray-600 truncate text-center">{mur?.ner}</div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export function AppContent({token,khariltsagch}) {

    const [content,setContent] = useState('')
    const [body,onTextChange] = useState('')
    const [title,setTitle] = useState('')
    const [loading,setLoading] = useState(false)

    async function msgIlgeeye() {
        if(loading)
        {
            message.warning('Хүсэлт илгээгдсэн байна')
            return
        }

        setLoading(true)
        uilchilgee(token).post(`/sonorduulgaIlgeeye`,{token:khariltsagch.firebaseToken,medeelel:{title,body}}).then(({data})=>{
            if(!!data?.successCount)
            {
                notification.success({message:'СМС Амжилттай илгээлээ'})
                setLoading(false)
            }
        }).catch(e=>{
            setLoading(false)
            aldaaBarigch(e)
        })
    }

    if(khariltsagch)
    return (
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
            <div className='w-full p-2 mt-auto'>
                <Input placeholder='Гарчиг' value={title} onChange={({target})=>setTitle(target.value)}/>
                <ZagvarUusgekh change={setContent} value={content} onTextChange={onTextChange}/>
            </div>
            
            <div className='w-full flex justify-end items-center space-x-2 p-2'>
                <label className='font-medium'>СМС Илгээх</label>
                <div onClick={msgIlgeeye} className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 block bg-green-600 text-white rounded-full flex-none flex items-center justify-center"> 
                    {loading ? <Spin size='small'/> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg> }
                </div>
            </div>
        </div>
    )

    return (
        <div className="h-full flex items-center box">
            <div className="mx-auto text-center">
                <div className="w-16 h-16 flex-none image-fit rounded-full overflow-hidden mx-auto">
                    <img alt="Rubick Tailwind HTML Admin Template" src="/profile.svg"/>
                </div>
                <div className="mt-3">
                    <div className="font-medium">Өдрийн мэнд</div>
                    <div className="text-gray-600 mt-1">Та Chat илгээх харилцагчаа сонгоно уу.</div>
                </div>
            </div>
        </div>
    )
}

export default App
