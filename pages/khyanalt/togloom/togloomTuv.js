import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import { Button, Card, DatePicker, message, Popover, Space, Table } from "antd";
import {
  CheckCircleOutlined,
  DollarCircleOutlined,
  DownloadOutlined,
  DownOutlined,
  FileExcelOutlined,
  PaperClipOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import { modal } from "components/ant/Modal";
import _ from "lodash";
import useOrder from "tools/function/useOrder";
import useSWR from "swr";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Aos from "aos";
import KhuukhedBurtgel from "components/pageComponents/togloom/TsagBurtgel";
import { t } from "i18next";
import useJagsaalt from "hooks/useJagsaalt";
import { useToololt } from "hooks/useToololt";
import Tulbur from "components/pageComponents/togloomiinTuv/Tulbur";

function togloom1() {  
  const { token, baiguullaga, barilgiinId } = useAuth();
  const excelref = useRef(null);
  const [ognoo, setOgnoo] = useState([
    moment(),
    moment(),
  ]);
  const mashinref = useRef(null);
  const [turul, setTurul] = useState(undefined);
  const tulburRef = React.useRef(null)

  const { toololt, toololtMutate } = useToololt(
    "/togloomiinToololtAvya",
    token,
    ognoo
  );

  const togloomiinDun = useToololt(
    "/togloomiinDunAvya",
    token,
    ognoo
  );
  const { order, onChangeTable } = useOrder({ ognoo: -1 });

  const query = useMemo(() => {
    return {
      ognoo: ognoo
        ? {
            $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };
  }, [ognoo, turul]);

  const togloominTuviinGaralt = useJagsaalt("togloomiinTuv", query);

  const toololtGaralt = useMemo(
    () => [
      {
        name: "Нийт",
        too: toololt?.reduce((a, b) => a + b?.too, 0),
      },
      {
        name: "Тоглож байгаа",
        too: formatNumber(
          toololt?.find((a) => a._id === "Түрээслэгч")?.too,
          0
        ),
      },
      {
        name: "Цаг дууссан",
        too: formatNumber(
          toololt?.find((a) => a._id === "Гэрээт")?.too,
          0
        ),
      },      
    ],
    [toololt]
  );

  function onRefresh() {
    toololtMutate();
    togloominTuviinGaralt.mutate()
  }

  function tulburTulyu(data) {
    modal({
      title: (
        <div className="w-full flex flex-row justify-between">
          <div>Тооцоо хийх</div>
          <div className="mr-5">{data?.ovog.charAt(0)}.{data?.ner}</div>
        </div>
      ),
      content: (
        <Tulbur
          ref={tulburRef}
          data={data}
          token={token}
          baiguullaga={baiguullaga}
        />
      ),
      footer: false,
    });
  }

  const columns = useMemo(() => {
    return [
      {
        title: "№",
        align: "center",
        dataIndex: "dugaar",
        width: "2rem",
        render: (text, record, index) =>
          (togloominTuviinGaralt?.khuudasniiDugaar || 0) *
            (togloominTuviinGaralt?.khuudasniiKhemjee || 0) -
          (togloominTuviinGaralt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: t("Овог"),
        align: "center",
        dataIndex: "ovog",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Нэр"),
        align: "center",
        dataIndex: "ner",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Нас"),
        align: "center",
        dataIndex: "nas",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Хүйс"),
        align: "center",
        dataIndex: "khuis",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
        render:(a)=> <div>{a === 1 ? "Эрэгтэй" : "Эмэгтэй"}</div>
      },
      {
        title: t("Хугацаа /мин/"),
        align: "center",
        width: "10rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "khugatsaa",
      },
      {
        title: t("Эхлэх цаг"),
        align: "center",
        width: "10rem",
        dataIndex: "ekhlekhTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          return moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Дуусах цаг"),
        align: "center",
        width: "10rem",
        dataIndex: "duusakhTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          return v && moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: "Нийт дүн",
        align: "center",
        width: "10rem",
        dataIndex: "niitDun",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          return v && formatNumber(v);
        },
      },
      {
        width: "10rem",
        title: "Төлбөр",
        align: "center",
        ellipsis: true,
        render: (data) => {
          return (
            (data?.tulburTulsunEsekh !== true ||
              data?.ebarimtAvsanEsekh !== true) ? (
              <div className="flex justify-center">
                <Button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                    data?.tulburTulsunEsekh !== true ? "#FF8505" : "#253985",
                  }}
                  // type={`${data?.tulbur === [] ? "primary" : "warning"}`}
                  size="small"
                  // danger={data?.tuluv === "3"}
                  // icon={<DollarCircleOutlined className="text-white" />}
                  onClick={() => tulburTulyu(data)}
                >
                  {data?.tuluv === 0 ? (
                    <div className="text-white flex  justify-center items-center space-x-2">
                      <div className="flex justify-center items-center">
                        <DollarCircleOutlined />
                      </div>
                      <div className="flex justify-center items-center">
                        Төлбөр
                      </div>
                    </div>
                  ) : (
                    <div className="text-white flex  justify-center items-center space-x-2 ">
                      <div className="flex justify-center items-center">
                        <PaperClipOutlined />
                      </div>
                      <div className="flex justify-center items-center">
                        И-Баримт
                      </div>
                    </div>
                  )}
                </Button>
              </div>
            )
            : (
              <div className="flex justify-center">
                <Button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#0CB20C",
                    
                  }}
                  // type={`${data?.tulbur === [] ? "primary" : "warning"}`}
                  size="small"
                  // danger={data?.tuluv === "3"}
                  // icon={<DollarCircleOutlined className="text-white" />}
                >
                    <div className="text-white flex  justify-center items-center space-x-2">
                      <div className="flex justify-center items-center">
                      <CheckCircleOutlined />
                      </div>
                      <div className="flex justify-center items-center">
                    Дууссан
                      </div>
                    </div>
                </Button>
              </div>
            )
          );
        },
      },      
    ];
  }, [turul]);

  useEffect(() => {
    Aos.init({ once: true });
  });

  function khuukhedBurtgekh(data) {
    var khuukhedBurtgekhButtonId = "khuukhedBurtgekhButtonId";
    const footer = [
      <Space>
        <Button onClick={() => mashinref.current.khaaya()}>{t("Хаах")}</Button>
        <Button
          type="primary"
          id={khuukhedBurtgekhButtonId}
          onClick={() => mashinref.current.khadgalya()}
        >
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <KhuukhedBurtgel
          khuukhedBurtgekhButtonId={khuukhedBurtgekhButtonId}
          ref={mashinref}
          token={token}
          onRefresh={onRefresh}
          barilgiinId={barilgiinId}
          data={data}
        />
      ),
      footer,
    });
  }

  return (
    <Admin
      title="Тоглоомын төв"
      khuudasniiNer="togloomTuv"
      className="p-0 md:p-4"
    >
      <Card size="small" className="col-span-12 overflow-auto">
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:p-0 md:gap-6 2xl:grid-cols-12">
          {toololtGaralt.map((a, i) => (
            <div
              key={i}
              className={`zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 md:col-span-4 ${
                a.name === turul ? "bg-green-50 dark:bg-gray-900" : ""
              }`}
              onClick={() => setTurul(a.name)}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
              data-aos-delay={1 + i + "00"}
            >
              <div className="h-full w-[67vw] rounded-xl md:w-auto">
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
        <div className="flex flex-col gap-5 md:flex-row">
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="100"
          >
            <DatePicker.RangePicker
              className="w-full md:w-auto"
              size="middle"
              allowClear={false}
              value={ognoo}
              onChange={setOgnoo}
            />
          </div>
          <div
            className="mb-5 flex w-full items-center justify-between md:ml-auto md:mb-0"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <div className="flex flex-row space-x-2 p-1 text-xs font-medium md:text-base">
              {t("Тоглоомын орлого")} : {togloomiinDun.toololt?.reduce((a, b) => a + b.too, 0) || 0}
              ₮
            </div>
            <div className="space-x-2">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => khuukhedBurtgekh()}
              >
                {t("нэмэх")}
              </Button>              
            </div>
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
            dataSource={togloominTuviinGaralt?.jagsaalt}
            scroll={{ y: "calc(100vh - 30rem)" }}
            size="small"
            bordered
            rowKey={(row) => row._id}
            columns={columns}
            onChange={onChangeTable}
            pagination={{
              current: togloominTuviinGaralt?.khuudasniiDugaar,
              pageSize: togloominTuviinGaralt?.khuudasniiKhemjee,
              total: togloominTuviinGaralt?.niitMur,
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
            jagsaalt={togloominTuviinGaralt?.jagsaalt}
            Component={UilchluulegchTile}
          />
        </div>
      </Card>
    </Admin>
  );
}

export default togloom1;
