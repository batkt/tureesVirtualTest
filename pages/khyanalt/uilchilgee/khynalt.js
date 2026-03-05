import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from 'react-dom';
import fsmApi from "services/fsmApi";
import { useAuth } from "services/auth";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import useJagsaalt from "hooks/useJagsaalt";
import moment from "moment";
import "moment/locale/mn";
moment.locale("mn");
import { 
  PlusOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  PrinterOutlined,
  CloseOutlined,
  SearchOutlined,
  DownOutlined,
  EditOutlined,
  ExpandOutlined,
  PaperClipOutlined,
  FileTextOutlined,
  TeamOutlined,
  MessageOutlined,
  RocketOutlined,
  CheckSquareOutlined,
  EllipsisOutlined,
  VideoCameraOutlined,
  FieldTimeOutlined,
  PictureOutlined,
  AudioOutlined,
  MoreOutlined,
  SendOutlined,
  LikeOutlined,
  SmileOutlined,
  RiseOutlined,
  RightOutlined,
  SettingOutlined,
  AreaChartOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { 
  Button, 
  Select, 
  Space,
  Dropdown,
  Avatar,
  Modal,
  DatePicker
} from "antd";
import { useFsmSocket } from "hooks/useFsmSocket";

function DashboardCard({ id, title, icon, rightActions, children, headerClass="border-emerald-500" }) {
  return (
    <div id={id} className={`bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden shadow-sm border-t-[3px] ${headerClass} hover:shadow-emerald-500 dark:hover:shadow-emerald-500/10 flex flex-col relative min-h-[300px] h-[340px]`}>
      <div className="flex justify-between items-center px-4 py-3 bg-blue-900/10 dark:bg-[#1b212f] border-b border-gray-100 dark:border-[#2d3748]/50 shrink-0">
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-extrabold text-[12.5px] tracking-wide">
          <span className="text-gray-400 dark:text-gray-300">{icon}</span> {title}
        </div>
        
      </div>
      <div className="p-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
        {children}
      </div>
    </div>
  )
}

function Khynalt() {
  
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1280 : true);
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [baraas, setBaraas] = useState([]);
  const [uilchluulegchid, setUilchluulegchid] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const ajiltanJagsaalt = useJagsaalt("/ajiltan");
  
  const { token, barilgiinId, ajiltan } = useAuth();
  const baiguullagiinId = ajiltan?.baiguullagiinId;
  const api = useMemo(() => fsmApi.withAuth(token), [token]);

  const fetchData = useCallback(async () => {
    if (!barilgiinId) return;
    setLoading(true);
    setLoadingHistory(true);
    setLoadingProjects(true);
    try {
      const [tRes, bRes, uRes, pRes, hRes] = await Promise.all([
        api.get("/tasks", { params: { barilgiinId, baiguullagiinId } }),
        api.get("/baraas", { params: { barilgiinId, baiguullagiinId } }),
        api.get("/uilchluulegch", { params: { barilgiinId, baiguullagiinId } }),
        api.get("/projects", { params: { barilgiinId, baiguullagiinId } }),
        api.get("/task-tuukh", { params: { barilgiinId } })
      ]);
      setTasks(tRes.data?.data || (Array.isArray(tRes.data) ? tRes.data : []));
      setBaraas(bRes.data?.data || (Array.isArray(bRes.data) ? bRes.data : []));
      setUilchluulegchid(uRes.data?.data || (Array.isArray(uRes.data) ? uRes.data : []));
      setProjects(pRes.data?.data || (Array.isArray(pRes.data) ? pRes.data : []));
      setHistory(hRes.data?.data || (Array.isArray(hRes.data) ? hRes.data : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingHistory(false);
      setLoadingProjects(false);
    }
  }, [barilgiinId, baiguullagiinId, api]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const { isConnected } = useFsmSocket();

  useEffect(() => {
    if (isConnected) {
      const handleRefresh = () => fetchData();
      
    }
  }, [isConnected, fetchData]);
  
  const statCards = [
    { title: "Нийт ажил", value: tasks.length.toString() },
    { title: "Дууссан ажил", value: tasks.filter(t => t.tuluv === "duussan" || t.tuluv === "duussan").length.toString() },
    { title: "Нийт үйлчлүүлэгч", value: uilchluulegchid.length.toString() },
    { title: "Бараа материал", value: baraas.length.toString() },
    { title: "Яаралтай", value: tasks.filter(t => t.zereglel === "yaraltai" || t.zereglel === "nen yaraltai").length.toString() },
    { title: "Идэвхтэй ажилтан", value: ajiltan ? "1" : "0" },
  ];

  const teamMembers = useMemo(() => {
    return ajiltanJagsaalt?.jagsaalt?.map(a => ({
      id: a._id,
      name: a.ner || a.nevtrekhNer,
      role: a.erkh || "Ажилтан"
    })) || [];
  }, [ajiltanJagsaalt?.jagsaalt]);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

  useEffect(() => {
    if (isTutorialOpen && tutorialSteps[currentTutorialStep]?.targetId === "khyanalt-team") {
      setIsRightPanelExpanded(true);
    }
  }, [isTutorialOpen, currentTutorialStep]);

  const tutorialSteps = [
    { targetId: "khyanalt-stats", title: "Статистик", description: "Дээд хэсэгт байрлах картууд нь таны бизнесийн гол үзүүлэлтүүдийг (нийт ажил, дууссан ажил, бараа материал) шууд харуулна." },
    { targetId: "khyanalt-status-chart", title: "Даалгаврын төлөв", description: "Дугуй диаграмм нь нийт гүйцэтгэлийг харуулна. Цэнхэр өнгөөр дууссан ажлуудыг, харанхуй өнгөөр үлдсэн ажлуудыг харж болно." },
    { targetId: "khyanalt-activity-chart", title: "Гүйцэтгэлийн график", description: "Сүүлийн 7 хоногийн ажлын гүйцэтгэлийг өдрөөр нь харьцуулан харах боломжтой." },
    { targetId: "khyanalt-tasks", title: "Ажлын жагсаалт", description: "Хамгийн сүүлд нэмэгдсэн болон хийгдэж буй ажлуудыг эндээс хянах боломжтой." },
    { targetId: "khyanalt-team", title: "Баг хамт олон", description: "Танай багийн гишүүдийн жагсаалт энд харагдах бөгөөд тэдний үүргийг хянах боломжтой." },
  ];

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
    }
    return days.map(day => {
      const count = tasks.filter(t => (t.tuluv === 'duussan') && moment(t.updatedAt || t.createdAt).isSame(day, 'day')).length;
      return { label: moment(day).format('M/D'), count };
    });
  }, [tasks]);

  // 3-series chart data: done (green), active (blue), overdue (red)
  const multiChartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
    }
    return days.map(day => {
      const dayMoment = moment(day);
      const done = tasks.filter(t => t.tuluv === 'duussan' && dayMoment.isSame(t.updatedAt || t.createdAt, 'day')).length;
      const active = tasks.filter(t => t.tuluv === 'khiigdej bui' && dayMoment.isSame(t.updatedAt || t.createdAt, 'day')).length;
      const overdue = tasks.filter(t => t.tuluv !== 'duussan' && t.duusakhTsag && moment(t.duusakhTsag).isBefore(dayMoment, 'day')).length;
      return { label: dayMoment.format('M/D'), done, active, overdue };
    });
  }, [tasks]);

  const maxCount = Math.max(...chartData.map(d => d.count), 5);
  const chartPoints = chartData.map((d, i) => {
    const x = 30 + (i * 24);
    const y = 90 - (d.count / maxCount * 70);
    return `${x},${y}`;
  }).join(" ");

  const chartPath = `M30,90 ${chartPoints} V 90 H 30 Z`;

  function disabledDate(current) {
    if (!current) return false;
    const minDate = moment().subtract(1, "month").startOf("month");
    const maxDate = moment().endOf("month");
    return !current.isBetween(minDate, maxDate, "day", "[]");
  }

  const [tsutslakhOgnoo, setTsutslakhOgnoo] = React.useState([
    moment(),
    moment(),
  ]);

  return (
    <Admin title="Хяналтын самбар" khuudasniiNer="khynalt">
      <div className="col-span-12 flex flex-col xl:flex-row h-auto xl:h-H8HalfRem w-full -mx-0 xl:-mx-1 -mt-2 text-black overflow-hidden lg:rounded-2xl shadow-2xl relative animate-entrance">
        <div className="flex-1 flex flex-col p-3 md:p-4 overflow-x-hidden relative min-w-0">
          <div className="flex justify-between items-center mb-4 px-1">
          
        </div>
          <div id="khyanalt-stats" className="hideScroll grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 shrink-0 pt-1">
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
                        <div className="mb-0.5 bg-gradient-to-r from-emerald-900 to-emerald-700 bg-clip-text text-3xl font-bold text-transparent dark:from-emerald-100 dark:to-emerald-300">
                          {card.value}
                        </div>
                        <div className="text-sm font-medium text-emerald-600 transition-colors duration-300 dark:text-emerald-400">
                          {card.title}
                        </div>
                      </div>
                    </div>
                    <div className="h-0.5 w-0 rounded-full bg-emerald-500 transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-100 dark:[&::-webkit-scrollbar-thumb]:bg-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              
              <DashboardCard id="khyanalt-status-chart" title="Даалгаврын төлөв" icon={<CheckSquareOutlined/>} headerClass="border-indigo-500">
                {(() => {
                  const done    = tasks.filter(t => t.tuluv === 'duussan').length;
                  const active  = tasks.filter(t => t.tuluv === 'khiigdej bui').length;
                  const overdue = tasks.filter(t => t.tuluv !== 'duussan' && t.duusakhTsag && moment(t.duusakhTsag).isBefore(moment(), 'day')).length;
                  const total   = tasks.length || 1;
                  const pct     = Math.round((done / total) * 100);

                  // ring segments — circumference of r=36 circle
                  const C = 2 * Math.PI * 36; // ≈ 226.2
                  const doneDash   = (done   / total) * C;
                  const activeDash = (active / total) * C;
                  const overdueDash= (overdue / total) * C;

                  const statuses = [
                    { label: 'Дууссан',          count: done,    color: '#22c55e', offset: 0 },
                    { label: 'Идэвхтэй',          count: active,  color: '#6366f1', offset: doneDash },
                    { label: 'Хугацаа хэтэрсэн', count: overdue, color: '#ef4444', offset: doneDash + activeDash },
                  ];

                  return tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 text-[10px] font-bold uppercase tracking-widest">
                      <CheckSquareOutlined className="text-3xl opacity-20" />
                      Мэдээлэл байхгүй
                    </div>
                  ) : (
                    <div className="flex items-center justify-around h-full px-2">
                      {/* Ring */}
                      <div className="relative shrink-0">
                        <svg viewBox="0 0 80 80" className="w-[150px] h-[150px]">
                          <defs>
                            <filter id="ringShadow" x="-20%" y="-20%" width="140%" height="140%">
                              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.25"/>
                            </filter>
                          </defs>
                          {/* track */}
                          <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor"
                            strokeWidth="7" className="text-gray-100 dark:text-gray-800" />
                          {/* segments */}
                          {statuses.map((s, i) => (
                            <circle key={i}
                              cx="40" cy="40" r="36"
                              fill="none"
                              stroke={s.color}
                              strokeWidth="7"
                              strokeLinecap="butt"
                              strokeDasharray={`${(s.count / total) * C} ${C}`}
                              strokeDashoffset={-s.offset}
                              transform="rotate(-90 40 40)"
                              style={{ transition: 'stroke-dasharray 0.9s ease' }}
                            />
                          ))}
                          {/* center */}
                          <text x="40" y="36" fill="currentColor" fontSize="16" fontWeight="900"
                            textAnchor="middle" className="text-gray-800 dark:text-white">{pct}%</text>
                          <text x="40" y="47" fill="currentColor" fontSize="5.5" fontWeight="700"
                            textAnchor="middle" className="text-gray-400 dark:text-gray-500">ГҮЙЦЭТГЭЛ</text>
                          <text x="40" y="56" fill="currentColor" fontSize="5" fontWeight="600"
                            textAnchor="middle" className="text-gray-400">{total} нийт</text>
                        </svg>
                      </div>

                      {/* Stats column */}
                      <div className="flex flex-col gap-3">
                        {statuses.map((s, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}60` }} />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{s.label}</span>
                              <span className="text-xl font-black leading-none" style={{ color: s.color }}>{s.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                </DashboardCard>

                <DashboardCard id="khyanalt-tasks" title="Даалгаврууд" icon={<CheckSquareOutlined/>} headerClass="border-blue-500" rightActions={<span className="text-emerald-500 text-[11px] font-bold cursor-pointer hover:underline">Надад оноогдсон <DownOutlined className="text-[8px]"/></span>}>
                  <div className="flex flex-col gap-3">
                    {tasks.slice(0, 5).map(task => (
                      <div key={task._id} className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800 pb-2">
                        <div className="flex items-center gap-2">
                           <CheckSquareOutlined className={task.tuluv === "duussan" ? "text-emerald-500" : "text-gray-400"} />
                           <span className="text-gray-800 dark:text-gray-200 text-[13px] font-extrabold flex-1 truncate">{task.ner}</span>
                        </div>
                         <div className="flex items-center gap-2 ml-6 text-[10px] text-gray-500 font-medium tracking-tight">
                            <span className={`px-1.5 py-0.5 rounded uppercase font-black ${
                               task.zereglel === "yaraltai" || task.zereglel === "nen yaraltai" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                               task.zereglel === "engiin" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
                               "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}>
                               {task.zereglel === "yaraltai" ? "Яаралтай" : 
                                task.zereglel === "nen yaraltai" ? "Нэн яаралтай" : 
                                task.zereglel === "engiin" ? "Энгийн" : "Бага"}
                            </span>
                            <span className="flex items-center gap-1">
                               <CalendarOutlined className="text-[10px] opacity-70" />
                               {task.duusakhTsag ? moment(task.duusakhTsag).format("YYYY-MM-DD") : "--"}
                            </span>
                         </div>
                      </div>
                    ))}
                    
                    
                  </div>
                </DashboardCard>

                <DashboardCard title="Сүүлийн бараанууд" icon={<PlusOutlined/>} headerClass="border-cyan-500">
                  <div className="flex flex-col gap-3">
                    {baraas.slice(0, 5).map(item => (
                      <div key={item._id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                        <div className="flex flex-col min-w-0 flex-1">
                           <span className="text-gray-800 dark:text-gray-200 text-[13px] font-extrabold truncate">{item.ner}</span>
                           <span className="text-[10px] text-gray-500">{item.niiluulegch || "--"}</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-[13px] font-black text-cyan-600 dark:text-cyan-400">{item.uldegdel || 0}</span>
                           <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Үлдэгдэл</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </DashboardCard>

              <DashboardCard id="khyanalt-activity-chart" title="Гүйцэтгэлийн явц" icon={<AreaChartOutlined/>} headerClass="border-sky-500" rightActions={<span className="text-gray-400 dark:text-gray-300 text-[11px] font-black uppercase tracking-tighter flex items-center gap-1.5 cursor-pointer hover:text-sky-500 transition-colors bg-sky-500/5 px-2 py-0.5 rounded-full">7 хоног</span>}>
                  {(() => {
                    const W = 200, H = 90, PAD_L = 8, PAD_R = 8, BASE = H;
                    const N = multiChartData.length;
                    const step = (W - PAD_L - PAD_R) / Math.max(N - 1, 1);

                    const doneTotal   = tasks.filter(t => t.tuluv === 'duussan').length;
                    const activeTotal  = tasks.filter(t => t.tuluv === 'khiigdej bui').length;
                    const overdueTotal = tasks.filter(t => t.tuluv !== 'duussan' && t.duusakhTsag && moment(t.duusakhTsag).isBefore(moment(), 'day')).length;
                    const effPct = Math.round((doneTotal / (tasks.length || 1)) * 100);

                    // compute scaled y for each series
                    const allVals = multiChartData.flatMap(d => [d.done, d.active, d.overdue]);
                    const seriesMax = Math.max(...allVals, 1);

                    const mkPts = (key) => multiChartData.map((d, i) => ({
                      x: PAD_L + i * step,
                      y: BASE - (d[key] / seriesMax) * (BASE - 10),
                      v: d[key]
                    }));

                    const mkSmooth = (pts) => pts.length < 2
                      ? `M${pts[0]?.x ?? 0},${pts[0]?.y ?? BASE}`
                      : pts.reduce((acc, pt, i) => {
                          if (i === 0) return `M${pt.x},${pt.y}`;
                          const prev = pts[i - 1];
                          const cpx = (prev.x + pt.x) / 2;
                          return `${acc} C${cpx},${prev.y} ${cpx},${pt.y} ${pt.x},${pt.y}`;
                        }, '');

                    const mkArea = (pts) => {
                      const line = mkSmooth(pts);
                      return `${line} L${pts[pts.length-1].x},${BASE} L${pts[0].x},${BASE} Z`;
                    };

                    const series = [
                      { key: 'overdue', color: '#ef4444', gradId: 'gradRed',   glowId: 'glowRed',   label: 'Хугацаа хэтэрсэн', count: overdueTotal },
                      { key: 'active',  color: '#3b82f6', gradId: 'gradBlue',  glowId: 'glowBlue',  label: 'Идэвхтэй',         count: activeTotal  },
                      { key: 'done',    color: '#22c55e', gradId: 'gradGreen', glowId: 'glowGreen', label: 'Дууссан',          count: doneTotal    },
                    ];

                    return (
                      <div className="flex flex-col h-full">
                        {/* stat chips */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {series.map(s => (
                            <div key={s.key} className="flex items-baseline gap-1 px-2.5 py-1 rounded-lg"
                              style={{ background: `${s.color}14`, border: `1px solid ${s.color}30` }}>
                              <span className="text-base font-black leading-none" style={{ color: s.color }}>{s.count}</span>
                              <span className="text-[8px] font-bold uppercase tracking-wide" style={{ color: s.color, opacity: 0.75 }}>{s.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* chart */}
                        <div className="flex-1 relative min-h-[100px]">
                          <svg viewBox={`0 0 ${W} ${H + 12}`} className="w-full h-full overflow-visible">
                            <defs>
                              {series.map(s => (
                                <React.Fragment key={s.gradId}>
                                  <linearGradient id={s.gradId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%"  stopColor={s.color} stopOpacity="0.55" />
                                    <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
                                  </linearGradient>
                                  <filter id={s.glowId} x="-30%" y="-80%" width="160%" height="260%">
                                    <feGaussianBlur stdDeviation="2" result="blur" />
                                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                  </filter>
                                </React.Fragment>
                              ))}
                            </defs>

                            {/* grid */}
                            {[H * 0.25, H * 0.5, H * 0.75].map((yg, gi) => (
                              <line key={gi} x1={PAD_L} y1={yg} x2={W - PAD_R} y2={yg}
                                stroke="currentColor" strokeWidth="0.35" strokeDasharray="3 5"
                                className="text-gray-200 dark:text-gray-700/50" />
                            ))}

                            {/* areas + lines, drawn back-to-front */}
                            {series.map(s => {
                              const pts = mkPts(s.key);
                              return (
                                <g key={s.key}>
                                  <path d={mkArea(pts)} fill={`url(#${s.gradId})`} />
                                  <path
                                    d={mkSmooth(pts)}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    filter={`url(#${s.glowId})`}
                                  />
                                  {/* dots */}
                                  {pts.map((pt, i) => (
                                    <g key={i} className="group/pt">
                                      <circle cx={pt.x} cy={pt.y} r="5" fill={s.color} fillOpacity="0"
                                        className="transition-all duration-150 group-hover/pt:fill-opacity-20" />
                                      <circle cx={pt.x} cy={pt.y} r="2.5" fill="#fff" stroke={s.color} strokeWidth="1.8" />
                                      {/* tooltip */}
                                      <g className="opacity-0 group-hover/pt:opacity-100 transition-opacity duration-100" style={{ pointerEvents: 'none' }}>
                                        <rect x={pt.x - 8} y={pt.y - 16} width="16" height="11" rx="2.5"
                                          fill="#0f172a" fillOpacity="0.9" />
                                        <text x={pt.x} y={pt.y - 8} fill={s.color} fontSize="5.5" fontWeight="900" textAnchor="middle">{pt.v}</text>
                                      </g>
                                    </g>
                                  ))}
                                </g>
                              );
                            })}

                            {/* x-axis labels (use first series for days) */}
                            {mkPts('done').map((pt, i) => (
                              <text key={i} x={pt.x} y={H + 10} fill="currentColor" fontSize="5.5" fontWeight="700"
                                textAnchor="middle" className="text-gray-400 dark:text-gray-500">
                                {multiChartData[i].label}
                              </text>
                            ))}
                          </svg>
                        </div>

                        {/* legend footer */}
                        <div className="mt-2 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {series.map(s => (
                              <div key={s.key} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 5px ${s.color}` }} />
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{s.label}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
                            <RiseOutlined style={{ color: '#22c55e', fontSize: 9 }} />
                            <span className="text-[9px] font-black" style={{ color: '#22c55e' }}>{effPct}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
              </DashboardCard>

              <DashboardCard title="Сүүлийн үйлчлүүлэгчид" icon={<UserOutlined/>} headerClass="border-blue-400">
                  <div className="flex flex-col gap-3">
                    {uilchluulegchid.map(user => (
                      <div key={user._id} className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-400 pb-2">
                        <Avatar size="small" icon={<UserOutlined />} className="bg-gradient-to-tr from-green-300 to-gray-400 dark:from-green-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-black border border-white dark:border-gray-500 shadow-xl" />
                        <div className="flex flex-col min-w-0 flex-1">
                           <span className="text-gray-800 dark:text-gray-200 text-[12.5px] font-extrabold truncate">{user.ner}</span>
                           <span className="text-[10px] text-gray-500 truncate">{user.mail || user.utas?.[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </DashboardCard>

                <DashboardCard title="Ажилтны гүйцэтгэл" icon={<TeamOutlined/>} headerClass="border-indigo-500">
                  <div className="flex flex-col gap-2">
                    {teamMembers.slice(0, 5).map((member, i) => {
                      const memberTasks = tasks.filter(t =>
                        t.hariutsagchId === member.id || (Array.isArray(t.ajiltnuud) && t.ajiltnuud.includes(member.id))
                      );
                      const total     = memberTasks.length;
                      const done      = memberTasks.filter(t => t.tuluv === 'duussan').length;
                      const active    = memberTasks.filter(t => t.tuluv === 'khiigdej bui').length;
                      const overdue   = memberTasks.filter(t => t.tuluv !== 'duussan' && t.duusakhTsag && moment(t.duusakhTsag).isBefore(moment(), 'day')).length;
                      const remaining = Math.max(total - done - active - overdue, 0);
                      const pct       = total > 0 ? Math.round((done / total) * 100) : 0;

                      const avatarColors = ['#0096FF','#0096FF','#0096FF','#0096FF','#0096FF'];
                      const ac = avatarColors[i % avatarColors.length];

                      return (
                        <div key={member.id} className="group flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                          {/* avatar */}
                          <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black"
                            style={{ background: `${ac}22`, border: `1.5px solid ${ac}50`, color: ac }}>
                            {member.name?.charAt(0).toUpperCase()}
                          </div>

                          {/* content */}
                          <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200 truncate leading-none">{member.name}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {overdue > 0 && (
                                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full"
                                    style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                                    {overdue} хэтэрсэн
                                  </span>
                                )}
                                <span className="text-[10px] font-black tabular-nums" style={{ color: ac }}>{pct}%</span>
                              </div>
                            </div>

                            {/* segmented bar: green=done, blue=active, red=overdue */}
                            <div className="h-[5px] w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
                              {total > 0 ? (
                                <>
                                  <div style={{ width: `${(done / total) * 100}%`, background: '#22c55e', transition: 'width 0.6s ease' }} className="h-full" />
                                  <div style={{ width: `${(active / total) * 100}%`, background: '#0096FF', transition: 'width 0.6s ease 0.1s' }} className="h-full" />
                                  <div style={{ width: `${(overdue / total) * 100}%`, background: '#ef4444', transition: 'width 0.6s ease 0.2s' }} className="h-full" />
                                </>
                              ) : (
                                <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
                              )}
                            </div>

                            {/* micro counts */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[8px] font-bold" style={{ color: '#22c55e' }}>{done} дууссан</span>
                              {active > 0 && <span className="text-[8px] font-bold" style={{ color: '#0096FF' }}>{active} идэвхтэй</span>}
                              {overdue > 0 && <span className="text-[8px] font-bold" style={{ color: '#ef4444' }}>{overdue} хэтэрсэн</span>}
                              {remaining > 0 && <span className="text-[8px] font-bold text-gray-400">{remaining} хүлээгдэж буй</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {teamMembers.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-6 text-gray-400 gap-1 text-[10px] font-bold uppercase tracking-widest">
                        <TeamOutlined className="text-2xl opacity-20" />
                        Ажилтан байхгүй
                      </div>
                    )}
                  </div>
                </DashboardCard>
            </div>
          </div>
        </div>

        <div id="khyanalt-team" className={`transition-all duration-300 flex flex-col shrink-0 z-20 ${isRightPanelExpanded ? 'w-full xl:w-[340px] opacity-100 h-auto xl:h-[calc(101vh-5rem)]' : 'w-0 opacity-0 whitespace-nowrap overflow-hidden'}`}>  
            <div className="flex-1 m-3 bg-white dark:bg-[#1f2636] rounded-[2rem] border border-slate-100 dark:border-slate-800/60 shadow-2xl flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto w-full flex flex-col [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
                <div className="flex max-h-[200px] overflow-y-auto flex-col shrink-0 m-4 mb-2 bg-gray-50/50 dark:bg-gray-900/40 rounded-2xl border border-slate-200 dark:border-slate-700/30 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between p-4 pb-3 shrink-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center">
                         <ClockCircleOutlined className="dark:text-gray-400 text-gray-800 text-[10px]" />
                      </div>
                      <span className="font-extrabold text-black dark:text-white text-[11px] tracking-wide uppercase opacity-70">Түүх</span>
                    </div>
                     <Button type="text" size="small" className="hover:!bg-slate-600/50 hover:text-white dark:hover:!bg-white/10 transition-all rounded-md px-1 w-6 h-6 border border-slate-700/50 flex items-center justify-center" icon={<CloseOutlined className="text-gray-400 dark:text-gray-300 text-[10px]" />} onClick={() => setIsRightPanelExpanded(false)} />
                  </div>
                  
                  <div className="px-5 py-3 space-y-5">
                    {loadingHistory ? (
                      <div className="flex justify-center py-4"><span className="text-gray-400 text-[10px]">Ачаалж байна...</span></div>
                    ) : history.length === 0 ? (
                      <div className="text-center text-gray-400 text-[11px]">Түүх байхгүй байна</div>
                    ) : (
                      history.slice(0, 5).map((act) => (
                        <div key={act._id || act.id} className="hover:scale-105 relative pl-6 before:content-[''] before:absolute before:left-[5px] before:top-4 before:w-[2px] before:h-[130%] before:bg-slate-400/60 dark:before:bg-slate-600/60 last:before:hidden">
                          <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-[#10b981] border-2 border-[#262c3d] z-10 shadow-sm"></div>
                            <div className="text-[11.5px] leading-relaxed">
                              {act.ajiltniiNer && <span className="text-gray-800 dark:text-gray-200 font-extrabold">{act.ajiltniiNer} </span>}
                              <span className="text-gray-400 font-medium">
                                 {act.uildelText || (
                                  act.uildel === "created task" || act.uildel === "created" ? "даалгавар үүсгэлээ" :
                                  act.uildel === "updated task" || act.uildel === "updated" ? "даалгавар шинэчиллээ" :
                                  act.uildel === "added member" || act.uildel === "added" ? "гишүүн нэмлээ" :
                                  act.uildel === "deleted task" || act.uildel === "deleted" ? "даалгавар устгалаа" :
                                  act.uildel === "completed task" || act.uildel === "completed" ? "даалгавар дуусгалаа" :
                                  act.uildel === "message sent" ? "зурвас илгээлээ" :
                                  (act.uildel || 'үйлдэл хийлээ')
                                )}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-500 mt-1 font-medium tracking-wide">
                              {act.createdAt ? moment(act.createdAt).format("YYYY-MM-DD HH:mm") : "--:--"}
                            </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-col p-4 space-y-6">
                  
                  <div className="border-b border-slate-200 dark:border-slate-700/50"></div>
                  <div className="flex h-[calc(40vh-200px)] overflow-y-auto flex-col space-y-3 shrink-0 bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center space-x-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                        <span>Төслүүд</span>
                        <DownOutlined className="text-[8px] text-gray-500 cursor-pointer hover:text-white transition-colors" />
                      </div>
                    </div>
                    
                    {loadingProjects ? (
                      <div className="flex justify-center py-2"><span className="text-gray-400 text-[10px]">Ачаалж байна...</span></div>
                    ) : projects.length === 0 ? (
                      <div className="text-center text-gray-400 text-[11px] py-4 font-medium">Төсөл байхгүй байна</div>
                    ) : (
                      projects.slice(0, 5).map(p => (
                        <div key={p._id} className="flex items-center space-x-3 cursor-pointer group hover:bg-white dark:hover:bg-gray-800 px-3 py-2 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-none hover:shadow-md">
                          <div className="w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-extrabold text-white shadow-lg" style={{ backgroundColor: p.color || "#1cb74eff" }}>
                            {(p.ner || "T").slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[12px] font-bold text-gray-600 dark:text-gray-200 group-hover:text-emerald-500 transition-colors truncate">{p.ner}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                    <div className="pt-4 h-[calc(50vh-200px)] overflow-y-auto shrink-0 dark:bg-gray-900/40 rounded-lg p-2 shadow-md border dark:border-slate-700/50">
                      <div className="text-[11px] font-extrabold text-gray-400 mb-4 px-1 flex items-center tracking-wide uppercase opacity-70">
                        <span>Ажилчид</span>
                      </div>
                    <div className="space-y-1.5">
                        {teamMembers.map((member, i) => (
                          <div key={i} className="flex items-center group cursor-pointer transition-all px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-emerald-800">
                            <div className="flex items-center space-x-3 w-full">
                              <Avatar size="medium" className="bg-gradient-to-tr from-green-300 to-gray-400 dark:from-green-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-black border border-white dark:border-gray-800 shadow-xl">
                                <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                              </Avatar>
                              <div className="flex flex-col min-w-0 flex-1 justify-center">
                                <div className="text-[11.5px] font-extrabold text-gray-600 dark:text-gray-200 group-hover:text-emerald-500 transition-colors truncate leading-tight">{member.name}</div>
                                <div className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">{member.role}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                </div>
                
                <div className="p-4 shrink-0 mt-auto">
                    <div 
                      className="bg-white dark:bg-gray-800/60 dark:hover:bg-emerald-500/10 hover:bg-emerald-500 group transition-all cursor-pointer rounded-2xl px-4 py-3 flex items-center justify-center gap-2.5 border border-slate-200 dark:border-slate-700/50 shadow-sm"
                      onClick={() => setIsTutorialOpen(true)}
                    >
                      <QuestionCircleOutlined className="text-gray-500 dark:text-gray-400 text-[14px] group-hover:text-white transition-colors" />
                      <span className="text-gray-600 dark:text-gray-300 text-[11px] font-extrabold group-hover:text-white transition-colors">Тусламж</span>
                   </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      
      {typeof window !== 'undefined' && !isRightPanelExpanded && createPortal(
        <button 
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-green-600 dark:bg-green-900 border border-green-700/60 w-8 h-12 rounded-l-lg flex flex-col items-center justify-center cursor-pointer shadow-xl hover:bg-green-500 hover:-translate-x-1 transition-all z-[99999]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsRightPanelExpanded(true);
          }}
        >
          <RightOutlined className="text-white dark:text-gray-300 text-[10px] rotate-180" />
        </button>,
        document.body
      )}

      <GuidedTour 
        steps={tutorialSteps} 
        isOpen={isTutorialOpen} 
        currentStep={currentTutorialStep}
        onStepChange={setCurrentTutorialStep}
        onClose={() => {
          setIsTutorialOpen(false);
          setCurrentTutorialStep(0);
        }} 
      />
    </Admin>
  );
}

export default Khynalt;
