import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Form,
  Input,
  message,
  Select,
  TimePicker,
  InputNumber,
  Switch,
  Space,
  Button,
  Row,
  Col,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { t } from "i18next";
import moment from "moment";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import axios from "axios";

function TsagBurtgel(
  {
    data,
    barilgiinId,
    baiguullagiinId,
    token,
    destroy,
    onRefresh,
    ajiltan,
    barCodes,
    setBarCodes,
  },
  ref
) {
  const [form] = Form.useForm();
  const [tsag, setTsag] = useState({
    ekhlekhtsag: moment(Date.now()),
    duusakhTsag: undefined,
  });
  const [khugatsaa, setKhugatsaa] = useState(undefined);
  const [asragchiinToo, setAsragchiinToo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulegEsekh, setBulegEsekh] = useState(false);
  const [togolsonToo, setTogolsonToo] = useState(0);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        form.submit();
      },
      khaaya() {
        destroy();
      },
    }),
    [form, {}]
  );

  function khugatsaaTootsoloy(khugatsaa) {
    setTsag({
      ekhlekhtsag: moment(tsag.ekhlekhtsag),
      duusakhTsag: moment(tsag.ekhlekhtsag).add(khugatsaa, "minute"),
    });
    setKhugatsaa(khugatsaa);
  }

  function onFinish(formData) {
    setLoading(true);
    const data = formData;
    if (data.utas?.length === 0) {
      data.utas = [""];
    }
    if (!data.turul) {
      data.turul = "Үйлчлүүлэгч";
    }
    data.ognoo = moment(tsag.ekhlekhtsag).format("YYYY-MM-DD 00:00:00");
    data.burtgesenAjiltaniiId = ajiltan?._id;
    data.barilgiinId = barilgiinId;
    const tasalbarShirkheg = data.khuukhdiinToo;
    const method = data?._id ? updateMethod : createMethod;
    method("togloomiinTuvKhadgalya", token, data)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          if (baiguullagiinId === "66cd8c682375830948ea46ca")
            handleTasalbariinBarCode(tasalbarShirkheg || 1);
          message.success(t("Амжилттай хадгаллаа"));
          onRefresh && onRefresh();
          setLoading(false);
          destroy();
          axios
            .post("http://localhost:3000/qrBurtgey", {
              ekhlekhOgnoo: tsag?.ekhlekhtsag,
              duusakhOgnoo: tsag?.duusakhTsag,
            })
            .then(function (response) {
              message.warning(response);
            })
            .catch(function (error) {
              message.error(error);
            });
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setLoading(false);
      });
  }

  const handleTasalbariinBarCode = (tasalbarShirkheg) => {
    barCodes = [];
    setBarCodes([]);
    if (!!tasalbarShirkheg && tasalbarShirkheg > 0)
      for (var i = 0; i < tasalbarShirkheg; i++) {
        const nowDate = new Date();
        const year = nowDate.getFullYear();
        const month = nowDate.getMonth() + 1;
        const day = nowDate.getDate();
        const hours = nowDate.getHours();
        const minutes = nowDate.getMinutes();
        const seconds = nowDate.getSeconds();
        const value =
          ((year - 2000) * 12 * 31 + (month - 1) * 31 + (day - 1)) *
            (24 * 60 * 60) +
          hours * 60 * 60 +
          minutes * 60 +
          seconds +
          i;
        barCodes.push(value);
      }
    setBarCodes(barCodes);
  };

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "ovog":
          form.getFieldInstance("ner").focus();
          break;
        case "ner":
          form.getFieldInstance("khuis").focus();
          break;
        case "nas":
          form.getFieldInstance("utas").focus();
          break;
        case "khuukhdiinToo":
          form.getFieldInstance("utas").focus();
          break;
        case "utas":
          form.getFieldInstance("asragchiinTurul").focus();
          break;
        case "khugatsaa":
          document.getElementById("khuukhedBurtgekhButtonId").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  useEffect(() => {
    form.setFieldValue("ekhlekhTsag", tsag.ekhlekhtsag);
    form.setFieldValue("duusakhTsag", tsag.duusakhTsag);
  }, [tsag]);

  function dugaarShalgay(e) {
    const dugaar = e.target.value;
    if (dugaar.length > 7 && !data) {
      uilchilgee(token)
        .post("/suuldUilchluulsenTuukhAvya", { dugaar: dugaar })
        .then(({ data }) => {
          if (!!data) {
            form.setFieldValue("ovog", data.ovog);
            form.setFieldValue("ner", data.ner);
            form.setFieldValue("nas", data.nas);
            form.setFieldValue("khuis", data.khuis);
            setTogolsonToo(data?.togolsonToo);
          }
        });
    }
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={data}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item name="_id" noStyle />
      <div className="flex items-baseline justify-center gap-5">
        <Form.Item labelCol={{ span: 17 }} label={t("Бүлэг хүүхэд")}>
          <Switch checked={bulegEsekh} onChange={(v) => setBulegEsekh(v)} />
        </Form.Item>

        <div className="dark:texxt-gray-500 flex gap-2">
          <div className="dark:text-gray-300">{t("Тоглосон тоо")}:</div>
          <div className="dark:text-gray-300">{togolsonToo}</div>
        </div>
      </div>

      <Form.List labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} name="utas">
        {(fields, { add, remove }) => (
          <>
            <div className={"max-h-[150px] overflow-auto "}>
              {fields.map(({ key, name, ...restField }) => (
                <Row className="flex items-baseline gap-1">
                  <Col span={23}>
                    <Form.Item
                      name={name}
                      rules={[
                        {
                          required: true,
                          message: t("Утас бүртгэнэ үү!"),
                        },
                        {
                          required:
                            form.getFieldValue("utas")?.length > 0 && true,
                          min: 8,
                          max: 8,
                          message: t("Утасны дугаараа шалгана уу!"),
                        },
                      ]}
                      label={t("Утас")}
                    >
                      <Input
                        maxLength={8}
                        onKeyDown={focuser}
                        onChange={(v) => dugaarShalgay(v)}
                        placeholder={t("Утас")}
                        autoComplete="off"
                      />
                    </Form.Item>
                  </Col>
                  <Col className="flex items-center justify-center dark:text-gray-300">
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
            </div>
            <Form.Item>
              <Button
                type="default"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                {t("Дугаар нэмэх")}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {bulegEsekh === true && (
        <Form.Item
          rules={[
            {
              required: true,
              message: t("Хүүхдийн тоо бүртгэнэ үү!"),
            },
          ]}
          label={t("Хүүхдийн тоо")}
          name="khuukhdiinToo"
        >
          <InputNumber
            min={2}
            onKeyDown={focuser}
            placeholder={t("Хүүхдийн тоо")}
            className="w-40"
          />
        </Form.Item>
      )}
      {bulegEsekh === false && (
        <Form.Item label={t("Овог")} name="ovog">
          <Input
            onKeyDown={focuser}
            placeholder={t("Овог")}
            autoComplete="off"
          />
        </Form.Item>
      )}
      <Form.Item label={t("Нэр")} name="ner">
        <Input onKeyDown={focuser} placeholder={t("Нэр")} autoComplete="off" />
      </Form.Item>
      {bulegEsekh === false && (
        <Form.Item label={t("Хүйс")} name="khuis">
          <Select
            onChange={() => form.getFieldInstance("nas").focus()}
            placeholder={t("Хүйс")}
          >
            {[
              { utga: "Эрэгтэй", v: 1 },
              { utga: "Эмэгтэй", v: 0 },
            ].map((a) => (
              <Select.Option key={a.v} value={a.v}>
                {t(a.utga)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {bulegEsekh === false && (
        <Form.Item
          rules={[
            {
              required: true,
              message: t("Нас бүртгэнэ үү!"),
            },
          ]}
          label={t("Нас")}
          name="nas"
        >
          <InputNumber
            onKeyDown={focuser}
            className="w-40"
            placeholder={t("Нас")}
            min="1"
            max="12"
          />
        </Form.Item>
      )}
      <Form.Item
        rules={[
          {
            required: true,
            message: t("Асран хамгаалагч бүртгэнэ үү!"),
          },
        ]}
        label={t("Асран хамгаалагч")}
        name="asragchiinTurul"
      >
        <Select
          mode="multiple"
          value={asragchiinToo}
          onChange={(v) => {
            setAsragchiinToo(v);
          }}
          placeholder={t("Асран хамгаалагч")}
        >
          {["Аав", "Ээж", "Өвөө", "Эмээ", "Ах", "Эгч", "Багш", "Бусад"].map(
            (a) => {
              return <Select.Option key={a}>{a}</Select.Option>;
            }
          )}
        </Select>
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: t("Тоглох цаг /Мин/ бүртгэнэ үү!"),
          },
        ]}
        label={t("Тоглох цаг /Мин/")}
        name="khugatsaa"
      >
        <InputNumber
          max={moment()
            .endOf("day")
            .subtract(119, "minutes")
            .diff(moment(), "minutes")}
          value={khugatsaa}
          onKeyDown={focuser}
          className="w-40"
          onChange={(v) => {
            khugatsaaTootsoloy(v);
          }}
          placeholder={t("Тоглох цаг /Мин/")}
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: t("Эхлэх цаг бүртгэнэ үү!"),
          },
        ]}
        label={t("Эхлэх цаг")}
        name="ekhlekhTsag"
      >
        <TimePicker
          value={tsag.ekhlekhtsag}
          className="w-40"
          onChange={(v) =>
            setTsag({
              ekhlekhtsag: v,
              duusakhTsag: moment(v).add(
                form.getFieldValue("khugatsaa") || 0,
                "minute"
              ),
            })
          }
          showSecond={false}
          placeholder={t("Эхлэх цаг")}
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item label={t("Дуусах цаг")} name="duusakhTsag">
        <TimePicker
          showSecond={false}
          placeholder={t("Дуусах цаг")}
          disabled
          className="w-40"
          value={tsag.duusakhTsag}
          onChange={(v) => setTsag({ ...tsag, duusakhTsag: v })}
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item label={t("Төрөл")} name="turul">
        <Select placeholder="Төрөл" defaultValue={"Үйлчлүүлэгч"}>
          <Select.Option key={"Үйлчлүүлэгч"}>{t("Үйлчлүүлэгч")}</Select.Option>
          <Select.Option key={"Гишүүн"}>{t("Гишүүн")}</Select.Option>
        </Select>
      </Form.Item>
      <div className="flex justify-end">
        <Space>
          <Button onClick={() => destroy()}>
            <div className="dark:text-[#E5E7EB]">{t("Хаах")}</div>
          </Button>
          <Button
            loading={loading}
            type="primary"
            id="khuukhedBurtgekhButtonId"
            onClick={() => form.submit()}
          >
            {t("Хадгалах")}
          </Button>
        </Space>
        ,
      </div>
    </Form>
  );
}

export default React.forwardRef(TsagBurtgel);
