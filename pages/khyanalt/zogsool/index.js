import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import {
  Button,
  Card,
  DatePicker,
  message,
  Popconfirm,
  Popover,
  Radio,
  Space,
  Table,
} from "antd";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import useZogsool, { useZogsoolToololt } from "hooks/useZogsool";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import useOrder from "tools/function/useOrder";
import useSWR from "swr";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import useUilchluulegch from "hooks/useUilchluulegch";
import BaganiinSongolt from "../../../components/table/BaganiinSongolt";
import useJagsaalt from "hooks/useJagsaalt";
import {
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  MoreOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";

export function excelTatajAvya(
  token,
  service,
  mur,
  sheet,
  query,
  order,
  sheetName
) {
  message.loading(t("Өгөгдөл боловсруулж байна та түр хүлээнэ үү!"), 100000);
  uilchilgee(token)
    .get(service, {
      params: { query, order, khuudasniiKhemjee: mur, khuudasniiDugaar: 1 },
    })
    .then(({ data }) => {
      console.log("-----------1-------sheetName", sheet);
      // console.log('-----------1-------jagsaalt', data?.jagsaalt);
      const { Excel } = require("antd-table-saveas-excel");
      const excel = new Excel();
      excel
        .addSheet(sheetName)
        .addColumns(sheet)
        .addDataSource(data?.jagsaalt)
        .saveAs(sheetName + ".xlsx");
    })
    .catch(aldaaBarigch)
    .finally(() => message.destroy());
}

function Zogsool({ token }) {
  const { t, i18n } = useTranslation();
  const { baiguullaga, barilgiinId } = useAuth();
  const excelref = useRef(null);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const [turul, setTurul] = useState(undefined);
  const [zogsoolId, setZogsoolId] = useState(undefined);

  const { zogsoolToololt, zogsoolToololtMutate } = useZogsoolToololt(
    token,
    ognoo
  );

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

  const { order, onChangeTable } = useOrder({ check_in_time: -1 });

  const que = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
    };
  }, [baiguullaga?._id]);
  const { jagsaalt } = useJagsaalt("/zogsoolJagsaalt", que, { createdAt: -1 });

  const query = useMemo(() => {
    return {
      "tuukh.tsagiinTuukh.garsanTsag": ognoo
        ? {
            $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
      "tuukh.zogsooliinId": zogsoolId,
    };
  }, [ognoo, zogsoolId]);

  const {
    uilchluulegchGaralt,
    setUilchluulegchKhuudaslalt,
    uilchluulegchMutate,
    isValidating,
  } = useUilchluulegch(token, baiguullaga?._id, query);

  const toololt = useMemo(
    () => [
      {
        name: "Үйлчлүүлэгч",
        too: formatNumber(zogsoolToololt?.find((a) => a._id === null)?.too, 0),
      },
      {
        name: "Түрээслэгч",
        too: formatNumber(
          zogsoolToololt?.find((a) => a._id === "Түрээслэгч")?.too,
          0
        ),
      },
      {
        name: "Гэрээт",
        too: formatNumber(
          zogsoolToololt?.find((a) => a._id === "Гэрээт")?.too,
          0
        ),
      },
      {
        name: "Дотоод",
        too: formatNumber(
          zogsoolToololt?.find((a) => a._id === "Дотоод")?.too,
          0
        ),
      },
      {
        name: "Зөрчилтэй",
        too: formatNumber(
          zogsoolToololt?.find((a) => a._id === "Зөрчилтэй")?.too,
          0
        ),
      },
      {
        name: "Бусад",
        too: formatNumber(
          zogsoolToololt?.find((a) => a._id === "Бусад")?.too,
          0
        ),
      },
    ],
    [zogsoolToololt, uilchluulegchGaralt]
  );
  const zogsoolChange = (e) => {
    setZogsoolId(e.target.value);
  };
  function zurchilNemey(d) {
    console.log("heey", d);
  }

  function onRefresh() {
    zogsoolToololtMutate();
    uilchluulegchMutate();
  }
  /*function mashinOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
        <Button style={{ backgroundColor: "#209669", color: "#ffffff" }}>
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
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
    });
  }*/

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
        title: t("Төлбөр"),
        align: "right",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "tuukh",
        render(v) {
          return v[0]?.tuluv === 0 ? (
            <div>-</div>
          ) : v[0]?.tuluv < 0 ? (
            <div>Үнэгүй</div>
          ) : v[0]?.ebarimtAvsanEsekh ? (
            <div>Төлөгдсөн</div>
          ) : (
            <div>И-Баримт</div>
          );
        },
      },
      {
        title: t("Төлөв"),
        align: "right",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "tuluv",
        render(v) {
          return formatNumber(v);
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
                <div className="flex w-24 flex-col space-y-2">
                  <a
                    className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                    onClick={() => zogsoolBurtegye(data, "zasah")}>
                    <EditOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Зөрчил нэмэх")}</label>
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

  useEffect(() => {
    Aos.init({ once: true });
  });

  const exlCol = () => {
    const aa = columns;
    aa.splice(columns.length - 1, 1);
    return aa;
  };

  return (
    <Admin
      title="Зогсоол"
      khuudasniiNer="zogsool"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setUilchluulegchKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
      tsonkhniiId="61c2c7481c2830c4e6f90ce1"
      loading={isValidating}>
      <Card size="small" className="col-span-12 overflow-auto">
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:p-0 md:gap-6 2xl:grid-cols-12">
          {toololt.map((a, i) => (
            <div
              key={i}
              className={`zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2  border-green-600 sm:col-span-3 xl:col-span-2 2xl:col-span-2 ${
                a.name === turul ? "bg-green-50 dark:bg-gray-900" : ""
              }`}
              onClick={() => setTurul(a.name)}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
              data-aos-delay={1 + i + "00"}>
              <div className="h-full w-[67vw] rounded-xl md:w-auto">
                <div className="rounded-xl p-3">
                  <div className="flex flex-row items-center space-x-2">
                    <div className="text-3xl font-bold text-green-600">
                      {a.too || 0}
                    </div>
                    <div className="text-base text-gray-500">{t(a.name)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="col-span-12">
        <div className="grid-cols-2 gap-5 sm:grid xl:flex">
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="100"
            className="w-full xl:w-1/2">
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              size="middle"
              value={ognoo}
              onChange={setOgnoo}
            />
          </div>
          <div
            className=" flex w-full items-center sm:justify-end md:ml-auto md:mb-0 xl:justify-start"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="200">
            <div className="flex flex-row space-x-2 p-1 font-medium">
              {t("Зогсоолын орлого")} : {formatNumber(zogsooliinMedeelel?.data)}
              ₮
            </div>
          </div>

          {/*<Radio.Group onChange={zogsoolChange} defaultValue={`${jagsaalt[0]?._id}`} buttonStyle="solid">
            <Radio.Button value={undefined}>Бүгд</Radio.Button>
            {
              jagsaalt?.map((zogsool)=>(
                  <Radio.Button value={`${zogsool._id}`}>{zogsool.ner}</Radio.Button>
              ))
            }
          </Radio.Group>*/}
          <div
            className="col-span-2 ml-auto w-full place-content-end justify-between sm:flex xl:justify-end"
            data-aos="zoom-in-left"
            data-aos-duration="1000"
            data-aos-delay="300">
            <Radio.Group
              className="mb-3 w-full sm:mb-0 sm:mr-2 sm:w-auto"
              onChange={zogsoolChange}
              type="primary"
              defaultValue={undefined}
              buttonStyle="solid">
              <Radio.Button className="w-1/3 sm:w-auto" value={undefined}>
                Бүгд
              </Radio.Button>
              {jagsaalt?.map((zogsool) => (
                <Radio.Button
                  className="w-1/3 sm:w-auto  "
                  value={`${zogsool._id}`}
                  type="primary">
                  {zogsool.ner}
                </Radio.Button>
              ))}
            </Radio.Group>
            <Popover
              content={() => (
                <div className="flex w-32 flex-col space-y-2">
                  {/*<a
                          className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                          onClick={mashinOruulakhExcel}
                      >
                        <UploadOutlined style={{ fontSize: "18px" }} />
                        <label>{t("Оруулах")}</label>
                      </a>*/}
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
              placement="bottom"
              trigger="click">
              <Button
                type="primary"
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}>
                <span>Excel</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
          </div>
        </div>
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="400"
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
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Zogsool;
