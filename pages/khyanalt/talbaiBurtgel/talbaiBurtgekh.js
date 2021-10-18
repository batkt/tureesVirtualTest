import {
  Button,
  Input,
  message,
  Popover,
  Table,
  Space,
  Form,
  Popconfirm,
  Card,
  InputNumber,
  Divider,
  Upload,
  Row,
  Col,
  Badge,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  EyeOutlined,
  UploadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import shalgaltKhiikh from "../../../services/shalgaltKhiikh";

import Admin from "../../../components/Admin";
import { aldaaBarigch, url } from "../../../services/uilchilgee";
import { useAuth } from "../../../services/auth";
import React, { useState, useRef, useMemo } from "react";
import { useTalbai } from "hooks/useTalbai";
import deleteMethod from "tools/function/crud/deleteMethod";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import formatNumber from "tools/function/formatNumber";
import { modal } from "components/ant/Modal";
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};
function Head({ title, sort }) {
  var icon = <ArrowUpOutlined />;
  if (sort === -1) icon = <ArrowDownOutlined />;

  return (
    <div className="w-full flex flex-row justify-between items-center">
      {title}
      {icon}
    </div>
  );
}

function talbaiBurtgekh({ token }) {
  const formRef = useRef();
  const excelref = useRef();
  const { TextArea } = Input;
  const { ajiltan, baiguullaga } = useAuth();
  const { setTalbaiKhuudaslalt, talbainiiGaralt, talbainiiJagsaaltMutate } =
    useTalbai(token, baiguullaga?._id);

  const [talbaiState, settalbaiState] = useState({
    kod: undefined,
    talbainKhemjee: undefined,
    tailbar: undefined,
    talbainNegjUne: undefined,
    talbainNiitUne: undefined,
    ashiglaltiinZardal: undefined,
    niitAshiglaltiinZardal: undefined,
    tureesiinTulbur: undefined,
    davkhar: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
    zasakhEsekh: false,
  });
  const [order, setOrder] = useState({});

  const khyanaltiinDun = [
    {
      too: talbainiiGaralt?.niitMur,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <line x1="3" y1="21" x2="21" y2="21" />{" "}
          <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />{" "}
          <path d="M5 21v-10.15" /> <path d="M19 21v-10.15" />{" "}
          <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
        </svg>
      ),
      khuvi: 100,
      utga: "Нийт",
    },
    {
      too: 20,
      icon: (
        <svg
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      khuvi: 100,
      utga: "VIP",
    },
    {
      too: 100,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{" "}
          <circle cx="8.5" cy="7" r="4" />{" "}
          <polyline points="17 11 19 13 23 9" />
        </svg>
      ),
      khuvi: -30,
      utga: "Идэвхтэй",
    },
    {
      too: 5,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{" "}
          <circle cx="8.5" cy="7" r="4" />{" "}
          <line x1="18" y1="8" x2="23" y2="13" />{" "}
          <line x1="23" y1="8" x2="18" y2="13" />
        </svg>
      ),
      khuvi: 100,
      utga: "Идэвхгүй",
    },

    {
      too: 15,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <circle cx="9" cy="7" r="4" />{" "}
          <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />{" "}
          <line x1="19" y1="7" x2="19" y2="10" />{" "}
          <line x1="19" y1="14" x2="19" y2="14.01" />
        </svg>
      ),
      khuvi: 100,
      utga: "Анхаарах",
    },
    {
      too: 20,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6-6a6 6 0 0 1 -8 -8l3.5 3.5" />
        </svg>
      ),
      khuvi: 100,
      utga: "Засвартай",
    },
  ];

  function onChange(talbar, utga) {
    if (talbar === "talbainNegjUne") {
      talbaiState.talbainNiitUne = utga * talbaiState.talbainKhemjee;
      formRef.current.setFieldsValue({
        talbainNiitUne: talbaiState.talbainNiitUne,
      });
      talbaiState.tureesiinTulbur =
        talbaiState.niitAshiglaltiinZardal + talbaiState.talbainNiitUne;
      formRef.current.setFieldsValue({
        tureesiinTulbur: talbaiState.tureesiinTulbur,
      });
    }
    if (talbar === "ashiglaltiinZardal") {
      talbaiState.niitAshiglaltiinZardal = utga * talbaiState.talbainKhemjee;
      formRef.current.setFieldsValue({
        niitAshiglaltiinZardal: talbaiState.niitAshiglaltiinZardal,
      });
      talbaiState.tureesiinTulbur =
        talbaiState.niitAshiglaltiinZardal + talbaiState.talbainNiitUne;
      formRef.current.setFieldsValue({
        tureesiinTulbur: talbaiState.tureesiinTulbur,
      });
    }
    if (talbar === "khurunguUne") {
      talbaiState.talbainNiitUne = utga * talbaiState.talbainKhemjee;
      formRef.current.setFieldsValue({});
    }
    settalbaiState((a) => ({ ...a, [talbar]: utga }));
  }
  function talbaiBurtgekh() {
    debugger;
    const khurunguud = formRef.current.getFieldsValue(khurunguud);
    talbaiState.baiguullagiinId = ajiltan?.baiguullagiinId;
    if (khurunguud.length > 0) {
      talbaiState.khurunguud = khurunguud.khurunguud;
      talbaiState.khurunguud.map(
        (x) => (x.zurgiinId = x.zurgiinId[0].response.id)
      );
    }

    if (talbaiState.zasakhEsekh === true) {
      updateMethod("talbai", token, talbaiState)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Бүртгэл амжилттай засагдлаа");
            formRef.current.resetFields();
            talbainiiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            );
          }
        })
        .catch(aldaaBarigch);
    } else
      createMethod("talbai", token, talbaiState)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Бүртгэл амжилттай хийгдлээ");
            formRef.current.resetFields();
            talbainiiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            );
          }
        })
        .catch(aldaaBarigch);
  }

  function zasya(data) {
    data.zasakhEsekh = true;
    formRef.current.setFieldsValue({ ...data });
    settalbaiState(data);
  }

  function talbaiUstgay(mur) {
    deleteMethod("talbai", token, mur._id).then(({ data }) => {
      if (data === "Amjilttai") {
        talbainiiJagsaaltMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
        message.success("Устгагдлаа");
      }
    });
  }

  function onFinish() {
    talbaiBurtgekh();
  }

  function onRefresh() {
    talbainiiJagsaaltMutate();
  }

  function test(data) {
    debugger;
    const khurunguud = formRef.current.getFieldsValue(khurunguud);
    formRef.current.setFieldsValue({
      [khurunguud]: {
        ...khurunguud,
        ["niit"]: khurunguud.une * khurunguud.too,
      },
    });
    // formRef.current.setFieldsValue({
    //   niit: khurunguud.une * khurunguud.too,
    // })

    console.log("data", khurunguud);
  }
  const [form] = Form.useForm();

  function talbaiOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>Хаах</Button>,
        <Button
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          onClick={() => talbainiiJagsaaltMutate().finally(() => duusgakh())}
        >
          хадгалах
        </Button>
        ,
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <ExceleesOruulakh
          ref={excelref}
          token={token}
          onFinish={onRefresh}
          zam="talbaiTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Гэрээний загварын excel файл"
          zagvariinZam="talbainZagvarAvya"
        />
      ),
      footer,
    });
  }
  function duusgakh() {
    message.success("Амжилттай бүртгэгдлээ");
    setTimeout(excelref.current.khaaya(), 2500);
  }

  return (
    <Admin
      title="Талбай бүртгэл"
      khuudasniiNer="talbaiBurtgekh"
      className="p-0 md:p-4"
      onSearch={(search) => setTalbaiKhuudaslalt((a) => ({ ...a, search }))}
    >
      <div
        className="col-span-12 md:col-span-12 w-full xl:col-span-4 box p-5 overflow-y-scroll"
        style={{ maxHeight: "calc(100vh - 7rem)" }}
      >
        <Form
          ref={formRef}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          form={form}
          name="control-ref"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <div>
            <Form.Item
              name="kod"
              label="Дугаар"
              rules={[
                {
                  required: true,
                  message: "Дугаар бүртгэнэ үү!",
                },
              ]}
            >
              <Input
                type="text"
                allowClear
                placeholder="дугаар"
                value={talbaiState.kod}
                onChange={(e) => onChange("kod", e.target.value)}
              ></Input>
            </Form.Item>
            <Form.Item
              label="Талбайн хэмжээ"
              name="talbainKhemjee"
              rules={[
                {
                  required: true,
                  message: "Талбайн хэмжээ бүртгэнэ үү!",
                },
              ]}
            >
              <Input
                style={{ width: "50%" }}
                type="text"
                allowClear
                placeholder="талбайн хэмжээ/м2/"
                value={talbaiState.talbainKhemjee}
                onChange={(e) => onChange("talbainKhemjee", e.target.value)}
              ></Input>
            </Form.Item>
            <Form.Item
              name="talbainNegjUne"
              label="Нэгж үнэ"
              rules={[
                {
                  required: true,
                  message: "Нэгж үнэ бүртгэнэ үү!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "50%" }}
                placeholder="нэгж үнэ"
                value={talbaiState.talbainNegjUne}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={(target) => onChange("talbainNegjUne", target)}
              />
            </Form.Item>
            <Form.Item
              name="talbainNiitUne"
              label="Нийт үнэ"
              rules={[
                {
                  required: true,
                  message: "Нийт үнэ бүртгэнэ үү!",
                },
              ]}
            >
              <InputNumber
                readOnly={true}
                style={{ width: "50%" }}
                placeholder="нийт үнэ"
                value={talbaiState.talbainNiitUne}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={(target) => onChange("talbainNiitUne", target)}
              />
            </Form.Item>
            <Form.Item
              name="ashiglaltiinZardal"
              label="Ашиглалтын зардал"
              rules={[
                {
                  required: true,
                  message: "Зардал бүртгэнэ үү!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "50%" }}
                placeholder="Ашиглалтын зардал"
                value={talbaiState.ashiglaltiinZardal}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={(target) => onChange("ashiglaltiinZardal", target)}
              />
            </Form.Item>
            <Form.Item
              name="niitAshiglaltiinZardal"
              label="Нийт зардал"
              rules={[
                {
                  required: true,
                  message: "Зардал бүртгэнэ үү!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "50%" }}
                readOnly={true}
                placeholder="Нийт зардал"
                value={talbaiState.niitAshiglaltiinZardal}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                // onChange={(target) =>
                //   onChange("niitAshiglaltiinZardal", target)
                // }
              />
            </Form.Item>
            <Form.Item
              name="tureesiinTulbur"
              label="Түрээсийн төлбөр"
              rules={[
                {
                  required: true,
                  message: "Түрээсийн бүртгэнэ үү!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "50%" }}
                readOnly={true}
                placeholder="Түрээсийн төлбөр"
                value={talbaiState.tureesiinTulbur}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                // onChange={(target) =>
                //   onChange("niitAshiglaltiinZardal", target)
                // }
              />
            </Form.Item>
            <Form.Item
              name="davkhar"
              label="Давхар"
              rules={[
                {
                  required: true,
                  message: "Давхар бүртгэнэ үү!",
                },
              ]}
            >
              <Input
                style={{ width: "50%" }}
                placeholder="Давхар"
                value={talbaiState.davkhar}
                onChange={(e) => onChange("davkhar", e.target.value)}
              />
            </Form.Item>
            <Form.Item name="tailbar" label="Тайлбар">
              <TextArea
                rows={4}
                allowClear
                placeholder="тайлбар"
                value={talbaiState.tailbar}
                onChange={(e) => onChange("tailbar", e.target.value)}
              ></TextArea>
            </Form.Item>
          </div>
          <Divider>Хөрөнгийн бүртгэл</Divider>
          <div className="w-full">
            <Form.List name="khurunguud">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Card>
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Row gutter={24}>
                          <Space>
                            <Form.Item
                              {...restField}
                              label="Нэр"
                              name={[name, "ner"]}
                              fieldKey={[fieldKey, "ner"]}
                              rules={[
                                { required: true, message: "Нэр бүртгэнэ үү" },
                              ]}
                            >
                              <Input placeholder="нэр" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              label="Тоо"
                              name={[name, "too"]}
                              fieldKey={[fieldKey, "too"]}
                              rules={[
                                {
                                  required: false,
                                  message: "Тоо ширхэг бүртгэнэ үү",
                                },
                              ]}
                            >
                              <Input placeholder="Тоо" />
                            </Form.Item>
                          </Space>
                          <Space>
                            <Form.Item
                              {...restField}
                              label="Үнэ"
                              name={[name, "une"]}
                              fieldKey={[fieldKey, "une"]}
                              rules={[
                                { required: false, message: "Үнэ бүртгэнэ үү" },
                              ]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Нэгж үнэ"
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/\$\s?|(,*)/g, "")
                                }
                                onChange={() => test({ ...fields })}
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              label="Нийт"
                              name={[name, "niit"]}
                              fieldKey={[fieldKey, "niit"]}
                              rules={[
                                {
                                  required: false,
                                  message: "Нийт бүртгэнэ үү",
                                },
                              ]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Нийт үнэ"
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/\$\s?|(,*)/g, "")
                                }
                              />
                            </Form.Item>
                          </Space>
                          <Space></Space>
                          <Form.Item
                            style={{ marginLeft: "10px" }}
                            {...restField}
                            name={[name, "zurgiinId"]}
                            fieldKey={[fieldKey, "zurgiinId"]}
                            getValueFromEvent={normFile}
                          >
                            <Upload
                              multiple={false}
                              listType="picture"
                              name="file"
                              action={`${url}/zuragKhadgalya`}
                              method="POST"
                              data={{ turul: "khurungu" }}
                              headers={{ Authorization: `bearer ${token}` }}
                            >
                              <Button icon={<UploadOutlined />}>
                                Зураг оруулах
                              </Button>
                            </Upload>
                          </Form.Item>
                        </Row>

                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    </Card>
                  ))}
                  <div className="flex justify-center">
                    <Form.Item>
                      <Space>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Хөрөнгө бүртгэх
                        </Button>
                        <Button
                          htmlType="submit"
                          //onClick={onFinish}
                          style={{
                            backgroundColor: "#209669",
                            color: "#ffffff",
                          }}
                        >
                          хадгалах
                        </Button>
                      </Space>
                    </Form.Item>
                  </div>
                </>
              )}
            </Form.List>
          </div>
        </Form>
      </div>
      <Card size="small" className="col-span-8 p-5 cardgrid">
        <div className="w-full border-solid grid grid-cols-12 gap-6">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className="border-2 h-20 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-2 intro-y cursor-pointer zoom-in"
              >
                <div className="h-full rounded-xl">
                  <div className="p-3 rounded-xl">
                    <div className="flex">
                      <div>
                        <div className="text-3xl text-green-600 font-bold">
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {mur.utga}
                        </div>
                      </div>
                      {/* <div className="ml-auto">
                        <div className="text-green-600 text-2xl">
                          {mur.icon}
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-span-12 w-full">
          <button
            style={{
              backgroundColor: "#209669",
              marginTop: "12px",
              display: "flex",
              justifyContent: "end",
            }}
            className="dropdown-toggle btn px-2 box bg-green-500 text-white  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 w-full md:w-auto mt-8 md:mt-0 ml-auto"
            aria-expanded="false"
            onClick={talbaiOruulakhExcel}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-plus w-4 h-4"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
            <span>Excel -ээс Талбай татах</span>
          </button>
        </div>

        <Table
          className={"mt-6"}
          bordered
          size="small"
          tableLayout={"fixed"}
          rowKey={(row) => row._id}
          scroll={{ y: "calc(100vh - 25rem)" }}
          dataSource={talbainiiGaralt?.jagsaalt}
          pagination={{
            current: talbainiiGaralt?.khuudasniiDugaar,
            pageSize: talbainiiGaralt?.khuudasniiKhemjee,
            total: talbainiiGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setTalbaiKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
          columns={[
            {
              title: "№",
              key: "index",
              align: "center",
              className: "text-center",
              render: (text, record, index) =>
                (talbainiiGaralt?.khuudasniiDugaar || 0) *
                  (talbainiiGaralt?.khuudasniiKhemjee || 0) -
                (talbainiiGaralt?.khuudasniiKhemjee || 0) +
                index +
                1,
              width: "1rem",
            },
            {
              title: "Дугаар",
              dataIndex: "kod",
              ellipsis: true,
              width: "1.75rem",
              align: "center",
            },
            {
              title: "Давхар",
              dataIndex: "davkhar",
              ellipsis: true,
              width: "1.2rem",
              align: "center",
            },
            {
              title: "Талбай/м2/",
              dataIndex: "talbainKhemjee",
              align: "center",
              ellipsis: true,
              width: "2.1rem",
              showSorterTooltip: false,
              defaultSortOrder: "descend",
              sorter: (a, b) =>
                Number(a.talbainKhemjee) - Number(b.talbainKhemjee),
            },
            // {
            //   title: "Нэгж үнэ/₮/",
            //   dataIndex: "talbainNegjUne",
            //   ellipsis: true,
            //   align: "center",
            //   render: (talbainNegjUne) => {
            //     return formatNumber(talbainNegjUne || 0)
            //   },
            // },
            {
              title: "Нийт үнэ/₮/",
              dataIndex: "talbainNiitUne",
              ellipsis: true,
              align: "center",
              render: (talbainNiitUne) => {
                return formatNumber(talbainNiitUne || 0);
              },
              showSorterTooltip: false,
              defaultSortOrder: "descend",
              sorter: (a, b) =>
                Number(a.talbainNiitUne || 0) - Number(b.talbainNiitUne || 0),
              width: "2.5rem",
            },
            // {
            //   title: "Зардал",
            //   dataIndex: "ashiglaltiinZardal",
            //   align: "center",
            //   render: (data) => {
            //     return formatNumber(data) + "₮"
            //   },
            //   defaultSortOrder: "descend",
            //   showSorterTooltip: false,
            //   sorter: (a, b) =>
            //     Number(a.ashiglaltiinZardal) - Number(b.ashiglaltiinZardal),
            // },
            {
              title: "Зардал",
              dataIndex: "niitAshiglaltiinZardal",
              align: "center",
              render: (data) => {
                return formatNumber(data) + "₮";
              },
              showSorterTooltip: false,
              defaultSortOrder: "descend",
              sorter: (a, b) =>
                Number(a.niitAshiglaltiinZardal || 0) -
                Number(b.niitAshiglaltiinZardal || 0),
              width: "2rem",
            },
            {
              title: "Төлбөр",
              dataIndex: "tureesiinTulbur",
              align: "center",
              render: (data) => {
                return formatNumber(data) + "₮";
              },
              showSorterTooltip: false,
              defaultSortOrder: "descend",
              sorter: (a, b) =>
                Number(a.tureesiinTulbur || 0) - Number(b.tureesiinTulbur || 0),
              width: "2.5rem",
            },
            {
              title: "Тайлбар",
              dataIndex: "tailbar",
              ellipsis: true,
              width: "4.5rem",
            },
            {
              title: "Хөрөнгө",
              align: "center",
              ellipsis: true,
              width: "1.5rem",

              render: (data) => {
                return (
                  data?.khurunguud !== undefined && (
                    <Popover
                      content={
                        <Table
                          pagination={false}
                          size="small"
                          dataSource={data?.khurunguud}
                          columns={[
                            {
                              title: "Нэр",
                              dataIndex: "ner",
                            },
                            {
                              title: "Тоо",
                              dataIndex: "too",
                              align: "center",
                            },
                            {
                              title: "Үнэ",
                              dataIndex: "une",
                              align: "center",
                              render: (data) => {
                                return formatNumber(data) + "₮";
                              },
                            },
                            {
                              title: "Нийт",
                              dataIndex: "niit",
                              align: "center",
                              render: (data) => {
                                return formatNumber(data) + "₮";
                              },
                            },
                            {
                              title: "Зураг",
                              dataIndex: "zurgiinId",
                              render: (data) => {
                                if (data !== undefined)
                                  return (
                                    <img
                                      className="h-36 w-36"
                                      src={`${url}/zuragAvya/khurungu/${ajiltan?.baiguullagiinId}/${data}`}
                                    />
                                  );
                                // return (
                                //   zurgiinNer !== undefined && (
                                //     <Popover content={<div className="h-36 w-36 flex">{zurag}</div>}>
                                //       <div className="h-7 w-7 inline-flex justify-center rounded-full p-1 shadow-xl bg-gray-200">
                                //         {zurag}
                                //       </div>
                                //     </Popover>
                                //   )
                                // );
                              },
                            },
                          ]}
                        ></Table>
                      }
                      trigger="click"
                    >
                      <a className="ant-dropdown-link p-2 rounded-full hover:bg-gray-200 flex items-center justify-center">
                        <Badge count={data?.khurunguud?.length}>
                          <EyeOutlined style={{ fontSize: "18px" }} />
                        </Badge>
                      </a>
                    </Popover>
                  )
                );
              },
            },
            {
              title: "Тохиргоо",
              ellipsis: true,
              width: "2rem",
              render: (data) =>
                ajiltan?.erkh === "Admin" && (
                  <Space size="middle">
                    <a
                      className="ant-dropdown-link p-2 rounded-full hover:bg-gray-200 flex items-center justify-center"
                      onClick={() => zasya(data)}
                    >
                      <EditOutlined style={{ fontSize: "18px" }} />
                    </a>
                    <Popconfirm
                      title="Талбай устгах уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => talbaiUstgay(data)}
                    >
                      <a className="ant-dropdown-link p-2 rounded-full hover:bg-gray-200 flex items-center justify-center">
                        <DeleteOutlined
                          style={{ fontSize: "18px", color: "red" }}
                        />
                      </a>
                    </Popconfirm>
                  </Space>
                ),
            },
          ]}
        />
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default talbaiBurtgekh;
