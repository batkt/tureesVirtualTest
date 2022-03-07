import { DeleteOutlined } from "@ant-design/icons"
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  notification,
  Popconfirm,
  Select,
  Table,
  Tabs,
} from "antd"
import Admin from "components/Admin"
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt"
import useKhungulultTuukh from "hooks/tulburTootsoo/useKhungulultTuukh"
import _ from "lodash"
import moment from "moment"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "services/auth"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import uilchilgee, { aldaaBarigch } from "services/uilchilgee"
import createMethod from "tools/function/crud/createMethod"
import formatNumber from "tools/function/formatNumber"

function tulburTootsoo() {
  const { token, baiguullaga, barilgiinId,ajiltan } = useAuth()
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([moment(), moment()])
  const formRef = useRef()
  const [songogdsonGereenuud, setSongogdsonGereenuud] = useState([])
  const [shuult, setShuult] = React.useState({
    query: { tuluv: { $ne: -1 }},
  })
  const query = useMemo(() => {
    return {
      createdAt: {
        $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
        $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
      },
    }
  }, [ekhlekhOgnoo])
  const [form] = Form.useForm()
  const { gereeniiMedeelel, gereeniiMedeelelMutate, setGereeniiKhuudaslalt } =
    useGereeniiJagsaalt(
      token,
      baiguullaga?._id,
      undefined,
      shuult?.query,
      undefined,
      1000
    )
  const { khungulultTuukh, khungulultTuukhMutate, setKhuudaslalt } =
    useKhungulultTuukh(token, baiguullaga?._id, query)

  const [tootsoolol, setTootsoolol] = useState({
    niitTalbai: 0,
    niitSariinTurees: 0,
    khunglugdsunDun: 0,
    niitTulukhDun: 0,
  })
  const [selectedRowKeys, setRowKeys] = useState([])

  const { Option } = Select
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  useEffect(() => {
    var khuvi = form?.getFieldValue("khungulukhKhuvi")
    tootsoolol.niitTalbai = songogdsonGereenuud?.length
    tootsoolol.niitSariinTurees = songogdsonGereenuud?.reduce(
      (a, b) => a + Number(b?.sariinTurees),
      0
    )
    tootsoolol.khunglugdsunDun =
      (Number(tootsoolol.niitSariinTurees) * khuvi) / 100
    tootsoolol.niitTulukhDun =
      Number(tootsoolol.niitSariinTurees) - Number(tootsoolol.khunglugdsunDun)
    setTootsoolol({ ...tootsoolol })
  }, [songogdsonGereenuud])

  function disabledDate(current) {
    return current && current < moment().endOf("day")
  }
  function handleChange(value) {
    if (value.length > 0) {
      setShuult({
        query: { davkhar: value, tuluv: { $nin: -1 } },
      })
    } else {
    }
    setRowKeys([])
    setSongogdsonGereenuud([])
  }
  function khungulultKhadgalya() {
    if((ajiltan?.erkh !== 'Admin' && !_.get(ajiltan,`tokhirgoo.khungulultUzuulekhEsekh`)?.find(a=>a === barilgiinId))){
      notification.warning({message:'Таньд гэрээ хөнгөлөх эрх байхгүй байна.'})
      return
    }
    if (songogdsonGereenuud.length > 0) {
      var ugugdul = form.getFieldsValue()
      ugugdul.ognoonuud = [
        moment(ugugdul.ognoonuud).format("YYYY-MM-01 00:00:00"),
      ]
      ugugdul.barilgiinId = barilgiinId
      ugugdul.tulukhDun = tootsoolol.niitSariinTurees
      ugugdul.khungulsunDun = tootsoolol.niitTulukhDun
      ugugdul.khungulultiinDun = tootsoolol.khunglugdsunDun
      ugugdul.khamaataiGereenuud = songogdsonGereenuud.map(
        (x) => (x._id = x._id)
      )

      createMethod("khungulultKhadgalya", token, ugugdul)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success("Хөнгөлөлт амжилттай хийгдлээ")
            formRef.current.resetFields()
            setTootsoolol({})
          }
        })
        .catch(aldaaBarigch)
    } else {
      message.warning("Хөнгөлөх талбай сонгоно уу")
    }
  }
  function ustgaya(mur) {
    uilchilgee(token)
      .post("/khungulultUstgaya", {
        id: mur?._id,
      })
      .then(({ data }) => {
        if (data !== undefined) {
          khungulultTuukhMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true)
          message.success("Устгагдлаа")
        }
      })
  }
  function tseverlekh() {
    formRef.current.resetFields()
    setShuult()
  }
  function onSelectChange(selectedRowKeys, selectedRows) {
    setRowKeys(selectedRowKeys)
    setSongogdsonGereenuud(selectedRows)
  }
  return (
    <Admin
      title="Хөнгөлөлт"
      khuudasniiNer="khungulult"
      className="p-0 md:p-4"
      onSearch={(search) => {
        setGereeniiKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }}
    >
      <div className="col-span-12">
        <Tabs size="large">
          <Tabs.TabPane tab="Хөнгөлөлт оруулах" key="1">
            <div className="w-full grid grid-cols-12 gap-6">
              <div className="col-span-3 md:col-span-8 xl:col-span-3 border-solid border border-green-300 bg-white p-5">
                <Form
                  form={form}
                  ref={formRef}
                  name="control-ref"
                  initialValues={{ remember: true }}
                  labelCol={{
                    span: 9,
                  }}
                  wrapperCol={{
                    span: 14,
                  }}
                  layout="horizontal"
                >
                  <Form.Item
                    name="ognoonuud"
                    label="Хөнгөлөх сар"
                    rules={[
                      {
                        required: true,
                        message: "Хөнгөлөх сар бүртгэнэ үү!",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      disabledDate={disabledDate}
                      picker="month"
                      placeholder="Сар"
                    />
                  </Form.Item>
                  <Form.Item name="turul" label="Нөхцөл">
                    <Select placeholder="Нөхцөл">
                      <Option value="Давхараар">Давхараар</Option>
                      <Option value="Бүгд">Бүгд</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="davkhar" label="Давхар">
                    <Select
                      mode="multiple"
                      placeholder="Давхар"
                      onChange={handleChange}
                      disabled={
                        form?.getFieldValue("turul") === "Бүгд" ? true : false
                      }
                    >
                      {baiguullaga?.barilguud
                        ?.find((b) => b._id === barilgiinId)
                        ?.davkharuud.map((a) => (
                          <Select.Option key={a.davkhar} value={a.davkhar}>
                            {a.davkhar}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="Хөнгөлөх хувь" name="khungulukhKhuvi">
                    <Input placeholder="Хөнгөлөх хувь" />
                  </Form.Item>
                  <Form.Item label="Шалтгаан" name="shaltgaan">
                    <Input.TextArea placeholder="Шалтгаан" />
                  </Form.Item>
                  <div className="flex-column grid mt-12 text-base">
                    <div className="flex justify-between">
                      Нийт талбайн тоо :<a>{tootsoolol.niitTalbai}</a>
                    </div>
                    <div className="flex justify-between">
                      Нийт түрээсийн орлого :
                      <a>{formatNumber(tootsoolol.niitSariinTurees || 0)}</a>
                    </div>
                    <div className="flex justify-between">
                      Нийт хөнгөлөгдсөн дүн :
                      <a className="text-red-400">
                        {formatNumber(tootsoolol.khunglugdsunDun || 0)}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      Нийт төлөх дүн :
                      <a className="text-green-500">
                        {formatNumber(tootsoolol.niitTulukhDun || 0)}
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between mt-10">
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        onClick={khungulultKhadgalya}
                        style={{ backgroundColor: "#209669", color: "#ffffff" }}
                      >
                        хадгалах
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        danger
                        type="primary"
                        onClick={tseverlekh}
                        //style={{ backgroundColor: "#209669", color: "#ffffff" }}
                      >
                        цэвэрлэх
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
              <div className="col-span-9 md:col-span-3 xl:col-span-9 box p-5 overflow-auto">
                <Table
                  // rowSelection={{
                  //   type: "checkbox",
                  //   onChange: (selectedRowKeys, selectedRows) => {
                  //     setSongogdsonGereenuud(selectedRows)
                  //   },
                  // }}
                  rowSelection={rowSelection}
                  bordered
                  scroll={{ y: "calc(100vh - 20rem)" }}
                  size="small"
                  loading={!gereeniiMedeelel}
                  rowKey={(row) => row._id}
                  columns={[
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
                      title: "Давхар",
                      dataIndex: "davkhar",
                      align: "center",
                      width: "4rem",
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
                        Number(a.talbainKhemjee || 0) -
                        Number(b.talbainKhemjee || 0),
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
                        Number(a.sariinTurees || 0) -
                        Number(b.sariinTurees || 0),
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
                  ]}
                  dataSource={gereeniiMedeelel?.jagsaalt}
                  pagination={false}
                />
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Хөнгөлөлт түүх" key="2">
            <div className="w-full grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-8 xl:col-span-12 box p-5">
                <div className="w-full flex flex-row justify-between mt-5">
                  <DatePicker.RangePicker
                    style={{ marginBottom: "20px" }}
                    size="middle"
                    value={ekhlekhOgnoo}
                    onChange={setEkhlekhOgnoo}
                  />
                </div>

                <Table
                  bordered
                  tableLayout={"fixed"}
                  size="small"
                  rowClassName="hover:bg-blue-100"
                  dataSource={khungulultTuukh?.jagsaalt}
                  pagination={{
                    current: khungulultTuukh?.khuudasniiDugaar,
                    pageSize: 100,
                    total: khungulultTuukh?.niitMur,
                    showSizeChanger: true,
                    onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                      setKhuudaslalt((kh) => ({
                        ...kh,
                        khuudasniiDugaar,
                        khuudasniiKhemjee,
                      })),
                  }}
                  scroll={{ y: "calc(100vh - 26rem)" }}
                  rowKey={(row) => row.id}
                  className="t-head"
                  columns={[
                    {
                      title: "Огноо",
                      dataIndex: "date",
                      ellipsis: true,
                      align: "center",
                      render: (data) => {
                        return moment(data).format("YYYY-MM-DD hh:mm:ss")
                      },
                    },
                    {
                      title: "Хөнгөлөлт %",
                      dataIndex: "khungulukhKhuvi",
                      ellipsis: true,
                      align: "center",
                    },
                    {
                      title: "Хугацаа",
                      dataIndex: "ognoonuud",
                      ellipsis: true,
                      align: "center",
                      render: (data) => {
                        return moment(data).format("YYYY-MM-DD")
                      },
                    },
                    {
                      title: "Төлөх дүн",
                      dataIndex: "tulukhDun",
                      align: "center",
                      render: (data) => {
                        return formatNumber(data) + "₮"
                      },
                    },
                    {
                      title: "Хөнгөлөх дүн",
                      dataIndex: "khungulultiinDun",
                      align: "center",
                      render: (data) => {
                        return formatNumber(data) + "₮"
                      },
                    },
                    {
                      title: "Төлсөн дүн",
                      dataIndex: "khungulsunDun",
                      align: "center",
                      render: (data) => {
                        return formatNumber(data) + "₮"
                      },
                    },
                    {
                      title: "Төрөл",
                      dataIndex: "turul",
                      ellipsis: true,
                      align: "center",
                    },
                    {
                      title: "Шалтгаан",
                      dataIndex: "shaltgaan",
                      ellipsis: true,
                      align: "center",
                    },

                    {
                      width: "60px",
                      align: "center",
                      render(data) {
                        return (
                          <Popconfirm
                            title="хөнгөлөлт устгах уу?"
                            okText="Тийм"
                            cancelText="Үгүй"
                            onConfirm={() => ustgaya(data)}
                          >
                            <Button
                              danger
                              size="small"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              shape="circle"
                              icon={<DeleteOutlined />}
                            />
                          </Popconfirm>
                        )
                      },
                    },
                  ]}
                />
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default tulburTootsoo
