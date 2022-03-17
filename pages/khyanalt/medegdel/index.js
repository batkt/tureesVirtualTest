//#region import
import Admin from "components/Admin"
import { useEffect, useState, useRef, useMemo } from "react"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import { useAuth } from "services/auth"
import useMedegdel from "hooks/medegdel/useMedegdel"
import useMailiinZagvar from "hooks/useMailiinZagvar"
import {
  Button,
  Input,
  notification,
  Popconfirm,
  Select,
  Spin,
  Table,
} from "antd"
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
} from "@ant-design/icons"
import moment from "moment"
import ZagvarBurtgel from "components/pageComponents/medegdel/ZagvarBurtgel"
import ZagvarUusgekh from "components/pageComponents/medegdel/ZagvarUusgekh"
import deleteMethod from "tools/function/crud/deleteMethod"
import createMethod from "tools/function/crud/createMethod"
import useSWR from "swr"
import formatNumber from "tools/function/formatNumber"
import useSanalGomdol from "hooks/medegdel/useSanalGomdol"
import uilchilgee, { aldaaBarigch } from "services/uilchilgee"
import { modal } from "components/ant/Modal"
//#endregion

var timeout = null

function IlgeesenToo({
  barilgiinId,
  baiguullagiinId,
  ekhlekhOgnoo,
  duusakhOgnoo,
  token,
}) {
  const { data } = useSWR(
    ["msgIlgeesenTooAvya", barilgiinId, baiguullagiinId],
    (url, barilgiinId, baiguullagiinId) =>
      createMethod(url, token, {
        barilgiinId,
        baiguullagiinId,
        ekhlekhOgnoo,
        duusakhOgnoo,
      }).then((a) => a.data)
  )
  return (
    <>
      Нийт илгээгдсэн : <span className="font-medium">{data || 0}</span>
    </>
  )
}

function Khyanalt({ token }) {
  //#region const
  const { baiguullaga, barilgiinId } = useAuth()
  const [turul, setTurul] = useState("SMS")
  const [khariltsagch, setKhariltsagch] = useState(null)
  const [davkhar, setDavkhar] = useState(null)
  const [content, setContent] = useState("")
  const [msj, onTextChange] = useState("")
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [songogdsonGereenuud, setSongogdsonGereenuud] = useState([])
  /**Илгээх төрөл
   * enum {buunuur | davkharaar | avlagaar | gantsaar}
   *  */
  const [ilgeekhTurul, setIlgeekhTurul] = useState("gantsaar")

  const ref = useRef(null)

  const { nekhemjlel, setNekhemjlelKhuudaslalt, nekhemjlelMutate } =
    useMedegdel(token, undefined, davkhar, ilgeekhTurul, turul)

  const { mailiinZagvarGaralt, mailiinZagvarMutate } = useMailiinZagvar(
    token,
    "sms"
  )

  const {
    sonorduulga,
    sonorduulgaMutate,
    jagsaalt,
    nextSonorduulga,
    setKhuudaslalt,
  } = useSanalGomdol(turul === "App" && token, khariltsagch?.khariltsagchiinId)

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
    if (ilgeekhTurul !== "gantsaar" && songogdsonGereenuud.length > 0) {
      var khariu = { successCount: 0, failureCount: 0 }
      songogdsonGereenuud
        .filter((a) => !!a.khariltsagchiinId)
        .map((a, index, array) => {
          let body = msj
          for (const [key, value] of Object.entries(a)) {
            body = body?.replace(new RegExp(`<${key}>`, "g"), value)
          }

          uilchilgee(token)
            .post(`/sonorduulgaIlgeeye`, {
              firebaseToken: a?.firebaseToken,
              khariltsagchiinId: a?.khariltsagchiinId,
              barilgiinId: a.barilgiinId,
              khariltsagchiinNer: a.ner,
              medeelel: { title, body },
            })
            .then(({ data }) => {
              if (!!data?.successCount) khariu.successCount += 1
              else if (!!data?.failureCount) khariu.failureCount += 1
              if (index === array.length - 1) {
                notification.success({
                  message: `Notification Амжилттай ${khariu.successCount} ${
                    khariu.failureCount ? `Алдаатай ${khariu.failureCount}` : ""
                  } илгээлээ`,
                })
                setLoading(false)
              }
            })
          return
        })
      return
    }

    if (loading) {
      message.warning("Хүсэлт илгээгдсэн байна")
      return
    }

    setLoading(true)
    uilchilgee(token)
      .post(`/sonorduulgaIlgeeye`, {
        firebaseToken: khariltsagch?.firebaseToken,
        khariltsagchiinId: khariltsagch?.khariltsagchiinId,
        barilgiinId: khariltsagch.barilgiinId,
        khariltsagchiinNer: khariltsagch.ner,
        medeelel: { title, body: ingeekhmSms },
      })
      .then(({ data }) => {
        if (!!data?.successCount) {
          sonorduulga.jagsaalt.unshift({
            khariltsagchiinId: khariltsagch?.khariltsagchiinId,
            barilgiinId: khariltsagch.barilgiinId,
            khariltsagchiinNer: khariltsagch.ner,
            title,
            message: ingeekhmSms,
            turul: "medegdel",
          })
          sonorduulgaMutate({ ...sonorduulga }, false)
          notification.success({ message: "Notification Амжилттай илгээлээ" })
          setLoading(false)
        } else if (!!data?.failureCount) {
          notification.warning({
            description: _.get(data, "results.0.error.message"),
            message: _.get(data, "results.0.error.code"),
          })
          setLoading(false)
        }
      })
      .catch((e) => {
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
        if (_.isArray(a.utas))
          a.utas.map((to) =>
            msgnuud.push({
              to,
              text,
            })
          )
        else
          msgnuud.push({
            to: a.utas,
            text,
          })
      })
    else if (!!khariltsagch) {
      if (_.isArray(khariltsagch?.utas))
        khariltsagch?.utas.map((to) =>
          msgnuud.push({
            to,
            text: ingeekhmSms,
          })
        )
      else
        msgnuud.push({
          to: khariltsagch?.utas,
          text: ingeekhmSms,
        })
    } else {
      message.warning("Та SMS илгээх гэрээгээ сонгоно уу")
      return
    }
    if (!(msgnuud.length > 0)) {
      message.warning("Илгээх мэдээлэл байхгүй байна")
      return
    }
    setLoading(true)
    uilchilgee(token)
      .post(`/msgIlgeeye`, { barilgiinId, msgnuud })
      .then(({ data }) => {
        if (data && data[0].Result === "SUCCESS") {
          notification.success({ message: "SMS Амжилттай илгээлээ" })
          setLoading(false)
        }
      })
      .catch((e) => {
        setLoading(false)
        aldaaBarigch(e)
      })
  }

  async function mailIlgeeye() {
    if (ilgeekhTurul === "gantsaar" && !khariltsagch?.mail) {
      notification.warning({ message: "Гэрээнд и-мэйл бүртгэгдээгүй байна" })
      return
    }
    const mailuud = []

    if (ilgeekhTurul === "gantsaar") {
      var zagvar = content
      for (const [key, value] of Object.entries(khariltsagch)) {
        zagvar = zagvar?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value)
      }
      mailuud.push({
        mail: khariltsagch.mail,
        content: zagvar,
      })
    } else if (songogdsonGereenuud?.length > 0) {
      songogdsonGereenuud.forEach((a) => {
        var zagvar = content
        for (const [key, value] of Object.entries(a)) {
          zagvar = zagvar?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value)
        }
        mailuud.push({
          mail: a.mail,
          content: zagvar,
        })
      })
    }
    setLoading(true)
    uilchilgee(token)
      .post(`/mailOlnoorIlgeeye`, { mailuud, subject: title })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: "И-мэйл Амжилттай илгээлээ" })
          setLoading(false)
        }
      })
      .catch((e) => {
        setLoading(false)
        aldaaBarigch(e)
      })
  }

  function send() {
    switch (turul) {
      case "App":
        appIlgeeye()
        break
      case "Mail":
        mailIlgeeye()
        break
      default:
        msgIlgeeye()
        break
    }
  }

  function smsZagvarNemya(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => ref.current.khadgalya()}
      >
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

  function seen() {
    const seenList = [...jagsaalt, ...(sonorduulga?.jagsaalt || [])].filter(
      (a) => a.turul !== "medegdel" && a.kharsanEsekh !== true
    )
    if (seenList.length > 0) {
      const seenIds = seenList.map((a) => a._id)
      if (
        jagsaalt.filter(
          (a) => a.turul !== "medegdel" && a.kharsanEsekh === false
        ).length > 0
      )
        setKhuudaslalt((a) => {
          a.jagsaalt.forEach((b) => {
            if (b.turul !== "medegdel" && b.kharsanEsekh === false)
              b.kharsanEsekh = true
          })
          return a
        })
      uilchilgee(token)
        .post("/sanalKharlaa", { id: seenIds })
        .then(() => {
          if (
            sonorduulga?.jagsaalt?.filter(
              (a) => a.turul !== "medegdel" && a.kharsanEsekh === false
            ).length > 0
          )
            sonorduulgaMutate()
        })
        .catch(aldaaBarigch)
    }
  }

  function onScroll(e) {
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      seen()
    }, 300)

    if (e.target.scrollHeight + e.target.scrollTop === e.target.clientHeight) {
      nextSonorduulga()
    }
  }
  //#endregion

  return (
    <Admin
      title="Мэдэгдэл"
      khuudasniiNer="medegdel"
      className="p-0 md:p-4"
      onSearch={(search) => setNekhemjlelKhuudaslalt((a) => ({ ...a, search }))}
      tsonkhniiId="61c2c68d1c2830c4e6f90ca5"
    >
      <div className="col-span-12 lg:col-span-3 xl:col-span-3">
        <div className="intro-y pr-1">
          <div className="box p-2">
            <div className="grid grid-cols-3 gap-1 font-medium" role="tablist">
              {["SMS", "App", "Mail"].map((mur) => (
                <div
                  key={mur}
                  className={`flex-1 cursor-pointer rounded-md py-2 text-center ${
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
        <div className="box mt-5 flex flex-row items-center p-2">
          <IlgeesenToo
            barilgiinId={barilgiinId}
            baiguullagiinId={baiguullaga?._id}
            ekhlekhOgnoo={moment().startOf("month")}
            duusakhOgnoo={moment().endOf("month")}
            token={token}
          />
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
        <div className="mt-5 flex flex-row p-2 font-medium">
          <div>{turul} загвар</div>
          <button
            className={`ml-auto cursor-pointer rounded-md bg-green-500 py-2 px-4 text-center text-white`}
            onClick={() => smsZagvarNemya()}
          >
            Загвар үүсгэх
          </button>
        </div>
        <div
          className="scrollbar-hidden overflow-y-auto"
          style={{ height: "calc(100vh - 25rem)" }}
        >
          {mailiinZagvarGaralt?.jagsaalt?.map((a) => (
            <div
              key={a.ner}
              className="intro-x box relative mt-2 flex cursor-pointer items-center p-2"
              onClick={() => setContent(a.mail)}
            >
              <div className="image-fit mr-1 h-8 w-8 flex-none ">
                <img
                  alt="Rubick Tailwind HTML Admin Template"
                  src="/email.png"
                />
              </div>
              <div className="ml-2 mr-1 overflow-hidden">
                <div className="flex items-center">
                  <div className="font-medium">{a.ner}</div>
                </div>
              </div>
              <div className="ml-auto flex flex-row space-x-2">
                <Popconfirm
                  title="Загвар устгах уу?"
                  okText="Тийм"
                  cancelText="Үгүй"
                  onConfirm={() => zagvarUstgaya(a)}
                >
                  <div className="flex h-8  w-8 items-center justify-center rounded-full bg-gray-100 fill-current p-2 text-white">
                    <DeleteOutlined style={{ color: "red" }} />
                  </div>
                </Popconfirm>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 fill-current p-2 text-white"
                  onClick={() => smsZagvarNemya(a)}
                >
                  <EditOutlined style={{ color: "#85C1E9" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`col-span-12 lg:col-span-3 xl:col-span-3 ${
          ilgeekhTurul === "gantsaar" ? "" : "hidden"
        }`}
      >
        {ilgeekhTurul === "gantsaar" && (
          <div className="box p-5">
            <div className="text-gray-700 dark:text-gray-300">
              <Input.Search
                placeholder="Харилцагч хайх /Утас , Нэр, Регистр/"
                onSearch={(search) =>
                  setNekhemjlelKhuudaslalt((a) => ({ ...a, search }))
                }
                onChange={({ target }) => {
                  clearTimeout(timeout)
                  timeout = setTimeout(function () {
                    setNekhemjlelKhuudaslalt((a) => ({
                      ...a,
                      search: target.value,
                    }))
                  }, 300)
                }}
              />
            </div>
            <div
              className="scrollbar-hidden mt-5 overflow-y-auto"
              style={{ height: "calc(100vh - 13rem)" }}
            >
              {nekhemjlel?.jagsaalt?.map((mur) => (
                <div
                  className={`flex cursor-pointer flex-row items-center space-x-2 rounded-md p-2 ${
                    khariltsagch?._id === mur?._id ? "bg-green-100" : ""
                  } `}
                  key={mur?._id}
                  onClick={() => setKhariltsagch(mur)}
                >
                  <div className="image-fit relative h-10 w-10 flex-none rounded-full">
                    <img
                      alt="Rubick"
                      className="rounded-full"
                      src="/profile.svg"
                    />
                    <div className="bg-theme-9 absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="truncate text-center text-xs text-gray-600">
                    {mur?.ner}
                  </div>
                  <div className="truncate text-center text-xs text-gray-600">
                    {mur?.gereeniiDugaar}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div
        className={`intro-y col-span-12 lg:col-span-6 xl:col-span-6 ${
          ilgeekhTurul === "gantsaar"
            ? "lg:col-span-6 xl:col-span-6"
            : "lg:col-span-9 xl:col-span-9"
        }`}
        style={{ height: "calc(100vh - 7rem)" }}
      >
        {khariltsagch || ilgeekhTurul !== "gantsaar" ? (
          <div className="box flex h-full flex-col">
            <div className="dark:border-dark-5 flex flex-col border-b border-gray-200 px-5 py-4 sm:flex-row">
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
                  <div className="image-fit relative h-10 w-10 flex-none sm:h-12 sm:w-12">
                    <img
                      alt="Rubick Tailwind HTML Admin Template"
                      className="rounded-full"
                      src="/profile.svg"
                    />
                  </div>
                  <div className="ml-3 mr-auto">
                    <div className="text-base font-medium">
                      {khariltsagch?.ner}
                    </div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      {turul === "Mail"
                        ? khariltsagch?.mail
                        : khariltsagch?.utas}{" "}
                      <span className="mx-1">•</span> {turul}
                    </div>
                  </div>
                </div>
              )}
              <div className="ml-auto flex items-center space-x-2 font-medium"></div>
            </div>
            <div className="w-full">
              {ilgeekhTurul === "gantsaar" &&
                (turul === "App" ? (
                  <div
                    className="flex flex-col-reverse overflow-y-auto p-5"
                    style={{ maxHeight: "calc(100vh - 27rem)" }}
                    onScroll={onScroll}
                  >
                    {[...jagsaalt, ...(sonorduulga?.jagsaalt || [])].map(
                      (a, i) => {
                        return (
                          <div
                            className={`relative mt-8 flex w-1/3 flex-col rounded-xl border border-green-200 bg-green-500 p-3  ${
                              a.turul === "medegdel"
                                ? "ml-auto rounded-br-none bg-blue-500"
                                : "rounded-bl-none"
                            }`}
                          >
                            <span className="text-white">{a.message}</span>
                            <div
                              className={`absolute right-2 h-5 w-5 fill-current text-white ${
                                a.kharsanEsekh === true ? "" : "hidden"
                              }`}
                            >
                              <svg
                                width="20px"
                                height="20px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M16 7L12 11"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>
                            <span className="absolute -bottom-5 text-xs font-medium text-gray-500">
                              {moment(a.createdAt).format("YYYY-MM-DD hh:mm")}
                            </span>
                            <span className="absolute right-0 -bottom-5 text-gray-500">
                              {a.turul}
                            </span>
                          </div>
                        )
                      }
                    )}
                  </div>
                ) : (
                  <div
                    className="p-2"
                    dangerouslySetInnerHTML={{ __html: ingeekhmSms }}
                  />
                ))}
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
                      title: "Талбай",
                      dataIndex: "talbainDugaar",
                      align: "center",
                    },
                    {
                      width: "21rem",
                      title: turul,
                      dataIndex: turul === "Mail" ? "mail" : "utas",
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
            <div className="mt-auto w-full p-2">
              {turul !== "SMS" && (
                <Input
                  placeholder="Гарчиг"
                  value={title}
                  onChange={({ target }) => setTitle(target.value)}
                />
              )}
              <ZagvarUusgekh
                change={setContent}
                value={content}
                onTextChange={onTextChange}
              />
            </div>

            <div className="flex w-full items-center justify-end space-x-2 p-2">
              <label className="font-medium">{turul} Илгээх</label>
              <div
                onClick={send}
                className={`h-8 w-8 cursor-pointer sm:h-10 sm:w-10 bg-green-${
                  loading ? "200" : "600"
                } flex flex-none items-center justify-center rounded-full text-white`}
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
                    className="h-4 w-4"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="box flex h-full items-center">
            <div className="mx-auto text-center">
              <div className="image-fit mx-auto h-16 w-16 flex-none overflow-hidden rounded-full">
                <img
                  alt="Rubick Tailwind HTML Admin Template"
                  src="/profile.svg"
                />
              </div>
              <div className="mt-3">
                <div className="font-medium">Өдрийн мэнд</div>
                <div className="mt-1 text-gray-600">
                  Та {turul} илгээх харилцагчаа сонгоно уу.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default Khyanalt
