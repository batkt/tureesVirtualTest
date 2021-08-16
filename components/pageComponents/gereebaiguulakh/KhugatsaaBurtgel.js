import { Form, Input, Button, DatePicker, InputNumber } from "antd";
import {
  SolutionOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React from "react";

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};

const YurunkhiiMedeele = ({ next, prev, onChange, value }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onChange({ ...value, ...values });
    next();
  };

  const onValuesChange = (values) => {
    if (!!values?.gereeniiOgnoo && !!values?.khugatsaa) {
      values.duusakhOgnoo = moment(values.gereeniiOgnoo).add(
        values.khugatsaa,
        "M"
      );
      form.setFieldsValue(values);
    }
    onChange({ ...value, ...values });
  };

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
    >
      <Form.Item name="gereeniiOgnoo">
        <DatePicker
          style={{ width: "100%" }}
          allowClear
          placeholder="Гэрээ хийх огноо"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item name="khugatsaa">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder="Гэрээний хугацаа"
        />
      </Form.Item>
      <Form.Item name="khungulukhKhugatsaa">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder="Хөнгөлөх хугацаа"
        />
      </Form.Item>
      <Form.Item>
        <Input
          allowClear
          placeholder="Төлөлт хийх огноо сар бүрийн / өдөр"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item name="duusakhOgnoo">
        <DatePicker
          style={{ width: "100%" }}
          allowClear
          placeholder="Гэрээ дуусах хугацаа"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Input
          allowClear
          placeholder="Хугацаа хэтрэвэл төлөлт хийх боломжит хугацаа"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Input
          allowClear
          placeholder="Төлөлт сануулах мэдээлэл хугацаа дуусахаас /өдрийн өмнө"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item noStyle className="w-full flex flex-row justify-between">
        <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
          Ерөнхий мэдээлэл
        </Button>
        <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
          Түрээсийн талбай
        </Button>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
