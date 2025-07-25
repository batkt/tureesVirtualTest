import { Form, Button, DatePicker, InputNumber, Select, Input, Switch } from "antd";
import {
  SolutionOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect } from "react";
import moment from "moment";
import Aos from "aos";
import _ from "lodash";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { toWords } from "mon_num";

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
  token,
  onChange,
  value,
  gereeniiZagvar,
  formSubmit,
  t,
}) => {
  const [form] = Form.useForm();

  

  useEffect(() => {
    if ((!!value.khugatsaa && (!!value.zardluud || !!value.talbainuud) && value.duusakhOgnoo > moment().startOf("month")) || !!value._id)
      uilchilgee(token)
        .post(`/khuvaariUusgey`, {
          dun: value.talbainNiitUne,
          khugatsaa: value.khugatsaa,
          tulukhUdruud: value.tulukhUdur,
          ekhlekhOgnoo: moment(gereeniiZagvar?.turGereeEsekh ? value.gereeniiOgnoo : moment(value.gereeniiOgnoo).startOf("month")).format("YYYY-MM-DD 00:00:00"),
          duusakhOgnoo: moment(value.duusakhOgnoo).format("YYYY-MM-DD 00:00:00"),
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
  }, [form.getFieldValue("khugatsaa"), form.getFieldValue("tulukhUdur"), form.getFieldValue("duusakhOgnoo"), form.getFieldValue("guchKhonogOruulakhEsekh"), form.getFieldValue("garaasKhonogOruulakhEsekh"), form.getFieldValue("ekhniiSariinKhonog")]);

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
  value.gereeniiOgnoo = moment(
    moment(value.gereeniiOgnoo).format("YYYY-MM-DD 00:00:00")
  );
  value.duusakhOgnoo = moment(
    moment(value.duusakhOgnoo).format("YYYY-MM-DD 00:00:00")
  );

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

  function disabledDate(current) {
    return value._id && current && current < moment().startOf('day');
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
          rules={[
            { required: true, message: t("Гэрээ хийх огноо бүртгэнэ үү!") },
          ]}
          name="gereeniiOgnoo"
          label={t("Гэрээ хийх огноо")}
          required={false}
        >
          <DatePicker
            disabled={!!value._id}
            style={{ width: "100%" }}
            allowClear={false}
            placeholder={t("Гэрээ хийх огноо")}
            prefix={<SolutionOutlined />}
            onChange={() => form.getFieldInstance("khugatsaa").focus()}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
        <Form.Item
          rules={[
            { required: true, message: t("Гэрээний хугацаа бүртгэнэ үү!") },
          ]}
          name="khugatsaa"
          label={t("Гэрээний хугацаа")}
          required={false}
          
        >
          <InputNumber
            onKeyUp={focuser}
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            max={480}
            min={!value._id ? 1 : moment(value?.duusakhOgnoo).diff(moment(value?.gereeniiOgnoo), "month", true).toFixed()}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            placeholder={t(
              `Гэрээний хугацаа ${
                gereeniiZagvar?.turGereeEsekh === true ? "(өдрөөр)" : "(сараар)"
              }`
            )}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
        <Form.Item
          rules={[
            { required: true, message: t("Авлага үүсэх өдөр бүртгэнэ үү!") },
          ]}
          label={t("Авлага үүсэх өдөр")}
          required={false}
          extra={
            gereeniiZagvar?.turGereeEsekh !== true &&
            t("Авлага үүсэх огноо сар бүрийн / өдөр")
          }
          name="tulukhUdur"
          
        >
          {gereeniiZagvar?.turGereeEsekh === true ? (
            <Input
              style={{ width: "100%" }}
              disabled
              allowClear
              placeholder={t("Авлага үүсэх огноо")}
              prefix={<SolutionOutlined />}
            />
          ) : (
            <Select
              onChange={() => form.getFieldInstance("duusakhOgnoo").focus()}
              defaultValue={_.get(value, "tulukhUdur.0")}
              placeholder={t("Авлага үүсгэх огноо сар бүрийн / өдөр")}
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
          label={t("Гэрээ дуусах хугацаа")}
          required={false}
          extra={t("Авлага үүсгэх огноо сар бүрийн / өдөр")}
          rules={[
            { required: true, message: t("Гэрээ дуусах хугацаа бүртгэнэ үү!") },
          ]}
        >
          <DatePicker
            disabledDate={disabledDate}
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
      {
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400" className="flex w-full justify-end gap-2 ">
          <p className="mt-1 dark:text-gray-200">{t("30 хоногоор оруулах эсэх")}:</p>
          <Form.Item name="guchKhonogOruulakhEsekh" valuePropName="checked">
            <Switch/>
          </Form.Item>
        </div>  
      }
      {
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400" className="flex w-full justify-end gap-2 ">
          <p className="mt-1 dark:text-gray-200">{t("Гараас ашиглах хоног оруулах эсэх")}:</p>
          <Form.Item name="garaasKhonogOruulakhEsekh" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>  
      }
      {value.garaasKhonogOruulakhEsekh && (
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400">
          <Form.Item
            name="ekhniiSariinKhonog"
            label={t("Эхний сарын ашиглах хоног")}
          >
            <InputNumber
              onKeyUp={focuser}
              max={30}
              min={1}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Гэрээний эхний сарын ашиглах хоног оруулах"
            />
          </Form.Item> 
        </div>  
      )}
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="500">
        <Form.Item wrapperCol={{ span: 24 }}>
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
            <Button
              onClick={prev}
              icon={<ArrowLeftOutlined />}
              className="text-gray-400 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400"
            >
              {t("Ерөнхий мэдээлэл")}
            </Button>
            <Button
              id="tureesinTalbaiButton"
              type="primary"
              onClick={() => form.submit()}
              icon={<ArrowRightOutlined />}
            >
              {t("Түрээсийн талбай")}
            </Button>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default YurunkhiiMedeele;
