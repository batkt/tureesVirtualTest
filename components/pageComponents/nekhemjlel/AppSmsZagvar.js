import React, { useImperativeHandle } from "react";
import { Form, Input, message, Modal, notification } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";

import ZagvarUusgekh from "components/pageComponents/nekhemjlel/ZagvarUusgekh";

function ZagvarForm({ value, onChange }) {
  return <ZagvarUusgekh value={value} change={onChange} />;
}

function AppSmsZagvar(
  { barilgiinId, destroy, data, token, setWaiting, turul, onRefresh },
  ref
) {
  const [form] = Form.useForm();
  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const method = data?._id ? updateMethod : createMethod;
        const zagvar = form.getFieldsValue();
        zagvar?.ner !== ""
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
      <Form.Item name="nekhemjlekh">
        <ZagvarForm />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(AppSmsZagvar);
