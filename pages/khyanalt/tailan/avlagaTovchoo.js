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

const searchKeys = ["ner", "register", "customerTin", "talbainDugaar", "gereeniiDugaar", "utas"];

// ── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ open, onClose, record, ognoo, token, baiguullaga, barilgiinId }) {
  const { t } = useTranslation();
  const ekhlekhOgnoo = ognoo?.[0]
    ? moment(ognoo[0]).startOf("day").format("YYYY-MM-DD 00:00:00")
    : undefined;
  const duusakhOgnoo = ognoo?.[1]
    ? moment(ognoo[1]).endOf("day").format("YYYY-MM-DD 23:59:59")
    : undefined;

  const { detail, gereeDetail, detailUnshijBaina } = useavlagaTovchooDelgerengui(
    open && token,
    record?.gereeniiDugaar,
    ekhlekhOgnoo,
    duusakhOgnoo,
    baiguullaga?._id,
    barilgiinId,
    baiguullaga?.tukhainBaaziinKholbolt
  );

  const rows = useMemo(() => {
    if (!detail?.guilgeenuud) return [];
    let balance = detail.ekhniiUldegdel || 0;
    return detail.guilgeenuud.map((g, i) => {
      const dt = g.tulukhDun || 0;
      const kt = g.tulsunDun || 0;
      const khyamdral = g.khyamdral || 0;
      balance = balance + dt - kt - khyamdral;
      return { ...g, key: i, runningBalance: balance };
    });
  }, [detail]);

  const totalDt = rows.reduce((s, r) => s + (r.tulukhDun || 0), 0);
  const totalKt = rows.reduce((s, r) => s + ((r.tulsunDun || 0) + (r.khyamdral || 0)), 0);

  const columns = [
    {
      title: "№",
      key: "idx",
      width: 50,
      align: "center",
      render: (_, __, i) => i + 1,
    },
    {
      title: t("Огноо"),
      dataIndex: "ognoo",
      width: 140,
      align: "center",
      render: (v) => (v ? moment(v).format("YYYY-MM-DD") : ""),
    },
    {
      title: t("Тайлбар"),
      dataIndex: "tailbar",
      render: (v, r) => {
        const label = r.turul === "khuvaari" ? t("Түрээс") : (v || t(r.turul || ""));
        return (
          <div>
            <div className="font-medium text-gray-800">{label}</div>
            {r.barimtNo && <div className="text-xs text-gray-500">{t("Баримт №")}: {r.barimtNo}</div>}
          </div>
        );
      },
    },
    {
      title: t("ДТ"),
      dataIndex: "tulukhDun",
      width: 110,
      align: "right",
      render: (v) =>
        !v || v === 0 ? "-" : <span className="font-medium">{formatNumber(v, 2)}</span>,
    },
    {
      title: t("КТ"),
      dataIndex: "tulsunDun",
      width: 110,
      align: "right",
      render: (v, r) => {
        const total = (v || 0) + (r.khyamdral || 0);
        return total <= 0 ? "-" : <span className="font-medium">{formatNumber(total, 2)}</span>;
      },
    },
    {
      title: t("Үлдэгдэл"),
      dataIndex: "runningBalance",
      width: 120,
      align: "right",
      render: (v) => <span className="font-medium">{formatNumber(v, 2)}</span>,
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      title={<div className="text-lg text-blue-900 border-b pb-2 text-center">{t("Авлагын дэлгэрэнгүй тайлан")}</div>}
    >
      <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-2 gap-4 border border-gray-100">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase">{t("Харилцагч")}</span>
          <span className="font-bold text-gray-800">{record?.ner}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase">{t("Барилга / Талбай")}</span>
          <span className="font-semibold text-gray-700">{record?.barilgiiinNer || record?.barilgiinId} / {record?.talbainDugaar}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase">{t("Гэрээний дугаар")}</span>
          <span className="font-semibold text-gray-700">{record?.gereeniiDugaar}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase">{t("Эхний үлдэгдэл")}</span>
          <span className="font-bold text-red-500 text-lg">{formatNumber(detail?.ekhniiUldegdel || 0, 2)}</span>
        </div>
      </div>

      <Table
        size="small"
        bordered
        loading={detailUnshijBaina}
        columns={columns}
        dataSource={rows}
        pagination={false}
        scroll={{ y: 400 }}
        className="shadow-sm"
        summary={() => (
          <AntdTable.Summary fixed="bottom">
            <AntdTable.Summary.Row className="bg-gray-100">
              <AntdTable.Summary.Cell index={0} colSpan={3} align="right">
                <span className="font-bold text-gray-700 uppercase">{t("Нийт дүн")}</span>
              </AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell index={3} align="right">
                <span className="font-bold text-blue-700 text-sm">{formatNumber(totalDt, 2)}</span>
              </AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell index={4} align="right">
                <span className="font-bold text-blue-700 text-sm">{formatNumber(totalKt, 2)}</span>
              </AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell index={5} align="right">
                <span className="font-bold text-red-600">
                  {formatNumber(rows[rows.length - 1]?.runningBalance || 0, 2)}
                </span>
              </AntdTable.Summary.Cell>
            </AntdTable.Summary.Row>
          </AntdTable.Summary>
        )}
      />

      {/* ── Алданги section ── */}
      {gereeDetail && (
        <div className="mt-3 rounded border border-red-200 bg-red-50 p-2">
          <div className="mb-1 font-bold text-red-600 text-sm">{t("Алданги")}</div>
          {/* Summary row */}
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            <div>
              <span className="text-gray-500">{t("Нийт хуримтлагдсан ДТ")}: </span>
              <span className="font-semibold text-red-500">{formatNumber(gereeDetail?.aldangiinUldegdel || 0, 2)}</span>
            </div>
            <div>
              <span className="text-gray-500">{t("Нийт төлсөн КТ")}: </span>
              <span className="font-semibold text-blue-600">{formatNumber(gereeDetail?.niitTulsunAldangi || 0, 2)}</span>
            </div>
            <div>
              <span className="text-gray-500">{t("Үлдэгдэл")}: </span>
              <span className="font-semibold text-red-500">{formatNumber((gereeDetail?.aldangiinUldegdel || 0) - (gereeDetail?.niitTulsunAldangi || 0), 2)}</span>
            </div>
          </div>
          {/* Transaction rows - өдөр өдрөөр бодогдсон түүхээс */}
          {(gereeDetail?.aldangiGuilgeenuud || []).length > 0 && (
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-red-100">
                  <th className="border border-red-200 px-1 py-0.5 text-center">№</th>
                  <th className="border border-red-200 px-1 py-0.5 text-center">{t("Бодсон огноо")}</th>
                  <th className="border border-red-200 px-1 py-0.5 text-center">{t("Чулуулах огноо")}</th>
                  <th className="border border-red-200 px-1 py-0.5 text-center">{t("Үлдэгдэл")}</th>
                  <th className="border border-red-200 px-1 py-0.5 text-right">{t("Хувь (%)")}</th>
                  <th className="border border-red-200 px-1 py-0.5 text-right">{t("Хоног")}</th>
                  <th className="border border-red-200 px-1 py-0.5 text-right font-bold text-red-600">{t("ДТ (Алданги)")}</th>
                </tr>
              </thead>
              <tbody>
                {(gereeDetail?.aldangiGuilgeenuud || []).map((g, i) => (
                  <tr key={i} className="hover:bg-red-50">
                    <td className="border border-red-100 px-1 py-0.5 text-center">{i + 1}</td>
                    <td className="border border-red-100 px-1 py-0.5 text-center">{g.aldangiBodsonOgnoo ? moment(g.aldangiBodsonOgnoo).format("YYYY-MM-DD") : (g.ognoo ? moment(g.ognoo).format("YYYY-MM-DD") : "")}</td>
                    <td className="border border-red-100 px-1 py-0.5 text-center">{g.aldangiChuluulukhOgnoo ? moment(g.aldangiChuluulukhOgnoo).format("YYYY-MM-DD") : "-"}</td>
                    <td className="border border-red-100 px-1 py-0.5 text-right">{formatNumber(g.uldegdel || 0, 2)}</td>
                    <td className="border border-red-100 px-1 py-0.5 text-right">{g.aldangiinKhuvi ? `${g.aldangiinKhuvi}%` : "-"}</td>
                    <td className="border border-red-100 px-1 py-0.5 text-right">{g.tulukhUdur || g.aldangiChuluulukhKhonog || "-"}</td>
                    <td className="border border-red-100 px-1 py-0.5 text-right font-medium text-red-500">{formatNumber(g.aldangi || g.tulukhDun || 0, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Барьцаа section ── */}
      {gereeDetail && (gereeDetail?.baritsaaAvakhDun || 0) > 0 && (
        <div className="mt-2 rounded border border-blue-200 bg-blue-50 p-2">
          <div className="mb-1 font-bold text-blue-700 text-sm">{t("Барьцаа")}</div>
          {/* Summary row */}
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            <div>
              <span className="text-gray-500">{t("Авах дүн")}: </span>
              <span className="font-semibold text-red-500">{formatNumber(gereeDetail?.baritsaaAvakhDun || 0, 2)}</span>
            </div>
            <div>
              <span className="text-gray-500">{t("Төлсөн КТ")}: </span>
              <span className="font-semibold text-blue-600">{formatNumber((gereeDetail?.baritsaaAvakhDun || 0) - (gereeDetail?.baritsaaniiUldegdel || 0), 2)}</span>
            </div>
            <div>
              <span className="text-gray-500">{t("Үлдэгдэл")}: </span>
              <span className="font-semibold text-red-500">{formatNumber(gereeDetail?.baritsaaniiUldegdel || 0, 2)}</span>
            </div>
          </div>
          {/* Transaction rows - avlaga.baritsaa-аас */}
          {(gereeDetail?.baritsaaGuilgeenuud || []).length > 0 && (
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-blue-200 px-1 py-0.5 text-center">№</th>
                  <th className="border border-blue-200 px-1 py-0.5 text-center">{t("Огноо")}</th>
                  <th className="border border-blue-200 px-1 py-0.5">{t("Тайлбар")}</th>
                  <th className="border border-blue-200 px-1 py-0.5 text-right font-bold text-red-600">{t("ДТ")}</th>
                  <th className="border border-blue-200 px-1 py-0.5 text-right font-bold text-blue-700">{t("КТ")}</th>
                </tr>
              </thead>
              <tbody>
                {(gereeDetail?.baritsaaGuilgeenuud || []).map((g, i) => (
                  <tr key={i} className="hover:bg-blue-50">
                    <td className="border border-blue-100 px-1 py-0.5 text-center">{i + 1}</td>
                    <td className="border border-blue-100 px-1 py-0.5 text-center">{g.ognoo ? moment(g.ognoo).format("YYYY-MM-DD HH:mm") : ""}</td>
                    <td className="border border-blue-100 px-1 py-0.5">{g.tailbar || t("Барьцаа")}</td>
                    <td className="border border-blue-100 px-1 py-0.5 text-right font-medium text-red-500">{formatNumber(g.tulukhDun || 0, 2)}</td>
                    <td className="border border-blue-100 px-1 py-0.5 text-right font-medium text-blue-600">{formatNumber((g.tulsunDun || 0) + (g.orlogo || 0), 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </Modal>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function avlagaTovchoo({ token }) {
  const { barilgiinId, baiguullaga, ajiltan } = useAuth();
  const { t } = useTranslation();
  const printRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const [songogdsonIds, setSongogdsonIds] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

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

  // Customer dropdown list
  const khariltsagchQuery = useMemo(
    () => ({ barilgiinId, baiguullagiinId: baiguullaga?._id }),
    [baiguullaga, barilgiinId]
  );
  const khariltsagchiinGaralt = useJagsaalt(
    "/geree",
    khariltsagchQuery,
    undefined,
    { ner: 1, register: 1, customerTin: 1, gereeniiDugaar: 1, talbainDugaar: 1 },
    searchKeys
  );

  const query = useMemo(
    () => ({
      baiguullagiinId: baiguullaga?._id,
      barilgiinId,
      ekhlekhOgnoo: ognoo?.[0]
        ? moment(ognoo[0]).startOf("day").format("YYYY-MM-DD")
        : undefined,
      duusakhOgnoo: ognoo?.[1]
        ? moment(ognoo[1]).endOf("day").format("YYYY-MM-DD")
        : undefined,
      // If the selected value starts with 'G:', it's a contract number
      gereeniiDugaaruud: songogdsonIds
        .filter((id) => id.startsWith("G:"))
        .map((id) => id.replace("G:", "")),
      // Otherwise it's a register (backward compatibility/customer level)
      khariltsagchiinId: songogdsonIds
        .filter((id) => !id.startsWith("G:"))
        .length > 0
        ? songogdsonIds.filter((id) => !id.startsWith("G:"))
        : undefined,
    }),
    [ognoo, baiguullaga, barilgiinId, songogdsonIds]
  );

  const { avlagaTovchoo, unshijBaina, setKhuudaslalt } = useAvlagaTovchoo(
    token,
    query,
    searchKeys,
    200
  );

  const dataSource = useMemo(
    () =>
      (avlagaTovchoo?.jagsaalt || avlagaTovchoo || []).map((item, i) => ({
        key: i.toString(),
        ...item,
      })),
    [avlagaTovchoo]
  );

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
            <div className="truncate font-medium">{v}</div>
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
            children: [
              {
                title: t("Төлөлт"),
                dataIndex: "niitTulsun",
                key: "niitTulsun",
                align: "center",
                width: 110,
                render: (v, record) => numCell(v, record, "kt"),
              },
              {
                title: t("Түрээсийн хөнгөлөлт"),
                dataIndex: "niitKhyamdralTurees",
                key: "niitKhyamdralTurees",
                align: "center",
                width: 130,
                render: (v) =>
                  v > 0 ? (
                    <div className="flex justify-end font-medium text-purple-600">
                      {formatNumber(v, 2)}
                    </div>
                  ) : (
                    <span>-</span>
                  ),
              },
              {
                title: t("Ашиглалтын хөнгөлөлт"),
                dataIndex: "niitKhyamdralAshiglalt",
                key: "niitKhyamdralAshiglalt",
                align: "center",
                width: 140,
                render: (v) =>
                  v > 0 ? (
                    <div className="flex justify-end font-medium text-teal-600">
                      {formatNumber(v, 2)}
                    </div>
                  ) : (
                    <span>-</span>
                  ),
              },
            ],
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
            className={`flex justify-end font-semibold ${
              (v || 0) > 0 ? "text-red-500" : "text-green-600"
            }`}
          >
            {formatNumber(v || 0, 2)}
          </div>
        ),
      },
    ],
    [t]
  );

  // Summary totals
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

        {/* Customer select */}
        <Select
          className="w-full lg:w-80"
          showSearch
          mode="multiple"
          allowClear
          filterOption={(input, option) => {
            const s = input.toLowerCase();
            return (
              option?.ner?.toLowerCase().includes(s) ||
              option?.register?.toLowerCase().includes(s) ||
              option?.gereeniiDugaar?.toLowerCase().includes(s) ||
              option?.talbainDugaar?.toLowerCase().includes(s)
            );
          }}
          onSearch={(search) =>
            khariltsagchiinGaralt.setKhuudaslalt((a) => ({ ...a, search }))
          }
          onChange={setSongogdsonIds}
          placeholder={t("Гэрээ эсвэл Харилцагч сонгох")}
        >
          {/* Group by customer but allow selecting individual contracts */}
          {(khariltsagchiinGaralt?.jagsaalt || []).map((d) => (
            <Select.Option
              key={d?.gereeniiDugaar || d?._id}
              value={`G:${d?.gereeniiDugaar}`}
              label={d?.ner}
              ner={d?.ner || ""}
              register={d?.register || d?.customerTin || ""}
              gereeniiDugaar={d?.gereeniiDugaar || ""}
              talbainDugaar={d?.talbainDugaar || ""}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{d?.ner}</span>
                <span className="text-xs text-gray-400">
                  {[d?.gereeniiDugaar, d?.talbainDugaar].filter(Boolean).join(" | ")}
                </span>
              </div>
            </Select.Option>
          ))}
        </Select>

        {/* Print button */}
        <div className="ml-auto">
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
          scroll={{ y: "calc(100vh - 19rem)", x: 1000 }}
          bordered
          size="small"
          className="text-xs"
          columns={columns}
          dataSource={dataSource}
          loading={unshijBaina}
          pagination={{
            current: avlagaTovchoo?.khuudasniiDugaar,
            total: avlagaTovchoo?.niitMur || dataSource.length,
            pageSizeOptions: [100, 200, 500],
            defaultPageSize: 200,
            showSizeChanger: true,
            showTotal: (total) => `Нийт ${total}`,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhuudaslalt((kh) => ({ ...kh, khuudasniiDugaar, khuudasniiKhemjee })),
          }}
          summary={() => (
            <AntdTable.Summary fixed="bottom">
              <AntdTable.Summary.Row>
                <AntdTable.Summary.Cell index={0} colSpan={5}>
                  <span className="font-bold">{t("Нийт")}</span>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell index={5} align="right">
                  <span className="font-bold">{formatNumber(totals.ekhniiUldegdel, 2)}</span>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell index={6} align="right">
                  <span className="font-bold text-red-500">{formatNumber(totals.niitDt, 2)}</span>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell index={7} align="right">
                  <span className="font-bold text-blue-600">{formatNumber(totals.niitTulsun, 2)}</span>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell index={8} align="right">
                  <span className="font-bold text-purple-600">{formatNumber(totals.niitKhyamdralTurees, 2)}</span>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell index={9} align="right">
                  <span className="font-bold text-teal-600">{formatNumber(totals.niitKhyamdralAshiglalt, 2)}</span>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell index={10} align="right">
                  <span className="font-bold text-red-500">{formatNumber(totals.etssiinUldegdel, 2)}</span>
                </AntdTable.Summary.Cell>
              </AntdTable.Summary.Row>
            </AntdTable.Summary>
          )}
        />
      </div>

      {/* ── Detail Modal ── */}
      <DetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        record={selectedRecord}
        ognoo={ognoo}
        token={token}
        baiguullaga={baiguullaga}
        barilgiinId={barilgiinId}
      />

      {/* ── Print view ── */}
      <div
        style={
          isPrinting
            ? { display: "block" }
            : { position: "absolute", top: "-10000px", left: "-10000px", width: "210mm" }
        }
      >
        <div ref={printRef} className="print-container p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <div>
              {ognoo?.[0] && ognoo?.[1] && (
                <span>
                  Огноо: {moment(ognoo[0]).format("YYYY-MM-DD")} –{" "}
                  {moment(ognoo[1]).format("YYYY-MM-DD")}
                </span>
              )}
            </div>
            <div className="text-center text-base font-bold">Авлагын товчоо</div>
            <div />
          </div>
          <table className="w-full border-collapse border border-gray-400 text-xs">
            <thead className="bg-gray-200">
              <tr>
                {["№", "Түрээслэгч", "Гэрээ", "Талбай", "РД", "Эхний үлдэгдэл", "ДТ", "Төлөлт", "Түрх", "Ашх", "Эцсийн үлдэгдэл"].map(
                  (h, i) => (
                    <th key={i} className="border border-gray-400 px-1 py-1 text-center">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {dataSource.map((row, i) => (
                <tr key={i}>
                  <td className="border border-gray-400 px-1 py-0.5 text-center">{i + 1}</td>
                  <td className="border border-gray-400 px-1 py-0.5">{row.ner}</td>
                  <td className="border border-gray-400 px-1 py-0.5 text-center">{row.gereeniiDugaar}</td>
                  <td className="border border-gray-400 px-1 py-0.5 text-center">{row.talbainDugaar}</td>
                  <td className="border border-gray-400 px-1 py-0.5 text-center">{row.register}</td>
                  <td className="border border-gray-400 px-1.5 py-0.5 text-right">{formatNumber(row.ekhniiUldegdel || 0, 2)}</td>
                  <td className="border border-gray-400 px-1.5 py-0.5 text-right">{formatNumber(row.niitDt || 0, 2)}</td>
                  <td className="border border-gray-400 px-1.5 py-0.5 text-right">{formatNumber(row.niitTulsun || 0, 2)}</td>
                  <td className="border border-gray-400 px-1.5 py-0.5 text-right">{formatNumber(row.niitKhyamdralTurees || 0, 2)}</td>
                  <td className="border border-gray-400 px-1.5 py-0.5 text-right">{formatNumber(row.niitKhyamdralAshiglalt || 0, 2)}</td>
                  <td className="border border-gray-400 px-1.5 py-0.5 text-right">{formatNumber(row.etssiinUldegdel || 0, 2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td colSpan={5} className="border border-gray-400 px-1 py-0.5 text-center">Нийт</td>
                <td className="border border-gray-400 px-1 py-0.5 text-right">{formatNumber(totals.ekhniiUldegdel, 2)}</td>
                <td className="border border-gray-400 px-1 py-0.5 text-right">{formatNumber(totals.niitDt, 2)}</td>
                <td className="border border-gray-400 px-1 py-0.5 text-right">{formatNumber(totals.niitTulsun, 2)}</td>
                <td className="border border-gray-400 px-1 py-0.5 text-right">{formatNumber(totals.niitKhyamdralTurees, 2)}</td>
                <td className="border border-gray-400 px-1 py-0.5 text-right">{formatNumber(totals.niitKhyamdralAshiglalt, 2)}</td>
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
