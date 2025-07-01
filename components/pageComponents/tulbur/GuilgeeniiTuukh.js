import {
  Badge,
  Button,
  DatePicker,
  Input,
  message,
  notification,
  Popconfirm,
} from "antd";
import React, { useImperativeHandle, useMemo, useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { DeleteOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import { useReactToPrint } from "react-to-print";
import _ from "lodash";
import { useGereeGuilgee } from "hooks/useGereeniiJagsaalt";
import { useTranslation } from "react-i18next";
import locale from "antd/lib/date-picker/locale/mn_MN";
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

const turulAvya = (turul) => {
  if (turul === "avlaga") return "Авлага";
  else if (turul === "torguuli") return "Торгууль";
  else if (turul === "voucher") return "Ваучер";
  else if (turul === "bank") return "Банк";
  else if (turul === "khyamdral") return "Хямдрал";
  else if (turul === "barter") return "Бартер";
  else if (turul === "baritsaa") return "Барьцаа";
  else if (turul === "zalruulga") return "Залруулга";
  else if (turul === "qpay") return "QPay";
};

function GuilgeeniiTuukh(
  { token, data, refreshData, ognoo, ajiltan, barilgiinId },
  ref
) {
  const { t, i18n } = useTranslation();
  const [shineOgnoo, setShineOgnoo] = useState(undefined);
  const { guilgeeniiTuukh, guilgeeniiTuukhMutate } = useGereeGuilgee(
    token,
    data?._id,
    ognoo,
    shineOgnoo
  );
  const [sortOrders, setSortOrders] = useState({
    ognoo: null,
    turees: null,
    tulukhDun: null,
    khyamdral: null,
    tulsunAldangi: null,
    tulsunDun: null,
    uldegdel: null,
    ajiltan: null,
    helber: null,
    tailbar: null,
    burtgesenOgnoo: null,
  });
  const [sortColumn, setSortColumn] = useState(null);
  const tailbarRef = React.useRef(null);
  const printRef = React.useRef(null);
  function uldegdelMutate() {
    _.isFunction(data.mutate) && data.mutate();
  }
  function tulultUstgaya({
    guilgeeniiId,
    tulsunDun,
    tulukhDun,
    gereeniiDugaar,
    _id,
    turul,
    khyamdral,
  }) {
    if (turul === "baritsaa")
      axios(token)
        .post("/baritsaaniiGuilgeeUstgaya", {
          gereeniiId: data?._id,
          gereeniiDugaar: data?.gereeniiDugaar,
          objectiinId: _id,
          zarlaga: tulsunDun || 0,
          orlogo: tulukhDun || 0,
          barilgiinId: data?.barilgiinId,
        })
        .then(({ data }) => {
          if (data) {
            message.success(t("Төлөлт амжилттай устгагдлаа!"));
            refreshData();
            guilgeeniiTuukhMutate();
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
                  gereeniiDugaar: data?.gereeniiDugaar,
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
                    uldegdelMutate();
                    guilgeeniiTuukhMutate();
                    refreshData();
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

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const toggleSortOrder = (column) => {
    const newSortOrders = { ...sortOrders };
    newSortOrders[column] = sortOrders[column] === "asc" ? "desc" : "asc";
    setSortOrders(newSortOrders);
    setSortColumn(column);
  };

  const sortedData = React.useMemo(() => {
    if (!guilgeeniiTuukh) {
      return [];
    }
    const khuulsanData = [...guilgeeniiTuukh];
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
  }, [guilgeeniiTuukh, sortOrders, sortColumn, shineOgnoo]);

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
        guilgeeniiTuukhMutate();
      },
    }),
    [printRef]
  );

  const exceleerTatya = async () => {
    try {
      const wb = XLSX?.utils.book_new();
      const dataSubset = guilgeeniiTuukh?.map((item) => {
        return {
          Огноо: moment(item.ognoo).format("YYYY/MM/DD"),
          Түрээс: item.undsenDun,
          "Төлөх дүн": item.tulukhDun,
          Хямдрал: item.khyamdral,
          "Төлсөн алданги": item.tulsunAldangi,
          "Төлсөн дүн": item.tulsunDun,
          Үлдэгдэл: item.uldegdel,
          Ажилтан: item.guilgeeKhiisenAjiltniiNer,
          Хэлбэр: item.turul,
          Тайлбар: item.tailbar,
          "Нэмэлт тайлбар": item.nemeltTailbar,
          "Бүртгэсэн огноо": moment(item.burtgesenOgnoo).format("YYYY/MM/DD"),
        };
      });
      const ws = XLSX?.utils.json_to_sheet(dataSubset);
      if (ws) {
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = { r: R, c: C };
            const cell = ws[XLSX.utils.encode_cell(cellAddress)];
            if (!cell.s) {
              cell.s = {};
            }
            cell.s.border = {
              top: { style: "thin", color: { auto: 1 } },
              bottom: { style: "thin", color: { auto: 1 } },
              left: { style: "thin", color: { auto: 1 } },
              right: { style: "thin", color: { auto: 1 } },
            };
          }
        }
        var wscols = [
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 12 },
          { wch: 10 },
          { wch: 10 },
          { wch: 13 },
          { wch: 15 },
          { wch: 10 },
        ];
        ws["!cols"] = wscols;
        ws["A1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        ws["B1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        ws["C1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        ws["D1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        ws["E1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        ws["F1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        ws["G1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        ws["H1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        ws["I1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        ws["J1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        ws["K1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        ws["L1"].s = {
          font: { bold: true, color: { rgb: "FF0000" } },
        };
        XLSX?.utils.book_append_sheet(wb, ws, "гүйлгээ");
        wb.Custprops;
        XLSX?.writeFile(wb, "Гүйлгээний_Түүх.xlsx", {
          WTF: true,
          cellStyles: true,
        });
      }
    } catch (e) {
      aldaaBarigch(e.message);
    }
  };

  return (
    <div className="">
      <div ref={printRef} className="flex flex-col">
        <div className="mb-6 flex w-full items-center justify-start gap-8">
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
          <div className=" flex flex-col">
            <div className="flex gap-2">
              <div className="font-bold dark:text-white">
                {t("Гэрээний дугаар")}:
              </div>
              <div className="dark:text-white">{data?.gereeniiDugaar}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold dark:text-white">
                {t("Талбайн дугаар")}:
              </div>
              <div className="dark:text-white">{data?.talbainDugaar}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="font-bold dark:text-white">{t("Нэр")}:</div>
              <div className="dark:text-white">{data?.ner}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold dark:text-white">{t("Утас")}:</div>
              <div className="dark:text-white">{data?.utas.join(",")}</div>
            </div>
          </div>
        </div>
        <th className="w-full">
          <tr className="flex min-w-[93rem] divide-x divide-white border-b border-gray-200 bg-gray-200 pr-1 text-gray-700  dark:bg-gray-800 dark:text-gray-400">
            <td
              onClick={() => toggleSortOrder("ognoo")}
              className="min-w-[8rem] overflow-hidden p-1 text-center"
            >
              {t("Огноо")}
            </td>
            <td
              onClick={() => toggleSortOrder("ajiltan")}
              className="min-w-[8rem] overflow-hidden p-1 text-center"
            >
              {t("Ажилтан")}
            </td>
            <td
              onClick={() => toggleSortOrder("turees")}
              className="min-w-[8rem] overflow-hidden p-1 text-center"
            >
              {t("Түрээс")}
            </td>
            <td
              onClick={() => toggleSortOrder("tulukhDun")}
              className="min-w-[8rem] overflow-hidden p-1 text-center"
            >
              {t("Төлөх дүн")}
            </td>
            <td
              onClick={() => toggleSortOrder("khyamdral")}
              className="min-w-[8rem] overflow-hidden p-1 text-center"
            >
              {t("Хямдрал")}
            </td>
            <td
              onClick={() => toggleSortOrder("tulsunDun")}
              className="min-w-[8rem] overflow-hidden p-1 text-center"
            >
              {t("Төлсөн дүн")}
            </td>
            <td
              onClick={() => toggleSortOrder("uldegdel")}
              className="min-w-[8rem] overflow-hidden p-1 text-center"
            >
              {t("Үлдэгдэл")}
            </td>
            <td
              onClick={() => toggleSortOrder("helber")}
              className="min-w-[8rem] overflow-hidden p-1 text-center"
            >
              {t("Хэлбэр")}
            </td>
            <td
              onClick={() => toggleSortOrder("tailbar")}
              className="w-full min-w-[8rem] overflow-hidden p-1 text-center"
            >
              {t("Тайлбар")}
            </td>
            <td
              onClick={() => toggleSortOrder("burtgesenOgnoo")}
              className="min-w-[10rem] p-1 text-center"
            >
              {t("Бүртгэсэн огноо")}
            </td>
            <td className="min-w-[3rem] border-none p-1 text-center"></td>
          </tr>
        </th>
        <tbody
          className=" overflownone min-w-[93.4rem] overflow-y-scroll"
          style={{ height: "calc(100vh - 15rem)" }}
        >
          {sortedData
            ?.map((a, i) => (
              <tr className="flex min-w-[93rem] divide-x border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400">
                <td className="min-w-[8rem] overflow-hidden p-1 text-center">
                  {moment(a.ognoo).format("YYYY-MM-DD")}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1">
                  {a.guilgeeKhiisenAjiltniiNer}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1 text-end">
                  {formatNumber(a.undsenDun, 0)}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1 text-end">
                  {formatNumber(a.tulukhDun, 0)}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1 text-end">
                  {formatNumber(a.khyamdral, 0)}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1 text-end">
                  {formatNumber(a.tulsunDun, 0)}
                </td>
                <td
                  className={`min-w-[8rem] overflow-hidden p-1 text-end ${
                    a?.uldegdel > 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {formatNumber(
                    a.turul === "khyamdral" && a.uldegdel < 0 ? 0 : a.uldegdel,
                    0
                  )}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1 text-center">
                  {a.turul === "bank"
                    ? a.tulsunDans !== " "
                      ? a.tulsunDans
                      : t("Банк")
                    : turulAvya(a.turul)}
                </td>
                <td className="flex w-full min-w-[8rem] justify-between overflow-hidden p-1">
                  {a.tailbar}
                </td>
                <td className="flex min-w-[10rem] justify-center p-1 text-center ">
                  {a.guilgeeKhiisenOgnoo &&
                    moment(a.guilgeeKhiisenOgnoo).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td className="flex min-w-[3rem] justify-center border-none">
                  {(ajiltan?.erkh === "Admin" ||
                    !!_.get(ajiltan, `tokhirgoo.guilgeeUstgakhErkh`)?.find(
                      (a) => a === barilgiinId
                    )) && (
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
      </div>
    </div>
  );
}

export default React.forwardRef(GuilgeeniiTuukh);
