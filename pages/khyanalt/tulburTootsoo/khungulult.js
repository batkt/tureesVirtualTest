import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React, { useRef } from "react"
import {
  Card,
  DatePicker,
  Table,
  Button,
  Select,
  message,
  InputNumber,
  Input,
  Space,
  Form,
} from "antd"
import {
  CheckOutlined,
  ExclamationOutlined,
  QuestionOutlined,
} from "@ant-design/icons"
import moment from "moment"
import formatNumber from "tools/function/formatNumber"
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt"

import _ from "lodash"
import { useAuth } from "services/auth"

const turul = [
  { zurag: "/ikhNayad.png", ner: "Барааны нэхэмжлэх" },
  { zurag: "/ikhNayadKhuns.png", ner: "Хүнсны нэхэмжлэх" },
]

function tulburTootsoo() {
  const { token, baiguullaga } = useAuth()
  const [shuult, setShuult] = React.useState({
    query: {},
  })
  const [davkhar, setDavkhar] = React.useState()
  const { gereeniiMedeelel, gereeniiMedeelelMutate, setGereeniiKhuudaslalt } =
    useGereeniiJagsaalt(token, baiguullaga?._id, undefined, shuult?.query)

  const [sar, setSar] = React.useState(moment().add(1, "month"))
  const formRef = useRef()
  const { Option } = Select

  function disabledDate(current) {
    return current && current < moment().endOf("day")
  }
  function handleChange(value) {
    setDavkhar(value)
    setShuult({
      query: { davkhar: value },
    })
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
      <Card className="col-span-3">
        <Form
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
            name="khungulukhSar"
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
          <Form.Item name="nukhtsul" label="Нөхцөл">
            <Select placeholder="нөхцөл">
              <Option value="Давхар">Давхараар</Option>
              <Option value="Бүгд">Бүх</Option>
            </Select>
          </Form.Item>
          <Form.Item name="davkhar" label="Давхар">
            <Select
              mode="multiple"
              placeholder="Давхар"
              onChange={handleChange}
            >
              {["B1", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((a) => (
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
              Нийт талбайн тоо :<a>15</a>
            </div>
            <div className="flex justify-between">
              Нийт түрээсийн орлого :<a>15,000,000₮</a>
            </div>
            <div className="flex justify-between">
              Нийт хөнгөлөгдсөн дүн :<a className="text-red-400">-1,500,000₮</a>
            </div>
            <div className="flex justify-between">
              Нийт төлөх дүн :<a className="text-green-500">13,500,000₮</a>
            </div>
          </div>
          <div className="flex flex-row justify-between mt-10">
            <Form.Item>
              <Button
                htmlType="submit"
                //onClick={ajiltanBurtgekh}
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
                //onClick={ajiltanBurtgekh}
                //style={{ backgroundColor: "#209669", color: "#ffffff" }}
              >
                цэвэрлэх
              </Button>
            </Form.Item>
          </div>
        </Form>
        {/* <Space>
            <label>Хөнгөлөх сар:</label>
            <DatePicker
              disabledDate={disabledDate}
              picker="month"
              placeholder="сар"
              onChange={setSar}
            />
          </Space>
          <Space>
            <label>Хөнгөлөх хувь:</label>
            <InputNumber
              placeholder="Хөнгөлөх хувь"
              title="Хөнгөлөх хувь"
              min={0}
              max={100}
            />
          </Space>
          <Space>
            <label>Тайлбар:</label>
            <Input style={{ width: "350px" }} placeholder="Тайлбар" />
          </Space>
          <Space>
            <label>Давхар:</label>
            <Select
              style={{ width: "200px" }}
              mode="multiple"
              placeholder="Давхар"
              onChange={handleChange}
            >
              {["B1", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((a) => (
                <Select.Option key={a} value={a}>
                  {a}
                </Select.Option>
              ))}
            </Select>
          </Space>
          <Space>
            <Button type="primary">Хөнгөлөх</Button>
          </Space> */}
      </Card>
      <Card className="col-span-9">
        <Table
          rowSelection={{
            type: "checkbox",
          }}
          bordered
          scroll={{ y: "calc(100vh - 20rem)" }}
          size="small"
          loading={!gereeniiMedeelel}
          rowKey={(row) => row._id}
          columns={[
            {
              title: "Бүртгэсэн",
              dataIndex: "createdAt",
              ellipsis: true,
              className: "text-center",
              align: "center",
              render(date) {
                return moment(date).format("YYYY-MM-DD HH:mm")
              },
            },
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
              title: "Төрөл",
              dataIndex: "turul",
              align: "center",
              className: "text-center",
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
              title: "Эхлэх",
              dataIndex: "gereeniiOgnoo",
              className: "text-center",
              align: "center",
              ellipsis: true,
              render: (data) => {
                return moment(data).format("YYYY-MM-DD")
              },
            },
            {
              title: "Дуусах хоног",
              dataIndex: "duusakhOgnoo",
              className: "text-center",
              align: "center",
              ellipsis: true,
              render: (duusakhOgnoo) => {
                return moment(duusakhOgnoo).diff(moment(new Date()), "days")
              },
            },
            {
              title: "Дуусах",
              dataIndex: "duusakhOgnoo",
              className: "text-center",
              align: "center",
              ellipsis: true,
              render: (data) => {
                return moment(data).format("YYYY-MM-DD")
              },
              showSorterTooltip: false,
              defaultSortOrder: "descend",
              sorter: (a, b) =>
                moment(a.duusakhOgnoo).unix() - moment(b.duusakhOgnoo).unix(),
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
          pagination={{
            current: gereeniiMedeelel?.khuudasniiDugaar,
            pageSize: gereeniiMedeelel?.khuudasniiKhemjee,
            total: gereeniiMedeelel?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setGereeniiKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default tulburTootsoo
