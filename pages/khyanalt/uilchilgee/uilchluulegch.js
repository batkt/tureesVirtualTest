import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import fsmApi, { FSM_BASE_URL_ZEV as FSM_BASE_URL } from "services/fsmApi";
import { useAuth } from "services/auth";
import { message, Form, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { 
  PlusOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  CloseOutlined,
  TrophyOutlined,
  StarOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { 
  Button, 
  Select, 
  Avatar,
  Modal,
  Dropdown
} from "antd";
import dayjs from "dayjs";
import { useFsmSocket } from "hooks/useFsmSocket";

function Uilchluulegch() {
  const { t } = useTranslation();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [clientProjects, setClientProjects] = useState([]);
  const [clientTasks, setClientTasks] = useState([]);
  
  const [ratingTaskId, setRatingTaskId] = useState(null);
  const [clientScorePoints, setClientScorePoints] = useState(5);
  const [clientScoreNote, setClientScoreNote] = useState("");
  const [savingClientScore, setSavingClientScore] = useState(false);
  
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const tutorialSteps = [
    { targetId: "cust-search-filter", title: t("Хайлт ба шүүлтүүр"), description: t("Үйлчлүүлэгчдийг нэр, утсаар хайх болон төрөл болон төлөвөөр нь шүүх хэсэг.") },
    { targetId: "cust-add-btn", title: t("Шинэ харилцагч"), description: t("Шинэ үйлчлүүлэгч системд бүртгэх товч.") },
    { targetId: "cust-list", title: t("Үйлчлүүлэгч"), description: t("Бүх үйлчлүүлэгчдийн карт жагсаалт. Карт бүр дээрх 'Дэлгэрэнгүй харах' товчоор түүхийг нь харна уу.") },
  ];
  
  const { token, barilgiinId, ajiltan } = useAuth();
  const baiguullagiinId = ajiltan?.baiguullagiinId;
  const api = useMemo(() => fsmApi.withAuth(token, FSM_BASE_URL), [token, FSM_BASE_URL]);

  const fetchUsers = useCallback(async () => {
    if (!barilgiinId) return;
    setLoading(true);
    try {
      const res = await api.get("/uilchluulegch", { 
        params: { barilgiinId, baiguullagiinId } 
      });
      setUsers(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, [barilgiinId, baiguullagiinId, api]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSaveUser = async (values) => {
    if (!barilgiinId) { toast.warning(t("Барилгын мэдээлэл байхгүй байна")); return; }
    try {
      const payload = {
        ...values,
        barilgiinId,
        baiguullagiinId,
      };
      
      let res;
      if (editingUser) {
        res = await api.put(`/uilchluulegch/${editingUser._id}`, payload);
      } else {
        res = await api.post("/uilchluulegch", payload);
      }

      if (res.data?.success || res.status === 200) {
        toast.success(`${t("Үйлчлүүлэгч амжилттай")} ${editingUser ? t('шинэчлэгдлээ') : t('нэмэгдлээ')}`);
        await fetchUsers();
        setIsAddModalOpen(false);
        setEditingUser(null);
        form.resetFields();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || `${t("Үйлчлүүлэгч")} ${editingUser ? t('шинэчлэхэд') : t('нэмэхэд')} ${t("алдаа гарлаа")}`);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await api.delete(`/uilchluulegch/${id}`);
      if (res.data?.success || res.status === 200) {
        toast.success(t("Үйлчлүүлэгч амжилттай устгагдлаа"));
        await fetchUsers();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || t("Үйлчлүүлэгч устгахад алдаа гарлаа"));
    }
  };

  const formatSpentTime = (task) => {
    let spentSeconds = 0;
    if (task.ajiltanTsag && Array.isArray(task.ajiltanTsag)) {
      task.ajiltanTsag.forEach(tsag => {
        if (tsag.ekhlekhTsag && tsag.duusakhTsag) {
          const diff = dayjs(tsag.duusakhTsag).diff(dayjs(tsag.ekhlekhTsag), 'second');
          if (diff > 0) spentSeconds += diff;
        } else if (tsag.tsagMinute) {
          spentSeconds += Math.round(Number(tsag.tsagMinute) * 60);
        }
      });
    }
    if (spentSeconds === 0 && task.zartsuulsanKhugatsaa) {
      spentSeconds = Number(task.zartsuulsanKhugatsaa);
    }
    if (spentSeconds <= 0) return null;
    const h = Math.floor(spentSeconds / 3600);
    const m = Math.floor((spentSeconds % 3600) / 60);
    const s = spentSeconds % 60;
    if (h > 0) return `${h}${t("цаг")} ${m}${t("мин")} ${s}${t("сек")}`;
    if (m > 0) return `${m}${t("мин")} ${s}${t("сек")}`;
    return `${s}${t("сек")}`;
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      ...user,
    });
    setIsAddModalOpen(true);
  };

  const fetchUserHistoryData = async (userId) => {
    if (!userId) return;
    setLoadingHistory(true);
    try {
      const [pRes, tRes] = await Promise.all([
        api.get("/projects", { params: { barilgiinId, baiguullagiinId, uilchluulegchId: userId } }),
        api.get("/tasks", { params: { barilgiinId, baiguullagiinId, uilchluulegchId: userId } })
      ]);
      setClientProjects(pRes.data?.data || pRes.data || []);
      setClientTasks(tRes.data?.data || tRes.data || []);
    } catch (err) {
      console.error("Failed to fetch client history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmitClientScore = async (taskId) => {
    setSavingClientScore(true);
    try {
      const payload = {
        uilchluulegchOnooson: clientScorePoints,
        uilchluulegchOnoosonTailbar: clientScoreNote,
        uilchluulegchId: selectedUser?._id
      };
      const res = await api.post(`/tasks/${taskId}/client-onoo`, payload);
      if (res.data?.success) {
        toast.success(t("Үнэлгээ амжилттай хадгалагдлаа"));
        const updatedTask = res.data.data;
        setClientTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...updatedTask } : t));
        if (res.data.clientKpi) {
          const { kpiDaalgavarToo, kpiDundaj, kpiOrlogo } = res.data.clientKpi;
          setUsers(prev => prev.map(u => u._id === selectedUser?._id ? { ...u, kpiDaalgavarToo, kpiDundaj, kpiOrlogo } : u));
          setSelectedUser(prev => ({ ...prev, kpiDaalgavarToo, kpiDundaj, kpiOrlogo }));
        }
        setRatingTaskId(null);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || t("Оноо хадгалахад алдаа гарлаа"));
    } finally {
      setSavingClientScore(false);
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
    fetchUserHistoryData(user._id);
  };

  const { on, off, emit } = useFsmSocket(null, null, null, FSM_BASE_URL);

  useEffect(() => {
    if (barilgiinId && emit) {
      emit('join_barilga', { barilgiinId });
    }
  }, [barilgiinId, emit]);

  useEffect(() => {
    if (!on) return;

    const handleKpiUpdate = (data) => {
      setUsers(prev => prev.map(u => {
        if (u._id === data.uilchluulegchId) {
          return { ...u, ...data };
        }
        return u;
      }));
      
      setSelectedUser(prev => {
        if (prev?._id === data.uilchluulegchId) {
          return { ...prev, ...data };
        }
        return prev;
      });
    };

    on('client_kpi_updated', handleKpiUpdate);
    return () => off('client_kpi_updated', handleKpiUpdate);
  }, [on, off]);

  const statCards = [
    { title: t("Нийт харилцагч"), value: users.length.toString() },
    { title: t("Шинэ"), value: users.filter(u => u.tuluv === 'shine').length.toString() },
    { title: t("Нийт даалгавар"), value: users.reduce((acc, curr) => acc + (Number(curr.kpiDaalgavarToo) || 0), 0).toString() },
    { title: t("Дундаж KPI"), value: (users.length > 0 ? (users.reduce((acc, curr) => acc + (Number(curr.kpiDundaj) || 0), 0) / users.length).toFixed(1) : "0") },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = !searchText || 
        user.ner?.toLowerCase().includes(searchText.toLowerCase()) || 
        user.utas?.some(u => u.includes(searchText)) ||
        user.mail?.toLowerCase().includes(searchText.toLowerCase());
        
      const finalTuluv = (user.kpiDaalgavarToo > 0) ? user.tuluv : 'idevhgui';
      const matchStatus = filterStatus === "all" || finalTuluv === filterStatus;
      
      return matchSearch && matchStatus;
    });
  }, [users, searchText, filterStatus]);

  return (
    <Admin title={t("Үйлчлүүлэгч")} khuudasniiNer="uilchluulegch">
      <div className="col-span-12 flex flex-col h-auto xl:h-H7HalfRem w-full text-black overflow-hidden lg:rounded-2xl shadow-2xl relative animate-entrance">
        <GuidedTour 
          steps={tutorialSteps} 
          isOpen={isTutorialOpen} 
          onClose={() => setIsTutorialOpen(false)} 
        />
        <div className="flex-1 flex flex-col p-4 overflow-x-hidden overflow-y-auto relative min-w-0">
          
          <div id="cust-stats" className="hideScroll grid w-full grid-cols-1 gap-3 overflow-hidden overflow-x-auto py-3 sm:grid-cols-6 sm:p-0 md:gap-4 2xl:grid-cols-8 mb-6 shrink-0 px-1 pt-1 opacity-100">
            {statCards.map((card, index) => (
              <div
                key={index}
                className={`group relative w-full sm:w-auto cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-gray-300 dark:hover:shadow-gray-800 sm:col-span-12 lg:col-span-2 border-2 border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/40 animate-entrance-stagger-${Math.min(index + 1, 5)}`}
              >
                <div className="absolute inset-0 bg-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                <div className="relative h-full rounded-2xl p-3 sm:p-2.5">
                  <div className="flex h-full flex-col justify-between">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <div className="mb-0.5 bg-gradient-to-r from-emerald-900 to-emerald-700 bg-clip-text text-xl xl:text-3xl font-bold text-transparent dark:from-emerald-100 dark:to-emerald-300">
                          {card.value}
                        </div>
                        <div className="text-[12px] xl:text-sm font-medium text-emerald-600 transition-colors duration-300 dark:text-emerald-400">
                          {card.title}
                        </div>
                      </div>
                    </div>
                    <div className="h-0.5 w-9 rounded-full bg-emerald-500 transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 shrink-0 px-1">
            <div id="cust-search-filter" className="flex flex-1 items-center gap-4 w-full md:w-auto">
               <Input 
                 placeholder={t("Нэр, утас, э-мэйлээр хайх...")} 
                 prefix={<SearchOutlined className="text-gray-400" />}
                 value={searchText}
                 onChange={(e) => setSearchText(e.target.value)}
                 className="h-[40px] rounded-xl max-w-md shadow-sm border-gray-200 dark:border-gray-700"
                 allowClear
               />
               <Select
                 placeholder={t("Төлөв")}
                 value={filterStatus}
                 onChange={(val) => setFilterStatus(val)}
                 className="h-[40px] w-32 [&>.ant-select-selector]:!h-[40px] [&>.ant-select-selector]:!rounded-xl [&>.ant-select-selector]:!flex [&>.ant-select-selector]:!items-center"
                 options={[
                   { label: t("Бүгд"), value: "all" },
                   { label: t("Идэвхтэй"), value: "idevhtei" },
                   { label: t("Идэвхгүй"), value: "idevhgui" },
                 ]}
               />
            </div>
            <div id="cust-add-btn" className="shrink-0 w-full md:w-auto flex items-center gap-2">
              <Button
                type="primary"
                icon={<PlusOutlined />} 
                onClick={() => setIsAddModalOpen(true)}
                className="text-white bg-emerald-500 hover:!bg-emerald-400 border-none !rounded-xl text-[12px] font-bold shadow-lg shadow-emerald-500/20 h-[40px] px-6 w-full md:w-auto"
              >
                {t("Шинэ харилцагч")}
              </Button>
              <Button
                shape="circle"
                icon={<QuestionCircleOutlined />}
                onClick={() => setIsTutorialOpen(true)}
                className="text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border-none shadow-sm flex items-center justify-center shrink-0 transition-colors bg-white dark:bg-gray-800"
                title={t("Тусламж")}
              />
            </div>
            
            
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-2 relative">
            {filteredUsers.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="text-gray-400 font-medium ">
                  {t("Өгөгдөл олдсонгүй")}
                </div>
              </div>
            )}
            {filteredUsers.map((user, idx) => (
              <div key={user._id} id={idx === 0 ? "cust-list" : undefined} className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-[#2d3748]/50 rounded-[18px] p-5 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3 rounded-lg">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar size="medium" className="bg-gradient-to-tr from-green-300 to-gray-500 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold border border-white dark:border-gray-800 shadow-xl">
                      <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-black dark:text-gray-200 font-bold text-[13px]  truncate">{user.ner}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-[12px] dark:text-gray-400 font-medium ">{t("Гэрээний дугаар")}: {user.gereeNomer || "-"}</span>
                        {(() => {
                          const finalTuluv = (user.kpiDaalgavarToo > 0) ? user.tuluv : 'idevhgui';
                          return (
                            <div className={`px-1.5 py-0.5 rounded-lg text-[12px] font-bold uppercase ${
                              finalTuluv === 'shine' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                              finalTuluv === 'idevhtei' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                              finalTuluv === 'idevhgui' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                              'bg-gray-100 text-gray-600 dark:bg-gray-800'
                            }`}>
                              {finalTuluv === 'shine' ? t('Шинэ') : finalTuluv === 'idevhtei' ? t('Идэвхтэй') : finalTuluv === 'idevhgui' ? t('Идэвхгүй') : finalTuluv}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  <Dropdown
                     menu={{
                       items: [
                         { key: '1', label: t('Засах'), icon: <EditOutlined className="text-blue-500" />, onClick: () => openEditModal(user) },
                         { key: '2', label: t('Устгах'), icon: <DeleteOutlined className="text-red-500" />, danger: true, onClick: () => {
                           Modal.confirm({
                             title: t('Үйлчлүүлэгч устгах'),
                             content: t('Та энэ үйлчлүүлэгчийг устгахдаа итгэлтэй байна уу?'),
                             okText: t('Устгах'),
                             cancelText: t('Цуцлах'),
                             okButtonProps: { danger: true },
                             onOk: () => handleDeleteUser(user._id)
                           });
                         }},
                       ]
                     }}
                     trigger={['click']}
                   >
                     <Button type="text" size="small" icon={<MoreOutlined className="rotate-90 text-gray-400 rounded-lg" />} />
                  </Dropdown>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-[12px] text-gray-600 dark:text-gray-400 font-medium  mt-1 ">
                  <div className="flex items-center gap-2">
                    <MailOutlined className="text-gray-400 shrink-0 text-sm" />
                    <span className="truncate">{user.mail || t("мэйл байхгүй")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneOutlined className="text-gray-400 shrink-0 text-sm" />
                    <span className="truncate">{Array.isArray(user.utas) ? user.utas[0] : (user.utas || t("утас байхгүй"))}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnvironmentOutlined className="text-gray-400 shrink-0 text-sm" />
                    <span className="line-clamp-1 leading-tight">{user.khayag || t("хаяг байхгүй")}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center px-10 mt-2 border-b dark:border-gray-800 rounded-xl border-gray-300 shadow-md">
                  <div className="flex flex-col items-center">
                    <span className="text-black dark:text-white font-bold text-sm ">{user.kpiDaalgavarToo || "0"}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-[12px] font-semibold mt-1">{t("Ажлууд")}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-emerald-400 font-bold text-sm ">{user.kpiDundaj || "-"}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-[12px] font-semibold mt-1">{t("Үнэлгээ")}</span>
                  </div>
                </div>

                <Button 
                  type="primary" 
                  className="w-full bg-emerald-500 hover:!bg-emerald-400 border-none !rounded-md font-bold  mt-2 shadow h-[34px] text-[12px]"
                  onClick={() => handleOpenModal(user)}
                >
                  {t("Дэлгэрэнгүй харах")}
                </Button>
              </div>
            ))}
          </div>

          <Modal
            open={isDetailModalOpen}
            onCancel={() => setIsDetailModalOpen(false)}
            footer={null}
            width={900}
            centered
          >
            <div className="p-4 flex flex-col h-[75vh]">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <Avatar size={64} icon={<UserOutlined />} className="bg-emerald-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedUser?.ner}</h2>
                    <div className="flex gap-4 mt-2 items-center">
                       {(() => {
                         const selTuluv = (selectedUser?.kpiDaalgavarToo > 0) ? selectedUser.tuluv : 'idevhgui';
                         return (
                           <span className={`px-2.5 py-1 rounded-lg text-[12px] font-bold uppercase shadow-sm ${
                              selTuluv === 'shine' ? 'bg-blue-500 text-white' : 
                              selTuluv === 'idevhtei' ? 'bg-emerald-500 text-white' : 
                              selTuluv === 'idevhgui' ? 'bg-red-500 text-white' : 
                              'bg-gray-500 text-white'
                            }`}>
                             {selTuluv === 'shine' ? t('Шинэ') : selTuluv === 'idevhtei' ? t('Идэвхтэй') : selTuluv === 'idevhgui' ? t('Идэвхгүй') : selTuluv}
                           </span>
                         );
                       })()}
                       <span className="text-xs font-bold text-gray-500">{t("Ажлууд")}: {selectedUser?.kpiDaalgavarToo || 0}</span>
                       <span className="text-xs font-bold text-gray-500">{t("Үнэлгээ")}: {selectedUser?.kpiDundaj || "-"}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-xs text-gray-400">{selectedUser?.mail}</div>
                   <div className="text-xs text-gray-400">{Array.isArray(selectedUser?.utas) ? selectedUser.utas[0] : selectedUser?.utas}</div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                {loadingHistory ? (
                  <div className="flex justify-center py-20"><Spin /></div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-4 border-b pb-2 text-slate-800 dark:text-slate-100">{t("Төслүүд")}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clientProjects.map(proj => (
                          <div key={proj._id} className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800">
                            <div className="font-bold">{proj.ner}</div>
                            <div className="text-xs text-gray-500 mt-1">{dayjs(proj.ekhlekhOgnoo).format("YYYY.MM.DD")} - {dayjs(proj.duusakhOgnoo).format("YYYY.MM.DD")}</div>
                            <div className={`text-xs mt-2 font-bold ${
                              proj.tuluv === 'duussan' ? 'text-emerald-500' : 
                              proj.tuluv === 'khiigdej bui' ? 'text-amber-500' : 
                              proj.tuluv === 'shine' ? 'text-blue-500' : 'text-gray-500'
                            }`}>
                              {proj.tuluv === 'duussan' ? t('Дууссан') : 
                               proj.tuluv === 'khiigdej bui' ? t('Хийгдэж буй') : 
                               proj.tuluv === 'shine' ? t('Шинэ') : proj.tuluv}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-4 border-b pb-2 text-slate-800 dark:text-slate-100">{t("Даалгавар")}</h3>
                      <div className="space-y-3">
                        {clientTasks.map(task => (
                          <div key={task._id} className="p-4 border rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-bold">{task.ner}</div>
                              <div className={`text-[12px] font-bold px-2 py-0.5 rounded border ${
                                task.tuluv === 'duussan' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
                                task.tuluv === 'khiigdej bui' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' : 
                                task.tuluv === 'khugatsaa khetersen' ? 'text-red-500 border-red-500/20 bg-red-500/5' :
                                task.tuluv === 'shalga' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' :
                                'text-gray-500 bg-gray-100 dark:bg-gray-800 border-transparent'
                              }`}>
                                {task.tuluv === 'duussan' ? t('Дууссан') : 
                                 task.tuluv === 'khiigdej bui' ? t('Хийгдэж буй') : 
                                 task.tuluv === 'khugatsaa khetersen' ? t('uilchilgee.overdue') :
                                 task.tuluv === 'shalga' ? t('uilchilgee.review') : 
                                 task.tuluv === 'shine' ? t('Шинэ') : task.tuluv}
                              </div>
                            </div>
                            <div className="text-[12px] text-gray-500 font-medium flex items-center gap-2">
                              <span>{dayjs(task.ekhlekhTsag).format("YYYY.MM.DD HH:mm:ss")} - {dayjs(task.duusakhTsag).format("HH:mm:ss")}</span>
                              {formatSpentTime(task) && (
                                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded text-[12px] font-bold">
                                  {t("Зарцуулсан")}: {formatSpentTime(task)}
                                </span>
                              )}
                            </div>
                            <div className="text-xs mt-2 text-gray-600">{task.tailbar}</div>
                            
                            {task.tuluv === 'duussan' && (
                              <div className="mt-4 pt-4 border-t">
                                {task.uilchluulegchOnooson != null ? (
                                  <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 dark:bg-emerald-950 p-2 rounded">
                                     {t("Үнэлгээ")}: {task.uilchluulegchOnooson}/10
                                  </div>
                                ) : ratingTaskId === task._id ? (
                                  <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-100">
                                    <div className="flex justify-between text-xs font-bold">
                                      <span>{t("Оноо")}: {clientScorePoints}</span>
                                      <StarOutlined className="text-amber-500" />
                                    </div>
                                    <input
                                      type="range" min={0} max={10} step={1}
                                      value={clientScorePoints}
                                      onChange={e => setClientScorePoints(Number(e.target.value))}
                                      className="w-full"
                                    />
                                    <Input.TextArea
                                      placeholder={t("Тайлбар...")}
                                      value={clientScoreNote}
                                      onChange={e => setClientScoreNote(e.target.value)}
                                      rows={2}
                                      size="small"
                                    />
                                    <div className="flex gap-2">
                                      <Button size="small" onClick={() => setRatingTaskId(null)}>{t("Цуцлах")}</Button>
                                      <Button size="small" type="primary" loading={savingClientScore} onClick={() => handleSubmitClientScore(task._id)}>{t("Хадгалах")}</Button>
                                    </div>
                                  </div>
                                ) : (
                                  <Button
                                    block size="small" className="text-yellow-500" icon={<StarOutlined />}
                                    onClick={() => { setRatingTaskId(task._id); setClientScorePoints(8); setClientScoreNote(""); }}
                                  >
                                    {t("Үнэлгээ өгөх")}
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button onClick={() => setIsDetailModalOpen(false)}>{t("Хаах")}</Button>
              </div>
            </div>
          </Modal>

          <Modal
            title={editingUser ? t("Үйлчлүүлэгч засах") : t("Үйлчлүүлэгч нэмэх")}
            open={isAddModalOpen}
            onCancel={() => {
              setIsAddModalOpen(false);
              setEditingUser(null);
              form.resetFields();
            }}
            onOk={() => form.submit()}
            okText={t("Хадгалах")}
            cancelText={t("Цуцлах")}
            okButtonProps={{ className: "bg-emerald-500 hover:bg-emerald-400 border-none" }}
          >
            <Form form={form} layout="vertical" onFinish={handleSaveUser}>
              <Form.Item name="ner" label={t("Нэр")} rules={[{ required: true }]}>
                 <Input placeholder={t("Үйлчлүүлэгчийн нэр")} />
              </Form.Item>
              <Form.Item name="register" label={t("Регистр")}>
                 <Input placeholder={t("Регистрийн дугаар")} />
              </Form.Item>
              <Form.Item name="utas" label={t("Утас")}>
                 <Input placeholder={t("Утасны дугаар")} />
              </Form.Item>
              <Form.Item name="mail" label={t("И-мэйл")}>
                 <Input placeholder={t("И-мэйл хаяг")} />
              </Form.Item>
              <Form.Item name="khayag" label={t("Хаяг")}>
                 <Input.TextArea placeholder={t("Хаяг")} rows={2} />
              </Form.Item>
              <Form.Item name="gereeNomer" label={t("Гэрээний дугаар")}>
                 <Input placeholder="GR-..." />
              </Form.Item>
            </Form>
          </Modal>

        </div>
      </div>
    </Admin>
  );
}

export default Uilchluulegch;
