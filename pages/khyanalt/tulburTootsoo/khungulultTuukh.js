import moment from "moment"
import { useAuth } from "services/auth"
import { DeleteOutlined } from "@ant-design/icons"
import { Table, Button, Card, DatePicker, message, Popconfirm } from "antd"

import Admin from "components/Admin"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import uilchilgee, { aldaaBarigch } from "services/uilchilgee"
import formatNumber from "tools/function/formatNumber"
import { useMemo, useState } from "react"
import useKhungulultTuukh from "hooks/tulburTootsoo/useKhungulultTuukh"

const { RangePicker } = DatePicker
//#endregion

function EbarimtMedeelel({ token }) {
  const { ajiltan } = useAuth()
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([moment(), moment()])

  const query = useMemo(() => {
    return {
      createdAt: {
        $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
        $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
      },
    }
  }, [ekhlekhOgnoo])

  const { khungulultTuukh, khungulultTuukhMutate, setKhuudaslalt } =
    useKhungulultTuukh(token, ajiltan?.baiguullagiinId, query)

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

  return (
    <Admin
      khuudasniiNer="khungulultTuukh"
      title="Хөнгөлөлтийн түүх"
      className="p-0 md:p-5"
      onSearch={(search) => setKhuudaslalt((a) => ({ ...a, search }))}
    >
      <Card className="col-span-12 p-5 cardgrid">
        <div className="w-full flex flex-row justify-between mt-5">
          <RangePicker
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
          rowKey={(row) => row._id}
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
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default EbarimtMedeelel
