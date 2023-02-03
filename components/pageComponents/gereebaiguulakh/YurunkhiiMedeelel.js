import {
  Form,
  Input,
  Switch,
  Button,
  Upload,
  Select,
  Dropdown,
  Empty,
} from "antd";
import {
  UploadOutlined,
  SolutionOutlined,
  ArrowRightOutlined,
  MailOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import uilchilgee, { url, aldaaBarigch } from "services/uilchilgee";
import FormLavlakh from "components/FormLavlakh";
import { useEffect } from "react";
import Aos from "aos";
import useJagsaalt from "hooks/useJagsaalt";
import { useAuth } from "services/auth";
import KhariltsagchiinLavlakh from "./KhariltsagchiinLavlakh";

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

function YalgakhUtga({ fieldKey, name, remove, ...restField }) {
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
    <>
      <div className="flex flex-row justify-end gap-3 md:ml-44">
        <Form.Item
          className="w-full pl-2"
          wrapperCol={{ offset: 0 }}
          {...restField}
          name={[name, "ner"]}
          fieldKey={[fieldKey, "ner"]}
        >
          <Select style={{ width: "100%" }} placeholder="Нэр" onChange={solikh}>
            {segment?.jagsaalt?.map((mur) => (
              <Select.Option value={mur?.ner}>{mur?.ner}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          className="w-2/4 "
          wrapperCol={{ offset: 0 }}
          {...restField}
          name={[name, "utga"]}
          fieldKey={[fieldKey, "utga"]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Утга"
            onChange={solikhtTurul}
          >
            {turul?.utguud?.map((a) => (
              <Select.Option value={a}>{a}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <CloseCircleOutlined className="pt-2" onClick={() => remove(name)} />
      </div>
    </>
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
  onChangeGereeniiZagvar,
  setGereeniiZagvarKhuudaslalt,
  gereeniiZagvar,
  zagvarRef,
}) => {
  const [form] = Form.useForm();
  const formRef = useRef();

  function onChangeRegister({ target }) {
    var onookhKhariltsagch = {
      ner: undefined,
      utas: undefined,
      ovog: undefined,
      mail: undefined,
      zakhirliinOvog: undefined,
      zakhirliinNer: undefined,
    };
    form.setFieldsValue(onookhKhariltsagch);
    clearTimeout(timeout);
    if (!!target.value && target.value.length > 6) {
      timeout = setTimeout(function () {
        uilchilgee(token)
          .get("/khariltsagch", {
            params: {
              query: {
                barilgiinId,
                baiguullagiinId: baiguullaga._id,
                register: target.value,
                turul: value.baiguullagaEsekh ? "ААН" : "Иргэн",
              },
              select: {
                ner: 1,
                utas: 1,
                ovog: 1,
                mail: 1,
                zakhirliinOvog: 1,
                zakhirliinNer: 1,
              },
            },
          })
          .then(({ data }) => {
            if (data?.jagsaalt.length > 0) {
              const { ner, utas, ovog, mail, zakhirliinOvog, zakhirliinNer } =
                data?.jagsaalt[0];
              if (value.baiguullagaEsekh) {
                var onookhKhariltsagch = {
                  utas,
                  zakhirliinOvog,
                  zakhirliinNer,
                  mail,
                  register: target.value,
                  ner,
                };
              } else {
                var onookhKhariltsagch = {
                  ner,
                  utas,
                  ovog,
                  mail,
                  register: target.value,
                };
              }
              form.setFieldsValue(onookhKhariltsagch);
              onChange({ ...value, ...onookhKhariltsagch });
            } else {
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
            form.getFieldInstance("utas").focus();
            break;
          case "validate_other_ner":
            {
              if (value.baiguullagaEsekh === true) {
                form.getFieldInstance("register").focus();
              } else {
                form.getFieldInstance("utas").focus();
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
    [value.baiguullagaEsekh]
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
          placeholder="Гэрээний загвар сонгох"
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
                      ? "/Түр гэрээ/"
                      : "/Үндсэн гэрээ/"}
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
          rules={[
            {
              required: true,
              message: "Гэрээний дугаар бүртгэнэ үү!",
            },
          ]}
          label="Гэрээний дугаар"
        >
          <Input
            onKeyUp={focuser}
            allowClear
            placeholder="Гэрээний дугаар"
            prefix={<SolutionOutlined />}
          />
        </Form.Item>
      </div>
      <div
        data-aos="fade-right"
        data-aos-delay="300"
        className="flex w-full justify-end gap-2 "
      >
        <p className="mt-1 dark:text-gray-200">Байгууллага эсэх:</p>
        <Form.Item name="baiguullagaEsekh" valuePropName="checked">
          <Switch
            onChange={(v) => {
              const khariltsagch = {
                register: undefined,
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
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-delay="200">
        <Form.Item
          name="register"
          label={"Регистр"}
          rules={[
            {
              required: true,
              len: value.baiguullagaEsekh ? 7 : 10,
              pattern: value.baiguullagaEsekh
                ? new RegExp("(\\d{7})")
                : new RegExp("([А-Я|Ө|Ү]{2})(\\d{8})"),
              message: "Регистр бүртгэнэ үү!",
            },
          ]}
        >
          <KhariltsagchiinLavlakh
            khadgalsabRegister={value.register}
            focuser={focuser}
            baiguullaga={baiguullaga}
            barilgiinId={barilgiinId}
            onChangeRegister={onChangeRegister}
            baiguullagaEsekh={value.baiguullagaEsekh}
          />
        </Form.Item>
      </div>
      {value.baiguullagaEsekh && (
        <div data-aos="fade-right">
          <Form.Item
            name="ner"
            label={"Байгууллага нэр"}
            rules={[
              { required: true, message: "Байгууллага нэр бүртгэнэ үү!" },
            ]}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              placeholder="Байгууллага нэр"
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {!value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="500">
          <Form.Item
            rules={[{ required: true, message: "Овог бүртгэнэ үү!" }]}
            name="ovog"
            label={"Овог"}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              placeholder="Овог"
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {!value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="600">
          <Form.Item
            name="ner"
            rules={[{ required: true, message: "Нэр бүртгэнэ үү!" }]}
            label={"Нэр"}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              placeholder="Нэр"
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="300">
          <Form.Item
            name="zakhirliinOvog"
            label={"Захирлын овог"}
            rules={[{ required: true, message: "Овог бүртгэнэ үү!" }]}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              placeholder="Овог"
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="400">
          <Form.Item
            name="zakhirliinNer"
            label={"Захирлын нэр"}
            rules={[{ required: true, message: "Нэр бүртгэнэ үү!" }]}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              placeholder="Нэр"
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {!value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="700">
          <Form.Item
            name="utas"
            rules={[{ required: true, message: "Утас бүртгэнэ үү!" }]}
            label={"Утас"}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              placeholder="Утас"
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="700">
          <Form.Item
            name="utas"
            rules={[{ required: true, message: "Утас бүртгэнэ үү!" }]}
            label={"Утас"}
          >
            <Input
              onKeyUp={focuser}
              allowClear
              placeholder="Утас"
              prefix={<SolutionOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {!value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="800">
          <Form.Item name="mail" label={"И-мэйл хаяг"}>
            <Input
              onKeyUp={focuser}
              type="email"
              placeholder="И-мэйл хаяг"
              allowClear
              prefix={<MailOutlined />}
            />
          </Form.Item>
        </div>
      )}
      {value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="800">
          <Form.Item
            name="mail"
            rules={[{ required: true, message: "И-мэйл хаяг бүртгэнэ үү!" }]}
            label={"И-мэйл хаяг"}
          >
            <Input
              onKeyUp={focuser}
              type="email"
              placeholder="И-мэйл хаяг"
              allowClear
              prefix={<MailOutlined />}
            />
          </Form.Item>
        </div>
      )}
      <div data-aos="fade-right" data-aos-delay="900">
        <Form.List name="segmentuud" className=" ">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key}>
                  <YalgakhUtga
                    key={key}
                    name={name}
                    fieldKey={fieldKey}
                    {...restField}
                    remove={remove}
                  />
                </div>
              ))}
              <Form.Item className="" wrapperCol={{ offset: 10 }}>
                <Button
                  icon={<PlusOutlined />}
                  className="h-8 w-full rounded-sm bg-white  hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700  "
                  type="dashed"
                  onClick={() => add()}
                  block
                >
                  Ялгах утга оруулах
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>
      <div data-aos="fade-right" data-aos-delay="1000">
        <Form.Item
          name="dans"
          rules={[{ required: true, message: "Төлөлт хийх данс бүртгэнэ үү!" }]}
          label={"Төлөлт хийх данс"}
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
                  <div className="flex flex-row items-center space-x-2 p-1 font-medium dark:text-gray-200">
                    <img
                      className="h-5 w-5"
                      alt="logo"
                      src={`/${data?.bank}.png`}
                    />
                    <div>{data?.dansniiNer}</div>
                    <div>{data?.dugaar}</div>
                    <div>{data?.valyut}</div>
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
            label={"Гэрчилгээний хуулбар"}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Гэрчилгээний хуулбар"
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
                Файл сонгох
              </Button>
            </Upload>
          </Form.Item>
        </div>
      )}
      {!value.baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="1000">
          <Form.Item label={"Хавсаргал"} className="w-full">
            <Form.Item
              name="zuvshuurliinZurag"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Зөвшөөрлийн бичгийн хуулбар"
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
                  className="dark:text-gray-300"
                  icon={<UploadOutlined />}
                >
                  Файл сонгох
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="unemlekhniiZurag"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Иргэний үнэмлэхний хуулбар"
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
                  className="dark:text-gray-300"
                  icon={<UploadOutlined />}
                >
                  Файл сонгох
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
            Гэрээний хугацаа
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
