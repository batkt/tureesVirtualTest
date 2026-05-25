import { Form, Input, Switch, Button, Upload, Select, message } from "antd";
import {
  UploadOutlined,
  SolutionOutlined,
  ArrowRightOutlined,
  MailOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import React, { useCallback, useRef, useState } from "react";
import uilchilgee, { url, aldaaBarigch } from "services/uilchilgee";
import FormLavlakh from "components/FormLavlakh";
import { useEffect } from "react";
import Aos from "aos";
import useJagsaalt from "hooks/useJagsaalt";
import KhariltsagchiinLavlakh from "./KhariltsagchiinLavlakh";
import formatNumber from "tools/function/formatNumber";
import moment from "moment";

var timeout = null;

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

const query = { turul: "geree" };

function YalgakhUtga({ fieldKey, name, remove, t, ...restField }) {
  const segment = useJagsaalt("/segment", query);
  const [turul, setTurul] = useState();
  const [songosonSegment, setSongosonSegment] = useState();

  function solikh(value) {
    setTurul(segment.jagsaalt.find((a) => a.ner === value));
    shineSolikh("ner", value);
  }
  function solikhtTurul(value) {
    shineSolikh("utga", value);
  }
  function shineSolikh(talbar, utga) {
    setSongosonSegment((a) => ({ ...a, [talbar]: utga }));
  }
  return (
    <div className="flex w-full justify-end">
      <div className="mb-3 flex w-[67%] flex-row items-end gap-3">
        <Form.Item
          label={t("Төрөл")}
          className="mb-0 flex-1"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          {...restField}
          name={[name, "ner"]}
          fieldKey={[fieldKey, "ner"]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder={t("Төрөл")}
            onChange={solikh}
          >
            {segment?.jagsaalt?.map((mur) => (
              <Select.Option key={mur?.ner} value={mur?.ner}>
                {t(mur?.ner)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t("Утга")}
          className="mb-0 flex-1"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          {...restField}
          name={[name, "utga"]}
          fieldKey={[fieldKey, "utga"]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder={t("Утга")}
            onChange={solikhtTurul}
          >
            {turul?.utguud?.map((a, index) => (
              <Select.Option key={`${a}-${index}`} value={a}>
                {t(a)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div className="flex items-end pb-1">
          <CloseCircleOutlined
            className="text-lg text-gray-500 transition-colors hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            onClick={() => remove(name)}
          />
        </div>
      </div>
    </div>
  );
}

const YurunkhiiMedeele = ({
  token,
  next,
  onChange,
  value,
  baiguullaga,
  barilgiinId,
  gereeniiZagvariinId,
  gereeniiZagvarGaralt,
  aktiinZagvarGaralt,
  setAktiinZagvarKhuudaslalt,
  setAktiinZagvar,
  onChangeGereeniiZagvar,
  setGereeniiZagvarKhuudaslalt,
  gereeniiZagvar,
  zagvarRef,
  t,
}) => {
  const [form] = Form.useForm();
  const formRef = useRef();

  function onChangeRegister({ target, selectedCustomer }) {
    var onookhKhariltsagch = {
      customerTin: undefined,
      ner: undefined,
      utas: undefined,
      ovog: undefined,
      mail: undefined,
      zakhirliinOvog: undefined,
      zakhirliinNer: undefined,
      khayag: undefined,
      albanTushaal: undefined,
      khariltsagchiinNershil: undefined,
    };
    form.setFieldsValue(onookhKhariltsagch);
    clearTimeout(timeout);

    if (selectedCustomer) {
      const {
        ner,
        utas,
        ovog,
        mail,
        zakhirliinOvog,
        zakhirliinNer,
        khayag,
        customerTin,
        albanTushaal,
        register,
      } = selectedCustomer;

      const fillData = value.baiguullagaEsekh
        ? {
            utas,
            zakhirliinOvog,
            zakhirliinNer,
            mail,
            khayag,
            register: register || target.value,
            ner,
            customerTin,
            albanTushaal,
          }
        : {
            ner,
            utas,
            ovog,
            mail,
            khayag,
            register: register || target.value,
            customerTin,
            albanTushaal,
          };

      form.setFieldsValue(fillData);
      onChange({ ...value, ...fillData });
      return;
    }

    if (!target.value) {
      onChange({ ...value, ...onookhKhariltsagch, register: undefined });
      return;
    }

    if (!!target.value) {
      timeout = setTimeout(function () {
        uilchilgee(token)
          .get("/khariltsagch", {
            params: {
              query: {
                baiguullagiinId: baiguullaga?._id,
                $or: [
                  { register: target.value },
                  { customerTin: target.value },
                ],
              },
              select: {
                ner: 1,
                utas: 1,
                ovog: 1,
                mail: 1,
                zakhirliinOvog: 1,
                zakhirliinNer: 1,
                khayag: 1,
                customerTin: 1,
                albanTushaal: 1,
                register: 1,
              },
            },
          })
          .then(({ data }) => {
            if (data?.jagsaalt.length > 0) {
              const {
                ner,
                utas,
                ovog,
                mail,
                zakhirliinOvog,
                zakhirliinNer,
                khayag,
                customerTin,
                albanTushaal,
                register,
              } = data?.jagsaalt[0];

              const fillData = value.baiguullagaEsekh
                ? {
                    utas,
                    zakhirliinOvog,
                    zakhirliinNer,
                    mail,
                    khayag,
                    register: register || target.value,
                    ner,
                    customerTin,
                    albanTushaal,
                  }
                : {
                    ner,
                    utas,
                    ovog,
                    mail,
                    khayag,
                    register: register || target.value,
                    customerTin,
                    albanTushaal,
                  };

              form.setFieldsValue(fillData);
              onChange({ ...value, ...fillData });
            } else {
              const maxLen = value.baiguullagaEsekh ? 7 : 10;
              if (target.value.length > maxLen) {
                message.error(t("Регистрийн дугаар буруу байна"));
                const trimmed = target.value.slice(0, maxLen);
                form.setFieldValue("register", trimmed);
                onChange({ ...value, register: trimmed });
                return;
              }
              form.setFieldValue("register", target.value);
              onChange({ ...value, register: target.value });
            }
          })
          .catch(aldaaBarigch);
      }, 300);
    }
  }

  useEffect(() => {
    Aos.init({ once: true });
  });
  useEffect(() => {
    const defaultPrefix = `ГД${moment(new Date()).format("YYMMDD")}`;
    if (value.gereeniiDugaar === defaultPrefix) {
      form.resetFields();
    }
    form.setFieldsValue(value);
  }, [value]);

  useEffect(() => {
    if (barilgiinId !== value.barilgiinId) {
      form.resetFields();
    }
  }, [barilgiinId]);

  const focuser = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        switch (e.target.id) {
          case "validate_other_gereeniiDugaar":
            {
              if (value.baiguullagaEsekh === true) {
                form.getFieldInstance("ner").focus();
              } else {
                form.getFieldInstance("register").focus();
              }
            }
            break;
          case "validate_other_register":
            {
              if (value.baiguullagaEsekh === true) {
                form.getFieldInstance("zakhirliinOvog").focus();
              } else {
                form.getFieldInstance("ovog").focus();
              }
            }
            break;
          case "validate_other_ovog":
            form.getFieldInstance("ner").focus();
            break;
          case "validate_other_zakhirliinOvog":
            form.getFieldInstance("zakhirliinNer").focus();
            break;
          case "validate_other_zakhirliinNer":
            form.getFieldInstance("albanTushaal").focus();
            break;
          case "validate_other_albanTushaal":
            form.getFieldInstance("utas").focus();
            break;
          case "validate_other_ner":
            {
              if (value.baiguullagaEsekh === true) {
                form.getFieldInstance("register").focus();
              } else {
                form.getFieldInstance("albanTushaal").focus();
              }
            }
            break;
          case "validate_other_utas":
            form.getFieldInstance("mail").focus();
            break;
          case "validate_other_mail":
            document.getElementById("dans").focus();
            document.getElementById("dans").select();
            break;
          case "dans":
            document.getElementById(gereeniiZagvariinId).focus();
            document.getElementById(gereeniiZagvariinId).select();
            break;
          default:
            break;
        }
      }
    },
    [value.baiguullagaEsekh],
  );

  function onFinish() {
    next();
  }

  return (
    <Form
      ref={formRef}
      form={form}
      autoComplete={"off"}
      className="-space-y-5 md:space-y-0"
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onValuesChange={(changedValues, values) => {
        onChange({ ...value, ...values });
      }}
      onFinish={onFinish}
    >
      <div
        data-aos="fade-right"
        className="mb-5 md:hidden"
        data-aos-delay="200"
      >
        <Select
          ref={zagvarRef}
          id={gereeniiZagvariinId}
          showSearch
          placeholder={t("Гэрээний загвар сонгох")}
          className="w-full "
          size="middle"
          value={gereeniiZagvar?.ner ? gereeniiZagvar?.ner : null}
          filterOption={(o) => o}
          onSearch={(search) =>
            setGereeniiZagvarKhuudaslalt((a) => ({
              ...a,
              search,
              khuudasniiDugaar: 1,
            }))
          }
          onChange={(v) => {
            onChangeGereeniiZagvar(v);
          }}
        >
          {gereeniiZagvarGaralt?.jagsaalt?.map((mur) => {
            return (
              <Select.Option key={mur._id}>
                <div className="flex justify-between">
                  <p>{mur.ner}</p>
                  <p className="text-gray-500">
                    {mur.turGereeEsekh === true
                      ? `/${t("Түр гэрээ")}/`
                      : `/${t("Үндсэн гэрээ")}/`}
                  </p>
                </div>
              </Select.Option>
            );
          })}
        </Select>
      </div>
      <div data-aos="fade-right" data-aos-delay="200">
        <Form.Item
          name="gereeniiDugaar"
          label={t("Гэрээний дугаар")}
          
          required={false}
          rules={[
            {
              required: true,
              message: t("Гэрээний дугаар бүртгэнэ үү!"),
            },
          ]}
        >
          <Input
            onKeyUp={focuser}
            allowClear
            placeholder={t("Гэрээний дугаар")}
            style={{ borderRadius: '8px'}}
            prefix={<SolutionOutlined />}
          />
        </Form.Item>
      </div>
      <div
        data-aos="fade-right"
        data-aos-delay="300"
        className="flex w-full justify-end gap-2 "
      >
        <p className="mt-1 dark:text-gray-200">{t("Байгууллага эсэх")}:</p>
        <Form.Item name="baiguullagaEsekh" valuePropName="checked">
          <Switch
            onChange={(v) => {
              const khariltsagch = {
                register: undefined,
                customerTin: undefined,
                ner: undefined,
                utas: undefined,
                ovog: undefined,
                mail: undefined,
                zakhirliinOvog: undefined,
                zakhirliinNer: undefined,
              };
              form.setFieldsValue(khariltsagch);
              onChange({ ...value, ...khariltsagch, baiguullagaEsekh: v });
            }}
            normalize={(value) => value?.replace(/\s/g, "")}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-delay="200">
        <Form.Item
          name="register"
          label={t("Регистр")}
          required={false}
          rules={[
            {
              required: value.customerTin === value.register,
              message: t("Регистр дугаар бүртгэнэ үү!"),
            },
          ]}
          normalize={(value) => value?.replace(/\s/g, "")}
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("Text");
            if (/\s/.test(pasted)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const noSpace = e.target.value.replace(/\s/g, "");
            form.setFieldsValue({ register: noSpace });
          }}
        >
          <KhariltsagchiinLavlakh
            khadgalsabRegister={
              value.register ? value.register : value.customerTin
            }
            focuser={focuser}
            baiguullaga={baiguullaga}
            barilgiinId={barilgiinId}
            onChangeRegister={onChangeRegister}
            baiguullagaEsekh={value.baiguullagaEsekh}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-delay="800">
        <Form.Item
          name="customerTin"
          required={false}
          label={t("Бүртгэлийн дугаар")}
          rules={[
            {
              required: value.customerTin === value.register,
              message: t("Бүртгэлийн дугаар бүртгэнэ үү!"),
            },
          ]}
          normalize={(value) => value?.replace(/\s/g, "")}
        >
          <Input
            onKeyUp={focuser}
            allowClear
            style={{ borderRadius: '8px'}}
            placeholder={t("Бүртгэлийн дугаар")}
            prefix={<SolutionOutlined />}
          />
        </Form.Item>
      </div>
      {value.baiguullagaEsekh && (
        <div data-aos="fade-right">
          <Form.Item
            name="ner"
            label={t("Байгууллага нэр")}
            required={false}
            rules={[
              { required: true, message: t("Байгууллага нэр бүртгэнэ үү!") },
            ]}
            normalize={(value) => value?.replace(/\s/g, "")}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              placeholder={t("Байгууллага нэр")}
              style={{ borderRadius: '8px'}}
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {!value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="500">
          <Form.Item
            rules={[{ required: true, message: t("Овог бүртгэнэ үү!") }]}
            name="ovog"
            label={t("Овог")}
            normalize={(value) => value?.replace(/\s/g, "")}
          >
            <Input
              onKeyUp={focuser}
              style={{ borderRadius: '8px'}}
              allowClear
              placeholder={t("Овог")}
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {!value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="600">
          <Form.Item
            name="ner"
            rules={[{ required: true, message: t("Нэр заавал оруулна уу!") }]}
            label={t("Нэр")}
            normalize={(value) => value?.replace(/\s/g, "")}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              style={{ borderRadius: '8px'}}
              placeholder={t("Нэр")}
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="300">
          <Form.Item
            name="zakhirliinOvog"
            label={t("Захирлын овог")}
            required={false}
            rules={[{ required: true, message: t("Овог бүртгэнэ үү!") }]}
            normalize={(value) => value?.replace(/\s/g, "")}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              style={{ borderRadius: '8px'}}
              placeholder={t("Овог")}
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="400">
          <Form.Item
            name="zakhirliinNer"
            label={t("Захирлын нэр")}
            required={false}
            rules={[{ required: true, message: t("Нэр заавал оруулна уу!") }]}
            normalize={(value) => value?.replace(/\s/g, "")}
          >
            <Input
              onKeyUp={focuser}
              style={{ borderRadius: '8px'}}
              allowClear
              placeholder={t("Нэр")}
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      <div data-aos="fade-right">
        <Form.Item name="albanTushaal" label={t("Албан тушаал")}>
          <Input
            onKeyUp={focuser}
            allowClear
            style={{ borderRadius: '8px'}}
            placeholder={t("Албан тушаал")}
            prefix={<SolutionOutlined />}
          />
        </Form.Item>
      </div>
      {!value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="700">
          <Form.Item
            name="utas"
            rules={[
              { required: true, message: t("Утасны дугаар оруулна уу !") },
              { pattern: /^[0-9]{8}$/, message: t("Утасны дугаар 8 оронтой тоо байх ёстой!") }
            ]}
            label={t("Утас")}
            normalize={(value) => value?.replace(/\D/g, "").slice(0, 8)}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              maxLength={8}
              style={{ borderRadius: '8px'}}
              placeholder={t("Утас")}
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="700">
          <Form.Item
            name="utas"
            rules={[
              { required: true, message: t("Утасны дугаар оруулна уу !") },
              { pattern: /^[0-9]{8}$/, message: t("Утасны дугаар 8 оронтой тоо байх ёстой!") }
            ]}
            label={t("Утас")}
            normalize={(value) => value?.replace(/\D/g, "").slice(0, 8)}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              maxLength={8}
              style={{ borderRadius: '8px'}}
              placeholder={t("Утас")}
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {!value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="800">
          <Form.Item
            name="mail"
            rules={[
              { required: true, message: t("И-мэйл хаяг оруулна уу !") },
              { type: 'email', message: t("И-мэйл хаяг буруу байна!") },
              { pattern: /^[^\s@]+@[^\s@]+\.(com|mn)$/i, message: t("И-мэйл хаяг .com эсвэл .mn-ээр төгссөн байх ёстой!") }
            ]}
            label={t("И-мэйл хаяг")}
            normalize={(value) => value?.replace(/\s/g, "")}
          >
            <Input
              onKeyUp={focuser}
              style={{ borderRadius: '8px'}}
              type="email"
              placeholder={t("И-мэйл хаяг")}
              allowClear
              prefix={<MailOutlined />}
              normalize={(value) => value?.replace(/\s/g, "")}
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("Text");
                if (/\s/.test(pasted)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
        </div>
      )}
      {value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="800">
          <Form.Item
            name="mail"
            rules={[
              { required: true, message: t("И-мэйл хаяг оруулна уу !") },
              { type: 'email', message: t("И-мэйл хаяг буруу байна!") },
              { pattern: /^[^\s@]+@[^\s@]+\.(com|mn)$/i, message: t("И-мэйл хаяг .com эсвэл .mn-ээр төгссөн байх ёстой!") }
            ]}
            label={t("И-мэйл хаяг")}
            normalize={(value) => value?.replace(/\s/g, "")}
          >
            <Input
              onKeyUp={focuser}
              type="email"
              placeholder={t("И-мэйл хаяг")}
              allowClear
              style={{ borderRadius: '8px'}}
              prefix={<MailOutlined />}
              normalize={(value) => value?.replace(/\s/g, "")}
            />
          </Form.Item>
        </div>
      )}
      <div data-aos="fade-right" data-aos-delay="800">
        <Form.Item
          label={t("Нэршил")}
          name={"khariltsagchiinNershil"}
          rules={[{ required: true, message: t("Нэр оруулна уу !") }]}
        >
          <Input placeholder={t("Дэлгүүр, брэнд нэр")}  style={{ borderRadius: '8px'}}/>
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-delay="900">
        <Form.List name="segmentuud" className="">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key}>
                  <YalgakhUtga
                    key={key}
                    t={t}
                    name={name}
                    fieldKey={fieldKey}
                    {...restField}
                    remove={remove}
                  />
                </div>
              ))}
              <Form.Item className="w-full" wrapperCol={{ offset: 0 }}>
                <Button
                  icon={<PlusOutlined />}
                  className="
      mx-auto 
      mt-2 flex      
      h-8 
      w-full 
      items-center 
      justify-center 
      rounded-sm 
      bg-white
      px-4
      hover:bg-green-100
      dark:bg-gray-700
      dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto
    "
                  type="dashed"
                  onClick={() => add()}
                  block={false}
                >
                  {t("Ялгах утга оруулах")}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>
      {baiguullaga?.tokhirgoo?.aktAshiglakhEsekh === true && (
        <div data-aos="fade-right" data-aos-delay="800">
          <Form.Item
            name="aktiinZagvariinId"
            rules={[
              {
                required: true,
                message: t("Актын загвар сонгоно уу!"),
              },
            ]}
            label={t("Актын загвар сонгох")}
            normalize={(value) => value?.replace(/\s/g, "")}
          >
            <Select
              onChange={(v) =>
                setAktiinZagvar(
                  aktiinZagvarGaralt?.jagsaalt?.find((a) => a._id === v),
                )
              }
              showSearch
              filterOption={(o) => o}
              allowClear
              onSearch={(search) =>
                setAktiinZagvarKhuudaslalt((a) => ({
                  ...a,
                  search,
                  khuudasniiDugaar: 1,
                }))
              }
            >
              {aktiinZagvarGaralt?.jagsaalt?.map((mur) => {
                return <Select.Option key={mur._id}>{mur.ner}</Select.Option>;
              })}
            </Select>
          </Form.Item>
        </div>
      )}
      <div data-aos="fade-right" data-aos-delay="1000">
        <Form.Item
          name="dans"
          rules={[
            { required: true, message: t("Төлөлт хийх данс бүртгэнэ үү!") },
          ]}
          label={t("Төлөлт хийх данс")}
        >
          <FormLavlakh
            selectId={"dans"}
            gereeniiZagvariinId={gereeniiZagvariinId}
            lavlakh="dans"
            token={token}
            placeholder="Данс"
            valKey="dugaar"
            infoKey="dugaar"
            shuukhTalbaruud={["dugaar", "dansniiNer"]}
            InfoComponent={({ data }) => {
              if (data)
                return (
                  <div className="flex flex-col items-center  justify-between space-x-2 p-1 font-medium dark:text-gray-200">
                    <div className="flex flex-row items-center space-x-2 p-1 font-medium dark:text-gray-200">
                      <img
                        className="h-5 w-5"
                        alt="logo"
                        src={`/${data?.bank}.png`}
                      />
                      <div>{data?.dansniiNer}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between space-x-2 p-1 font-medium dark:text-gray-200">
                      <div>{data?.dugaar}</div>
                      <div>{data?.valyut}</div>
                    </div>
                  </div>
                );
              return null;
            }}
          />
        </Form.Item>
      </div>
      {value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="500">
          <Form.Item
            name="gerchilgeeniiZurag"
            label={t("Гэрчилгээний хуулбар")}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra={t("Гэрчилгээний хуулбар")}
          >
            <Upload
              multiple={false}
              name="file"
              listType="picture"
              action={`${url}/zuragKhadgalya`}
              method="POST"
              data={{ turul: "gerchilgeeniiZurag" }}
              headers={{ Authorization: `bearer ${token}` }}
            >
              <Button className="dark:text-gray-300" icon={<UploadOutlined />}>
                {t("Файл сонгох")}
              </Button>
            </Upload>
          </Form.Item>
        </div>
      )}
      {!value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="1000">
          <Form.Item label={t("Хавсаргал")} className="w-full">
            <Form.Item
              name="zuvshuurliinZurag"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra={t("Зөвшөөрлийн бичгийн хуулбар")}
            >
              <Upload
                multiple={false}
                name="file"
                listType="picture"
                action={`${url}/zuragKhadgalya`}
                method="POST"
                data={{ turul: "zuvshuurliinZurag" }}
                headers={{ Authorization: `bearer ${token}` }}
              >
                <Button
                  className="!text-gray-400 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400"
                  icon={<UploadOutlined />}
                >
                  {t("Файл сонгох")}
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="unemlekhniiZurag"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra={t("Иргэний үнэмлэхний хуулбар")}
            >
              <Upload
                multiple={false}
                name="file"
                listType="picture"
                action={`${url}/zuragKhadgalya`}
                method="POST"
                data={{ turul: "unemlekhniiZurag" }}
                headers={{ Authorization: `bearer ${token}` }}
              >
                <Button
                  className="!text-gray-400 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400"
                  icon={<UploadOutlined />}
                >
                  {t("Файл сонгох")}
                </Button>
              </Upload>
            </Form.Item>
          </Form.Item>
        </div>
      )}
      <Form.Item wrapperCol={{ span: 24 }}>
        <div className="flex w-full justify-end">
          <Button
            id="gereeniiKhugatsaaButton"
            type="primary"
            onClick={(e) => form.submit()}
            icon={<ArrowRightOutlined />}
          >
            {t("Үргэлжлүүлэх")}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
