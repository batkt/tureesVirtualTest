import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React, { useEffect } from "react"
import {
  Card,
  DatePicker,
  Table,
  Button,
  Select,
  message,
  Switch,
  Popconfirm,
} from "antd"
import {
  SnippetsOutlined,
  EditOutlined,
  FileExcelOutlined,
  DeleteOutlined,
} from "@ant-design/icons"

import moment from "moment"
import formatNumber from "tools/function/formatNumber"
import useNekhemjlekh from "hooks/useNekhemjlekh"
import useNekhemjlekhiinZagvar from "hooks/useNekhemjlekhiinZagvar"
import useNekhemjlekhDugaarlalt from "hooks/useNekhemjlekhDugaarlalt"
import useDans from "hooks/khuulga/useDans"
import _ from "lodash"
import { useReactToPrint } from "react-to-print"
import { toWords } from "mon_num"
import DunZasvar from "components/pageComponents/nekhemjlel/DunZasvar"
import NekhemjlelZagvarBurtgel from "components/pageComponents/nekhemjlel/ZagvarBurtgel"
import { modal } from "components/ant/Modal"
import { useAuth } from "services/auth"
import deleteMethod from 'tools/function/crud/deleteMethod'

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

  const [nekhemjleliinJagsaalt, setNekhemjleliinJagsaalt] = React.useState([])
  const { nekhemjlel, setNekhemjlelKhuudaslalt, nekhemjlelMutate } =
    useNekhemjlekh(token, ognoo, davkhar, ilgeekhTurul)
  const { nekhemjlekhiinZagvar, nekhemjlekhiinZagvarMutate } =
    useNekhemjlekhiinZagvar(token)
  const { dugaarlalt, dugaarlaltMutate, dugaarlaltKhadgalya } =
    useNekhemjlekhDugaarlalt(token)

  const { dans } = useDans(token)

  const [songogdsonGereenuud, setSongogdsonGereenuud] = React.useState([])

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

  function nekhemjlelZagvarBurtgeye(mur) {
    if (!songogdsonDans && !mur) {
      message.warning("Данс сонгоно уу")
      return
    }
    const footer = [
      <Button onClick={() => nekhemjlekhRef.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => nekhemjlekhRef.current.khadgalya()}>
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
          dans={songogdsonDans}
        />
      ),
      footer,
    })
  }

  function nekhemjlelZasya(mur, index) {
    const footer = [
      <Button onClick={() => dunZasvarRef.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => dunZasvarRef.current.khadgalya()}>
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
    >
      <Card className="col-span-12 cardgrid">
        <div className="w-full grid grid-cols-2" ref={printRef}>
          {barimt && songogdsonGereenuud?.map((a, i) => {
            var zagvar =  nekhemjlekhiinZagvar?.jagsaalt?.find(a=>a._id === barimt)?.nekhemjlekh
            const medeelel = _.clone(a)
            if(!!zagvar){
              const dun = tuluvluguutEsekh ? medeelel.niitUldegdel : medeelel.eneSardTulukhDun
              medeelel.mungunDunUsgeer = `${toWords(dun * (dun < 0 ? ( -1) : 1), { suffix: "n" })} төгрөг`
              medeelel.sariinTurees = formatNumber(medeelel.sariinTurees)
              medeelel.eneSardTulukhDun = formatNumber(medeelel.eneSardTulukhDun)
              medeelel.niitUldegdel = formatNumber(medeelel.niitUldegdel)
              medeelel.talbainNegjUne = formatNumber(medeelel.talbainNegjUne)
              medeelel.talbainNiitUne = formatNumber(medeelel.talbainNiitUne)
              medeelel.khevlesenOgnoo = moment().format('YYYY-MM-DD')

              medeelel.dans = songogdsonDans
              medeelel.bank = songogdsonDans?.length === 9 ? "Худалдаа хөгжлийн банк" : "Хаан банк"
              medeelel.dansniiNer = ''

              medeelel.nekhemjlekhiinDugaar = moment().format("YY")+'/'+(dugaarlalt + i)
                
              for (const [key, value] of Object.entries(medeelel)) {
                zagvar = zagvar?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
              }
            }
            return <div className="print p-10 a5" dangerouslySetInnerHTML={{__html: zagvar}}/>
            })
          }
        </div>
        <div className="w-full grid grid-cols-12 gap-4">
          {[
            { too: nekhemjlel?.niitMur || 0, utga: "Нийт" },
            { too: 0, utga: "Тодорхойгүй" },
            { too: 0, utga: "Холбогдсон" },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className="border-2 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-4 intro-y cursor-pointer zoom-in"
              >
                <div className="h-full rounded-xl">
                  <div className="p-3 rounded-xl">
                    <div className="flex">
                      <div>
                        <div className="text-3xl text-green-600 font-bold">
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {mur.utga}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-green-600 text-2xl">
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
        <div className="w-full flex flex-row mt-5">
          <DatePicker
            style={{ marginBottom: "20px" }}
            value={ognoo}
            onChange={setOgnoo}
          />
          <div className="ml-auto space-x-2">
            <Switch
              title="Төлөвлөөт эсэх"
              onChange={setTuluvluguutEsekh}
              defaultChecked={tuluvluguutEsekh}
            />
            <Select
              allowClear
              placeholder="Давхар"
              onChange={(v) => {
                setDavkhar(v)
                setSongogdsonGereenuud([])
              }}
            >
              {baiguullaga?.barilguud[0]?.davkharuud.map((a) => (
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
          </div>
        </div>
        <div className="grid grid-cols-8 gap-2">
          <div className="box col-span-2 p-2 ">
            <div className="w-full flex justify-between">
              <Select placeholder="Дансны төрөл" onChange={setDans}>
                {[
                  ...(dans?.accounts || []),
                  ...[{ number: "441000527" }, { number: "441000528" }],
                ]
                  ?.filter((a) => a.type !== "L")
                  .map((a) => (
                    <Select.Option key={a.number} value={a.number}>
                      <div>{a.number}</div>
                    </Select.Option>
                  ))}
              </Select>
              <Button type="primary" onClick={() => nekhemjlelZagvarBurtgeye()}>
                Загвар үүсгэх
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {nekhemjlekhiinZagvar?.jagsaalt?.map((a, i) => (
                <div
                  key={`zagvar${i}`}
                  className="box flex flex-row p-2 space-x-2 items-center shadow-lg"
                >
                  <div className="p-2 rounded-full">
                    <SnippetsOutlined style={{ display: "flex" }} />
                  </div>
                  <div className="font-medium">{a.ner}</div>
                  <div style={{ marginLeft: "auto" }}>
                    <Popconfirm
                      title="Загвар устгах уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => zagvarUstgaya(a)}
                    >
                      <div className="p-2 bg-red-500 fill-current text-white w-8 h-8 flex items-center justify-center rounded-full">
                        <DeleteOutlined style={{ display: "flex" }} />
                      </div>
                    </Popconfirm>
                  </div>
                  <div
                    className="p-2 bg-yellow-500 fill-current text-white w-8 h-8 flex items-center justify-center rounded-full"
                    onClick={()=>nekhemjlelZagvarBurtgeye(a)}
                  >
                    <EditOutlined style={{ display: "flex" }} />
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
                              className={`text-yellow-500 flex items-center justify-center`}
                              onClick={() => nekhemjlelZasya(record, index)}
                            >
                              <EditOutlined style={{ fontSize: "18px" }} />
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
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default tulburTootsoo
