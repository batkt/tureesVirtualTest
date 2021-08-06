import moment from "moment"
import { useAuth } from "services/auth"
import { modal } from "components/ant/Modal"
import {
  FileDoneOutlined,
  FileSearchOutlined,
  PlusOutlined,
  StarTwoTone,
  CheckCircleTwoTone,
  OrderedListOutlined,
  EditOutlined,
  UserOutlined,
  HistoryOutlined,
  FileSyncOutlined,
  WarningOutlined,
  FileExcelOutlined
} from "@ant-design/icons"
import {
  Table,
  Select,
  Form,
  Input,
  Button,
  Tabs,
  Card,
  DatePicker,
  message,
  Tag,
  Popover,
  Modal
} from "antd"

import Admin from "components/Admin"
import CardList from "components/cardList"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import uilchilgee from "services/uilchilgee"

import formatNumber from "tools/function/formatNumber"
import { useState, useRef, useMemo, useEffect } from "react"
import useZakhialga from "hooks/useZakhialga"
import useUridchilsanZakhialgaToololt from "hooks/useUridchilsanZakhialgaToololt"
import useKhuviarlagdaaguiZakhialga from "hooks/useKhuviarlagdaaguiZakhialga"
import { useRouter } from "next/router"
//#region const
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}
const { TabPane } = Tabs
const { RangePicker } = DatePicker

const tuluvStyle = {
  display: "flex",
  fontSize: "0.8rem",
  fontWeight: "bold",
  justifyContent: "space-between"
}
const garalt = {
  khuudasniiDugaar: 1,
  khuudasniiKhemjee: 10
}

//#endregion

function ZakhialgiinKhyanalt({ token }) {
  const { ajiltan, baiguullaga } = useAuth()
  const router = useRouter()
  const [gereeJagsaalt, setGereeJagsaalt] = useState([])

  useEffect(() => {
    gereeniiJagsaalt()
  }, [])

  function gereeniiJagsaalt() {
    uilchilgee()
      .get("/api/geree")
      .then(({ data }) => {
        console.log("data", data)
        if (!!data) {
          setGereeJagsaalt(data.rows)
        }
      })
  }

  const khyanaltiinDun = useMemo(() => {
    return [
      {
        too: 150,
        icon: <UserOutlined />,
        khuvi: 100,
        utga: "Нийт"
      },
      {
        too: 100,
        icon: <FileDoneOutlined />,
        khuvi: -30,
        utga: "Хэвийн"
      },
      {
        too: 5,
        icon: <HistoryOutlined />,
        khuvi: 100,
        utga: "Хугацаа хэтэрсэн"
      },
      {
        too: 15,
        icon: <FileSyncOutlined />,
        khuvi: 100,
        utga: "Хаагдсан"
      },
      {
        too: 20,
        icon: <WarningOutlined />,
        khuvi: 100,
        utga: "Төлбөр дутуу"
      },
      {
        too: 10,
        icon: <FileExcelOutlined />,
        khuvi: 100,
        utga: "Цуцласан"
      }
    ]
  }, [])
  const columns = useMemo(() => {
    var jagsaalt = [
      // {
      //   title: "№",
      //   key: "index",
      //   className: "text-center",
      //   render: (text, record, index) =>
      //     (zakhialgiinGaralt?.khuudasniiDugaar || 0) *
      //       (zakhialgiinGaralt?.khuudasniiKhemjee || 0) -
      //     (zakhialgiinGaralt?.khuudasniiKhemjee || 0) +
      //     index +
      //     1
      // },
      {
        title: "Овог",
        dataIndex: "ovog",
        key: "ovog",
        ellipsis: true
      },
      {
        title: "Нэр",
        dataIndex: "ner",
        key: "ner",
        ellipsis: true
      },
      {
        title: "Утас",
        dataIndex: "utas",
        ellipsis: true,
        render: (data) => {
          var dugaar = data?.map((x) => x).join(";")
          dugaar = Array.from(new Set(dugaar.split(";"))).toString()
          return <a>{dugaar}</a>
        }
      },
      {
        title: "Регистер",
        dataIndex: "register",
        key: "register",
        ellipsis: true
      },

      {
        title: "Гэрээ",
        dataIndex: "gereeniiDugaar",
        ellipsis: true
      },
      {
        title: "Повьлон",
        dataIndex: "gereeniiDugaar",
        ellipsis: true
      },
      {
        title: "Талбай /м2/",
        dataIndex: "khariltsagchiinUtas",
        ellipsis: true,
        render: () => {
          return "50 м2"
        }
      },
      {
        title: "Эхлэх",
        dataIndex: "gereeniiOgnoo",
        ellipsis: true,
        render: (data) => {
          return moment(data).format("YYYY-MM-DD")
        }
      },
      {
        title: "Дуусах",
        dataIndex: "duusakhOgnoo",
        ellipsis: true,
        render: (data) => {
          return moment(data).format("YYYY-MM-DD")
        }
      },
      {
        title: "Хугацаа/сар/",
        dataIndex: "khugatsaa",
        ellipsis: true
      },
      {
        title: "Сарын түрээс",
        dataIndex: "sariinTurees",
        ellipsis: true,
        render: (data) => {
          return formatNumber(data) + "₮"
        }
      },
      // {
      //   title: "Төлөв",
      //   align: "center",
      //   ellipsis: true,
      //   render: (data) => {
      //     if (data.tuluv !== undefined) {
      //       var tuluv = ""
      //       var khugatsaa = ""
      //       let color = "geekblue"
      //       switch (data.tuluv) {
      //         case "1":
      //           tuluv = "ХУВИАРЛАГДСАН"
      //           color = "orange"
      //           khugatsaa = moment(data.updatedAt).format("YYYY-MM-DD HH:mm")
      //           break
      //         case "2":
      //           tuluv = "ХИЙГДЭЖ БАЙНА"
      //           khugatsaa = moment(data.ekhelsenTsag).format("YYYY-MM-DD HH:mm")
      //           break
      //         case "3":
      //           tuluv = "ДУУССАН"
      //           color = "green"
      //           khugatsaa = moment(data.duussanTsag).format("YYYY-MM-DD HH:mm")
      //           break
      //         case "-1":
      //           tuluv = "ЦУЦЛАГДСАН"
      //           color = "red"
      //           khugatsaa = moment(data.updatedAt).format("YYYY-MM-DD HH:mm")
      //           break
      //         default:
      //           break
      //       }
      //       return (
      //         <div style={tuluvStyle} className="whitespace-nowrap">
      //           <Tag color={color}>
      //             <span>{tuluv}</span>
      //           </Tag>
      //           <span>{khugatsaa}</span>
      //         </div>
      //       )
      //     }
      //   }
      // },

      {
        title: "Бүртгэсэн",
        dataIndex: "burtgesenAjiltaniiNer",
        ellipsis: true,
        render: () => {
          return "Админ"
        }
      }
    ]

    return jagsaalt
  }, [])
  return (
    <Admin
      khuudasniiNer="gereeBurtgel"
      title="Гэрээний жагсаалт"
      className="p-0 md:p-5"
      onSearch={(search) => setKhuudaslalt((a) => ({ ...a, search }))}
    >
      <Card className="col-span-12 p-5 cardgrid">
        <div className="w-full border-solid grid grid-cols-12 gap-6">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className="border-2 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-2 intro-y cursor-pointer zoom-in"
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

        {/* <div>
          <RangePicker
            style={{ marginBottom: "15px" }}
            size="large"
            disabledTime
            defaultValue={[
              moment(new Date(), "YYYY-MM-DD"),
              moment(new Date(), "YYYY-MM-DD")
            ]}
            format={"YYYY-MM-DD"}
            onChange={onChangeOgnoo}
          />
        </div> */}
        <div className="overflow-auto hidden md:block mt-8">
          <Table
            bordered
            scroll={{ y: "calc(100vh - 32rem)" }}
            size="small"
            rowKey={(row) => row._id}
            columns={columns}
            dataSource={gereeJagsaalt}
          />
        </div>
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default ZakhialgiinKhyanalt
