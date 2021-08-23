import { Form, Input, Button, DatePicker, InputNumber } from "antd";
import {
  SolutionOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React from "react";
import moment from "moment";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const YurunkhiiMedeele = ({ next, prev, onChange, value }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onChange({ ...value, ...values });
    next();
  };

  const onValuesChange = (values, v) => {
    if (!!values?.gereeniiOgnoo && !!value?.khugatsaa) {
      value.duusakhOgnoo = moment(values.gereeniiOgnoo).add(
        value.khugatsaa,
        "M"
      );
      form.setFieldsValue({ ...value, ...values });
    }
    if (!!value?.gereeniiOgnoo && !!values?.khugatsaa) {
      value.duusakhOgnoo = moment(value.gereeniiOgnoo).add(
        values.khugatsaa,
        "M"
      );
      form.setFieldsValue({ ...value, ...values });
    }
    onChange({ ...value, ...values });
  };

  value.gereeniiOgnoo = moment(value.gereeniiOgnoo)
  value.duusakhOgnoo = moment(value.duusakhOgnoo)
  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
    >
      <Form.Item name="gereeniiOgnoo" label="Гэрээ хийх огноо">
        <DatePicker
          style={{ width: "100%" }}
          allowClear
          placeholder="Гэрээ хийх огноо"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item name="khugatsaa" label="Гэрээний хугацаа">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder="Гэрээний хугацаа"
        />
      </Form.Item>
      <Form.Item
        label="Төлөлт хийх өдөр"
        extra="Төлөлт хийх огноо сар бүрийн / өдөр"
      >
        <Input
          allowClear
          placeholder="Төлөлт хийх огноо сар бүрийн / өдөр"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item
        name="duusakhOgnoo"
        label="Гэрээ дуусах хугацаа"
        extra="Төлөлт хийх огноо сар бүрийн / өдөр"
      >
        <DatePicker
          style={{ width: "100%" }}
          allowClear
          placeholder="Гэрээ дуусах хугацаа"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item
        label="Хэтрэлт тооцох"
        extra="Хугацаа хэтрэвэл төлөлт хийх боломжит хугацаа"
      >
        <Input
          allowClear
          placeholder="Хугацаа хэтрэвэл төлөлт хийх боломжит хугацаа"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item
        label="Төлөлт сануулах"
        extra="Төлөлт сануулах мэдээлэл хугацаа дуусахаас /өдрийн өмнө"
      >
        <Input
          allowClear
          placeholder="Төлөлт сануулах мэдээлэл хугацаа дуусахаас /өдрийн өмнө"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item wrapperCol={{span: 24}} >
        <div className="w-full flex flex-row justify-between">
        <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
          Ерөнхий мэдээлэл
        </Button>
        <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
          Түрээсийн талбай
        </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
