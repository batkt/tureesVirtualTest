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
  RightOutlined
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
      const count = tasks.filter(t => (t.tuluv === 'duussan' || t.tuluv === 'duussan') && moment(t.updatedAt || t.createdAt).isSame(day, 'day')).length;
      return { label: moment(day).format('M/D'), count };
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
                  <div className="flex justify-center items-center h-full relative p-4">
                    {tasks.length > 0 ? (
                      (() => {
                        const doneCount = tasks.filter(t => t.tuluv === 'duussan' || t.tuluv === 'duussan').length;
                        const totalCount = tasks.length;
                        const pendingCount = totalCount - doneCount;
                        const percent = (doneCount / totalCount) * 100;
                        const dashArray = 251.2; 
                        const dashOffset = dashArray - (dashArray * percent) / 100;

                        return (
                          <div className="flex items-center gap-12">
                            <div className="relative">
                              <svg viewBox="0 0 100 100" className="w-[180px] h-[180px] drop-shadow-2xl">
                                {/* Indigo Segment (Pending/In Progress) */}
                                <circle 
                                  cx="50" cy="50" r="40" 
                                  fill="transparent" 
                                  stroke="#6366f1" 
                                  strokeWidth="10" 
                                />
                                {/* Emerald Segment (Done) */}
                                <circle 
                                  cx="50" 
                                  cy="50" 
                                  r="40" 
                                  fill="transparent" 
                                  stroke="#10b981" 
                                  strokeWidth="10" 
                                  strokeDasharray={dashArray} 
                                  strokeDashoffset={dashOffset} 
                                  strokeLinecap="round"
                                  transform="rotate(-90 50 50)"
                                  className="transition-all duration-1000 ease-out"
                                />
                                <text x="50" y="52" fill="currentColor" className="text-gray-800 dark:text-white" fontSize="18" fontWeight="900" textAnchor="middle">{totalCount}</text>
                                <text x="50" y="65" fill="currentColor" className="text-gray-400" fontSize="7" fontWeight="bold" textAnchor="middle">НИЙТ</text>
                              </svg>
                            </div>
                            
                            <div className="flex flex-col gap-6">
                              <div className="flex flex-col items-start">
                                <span className="text-[10px] text-white font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500 mb-1 leading-none shadow-lg shadow-indigo-500/20">Хийгдэж байгаа</span>
                                <span className="text-3xl font-black text-indigo-500 dark:text-indigo-400 leading-none ml-1">{pendingCount}</span>
                              </div>
                              
                              <div className="flex flex-col items-start">
                                <span className="text-[10px] text-white font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500 mb-1 leading-none shadow-lg shadow-emerald-500/20">Дууссан</span>
                                <span className="text-3xl font-black text-emerald-500 dark:text-emerald-400 leading-none ml-1">{doneCount}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-2 font-bold uppercase tracking-widest text-[10px]">
                         <CheckSquareOutlined className="text-3xl opacity-20 mb-1" />
                         Мэдээлэл байхгүй
                      </div>
                    )}
                  </div>
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
                        <div className="flex flex-col">
                           <span className="text-gray-800 dark:text-gray-200 text-[13px] font-extrabold truncate">{item.ner}</span>
                           <span className="text-[10px] text-gray-500">{item.niiluulegch || "--"}</span>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                </DashboardCard>

              <DashboardCard id="khyanalt-activity-chart" title="Даалгаврын гүйцэтгэл" icon={<FileTextOutlined/>} headerClass="border-sky-400" rightActions={<span className="text-gray-400 dark:text-gray-300 text-[11.5px] font-extrabold flex items-center gap-1.5 cursor-pointer hover:text-black dark:hover:text-white transition-colors">7 хоног <DownOutlined className="text-[8px]"/></span>}>
                  <div className="flex justify-center items-center h-full relative py-2">
                     <svg viewBox="0 0 200 110" className="w-full h-full drop-shadow-lg">
                       <defs>
                         <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                           <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                         </linearGradient>
                       </defs>
                       <path d={chartPath} fill="url(#chartGradient)" />
                       <line x1="20" y1="10" x2="20" y2="90" stroke="#374151" strokeWidth="0.5" strokeDasharray="3" />
                       <line x1="20" y1="90" x2="190" y2="90" stroke="#374151" strokeWidth="0.5" strokeDasharray="3" />
                       <polyline fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={chartPoints} />
                       {chartData.map((d, i) => {
                         const x = 30 + (i * 24);
                         const y = 90 - (d.count / maxCount * 70);
                         return (
                           <g key={i}>
                             <circle cx={x} cy={y} r="3" fill="#0ea5e9" stroke="#fff" strokeWidth="1" />
                             <text x={x} y="103" fill="#6b7280" fontSize="7" fontWeight="bold" textAnchor="middle">{d.label}</text>
                             {d.count > 0 && <text x={x} y={y - 6} fill="#0ea5e9" fontSize="6" fontWeight="bold" textAnchor="middle">{d.count}</text>}
                           </g>
                         );
                       })}
                       <text x="10" y="22" fill="#6b7280" fontSize="7" fontWeight="bold">{maxCount}</text>
                       <text x="10" y="55" fill="#6b7280" fontSize="7" fontWeight="bold">{Math.round(maxCount/2)}</text>
                       <text x="10" y="93" fill="#6b7280" fontSize="7" fontWeight="bold">0</text>
                     </svg>
                  </div>
              </DashboardCard>

              <DashboardCard title="Сүүлийн үйлчлүүлэгчид" icon={<UserOutlined/>} headerClass="border-blue-400">
                  <div className="flex flex-col gap-3">
                    {uilchluulegchid.slice(0, 5).map(user => (
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

                <DashboardCard title="Баримтууд" icon={<FileTextOutlined/>} headerClass="border-cyan-600" rightActions={<span className="text-emerald-500 text-[11px] font-extrabold cursor-pointer flex items-center gap-1 hover:underline"><PlusOutlined className="text-[10px]"/> Баримт үүсгэх</span>}>
                  <div className="flex flex-col gap-2">
                    {[
                      { title: "Гарын авлага", date: "2-р сар 23, 2026" },
                      { title: "Багаа хэрхэн зохион байгуулах вэ?", date: "2-р сар 23, 2026" },
                      { title: "Төслөө хэрхэн импортлох вэ?", date: "2-р сар 23, 2026" }
                    ].map((doc, i) => (
                      <div key={i} className="flex gap-4 cursor-pointer group hover:bg-gray-50 dark:hover:bg-[#202736] p-3 -mx-2 rounded-xl transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700/50">
                         <div className="w-[46px] h-[46px] bg-gray-100 dark:bg-[#1b212f] rounded-lg flex items-center justify-center shadow-inner border border-gray-200 dark:border-gray-700/50 shrink-0">
                            <FileTextOutlined className="text-[#0ea5e9] text-[22px]" />
                         </div>
                         <div className="flex flex-col gap-1 flex-1 min-w-0 justify-center pb-1">
                            <div className="text-[12.5px] font-extrabold text-gray-800 dark:text-gray-200 truncate dark:group-hover:text-white transition-colors tracking-wide">{doc.title}</div>
                            <div className="text-[10px] text-gray-500 flex flex-col gap-[3px] font-semibold mt-0.5">
                               <div className="flex items-center gap-1.5"><UserOutlined className="text-[10px] text-gray-400"/> Таны үзсэн: {doc.date}</div>
                               <div className="flex items-center gap-1.5"><ClockCircleOutlined className="text-[10px] text-gray-400"/> Шинэчлэгдсэн: {doc.date}</div>
                               <div className="text-emerald-500 mt-1 flex items-center gap-1.5 font-extrabold hover:underline w-fit"><span className="w-3 h-3 border border-emerald-500 rounded-full flex items-center justify-center"><PlusOutlined className="text-[7px]"/></span> Таг нэмэх</div>
                            </div>
                         </div>
                         <div className="w-[24px] h-[24px] rounded bg-[#df5cf9] flex items-center justify-center text-white text-[11px] shrink-0 mt-1 shadow-sm"><RightOutlined/></div>
                      </div>
                    ))}
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
                  <div className="flex flex-col space-y-3 shrink-0 bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/50 shadow-sm">
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
                  
                    <div className="pt-4 shrink-0 dark:bg-gray-900/40 rounded-lg p-2 shadow-md border dark:border-slate-700/50 overflow-y-auto max-h-[400px]">
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
