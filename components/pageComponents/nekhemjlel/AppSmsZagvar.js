import React, { useEffect, useImperativeHandle, useState } from "react";
import { Form, Input, message, Modal, notification } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";
import ZagvarUusgekh from "./ZagvarUusgekh";
import compareFields from "tools/function/compareFields";

function ZagvarForm({ value, onChange }) {
  return <ZagvarUusgekh value={value} onTextChange={onChange} />;
}

function ZagvarBurtgel(
  { barilgiinId, destroy, token, setWaiting, data, turul, onRefresh },
  ref
) {
  const [form] = Form.useForm();

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const method = data?._id ? updateMethod : createMethod;
        const zagvar = form.getFieldsValue();
        zagvar?.ner !== undefined
          ? method("nekhemjlekhiinZagvar", token, {
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
        setWaiting(false);
        destroy();
      },
    }),
    [form, barilgiinId]
  );
  function garya() {
    Modal.confirm({
      content: `Та гарахдаа итгэлтэй байна уу?`,
      okText: "Тийм",
      cancelText: "Үгүй",
      onOk: destroy,
    });
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <>
      <Form autoComplete={"off"} form={form} initialValues={data}>
        <Form.Item name="ner">
          <Input placeholder="Нэр" />
        </Form.Item>
        <Form.Item name="nekhemjlekh">
          <ZagvarForm />
        </Form.Item>
      </Form>
    </>
  );
}

export default React.forwardRef(ZagvarBurtgel);
