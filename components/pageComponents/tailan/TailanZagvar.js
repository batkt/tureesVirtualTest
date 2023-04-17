import React, { useImperativeHandle } from "react";
import { Form, Input, notification } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";
import { t } from "i18next";

function TailanZagvar(
  { data, destroy, baiguullagiinId, barilgiinId, token, refresh, setTable, setSelectValue },
  ref
) {
  const [form] = Form.useForm();

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const ugugdul = form.getFieldsValue();
        const method = data?._id ? updateMethod : createMethod;
        ugugdul["barilgiinId"] = barilgiinId;
        ugugdul["baiguullagiinId"] = baiguullagiinId;

        method("tailangiinZagvar", token, { ...data, ...ugugdul }).then(
          ({ data }) => {
            if (data === "Amjilttai") {
              notification.success({
                description: t("Амжилттай хадгаллаа"),
                message: "Мэдэгдэл",
              });
              refresh();
              setTable({});
              setSelectValue(null);
              destroy();
            }
          }
        );
      },
      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  return (
    <Form
      form={form}
      initialValues={data}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="Нэр" name="ner">
        <Input autoComplete="off"/>
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(TailanZagvar);
