import { Button, Input, notification, Popconfirm, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import useKhariltsagch from 'hooks/useKhariltsagch'
import useSanalGomdol from 'hooks/useSanalGomdol'
import ZagvarUusgekh from './ZagvarUusgekh'
import uilchilgee, { aldaaBarigch } from 'services/uilchilgee'
import moment from 'moment'
import { useAuth } from 'services/auth'
import useMailiinZagvar from 'hooks/useMailiinZagvar'
import { DeleteOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons'
import { putSetter } from "pages/khyanalt/medegdel"
import ZagvarBurtgel from './ZagvarBurtgel'
import { modal } from 'components/ant/Modal'

var setter = null
const query = {firebaseToken:{$exists:true}}

function App({
    token,
    khariltsagch,
    setKhariltsagch,
    ilgeekhTurul,
    setTurul,
    turul
  }) {
    const { barilgiinId,baiguullaga } = useAuth()
  
    const ref = React.useRef(null)
  
    const {khariltsagchiinGaralt,setKhuudaslalt} = useKhariltsagch(token,baiguullaga?._id,undefined,query)
      
    const {
      mailiinZagvarGaralt,
      mailiinZagvarMutate
    } = useMailiinZagvar(token, "sms")
  
    function smsZagvarNemya(data) {
      const footer = [
        <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
        <Button type="primary" onClick={() => ref.current.khadgalya()}>
          Бүртгэл нэмэх
        </Button>,
      ]
      modal({
        title: "SMS Загвар үүсгэх",
        icon: <FileExcelOutlined />,
        content: (
          <ZagvarBurtgel
            ref={ref}
            data={data}
            token={token}
            turul="sms"
            barilgiinId={barilgiinId}
            onRefresh={mailiinZagvarMutate}
          />
        ),
        footer,
      })
    }
  
    function zagvarUstgaya(mur) {
      deleteMethod("mailiinZagvar", token, mur?._id).then(({ data }) => {
        if (data === "Amjilttai") {
          message.success("Устгагдлаа")
          mailiinZagvarMutate()
        }
      })
    }
  
    return (
      <>
        <div className="col-span-12 lg:col-span-3 xl:col-span-3">
          <div className="intro-y pr-1">
            <div className="box p-2">
              <div className="grid grid-cols-3 gap-1 font-medium" role="tablist">
                {["СМС", "Апп", "Мэйл"].map((mur) => (
                  <div
                    className={`cursor-pointer flex-1 py-2 rounded-md text-center ${
                      turul === mur ? "bg-green-500 text-white" : ""
                    }`}
                    onClick={() => setTurul(mur)}
                  >
                    {mur}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="box p-2 mt-5 flex flex-row">
            Нийт илгээгдсэн sms : <span className="font-medium">1</span>
          </div>
          <div className="p-2 mt-5 font-medium flex flex-row">
            <div>СМС загвар</div>
            <button
              className={`cursor-pointer ml-auto py-2 px-4 rounded-md text-center bg-green-500 text-white`}
              onClick={() => smsZagvarNemya()}
            >
              Загвар үүсгэх
            </button>
          </div>
          <div className="overflow-y-auto scrollbar-hidden" style={{height:'calc(100vh - 25rem)'}}>
          {mailiinZagvarGaralt?.jagsaalt?.map((a) => (
            <div
              key={a.ner}
              className="intro-x cursor-pointer box relative flex items-center p-2 mt-2"
              onClick={() => setter && setter(a.mail)}
            >
              <div className="w-8 h-8 flex-none image-fit mr-1 ">
                <img alt="Rubick Tailwind HTML Admin Template" src="/email.png" />
              </div>
              <div className="ml-2 overflow-hidden mr-1">
                <div className="flex items-center">
                  <div className="font-medium">{a.ner}</div>
                </div>
              </div>
              <div className="flex flex-row space-x-2 ml-auto">
                <Popconfirm
                  title="Загвар устгах уу?"
                  okText="Тийм"
                  cancelText="Үгүй"
                  onConfirm={() => zagvarUstgaya(a)}
                >
                  <div className="p-2 bg-red-500 fill-current text-white w-8 h-8 flex items-center justify-center rounded-full">
                    <DeleteOutlined />
                  </div>
                </Popconfirm>
                <div
                  className="p-2 bg-yellow-500 fill-current text-white w-8 h-8 flex items-center justify-center rounded-full"
                  onClick={() => smsZagvarNemya(a)}
                >
                  <EditOutlined />
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
        <div className={`col-span-12 lg:col-span-3 xl:col-span-3 ${ilgeekhTurul === "gantsaar" ? '' : 'hidden'}`}>
        {ilgeekhTurul === "gantsaar" && (
          <div className="box p-5">
            <div className="text-gray-700 dark:text-gray-300">
              <Input.Search
                placeholder="Харилцагч хайх /Утас , Нэр, Регистр/"
                onSearch={(search) =>
                    setKhuudaslalt((a) => ({ ...a, search }))
                }
              />
            </div>
            <div className="overflow-y-auto scrollbar-hidden mt-5" style={{height:'calc(100vh - 13rem)'}}>
              {khariltsagchiinGaralt?.jagsaalt?.map((mur) => (
                <div
                  className={`cursor-pointer flex flex-row space-x-2 items-center p-2 rounded-md ${
                    khariltsagch?._id === mur?._id ? "bg-green-100" : ""
                  } `}
                  key={mur?._id}
                  onClick={() => setKhariltsagch(mur)}
                >
                  <div className="w-10 h-10 flex-none image-fit rounded-full relative">
                    <img
                      alt="Rubick"
                      className="rounded-full"
                      src="/profile.svg"
                    />
                    <div className="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-xs text-gray-600 truncate text-center">
                    {mur?.ner}
                  </div>
                  <div className="text-xs text-gray-600 truncate text-center">
                    {mur?.gereeniiDugaar}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </>
    )
  }

export function AppContent({token,khariltsagch,ilgeekhTurul}) {

    const [content,setContent] = useState('')
    const [body,onTextChange] = useState('')
    const [title,setTitle] = useState('')
    const [loading,setLoading] = useState(false)
    const {sonorduulga,sonorduulgaMutate} = useSanalGomdol(token,khariltsagch?._id)

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

    if(ilgeekhTurul !== "gantsaar")
    putSetter(setNekhemjlelKhuudaslalt)

    useEffect(() => {
        setter = setContent
        return () => (setter = null)
    }, [content])

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
            <div className='p-5 overflow-y-auto flex flex-col-reverse' style={{maxHeight:'calc(100vh - 25rem)'}}>
                {
                    sonorduulga?.jagsaalt?.map((a,i)=>{
                        return(
                            <div className={`relative w-1/3 p-3 bg-green-500 rounded-xl border border-green-200 flex flex-col mt-8  ${a.turul === 'medegdel' ? 'bg-blue-500 ml-auto rounded-br-none' : 'rounded-bl-none'}`}>
                                <span className='text-white'>{a.message}</span>
                                <span className='text-gray-500 font-medium text-xs absolute -bottom-5'>{moment(a.createdAt).format('YYYY-MM-DD hh:mm')}</span>
                                <span className='text-gray-500 right-0 absolute -bottom-5'>{a.turul}</span>
                            </div>
                        )
                    })
                }
            </div>
            <div className='w-full p-2 mt-auto'>
                <Input placeholder='Гарчиг' value={title} onChange={({target})=>setTitle(target.value)}/>
                <ZagvarUusgekh change={setContent} value={content} onTextChange={onTextChange}/>
            </div>
            
            <div className='w-full flex justify-end items-center space-x-2 p-2'>
                <label className='font-medium'>СМС Илгээх</label>
                <div onClick={msgIlgeeye} className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 bg-green-600 text-white rounded-full flex-none flex items-center justify-center"> 
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
