import {
  Button,
  DatePicker,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Popconfirm,
  Select,
  Space,
  Tabs,
} from "antd";
import React, { useMemo, useState, useEffect, useRef } from "react";
import moment from "moment";
import _ from "lodash";
const garalt = {
  khuudasniiDugaar: 1,
  khuudasniiKhemjee: 10,
};

import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Aos from "aos";
import {
  CloseCircleOutlined,
  CloseCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SendOutlined,
  ToolOutlined,
} from "@ant-design/icons";

import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useAuth } from "services/auth";
import useJagsaalt from "hooks/useJagsaalt";
import { modal } from "components/ant/Modal";
import AnketBurtgel from "components/pageComponents/anket/[id]";
import AnketIlgeekh from "components/pageComponents/anket/AnketIlgeekh";
import { destroyCookie } from "nookies";

const { TabPane } = Tabs;
const str = "A";

function Anket({ token }) {
  const { ajiltan, barilgiinId } = useAuth();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ]);

  const [form] = Form.useForm();
  const asuult = useJagsaalt(ajiltan && "/asuult");

  const formRef = useRef();
  const anketRef = React.useRef(null);
  const ilgeekhRef = React.useRef();
  const [anketIlgeekh, setAnketIlgeekh] = useState(false);
  const [zasakhEsekh, setZasakhEsekh] = useState(false);
  const [hide, setHide] = React.useState(true);

  function onChangeOgnoo(date, dateString) {
    setEkhlekhOgnoo(date);
  }

  useEffect(() => {
    Aos.init({ once: true });
  });

  function anketBurtgey(v) {
    if (zasakhEsekh === true) {
      setZasakhEsekh(false);
      uilchilgee(token)
        .put("/asuult/" + v._id, v)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Анкет амжилттай засагдлаа");
            formRef.current.resetFields();
            asuult.mutate();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else
      uilchilgee(token)
        .post("/asuult", v)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Анкет амжилттай хийгдлээ");
            formRef.current.resetFields();
            asuult.mutate();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
  }

  function AnketZasay(data) {
    formRef.current.setFieldsValue({ ...data });
    setZasakhEsekh(true);
  }

  function anketUstgay(data) {
    uilchilgee(token)
      .delete("/asuult/" + data._id)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          asuult.mutate();
          message.success("Устгагдлаа");
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  function anketZagvar(data) {
    const footer = [
      <Space className="flex justify-end">
        <Button
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          onClick={() => anketRef.current.khaaya()}
        >
          OK
        </Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: <AnketBurtgel ref={anketRef} data={data} />,
      footer,
    });
  }

  return (
    <Admin
      title="Анкетын асуулга бэлдэх"
      khuudasniiNer="anket"
      tsonkhniiId={"62ea0d2b7c54f8189bdca54c"}
      onSearch={(search) =>
        setAsuulgiinKhuudaslalt((kh) => ({
          ...kh,
          khuudasniiDugaar: 1,
          search,
        }))
      }
    >
      <div className="col-span-12 p-0 md:p-5">
        <Drawer
          title={"Анкет илгээх"}
          width={"50vw"}
          onClose={() => setAnketIlgeekh(false)}
          visible={anketIlgeekh === true}
        >
          {anketIlgeekh === true && (
            <AnketIlgeekh
              ref={ilgeekhRef}
              token={token}
              data={asuult.jagsaalt}
              barilgiinId={barilgiinId}
            />
          )}
        </Drawer>
        <div>
          <Button
            className="absolute right-3 z-50"
            style={{ backgroundColor: "#209669", color: "#ffffff" }}
            icon={<SendOutlined />}
            onClick={() => {
              setAnketIlgeekh(true), console.log(anketIlgeekh);
            }}
          >
            Анкет илгээх
          </Button>
        </div>
        <Tabs>
          <TabPane
            key="1"
            tab={<span className="text-base font-medium">Асуумж</span>}
          >
            <div className="grid grid-cols-12 gap-5">
              <div
                className="box relative col-span-12 py-5 pt-1 md:col-span-4 xl:col-span-3"
                style={{ height: "80vh" }}
              >
                <span className="font-medium dark:text-gray-100">
                  Анкетын загвар үүсгэх
                </span>
                <Form
                  ref={formRef}
                  form={form}
                  className="pt-5"
                  name="dynamic_form_item"
                  onFinish={(v) => {
                    anketBurtgey(v);
                  }}
                >
                  <Form.Item name="_id" hidden></Form.Item>
                  <Form.Item
                    className="pl-5 pr-8"
                    name="ner"
                    rules={[
                      {
                        required: true,
                        message: "Нэр оруулна уу!",
                      },
                    ]}
                  >
                    <Input placeholder="Анкетын нэр" />
                  </Form.Item>
                  <Form.Item
                    className="pl-5 pr-8"
                    name="turul"
                    rules={[
                      {
                        required: true,
                        message: "Төрөл сонгоно уу!",
                      },
                    ]}
                  >
                    <Input placeholder="Төрөл" />
                  </Form.Item>

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
                        <div
                          className="-my-5 w-full overflow-y-auto py-5 pl-5 pr-8"
                          style={{ maxHeight: "50vh" }}
                        >
                          {fields.map((key, name, fieldKey, ...restField) => (
                            <Form.Item
                              className="rounded-md border-4 bg-black bg-opacity-5 py-4 px-2 dark:border-gray-700 dark:bg-white dark:bg-opacity-10"
                              key={fieldKey.key}
                            >
                              <div className="relative mb-2 space-y-3">
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

                                  noStyle
                                >
                                  <Input
                                    placeholder={`Асуулт ${name + 1}`}
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message: "Төрөл сонгоно уу!",
                                    },
                                  ]}
                                  name={[name, "turul"]}
                                  fieldKey={[fieldKey, "turul"]}
                                  {...restField}
                                  noStyle
                                >
                                  <Select
                                    placeholder="Хариултын төрөл"
                                    options={[
                                      { label: "Бөглөх", value: "boglokh" },
                                      { label: "Сонгох", value: "songokh" },
                                    ]}
                                    onChange={(e) =>
                                      e === "songokh"
                                        ? setHide(false)
                                        : setHide(true)
                                    }
                                  />
                                </Form.Item>
                                {fields.length > 1 ? (
                                  <CloseCircleOutlined
                                    className="dynamic-delete-button red absolute -top-16 -right-6 text-3xl text-black text-opacity-60  dark:text-white dark:text-opacity-50"
                                    onClick={() => remove(name)}
                                  />
                                ) : null}
                              </div>
                              <Form.List
                                name={[name, "khariultuud"]}
                                fieldKey={[fieldKey, "khariultuud"]}
                                {...restField}
                                noStyle
                              >
                                {(fields, { add, remove }, { errors }) => (
                                  <>
                                    {fields.map(
                                      (
                                        key,
                                        khname,
                                        khfieldKey,
                                        ...restField
                                      ) => (
                                        <Form.Item
                                          rules={[{ required: true }]}
                                          fieldKey={[khfieldKey]}
                                          name={[khname]}
                                          noStyle
                                        >
                                          <div className="relative py-2 pr-8">
                                            <Input
                                              placeholder={`Хариулт ${String.fromCharCode(
                                                str.charCodeAt(str.length - 1) +
                                                  khname
                                              )}`}
                                              style={{ width: "100%" }}
                                            />
                                            <MinusCircleOutlined
                                              className="dynamic-delete-button absolute right-2 top-0 text-xl text-black text-opacity-50 dark:text-white dark:text-opacity-50"
                                              onClick={() => remove(name)}
                                            />
                                          </div>
                                        </Form.Item>
                                      )
                                    )}
                                    <Button
                                      className="mt-3 dark:bg-gray-800 dark:text-white "
                                      style={{ width: "100%" }}
                                      onClick={() => add([name])}
                                      icon={<PlusOutlined />}
                                    >
                                      Хариулт оруулах
                                    </Button>
                                  </>
                                )}
                              </Form.List>
                            </Form.Item>
                          ))}
                        </div>
                        <Form.Item className="pl-5 pr-8 pb-3">
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            className="dark:bg-gray-800 dark:text-white"
                            style={{ width: "100%" }}
                            icon={<PlusOutlined />}
                          >
                            Асуулт нэмэх
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Form.Item wrapperCol={6}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="absolute bottom-2 right-2"
                    >
                      Хадгалах
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className="box col-span-12 overflow-auto p-5 pt-1 md:col-span-8 xl:col-span-9">
                <span className="font-medium dark:text-gray-100">
                  Анкетын загварууд
                </span>
                <div className="flex flex-wrap gap-5 pt-3">
                  {asuult?.data?.jagsaalt?.map((a) => {
                    return (
                      <div
                        className=" group flex h-24 w-28 cursor-pointer items-end justify-center overflow-hidden rounded-md border-2 shadow-md  dark:bg-white dark:bg-opacity-30"
                        key={a._id}
                      >
                        <img className="absolute w-36" src="/anket.png" />
                        <div className="z-0 w-full bg-black bg-opacity-50 px-2  ">
                          <div className="text-center text-base font-medium text-white">
                            {a.ner}
                          </div>
                        </div>
                        <div className="absolute hidden h-24 w-28 transform justify-between rounded-md transition-all group-hover:relative group-hover:flex ">
                          <div
                            onClick={() => anketZagvar(a)}
                            className="absolute h-24 w-28 animate-pulse rounded-md bg-white bg-opacity-50 dark:border-white dark:border-opacity-30"
                          ></div>
                          <Button
                            className=" -top-3 -left-2 bg-black bg-opacity-40 text-green-700 transition-all hover:border-green-700 hover:bg-green-700 hover:bg-opacity-40 hover:text-white group-hover:block dark:bg-green-700 dark:bg-opacity-50 dark:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              AnketZasay(a);
                            }}
                            icon={<EditOutlined />}
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
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="-top-3 -right-2 bg-black bg-opacity-40 text-red-700 transition-all hover:border-red-700 hover:bg-red-800 hover:bg-opacity-40 hover:text-white group-hover:block dark:bg-red-700 dark:bg-opacity-50 dark:text-white"
                              icon={<DeleteOutlined />}
                            />
                          </Popconfirm>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane
            key="2"
            tab={<span className="text-base font-medium">Жагсаалт</span>}
          ></TabPane>
        </Tabs>
      </div>
    </Admin>
  );
}
export const getServerSideProps = shalgaltKhiikh;

export default Anket;
