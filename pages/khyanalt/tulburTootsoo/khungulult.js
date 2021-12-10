import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React, { useEffect, useRef, useState } from "react"
import {
  Card,
  DatePicker,
  Table,
  Button,
  Select,
  InputNumber,
  Input,
  Space,
  message,
  Form,
  Tabs,
} from "antd"
import moment from "moment"
import formatNumber from "tools/function/formatNumber"
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt"
import createMethod from "tools/function/crud/createMethod"
import { aldaaBarigch } from "services/uilchilgee"

import _ from "lodash"
import { useAuth } from "services/auth"

const turul = [
  { zurag: "/ikhNayad.png", ner: "Барааны нэхэмжлэх" },
  { zurag: "/ikhNayadKhuns.png", ner: "Хүнсны нэхэмжлэх" },
]

function tulburTootsoo() {
  const { token, baiguullaga, barilgiinId } = useAuth()
  const [shuult, setShuult] = React.useState({
    query: {tuluv:{$nin:-1}},
  })
  const [form] = Form.useForm()
  const [davkhar, setDavkhar] = React.useState()
  const { gereeniiMedeelel, gereeniiMedeelelMutate, setGereeniiKhuudaslalt } =
    useGereeniiJagsaalt(token, baiguullaga?._id, undefined, shuult?.query)

  const [sar, setSar] = React.useState(moment().add(1, "month"))
  const [khungulultState, setKhungulultState] = useState()
  const formRef = useRef()
  const [songogdsonGereenuud, setSongogdsonGereenuud] = useState([])
  const [tootsoolol, setTootsoolol] = useState({
    niitTalbai: 0,
    niitSariinTurees: 0,
    khunglugdsunDun: 0,
    niitTulukhDun: 0,
  })
  const { Option } = Select
  useEffect(() => {
    setGereeniiKhuudaslalt({ khuudasniiKhemjee: 1000 })
  }, [])
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
    setDavkhar(value)
    if (value.length > 0) {
      setShuult({
        query: { davkhar: value,tuluv:{$nin:-1} },
      })
    } else {
      setShuult()
    }
  }
  function khungulultKhadgalya() {
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
      message.warning("Хөнгөлөх табай сонгоно уу")
    }
  }
  function tseverlekh() {
    formRef.current.resetFields()
    setShuult()
  }

  return (
    <Admin
      title="Хөнгөлөлт"
      khuudasniiNer="khungulult"
      className="p-0 md:p-4"
      onSearch={(search) => {
        setNekhemjlelKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }}
    >
      <Card className="col-span-3 ring-1 ring-green-400">
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
              disabledDate={disabledDate}
              picker="month"
              placeholder="сар"
            />
          </Form.Item>
          <Form.Item name="turul" label="Нөхцөл">
            <Select placeholder="нөхцөл">
              <Option value="Давхараар">Давхараар</Option>
              <Option value="Бүгд">Бүгд</Option>
            </Select>
          </Form.Item>
          <Form.Item name="davkhar" label="Давхар">
            <Select
              mode="multiple"
              placeholder="Давхар"
              onChange={handleChange}
            >
              {["B1", "1", "2", "3", "4", "5", "6"].map((a) => (
                <Select.Option key={a} value={a}>
                  {a}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Хөнгөлөх хувь" name="khungulukhKhuvi">
            <Input placeholder="хөнгөлөх хувь" />
          </Form.Item>
          <Form.Item label="Шалтгаан" name="shaltgaan">
            <Input.TextArea placeholder="шалтгаан" />
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
      </Card>
      <Card className="col-span-9">
        <Table
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              setSongogdsonGereenuud(selectedRows)
            },
          }}
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
                Number(a.talbainKhemjee || 0) - Number(b.talbainKhemjee || 0),
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
                Number(a.sariinTurees || 0) - Number(b.sariinTurees || 0),
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
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default tulburTootsoo
