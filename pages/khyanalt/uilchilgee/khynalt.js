import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createPortal } from 'react-dom';
import fsmApi, { FSM_BASE_URL } from "services/fsmApi";
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
  DeleteOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  RollbackOutlined,
  FileOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { 
  Button, 
  Select, 
  Space,
  Dropdown,
  Avatar,
  Modal,
  DatePicker,
  Spin,
  Popconfirm,
  Tooltip,
  Form,
  Input,
  AutoComplete,
  InputNumber,
  Drawer,
  Divider,
  Upload
} from "antd";
import { useFsmSocket } from "hooks/useFsmSocket";
import { useRouter } from "next/router";
import { SiMaterialdesign } from "react-icons/si";
import { TbBoxSeam } from "react-icons/tb";

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
  const router = useRouter();
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
  const [chartRange, setChartRange] = useState(7); // 7, 14, 30 days
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const ajiltanJagsaalt = useJagsaalt("/ajiltan");
  const [form] = Form.useForm();
  const [projectForm] = Form.useForm();
  const [savingProject, setSavingProject] = useState(false);
  const [isProjectChatVisible, setIsProjectChatVisible] = useState(false);
  const [selectedProjectForChat, setSelectedProjectForChat] = useState(null);
  const [projectChatMessages, setProjectChatMessages] = useState([]);
  const [projectChatInput, setProjectChatInput] = useState("");
  const [loadingProjectChat, setLoadingProjectChat] = useState(false);
  const [uploadingProjectChatFile, setUploadingProjectChatFile] = useState(false);
  const [selectedProjectChatFile, setSelectedProjectChatFile] = useState(null);
  const [projectChatEndRef] = [useRef(null)];
  const [replyToProject, setReplyToProject] = useState(null);
  const [editingProjectMsg, setEditingProjectMsg] = useState(null);
  const [editProjectMsgText, setEditProjectMsgText] = useState("");
  
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
      const pList = pRes.data?.data || (Array.isArray(pRes.data) ? pRes.data : []);
      const normalized = pList.map(p => ({ ...p, id: p._id, name: p.ner }));
      setProjects(normalized);
      setSelectedProjectIds(normalized.map(p => p.id));
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

  const { isConnected, socket: fsmSocket } = useFsmSocket(
    selectedProjectForChat ? (selectedProjectForChat.id || selectedProjectForChat._id) : null
  );

  const fetchProjectChatHistory = useCallback(async (projectId) => {
    if (!projectId) return;
    setLoadingProjectChat(true);
    try {
      const res = await api.get("/chats", { params: { projectId, baiguullagiinId, barilgiinId } });
      const msgs = res.data?.data || res.data || [];
      setProjectChatMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err) {
      console.error('Project chat fetch error:', err);
    } finally {
      setLoadingProjectChat(false);
      setTimeout(() => { projectChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
    }
  }, [api, baiguullagiinId, barilgiinId]);

  useEffect(() => {
    if (!isProjectChatVisible || !selectedProjectForChat || !fsmSocket) return;
    const pId = selectedProjectForChat.id || selectedProjectForChat._id;
    fetchProjectChatHistory(pId);

    const handleNewMsg = (msg) => {
      if (msg.projectId === pId && !msg.taskId) {
        setProjectChatMessages(prev => {
          const exists = prev.some(m => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
        setTimeout(() => { projectChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
      }
    };

    fsmSocket.on('new_message', handleNewMsg);
    return () => {
      fsmSocket.off('new_message', handleNewMsg);
    };
  }, [isProjectChatVisible, selectedProjectForChat, fsmSocket, fetchProjectChatHistory]);

  const handleSendProjectMessage = async () => {
    if ((!projectChatInput.trim() && !selectedProjectChatFile) || !selectedProjectForChat) return;
    const projectId = selectedProjectForChat.id || selectedProjectForChat._id;
    setUploadingProjectChatFile(true);
    try {
      let sentRes;
      if (selectedProjectChatFile) {
        const formData = new FormData();
        formData.append('file', selectedProjectChatFile);
        formData.append('projectId', projectId);
        if (baiguullagiinId) formData.append('baiguullagiinId', baiguullagiinId);
        if (barilgiinId) formData.append('barilgiinId', barilgiinId);
        
        const uploadRes = await api.post('/chats/upload', formData);
        const fileInfo = uploadRes.data?.data || uploadRes.data;
        const remotePath = fileInfo.fileZam || fileInfo.zam || fileInfo.path || fileInfo.fileUrl || fileInfo.zamNer || "";
        const finalFileNer = fileInfo.fileNer || fileInfo.ner || fileInfo.filename || (selectedProjectChatFile && selectedProjectChatFile.name) || "Файл";
        
        sentRes = await api.post('/chats', {
          projectId,
          baiguullagiinId,
          barilgiinId,
          ajiltniiId: ajiltan?._id,
          ajiltniiNer: ajiltan?.ner || ajiltan?.nevtrekhNer || 'Unknown',
          medeelel: projectChatInput.trim() || finalFileNer,
          fileZam: remotePath,
          fileNer: finalFileNer,
          turul: selectedProjectChatFile.type.startsWith('image/') ? 'zurag' : 'file',
          replyTo: replyToProject ? {
            chatId: replyToProject.chatId,
            medeelel: replyToProject.medeelel,
            ajiltniiNer: replyToProject.ajiltniiNer,
            turul: replyToProject.turul
          } : undefined
        });
      } else {
        sentRes = await api.post('/chats', {
          projectId,
          baiguullagiinId,
          barilgiinId,
          ajiltniiId: ajiltan?._id,
          ajiltniiNer: ajiltan?.ner || ajiltan?._id,
          medeelel: projectChatInput.trim(),
          turul: 'text',
          replyTo: replyToProject ? {
            chatId: replyToProject.chatId,
            medeelel: replyToProject.medeelel,
            ajiltniiNer: replyToProject.ajiltniiNer,
            turul: replyToProject.turul
          } : undefined
        });
      }
      
      const newMsg = sentRes.data?.data || sentRes.data;
      if (newMsg && typeof newMsg === 'object' && newMsg._id) {
        setProjectChatMessages(prev => {
          const exists = prev.some(m => m._id === newMsg._id);
          if (!exists) return [...prev, newMsg];
          return prev;
        });
        setTimeout(() => { projectChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
      }

      setProjectChatInput('');
      setSelectedProjectChatFile(null);
      setReplyToProject(null);
    } catch (err) {
      message.error('Зурвас илгээхэд алдаа гарлаа');
    } finally {
      setUploadingProjectChatFile(false);
    }
  };

  const handleEditProjectChatMsg = async (msgId, newText) => {
    try {
      const res = await api.patch(`/chats/${msgId}`, { medeelel: newText });
      const updated = res.data?.data || res.data;
      if (updated) {
        setProjectChatMessages(prev => prev.map(m => m._id === msgId ? updated : m));
        setEditingProjectMsg(null);
      }
    } catch (err) {
      message.error('Засахад алдаа гарлаа');
    }
  };

  const handleDeleteProjectChatMsg = async (msgId) => {
    try {
      await api.delete(`/chats/${msgId}`);
      setProjectChatMessages(prev => prev.map(m => m._id === msgId ? { ...m, isDeleted: true } : m));
    } catch (err) {
      message.error('Устгахад алдаа гарлаа');
    }
  };

  const handleProjectFileUpload = (options) => {
    setSelectedProjectChatFile(options.file);
    setTimeout(() => { options.onSuccess('ok'); }, 100);
  };

  useEffect(() => {
    if (isConnected) {
      const handleRefresh = () => fetchData();
      
    }
  }, [isConnected, fetchData]);

  const handleCreateProject = async (values) => {
    if (!barilgiinId) { message.warning("Барилгын мэдээлэл байхгүй байна"); return; }
    setSavingProject(true);
    try {
      const payload = {
        ner: values.name,
        tailbar: values.tailbar || "",
        tuluv: "shine",
        ekhlekhOgnoo: values.ekhlekhOgnoo ? dayjs(values.ekhlekhOgnoo).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
        duusakhOgnoo: values.duusakhOgnoo ? dayjs(values.duusakhOgnoo).format("YYYY-MM-DD") : dayjs().add(30, "day").format("YYYY-MM-DD"),
        udirdagchId: ajiltan?._id,
        ajiltnuud: ajiltan?._id ? [ajiltan._id] : [],
        barilgiinId,
        baiguullagiinId,
        color: values.color || "#10B981",
      };
      
      let res;
      if (editingProject) {
        res = await api.put(`/projects/${editingProject.id || editingProject._id}`, payload);
      } else {
        res = await api.post("/projects", payload);
      }
      
      if (res.data?.success) {
        message.success(`Төсөл амжилттай ${editingProject ? 'засагдлаа' : 'нэмэгдлээ'}`);
        await fetchData();
        setIsProjectModalVisible(false);
        projectForm.resetFields();
        setEditingProject(null);
      }
    } catch (err) {
      message.error(err?.response?.data?.message || `Төсөл ${editingProject ? 'засахад' : 'нэмэхэд'} алдаа гарлаа`);
    } finally {
      setSavingProject(false);
    }
  };

  const handleEditProject = (proj) => {
    setEditingProject(proj);
    projectForm.setFieldsValue({
      name: proj.name || proj.ner,
      tailbar: proj.tailbar || "",
      ekhlekhOgnoo: proj.ekhlekhOgnoo ? dayjs(proj.ekhlekhOgnoo) : dayjs(),
      duusakhOgnoo: proj.duusakhOgnoo ? dayjs(proj.duusakhOgnoo) : dayjs().add(30, "day"),
      color: proj.color || "#10B981",
    });
    setIsProjectModalVisible(true);
  };

  const handleDeleteProject = async (id) => {
    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.data?.success || res.status === 200 || res.status === 204) {
        message.success("Төсөл амжилттай устгагдлаа");
        setSelectedProjectIds(prev => prev.filter(pId => pId !== id));
        await fetchData();
      }
    } catch (err) {
      message.error(err?.response?.data?.message || "Төсөл устгахад алдаа гарлаа");
    }
  };

  const toggleProject = (id) => {
    setSelectedProjectIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const openProjectChat = (proj, e) => {
    e.stopPropagation();
    setSelectedProjectForChat(proj);
    setProjectChatMessages([]);
    setProjectChatInput('');
    setSelectedProjectChatFile(null);
    setIsProjectChatVisible(true);
  };
  
  

  const teamMembers = useMemo(() => {
    return ajiltanJagsaalt?.jagsaalt?.map(a => ({
      id: a._id,
      name: a.ner || a.nevtrekhNer,
      role: a.albanTushaal || a.erkh || "Ажилтан",
      kpi: a.kpiHuvv || 0,
      kpiOnoo: a.kpiOnoo || 0,
    })) || [];
  }, [ajiltanJagsaalt?.jagsaalt]);

  const statCards = [
    { title: "Нийт ажил", value: tasks.length.toString() },
    { title: "Дууссан ажил", value: tasks.filter(t => t.tuluv === "duussan" || t.tuluv === "duussan").length.toString() },
    { title: "Нийт үйлчлүүлэгч", value: uilchluulegchid.length.toString() },
    { title: "Бараа материал", value: baraas.length.toString() },
    { title: "Яаралтай", value: tasks.filter(t => t.zereglel === "yaraltai" || t.zereglel === "nen yaraltai").length.toString() },
    { title: "Идэвхтэй ажилтан", value: teamMembers.length.toString() },
  ];

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

  useEffect(() => {
    if (isTutorialOpen && tutorialSteps[currentTutorialStep]?.targetId === "khyanalt-team") {
      setIsRightPanelExpanded(true);
    }
  }, [isTutorialOpen, currentTutorialStep]);

  const tutorialSteps = [
    { targetId: "khyanalt-stats", title: "Статистик", description: "Дээд хэсэгт байрлах картууд нь таны бизнесийн гол үзүүлэлтүүдийг (нийт ажил, дууссан ажил, бараа материал) шууд харуулна." },
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
  const multiChartData = useMemo(() => {
    const days = [];
    for (let i = chartRange - 1; i >= 0; i--) {
      days.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
    }
    return days.map(day => {
      const dayMoment = moment(day);
      const done = tasks.filter(t => {
        if (t.tuluv !== 'duussan') return false;
        const completeDate = t.duussanOgnoo || t.updatedAt;
        return moment(completeDate).isSame(dayMoment, 'day');
      }).length;
      
      const active = tasks.filter(t => 
        t.tuluv === 'khiigdej bui' && 
        moment(t.updatedAt).isSame(dayMoment, 'day')
      ).length;
      
      const waiting = tasks.filter(t => 
        (t.tuluv === 'khuleegdej bui' || t.tuluv === 'shine') && 
        moment(t.createdAt).isSame(dayMoment, 'day')
      ).length;

      const overdue = tasks.filter(t => 
        t.tuluv !== 'duussan' && 
        t.duusakhTsag && 
        moment(t.duusakhTsag).isBefore(dayMoment, 'day')
      ).length;

      return { label: dayMoment.format('M/D'), done, active, waiting, overdue };
    });
  }, [tasks, chartRange]);

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
      <div className="col-span-12 flex flex-col xl:flex-row h-auto xl:h-H8HalfRem w-full -mx-0 xl:-mx-1 -mt-2 text-black lg:rounded-2xl shadow-2xl relative animate-entrance">
        <div className="flex-1 flex flex-col p-3 md:p-4 overflow-hidden relative min-w-0">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
              <DashboardCard id="khyanalt-activity-chart" title="Гүйцэтгэлийн явц" icon={<AreaChartOutlined/>} headerClass="border-sky-500" rightActions={
                <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
                  {[7, 14, 30].map(r => (
                    <button
                      key={r}
                      onClick={() => setChartRange(r)}
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md transition-all ${chartRange === r ? 'bg-sky-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                      {r}д
                    </button>
                  ))}
                </div>
              }>
                  {(() => {
                    const W = 200, H = 90, PAD_L = 8, PAD_R = 8, BASE = H;
                    const N = multiChartData.length;
                    const step = (W - PAD_L - PAD_R) / Math.max(N - 1, 1);

                    const doneTotal   = tasks.filter(t => t.tuluv === 'duussan').length;
                    const activeTotal  = tasks.filter(t => t.tuluv === 'khiigdej bui').length;
                    const waitingTotal = tasks.filter(t => t.tuluv === 'khuleegdej bui' || t.tuluv === 'shine').length;
                    const overdueTotal = tasks.filter(t => t.tuluv !== 'duussan' && t.duusakhTsag && moment(t.duusakhTsag).isBefore(moment(), 'day')).length;
                    // const effPct = Math.round((doneTotal / (tasks.length || 1)) * 100);

                    const allVals = multiChartData.flatMap(d => [d.done, d.active, d.waiting, d.overdue]);
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
                      { key: 'active',  color: '#3b82f6', gradId: 'gradBlue',  glowId: 'glowBlue',  label: 'Идэвхтэй', count: activeTotal  },
                      { key: 'waiting', color: '#f59e0b', gradId: 'gradAmber', glowId: 'glowAmber', label: 'Хүлээгдэж буй', count: waitingTotal },
                      { key: 'done',    color: '#22c55e', gradId: 'gradGreen', glowId: 'glowGreen', label: 'Дууссан', count: doneTotal    },
                    ];

                    return (
                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {series.map(s => (
                            <div key={s.key} className="flex items-baseline gap-1 px-2.5 py-1 rounded-lg"
                              style={{ background: `${s.color}14`, border: `1px solid ${s.color}30` }}>
                              <span className="text-base font-black leading-none" style={{ color: s.color }}>{s.count}</span>
                              <span className="text-[8px] font-bold uppercase tracking-wide" style={{ color: s.color, opacity: 0.75 }}>{s.label}</span>
                            </div>
                          ))}
                        </div>
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
                            {[H * 0.25, H * 0.5, H * 0.75].map((yg, gi) => (
                              <line key={gi} x1={PAD_L} y1={yg} x2={W - PAD_R} y2={yg}
                                stroke="currentColor" strokeWidth="0.35" strokeDasharray="3 5"
                                className="text-gray-200 dark:text-gray-700/50" />
                            ))}
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
                                  {pts.map((pt, i) => (
                                    <g key={i} className="group/pt">
                                      <circle cx={pt.x} cy={pt.y} r="5" fill={s.color} fillOpacity="0"
                                        className="transition-all duration-150 group-hover/pt:fill-opacity-20" />
                                      <circle cx={pt.x} cy={pt.y} r="2.5" fill="#fff" stroke={s.color} strokeWidth="1.8" />
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
                            {mkPts('done').filter((_, i) => {
                              if (chartRange <= 7) return true;
                              if (chartRange <= 14) return i % 2 === 0;
                              return i % 5 === 0;
                            }).map((pt, i, arr) => {
                              // Find original index in multiChartData
                              const originalIdx = multiChartData.findIndex(d => d.label === multiChartData.filter((_, idx) => {
                                if (chartRange <= 7) return true;
                                if (chartRange <= 14) return idx % 2 === 0;
                                return idx % 5 === 0;
                              })[i].label);
                              
                              return (
                                <text key={i} x={pt.x} y={H + 10} fill="currentColor" fontSize="5.5" fontWeight="700"
                                  textAnchor="middle" className="text-gray-400 dark:text-gray-500">
                                  {multiChartData[originalIdx].label}
                                </text>
                              );
                            })}
                          </svg>
                        </div>
                        <div className="mt-2 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {series.map(s => (
                              <div key={s.key} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 5px ${s.color}` }} />
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{s.label}</span>
                              </div>
                            ))}
                          </div>
                          {/* <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
                            <RiseOutlined style={{ color: '#22c55e', fontSize: 9 }} />
                            <span className="text-[9px] font-black" style={{ color: '#22c55e' }}>{effPct}%</span>
                          </div> */}
                        </div>
                      </div>
                    );
                  })()}
              </DashboardCard>
              
              

                <DashboardCard id="khyanalt-tasks" title="Хуваарилагдсан ажилууд" icon={<CheckSquareOutlined/>} headerClass="border-blue-500" rightActions={<span className="text-emerald-500 text-[11px] font-bold cursor-pointer hover:underline" onClick={() => router.push('/khyanalt/uilchilgee/tuluvluguu')}>Бүгдийг үзэх <DownOutlined className="text-[8px]"/></span>}>
                  <div className="flex flex-col gap-2">
                    {tasks.slice(0, 7).map(task => (
                      <div 
                        key={task._id} 
                        className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/5 cursor-pointer transition-colors px-1 rounded-lg group"
                        onClick={() => router.push(`/khyanalt/uilchilgee/tuluvluguu?taskId=${task._id}`)}
                      >
                         <CheckSquareOutlined className={`${task.tuluv === "duussan" ? "text-emerald-500" : "text-gray-400"} shrink-0`} />
                         <span className="text-gray-800 dark:text-gray-200 text-[12px] font-bold flex-1 truncate group-hover:text-blue-500 transition-colors">{task.ner}</span>
                         
                         <div className="flex items-center gap-2 shrink-0">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-black ${
                               task.zereglel === "yaraltai"  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                               task.zereglel === "nen yaraltai" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                               task.zereglel === "engiin" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                               "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}>
                               {task.zereglel === "yaraltai" ? "Яаралтай" : 
                                task.zereglel === "nen yaraltai" ? "Нэн яаралтай" : 
                                task.zereglel === "engiin" ? "Энгийн" : "Бага"}
                            </span>
                            <span className="flex items-center gap-1 text-[9px] text-gray-400 font-bold w-16 justify-end">
                               <CalendarOutlined className="text-[9px] opacity-50" />
                               {task.duusakhTsag ? moment(task.duusakhTsag).format("MM/DD") : "--"}
                            </span>
                         </div>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400 uppercase font-black text-[10px] tracking-widest gap-2">
                        <CheckSquareOutlined className="text-2xl opacity-20" />
                        Даалгавар байхгүй
                      </div>
                    )}
                  </div>
                </DashboardCard>

                
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
            

              
             
                

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
                          <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black"
                            style={{ background: `${ac}22`, border: `1.5px solid ${ac}50`, color: ac }}>
                            {member.name?.charAt(0).toUpperCase()}
                          </div>
                            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200 truncate leading-none">{member.name}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {overdue > 0 && (
                                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full"
                                    style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                                    {overdue} Хугацаа хэтэрсэн
                                  </span>
                                )}
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 tracking-wider">
                                  {member.kpi} KPI
                                </span>
                                <span className="text-[10px] font-black tabular-nums" style={{ color: ac }}>{pct}%</span>
                              </div>
                            </div>
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
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[8px] font-bold" style={{ color: '#22c55e' }}>{done} Дууссан</span>
                              {active > 0 && <span className="text-[8px] font-bold" style={{ color: '#0096FF' }}>{active} Идэвхтэй</span>}
                              {overdue > 0 && <span className="text-[8px] font-bold" style={{ color: '#ef4444' }}>{overdue} Хугацаа хэтэрсэн</span>}
                              {remaining > 0 && <span className="text-[8px] font-bold text-gray-400">{remaining} Хүлээгдэж буй</span>}
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

                 <DashboardCard title="Сүүлийн үйлчлүүлэгчид" icon={<UserOutlined/>} headerClass="border-blue-400">
                  <div className="flex flex-col gap-3">
                    {uilchluulegchid.map(user => (
                      <div key={user._id} className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <Avatar size="small" icon={<UserOutlined />} className="bg-gradient-to-tr from-green-300 to-gray-400 dark:from-green-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-black border border-white dark:border-gray-500 shadow-xl" />
                        <div className="flex flex-col min-w-0 flex-1">
                           <span className="text-gray-800 dark:text-gray-200 text-[12.5px] font-extrabold truncate">{user.ner}</span>
                           <span className="text-[10px] text-gray-500 truncate">{user.mail || user.utas?.[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </DashboardCard>

                <DashboardCard title="Бараа материал" icon={<TbBoxSeam/>} headerClass="border-cyan-500">
                  <div className="flex flex-col gap-3">
                    {baraas.map(item => (
                      <div key={item._id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2 last:border-b-0">
                        <div className="flex flex-col min-w-0 flex-1">
                           <span className="text-gray-800 dark:text-gray-200 text-[13px] font-extrabold truncate">{item.ner}</span>
                           <span className="text-[10px] text-gray-500">{item.niiluulegch || "--"}</span>
                        </div>
                        <div className="flex flex-col items-end shrink-0 ml-2">
                           <span className="text-[13px] font-black text-cyan-600 dark:text-cyan-400">{item.uldegdel || 0}</span>
                           <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Үлдэгдэл</span>
                        </div>
                      </div>
                    ))}
                    {baraas.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-6 text-gray-400 gap-1 text-[10px] font-bold uppercase tracking-widest">
                        <PlusOutlined className="text-2xl opacity-20" />
                        Бараа байхгүй
                      </div>
                    )}
                  </div>

                </DashboardCard>
                </div>
            
          </div>
        </div>

        <div className={`transition-all duration-300 flex flex-col shrink-0 z-20 ${isRightPanelExpanded ? 'w-full xl:w-[340px] opacity-100 h-auto xl:h-[calc(102vh-6rem)]' : 'w-0 opacity-0 whitespace-nowrap overflow-hidden'}`}>  
          <div className="flex-1 m-3 bg-white dark:bg-[#1f2636] rounded-[2rem] border border-slate-100 dark:border-slate-800/60 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto w-full flex flex-col [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
              
              <div className="flex items-center justify-end p-4 pb-0 shrink-0">
                <Button type="text" size="small" className="hover:!bg-slate-600/50 hover:text-white transition-all rounded-md px-1 w-6 h-6 border border-slate-700/50" icon={<CloseOutlined className="text-gray-400 text-[10px]" />} onClick={() => setIsRightPanelExpanded(false)} />
              </div>

              {/* 1. Projects Section */}
              <div className="flex flex-col p-4 space-y-3 shrink-0">
                <div className="flex items-center justify-between px-1">
                                  <div className="text-[11px] font-extrabold text-gray-400 mb-2 flex items-center tracking-wide uppercase opacity-70">
                                    <span>Төслүүд</span>
                                  </div>
                                  <Button
                                    type="text"
                                    size="small"
                                    onClick={() => setIsProjectModalVisible(true)}
                                    icon={<PlusOutlined className="text-emerald-400 text-[10px]" />}
                                    className="!text-emerald-400 text-[10px] font-bold hover:!bg-emerald-500/10 rounded-lg"
                                  >
                                    Нэмэх
                                  </Button>
                                </div>
                <div className="flex-1 overflow-y-auto w-full px-3 py-1 space-y-1.5 custom-scrollbar">
                  {loadingProjects ? (
                    <div className="flex justify-center py-4"><Spin size="small" /></div>
                  ) : projects.length === 0 ? (
                    <div className="text-center text-gray-400 text-[11px] py-4 font-medium italic">Төсөл байхгүй байна</div>
                  ) : (
                    projects.map(p => (
                      <div 
                        key={p.id} 
                        className={`flex items-center space-x-3 cursor-pointer group px-3 py-2.5 rounded-2xl transition-all border shadow-sm hover:shadow-md ${selectedProjectIds.includes(p.id) ? 'bg-white dark:bg-gray-800 border-emerald-500/30' : 'bg-gray-50/50 dark:bg-gray-900/40 border-transparent opacity-60 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                        onClick={() => toggleProject(p.id)}
                      >
                        <div 
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg transition-transform group-hover:scale-110 ${!selectedProjectIds.includes(p.id) && 'grayscale-[0.5] opacity-70'}`} 
                          style={{ backgroundColor: p.color || "#10B981" }}
                        >
                          {(p.name || p.ner || "P").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-[13px] font-extrabold text-gray-800 dark:text-gray-100 truncate group-hover:text-emerald-500 transition-colors leading-tight">
                            {p.name || p.ner}
                          </span>
                          <span className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-70">
                            {p.folder || "Ерөнхий"}
                          </span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 shrink-0 transition-opacity">
                          <Tooltip title="Чат">
                            <Button type="text" size="small" icon={<MessageOutlined className="text-gray-400 hover:text-emerald-500 text-[12px]" />} onClick={(e) => openProjectChat(p, e)} />
                          </Tooltip>
                          <Tooltip title="Засах">
                            <Button type="text" size="small" icon={<EditOutlined className="text-gray-400 hover:text-blue-500 text-[12px]" />} onClick={(e) => { e.stopPropagation(); handleEditProject(p); }} />
                          </Tooltip>
                          <Popconfirm title="Төслийг устгах уу?" onConfirm={(e) => { e.stopPropagation(); handleDeleteProject(p.id); }} onCancel={(e) => e.stopPropagation()}>
                            <Button type="text" size="small" icon={<DeleteOutlined className="text-gray-400 hover:text-red-500 text-[12px]" />} onClick={(e) => e.stopPropagation()} />
                          </Popconfirm>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-b border-slate-200 dark:border-slate-700/50 mx-4"></div>

              {/* 2. Team Section */}
              <div className="flex flex-col p-4 shrink-0">
                <div className="text-[11px] font-extrabold text-gray-400 mb-3 px-1 flex items-center tracking-wide uppercase opacity-70">
                  <span>Ажилчид</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {teamMembers.map((member, i) => (
                    <div key={i} className="flex items-center group cursor-pointer transition-all px-3 py-2.5 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-500/5 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/10 shadow-sm hover:shadow-md">
                      <div className="flex items-center space-x-4 w-full">
                        <Avatar size="medium" className="bg-gradient-to-tr from-emerald-400 to-teal-600 dark:from-emerald-700 dark:to-teal-900 text-white text-[12px] font-black border-2 border-white dark:border-gray-800 shadow-xl shrink-0">
                          {(member.name || "").slice(0, 1).toUpperCase()}
                        </Avatar>
                        <div className="flex flex-col min-w-0 flex-1 justify-center">
                          <div className="text-[13px] font-bold text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate leading-tight transition-colors">{member.name}</div>
                          <div className="text-[10px] text-gray-500 font-medium leading-tight mt-1 opacity-70 uppercase tracking-widest">{member.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-slate-200 dark:border-slate-700/50 mx-4"></div>

              {/* 3. History Section */}
              <div className="flex flex-col p-4 shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="text-[11px] font-extrabold text-gray-400 flex items-center tracking-wide uppercase opacity-70">
                    <span>Түүх</span>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-4 px-2 custom-scrollbar">
                  {loadingHistory ? (
                    <div className="flex justify-center py-4"><Spin size="small" /></div>
                  ) : history.length === 0 ? (
                    <div className="text-center text-gray-400 text-[11px]">Түүх байхгүй байна</div>
                  ) : (
                    history.slice(0, 10).map((act) => (
                      <div key={act._id || act.id} className="hover:scale-105 relative pl-5 before:content-[''] before:absolute before:left-[5px] before:top-4 before:w-[1px] before:h-[130%] before:bg-slate-400/30 dark:before:bg-slate-600/30 last:before:hidden transition-all">
                        <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800 z-10 shadow-sm"></div>
                        <div className="text-[10px] leading-relaxed">
                          {act.ajiltniiNer && <span className="text-gray-500 dark:text-gray-400 font-bold">{act.ajiltniiNer} </span>}
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
                          {act.taskNer && <span className="text-emerald-500 font-extrabold ml-1">{act.taskNer}</span>}
                        </div>
                        <div className="text-[9px] text-gray-500 mt-0.5 font-medium opacity-70">
                          {act.createdAt ? dayjs(act.createdAt).format("MM/DD HH:mm") : "--:--"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 shrink-0 mt-auto">
                <div 
                  className="bg-white dark:bg-gray-800 dark:hover:bg-emerald-500/10 hover:bg-emerald-600 transition-all cursor-pointer rounded-xl px-4 py-3 flex items-center justify-center gap-2.5 border border-slate-700/50 shadow-md group"
                  onClick={() => setIsTutorialOpen(true)}
                >
                    <QuestionCircleOutlined className="text-gray-700 dark:text-gray-300 text-[14px] group-hover:text-white transition-colors" />
                    <span className="text-gray-700 dark:text-gray-300 text-[11px] font-bold group-hover:text-white transition-colors">Тусламж</span>
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

      <Modal
        title={editingProject ? t("Төсөл засах") : t("Шинэ төсөл эхлүүлэх")}
        open={isProjectModalVisible}
        onCancel={() => { setIsProjectModalVisible(false); setEditingProject(null); projectForm.resetFields(); }}
        footer={null}
        width={480}
        centered
      >
        <Form form={projectForm} layout="vertical" onFinish={handleCreateProject} className="space-y-6">
          <Form.Item 
            name="name" 
            label={<span className="text-gray-400 text-[10px] font-black uppercase pl-1">Төслийн нэр</span>}
            required
            rules={[{ required: true, message: 'Төслийн нэр оруулна уу' }]}
          >
            <Input placeholder="Жишээ нь: Барилга А засвар" className="h-12 rounded-xl" />
          </Form.Item>

          <Form.Item 
            name="tailbar" 
            label={<span className="text-gray-400 text-[10px] font-black uppercase pl-1">Тайлбар</span>}
          >
            <Input.TextArea placeholder="Төслийн дэлгэрэнгүй тайлбар..." className="rounded-xl" rows={2} />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="ekhlekhOgnoo" 
              label={<span className="text-gray-400 text-[10px] font-black uppercase pl-1">Эхлэх өдөр</span>}
            >
              <DatePicker className="w-full h-12 rounded-xl" format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item 
              name="duusakhOgnoo" 
              label={<span className="text-gray-400 text-[10px] font-black uppercase  pl-1">Дуусах өдөр</span>}
            >
              <DatePicker className="w-full h-12 rounded-xl" format="YYYY-MM-DD" />
            </Form.Item>
          </div>

          <Form.Item 
            name="color" 
            label={<span className="text-gray-400 text-[10px] font-black uppercase  pl-1">Өнгө</span>}
            initialValue="#10B981"
          >
            <Select className="w-full h-12 [&>.ant-select-selector]:!h-12 [&>.ant-select-selector]:!rounded-xl [&>.ant-select-selector]:!items-center [&>.ant-select-selector]:!flex [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center">
              <Select.Option value="#10B981"><div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-lg bg-[#10B981] shadow-sm"></div><span className="font-bold">Ногоон</span></div></Select.Option>
              <Select.Option value="#3B82F6"><div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-lg bg-[#3B82F6] shadow-sm"></div><span className="font-bold">Цэнхэр</span></div></Select.Option>
              <Select.Option value="#8B5CF6"><div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-lg bg-[#8B5CF6] shadow-sm"></div><span className="font-bold">Ягаан</span></div></Select.Option>
              <Select.Option value="#EF4444"><div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-lg bg-[#EF4444] shadow-sm"></div><span className="font-bold">Улаан</span></div></Select.Option>
              <Select.Option value="#F59E0B"><div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-lg bg-[#F59E0B] shadow-sm"></div><span className="font-bold">Шар</span></div></Select.Option>
            </Select>
          </Form.Item>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button onClick={() => { setIsProjectModalVisible(false); setEditingProject(null); projectForm.resetFields(); }}>
              {t("Цуцлах")}
            </Button>
            <Button type="primary" htmlType="submit" loading={savingProject}>
              {editingProject ? t("Хадгалах") : t("Үүсгэх")}
            </Button>
          </div>
        </Form>
      </Modal>

      <Drawer
        title={null}
        closable={false}
        visible={isProjectChatVisible}
        onClose={() => setIsProjectChatVisible(false)}
        width={typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 400}
        placement="right"
        className="project-chat-drawer !p-0"
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%', background: 'transparent' }}
      >
        <style>{`
          .project-chat-drawer .ant-drawer-body { background: transparent; }
          .project-chat-drawer .ant-drawer-content { background: transparent; }
          .pchat-me { background: linear-gradient(135deg,#10b981,#059669); border-radius:1.2rem 1.2rem 0.25rem 1.2rem; }
          .pchat-other { border-radius:1.2rem 1.2rem 1.2rem 0.25rem; }
        `}</style>
        <div className="flex flex-col h-full bg-white dark:bg-[#1b212f]">
          <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-800 shrink-0 bg-emerald-600 dark:bg-[#1b212f]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shadow-lg" style={{ backgroundColor: selectedProjectForChat?.color || '#10B981' }}>
                {(selectedProjectForChat?.name || selectedProjectForChat?.ner || '').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight">{selectedProjectForChat?.name || selectedProjectForChat?.ner}</span>
                <span className="text-[10px] text-emerald-100 dark:text-emerald-400 font-semibold uppercase tracking-wide">Төслийн чат</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button type="text" shape="circle" icon={<CloseOutlined className="text-white md:text-white hover:text-red-400" />} onClick={() => setIsProjectChatVisible(false)} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 bg-gray-50 dark:bg-[#1b212f] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
            {loadingProjectChat ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <Spin size="large" />
                <span className="text-xs font-semibold uppercase tracking-widest animate-pulse text-gray-500">Уншиж байна...</span>
              </div>
            ) : projectChatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <MessageOutlined style={{ fontSize: 28 }} className="text-gray-400 dark:text-gray-500" />
                </div>
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Зурвас байхгүй байна</p>
                  <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">Төслийн талаар бичих зүйлээ энд бичнэ үү</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {projectChatMessages.map((msg, idx) => {
                  const isMe = msg.ajiltniiId === ajiltan?._id;
                  if (msg.isDeleted) {
                    return (
                      <div key={msg._id || idx} className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-center gap-2`}>
                         <div className={`px-4 py-2 bg-gray-800/50 border border-dashed border-gray-700 rounded-xl text-[11px] text-gray-500 italic`}>
                           Мессеж устгагдлаа
                         </div>
                      </div>
                    );
                  }
                  return (
                    <div key={msg._id || idx} className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-center gap-2 group`}>
                      {!isMe && (
                        <Avatar size="medium" className="bg-gradient-to-tr from-emerald-300 to-gray-500 dark:from-emerald-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-black border border-white dark:border-gray-800 shadow-xl">
                          <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                        </Avatar>
                      )}
                      <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && <span className="text-[10px] font-bold text-gray-400 mb-1 ml-1">{msg.ajiltniiNer}</span>}
                        
                        {/* Reply content */}
                        {msg.replyTo?.chatId && (
                           <div className={`mb-1 px-3 py-1 bg-gray-100 dark:bg-gray-800/50 border-l-2 border-emerald-500 rounded-r-lg text-[10px] truncate max-w-full ${isMe ? 'mr-1' : 'ml-1'}`}>
                             <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-1">{msg.replyTo.ajiltniiNer}:</span>
                             <span className="text-gray-500 dark:text-gray-400">{msg.replyTo.medeelel || "(медиа)"}</span>
                           </div>
                        )}

                        {editingProjectMsg?._id === msg._id ? (
                           <div className="flex flex-col gap-2 w-full min-w-[200px]">
                             <Input.TextArea autoFocus value={editProjectMsgText} onChange={e => setEditProjectMsgText(e.target.value)} rows={2} className="rounded-xl text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300" />
                             <div className="flex justify-end gap-2">
                               <Button size="small" type="primary" onClick={() => handleEditProjectChatMsg(msg._id, editProjectMsgText)}>Засах</Button>
                               <Button size="small" onClick={() => setEditingProjectMsg(null)}>Болих</Button>
                             </div>
                           </div>
                        ) : (
                          <div className={`px-4 py-2.5 shadow-md relative group/bubble ${isMe ? 'pchat-me' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-black dark:text-gray-200 pchat-other'}`}>
                            {msg.turul === 'zurag' && (msg.fileZam || msg.fileUrl || msg.path) ? (() => {
                              const path = msg.fileZam || msg.fileUrl || msg.path || "";
                              const url = path.startsWith('http') ? path : (path.startsWith('/') ? `${FSM_BASE_URL}${path}` : `${FSM_BASE_URL}/${path}`);
                              return (
                                <Image src={url} alt="img" className="max-w-[240px] max-h-[300px] object-cover rounded-xl cursor-pointer" preview={{ mask: <div className="text-[10px]">Томруулах</div> }} />
                              );
                            })() : msg.turul === 'file' && (msg.fileZam || msg.fileUrl || msg.path) ? (() => {
                              const path = msg.fileZam || msg.fileUrl || msg.path || "";
                              const url = path.startsWith('http') ? path : (path.startsWith('/') ? `${FSM_BASE_URL}${path}` : `${FSM_BASE_URL}/${path}`);
                              return (
                                <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-emerald-300 bg-white/5 p-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                                  <FileOutlined className="text-emerald-400" />
                                  <span className="truncate max-w-[140px] text-xs text-gray-200">{msg.fileNer || 'Файл'}</span>
                                </a>
                              );
                            })() : (
                              <span className={`text-[13px] ${isMe ? 'text-white' : 'text-gray-800 dark:text-white'} whitespace-pre-wrap leading-relaxed`}>{msg.medeelel}</span>
                            )}
                            
                            {/* Actions overlay */}
                            <div className={`absolute top-0 ${isMe ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1`}>
                               <Tooltip title="Хариулах" placement={isMe ? "left" : "right"}>
                                 <button onClick={() => setReplyToProject({ chatId: msg._id, medeelel: msg.medeelel, ajiltniiNer: msg.ajiltniiNer, turul: msg.turul })} className="w-7 h-7 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 shadow-md border border-gray-100 dark:border-gray-700">
                                   <RollbackOutlined style={{ fontSize: '11px' }} />
                                 </button>
                               </Tooltip>
                               {isMe && (
                                 <>
                                   <Tooltip title="Засах" placement={isMe ? "left" : "right"}>
                                     <button onClick={() => { setEditingProjectMsg(msg); setEditProjectMsgText(msg.medeelel); }} className="w-7 h-7 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 shadow-md border border-gray-100 dark:border-gray-700">
                                       <EditOutlined style={{ fontSize: '11px' }} />
                                     </button>
                                   </Tooltip>
                                   <Tooltip title="Устгах" placement={isMe ? "left" : "right"}>
                                     <button onClick={() => handleDeleteProjectChatMsg(msg._id)} className="w-7 h-7 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 shadow-md border border-gray-100 dark:border-gray-700">
                                       <DeleteOutlined style={{ fontSize: '11px' }} />
                                     </button>
                                   </Tooltip>
                                 </>
                               )}
                            </div>
                          </div>
                        )}
                        <span className={`text-[9px] text-gray-600 mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}>
                          {dayjs(msg.createdAt).format('MM/DD HH:mm')}
                          {msg.isEdited && <span className="ml-1 italic text-gray-500">(зассан)</span>}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={projectChatEndRef} />
              </div>
            )}
          </div>

          <div className="shrink-0 bg-white dark:bg-[#1b212f] border-t border-gray-300 dark:border-gray-700/60 px-4 py-3">
            {replyToProject && (
              <div className="mb-2 flex items-center justify-between px-3 py-1.5 bg-emerald-900/30 border border-emerald-700/40 rounded-xl relative">
                <div className="flex flex-col overflow-hidden">
                   <span className="text-[9px] font-bold text-emerald-400 uppercase">{replyToProject.ajiltniiNer}-д хариулах</span>
                   <span className="text-[10px] text-gray-400 truncate max-w-[300px]">{replyToProject.medeelel || "(медиа)"}</span>
                </div>
                <Button type="text" size="small" icon={<CloseOutlined className="text-[10px] text-gray-500" />} onClick={() => setReplyToProject(null)} />
              </div>
            )}
            {selectedProjectChatFile && (
              <div className="mb-2 flex items-center px-3 py-1.5 bg-emerald-900/30 border border-emerald-700/40 rounded-xl relative w-max">
                <PaperClipOutlined className="text-emerald-400 mr-2" />
                <span className="text-xs font-semibold text-emerald-300 truncate max-w-[200px]">{selectedProjectChatFile.name}</span>
                <Button type="text" size="small" icon={<CloseOutlined className="text-[10px] text-gray-500" />} className="absolute right-1" onClick={() => setSelectedProjectChatFile(null)} />
              </div>
            )}
            <div className="relative flex items-center bg-[#f3f4f6] dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/60 shadow-inner overflow-hidden">
              <Upload customRequest={handleProjectFileUpload} showUploadList={false} className="absolute left-3 top-1/2 -translate-y-1/2 z-10" disabled={uploadingProjectChatFile}>
                <Button type="text" shape="circle" icon={uploadingProjectChatFile ? <LoadingOutlined className="text-emerald-500" /> : <PaperClipOutlined className="text-gray-500 hover:text-emerald-400 text-lg" />} disabled={uploadingProjectChatFile} className="p-0 border-none" />
              </Upload>
              <Input.TextArea
                placeholder="Зурвас бичих..."
                autoSize={{ minRows: 1, maxRows: 5 }}
                value={projectChatInput}
                onChange={(e) => setProjectChatInput(e.target.value)}
                onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleSendProjectMessage(); } }}
                style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: 'inherit', outline: 'none' }}
                className="pl-12 pr-12 py-3 resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400 custom-scrollbar"
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleSendProjectMessage} disabled={(!projectChatInput.trim() && !selectedProjectChatFile) || uploadingProjectChatFile} loading={uploadingProjectChatFile} className="absolute right-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 border-none h-8 w-8 rounded-lg flex items-center justify-center shadow-md" />
            </div>
          </div>
        </div>
      </Drawer>

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
