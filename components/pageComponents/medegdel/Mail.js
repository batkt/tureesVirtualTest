import { Input } from 'antd'
import React from 'react'
import useGereeniiJagsaalt from 'hooks/useGereeniiJagsaalt'
function Mail({token,baiguullaga,khariltsagch,setKhariltsagch}) {
    const {gereeniiMedeelel,setGereeniiKhuudaslalt} = useGereeniiJagsaalt(token,baiguullaga?._id)

    return (
        <>
            <div className="box p-5 mt-5">
                <div className="text-gray-700 dark:text-gray-300">
                    <Input.Search placeholder='Харилцагч хайх /Утас , Нэр, Регистр/' onSearch={search => setGereeniiKhuudaslalt(a=>({...a,search}))}/>
                </div>
                <div className="overflow-y-auto scrollbar-hidden h-80 mt-5">
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
        </>
    )
}


export function MailContent() {
    return (
        <div className="h-full flex items-center box">
            <div className="mx-auto text-center">
                <div className="w-16 h-16 flex-none image-fit rounded-full overflow-hidden mx-auto">
                    <img alt="Rubick Tailwind HTML Admin Template" src="/profile.svg"/>
                </div>
                <div className="mt-3">
                    <div className="font-medium">Өдрийн мэнд</div>
                    <div className="text-gray-600 mt-1">Та Mail илгээх харилцагчаа сонгоно уу.</div>
                </div>
            </div>
        </div>
    )
}

export default Mail
