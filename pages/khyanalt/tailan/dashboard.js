import Admin from "components/Admin";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/router";
import uilchilgee from "services/uilchilgee";
import { useAuth } from "services/auth";
import { Badge, Table, Row, Col, Select, Tag, Popover, Button, DatePicker } from "antd";
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

const GlassCard = ({ children, className = "", title, icon, extra }) => (
  <div className={`group relative overflow-hidden rounded-[1.5rem] bg-white/90 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}>
    {title && (
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-base">
              {icon}
            </div>
          )}
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">{title}</span>
        </div>
        {extra && <div className="flex items-center">{extra}</div>}
      </div>
    )}
    <div className="p-3 md:p-4">{children}</div>
  </div>
);

const SummaryCard = ({ title, value, icon, prefix = "₮", suffix = "₮", fixed = 2 }) => {
  const { t } = useTranslation();
  return (
    <div
      data-aos="fade-up"
      data-aos-duration="1000"
      className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-green-200 bg-green-50/60 dark:border-green-900 dark:bg-green-950/40 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105"
    >
      <div className="flex items-center gap-6 p-8">
        <div className="flex-shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            {React.cloneElement(icon, { size: 32, className: "text-2xl" })}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">
              {fixed === 0 ? value : formatNumber(value, fixed)}
            </span>
            <span className="text-lg font-bold text-green-600">{suffix}</span>
          </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
      <SummaryCard title={t("Орлого1")} value={currentActual} suffix="₮" icon={<BiMoneyWithdraw />} index={0} />
      <SummaryCard title={t("Гэрээ1")} value={contractCount} suffix="" fixed={0} icon={<FileTextOutlined />} index={1} />
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
      { 
        type: 'bar', 
        label: t('Төлөвлөгөө'), 
        data: tailanGaralt?.datasets?.find(d => d.label === "Төлөвлөгөө")?.data || [], 
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.2)', 
        borderRadius: 4, 
        barThickness: 12 
      },
      { 
        type: 'line', 
        label: t('Гүйцэтгэл'), 
        data: tailanGaralt?.datasets?.find(d => d.label === "Гүйцэтгэл")?.data || [], 
        borderColor: '#10b981', 
        backgroundColor: 'transparent', 
        fill: false, 
        tension: 0.4, 
        borderWidth: 2, 
        pointRadius: 3,
        pointBackgroundColor: '#10b981',
      }
    ]
  };

  return (
    <GlassCard title={t("Санхүүгийн гүйцэтгэл")} icon={<RiseOutlined />} className="h-[350px]">
      <div className="h-[270px]">
        <Bar data={chartData} options={{ 
          responsive: true, maintainAspectRatio: false, 
          interaction: { mode: 'index', intersect: false },
          plugins: { 
            legend: { display: true, position: 'top', align: 'end', labels: { boxWidth: 6, usePointStyle: true, font: { size: 10 } } },
            datalabels: { display: false },
            tooltip: { 
              cornerRadius: 8, padding: 8, mode: 'index', intersect: false,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += formatNumber(context.parsed.y);
                  }
                  return label;
                }
              }
            } 
          },
          scales: { 
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }, 
            y: { 
              beginAtZero: true, 
              grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, 
              ticks: { 
                font: { size: 10 },
                callback: function(value) {
                  if (value >= 1000000000) return (value / 1000000000).toFixed(1) + 'B';
                  if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                  if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
                  return value;
                }
              } 
            } 
          }
        }} />
      </div>
    </GlassCard>
  );
};

const BuildingOccupancyDoughnut = ({ building, token, t }) => {
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
      <div className="flex flex-col md:flex-row items-center justify-around h-full gap-4 px-2">
         <div className="relative h-44 w-44 flex-shrink-0">
            <Doughnut data={{
              labels: [t("Идэвхтэй1"), t(" Идэвхгүй1")],
              datasets: [{
                data: [stats.occupied, stats.vacant],
                backgroundColor: ['#10b981', '#6366f1'],
                hoverBackgroundColor: ['#059669', '#4f46e5'],
                borderWidth: 0, cutout: '75%', borderRadius: 4, spacing: 2, 
                hoverOffset: 8
              }]
            }} options={{ 
              maintainAspectRatio: false, 
              interaction: { mode: 'index', intersect: false },
              plugins: { 
                legend: { display: false }, 
                tooltip: { 
                  enabled: true, 
                  mode: 'index', 
                  intersect: false,
                  cornerRadius: 8,
                  padding: 8
                } 
              } 
            }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl text-slate-800 dark:text-white leading-none tracking-tighter">{occupancyRate}%</span>
              <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{t("Дүүргэлт")}</span>
            </div>
         </div>

         <div className="flex-1 w-full max-w-[200px] space-y-4">
            <div className="space-y-1">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t("Нийт талбай")}</span>
                  <span className="text-lg text-slate-700 dark:text-white leading-none">{stats.total}</span>
               </div>
               <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400" style={{ width: '100%' }} />
               </div>
            </div>

            <div className="space-y-1">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] text-emerald-500 uppercase tracking-wider">{t("Идэвхтэй1")}</span>
                  <span className="text-lg text-emerald-600 leading-none">{stats.occupied}</span>
               </div>
               <div className="h-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(stats.occupied / stats.total) * 100}%` }} />
               </div>
            </div>

            <div className="space-y-1">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] text-indigo-500 uppercase tracking-wider">{t("Идэвхгүй1")}</span>
                  <span className="text-lg text-indigo-600 leading-none">{stats.vacant}</span>
               </div>
               <div className="h-1 bg-indigo-50 dark:bg-indigo-950/30 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${(stats.vacant / stats.total) * 100}%` }} />
               </div>
            </div>
         </div>
      </div>
    </GlassCard>
  );
};

const BuildingRevenueTable = ({ building, token, t }) => {
  const [dateRange, setDateRange] = useState([moment().subtract(5, 'months').startOf('month'), moment().endOf('month')]);

  const { tailanGaralt, loading } = useTailan("borluulaltiinTailanAvya", token, {
    baiguullagiinId: building.baiguullagiinId, barilgiinId: building._id,
    ekhlekhOgnoo: dateRange[0].format('YYYY-MM-DD 00:00:00'),
    duusakhOgnoo: dateRange[1].format('YYYY-MM-DD 23:59:59'), nariivchlal: 'month'
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
    <GlassCard 
      title={t("Төлбөрийн түүх")} 
      icon={<BiMoneyWithdraw />} 
      className="h-[380px]"
      extra={
        <DatePicker.RangePicker 
          size="small"
          value={dateRange}
          onChange={(dates) => dates && setDateRange(dates)}
          className="w-48 text-[11px]"
          allowClear={false}
        />
      }
    >
      <Table 
        dataSource={incomeData} loading={loading} size="small" scroll={{ x: 'max-content', y: 260 }} pagination={false}
        className="premium-table"
        columns={[
          { title: t('Сар'), dataIndex: 'month', key: 'month', width: 80, align: 'center', render: (v) => <span className="text-slate-700 dark:text-slate-200 text-xs">{v}</span> },
          { 
            title: <div className="text-center w-full">{t('Орлого')}</div>, 
            dataIndex: 'actual', key: 'actual', align: 'right', width: 120,
            render: (v) => <span className="text-emerald-600 text-[13px]">{formatNumber(v)}</span> 
          },
          { title: '%', dataIndex: 'percent', key: 'percent', align: 'center', width: 60, render: (v) => <Tag color={v >= 100 ? "green" : "orange"} className="rounded-md font-medium text-[11px] m-0 border-none">{v}%</Tag> },
        ]}
      />
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
      key: floor, location: `${floor}-р давхар`, count: floorGroups[floor]?.length || 0, potential: (floorGroups[floor] || []).reduce((sum, s) => sum + (Number(s.talbainNiitUne) || Number(s.sariinTurees) || 0), 0)
    }));
  }, [allSpaces]);

  return (
    <GlassCard title={t("Идэвхгүй талбайн мэдээлэл")} icon={<HomeOutlined />} className="h-[380px]">
      <Table 
        dataSource={tableData} loading={loadingSpaces} size="small" scroll={{ x: 'max-content', y: 260 }} pagination={false}
        className="premium-table"
        columns={[
          { title: t('Давхар'), dataIndex: 'location', align: 'center', key: 'location', width: 100, 
            render: (v) => <span className="text-slate-700 dark:text-slate-200 text-xs">{v}</span> },
          { title: t('Тоо2'), dataIndex: 'count', key: 'count', align: 'center', width: 60, render: (v) => <Badge count={v} showZero color={v > 0 ? '#6366f1' : '#cbd5e1'} style={{ fontSize: '11px' }} /> },
          { 
            title: <div className="text-center w-full">{t('Боломжит түрээс')}</div>, 
            dataIndex: 'potential', key: 'potential', align: 'right', width: 120,
            render: (v) => <span className="text-slate-800 dark:text-white text-[13px]">{formatNumber(v)}</span> 
          },
        ]}
      />
    </GlassCard>
  );
};

const BuildingSegmentsTables = ({ building, baiguullaga, token, t }) => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  const query = { barilgiinId: building._id, idevkhiteiEsekh: { $in: [true, false] }, khuudasniiKhemjee: 5000 };
  if (dateRange && dateRange[0] && dateRange[1]) {
    query.createdAt = { 
      $gte: dateRange[0].startOf('day').toISOString(),
      $lte: dateRange[1].endOf('day').toISOString()
    };
  }

  const { talbainiiGaralt, isValidating } = useTalbai(token, baiguullaga?._id, query);
  
  const groupedBySegment = useMemo(() => {
    const spaces = talbainiiGaralt?.jagsaalt || [];
    const groups = {};
    spaces.forEach(space => {
       if (space.segmentuud && space.segmentuud.length > 0) {
         space.segmentuud.forEach(seg => {
           if (!seg) return;
           const segmentName = seg.ner || t('Бусад');
           if (!groups[segmentName]) groups[segmentName] = [];
           groups[segmentName].push(space);
         });
       } else {
         const segmentName = t('Бусад');
         if (!groups[segmentName]) groups[segmentName] = [];
         groups[segmentName].push(space);
       }
    });
    return groups;
  }, [talbainiiGaralt, t]);

  const segmentOptions = useMemo(() => {
    return [
      { label: t('Бүгд'), value: 'all' },
      ...Object.keys(groupedBySegment).map(k => ({ label: k, value: k }))
    ];
  }, [groupedBySegment, t]);

  const dataSource = useMemo(() => {
    if (selectedSegment === 'all') {
      const allSpaces = [];
      Object.values(groupedBySegment).forEach(arr => allSpaces.push(...arr));
      return _.uniqBy(allSpaces, '_id');
    }
    return groupedBySegment[selectedSegment] || [];
  }, [selectedSegment, groupedBySegment]);

  return (
    <GlassCard 
      title={t("Талбайн бүртгэл")} 
      icon={<HomeOutlined />} 
      className="h-[380px]"
      extra={
        <div className="flex items-center gap-2">
          <DatePicker.RangePicker 
            size="small"
            className="w-48 text-[11px]"
            onChange={(dates) => setDateRange(dates)}
          />
          <Select
            size="small"
            value={selectedSegment}
            onChange={setSelectedSegment}
            options={segmentOptions}
            className="w-32 text-[11px]"
          />
        </div>
      }
    >
      <Table 
        size="small" dataSource={dataSource} loading={isValidating} 
        pagination={{ pageSize: 15, showSizeChanger: false, size: 'small' }} scroll={{ x: 'max-content', y: 220 }}
        className="premium-table"
        columns={[
          { title: t('Код'), dataIndex: 'kod', key: 'kod', width: 70, render: (v) => <span className="font-bold text-xs">{v}</span> },
          { title: 'm2', dataIndex: 'talbainKhemjee', align:'center', key: 'talbainKhemjee', width: 50, render: (v) => <span className="font-medium text-xs">{formatNumber(v)}</span> },
          { 
            title: <div className="text-center w-full">{t('Үнэ')}</div>, 
            dataIndex: 'talbainNiitUne', key: 'talbainNiitUne', align: 'right', width: 90,
            render: (v) => <span className="text-slate-800 dark:text-white text-[13px]">{formatNumber(v)}</span> 
          },
          { 
            title: t('Төлөв'), dataIndex: 'idevkhiteiEsekh', align:'center', key: 'idevkhiteiEsekh', width: 70,
            render: (v) => <Badge status={v ? "success" : "default"} text={<span className="text-[12px] dark:text-white">{v ? t("Идэвхтэй") : t("Идэвхгүй")}</span>} />
          }
        ]}
      />
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
      <div className="col-span-12 flex flex-col h-[calc(100vh-80px)] w-full -mx-0 xl:-mx-1 text-black animate-entrance overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 pb-20">
        
        <BuildingStatsSummary baiguullaga={baiguullaga} building={selectedBuilding} token={token} t={t} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
           <BuildingIncomeChart baiguullaga={baiguullaga} building={selectedBuilding} token={token} t={t} />
           <BuildingOccupancyDoughnut building={selectedBuilding} token={token} t={t} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
           <BuildingRevenueTable building={selectedBuilding} token={token} t={t} />
           <VacancyFloorTable building={selectedBuilding} baiguullaga={baiguullaga} token={token} t={t} />
           <BuildingSegmentsTables building={selectedBuilding} baiguullaga={baiguullaga} token={token} t={t} />
        </div>
      </div>
    </Admin>
  );
}
