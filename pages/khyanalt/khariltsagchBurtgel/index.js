import {
  Button,
  Input,
  message,
  Select,
  Table,
  Space,
  DatePicker,
  Divider,
  Upload,
  Form,
  Popconfirm,
  Popover,
  Tag,
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
  BellOutlined,
  FileTextOutlined,
} from "@ant-design/icons"
import shalgaltKhiikh from "../../../services/shalgaltKhiikh"

import Admin from "../../../components/Admin"
import uilchilgee, { aldaaBarigch, url } from "../../../services/uilchilgee"
import { useAuth } from "../../../services/auth"
import React, { useState, useRef } from "react"
import moment from "moment"
import { useKhariltsagch } from "hooks/useKhariltsagch"
import getBase64 from "tools/function/getBase64"
import deleteMethod from "tools/function/crud/deleteMethod"
import createMethod from "tools/function/crud/createMethod"
import updateMethod from "tools/function/crud/updateMethod"

const iconColor = { fontSize: "18px" }

function AjiltanBurtgel({ token }) {
  const formRef = useRef()
  const zurag = useRef()
  const empty = useRef()

  const { ajiltan, baiguullaga } = useAuth()
  const { setKhuudaslalt, khariltsagchiinGaralt, khariltsagchMutate } =
    useKhariltsagch(token, baiguullaga?._id)
  const [formNuukh, setFormNuukh] = useState(false)

  const [khariltsagchState, setkhariltsagchState] = useState({
    ner: undefined,
    ovog: undefined,
    register: undefined,
    khayag: undefined,
    utas: undefined,
    email: undefined,
    turul: undefined,
    tuluv: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
  })

  const { Option } = Select

  function onChange(talbar, utga) {
    setkhariltsagchState((a) => ({ ...a, [talbar]: utga }))
  }
  function khariltsagchBurtgekh() {
    var form_data = new FormData()
    khariltsagchState.baiguullagiinId = ajiltan?.baiguullagiinId
    if (khariltsagchState.zasakhEsekh === true) {
      updateMethod("khariltsagch", token, khariltsagchState)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Бүртгэл амжилттай засагдлаа")
            formRef.current.resetFields()
            khariltsagchMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true)
          }
        })
        .catch(aldaaBarigch)
    } else {
      createMethod("khariltsagch", token, khariltsagchState)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Бүртгэл амжилттай хийгдлээ")
            formRef.current.resetFields()
            khariltsagchMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true)
          }
        })
        .catch(aldaaBarigch)
    }
  }

  function zasya(data) {
    data.zasakhEsekh = true
    formRef.current.setFieldsValue({ ...data })
    setkhariltsagchState(data)
  }

  function khariltsagchUstgay(mur) {
    deleteMethod("khariltsagch", token, mur._id).then(({ data }) => {
      if (data !== undefined) {
        khariltsagchMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true)
        message.success("Устгагдлаа")
      }
    })
  }

  const props = {
    listType: "picture",
    showUploadList: false,
    className: "avatar-uploader",
    name: "avatar",
    multiple: false,
    beforeUpload: (file) => {
      getBase64(file, (img) => (zurag.current.src = img))
      zurag.current.classList.remove("hidden")
      empty.current.classList.add("hidden")
      onChange("zurag", file)
      return false
    },
  }

  function onFinish() {
    khariltsagchBurtgekh()
  }
  function checkRegister() {
    var value1 = khariltsagchState.register.substring(0, 2)
    var value2 = khariltsagchState.register.substring(2, 10)
    var error = 0
    for (var i = 0; i < 2; i++) {
      var c = value1.charCodeAt(i)
      if (c) {
        var alp = value1.charAt(i)
        if (
          c !== 32 &&
          c !== 45 &&
          c !== 46 &&
          (c < 65 || (c < 97 && c > 90) || c > 122) &&
          (c < 1024 || c > 1535)
        ) {
          value1 = value1.replace(alp, "")
          error++
        }
      }
    }
    for (i = 0; i < 8; i++) {
      c = value2.charCodeAt(i)
      if (c) {
        alp = value2.charAt(i)
        if (c < 48 || c > 57) {
          value2 = value2.replace(alp, "")
          error++
        }
      }
    }
    if (
      khariltsagchState.register.length <= 2 ||
      khariltsagchState.register.length > 10 ||
      error > 0
    ) {
      khariltsagchState.register = value1.toUpperCase() + value2
    }
    if (khariltsagchState.register.length === 10) {
      var year = parseInt(khariltsagchState.register.substring(2, 4))
      var month = parseInt(khariltsagchState.register.substring(4, 6))
      month = month - 1
      var day = parseInt(khariltsagchState.register.substring(6, 8))
      var nowYear = new Date().getFullYear().toString().substring(2, 4)
      if (month > 32 || (12 < month && month < 21)) {
        message.warning("Регистерийн дугаарын сар буруу байна!")
        khariltsagchState.register = ""
        return
      } else if (year > nowYear && 21 <= month && month <= 32) {
        message.warning("Регистерийн дугаарын жил, сарын хослол буруу байна!")
        khariltsagchState.register = ""
        return
      }

      var jil = month <= 32 && month >= 21 ? 2000 + year : 1900 + year
      var sar = month <= 32 && month >= 21 ? month - 20 : month
      var shineDate = new Date(jil, sar, 1)
      var shine = new Date(shineDate - 1)
      var nowDay = shine.getDate()
      if (nowDay < day) {
        message.warning("Регистерийн дугаарын өдөр буруу байна!")
        return
      }
    }
  }
  function turulSongokh(value) {
    setFormNuukh(value)
  }
  return (
    <Admin
      title="Харилцагч бүртгэл"
      khuudasniiNer="khariltsagchBurtgel"
      className="p-0 md:p-4"
    >
      <div className="col-span-12 md:col-span-6 xl:col-span-3 box p-5">
        {/* <div>
          <Upload {...props}>
            <div ref={empty}>
              <Empty
                className="w-24 h-24 border border-dashed border-blue-500 zurag"
                description=""
              />
            </div>
            <img
              ref={zurag}
              alt="Зураг сонгох"
              className="w-24 h-24 border border-dashed border-blue-500 hidden"
            />
          </Upload>
        </div> */}
        <Form
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="turul"
            rules={[
              {
                required: true,
                message: "Төрөл сонгоно уу!",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              value={khariltsagchState.turul}
              placeholder={"Төрөл сонгох"}
              onChange={turulSongokh}
            >
              <Option value="Иргэн">Иргэн</Option>
              <Option value="ААН">ААН</Option>
            </Select>
          </Form.Item>
          <Form.Item
            hidden={formNuukh === "ААН" ? true : false}
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
              value={khariltsagchState.ovog}
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
              value={khariltsagchState.ner}
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
              value={khariltsagchState.register}
              onChange={(e) => onChange("register", e.target.value)}
              prefix={<SolutionOutlined style={iconColor} />}
              onBlur={() => (formNuukh === "ААН" ? "" : checkRegister())}
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
              value={khariltsagchState.khayag}
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
              value={khariltsagchState.utas}
              onChange={(e) => onChange("utas", e.target.value)}
              prefix={<PhoneOutlined style={iconColor} />}
            ></Input>
          </Form.Item>
          <Form.Item name="mail">
            <Input
              type="email"
              placeholder="и-мэйл хаяг"
              value={khariltsagchState.email}
              onChange={(e) => onChange("mail", e.target.value)}
              prefix={<MailOutlined style={iconColor} />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              //htmlType="submit"
              onClick={khariltsagchBurtgekh}
              style={{ backgroundColor: "#209669", color: "#ffffff" }}
            >
              хадгалах
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-9 box p-5 overflow-auto">
        <div className="flex justify-end mb-5">
          <Button
            style={{
              alignItems: "end",
              backgroundColor: "#209669",
              color: "#ffffff",
            }}
            icon={<BellOutlined style={{ fontSize: "16px" }} />}
          >
            Мэдэгдэл илгээх
          </Button>
        </div>

        <Table
          bordered
          tableLayout={
            khariltsagchiinGaralt?.jagsaalt?.length > 0 ? "auto" : "fixed"
          }
          rowKey={(row) => row._id}
          dataSource={khariltsagchiinGaralt?.jagsaalt}
          pagination={{
            current: khariltsagchiinGaralt?.khuudasniiDugaar,
            pageSize: khariltsagchiinGaralt?.khuudasniiKhemjee,
            total: khariltsagchiinGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhuudaslalt((kh) => ({
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
                (khariltsagchiinGaralt?.khuudasniiDugaar || 0) *
                  (khariltsagchiinGaralt?.khuudasniiKhemjee || 0) -
                (khariltsagchiinGaralt?.khuudasniiKhemjee || 0) +
                index +
                1,
            },
            {
              title: "Төрөл",
              dataIndex: "turul",
              ellipsis: true,
              render: (turul) => {
                return (
                  <Tag color={turul === "Иргэн" ? "blue" : "orange"}>
                    {turul}
                  </Tag>
                )
              },
            },
            { title: "Регистр", dataIndex: "register", ellipsis: true },
            { title: "Нэр", dataIndex: "ner", ellipsis: true },
            { title: "Хаяг", dataIndex: "khayag", ellipsis: true },
            { title: "Утас", dataIndex: "utas", ellipsis: true },
            { title: "И-мэйл хаяг", dataIndex: "mail", ellipsis: true },

            {
              title: "Төлөв",
              dataIndex: "tuluv",
              ellipsis: true,
              render: () => {
                return <Tag color="green">Идэвхтэй</Tag>
              },
            },
            {
              title: "Түүх",
              dataIndex: "turul",
              ellipsis: true,
              render: () => (
                <a className="ant-dropdown-link p-2 rounded-full hover:bg-gray-200 flex items-center justify-center">
                  <FileTextOutlined style={{ fontSize: "18px" }} />
                </a>
              ),
            },
            {
              title: "Бүртгэгдсэн",
              dataIndex: "createdAt",
              ellipsis: true,
              render: (data) => {
                return moment(data).format("YYYY-MM-DD")
              },
            },

            // {
            //   title: "Зураг",
            //   dataIndex: "",
            //   ellipsis: true,
            //   render: (record) => {
            //     if (record.zurgiinNer !== undefined)
            //       var zuragcomp = (
            //         <img
            //           src={
            //             record?.zurgiinNer
            //               ? `${url}/ajiltniiZuragAvya/${record?.baiguullagiinId}/${record?.zurgiinNer}`
            //               : "/profile.svg"
            //           }
            //           style={{ borderRadius: "50%" }}
            //         />
            //       )
            //     return (
            //       zuragcomp && (
            //         <Popover
            //           content={
            //             <div className="h-24 w-24 flex">{zuragcomp}</div>
            //           }
            //         >
            //           <div className="h-8 w-8 inline-flex justify-center rounded-full p-1 shadow-xl bg-gray-200">
            //             {zuragcomp}
            //           </div>
            //         </Popover>
            //       )
            //     )
            //   }
            // },
            {
              title: "Тохиргоо",
              ellipsis: true,
              render: (data) =>
                ajiltan?.erkh === "Admin" && (
                  <Space size="middle">
                    <a
                      className="ant-dropdown-link p-2 rounded-full hover:bg-gray-200 flex items-center justify-center"
                      onClick={() => zasya(data)}
                    >
                      <EditOutlined style={{ fontSize: "18px" }} />
                    </a>
                    <Popconfirm
                      title="Харилцагч устгах уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => khariltsagchUstgay(data)}
                    >
                      <a className="ant-dropdown-link p-2 rounded-full hover:bg-gray-200 flex items-center justify-center">
                        <DeleteOutlined
                          style={{ fontSize: "18px", color: "red" }}
                        />
                      </a>
                    </Popconfirm>
                  </Space>
                ),
            },
          ]}
        />
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default AjiltanBurtgel
