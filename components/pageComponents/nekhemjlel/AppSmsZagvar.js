import React, { useImperativeHandle } from "react";
import { Form, Input, message, Modal, notification } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";

import ZagvarUusgekh from "components/pageComponents/nekhemjlel/ZagvarUusgekh";
import { t } from "i18next";

function ZagvarForm({ ashiglaltiinZardal, value, onChange }) {
  return <ZagvarUusgekh value={value} ashiglaltiinZardal={ashiglaltiinZardal} change={onChange}/>;
}

function AppSmsZagvar(
  { barilgiinId, ashiglaltiinZardal, destroy, data, token, setWaiting, turul, onRefresh },
  ref
) {
  const [form] = Form.useForm();
 
  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const zagvar = form.getFieldsValue();
        if (!!zagvar.ner) {
          const method = data?._id ? updateMethod : createMethod;
          method("nekhemjlekhiinZagvar", token, {
            barilgiinId,
            ...data,
            ...zagvar,
            turul,
          }).then(({ data }) => {
            if (data === "Amjilttai") {
              setWaiting(false);
              message.success(t("Амжилттай хадгаллаа"));
              onRefresh();
              destroy();
            }
          });
        } else notification.warning({ message: t("Нэр заавал оруулна уу!") });
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
        rules={[{ required: true, message: t("Нэр заавал оруулна уу!") }]}
      >
        <Input placeholder={t("Нэр")} />
      </Form.Item>
      <Form.Item name="nekhemjlekh">
        <ZagvarForm ashiglaltiinZardal={ashiglaltiinZardal} />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(AppSmsZagvar);
