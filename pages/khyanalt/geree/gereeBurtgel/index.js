//#region import
import moment from "moment"
import { useAuth } from "services/auth"
import readMethod from "tools/function/crud/readMethod"
import {
  FileDoneOutlined,
  UserOutlined,
  HistoryOutlined,
  FileSyncOutlined,
  WarningOutlined,
  FileExcelOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
  SettingOutlined,
  FieldTimeOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons"
import {
  Table,
  Card,
  Popover,
  Badge,
  Popconfirm,
  Drawer,
  DatePicker,
  Button,
  Space,
  message,
  Input,
  notification,
} from "antd"
import { toWords } from "mon_num"
import Admin from "components/Admin"
import formatNumber from "tools/function/formatNumber"
import React, { useMemo } from "react"
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt"
import { useGereeniiJagsaaltToollolt } from "hooks/useGereeniiJagsaalt"
import uilchilgee, { url } from "services/uilchilgee"
import GereeKharakh from "components/pageComponents/geree/Kharakh"
import router from "next/router"
import { useReactToPrint } from "react-to-print"
import locale from "antd/lib/date-picker/locale/mn_MN"
import GereeExceleesOruulakh from "components/pageComponents/geree/GereeExceleesOruulakh"
import Sungakh from "components/pageComponents/geree/Sungakh"
import { modal } from "components/ant/Modal"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import CardList from "components/cardList"
import GereeTile from "./dedKheseg/GereeTile"
//#endregion

const Tailbar = React.forwardRef(({ token, destroy, confirm, data }, ref) => {
  const [shaltgaan, setTailbar] = React.useState("")
  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        uilchilgee(token)
          .post("/gereeTsutslaya", {
            gereeniiId: data?._id,
            barilgiinId: data?.barilgiinId,
            shaltgaan,
          })
          .then(({ data }) => {
            if (data === "Amjilttai") {
              message.success("Гэрээ амжилттай цуцаллаа")
              confirm(shaltgaan)
              destroy()
            }
          })
      },
      khaaya() {
        destroy()
      },
    }),
    [shaltgaan]
  )

  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1 font-medium">
        <div className="flex w-full flex-row justify-between">
          <div className="text-right">Эхлэх огноо:</div>
          <div>{moment(data?.gereeniiOgnoo).format("YYYY-MM-DD")}</div>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-right">Дуусах огноо:</div>
          <div>{moment(data?.duusakhOgnoo).format("YYYY-MM-DD")}</div>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-right">Ашигласан хоног:</div>
          <div>
            {moment(new Date()).diff(moment(data?.gereeniiOgnoo), "day")}
          </div>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-right">Авлагын дүн:</div>
          <div>{formatNumber(data?.uldegdel)}</div>
        </div>
      </div>

      <Input.TextArea
        value={shaltgaan}
        onChange={({ target }) => setTailbar(target?.value)}
      />
    </div>
  )
})

function ZakhialgiinKhyanalt() {
  //#region const
  const { token, baiguullaga, barilgiinId, ajiltan } = useAuth()
  const [shuult, setShuult] = React.useState({
    query: {},
  })
  const { gereeniiMedeelel, gereeniiMedeelelMutate, setGereeniiKhuudaslalt } =
    useGereeniiJagsaalt(token, baiguullaga?._id, undefined, shuult?.query)
  const { gereeToollolt } = useGereeniiJagsaaltToollolt(token)
  const [kharuulakhGeree, setKharuulakhGeree] = React.useState(null)
  const [gereeniiTokhirgoo, setGereeniiTokhirgoo] = React.useState(null)
  const componentRef = React.useRef()
  const excelref = React.useRef()
  const tailbarRef = React.useRef()
  const sungaltRef = React.useRef()

  //#endregion

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const khyanaltiinDun = [
    {
      too: gereeToollolt?.reduce(
        (a, b) =>
          (b?.unuudurTulukh || 0) +
          (b?.khugatsaaKhetersen || 0) +
          (b?.kheviin || 0) +
          (b?.sungakh || 0),
        0
      ),
      icon: <UserOutlined />,
      utga: "Нийт",
      color: "text-green-500",
      selectedColor: "bg-green-100",
      border: "border-green-500",
      query: {},
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.kheviin, 0)
          : 0,

      icon: <FileDoneOutlined />,
      utga: "Хэвийн",
      color: "text-green-500",
      selectedColor: "bg-green-100",
      border: "border-green-500",
      query: {
        tuluv: { $nin: [-1]  },
        duusakhOgnoo: { $gte: new Date() },
      },
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.khugatsaaKhetersen, 0)
          : 0,
      icon: <HistoryOutlined />,
      utga: "Хугацаа хэтэрсэн",
      color: "text-red-500",
      selectedColor: "bg-red-100",
      border: "border-red-500",
      query: {
        duusakhOgnoo: { $lte: new Date() }
      },
    },
    {
      too: 0,
      icon: <FileSyncOutlined />,
      utga: "Хаагдсан",
      color: "text-blue-500",
      selectedColor: "bg-blue-100",
      border: "border-blue-500",
      query: { tuluv: 9 },
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.sungakh, 0)
          : 0,
      icon: <WarningOutlined />,
      utga: "Сунгах гэрээ",
      color: "text-yellow-500",
      selectedColor: "bg-yellow-100",
      border: "border-yellow-500",
      query: { duusakhOgnoo: { $lte: moment(new Date()).add(1, "month") } },
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.tsutsalsan, 0)
          : 0,
      icon: <FileExcelOutlined />,
      utga: "Цуцласан",
      color: "text-gray-800",
      selectedColor: "bg-gray-200",
      border: "border-gray-800",
      query: { tuluv: -1 },
    },
  ]

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "Бүртгэсэн",
        dataIndex: "createdAt",
        ellipsis: true,
        className: "text-center",
        align: "center",
        render(date) {
          return moment(date).format("YYYY-MM-DD HH:mm")
        },
      },
      {
        title: "Гэрээ",
        dataIndex: "gereeniiDugaar",
        className: "text-center",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Талбай",
        dataIndex: "talbainDugaar",
        className: "text-center",
        align: "center",
        ellipsis: true,
      },

      {
        title: "Төрөл",
        dataIndex: "turul",
        align: "center",
        className: "text-center",
        ellipsis: true,
      },

      {
        title: "Талбай /м2/",
        dataIndex: "talbainKhemjee",
        align: "center",
        className: "text-center",
        ellipsis: true,
        render: (talbainKhemjee) => {
          return `${talbainKhemjee} м2`
        },
        showSorterTooltip: false,

        sorter: (a, b) =>
          Number(a.talbainKhemjee || 0) - Number(b.talbainKhemjee || 0),
      },
      {
        title: "Төлбөр",
        dataIndex: "sariinTurees",
        className: "text-center",
        align: "center",
        ellipsis: true,
        render: (sariinTurees) => {
          return formatNumber(sariinTurees || 0)
        },
        showSorterTooltip: false,
        sorter: (a, b) =>
          Number(a.sariinTurees || 0) - Number(b.sariinTurees || 0),
      },
      {
        title: "Эхлэх",
        dataIndex: "gereeniiOgnoo",
        className: "text-center",
        align: "center",
        ellipsis: true,
        render: (data) => {
          return moment(data).format("YYYY-MM-DD")
        },
      },
      {
        title: "Дуусах хоног",
        dataIndex: "duusakhOgnoo",
        className: "text-center",
        align: "center",
        ellipsis: true,
        render: (duusakhOgnoo) => {
          return moment(duusakhOgnoo).diff(moment(new Date()), "days")
        },
      },
      {
        title: "Дуусах",
        dataIndex: "duusakhOgnoo",
        className: "text-center",
        align: "center",
        ellipsis: true,
        render: (data) => {
          return moment(data).format("YYYY-MM-DD")
        },
        showSorterTooltip: false,
        defaultSortOrder: "descend",
        sorter: (a, b) =>
          moment(a.duusakhOgnoo).unix() - moment(b.duusakhOgnoo).unix(),
      },
      {
        title: "Ажилтан",
        dataIndex: "burtgesenAjiltaniiNer",
        className: "text-center",
        align: "center",
        ellipsis: true,
        render: () => {
          return "Админ"
        },
      },
      {
        title: "Хавсралт",
        ellipsis: true,
        className: "text-center",
        align: "center",
        width: "5rem",
        render: (mur) => {
          const data = []
          if (!!mur?.gerchilgeeniiZurag)
            data.push({
              label: "Гэрчилгээний зураг",
              turul: "gerchilgeeniiZurag",
              zurgiinId: mur?.gerchilgeeniiZurag,
            })
          if (!!mur?.unemlekhniiZurag)
            data.push({
              label: "Үнэмлэхний зураг",
              turul: "unemlekhniiZurag",
              zurgiinId: mur?.unemlekhniiZurag,
            })
          if (!!mur?.zuvshuurliinZurag)
            data.push({
              label: "Зөвшөөрлийн зураг",
              turul: "zuvshuurliinZurag",
              zurgiinId: mur?.zuvshuurliinZurag,
            })

          if (data.length > 0)
            return (
              <Popover
                content={
                  <Table
                    pagination={false}
                    size="small"
                    dataSource={data}
                    columns={[
                      {
                        title: "Хавсралт",
                        dataIndex: "label",
                      },
                      {
                        render: (data) => {
                          return (
                            <img
                              className="h-36 w-36"
                              src={`${url}/zuragAvya/${data?.turul}/${baiguullaga?._id}/${data?.zurgiinId}`}
                            />
                          )
                        },
                      },
                    ]}
                  ></Table>
                }
                trigger="click"
              >
                <a className="flex items-center justify-center hover:bg-gray-200">
                  <Badge size="small" count={data.length}>
                    <EyeOutlined style={{ fontSize: "18px" }} />
                  </Badge>
                </a>
              </Popover>
            )
        },
      },
      {
        title: () => <SettingOutlined />,
        fixed: "right",
        className: "text-center",
        align: "center",
        width: "3rem",
        render: (data) => (
          <div className="flex flex-row justify-center">
            <Popover
              onVisibleChange={(visible) =>
                setGereeniiTokhirgoo(visible === true ? data?._id : null)
              }
              visible={data?._id === gereeniiTokhirgoo}
              content={() => (
                <div className="flex w-24 flex-col space-y-2">
                  <a
                    className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100"
                    onClick={() => gereeKharya(data)}
                  >
                    <EyeOutlined style={{ fontSize: "18px" }} />{" "}
                    <label> Харах</label>
                  </a>
                  <a
                    className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100"
                    onClick={() => {
                      if (
                        ajiltan?.erkh === "Admin" ||
                        !!_.get(ajiltan, `tokhirgoo.gereeZasakhErkh`)?.find(
                          (a) => a === data.barilgiinId
                        )
                      )
                        router.push(
                          `/khyanalt/geree/gereeBaiguulakh/${data._id}`
                        )
                      else
                        notification.warning({
                          message: "Таньд гэрээ засах эрх байхгүй байна.",
                        })
                    }}
                  >
                    <EditOutlined style={{ fontSize: "18px" }} />
                    <label> Засах</label>
                  </a>
                  <a
                    className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100"
                    onClick={() => gereeSungaya(data)}
                  >
                    <FieldTimeOutlined style={{ fontSize: "18px" }} />
                    <label> Сунгах</label>
                  </a>
                  <Popconfirm
                    title="Цуцлахдаа итгэлтэй байна уу?"
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={() => gereeTsutsalya(data)}
                  >
                    <a className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100">
                      <MinusCircleOutlined style={{ fontSize: "18px" }} />
                      <label> Цуцлах</label>
                    </a>
                  </Popconfirm>
                </div>
              )}
              placement="bottom"
              trigger="click"
            >
              <a className="flex items-center justify-center rounded-full hover:bg-gray-200">
                <MoreOutlined style={{ fontSize: "18px" }} />
              </a>
            </Popover>
          </div>
        ),
      },
    ]

    return jagsaalt
  }, [baiguullaga, token, gereeniiTokhirgoo])

  //#region dialogs
  function gereeTsutsalya(data) {
    setGereeniiTokhirgoo(null)
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        Цуцлах
      </Button>,
    ]
    modal({
      width: "20vw",
      title: "Цуцалсан шалтгаан",
      icon: <MinusCircleOutlined />,
      content: (
        <Tailbar
          ref={tailbarRef}
          data={data}
          token={token}
          confirm={() => gereeniiMedeelelMutate()}
        />
      ),
      footer,
    })
  }

  function gereeSungaya(data) {
    setGereeniiTokhirgoo(null)
    const footer = [
      <Button onClick={() => sungaltRef.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => sungaltRef.current.khadgalya()}>
        Сунгах
      </Button>,
    ]
    modal({
      width: "20vw",
      title: "Гэрээ сунгах",
      icon: <MinusCircleOutlined />,
      content: (
        <Sungakh
          ref={sungaltRef}
          data={data}
          token={token}
          confirm={() => gereeniiMedeelelMutate()}
        />
      ),
      footer,
    })
  }

  function gereeKharya(geree) {
    readMethod("gereeniiZagvar", token, geree.gereeniiZagvariinId).then(
      ({ data }) => {
        if (!!data) {
          if (geree.gereeniiOgnoo) {
            geree.ekhlekhOn = moment(geree.gereeniiOgnoo).format("YYYY")
            geree.ekhelkhSar = moment(geree.gereeniiOgnoo).format("MM")
            geree.ekhlekhUdur = moment(geree.gereeniiOgnoo).format("DD")
            if (geree.khugatsaa > 0) {
              let duusakhOgnoo = moment(geree.gereeniiOgnoo).add(
                geree.khugatsaa,
                "M"
              )
              geree.duusakhOn = duusakhOgnoo.format("YYYY")
              geree.duusakhSar = duusakhOgnoo.format("MM")
              geree.duusakhUdur = duusakhOgnoo.format("DD")
            }
          }
          geree.talbainNegjUneUsgeer = toWords(geree.talbainNegjUne)
          geree.talbainNiitUneUsgeer = toWords(geree.talbainNiitUne)

          for (const [key, value] of Object.entries(geree)) {
            data.dedKhesguud
              .filter((a) => !!a.zaalt && a.zaalt?.indexOf(key) !== -1)
              .map((b) => {
                b.zaalt = b.zaalt.replace(
                  new RegExp(`&lt;${key}&gt;`, "g"),
                  value
                )
              })
            data.baruunTolgoi = data.baruunTolgoi?.replace(
              new RegExp(`&lt;${key}&gt;`, "g"),
              value
            )
          }
          data.geree = geree
          setKharuulakhGeree(data)
          setGereeniiTokhirgoo(null)
        }
      }
    )
  }

  function gereeOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>Хаах</Button>
      </Space>,
    ]
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GereeExceleesOruulakh
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          baiguullaga={baiguullaga}
          onFinish={gereeniiMedeelelMutate}
          zam="gereeniiExcelTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Харилцагч загварын excel файл"
          zagvariinZam="gereeniiExcelAvya"
        />
      ),
      footer,
    })
  }

  //#endregion

  return (
    <Admin
      khuudasniiNer="gereeBurtgel"
      title="Гэрээний жагсаалт"
      className="p-0 md:p-5"
      tsonkhniiId="61c2c5dc1c2830c4e6f90c6d"
      onSearch={(search) =>
        setGereeniiKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
    >
      <Drawer
        title={kharuulakhGeree?.gereeniiDugaar}
        width={"50vw"}
        onClose={() => setKharuulakhGeree(null)}
        visible={!!kharuulakhGeree}
        footer={
          <div>
            <button onClick={handlePrint}>Хэвлэх</button>
          </div>
        }
      >
        {!!kharuulakhGeree && (
          <GereeKharakh
            ref={componentRef}
            print={handlePrint}
            data={kharuulakhGeree}
          />
        )}
      </Drawer>
      <Card className="cardgrid col-span-12 p-5">
        <div className="grid w-full grid-cols-12 gap-6 border-solid">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className={`border-2 ${
                  mur?.utga === shuult?.utga ? mur.border : "border-green-500"
                } intro-y zoom-in col-span-12 cursor-pointer rounded-xl sm:col-span-12 lg:col-span-2 ${
                  mur?.utga === shuult?.utga ? mur.selectedColor : ""
                }`}
                onClick={() => setShuult(mur)}
              >
                <div className="h-full rounded-xl">
                  <div className="rounded-xl p-3">
                    <div className="flex">
                      <div>
                        <div
                          className={`text-3xl ${
                            mur?.utga === shuult?.utga
                              ? mur.color
                              : "text-green-500"
                          } font-bold`}
                        >
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {mur.utga}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div
                          className={`${
                            mur?.utga === shuult?.utga
                              ? mur.color
                              : "text-green-500"
                          } text-2xl`}
                        >
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
        <div className="mt-5 flex flex-row">
          <DatePicker.RangePicker locale={locale} />
          <div className="ml-auto">
            <Button
              style={{
                alignItems: "end",
                backgroundColor: "#209669",
                color: "#ffffff",
                display: "flex",
              }}
              icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              onClick={gereeOruulakhExcel}
            >
              Excel -ээс Гэрээ татах
            </Button>
          </div>
        </div>
        <div className="mt-8 hidden overflow-auto md:block">
          <Table
            bordered
            scroll={{ y: "calc(100vh - 32rem)" }}
            size="small"
            loading={!gereeniiMedeelel}
            rowKey={(row) => row._id}
            columns={columns}
            dataSource={gereeniiMedeelel?.jagsaalt}
            pagination={{
              current: gereeniiMedeelel?.khuudasniiDugaar,
              pageSize: gereeniiMedeelel?.khuudasniiKhemjee,
              total: gereeniiMedeelel?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setGereeniiKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />
        </div>
        <CardList
          keyValue="geree"
          className="block overflow-auto md:hidden"
          jagsaalt={gereeniiMedeelel?.jagsaalt}
          Component={GereeTile}
          componentProps={{ router }}
          pagination={{
            current: gereeniiMedeelel?.khuudasniiDugaar,
            pageSize: gereeniiMedeelel?.khuudasniiKhemjee,
            total: gereeniiMedeelel?.niitMur,
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

export default ZakhialgiinKhyanalt
