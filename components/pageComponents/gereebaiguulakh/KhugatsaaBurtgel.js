import { Form, Button, DatePicker, InputNumber, Select, Input } from "antd";
import {
  SolutionOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect } from "react";
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

const YurunkhiiMedeele = ({
  next,
  prev,
  onChange,
  value,
  gereeniiZagvar,
  formSubmit,
}) => {
  const [form] = Form.useForm();

  const onValuesChange = (values, v) => {
    if (!!values?.gereeniiOgnoo && !!value?.khugatsaa) {
      value.duusakhOgnoo = moment(values.gereeniiOgnoo).add(
        value.khugatsaa,
        gereeniiZagvar.turGereeEsekh === true ? "d" : "M"
      );
      form.setFieldsValue({ ...value, ...values });
    }
    if (!!value?.gereeniiOgnoo && !!values?.khugatsaa) {
      value.duusakhOgnoo = moment(value.gereeniiOgnoo).add(
        values.khugatsaa,
        gereeniiZagvar.turGereeEsekh === true ? "d" : "M"
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
    if (gereeniiZagvar.turGereeEsekh !== true) {
      if (!!values?.tulukhUdur) values.tulukhUdur = [values?.tulukhUdur];
      form.setFieldsValue({ ...value, ...values });
    }
    if (gereeniiZagvar.turGereeEsekh === true) {
      values.tulukhUdur = [moment(values?.gereeniiOgnoo).format("DD")];
      form.setFieldsValue({ ...value, ...values });
    }

    onChange({ ...value, ...values });
  };

  if (gereeniiZagvar?.turGereeEsekh === true) {
    value.tulukhUdur = [moment(value?.gereeniiOgnoo).format("DD")];
  }
  value.gereeniiOgnoo = moment(moment(value.gereeniiOgnoo).format("YYYY-MM-DD 00:00:00"));
  value.duusakhOgnoo = moment(moment(value.duusakhOgnoo).format("YYYY-MM-DD 00:00:00"));

  useEffect(() => {
    Aos.init({ once: true });
  });
  useEffect(() => {
    form.getFieldInstance("khugatsaa").focus();
  }, []);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "validate_other_khugatsaa":
          if (value?.turGereeEsekh === true) {
            form.getFieldInstance("duusakhOgnoo").focus();
          } else form.getFieldInstance("tulukhUdur").focus();
          break;
        default:
          break;
      }
    }
  }, []);

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
      autoComplete={"off"}
    >
      <div data-aos="fade-right" data-aos-duration="1000">
        <Form.Item
          rules={[{ required: true, message: "Гэрээ хийх огноо бүртгэнэ үү!" }]}
          name="gereeniiOgnoo"
          label="Гэрээ хийх огноо"
        >
          <DatePicker
            style={{ width: "100%" }}
            allowClear={false}
            placeholder="Гэрээ хийх огноо"
            prefix={<SolutionOutlined />}
            onChange={() => form.getFieldInstance("khugatsaa").focus()}
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
            onKeyUp={focuser}
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            max={100}
            min={1}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            placeholder={`Гэрээний хугацаа ${gereeniiZagvar?.turGereeEsekh === true ? "(өдрөөр)" : "(сараар)"
              }`}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
        <Form.Item
          rules={[{ required: true, message: "Төлөлт хийх өдөр бүртгэнэ үү!" }]}
          label="Төлөлт хийх өдөр"
          extra={
            gereeniiZagvar?.turGereeEsekh !== true &&
            "Төлөлт хийх огноо сар бүрийн / өдөр"
          }
          name="tulukhUdur"
          required
        >
          {gereeniiZagvar?.turGereeEsekh === true ? (
            <Input
              style={{ width: "100%" }}
              disabled
              allowClear
              placeholder="Төлөлт хийх огноо"
              prefix={<SolutionOutlined />}
            />
          ) : (
            <Select
              onChange={() => form.getFieldInstance("duusakhOgnoo").focus()}
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
          )}
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
            onChange={() =>
              document.getElementById("tureesinTalbaiButton").focus()
            }
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
              id="tureesinTalbaiButton"
              type="primary"
              onClick={() => form.submit()}
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
