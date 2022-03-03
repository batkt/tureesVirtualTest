import React, { useRef } from 'react'
import Admin from 'components/Admin'
import _ from "lodash"
import { Badge, Button, Dropdown, Menu, Space, Table } from 'antd'
import { DownOutlined, FileExcelOutlined } from '@ant-design/icons'
import ZardalBurtgekh from 'components/pageComponents/zardal/ZardalBurtgekh'
import { useAuth } from "services/auth"
import { modal } from "components/ant/Modal"
import shalgaltKhiikh from 'services/shalgaltKhiikh'
import useZardal from 'hooks/useZardal'

const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);


function zardal({token}) {
  const {barilgiinId,baiguullaga} = useAuth()
  const zardalRef = useRef(null)

  const {zardalGaralt,setZardalKhuudaslalt} = useZardal(token,baiguullaga?._id)

  function onRefresh() {
    
  }

  function zardalBurtgekh(data) {
    const footer = [
      <Space>
        <Button onClick={() => zardalRef.current.khaaya()}>Хаах</Button>
        <Button style={{ backgroundColor: "#209669", color: "#ffffff" }} onClick={() => zardalRef.current.khadgalya()}>Хадгалах</Button>
      </Space>
    ]
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <ZardalBurtgekh
          ref={zardalRef}
          token={token}
          onRefresh={onRefresh}
          barilgiinId={barilgiinId}
          data={data}
        />
      ),
      footer,
    })
  }

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "№",
        width: "3rem",
        align: "center",
        render: (text, record, index) => index + 1
      },
      { title: 'Нэр', dataIndex: 'ner', key: 'Нэр' }
    ];
    if(!record?.dedKhesguud)
    return undefined
    return <Table columns={columns} dataSource={record?.dedKhesguud} pagination={false} expandable={{ expandedRowRender }}/>;
  };

  return (
    <Admin
      title="Дансны хуулга"
      khuudasniiNer="zardal"
      className="p-0 md:p-4"
    >
      <div className="col-span-12 grid w-full grid-cols-12 gap-4">
      {[
            { too: 0, utga: "Нийт" },
            {
              too:  0,
              utga: "Тодорхойгүй",
            },
            { too: 0, utga: "Холбогдсон" },
            {
              too:  0,
              utga: "Магадлалтай",
            },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className="intro-y zoom-in col-span-12 cursor-pointer rounded-xl border-2 border-green-600 md:col-span-6 lg:col-span-3"
              >
                <div className="h-full rounded-xl">
                  <div className="rounded-xl p-3">
                    <div className="flex">
                      <div>
                        <div className="text-3xl font-bold text-green-600">
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {mur.utga}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-2xl text-green-600">
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
      <div className="col-span-12 space-y-5">
        <button
          style={{
            backgroundColor: "#209669",
            display: "flex",
            justifyContent: "end",
          }}
          className="dropdown-toggle btn box mt-8 ml-auto w-full  bg-green-500 px-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 md:mt-0 md:w-auto"
          aria-expanded="false"
          onClick={()=>zardalBurtgekh()}
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
          <span>Зардал бүртгэх</span>
        </button>
      <Table
        tableLayout='auto'
        scroll={{ y: "calc(100vh - 26rem)" }}
        size="small"
        bordered
        columns={[
          {
            title: "№",
            width: "3rem",
            align: "center",
            render: (text, record, index) => index + 1
          },
          {
            title: "Нэр",
            width: "3rem",
            align: "center",
            dataIndex:'ner'
          },
          
        ]}
        dataSource={zardalGaralt?.jagsaalt}
        rowKey={(a) => a._id}
        pagination={{
          current: zardalGaralt?.khuudasniiDugaar,
          pageSize: zardalGaralt?.khuudasniiKhemjee,
          total: zardalGaralt?.niitMur,
          showSizeChanger: true,
          onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
            setZardalKhuudaslalt((kh) => ({
              ...kh,
              khuudasniiDugaar,
              khuudasniiKhemjee,
            })),
        }}
        rowClassName={(record, index) =>
          index % 2 === 0
            ? "bg-white dark:bg-gray-600"
            : "bg-gray-200 dark:bg-gray-800"
        }
        expandable={{ expandedRowRender }}
      />
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default zardal