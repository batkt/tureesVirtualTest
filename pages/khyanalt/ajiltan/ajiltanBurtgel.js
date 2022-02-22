import {
  Button,
  Input,
  message,
  Select,
  Table,
  DatePicker,
  Divider,
  Form,
  Popconfirm,
  Popover,
} from "antd"
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  SolutionOutlined,
  MailOutlined,
  SecurityScanOutlined,
  MoreOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import shalgaltKhiikh from "services/shalgaltKhiikh"

import Admin from "components/Admin"
import { aldaaBarigch, url } from "services/uilchilgee"
import { useAuth } from "services/auth"
import React, { useState, useRef } from "react"
import moment from "moment"
import { useAjiltniiJagsaalt } from "hooks/useAjiltan"
import deleteMethod from "tools/function/crud/deleteMethod"
import createMethod from "tools/function/crud/createMethod"
import updateMethod from "tools/function/crud/updateMethod"
import { useRouter } from "next/router"
import CardList from "components/cardList"
import AjiltanTile from "components/pageComponents/ajiltan/AjiltanTile"

const iconColor = { fontSize: "18px" }

function AjiltanBurtgel({ token }) {
  const formRef = useRef()
  const zurag = useRef()
  const empty = useRef()

  const router = useRouter()
  const { ajiltan, barilgiinId } = useAuth()
  const { ajilchdiinGaralt, setAjiltniiKhuudaslalt, ajiltniiJagsaaltMutate } =
    useAjiltniiJagsaalt(token, ajiltan?.baiguullagiinId)

  const [ajiltanState, setAjiltanState] = useState({
    ner: undefined,
    ovog: undefined,
    register: undefined,
    khayag: undefined,
    utas: undefined,
    albanTushaal: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
  })

  const { Option } = Select

  function onChange(talbar, utga) {
    setAjiltanState((a) => ({ ...a, [talbar]: utga }))
  }
  function ajiltanBurtgekh() {
    if (ajiltanState.nuutsUg && ajiltanState.nuutsUg.length < 2) {
      message.warning("Нууц үг буруу оруулсан байна.")
      return
    }

    var form_data = new FormData()
    ajiltanState.baiguullagiinId = ajiltan?.baiguullagiinId
    ajiltanState.barilguud = [barilgiinId]

    switch (ajiltanState.albanTushaal) {
      case "Админ":
        ajiltanState.erkh = "Admin"
        break
      case "Зохион байгуулагч":
        ajiltanState.erkh = "ZokhionBaiguulagch"
        break
      case "Санхүү":
        ajiltanState.erkh = "Sankhuu"
        break
      default:
        break
    }
    for (var key in ajiltanState) {
      form_data.append(key, ajiltanState[key])
    }
    if (ajiltanState.zasakhEsekh === true) {
      updateMethod("ajiltan", token, ajiltanState)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Бүртгэл амжилттай хийгдлээ")
            formRef.current.resetFields()
            ajiltniiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            )
          }
        })
        .catch(aldaaBarigch)
    } else {
      createMethod("ajiltan", token, ajiltanState)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Бүртгэл амжилттай хийгдлээ")
            formRef.current.resetFields()
            ajiltniiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            )
          }
        })
        .catch(aldaaBarigch)
    }
  }

  function zasya(data) {
    data.zasakhEsekh = true
    if (!!data.zurgiinNer) {
      zurag.current.src = `${url}/ajiltniiZuragAvya/${data.baiguullagiinId}/${data.zurgiinNer}`
      zurag.current.classList.remove("hidden")
      empty.current.classList.add("hidden")
    }
    data.ajildOrsonOgnoo = moment(data.ajildOrsonOgnoo)
    formRef.current.setFieldsValue({ ...data })
    setAjiltanState(data)
  }

  function ajiltanUstgay(mur) {
    if (ajiltan._id === mur._id) {
      message.warning("Та өөрийгөө устгаж болохгүй!")
      return
    }
    deleteMethod("ajiltan", token, mur._id).then(({ data }) => {
      if (data !== undefined || data !== null) {
        ajiltniiJagsaaltMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true)
        message.success("Устгагдлаа")
      }
    })
  }

  function onFinish() {
    ajiltanBurtgekh()
  }

  function tokhiruulya(data) {
    router.push(`/khyanalt/ajiltan/tokhirgoo/${data?._id}`)
  }

  return (
    <Admin
      title="Ажилтан бүртгэл"
      khuudasniiNer="ajiltanBurtgel"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setAjiltniiKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
    >
      <div className="box col-span-12 p-5 md:col-span-6 xl:col-span-3">
        <Form
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="ovog"
            rules={[
              {
                required: true,
                message: "Овог бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              type="text"
              allowClear
              placeholder="овог"
              value={ajiltanState.ovog}
              prefix={<UserOutlined style={iconColor} />}
              onChange={(e) => onChange("ovog", e.target.value)}
            ></Input>
          </Form.Item>
          <Form.Item
            name="ner"
            rules={[
              {
                required: true,
                message: "Нэр бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              type="text"
              allowClear
              placeholder="нэр"
              value={ajiltanState.ner}
              prefix={<UserOutlined style={iconColor} />}
              onChange={(e) => onChange("ner", e.target.value)}
            ></Input>
          </Form.Item>
          <Form.Item
            name="register"
            rules={[
              {
                required: true,
                len: 10,
                pattern: new RegExp("([А-Я|Ө|Ү]{2})(\\d{8})"),
                message: "Регистр бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              allowClear
              maxLength={10}
              placeholder="регистр"
              value={ajiltanState.register}
              onChange={(e) => onChange("register", e.target.value)}
              prefix={<SolutionOutlined style={iconColor} />}
            ></Input>
          </Form.Item>
          <Form.Item
            name="khayag"
            rules={[
              {
                required: true,
                message: "Хаяг бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              allowClear
              placeholder="хаяг"
              value={ajiltanState.khayag}
              onChange={(e) => onChange("khayag", e.target.value)}
              prefix={<HomeOutlined style={iconColor} />}
            ></Input>
          </Form.Item>
          <Form.Item
            name="utas"
            rules={[
              {
                required: true,
                message: "Утас бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              allowClear
              placeholder="утас"
              value={ajiltanState.utas}
              onChange={(e) => onChange("utas", e.target.value)}
              prefix={<PhoneOutlined style={iconColor} />}
            ></Input>
          </Form.Item>
          <Form.Item
            name="ajildOrsonOgnoo"
            rules={[
              {
                required: true,
                message: "Ажилд орсон огноо бүртгэнэ үү!",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="ажилд орсон огноо"
              onChange={({}, v) => onChange("ajildOrsonOgnoo", v)}
            ></DatePicker>
          </Form.Item>
          <Form.Item
            name="albanTushaal"
            rules={[
              {
                required: true,
                message: "Албан тушаал бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              allowClear
              placeholder="Албан тушаал"
              value={ajiltanState.albanTushaal}
              onChange={(e) => onChange("albanTushaal", e.target.value)}
              prefix={<PhoneOutlined style={iconColor} />}
            ></Input>
          </Form.Item>

          <Divider orientation="left">Нэвтрэх нэр нууц үг</Divider>
          <Form.Item
            name="nevtrekhNer"
            rules={[
              {
                required: true,
                message: "Нэвтрэх нэр бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              placeholder="Нэвтрэх нэр"
              value={ajiltanState.nevtrekhNer}
              onChange={(e) => onChange("nevtrekhNer", e.target.value)}
              prefix={<MailOutlined style={iconColor} />}
            />
          </Form.Item>
          <Form.Item
            name="nuutsUg"
            rules={[
              {
                required: true,
                message: "Нууц үг бүртгэнэ үү!",
              },
            ]}
          >
            <Input.Password
              placeholder="Нууц үг"
              value={ajiltanState.nuutsUg}
              onChange={(e) => onChange("nuutsUg", e.target.value)}
              prefix={<SecurityScanOutlined style={iconColor} />}
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              //onClick={ajiltanBurtgekh}
              style={{ backgroundColor: "#209669", color: "#ffffff" }}
            >
              хадгалах
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="box col-span-12 overflow-auto p-5 md:col-span-6 xl:col-span-9">
        <div className="hidden overflow-auto md:block">
          <Table
            bordered
            tableLayout={
              ajilchdiinGaralt?.jagsaalt?.length > 0 ? "auto" : "fixed"
            }
            rowKey={(row) => row._id}
            dataSource={ajilchdiinGaralt?.jagsaalt}
            pagination={{
              current: ajilchdiinGaralt?.khuudasniiDugaar,
              pageSize: ajilchdiinGaralt?.khuudasniiKhemjee,
              total: ajilchdiinGaralt?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setAjiltniiKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            size="small"
            columns={[
              {
                title: "№",
                key: "index",
                className: "text-center",
                render: (text, record, index) =>
                  (ajilchdiinGaralt?.khuudasniiDugaar || 0) *
                    (ajilchdiinGaralt?.khuudasniiKhemjee || 0) -
                  (ajilchdiinGaralt?.khuudasniiKhemjee || 0) +
                  index +
                  1,
              },
              { title: "Нэр", dataIndex: "ner", ellipsis: true },
              { title: "Регистр", dataIndex: "register", ellipsis: true },
              { title: "Хаяг", dataIndex: "khayag", ellipsis: true },
              { title: "Утас", dataIndex: "utas", ellipsis: true },
              {
                title: "Ажилд орсон огноо",
                dataIndex: "ajildOrsonOgnoo",
                ellipsis: true,
                render: (data) => (
                  <span>
                    {data?.ajildOrsonOgnoo !== null
                      ? moment(data?.ajildOrsonOgnoo).format("YYYY-MM-DD")
                      : ""}
                  </span>
                ),
              },
              {
                title: () => <SettingOutlined />,
                align: "center",
                width: "1rem",
                ellipsis: true,
                render: (data) =>
                  ajiltan?.erkh === "Admin" && (
                    <div className="flex flex-row">
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
                            <a
                              className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100"
                              onClick={() => tokhiruulya(data)}
                            >
                              <SettingOutlined style={{ fontSize: "18px" }} />
                              <label>Эрх</label>
                            </a>
                            <Popconfirm
                              title="Ажилтан устгах уу?"
                              okText="Тийм"
                              cancelText="Үгүй"
                              onConfirm={() => ajiltanUstgay(data)}
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
        </div>
        <CardList
          keyValue="ajiltan"
          className="block overflow-auto md:hidden"
          jagsaalt={ajilchdiinGaralt?.jagsaalt}
          Component={AjiltanTile}
          pagination={{
            current: ajilchdiinGaralt?.khuudasniiDugaar,
            pageSize: ajilchdiinGaralt?.khuudasniiKhemjee,
            total: ajilchdiinGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default AjiltanBurtgel
