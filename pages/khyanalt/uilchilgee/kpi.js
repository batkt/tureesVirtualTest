import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFsmSocket } from "hooks/useFsmSocket";
import { useAuth } from "services/auth";
import fsmApi from "services/fsmApi";
import useJagsaalt from "hooks/useJagsaalt";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import { Button, Spin, message, Tooltip, Progress, Avatar } from "antd";
import { 
  ReloadOutlined, 
  TrophyOutlined, 
  UserOutlined, 
  CloseOutlined, 
  CheckSquareOutlined, 
  AreaChartOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  BarChartOutlined,
  PieChartOutlined,
  StarOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  FireOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined
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
import { toast } from "sonner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

function DashboardCard({ id, title, icon, rightActions, children, headerClass="border-green-500", noScroll=false }) {
  return (
    <div id={id} className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border-t-[3px] ${headerClass} hover:shadow-emerald-500 dark:hover:shadow-emerald-500/10 flex flex-col relative min-h-[260px] h-[400px]`}>
      <div className="flex justify-between items-center px-4 py-3 bg-blue-900/10 dark:bg-gray-900 border-b border-gray-100 dark:border-[#2d3748]/50 shrink-0">
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-bold text-[12.5px]  uppercase">
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
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [realtimeKpi, setRealtimeKpi] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const tutorialSteps = [
    { targetId: "khyanalt-stats", title: t("Нийт статистик"), description: "Танай байгууллагын нийт ажилтнуудын хангасан онооны дундаж болон тэргүүлж буй ажилтныг энд харуулна." },
    { targetId: "kpi-distribution", title: t("Хуваарилалт"), description: "Нийт ажилчдын KPI хэрхэн хуваарилагдаж байгааг эндээс харах боломжтой." },
    { targetId: "kpi-top-users", title: t("Шилдэг гүйцэтгэл"), description: "Хамгийн өндөр KPI-тай шилдэг ажилчдын мэдээлэл." },
    { targetId: "kpi-users-list", title: t("Ажилчдын жагсаалт"), description: "Танай багийн бүх гишүүд болон тэдний дэлгэрэнгүй KPI-г эндээс харна." }
  ];

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

  const fetchTasks = useCallback(async () => {
    if (!barilgiinId || !baiguullagiinId) return;
    setLoadingTasks(true);
    try {
      const res = await api.get("/tasks", { params: { barilgiinId, baiguullagiinId } });
      const rawList = res.data?.data || res.data || [];
      
      // Unique tasks by sourceTaskId or _id
      const tasksMap = new Map();
      rawList.forEach(task => {
        const id = task.sourceTaskId || task._id;
        if (!tasksMap.has(id) || new Date(task.updatedAt) > new Date(tasksMap.get(id).updatedAt)) {
          tasksMap.set(id, task);
        }
      });
      setTasks(Array.from(tasksMap.values()));
    } catch (err) {
      console.error("Fetch tasks failed:", err);
    } finally {
      setLoadingTasks(false);
    }
  }, [api, barilgiinId, baiguullagiinId]);

  useEffect(() => {
    fetchInitialKpis();
    fetchTasks();
  }, [fetchInitialKpis, fetchTasks]);

  useEffect(() => {
    if (isConnected && fsmSocket && baiguullagiinId) {
      fsmSocket.emit("join_baiguullaga", { baiguullagiinId });
    }
  }, [isConnected, fsmSocket, baiguullagiinId]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchInitialKpis(),
      fetchTasks(),
      ajiltniiJagsaaltMutate()
    ]);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Мэдээлэл шинэчлэгдлээ");
    }, 500);
  };

  const handleSystemRefresh = async () => {
    if (!baiguullagiinId) return;
    setIsRefreshing(true);
    try {
      const res = await api.post(`/baiguullaga/${baiguullagiinId}/kpi/refresh`);
      if (res.data?.success) {
        await Promise.all([
          fetchInitialKpis(),
          fetchTasks(),
          ajiltniiJagsaaltMutate()
        ]);
        toast.success(res.data.message || "Гүйцэтгэлийн үзүүлэлтүүд бүрэн шинэчлэгдлээ");
      }
    } catch (err) {
      console.error("System refresh failed:", err);
      toast.error("Шинэчлэл хийхэд алдаа гарлаа");
    } finally {
      setIsRefreshing(false);
    }
  };

  const isTaskOnDay = useCallback((task, day) => {
    if (!task || !day) return false;
    const targetDay = dayjs(day).startOf('day');
    
    // Check if it's a looping task (Daily)
    const isLoop = task.isLoop === true || task.isLoop === 'true';
    const startOgnoo = task.ekhlekhOgnoo || task.ekhlekhTsag;
    const endOgnoo   = task.duusakhOgnoo || task.duusakhTsag;
    
    if (isLoop && startOgnoo && endOgnoo) {
      const start = dayjs(startOgnoo).startOf('day');
      const end   = dayjs(endOgnoo).startOf('day');
      return targetDay.isSameOrAfter(start) && targetDay.isSameOrBefore(end);
    }
    
    // Check if it's a multi-day task
    if (startOgnoo && endOgnoo) {
      const start = dayjs(startOgnoo).startOf('day');
      const end   = dayjs(endOgnoo).startOf('day');
      return targetDay.isSameOrAfter(start) && targetDay.isSameOrBefore(end);
    }
    
    // Fallback to single date
    const taskDate = task.ekhlekhTsag || task.ekhlekhOgnoo || task.createdAt;
    return dayjs(taskDate).isSame(targetDay, 'day');
  }, []);

  const users = useMemo(() => {
    const list = usersList || [];
    const today = dayjs();
    return list.map(u => {
      const backendKpi = realtimeKpi[u._id] || {};
      
      const userTasks = tasks.filter(t => 
        t.hariutsagchId === u._id || (t.ajiltnuud && t.ajiltnuud.includes(u._id))
      );
      
      const todayTasks = userTasks.filter(t => isTaskOnDay(t, today));
      const doneTotal = userTasks.filter(t => t.tuluv === 'duussan' || t.tuluv === 'shalga').length;
      const totalPoints = userTasks.reduce((sum, t) => sum + (t.onoo || 0), 0);
      const calculatedKpiHuvv = userTasks.length > 0 
        ? Math.round((doneTotal / userTasks.length) * 100) 
        : 0;

      return {
        ...u,
        ...backendKpi,
        todayTaskCount: todayTasks.length,
        kpiDaalgavarToo: doneTotal,
        kpiOnoo: totalPoints > 0 ? totalPoints : (backendKpi.kpiOnoo || 0),
        kpiHuvv: userTasks.length > 0 ? calculatedKpiHuvv : (backendKpi.kpiHuvv || 0)
      };
    });
  }, [usersList, realtimeKpi, tasks]);

  useEffect(() => {
    if (!fsmSocket) return;
    const kpiHandler = (data) => {
      setRealtimeKpi(prev => ({
        ...prev,
        [data.userId]: { ...prev[data.userId], ...data }
      }));
    };
    
    const taskHandler = () => {
      fetchTasks();
    };

    fsmSocket.on("kpi_updated", kpiHandler);
    fsmSocket.on("task_updated", taskHandler);
    fsmSocket.on("task_created", taskHandler);
    fsmSocket.on("task_deleted", taskHandler);
    
    return () => {
      fsmSocket.off("kpi_updated", kpiHandler);
      fsmSocket.off("task_updated", taskHandler);
      fsmSocket.off("task_created", taskHandler);
      fsmSocket.off("task_deleted", taskHandler);
    };
  }, [fsmSocket, fetchTasks]);

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
        <GuidedTour 
          steps={tutorialSteps} 
          isOpen={isTutorialOpen} 
          onClose={() => setIsTutorialOpen(false)} 
        />
        <div className="flex-1 flex flex-col p-3 md:p-4 overflow-x-hidden relative min-w-0">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[14px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-tight"></h2>
            <Button
                shape="circle"
                icon={<QuestionCircleOutlined />}
                onClick={() => setIsTutorialOpen(true)}
                className="text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border-none shadow-sm flex items-center justify-center shrink-0 transition-colors"
                title={t("Тусламж")}
              />
          </div>

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
                        <div className="text-[12px] font-bold text-emerald-600 transition-colors duration-300 dark:text-emerald-400 uppercase tracking-tighter">
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
              
              <div className="md:col-span-2 xl:col-span-1" id="kpi-distribution">
                <DashboardCard title="KPI хуваарилалт" icon={<BarChartOutlined />} headerClass="border-green-500" noScroll={true}>
                  <div className="h-full w-full">
                    <Bar key={`dist-${users.length}`} data={distributionData} options={chartOptions} />
                  </div>
                </DashboardCard>
              </div>

              <div className="md:col-span-1 xl:col-span-1" id="kpi-top-users">
                <DashboardCard title="Шилдэг гүйцэтгэл" icon={<PieChartOutlined />} headerClass="border-green-500" noScroll={true}>
                  <div className="h-full flex flex-col justify-center gap-4">
                    <div className="h-44 w-full relative">
                      <Doughnut key={`top5-${topUsers.length}`} data={doughnutData} options={{...chartOptions, cutout: '70%'}} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-bold text-gray-800 dark:text-gray-100 lining-nums">{avgKpi}%</span>
                        <span className="text-[12px] font-bold text-gray-400 uppercase">ДУНДАЖ</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 px-2">
                      {topUsers.slice(0, 5).map((user, i) => (
                        <div key={user._id} className="flex items-center justify-between text-[12px] font-bold">
                          <span className="text-gray-500 truncate max-w-[100px]">{user.ner || user.nevtrekhNer}</span>
                          <span className="text-gray-800 dark:text-gray-100">{user.kpiHuvv}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </DashboardCard>
              </div>

              <div className="md:col-span-2 xl:col-span-1" id="kpi-users-list">
                <DashboardCard 
                  title="Ажилчдын үзүүлэлт" 
                  icon={<TeamOutlined/>}
                  headerClass="border-green-500"
                  
                >
                  {loading && users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                      <Spin size="large" />
                      <span className="text-[12px] font-bold text-gray-40">Уншиж байна</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {topUsers.map((user, i) => {
                        const pct = user.kpiHuvv ?? 0;
                        const color = pct >= 80 ? '#10b981' : pct >= 40 ? '#3b82f6' : '#ef4444';
                        
                        return (
                          <div key={user._id} className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all w-full">
                            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold shadow-sm"
                              style={{ background: `${color}15`, border: `1.5px solid ${color}40`, color: color }}>
                              {i < 3 ? (i + 1) : (user.ner || "?").charAt(0).toUpperCase()}
                            </div>

                            <div className="flex flex-col flex-1 min-w-0 gap-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200 truncate leading-none">
                                  {user.ner || user.nevtrekhNer}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[12px] font-bold px-1.5 py-0.5 rounded-md border tabular-nums"
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

                              <div className="flex items-center gap-3 text-[12px] font-bold text-gray-400 uppercase tracking-tight">
                                <span className="flex items-center gap-1"><CheckSquareOutlined /> {user.todayTaskCount || 0} өнөөдөр</span>
                                <span className="flex items-center gap-1"><CheckCircleOutlined className="text-[10px]" /> {user.kpiDaalgavarToo || 0} нийт</span>
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
                        <span className="text-[12px] font-bold uppercase ">Шилдэг ажилтан</span>
                      </div>
                      {topUsers[0] ? (
                        <div className="flex items-center gap-3">
                          <Avatar size="small" className="bg-indigo-500 text-white font-bold text-[12px]">{topUsers[0].ner?.charAt(0)}</Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[12px] font-bold text-gray-800 dark:text-gray-100 truncate">{topUsers[0].ner}</span>
                            <span className="text-[12px] font-bold text-indigo-500">{topUsers[0].kpiHuvv}% амжилт</span>
                          </div>
                        </div>
                      ) : "--"}
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2 items-start">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 shrink-0">
                          <RiseOutlined className="text-[12px]" />
                        </div>
                        <p className="text-[12px] font-bold text-gray-600 dark:text-gray-400 leading-tight">
                          Багийн дундаж KPI {avgKpi}% байна. Гүйцэтгэл тогтвортой байна.
                        </p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-sky-500 shrink-0">
                          <InfoCircleOutlined className="text-[12px]" />
                        </div>
                        <p className="text-[12px] font-bold text-gray-600 dark:text-gray-400 leading-tight">
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
                      className="mt-2 text-[12px] font-bold uppercase tracking-[0.2em] h-8 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                    >
                      Шинэчлэх
                    </Button>
                  </div>
                </DashboardCard>
              </div> */}

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="col-span-1 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between hover:border-b-emerald-600 hover:border-l-emerald-600 group hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <CrownOutlined className="text-yellow-400 text-xl" />
                    <span className="text-[12px] font-bold text-gray-400 uppercase ">Шилдэг гүйцэтгэгч</span>
                  </div>
                  {topUsers[0] ? (
                    <div className="flex items-center gap-4">
                     <Avatar size="medium" className="bg-gradient-to-tr from-green-300 to-gray-500 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold border border-white dark:border-gray-800 shadow-xl">
                                           <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                                         </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-lg font-bold dark:text-white truncate leading-tight">{topUsers[0].ner || topUsers[0].nevtrekhNer}</span>
                        <span className="text-[12px] font-bold opacity-80 dark:text-gray-500">{topUsers[0].albanTushaal || "Ажилтан"}</span>
                      </div>
                    </div>
                  ) : <span className="text-sm font-bold">Одоогоор байхгүй</span>}
                </div>
                <div className="relative z-10 mt-6 flex items-end justify-between ">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold tabular-nums dark:text-green-500 text-green-600">{topUsers[0]?.kpiHuvv || 0}%</span>
                    <span className="text-[12px] font-bold uppercase opacity-60 dark:text-gray-500 text-gray-600">KPI {t("Гүйцэтгэл")}</span>
                  </div>
                  {/* <Button size="small" ghost className="border-white/40 hover:bg-white/10 text-[12px] font-bold uppercase  h-7 rounded-lg">Профайл</Button> */}
                </div>
              </div>

              <div className="col-span-1 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between group transition-all hover:border-b-emerald-600 hover:border-l-emerald-600 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckSquareOutlined className="text-emerald-500 text-xl" />
                    <span className="text-[12px] font-bold text-gray-400 uppercase ">Ажлын мастер</span>
                  </div>
                  {(() => {
                    const master = [...users].sort((a,b) => (b.kpiDaalgavarToo || 0) - (a.kpiDaalgavarToo || 0))[0];
                    return master ? (
                      <div className="flex items-center gap-4">
                        <Avatar size="medium" className="bg-gradient-to-tr from-green-300 to-gray-500 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold border border-white dark:border-gray-800 shadow-xl">
                          <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-lg font-bold dark:text-white truncate leading-tight">{master.ner || master.nevtrekhNer}</span>
                          <span className="text-[12px] font-bold opacity-80 dark:text-gray-500">{master.albanTushaal || "Ажилтан"}</span>
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
                        <span className="text-2xl font-bold tabular-nums text-emerald-500">{master?.kpiDaalgavarToo || 0}</span>
                        <span className="text-[12px] font-bold uppercase opacity-60 dark:text-gray-500 text-gray-600">Нийт дууссан ажил</span>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="col-span-1 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between hover:border-b-emerald-600 hover:border-l-emerald-600 group hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ThunderboltOutlined className="text-amber-500 text-xl" />
                    <span className="text-[12px] font-bold text-gray-400 uppercase ">Онооны тэргүүлэгч</span>
                  </div>
                  {(() => {
                    const leader = [...users].sort((a,b) => (b.kpiOnoo || 0) - (a.kpiOnoo || 0))[0];
                    return leader ? (
                      <div className="flex items-center gap-4">
                        <Avatar size="medium" className="bg-gradient-to-tr from-green-300 to-gray-500 dark:from-gray-700 dark:to-gray-800  text-gray-600 dark:text-gray-300 text-xs font-bold border border-white dark:border-gray-800 shadow-xl">
                          <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-lg font-bold dark:text-white truncate leading-tight">{leader.ner || leader.nevtrekhNer}</span>
                          <span className="text-[12px] font-bold opacity-80 dark:text-gray-500">{leader.albanTushaal || "Ажилтан"}</span>
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
                        <span className="text-2xl font-bold tabular-nums text-amber-500">{leader?.kpiOnoo || 0}</span>
                        <span className="text-[12px] font-bold uppercase opacity-60 dark:text-gray-500 text-gray-600">Нийт оноо</span>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="col-span-1 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between group hover:-translate-y-2 hover:scale-105 hover:border-b-emerald-600 hover:border-l-emerald-600 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all relative overflow-hidden">
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <RiseOutlined className="text-blue-500 text-xl" />
                    <span className="text-[12px] font-bold text-gray-400 uppercase ">Багийн Төлөв</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      {(() => {
                        const aboveAvgCount = users.filter(u => (u.kpiDaalgavarToo || 0) > 0 && (u.kpiHuvv || 0) >= avgKpi).length;
                        return (
                          <>
                            <span className="text-2xl font-bold text-blue-500 tabular-nums">{aboveAvgCount}</span>
                            <span className="text-sm font-bold text-gray-400">/ {users.length}</span>
                          </>
                        );
                      })()}
                    </div>
                    <span className="text-[12px] font-bold text-gray-400 uppercase mt-1">Дундажаас дээш ажилтан</span>
                    </div>
                </div>
                <div className="mt-4 flex flex-col gap-1.5">
                   <div className="flex items-center justify-between text-[12px] font-bold">
                     <span className="text-gray-400 uppercase">Тогтвортой байдал</span>
                     <span className="text-blue-500">
                      {avgKpi === 0 ? "Одоогоор үнэлгээгүй" : (avgKpi >= 80 ? "Маш сайн" : avgKpi >= 50 ? "Үр дүнтэй" : "Сайжруулах")}
                     </span>
                   </div>
                   <Progress percent={avgKpi} size="small" showInfo={false} strokeColor="#3b82f6" trailColor="rgba(59, 130, 246, 0.1)" />
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
