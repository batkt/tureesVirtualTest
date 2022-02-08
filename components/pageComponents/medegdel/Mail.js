import { Button, Input, Popconfirm } from 'antd'
import React from 'react'
import useGereeniiJagsaalt from 'hooks/useGereeniiJagsaalt'
import { useAuth } from 'services/auth'
import useNekhemjlekh from 'hooks/useNekhemjlekh'
import useMailiinZagvar from 'hooks/useMailiinZagvar'
import { modal } from 'components/ant/Modal'
import { DeleteOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons'
import ZagvarBurtgel from './ZagvarBurtgel'
import deleteMethod from 'tools/function/crud/deleteMethod'
var setter = null
function Mail({
    token,
    khariltsagch,
    setKhariltsagch,
    ilgeekhTurul,
    setTurul,
    davkhar,
    turul
  }) {
    const { barilgiinId } = useAuth()
  
    const ref = React.useRef(null)
  
    const { nekhemjlel, setNekhemjlelKhuudaslalt, nekhemjlelMutate } =
    useNekhemjlekh(
      ilgeekhTurul === "gantsaar" && token,
      undefined,
      davkhar,
      ilgeekhTurul
    )
      
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
                <div
                  className="w-full truncate text-gray-600 mt-0.5"
                  dangerouslySetInnerHTML={{ __html: a.mail }}
                />
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
