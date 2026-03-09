import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from 'react-dom';
import dayjs from "dayjs";
import "dayjs/locale/mn";
dayjs.locale("mn");
import fsmApi from "services/fsmApi";
import { useAuth } from "services/auth";
import { message, Form, Input, InputNumber, Modal, DatePicker, Tooltip, Popconfirm, Spin } from "antd";
import { useTranslation } from "react-i18next";
import useJagsaalt from "hooks/useJagsaalt";
import { 
  PlusOutlined, 
  FileExcelOutlined,
  DownOutlined,
  MoreOutlined,
  SettingOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  UserOutlined,
  RightOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { 
  Button, 
  Select, 
  Checkbox,
  Dropdown,
  Space,
  Avatar
} from "antd";
import { useFsmSocket } from "hooks/useFsmSocket";


function BaraaMaterial() {
  const { t } = useTranslation();

  const unitMap = {
    shirheg: "Ширхэг",
    litr: "Литр",
    kg: "Кг",
    haire: "Хайрцаг",
    bogts: "Богц",
    dana: "Дана"
  };

  const typeMap = {
    tseverlegch: "Цэвэрлэгч",
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

  const fetchBaraas = useCallback(async () => {
    if (!barilgiinId) return;
    setLoading(true);
    try {
      const res = await api.get("/baraas", { params: { barilgiinId, baiguullagiinId } });
      setBaraas(res.data?.data || res.data || []);
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

  useEffect(() => {
    fetchBaraas();
    fetchProjects();
    fetchHistory();
  }, [fetchBaraas, fetchProjects, fetchHistory]);

  const { isConnected } = useFsmSocket();

  useEffect(() => {
    if (isConnected) {
        }
  }, [isConnected]);
    
  const filteredBaraas = useMemo(() => {
    if (filterType === "all") return baraas;
    return baraas.filter(b => b.turul === filterType);
  }, [baraas, filterType]);

  const handleSaveBaraa = async (values) => {
    if (!barilgiinId) { message.warning("Барилгын мэдээлэл байхгүй байна"); return; }
    try {
      const payload = {
        ner: values.ner,
        turul: values.turul || "tseverlegch",
        tailbar: values.tailbar || "",
        negj: values.negj || "shirheg",
        une: Number(values.une) || 0,
        uldegdel: Number(values.uldegdel) || 0,
        doodUldegdel: Number(values.doodUldegdel) || 0,
        barcode: values.barcode || "",
        zurgiinId: values.zurgiinId || "",
        brand: values.brand || "",
        negjUne: Number(values.negjUrtug) || 0,
        niitUrtug: Number(values.niitUne) || 0,
        niiluulegch: values.niiluulegch || "",
        idevhtei: values.idevhtei !== undefined ? values.idevhtei : true,
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
        message.success(`Бараа амжилттай ${editingBaraa ? 'шинэчлэгдлээ' : 'бүртгэгдлээ'}`);
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

  const handleCreateProject = async (values) => {
    if (!barilgiinId) { message.warning("Барилгын мэдээлэл байхгүй байна"); return; }
    setSavingProject(true);
    try {
      const payload = {
        ner: values.name,
        tailbar: values.tailbar || "",
        ekhlekhOgnoo: values.ekhlekhOgnoo ? dayjs(values.ekhlekhOgnoo).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
        duusakhOgnoo: values.duusakhOgnoo ? dayjs(values.duusakhOgnoo).format("YYYY-MM-DD") : dayjs().add(30, "day").format("YYYY-MM-DD"),
        udirdagchId: ajiltan?._id,
        ajiltnuud: ajiltan?._id ? [ajiltan._id] : [],
        barilgiinId,
        baiguullagiinId,
        color: values.color || "#10B981",
        tuluv: "shine",
      };
      
      let res;
      if (editingProject) {
        res = await api.put(`/projects/${editingProject.id}`, payload);
      } else {
        res = await api.post("/projects", payload);
      }
      
      if (res.data?.success || res.status === 200 || res.status === 201) {
        message.success(`Төсөл амжилттай ${editingProject ? 'засагдлаа' : 'нэмэгдлээ'}`);
        await fetchProjects();
        await fetchHistory();
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
        await fetchProjects();
        await fetchHistory();
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

  const handleDeleteBaraa = async (id) => {
    try {
      const res = await api.delete(`/baraas/${id}`);
      if (res.data?.success || res.status === 200) {
        message.success("Бараа амжилттай устгагдлаа");
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

  const statCards = [
    { title: "Нийт төрөл", value: baraas.length.toString() },
    { title: "Цэвэрлэгээний", value: baraas.filter(b => b.turul === 'tseverlegch').length.toString() },
    { title: "Багаж хэрэгсэл", value: baraas.filter(b => b.turul === 'bagaj').length.toString() },
    { title: "Бусад", value: baraas.filter(b => b.turul === 'busad').length.toString() },
  ];

  const teamMembers = useMemo(() => {
    return ajiltanJagsaalt?.jagsaalt?.map(a => ({
      id: a._id,
      name: a.ner || a.nevtrekhNer,
      role: a.erkh || "Ажилтан"
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
      <div className="col-span-12 flex flex-col xl:flex-row h-auto xl:h-[calc(100vh-120px)] w-full -mx-0 xl:-mx-1 -mt-2 text-black overflow-hidden lg:rounded-2xl shadow-2xl relative transition-all duration-300 animate-entrance">
        
        <div className="flex-1 flex flex-col p-4 overflow-x-hidden relative min-w-0">
          
          
          <div id="mat-stats" className="hideScroll grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 shrink-0 pt-1">
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
                className="bg-emerald-500 hover:bg-emerald-600 border-none !rounded-lg text-xs font-bold shadow-md h-[36px]"
                onClick={() => setIsIncomeModalOpen(true)}
              >
                Орлого
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="bg-emerald-500 hover:bg-emerald-600 border-none !rounded-lg text-xs font-bold shadow-md h-[36px]"
                onClick={() => setIsAddModalOpen(true)}
              >
                Бараа бүртгэх
              </Button>
              <Button
                type="primary"
                className="bg-emerald-500 hover:bg-emerald-600 border-none !rounded-lg text-xs font-bold shadow-md h-[36px] flex items-center gap-1"
              >
                <FileExcelOutlined /> Excel <DownOutlined className="text-[10px]" />
              </Button>
            </Space>
          </div>

          <div id="mat-table" className="border border-slate-300 dark:border-slate-700/60 rounded-xl overflow-hidden bg-white dark:bg-gray-800 h-fit max-h-[70vh] flex flex-col shadow-inner mb-6 animate-entrance-stagger-7">
            <div className="overflow-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
              <table className="w-full text-left text-[11.5px] text-gray-800 dark:text-gray-300 border-collapse whitespace-nowrap min-w-max">
                <thead className="bg-gray-100 dark:bg-gray-900 dark:text-white text-black sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2.5 border-b border-r border-slate-300 dark:border-slate-700/60 font-medium text-center w-8">
                       №
                    </th>
                    
                    <th className="px-3 py-2.5 border-b border-r border-slate-300 dark:border-slate-700/60 font-medium">Нэр</th>
                    <th className="px-3 py-2.5 border-b border-r border-slate-300 dark:border-slate-700/60 font-medium text-center">Код</th>
                    <th className="px-3 py-2.5 border-b border-r border-slate-300 dark:border-slate-700/60 text-center font-medium">Үлдэгдэл</th>
                    <th className="px-3 py-2.5 border-b border-r border-slate-300 dark:border-slate-700/60 text-center font-medium">Брэнд</th>
                    <th className="px-3 py-2.5 border-b border-r border-slate-300 dark:border-slate-700/60 text-center font-medium w-16">Х/нэгж</th>
                    <th className="px-3 py-2.5 border-b border-r border-slate-300 dark:border-slate-700/60 font-medium text-center">Төрөл</th>
                    <th className="px-3 py-2.5 border-b border-r border-slate-300 dark:border-slate-700/60 font-medium text-center">Нийлүүлэгч</th>
                    <th className="px-3 py-2.5 border-b border-r border-slate-300 dark:border-slate-700/60 text-center font-medium">Нэгж үнэ</th>
                    <th className="px-3 py-2.5 border-b border-slate-300 dark:border-slate-700/60 text-center font-medium border-r">Нийт үнэ</th>
                    <th className="px-2 py-2.5 border-b border-slate-300 dark:border-slate-700/60 text-center font-medium w-10">
                      <SettingOutlined className="text-black dark:text-gray-400" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBaraas.map((row, i) => (
                    <tr key={row._id} className="hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors border-b border-slate-300 dark:border-slate-700/60 last:border-b-0 group">
                      <td className="px-3 py-2 border-r border-slate-300 dark:border-slate-700/60 text-center w-8 text-gray-400 font-bold">
                        {i + 1}
                      </td>
                      
                      <td className="px-3 py-2 border-r border-slate-300 dark:border-slate-700/60 font-medium">{row.ner}</td>
                      <td className="px-3 py-2 border-r border-slate-300 dark:border-slate-700/60 text-center text-gray-600 dark:text-gray-400">{row.barcode || row.kod}</td>
                      <td className={`px-3 py-2 border-r border-slate-300 dark:border-slate-700/60 text-center ${row.uldegdel < row.doodUldegdel ? 'text-red-500 dark:text-red-400 font-bold' : ''}`}>{row.uldegdel || 0}</td>
                      <td className="px-3 py-2 border-r border-slate-300 dark:border-slate-700/60 text-center">{row.brand || "—"}</td>
                      <td className="px-3 py-2 border-r border-slate-300 dark:border-slate-700/60 text-center text-gray-600 dark:text-gray-400">{row.negjM ? unitMap[row.negjM] : unitMap[row.negj] || row.negj}</td>
                      <td className="px-3 py-2 border-r border-slate-300 dark:border-slate-700/60 text-center text-gray-600 dark:text-gray-400">{typeMap[row.turul] || row.turul}</td>
                      <td className="px-3 py-2 border-r border-slate-300 dark:border-slate-700/60 text-center text-gray-600 dark:text-gray-400">{row.niiluulegch || "—"}</td>
                      <td className="px-3 py-2 border-r border-slate-300 dark:border-slate-700/60 text-right font-medium">{row.une?.toLocaleString() || "0"}</td>
                      <td className={`px-3 py-2 border-r border-slate-300 dark:border-slate-700/60 text-right font-bold tracking-wide ${((row.uldegdel || 0) * (row.une || 0)) < 0 ? 'text-red-600 dark:text-red-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                        {((row.uldegdel || 0) * (row.une || 0))?.toLocaleString() || "0"}
                      </td>
                      <td className="px-2 py-2 text-center w-10">
                        <Dropdown
                          menu={{
                            items: [
                              { key: '1', label: 'Засах', icon: <EditOutlined className="text-blue-500"/>, onClick: () => openEditModal(row) },
                              { key: '2', label: 'Устгах', icon: <DeleteOutlined className="text-red-500"/>, danger: true, onClick: () => {
                                Modal.confirm({
                                  title: 'Бараа устгах',
                                  content: 'Та энэ барааг устгахдаа итгэлтэй байна уу?',
                                  okText: 'Устгах',
                                  cancelText: 'Цуцлах',
                                  okButtonProps: { danger: true },
                                  onOk: () => handleDeleteBaraa(row._id)
                                });
                              }},
                            ]
                          }}
                          trigger={['click']}
                        >
                          <MoreOutlined className="rotate-90 text-gray-500 cursor-pointer group-hover:text-black dark:group-hover:text-white" />
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dark:bg-gray-800 border-t border-slate-300 dark:border-slate-700/60 text-black dark:text-white font-bold shrink-0 sticky bottom-0">
              <table className="w-full text-left text-[12.5px] whitespace-nowrap">
                <tbody>
                  <tr>
                    <td className="px-3 py-3 w-8 text-center"></td>
                    <td className="px-3 py-3 w-10 text-center"></td>
                    
                    <td className="px-3 py-3"></td>
                    <td className="px-3 py-3 text-center"></td>
                    <td className="px-3 py-3 text-center"></td>
                    <td className="px-3 py-3 text-center"></td>
                    <td className="px-3 py-3 text-center"></td>
                    <td className="px-3 py-3 text-center"></td>
                    <td className="px-3 py-3 text-center"></td>
                    <td className="px-3 py-3 text-right"></td>
                    <td className="px-3 py-3 text-right text-white dark:text-emerald-400">{filteredBaraas.reduce((acc, curr) => acc + ((Number(curr.uldegdel) || 0) * (Number(curr.une) || 0)), 0).toLocaleString()}</td>
                    <td className="px-2 py-3 text-center w-10"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-300 ease-in-out animate-entrance-stagger-8 ${isRightPanelExpanded ? "w-full xl:w-[340px] opacity-100" : 'w-0 opacity-0 whitespace-nowrap overflow-hidden'} shrink-0 h-auto xl:h-[calc(102vh-6rem)] flex flex-col relative z-20`}>  
          <div className="flex-1 m-3 bg-white dark:bg-[#1f2636] rounded-[2rem] border border-slate-100 dark:border-slate-800/60 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-none w-full flex flex-col [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
              <div className="max-h-[200px] overflow-y-auto flex flex-col shrink-0 m-4 mb-2 bg-white dark:bg-gray-900/40 rounded-2xl border border-slate-200 dark:border-slate-700/30 overflow-hidden shadow-lg">
                            <div className="flex items-center justify-between p-4 pb-3 shrink-0">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded flex items-center justify-center">
                                   <ClockCircleOutlined className="dark:text-gray-400 text-gray-800 text-[10px]" />
                                </div>
                                <span className="font-extrabold text-black dark:text-white text-[11px] tracking-wide">Түүх</span>
                              </div>
                              <Button type="text" size="small" className="hover:!bg-slate-600/50 hover:text-white dark:hover:!bg-white/10 transition-all rounded-md px-1 w-6 h-6 border border-slate-700/50 flex items-center justify-center" icon={<CloseOutlined className="text-gray-400 dark:text-gray-300 text-[10px]" />} onClick={() => setIsRightPanelExpanded(false)} />
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
              
              <div id="mat-sidebar" className="flex-1 flex flex-col p-4 space-y-6">
                 
        
                <div className="border-b border-slate-200 dark:border-slate-700/50"></div>
                
                <div className="flex h-[calc(40vh-200px)] overflow-y-auto flex-col space-y-3 shrink-0 dark:bg-gray-900/40 rounded-lg p-2 shadow-md border dark:border-slate-700/50">
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
                
                <div id="mat-team" className="pt-4 h-[calc(50vh-200px)] overflow-y-auto shrink-0 dark:bg-gray-900/40 rounded-lg p-2 shadow-md border dark:border-slate-700/50 overflow-y-auto max-h-[400px]">
                  <div className="text-[11px] font-extrabold text-gray-400 mb-4 px-1 flex items-center tracking-wide uppercase opacity-70">
                    <span>Ажилчид</span>
                  </div>
                  <div className="space-y-1.5">
                    {teamMembers.map((member, i) => (
                      <div key={i} className="flex items-center group cursor-pointer transition-all px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-sm">
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
              <div className="p-4 shrink-0 mb-8">
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
            title={editingBaraa ? "Бараа засах" : "Бараа бүртгэх"}
            open={isAddModalOpen}
            onCancel={() => {
              setIsAddModalOpen(false);
              setEditingBaraa(null);
              form.resetFields();
            }}
            onOk={() => form.submit()}
            okText="Хадгалах"
            cancelText="Цуцлах"
            okButtonProps={{ className: "bg-emerald-500 hover:bg-emerald-400 border-none" }}
          >
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={handleSaveBaraa}
              onValuesChange={(changedValues, allValues) => {
                const { uldegdel, negjUrtug, niitUne } = allValues;
                if (changedValues.uldegdel !== undefined || changedValues.negjUrtug !== undefined) {
                  const total = (Number(uldegdel) || 0) * (Number(negjUrtug) || 0);
                  form.setFieldsValue({ niitUne: total });
                } else if (changedValues.niitUne !== undefined) {
                  const total = (Number(allValues.niitUne) || 0);
                  const qty = (Number(uldegdel) || 0);
                  if (qty > 0) {
                    form.setFieldsValue({ negjUrtug: Math.round((total / qty) * 100) / 100 });
                  }
                }
              }}
            >
              <Form.Item name="ner" label="Барааны нэр" rules={[{ required: true }]}>
                 <Input placeholder="Нэр" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="negj" label="Хэмжих нэгж" initialValue="shirheg">
                  <Select placeholder="Сонгох">
                      <Select.Option value="shirheg">Ширхэг</Select.Option>
                      <Select.Option value="litr">Литр</Select.Option>
                      <Select.Option value="kg">Кг</Select.Option>
                      <Select.Option value="haire">Хайрцаг</Select.Option>
                      <Select.Option value="bogts">Богц</Select.Option>
                      <Select.Option value="dana">Дана</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="turul" label="Төрөл" initialValue="busad">
                  <Select placeholder="Сонгох">
                      <Select.Option value="tseverlegch">Цэвэрлэгч</Select.Option>
                      <Select.Option value="ugaalgiin">Угаалгын</Select.Option>
                      <Select.Option value="ariutgagch">Ариутгагч</Select.Option>
                      <Select.Option value="bagaj">Багаж</Select.Option>
                      <Select.Option value="busad">Бусад</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="uldegdel" label="Үлдэгдэл" initialValue={0}>
                   <InputNumber className="w-full" placeholder="Үлдэгдэл" />
                </Form.Item>
                <Form.Item name="doodUldegdel" label="Доод үлдэгдэл" initialValue={0}>
                   <InputNumber className="w-full" placeholder="Доод үлдэгдэл" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Form.Item name="negjUrtug" label="Нэгж өртөг" initialValue={0}>
                   <InputNumber className="w-full" placeholder="Нэгж өртөг" />
                </Form.Item>
                <Form.Item name="niitUne" label="Нийт өртөг" initialValue={0}>
                   <InputNumber className="w-full" placeholder="Нийт өртөг" />
                </Form.Item>
                <Form.Item name="une" label="Худалдах үнэ">
                   <InputNumber className="w-full" placeholder="Үнэ" />
                </Form.Item>
              </div>

              <Form.Item name="barcode" label="Бар код">
                 <Input placeholder="Бар код" />
              </Form.Item>
              <Form.Item name="brand" label="Брэнд / Групп">
                 <Input placeholder="Брэнд" />
              </Form.Item>
               <Form.Item name="niiluulegch" label="Нийлүүлэгч">
                  <Input placeholder="Нийлүүлэгч" />
               </Form.Item>
               <div className="grid grid-cols-2 gap-4">
                 <Form.Item name="zurgiinId" label="Зургийн ID">
                    <Input placeholder="Зургийн ID" />
                 </Form.Item>
                 <Form.Item name="idevhtei" label="Идэвхтэй" valuePropName="checked" initialValue={true}>
                    <Checkbox>Тийм</Checkbox>
                 </Form.Item>
               </div>
               <Form.Item name="tailbar" label="Тайлбар">
                  <Input.TextArea placeholder="Төслийн дэлгэрэнгүй тайлбар..." className="rounded-xl" rows={2} />
               </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Орлого бүртгэх"
            open={isIncomeModalOpen}
            onCancel={() => setIsIncomeModalOpen(false)}
            onOk={() => incomeForm.submit()}
            okText="Орлого авах"
            cancelText="Цуцлах"
            okButtonProps={{ className: "bg-emerald-500 hover:bg-emerald-400 border-none" }}
          >
            <Form form={incomeForm} layout="vertical" onFinish={handleCreateIncome}>
              <Form.Item name="baraa" label="Бараа сонгох" rules={[{ required: true }]}>
                 <Select placeholder="Бараа сонгох">
                   {baraas.map(b => (
                      <Select.Option key={b._id} value={b._id}>{b.ner} </Select.Option>
                   ))}
                 </Select>
              </Form.Item>
              <Form.Item name="too" label="Тоо хэмжээ" rules={[{ required: true }]}>
                 <InputNumber className="w-full" placeholder="Тоо хэмжээ" />
              </Form.Item>
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
                >
                  <DatePicker className="w-full h-12 rounded-xl" format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item 
                  name="duusakhOgnoo" 
                  label={<span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block pl-1">Дуусах өдөр</span>}
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
    </Admin>
  );
}

export default BaraaMaterial;
