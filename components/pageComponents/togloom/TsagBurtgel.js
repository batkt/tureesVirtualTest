import React, { useImperativeHandle, useState } from "react";
import { Form, Input, message, Select, TimePicker, InputNumber } from "antd";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import uilchilgee from "services/uilchilgee";
import { t } from "i18next";

function TsagBurtgel(
  { data, barilgiinId, token, destroy, onRefresh, mashinBurtgekhButtonId },
  ref
) {
  const [form] = Form.useForm();

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const data = form.getFieldsValue();
        data.barilgiinId = barilgiinId;
        const method = data?._id ? updateMethod : createMethod;
        method("togloomiinTuv", token, data).then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(t("Амжилттай хадгаллаа"));
            onRefresh && onRefresh();
            destroy();
          }
        });
      },
      khaaya() {
        destroy();
      },
    }),
    [form, {}]
  );

  return (
    <Form
      form={form}
      initialValues={data}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item name="_id" noStyle />
      <Form.Item label="Овог" name="ovog">
        <Input placeholder="Овог" autoComplete="off" />
      </Form.Item>
      <Form.Item label="Нэр" name="ner">
        <Input placeholder="Нэр" autoComplete="off" />
      </Form.Item>
      <Form.Item label="Хүйс" name="khuis">
        <Select placeholder="Эрэгтэй">
          {["Эрэгтэй", "Эмэгтэй"].map((a) => (
            <Select.Option value={a}>{t(a)}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Нас" name="nas">
        <InputNumber placeholder="Нас" min="1" max="12" />
      </Form.Item>
      <Form.Item label="Утас" name="utas">
        <Input placeholder="Утас" autoComplete="off" />
      </Form.Item>
      <Form.Item label="Тоглох цаг /Мин/" name="khugatsaa">
        <Input placeholder="Тоглох цаг /Мин/ " autoComplete="off" />
      </Form.Item>
      <Form.Item label="Эхлэх цаг" name="ekhlekhOgnoo">
        <Input placeholder="Эхлэх цаг /Мин/ " autoComplete="off" />
      </Form.Item>
      <Form.Item label="Дуусах цаг" name="duusakhOgnoo">
        <Input placeholder="Дуусах цаг /Мин/ " autoComplete="off" />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(TsagBurtgel);
