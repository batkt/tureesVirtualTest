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
import { useState, useRef, useMemo } from "react"
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
      {
        title: "№",
        key: "index",
        className: "text-center",
        render: (text, record, index) =>
          (zakhialgiinGaralt?.khuudasniiDugaar || 0) *
            (zakhialgiinGaralt?.khuudasniiKhemjee || 0) -
          (zakhialgiinGaralt?.khuudasniiKhemjee || 0) +
          index +
          1
      },
      {
        title: "Нэр",
        dataIndex: "khariltsagchiinNer",
        key: "khariltsagchiinNer",
        ellipsis: true
      },
      {
        title: "Утас",
        dataIndex: "khariltsagchiinUtas",
        ellipsis: true
      },
      {
        title: "Регистер",
        dataIndex: "khariltsagchiinNer",
        key: "khariltsagchiinNer",
        ellipsis: true
      },

      {
        title: "Гэрээ",
        dataIndex: "khariltsagchiinUtas",
        ellipsis: true
      },
      {
        title: "Повьлон",
        dataIndex: "khariltsagchiinUtas",
        ellipsis: true
      },
      {
        title: "Талбай /м2/",
        dataIndex: "khariltsagchiinUtas",
        ellipsis: true
      },
      {
        title: "Эхлэх",
        dataIndex: "khariltsagchiinUtas",
        ellipsis: true
      },
      {
        title: "Дуусах",
        dataIndex: "khariltsagchiinUtas",
        ellipsis: true
      },
      {
        title: "Хугацаа",
        dataIndex: "khariltsagchiinUtas",
        ellipsis: true
      },
      {
        title: "Дүн",
        dataIndex: "khariltsagchiinUtas",
        ellipsis: true
      },
      {
        title: "Төлөв",
        align: "center",
        ellipsis: true,
        render: (data) => {
          if (data.tuluv !== undefined) {
            var tuluv = ""
            var khugatsaa = ""
            let color = "geekblue"
            switch (data.tuluv) {
              case "1":
                tuluv = "ХУВИАРЛАГДСАН"
                color = "orange"
                khugatsaa = moment(data.updatedAt).format("YYYY-MM-DD HH:mm")
                break
              case "2":
                tuluv = "ХИЙГДЭЖ БАЙНА"
                khugatsaa = moment(data.ekhelsenTsag).format("YYYY-MM-DD HH:mm")
                break
              case "3":
                tuluv = "ДУУССАН"
                color = "green"
                khugatsaa = moment(data.duussanTsag).format("YYYY-MM-DD HH:mm")
                break
              case "-1":
                tuluv = "ЦУЦЛАГДСАН"
                color = "red"
                khugatsaa = moment(data.updatedAt).format("YYYY-MM-DD HH:mm")
                break
              default:
                break
            }
            return (
              <div style={tuluvStyle} className="whitespace-nowrap">
                <Tag color={color}>
                  <span>{tuluv}</span>
                </Tag>
                <span>{khugatsaa}</span>
              </div>
            )
          }
        }
      },

      {
        title: "Бүртгэсэн",
        dataIndex: "burtgesenAjiltaniiNer",
        ellipsis: true
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
                className="border-2 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-2 intro-y cursor-pointer"
              >
                <div className="zoom-in">
                  <div className="box p-5">
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

          {/* <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2 focus:bg-blue-500 focus-within:bg-blue-500"
            style={{
              borderRadius: "10px",
              borderColor: "#1F618D",
              borderLeft: "5px solid #1F618D",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#1F618D",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            ></span>
            <span className="ml-4 2xl:text-xl">Бүх</span>
          </Card>

          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            style={{
              borderRadius: "10px",
              borderColor: "#1990ff",
              borderLeft: "5px solid #1990ff",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#1990ff",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            ></span>
            <span className="ml-4 2xl:text-xl">Хэвийн</span>
          </Card>
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            style={{
              borderRadius: "10px",
              borderColor: "#52BE80",
              borderLeft: "5px solid #52BE80",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#52BE80",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            ></span>
            <span className="ml-4 2xl:text-xl">Хугацаа хэтэрсэн</span>
          </Card>
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            style={{
              borderRadius: "10px",
              borderColor: "#52BE80",
              borderLeft: "5px solid #52BE80",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#52BE80",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            ></span>
            <span className="ml-4 2xl:text-xl">Төлбөр дутуу</span>
          </Card>
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            style={{
              borderRadius: "10px",
              borderColor: "#FF7F50",
              borderLeft: "5px solid #FF7F50",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#FF7F50",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            ></span>
            <span className="ml-4 2xl:text-xl">Хаагдсан</span>
          </Card>
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            style={{
              borderRadius: "10px",
              borderColor: "#1F618D",
              borderLeft: "5px solid #1F618D",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#1F618D",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            ></span>
            <span className="ml-4 2xl:text-xl">Цуцласан</span>
          </Card> */}
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
        <div className="overflow-auto hidden md:block mt-5">
          <Table
            bordered
            scroll={{ y: "calc(100vh - 32rem)" }}
            size="small"
            rowKey={(row) => row._id}
            columns={columns}
            //dataSource={zakhialgiinGaralt?.jagsaalt}
          />
        </div>
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default ZakhialgiinKhyanalt
