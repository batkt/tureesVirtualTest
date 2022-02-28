import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React, { useMemo } from "react"
import { useAuth } from "services/auth"
import {
  Card,
  DatePicker,
  Table,
  Select,
  Button,
  Tooltip,
  message,
  Spin,
  notification
} from "antd"
import {
  CheckOutlined,
  ExclamationOutlined,
  FileExcelOutlined,
  QuestionOutlined,
} from "@ant-design/icons"
import moment from "moment"
import useDans from "hooks/useDans"
import formatNumber from "tools/function/formatNumber"
import useDansKhuulga from "hooks/khuulga/useDansKhuulga"
import useBankniiGuilgeeToololt from "hooks/khuulga/useBankniiGuilgeeToololt"
import GuilgeeKholbokh from "components/pageComponents/tulbur/GuilgeeKholbokh"
import _ from "lodash"
import { modal } from "components/ant/Modal"
import Tulbur from "components/pageComponents/eBarimt/Tulbur"
import useUldegdel from "hooks/khuulga/useUldegdel"
import DansniiKhuulgaTile from "components/pageComponents/tulbur/DansniiKhuulgaTile"
import CardList from "components/cardList"
const { RangePicker } = DatePicker

function iconAvya(a, bank) {
  let Icon = ExclamationOutlined
  let color = "red"
  let tailbar = "Гүйлгээ холбогдоогүй байна"

  if (
    (a?.kholbosonDun < a[`${bank === "tdb" ? "Amt" : "amount"}`] &&
      a?.kholbosonDun > 0) ||
    (a?.magadlaltaiGereenuud?.length > 0 &&
      !(a?.kholbosonGereeniiId?.length > 0))
  ) {
    Icon = QuestionOutlined
    color = "yellow"
    tailbar =
      a?.kholbosonDun < a[`${bank === "tdb" ? "Amt" : "amount"}`] &&
      a?.kholbosonDun > 0
        ? "Дүн дутуу холбогдсон байна"
        : "Холбох боломжтой гэрээнүүд байна"
  } else if (
    a?.kholbosonGereeniiId &&
    a?.kholbosonDun === a[`${bank === "tdb" ? "Amt" : "amount"}`]
  ) {
    Icon = CheckOutlined
    color = "green"
    tailbar = "Гүйлгээ холбогдсон байна"
  }

  return (
    <Tooltip title={tailbar}>
      <div className={`text-${color}-500 flex items-center justify-center`}>
        <Icon style={{ fontSize: "16px" }} />
      </div>
    </Tooltip>
  )
}

function tulburTootsoo({ token }) {
  const refGuilgee = React.useRef(null)
  const { baiguullaga, barilgiinId,ajiltan } = useAuth()
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = React.useState([moment(), moment()])
  const { dansGaralt } = useDans(token, baiguullaga?._id)
  const [songogdsonDans, setSongogdsonDans] = React.useState(null)
  const [songogdsonTurul, setSongogdsonTurul] = React.useState(null)

  const [khuulgaTurul, setKhuulgaTurul] = React.useState('orlogo')

  const { bankniiGuilgeeToololt, bankniiGuilgeeToololtMutate } =
    useBankniiGuilgeeToololt(token, ekhlekhOgnoo, songogdsonDans)
  const { uldegdel } = useUldegdel(token, songogdsonDans?.dugaar)

  const [order, setOrder] = React.useState({ tranDate: -1, time: 0 })

  const query = React.useMemo(() => {
    let query = {}
    if (songogdsonTurul === "Тодорхойгүй"){
      query.magadlaltaiGereenuud = { $eq: null }
      query.kholbosonGereeniiId = { $size: 0 }
    }
    else if (songogdsonTurul === "Холбогдсон")
      query["kholbosonGereeniiId.0"] = { $exists: true }
    else if (songogdsonTurul === "Магадлалтай"){
      query.magadlaltaiGereenuud = { $exists: true, $ne: null }
      query.kholbosonGereeniiId = { $size: 0 }
    }

    query[`${songogdsonDans?.bank === 'tdb' ? 'Amt' : 'amount'}`] = { [khuulgaTurul === 'orlogo' ? '$gt' : '$lt']: 0 }
        
    return query
  }, [songogdsonTurul,khuulgaTurul,songogdsonDans])

  const {
    dansniiKhuulgaGaralt,
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaMutate,
  } = useDansKhuulga(
    token,
    baiguullaga?._id,
    songogdsonDans,
    ekhlekhOgnoo,
    order,
    query
  )

  function refreshData() {
    dansniiKhuulgaMutate()
    bankniiGuilgeeToololtMutate()
  }

  function dansSongoy(dugaar) {
    let songogdsonDans = dansGaralt?.jagsaalt?.find((a) => a.dugaar === dugaar)
    setDansniiKhuulgaKhuudaslalt((a) => ({ ...a, khuudasniiDugaar: 1 }))
    setSongogdsonDans(songogdsonDans)
  }

  function guilgeeKholbyo(data) {
    if (
      data?.kholbosonGereeniiId &&
      data?.kholbosonDun ===
        data[`${songogdsonDans?.bank === "tdb" ? "Amt" : "amount"}`]
    ) {
      message.info("Гүйлгээ гэрээнд холбогдсон байна.")
      return
    }

    const footer = [
      <Button onClick={() => refGuilgee.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => refGuilgee.current.khadgalya()}>
        Хадгалах
      </Button>,
    ]
    modal({
      title: "",
      width: "50%",
      icon: <FileExcelOutlined />,
      content: (
        <GuilgeeKholbokh
          dans={songogdsonDans}
          data={data}
          barilgiinId={barilgiinId}
          ref={refGuilgee}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          onFinish={refreshData}
        />
      ),
      footer,
    })
  }

  function turulSongyo(utga) {
    setSongogdsonTurul(utga)
    setDansniiKhuulgaKhuudaslalt((a) => ({ ...a, khuudasniiDugaar: 1 }))
  }

  function ebarimtUgukh(data) {
    modal({
      title: (
        <div className="flex w-full flex-row justify-between">
          <div>Түрээсийн төлбөрийн и-баримт</div>
        </div>
      ),
      content: (
        <Tulbur
          data={data}
          token={token}
          dansniiKhuulgaMutate={dansniiKhuulgaMutate}
        />
      ),
      footer: false,
    })
  }

  const columns = useMemo(() => {
    let baganuud = []
    if (songogdsonDans?.bank === "tdb"){
      baganuud = [
        {
          title: "Огноо",
          sorter: true,
          dataIndex: "TxDt",
          width: "7rem",
          render(date) {
            return moment(date).format("YYYY-MM-DD")
          },
          onHeaderCell: (cell, index) => {
            return {
              onClick: () =>
                setOrder((o) => ({
                  ...o,
                  tranDate: o.tranDate === -1 ? 1 : o.tranDate - 1,
                })), // click header row
            }
          },
        },
        {
          title: "Цаг",
          sorter: true,
          dataIndex: "TxTime",
          ellipsis: true,
          width: "4rem",
          render(a) {
            if (_.isString(a)) return `${a}`
            return ""
          },
        },
        {
          title: "Гүйлгээний утга",
          dataIndex: "TxAddInf",
        },
        {
          title: "Гүйлгээний дүн",
          sorter: true,
          dataIndex: "Amt",
          ellipsis: true,
          width: "9rem",
          className: "text-right",
          showSorterTooltip: false,
          render(a) {
            return `${formatNumber(a, 2)}₮`
          },
          sorter: (a, b) => Number(a.amount || 0) - Number(b.amount || 0),
        },
        {
          title: "Шилжүүлсэн данс",
          align: "center",
          dataIndex: "CtAcntOrg",
          ellipsis: true,
          width: "10rem",
        }
      ]
      if(khuulgaTurul === 'orlogo')
        baganuud = [...baganuud,
          {
            title: "Төлөв",
            width: "4rem",
            align: "center",
            render(a) {
              return (
                <div className="flex items-center justify-center">
                  <Button
                    shape="circle"
                    size="small"
                    onClick={() => guilgeeKholbyo(a)}
                    icon={iconAvya(a, "tdb")}
                  />
                </div>
              )
            },
          },
          {
            title: "Талбай",
            dataIndex: "kholbosonTalbainId",
            ellipsis: true,
            align: "center",
            width: "5rem",
          },
          {
            title: "НӨАТУС",
            width: "4.5rem",
            align: "center",
            render(a) {
              return (
                <div className="flex items-center justify-center">
                  <Button
                    size="small"
                    shape="circle"
                    icon={
                      <div
                        className={`text-500 flex items-center justify-center`}
                      >
                        {a?.kholbosonGereeniiId &&
                        a?.ebarimtAvsanEsekh === true ? (
                          <Tooltip title="И-баримт хэвлэсэн байна">
                            <CheckOutlined
                              style={{ fontSize: "16px", color: "green" }}
                            />
                          </Tooltip>
                        ) : (
                          <ExclamationOutlined
                            style={{ fontSize: "16px", color: "red" }}
                            onClick={() => ebarimtUgukh(a)}
                          />
                        )}
                      </div>
                    }
                  />
                </div>
              )
            },
          },
        ] 
    }
    else if (songogdsonDans?.bank === "khanbank"){
      baganuud = [
        {
          title: "Огноо",
          sorter: true,
          dataIndex: "tranDate",
          width: "7rem",
          render(date) {
            return moment(date).format("YYYY-MM-DD")
          },
          onHeaderCell: (cell, index) => {
            return {
              onClick: () =>
                setOrder((o) => ({
                  ...o,
                  tranDate: o.tranDate === -1 ? 1 : o.tranDate - 1,
                })), // click header row
            }
          },
        },
        {
          title: "Цаг",
          sorter: true,
          dataIndex: "time",
          ellipsis: true,
          width: "4rem",
          render(a) {
            if (_.isString(a))
              return `${a.substring(0, 2)}:${a.substring(2, 4)}`
            return ""
          },
          onHeaderCell: (cell, index) => {
            return {
              onClick: () =>
                setOrder((o) => ({
                  ...o,
                  time: o.time === -1 ? 1 : o.time - 1,
                })), // click header row
            }
          },
        },
        {
          title: "Гүйлгээний утга",
          dataIndex: "description",
        },
        {
          title: "Гүйлгээний дүн",
          sorter: true,
          dataIndex: "amount",
          ellipsis: true,
          width: "9rem",
          className: "text-right",
          showSorterTooltip: false,
          render(a) {
            return `${formatNumber(a, 2)}₮`
          },
          sorter: (a, b) => Number(a.amount || 0) - Number(b.amount || 0),
        },
        {
          title: "Шилжүүлсэн данс",
          align: "center",
          dataIndex: "relatedAccount",
          ellipsis: true,
          width: "10rem",
        }
      ]
      if(khuulgaTurul === 'orlogo')
      baganuud = [...baganuud,{
        title: "Төлөв",
        width: "4rem",
        align: "center",
        render(a) {
          return (
            <div className="flex items-center justify-center">
              <Button
                shape="circle"
                size="small"
                onClick={() => guilgeeKholbyo(a)}
                icon={iconAvya(a)}
              />
            </div>
          )
        },
      },
      {
        title: "Талбай",
        dataIndex: "kholbosonTalbainId",
        ellipsis: true,
        align: "center",
        width: "5rem",
      },
      {
        title: "НӨАТУС",
        width: "4.5rem",
        align: "center",
        render(a) {
          return (
            <div className="flex items-center justify-center">
              <Button
                size="small"
                shape="circle"
                icon={
                  <div
                    className={`text-500 flex items-center justify-center`}
                  >
                    {a?.kholbosonGereeniiId &&
                    a?.ebarimtAvsanEsekh === true ? (
                      <Tooltip title="И-баримт хэвлэсэн байна">
                        <CheckOutlined
                          style={{ fontSize: "16px", color: "green" }}
                        />
                      </Tooltip>
                    ) : (
                      <ExclamationOutlined
                        style={{ fontSize: "16px", color: "red" }}
                        onClick={() => ebarimtUgukh(a)}
                      />
                    )}
                  </div>
                }
              />
            </div>
          )
        },
      }]
    }
      
    return baganuud
  }, [songogdsonDans,khuulgaTurul])

  return (
    <Admin
      title="Дансны хуулга"
      khuudasniiNer="khuulga"
      className="p-0 md:p-4"
      onSearch={(search) => {
        setDansniiKhuulgaKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }}
    >
      {dansniiKhuulgaGaralt?.jagsaalt.length > 0 &&
        Number(bankniiGuilgeeToololt?.niit || 0) -
          Number(bankniiGuilgeeToololt?.kholboson || 0) >
          0 &&
        notification.error({
          message: `Холболт хийгдээгүй ${
            Number(bankniiGuilgeeToololt?.niit || 0) -
            Number(bankniiGuilgeeToololt?.kholboson || 0)
          } гэрээ байна`,
        })}
      <Card className="cardgrid col-span-12 p-5">
        <div className="grid w-full grid-cols-12 gap-4">
          {[
            { too: bankniiGuilgeeToololt?.niit || 0, utga: "Нийт" },
            {
              too: bankniiGuilgeeToololt?.todorkhoigui || 0,
              utga: "Тодорхойгүй",
            },
            { too: bankniiGuilgeeToololt?.kholboson || 0, utga: "Холбогдсон" },
            {
              too: bankniiGuilgeeToololt?.magadlaltai || 0,
              utga: "Магадлалтай",
            },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className="intro-y zoom-in col-span-12 cursor-pointer rounded-xl border-2 border-green-600 md:col-span-6 lg:col-span-3"
                onClick={() => turulSongyo(mur.utga)}
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
          <RangePicker
            style={{ marginBottom: "20px" }}
            value={ekhlekhOgnoo}
            onChange={setEkhlekhOgnoo}
          />
          {ajiltan?.erkh === 'Admin' && <div className="ml-4 flex flex-row space-x-2 mb-5 rounded-md bg-gray-200">
            {['orlogo','zarlaga'].map(text=><div className={`p-2 rounded-md cursor-pointer ${khuulgaTurul === text ? 'bg-green-500 text-gray-50':''}`} onClick={()=>setKhuulgaTurul(text)}>{text === 'orlogo' ? 'Орлого' : 'Зарлага'}</div>)}
          </div>}
          <div className="ml-4 w-40">
            <Select
              placeholder="Данс"
              style={{ width: "100%" }}
              onChange={dansSongoy}
            >
              {dansGaralt?.jagsaalt?.map((a) => (
                <Select.Option key={a.dugaar} value={a.dugaar}>
                  <div>{a.dugaar}</div>
                </Select.Option>
              ))}
            </Select>
          </div>
          {songogdsonDans && (
            <div className="ml-auto flex flex-row space-x-2 p-1 font-medium">
              Үлдэгдэл:{" "}
              {uldegdel ? (
                songogdsonDans?.bank === "tdb" ? (
                  uldegdel
                ) : (
                  formatNumber(uldegdel)
                )
              ) : (
                <Spin />
              )}{" "}
              {songogdsonDans.currency}
            </div>
          )}
        </div>
        <div className="mt-5 hidden overflow-auto md:block">
          <Table
            bordered
            size="small"
            scroll={{ y: "calc(100vh - 30rem)" }}
            columns={columns}
            dataSource={dansniiKhuulgaGaralt?.jagsaalt}
            pagination={{
              current: dansniiKhuulgaGaralt?.khuudasniiDugaar,
              pageSize: dansniiKhuulgaGaralt?.khuudasniiKhemjee,
              total: dansniiKhuulgaGaralt?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setDansniiKhuulgaKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            rowKey={(a) => a.record}
          />
        </div>
        <CardList
          keyValue="guilgeeTuukh"
          className="block overflow-auto md:hidden"
          jagsaalt={dansniiKhuulgaGaralt?.jagsaalt}
          Component={DansniiKhuulgaTile}
          pagination={{
            current: dansniiKhuulgaGaralt?.jagsaalt?.khuudasniiDugaar,
            pageSize: dansniiKhuulgaGaralt?.jagsaalt?.khuudasniiKhemjee,
            total: dansniiKhuulgaGaralt?.jagsaalt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default tulburTootsoo
