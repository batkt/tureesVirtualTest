import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createPortal } from 'react-dom';
import dayjs from "dayjs";
import "dayjs/locale/mn";
dayjs.locale("mn");
import fsmApi, { FSM_BASE_URL_ZEV as FSM_BASE_URL } from "services/fsmApi";
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
  FileOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { 
  Button, 
  Select, 
  Checkbox,
  Dropdown,
  Space,
  Drawer,
  Upload,
  Avatar,
  Image
} from "antd";
import DraggableModal from "components/DraggableModal";
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
import { toast } from "sonner";

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
  const { token, barilgiinId, ajiltan, baiguullaga } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [savingProject, setSavingProject] = useState(false);
  const [projectForm] = Form.useForm();
  const [loadingHistory, setLoadingHistory] = useState(false);
  const baiguullagiinId = baiguullaga?._id || ajiltan?.baiguullagiinId;
  const api = useMemo(() => fsmApi.withAuth(token, FSM_BASE_URL), [token, FSM_BASE_URL]);
  const ajiltanJagsaalt = useJagsaalt("/ajiltan");
  const [history, setHistory] = useState([]);
  const [usageStats, setUsageStats] = useState([]);
  const [todayUsageStats, setTodayUsageStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  
  const [typeMap, setTypeMap] = useState({
    "Цэвэрлэгээ": "Цэвэрлэгээ",
    "Угаалгын": "Угаалгын",
    "Ариутгагч": "Ариутгагч",
    "Багаж": "Багаж",
    "Бусад": "Бусад"
  });

  const fetchFsmTuruls = useCallback(async () => {
    if (!barilgiinId || !baiguullaga?._id) return;
    try {
      const res = await api.get("/fsm-turuls", {
        params: { baiguullagiinId: baiguullaga._id, barilgiinId }
      });
      const turuls = res.data?.data || [];
      if (turuls.length > 0) {
        const newMap = turuls.reduce((acc, curr) => {
          acc[curr.ner] = curr.ner;
          return acc;
        }, {});
        setTypeMap(newMap);
      }
    } catch (err) {
      console.error("Failed to load turuls", err);
    }
  }, [api, barilgiinId, baiguullaga]);

  useEffect(() => {
    fetchFsmTuruls();
  }, [fetchFsmTuruls]);

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
  
  const [tablePagination, setTablePagination] = useState({ current: 1, pageSize: 10 });
  const [searchText, setSearchText] = useState("");

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
      const res = await api.get(`/baraas/usage-stats`, { params: { barilgiinId } });
      if (res.data?.success) {
        setUsageStats(res.data.data);
      }
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
      render: (text, record, index) => {
        const absoluteIndex = (tablePagination.current - 1) * tablePagination.pageSize + index + 1;
        return <span className="text-gray-400 font-bold">{absoluteIndex}</span>;
      }
    },
    {
      title: t('Барааны нэр'),
      dataIndex: 'ner',
      key: 'ner',
      className: 'font-medium text-[12px]',
      render: (text) => <span className="text-gray-800 dark:text-gray-200">{text}</span>
    },
    {
      title: t('Үлдэгдэл'),
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
      title: t('Зарцуулалт'),
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
      title: t('Нэгж'),
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
      title: t('Төрөл'),
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
              { key: '1', label: t('Засах'), icon: <EditOutlined className="text-blue-500"/>, onClick: () => openEditModal(row) },
              { key: '2', label: t('Устгах'), icon: <DeleteOutlined className="text-red-500"/>, danger: true, onClick: () => {
                Modal.confirm({
                  title: t("Устгах"),
                  content: t("Та устгахдаа итгэлтэй байна уу?"),
                  okText: t("Устгах"),
                  cancelText: t("Цуцлах"),
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
        toast.success(t("Амжилттай хадгаллаа"));
        await fetchProjects();
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
        toast.success(t("Амжилттай устгалаа."));
        setSelectedProjectIds(prev => prev.filter(pId => pId !== id));
        await fetchProjects();
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

  const { isConnected: isChatConnected, socket: fsmSocket } = useFsmSocket(
    selectedProjectForChat ? (selectedProjectForChat.id || selectedProjectForChat._id) : null,
    null,
    null,
    FSM_BASE_URL
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

  const { isConnected, socket } = useFsmSocket(null, null, null, FSM_BASE_URL);

  const usageMap = useMemo(() => {
    const map = {};
    if (Array.isArray(usageStats)) {
      usageStats.forEach(s => {
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
    let list = baraas;
    
    if (filterType !== "all") {
      list = list.filter(b => {
        const label = typeMap[filterType] || filterType;
        if (filterType === "Цэвэрлэгээ" && ['tseverlegch', 'Цэвэрлэгч'].includes(b.turul)) return true;
        if (filterType === "Угаалгын" && b.turul === 'ugaalgiin') return true;
        if (filterType === "Ариутгагч" && b.turul === 'ariutgagch') return true;
        if (filterType === "Багаж" && b.turul === 'bagaj') return true;
        return b.turul === filterType || b.turul === label;
      });
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      list = list.filter(b => 
        b.ner?.toLowerCase().includes(lowerSearch) || 
        b.turul?.toLowerCase().includes(lowerSearch)
      );
    }
    
    return list;
  }, [baraas, filterType, typeMap, searchText]);

  const handleSaveBaraa = async (values) => {
    if (!barilgiinId) { toast.warning("Барилгын мэдээлэл байхгүй байна"); return; }
    try {
      const payload = {
        ner: values.ner,
        turul: values.turul || "Бусад",
        negj: values.negj || "shirheg",
        uldegdel: Number(values.uldegdel) || 0,
        shirhegiinToo: values.negj === 'haire' ? (Number(values.shirhegiinToo) || 1) : 1,
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
        toast.success(t("Амжилттай хадгаллаа"));
        await fetchBaraas();
        await fetchHistory();
        setIsAddModalOpen(false);
        setEditingBaraa(null);
        form.resetFields();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || `Бараа ${editingBaraa ? 'шинэчлэхэд' : 'бүртгэхэд'} алдаа гарлаа`);
    }
  };


  const handleDeleteBaraa = async (id) => {
    try {
      const res = await api.delete(`/baraas/${id}`);
      if (res.data?.success || res.status === 200) {
        toast.success(t("Амжилттай устгалаа."));
        await fetchBaraas();
        await fetchHistory();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Бараа устгахад алдаа гарлаа");
    }
  };

  const openEditModal = (item) => {
    setEditingBaraa(item);
    form.setFieldsValue({
      ...item,
      turul: typeMap[item.turul] || item.turul || "Бусад",
      negjUrtug: item.negjUne ?? 0,
      niitUne:   item.niitUrtug ?? 0,
      idevhtei: item.idevhtei !== undefined ? item.idevhtei : true
    });
    setIsAddModalOpen(true);
  };

  const handleCreateIncome = async (values) => {
     toast.info("Орлого бүртгэх функц удахгүй нэмэгдэнэ");
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
      id: a._id || a.id,
      name: a.ner || a.nevtrekhNer || "Ажилтан",
      role: a.albanTushaal || a.erkh || "Ажилтан",
      kpi: 0,
      kpiOnoo: 0,
      kpiDaalgavarToo: 0,
      kpiDundaj: 0,
      doneCount: 0,
      activeCount: 0,
      overdueCount: 0,
      remainingCount: 0,
      totalTasks: 0
    })) || [];
  }, [ajiltanJagsaalt?.jagsaalt]);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const tutorialSteps = [
    { targetId: "mat-usage-dashboard", title: t("Нийт статистик"), description: t("Энд бараа материалын нийт төрөл, үлдэгдэл болон үнэ цэнийг нэгдсэн байдлаар харна.") },
    { targetId: "mat-actions", title: t("Үйлдлүүд"), description: t("Шинээр бараа бүртгэх, барааны орлого авах болон Excel файл татаж авах үйлдлүүдийг эндээс хийнэ.") },
    { targetId: "mat-table", title: t("Барааны жагсаалт"), description: t("Бүх бараа материалын дэлгэрэнгүй жагсаалт, үлдэгдэл, нэгж өртөг зэргийг эндээс хянах боломжтой.") },

  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.altKey && (e.code === 'KeyA' || e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAddModalOpen(true);
      } else if (e.altKey && (e.code === 'KeyP' || e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setIsProjectModalVisible(true);
      } else if (e.key === '+' || e.code === 'NumpadAdd' || (e.shiftKey && e.code === 'Equal')) {
        // Only if not in an input
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        e.preventDefault();
        setIsAddModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Admin title="Бараа материал" khuudasniiNer="baraaMaterial">
      <div className="col-span-12 flex flex-col xl:flex-row h-auto xl:h-H8HalfRem w-full -mx-0 xl:-mx-1 -mt-2 text-black lg:rounded-2xl shadow-2xl relative transition-all duration-300 animate-entrance">
        
        <div className="flex-1 flex flex-col p-4 overflow-hidden relative min-w-0 mt-2">
          
          
          {/* <div id="mat-stats" className="hideScroll grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 shrink-0 pt-1">
            {[
              { title: "Нийт бараа", value: baraas.length, type: 'all', color: 'bg-emerald-50/60', border: 'border-emerald-200', text: 'text-emerald-600' },
              { title: "Цэвэрлэгээний", value: baraas.filter(b => ['tseverlegch', 'Цэвэрлэгч', 'Цэвэрлэгээ', 'ugaalgiin', 'Угаалгын', 'ariutgagch', 'Ариутгагч'].includes(b.turul)).length, type: 'tseverlegch', color: 'bg-blue-50/60', border: 'border-blue-200', text: 'text-blue-600' },
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
            <div className="flex gap-2 w-full sm:w-auto">
              <Select
                value={filterType}
                onChange={setFilterType}
                className="w-full sm:w-48 [&>.ant-select-selector]:!bg-white dark:[&>.ant-select-selector]:!bg-[#222a38] dark:[&>.ant-select-selector]:!border-[#2d3748]/50 [&>.ant-select-selector]:!border-gray-200 dark:[&>.ant-select-selector]:!text-gray-300 [&>.ant-select-selector]:!rounded-lg [&>.ant-select-selector]:!h-[36px] [&>.ant-select-selector]:!flex [&>.ant-select-selector]:!items-center [&_.ant-select-selection-item]:!text-xs"
              >
                  <Select.Option value="all">{t("Бүх төрөл")}</Select.Option>
                  {Object.entries(typeMap).map(([key, value]) => (
                    <Select.Option key={key} value={key}>{value}</Select.Option>
                  ))}
               </Select>
               <Input 
                 placeholder={t("Барааны нэрээр хайх...")} 
                 prefix={<SearchOutlined className="text-gray-400" />}
                 value={searchText}
                 onChange={(e) => setSearchText(e.target.value)}
                 className="h-[36px] rounded-lg w-full sm:w-64 shadow-sm border-gray-200 dark:border-gray-700"
                 allowClear
               />
            </div>

            <Space className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0" wrap={false}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="bg-emerald-500 hover:bg-emerald-600 border-none !rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 h-[40px] px-6 transition-all  active:scale-95"
                onClick={() => setIsAddModalOpen(true)}
              >
                {t("Бараа бүртгэх")}
              </Button>
              {/* <Button
                type="default"
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 !rounded-xl text-xs font-bold shadow-sm h-[40px] px-4 flex items-center gap-2 hover:border-emerald-500 group"
              >
                <FileExcelOutlined className="text-emerald-500 group-hover:scale-110 transition-transform" /> 
                <span className="text-slate-600 dark:text-slate-300">Excel</span>
                <DownOutlined className="text-[10px] text-slate-400" />
              </Button> */}
            </Space>
          </div>

          {/* Floating Action Button */}
          <div className="fixed bottom-8 right-8 z-50 xl:hidden">
             <Button
               type="primary"
               shape="circle"
               icon={<PlusOutlined style={{ fontSize: '24px' }} />}
               className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 border-none shadow-2xl shadow-emerald-500/40 flex items-center justify-center animate-bounce hover:animate-none"
               onClick={() => setIsAddModalOpen(true)}
             />
          </div>

          <Card id="mat-table" size="small" className="shadow-sm border-gray-200 dark:border-gray-800 dark:bg-gray-800 rounded-xl overflow-hidden animate-entrance-stagger-7">
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
                pagination={{
                  ...tablePagination,
                  showSizeChanger: true
                }}
                onChange={(pagination) => setTablePagination(pagination)}
              />
            </div>
          </Card>
          <div id="mat-usage-dashboard" className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-entrance-stagger-8 flex-1 min-h-0 mb-4">
      
<div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col min-h-[250px] xl:h-auto group">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 uppercase flex items-center gap-2">
        {t("Өнөөдрийн зарцуулалт")}
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
                      {t("Их ашиглалттай бараа материал")}
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
              <div id="mat-sidebar" className="flex flex-col p-4 space-y-3 shrink-0">
                <div className="flex items-center justify-between px-1">
                  <div className="text-[12px] font-bold text-gray-400 mb-2 flex items-center  uppercase opacity-70">
                    <span>{t("Төслүүд")}</span>
                  </div>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => setIsProjectModalVisible(true)}
                    icon={<PlusOutlined className="text-white text-[12px]" />}
                    className="!text-white text-[12px] bg-green-500 font-bold hover:!bg-emerald-500/10 rounded-lg"
                  >
                    {t("Нэмэх")}
                  </Button>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {loadingProjects ? (
                    <div className="flex justify-center py-4"><Spin size="small" /></div>
                  ) : projects.length === 0 ? (
                    <div className="text-center text-gray-400 text-[12px] py-4 font-medium">{t("Төсөл байхгүй байна")}</div>
                  ) : (
                    projects.map(p => (
                      <div key={p.id} className="flex items-center space-x-3 cursor-pointer group hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-3 py-2.5 rounded-2xl transition-all duration-300 border border-transparent hover:border-emerald-200/50 dark:hover:border-emerald-500/20 shadow-sm hover:shadow-md">
                        <div className="w-8 h-8 flex items-center justify-center rounded-xl text-[12px] font-bold text-white shadow-lg shrink-0 transform group-hover:scale-110 transition-transform" style={{ backgroundColor: p.color || "#10B981" }}>
                          {(p.name || "").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col flex-1 min-0">
                          <Tooltip title={p.name} placement="right">
                            <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate transition-colors cursor-help">
                              {p.name}
                            </span>
                          </Tooltip>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 shrink-0 transition-opacity">
                          <Tooltip title={t("Чат")}>
                            <Button type="text" size="small" icon={<MessageOutlined className="text-gray-400 hover:text-emerald-500 text-[12px]" />} onClick={(e) => openProjectChat(p, e)} />
                          </Tooltip>
                          <Tooltip title={t("Засах")}>
                            <Button type="text" size="small" icon={<EditOutlined className="text-gray-400 hover:text-blue-500 text-[12px]" />} onClick={(e) => { e.stopPropagation(); handleEditProject(p); }} />
                          </Tooltip>
                          <Popconfirm title={t("Төслийг устгах уу?")} onConfirm={(e) => { e.stopPropagation(); handleDeleteProject(p.id); }} onCancel={(e) => e.stopPropagation()}>
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
              <div id="mat-team" className="flex flex-col p-4 shrink-0">
                <div className="text-[12px] font-bold text-gray-400 mb-3 px-1 flex items-center uppercase opacity-70">
                  <span>{t("Ажилтны гүйцэтгэл")}</span>
                </div>
                <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
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
                        className="group flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/5 hover:shadow-sm border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/10 cursor-pointer transition-all"
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
                                  {overdue} {t("Хэтэрсэн")}
                                </span>
                              )}
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
                            <span className="text-[8px] font-bold" style={{ color: '#22c55e' }}>{done} {t("Дууссан")}</span>
                            {active > 0 && <span className="text-[8px] font-bold" style={{ color: '#0096FF' }}>{active} {t("Идэвхтэй")}</span>}
                            {overdue > 0 && <span className="text-[8px] font-bold" style={{ color: '#ef4444' }}>{overdue} {t("Хэтэрсэн")}</span>}
                            {remaining > 0 && <span className="text-[8px] font-bold text-gray-400">{remaining} {t("Хүлээгдэж буй")}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {teamMembers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-400 gap-1 text-[12px] font-bold uppercase ">
                      <TeamOutlined className="text-2xl opacity-20" />
                      {t("Ажилтан байхгүй")}
                    </div>
                  )}
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
                    <div className="text-center text-gray-400 text-[12px]">{t("Түүх байхгүй байна")}</div>
                  ) : (
                    history.slice(0, 10).map((act) => (
                      <div key={act._id || act.id} className="hover:scale-105 relative pl-5 before:content-[''] before:absolute before:left-[5px] before:top-4 before:w-[1px] before:h-[130%] before:bg-slate-400/30 dark:before:bg-slate-600/30 last:before:hidden transition-all">
                        <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800 z-10 shadow-sm"></div>
                        <div className="text-[12px] leading-relaxed">
                          {act.ajiltniiNer && <span className="text-gray-500 dark:text-gray-400 font-bold">{act.ajiltniiNer} </span>}
                          <span className="text-gray-400 font-medium">
                            {act.uildelText || (
                              act.uildel === "created task" || act.uildel === "created" ? (t("даалгавар үүсгэлээ")) :
                              act.uildel === "updated task" || act.uildel === "updated" ? (t("даалгавар шинэчиллээ")) :
                              act.uildel === "added member" || act.uildel === "added" ? (t("гишүүн нэмлээ")) :
                              act.uildel === "deleted task" || act.uildel === "deleted" ? (t("даалгавар устгалаа")) :
                              act.uildel === "completed task" || act.uildel === "completed" ? (t("даалгавар дуусгалаа")) :
                              act.uildel === "message sent" ? (t("зурвас илгээлээ")) :
                              (act.uildel || t("үйлдэл хийлээ"))
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
                    <span className="text-gray-700 dark:text-gray-300 text-[12px] font-bold group-hover:text-white transition-colors">{t("Тусламж")}</span>
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

        <DraggableModal
            title={editingBaraa ? t("Бараа засах") : t("Бараа бүртгэх")}
            open={isAddModalOpen}
            onCancel={() => {
              setIsAddModalOpen(false);
              setEditingBaraa(null);
              form.resetFields();
            }}
            onOk={() => form.submit()}
            okText={t("Хадгалах")}
            cancelText={t("Болих")}
            okButtonProps={{ className: "bg-emerald-500 hover:bg-emerald-400 border-none" }}
          >
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={handleSaveBaraa}
            >
              <div className="grid grid-cols-2 gap-4">
              <Form.Item name="ner" label={t("Барааны нэр")} rules={[{ required: true }]}>
                <Input className="rounded-lg" placeholder={t("Нэр")} autoComplete="off" />
              </Form.Item>
              
                <Form.Item name="turul" label={t("Төрөл")}>
                  <AutoComplete
                    options={Object.keys(typeMap).map(k => ({ value: typeMap[k] }))}
                    filterOption={(inputValue, option) =>
                      option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                    }
                  >
                    <Input className="rounded-lg" placeholder={t("Төрөл бичих...")} />
                  </AutoComplete>
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="negj" label={t("Нэгж")} initialValue="shirheg">
  <Select 
    placeholder="Сонгох"
    onChange={() => {
      // Reset uldegdel when unit changes to avoid invalid values
      const currentVal = form.getFieldValue('uldegdel');
      const negj = form.getFieldValue('negj');
      if (negj === 'shirheg' && currentVal % 1 !== 0) {
        form.setFieldValue('uldegdel', Math.floor(currentVal));
      }
    }}
  >
    <Select.Option value="shirheg">{t("Ширхэг")}</Select.Option>
    <Select.Option value="litr">{t("Литр")}</Select.Option>
    <Select.Option value="kg">{t("Кг")}</Select.Option>
    <Select.Option value="haire">{t("Хайрцаг")}</Select.Option>
  </Select>
</Form.Item>

<Form.Item
  noStyle
  shouldUpdate={(prev, curr) => prev.negj !== curr.negj}
>
  {({ getFieldValue }) => {
    const negj = getFieldValue('negj');
    if (negj === 'haire') {
      return (
        <Form.Item name="shirhegiinToo" label={t("Хайрцаг дахь ширхэг")} initialValue={1} rules={[{ required: true, message: "Оруулна уу" }]}>
          <InputNumber className="w-full rounded-md" min={1} />
        </Form.Item>
      );
    }
    return null;
  }}
</Form.Item>

<Form.Item
  noStyle
  shouldUpdate={(prev, curr) => prev.negj !== curr.negj}
>
  {({ getFieldValue }) => {
    const negj = getFieldValue('negj');
    const isWhole = negj === 'shirheg' || negj === 'haire';
    return (
      <Form.Item name="uldegdel" label={t("Үлдэгдэл")} initialValue={0}
      rules={[
    { required: true, message: "Тоо оруулна уу" },
    { type: 'number', min: 1, message: "0-ээс их байх ёстой" }
  ]}>
        <InputNumber
          className="w-full rounded-md dark:border-gray-700"
          placeholder={t("Үлдэгдэл")}
          precision={isWhole ? 0 : 3}
          step={isWhole ? 1 : 0.001}
          min={0}
        />
      </Form.Item>
    );
  }}
</Form.Item>
                
              </div>

              

              

              
               
               
            </Form>
          </DraggableModal>

          

          <DraggableModal
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
                label={<span className="text-gray-400 text-[12px] font-bold uppercase  pl-1">{t("Өнгө")}</span>}
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
          </DraggableModal>
      </div>
      <GuidedTour 
        steps={tutorialSteps} 
        isOpen={isTutorialOpen} 
        onClose={() => setIsTutorialOpen(false)} 
      />

      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
              <MessageOutlined className="text-emerald-500 text-lg" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-slate-800 dark:text-slate-100 leading-tight">Харилцах</div>
              <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{selectedProjectForChat?.name || selectedProjectForChat?.ner}</div>
            </div>
          </div>
        }
        placement="right"
        onClose={() => setIsProjectChatVisible(false)}
        open={isProjectChatVisible}
        width={420}
        className="dark:bg-[#1a202c] project-chat-drawer"
        headerStyle={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '16px 24px' }}
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {loadingProjectChat ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              <span className="text-slate-400 text-xs animate-pulse">Зурвас ачаалж байна...</span>
            </div>
          ) : projectChatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40 py-20">
              
            </div>
          ) : (
            projectChatMessages.map((msg, i) => {
              const isMe = msg.ajiltniiId === ajiltan?._id;
              return (
                <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-entrance`}>
                  <div className={`max-w-[85%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && <span className="text-[10px] font-bold text-slate-400 mb-1 ml-1">{msg.ajiltniiNer}</span>}
                    <div className={`relative px-4 py-2.5 rounded-2xl text-[13px] shadow-sm ${
                      isMe 
                        ? 'bg-emerald-500 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
                    }`}>
                      {msg.replyTo && (
                        <div className={`mb-2 p-2 rounded-lg text-[11px] border-l-2 ${
                          isMe ? 'bg-emerald-600/30 border-emerald-300' : 'bg-slate-50 border-slate-300'
                        }`}>
                          <div className="font-bold mb-0.5">{msg.replyTo.ajiltniiNer}</div>
                          <div className="truncate opacity-80">{msg.replyTo.medeelel}</div>
                        </div>
                      )}
                      
                      {msg.turul === 'zurag' ? (
                        <div className="space-y-2">
                          <Image src={msg.fileZam} className="rounded-lg max-h-60 object-cover" />
                          {msg.medeelel && <p className="mb-0">{msg.medeelel}</p>}
                        </div>
                      ) : msg.turul === 'file' ? (
                        <a href={msg.fileZam} target="_blank" rel="noreferrer" className={`flex items-center gap-2 p-2 rounded-lg ${isMe ? 'bg-emerald-600/50' : 'bg-slate-50'} transition-colors`}>
                          <FileTextOutlined className="text-lg" />
                          <span className="text-xs font-medium truncate max-w-[150px]">{msg.fileNer}</span>
                        </a>
                      ) : (
                        <p className="mb-0 whitespace-pre-wrap leading-relaxed">{msg.medeelel}</p>
                      )}

                      <div className={`text-[9px] mt-1 opacity-60 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {dayjs(msg.createdAt).format('HH:mm')}
                        {isMe && <CheckCircleOutlined className="text-[8px]" />}
                      </div>

                      <div className={`absolute top-0 ${isMe ? '-left-12' : '-right-12'} hidden group-hover:flex items-center gap-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1.5 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 transition-all`}>
                        <Tooltip title="Хариулах">
                          <Button type="text" size="small" shape="circle" icon={<RollbackOutlined className="text-[10px]" />} onClick={() => setReplyToProject({ chatId: msg._id, medeelel: msg.medeelel, ajiltniiNer: msg.ajiltniiNer, turul: msg.turul })} />
                        </Tooltip>
                        {isMe && (
                          <>
                            <Button type="text" size="small" shape="circle" icon={<EditOutlined className="text-[10px]" />} onClick={() => { setEditingProjectMsg(msg); setEditProjectMsgText(msg.medeelel); }} />
                            <Popconfirm title="Устгах уу?" onConfirm={() => handleDeleteProjectChatMsg(msg._id)} okText="Тийм" cancelText="Үгүй">
                              <Button type="text" size="small" shape="circle" icon={<DeleteOutlined className="text-[10px] text-red-400" />} />
                            </Popconfirm>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={projectChatEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          {replyToProject && (
            <div className="mb-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between border-l-4 border-emerald-500 animate-slide-in">
              <div className="flex-1 min-w-0 pr-4">
                <div className="text-[10px] font-bold text-emerald-500 mb-0.5">Хариулах: {replyToProject.ajiltniiNer}</div>
                <div className="text-xs text-slate-500 truncate">{replyToProject.medeelel}</div>
              </div>
              <Button type="text" size="small" shape="circle" icon={<CloseOutlined className="text-[10px]" />} onClick={() => setReplyToProject(null)} />
            </div>
          )}

          <div className="relative flex items-center bg-[#f3f4f6] dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/60 shadow-inner overflow-hidden">
            <Upload customRequest={handleProjectFileUpload} showUploadList={false} className="absolute left-3 top-1/2 -translate-y-1/2 z-10" disabled={uploadingProjectChatFile}>
              <Button type="text" shape="circle" icon={uploadingProjectChatFile ? <LoadingOutlined className="text-emerald-500" /> : <PaperClipOutlined className="text-gray-500 hover:text-emerald-400 text-lg" />} disabled={uploadingProjectChatFile} className="p-0 border-none" />
            </Upload>
            <Input.TextArea
              placeholder="Зурвас бичих..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              value={projectChatInput}
              onChange={(e) => setProjectChatInput(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendProjectMessage();
                }
              }}
              className="!border-none !shadow-none !bg-transparent py-3 pl-12 pr-12 text-[13px] resize-none focus:!ring-0 dark:text-gray-200"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
              <Button 
                type="primary" 
                shape="circle" 
                icon={<SendOutlined className="text-sm" />} 
                onClick={handleSendProjectMessage}
                disabled={(!projectChatInput.trim() && !selectedProjectChatFile) || uploadingProjectChatFile}
                className={`flex items-center justify-center shadow-lg transition-all duration-300 ${projectChatInput.trim() || selectedProjectChatFile ? 'scale-100 opacity-100 bg-emerald-500' : 'scale-75 opacity-0'}`}
              />
            </div>
          </div>
          {selectedProjectChatFile && (
            <div className="mt-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-between animate-entrance">
              <div className="flex items-center gap-2 overflow-hidden">
                <PaperClipOutlined className="text-emerald-500 text-xs" />
                <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 truncate">{selectedProjectChatFile.name}</span>
              </div>
              <Button type="text" size="small" shape="circle" icon={<CloseOutlined className="text-[10px] text-emerald-400" />} onClick={() => setSelectedProjectChatFile(null)} />
            </div>
          )}
        </div>
      </Drawer>
    </Admin>
  );
}

export default BaraaMaterial;
