import {
  Button,
  Input,
  message,
  Select,
  Table,
  Space,
  Form,
  Popconfirm,
  Card,
  InputNumber,
} from "antd"
import {
  UserOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  HistoryOutlined,
  FileSyncOutlined,
  WarningOutlined,
  FileExcelOutlined,
} from "@ant-design/icons"
import shalgaltKhiikh from "../../../services/shalgaltKhiikh"

import Admin from "../../../components/Admin"
import uilchilgee, { aldaaBarigch, url } from "../../../services/uilchilgee"
import { useAuth } from "../../../services/auth"
import React, { useState, useRef, useMemo } from "react"
import moment from "moment"
import { useLanguu } from "hooks/useLanguu"
import getBase64 from "tools/function/getBase64"
import deleteMethod from "tools/function/crud/deleteMethod"
import createMethod from "tools/function/crud/createMethod"
import updateMethod from "tools/function/crud/updateMethod"
import formatNumber from "tools/function/formatNumber"

const iconColor = { fontSize: "18px" }

function LanguuBurtgekh({ token }) {
  const formRef = useRef()
  const zurag = useRef()
  const empty = useRef()

  const { ajiltan, baiguullaga } = useAuth()
  const { languuniiGaralt, setLanguuKhuudaslalt, languuniiJagsaaltMutate } =
    useLanguu(token, baiguullaga?._id)

  const [languuState, setLanguuState] = useState({
    kod: undefined,
    talbainKhemjee: undefined,
    tailbar: undefined,
    talbainNegjUne: undefined,
    talbainNiitUne: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
  })

  const { Option } = Select
  const khyanaltiinDun = useMemo(() => {
    return [
      {
        too: 150,
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
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
      },
      {
        too: 20,
        icon: (
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        ),
        khuvi: 100,
        utga: "VIP",
      },
      {
        too: 100,
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {" "}
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{" "}
            <circle cx="8.5" cy="7" r="4" />{" "}
            <polyline points="17 11 19 13 23 9" />
          </svg>
        ),
        khuvi: -30,
        utga: "Идэвхтэй",
      },
      {
        too: 5,
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
      },

      {
        too: 15,
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
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
        utga: "Анхаарах",
      },
      {
        too: 20,
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6-6a6 6 0 0 1 -8 -8l3.5 3.5" />
          </svg>
        ),
        khuvi: 100,
        utga: "Засвартай",
      },
    ]
  }, [])

  function onChange(talbar, utga) {
    if (talbar === "talbainNegjUne") {
      languuState.talbainNiitUne = utga * languuState.talbainKhemjee
      formRef.current.setFieldsValue({
        talbainNiitUne: languuState.talbainNiitUne,
      })
    }
    setLanguuState((a) => ({ ...a, [talbar]: utga }))
  }
  function languuBurtgekh() {
    languuState.baiguullagiinId = ajiltan?.baiguullagiinId

    if (languuState.zasakhEsekh === true) {
      updateMethod("languu", token, languuState)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Бүртгэл амжилттай засагдлаа")
            formRef.current.resetFields()
            languuniiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            )
          }
        })
        .catch(aldaaBarigch)
    } else
      createMethod("languu", token, languuState)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Бүртгэл амжилттай хийгдлээ")
            formRef.current.resetFields()
            languuniiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            )
          }
        })
        .catch(aldaaBarigch)
  }

  function zasya(data) {
    data.zasakhEsekh = true
    if (!!data.zurgiinNer) {
      zurag.current.src = `${url}/ajiltniiZuragAvya/${data.baiguullagiinId}/${data.zurgiinNer}`
      zurag.current.classList.remove("hidden")
      empty.current.classList.add("hidden")
    }
    formRef.current.setFieldsValue({ ...data })
    setLanguuState(data)
  }

  function languuUstgay(mur) {
    deleteMethod("languu", token, mur._id).then(({ data }) => {
      if (data === "Amjilttai") {
        languuniiJagsaaltMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true)
        message.success("Устгагдлаа")
      }
    })
  }

  function onFinish() {
    languuBurtgekh()
  }
  return (
    <Admin
      title="Лангуу бүртгэл"
      khuudasniiNer="languuBurtgekh"
      className="p-0 md:p-4"
    >
      <Card size="small" className="col-span-12 p-5 cardgrid">
        <div className="w-full border-solid grid grid-cols-12 gap-6">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className="border-2 h-20 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-2 intro-y cursor-pointer zoom-in"
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
      </Card>
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
            name="kod"
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
              placeholder="дугаар"
              value={languuState.kod}
              onChange={(e) => onChange("kod", e.target.value)}
            ></Input>
          </Form.Item>
          <Form.Item
            name="talbainKhemjee"
            rules={[
              {
                required: true,
                message: "Талбайн хэмжээ бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              type="text"
              allowClear
              placeholder="талбайн хэмжээ/м2/"
              value={languuState.talbainKhemjee}
              onChange={(e) => onChange("talbainKhemjee", e.target.value)}
            ></Input>
          </Form.Item>
          <Form.Item
            name="talbainNegjUne"
            rules={[
              {
                required: true,
                message: "Нэгж үнэ бүртгэнэ үү!",
              },
            ]}
          >
            <InputNumber
              style={{ width: "50%" }}
              placeholder="нэгж үнэ"
              value={languuState.talbainNegjUne}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(target) => onChange("talbainNegjUne", target)}
            />
          </Form.Item>
          <Form.Item
            name="talbainNiitUne"
            rules={[
              {
                required: true,
                message: "Нийт үнэ бүртгэнэ үү!",
              },
            ]}
          >
            <InputNumber
              readOnly={true}
              style={{ width: "50%" }}
              placeholder="нийт үнэ"
              value={languuState.talbainNiitUne}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(target) => onChange("talbainNiitUne", target)}
            />
          </Form.Item>

          <Form.Item name="tailbar">
            <Input
              allowClear
              placeholder="тайлбар"
              value={languuState.tailbar}
              onChange={(e) => onChange("tailbar", e.target.value)}
            ></Input>
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
      <div className="col-span-12 md:col-span-6 xl:col-span-9 box p-5 overflow-auto">
        <Table
          bordered
          tableLayout={languuniiGaralt?.jagsaalt?.length > 0 ? "auto" : "fixed"}
          rowKey={(row) => row._id}
          dataSource={languuniiGaralt?.jagsaalt}
          pagination={{
            current: languuniiGaralt?.khuudasniiDugaar,
            pageSize: languuniiGaralt?.khuudasniiKhemjee,
            total: languuniiGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setLanguuKhuudaslalt((kh) => ({
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
                (languuniiGaralt?.khuudasniiDugaar || 0) *
                  (languuniiGaralt?.khuudasniiKhemjee || 0) -
                (languuniiGaralt?.khuudasniiKhemjee || 0) +
                index +
                1,
            },
            { title: "Дугаар", dataIndex: "kod", ellipsis: true },
            {
              title: "Талбай/м2/",
              dataIndex: "talbainKhemjee",
              align: "center",
              ellipsis: true,
            },
            {
              title: "Нэгж үнэ/₮/",
              dataIndex: "talbainNegjUne",
              ellipsis: true,
              align: "center",
              render: (talbainNegjUne) => {
                return formatNumber(talbainNegjUne || 0)
              },
            },
            {
              title: "Нийт үнэ/₮/",
              dataIndex: "talbainNiitUne",
              ellipsis: true,
              align: "center",
              render: (talbainNiitUne) => {
                return formatNumber(talbainNiitUne || 0)
              },
            },
            { title: "Тайлбар", dataIndex: "tailbar", ellipsis: true },
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
                      title="Повьлон устгах уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => languuUstgay(data)}
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

export default LanguuBurtgekh
