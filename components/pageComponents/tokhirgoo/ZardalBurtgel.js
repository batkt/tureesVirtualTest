import React, { useImperativeHandle, useState } from "react";
import { Form, InputNumber, Select, Input, notification } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";

function ZardalBurtgel(
  { data, destroy, baiguullagiinId, barilgiinId, token,togtmolEsekh, refresh },
  ref
) {
  const [form] = Form.useForm();
  const [hideTariff,setHideTariff] = useState(false)

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
      autoComplete={"off"}
      initialValues={data}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item hidden name="_id"></Form.Item>
      <Form.Item label="Нэр" name="ner">
        <Input />
      </Form.Item>
      <Form.Item label="Нэгж" name="turul">
        {togtmolEsekh ? <Select onChange={(v)=> { 
            setHideTariff(v === 'duriin')
          }}>
          <Select.Option key="Тогтмол" value="Тогтмол">
            Тогтмол
          </Select.Option>
          <Select.Option key="Дурын" value="Дурын">
            Дурын
          </Select.Option>
        </Select> : <Select>
          <Select.Option key="кВт" value="кВт">
            кВт
          </Select.Option>
          <Select.Option key="1м3" value="1м3">
            1м<sup>3</sup>
          </Select.Option>
          <Select.Option key="1м2" value="1м2">
            1м<sup>2</sup>
          </Select.Option>
        </Select>}
      </Form.Item>
     <Form.Item label="Тариф" name="tariff" hidden={hideTariff}> 
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(ZardalBurtgel);
