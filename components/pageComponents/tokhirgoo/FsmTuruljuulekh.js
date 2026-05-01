"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Input, Popconfirm, Form, notification, Spin, Tag } from "antd";
import DraggableModal from "components/DraggableModal";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import fsmApi, { FSM_BASE_URL_ZEV as FSM_BASE_URL } from "services/fsmApi";
import { useAuth } from "services/auth";
import uilchilgee from "services/uilchilgee";

 

function FsmTuruljuulekh({ baiguullaga, baiguullagaMutate }) {
  const { t } = useTranslation();
  const { token, barilgiinId, ajiltan } = useAuth();
  const baiguullagiinId = ajiltan?.baiguullagiinId;
  const api = useMemo(() => fsmApi.withAuth(token, FSM_BASE_URL), [token]);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchCategories = useCallback(async () => {
    if (!baiguullagiinId) return;
    try {
      const [turulRes, projRes] = await Promise.all([
        api.get("/fsm-turuls", { params: { baiguullagiinId, barilgiinId } }),
        api.get("/projects", { params: { baiguullagiinId, barilgiinId } })
      ]);
      const turuls = turulRes.data?.data || [];
      const projects = projRes.data?.data || [];
      
      const formatted = turuls.map(t => {
        const count = projects.filter(p => (p.folder || p.turul) === t.ner).length;
        return { ...t, projectCount: count };
      });
      setCategories(formatted);
    } catch (err) {
      console.error(err);
    }
  }, [api, baiguullagiinId, barilgiinId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (editingItem) {
        await api.put(`/fsm-turuls/${editingItem._id}`, { ner: values.ner });
        
        // Also update existing projects
        api.get("/projects", { params: { baiguullagiinId, barilgiinId } }).then(res => {
           const data = res.data?.data || [];
           const matching = data.filter(p => (p.folder || p.turul) === editingItem.ner);
           matching.forEach(proj => {
             api.put(`/projects/${proj._id}`, { folder: values.ner });
           });
        });
        notification.success({ message: t("Амжилттай засагдлаа") });
      } else {
        await api.post("/fsm-turuls", { ner: values.ner, baiguullagiinId, barilgiinId });
        notification.success({ message: t("Төрөл амжилттай нэмэгдлээ") });
      }

      fetchCategories();
      setModalVisible(false);
      setEditingItem(null);
      form.resetFields();
    } catch (err) {
      notification.error({
        message: t("Алдаа"),
        description: err?.response?.data?.message || err.message || t("Хадгалахад алдаа гарлаа"),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    try {
      await api.delete(`/fsm-turuls/${cat._id}`);

      // Also remove folder from projects
      api.get("/projects", { params: { baiguullagiinId, barilgiinId } }).then(res => {
         const data = res.data?.data || [];
         const matching = data.filter(p => (p.folder || p.turul) === cat.ner);
         matching.forEach(proj => {
           api.put(`/projects/${proj._id}`, { folder: "" });
         });
      });

      notification.success({ message: t("Төрөл амжилттай устгагдлаа") });
      fetchCategories();
    } catch (err) {
      notification.error({
        message: t("Алдаа"),
        description: t("Устгахад алдаа гарлаа"),
      });
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue({ ner: item.ner });
    setModalVisible(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  return (
    <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
      <div className="box mt-5 lg:mt-0">
        <div className="dark:border-dark-5 flex items-center justify-between border-b border-gray-200 px-5 pb-2 pt-5">
          <div className="flex items-center gap-2 text-base font-medium dark:text-gray-200">
            <SettingOutlined className="text-emerald-500" />
            {t("FSM Төрөлжүүлэх")}
          </div>
          <Button type="primary" onClick={openCreate} icon={<PlusOutlined />}>
            {t("Нэмэх")}
          </Button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spin />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <SettingOutlined className="text-3xl opacity-30 mb-2 block" />
              <p className="text-sm">{t("Төрөл бүртгэгдээгүй байна")}</p>
              <p className="text-xs text-gray-400 mt-1">
                {t("Төслүүдээ төрөлжүүлэхийн тулд шинэ төрөл нэмнэ үү")}
              </p>
            </div>
          ) : (
            categories.map((cat, i) => (
              <div
                key={cat.ner}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group bg-white dark:bg-gray-800 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                      {cat.ner}
                    </div>
                    
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined className="text-blue-500" />}
                    onClick={() => openEdit(cat)}
                  />
                  <Popconfirm
                    title={t("Устгахдаа итгэлтэй байна уу?")}
                    okText={t("Тийм")}
                    cancelText={t("Үгүй")}
                    onConfirm={() => handleDelete(cat)}
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined className="text-red-500" />}
                    />
                  </Popconfirm>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <DraggableModal
        title={
          <div className="flex items-center gap-3 py-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shadow-sm">
              <SettingOutlined className="text-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-gray-800 dark:text-gray-100 leading-tight">
                {editingItem ? t("Төрөл засах") : t("Шинэ төрөл нэмэх")}
              </span>
              
            </div>
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
        centered
        width={440}
        className="premium-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <div className="rounded-2xl bg-gray-50/50  border-gray-100 dark:bg-gray-900/40 dark:border-gray-800">
            <Form.Item
              name="ner"
              label={
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {t("Төрлийн нэр")}
                  </span>
                  <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                    {t("Заавал")}
                  </span>
                </div>
              }
              rules={[
                { required: true, message: t("Төрлийн нэрийг оруулна уу") },
              ]}
              className="!mb-0"
            >
              <Input
                placeholder={t("Жишээ нь: Цэвэрлэгээ, Засвар")}
                className="h-12 rounded-xl border-gray-200 bg-white shadow-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </Form.Item>
            <div className="mt-3 flex items-center gap-2 pl-1">
              <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-medium text-gray-400 italic">
                {t("* Даалгавруудыг ангилахад ашиглагдана")}
              </span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 px-1">
            <Button
              className="h-11 rounded-xl border-gray-100 px-8 font-bold text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={() => {
                setModalVisible(false);
                setEditingItem(null);
                form.resetFields();
              }}
            >
              {t("Болих")}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              className="group h-11 rounded-xl bg-emerald-500 px-10 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <span>{editingItem ? t("Хадгалах") : t("Нэмэх")}</span>
                
              </div>
            </Button>
          </div>
        </Form>
      </DraggableModal>
    </div>
  );
}

export default FsmTuruljuulekh;
