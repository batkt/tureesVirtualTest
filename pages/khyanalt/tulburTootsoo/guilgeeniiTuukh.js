import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Admin from "components/Admin";
import React, { useMemo, useState, useEffect, useReducer } from "react";

import { useAuth } from "services/auth";
import {
  Card,
  Table,
  Button,
  DatePicker,
  Spin,
  Tooltip,
  Progress,
  Select,
  Popover,
  Space,
  notification,
  Checkbox,
} from "antd";
import {
  FileExcelOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  DownOutlined,
  PrinterOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import useOrder from "tools/function/useOrder";

import NekhemjlelIlgeekh from "components/pageComponents/tulbur/NekhemjlelIlgeekh";
import MedegdelIlgeekh from "components/pageComponents/tulbur/MedegdelIlgeekh";
import GuilgeeKhiikh from "components/pageComponents/tulbur/GuilgeeKhiikh";
import OnlyFcGuilgeeExcelees from "components/pageComponents/tulbur/onlyFcGuilgeeExcelees";
import GuilgeeExceleesOruulakhOlnoor from "components/pageComponents/tulbur/GuilgeeExceleesOruulakhOlnoor";
import GuilgeeEkhniiUldegdelExceleesOruulakhOlnoor from "components/pageComponents/tulbur/GuilgeeEkhniiUldegdelExceleesOruulakhOlnoor";
import BaritsaaUdirdlaga from "components/pageComponents/tulbur/BaritsaaUdirdlaga";
import _ from "lodash";
import { modal } from "components/ant/Modal";
import useGuilgeeniiToololtAvya from "hooks/tulburTootsoo/useGuilgeeniiToololtAvya";
import { useTuluugiiGereeniiToololtAvya } from "hooks/tulburTootsoo/useGuilgeeniiToololtAvya";
import useSWR from "swr";
import GuilgeenTuukhTile from "components/pageComponents/tulbur/GuilgeeTuukhTile";
import CardList from "components/cardList";
import Aos from "aos";
import BaganiinSongolt from "components/table/BaganiinSongolt";
import useJagsaalt from "hooks/useJagsaalt";
import useEneSardTuluuguiGereenuudAvya from "hooks/tulburTootsoo/useEneSardTuluuguiGereenuudAvya";
import Khuulga from "components/pageComponents/tulbur/Khuulga";
import KhuulgaAldangi from "components/pageComponents/tulbur/KhuulgaAldangi";
import { useTranslation } from "react-i18next";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import NekhemjlekhiinTuukhTsonkh from "components/pageComponents/tulbur/NekhemjlekhiinTuukhTsonkh";

const GereeniiUldegdel = React.memo(
  ({ ugugdul, token, ognoo, tsutsalsanTurul, refreshTotals }) => {
    const { barilgiinId, baiguullaga, ajiltan } = useAuth();
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    const aldangiTuukhKharakhEsekh = baiguullaga?.tokhirgoo?.aldangiTuukhKharakhEsekh !== undefined
      ? baiguullaga?.tokhirgoo?.aldangiTuukhKharakhEsekh
      : (baiguullaga?._id === "6735c77a7fc60cd66deb2909" || baiguullaga?._id === "6916c957511a8a4aebc1d65b");

    const { data, mutate, isValidating } = useSWR(
      !!ugugdul?.gereeniiDugaar && !!barilgiinId
        ? [
          "/uldegdelBodyo",
          barilgiinId,
          ugugdul?.gereeniiDugaar,
          ognoo,
          tsutsalsanTurul,
        ]
        : null,
      (url, barilgiinId, gereeniiDugaar, ognoo) =>
        uilchilgee(token)
          .post(url, { barilgiinId, gereeniiDugaar, ognoo, tsutsalsanTurul })
          .then(({ data }) => data),
      {
        revalidateOnFocus: false,
      },
    );

    const uldegdelUdruurKharakhEsekh = baiguullaga?.tokhirgoo?.uldegdelUdruurKharakhEsekh || baiguullaga?._id === "6735c77a7fc60cd66deb2909" || (ajiltan?.username === "CAdmin1" || ajiltan?.ner === "CAdmin1");
    const showCombined = true;

    const uldegdelTur = data?.tureesiinUldegdel ?? ugugdul?.tureesiinUldegdel ?? ugugdul?.uldegdel ?? 0;
    const uldegdelAld = data?.aldangiinUldegdel ?? 0;
    const uldegdelTulsun = data?.tulsun ?? ugugdul?.tulsun ?? 0;
    const uldegdelKhyamdral = data?.khyamdral ?? ugugdul?.khyamdral ?? 0;
    const uldegdelTulsunAldangi = data?.niitTulsunAldangi ?? 0;

    const reqBaritsaa = data?.baritsaaAvakhDun ?? ugugdul?.baritsaaAvakhDun ?? 0;
    const paidBaritsaa = data?.baritsaaniiUldegdel ?? ugugdul?.baritsaaTulsunDun ?? ugugdul?.baritsaaniiUldegdel ?? 0;
    const baritsaaBalance = Math.max(0, reqBaritsaa - paidBaritsaa);

    const fallbackUldegdel = data
      ? uldegdelTur
      : (ugugdul?.tureesiinUldegdel !== undefined
        ? ugugdul.tureesiinUldegdel
        : (parseFloat(ugugdul?.uldegdel) || 0) - (parseFloat(ugugdul?.aldangiinUldegdel) || 0)) ||
      ugugdul?.niitUldegdel ||
      ugugdul?.tsutslagdsanAvlaga ||
      (ugugdul?.tuluv == -1 ? ugugdul?.tsutsalsanUldegdel : 0);

    const displayUldegdel = aldangiTuukhKharakhEsekh
      ? (fallbackUldegdel + uldegdelAld)
      : fallbackUldegdel;
    ugugdul.uldegdel = displayUldegdel;
    ugugdul.tureesiinUldegdel = uldegdelTur;
    ugugdul.mutate = mutate;

    useEffect(() => {
      if (!isValidating && data !== undefined && typeof refreshTotals === "function") {
        refreshTotals();
      }
    }, [isValidating, data, refreshTotals]);

    const content = (
      <div className="space-y-1 p-1 text-xs">
        {isValidating ? (
          <div className="flex justify-center p-2"><Spin size="small" /></div>
        ) : (
          <>
            {uldegdelTur > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">{t("Түрээсийн үлдэгдэл")}:</span>
                <span className="font-bold text-red-500">
                  {formatNumber(uldegdelTur)}
                </span>
              </div>
            )}

            {uldegdelTulsun > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">{t("Нийт төлсөн")}:</span>
                <span className="font-bold text-green-500">
                  {formatNumber(uldegdelTulsun)}
                </span>
              </div>
            )}
            {uldegdelKhyamdral > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">{t("Хямдрал")}:</span>
                <span className="font-bold text-green-500">
                  {formatNumber(uldegdelKhyamdral)}
                </span>
              </div>
            )}
            {aldangiTuukhKharakhEsekh && uldegdelAld > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">{t("Нийт алданги")}:</span>
                <span className="font-bold text-red-500">
                  {formatNumber(uldegdelAld)}
                </span>
              </div>
            )}
            {aldangiTuukhKharakhEsekh && uldegdelTulsunAldangi > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">{t("Төлсөн алданги")}:</span>
                <span className="font-bold text-orange-500">
                  {formatNumber(uldegdelTulsunAldangi)}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    );

    return (
      <div
        className={`text-right font-medium ${(displayUldegdel ?? 0) > 0 ? "text-red-500" : "text-green-500"
          }`}
      >
        {(displayUldegdel ?? 0) > 0 ? (
          <Popover
            content={content}
            title={t("Үлдэгдлийн дэлгэрэнгүй")}
            onOpenChange={(open) => {
              if (open) setVisible(true);
            }}
          >
            <span className="cursor-pointer">
              {formatNumber(displayUldegdel ?? 0, 2)}
            </span>
          </Popover>
        ) : (
          formatNumber(displayUldegdel ?? 0, 2)
        )}
      </div>
    );
  },
);

const GereeniiAldangi = React.memo(({ ugugdul }) => {
  return (
    <div className="w-full text-right">
      {formatNumber(ugugdul?.aldangiinUldegdel || 0)}
    </div>
  );
});

function GereeniiAshiglakhUldegdel({ token, gereeniiId, record }) {
  const { data, isValidating } = useSWR(
    gereeniiId ? [`/baritsaaTulultAvya/${gereeniiId}`] : null,
    () =>
      uilchilgee(token)
        .get(`/baritsaaTulultAvya/${gereeniiId}`)
        .then(({ data }) => data),
    { revalidateOnFocus: false }
  );

  const ashiglakhUldegdel = useMemo(() => {
    if (!data?.length) return 0;
    return data.reduce(
      (sum, item) => sum + (item.orlogo || 0) - (item.zarlaga || 0),
      0
    );
  }, [data]);


  if (record) record.ashiglakhUldegdel = ashiglakhUldegdel;

  return (
    <div className="w-full text-right">
      {isValidating ? <Spin size="small" /> : formatNumber(ashiglakhUldegdel)}
    </div>
  );
}

function TableGuilgee({
  columns,
  garalt,
  setKhuudaslalt,
  setLoadingIndex,
  onChange,
  turul,
  showTsutslagdsanAvlagaColumn,
  setShowTsutslagdsanAvlagaColumn,
  guilgeeniiToololt,
  refreshTotals,
  baiguullaga,
  totalsUpdateCount
}) {
  const { t } = useTranslation();
  function UilgelAvya({
    garalt,
    columns,
    turul,
  }) {
    const list = garalt?.jagsaalt || [];

    const getSum = (dataIndex) => {
      let sum = 0;
      list.forEach((item) => {
        const isCancelled = item?.tuluv == -1 || Number(item?.tuluv) === -1;

        const aldangiTuukhKharakhEsekh = baiguullaga?.tokhirgoo?.aldangiTuukhKharakhEsekh ?? false;
        const tureesiinUld = item.tureesiinUldegdel !== undefined
          ? item.tureesiinUldegdel
          : (aldangiTuukhKharakhEsekh ? ((parseFloat(item.uldegdel) || 0) - (parseFloat(item.aldangiinUldegdel) || 0)) : (parseFloat(item.uldegdel) || 0));

        const effUldegdel =
          isCancelled && tureesiinUld <= 0
            ? parseFloat(item?.tsutsalsanUldegdel) || 0
            : tureesiinUld;

        let val = 0;
        if (dataIndex === "uldegdel") {
          val = isCancelled && (parseFloat(item?.uldegdel) <= 0)
            ? (parseFloat(item?.tsutsalsanUldegdel) || 0)
            : (parseFloat(item?.uldegdel) || 0);
        } else if (dataIndex === "avlagiinUldegdel") {
          val = effUldegdel + (parseFloat(item?.aldangiinUldegdel) || 0);
        } else if (dataIndex === "aldangiinUldegdel") {
          val = parseFloat(item?.aldangiinUldegdel) || 0;
        } else if (dataIndex === "niitTulsunAldangi") {
          val = parseFloat(item?.niitTulsunAldangi) || 0;
        } else if (dataIndex === "tulsunDun") {
          val = parseFloat(item?.tulsunDun) || 0;
        } else if (dataIndex === "khungulult") {
          val = parseFloat(item?.khungulult) || 0;
        } else if (dataIndex === "voucherDun") {
          val = parseFloat(item?.voucherDun) || 0;
        } else if (dataIndex === "baritsaaAvakhDun") {
          val =
            (parseFloat(item?.baritsaaAvakhDun) || 0) -
            (parseFloat(item?.baritsaaniiUldegdel) || 0);
        } else if (dataIndex === "baritsaaniiUldegdel") {
          val = parseFloat(item?.baritsaaTulsunDun || item?.baritsaaniiUldegdel) || 0;
        } else if (dataIndex === "ashiglakhUldegdel") {
          const tulsun = parseFloat(item?.baritsaaTulsunDun || item?.baritsaaniiUldegdel) || 0;
          const uldegdel = parseFloat(item?.baritsaaniiUldegdel) || 0;
          val = (tulsun - uldegdel);
        } else if (dataIndex === "tuluvluguut" || dataIndex === "sariinTurees") {
          const amount =
            isCancelled &&
              item?.tsutsalsanTuluvluguut != null &&
              item?.tsutsalsanTuluvluguut > 0
              ? item?.tsutsalsanTuluvluguut
              : item?.[dataIndex];
          val = parseFloat(amount) || 0;
        } else if (dataIndex === "talbainNiitUne") {
          val = parseFloat(item?.talbainNiitUne) || 0;
        }

        sum += val;
      });
      return sum;
    };

    const dynamicIndexes = ["uldegdel", "avlagiinUldegdel", "aldangiinUldegdel", "niitTulsunAldangi"];

    return (
      <Table.Summary.Row>
        {columns.map((mur, index) => (
          <Table.Summary.Cell
            key={mur.dataIndex || index}
            className={`${mur.summary !== true ? "border-none" : "font-bold"}`}
            index={index}
            align="right"
          >
            {mur.summary ? (
              <div className="font-bold">
                {totalsUpdateCount === 0 && dynamicIndexes.includes(mur.dataIndex) && garalt?.jagsaalt?.length > 0 ? (
                  <Spin size="small" />
                ) : (
                  formatNumber(getSum(mur.dataIndex))
                )}
              </div>
            ) : (
              ""
            )}
          </Table.Summary.Cell>
        ))}
      </Table.Summary.Row>
    );
  }
  return (
    <Table
      scroll={{ x: Math.max(1600, columns.length * 150), y: "calc(100vh - 32rem)" }}
      size="small"
      bordered
      columns={columns}
      loading={!garalt}
      dataSource={garalt?.jagsaalt}
      rowKey={(a) => a._id}
      className="t-head"
      onChange={onChange}
      rowClassName={(record, index) => {
        const base =
          index % 2 === 0
            ? "bg-white dark:bg-gray-600"
            : "bg-gray-200 dark:bg-gray-800";
        const isCancelled = record?.tuluv == -1 || Number(record?.tuluv) === -1;
        return isCancelled ? `${base} tsutslagdsan-geree-row` : base;
      }}
      rowStyle={(record) => {
        const isCancelled = record?.tuluv == -1 || Number(record?.tuluv) === -1;
        return isCancelled
          ? {
            borderLeft: "4px solid #ef4444",
            boxSizing: "border-box",
          }
          : undefined;
      }}
      pagination={{
        current: garalt?.khuudasniiDugaar,
        total: garalt?.niitMur,
        pageSizeOptions: [10, 20, 100, 200, 500],
        defaultPageSize: 500,
        showSizeChanger: true,
        className:
          (turul === "eneSardTulukh" || turul === "eneSardTulsun") &&
            setShowTsutslagdsanAvlagaColumn
            ? "[&_.ant-pagination-total-text]:!flex [&_.ant-pagination-total-text]:flex-1 [&_.ant-pagination-total-text]:!justify-start [&_.ant-pagination-total-text]:!items-start"
            : undefined,
        showTotal: (total, range) =>
          (turul === "eneSardTulukh" || turul === "eneSardTulsun") &&
            setShowTsutslagdsanAvlagaColumn ? (
            <div className="flex items-start gap-3">
              <Checkbox
                checked={showTsutslagdsanAvlagaColumn}
                onChange={(e) =>
                  setShowTsutslagdsanAvlagaColumn(e.target.checked)
                }
              >
                {t("Цуцлагдсан гэрээ")}
              </Checkbox>
            </div>
          ) : (
            <span>
              {range[0]}-{range[1]} / {total}
            </span>
          ),
        onChange: (khuudasniiDugaar, khuudasniiKhemjee) => {
          setLoadingIndex(0);
          setKhuudaslalt((kh) => ({
            ...kh,
            khuudasniiDugaar,
            khuudasniiKhemjee,
          }));
        },
      }}
      summary={() => (
        <Table.Summary fixed>
          {" "}
          <UilgelAvya
            garalt={garalt}
            columns={columns}
            turul={turul}
            showTsutslagdsanAvlagaColumn={showTsutslagdsanAvlagaColumn}
            guilgeeniiToololt={guilgeeniiToololt}
          />{" "}
        </Table.Summary>
      )}
    />
  );
}

const searchKeys = [
  "register",
  "customerTin",
  "talbainDugaar",
  "gereeniiDugaar",
  "utas",
  "ovog",
  "ner",
];

function GuilgeeniiTuukh(props) {
  const { t, i18n } = useTranslation();
  const [totalsUpdateCount, refreshTotalsRaw] = useReducer((s) => s + 1, 0);
  const refreshTotals = useMemo(() => _.debounce(refreshTotalsRaw, 300), [refreshTotalsRaw]);

  useEffect(() => {
    return () => {
      refreshTotals.cancel();
    };
  }, [refreshTotals]);

  useEffect(() => {
    Aos.init({ once: true });
  });
  const ref = React.useRef(null);
  const excelref = React.useRef();
  const baritsaaref = React.useRef(null);
  const { token, baiguullaga, barilgiinId, ajiltan } = useAuth();
  const [ognoo, setOgnoo] = React.useState([
    moment(moment().startOf("month").format("YYYY-MM-DD 00:00:00")),
    moment(moment().endOf("month").format("YYYY-MM-DD 23:59:59")),
  ]);
  const [tulukhOgnoo, setTulukhOgnoo] = React.useState();
  const [turul, setTurul] = React.useState("avlaga");
  const [neesenEsekh, setNeesenEsekh] = useState(false);
  const [showTsutslagdsanAvlagaColumn, setShowTsutslagdsanAvlagaColumn] =
    useState(false);
  const [loadingIndex, setLoadingIndex] = React.useState(0);
  const [davkhar, setDavkhar] = React.useState(undefined);
  const [aldangiBodokhLoading, setAldangiBodokhLoading] = useState(false);
  const [aldangiUstgahLoading, setAldangiUstgahLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { guilgeeniiToololt, guilgeeniiToololtMutate } =
    useGuilgeeniiToololtAvya(
      token,
      ognoo,
      barilgiinId,
      baiguullaga?._id,
      showTsutslagdsanAvlagaColumn,
      search,
      davkhar
    );
  const { tolooguiGereeniiToo, tolooguiGereeniiTooMutate } =
    useTuluugiiGereeniiToololtAvya(token, ognoo);

  const { order, onChangeTable } = useOrder();
  const [shineBagana, setShineBagana] = useState([]);
  function khusnegtOrderChange(r, o, s) {
    if (!JSON.stringify(s).includes("uldegdel")) onChangeTable(r, o, s);
  }

  const { sericeName, query, turulColumns } = React.useMemo(() => {
    let sericeName = "/geree";
    let query = {};
    let turulColumns = [];
    let ekhlekhOgnoo = moment(ognoo && ognoo[0])
      .startOf("month")
      .format("YYYY-MM-DD 00:00:00");
    let duusakhOgnoo = moment(ognoo && ognoo[1])
      .endOf("month")
      .format("YYYY-MM-DD 23:59:59");

    switch (turul) {
      case "voucher":
        sericeName = `/vouchertaiJagsaaltAvya/${ekhlekhOgnoo}/${duusakhOgnoo}`;
        turulColumns.push({
          dataIndex: "voucherDun",
          title: t("Ваучерын дүн"),
          width: "7rem",
          summary: true,
          align: "center",
          render: (v) => (
            <div className="w-full text-right">{formatNumber(v)}</div>
          ),
        });
        break;
      case "khungulult":
        sericeName = `/khungulultteiJagsaaltAvya/${ekhlekhOgnoo}/${duusakhOgnoo}`;
        turulColumns.push({
          dataIndex: "khungulult",
          title: t("Хөнгөлөлт"),
          summary: true,
          width: "6rem",
          align: "center",
          render: (v) => (
            <div className="w-full text-right">{formatNumber(v)}</div>
          ),
        });
        break;
      case "eneSardTulsun":
        sericeName = `/guitsetgelteiJagsaaltAvya/${ekhlekhOgnoo}/${duusakhOgnoo}`;
        turulColumns.push({
          dataIndex: "tulsunDun",
          title: t("Төлсөн дүн"),
          summary: true,
          width: "7rem",
          align: "center",
          render: (v) => (
            <div className="w-full text-right">{formatNumber(v)}</div>
          ),
        });
        break;
      case "shiljuulsenBaritsaa":
        sericeName = `/baritsaaniiGuilgeeKhiie/${ekhlekhOgnoo}/${duusakhOgnoo}`;
        turulColumns.push({
          dataIndex: "tulsunDun",
          title: t("Барьцаа"),
          summary: true,
          width: "7rem",
          align: "center",
          render: (v) => (
            <div className="w-full text-right">{formatNumber(v)}</div>
          ),
        });
        break;
      case "baritsaaAshiglasanDun":
        sericeName = null;
        turulColumns.push({
          dataIndex: "baritsaaAshiglasanDun",
          title: t("Барьцаа ашиглалт"),
          summary: true,
          width: "7rem",
          align: "center",
          render: (v) => (
            <div className="w-full text-right">{formatNumber(v)}</div>
          ),
        });
        break;
      case "tsutslagdsanAvlaga":
        turulColumns.push({
          dataIndex: "sariinTurees",
          title: t("Сарын түрээс"),
          summary: true,
          width: "8rem",
          align: "center",
          render: (v, record) => {
            const amount =
              record.tuluv === -1 &&
                record.tsutsalsanTuluvluguut != null &&
                record.tsutsalsanTuluvluguut > 0
                ? record.tsutsalsanTuluvluguut
                : v;
            return (
              <div className="w-full text-right">
                {formatNumber(amount || 0)}
              </div>
            );
          },
        });
        break;
      default:
        break;
    }

    if (turul === "avlaga") {
      query = {
        "avlaga.guilgeenuud.ognoo": {
          $lte: duusakhOgnoo,
        },
        davkhar,
        baiguullagiinId: baiguullaga?._id,
        tuluv: {
          $ne: -1,
        },
        barilgiinId,
      };
    } else if (turul === "tsutslagdsanAvlaga") {
      query = {
        baiguullagiinId: baiguullaga?._id,
        davkhar,
        tuluv: -1,
        barilgiinId,
      };
    } else if (turul === "baritsaaAshiglasanDun") {
      sericeName = null;
      query = {
        davkhar,
      };
    } else {
      query = {
        davkhar,
        baiguullagiinId: baiguullaga?._id,
        barilgiinId,
        tuluv: {
          $ne: -1,
        },
      };
      if (showTsutslagdsanAvlagaColumn) {
        if (turul === "eneSardTulsun") {
          query.showTsutslagdsanAvlaga = true;
        } else if (turul === "eneSardTulukh") {
          query.tuluv = { $in: [1, -1] };
        }
      }
    }
    if (query && !!tulukhOgnoo) {
      const dateStr = tulukhOgnoo.format("YYYY-MM-DD");

      const offsetHours = tulukhOgnoo.utcOffset() / 60;

      const startDate = moment(dateStr)
        .startOf("day")
        .subtract(offsetHours, "hours")
        .toISOString();

      const endDate = moment(dateStr)
        .endOf("day")
        .subtract(offsetHours, "hours")
        .toISOString();

      query.daraagiinTulukhOgnoo = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    return { sericeName, query, turulColumns };
  }, [
    turul,
    ognoo,
    davkhar,
    barilgiinId,
    tulukhOgnoo,
    t,
    baiguullaga,
    showTsutslagdsanAvlagaColumn,
  ]);

  useEffect(() => {
    setShineBagana([]);
  }, [i18n.language]);

  const {
    data,
    mutate,
    onSearch: onSearchMedeelel,
    setKhuudaslalt,
    isValidating,
  } = useJagsaalt(sericeName, query, order, undefined, searchKeys, null, 500);

  const {
    eneSardTuluuguiGereenuud,
    setEneSardTuluuguiGereenuud,
    eneSardTuluuguiGereenuudMutate,
    isValidating: isValidatingPlan
  } =
    useEneSardTuluuguiGereenuudAvya(
      (turul === "eneSardTulukh" || turul === "baritsaaAshiglasanDun") && token,
      ognoo,
      query,
      showTsutslagdsanAvlagaColumn === true
    );

  useEffect(() => {
    if (tulukhOgnoo !== undefined) {
      mutate();
      eneSardTuluuguiGereenuudMutate();
    }
  }, [tulukhOgnoo, mutate, eneSardTuluuguiGereenuudMutate]);

  const aldangiBodoyo = async () => {
    if (!baiguullaga?._id || aldangiBodokhLoading) return;
    setAldangiBodokhLoading(true);
    await uilchilgee(token)
      .post("/aldangiBodyo", { baiguullagiinId: baiguullaga._id })
      .then(() => {
        notification.success({
          message: t("Амжилттай"),
          description: t("Алдангийг амжилттай бодлоо"),
        });
        refreshData();
      })
      .catch(aldaaBarigch)
      .finally(() => setAldangiBodokhLoading(false));
  };

  const aldangiUstgayaa = async () => {
    if (!baiguullaga?._id || !barilgiinId || aldangiUstgahLoading) return;
    setAldangiUstgahLoading(true);
    await uilchilgee(token)
      .post("/aldangiUstgayaa", {
        baiguullagiinId: baiguullaga._id,
        barilgiinId,
      })
      .then(() => {
        notification.success({
          message: t("Амжилттай"),
          description: t("Алдангийг амжилттай устгалаа"),
        });
        refreshData();
      })
      .catch(aldaaBarigch)
      .finally(() => setAldangiUstgahLoading(false));
  };

  const { gereeniiMedeelel, onSearch } = useMemo(() => {
    return {
      gereeniiMedeelel:
        turul === "eneSardTulukh" || turul === "baritsaaAshiglasanDun"
          ? eneSardTuluuguiGereenuud
          : data,
      onSearch: (searchValue) => {
        setSearch(searchValue);
        onSearchMedeelel(searchValue);
        setEneSardTuluuguiGereenuud((a) => ({
          ...a,
          search: searchValue,
          khuudasniiDugaar: 1,
        }));
      },
    };
  }, [
    turul,
    eneSardTuluuguiGereenuud,
    data,
    onSearchMedeelel,
    setEneSardTuluuguiGereenuud,
  ]);

  const computedTotals = useMemo(() => {
    const list = gereeniiMedeelel?.jagsaalt || [];
    const aldangiTuukhKharakhEsekh = baiguullaga?.tokhirgoo?.aldangiTuukhKharakhEsekh ?? false;
    const totals = {
      avlaga: 0,
      voucher: 0,
      tsutslagdsanAvlaga: 0,
      eneSardTulukh: 0,
      eneSardTulsun: 0,
      khungulult: 0,
    };

    list.forEach((item) => {
      const isCancelled = item?.tuluv == -1 || Number(item?.tuluv) === -1;
      const tureesiinUld = item.tureesiinUldegdel !== undefined
        ? item.tureesiinUldegdel
        : (parseFloat(item.uldegdel) || 0);

      const effUldegdel =
        isCancelled && tureesiinUld <= 0
          ? parseFloat(item?.tsutsalsanUldegdel) || 0
          : tureesiinUld;
      const aldangi = parseFloat(item?.aldangiinUldegdel) || 0;

      const totalItemAvlaga = effUldegdel + aldangi;

      totals.avlaga += totalItemAvlaga;
      totals.voucher += parseFloat(item?.voucherDun) || 0;
      if (isCancelled) {
        totals.tsutslagdsanAvlaga += totalItemAvlaga;
      }

      const amountPlan =
        isCancelled &&
          item?.tsutsalsanTuluvluguut != null &&
          item?.tsutsalsanTuluvluguut > 0
          ? item?.tsutsalsanTuluvluguut
          : item?.tuluvluguut;
      totals.eneSardTulukh += parseFloat(amountPlan) || 0;

      totals.eneSardTulsun += parseFloat(item?.tulsunDun) || 0;
      totals.khungulult += parseFloat(item?.khungulult) || 0;
    });

    return totals;
  }, [gereeniiMedeelel?.jagsaalt, shineBagana, totalsUpdateCount, baiguullaga]);

  const serverTotals = useMemo(() => {
    const gt = guilgeeniiToololt || {};
    return {
      avlaga: gt.avlaga?.[0]?.dun || 0,  // already includes aldangi
      voucher: gt.voucher?.[0]?.dun || 0,
      tsutslagdsanAvlaga: gt.tsutslagdsanAvlaga?.[0]?.dun || 0,
      eneSardTulukh: gt.eneSardTulukh?.[0]?.dun || 0,
      eneSardTulsun: gt.eneSardTulsun?.[0]?.dun || 0,
      khungulult: gt.khungulult?.[0]?.dun || 0,
    };
  }, [guilgeeniiToololt]);

  useEffect(() => {
    if (gereeniiMedeelel?.jagsaalt) {
    }
  }, [gereeniiMedeelel]);

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        width: 50,
        align: "center",
        fixed: "left",
        render: (text, record, index) => {
          const current = gereeniiMedeelel?.khuudasniiDugaar || 1;
          const pageSize = gereeniiMedeelel?.khuudasniiKhemjee || 100;
          return (current - 1) * pageSize + index + 1;
        },
      },
      {
        width: 100,
        align: "center",
        fixed: "left",
        title: t("РД"),
        dataIndex: "register",
      },
      {
        title: t("Талбай"),
        dataIndex: "talbainDugaar",
        ellipsis: true,
        align: "center",
        fixed: "left",
        width: 96,
        showSorterTooltip: false,
        sorter: () => 0,
        render: (data) => {
          const list = Array.isArray(data) ? data : data != null ? [data] : [];
          if (list.length === 0) return null;
          const label = list.join(", ");
          return (
            <Tooltip placement="top" title={<div style={{ maxWidth: 300 }}>{label}</div>}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 80, margin: "0 auto" }}>{label}</div>
            </Tooltip>
          );
        },
      },
      {
        width: 130,
        align: "center",
        fixed: "left",
        title: t("Нэр"),
        dataIndex: "ner",
      },
      {
        title: t("Утас"),
        dataIndex: "utas",
        ellipsis: true,
        align: "center",
        width: 100,
        render(data) {
          if (data && data.length > 1) {
            return (
              <Tooltip
                placement="top"
                title={
                  <div className="flex justify-center truncate">
                    {data.map((a, i) => (
                      <div
                        key={i}
                        className={`${data.length - 1 !== i && "pr-1"}`}
                      >
                        {a}
                        {data.length - 1 !== i && ","}
                      </div>
                    ))}
                  </div>
                }
              >
                <div className="flex justify-center truncate">
                  {data.map((a, i) => (
                    <div
                      key={i}
                      className={`${data.length - 1 !== i && "pr-1"}`}
                    >
                      {a}
                      {data.length - 1 !== i && ","}
                    </div>
                  ))}
                </div>
              </Tooltip>
            );
          } else
            return (
              <Tooltip placement="top" title={<div>{data}</div>}>
                <div>{data}</div>
              </Tooltip>
            );
        },
      },
      {
        title: t("Үлдэгдэл"),
        width: 150,
        dataIndex: "uldegdel",
        align: "center",
        summary: true,
        render(text, record, index) {
          return (
            <GereeniiUldegdel
              ugugdul={record}
              token={token}
              ognoo={ognoo}
              tsutsalsanTurul={
                turul === "tsutslagdsanAvlaga" ||
                (showTsutslagdsanAvlagaColumn &&
                  (turul === "eneSardTulukh" || turul === "eneSardTulsun") &&
                  (record?.tuluv == -1 || Number(record?.tuluv) === -1))
              }
              urt={gereeniiMedeelel?.jagsaalt?.length}
              refreshTotals={refreshTotals}
            />
          );
        },
        showSorterTooltip: false,
        sorter: (a, b) => {
          const effA = Number(
            a?.uldegdel ?? (a?.tuluv == -1 ? a?.tsutsalsanUldegdel : 0)
          );
          const effB = Number(
            b?.uldegdel ?? (b?.tuluv == -1 ? b?.tsutsalsanUldegdel : 0)
          );
          return effA - effB;
        },
      },
      {
        title: t("Бүртгэлийн дугаар"),
        dataIndex: "customerTin",
        width: "8rem",
        align: "center",
        ellipsis: true,
      },
      {
        width: "9rem",
        align: "center",
        excelHeader: t("Төлөх огноо"),
        title: () => (
          <div className="flex justify-center">
            <div className="flex w-full justify-end ">{t("Төлөх огноо")}</div>
            <div className="flex h-full w-[50%] items-center justify-end">
              <Popover
                placement="bottom"
                trigger="click"
                Tooltip={false}
                content={() => (
                  <div>
                    <DatePicker
                      allowClear
                      value={tulukhOgnoo}
                      format="YYYY-MM-DD"
                      onChange={(v) => {
                        setTulukhOgnoo(v);
                        setLoadingIndex(0);

                        setKhuudaslalt((kh) => ({
                          ...kh,
                          khuudasniiDugaar: 1,
                        }));
                      }}
                      placeholder={t("Төлөх Огноо Хайх")}
                    />
                  </div>
                )}
              >
                <a className="hover:scale-150 ">
                  <FilterOutlined
                    className={`text-lg ${tulukhOgnoo ? "text-blue-600" : "text-green-600"
                      }`}
                  />
                </a>
              </Popover>
            </div>
          </div>
        ),
        dataIndex: "daraagiinTulukhOgnoo",
        render(a, record) {
          if (a) {
            return moment(a).format("YYYY-MM-DD");
          }

          const responseDay = parseInt(record.tulukhUdur);
          if (!responseDay) return "";

          const today = moment();
          const todayDay = today.date();
          let targetDate = today.clone();
          if (responseDay < todayDay) {
            targetDate = targetDate.add(1, "month");
          }

          return (
            targetDate.format("YYYY-MM") +
            "-" +
            String(responseDay).padStart(2, "0")
          );
        },
        sorter: false,
      },
    ];

    if (turul == "eneSardTulukh") {
      jagsaalt.push({
        title: t("Төлөвлөгөөт"),
        dataIndex: "tuluvluguut",
        align: "center",
        summary: true,
        render: (tuluvluguut, record) => {
          const amount =
            (record.tuluv === -1 || Number(record.tuluv) === -1) &&
              record.tsutsalsanTuluvluguut != null &&
              record.tsutsalsanTuluvluguut > 0
              ? record.tsutsalsanTuluvluguut
              : tuluvluguut;
          return (
            <div className="w-full text-right">{formatNumber(amount || 0)}</div>
          );
        },
        ellipsis: true,
        width: "7rem",
      });
    }

    const aldangiTuukhKharakhEsekh = baiguullaga?.tokhirgoo?.aldangiTuukhKharakhEsekh ?? false;
    const filteredShineBagana = aldangiTuukhKharakhEsekh
      ? shineBagana.filter((col) => col.dataIndex !== "avlagiinUldegdel")
      : shineBagana;

    return [
      ...jagsaalt,
      ...filteredShineBagana,
      ...turulColumns,
      {
        title: t("Үйлдэл"),
        width: 280,
        align: "center",
        fixed: "right",
        key: "action",
        render: (text, row) => {
          const khuvi =
            row.baritsaaAvakhDun > 0
              ? (100 * row.baritsaaniiUldegdel) / row.baritsaaAvakhDun
              : 100;

          let strokeColor = "rgba(16, 185, 129,1)";
          if (khuvi < 0) strokeColor = "rgba(245, 158, 18,1)";

          const khuviAldangi =
            row.aldangiinUldegdel > 0
              ? (100 * row.tulsunAldangi) / row.aldangiinUldegdel
              : 100;

          let strokeColorAldangi = "rgba(16, 185, 129,1)";
          if (khuviAldangi < 0) strokeColorAldangi = "rgba(245, 158, 18,1)";

          return (
            <div className="flex w-full flex-row items-center justify-center divide-x-2 ">
              <a
                onClick={() => nekhemjleliinTuukhKharakh(row)}
                className="text-green-500 hover:scale-110 flex-shrink-0 px-[4px]"
              >
                <Tooltip
                  title={t("Нэхэмжлэлийн түүх харах")}
                  className="flex w-full items-center  justify-center "
                >
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
                    className="feather feather-folder d-block mx-auto"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </Tooltip>
              </a>
              <a
                onClick={() => khuulgaKharya(row)}
                className="fill-current text-green-500 hover:scale-110 flex-shrink-0 px-[4px]"
              >
                <Tooltip
                  title={t("Хуулга")}
                  className="flex w-full items-center  justify-center "
                >
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
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </Tooltip>
              </a>
              <a
                onClick={() => aldangiinKhuulgaKharya(row)}
                className="fill-current text-green-500 hover:scale-110 flex-shrink-0 px-[4px]"
              >
                <Tooltip
                  title={t("Алдангийн хуулга")}
                  className="flex w-full items-center  justify-center "
                >
                  <LiaMoneyCheckAltSolid className="text-[30px] text-green-500" />
                </Tooltip>
              </a>
              <a
                onClick={() => guilgeeKhiiya(row)}
                className="fill-current text-green-500 hover:scale-125 flex-shrink-0 px-[4px]"
              >
                <Tooltip
                  title={t("Гүйлгээ хийх")}
                  className="flex w-full items-center  justify-center "
                >
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 440.000000 377.000000"
                    preserveAspectRatio="xMidYMid meet"
                    className="h-6 w-8 fill-current text-green-500"
                  >
                    <g transform="translate(0.000000,377.000000) scale(0.100000,-0.100000)">
                      <path
                        d="M3080 3510 c-52 -14 -88 -40 -106 -77 -17 -34 -19 -67 -22 -285 l-3
                    -248 -549 0 c-418 0 -556 -3 -577 -12 -45 -21 -71 -48 -89 -94 -14 -36 -14
                    -48 -4 -81 20 -58 37 -80 86 -102 43 -21 56 -21 674 -21 545 0 636 2 667 15
                    87 37 103 75 103 246 0 71 3 129 7 129 10 0 693 -683 693 -693 0 -12 -678
                    -687 -690 -687 -6 0 -10 49 -10 130 0 133 -4 150 -44 198 -47 54 -10 52 -938
                    52 l-858 0 0 238 c0 227 -1 240 -22 282 -41 80 -119 110 -199 76 -36 -16
                    -1128 -1102 -1148 -1143 -14 -28 -14 -108 0 -136 6 -12 261 -273 568 -580 632
                    -634 603 -610 704 -564 88 40 91 54 95 350 l3 247 548 0 c581 0 591 1 633 47
                    10 10 25 36 33 58 32 75 -18 168 -102 193 -29 9 -209 12 -662 12 -537 0 -627
                    -2 -658 -15 -86 -36 -103 -76 -103 -241 0 -91 -3 -124 -12 -124 -13 0 -688
                    670 -688 682 0 12 678 688 690 688 6 0 10 -47 10 -124 0 -131 7 -166 43 -204
                    50 -53 24 -52 943 -52 l854 0 0 -236 c0 -215 2 -239 21 -283 14 -34 31 -54 58
                    -69 42 -24 109 -29 144 -11 28 14 1089 1071 1128 1123 23 31 29 50 29 88 0 27
                    -6 61 -14 76 -8 15 -266 277 -573 583 -488 486 -563 558 -598 566 -22 5 -51 6
                    -65 3z"
                      />
                    </g>
                  </svg>
                </Tooltip>
              </a>
              <div
                className="text-red-500 hover:scale-110 flex-shrink-0 px-[4px]"
                onClick={() => baritsaaUdirdya(row)}
              >
                <Tooltip
                  className="flex w-full items-center justify-center"
                  title={
                    khuvi < 100
                      ? t("Барьцаа дутуу", {
                        too: formatNumber(
                          (row.baritsaaAvakhDun || 0) -
                          (row.baritsaaniiUldegdel || 0)
                        ),
                      })
                      : `${formatNumber(row.baritsaaniiUldegdel)} ${t(
                        "барьцаа төлөгдсөн байна"
                      )}`
                  }
                >
                  {row.baritsaaAvakhEsekh === false ? (
                    <MinusCircleOutlined
                      style={{
                        fontSize: "22px",
                        color: "#ff0000",
                      }}
                    />
                  ) : (
                    <Progress
                      type="circle"
                      percent={
                        1 > khuvi ? khuvi?.toFixed(1) : khuvi?.toFixed(0)
                      }
                      width={22}
                      strokeColor={strokeColor}
                      trailColor={khuvi === 0 && "rgba(239, 68, 68,1)"}
                    />
                  )}
                </Tooltip>
              </div>
            </div>
          );
        },
        sorter: () => 0,
        showSorterTooltip: false,
      },
    ];
  }, [
    gereeniiMedeelel,
    loadingIndex,
    shineBagana,
    turulColumns,
    t,
    turul,
    showTsutslagdsanAvlagaColumn,
    baiguullaga,
  ]);

  function onChangeTurul(turul) {
    setTurul(turul);
    setKhuudaslalt((a) => ({ ...a, khuudasniiDugaar: 1 }));
  }

  function refreshData() {
    setTimeout(() => {
      tolooguiGereeniiTooMutate();
      guilgeeniiToololtMutate();
      setKhuudaslalt((a) => {
        a.jagsaalt = [];
        return { ...a };
      });
      mutate();
    }, 500);
  }

  function baritsaaUdirdya(data) {
    var baritsaaUdirdanKhadgalyaaId = "baritsaaUdirdanKhadgalyaaId";
    const footer = [
      <Button onClick={() => baritsaaref.current.khaaya()}>{t("Хаах")}</Button>,
      <Button
        type="primary"
        id={baritsaaUdirdanKhadgalyaaId}
        loading={modalLoading}
        onClick={async (e) => {
          if (modalLoading) return;
          setModalLoading(true);
          const btn = e.currentTarget;
          if (btn) btn.setAttribute("disabled", "true");
          try {
            await baritsaaref.current.khadgalya();
          } finally {
            setModalLoading(false);
            if (btn) btn.removeAttribute("disabled");
          }
        }}
      >
        {t("Хадгалах")}
      </Button>,
    ];
    modal(
      {
        title: t("Барьцаа"),
        icon: <FileExcelOutlined />,
        content: (
          <BaritsaaUdirdlaga
            data={data}
            baritsaaUdirdanKhadgalyaaId={baritsaaUdirdanKhadgalyaaId}
            ref={baritsaaref}
            token={token}
            baiguullagiinId={baiguullaga?._id}
            onFinish={refreshData}
          />
        ),
        footer,
      },
      []
    );
  }

  function guilgeeKhiiya(data) {
    if (
      ajiltan?.erkh !== "Admin" &&
      !_.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`)?.find(
        (a) => a === data.barilgiinId
      )
    ) {
      notification.warning({
        message: t("Таньд гүйлгээ хийх эрх байхгүй байна."),
      });
      return;
    }
    function refresh() {
      setTimeout(() => data.mutate && data.mutate(), 500);
      refreshData();
    }
    var khadgalyaButtonId = "khadgalyaButtonId";
    const footer = [
      <Button type="default" onClick={() => ref.current.khaaya()}>
        {t("Хаах")}
      </Button>,
      <Button
        type="primary"
        id={khadgalyaButtonId}
        loading={modalLoading}
        onClick={async (e) => {
          if (modalLoading) return;
          setModalLoading(true);
          const btn = e.currentTarget;
          if (btn) btn.setAttribute("disabled", "true");
          try {
            await ref.current.khadgalya();
          } finally {
            setModalLoading(false);
            if (btn) btn.removeAttribute("disabled");
          }
        }}
      >
        {t("Хадгалах")}
      </Button>,
    ];
    modal({
      title: t("Гүйлгээ хийх"),
      icon: <FileExcelOutlined />,
      width: "700px",
      content: (
        <GuilgeeKhiikh
          khadgalyaButtonId={khadgalyaButtonId}
          data={data}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          barilgiinId={barilgiinId}
          onFinish={refresh}
          date={ognoo}
          baiguullaga={baiguullaga}
        />
      ),
      footer,
    });
  }

  function nekhemjlelIlgeekh(data) {
    modal({
      title: t("Нэхэмжлэл илгээх"),
      icon: <FileExcelOutlined />,
      content: (
        <NekhemjlelIlgeekh
          t={t}
          data={data}
          ref={ref}
          token={token}
          onFinish={refreshData}
          ajiltan={ajiltan}
          baiguullaga={baiguullaga}
        />
      ),
      footer: [],
    });
  }

  function nekhemjleliinTuukhKharakh(data) {
    const footer = [
      <Button
        type="primary"
        onClick={() => ref.current.khevlekh()}
        icon={<PrinterOutlined />}
      >
        {t("Хэвлэх")}
      </Button>,
      <Button
        onClick={() => ref.current.khaaya()}
        icon={<CloseCircleOutlined />}
      >
        {t("Хаах")}
      </Button>,
    ];
    modal({
      title: (
        <div className="flex w-full justify-between ">
          {t("Нэхэмжлэлийн түүх")}
        </div>
      ),
      icon: <FileExcelOutlined />,
      width: "90vw",
      style: { top: 20 },
      content: (
        <NekhemjlekhiinTuukhTsonkh
          baiguullaga={baiguullaga}
          data={data}
          ajiltan={ajiltan}
          barilgiinId={barilgiinId}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          ognoo={ognoo}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }

  function medegdelIlgeekh(data) {
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <MedegdelIlgeekh
          data={data}
          ref={ref}
          token={token}
          onFinish={refreshData}
        />
      ),
      footer: [],
    });
  }

  function khuulgaKharya(data) {
    const footer = [
      <Button
        type="primary"
        onClick={() => ref.current.excelTatakh()}
        icon={<FileExcelOutlined />}
      >
        {t("Татах")}
      </Button>,
      <Button
        type="primary"
        onClick={() => ref.current.khevlekh()}
        icon={<PrinterOutlined />}
      >
        {t("Хэвлэх")}
      </Button>,
      <Button
        onClick={() => ref.current.khaaya()}
        icon={<CloseCircleOutlined />}
      >
        {t("Хаах")}
      </Button>,
    ];
    modal({
      title: (
        <div className="relative flex w-full justify-between">
          {t("Хуулга")}
        </div>
      ),
      icon: <FileExcelOutlined />,
      width: "90vw",
      bodyStyle: {
        height: "80vh",
      },
      style: { top: 20 },
      content: (
        <Khuulga
          data={data}
          ajiltan={ajiltan}
          barilgiinId={barilgiinId}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          ognoo={ognoo}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }

  function aldangiinKhuulgaKharya(data) {
    const footer = [
      <Button
        type="primary"
        onClick={() => ref.current.excelTatakh()}
        icon={<FileExcelOutlined />}
      >
        {t("Татах")}
      </Button>,
      <Button
        type="primary"
        onClick={() => ref.current.khevlekh()}
        icon={<PrinterOutlined />}
      >
        {t("Хэвлэх")}
      </Button>,
      <Button
        onClick={() => ref.current.khaaya()}
        icon={<CloseCircleOutlined />}
      >
        {t("Хаах")}
      </Button>,
    ];
    modal({
      title: (
        <div className="relative flex w-full justify-between">
          {t("Алдангийн хуулга")}
        </div>
      ),
      icon: <FileExcelOutlined />,
      width: "68vw",
      style: { top: 20 },
      content: (
        <KhuulgaAldangi
          data={data}
          ajiltan={ajiltan}
          barilgiinId={barilgiinId}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          ognoo={ognoo}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }

  function refresh() { }

  function olnoorGuilgeeOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GuilgeeExceleesOruulakhOlnoor
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          baiguullaga={baiguullaga}
          onFinish={refresh}
          zam="tooluurZaaltOruulya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Гүйлгээний загвар excel файл"
          zagvariinZam="tooluurZaaltZagvarAvya"
        />
      ),
      footer,
    });
  }
  function olnoorGuilgeeOruulakhExcelFc() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
        <Button type="primary" onClick={() => excelref.current.khadgalya()}>
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
    modal({
      width: "800px",
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <OnlyFcGuilgeeExcelees
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          baiguullaga={baiguullaga}
          onFinish={refresh}
          zam="tooluurZaaltOruulya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Гүйлгээний загвар excel файл"
          zagvariinZam="tooluurZaaltZagvarAvya"
        />
      ),
      bodyStyle: {
        maxHeight: "80vh",
        overflowY: "auto",
        paddingRight: "12px",
      },
      footer,
    });
  }

  function olnoorEkhniiUldegdelOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GuilgeeEkhniiUldegdelExceleesOruulakhOlnoor
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          baiguullaga={baiguullaga}
          onFinish={refresh}
          zam="ekhniiUldegdelOruulya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Эхний үлдэгдэл excel файл"
          zagvariinZam="ekhniiUldegdelZagvarOruulya"
        />
      ),
      footer,
    });
  }

  const excelColumns = useMemo(() => {
    var forExcel = [];
    columns.forEach((a) => {
      var title = a.title;
      var dataIndex = a.dataIndex;
      const render = a.render;
      if (a.title !== "№" && a.title !== "Үйлдэл") {
        a.dataIndex === "daraagiinTulukhOgnoo" ||
          a.dataIndex === "gereeniiOgnoo"
          ? forExcel.push({
            title: a.excelHeader || a.title,
            dataIndex,
            render,
          })
          : a.dataIndex === "uldegdel" ||
            a.dataIndex === "voucherDun" ||
            a.dataIndex === "khungulult" ||
            a.dataIndex === "tulsunDun" ||
            a.dataIndex === "tuluvluguut" ||
            a.dataIndex === "sariinTurees" ||
            a.dataIndex === "talbainNiitUne" ||
            a.dataIndex === "aldangiinUldegdel" ||
            a.dataIndex === "niitTulsunAldangi" ||
            a.dataIndex === "baritsaaAvakhDun" ||
            a.dataIndex === "avlagiinUldegdel" ||
            a.dataIndex === "baritsaaniiUldegdel" ||
            a.dataIndex === "baritsaaTulsunDun" ||
            a.dataIndex === "ashiglakhUldegdel"
            ? forExcel.push({
              title: a.excelHeader || a.title,
              __numFmt__: "#,##0.00",
              __cellType__: "TypeNumeric",
              dataIndex,
              render: (val, data) => {
                if (a.dataIndex === "baritsaaAvakhDun")
                  return (val || 0) - (data?.baritsaaniiUldegdel || 0);
                if (a.dataIndex === "baritsaaniiUldegdel")
                  return (data?.baritsaaTulsunDun || data?.baritsaaniiUldegdel || 0);
                if (a.dataIndex === "ashiglakhUldegdel") {
                  const tulsun = (data?.baritsaaTulsunDun || data?.baritsaaniiUldegdel || 0);
                  const uldegdel = (data?.baritsaaniiUldegdel || 0);
                  return tulsun - uldegdel;
                }
                if (a.dataIndex === "avlagiinUldegdel") {
                  const isCancelled =
                    data?.tuluv == -1 || Number(data?.tuluv) === -1;
                  const aldangiTuukhKharakhEsekh = baiguullaga?.tokhirgoo?.aldangiTuukhKharakhEsekh ?? false;
                  const tureesiinUld = data.tureesiinUldegdel !== undefined
                    ? data.tureesiinUldegdel
                    : (aldangiTuukhKharakhEsekh ? ((parseFloat(data.uldegdel) || 0) - (parseFloat(data.aldangiinUldegdel) || 0)) : (parseFloat(data.uldegdel) || 0));
                  const effUldegdel =
                    isCancelled && tureesiinUld <= 0
                      ? parseFloat(data?.tsutsalsanUldegdel) || 0
                      : tureesiinUld;
                  return effUldegdel + (data?.aldangiinUldegdel || 0);
                }
                if (a.dataIndex === "uldegdel") {
                  const isCancelled =
                    data?.tuluv == -1 || Number(data?.tuluv) === -1;
                  const raw = parseFloat(val);
                  return isCancelled && (raw == null || raw <= 0)
                    ? parseFloat(data?.tsutsalsanUldegdel) || 0
                    : val;
                }
                if (
                  a.dataIndex === "sariinTurees" ||
                  a.dataIndex === "tuluvluguut"
                ) {
                  const isCancelled =
                    data?.tuluv == -1 || Number(data?.tuluv) === -1;
                  return isCancelled &&
                    data?.tsutsalsanTuluvluguut != null &&
                    data?.tsutsalsanTuluvluguut > 0
                    ? data?.tsutsalsanTuluvluguut
                    : val;
                }
                return val;
              },
            })
            : forExcel.push({ title: a.excelHeader || a.title, dataIndex });
      }
    });
    return forExcel;
  }, [columns]);


  return (
    <Admin
      title="Гүйлгээний түүх"
      khuudasniiNer="guilgeeniiTuukh"
      className="p-0 md:p-4"
      onSearch={onSearch}
      tsonkhniiId="61c2c6bc1c2830c4e6f90cb5"
      loading={isValidating || isValidatingPlan}
      setNeesenEsekh={setNeesenEsekh}
    >
      <Card className="cardgrid col-span-12">
        <div className="hideScroll grid w-full grid-cols-1 gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid-cols-6 sm:py-2 md:gap-6 2xl:grid-cols-12">
          {[
            {
              too: (totalsUpdateCount === 0 && gereeniiMedeelel?.jagsaalt?.length > 0)
                ? <Spin size="small" />
                : formatNumber(computedTotals.avlaga || 0, 0),
              raw: computedTotals.avlaga || 0,
              turul: "avlaga",
              utga: "Хуримтлагдсан авлага",
              tailbar:
                "Өмнө сарын төлбөрийн үлдэгдлүүдийн нийлбэр болон энэ сарын тооцоо болно.",
            },
            {
              too: formatNumber(serverTotals.voucher || 0, 0),
              raw: serverTotals.voucher || 0,
              selectedColor: "bg-green-50 dark:bg-gray-900",
              turul: "voucher",
              utga: "Ваучер төлөлт",
              tailbar: "Огноонд хамаарагдах бүх Ваучер төлөлтийн нийлбэр дүн",
            },
            {
              too: formatNumber(serverTotals.tsutslagdsanAvlaga || 0, 0),
              raw: serverTotals.tsutslagdsanAvlaga || 0,
              turul: "tsutslagdsanAvlaga",
              selectedColor: "bg-green-50 dark:bg-gray-900",
              utga: "Цуцлагдсан гэрээний авлага",
              tailbar: "Идэвхигүй буюу цуцлагдсан гэрээний нийт авлага",
            },
            {
              too: formatNumber(serverTotals.eneSardTulukh || 0, 0),
              raw: serverTotals.eneSardTulukh || 0,
              turul: "eneSardTulukh",
              selectedColor: "bg-green-50 dark:bg-gray-900",
              utga: "Төлөвлөгөө / сар",
              tailbar: "Энэ сард төлөгдвөл зохих нийт дүн",
            },
            {
              too: formatNumber(serverTotals.eneSardTulsun || 0, 0),
              raw: serverTotals.eneSardTulsun || 0,
              turul: "eneSardTulsun",
              selectedColor: "bg-green-50 dark:bg-gray-900",
              utga: "Гүйцэтгэл / сар",
              tailbar: "Огноонд хамаарагдах бүх төлөгдсөн дүнгийн нийлбэр",
            },
            {
              too: formatNumber(serverTotals.khungulult || 0, 0),
              raw: serverTotals.khungulult || 0,
              turul: "khungulult",
              selectedColor: "bg-green-50 dark:bg-gray-900",
              utga: "Хөнгөлөлт / сар",
              tailbar: "Огноонд хамаарагдах бүх хөнгөлөлтийн дүнгийн нийлбэр",
            },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className={`group relative w-[65vw] cursor-pointer overflow-hidden rounded-2xl 
            transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl 
            hover:shadow-gray-300 dark:hover:shadow-gray-800 sm:col-span-12 sm:w-auto lg:col-span-2 ${turul === mur?.turul
                    ? "border-2 border-green-500 bg-green-50/60 dark:border-green-900 dark:bg-green-950/40"
                    : "border-2 border-green-200 bg-green-50/60 dark:border-green-900 dark:bg-green-950/40"
                  }`}
                onClick={() => onChangeTurul(mur?.turul)}
                data-aos="zoom-out-up"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
              >
                <Tooltip title={
                  <div className="space-y-1">
                    <div className="font-bold border-b border-white/20 pb-1 mb-1">{t(mur.utga)}</div>
                    <div>{t(mur.tailbar)}</div>

                  </div>
                }>
                  <div className="relative h-20 w-[65vw] overflow-hidden rounded-2xl sm:h-20 sm:w-auto">
                    <div className="absolute inset-0 bg-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                    <div className="relative h-full rounded-2xl p-3">
                      <div className="flex h-full flex-col justify-between gap-1">
                        <div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {mur.too}
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            {t(mur.utga)}
                          </div>
                          <div className="flex flex-col text-center">
                            {mur.turul === "eneSardTulukh" && (
                              <>
                                <div className="flex justify-center">
                                  <ExclamationCircleOutlined
                                    style={{
                                      fontSize: "18px",
                                      color: "red",
                                    }}
                                  />
                                </div>
                                <div className="text-xs font-bold text-red-500">
                                  {eneSardTuluuguiGereenuud?.niitMur ||
                                    tolooguiGereeniiToo?.too}
                                </div>
                              </>
                            )}
                            <div className="text-lg text-green-600 dark:text-green-400">
                              {mur.icon}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-500 transition-all duration-500 group-hover:w-full"></div>
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>

        <div
          className="mt-5 flex w-full flex-col gap-5  md:flex-row"
          data-aos="zoom-in-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <DatePicker.RangePicker
              picker="month"
              value={ognoo}
              onChange={(v) => {
                setOgnoo(v);
                setLoadingIndex(0);
                setEneSardTuluuguiGereenuud((kh) => ({
                  ...kh,
                  khuudasniiDugaar: 1,
                  jagsaalt: [],
                }));
                setKhuudaslalt((kh) => ({ ...kh, khuudasniiDugaar: 1 }));
              }}
              clearIcon={false}
              className="w-full sm:w-auto !h-8"
            />
            <div className="w-full sm:ml-5 sm:w-[200px]">
              <Select
                placeholder={t("Давхар")}
                onChange={setDavkhar}
                allowClear
                className="!h-8 w-full"
              >
                {baiguullaga?.barilguud
                  ?.find((a) => a._id === barilgiinId)
                  ?.davkharuud.map((a) => (
                    <Select.Option key={a._id} value={a.davkhar}>
                      {a.davkhar}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          </div>
          <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2 sm:justify-end md:ml-auto md:w-auto">
            {ajiltan?.nevtrekhNer === "CAdmin1" && (
              <Button
                type="primary"
                onClick={aldangiBodoyo}
                loading={aldangiBodokhLoading}
                disabled={!baiguullaga?._id}
              >
                {t("Алданги бодох")}
              </Button>
            )}
            {ajiltan?.nevtrekhNer === "CAdmin1" && (
              <Button
                className="mr-10"
                type="primary"
                onClick={aldangiUstgayaa}
                loading={aldangiUstgahLoading}
                disabled={!baiguullaga?._id || !barilgiinId}
              >
                {t("Алданги устгах")}
              </Button>
            )}

            <Popover
              content={() => (
                <div className="flex w-32 flex-col">
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg hover:bg-green-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={() => {
                      const { Excel } = require("antd-table-saveas-excel");
                      const excelExport = new Excel();
                      excelExport
                        .addSheet("Гүйлгээний түүх")
                        .addColumns(excelColumns)
                        .addDataSource(gereeniiMedeelel?.jagsaalt)
                        .saveAs("Гүйлгээний түүх.xlsx");
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
              <Button
                className="w-full sm:w-auto"
                type="primary"
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
                size="default"
              >
                <span>Excel</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
            <Popover>
              <Button
                type="primary"
                onClick={olnoorGuilgeeOruulakhExcel}
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
                size="default"
                className="w-full sm:w-auto"
              >
                <span>{t("Заалт оруулах")}</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
            <Popover>
              <Button
                type="primary"
                onClick={olnoorGuilgeeOruulakhExcelFc}
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
                size="default"
                className="w-full sm:w-auto"
              >
                <span>{t("Заалт")}</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
            <Popover>
              <Button
                type="primary"
                onClick={olnoorEkhniiUldegdelOruulakhExcel}
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
                size="default"
                className="w-full sm:w-auto"
              >
                <span>{t("Эхний үлдэгдэл оруулах")}</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
            <BaganiinSongolt
              shineBagana={shineBagana}
              setShineBagana={setShineBagana}
              columns={[
                {
                  title: t("Сарын түрээс"),
                  width: "8rem",
                  dataIndex: "sariinTurees",
                  summary: true,
                  align: "center",
                  render: (a) => {
                    return (
                      <div className="w-full text-right">
                        {formatNumber(a || 0)}
                      </div>
                    );
                  },
                },
                {
                  title: t("м2"),
                  width: "3rem",
                  dataIndex: "talbainKhemjee",
                  summary: true,
                  align: "center",
                  render: (a) => {
                    return (
                      <div className="w-full text-center">
                        {a}
                      </div>
                    );
                  },
                },
                {
                  title: t("Талбайн үнэ"),
                  width: "8rem",
                  align: "center",
                  summary: true,
                  dataIndex: "talbainNiitUne",
                  render: (a) => {
                    return (
                      <div className="w-full text-right">
                        {formatNumber(a || 0)}
                      </div>
                    );
                  },
                },
                {
                  title: t("Давхар"),
                  dataIndex: "davkhar",
                  ellipsis: true,
                  align: "center",
                  width: "5rem",
                  showSorterTooltip: false,
                  defaultSortOrder: "descend",
                  sorter: () => 0,
                },
                {
                  title: t("Түрээслэгч"),
                  dataIndex: "ner",
                  ellipsis: true,
                  align: "center",
                  width: "8rem",
                  render(a) {
                    return <div className="text-left">{a}</div>;
                  },
                },
                {
                  title: t("Гэрээний огноо"),
                  width: "11rem",
                  dataIndex: "gereeniiOgnoo",
                  ellipsis: true,
                  align: "center",
                  render(a) {
                    return moment(a).format("YYYY-MM-DD");
                  },
                  sorter: () => 0,
                },
                {
                  title: t("Гэрээний дугаар"),
                  width: "11rem",
                  dataIndex: "gereeniiDugaar",
                  ellipsis: true,
                  align: "center",
                  render(a) {
                    return a;
                  },
                  sorter: () => 0,
                },
                {
                  title: t("Алданги"),
                  dataIndex: "aldangiinUldegdel",
                  className: "text-center",
                  align: "center",
                  ellipsis: true,
                  width: "7rem",
                  summary: true,
                  render: (aldangiinUldegdel, record) => {
  return (
    <GereeniiAldangi
      ugugdul={record}
      token={token}
    />
  );
},
                },
                {
                  title: t("Төлсөн алданги"),
                  dataIndex: "niitTulsunAldangi",
                  className: "text-center",
                  align: "center",
                  ellipsis: true,
                  width: "7rem",
                  summary: true,
                  render: (niitTulsunAldangi) => {
                    return (
                      <div className="w-full text-right">
                        {formatNumber(niitTulsunAldangi || 0)}
                      </div>
                    );
                  },
                },
                {
                  title: t("Авлагын үлдэгдэл"),
                  dataIndex: "avlagiinUldegdel",
                  className: "text-center",
                  align: "center",
                  ellipsis: true,
                  width: 120,
                  summary: true,
                  render(text, data, index) {
                    const isCancelled =
                      data?.tuluv == -1 || Number(data?.tuluv) === -1;
                    const aldangiTuukhKharakhEsekh = baiguullaga?.tokhirgoo?.aldangiTuukhKharakhEsekh ?? false;
                    const tureesiinUld = data.tureesiinUldegdel !== undefined
                      ? data.tureesiinUldegdel
                      : (aldangiTuukhKharakhEsekh ? ((parseFloat(data.uldegdel) || 0) - (parseFloat(data.aldangiinUldegdel) || 0)) : (parseFloat(data.uldegdel) || 0));
                    const effUldegdel =
                      isCancelled && tureesiinUld <= 0
                        ? parseFloat(data.tsutsalsanUldegdel) || 0
                        : tureesiinUld;
                    return (
                      <div className="w-full text-right">
                        {formatNumber(
                          effUldegdel + (data.aldangiinUldegdel || 0)
                        )}
                      </div>
                    );
                  },
                },
                {
                  title: t("Барьцаа үлдэгдэл"),
                  dataIndex: "baritsaaAvakhDun",
                  className: "text-center",
                  align: "center",
                  ellipsis: true,
                  width: "7rem",
                  summary: true,
                  render: (baritsaaAvakhDun, data) => {
                    return (
                      <div className="w-full text-right">
                        {formatNumber(
                          (baritsaaAvakhDun || 0) -
                          (data.baritsaaniiUldegdel || 0)
                        )}
                      </div>
                    );
                  },
                },
                {
                  title: t("Барьцаа төлөлт"),
                  dataIndex: "baritsaaniiUldegdel",
                  className: "text-center",
                  align: "center",
                  ellipsis: true,
                  width: "7rem",
                  summary: true,
                  render: (_, record) => {
                    return (
                      <div className="w-full text-right">
                        {formatNumber(record.baritsaaTulsunDun || record.baritsaaniiUldegdel || 0)}
                      </div>
                    );
                  },
                },
                {
                  title: t("Барьцаа ашиглалт"),
                  dataIndex: "ashiglakhUldegdel",
                  className: "text-center",
                  align: "center",
                  ellipsis: true,
                  width: "7rem",
                  summary: true,
                  render: (_, record) => {
                    const tulsun = record.baritsaaTulsunDun || record.baritsaaniiUldegdel || 0;
                    const uldegdel = record.baritsaaniiUldegdel || 0;
                    return (
                      <div className="w-full text-right">
                        {formatNumber(tulsun - uldegdel)}
                      </div>
                    );
                  },
                },

              ]}
            />
          </div>
        </div>
        <div
          className="mt-5 hidden md:block"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          <TableGuilgee
            columns={columns}
            garalt={gereeniiMedeelel}
            setKhuudaslalt={
              (turul === "eneSardTulukh" || turul === "baritsaaAshiglasanDun")
                ? setEneSardTuluuguiGereenuud
                : setKhuudaslalt
            }
            setLoadingIndex={setLoadingIndex}
            onChange={khusnegtOrderChange}
            turul={turul}
            showTsutslagdsanAvlagaColumn={showTsutslagdsanAvlagaColumn}
            setShowTsutslagdsanAvlagaColumn={setShowTsutslagdsanAvlagaColumn}
            guilgeeniiToololt={guilgeeniiToololt}
            guilgeeniiToololtMutate={guilgeeniiToololtMutate}
            refreshTotals={refreshTotals}
            baiguullaga={baiguullaga}
            totalsUpdateCount={totalsUpdateCount}
          />
        </div>
        <CardList
          neesenEsekh={neesenEsekh}
          tileProps={{
            GereeniiUldegdel,
            turul,
            khuulgaKharya,
            nekhemjlelIlgeekh,
            guilgeeKhiiya,
            baritsaaUdirdya,
          }}
          cardListTuluv={"utas"}
          keyValue="guilgeeTuukh"
          className="block w-[200px] overflow-auto md:hidden"
          jagsaalt={gereeniiMedeelel?.jagsaalt}
          Component={GuilgeenTuukhTile}
          pagination={{
            current: gereeniiMedeelel?.khuudasniiDugaar,
            pageSize: gereeniiMedeelel?.khuudasniiKhemjee,
            total: gereeniiMedeelel?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default GuilgeeniiTuukh;
