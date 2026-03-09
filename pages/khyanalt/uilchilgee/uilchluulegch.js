import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import fsmApi from "services/fsmApi";
import { useAuth } from "services/auth";
import { message, Form, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
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
  QuestionCircleOutlined
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
    { targetId: "cust-search-filter", title: "Хайлт ба Шүүлтүүр", description: "Үйлчлүүлэгчдийг нэр, утсаар хайх болон төрөл болон төлөвөөр нь шүүх хэсэг." },
    { targetId: "cust-add-btn", title: "Үйлчлүүлэгч бүртгэх", description: "Шинэ үйлчлүүлэгч системд бүртгэх товч." },
    { targetId: "cust-list", title: "Үйлчлүүлэгчдийн жагсаалт", description: "Бүх үйлчлүүлэгчдийн карт жагсаалт. Карт бүр дээрх 'Дэлгэрэнгүй харах' товчоор түүхийг нь харна уу." },
  ];
  
  const { token, barilgiinId, ajiltan } = useAuth();
  const baiguullagiinId = ajiltan?.baiguullagiinId;
  const api = useMemo(() => fsmApi.withAuth(token), [token]);

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
    if (!barilgiinId) { message.warning("Барилгын мэдээлэл байхгүй байна"); return; }
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
        message.success(`Үйлчлүүлэгч амжилттай ${editingUser ? 'шинэчлэгдлээ' : 'нэмэгдлээ'}`);
        await fetchUsers();
        setIsAddModalOpen(false);
        setEditingUser(null);
        form.resetFields();
      }
    } catch (err) {
      message.error(err?.response?.data?.message || `Үйлчлүүлэгч ${editingUser ? 'шинэчлэхэд' : 'нэмэхэд'} алдаа гарлаа`);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await api.delete(`/uilchluulegch/${id}`);
      if (res.data?.success || res.status === 200) {
        message.success("Үйлчлүүлэгч амжилттай устгагдлаа");
        await fetchUsers();
      }
    } catch (err) {
      message.error(err?.response?.data?.message || "Үйлчлүүлэгч устгахад алдаа гарлаа");
    }
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
        message.success("Үнэлгээ амжилттай хадгалагдлаа");
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
      message.error(err?.response?.data?.message || "Оноо хадгалахад алдаа гарлаа");
    } finally {
      setSavingClientScore(false);
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
    fetchUserHistoryData(user._id);
  };

  const statCards = [
    { title: "Нийт үйлчлүүлэгч", value: users.length.toString() },
    { title: "Шинэ", value: users.filter(u => u.tuluv === 'shine').length.toString() },
    { title: "Нийт ажлууд", value: users.reduce((acc, curr) => acc + (Number(curr.kpiDaalgavarToo) || 0), 0).toString() },
    { title: "Дундаж үнэлгээ", value: (users.length > 0 ? (users.reduce((acc, curr) => acc + (Number(curr.kpiDundaj) || 0), 0) / users.length).toFixed(1) : "0") },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = !searchText || 
        user.ner?.toLowerCase().includes(searchText.toLowerCase()) || 
        user.utas?.some(u => u.includes(searchText)) ||
        user.mail?.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = filterStatus === "all" || user.tuluv === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [users, searchText, filterStatus]);

  return (
    <Admin title="Үйлчлүүлэгч" khuudasniiNer="uilchluulegch">
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
                        <div className="text-[10px] xl:text-sm font-medium text-emerald-600 transition-colors duration-300 dark:text-emerald-400">
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
               
               
            </div>
            
            <div id="cust-add-btn" className="shrink-0 w-full md:w-auto">
              <Button
                type="primary"
                icon={<PlusOutlined />} 
                onClick={() => setIsAddModalOpen(true)}
                className="text-white bg-emerald-500 hover:!bg-emerald-400 border-none !rounded-xl text-[12px] font-bold shadow-lg shadow-emerald-500/20 h-[40px] px-6 w-full md:w-auto"
              >
                Үйлчлүүлэгч нэмэх
              </Button>
              
            </div>
            <Select
                 placeholder="Төлөв"
                 value={filterStatus}
                 onChange={(val) => setFilterStatus(val)}
                 className="h-10 w-32 [&>.ant-select-selector]:!h-10 [&>.ant-select-selector]:!rounded-xl [&>.ant-select-selector]:!flex [&>.ant-select-selector]:!items-center"
                 options={[
                   { label: "Бүгд", value: "all" },
                   { label: "Шинэ", value: "shine" },
                   { label: "Идэвхтэй", value: "idevhtei" },
                 ]}
               />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-2 relative">
            {filteredUsers.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="text-gray-400 font-medium tracking-wide">
                  Үр дүн олдсонгүй
                </div>
              </div>
            )}
            {filteredUsers.map((user, idx) => (
              <div key={user._id} id={idx === 0 ? "cust-list" : undefined} className="bg-white border border-gray-200 dark:bg-gray-900/50 dark:border-[#2d3748]/50 rounded-[18px] p-5 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3 rounded-lg">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar size="medium" className="bg-gradient-to-tr from-green-300 to-gray-500 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-black border border-white dark:border-gray-800 shadow-xl">
                      <UserOutlined className="text-black dark:text-white mt-2 scale-125" />
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-black dark:text-gray-200 font-extrabold text-[13px] tracking-wide truncate">{user.ner}</span>
                      <span className="text-gray-500 text-[10px] dark:text-gray-400 font-medium tracking-wide">Гэрээний дугаар: {user.gereeNomer || "-"}</span>              
                    </div>
                  </div>
                  <Dropdown
                     menu={{
                       items: [
                         { key: '1', label: 'Засах', icon: <EditOutlined className="text-blue-500" />, onClick: () => openEditModal(user) },
                         { key: '2', label: 'Устгах', icon: <DeleteOutlined className="text-red-500" />, danger: true, onClick: () => {
                           Modal.confirm({
                             title: 'Үйлчлүүлэгч устгах',
                             content: 'Та энэ үйлчлүүлэгчийг устгахдаа итгэлтэй байна уу?',
                             okText: 'Устгах',
                             cancelText: 'Цуцлах',
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

                <div className="grid grid-cols-2 gap-2.5 text-[10.5px] text-gray-600 dark:text-gray-400 font-medium tracking-wide mt-1 ">
                  <div className="flex items-center gap-2">
                    <MailOutlined className="text-gray-400 shrink-0 text-sm" />
                    <span className="truncate">{user.mail || "мэйл байхгүй"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneOutlined className="text-gray-400 shrink-0 text-sm" />
                    <span className="truncate">{Array.isArray(user.utas) ? user.utas[0] : (user.utas || "утас байхгүй")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnvironmentOutlined className="text-gray-400 shrink-0 text-sm" />
                    <span className="line-clamp-1 leading-tight">{user.khayag || "хаяг байхгүй"}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center px-10 mt-2 border-b dark:border-gray-800 rounded-xl border-gray-300 shadow-md">
                  <div className="flex flex-col items-center">
                    <span className="text-black dark:text-white font-extrabold text-sm tracking-wide">{user.kpiDaalgavarToo || "0"}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] font-semibold mt-1">Ажлууд</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-emerald-400 font-extrabold text-sm tracking-wide">{user.kpiDundaj || "-"}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] font-semibold mt-1">Үнэлгээ</span>
                  </div>
                </div>

                <Button 
                  type="primary" 
                  className="w-full bg-emerald-500 hover:!bg-emerald-400 border-none !rounded-md font-extrabold tracking-wide mt-2 shadow h-[34px] text-[11px]"
                  onClick={() => handleOpenModal(user)}
                >
                  Дэлгэрэнгүй харах
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
                    <h2 className="text-2xl font-bold">{selectedUser?.ner}</h2>
                    <div className="flex gap-2 mt-1">
                       <span className="text-xs text-gray-400">Ажлууд: {selectedUser?.kpiDaalgavarToo || 0}</span>
                       <span className="text-xs text-gray-400">Үнэлгээ: {selectedUser?.kpiDundaj || "-"}</span>
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
                      <h3 className="text-lg font-bold mb-4 border-b pb-2">Төслүүд</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clientProjects.map(proj => (
                          <div key={proj._id} className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800">
                            <div className="font-bold">{proj.ner}</div>
                            <div className="text-xs text-gray-500 mt-1">{dayjs(proj.ekhlekhOgnoo).format("YYYY.MM.DD")} - {dayjs(proj.duusakhOgnoo).format("YYYY.MM.DD")}</div>
                            <div className="text-xs mt-2 text-emerald-500">{proj.tuluv}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-4 border-b pb-2">Ажлууд</h3>
                      <div className="space-y-3">
                        {clientTasks.map(task => (
                          <div key={task._id} className="p-4 border rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-bold">{task.ner}</div>
                              <div className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{task.tuluv}</div>
                            </div>
                            <div className="text-xs text-gray-500">{dayjs(task.ekhlekhTsag).format("YYYY.MM.DD HH:mm")}</div>
                            <div className="text-xs mt-2 text-gray-600">{task.tailbar}</div>
                            
                            {task.tuluv === 'duussan' && (
                              <div className="mt-4 pt-4 border-t">
                                {task.uilchluulegchOnooson != null ? (
                                  <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 dark:bg-emerald-950 p-2 rounded">
                                     Үнэлгээ: {task.uilchluulegchOnooson}/10
                                  </div>
                                ) : ratingTaskId === task._id ? (
                                  <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-100">
                                    <div className="flex justify-between text-xs font-bold">
                                      <span>Оноо: {clientScorePoints}</span>
                                      <StarOutlined className="text-amber-500" />
                                    </div>
                                    <input
                                      type="range" min={0} max={10} step={1}
                                      value={clientScorePoints}
                                      onChange={e => setClientScorePoints(Number(e.target.value))}
                                      className="w-full"
                                    />
                                    <Input.TextArea
                                      placeholder="Тайлбар..."
                                      value={clientScoreNote}
                                      onChange={e => setClientScoreNote(e.target.value)}
                                      rows={2}
                                      size="small"
                                    />
                                    <div className="flex gap-2">
                                      <Button size="small" onClick={() => setRatingTaskId(null)}>Цуцлах</Button>
                                      <Button size="small" type="primary" loading={savingClientScore} onClick={() => handleSubmitClientScore(task._id)}>Хадгалах</Button>
                                    </div>
                                  </div>
                                ) : (
                                  <Button
                                    block size="small" icon={<StarOutlined />}
                                    onClick={() => { setRatingTaskId(task._id); setClientScorePoints(8); setClientScoreNote(""); }}
                                  >
                                    Үнэлгээ өгөх
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
                <Button onClick={() => setIsDetailModalOpen(false)}>Хаах</Button>
              </div>
            </div>
          </Modal>

          <Modal
            title={editingUser ? "Үйлчлүүлэгч засах" : "Үйлчлүүлэгч нэмэх"}
            open={isAddModalOpen}
            onCancel={() => {
              setIsAddModalOpen(false);
              setEditingUser(null);
              form.resetFields();
            }}
            onOk={() => form.submit()}
            okText="Хадгалах"
            cancelText="Цуцлах"
            okButtonProps={{ className: "bg-emerald-500 hover:bg-emerald-400 border-none" }}
          >
            <Form form={form} layout="vertical" onFinish={handleSaveUser}>
              <Form.Item name="ner" label="Нэр" rules={[{ required: true }]}>
                 <Input placeholder="Үйлчлүүлэгчийн нэр" />
              </Form.Item>
              <Form.Item name="register" label="Регистр">
                 <Input placeholder="Регистрийн дугаар" />
              </Form.Item>
              <Form.Item name="utas" label="Утас">
                 <Input placeholder="Утасны дугаар" />
              </Form.Item>
              <Form.Item name="mail" label="И-мэйл">
                 <Input placeholder="И-мэйл хаяг" />
              </Form.Item>
              <Form.Item name="khayag" label="Хаяг">
                 <Input.TextArea placeholder="Хаяг" rows={2} />
              </Form.Item>
              <Form.Item name="gereeNomer" label="Гэрээний дугаар">
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
