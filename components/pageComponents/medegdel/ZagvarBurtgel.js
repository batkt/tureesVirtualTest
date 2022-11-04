import React, { suseEffect, useEffect, useImperativeHandle } from "react";
import { Form, Input, message, Modal, notification } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";
import ZagvarUusgekh from "./ZagvarUusgekh";
import compareFields from "tools/function/compareFields";

function ZagvarForm({ value, onChange }) {
  return <ZagvarUusgekh value={value} change={onChange} />;
}

function ZagvarBurtgel(
  { barilgiinId, destroy, token, setWaiting, data = {}, turul, onRefresh },
  ref
) {
  const [form] = Form.useForm();

  function garya() {
    const values = form.getFieldsValue();
    if (compareFields(values, data, ["ner", "mail"]))
      Modal.confirm({
        content: `Та хадгалахгүй гарахдаа итгэлтэй байна уу?`,
        okText: "Тийм",
        cancelText: "Үгүй",
        onOk: destroy,
      });
    else destroy();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    form.getFieldInstance("ner").focus();
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const method = data?._id ? updateMethod : createMethod;
        const zagvar = form.getFieldsValue();
        zagvar?.ner !== ""
          ? method("mailiinZagvar", token, {
              barilgiinId,
              ...data,
              ...zagvar,
              turul,
            }).then(({ data }) => {
              if (data === "Amjilttai") {
                setWaiting(false);
                message.success("Амжилттай хадгаллаа");
                onRefresh();
                destroy();
              }
            })
          : notification.warning({ message: "Нэр заавал оруулна уу!" });
      },
      khaaya() {
        destroy();
        setWaiting(false);
      },
    }),
    [form, barilgiinId]
  );

  return (
    <Form autoComplete="off" form={form} initialValues={data}>
      <Form.Item
        name="ner"
        rules={[{ required: true, message: "Нэр заавал оруулна уу!" }]}
      >
        <Input placeholder="Нэр" />
      </Form.Item>
      <Form.Item name="mail">
        <ZagvarForm />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(ZagvarBurtgel);
