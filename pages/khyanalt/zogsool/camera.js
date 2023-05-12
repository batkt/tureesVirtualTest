import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import {Button, Card, DatePicker, Input, Popover, Space, Table, Radio, Modal, TreeSelect} from "antd";
import {
  DownOutlined,
  StarOutlined,
  CameraOutlined,
  UpOutlined,
  CarOutlined,
  WalletOutlined,
  SettingOutlined,
    ExclamationCircleOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  PaperClipOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import useZogsool, { useZogsoolToololt } from "hooks/useZogsool";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import useOrder from "tools/function/useOrder";
import useSWR from "swr";
import uilchilgee, {aldaaBarigch, url} from "services/uilchilgee";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import useUilchluulegch from "../../../hooks/useUilchluulegch";
import useJagsaalt from "../../../hooks/useJagsaalt";
import {modal} from "../../../components/ant/Modal";
import Tulbur from "../../../components/pageComponents/togloomiinTuv/Tulbur";
import _ from "lodash";

function camera({ token }) {
  const { t, i18n } = useTranslation()
  const { baiguullaga, ajiltan, barilgiinId } = useAuth();
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const [turul, setTurul] = useState(undefined);
  const [songosonMashin, setSongosonMashin] = useState(undefined);
  const tulburRef = React.useRef(null)
  const { order, onChangeTable } = useOrder({ garsanTsag: -1 });
  const [modalOpen, setModalOpen] = useState({bool:false,item:null,type: ""});
  const [value, setValue] = useState(null);
  let treesData = [] ;

  /*
    const zogsooliinMedeelel = useSWR(
        ["/zogsooliinDunAvya", token, ognoo],
        (url, token, ognoo) =>
            uilchilgee(token)
                .post(url, {
                  ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
                  duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
                })
                .then((a) => a.data)
                .catch(aldaaBarigch)
    );
  */

  const que = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      "khaalga.ajiltnuud.id": ajiltan?._id
    };
  }, [baiguullaga?._id, ajiltan]);
  const {jagsaalt} = useJagsaalt("/zogsoolJagsaalt", que);

  const query = useMemo(() => {
    if(jagsaalt?.length > 0)
    //зогсоолын id.р хайдаг болгох
      return {
        "tuukh.tsagiinTuukh.garsanTsag": ognoo
            ? {
              $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
              $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
            }
            : undefined,
        // "tuukh.zogsooliinId": !!zogsoolId ? zogsoolId : jagsaalt[0]?._id,
        // turul: turul === "Үйлчлүүлэгч" ? null : turul,
      };
  }, [ognoo, jagsaalt]);
  const { uilchluulegchGaralt, setUilchluulegchKhuudaslalt, uilchluulegchMutate, isValidating } = useUilchluulegch(token, baiguullaga?._id, query);
  // console.log('jagsaalt---------', jagsaalt);
  useEffect(() => {
    Aos.init({ once: true });
  });
  useEffect(() => {
    jagsaalt?.map(mur=>{
      mur?.khaalga?.map(a=>{
        a?.camera?.map(b=>{

        })
      })
    })
  },[jagsaalt]);

  function onRefresh() {
    uilchluulegchMutate();
    // zogsoolMutate();
  }

  const treeData = [
    {
      value: 'parent 1',
      title: 'parent 1',
      children: [
        {
          value: 'parent 1-0',
          title: 'parent 1-0',
          children: [
            {
              value: 'leaf1',
              title: 'leaf1',
            },
            {
              value: 'leaf2',
              title: 'leaf2',
            },
          ],
        },
        {
          value: 'parent 1-1',
          title: 'parent 1-1',
          children: [
            {
              value: 'leaf3',
              title: (
                  <b
                      style={{
                        color: '#08c',
                      }}
                  >
                    leaf3
                  </b>
              ),
            },
          ],
        },
      ],
    },
  ];
  const columns = useMemo(() => {
    const col = [
      {
        title: "№",
        align: "center",
        dataIndex: "dugaar",
        width: "2rem",
        render: (text, record, index) =>
            (uilchluulegchGaralt?.khuudasniiDugaar || 0) *
            (uilchluulegchGaralt?.khuudasniiKhemjee || 0) -
            (uilchluulegchGaralt?.khuudasniiKhemjee || 0) +
            index +
            1,
      },
      {
        title: t("Дугаар"),
        align: "center",
        width: "10rem",
        dataIndex: "mashiniiDugaar",
        showSorterTooltip: false,
        sorter: () => 0,
      },
    ];
    return [
      ...col,
      {
        title: t("Орсон"),
        align: "center",
        width: "10rem",
        dataIndex: "tuukh",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          const d = v[0]?.tsagiinTuukh[0]?.orsonTsag;
          return d && moment(d).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Гарсан"),
        align: "center",
        width: "10rem",
        dataIndex: "tuukh",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          const d = v[0]?.tsagiinTuukh[0]?.garsanTsag;
          return d && moment(d).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Хугацаа/мин"),
        align: "center",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "tuukh",
        render(v) {
          const d1 = moment(v[0]?.tsagiinTuukh[0]?.orsonTsag);
          const d2 = moment(v[0]?.tsagiinTuukh[0]?.garsanTsag);
          const diff = d2.diff(d1, 'minutes');
          return diff && diff;
        },
      },
      {
        title: t("Төрөл"),
        align: "center",
        width: "10rem",
        dataIndex: "turul",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Дүн"),
        align: "right",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "tuukh",
        render(v) {
          return v && formatNumber(v[0]?.tulukhDun, 0);
        },
      },
      {
        title: t("Төлөв"),
        align: "center",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "tuukh",
        render(v) {
          // v[0].tuluv === 0 ?
          return (
              v[0]?.tuluv === 0 ?
                  <Popover
                      placement="bottom"
                      trigger="hover"
                      content={() => (
                          <div className="flex w-24 flex-col space-y-2">
                            <a
                                className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                                onClick={() => tulburTulyu(v[0])}
                            >
                              <WalletOutlined style={{ fontSize: "18px" }} />
                              <label>{t("Төлөх")}</label>
                            </a>
                            <a
                                className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                                onClick={() => setModalOpen({bool:true,item:v[0], type: "unegui"})}
                            >
                              <StarOutlined style={{ fontSize: "18px" }} />
                              <label>{t("Үнэгүй")}</label>
                            </a>
                          </div>
                      )}
                  >
                    <Button
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#FF8505",
                        }}
                        size="small"
                    >
                      <div className="text-white flex  justify-center items-center space-x-2">
                        <div className="flex justify-center items-center">
                          <DollarCircleOutlined />
                        </div>
                        <div className="flex justify-center items-center">
                          {t("Төлбөр")}
                        </div>
                      </div>
                    </Button>
                  </Popover>
                  :
                  v[0]?.ebarimtAvsanEsekh ?
                      <div className="text-white flex  justify-center items-center space-x-2">
                        <div className="flex justify-center items-center">
                          <CheckCircleOutlined />
                        </div>
                        <div className="flex justify-center items-center">
                          {t("Төлөгдсөн")}
                        </div>
                      </div>
                      :
                      <Button
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#253985",
                          }}
                          size="small"
                          onClick={() => tulburTulyu(v[0])}
                      >
                        <div className="text-white flex  justify-center items-center space-x-2 ">
                          <div className="flex justify-center items-center">
                            <PaperClipOutlined />
                          </div>
                          <div className="flex justify-center items-center">
                            {t("И-Баримт")}
                          </div>
                        </div>
                      </Button>
          );
        }
      },
      {
        title: () => <SettingOutlined />,
        width: "2rem",
        align: "center",
        render: (data) => (
            <div className="flex flex-row">
              <Popover
                  placement="bottom"
                  trigger="hover"
                  content={() => (
                      <div className="space-y-2">
                        <a
                            className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                            onClick={() => setModalOpen({bool: true, item: data, type:'zurchil'})}
                        >
                          <ExclamationCircleOutlined style={{ fontSize: "18px", marginRight: "3px"}} />
                          <div>{t("Зөрчил нэмэх")}</div>
                        </a>
                      </div>
                  )}
              >
                <a className=" flex items-center justify-center  hover:scale-150 dark:hover:bg-gray-700">
                  <MoreOutlined style={{ fontSize: "18px" }} />
                </a>
              </Popover>
            </div>
        ),
      },
    ];
  }, [turul, i18n.language]);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const khadgalakh = () => {


    // console.log('radio checked', value, ' ----- ', modalOpen);
    setModalOpen({bool: false, item: null, type: ''});
    setValue(null);
  }

  function tulburTulyu(data) {
    modal({
      title: (
          <div className="w-full flex flex-row justify-between">
            <div>{t("Тооцоо хийх")}</div>
            <div className="flex items-center">{data?.ovog?.charAt(0)}.{data?.ner}
              <div className="text-xl ml-5 hover:text-red-400" onClick={() => tulburRef.current.khaaya()}><CloseCircleOutlined /></div></div>
          </div>
      ),
      content: (
          <Tulbur
              ref={tulburRef}
              data={_.cloneDeep(data)}
              token={token}
              baiguullaga={baiguullaga}
              barilgiinId={barilgiinId}
              ajiltan={ajiltan}
              onRefresh={onRefresh}
          />
      ),
      footer: false,
    });
  }

  const dataSource = [
    {
      key: '1',
      ognoo: '2023-05-11 09:37',
      utga: 'Гүйлгээний утга',
      dun: 4500,
    },
    {
      key: '2',
      ognoo: '2023-05-11 09:37',
      utga: 'ХаанБанк',
      dun: 3000,
    },
    {
      key: '3',
      ognoo: '2023-05-11 09:37',
      utga: 'ХасБанк',
      dun: 1500,
    },
    {
      key: '4',
      ognoo: '2023-05-11 09:37',
      utga: 'Бэлэн',
      dun: 5500,
    },{
      key: '5',
      ognoo: '2023-05-11 09:37',
      utga: 'ХаанБанк',
      dun: 2000,
    },
    {
      key: '6',
      ognoo: '2023-05-11 09:37',
      utga: 'ХаанБанк',
      dun: 3000,
    },
    {
      key: '7',
      ognoo: '2023-05-11 09:37',
      utga: 'ХаанБанк',
      dun: 3000,
    },
    {
      key: '8',
      ognoo: '2023-05-11 09:37',
      utga: 'ХасБанк',
      dun: 1500,
    },
    {
      key: '9',
      ognoo: '2023-05-11 09:37',
      utga: 'Бэлэн',
      dun: 5500,
    },
  ];

  const baganuud = [
    {
      title: '№',
      dataIndex: 'key',
      key: 'dugaar',
    },
    {
      title: 'Огноо',
      dataIndex: 'ognoo',
      key: 'ognoo',
    },
    {
      title: 'Гүлгээний утга',
      dataIndex: 'utga',
      key: 'utga',
    },
    {
      title: 'Дүн',
      dataIndex: 'dun',
      align: "right",
      key: 'dun',
      render(v){
        return v && formatNumber(v, 0);
      }
    },
  ];

  return (
      <Admin
          title="Камер"
          tsonkhniiId={"64474e3e28c37d7cdda15d01"}
          khuudasniiNer="Camera"
          className="p-0 md:p-4"
          onSearch={(search) =>
              setUilchluulegchKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
          }
          loading={isValidating}
      >
        { jagsaalt?.length > 0 ?
            <div className="col-span-12">
              <div className="grid grid-cols-3 gap-4 h-[300px]">
                <div className="w-full">
                  <div className="flex justify-center items-center w-full ">
                    <img src={`https://i.pinimg.com/originals/a4/4e/49/a44e4947dc1057f222dbe705b04570a3.jpg`} className="w-full object-cover h-[250px]" />
                  </div>
                  <div className="mt-3 flex justify-between">
                    <div>
                      <Button className="mr-3" type="primary">Нээх</Button>
                      <Button className="mr-3" type="primary">Хаах</Button>
                    </div>
                    {/*<TreeSelect
                        showSearch
                        style={{
                          backgroundColor: '#10B981',
                          borderColor: '#10B981',
                        }}
                        value={value}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: 'auto',
                        }}
                        placeholder="Камер сонгох"
                        allowClear
                        treeDefaultExpandAll
                        onChange={onChange}
                        treeData={treeData}
                    />*/}
                    <Button className="box-border" type="primary">Камер сонгох<DownOutlined className="max-h-[32px]"/></Button>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex justify-center items-center w-full ">
                    <img src={`https://i.pinimg.com/originals/a4/4e/49/a44e4947dc1057f222dbe705b04570a3.jpg`} className="w-full object-cover h-[250px]" />
                  </div>
                  <div className="mt-3 flex justify-between">
                    <div>
                      <Button className="mr-3" type="primary">Нээх</Button>
                      <Button className="mr-3" type="primary">Хаах</Button>
                    </div>
                    <Button className="box-border" type="primary">Камер сонгох<DownOutlined className="max-h-[32px]"/></Button>
                  </div>
                </div>
                <div> <div className="font-bold text-base">Сүүлийн гүйлгээ</div>
                  <Table
                      className="mt-3 hidden overflow-auto md:block"
                      tableLayout="auto"
                      scroll={{ y: "calc(100vh / 3.5)" }}
                      size="small"
                      dataSource={dataSource} columns={baganuud} />
                </div>
              </div>
              <Card className="col-span-12">
                <div className="flex gap-5 flex-col md:flex-row">
                  <div
                      data-aos="fade-right"
                      data-aos-duration="1000"
                      data-aos-delay="100"
                  >
                    <DatePicker.RangePicker
                        className="w-full md:w-auto"
                        size="middle"
                        value={ognoo}
                        onChange={setOgnoo}
                    />
                  </div>
                  <div
                      className="md:ml-auto mb-5 md:mb-0 w-full justify-between flex items-center"
                      data-aos="fade-left"
                      data-aos-duration="1000"
                      data-aos-delay="300"
                  >
                    <div className="flex text-xs md:text-base flex-row space-x-2 p-1 font-medium">
                      {t("Зогсоолын орлого")} : {formatNumber(356700)/*{formatNumber(zogsooliinMedeelel?.data)}*/}₮
                    </div>
                    <Button icon={<CameraOutlined />} type="primary">Камер</Button>
                  </div>
                </div>
                <div
                    data-aos="fade-left"
                    data-aos-duration="1000"
                    data-aos-delay="300"
                    data-aos-anchor-placement="top-bottom"
                >
                  <Table
                      className="mt-8 hidden overflow-auto md:block"
                      tableLayout="auto"
                      loading={!uilchluulegchGaralt}
                      dataSource={uilchluulegchGaralt?.jagsaalt}
                      scroll={{ y: "calc(100vh - 30rem)" }}
                      size="small"
                      bordered
                      rowKey={(row) => row._id}
                      columns={columns}
                      onChange={onChangeTable}
                      pagination={{
                        current: uilchluulegchGaralt?.khuudasniiDugaar,
                        pageSize: uilchluulegchGaralt?.khuudasniiKhemjee,
                        total: uilchluulegchGaralt?.niitMur,
                        showSizeChanger: true,
                        onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                            setUilchluulegchKhuudaslalt((kh) => ({
                              ...kh,
                              khuudasniiDugaar,
                              khuudasniiKhemjee,
                            })),
                      }}
                  />
                  <CardList
                      cardListTuluv={"utas"}
                      keyValue="uilchluulegch"
                      className="block overflow-auto md:hidden"
                      jagsaalt={uilchluulegchGaralt?.jagsaalt}
                      Component={UilchluulegchTile}
                  />
                </div>
              </Card>
              <Modal title={modalOpen.type !== "zurchil" ? "Үнэгүй үйлчлүүлэгчийн төрөл сонгох" : "Зөрчил оруулах"}
                     open={modalOpen.bool}
                     onCancel={()=>setModalOpen({bool:false,item:null, type: ''})}
                     footer={[
                       <Button key="back" onClick={()=>setModalOpen({bool:false,item:null, type: ''})}>
                         Хаах
                       </Button>,
                       <Button type="primary" onClick={khadgalakh}>
                         Хадгалах
                       </Button>,
                     ]}
              >
                <Space direction="vertical" className="w-full">
                  <Radio.Group onChange={onChange} value={value}>
                    {
                      modalOpen.type !== 'zurchil' ?
                          <Space direction="vertical">
                            <Radio value="Цагдаа">Цагдаа</Radio>
                            <Radio value="Гал">Гал</Radio>
                            <Radio value="Эмнэлэг">Эмнэлэг</Radio>
                            <Radio value="Онцгой">Онцгой</Radio>
                            <Radio value="Борлуулалтын машин">Борлуулалтын машин</Radio>
                            <Radio value="Хөгжлийн бэрхшээлтэй иргэн">Хөгжлийн бэрхшээлтэй иргэн</Radio>
                            <Radio value="Хогны машин">Хогны машин</Radio>
                          </Space>
                          :
                          <Space direction="vertical">
                            <Radio value="Журам зөрчсөн">Журам зөрчсөн</Radio>
                            <Radio value="Зугтаасан">Зугтаасан</Radio>
                          </Space>
                    }
                  </Radio.Group>
                  <div className="flex w-full items-center">
                    <label>Бусад</label>
                    <Input onChange={onChange} className="w-full ml-[10px]" />
                  </div>
                </Space>
              </Modal>
            </div>
            :
            <div className='col-span-12 flex justify-center'>
              {ajiltan?.ner}-д зогсоолын эрх байхгүй байна.
            </div>
        }
      </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default camera;

/*<Card className="row-span-full col-span-12 lg:col-span-4 lg:col-start-9">
          <div className="w-full">
            <div className="border 2xl:aspect-[3/2] aspect-square flex justify-center items-center"><p>Camera1</p></div>
            <div className="grid 2xl:grid-cols-2 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-2 grid-cols-1">
              <div className="border aspect-square"><p>Camera2</p></div>
              <div className="border aspect-square"><p>Camera3</p></div>
              <div className="border aspect-square"><p>Camera4</p></div>
              <div className="border aspect-square"><p>Camera5</p></div>
            </div>
          </div>
        </Card>
        */
