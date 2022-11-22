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

const SongokhKheseg = ({ value, ashiglaltiinZardal, onChange, id }) => {
  const [valueState, setValueState] = useState(undefined);
  function onValueChange(v) {
    onChange(ashiglaltiinZardal?.jagsaalt.find((a) => a._id === v));
    setValueState(null);
  }

  return (
    <Select
      id={id}
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

function Zardluud({ a, i, zardalUstgaya, inputChange, value, inputRef }) {
  return (
    <div
      key={value?.zardluud && value?.zardluud[i]?._id}
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
        <div>{value?.zardluud && value?.zardluud[i]?.ner}</div>
      </div>
      <div className="flex items-center gap-1">
        {value?.zardluud && value?.zardluud[i]?.turul === "Дурын" ? (
          <div className="flex w-full items-center justify-center gap-1">
            <Form.Item
              className="tariffInput absolute top-[3px] -right-5 w-44"
              name={[a.name, "dun"]}
              rules={[
                {
                  required: true,
                  message: "Тариф оруулна уу!",
                },
              ]}
            >
              <InputNumber
                min={0}
                ref={inputRef}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="Тариф"
                onChange={(e) =>
                  inputChange(e, value?.zardluud && value?.zardluud[i])
                }
                className="flex h-7 w-full items-center rounded-l-md pr-4 "
              />
            </Form.Item>
            <div>₮</div>
          </div>
        ) : (
          <div className="z-10">
            {value?.zardluud && value?.zardluud[i]?.turul}{" "}
            {value?.zardluud &&
              value?.zardluud[i]?.turul &&
              value?.zardluud[i]?.tariff &&
              ":"}{" "}
            {value?.zardluud && value?.zardluud[i]?.tariff}{" "}
            {value?.zardluud && value?.zardluud[i]?.tariff && "₮"}
          </div>
        )}
        <Popconfirm
          title={`${value?.zardluud && value?.zardluud[i]?.ner
            } зардал устгах уу?`}
          okText="Тийм"
          cancelText="Үгүй"
          onConfirm={() => zardalUstgaya(value?.zardluud && value?.zardluud[i])}
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
}

const Zardal = ({
  next,
  prev,
  onChange,
  value,
  barilgiinId,
  formSubmit,
}) => {
  const [form] = Form.useForm();
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

  function onFinish() {
    next();
  }
  const inputRef = useRef();
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
      form.setFieldsValue({ ...value });
      onChange({ ...value });
    }
    zardalOruulya();
  }
  function zardalUstgaya(a) {
    value.zardluud = value.zardluud.filter(function (item) {
      return item._id !== a?._id;
    });
    form.setFieldsValue({ ...value });
    onChange({ ...value });
  }
  useEffect(() => {
    document.getElementById("songokhKheseg").focus();
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
      form={form}
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
            id={"songokhKheseg"}
            ashiglaltiinZardal={ashiglaltiinZardal}
            inputChange={inputChange}
            onChange={onChangeZardal}
          />
        </div>

        <div className="space-y-5">
          <Form.List name="zardluud">
            {(fields,) => (
              <>
                {fields.map((a, i) => (
                  <Zardluud
                    inputRef={inputRef}
                    value={value}
                    a={a}
                    i={i}
                    zardalUstgaya={zardalUstgaya}
                    inputChange={inputChange}
                  />
                ))}
              </>
            )}
          </Form.List>
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
