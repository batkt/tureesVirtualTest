import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Tabs,
} from "antd";
import useJagsaalt from "hooks/useJagsaalt";
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useReactToPrint } from "react-to-print";
import _ from "lodash";
import useGereeAldangiGuilgee from "hooks/useGereeniiAldangiJagsaalt";
import { useTranslation } from "react-i18next";
import locale from "antd/lib/date-picker/locale/mn_MN";
import axios, { aldaaBarigch } from "services/uilchilgee";
import { DeleteOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import * as XLSX from "xlsx-js-style";

const Tailbar = React.forwardRef(({ destroy, confirm }, ref) => {
  const [tailbar, setTailbar] = useState("");
  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(tailbar);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [tailbar]
  );
  return (
    <div>
      <Input.TextArea
        value={tailbar}
        onChange={({ target }) => setTailbar(target?.value)}
      />
    </div>
  );
});

function GuilgeeniiTuukhAldangi(
  { token, data, refreshData, ognoo, ajiltan, barilgiinId },
  ref
) {
  const { t, i18n } = useTranslation();
  const [aldangiDun, setAldangiDun] = useState("");
  const [zasahTailbar, setZasahTailbar] = useState("");
  const [shineOgnoo, setShineOgnoo] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [aldangiinUldegdel, setAldangiinUldegdel] = useState(undefined);

  const query = useMemo(() => {
    return {
      gereeniiId: data?._id,
    };
  }, [data?._id]);

  const aldangiinTuukh = useJagsaalt(
    "/aldangiinTuukh",
    query,
    undefined,
    undefined,
    undefined,
    token
  );
  const { guilgeeniiAldangiTuukh, guilgeeniiAldangiTuukhMutate } =
    useGereeAldangiGuilgee(token, data?._id, ognoo, shineOgnoo);

  const [sortOrders, setSortOrders] = useState({
    ognoo: null,
    tulukhAldangi: null,
    tulsunAldangi: null,
    dansniiDugaar: null,
    tulsunDans: null,
    ajiltan: null,
    tailbar: null,
    burtgesenOgnoo: null,
    aldangiBodsonOgnoo: null,
    uldegdel: null,
    aldangi: null,
    aldangiinKhuvi: null,
    aldangiChuluulukhKhonog: null,
    ognoo: null,
    aldangiChuluulukhOgnoo: null,
    niitAldangi: null,
    umnukhAldangi: null,
  });
  const [sortColumn, setSortColumn] = useState(null);
  const tailbarRef = React.useRef(null);
  const printRef = React.useRef(null);
  const fetchAldangiinUldegdel = () => {
    axios(token)
      .get("/geree", {
        params: {
          query: { _id: data?._id, tuluv: { $ne: -1 } },
          select: { aldangiinUldegdel: 1 },
        },
      })
      .then(({ data }) => {
        if (data?.jagsaalt?.length > 0) {
          setAldangiinUldegdel(data.jagsaalt[0].aldangiinUldegdel);
        }
      })
      .catch(aldaaBarigch);
  };

  const canEditAldangi = useMemo(() => {
    if (ajiltan?.erkh === "Admin") return true;

    const permissionArray = _.get(
      ajiltan,
      `tokhirgoo.aldangiinUldegdelZasakhEsekh`
    );

    if (!permissionArray || !Array.isArray(permissionArray)) {
      return false;
    }

    return permissionArray.includes(barilgiinId);
  }, [ajiltan, barilgiinId]);

  const hadgalakhHandler = () => {
    if (isSubmitting) return;

    if (aldangiDun === "" || aldangiDun === null || aldangiDun === undefined) {
      message.error(t("Алданги дүнг оруулна уу"));
      return;
    }
    const newValue = Number(aldangiDun);
    if (newValue === aldangiinUldegdel) {
      message.warning(t("Алданги өөрчлөгдөөгүй байна"));
      return;
    }

    setIsSubmitting(true);
    axios(token)
      .post("/gereeniiAldangiZasya", {
        khuuchinAldangiDun: data?.aldangiinUldegdel,
        aldangiDun: Number(aldangiDun),
        tailbar: zasahTailbar,
        gereeniiId: data?._id,
        barilgiinId: data?.barilgiinId,
        gereeniiDugaar: data?.gereeniiDugaar,
      })
      .then(() => {
        message.success(t("Амжилттай хадгалагдлаа"));
        closeModal();
        setAldangiDun("");
        setZasahTailbar("");
        guilgeeniiAldangiTuukhMutate();
        fetchAldangiinUldegdel();

        refreshData();
      })
      .catch(aldaaBarigch);
  };

  const toggleSortOrder = (column) => {
    const newSortOrders = { ...sortOrders };
    newSortOrders[column] = sortOrders[column] === "asc" ? "desc" : "asc";
    setSortOrders(newSortOrders);
    setSortColumn(column);
  };

  const sortedData = React.useMemo(() => {
    if (!guilgeeniiAldangiTuukh) {
      return [];
    }
    const khuulsanData = [...guilgeeniiAldangiTuukh];
    khuulsanData.sort((a, b) => {
      const sortDaraalal = sortOrders[sortColumn];
      if (sortDaraalal === "asc") {
        if (sortColumn === "ognoo") {
          return new Date(a[sortColumn]) - new Date(b[sortColumn]);
        }
        return a[sortColumn] - b[sortColumn];
      } else if (sortDaraalal === "desc") {
        if (sortColumn === "ognoo") {
          return new Date(b[sortColumn]) - new Date(a[sortColumn]);
        }
        return b[sortColumn] - a[sortColumn];
      }
      return 0;
    });

    return khuulsanData;
  }, [guilgeeniiAldangiTuukh, sortOrders, sortColumn, shineOgnoo]);

  useImperativeHandle(
    ref,
    () => ({
      khevlekh() {
        handlePrint();
      },
      excelTatakh() {
        exceleerTatya();
      },
      refreshData() {
        guilgeeniiAldangiTuukhMutate();
        setAldangiinUldegdel(undefined);
      },
    }),
    [handlePrint, guilgeeniiAldangiTuukh, aldangiinTuukh]
  );

  const exceleerTatya = async () => {
    try {
      const wb = XLSX?.utils.book_new();

      const headerStyle = {
        fill: {
          patternType: "solid",
          fgColor: { rgb: "88C849" },
        },
        border: {
          top: { style: "thin", color: { auto: 1 } },
          bottom: { style: "thin", color: { auto: 1 } },
          left: { style: "thin", color: { auto: 1 } },
          right: { style: "thin", color: { auto: 1 } },
        },
        alignment: {
          horizontal: "left",
          vertical: "center",
        },
      };

      const cellStyle = {
        border: {
          top: { style: "thin", color: { auto: 1 } },
          bottom: { style: "thin", color: { auto: 1 } },
          left: { style: "thin", color: { auto: 1 } },
          right: { style: "thin", color: { auto: 1 } },
        },
        alignment: {
          horizontal: "left",
          vertical: "center",
        },
      };

      // Sheet 1: Төлсөн алданги (Tulsun Aldangi)
      const tulsunData =
        sortedData?.map((item) => {
          return {
            Огноо: moment(item.ognoo).format("YYYY/MM/DD"),
            Ажилтан: item.guilgeeKhiisenAjiltniiNer || "",
            "Төлөх алданги": item.tulukhAldangi || 0,
            "Төлсөн алданги": item.tulsunAldangi || item.tulsunDun || 0,
            Данс: item.dansniiDugaar || "",
            "Төлсөн данс": item.tulsunDans || "",
            Тайлбар: item.tailbar || "",
            "Бүртгэсэн огноо": item.guilgeeKhiisenOgnoo
              ? moment(item.guilgeeKhiisenOgnoo).format("YYYY/MM/DD HH:mm:ss")
              : "",
          };
        }) || [];

      const tulsunWs = XLSX?.utils.json_to_sheet(tulsunData);
      if (tulsunWs) {
        if (tulsunWs["!ref"]) {
          const range1 = XLSX.utils.decode_range(tulsunWs["!ref"]);
          for (let R = range1.s.r; R <= range1.e.r; ++R) {
            for (let C = range1.s.c; C <= range1.e.c; ++C) {
              const cellAddress = { r: R, c: C };
              const cellRef = XLSX.utils.encode_cell(cellAddress);
              const cell = tulsunWs[cellRef];
              if (cell) {
                if (!cell.s) {
                  cell.s = {};
                }
                if (R === 0) {
                  cell.s = { ...cell.s, ...headerStyle };
                } else {
                  // Data rows
                  let currentCellStyle = { ...cell.s, ...cellStyle };
                  // Apply #,##0.00 format to numeric columns (Төлөх алданги=2, Төлсөн алданги=3)
                  if ([2, 3].includes(C)) {
                    currentCellStyle.numFmt = "#,##0.00";
                  }
                  cell.s = currentCellStyle;
                }
              }
            }
          }
        }

        const tulsunCols = [
          { wch: 15 }, // Огноо
          { wch: 20 }, // Ажилтан
          { wch: 15 }, // Төлөх алданги
          { wch: 15 }, // Төлсөн алданги
          { wch: 12 }, // Данс
          { wch: 12 }, // Төлсөн данс
          { wch: 25 }, // Тайлбар
          { wch: 20 }, // Бүртгэсэн огноо
        ];
        tulsunWs["!cols"] = tulsunCols;

        XLSX?.utils.book_append_sheet(wb, tulsunWs, "Төлсөн алданги");
        console.log("Added Төлсөн алданги sheet");
      }

      // Sheet 2: Бодогдсон алданги (Bodogdson Aldangi)
      const bodogdsonData =
        aldangiinTuukh.jagsaalt?.map((item) => {
          return {
            "Алдангийн өдөр": moment(item.aldangiBodsonOgnoo).format(
              "YYYY/MM/DD"
            ),
            "Авлага үүсч байгаа огноо": moment(item.ognoo).format("YYYY/MM/DD"),
            "Чөлөөлөх хоног": item.aldangiChuluulukhKhonog || 0,
            "Чөлөөлөх огноо": moment(item.aldangiChuluulukhOgnoo).format(
              "YYYY/MM/DD"
            ),
            Хувь: item.aldangiinKhuvi || 0,
            Үлдэгдэл: item.uldegdel || 0,
            Алданги: item.aldangi || 0,
            "Өмнөх алданги": item.umnukhAldangi || 0,
            "Нийт алданги": item.niitAldangi || 0,
          };
        }) || [];

      const bodogdsonWs = XLSX?.utils.json_to_sheet(bodogdsonData);
      if (bodogdsonWs) {
        if (bodogdsonWs["!ref"]) {
          const range2 = XLSX.utils.decode_range(bodogdsonWs["!ref"]);
          for (let R = range2.s.r; R <= range2.e.r; ++R) {
            for (let C = range2.s.c; C <= range2.e.c; ++C) {
              const cellAddress = { r: R, c: C };
              const cellRef = XLSX.utils.encode_cell(cellAddress);
              const cell = bodogdsonWs[cellRef];
              if (cell) {
                if (!cell.s) {
                  cell.s = {};
                }
                if (R === 0) {
                  cell.s = { ...cell.s, ...headerStyle };
                } else {
                  // Data rows
                  let currentCellStyle = { ...cell.s, ...cellStyle };
                  // Apply #,##0.00 format to numeric columns (Чөлөөлөх хоног=2, Хувь=4, Үлдэгдэл=5, Алданги=6, Өмнөх алданги=7, Нийт алданги=8)
                  if ([2, 4, 5, 6, 7, 8].includes(C)) {
                    currentCellStyle.numFmt = "#,##0.00";
                  }
                  cell.s = currentCellStyle;
                }
              }
            }
          }
        }

        const bodogdsonCols = [
          { wch: 20 }, // Алдангийн өдөр
          { wch: 30 }, // Авлага үүсч байгаа огноо
          { wch: 20 }, // Чөлөөлөх хоног
          { wch: 20 }, // Чөлөөлөх огноо
          { wch: 20 }, // Хувь
          { wch: 20 }, // Үлдэгдэл
          { wch: 20 }, // Алданги
          { wch: 20 }, // Өмнөх алданги
          { wch: 20 }, // Нийт алданги
        ];
        bodogdsonWs["!cols"] = bodogdsonCols;

        XLSX?.utils.book_append_sheet(wb, bodogdsonWs, "Бодогдсон алданги");
      }

      XLSX?.writeFile(
        wb,
        `${data?.gereeniiDugaar || "Гэрээ"}_алдангийн_хуулга.xlsx`,
        {
          WTF: true,
          cellStyles: true,
        }
      );
    } catch (e) {
      aldaaBarigch(e.message);
    }
  };

  useEffect(() => {
    fetchAldangiinUldegdel();
  }, []);

  function tulultUstgaya({
    guilgeeniiId,
    tulsunDun,
    tulukhDun,
    _id,
    turul,
    khyamdral,
  }) {
    if (turul === "baritsaa")
      axios(token)
        .post("/baritsaaniiGuilgeeUstgaya", {
          gereeniiId: data?._id,
          objectiinId: _id,
          zarlaga: tulsunDun || 0,
          orlogo: tulukhDun || 0,
          barilgiinId: data?.barilgiinId,
        })
        .then(({ data }) => {
          if (data) {
            message.success(t("Төлөлт амжилттай устгагдлаа!"));
            refreshData();
            guilgeeniiAldangiTuukhMutate();
          }
        })
        .catch(aldaaBarigch);
    else {
      const footer = [
        <Button onClick={() => tailbarRef.current.khaaya()}>
          {t("Хаах")}
        </Button>,
        <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
          Устгах
        </Button>,
      ];
      modal({
        title: "Төлөлт устгах шалтгаан",
        icon: <DeleteOutlined />,
        content: (
          <Tailbar
            ref={tailbarRef}
            confirm={(tailbar) =>
              axios(token)
                .post("/tulultUstgaya", {
                  turul,
                  guilgeeniiId,
                  gereeniiId: data?._id,
                  tulsunDun,
                  tulukhDun,
                  khyamdral,
                  objectiinId: _id,
                  tailbar,
                  talbainDugaar: data?.talbainDugaar,
                  barilgiinId: data?.barilgiinId,
                })
                .then(({ data }) => {
                  if (data) {
                    message.success(t("Төлөлт амжилттай устгагдлаа!"));
                    refreshData();
                    guilgeeniiAldangiTuukhMutate();
                    setAldangiinUldegdel(undefined);
                  }
                })
                .catch(aldaaBarigch)
            }
          />
        ),
        footer,
      });
    }
  }

  const TableContent = () => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[50rem]">
        <thead className="w-full">
          <tr className="flex min-w-[50rem] divide-x divide-white border-b border-gray-200 bg-gray-200 pr-1 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <td
              onClick={() => toggleSortOrder("ognoo")}
              className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
            >
              {t("Огноо")}
            </td>
            <td
              onClick={() => toggleSortOrder("ajiltan")}
              className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
            >
              {t("Ажилтан")}
            </td>
            <td
              onClick={() => toggleSortOrder("tulukhAldangi")}
              className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
            >
              {t("Төлөх алданги")}
            </td>
            <td
              onClick={() => toggleSortOrder("tulsunAldangi")}
              className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
            >
              {t("Төлсөн алданги")}
            </td>
            <td
              onClick={() => toggleSortOrder("dansniiDugaar")}
              className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
            >
              {t("Данс")}
            </td>
            <td
              onClick={() => toggleSortOrder("tulsunDans")}
              className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
            >
              {t("Төлсөн данс")}
            </td>
            <td
              onClick={() => toggleSortOrder("tailbar")}
              className="w-full min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
            >
              {t("Тайлбар")}
            </td>
            <td
              onClick={() => toggleSortOrder("burtgesenOgnoo")}
              className="min-w-[16rem] cursor-pointer p-1 text-center"
            >
              {t("Бүртгэсэн огноо")}
            </td>
          </tr>
        </thead>
        <tbody
          className="min-w-[50rem] overflow-y-scroll"
          style={{ height: "calc(90vh - 15rem)" }}
        >
          {sortedData
            ?.map((a, i) => (
              <tr
                key={i}
                className="flex min-w-[50rem] divide-x border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400"
              >
                <td className="min-w-[8rem] overflow-hidden p-1 text-center">
                  {moment(a.ognoo).format("YYYY-MM-DD")}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1">
                  {a.guilgeeKhiisenAjiltniiNer}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1 text-end">
                  {formatNumber(a.tulukhAldangi, 0)}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1 text-end">
                  {formatNumber(a.tulsunAldangi || a.tulsunDun, 0)}
                </td>
                <td className="flex min-w-[8rem] justify-center p-1 text-center ">
                  {a.dansniiDugaar}
                </td>
                <td className="flex min-w-[8rem] justify-center p-1 text-center ">
                  {a.tulsunDans}
                </td>
                <td className="flex w-full min-w-[8rem] justify-between overflow-hidden p-1">
                  {a.tailbar}
                </td>
                <td className="flex w-full justify-center p-1 text-center ">
                  {a.guilgeeKhiisenOgnoo &&
                    moment(a.guilgeeKhiisenOgnoo).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td className="flex min-w-[3rem] justify-center border-none">
                  {(ajiltan?.erkh === "Admin" ||
                    !!_.get(ajiltan, `tokhirgoo.guilgeeUstgakhErkh`)?.find(
                      (a) => a === barilgiinId
                    )) &&
                    (a.turul === "avlaga" ||
                      a.turul === "voucher" ||
                      a.turul === "barter" ||
                      a.turul === "bank" ||
                      a.turul === "khyamdral" ||
                      a.turul === "aldangi" ||
                      a.turul === "zalruulga" ||
                      a.turul === "baritsaa" ||
                      a.turul === "qpay" ||
                      a.turul === "tulultBurtgekh") && (
                      <Popconfirm
                        title={t("Төлөлт устгах уу?")}
                        okText={t("Тийм")}
                        cancelText={t("Үгүй")}
                        onConfirm={() => tulultUstgaya(a)}
                      >
                        <div className="hide-on-print flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border p-1 text-red-500">
                          <DeleteOutlined />
                        </div>
                      </Popconfirm>
                    )}
                </td>
              </tr>
            ))
            .reverse()}
        </tbody>
      </table>
    </div>
  );
  const TableContent2 = () => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[50rem]">
        <thead className="border-b border-gray-200 bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            <th
              onClick={() => toggleSortOrder("aldangiBodsonOgnoo")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Алдангийн өдөр")}
            </th>
            <th
              onClick={() => toggleSortOrder("ognoo")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Авлага үүсч байгаа огноо")}
            </th>
            <th
              onClick={() => toggleSortOrder("aldangiChuluulukhKhonog")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Чөлөөлөх хоног")}
            </th>
            <th
              onClick={() => toggleSortOrder("aldangiChuluulukhOgnoo")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Чөлөөлөх огноо")}
            </th>

            <th
              onClick={() => toggleSortOrder("aldangiinKhuvi")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Хувь")}
            </th>

            <th
              onClick={() => toggleSortOrder("uldegdel")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Үлдэгдэл")}
            </th>
            <th
              onClick={() => toggleSortOrder("aldangi")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Алданги")}
            </th>

            <th
              onClick={() => toggleSortOrder("umnukhAldangi")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Өмнөх алданги")}
            </th>
            <th
              onClick={() => toggleSortOrder("niitAldangi")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Нийт алданги")}
            </th>
          </tr>
        </thead>
        <tbody
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 15rem)" }}
        >
          {aldangiinTuukh.jagsaalt?.map((a, i) => (
            <tr
              key={i}
              className="border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400"
            >
              <td className="min-w-[8rem] p-1 text-center">
                {moment(a.aldangiBodsonOgnoo).format("YYYY-MM-DD")}
              </td>
              <td className="min-w-[8rem] p-1 text-center">
                {moment(a.ognoo).format("YYYY-MM-DD")}
              </td>
              <td className="min-w-[8rem] p-1 text-center">
                {a.aldangiChuluulukhKhonog}
              </td>
              <td className="min-w-[8rem] p-1 text-center">
                {moment(a.aldangiChuluulukhOgnoo).format("YYYY-MM-DD")}
              </td>

              <td className="min-w-[8rem] p-1 text-center">
                {formatNumber(a.aldangiinKhuvi, 4)}
              </td>

              <td className="min-w-[8rem] p-1 text-center">
                {formatNumber(a.uldegdel, 2)}
              </td>
              <td className="min-w-[8rem] p-1 text-center">
                {formatNumber(a.aldangi, 2)}
              </td>

              <td className="min-w-[8rem] p-1 text-center">
                {formatNumber(a.umnukhAldangi, 2)}
              </td>
              <td className="min-w-[8rem] p-1 text-center">
                {formatNumber(a.niitAldangi, 2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const pageStyle = `
    @page {
      size: A4;
      margin: 15mm;
    }
    
    @media print {
      body, html {
        margin: 0;
        padding: 0;
      }
      .print-content {
        width: 100%;
        font-size: 11px;
        line-height: 1.3;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
        margin-bottom: 15px;
      }
      .print-table th,
      .print-table td {
        border: 1px solid #000;
        padding: 3px;
        text-align: center;
        font-size: 9px;
      }
      .print-table th {
        background-color: #f0f0f0;
        font-weight: bold;
      }
      .print-header {
        margin-bottom: 10px;
        font-size: 13px;
        font-weight: bold;
      }
      .mb-8 {
        margin-bottom: 20px;
      }
    }
  `;

  const handlePrint = useReactToPrint({
    pageStyle: () => pageStyle,
    content: () => printRef.current,
  });

  return (
    <div className="">
      <div className="hidden">
        <div className="print-content" ref={printRef}>
          <div className="print-header">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="text-lg font-bold">
                  {t("Гүйлгээний алдангийн түүх")}
                </div>
                <div className="mt-2 text-sm">
                  <div>
                    {t("Гэрээний дугаар")}: {data?.gereeniiDugaar}
                  </div>
                  <div>
                    {t("Талбайн дугаар")}: {data?.talbainDugaar}
                  </div>
                  <div>
                    {t("Нэр")}: {data?.ner}
                  </div>
                  <div>
                    {t("Утас")}: {data?.utas.join(",")}
                  </div>
                  <div>
                    {t("Алдангийн үлдэгдэл")}:{" "}
                    {formatNumber(aldangiinUldegdel, 0)}
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <div>
                  {t("Хэвлэсэн огноо")}:{" "}
                  {moment().format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
            </div>
          </div>

          {/* Төлсөн алданги */}
          <div className="mb-8">
            <div className="mb-2 text-base font-bold">
              {t("Төлсөн алданги")}
            </div>
            <table className="print-table w-full">
              <thead>
                <tr>
                  <th className="w-[12%]">{t("Огноо")}</th>
                  <th className="w-[15%]">{t("Ажилтан")}</th>
                  <th className="w-[12%]">{t("Төлөх алданги")}</th>
                  <th className="w-[12%]">{t("Төлсөн алданги")}</th>
                  <th className="w-[10%]">{t("Данс")}</th>
                  <th className="w-[10%]">{t("Төлсөн данс")}</th>
                  <th className="w-[20%]">{t("Тайлбар")}</th>
                  <th className="w-[15%]">{t("Бүртгэсэн огноо")}</th>
                </tr>
              </thead>
              <tbody>
                {sortedData?.map((a, i) => (
                  <tr key={i}>
                    <td>{moment(a.ognoo).format("YYYY-MM-DD")}</td>
                    <td>{a.guilgeeKhiisenAjiltniiNer}</td>
                    <td className="text-right">
                      {formatNumber(a.tulukhAldangi, 0)}
                    </td>
                    <td className="text-right">
                      {formatNumber(a.tulsunAldangi || a.tulsunDun, 0)}
                    </td>
                    <td>{a.dansniiDugaar}</td>
                    <td>{a.tulsunDans}</td>
                    <td className="text-left">{a.tailbar}</td>
                    <td>
                      {a.guilgeeKhiisenOgnoo &&
                        moment(a.guilgeeKhiisenOgnoo).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Бодогдсон алданги */}
          <div>
            <div className="mb-2 text-base font-bold">
              {t("Бодогдсон алданги")}
            </div>
            <table className="print-table w-full">
              <thead>
                <tr>
                  <th className="w-[12%]">{t("Алдангийн өдөр")}</th>
                  <th className="w-[12%]">{t("Авлага үүсч байгаа огноо")}</th>
                  <th className="w-[10%]">{t("Чөлөөлөх хоног")}</th>
                  <th className="w-[12%]">{t("Чөлөөлөх огноо")}</th>
                  <th className="w-[10%]">{t("Хувь")}</th>
                  <th className="w-[12%]">{t("Үлдэгдэл")}</th>
                  <th className="w-[12%]">{t("Алданги")}</th>
                  <th className="w-[12%]">{t("Өмнөх алданги")}</th>
                  <th className="w-[12%]">{t("Нийт алданги")}</th>
                </tr>
              </thead>
              <tbody>
                {aldangiinTuukh.jagsaalt?.map((a, i) => (
                  <tr key={i}>
                    <td>{moment(a.aldangiBodsonOgnoo).format("YYYY-MM-DD")}</td>
                    <td>{moment(a.ognoo).format("YYYY-MM-DD")}</td>
                    <td>{a.aldangiChuluulukhKhonog}</td>
                    <td>
                      {moment(a.aldangiChuluulukhOgnoo).format("YYYY-MM-DD")}
                    </td>
                    <td>{formatNumber(a.aldangiinKhuvi, 4)}</td>
                    <td className="text-right">
                      {formatNumber(a.uldegdel, 2)}
                    </td>
                    <td className="text-right">{formatNumber(a.aldangi, 2)}</td>
                    <td className="text-right">
                      {formatNumber(a.umnukhAldangi, 2)}
                    </td>
                    <td className="text-right">
                      {formatNumber(a.niitAldangi, 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex w-full items-center justify-start gap-8 dark:text-white">
          <div className="">
            <DatePicker.RangePicker
              value={shineOgnoo}
              onChange={(v) => setShineOgnoo(v)}
              locale={i18n.language === "mn" && locale}
              allowClear
              picker="month"
              disabledDate={(e) => e && e > moment().endOf("day")}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="font-bold">{t("Гэрээний дугаар")}:</div>
              <div>{data?.gereeniiDugaar}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold">{t("Талбайн дугаар")}:</div>
              <div>{data?.talbainDugaar}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="font-bold">{t("Нэр")}:</div>
              <div>{data?.ner}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold">{t("Утас")}:</div>
              <div>{data?.utas.join(",")}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="font-bold">{t("Регистр")}:</div>
              <div>{data?.register}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold">{t("Алдангийн үлдэгдэл")}:</div>
              <div>{formatNumber(aldangiinUldegdel, 2)}</div>
            </div>
          </div>

          {canEditAldangi && (
            <div className="ml-auto">
              <Button
                type="primary"
                onClick={openModal}
                className="whitespace-nowrap"
              >
                {t("Алданги засах")}
              </Button>
            </div>
          )}
        </div>

        <Tabs
          defaultActiveKey={activeTab}
          activeKey={activeTab}
          items={[
            {
              key: "1",
              label: t("Төлсөн алданги"),
              children: <TableContent />,
            },
            {
              key: "2",
              label: t("Бодогдсон алданги"),
              children: <TableContent2 />,
            },
          ]}
          onChange={(v) => {
            setActiveTab(v);
          }}
        />
      </div>

      {canEditAldangi && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={closeModal}
          ></div>

          <div className="relative w-[500px] max-w-full rounded-md bg-white text-black shadow-xl dark:bg-gray-800 dark:text-gray-400">
            <div className="flex items-center justify-between border-b px-6 py-3 text-black dark:bg-gray-800 dark:text-gray-400">
              <h2 className="text-md text-black dark:text-gray-100">
                {t("Алданги засах")}
              </h2>
            </div>

            <div className="space-y-4 px-6 py-4 text-black dark:bg-gray-800 dark:text-gray-400">
              <div>
                <label className="text-md mb-1 block font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  {t("Алданги засах дүнг оруулна уу")}
                </label>
                <InputNumber
                  placeholder="Дүнгээ оруулна уу..."
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  style={{ width: "100%", textAlign: "center" }}
                  value={aldangiDun === "" ? undefined : Number(aldangiDun)}
                  onChange={(value) =>
                    setAldangiDun(value === undefined ? "" : value?.toString())
                  }
                />
              </div>
              <div>
                <Input.TextArea
                  id="textArea"
                  placeholder={t("Тайлбар")}
                  value={zasahTailbar}
                  onChange={(e) => setZasahTailbar(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t px-6 py-3 dark:bg-gray-800 dark:text-gray-400">
              <Button type="default" onClick={closeModal}>
                {t("Хаах")}
              </Button>
              <Button type="primary" onClick={hadgalakhHandler}>
                {t("Хадгалах")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(GuilgeeniiTuukhAldangi);
