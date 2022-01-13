import { Button, Input, message, notification,Popconfirm,Select, Spin, Table } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import useGereeniiJagsaalt from 'hooks/useGereeniiJagsaalt'
import useNekhemjlekh from 'hooks/useNekhemjlekh'
import useMailiinZagvar from 'hooks/useMailiinZagvar'
import ZagvarUusgekh from "components/pageComponents/medegdel/ZagvarUusgekh"
import ZagvarBurtgel from "./ZagvarBurtgel"
import uilchilgee, { aldaaBarigch } from 'services/uilchilgee'
import {modal} from 'components/ant/Modal'
import { DeleteOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons'
import { useAuth } from 'services/auth'
import formatNumber from 'tools/function/formatNumber'
import deleteMethod from 'tools/function/crud/deleteMethod'

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

function SMS({token,baiguullaga,khariltsagch,setKhariltsagch,ilgeekhTurul, setIlgeekhTurul,davkhar}) {

    const {barilgiinId} = useAuth()

    const ref = React.useRef(null)

    const { nekhemjlel, setNekhemjlelKhuudaslalt, nekhemjlelMutate } = useNekhemjlekh(ilgeekhTurul === 'gantsaar' && token, undefined,davkhar,ilgeekhTurul)
    
    const {mailiinZagvarGaralt,mailiinZagvarMutate,setMailiinZagvarKhuudaslalt} = useMailiinZagvar(token,'sms')

    function smsZagvarNemya(data) {
        const footer = [
            <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
            <Button type="primary" onClick={() => ref.current.khadgalya()}>
                Бүртгэл нэмэх
            </Button>,
        ];
        modal({
            title: "SMS Загвар үүсгэх",
            icon: <FileExcelOutlined />,
            content: (
                <ZagvarBurtgel
                    ref={ref}
                    data={data}
                    token={token}
                    turul='sms'
                    barilgiinId={barilgiinId}
                    onRefresh={mailiinZagvarMutate}
                />
            ),
            footer,
        });
    }

    function zagvarUstgaya(mur) {
        deleteMethod('mailiinZagvar',token,mur?._id)
        .then(({data})=>{
            if(data === 'Amjilttai')
                {
                    message.success('Устгагдлаа')
                    mailiinZagvarMutate()
                }
        })
    }
    
    return (
        <>
            <div className="box p-2 mt-5 flex flex-row">
                Нийт илгээгдсэн sms : <span className='font-medium'>1</span>
                <div className='ml-auto'>
                    <Select placeholder='Илгээх төрөл' value={ilgeekhTurul} onChange={setIlgeekhTurul} >
                        {[{key:'buunuur',v:'Бөөнөөр'},{key:'davkharaar',v:'Давхараар'},{key:'avlagaar',v:'Авлагаар'},{key:'gantsaar',v:'Ганцаар'}]
                            .map((a)=><Select.Option key={a.key} value={a.key}>{a.v}</Select.Option>)
                        }
                    </Select>
                </div>
            </div>
            {ilgeekhTurul === 'gantsaar' && <div className="box p-5 mt-5">
                <div className="text-gray-700 dark:text-gray-300">
                    <Input.Search placeholder='Харилцагч хайх /Утас , Нэр, Регистр/' onSearch={search => setNekhemjlelKhuudaslalt(a=>({...a,search}))}/>
                </div>
                <div className="overflow-y-auto scrollbar-hidden h-72 mt-5">
                    {nekhemjlel?.jagsaalt?.map((mur)=>
                        <div className={`cursor-pointer flex flex-row space-x-2 items-center p-2 rounded-md ${khariltsagch?._id === mur?._id ? 'bg-green-100' : ''} `} key={mur?._id} onClick={()=>setKhariltsagch(mur)}>
                            <div className="w-10 h-10 flex-none image-fit rounded-full relative">
                                <img alt="Rubick" className="rounded-full" src="/profile.svg"/>
                                <div className="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="text-xs text-gray-600 truncate text-center">{mur?.ner}</div>
                            <div className="text-xs text-gray-600 truncate text-center">{mur?.gereeniiDugaar}</div>
                        </div>
                    )}
                </div>
            </div>
            }

            <div className="p-2 mt-5 font-medium flex flex-row">
                <div>СМС загвар</div>
                <button className={`cursor-pointer ml-auto py-2 px-4 rounded-md text-center bg-green-500 text-white`} onClick={()=>smsZagvarNemya()}>
                    Загвар үүсгэх
                </button>
            </div>
            {
                mailiinZagvarGaralt?.jagsaalt?.map(a=>(
                    <div key={a.ner} className="intro-x cursor-pointer box relative flex items-center p-2 mt-2" onClick={()=>setter && setter(a.mail)}>
                        <div className="w-8 h-8 flex-none image-fit mr-1 ">
                            <img alt="Rubick Tailwind HTML Admin Template" src="/email.png"/>
                        </div>
                        <div className="ml-2 overflow-hidden mr-1">
                            <div className="flex items-center">
                                <div className="font-medium">{a.ner}</div> 
                            </div>
                            <div className="w-full truncate text-gray-600 mt-0.5" dangerouslySetInnerHTML={{ __html: a.mail }}/>
                        </div>
                        <div className='flex flex-row space-x-2 ml-auto'>
                            <Popconfirm
                                title="Загвар устгах уу?"
                                okText="Тийм"
                                cancelText="Үгүй"
                                onConfirm={() => zagvarUstgaya(a)}
                            >
                                <div className='p-2 bg-red-500 fill-current text-white w-8 h-8 flex items-center justify-center rounded-full'>
                                    <DeleteOutlined/>
                                </div>
                            </Popconfirm>
                            <div className='p-2 bg-yellow-500 fill-current text-white w-8 h-8 flex items-center justify-center rounded-full' onClick={()=>smsZagvarNemya(a)}>
                                <EditOutlined/>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export function SMSContent({khariltsagch,token,ilgeekhTurul,baiguullaga,davkhar,setDavkhar}) {
    const [content,setContent] = useState('')
    const [msj,onTextChange] = useState('')
    const [loading,setLoading] = useState(false)
    const [songogdsonGereenuud,setSongogdsonGereenuud] = useState([])

    const { nekhemjlel, setNekhemjlelKhuudaslalt, nekhemjlelMutate } = useNekhemjlekh(ilgeekhTurul !== 'gantsaar' && token, undefined,davkhar,ilgeekhTurul)
    
    useEffect(()=>{
        setter = setContent
        return ()=> setter = null
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

    async function msgIlgeeye() {
        if(loading)
        {
            message.warning('Хүсэлт илгээгдсэн байна')
            return
        }
        var msgnuud = []
        if(ilgeekhTurul !== 'gantsaar' && songogdsonGereenuud.length > 0)
            msgnuud = songogdsonGereenuud.map(a=>{
                var text = msj
                for (const [key, value] of Object.entries(a)) {
                    text = text?.replace(
                    new RegExp(`<${key}>`, "g"),
                    value
                    );
                }
                return ({
                    to:a.utas,
                    text
                })
            })
        else if(!!khariltsagch)
            msgnuud = [
                        {
                            "to": khariltsagch?.utas,
                            "text": ingeekhmSms
                        }
                    ]
        else 
        {
            message.warning('Та СМС илгээх гэрээгээ сонгоно уу')
            return
        }
        setLoading(true)
        uilchilgee(token).post(`/msgIlgeeye`,{msgnuud}).then(({data})=>{
            if(data && data[0].Result === "SUCCESS")
                {
                    notification.success({message:'СМС Амжилттай илгээлээ'})
                    setLoading(false)
                }
        }).catch(e=>{
            setLoading(false)
            aldaaBarigch(e)
        })
    }

    if(khariltsagch || ilgeekhTurul !== 'gantsaar')
    return (
        <div className="h-full flex flex-col box">
            <div className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-dark-5 px-5 py-4">
                {ilgeekhTurul === 'davkharaar' && <div className='flex flex-row space-x-2'>
                    <div>Давхар сонгох</div>
                    <div className=''>
                        <Select placeholder='Давхар' value={davkhar} onChange={setDavkhar}>
                            {baiguullaga?.barilguud[0]?.davkharuud
                                .map((a)=><Select.Option key={a._id} value={a.davkhar}>{a.davkhar}</Select.Option>)
                            }
                        </Select>
                    </div>
                </div>}
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
            <div className='w-full p-2'>
                {ilgeekhTurul === 'gantsaar' && <div dangerouslySetInnerHTML={{ __html: ingeekhmSms }}/>}
                {ilgeekhTurul !== 'gantsaar' && 
                    <Table 
                        rowKey={(row) => row._id}
                        scroll={{ y: "calc(100vh - 32rem)" }}
                        rowSelection={{
                        type: "checkbox",
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSongogdsonGereenuud(selectedRows)
                        },
                        }}
                        size='small'
                        loading={!nekhemjlel}
                        dataSource={nekhemjlel?.jagsaalt}
                        columns={[{
                            title: "Гэрээний дугаар",
                            dataIndex: "gereeniiDugaar",
                            align: "center"
                        },
                        {
                            title: "Нэр",
                            dataIndex: "ner",
                            align: "left"
                        },
                        {
                            title: "Талбайн дугаар",
                            dataIndex: "talbainDugaar",
                            align: "center"
                        },
                        {
                            title: "Утасны дугаар",
                            dataIndex: "utas",
                            align: "center"
                        },
                        {
                            title: "Сарийн түрээс",
                            dataIndex: "sariinTurees",
                            align: "center",
                            render: (sariinTurees) => {
                              return formatNumber(sariinTurees || 0)
                            },
                          },
                    ]}
                    pagination={{
                        showTotal:(total)=><div>Нийт: {total}</div>,
                        current: nekhemjlel?.khuudasniiDugaar,
                        pageSize: nekhemjlel?.khuudasniiKhemjee,
                        total: nekhemjlel?.niitMur,
                        showSizeChanger: true,
                        onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                        setNekhemjlelKhuudaslalt((kh) => ({
                            ...kh,
                            khuudasniiDugaar,
                            khuudasniiKhemjee,
                          })),
                      }}
                    />
                }
            </div>
            <div className='w-full p-2 mt-auto'>
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
                    <div className="text-gray-600 mt-1">Та СМС илгээх харилцагчаа сонгоно уу.</div>
                </div>
            </div>
        </div>
    )
}

export default SMS
