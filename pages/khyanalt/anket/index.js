import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tabs,
} from "antd";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import moment from "moment";
import _ from "lodash";

import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Aos from "aos";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  DoubleRightOutlined,
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";

import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useAuth } from "services/auth";
import useJagsaalt from "hooks/useJagsaalt";
import { modal } from "components/ant/Modal";
import AnketIlgeekh from "components/pageComponents/anket/AnketIlgeekh";
import { useTranslation } from "react-i18next";

const str = "A";
function AsuultOruulakh({ name, fieldKey, restField, fields, remove }) {
  const { t } = useTranslation();
  const [hide, setHide] = React.useState(true);
  return (
    <Form.Item
      className="block rounded-md border px-2 py-4 shadow-lg "
      key={fieldKey}
    >
      <div className="relative space-y-3">
        <Form.Item
          name={[name, "asuult"]}
          fieldKey={[fieldKey, "asuult"]}
          {...restField}
          rules={[
            {
              required: true,
              message: t("Асуулт оруулна уу!"),
            },
          ]}
          //validateTrigger={["onChange", "onBlur"]}
        >
          <Input
            placeholder={t("Асуулт", { count: name + 1 })}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name={[name, "turul"]}
          fieldKey={[fieldKey, "turul"]}
          {...restField}
        >
          <Select
            placeholder={t("Хариултын төрөл")}
            defaultValue={"boglokh"}
            options={[
              { label: t("Бөглөх"), value: "boglokh" },
              { label: t("Сонгох"), value: "songokh" },
            ]}
            onChange={(e) => (e === "songokh" ? setHide(false) : setHide(true))}
          />
        </Form.Item>
        {fields.length > 0 ? (
          <div className="absolute -right-3 -top-11 rounded-full bg-white dark:bg-gray-900 lg:-right-5 lg:-top-10">
            <CloseCircleOutlined
              className="dynamic-delete-button text-2xl text-black text-opacity-60 transition-colors hover:text-red-400 dark:text-white dark:text-opacity-50"
              onClick={() => {
                remove(name);
              }}
            />
          </div>
        ) : null}
      </div>
      {hide === false && (
        <div className="mt-5">
          <Form.List
            rules={[
              {
                required: true,
                message: t("Хариулт оруулна уу!"),
              },
            ]}
            name={[name, "khariultuud"]}
            fieldKey={[fieldKey, "khariultuud"]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, key) => (
                  <Form.Item
                    key={key}
                    name={field.name}
                    fieldId={field.key}
                    {...field.restField}
                    rules={[
                      { required: true, message: t("Хариулт оруулна уу!") },
                    ]}
                  >
                    <div className="relative pr-8">
                      <Input
                        placeholder={`Хариулт ${String.fromCharCode(
                          str.charCodeAt(str.length - 1) + field.name
                        )}`}
                        style={{ width: "100%" }}
                      />
                      <MinusCircleOutlined
                        className="dynamic-delete-button absolute right-2 top-0 text-xl text-black text-opacity-50 dark:text-white dark:text-opacity-50"
                        onClick={() => remove(field.name)}
                      />
                    </div>
                  </Form.Item>
                ))}
                <Button
                  className=" dark:bg-gray-800 dark:text-white"
                  style={{ width: "100%" }}
                  type={"sideKick"}
                  onClick={() => add()}
                  icon={<PlusOutlined className="text-xs" />}
                >
                  {t("Хариулт оруулах")}
                </Button>
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>
        </div>
      )}
    </Form.Item>
  );
}
function AnketiinZagvar({
  a,
  setData,
  anketUstgay,
  data,
  anketIlgeeye,
  ognoo,
}) {
  const { t } = useTranslation();
  const query = useMemo(() => {
    let asuultiinId = a._id;
    return {
      asuultiinId,
      ognoo: ognoo
        ? {
            $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };
  }, [a, khariult, ognoo]);
  const khariult = useJagsaalt("/khariult", query, { ognoo: -1 });
  const [kharakh, setKharakh] = useState(false);
  return (
    <div
      className="group"
      onClick={() => {
        setKharakh(!kharakh);
      }}
    >
      <div
        key={a._id}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-green-600 bg-green-600 bg-opacity-5 p-2 shadow-lg dark:text-gray-200 md:block lg:flex"
      >
        <div>{a.ner}</div>
        <div className="flex justify-end gap-2">
          <Button
            className="bg-white text-green-400 hover:text-green-600 dark:bg-gray-900 "
            onClick={(e) => {
              e.stopPropagation();
              anketIlgeeye(a);
            }}
            icon={<SendOutlined className="dark:text-green-400" />}
          />
          <Button
            className="bg-white text-blue-400 hover:text-blue-600 dark:bg-gray-900 "
            onClick={(e) => {
              e.stopPropagation();
              setData({ ...a, khariultuud: undefined });
            }}
            icon={<EyeOutlined className="dark:text-blue-400" />}
          />
          <Popconfirm
            placement="right"
            title={t("Та анкетын загвар устгах гэж байна!")}
            onConfirm={(e) => {
              e.stopPropagation();
              anketUstgay(a);
            }}
            okText={t("Тийм")}
            cancelText={t("Үгүй")}
          >
            <Button
              className="bg-white text-red-400 hover:text-red-600 dark:bg-gray-900 "
              onClick={(e) => {
                e.stopPropagation();
              }}
              icon={<DeleteOutlined className="dark:text-red-400" />}
            />
          </Popconfirm>
        </div>
      </div>
      <div className="flex w-full items-center justify-between px-5">
        <div
          className={`flex w-full flex-col items-center justify-end overflow-hidden rounded-b-xl border border-t-0 border-green-600 bg-green-600 bg-opacity-5 p-1 shadow-lg transition-all dark:text-black `}
          style={{
            height:
              kharakh === false
                ? "1.5rem"
                : khariult.jagsaalt.length > 0
                ? `${
                    khariult.jagsaalt.length * 4 < 16
                      ? khariult.jagsaalt.length * 4 + 0.5
                      : 16
                  }rem`
                : "3.5rem",
          }}
        >
          {khariult.jagsaalt.length > 0 ? (
            <div
              className={` ${
                kharakh === true
                  ? "opacity-200 visible transition-all delay-100"
                  : "invisible opacity-0"
              } h-full w-full space-y-3 overflow-y-auto px-5 py-2`}
            >
              {khariult.jagsaalt.map((b, i) => {
                return (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setData({
                        ...a,
                        khariultuud: b.khariultuud,
                        ner: b.asuultiinNer,
                        _id: b._id,
                      });
                    }}
                    className={`flex w-full cursor-pointer justify-between rounded-md border p-2 py-1 ${
                      data?._id === b._id ? "bg-blue-200" : "bg-white"
                    }  border-green-600`}
                    key={i}
                  >
                    <p>{i + 1}.</p>{" "}
                    <p>{moment(b.ognoo).format("YYYY-MM-DD HH:mm:ss")}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center transition-opacity delay-200 dark:text-[#E5E7EB] ${
                kharakh === true ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              {t("Анкет ирээгүй байна")}
            </div>
          )}
          <div className="relative flex w-full justify-center transition-all group-hover:animate-pulse dark:text-[#E5E7EB]">
            <DoubleRightOutlined
              className="cursor-pointer transition-all"
              style={{ rotate: kharakh === true ? "-90deg" : "90deg" }}
            />
            <div
              className={`absolute -bottom-1 right-2 transition-all ${
                khariult.jagsaalt.length > 0
                  ? "font-medium text-pink-500"
                  : "text-gray-400"
              }`}
            >
              {khariult.jagsaalt.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Anket({ token }) {
  const { t } = useTranslation();
  const { ajiltan, barilgiinId, baiguullaga } = useAuth();
  const [ognoo, setOgnoo] = useState([
    moment(new Date()).subtract(1, "months"),
    moment(new Date()),
  ]);
  const query = { barilgiinId: barilgiinId };
  const [data, setData] = useState(undefined);

  const [form] = Form.useForm();
  const [formPreview] = Form.useForm();
  const asuult = useJagsaalt(ajiltan && "/asuult", query);
  const formRef = useRef();
  const ilgeekhRef = React.useRef();

  useEffect(() => {
    Aos.init({ once: true });
  });

  function anketBurtgey(v) {
    v.barilgiinId = barilgiinId;
    v.baiguullagiinId = baiguullaga._id;
    uilchilgee(token)
      .post("/asuult", v)
      .then(({ data }) => {
        if (data !== undefined) {
          message.success(t("Анкетын загвар амжилттай бүртгэгдлээ"));
          formRef.current.resetFields();
          asuult.mutate();
          setData(undefined);
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  function anketUstgay(data) {
    uilchilgee(token)
      .delete("/asuult/" + data._id)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          asuult.mutate();
          message.success(t("Устгагдлаа"));
          setData(undefined);
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  function anketIlgeeye(data) {
    const footer = [
      <Space className="flex justify-end">
        <Button
          className="dark:text-gray-200 dark:hover:text-gray-800"
          type="primary"
          onClick={() => ilgeekhRef.current.khaaya()}
        >
          {t("Хаах")}
        </Button>
        <Button
          id="anketIlgeekhButton"
          type="primary"
          icon={<SendOutlined />}
          onClick={() => ilgeekhRef.current.ilgeekh()}
        >
          {t("Анкет илгээх")}
        </Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <AnketIlgeekh
          ref={ilgeekhRef}
          baiguullaga={baiguullaga}
          token={token}
          data={data}
          barilgiinId={barilgiinId}
        />
      ),
      footer,
    });
  }

  useEffect(() => {
    form.getFieldInstance("ner").focus();
  }, []);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "dynamic_form_item_ner":
          document.getElementById("asuultNemekhButton").focus();
          break;
        default:
          break;
      }
    }
  }, []);
  useEffect(() => {
    if (!data?.shineAnket) {
      formPreview.resetFields();
    }
    formPreview.setFieldValue("asuultuud", data?.asuultuud);
  }, [data]);

  return (
    <Admin
      title="Анкетын асуулга бэлдэх"
      khuudasniiNer="anket"
      tsonkhniiId={"64472b9428c37d7cdda119d6"}
    >
      <div className="col-span-12 p-3 md:p-5 ">
        <div className="absolute right-3 top-3 z-50 hidden lg:flex"></div>
        <div className="flex grid-cols-12 flex-col-reverse gap-5 md:grid">
          <div
            className="box relative col-span-12 p-4 py-5 pt-3 md:col-span-4"
            style={{ height: "calc( 100vh - 8rem)" }}
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <span className="font-medium dark:text-gray-100">
              {t("Анкетын загварууд")}
            </span>
            <div className="mt-5 w-full px-5">
              <DatePicker.RangePicker
                onClick={(e) => e.stopPropagation()}
                className="flex w-full rounded-md md:w-auto"
                size="middle"
                allowClear={true}
                placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                value={ognoo}
                onChange={setOgnoo}
              />
            </div>
            <div
              className="mt-5 flex flex-col gap-5 overflow-y-auto pb-10"
              style={{ height: "calc( 100vh - 14rem )" }}
            >
              {asuult?.data?.jagsaalt?.map((a) => {
                return (
                  <AnketiinZagvar
                    ognoo={ognoo}
                    a={a}
                    anketIlgeeye={anketIlgeeye}
                    setData={setData}
                    data={data}
                    anketUstgay={anketUstgay}
                  />
                );
              })}
            </div>
          </div>
          <div
            className="box col-span-12 overflow-auto p-1 pt-3 md:col-span-3 xl:col-span-3"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <span className="font-medium dark:text-gray-100 lg:px-5">
              {t("Анкетын загвар үүсгэх")}
            </span>
            <Form
              ref={formRef}
              form={form}
              className="pl-5 pt-5"
              name="dynamic_form_item"
              autoComplete={"off"}
              onFinish={(v) => {
                anketBurtgey(v);
              }}
              onValuesChange={() => {
                setData({
                  ..._.cloneDeep(form.getFieldsValue()),
                  shineAnket: true,
                });
              }}
            >
              <div>
                <div className="grid-cols-1 gap-3 pr-5 lg:grid">
                  <Form.Item name="_id" hidden></Form.Item>
                  <Form.Item name="barilgiinId" hidden></Form.Item>
                  <Form.Item
                    className="w-full"
                    name="ner"
                    rules={[
                      {
                        required: true,
                        message: t("Нэр оруулна уу!"),
                      },
                    ]}
                  >
                    <Input
                      autoFocus={true}
                      onKeyUp={focuser}
                      placeholder={t("Анкетын нэр")}
                    />
                  </Form.Item>
                </div>
                <Form.List
                  rules={[
                    {
                      required: true,
                      message: t("Асуулт оруулна уу!"),
                    },
                  ]}
                  name="asuultuud"
                >
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      <Form.Item className="pb-3 pr-5">
                        <Button
                          type="default"
                          id="asuultNemekhButton"
                          onClick={() => {
                            add();
                            let div =
                              document?.getElementById("form-container");
                            div?.lastElementChild?.scrollIntoView({
                              behavior: "smooth",
                            });
                          }}
                          className="dark:bg-gray-800 dark:text-white"
                          style={{ width: "100%" }}
                          icon={<PlusOutlined className="text-xs" />}
                        >
                          {t("Асуулт нэмэх")}
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                      <div
                        className="-my-8 grid w-full grid-cols-1 gap-2 overflow-y-auto py-5 pr-5 "
                        style={{ maxHeight: "calc( 100vh - 20rem)" }}
                        id={"form-container"}
                      >
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <AsuultOruulakh
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
              <Form.Item className="flex justify-end pr-5">
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  className="w-full"
                >
                  {t("Хадгалах")}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div
            className="relative col-span-5 block h-full overflow-y-auto rounded-lg bg-white pt-3 dark:bg-gray-900 "
            style={{ height: "calc( 100vh - 8rem)" }}
          >
            <header className="border-b pb-5 font-medium dark:text-gray-100 lg:px-5 ">
              {t("Анкет харах хэсэг")}
            </header>
            <header className="border-b px-6 py-1 text-xl font-medium uppercase text-black text-opacity-40 dark:text-white dark:text-opacity-40">
              {data?.ner || t("Анкетын загварын нэр")}
            </header>
            <Form
              disabled={true}
              form={formPreview}
              name="dynamic_form_nest_item"
              autoComplete={"off"}
              className="block h-5/6 overflow-y-auto pt-5"
              layout="vertical"
            >
              <Form.List name="asuultuud">
                {(fields) => (
                  <>
                    <div className="flex flex-col">
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <div className="px-6 pb-3 dark:text-gray-300" key={key}>
                          <div className="flex gap-1 text-base">
                            <p className="font-medium">{name + 1}.</p>
                            {!!data?.asuultuud && data.asuultuud[name]?.asuult}
                          </div>
                          <div className="flex flex-wrap gap-2 py-2 dark:text-gray-200 sm:px-10">
                            <Form.Item
                              {...restField}
                              hidden
                              name={[name, "asuult"]}
                              noStyle
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, "khariult"]}
                              className="w-full "
                            >
                              {!!formPreview.getFieldValue("asuultuud") &&
                              formPreview.getFieldValue("asuultuud")[name]
                                ?.turul === "songokh" ? (
                                <Radio.Group
                                  defaultValue={
                                    !!data?.khariultuud
                                      ? data?.khariultuud[name]?.khariult
                                      : undefined
                                  }
                                  className="flex flex-col "
                                >
                                  {!!formPreview.getFieldValue("asuultuud") &&
                                    formPreview
                                      .getFieldValue("asuultuud")
                                      [name].khariultuud?.map((a, i) => (
                                        <Radio
                                          key={i}
                                          value={a}
                                          className="dark:text-gray-200"
                                        >
                                          {a}
                                        </Radio>
                                      ))}
                                </Radio.Group>
                              ) : (
                                <Input
                                  width={"100%"}
                                  placeholder={t("Энд хариултаа бичнэ үү")}
                                  defaultValue={
                                    !!data?.khariultuud
                                      ? data?.khariultuud[name]?.khariult
                                      : undefined
                                  }
                                />
                              )}
                            </Form.Item>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Form.List>
            </Form>
          </div>
        </div>
      </div>
    </Admin>
  );
}
export const getServerSideProps = shalgaltKhiikh;

export default Anket;
