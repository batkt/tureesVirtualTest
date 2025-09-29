import moment from "moment";
import { useAuth } from "services/auth";
import readMethod from "tools/function/crud/readMethod";
import {
  FileDoneOutlined,
  HistoryOutlined,
  WarningOutlined,
  FileExcelOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
  SettingOutlined,
  FieldTimeOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
  RedoOutlined,
  FileTextOutlined,
  FileOutlined,
} from "@ant-design/icons";
import {
  Table,
  Card,
  Popover,
  Popconfirm,
  Drawer,
  DatePicker,
  Button,
  Space,
  message,
  Input,
  InputNumber,
  notification,
  Modal,
  Switch,
} from "antd";
import { toWords } from "mon_num";
import Admin from "components/Admin";
import formatNumber from "tools/function/formatNumber";
import React, { useMemo, useEffect, useState } from "react";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import { useGereeniiJagsaaltToollolt } from "hooks/useGereeniiJagsaalt";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import GereeKharakh from "components/pageComponents/geree/Kharakh";
import router from "next/router";
import { useReactToPrint } from "react-to-print";
import locale from "antd/lib/date-picker/locale/mn_MN";
import GereeExceleesOruulakh from "components/pageComponents/geree/GereeExceleesOruulakh";
import GereeZuragOruulakh from "components/pageComponents/geree/GereeZuragOruulakh";
import Sungakh from "components/pageComponents/geree/Sungakh";
import { modal } from "components/ant/Modal";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import CardList from "components/cardList";
import GereeTile from "components/pageComponents/geree/GereeTile";
import useOrder from "tools/function/useOrder";
import BaganiinSongolt from "components/table/BaganiinSongolt";
import Aos from "aos";
import { renderToString } from "react-dom/server";
import { ImFileEmpty, ImFileText2 } from "react-icons/im";
import _ from "lodash";
import { useTranslation } from "react-i18next";

function GereeSegmentTile({ zasya, token, ...a }) {
  return (
    <div className="box dark:text-white">
      <div className="flex items-center px-5 py-2 shadow-none">
        <div className="flex gap-2 border-l-2 border-green-500 pl-4">
          <div className="font-medium">{a.ner}</div>
          <div className="font-medium text-gray-600 dark:text-gray-300">
            ({a.utga})
          </div>
        </div>
      </div>
    </div>
  );
}

function excelTatajAvya(token, service, mur, sheet, query, order, sheetName) {
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
    });
}

const Tailbar = React.forwardRef(
  ({ token, baiguullaga, destroy, confirm, data, service }, ref) => {
    const { t } = useTranslation();
    const [shaltgaan, setTailbar] = React.useState("");
    const [duusakhOgnoo, setDuusakhOgnoo] = React.useState(moment());
    const [sergeekhOgnoo, setSergeekhOgnoo] = React.useState(moment());
    const [tsutslakhOgnoo, setTsutslakhOgnoo] = React.useState([
      moment(),
      moment(),
    ]);

    const [odoogiinUldegdel, setOdoogiinUldegdel] = React.useState(0);
    const [ekhniiUldegdel, setEkhniiUldegdel] = React.useState(0);
    const [avlagaUldegdel, setAvlagaUldegdel] = React.useState(0);
    const [niilberAvlaga, setNiilberAvlaga] = React.useState(0);

    const [garaasAvlagaOruulakh, setGaraasAvlagaOruulakh] =
      React.useState(false);
    const [suuliinSariinAvlaguud, setSuuliinSariinAvlaguud] = React.useState(
      []
    );

    React.useImperativeHandle(
      ref,
      () => ({
        khadgalya() {
          if (shaltgaan === "") {
            notification.warning({
              message: t("Анхаар"),
              description: t("Шалтгаан аа бичнэ үү"),
            });
            return;
          }
          var tempAvlaguud = [];
          if (baiguullaga?.tokhirgoo?.udruurBodokhEsekh)
            tempAvlaguud =
              garaasAvlagaOruulakh && niilberAvlaga > 0
                ? [
                    {
                      turul: "avlaga",
                      tailbar: shaltgaan,
                      ognoo: tsutslakhOgnoo[0],
                      tulukhDun: niilberAvlaga,
                    },
                  ]
                : suuliinSariinAvlaguud;

          uilchilgee(token)
            .post(service, {
              gereeniiId: data?._id,
              barilgiinId: data?.barilgiinId,
              shaltgaan,
              duusakhOgnoo,
              sergeekhOgnoo,
              suuliinSariinAvlaguud: tempAvlaguud,
              udruurBodokhEsekh: baiguullaga?.tokhirgoo?.udruurBodokhEsekh,
              tsutslakhOgnoo: baiguullaga?.tokhirgoo?.udruurBodokhEsekh
                ? tsutslakhOgnoo[0]
                : moment(),
            })
            .then(({ data }) => {
              if (data === "Amjilttai") {
                if (service === "/gereeSergeeye") {
                  message.success("Гэрээ амжилттай сэргээгдлээ");
                } else message.success("Гэрээ амжилттай цуцлагдлаа");
                confirm(shaltgaan);
                destroy();
              }
            });
        },
        khaaya() {
          destroy();
        },
      }),
      [
        shaltgaan,
        duusakhOgnoo,
        sergeekhOgnoo,
        suuliinSariinAvlaguud,
        garaasAvlagaOruulakh,
        niilberAvlaga,
        tsutslakhOgnoo,
      ]
    );
    function garya() {
      if (shaltgaan !== "")
        Modal.confirm({
          content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
          okText: t("Тийм"),
          cancelText: t("Үгүй"),
          onOk: destroy,
        });
      else destroy();
    }

    useEffect(() => {
      var ognoo = [data?.gereeniiOgnoo, moment(new Date())];
      uilchilgee(token)
        .post("/uldegdelBodyo", {
          baiguullagiinId: data.baiguullagiinId,
          barilgiinId: data.barilgiinId,
          gereeniiDugaar: data.gereeniiDugaar,
          ognoo: ognoo,
        })
        .then(({ data }) => {
          if (!!data) {
            setOdoogiinUldegdel(data.uldegdel);
          }
        })
        .catch(aldaaBarigch);
    }, [data.gereeniiDugaar]);

    useEffect(() => {
      if (
        service === "/gereeTsutslaya" &&
        baiguullaga?.tokhirgoo?.udruurBodokhEsekh
      ) {
        setEkhniiUldegdel(0);
        var ognoo = [
          data?.gereeniiOgnoo,
          moment(tsutslakhOgnoo[0]).subtract(1, "month"),
        ];
        uilchilgee(token)
          .post("/uldegdelBodyo", {
            baiguullagiinId: data.baiguullagiinId,
            barilgiinId: data.barilgiinId,
            gereeniiDugaar: data.gereeniiDugaar,
            ognoo: ognoo,
          })
          .then(({ data }) => {
            if (!!data) {
              setEkhniiUldegdel(data.uldegdel);
            }
          })
          .catch(aldaaBarigch);
      }
    }, [data.gereeniiDugaar, tsutslakhOgnoo]);

    useEffect(() => {
      function keyUp(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          garya();
        }
      }

      document.addEventListener("keyup", keyUp);
      return () => document.removeEventListener("keyup", keyUp);
    }, [shaltgaan]);

    useEffect(() => {
      document.getElementById("shaltgaanTextArea").focus();
    }, []);

    function disabledDate(current) {
      if (!current) return false;

      const minDate = moment().subtract(1, "month").startOf("month");
      const maxDate = moment().endOf("month");

      return !current.isBetween(minDate, maxDate, "day", "[]");
    }

    function changeOgnoo(e) {
      setTsutslakhOgnoo(e);
      setAvlagaUldegdel(0);
      setSuuliinSariinAvlaguud([]);
      var diffDay = moment(e[1]).diff(moment(e[0]), "day") + 1;
      if (diffDay > 0) {
        uilchilgee(token)
          .post("/ashiglakhKhonogTootsoolokh", {
            ashiglakhEkhlekhOgnoo: e[0],
            ashiglakhDuuskhOgnoo: e[1],
            gereeniiId: data?._id,
            diffDay: diffDay,
            ekhniiUldegdel: ekhniiUldegdel,
          })
          .then(({ data }) => {
            if (!!data) {
              setAvlagaUldegdel(data.uldegdelAvlaga);
              setSuuliinSariinAvlaguud(data.avlagas);
            }
          })
          .catch(aldaaBarigch);
      }
    }

    function garaasAvlagaUusgekh(e) {
      setGaraasAvlagaOruulakh(e);
      if (e) {
        setNiilberAvlaga(0);
        setSuuliinSariinAvlaguud([]);
      } else changeOgnoo(tsutslakhOgnoo);
    }

    return (
      <div className="w-full space-y-2 dark:text-gray-200">
        <div className="w-full space-y-1">
          <div className="flex w-full flex-row justify-between">
            <div className="text-right">
              {t(
                service === "/gereeSergeeye" ? "Сэргээх огноо" : "Эхлэх огноо"
              )}
              :
            </div>
            {service === "/gereeSergeeye" ? (
              <DatePicker value={sergeekhOgnoo} onChange={setSergeekhOgnoo} />
            ) : (
              <div className="font-medium">
                {moment(data?.gereeniiOgnoo).format("YYYY-MM-DD")}
              </div>
            )}
          </div>
          <div className="flex w-full flex-row justify-between">
            <div className="text-right">{t("Дуусах огноо")}:</div>
            {service === "/gereeSergeeye" ? (
              <DatePicker value={duusakhOgnoo} onChange={setDuusakhOgnoo} />
            ) : (
              <div className="font-medium">
                {moment(data?.duusakhOgnoo).format("YYYY-MM-DD")}
              </div>
            )}
          </div>
          {service !== "/gereeSergeeye" && (
            <div className="flex w-full flex-row justify-between">
              <div className="text-right">{t("Ашигласан хоног")}:</div>
              <div className="font-medium">
                {moment(new Date()).diff(moment(data?.gereeniiOgnoo), "day")}
              </div>
            </div>
          )}
          {service !== "/gereeSergeeye" && (
            <div className="flex w-full flex-row justify-between">
              <div className="text-right">{t("Авлагын дүн")}:</div>
              <div className="font-medium">
                {formatNumber(odoogiinUldegdel)}
              </div>
            </div>
          )}
          {service === "/gereeTsutslaya" &&
            baiguullaga?.tokhirgoo?.udruurBodokhEsekh && (
              <div className="flex w-full flex-row justify-between">
                <div className="text-right">{t("Авлагын эхний үлдэгдэл")}:</div>
                <div className="font-medium">
                  {formatNumber(ekhniiUldegdel)}
                </div>
              </div>
            )}
          {service === "/gereeTsutslaya" &&
            baiguullaga?.tokhirgoo?.udruurBodokhEsekh && (
              <div className="flex w-full flex-row justify-between">
                <div className="text-right">
                  {t("Авлагын эцсийн үлдэгдэл")}:
                </div>
                <div className="font-medium">
                  {formatNumber(avlagaUldegdel)}
                </div>
              </div>
            )}
          {service === "/gereeTsutslaya" &&
            baiguullaga?.tokhirgoo?.udruurBodokhEsekh && (
              <div className="flex w-full flex-row justify-between">
                <div className="text-right"> Ашиглах огноо </div>
                <DatePicker.RangePicker
                  className="font-medium"
                  placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                  disabledDate={disabledDate}
                  value={tsutslakhOgnoo}
                  onChange={(e) => changeOgnoo(e)}
                />
              </div>
            )}
          {service === "/gereeTsutslaya" &&
            baiguullaga?.tokhirgoo?.udruurBodokhEsekh && (
              <div className="flex w-full flex-row justify-between">
                <div className="text-right">
                  {t("Тухайн цуцалсан сарын ашигласан хоног")}:
                </div>
                <div className="font-medium">
                  {moment(tsutslakhOgnoo[1]).diff(
                    moment(tsutslakhOgnoo[0]),
                    "day"
                  ) + 1}
                </div>
              </div>
            )}
          {service === "/gereeTsutslaya" &&
            baiguullaga?.tokhirgoo?.udruurBodokhEsekh && (
              <div className="flex w-full flex-row justify-between">
                <div className="text-right">
                  {t("Гараас нийлбэр авлага оруулах эсэх")}:
                </div>
                <div className="font-medium">
                  <Switch
                    defaultChecked={garaasAvlagaOruulakh}
                    onChange={(v) => garaasAvlagaUusgekh(v)}
                  />
                </div>
              </div>
            )}
          {service === "/gereeTsutslaya" &&
            baiguullaga?.tokhirgoo?.udruurBodokhEsekh &&
            garaasAvlagaOruulakh && (
              <div className="flex w-full flex-row justify-between">
                <div className="text-right">
                  {t("Нийлбэр авлага үүсгэх дүн")}:
                </div>
                <div className="flex w-1/2 font-medium">
                  <InputNumber
                    value={niilberAvlaga}
                    onChange={(v) => setNiilberAvlaga(v)}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            )}
        </div>

        <Input.TextArea
          id="shaltgaanTextArea"
          value={shaltgaan}
          onChange={({ target }) => setTailbar(target?.value)}
        />
      </div>
    );
  }
);

const select = {
  _id: 1,
  gereeniiDugaar: 1,
  aktiinZagvariinId: 1,
  gereeniiOgnoo: 1,
  turul: 1,
  ovog: 1,
  ner: 1,
  register: 1,
  customerTin: 1,
  albanTushaal: 1,
  zakhirliinOvog: 1,
  zakhirliinNer: 1,
  utas: 1,
  mail: 1,
  khayag: 1,
  khugatsaa: 1,
  duusakhOgnoo: 1,
  sariinTurees: 1,
  zuvshuurliinZurag: 1,
  talbainDugaar: 1,
  talbainNegjUne: 1,
  talbainNiitUne: 1,
  talbainKhemjee: 1,
  talbainKhemjeeMetrKube: 1,
  davkhar: 1,
  baritsaaAvakhDun: 1,
  baritsaaBairshuulakhKhugatsaa: 1,
  baritsaaAvakhKhugatsaa: 1,
  baiguullagiinId: 1,
  baiguullagiinNer: 1,
  barilgiinId: 1,
  gereeniiZagvariinId: 1,
  tulukhUdur: 1,
  tuluv: 1,
  dans: 1,
  gereeniiTuukhuud: 1,
  createdAt: 1,
  aldangiinUldegdel: 1,
  segmentuud: 1,
  turGereeEsekh: 1,
  talbainIdnuud: 1,
  zardluud: 1,
  zoriulalt: 1,
  zurguud: 1,
  tusgaiZoriulalt: 1,
};

function setURLSearchParam(key, value) {
  const url = new URLSearchParams(window.location.search);
  url.set(key, value);
  history.replaceState(null, null, "?" + url.toString());
}

function ZakhialgiinKhyanalt() {
  //#region const
  const { t, i18n } = useTranslation();
  const { token, baiguullaga, barilgiinId, ajiltan, gereeniiId } = useAuth();
  const [gereeOgnoo, setGereeOgnoo] = React.useState();
  const query = useMemo(() => {
    return {
      tuluv: { $nin: [-1] },
      gereeniiOgnoo:
        gereeOgnoo?.length > 0
          ? {
              $gte: moment(gereeOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
              $lte: moment(gereeOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
            }
          : { $exists: true },
      duusakhOgnoo: { $gte: new Date() },
    };
  }, [gereeOgnoo]);
  const [shuult, setShuult] = React.useState({
    utga: "Хэвийн",
    query: query,
  });
  const [neesenEsekh, setNeesenEsekh] = useState(false);
  const { order, onChangeTable, setOrder } = useOrder({ createdAt: -1 });
  const {
    gereeniiMedeelel,
    gereeniiMedeelelMutate,
    setGereeniiKhuudaslalt,
    isValidating,
  } = useGereeniiJagsaalt(
    token,
    baiguullaga?._id,
    undefined,
    shuult?.query,
    undefined,
    100,
    order,
    select
  );
  function onChange(k, v) {
    setDaalgavar((a) => ({ ...a, [k]: v }));
  }
  const { gereeToollolt, gereeToolloltMutate } =
    useGereeniiJagsaaltToollolt(token);
  const [kharuulakhGeree, setKharuulakhGeree] = React.useState(null);
  const [gereeniiTokhirgoo, setGereeniiTokhirgoo] = React.useState(null);

  const componentRef = React.useRef();
  const excelref = React.useRef();
  const zuragref = React.useRef();
  const tailbarRef = React.useRef();
  const sungaltRef = React.useRef();

  const [shineBagana, setShineBagana] = React.useState([]);
  useEffect(() => {
    Aos.init({ once: true });
  });
  const excelNemekhCol = useMemo(() => {
    return shineBagana.map((e, i) => {
      const column = {
        title: e.dataIndex === "talbainKhemjee" ? `${e?.title} /т2/` : e?.title,
        dataIndex: e.dataIndex,
        align: "center",
        className: "text-center",
        ellipsis: true,
      };

      if (e.dataIndex === "createdAt") {
        column.render = (data) => {
          return moment(data).format("YYYY-MM-DD HH:mm");
        };
      }

      return column;
    });
  }, [shineBagana]);

  const sheet = [
    {
      title: t("Гэрээ"),
      dataIndex: "gereeniiDugaar",
      className: "text-center",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("Нэр"),
      dataIndex: "ner",
      className: "text-center",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("Регистр"),
      dataIndex: "register",
      className: "text-center",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("Бүртгэлийн дугаар"),
      dataIndex: "customerTin",
      className: "text-center",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("Талбай"),
      dataIndex: "talbainDugaar",
      className: "text-center",
      align: "center",
      ellipsis: true,
    },

    {
      title: t("Төлбөр"),
      dataIndex: "sariinTurees",
      className: "text-center",
      align: "center",
      ellipsis: true,
      render: (sariinTurees) => {
        return formatNumber(sariinTurees || 0);
      },
      showSorterTooltip: false,
    },

    {
      title: t("Эхлэх"),
      dataIndex: "gereeniiOgnoo",
      className: "text-center",
      align: "center",
      ellipsis: true,
      render: (data) => {
        return moment(data).format("YYYY-MM-DD");
      },
    },
    {
      title: "Дуусах хоног",
      dataIndex: "duusakhOgnoo",
      className: "text-center",
      align: "center",
      ellipsis: true,
      render: (duusakhOgnoo) => {
        return moment(duusakhOgnoo).diff(moment(new Date()), "days");
      },
    },
    {
      title: t("Дуусах"),
      dataIndex: "duusakhOgnoo",
      className: "text-center",
      align: "center",
      ellipsis: true,
      render: (data) => {
        return moment(data).format("YYYY-MM-DD");
      },
      showSorterTooltip: false,
      sortOrder: "descend",
    },
    {
      title: "Ажилтан",
      dataIndex: "burtgesenAjiltaniiNer",
      className: "text-center",
      align: "center",
      ellipsis: true,
      render: () => {
        return "Админ";
      },
    },
    ...excelNemekhCol,
  ];

  useEffect(() => {
    if (JSON.stringify(shuult.utga) !== JSON.stringify("Хэвийн")) {
      setURLSearchParam("cardShuult", JSON.stringify(shuult.utga));
    }
    if (JSON.stringify(order) !== JSON.stringify({ createdAt: -1 })) {
      setURLSearchParam("orderID", JSON.stringify(order));
    }
  }, [order, shuult]);

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    if (url !== undefined) {
      if (!!url.get("orderID")) setOrder({ ...JSON.parse(url.get("orderID")) });
      if (!!url.get("cardShuult")) {
        const cardShuult = JSON.parse(url.get("cardShuult"));
        setShuult(khyanaltiinDun.find((e) => e.utga === cardShuult));
      }
    }
  }, [gereeOgnoo]);

  useEffect(() => {
    if (!!token)
      uilchilgee(token)
        .post("/erkhteiEsekh", { zam: "/khyanalt/geree/gereeBurtgel" })
        .then(({ data }) => data);
  }, [token]);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `@media print {
      @page { 
        size: auto;
        margin: 15mm 0 15mm 0;
      }
    }`,
  });

  const khyanaltiinDun = [
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.kheviin, 0)
          : 0,

      icon: <FileDoneOutlined />,
      utga: "Хэвийн",
      color: "text-green-500",
      selectedColor: "bg-green-50 dark:bg-gray-900",
      border: "border-green-500",
      query: {
        tuluv: { $nin: [-1] },
        duusakhOgnoo: { $gte: new Date() },
        gereeniiOgnoo:
          gereeOgnoo?.length > 0
            ? {
                $gte: moment(gereeOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(gereeOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
              }
            : { $exists: true },
      },
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.undsenGeree, 0)
          : 0,
      icon: <FileTextOutlined />,
      utga: "Үндсэн гэрээ",
      color: "text-blue-500",
      selectedColor: "bg-blue-50 dark:bg-gray-900",
      border: "border-blue-500",
      query: {
        turGereeEsekh: { $ne: true },
        tuluv: { $ne: -1 },
        gereeniiOgnoo:
          gereeOgnoo?.length > 0
            ? {
                $gte: moment(gereeOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(gereeOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
              }
            : { $exists: true },
      },
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.turGeree, 0) || 0
          : 0,
      icon: <FileOutlined />,
      utga: "Түр гэрээ",
      color: "text-purple-500",
      selectedColor: "bg-purple-50 dark:bg-gray-900",
      border: "border-purple-600",
      query: {
        turGereeEsekh: true,
        tuluv: { $ne: -1 },
        gereeniiOgnoo:
          gereeOgnoo?.length > 0
            ? {
                $gte: moment(gereeOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(gereeOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
              }
            : { $exists: true },
      },
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.khugatsaaKhetersen, 0)
          : 0,
      icon: <HistoryOutlined />,
      utga: "Хугацаа хэтэрсэн",
      color: "text-red-500",
      selectedColor: "bg-red-50 dark:bg-gray-900",
      border: "border-red-500",
      query: {
        tuluv: { $ne: -1 },
        gereeniiOgnoo:
          gereeOgnoo?.length > 0
            ? {
                $gte: moment(gereeOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(gereeOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
              }
            : { $exists: true },
        duusakhOgnoo: { $lte: new Date() },
      },
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.sungakh, 0)
          : 0,
      icon: <WarningOutlined />,
      utga: "Сунгах гэрээ",
      color: "text-yellow-500",
      selectedColor: "bg-yellow-50 dark:bg-gray-900",
      border: "border-yellow-500",
      query: {
        tuluv: { $ne: -1 },
        gereeniiOgnoo:
          gereeOgnoo?.length > 0
            ? {
                $gte: moment(gereeOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(gereeOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
              }
            : { $exists: true },
        duusakhOgnoo: { $lte: moment(new Date()).add(1, "month") },
      },
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.tsutsalsan, 0)
          : 0,
      icon: <FileExcelOutlined />,
      utga: "Цуцласан",
      color: "text-gray-800 dark:text-gray-300",
      selectedColor: "bg-gray-200 dark:bg-gray-900",
      border: "border-gray-800 dark:border-gray-300",
      query: {
        tuluv: -1,
        gereeniiOgnoo:
          gereeOgnoo?.length > 0
            ? {
                $gte: moment(gereeOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(gereeOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
              }
            : { $exists: true },
      },
    },
  ];
  function sortOrderShalgakh(v) {
    var utga = "";
    if (!!v) {
      v === -1 ? (utga = "descend") : (utga = "ascend");
    }
    return utga;
  }
  useEffect(() => {
    setShineBagana([]);
  }, [i18n.language]);
  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        align: "center",
        dataIndex: "dugaar",
        width: "2rem",
        render: (text, record, index) =>
          (gereeniiMedeelel?.khuudasniiDugaar || 0) *
            (gereeniiMedeelel?.khuudasniiKhemjee || 0) -
          (gereeniiMedeelel?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: t("Гэрээ"),
        fixed: "left",
        dataIndex: "gereeniiDugaar",
        align: "center",
        ellipsis: true,
        width: "7rem",
        sortOrder: sortOrderShalgakh(order.gereeniiDugaar),
        showSortesrTooltip: false,
        sorter: () => 0,
        render: (data, a) => {
          return (
            <div
              className={`relative ml-1 border-l-2 ${
                a.turGereeEsekh === true
                  ? "rounded-md border-purple-600 bg-gradient-to-r from-purple-200 dark:border-purple-400 dark:from-purple-900 "
                  : "rounded-md border-blue-500 bg-gradient-to-r from-blue-200 dark:border-blue-400 dark:from-blue-900 "
              }`}
            >
              <div
                className={`absolute -left-[7px] top-[5px] h-3 w-3 rounded-full ${
                  a.turGereeEsekh === true
                    ? "bg-purple-600 dark:bg-purple-400"
                    : "bg-blue-500 dark:bg-blue-400"
                }`}
              />
              {data}
            </div>
          );
        },
      },

      {
        title: t("Нэр"),
        fixed: "left",
        dataIndex: "ner",
        align: "left",
        ellipsis: true,
        width: "8rem",
        sortOrder: sortOrderShalgakh(order.ner),
        showSorterTooltip: false,
        sorter: () => 0,
      },

      {
        title: t("Регистр"),
        fixed: "left",
        dataIndex: "register",
        align: "center",
        ellipsis: true,
        width: "7rem",
        sortOrder: sortOrderShalgakh(order.register),
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Бүртгэлийн дугаар"),
        fixed: "left",
        dataIndex: "customerTin",
        align: "center",
        ellipsis: true,
        width: "7rem",
        sortOrder: sortOrderShalgakh(order.customerTin),
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Ажилтан"),
        dataIndex: "burtgesenAjiltaniiNer",
        align: "center",
        ellipsis: true,
        width: "7rem",
        render: () => {
          return <div className="w-full text-left">{t("Админ")}</div>;
        },
      },
      {
        title: t("Эхлэх"),
        dataIndex: "gereeniiOgnoo",
        align: "center",
        ellipsis: true,
        width: "7rem",
        render: (data) => {
          return moment(data).format("YYYY-MM-DD");
        },
      },

      {
        title: t(shuult.utga === "Цуцласан" ? "Цуцлагдсан" : "Дуусах"),
        dataIndex:
          shuult.utga === "Цуцласан" ? "gereeniiTuukhuud" : "duusakhOgnoo",
        align: "center",
        ellipsis: true,
        width: "7rem",
        render: (data) => {
          let ognoo;
          if (shuult.utga === "Цуцласан") {
            const tsutslyo = data?.filter((a) => a.turul === "Tsutslakh") || [];
            if (tsutslyo.length > 0) {
              const latest = tsutslyo.reduce((prev, current) => {
                return new Date(current.khiisenOgnoo) >
                  new Date(prev.khiisenOgnoo)
                  ? current
                  : prev;
              });
              ognoo = latest.khiisenOgnoo;
            }
          } else {
            ognoo = data;
          }
          return ognoo ? moment(ognoo).format("YYYY-MM-DD") : "-";
        },
        showSorterTooltip: false,
        sortOrder: sortOrderShalgakh(
          shuult.utga === "Цуцласан"
            ? order.gereeniiTuukhuud
            : order.duusakhOgnoo
        ),
        sorter: () => 0,
      },
      {
        title: t("Талбай"),
        dataIndex: "talbainDugaar",
        align: "center",
        ellipsis: true,
        width: "7rem",
        sortOrder: sortOrderShalgakh(order.talbainDugaar),
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Төлбөр"),
        dataIndex: "sariinTurees",
        align: "right",
        ellipsis: true,
        width: "7rem",
        render: (sariinTurees) => {
          return formatNumber(sariinTurees || 0);
        },
        sortOrder: sortOrderShalgakh(order.sariinTurees),
        showSorterTooltip: false,
        sorter: () => 0,
      },

      {
        title: t("Ангилал"),
        dataIndex: "segmentuud",
        width: "5rem",
        align: "center",
        render(segmentuud) {
          if (segmentuud?.length > 0) {
            return (
              <Popover
                trigger="hover"
                content={
                  <div>
                    <CardList
                      keyValue="segment"
                      className="max-h-[70vh] overflow-y-scroll rounded-md bg-[#F3F4F6] px-3 py-2"
                      jagsaalt={segmentuud}
                      Component={GereeSegmentTile}
                      componentProps={{ token }}
                    />
                  </div>
                }
              >
                <a className=" flex items-center justify-center  hover:scale-150 ">
                  <ImFileText2 className="text-xl" />
                </a>
              </Popover>
            );
          } else
            return (
              <div className=" flex items-center justify-center text-gray-500">
                <ImFileEmpty className="text-xl text-gray-500" />
              </div>
            );
        },
      },
      {
        title: t("Өдөр"),
        dataIndex: "duusakhOgnoo",
        align: "center",
        ellipsis: true,
        width: "6rem",
        render: (t) => {
          return moment(t).diff(moment(new Date()), "days");
        },
        sortOrder: sortOrderShalgakh(order.duusakhOgnoo),
        showSorterTooltip: false,
        sorter: () => 0,
      },
    ];
    if (shuult.utga == "Цуцласан") {
      jagsaalt.push(
        {
          title: "Цуцалсан шалтгаан",
          dataIndex: "gereeniiTuukhuud",
          align: "center",
          ellipsis: true,
          width: "6rem",
          render: (gereeniiTuukhuud) => {
            return (
              <div>
                <Popover
                  trigger="hover"
                  content={
                    <div className="dark:text-gray-200">
                      {gereeniiTuukhuud.map((a, i) => (
                        <div key={i}>{a.tsutslasanShaltgaan}</div>
                      ))}
                    </div>
                  }
                >
                  <a className=" flex items-center justify-center hover:scale-150 dark:invert ">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1979/1979288.png"
                      data-src="https://cdn-icons-png.flaticon.com/128/1979/1979288.png"
                      alt="Cancel"
                      width={23}
                    ></img>
                  </a>
                </Popover>
              </div>
            );
          },
          showSorterTooltip: false,
          sortOrder: sortOrderShalgakh(order.gereeniiTuukhuud),
          sorter: () => 0,
        },
        // {
        //   title: "Цуцалсан ажилтан",
        //   dataIndex: "gereeniiTuukhuud",
        //   align: "center",
        //   ellipsis: true,
        //   width: "6rem",
        //   render: (gereeniiTuukhuud) => {
        //     const tsutslyo = gereeniiTuukhuud.filter(
        //       (a) => a.turul === "Tsutslakh"
        //     );

        //     const gotsTsuts = tsutslyo.filter(
        //       (a, index, self) =>
        //         index === self.findIndex((b) => b.ajiltniiNer === a.ajiltniiNer)
        //     );

        //     return (
        //       <div className="dark:text-gray-200">
        //         {gotsTsuts.map((a) => a.ajiltniiNer).join(", ")}
        //       </div>
        //     );
        //   },
        //   showSorterTooltip: false,
        //   sortOrder: sortOrderShalgakh(order.gereeniiTuukhuud),
        //   sorter: () => 0,
        // },
        {
          title: "Түүх",
          dataIndex: "gereeniiTuukhuud",
          align: "center",
          ellipsis: true,
          width: "10rem",
          render: (gereeniiTuukhuud) => {
            const tsutslyo = gereeniiTuukhuud
              .filter((a) => a.turul === "Tsutslakh")
              .sort(
                (a, b) => new Date(b.khiisenOgnoo) - new Date(a.khiisenOgnoo)
              );

            return (
              <div className="text-left dark:text-gray-200">
                {tsutslyo.map((a, i) => (
                  <div key={i}>
                    {moment(a.khiisenOgnoo).format("YYYY-MM-DD")} —{" "}
                    {a.ajiltniiNer}
                  </div>
                ))}
              </div>
            );
          },
          showSorterTooltip: false,
          sortOrder: sortOrderShalgakh(order.gereeniiTuukhuud),
          sorter: () => 0,
        }
      );
    }

    return [
      ...jagsaalt,
      ...shineBagana,
      {
        title: () => <SettingOutlined />,
        fixed: "right",
        className: "text-center",
        align: "center",
        ellipsis: true,
        width: "2.5rem",
        render: (data) => (
          <div className="flex flex-row justify-center">
            <Popover
              onVisibleChange={(visible) =>
                setGereeniiTokhirgoo(visible === true ? data?._id : null)
              }
              visible={data?._id === gereeniiTokhirgoo}
              content={() => (
                <div className="flex w-24 flex-col space-y-2">
                  <a
                    className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                    onClick={() => gereeKharya(data)}
                  >
                    <EyeOutlined style={{ fontSize: "18px" }} />{" "}
                    <label> {t("Харах")}</label>
                  </a>
                  <a
                    className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                    onClick={() => zuragOruulakh(data)}
                  >
                    <UploadOutlined style={{ fontSize: "18px" }} />{" "}
                    <label>{t("Зураг")}</label>
                  </a>
                  {shuult.utga !== "Цуцласан" && (
                    <a
                      className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        if (
                          ajiltan?.erkh === "Admin" ||
                          !!_.get(ajiltan, `tokhirgoo.gereeZasakhErkh`)?.find(
                            (a) => a === data.barilgiinId
                          )
                        )
                          router.push(
                            `/khyanalt/geree/gereeBaiguulakh/${data._id}`
                          );
                        else
                          notification.warning({
                            message: t("Таньд гэрээ засах эрх байхгүй байна."),
                          });
                      }}
                    >
                      <EditOutlined style={{ fontSize: "18px" }} />
                      <label> {t("Засах")}</label>
                    </a>
                  )}
                  {shuult.utga !== "Цуцласан" && (
                    <a
                      className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700"
                      onClick={() => gereeSungaya(data)}
                    >
                      <FieldTimeOutlined style={{ fontSize: "18px" }} />
                      <label> {t("Сунгах")}</label>
                    </a>
                  )}
                  {shuult.utga !== "Цуцласан" && (
                    <Popconfirm
                      title="Цуцлахдаа итгэлтэй байна уу?"
                      okText={t("Тийм")}
                      cancelText={t("Үгүй")}
                      onConfirm={() => gereeTsutsalya(data)}
                    >
                      <a className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700">
                        <MinusCircleOutlined style={{ fontSize: "18px" }} />
                        <label> {t("Цуцлах")}</label>
                      </a>
                    </Popconfirm>
                  )}
                  {shuult.utga === "Цуцласан" && (
                    <>
                      <Popconfirm
                        title="Сэргээх үйлдэл хийхдээ итгэлтэй байна уу?"
                        okText={t("Тийм")}
                        cancelText={t("Үгүй")}
                        onConfirm={() => gereeSergeeye(data)}
                      >
                        <a className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700">
                          <RedoOutlined style={{ fontSize: "18px" }} />
                          <label> {t("Сэргээх")}</label>
                        </a>
                      </Popconfirm>
                      <a className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700">
                        <FileOutlined style={{ fontSize: "18px" }} />
                        <label> {t("Акт")}</label>
                      </a>
                    </>
                  )}
                </div>
              )}
              placement="bottom"
              trigger="click"
            >
              <a className="flex items-center justify-center rounded-full hover:bg-gray-200">
                <MoreOutlined style={{ fontSize: "18px" }} />
              </a>
            </Popover>
          </div>
        ),
      },
    ];
  }, [
    baiguullaga,
    token,
    gereeniiTokhirgoo,
    gereeniiMedeelel?.jagsaalt,
    shuult,
    shineBagana,
    order,
    t,
  ]);

  function refresh() {
    gereeniiMedeelelMutate();
    gereeToolloltMutate();
  }

  function gereeTsutsalya(data) {
    if (
      ajiltan?.erkh !== "Admin" &&
      !_.get(ajiltan, `tokhirgoo.gereeTsutslakhErkh`)?.find(
        (a) => a === data.barilgiinId
      )
    ) {
      notification.warning({
        message: t("Таньд гэрээ цуцлах эрх байхгүй байна."),
      });
      return;
    }
    setGereeniiTokhirgoo(null);
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        {t("Цуцлах")}
      </Button>,
    ];
    modal({
      title: t("Цуцалсан шалтгаан"),
      icon: <MinusCircleOutlined />,
      content: (
        <Tailbar
          service="/gereeTsutslaya"
          ref={tailbarRef}
          data={data}
          token={token}
          baiguullaga={baiguullaga}
          confirm={() => refresh()}
        />
      ),
      footer,
    });
  }

  function gereeSergeeye(data) {
    if (
      ajiltan?.erkh !== "Admin" &&
      !_.get(ajiltan, `tokhirgoo.gereeSergeekhErkh`)?.find(
        (a) => a === data.barilgiinId
      )
    ) {
      notification.warning({
        message: t("Таньд гэрээ сэргээх эрх байхгүй байна."),
      });
      return;
    }
    setGereeniiTokhirgoo(null);
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        {t("Сэргээх")}
      </Button>,
    ];
    modal({
      width: "20vw",
      title: t("Сэргээх шалтгаан"),
      icon: <MinusCircleOutlined />,
      content: (
        <Tailbar
          service="/gereeSergeeye"
          ref={tailbarRef}
          data={data}
          token={token}
          confirm={() => refresh()}
        />
      ),
      footer,
    });
  }

  function gereeSungaya(data) {
    if (
      ajiltan?.erkh !== "Admin" &&
      !_.get(ajiltan, `tokhirgoo.gereeSungakhErkh`)?.find(
        (a) => a === data.barilgiinId
      )
    ) {
      notification.warning({
        message: t("Таньд гэрээ сунгах эрх байхгүй байна."),
      });
      return;
    }
    setGereeniiTokhirgoo(null);
    const footer = [
      <Button onClick={() => sungaltRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => sungaltRef.current.khadgalya()}>
        {t("Сунгах")}
      </Button>,
    ];
    modal({
      width: global.innerWidth < 768 ? "90vw" : "20vw",
      title: t("Гэрээ сунгах"),
      icon: <MinusCircleOutlined />,
      content: (
        <Sungakh
          ref={sungaltRef}
          data={data}
          token={token}
          baiguullaga={baiguullaga}
          confirm={() => refresh()}
        />
      ),
      footer,
    });
  }

  function gereeKharya(geree) {
    const barilga = baiguullaga.barilguud.find(
      (a) => a._id === geree.barilgiinId
    );
    readMethod("gereeniiZagvar", token, geree.gereeniiZagvariinId).then(
      ({ data }) => {
        if (!!data) {
          if (geree.gereeniiOgnoo) {
            geree.ekhlekhOn = moment(geree.gereeniiOgnoo).format("YYYY");
            geree.ekhelkhSar = moment(geree.gereeniiOgnoo).format("MM");
            geree.ekhlekhUdur = moment(geree.gereeniiOgnoo).format("DD");
            if (geree.khugatsaa > 0) {
              let duusakhOgnoo = moment(geree.duusakhOgnoo);
              geree.duusakhOn = duusakhOgnoo.format("YYYY");
              geree.duusakhSar = duusakhOgnoo.format("MM");
              geree.duusakhUdur = duusakhOgnoo.format("DD");
            }
          }

          geree.talbainNegjUneUsgeer = toWords(geree.talbainNegjUne);
          geree.talbainNiitUneUsgeer = toWords(geree.talbainNiitUne);
          geree.gariinUseg = renderToString(
            <span style={{ position: "absolute" }}>
              <img
                src={`${url}/file?path=gariinUseg/${barilga.gariinUseg}`}
                style={{
                  width: 100,
                  height: 50,
                  transform: "translate(-50%, -30%)",
                }}
              />
            </span>
          );
          geree.tamga = renderToString(
            <span style={{ position: "absolute", zIndex: 1 }}>
              <img
                src={`${url}/file?path=tamga/${barilga.tamga}`}
                style={{
                  width: 115,
                  height: 100,
                  transform: "translate(-10%, -50%)",
                  opacity: 0.65,
                }}
              />
            </span>
          );
          if (geree.gereeniiOgnoo) {
            geree.gereeniiOgnoo = moment(geree.gereeniiOgnoo).format(
              "YYYY/MM/DD"
            );
          }
          for (const [key, value] of Object.entries(geree)) {
            if (key === "zardluud") {
              value.map((mur) => {
                data.dedKhesguud
                  .filter(
                    (a) =>
                      !!a.zaalt && a.zaalt?.indexOf(`${mur.ner}.tariff`) !== -1
                  )
                  .map((b) => {
                    return (b.zaalt = b.zaalt.replace(
                      new RegExp(`&lt;${mur.ner}.tariff&gt;`, "g"),
                      formatNumber(mur.tariff || mur.dun)
                    ));
                  });
              });

              value.map((mur) => {
                data?.dedKhesguud
                  ?.filter(
                    (a) =>
                      !!a.zaalt &&
                      a.zaalt?.indexOf(`${mur.ner}.tulukhDun`) !== -1
                  )
                  .map((b) => {
                    b.zaalt = b.zaalt.replace(
                      new RegExp(`&lt;${mur.ner}.tulukhDun&gt;`, "g"),
                      formatNumber(mur.tulukhDun)
                    );
                  });
              });
            } else {
              data.dedKhesguud
                .filter((a) => !!a.zaalt && a.zaalt?.indexOf(key) !== -1)
                .map((b) => {
                  return (b.zaalt = b.zaalt.replace(
                    new RegExp(`&lt;${key}&gt;`, "g"),
                    key === "utas"
                      ? value[0]
                      : key === "talbainNegjUne" ||
                        key === "talbainNiitUne" ||
                        key === "baritsaaAvakhDun"
                      ? formatNumber(value)
                      : value
                  ));
                });
            }
            data.baruunTolgoi = data.baruunTolgoi?.replace(
              new RegExp(`&lt;${key}&gt;`, "g"),
              value
            );
            data.zuunTolgoi = data.zuunTolgoi?.replace(
              new RegExp(`&lt;${key}&gt;`, "g"),
              value
            );
            data.zuunKhul = data.zuunKhul?.replace(
              new RegExp(`&lt;${key}&gt;`, "g"),
              value
            );
            data.baruunKhul = data.baruunKhul?.replace(
              new RegExp(`&lt;${key}&gt;`, "g"),
              value
            );
          }
          data.geree = geree;
          setKharuulakhGeree(data);
          setGereeniiTokhirgoo(null);
        }
      }
    );
  }
  function zuragOruulakh(data) {
    const footer = [
      <Space key="footer" size={4}>
        <Button onClick={() => zuragref.current?.khaaya()}>{t("Хаах")}</Button>
        <Button type="primary" onClick={() => zuragref.current?.khadgalya()}>
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];

    modal({
      title: t("Зураг оруулах"),
      icon: <UploadOutlined />,
      width: "60vw",
      content: (
        <GereeZuragOruulakh
          ref={zuragref}
          token={token}
          gereeniiId={data?._id}
          onFinish={refresh}
          garchig={t("Зураг файл аа чирч оруулах эсвэл сонгоно уу")}
          tailbar={t("Зөвхөн JPG, PNG, GIF файл дэмжигдэнэ")}
          destroy={() => {
            Modal.destroyAll();
          }}
        />
      ),
      footer,
    });
  }
  function gereeOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GereeExceleesOruulakh
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          baiguullaga={baiguullaga}
          onFinish={refresh}
          zam="gereeniiExcelTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Харилцагч загварын excel файл"
          zagvariinZam="gereeniiExcelAvya"
        />
      ),
      footer,
    });
  }

  function excelTatakh() {
    _.set(shuult.query, "barilgiinId", barilgiinId);
    excelTatajAvya(
      token,
      "/geree",
      gereeniiMedeelel.niitMur,
      sheet,
      shuult.query,
      order,
      "гэрээний жагсаалт"
    );
  }

  return (
    <Admin
      khuudasniiNer="gereeBurtgel"
      title="Гэрээний жагсаалт"
      className="p-0 md:p-5  "
      setNeesenEsekh={setNeesenEsekh}
      tsonkhniiId="61c2c5dc1c2830c4e6f90c6d"
      onSearch={(search) =>
        setGereeniiKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      loading={isValidating}
    >
      <Drawer
        title={kharuulakhGeree?.gereeniiDugaar}
        width={"230mm"}
        onClose={() => setKharuulakhGeree(null)}
        visible={!!kharuulakhGeree}
        footer={
          <div>
            <Button
              style={{ backgroundColor: "#209669", color: "#ffffff" }}
              onClick={handlePrint}
            >
              {t("Хэвлэх")}
            </Button>
          </div>
        }
      >
        {!!kharuulakhGeree && (
          <GereeKharakh
            ref={componentRef}
            barilgiinId={barilgiinId}
            token={token}
            baiguullaga={baiguullaga}
            print={handlePrint}
            data={kharuulakhGeree}
          />
        )}
      </Drawer>
      <Card className="cardgrid col-span-12 ">
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:p-0 md:gap-6 2xl:grid-cols-12">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className={`border-2 ${
                  mur?.utga === shuult?.utga ? mur.border : "border-green-500"
                }  cursor-pointer rounded-xl sm:col-span-12 lg:col-span-2 ${
                  mur?.utga === shuult?.utga ? mur.selectedColor : ""
                }`}
                onClick={() => setShuult(mur)}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
              >
                <div className="h-full w-[67vw] rounded-xl sm:w-auto">
                  <div className="rounded-xl p-3">
                    <div className="flex">
                      <div>
                        <div
                          className={`text-3xl ${
                            mur?.utga === shuult?.utga
                              ? mur.color
                              : "text-green-500"
                          } font-bold`}
                        >
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {t(mur.utga)}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div
                          className={`${
                            mur?.utga === shuult?.utga
                              ? mur.color
                              : "text-green-500"
                          } text-2xl`}
                        >
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
        <div className="mt-5 flex flex-col-reverse gap-5 sm:flex-row">
          <div
            data-aos="zoom-in-right"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <DatePicker.RangePicker
              className="w-full sm:w-auto"
              locale={i18n.language === "mn" && locale}
              value={gereeOgnoo}
              onChange={(e) => setGereeOgnoo(e)}
            />
          </div>
          <div
            className="ml-auto flex place-content-end gap-3"
            data-aos="zoom-in-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <BaganiinSongolt
              shineBagana={shineBagana}
              setShineBagana={setShineBagana}
              columns={[
                {
                  title: t("Талбай /м2/"),
                  dataIndex: "talbainKhemjee",
                  align: "center",
                  ellipsis: true,
                  width: "7rem",
                  render: (talbainKhemjee) => {
                    return `${talbainKhemjee} м2`;
                  },
                  showSorterTooltip: false,
                  sorter: () => 0,
                },
                {
                  title: t("Бүртгэсэн"),
                  dataIndex: "createdAt",
                  ellipsis: true,
                  width: "8rem",
                  align: "center",
                  render(date) {
                    return moment(date).format("YYYY-MM-DD HH:mm");
                  },
                  showSorterTooltip: false,
                  sorter: () => 0,
                },
                {
                  title: t("Хугацаа"),
                  dataIndex: "khugatsaa",
                  align: "center",
                  ellipsis: true,
                  width: "6rem",
                },
                {
                  title: t("Давхар"),
                  dataIndex: "davkhar",
                  align: "center",
                  ellipsis: true,
                  width: "5rem",
                },
                {
                  title: t("Авлага үүсэх өдөр"),
                  dataIndex: "tulukhUdur",
                  align: "center",
                  ellipsis: true,
                  width: "10rem",
                },
                {
                  title: t("Утас"),
                  dataIndex: "utas",
                  align: "center",
                  ellipsis: true,
                  width: "6rem",
                },
                {
                  title: t("Төрөл"),
                  dataIndex: "turul",
                  align: "center",
                  ellipsis: true,
                  width: "6rem",
                },
                {
                  title: t("Алданги"),
                  dataIndex: "aldangiinUldegdel",
                  className: "text-center",
                  align: "center",
                  ellipsis: true,
                  width: "7rem",
                  render: (aldangiinUldegdel) => {
                    return (
                      <div className="w-full text-right">
                        {formatNumber(aldangiinUldegdel || 0)}
                      </div>
                    );
                  },
                },
              ]}
            />
            <Popover
              content={() => (
                <div className="flex w-32 flex-col">
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                    onClick={gereeOruulakhExcel}
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
              style={{ padding: 0 }}
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
        <div className="mt-6 flex gap-5 font-medium">
          <div className="flex items-center gap-1">
            {t("Үндсэн гэрээ")} :{" "}
            <div className="h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400" />
            (
            {gereeToollolt !== undefined
              ? gereeToollolt?.reduce((a, b) => b.undsenGeree, 0)
              : 0}
            )
          </div>
          <div className="flex items-center gap-1">
            {t("Түр гэрээ")} :{" "}
            <div className="h-3 w-3 rounded-full bg-purple-600 dark:bg-purple-400" />
            (
            {gereeToollolt !== undefined
              ? gereeToollolt?.reduce((a, b) => b.turGeree, 0)
              : 0}
            )
          </div>
        </div>
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="300"
          data-aos-anchor-placement="top-bottom"
          className="mt-2 hidden  md:block "
        >
          <Table
            bordered
            scroll={{ y: "calc(100vh - 29rem)", x: "calc(100vw - 25rem)" }}
            size="small"
            loading={!gereeniiMedeelel}
            rowKey={(row) => row._id}
            onChange={(a, b, c) => {
              !JSON.stringify(c).includes("udur") && onChangeTable(a, b, c);
            }}
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
        <CardList
          keyValue="geree"
          className="block md:hidden"
          jagsaalt={gereeniiMedeelel?.jagsaalt}
          Component={GereeTile}
          neesenEsekh={neesenEsekh}
          componentProps={{ router }}
          cardListTuluv={"utas"}
          tileProps={{
            gereeniiTokhirgoo,
            shuult,
            gereeSungaya,
            gereeTsutsalya,
            gereeKharya,
            ajiltan,
            gereeSergeeye,
          }}
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
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default ZakhialgiinKhyanalt;
