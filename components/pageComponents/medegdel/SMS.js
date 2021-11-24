import { Input } from 'antd'
import React, { useMemo, useState } from 'react'
import useKhariltsagch from 'hooks/useKhariltsagch'
import ZagvarUusgekh from "components/pageComponents/medegdel/ZagvarUusgekh"
import uilchilgee from 'services/uilchilgee'
function SMS({token,baiguullaga,khariltsagch,setKhariltsagch}) {
    const {khariltsagchiinGaralt,setKhuudaslalt} = useKhariltsagch(token,baiguullaga?._id)

    return (
        <>
            <div className="box px-5 pt-5 pb-5 lg:pb-0 mt-5">
                <div className="text-gray-700 dark:text-gray-300">
                    <Input.Search onSearch={search => setKhuudaslalt(a=>({...a,search}))}/>
                </div>
                <div className="overflow-x-auto scrollbar-hidden">
                    <div className="flex mt-5">
                        {khariltsagchiinGaralt?.jagsaalt?.map((mur,index)=>
                            <div className="w-10 mr-4 cursor-pointer" index={index} onClick={()=>setKhariltsagch(mur)}>
                                <div className="w-10 h-10 flex-none image-fit rounded-full relative">
                                    <img alt="Rubick" className="rounded-full" src="/profile.svg"/>
                                    <div className="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="text-xs text-gray-600 truncate text-center mt-2">{mur?.ner}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div class="intro-x cursor-pointer box relative flex items-center p-5 mt-5">
                <div class="w-12 h-12 flex-none image-fit mr-1">
                    <img alt="Rubick Tailwind HTML Admin Template" class="rounded-full" src="/profile.svg"/>
                    <div class="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
                </div>
                <div class="ml-2 overflow-hidden">
                    <div class="flex items-center">
                        <div class="font-medium">Brad Pitt</div> 
                        <div class="text-xs text-gray-500 ml-auto">01:10 PM</div>
                    </div>
                    <div class="w-full truncate text-gray-600 mt-0.5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500</div>
                </div>
                <div class="w-5 h-5 flex items-center justify-center absolute top-0 right-0 text-xs text-white rounded-full bg-theme-1 font-medium -mt-1 -mr-1">4</div>
            </div>
        </>
    )
}


export function SMSContent({khariltsagch,token}) {
    const [content,setContent] = useState('')
    const [msj,onTextChange] = useState('')
    
    const ingeekhmSms = useMemo(()=>{
        if(!khariltsagch)
            return content
        var utga = content
        for (const [key, value] of Object.entries(khariltsagch)) {
            utga = utga?.replace(
              new RegExp(`&lt;${key}&gt;`, "g"),
              value
            );
          }
        return utga
    },[khariltsagch,content])

    function msgIlgeeye() {
        uilchilgee(token).post('/msgIlgeeye',{
            "msgnuud": [
                {
                    "to":khariltsagch?.utas,
                    "text": msj
                }
            ]
        })
    }

    if(khariltsagch)
    return (
        <div className="h-full flex flex-col box">
            <div class="flex flex-col sm:flex-row border-b border-gray-200 dark:border-dark-5 px-5 py-4">
                <div class="flex items-center">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit relative">
                        <img alt="Rubick Tailwind HTML Admin Template" class="rounded-full" src="/profile.svg"/>
                    </div>
                    <div class="ml-3 mr-auto">
                        <div class="font-medium text-base">{khariltsagch?.ner}</div>
                        <div class="text-gray-600 text-xs sm:text-sm">{khariltsagch?.utas} <span class="mx-1">•</span> SMS</div>
                    </div>
                </div>
                
            </div>
            <div className='w-full p-2'>
                <div dangerouslySetInnerHTML={{ __html: ingeekhmSms }}/>
            </div>
            <div className='w-full p-2'>
                {/* <Input.TextArea onChange={(e)=>onTextChange(e.target.value)} value={msj}/> */}
                <ZagvarUusgekh change={setContent} value={content} onTextChange={onTextChange}/>
            </div>
            
            <div className='w-full flex justify-end'>
                <div onClick={msgIlgeeye} className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 block bg-theme-1 text-white rounded-full flex-none flex items-center justify-center mr-5"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg> 
                </div>
            </div>
        </div>
    )
    return (
        <div class="h-full flex items-center box">
            <div class="mx-auto text-center">
                <div class="w-16 h-16 flex-none image-fit rounded-full overflow-hidden mx-auto">
                    <img alt="Rubick Tailwind HTML Admin Template" src="/profile.svg"/>
                </div>
                <div class="mt-3">
                    <div class="font-medium">Hey, Brad Pitt!</div>
                    <div class="text-gray-600 mt-1">Please select a chat to start messaging.</div>
                </div>
            </div>
        </div>
    )
}

export default SMS
