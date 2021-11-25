import moment from "moment"
import { useAuth } from "services/auth"
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons"
import {
  Table,
  Button,
  Tabs,
  Card,
  DatePicker,
  message,
  Popconfirm,
  Popover,
} from "antd"

import Admin from "components/Admin"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import uilchilgee, { aldaaBarigch } from "services/uilchilgee"
import formatNumber from "tools/function/formatNumber"
import dateDiff from "tools/function/dateDiff"
import { useMemo, useState } from "react"
import useEBarimt from "hooks/useEBarimt"
import useEBarimtMedeelel from "hooks/useEBarimtMedeelel"
import useZakhialga from "hooks/useZakhialga"

const { RangePicker } = DatePicker
//#endregion

function EbarimtMedeelel({ token }) {
  const { ajiltan } = useAuth()
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ])

  const query = useMemo(() => {
    return {
      ognoo: {
        $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
        $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
      },
      tuluv: "3",
      tulburTulsunEsekh: true,
    }
  }, [ekhlekhOgnoo])

  const { eBarimtGaralt, eBarimtMutate, setEBarimtKhuudaslalt } = useEBarimt(
    token,
    ajiltan?.baiguullagiinId,
    ekhlekhOgnoo
  )

  const { eBarimtMedeelel, eBarimtMedeelelMutate } = useEBarimtMedeelel(token)
  const khyanaltiinDun = [
    {
      too: 100,
      utga: "Баримт авах гүйлгээний тоо",
    },
    {
      too: 20,
      utga: "Баримт авах гүйлгээний дүн",
    },

    {
      too: eBarimtGaralt?.niitMur || 0,
      utga: "Баримт авсан тоо",
    },

    {
      too: formatNumber(
        eBarimtGaralt?.jagsaalt.reduce((a, b) => a + Number(b?.cashAmount), 0)
      ),
      utga: "Баримт авсан гүйлгээний дүн",
    },
    {
      too: 20,
      utga: "Буцаалт хийгдсэн тоо",
    },
    {
      too: 20,
      utga: "Буцаалт хийгдсэн дүн",
    },
  ]

  function ebarimtIlgeeye() {
    uilchilgee(token)
      .post("/ebarimtIlgeeye")
      .then(({ status }) => {
        status === 200 && message.success("Баримт амжилттай илгээлээ")
        eBarimtMedeelelMutate()
      })
      .catch(aldaaBarigch)
  }

  function ebarimtUstgaya(mur) {
    uilchilgee(token)
      .post("/ebarimtButsaaya", mur)
      .then(({ data }) => {
        if (!!data) {
          eBarimtMutate()
          message.success(
            `${mur.billId} дугаартай баримт амжилттай ebarimt -с устгагдлаа`
          )
        }
      })
  }

  return (
    <Admin
      khuudasniiNer="eBarimt"
      title="И-баримтын бүртгэл"
      className="p-0 md:p-5"
      onSearch={(search) => setKhuudaslalt((a) => ({ ...a, search }))}
    >
      <Card className="col-span-12 p-5 cardgrid">
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
                        <div className="text-sm text-gray-500">{mur.utga}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="w-full flex flex-row justify-between mt-5">
          <RangePicker
            style={{ marginBottom: "20px" }}
            size="middle"
            defaultValue={[
              moment(new Date(), "YYYY-MM-DD"),
              moment(new Date(), "YYYY-MM-DD"),
            ]}
            onChange={setEkhlekhOgnoo}
          />
          <div className="flex flex-row space-x-2">
            <Button title="Сүүлд илгээгдсэн огноо" >
              {moment(new Date()).format("YYYY-MM-DD")}
            </Button>
            <Button danger onClick={ebarimtIlgeeye}  >Татварт илгээх</Button>
          </div>
        </div>

        <Table
          style={{ width: "65%" }}
          bordered
          tableLayout={"fixed"}
          size="small"
          rowClassName="hover:bg-blue-100"
          dataSource={eBarimtGaralt?.jagsaalt}
          pagination={{
            current: eBarimtGaralt?.khuudasniiDugaar,
            pageSize: eBarimtGaralt?.khuudasniiKhemjee,
            total: eBarimtGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setEBarimtKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
          scroll={{ x: "calc(100vh - 15rem)" }}
          rowKey={(row) => row.id}
          columns={[
            {
              title: "Огноо",
              dataIndex: "date",
              ellipsis: true,
              render: (data) => {
                return moment(data).format("YYYY-MM-DD hh:mm:ss")
              },
            },
            // {
            //   title: "Төрөл",
            //   dataIndex: "turul",
            //   ellipsis: true,
            // },
            {
              title: "ДДТД",
              dataIndex: "billId",
              ellipsis: true,
            },
            // {
            //   title: "Гэрээний дугаар",
            //   dataIndex: "gereeniiDugaar",
            //   ellipsis: true,
            // },

            {
              title: "Дүн",
              dataIndex: "cashAmount",
              ellipsis: true,
              render: (data) => {
                return formatNumber(data)
              },
            },

            {
              width: "50px",
              align: "center",
              render(data) {
                return (
                  <Popconfirm
                    title="ebarimt устгах уу?"
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={() => ebarimtUstgaya(data)}
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
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default EbarimtMedeelel
