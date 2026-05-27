import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useMemo, useState, useEffect, useCallback } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useAuth } from "services/auth";
import { Tabs, DatePicker, Select, Empty, Spin, Modal, Tooltip } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  BankOutlined,
  ThunderboltOutlined,
  WarningOutlined,
  LockOutlined,
  GiftOutlined,
  SwapOutlined,
  WalletOutlined,
  BarChartOutlined,
  LineChartOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import useSWR from "swr";
import createMethod from "tools/function/crud/createMethod";
import moment from "moment";
import { Line } from "react-chartjs-2";
import useLineChart from "hooks/tailan/useLineChart";
import useTailan from "hooks/tailan/useTailan";
import formatNumber from "tools/function/formatNumber";
import mnMN from "antd/lib/date-picker/locale/mn_MN";
import enUS from "antd/lib/date-picker/locale/en_US";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const TURUL_CONFIG = {
  turees:    { nerKey: "Түрээс",    icon: <HomeOutlined />,            color: "#10b981", ring: "ring-emerald-200 dark:ring-emerald-800" },
  ashiglalt: { nerKey: "Ашиглалт", icon: <ThunderboltOutlined />,      color: "#3b82f6", ring: "ring-blue-200 dark:ring-blue-800" },
  aldangi:   { nerKey: "Алданги",   icon: <WarningOutlined />,          color: "#ef4444", ring: "ring-red-200 dark:ring-red-800" },
  baritsaa:  { nerKey: "Барьцаа",   icon: <LockOutlined />,             color: "#8b5cf6", ring: "ring-violet-200 dark:ring-violet-800" },
  khyamdral: { nerKey: "Хөнгөлөлт",icon: <GiftOutlined />,             color: "#f59e0b", ring: "ring-amber-200 dark:ring-amber-800" },
  khungulult:{ nerKey: "Хөнгөлөлт",icon: <GiftOutlined />,             color: "#f59e0b", ring: "ring-amber-200 dark:ring-amber-800" },
  bank:      { nerKey: "Банк",      icon: <BankOutlined />,             color: "#06b6d4", ring: "ring-cyan-200 dark:ring-cyan-800" },
  qpay:      { nerKey: "QPay",      icon: <WalletOutlined />,           color: "#6366f1", ring: "ring-indigo-200 dark:ring-indigo-800" },
  barter:    { nerKey: "Бартер",    icon: <SwapOutlined />,             color: "#14b8a6", ring: "ring-teal-200 dark:ring-teal-800" },
  voucher:   { nerKey: "Ваучер",    icon: <GiftOutlined />,             color: "#ec4899", ring: "ring-pink-200 dark:ring-pink-800" },
  khuvaari:  { nerKey: "Хуваарь",  icon: <BarChartOutlined />,         color: "#64748b", ring: "ring-slate-200 dark:ring-slate-700" },
  avlaga:    { nerKey: "Авлага",    icon: <ExclamationCircleOutlined />,color: "#f97316", ring: "ring-orange-200 dark:ring-orange-800" },
  zalruulga: { nerKey: "Залруулга", icon: <SwapOutlined />,             color: "#a855f7", ring: "ring-purple-200 dark:ring-purple-800" },
  orson:     { nerKey: "Залруулга", icon: <SwapOutlined />,             color: "#a855f7", ring: "ring-purple-200 dark:ring-purple-800" },
};
 
function GlassCard({ children, className = "", onClick }) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/70 dark:ring-slate-700/60 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
 
const PAGE_SIZES = [10, 20, 50];

function TailwindTable({ columns, rows, loading, summary }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

 
  useEffect(() => { setPage(1); }, [rows.length]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  const alignClass = (align) =>
    align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center";

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-400 dark:text-slate-500">
        {t("Өгөгдөл байхгүй")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">   {/* Scrollable table area */}
      <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-700" style={{ maxHeight: 440 }}>
        <table className="w-full min-w-max border-collapse text-xs">
          
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((col, ci) => (
                <th
                  key={col.key ?? col.dataIndex ?? ci}
                  className={`
                    border-b border-slate-200 bg-slate-100 px-3 py-2.5
                    text-center text-[11px] font-semibold uppercase tracking-wider
                    text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400
                  `}
                  style={{ minWidth: col.width ?? 80, maxWidth: col.width ?? undefined }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>

          
          <tbody>
            {pageRows.map((row, ri) => (
              <tr
                key={row.key ?? ri}
                className={`
                  border-b border-slate-100 transition-colors
                  hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50
                  ${ri % 2 === 1 ? "bg-slate-50/60 dark:bg-slate-800/20" : "bg-white dark:bg-transparent"}
                `}
              >
                {columns.map((col, ci) => {
                  let value;
                  if (col.render) {
                    value = col.render(col.dataIndex ? row[col.dataIndex] : undefined, row, (page - 1) * pageSize + ri);
                  } else {
                    value = col.dataIndex ? row[col.dataIndex] : null;
                  }
                  return (
                    <td
                      key={col.key ?? col.dataIndex ?? ci}
                      className={`px-3 py-2 ${alignClass(col.align ?? "center")} text-slate-700 dark:text-slate-300`}
                      style={{ maxWidth: col.width ?? undefined }}
                    >
                      {col.ellipsis ? (
                        <Tooltip title={String(row[col.dataIndex] ?? "")}>
                          <span
                            style={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: col.width ? col.width - 24 : 160,
                            }}
                          >
                            {value}
                          </span>
                        </Tooltip>
                      ) : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {summary && (
            <tfoot className="sticky bottom-0 z-10">
              <tr className="border-t-2 border-slate-300 bg-slate-100 font-semibold dark:border-slate-600 dark:bg-slate-800">
                {summary(columns)}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500 dark:text-slate-400">
        <span>
          {t("Нийт")} <span className="font-semibold text-slate-700 dark:text-slate-200">{rows.length}</span> {t("мөр")}
        </span>

        <div className="flex items-center gap-1">
          
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>{s} / {t("хуудас")}</option>
            ))}
          </select>

          
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <LeftOutlined style={{ fontSize: 10 }} />
          </button>

          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-1">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-medium transition ${
                    page === p
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {p}
                </button>
              )
            )}

          
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <RightOutlined style={{ fontSize: 10 }} />
          </button>
        </div>
      </div>
    </div>
  );
}


function KhuvaariUldegdelCell({ record, token, barilgiinId, onLoad }) {
  const { data, isValidating } = useSWR(
    record?.gereeniiDugaar && barilgiinId
      ? ["/uldegdelBodyo", barilgiinId, record.gereeniiDugaar]
      : null,
    (url, barId, gereeDug) =>
      uilchilgee(token)
        .post(url, { barilgiinId: barId, gereeniiDugaar: gereeDug })
        .then((res) => res.data)
        .catch(aldaaBarigch),
    { revalidateOnFocus: false }
  );

  const v = data?.tureesiinUldegdel ?? data?.uldegdel ?? 0;

  useEffect(() => {
    if (data) onLoad(record.gereeniiDugaar, v);
  }, [data, v, record.gereeniiDugaar, onLoad]);

  if (isValidating && !data) return <Spin size="small" />;

  return (
    <span className={`font-semibold ${v > 0 ? "text-red-500" : "text-slate-400"}`}>
      {v > 0 ? formatNumber(v, 2) : "—"}
    </span>
  );
}

function DetailModal({ open, onClose, turul, cfg, token, query }) {
  const { t } = useTranslation();
  const { barilgiinId: authBarilgiinId } = useAuth();
  const barilgiinId = query?.barilgiinId || authBarilgiinId;

  const [balances, setBalances] = useState({});

  useEffect(() => {
    if (open) setBalances({});
  }, [open, query]);

  const handleLoadBalance = useCallback((gereeniiDugaar, val) => {
    setBalances((prev) => {
      if (prev[gereeniiDugaar] === val) return prev;
      return { ...prev, [gereeniiDugaar]: val };
    });
  }, []);

  const { data, isValidating } = useSWR(
    open && turul && token ? ["orlogiinTurulDelgerengui", token, query, turul] : null,
    (url, tok, q, tur) =>
      createMethod(url, tok, {
        ekhlekhOgnoo: q.ekhlekhOgnoo,
        duusakhOgnoo: q.duusakhOgnoo,
        turul: tur,
        ...(q.barilgiinId ? { barilgiinId: q.barilgiinId } : {}),
      })
        .then(({ data }) => data)
        .catch(aldaaBarigch),
    { revalidateOnFocus: false }
  );

  const isBank      = turul === "bank";
  const isVoucher   = turul === "voucher";
  const isBaritsaa  = turul === "baritsaa";
  const isZalruulga = turul === "zalruulga" || turul === "orson";
  const isKhuvaari  = turul === "khuvaari";

  const baseLeft = [
    {
      title: "№",
      key: "idx",
      width: 48,
      align: "center",
      render: (_, __, i) => (
        <span className="font-medium text-slate-400">{i + 1}</span>
      ),
    },
    {
      title: t("Харилцагч"),
      dataIndex: "ner",
      align: "left",
      ellipsis: true,
      width: 180,
      render: (v) => <span className="font-medium">{v}</span>,
    },
    {
      title: t("Гэрээ №"),
      dataIndex: "gereeniiDugaar",
      align: "center",
      ellipsis: true,
      width: 130,
      render: (v) => (
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {v}
        </span>
      ),
    },
    {
      title: t("Талбай"),
      dataIndex: "talbainDugaar",
      align: "center",
      width: 110,
      render: (v) => {
        if (!v) return <span className="text-slate-300">—</span>;
        const str = String(v);
        return (
          <Tooltip title={str}>
            <span
              style={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 86,
                margin: "0 auto",
              }}
            >
              {str}
            </span>
          </Tooltip>
        );
      },
    },
  ];

  const numCol = (title, dataIndex, renderFn, width = 130) => ({
    title,
    dataIndex,
    align: "right",
    width,
    render: renderFn,
  });

  const columns = isBank
    ? [
        ...baseLeft,
        { title: t("Данс"),  dataIndex: "dansniiDugaar", align: "center", ellipsis: true, width: 160 },
        { title: t("Банк"),  dataIndex: "bankNer",        align: "center", ellipsis: true, width: 130 },
        numCol(t("Гүйцэтгэл"), "tulsunDun",
          (v) => <span className="font-semibold text-emerald-600">{formatNumber(v, 0)}₮</span>),
      ]
    : isBaritsaa
    ? [
        ...baseLeft,
        numCol(t("Барьцааны дүн"), "tulukhDun",
          (v) => <span className="text-slate-700 dark:text-slate-300">{formatNumber(v, 0)}</span>),
        numCol(t("Ашигласан"), "tulsunDun",
          (v) => <span className="font-semibold text-emerald-600">{formatNumber(v, 0)}</span>),
        numCol(t("Буцаасан"), "butsaanDun",
          (v) => v > 0
            ? <span className="text-blue-500">{formatNumber(v, 0)}</span>
            : <span className="text-slate-300">—</span>),
        {
          title: t("Үлдэгдэл"),
          align: "right",
          width: 130,
          render: (_, r) => {
            const d = Math.max(0, (r.tulukhDun || 0) - (r.tulsunDun || 0) - (r.butsaanDun || 0));
            return d > 0
              ? <span className="font-semibold text-red-500">{formatNumber(d, 0)}</span>
              : <span className="text-slate-300">—</span>;
          },
        },
      ]
    : [
        ...baseLeft,
        ...(!isVoucher && !isZalruulga
          ? [numCol(t("Бодогдсон"), "tulukhDun",
              (v) => <span className="text-slate-600 dark:text-slate-300">{formatNumber(v, 0)}</span>)]
          : []),
        numCol(t("Гүйцэтгэл"), "tulsunDun",
          (v) => <span className="font-semibold text-emerald-600">{formatNumber(v, 0)}</span>),
        ...(!isVoucher && !isZalruulga
          ? [
              numCol(t("Хөнгөлөлт"), "khyamdral",
                (v) => v > 0
                  ? <span className="text-amber-600">{formatNumber(v, 0)}</span>
                  : <span className="text-slate-300">—</span>),
              {
                title: t("Үлдэгдэл"),
                align: "right",
                width: 130,
                render: (_, r) => {
                  if (isKhuvaari) {
                    return (
                      <KhuvaariUldegdelCell
                        record={r}
                        token={token}
                        barilgiinId={barilgiinId}
                        onLoad={handleLoadBalance}
                      />
                    );
                  }
                  const d = Math.max(0, (r.tulukhDun || 0) - (r.khyamdral || 0) - (r.tulsunDun || 0));
                  return d > 0
                    ? <span className="font-semibold text-red-500">{formatNumber(d, 0)}</span>
                    : <span className="text-slate-300">—</span>;
                },
              },
            ]
          : []),
      ];

  const rows = (data || []).map((r, i) => ({ key: i, ...r }));
  const totalTulsun    = rows.reduce((s, r) => s + (r.tulsunDun  || 0), 0);
  const totalTulukh    = rows.reduce((s, r) => s + (r.tulukhDun  || 0), 0);
  const totalKhyamdral = isBaritsaa ? 0 : rows.reduce((s, r) => s + (r.khyamdral || 0), 0);
  const totalButsaan   = isBaritsaa ? rows.reduce((s, r) => s + (r.butsaanDun || 0), 0) : 0;
  const totalDutuu     = isBaritsaa
    ? Math.max(0, totalTulukh - totalTulsun - totalButsaan)
    : Math.max(0, totalTulukh - totalKhyamdral - totalTulsun);
  const tureesiinUldegdel = rows.reduce((s, r) => s + (balances[r.gereeniiDugaar] || 0), 0);
 
 
  const tdSum = (content, key) => (
    <td key={key} className="px-3 py-2.5 text-right text-xs">
      {content}
    </td>
  );

  const summaryRenderer = (cols) => {
    const leadSpan = baseLeft.length + (isBank ? 2 : 0); 
    const cells = [];

    cells.push(
      <td
        key="label"
        colSpan={leadSpan}
        className="px-3 py-2.5 text-right text-xs font-bold text-slate-600 dark:text-slate-300"
      >
        {t("Нийт")}
      </td>
    );

    if (isBank) {
      cells.push(tdSum(<span className="font-bold text-emerald-600">{formatNumber(totalTulsun, 0)}₮</span>, "tulsun"));
    } else if (isBaritsaa) {
      cells.push(tdSum(<span className="font-bold">{formatNumber(totalTulukh, 0)}</span>, "tulukh"));
      cells.push(tdSum(<span className="font-bold text-emerald-600">{formatNumber(totalTulsun, 0)}</span>, "tulsun"));
      cells.push(tdSum(<span className="text-blue-500">{totalButsaan > 0 ? formatNumber(totalButsaan, 0) : "—"}</span>, "butsaan"));
      cells.push(tdSum(
        <span className={totalDutuu > 0 ? "font-bold text-red-500" : "text-slate-400"}>
          {totalDutuu > 0 ? formatNumber(totalDutuu, 0) : "—"}
        </span>, "dutuu"
      ));
    } else if (isZalruulga) {
      cells.push(tdSum(<span className="font-bold text-emerald-600">{formatNumber(totalTulsun, 0)}</span>, "tulsun"));
    } else {
      if (!isVoucher) cells.push(tdSum(<span className="font-bold">{formatNumber(totalTulukh, 0)}</span>, "tulukh"));
      cells.push(tdSum(<span className="font-bold text-emerald-600">{formatNumber(totalTulsun, 0)}</span>, "tulsun"));
      if (!isVoucher) {
        cells.push(tdSum(
          <span className="text-amber-600">{totalKhyamdral > 0 ? formatNumber(totalKhyamdral, 0) : "—"}</span>, "khyamdral"
        ));
        cells.push(tdSum(
          <span className={totalDutuu > 0 ? "font-bold text-red-500" : "text-slate-400"}>
            {totalDutuu > 0 ? formatNumber(totalDutuu, 0) : "—"}
          </span>, "dutuu"
        ));
      }
    }

    return cells;
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1300}
      style={{ top: 16 }}
      title={
        cfg && (
          <div className="flex items-center gap-2 py-1">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sm text-white"
              style={{ backgroundColor: cfg.color }}
            >
              {cfg.icon}
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-white">
              {t(cfg.nerKey)} — {t("Дэлгэрэнгүй")}
            </span>
          </div>
        )
      }
    >

      {isKhuvaari && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t("Үлдэгдлийн дэлгэрэнгүй")}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: t("Бодогдсон"),         val: totalTulukh,        cls: "text-slate-700 dark:text-slate-200" },
              { label: t("Гүйцэтгэл"),         val: totalTulsun,        cls: "text-emerald-600 dark:text-emerald-400" },
              { label: t("Хөнгөлөлт"),         val: totalKhyamdral,     cls: "text-amber-600 dark:text-amber-400" },
              { label: t("Түрээсийн үлдэгдэл"),val: tureesiinUldegdel,  cls: tureesiinUldegdel > 0 ? "text-red-500 dark:text-red-400" : "text-slate-400" },
            ].map(({ label, val, cls }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</span>
                <span className={`text-sm font-bold ${cls}`}>{formatNumber(val, 2)}₮</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <TailwindTable
        columns={columns}
        rows={rows}
        loading={isValidating}
        summary={summaryRenderer}
      />
    </Modal>
  );
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <GlassCard className="flex flex-col gap-2 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span style={{ color }} className="text-xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-slate-800 dark:text-white">
        {value ?? <span className="text-slate-400">—</span>}
      </div>
      {sub && <div className="text-xs text-slate-500 dark:text-slate-400">{sub}</div>}
    </GlassCard>
  );
}

function IncomeTypeCard({ cfg, tulukhDun, tulsunDun, khyamdral, onClick }) {
  const { t } = useTranslation();
  const dutuu = Math.max(0, (tulukhDun || 0) - (khyamdral || 0) - (tulsunDun || 0));
  const pct   = tulukhDun > 0 ? Math.min(100, Math.round(((tulsunDun || 0) / tulukhDun) * 100)) : 0;

  return (
    <GlassCard
      className={`p-4 ring-1 ${cfg.ring} cursor-pointer transition-shadow hover:shadow-md`}
      onClick={onClick}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-white"
          style={{ backgroundColor: cfg.color }}
        >
          {cfg.icon}
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{t(cfg.nerKey)}</span>
        <span
          className="ml-auto rounded-full px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: cfg.color }}
        >
          {pct}%
        </span>
      </div>
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: cfg.color }}
        />
      </div>
      <div className="grid grid-cols-3 divide-x divide-slate-100 text-center text-xs dark:divide-slate-800">
        <div className="pr-2">
          <div className="text-[11px] font-semibold leading-tight text-slate-700 dark:text-slate-200">
            {formatNumber(tulukhDun, 0)}
          </div>
          <div className="mt-0.5 text-slate-400">{t("Бодогдсон")}</div>
        </div>
        <div className="px-2">
          <div className="text-[11px] font-semibold leading-tight text-emerald-600 dark:text-emerald-400">
            {formatNumber(tulsunDun, 0)}
          </div>
          <div className="mt-0.5 text-slate-400">{t("Гүйцэтгэл")}</div>
        </div>
        <div className="pl-2">
          <div className={`text-[11px] font-semibold leading-tight ${dutuu > 0 ? "text-red-500" : "text-slate-400"}`}>
            {formatNumber(dutuu, 0)}
          </div>
          <div className="mt-0.5 text-slate-400">{t("Үлдэгдэл")}</div>
        </div>
      </div>
    </GlassCard>
  );
}

function OutstandingCard({ cfg, tulukhDun, tulsunDun, khyamdral, onClick }) {
  const { t } = useTranslation();
  const dutuu     = Math.max(0, (tulukhDun || 0) - (khyamdral || 0) - (tulsunDun || 0));
  const pct       = tulukhDun > 0 ? Math.min(100, Math.round(((tulsunDun || 0) / tulukhDun) * 100)) : 0;
  const remaining = 100 - pct;

  return (
    <GlassCard
      className={`p-4 ring-1 ${cfg.ring} cursor-pointer transition-shadow hover:shadow-md`}
      onClick={onClick}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-white"
          style={{ backgroundColor: cfg.color }}
        >
          {cfg.icon}
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{t(cfg.nerKey)}</span>
        <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {remaining}%
        </span>
      </div>
      <div className="mb-1 text-xl font-bold text-red-500">{formatNumber(dutuu, 0)}₮</div>
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-red-400 transition-all duration-700" style={{ width: `${remaining}%` }} />
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-100 text-center text-xs dark:divide-slate-800">
        <div className="pr-2">
          <div className="text-[11px] font-semibold leading-tight text-slate-700 dark:text-slate-200">
            {formatNumber(tulukhDun, 0)}
          </div>
          <div className="mt-0.5 text-slate-400">{t("Бодогдсон")}</div>
        </div>
        <div className="pl-2">
          <div className="text-[11px] font-semibold leading-tight text-emerald-600 dark:text-emerald-400">
            {formatNumber(tulsunDun, 0)}
          </div>
          <div className="mt-0.5 text-slate-400">{t("Гүйцэтгэл")}</div>
        </div>
      </div>
    </GlassCard>
  );
}

function SectionHeading({ icon, title }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-base text-slate-500 dark:text-slate-400">{icon}</span>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </h3>
    </div>
  );
}



function BarilgaBurtgel({ token }) {
  const { t, i18n } = useTranslation();
  const { theme }   = useTheme();
  const { baiguullaga } = useAuth();
  const isDark = theme === "dark";

  const [activeTab,      setActiveTab]      = useState("orlogo");
  const [nariivchlal,    setNariivchlal]    = useState("month");
  const [lineOgnoo,      setLineOgnoo]      = useState([moment().startOf("year"), moment().endOf("month")]);
  const [detailModal,    setDetailModal]    = useState(null);
  const [selectedBarilga,setSelectedBarilga]= useState(null);

  const query = useMemo(() => ({
    nariivchlal,
    ekhlekhOgnoo: lineOgnoo?.[0]?.format("YYYY-MM-DD 00:00:00"),
    duusakhOgnoo: lineOgnoo?.[1]?.format("YYYY-MM-DD 23:59:59"),
    ...(selectedBarilga ? { barilgiinId: selectedBarilga } : {}),
  }), [lineOgnoo, nariivchlal, selectedBarilga]);

  const { data: sambar } = useSWR(
    !!token ? ["khyanakhSambariinUgugdul", token, query] : null,
    (url, token, q) =>
      createMethod(url, token, { ekhlekhOgnoo: q.ekhlekhOgnoo, duusakhOgnoo: q.duusakhOgnoo })
        .then(({ data }) => data).catch(aldaaBarigch),
    { revalidateOnFocus: false }
  );

  const { tailanGaralt: turulData, isValidating: turulLoading } = useTailan("orlogiinTuruulaarAvya", token, query);
  const lineChart = useLineChart("orlogiinChartSalbarKhugatsaagaarAvya", token, query);

  const baseTooltip = {
    backgroundColor: isDark ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.97)",
    borderColor:     isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)",
    borderWidth: 1, cornerRadius: 10, padding: 12,
    titleColor: isDark ? "#f1f5f9" : "#1e293b",
    bodyColor:  isDark ? "#94a3b8" : "#64748b",
    titleFont: { size: 12, weight: "600" }, bodyFont: { size: 11 },
    displayColors: true, boxPadding: 4, boxWidth: 9, boxHeight: 9,
  };

  const lineOptions = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    animation: { duration: 900 },
    plugins: {
      legend: {
        display: true, position: "bottom",
        labels: { usePointStyle: true, pointStyle: "circle", padding: 16, boxWidth: 8, boxHeight: 8, color: isDark ? "#94a3b8" : "#64748b", font: { size: 11 } },
      },
      tooltip: { ...baseTooltip, callbacks: { label: (ctx) => ` ${new Intl.NumberFormat().format(ctx.parsed.y)}` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: isDark ? "#64748b" : "#94a3b8", font: { size: 11 } } },
      y: {
        grid: { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", lineWidth: 1 },
        ticks: { color: isDark ? "#64748b" : "#94a3b8", font: { size: 11 },
          callback: (v) => new Intl.NumberFormat("mn-MN", { notation: "compact", compactDisplay: "short" }).format(v) },
      },
    },
    elements: {
      point: { radius: 4, hoverRadius: 6, borderWidth: 2, backgroundColor: isDark ? "#0f172a" : "#ffffff" },
      line:  { tension: 0.4, borderWidth: 2.5, fill: true },
    },
  }), [isDark]);

  const incomeTypes = useMemo(() => {
    if (!turulData) return [];
    return turulData
      .filter((a) => TURUL_CONFIG[a._id] && ((a.tulukhDun || 0) > 0 || (a.tulsunDun || 0) > 0))
      .sort((a, b) => (b.tulukhDun || 0) - (a.tulukhDun || 0));
  }, [turulData]);

  const outstandingTypes = useMemo(() => {
    if (!turulData) return [];
    return turulData
      .filter((a) => {
        if (!TURUL_CONFIG[a._id]) return false;
        return Math.max(0, (a.tulukhDun || 0) - (a.khyamdral || 0) - (a.tulsunDun || 0)) > 0;
      })
      .sort((a, b) => {
        const dA = Math.max(0, (a.tulukhDun || 0) - (a.khyamdral || 0) - (a.tulsunDun || 0));
        const dB = Math.max(0, (b.tulukhDun || 0) - (b.khyamdral || 0) - (b.tulsunDun || 0));
        return dB - dA;
      });
  }, [turulData]);

  const totalTulukh    = useMemo(() => (turulData || []).reduce((s, a) => s + (a.tulukhDun  || 0), 0), [turulData]);
  const totalTulsun    = useMemo(() => (turulData || []).reduce((s, a) => s + (a.tulsunDun  || 0), 0), [turulData]);
  const totalKhyamdral = useMemo(() => (turulData || []).reduce((s, a) => s + (a.khyamdral  || 0), 0), [turulData]);
  const totalDutuu = Math.max(0, totalTulukh - totalKhyamdral - totalTulsun);

  const tenantTotal  = (sambar?.khariu || []).reduce((s, a) => s + a.too, 0);
  const tenantActive = sambar?.khariu?.find((a) => a._id === true)?.too || 0;

  const Controls = (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <DatePicker.RangePicker
        locale={i18n.language === "mn" ? mnMN : enUS}
        value={lineOgnoo}
        onChange={setLineOgnoo}
        picker={nariivchlal === "year" ? "year" : "month"}
        className="rounded-xl"
      />
      <Select value={nariivchlal} onChange={setNariivchlal} className="w-36 rounded-xl">
        <Select.Option value="month">{t("Сараар")}</Select.Option>
        <Select.Option value="year">{t("Жилээр")}</Select.Option>
      </Select>
      {baiguullaga?.barilguud?.length > 1 && (
        <Select value={selectedBarilga} onChange={setSelectedBarilga} placeholder={t("Бүх барилга")} allowClear className="w-48 rounded-xl">
          {baiguullaga.barilguud.map((b) => (
            <Select.Option key={b._id} value={b._id}>{b.ner}</Select.Option>
          ))}
        </Select>
      )}
    </div>
  );

  const OrlogoTab = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label={t("Нийт төлөлт")}   value={`${formatNumber(totalTulukh, 0)}₮`} icon={<DollarOutlined />} color="#10b981" />
        <StatCard label={t("Нийт гүйцэтгэл")} value={`${formatNumber(totalTulsun, 0)}₮`} icon={<ArrowUpOutlined />} color="#3b82f6"
          sub={totalTulukh > 0 ? `${Math.round((totalTulsun / totalTulukh) * 100)}%` : undefined} />
        <StatCard label={t("Түрээслэгч")} value={`${tenantActive} / ${tenantTotal}`} icon={<TeamOutlined />} color="#8b5cf6" sub={t("Идэвхтэй / Нийт")} />
      </div>

      <div>
        <SectionHeading icon={<BarChartOutlined />} title={t("Орлогын төрлөөр")} />
        {turulLoading ? (
          <div className="flex justify-center py-10"><Spin /></div>
        ) : incomeTypes.length === 0 ? (
          <GlassCard className="flex justify-center py-10"><Empty description={t("Өгөгдөл байхгүй")} /></GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {incomeTypes.map((row) => {
              const cfg = TURUL_CONFIG[row._id];
              if (!cfg) return null;
              return (
                <IncomeTypeCard key={row._id} cfg={cfg}
                  tulukhDun={row.tulukhDun} tulsunDun={row.tulsunDun} khyamdral={row.khyamdral}
                  onClick={() => setDetailModal({ turul: row._id, cfg })} />
              );
            })}
          </div>
        )}
      </div>

      {lineChart?.data?.datasets?.length > 0 && (
        <GlassCard className="p-4">
          <SectionHeading icon={<LineChartOutlined />} title={t("Орлогын хандлага")} />
          <div style={{ height: 280 }}>
            <Line data={lineChart.data} options={lineOptions} />
          </div>
        </GlassCard>
      )}
    </div>
  );

  const ZarlagaTab = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label={t("Нийт үлдэгдэл")}  value={`${formatNumber(totalDutuu, 0)}₮`}    icon={<ExclamationCircleOutlined />} color="#ef4444" />
        <StatCard label={t("Нийт төлөлт")}    value={`${formatNumber(totalTulukh, 0)}₮`}   icon={<DollarOutlined />}            color="#64748b" />
        <StatCard label={t("Нийт гүйцэтгэл")} value={`${formatNumber(totalTulsun, 0)}₮`}   icon={<ArrowUpOutlined />}           color="#10b981" />
        <StatCard label={t("Хөнгөлөлт")}      value={`${formatNumber(totalKhyamdral, 0)}₮`} icon={<GiftOutlined />}              color="#f59e0b" />
      </div>

      <div>
        <SectionHeading icon={<ArrowDownOutlined />} title={t("Үлдэгдэл төрлөөр")} />
        {turulLoading ? (
          <div className="flex justify-center py-10"><Spin /></div>
        ) : outstandingTypes.length === 0 ? (
          <GlassCard className="flex justify-center py-10"><Empty description={t("Үлдэгдэл байхгүй")} /></GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {outstandingTypes.map((row) => {
              const cfg = TURUL_CONFIG[row._id];
              if (!cfg) return null;
              return (
                <OutstandingCard key={row._id} cfg={cfg}
                  tulukhDun={row.tulukhDun} tulsunDun={row.tulsunDun} khyamdral={row.khyamdral}
                  onClick={() => setDetailModal({ turul: row._id, cfg })} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Admin khuudasniiNer="barilgaBurtgel" title="Хяналтын самбар" className="p-2 md:px-4" tsonkhniiId="61c2c6271c2830c4e6f90c85">
      <DetailModal
        open={!!detailModal}
        onClose={() => setDetailModal(null)}
        turul={detailModal?.turul}
        cfg={detailModal?.cfg}
        token={token}
        query={query}
      />
      <div className="col-span-12 space-y-2 p-1 md:p-2">
        {Controls}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          items={[
            {
              key: "orlogo",
              label: (
                <span className="flex items-center gap-1.5 font-semibold">
                  <ArrowUpOutlined className="text-emerald-500" />
                  {t("Орлого")}
                </span>
              ),
              children: OrlogoTab,
            },
            {
              key: "zarlaga",
              label: (
                <span className="flex items-center gap-1.5 font-semibold">
                  <ArrowDownOutlined className="text-red-500" />
                  {t("Авлага")}
                </span>
              ),
              children: ZarlagaTab,
            },
          ]}
        />
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;
export default BarilgaBurtgel;