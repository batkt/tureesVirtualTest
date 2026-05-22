import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useMemo, useState } from "react";
import { aldaaBarigch } from "services/uilchilgee";
import { useAuth } from "services/auth";
import { Tabs, DatePicker, Select, Empty, Spin } from "antd";
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
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TURUL_CONFIG = {
  turees:     { nerKey: "Түрээс",     icon: <HomeOutlined />,             color: "#10b981", ring: "ring-emerald-200 dark:ring-emerald-800" },
  ashiglalt:  { nerKey: "Ашиглалт",  icon: <ThunderboltOutlined />,      color: "#3b82f6", ring: "ring-blue-200 dark:ring-blue-800" },
  aldangi:    { nerKey: "Алданги",   icon: <WarningOutlined />,          color: "#ef4444", ring: "ring-red-200 dark:ring-red-800" },
  baritsaa:   { nerKey: "Барьцаа",   icon: <LockOutlined />,             color: "#8b5cf6", ring: "ring-violet-200 dark:ring-violet-800" },
  khyamdral:  { nerKey: "Хөнгөлөлт", icon: <GiftOutlined />,            color: "#f59e0b", ring: "ring-amber-200 dark:ring-amber-800" },
  khungulult: { nerKey: "Хөнгөлөлт", icon: <GiftOutlined />,            color: "#f59e0b", ring: "ring-amber-200 dark:ring-amber-800" },
  bank:       { nerKey: "Банк",      icon: <BankOutlined />,             color: "#06b6d4", ring: "ring-cyan-200 dark:ring-cyan-800" },
  qpay:       { nerKey: "QPay",      icon: <WalletOutlined />,           color: "#6366f1", ring: "ring-indigo-200 dark:ring-indigo-800" },
  barter:     { nerKey: "Barter",    icon: <SwapOutlined />,             color: "#14b8a6", ring: "ring-teal-200 dark:ring-teal-800" },
  voucher:    { nerKey: "Voucher",   icon: <GiftOutlined />,             color: "#ec4899", ring: "ring-pink-200 dark:ring-pink-800" },
  khuvaari:   { nerKey: "Хуваарь",   icon: <BarChartOutlined />,         color: "#64748b", ring: "ring-slate-200 dark:ring-slate-700" },
  avlaga:     { nerKey: "Авлага",    icon: <ExclamationCircleOutlined />, color: "#f97316", ring: "ring-orange-200 dark:ring-orange-800" },
  zalruulga:  { nerKey: "Залруулга", icon: <SwapOutlined />,             color: "#a855f7", ring: "ring-purple-200 dark:ring-purple-800" },
};

function GlassCard({ children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/70 dark:ring-slate-700/60 ${className}`}>
      {children}
    </div>
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

function IncomeTypeCard({ cfg, tulukhDun, tulsunDun, khyamdral }) {
  const { t } = useTranslation();
  const dutuu = Math.max(0, (tulukhDun || 0) - (khyamdral || 0) - (tulsunDun || 0));
  const pct = tulukhDun > 0
    ? Math.min(100, Math.round(((tulsunDun || 0) / tulukhDun) * 100))
    : 0;

  return (
    <GlassCard className={`p-4 ring-1 ${cfg.ring}`}>
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
          <div className="mt-0.5 text-slate-400">{t("Орсон")}</div>
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

function OutstandingCard({ cfg, tulukhDun, tulsunDun, khyamdral }) {
  const { t } = useTranslation();
  const dutuu = Math.max(0, (tulukhDun || 0) - (khyamdral || 0) - (tulsunDun || 0));
  const pct = tulukhDun > 0
    ? Math.min(100, Math.round(((tulsunDun || 0) / tulukhDun) * 100))
    : 0;
  const remaining = 100 - pct;

  return (
    <GlassCard className={`p-4 ring-1 ${cfg.ring}`}>
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
      <div className="mb-1 text-xl font-bold text-red-500">
        {formatNumber(dutuu, 0)}₮
      </div>
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-red-400 transition-all duration-700"
          style={{ width: `${remaining}%` }}
        />
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
          <div className="mt-0.5 text-slate-400">{t("Орсон")}</div>
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
  const { theme } = useTheme();
  useAuth();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("orlogo");
  const [nariivchlal, setNariivchlal] = useState("month");
  const [lineOgnoo, setLineOgnoo] = useState([
    moment().startOf("year"),
    moment().endOf("month"),
  ]);

  const query = useMemo(() => ({
    nariivchlal,
    ekhlekhOgnoo: lineOgnoo?.[0]?.format("YYYY-MM-DD 00:00:00"),
    duusakhOgnoo: lineOgnoo?.[1]?.format("YYYY-MM-DD 23:59:59"),
  }), [lineOgnoo, nariivchlal]);

  const { data: sambar } = useSWR(
    !!token ? ["khyanakhSambariinUgugdul", token, query] : null,
    (url, token, q) =>
      createMethod(url, token, {
        ekhlekhOgnoo: q.ekhlekhOgnoo,
        duusakhOgnoo: q.duusakhOgnoo,
      })
        .then(({ data }) => data)
        .catch(aldaaBarigch),
    { revalidateOnFocus: false }
  );

  const { tailanGaralt: turulData, isValidating: turulLoading } = useTailan(
    "orlogiinTuruulaarAvya",
    token,
    query
  );

  const lineChart = useLineChart("orlogiinChartSalbarKhugatsaagaarAvya", token, query);

  const baseTooltip = {
    backgroundColor: isDark ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.97)",
    borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)",
    borderWidth: 1,
    cornerRadius: 10,
    padding: 12,
    titleColor: isDark ? "#f1f5f9" : "#1e293b",
    bodyColor: isDark ? "#94a3b8" : "#64748b",
    titleFont: { size: 12, weight: "600" },
    bodyFont: { size: 11 },
    displayColors: true,
    boxPadding: 4,
    boxWidth: 9,
    boxHeight: 9,
  };

  const lineOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    animation: { duration: 900 },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          boxWidth: 8,
          boxHeight: 8,
          color: isDark ? "#94a3b8" : "#64748b",
          font: { size: 11 },
        },
      },
      tooltip: {
        ...baseTooltip,
        callbacks: { label: (ctx) => ` ${new Intl.NumberFormat().format(ctx.parsed.y)}` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? "#64748b" : "#94a3b8", font: { size: 11 } },
      },
      y: {
        grid: { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", lineWidth: 1 },
        ticks: {
          color: isDark ? "#64748b" : "#94a3b8",
          font: { size: 11 },
          callback: (v) => new Intl.NumberFormat("mn-MN", { notation: "compact", compactDisplay: "short" }).format(v),
        },
      },
    },
    elements: {
      point: { radius: 4, hoverRadius: 6, borderWidth: 2, backgroundColor: isDark ? "#0f172a" : "#ffffff" },
      line: { tension: 0.4, borderWidth: 2.5, fill: true },
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
        const dutuu = Math.max(0, (a.tulukhDun || 0) - (a.khyamdral || 0) - (a.tulsunDun || 0));
        return dutuu > 0;
      })
      .sort((a, b) => {
        const dutuuA = Math.max(0, (a.tulukhDun || 0) - (a.khyamdral || 0) - (a.tulsunDun || 0));
        const dutuuB = Math.max(0, (b.tulukhDun || 0) - (b.khyamdral || 0) - (b.tulsunDun || 0));
        return dutuuB - dutuuA;
      });
  }, [turulData]);

  const totalTulukh = useMemo(() => (turulData || []).reduce((s, a) => s + (a.tulukhDun || 0), 0), [turulData]);
  const totalTulsun = useMemo(() => (turulData || []).reduce((s, a) => s + (a.tulsunDun || 0), 0), [turulData]);
  const totalKhyamdral = useMemo(() => (turulData || []).reduce((s, a) => s + (a.khyamdral || 0), 0), [turulData]);
  const totalDutuu = Math.max(0, totalTulukh - totalKhyamdral - totalTulsun);

  const tenantTotal = (sambar?.khariu || []).reduce((s, a) => s + a.too, 0);
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
    </div>
  );

  const OrlogoTab = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label={t("Нийт бодогдсон")}
          value={`${formatNumber(totalTulukh, 0)}₮`}
          icon={<DollarOutlined />}
          color="#10b981"
        />
        <StatCard
          label={t("Нийт орсон")}
          value={`${formatNumber(totalTulsun, 0)}₮`}
          icon={<ArrowUpOutlined />}
          color="#3b82f6"
          sub={totalTulukh > 0 ? `${Math.round((totalTulsun / totalTulukh) * 100)}%` : undefined}
        />
        <StatCard
          label={t("Түрээслэгч")}
          value={`${tenantActive} / ${tenantTotal}`}
          icon={<TeamOutlined />}
          color="#8b5cf6"
          sub={t("Идэвхтэй / Нийт")}
        />
      </div>

      <div>
        <SectionHeading icon={<BarChartOutlined />} title={t("Орлогын төрлөөр")} />
        {turulLoading ? (
          <div className="flex justify-center py-10"><Spin /></div>
        ) : incomeTypes.length === 0 ? (
          <GlassCard className="flex justify-center py-10">
            <Empty description={t("Өгөгдөл байхгүй")} />
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {incomeTypes.map((row) => {
              const cfg = TURUL_CONFIG[row._id];
              if (!cfg) return null;
              return (
                <IncomeTypeCard
                  key={row._id}
                  cfg={cfg}
                  tulukhDun={row.tulukhDun}
                  tulsunDun={row.tulsunDun}
                  khyamdral={row.khyamdral}
                />
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
        <StatCard
          label={t("Нийт үлдэгдэл")}
          value={`${formatNumber(totalDutuu, 0)}₮`}
          icon={<ExclamationCircleOutlined />}
          color="#ef4444"
        />
        <StatCard
          label={t("Нийт бодогдсон")}
          value={`${formatNumber(totalTulukh, 0)}₮`}
          icon={<DollarOutlined />}
          color="#64748b"
        />
        <StatCard
          label={t("Нийт орсон")}
          value={`${formatNumber(totalTulsun, 0)}₮`}
          icon={<ArrowUpOutlined />}
          color="#10b981"
        />
        <StatCard
          label={t("Хөнгөлөлт")}
          value={`${formatNumber(totalKhyamdral, 0)}₮`}
          icon={<GiftOutlined />}
          color="#f59e0b"
        />
      </div>

      <div>
        <SectionHeading icon={<ArrowDownOutlined />} title={t("Үлдэгдэл төрлөөр")} />
        {turulLoading ? (
          <div className="flex justify-center py-10"><Spin /></div>
        ) : outstandingTypes.length === 0 ? (
          <GlassCard className="flex justify-center py-10">
            <Empty description={t("Үлдэгдэл байхгүй")} />
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {outstandingTypes.map((row) => {
              const cfg = TURUL_CONFIG[row._id];
              if (!cfg) return null;
              return (
                <OutstandingCard
                  key={row._id}
                  cfg={cfg}
                  tulukhDun={row.tulukhDun}
                  tulsunDun={row.tulsunDun}
                  khyamdral={row.khyamdral}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Admin
      khuudasniiNer="barilgaBurtgel"
      title="Хяналтын самбар"
      className="p-2 md:px-4"
      tsonkhniiId="61c2c6271c2830c4e6f90c85"
    >
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
