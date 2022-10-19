import {
  Form,
  Button,
  InputNumber,
  Select,
  notification,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
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
const searchKeys = ["ner"];

const SongokhKheseg = ({ value, ashiglaltiinZardal, onChange }) => {
  const [valueState, setValueState] = useState(undefined);
  function onValueChange(v) {
    onChange(ashiglaltiinZardal?.jagsaalt.find((a) => a._id === v));
    setValueState(null);
  }

  return (
    <Select
      placeholder="Зардал сонгох"
      filterOption={false}
      value={valueState}
      onChange={onValueChange}
      className="w-full"
      showSearch
      loading={!ashiglaltiinZardal}
      onSearch={(search) =>
        ashiglaltiinZardal.setKhuudaslalt((a) => ({ ...a, search }))
      }
    >
      <div value={1} disabled className="flex w-full border-b">
        <div className="flex">
          <div className="w-1/2 border-r bg-green-400 bg-opacity-10 text-center font-medium text-gray-600 dark:text-gray-200">
            Зардлын нэршил
          </div>
          <div className="w-1/2 bg-blue-600 bg-opacity-5 text-center font-medium text-gray-600 dark:text-gray-200">
            Нэгж, Үнэ
          </div>
        </div>
      </div>
      {ashiglaltiinZardal?.jagsaalt.map((a, i) => {
        return (
          <Select.Option key={a._id}>
            <div className="flex justify-between border-b">
              <p className="flex w-1/2 truncate border-r bg-green-400 bg-opacity-10 pl-2 text-left">
                {a.ner}
              </p>
              <div className="flex w-1/2 bg-blue-600 bg-opacity-5 pr-2">
                <p className={`   w-1/2 border-r text-right`}>{a.turul}</p>
                <p className="w-1/2 text-right">
                  {a.turul !== "Дурын" ? a.tariff : "Дурын"}
                  {a.turul !== "Дурын" && "₮"}
                </p>
              </div>
            </div>
          </Select.Option>
        );
      })}
    </Select>
  );
};

const Zardal = ({ next, prev, onChange, value, barilgiinId }) => {
  useEffect(() => {
    Aos.init({ once: true });
  });

  const ashiglaltiinZardal = useJagsaalt(
    "/ashiglaltiinZardluud",
    (query = { barilgiinId: barilgiinId }),
    undefined,
    undefined,
    searchKeys
  );
  const inputRef = useRef();

  function onFinish() {
    next();
  }

  function onChangeZardal(v) {
    if (!!value.zardluud?.find((a) => a._id === v._id)) {
      notification.warning({
        message: (
          <div>
            <b>{v.ner}</b> зардал нь гэрээн дээр сонгогдсон байна.
          </div>
        ),
      });
      return;
    }
    function zardalOruulya() {
      value.zardluud = value.zardluud || [];
      value.zardluud.push(v);
      if (v.turul === "Дурын") {
        setTimeout(() => {
          inputRef.current !== undefined && inputRef?.current.focus();
        }, 300);
        v.dun = "";
      }

      onChange({ ...value });
    }
    zardalOruulya();
  }

  function zardalUstgaya(a) {
    value.zardluud = value.zardluud.filter(function (item) {
      return item._id !== a._id;
    });
    onChange({ ...value });
  }

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
      initialValues={value}
      onFinish={onFinish}
    >
      <div className="space-y-5">
        <div className="text-lg font-medium dark:text-white">
          Ашиглагдах зардлаа сонгоно уу
        </div>

        <div className="w-full bg-white">
          <SongokhKheseg
            ashiglaltiinZardal={ashiglaltiinZardal}
            inputChange={inputChange}
            onChange={onChangeZardal}
          />
        </div>

        <div className="space-y-5">
          {value?.zardluud?.map((a, i) => {
            return (
              <div
                key={a._id}
                className={`relative flex h-10 items-center justify-between overflow-hidden rounded-lg border border-green-600 bg-white  px-2 
                  
                    transition-all dark:bg-gray-800 dark:text-gray-200
                  
                `}
              >
                <div
                  className={`absolute top-0 -left-2/4 z-0 h-[200%] w-[150%] rotate-12 bg-green-500 transition-all duration-300 
                     dark:bg-green-600`}
                />
                <div className="z-10 flex gap-1">
                  <div>{i + 1}.</div>
                  <div>{a.ner}</div>
                </div>
                <div className="flex items-center gap-1">
                  {a.turul === "Дурын" ? (
                    <div className="flex w-24 items-center justify-center gap-1">
                      <InputNumber
                        min={0}
                        ref={inputRef}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        value={
                          value?.zardluud[
                            value?.zardluud.findIndex((c) => c._id === a._id)
                          ]?.dun || ""
                        }
                        placeholder="Тариф"
                        onChange={(e) => inputChange(e, a)}
                        className="flex h-7 w-full items-center rounded-l-md pr-4 "
                      />
                      <div>₮</div>
                    </div>
                  ) : (
                    <div className="z-10">
                      {a.turul} {a.turul && a.tariff && ":"} {a.tariff}{" "}
                      {a.tariff && "₮"}
                    </div>
                  )}
                  <Popconfirm
                    title={`${a.ner} зардал устгах уу?`}
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={() => zardalUstgaya(a)}
                  >
                    <div className="flex h-8 w-8 cursor-pointer items-center justify-start rounded-full fill-current p-2 text-xl text-black dark:text-red-600">
                      <Tooltip title="Устгах">
                        <CloseCircleOutlined size={20} />
                      </Tooltip>
                    </div>
                  </Popconfirm>
                </div>
              </div>
            );
          })}
        </div>
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

export default Zardal;
