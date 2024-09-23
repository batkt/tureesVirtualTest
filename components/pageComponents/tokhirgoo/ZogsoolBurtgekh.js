import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Form,
  Select,
  Input,
  Button,
  notification,
  InputNumber,
  Divider,
  TimePicker,
  Switch,
} from "antd";
import {
  CloseCircleOutlined,
  MinusCircleOutlined,
  SettingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { aldaaBarigch } from "services/uilchilgee";
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import StreamTokhirgoo from "./StreamTokhirgoo";
import StreamTokhirgooIp from "./StreamTokhirgooIp";
import { modal } from "components/ant/Modal";
import camera from "pages/khyanalt/zogsool/camera";

/**
 * khaalga.turul Select.Option value(Орох, Гарах) гэснийг өөрчилж болохгүй
 * Parking.н backend дээр (Орох, Гарах) гэж хадгалсан утгаар хайж байгаа
 */

function ZogsoolBurtgekh(
  { data, jagsaalt, barilgiinId, destroy, token, refresh },
  ref
) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [unshijBaina, setUnshijBaina] = useState(false);
  const streamTokhirgooRef = useRef(null);
  let method;
  if (!!data) {
    let toForm = data;
    method = updateMethod;
    if (toForm?.tulburuud.length > 0)
      for (let i = 0; toForm?.tulburuud.length > i; i++) {
        const d = toForm?.tulburuud[i];
        if (d?.tsag.length > 0)
          for (let k = 0; d.tsag.length > k; k++) {
            toForm.tulburuud[i].tsag[k] = moment(d.tsag[k]);
          }
        else continue;
      }
    form.setFieldsValue({ ...toForm });
  } else method = createMethod;
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

  useImperativeHandle(
    ref,
    () => ({
      async khadgalya() {
        try {
          let body = form.getFieldsValue();
          console.log("from -------save -----------------" + JSON.stringify(body));
          body.barilgiinId = barilgiinId;

          await method("parking", token, body)
            .then(({ data }) => {
              if (data === "Amjilttai") {
                notification.success({ message: t("Амжилттай хадгаллаа") });
                destroy();
                refresh();
              }
            })
            .catch((e) => {
              aldaaBarigch(e);
            });
        } catch (e) {
          aldaaBarigch(e);
        }
      },
      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  function cameraTokhirgooOruulya() {
    const footer = [
      <Button type="primary" onClick={() => streamTokhirgooRef.current.khaaya()}>
        {t("Хаах")}
      </Button>,
      <Button
        loading={unshijBaina}
        type="primary"
        onClick={() => streamTokhirgooRef.current.khadgalya()}
      >
        {t("Хадгалах")}
      </Button>,
    ];
    const style = {
      maxWidth: 400,
    };
    modal({
      title: t("Камер Stream тохиргоо"),
      icon: <PlusOutlined />,
      style: { ...style },
      content: (
        <StreamTokhirgoo
          ref={streamTokhirgooRef}
          token={token}
          data={data}
          setUnshijBaina={setUnshijBaina}
          refresh={refresh}
        />
      ),
      footer,
    });
  }

  return (
    <Form form={form} autoComplete="off">
      {!!data && <Form.Item name="_id" hidden></Form.Item>}
      <Form.Item name="barilgiinId" hidden></Form.Item>
      <div className="grid h-[95vh] grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="grid h-[95vh] grid-cols-4 gap-5 overflow-y-auto">
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                {t("Зогсоолын нэр")}
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item
                className="m-0"
                name="ner"
                rules={[
                  {
                    required: true,
                    message: t("Нэр оруулна уу!"),
                  },
                ]}
              >
                <Input placeholder="Нэр" autoFocus={true} />
              </Form.Item>
            </div>
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                {t("Нийт зогсоолын тоо")}
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item
                className="m-0"
                name="too"
                rules={[
                  {
                    required: true,
                    message: t("Нийт зогсоолын тоо оруулна уу!"),
                  },
                ]}
              >
                <Input placeholder="Тоо" />
              </Form.Item>
            </div>
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                {t("Үндсэн тариф")}
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item
                className="m-0"
                name="undsenUne"
                rules={[
                  {
                    required: true,
                    message: t("Үндсэн тариф оруулна уу!"),
                  },
                ]}
              >
                <Input placeholder="Тариф " />
              </Form.Item>
            </div>
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                {t("Зогсоолын данс")}
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item
                className="m-0"
                name="zogsooliinDans"
                rules={[
                  {
                    required: false,
                    message: t("Зогсоолын данс оруулна уу!"),
                  },
                ]}
              >
                <Input placeholder="Зогсоолын данс" />
              </Form.Item>
            </div>
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                {t("Үндсэн тариф 30мин эсэх")}
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item className="m-0" name="undsenMin">
                <Switch
                  className="bg-gray-400"
                  defaultChecked={data?.undsenMin}
                  checkedChildren="мин"
                  unCheckedChildren="цаг"
                />
              </Form.Item>
            </div>
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                {t("Гарах цаг")}
              </div>
              <div className="text-xs text-gray-400">
                Төлбөрөө урьдчилж төлсөн тохиолдолд зогсоолоос гарах ёстой
                хугацаа/мин. Хоосон тохиолдолд 30мин байна
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item className="m-0" name="garakhTsag">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Хугацаа/мин"
                />
              </Form.Item>
            </div>
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                {t("Гадна зогсоол сонгох")}
              </div>
              <div className="text-xs text-gray-400">
                Зөвхөн дотор зогсоол нэмэх үед сонгоно уу!
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item className="m-0" name="gadnaZogsooliinId">
                <Select placeholder="Зогсоол сонгох">
                  <Select.Option value={undefined}>---</Select.Option>
                  {jagsaalt.map((mur, i) =>
                    !!data ? (
                      mur._id !== data._id && (
                        <Select.Option key={i} value={mur?._id}>
                          {mur?.ner}
                        </Select.Option>
                      )
                    ) : (
                      <Select.Option key={i} value={mur?._id}>
                        {mur?.ner}
                      </Select.Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </div>
            {!!data && (
              <>
                <div className="col-span-2 border-l-2 border-green-500 pl-4">
                  <div className="font-medium dark:text-white">
                    {t("Камер Stream тохиргоо")}
                  </div>
                  <div className="text-xs text-gray-400">
                    Stream гаргахад шаардлагатай тохиргоо
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-start">
                  <Button type="primary" onClick={cameraTokhirgooOruulya}>
                    Тохиргоо оруулах
                  </Button>
                </div>
              </>
            )}
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                {t("Орох хаалга гар тохиргоо")}
              </div>
              <div className="text-xs text-gray-400">
                Асаах үед зогсоолын хаалтыг зөвхөн гараас, утраахад зогсоолын
                хаалт автоматаар ажиллана.
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item className="m-0" name="orokhKhaalgaGarTokhirgoo">
                <Switch
                  className="bg-gray-400"
                  defaultChecked={data?.orokhKhaalgaGarTokhirgoo}
                  checkedChildren="Гараас"
                  unCheckedChildren="Автомат"
                />
              </Form.Item>
            </div>
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                {t("Гарах хаалга гар тохиргоо")}
              </div>
              <div className="text-xs text-gray-400">
                Асаах үед зогсоолын хаалтыг зөвхөн гараас, утраахад зогсоолын
                хаалт автоматаар ажиллана.
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item className="m-0" name="garakhKhaalgaGarTokhirgoo">
                <Switch
                  className="bg-gray-400"
                  defaultChecked={data?.garakhKhaalgaGarTokhirgoo}
                  checkedChildren="Гараас"
                  unCheckedChildren="Автомат"
                />
              </Form.Item>
            </div>
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                {t("Шалтгаан заавал бүртгэх")}
              </div>
              <div className="text-xs text-gray-400">
                Үйлчлүүлэгч үнэгүй гаргах үед зөрчил заавал бүртгэнэ.
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item className="m-0" name="zurchilZaavalBurtgekhEsekh">
                <Switch
                  className="bg-gray-400"
                  defaultChecked={data?.zurchilZaavalBurtgekhEsekh}
                  checkedChildren="Тийм"
                  unCheckedChildren="Үгүй"
                />
              </Form.Item>
            </div>
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                Зогсоолоос машин автоматаар гаргах цагийн тохиргоо
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item className="m-0" name="mashinGargakhKhugatsaa">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Хугацаа/цаг"
                />
              </Form.Item>
            </div>
            <div className="col-span-2 border-l-2 border-green-500 pl-4">
              <div className="font-medium dark:text-white">
                Баазаас машины түүхийн мэдээлэл цэвэрлэгдэх өдөр сонгох
              </div>
            </div>
            <div className="col-span-2">
              <Form.Item className="m-0" name="mashinUstgakhKhugatsaa">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Хугацаа/Хоног"
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <Form.List name="tulburuud">
            {(fields, { add, remove }) => (
              <>
                <Button
                  icon={<PlusOutlined />}
                  className="mb-3 flex w-full bg-green-200 hover:bg-green-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                  type="dashed"
                  onClick={() => add()}
                >
                  Тариф нэмэх
                </Button>
                <div
                  className="space-y-3 overflow-y-auto"
                  style={{ maxHeight: "70vh" }}
                >
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Tariff
                      key={key}
                      name={name}
                      fieldKey={fieldKey}
                      restField={restField}
                      fields={fields}
                      remove={remove}
                    />
                  ))}
                  {/*
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <div
                      key={fieldKey}
                      className=" relative mb-5 rounded-md border bg-green-50 px-10 py-4 shadow-md dark:bg-gray-700 2xl:pr-20"
                    >
                      <div className="grid w-full grid-cols-4 items-center gap-5">
                        <div
                          onClick={() => remove(name)}
                          className="absolute right-2 top-[2%] flex text-lg transition-all hover:text-red-500"
                        >
                          <CloseCircleOutlined />
                        </div>
                        <Form.Item
                          label="Минут хүртэл:"
                          labelCol={{ span: 24 }}
                          {...restField}
                          name={[name, "minut"]}
                          fieldKey={[fieldKey, "minut"]}
                          rules={[
                            { required: true, message: "Минут бөглөнө үү." },
                          ]}
                          className="col-span-2 mb-0"
                        >
                          <InputNumber placeholder="Минут" className="w-full" />
                        </Form.Item>
                        <Form.Item
                          label="Тариф/₮/:"
                          labelCol={{ span: 24 }}
                          {...restField}
                          name={[name, "tulbur"]}
                          fieldKey={[fieldKey, "tulbur"]}
                          rules={[
                            { required: true, message: "Тариф бөглөнө үү." },
                          ]}
                          className="col-span-2 mb-0"
                        >
                          <InputNumber
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            className="w-full"
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            placeholder="Тариф"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  ))}
*/}
                </div>
              </>
            )}
          </Form.List>
        </div>
        <div className="col-span-4">
          <Form.List name="khaalga">
            {(fields, { add, remove }) => (
              <>
                <Button
                  icon={<PlusOutlined />}
                  className="mb-3 flex w-full bg-green-200 hover:bg-green-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                  type="dashed"
                  onClick={() => add()}
                >
                  Хаалга нэмэх
                </Button>
                <div
                  className="space-y-3 overflow-y-auto"
                  style={{ maxHeight: "70vh" }}
                >
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Khaalga
                      form={form}
                      token={token}
                      refresh={refresh}
                      barilgiinId={barilgiinId}
                      key={key}
                      name={name}
                      fieldKey={fieldKey}
                      restField={restField}
                      fields={fields}
                      remove={remove}
                    />
                  ))}
                </div>
              </>
            )}
          </Form.List>
        </div>
      </div>
    </Form>
  );
}

function Khaalga({ form, token, refresh, barilgiinId, name, fieldKey, restField, remove }) {
  const { t } = useTranslation();
  const streamTokhirgooRefIP = useRef(null);
  const [unshijBaina, setUnshijBaina] = useState(false);
  
  function cameraTokhirgooOruulyaIp(data, index) {
    const values = form.getFieldsValue();
    const cameraIP = values?.khaalga[name]?.camera[index]?.cameraIP;
    const footer = [
      <Button type="primary" onClick={() => streamTokhirgooRefIP.current.khaaya()}>
        {t("Хаах")}
      </Button>,
      <Button
        loading={unshijBaina}
        type="primary"
        onClick={() => streamTokhirgooRefIP.current.khadgalya()}
      >
        {t("Хадгалах")}
      </Button>,
    ];
    const style = {
      maxWidth: 400,
    };
    const cameraObject = values?.khaalga[name]?.camera[index];
    function saveTokhirgoo(value) {
      const values = form.getFieldsValue();
      values.khaalga[name].camera[index].tokhirgoo = value;
      form.setFieldsValue(values); 
      const a = form.getFieldsValue();
      console.log("getFieldsValue ------------>>"+JSON.stringify(a));
    }
    
    modal({
      title: cameraIP + " " + t("камерын stream тохиргоо"),
      icon: <PlusOutlined />,
      style: { ...style },
      content: (
        <StreamTokhirgooIp
          ref={streamTokhirgooRefIP}
          token={token}
          cameraObject={cameraObject}
          setUnshijBaina={setUnshijBaina}
          refresh={refresh}
          saveTokhirgoo={saveTokhirgoo}
        />
      ),
      footer,
    });
  }

  return (
    <div
      key={fieldKey}
      className="relative mb-2 rounded-md border bg-yellow-50 px-5 py-4 shadow-md dark:bg-gray-700"
    >
      <div className="mb-2 flex justify-center text-base font-bold dark:text-white">
        {t("Хаалга")} {fieldKey + 1}
      </div>
      <div className="grid w-full grid-cols-4 items-center gap-5">
        <div
          onClick={() => remove(name)}
          className="absolute right-2 top-[2%] flex text-lg transition-all hover:text-red-500"
        >
          <CloseCircleOutlined />
        </div>
        <Form.Item
          label="Нэр:"
          labelCol={{ span: 24 }}
          {...restField}
          name={[name, "ner"]}
          fieldKey={[fieldKey, "ner"]}
          rules={[{ required: true, message: "Нэр бөглөнө үү." }]}
          className="col-span-2 mb-0 h-20"
        >
          <Input placeholder={t("Ялгах нэр")} />
        </Form.Item>
        <Form.Item
          label="Төрөл:"
          labelCol={{ span: 24 }}
          {...restField}
          name={[name, "turul"]}
          fieldKey={[fieldKey, "turul"]}
          rules={[{ required: true, message: "Төрөл бөглөнө үү." }]}
          className="col-span-2 mb-0 h-20"
        >
          <Select style={{ width: "100%" }} placeholder={t("Орох / Гарах")}>
            <Select.Option value={"Орох"}>{t("Орох")}</Select.Option>
            <Select.Option value={"Гарах"}>{t("Гарах")}</Select.Option>
          </Select>
        </Form.Item>
      </div>
      <Form.List name={[name, "camera"]}>
        {(talbaruud, { add, remove }) => (
          <>
            <Button
              className="mt-5 h-8 w-full rounded-sm bg-white  hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700  "
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              {t("Камер нэмэх")}
            </Button>
            {talbaruud.map((talbar) => (
              <div className="mt-5 flex">
                <Form.Item
                  {...talbar.restField}
                  name={[talbar.name, "cameraIP"]}
                  fieldKey={[talbar.key, "cameraIP"]}
                  className="m-0 w-full"
                >
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Камер IP оруулна уу..."
                  />
                </Form.Item>
                <SettingOutlined 
                  className="ml-2 mt-2"
                  onClick={() => cameraTokhirgooOruulyaIp(talbar, talbar.name)}/>
                <MinusCircleOutlined
                  className="ml-2 mt-2"
                  onClick={() => remove(talbar.name)}
                />
              </div>
            ))}
          </>
        )}
      </Form.List>
    </div>
  );
}

function Tariff({ name, fieldKey, restField, remove }) {
  const { t } = useTranslation();
  return (
    <div
      key={fieldKey}
      className="relative mb-5 rounded-md border bg-green-50 px-5 py-4 shadow-md dark:bg-gray-700"
    >
      <div className="mb-2 flex justify-center text-base font-bold dark:text-white">
        {t("Тариф")} {fieldKey + 1}
      </div>
      <div className="grid w-full grid-cols-4 items-center gap-5">
        <div
          onClick={() => remove(name)}
          className="absolute right-2 top-[2%] flex text-lg transition-all hover:text-red-500"
        >
          <CloseCircleOutlined />
        </div>
        <Form.Item
          label="Цаг:"
          labelCol={{ span: 24 }}
          {...restField}
          name={[name, "tsag"]}
          fieldKey={[fieldKey, "tsag"]}
          // rules={[{ required: true, message: "Цаг бөглөнө үү." }]}
          className="col-span-3 mb-0 h-20"
        >
          <TimePicker.RangePicker
            format="HH:mm"
            placeholder={["Эхлэх", "Дуусах"]}
          />
        </Form.Item>
      </div>
      <Form.List name={[name, "tariff"]}>
        {(muruud, { add, remove }) => (
          <>
            <Button
              className="mt-5 h-8 w-full rounded-sm bg-white  hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700  "
              type="dashed"
              onClick={() => add()}
              // id={"tariff"}
              block
              icon={<PlusOutlined />}
            >
              {t("Нэмэх")}
            </Button>
            {muruud.map((mur, index) => (
              <div
                key={index}
                className="flex-center mt-3 grid w-full grid-cols-4 items-end gap-5"
              >
                <Form.Item
                  label="Минут хүртэл:"
                  labelCol={{ span: 24 }}
                  {...mur.restField}
                  name={[mur.name, "minut"]}
                  fieldKey={[mur.key, "minut"]}
                  rules={[{ required: true, message: "Минут бөглөнө үү." }]}
                  className="col-span-2 mb-0"
                >
                  <InputNumber placeholder="Минут" className="w-full" />
                </Form.Item>
                <div className="col-span-2 flex items-end">
                  <Form.Item
                    label="Тариф/₮/:"
                    labelCol={{ span: 24 }}
                    {...mur.restField}
                    name={[mur.name, "tulbur"]}
                    fieldKey={[mur.key, "tulbur"]}
                    rules={[{ required: true, message: "Тариф бөглөнө үү." }]}
                    className="mb-0"
                  >
                    <InputNumber
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      className="w-full"
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder="Тариф"
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    className="mb-2.5 ml-2"
                    onClick={() => remove(mur.name)}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </Form.List>
    </div>
  );
}

export default React.forwardRef(ZogsoolBurtgekh);
