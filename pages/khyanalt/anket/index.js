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
import React, { useMemo, useState, useRef } from "react"
import { useAuth } from "services/auth"
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee"
import moment from "moment"
import _ from "lodash"
const garalt = {
  khuudasniiDugaar: 1,
  khuudasniiKhemjee: 10,
}

import Admin from "components/Admin"
import shalgaltKhiikh from "services/shalgaltKhiikh"

function Khabea({ token }) {
  const { ajiltan, baiguullaga, barilgiinId } = useAuth()

  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ])
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

  const [expand, setExpand] = useState([])

  const { TabPane } = Tabs
  const { RangePicker } = DatePicker

  const delgerenguiColumns = useMemo(
    () => [
      {
        title: "Асуумж",
        ellipsis: true,
        key: "asuulga",
        dataIndex: "asuulga",
      },
      {
        title: "Хариулт",
        key: "khariult",
        dataIndex: "khariult",
        ellipsis: true,
        render: (khariult) => {
          return (
            <Tag color={khariult === true ? "green" : "red"}>
              {khariult === true ? "Тийм" : "Үгүй"}
            </Tag>
          )
        },
      },
      {
        title: "Тайлбар",
        ellipsis: true,
        key: "tailbar",
        dataIndex: "tailbar",
      },
    ],
    []
  )
  const columns = useMemo(
    () => [
      {
        title: "№",
        key: "index",
        className: "text-center",
        width: "3rem",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Огноо",
        key: "ognoo",
        dataIndex: "ognoo",
        ellipsis: true,
        render: (ognoo) => {
          return moment(ognoo).format("YYYY-MM-DD")
        },
      },
      {
        title: "Ажилтан",
        key: "ajiltniiNer",
        dataIndex: "ajiltniiNer",
        ellipsis: true,
      },
      {
        title: "Хариулт",
        key: "khariult",
        dataIndex: "",
        ellipsis: true,
        render: (data) => {
          return (
            <Tag color="green">
              <span className="text-sm">
                {data.niitAsuult + "/" + data.bugulsun}
              </span>
            </Tag>
          )
        },
      },
      {
        title: "Дэлгэрэнгүй",
        key: "tokhirgoo",
        align: "center",
        render: (data) => {
          return (
            <Popover
              trigger="click"
              content={
                <Table
                  style={{ display: "flex", width: "800px" }}
                  size="small"
                  rowClassName="hover:bg-blue-100"
                  dataSource={data?.asuulguud}
                  columns={delgerenguiColumns}
                ></Table>
              }
            >
              <a className="ant-dropdown-link flex items-center justify-center rounded-full p-2 hover:bg-gray-200">
                <EyeOutlined style={{ fontSize: "18px" }} />
              </a>
            </Popover>
          )
        },
      },
      {
        title: "Гарын үсэг",
        dataIndex: "",
        ellipsis: true,
        key: "gariinUseg",
        render: (record) => {
          var zuragcomp = (
            <img src={`${url}/gariinUsegAvya/${record?.ajiltniiId}`} />
          )
          if (record.niitAsuult === record.bugulsun) {
            return (
              <Popover
                content={<div className="flex h-40 w-40">{zuragcomp}</div>}
              >
                <div className="inline-flex h-9 w-24 justify-center p-1 ">
                  {zuragcomp}
                </div>
              </Popover>
            )
          }
        },
      },
    ],
    []
  )
  const columnsOgnoo = useMemo(() => [
    {
      title: "№",
      key: "index",
      className: "text-center",
      width: "3rem",
      render: (text, record, index) =>
        (asuulgiinTuukhGaralt?.khuudasniiDugaar || 0) *
          (asuulgiinTuukhGaralt?.khuudasniiKhemjee || 0) -
        (asuulgiinTuukhGaralt?.khuudasniiKhemjee || 0) +
        index +
        1,
    },
    {
      title: "Огноо",
      key: "ognoo",
      dataIndex: "ognoo",
    },
    {
      title: "Гүйцэтгэл",
      key: "guitsetgel",
      render: (data) => {
        return (
          <Tag color="green">
            {asuulgiinTuukhGaralt?.jagsaalt.filter(
              (x) =>
                moment(x.ognoo).format("YYYY-MM-DD") ===
                moment(data?.ognoo).format("YYYY-MM-DD")
            ).length +
              " / " +
              asuulgiinTuukhGaralt?.jagsaalt.filter(
                (x) =>
                  (moment(x.ognoo).format("YYYY-MM-DD") ===
                    moment(data?.ognoo).format("YYYY-MM-DD") &&
                    x.bugulsun === x.niitAsuult) ||
                  0
              ).length}
          </Tag>
        )
      },
    },
  ])
  // const asuumjColumns = useMemo(
  //   () => [
  //     {
  //       title: "№",
  //       key: "index",
  //       className: "text-center",
  //       width: "3rem",
  //       render: (text, record, index) =>
  //         (asuulgiinGaralt?.khuudasniiDugaar || 0) *
  //           (asuulgiinGaralt?.khuudasniiKhemjee || 0) -
  //         (asuulgiinGaralt?.khuudasniiKhemjee || 0) +
  //         index +
  //         1,
  //     },
  //     {
  //       title: "Огноо",
  //       key: "ognoo",
  //       dataIndex: "ognoo",
  //       width: "8rem",
  //       ellipsis: true,
  //       render: (data) => {
  //         return moment(data?.ognoo).format("YYYY-MM-DD")
  //       },
  //     },
  //     {
  //       title: "Асуулт",
  //       ellipsis: true,
  //       dataIndex: "asuult",
  //       key: "asuult",
  //     },
  //     {
  //       title: () => <SettingOutlined />,
  //       key: "tokhirgoo",
  //       width: "3rem",
  //       align: "center",
  //       render: (data) =>
  //         ajiltan?.erkh === "Admin" && (
  //           <Space size="small">
  //             <Popconfirm
  //               title="Асуумж устгах уу?"
  //               okText="Тийм"
  //               cancelText="Үгүй"
  //               onConfirm={() => asuulgaUstgay(data._id)}
  //             >
  //               <a className="flex items-center justify-center rounded-full hover:bg-gray-200">
  //                 <DeleteOutlined style={{ fontSize: "16px", color: "red" }} />
  //               </a>
  //             </Popconfirm>
  //           </Space>
  //         ),
  //       ellipsis: true,
  //     },
  //   ],
  //   [ajiltan, asuulgiinGaralt]
  // )

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
  function test() {
    console.log("test", formRef.current.getFieldValue("turul"))
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
          <TabPane
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
                                width: "600px",
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
          </TabPane>
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
                scroll={{ y: "calc(100vh - 20rem)" }}
                rowClassName={(record, index) =>
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-600 h-0.5"
                    : "bg-gray-200 dark:bg-gray-800 h-0.5"
                }
                rowKey={(x) => x.ognoo}
                //pagination={false}
                // dataSource={_(
                //   asuulgiinTuukhGaralt?.jagsaalt
                //     .filter((x) => x.asuulguud.length > 0)
                //     .map((a) => {
                //       a.ognoo = moment(a.ognoo).format("YYYY-MM-DD")
                //       return a
                //     })
                // )
                //   .groupBy("ognoo")
                //   .map((items, ognoo) => ({ ognoo: ognoo, jagsaalt: items }))
                //   .value()}
                // columns={columnsOgnoo}
                // expandable={{
                //   expandedRowRender: (mur) => (
                //     <Table
                //       bordered
                //       columns={columns}
                //       dataSource={asuulgiinTuukhGaralt?.jagsaalt.filter(
                //         (x) =>
                //           moment(x.ognoo).format("YYYY-MM-DD") ===
                //           moment(mur?.ognoo).format("YYYY-MM-DD")
                //       )}
                //       pagination={false}
                //     />
                //   ),
                //   expandedRowClassName: (a, index) =>
                //     index % 2 === 0
                //       ? "bg-white dark:bg-gray-600"
                //       : "bg-gray-200 dark:bg-gray-800",
                //   expandedRowKeys: [expand],
                //   onExpand: (a, b) => setExpand(a === true && b.ognoo),
                // }}
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
