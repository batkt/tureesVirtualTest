import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React from "react"
import { useAuth } from "services/auth"
import { Card, DatePicker, Table, Select, Button, message, Tooltip } from "antd"
import {
  CheckOutlined,
  ExclamationOutlined,
  FileExcelOutlined,
  QuestionOutlined,
} from "@ant-design/icons"
import moment from "moment"
import useDans from "hooks/khuulga/useDans"
import formatNumber from "tools/function/formatNumber"
import useDansKhuulga from "hooks/khuulga/useDansKhuulga"
import useBankniiGuilgeeToololt from "hooks/khuulga/useBankniiGuilgeeToololt"
import GuilgeeKholbokh from "components/pageComponents/tulbur/GuilgeeKholbokh"
import _ from "lodash"
import { modal } from "components/ant/Modal"
import Tulbur from "components/pageComponents/eBarimt/Tulbur"
const { RangePicker } = DatePicker

function tulburTootsoo({ token }) {
  const refGuilgee = React.useRef(null)
  const { baiguullaga } = useAuth()
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = React.useState([moment(), moment()])
  const { dans } = useDans(token)
  const [songogdsonDans, setSongogdsonDans] = React.useState(null)
  const [songogdsonTurul, setSongogdsonTurul] = React.useState(null)
  const { bankniiGuilgeeToololt, bankniiGuilgeeToololtMutate } =
    useBankniiGuilgeeToololt(token, ekhlekhOgnoo, songogdsonDans)
  const [order, setOrder] = React.useState({ tranDate: -1, time: 0 })

  const query = React.useMemo(() => {
    if (songogdsonTurul === "Тодорхойгүй")
      return {
        magadlaltaiGereenuud: { $eq: null },
        kholbosonGereeniiId: { $eq: null },
      }
    else if (songogdsonTurul === "Холбогдсон")
      return {
        kholbosonGereeniiId: { $ne: null },
      }
    else if (songogdsonTurul === "Магадлалтай")
      return {
        magadlaltaiGereenuud: { $exists: true, $ne: null },
        kholbosonGereeniiId: { $eq: null },
      }
    else return {}
  }, [songogdsonTurul])

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

  function dansSongoy(number) {
    let songogdsonDans = dans?.accounts?.find((a) => a.number === number)
    setDansniiKhuulgaKhuudaslalt((a) => ({ ...a, khuudasniiDugaar: 1 }))
    setSongogdsonDans(songogdsonDans)
  }

  function guilgeeKholbyo(data) {
    if (data?.kholbosonGereeniiId) {
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
      icon: <FileExcelOutlined />,
      content: (
        <GuilgeeKholbokh
          data={data}
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
        <div className="w-full flex flex-row justify-between">
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
      <Card className="col-span-12 p-5 cardgrid">
        <div className="w-full grid grid-cols-12 gap-4">
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
                className="border-2 border-green-600 rounded-xl col-span-12 md:col-span-6 lg:col-span-3 intro-y cursor-pointer zoom-in"
                onClick={() => turulSongyo(mur.utga)}
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
          <RangePicker
            style={{ marginBottom: "20px" }}
            value={ekhlekhOgnoo}
            onChange={setEkhlekhOgnoo}
          />
          <div className="w-40 ml-4">
            <Select
              placeholder="Данс"
              style={{ width: "100%" }}
              onChange={dansSongoy}
            >
              {dans?.accounts?.map((a) => (
                <Select.Option key={a.number} value={a.number}>
                  <div>{a.number}</div>
                </Select.Option>
              ))}
            </Select>
          </div>
          {songogdsonDans && (
            <div className="p-1 flex flex-row space-x-2 ml-auto font-medium">
              Үлдэгдэл: {formatNumber(songogdsonDans.balance)}{" "}
              {songogdsonDans.currency}
            </div>
          )}
        </div>
        <Table
          bordered
          size="middle"
          scroll={{ y: "calc(100vh - 30rem)" }}
          columns={[
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
                return `${formatNumber(a)}₮`
              },
              sorter: (a, b) => Number(a.amount || 0) - Number(b.amount || 0),
            },
            {
              title: "Шилжүүлсэн данс",
              align: "center",
              dataIndex: "relatedAccount",
              ellipsis: true,
              width: "10rem",
            },
            {
              title: "Төлөв",
              width: "4rem",
              align: "center",
              render(a) {
                return (
                  <div className="flex items-center justify-center">
                    <Button
                      shape="circle"
                      className="ant-pagination-item-link"
                      onClick={() => guilgeeKholbyo(a)}
                      icon={
                        <div
                          className={`text-${
                            !a?.kholbosonGereeniiId
                              ? a?.magadlaltaiGereenuud?.length > 0
                                ? "yellow"
                                : "red"
                              : "green"
                          }-500 flex items-center justify-center`}
                        >
                          {!a?.kholbosonGereeniiId ? (
                            a?.magadlaltaiGereenuud?.length > 0 ? (
                              <QuestionOutlined style={{ fontSize: "22px" }} />
                            ) : (
                              <ExclamationOutlined
                                style={{ fontSize: "22px" }}
                              />
                            )
                          ) : (
                            <CheckOutlined style={{ fontSize: "22px" }} />
                          )}
                        </div>
                      }
                    />
                  </div>
                )
              },
            },
            {
              title: "Талбай",
              dataIndex: "kholbosonTalbainId",
              ellipsis: true,
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
                      shape="circle"
                      className="ant-pagination-item-link"
                      icon={
                        <div
                          className={`text-500 flex items-center justify-center`}
                        >
                          {a?.kholbosonGereeniiId &&
                          a?.ebarimtAvsanEsekh === true ? (
                            <Tooltip title="И-баримт хэвлэсэн байна">
                              <CheckOutlined
                                style={{ fontSize: "22px", color: "green" }}
                              />
                            </Tooltip>
                          ) : (
                            <ExclamationOutlined
                              style={{ fontSize: "22px", color: "red" }}
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
          ]}
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
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default tulburTootsoo
