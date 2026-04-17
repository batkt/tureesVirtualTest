import Admin from "components/Admin";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/router";
import uilchilgee from "services/uilchilgee";
import { useAuth } from "services/auth";
import { Badge, Table, Row, Col, Select, Tag, Popover, Button } from "antd";
import {
  RiseOutlined,
  ReloadOutlined,
  FilterOutlined,
  ProjectOutlined,
  BankOutlined,
  MoneyCollectOutlined,
  HomeOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import useSWR from "swr";
import createMethod from "tools/function/crud/createMethod";
import moment from "moment";
import React from "react";
import { Pie, Doughnut, Line, Bar } from "react-chartjs-2";
import useTailan from "hooks/tailan/useTailan";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { useTalbai } from "hooks/useTalbai";
import useTalbainToololt from "hooks/useTalbainToololt";
import formatNumber from "tools/function/formatNumber";
import Aos from "aos";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { BiMoney, BiMoneyWithdraw } from "react-icons/bi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const GlassCard = ({ children, className = "", title, icon }) => (
  <div className={`relative overflow-hidden rounded-[1.5rem] bg-white/70 dark:bg-slate-900/30 backdrop-blur-2xl border border-white/40 dark:border-slate-800/50 shadow-2xl transition-all duration-500 hover:shadow-emerald-500/5 ${className}`}>
    {title && (
      <div className="px-3 py-3 md:px-5 md:py-4 flex items-center justify-between border-b border-gray-100/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2 md:gap-3">
          {icon && <div className="p-1.5 md:p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm md:text-base">{icon}</div>}
          <span className="text-[11px] md:text-sm font-black tracking-tight text-slate-800 dark:text-slate-100">{title}</span>
        </div>
      </div>
    )}
    <div className="p-2 md:p-4">{children}</div>
  </div>
);

const SummaryCard = ({ title, value, mk, suffix = "", fixed = 2, icon, index = 0 }) => {
  const { t } = useTranslation();
  return (
    <div
      data-aos="fade-left"
      data-aos-duration="1000"
      data-aos-delay={1 + index + "00"}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-green-200 bg-green-50/60 dark:border-green-900 dark:bg-green-950/40 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-gray-300 dark:hover:shadow-gray-800"
    >
      <div className="absolute inset-0 bg-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

      <div className="relative min-h-[100px] h-auto rounded-2xl p-3 sm:p-5">
        <div className="flex h-full flex-col justify-between">
          <div className="mb-2 flex items-start justify-between">
            <div className="space-y-1">
              <div className="bg-gradient-to-r from-green-900 to-green-700 bg-clip-text text-3xl font-bold text-transparent dark:from-green-100 dark:to-green-300">
                {fixed === 0 ? value : formatNumber(value, fixed)} {suffix}
              </div>
              <div className="text-sm font-medium text-green-600 transition-colors duration-300 dark:text-green-400">
                {title}
              </div>
            </div>
          </div>

          <div className="h-0.5 w-0 rounded-full bg-green-500 transition-all duration-500 group-hover:w-full mt-4" />
        </div>
      </div>
    </div>
  );
};

const BuildingStatsSummary = ({ baiguullaga, building, token, t }) => {
  const { tailanGaralt } = useTailan("borluulaltiinTailanAvya", token, {
    baiguullagiinId: baiguullaga?._id,
    barilgiinId: building?._id,
    ekhlekhOgnoo: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
    duusakhOgnoo: moment().endOf('month').format('YYYY-MM-DD'),
    nariivchlal: 'month'
  });

  const actualData = tailanGaralt?.datasets?.find(d => d.label === "Гүйцэтгэл")?.data || [];
  const currentActual = Number(actualData[actualData.length - 1]) || 0;
  const previousActual = Number(actualData[actualData.length - 2]) || 0;
  const growthPercent = previousActual > 0 ? (((currentActual - previousActual) / previousActual) * 100).toFixed(1) : null;
  
  const { data: contractsResponse } = useSWR(
    !!token && !!building._id ? ["/geree", building._id] : null,
    (u, bId) => uilchilgee(token).get(u, { params: { query: { baiguullagiinId: baiguullaga?._id, barilgiinId: bId, tuluv: { $nin: [-1] }, duusakhOgnoo: { $gte: moment().toISOString() } }, khuudasniiKhemjee: 1 } }).then(res => res.data)
  );
  
  const { data: prevContractsResponse } = useSWR(
    !!token && !!building._id ? ["/geree-prev", building._id] : null,
    (u, bId) => uilchilgee(token).get("/geree", { params: { query: { baiguullagiinId: baiguullaga?._id, barilgiinId: bId, tuluv: { $nin: [-1] }, createdAt: { $lte: moment().subtract(1, 'month').endOf('month').toISOString() }, duusakhOgnoo: { $gte: moment().subtract(1, 'month').endOf('month').toISOString() } }, khuudasniiKhemjee: 1 } }).then(res => res.data)
  );

  const contractCount = contractsResponse?.niitMur ?? contractsResponse?.jagsaalt?.length ?? 0;
  const prevContractCount = prevContractsResponse?.niitMur ?? prevContractsResponse?.jagsaalt?.length ?? 0;
  const contractGrowth = prevContractCount > 0 ? (((contractCount - prevContractCount) / prevContractCount) * 100).toFixed(1) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SummaryCard title={t("Орлого1")} value={currentActual} mk={building.niitTalbai} icon={<BiMoneyWithdraw />} index={0} />
      <SummaryCard title={t("Гэрээ1")} value={contractCount} mk={building.niitTalbai} prefix="" fixed={0} icon={<FileTextOutlined />} index={1} />
    </div>
  );
};

const BuildingIncomeChart = ({ baiguullaga, building, token, t }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { tailanGaralt } = useTailan("borluulaltiinTailanAvya", token, {
    baiguullagiinId: baiguullaga?._id,
    barilgiinId: building?._id,
    ekhlekhOgnoo: moment().subtract(5, 'months').startOf('month').format('YYYY-MM-DD'),
    duusakhOgnoo: moment().endOf('month').format('YYYY-MM-DD'),
    nariivchlal: 'month'
  });

  const chartData = {
    labels: tailanGaralt?.labels || [],
    datasets: [
      { type: 'bar', label: t('Төлөвлөгөө'), data: tailanGaralt?.datasets?.find(d => d.label === "Төлөвлөгөө")?.data || [], backgroundColor: '#3b82f6', borderRadius: 4, barThickness: 12 },
      { type: 'line', label: t('Гүйцэтгэл'), data: tailanGaralt?.datasets?.find(d => d.label === "Гүйцэтгэл")?.data || [], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 2 }
    ]
  };

  return (
    <GlassCard title={t("Санхүүгийн гүйцэтгэл")} icon={<RiseOutlined />} className="h-[350px]">
      <div className="h-[250px]">
        <Bar data={chartData} options={{ 
          responsive: true, maintainAspectRatio: false, 
          interaction: { mode: 'index', intersect: false },
          plugins: { 
            legend: { display: false }, 
            tooltip: { cornerRadius: 10, padding: 12, backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)', titleColor: isDark ? '#fff' : '#000', bodyColor: isDark ? '#fff' : '#000' } 
          },
          scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { borderDash: [5, 5], color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } } }
        }} />
      </div>
    </GlassCard>
  );
};

const BuildingOccupancyDoughnut = ({ building, token, t }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { talbainToololt } = useTalbainToololt(token, building._id);

  const stats = useMemo(() => {
    if (!talbainToololt || !Array.isArray(talbainToololt)) return { occupied: 0, vacant: 0, total: 1 };
    const occupied = talbainToololt.find(a => a._id === true)?.too || 0;
    const vacant = talbainToololt.find(a => a._id === false)?.too || 0;
    return { occupied, vacant, total: occupied + vacant || 1 };
  }, [talbainToololt]);

  const occupancyRate = ((stats.occupied / stats.total) * 100).toFixed(0);

  return (
    <GlassCard title={t("Талбайн ашиглалт")} icon={<HomeOutlined />} className="h-[350px]">
      <div className="flex flex-col items-center justify-center h-full pb-4">
         <div className="relative h-40 w-40 mb-4">
            <Doughnut data={{
              labels: [t("Идэвхтэй1"), t(" Идэвхгүй1")],
              datasets: [{
                data: [stats.occupied, stats.vacant],
                backgroundColor: ['#10b981', '#6366f1'],
                borderWidth: 0, cutout: '80%', borderRadius: 8, spacing: 3
              }]
            }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-800 dark:text-white">{occupancyRate}%</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">{t("Орсон")}</span>
            </div>
         </div>
         <div className="grid grid-cols-2 gap-3 w-full">
            <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
               <p className="text-[9px] font-bold text-slate-400 mb-0 uppercase">{t("Идэвхтэй1")}</p>
               <p className="text-base font-black text-emerald-600 mb-0">{stats.occupied}</p>
            </div>
            <div className="p-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-center">
               <p className="text-[9px] font-bold text-slate-400 mb-0 uppercase">{t("Идэвхгүй1")}</p>
               <p className="text-base font-black text-indigo-600 mb-0">{stats.vacant}</p>
            </div>
         </div>
      </div>
    </GlassCard>
  );
};

const BuildingRevenueTable = ({ building, token, t }) => {
  const { tailanGaralt, loading } = useTailan("borluulaltiinTailanAvya", token, {
    baiguullagiinId: building.baiguullagiinId, barilgiinId: building._id,
    ekhlekhOgnoo: moment().subtract(5, 'months').startOf('month').format('YYYY-MM-DD 00:00:00'),
    duusakhOgnoo: moment().endOf('month').format('YYYY-MM-DD 23:59:59'), nariivchlal: 'month'
  });

  const incomeData = useMemo(() => {
    if (!tailanGaralt || !tailanGaralt.labels) return [];
    const plannedDataset = tailanGaralt.datasets.find(d => d.label === "Төлөвлөгөө") || { data: [] };
    const completedDataset = tailanGaralt.datasets.find(d => d.label === "Гүйцэтгэл") || { data: [] };
    return tailanGaralt.labels.map((label, idx) => {
      const planned = Number(plannedDataset.data?.[idx] || 0);
      const completed = Number(completedDataset.data?.[idx] || 0);
      return { key: label, month: label, planned, actual: completed, percent: planned > 0 ? ((completed / planned) * 100).toFixed(0) : 0 };
    }).reverse();
  }, [tailanGaralt]);

  return (
    <GlassCard title={t("Төлбөрийн түүх")} icon={<BiMoneyWithdraw />} className="h-[400px] overflow-hidden">
      <div className="pt-1 md:pt-2">
        <Table 
          dataSource={incomeData} loading={loading} size="small" scroll={{ y: 220 }} pagination={false}
        className="premium-table"
        columns={[
          { title: t('Сар'), dataIndex: 'month', key: 'month', width: 60, render: (v) => <span className="font-bold text-slate-600 dark:text-slate-300 text-[9px] md:text-[10px]">{v}</span> },
          { 
            title: <div className="text-center w-full">{t('Орлого')}</div>, 
            dataIndex: 'actual', key: 'actual', align: 'right', 
            render: (v) => <span className="font-black text-emerald-600 text-[9px] md:text-[10px]">{formatNumber(v)}</span> 
          },
          { title: '%', dataIndex: 'percent', key: 'percent', align: 'center', width: 40, render: (v) => <Tag color={v >= 100 ? "green" : "orange"} borderless className="rounded-lg px-1 py-0 font-bold text-[8px] md:text-[9px] m-0">{v}%</Tag> },
        ]}
      />
      </div>
    </GlassCard>
  );
};

const VacancyFloorTable = ({ building, baiguullaga, token, t }) => {
  const { data: allSpaces, isValidating: loadingSpaces } = useSWR(
    !!token && !!building._id ? ["/talbai", building._id] : null,
    (u, bId) => uilchilgee(token).get(u, { params: { query: { baiguullagiinId: baiguullaga?._id, barilgiinId: bId }, khuudasniiKhemjee: 1000 } }).then(res => res.data)
  );

  const tableData = useMemo(() => {
    const spaces = allSpaces?.jagsaalt || [];
    const vacantSpaces = spaces.filter(s => s.idevkhiteiEsekh === false);
    const floorGroups = _.groupBy(vacantSpaces, 'davkhar');
    const floors = _.uniq(spaces.map(s => s.davkhar)).filter(f => f != null).sort((a,b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
    return floors.map(floor => ({
      key: floor, location: `${floor}-р давхар`, count: floorGroups[floor]?.length || 0, potential: (floorGroups[floor] || []).reduce((sum, s) => sum + (Number(s.sariinTurees) || 0), 0)
    }));
  }, [allSpaces]);

  return (
    <GlassCard title={t("Идэвхгүй талбайн мэдээлэл")} icon={<HomeOutlined />} className="h-[400px] overflow-hidden">
      <div className="pt-1 md:pt-2">
        <Table 
          dataSource={tableData} loading={loadingSpaces} size="small" scroll={{ y: 220 }} pagination={false}
        className="premium-table"
        columns={[
          { title: t('Давхар'), dataIndex: 'location', key: 'location', render: (v) => <span className="font-medium text-[9px] md:text-[11px]">{v}</span> },
          { title: t('Тоо2'), dataIndex: 'count', key: 'count', align: 'center', render: (v) => <Badge count={v} showZero color={v > 0 ? '#6366f1' : '#cbd5e1'} style={{ fontSize: '8px' }} /> },
          { title: t('Боломжит түрээс'), dataIndex: 'potential', key: 'potential', align: 'right', render: (v) => <span className="font-bold text-slate-800 dark:text-white text-[9px] md:text-[11px]">{formatNumber(v)}</span> },
        ]}
      />
      </div>
    </GlassCard>
  );
};

const BuildingSpaceTable = ({ building, baiguullaga, token, t }) => {
  const { talbainiiGaralt, isValidating } = useTalbai(token, baiguullaga?._id, { barilgiinId: building._id, idevkhiteiEsekh: { $in: [true, false] }, khuudasniiKhemjee: 1000 });
  return (
    <GlassCard title={t("Талбайн бүртгэл")} icon={<HomeOutlined />} className="h-[400px] overflow-hidden">
      <div className="pt-2">
        <Table 
          size="small" dataSource={talbainiiGaralt?.jagsaalt} loading={isValidating} 
          pagination={{ pageSize: 20, showSizeChanger: false }} scroll={{ x: 'max-content', y: 200 }}
        columns={[
          { title: <div className="text-center w-full text-[9px] md:text-[11px]">{t('Дугаар')}</div>, dataIndex: 'kod',  align:'left', key: 'kod', width: 90, render: (v) => <Tag className="rounded-lg font-black text-blue-600 bg-blue-50 border-blue-100 text-[9px] md:text-[10px] px-1 md:px-1.5">{v}</Tag> },
          { title: <div className="text-center w-full text-[9px] md:text-[11px]">{t('Давхар')}</div>, dataIndex: 'davkhar', key: 'davkhar', width: 60, align: 'center', render: (v) => <span className="text-[9px] md:text-[11px]">{v}</span> },
          { title: <div className="text-center w-full text-[9px] md:text-[11px]">{t('м2')}</div>, dataIndex: 'talbainKhemjee', align:'center', key: 'talbainKhemjee', width: 60, render: (v) => <span className="font-bold text-[9px] md:text-[11px]">{formatNumber(v)}</span> },
          { 
            title: <div className="text-center w-full text-[9px] md:text-[11px]">{t('Үнэ')}</div>, 
            dataIndex: 'talbainNiitUne', key: 'talbainNiitUne', align: 'right', width: 100,
            render: (v) => <span className="font-black text-slate-800 dark:text-white text-[9px] md:text-[11px]">₮{formatNumber(v)}</span> 
          },
          { 
            title: <span className="text-[9px] md:text-[11px]">{t('Төлөв')}</span>, dataIndex: 'idevkhiteiEsekh', align:'center', key: 'idevkhiteiEsekh', width: 80,
            render: (v) => (
              <Badge 
                status={v ? "success" : "default"} 
                text={<span className="text-[9px] md:text-[10px] text-slate-600 dark:text-slate-400">{v ? t("Идэвхтэй") : t("Идэвхгүй")}</span>} 
              />
            ) 
          }
        ]}
      />
      </div>
    </GlassCard>
  );
};

export default function BuildingDashboard() {
  const { token, baiguullaga, ajiltan, barilgiinId } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => { Aos.init({ duration: 1000 }); }, []);

  const selectedBuilding = useMemo(() => {
    const list = baiguullaga?.barilguud?.filter(a => !!ajiltan?.barilguud?.find(b => b === a._id) || ajiltan?.erkh === "Admin") || [];
    const bId = barilgiinId || router.query?.barilgiinId || router.query?.barilgaId;
    return list.find(b => b._id === bId) || list[0];
  }, [baiguullaga, ajiltan, barilgiinId, router.query]);

  if (!selectedBuilding) return null;

  return (
    <Admin khuudasniiNer="dashboard" title={t("Хяналтын самбар")}>
      <div className="col-span-12 flex flex-col h-[calc(100vh-70px)] w-full -mx-0 xl:-mx-1 -mt-2 text-black lg:rounded-2xl shadow-2xl relative animate-entrance overflow-y-auto backdrop-blur-md custom-scrollbar p-4 lg:p-6 space-y-8 pb-20">
        
        <BuildingStatsSummary baiguullaga={baiguullaga} building={selectedBuilding} token={token} t={t} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
           <BuildingIncomeChart baiguullaga={baiguullaga} building={selectedBuilding} token={token} t={t} />
           <BuildingOccupancyDoughnut building={selectedBuilding} token={token} t={t} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           <BuildingRevenueTable building={selectedBuilding} token={token} t={t} />
           <VacancyFloorTable building={selectedBuilding} baiguullaga={baiguullaga} token={token} t={t} />
           <BuildingSpaceTable building={selectedBuilding} baiguullaga={baiguullaga} token={token} t={t} />
        </div>
      </div>
    </Admin>
  );
}
