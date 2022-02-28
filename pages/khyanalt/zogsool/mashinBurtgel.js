import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React, { useMemo, useState } from "react"
import { useAuth } from "services/auth"
import { Button, Card, Space, Table } from "antd"
import { FileExcelOutlined } from "@ant-design/icons"
import CardList from "components/cardList"
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile"
import formatNumber from "tools/function/formatNumber"
import { useRef } from "react"
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh"
import { modal } from "components/ant/Modal"
import useMashin,{useMashinToololt} from "hooks/useMashin"
import MashinBurtgel from "components/pageComponents/zogsool/MashinBurtgel"

function mashinBurtgel({ token }) {
  const { baiguullaga ,barilgiinId} = useAuth()
  const excelref = useRef(null)
  const mashinref = useRef(null)
  const [turul,setTurul] = useState("Нийт")

  const query = useMemo(()=>{
    if(turul === 'Нийт')
      return {}
    return {turul}
  },[turul])

  const {mashinToololt,mashinToololtMutate} = useMashinToololt(token)

  const { mashinGaralt, setMashinKhuudaslalt,mashinMutate } = useMashin(token,baiguullaga?._id,query)

  const toololt = useMemo(()=>{
    return [
      { name: "Нийт", too: formatNumber(mashinGaralt?.niitMur) },
      { name: "Гэрээт",too: formatNumber(mashinToololt?.find(a=>a._id === 'Гэрээт')?.too) },
      { name: "Түрээслэгч", too: formatNumber(mashinToololt?.find(a=>a._id === 'Түрээслэгч')?.too) },
      { name: "Дотоод", too: formatNumber(mashinToololt?.find(a=>a._id === 'Дотоод')?.too) }
    ]
  },[mashinToololt,mashinGaralt])

  function onRefresh() {
    mashinMutate()
    mashinToololtMutate()
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

  function mashinBurtgekh(data) {
    const footer = [
      <Space>
        <Button onClick={() => mashinref.current.khaaya()}>Хаах</Button>
        <Button style={{ backgroundColor: "#209669", color: "#ffffff" }} onClick={() => mashinref.current.khadgalya()}>Хадгалах</Button>
      </Space>
    ]
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <MashinBurtgel
          ref={mashinref}
          token={token}
          onRefresh={onRefresh}
          barilgiinId={barilgiinId}
          data={data}
        />
      ),
      footer,
    })
}

  return (
    <Admin title="Машин бүртгэл" khuudasniiNer="mashinBurtgel" className="p-0 md:p-4" onSearch={(search) => setMashinKhuudaslalt((a) => ({ ...a, search,khuudasniiDugaar:1 }))}>
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
          <button
            style={{
              backgroundColor: "#209669",
              display: "flex",
              justifyContent: "end",
            }}
            className="dropdown-toggle btn box mt-8 ml-auto w-full  bg-green-500 px-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 md:mt-0 md:w-auto"
            aria-expanded="false"
            onClick={()=>mashinBurtgekh()}
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
            <span>Машин нэмэх</span>
          </button>
          <button
            style={{
              backgroundColor: "#209669",
              display: "flex",
              justifyContent: "end",
            }}
            className="dropdown-toggle btn box mt-8 ml-5 w-full  bg-green-500 px-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 md:mt-0 md:w-auto"
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
            <span>Excel -ээс татах</span>
          </button>
          
        </div>
        <Table
          className="mt-8 hidden overflow-auto md:block"
          tableLayout="auto"
          loading={!mashinGaralt}
          dataSource={mashinGaralt?.jagsaalt}
          scroll={{ y: "calc(100vh - 30rem)" }}
          size="small"
          bordered
          columns={[
            {
              title: "№",
              align: "center",
              dataIndex: "dugaar",
              width: "2rem",
              render: (text, record, index) =>
                (mashinGaralt?.khuudasniiDugaar || 0) *
                  (mashinGaralt?.khuudasniiKhemjee || 0) -
                (mashinGaralt?.khuudasniiKhemjee || 0) +
                index +
                1,
            },
            {
              title: "Нэр",
              align: "center",
              dataIndex: "ezemshigchiinNer"
            },
            {
              title: "Регистр",
              align: "center",
              dataIndex: "ezemshigchiinRegister",
            },
            {
                title: "Утас",
                align: "center",
                dataIndex: "ezemshigchiinUtas",
            },
            {
              title: "Дугаар",
              align: "center",
              dataIndex: "dugaar"
            },
            {
              title: "Төрөл",
              align: "center",
              dataIndex: "turul",
            },
          ]}
          pagination={{
            current: mashinGaralt?.khuudasniiDugaar,
            pageSize: mashinGaralt?.khuudasniiKhemjee,
            total: mashinGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setMashinKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
        <CardList
          keyValue="uilchluulegch"
          className="block overflow-auto md:hidden"
          jagsaalt={mashinGaralt?.jagsaalt}
          Component={UilchluulegchTile}
        />
      </Card>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default mashinBurtgel
