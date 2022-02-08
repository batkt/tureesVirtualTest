//#region import
import Admin from "components/Admin"
import { useEffect, useState,useRef,useMemo } from "react"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import { useAuth } from "services/auth"
import useMedegdel from "hooks/medegdel/useMedegdel"
import useMailiinZagvar from "hooks/useMailiinZagvar"
import { Button, Input, notification, Popconfirm, Select, Spin, Table } from "antd"
import { DeleteOutlined, EditOutlined, FileExcelOutlined } from "@ant-design/icons"
import moment from "moment"
import ZagvarBurtgel from "components/pageComponents/medegdel/ZagvarBurtgel"
import ZagvarUusgekh from "components/pageComponents/medegdel/ZagvarUusgekh"
import deleteMethod from "tools/function/crud/deleteMethod"
import useSWR from "swr"
import formatNumber from "tools/function/formatNumber"
import useSanalGomdol from "hooks/medegdel/useSanalGomdol"
import uilchilgee, { aldaaBarigch } from "services/uilchilgee"
//#endregion

var timeout = null

function IlgeesenToo({barilgiinId,baiguullagiinId,ekhlekhOgnoo,duusakhOgnoo,token}) {
  const {data} = useSWR(['msgIlgeesenTooAvya',barilgiinId,baiguullagiinId],(url,barilgiinId,baiguullagiinId)=>createMethod(url,token,{barilgiinId,baiguullagiinId,ekhlekhOgnoo,duusakhOgnoo}).then(a=>a.data))
  return (
    <>
      Нийт илгээгдсэн sms : <span className="font-medium">{data}</span>
    </>
  )
}

function Khyanalt({ token }) {
  //#region const
  const { baiguullaga,barilgiinId } = useAuth()
  const [turul, setTurul] = useState("СМС")
  const [khariltsagch, setKhariltsagch] = useState(null)
  const [davkhar, setDavkhar] = useState(null)
  const [content, setContent] = useState("")
  const [msj, onTextChange] = useState("")
  const [loading, setLoading] = useState(false)
  const [title,setTitle] = useState('')
  const [songogdsonGereenuud, setSongogdsonGereenuud] = useState([])
  /**Илгээх төрөл
   * enum {buunuur | davkharaar | avlagaar | gantsaar}
   *  */
  const [ilgeekhTurul, setIlgeekhTurul] = useState("gantsaar")

  const ref = useRef(null)

  const { nekhemjlel, setNekhemjlelKhuudaslalt, nekhemjlelMutate } = useMedegdel(token,undefined,davkhar,ilgeekhTurul)
    
  const {
    mailiinZagvarGaralt,
    mailiinZagvarMutate
  } = useMailiinZagvar(token, "sms")

  const {sonorduulga,sonorduulgaMutate,khariltsagchiinId,firebaseToken} = useSanalGomdol(turul === 'Апп' && token,khariltsagch?.register)

  useEffect(() => {
    setKhariltsagch(null)
    if (ilgeekhTurul !== "davkharaar") setDavkhar(null)
  }, [ilgeekhTurul])

  useEffect(() => {
    setKhariltsagch(null)
    setDavkhar(null)
  }, [turul])

  const ingeekhmSms = useMemo(() => {
    if (!khariltsagch) return msj
    var utga = msj
    for (const [key, value] of Object.entries(khariltsagch)) {
      utga = utga?.replace(new RegExp(`<${key}>`, "g"), value)
    }
    return utga
  }, [khariltsagch, msj])
  //#endregion

  //#region method

  async function appIlgeeye() {
    if(loading)
    {
        message.warning('Хүсэлт илгээгдсэн байна')
        return
    }

    setLoading(true)
    uilchilgee(token).post(`/sonorduulgaIlgeeye`,{firebaseToken:firebaseToken,khariltsagchiinId:khariltsagchiinId,barilgiinId:khariltsagch.barilgiinId,khariltsagchiinNer:khariltsagch.ner,medeelel:{title,body:ingeekhmSms}}).then(({data})=>{
        if(!!data?.successCount)
        {
            sonorduulga.jagsaalt.unshift({khariltsagchiinId:khariltsagchiinId,barilgiinId:khariltsagch.barilgiinId,khariltsagchiinNer:khariltsagch.ner,title,message:ingeekhmSms,turul:'medegdel'})
            sonorduulgaMutate({...sonorduulga},false)
            notification.success({message:'СМС Амжилттай илгээлээ'})
            setLoading(false)
        }
        else if(!!data?.failureCount)
        {
            notification.warning({description:_.get(data,'results.0.error.message'),message:_.get(data,'results.0.error.code')})
            setLoading(false)
        }
    }).catch(e=>{
        setLoading(false)
        aldaaBarigch(e)
    })
  }

  async function msgIlgeeye() {
    if (loading) {
      message.warning("Хүсэлт илгээгдсэн байна")
      return
    }
    var msgnuud = []
    if (ilgeekhTurul !== "gantsaar" && songogdsonGereenuud.length > 0)
      songogdsonGereenuud.map((a) => {
        var text = msj
        for (const [key, value] of Object.entries(a)) {
          text = text?.replace(new RegExp(`<${key}>`, "g"), value)
        }
        if(_.isArray(a.utas))
          a.utas.map(to=>msgnuud.push({
            to,
            text,
          }))
        else
        msgnuud.push({
          to: a.utas,
          text,
        })
      })
    else if (!!khariltsagch){
      if(_.isArray(khariltsagch?.utas))
        khariltsagch?.utas.map(to=>msgnuud.push({
            to,
            text: ingeekhmSms,
          }))
        else
        msgnuud.push({
          to: khariltsagch?.utas,
          text: ingeekhmSms,
        })
    }
    else {
      message.warning("Та СМС илгээх гэрээгээ сонгоно уу")
      return
    }
    if(!(msgnuud.length > 0))
    {
      message.warning("Илгээх мэдээлэл байхгүй байна")
      return
    }
    setLoading(true)
    uilchilgee(token)
      .post(`/msgIlgeeye`, {barilgiinId, msgnuud })
      .then(({ data }) => {
        if (data && data[0].Result === "SUCCESS") {
          notification.success({ message: "СМС Амжилттай илгээлээ" })
          setLoading(false)
        }
      })
      .catch((e) => {
        setLoading(false)
        aldaaBarigch(e)
      })
  }

  function send(){
    turul === 'Апп' ? appIlgeeye() : msgIlgeeye()
  }

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
  //#endregion

  return (
    <Admin title="Мэдэгдэл" khuudasniiNer="medegdel" className="p-0 md:p-4" onSearch={(search) => setNekhemjlelKhuudaslalt(a=>({...a,search}))}>
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
        <div className="box p-2 mt-5 flex flex-row items-center">
          <IlgeesenToo barilgiinId={barilgiinId} baiguullagiinId={baiguullaga?._id} ekhlekhOgnoo={moment().startOf('month')} duusakhOgnoo={moment().endOf('month')} token={token}/>
          <div className="ml-auto">
            <Select
              placeholder="Илгээх төрөл"
              value={ilgeekhTurul}
              onChange={setIlgeekhTurul}
            >
              {[
                { key: "buunuur", v: "Бөөнөөр" },
                { key: "davkharaar", v: "Давхараар" },
                { key: "avlagaar", v: "Авлагаар" },
                { key: "gantsaar", v: "Ганцаар" },
              ].map((a) => (
                <Select.Option key={a.key} value={a.key}>
                  {a.v}
                </Select.Option>
              ))}
            </Select>
          </div>
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
            onClick={() => setContent(a.mail)}
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
                setNekhemjlelKhuudaslalt((a) => ({ ...a, search }))
              }
              onChange={({target})=>{
                  clearTimeout(timeout);
                  timeout = setTimeout(function () {
                    setNekhemjlelKhuudaslalt((a) => ({ ...a, search:target.value }))
                  }, 300);
              }}
            />
          </div>
          <div className="overflow-y-auto scrollbar-hidden mt-5" style={{height:'calc(100vh - 13rem)'}}>
            {nekhemjlel?.jagsaalt?.map((mur) => (
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
      <div
        className={`intro-y col-span-12 lg:col-span-6 xl:col-span-6 ${ilgeekhTurul === "gantsaar" ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-9 xl:col-span-9'}`}
        style={{ height: "calc(100vh - 7rem)" }}
      >
        {khariltsagch || ilgeekhTurul !== "gantsaar" ?
          <div className="h-full flex flex-col box">
          <div className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-dark-5 px-5 py-4">
            {ilgeekhTurul === "davkharaar" && (
              <div className="flex flex-row space-x-2">
                <div>Давхар сонгох</div>
                <div className="">
                  <Select
                    placeholder="Давхар"
                    value={davkhar}
                    onChange={setDavkhar}
                    allowClear
                  >
                    {baiguullaga?.barilguud[0]?.davkharuud.map((a) => (
                      <Select.Option key={a._id} value={a.davkhar}>
                        {a.davkhar}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
            {khariltsagch && (
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit relative">
                  <img
                    alt="Rubick Tailwind HTML Admin Template"
                    className="rounded-full"
                    src="/profile.svg"
                  />
                </div>
                <div className="ml-3 mr-auto">
                  <div className="font-medium text-base">{khariltsagch?.ner}</div>
                  <div className="text-gray-600 text-xs sm:text-sm">
                    {khariltsagch?.utas} <span className="mx-1">•</span> SMS
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center ml-auto space-x-2 font-medium"></div>
          </div>
          <div className="w-full">
            {ilgeekhTurul === "gantsaar" && (
              turul === 'Апп' ? 
                <div className='p-5 overflow-y-auto flex flex-col-reverse' style={{maxHeight:'calc(100vh - 27rem)'}}>
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
              :
              <div dangerouslySetInnerHTML={{ __html: ingeekhmSms }} />
            )}
            {ilgeekhTurul !== "gantsaar" && (
              <Table
                rowKey={(row) => row._id}
                scroll={{ y: "calc(100vh - 32rem)" }}
                rowSelection={{
                  type: "checkbox",
                  onChange: (selectedRowKeys, selectedRows) => {
                    setSongogdsonGereenuud(selectedRows)
                  },
                }}
                size="small"
                loading={!nekhemjlel}
                dataSource={nekhemjlel?.jagsaalt}
                columns={[
                  {
                    title: "Гэрээний дугаар",
                    dataIndex: "gereeniiDugaar",
                    align: "center",
                  },
                  {
                    title: "Нэр",
                    dataIndex: "ner",
                    align: "left",
                  },
                  {
                    title: "Талбайн дугаар",
                    dataIndex: "talbainDugaar",
                    align: "center",
                  },
                  {
                    title: "Утасны дугаар",
                    dataIndex: "utas",
                    align: "center",
                  },
                  {
                    title: "Сарийн түрээс",
                    dataIndex: "sariinTurees",
                    align: "center",
                    render: (sariinTurees) => {
                      return formatNumber(sariinTurees || 0)
                    },
                  },
                  {
                    title: "Энэ сард төлөх дүн",
                    dataIndex: "eneSardTulukhDun",
                    align: "center",
                    render: (eneSardTulukhDun) => {
                      return formatNumber(eneSardTulukhDun || 0)
                    },
                  },
                  {
                    title: "Нийт үлдэгдэл",
                    dataIndex: "niitUldegdel",
                    align: "center",
                    render: (niitUldegdel) => {
                      return formatNumber(niitUldegdel || 0)
                    },
                  },
                ]}
                pagination={{
                  showTotal: (total) => <div>Нийт: {total}</div>,
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
            )}
          </div>
          <div className="w-full p-2 mt-auto">
            {turul === 'Апп' && <Input placeholder='Гарчиг' value={title} onChange={({target})=>setTitle(target.value)}/>}
            <ZagvarUusgekh
              change={setContent}
              value={content}
              onTextChange={onTextChange}
            />
          </div>
  
          <div className="w-full flex justify-end items-center space-x-2 p-2">
            <label className="font-medium">СМС Илгээх</label>
            <div
              onClick={send}
              className={`cursor-pointer w-8 h-8 sm:w-10 sm:h-10 bg-green-${loading ?  "200" : "600"} text-white rounded-full flex-none flex items-center justify-center`}
            >
              {loading ? (
                <Spin size="small" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </div>
          </div>
        </div>
        :
        <div className="h-full flex items-center box">
          <div className="mx-auto text-center">
            <div className="w-16 h-16 flex-none image-fit rounded-full overflow-hidden mx-auto">
              <img alt="Rubick Tailwind HTML Admin Template" src="/profile.svg" />
            </div>
            <div className="mt-3">
              <div className="font-medium">Өдрийн мэнд</div>
              <div className="text-gray-600 mt-1">
                Та СМС илгээх харилцагчаа сонгоно уу.
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default Khyanalt
