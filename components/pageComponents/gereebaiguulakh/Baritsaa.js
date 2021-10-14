import { Form, Select, Button, InputNumber } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const YurunkhiiMedeele = ({ next, prev, onChange, value }) => {
 

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      onValuesChange={(values) => onChange({ ...value, ...values })}
      initialValues={value}
    >
      <Form.Item name="baritsaaAvakhDun" label="Барьцаа дүн">
        <InputNumber
        placeholder="Барьцаа дүн"
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item
        name="baritsaaBairshuulakhKhugatsaa"
        label="Хугацаа"
        extra="Барьцаа байршуулалтын хугацаа"
      >
        <InputNumber
          placeholder="Барьцаа байршуулалтын хугацаа"
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item wrapperCol={{span: 24}}>
      <div className="w-full flex flex-row justify-between">
        <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
          Түрээсийн талбай
        </Button>
        <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />} onClick={()=>next()}>
          Төлбөр тооцоо
        </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
