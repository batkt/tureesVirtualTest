import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createPortal } from 'react-dom';
import dayjs from "dayjs";
import "dayjs/locale/mn";
dayjs.locale("mn");
import fsmApi, { FSM_BASE_URL } from "services/fsmApi";
import { useAuth } from "services/auth";
import { message, Form, Input, InputNumber, Modal, DatePicker, Tooltip, Popconfirm, Spin, AutoComplete, Table, Card, Tag } from "antd";
import { useTranslation } from "react-i18next";
import useJagsaalt from "hooks/useJagsaalt";
import { 
  PlusOutlined, 
  FileExcelOutlined,
  DownOutlined,
  MoreOutlined,
  MessageOutlined,
  SettingOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  UserOutlined,
  RightOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  FileTextOutlined,
  TeamOutlined,
  SendOutlined,
  CheckCircleOutlined,
  AreaChartOutlined,
  ThunderboltOutlined,
  PieChartOutlined,
  BarChartOutlined,
  RollbackOutlined,
  FileOutlined
} from "@ant-design/icons";
import { 
  Button, 
  Select, 
  Checkbox,
  Dropdown,
  Space,
  Drawer,
  Upload,
  Avatar
} from "antd";
import { useFsmSocket } from "hooks/useFsmSocket";
import { Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);


function BaraaMaterial() {
  const { t } = useTranslation();
  
  const unitMap = {
    shirheg: "ш",
    litr: "литр",
    kg: "кг",
    haire: "хайрцаг",
    bogts: "богц",
    dana: "дан"
  };

  const typeMap = {
    tseverlegch: "Цэвэрлэгээ",
    ugaalgiin: "Угаалгын",
    ariutgagch: "Ариутгагч",
    bagaj: "Багаж",
    busad: "Бусад"
  };
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1280 : true);
  const [baraas, setBaraas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingBaraa, setEditingBaraa] = useState(null);
  const [form] = Form.useForm();
  const [incomeForm] = Form.useForm();
  const [filterType, setFilterType] = useState("all");
  const [loadingProjects, setLoadingProjects] = useState(false);
  const { token, barilgiinId, ajiltan } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [savingProject, setSavingProject] = useState(false);
  const [projectForm] = Form.useForm();
  const [loadingHistory, setLoadingHistory] = useState(false);
  const baiguullagiinId = ajiltan?.baiguullagiinId;
  const api = useMemo(() => fsmApi.withAuth(token), [token]);
  const ajiltanJagsaalt = useJagsaalt("/ajiltan");
  const [history, setHistory] = useState([]);
  const [usageStats, setUsageStats] = useState([]);
  const [todayUsageStats, setTodayUsageStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
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

  const fetchBaraas = useCallback(async () => {
    if (!barilgiinId) return;
    setLoading(true);
    try {
      const res = await api.get("/baraas", { params: { barilgiinId, baiguullagiinId } });
      const data = res.data?.data || res.data || [];
      setBaraas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [barilgiinId, baiguullagiinId, api]);

  const fetchProjects = useCallback(async () => {
    if (!barilgiinId) return;
    setLoadingProjects(true);
    try {
      const res = await api.get("/projects", { params: { baiguullagiinId, barilgiinId } });
      const list = res.data?.data || res.data || [];
      const normalized = list.map(p => ({
        ...p,
        id: p._id,
        name: p.ner,
        color: p.color || "#10B981",
        folder: "Ерөнхий",
      }));
      setProjects(normalized);
      setSelectedProjectIds(normalized.map(p => p.id));
    } catch (err) {
      // If backend not reachable, keep empty
    } finally {
      setLoadingProjects(false);
    }
  }, [barilgiinId, baiguullagiinId, api]);

  const fetchHistory = useCallback(async () => {
    if (!barilgiinId) return;
    setLoadingHistory(true);
    try {
      const res = await api.get("/task-tuukh", { params: { barilgiinId } });
      const list = res.data?.data || res.data || [];
      setHistory(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  }, [barilgiinId, api]);

  const fetchUsageStats = useCallback(async () => {
    if (!token || !barilgiinId) return;
    setLoadingStats(true);
    try {
      // Overall stats
      const res = await api.get(`/baraas/usage-stats`, { params: { barilgiinId } });
      if (res.data?.success) {
        setUsageStats(res.data.data);
      }

      // Today's stats
      const startOfToday = dayjs().startOf('day').toISOString();
      const resToday = await api.get(`/baraas/usage-stats`, { 
        params: { barilgiinId, startDate: startOfToday } 
      });
      if (resToday.data?.success) {
        setTodayUsageStats(resToday.data.data);
      }
    } catch (err) {
      console.error("Usage stats fetch failed:", err);
    } finally {
      setLoadingStats(false);
    }
  }, [api, token, barilgiinId]);

  const columns = [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => <span className="text-gray-400 font-bold">{index + 1}</span>
    },
    {
      title: 'Барааны нэр',
      dataIndex: 'ner',
      key: 'ner',
      className: 'font-medium text-[12px]',
      render: (text) => <span className="text-gray-800 dark:text-gray-200">{text}</span>
    },
    {
      title: 'Үлдэгдэл',
      dataIndex: 'uldegdel',
      key: 'uldegdel',
      align: 'center',
      width: 100,
      render: (val) => (
        <span className={`font-bold text-[12px] ${val <= 0 ? 'text-red-500' : 'text-emerald-600'}`}>
          {val || 0}
        </span>
      )
    },
    {
      title: 'Зарцуулалт',
      key: 'usage',
      align: 'center',
      width: 100,
      render: (row) => (
        <span className="font-semibold text-blue-500 text-[12px]">
          {usageMap[row.ner] || 0}
        </span>
      )
    },
    {
      title: 'Нэгж',
      key: 'negj',
      align: 'center',
      width: 80,
      render: (row) => (
        <span className="text-gray-500 dark:text-gray-400 text-[12px]">
          {row.negjM ? unitMap[row.negjM] : unitMap[row.negj] || row.negj}
        </span>
      )
    },
    {
      title: 'Төрөл',
      dataIndex: 'turul',
      key: 'turul',
      align: 'center',
      width: 120,
      render: (val) => <span className="text-gray-500 dark:text-gray-400 text-[12px]">{typeMap[val] || val}</span>
    },
    {
      title: () => <SettingOutlined />,
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 60,
      render: (row) => (
        <Dropdown
          menu={{
            items: [
              { key: '1', label: 'Засах', icon: <EditOutlined className="text-blue-500"/>, onClick: () => openEditModal(row) },
              { key: '2', label: 'Устгах', icon: <DeleteOutlined className="text-red-500"/>, danger: true, onClick: () => {
                Modal.confirm({
                  title: "Устгах",
                  content: "Та устгахдаа итгэлтэй байна уу?",
                  okText: "Устгах",
                  cancelText: "Цуцлах",
                  okButtonProps: { danger: true },
                  onOk: () => handleDeleteBaraa(row._id)
                });
              }},
            ]
          }}
          trigger={['click']}
        >
          <MoreOutlined className="rotate-90 text-gray-500 cursor-pointer hover:text-black dark:hover:text-white" />
        </Dropdown>
      )
    }
  ];

  useEffect(() => {
    fetchBaraas();
    fetchProjects();
    fetchHistory();
    fetchUsageStats();
  }, [fetchBaraas, fetchProjects, fetchHistory, fetchUsageStats]);

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
        message.success(t("Амжилттай хадгаллаа"));
        await fetchProjects();
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
        message.success(t("Амжилттай устгалаа."));
        setSelectedProjectIds(prev => prev.filter(pId => pId !== id));
        await fetchProjects();
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

  const { isConnected, socket: fsmSocket } = useFsmSocket(
    selectedProjectForChat ? (selectedProjectForChat.id || selectedProjectForChat._id) : null
  );

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

  const { socket } = useFsmSocket();

  const usageMap = useMemo(() => {
    const map = {};
    if (Array.isArray(usageStats)) {
      usageStats.forEach(s => {
        // Only include if material still exists in the list
        if (s.ner && baraas.some(b => b.ner === s.ner)) {
          map[s.ner] = s.too;
        }
      });
    }
    return map;
  }, [usageStats, baraas]);
  

  const filteredTodayUsage = useMemo(() => {
    return todayUsageStats.filter(s => baraas.some(b => b.ner === s.ner));
  }, [todayUsageStats, baraas]);

  const filteredOverallUsage = useMemo(() => {
    return usageStats.filter(s => baraas.some(b => b.ner === s.ner));
  }, [usageStats, baraas]);

  

  useEffect(() => {
    if (isConnected && socket) {
      const handler = () => {
        fetchBaraas();
        fetchUsageStats();
        fetchHistory();
      };
      socket.on("task_updated", handler);
      socket.on("task_created", handler);
      socket.on("task_deleted", handler);
      socket.on("baraa_deleted", handler);
      socket.on("baraa_created", handler);
      socket.on("baraa_updated", handler);
      
      return () => {
        socket.off("task_updated", handler);
        socket.off("task_created", handler);
        socket.off("task_deleted", handler);
        socket.off("baraa_deleted", handler);
        socket.off("baraa_created", handler);
        socket.off("baraa_updated", handler);
      };
    }
  }, [isConnected, socket, fetchUsageStats, fetchHistory, fetchBaraas]);
    
  const filteredBaraas = useMemo(() => {
    if (filterType === "all") return baraas;
    
    return baraas.filter(b => {
      // 1. Grouped "Cleaning" filter
      if (filterType === "tseverlegch") {
        return ['tseverlegch', 'Цэвэрлэгч'].includes(b.turul);
      }
      
      // 2. Others or custom typed values
      if (filterType === "busad") {
        const cleaningKeys = ['tseverlegch', 'Цэвэрлэгч', 'ugaalgiin', 'Угаалгын', 'ariutgagch', 'Ариутгагч', 'bagaj', 'Багаж'];
        return !cleaningKeys.includes(b.turul);
      }
      
      // 3. For any other key in typeMap (like 'bagaj', 'ugaalgiin', etc.)
      const label = typeMap[filterType];
      return b.turul === filterType || b.turul === label;
    });
  }, [baraas, filterType]);

  const handleSaveBaraa = async (values) => {
    if (!barilgiinId) { message.warning("Барилгын мэдээлэл байхгүй байна"); return; }
    try {
      const payload = {
        ner: values.ner,
        turul: values.turul || "Бусад",
        negj: values.negj || "shirheg",
        uldegdel: Number(values.uldegdel) || 0,
        baiguullagiinId,
        barilgiinId
      };
      
      let res;
      if (editingBaraa) {
        res = await api.put(`/baraas/${editingBaraa._id}`, payload);
      } else {
        res = await api.post("/baraas", payload);
      }

      if (res.data?.success || res.status === 200) {
        message.success(t("Амжилттай хадгаллаа"));
        await fetchBaraas();
        await fetchHistory();
        setIsAddModalOpen(false);
        setEditingBaraa(null);
        form.resetFields();
      }
    } catch (err) {
      message.error(err?.response?.data?.message || `Бараа ${editingBaraa ? 'шинэчлэхэд' : 'бүртгэхэд'} алдаа гарлаа`);
    }
  };


  const handleDeleteBaraa = async (id) => {
    try {
      const res = await api.delete(`/baraas/${id}`);
      if (res.data?.success || res.status === 200) {
        message.success(t("Амжилттай устгалаа."));
        await fetchBaraas();
        await fetchHistory();
      }
    } catch (err) {
      message.error(err?.response?.data?.message || "Бараа устгахад алдаа гарлаа");
    }
  };

  const openEditModal = (item) => {
    setEditingBaraa(item);
    form.setFieldsValue({
      ...item,
      turul: typeMap[item.turul] || item.turul || "Бусад",
      // map API field names → form field names
      negjUrtug: item.negjUne ?? 0,
      niitUne:   item.niitUrtug ?? 0,
      idevhtei: item.idevhtei !== undefined ? item.idevhtei : true
    });
    setIsAddModalOpen(true);
  };

  const handleCreateIncome = async (values) => {
     message.info("Орлого бүртгэх функц удахгүй нэмэгдэнэ");
     setIsIncomeModalOpen(false);
  };

  // const filteredStatCards = [
  //   { title: "Бүх төрөл", value: baraas.length.toString(), type: 'all', color: 'bg-emerald-50/60', border: 'border-emerald-200', text: 'text-emerald-600' },
  //   { title: "Цэвэрлэгээний", value: baraas.filter(b => ['tseverlegch', 'Цэвэрлэгч', 'ugaalgiin', 'Угаалгын', 'ariutgagch', 'Ариутгагч'].includes(b.turul)).length.toString(), type: 'tseverlegch', color: 'bg-emerald-50/60', border: 'border-emerald-200', text: 'text-emerald-600' },
  //   { title: "Багаж хэрэгсэл", value: baraas.filter(b => ['bagaj', 'Багаж'].includes(b.turul)).length.toString(), type: 'bagaj', color: 'bg-emerald-50/60', border: 'border-emerald-200', text: 'text-emerald-600' },
  //   { title: "Бусад", value: baraas.filter(b => !['tseverlegch', 'Цэвэрлэгч', 'ugaalgiin', 'Угаалгын', 'ariutgagch', 'Ариутгагч', 'bagaj', 'Багаж'].includes(b.turul)).length.toString(), type: 'busad', color: 'bg-emerald-50/60', border: 'border-emerald-200', text: 'text-emerald-600' },
  // ];

  const teamMembers = useMemo(() => {
    return ajiltanJagsaalt?.jagsaalt?.map(a => ({
      id: a._id,
      name: a.ner || a.nevtrekhNer,
      role: a.albanTushaal || a.erkh || "Ажилтан"
    })) || [];
  }, [ajiltanJagsaalt?.jagsaalt]);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const tutorialSteps = [
    { targetId: "mat-stats", title: "Нийт статистик", description: "Энд бараа материалын нийт төрөл, үлдэгдэл болон үнэ цэнийг нэгдсэн байдлаар харна." },
    { targetId: "mat-actions", title: "Үйлдлүүд", description: "Шинээр бараа бүртгэх, барааны орлого авах болон Excel файл татаж авах үйлдлүүдийг эндээс хийнэ." },
    { targetId: "mat-table", title: "Барааны жагсаалт", description: "Бүх бараа материалын дэлгэрэнгүй жагсаалт, үлдэгдэл, нэгж өртөг зэргийг эндээс хянах боломжтой." },
    { targetId: "mat-sidebar", title: "Хайлт", description: "Төслүүд болон бараа материалыг хурдан хайх хайлтын хэсэг." },
    { targetId: "mat-team", title: "Баг хамт олон", description: "Материал хариуцсан багийн гишүүдийг эндээс харна." },
  ];

  return (
    <Admin title="Бараа материал" khuudasniiNer="baraaMaterial">
      <div className="col-span-12 flex flex-col xl:flex-row h-auto xl:h-H8HalfRem w-full -mx-0 xl:-mx-1 -mt-2 text-black lg:rounded-2xl shadow-2xl relative transition-all duration-300 animate-entrance">
        
        <div className="flex-1 flex flex-col p-4 overflow-hidden relative min-w-0 mt-2">
          
          
          {/* <div id="mat-stats" className="hideScroll grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 shrink-0 pt-1">
            {[
              { title: "Нийт бараа", value: baraas.length, type: 'all', color: 'bg-emerald-50/60', border: 'border-emerald-200', text: 'text-emerald-600' },
              { title: "Цэвэрлэгээний", value: baraas.filter(b => ['tseverlegch', 'Цэвэрлэгч', 'ugaalgiin', 'Угаалгын', 'ariutgagch', 'Ариутгагч'].includes(b.turul)).length, type: 'tseverlegch', color: 'bg-blue-50/60', border: 'border-blue-200', text: 'text-blue-600' },
              { title: "Багаж хэрэгсэл", value: baraas.filter(b => ['bagaj', 'Багаж'].includes(b.turul)).length, type: 'bagaj', color: 'bg-amber-50/60', border: 'border-amber-200', text: 'text-amber-600' },
              { title: "Дууссан", value: baraas.filter(b => (b.uldegdel || 0) <= 0).length, type: 'out-of-stock', color: 'bg-red-50/60', border: 'border-red-200', text: 'text-red-600' },
            ].map((card, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out border-2 ${card.border} ${card.color} dark:border-slate-800 dark:bg-slate-900/40 col-span-1 shadow-sm`}
              >
                <div className="relative h-full p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-[12px] font-bold uppercase  text-slate-500 mb-1">{card.title}</div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{card.value}</div>
                  </div>
                  <div className={`h-1 w-8 rounded-full bg-emerald-500 mt-2 opacity-30 group-hover:w-full transition-all`} />
                </div>
              </div>
            ))}
          </div> */}

          <div id="mat-actions" className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4 shrink-0 animate-entrance-stagger-6">
            <Select
              value={filterType}
              onChange={setFilterType}
              className="w-full sm:w-48 [&>.ant-select-selector]:!bg-white dark:[&>.ant-select-selector]:!bg-[#222a38] dark:[&>.ant-select-selector]:!border-[#2d3748]/50 [&>.ant-select-selector]:!border-gray-200 dark:[&>.ant-select-selector]:!text-gray-300 [&>.ant-select-selector]:!rounded-lg [&>.ant-select-selector]:!h-[36px] [&>.ant-select-selector]:!flex [&>.ant-select-selector]:!items-center [&_.ant-select-selection-item]:!text-xs"
            >
                <Select.Option value="all">Бүх төрөл</Select.Option>
                {Object.entries(typeMap).map(([key, value]) => (
                  <Select.Option key={key} value={key}>{value}</Select.Option>
                ))}
             </Select>

            <Space className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0" wrap={false}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="bg-green-500 hover:bg-emerald-600 border-none !rounded-lg text-xs font-bold shadow-md h-[36px]"
                onClick={() => setIsAddModalOpen(true)}
              >
                Бараа бүртгэх
              </Button>
              <Button
                type="primary"
                className="bg-green-500 hover:bg-green-600 border-none !rounded-lg text-xs font-bold shadow-md h-[36px] flex items-center gap-1"
              >
                <FileExcelOutlined /> Excel <DownOutlined className="text-[12px]" />
              </Button>
            </Space>
          </div>

          <Card size="small" className="shadow-sm border-gray-200 dark:border-gray-800 dark:bg-gray-800 rounded-xl overflow-hidden animate-entrance-stagger-7">
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={filteredBaraas}
                rowKey="_id"
                size="small"
                bordered
                scroll={{ x: 'max-content', y: 400 }}
                loading={loading}
                className="ant-table-custom"
                rowClassName="hover:bg-slate-50 dark:hover:bg-slate-700/40"
              />
            </div>
          </Card>
          <div id="mat-usage-dashboard" className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-entrance-stagger-8 flex-1 min-h-0 mb-4">
            {/* Panel 1: Today's Usage Graphic */}
            {/* Panel 1: Today's Usage Graphic */}
<div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col min-h-[250px] xl:h-auto group">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 uppercase flex items-center gap-2">
        Өнөөдрийн зарцуулалт
      </h3>
    </div>

  </div>

  <div className="flex-1 min-h-0 relative">
    {loadingStats ? (
      <Spin size="large" />
    ) : filteredTodayUsage.length > 0 ? (
      <div className="w-full h-full flex flex-col gap-4 mt-2">
        {filteredTodayUsage.slice(0, 5).map((s, idx) => {
          const maxVal = Math.max(...filteredTodayUsage.map(i => i.too || 1));
          const percent = ((s.too || 0) / maxVal) * 100;
          const colors = [
            { from: '#10b981', to: '#b1fdb4ff' },
          ];
          const color = colors[idx % colors.length];
          return (
            <div key={idx} className="flex flex-col gap-1.5 group/usage">
              <div className="flex justify-between items-center pr-2">
                <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 truncate">{s.ner}</span>
                <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 tabular-nums">{s.too}ш</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{
                    width: `${percent}%`,
                    background: `linear-gradient(90deg, ${color.from}, ${color.to})`,
                    boxShadow: idx === 0 ? `0 0 12px ${color.from}4d` : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 opacity-50">
        <PieChartOutlined className="text-5xl mb-2" />
        <span className="text-[12px] font-bold uppercase  text-center leading-tight">Дата олдсонгүй</span>
      </div>
    )}
  </div>
</div>

            {/* Panel 2: Overall Top Materials Graphic */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col min-h-[250px] xl:h-auto group">
               <div className="flex items-center justify-between mb-6">
                 <div>
                    <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 uppercase flex items-center gap-2">
                       {/* <ThunderboltOutlined className="text-amber-500" /> */}
                       Их ашиглалттай бараа материал
                    </h3>
                    {/* <p className="text-[12px] text-slate-400 font-bold uppercase r mt-0.5">Top Consumers</p> */}
                 </div>
                 {/* <div className="bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full">
                    <span className="text-[12px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tighter italic">Hot List</span>
                 </div> */}
              </div>

              <div className="flex-1 min-h-0 relative">
                {filteredOverallUsage.length > 0 ? (
                  <div className="w-full h-full flex flex-col gap-4 mt-2">
                    {filteredOverallUsage.slice(0, 5).map((s, idx) => {
                      const maxVal = Math.max(...filteredOverallUsage.map(i => i.too || 1));
                      const percent = ((s.too || 0) / maxVal) * 100;
                      return (
                        <div key={idx} className="flex flex-col gap-1.5 group/usage">
                          <div className="flex justify-between items-center pr-2">
                            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 truncate">{s.ner}</span>
                            <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 tabular-nums">{s.too}ш</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden relative">
                            <div 
                              className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                              style={{ 
                                width: `${percent}%`, 
                                background: idx === 0 ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' : 'linear-gradient(90deg, #3b82f6, #cbd5e1)',
                                boxShadow: idx === 0 ? '0 0 12px rgba(59, 130, 246, 0.3)' : 'none'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 opacity-50">
                    <BarChartOutlined className="text-5xl mb-2" />
                    <span className="text-[12px] font-bold uppercase ">Түүх олдсонгүй</span>
                  </div>
                )}
              </div>
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
                    <span>Төслүүд</span>
                  </div>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => setIsProjectModalVisible(true)}
                    icon={<PlusOutlined className="text-white text-[12px]" />}
                    className="!text-white text-[12px] bg-green-500 font-bold hover:!bg-emerald-500/10 rounded-lg"
                  >
                    Нэмэх
                  </Button>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {loadingProjects ? (
                    <div className="flex justify-center py-4"><Spin size="small" /></div>
                  ) : projects.length === 0 ? (
                    <div className="text-center text-gray-400 text-[12px] py-4 font-medium">Төсөл байхгүй байна</div>
                  ) : (
                    projects.map(p => (
                      <div key={p.id} className="flex items-center space-x-3 cursor-pointer group hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-3 py-2.5 rounded-2xl transition-all duration-300 border border-transparent hover:border-emerald-200/50 dark:hover:border-emerald-500/20 shadow-sm hover:shadow-md">
                        <div className="w-8 h-8 flex items-center justify-center rounded-xl text-[12px] font-bold text-white shadow-lg shrink-0 transform group-hover:scale-110 transition-transform" style={{ backgroundColor: p.color || "#10B981" }}>
                          {(p.name || "").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate transition-colors">{p.name}</span>
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
                <div className="text-[12px] font-bold text-gray-400 mb-3 px-1 flex items-center  uppercase opacity-70">
                  <span>Ажилчид</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {teamMembers.map((member, i) => (
                    <div key={i} className="flex items-center group cursor-pointer transition-all px-3 py-2.5 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-500/5 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/10 shadow-sm hover:shadow-md">
                      <div className="flex items-center space-x-4 w-full">
                        <Avatar size="medium" className="bg-gradient-to-tr from-emerald-400 to-teal-600 dark:from-emerald-700 dark:to-teal-900 text-white text-[12px] font-bold border-2 border-white dark:border-gray-800 shadow-xl shrink-0">
                          {(member.name || "").slice(0, 1).toUpperCase()}
                        </Avatar>
                        <div className="flex flex-col min-w-0 flex-1 justify-center">
                          <div className="text-[13px] font-bold text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate leading-tight transition-colors">{member.name}</div>
                          <div className="text-[12px] text-gray-500 font-medium leading-tight mt-1 opacity-70 uppercase ">{member.role}</div>
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
                  <div className="text-[12px] font-bold text-gray-400 flex items-center  uppercase opacity-70">
                    <span>Түүх</span>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-4 px-2 custom-scrollbar">
                  {loadingHistory ? (
                    <div className="flex justify-center py-4"><Spin size="small" /></div>
                  ) : history.length === 0 ? (
                    <div className="text-center text-gray-400 text-[12px]">Түүх байхгүй байна</div>
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
            title={editingBaraa ? "Бараа засах" : "Бараа бүртгэх"}
            open={isAddModalOpen}
            onCancel={() => {
              setIsAddModalOpen(false);
              setEditingBaraa(null);
              form.resetFields();
            }}
            onOk={() => form.submit()}
            okText="Хадгалах"
            cancelText="Болих"
            okButtonProps={{ className: "bg-emerald-500 hover:bg-emerald-400 border-none" }}
          >
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={handleSaveBaraa}
            >
              <div className="grid grid-cols-2 gap-4">
              <Form.Item name="ner" label="Барааны нэр" rules={[{ required: true }]}>
                 <Input className="rounded-lg" placeholder="Нэр" />
              </Form.Item>
              
                <Form.Item name="turul" label="Төрөл">
                  <AutoComplete
                    options={[
                      { value: "Цэвэрлэгээ" },
                      { value: "Угаалгын" },
                      { value: "Ариутгагч" },
                      { value: "Багаж" },
                      { value: "Бусад" }
                    ]}
                    filterOption={(inputValue, option) =>
                      option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                    }
                  >
                    <Input className="rounded-lg" placeholder="Төрөл бичих..." />
                  </AutoComplete>
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="negj" label="Нэгж" initialValue="shirheg">
                  <Select placeholder="Сонгох">
                      <Select.Option value="shirheg">ширхэг</Select.Option>
                      <Select.Option value="litr">литр</Select.Option>
                      <Select.Option value="kg">кг</Select.Option>
                      <Select.Option value="haire">хайрцаг</Select.Option>
                      <Select.Option value="bogts">богц</Select.Option>
                      <Select.Option value="dana">дан</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="uldegdel" label="Үлдэгдэл" initialValue={0}>
                   <InputNumber className="w-full rounded-md dark:border-gray-700" placeholder="Үлдэгдэл" />
                </Form.Item>
                
              </div>

              

              

              
               
               
            </Form>
          </Modal>

          

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
                label={<span className="text-gray-400 text-[12px] font-bold uppercase pl-1">{t("uilchilgee.project_name")}</span>}
                required
                rules={[{ required: true, message: t("uilchilgee.project_name") + ' ' + t("Нэр оруулна уу!") }]}
              >
                <Input placeholder={t("uilchilgee.project_placeholder")} className="h-12 rounded-xl" />
              </Form.Item>
    
              <Form.Item 
                name="tailbar" 
                label={<span className="text-gray-400 text-[12px] font-bold uppercase pl-1">{t("uilchilgee.description")}</span>}
              >
                <Input.TextArea placeholder={t("uilchilgee.desc_placeholder")} className="rounded-xl" rows={2} />
              </Form.Item>
              
              <div className="grid grid-cols-2 gap-4">
                <Form.Item 
                  name="ekhlekhOgnoo" 
                  label={<span className="text-gray-400 text-[12px] font-bold uppercase pl-1">{t("uilchilgee.start_date")}</span>}
                >
                  <DatePicker className="w-full h-12 rounded-xl" format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item 
                  name="duusakhOgnoo" 
                  label={<span className="text-gray-400 text-[12px] font-bold uppercase  pl-1">{t("uilchilgee.end_date")}</span>}
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
                  {t("Цуцлах")}
                </Button>
                <Button type="primary" htmlType="submit" loading={savingProject}>
                  {editingProject ? t("Хадгалах") : t("Үүсгэх")}
                </Button>
              </div>
            </Form>
          </Modal>
      </div>
      <GuidedTour 
        steps={tutorialSteps} 
        isOpen={isTutorialOpen} 
        onClose={() => setIsTutorialOpen(false)} 
      />

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
                        <Avatar size="medium" className="bg-gradient-to-tr from-emerald-300 to-gray-500 dark:from-emerald-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold border border-white dark:border-gray-800 shadow-xl">
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
    </Admin>
  );
}

export default BaraaMaterial;
