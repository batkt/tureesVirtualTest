import { Form, Button, DatePicker, InputNumber, Select } from "antd";
import {
  SolutionOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React, { useEffect } from "react";
import moment from "moment";
import Aos from "aos";
import _ from "lodash";

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
    if (!!values?.duusakhOgnoo) {
      var sar = moment(values?.duusakhOgnoo)
        .diff(moment(v?.gereeniiOgnoo), "month", true)
        .toFixed();
      form.setFieldsValue({ khugatsaa: sar });
      value.khugatsaa = sar;
    }
    if (!!values?.tulukhUdur) values.tulukhUdur = [values?.tulukhUdur];
    onChange({ ...value, ...values });
  };

  value.gereeniiOgnoo = moment(value.gereeniiOgnoo);
  value.duusakhOgnoo = moment(value.duusakhOgnoo);

  useEffect(() => {
    Aos.init({ once: true });
  });

  function onFinish() {
    next();
  }

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
    >
      <div data-aos="fade-right" data-aos-duration="1000">
        <Form.Item
          rules={[{ required: true, message: "Гэрээ хийх огноо бүртгэнэ үү!" }]}
          name="gereeniiOgnoo"
          label="Гэрээ хийх огноо"
        >
          <DatePicker
            style={{ width: "100%" }}
            allowClear
            placeholder="Гэрээ хийх огноо"
            prefix={<SolutionOutlined />}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
        <Form.Item
          rules={[{ required: true, message: "Гэрээний хугацаа бүртгэнэ үү!" }]}
          name="khugatsaa"
          label="Гэрээний хугацаа"
          required
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            max={100}
            min={1}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            placeholder="Гэрээний хугацаа (сараар)"
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
        <Form.Item
          rules={[{ required: true, message: "Төлөлт хийх өдөр бүртгэнэ үү!" }]}
          label="Төлөлт хийх өдөр"
          extra="Төлөлт хийх огноо сар бүрийн / өдөр"
          name="tulukhUdur"
          required
        >
          <Select
            defaultValue={_.get(value, "tulukhUdur.0")}
            placeholder="Төлөлт хийх огноо сар бүрийн / өдөр"
            prefix={<SolutionOutlined />}
          >
            {new Array(31).fill("").map((a, i) => (
              <Select.Option key={`${i + 1}tulukhUdur`} value={i + 1}>
                {i + 1}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="300">
        <Form.Item
          name="duusakhOgnoo"
          label="Гэрээ дуусах хугацаа"
          extra="Төлөлт хийх огноо сар бүрийн / өдөр"
          rules={[
            { required: true, message: "Гэрээ дуусах хугацаа бүртгэнэ үү!" },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            allowClear
            placeholder="Гэрээ дуусах хугацаа"
            prefix={<SolutionOutlined />}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400">
        <Form.Item wrapperCol={{ span: 24 }}>
          <div className="flex w-full flex-row justify-between">
            <Button
              onClick={prev}
              icon={<ArrowLeftOutlined />}
              className="mr-4 dark:text-gray-200 dark:hover:text-gray-800"
            >
              Ерөнхий мэдээлэл
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<ArrowRightOutlined />}
            >
              Түрээсийн талбай
            </Button>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default YurunkhiiMedeele;
