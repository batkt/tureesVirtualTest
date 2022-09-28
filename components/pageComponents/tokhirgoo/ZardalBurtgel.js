import React, { useImperativeHandle, useState } from "react";
import { Form, InputNumber, Select, Input, notification, Switch } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";

function ZardalBurtgel(
  { data, destroy, baiguullagiinId, barilgiinId, token, refresh },
  ref
) {
  const [form] = Form.useForm();

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const ugugdul = form.getFieldsValue();

        const method = ugugdul?._id ? updateMethod : createMethod;
        ugugdul["barilgiinId"] = barilgiinId;
        ugugdul["baiguullagiinId"] = baiguullagiinId;
        method("ashiglaltiinZardluud", token, { ...data, ...ugugdul }).then(
          ({ data }) => {
            if (data === "Amjilttai") {
              notification.success({ message: "Амжилттай хадгаллаа" });
              refresh();
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
      <Form.Item hidden name="_id"></Form.Item>
      <Form.Item label="Нэр" name="ner">
        <Input />
      </Form.Item>
      <Form.Item label="Нэгж" name="turul">
        <Select>
          <Select.Option key="кВт" value="кВт">
            кВт
          </Select.Option>
          <Select.Option key="1м3" value="1м3">
            1м<sup>3</sup>
          </Select.Option>
          <Select.Option key="төг" value="төг">
            төг
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Тариф" name="tariff">
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(ZardalBurtgel);
