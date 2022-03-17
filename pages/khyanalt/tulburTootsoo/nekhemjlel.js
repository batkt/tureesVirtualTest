import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React, { useEffect, useMemo, useState } from "react"
import {
  Card,
  DatePicker,
  Table,
  Button,
  Select,
  message,
  Popconfirm,
  Spin,
  notification,
} from "antd"
import {
  EditOutlined,
  FileExcelOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import Image from "next/image"
import moment from "moment"
import formatNumber from "tools/function/formatNumber"
import useNekhemjlekh from "hooks/tulburTootsoo/useNekhemjlekh"
import useNekhemjlekhiinZagvar from "hooks/tulburTootsoo/useNekhemjlekhiinZagvar"
import useNekhemjlekhDugaarlalt from "hooks/tulburTootsoo/useNekhemjlekhDugaarlalt"
import useDans from "hooks/useDans"
import _ from "lodash"
import { useReactToPrint } from "react-to-print"
import { toWords } from "mon_num"
import DunZasvar from "components/pageComponents/nekhemjlel/DunZasvar"
import NekhemjlelZagvarBurtgel from "components/pageComponents/nekhemjlel/ZagvarBurtgel"
import { modal } from "components/ant/Modal"
import { useAuth } from "services/auth"
import deleteMethod from "tools/function/crud/deleteMethod"
import uilchilgee, { aldaaBarigch } from "services/uilchilgee"

const ilgeekhTurul = "davkharaar"

function tulburTootsoo({ token }) {
  const printRef = React.useRef(null)
  const dunZasvarRef = React.useRef(null)
  const nekhemjlekhRef = React.useRef(null)
  const { baiguullaga, barilgiinId } = useAuth()

  const [tuluvluguutEsekh, setTuluvluguutEsekh] = React.useState(false)
  const [ognoo, setOgnoo] = React.useState(moment())
  const [barimt, setBarimt] = React.useState()
  const [davkhar, setDavkhar] = React.useState()
  const [songogdsonDans, setDans] = React.useState()

  const [loading, setLoading] = useState(false)
  const [nekhemjleliinJagsaalt, setNekhemjleliinJagsaalt] = React.useState([])
  const { nekhemjlel, setNekhemjlelKhuudaslalt, nekhemjlelMutate } =
    useNekhemjlekh(token, ognoo, davkhar, ilgeekhTurul)
  const { nekhemjlekhiinZagvar, nekhemjlekhiinZagvarMutate } =
    useNekhemjlekhiinZagvar(token)
  const { dugaarlalt, dugaarlaltMutate, dugaarlaltKhadgalya } =
    useNekhemjlekhDugaarlalt(token)

  const { dansGaralt } = useDans(token, baiguullaga?._id)

  const [songogdsonGereenuud, setSongogdsonGereenuud] = React.useState([])
  const [mailZagvar, setMailZagvar] = useState()

  useEffect(() => {
    if (!!nekhemjlel) setNekhemjleliinJagsaalt([...nekhemjlel?.jagsaalt])
  }, [nekhemjlel])

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      if (songogdsonGereenuud?.length > 0)
        dugaarlaltKhadgalya(songogdsonGereenuud?.length + dugaarlalt - 1, () =>
          dugaarlaltMutate()
        )
    },
  })

  function hevlekh() {
    if (!songogdsonDans) {
      message.warning("Данс сонгоно уу")
      return
    }
    if (!barimt) {
      message.warning("Нэхэмжлэхийн төрөл сонгоно уу")
      return
    }
    if (!songogdsonGereenuud || songogdsonGereenuud?.length === 0) {
      message.warning("Гэрээ сонгоно уу")
      return
    }
    handlePrint()
  }

  const nekhemjlekhuud = useMemo(() => {
    if (barimt && songogdsonGereenuud)
      return songogdsonGereenuud?.map((a, i) => {
        var zagvar = nekhemjlekhiinZagvar?.jagsaalt?.find(
          (a) => a._id === barimt
        )?.nekhemjlekh
        const medeelel = _.clone(a)
        if (!!zagvar) {
          medeelel.eneSardTulukhUsgeer = `${toWords(
            medeelel.eneSardTulukhDun *
              (medeelel.eneSardTulukhDun < 0 ? -1 : 1),
            { suffix: "n" }
          )} төгрөг`
          medeelel.niitUldegdelUsgeer = `${toWords(
            medeelel.niitUldegdel * (medeelel.niitUldegdel < 0 ? -1 : 1),
            { suffix: "n" }
          )} төгрөг`
          medeelel.mungunDunUsgeer = `${toWords(medeelel.sariinTurees, {
            suffix: "n",
          })} төгрөг`
          medeelel.sariinTurees = formatNumber(medeelel.sariinTurees)
          medeelel.eneSardTulukhDun = formatNumber(medeelel.eneSardTulukhDun)
          medeelel.niitUldegdel = formatNumber(medeelel.niitUldegdel)
          medeelel.talbainNegjUne = formatNumber(medeelel.talbainNegjUne)
          medeelel.talbainNiitUne = formatNumber(medeelel.talbainNiitUne)
          medeelel.khevlesenOgnoo = moment().format("YYYY-MM-DD")
          medeelel.niitAshiglaltiinZardal = formatNumber(
            medeelel.niitAshiglaltiinZardal
          )
          const dans = dansGaralt?.jagsaalt?.find(
            (a) => a.dugaar === songogdsonDans
          )
          medeelel.dans = dans?.dugaar
          medeelel.bank =
            dans?.bank === "tdb" ? "Худалдаа хөгжлийн банк" : "Хаан банк"
          medeelel.dansniiNer = dans?.dansniiNer

          medeelel.nekhemjlekhiinDugaar =
            moment().format("YY") + "/" + (dugaarlalt + i)

          for (const [key, value] of Object.entries(medeelel)) {
            zagvar = zagvar?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value)
          }
        }
        return { zagvar, mail: a.mail }
      })
    return []
  }, [barimt, songogdsonGereenuud])

  function maileerIlgeekh() {
    if (!barimt) {
      message.warning("Нэхэмжлэхийн төрөл сонгоно уу")
      return
    }
    if (!songogdsonGereenuud || songogdsonGereenuud?.length === 0) {
      message.warning("Гэрээ сонгоно уу")
      return
    }
    if (loading) {
      message.warning("И-мэйл илгээгдсэн байна")
      return
    }
    var ilgeekhMailuud = nekhemjlekhuud.filter((x) => x.mail !== undefined)
    var mailuud = []
    if (ilgeekhMailuud?.length > 0) {
      ilgeekhMailuud?.map((x) =>
        mailuud.push({
          mail: x.mail,
          content: x.zagvar,
        })
      )
      setLoading(true)
      uilchilgee(token)
        .post(`/mailOlnoorIlgeeye`, { mailuud, subject: "Түрээсийн төлбөр" })
        .then(({ data }) => {
          debugger
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
  }

  function nekhemjlelZagvarBurtgeye(mur) {
    const footer = [
      <Button onClick={() => nekhemjlekhRef.current.khaaya()}>Хаах</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => nekhemjlekhRef.current.khadgalya()}
      >
        Хадгалах
      </Button>,
    ]
    modal({
      title: "Нэхэмжлэл загвар",
      icon: <FileExcelOutlined />,
      style: { top: 20 },
      content: (
        <NekhemjlelZagvarBurtgel
          ref={nekhemjlekhRef}
          data={mur}
          barilgiinId={barilgiinId}
          token={token}
          afterShock={nekhemjlekhiinZagvarMutate}
        />
      ),
      footer,
    })
  }

  function nekhemjlelZasya(mur, index) {
    const footer = [
      <Button onClick={() => dunZasvarRef.current.khaaya()}>Хаах</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => dunZasvarRef.current.khadgalya()}
      >
        Хадгалах
      </Button>,
    ]
    modal({
      title: "Нэхэмжлэл засвар",
      icon: <FileExcelOutlined />,
      content: (
        <DunZasvar
          ref={dunZasvarRef}
          data={mur}
          index={index}
          setNekhemjleliinJagsaalt={setNekhemjleliinJagsaalt}
          nekhemjleliinJagsaalt={nekhemjleliinJagsaalt}
          songogdsonGereenuud={songogdsonGereenuud}
          setSongogdsonGereenuud={setSongogdsonGereenuud}
        />
      ),
      footer,
    })
  }
  function zagvarUstgaya(mur) {
    deleteMethod("nekhemjlekhiinZagvar", token, mur?._id).then(({ data }) => {
      if (data === "Amjilttai") {
        message.success("Устгагдлаа")
        nekhemjlekhiinZagvarMutate()
      }
    })
  }

  return (
    <Admin
      title="Нэхэмжлэл"
      khuudasniiNer="nekhemjlel"
      className="p-0 md:p-4"
      onSearch={(search) => {
        setNekhemjlelKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }}
      tsonkhniiId="61c2c6d91c2830c4e6f90cbd"
    >
      <Card className="cardgrid col-span-12">
        <Spin spinning={loading}>
          <div className="grid w-full grid-cols-2" ref={printRef}>
            {nekhemjlekhuud?.map((nekhemjlekh, i) => {
              return (
                <div
                  key={`khevlekhNekhemjlel${i}`}
                  className="print a5 sun-editor-editable p-10"
                  dangerouslySetInnerHTML={{ __html: nekhemjlekh.zagvar }}
                />
              )
            })}
          </div>
          <div className="grid w-full grid-cols-12 gap-4">
            {[
              { too: nekhemjlel?.niitMur || 0, utga: "Нийт" },
              { too: 0, utga: "Тодорхойгүй" },
              { too: 0, utga: "Холбогдсон" },
            ].map((mur, index) => {
              return (
                <div
                  key={`${index}toololt`}
                  className="intro-y zoom-in col-span-12 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 lg:col-span-4"
                >
                  <div className="h-full rounded-xl">
                    <div className="rounded-xl p-3">
                      <div className="flex">
                        <div>
                          <div className="text-3xl font-bold text-green-600">
                            {mur.too}
                          </div>
                          <div className="text-base text-gray-500">
                            {mur.utga}
                          </div>
                        </div>
                        <div className="ml-auto">
                          <div className="text-2xl text-green-600">
                            {mur.icon}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 flex w-full flex-row">
            <DatePicker
              style={{ marginBottom: "20px" }}
              value={ognoo}
              onChange={setOgnoo}
            />
            <div className="ml-auto space-x-2">
              <Select placeholder="Дансны төрөл" onChange={setDans}>
                {dansGaralt?.jagsaalt?.map((a) => (
                  <Select.Option key={a.dugaar} value={a.dugaar}>
                    <div>{a.dugaar}</div>
                  </Select.Option>
                ))}
              </Select>
              <Select
                allowClear
                placeholder="Давхар"
                onChange={(v) => {
                  setDavkhar(v)
                  setSongogdsonGereenuud([])
                }}
              >
                {baiguullaga?.barilguud
                  ?.find((a) => a._id === barilgiinId)
                  ?.davkharuud.map((a) => (
                    <Select.Option key={a._id} value={a.davkhar}>
                      {a.davkhar}
                    </Select.Option>
                  ))}
              </Select>
              <Select placeholder="Нэхэмжлэхийн төрөл" onChange={setBarimt}>
                {nekhemjlekhiinZagvar?.jagsaalt?.map((a) => (
                  <Select.Option key={a._id} value={a._id}>
                    {a.ner}
                  </Select.Option>
                ))}
              </Select>
              <Button type="primary" onClick={hevlekh}>
                Хэвлэх
              </Button>
              <Button onClick={maileerIlgeekh}>Нэхэмжлэл илгээх</Button>
            </div>
          </div>
          <div className="grid grid-cols-8 gap-2">
            <div className="col-span-2 rounded-md p-2 ">
              <div className="flex w-full justify-between">
                <Button
                  style={{ backgroundColor: "#209669", color: "#ffffff" }}
                  className="ml-auto"
                  onClick={() => nekhemjlelZagvarBurtgeye()}
                >
                  Загвар үүсгэх
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                {nekhemjlekhiinZagvar?.jagsaalt?.map((a, i) => (
                  <div
                    key={`zagvar${i}`}
                    className="flex flex-row items-center space-x-2 rounded-md border border-gray-200 p-2 shadow-md"
                  >
                    <Image src="/invoice.png" width={32} height={32} />
                    <div className="font-medium">{a.ner}</div>
                    <div style={{ marginLeft: "auto" }}>
                      <Popconfirm
                        title="Загвар устгах уу?"
                        okText="Тийм"
                        cancelText="Үгүй"
                        onConfirm={() => zagvarUstgaya(a)}
                      >
                        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 fill-current p-2 text-white">
                          <DeleteOutlined
                            style={{ color: "red", display: "flex" }}
                          />
                        </div>
                      </Popconfirm>
                    </div>
                    <div
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 fill-current p-2 text-white"
                      onClick={() => nekhemjlelZagvarBurtgeye(a)}
                    >
                      <EditOutlined
                        style={{ display: "flex", color: "#85C1E9" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-6">
              <Table
                bordered
                size="small"
                scroll={{ y: "calc(100vh - 25rem)" }}
                rowSelection={{
                  type: "checkbox",
                  selectedRowKeys: songogdsonGereenuud?.map((a) => a._id),
                  onChange: (selectedRowKeys, selectedRows) => {
                    setSongogdsonGereenuud(selectedRows)
                  },
                }}
                columns={[
                  {
                    title: "Гэрээ №",
                    dataIndex: "gereeniiDugaar",
                    width: "7rem",
                    align: "center",
                  },
                  {
                    title: "Талбай №",
                    sorter: (a, b) => a.talbainDugaar - b.talbainDugaar,
                    dataIndex: "talbainDugaar",
                    width: "7rem",
                    align: "center",
                  },
                  {
                    title: "Дараагийн төлөх огноо",
                    sorter: (a, b) =>
                      moment(a.talbainDugaar).diff(
                        moment(b.talbainDugaar),
                        "hour"
                      ),
                    dataIndex: "daraagiinTulukhOgnoo",
                    render(a) {
                      return moment(a).format("YYYY-MM-DD")
                    },
                    ellipsis: true,
                    align: "center",
                  },
                  {
                    title: "Өмнөх хуримтлагдсан өр төлбөр",
                    sorter: (a, b) =>
                      a.umnukhSariinUrTulbur - b.umnukhSariinUrTulbur,
                    dataIndex: "umnukhSariinUrTulbur",
                    render(a) {
                      return formatNumber(a)
                    },
                    ellipsis: true,
                    align: "center",
                  },
                  {
                    title: "Энэ сард төлөх дүн",
                    sorter: (a, b) => a.eneSardTulukhDun - b.eneSardTulukhDun,
                    dataIndex: "eneSardTulukhDun",
                    render(a) {
                      return formatNumber(a)
                    },
                    ellipsis: true,
                    align: "center",
                  },
                  {
                    title: "Нийт үлдэгдэл",
                    sorter: (a, b) => a.niitUldegdel - b.niitUldegdel,
                    dataIndex: "niitUldegdel",
                    render(a) {
                      return formatNumber(a)
                    },
                    ellipsis: true,
                    align: "center",
                  },
                  {
                    title: "Төлөв",
                    width: "4rem",
                    dataIndex: "tuluv",
                    align: "center",
                    render(a, record, index) {
                      return (
                        <div className="flex items-center justify-center">
                          <Button
                            shape="circle"
                            size="small"
                            icon={
                              <div
                                className={`flex items-center justify-center`}
                                onClick={() => nekhemjlelZasya(record, index)}
                              >
                                <EditOutlined
                                  style={{ fontSize: "18px", color: "#85C1E9" }}
                                />
                              </div>
                            }
                          />
                        </div>
                      )
                    },
                  },
                ]}
                dataSource={nekhemjleliinJagsaalt}
                pagination={false}
                rowKey={(a) => a._id}
              />
            </div>
          </div>
        </Spin>
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default tulburTootsoo
