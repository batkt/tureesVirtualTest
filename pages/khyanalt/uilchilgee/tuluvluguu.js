import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
import { 
  PlusOutlined, 
  LeftOutlined, 
  RightOutlined, 
  FilterOutlined, 
  SearchOutlined,
  CalendarOutlined,
  DownloadOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  ProjectOutlined,
  CheckOutlined,
  MoreOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  LoadingOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SendOutlined,
  MessageOutlined,
  PaperClipOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { 
  Button, 
  Input, 
  Select, 
  Avatar, 
  Tag, 
  Dropdown,
  Drawer,
  Divider, 
  List, 
  Checkbox,
  Tooltip,
  Modal,
  Form,
  DatePicker,
  Badge,
  Space,
  message,
  Spin,
  Popconfirm,
  Upload
} from "antd";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import _ from "lodash";
import fsmApi, { FSM_BASE_URL } from "services/fsmApi";
import { useAuth } from "services/auth";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";

function Tuluvluguu() {
  const { t } = useTranslation();
  const { token, barilgiinId, ajiltan } = useAuth();
  const baiguullagiinId = ajiltan?.baiguullagiinId;

  // Authenticated API instance — rebuilds when token changes
  const api = useMemo(() => fsmApi.withAuth(token), [token]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState("Month"); // Month, Week, Day, Agenda
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(false);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm] = Form.useForm();
  const [projectForm] = Form.useForm();
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Subtask states
  const [subtasks, setSubtasks] = useState([]);
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  // Chat & WebSocket states
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});
  const [loadingChat, setLoadingChat] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedChatFile, setSelectedChatFile] = useState(null);

  // Real data from backend
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const tutorialSteps = [
    { targetId: "cal-stats", title: "Статистик", description: "Нийт төсөл болон ажлын явцыг эндээс нэгдсэн байдлаар харж болно." },
    { targetId: "cal-sidebar", title: "Төслүүд", description: "Төслүүдээ төрөлжүүлэн харах, шинэ төсөл нэмэх болон хайлт хийх хэсэг." },
    { targetId: "cal-views", title: "Харагдац", description: "Сар, долоо хоног, өдрөөрх харагдацыг эндээс хурдан сольж болно." },
    { targetId: "cal-main", title: "Хуанли", description: "Ажлуудаа хуанли дээр хянах, шинэ ажил нэмэх үндсэн хэсэг. Тухайн өдөр дээр дарж шинэ ажил үүсгэнэ үү." },
  ];

  const { ajilchdiinGaralt } = useAjiltniiJagsaalt(token, baiguullagiinId, barilgiinId);
  const allEmployees = useMemo(() => ajilchdiinGaralt?.jagsaalt || [], [ajilchdiinGaralt]);

  const teamMembers = useMemo(() => {
    if (allEmployees.length > 0) {
      return allEmployees.map(emp => ({
        id: emp._id,
        name: emp.ner || emp.nevtrekhNer,
        role: emp.albanTushaal || emp.erkh || "Ажилтан",
        online: !!onlineUsers[emp._id]
      }));
    }
    return ajiltan ? [{ id: ajiltan._id, name: ajiltan.ner || ajiltan.nevtrekhNer, role: ajiltan.erkh || "Ажилтан", online: true }] : [];
  }, [allEmployees, ajiltan, onlineUsers]);


  const statCards = [
    { title: "Нийт төсөл", value: projects.length.toString() },
    { title: "Нийт ажил", value: tasks.length.toString() },
    { title: "Дууссан ажил", value: tasks.filter(t => t.tuluv === "duussaan").length.toString() },
    { title: "Яаралтай ажил", value: tasks.filter(t => t.zereglel === "yaraltai").length.toString() },
  ];

  // Fetch projects from backend
  const fetchProjects = useCallback(async () => {
    if (!barilgiinId) return;
    setLoadingProjects(true);
    try {
      const res = await api.get("/projects", { params: { baiguullagiinId , barilgiinId } });
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

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    if (!barilgiinId) return;
    setLoadingTasks(true);
    try {
      const res = await api.get("/tasks", { 
        params: { baiguullagiinId, barilgiinId } 
      });
      let list = res.data?.data || res.data || [];
      // Manually injecting the user's specific mock test task
      

      const normalized = list.map(task => {
        const pId = task.projectId || task.project;
        return {
          id: task._id,
          title: task.ner,
          description: task.tailbar,
          date: task.duusakhTsag ? dayjs(task.duusakhTsag).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
          startDate: task.ekhlekhTsag ? dayjs(task.ekhlekhTsag).format("YYYY-MM-DD") : null,
          project: pId,
          projectId: pId,
          projectName: "", // Will be filled by enrichedTasks
          completed: task.tuluv === "duussaan",
          zereglel: task.zereglel,
          tuluv: task.tuluv,
          ...task,
        };
      });
      setTasks(normalized);
    } catch (err) {
      // If backend not reachable, keep empty
    } finally {
      setLoadingTasks(false);
    }
  }, [barilgiinId, baiguullagiinId, api]);

  const fetchHistory = useCallback(async () => {
    if (!barilgiinId) return;
    setLoadingHistory(true);
    try {
      const params = { barilgiinId };
      // If we have selected projects, we can filter by them if the API supports it
      // if (selectedProjectIds.length > 0) params.projectId = selectedProjectIds[0]; 
      
      const res = await api.get("/task-tuukh", { params });
      const list = res.data?.data || res.data || [];
      setHistory(Array.isArray(list) ? list : []);
    } catch (err) {
      // Ignore errors
    } finally {
      setLoadingHistory(false);
    }
  }, [barilgiinId, api]);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchHistory();
  }, [fetchProjects, fetchTasks, fetchHistory]);

  // Calendar Helper Logic
  const monthData = useMemo(() => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDay = startOfMonth.startOf("week");
    const endDay = endOfMonth.endOf("week");
    
    const days = [];
    let day = startDay;
    while (day.isBefore(endDay) || day.isSame(endDay, 'day')) {
      days.push(day);
      day = day.add(1, "day");
    }
    return days;
  }, [currentDate]);

  const weekData = useMemo(() => {
    const startOfWeek = currentDate.startOf("week");
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, "day"));
    }
    return days;
  }, [currentDate]);

  const next = () => {
    if (view === "Month") setCurrentDate(currentDate.add(1, "month"));
    else if (view === "Week") setCurrentDate(currentDate.add(1, "week"));
    else setCurrentDate(currentDate.add(1, "day"));
  };

  const prev = () => {
    if (view === "Month") setCurrentDate(currentDate.subtract(1, "month"));
    else if (view === "Week") setCurrentDate(currentDate.subtract(1, "week"));
    else setCurrentDate(currentDate.subtract(1, "day"));
  };

  const goToday = () => setCurrentDate(dayjs());

  useEffect(() => {
    if (isTaskModalVisible && selectedDay) {
      taskForm.setFieldsValue({ 
        startDate: selectedDay,
        dueDate: selectedDay.set('hour', 23).set('minute', 59)
      });
    }
  }, [isTaskModalVisible, selectedDay, taskForm]);

  const handleCreateTask = async (values) => {
    if (!barilgiinId) { message.warning("Барилгын мэдээлэл байхгүй байна"); return; }
    setSavingTask(true);
    try {
      const dueDate = values.dueDate ? dayjs(values.dueDate).format("YYYY-MM-DD") 
        : (selectedDay ? selectedDay.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"));
      const startDate = values.startDate ? dayjs(values.startDate).format("YYYY-MM-DD") : dueDate;
      const payload = {
        projectId: values.projectId,
        ner: values.title,
        tailbar: values.description || "",
        zereglel: values.zereglel || "engeiin",
        tuluv: "shine",
        hariutsagchId: ajiltan?._id,
        ajiltnuud: ajiltan?._id ? [ajiltan._id] : [],
        ekhlekhTsag: startDate,
        duusakhTsag: dueDate,
        khugatsaaDuusakhOgnoo: dueDate,
        barilgiinId,
        baiguullagiinId,
      };
      const res = await api.post("/tasks", payload);
      if (res.data?.success) {
        message.success("Ажил амжилттай нэмэгдлээ");
        await fetchTasks();
        setIsTaskModalVisible(false);
        taskForm.resetFields();
      }
    } catch (err) {
      message.error(err?.response?.data?.message || "Ажил нэмэхэд алдаа гарлаа");
    } finally {
      setSavingTask(false);
    }
  };

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
        res = await api.put(`/projects/${editingProject.id}`, payload);
      } else {
        res = await api.post("/projects", payload);
      }
      
      if (res.data?.success) {
        message.success(`Төсөл амжилттай ${editingProject ? 'засагдлаа' : 'нэмэгдлээ'}`);
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
      name: proj.name,
      tailbar: proj.tailbar || "",
      ekhlekhOgnoo: proj.ekhlekhOgnoo ? dayjs(proj.ekhlekhOgnoo) : dayjs(),
      duusakhOgnoo: proj.duusakhOgnoo ? dayjs(proj.duusakhOgnoo) : dayjs().add(30, "day"),
      color: proj.color || "#10B981"
    });
    setIsProjectModalVisible(true);
  };

  const handleDeleteProject = async (id) => {
    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.data?.success || res.status === 200 || res.status === 204) {
        message.success("Төсөл амжилттай устгагдлаа");
        setSelectedProjectIds(prev => prev.filter(pId => pId !== id));
        
        
        const projectTasks = tasks.filter(t => t.projectId === id || t.project === id);
        for (const pt of projectTasks) {
          try { await api.delete(`/tasks/${pt.id || pt._id}`); } catch (e) {}
        }
        
        await fetchProjects();
        await fetchTasks();
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

  const enrichedTasks = useMemo(() => {
    return tasks.map(task => {
      const pId = task.projectId || task.project;
      const proj = projects.find(p => (p._id && p._id === pId) || (p.id && p.id === pId));
      return {
        ...task,
        projectId: pId,
        project: pId,
        projectName: proj ? proj.name : "Төсөлгүй",
        projectColor: proj ? proj.color : "#94a3b8"
      };
    });
  }, [tasks, projects]);

  const filteredTasks = useMemo(() => {
    return enrichedTasks.filter(task => {
      const pId = task.projectId || task.project;
      return selectedProjectIds.some(selectedId => selectedId === pId);
    });
  }, [enrichedTasks, selectedProjectIds]);

  const handleTaskClick = (task, e) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsTaskDetailVisible(true);
  };

  const fetchSubtasks = useCallback(async (taskId) => {
    if (!taskId) {
      setSubtasks([]);
      return;
    }
    setLoadingSubtasks(true);
    try {
      const res = await api.get("/subtasks", { params: { taskId } });
      setSubtasks(res.data?.data || res.data || []);
    } catch (err) {
      // Ignore initial errors if backend is missing subtasks
    } finally {
      setLoadingSubtasks(false);
    }
  }, [api]);

  useEffect(() => {
    if (selectedTask && isTaskDetailVisible) {
      fetchSubtasks(selectedTask.id || selectedTask._id);
    } else {
      setSubtasks([]);
      setIsAddingSubtask(false);
      setNewSubtaskTitle("");
    }
  }, [selectedTask, isTaskDetailVisible, fetchSubtasks]);

  const handleCreateSubtask = async () => {
    if (!newSubtaskTitle.trim() || !selectedTask) return;
    try {
      const payload = {
        taskId: selectedTask.id || selectedTask._id,
        projectId: selectedTask.projectId || selectedTask.project,
        baiguullagiinId,
        barilgiinId,
        ner: newSubtaskTitle,
        duussan: false,
      };
      const res = await api.post("/subtasks", payload);
      if (res.data?.success || res.status === 200 || res.status === 201) {
        setNewSubtaskTitle("");
        setIsAddingSubtask(false);
        fetchSubtasks(selectedTask.id || selectedTask._id);
      }
    } catch (err) {
      message.error("Дэд даалгавар нэмэхэд алдаа гарлаа");
    }
  };

  const handleUpdateSubtask = async (subtaskId, updates) => {
    try {
      // Optimistic update
      setSubtasks((prev) => prev.map(s => s._id === subtaskId ? { ...s, ...updates } : s));
      await api.put(`/subtasks/${subtaskId}`, updates);
    } catch (err) {
      message.error("Дэд даалгавар шинэчлэхэд алдаа гарлаа");
      // Could revert in a real-world scenario
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      const res = await api.delete(`/subtasks/${subtaskId}`);
      if (res.data?.success || res.status === 200 || res.status === 204) {
        setSubtasks((prev) => prev.filter(s => s._id !== subtaskId));
        message.success("Дэд даалгавар амжилттай устгагдлаа");
      }
    } catch (err) {
      message.error("Дэд даалгавар устгахад алдаа гарлаа");
    }
  };

  // Get Chat History
  const fetchChatHistory = useCallback(async (taskId, projectId) => {
    if (!taskId || !projectId) {
      setChatMessages([]);
      return;
    }
    setLoadingChat(true);
    try {
      const res = await api.get("/chats", { params: { projectId, taskId, baiguullagiinId, barilgiinId } });
      const msgs = res.data?.data || res.data || [];
      // Assuming array from API, we want to show oldest at top, newest at bottom
      setChatMessages(Array.isArray(msgs) ? msgs.reverse() : []);
    } catch (err) {
      // Chat might not be initialized
    } finally {
      setLoadingChat(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [api, baiguullagiinId, barilgiinId]);

  // WebSocket Setup
  useEffect(() => {
    // Only connect when drawer is visible
    if (!isTaskDetailVisible || !selectedTask) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const projectId = selectedTask.projectId || selectedTask.project;
    const taskId = selectedTask.id || selectedTask._id;
    if (!projectId || !taskId) return;

    fetchChatHistory(taskId, projectId);

    const socket = io(FSM_BASE_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      // 1. Join room
      socket.emit("join_room", { projectId, taskId });
      
      // 2. Set user status
      if (ajiltan?._id) {
        socket.emit("user_online", {
          userId: ajiltan._id,
          status: "online"
        });
      }
    });

    socket.on("new_message", (msg) => {
      setChatMessages(prev => [...prev, msg]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    socket.on("user_status_changed", (data) => {
      setOnlineUsers(prev => ({
        ...prev,
        [data.userId]: data.status
      }));
    });

    return () => {
      if (ajiltan?._id) {
        socket.emit("change_status", { status: "offline" });
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isTaskDetailVisible, selectedTask, ajiltan?._id, fetchChatHistory]);

  const handleSendMessage = async () => {
    if ((!chatInput.trim() && !selectedChatFile) || !selectedTask) return;
    const projectId = selectedTask.projectId || selectedTask.project;
    const taskId = selectedTask.id || selectedTask._id;
    
    setUploadingFile(true);
    try {
      if (selectedChatFile) {
        const formData = new FormData();
        formData.append("file", selectedChatFile);
        formData.append("projectId", projectId);
        formData.append("taskId", taskId);
        if (baiguullagiinId) formData.append("baiguullagiinId", baiguullagiinId);
        if (barilgiinId) formData.append("barilgiinId", barilgiinId);
        formData.append("ajiltniiId", ajiltan?._id || "");
        formData.append("ajiltniiNer", ajiltan?.ner || ajiltan?.nevtrekhNer || "Unknown");
        if (chatInput.trim()) formData.append("medeelel", chatInput.trim());

        await api.post("/chats/upload", formData);
      } else {
        const payload = {
          projectId,
          taskId,
          baiguullagiinId,
          barilgiinId,
          ajiltniiId: ajiltan?._id,
          ajiltniiNer: ajiltan?.ner || ajiltan?.nevtrekhNer || "Unknown",
          medeelel: chatInput.trim(),
          turul: "text",
        };
        await api.post("/chats", payload);
      }
      setChatInput("");
      setSelectedChatFile(null);
    } catch (err) {
      message.error("Зурвас илгээхэд алдаа гарлаа");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddMemberToTask = async (employeeId) => {
    if (!selectedTask) return;
    const taskId = selectedTask.id || selectedTask._id;
    const currentMembers = selectedTask.ajiltnuud || [];
    
    if (currentMembers.includes(employeeId)) {
      message.warning("Энэ ажилтан аль хэдийн нэмэгдсэн байна.");
      return;
    }

    const newMembers = [...currentMembers, employeeId];
    try {
      const res = await api.put(`/tasks/${taskId}`, { ajiltnuud: newMembers });
      if (res.data?.success || res.status === 200) {
        message.success("Ажилтан амжилттай нэмэгдлээ");
        const updatedTask = { ...selectedTask, ajiltnuud: newMembers };
        setSelectedTask(updatedTask);
        setTasks(prev => prev.map(t => (t.id === taskId || t._id === taskId) ? { ...t, ajiltnuud: newMembers } : t));
      }
    } catch (err) {
      message.error("Ажилтан нэмэхэд алдаа гарлаа");
    }
  };

  const handleFileUpload = (options) => {
    // Save file to state and show preview instead of auto-uploading
    setSelectedChatFile(options.file);
    setTimeout(() => {
      options.onSuccess("ok");
    }, 100);
  };

  const completedSubtasksCount = subtasks.filter(s => s.duussan).length;
  const totalSubtasksCount = subtasks.length;
  const progressPercent = totalSubtasksCount === 0 ? 0 : Math.round((completedSubtasksCount / totalSubtasksCount) * 100);

  return (
    <Admin title="Төлөвлөгөө" khuudasniiNer="tuluvluguu">
      <div className="col-span-12 flex h-H8HalfRem w-[calc(100%+0.5rem)] -mx-1 -mt-2 text-black overflow-hidden rounded-2xl shadow-2xl relative">
        <div className="flex-1 flex flex-col p-4 overflow-hidden relative min-w-0">
        
        <div id="cal-stats" className="hideScroll grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0 pt-1">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10 border-2 border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/40 col-span-1`}
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

        <div className="flex-1 flex overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 min-h-0">
          {/* Left Sidebar */}
          <div id="cal-sidebar" className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f2937] p-4 shrink-0">
          
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center space-x-2 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <Checkbox 
                  checked={projects.length > 0 && selectedProjectIds.length === projects.length} 
                  indeterminate={selectedProjectIds.length > 0 && selectedProjectIds.length < projects.length}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedProjectIds(projects.map(p => p.id));
                    else setSelectedProjectIds([]);
                  }}
                  className="[&>.ant-checkbox-inner]:!w-4.5 [&>.ant-checkbox-inner]:!h-4.5 [&>.ant-checkbox-inner]:!rounded-md [&>.ant-checkbox-inner]:!border-gray-300 dark:[&>.ant-checkbox-inner]:!border-gray-600 dark:[&>.ant-checkbox-inner]:!bg-transparent" 
                />
                <span>Ерөнхий</span>
                <RightOutlined style={{ fontSize: '10px' }} className="rotate-90 text-gray-400" />
              </div>
              <Button
                    type="text"
                    size="small"
                    onClick={() => setIsProjectModalVisible(true)}
                    icon={<PlusOutlined className="text-emerald-400 text-[10px]" />}
                    className="!text-emerald-400  text-[10px] font-bold hover:!bg-emerald-500/10 rounded-lg mt-1"
                  >
                    Нэмэх
                  </Button>
            </div>
            
            <div className="space-y-2 ml-6">
              {projects.map(p => (
                <div key={p.id} className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer group py-1.5 transition-colors">
                  <Checkbox 
                    checked={selectedProjectIds.includes(p.id)} 
                    onChange={() => toggleProject(p.id)}
                    className="[&>.ant-checkbox-inner]:!rounded-md" 
                  />
                  <div className="h-3 w-3 rounded shadow-sm shrink-0" style={{ backgroundColor: p.color }}></div>
                  <span className="flex-1 truncate font-bold text-xs">{p.name}</span>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 shrink-0">
                    <Tooltip title="Засах">
                      <Button type="text" size="small" icon={<EditOutlined className="text-gray-400 hover:text-blue-500 text-[10px]" />} onClick={(e) => { e.stopPropagation(); handleEditProject(p); }} />
                    </Tooltip>
                    <Popconfirm title="Төслийг устгах уу?" onConfirm={(e) => { e.stopPropagation(); handleDeleteProject(p.id); }} onCancel={(e) => e.stopPropagation()}>
                      <Button type="text" size="small" icon={<DeleteOutlined className="text-gray-400 hover:text-red-500 text-[10px]" />} onClick={(e) => e.stopPropagation()} />
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Calendar View */}
        <div className="flex flex-1 flex-col bg-white dark:bg-gray-800 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm z-20 h-16 shrink-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button 
                  className="bg-gray-100 dark:bg-[#374151] border-none text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-black rounded-xl px-4 h-10 shadow-sm"
                  onClick={goToday}
                >
                  Өнөөдөр
                </Button>
                <div className="flex items-center bg-gray-100 dark:bg-[#374151] rounded-xl p-1 shrink-0">
                  <Button type="text" size="small" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-0 flex items-center justify-center w-8 h-8 rounded-lg" onClick={prev}>
                    <LeftOutlined style={{ fontSize: '12px' }} />
                  </Button>
                  <span className="font-black text-[12px] min-w-[150px] text-center text-gray-800 dark:text-gray-100 px-3 select-none uppercase tracking-tight">
                    {view === "Month" ? currentDate.format("MMMM YYYY") : 
                     view === "Week" ? `Week of ${currentDate.startOf('week').format("MMM DD")}` :
                     currentDate.format("MMMM DD, YYYY")}
                  </span>
                  <Button type="text" size="small" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-0 flex items-center justify-center w-8 h-8 rounded-lg" onClick={next}>
                    <RightOutlined style={{ fontSize: '12px' }} />
                  </Button>
                </div>
              </div>
              
            </div>
            
            <div id="cal-views" className="flex items-center bg-gray-100 dark:bg-[#1f2937] rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-inner shrink-0">
              {[
                { label: "Сар", value: "Month" },
                { label: "Долоо", value: "Week" },
                { label: "Өдөр", value: "Day" },
                { label: "Agenda", value: "Agenda" },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setView(value)}
                  className={`px-5 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all duration-200 uppercase ${
                    view === value 
                      ? "bg-teal-500 text-white shadow-lg transform scale-105" 
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            
              
          </div>

          {/* Grid View */}
          <div id="cal-main" className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-800 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
            {view === "Month" && (
              <div className="flex flex-col h-full min-h-[600px]">
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 shadow-sm shrink-0">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
                    <div key={day} className="p-3 text-center text-[11px] font-black text-gray-400 dark:text-gray-500 tracking-widest border-r border-gray-100 dark:border-gray-800 uppercase last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 flex-1">
                  {monthData.map((date, idx) => {
                    const dayTasks = filteredTasks.filter(t => {
                      const d = date.format("YYYY-MM-DD");
                      return d === t.date || d === t.startDate || (t.startDate && d >= t.startDate && d <= t.date);
                    });
                    const isCurrentMonth = date.month() === currentDate.month();
                    const isToday = date.isSame(dayjs(), 'day');
                    
                    return (
                      <div 
                        key={idx} 
                        className={`min-h-[140px] border-b border-r border-gray-300 dark:border-gray-900 p-2 transition-all hover:bg-gray-300 dark:hover:bg-gray-900/10 relative flex flex-col group cursor-pointer ${
                          !isCurrentMonth ? "bg-gray-50/50 dark:bg-gray-950/20 opacity-30" : "bg-white dark:bg-gray-800"
                        }`}
                        onClick={() => {
                          setSelectedDay(date);
                          setIsTaskModalVisible(true);
                        }}
                      >
                        <div className="flex items-center justify-end mb-2">
                          <span className={`text-[12px] font-black rounded-full w-7 h-7 flex items-center justify-center transition-all ${
                            isToday ? "bg-teal-500 text-white shadow-lg transform scale-110" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300"
                          }`}>
                            {date.format("D")}
                          </span>
                        </div>
                        
                        <div className="flex flex-col space-y-1.5 overflow-hidden">
                          {dayTasks.map(task => (
                            <Tooltip key={task.id} title={`${task.project}: ${task.title}`}>
                              <div 
                                onClick={(e) => handleTaskClick(task, e)}
                                className="flex items-center space-x-2 p-2 rounded-lg text-[10px] font-black border-l-3 shadow-sm hover:shadow-md transition-all group/task text-gray-800 dark:text-gray-200 uppercase tracking-tight"
                                style={{ 
                                  borderLeftColor: task.projectColor || "#14b8a6",
                                  backgroundColor: (task.projectColor || "#14b8a6") + "15" // 8.5% opacity tint
                                }}
                              >
                                {task.completed ? 
                                  <CheckOutlined style={{ color: task.projectColor || "#14b8a6" }} className="scale-110" /> : 
                                  <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: task.projectColor || "#14b8a6" }}></div>
                                }
                                <span className="truncate flex-1">{task.title}</span>
                              </div>
                            </Tooltip>
                          ))}
                        </div>

                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all scale-90 translate-y-2 group-hover:translate-y-0">
                          <Button 
                            size="small" 
                            className="bg-teal-500 !border-none text-white flex items-center justify-center rounded-lg shadow-lg"
                            icon={<PlusOutlined />}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {view === "Week" && (
              <div className="flex flex-col h-full bg-white dark:bg-gray-800">
                <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] sticky top-0 z-10 shadow-sm shrink-0">
                  <div className="p-3 border-r border-gray-100 dark:border-gray-900 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase flex items-center justify-center">TIME</div>
                  {weekData.map(date => (
                    <div key={date.toString()} className="p-3 text-center border-r border-gray-100 dark:border-gray-900 last:border-r-0">
                      <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-1">{date.format("ddd")}</div>
                      <div className={`text-[12px] font-black ${date.isSame(dayjs(), 'day') ? "text-teal-500" : "text-gray-700 dark:text-gray-300"}`}>{date.format("DD")}</div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 grid grid-cols-8 overflow-y-auto">
                  <div className="flex flex-col border-r border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-950/20">
                    {Array.from({length: 24}).map((_, i) => (
                      <div key={i} className="h-20 border-b border-gray-100 dark:border-gray-900/40 p-2 text-[10px] font-black text-gray-400 dark:text-gray-600 flex items-start justify-center uppercase">
                        {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i-12} PM`}
                      </div>
                    ))}
                  </div>
                  {weekData.map(date => (
                    <div key={date.toString()} className="border-r border-gray-100 dark:border-gray-900 relative">
                      {Array.from({length: 24}).map((_, i) => (
                        <div key={i} className="h-20 border-b border-gray-50 dark:border-gray-900/20 group cursor-crosshair hover:bg-teal-500/5 transition-colors">
                        </div>
                      ))}
                      <div className="absolute top-0 left-0 w-full p-2 space-y-2">
                        {filteredTasks.filter(t => t.date === date.format("YYYY-MM-DD")).map(task => (
                          <div 
                            key={task.id} 
                            onClick={(e) => handleTaskClick(task, e)}
                            className="border-l-4 rounded-xl p-3 text-[11px] font-black text-gray-800 dark:text-gray-100 shadow-xl border border-gray-100 dark:border-gray-700/50 uppercase tracking-tighter cursor-pointer hover:scale-[1.02] transition-transform"
                            style={{ 
                              borderLeftColor: task.projectColor || "#14b8a6",
                              backgroundColor: (task.projectColor || "#14b8a6") + "15"
                            }}
                          >
                            {task.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {view === "Day" && (
              <div className="flex flex-col h-full bg-white dark:bg-gray-800">
                <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] sticky top-0 z-10 shadow-sm shrink-0">
                  <div className="w-20 p-3 border-r border-gray-100 dark:border-gray-900 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase flex items-center justify-center">TIME</div>
                  <div className="flex-1 p-3 text-center">
                    <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-1">{currentDate.format("dddd")}</div>
                    <div className="text-[12px] font-black text-teal-500">{currentDate.format("MMMM DD, YYYY")}</div>
                  </div>
                </div>
                <div className="flex-1 flex overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700">
                  <div className="w-20 flex flex-col border-r border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-950/20 shrink-0">
                    {Array.from({length: 24}).map((_, i) => (
                      <div key={i} className="h-20 border-b border-gray-100 dark:border-gray-900/40 p-2 text-[10px] font-black text-gray-400 dark:text-gray-600 flex items-start justify-center uppercase">
                        {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i-12} PM`}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 relative bg-white dark:bg-[#111827]/30">
                    {Array.from({length: 24}).map((_, i) => (
                      <div key={i} className="h-20 border-b border-gray-50 dark:border-gray-900/20 group cursor-crosshair hover:bg-teal-500/5 transition-colors">
                      </div>
                    ))}
                    <div className="absolute top-0 left-0 w-full p-4 space-y-3">
                      {filteredTasks.filter(t => t.date === currentDate.format("YYYY-MM-DD")).map(task => (
                        <div 
                          key={task.id} 
                          onClick={(e) => handleTaskClick(task, e)}
                          className="border-l-4 rounded-xl p-4 text-[13px] font-black text-gray-800 dark:text-gray-100 shadow-2xl border border-gray-100 dark:border-gray-700/50 uppercase tracking-tighter cursor-pointer hover:scale-[1.01] transition-transform"
                          style={{ 
                            borderLeftColor: task.projectColor || "#14b8a6",
                            backgroundColor: (task.projectColor || "#14b8a6") + "15"
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                             <span className="text-[10px] font-extrabold" style={{ color: task.projectColor || "#94a3b8" }}>{task.projectName}</span>
                             {task.completed && <CheckOutlined style={{ color: task.projectColor || "#14b8a6" }} />}
                          </div>
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === "Agenda" && (() => {
              const today = dayjs().format("YYYY-MM-DD");
              const overdue = filteredTasks.filter(t => t.date < today && !t.completed);
              const dueToday = filteredTasks.filter(t => 
                (t.date === today || (t.startDate <= today && t.date >= today)) && !overdue.includes(t)
              );
              const upcoming = filteredTasks.filter(t => t.startDate > today && !overdue.includes(t) && !dueToday.includes(t));

              const statusColor = (tuluv) => tuluv === "duussaan"
                ? "text-green-600 dark:text-green-400 bg-green-500/10"
                : tuluv === "hiij_baina"
                ? "text-yellow-600 dark:text-yellow-400 bg-yellow-400/10"
                : "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
              const statusLabel = (tuluv) => tuluv === "duussaan" ? "Дууссан" : tuluv === "hiij_baina" ? "Хийж байна" : "Шинэ";
              const priorityDot = (z) => z === "yaraltai" ? "bg-red-500" : z === "engeiin" ? "bg-yellow-400" : "bg-green-500";

              const AgendaGroup = ({ label, tasks: groupTasks, labelCls, countBg }) => {
                if (groupTasks.length === 0) return null;
                return (
                  <div>
                    {/* Group header row */}
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-[#111827]/50 sticky top-0 z-10">
                      <span className={`text-[11px] font-black uppercase tracking-widest ${labelCls}`}>{label}</span>
                      <span className={`min-w-[20px] h-5 px-1.5 rounded-full ${countBg} text-white text-[10px] font-black flex items-center justify-center`}>{groupTasks.length}</span>
                    </div>
                    {/* Column headers */}
                    <div className="grid grid-cols-12 px-5 py-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800">
                      <div className="col-span-5 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Ажил</div>
                      <div className="col-span-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Төлөв</div>
                      <div className="col-span-3 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Төсөл</div>
                      <div className="col-span-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Дуусах</div>
                    </div>
                    {/* Task rows */}
                    {groupTasks.map(task => {
                      const proj = projects.find(p => p.id === task.projectId || p.id === task.project || p._id === task.projectId);
                      return (
                        <div
                          key={task.id}
                          onClick={(e) => handleTaskClick(task, e)}
                          className="grid grid-cols-12 items-center px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/20 cursor-pointer transition-colors"
                        >
                          <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                            <Checkbox checked={task.completed} onClick={e => e.stopPropagation()} className="shrink-0" />
                            <div className={`w-2 h-2 rounded-full shrink-0 ${priorityDot(task.zereglel)}`} />
                            <span className={`text-[13px] font-semibold truncate ${task.completed ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-200"}`}>
                              {task.title}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${statusColor(task.tuluv)}`}>
                              {statusLabel(task.tuluv)}
                            </span>
                          </div>
                          <div className="col-span-3 flex items-center gap-2 min-w-0">
                            {proj && <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: proj.color || "#10B981" }} />}
                            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 truncate">{proj?.name || "—"}</span>
                          </div>
                          <div className="col-span-2">
                            <span className={`text-[11px] font-bold ${task.date < today && !task.completed ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
                              {task.date ? dayjs(task.date).format("MMM DD") : "—"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {/* + Add task row */}
                    <div
                      onClick={() => {
                         setSelectedDay(dayjs()); setIsTaskModalVisible(true); }}
                      className="flex items-center gap-3 px-5 py-3 text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/10 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800"
                    >
                      <PlusOutlined className="text-[11px]" />
                      <span className="text-[12px] font-semibold">Ажил нэмэх</span>
                    </div>
                  </div>
                );
              };

              return (
                <div className="flex flex-col h-full bg-white dark:bg-gray-800 overflow-auto">
                  {filteredTasks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 py-20 space-y-3">
                      <CalendarOutlined style={{ fontSize: '40px' }} />
                      <div className="text-[13px] font-bold">Ажил байхгүй байна</div>
                      <div className="text-[11px]">Шинэ ажил нэмэхийн тулд тэмдэглэсэн өдөр дарна уу</div>
                    </div>
                  ) : (
                    <>
                      <AgendaGroup label={`Хугацаа хэтэрсэн (${overdue.length})`} tasks={overdue} labelCls="text-red-500" countBg="bg-red-500" />
                      <AgendaGroup label={`Өнөөдөр дуусах (${dueToday.length})`} tasks={dueToday} labelCls="text-yellow-500" countBg="bg-yellow-400" />
                      <AgendaGroup label={`Ирэх ажлууд (${upcoming.length})`} tasks={upcoming} labelCls="text-blue-500" countBg="bg-blue-500" />
                    </>
                  )}
                </div>
              );
            })()}
        </div>
      </div> {/* End of grid container */}
      </div> {/* End of inner padding */}
      </div> {/* End of Left Card */}

        {/* Right Sidebar */}
        <div className={`transition-all duration-300 flex flex-col shrink-0 z-20 ${isRightPanelExpanded ? 'w-[340px] opacity-100 h-[calc(102vh-6rem)]' : 'w-0 opacity-0 whitespace-nowrap'}`}>  
          <div className="flex-1 m-3 bg-white dark:bg-[#1f2636] rounded-[2rem] border border-slate-100 dark:border-slate-800/60 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto w-full flex flex-col [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
            {/* Top Activity Section */}
            <div className="flex flex-col shrink-0 m-4 mb-2 bg-white dark:bg-gray-900/40 rounded-2xl border border-slate-200 dark:border-slate-700/30 overflow-hidden shadow-lg">
              <div className="flex items-center justify-between p-4 pb-3 shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center">
                     <ClockCircleOutlined className="dark:text-gray-400 text-gray-800 text-[10px]" />
                  </div>
                  <span className="font-extrabold text-black dark:text-white text-[11px] tracking-wide">Түүх</span>
                </div>
                <Button type="text" size="small" className="hover:!bg-slate-600/50 hover:text-white transition-all rounded-md px-1 w-6 h-6 border border-slate-700/50" icon={<CloseOutlined className="text-gray-400 text-[10px]" />} onClick={() => setIsRightPanelExpanded(false)} />
              </div>
                            <div className="px-5 py-3 space-y-5">
                {loadingHistory ? (
                  <div className="flex justify-center py-4"><Spin size="small" /></div>
                ) : history.length === 0 ? (
                  <div className="text-center text-gray-400 text-[11px]">Түүх байхгүй байна</div>
                ) : (
                  history.slice(0, 10).map((act) => (
                    <div key={act._id || act.id} className="hover:scale-105 relative pl-6 before:content-[''] before:absolute before:left-[5px] before:top-4 before:w-[2px] before:h-[130%] before:bg-slate-400/60 dark:before:bg-slate-600/60 last:before:hidden">
                      <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-[#10b981] border-2 border-[#262c3d] z-10 shadow-sm"></div>
                      <div className="text-[11.5px] leading-relaxed">
                        {act.ajiltniiNer && <span className="text-gray-500 dark:text-gray-400 font-bold">{act.ajiltniiNer} </span>}
                        <span className="text-gray-400 font-medium">{act.uildelText || act.uildel || 'үйлдэл хийлээ'}</span>
                        {act.taskNer && <span className="text-emerald-500 font-extrabold ml-1">{act.taskNer}</span>}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1 font-medium tracking-wide">
                        {dayjs(act.createdAt).format("MMM DD, h:mm A")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Workspace / Projects / Members Section */}
            <div className="flex-1 flex flex-col p-4 space-y-6">
              
              {/* Search Input */}
              {/* <div className="relative shrink-0 w-full group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                   <SearchOutlined className="text-gray-500 text-xs group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input 
                  placeholder="Хайх..." 
                  className="w-full bg-white dark:bg-gray-800 border border-slate-300 dark:border-slate-700/50 text-gray-200 pl-9 pr-8 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-300 dark:placeholder-gray-500 font-semibold shadow-inner transition-all"
                />
                
              </div> */}
              <div className="border-b border-slate-200 dark:border-slate-700/50"></div>
              {/* General Categories */}
              <div className="flex flex-col space-y-3 shrink-0 dark:bg-gray-900/40 rounded-lg p-2 shadow-md border dark:border-slate-700/50">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                    <span>Төслүүд </span>
                    <DownOutlined className="text-[8px] text-gray-500 cursor-pointer hover:text-white transition-colors" />
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
                
                {loadingProjects ? (
                  <div className="flex justify-center py-4"><Spin size="small" /></div>
                ) : projects.length === 0 ? (
                  <div className="text-center text-gray-400 text-[11px] py-4 font-medium">Төсөл байхгүй байна</div>
                ) : (
                  projects.map(p => (
                    <div key={p.id} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-300 dark:hover:bg-gray-900 px-3 py-2 rounded-xl transition-colors border border-transparent">
                      <div className="w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-extrabold text-white shadow-lg" style={{ backgroundColor: p.color || "#10B981" }}>
                        {(p.name || "").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[12px] font-bold text-gray-500 dark:text-gray-200 group-hover:text-white truncate">{p.name}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 shrink-0">
                        <Tooltip title="Засах">
                          <Button type="text" size="small" icon={<EditOutlined className="text-gray-400 hover:text-blue-500 text-[10px]" />} onClick={(e) => { e.stopPropagation(); handleEditProject(p); }} />
                        </Tooltip>
                        <Popconfirm title="Төслийг устгах уу?" onConfirm={(e) => { e.stopPropagation(); handleDeleteProject(p.id); }} onCancel={(e) => e.stopPropagation()}>
                          <Button type="text" size="small" icon={<DeleteOutlined className="text-gray-400 hover:text-red-500 text-[10px]" />} onClick={(e) => e.stopPropagation()} />
                        </Popconfirm>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Team Members */}
              <div className="pt-4 shrink-0 dark:bg-gray-900/40 rounded-lg p-2 shadow-md border dark:border-slate-700/50 overflow-y-auto max-h-[400px]">
                <div className="text-[11px] font-extrabold text-gray-400 mb-4 px-1 flex items-center tracking-wide">
                  <span>Ажилчид</span>
                </div>
                <div className="space-y-1.5">
                  {teamMembers.map((member, i) => (
                    <div key={i} className="flex items-center group cursor-pointer transition-colors px-3 py-2 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-900 border border-transparent">
                      <div className="flex items-center space-x-3 w-full">
                        <Avatar size="medium" className="bg-gradient-to-tr from-green-300 to-gray-500 dark:from-green-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-black border border-white dark:border-gray-800 shadow-xl">
                          <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                        </Avatar>
                        <div className="flex flex-col min-w-0 flex-1 justify-center">
                          <div className="text-[11.5px] font-bold text-gray-500 dark:text-gray-300 group-hover:text-white truncate leading-tight">{member.name}</div>
                          <div className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">{member.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
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
        
        {/* Float Open Button */}
        {!isRightPanelExpanded && (
           <div 
             className="absolute right-0 top-1/3 -translate-y-1/2 bg-green-600 dark:bg-green-900 border border-r-0 border-green-700/60 w-8 h-12 rounded-l-lg flex flex-col items-center justify-center cursor-pointer shadow-xl dark:hover:bg-green-600 hover:bg-green-400 hover:-translate-x-1 transition-all z-[100]"
             onClick={() => setIsRightPanelExpanded(true)}
           >
             <RightOutlined className="text-gray-800 dark:text-gray-400 text-[10px] rotate-180" />
           </div>
        )}
      </div>

      {/* Add Task Modal - Tailored Tailwind Styling */}
      <Modal
        title={t("Таск нэмэх")}
        visible={isTaskModalVisible}
        onCancel={() => setIsTaskModalVisible(false)}
        footer={null}
        width={680}
        centered
      >
        <Form form={taskForm} layout="vertical" onFinish={handleCreateTask} className="space-y-6">
          <Form.Item 
            name="title" 
            label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Ажлын нэр</span>} 
            required 
            rules={[{ required: true, message: 'Ажлын нэр оруулна уу' }]}
            className="!mb-0"
          >
            <Input placeholder="Ажлын нэр оруулна уу" className="h-12 rounded-xl" />
          </Form.Item>
          
          <Form.Item name="description" label={<span className="text-gray-400  text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Дэлгэрэнгүй</span>} className="!mb-0">
            <Input.TextArea placeholder="Ажлын дэлгэрэнгүй тайлбар..." className="rounded-xl" rows={3} />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-6">
            <Form.Item 
              name="projectId" 
              label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Төсөл</span>}
              rules={[{ required: true, message: 'Төсөл сонгоно уу' }]}
              className="!mb-0"
            >
              <Select 
                className="w-full h-12 [&>.ant-select-selector]:!h-12 [&>.ant-select-selector]:!rounded-xl [&>.ant-select-selector]:!items-center [&>.ant-select-selector]:!flex"
                placeholder="Төсөл сонгох"
                loading={loadingProjects}
              >
                {projects.map(p => <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>)}
              </Select>
            </Form.Item>

            <Form.Item 
              name="zereglel" 
              label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Зэрэглэл</span>}
              initialValue="engiin"
              className="!mb-0"
            >
              <Select className="w-full h-12 [&>.ant-select-selector]:!h-12 [&>.ant-select-selector]:!rounded-xl [&>.ant-select-selector]:!items-center [&>.ant-select-selector]:!flex">
                <Select.Option value="nen yaraltai">🔴 Нэн Яаралтай</Select.Option>
                <Select.Option value="yaraltai">🟠 Яаралтай</Select.Option>
                <Select.Option value="engiin">🟢 Энгийн</Select.Option>
                <Select.Option value="baga">🔵 Бага</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item name="startDate" label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Эхлэх өдөр</span>} className="!mb-0">
              <DatePicker 
                className="w-full h-12 rounded-xl" 
                placeholder="Эхлэх өдөр"
                format="YYYY-MM-DD"
              />
            </Form.Item>
            <Form.Item name="dueDate" label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Дуусах хугацаа</span>} initialValue={selectedDay || dayjs()} className="!mb-0">
              <DatePicker 
                className="w-full h-12 rounded-xl" 
                placeholder="Дуусах өдөр"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </div>
          
          <div className="flex items-end justify-end pt-6 border-t dark:border-slate-700/50 border-gray-300">
             <Space size="middle">
               <Button onClick={() => setIsTaskModalVisible(false)} disabled={savingTask}>
                 {t("Цуцлах")}
               </Button>
               <Button type="primary" htmlType="submit" loading={savingTask}>
                 {t("Үүсгэх")}
               </Button>
             </Space>
          </div>
        </Form>
      </Modal>

      {/* Add Project Modal - Refactored */}
      <Modal
        title={editingProject ? t("Төсөл засах") : t("Шинэ ажил эхлүүлэх")}
        visible={isProjectModalVisible}
        onCancel={() => { setIsProjectModalVisible(false); setEditingProject(null); projectForm.resetFields(); }}
        footer={null}
        width={480}
        centered
      >
        <Form form={projectForm} layout="vertical" onFinish={handleCreateProject} className="space-y-6">
          <Form.Item 
            name="name" 
            label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Төслийн нэр</span>}
            required
            rules={[{ required: true, message: 'Төслийн нэр оруулна уу' }]}
          >
            <Input placeholder="Жишээ нь: Барилга А засвар" className="h-12 rounded-xl" />
          </Form.Item>

          <Form.Item 
            name="tailbar" 
            label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Тайлбар</span>}
          >
            <Input.TextArea placeholder="Төслийн дэлгэрэнгүй тайлбар..." className="rounded-xl" rows={2} />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="ekhlekhOgnoo" 
              label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Эхлэх өдөр</span>}
              initialValue={dayjs()}
            >
              <DatePicker className="w-full h-12 rounded-xl" format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item 
              name="duusakhOgnoo" 
              label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Дуусах өдөр</span>}
              initialValue={dayjs().add(30, "day")}
            >
              <DatePicker className="w-full h-12 rounded-xl" format="YYYY-MM-DD" />
            </Form.Item>
          </div>

          <Form.Item 
            name="color" 
            label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Өнгө</span>}
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
            <Button onClick={() => { setIsProjectModalVisible(false); setEditingProject(null); projectForm.resetFields(); }} disabled={savingProject}>
              {t("Цуцлах")}
            </Button>
            <Button type="primary" htmlType="submit" loading={savingProject}>
              {editingProject ? t("Хадгалах") : t("Үүсгэх")}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Task Detail Left Drawer */}
      <Drawer
        title={null}
        closable={false}
        visible={isTaskDetailVisible}
        onClose={() => setIsTaskDetailVisible(false)}
        width={1100}
        placement="right"
        className="!p-0"
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex h-full w-full bg-white dark:bg-[#111827]">
          {/* LEFT CONTENT (Original Drawer Content) */}
          <div className="w-1/2 flex flex-col h-full overflow-y-auto p-8 custom-scrollbar">
            <div className="flex items-center justify-between border-b pb-6 dark:border-gray-800">
              <div className="flex items-center space-x-4">
                <Tag color="cyan" className="rounded-md px-3 py-1 font-bold uppercase text-[10px] bg-teal-500/10 text-teal-600 border border-teal-500/20">
                {selectedTask?.taskId}
              </Tag>
              <span className={`font-bold text-sm ${selectedTask?.tuluv === 'duussaan' ? 'text-green-500' : selectedTask?.tuluv === 'hiij_baina' ? 'text-yellow-500' : 'text-teal-500'}`}>
                {selectedTask?.tuluv === 'duussaan' ? 'Дууссан' : selectedTask?.tuluv === 'hiij_baina' ? 'Хийж байна' : 'Шинэ'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Checkbox className="scale-125" />
              <h1 className="text-2xl font-bold m-0 dark:text-white">{selectedTask?.title}</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {selectedTask?.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="flex flex-col space-y-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Ажилтнууд</span>
                <div className="flex items-center space-x-2">
                  {selectedTask?.ajiltnuud?.map((aId, i) => {
                    const member = allEmployees.find(m => m._id === aId);
                    return (
                      <Tooltip key={aId || i} title={member?.ner || member?.nevtrekhNer || "Ажилтан"}>
                        <Avatar className="bg-teal-500 font-black">
                          {(member?.ner || member?.nevtrekhNer || "У")?.charAt(0)?.toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    );
                  })}
                  {(!selectedTask?.ajiltnuud || selectedTask?.ajiltnuud?.length === 0) && (
                    <Avatar className="bg-gray-500 font-black">?</Avatar>
                  )}
                  {ajiltan?.erkh === "Admin" && (
                    <Dropdown
                      menu={{
                        items: allEmployees
                          .filter(emp => !selectedTask?.ajiltnuud?.includes(emp._id))
                          .map(emp => ({
                            key: emp._id,
                            label: emp.ner || emp.nevtrekhNer,
                            onClick: () => handleAddMemberToTask(emp._id)
                          })),
                      }}
                      trigger={['click']}
                    >
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-500 hover:border-teal-500 hover:text-teal-500 cursor-pointer transition-all">
                        <PlusOutlined style={{ fontSize: '12px' }} />
                      </div>
                    </Dropdown>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Огноо</span>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold text-gray-800 dark:text-gray-300">
                    {selectedTask?.date ? dayjs(selectedTask.date).format("MMM DD, YYYY") : "—"}
                  </div>
                  <div className={`text-[11px] font-black uppercase ${selectedTask?.zereglel === 'yaraltai' ? 'text-red-500' : selectedTask?.zereglel === 'engiin' ? 'text-yellow-500' : 'text-teal-500'}`}>
                    {selectedTask?.zereglel === "yaraltai" ? "Яаралтай" : selectedTask?.zereglel === "engiin" ? "Энгийн" : selectedTask?.zereglel === "baga" ? "Бага" : selectedTask?.zereglel || "Энгийн"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase">
                Дэд ажил ({completedSubtasksCount} / {totalSubtasksCount})
              </span>
              {totalSubtasksCount > 0 && (
                <div className="flex-1 ml-6 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                </div>
              )}
            </div>

            <div className="space-y-4 relative min-h-[100px]">
              {loadingSubtasks && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-10"><Spin /></div>
              )}
              {subtasks.map(s => (
                <div key={s._id} className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-teal-500 transition-colors cursor-pointer group">
                  <Checkbox 
                    className="scale-110" 
                    checked={s.duussan} 
                    onChange={(e) => handleUpdateSubtask(s._id, { duussan: e.target.checked, ner: s.ner })} 
                  />
                  <span className={`text-sm flex-1 ${s.duussan ? 'text-gray-400 line-through' : 'text-gray-600 dark:text-gray-300 group-hover:text-teal-500'}`}>
                    {s.ner}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Popconfirm title="Дэд даалгаврыг устгах уу?" onConfirm={() => handleDeleteSubtask(s._id)}>
                       <Button type="text" size="small" icon={<DeleteOutlined className="text-gray-400 hover:text-red-500" />} />
                    </Popconfirm>
                  </div>
                </div>
              ))}
              
              {isAddingSubtask ? (
                <div className="flex items-center space-x-2">
                  <div className="flex-1 border border-teal-500 rounded-xl p-1 pr-2 flex items-center shadow-sm">
                    <Input 
                      autoFocus
                      placeholder="Дэд даалгаврын нэр..." 
                      className="border-none shadow-none text-sm h-10 w-full rounded-lg"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onPressEnter={handleCreateSubtask}
                    />
                  </div>
                  <Button type="primary" className="h-10 rounded-xl" onClick={handleCreateSubtask} disabled={!newSubtaskTitle.trim()}>Хадгалах</Button>
                  <Button type="text" className="h-10 rounded-xl" onClick={() => { setIsAddingSubtask(false); setNewSubtaskTitle(""); }}>Цуцлах</Button>
                </div>
              ) : (
                <Button type="dashed" block icon={<PlusOutlined />} className="hover:bg-emerald-400 hover:text-gray-200 h-12 border-gray-300 dark:border-gray-700 bg-emerald-600/40 dark:bg-gray-600/40 dark:text-gray-400 hover:scale-105 transition-colors" onClick={() => setIsAddingSubtask(true)}>
                  {t("Ажил нэмэх")}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT (Chat & Activity) */}
        <div className="w-1/2 flex flex-col h-full bg-gray-50 dark:bg-[#161d2d] border-l border-gray-200 dark:border-gray-800 relative">
          
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
             <div className="flex items-center space-x-3">
               <MessageOutlined className="text-gray-400 text-lg" />
               <h3 className="text-sm font-bold m-0 dark:text-white">Харилцах</h3>
               <Badge count={chatMessages.length} className="ml-2 text-white rounded-md px-1" />
             </div>
             
             <Button type="text" shape="circle" icon={<CloseOutlined className="text-gray-400" />} onClick={() => setIsTaskDetailVisible(false)} />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
             {loadingChat ? (
               <div className="flex justify-center py-10"><Spin /></div>
             ) : chatMessages.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-gray-400 h-full opacity-50 space-y-3">
                 <MessageOutlined className="text-4xl" />
                 <p className="text-xs font-semibold uppercase tracking-widest">Одоогоор мессеж байхгүй байна</p>
               </div>
             ) : (
               <div className="flex flex-col space-y-5">
                 {chatMessages.map((msg, idx) => (
                   <div key={idx} className="flex space-x-3 group">
                     <Avatar className="bg-teal-500 font-bold shrink-0">
                       {msg.ajiltniiNer?.charAt(0)?.toUpperCase()}
                     </Avatar>
                     <div className="flex flex-col flex-1 min-w-0">
                       <div className="flex justify-between items-baseline mb-1">
                         <span className="text-[12px] font-bold text-gray-800 dark:text-gray-300 truncate">
                           {msg.ajiltniiNer}
                         </span>
                         <span className="text-[10px] text-gray-400 ml-2 shrink-0">
                           {dayjs(msg.createdAt).format("MMM DD, h:mm A")}
                         </span>
                       </div>
                       <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl rounded-tl-none p-3 shadow-sm text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed break-words overflow-hidden">
                         {msg.turul === 'zurag' && msg.fileZam ? (
                           <div className="flex flex-col space-y-2">
                             {msg.medeelel && msg.medeelel.trim() !== "" && msg.medeelel !== msg.fileNer && (
                               <span className="text-[13px] whitespace-pre-wrap">{msg.medeelel}</span>
                             )}
                             <img 
                               src={msg.fileZam.startsWith('http') ? msg.fileZam : `${FSM_BASE_URL}/${msg.fileZam}`} 
                               alt="uploaded image" 
                               className="max-w-[200px] max-h-[200px] object-cover rounded-md cursor-pointer border border-gray-100 dark:border-gray-700/50 hover:opacity-90 transition-opacity"
                               onClick={() => window.open(msg.fileZam.startsWith('http') ? msg.fileZam : `${FSM_BASE_URL}/${msg.fileZam}`, '_blank')}
                             />
                           </div>
                         ) : msg.turul === 'file' && msg.fileZam ? (
                           <div className="flex flex-col space-y-2">
                             {msg.medeelel && msg.medeelel.trim() !== "" && msg.medeelel !== msg.fileNer && (
                               <span className="text-[13px] whitespace-pre-wrap">{msg.medeelel}</span>
                             )}
                             <a 
                               href={msg.fileZam.startsWith('http') ? msg.fileZam : `${FSM_BASE_URL}/${msg.fileZam}`} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 hover:text-teal-500 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50"
                             >
                               <div className="w-8 h-8 rounded-md bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center shrink-0">
                                 <FileOutlined className="text-lg" />
                               </div>
                               <span className="truncate max-w-[150px] font-medium text-xs text-gray-700 dark:text-gray-300">
                                 {msg.fileNer || "Хавсаргасан файл (Татах)"}
                               </span>
                             </a>
                           </div>
                         ) : (
                           <span className="whitespace-pre-wrap">{msg.medeelel}</span>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
                 <div ref={messagesEndRef} />
               </div>
             )}
          </div>

          <div className="p-6 bg-white dark:bg-[#111827] border-t border-gray-200 dark:border-gray-800 shrink-0">
             {selectedChatFile && (
               <div className="mb-3 flex items-center pt-2 pb-2 pl-3 pr-8 border border-teal-500 bg-teal-50 dark:bg-teal-900/20 rounded-xl relative w-max shadow-sm">
                 <PaperClipOutlined className="text-teal-500 mr-2 text-lg" />
                 <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 truncate max-w-[200px]">
                   {selectedChatFile.name}
                 </span>
                 <Button 
                   type="text" 
                   size="small" 
                   icon={<CloseOutlined className="text-gray-400 hover:text-red-500" />} 
                   className="absolute right-1" 
                   onClick={() => setSelectedChatFile(null)} 
                 />
               </div>
             )}
             <div className="relative flex items-center shadow-sm">
                 <Upload 
                   customRequest={handleFileUpload} 
                   showUploadList={false}
                   className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
                   disabled={uploadingFile}
                 >
                   <Button 
                     type="text" 
                     shape="circle" 
                     icon={uploadingFile ? <LoadingOutlined className="text-teal-500" /> : <PaperClipOutlined className="text-gray-400 hover:text-teal-500 text-lg" />} 
                     className="flex items-center justify-center"
                     disabled={uploadingFile}
                   />
                 </Upload>
                <Input.TextArea
                  placeholder="Энд бичнэ үү..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="rounded-2xl pl-12 pr-12 py-3 border-gray-300 dark:border-gray-700 dark:bg-[#1f2937] focus:ring-teal-500 focus:border-teal-500 custom-scrollbar resize-none"
                />
                <Button 
                  type="primary" 
                  shape="circle" 
                  icon={<SendOutlined />} 
                  onClick={handleSendMessage}
                  disabled={(!chatInput.trim() && !selectedChatFile) || uploadingFile}
                  loading={uploadingFile}
                  className="absolute right-2 bottom-2 bg-teal-500 hover:bg-teal-400 border-none shadow-md h-8 w-8 flex items-center justify-center"
                />
             </div>
          </div>
          
        </div>
        </div>
      </Drawer>
      <GuidedTour 
        steps={tutorialSteps} 
        isOpen={isTutorialOpen} 
        onClose={() => setIsTutorialOpen(false)} 
      />
    </Admin>
  );
}

export default Tuluvluguu;
