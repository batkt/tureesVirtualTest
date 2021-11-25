import { Input, notification } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import useGereeniiJagsaalt from 'hooks/useGereeniiJagsaalt'
import ZagvarUusgekh from "components/pageComponents/medegdel/ZagvarUusgekh"
import uilchilgee from 'services/uilchilgee'

var setter = null

const smszagvar = [
    {
        ner:'Авлага',
        content:'Сайн байна уу. Таны &lt;gereeniiDugaar&gt; гэрээний дугаартай &lt;talbainDugaar&gt;​ тоот талбайн 8​,9,10​-р сарын төлбөрийн үлдэгдэл &lt;sariinTurees&gt;​₮ байна. Та төлбөрөө 12-р сарын 31-ны өдрөөс өмнө шилжүүлнэ үү! Их Наяд Плаза '
    },
    {
        ner:'Сарын түрээс',
        content:'Сайн байна уу. Таны &lt;gereeniiDugaar&gt; гэрээний дугаартай &lt;talbainDugaar&gt;​ тоот талбайн 11-сар түрээсийн төлбөр&lt;sariinTurees&gt;​₮ байна. Та төлбөрөө сардаа багтаан төлнө үү. Их Наяд Плаза '
    },
    {
        ner:'Мэдээлэл',
        content:'Бид үйлчилгээний чанарыг сайжруулан өвлийн жаварын үргээхээр автомат робот ашиглан "Дулаан уриаг" бий болгон угтах үйлчилгээг хэрэгжүүлж эхлэлээ. Их Наяд Плаза'
    },
    {
        ner:'Амжилттай',
        content:'Таны 11-р сарын түрээсийн төлбөр амжилттай хийгдлээ. Төлөлтөө хугацаанд нь хийсэн түрээслэгч танд баярлалаа. Их Наяд Плаза'
    }
]

function SMS({token,baiguullaga,khariltsagch,setKhariltsagch}) {
    const {gereeniiMedeelel,setGereeniiKhuudaslalt} = useGereeniiJagsaalt(token,baiguullaga?._id)

    return (
        <>
            <div className="box p-2 mt-5">
                Нийт илгээгдсэн sms : <span className='font-medium'>1</span>
            </div>
            <div className="box p-5 mt-5">
                <div className="text-gray-700 dark:text-gray-300">
                    <Input.Search placeholder='Харилцагч хайх /Утас , Нэр, Регистр/' onSearch={search => setGereeniiKhuudaslalt(a=>({...a,search}))}/>
                </div>
                <div className="overflow-y-auto scrollbar-hidden h-72 mt-5">
                    {gereeniiMedeelel?.jagsaalt?.map((mur,index)=>
                        <div className={`cursor-pointer flex flex-row space-x-2 items-center p-2 rounded-md ${khariltsagch?._id === mur?._id ? 'bg-green-100' : ''} `} key={mur?._id} onClick={()=>setKhariltsagch(mur)}>
                            <div className="w-10 h-10 flex-none image-fit rounded-full relative">
                                <img alt="Rubick" className="rounded-full" src="/profile.svg"/>
                                <div className="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="text-xs text-gray-600 truncate text-center">{mur?.ner}</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-2 mt-5 font-medium">
                СМС загвар
            </div>
            {
                smszagvar.map(a=>(
                    <div key={a.ner} className="intro-x cursor-pointer box relative flex items-center p-2 mt-2" onClick={()=>setter && setter(a.content)}>
                        <div className="w-8 h-8 flex-none image-fit mr-1 ">
                            <img alt="Rubick Tailwind HTML Admin Template" src="/email.png"/>
                            {/* <div className="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white"></div> */}
                        </div>
                        <div className="ml-2 overflow-hidden">
                            <div className="flex items-center">
                                <div className="font-medium">{a.ner}</div> 
                                <div className="text-xs text-gray-500 ml-auto">01:10 PM</div>
                            </div>
                            <div className="w-full truncate text-gray-600 mt-0.5" dangerouslySetInnerHTML={{ __html: a.content }}  ></div>
                        </div>
                        {/* <div className="w-5 h-5 flex items-center justify-center absolute top-0 right-0 text-xs text-white rounded-full bg-theme-1 font-medium -mt-1 -mr-1">4</div> */}
                    </div>
                ))
            }
        </>
    )
}


export function SMSContent({khariltsagch,token}) {
    const [content,setContent] = useState('')
    const [msj,onTextChange] = useState('')
    useEffect(()=>{
        setter = setContent
    },[content])
    const ingeekhmSms = useMemo(()=>{
        if(!khariltsagch)
            return msj
        var utga = msj
        for (const [key, value] of Object.entries(khariltsagch)) {
            utga = utga?.replace(
              new RegExp(`<${key}>`, "g"),
              value
            );
          }
        return utga
    },[khariltsagch,msj])

    function msgIlgeeye() {
        uilchilgee(token).post('/msgIlgeeye',{
            "msgnuud": [
                {
                    "to":"88043808",
                    "text": ingeekhmSms
                }
            ]
        }).then(({data})=>{
            if(data && data[0].Result === "SUCCESS")
                {
                    notification.success({message:'СМС Амжилттай илгээлээ'})
                }
        })
    }

    if(khariltsagch)
    return (
        <div className="h-full flex flex-col box">
            <div className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-dark-5 px-5 py-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit relative">
                        <img alt="Rubick Tailwind HTML Admin Template" className="rounded-full" src="/profile.svg"/>
                    </div>
                    <div className="ml-3 mr-auto">
                        <div className="font-medium text-base">{khariltsagch?.ner}</div>
                        <div className="text-gray-600 text-xs sm:text-sm">{khariltsagch?.utas} <span className="mx-1">•</span> SMS</div>
                    </div>
                </div>
            </div>
            <div className='w-full p-2'>
                <div dangerouslySetInnerHTML={{ __html: ingeekhmSms }}/>
            </div>
            <div className='w-full p-2 mt-auto'>
                {/* <Input.TextArea onChange={(e)=>onTextChange(e.target.value)} value={msj}/> */}
                <ZagvarUusgekh change={setContent} value={content} onTextChange={onTextChange}/>
            </div>
            
            <div className='w-full flex justify-end items-center space-x-2 p-2'>
                <label className='font-medium'>СМС Илгээх</label>
                <div onClick={msgIlgeeye} className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 block bg-green-600 text-white rounded-full flex-none flex items-center justify-center"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg> 
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
                    <div className="text-gray-600 mt-1">Та СМС илгээх харилцагчаа сонгоно уу.</div>
                </div>
            </div>
        </div>
    )
}

export default SMS
