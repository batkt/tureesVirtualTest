import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  MinusCircleOutlined,
  MoreOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons"
import {
  Badge,
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Popover,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd"
import Admin from "components/Admin"
import { modal } from "components/ant/Modal"
import CardList from "components/cardList"
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh"
import TalbaiTile from "components/pageComponents/talbai/TalbaiTile"
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt"
import { useTalbai } from "hooks/useTalbai"
import useTalbainToololt from "hooks/useTalbainToololt"
import _ from "lodash"
import moment from "moment"
import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "services/auth"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee"
import useSWR from "swr"
import createMethod from "tools/function/crud/createMethod"
import deleteMethod from "tools/function/crud/deleteMethod"
import updateMethod from "tools/function/crud/updateMethod"
import formatNumber from "tools/function/formatNumber"
import useOrder from "tools/function/useOrder"
import Aos from "aos"
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e
  }

  return e && e.fileList
}

function talbaiBurtgekh({ token }) {
  useEffect(() => {
    Aos.init()
  })
  const formRef = useRef()
  const excelref = useRef()
  const { TextArea } = Input
  const { ajiltan, baiguullaga, barilgiinId } = useAuth()
  const [shuult, setShuult] = useState({
    query: { talbainDugaar: "105" },
  })
  const [query, setQuery] = useState({})
  const { order, onChangeTable } = useOrder({ createAt: -1 })
  const { setTalbaiKhuudaslalt, talbainiiGaralt, talbainiiJagsaaltMutate } =
    useTalbai(token, baiguullaga?._id, query, order)

  const { gereeniiMedeelel, gereeniiMedeelelMutate, setGereeniiKhuudaslalt } =
    useGereeniiJagsaalt(token, baiguullaga?._id, undefined, shuult?.query)

  const [talbaiState, settalbaiState] = useState({
    kod: undefined,
    talbainKhemjee: undefined,
    tailbar: undefined,
    talbainNegjUne: undefined,
    talbainNiitUne: undefined,
    ashiglaltiinZardal: undefined,
    niitAshiglaltiinZardal: undefined,
    tureesiinTulbur: undefined,
    davkhar: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
    zasakhEsekh: false,
  })

  const { talbainToololt } = useTalbainToololt(token)

  const khyanaltiinDun = [
    {
      too: talbainToololt?.reduce((a, b) => a + b.too, 0),
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <line x1="3" y1="21" x2="21" y2="21" />{" "}
          <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />{" "}
          <path d="M5 21v-10.15" /> <path d="M19 21v-10.15" />{" "}
          <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
        </svg>
      ),
      khuvi: 100,
      utga: "Нийт",
      query: {},
    },
    {
      too: talbainToololt?.find((a) => a._id === true)?.too || 0,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{" "}
          <circle cx="8.5" cy="7" r="4" />{" "}
          <polyline points="17 11 19 13 23 9" />
        </svg>
      ),
      khuvi: -30,
      utga: "Идэвхтэй",
      query: { idevkhiteiEsekh: true },
    },
    {
      too: talbainToololt?.find((a) => a._id === false)?.too || 0,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{" "}
          <circle cx="8.5" cy="7" r="4" />{" "}
          <line x1="18" y1="8" x2="23" y2="13" />{" "}
          <line x1="23" y1="8" x2="18" y2="13" />
        </svg>
      ),
      khuvi: 100,
      utga: "Идэвхгүй",
      query: { idevkhiteiEsekh: false },
    },
    {
      too: 0,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <circle cx="9" cy="7" r="4" />{" "}
          <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />{" "}
          <line x1="19" y1="7" x2="19" y2="10" />{" "}
          <line x1="19" y1="14" x2="19" y2="14.01" />
        </svg>
      ),
      khuvi: 100,
      utga: "Түр",
      query: { turEsekh: true },
    },
  ]

  function onChange(talbar, utga) {
    if (talbar === "talbainNegjUne") {
      let value = Number(utga) * Number(talbaiState.talbainKhemjee)
      if (
        (_.isNumber(Number(talbaiState.talbainNegjUne)) &&
          _.isNumber(utga) &&
          value) ||
        0
      ) {
        talbaiState.talbainNiitUne = value.toFixed(2)
        formRef.current.setFieldsValue({
          talbainNiitUne: talbaiState.talbainNiitUne,
        })
        talbaiState.tureesiinTulbur =
          Number(talbaiState.niitAshiglaltiinZardal) +
          Number(talbaiState.talbainNiitUne)
        formRef.current.setFieldsValue({
          tureesiinTulbur: talbaiState.tureesiinTulbur,
        })
      }
    }
    if (talbar === "ashiglaltiinZardal") {
      talbaiState.niitAshiglaltiinZardal = (
        utga * talbaiState.talbainKhemjee
      ).toFixed(2)
      formRef.current.setFieldsValue({
        niitAshiglaltiinZardal: talbaiState.niitAshiglaltiinZardal,
      })
      talbaiState.tureesiinTulbur =
        Number(talbaiState.niitAshiglaltiinZardal) +
        Number(talbaiState.talbainNiitUne)
      formRef.current.setFieldsValue({
        tureesiinTulbur: talbaiState.tureesiinTulbur,
      })
    }
    if (talbar === "talbainNiitUne") {
      let value = Number(utga) / Number(talbaiState.talbainKhemjee)
      if (
        (_.isNumber(Number(talbaiState.talbainNegjUne)) &&
          _.isNumber(utga) &&
          value) ||
        0
      ) {
        talbaiState.talbainNegjUne = value.toFixed(2)
        formRef.current.setFieldsValue({
          talbainNegjUne: talbaiState.talbainNegjUne,
        })
        talbaiState.tureesiinTulbur =
          Number(talbaiState.niitAshiglaltiinZardal) + Number(utga)
        formRef.current.setFieldsValue({
          tureesiinTulbur: talbaiState.tureesiinTulbur,
        })
      }
    }
    if (talbar === "talbainKhemjee") {
      let value =
        talbaiState.talbainNegjUne === undefined
          ? Number(talbaiState.talbainNiitUne) / Number(utga)
          : Number(utga) * Number(talbaiState.talbainNegjUne)

      if (_.isNumber(value) && !_.isNaN(value)) {
        if (talbaiState.talbainNegjUne === undefined) {
          formRef.current.setFieldsValue({
            talbainNegjUne: value.toFixed(2),
          })
        } else {
          talbaiState.talbainNiitUne = value.toFixed(2)
          formRef.current.setFieldsValue({
            talbainNiitUne: value.toFixed(2),
          })
        }
      }
    }
    if (talbar === "khurunguUne") {
      talbaiState.talbainNiitUne = (utga * talbaiState.talbainKhemjee).toFixed(
        2
      )
      formRef.current.setFieldsValue({})
    }
    settalbaiState((a) => ({ ...a, [talbar]: utga }))
  }
  function talbaiBurtgekh() {
    const khurunguud = formRef.current.getFieldsValue(khurunguud)
    talbaiState.baiguullagiinId = ajiltan?.baiguullagiinId
    talbaiState.barilgiinId = barilgiinId

    if (khurunguud?.khurunguud.length > 0) {
      talbaiState.khurunguud = khurunguud.khurunguud
      if (talbaiState.khurunguud[0].zurgiinId !== undefined) {
        talbaiState.khurunguud.map(
          (x) => (x.zurgiinId = x.zurgiinId[0].response.id)
        )
      }
    }

    if (talbaiState.zasakhEsekh === true) {
      uilchilgee(token)
        .post("/talbaiZasya", talbaiState)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success("Бүртгэл амжилттай засагдлаа")
            formRef.current.resetFields()
            talbainiiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            )
          }
        })
        .catch(aldaaBarigch)
    } else
      createMethod("talbai", token, talbaiState)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Бүртгэл амжилттай хийгдлээ")
            formRef.current.resetFields()
            talbainiiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            )
          }
        })
        .catch(aldaaBarigch)
  }

  function zasya(data) {
    data.zasakhEsekh = true
    formRef.current.setFieldsValue({ ...data })
    settalbaiState(data)
  }

  function talbaiUstgay(mur) {
    uilchilgee(token)
      .post("/talbaiUstgaya", { id: mur._id })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          talbainiiJagsaaltMutate()
          message.success("Устгагдлаа")
        }
      })
      .catch(aldaaBarigch)
  }

  function onFinish() {
    talbaiBurtgekh()
  }

  function onRefresh() {
    talbainiiJagsaaltMutate()
  }

  function test(data) {
    const khurunguud = formRef.current.getFieldsValue(khurunguud)
    formRef.current.setFieldsValue({
      [khurunguud]: {
        ...khurunguud,
        ["niit"]: khurunguud.une * khurunguud.too,
      },
    })
  }
  const [form] = Form.useForm()

  function talbaiOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>Хаах</Button>
        <Button
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          onClick={() => talbainiiJagsaaltMutate().finally(() => duusgakh())}
        >
          хадгалах
        </Button>
      </Space>,
    ]
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <ExceleesOruulakh
          ref={excelref}
          token={token}
          onFinish={onRefresh}
          barilgiinId={barilgiinId}
          zam="talbaiTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Талбайн excel файл"
          zagvariinZam="talbainZagvarAvya"
        />
      ),
      footer,
    })
  }
  function duusgakh() {
    message.success("Амжилттай бүртгэгдлээ")
    setTimeout(excelref.current.khaaya(), 2500)
  }
  return (
    <Admin
      title="Талбай бүртгэл"
      khuudasniiNer="talbaiBurtgekh"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setTalbaiKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
    >
      <div
        className="box col-span-12 overflow-y-scroll p-5 md:col-span-6  xl:col-span-3"
        style={{ maxHeight: "calc(100vh - 7rem)" }}
      >
        <Form
          ref={formRef}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          form={form}
          name="control-ref"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <div>
            <div data-aos="fade-right" data-aos-duration="1000">
              <Form.Item
                name="kod"
                label="Дугаар"
                rules={[
                  {
                    required: true,
                    message: "Дугаар бүртгэнэ үү!",
                  },
                ]}
              >
                <Input
                  type="text"
                  allowClear
                  placeholder="Дугаар"
                  value={talbaiState.kod}
                  onChange={(e) => onChange("kod", e.target.value)}
                ></Input>
              </Form.Item>
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
            >
              <Form.Item
                label="Хэмжээ"
                name="talbainKhemjee"
                rules={[
                  {
                    required: true,
                    message: "Талбайн хэмжээ бүртгэнэ үү!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  allowClear
                  placeholder="Талбайн хэмжээ/м2/"
                  value={talbaiState.talbainKhemjee}
                  onChange={(v) => onChange("talbainKhemjee", v)}
                ></InputNumber>
              </Form.Item>
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <Form.Item
                name="talbainNegjUne"
                label="Нэгж үнэ"
                rules={[
                  {
                    required: true,
                    message: "Нэгж үнэ бүртгэнэ үү!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Нэгж үнэ"
                  value={talbaiState.talbainNegjUne}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(target) => onChange("talbainNegjUne", target)}
                />
              </Form.Item>
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="300"
            >
              <Form.Item
                name="talbainNiitUne"
                label="Нийт үнэ"
                rules={[
                  {
                    required: true,
                    message: "Нийт үнэ бүртгэнэ үү!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Нийт үнэ"
                  value={talbaiState.talbainNiitUne}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(target) => onChange("talbainNiitUne", target)}
                />
              </Form.Item>
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="400"
            >
              <Form.Item
                name="ashiglaltiinZardal"
                label="Ашиглалтын зардал"
                rules={[
                  {
                    required: true,
                    message: "Зардал бүртгэнэ үү!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Ашиглалтын зардал"
                  value={talbaiState.ashiglaltiinZardal}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(target) => onChange("ashiglaltiinZardal", target)}
                />
              </Form.Item>
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="500"
            >
              <Form.Item
                name="niitAshiglaltiinZardal"
                label="Нийт зардал"
                rules={[
                  {
                    required: true,
                    message: "Зардал бүртгэнэ үү!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  readOnly={true}
                  placeholder="Нийт зардал"
                  value={talbaiState.niitAshiglaltiinZardal}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="600"
            >
              <Form.Item
                name="tureesiinTulbur"
                label="Түрээсийн төлбөр"
                rules={[
                  {
                    required: true,
                    message: "Түрээсийн бүртгэнэ үү!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  readOnly={true}
                  placeholder="Түрээсийн төлбөр"
                  value={talbaiState.tureesiinTulbur}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="700"
            >
              <Form.Item
                name="davkhar"
                label="Давхар"
                rules={[
                  {
                    required: true,
                    message: "Давхар бүртгэнэ үү!",
                  },
                ]}
              >
                <Select
                  placeholder="Давхар"
                  value={talbaiState.davkhar}
                  onChange={(e) => onChange("davkhar", e)}
                  allowClear
                >
                  {baiguullaga?.barilguud[0]?.davkharuud.map((a) => (
                    <Select.Option key={a._id} value={a.davkhar}>
                      {a.davkhar}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="tailbar" label="Тайлбар">
                <TextArea
                  rows={4}
                  allowClear
                  placeholder="Тайлбар"
                  value={talbaiState.tailbar}
                  onChange={(e) => onChange("tailbar", e.target.value)}
                ></TextArea>
              </Form.Item>
            </div>
          </div>
          <Divider>Хөрөнгийн бүртгэл</Divider>
          <div>
            <Form.List name="khurunguud">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Card>
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Row gutter={24}>
                          <Space>
                            <Form.Item
                              {...restField}
                              label="Нэр"
                              name={[name, "ner"]}
                              fieldKey={[fieldKey, "ner"]}
                              rules={[
                                { required: true, message: "Нэр бүртгэнэ үү" },
                              ]}
                            >
                              <Input placeholder="нэр" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              label="Тоо"
                              name={[name, "too"]}
                              fieldKey={[fieldKey, "too"]}
                              rules={[
                                {
                                  required: false,
                                  message: "Тоо ширхэг бүртгэнэ үү",
                                },
                              ]}
                            >
                              <Input placeholder="Тоо" />
                            </Form.Item>
                          </Space>
                          <Space>
                            <Form.Item
                              {...restField}
                              label="Үнэ"
                              name={[name, "une"]}
                              fieldKey={[fieldKey, "une"]}
                              rules={[
                                { required: false, message: "Үнэ бүртгэнэ үү" },
                              ]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Нэгж үнэ"
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/\$\s?|(,*)/g, "")
                                }
                                onChange={() => test({ ...fields })}
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              label="Нийт"
                              name={[name, "niit"]}
                              fieldKey={[fieldKey, "niit"]}
                              rules={[
                                {
                                  required: false,
                                  message: "Нийт бүртгэнэ үү",
                                },
                              ]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Нийт үнэ"
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/\$\s?|(,*)/g, "")
                                }
                              />
                            </Form.Item>
                          </Space>
                          <Space></Space>
                          <Form.Item
                            style={{ marginLeft: "10px" }}
                            {...restField}
                            name={[name, "zurgiinId"]}
                            fieldKey={[fieldKey, "zurgiinId"]}
                            getValueFromEvent={normFile}
                          >
                            <Upload
                              multiple={false}
                              listType="picture"
                              name="file"
                              action={`${url}/zuragKhadgalya`}
                              method="POST"
                              data={{ turul: "khurungu" }}
                              headers={{ Authorization: `bearer ${token}` }}
                            >
                              <Button icon={<UploadOutlined />}>
                                Зураг оруулах
                              </Button>
                            </Upload>
                          </Form.Item>
                        </Row>

                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    </Card>
                  ))}
                  <div className="flex justify-center">
                    <Form.Item>
                      <Space>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Хөрөнгө бүртгэх
                        </Button>
                        <Button
                          htmlType="submit"
                          //onClick={onFinish}
                          style={{
                            backgroundColor: "#209669",
                            color: "#ffffff",
                          }}
                        >
                          Хадгалах
                        </Button>
                      </Space>
                    </Form.Item>
                  </div>
                </>
              )}
            </Form.List>
          </div>
        </Form>
      </div>
      <Card
        size="small"
        className="col-span-12 overflow-auto p-5 md:col-span-6 xl:col-span-9"
      >
        <div className="grid w-full grid-cols-12 gap-6 border-solid">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className={`intro-y zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 lg:col-span-3 ${
                  JSON.stringify(query) === JSON.stringify(mur.query)
                    ? "bg-green-50"
                    : ""
                }`}
                onClick={() => setQuery(mur.query)}
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
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
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div
          className="ml-auto flex place-content-end"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <Popover
            content={() => (
              <div className="flex w-32 flex-col">
                <a
                  className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100"
                  onClick={talbaiOruulakhExcel}
                >
                  <UploadOutlined style={{ fontSize: "18px" }} />
                  <label>Оруулах</label>
                </a>
                <a
                  className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100"
                  onClick={() => {
                    const { Excel } = require("antd-table-saveas-excel")
                    const excelExport = new Excel()
                    excelExport
                      .addSheet("түрээсийн талбай")
                      .addColumns([
                        {
                          title: "Дугаар",
                          dataIndex: "kod",
                        },
                        {
                          title: "Давхар",
                          dataIndex: "davkhar",
                        },
                        {
                          title: "Талбай/м2/",
                          dataIndex: "talbainKhemjee",
                        },

                        {
                          title: "Нийт үнэ/₮/",
                          dataIndex: "talbainNiitUne",

                          render: (talbainNiitUne) => {
                            return formatNumber(talbainNiitUne || 0)
                          },
                        },
                        {
                          title: "Зардал",
                          dataIndex: "niitAshiglaltiinZardal",
                        },
                        {
                          title: "Төлбөр",
                          dataIndex: "tureesiinTulbur",
                        },
                        {
                          title: "Тайлбар",
                          dataIndex: "tailbar",
                        },
                      ])
                      .addDataSource(talbainiiGaralt?.jagsaalt)
                      .saveAs("түрээсийн талбай.xlsx")
                  }}
                >
                  <DownloadOutlined style={{ fontSize: "18px" }} />
                  <label>Татах</label>
                </a>
              </div>
            )}
            placement="bottom"
            trigger="click"
          >
            <Button
              type="primary"
              style={{ marginTop: "10px" }}
              icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
            >
              <span>Excel</span>
              <DownOutlined width={5} />
            </Button>
          </Popover>
        </div>
        <CardList
          keyValue="talbai"
          className="block overflow-auto md:hidden"
          jagsaalt={talbainiiGaralt?.jagsaalt}
          Component={TalbaiTile}
          pagination={{
            current: talbainiiGaralt?.khuudasniiDugaar,
            pageSize: talbainiiGaralt?.khuudasniiKhemjee,
            total: talbainiiGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />

        <Table
          className={"mt-6 hidden md:block"}
          data-aos="fade-up-left"
          data-aos-duration="1000"
          data-aos-delay="200"
          bordered
          size="small"
          loading={!talbainiiGaralt}
          tableLayout={"fixed"}
          rowKey={(row) => row._id}
          scroll={{ y: "calc(100vh - 25rem)" }}
          dataSource={talbainiiGaralt?.jagsaalt}
          onChange={onChangeTable}
          pagination={{
            current: talbainiiGaralt?.khuudasniiDugaar,
            pageSize: talbainiiGaralt?.khuudasniiKhemjee,
            total: talbainiiGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setTalbaiKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
          columns={[
            {
              title: "№",
              key: "index",
              align: "center",
              className: "text-center",
              render: (text, record, index) =>
                (talbainiiGaralt?.khuudasniiDugaar || 0) *
                  (talbainiiGaralt?.khuudasniiKhemjee || 0) -
                (talbainiiGaralt?.khuudasniiKhemjee || 0) +
                index +
                1,
              width: "1rem",
            },
            {
              title: "Дугаар",
              dataIndex: "kod",
              ellipsis: true,
              width: "1.5rem",
              align: "center",
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              title: "Давхар",
              dataIndex: "davkhar",
              ellipsis: true,
              width: "1.2rem",
              align: "center",
              showSorterTooltip: false,
              sorter: () => 0,
              defaultSortOrder: "descend",
            },
            {
              title: "Талбай/м2/",
              dataIndex: "talbainKhemjee",
              align: "center",
              ellipsis: true,
              width: "2.1rem",
              showSorterTooltip: false,
              defaultSortOrder: "descend",
              sorter: () => 0,
            },
            {
              title: "Нийт үнэ/₮/",
              dataIndex: "talbainNiitUne",
              ellipsis: true,
              align: "center",
              render: (talbainNiitUne) => {
                return formatNumber(talbainNiitUne || 0)
              },
              showSorterTooltip: false,
              defaultSortOrder: "descend",
              sorter: () => 0,
              width: "2.5rem",
            },
            {
              title: "Зардал",
              dataIndex: "niitAshiglaltiinZardal",
              align: "center",
              render: (data) => {
                return formatNumber(data) + "₮"
              },
              showSorterTooltip: false,
              defaultSortOrder: "descend",
              sorter: () => 0,
              width: "2rem",
            },
            {
              title: "Төлбөр",
              dataIndex: "tureesiinTulbur",
              align: "center",
              render: (data) => {
                return formatNumber(data) + "₮"
              },
              showSorterTooltip: false,
              defaultSortOrder: "descend",
              sorter: () => 0,
              width: "2.5rem",
            },
            {
              title: "Тайлбар",
              dataIndex: "tailbar",
              ellipsis: true,
              width: "4.5rem",
            },
            {
              title: "Төлөв",
              dataIndex: "idevkhiteiEsekh",
              ellipsis: true,
              width: "2rem",
              align: "center",
              showSorterTooltip: false,
              sorter: () => 0,
              render(idevkhiteiEsekh) {
                return (
                  <Tag color={idevkhiteiEsekh === true ? "green" : "red"}>
                    {idevkhiteiEsekh === true ? "Идэвхтэй" : "Идэвхгүй"}
                  </Tag>
                )
              },
            },
            {
              title: "Хөрөнгө",
              align: "center",
              ellipsis: true,
              width: "1.5rem",
              render: (data) => {
                return (
                  data?.khurunguud !== undefined && (
                    <div className="flex flex-row justify-center">
                      <Popover
                        content={
                          <Table
                            pagination={false}
                            size="small"
                            dataSource={data?.khurunguud}
                            columns={[
                              {
                                title: "Нэр",
                                dataIndex: "ner",
                              },
                              {
                                title: "Тоо",
                                dataIndex: "too",
                                align: "center",
                              },
                              {
                                title: "Үнэ",
                                dataIndex: "une",
                                align: "center",
                                render: (data) => {
                                  return formatNumber(data) + "₮"
                                },
                              },
                              {
                                title: "Нийт",
                                dataIndex: "niit",
                                align: "center",
                                render: (data) => {
                                  return formatNumber(data) + "₮"
                                },
                              },
                            ]}
                          ></Table>
                        }
                        trigger="click"
                      >
                        <a className="flex items-center justify-center hover:bg-gray-200">
                          <Badge count={data?.khurunguud?.length}>
                            <EyeOutlined
                              style={{ color: "#1890ff", fontSize: "18px" }}
                            />
                          </Badge>
                        </a>
                      </Popover>
                    </div>
                  )
                )
              },
            },
            {
              title: "Түүх",
              width: "1rem",
              align: "center",
              render: (data) => {
                return (
                  <div className="flex flex-row justify-center">
                    <Popover
                      content={
                        <Table
                          style={{
                            display: "flex",
                            width: "900px",
                          }}
                          pagination={false}
                          size="small"
                          dataSource={gereeniiMedeelel?.jagsaalt}
                          columns={[
                            {
                              title: "Гэрээ №",
                              dataIndex: "gereeniiDugaar",
                            },
                            {
                              title: "Овог",
                              dataIndex: "ovog",
                            },
                            {
                              title: "Нэр",
                              dataIndex: "ner",
                            },
                            {
                              title: "Регистр",
                              dataIndex: "register",
                            },
                            {
                              title: "Төрөл",
                              dataIndex: "turul",
                            },
                            {
                              title: "Гэрээний огноо",
                              dataIndex: "gereeniiOgnoo",
                              render: (data) => {
                                return moment(data).format("YYYY-MM-DD")
                              },
                            },
                            {
                              title: "Дуусах огноо",
                              dataIndex: "duusakhOgnoo",
                              render: (data) => {
                                return moment(data).format("YYYY-MM-DD")
                              },
                            },
                            {
                              title: "Хугацаа",
                              dataIndex: "khugatsaa",
                            },
                            {
                              title: "Сарын түрээс",
                              dataIndex: "sariinTurees",
                              align: "center",
                              render: (data) => {
                                return formatNumber(data) + "₮"
                              },
                            },
                          ]}
                        ></Table>
                      }
                      trigger="click"
                    >
                      <a className="flex items-center justify-center hover:bg-gray-200">
                        <EyeOutlined
                          style={{ fontSize: "18px" }}
                          onClick={() =>
                            setShuult((a) => ({
                              ...a,
                              query: { talbainDugaar: data.kod },
                            }))
                          }
                        />
                      </a>
                    </Popover>
                  </div>
                )
              },
            },
            {
              title: () => <SettingOutlined />,
              ellipsis: true,
              width: "1rem",
              align: "center",
              render: (data) => (
                <div className="flex flex-row justify-center">
                  <Popover
                    placement="bottom"
                    trigger="click"
                    content={() => (
                      <div className="flex w-24 flex-col space-y-2">
                        <a
                          className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100"
                          onClick={() => zasya(data)}
                        >
                          <EditOutlined style={{ fontSize: "18px" }} />
                          <label>Засах</label>
                        </a>
                        <Popconfirm
                          title="Талбай устгах уу?"
                          okText="Тийм"
                          cancelText="Үгүй"
                          onConfirm={() => talbaiUstgay(data)}
                        >
                          <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100">
                            <DeleteOutlined
                              style={{ fontSize: "18px", color: "red" }}
                            />
                            <label>Устгах</label>
                          </a>
                        </Popconfirm>
                      </div>
                    )}
                  >
                    <a className=" flex items-center justify-center hover:bg-gray-200">
                      <MoreOutlined style={{ fontSize: "18px" }} />
                    </a>
                  </Popover>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default talbaiBurtgekh
