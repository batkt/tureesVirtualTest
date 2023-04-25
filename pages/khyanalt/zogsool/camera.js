import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import { Button, Card, DatePicker, message, Popover, Space, Table, Carousel } from "antd";
import {
  DownloadOutlined,
  DownOutlined,
  FileExcelOutlined,
  LeftOutlined,
  RightOutlined,
  UploadOutlined,
  UpOutlined,
  WalletOutlined
} from "@ant-design/icons";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import useZogsool, { useZogsoolToololt } from "hooks/useZogsool";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh";
import { modal } from "components/ant/Modal";
import _ from "lodash";
import useOrder from "tools/function/useOrder";
import useSWR from "swr";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

export function excelTatajAvya(token, service, mur, sheet, query, order, sheetName) {
  message.loading(t("Өгөгдөл боловсруулж байна та түр хүлээнэ!"), 100000);
  uilchilgee(token)
    .get(service, {
      params: { query, order, khuudasniiKhemjee: mur, khuudasniiDugaar: 1 },
    })
    .then(({ data }) => {
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

function camera({ token }) {
  const { t, i18n } = useTranslation()
  const { baiguullaga, barilgiinId } = useAuth();
  const excelref = useRef(null);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const [turul, setTurul] = useState(undefined);

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

  const query = useMemo(() => {
    return {
      check_in_time: ognoo
        ? {
          $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
        }
        : undefined,
      turul: turul === "Үйлчлүүлэгч" ? null : turul,
    };
  }, [ognoo, turul]);

  const { zogsoolGaralt, setZogsoolKhuudaslalt, zogsoolMutate, isValidating } =
    useZogsool(token, baiguullaga?._id, query, order);

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
    ],
    [zogsoolToololt, zogsoolGaralt]
  );

  function onRefresh() {
    zogsoolToololtMutate();
    zogsoolMutate();
  }

  function mashinOruulakhExcel() {
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
  }

  const columns = useMemo(() => {
    const col = [
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
        title: "Зураг",
        align: "center",
        dataIndex: "image",
        width: "10rem",
        showSorterTooltip: false,
        render: () =>
          <img src="https://placehold.co/150x100/png" alt="placeholder"/>
      },
      {
        title: t("Машин"),
        align: "center",
        width: "10rem",
        dataIndex: "car_number",
        showSorterTooltip: false,
        sorter: () => 0,
      },
    ];
    if (turul === "Түрээслэгч") {
      col.push({
        title: t("Талбай"),
        align: "center",
        width: "10rem",
        dataIndex: "mashin",
        showSorterTooltip: false,
        sorter: () => 0,
        render(m) {
          return m?.ezemshigchiinTalbainDugaar;
        },
      });
      col.push({
        title: t("Гэрээ"),
        align: "center",
        width: "10rem",
        dataIndex: "mashin",
        showSorterTooltip: false,
        sorter: () => 0,
        render(m) {
          return m?.gereeniiDugaar;
        },
      });
    }
    return [
      ...col,
      {
        title: t("Орсон"),
        align: "center",
        width: "10rem",
        dataIndex: "check_in_time",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          return moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Гарсан"),
        align: "center",
        width: "10rem",
        dataIndex: "check_out_time",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          return v && moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Хугацаа"),
        align: "center",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "khugatsaa",
      },
      {
        title: t("Төлбөр"),
        align: "right",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "tulbur",
        render(v) {
          return formatNumber(v);
        },
      },{
        title: t("Тайлбар"),
        align: "center",
        ellipsis: true,
        showSorterTooltip: false,
      },
    ];
  }, [turul, i18n.language]);

  useEffect(() => {
    Aos.init({ once: true });
  });

  function excelTatakh() {
    excelTatajAvya(
      token,
      "/zogsool",
      zogsoolGaralt.niitMur,
      columns,
      query,
      order,
      "Зогсоол"
    );
  }

  const carouselRef = React.useRef(null);

  const handlePrevClick = () => {
    carouselRef.current.prev();
  };

  const handleNextClick = () => {
    carouselRef.current.next();
  };

  return (
    <Admin
      title="Камер"
      tsonkhniiId={"64474e3e28c37d7cdda15d01"}
      khuudasniiNer="Camera"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setZogsoolKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      loading={isValidating}
    >
    <div className="col-span-12 lg:col-span-8 overflow-auto">
      <Card size="small" className="col-span-8 overflow-auto">
        <div className="flex overflow-hidden hideScroll overflow-x-auto py-3 sm:p-0 sm:grid w-full sm:grid-cols-6 gap-4 md:gap-6 border-solid 2xl:grid-cols-12">
          {toololt.map((a, i) => (
            <div
              key={i}
              className={`zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 md:col-span-4 lg:col-span-3 ${a.name === turul ? "bg-green-50 dark:bg-gray-900" : ""
                }`}
              onClick={() => setTurul(a.name)}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
              data-aos-delay={1 + i + "00"}
            >
              <div className="h-full w-[67vw] md:w-auto rounded-xl">
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
        <div className="relative group">
      <Carousel dots={false} ref={carouselRef} effect="fade">
        <div className="xl:!flex gap-4 pt-4">
          <div className="flex w-full gap-4">
            <div className="flex justify-center items-center w-full aspect-square border">
              Image 1
            </div>
            <div className="flex flex-col justify-between items-center w-full">
              <div className="w-full">
                <p>Дугаар 1</p>
                <p>Бүртгэл 1</p>
                <p>Төлөв 1</p>
                <p>Орсон 1</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button icon={<UpOutlined/>} type="primary">Нээх</Button>
                <Button icon={<DownOutlined/>} type="primary">Хаах</Button>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-4">
           <div className="flex justify-center items-center w-full border aspect-square">
            Image 1
            </div>
            <div className="flex flex-col justify-between w-full">
              <div className="w-full flex justify-between">
                <div>
                  <p>Дугаар 1</p>
                  <p>Бүртгэл 1</p>
                  <p>Төлөв 1</p>
                  <p>Орсон 1</p>
                </div>
              </div>
            <div className="w-fit flex flex-col gap-2 items-center justify-center">
              <div className="flex justify-center items-center">
                <Button icon={<WalletOutlined />} type="primary">Төлбөр</Button>
              </div>
              <div className="flex gap-2 w-full">
                <Button icon={<UpOutlined />} type="primary">Нээх</Button>
                <Button icon={<DownOutlined />} type="primary">Хаах</Button>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="xl:!flex gap-4 pt-4">
          <div className="flex w-full gap-4">
            <div className="flex justify-center items-center w-full aspect-square border">
              Image 2
            </div>
            <div className="flex flex-col justify-between items-center w-full">
              <div className="w-full">
                <p>Дугаар 2</p>
                <p>Бүртгэл 2</p>
                <p>Төлөв 2</p>
                <p>Орсон 2</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button icon={<UpOutlined/>} type="primary">Нээх</Button>
                <Button icon={<DownOutlined/>} type="primary">Хаах</Button>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-4">
           <div className="flex justify-center items-center w-full border aspect-square">
            Image 2
            </div>
            <div className="flex flex-col justify-between w-full">
              <div className="w-full flex justify-between">
                <div>
                  <p>Дугаар 2</p>
                  <p>Бүртгэл 2</p>
                  <p>Төлөв 2</p>
                  <p>Орсон 2</p>
                </div>
              </div>
            <div className="w-fit flex flex-col gap-2 items-center justify-center">
              <div className="flex justify-center items-center">
                <Button icon={<WalletOutlined />} type="primary">Төлбөр</Button>
              </div>
              <div className="flex gap-2 w-full">
                <Button icon={<UpOutlined />} type="primary">Нээх</Button>
                <Button icon={<DownOutlined />} type="primary">Хаах</Button>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="xl:!flex gap-4 pt-4">
          <div className="flex w-full gap-4">
            <div className="flex justify-center items-center w-full aspect-square border">
              Image 3
            </div>
            <div className="flex flex-col justify-between items-center w-full">
              <div className="w-full">
                <p>Дугаар 3</p>
                <p>Бүртгэл 3</p>
                <p>Төлөв 3</p>
                <p>Орсон 3</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button icon={<UpOutlined/>} type="primary">Нээх</Button>
                <Button icon={<DownOutlined/>} type="primary">Хаах</Button>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-4">
           <div className="flex justify-center items-center w-full border aspect-square">
            Image 3
            </div>
            <div className="flex flex-col justify-between w-full">
              <div className="w-full flex justify-between">
                <div>
                  <p>Дугаар 3</p>
                  <p>Бүртгэл 3</p>
                  <p>Төлөв 3</p>
                  <p>Орсон 3</p>
                </div>
              </div>
            <div className="w-fit flex flex-col gap-2 items-center justify-center">
              <div className="flex justify-center items-center">
                <Button icon={<WalletOutlined />} type="primary">Төлбөр</Button>
              </div>
              <div className="flex gap-2 w-full">
                <Button icon={<UpOutlined />} type="primary">Нээх</Button>
                <Button icon={<DownOutlined />} type="primary">Хаах</Button>
              </div>
            </div>
            </div>
          </div>
        </div>
        </Carousel>
          <button className="p-2 absolute top-[50%] left-2 rounded-full border active:border-black group-hover:visible invisible duration-400 ease-in" onClick={handlePrevClick}><LeftOutlined /></button>
          <button className="p-2 absolute top-[50%] right-2 rounded-full border active:border-black group-hover:visible invisible duration-400 ease-in" onClick={handleNextClick}><RightOutlined/></button>
          </div>
      </Card>
      <Card className="col-span-8">
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
              {t("Зогсоолын орлого")} : {formatNumber(zogsooliinMedeelel?.data)}₮
            </div>
            <Popover
              content={() => (
                <div className="flex w-32 flex-col space-y-2">
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                    onClick={mashinOruulakhExcel}
                  >
                    <UploadOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Оруулах")}</label>
                  </a>
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                    onClick={excelTatakh}
                  >
                    <DownloadOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Татах")}</label>
                  </a>
                </div>
              )}
              placement="bottom"
              trigger="click"
            >
              <Button
                type="primary"
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              >
                <span>Excel</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
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
            loading={!zogsoolGaralt}
            dataSource={zogsoolGaralt?.jagsaalt}
            scroll={{ y: "calc(100vh - 30rem)" }}
            size="small"
            bordered
            rowKey={(row) => row._id}
            columns={columns}
            onChange={onChangeTable}
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
            cardListTuluv={"utas"}
            keyValue="uilchluulegch"
            className="block overflow-auto md:hidden"
            jagsaalt={zogsoolGaralt?.jagsaalt}
            Component={UilchluulegchTile}
          />
        </div>
      </Card>
      </div>
      <Card className="row-span-full col-span-12 lg:col-span-4 lg:col-start-9">
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
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default camera;
