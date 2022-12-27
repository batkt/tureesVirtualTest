import React, { useImperativeHandle, useState } from "react";
import { Form, Input, message } from "antd";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import uilchilgee from "services/uilchilgee";

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
        data.ezemshigchiinTalbainDugaar = geree.talbainDugaar;
        data.gereeniiDugaar = geree.gereeniiDugaar;
        const method = data?._id ? updateMethod : createMethod;
        method("mashin", token, data).then(({ data }) => {
          if (data === "Amjilttai") {
            message.success("Амжилттай хадгаллаа");
            onRefresh && onRefresh();
            destroy();
          }
        });
      },
      khaaya() {
        destroy();
      },
    }),
    [form, geree]
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
      <Form.Item label="Нэр" name="ovog">
        <Input placeholder="Нэр" autoComplete="off" />
      </Form.Item>
      <Form.Item label="Хүйс" name="ovog">
        <Input placeholder="Хүйс" autoComplete="off" />
      </Form.Item>
      <Form.Item label="Нас" name="ovog">
        <Input placeholder="Нас" autoComplete="off" />
      </Form.Item>
      <Form.Item label="Утас" name="ovog">
        <Input placeholder="Утас" autoComplete="off" />
      </Form.Item>
      <Form.Item label="Тоглох цаг /Мин/" name="ovog">
        <Input placeholder="Тоглох цаг /Мин/ " autoComplete="off" />
      </Form.Item>
      <Form.Item label="Утас" name="ovog">
        <Input placeholder="Утас" autoComplete="off" />
      </Form.Item>
      <Form.Item label="Харгалзагч" name="ovog">
        <Input placeholder="Харгалзагч" autoComplete="off" />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(TsagBurtgel);
