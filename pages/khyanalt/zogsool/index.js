import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import { modal } from "../../../components/ant/Modal";
import TulburiinDelgerenguiTailan from "components/pageComponents/zogsool/TulburiinDelgerenguiTailan";
import { toast } from "sonner";
import {
  Button,
  Card,
  DatePicker,
  Input,
  message,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Radio,
  Select,
  Table,
  Tabs,
  Tooltip,
  Table as AntdTable,
} from "antd";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import useOrder from "tools/function/useOrder";

import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useUilchluulegchdiinDunAvay } from "hooks/useUilchluulegch";

import useUilchluulegchZogsool from "hooks/useUilchluulegchZogsool";

import { useUilchluulegchToololt } from "hooks/useUilchluulegch";

import useJagsaalt from "hooks/useJagsaalt";
import {
  CloseSquareFilled,
  DownloadOutlined,
  CloseCircleOutlined,
  DownOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  FilterOutlined,
  ShareAltOutlined,
  VideoCameraAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel";
import confirm from "antd/lib/modal/confirm";
import { TbRuler2Off } from "react-icons/tb";

export function excelTatajAvya(
  token,
  service,
  mur,
  sheet,
  query,
  order,
  sheetName,
) {
  const loadingToast = toast.loading(
    t("Өгөгдөл боловсруулж байна та түр хүлээнэ үү!"),
  );
  uilchilgee(token)
    .get(service, {
      params: { query, order, khuudasniiKhemjee: mur, khuudasniiDugaar: 1 },
    })
    .then(({ data }) => {
      const excel = new Excel();
      excel
        .addSheet(sheetName)
        .addColumns(sheet)
        .addDataSource(data?.jagsaalt)
        .saveAs(sheetName + ".xlsx");
    })
    .catch(aldaaBarigch)
    .finally(() => toast.dismiss(loadingToast));
}

function tulburKhurvuulekh(v) {
  var utga = undefined;
  switch (v) {
    case "belen":
      utga = "Бэлэн";
      break;
    case "khariltsakh":
      utga = "Данс";
      break;
    case "khaan":
      utga = "Хаан";
      break;
    case "khas":
      utga = "Хас";
      break;
    case "tur":
      utga = "Төр";
      break;
    case "golomt":
      utga = "Голомт";
      break;

    case "tdb":
      utga = "ХХБ";
      break;
    case "kapitron":
      utga = "Капитрон";
      break;
    case "toki":
      utga = "Токи";
      break;
    case "kiosk":
      utga = "Киоск";
      break;
    case "khungulult":
      utga = "Хөнгөлөлт";
      break;
    case "Fitness":
      utga = "Fitness";
      break;
    case "ugaalga":
      utga = "ugaalga";
      break;
    case "bankQR":
      utga = "Банк QR";
      break;
    case "GadaaQR":
      utga = "Гадаа QR";
      break;
    case "DotorQR":
      utga = "Дотор QR";
      break;
    case "qpay":
      utga = "QPay";
      break;
    case "tseneglelt":
      utga = "Хэтэвч";
      break;
    case "PosKart":
      utga = "Пос Карт";
      break;
    case "PosBelen":
      utga = "Пос Бэлэн";
      break;
    case "PosKhariltsakh":
      utga = "Пос Данс";
      break;

    case "Соёолж Ц/Д":
      utga = "Соёолж Ц/Д";
      break;
    default:
      utga = v;
      break;
  }
  return utga;
}
function calculatePaymentTotals(rows) {
  const totals = {};

  paymentTypes.forEach(({ key }) => {
    totals[`total_${key}`] = 0;
  });
  totals.paymentTotal = 0;

  rows.forEach((row) => {
    const tulbur = row?.tuukh?.[0]?.tulbur || [];
    const { payments } = splitTulbur(tulbur);

    payments.forEach((payment) => {
      const key = payment.turul;
      if (!totals[`total_${key}`]) {
        totals[`total_${key}`] = 0;
      }
      totals[`total_${key}`] += Number(payment?.dun) || 0;
      totals.paymentTotal += Number(payment?.dun) || 0;
    });
  });

  return totals;
}

const paymentTypes = [
  { key: "belen", label: "Бэлэн" },
  { key: "khaan", label: "Хаан" },
  { key: "khas", label: "Хас" },
  { key: "khariltsakh", label: "Данс" },
  { key: "qpay", label: "QPay" },
  { key: "toki", label: "Токи" },
  { key: "kiosk", label: "Киоск" },
  { key: "bankQR", label: "Банк QR" },
  { key: "GadaaQR", label: "Гадаа QR" },
  { key: "DotorQR", label: "Дотор QR" },
  { key: "PosKart", label: "Пос Карт" },
  { key: "PosBelen", label: "Пос Бэлэн" },
  { key: "PosKhariltsakh", label: "Пос Данс" },
  { key: "tseneglelt", label: "Хэтэвч" },
  { key: "tur", label: "Төр" },
  { key: "golomt", label: "Голомт" },
  { key: "tdb", label: "ХХБ" },
  { key: "kapitron", label: "Капитрон" },
  { key: "Fitness", label: "Fitness" },
  { key: "ugaalga", label: "Угаалга" },
  { key: "Соёолж Ц/Д", label: "Соёолж Ц/Д" },
];

const paymentColumns = paymentTypes.map(({ key, label }) => ({
  title: label,
  __style__: { h: "right" },
  __numFmt__: "#,##0",
  __cellType__: "TypeNumeric",
  dataIndex: "tuukh",
  render(v, record) {
    if (record?.isSummary) {
      return record[`total_${key}`] || 0;
    }

    const tulbur = v?.[0]?.tulbur || [];
    const { payments } = splitTulbur(tulbur);

    const payment = payments.find((p) => p.turul === key);
    return payment ? payment.dun : 0;
  },
}));
const isDiscountPayment = (payment) => {
  if (!payment?.turul) return false;
  const t = String(payment.turul).toLowerCase();
  return t.includes("khungulult") || t.startsWith("ugaalga");
};

const splitTulbur = (payments) => {
  const result = { payments: [], discount: 0 };
  if (!Array.isArray(payments)) return result;

  payments.forEach((item) => {
    const amount = Number(item?.dun) || 0;
    if (isDiscountPayment(item)) {
      result.discount += amount;
    } else {
      result.payments.push(item);
    }
  });

  return result;
};

const getPaymentTotal = (row) => {
  const { payments } = splitTulbur(row?.tuukh?.[0]?.tulbur);
  if (!payments.length) return 0;
  return payments.reduce((sum, item) => sum + (Number(item?.dun) || 0), 0);
};

function generateChild(mur, turul) {
  if (mur?.length > 0) {
    let res = [];
    for (let i = 0; i < mur.length; i++) {
      const a = mur[i];
      if (!!a?.turul) if (a.turul !== turul) continue;
      res.push({
        value: !!a?.ner ? a.ner : a?.cameraIP,
        title: !!a?.ner ? (
          a.ner + (a?.turul ? " / " + a?.turul : "")
        ) : (
          <b key={a?.cameraIP} className="text-green-400 hover:text-green-800">
            {t("Камер")}-{a?.cameraIP}
          </b>
        ),
        children: generateChild(!!a?.khaalga ? a.khaalga : a?.camera, turul),
        disabled: false,
        disableCheckbox: true,
        selectable: !a?.ner,
        checkable: !a?.ner,
      });
    }
    return res;
  }
  return [];
}

function Zogsool({ token }) {
  const { t, i18n } = useTranslation();
  const { baiguullaga, ajiltan, barilgiinId } = useAuth();
  const excelref = useRef(null);
  const tailanRef = React.useRef(null);
  const [cameraData, setCameraData] = useState([null, null]);

  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);
  const [zogsoolId, setZogsoolId] = useState();
  const [tulbur, setTulbur] = useState("");
  const [tuluv, setTuluv] = useState("");
  const [tuluvZurchil, setTuluvZurchil] = useState("");
  const [ajiltniiNers, setAjiltniiNers] = useState([]);
  const [selectedAjiltan, setSelectedAjiltan] = useState(null);
  const [selectedRowkeys, setSelectedRowkeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowkeys(newSelectedRowKeys);
  };

  const streamQuery = useMemo(() => {
    var query = {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
      createdAt: {
        $lte:
          ognoo && ognoo[1]
            ? moment(ognoo[1])?.format("YYYY-MM-DD 23:59:59")
            : moment().format("YYYY-MM-DD 23:59:59"),
      },
    };
    if (tuluvZurchil === 0) {
      query["tuukh.0.tuluv"] = 0;
    } else if (tuluvZurchil === 1) {
      // Төлсөн: Include both tuluv === 1 and tuluv === 2, and require garsanTsag to exist
      query["tuukh.0.tuluv"] = { $in: [1, 2] };
      query["tuukh.0.tsagiinTuukh.0.garsanTsag"] = { $exists: true };
    } else if (tuluvZurchil === 2) {
      // Зөрчилтэй
      query["tuukh.0.tuluv"] = 2;
    } else if (tuluvZurchil === 3) {
      // Тодорхойгүй
      query["tuukh.0.tuluv"] = 3;
    }
    return query;
  }, [baiguullaga?._id, barilgiinId, tuluvZurchil, ognoo]);

  const orderZurchil = { createdAt: -1 };
  const searchKeysZurchil = ["mashiniiDugaar"];

  const {
    jagsaalt: zurchilteiJagsaalt,
    mutate: zurchilteiMutate,
    setKhuudaslalt: setZurchilKhuudaslalt,
    data: zurchilteiData,
  } = useJagsaalt(
    "/zurchilteiMashin",
    streamQuery,
    orderZurchil,
    null,
    searchKeysZurchil,
  );

  const columnsZurchil = useMemo(() => {
    return [
      {
        title: "№",
        align: "center",
        dataIndex: "dugaar",
        width: "3rem",
        render: (text, record, index) =>
          (zurchilteiJagsaalt?.khuudasniiDugaar || 0) *
          (zurchilteiJagsaalt?.khuudasniiKhemjee || 0) -
          (zurchilteiJagsaalt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: t("Огноо"),
        align: "center",
        width: "8rem",
        dataIndex: "createdAt",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v, parents) {
          return v && moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Орсон"),
        align: "center",
        width: "8rem",
        dataIndex: "orsonTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v, parents) {
          return v && moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Гарсан"),
        align: "center",
        width: "8rem",
        dataIndex: "garsanTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v, parents) {
          return v && moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Дугаар"),
        align: "center",
        width: "6rem",
        dataIndex: "mashiniiDugaar",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Хугацаа/мин"),
        align: "center",
        width: "8rem",
        ellipsis: true,
        dataIndex: "niitKhugatsaa",
      },
      {
        title: t("Орсон хаалга"),
        align: "center",
        width: "8rem",
        dataIndex: "orsonKhaalga",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Гарсан хаалга"),
        align: "center",
        width: "8rem",
        dataIndex: "garsanKhaalga",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Төлбөр"),
        align: "right",
        width: "9rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "niitDun",
        render(v, parents) {
          return v && formatNumber(v, 0);
        },
      },
      {
        title: (
          <Popover
            placement="bottom"
            trigger="click"
            content={
              <div className="space-y-2">
                <div
                  onClick={() => {
                    setTuluvZurchil("");
                  }}
                  className={`relative ${tuluvZurchil === "" && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Бүгд")}
                </div>
                <div
                  onClick={() => {
                    setTuluvZurchil(1);
                  }}
                  className={`relative ${tuluvZurchil === 1 && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Төлсөн")}
                </div>
                <div
                  onClick={() => {
                    setTuluvZurchil(0);
                  }}
                  className={`relative ${tuluvZurchil === 0 && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Төлөөгүй")}
                </div>
                <div
                  onClick={() => {
                    setTuluvZurchil(2);
                  }}
                  className={`relative ${tuluvZurchil === 2 && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Зөрчилтэй")}
                </div>
                {/* <div
                  onClick={() => {
                    setTuluvZurchil(3);
                  }}
                  className={`relative ${
                    tuluvZurchil === 3 && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Тодорхойгүй")}
                </div> */}
              </div>
            }
          >
            <div
              className={`flex cursor-pointer items-center justify-center gap-3`}
            >
              <FilterOutlined className="text-lg text-green-600" />
              {t("Төлөв")}
            </div>
          </Popover>
        ),
        align: "center",
        width: "4rem",
        dataIndex: "tuluv",
        showSorterTooltip: false,
        render(v) {
          return (
            <div
              className={`${v === 1
                ? "bg-green-500 text-white dark:bg-green-700"
                : v === 2
                  ? "bg-orange-500 text-white dark:bg-orange-700"
                  : v === 3
                    ? "bg-gray-500 text-white dark:bg-gray-700"
                    : "bg-red-500 text-white dark:bg-red-700"
                } flex select-none items-center justify-center rounded-md border px-5 py-[2px] font-medium dark:text-white`}
            >
              {v === 1
                ? "Төлсөн"
                : v === 2
                  ? "Зөрчилтэй"
                  : v === 3
                    ? "Тодорхойгүй"
                    : v === -4
                      ? "Төлбөртэй"
                      : "Төлөөгүй"}
            </div>
          );
        },
      },
    ];
  }, [tuluvZurchil]);

  const [shaltgaan, setShaltgaan] = useState("Цэвэрлэсэн");
  const [tootsooKhelber, setTootsooKhelber] = useState("1");
  const ZURCHIL_TAB_KEY = "4";
  const DAILY_CLOSING_TAB_KEY = "3";

  const rowSelection = {
    selectedRowKeys: selectedRowkeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => {
      if (baiguullaga?._id !== "662de8c8919a3695ffe51e36") {
        if (baiguullaga?.tokhirgoo?.zurchulMsgeerSanuulakh && tootsooKhelber === ZURCHIL_TAB_KEY) {
          return {
            disabled: record?.tuluv === 1,
          };
        } else {
          const untraakh = !record?.tuukh?.[0]?.uneguiGarsan && !record?.tuukh?.[0]?.garsanKhaalga;
          return {
            disabled: !untraakh,
          };
        }
      }
      return {
        disabled: false,
      };
    },
  };

  const tseverlekh = () => {
    setShaltgaan("Цэвэрлэсэн");
  };

  const [shuult, setShuult] = useState("");

  const tooQuery = useMemo(() => {
    return {
      ...(ognoo && {
        ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      }),
    };
  }, [ognoo]);

  const { uilchiluulegchToololt, uilchiluulegchToololtMutate } =
    useUilchluulegchToololt(token, tooQuery);

  const { order, onChangeTable, setOrder } = useOrder({
    "tuukh.0.tsagiinTuukh.0.garsanTsag": -1,
  });

  const que = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
    };
  }, [baiguullaga?._id, barilgiinId]);

  const query = useMemo(() => {
    const aa = !!shuult?.query ? shuult.query : {};

    const baseQuery = {
      ...(ognoo && {
        createdAt: {
          $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
        },
      }),
      ...aa,
    };

    if (!!zogsoolId) {
      baseQuery["tuukh.zogsooliinId"] = zogsoolId;
    }

    if (!!selectedAjiltan) {
      baseQuery["tuukh.burtgesenAjiltaniiId"] = selectedAjiltan;
    }

    if (!!tulbur && tulbur !== "") {
      baseQuery["tuukh.tulbur.turul"] =
        tulbur === "card"
          ? { $in: ["khaan", "tdb", "khas", "golomt", "kapitron", "tur"] }
          : tulbur?.toLowerCase() === "qpay"
            ? { $in: ["qpay", "qpayUridchilsan", "Qpay"] }
            : tulbur;
    }

    if (tuluv !== "" && tuluv !== null && tuluv !== undefined) {
      const tuluvValue = Number(tuluv);

      switch (tuluvValue) {
        case 0:
          baseQuery["tuukh.0.tuluv"] = 0;
          baseQuery["tuukh.0.garsanKhaalga"] = { $exists: false };
          baseQuery["tuukh.0.uneguiGarsan"] = { $exists: false };
          baseQuery["tuukh.0.tsagiinTuukh.0.garsanTsag"] = { $exists: false };

          break;
        case 1:
          baseQuery.$and = [
            { "tuukh.0.tuluv": { $in: [1, 2] } },

            {
              $or: [
                { "tuukh.0.tulbur.0.turul": { $ne: "khungulult" } },
                {
                  $and: [
                    { "tuukh.0.tulbur.0.turul": "khungulult" },
                    {
                      $expr: {
                        $ne: [
                          { $arrayElemAt: [{ $arrayElemAt: ["$tuukh.tulbur.dun", 0] }, 0] },
                          { $arrayElemAt: ["$tuukh.tulukhDun", 0] },
                        ]
                      }
                    }
                  ]
                }
              ]
            }
          ];


          break;

        case 2:
          baseQuery["niitDun"] = { $eq: 0 };
          baseQuery["tuukh.0.tsagiinTuukh.garsanTsag"] = { $exists: true };
          break;
        case 3:
          baseQuery["tuukh.0.tuluv"] = -2;
          break;

        case 4:

          baseQuery["tuukh.0.tuluv"] = -4;
          baseQuery["tuukh.0.tsagiinTuukh.0.garsanTsag"] = { $exists: false };
          break;

        case 5:
          baseQuery["niitDun"] = { $gt: 0 };
          baseQuery["tuukh.0.uneguiGarsan"] = { $exists: false };
          break;
      }
    }

    if (tootsooKhelber === "2") {
      delete baseQuery.createdAt;
      baseQuery["tuukh.tulbur.ognoo"] = {
        $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
        $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      };
    }

    return baseQuery;
  }, [
    ognoo,
    zogsoolId,
    selectedAjiltan,
    shuult,
    tuluv,
    tulbur,
    tootsooKhelber,
  ]);

  const or = useMemo(() => {
    var nemeh;
    if (tuluv !== "") {
      if (tuluv === 2) {
        nemeh = [
          { niitDun: 0, "tuukh.0.tuluv": { $ne: -2 } },
          { turul: "Үнэгүй" },
          { "tuukh.0.uneguiGarsan": { $exists: true } },
          {
            $expr: {
              $and: [
                { $eq: [{ $arrayElemAt: [{ $arrayElemAt: ["$tuukh.tulbur.turul", 0] }, 0] }, "khungulult"] },
                {
                  $eq: [
                    { $arrayElemAt: [{ $arrayElemAt: ["$tuukh.tulbur.dun", 0] }, 0] },
                    { $arrayElemAt: ["$tuukh.tulukhDun", 0] },
                  ]
                },
              ],
            },
          },
        ];
      } else if (tuluv === 5) {
        nemeh = [
          {
            "tuukh.0.tuluv": -4,
            "tuukh.0.uneguiGarsan": { $exists: false },
            tuukh: { $elemMatch: { tulbur: { $eq: [] } } },
          },
          {
            "tuukh.0.tuluv": 0,
            "tuukh.0.tsagiinTuukh.0.garsanTsag": { $exists: true },
            "tuukh.0.uneguiGarsan": { $exists: false },
          },
        ];
      }
    }
    return nemeh;
  }, [ognoo, zogsoolId, shuult, tuluv, tulbur]);

  const {
    uilchluulegchGaralt,
    setUilchluulegchKhuudaslalt,
    uilchluulegchMutate,
    isValidating,
  } = useUilchluulegchZogsool(
    token,
    baiguullaga?._id,
    query,
    order,
    or,
    1000,
    tootsooKhelber,
  );

  const { jagsaalt } = useJagsaalt("/zogsoolJagsaalt", que, { createdAt: -1 });

  const kassCameraKhaaltQuery = useMemo(() => {
    const query = {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
    };

    if (ognoo?.[0] && ognoo?.[1]) {
      query.nevtersenOgnoo = {
        $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
        $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      };
    }

    return query;
  }, [baiguullaga?._id, barilgiinId, ognoo]);

  const {
    jagsaalt: kassCameraKhaaltJagsaalt,
    mutate: kassCameraKhaaltMutate,
    setKhuudaslalt: setKassCameraKhuudaslalt,
    data: kassCameraKhaaltData,
    khuudaslalt: kassCameraKhuudaslalt,
  } = useJagsaalt(
    "/kassCameraKhaalt",
    kassCameraKhaaltQuery,
    {
      khaaltOgnoo: -1,
    },
    null,
    ["ajiltaniiNer"],
  );

  const orlogoQuery = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      zogsooliinId: jagsaalt[0]?._id,
      barilgiinId: barilgiinId,
      ...(ognoo && {
        ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      }),
    };
  }, [ognoo, jagsaalt, uilchluulegchGaralt, barilgiinId]);

  function tulburiinDelgerengui() {
    const footer = [
      <div className="flex w-full items-center justify-between">
        <Button type="primary" onClick={() => tailanRef.current.khaaya()}>
          {t("Хаах")}
        </Button>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => tailanRef.current.khadgalya()}
        >
          {t("Хэвлэх")}
        </Button>
      </div>,
    ];
    modal({
      title: t("Төлбөрийн дэлгэрэнгүй"),
      icon: <FileExcelOutlined />,
      content: (
        <TulburiinDelgerenguiTailan
          ref={tailanRef}
          defualtOgnoo={ognoo}
          ajiltan={ajiltan}
          garsanKhaalga={null}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          barilgiinId={barilgiinId}
          cameraData={cameraData}
        />
      ),
      footer,
    });
  }

  function tseverliy() {
    const songogdson = [...selectedRowkeys];
    if (songogdson && songogdson.length > 0) {
      confirm({
        title: t("Анхаар"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        content: (
          <div>
            <div>Тайлбар:</div>
            <Input
              value={shaltgaan}
              placeholder="Тайлбар оруулна уу..."
              onChange={(v) => setShaltgaan(v)}
            />
          </div>
        ),
        onOk: () => {
          if (!shaltgaan) {
            notification.warn({ message: "Тайлбар оруулна уу", duration: 2 });
          } else {
            if (
              baiguullaga?.tokhirgoo?.zurchulMsgeerSanuulakh &&
              tootsooKhelber === ZURCHIL_TAB_KEY
            ) {
              uilchilgee(token)
                .post("/zurchiluudTulsunBolgoy", {
                  utguud: songogdson,
                  shaltgaan: shaltgaan,
                })
                .then(({ data }) => {
                  if (data === "Amjilttai") {
                    notification.success({
                      message: "Амжилттай",
                      duration: 2,
                    });
                    uilchluulegchMutate();
                    zurchilteiMutate();
                    tseverlekh();
                    setSelectedRowkeys([]);
                  }
                })
                .catch((err) => aldaaBarigch(err));
            } else
              uilchilgee(token)
                .post("/uilchluulegchTseverliy", {
                  utguud: songogdson,
                  shaltgaan: shaltgaan,
                })
                .then(({ data }) => {
                  if (data === "Amjilttai") {
                    notification.success({
                      message: "Амжилттай цэвэрлэгдлээ",
                      duration: 2,
                    });
                    uilchluulegchMutate();
                    kassCameraKhaaltMutate();
                    tseverlekh();
                    setSelectedRowkeys([]);
                  } else if (data !== "Amjilttai") {
                    notification.warning({
                      message: "Зөвхөн идэвхтэй машины дугаарыг цэвэрлэх боломжтой!",
                      duration: 2,
                    });
                  }
                })
                .catch((err) => aldaaBarigch(err));
          }
        },
      });
    } else {
      notification.warning({
        message: t("Цэвэрлэх үйлчлүүлэгч сонгоно уу!"),
        duration: 1,
      });
    }
  }
  console.log(selectedRowkeys);
  const ustgakh = () => {
    const songogdson = [...selectedRowkeys];

    if (songogdson && songogdson.length > 0) {
      confirm({
        title: t("Анхаар"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        content: (
          <div>
            <div style={{ marginBottom: 8 }}>
              Та {songogdson.length} үйлчлүүлэгчийг устгахдаа итгэлтэй байна уу?
            </div>
          </div>
        ),
        onOk: () => {
          return uilchilgee(token)
            .post("/uilchluulegchUstgay", {
              ids: songogdson,
              shaltgaan: shaltgaan,
            })
            .then(({ data }) => {
              if (data === "Amjilttai") {
                notification.success({
                  message: `${songogdson.length} үйлчлүүлэгч амжилттай устгагдлаа`,
                  duration: 2,
                });
                setSelectedRowkeys([]);
                uilchluulegchMutate();
              }
            })
            .catch((err) => {
              aldaaBarigch(err);
              throw err;
            });
        },
        onCancel: () => {
          setShaltgaan("Цэвэрлэсэн");
        },
      });
    } else {
      notification.warning({
        message: t("Устгах үйлчлүүлэгч сонгоно уу!"),
        duration: 1,
      });
    }
  };
  const toololt = useMemo(
    () => [
      {
        name: "Үйлчлүүлэгч",
        too: formatNumber(
          !!uilchiluulegchToololt &&
          uilchiluulegchToololt[0].turul.find((a) => a._id === null)?.too,
          0,
        ),
        query: {
          turul: {
            $nin: [
              "Дотоод",
              "Түрээслэгч",
              "Гэрээт",
              "Дурын",
              "СӨХ",
              "Байгууллага",
              "VIP",
            ],
          },
        },
      },
      {
        name: "Түрээслэгч",
        too: formatNumber(
          !!uilchiluulegchToololt &&
          uilchiluulegchToololt[0].turul.find((a) => a._id === "Түрээслэгч")
            ?.too,
          0,
        ),
        query: {
          turul: "Түрээслэгч",
        },
      },
      {
        name: "Гэрээт",
        too: formatNumber(
          !!uilchiluulegchToololt &&
          uilchiluulegchToololt[0].turul.find((a) => a._id === "Гэрээт")?.too,
          0,
        ),
        query: {
          turul: "Гэрээт",
        },
      },
      {
        name: "Дотоод",
        too: formatNumber(
          !!uilchiluulegchToololt &&
          uilchiluulegchToololt[0].turul.find((a) => a._id === "Дотоод")?.too,
          0,
        ),
        query: {
          turul: "Дотоод",
        },
      },
      {
        name: "Дурын",
        too: formatNumber(
          !!uilchiluulegchToololt &&
          uilchiluulegchToololt[0].turul.find((a) => a._id === "Дурын")?.too,
          0,
        ),
        query: {
          turul: "Дурын",
        },
      },
      {
        name: "СӨХ",
        too: formatNumber(
          !!uilchiluulegchToololt &&
          uilchiluulegchToololt[0].turul.find((a) => a._id === "СӨХ")?.too,
          0,
        ),
        query: {
          turul: "СӨХ",
        },
      },
      {
        name: "Байгууллага",
        too: formatNumber(
          !!uilchiluulegchToololt &&
          uilchiluulegchToololt[0].turul.find((a) => a._id === "Байгууллага")
            ?.too,
          0,
        ),
        query: {
          turul: "Байгууллага",
        },
      },
      {
        name: "VIP",
        too: formatNumber(
          !!uilchiluulegchToololt &&
          uilchiluulegchToololt[0].turul.find((a) => a._id === "VIP")?.too,
          0,
        ),
        query: {
          turul: "VIP",
        },
      },

      {
        name: "Зөрчилтэй",
        too: formatNumber(
          !!uilchiluulegchToololt &&
          uilchiluulegchToololt[0].tuluv.find((a) => a._id === -2)?.too,
          0,
        ),
        query: { "tuukh.tuluv": -2 },
      },
    ],
    [uilchiluulegchToololt, uilchluulegchGaralt],
  );

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

  useEffect(() => {
    const ajiltnuud = [];
    uilchluulegchGaralt?.jagsaalt?.forEach((element) => {
      const ajiltanId = element.tuukh[0]?.burtgesenAjiltaniiId;
      if (ajiltanId && !ajiltnuud.includes(ajiltanId)) {
        ajiltnuud.push(ajiltanId);
      }
    });

    if (ajiltnuud.length > 0) {
      uilchilgee(token)
        .get("/ajiltan", {
          params: { query: { _id: { $in: ajiltnuud } } },
        })
        .then(({ data }) => {
          if (data?.jagsaalt?.length > 0) {
            setAjiltniiNers(
              data.jagsaalt.map((a) => ({
                ner: a.ner,
                id: a._id,
              })),
            );
          }
        })
        .catch((err) => console.error("Error fetching ajiltan:", err));
    }
  }, [uilchluulegchGaralt?.jagsaalt, token]);

  const zogsooAjiltanQuery = useMemo(() => {
    const paths = [
      "/khyanalt/zogsool",
      "/khyanalt/zogsool/camera",
      "/khyanalt/kiosk",
    ];

    if (typeof window !== "undefined" && window.location?.pathname) {
      paths.push(window.location.pathname);
    }

    return {
      tsonkhniiErkhuud: { $in: paths },
    };
  }, []);

  const { ajilchdiinGaralt, setAjiltniiKhuudaslalt } = useAjiltniiJagsaalt(
    token,
    baiguullaga?._id,
    barilgiinId,
    zogsooAjiltanQuery,
    undefined,
  );

  // Өдрийн хаалтын хүснэгтийн баганууд
  const kassCameraKhaaltColumns = useMemo(() => {
    const getWorkedMinutes = (record) => {
      if (!record?.nevtersenOgnoo || !record?.khaaltOgnoo) return null;
      const start = moment(record.nevtersenOgnoo);
      const end = moment(record.khaaltOgnoo);
      if (!start.isValid() || !end.isValid()) return null;
      const diff = end.diff(start, "minutes");
      return diff >= 0 ? diff : null;
    };

    const formatWorkedDuration = (record) => {
      const diffMinutes = getWorkedMinutes(record);
      if (diffMinutes === null) return "-";
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0",
      )}`;
    };

    const getTotalPayment = (payments) => {
      if (!Array.isArray(payments) || payments.length === 0) return 0;
      return payments.reduce((sum, item) => sum + Number(item?.dun || 0), 0);
    };

    return [
      {
        title: "№",
        align: "center",
        dataIndex: "dugaar",
        width: "3rem",
        render: (text, record, index) => index + 1,
      },
      {
        title: t("Ажилтны нэр"),
        align: "center",
        width: "12rem",
        dataIndex: "ajiltaniiNer",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Нэвтэрсэн огноо"),
        align: "center",
        width: "10rem",
        dataIndex: "nevtersenOgnoo",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          return v && moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Хаалт огноо"),
        align: "center",
        width: "10rem",
        dataIndex: "khaaltOgnoo",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          return v && moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Ажиллсан хугацаа/цаг"),
        align: "center",
        width: "10rem",
        dataIndex: "nevtersenOgnoo",
        showSorterTooltip: false,
        sorter: (a, b) =>
          (getWorkedMinutes(a) || 0) - (getWorkedMinutes(b) || 0),
        render: (_, record) => formatWorkedDuration(record),
      },
      {
        title: t("Гарсан камер"),
        align: "center",
        width: "10rem",
        dataIndex: "garsanCameraIp",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Төлбөрийн мэдээлэл"),
        align: "center",
        width: "15rem",
        dataIndex: "tulbur",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          if (!v || v.length === 0) return "-";

          if (v.length > 1) {
            return (
              <div className="flex justify-center">
                <Popover
                  content={() =>
                    v.map((tulbur, index) => (
                      <div key={index} className="dark:text-gray-200">
                        {tulburKhurvuulekh(tulbur.turul)}:{" "}
                        {formatNumber(tulbur.dun, 0)}₮
                      </div>
                    ))
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <Button
                    icon={<ShareAltOutlined style={{ fontSize: "16px" }} />}
                  ></Button>
                </Popover>
              </div>
            );
          } else {
            return (
              <div className="text-center">
                {tulburKhurvuulekh(v[0]?.turul)}: {formatNumber(v[0]?.dun, 0)}₮
              </div>
            );
          }
        },
      },
      {
        title: t("Нийт төлбөр"),
        align: "right",
        width: "10rem",
        dataIndex: "tulbur",
        showSorterTooltip: false,
        sorter: (a, b) =>
          (getTotalPayment(a?.tulbur) || 0) - (getTotalPayment(b?.tulbur) || 0),
        render(value) {
          const total = getTotalPayment(value);
          return formatNumber(total, 2);
        },
      },
    ];
  }, [t]);

  const columns = useMemo(() => {
    const shinecol =
      shuult.name === "Түрээслэгч"
        ? [
          {
            title: t("Талбай"),
            align: "center",
            width: "6rem",
            dataIndex: "mashin",
            render(v) {
              return v && v.ezemshigchiinTalbainDugaar;
            },
          },
          {
            title: t("Утас"),
            align: "center",
            width: "8rem",
            dataIndex: "mashin",
            render(v) {
              return v && v.ezemshigchiinUtas;
            },
          },
        ]
        : [];
    return [
      {
        title: "№",
        align: "center",
        dataIndex: "dugaar",
        width: "3rem",
        render: (text, record, index) =>
          (uilchluulegchGaralt?.khuudasniiDugaar || 0) *
          (uilchluulegchGaralt?.khuudasniiKhemjee || 0) -
          (uilchluulegchGaralt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: t("Орсон"),
        align: "center",
        width: "8rem",
        dataIndex: "tuukh.0.tsagiinTuukh.0.orsonTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v, parents) {
          const d = parents?.tuukh[0]?.tsagiinTuukh[0]?.orsonTsag;
          return d && moment(d).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Гарсан"),
        align: "center",
        width: "8rem",
        dataIndex: "tuukh.0.tsagiinTuukh.0.garsanTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v, parents) {
          const d =
            parents?.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag ||
            parents?.tuukh[1]?.tsagiinTuukh[0]?.garsanTsag;
          return d && moment(d).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Төрөл"),
        align: "center",
        width: "8rem",
        dataIndex: "turul",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (v) => (!!v ? v : "Үйлчлүүлэгч"),
      },
      {
        title: t("Дугаар"),
        align: "center",
        width: "6rem",
        dataIndex: "mashiniiDugaar",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      ...shinecol,
      {
        title: t("Хугацаа/мин"),
        align: "center",
        width: "8rem",
        ellipsis: true,
        dataIndex: "tuukh",
        render(v) {
          const d1 = moment(v[0]?.tsagiinTuukh[0]?.orsonTsag);
          const d2 = moment(v[0]?.tsagiinTuukh[0]?.garsanTsag);
          const diff = d2.diff(d1, "minutes");
          return diff && diff;
        },
      },
      {
        title: t("Бодогдсон"),
        align: "right",
        width: "9rem",
        showSorterTooltip: true,
        sorter: (a, b) => {
          const getTotal = (data) =>
            data.niitDun > 0
              ? data.niitDun
              : ((data.tuukh?.[0]?.tulukhDun || 0) +
                (data.tuukh?.[1]?.tulukhDun || 0));

          return getTotal(a) - getTotal(b);
        },
        render(v, data) {
          const hasZeroTulukhDun = data.tuukh?.some((t) => t?.tulukhDun === 0);

          if (hasZeroTulukhDun) {
            return formatNumber(data.niitDun || 0, 2);
          }

          const total =
            v > 0
              ? v
              : ((data.tuukh?.[0]?.tulukhDun || 0) +
                (data.tuukh?.[1]?.tulukhDun || 0));

          return formatNumber(total, 2);
        },
      },

      {
        title: (
          <Popover
            placement="bottom"
            content={
              <div className="space-y-2">
                <div
                  onClick={() => setTulbur("")}
                  className={`relative ${tulbur === "" && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Бүгд")}
                </div>
                <div
                  onClick={() => setTulbur("belen")}
                  className={`relative ${tulbur === "belen" && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Бэлэн")}
                </div>
                <div
                  onClick={() => setTulbur("card")}
                  className={`relative ${tulbur === "card" && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Карт")}
                </div>
                <div
                  onClick={() => setTulbur("khariltsakh")}
                  className={`relative ${tulbur === "khariltsakh" && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  {t("Данс")}
                </div>
                <div
                  onClick={() => setTulbur("toki")}
                  className={`relative ${tulbur === "toki" && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  Токи
                </div>
                <div
                  onClick={() => setTulbur("kiosk")}
                  className={`relative ${tulbur === "kiosk" && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  Киоск
                </div>
                <div
                  onClick={() => setTulbur("khungulult")}
                  className={`relative ${tulbur === "khungulult" && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  Хөнгөлөлт
                </div>
                {
                  baiguullaga?._id === "6115f350b35689cdbf1b9da3" && (
                    <>
                      <div
                        onClick={() => setTulbur("Fitness")}
                        className={`relative ${tulbur === "Fitness" ? "bg-green-500 text-white" : ""
                          } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                      >
                        Fitness
                      </div>

                      <div
                        onClick={() => setTulbur("Ugaalga")}
                        className={`relative ${tulbur === "Ugaalga" ? "bg-green-500 text-white" : ""
                          } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                      >
                        Угаалга
                      </div>
                    </>
                  )
                }
                {
                  baiguullaga?._id === "6731b43bc23730ac1908da2d" && (
                    <div
                      onClick={() => setTulbur("Соёолж Ц/Д")}
                      className={`relative ${tulbur === "Соёолж Ц/Д" && "bg-green-500 text-white"
                        } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                    >
                      Соёолж Ц/Д
                    </div>
                  )
                }
                <div
                  onClick={() => setTulbur("qpay")}
                  className={`relative ${tulbur?.toLowerCase() === "qpay" &&
                    "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Qpay")}
                </div>
                <div
                  onClick={() => setTulbur("GadaaQR")}
                  className={`relative ${tulbur === "GadaaQR" && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  Гадаа QR
                </div>
                <div
                  onClick={() => setTulbur("DotorQR")}
                  className={`relative ${tulbur === "DotorQR" && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  Дотор QR
                </div>
              </div>
            }
          >
            <div
              className={`flex cursor-pointer items-center justify-center gap-3`}
            >
              <FilterOutlined className="text-lg text-green-600" />
              {t("Төлбөр")}
            </div>
          </Popover>
        ),
        align: "right",
        width: "9rem",
        dataIndex: "tuukh",
        render(v) {
          const { payments } = splitTulbur(v?.[0]?.tulbur);
          if (!payments.length) return null;

          if (payments.length > 1) {
            return (
              <div className="flex justify-center">
                <Popover
                  content={() =>
                    payments.map((mur) => (
                      <div key={mur?.turul}>
                        {tulburKhurvuulekh(mur.turul)}: {mur.dun}
                      </div>
                    ))
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <Button
                    icon={<ShareAltOutlined style={{ fontSize: "16px" }} />}
                  ></Button>
                </Popover>
              </div>
            );
          }

          const type = payments[0];
          const r = tulburKhurvuulekh(type?.turul);
          const d = formatNumber(type?.dun, 0);

          return (
            r && (
              <div
                className={`flex items-center ${d ? "justify-between" : "justify-center"
                  } `}
              >
                <div>{r}</div>
                {d && <div>{d}</div>}
              </div>
            )
          );
        },
      },
      {
        title: t("Хөнгөлөлт"),
        align: "right",
        width: "9rem",
        dataIndex: "tuukh",
        render(v) {
          const { discount } = splitTulbur(v?.[0]?.tulbur);
          if (!discount) return null;
          return formatNumber(discount, 0);
        },
      },
      {
        title: t("И-Баримт"),
        align: "right",
        width: "9rem",
        dataIndex: "ebarimtAvsanDun",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v, parents) {
          return v && formatNumber(v, 0);
        },
      },
      {
        title: (
          <Popover
            placement="bottom"
            content={
              <div className="space-y-2">
                <div
                  onClick={() => {
                    setTuluv("");
                  }}
                  className={`relative ${tuluv === "" && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Бүгд")}
                </div>
                <div
                  onClick={() => {
                    setTuluv(1);
                  }}
                  className={`relative ${tuluv === 1 && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Төлсөн")}
                </div>
                <div
                  onClick={() => {
                    setTuluv(0);
                  }}
                  className={`relative ${tuluv === 0 && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Идэвхтэй")}
                </div>
                <div
                  onClick={() => {
                    setTuluv(5);
                  }}
                  className={`relative ${tuluv === 5 && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Төлбөртэй")}
                </div>
                <div
                  onClick={() => {
                    setTuluv(3);
                  }}
                  className={`relative ${tuluv === 3 && "bg-green-500 text-white"
                    } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Зөрчилтэй")}
                </div>
                {/* <div
                  onClick={() => {
                    setTuluv(4);
                  }}
                  className={`relative ${
                    tuluv === 4 && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Тодорхойгүй")}
                </div> */}
                <div
                  onClick={() => {
                    setTuluv(2);
                  }}
                  className={`relative ${tuluv === 2 && "bg-green-500 text-white"
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
              {t("Төлөв")}
            </div>
          </Popover>
        ),
        align: "center",
        width: "8rem",
        showSorterTooltip: false,
        dataIndex: "tuukh",
        render(v, data) {
          const isKhungulult =
            v[0]?.tulbur?.[0]?.turul === "khungulult" &&
            v[0]?.tulbur?.[0]?.dun === v[0]?.tulukhDun;
          return (
            <div
              className={`${isKhungulult
                ? "bg-gray-500 text-white dark:bg-gray-700"
                : v[0].tuluv === 1 || v[0].tuluv === 2
                  ? "bg-green-500 text-white dark:bg-green-700"
                  : v[0].tuluv === -2
                    ? "bg-red-500 text-white dark:bg-red-700"
                    : (v[0]?.tuluv === 0 || v[0]?.tuluv === -4) && v[0]?.tsagiinTuukh?.[0]?.garsanTsag &&
                      data.niitDun > 0
                      ? "bg-yellow-500 text-white dark:bg-yellow-700"
                      : v[0]?.tuluv === 0 && !v[0]?.tsagiinTuukh?.[0]?.garsanTsag
                        ? "bg-blue-500 text-white dark:bg-blue-700"
                        : v[0]?.tuluv === -3
                          ? "bg-stone-500 text-white dark:bg-stone-700"
                          : "bg-gray-500 text-white dark:bg-gray-700"
                } flex select-none items-center justify-center rounded-md border px-5 py-[2px] font-medium dark:text-white`}
            >
              {
                isKhungulult
                  ? "Үнэгүй"
                  : v[0].tuluv === 1 || v[0].tuluv === 2
                    ? "Төлсөн"
                    : v[0].tuluv === -2
                      ? "Зөрчилтэй"
                      : (v[0]?.tuluv === 0 || v[0]?.tuluv === -4) && data.niitDun > 0
                        ? "Төлбөртэй"
                        : v[0]?.tuluv === 0 && !v[0]?.tsagiinTuukh?.[0]?.garsanTsag
                          ? "Идэвхтэй"
                          : v[0]?.tuluv === -3
                            ? "Цэвэрлэсэн"
                            : "Үнэгүй"
              }
            </div>
          );
        },
      },
      {
        title: t("Шалтгаан"),
        align: "center",
        dataIndex: "tuukh",
        width: "7rem",
        showSorterTooltip: false,
        render: (v, parent) => {
          if (parent.turul === "Үнэгүй" || parent.turul === "Дотоод") {
            return (
              <Tooltip
                placement="top"
                title={parent?.mashin?.temdeglel || parent?.zurchil}
              >
                <div className="max-w-[8rem] cursor-help truncate break-words">
                  {parent?.mashin?.temdeglel || parent?.zurchil}
                </div>
              </Tooltip>
            );
          } else if (parent.turul === "Гэрээт".trim()) {
            return (
              <div>
                {moment(parent?.mashin?.duusakhOgnoo).format("YYYY-MM-DD")}
              </div>
            );
          } else if (
            v?.[0]?.tulbur?.[0]?.turul === "khungulult" &&
            v?.[0]?.tulbur?.[0]?.dun === v?.[0]?.tulukhDun
          ) {
            return (
              <div className="max-w-[8rem] truncate break-words">
                {t("Хөнгөлөлт")}
              </div>
            );
          } else
            return (
              v && (
                <Tooltip
                  placement="top"
                  title={
                    v[0]?.tuluv === -1 ? v[0]?.uneguiGarsan : t(parent.zurchil)
                  }
                >
                  <div className="max-w-[8rem] cursor-help truncate break-words">
                    {v[0]?.tuluv === -1
                      ? v[0]?.uneguiGarsan
                      : !!parent.zurchil
                        ? t(parent.zurchil)
                        : ""}
                  </div>
                </Tooltip>
              )
            );
        },
      },
      {
        title: t("Бүртгэсэн"),
        align: "center",
        dataIndex: "tuukh",
        width: "7rem",
        showSorterTooltip: false,
        render: (v, parent) => {
          return (
            v && (
              <div>
                {String(v[0]?.burtgesenAjiltaniiNer).replace(/\D/g, "").length >
                  9
                  ? ajiltniiNers.find(
                    (a) => a.id === v[0]?.burtgesenAjiltaniiId,
                  )?.ner
                  : v[0]?.burtgesenAjiltaniiNer}
              </div>
            )
          );
        },
      },
      {
        title: () => <VideoCameraAddOutlined />,
        width: "2rem",
        align: "center",
        render: (data) => {
          return (
            <div className="flex justify-center">
              <Popover
                content={() =>
                  data?.tuukh?.map((mur) => (
                    <div className="dark:text-gray-200">{mur.orsonKhaalga}</div>
                  ))
                }
                placement="bottom"
                trigger="click"
              >
                <Button
                  icon={<ShareAltOutlined style={{ fontSize: "16px" }} />}
                ></Button>
              </Popover>
            </div>
          );
        },
      },
      {
        title: () => <VideoCameraOutlined />,
        width: "2rem",
        align: "center",
        render: (data) => {
          return (
            <div className="flex justify-center">
              <Popover
                content={() =>
                  data?.tuukh?.map((mur) => (
                    <div className="dark:text-gray-200">
                      {mur.garsanKhaalga}
                    </div>
                  ))
                }
                placement="bottom"
                trigger="click"
              >
                <Button
                  icon={<ShareAltOutlined style={{ fontSize: "16px" }} />}
                ></Button>
              </Popover>
            </div>
          );
        },
      },
      /*{
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
                    onClick={() => zogsoolBurtegye(data, "zasah")}
                  >
                    <EditOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Зөрчил нэмэх")}</label>
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
      },*/
    ];
  }, [shuult, i18n.language, ajiltniiNers, tulbur, tuluv, selectedRowkeys]);

  useEffect(() => {
    Aos.init({ once: true });
  });
  useEffect(() => {
    const a1 = generateChild(jagsaalt, "Орох");
    const a2 = generateChild(jagsaalt, "Гарах");
    setCameraData([a1, a2]);
  }, [jagsaalt]);

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
      onSearch={(search) => {
        setUilchluulegchKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
        setZurchilKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
        setKassCameraKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
      }}
      tsonkhniiId="61c2c7481c2830c4e6f90ce1"
      loading={isValidating}
    >
      <Card size="small" className="col-span-12 overflow-auto">
        <div className="hideScroll flex w-full gap-3 overflow-x-auto border-solid py-3 md:gap-4">
          {toololt.map((a, i) => (
            <div
              key={i}
              className={`group relative min-w-[120px] flex-1 cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-gray-300 dark:hover:shadow-gray-800 ${a.name === shuult?.name
                ? "border-2 border-green-500 bg-green-50/60 dark:border-green-900 dark:bg-green-950/40"
                : "border-2 border-green-200 bg-green-50/60 dark:border-green-900 dark:bg-green-950/40"
                }`}
              onClick={() => {
                setShuult({ query: a.query, name: a.name });
                setTuluv("");
              }}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
              data-aos-delay={1 + i + "00"}
            >
              <div className="relative h-24 w-full overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                <div className="relative flex h-full flex-col justify-between rounded-2xl p-3">
                  <div>
                    <div className="mb-0.5 bg-gradient-to-r from-green-900 to-green-700 bg-clip-text text-3xl font-bold text-transparent dark:from-green-100 dark:to-green-300">
                      {a.too || 0}
                    </div>
                  </div>
                  <div className="line-clamp-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t(a.name)}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-500 transition-all duration-500 group-hover:w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="col-span-12">
        <div className="grid-cols-3 gap-5 sm:grid xl:flex">
          <div className="flex flex-row gap-2">
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
              className="w-full xl:w-1/2"
            >
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                size="middle"
                value={ognoo}
                onChange={setOgnoo}
              />
            </div>
            {/*<Select
                defaultValue="lucy"
                style={{ width: 120 }}
                // onChange={handleChange}
                options={[jagsaalt.map((zogsool)=>({value: zogsool._id, label: zogsool.ner}))
                ]}
            />*/}
            <Select
              className="xl:w-[245px]"
              defaultValue={t("Бүгд")}
              onChange={setZogsoolId}
            >
              <Select.Option value={false}>{t("Бүгд")}</Select.Option>
              {jagsaalt.map((a) => (
                <Select.Option key={a._id} value={a._id}>
                  {t(a.ner)}
                </Select.Option>
              ))}
            </Select>
            <Select
              className="xl:w-[245px]"
              placeholder={t("Ажилтан")}
              allowClear
              showSearch
              value={selectedAjiltan}
              onChange={setSelectedAjiltan}
              clearIcon={() => (
                <div className="dark:bg-gray-800 dark:text-gray-200 hover:dark:text-gray-400">
                  <CloseCircleOutlined />
                </div>
              )}
              filterOption={false}
              onSearch={(search) =>
                setAjiltniiKhuudaslalt((a) => ({
                  ...a,
                  search,
                  khuudasniiDugaar: 1,
                }))
              }
            >
              {ajilchdiinGaralt?.jagsaalt?.map((mur) => (
                <Select.Option key={`${mur._id}ajiltan`} value={mur._id}>
                  <div className="flex flex-row justify-between">
                    <span className="truncate">
                      {mur.ovog && mur.ovog[0]}.{mur.ner}
                    </span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>

          <div
            className="col-span-1 ml-auto flex w-fit place-content-end justify-start gap-4 xl:justify-end"
            data-aos="zoom-in-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <Popover
              content={() => (
                <div className="flex w-32 flex-col space-y-2">
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                    onClick={() => {
                      const excel = new Excel();
                      if (
                        baiguullaga?.tokhirgoo?.zurchulMsgeerSanuulakh &&
                        tootsooKhelber === ZURCHIL_TAB_KEY
                      ) {
                        uilchilgee(token)
                          .get("zurchilteiMashin", {
                            params: {
                              order: orderZurchil,
                              query: { ...streamQuery },
                              khuudasniiKhemjee: zurchilteiJagsaalt?.niitMur,
                            },
                          })
                          .then(({ data }) => {
                            excel
                              .addSheet("Зөрчил сануулах жагсаалт")
                              .addColumns([
                                {
                                  title: "Огноо",
                                  __style__: { h: "center" },
                                  dataIndex: "createdAt",
                                  render: (v) => {
                                    return (
                                      v && moment(v).format("YYYY-MM-DD HH:mm")
                                    );
                                  },
                                },
                                {
                                  title: "Орсон",
                                  __style__: { h: "center" },
                                  dataIndex: "orsonTsag",
                                  render: (v) => {
                                    return (
                                      v && moment(v).format("YYYY-MM-DD HH:mm")
                                    );
                                  },
                                },
                                {
                                  title: "Гарсан",
                                  dataIndex: "garsanTsag",
                                  __style__: { h: "center" },
                                  render: (v) => {
                                    return (
                                      v && moment(v).format("YYYY-MM-DD HH:mm")
                                    );
                                  },
                                },
                                {
                                  title: "Дугаар",
                                  __style__: { h: "center" },
                                  dataIndex: "mashiniiDugaar",
                                  render: (v) => {
                                    return v && String(v).toUpperCase();
                                  },
                                },
                                {
                                  title: "Хугацаа/мин",
                                  __style__: { h: "center" },
                                  dataIndex: "niitKhugatsaa",
                                },
                                {
                                  title: t("Орсон хаалга"),
                                  dataIndex: "orsonKhaalga",
                                  __style__: { h: "center" },
                                },
                                {
                                  title: t("Гарсан хаалга"),
                                  dataIndex: "garsanKhaalga",
                                  __style__: { h: "center" },
                                },
                                {
                                  title: "Төлбөр",
                                  dataIndex: "niitDun",
                                  __style__: { h: "right" },
                                  __numFmt__: "#,##0.00",
                                  __cellType__: "TypeNumeric",
                                },
                                {
                                  title: "Төлөв",
                                  __style__: { h: "center" },
                                  dataIndex: "tuluv",
                                  render: (v) => {
                                    return v === 1 ? "Төлсөн" : "Төлөөгүй";
                                  },
                                },
                              ])
                              .addDataSource(data?.jagsaalt)
                              .saveAs("Зөрчил сануулах жагсаалт.xlsx");
                          })
                          .catch((aldaa) => aldaaBarigch(aldaa));
                      } else if (tootsooKhelber === DAILY_CLOSING_TAB_KEY) {
                        const excelQuery = {
                          ...kassCameraKhaaltQuery,
                        };
                        const searchValue = kassCameraKhuudaslalt?.search;
                        if (searchValue) {
                          excelQuery.$or = [
                            {
                              ajiltaniiNer: {
                                $regex: searchValue,
                                $options: "i",
                              },
                            },
                          ];
                        }
                        uilchilgee(token)
                          .get("/kassCameraKhaalt", {
                            params: {
                              order: { khaaltOgnoo: -1 },
                              query: excelQuery,
                              khuudasniiKhemjee:
                                kassCameraKhaaltData?.niitMur ||
                                kassCameraKhuudaslalt?.khuudasniiKhemjee ||
                                500,
                            },
                          })
                          .then(({ data }) => {
                            const rows = data?.jagsaalt || [];
                            const paymentTypes = Array.from(
                              new Set(
                                rows.flatMap((row) =>
                                  (row?.tulbur || []).map((item) => item.turul),
                                ),
                              ),
                            ).sort();

                            const kharagdakhTulbur = paymentTypes.filter(
                              (type) =>
                                rows.some((row) =>
                                  (row?.tulbur || []).some(
                                    (p) =>
                                      p?.turul === type &&
                                      Number(p?.dun || 0) !== 0,
                                  ),
                                ),
                            );

                            const paymentColumns = kharagdakhTulbur.map(
                              (type) => ({
                                title: tulburKhurvuulekh(type),
                                dataIndex: "tulbur",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render(value) {
                                  if (!value || value.length === 0) return 0;
                                  return value
                                    .filter((p) => p.turul === type)
                                    .reduce(
                                      (sum, curr) =>
                                        sum + Number(curr?.dun || 0),
                                      0,
                                    );
                                },
                              }),
                            );
                            const totalPaymentColumn = {
                              title: t("Нийт төлбөр"),
                              dataIndex: "tulbur",
                              __style__: { h: "right" },
                              __numFmt__: "#,##0.00",
                              __cellType__: "TypeNumeric",
                              render(value) {
                                if (!value || value.length === 0) return 0;
                                return value.reduce(
                                  (sum, curr) => sum + Number(curr?.dun || 0),
                                  0,
                                );
                              },
                            };
                            excel
                              .addSheet("Өдрийн хаалт")
                              .addColumns([
                                {
                                  title: t("Ажилтны нэр"),
                                  dataIndex: "ajiltaniiNer",
                                  __style__: { h: "center" },
                                },
                                {
                                  title: t("Нэвтэрсэн огноо"),
                                  dataIndex: "nevtersenOgnoo",
                                  __style__: { h: "center" },
                                  render: (v) =>
                                    v
                                      ? moment(v).format("YYYY-MM-DD HH:mm")
                                      : "",
                                },
                                {
                                  title: t("Хаалт огноо"),
                                  dataIndex: "khaaltOgnoo",
                                  __style__: { h: "center" },
                                  render: (v) =>
                                    v
                                      ? moment(v).format("YYYY-MM-DD HH:mm")
                                      : "",
                                },
                                {
                                  title: t("Ажилласан цаг"),
                                  dataIndex: "nevtersenOgnoo",
                                  __style__: { h: "center" },
                                  render: (v, record) => {
                                    if (
                                      !record?.nevtersenOgnoo ||
                                      !record?.khaaltOgnoo
                                    )
                                      return "-";
                                    const diffMinutes = moment(
                                      record.khaaltOgnoo,
                                    ).diff(
                                      moment(record.nevtersenOgnoo),
                                      "minutes",
                                    );
                                    if (diffMinutes < 0) return "-";
                                    const hours = Math.floor(diffMinutes / 60);
                                    const minutes = diffMinutes % 60;
                                    return `${String(hours).padStart(
                                      2,
                                      "0",
                                    )}:${String(minutes).padStart(2, "0")}`;
                                  },
                                },
                                {
                                  title: t("Гарсан камер"),
                                  dataIndex: "garsanCameraIp",
                                  __style__: { h: "center" },
                                },
                                ...paymentColumns,
                                totalPaymentColumn,
                              ])
                              .addDataSource(rows)
                              .saveAs("Өдрийн хаалт.xlsx");
                          })
                          .catch((aldaa) => aldaaBarigch(aldaa));
                      } else {
                        const paymentColumns = paymentTypes.map(
                          ({ key, label }) => ({
                            title: label,
                            __style__: { h: "right" },
                            __numFmt__: "#,##0",
                            __cellType__: "TypeNumeric",
                            dataIndex: "tuukh",
                            render(v, record) {
                              if (record?.isSummary) {
                                return record[`total_${key}`] || 0;
                              }

                              const tulbur = v?.[0]?.tulbur || [];
                              const { payments } = splitTulbur(tulbur);

                              const payment = payments.find(
                                (p) => p.turul === key,
                              );
                              return payment ? payment.dun : 0;
                            },
                          }),
                        );

                        const niitColumn = {
                          title: t("Нийт төлбөр"),
                          __style__: { h: "right" },
                          __numFmt__: "#,##0",
                          __cellType__: "TypeNumeric",
                          dataIndex: "tuukh",
                          render(v, record) {
                            if (record?.isSummary) {
                              return record.paymentTotal || 0;
                            }

                            const tulbur = v?.[0]?.tulbur || [];
                            const { payments } = splitTulbur(tulbur);

                            return payments.reduce((total, payment) => {
                              return total + (Number(payment?.dun) || 0);
                            }, 0);
                          },
                        };

                        const rows = Array.isArray(
                          uilchluulegchGaralt?.jagsaalt,
                        )
                          ? uilchluulegchGaralt.jagsaalt
                          : [];

                        const totals = rows.reduce(
                          (acc, row) => {
                            const histories = Array.isArray(row?.tuukh)
                              ? row.tuukh
                              : [];
                            const firstHistory = histories[0] || {};
                            const secondHistory = histories[1] || {};
                            const tulukhValue = Number(
                              firstHistory?.tulukhDun ??
                              secondHistory?.tulukhDun ??
                              0,
                            );
                            acc.tulukhDun += tulukhValue || 0;
                            const paymentTotal = getPaymentTotal(row);
                            acc.niitDun +=
                              paymentTotal || Number(row?.niitDun) || 0;
                            acc.ebarimtAvsanDun +=
                              Number(row?.ebarimtAvsanDun) || 0;

                            const payments = Array.isArray(firstHistory?.tulbur)
                              ? firstHistory.tulbur
                              : [];
                            const { payments: validPayments, discount } =
                              splitTulbur(payments);
                            acc.discountTotal += discount || 0;
                            validPayments.forEach((payment) => {
                              const type = payment?.turul;
                              const amount = Number(payment?.dun) || 0;
                              if (!type) return;
                              acc.paymentTotals[type] =
                                (acc.paymentTotals[type] || 0) + amount;
                            });
                            return acc;
                          },
                          {
                            niitDun: 0,
                            tulukhDun: 0,
                            ebarimtAvsanDun: 0,
                            discountTotal: 0,
                            paymentTotals: {},
                          },
                        );

                        const filteredPaymentTypes = paymentTypes.filter(
                          ({ key }) => {
                            const hasNonZeroValue = rows.some((row) => {
                              const tulbur = row?.tuukh?.[0]?.tulbur || [];
                              const { payments } = splitTulbur(tulbur);
                              const payment = payments.find(
                                (p) => p.turul === key,
                              );
                              return payment && Number(payment.dun) > 0;
                            });

                            const hasSummaryValue =
                              totals.paymentTotals[key] &&
                              totals.paymentTotals[key] > 0;

                            return hasNonZeroValue || hasSummaryValue;
                          },
                        );

                        const filteredPaymentColumns = filteredPaymentTypes.map(
                          ({ key, label }) => ({
                            title: label,
                            __style__: { h: "right" },
                            __numFmt__: "#,##0",
                            __cellType__: "TypeNumeric",
                            dataIndex: "tuukh",
                            render(v, record) {
                              if (record?.isSummary) {
                                return record[`total_${key}`] || 0;
                              }

                              const tulbur = v?.[0]?.tulbur || [];
                              const { payments } = splitTulbur(tulbur);

                              const payment = payments.find(
                                (p) => p.turul === key,
                              );
                              return payment ? payment.dun : 0;
                            },
                          }),
                        );

                        const hasNiitColumnData = rows.some((row) => {
                          const tulbur = row?.tuukh?.[0]?.tulbur || [];
                          const { payments } = splitTulbur(tulbur);
                          const total = payments.reduce((total, payment) => {
                            return total + (Number(payment?.dun) || 0);
                          }, 0);
                          return total > 0;
                        });

                        const hasSummaryPayment = Object.values(
                          totals.paymentTotals,
                        ).some((amount) => Number(amount) > 0);

                        const shouldShowNiitColumn =
                          hasNiitColumnData || hasSummaryPayment;

                        const hasDiscountData =
                          rows.some((row) => {
                            const tulbur = row?.tuukh?.[0]?.tulbur || [];
                            const { discount } = splitTulbur(tulbur);
                            return discount > 0;
                          }) || totals.discountTotal > 0;

                        const summaryPayments = Object.entries(
                          totals.paymentTotals,
                        ).map(([turul, dun]) => ({ turul, dun }));

                        const discountColumn = {
                          title: t("Хөнгөлөлт"),
                          __style__: { h: "right" },
                          __numFmt__: "#,##0.00",
                          __cellType__: "TypeNumeric",
                          dataIndex: "tuukh",
                          render(v, record) {
                            if (record?.discountTotal)
                              return record.discountTotal;
                            const { discount } = splitTulbur(v?.[0]?.tulbur);
                            return discount || 0;
                          },
                        };

                        const excelColumns = [
                          {
                            title: "№",
                            align: "center",
                            dataIndex: "dugaar",
                            width: "2rem",
                            render: (text, record, index) => {
                              if (record?.isSummary) return "";
                              return (
                                (uilchluulegchGaralt?.khuudasniiDugaar || 0) *
                                (uilchluulegchGaralt?.khuudasniiKhemjee ||
                                  0) -
                                (uilchluulegchGaralt?.khuudasniiKhemjee || 0) +
                                index +
                                1
                              );
                            },
                          },
                          {
                            title: t("Орсон"),
                            __style__: { h: "center" },
                            dataIndex: "tuukh.0.tsagiinTuukh.0.orsonTsag",
                            render(v, record) {
                              if (record?.isSummary) return "";
                              const d =
                                record?.tuukh?.[0]?.tsagiinTuukh?.[0]
                                  ?.orsonTsag;
                              return d && moment(d).format("YYYY-MM-DD HH:mm");
                            },
                          },
                          {
                            title: t("Гарсан"),
                            __style__: { h: "center" },
                            dataIndex: "tuukh.0.tsagiinTuukh.0.garsanTsag",
                            render(v, record) {
                              if (record?.isSummary) return "";
                              const d =
                                record?.tuukh?.[0]?.tsagiinTuukh?.[0]
                                  ?.garsanTsag ||
                                record?.tuukh?.[1]?.tsagiinTuukh?.[0]
                                  ?.garsanTsag;
                              return d && moment(d).format("YYYY-MM-DD HH:mm");
                            },
                          },
                          {
                            title: t("Төрөл"),
                            __style__: { h: "center" },
                            dataIndex: "turul",
                            render: (v, record) =>
                              record?.isSummary ? "" : !!v ? v : "Үйлчлүүлэгч",
                          },
                          {
                            title: t("Дугаар"),
                            __style__: { h: "center" },
                            dataIndex: "mashiniiDugaar",
                            render: (v) => v && String(v).toUpperCase(),
                          },

                          {
                            title: t("Хугацаа/мин"),
                            __style__: { h: "center" },
                            dataIndex: "tuukh",
                            render(v, record) {
                              if (record?.isSummary) return "";
                              const d1 = moment(
                                v?.[0]?.tsagiinTuukh?.[0]?.orsonTsag,
                              );
                              const d2 = moment(
                                v?.[0]?.tsagiinTuukh?.[0]?.garsanTsag,
                              );
                              const diff = d2.diff(d1, "minutes");
                              return diff && diff;
                            },
                          },
                          {
                            title: t("Бодогдсон"),
                            __style__: { h: "right" },
                            __numFmt__: "#,##0.00",
                            __cellType__: "TypeNumeric",
                            dataIndex: "niitDun",
                            render(v, data) {
                              const total = v > 0 ? v : ((data.tuukh?.[0]?.tulukhDun || 0) + (data.tuukh?.[1]?.tulukhDun || 0));
                              return total || 0;
                            },
                          },
                          ...filteredPaymentColumns,

                          ...(shouldShowNiitColumn ? [niitColumn] : []),

                          {
                            title: t("Төлбөр"),
                            __style__: { h: "center" },
                            dataIndex: "tuukh",
                            render(v, record) {
                              if (record?.isSummary) return "";

                              const tulbur = v?.[0]?.tulbur || [];
                              const { payments } = splitTulbur(tulbur);

                              if (!payments.length) return "";

                              if (payments.length === 1) {
                                const payment = payments[0];
                                const paymentType = tulburKhurvuulekh(
                                  payment.turul,
                                );
                                return `${paymentType}: ${payment.dun}`;
                              }

                              return payments
                                .map((payment) => {
                                  const paymentType = tulburKhurvuulekh(
                                    payment.turul,
                                  );
                                  return `${paymentType}: ${payment.dun}`;
                                })
                                .join("\n");
                            },
                          },

                          ...(hasDiscountData ? [discountColumn] : []),
                          {
                            title: t("И-Баримт"),
                            __style__: { h: "right" },
                            __numFmt__: "#,##0.00",
                            __cellType__: "TypeNumeric",
                            dataIndex: "ebarimtAvsanDun",
                            render(v) {
                              return v || 0;
                            },
                          },
                          {
                            title: t("Төлөв"),
                            __style__: { h: "center" },
                            dataIndex: "tuukh",
                            render(v, record) {
                              if (record?.isSummary) return "";
                              return v[0].tuluv === 1 || v[0].tuluv === 2
                                ? "Төлсөн"
                                : v[0].tuluv === -2
                                  ? "Зөрчилтэй"

                                  : v[0]?.tuluv === 0 &&
                                    !v[0]?.tsagiinTuukh?.[0]?.garsanTsag
                                    ? "Идэвхтэй"
                                    : v[0]?.tuluv === -3
                                      ? "Цэвэрлэсэн"
                                      : v[0]?.tuluv === -4 && record.niitDun > 0
                                        ? "Төлбөртэй"
                                        : "Үнэгүй";
                            },
                          },
                          {
                            title: t("Шалтгаан"),
                            dataIndex: "tuukh",
                            render: (v, parent) => {
                              if (parent?.isSummary) return "";
                              if (
                                parent.turul === "Үнэгүй" ||
                                parent.turul === "Дотоод"
                              ) {
                                return (
                                  parent?.mashin?.temdeglel || parent?.zurchil
                                );
                              } else if (parent.turul === "Гэрээт".trim()) {
                                return moment(
                                  parent?.mashin?.duusakhOgnoo,
                                ).format("YYYY-MM-DD");
                              }
                              return v?.[0]?.tuluv === -1
                                ? v[0]?.uneguiGarsan
                                : parent.zurchil
                                  ? t(parent.zurchil)
                                  : "";
                            },
                          },
                          {
                            title: t("Бүртгэсэн"),
                            dataIndex: "tuukh",
                            render: (v, record) => {
                              if (record?.isSummary) return "";
                              return (
                                v &&
                                (String(v[0]?.burtgesenAjiltaniiNer).replace(
                                  /\D/g,
                                  "",
                                ).length > 9
                                  ? ajiltniiNers.find(
                                    (a) =>
                                      a.id === v[0]?.burtgesenAjiltaniiId,
                                  )?.ner
                                  : v[0]?.burtgesenAjiltaniiNer)
                              );
                            },
                          },
                          {
                            title: t("Орсон хаалга"),
                            dataIndex: "tuukh",
                            render: (v, record) => {
                              if (record?.isSummary) return "";
                              return v
                                ?.map((a) => a?.orsonKhaalga)
                                .filter(Boolean)
                                .join(", ");
                            },
                          },
                          {
                            title: t("Гарсан хаалга"),
                            dataIndex: "tuukh",
                            render: (v, record) => {
                              if (record?.isSummary) return "";
                              return v
                                ?.map((a) => a?.garsanKhaalga)
                                .filter(Boolean)
                                .join(", ");
                            },
                          },
                        ];

                        const paymentTotals = calculatePaymentTotals(rows);
                        const summaryRow = {
                          isSummary: true,
                          mashiniiDugaar: t("Нийт"),
                          niitDun: totals.niitDun,
                          ebarimtAvsanDun: totals.ebarimtAvsanDun,
                          discountTotal: totals.discountTotal,
                          ...paymentTotals,
                          tuukh: [
                            {
                              tulukhDun: totals.tulukhDun,
                              tulbur: summaryPayments,
                              tsagiinTuukh: [],
                            },
                          ],
                        };

                        excel.addSheet("Жагсаалт").addColumns(excelColumns);
                        excel.addDataSource(rows);

                        const originalBodyStyle = {
                          ...excel.defaultTbodyCellStyle,
                        };
                        excel.setTBodyStyle({ bold: true });
                        excel.addDataSource([summaryRow]);
                        excel.defaultTbodyCellStyle = originalBodyStyle;

                        excel.saveAs("Жагсаалт.xlsx");
                      }
                    }}
                  >
                    <DownloadOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Татах")}</label>
                  </a>
                </div>
              )}
              placement="bottom"
              trigger="click"
            >
              <div className="flex items-center gap-2">
                {(ajiltan?.tokhirgoo?.zogsoolNegtgelDunKharakhEsekh === true ||
                  ajiltan?.erkh === "Admin") && (
                    <Button
                      onClick={() => tulburiinDelgerengui()}
                      className="mr-3 w-auto text-ellipsis"
                      icon={<PrinterOutlined />}
                      type="primary"
                    >
                      {t("Төлбөрийн дэлгэрэнгүй")}
                    </Button>
                  )}

                <Button
                  type="primary"
                  icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
                >
                  <span>Excel</span>
                  <DownOutlined width={5} />
                </Button>
              </div>
            </Popover>
            <div className="flex items-start justify-center gap-1">
              <Button
                onClick={tseverliy}
                disabled={
                  selectedRowkeys && selectedRowkeys?.length > 0 ? false : true
                }
                type={`${selectedRowkeys && selectedRowkeys?.length > 0
                  ? "tertiary"
                  : "default"
                  }`}
                className="dark:bg-gray-800 dark:text-gray-200"
              >
                {t("Цэвэрлэх")}
                {selectedRowkeys &&
                  selectedRowkeys?.length > 0 &&
                  `(${selectedRowkeys?.length})`}
              </Button>

            </div>
            {((baiguullaga?._id === "662de8c8919a3695ffe51e36") && ajiltan?.erkh === "Admin") && (
              <div className="flex items-start justify-center gap-1">
                <Button
                  onClick={ustgakh}
                  disabled={!selectedRowkeys || selectedRowkeys.length === 0}
                  type={
                    selectedRowkeys && selectedRowkeys.length > 0
                      ? "danger"
                      : "default"
                  }
                  className="dark:bg-gray-800 dark:text-gray-200"
                >
                  {t("Устгах")}
                  {selectedRowkeys && selectedRowkeys.length > 0 && (
                    ` (${selectedRowkeys.length})`
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="400"
          data-aos-anchor-placement="top-bottom"
        >
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: t("Машинаар"),
                children: (
                  <Table
                    className="t-head"
                    loading={!uilchluulegchGaralt}
                    dataSource={uilchluulegchGaralt?.jagsaalt}
                    scroll={{ y: "calc(100vh - 30rem)" }}
                    tableLayout={"fixed"}
                    size="small"
                    rowClassName="hover:bg-blue-100"
                    bordered
                    rowSelection={rowSelection}
                    rowKey={"_id"}
                    columns={columns}
                    onChange={onChangeTable}
                    pagination={{
                      current: uilchluulegchGaralt?.khuudasniiDugaar,
                      total: uilchluulegchGaralt?.niitMur,
                      pageSizeOptions: [100, 300, 500, 1000],
                      defaultPageSize: [500],
                      showSizeChanger: true,
                      onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                        setUilchluulegchKhuudaslalt((kh) => ({
                          ...kh,
                          khuudasniiDugaar,
                          khuudasniiKhemjee,
                        })),
                    }}
                    summary={(e) => (
                      <AntdTable.Summary className="border " fixed={"bottom"}>
                        {(() => {
                          const shinecolLength =
                            shuult?.name === "Түрээслэгч" ? 2 : 0;
                          const summaryColSpan = 7 + shinecolLength;
                          const totals =
                            e?.reduce(
                              (acc, b) => {
                                const { payments, discount } = splitTulbur(
                                  b?.tuukh?.[0]?.tulbur,
                                );
                                const paidTotal =
                                  b?.tuukh
                                    ?.filter(t => Number(t?.tulukhDun) > 0)
                                    ?.reduce((sum, t) => sum + Number(t?.tulukhDun || 0), 0) || 0;
                                const amount = paidTotal > 0 ? paidTotal : Number(b?.niitDun || 0);
                                acc.niitDun += amount;

                                acc.payment += payments?.reduce(
                                  (c, d) => c + (Number(d?.dun) || 0),
                                  0,
                                ) || 0;

                                acc.discount += Number(discount) || 0;
                                acc.ebarimt += Number(b?.ebarimtAvsanDun) || 0;

                                return acc;
                              },
                              {
                                niitDun: 0,
                                payment: 0,
                                discount: 0,
                                ebarimt: 0,
                              },
                            ) || {};

                          const {
                            niitDun = 0,
                            payment = 0,
                            discount = 0,
                            ebarimt = 0,
                          } = totals;


                          return (
                            <>
                              <AntdTable.Summary.Cell colSpan={summaryColSpan}>
                                <div className="space-x-2 truncate text-base font-bold ">
                                  {t("Нийт")}
                                </div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold ">
                                  {formatNumber(niitDun, 2)}
                                </div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold ">
                                  {formatNumber(payment, 2)}
                                </div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold ">
                                  {formatNumber(discount, 2)}
                                </div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold ">
                                  {formatNumber(ebarimt, 2)}
                                </div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold "></div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold "></div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold "></div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold "></div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold "></div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold "></div>
                              </AntdTable.Summary.Cell>
                            </>
                          );
                        })()}
                      </AntdTable.Summary>
                    )}
                  />
                ),
              },
              {
                key: "2",
                label: t("Мөнгөн дүнгээр"),
                children: (
                  <Table
                    className="mt-8 hidden overflow-auto md:block"
                    tableLayout="auto"
                    loading={!uilchluulegchGaralt}
                    dataSource={uilchluulegchGaralt?.jagsaalt}
                    scroll={{ y: "calc(100vh - 30rem)" }}
                    size="small"
                    bordered
                    rowSelection={rowSelection}
                    rowKey={"_id"}
                    columns={columns}
                    onChange={onChangeTable}
                    pagination={{
                      current: uilchluulegchGaralt?.khuudasniiDugaar,
                      total: uilchluulegchGaralt?.niitMur,
                      pageSizeOptions: [100, 300, 500, 1000],
                      defaultPageSize: [500],
                      showSizeChanger: true,
                      onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                        setUilchluulegchKhuudaslalt((kh) => ({
                          ...kh,
                          khuudasniiDugaar,
                          khuudasniiKhemjee,
                        })),
                    }}
                    summary={(e) => (
                      <AntdTable.Summary className="border " fixed={"bottom"}>
                        {(() => {
                          const shinecolLength =
                            shuult?.name === "Түрээслэгч" ? 2 : 0;
                          const summaryColSpan = 7 + shinecolLength;
                          const totals =
                            e?.reduce(
                              (acc, b) => {
                                const { payments, discount } = splitTulbur(
                                  b?.tuukh?.[0]?.tulbur,
                                );

                                acc.niitDun += getPaymentTotal(b);
                                acc.payment += payments.reduce(
                                  (c, d) => c + (Number(d?.dun) || 0),
                                  0,
                                );
                                acc.discount += discount || 0;
                                acc.ebarimt += Number(b?.ebarimtAvsanDun) || 0;
                                return acc;
                              },
                              {
                                niitDun: 0,
                                payment: 0,
                                discount: 0,
                                ebarimt: 0,
                              },
                            ) || {};
                          const {
                            niitDun = 0,
                            payment = 0,
                            discount = 0,
                            ebarimt = 0,
                          } = totals || {};

                          return (
                            <>
                              <AntdTable.Summary.Cell colSpan={summaryColSpan}>
                                <div className="space-x-2 truncate text-base font-bold ">
                                  {t("Нийт")}
                                </div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold ">
                                  {formatNumber(niitDun, 2)}
                                </div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold ">
                                  {formatNumber(payment, 2)}
                                </div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold ">
                                  {formatNumber(discount, 2)}
                                </div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold ">
                                  {formatNumber(ebarimt, 2)}
                                </div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold "></div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold "></div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold "></div>
                              </AntdTable.Summary.Cell>
                              <AntdTable.Summary.Cell>
                                <div className="truncate text-right font-bold "></div>
                              </AntdTable.Summary.Cell>
                            </>
                          );
                        })()}
                      </AntdTable.Summary>
                    )}
                  />
                ),
              },
              {
                key: DAILY_CLOSING_TAB_KEY,
                label: "Өдрийн хаалт",
                children: (
                  <div className="mt-8 overflow-x-auto">
                    <Table
                      className="overflow-auto"
                      tableLayout="auto"
                      loading={!kassCameraKhaaltJagsaalt}
                      dataSource={kassCameraKhaaltJagsaalt}
                      scroll={{ y: "calc(100vh - 30rem)", x: "max-content" }}
                      size="small"
                      bordered
                      columns={kassCameraKhaaltColumns}
                      pagination={{
                        current: kassCameraKhaaltData?.khuudasniiDugaar,
                        total: kassCameraKhaaltData?.niitMur,
                        pageSizeOptions: [100, 300, 500],
                        defaultPageSize: [500],
                        showSizeChanger: true,
                        onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                          setKassCameraKhuudaslalt((kh) => ({
                            ...kh,
                            khuudasniiDugaar,
                            khuudasniiKhemjee,
                          })),
                      }}
                      summary={(e) => (
                        <AntdTable.Summary className="border " fixed={"bottom"}>
                          <AntdTable.Summary.Cell colSpan={6}>
                            <div className="space-x-2 truncate text-base font-bold ">
                              {t("Нийт")}: {e?.length || 0} {t("ажилтан")}
                            </div>
                          </AntdTable.Summary.Cell>
                        </AntdTable.Summary>
                      )}
                    />
                  </div>
                ),
              },
              baiguullaga?.tokhirgoo?.zurchulMsgeerSanuulakh
                ? {
                  key: ZURCHIL_TAB_KEY,
                  label: "Зөрчил сануулах",
                  children: (
                    <div className="mt-8 overflow-x-auto">
                      <Table
                        className="overflow-auto"
                        tableLayout="auto"
                        loading={!zurchilteiJagsaalt}
                        dataSource={zurchilteiJagsaalt}
                        scroll={{
                          y: "calc(100vh - 30rem)",
                          x: "max-content",
                        }}
                        size="small"
                        bordered
                        rowSelection={rowSelection}
                        rowKey={"_id"}
                        columns={columnsZurchil}
                        onChange={onChangeTable}
                        pagination={{
                          current: zurchilteiData?.khuudasniiDugaar,
                          total: zurchilteiData?.niitMur,
                          pageSizeOptions: [100, 300, 500],
                          defaultPageSize: [500],
                          showSizeChanger: true,
                          onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                            setZurchilKhuudaslalt((kh) => ({
                              ...kh,
                              khuudasniiDugaar,
                              khuudasniiKhemjee,
                            })),
                        }}
                        summary={(e) => (
                          <AntdTable.Summary
                            className="border "
                            fixed={"bottom"}
                          >
                            <AntdTable.Summary.Cell colSpan={9}>
                              <div className="space-x-2 truncate text-base font-bold ">
                                {t("Нийт")}
                              </div>
                            </AntdTable.Summary.Cell>
                            <AntdTable.Summary.Cell>
                              <div className="truncate text-right font-bold ">
                                {formatNumber(
                                  e?.reduce(
                                    (a, b) => a + (b.niitDun || 0),
                                    0,
                                  ),
                                  2,
                                )}
                              </div>
                            </AntdTable.Summary.Cell>
                          </AntdTable.Summary>
                        )}
                      />
                    </div>
                  ),
                }
                : null,
            ]}
            onChange={(v) => setTootsooKhelber(v)}
          />
        </div>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Zogsool;
