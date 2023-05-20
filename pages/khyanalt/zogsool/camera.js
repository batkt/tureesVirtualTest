import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Popover,
  Space,
  Table,
  Radio,
  Modal,
  TreeSelect,
  message,
  Tooltip,
  Drawer,
} from "antd";
import {
  StarOutlined,
  CameraOutlined,
  WalletOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  PaperClipOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  DownOutlined,
  EyeOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import useOrder from "tools/function/useOrder";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import useUilchluulegch from "../../../hooks/useUilchluulegch";
import useJagsaalt from "../../../hooks/useJagsaalt";
import { modal } from "../../../components/ant/Modal";
import Tulbur from "../../../components/pageComponents/togloomiinTuv/Tulbur";
import _ from "lodash";
import updateMethod from "../../../tools/function/crud/updateMethod";
import { excelTatajAvya } from "./index";

function generateChild(mur) {
  if (mur?.length > 0)
    return mur?.map((a) => ({
      value: !!a?.ner ? a.ner : a.cameraIP,
      title: !!a?.ner ? (
        a.ner
      ) : (
        <b className="text-green-400 hover:text-green-800">
          Камер-{a.cameraIP}
        </b>
      ),
      children: generateChild(!!a?.khaalga ? a.khaalga : a.camera),
    }));
  return [];
}

/**
 * Эхний байдлаар зөвхөн 1 зогсоол дээр төлбөр тооцхоор шийдлээ
 * дотороо зогсоолтой тохиолдолд өөрчилнө
 * */

function camera({ token }) {
  const { t, i18n } = useTranslation();
  const { baiguullaga, ajiltan, barilgiinId } = useAuth();
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const [turul, setTurul] = useState(undefined);
  const [songosonMashin, setSongosonMashin] = useState(undefined);
  const tulburRef = React.useRef(null);
  const { order, onChangeTable } = useOrder({ garsanTsag: -1 });
  const [modalOpen, setModalOpen] = useState({
    bool: false,
    item: null,
    type: "",
  });
  const [value, setValue] = useState(null);
  const [camerVal, setCamerVal] = useState(null);
  const [cameraData, setCameraData] = useState(null);
  const [cameraKharakh, setCamerKharakh] = useState(false);
  const [guilgeeKharakh, setGuilgeeKharakh] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
      "khaalga.ajiltnuud.id": ajiltan?._id,
    };
  }, [baiguullaga?._id, ajiltan]);
  const { jagsaalt } = useJagsaalt("/zogsoolJagsaalt", que);

  const query = useMemo(() => {
    if (jagsaalt?.length > 0)
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
  const {
    uilchluulegchGaralt,
    setUilchluulegchKhuudaslalt,
    uilchluulegchMutate,
    isValidating,
  } = useUilchluulegch(token, baiguullaga?._id, query);
  // console.log('jagsaalt---------', jagsaalt);
  function onRefresh() {
    uilchluulegchMutate();
  }
  useEffect(() => {
    Aos.init({ once: true });
  });

  useEffect(() => {
    const aa = generateChild(jagsaalt);
    setCameraData(aa);
  }, [jagsaalt]);

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
          const diff = d2.diff(d1, "minutes");
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
        title: t("Хэлбэр"),
        align: "center",
        dataIndex: "tuukh",
        width: "7rem",
        showSorterTooltip: false,
        render: (v) => {
          return v && <div>{t(`${v[0]?.tulburTulsunKhelber}`)}</div>;
        },
      },
      {
        title: t("Төлөв"),
        align: "center",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "tuukh",
        render(v, parent) {
          // v[0].tuluv === 0 ?
          return v[0]?.tuluv === 0 ? (
            <Popover
              placement="bottom"
              trigger="hover"
              content={() => (
                <div className="flex w-24 flex-col space-y-2">
                  <a
                    className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                    onClick={() => tulburTulyu(v[0])}>
                    <WalletOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Төлөх")}</label>
                  </a>
                  <a
                    className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                    onClick={() =>
                      setModalOpen({ bool: true, item: parent, type: "unegui" })
                    }>
                    <StarOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Үнэгүй")}</label>
                  </a>
                </div>
              )}>
              <Button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FF8505",
                }}
                size="small">
                <div className="flex items-center  justify-center space-x-2 text-white">
                  <div className="flex items-center justify-center">
                    <DollarCircleOutlined />
                  </div>
                  <div className="flex items-center justify-center">
                    {t("Төлбөр")}
                  </div>
                </div>
              </Button>
            </Popover>
          ) : v[0]?.tuluv < 0 ? (
            <Tooltip
              placement="top"
              title={v[0]?.tuluv === -1 ? v[0]?.uneguiGarsan : parent.zurchil}>
              <div className="mx-auto flex w-max cursor-pointer items-center justify-center space-x-2 rounded bg-gray-500 px-3 text-white">
                <div className="flex items-center justify-center">
                  <CheckCircleOutlined />
                </div>
                <div className="flex items-center justify-center">
                  {t("Үнэгүй")}
                </div>
              </div>
            </Tooltip>
          ) : v[0]?.ebarimtAvsanEsekh ? (
            <div className="flex items-center  justify-center space-x-2 text-white">
              <div className="flex items-center justify-center">
                <CheckCircleOutlined />
              </div>
              <div className="flex items-center justify-center">
                {t("Төлөгдсөн")}
              </div>
            </div>
          ) : (
            <Button
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#253985",
              }}
              size="small"
              onClick={() => tulburTulyu(v[0])}>
              <div className="flex items-center  justify-center space-x-2 text-white ">
                <div className="flex items-center justify-center">
                  <PaperClipOutlined />
                </div>
                <div className="flex items-center justify-center">
                  {t("И-Баримт")}
                </div>
              </div>
            </Button>
          );
        },
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
                    onClick={() =>
                      setModalOpen({ bool: true, item: data, type: "zurchil" })
                    }>
                    <ExclamationCircleOutlined
                      style={{ fontSize: "18px", marginRight: "3px" }}
                    />
                    <div>{t("Зөрчил нэмэх")}</div>
                  </a>
                </div>
              )}>
              <a className=" flex items-center justify-center  hover:scale-150 dark:hover:bg-gray-700">
                <MoreOutlined style={{ fontSize: "18px" }} />
              </a>
            </Popover>
          </div>
        ),
      },
    ];
  }, [turul, i18n.language]);

  const dataSource = [
    {
      key: "1",
      ognoo: "2023-05-11 09:37",
      utga: "Гүйлгээний утга",
      dun: 4500,
    },
    {
      key: "2",
      ognoo: "2023-05-11 09:37",
      utga: "ХаанБанк",
      dun: 3000,
    },
    {
      key: "3",
      ognoo: "2023-05-11 09:37",
      utga: "ХасБанк",
      dun: 1500,
    },
    {
      key: "4",
      ognoo: "2023-05-11 09:37",
      utga: "Бэлэн",
      dun: 5500,
    },
    {
      key: "5",
      ognoo: "2023-05-11 09:37",
      utga: "ХаанБанк",
      dun: 2000,
    },
    {
      key: "6",
      ognoo: "2023-05-11 09:37",
      utga: "ХаанБанк",
      dun: 3000,
    },
    {
      key: "7",
      ognoo: "2023-05-11 09:37",
      utga: "ХаанБанк",
      dun: 3000,
    },
    {
      key: "8",
      ognoo: "2023-05-11 09:37",
      utga: "ХасБанк",
      dun: 1500,
    },
    {
      key: "9",
      ognoo: "2023-05-11 09:37",
      utga: "Бэлэн",
      dun: 5500,
    },
  ];

  const baganuud = [
    {
      title: "№",
      width: "2.5rem",
      align: "center",
      dataIndex: "key",
      key: "dugaar",
    },
    {
      title: "Огноо",
      width: "8rem",
      dataIndex: "ognoo",
      key: "ognoo",
    },
    {
      title: "Утга",
      width: "8rem",
      dataIndex: "utga",
      key: "utga",
    },
    {
      title: "Дүн",
      width: "4rem",
      dataIndex: "dun",
      align: "right",
      key: "dun",
      render(v) {
        return v && formatNumber(v, 0);
      },
    },
  ];
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const cameraChange = (e) => {
    setCamerVal(e);
  };
  const khadgalakh = () => {
    let body = modalOpen.item;
    if (modalOpen.type === "zurchil") {
      body.zurchil = value;
      body.tuukh[0].tuluv = -2;
    } else {
      body.tuukh[0].uneguiGarsan = value;
      body.tuukh[0].tuluv = -1;
    }
    updateMethod("zogsoolUilchluulegch", token, body).then(({ data }) => {
      if (data === "Amjilttai") {
        message.success(t("Амжилттай хадгаллаа"));
        onRefresh();
      }
    });
    setModalOpen({ bool: false, item: null, type: "" });
    setValue(null);
  };
  const exlCol = () => {
    const aa = columns;
    aa.splice(columns.length - 2, 2, {
      title: t("Төлөв"),
      sorter: () => 0,
      dataIndex: "tuukh",
      render(v) {
        return v[0]?.tuluv === 0 ? (
          <div>Төлөөгүй</div>
        ) : v[0]?.tuluv < 0 ? (
          <div>Үнэгүй</div>
        ) : v[0]?.ebarimtAvsanEsekh ? (
          <div>Төлөгдсөн</div>
        ) : (
          <div>И-Баримт</div>
        );
      },
    });
    return aa;
  };

  function tulburTulyu(data) {
    modal({
      title: (
        <div className="flex w-full flex-row justify-between">
          <div>{t("Тооцоо хийх")}</div>
          <div className="flex items-center">
            {data?.ovog?.charAt(0)}.{data?.ner}
            <div
              className="ml-5 text-xl hover:text-red-400"
              onClick={() => tulburRef.current.khaaya()}>
              <CloseCircleOutlined />
            </div>
          </div>
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

  return (
    <Admin
      title="Камер"
      tsonkhniiId={"64474e3e28c37d7cdda15d01"}
      khuudasniiNer="Camera"
      fixedZagvarNeegdsenEsekh={guilgeeKharakh}
      setTurulZagvar={setGuilgeeKharakh}
      className="relative p-2 sm:p-4"
      onSearch={(search) =>
        setUilchluulegchKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
      loading={isValidating}>
      {jagsaalt?.length > 0 ? (
        <div className="col-span-12">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            <div
              onClick={() => {
                setCamerKharakh(false);
              }}
              className={`w-full ${
                cameraKharakh === 1 &&
                "fixed top-0 right-0 z-50 flex h-screen w-screen items-center justify-center rounded-md bg-black bg-opacity-80 p-2 md:py-[10%]"
              }`}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setCamerKharakh(1);
                }}
                className="flex w-full items-center justify-center ">
                <img
                  src={`https://i.pinimg.com/originals/a4/4e/49/a44e4947dc1057f222dbe705b04570a3.jpg`}
                  className={`object-cover  ${
                    cameraKharakh === 1
                      ? "w-full  sm:h-[80vh] sm:w-[80%]"
                      : "w-full  sm:h-[250px]"
                  }`}
                />
              </div>
              {cameraKharakh === 1 && (
                <div className="absolute top-5 right-5 text-3xl text-white">
                  <CloseOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      setCamerKharakh(false);
                    }}
                  />
                </div>
              )}
              <div
                className={`mt-3 flex flex-col justify-between gap-3 sm:flex-row ${
                  cameraKharakh === 1 && "absolute bottom-5 w-40"
                }`}>
                <div className="flex gap-3">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full sm:w-auto"
                    type="primary">
                    Нээх
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full sm:w-auto"
                    type="primary">
                    Хаах
                  </Button>
                </div>
                <TreeSelect
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  placement={cameraKharakh === 1 ? "topRight" : "bottomLeft"}
                  showSearch
                  style={{
                    backgroundColor: "#10B981",
                    borderColor: "#10B981",
                  }}
                  value={camerVal}
                  dropdownStyle={{
                    maxHeight: 600,
                    minWidth: 280,
                    overflow: "auto",
                  }}
                  placeholder="Камер сонгох"
                  allowClear
                  onChange={cameraChange}
                  treeData={cameraData}
                />
              </div>
            </div>
            <div
              onClick={() => {
                setCamerKharakh(false);
              }}
              className={`w-full ${
                cameraKharakh === 2 &&
                "fixed top-0 right-0 z-50 flex h-screen w-screen items-center justify-center rounded-md bg-black bg-opacity-80 p-2"
              }`}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setCamerKharakh(2);
                }}
                className="flex w-full items-center justify-center ">
                <img
                  src={`https://i.pinimg.com/originals/a4/4e/49/a44e4947dc1057f222dbe705b04570a3.jpg`}
                  className={`object-cover  ${
                    cameraKharakh === 2
                      ? "w-full  sm:h-[80vh] sm:w-[80%]"
                      : "w-full  sm:h-[250px]"
                  }`}
                />
              </div>
              {cameraKharakh === 2 && (
                <div className="absolute top-5 right-5 text-3xl text-white">
                  <CloseOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      setCamerKharakh(false);
                    }}
                  />
                </div>
              )}
              <div
                className={`mt-3 flex flex-col justify-between gap-3 sm:flex-row ${
                  cameraKharakh === 2 && "absolute bottom-5 w-40"
                }`}>
                <div className="flex gap-3">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full sm:w-auto"
                    type="primary">
                    Нээх
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full sm:w-auto"
                    type="primary">
                    Хаах
                  </Button>
                </div>
                <TreeSelect
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  placement={cameraKharakh === 2 ? "topRight" : "bottomRight"}
                  showSearch
                  style={{
                    backgroundColor: "#10B981",
                    borderColor: "#10B981",
                  }}
                  value={camerVal}
                  dropdownStyle={{
                    maxHeight: 600,
                    minWidth: 280,
                    overflow: "auto",
                  }}
                  placeholder="Камер сонгох"
                  allowClear
                  onChange={cameraChange}
                  treeData={cameraData}
                />
              </div>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`fixed right-[8%] top-1/2 z-50 w-[84%] -translate-y-1/2 rounded-lg border bg-white p-5 shadow-xl transition-all xl:relative xl:right-0 xl:z-0 xl:w-auto xl:border-none xl:bg-transparent xl:p-0 xl:shadow-none ${
                guilgeeKharakh === false ? "scale-0 xl:scale-100" : "scale-100"
              }`}>
              {" "}
              <div className="text-base font-bold">Сүүлийн гүйлгээ</div>
              <div className="absolute top-3 right-3 text-3xl xl:hidden">
                <CloseCircleOutlined
                  onClick={() => setGuilgeeKharakh(false)}
                  className="text-red-400"
                />
              </div>
              <Table
                pagination={false}
                className="mt-3 overflow-auto"
                scroll={{ y: "calc(100vh / 3.5)" }}
                size="small"
                dataSource={dataSource}
                columns={baganuud}
              />
            </div>
          </div>
          <Card className="col-span-12 mt-2">
            <div className="mb-5 xl:hidden">
              <Button
                style={{ width: "100%" }}
                icon={<EyeOutlined />}
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setGuilgeeKharakh(!guilgeeKharakh);
                }}>
                Гүйлгээ харах
              </Button>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <div
                data-aos="fade-right"
                data-aos-duration="1000"
                className="flex w-full flex-col lg:flex-row"
                data-aos-delay="100">
                <DatePicker.RangePicker
                  inputReadOnly
                  className="w-full md:w-auto"
                  size="middle"
                  value={ognoo}
                  onChange={setOgnoo}
                />
                <div className="flex space-x-2 p-1 pt-2 text-base font-medium">
                  {t("Зогсоолын орлого")} :{" "}
                  {
                    formatNumber(
                      356700
                    ) /*{formatNumber(zogsooliinMedeelel?.data)}*/
                  }
                  ₮
                </div>
              </div>
              <div
                className="mb-5 flex w-full justify-between sm:justify-end md:ml-auto md:mb-0 lg:w-auto"
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-delay="300">
                <Popover
                  content={() => (
                    <div className="flex w-32 flex-col">
                      <a
                        className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                        onClick={() => {
                          excelTatajAvya(
                            token,
                            "zogsoolUilchluulegch",
                            uilchluulegchGaralt.niitMur,
                            exlCol(),
                            query,
                            order,
                            "Зогсоол"
                          );
                        }}>
                        <DownloadOutlined style={{ fontSize: "18px" }} />
                        <label>{t("Татах")}</label>
                      </a>
                    </div>
                  )}
                  style={{ padding: 0 }}
                  placement="bottom"
                  trigger="click">
                  <Button
                    type="primary"
                    className="mr-3 w-32 sm:w-auto"
                    icon={<FileExcelOutlined />}>
                    <span>Excel</span>
                    <DownOutlined width={5} />
                  </Button>
                </Popover>
                <Button
                  className="w-32 sm:w-auto"
                  icon={<CameraOutlined />}
                  onClick={() => setDrawerOpen(true)}
                  type="primary">
                  Камер
                </Button>
                <Drawer
                  width={"100vw"}
                  title={t("Камер")}
                  placement="right"
                  onClose={() => setDrawerOpen(false)}
                  visible={drawerOpen}>
                  {drawerOpen && (
                    <Card className="col-span-12 row-span-full lg:col-span-4 lg:col-start-9">
                      <div className="w-[500px]">
                        <div className="flex aspect-square items-center justify-center border 2xl:aspect-[3/2]">
                          <p>Camera1</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2">
                          <div className="aspect-square border">
                            <p>Camera2</p>
                          </div>
                          <div className="aspect-square border">
                            <p>Camera3</p>
                          </div>
                          <div className="aspect-square border">
                            <p>Camera4</p>
                          </div>
                          <div className="aspect-square border">
                            <p>Camera5</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </Drawer>
              </div>
            </div>
            <div
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="300"
              data-aos-anchor-placement="top-bottom">
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
          <Modal
            title={
              modalOpen.type !== "zurchil"
                ? "Үнэгүй үйлчлүүлэгчийн төрөл сонгох"
                : "Зөрчил оруулах"
            }
            open={modalOpen.bool}
            onCancel={() => setModalOpen({ bool: false, item: null, type: "" })}
            footer={[
              <Button
                key="back"
                onClick={() =>
                  setModalOpen({ bool: false, item: null, type: "" })
                }>
                Хаах
              </Button>,
              <Button type="primary" onClick={khadgalakh}>
                Хадгалах
              </Button>,
            ]}>
            <Space direction="vertical" className="w-full">
              <Radio.Group onChange={onChange} value={value}>
                {modalOpen.type !== "zurchil" ? (
                  <Space direction="vertical">
                    <Radio value="Цагдаа">Цагдаа</Radio>
                    <Radio value="Гал">Гал</Radio>
                    <Radio value="Эмнэлэг">Эмнэлэг</Radio>
                    <Radio value="Онцгой">Онцгой</Radio>
                    <Radio value="Борлуулалтын машин">Борлуулалтын машин</Radio>
                    <Radio value="Хөгжлийн бэрхшээлтэй иргэн">
                      Хөгжлийн бэрхшээлтэй иргэн
                    </Radio>
                    <Radio value="Хогны машин">Хогны машин</Radio>
                  </Space>
                ) : (
                  <Space direction="vertical">
                    <Radio value="Журам зөрчсөн">Журам зөрчсөн</Radio>
                    <Radio value="Зугтаасан">Зугтаасан</Radio>
                  </Space>
                )}
              </Radio.Group>
              <div className="flex w-full items-center">
                <label>Бусад</label>
                <Input onChange={onChange} className="ml-[10px] w-full" />
              </div>
            </Space>
          </Modal>
        </div>
      ) : (
        <div className="col-span-12 flex justify-center">
          {ajiltan?.ner}-д зогсоолын эрх байхгүй байна.
        </div>
      )}
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
