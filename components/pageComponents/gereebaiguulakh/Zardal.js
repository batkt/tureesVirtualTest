import { Form, Button, InputNumber, Select, Popconfirm, Tooltip } from "antd";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import Aos from "aos";
import useJagsaalt from "hooks/useJagsaalt";
import { t } from "i18next";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

let query = {};
const searchKeys = ["ner"];

const SongokhKheseg = ({ value, ashiglaltiinZardal, onChange, id, t }) => {
  const [valueState, setValueState] = useState(
    value?.zardluud?.map((a) => a._id)
  );

  useEffect(() => {
    const currentIds = value?.zardluud?.map((a) => a._id) || [];
    setValueState(currentIds);
  }, [value?.zardluud]);

  const onValueChange = (selectedValues) => {
    onChange(selectedValues);
    setValueState(selectedValues);
    ashiglaltiinZardal.setKhuudaslalt((a) => ({ ...a, search: "" }));
  };

  return (
    <Select
      id={id}
      mode={"multiple"}
      placeholder={t("Зардал сонгох")}
      filterOption={false}
      value={valueState}
      onChange={onValueChange}
      className="w-full"
      showSearch
      removeIcon={null}
      loading={!ashiglaltiinZardal}
      onSearch={(search) =>
        ashiglaltiinZardal.setKhuudaslalt((a) => ({ ...a, search }))
      }
      getPopupContainer={(triggerNode) => {
        let container = triggerNode.parentElement;
        while (container && !container.classList.contains("max-h-[60vh]")) {
          container = container.parentElement;
        }
        return container || document.body;
      }}
      dropdownMatchSelectWidth={false}
      dropdownStyle={{
        zIndex: 1050,
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(12px) saturate(180%)",
      }}
      dropdownClassName="ant-select-dropdown-opaque"
    >
      <div value={1} disabled className="flex w-full border-b">
        <div className="flex">
          <div className="w-1/2 border-r bg-green-400 bg-opacity-10 text-center font-medium text-gray-600 dark:text-gray-200">
            {t("Зардлын нэршил")}
          </div>
          <div className="w-1/2 bg-blue-600 bg-opacity-5 text-center font-medium text-gray-600 dark:text-gray-200">
            {t("Нэгж")}, {t("Үнэ")}
          </div>
        </div>
      </div>
      {ashiglaltiinZardal?.jagsaalt.map((a, i) => {
        return (
          <Select.Option key={a._id} value={a._id}>
            <div className="pointer-events-none flex w-full justify-between border-b">
              <p className="flex border-r bg-green-400 bg-opacity-10 pl-2 pr-2 text-left">
                {a.ner}
              </p>
              <div className="flex w-full justify-between bg-blue-600 bg-opacity-5 pl-2 pr-2">
                <p className={`mr-5 border-r text-right`}>{t(a.turul)}</p>
                <div className="ml-auto">
                  {(a.ner?.includes("Хүйтэн ус") || a.ner?.includes("Халуун ус")
                    ? "Цэвэр ус: " + formatNumber(a.tseverUsDun, 2)
                    : formatNumber(a.tariff, 2)) +
                    " " +
                    (a.ner?.includes("Хүйтэн ус") ||
                    a.ner?.includes("Халуун ус")
                      ? "Бохир ус: " + formatNumber(a.bokhirUsDun, 2)
                      : "") +
                    " " +
                    (a.ner?.includes("Халуун ус")
                      ? "Ус халаасны: " + formatNumber(a.usKhalaasniiDun, 2)
                      : "")}
                </div>
                <p className="text-right">{a.turul !== "Дурын" && "₮"}</p>
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
        className={`absolute ${
          value?.zardluud &&
          (value?.zardluud[i]?.ner?.includes("Халуун ус") ||
            value?.zardluud[i]?.ner?.includes("Халуун ус"))
            ? "-left-2/3"
            : "-left-2/4"
        } top-0 z-0 h-[200%] w-[150%] rotate-12 bg-green-500 transition-all duration-300 
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
              className="tariffInput absolute -right-5 top-[3px] z-10 w-44"
              name={[a.name, "dun"]}
              rules={[
                {
                  required: true,
                  message: t("Тариф оруулна уу!"),
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
                onChange={(e) => {
                  
                  inputChange(e, value?.zardluud && value?.zardluud[i])
                }
                }
                className="flex h-7 w-full items-center rounded-l-md pr-4 "
              />
            </Form.Item>
            <div>₮</div>
          </div>
        ) : value?.zardluud &&
          (value?.zardluud[i].ner?.includes("Халуун ус") ||
            (value?.zardluud &&
              value?.zardluud[i]?.ner?.includes("Хүйтэн ус"))) ? (
          <div className="ml-auto">
            {(value?.zardluud[i].ner?.includes("Хүйтэн ус") ||
            value?.zardluud[i].ner?.includes("Халуун ус")
              ? "Цэвэр ус: " + formatNumber(value?.zardluud[i].tseverUsDun, 2)
              : formatNumber(value?.zardluud[i].tariff, 2)) +
              " " +
              (value?.zardluud[i].ner?.includes("Хүйтэн ус") ||
              value?.zardluud[i].ner?.includes("Халуун ус")
                ? "Бохир ус: " + formatNumber(value?.zardluud[i].bokhirUsDun, 2)
                : "") +
              " " +
              (value?.zardluud[i].ner?.includes("Халуун ус")
                ? "Ус халаасны: " +
                  formatNumber(value?.zardluud[i].usKhalaasniiDun, 2)
                : "")}
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
          title={t("зардал устгах уу?", {
            ner: value?.zardluud && value?.zardluud[i]?.ner,
          })}
          okText={t("Тийм")}
          cancelText={t("Үгүй")}
          onConfirm={() => zardalUstgaya(value?.zardluud && value?.zardluud[i])}
        >
          <div className="z-20 flex h-8 w-8 cursor-pointer items-center justify-start rounded-full fill-current p-2 text-xl text-black dark:text-red-600">
            <Tooltip title={t("Устгах")}>
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
  token,
  value,
  barilgiinId,
  gereeniiZagvar,
  formSubmit,
  t,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    Aos.init({ once: true });
  });
  useEffect(() => {
    if (
      (!!value.khugatsaa &&
        !!value.zardluud &&
        value.duusakhOgnoo > moment().startOf("month")) ||
      !!value._id
    )
      uilchilgee(token)
        .post(`/khuvaariUusgey`, {
          dun: value.talbainNiitUne,
          khugatsaa: value.khugatsaa,
          tulukhUdruud: value.tulukhUdur,
          ekhlekhOgnoo: moment(
            gereeniiZagvar?.turGereeEsekh
              ? value.gereeniiOgnoo
              : moment(value.gereeniiOgnoo).startOf("month")
          ).format("YYYY-MM-DD 00:00:00"),
          duusakhOgnoo: moment(value.duusakhOgnoo).format(
            "YYYY-MM-DD 00:00:00"
          ),
          zardluud: value.zardluud,
          mk: value.talbainKhemjee,
          metrKube: value.talbainKhemjeeMetrKube,
          turGereeEsekh: gereeniiZagvar?.turGereeEsekh,
          shineGereeEsekh: !value._id,
          guchKhonogOruulakhEsekh: value.guchKhonogOruulakhEsekh,
          garaasKhonogOruulakhEsekh: value.garaasKhonogOruulakhEsekh,
          ekhniiSariinKhonog: value.ekhniiSariinKhonog,
          gereeniiOgnoo: value.gereeniiOgnoo,
        })
        .then(({ data }) => {
          _.set(value, "avlaga.guilgeenuud", data);
          onChange({ ...value });
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
  }, [form.getFieldValue("zardluud")]);

  const ashiglaltiinZardal = useJagsaalt(
    "/ashiglaltiinZardluud",
    (query = { barilgiinId: barilgiinId }),
    undefined,
    undefined,
    searchKeys
  );

  const zardluudiinJagsaalt = useJagsaalt(
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
    // if (!!value.zardluud?.find((a) => a._id === v._id)) {
    //   notification.warning({
    //     message: (
    //       <div>
    //         <b>{v.ner}</b> {t("зардал нь гэрээн дээр сонгогдсон байна.")}
    //       </div>
    //     ),
    //   });
    //   return;
    // }
    function zardalOruulya() {
      var zardluud = zardluudiinJagsaalt.jagsaalt?.filter((a) =>
        v.includes(a._id)
      );
      var oldZardluud = value.zardluud?.filter((a) => v.includes(a._id));
      var ustgakhJagsaalt = [];
      oldZardluud?.map((a) => {
        var filteredZardal = zardluud?.filter((b) => b._id === a._id);
        if (filteredZardal?.length > 0) ustgakhJagsaalt.push(filteredZardal[0]);
      });
      value.zardluud = oldZardluud || [];
      value.zardluud.push(
        ...zardluud?.filter((el) => !ustgakhJagsaalt.includes(el))
      );
      value.zardluud.map((el) => {
        if (el.turul === "Дурын") {
          el.dun = el.dun ? el.dun : "";
        }
        var urjuulekhData =
          el?.turul === "1м2"
            ? value.talbainKhemjee
            : el?.turul === "Тогтмол" && 1;
        el.tulukhDun = el.tariff * urjuulekhData;
      });
      form.setFieldsValue({ ...value });
      onChange({ ...value });
    }
    zardalOruulya();
    // function zardalOruulya() {
    //   value.zardluud = value.zardluud || [];
    //   value.zardluud.push(v);
    //   if (v.turul === "Дурын") {
    //     setTimeout(() => {
    //       inputRef.current !== undefined && inputRef?.current.focus();
    //     }, 300);
    //     v.dun = "";
    //   }
    //   form.setFieldsValue({ ...value });
    //   onChange({ ...value });
    // }
    // zardalOruulya();
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
     
      const updatedZardluud = [...value.zardluud];
      updatedZardluud[index] = {
        ...updatedZardluud[index],
        dun: e,
        tariff: e,
        tulukhDun: e,
      };
      
      onChange({ 
        ...value, 
        zardluud: updatedZardluud 
      });
    }
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
          {t("Ашиглагдах зардлаа сонгоно уу")}
        </div>

        <div className="w-full bg-white">
          <SongokhKheseg
            value={value}
            t={t}
            id={"songokhKheseg"}
            ashiglaltiinZardal={ashiglaltiinZardal}
            inputChange={inputChange}
            onChange={onChangeZardal}
          />
        </div>

        <div className="space-y-5">
          <Form.List name="zardluud">
            {(fields) => (
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
          <div className="mt-5 flex w-full flex-col justify-between gap-4 md:flex-row">
            <Button
              onClick={prev}
              icon={<ArrowLeftOutlined />}
              className="text-gray-400 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400"
            >
              {t("Буцах")}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<ArrowRightOutlined />}
            >
              {t("Үргэлжлүүлэх")}
            </Button>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default Zardal;
