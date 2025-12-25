import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import {
  Button,
  Card,
  Popconfirm,
  Popover,
  Space,
  Tabs,
  Table,
  Tooltip,
  message,
  notification,
} from "antd";
import {
  BellOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  DownOutlined,
  DownloadOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilterOutlined,
  MoreOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import CardList from "components/cardList";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh";
import { modal } from "components/ant/Modal";
import useMashin, { useMashinToololt } from "hooks/useMashin";
import useBlockMashin from "hooks/useBlockMashin";
import MashinBurtgel from "components/pageComponents/zogsool/MashinBurtgel";
import BlockMashinBurtgel from "components/pageComponents/zogsool/BlockMashinBurtgel";
import useOrder from "tools/function/useOrder";
import moment from "moment";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import deleteMethod from "../../../tools/function/crud/deleteMethod";
import TogloomTile from "components/pageComponents/togloom/TogloomTile";
import uilchilgee from "services/uilchilgee";
import { useRouter } from "next/router";
import Tseneglekh from "components/pageComponents/zogsool/Tseneglekh";
import { toast } from "sonner";
function mashinBurtgel({ token }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { baiguullaga, barilgiinId, ajiltan } = useAuth();
  const excelref = useRef(null);
  const tseneglekhRef = useRef(null);
  const mashinref = useRef(null);
  const [turul, setTurul] = useState("Нийт");
  const [tuluv, setTuluv] = useState("");
  const [udurShuult, setUdurShuult] = useState("niit");
  const [songogdsonMashin, setSongogdsonMashin] = useState([]);
  const [songogdsonBlockMashin, setSongogdsonBlockMashin] = useState([]);
  const [activeTab, setActiveTab] = useState("1");

  const query = useMemo(() => {
    var query = {};
    if (turul !== "Нийт") {
      query.turul = turul;
      if (turul === "Гэрээт") {
        if (udurShuult === "idevkhitei") {
          query.duusakhOgnoo = {
            $gt: moment(),
          };
        }
        if (udurShuult === "idevkhigui") {
          query.duusakhOgnoo = {
            $lte: moment(),
          };
        }
        if (udurShuult === "niit") {
          query.duusakhOgnoo = undefined;
        }
      }
      if (tuluv !== "") {
        if (tuluv !== "Үнэгүй") {
          query.khungulultTurul = tuluv;
        } else {
          query.tuluv = tuluv;
        }
      }
      return query;
    }
  }, [turul, tuluv, udurShuult]);

  const { mashinToololt, mashinToololtMutate } = useMashinToololt(
    token,
    barilgiinId
  );

  const { order, onChangeTable } = useOrder({
    createdAt: -1,
  });

  const { mashinGaralt, setMashinKhuudaslalt, mashinMutate, isValidating } =
    useMashin(token, baiguullaga?._id, query, order);

  const { blockMashinGaralt, setBlockMashinKhuudaslalt, blockMashinMutate } =
    useBlockMashin(token, baiguullaga?._id, null, order);

  const [butsaakh, setButsaakh] = useState(false);
  const [khelber, setKhelber] = useState("1");

  useEffect(() => {
    if (mashinGaralt && !butsaakh) {
      const fetchData = async () => {
        try {
          const response = await uilchilgee(token).get("mashin/tooAvya", {
            params: {
              khuudasniiKhemjee: mashinGaralt.niitMur,
              query: {
                turul: "Гэрээт",
                duusakhOgnoo: {
                  $lte: moment().add(2, "day"),
                  $gt: moment(),
                },
              },
            },
          });
          if (response?.data?.niitMur > 0) {
            notification.warning({
              message: t(
                `Хугацаа дуусах ${response?.data?.niitMur} машин байна`
              ),
            });
          }
          setButsaakh(true);
        } catch (error) {
          toast.error(error);
        }
      };
      fetchData();
    }
  }, [mashinGaralt, butsaakh]);

  const tsenegliy = (data) => {
    const footer = [
      <Space>
        <Button type="default" onClick={() => tseneglekhRef.current.khaaya()}>
          {t("Хаах")}
        </Button>
        <Button
          type="primary"
          onClick={() => tseneglekhRef.current.khadgalya()}
        >
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
    modal({
      content: (
        <Tseneglekh
          ref={tseneglekhRef}
          token={token}
          data={data}
          barilgiinId={barilgiinId}
          mutate={mashinMutate}
        />
      ),
      footer,
    });
  };

  const columns = useMemo(() => {
    const shinecol =
      turul === "Гэрээт"
        ? [
            {
              title: (
                <Popover
                  placement="bottom"
                  content={
                    <div className="space-y-2">
                      <div
                        onClick={() => setUdurShuult("niit")}
                        className={`relative flex ${
                          udurShuult === "niit" ? "bg-green-500 text-white" : ""
                        } cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                      >
                        {t("Нийт")}
                      </div>
                      <div
                        onClick={() => setUdurShuult("idevkhitei")}
                        className={`relative flex ${
                          udurShuult === "idevkhitei"
                            ? "bg-green-500 text-white"
                            : ""
                        } cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                      >
                        {t("Идэвхтэй")}
                      </div>
                      <div
                        onClick={() => setUdurShuult("idevkhigui")}
                        className={`relative flex ${
                          udurShuult === "idevkhigui"
                            ? "bg-green-500 text-white"
                            : ""
                        } cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                      >
                        {t("Идэвхгүй")}
                      </div>
                    </div>
                  }
                >
                  <div
                    className={`flex cursor-pointer items-center justify-center gap-3`}
                  >
                    <FilterOutlined className="text-lg text-green-600" />
                    {t("Өдөр")}
                  </div>
                </Popover>
              ),
              align: "center",
              dataIndex: "duusakhOgnoo",
              width: "7rem",
              render: (duusakhOgnoo) =>
                moment(duusakhOgnoo)?.diff(moment(new Date()), "days"),
            },
            {
              title: "Цаг",
              align: "center",
              width: "7rem",
              render: (data) => {
                return (
                  <div>
                    {data?.tulburBodokhTsagEkhlekh} -{" "}
                    {data?.tulburBodokhTsagDuusakh}
                  </div>
                );
              },
            },
          ]
        : turul === "Түрээслэгч"
        ? [
            {
              title: t("Талбайн дугаар"),
              align: "center",
              dataIndex: "ezemshigchiinTalbainDugaar",
              width: "7rem",
            },

            {
              title: (
                <Popover
                  placement="bottom"
                  content={
                    <div className="space-y-2">
                      <div
                        onClick={() => setTuluv("")}
                        className={`relative flex ${
                          tuluv === "" ? "bg-green-500 text-white" : ""
                        } cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                      >
                        {t("Нийт")}
                      </div>
                      <div
                        onClick={() => setTuluv("togtmolTsag")}
                        className={`relative flex ${
                          tuluv === "togtmolTsag"
                            ? "bg-green-500 text-white"
                            : ""
                        } cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                      >
                        {t("Тогтмол цаг")}
                      </div>
                      <div
                        onClick={() => setTuluv("khuviKhungulult")}
                        className={`relative ${
                          tuluv == "khuviKhungulult"
                            ? "bg-green-500 text-white"
                            : ""
                        } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                      >
                        {t("Хувь хөнгөлөлт")}
                      </div>
                      <div
                        onClick={() => setTuluv("Үнэгүй")}
                        className={`relative ${
                          tuluv == "Үнэгүй" ? "bg-green-500 text-white" : ""
                        } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                      >
                        {t("Үнэгүй")}
                      </div>
                    </div>
                  }
                >
                  <div
                    className={`flex cursor-pointer items-center justify-center gap-3`}
                  >
                    <FilterOutlined className="text-lg text-green-600" />
                    {t("Хөнгөлөлт")}
                  </div>
                </Popover>
              ),
              align: "center",
              width: "10rem",
              dataIndex: "khungulultTurul",
              showSorterTooltip: false,
              render: (a, b) => {
                if (b.tuluv !== "Үнэгүй") {
                  if (a === "togtmolTsag") {
                    return (
                      <div className="flex items-center justify-center">
                        {a && (
                          <div
                            className={`flex w-[6rem] items-center justify-center rounded-lg px-2 py-1 font-[600] text-white ${
                              b.uldegdelKhungulukhKhugatsaa ===
                              b.khungulukhKhugatsaa
                                ? "bg-green-400 dark:bg-green-700"
                                : b.uldegdelKhungulukhKhugatsaa > 0
                                ? "bg-yellow-400 dark:bg-yellow-700"
                                : "bg-red-400 dark:bg-red-700"
                            }`}
                          >
                            {b.khungulukhKhugatsaa}
                            {"/"}
                            {""}
                            {b.uldegdelKhungulukhKhugatsaa}
                            {t("мин")}
                          </div>
                        )}
                      </div>
                    );
                  }
                  if (a === "khuviKhungulult") {
                    return (
                      <div className="flex items-center justify-center">
                        {a && (
                          <div className="flex w-[6rem] items-center justify-center rounded-lg bg-blue-400 px-2 py-1 font-[600] text-white dark:bg-blue-700">
                            {b.khungulult}
                            {"%"}
                          </div>
                        )}
                      </div>
                    );
                  }
                } else {
                  return (
                    <div className="flex items-center justify-center">
                      <div className="flex w-[6rem] items-center justify-center rounded-lg bg-gray-400 px-2 py-1 font-[600] text-white dark:bg-gray-700">
                        {b.tuluv}
                      </div>
                    </div>
                  );
                }
              },
            },
          ]
        : [];
    return [
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
        title: t("Бүртгэсэн"),
        dataIndex: "createdAt",
        width: "8rem",
        ellipsis: true,
        align: "center",
        render(date) {
          return moment(date).format("YYYY-MM-DD HH:mm");
        },
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Бүртгэсэн ажилтан"),
        align: "center",
        width: "8rem",
        dataIndex: "burtgesenAjiltaniiNer",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Нэр"),
        align: "left",
        width: "8rem",
        dataIndex: "ezemshigchiinNer",
        showSorterTooltip: false,
        sorter: () => 0,
      },

      {
        title: t("Утас"),
        width: "7rem",
        align: "center",
        dataIndex: "ezemshigchiinUtas",
      },
      {
        title: t("Дугаар"),
        width: "6rem",
        align: "center",
        dataIndex: "dugaar",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (value, record) => {
          if (record?.turul === "Байгууллага") {
            return (
              <Popover
                content={
                  <div style={{ minWidth: "200px", width: "100%" }}>
                    {record.mashinuud && record.mashinuud.length > 0 ? (
                      record.mashinuud.map((mashiin, index) => (
                        <div
                          className="px-2 py-1 text-black dark:text-gray-200"
                          key={index}
                          style={{
                            width: "100%",
                            backgroundColor:
                              index % 2 === 1
                                ? "rgba(128, 128, 128, 0.3)"
                                : "transparent",
                          }}
                        >
                          {mashiin}
                        </div>
                      ))
                    ) : (
                      <div className="text-black dark:text-gray-200">
                        Бүртгэлтэй машин алга
                      </div>
                    )}
                  </div>
                }
                title="Машин дугаарууд"
                trigger="hover"
              >
                <span className="cursor-pointer ">
                  <EyeOutlined className="mr-1 h-5 text-black dark:text-gray-200" />
                </span>
              </Popover>
            );
          } else {
            return record.dugaar || "-";
          }
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
        title: t("Үлдэгдэл хугацаа"),
        align: "center",
        width: "6rem",
        dataIndex: "uldegdelKhungulukhKhugatsaa",
        showSorterTooltip: false,
        render: (value, record, index) => {
          if (record?.khungulukhKhugatsaa > 0) {
            return (
              <div className="flex justify-center">
                <div className="flex h-[1.5rem] w-[4rem] items-center justify-center rounded-lg bg-green-400 px-2 py-1 font-[600] text-white">
                  {record?.uldegdelKhungulukhKhugatsaa
                    ? record?.uldegdelKhungulukhKhugatsaa
                    : record?.khungulukhKhugatsaa}
                </div>
              </div>
            );
          }
        },
      },
      {
        title: t("Камер"),
        align: "center",
        dataIndex: "cameraIP",
        width: "7rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      ...shinecol,
      {
        title: t("Тайлбар"),
        width: "12rem",
        align: "center",
        dataIndex: "temdeglel",
        showSorterTooltip: false,
        render: (v) => (
          <Tooltip title={v}>
            <div className="w-full cursor-help truncate break-words text-left">
              {v}
            </div>
          </Tooltip>
        ),
      },
      {
        title: t("Цэнэглэх"),
        width: "6rem",
        align: "center",
        dataIndex: "tsenegleltUldegdel",
        render: (v, data) => {
          if (data?.turul === "Дотоод") return "";
          {
            if (!!v) {
              return (
                <div className="w-full truncate rounded-lg bg-green-500 px-2 py-1 text-white">
                  {formatNumber(v, 0)}
                </div>
              );
            } else {
              return (
                <div className="w-full truncate rounded-lg bg-green-500 px-2 py-1 text-white">
                  0
                </div>
              );
            }
          }
        },
      },
      {
        title: () => <SettingOutlined />,
        width: "2rem",
        align: "center",
        render: (data) => (
          <div className="flex flex-row justify-center">
            <Popover
              zIndex={99}
              placement="bottom"
              trigger="hover"
              content={() => (
                <div className="flex w-24 flex-col space-y-2">
                  {data?.turul !== "Дотоод" && (
                    <a
                      className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        tsenegliy(data);
                      }}
                    >
                      <DollarCircleOutlined style={{ fontSize: "18px" }} />
                      <label>{t("Цэнэглэх")}</label>
                    </a>
                  )}
                  <a
                    className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      mashinBurtgekh(data);
                    }}
                  >
                    <EditOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Засах")}</label>
                  </a>
                  <Popconfirm
                    placement="left"
                    title={t("Машин устгах уу?")}
                    okText={t("Тийм")}
                    cancelText={t("Үгүй")}
                    onConfirm={() => mashinUstgaya(data)}
                  >
                    <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700">
                      <DeleteOutlined
                        className="text-red-600"
                        style={{ fontSize: "18px" }}
                      />
                      <label className="text-red-600">{t("Устгах")}</label>
                    </a>
                  </Popconfirm>
                </div>
              )}
            >
              <a className="flex items-center justify-center hover:scale-150 dark:hover:bg-gray-700">
                <MoreOutlined style={{ fontSize: "18px" }} />
              </a>
            </Popover>
          </div>
        ),
      },
    ];
  }, [turul, baiguullaga, barilgiinId, tuluv, udurShuult]);

  const blockColumns = useMemo(() => {
    return [
      {
        title: "№",
        align: "center",
        dataIndex: "dugaar",
        width: "2rem",
        render: (text, record, index) =>
          (blockMashinGaralt?.khuudasniiDugaar || 0) *
            (blockMashinGaralt?.khuudasniiKhemjee || 0) -
          (blockMashinGaralt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: t("Дугаар"),
        width: "6rem",
        align: "center",
        dataIndex: "dugaar",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Тайлбар"),
        width: "12rem",
        align: "center",
        dataIndex: "tailbar",
        showSorterTooltip: false,
        render: (v) => (
          <Tooltip title={v}>
            <div className="w-full cursor-help truncate break-words text-left">
              {v}
            </div>
          </Tooltip>
        ),
      },
      {
        title: t("Бүртгэсэн"),
        dataIndex: "createdAt",
        width: "8rem",
        ellipsis: true,
        align: "center",
        render(date) {
          return moment(date).format("YYYY-MM-DD HH:mm");
        },
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Бүртгэсэн ажилтан"),
        dataIndex: "burtgesenAjiltaniiNer",
        width: "8rem",
        ellipsis: true,
        align: "center",
        showSorterTooltip: false,
      },
      {
        title: () => <SettingOutlined />,
        width: "2rem",
        align: "center",
        render: (data) => (
          <div className="flex flex-row justify-center">
            <Popover
              zIndex={99}
              placement="bottom"
              trigger="hover"
              content={() => (
                <div className="flex w-24 flex-col space-y-2">
                  <a
                    className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      blockMashinBurtgekh(data);
                    }}
                  >
                    <EditOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Засах")}</label>
                  </a>
                  <Popconfirm
                    placement="left"
                    title={t("Блок машин устгах уу?")}
                    okText={t("Тийм")}
                    cancelText={t("Үгүй")}
                    onConfirm={() => blockMashinUstgaya(data)}
                  >
                    <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700">
                      <DeleteOutlined
                        className="text-red-600"
                        style={{ fontSize: "18px" }}
                      />
                      <label className="text-red-600">{t("Устгах")}</label>
                    </a>
                  </Popconfirm>
                </div>
              )}
            >
              <a className="flex items-center justify-center hover:scale-150 dark:hover:bg-gray-700">
                <MoreOutlined style={{ fontSize: "18px" }} />
              </a>
            </Popover>
          </div>
        ),
      },
    ];
  }, []);

  const toololt = useMemo(() => {
    return [
      {
        name: "Нийт",
        too: formatNumber(
          mashinToololt?.reduce((a, b) => a + b.too, 0) +
            (mashinToololt?.find((a) => a._id === "Block")?.too || 0),
          0
        ),
      },
      {
        name: "Гэрээт",
        too: formatNumber(
          mashinToololt?.find((a) => a._id === "Гэрээт")?.too,
          0
        ),
      },

      {
        name: "Түрээслэгч",
        too: formatNumber(
          mashinToololt?.find((a) => a._id === "Түрээслэгч")?.too,
          0
        ),
      },
      {
        name: "Дотоод",
        too: formatNumber(
          mashinToololt?.find((a) => a._id === "Дотоод")?.too,
          0
        ),
      },
      {
        name: "Дурын",
        too: formatNumber(
          mashinToololt?.find((a) => a._id === "Дурын")?.too,
          0
        ),
      },
      {
        name: "СӨХ",
        too: formatNumber(mashinToololt?.find((a) => a._id === "СӨХ")?.too, 0),
      },
      {
        name: "Байгууллага",
        too: formatNumber(
          mashinToololt?.find((a) => a._id === "Байгууллага")?.too,
          0
        ),
      },
      {
        name: "VIP",
        too: formatNumber(mashinToololt?.find((a) => a._id === "VIP")?.too, 0),
      },
      // {
      //   name: "Оршин суугч",
      //   too: formatNumber(
      //     mashinToololt?.find((a) => a._id === "Оршин суугч")?.too,
      //     0
      //   ),
      // },
      {
        name: "Блок",
        too: formatNumber(
          mashinToololt?.find((a) => a._id === "Block")?.too,
          0
        ),
      },
    ];
  }, [mashinToololt, mashinGaralt]);

  function onRefresh() {
    mashinMutate();
    mashinToololtMutate();
  }

  function excelTatajAvya(token, service, mur, sheet, query, order, sheetName) {
    uilchilgee(token)
      .get(service, {
        params: {
          query: {
            ...query,
            barilgiinId: barilgiinId,
          },
          order,
          khuudasniiKhemjee: mur,
        },
      })
      .then(({ data }) => {
        const { Excel } = require("antd-table-saveas-excel");
        const excel = new Excel();
        excel
          .addSheet(sheetName)
          .addColumns(sheet)
          .addDataSource(data?.jagsaalt)
          .saveAs(sheetName + ".xlsx");
      });
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

  function blockMashinOruulakhExcel() {
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
          onFinish={onRefreshBlock}
          barilgiinId={barilgiinId}
          zam="blockMashiniiExcelTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Блок машины мэдээлэл оруулах excel файл"
          zagvariinZam="blockMashiniiExcelAvya"
        />
      ),
      footer,
    });
  }

  function mashinUstgaya(data) {
    let mashinIds = [];
    if (Array.isArray(data)) {
      mashinIds = data;
    } else if (data && data._id) {
      mashinIds = [data._id];
    } else {
      toast.error("Машин сонгоно уу");
      return;
    }

    if (mashinIds.length === 0) {
      toast.error("Машин сонгоно уу");
      return;
    }
    const deletePromises = mashinIds.map((mashinId) =>
      deleteMethod("mashin", token, mashinId)
    );
    Promise.all(deletePromises)
      .then((results) => {
        const allSuccessful = results.every(
          (result) => result.data === "Amjilttai"
        );
        setSongogdsonMashin([]);
        if (allSuccessful) {
          mashinMutate();
          mashinToololtMutate();
          toast.success("Машин амжилттай устгагдлаа");
        } else {
          toast.error("Зарим машин устгаж чадсангүй");
        }
      })
      .catch((error) => {
        toast.error("Алдаа гарлаа");
      });
  }

  function blockMashinUstgaya(data) {
    let mashinIds = [];
    if (Array.isArray(data)) {
      mashinIds = data.map((item) => item?.jagsaalt?._id || item);
    } else if (data && data?._id) {
      mashinIds = [data?._id];
    } else {
      toast.error("Машин сонгоно уу");
      return;
    }

    if (mashinIds.length === 0) {
      toast.error("Машин сонгоно уу");
      return;
    }
    const deletePromises = mashinIds.map((mashinId) =>
      deleteMethod("blockMashin", token, mashinId)
    );
    Promise.all(deletePromises)
      .then((results) => {
        const allSuccessful = results.every(
          (result) => result.data === "Amjilttai"
        );
        setSongogdsonBlockMashin([]);
        if (allSuccessful) {
          blockMashinMutate();
          mashinToololtMutate();
          toast.success(`${mashinIds.length} машин амжилттай устгагдлаа`);
        } else {
          toast.error("Зарим машин устгаж чадсангүй");
        }
      })
      .catch((error) => {
        toast.error("Алдаа гарлаа");
      });
  }

  function mashinBurtgekh(data) {
    let mashinBurtgekhButtonId = "mashinBurtgekhButtonId";
    const footer = [
      <Space>
        <Button onClick={() => mashinref.current.khaaya()}>{t("Хаах")}</Button>
        <Button
          type="primary"
          id={mashinBurtgekhButtonId}
          onClick={() => mashinref.current.khadgalya()}
        >
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
    modal({
      title: "Машин бүртгэл",
      icon: <FileExcelOutlined />,
      content: (
        <MashinBurtgel
          mashinBurtgekhButtonId={mashinBurtgekhButtonId}
          ref={mashinref}
          token={token}
          onRefresh={onRefresh}
          barilgiinId={barilgiinId}
          baiguullagiinId={baiguullaga?._id}
          dotorGadnaTsagEsekh={baiguullaga?.tokhirgoo?.dotorGadnaTsagEsekh}
          data={data}
          ajiltan={ajiltan}
        />
      ),
      footer,
    });
  }

  function blockMashinBurtgekh(data) {
    let mashinBurtgekhButtonId = "mashinBurtgekhButtonId";
    const footer = [
      <Space>
        <Button onClick={() => mashinref.current.khaaya()}>{t("Хаах")}</Button>
        <Button
          type="primary"
          id={mashinBurtgekhButtonId}
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
        <BlockMashinBurtgel
          mashinBurtgekhButtonId={mashinBurtgekhButtonId}
          ajiltan={ajiltan}
          ref={mashinref}
          token={token}
          onRefreshBlock={onRefreshBlock}
          barilgiinId={barilgiinId}
          baiguullagiinId={baiguullaga?._id}
          data={data}
        />
      ),
      footer,
    });
  }

  function onRefreshBlock() {
    blockMashinMutate();
    mashinToololtMutate();
  }

  useEffect(() => {
    Aos.init({ once: true });
  });
  function medegdelKhuudasruuOchiy() {
    router.push("/khyanalt/zogsool/zogsoolMedegdel");
  }

  return (
    <Admin
      title="Машин бүртгэл"
      khuudasniiNer="mashinBurtgel"
      className="p-0 md:p-4"
      tsonkhniiId={"64546d9caf55fc853dd6812c"}
      onSearch={(search) => {
        setMashinKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }));
        setBlockMashinKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
      }}
      // loading={isValidating}
    >
      <Card size="small" className="col-span-12 overflow-auto">
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:p-0 md:gap-6 2xl:grid-cols-12">
          {toololt.map((a, i) => (
            <div
              key={i}
              className={`zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 md:col-span-4 lg:col-span-2 ${
                a.name === turul ? "bg-green-50 dark:bg-gray-900" : ""
              }`}
              onClick={() => {
                setTurul(a.name);
                setKhelber(a.name == "Блок" ? "2" : "1");
              }}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
              data-aos-delay={4 - i + "00"}
            >
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
        <div
          className="flex flex-row"
          data-aos="zoom-out-up"
          data-aos-duration="1000"
          data-aos-delay="100"
        >
          <div>
            <Button
              onClick={medegdelKhuudasruuOchiy}
              type="primary"
              icon={<BellOutlined />}
            >
              {t("Мэдэгдэл")}
            </Button>
          </div>
          <div className="mb-5 ml-auto flex items-center justify-center space-x-5 md:mb-0">
            {khelber === "1" ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => mashinBurtgekh()}
              >
                {t("Машин")}
              </Button>
            ) : (
              ""
            )}
            {khelber === "2" ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => blockMashinBurtgekh()}
              >
                {t("Блоклох машин")}
              </Button>
            ) : (
              ""
            )}
            <Popover
              content={() => (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex w-32 flex-col">
                    <a
                      className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                      onClick={
                        khelber === "1"
                          ? mashinOruulakhExcel
                          : blockMashinOruulakhExcel
                      }
                    >
                      <UploadOutlined style={{ fontSize: "18px" }} />
                      <label>{t("Оруулах")}</label>
                    </a>
                  </div>
                  <div className="flex w-32 flex-col">
                    <a
                      className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                      onClick={() =>
                        khelber === "1"
                          ? excelTatajAvya(
                              token,
                              "/mashin",
                              mashinGaralt?.niitMur,
                              [
                                {
                                  title: t("Бүртгэсэн"),
                                  dataIndex: "createdAt",
                                  render(date) {
                                    return moment(date).format(
                                      "YYYY-MM-DD HH:mm"
                                    );
                                  },
                                },
                                {
                                  title: t("Нэр"),
                                  dataIndex: "ezemshigchiinNer",
                                },
                                {
                                  title: t("Утас"),
                                  dataIndex: "ezemshigchiinUtas",
                                },
                                {
                                  title: t("Дугаар"),
                                  dataIndex: "dugaar",
                                },
                                {
                                  title: t("Төрөл"),
                                  dataIndex: "turul",
                                },

                                {
                                  title: "Хөнгөлөлт",
                                  dataIndex: "khungulultTurul",
                                  render: (a, b) => {
                                    return b.tuluv !== "Үнэгүй"
                                      ? a === "togtmolTsag"
                                        ? b.uldegdelKhungulukhKhugatsaa + "мин"
                                        : a === "khuviKhungulult"
                                        ? b.khungulult
                                        : ""
                                      : b.tuluv;
                                  },
                                },
                                {
                                  title: t("Тайлбар"),
                                  dataIndex: "temdeglel",
                                },
                              ],
                              query,
                              undefined,
                              "Машин бүртгэл"
                            )
                          : excelTatajAvya(
                              token,
                              "/blockMashin",
                              blockMashinGaralt?.niitMur,
                              [
                                {
                                  title: t("Дугаар"),
                                  dataIndex: "dugaar",
                                },
                                {
                                  title: t("Тайлбар"),
                                  dataIndex: "tailbar",
                                },
                                {
                                  title: t("Бүртгэсэн"),
                                  dataIndex: "createdAt",
                                  render(date) {
                                    return moment(date).format(
                                      "YYYY-MM-DD HH:mm"
                                    );
                                  },
                                },
                                {
                                  title: t("Бүртгэсэн ажилтан"),
                                  dataIndex: "burtgesenAjiltaniiNer",
                                },
                              ],
                              query,
                              undefined,
                              "Блок машины бүртгэл"
                            )
                      }
                    >
                      <DownloadOutlined style={{ fontSize: "18px" }} />
                      <label>{t("Татах")}</label>
                    </a>
                  </div>
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
            <Popconfirm
              placement="left"
              title={t("Машин устгах уу?")}
              okText={t("Тийм")}
              cancelText={t("Үгүй")}
              onConfirm={() => {
                if (activeTab === "1") {
                  mashinUstgaya(songogdsonMashin);
                } else if (activeTab === "2") {
                  blockMashinUstgaya(songogdsonBlockMashin);
                }
              }}
            >
              <Button
                className="bg-red-400 text-white dark:bg-red-400"
                icon={<DeleteOutlined />}
              >
                {t("Устгах")}
              </Button>
            </Popconfirm>
          </div>
        </div>
        <Tabs
          defaultActiveKey={activeTab}
          activeKey={activeTab}
          items={[
            {
              key: "1",
              label: t("Машин бүртгэл"),
              children: (
                <div className="overflow-x-auto">
                  <Table
                    className="overflow-auto"
                    tableLayout="fixed"
                    loading={!mashinGaralt}
                    dataSource={mashinGaralt?.jagsaalt}
                    scroll={{ y: "calc(100vh - 30rem)", x: "max-content" }}
                  size="small"
                  bordered
                  rowKey={(record) => record._id}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: songogdsonMashin,
                    onChange: (selectedRowKeys) => {
                      setSongogdsonMashin(selectedRowKeys);
                    },
                  }}
                  onChange={onChangeTable}
                  columns={columns}
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
                </div>
              ),
            },
            {
              key: "2",
              label: t("Блок жагсаалт"),
              children: (
                <div className="overflow-x-auto">
                  <Table
                    className="overflow-auto"
                    tableLayout="fixed"
                    loading={!blockMashinGaralt}
                    dataSource={blockMashinGaralt?.jagsaalt}
                    scroll={{ y: "calc(100vh - 30rem)", x: "max-content" }}
                  size="small"
                  bordered
                  onChange={onChangeTable}
                  columns={blockColumns}
                  rowKey={(record) => record._id}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: songogdsonBlockMashin,
                    onChange: (selectedRowKeys) => {
                      setSongogdsonBlockMashin(selectedRowKeys);
                    },
                  }}
                  pagination={{
                    current: blockMashinGaralt?.khuudasniiDugaar,
                    pageSize: blockMashinGaralt?.khuudasniiKhemjee,
                    total: blockMashinGaralt?.niitMur,
                    showSizeChanger: true,
                    onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                      setBlockMashinKhuudaslalt((kh) => ({
                        ...kh,
                        khuudasniiDugaar,
                        khuudasniiKhemjee,
                      })),
                  }}
                />
                </div>
              ),
            },
          ]}
          onChange={(v) => {
            setKhelber(v);
            setActiveTab(v);
          }}
        />

      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default mashinBurtgel;
