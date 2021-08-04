import moment from "moment"
import { useAuth } from "services/auth"
import { modal } from "components/ant/Modal"
import {
  FileDoneOutlined,
  FileSearchOutlined,
  PlusOutlined,
  StarTwoTone,
  CheckCircleTwoTone,
  OrderedListOutlined,
  EditOutlined
} from "@ant-design/icons"
import {
  Table,
  Select,
  Form,
  Input,
  Button,
  Tabs,
  Card,
  DatePicker,
  message,
  Tag,
  Popover,
  Modal
} from "antd"

import Admin from "components/Admin"
import CardList from "components/cardList"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import uilchilgee from "services/uilchilgee"

import formatNumber from "tools/function/formatNumber"
import { useState, useRef, useMemo } from "react"
import useZakhialga from "hooks/useZakhialga"
import useUridchilsanZakhialgaToololt from "hooks/useUridchilsanZakhialgaToololt"
import useKhuviarlagdaaguiZakhialga from "hooks/useKhuviarlagdaaguiZakhialga"
import { useRouter } from "next/router"
//#region const
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}
const { TabPane } = Tabs
const { RangePicker } = DatePicker

const tuluvStyle = {
  display: "flex",
  fontSize: "0.8rem",
  fontWeight: "bold",
  justifyContent: "space-between"
}
const garalt = {
  khuudasniiDugaar: 1,
  khuudasniiKhemjee: 10
}

//#endregion

function ZakhialgiinKhyanalt({ token }) {
  const { ajiltan, baiguullaga } = useAuth()
  const router = useRouter()
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59")
  ])

  const [queryGaraasUgsun, setQueryGaraasUgsun] = useState({
    tuluv: ["1", "2", "3"],
    ognoo:
      ekhlekhOgnoo !== undefined
        ? {
            $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59")
          }
        : undefined
  })

  const { zakhialgiinGaralt, setKhuudaslalt, zakhialgaMutate } = useZakhialga(
    token,
    baiguullaga?._id,
    undefined,
    queryGaraasUgsun
  )

  const { khuviarlagdaaguiZakhialgiinGaralt, setKhuviarlagdaaguiKhuudaslalt } =
    useKhuviarlagdaaguiZakhialga(token, baiguullaga?._id)

  const [garaltKhuviarlagdaagui, setGaraltKhuviarlagdaagui] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10
  })

  const [ajiltanJagsaalt, setAjiltanJagsaalt] = useState()
  const { Option } = Select

  const { ekhlesen, duussan, khuviarlagdsan, khuviarlagdaagui, tsutslagdsan } =
    useUridchilsanZakhialgaToololt(
      token,
      baiguullaga?._id,
      zakhialgaMutate,
      ekhlekhOgnoo[0],
      ekhlekhOgnoo[1]
    )

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        className: "text-center",
        render: (text, record, index) =>
          (zakhialgiinGaralt?.khuudasniiDugaar || 0) *
            (zakhialgiinGaralt?.khuudasniiKhemjee || 0) -
          (zakhialgiinGaralt?.khuudasniiKhemjee || 0) +
          index +
          1
      },
      {
        title: "Нэр",
        dataIndex: "khariltsagchiinNer",
        key: "khariltsagchiinNer",
        ellipsis: true
      },
      {
        title: "Утас",
        dataIndex: "khariltsagchiinUtas",
        ellipsis: true
      },
      {
        title: "Машин №",
        dataIndex: "mashiniiDugaar",
        ellipsis: true
      },
      {
        title: "Бүртгэсэн огноо",
        dataIndex: "createdAt",
        ellipsis: true,
        render: (createdAt) => {
          return (
            <span className="whitespace-nowrap">
              {moment(createdAt).format("YYYY-MM-DD HH:mm")}
            </span>
          )
        }
      },
      {
        title: "Захиалга",
        dataIndex: "zakhialgiinDugaar",
        ellipsis: true
      },
      {
        title: "Захиалга огноо",
        ellipsis: true,
        render: (data) => {
          return (
            <span className="whitespace-nowrap">
              {moment(data.ognoo).format("YYYY-MM-DD") +
                "-" +
                data.ognooniiTsag}
            </span>
          )
        }
      },
      {
        title: "Үйлчилгээ",
        key: "zakhialguud",
        ellipsis: true,
        render: (data) => {
          const uilchilgee = data?.zakhialguud?.map((x) => (
            <div className="flex text-base justify-between">
              <div>{x.ner}</div>
              <div className="ml-2">{x.tooKhemjee}</div>
            </div>
          ))
          var turul = data?.zakhialguud?.map((x) => x.ner).join(";")
          turul = Array.from(new Set(turul.split(";"))).toString()
          return (
            data?.zakhialguud && (
              <Popover content={uilchilgee}>
                <a>{turul}</a>
              </Popover>
            )
          )
        }
      },

      {
        title: "Дүн",
        dataIndex: "niitDun",
        ellipsis: true,
        render: (niitDun, row) => {
          return (
            <div
              className={`${
                !!row.zakhialguud.find((a) => a.khyamdral === true)
                  ? "text-red-600"
                  : ""
              }`}
            >
              {formatNumber(niitDun)}
            </div>
          )
        }
      },
      {
        title: "Ажилтан",
        dataIndex: "ajiltniiNer",
        ellipsis: true,
        key: "name"
      },
      {
        title: "Төлөв",
        align: "center",
        ellipsis: true,
        render: (data) => {
          if (data.tuluv !== undefined) {
            var tuluv = ""
            var khugatsaa = ""
            let color = "geekblue"
            switch (data.tuluv) {
              case "1":
                tuluv = "ХУВИАРЛАГДСАН"
                color = "orange"
                khugatsaa = moment(data.updatedAt).format("YYYY-MM-DD HH:mm")
                break
              case "2":
                tuluv = "ХИЙГДЭЖ БАЙНА"
                khugatsaa = moment(data.ekhelsenTsag).format("YYYY-MM-DD HH:mm")
                break
              case "3":
                tuluv = "ДУУССАН"
                color = "green"
                khugatsaa = moment(data.duussanTsag).format("YYYY-MM-DD HH:mm")
                break
              case "-1":
                tuluv = "ЦУЦЛАГДСАН"
                color = "red"
                khugatsaa = moment(data.updatedAt).format("YYYY-MM-DD HH:mm")
                break
              default:
                break
            }
            return (
              <div style={tuluvStyle} className="whitespace-nowrap">
                <Tag color={color}>
                  <span>{tuluv}</span>
                </Tag>
                <span>{khugatsaa}</span>
              </div>
            )
          }
        }
      },
      {
        title: "Хугацаа",
        dataIndex: "zartsuulsanKhugatsaa",
        align: "center",
        ellipsis: true,
        render: (zartsuulsanKhugatsaa) => {
          return (
            zartsuulsanKhugatsaa !== undefined && (
              <Button type="primary" shape="round" size="small">
                <span style={{ fontWeight: "bold" }}>
                  {zartsuulsanKhugatsaa}
                </span>
              </Button>
            )
          )
        }
      },
      {
        title: "Тайлбар",
        align: "center",
        ellipsis: true,
        render: (data) => {
          return (
            (data?.temdeglel !== undefined ||
              data?.tutsalsanShaltgaan !== undefined) && (
              <Popover
                content={
                  data.temdeglel !== undefined
                    ? data.temdeglel
                    : data.tutsalsanShaltgaan
                }
                trigger="click"
              >
                <CheckCircleTwoTone style={{ fontSize: "22px" }} />
              </Popover>
            )
          )
        }
      },

      {
        title: "Үнэлгээ",
        align: "center",
        width: "90px",
        ellipsis: true,
        render: (data) => {
          return data?.tuluv === "3" ? (
            <div className="font-bold flex justify-center">
              <StarTwoTone style={{ fontSize: "22px" }} />
              <span className="ml-2">{data?.unelgee || "?"}</span>
            </div>
          ) : (
            ""
          )
        }
      },
      {
        title: "Бүртгэсэн",
        dataIndex: "burtgesenAjiltaniiNer",
        ellipsis: true
      }
    ]
    if (ajiltan?.erkh === "Admin")
      jagsaalt.push({
        title: "Үйлдэл",
        align: "center",
        ellipsis: true,
        render: (data) => {
          return data?.tuluv === "3" ? (
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => zasya(data)}
            ></Button>
          ) : (
            ""
          )
        }
      })
    return jagsaalt
  }, [zakhialgiinGaralt, ajiltan])

  function zasya(data) {
    Modal.confirm({
      content: `Та ${data.zakhialgiinDugaar} дугаартай захиалгыг засахдаа итгэлтэй байна уу. `,
      onOk: () =>
        router.push(
          `/khyanalt/zakhialgiinKhyanalt/zakhialga/zasakh/${data._id}`
        ),
      okText: "Тийм",
      cancelText: "Үгүй"
    })
  }

  function zakhialgaNemya() {
    router.push("/khyanalt/zakhialgiinKhyanalt/zakhialga/null")
  }
  function ajiltanJagsaaltAvya(orolt) {
    const { jagsaalt, ...khuudaslalt } = orolt
    uilchilgee(token)
      .post("/ajilchdiinJagsaaltAvya", {
        ...khuudaslalt,
        query: { baiguullagiinId: ajiltan?.baiguullagiinId }
      })
      .then(({ data, status }) => {
        if (status !== 200 || !!data.aldaa) {
          message.warning(data.aldaa)
          return
        }
        data.jagsaalt.forEach(function (uilchilgee, index, jagsaalt) {
          jagsaalt[index].key = uilchilgee._id
        })
        setAjiltanJagsaalt(data.jagsaalt)
      })
  }

  function khuviarlagdaaguiZakhialgiinJagsaaltAvya(orolt) {
    const { jagsaalt, ...khuudaslalt } = orolt
    uilchilgee(token)
      .post("/khuviarlagdaaguiZakhialgiinJagsaaltAvya", {
        ...khuudaslalt,
        query: {
          baiguullagiinId: ajiltan?.baiguullagiinId,
          tuluv: ["0"]
        }
      })
      .then(({ data, status }) => {
        if (status !== 200 || !!data.aldaa) {
          message.warning(data.aldaa)
          return
        }
        data.jagsaalt.forEach(function (uilchilgee, index, jagsaalt) {
          jagsaalt[index].key = uilchilgee._id
        })
        setGaraltKhuviarlagdaagui(data)
      })
      .finally(() => ajiltanJagsaaltAvya(garalt))
  }

  function ajiltanSongokh(value, data) {
    var a = JSON.parse(value)
    garaltKhuviarlagdaagui.jagsaalt
      .filter((x) => x.id === data.id)
      .forEach((x) => {
        ;(x.ajiltniiNer = a.ner),
          (x.ajiltniiId = a._id),
          (x.tuluv = 1),
          (x.ognoo = x.ognoo
            ? x.ognoo
            : moment(new Date()).format("YYYY-MM-DD"))
      })
  }

  function khuviarlaltKhadglakh(zakhialga) {
    uilchilgee(token)
      .post("/zakhialgaBatlakh", zakhialga)
      .then(({ data }) => {
        if (data === "Amjilttai") message.success("амжилттай")
      })
      .finally(() =>
        khuviarlagdaaguiZakhialgiinJagsaaltAvya(garaltKhuviarlagdaagui)
      )
  }

  function onChangeOgnoo(date, dateString) {
    setEkhlekhOgnoo(dateString)
    ognoogoorShuukh(garalt, dateString)
  }

  function ognoogoorShuukh(orolt, ognoo) {
    debugger
    const { jagsaalt, ...khuudaslalt } = orolt
    queryGaraasUgsun.ognoo = {
      $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
      $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59")
    }
    setQueryGaraasUgsun({
      ...queryGaraasUgsun
    })
  }
  function tulvuurShuukh(tuluv) {
    queryGaraasUgsun.tuluv = tuluv
    setQueryGaraasUgsun({ ...queryGaraasUgsun })
  }
  return (
    <Admin
      khuudasniiNer="gereeBurtgel"
      title="Гэрээний жагсаалт"
      className="p-0 md:p-5"
      onSearch={(search) => setKhuudaslalt((a) => ({ ...a, search }))}
    >
      <Card className="col-span-12 p-5 cardgrid">
        <div className="w-full grid grid-cols-12 gap-4">
          <Card
            hoverable={true}
            onClick={() => tulvuurShuukh(["1", "2", "3"])}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2 focus:bg-blue-500 focus-within:bg-blue-500"
            style={{
              borderRadius: "10px",
              borderColor: "#1F618D",
              borderLeft: "5px solid #1F618D",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#1F618D",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            >
              {Number(ekhlesen + duussan + khuviarlagdsan + khuviarlagdaagui)}
            </span>
            <span className="ml-4 2xl:text-xl">Бүх</span>
          </Card>

          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            onClick={() => tulvuurShuukh("2")}
            style={{
              borderRadius: "10px",
              borderColor: "#1990ff",
              borderLeft: "5px solid #1990ff",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#1990ff",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            >
              {ekhlesen}
            </span>
            <span className="ml-4 2xl:text-xl">Идэвхтэй</span>
          </Card>
          <Card
            hoverable={true}
            onClick={() => tulvuurShuukh("3")}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            style={{
              borderRadius: "10px",
              borderColor: "#52BE80",
              borderLeft: "5px solid #52BE80",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#52BE80",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            >
              {duussan}
            </span>
            <span className="ml-4 2xl:text-xl">Дууссан</span>
          </Card>
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            onClick={() => tulvuurShuukh("1")}
            style={{
              borderRadius: "10px",
              borderColor: "#FF7F50",
              borderLeft: "5px solid #FF7F50",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#FF7F50",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            >
              {khuviarlagdsan}
            </span>
            <span className="ml-4 2xl:text-xl">Сунгасан</span>
          </Card>
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            onClick={() => tulvuurShuukh("-1")}
            style={{
              borderRadius: "10px",
              borderColor: "#1F618D",
              borderLeft: "5px solid #1F618D",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#1F618D",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            >
              {tsutslagdsan}
            </span>
            <span className="ml-4 2xl:text-xl">Цуцласан</span>
          </Card>
        </div>
        <Tabs size="large" style={{ marginTop: "20px" }}>
          <TabPane
            key="1"
            tab={
              <span>
                <FileDoneOutlined style={{ fontSize: "32px" }} />
                Захиалгын жагсаалт
              </span>
            }
          >
            <div>
              <RangePicker
                style={{ marginBottom: "15px" }}
                size="large"
                disabledTime
                defaultValue={[
                  moment(new Date(), "YYYY-MM-DD"),
                  moment(new Date(), "YYYY-MM-DD")
                ]}
                format={"YYYY-MM-DD"}
                onChange={onChangeOgnoo}
              />
            </div>
            <div className="overflow-auto hidden md:block">
              <Table
                bordered
                tableLayout={
                  zakhialgiinGaralt?.jagsaalt?.length > 0 ? "auto" : "fixed"
                }
                scroll={{ y: "calc(100vh - 32rem)" }}
                size="small"
                rowKey={(row) => row._id}
                columns={columns}
                dataSource={zakhialgiinGaralt?.jagsaalt}
                pagination={{
                  current: zakhialgiinGaralt?.khuudasniiDugaar,
                  pageSize: zakhialgiinGaralt?.khuudasniiKhemjee,
                  total: zakhialgiinGaralt?.niitMur,
                  showSizeChanger: true,
                  onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                    setKhuudaslalt((kh) => ({
                      ...kh,
                      khuudasniiDugaar,
                      khuudasniiKhemjee
                    }))
                }}
              />
            </div>

            <CardList
              keyValue="zakkhialga"
              className="overflow-auto block md:hidden"
              jagsaalt={zakhialgiinGaralt?.jagsaalt}
              componentProps={{ router }}
              pagination={{
                current: zakhialgiinGaralt?.khuudasniiDugaar,
                pageSize: zakhialgiinGaralt?.khuudasniiKhemjee,
                total: zakhialgiinGaralt?.niitMur,
                showSizeChanger: true,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  setKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee
                  }))
              }}
            />
          </TabPane>
          <TabPane
            key="2"
            tab={
              <span>
                <FileSearchOutlined style={{ fontSize: "32px" }} />
                Хувиарлагдаагүй захиалга
              </span>
            }
          >
            <RangePicker
              style={{ marginBottom: "20px" }}
              size="large"
              defaultValue={[
                moment(new Date(), "YYYY-MM-DD"),
                moment(new Date(), "YYYY-MM-DD")
              ]}
            />
            <Table
              bordered
              tableLayout={
                khuviarlagdaaguiZakhialgiinGaralt?.jagsaalt?.length > 0
                  ? "auto"
                  : "fixed"
              }
              size="middle"
              dataSource={khuviarlagdaaguiZakhialgiinGaralt?.jagsaalt}
              pagination={{
                current: khuviarlagdaaguiZakhialgiinGaralt?.khuudasniiDugaar,
                pageSize: khuviarlagdaaguiZakhialgiinGaralt?.khuudasniiKhemjee,
                total: khuviarlagdaaguiZakhialgiinGaralt?.niitMur,
                showSizeChanger: true,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  setKhuviarlagdaaguiKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee
                  }))
              }}
              scroll={{ x: "calc(100vh - 15rem)" }}
              rowClassName="editable-row"
              components={{
                body: {
                  cell: EditableCell
                }
              }}
              columns={[
                {
                  title: "№",
                  key: "index",
                  className: "text-center",

                  render: (text, record, index) =>
                    (khuviarlagdaaguiZakhialgiinGaralt?.khuudasniiDugaar || 0) *
                      (khuviarlagdaaguiZakhialgiinGaralt?.khuudasniiKhemjee ||
                        0) -
                    (khuviarlagdaaguiZakhialgiinGaralt?.khuudasniiKhemjee ||
                      0) +
                    index +
                    1
                },
                {
                  title: "Харилцагчийн нэр",
                  dataIndex: "khariltsagchiinNer",
                  ellipsis: true
                },
                {
                  title: "Утас",
                  dataIndex: "khariltsagchiinUtas",
                  ellipsis: true
                },
                {
                  title: "Машины дугаар",
                  dataIndex: "mashiniiDugaar",
                  ellipsis: true
                },
                {
                  title: "Бүртгэсэн огноо",
                  dataIndex: "createdAt",
                  render: (createdAt) => {
                    return (
                      <span>
                        {moment(createdAt).format("YYYY-MM-DD HH:mm")}
                      </span>
                    )
                  },
                  ellipsis: true
                },
                {
                  title: "Захиалгын огноо",
                  dataIndex: "",
                  render: (data) => {
                    return (
                      <div>
                        <span>
                          {moment(data.ognoo).format("YYYY-MM-DD") +
                            "-" +
                            data.ognooniiTsag}
                        </span>
                      </div>
                    )
                  },
                  ellipsis: true
                },
                {
                  title: "Захиалсан үйлчилгээ",
                  dataIndex: "",
                  key: "zakhialguud",
                  render: (data) => {
                    const uilchilgee = data?.zakhialguud
                      ?.map((x) => x.ner)
                      .join(";")
                    return (
                      <Popover content={uilchilgee}>
                        <div>
                          {data?.zakhialguud?.map((x) => x.turul).join(";")}
                        </div>
                      </Popover>
                    )
                  },
                  ellipsis: true
                },
                {
                  title: "Нийт дүн",
                  dataIndex: "niitDun",
                  render: (niitDun) => {
                    return formatNumber(niitDun)
                  },
                  ellipsis: true
                },
                {
                  title: "Огноо",
                  dataIndex: "ognoo",
                  render: (ognoo) => {
                    return (
                      <span>{moment(ognoo).format("YYYY-MM-DD HH:mm")}</span>
                    )
                  },
                  ellipsis: true
                },
                {
                  title: "Ажилтан сонгох",
                  render: (text, record) => (
                    <Select
                      size="large"
                      style={{ width: "100%" }}
                      onChange={(event) => ajiltanSongokh(event, record)}
                      placeholder="ажилтан хувиарлах"
                    >
                      {ajiltanJagsaalt &&
                        ajiltanJagsaalt.map((mur) => (
                          <Option key={mur._id} value={JSON.stringify(mur)}>
                            {mur.ner}
                          </Option>
                        ))}
                    </Select>
                  ),
                  ellipsis: true
                },
                {
                  title: "",
                  render: (text, record) => (
                    <Button
                      type="primary"
                      onClick={() => khuviarlaltKhadglakh(record)}
                    >
                      хадгалах
                    </Button>
                  ),
                  ellipsis: true
                }
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
