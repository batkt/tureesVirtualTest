import React, { useEffect, useImperativeHandle, useCallback } from "react";
import { Form, Input, message, Modal } from "antd";
import { toast } from "sonner";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";
import ZagvarUusgekh from "./ZagvarUusgekh";
import compareFields from "tools/function/compareFields";
import { t } from "i18next";

function ZagvarForm({ value, onChange }) {
  return (
    <ZagvarUusgekh
      value={value}
      change={onChange}
      zogsoolEsekh={false}
      height={400}
    />
  );
}

function ZagvarBurtgel(
  { barilgiinId, onClose, token, setWaiting, data = {}, turul, onRefresh },
  ref
) {
  const [form] = Form.useForm();

  const garya = useCallback(() => {
    const values = form.getFieldsValue();
    if (compareFields(values, data, ["ner", "mail"]))
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: onClose,
      });
    else onClose();
  }, [form, data, onClose]);

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    form.getFieldInstance("ner")?.focus();
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [garya, form]);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const zagvar = form.getFieldsValue();

        if (!zagvar.ner || zagvar.ner.trim() === "") {
          toast.warning(t("Гарчиг заавал оруулна уу!"));
          setWaiting(false);
          return;
        }

        const stripHtml = (html) => {
          const tmp = document.createElement("DIV");
          tmp.innerHTML = html;
          return tmp.textContent || tmp.innerText || "";
        };

        const textContent = stripHtml(zagvar.mail || "");

        if (!zagvar.mail || textContent.trim() === "") {
          toast.warning(t("Агуулга заавал оруулна уу!"));
          setWaiting(false);
          return;
        }

        const method = data?._id ? updateMethod : createMethod;
        method("mailiinZagvar", token, {
          barilgiinId,
          ...data,
          ...zagvar,
          turul,
        })
          .then(({ data }) => {
            if (data === "Amjilttai") {
              setWaiting(false);
              toast.success(t("Амжилттай хадгаллаа"));
              onRefresh();
              onClose();
            }
          })
          .catch(() => {
            setWaiting(false);
          });
      },
      khaaya() {
        onClose();
        setWaiting(false);
      },
      getFormData() {
        return form.getFieldsValue();
      },
    }),
    [form, barilgiinId, data, token, turul, onClose, setWaiting, onRefresh]
  );

  return (
    <Form autoComplete="off" form={form} initialValues={data}>
      <Form.Item name="ner">
        <Input placeholder={t("Нэр")} />
      </Form.Item>
      <Form.Item name="mail">
        <ZagvarForm />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(ZagvarBurtgel);
