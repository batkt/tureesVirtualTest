import { Form, Button, Checkbox, Input, InputNumber } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import Aos from "aos";
import useJagsaalt from "hooks/useJagsaalt";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const query = {};

const ChecklekhKheseg = ({ a, inputChange, onChange, value }) => {
  const inputRef = React.useRef();

  const onCheckChange = (e, a) => {
    if (e.target.checked === true) {
      value.zardluud.push(a);
      setTimeout(
        () => inputRef.current !== undefined && inputRef?.current.focus(),
        300
      );
    } else
      value.zardluud = value.zardluud.filter(function (item) {
        return item._id !== a._id;
      });
    onChange({ ...value });
  };

  return (
    <div
      key={a._id}
      className={`relative flex h-10 items-center justify-between overflow-hidden rounded-lg border-2 px-2 transition-all  dark:text-gray-200 ${
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
      {a.turul || a.tariff ? (
        <div className="z-10">
          {a.turul} {a.turul && a.tariff && ":"} {a.tariff} {a.tariff && "₮"}
        </div>
      ) : (
        <div className=" w-24">
          <InputNumber
            ref={inputRef}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            disabled={
              value.zardluud !== undefined &&
              !value.zardluud.find((c) => c._id === a._id)
            }
            value={
              value.zardluud !== undefined &&
              !!value.zardluud.find((c) => c._id === a._id)
                ? value.zardluud[
                    value.zardluud.findIndex((c) => c._id === a._id)
                  ].dun
                : ""
            }
            placeholder="(...₮)"
            onChange={(e) => inputChange(e, a)}
            className="flex h-7 w-full items-center rounded-l-md pr-4 "
          />
        </div>
      )}
    </div>
  );
};

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
      value.zardluud = [];
    }
  }, []);

  const inputChange = (e, a) => {
    const index = value.zardluud.findIndex((object) => {
      return object._id === a._id;
    });

    if (index !== -1) {
      value.zardluud[index].dun = e;
    }
    onChange({ ...value });
  };

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      autoComplete={"off"}
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
            <ChecklekhKheseg
              a={a}
              inputChange={inputChange}
              value={value}
              onChange={onChange}
            />
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
