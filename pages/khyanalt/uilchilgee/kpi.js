import Admin from "components/Admin";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFsmSocket } from "hooks/useFsmSocket";
import { useAuth } from "services/auth";
import fsmApi from "services/fsmApi";
import standardApi from "services/uilchilgee";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { Button, Spin, message, Tooltip, Progress, Avatar } from "antd";
import { 
  ReloadOutlined, 
  TrophyOutlined, 
  UserOutlined, 
  CloseOutlined, 
  CheckSquareOutlined, 
  AreaChartOutlined 
} from "@ant-design/icons";

function DashboardCard({ id, title, icon, rightActions, children, headerClass = "border-teal-500" }) {
  return (
    <div
      id={id}
      className={`bg-white dark:bg-gray-900/50 rounded-2xl overflow-hidden shadow-sm border-t-[3px] ${headerClass} hover:shadow-teal-500/10 flex flex-col relative min-h-[340px] transition-all duration-300`}
    >
      <div className="flex justify-between items-center px-5 py-4 bg-teal-900/10 dark:bg-[#1b212f] border-b border-gray-100 dark:border-[#2d3748]/50 shrink-0">
        <div className="flex items-center gap-2.5 text-gray-800 dark:text-gray-200 font-extrabold text-[12.5px] tracking-wide uppercase">
          <span className="text-teal-500">{icon}</span> {title}
        </div>
        {rightActions && <div className="flex items-center">{rightActions}</div>}
      </div>
      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
}

function KPI() {
  const { t } = useTranslation();
  const { token, barilgiinId, ajiltan } = useAuth();
  const baiguullagiinId = ajiltan?.baiguullagiinId;
  
  const { isConnected, socket: fsmSocket } = useFsmSocket();
  const api = useMemo(() => fsmApi.withAuth(token), [token]);
  const isAdmin = ajiltan?.erkh === "Admin" || ajiltan?.erkh === "Manager";

  const [refreshingId, setRefreshingId] = useState(null);

  const { ajilchdiinGaralt, isValidating: loading, ajiltniiJagsaaltMutate } = useAjiltniiJagsaalt(token, baiguullagiinId, barilgiinId);
  
  const [realtimeKpi, setRealtimeKpi] = useState({});

  useEffect(() => {
    if (!token || !baiguullagiinId) return;
    const fetchInitialKpis = async () => {
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
    };
    fetchInitialKpis();
  }, [api, token, baiguullagiinId]);

  const users = useMemo(() => {
    const list = ajilchdiinGaralt?.jagsaalt || [];
    return list.map(u => ({
      ...u,
      ...(realtimeKpi[u._id] || {})
    }));
  }, [ajilchdiinGaralt, realtimeKpi]);

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

  const handleRefresh = async (userId) => {
    setRefreshingId(userId);
    try {
      const res = await api.post(`/users/${userId}/kpi/refresh`);
      if (res.data?.success) {
        const updated = res.data.data;
        setRealtimeKpi(prev => ({
          ...prev,
          [userId]: updated
        }));
        message.success("KPI амжилттай шинэчлэгдлээ");
      }
    } catch (err) {
      message.error("KPI шинэчлэхэд алдаа гарлаа");
    } finally {
      setRefreshingId(null);
    }
  };

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
  
  const topUser = topUsers[0];

  const statCards = [
    { title: "Нийт ажилтан", value: users.length.toString() },
    { title: "Дундаж KPI", value: `${avgKpi}%` },
    { title: "KPI > 80%", value: users.filter(u => (u.kpiHuvv ?? 0) >= 80).length.toString() },
    { title: "KPI < 40%", value: users.filter(u => (u.kpiHuvv ?? 0) < 40).length.toString() },
  ];

  return (
    <Admin title="KPI гүйцэтгэл" khuudasniiNer="kpi">
      <div className="col-span-12 flex flex-col xl:h-H7HalfRem w-full text-black overflow-hidden lg:rounded-2xl shadow-2xl relative animate-entrance p-4">
        
        <div id="cust-stats" className="hideScroll grid w-full grid-cols-1 gap-3 overflow-hidden overflow-x-auto py-3 sm:grid-cols-6 sm:p-0 md:gap-4 2xl:grid-cols-4 mb-6 shrink-0 px-1 pt-1 opacity-100">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`group relative w-full sm:w-auto cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-gray-300 dark:hover:shadow-gray-800 sm:col-span-12 lg:col-span-1 border-2 border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/40 animate-entrance-stagger-${Math.min(index + 1, 5)}`}
              >
              <div className="absolute inset-0 bg-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
              <div className="relative h-full rounded-2xl p-4 sm:p-5">
                <div className="flex h-full flex-col justify-between">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex flex-col">
                      <div className="mb-1 bg-gradient-to-r from-teal-900 to-teal-700 bg-clip-text text-3xl font-black text-transparent dark:from-teal-100 dark:to-teal-300 tabular-nums">
                        {card.value}
                      </div>
                      <div className="text-[11px] font-black text-teal-600 transition-colors duration-300 dark:text-teal-400 uppercase tracking-widest">
                        {card.title}
                      </div>
                    </div>
                  </div>
                  <div className="h-1 w-8 rounded-full bg-teal-500 transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
          <div className="lg:col-span-12 flex flex-col gap-6">
            <DashboardCard 
              title="Ажилтнуудын гүйцэтгэл" 
              headerClass="border-teal-500"
              
            >
              {loading && users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Spin size="large" className="teal-spinner" />
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Мэдээлэл татаж байна...</span>
                </div>
              ) : (
                <div className="space-y-4 max-h-[calc(75vh-200px)] overflow-y-auto">
                  {topUsers.map((user, i) => {
                    const pct = user.kpiHuvv ?? 0;
                    const color = pct >= 80 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
                    
                    return (
                      <div key={user._id} className="group flex items-center gap-5 px-5 py-4 rounded-3xl hover:bg-teal-50/30 dark:hover:bg-teal-900/10 border border-gray-100 dark:border-gray-800 hover:border-teal-200 dark:hover:border-teal-900 transition-all duration-300">
                        <div className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-sm font-black shadow-md bg-white dark:bg-gray-800 border-2"
                          style={{ borderColor: `${color}40`, color: color }}>
                          {i < 3 ? (i + 1) : (user.ner || "?").charAt(0).toUpperCase()}
                        </div>

                        <div className="flex flex-col flex-1 min-w-0 gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[14px] font-black text-gray-800 dark:text-gray-100 leading-none">
                                {user.ner || user.nevtrekhNer}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">
                                {user.albanTushaal || user.erkh}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-5">
                              <div className="flex flex-col items-end">
                                 <span className="text-lg font-black leading-none font-mono" style={{ color }}>{pct}%</span>
                                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Гүйцэтгэл</span>
                              </div>
                              
                            </div>
                          </div>

                          <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                             <div 
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                  width: `${pct}%`, 
                                  backgroundColor: color,
                                  boxShadow: `0 0 10px ${color}20`
                                }} 
                             />
                          </div>

                          <div className="flex items-center gap-5 text-[10px] font-black uppercase text-gray-400 tracking-tight">
                            <span className="flex items-center gap-1.5"><CheckSquareOutlined style={{ fontSize: 13 }} /> {user.kpiDaalgavarToo || 0} ажил</span>
                            <span className="flex items-center gap-1.5"><TrophyOutlined style={{ fontSize: 13 }} /> {user.kpiOnoo || 0} оноо</span>
                            <span className="flex items-center gap-1.5">• Дундаж {(user.kpiDundaj || 0).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </DashboardCard>
          </div>

          
        </div>
      </div>
    </Admin>
  );
}

export default KPI;
