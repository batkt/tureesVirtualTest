import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
import { 
  PlusOutlined, 
  LeftOutlined, 
  RightOutlined, 
  CalendarOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  CheckOutlined,
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
  Divider,
  Select, 
  Avatar, 
  Tag, 
  Dropdown,
  Drawer,
  List, 
  Checkbox,
  Tooltip,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Badge,
  Space,
  message,
  Spin,
  Popconfirm,
  Upload,
  Progress,
  Image
} from "antd";
import { useFsmSocket } from "hooks/useFsmSocket";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(isoWeek);
import _ from "lodash";
import fsmApi, { FSM_BASE_URL } from "services/fsmApi";
import { useAuth } from "services/auth";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";

import "dayjs/locale/mn";
dayjs.locale("mn");

import { useRouter } from "next/router";

function Tuluvluguu() {
  const router = useRouter();
  const { t } = useTranslation();
  const { token, barilgiinId, ajiltan } = useAuth();
  const baiguullagiinId = ajiltan?.baiguullagiinId;
  const api = useMemo(() => fsmApi.withAuth(token), [token]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState("Month"); // Month, Week, Day, Agenda
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(false);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1280 : true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm] = Form.useForm();
  const [projectForm] = Form.useForm();
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const projectChatEndRef = useRef(null);
  const [taskImages, setTaskImages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});
  const [loadingChat, setLoadingChat] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedChatFile, setSelectedChatFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [uilchluulegchid, setUilchluulegchid] = useState([]);
  const [loadingUilchluulegchid, setLoadingUilchluulegchid] = useState(false);
  const [baraas, setBaraas] = useState([]);
  const [loadingBaraas, setLoadingBaraas] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [dayTasksModal, setDayTasksModal] = useState({ visible: false, date: null, tasks: [] });
  const [isProjectChatVisible, setIsProjectChatVisible] = useState(false);
  const [selectedProjectForChat, setSelectedProjectForChat] = useState(null);
  const [projectChatMessages, setProjectChatMessages] = useState([]);
  const [projectChatInput, setProjectChatInput] = useState("");
  const [loadingProjectChat, setLoadingProjectChat] = useState(false);
  const [uploadingProjectChatFile, setUploadingProjectChatFile] = useState(false);
  const [selectedProjectChatFile, setSelectedProjectChatFile] = useState(null);
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const ticker = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(ticker);
  }, []);


  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTaskPosition = (task, viewDay, colIndex = 0, totalCols = 1) => {
    let start = dayjs(task.ekhlekhTsag || task.duusakhTsag);
    let end = dayjs(task.duusakhTsag || task.ekhlekhTsag);
    if (!start.isValid() || !end.isValid()) return {};
    const dayStart = dayjs(viewDay).startOf('day');
    const dayEnd = dayjs(viewDay).endOf('day');
    if (end.isBefore(dayStart) || start.isAfter(dayEnd)) return { display: 'none' }; 
    const displayStart = start.isBefore(dayStart) ? dayStart : start;
    const displayEnd = end.isAfter(dayEnd) ? dayEnd : end;
    const startMinutes = displayStart.hour() * 60 + displayStart.minute();
    const durationMinutes = Math.max(20, displayEnd.diff(displayStart, 'minute'));
    const rowHeight = 48;
    
    const colWidth = 100 / totalCols;
    const margin = 2;

    return {
      position: 'absolute',
      top: (startMinutes / 60) * rowHeight,
      height: (durationMinutes / 60) * rowHeight,
      width: `calc(${colWidth}% - ${margin * 2}px)`,
      left: `calc(${colIndex * colWidth}% + ${margin}px)`,
      zIndex: 20 + colIndex
    };
  };

  const getTasksWithOverlap = (dayTasks) => {
    if (!dayTasks || dayTasks.length === 0) return [];
    
    const sortedTasks = [...dayTasks].sort((a, b) => {
      const startA = dayjs(a.ekhlekhTsag || a.duusakhTsag).unix();
      const startB = dayjs(b.ekhlekhTsag || b.duusakhTsag).unix();
      if (startA !== startB) return startA - startB;
      const endA = dayjs(a.duusakhTsag || a.ekhlekhTsag).unix();
      const endB = dayjs(b.duusakhTsag || b.ekhlekhTsag).unix();
      return endB - endA;
    });

    const clusters = [];
    let currentCluster = [];
    let clusterEnd = null;

    sortedTasks.forEach(task => {
      const taskStart = dayjs(task.ekhlekhTsag || task.duusakhTsag);
      const taskEnd = dayjs(task.duusakhTsag || task.ekhlekhTsag);

      if (clusterEnd === null || taskStart.isBefore(clusterEnd)) {
        currentCluster.push(task);
        if (clusterEnd === null || taskEnd.isAfter(clusterEnd)) clusterEnd = taskEnd;
      } else {
        clusters.push(currentCluster);
        currentCluster = [task];
        clusterEnd = taskEnd;
      }
    });
    if (currentCluster.length > 0) clusters.push(currentCluster);

    const result = [];
    clusters.forEach(cluster => {
      const columns = [];
      cluster.forEach(task => {
        let colIndex = -1;
        const taskStart = dayjs(task.ekhlekhTsag || task.duusakhTsag);
        for (let i = 0; i < columns.length; i++) {
          const lastTask = columns[i][columns[i].length - 1];
          const lastEnd = dayjs(lastTask.duusakhTsag || lastTask.ekhlekhTsag);
          if (taskStart.isAfter(lastEnd) || taskStart.isSame(lastEnd)) {
            colIndex = i;
            break;
          }
        }

        if (colIndex === -1) {
          columns.push([task]);
          task.computedColIndex = columns.length - 1;
        } else {
          columns[colIndex].push(task);
          task.computedColIndex = colIndex;
        }
      });
      
      cluster.forEach(task => {
        result.push({
          ...task,
          colIndex: task.computedColIndex,
          totalCols: columns.length
        });
      });
    });

    return result;
  };

  const isTaskOnDay = (task, day) => {
    const taskStart = dayjs(task.ekhlekhTsag || task.duusakhTsag).startOf('day');
    const taskEnd = dayjs(task.duusakhTsag || task.ekhlekhTsag).endOf('day');
    const checkDay = dayjs(day).startOf('day');
    
    return (checkDay.isSame(taskStart) || checkDay.isAfter(taskStart)) && 
           (checkDay.isSame(taskEnd) || checkDay.isBefore(taskEnd));
  };

  const disabledDate = (current) => {
    return current && current.startOf('day').isBefore(dayjs().startOf('day'));
  };

  const tutorialSteps = [
    { targetId: "cal-stats", title: "Статистик", description: "Нийт төсөл болон ажлын явцыг эндээс нэгдсэн байдлаар харж болно." },
    { targetId: "cal-sidebar", title: "Төслүүд", description: "Төслүүдээ төрөлжүүлэн харах, шинэ төсөл нэмэх болон хайлт хийх хэсэг." },
    { targetId: "cal-views", title: "Харагдац", description: "Сар, долоо хоног, өдрөөрх харагдацыг эндээс хурдан сольж болно." },
    { targetId: "cal-main", title: "Хуанли", description: "Ажлуудаа хуанли дээр хянах, шинэ ажил нэмэх үндсэн хэсэг. Тухайн өдөр дээр дарж шинэ ажил үүсгэнэ үү." },
  ];

  const { ajilchdiinGaralt } = useAjiltniiJagsaalt(token, baiguullagiinId, barilgiinId);
  const allEmployees = useMemo(() => ajilchdiinGaralt?.jagsaalt || [], [ajilchdiinGaralt]);

  const { isConnected, socket: fsmSocket, onlineUsers: onlineUsersFromHook } = useFsmSocket(
    selectedTask ? (selectedTask.projectId || selectedTask.project) : null,
    selectedTask ? (selectedTask.id || selectedTask._id) : null
  );

  useEffect(() => {
    setOnlineUsers(onlineUsersFromHook);
  }, [onlineUsersFromHook]);

  const teamMembers = useMemo(() => {
    if (allEmployees.length > 0) {
      return allEmployees.map(emp => ({
        id: emp._id,
        name: emp.ner || emp.nevtrekhNer,
        role: emp.albanTushaal || emp.erkh || "Ажилтан",
        online: onlineUsers[emp._id] === 'online'
      }));
    }
    return ajiltan ? [{ id: ajiltan._id, name: ajiltan.ner || ajiltan.nevtrekhNer, role: ajiltan.erkh || "Ажилтан", online: true }] : [];
  }, [allEmployees, ajiltan, onlineUsers]);


  const statCards = [
    { title: "Нийт төсөл", value: projects.length.toString() },
    { title: "Нийт ажил", value: tasks.length.toString() },
    { title: "Дууссан ажил", value: tasks.filter(t => t.tuluv === "duussan").length.toString() },
    { title: "Яаралтай ажил", value: tasks.filter(t => t.zereglel === "yaraltai").length.toString() },
  ];

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
    } finally {
      setLoadingProjects(false);
    }
  }, [barilgiinId, baiguullagiinId, api]);
  const fetchTasks = useCallback(async () => {
    if (!barilgiinId) return;
    setLoadingTasks(true);
    try {
      const res = await api.get("/tasks", { 
        params: { baiguullagiinId, barilgiinId } 
      });
      let list = res.data?.data || res.data || [];
      const normalized = list.map(task => {
        const pId = task.projectId || task.project;
        const taskDate = task.ekhlekhTsag || task.duusakhTsag || dayjs();
        return {
          id: task._id,
          title: task.ner,
          description: task.tailbar,
          date: dayjs(taskDate).format("YYYY-MM-DD"),
          startDate: task.ekhlekhTsag ? dayjs(task.ekhlekhTsag).format("YYYY-MM-DD") : null,
          dueDate: task.duusakhTsag ? dayjs(task.duusakhTsag).format("YYYY-MM-DD") : null,
          project: pId,
          projectId: pId,
          projectName: "", 
          completed: task.tuluv === "duussan",
          zereglel: task.zereglel,
          tuluv: task.tuluv,
          ...task,
        };
      });
      setTasks(normalized);
    } catch (err) {
    } finally {
      setLoadingTasks(false);
    }
  }, [barilgiinId, baiguullagiinId, api]);

  const fetchHistory = useCallback(async () => {
    if (!barilgiinId) return;
    setLoadingHistory(true);
    try {
      const params = { barilgiinId };
      const res = await api.get("/task-tuukh", { params });
      const list = res.data?.data || res.data || [];
      setHistory(Array.isArray(list) ? list : []);
    } catch (err) {
    } finally {
      setLoadingHistory(false);
    }
  }, [barilgiinId, api]);

  const fetchUilchluulegchid = useCallback(async () => {
    if (!barilgiinId) return;
    setLoadingUilchluulegchid(true);
    try {
      const res = await api.get("/uilchluulegch", { 
        params: { barilgiinId, baiguullagiinId } 
      });
      setUilchluulegchid(res.data?.data || res.data || []);
    } catch (err) {
    } finally {
      setLoadingUilchluulegchid(false);
    }
  }, [barilgiinId, baiguullagiinId, api]);

  const fetchBaraas = useCallback(async () => {
    if (!barilgiinId) return;
    setLoadingBaraas(true);
    try {
      const res = await api.get("/baraas", { params: { barilgiinId, baiguullagiinId } });
      setBaraas(res.data?.data || res.data || []);
    } catch (err) {
    } finally {
      setLoadingBaraas(false);
    }
  }, [barilgiinId, baiguullagiinId, api]);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchHistory();
    fetchUilchluulegchid();
    fetchBaraas();
  }, [fetchProjects, fetchTasks, fetchHistory, fetchUilchluulegchid, fetchBaraas]);

  useEffect(() => {
    if (!fsmSocket) return;

    const handleSocketTaskUpdate = (updatedTask) => {
      if (!updatedTask || !updatedTask._id) return;
      
      setTasks(prev => prev.map(t => {
        if (t._id === updatedTask._id || t.id === updatedTask._id) {
          return { ...t, ...updatedTask };
        }
        return t;
      }));

      setSelectedTask(prev => {
        if (prev && (prev._id === updatedTask._id || prev.id === updatedTask._id)) {
          return { ...prev, ...updatedTask };
        }
        return prev;
      });
      
      if (updatedTask.tuluv === 'khiigdej bui' && updatedTask.ner) {
      }
    };

    fsmSocket.on("task_updated", handleSocketTaskUpdate);
    return () => fsmSocket.off("task_updated", handleSocketTaskUpdate);
  }, [fsmSocket]);

  const monthData = useMemo(() => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDay = startOfMonth.startOf("isoWeek");
    
    const days = [];
    let day = startDay;
    while (day.isBefore(endOfMonth) || day.isSame(endOfMonth, 'day')) {
      days.push(day);
      day = day.add(1, "day");
    }
    return days;
  }, [currentDate]);

  const weekData = useMemo(() => {
    const startOfWeek = currentDate.startOf("isoWeek");
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
      const baseStart = dayjs(selectedDay);
      const baseDue = dayjs(selectedDay);
      
      taskForm.setFieldsValue({ 
        startDate: baseStart,
        dueDate: baseDue,
        startTime: null,
        endTime: null
      });
    }
  }, [isTaskModalVisible, selectedDay, taskForm]);

  const handleCreateTask = async (values) => {
    if (!barilgiinId) { message.warning("Барилгын мэдээлэл байхгүй байна"); return; }
    setSavingTask(true);
    try {
      const getISOValue = (dateObj, timeObj, isEnd = false) => {
        const d = dayjs(dateObj || selectedDay || dayjs());
        const t = (timeObj && dayjs(timeObj).isValid()) ? dayjs(timeObj) : null;
        const y = d.get('year');
        const m = d.get('month');
        const day = d.get('date');
        let h = isEnd ? 23 : 0;
        let min = isEnd ? 59 : 0;
        
        if (t) {
          h = parseInt(t.format('H'));
          min = parseInt(t.format('m'));
        }
        return new Date(y, m, day, h, min, 0, 0).toISOString();
      };

      const ekhlekhTsag = getISOValue(values.startDate, values.startTime, false);
      const duusakhTsag = getISOValue(values.dueDate, values.endTime, true);
      const hasImages = taskImages.length > 0;
      let res;
      const getMinutes = (dateObj, timeObj) => {
        const d = dayjs(dateObj || selectedDay || dayjs());
        const t = (timeObj && dayjs(timeObj).isValid()) ? dayjs(timeObj) : null;
        if (!t) return 0;
        return t.hour() * 60 + t.minute();
      };
      const ekhlekhMinute = getMinutes(values.startDate, values.startTime);
      const duusakhMinute = getMinutes(values.dueDate, values.endTime);
      let uploadedImages = [];
      if (hasImages) {
        for (const f of taskImages) {
          try {
            const rawFile = f.originFileObj || f;
            if (rawFile instanceof File) {
              const formData = new FormData();
              formData.append('file', rawFile);
              formData.append('projectId', values.projectId);
              if (baiguullagiinId) formData.append('baiguullagiinId', baiguullagiinId);
              if (barilgiinId) formData.append('barilgiinId', barilgiinId);

              const uploadRes = await api.post('/chats/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });

              const fileInfo = uploadRes.data?.data || uploadRes.data;
              const remotePath = fileInfo.zam || fileInfo.path || fileInfo.fileZam || fileInfo.zamNer || "";
              if (fileInfo && remotePath) {
                uploadedImages.push({
                  zamNer: remotePath,
                  fileNer: fileInfo.ner || fileInfo.filename || rawFile.name,
                  khemjee: fileInfo.khemjee || rawFile.size,
                  turul: fileInfo.turul || rawFile.type,
                  ogno: new Date().toISOString(),
                  ajiltniiId: ajiltan?._id || "",
                  garchig: values.title || "", 
                  tailbar: values.description || ""
                });
              }
            }
          } catch (uploadErr) {
            console.error("Image upload failed:", uploadErr);
          }
        }
      }

      const payload = {
        projectId: values.projectId,
        ner: values.title,
        tailbar: values.description || '',
        zereglel: values.zereglel || 'engiin',
        tuluv: 'shine',
        hariutsagchId: ajiltan?._id,
        ajiltnuud: ajiltan?._id ? [ajiltan._id] : [],
        ekhlekhTsag,
        duusakhTsag,
        ekhlekhMinute,
        duusakhMinute,
        khugatsaaDuusakhOgnoo: duusakhTsag,
        barilgiinId,
        baiguullagiinId,
        zurag: uploadedImages, 
        hariutsagchZurag: uploadedImages,
        ajiltanZurag: [],
        baraa: (values.baraa || []).map(b => {
          const item = baraas.find(i => i._id === b.baraaId);
          const une = b.une || item?.zarakhUne || 0;
          const too = b.too || 0;
          return {
            baraaId: b.baraaId,
            ner: b.ner || item?.ner || "",
            negj: item?.negj || "",
            too: too,
            une: une,
            niitUne: too * une,
            tailbar: b.tailbar || "",
            ognoo: new Date().toISOString()
          };
        })
      };
      
      res = await api.post('/tasks', payload);

      if (res.data?.success) {
        message.success("Ажил амжилттай нэмэгдлээ");
        await fetchTasks();
        setIsTaskModalVisible(false);
        taskForm.resetFields();
        setTaskImages([]);
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
        uilchluulegchId: values.uilchluulegchId,
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
      color: proj.color || "#10B981",
      uilchluulegchId: proj.uilchluulegchId
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
        projectName: proj ? proj.name : "Төсөл байхгүй",
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
useEffect(() => {
    if (router.isReady && enrichedTasks.length > 0) {
      const { taskId, projectId } = router.query;
      
      if (taskId) {
        const targetTask = enrichedTasks.find(t => t._id === taskId || t.id === taskId);
        if (targetTask) {
          setSelectedTask(targetTask);
          setIsTaskDetailVisible(true);
          setIsRightPanelExpanded(true);
          setCurrentDate(dayjs(targetTask.date));
          const pId = targetTask.projectId || targetTask.project;
          if (pId && !selectedProjectIds.includes(pId)) {
            setSelectedProjectIds(prev => [...prev, pId]);
          }
        }
      } else if (projectId) {
        if (!selectedProjectIds.includes(projectId)) {
          setSelectedProjectIds(prev => [...prev, projectId]);
        }
      }
    }
  }, [router.isReady, router.query.taskId, router.query.projectId, enrichedTasks.length]);

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
    } finally {
      setLoadingSubtasks(false);
    }
  }, [api]);

  const fetchTaskDetail = useCallback(async (taskId) => {
    if (!taskId) return;
    try {
      const res = await api.get(`/tasks/${taskId}`);
      const fullTask = res.data?.data || res.data;
      if (fullTask && typeof fullTask === 'object' && !Array.isArray(fullTask)) {
        setSelectedTask(prev => {
          const currentId = prev?._id || prev?.id;
          if (currentId === taskId) {
            return { ...prev, ...fullTask };
          }
          return prev;
        });
      }
    } catch (err) {
      try {
        const res = await api.get('/tasks', { params: { id: taskId, barilgiinId, baiguullagiinId } });
        const data = res.data?.data || res.data;
        const taskObj = Array.isArray(data) ? data.find(t => (t._id === taskId || t.id === taskId)) : data;
        if (taskObj) {
          setSelectedTask(prev => {
            const currentId = prev?._id || prev?.id;
            if (currentId === taskId) {
              return { ...prev, ...taskObj };
            }
            return prev;
          });
        }
      } catch (e) {}
    }
  }, [api, barilgiinId, baiguullagiinId]);

  useEffect(() => {
    if (selectedTask && isTaskDetailVisible) {
      const tid = selectedTask._id || selectedTask.id;
      if (tid) {
        fetchSubtasks(tid);
        fetchTaskDetail(tid);
      }
    } else {
      setSubtasks([]);
      setIsAddingSubtask(false);
      setNewSubtaskTitle("");
    }
  }, [isTaskDetailVisible, fetchSubtasks, fetchTaskDetail]); 
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
      setSubtasks((prev) => prev.map(s => s._id === subtaskId ? { ...s, ...updates } : s));
      await api.put(`/subtasks/${subtaskId}`, updates);
    } catch (err) {
      message.error("Дэд даалгавар шинэчлэхэд алдаа гарлаа");
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

  const fetchChatHistory = useCallback(async (taskId, projectId) => {
    if (!taskId || !projectId) {
      setChatMessages([]);
      return;
    }
    setLoadingChat(true);
    try {
      const res = await api.get("/chats", { params: { projectId, taskId, baiguullagiinId, barilgiinId } });
      const msgs = res.data?.data || res.data || [];
      setChatMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err) {
    } finally {
      setLoadingChat(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [api, baiguullagiinId, barilgiinId]);

  useEffect(() => {
    if (!isTaskDetailVisible || !selectedTask || !fsmSocket) return;

    const projectId = selectedTask.projectId || selectedTask.project;
    const taskId = selectedTask.id || selectedTask._id;
    if (!projectId || !taskId) return;

    fetchChatHistory(taskId, projectId);

    const handleNewMessage = (msg) => {
      const mTaskId = msg.taskId || msg.task;
      const mProjId = msg.projectId || msg.project;
      if (mTaskId === taskId && mProjId === projectId) {
        setChatMessages(prev => [...prev, msg]);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    fsmSocket.on("new_message", handleNewMessage);

    return () => {
      fsmSocket.off("new_message", handleNewMessage);
    };
  }, [isTaskDetailVisible, selectedTask, fsmSocket, fetchChatHistory]);

  const handleSendMessage = async () => {
    if ((!chatInput.trim() && !selectedChatFile) || !selectedTask) return;
    const projectId = selectedTask.projectId || selectedTask.project;
    const taskId = selectedTask.id || selectedTask._id;
    
    try {
      let sentRes;
      if (selectedChatFile) {
        const formData = new FormData();
        formData.append("file", selectedChatFile);
        formData.append("projectId", projectId);
        formData.append("taskId", taskId);
        if (baiguullagiinId) formData.append("baiguullagiinId", baiguullagiinId);
        if (barilgiinId) formData.append("barilgiinId", barilgiinId);
        const uploadRes = await api.post("/chats/upload", formData);
        const fileInfo = uploadRes.data?.data || uploadRes.data;
        const remotePath = fileInfo.zam || fileInfo.path || fileInfo.fileZam || fileInfo.zamNer || "";
        sentRes = await api.post("/chats", {
          projectId,
          taskId,
          baiguullagiinId,
          barilgiinId,
          ajiltniiId: ajiltan?._id,
          ajiltniiNer: ajiltan?.ner || ajiltan?.nevtrekhNer || "Unknown",
          medeelel: chatInput.trim() || fileInfo.ner || fileInfo.filename || selectedChatFile.name,
          fileZam: remotePath,
          fileNer: fileInfo.ner || fileInfo.filename || selectedChatFile.name,
          turul: selectedChatFile.type.startsWith("image/") ? "zurag" : "file"
        });
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
        sentRes = await api.post("/chats", payload);
      }

      const rawMsg = sentRes.data?.data || sentRes.data;
      if (rawMsg && typeof rawMsg === 'object' && rawMsg._id) {
        setChatMessages(prev => {
          const exists = prev.some(m => m._id === rawMsg._id);
          return exists ? prev : [...prev, rawMsg];
        });
        setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
      } else if (chatInput.trim() && !selectedChatFile) {
        const tempMsg = {
          _id: Date.now().toString(),
          projectId,
          taskId,
          ajiltniiId: ajiltan?._id,
          ajiltniiNer: ajiltan?.ner || ajiltan?.nevtrekhNer || "Unknown",
          medeelel: chatInput.trim(),
          turul: "text",
          createdAt: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, tempMsg]);
        setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
      }

      setChatInput("");
      setSelectedChatFile(null);
    } catch (err) {
      message.error("Зурвас илгээхэд алдаа гарлаа");
    } finally {
      setUploadingFile(false);
    }
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

  useEffect(() => {
    if (!isProjectChatVisible || !selectedProjectForChat || !fsmSocket) return;
    const pId = selectedProjectForChat.id || selectedProjectForChat._id;
    fetchProjectChatHistory(pId);
    const handleNewMsg = (msg) => {
      if (msg.projectId === pId && !msg.taskId) {
        setProjectChatMessages(prev => [...prev, msg]);
        setTimeout(() => { projectChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
      }
    };
    fsmSocket.on('new_message', handleNewMsg);
    return () => fsmSocket.off('new_message', handleNewMsg);
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
        const remotePath = fileInfo.zam || fileInfo.path || fileInfo.fileZam || fileInfo.zamNer || "";
        sentRes = await api.post('/chats', {
          projectId,
          baiguullagiinId,
          barilgiinId,
          ajiltniiId: ajiltan?._id,
          ajiltniiNer: ajiltan?.ner || ajiltan?.nevtrekhNer || 'Unknown',
          medeelel: projectChatInput.trim() || fileInfo.ner || fileInfo.filename || selectedProjectChatFile.name,
          fileZam: remotePath,
          fileNer: fileInfo.ner || fileInfo.filename || selectedProjectChatFile.name,
          turul: selectedProjectChatFile.type.startsWith('image/') ? 'zurag' : 'file'
        });
      } else {
        sentRes = await api.post('/chats', {
          projectId,
          baiguullagiinId,
          barilgiinId,
          ajiltniiId: ajiltan?._id,
          ajiltniiNer: ajiltan?.ner || ajiltan?.nevtrekhNer || 'Unknown',
          medeelel: projectChatInput.trim(),
          turul: 'text',
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
      } else if (projectChatInput.trim() && !selectedProjectChatFile) {
        const tempMsg = {
          _id: Date.now().toString(),
          projectId,
          ajiltniiId: ajiltan?._id,
          ajiltniiNer: ajiltan?.ner || ajiltan?.nevtrekhNer || "Unknown",
          medeelel: projectChatInput.trim(),
          turul: "text",
          createdAt: new Date().toISOString()
        };
        setProjectChatMessages(prev => [...prev, tempMsg]);
        setTimeout(() => { projectChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
      }

      setProjectChatInput('');
      setSelectedProjectChatFile(null);
    } catch (err) {
      message.error('Зурвас илгээхэд алдаа гарлаа');
    } finally {
      setUploadingProjectChatFile(false);
    }
  };

  const handleProjectFileUpload = (options) => {
    setSelectedProjectChatFile(options.file);
    setTimeout(() => { options.onSuccess('ok'); }, 100);
  };

  const openProjectChat = (proj, e) => {
    e.stopPropagation();
    setSelectedProjectForChat(proj);
    setProjectChatMessages([]);
    setProjectChatInput('');
    setSelectedProjectChatFile(null);
    setIsProjectChatVisible(true);
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, updates);
      if (res.data?.success || res.status === 200) {
        setTasks(prev => prev.map(t => (t.id === taskId || t._id === taskId) ? { ...t, ...updates } : t));
        if (selectedTask && (selectedTask.id === taskId || selectedTask._id === taskId)) {
          setSelectedTask(prev => ({ ...prev, ...updates }));
        }
        return true;
      }
    } catch (err) {
      message.error("Ажил шинэчлэхэд алдаа гарлаа");
    }
    return false;
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
    if (await handleUpdateTask(taskId, { ajiltnuud: newMembers })) {
      message.success("Ажилтан амжилттай нэмэгдлээ");
    }
  };

  const handleFileUpload = (options) => {
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
      <div className="col-span-12 flex flex-col xl:flex-row h-auto xl:h-H8HalfRem w-full -mx-0 xl:-mx-1 -mt-2 text-black lg:rounded-2xl shadow-2xl relative animate-entrance">
        <div className="flex-1 flex flex-col p-4 overflow-hidden relative min-w-0">
        
        <div id="cal-stats" className="hideScroll grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 shrink-0 pt-1">
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

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 min-h-0">
          <div id="cal-sidebar" className="flex w-full lg:w-64 flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f2937] p-4 shrink-0 max-h-[300px] lg:max-h-none animate-entrance-stagger-6">
          
          <div className="flex-1 border-r border-gray-200 dark:border-gray-700 rounded-lg border-b overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
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
                     <Tooltip title="Чат">
                       <Button type="text" size="small" icon={<MessageOutlined className="text-gray-400 hover:text-teal-500 text-[10px]" />} onClick={(e) => openProjectChat(p, e)} />
                     </Tooltip>
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
        <div className="flex flex-1 flex-col bg-white dark:bg-gray-800 min-w-0 animate-entrance-stagger-7">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between border-b border-gray-200 dark:border-gray-700 p-2 lg:p-4 shadow-sm z-20 h-auto lg:h-16 shrink-0 gap-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button 
                  className="bg-gray-100 dark:bg-[#374151] border-none text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-black rounded-xl px-4 h-10 shadow-sm"
                  onClick={goToday}
                >
                  Өнөөдөр
                </Button>
                <div className="flex items-center bg-gray-100 dark:bg-[#374151] rounded-xl p-0.5 shrink-0">
                  <Button type="text" size="small" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg" onClick={prev}>
                    <LeftOutlined style={{ fontSize: '10px' }} />
                  </Button>
                  <span className="font-black text-[10px] md:text-[12px] min-w-[100px] md:min-w-[150px] text-center text-gray-800 dark:text-gray-100 px-2 select-none uppercase tracking-tight">
                    {view === "Month" ? currentDate.format("YYYY - MMMM") : 
                     view === "Week" ? `${currentDate.startOf('week').format("MM/DD")} - ${currentDate.endOf('week').format("MM/DD")}` :
                     currentDate.format("YYYY/MM/DD")}
                   </span>
                  <Button type="text" size="small" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg" onClick={next}>
                    <RightOutlined style={{ fontSize: '10px' }} />
                  </Button>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Disconnected'} />
            </div>
            
            <div id="cal-views" className="flex items-center bg-gray-100 dark:bg-[#1f2937] rounded-xl p-0.5 md:p-1 border border-gray-200 dark:border-gray-700 shadow-inner shrink-0 w-full lg:w-auto justify-center z-10">
              {[
                { label: "Сар", value: "Month" },
                { label: "7-хоног", value: "Week" },
                { label: "Өдөр", value: "Day" },
                { label: "Нэгтгэл", value: "Agenda" },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setView(value)}
                  className={`flex-1 lg:flex-none px-2 lg:px-5 py-2 lg:py-1.5 rounded-lg text-[10px] md:text-[11px] font-black tracking-widest transition-all duration-200 uppercase ${
                    view === value 
                      ? "bg-teal-500 text-white shadow-md transform scale-105" 
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div id="cal-main" className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-800 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
            {view === "Month" && (
              <div className="flex flex-col h-[calc(100vh-320px)] min-h-[500px] bg-white dark:bg-gray-800 overflow-hidden shadow-inner">
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 shadow-sm shrink-0">
                  {["ДАВАА", "МЯГМАР", "ЛХАГВА", "ПҮРЭВ", "БААСАН", "БЯМБА", "НЯМ"].map(day => (
                    <div key={day} className="p-3 text-center text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-widest border-r border-gray-100 dark:border-gray-800 uppercase last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 flex-1 overflow-y-auto">
                  {monthData.map((date, idx) => {
                    const dayTasks = filteredTasks.filter(t => isTaskOnDay(t, date));
                    const isCurrentMonth = date.month() === currentDate.month();
                    const isToday = date.isSame(dayjs(), 'day');
                    const isPast = date.startOf('day').isBefore(dayjs().startOf('day'));
                    
                    if (!isCurrentMonth) {
                      return <div key={idx} className="min-h-[140px] border-b border-r border-gray-300 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/20 opacity-30" />;
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`min-h-[140px] border-b border-r border-gray-300 dark:border-gray-900 p-2 transition-all relative flex flex-col group ${
                          isPast ? "bg-gray-100/50 dark:bg-gray-900/40 cursor-not-allowed opacity-50" : 
                          "bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-900/10"
                        }`}
                        onClick={() => {
                          if (!isPast) {
                            setSelectedDay(date);
                            setIsTaskModalVisible(true);
                          }
                        }}
                      >
                        <div className="flex items-center justify-end mb-2">
                          <span className={`text-[12px] font-black rounded-full w-7 h-7 flex items-center justify-center transition-all ${
                            isToday ? "bg-teal-500 text-white shadow-lg transform scale-110" : 
                            isPast ? "text-gray-300 dark:text-gray-700" :
                            "text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300"
                          }`}>
                            {date.format("D")}
                          </span>
                        </div>
                        
                        <div className="flex flex-col space-y-1 overflow-hidden">
                          {dayTasks.slice(0, 3).map(task => (
                            <Tooltip key={task.id} title={`${task.projectName}: ${task.title}`}>
                              <div 
                                onClick={(e) => handleTaskClick(task, e)}
                                className="flex items-center space-x-1.5 px-1.5 py-1 rounded-md text-[9px] font-bold border-l-2 hover:opacity-80 transition-opacity cursor-pointer text-gray-800 dark:text-gray-200 uppercase tracking-tight"
                                style={{ 
                                  borderLeftColor: task.projectColor || "#14b8a6",
                                  backgroundColor: (task.projectColor || "#14b8a6") + "20"
                                }}
                              >
                                {task.completed ? 
                                  <CheckOutlined style={{ color: task.projectColor || "#14b8a6", fontSize: 8 }} /> : 
                                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: task.projectColor || "#14b8a6" }}></div>
                                }
                                <span className="truncate flex-1">{task.title}</span>
                              </div>
                            </Tooltip>
                          ))}
                          {dayTasks.length > 3 && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setDayTasksModal({ visible: true, date, tasks: dayTasks });
                              }}
                              className="text-[9px] font-black text-teal-600 dark:text-teal-400 px-1.5 cursor-pointer hover:text-teal-500 transition-colors"
                            >
                              +{dayTasks.length - 3} дэлгэрэнгүй
                            </div>
                          )}
                        </div>

                        {!isPast && (
                          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all scale-90 translate-y-2 group-hover:translate-y-0">
                            <Button 
                              size="small" 
                              className="bg-teal-500 !border-none text-white flex items-center justify-center rounded-lg shadow-lg"
                              icon={<PlusOutlined />}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {view === "Week" && (
              <div className="flex flex-col h-[calc(100vh-320px)] min-h-[500px] bg-white dark:bg-gray-800  overflow-hidden shadow-inner">
                <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] sticky top-0 z-10 shadow-sm shrink-0">
                  <div className="p-3 border-r border-gray-100 dark:border-gray-900 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase flex items-center justify-center">ЦАГ</div>
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
                      <div key={i} className="h-12 border-b border-gray-100 dark:border-gray-900/40 p-2 text-[10px] font-black text-gray-400 dark:text-gray-600 flex items-start justify-center uppercase">
                        {i < 10 ? `0${i}:00` : `${i}:00`}
                      </div>
                    ))}
                  </div>
                  {weekData.map(date => {
                    const isPast = date.startOf('day').isBefore(dayjs().startOf('day'));
                    return (
                      <div key={date.toString()} className={`border-r border-gray-100 dark:border-gray-900 relative ${isPast ? "bg-gray-100/30 dark:bg-gray-900/20 cursor-not-allowed" : ""}`}>
                        {Array.from({length: 24}).map((_, i) => (
                          <div key={i} className="h-12 border-b border-gray-50 dark:border-gray-900/20 group cursor-crosshair hover:bg-teal-500/5 transition-colors">
                          </div>
                        ))}
                        <div className="absolute top-0 left-0 w-full h-full">
                          {getTasksWithOverlap(filteredTasks.filter(t => isTaskOnDay(t, date))).map(task => (
                            <div 
                              key={task.id || task._id} 
                              onClick={(e) => handleTaskClick(task, e)}
                              className="border-l-4 rounded-xl p-2 text-[10px] font-black text-gray-800 dark:text-gray-100 shadow-xl border border-gray-100 dark:border-gray-700/50 uppercase tracking-tighter cursor-pointer hover:scale-[1.02] transition-transform overflow-hidden"
                              style={{ 
                                borderLeftColor: task.projectColor || "#14b8a6",
                                backgroundColor: (task.projectColor || "#14b8a6") + "15",
                                ...getTaskPosition(task, date, task.colIndex, task.totalCols)
                              }}
                            >
                              <div className="truncate">{task.title}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {view === "Day" && (
              <div className="flex flex-col h-[calc(100vh-320px)] min-h-[500px] bg-white dark:bg-gray-800 overflow-hidden shadow-inner">
                <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] sticky top-0 z-10 shadow-sm shrink-0">
                  <div className="p-3 border-r border-gray-100 dark:border-gray-900 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase flex items-center justify-center">ЦАГ</div>
                  <div className="col-span-7 p-3 text-center">
                    <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-1">{currentDate.format("dddd")}</div>
                    <div className="text-[12px] font-black text-teal-500">{currentDate.format("YYYY оны MMMM DD")}</div>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-8 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700">
                  <div className="flex flex-col border-r border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-950/20 shrink-0">
                    {Array.from({length: 24}).map((_, i) => (
                      <div key={i} className="h-12 border-b border-gray-100 dark:border-gray-900/40 p-2 text-[10px] font-black text-gray-400 dark:text-gray-600 flex items-start justify-center uppercase">
                        {i < 10 ? `0${i}:00` : `${i}:00`}
                      </div>
                    ))}
                  </div>
                  <div className={`col-span-7 relative ${currentDate.startOf('day').isBefore(dayjs().startOf('day')) ? "bg-gray-100/30 dark:bg-gray-900/40 cursor-not-allowed" : "bg-white dark:bg-[#111827]/30"}`}>
                    {Array.from({length: 24}).map((_, i) => (
                      <div key={i} className="h-12 border-b border-gray-50 dark:border-gray-900/20 group cursor-crosshair hover:bg-teal-500/5 transition-colors">
                      </div>
                    ))}
                    <div className="absolute top-0 left-0 w-full h-full">
                      {getTasksWithOverlap(filteredTasks.filter(t => isTaskOnDay(t, currentDate))).map(task => (
                        <div 
                          key={task.id || task._id} 
                          onClick={(e) => handleTaskClick(task, e)}
                          className="border-l-4 rounded-xl p-3 text-[11px] font-black text-gray-800 dark:text-gray-100 shadow-2xl border border-gray-100 dark:border-gray-700/50 uppercase tracking-tighter cursor-pointer hover:scale-[1.01] transition-transform overflow-hidden"
                          style={{ 
                            borderLeftColor: task.projectColor || "#14b8a6",
                            backgroundColor: (task.projectColor || "#14b8a6") + "15",
                            ...getTaskPosition(task, currentDate, task.colIndex, task.totalCols)
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                             <span className="text-[9px] font-extrabold" style={{ color: task.projectColor || "#94a3b8" }}>{task.projectName}</span>
                             {task.completed && <CheckOutlined style={{ color: task.projectColor || "#14b8a6" }} className="scale-75" />}
                          </div>
                          <div className="truncate">{task.title}</div>
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

              const statusColor = (tuluv) => tuluv === "duussan"
                ? "text-green-600 dark:text-green-400 bg-green-500/10"
                : tuluv === "khiigdej bui"
                ? "text-yellow-600 dark:text-yellow-400 bg-yellow-400/10"
                : tuluv === "khugatsaa khetersen"
                ? "text-red-600 dark:text-red-400 bg-red-500/10"
                : tuluv === "shalga"
                ? "text-blue-600 dark:text-blue-400 bg-blue-400/10"
                : "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
              const statusLabel = (tuluv) => {
                if (tuluv === "duussan") return "Дууссан";
                if (tuluv === "khiigdej bui") return "Хийгдэж буй";
                if (tuluv === "khugatsaa khetersen") return "Хэтэрсэн";
                if (tuluv === "shalga") return "Шалгах";
                return "Шинэ";
              };
              const priorityDot = (z) => z === "nen yaraltai" ? "bg-red-500" : z === "yaraltai" ? "bg-orange-400" : z === "engiin" ? "bg-yellow-400" : "bg-green-500";

              const AgendaGroup = ({ label, tasks: groupTasks, labelCls, countBg }) => {
                if (groupTasks.length === 0) return null;
                return (
                  <div>
                  
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-[#111827]/50 sticky top-0 z-10">
                      <span className={`text-[11px] font-black uppercase tracking-widest ${labelCls}`}>{label}</span>
                      <span className={`min-w-[20px] h-5 px-1.5 rounded-full ${countBg} text-white text-[10px] font-black flex items-center justify-center`}>{groupTasks.length}</span>
                    </div>
                    
                    <div className="grid grid-cols-12 px-5 py-2 border-b  border-gray-300 dark:border-gray-900 bg-white dark:bg-gray-800">
                      <div className="col-span-5 text-[10px]  font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Ажил</div>
                      <div className="col-span-2 text-[10px]  font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Төлөв</div>
                      <div className="col-span-3 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Төсөл</div>
                      <div className="col-span-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Дуусах</div>
                    </div>
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
                              {task.date ? dayjs(task.date).format("YYYY-MM-DD") : "—"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    
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
                <div className="flex flex-col h-[calc(100vh-320px)] min-h-[500px] bg-white dark:bg-gray-800 overflow-y-auto shadow-inner">
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
      </div>  
      </div> 
      </div> 

        <div className={`transition-all duration-300 flex flex-col shrink-0 z-20 ${isRightPanelExpanded ? 'w-full xl:w-[340px] opacity-100 h-auto xl:h-[calc(102vh-6rem)]' : 'w-0 opacity-0 whitespace-nowrap overflow-hidden'}`}>  
          <div className="flex-1 m-3 bg-white dark:bg-[#1f2636] rounded-[2rem] border border-slate-100 dark:border-slate-800/60 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto w-full flex flex-col [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
            <div className="flex  max-h-[200px] overflow-y-auto flex-col shrink-0 m-4 mb-2 bg-white dark:bg-gray-900/40 rounded-2xl border border-slate-200 dark:border-slate-700/30 overflow-hidden shadow-lg">
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
                      <div className="text-[10px] text-gray-500 mt-1 font-medium tracking-wide">
                        {act.createdAt ? dayjs(act.createdAt).format("YYYY-MM-DD HH:mm") : "--:--"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col p-4 space-y-6">
              
              <div className="border-b border-slate-200 dark:border-slate-700/50"></div>
              <div className="h-[calc(40vh-200px)] overflow-y-auto flex flex-col space-y-3 shrink-0 dark:bg-gray-900/40 rounded-lg p-2 shadow-md border dark:border-slate-700/50">
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
                        <Tooltip title="Чат">
                          <Button type="text" size="small" icon={<MessageOutlined className="text-gray-400 hover:text-teal-500 text-[10px]" />} onClick={(e) => openProjectChat(p, e)} />
                        </Tooltip>
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
              
              <div className="pt-4 h-[calc(50vh-200px)] overflow-y-auto shrink-0 dark:bg-gray-900/40 rounded-lg p-2 shadow-md border dark:border-slate-700/50 overflow-y-auto max-h-[400px]">
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
        {typeof window !== 'undefined' && !isRightPanelExpanded && createPortal(
          <button 
            style={{ position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 99999 }}
            className="bg-green-600 dark:bg-green-900 border border-green-700/60 w-8 h-12 rounded-l-lg flex flex-col items-center justify-center cursor-pointer shadow-xl hover:bg-green-500 hover:-translate-x-1 transition-all"
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
      </div>

      <Modal
        title={t("Ажил нэмэх")}
        visible={isTaskModalVisible}
        onCancel={() => setIsTaskModalVisible(false)}
        footer={null}
        width={680}
        centered
      >
        <Form form={taskForm} layout="vertical" onFinish={handleCreateTask} className="space-y-6">
          <Form.Item 
            name="title" 
            label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Ажлын нэр</span>} 
            required 
            rules={[{ required: true, message: 'Ажлын нэр оруулна уу' }]}
            className="!mb-0"
          >
            <Input placeholder="Ажлын нэр оруулна уу" className="h-12 rounded-xl" />
          </Form.Item>
          
          <Form.Item name="description" label={<span className="text-gray-400  text-[12px]  font-bold block pl-1">Дэлгэрэнгүй</span>} className="!mb-0">
            <Input.TextArea placeholder="Ажлын дэлгэрэнгүй тайлбар..." className="rounded-xl" rows={3} />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-6">
            <Form.Item 
              name="projectId" 
              label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Төсөл</span>}
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
              label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Зэрэглэл</span>}
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

          {/* <div className="grid grid-cols-2 gap-6">
             <Form.Item name="startDate" label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Эхлэх өдөр</span>} className="!mb-0">
               <DatePicker 
                 className="w-full h-12 rounded-xl" 
                 placeholder="Эхлэх өдөр"
                 format="YYYY-MM-DD"
                 disabledDate={disabledDate}
               />
             </Form.Item>
             <Form.Item name="dueDate" label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Дуусах өдөр</span>} className="!mb-0">
               <DatePicker 
                 className="w-full h-12 rounded-xl" 
                 placeholder="Дуусах өдөр"
                 format="YYYY-MM-DD"
                 disabledDate={disabledDate}
               />
             </Form.Item>
          </div> */}

          <div className="grid grid-cols-2 gap-6 mt-6">
            <Form.Item name="startTime" label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Эхлэх цаг (Минут)</span>} className="!mb-0">
               <TimePicker 
                 className="w-full h-12 rounded-xl" 
                 placeholder="Эхлэх цаг"
                 format="HH:mm"
               />
            </Form.Item>
            <Form.Item name="endTime" label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Дуусах цаг (Минут)</span>} className="!mb-0">
               <TimePicker 
                 className="w-full h-12 rounded-xl" 
                 placeholder="Дуусах цаг"
                 format="HH:mm"
               />
            </Form.Item>
          </div>
          
          <Form.Item label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Зургууд (заавал биш)</span>} className="!mb-0">
            <Upload
              listType="picture-card"
              fileList={taskImages}
              onChange={({ fileList }) => setTaskImages(fileList)}
              beforeUpload={() => false}
              accept="image/*"
              multiple
            >
              {taskImages.length < 8 && (
                <div className="flex flex-col items-center justify-center text-gray-400 text-xs">
                  <PlusOutlined />
                  <div className="mt-1">Зураг</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Divider orientation="left" className="!mt-0 !mb-4"><span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Бараа материал</span></Divider>
          
          <Form.List name="baraa">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 relative group/item">
                    <Button 
                      type="text" 
                      icon={<CloseOutlined className="text-[10px]" />} 
                      onClick={() => remove(name)}
                      className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 shadow-md !rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity"
                    />
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-6">
                        <Form.Item
                          {...restField}
                          name={[name, 'baraaId']}
                          rules={[{ required: true, message: 'Бараа сонгоно уу' }]}
                          className="!mb-0"
                        >
                          <Select
                            placeholder="Бараа сонгох"
                            showSearch
                            optionFilterProp="children"
                            className="w-full h-10 [&>.ant-select-selector]:!h-10 [&>.ant-select-selector]:!rounded-xl [&>.ant-select-selector]:!items-center [&>.ant-select-selector]:!flex"
                            onChange={(val) => {
                              const item = baraas.find(i => i._id === val);
                              if (item) {
                                // Update price snapshot automatically
                                const currentBaraa = taskForm.getFieldValue('baraa');
                                currentBaraa[name] = { 
                                  ...currentBaraa[name], 
                                  une: item.zarakhUne,
                                  ner: item.ner
                                };
                                taskForm.setFieldsValue({ baraa: currentBaraa });
                              }
                            }}
                          >
                            {baraas.map(i => (
                              <Select.Option key={i._id} value={i._id}>
                                {i.ner} ({i.ulg_lekh_too || 0} {i.negj}) - {i.zarakhUne?.toLocaleString()}₮
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <Form.Item
                          {...restField}
                          name={[name, 'too']}
                          rules={[{ required: true, message: '?' }]}
                          className="!mb-0"
                        >
                          <Input type="number" placeholder="Тоо" className="h-10 rounded-xl" />
                        </Form.Item>
                      </div>
                      <div className="col-span-8 md:col-span-4">
                        <Form.Item
                          {...restField}
                          name={[name, 'tailbar']}
                          className="!mb-0"
                        >
                          <Input placeholder="Тайлбар" className="h-10 rounded-xl" />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  block 
                  icon={<PlusOutlined />}
                  className="rounded-xl dark:bg-green-600 dark:text-white dark:hover:!bg-green-500 dark:hover:!text-blue-500 h-12 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:!border-teal-500 hover:!text-teal-500 text-gray-400 font-bold"
                >
                  Бараа нэмэх
                </Button>
              </div>
            )}
          </Form.List>

          <div className="flex items-end justify-end pt-6 border-t dark:border-slate-700/50 border-gray-300">
             <Space size="middle">
               <Button onClick={() => { setIsTaskModalVisible(false); setTaskImages([]); }} disabled={savingTask}>
                 {t("Цуцлах")}
               </Button>
               <Button type="primary" htmlType="submit" loading={savingTask}>
                 {t("Үүсгэх")}
               </Button>
             </Space>
          </div>
        </Form>
      </Modal>
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
            label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Төслийн нэр</span>}
            required
            rules={[{ required: true, message: 'Төслийн нэр оруулна уу' }]}
          >
            <Input placeholder="Жишээ нь: Барилга А засвар" className="h-12 rounded-xl" />
          </Form.Item>

          <Form.Item 
            name="tailbar" 
            label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Тайлбар</span>}
          >
            <Input.TextArea placeholder="Төслийн дэлгэрэнгүй тайлбар..." className="rounded-xl" rows={2} />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="ekhlekhOgnoo" 
              label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Эхлэх өдөр</span>}
              initialValue={dayjs()}
            >
              <DatePicker className="w-full h-12 rounded-xl" format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item 
              name="duusakhOgnoo" 
              label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Дуусах өдөр</span>}
              initialValue={dayjs().add(30, "day")}
            >
              <DatePicker className="w-full h-12 rounded-xl" format="YYYY-MM-DD" />
            </Form.Item>
          </div>

          <Form.Item 
            name="color" 
            label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Өнгө</span>}
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

          <Form.Item 
            name="uilchluulegchId" 
            label={<span className="text-gray-400 text-[12px] font-bold block pl-1">Үйлчлүүлэгч</span>}
          >
            <Select 
              showSearch
              placeholder="Үйлчлүүлэгч сонгох"
              optionFilterProp="children"
              loading={loadingUilchluulegchid}
              className="w-full h-12 [&>.ant-select-selector]:!h-12 [&>.ant-select-selector]:!rounded-xl [&>.ant-select-selector]:!items-center [&>.ant-select-selector]:!flex"
              allowClear
            >
              {uilchluulegchid.map(u => (
                <Select.Option key={u._id} value={u._id}>
                  {u.ner} {u.utas ? `(${Array.isArray(u.utas) ? u.utas[0] : u.utas})` : ''}
                </Select.Option>
              ))}
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

      <Drawer
        title={null}
        closable={false}
        visible={isTaskDetailVisible}
        onClose={() => setIsTaskDetailVisible(false)}
        width={typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 1100}
        placement="right"
        className="!p-0"
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex h-full w-full bg-white dark:bg-[#111827] flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
          <div className="w-full lg:w-1/2 flex flex-col h-auto lg:h-full overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="flex items-start justify-between border-b pb-6 dark:border-gray-800">
               <div className="flex flex-col gap-3 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    <CalendarOutlined className="text-[12px]" />
                    <span>{selectedTask?.ekhlekhTsag ? dayjs(selectedTask.ekhlekhTsag).format("YYYY/MM/DD HH:mm") : "—"}</span>
                    <span className="text-gray-300 dark:text-gray-600">→</span> 
                    <span>{selectedTask?.duusakhTsag ? dayjs(selectedTask.duusakhTsag).format("YYYY/MM/DD HH:mm") : "—"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {selectedTask?.taskId && (
                      <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-tighter bg-teal-50 dark:bg-teal-500/10 px-1.5 py-0.5 rounded w-fit">
                        ID: {selectedTask.taskId}
                      </span>
                    )}
                    <h1 className="text-2xl font-black m-0 dark:text-white leading-tight truncate">{selectedTask?.title}</h1>
                  </div>
               </div>

               <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm ${
                    selectedTask?.zereglel === 'nen yaraltai' || selectedTask?.zereglel === 'yaraltai' ? 'bg-red-500 text-white' : 
                    selectedTask?.zereglel === 'engiin' ? 'bg-yellow-500 text-white' : 'bg-teal-500 text-white'
                  }`}>
                    {selectedTask?.zereglel === "nen yaraltai" ? "🔴 Нэн Яаралтай" : selectedTask?.zereglel === "yaraltai" ? "🟠 Яаралтай" : selectedTask?.zereglel === "engiin" ? "🟢 Энгийн" : "🔵 Бага"}
                  </span>
                  <span className={`font-bold text-[11px] px-2 py-0.5 rounded-full border ${
                    selectedTask?.tuluv === 'duussan' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 
                    selectedTask?.tuluv === 'khiigdej bui' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' : 
                    selectedTask?.tuluv === 'khugatsaa khetersen' ? 'text-red-500 border-red-500/20 bg-red-500/5' :
                    selectedTask?.tuluv === 'shalga' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' : 'text-teal-500 border-teal-500/20 bg-teal-500/5'
                  }`}>
                    {
                      selectedTask?.tuluv === 'duussan' ? 'Дууссан' : 
                      selectedTask?.tuluv === 'khiigdej bui' ? 'Хийгдэж буй' : 
                      selectedTask?.tuluv === 'khugatsaa khetersen' ? 'Хугацаа хэтэрсэн' :
                      selectedTask?.tuluv === 'shalga' ? 'Шалгах' : 'Шинэ'
                    }
                  </span>
               </div>
            </div>

            <div className="py-6">
              <p className="text-gray-500 dark:text-gray-400 text-[13px] leading-relaxed m-0">
                {selectedTask?.description || "No description provided."}
              </p>
            </div>

            {((selectedTask?.hariutsagchZurag?.length > 0) || (selectedTask?.zurag?.length > 0)) && (
              <div className="space-y-3 mb-8">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block pl-1">Хавсаргасан зургууд</span>
                <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <Image.PreviewGroup>
                    <div className="flex flex-wrap gap-2">
                      {[...(selectedTask.hariutsagchZurag || []), ...(selectedTask.zurag || [])].map((img, idx) => {
                        const path = typeof img === 'string' ? img : (img.zamNer || img.fileZam || img.path || img.zam);
                        const src = path ? (path.startsWith('http') ? path : `${FSM_BASE_URL}/${path}`) : null;
                        
                        if (!src) return null;
                        
                        return (
                          <div key={idx} className="relative group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                            <Image
                              width={100}
                              height={100}
                              className="object-cover"
                              src={src}
                              fallback="/placeholder-error.png"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Image.PreviewGroup>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 mb-8">
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
            </div>

          <div className="pt-8 mt-8 border-t dark:border-gray-700">
              {(() => {
                const getMinutesFromISO = (tsag) => {
                  if (tsag == null) return null;
                  if (typeof tsag === 'number') return tsag;
                  const d = new Date(tsag);
                  if (isNaN(d.getTime())) return null;
                  if (d.getFullYear() === 1970) return d.getTime();
                  return Math.floor(d.getTime() / 60000);
                };
                
                const ekhlekhMin = getMinutesFromISO(selectedTask?.ekhlekhTsag);
                const duusakhMin = getMinutesFromISO(selectedTask?.duusakhTsag);
                const budgetedMinutes = (ekhlekhMin != null && duusakhMin != null) ? Math.max(0, duusakhMin - ekhlekhMin) : 0;
                const budgetedSeconds = budgetedMinutes * 60;
                let spentSeconds = 0;
                
                // 1. Process session-based actual time
                if (selectedTask?.ajiltanTsag && Array.isArray(selectedTask.ajiltanTsag)) {
                  selectedTask.ajiltanTsag.forEach(tsag => {
                    if (!tsag) return;
                    
                    // Manual minutes entry
                    const manualMin = Number(tsag.tsagMinute);
                    if (!isNaN(manualMin) && manualMin > 0) {
                      spentSeconds += Math.round(manualMin * 60);
                    } 
                    // Session timestamps
                    else if (tsag.ekhlekhTsag) {
                      const start = dayjs(tsag.ekhlekhTsag);
                      if (start.isValid()) {
                        const end = tsag.duusakhTsag ? dayjs(tsag.duusakhTsag) : currentTime;
                        if (end.isValid()) {
                          const diff = end.diff(start, 'second');
                          if (diff > 0) spentSeconds += diff;
                        }
                      }
                    }
                  });
                } 
                
                // 2. Sum with existing top-level field if it exists independent of detailed logs
                // Or if spentSeconds is still 0, use it as fallback
                const topLevelSpent = Number(selectedTask?.zartsuulsanKhugatsaa);
                if (!isNaN(topLevelSpent) && topLevelSpent > 0 && spentSeconds === 0) {
                  spentSeconds = topLevelSpent; // In seconds based on context
                }
                
                // 3. Last resort fallback for timers without detailed logs
                if (spentSeconds === 0) {
                  const isFinished = selectedTask?.tuluv === 'duussan' || selectedTask?.tuluv === 'shalga';
                  const isInProgress = selectedTask?.tuluv === 'khiigdej bui';
                  
                  if (isInProgress) {
                    const startMarker = selectedTask.khuleejAvsanOgnoo || selectedTask.updatedAt || selectedTask.createdAt;
                    if (startMarker) {
                      const sm = dayjs(startMarker);
                      if (sm.isValid()) {
                        const diff = currentTime.diff(sm, 'second');
                        if (diff > 0) spentSeconds = diff;
                      }
                    }
                  } else if (isFinished) {
                    // For closed tasks, if no logs exist, calculate total lifetime duration
                    const end = dayjs(selectedTask.updatedAt || selectedTask.duusakhTsag);
                    const start = dayjs(selectedTask.khuleejAvsanOgnoo || selectedTask.createdAt || selectedTask.ekhlekhTsag);
                    if (start.isValid() && end.isValid()) {
                      const diff = end.diff(start, 'second');
                      if (diff > 0) spentSeconds = diff;
                    }
                  }
                }

                const remainingSeconds = Math.max(0, budgetedSeconds - spentSeconds);
                const isExceeded = budgetedSeconds > 0 && spentSeconds > budgetedSeconds;
                const progress = budgetedSeconds > 0 ? Math.min(100, (spentSeconds / budgetedSeconds) * 100) : 0;
                const isInProgress = selectedTask?.tuluv === 'khiigdej bui';
                
                return (
                  <div className="flex flex-col space-y-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t("Цаг бүртгэл")}</span>
                      {isInProgress && (
                        <div className="flex items-center bg-teal-500/10 px-2 py-1 rounded-lg">
                          <Badge status="processing" color="#10b981" />
                          <span className="text-[10px] font-black text-teal-500 uppercase ml-1 animate-pulse">Хийгдэж байна</span>
                        </div>
                      )}
                    </div>
                    
                    {budgetedMinutes > 0 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="text-[12px] font-bold text-gray-400">
                            Төсөвлөсөн: <span className="text-gray-600 dark:text-gray-300 ml-1">{budgetedMinutes} мин</span>
                          </div>
                          <div className={`text-[12px] font-black ${isExceeded ? 'text-red-500' : 'text-teal-500'}`}>
                            {isExceeded ? `Хэтэрсэн: ${formatTimer(spentSeconds - budgetedSeconds)}` : `Үлдсэн: ${formatTimer(remainingSeconds)}`}
                          </div>
                        </div>
                        <Progress 
                          percent={progress} 
                          status={isExceeded ? 'exception' : (isInProgress ? 'active' : 'normal')} 
                          showInfo={false}
                          strokeColor={isExceeded ? '#ef4444' : '#14b8a6'}
                          trailColor="rgba(0,0,0,0.1)"
                          strokeWidth={10}
                          className="!m-0"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Зарцуулсан</span>
                        <div className={`text-3xl font-mono font-bold tabular-nums ${isExceeded ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                          {formatTimer(spentSeconds)}
                        </div>
                      </div>
                      
                      {selectedTask?.tuluv === 'duussan' && budgetedMinutes > 0 && (
                        <div className={`px-4 py-2 rounded-xl font-black text-[11px] shadow-sm uppercase tracking-wide ${isExceeded ? 'bg-red-500 text-white' : 'bg-teal-500/10 text-teal-600 border border-teal-500/20'}`}>
                          {isExceeded ? "ЦАГ ХЭТЭРСЭН" : "ХУГАЦААНДАА"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
          </div>

          <div className="pt-8 border-t dark:border-gray-700 mt-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase">
                Дэд ажил ({completedSubtasksCount} / {totalSubtasksCount})
              </span>
               
            </div>

            <div className="space-y-4 relative min-h-[100px]">
              {loadingSubtasks && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-10"><Spin /></div>
              )}
              {subtasks.map(s => (
                <div key={s._id} className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-teal-500 transition-colors cursor-pointer group">
                   
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
                  <Button type="text" className="h-10 rounded-xl dark:text-gray-400" onClick={() => { setIsAddingSubtask(false); setNewSubtaskTitle(""); }}>Цуцлах</Button>
                </div>
              ) : (
                <Button type="dashed" block icon={<PlusOutlined />} className="hover:bg-emerald-400 hover:text-gray-200 h-12 border-gray-300 dark:border-gray-700 bg-emerald-600/40 dark:bg-gray-600/40 dark:text-gray-400 hover:scale-105 transition-colors" onClick={() => setIsAddingSubtask(true)}>
                  {t("Ажил нэмэх")}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col h-screen lg:h-full bg-gray-50 dark:bg-[#161d2d] border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 relative snap-start">
          
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
             <div className="flex items-center space-x-3">
               <MessageOutlined className="text-gray-400 text-lg" />
               <h3 className="text-sm font-bold m-0 dark:text-white">Харилцах</h3>
               <Badge count={chatMessages.length} className="ml-2 text-white rounded-md px-1" />
             </div>
             
             <Button type="text" shape="circle" icon={<CloseOutlined className="text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400" />} onClick={() => setIsTaskDetailVisible(false)} />
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
              <div className="relative flex items-center bg-[#f3f4f6] dark:bg-[#1f2937] rounded-2xl border border-gray-200 dark:border-gray-700/60 shadow-inner overflow-hidden">
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
                      className="flex items-center justify-center p-0"
                      disabled={uploadingFile}
                    />
                  </Upload>
                 <Input.TextArea
                   placeholder="Зурвас бичих..."
                   autoSize={{ minRows: 1, maxRows: 4 }}
                   value={chatInput}
                   onChange={(e) => setChatInput(e.target.value)}
                   onPressEnter={(e) => {
                     if (!e.shiftKey) {
                       e.preventDefault();
                       handleSendMessage();
                     }
                   }}
                   style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: 'inherit', outline: 'none' }}
                   className="pl-12 pr-12 py-3 resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400 custom-scrollbar"
                 />
                 <Button 
                   type="primary" 
                   icon={<SendOutlined />} 
                   onClick={handleSendMessage}
                   disabled={(!chatInput.trim() && !selectedChatFile) || uploadingFile}
                   loading={uploadingFile}
                   className="absolute right-2 bottom-2 bg-teal-500 hover:bg-teal-400 border-none shadow-md h-8 w-8 rounded-lg flex items-center justify-center"
                 />
              </div>
          </div>
          
        </div>
        </div>
      </Drawer>

      <Modal
        title={dayTasksModal.date ? `${dayTasksModal.date.format("YYYY/MM/DD")} - ${t("Ажлууд")}` : t("Ажлууд")}
        visible={dayTasksModal.visible}
        onCancel={() => setDayTasksModal({ ...dayTasksModal, visible: false })}
        footer={null}
        width={400}
        centered
        className="day-tasks-modal"
      >
        <List
          dataSource={dayTasksModal.tasks}
          renderItem={task => (
            <div 
              onClick={(e) => {
                handleTaskClick(task, e);
                setDayTasksModal({ ...dayTasksModal, visible: false });
              }}
              className="flex items-center space-x-3 p-3 mb-2 rounded-xl text-[11px] font-bold border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer bg-gray-50 dark:bg-gray-800 dark:text-gray-200 uppercase tracking-tight"
              style={{ borderLeftColor: task.projectColor || "#14b8a6" }}
            >
              {task.completed ? 
                <CheckOutlined style={{ color: task.projectColor || "#14b8a6" }} className="scale-110" /> : 
                <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: task.projectColor || "#14b8a6" }}></div>
              }
              <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate">{task.title}</span>
                <span className="text-[9px] text-gray-400 mt-0.5">{task.projectName}</span>
              </div>
            </div>
          )}
        />
      </Modal>
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
        width={typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 480}
        placement="right"
        className="project-chat-drawer !p-0"
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <style>{`
          .project-chat-drawer .ant-drawer-body { background: #111827 !important; }
          .project-chat-drawer .ant-drawer-content { background: #111827 !important; }
          .pchat-me { background: linear-gradient(135deg,#0d9488,#0f766e); border-radius:1.2rem 1.2rem 0.25rem 1.2rem; }
          .pchat-other { background:#1f2937; border-radius:1.2rem 1.2rem 1.2rem 0.25rem; border:1px solid rgba(75,85,99,0.4); }
        `}</style>
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0 bg-green-800 dark:bg-gray-900">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shadow-lg" style={{ backgroundColor: selectedProjectForChat?.color || '#10B981' }}>
                {(selectedProjectForChat?.name || '').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight">{selectedProjectForChat?.name}</span>
                <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wide">Төслийн чат</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge count={projectChatMessages.length} size="small" />
              <Button type="text" shape="circle" icon={<CloseOutlined className="text-gray-400 hover:text-red-400" />} onClick={() => setIsProjectChatVisible(false)} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
            {loadingProjectChat ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <Spin size="large" />
                <span className="text-xs font-semibold uppercase tracking-widest animate-pulse text-gray-500">Уншиж байна...</span>
              </div>
            ) : projectChatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center">
                  <MessageOutlined style={{ fontSize: 28 }} className="text-gray-500" />
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm font-semibold">Зурвас байхгүй байна</p>
                  <p className="text-gray-600 text-xs mt-1">Санаагаа, тэмдэглэл, эсвэл дурын зүйл бичнэ үү</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {projectChatMessages.map((msg, idx) => {
                  const isMe = msg.ajiltniiId === ajiltan?._id;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                      {!isMe && (
                        <Avatar className="bg-gradient-to-br from-teal-500 to-emerald-600 font-bold shrink-0 text-xs shadow-lg">
                          {msg.ajiltniiNer?.charAt(0)?.toUpperCase()}
                        </Avatar>
                      )}
                      <div className={`flex flex-col max-w-[72%] ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && <span className="text-[10px] font-bold text-gray-400 mb-1 ml-1">{msg.ajiltniiNer}</span>}
                        <div className={`px-4 py-2.5 shadow-md ${isMe ? 'pchat-me' : 'pchat-other'}`}>
                          {msg.turul === 'zurag' && msg.fileZam ? (
                            <img src={msg.fileZam.startsWith('http') ? msg.fileZam : `${FSM_BASE_URL}/${msg.fileZam}`} alt="img" className="max-w-[200px] max-h-[200px] object-cover rounded-xl cursor-pointer" onClick={() => window.open(msg.fileZam.startsWith('http') ? msg.fileZam : `${FSM_BASE_URL}/${msg.fileZam}`, '_blank')} />
                          ) : msg.turul === 'file' && msg.fileZam ? (
                            <a href={msg.fileZam.startsWith('http') ? msg.fileZam : `${FSM_BASE_URL}/${msg.fileZam}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-teal-300 bg-white/5 p-2 rounded-lg border border-white/10">
                              <FileOutlined className="text-teal-400" />
                              <span className="truncate max-w-[140px] text-xs text-gray-200">{msg.fileNer || 'Файл'}</span>
                            </a>
                          ) : (
                            <span className="text-[13px] text-white whitespace-pre-wrap leading-relaxed">{msg.medeelel}</span>
                          )}
                        </div>
                        <span className={`text-[9px] text-gray-600 mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}>{dayjs(msg.createdAt).format('MM/DD HH:mm')}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={projectChatEndRef} />
              </div>
            )}
          </div>

          <div className="shrink-0 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700/60 px-4 py-3">
            {selectedProjectChatFile && (
              <div className="mb-2 flex items-center px-3 py-1.5 bg-teal-900/30 border border-teal-700/40 rounded-xl relative w-max">
                <PaperClipOutlined className="text-teal-400 mr-2" />
                <span className="text-xs font-semibold text-teal-300 truncate max-w-[200px]">{selectedProjectChatFile.name}</span>
                <Button type="text" size="small" icon={<CloseOutlined className="text-[10px] text-gray-500" />} className="absolute right-1" onClick={() => setSelectedProjectChatFile(null)} />
              </div>
            )}
             <div className="relative flex items-center bg-[#f3f4f6] dark:bg-[#1f2937] rounded-2xl border border-gray-200 dark:border-gray-700/60 shadow-inner overflow-hidden">
              <Upload customRequest={handleProjectFileUpload} showUploadList={false} className="absolute left-3 top-1/2 -translate-y-1/2 z-10" disabled={uploadingProjectChatFile}>
                <Button type="text" shape="circle" icon={uploadingProjectChatFile ? <LoadingOutlined className="text-teal-500" /> : <PaperClipOutlined className="text-gray-500 hover:text-teal-400 text-lg" />} disabled={uploadingProjectChatFile} className="p-0 border-none" />
              </Upload>
               <Input.TextArea
                placeholder="Зурвас бичих..."
                autoSize={{ minRows: 1, maxRows: 5 }}
                value={projectChatInput}
                onChange={(e) => setProjectChatInput(e.target.value)}
                onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleSendProjectMessage(); } }}
                style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#000000ff',dark: '#ffffff', outline: 'none' }}
                className="pl-12 pr-12 py-3 resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400 custom-scrollbar"
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleSendProjectMessage} disabled={(!projectChatInput.trim() && !selectedProjectChatFile) || uploadingProjectChatFile} loading={uploadingProjectChatFile} className="absolute right-2 bottom-2 bg-teal-500 hover:bg-teal-400 border-none h-8 w-8 rounded-lg flex items-center justify-center shadow-md" />
            </div>
          </div>
        </div>
      </Drawer>
    </Admin>
  );
}

export default Tuluvluguu;
