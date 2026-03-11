import Admin from "components/Admin";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFsmSocket } from "hooks/useFsmSocket";
import { useAuth } from "services/auth";
import fsmApi from "services/fsmApi";
import useJagsaalt from "hooks/useJagsaalt";
import { Button, Spin, message, Tooltip, Progress, Avatar } from "antd";
import { 
  ReloadOutlined, 
  TrophyOutlined, 
  UserOutlined, 
  CloseOutlined, 
  CheckSquareOutlined, 
  AreaChartOutlined,
  TeamOutlined,
  BarChartOutlined,
  PieChartOutlined,
  StarOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  FireOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

function DashboardCard({ id, title, icon, rightActions, children, headerClass="border-emerald-500", noScroll=false }) {
  return (
    <div id={id} className={`bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden shadow-sm border-t-[3px] ${headerClass} hover:shadow-emerald-500 dark:hover:shadow-emerald-500/10 flex flex-col relative min-h-[260px] h-[400px]`}>
      <div className="flex justify-between items-center px-4 py-3 bg-blue-900/10 dark:bg-gray-900 border-b border-gray-100 dark:border-[#2d3748]/50 shrink-0">
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-extrabold text-[12.5px] tracking-wide uppercase">
          <span className="text-gray-400 dark:text-gray-300">{icon}</span> {title}
        </div>
        {rightActions && <div className="flex items-center">{rightActions}</div>}
      </div>
      <div className={`p-4 flex-1 ${noScroll ? "" : "overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600"}`}>
        {children}
      </div>
    </div>
  )
}

function KPI() {
  const { t } = useTranslation();
  const { token, barilgiinId, ajiltan } = useAuth();
  const baiguullagiinId = ajiltan?.baiguullagiinId;
  
  const { isConnected, socket: fsmSocket } = useFsmSocket();
  const api = useMemo(() => fsmApi.withAuth(token), [token]);

  const ajiltanJagsaalt = useJagsaalt("/ajiltan");
  const { jagsaalt: usersList, isValidating: loading, mutate: ajiltniiJagsaaltMutate } = ajiltanJagsaalt;
  const [realtimeKpi, setRealtimeKpi] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInitialKpis = useCallback(async () => {
    if (!token || !baiguullagiinId) return;
    try {
      const res = await api.get(`/baiguullaga/${baiguullagiinId}/kpi`);
      if (res.data?.success) {
        const kpiMap = {};
        res.data.data.forEach(item => {
          kpiMap[item._id] = item;
        });
        setRealtimeKpi(kpiMap);
      }
    } catch (err) {
      console.error("Initial KPI fetch failed:", err);
    }
  }, [api, token, baiguullagiinId]);

  useEffect(() => {
    fetchInitialKpis();
  }, [fetchInitialKpis]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchInitialKpis(),
      ajiltniiJagsaaltMutate()
    ]);
    setTimeout(() => {
      setIsRefreshing(false);
      message.success("Мэдээлэл шинэчлэгдлээ");
    }, 500);
  };

  const users = useMemo(() => {
    const list = usersList || [];
    return list.map(u => ({
      ...u,
      ...(realtimeKpi[u._id] || {})
    }));
  }, [usersList, realtimeKpi]);

  useEffect(() => {
    if (!fsmSocket) return;
    const handler = (data) => {
      setRealtimeKpi(prev => ({
        ...prev,
        [data.userId]: { ...prev[data.userId], ...data }
      }));
    };
    fsmSocket.on("kpi_updated", handler);
    return () => fsmSocket.off("kpi_updated", handler);
  }, [fsmSocket]);

  const avgKpi = useMemo(() => {
    const withKpi = users.filter((u) => (u.kpiDaalgavarToo ?? 0) > 0);
    if (!withKpi.length) return 0;
    return Math.round(
      withKpi.reduce((sum, u) => sum + (u.kpiHuvv ?? 0), 0) / withKpi.length
    );
  }, [users]);

  const topUsers = useMemo(
    () => [...users].sort((a, b) => (b.kpiHuvv ?? 0) - (a.kpiHuvv ?? 0)),
    [users]
  );

  const distributionData = useMemo(() => {
    const ranges = [0, 0, 0, 0, 0];
    users.forEach(u => {
      const pct = u.kpiHuvv ?? 0;
      if (pct <= 20) ranges[0]++;
      else if (pct <= 40) ranges[1]++;
      else if (pct <= 60) ranges[2]++;
      else if (pct <= 80) ranges[3]++;
      else ranges[4]++;
    });
    return {
      labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
      datasets: [
        {
          label: 'Ажилтны тоо',
          data: ranges,
          backgroundColor: [
            'rgba(239, 68, 68, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            '#3b82f6',
            '#10b981',
            '#14b8a6',
          ],
          borderRadius: 4,
          borderWidth: 0,
        },
      ],
    };
  }, [users]);

  const doughnutData = useMemo(() => {
    const slice = topUsers.slice(0, 5);
    return {
      labels: slice.map(u => u.ner || u.nevtrekhNer),
      datasets: [
        {
          data: slice.map(u => u.kpiHuvv || 0),
          backgroundColor: [
            '#14b8a6',
            '#10b981',
            '#3b82f6',
            '#f59e0b',
            '#8b5cf6',
          ],
          hoverOffset: 15,
          borderWidth: 0,
          spacing: 5,
        },
      ],
    };
  }, [topUsers]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9, weight: 'bold' } } },
      y: { grid: { color: 'rgba(0,0,0,0.05)', borderDash: [2] }, ticks: { font: { size: 9 }, stepSize: 1 } }
    }
  };

  const statCards = [
    { title: "Нийт ажилтан", value: users.length, icon: <TeamOutlined /> },
    { title: "Дундаж KPI", value: `${avgKpi}%`, icon: <RiseOutlined /> },
    { title: "KPI > 80%", value: users.filter(u => (u.kpiHuvv ?? 0) >= 80).length, icon: <TrophyOutlined /> },
    { title: "KPI < 40%", value: users.filter(u => (u.kpiHuvv ?? 0) < 40).length, icon: <FireOutlined /> },
  ];

  return (
    <Admin title="KPI гүйцэтгэл" khuudasniiNer="kpi">
      <div className="col-span-12 flex flex-col xl:flex-row h-auto xl:h-[calc(100vh-110px)] w-full -mx-0 xl:-mx-1 -mt-2 text-black overflow-hidden lg:rounded-2xl shadow-2xl relative animate-entrance">
        
        <div className="flex-1 flex flex-col p-3 md:p-4 overflow-x-hidden relative min-w-0">
          
          <div id="khyanalt-stats" className="hideScroll grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 shrink-0 pt-1">
            {statCards.map((card, index) => (
              <div
                key={index}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10 border-2 border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/40 col-span-1 animate-entrance-stagger-${Math.min(index + 1, 5)}`}
              >
                <div className="absolute inset-0 bg-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

                <div className="relative h-full rounded-2xl p-3 sm:p-2.5">
                  <div className="flex h-full flex-col justify-between">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <div className="mb-0.5 bg-gradient-to-r from-emerald-900 to-emerald-700 bg-clip-text text-3xl font-bold text-transparent dark:from-emerald-100 dark:to-emerald-300 lining-nums">
                          {card.value}
                        </div>
                        <div className="text-[11px] font-extrabold text-emerald-600 transition-colors duration-300 dark:text-emerald-400 uppercase tracking-tighter">
                          {card.title}
                        </div>
                      </div>
                      <div className="text-emerald-500/30 text-xl group-hover:scale-110 group-hover:text-emerald-500 transition-all duration-500">
                        {card.icon}
                      </div>
                    </div>
                    <div className="h-0.5 w-0 rounded-full bg-emerald-500 transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-100 dark:[&::-webkit-scrollbar-thumb]:bg-slate-800">
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              
              <div className="md:col-span-2 xl:col-span-1">
                <DashboardCard title="KPI Тархалт" icon={<BarChartOutlined />} headerClass="border-sky-500" noScroll={true}>
                  <div className="h-full w-full">
                    <Bar key={`dist-${users.length}`} data={distributionData} options={chartOptions} />
                  </div>
                </DashboardCard>
              </div>

              <div className="md:col-span-1 xl:col-span-1">
                <DashboardCard title="Топ 5 Гүйцэтгэл" icon={<PieChartOutlined />} headerClass="border-amber-500" noScroll={true}>
                  <div className="h-full flex flex-col justify-center gap-4">
                    <div className="h-44 w-full relative">
                      <Doughnut key={`top5-${topUsers.length}`} data={doughnutData} options={{...chartOptions, cutout: '70%'}} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-black text-gray-800 dark:text-gray-100 lining-nums">{avgKpi}%</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase">Дундаж</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 px-2">
                      {topUsers.slice(0, 5).map((user, i) => (
                        <div key={user._id} className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-gray-500 truncate max-w-[100px]">{user.ner || user.nevtrekhNer}</span>
                          <span className="text-gray-800 dark:text-gray-100">{user.kpiHuvv}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </DashboardCard>
              </div>

              <div className="md:col-span-2 xl:col-span-1">
                <DashboardCard 
                  title="Ажилтнуудын гүйцэтгэл" 
                  icon={<TeamOutlined/>}
                  headerClass="border-indigo-500"
                >
                  {loading && users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                      <Spin size="large" />
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Уншиж байна...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {topUsers.map((user, i) => {
                        const pct = user.kpiHuvv ?? 0;
                        const color = pct >= 80 ? '#10b981' : pct >= 40 ? '#3b82f6' : '#ef4444';
                        
                        return (
                          <div key={user._id} className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all w-full">
                            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black shadow-sm"
                              style={{ background: `${color}15`, border: `1.5px solid ${color}40`, color: color }}>
                              {i < 3 ? (i + 1) : (user.ner || "?").charAt(0).toUpperCase()}
                            </div>

                            <div className="flex flex-col flex-1 min-w-0 gap-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200 truncate leading-none">
                                  {user.ner || user.nevtrekhNer}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md border tabular-nums"
                                    style={{ 
                                      backgroundColor: `${color}15`, 
                                      color: color, 
                                      borderColor: `${color}30` 
                                    }}>
                                    {pct}% KPI
                                  </span>
                                </div>
                              </div>
                              
                              <div className="h-[4px] w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
                                <div 
                                  className="h-full transition-all duration-1000 ease-out"
                                  style={{ 
                                    width: `${pct}%`, 
                                    background: color
                                  }} 
                                />
                              </div>

                              <div className="flex items-center gap-3 text-[8px] font-bold text-gray-400 uppercase tracking-tight">
                                <span className="flex items-center gap-1"><CheckSquareOutlined /> {user.kpiDaalgavarToo || 0} ажил</span>
                                <span className="flex items-center gap-1" style={{ color }}><TrophyOutlined /> {user.kpiOnoo || 0} оноо</span>
                                <span className="ml-auto opacity-60">{user.albanTushaal || user.erkh}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </DashboardCard>
              </div>
              

              {/* <div className="md:col-span-1 xl:col-span-1">
                <DashboardCard title="Мэдээлэл" icon={<ThunderboltOutlined />} headerClass="border-yellow-500">
                  <div className="flex flex-col gap-4">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
                      <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300">
                        <StarOutlined className="text-[12px]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Шилдэг ажилтан</span>
                      </div>
                      {topUsers[0] ? (
                        <div className="flex items-center gap-3">
                          <Avatar size="small" className="bg-indigo-500 text-white font-black text-[10px]">{topUsers[0].ner?.charAt(0)}</Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-black text-gray-800 dark:text-gray-100 truncate">{topUsers[0].ner}</span>
                            <span className="text-[9px] font-bold text-indigo-500">{topUsers[0].kpiHuvv}% амжилт</span>
                          </div>
                        </div>
                      ) : "--"}
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2 items-start">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 shrink-0">
                          <RiseOutlined className="text-[12px]" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 leading-tight">
                          Багийн дундаж KPI {avgKpi}% байна. Гүйцэтгэл тогтвортой байна.
                        </p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-sky-500 shrink-0">
                          <InfoCircleOutlined className="text-[12px]" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 leading-tight">
                          {users.filter(u => (u.kpiHuvv ?? 0) >= 80).length} ажилтан 80%-иас дээш амжилттай байна.
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      block 
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={handleManualRefresh}
                      loading={isRefreshing}
                      className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] h-8 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                    >
                      Шинэчлэх
                    </Button>
                  </div>
                </DashboardCard>
              </div> */}

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="col-span-1 bg-white dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between hover:border-b-emerald-600 hover:border-l-emerald-600 group hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <CrownOutlined className="text-yellow-400 text-xl" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Шилдэг Гүйцэтгэл</span>
                  </div>
                  {topUsers[0] ? (
                    <div className="flex items-center gap-4">
                     <Avatar size="medium" className="bg-gradient-to-tr from-green-300 to-gray-500 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-black border border-white dark:border-gray-800 shadow-xl">
                                           <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                                         </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-lg font-black dark:text-white truncate leading-tight">{topUsers[0].ner || topUsers[0].nevtrekhNer}</span>
                        <span className="text-[11px] font-bold opacity-80 dark:text-gray-500">{topUsers[0].albanTushaal || "Ажилтан"}</span>
                      </div>
                    </div>
                  ) : <span className="text-sm font-bold">Одоогоор байхгүй</span>}
                </div>
                <div className="relative z-10 mt-6 flex items-end justify-between ">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black tabular-nums dark:text-green-500 text-green-600">{topUsers[0]?.kpiHuvv || 0}%</span>
                    <span className="text-[8px] font-bold uppercase opacity-60 dark:text-gray-500 text-gray-600">KPI Амжилт</span>
                  </div>
                  {/* <Button size="small" ghost className="border-white/40 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest h-7 rounded-lg">Профайл</Button> */}
                </div>
              </div>

              <div className="col-span-1 bg-white dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between group transition-all hover:border-b-emerald-600 hover:border-l-emerald-600 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckSquareOutlined className="text-emerald-500 text-xl" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ажлын Мастер</span>
                  </div>
                  {(() => {
                    const master = [...users].sort((a,b) => (b.kpiDaalgavarToo || 0) - (a.kpiDaalgavarToo || 0))[0];
                    return master ? (
                      <div className="flex items-center gap-4">
                        <Avatar size="medium" className="bg-gradient-to-tr from-green-300 to-gray-500 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-black border border-white dark:border-gray-800 shadow-xl">
                          <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-lg font-black dark:text-white truncate leading-tight">{master.ner || master.nevtrekhNer}</span>
                          <span className="text-[11px] font-bold opacity-80 dark:text-gray-500">{master.albanTushaal || "Ажилтан"}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm font-bold">Одоогоор байхгүй</span>
                    );
                  })()}
                </div>
                <div className="relative z-10 mt-6 flex flex-col">
                  {(() => {
                    const master = [...users].sort((a,b) => (b.kpiDaalgavarToo || 0) - (a.kpiDaalgavarToo || 0))[0];
                    return (
                      <>
                        <span className="text-2xl font-black tabular-nums text-emerald-500">{master?.kpiDaalgavarToo || 0}</span>
                        <span className="text-[8px] font-bold uppercase opacity-60 dark:text-gray-500 text-gray-600">Нийт дуусгасан ажил</span>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="col-span-1 bg-white dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between hover:border-b-emerald-600 hover:border-l-emerald-600 group hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ThunderboltOutlined className="text-amber-500 text-xl" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Онооны Лидер</span>
                  </div>
                  {(() => {
                    const leader = [...users].sort((a,b) => (b.kpiOnoo || 0) - (a.kpiOnoo || 0))[0];
                    return leader ? (
                      <div className="flex items-center gap-4">
                        <Avatar size="medium" className="bg-gradient-to-tr from-green-300 to-gray-500 dark:from-gray-700 dark:to-gray-800  text-gray-600 dark:text-gray-300 text-xs font-black border border-white dark:border-gray-800 shadow-xl">
                          <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-lg font-black dark:text-white truncate leading-tight">{leader.ner || leader.nevtrekhNer}</span>
                          <span className="text-[11px] font-bold opacity-80 dark:text-gray-500">{leader.albanTushaal || "Ажилтан"}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm font-bold">Одоогоор байхгүй</span>
                    );
                  })()}
                </div>
                <div className="relative z-10 mt-6 flex flex-col">
                  {(() => {
                    const leader = [...users].sort((a,b) => (b.kpiOnoo || 0) - (a.kpiOnoo || 0))[0];
                    return (
                      <>
                        <span className="text-2xl font-black tabular-nums text-amber-500">{leader?.kpiOnoo || 0}</span>
                        <span className="text-[8px] font-bold uppercase opacity-60 dark:text-gray-500 text-gray-600">Нийт цуглуулсан оноо</span>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="col-span-1 bg-white dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between group hover:-translate-y-2 hover:scale-105 hover:border-b-emerald-600 hover:border-l-emerald-600 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all relative overflow-hidden">
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <RiseOutlined className="text-blue-500 text-xl" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Багийн Төлөв</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-blue-500 tabular-nums">{users.filter(u => (u.kpiHuvv || 0) >= avgKpi).length}</span>
                      <span className="text-sm font-bold text-gray-400">/ {users.length}</span>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase mt-1">Дундажаас дээш ажилтан</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-1.5">
                   <div className="flex items-center justify-between text-[10px] font-black">
                     <span className="text-gray-400 uppercase">Тогтвортой байдал</span>
                     <span className="text-blue-500">Үр дүнтэй</span>
                   </div>
                   <Progress percent={75} size="small" showInfo={false} strokeColor="#3b82f6" trailColor="rgba(59, 130, 246, 0.1)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export default KPI;
