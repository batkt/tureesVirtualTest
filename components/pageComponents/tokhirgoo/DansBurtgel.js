import React, { useImperativeHandle, useState } from "react";
import { Form, InputNumber, Select, Input, notification, Switch } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";

function DansBurtgel(
  { data, destroy, baiguullagiinId, barilgiinId, token, dansMutate },
  ref
) {
  const [form] = Form.useForm();
  const [bank, setBank] = useState(data?.bank);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const ugugdul = form.getFieldsValue();

        const method = ugugdul?._id ? updateMethod : createMethod;
        ugugdul["barilgiinId"] = barilgiinId;
        ugugdul["baiguullagiinId"] = baiguullagiinId;

        method("dans", token, { ...data, ...ugugdul }).then(({ data }) => {
          if (data === "Amjilttai") {
            notification.success({ message: "Амжилттай хадгаллаа" });
            dansMutate();
            destroy();
          }
        });
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
      autoComplete={"off"}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item hidden name="_id"></Form.Item>
      <Form.Item label="Банкны нэр" name="bank">
        <Select onSelect={setBank}>
          <Select.Option key="khanbank" value="khanbank">
            Хаан банк
          </Select.Option>
          <Select.Option key="tdb" value="tdb">
            Худалдаа хөгжилийн банк
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Дансны дугаар" name="dugaar">
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Дансны нэр" name="dansniiNer">
        <Input />
      </Form.Item>
      <Form.Item label="Валют" name="valyut">
        <Select>
          <Select.Option key="MNT" value="MNT">
            MNT
          </Select.Option>
          <Select.Option key="USD" value="USD">
            USD
          </Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(DansBurtgel);
