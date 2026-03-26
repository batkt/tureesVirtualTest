import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createPortal } from 'react-dom';
import fsmApi, { FSM_BASE_URL_ZEV as FSM_BASE_URL } from "services/fsmApi";
import { useAuth } from "services/auth";
import { useTranslation } from "react-i18next";
import useJagsaalt from "hooks/useJagsaalt";
import moment from "moment";
import "moment/locale/mn";
import { toast } from "sonner";
import { useThemeValue } from "pages";
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
  Progress,
  Popconfirm,
  Tooltip,
  Form,
  Input,
  AutoComplete,
  InputNumber,
  Drawer,
  Divider,
  Upload,
  Image
} from "antd";
import { useFsmSocket } from "hooks/useFsmSocket";
import { useRouter } from "next/router";
import { SiMaterialdesign } from "react-icons/si";
import { TbBoxSeam } from "react-icons/tb";

function DashboardCard({ id, title, icon, rightActions, children, headerClass="border-emerald-500" }) {
  return (
    <div id={id} className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border-t-[3px] ${headerClass} hover:shadow-emerald-500 dark:hover:shadow-emerald-500/10 flex flex-col relative min-h-[300px] h-[340px]`}>
      <div className="flex justify-between items-center px-4 py-3 bg-blue-900/10 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-bold text-[12.5px] ">
          <span className="text-gray-400 dark:text-gray-300">{icon}</span> {title}
        </div>
        
      </div>
      <div className="p-4 dark:bg-gray-900/40 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
        {children}
      </div>
    </div>
  )
}

function Khynalt() {
  const router = useRouter();

  const isTaskOnDay = useCallback((task, day) => {
    if (!task || !day) return false;
    const targetDay = moment(day).startOf('day');
    
    const isLoop = task.isLoop === true || task.isLoop === 'true';
    const isDay = task.isDay === true || task.isDay === 'true';
    const startOgnoo = task.ekhlekhOgnoo || task.ekhlekhTsag;
    const endOgnoo = task.duusakhOgnoo || task.duusakhTsag;
    
    // Logic aligned with CleaningTask.isOnDay in Flutter:
    
    // 1. If it's a loop or full-day task, check the range properly
    if (isLoop || isDay) {
      if (!startOgnoo) return false;
      const start = moment(startOgnoo).startOf('day');
      
      if (endOgnoo) {
        const end = moment(endOgnoo).startOf('day');
        return targetDay.isSameOrAfter(start) && targetDay.isSameOrBefore(end);
      }
      
      // No end date means it's ongoing from start
      return targetDay.isSameOrAfter(start);
    }
    
    // 2. Fallback to single date check
    const taskDate = task.ekhlekhTsag || task.ekhlekhOgnoo || task.createdAt;
    return moment(taskDate).isSame(targetDay, 'day');
  }, []);
  const { themeValue } = useThemeValue();
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
  const [companyKpis, setCompanyKpis] = useState([]);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [isKpiModalVisible, setIsKpiModalVisible] = useState(false);
  const [selectedMemberForKpi, setSelectedMemberForKpi] = useState(null);
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
  const api = useMemo(() => fsmApi.withAuth(token, FSM_BASE_URL), [token, FSM_BASE_URL]);

  const fetchData = useCallback(async () => {
    if (!barilgiinId) return;
    setLoading(true);
    setLoadingHistory(true);
    setLoadingProjects(true);
    try {
      const [tRes, bRes, uRes, pRes, hRes, kRes] = await Promise.all([
        api.get("/tasks", { params: { barilgiinId, baiguullagiinId } }),
        api.get("/baraas", { params: { barilgiinId, baiguullagiinId } }),
        api.get("/uilchluulegch", { params: { barilgiinId, baiguullagiinId } }),
        api.get("/projects", { params: { barilgiinId, baiguullagiinId } }),
        api.get("/task-tuukh", { params: { barilgiinId } }),
        api.get(`/baiguullaga/${baiguullagiinId}/kpi`)
      ]);
      const rawTasks = tRes.data?.data || (Array.isArray(tRes.data) ? tRes.data : []);
      // Unique tasks by sourceTaskId or _id, keeping the latest update
      const tasksMap = new Map();
      rawTasks.forEach(task => {
        const id = task.sourceTaskId || task._id;
        if (!tasksMap.has(id) || moment(task.updatedAt).isAfter(moment(tasksMap.get(id).updatedAt))) {
          tasksMap.set(id, task);
        }
      });
      const uniqueTasksList = Array.from(tasksMap.values());
      
      setTasks(uniqueTasksList);
      setBaraas(bRes.data?.data || (Array.isArray(bRes.data) ? bRes.data : []));
      setUilchluulegchid(uRes.data?.data || (Array.isArray(uRes.data) ? uRes.data : []));
      const pList = pRes.data?.data || (Array.isArray(pRes.data) ? pRes.data : []);
      const normalized = pList.map(p => ({ ...p, id: p._id, name: p.ner }));
      setProjects(normalized);
      setSelectedProjectIds(normalized.map(p => p.id));
      setHistory(hRes.data?.data || (Array.isArray(hRes.data) ? hRes.data : []));
      setCompanyKpis(kRes.data?.data || []);
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
    selectedProjectForChat ? (selectedProjectForChat.id || selectedProjectForChat._id) : null,
    null,
    barilgiinId,
    FSM_BASE_URL
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
      toast.error('Зурвас илгээхэд алдаа гарлаа');
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
      toast.error('Засахад алдаа гарлаа');
    }
  };

  const handleDeleteProjectChatMsg = async (msgId) => {
    try {
      await api.delete(`/chats/${msgId}`);
      setProjectChatMessages(prev => prev.map(m => m._id === msgId ? { ...m, isDeleted: true } : m));
    } catch (err) {
      toast.error('Устгахад алдаа гарлаа');
    }
  };

  const handleProjectFileUpload = (options) => {
    setSelectedProjectChatFile(options.file);
    setTimeout(() => { options.onSuccess('ok'); }, 100);
  };

  useEffect(() => {
    if (fsmSocket) {
      const handleTaskUpdate = () => fetchData();
      const handleProjectUpdate = () => fetchData();

      fsmSocket.on("task_updated", handleTaskUpdate);
      fsmSocket.on("project_updated", handleProjectUpdate);

      return () => {
        fsmSocket.off("task_updated", handleTaskUpdate);
        fsmSocket.off("project_updated", handleProjectUpdate);
      };
    }
  }, [fsmSocket, fetchData]);

  const handleCreateProject = async (values) => {
    if (!barilgiinId) { toast.warning("Барилгын мэдээлэл байхгүй байна"); return; }
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
        toast.success(`Төсөл амжилттай ${editingProject ? 'засагдлаа' : 'нэмэгдлээ'}`);
        await fetchData();
        setIsProjectModalVisible(false);
        projectForm.resetFields();
        setEditingProject(null);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || `Төсөл ${editingProject ? 'засахад' : 'нэмэхэд'} алдаа гарлаа`);
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
        toast.success("Төсөл амжилттай устгагдлаа");
        setSelectedProjectIds(prev => prev.filter(pId => pId !== id));
        await fetchData();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Төсөл устгахад алдаа гарлаа");
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

  const handleMemberClick = (member) => {
    setSelectedMemberForKpi(member);
    setIsKpiModalVisible(true);
  };
  
  

  const teamMembers = useMemo(() => {
    return ajiltanJagsaalt?.jagsaalt?.map(a => {
      const aId = a._id || a.id;
      const kpiInfo = companyKpis.find(k => k._id === aId || k.ajiltniiId === aId);
      
      const memberTasks = tasks.filter(t =>
        t.hariutsagchId === aId || 
        (Array.isArray(t.ajiltnuud) && t.ajiltnuud.some(uid => uid === aId)) ||
        t.user?._id === aId
      );
      
      const doneCount = memberTasks.filter(t => t.tuluv === 'duussan' || t.tuluv === 'shalga').length;
      const activeCount = memberTasks.filter(t => t.tuluv === 'khiigdej bui').length;
      const overdueCount = memberTasks.filter(t => 
        t.tuluv !== 'duussan' && 
        t.tuluv !== 'shalga' &&
        (t.khugatsaaDuusakhOgnoo || t.duusakhTsag) && 
        moment(t.khugatsaaDuusakhOgnoo || t.duusakhTsag).isBefore(moment(), 'day')
      ).length;
      const remainingCount = Math.max(memberTasks.length - doneCount - activeCount - overdueCount, 0);
      
      const scoredTasks = memberTasks.filter(t => t.onooson != null);
      const dynamicAvg = scoredTasks.length > 0 
        ? (scoredTasks.reduce((acc, t) => acc + t.onooson, 0) / scoredTasks.length).toFixed(1)
        : (kpiInfo?.kpiDundaj || 0);

      return {
        id: aId,
        name: a.ner || a.nevtrekhNer || 'Ажилтан',
        role: a.albanTushaal || a.erkh || "Ажилтан",
        kpi: kpiInfo?.kpiHuvv || 0,
        kpiOnoo: kpiInfo?.kpiOnoo || 0,
        kpiDaalgavarToo: doneCount,
        kpiDundaj: dynamicAvg,
        lastShineelsn: kpiInfo?.kpiShineelsenOgnoo,
        doneCount,
        activeCount,
        overdueCount,
        remainingCount,
        totalTasks: memberTasks.length
      };
    }) || [];
  }, [ajiltanJagsaalt?.jagsaalt, companyKpis, tasks]);

  const statCards = useMemo(() => {
    const today = moment().startOf('day');
    const tasksToday = tasks.filter(t => isTaskOnDay(t, today));
    
    // Unify logic: Done count should reflect tasks actually finished today
    // to match chart and avoid "5 in chart but 3 in card" discrepancy
    const doneToday = tasks.filter(t => {
      if (t.tuluv !== 'duussan' && t.tuluv !== 'shalga') return false;
      const completeDate = t.duussanOgnoo || t.updatedAt;
      return moment(completeDate).isSame(today, 'day');
    }).length;
    
    return [
      { title: "Нийт ажил", value: tasks.length.toString() },
      { title: "Өнөөдрийн ажил", value: tasksToday.length.toString() },
      { title: "Яаралтай ажил", value: tasksToday.filter(t => t.zereglel === "yaraltai" || t.zereglel === "nen yaraltai").length.toString() },
      { title: "Дууссан", value: doneToday.toString() },
      { title: "Бараа материал", value: baraas.length.toString() },
    ];
  }, [tasks, baraas, isTaskOnDay]);

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
    // From (chartRange-1) days ago to today
    for (let i = chartRange - 1; i >= 0; i--) {
      days.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
    }
    return days.map(day => {
      const dayMoment = moment(day);
      
      const doneTasks = tasks.filter(t => {
        if (t.tuluv !== 'duussan' && t.tuluv !== 'shalga') return false;
        const completeDate = t.duussanOgnoo || t.updatedAt;
        return moment(completeDate).isSame(dayMoment, 'day');
      });

      const activeTasks = tasks.filter(t => {
        return t.tuluv === 'khiigdej bui' && isTaskOnDay(t, dayMoment);
      });
      
      const waitingTasks = tasks.filter(t => {
        const isWaitingOrOverdue = t.tuluv === 'khuleegdej bui' || t.tuluv === 'shine' || t.tuluv === 'khugatsaa khetersen';
        if (!isWaitingOrOverdue) return false;
        
        return isTaskOnDay(t, dayMoment);
      });

      return { 
        label: dayMoment.format('M/D'), 
        done: doneTasks.length, 
        active: activeTasks.length, 
        waiting: waitingTasks.length, 
        overdue: 0,
        doneTasks: doneTasks.map(t => t.ner || t.title),
        activeTasks: activeTasks.map(t => t.ner || t.title),
        waitingTasks: waitingTasks.map(t => t.ner || t.title)
      };
    });
  }, [tasks, chartRange, isTaskOnDay]);

  const projectStats = useMemo(() => {
    return projects.map(p => {
      const pTasks = tasks.filter(t => t.projectId === p.id || t.projectId === p._id);
      const done = pTasks.filter(t => t.tuluv === 'duussan' || t.tuluv === 'shalga').length;
      const total = pTasks.length;
      
      return {
        id: p.id || p._id,
        name: p.name || p.ner,
        color: p.color || '#10B981',
        total,
        done,
        pct: total > 0 ? Math.round((done / total) * 100) : 0
      };
    }).sort((a, b) => b.total - a.total).slice(0, 10);
  }, [projects, tasks]);

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
          <div className="flex justify-between items-center px-1">
          
        </div>
          <div id="khyanalt-stats" className="hideScroll grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 shrink-0 pt-1">
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
              <DashboardCard id="khyanalt-activity-chart" title={<div className="flex flex-col"><span className="leading-tight">Гүйцэтгэлийн хандлага</span><span className="text-[10px] text-gray-400 font-normal uppercase mt-0.5">Өнөөдрийн төлөв байдал</span></div>} icon={<AreaChartOutlined/>} headerClass="border-green-500" rightActions={
                <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
                  {[7, 14, 30].map(r => (
                    <button
                      key={r}
                      onClick={() => setChartRange(r)}
                      className={`text-[12px] font-bold uppercase px-2 py-0.5 rounded-md transition-all ${chartRange === r ? 'bg-sky-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
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

                    const today = moment();
                    const tasksForToday = tasks.filter(t => isTaskOnDay(t, today));
                    
                    const doneTotal   = tasks.filter(t => {
                        if (t.tuluv !== 'duussan' && t.tuluv !== 'shalga') return false;
                        const completeDate = t.duussanOgnoo || t.updatedAt;
                        return moment(completeDate).isSame(today, 'day');
                    }).length;
                    const activeTotal  = tasksForToday.filter(t => t.tuluv === 'khiigdej bui').length;
                    const waitingTotal = tasksForToday.filter(t => t.tuluv === 'khuleegdej bui' || t.tuluv === 'shine' || t.tuluv === 'khugatsaa khetersen').length;
                    
                    const overdueCalc = tasks.filter(t => {
                        const deadlineAt = t.khugatsaaDuusakhOgnoo || t.duusakhTsag;
                        if (!deadlineAt) return false;
                        const deadline = moment(deadlineAt);
                        if (t.tuluv === 'duussan' || t.tuluv === 'shalga') {
                            return moment(t.duussanOgnoo || t.updatedAt).isAfter(deadline);
                        }
                        return deadline.isBefore(moment());
                    }).length;

                    // Calculate max based on raw values (stops "1 waiting higher than 6 completed")
                    const seriesMax = Math.max(...multiChartData.map(d => Math.max(d.done, d.active, d.waiting, d.overdue, 1)));

                    const mkPts = (key) => multiChartData.map((d, i) => {
                      let val = d[key];
                      // Removed stacking to show absolute values (stops "1 waiting higher than 6 completed")
                      
                      return {
                        x: PAD_L + i * step,
                        y: BASE - (val / seriesMax) * (BASE - 10),
                        v: d[key],
                        tasks: d[`${key}Tasks`] || []
                      };
                    });

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
                      { key: 'waiting', color: '#f59e0b', gradId: 'gradAmber', glowId: 'glowAmber', label: "Хүлээгдэж буй", count: waitingTotal, isArea: true },
                      { key: 'active',  color: '#3b82f6', gradId: 'gradBlue',  glowId: 'glowBlue',  label: "Идэвхтэй", count: activeTotal, isArea: true  },
                      { key: 'done',    color: '#22c55e', gradId: 'gradGreen', glowId: 'glowGreen', label: "Дууссан", count: doneTotal, isArea: true    },
                    ];

                    return (
                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {series.map(s => (
                            <div key={s.key} className="flex items-baseline gap-1 px-2.5 py-1 rounded-lg"
                              style={{ background: `${s.color}14`, border: `1px solid ${s.color}30` }}>
                              <span className="text-base font-bold leading-none" style={{ color: s.color }}>{s.count}</span>
                              <span className="text-[8px] font-bold uppercase " style={{ color: s.color, opacity: 0.75 }}>{s.label}</span>
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
                                  {s.isArea && <path d={mkArea(pts)} fill={`url(#${s.gradId})`} />}
                                  <path
                                    d={mkSmooth(pts)}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth={s.key === 'overdue' ? "3" : "2"}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray={s.key === 'overdue' ? "4 2" : "none"}
                                    filter={`url(#${s.glowId})`}
                                  />
                                   {pts.map((pt, i) => (
                                    <Tooltip
                                      key={i}
                                      title={
                                        <div className={`flex flex-col gap-1 ${themeValue ? 'text-gray-100' : 'text-gray-900'}`}>
                                          <div className={`font-bold border-b ${themeValue ? 'border-white/10' : 'border-gray-100'} pb-1 mb-1 text-[13px]`}>{s.label} ({pt.v})</div>
                                          {pt.tasks.length > 0 ? (
                                            pt.tasks.map((name, idx) => (
                                              <div key={idx} className="text-[11px] flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
                                                <span className="truncate max-w-[150px] font-medium">{name}</span>
                                              </div>
                                            ))
                                          ) : (
                                            <div className="text-[10px] opacity-60 italic">Ажил байхгүй</div>
                                          )}
                                        </div>
                                      }
                                      placement="top"
                                      color={themeValue ? "#111827" : "#ffffff"}
                                      overlayInnerStyle={{ 
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                                        border: themeValue ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                                        borderRadius: '12px'
                                      }}
                                    >
                                      <g className="group/pt cursor-pointer">
                                        <circle cx={pt.x} cy={pt.y} r="8" fill={s.color} fillOpacity="0"
                                          className="transition-all duration-150 group-hover/pt:fill-opacity-20" />
                                        <circle cx={pt.x} cy={pt.y} r="2.5" fill="#fff" stroke={s.color} strokeWidth="1.8" />
                                        <g className="opacity-0 group-hover/pt:opacity-100 transition-opacity duration-100" style={{ pointerEvents: 'none' }}>
                                          <rect x={pt.x - 8} y={pt.y - 16} width="16" height="11" rx="3"
                                            fill={themeValue ? "#111827" : "#fff"} stroke={s.color} strokeWidth="0.5" />
                                          <text x={pt.x} y={pt.y - 8} fill={s.color} fontSize="6" fontWeight="900" textAnchor="middle">{pt.v}</text>
                                        </g>
                                      </g>
                                    </Tooltip>
                                  ))}
                                </g>
                              );
                            })}
                            {multiChartData.filter((_, idx) => {
                              if (chartRange <= 7) return true;
                              if (chartRange <= 14) return idx % 2 === 0;
                              return idx % 5 === 0;
                            }).map((d, i) => {
                              const pt = mkPts('done').filter((_, idx) => {
                                if (chartRange <= 7) return true;
                                if (chartRange <= 14) return idx % 2 === 0;
                                return idx % 5 === 0;
                              })[i];

                              return (
                                <text key={i} x={pt.x} y={H + 10} fill="currentColor" fontSize="5.5" fontWeight="700"
                                  textAnchor="middle" className="text-gray-400 dark:text-gray-500">
                                  {d.label}
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
                                <span className="text-[8px] font-bold text-gray-400 uppercase ">{s.label}</span>
                              </div>
                            ))}
                          </div>
                          {/* <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
                            <RiseOutlined style={{ color: '#22c55e', fontSize: 9 }} />
                            <span className="text-[12px] font-bold" style={{ color: '#22c55e' }}>{effPct}%</span>
                          </div> */}
                        </div>
                      </div>
                    );
                  })()}
              </DashboardCard>



                <DashboardCard id="khyanalt-tasks" title="Олгогдсон ажлууд" icon={<CheckSquareOutlined/>} headerClass="border-green-500" rightActions={<span className="text-emerald-500 text-[12px] font-bold cursor-pointer hover:underline" onClick={() => router.push('/khyanalt/uilchilgee/tuluvluguu')}>Бүгдийг харах <DownOutlined className="text-[8px]"/></span>}>
                  <div className="flex flex-col gap-2">
                    {(() => {
                      const today = moment();
                      const sortedTasks = [...tasks].sort((a, b) => {
                        const aIsToday = isTaskOnDay(a, today);
                        const bIsToday = isTaskOnDay(b, today);
                        if (aIsToday && !bIsToday) return -1;
                        if (!aIsToday && bIsToday) return 1;
                        return moment(b.createdAt).diff(moment(a.createdAt));
                      }).slice(0, 10);

                      return sortedTasks.map(task => {
                        const isToday = isTaskOnDay(task, today);
                        const start = task.ekhlekhOgnoo || task.ekhlekhTsag;
                        const isStartingToday = start && moment(start).isSame(today, 'day');

                        return (
                          <div
                            key={task._id}
                            className={`flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/5 cursor-pointer transition-colors px-1 rounded-lg group ${isToday ? 'bg-emerald-50/30 dark:bg-emerald-500/5' : ''}`}
                            onClick={() => router.push(`/khyanalt/uilchilgee/tuluvluguu?taskId=${task._id}`)}
                          >
                             <CheckSquareOutlined className={`${task.tuluv === "duussan" ? "text-emerald-500" : "text-gray-400"} shrink-0`} />
                             <span className="text-gray-800 dark:text-gray-200 text-[12px] font-bold flex-1 truncate group-hover:text-blue-500 transition-colors">
                               {task.ner}
                               {(task.isLoop === true || task.isLoop === 'true') && (
                                 <Tooltip title="Өдөр бүр давтагдах">
                                   <RollbackOutlined className="ml-2 text-purple-500 text-[10px]" />
                                 </Tooltip>
                               )}
                             </span>

                             <div className="flex items-center gap-2 shrink-0">
                                <span className={`px-1.5 py-0.5 rounded text-[12px]  font-bold ${
                                   task.zereglel === "yaraltai"  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                                   task.zereglel === "nen yaraltai" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                   task.zereglel === "engiin" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                                   "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                }`}>
                                   {task.zereglel === "yaraltai" ? "Яаралтай" :
                                    task.zereglel === "nen yaraltai" ? "Нэн яаралтай" :
                                    task.zereglel === "engiin" ? "Энгийн" : "Бага"}
                                </span>
                                <span className={`px-1.5 py-0.5 w-20 text-center rounded text-[12px]  font-bold ${
                                   task.tuluv === "duussan" || task.tuluv === "shalga" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                   task.tuluv === "khiigdej bui" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                                   task.tuluv === "khugatsaa khetersen" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                   "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                                }`}>
                                   {task.tuluv === "duussan" || task.tuluv === "shalga" ? "Дууссан" :
                                    task.tuluv === "khiigdej bui" ? "Идэвхтэй" :
                                    task.tuluv === "khugatsaa khetersen" ? "Хэтэрсэн" :
                                    "Хүлээгдэж буй"}
                                </span>
                                <span className="flex items-center gap-1 text-[12px] text-gray-400 font-bold w-16 justify-end">
                                   <CalendarOutlined className="text-[12px] opacity-50" />
                                   <span className={isToday ? "text-emerald-500" : ""}>
                                      {start ? moment(start).format("MM/DD") : (task.duusakhTsag ? moment(task.duusakhTsag).format("MM/DD") : "--")}
                                   </span>
                                </span>
                             </div>
                          </div>
                        );
                      });
                    })()}
                    {tasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400 uppercase font-bold text-[12px]  gap-2">
                        <CheckSquareOutlined className="text-2xl opacity-20" />
                        Ажил хуваарилаагүй
                      </div>
                    )}
                  </div>
                </DashboardCard>


                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-5 mt-5">




                <DashboardCard title="Ажилтны гүйцэтгэл" icon={<TeamOutlined/>} headerClass="border-green-500">
                  <div className="flex flex-col gap-2">
                    {teamMembers.map((member, i) => {
                      const total     = member.totalTasks;
                      const done      = member.doneCount;
                      const active    = member.activeCount;
                      const overdue   = member.overdueCount;
                      const remaining = member.remainingCount;
                      const pct       = total > 0 ? Math.round((done / total) * 100) : 0;

                      const avatarColors = ['#0096FF','#0096FF','#0096FF','#0096FF','#0096FF'];
                      const ac = avatarColors[i % avatarColors.length];

                      return (
                        <div key={member.id}
                          onClick={() => handleMemberClick(member)}
                          className="group flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white dark:hover:bg-white/10 hover:shadow-md cursor-pointer transition-all border border-transparent hover:border-emerald-500/20"
                        >
                          <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold"
                            style={{ background: `${ac}22`, border: `1.5px solid ${ac}50`, color: ac }}>
                            {member.name?.charAt(0).toUpperCase()}
                          </div>
                            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200 truncate leading-none">{member.name}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {overdue > 0 && (
                                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                                    style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                                    {overdue} Хугацаа хэтэрсэн
                                  </span>
                                )}
                                <span className="text-[12px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 r">
                                  {member.kpi} KPI
                                </span>
                                <span className="text-[12px] font-bold tabular-nums" style={{ color: ac }}>{pct}%</span>
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
                      <div className="flex flex-col items-center justify-center py-6 text-gray-400 gap-1 text-[12px] font-bold uppercase ">
                        <TeamOutlined className="text-2xl opacity-20" />
                        Ажилтан байхгүй
                      </div>
                    )}
                  </div>
                </DashboardCard>

                 <DashboardCard title="Төслүүдийн гүйцэтгэл" icon={<SiMaterialdesign/>} headerClass="border-emerald-500">
                  <div className="flex flex-col gap-4">
                    {projectStats.map(p => (
                      <div key={p.id} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[12px] font-bold">
                          <span className="text-gray-700 dark:text-gray-200 truncate pr-2">{p.name}</span>
                          <span className="text-gray-400 shrink-0">{p.done} / {p.total}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
                           {p.total > 0 && (
                             <div 
                               className="h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                               style={{ width: `${p.pct}%`, background: p.color }} 
                             />
                           )}
                        </div>
                      </div>
                    ))}
                    {projectStats.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400 uppercase font-bold text-[12px] gap-2">
                        <SiMaterialdesign className="text-2xl opacity-20" />
                        Төсөл байхгүй
                      </div>
                    )}
                  </div>
                </DashboardCard>

                <DashboardCard title="Бараа материал" icon={<TbBoxSeam/>} headerClass="border-green-500">
                  <div className="flex flex-col gap-3">
                    {baraas.map(item => (
                      <div key={item._id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2 last:border-b-0">
                        <div className="flex flex-col min-w-0 flex-1">
                           <span className="text-gray-800 dark:text-gray-200 text-[13px] font-bold truncate">{item.ner}</span>
                           <span className="text-[12px] text-gray-500">{item.niiluulegch || "--"}</span>
                        </div>
                        <div className="flex flex-col items-end shrink-0 ml-2">
                           <span className="text-[13px] font-bold text-cyan-600 dark:text-cyan-400">{item.uldegdel || 0}</span>
                           <span className="text-[10px] text-gray-400 font-bold tracking-tighter">Үлдэгдэл</span>
                        </div>
                      </div>
                    ))}
                    {baraas.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-6 text-gray-400 gap-1 text-[12px] font-bold uppercase ">
                        <PlusOutlined className="text-2xl opacity-20" />
                        Мэдээлэл байхгүй
                      </div>
                    )}
                  </div>

                </DashboardCard>
                </div>

          </div>
        </div>

        <div className={`transition-all duration-300 flex flex-col shrink-0 z-20 ${isRightPanelExpanded ? 'w-full xl:w-[340px] opacity-100 h-auto xl:h-[calc(102vh-6rem)]' : 'w-0 opacity-0 whitespace-nowrap overflow-hidden'}`}>
          <div className="flex-1 m-3 bg-white dark:bg-gray-900 rounded-[2rem] border border-slate-100 dark:border-slate-800/60 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto w-full flex flex-col [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">



              {/* 1. Projects Section */}
              <div className="flex flex-col p-4 space-y-3 shrink-0">
                <div className="flex items-center justify-between px-1">
                                  <div className="text-[12px] font-bold text-gray-400 mb-2 flex items-center  uppercase opacity-70">
                                    <span>Төсөл</span>
                                  </div>
                                  <Button
                                    type="text"
                                    size="small"
                                    onClick={() => setIsProjectModalVisible(true)}
                                    icon={<PlusOutlined className="text-white text-[12px]" />}
                                    className="!text-white bg-green-500 text-[12px] font-bold hover:!bg-emerald-500/10 rounded-lg dark:bg-green-500 dark:text-white"
                                  >
                                    {t("Нэмэх")}
                                  </Button>
                                </div>
                <div className="flex-1 overflow-y-auto w-full px-3 py-1 space-y-1.5 custom-scrollbar">
                  {loadingProjects ? (
                    <div className="flex justify-center py-4"><Spin size="small" /></div>
                  ) : projects.length === 0 ? (
                    <div className="text-center text-gray-400 text-[12px] py-4 font-medium italic">Мэдээлэл байхгүй</div>
                  ) : (
                    projects.map(p => (
                      <div
                        key={p.id}
                        className={`flex items-center space-x-3 cursor-pointer group px-3 py-2.5 rounded-2xl transition-all border shadow-sm hover:shadow-md ${selectedProjectIds.includes(p.id) ? 'bg-white dark:bg-gray-800 border-emerald-500/30' : 'bg-gray-50/50 dark:bg-gray-900/40 border-transparent opacity-60 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                        onClick={() => toggleProject(p.id)}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-transform group-hover:scale-110 ${!selectedProjectIds.includes(p.id) && 'grayscale-[0.5] opacity-70'}`}
                          style={{ backgroundColor: p.color || "#10B981" }}
                        >
                          {(p.name || p.ner || "P").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-[13px] font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-emerald-500 transition-colors leading-tight">
                            {p.name || p.ner}
                          </span>
                          <span className="text-[12px] text-gray-500 dark:text-gray-400 font-bold uppercase  mt-1 opacity-70">
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
              <div id="khyanalt-team" className="flex flex-col p-4 shrink-0">
                <div className="text-[12px] font-bold text-gray-400 mb-3 px-1 flex items-center  uppercase opacity-70">
                  <span>Ажилтан</span>
                </div>
                <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {teamMembers.map((member, i) => {
                    const avatarColors = ['#0096FF','#34D399','#F59E0B','#EF4444','#8B5CF6'];
                    const ac = avatarColors[i % avatarColors.length];
                    const pct = member.totalTasks > 0 ? Math.round((member.doneCount / member.totalTasks) * 100) : 0;

                    return (
                      <div key={i} 
                        onClick={() => handleMemberClick(member)}
                        className="flex flex-col group cursor-pointer transition-all px-3 py-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-500/5 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/10 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center space-x-3 w-full mb-2">
                          <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold border-2 border-white dark:border-gray-800 shadow-lg"
                            style={{ background: `${ac}22`, color: ac, borderColor: `${ac}40` }}>
                            {member.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1 justify-center">
                            <div className="flex items-center justify-between">
                              <div className="text-[13px] font-bold text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate leading-tight transition-colors">{member.name}</div>
                              <span className="text-[11px] font-bold text-emerald-500">{member.kpi}%</span>
                            </div>
                            <div className="text-[10px] text-gray-400 dark:text-gray-600 font-medium leading-tight mt-0.5">{member.role}</div>
                          </div>
                        </div>
                        <div className="w-full space-y-1.5">
                          <div className="flex justify-between items-center px-0.5">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Гүйцэтгэл</span>
                            <span className="text-[10px] font-bold text-gray-500">{pct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                             <div style={{ width: `${pct}%`, background: '#22c55e' }} className="h-full rounded-full" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-b border-slate-200 dark:border-slate-700/50 mx-4"></div>

              {/* 3. History Section */}
              <div className="flex flex-col p-4 shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="text-[12px] font-bold text-gray-400 flex items-center  uppercase opacity-70">
                    <span>{t("Түүх")}</span>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-4 px-2 custom-scrollbar">
                  {loadingHistory ? (
                    <div className="flex justify-center py-4"><Spin size="small" /></div>
                  ) : history.length === 0 ? (
                    <div className="text-center text-gray-400 text-[12px]">Түүх байхгүй</div>
                  ) : (
                    history.slice(0, 10).map((act) => (
                      <div key={act._id || act.id} className="hover:scale-105 relative pl-5 before:content-[''] before:absolute before:left-[5px] before:top-4 before:w-[1px] before:h-[130%] before:bg-slate-400/30 dark:before:bg-slate-600/30 last:before:hidden transition-all">
                        <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800 z-10 shadow-sm"></div>
                        <div className="text-[12px] leading-relaxed">
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
                          {act.taskNer && <span className="text-emerald-500 font-bold ml-1">{act.taskNer}</span>}
                        </div>
                        <div className="text-[12px] text-gray-500 mt-0.5 font-medium opacity-70">
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
                    <span className="text-gray-700 dark:text-gray-300 text-[12px] font-bold group-hover:text-white transition-colors">Тусламж</span>
                </div>
            </div>
          </div>
        </div>
        </div>

      {typeof window !== 'undefined' && createPortal(
        <button
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-green-600 dark:bg-green-900 border border-green-700/60 w-8 h-12 rounded-l-lg flex flex-col items-center justify-center cursor-pointer shadow-xl hover:bg-green-500 transition-all z-[99999]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsRightPanelExpanded(!isRightPanelExpanded);
          }}
        >
          <RightOutlined className={`text-white dark:text-gray-300 text-[12px] transition-transform duration-300 ${isRightPanelExpanded ? "rotate-0" : "rotate-180"}`} />
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
            label={<span className="text-gray-400 text-[12px] font-bold uppercase pl-1">Төслийн нэр</span>}
            required
            rules={[{ required: true, message: 'Төслийн нэр оруулна уу' }]}
          >
            <Input placeholder="Жишээ нь: Барилга А засвар" className="h-12 rounded-xl" />
          </Form.Item>

          <Form.Item
            name="tailbar"
            label={<span className="text-gray-400 text-[12px] font-bold uppercase pl-1">Тайлбар</span>}
          >
            <Input.TextArea placeholder="Төслийн дэлгэрэнгүй тайлбар..." className="rounded-xl" rows={2} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="ekhlekhOgnoo"
              label={<span className="text-gray-400 text-[12px] font-bold uppercase pl-1">Эхлэх өдөр</span>}
            >
              <DatePicker className="w-full h-12 rounded-xl" format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="duusakhOgnoo"
              label={<span className="text-gray-400 text-[12px] font-bold uppercase  pl-1">Дуусах өдөр</span>}
            >
              <DatePicker className="w-full h-12 rounded-xl" format="YYYY-MM-DD" />
            </Form.Item>
          </div>

          <Form.Item
            name="color"
            label={<span className="text-gray-400 text-[12px] font-bold uppercase  pl-1">Өнгө</span>}
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
              Болих
            </Button>
            <Button type="primary" htmlType="submit" loading={savingProject}>
              {editingProject ? "Хадгалах" : "Үүсгэх"}
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
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white shadow-lg" style={{ backgroundColor: selectedProjectForChat?.color || '#10B981' }}>
                {(selectedProjectForChat?.name || selectedProjectForChat?.ner || '').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight">{selectedProjectForChat?.name || selectedProjectForChat?.ner}</span>
                <span className="text-[12px] text-emerald-100 dark:text-emerald-400 font-semibold uppercase ">Төслийн чат</span>
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
                <span className="text-xs font-semibold uppercase  animate-pulse text-gray-500">Уншиж байна...</span>
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
                         <div className={`px-4 py-2 bg-gray-800/50 border border-dashed border-gray-700 rounded-xl text-[12px] text-gray-500 italic`}>
                           Мессеж устгагдлаа
                         </div>
                      </div>
                    );
                  }
                  return (
                    <div key={msg._id || idx} className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-center gap-2 group`}>
                      {!isMe && (
                        <Avatar size="medium" className="bg-gradient-to-tr from-emerald-300 to-gray-500 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold border border-white dark:border-gray-800 shadow-xl">
                          <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                        </Avatar>
                      )}
                      <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && <span className="text-[12px] font-bold text-gray-400 mb-1 ml-1">{msg.ajiltniiNer}</span>}

                        {/* Reply content */}
                        {msg.replyTo?.chatId && (
                           <div className={`mb-1 px-3 py-1 bg-gray-100 dark:bg-gray-800/50 border-l-2 border-emerald-500 rounded-r-lg text-[12px] truncate max-w-full ${isMe ? 'mr-1' : 'ml-1'}`}>
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
                                <Image src={url} alt="img" className="max-w-[240px] max-h-[300px] object-cover rounded-xl cursor-pointer" preview={{ mask: <div className="text-[12px]">Томруулах</div> }} />
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
                        <span className={`text-[12px] text-gray-600 mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}>
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
                   <span className="text-[12px] font-bold text-emerald-400 uppercase">{replyToProject.ajiltniiNer}-д хариулах</span>
                   <span className="text-[12px] text-gray-400 truncate max-w-[300px]">{replyToProject.medeelel || "(медиа)"}</span>
                </div>
                <Button type="text" size="small" icon={<CloseOutlined className="text-[12px] text-gray-500" />} onClick={() => setReplyToProject(null)} />
              </div>
            )}
            {selectedProjectChatFile && (
              <div className="mb-2 flex items-center px-3 py-1.5 bg-emerald-900/30 border border-emerald-700/40 rounded-xl relative w-max">
                <PaperClipOutlined className="text-emerald-400 mr-2" />
                <span className="text-xs font-semibold text-emerald-300 truncate max-w-[200px]">{selectedProjectChatFile.name}</span>
                <Button type="text" size="small" icon={<CloseOutlined className="text-[12px] text-gray-500" />} className="absolute right-1" onClick={() => setSelectedProjectChatFile(null)} />
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

      <Modal
        title={null}
        visible={isKpiModalVisible}
        onCancel={() => setIsKpiModalVisible(false)}
        footer={null}
        closeIcon={<CloseOutlined className="text-gray-400 hover:text-white transition-colors" />}
        bodyStyle={{ padding: 0 }}
        className="kpi-custom-modal"
        width={400}
        centered
      >
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white rounded-t-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-3 border-2 border-white/30">
               {selectedMemberForKpi?.name?.charAt(0).toUpperCase()}
             </div>
             <h2 className="text-xl font-bold mb-1 text-white">{selectedMemberForKpi?.name}</h2>
             <p className="text-white/70 text-sm font-medium">{selectedMemberForKpi?.role}</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-b-2xl">
           <div className="flex justify-center mb-8 -mt-12 relative z-20">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-2xl border-4 border-emerald-50 dark:border-emerald-950">
                <Progress 
                  type="circle" 
                  percent={selectedMemberForKpi?.kpi} 
                  strokeColor={{ '0%': '#10b981', '100%': '#0d9488' }}
                  width={100}
                  strokeWidth={10}
                  format={(p) => (
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-emerald-600 leading-none">{p}%</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">KPI</span>
                    </div>
                  )}
                />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center">
                 <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Гүйцэтгэсэн</span>
                 <span className="text-xl font-black text-gray-800 dark:text-gray-100">{selectedMemberForKpi?.kpiDaalgavarToo}</span>
                 <span className="text-[10px] font-medium text-gray-500 mt-0.5">даалгавар</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center">
                 <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Дундаж оноо</span>
                 <span className="text-xl font-black text-emerald-500">{selectedMemberForKpi?.kpiDundaj}</span>
                 <span className="text-[10px] font-medium text-gray-500 mt-0.5">оноо</span>
              </div>
           </div>

           <div className="text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-3">Хамгийн сүүлд шинэчлэгдсэн</span>
              <div className="inline-flex items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-800">
                <ClockCircleOutlined className="mr-2" />
                {selectedMemberForKpi?.lastShineelsn ? moment(selectedMemberForKpi.lastShineelsn).format("YYYY-MM-DD HH:mm") : "Мэдээлэл байхгүй"}
              </div>
           </div>
        </div>
      </Modal>

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
