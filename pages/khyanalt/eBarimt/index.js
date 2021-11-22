import moment from "moment"
import { useAuth } from "services/auth"
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons"
import {
  Table,
  Button,
  Tabs,
  Card,
  DatePicker,
  message,
  Popconfirm,
  Popover,
} from "antd"

import Admin from "components/Admin"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import uilchilgee, { aldaaBarigch } from "services/uilchilgee"
import formatNumber from "tools/function/formatNumber"
import dateDiff from "tools/function/dateDiff"
import { useMemo, useState } from "react"
import useEBarimt from "hooks/useEBarimt"
import useEBarimtMedeelel from "hooks/useEBarimtMedeelel"
import useZakhialga from "hooks/useZakhialga"

const { TabPane } = Tabs
const { RangePicker } = DatePicker
//#endregion

function turulAvya(turul) {
  var value = ""
  switch (turul) {
    case "belen":
      value = "Бэлэн"
      break
    case "khaan":
      value = "Хаан"
      break
    case "khariltsakh":
      value = "Харилцах"
      break
    case "khas":
      value = "Хас"
      break
    case "khariult":
      value = "Хариулт"
      break

    default:
      value = turul
      break
  }
  return value
}

function ZakhialgiinKhyanalt({ token }) {
  const { ajiltan } = useAuth()
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ])

  const [tab, setTab] = useState("1")

  const query = useMemo(() => {
    return {
      ognoo: {
        $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
        $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
      },
      tuluv: "3",
      tulburTulsunEsekh: true,
    }
  }, [ekhlekhOgnoo])

  function ebarimtIlgeeye() {
    uilchilgee(token)
      .post("/ebarimtIlgeeye")
      .then(({ status }) => {
        status === 200 && message.success("Баримт амжилттай илгээлээ")
        eBarimtMedeelelMutate()
      })
      .catch(aldaaBarigch)
  }

  function ebarimtUstgaya(mur) {
    uilchilgee(token)
      .post("/ebarimtButsaaya", mur)
      .then(({ data }) => {
        if (!!data) {
          eBarimtMutate()
          message.success(
            `${mur.zakhialgiinDugaar} дугаартай захиалга амжилттай ebarimt -с устгагдлаа`
          )
        }
      })
  }

  function ebarimtZasya(mur) {
    console.log(mur)
  }

  return (
    <Admin
      khuudasniiNer="eBarimt"
      title="И-баримтын бүртгэл"
      className="p-0 md:p-5"
      onSearch={(search) => setKhuudaslalt((a) => ({ ...a, search }))}
    >
      <Card className="col-span-12 p-5 cardgrid">
        <Tabs onChange={setTab} size="large" style={{ marginTop: "20px" }}>
          <TabPane
            key="1"
            tab={
              <span className="flex flex-row items-center space-x-2">
                <img
                  src="https://ebarimt.mn/assets/img/logo.svg"
                  className="w-10 h-10"
                />
                <span>E Barimt</span>
              </span>
            }
          >
            <div className="w-full flex flex-row justify-between">
              <RangePicker
                style={{ marginBottom: "20px" }}
                size="large"
                defaultValue={[
                  moment(new Date(), "YYYY-MM-DD"),
                  moment(new Date(), "YYYY-MM-DD"),
                ]}
              />
              <div className="flex flex-row space-x-2">
                <Button title="Сүүлд илгээгдсэн огноо">
                  {moment(new Date()).format("YYYY-MM-DD")}
                </Button>
                <Button danger>Татварт илгээх</Button>
              </div>
            </div>
            <Table
              bordered
              tableLayout={"fixed"}
              size="middle"
              rowClassName="hover:bg-blue-100"
              dataSource={[
                {
                  ognoo: "2021-11-23",
                  turul: "Иргэн",
                  billId: "4561215484131248",
                  gereeniiDugaar: "ГГ-021",
                  dun: "500.000₮",
                },
                {
                  ognoo: "2021-11-23",
                  turul: "Байгууллага",
                  billId: "4561215484131248",
                  gereeniiDugaar: "ГГ-025",
                  dun: "500.000₮",
                },
                {
                  ognoo: "2021-11-23",
                  turul: "Иргэн",
                  billId: "4561215484131248",
                  gereeniiDugaar: "ГГ-026",
                  dun: "250.000₮",
                },
                {
                  ognoo: "2021-11-13",
                  turul: "Иргэн",
                  billId: "4561215484131248",
                  gereeniiDugaar: "ГГ-012",
                  dun: "300.000₮",
                },
                {
                  ognoo: "2021-11-23",
                  turul: "Байгууллага",
                  billId: "4561215484131248",
                  gereeniiDugaar: "ГГ-052",
                  dun: "450.000₮",
                },
              ]}
              // pagination={{
              //   current: eBarimtGaralt?.khuudasniiDugaar,
              //   pageSize: eBarimtGaralt?.khuudasniiKhemjee,
              //   total: eBarimtGaralt?.niitMur,
              //   showSizeChanger: true,
              //   onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              //     setEBarimtKhuudaslalt((kh) => ({
              //       ...kh,
              //       khuudasniiDugaar,
              //       khuudasniiKhemjee,
              //     })),
              // }}
              scroll={{ x: "calc(100vh - 15rem)" }}
              rowKey={(row) => row.id}
              columns={[
                {
                  title: "Огноо",
                  dataIndex: "ognoo",
                  ellipsis: true,
                },
                {
                  title: "Төрөл",
                  dataIndex: "turul",
                  ellipsis: true,
                },
                {
                  title: "ДДТД",
                  dataIndex: "billId",
                  ellipsis: true,
                },
                {
                  title: "Гэрээний дугаар",
                  dataIndex: "gereeniiDugaar",
                  ellipsis: true,
                },

                {
                  title: "Дүн",
                  dataIndex: "dun",
                  ellipsis: true,
                },

                {
                  title: "Үйлдэл",
                  fixed: "right",
                  render(mur) {
                    return (
                      <div className="flex flex-row space-x-2">
                        <Button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          type="default"
                          shape="circle"
                          icon={<EditOutlined />}
                        />
                        <Popconfirm
                          title="ebarimt устгах уу?"
                          okText="Тийм"
                          cancelText="Үгүй"
                        >
                          <Button
                            danger
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            type="default"
                            shape="circle"
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      </div>
                    )
                  },
                },
              ]}
            />
          </TabPane>
        </Tabs>
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default ZakhialgiinKhyanalt
