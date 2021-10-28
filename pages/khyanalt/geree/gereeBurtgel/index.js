import moment from "moment"
import { useAuth } from "services/auth"
import readMethod from "tools/function/crud/readMethod"
import {
  FileDoneOutlined,
  UserOutlined,
  HistoryOutlined,
  FileSyncOutlined,
  WarningOutlined,
  FileExcelOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
  SettingOutlined,
  FieldTimeOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons"
import { Table, Card, Popover, Badge, Popconfirm, Drawer, DatePicker, Button, Space, message, Input } from "antd"
import { toWords } from "mon_num"
import Admin from "components/Admin"
import formatNumber from "tools/function/formatNumber"
import React, { useMemo } from "react"
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt"
import { useGereeniiJagsaaltToollolt } from "hooks/useGereeniiJagsaalt"
import uilchilgee, { url } from "services/uilchilgee"
import GereeKharakh from "components/pageComponents/geree/Kharakh"
import router from "next/router"
import { useReactToPrint } from "react-to-print"
import locale from 'antd/lib/date-picker/locale/mn_MN'
import GereeExceleesOruulakh from "components/pageComponents/geree/GereeExceleesOruulakh"
import Sungakh from "components/pageComponents/geree/Sungakh"
import { modal } from "components/ant/Modal"

const Tailbar = React.forwardRef(({token,destroy,confirm,data},ref)=> {
  const [shaltgaan,setTailbar] = React.useState('')
  React.useImperativeHandle(
    ref,
    () => ({
        khadgalya() {
          uilchilgee(token).post('/gereeTsutslaya',{
            "gereeniiId" : data?._id,
            shaltgaan
          }).then(({data})=>{
            if(data === 'Amjilttai'){
              message.success('Гэрээ амжилттай цуцаллаа')
              confirm(shaltgaan)
              destroy()
            }
            
          })
        },
        khaaya() {
            destroy()
        },
    }),
    [shaltgaan],
  )

  return(
    <div className='space-y-2 w-full'>
      <div className='space-y-1 w-full font-medium'>
        <div className='w-full flex flex-row justify-between'>
          <div className='text-right'>Эхлэх огноо:</div>
          <div>{moment(data?.gereeniiOgnoo).format('YYYY-MM-DD')}</div>
        </div>
        <div className='w-full flex flex-row justify-between'>
          <div className='text-right'>Дуусах огноо:</div>
          <div>{moment(data?.duusakhOgnoo).format('YYYY-MM-DD')}</div>
        </div>
        <div className='w-full flex flex-row justify-between'>
          <div className='text-right'>Ашигласан хоног:</div>
          <div>{moment(new Date()).diff(moment(data?.gereeniiOgnoo),'day')}</div>
        </div>
        <div className='w-full flex flex-row justify-between'>
          <div className='text-right'>Авлагын дүн:</div>
          <div>{formatNumber(data?.uldegdel)}</div>
        </div>
      </div>
      
      <Input.TextArea value={shaltgaan} onChange={({target})=>setTailbar(target?.value)}/>
    </div>
  )
})

function ZakhialgiinKhyanalt() {
  const { token, baiguullaga } = useAuth()
  const [shuult, setShuult] = React.useState(null)
  const { gereeniiMedeelel, gereeniiMedeelelMutate, setGereeniiKhuudaslalt } =
    useGereeniiJagsaalt(token, baiguullaga?._id,undefined,shuult?.query)
  const { gereeToollolt, gereeToolloltMutate } =
    useGereeniiJagsaaltToollolt(token)
  const [kharuulakhGeree, setKharuulakhGeree] = React.useState(null)
  const [gereeniiTokhirgoo, setGereeniiTokhirgoo] = React.useState(null)
  const componentRef = React.useRef()
  const excelref = React.useRef()
  const tailbarRef = React.useRef()
  const sungaltRef = React.useRef()
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  
  const khyanaltiinDun = [
    {
      too: gereeniiMedeelel?.niitMur,
      icon: <UserOutlined />,
      khuvi: 100,
      utga: "Нийт",
    },
    {
      too:   gereeToollolt !== undefined
      ? gereeToollolt?.reduce((a, b) => b.kheviin, 0):0,  
        
      icon: <FileDoneOutlined />,
      khuvi: -30,
      utga: "Хэвийн",
    },
    {
      too:   gereeToollolt !== undefined
      ? gereeToollolt?.reduce((a, b) => b.khugatsaaKhetersen, 0) :0,  
      icon: <HistoryOutlined />,
      khuvi: 100,
      utga: "Хугацаа хэтэрсэн",
    },
    {
      too: 0,
      icon: <FileSyncOutlined />,
      khuvi: 100,
      utga: "Хаагдсан",
    },
    {
      too:   gereeToollolt !== undefined
      ? gereeToollolt?.reduce((a, b) => b.sungakh, 0) :0,  
      icon: <WarningOutlined />,
      khuvi: 100,
      utga: "Сунгах гэрээ",
    },
    {
      too: 0,
      icon: <FileExcelOutlined />,
      khuvi: 100,
      utga: "Цуцласан",
    },
  ]

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "Бүртгэсэн",
        dataIndex: "createdAt",
        ellipsis: true,
        className: "text-center",
        align:'center',
        render(date){
          return moment(date).format('YYYY-MM-DD HH:mm')
        }
      },
      {
        title: "Гэрээ",
        dataIndex: "gereeniiDugaar",
        className: "text-center",
        align:'center',
        ellipsis: true,
      },
      {
        title: "Талбай",
        dataIndex: "talbainDugaar",
        className: "text-center",
        align:'center',
        ellipsis: true,
      },

      {
        title: "Төрөл",
        dataIndex: "turul",
        align:'center',
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
        defaultSortOrder: "descend",
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
        defaultSortOrder: "descend",
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
      {
        title: "Хавсралт",
        ellipsis: true,
        className: "text-center",
        align: "center",
        width: "5rem",
        render: (mur) => {
          const data = []
          if (!!mur?.gerchilgeeniiZurag)
            data.push({
              label: "Гэрчилгээний зураг",
              turul: "gerchilgeeniiZurag",
              zurgiinId: mur?.gerchilgeeniiZurag,
            })
          if (!!mur?.unemlekhniiZurag)
            data.push({
              label: "Үнэмлэхний зураг",
              turul: "unemlekhniiZurag",
              zurgiinId: mur?.unemlekhniiZurag,
            })
          if (!!mur?.zuvshuurliinZurag)
            data.push({
              label: "Зөвшөөрлийн зураг",
              turul: "zuvshuurliinZurag",
              zurgiinId: mur?.zuvshuurliinZurag,
            })

          if (data.length > 0)
            return (
              <Popover
                content={
                  <Table
                    pagination={false}
                    size="small"
                    dataSource={data}
                    columns={[
                      {
                        title: "Хавсралт",
                        dataIndex: "label",
                      },
                      {
                        render: (data) => {
                          return (
                            <img
                              className="h-36 w-36"
                              src={`${url}/zuragAvya/${data?.turul}/${baiguullaga?._id}/${data?.zurgiinId}`}
                            />
                          )
                        },
                      },
                    ]}
                  ></Table>
                }
                trigger="click"
              >
                <a className="ant-dropdown-link p-2 rounded-full hover:bg-gray-200 flex items-center justify-center">
                  <Badge count={data.length}>
                    <EyeOutlined style={{ fontSize: "18px" }} />
                  </Badge>
                </a>
              </Popover>
            )
        },
      },
      {
        title: ()=><SettingOutlined/>,
        fixed: "right",
        className: "text-center",
        align: "center",
        width: "3rem",
        render: (data) => (
          <div className="flex flex-row">
            <Popover 
              onVisibleChange={(visible)=>setGereeniiTokhirgoo(visible === true ? data?._id : null)}
              visible={data?._id === gereeniiTokhirgoo}
              content={()=>
              (<div className='flex flex-col space-y-2 w-24'>
                <a
                  className="ant-dropdown-link p-2 rounded-lg hover:bg-green-100 flex items-center justify-between w-full"
                  onClick={() => gereeKharya(data)}
                >
                  <EyeOutlined style={{ fontSize: "18px" }} /> <label> Харах</label>
                </a>
                <a
                  className="ant-dropdown-link p-2 rounded-lg hover:bg-green-100 flex items-center justify-between"
                  onClick={() =>
                    router.push(`/khyanalt/geree/gereeBaiguulakh/${data._id}`)
                  }
                >
                  <EditOutlined style={{ fontSize: "18px" }} /><label> Засах</label>
                </a>
                <a
                  className="ant-dropdown-link p-2 rounded-lg hover:bg-green-100 flex items-center justify-between"
                  onClick={() =>gereeSungaya(data)}
                >
                  <FieldTimeOutlined style={{ fontSize: "18px" }} /><label> Сунгах</label>
                </a>
                <Popconfirm
                  title="Цуцлахдаа итгэлтэй байна уу?"
                  okText="Тийм"
                  cancelText="Үгүй"
                  onConfirm={() =>gereeTsutsalya(data)}
                >
                  <a className="ant-dropdown-link p-2 rounded-lg hover:bg-green-100 flex items-center justify-between">
                    <MinusCircleOutlined style={{ fontSize: "18px" }} /><label> Цуцлах</label>
                  </a>
                </Popconfirm>
              </div>)}
              placement='bottom'
              trigger='click'
            >
              <a className="ant-dropdown-link p-2 rounded-full hover:bg-gray-200 flex items-center justify-center">
                <MoreOutlined style={{ fontSize: "18px" }} />
              </a>
            </Popover>
          </div>
        ),
      },
    ]

    return jagsaalt
  }, [baiguullaga, token,gereeniiTokhirgoo])

  function gereeTsutsalya(data) {
      setGereeniiTokhirgoo(null)
      const footer = [
        <Button onClick={() => tailbarRef.current.khaaya()}>Хаах</Button>,
        <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
            Цуцлах
        </Button>,
    ];
      modal({
        width:'20vw',
        title: "Цуцалсан шалтгаан",
        icon: <MinusCircleOutlined />,
        content:<Tailbar ref={tailbarRef} data={data} token={token} confirm={()=>gereeniiMedeelelMutate()}/>,
        footer
      })
  }

  function gereeSungaya(data) {
    setGereeniiTokhirgoo(null)
    const footer = [
      <Button onClick={() => sungaltRef.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => sungaltRef.current.khadgalya()}>
          Сунгах
      </Button>,
  ];
    modal({
      width:'20vw',
      title: "Гэрээ сунгах",
      icon: <MinusCircleOutlined />,
      content:<Sungakh ref={sungaltRef} data={data} token={token} confirm={()=>gereeniiMedeelelMutate()}/>,
      footer
    })
}

  function gereeKharya(geree) {
    readMethod("gereeniiZagvar", token, geree.gereeniiZagvariinId).then(
      ({ data }) => {
        if (!!data) {
          if (geree.gereeniiOgnoo) {
            geree.ekhlekhOn = moment(geree.gereeniiOgnoo).format("YYYY")
            geree.ekhelkhSar = moment(geree.gereeniiOgnoo).format("MM")
            geree.ekhlekhUdur = moment(geree.gereeniiOgnoo).format("DD")
            if (geree.khugatsaa > 0) {
              let duusakhOgnoo = moment(geree.gereeniiOgnoo).add(
                geree.khugatsaa,
                "M"
              )
              geree.duusakhOn = duusakhOgnoo.format("YYYY")
              geree.duusakhSar = duusakhOgnoo.format("MM")
              geree.duusakhUdur = duusakhOgnoo.format("DD")
            }
          }
          geree.talbainNegjUneUsgeer = toWords(geree.talbainNegjUne)
          geree.talbainNiitUneUsgeer = toWords(geree.talbainNiitUne)

          for (const [key, value] of Object.entries(geree)) {
            data.dedKhesguud
              .filter((a) => !!a.zaalt && a.zaalt?.indexOf(key) !== -1)
              .map((b) => {
                b.zaalt = b.zaalt.replace(
                  new RegExp(`&lt;${key}&gt;`, "g"),
                  value
                )
              })
            data.baruunTolgoi = data.baruunTolgoi?.replace(
              new RegExp(`&lt;${key}&gt;`, "g"),
              value
            )
          }
          data.geree = geree
          setKharuulakhGeree(data)
          setGereeniiTokhirgoo(null)
        }
      }
    )
  }

  function gereeOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>Хаах</Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GereeExceleesOruulakh
          ref={excelref}
          token={token}
          baiguullaga={baiguullaga}
          onFinish={gereeniiMedeelelMutate}
          zam="gereeniiExcelTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Харилцагч загварын excel файл"
          zagvariinZam="gereeniiExcelAvya"
        />
      ),
      footer,
    });
  }

  return (
    <Admin
      khuudasniiNer="gereeBurtgel"
      title="Гэрээний жагсаалт"
      className="p-0 md:p-5"
      onSearch={(search) => setGereeniiKhuudaslalt((a) => ({ ...a, search }))}
    >
      <Drawer
        title={kharuulakhGeree?.gereeniiDugaar}
        width={"50vw"}
        onClose={() => setKharuulakhGeree(null)}
        visible={!!kharuulakhGeree}
        footer={
          <div>
            <button onClick={handlePrint}>Хэвлэх</button>
          </div>
        }
      >
        {!!kharuulakhGeree && (
          <GereeKharakh
            ref={componentRef}
            print={handlePrint}
            data={kharuulakhGeree}
          />
        )}
      </Drawer>
      <Card className="col-span-12 p-5 cardgrid">
        <div className="w-full border-solid grid grid-cols-12 gap-6">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className={`border-2 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-2 intro-y cursor-pointer zoom-in ${mur?.utga === shuult?.utga ? 'bg-green-100' : ''}`}
                onClick={()=>setShuult(mur)}
              >
                <div className="h-full rounded-xl">
                  <div className="p-3 rounded-xl">
                    <div className="flex">
                      <div>
                        <div className="text-3xl text-green-600 font-bold">
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {mur.utga}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-green-600 text-2xl">
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
        <div className='mt-5 flex flex-row'>
          <DatePicker.RangePicker locale={locale} />
          <div className='ml-auto'>
            <Button
              style={{
                alignItems: "end",
                backgroundColor: "#209669",
                color: "#ffffff",
                display: "flex",
              }}
              icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              onClick={gereeOruulakhExcel}
            >
              Excel -ээс Гэрээ татах
            </Button>
          </div>
        </div>
        <div className="overflow-auto hidden md:block mt-8">
          <Table
            bordered
            scroll={{ y: "calc(100vh - 32rem)" }}
            size="small"
            loading={!gereeniiMedeelel}
            rowKey={(row) => row._id}
            columns={columns}
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
        </div>
      </Card>
    </Admin>
  )
}

export default ZakhialgiinKhyanalt
