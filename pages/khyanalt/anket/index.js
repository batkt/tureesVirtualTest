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
  const { t } = useTranslation()
  const [hide, setHide] = React.useState(true);
  return (
    <Form.Item
      className="rounded-md border block py-4 px-2 shadow-lg "
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
              message: "Асуулт оруулна уу!",
            },
          ]}
        //validateTrigger={["onChange", "onBlur"]}
        >
          <Input
            placeholder={t("Асуулт", {count: name + 1})}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name={[name, "turul"]}
          fieldKey={[fieldKey, "turul"]}
          {...restField}
        >
          <Select
            placeholder="Хариултын төрөл"
            defaultValue={"boglokh"}
            options={[
              { label: t("Бөглөх"), value: "boglokh" },
              { label: t("Сонгох"), value: "songokh" },
            ]}
            onChange={(e) =>
              e === "songokh"
                ? setHide(false)
                : setHide(true)
            }
          />
        </Form.Item>
        {fields.length > 0 ? (
          <div className="absolute -top-11 -right-3 rounded-full bg-white dark:bg-gray-900 lg:-top-10 lg:-right-5">
            <CloseCircleOutlined
              className="dynamic-delete-button text-2xl hover:text-red-400 transition-colors text-black text-opacity-60 dark:text-white dark:text-opacity-50"
              onClick={() => { remove(name) }}
            />
          </div>
        ) : null}
      </div>
      {hide === false && <div className="mt-5"><Form.List
      rules={[
        {
          required: true,
          message: "Хариулт оруулна уу!",
        },
      ]}
        name={[name ,"khariultuud"]}
        fieldKey={[fieldKey, "khariultuud"]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(
              (
                field,
                key,                
              ) => (
                <Form.Item
                  key={key}                  
                  name={field.name}  
                    fieldId={field.key}   
                  {...field.restField}
                  rules={[{ required: true, message: "Хариулт оруулна уу!" }]}
                >
                  <div className="relative pr-8">
                    <Input
                      placeholder={`Хариулт ${String.fromCharCode(
                        str.charCodeAt(
                          str.length - 1
                        ) + field.name
                      )}`}
                      style={{ width: "100%" }}                     
                    />
                    <MinusCircleOutlined
                      className="dynamic-delete-button absolute right-2 top-0 text-xl text-black text-opacity-50 dark:text-white dark:text-opacity-50"
                      onClick={() => remove(field.name)}
                    />
                  </div>
                </Form.Item>
              )
            )}
            <Button
              className=" dark:bg-gray-800 dark:text-white "
              style={{ width: "100%" }}
              type={"sideKick"}
              onClick={() => add()}
              icon={<PlusOutlined className="text-xs"/>}
            >
              {t("Хариулт оруулах")}
            </Button>
            <Form.ErrorList errors={errors} />
          </>
        )}
        
      </Form.List></div>}
    </Form.Item>
  )
}
function AnketiinZagvar({ a, setData, anketUstgay, data, anketIlgeeye, ognoo }) {  
  const query = useMemo(() => {
    let asuultiinId = a._id;
    return { asuultiinId, ognoo :ognoo
      ? {
        $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
        $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      }
      : undefined, };
  }, [a, khariult, ognoo]);
  const khariult = useJagsaalt("/khariult", query, {ognoo: -1});
  const [kharakh, setKharakh] = useState(false)
  return (
    <div className="group" onClick={() => { setKharakh(!kharakh) }}>
      <div
        key={a._id}
        className="flex w-full items-center justify-between rounded-xl border cursor-pointer border-green-600 bg-green-600 bg-opacity-5 p-2 shadow-lg dark:text-gray-200 md:block lg:flex"
      >
        <div>{a.ner}</div>
        <div className="flex justify-end gap-2">
          <Button
            className="bg-white text-green-400 hover:text-green-600 dark:bg-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              anketIlgeeye(a);
            }}
            icon={<SendOutlined />}
          />
          <Button
            className="bg-white text-blue-400 hover:text-blue-600 dark:bg-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              setData({...a, khariultuud: undefined})
            }}
            icon={<EyeOutlined />}
          />
          <Popconfirm
            placement="right"
            title={"Та анкетын загвар устгах гэж байна!"}
            onConfirm={(e) => {
              e.stopPropagation();
              anketUstgay(a);
            }}
            okText="Тийм"
            cancelText="Үгүй"
          >
            <Button
              className="bg-white text-red-400 hover:text-red-600 dark:bg-gray-900"
              onClick={(e) => {
                e.stopPropagation();
              }}
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      </div>
      <div className="flex w-full px-5 items-center justify-between">
        <div
          className={`flex flex-col w-full items-center transition-all justify-end rounded-b-xl overflow-hidden border border-t-0 border-green-600 bg-green-600 bg-opacity-5 p-1 shadow-lg dark:text-gray-200`} style={{ height: kharakh === false ? "1.5rem" : khariult.jagsaalt.length > 0 ? `${khariult.jagsaalt.length * 4 < 16 ? khariult.jagsaalt.length * 4 + 0.5 : 16 }rem` : "3.5rem" }}>            
          {khariult.jagsaalt.length > 0 ? <div className={` ${kharakh === true ? "visible opacity-200 transition-all delay-100" : "invisible opacity-0"} w-full h-full overflow-y-auto py-2 space-y-3 px-5`}>
            {khariult.jagsaalt.map((b, i) => {
              return <div onClick={(e) => { e.stopPropagation(); setData({...a, khariultuud: b.khariultuud, ner: b.asuultiinNer, _id: b._id }); }} className={`flex w-full cursor-pointer justify-between py-1 p-2 border rounded-md ${data?._id === b._id ? "bg-blue-200" : "bg-white"}  border-green-600`} key={i}><p>{i + 1}.</p> <p>{moment(b.ognoo).format("YYYY-MM-DD HH:mm:ss")}</p></div>
            })}
          </div> : <div className={`w-full h-full flex justify-center items-center transition-opacity delay-200 ${kharakh === true ? "visible opacity-100" : "invisible opacity-0"}`}>Анкет ирээгүй байна</div>}
          <div className="w-full flex justify-center transition-all group-hover:animate-pulse relative">
            <DoubleRightOutlined className="transition-all cursor-pointer" style={{ rotate: kharakh === true ? "-90deg" : "90deg" }} />
            <div className={`absolute right-2 transition-all -bottom-1 ${khariult.jagsaalt.length > 0 ? "text-pink-500 font-medium" : "text-gray-400"}`}>{khariult.jagsaalt.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Anket({ token }) {
  const { t } = useTranslation()
  const { ajiltan, barilgiinId, baiguullaga } = useAuth();
  const [ognoo, setOgnoo] = useState([moment(new Date()).subtract( 1,"months"), moment(new Date())]);
  const query = { barilgiinId: barilgiinId };
  const [data, setData] = useState(undefined)

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
          message.success("Анкетын загвар амжилттай бүртгэгдлээ");
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
          setData(undefined)
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
          type="sideKick"
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
      content: <AnketIlgeekh
        ref={ilgeekhRef}
        baiguullaga={baiguullaga}
        token={token}
        data={data}
        barilgiinId={barilgiinId}
      />,
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
    formPreview.setFieldValue("asuultuud", data?.asuultuud)
  }, [data])

  return (
    <Admin
      title="Анкетын асуулга бэлдэх"
      khuudasniiNer="anket"
      tsonkhniiId={"62ea0d2b7c54f8189bdca54c"}
    >
      <div className="col-span-12 p-3 md:p-5 ">
        <div className="absolute top-3 right-3 z-50 hidden lg:flex">
        </div>
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
            <div className="w-full px-5 mt-5">
        <DatePicker.RangePicker
        onClick={(e)=> e.stopPropagation()}
              className="w-full flex  rounded-md md:w-auto"
              size="middle"
              allowClear={true}
              placeholder={["Эхлэх огноо", "Дуусах огноо"]}
              value={ognoo}
              onChange={setOgnoo}
            />
        </div>
            <div className="mt-5 flex flex-col gap-5 overflow-y-auto pb-10" style={{ height: "calc( 100vh - 14rem )" }}>
              {asuult?.data?.jagsaalt?.map((a) => {
                return (
                  <AnketiinZagvar  ognoo={ognoo} a={a} anketIlgeeye={anketIlgeeye} setData={setData} data={data} anketUstgay={anketUstgay} />
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
            <span className=" font-medium dark:text-gray-100 lg:px-5">
              {t("Анкетын загвар үүсгэх")}
            </span>
            <Form
              ref={formRef}
              form={form}
              className="pt-5 pl-5"
              name="dynamic_form_item"
              autoComplete={"off"}
              onFinish={(v) => {
                anketBurtgey(v);
              }}
              onValuesChange={() => {
                setData({..._.cloneDeep(form.getFieldsValue()), shineAnket: true})
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
                        message: "Нэр оруулна уу!",
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
                      message: "Асуулт оруулна уу!",
                    },
                  ]}
                  name="asuultuud"
                >
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      <Form.Item className="pr-5 pb-3">
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
                          icon={<PlusOutlined className="text-xs"/>}                          
                        >
                          {t("Асуулт нэмэх")}
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                      <div
                        className=" -my-8 grid pr-5 w-full gap-2 overflow-y-auto py-5 grid-cols-1"
                        style={{ maxHeight: "calc( 100vh - 20rem)" }}
                        id={"form-container"}
                      >
                        {fields.map(({key, name, fieldKey, ...restField}) => (
                          <AsuultOruulakh name={name} fieldKey={fieldKey} restField={restField} fields={fields} remove={remove} />
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
          <div className="relative block h-full col-span-5 rounded-lg bg-white pt-3 overflow-y-auto dark:bg-gray-900 " style={{ height: "calc( 100vh - 8rem)" }}>
            <header className="border-b font-medium pb-5 dark:text-gray-100 lg:px-5 ">
              {t("Анкет харах хэсэг")}
            </header>
            <header className="border-b px-6 text-black dark:text-white py-1 text-opacity-40 dark:text-opacity-40 text-xl font-medium uppercase">
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
                      {fields.map(({key, name, fieldKey, ...restField}) => (
                        <div
                          className="px-6 pb-3 dark:text-gray-300"
                          key={key}
                        >
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
                              className="w-full"
                            >
                              {!!formPreview.getFieldValue("asuultuud") && formPreview.getFieldValue("asuultuud")[name]?.turul === "songokh" ? (
                                <Radio.Group defaultValue={ !!data?.khariultuud ? data?.khariultuud[name]?.khariult : undefined} className="flex flex-col">
                                  {!!formPreview.getFieldValue("asuultuud") && formPreview.getFieldValue("asuultuud")[name].khariultuud?.map((a, i) => (
                                    <Radio  key={i} value={a}>
                                      {a}
                                    </Radio>
                                  ))}
                                </Radio.Group>
                              ) : (
                                <Input
                                  width={"100%"}
                                  placeholder="Энд хариултаа бичнэ үү"
                                  defaultValue={!!data?.khariultuud ? data?.khariultuud[name]?.khariult : undefined}
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
