import Admin from "components/Admin";
import GuidedTour from "components/GuidedTour";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import fsmApi from "services/fsmApi";
import { useAuth } from "services/auth";
import { message, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { 
  Button, 
  Select, 
  Space,
  Avatar,
  Modal,
  Dropdown,
  Menu
} from "antd";
import { 
  PlusOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  PrinterOutlined,
  CloseOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";



function Uilchluulegch() {
  const { t } = useTranslation();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const tutorialSteps = [
    { targetId: "cust-stats", title: "Статистик", description: "Үйлчлүүлэгчдийн нийт тоо, шинэ бүртгэл болон нийт орлогын мэдээллийг хурдан харах боломжтой." },
    { targetId: "cust-actions", title: "Шүүлтүүр ба Үйлдэл", description: "Үйлчлүүлэгчдийг төрлөөр нь шүүх болон шинээр үйлчлүүлэгч бүртгэх хэсэг." },
    { targetId: "cust-list", title: "Үйлчлүүлэгчдийн жагсаалт", description: "Бүх үйлчлүүлэгчдийн карт хэлбэртэй жагсаалт. Карт бүр дээрх 'Дэлгэрэнгүй' товчоор түүхийг нь харна уу." },
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
      // message.error("Алдаа гарлаа");
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
        // tuluv: editingUser ? editingUser.tuluv : "shine"
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

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const statCards = [
    { title: "Нийт үйлчлүүлэгч", value: users.length.toString() },
    { title: "Шинэ", value: users.filter(u => u.tuluv === 'shine').length.toString() },
    { title: "Нийт ажлууд", value: users.reduce((acc, curr) => acc + (Number(curr.jobs) || 0), 0).toString() },
    { title: "Нийт орлого", value: users.reduce((acc, curr) => acc + (Number(curr.income) || 0), 0).toLocaleString() + "₮" },
    { title: "Дундаж үнэлгээ", value: (users.length > 0 ? (users.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / users.length).toFixed(1) : "0") },
  ];


  return (
    <Admin title="Үйлчлүүлэгч"
      khuudasniiNer="uilchluulegch">
      <div className="col-span-12 flex h-H8HalfRem w-[calc(100%+0.5rem)] text-black overflow-hidden rounded-2xl shadow-2xl relative">
        <div className="flex-1 flex flex-col p-4 overflow-x-hidden overflow-y-auto relative min-w-0">
        
        {/* Stat Cards */}
        <div id="cust-stats" className="hideScroll flex grid w-full grid-cols-1 gap-3 overflow-hidden overflow-x-auto border-solid py-3 sm:grid-cols-6 sm:p-0 md:gap-4 2xl:grid-cols-10 mb-6 shrink-0 px-1 pt-1">
          {statCards.map((card, index) => (
              <div
                key={index}
                className={`group relative w-[70vw] cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-gray-300 dark:hover:shadow-gray-800 sm:col-span-12 sm:w-auto lg:col-span-2 border-2 border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/40`}
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

                <div className="relative h-full rounded-2xl p-3 sm:p-2.5">
                  <div className="flex h-full flex-col justify-between">
                    {/* Top section with data */}
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

                    {/* Bottom accent bar */}
                    <div className="h-0.5 w-9 rounded-full bg-emerald-500 transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Actions Row */}
        <div id="cust-actions" className="flex justify-end items-center shrink-0">
          <div className="flex flex-col gap-1 w-48">
            <Button
            type="primary"
            icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}
            className="text-white bg-emerald-500 hover:!bg-emerald-400 border-none !rounded-lg text-[11px] font-bold shadow-md h-[36px] mt-4"
          >
            Үйлчлүүлэгч нэмэх
          </Button>
          </div>
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

        {/* Customer Grid */}
        <div id="cust-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-2 relative">
          {users.map((user, idx) => (
            <div key={idx} className="bg-white border border-gray-200 dark:bg-gray-900/50 dark:border-[#2d3748]/50 rounded-[18px] p-5 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 flex flex-col gap-4">
              
              {/* Header: Avatar and Name */}
              <div className="flex items-center justify-between gap-3 border-b border-gray-300 dark:border-gray-800 rounded-lg">
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

              {/* Contact Info */}
              
              <div className="grid grid-cols-2 gap-2.5 text-[10.5px] text-gray-600 dark:text-gray-400 font-medium tracking-wide mt-1 ">
                
                <div className="flex items-center gap-2">
                  <MailOutlined className="text-gray-400 shrink-0 text-sm" />
                  <span className="truncate">{user.mail || "мэйл байхгүй"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneOutlined className="text-gray-400 shrink-0 text-sm" />
                  <span className="truncate">{Array.isArray(user.utas) ? user.utas.join(", ") : (user.utas || "утас байхгүй")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EnvironmentOutlined className="text-gray-400 shrink-0 text-sm" />
                  <span className="line-clamp-1 leading-tight">{user.khayag || "хаяг байхгүй"}</span>
                </div>
                
                
              </div>
              
              

              {/* Stats Row */}
              <div className="flex justify-between items-center px-1 mt-4 border-b dark:border-gray-800 rounded-xl border-gray-300 shadow-md">
                <div className="flex flex-col items-center">
                  <span className="text-black dark:text-white font-extrabold text-sm tracking-wide">{user.jobs || "0"}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-[10px] font-semibold mt-1">Ажлууд</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-emerald-400 font-extrabold text-sm tracking-wide">{user.income || "0₮"}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-[10px] font-semibold mt-1">Орлого</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-emerald-400 font-extrabold text-sm tracking-wide">{user.rating || "-"}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-[10px] font-semibold mt-1">Үнэлгээ</span>
                </div>
              </div>

              {/* Last Service */}
              

              {/* Action Button */}
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

        {/* Detail Modal */}
        <Modal
          open={isDetailModalOpen}
          onCancel={() => setIsDetailModalOpen(false)}
          footer={null}
          width={850}
          centered
          className="[&_.ant-modal-content]:!bg-white dark:[&_.ant-modal-content]:!bg-gray-800 [&_.ant-modal-content]:!p-0 [&_.ant-modal-close]:!text-gray-400"
        >
          <div className="p-8 flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div className="flex items-center gap-6">
                <div>
                  <Avatar size="medium" className="h-[32px] w-[32px] bg-gradient-to-tr from-green-300 to-gray-500 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs font-black border border-white dark:border-gray-800 shadow-xl">
                    <UserOutlined className="text-black dark:text-white scale-125 mt-2" />
                  </Avatar>
                </div>
                <div>
                  <h2 className="dark:text-white text-[22px] font-bold tracking-wide">{selectedUser?.ner || "Хоосон"}</h2>
                  <p className="text-gray-400 mt-1 text-[13px] font-medium">• {selectedUser?.jobs || 0} Дууссан ажил</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900/40 rounded-xl p-4 w-full md:w-[400px] shadow-inner shrink-0 leading-tight">
                <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                  <div className="flex flex-col gap-1 w-1/2 border-r border-gray-200">
                    <span className="dark:text-gray-200 text-gray-400 text-[10px] flex items-center gap-1.5"><MailOutlined /> Email</span>
                    <span className="text-gray-800 dark:text-gray-200 text-[11px] font-bold truncate pr-2">{selectedUser?.mail || "мэйл байхгүй"}</span>
                  </div>
                  <div className="flex flex-col gap-1 w-1/2 pl-4">
                    <span className="dark:text-gray-200 text-gray-400 text-[10px] flex items-center gap-1.5"><PhoneOutlined /> Утас</span>
                    <span className="text-gray-800 dark:text-gray-200 text-[11px] font-bold truncate">{Array.isArray(selectedUser?.utas) ? selectedUser.utas[0] : (selectedUser?.utas || "-")}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="dark:text-gray-200 text-gray-400 text-[10px] flex items-center gap-1.5"><EnvironmentOutlined /> Хаяг</span>
                  <span className="text-gray-800 dark:text-gray-200 text-[11px] font-bold truncate">{selectedUser?.khayag || "-"}</span>
                </div>  
              </div>
            </div>

            <div className="w-full h-px bg-gray-500/30 mb-8"></div>

            {/* Timeline entries */}
            <div 
              className="flex flex-col gap-5 pr-4 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
              style={{ maxHeight: '55vh', overflowY: 'auto', overscrollBehavior: 'contain' }}
            >
              {selectedUser?.history?.length > 0 ? (
                selectedUser.history.map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 rounded-[14px] p-5 relative shadow">
                    <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200 font-extrabold text-sm border-b border-gray-300 pb-3">
                       <CalendarOutlined className="text-gray-400 dark:text-gray-200" /> Түүх
                    </div>
                    <div className="relative pl-6 before:content-[''] before:absolute before:left-[5px] before:top-4 before:bottom-0 before:w-[2px] before:bg-gray-100">
                       <div className="absolute left-0 top-1 w-[12px] h-[12px] rounded-full bg-[#df5cf9] shadow-[0_0_0_3px_white]"></div>
                       
                       <div className="flex justify-between items-start">
                         <div>
                           <div className="flex items-center gap-2">
                             <span className="text-gray-800 dark:text-gray-200 font-extrabold text-[13px]">{item.ner || "Үйлчилгээ"}</span>
                             <span className="bg-blue-100 text-blue-500 text-[10px] px-2.5 py-0.5 rounded-full font-bold">{item.tuluv || "хийгдсэн"}</span>
                           </div>
                           <div className="text-gray-500 text-[11px] font-bold mt-1">{item._id}</div>
                         </div>
                         <div className="text-right">
                           <div className="text-gray-800 dark:text-gray-200 font-extrabold text-sm">{item.dun?.toLocaleString()}₮</div>
                         </div>
                       </div>

                       <div className="mt-4 flex flex-col gap-2.5 text-[11px] text-gray-500 font-semibold">
                         <div className="flex items-center gap-2.5"><CalendarOutlined className="text-gray-400" /> {item.ognoo}</div>
                         <div className="flex items-center gap-2.5"><EnvironmentOutlined className="text-gray-400" /> {item.khayag}</div>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                   <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <ClockCircleOutlined className="text-gray-300 text-2xl" />
                   </div>
                   <span className="text-gray-400 text-sm font-medium">Үйлчилгээний түүх одоогоор байхгүй байна</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-3 mt-6 pt-5 rounded-b-xl border-t border-gray-600/30 shrink-0">
              <Button type="primary" icon={<DownloadOutlined />} className="!bg-[#10b981] border-none !text-white hover:!bg-[#059669] !rounded-md font-bold text-[11.5px] h-[36px] flex items-center px-4 shadow">
                Татах
              </Button>
              <Button type="primary" icon={<PrinterOutlined />} className="!bg-[#10b981] border-none !text-white hover:!bg-[#059669] !rounded-md font-bold text-[11.5px] h-[36px] flex items-center px-4 shadow">
                Хэвлэх
              </Button>
              <Button 
                icon={<CloseOutlined />}
                className="!bg-transparent border !border-gray-500 dark:!text-gray-300 dark:hover:!text-white hover:!text-black hover:!border-white !rounded-md font-bold text-[11.5px] h-[36px] flex items-center px-4 relative z-10 hover:cursor-pointer transition-colors"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Хаах
              </Button>
            </div>
          </div>
        </Modal>

        {/* Help Button */}
        <div className="fixed bottom-8 right-8 z-[100]">
           <Button
             type="primary"
             shape="circle"
             icon={<QuestionCircleOutlined />}
             className="w-12 h-12 bg-emerald-500 hover:bg-emerald-400 border-none shadow-xl flex items-center justify-center text-xl"
             onClick={() => setIsTutorialOpen(true)}
           />
        </div>

        <GuidedTour 
          steps={tutorialSteps} 
          isOpen={isTutorialOpen} 
          onClose={() => setIsTutorialOpen(false)} 
        />
      </div>
      </div>
    </Admin>
  );
}

export default Uilchluulegch;
