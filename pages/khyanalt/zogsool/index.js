import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React, { useState,useMemo } from "react"
import { useAuth } from "services/auth"
import { Button, Card, DatePicker, Space, Table, Tabs } from "antd"
import { FileExcelOutlined } from "@ant-design/icons"
import CardList from "components/cardList"
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile"
import useZogsool,{useZogsoolToololt} from "hooks/useZogsool"
import moment from "moment"
import formatNumber from "tools/function/formatNumber"
import { useRef } from "react"
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh"
import { modal } from "components/ant/Modal"
import _ from "lodash"

function Zogsool({ token }) {
  const { baiguullaga ,barilgiinId} = useAuth()
  const excelref = useRef(null)
  const [ognoo,setOgnoo] = useState([moment().startOf('month'),moment().endOf('month')])
  const [turul,setTurul] = useState(undefined)

  const {zogsoolToololt,zogsoolToololtMutate} = useZogsoolToololt(token,ognoo)

  const query = useMemo(()=>{
    return {
      check_in_time:{$gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),$lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59')},
      turul:turul === 'Үйлчлүүлэгч' ? null : turul
    }
  },[ognoo,turul])
  
  const { zogsoolGaralt, setZogsoolKhuudaslalt ,zogsoolMutate} = useZogsool(
    token,
    baiguullaga?._id,
    query
  )

  const toololt = useMemo(()=>[
    { name: "Үйлчлүүлэгч", too: formatNumber(zogsoolToololt?.find(a=>a._id === null)?.too,0)},
    { name: "Түрээслэгч",too: formatNumber(zogsoolToololt?.find(a=>a._id === 'Түрээслэгч')?.too,0) },
    { name: "Гэрээт", too: formatNumber(zogsoolToololt?.find(a=>a._id === 'Гэрээт')?.too,0) },
    { name: "Дотоод", too: formatNumber(zogsoolToololt?.find(a=>a._id === 'Дотоод')?.too,0) }
  ],[zogsoolToololt,zogsoolGaralt])
  
  function onRefresh() {
    zogsoolToololtMutate()
    zogsoolMutate()
  }

  function mashinOruulakhExcel() {
      const footer = [
        <Space>
          <Button onClick={() => excelref.current.khaaya()}>Хаах</Button>
          <Button style={{ backgroundColor: "#209669", color: "#ffffff" }}>Хадгалах</Button>
        </Space>
      ]
      modal({
        title: "",
        icon: <FileExcelOutlined />,
        content: (
          <ExceleesOruulakh
            ref={excelref}
            token={token}
            onFinish={onRefresh}
            barilgiinId={barilgiinId}
            zam="mashiniiExcelTatya"
            garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
            tailbar="Машины мэдээлэл оруулах excel файл"
            zagvariinZam="mashiniiExcelAvya"
          />
        ),
        footer,
      })
  }

  const columns = useMemo(()=>{
    const col = [{
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
    }]
    if(turul === 'Түрээслэгч')
    {
      col.push({
          title: "Талбай",
          align: "center",
          dataIndex: "mashin",
          render(m){
            return m?.ezemshigchiinTalbainDugaar
          }
      })
      col.push({
        title: "Гэрээ",
        align: "center",
        dataIndex: "mashin",
        render(m){
          return m?.gereeniiDugaar
        }
      })
    }
    return [
      ...col,
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
    ]
  },[turul])

  return (
    <Admin title="Зогсоол" khuudasniiNer="zogsool" className="p-0 md:p-4" onSearch={(search) => setZogsoolKhuudaslalt((a) => ({ ...a, search,khuudasniiDugaar:1 }))}>
      <Card size="small" className="col-span-12 overflow-auto p-5">
        <div className="grid w-full grid-cols-12 gap-6 border-solid">
          {toololt.map((a, i) => (
            <div
              key={i}
              className={`intro-y zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 md:col-span-4 lg:col-span-3 ${a.name === turul ? 'bg-green-100' : ''}`}
              onClick={()=>setTurul(a.name)}
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
        <div className="flex flex-row">
          <DatePicker.RangePicker value={ognoo} onChange={setOgnoo}/>
          <button
            style={{
              backgroundColor: "#209669",
              display: "flex",
              justifyContent: "end",
            }}
            className="dropdown-toggle btn box mt-8 ml-auto w-full  bg-green-500 px-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 md:mt-0 md:w-auto"
            aria-expanded="false"
            onClick={mashinOruulakhExcel}
          >
            <span className="flex h-5 w-5 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-plus h-4 w-4"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
            <span>Excel -ээс Машин татах</span>
          </button>
        </div>
        <Table
          className="mt-8 hidden overflow-auto md:block"
          tableLayout="auto"
          loading={!zogsoolGaralt}
          dataSource={zogsoolGaralt?.jagsaalt}
          scroll={{ y: "calc(100vh - 30rem)" }}
          size="small"
          bordered
          rowKey={(row) => row._id}
          columns={columns}
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
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default Zogsool
