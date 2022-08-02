import { Form, Select, Button, InputNumber } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import Aos from "aos";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const YurunkhiiMedeele = ({ next, prev, onChange, value }) => {
  useEffect(() => {
    Aos.init({ once: true });
  });

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      onValuesChange={(values) => onChange({ ...value, ...values })}
      initialValues={value}
    >
      <div data-aos="fade-right" data-aos-duration="1000">
        <Form.Item name="baritsaaAvakhDun" label="Барьцаа дүн">
          <InputNumber
            disabled
            placeholder="Барьцаа дүн"
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
        <Form.Item
          name="baritsaaBairshuulakhKhugatsaa"
          label="Хугацаа"
          extra="Барьцаа байршуулалтын хугацаа"
        >
          <InputNumber
            placeholder="Барьцаа байршуулалтын хугацаа"
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
        <Form.Item wrapperCol={{ span: 24 }}>
          <div className="flex w-full flex-row justify-between">
            <Button
              onClick={prev}
              icon={<ArrowLeftOutlined />}
              className="mr-4"
            >
              Түрээсийн талбай
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<ArrowRightOutlined />}
              onClick={() => next()}
            >
              Төлбөр тооцоо
            </Button>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default YurunkhiiMedeele;
