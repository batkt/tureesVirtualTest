import moment from "moment";
import { useAuth } from "services/auth";
import readMethod from "tools/function/crud/readMethod";
import {
  FileDoneOutlined,
  UserOutlined,
  HistoryOutlined,
  FileSyncOutlined,
  WarningOutlined,
  FileExcelOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Table, Card, Popover, Badge,Button, Popconfirm, Drawer } from "antd";
import {toWords} from "mon_num";
import Admin from "components/Admin";
import formatNumber from "tools/function/formatNumber";
import React,{ useMemo } from "react";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import { url } from "services/uilchilgee";
import deleteMethod from "tools/function/crud/deleteMethod";
import GereeKharakh from 'components/pageComponents/geree/Kharakh'
import router from "next/router";
import { useReactToPrint } from 'react-to-print';

function ZakhialgiinKhyanalt() {
  const { token,baiguullaga } = useAuth();
  const { gereeniiMedeelel,gereeniiMedeelelMutate } = useGereeniiJagsaalt(token);
  const [kharuulakhGeree,setKharuulakhGeree] = React.useState(null)
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });



  
  const khyanaltiinDun = useMemo(() => {
    return [
      {
        too: 150,
        icon: <UserOutlined />,
        khuvi: 100,
        utga: "Нийт",
      },
      {
        too: 100,
        icon: <FileDoneOutlined />,
        khuvi: -30,
        utga: "Хэвийн",
      },
      {
        too: 5,
        icon: <HistoryOutlined />,
        khuvi: 100,
        utga: "Хугацаа хэтэрсэн",
      },
      {
        too: 15,
        icon: <FileSyncOutlined />,
        khuvi: 100,
        utga: "Хаагдсан",
      },
      {
        too: 20,
        icon: <WarningOutlined />,
        khuvi: 100,
        utga: "Төлбөр дутуу",
      },
      {
        too: 10,
        icon: <FileExcelOutlined />,
        khuvi: 100,
        utga: "Цуцласан",
      },
    ];
  }, []);

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "Гэрээ",
        dataIndex: "gereeniiDugaar",
        ellipsis: true,
      },
      {
        title: "Повьлон",
        dataIndex: "languuniiDugaar",
        ellipsis: true,
      },
      {
        title: "Бүртгэгдсэн",
        dataIndex: "createdAt",
        ellipsis: true,
        render: (data) => {
          return moment(data).format("YYYY-MM-DD");
        },
      },
      {
        title: "Төрөл",
        dataIndex: "turul",
        ellipsis: true,
      },

      {
        title: "Талбай /м2/",
        dataIndex: "talbainKhemjee",
        ellipsis: true,
        render: (talbainKhemjee) => {
          return `${talbainKhemjee} м2`;
        },
      },
      {
        title: "Үнэ/м2/",
        dataIndex: "talbainNegjUne",
        ellipsis: true,
        align: "center",
        render: (talbainNegjUne) => {
          return formatNumber(talbainNegjUne || 0);
        },
      },
      {
        title: "Төлбөр",
        dataIndex: "sariinTurees",
        ellipsis: true,
        align: "center",
        render: (sariinTurees) => {
          return formatNumber(sariinTurees || 0);
        },
      },
      {
        title: "Барьцаа дүн",
        dataIndex: "baritsaaAvakhDun",
        ellipsis: true,
        align: "center",
        render: (baritsaaDun) => {
          return formatNumber(baritsaaDun || 0);
        },
      },
      {
        title: "Эхлэх",
        dataIndex: "gereeniiOgnoo",
        ellipsis: true,
        render: (data) => {
          return moment(data).format("YYYY-MM-DD");
        },
      },
      {
        title: "Дуусах хоног",
        dataIndex: "duusakhOgnoo",
        ellipsis: true,
        render: (duusakhOgnoo) => {
          return moment(duusakhOgnoo).diff(moment(new Date()),'days');
        },
      },
      {
        title: "Авлага дүн",
        ellipsis: true,
        align: "center",
        render: (row) => {
          return formatNumber(((row.baritsaaAvakhDun || 0) * (row.baritsaaAvakhKhugatsaa || 0)) + (row.sariinTurees || 0));
        },
      },
      {
        title: "Дуусах",
        dataIndex: "duusakhOgnoo",
        ellipsis: true,
        render: (data) => {
          return moment(data).format("YYYY-MM-DD");
        },
      },
      {
        title: "Ажилтан",
        dataIndex: "burtgesenAjiltaniiNer",
        ellipsis: true,
        render: () => {
          return "Админ";
        },
      },
      {
        title: "Хавсралт",
        ellipsis: true,
        width:'4rem',
        render:(mur)=>{
          const data = []
          if(!!mur?.gerchilgeeniiZurag)
            data.push({label:'Гэрчилгээний зураг',turul:"gerchilgeeniiZurag",zurgiinId:mur?.gerchilgeeniiZurag})
          if(!!mur?.unemlekhniiZurag)
            data.push({label:'Үнэмлэхний зураг',turul:"unemlekhniiZurag",zurgiinId:mur?.unemlekhniiZurag})
          if(!!mur?.zuvshuurliinZurag)
            data.push({label:'Зөвшөөрлийн зураг',turul:"zuvshuurliinZurag",zurgiinId:mur?.zuvshuurliinZurag})
          
          if(data.length > 0)
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
        }
      },
      {
        title: "Тохиргоо",
        fixed: 'right',
        width:'8rem',
        render: (data) => 
          <div className='flex flex-row'>
            <a
              className="ant-dropdown-link p-2 rounded-full hover:bg-gray-200 flex items-center justify-center"
              onClick={()=>gereeKharya(data)}
            >
              <EyeOutlined style={{ fontSize: "18px" }} />
            </a>
            <a
              className="ant-dropdown-link p-2 rounded-full hover:bg-gray-200 flex items-center justify-center"
              onClick={()=>router.push(`/khyanalt/geree/gereeBaiguulakh/${data._id}`)}
            >
              <EditOutlined style={{ fontSize: "18px" }} />
            </a>
            <Popconfirm title="Усгахдаа итгэлтэй байна уу?" okText='Тийм' cancelText='Үгүй' onConfirm={()=>deleteMethod('geree',token,data._id).then(()=>gereeniiMedeelelMutate())}>
              <a
                className="ant-dropdown-link p-2 rounded-full hover:bg-gray-200 flex items-center justify-center"
              >
                <DeleteOutlined style={{ fontSize: "18px" }} />
              </a>
            </Popconfirm>
          </div>
        ,
      },
    ];

    return jagsaalt;
  }, [baiguullaga,token]);

  function gereeKharya(geree) {
    readMethod('gereeniiZagvar',token,geree.gereeniiZagvariinId).then(({data})=>{
      if(!!data)
        {
          if (geree.gereeniiOgnoo) {
            geree.ekhlekhOn = moment(geree.gereeniiOgnoo).format(
              "YYYY"
            );
            geree.ekhelkhSar = moment(geree.gereeniiOgnoo).format(
              "MM"
            );
            geree.ekhlekhUdur = moment(
              geree.gereeniiOgnoo
            ).format("DD");
            if (geree.khugatsaa > 0) {
              let duusakhOgnoo = moment(geree.gereeniiOgnoo).add(
                geree.khugatsaa,
                "M"
              );
              geree.duusakhOn = duusakhOgnoo.format("YYYY");
              geree.duusakhSar = duusakhOgnoo.format("MM");
              geree.duusakhUdur = duusakhOgnoo.format("DD");
            }
          }
          geree.talbainNegjUneUsgeer = toWords(geree.talbainNegjUne)
          geree.talbainNiitUneUsgeer = toWords(geree.talbainNiitUne)
      
          for (const [key, value] of Object.entries(geree)) {
            data.dedKhesguud
              .filter((a) => !!a.zaalt && a.zaalt?.indexOf(key) !== -1)
              .map((b) => {
                b.zaalt = b.zaalt.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
              });
              data.baruunTolgoi = data.baruunTolgoi?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
          }
          data.geree = geree
          setKharuulakhGeree(data)
        }
    })
  }

  return (
    <Admin
      khuudasniiNer="gereeBurtgel"
      title="Гэрээний жагсаалт"
      className="p-0 md:p-5"
      onSearch={(search) => setKhuudaslalt((a) => ({ ...a, search }))}
    >
      <Drawer
        title={kharuulakhGeree?.gereeniiDugaar}
        width={'50vw'}
        onClose={()=>setKharuulakhGeree(null)}
        visible={!!kharuulakhGeree}
        footer={ <div><button onClick={handlePrint}>Хэвлэх</button></div>}
      >
        {!!kharuulakhGeree && <GereeKharakh ref={componentRef} print={handlePrint} data={kharuulakhGeree}/>}
      </Drawer>
      <Card className="col-span-12 p-5 cardgrid">
        <div className="w-full border-solid grid grid-cols-12 gap-6">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className="border-2 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-2 intro-y cursor-pointer zoom-in"
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
            );
          })}
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
          />
        </div>
      </Card>
    </Admin>
  );
}

export default ZakhialgiinKhyanalt;
