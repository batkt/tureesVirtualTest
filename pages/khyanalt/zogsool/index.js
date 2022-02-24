import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React, { useState,useMemo } from "react"
import { useAuth } from "services/auth"
import { Card, DatePicker, Table, Tabs } from "antd"
import { FileDoneOutlined } from "@ant-design/icons"
import CardList from "components/cardList"
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile"
import TureeslegchTile from "components/pageComponents/zogsool/TureeslegchTile"
import useZogsool from "hooks/useZogsool"
import moment from "moment"
import formatNumber from "tools/function/formatNumber"

const tureeslegchMashin = [
  {
    dugaar: "1",
    talbai: "M-201",
    mashinDugaar: "2014УБУ",
    orsonOgnoo: "2022-02-19 09:00:10",
    garsanOgnoo: "2022-02-19 21:00:40",
    khugatsaa: "12",
    limit: "240",
    iluuZogsson: "5",
    iluuTsagiinUnelgee: "500",
    tsagiinUnelgee: "1000",
    tulukhDun: "2000",
    utas: "99118811",
    sanuulga: "Илүү цаг",
  },
  {
    dugaar: "2",
    talbai: "M-201",
    mashinDugaar: "2014УБУ",
    orsonOgnoo: "2022-02-19 09:00:10",
    garsanOgnoo: "2022-02-19 21:00:40",
    khugatsaa: "12",
    limit: "240",
    iluuZogsson: "5",
    iluuTsagiinUnelgee: "500",
    tsagiinUnelgee: "1000",
    tulukhDun: "2000",
    utas: "99118811",
    sanuulga: "Илүү цаг",
  },
  {
    dugaar: "3",
    talbai: "M-201",
    mashinDugaar: "2014УБУ",
    orsonOgnoo: "2022-02-19 09:00:10",
    garsanOgnoo: "2022-02-19 21:00:40",
    khugatsaa: "12",
    limit: "240",
    iluuZogsson: "5",
    iluuTsagiinUnelgee: "500",
    tsagiinUnelgee: "1000",
    tulukhDun: "2000",
    utas: "99118811",
    sanuulga: "Илүү цаг",
  },
]

function Zogsool({ token }) {
  const { baiguullaga } = useAuth()

  const [ognoo,setOgnoo] = useState([moment().startOf('month'),moment().endOf('month')])
  const query = useMemo(()=>{
    return {
      check_in_time:{$gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),$lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59')}
    }
  },[ognoo])
  const { zogsoolGaralt, setZogsoolKhuudaslalt } = useZogsool(
    token,
    baiguullaga?._id,
    query
  )

  const toololt = [
    { name: "Нийт машин", too: formatNumber(zogsoolGaralt?.niitMur) || 0 },
    { name: "Нийт авах дүн" },
    { name: "Орсон дүн", too: 0 },
    { name: "Худалдан авагчийн машин", too: 0 },
    { name: "Түрээслэгчийн машин", too: 0 },
    { name: "30 минутаас доош үнэгүй зогссон машин", too: 0 },
  ]

  return (
    <Admin title="Төлбөр тооцоо" khuudasniiNer="zogsool" className="p-0 md:p-4" onSearch={(search) => setZogsoolKhuudaslalt((a) => ({ ...a, search,khuudasniiDugaar:1 }))}>
      <Card size="small" className="col-span-12 overflow-auto p-5">
        <div className="grid w-full grid-cols-12 gap-6 border-solid">
          {toololt.map((a, i) => (
            <div
              key={i}
              className="intro-y zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 md:col-span-4 lg:col-span-2"
            >
              <div className="h-full rounded-xl">
                <div className="rounded-xl p-3">
                  <div className="flex flex-row items-center space-x-2">
                    <div className="text-3xl font-bold text-green-600">
                      {a.too || 0}
                    </div>
                    <div className="text-base text-gray-500">{a.name}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="col-span-12">
        <div>
          <Tabs size="small">
            <Tabs.TabPane
              key="1"
              tab={
                <span>
                  <FileDoneOutlined style={{ fontSize: "32px" }} />
                  Худалдан авагч
                </span>
              }
            >
              <div>
                <DatePicker.RangePicker value={ognoo} onChange={setOgnoo}/>
              </div>
              <Table
                className="mt-8 hidden overflow-auto md:block"
                tableLayout="auto"
                dataSource={zogsoolGaralt?.jagsaalt}
                scroll={{ y: "calc(100vh - 32rem)" }}
                size="small"
                bordered
                columns={[
                  {
                    title: "№",
                    align: "center",
                    dataIndex: "dugaar",
                    width: "2rem",
                    render: (text, record, index) =>
                      (zogsoolGaralt?.khuudasniiDugaar || 0) *
                        (zogsoolGaralt?.khuudasniiKhemjee || 0) -
                      (zogsoolGaralt?.khuudasniiKhemjee || 0) +
                      index +
                      1,
                  },
                  {
                    title: "Машин",
                    align: "center",
                    dataIndex: "car_number",
                  },
                  {
                    title: "Орсон",
                    align: "center",
                    dataIndex: "check_in_time",
                    render(v) {
                      return moment(v).format("YYYY-MM-DD HH:mm")
                    },
                  },
                  {
                    title: "Гарсан",
                    align: "center",
                    dataIndex: "check_out_time",
                    render(v) {
                      return v && moment(v).format("YYYY-MM-DD HH:mm")
                    },
                  },
                  {
                    title: "Хугацаа",
                    align: "center",
                    dataIndex: "khugatsaa",
                  },
                ]}
                pagination={{
                  current: zogsoolGaralt?.khuudasniiDugaar,
                  pageSize: zogsoolGaralt?.khuudasniiKhemjee,
                  total: zogsoolGaralt?.niitMur,
                  showSizeChanger: true,
                  onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                    setZogsoolKhuudaslalt((kh) => ({
                      ...kh,
                      khuudasniiDugaar,
                      khuudasniiKhemjee,
                    })),
                }}
              />
              <CardList
                keyValue="uilchluulegch"
                className="block overflow-auto md:hidden"
                jagsaalt={zogsoolGaralt?.jagsaalt}
                Component={UilchluulegchTile}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              key="2"
              tab={
                <span>
                  <FileDoneOutlined style={{ fontSize: "32px" }} />
                  Түрээслэгч
                </span>
              }
            >
              <Table
                className="mt-8 hidden overflow-auto md:block"
                tableLayout="auto"
                dataSource={tureeslegchMashin}
                size="small"
                bordered
                columns={[
                  {
                    title: "Талбай",
                    align: "center",
                    align: "center",
                    dataIndex: "talbai",
                  },
                  {
                    title: "Машин",
                    align: "center",
                    dataIndex: "mashinDugaar",
                  },
                  {
                    title: "Орсон",
                    align: "center",
                    dataIndex: "orsonOgnoo",
                    ellipsis: true,
                  },
                  {
                    title: "Гарсан",
                    align: "center",
                    dataIndex: "garsanOgnoo",
                    ellipsis: true,
                  },
                  {
                    title: "Хугацаа",
                    align: "center",
                    dataIndex: "khugatsaa",
                  },
                  {
                    title: "Сарын лимит",
                    align: "center",
                    dataIndex: "limit",
                    ellipsis: true,
                  },
                  {
                    title: "Зогсох үлдсэн цаг",
                    align: "center",
                    dataIndex: "iluuZogsson",
                  },
                  {
                    title: "Илүү зогссон цаг",
                    align: "center",
                    dataIndex: "iluuZogsson",
                    ellipsis: true,
                  },
                  {
                    title: "Энгийн цагийн үнэлгээ",
                    align: "center",
                    dataIndex: "tsagiinUnelgee",
                    ellipsis: true,
                  },
                  {
                    title: "Илүү цагийн үнэлгээ",
                    align: "center",
                    dataIndex: "iluutsagiinUnelgee",
                    ellipsis: true,
                  },
                  {
                    title: "Дүн",
                    align: "center",
                    dataIndex: "tulukhDun",
                  },
                  {
                    title: "Утас",
                    align: "center",
                    dataIndex: "utas",
                  },
                  { title: "Сануулга", align: "center", dataIndex: "sanuulga" },
                ]}
              />
              <CardList
                keyValue="uilchluulegch"
                className="block overflow-auto md:hidden"
                jagsaalt={zogsoolGaralt?.jagsaalt}
                Component={TureeslegchTile}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default Zogsool
