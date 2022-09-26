import { Form, Select, Button, InputNumber, Checkbox } from "antd";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Aos from "aos";
import { useAuth } from "services/auth";
import useJagsaalt from "hooks/useJagsaalt";
import formatNumber from "tools/function/formatNumber";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const query = {};

const YurunkhiiMedeele = ({ next, prev, onChange, value }) => {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const ashiglaltiinZardal = useJagsaalt("/ashiglaltiinZardluud", query);

  function onFinish() {
    next();
  }
  useEffect(() => {
    if (value.zardluud === undefined) {
      return (value.zardluud = []);
    }
  }, []);

  const onCheckChange = (e, a) => {
    if (e.target.checked === true) value.zardluud.push(a);
    else
      value.zardluud = value.zardluud.filter(function (item) {
        return item._id !== a._id;
      });
    onChange({ ...value });
  };

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      onValuesChange={() => onChange({ ...value })}
      initialValues={value}
      onFinish={onFinish}
    >
      <div className="space-y-5">
        <div className="text-lg font-medium dark:text-white">
          Ашиглагдах зардлаа сонгоно уу
        </div>
        {ashiglaltiinZardal?.jagsaalt.map((a, i) => {
          return (
            <div
              key={a._id}
              className={`relative flex justify-between overflow-hidden rounded-lg border-2 p-2 transition-all  dark:text-gray-200 ${
                value.zardluud !== undefined &&
                !!value.zardluud.find((c) => c._id === a._id)
                  ? "border-green-600 bg-white dark:bg-gray-900"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <div
                className={`absolute top-0 z-0 h-[200%] w-[150%] rotate-12 bg-green-500 transition-all duration-300 dark:bg-green-600 ${
                  value.zardluud !== undefined &&
                  !!value.zardluud.find((c) => c._id === a._id)
                    ? "-left-2/4"
                    : "left-full"
                }`}
              />
              <div className="z-10 flex gap-5">
                <Checkbox
                  checked={
                    value.zardluud !== undefined &&
                    !!value.zardluud.find((c) => c._id === a._id)
                  }
                  onChange={(e) => onCheckChange(e, a)}
                />
                <div>{a.ner}</div>
              </div>
              <div className="z-10">
                {a.turul} {a.turul && a.tariff && ":"} {a.tariff}{" "}
                {a.tariff && "₮"}
              </div>
            </div>
          );
        })}
      </div>

      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
        <Form.Item wrapperCol={{ span: 24 }}>
          <div className="mt-5 flex w-full flex-row justify-between">
            <Button
              onClick={prev}
              icon={<ArrowLeftOutlined />}
              className="mr-4 dark:text-white dark:hover:text-black"
            >
              Түрээсийн талбай
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<ArrowRightOutlined />}
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
