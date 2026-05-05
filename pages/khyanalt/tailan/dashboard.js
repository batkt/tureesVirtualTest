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
  DownloadOutlined,
  PrinterOutlined,
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
  <div className={`glass-card group relative overflow-hidden rounded-[1.5rem] bg-white/90 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}>
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
        {extra && <div className="hide-on-print flex items-center">{extra}</div>}
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

  const actualData = tailanGaralt?.datasets?.find(d => d.label === "actual")?.data || [];
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
        data: tailanGaralt?.datasets?.find(d => d.label === "plan")?.data || [], 
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.2)', 
        borderRadius: 4, 
        barThickness: 12 
      },
      { 
        type: 'line', 
        label: t('Гүйцэтгэл'), 
        data: tailanGaralt?.datasets?.find(d => d.label === "actual")?.data || [], 
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

const BuildingOccupancyDoughnut = ({ building, token, t, selectedSegment = 'all', dateRange, baiguullaga }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const chartRef = React.useRef(null);

  const { talbainToololt } = useTalbainToololt(token, building._id);

  const query = { barilgiinId: building._id, idevkhiteiEsekh: { $in: [true, false] }, khuudasniiKhemjee: 5000 };
  if (dateRange && dateRange[0] && dateRange[1]) {
    query.createdAt = { 
      $gte: dateRange[0].startOf('day').toISOString(),
      $lte: dateRange[1].endOf('day').toISOString()
    };
  }

  const { talbainiiGaralt } = useTalbai(token, baiguullaga?._id, query);

  const stats = useMemo(() => {
    let spaces = talbainiiGaralt?.jagsaalt;
    
    if (!spaces) {
      if (!talbainToololt || !Array.isArray(talbainToololt)) return { occupied: 0, vacant: 0, total: 1, actualTotal: 0 };
      const occupied = talbainToololt.find(a => a._id === true)?.too || 0;
      const vacant = talbainToololt.find(a => a._id === false)?.too || 0;
      const tTotal = occupied + vacant;
      return { occupied, vacant, total: tTotal || 1, actualTotal: tTotal };
    }

    if (selectedSegment !== 'all') {
      spaces = spaces.filter(space => {
        if (!space.segmentuud || space.segmentuud.length === 0) {
          return selectedSegment === t('Бусад');
        }
        return space.segmentuud.some(seg => (seg?.ner || t('Бусад')) === selectedSegment);
      });
    }

    const occupied = spaces.filter(s => s.idevkhiteiEsekh === true).length;
    const vacant = spaces.filter(s => s.idevkhiteiEsekh === false).length;
    const actualTotal = occupied + vacant;
    return { occupied, vacant, total: actualTotal || 1, actualTotal };
  }, [talbainiiGaralt, selectedSegment, t, talbainToololt]);

  const occupancyRate = ((stats.occupied / stats.total) * 100).toFixed(0);

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

  const chartData = useMemo(() => {
    if (selectedSegment === 'all') {
      const labels = [];
      const data = [];
      const bgColors = [];
      const customData = [];
      
      const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
      
      Object.keys(groupedBySegment).forEach((segName, segIndex) => {
         const segColor = colors[segIndex % colors.length];
         const segSpaces = groupedBySegment[segName];
         const occupied = segSpaces.filter(s => s.idevkhiteiEsekh === true).length;
         const vacant = segSpaces.filter(s => s.idevkhiteiEsekh === false).length;
         const count = segSpaces.length;
         
         labels.push(segName);
         data.push(count);
         bgColors.push(segColor);
         customData.push({
           segmentName: segName,
           occupied,
           vacant,
           count
         });
      });
      
      return {
        labels,
        datasets: [{
          data,
          backgroundColor: bgColors,
          borderWidth: 1,
          borderColor: isDark ? '#1e293b' : '#ffffff',
          hoverOffset: 8,
          cutout: '75%',
          customData
        }]
      };
    } else {
      const spaces = groupedBySegment[selectedSegment] || [];
      const occupied = spaces.filter(s => s.idevkhiteiEsekh === true).length;
      const vacant = spaces.filter(s => s.idevkhiteiEsekh === false).length;
      
      const allSegments = Object.keys(groupedBySegment);
      const segIndex = allSegments.indexOf(selectedSegment);
      const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
      const segColor = colors[Math.max(0, segIndex) % colors.length];

      return {
        labels: [t("Идэвхтэй"), t("Идэвхгүй")],
        datasets: [{
          data: [occupied, vacant],
          backgroundColor: ['#10b981', '#6366f1'],
          borderWidth: 1,
          borderColor: isDark ? '#1e293b' : '#ffffff',
          hoverOffset: 8,
          cutout: '75%',
          customData: [
            { segmentName: t("Идэвхтэй"), count: occupied },
            { segmentName: t("Идэвхгүй"), count: vacant }
          ]
        }]
      };
    }
  }, [selectedSegment, groupedBySegment, isDark, t]);


  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: { display: false },
      tooltip: {
        enabled: true,
        cornerRadius: 8,
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        callbacks: {
          label: function(context) {
            const dataset = chartData.datasets[context.datasetIndex];
            const customData = dataset?.customData;
            if (selectedSegment === 'all') {
              if (customData && customData[context.dataIndex]) {
                 const dataItem = customData[context.dataIndex];
                 return [
                   `${t("Идэвхтэй")}: ${dataItem.occupied}`,
                   `${t("Идэвхгүй")}: ${dataItem.vacant}`
                 ];
              }
            } else {
              return ` ${context.raw}`;
            }
            return ` ${context.raw || 0}`;
          }
        }
      }
    }
  };

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <GlassCard title={t("Талбайн ашиглалт")} icon={<HomeOutlined />} className="h-[350px]">
      <div className="flex flex-col md:flex-row items-center justify-around h-full gap-4 px-2">
         <div className="relative h-44 w-44 flex-shrink-0">
            {chartData.datasets[0]?.data?.length > 0 ? (
               <Doughnut ref={chartRef} data={chartData} options={chartOptions} className="relative z-10" />
            ) : (
               <Doughnut ref={chartRef} data={{
                 labels: [t("Идэвхтэй"), t("Идэвхгүй")],
                 datasets: [{
                   data: [stats.occupied, stats.vacant],
                   backgroundColor: ['#10b981', '#6366f1'],
                   hoverBackgroundColor: ['#059669', '#4f46e5'],
                   borderWidth: 0, cutout: '75%', borderRadius: 4, spacing: 2, 
                   hoverOffset: 8
                 }]
               }} options={{ 
                 maintainAspectRatio: false, 
                 plugins: { 
                   legend: { display: false }, 
                   datalabels: { display: false },
                   tooltip: { 
                     enabled: true, 
                     cornerRadius: 8,
                     padding: 10,
                     backgroundColor: 'rgba(0, 0, 0, 0.9)',
                     titleFont: { size: 13, weight: 'bold' },
                     bodyFont: { size: 12 },
                   } 
                 } 
               }} className="relative z-10" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
               <span className="text-3xl text-slate-800 dark:text-white leading-none tracking-tighter">{occupancyRate}%</span>
               <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{t("Дүүргэлт")}</span>
            </div>
         </div>

         <div className="flex-1 w-full max-w-[200px] space-y-4">
            <div className="space-y-1">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t("Нийт талбай")}</span>
                  <span className="text-lg text-slate-700 dark:text-white leading-none">{stats.actualTotal}</span>
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
    const plannedDataset = tailanGaralt.datasets.find(d => d.label === "plan") || { data: [] };
    const completedDataset = tailanGaralt.datasets.find(d => d.label === "actual") || { data: [] };
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
      key: floor, location: t("floor_count", { count: floor }), count: floorGroups[floor]?.length || 0, potential: (floorGroups[floor] || []).reduce((sum, s) => sum + (Number(s.talbainNiitUne) || Number(s.sariinTurees) || 0), 0)
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

const BuildingSegmentsTables = ({ building, baiguullaga, token, t, selectedSegment, setSelectedSegment, dateRange, setDateRange, isPrinting }) => {

  const query = { barilgiinId: building._id, idevkhiteiEsekh: { $in: [true, false] }, khuudasniiKhemjee: 5000 };
  
  const { talbainiiGaralt, isValidating } = useTalbai(token, baiguullaga?._id, query);
  
  const groupedBySegment = useMemo(() => {
    let spaces = talbainiiGaralt?.jagsaalt || [];
    
    // Filter by date range on the frontend
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = moment(dateRange[0]).startOf('day');
      const end = moment(dateRange[1]).endOf('day');
      spaces = spaces.filter(space => {
        if (!space.createdAt) return true;
        const created = moment(space.createdAt);
        return created >= start && created <= end;
      });
    }

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
  }, [talbainiiGaralt, t, dateRange]);

  const segmentOptions = useMemo(() => {
    return [
      { label: t('Бүгд'), value: 'all' },
      ...Object.keys(groupedBySegment).map(k => ({ label: k, value: k }))
    ];
  }, [groupedBySegment, t]);

  const aggregatedDataSource = useMemo(() => {
    let result = [];
    
    const segmentsToProcess = selectedSegment === 'all' 
      ? Object.keys(groupedBySegment) 
      : [selectedSegment];

    segmentsToProcess.forEach(segName => {
      const spaces = groupedBySegment[segName] || [];
      
      const activeSpaces = spaces.filter(s => s.idevkhiteiEsekh === true);
      const inactiveSpaces = spaces.filter(s => s.idevkhiteiEsekh === false);
      
      if (activeSpaces.length > 0) {
        const totalM2 = activeSpaces.reduce((sum, s) => sum + (Number(s.talbainKhemjee) || 0), 0);
        const totalPrice = activeSpaces.reduce((sum, s) => sum + (Number(s.talbainNiitUne) || 0), 0);
        result.push({
          key: `${segName}-active`,
          segmentName: segName,
          totalM2,
          totalPrice,
          status: true,
          count: activeSpaces.length
        });
      }
      
      if (inactiveSpaces.length > 0) {
        const totalM2 = inactiveSpaces.reduce((sum, s) => sum + (Number(s.talbainKhemjee) || 0), 0);
        const totalPrice = inactiveSpaces.reduce((sum, s) => sum + (Number(s.talbainNiitUne) || 0), 0);
        result.push({
          key: `${segName}-inactive`,
          segmentName: segName,
          totalM2,
          totalPrice,
          status: false,
          count: inactiveSpaces.length
        });
      }
    });
    
    return result;
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
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            allowClear={false}
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
        size="small" dataSource={aggregatedDataSource} loading={isValidating} 
        pagination={isPrinting ? false : { pageSize: 15, showSizeChanger: false, size: 'small' }} scroll={{ x: 'max-content', y: isPrinting ? undefined : 220 }}
        className="premium-table"
        columns={[
          { title: t('Төрөл'), dataIndex: 'segmentName', key: 'segmentName', width: 100, render: (v) => <span className="font-bold text-[12px]">{v}</span> },
          { title: 'm2', dataIndex: 'totalM2', align:'center', key: 'totalM2', width: 60, render: (v) => <span className="font-medium text-[12px]">{formatNumber(v)}</span> },
          { 
            title: <div className="text-center w-full">{t('Үнэ')}</div>, 
            dataIndex: 'totalPrice', key: 'totalPrice', align: 'right', width: 90,
            render: (v) => <span className="text-slate-800 dark:text-white text-[13px]">{formatNumber(v)}</span> 
          },
          { 
            title: t('Төлөв'), dataIndex: 'status', align:'center', key: 'status', width: 80,
            render: (v) => <Badge status={v ? "success" : "default"} text={<span className="text-[12px] dark:text-white">{v ? t("Идэвхтэй") : t("Идэвхгүй")}</span>} />
          },
          { title: t('Тоо'), dataIndex: 'count', align:'center', key: 'count', width: 50, render: (v) => <span className="text-[12px] text-slate-500">{v}</span> }
        ]}
      />
    </GlassCard>
  );
};

export default function BuildingDashboard() {
  const { token, baiguullaga, ajiltan, barilgiinId } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [dateRange, setDateRange] = useState([moment().subtract(6, 'months').startOf('month'), moment().endOf('month')]);
  const [isPrinting, setIsPrinting] = useState(false);
  const dashboardRef = React.useRef(null);

  useEffect(() => { Aos.init({ duration: 1000 }); }, []);

  const selectedBuilding = useMemo(() => {
    const list = baiguullaga?.barilguud?.filter(a => !!ajiltan?.barilguud?.find(b => b === a._id) || ajiltan?.erkh === "Admin") || [];
    const bId = barilgiinId || router.query?.barilgiinId || router.query?.barilgaId;
    return list.find(b => b._id === bId) || list[0];
  }, [baiguullaga, ajiltan, barilgiinId, router.query]);

  const handlePrintPage = () => {
    setIsPrinting(true);
    // Wait for state to update and re-render
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleExportAllExcel = () => {
    // Gather all visible table data from the page
    const tables = dashboardRef.current?.querySelectorAll('table') || [];
    let csv = '';
    
    tables.forEach((table, tableIdx) => {
      // Get table section title from closest GlassCard
      const card = table.closest('.group');
      const titleEl = card?.querySelector('span.text-\\[11px\\]');
      const sectionTitle = titleEl?.textContent || t("Хүснэгт") + ` ${tableIdx + 1}`;
      csv += `\n${sectionTitle}\n`;

      const rows = table.querySelectorAll('tr');
      rows.forEach((row) => {
        const cells = row.querySelectorAll('th, td');
        const rowData = [];
        cells.forEach((cell) => {
          let text = cell.textContent?.trim() || '';
          // Escape commas and quotes for CSV
          if (text.includes(',') || text.includes('"')) {
            text = `"${text.replace(/"/g, '""')}"`;
          }
          rowData.push(text);
        });
        csv += rowData.join(',') + '\n';
      });
      csv += '\n';
    });

    if (!csv.trim()) {
      csv = t('Мэдээлэл байхгүй байна');
    }

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_${selectedBuilding?.ner || 'report'}_${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!selectedBuilding) return null;

  return (
    <Admin khuudasniiNer="dashboard" title={t("Хяналтын самбар")}>
      <style jsx global>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }

        @media print {
          /* Hide EVERYTHING in the body except the dashboard */
          body {
            visibility: hidden;
            background: white !important;
          }
          
          .print-container, .print-container * {
            visibility: visible;
          }

          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: auto !important;
            padding: 5mm !important;
            margin: 0 !important;
            zoom: 0.8; 
            background: white !important;
          }

          /* Explicitly hide Admin UI elements that might still be taking up space */
          nav, aside, header, footer, 
          .ant-layout-sider, .ant-layout-header,
          #garchig, .ant-btn, .ant-select, .ant-picker, .hide-on-print {
            display: none !important;
          }

          .glass-card {
            break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #eee !important;
            margin-bottom: 0 !important;
            background: white !important;
          }

          .glass-card * {
            color: black !important;
          }

          .grid {
            display: grid !important;
            gap: 12px !important;
          }

          .grid.grid-cols-1.md\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .grid.grid-cols-1.xl\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .grid.grid-cols-1.xl\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }

          /* Tables should not scroll */
          .premium-table .ant-table-body, 
          .premium-table .ant-table-content {
            max-height: none !important;
            overflow: visible !important;
          }

          /* Force light mode */
          .dark .glass-card, .dark .print-container {
            background: white !important;
            border-color: #eee !important;
            color: black !important;
          }

          canvas {
            max-width: 100% !important;
            height: auto !important;
          }
        }
      `}</style>
      <div ref={dashboardRef} className="print-container col-span-12 flex flex-col h-[calc(100vh-80px)] w-full -mx-0 xl:-mx-1 text-black animate-entrance overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 pb-20">
        
        <div className="flex justify-end items-center hide-on-print -mb-4">
          <div className="flex items-center gap-2">
            <Button 
              icon={<PrinterOutlined />} 
              onClick={handlePrintPage}
              className="flex items-center gap-1.5 rounded-xl border-slate-200 dark:border-slate-700 text-slate-500 hover:!text-emerald-600 hover:!border-emerald-400"
            >
              <span className="hidden sm:inline text-xs">{t("Хэвлэх")}</span>
            </Button>
            
          </div>
        </div>

        <BuildingStatsSummary baiguullaga={baiguullaga} building={selectedBuilding} token={token} t={t} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
           <BuildingIncomeChart baiguullaga={baiguullaga} building={selectedBuilding} token={token} t={t} />
           <BuildingOccupancyDoughnut building={selectedBuilding} token={token} t={t} selectedSegment={selectedSegment} dateRange={dateRange} baiguullaga={baiguullaga} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
           <BuildingRevenueTable building={selectedBuilding} token={token} t={t} />
           <VacancyFloorTable building={selectedBuilding} baiguullaga={baiguullaga} token={token} t={t} />
           <BuildingSegmentsTables 
             building={selectedBuilding} 
             baiguullaga={baiguullaga} 
             token={token} 
             t={t} 
             selectedSegment={selectedSegment} 
             setSelectedSegment={setSelectedSegment} 
             dateRange={dateRange} 
             setDateRange={setDateRange} 
             isPrinting={isPrinting}
           />
        </div>
      </div>
    </Admin>
  );
}
