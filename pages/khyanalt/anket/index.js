import {
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  EyeOutlined,
  FileDoneOutlined,
  HistoryOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import {
  DatePicker,
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Popover,
  Space,
  Table,
  Tabs,
  Tag,
  Select,
} from "antd"
import React, { useMemo, useState, useRef, useEffect } from "react"
import { useAuth } from "services/auth"
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee"
import useSurveyJagsaalt from "hooks/useSurvey"
import moment from "moment"
import useOrder from "tools/function/useOrder"
import _ from "lodash"
const garalt = {
  khuudasniiDugaar: 1,
  khuudasniiKhemjee: 10,
}

import Admin from "components/Admin"
import shalgaltKhiikh from "services/shalgaltKhiikh"

function Khabea({ token }) {
  useEffect(() => {
    anketJagsaalt()
  }, [])

  const { ajiltan, baiguullaga, barilgiinId } = useAuth()

  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ])

  const { order, onChangeTable } = useOrder({ createdAt: -1 })
  const [surveyJagsaalt, setSurveyJagsaalt] = useState([])
  const [queryGaraasUgsun, setQueryGaraasUgsun] = useState({
    ognoo:
      ekhlekhOgnoo !== undefined
        ? {
            $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
  })
  const formRef = useRef()
  const [asuulgaTurul, setAsuulgaTurul] = useState("text")
  const { TabPane } = Tabs
  const { RangePicker } = DatePicker

  const columns = useMemo(
    () => [
      {
        title: "№",
        key: "index",
        className: "text-center",
        width: "2rem",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Огноо",
        key: "createdAt",
        dataIndex: "createdAt",
        align: "center",
        render: (data) => {
          return moment(data).format("YYYY-MM-DD")
        },
      },
      {
        title: "Нэр",
        key: "ner",
        dataIndex: "ner",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Утас",
        key: "utas",
        dataIndex: "utas",
        align: "center",
        ellipsis: true,
      },
      {
        title: "И-мэйл",
        key: "mail",
        dataIndex: "mail",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Чиглэл",
        key: "chiglel",
        dataIndex: "chiglel",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Хугацаа",
        key: "uilAjillagaa",
        dataIndex: "uilAjillagaa",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Ажилтан тоо",
        key: "ajiltniiToo",
        dataIndex: "ajiltniiToo",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Талбайн хэмжээ",
        key: "talbainKhemjee",
        dataIndex: "talbainKhemjee",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Давхар",
        align: "center",
        dataIndex: "",
        ellipsis: true,
        render: (data) => {
          var turul = Array.from(new Set(data?.davkhar)).toString()
          return turul
        },
      },
      {
        title: "Нэмэлт",
        key: "nemeltMedeelel",
        dataIndex: "nemeltMedeelel",
        ellipsis: true,
        align: "center",
      },
    ],
    []
  )

  function ognoogoorShuukh(orolt, ognoo) {
    queryGaraasUgsun.ognoo = {
      $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
      $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
    }
    setQueryGaraasUgsun({
      ...queryGaraasUgsun,
    })
  }
  function onChangeOgnoo(date, dateString) {
    setEkhlekhOgnoo(dateString)
    ognoogoorShuukh(garalt, dateString)
  }
  function khadgalakh() {
    // const asuulga = formRef.current.getFieldsValue(asuulga)
    // const khadgalakhUgugDul = asuulga.asuulga.map((x) =>
    //   Object.assign(x, {
    //     baiguullagiinId: baiguullaga?._id,
    //     barilgiinId: barilgiinId,
    //   })
    // )
    // if (khadgalakhUgugDul.length > 0) {
    //   uilchilgee(token)
    //     .post("/asuulgaOlnoorKhadgalya", khadgalakhUgugDul)
    //     .then(({ data }) => {
    //       if (data !== undefined) {
    //         message.success("Бүртгэл амжилттай хийгдлээ")
    //         formRef.current.resetFields()
    //         asuulgiinMutate()
    //       }
    //     })
    //     .catch(aldaaBarigch)
    // }
  }
  function asuulgaUstgay(id) {
    uilchilgee(token)
      .post("/asuulgaUstgay", { id: id })
      .then(({ data }) => {
        if (data !== undefined) {
          message.success("Устгагдлаа")
          asuulgiinMutate()
        }
      })
      .catch(aldaaBarigch)
  }
  function anketJagsaalt() {
    uilchilgee(token)
      .get("/survey", {
        params: {
          queryGaraasUgsun,
          order,
          khuudasniiKhemjee: 100,
          khuudasniiDugaar: 1,
        },
      })
      .then(({ data }) => {
        if (data !== undefined) {
          setSurveyJagsaalt(data?.jagsaalt)
        }
      })
  }
  return (
    <Admin
      title="Анкетын асуулга бэлдэх"
      khuudasniiNer="anket"
      onSearch={(search) =>
        setAsuulgiinKhuudaslalt((kh) => ({
          ...kh,
          khuudasniiDugaar: 1,
          search,
        }))
      }
    >
      <div className="col-span-12 p-0 md:p-5">
        <Tabs>
          {/* <TabPane
            key="1"
            tab={
              <span>
                <FileDoneOutlined style={{ fontSize: "32px" }} />
                Асуулга үүсгэх
              </span>
            }
          >
            <div className="grid w-full grid-cols-12 gap-6">
              <div className="box col-span-5 p-5 md:col-span-8 xl:col-span-5">
                <Form
                  ref={formRef}
                  name="dynamic_form_nest_item"
                  onFinish={khadgalakh}
                  labelCol={{
                    span: 12,
                  }}
                  wrapperCol={{
                    span: 24,
                  }}
                  layout="horizontal"
                >
                  <Form.List name="asuulga">
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map((key, name, fieldKey, ...restField) => (
                          <Form.Item key={fieldKey.key}>
                            <div
                              style={{
                                display: "flex",
                                marginBottom: 8,
                                width: "80%",
                              }}
                            >
                              <Form.Item
                                name={[name, "asuult"]}
                                fieldKey={[fieldKey, "asuult"]}
                                {...restField}
                                //validateTrigger={["onChange", "onBlur"]}
                                rules={[
                                  {
                                    //required: true,
                                    whitespace: true,
                                    message: "",
                                  },
                                ]}
                                noStyle
                              >
                                <Input
                                  placeholder="асуулга бүртгэнэ үү"
                                  style={{ width: "80%" }}
                                />
                              </Form.Item>
                              <Form.Item
                                name={[name, "turul"]}
                                fieldKey={[fieldKey, "turul"]}
                                {...restField}
                                //validateTrigger={["onChange", "onBlur"]}
                                rules={[
                                  {
                                    //required: true,
                                    whitespace: true,
                                    message: "",
                                  },
                                ]}
                                noStyle
                              >
                                <Select
                                  value={asuulgaTurul}
                                  defaultValue={"text"}
                                  onChange={setAsuulgaTurul}
                                  style={{ width: "40%" }}
                                >
                                  <Option value="songolt">Сонголттой</Option>
                                  <Option value="text">Тэкст</Option>
                                </Select>
                              </Form.Item>
                              {fields.length > 1 ? (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button ml-2 mt-2 flex"
                                  onClick={() => remove(name)}
                                />
                              ) : null}
                            </div>
                            {asuulgaTurul === "songolt" && (
                              <div>
                                <Form.List name="songoltuud">
                                  {(fields, { add, remove }, { errors }) => (
                                    <>
                                      {fields.map(
                                        (key, name, fieldKey, ...restField) => (
                                          <Form.Item key={fieldKey.key}>
                                            <Form.Item
                                              name={[name, "songoltuud"]}
                                              fieldKey={[
                                                fieldKey,
                                                "songoltuud",
                                              ]}
                                              {...restField}
                                              //validateTrigger={["onChange", "onBlur"]}
                                              rules={[
                                                {
                                                  //required: true,
                                                  whitespace: true,
                                                  message: "",
                                                },
                                              ]}
                                              noStyle
                                            >
                                              <Input
                                                placeholder="сонголт бүртгэнэ үү"
                                                style={{ width: "90%" }}
                                              />
                                            </Form.Item>

                                            {fields.length > 1 ? (
                                              <MinusCircleOutlined
                                                className="dynamic-delete-button ml-4"
                                                onClick={() => remove(name)}
                                              />
                                            ) : null}
                                          </Form.Item>
                                        )
                                      )}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          htmlType="submit"
                                          onClick={() => add()}
                                          style={{ width: "30%" }}
                                          icon={<PlusOutlined />}
                                        >
                                          сонголт нэмэх
                                        </Button>
                                        <Button
                                          style={{ marginLeft: "10px" }}
                                          type="primary"
                                          htmlType="submit"
                                        >
                                          сонголт хадгалах
                                        </Button>

                                        <Form.ErrorList errors={errors} />
                                      </Form.Item>
                                    </>
                                  )}
                                </Form.List>
                              </div>
                            )}
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            htmlType="submit"
                            onClick={() => add()}
                            style={{ width: "60%" }}
                            icon={<PlusOutlined />}
                          >
                            Асуулга нэмэх
                          </Button>
                          <Button
                            style={{ marginLeft: "10px" }}
                            type="primary"
                            htmlType="submit"
                          >
                            Хадгалах
                          </Button>

                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form>
              </div>

              <div className="box col-span-7 overflow-auto p-5 md:col-span-4 xl:col-span-7">
                <Table
                  bordered
                  size="small"
                  rowClassName="hover:bg-blue-100"
                  scroll={{ y: "calc(100vh - 20rem)" }}
                  rowKey={(row) => row._id}
                  // pagination={{
                  //   current: asuulgiinGaralt?.khuudasniiDugaar,
                  //   pageSize: asuulgiinGaralt?.khuudasniiKhemjee,
                  //   total: asuulgiinGaralt?.niitMur,
                  //   showSizeChanger: true,
                  //   onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  //     setAsuulgiinKhuudaslalt((kh) => ({
                  //       ...kh,
                  //       khuudasniiDugaar,
                  //       khuudasniiKhemjee,
                  //     })),
                  // }}
                  // dataSource={asuulgiinGaralt?.jagsaalt}
                  //columns={asuumjColumns}
                />
              </div>
            </div>
          </TabPane> */}
          <TabPane
            key="2"
            tab={
              <span>
                <HistoryOutlined style={{ fontSize: "32px" }} />
                Асуулгын түүх
              </span>
            }
          >
            <div className="box col-span-12 overflow-auto p-5 md:col-span-6 xl:col-span-9">
              <div className="flex justify-between">
                <RangePicker
                  style={{ marginBottom: "15px" }}
                  size="large"
                  disabledTime
                  defaultValue={[
                    moment(new Date(), "YYYY-MM-DD"),
                    moment(new Date(), "YYYY-MM-DD"),
                  ]}
                  format={"YYYY-MM-DD"}
                  onChange={onChangeOgnoo}
                />
              </div>

              <Table
                bordered
                size="small"
                tableLayout="fixed"
                scroll={{ y: "calc(100vh - 20rem)" }}
                rowClassName={(record, index) =>
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-600 h-0.5"
                    : "bg-gray-200 dark:bg-gray-800 h-0.5"
                }
                dataSource={surveyJagsaalt}
                columns={columns}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Admin>
  )
}
export const getServerSideProps = shalgaltKhiikh

export default Khabea
