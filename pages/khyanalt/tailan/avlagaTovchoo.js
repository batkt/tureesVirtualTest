import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import local from "antd/lib/date-picker/locale/mn_MN";
import {
  DatePicker,
  Select,
  Table,
  Modal,
  Spin,
  Tooltip,
  Table as AntdTable,
  Checkbox,
  Input,
} from "antd";
import formatNumber from "tools/function/formatNumber";
import useAvlagaTovchoo, { useavlagaTovchooDelgerengui } from "hooks/tailan/useAvlagaTovchoo";
import { useAuth } from "services/auth";
import React, { useMemo, useRef, useState } from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { flushSync } from "react-dom";
import useJagsaalt from "hooks/useJagsaalt";
import { useTranslation } from "react-i18next";
import { Excel } from "antd-table-saveas-excel";
import axios from "services/uilchilgee";

const searchKeys = ["ner", "register", "customerTin", "talbainDugaar", "gereeniiDugaar", "utas"];
function DetailModal({ open, onClose, record, ognoo, token, baiguullaga, barilgiinId }) {
  const { t } = useTranslation();
  const { ajiltan } = useAuth();
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: t("Авлагын дэлгэрэнгүй тайлан"),
    pageStyle: `@media print { @page { size: portrait; margin: 0; } body { margin: 10mm; } }`,
  });
  const filteredEkhlekh = ognoo?.[0]
    ? moment(ognoo[0]).startOf("day").toISOString()
    : "1970-01-01T00:00:00.000Z";
  const filteredDuusakh = ognoo?.[1]
    ? moment(ognoo[1]).endOf("day").toISOString()
    : "2099-12-31T23:59:59.000Z";

  const { detail, gereeDetail, detailUnshijBaina } = useavlagaTovchooDelgerengui(
    open && token,
    record?.gereeniiDugaar,
    filteredEkhlekh,
    filteredDuusakh,
    baiguullaga?._id,
    barilgiinId,
    baiguullaga?.tukhainBaaziinKholbolt
  );

  const actualAldangiTuukhKharakhEsekh = !!baiguullaga?.tokhirgoo?.aldangiTuukhKharakhEsekh;

  const displayAldangi = gereeDetail?.aldangiinUldegdel || 0;

  const effectiveAldangiUldegdel = displayAldangi;

  const { rows, finalTureesBalance } = useMemo(() => {
    if (!detail?.guilgeenuud && !gereeDetail) return { rows: [], finalTureesBalance: 0 };

    const rangeStart = ognoo?.[0] ? moment(ognoo[0]).startOf("day").toDate() : null;
    const rangeEnd = ognoo?.[1] ? moment(ognoo[1]).endOf("day").toDate() : null;
    const inDateRange = (dateStr) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      if (rangeStart && d < rangeStart) return false;
      if (rangeEnd && d > rangeEnd) return false;
      return true;
    };

    const seenIds = new Set();
    let combined = [];


    (detail?.guilgeenuud || []).forEach((g) => {
      let item = g;
      if (g.turul === "aldangi") {
        item = {
          ...g,
          _isAldangiExtra: true,
          tulsunDun: g.tulsunAldangi || g.tulsunDun || 0,
          tailbar: g.tailbar || t("Төлсөн алданги")
        };
      } else if (g.turul === "baritsaa") {

        item = {
          ...g,
          tulsunDun: (g.tulsunDun || 0) + (g.orlogo || 0) + (g.zarlaga || 0),
          tulukhDun: 0,
          tailbar: g.tailbar || t("Барьцаа")
        };
      }
      if (item._id) {
        seenIds.add(item._id.toString());
      }
      combined.push(item);
    });


    const requiredBaritsaa = Number(gereeDetail?.baritsaaAvakhDun || detail?.baritsaaAvakhDun) || 0;
    if (requiredBaritsaa > 0) {
      const baritsaaTulultArr = gereeDetail?.baritsaaTulultArr || [];
      const baritsaaDate = baritsaaTulultArr?.[0]?.guilgeeKhiisenOgnoo ||
        baritsaaTulultArr?.[0]?.ognoo ||
        gereeDetail?.gereeniiOgnoo || null;
      if (inDateRange(baritsaaDate)) {
        combined.push({
          _id: `baritsaa-required-${gereeDetail?._id || detail?._id}`,
          ognoo: baritsaaDate,
          tailbar: t("Барьцаа үүссэн"),
          tulukhDun: requiredBaritsaa,
          tulsunDun: 0,
          khyamdral: 0,
          turul: "baritsaa"
        });
      }
    }


    const effectiveBaritsaaGuilgeenuud = (gereeDetail?.baritsaaGuilgeenuud?.length > 0)
      ? gereeDetail.baritsaaGuilgeenuud
      : [];

    effectiveBaritsaaGuilgeenuud.forEach((g) => {
      if (g._id && seenIds.has(g._id.toString())) return;
      const entryDate = g.ognoo || g.guilgeeKhiisenOgnoo;
      if (!inDateRange(entryDate)) return;
      const paidAmount = (g.tulsunDun || 0) + (g.orlogo || 0) + (g.zarlaga || 0);
      if (paidAmount > 0 || (g.tulukhDun || 0) > 0) {
        combined.push({
          ...g,
          tailbar: g.tailbar || t("Барьцаа төлөлт"),
          tulsunDun: paidAmount,
          tulukhDun: 0,
          turul: "baritsaa"
        });
      }
    });
    if (!gereeDetail?.baritsaaGuilgeenuud?.length) {
      const baritsaaTulultArr = gereeDetail?.baritsaaTulultArr || [];
      baritsaaTulultArr.forEach((g) => {
        if (g._id && seenIds.has(g._id.toString())) return;
        const entryDate = g.ognoo || g.guilgeeKhiisenOgnoo;
        if (!inDateRange(entryDate)) return;
        const paidAmount = (g.orlogo || 0) + (g.tulsunDun || 0);
        if (paidAmount > 0) {
          combined.push({
            ...g,
            ognoo: entryDate,
            tailbar: g.tailbar || t("Барьцаа төлөлт"),
            tulsunDun: paidAmount,
            tulukhDun: 0,
            turul: "baritsaa"
          });
        }
      });
    }


    (gereeDetail?.aldangiGuilgeenuud || []).forEach((g) => {
      const gDate = g.aldangiBodsonOgnoo || g.ognoo;
      if (ognoo && ognoo[0] && ognoo[1] && gDate) {
        const d = new Date(gDate);
        if (d < new Date(ognoo[0]) || d > new Date(ognoo[1])) {
          return;
        }
      }
      const paidPenalty = g.tulsunAldangi || g.tulsunDun || 0;

      if (paidPenalty > 0) {
        combined.push({
          ...g,
          ognoo: gDate,
          tailbar: t("Алданги төлөлт"),
          tulukhDun: 0,
          tulsunDun: paidPenalty,
          khyamdral: 0,
          _isAldangiExtra: true
        });
      }
    });

    combined.sort((a, b) => {
      const dateA = new Date(a.ognoo || a.createdAt || 0);
      const dateB = new Date(b.ognoo || b.createdAt || 0);
      return dateA - dateB;
    });

    let balance = detail?.ekhniiUldegdel || 0;
    let dataGroups = [];

    combined.forEach((g, i) => {
      const dt = g.tulukhDun || 0;
      let kt = g.tulsunDun || 0;
      const khyamdral = g.khyamdral || 0;
      const aldangiPaid = g.tulsunAldangi || 0;
      const baritsaaPaid = g.tulsunBaritsaa || 0;

      const groupRows = [];

      if (!g._isAldangiExtra && g.turul !== "baritsaa") {
        let remainingKt = Math.max(0, kt - aldangiPaid - baritsaaPaid);

        if (dt > 0) {
          balance += dt;
          groupRows.push({
            ...g,
            key: `main-${i}-dt`,
            tulukhDun: dt,
            tulsunDun: 0,
            khyamdral: 0,
            runningBalance: balance,
          });
        }

        if (khyamdral > 0) {
          balance -= khyamdral;
          const tailbarLower = (g.tailbar || "").trim().toLowerCase();
          const isRentDiscount = tailbarLower === "хөнгөлөлт" || tailbarLower === "түрээсийн хөнгөлөлт" || tailbarLower === "түрээс хөнгөлөлт";
          const isUtil = !!g.zardliinId || (g.zardliinTurul && g.zardliinTurul !== "turees") || (tailbarLower !== "" && !isRentDiscount);

          groupRows.push({
            ...g,
            key: `main-${i}-khyamdral`,
            tulukhDun: 0,
            tulsunDun: 0,
            khyamdral: khyamdral,
            turul: "khungulult",
            tailbar: isUtil ? t("Зардал хөнгөлөлт") : t("Түрээс хөнгөлөлт"),
            runningBalance: balance,
          });
        }

        if (aldangiPaid > 0) {
          balance -= aldangiPaid;
          groupRows.push({
            ...g,
            key: `main-${i}-aldangi`,
            tulukhDun: 0,
            tulsunDun: aldangiPaid,
            khyamdral: 0,
            tailbar: t("Алданги төлөлт"),
            _isExtra: true,
            _isAldangiExtra: true,
            runningBalance: balance,
          });
        }

        if (baritsaaPaid > 0) {
          balance -= baritsaaPaid;
          groupRows.push({
            ...g,
            key: `main-${i}-baritsaa`,
            tulukhDun: 0,
            tulsunDun: baritsaaPaid,
            khyamdral: 0,
            tailbar: t("Барьцаа төлөлт"),
            turul: "baritsaa",
            _isExtra: true,
            runningBalance: balance,
          });
        }

        if (remainingKt > 0) {
          balance -= remainingKt;
          groupRows.push({
            ...g,
            key: `main-${i}-kt`,
            tulukhDun: 0,
            tulsunDun: remainingKt,
            khyamdral: 0,
            tailbar: g.turul === "baritsaa" ? t("Барьцаа") : (g.tailbar?.replace("алданги төлөлт", "")?.replace(/,\s*$/, "") || t("Түрээс төлөлт")),
            runningBalance: balance,
          });
        }

        if (dt === 0 && kt === 0 && khyamdral === 0) {
          groupRows.push({ ...g, key: `main-${i}`, runningBalance: balance });
        }
      } else {
        const dtExtra = g.tulukhDun || 0;
        const ktExtra = g.tulsunDun || 0;
        const khyExtra = g.khyamdral || 0;
        balance = balance + dtExtra - ktExtra - khyExtra;
        groupRows.push({ ...g, key: `main-${i}-extra`, _isExtra: true, runningBalance: balance });
      }

      if (groupRows.length > 0) {
        dataGroups.push(groupRows);
      }
    });
    const aldangiBalance = effectiveAldangiUldegdel;
    const allRows = [
      ...(aldangiBalance > 0 ? [{
        _isBodogdsonAldangi: true,
        key: "bodogdson-aldangi",
        ognoo: null,
        tailbar: t("Алдангийн үлдэгдэл"),
        runningBalance: aldangiBalance
      }] : []),
      {
        _isEkhniiUldegdel: true,
        key: "ekhnii",
        ognoo: ognoo && ognoo[0] ? ognoo[0] : null,
        tailbar: t("Эхний үлдэгдэл"),
        runningBalance: detail?.ekhniiUldegdel || 0
      },
      ...dataGroups.flat()
    ];

    return { rows: allRows, finalTureesBalance: balance };
  }, [detail, gereeDetail, t, ognoo, effectiveAldangiUldegdel]);

  const aldangiTuukhKharakhEsekh = actualAldangiTuukhKharakhEsekh;

  const dataRowsOnly = rows.filter(r => !r._isEkhniiUldegdel && !r._isBodogdsonAldangi);


  const totalAldangiDt = (displayAldangi || 0);
  const totalAldangiKt = (gereeDetail?.niitTulsunAldangi || 0);

  const sumDtRows = dataRowsOnly.reduce((s, r) => s + (r.tulukhDun || 0), 0);
  const sumKtRowsNoAldangi = dataRowsOnly
    .filter(r => !r._isAldangiExtra)
    .reduce((s, r) => s + (r.tulsunDun || 0) + (r.khyamdral || 0), 0);

  const totalDt = (detail?.ekhniiUldegdel || 0) + sumDtRows + totalAldangiDt;
  const totalKt = sumKtRowsNoAldangi + totalAldangiKt;
  const totalKhyamdral = dataRowsOnly.reduce((s, r) => s + (r.khyamdral || 0), 0);

  const tureesiinUldegdel = finalTureesBalance;

  const baritsaaBalance = Math.max(0, (gereeDetail?.baritsaaAvakhDun || 0) - (gereeDetail?.baritsaaniiUldegdel || 0));

  const lastBalance = tureesiinUldegdel;

  const columns = [
    {
      title: "№",
      key: "idx",
      width: 50,
      align: "center",
      render: (_, r, i) => {
        if (r._isEkhniiUldegdel || r._isBodogdsonAldangi) return "-";
        return i;
      },
    },
    {
      title: t("Огноо"),
      dataIndex: "ognoo",
      width: 100,
      align: "center",
      sorter: (a, b) => {
        if (a._isBodogdsonAldangi) return -1;
        if (b._isBodogdsonAldangi) return 1;
        if (a._isEkhniiUldegdel) return -1;
        if (b._isEkhniiUldegdel) return 1;
        return new Date(a.ognoo || 0) - new Date(b.ognoo || 0);
      },
      render: (v, r) => {
        if (r._isEkhniiUldegdel || r._isBodogdsonAldangi) return "-";
        const displayDate = v || r.createdAt;
        return displayDate ? moment(displayDate).format("YYYY/MM/DD") : "";
      },
    },

    {
      title: <div className="text-center">{t("Тайлбар")}</div>,
      dataIndex: "tailbar",
      width: 250,
      render: (v, r) => {
        if (r._isBodogdsonAldangi) {
          return <span className="font-semibold italic text-orange-700">{v}</span>;
        }
        if (r._isEkhniiUldegdel) {
          return <span className="font-semibold italic text-green-700">{v}</span>;
        }
        let label;
        if (r.turul === "khuvaari") {
          if ((r.khyamdral || 0) > 0) {
            label = t("Түрээс") + " (" + t("Хөнгөлөлттэй") + ")";
          } else {
            label = t("Түрээс");
          }
        } else if (r.turul === "khungulult" || (r.khyamdral > 0 && !r.tulukhDun)) {
          label = r.tailbar || t("Хөнгөлөлт");
        } else {
          label = r.tailbar || t(r.turul || "");
        }
        return (
          <div>
            <div className="font-medium text-gray-800">{label}</div>
            {r.barimtNo && <div className="text-xs text-gray-500">{t("Баримт №")}: {r.barimtNo}</div>}
          </div>
        );
      },
    },
    {
      title: <div className="text-center">{t("Гүйлгээ")}</div>,
      children: [
        {
          title: <div className="text-center">{t("ДТ")}</div>,
          dataIndex: "tulukhDun",
          width: 130,
          align: "right",
          render: (v, r) => {
            if (r._isEkhniiUldegdel || r._isBodogdsonAldangi) return "-";
            return !v || v === 0 ? "-" : <span className="font-medium whitespace-nowrap">{formatNumber(v, 2)}</span>;
          },
        },
        {
          title: <div className="text-center">{t("КТ")}</div>,
          dataIndex: "tulsunDun",
          width: 130,
          align: "right",
          render: (v, r) => {
            if (r._isEkhniiUldegdel || r._isBodogdsonAldangi) return "-";
            const total = (v || 0) + (r.khyamdral || 0);
            return total <= 0 ? "-" : <span className="font-medium whitespace-nowrap">{formatNumber(total, 2)}</span>;
          },
        },
      ]
    },
    {
      title: <div className="text-center">{t("Эцсийн үлдэгдэл")}</div>,
      dataIndex: "runningBalance",
      width: 140,
      align: "right",
      render: (v, r) => {
        if (r._isBodogdsonAldangi) {
          return <span className="font-bold text-orange-600 whitespace-nowrap">{formatNumber(v, 2)}</span>;
        }
        if (r._isEkhniiUldegdel) {
          return <span className="font-bold text-blue-600 whitespace-nowrap">{formatNumber(v, 2)}</span>;
        }
        return v === null || v === undefined
          ? <span className="text-gray-300">-</span>
          : <span className="font-medium whitespace-nowrap">{formatNumber(v, 2)}</span>;
      },
    },
  ];

  function exceleerTatya() {
    const excel = new Excel();

    const formattedRows = rows.map((r, i) => {
      if (r._isBodogdsonAldangi) {
        return {
          idx: "",
          ognoo: "",
          tailbar: r.tailbar,
          tulukhDun: 0,
          tulsunDun: 0,
          runningBalance: r.runningBalance || 0
        };
      }
      if (r._isEkhniiUldegdel) {
        return {
          idx: "",
          ognoo: r.ognoo ? moment(r.ognoo).format("YYYY-MM-DD") : "",
          tailbar: r.tailbar,
          tulukhDun: 0,
          tulsunDun: 0,
          runningBalance: detail?.ekhniiUldegdel || 0
        };
      }

      let label;
      if (r.turul === "khuvaari") {
        if ((r.khyamdral || 0) > 0) {
          label = t("Түрээс") + " (" + t("Хөнгөлөлттэй") + ")";
        } else {
          label = t("Түрээс");
        }
      } else if (r.turul === "khungulult" || (r.khyamdral > 0 && !r.tulukhDun)) {
        label = r.tailbar || t("Хөнгөлөлт");
      } else {
        label = r.tailbar || t(r.turul || "");
      }
      if (r.barimtNo) {
        label += ` (${t("Баримт №")}: ${r.barimtNo})`;
      }

      const totalKt = (r.tulsunDun || 0) + (r.khyamdral || 0);

      return {
        idx: i,
        ognoo: (r.ognoo || r.createdAt) ? moment(r.ognoo || r.createdAt).format("YYYY-MM-DD") : "",
        tailbar: label,
        tulukhDun: r.tulukhDun || 0,
        tulsunDun: totalKt || 0,
        runningBalance: r.runningBalance === null || r.runningBalance === undefined ? "" : r.runningBalance
      };
    });

    formattedRows.push({
      idx: "",
      ognoo: "",
      tailbar: t("Нийт"),
      tulukhDun: totalDt,
      tulsunDun: totalKt,
      runningBalance: ""
    });

    formattedRows.push({
      idx: "",
      ognoo: "",
      tailbar: t("Эцсийн үлдэгдэл"),
      tulukhDun: 0,
      tulsunDun: 0,
      runningBalance: lastBalance
    });

    const excelCol = [
      {
        title: "№",
        dataIndex: "idx",
        __style__: { h: "center" },
      },
      {
        title: t("Огноо"),
        dataIndex: "ognoo",
        __style__: { h: "center" },
      },
      {
        title: t("Тайлбар"),
        dataIndex: "tailbar",
        __style__: { h: "left" },
      },
      {
        title: t("ДТ"),
        dataIndex: "tulukhDun",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
      },
      {
        title: t("КТ"),
        dataIndex: "tulsunDun",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
      },
      {
        title: t("Эц/үлд"),
        dataIndex: "runningBalance",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
      },
    ];

    excel
      .addSheet(t("Авлагын дэлгэрэнгүй тайлан"))
      .addColumns(excelCol)
      .addDataSource(formattedRows)
      .saveAs(`${record?.ner || "Харилцагч"}_авлагын_дэлгэрэнгүй.xlsx`);
  }

  return (
    <>
      {/* Hidden Print Layout */}
      <div
        style={{
          position: "absolute",
          top: "-10000px",
          left: "-10000px",
          width: "210mm",
        }}
      >
        <div ref={printRef} className="print-container p-4 text-xs">
          <div className="mb-4 text-center py-4 border-b">
            <div className="text-xl font-bold">Авлагын дэлгэрэнгүй тайлан</div>

          </div>

          <div className="mb-4 flex flex-col gap-2 pb-2 border-b">
            <div className="flex flex-wrap gap-x-8 text-sm font-semibold text-gray-800">
              <div>Харилцагч: <span className="font-normal text-gray-800">{record?.ner}</span></div>
              <div>Талбай дугаар: <span className="font-normal text-gray-800">{record?.talbainDugaar}</span></div>
              <div>Талбай м2: <span className="font-normal text-gray-800">{record?.m2 || gereeDetail?.talbainKhemjee || detail?.talbainKhemjee || "-"} м2</span></div>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2 border-t text-xxs font-bold text-gray-700">
              <div className="flex flex-col">
                <span className="text-gray-400 font-medium">{t("Түрээсийн үлдэгдэл")}</span>
                <span>{formatNumber(tureesiinUldegdel, 2)}₮</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 font-medium">{t("Барьцаа үлдэгдэл")}</span>
                <span>{formatNumber(baritsaaBalance, 2)}₮</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 font-medium">{t("Төлсөн алданги")}</span>
                <span>{formatNumber(gereeDetail?.niitTulsunAldangi || 0, 2)}₮</span>
              </div>
              <div className="flex flex-col text-red-600">
                <span className="text-gray-400 font-medium">{t("Алдангийн үлдэгдэл")}</span>
                <span>{formatNumber(effectiveAldangiUldegdel || 0, 2)}₮</span>
              </div>
            </div>
          </div>

          <table className="w-full border-collapse border border-gray-400 text-xs">
            <thead className="bg-gray-200">
              <tr>
                <th style={{ width: "5%" }} className="border border-gray-400 px-1 py-1 text-center">№</th>
                <th style={{ width: "15%" }} className="border border-gray-400 px-1 py-1 text-center">Огноо</th>
                <th style={{ width: "40%" }} className="border border-gray-400 px-1 py-1 text-center">Тайлбар</th>
                <th style={{ width: "13%" }} className="border border-gray-400 px-1 py-1 text-center">ДТ</th>
                <th style={{ width: "13%" }} className="border border-gray-400 px-1 py-1 text-center">КТ</th>
                <th style={{ width: "14%" }} className="border border-gray-400 px-1 py-1 text-center">Үлдэгдэл</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                if (r._isBodogdsonAldangi) {
                  return (
                    <tr key={r.key} className="bg-orange-50 font-medium">
                      <td className="border border-gray-400 px-1 py-0.5 text-center">-</td>
                      <td className="border border-gray-400 px-1 py-0.5 text-center">-</td>
                      <td className="border border-gray-400 px-1 py-0.5 text-left pl-2 italic text-orange-700">{r.tailbar}</td>
                      <td className="border border-gray-400 px-1.5 py-0.5 text-right">-</td>
                      <td className="border border-gray-400 px-1.5 py-0.5 text-right">-</td>
                      <td className="border border-gray-400 px-1.5 py-0.5 text-right text-orange-600">{formatNumber(r.runningBalance, 2)}</td>
                    </tr>
                  );
                }
                if (r._isEkhniiUldegdel) {
                  return (
                    <tr key={r.key} className="bg-green-50 font-medium">
                      <td className="border border-gray-400 px-1 py-0.5 text-center">-</td>
                      <td className="border border-gray-400 px-1 py-0.5 text-center">{r.ognoo || r.createdAt ? moment(r.ognoo || r.createdAt).format("YYYY/MM/DD") : "-"}</td>
                      <td className="border border-gray-400 px-1 py-0.5 text-left pl-2 italic text-green-700">{r.tailbar}</td>
                      <td className="border border-gray-400 px-1.5 py-0.5 text-right">-</td>
                      <td className="border border-gray-400 px-1.5 py-0.5 text-right">-</td>
                      <td className="border border-gray-400 px-1.5 py-0.5 text-right text-blue-600">{formatNumber(detail?.ekhniiUldegdel, 2)}</td>
                    </tr>
                  );
                }

                let label;
                if (r.turul === "khuvaari") {
                  label = (r.khyamdral || 0) > 0 ? t("Түрээс") + " (" + t("Хөнгөлөлттэй") + ")" : t("Түрээс");
                } else if (r.turul === "khungulult" || (r.khyamdral > 0 && !r.tulukhDun)) {
                  label = r.tailbar || t("Хөнгөлөлт");
                } else {
                  label = r.tailbar || t(r.turul || "");
                }

                const totalKt = (r.tulsunDun || 0) + (r.khyamdral || 0);

                return (
                  <tr key={r.key} className={r.turul === "khungulult" ? "text-gray-500 italic" : ""}>
                    <td className="border border-gray-400 px-1 py-0.5 text-center">{i}</td>
                    <td className="border border-gray-400 px-1 py-0.5 text-center">{r.ognoo || r.createdAt ? moment(r.ognoo || r.createdAt).format("YYYY/MM/DD") : ""}</td>
                    <td className="border border-gray-400 px-1 py-0.5">
                      <div>
                        <div className="font-medium text-gray-800">{label}</div>
                        {r.barimtNo && <div className="text-xs text-gray-500">{t("Баримт №")}: {r.barimtNo}</div>}
                      </div>
                    </td>
                    <td className="border border-gray-400 px-1.5 py-0.5 text-right">{!r.tulukhDun || r.tulukhDun === 0 ? "-" : formatNumber(r.tulukhDun, 2)}</td>
                    <td className="border border-gray-400 px-1.5 py-0.5 text-right">{totalKt <= 0 ? "-" : formatNumber(totalKt, 2)}</td>
                    <td className="border border-gray-400 px-1.5 py-0.5 text-right">{r.runningBalance === null || r.runningBalance === undefined ? "-" : formatNumber(r.runningBalance, 2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-50">
                <td colSpan={3} className="border border-gray-400 px-1 py-0.5 text-right">
                  {t("Нийт гүйлгээ")}
                </td>
                <td className="border border-gray-400 px-1.5 py-0.5 text-right text-blue-700">{formatNumber(totalDt, 2)}</td>
                <td className="border border-gray-400 px-1.5 py-0.5 text-right text-blue-700">{formatNumber(totalKt, 2)}</td>
                <td className="border border-gray-400 px-1.5 py-0.5 text-right">-</td>
              </tr>
              <tr className="font-bold bg-gray-100">
                <td colSpan={3} className="border border-gray-400 px-1 py-0.5 text-right">
                  {/* Empty */}
                </td>
                <td colSpan={2} className="border border-gray-400 px-1 py-0.5 text-center italic">
                  Эцсийн үлдэгдэл
                </td>
                <td className="border border-gray-400 px-1.5 py-0.5 text-right text-red-600">{formatNumber(lastBalance, 2)}</td>
              </tr>
            </tfoot>
          </table>

          <table className="mt-6 ml-4">
            <tfoot>
              <tr>
                <td colSpan={3} />
                <td colSpan={3} className="text-right italic text-xs">Тайлан гаргасан:</td>
                <td className="text-xs">
                  ................................/
                  {ajiltan?.ovog?.[0]}{ajiltan?.ovog && "."}{ajiltan?.ner}/
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={1400}
        style={{ top: 20 }}
        title={
          <div className="text-xl text-blue-900 font-bold py-4 text-center">
            {t("Авлагын дэлгэрэнгүй тайлан")}{" "}

          </div>
        }
      >
        <div>
          <div className="flex flex-col gap-3 px-4 py-3 bg-gray-50 rounded-lg border mb-4 shadow-xs">
            <div className="flex flex-wrap gap-x-8 text-sm font-semibold text-gray-700">
              <span className="text-sm font-semibold text-gray-500">
                ({ognoo && ognoo[0] && ognoo[1] ? `${moment(ognoo[0]).format("YYYY/MM/DD")} – ${moment(ognoo[1]).format("YYYY/MM/DD")}` : moment().format("YYYY/MM/DD")})
              </span>
              <div>Харилцагч: <span className="font-normal text-gray-955">{record?.ner}</span></div>
              <div>Талбай дугаар: <span className="font-normal text-gray-955">{record?.talbainDugaar}</span></div>
              <div>Талбай м2: <span className="font-normal text-gray-955">{record?.m2 || gereeDetail?.talbainKhemjee || detail?.talbainKhemjee || "-"} м2</span></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-gray-200">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("Түрээсийн үлдэгдэл")}</span>
                <span className="text-sm font-bold text-gray-800">{formatNumber(tureesiinUldegdel, 2)}₮</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("Барьцаа үлдэгдэл")}</span>
                <span className="text-sm font-bold text-gray-800">{formatNumber(baritsaaBalance, 2)}₮</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("Төлсөн алданги")}</span>
                <span className="text-sm font-bold text-gray-800">{formatNumber(gereeDetail?.niitTulsunAldangi || 0, 2)}₮</span>
              </div>
              <div className="flex flex-col text-red-600">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("Алдангийн үлдэгдэл")}</span>
                <span className="text-sm font-bold text-red-600">{formatNumber(effectiveAldangiUldegdel || 0, 2)}₮</span>
              </div>
            </div>
          </div>

          <style>{`
          .compact-header-table .ant-table-thead > tr > th {
            padding: 4px 8px !important;
            height: auto !important;
            font-size: 13px !important;
          }
          @media print {
            thead tr th {
              background-color: #d4edda !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-hidden-col {
              display: none !important;
            }
          }
        `}</style>

          <Table
            size="small"
            bordered
            loading={detailUnshijBaina}
            columns={columns}
            dataSource={rows}
            pagination={{
              defaultPageSize: 50,
              pageSizeOptions: ["10", "20", "50", "200"],
              showSizeChanger: true,
            }}
            scroll={{ y: 600 }}
            className="shadow-sm compact-header-table"
            rowClassName={(r) => {
              if (r._isBodogdsonAldangi) return "bg-orange-50 font-medium";
              if (r._isEkhniiUldegdel) return "bg-green-50 font-medium";
              return r.turul === "khungulult" ? "text-gray-500 italic" : "";
            }}
            summary={() => (
              <AntdTable.Summary fixed="bottom">
                <AntdTable.Summary.Row className="bg-gray-50">
                  <AntdTable.Summary.Cell index={0} colSpan={3} align="right">
                    <span className="font-bold text-gray-700">{t("Нийт гүйлгээ")}</span>
                  </AntdTable.Summary.Cell>
                  <AntdTable.Summary.Cell index={3} align="right">
                    <span className="font-bold text-blue-700 text-sm whitespace-nowrap">{formatNumber(totalDt, 2)}</span>
                  </AntdTable.Summary.Cell>
                  <AntdTable.Summary.Cell index={4} align="right">
                    <span className="font-bold text-blue-700 text-sm whitespace-nowrap">{formatNumber(totalKt, 2)}</span>
                  </AntdTable.Summary.Cell>
                  <AntdTable.Summary.Cell index={5} align="right">
                    <span className="text-gray-300">-</span>
                  </AntdTable.Summary.Cell>
                </AntdTable.Summary.Row>
                <AntdTable.Summary.Row className="bg-gray-100">
                  <AntdTable.Summary.Cell index={0} colSpan={3} align="right">
                    {/* Empty column */}
                  </AntdTable.Summary.Cell>
                  <AntdTable.Summary.Cell index={3} colSpan={2} align="center">
                    <span className="font-bold text-gray-700 italic">{t("Эцсийн үлдэгдэл")}</span>
                  </AntdTable.Summary.Cell>
                  <AntdTable.Summary.Cell index={5} align="right">
                    <span className="font-bold text-red-600 text-sm whitespace-nowrap">
                      {formatNumber(lastBalance, 2)}
                    </span>
                  </AntdTable.Summary.Cell>
                </AntdTable.Summary.Row>
              </AntdTable.Summary>
            )}
          />
        </div>
        <div className="flex justify-end pt-4 gap-3 pr-4 pb-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={handlePrint}
            className="btn btn-outline-primary flex h-8 items-center gap-1 text-sm bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            {t("Хэвлэх")}
          </button>
          <button
            onClick={exceleerTatya}
            className="btn btn-outline-success flex h-8 items-center gap-1 text-sm bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t("Excel")}
          </button>
          <button
            onClick={onClose}
            className="btn btn-outline-secondary flex h-8 items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
          >
            {t("Хаах")}
          </button>
        </div>
      </Modal>
    </>
  );
}

function avlagaTovchoo({ token }) {
  const { barilgiinId, baiguullaga, ajiltan } = useAuth();
  const { t } = useTranslation();
  const printRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const [searchText, setSearchText] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [khakhTsutsalsan, setKhakhTsutsalsan] = useState(false);
  const [excelUnshijBaina, setExcelUnshijBaina] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: t("Авлагын товчоо"),
    onBeforePrint: () => {
      flushSync(() => setIsPrinting(true));
      return Promise.resolve();
    },
    onAfterPrint: () => setIsPrinting(false),
    pageStyle: `@media print { @page { size: landscape; margin: 10mm; } }`,
  });


  const khariltsagchQuery = useMemo(
    () => ({ barilgiinId, baiguullagiinId: baiguullaga?._id }),
    [baiguullaga, barilgiinId]
  );
  const khariltsagchiinGaralt = useJagsaalt(
    "/geree",
    khariltsagchQuery,
    undefined,
    { ner: 1, register: 1, customerTin: 1, gereeniiDugaar: 1, talbainDugaar: 1 },
    searchKeys,
    undefined,
    999999
  );

  const query = useMemo(
    () => ({
      baiguullagiinId: baiguullaga?._id,
      barilgiinId,
      ekhlekhOgnoo: ognoo?.[0]
        ? moment(ognoo[0]).startOf("day").toISOString()
        : undefined,
      duusakhOgnoo: ognoo?.[1]
        ? moment(ognoo[1]).endOf("day").toISOString()
        : undefined,
    }),
    [ognoo, baiguullaga, barilgiinId]
  );

  const { avlagaTovchoo, unshijBaina, setKhuudaslalt } = useAvlagaTovchoo(
    token,
    query,
    searchKeys,
    999999
  );

  const dataSource = useMemo(() => {
    const aldangiTuukhKharakhEsekh = !!baiguullaga?.tokhirgoo?.aldangiTuukhKharakhEsekh;

    return (avlagaTovchoo?.jagsaalt || avlagaTovchoo || [])
      .map((item) => {
        const aldangiBalance = Number(item.aldangiinUldegdel) || 0;
        const baritsaaBalanceStart = Math.max(0, (Number(item.baritsaaAvakhDun) || 0) - (Number(item.baritsaaniiUldegdelAtStart !== undefined ? item.baritsaaniiUldegdelAtStart : item.baritsaaniiUldegdel) || 0));
        const baritsaaBalanceEnd = Math.max(0, (Number(item.baritsaaAvakhDun) || 0) - (Number(item.baritsaaniiUldegdel) || 0));

        const adjustedEkhniiUldegdel = Number(item.ekhniiUldegdel || 0);

        const adjustedEtssiinUldegdel = Number(item.etssiinUldegdel || 0);

        return {
          ...item,
          ekhniiUldegdel: adjustedEkhniiUldegdel,
          etssiinUldegdel: adjustedEtssiinUldegdel,
        };
      })
      .filter((row) => {
        const balance = Number(row.etssiinUldegdel) || 0;
        const isCancelled = row.tuluv === -1 || Number(row.tuluv) === -1;

        if (Math.abs(balance) < 0.01 && isCancelled) {
          return false;
        }

        if (balance < 0 && isCancelled) {
          return false;
        }

        if (isCancelled && !khakhTsutsalsan) {
          return false;
        }

        const niitDt = Number(row.niitDt) || 0;
        if (Math.abs(niitDt) < 0.01 && isCancelled) {
          return false;
        }

        if (searchText) {
          const s = searchText.toLowerCase();
          const matches =
            (row.ner || "").toLowerCase().includes(s) ||
            (row.register || "").toLowerCase().includes(s) ||
            (row.gereeniiDugaar || "").toLowerCase().includes(s) ||
            (Array.isArray(row.talbainDugaar)
              ? row.talbainDugaar.some((t) => String(t).toLowerCase().includes(s))
              : String(row.talbainDugaar || "").toLowerCase().includes(s));
          if (!matches) return false;
        }

        return true;
      })
      .map((item, i) => ({
        key: i.toString(),
        ...item,
      }));
  }, [avlagaTovchoo, khakhTsutsalsan, baiguullaga, searchText]);

  function openDetail(record, field) {
    setSelectedRecord({ ...record, clickedField: field });
    setDetailOpen(true);
  }

  const numCell = (v, record, field) => {
    const isClickable = v > 0;
    return (
      <div className="flex justify-end">
        {isClickable ? (
          <button
            className="cursor-pointer text-blue-600 hover:underline font-medium bg-transparent border-0 p-0"
            onClick={() => openDetail(record, field)}
          >
            {formatNumber(v, 2)}
          </button>
        ) : (
          <span>{formatNumber(v || 0, 2)}</span>
        )}
      </div>
    );
  };

  function exceleerTatya() {
    const excel = new Excel();
    setExcelUnshijBaina(true);

    const formattedRows = dataSource.map((r, i) => ({
      idx: i + 1,
      ner: r.ner || "-",
      gereeniiDugaar: r.gereeniiDugaar || "-",
      talbainDugaar: r.talbainDugaar || "-",
      register: r.register || "-",
      ekhniiUldegdel: r.ekhniiUldegdel || 0,
      niitDt: r.niitDt || 0,
      niitTulsun: r.niitKt || 0,
      etssiinUldegdel: r.etssiinUldegdel || 0,
    }));

    formattedRows.push({
      idx: "",
      ner: t("Нийт"),
      gereeniiDugaar: "",
      talbainDugaar: "",
      register: "",
      ekhniiUldegdel: totals.ekhniiUldegdel || 0,
      niitDt: totals.niitDt || 0,
      niitTulsun: totals.niitKt || 0,
      etssiinUldegdel: totals.etssiinUldegdel || 0,
    });

    var excelCol = [
      {
        title: "№",
        dataIndex: "idx",
        __style__: { h: "center" },
      },
      {
        title: t("Түрээслэгч"),
        dataIndex: "ner",
        __style__: { h: "left" },
      },
      {
        title: t("Гэрээний дугаар"),
        dataIndex: "gereeniiDugaar",
        __style__: { h: "center" },
      },
      {
        title: t("Талбай"),
        dataIndex: "talbainDugaar",
        __style__: { h: "center" },
      },
      {
        title: t("РД"),
        dataIndex: "register",
        __style__: { h: "center" },
      },
      {
        title: t("Эхний үлдэгдэл"),
        dataIndex: "ekhniiUldegdel",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
      },
      {
        title: t("ДТ"),
        dataIndex: "niitDt",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
      },
      {
        title: t("КТ"),
        dataIndex: "niitTulsun",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
      },
      {
        title: t("Эцсийн үлдэгдэл"),
        dataIndex: "etssiinUldegdel",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
      },
    ];

    excel
      .addSheet(t("Авлагын товчоо"))
      .addColumns(excelCol)
      .addDataSource(formattedRows)
      .saveAs(`${t("Авлагын товчоо")}.xlsx`);
    setExcelUnshijBaina(false);
  }

  const columns = useMemo(
    () => [
      {
        title: "№",
        key: "index",
        align: "center",
        width: 50,
        fixed: "left",
        render: (_, __, i) => i + 1,
      },
      {
        title: t("Түрээслэгч"),
        dataIndex: "ner",
        key: "ner",
        fixed: "left",
        ellipsis: true,
        width: 160,
        render: (v, record) => (
          <Tooltip title={`${record.gereeniiDugaar || ""} | ${record.talbainDugaar || ""}`}>
            <div className="truncate font-medium flex items-center gap-1">
              {v}
            </div>
          </Tooltip>
        ),
      },
      {
        title: t("Гэрээний дугаар"),
        dataIndex: "gereeniiDugaar",
        key: "gereeniiDugaar",
        align: "center",
        width: 140,
        ellipsis: true,
      },
      {
        title: t("Талбай"),
        dataIndex: "talbainDugaar",
        key: "talbainDugaar",
        align: "center",
        width: 90,
        ellipsis: true,
      },
      {
        title: t("м2"),
        dataIndex: "m2",
        key: "m2",
        align: "center",
        width: 80,
        render: (v, record) => record?.m2 || record?.talbainKhemjee || "-",
      },
      {
        title: t("РД"),
        dataIndex: "register",
        key: "register",
        align: "center",
        width: 90,
        ellipsis: true,
      },
      {
        title: t("Эхний үлдэгдэл"),
        dataIndex: "ekhniiUldegdel",
        key: "ekhniiUldegdel",
        align: "center",
        width: 130,
        render: (v) => (
          <div className="flex justify-end font-medium">
            {formatNumber(v || 0, 2)}
          </div>
        ),
      },
      {
        title: t("Гүйлгээ"),
        children: [
          {
            title: t("ДТ"),
            dataIndex: "niitDt",
            key: "niitDt",
            align: "center",
            width: 120,
            render: (v, record) => numCell(v, record, "dt"),
          },
          {
            title: t("КТ"),
            dataIndex: "niitKt",
            key: "niitKt",
            align: "center",
            width: 110,
            render: (v, record) => numCell(v, record, "kt"),
          },
        ],
      },
      {
        title: t("Эцсийн үлдэгдэл"),
        dataIndex: "etssiinUldegdel",
        key: "etssiinUldegdel",
        align: "center",
        width: 130,
        render: (v) => (
          <div
            className={`flex justify-end font-semibold ${(v || 0) > 0 ? "text-red-500" : "text-green-600"
              }`}
          >
            {formatNumber(v || 0, 2)}
          </div>
        ),
      },
    ],
    [t]
  );
  const totals = useMemo(
    () =>
      dataSource.reduce(
        (acc, row) => ({
          ekhniiUldegdel: acc.ekhniiUldegdel + (row.ekhniiUldegdel || 0),
          niitDt: acc.niitDt + (row.niitDt || 0),
          niitTulsun: acc.niitTulsun + (row.niitTulsun || 0),
          niitKhyamdralTurees: acc.niitKhyamdralTurees + (row.niitKhyamdralTurees || 0),
          niitKhyamdralAshiglalt: acc.niitKhyamdralAshiglalt + (row.niitKhyamdralAshiglalt || 0),
          niitKt: acc.niitKt + (row.niitKt || 0),
          etssiinUldegdel: acc.etssiinUldegdel + (row.etssiinUldegdel || 0),
        }),
        { ekhniiUldegdel: 0, niitDt: 0, niitTulsun: 0, niitKhyamdralTurees: 0, niitKhyamdralAshiglalt: 0, niitKt: 0, etssiinUldegdel: 0 }
      ),
    [dataSource]
  );

  return (
    <Admin
      title={t("Авлагын товчоо")}
      khuudasniiNer="avlagaTovchoo"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      loading={unshijBaina}
    >
      {/* ── Filters ── */}
      <div className="col-span-12 flex flex-wrap gap-3 px-5 pb-3 md:px-0 items-center">
        {/* Date range */}
        <DatePicker.RangePicker
          className="w-full lg:w-72"
          locale={local}
          value={ognoo}
          onChange={setOgnoo}
          format="YYYY-MM-DD"
          placeholder={[t("Эхлэх огноо"), t("Дуусах огноо")]}
        />

        {/* Customer Search Input */}
        <Input
          className="w-full lg:w-80"
          placeholder={t("Гэрээ эсвэл Харилцагч хайх")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />

        {/* Show cancelled checkbox */}
        <div className="flex items-center gap-1.5 h-8">
          <Checkbox
            checked={khakhTsutsalsan}
            onChange={(e) => setKhakhTsutsalsan(e.target.checked)}
            className="font-medium text-gray-700 dark:text-gray-300 ml-2"
          >
            {t("Цуцлагдсан гэрээг харах")}
          </Checkbox>
        </div>

        {/* Print & Excel buttons */}
        <div className="ml-auto flex gap-2">
          <button
            onClick={exceleerTatya}
            className="btn btn-outline-success flex h-8 items-center gap-1 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t("Excel")}
          </button>
          <button
            onClick={handlePrint}
            className="btn btn-outline-secondary flex h-8 items-center gap-1 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            {t("Хэвлэх")}
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="col-span-12 w-full overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-800">
        <Table
          sticky={{ offsetHeader: 0 }}
          scroll={{ y: "calc(100vh - 28rem)", x: 1000 }}
          bordered
          size="small"
          className="text-xs t-head"
          columns={columns}
          dataSource={dataSource}
          loading={unshijBaina}
          pagination={{
            defaultPageSize: 50,
            pageSizeOptions: ["10", "20", "50", "200"],
            showSizeChanger: true,
          }}
          rowClassName={(record) => {
            const isCancelled = record?.tuluv === -1 || Number(record?.tuluv) === -1;
            return isCancelled ? "text-red-500" : "";
          }}
          summary={() => (
            <AntdTable.Summary fixed="bottom">
              <AntdTable.Summary.Row>
                <AntdTable.Summary.Cell index={0} colSpan={6}>
                  <span className="font-bold">{t("Нийт")}</span>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell index={6} align="right">
                  <span className="font-bold">{formatNumber(totals.ekhniiUldegdel, 2)}</span>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell index={7} align="right">
                  <span className="font-bold text-red-500">{formatNumber(totals.niitDt, 2)}</span>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell index={8} align="right">
                  <span className="font-bold text-blue-600">{formatNumber(totals.niitKt, 2)}</span>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell index={9} align="right">
                  <span className="font-bold text-red-500">{formatNumber(totals.etssiinUldegdel, 2)}</span>
                </AntdTable.Summary.Cell>
              </AntdTable.Summary.Row>
            </AntdTable.Summary>
          )}
        />
      </div>


      <DetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        record={selectedRecord}
        ognoo={ognoo}
        token={token}
        baiguullaga={baiguullaga}
        barilgiinId={barilgiinId}
      />


      <div
        style={
          isPrinting
            ? { display: "block" }
            : { position: "absolute", top: "-10000px", left: "-10000px", width: "210mm" }
        }
      >
        <div ref={printRef} className="print-container p-4">
          <div className="mb-4 text-center py-4 border-b">
            <div className="text-xl font-bold">Авлагын товчоо тайлан</div>
            <div className="text-sm text-gray-500 font-semibold mt-1">
              Огноо: {ognoo?.[0] && ognoo?.[1] ? `${moment(ognoo[0]).format("YYYY-MM-DD")} – ${moment(ognoo[1]).format("YYYY-MM-DD")}` : moment().format("YYYY-MM-DD")}
            </div>
          </div>

          <table className="w-full border-collapse border border-gray-400 text-xs">
            <thead className="bg-gray-200">
              <tr>
                <th style={{ width: "3%" }} className="border border-gray-400 px-1 py-1 text-center">№</th>
                <th style={{ width: "22%" }} className="border border-gray-400 px-1 py-1 text-center">Түрээслэгч</th>
                <th style={{ width: "10%" }} className="border border-gray-400 px-1 py-1 text-center">Гэрээ</th>
                <th style={{ width: "7%" }} className="border border-gray-400 px-1 py-1 text-center">Талбай</th>
                <th style={{ width: "6%" }} className="border border-gray-400 px-1 py-1 text-center">м2</th>
                <th style={{ width: "8%" }} className="border border-gray-400 px-1 py-1 text-center">РД</th>
                <th style={{ width: "11%" }} className="border border-gray-400 px-1 py-1 text-center">Эхний үлдэгдэл</th>
                <th style={{ width: "11%" }} className="border border-gray-400 px-1 py-1 text-center">ДТ</th>
                <th style={{ width: "11%" }} className="border border-gray-400 px-1 py-1 text-center">КТ</th>
                <th style={{ width: "11%" }} className="border border-gray-400 px-1 py-1 text-center">Эцсийн үлдэгдэл</th>
              </tr>
            </thead>
            <tbody>
              {dataSource.map((row, i) => (
                <tr key={i}>
                  <td className="border border-gray-400 px-1 py-0.5 text-center">{i + 1}</td>
                  <td className="border border-gray-400 px-1 py-0.5">{row.ner}</td>
                  <td className="border border-gray-400 px-1 py-0.5 text-center">{row.gereeniiDugaar}</td>
                  <td className="border border-gray-400 px-1 py-0.5 text-center">{row.talbainDugaar}</td>
                  <td className="border border-gray-400 px-1 py-0.5 text-center">{row.m2 || row.talbainKhemjee || "-"}</td>
                  <td className="border border-gray-400 px-1 py-0.5 text-center">{row.register}</td>
                  <td className="border border-gray-400 px-1.5 py-0.5 text-right">{formatNumber(row.ekhniiUldegdel || 0, 2)}</td>
                  <td className="border border-gray-400 px-1.5 py-0.5 text-right">{formatNumber(row.niitDt || 0, 2)}</td>
                  <td className="border border-gray-400 px-1.5 py-0.5 text-right">{formatNumber(row.niitTulsun || 0, 2)}</td>
                  <td className="border border-gray-400 px-1.5 py-0.5 text-right">{formatNumber(row.etssiinUldegdel || 0, 2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td colSpan={6} className="border border-gray-400 px-1 py-0.5 text-center">Нийт</td>
                <td className="border border-gray-400 px-1 py-0.5 text-right">{formatNumber(totals.ekhniiUldegdel, 2)}</td>
                <td className="border border-gray-400 px-1 py-0.5 text-right">{formatNumber(totals.niitDt, 2)}</td>
                <td className="border border-gray-400 px-1 py-0.5 text-right">{formatNumber(totals.niitTulsun, 2)}</td>
                <td className="border border-gray-400 px-1 py-0.5 text-right">{formatNumber(totals.etssiinUldegdel, 2)}</td>
              </tr>
            </tfoot>
          </table>

          <table className="mt-6 ml-4">
            <tfoot>
              <tr>
                <td colSpan={3} />
                <td colSpan={3} className="text-right italic text-xs">Тайлан гаргасан:</td>
                <td className="text-xs">
                  ................................/
                  {ajiltan?.ovog?.[0]}{ajiltan?.ovog && "."}{ajiltan?.ner}/
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;
export default avlagaTovchoo;
