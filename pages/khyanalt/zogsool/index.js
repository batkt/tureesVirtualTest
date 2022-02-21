import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React from "react"
import { useAuth } from "services/auth"
import { Card, Table, Tabs } from "antd"
import { FileDoneOutlined } from "@ant-design/icons"
import CardList from "components/cardList"
import UilchluulegchTile from "./dedKheseg/UilchluulegchTile"
import TureeslegchTile from "./dedKheseg/TureeslegchTile"
import useZogsool from "hooks/useZogsool"
import moment from 'moment'

const toololt = [
  { name: "Нийт машины тоо", too: 0 },
  { name: "Нийт авах дүн" },
  { name: "Орсон дүн", too: 0 },
  { name: "Худалдан авагчийн машины тоо", too: 0 },
  { name: "Түрээслэгчийн машины тоо", too: 0 },
  { name: "30 минутаас доош үнэгүй зогссон машин", too: 0 },
]
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
const uilchluulegchMashin = [
  {
    dugaar: "1",
    mashinDugaar: "1469УБҮ",
    orsonOgnoo: "2022-02-19 18:00:50",
    garsanOgnoo: "2022-02-19 18:30:40",
    khugatsaa: "30мин",
    tsagiinUnelgee: "1000",
    tulukhDun: "2000",
    utas: "99118811",
  },
  {
    dugaar: "2",
    mashinDugaar: "1469УБҮ",
    orsonOgnoo: "2022-02-19 18:00:50",
    garsanOgnoo: "2022-02-19 18:30:40",
    khugatsaa: "30мин",
    tsagiinUnelgee: "1000",
    tulukhDun: "2000",
    utas: "99118811",
  },
  {
    dugaar: "3",
    mashinDugaar: "1469УБҮ",
    orsonOgnoo: "2022-02-19 18:00:50",
    garsanOgnoo: "2022-02-19 18:30:40",
    khugatsaa: "30мин",
    tsagiinUnelgee: "1000",
    tulukhDun: "2000",
    utas: "99118811",
  },
]
function Zogsool({ token }) {
  const { baiguullaga } = useAuth()
  const {zogsoolGaralt,setZogsoolKhuudaslalt} = useZogsool(token,baiguullaga?._id)

  return (
    <Admin title="Төлбөр тооцоо" khuudasniiNer="zogsool" className="p-0 md:p-4">
      <Card
        size="small"
        className="col-span-12 overflow-auto p-5"
      >
        <div className="grid w-full grid-cols-12 gap-6 border-solid">
          {toololt.map((a, i) => (
            <div
              key={i}
              className="intro-y zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 md:col-span-4 lg:col-span-2"
            >
              <div className="h-full rounded-xl">
                <div className="rounded-xl p-3">
                  <div className="flex flex-row space-x-2 items-center">
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
          <Tabs size="large">
            <Tabs.TabPane
              key="1"
              tab={
                <span>
                  <FileDoneOutlined style={{ fontSize: "32px" }} />
                  Худалдан авагч
                </span>
              }
            >
              <Table
                className="mt-8 hidden overflow-auto md:block"
                dataSource={zogsoolGaralt?.jagsaalt}
                scroll={{ y: "calc(100vh - 32rem)" }}
                columns={[
                  { title: "№", align: "center", dataIndex: "dugaar" ,render: (text, record, index) =>
                  (zogsoolGaralt?.khuudasniiDugaar || 0) *
                    (zogsoolGaralt?.khuudasniiKhemjee || 0) -
                  (zogsoolGaralt?.khuudasniiKhemjee || 0) +
                  index +
                  1},
                  {
                    title: "Машины дугаар",
                    align: "center",
                    dataIndex: "car_number",
                  },
                  {
                    title: "Орсон огноо",
                    align: "center",
                    dataIndex: "check_in_time",
                    render(v){
                      return moment(v).format('YYYY-MM-DD hh:mm')
                    }
                  },
                  {
                    title: "Гарсан огноо",
                    align: "center",
                    dataIndex: "check_out_time",
                    render(v){
                      return moment(v).format('YYYY-MM-DD hh:mm')
                    }
                  },
                  {
                    title: "Зарцуулсан хугацаа",
                    align: "center",
                    dataIndex: "khugatsaa",
                  }
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
                jagsaalt={uilchluulegchMashin}
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
                dataSource={tureeslegchMashin}
                columns={[
                  { title: "№", align: "center", dataIndex: "dugaar" },
                  {
                    title: "Талбай",
                    align: "center",
                    align: "center",
                    dataIndex: "talbai",
                  },
                  {
                    title: "Машины дугаар",
                    align: "center",
                    dataIndex: "mashinDugaar",
                  },
                  {
                    title: "Орсон огноо",
                    align: "center",
                    dataIndex: "orsonOgnoo",
                  },
                  {
                    title: "Гарсан огноо",
                    align: "center",
                    dataIndex: "garsanOgnoo",
                  },
                  {
                    title: "Зарцуулсан хугацаа",
                    align: "center",
                    dataIndex: "khugatsaa",
                  },
                  {
                    title: "Сарын зогссолын лимит цаг",
                    align: "center",
                    dataIndex: "limit",
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
                  },
                  {
                    title: "Энгийн цагийн үнэлгээ",
                    align: "center",
                    dataIndex: "tsagiinUnelgee",
                  },
                  {
                    title: "Илүү цагийн үнэлгээ",
                    align: "center",
                    dataIndex: "iluutsagiinUnelgee",
                  },
                  {
                    title: "Төлөх дүн",
                    align: "center",
                    dataIndex: "tulukhDun",
                  },
                  {
                    title: "Утасны дугаар",
                    align: "center",
                    dataIndex: "utas",
                  },
                  { title: "Сануулга", align: "center", dataIndex: "sanuulga" },
                ]}
              />
              <CardList
                keyValue="uilchluulegch"
                className="block overflow-auto md:hidden"
                jagsaalt={tureeslegchMashin}
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
