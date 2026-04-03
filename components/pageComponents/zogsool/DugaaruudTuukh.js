import { Button, DatePicker, Input, message, Popconfirm, Popover } from "antd";
import React, { useImperativeHandle, useState, useMemo } from "react";
import useSWR from "swr";
import axios, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { modal } from "components/ant/Modal";
import { useReactToPrint } from "react-to-print";
import _ from "lodash";
import { useDugaaruud } from "hooks/useDugaaruudJagsaalt";
import { useTranslation } from "react-i18next";
import locale from "antd/lib/date-picker/locale/mn_MN";
import * as XLSX from "xlsx-js-style";

function DugaaruudTuukh(
  { token, data, refreshData, ognoo, ajiltan, barilgiinId },
  ref,
) {
  const { t, i18n } = useTranslation();
  const [shineOgnoo, setShineOgnoo] = useState(undefined);
  const { dugaaruudTuukh, dugaaruudTuukhMutate } = useDugaaruud(
    token,
    data?._id,
    ognoo,
    shineOgnoo,
  );
  const [sortOrders, setSortOrders] = useState({
    mashiniiDugaar: null,
    khugatsaa: null,
  });
  const [sortColumn, setSortColumn] = useState(null);
  const printRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const toggleSortOrder = (column) => {
    const newSortOrders = { ...sortOrders };
    newSortOrders[column] = sortOrders[column] === "asc" ? "desc" : "asc";
    setSortOrders(newSortOrders);
    setSortColumn(column);
  };

  const sortedData = React.useMemo(() => {
    if (!dugaaruudTuukh) {
      return [];
    }
    const khuulsanData = [...dugaaruudTuukh];
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
  }, [dugaaruudTuukh, sortOrders, sortColumn, shineOgnoo]);

  useImperativeHandle(
    ref,
    () => ({
      khevlekh() {
        handlePrint();
      },
      excelTatakh() {
        if (dugaaruudTuukh && dugaaruudTuukh.length > 0) {
          exceleerTatya();
        } else {
          toast.info(t("Өгөгдөл ачаалж байна..."));
          setTimeout(() => {
            if (dugaaruudTuukh && dugaaruudTuukh.length > 0) {
              exceleerTatya();
            }
          }, 1000);
        }
      },
      refreshData() {
        dugaaruudTuukhMutate();
      },
    }),
    [printRef, dugaaruudTuukh],
  );

  const exceleerTatya = async () => {
    try {
      const wb = XLSX?.utils.book_new();
      const dataSubset = dugaaruudTuukh?.reverse().map((item) => {
        return {
          Дугаар: item.mashiniiDugaar,
          Хугацаа: Number(item.khugatsaa),
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
            const numericColumns = ["B"];
            const colLetter = XLSX.utils.encode_col(C);
            if (numericColumns.includes(colLetter)) {
              cell.s.alignment = { horizontal: "right" };
            }
          }
        }

        var wscols = [{ wch: 20 }, { wch: 20 }];
        ws["!cols"] = wscols;

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
        };

        ws["A1"].s = headerStyle;
        ws["B1"].s = headerStyle;

        XLSX?.utils.book_append_sheet(wb, ws, "Жагсаалт");

        XLSX?.writeFile(wb, data?.ezemshigchiinNer + " жагсаалт.xlsx", {
          WTF: true,
          cellStyles: true,
          bookType: "xlsx",
          type: "binary",
        });
      }
    } catch (e) {
      aldaaBarigch(e.message);
    }
  };

  const niitKhugatsaa = useMemo(() => {
    return (
      dugaaruudTuukh?.map((a) => a.khugatsaa)?.reduce((a, b) => a + b, 0) || 0
    );
  }, [dugaaruudTuukh, shineOgnoo]);

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
            />
          </div>
          <div className="flex flex-col ">
            <div className="flex gap-2">
              <div className="font-bold dark:text-white">{t("Нэр")}:</div>
              <div className="dark:text-white">{data?.ezemshigchiinNer}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold dark:text-white">{t("Тайлбар")}:</div>
              <div className="dark:text-white">{data?.temdeglel}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="font-bold dark:text-white">
                {t("Хөнгөлөх хугацаа")}:
              </div>
              <div className="dark:text-white">{data?.khungulukhKhugatsaa}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold dark:text-white">
                {t("Үлдэгдэл хугацаа")}:
              </div>
              <div className="dark:text-white">
                {data?.uldegdelKhungulukhKhugatsaa}
              </div>
            </div>
          </div>
        </div>
        <th className="w-full">
          <tr className="flex min-w-[50rem] divide-x divide-white border-b border-gray-200 bg-gray-200 pr-1 text-gray-700  dark:bg-gray-800 dark:text-gray-400">
            <td
              onClick={() => toggleSortOrder("mashiniiDugaar")}
              className="min-w-[8rem] overflow-hidden p-1 text-center"
            >
              {t("Дугаар")}
            </td>
            <td
              onClick={() => toggleSortOrder("khugatsaa")}
              className="min-w-[8rem] overflow-hidden p-1 text-center"
            >
              {t("Хугацаа")}
            </td>
          </tr>
        </th>
        <tbody
          className="overflownone min-w-[50rem]"
          style={{ height: "calc(50vh - 15rem)" }}
        >
          {sortedData
            ?.map((a, i) => (
              <tr className="flex min-w-[50rem] divide-x border-b border-gray-200 bg-gray-50 pr-1 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400">
                <td className="min-w-[8rem] overflow-hidden p-1">
                  {a.mashiniiDugaar}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1 text-end">
                  {a.khugatsaa}
                </td>
              </tr>
            ))
            .reverse()}
          <tr className="flex min-w-[50rem] divide-x border-b border-gray-200 bg-gray-50 pr-1 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400">
            <td className="min-w-[8rem] overflow-hidden p-1 font-bold">
              {t("Нийт")}
            </td>
            <td className="min-w-[8rem] overflow-hidden p-1 text-end font-bold">
              {niitKhugatsaa}
            </td>
          </tr>
        </tbody>
      </div>
    </div>
  );
}

export default React.forwardRef(DugaaruudTuukh);
