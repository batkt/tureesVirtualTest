import {
  Button,
  Input,
  message,
  Select,
  Table,
  Space,
  Form,
  Popconfirm,
  Tag,
  Popover,
  notification,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  SolutionOutlined,
  MailOutlined,
  FileExcelOutlined,
  EyeOutlined,
  MoreOutlined,
  SettingOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import shalgaltKhiikh from "services/shalgaltKhiikh";

import Admin from "components/Admin";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useAuth } from "services/auth";
import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import useKhariltsagch from "hooks/useKhariltsagch";
import deleteMethod from "tools/function/crud/deleteMethod";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import getListMethod from "tools/function/crud/getListMethod";
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh";
import { useKhariltsagchToololt } from "hooks/useKhariltsagch";
import { modal } from "components/ant/Modal";
import formatNumber from "tools/function/formatNumber";
import CardList from "components/cardList";
import KhariltsagchTile from "components/pageComponents/khariltsagch/KhariltsagchTile";
import useOrder from "tools/function/useOrder";
import Aos from "aos";
import _ from "lodash";

const iconColor = { fontSize: "18px" };
function checkUtas(utasnuud, utga) {
  const utguud = utasnuud || [];
  if (!!utguud.find((a) => a === utga)) {
    message.warning("Энэ утасны дугаарыг бүртгэсэн байна");
    return false;
  }
  return true;
}

function AjiltanBurtgel({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const formRef = useRef();
  const excelref = useRef();

  const { ajiltan, barilgiinId } = useAuth();
  const { order, onChangeTable } = useOrder({ createAt: -1 });
  const [query, setQuery] = useState({});
  const { setKhuudaslalt, khariltsagchiinGaralt, khariltsagchMutate } =
    useKhariltsagch(token, ajiltan?.baiguullagiinId, 100, query, order);
  const { khariltsagchToololt, khariltsagchToololtMutate } =
    useKhariltsagchToololt(token);
  const [formNuukh, setFormNuukh] = useState(false);
  const [jagsaaltTuukh, setJagsaaltTuukh] = useState([]);
  const [waiting, setWaiting] = useState(false);

  const [khariltsagchState, setkhariltsagchState] = useState({
    ner: undefined,
    ovog: undefined,
    register: undefined,
    khayag: undefined,
    utas: [],
    email: undefined,
    turul: undefined,
    tuluv: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
  });

  const khyanaltiinDun = [
    {
      too: khariltsagchToololt
        ?.filter((a) => a._id !== true && a._id !== false && a._id !== null)
        ?.reduce((a, b) => a + b.too, 0),
      icon: (
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
          className="feather feather-users"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      khuvi: 100,
      utga: "Нийт",
      query: {},
    },
    {
      too: khariltsagchToololt?.find((x) => x._id === "Иргэн")?.too || 0,
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
      khuvi: 100,
      utga: "Иргэн",
      query: { turul: "Иргэн" },
    },
    {
      too: khariltsagchToololt?.find((x) => x._id === "ААН")?.too || 0,
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

      khuvi: -30,
      utga: "ААН",
      query: { turul: "ААН" },
    },
    {
      too: khariltsagchToololt?.find((x) => x._id === false)?.too || 0,
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
      utga: "Идэвхгүй",
      query: { idevkhiteiEsekh: [false, null] },
    },
  ];

  const { Option } = Select;

  function onChange(talbar, utga) {
    setkhariltsagchState((a) => ({ ...a, [talbar]: utga }));
  }
  function tuukh(data) {
    getListMethod(
      "geree",
      token,
      (data = {
        query: {
          register: data.register,
          baiguullagiinId: ajiltan.baiguullagiinId,
        },
      })
    )
      .then(({ data }) => {
        if (data !== undefined) {
          setJagsaaltTuukh(data);
        }
      })
      .catch(aldaaBarigch);
  }

  function khariltsagchBurtgekh() {
    if (!khariltsagchState.utas || khariltsagchState.utas?.length < 1) {
      notification.warn({
        description: "Утасны дугаар оруулна уу !",
        message: "Анхаар",
      });
      return;
    }
    setWaiting(true);
    khariltsagchState.baiguullagiinId = ajiltan?.baiguullagiinId;
    khariltsagchState.barilgiinId = barilgiinId;

    if (khariltsagchState.zasakhEsekh === true) {
      updateMethod("khariltsagch", token, khariltsagchState)
        .then(({ data }) => {
          if (data !== undefined) {
            setWaiting(false);
            message.success("Бүртгэл амжилттай засагдлаа");
            formRef.current.resetFields();
            khariltsagchMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
            khariltsagchToololtMutate();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else {
      createMethod("khariltsagch", token, khariltsagchState)
        .then(({ data }) => {
          if (data !== undefined) {
            setWaiting(false);
            message.success("Бүртгэл амжилттай хийгдлээ");
            formRef.current.resetFields();
            khariltsagchMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
            khariltsagchToololtMutate();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    }
  }

  function zasya(data) {
    data.zasakhEsekh = true;
    formRef.current.setFieldsValue({ ...data });
    setkhariltsagchState(data);
  }

  function khariltsagchUstgay(mur) {
    setWaiting(true);
    uilchilgee(token)
      .post("/khariltsagchUstgaya", { id: mur._id })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setWaiting(false);
          khariltsagchMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
          message.success("Устгагдлаа");
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setWaiting(false);
      });
  }

  function onFinish() {
    khariltsagchBurtgekh();
  }

  function onRefresh() {
    khariltsagchMutate();
    khariltsagchToololtMutate();
  }

  function checkRegister() {
    var value1 = khariltsagchState.register.substring(0, 2);
    var value2 = khariltsagchState.register.substring(2, 10);
    var error = 0;
    for (var i = 0; i < 2; i++) {
      var c = value1.charCodeAt(i);
      if (c) {
        var alp = value1.charAt(i);
        if (
          c !== 32 &&
          c !== 45 &&
          c !== 46 &&
          (c < 65 || (c < 97 && c > 90) || c > 122) &&
          (c < 1024 || c > 1535)
        ) {
          value1 = value1.replace(alp, "");
          error++;
        }
      }
    }
    for (i = 0; i < 8; i++) {
      c = value2.charCodeAt(i);
      if (c) {
        alp = value2.charAt(i);
        if (c < 48 || c > 57) {
          value2 = value2.replace(alp, "");
          error++;
        }
      }
    }
    if (
      khariltsagchState.register.length <= 2 ||
      khariltsagchState.register.length > 10 ||
      error > 0
    ) {
      khariltsagchState.register = value1.toUpperCase() + value2;
    }
    if (khariltsagchState.register.length === 10) {
      var year = parseInt(khariltsagchState.register.substring(2, 4));
      var month = parseInt(khariltsagchState.register.substring(4, 6));
      month = month - 1;
      var day = parseInt(khariltsagchState.register.substring(6, 8));
      var nowYear = new Date().getFullYear().toString().substring(2, 4);
      if (month > 32 || (12 < month && month < 21)) {
        message.warning("Регистерийн дугаарын сар буруу байна!");
        khariltsagchState.register = "";
        return;
      } else if (year > nowYear && 21 <= month && month <= 32) {
        message.warning("Регистерийн дугаарын жил, сарын хослол буруу байна!");
        khariltsagchState.register = "";
        return;
      }

      var jil = month <= 32 && month >= 21 ? 2000 + year : 1900 + year;
      var sar = month <= 32 && month >= 21 ? month - 20 : month;
      var shineDate = new Date(jil, sar, 1);
      var shine = new Date(shineDate - 1);
      var nowDay = shine.getDate();
      if (nowDay < day) {
        message.warning("Регистерийн дугаарын өдөр буруу байна!");
        return;
      }
    }
  }
  function turulSongokh(value) {
    onChange("turul", value);
    setFormNuukh(value);
  }

  function talbaiOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>Хаах</Button>,
        <Button
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          onClick={() => excelref.current.khaaya()}
        >
          Хадгалах
        </Button>
        ,
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <ExceleesOruulakh
          onFinish={onRefresh}
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          zam="khariltsagchTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Харилцагч загварын excel файл"
          zagvariinZam="khariltsagchZagvarAvya"
        />
      ),
      footer,
    });
  }

  return (
    <Admin
      title="Харилцагч бүртгэл"
      khuudasniiNer="khariltsagchBurtgel"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      tsonkhniiId="61c2c6731c2830c4e6f90c9d"
      loading={waiting}
    >
      <div className="box col-span-12 p-5 md:col-span-6 xl:col-span-3">
        <Form ref={formRef} name="control-ref" onFinish={onFinish}>
          <div data-aos="fade-right" data-aos-duration="1000">
            <Form.Item
              name="turul"
              rules={[
                {
                  required: true,
                  message: "Төрөл сонгоно уу!",
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                value={khariltsagchState.turul}
                placeholder={"Төрөл сонгох"}
                onChange={turulSongokh}
              >
                <Option value="Иргэн">Иргэн</Option>
                <Option value="ААН">ААН</Option>
              </Select>
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="100"
          >
            <Form.Item
              hidden={formNuukh === "ААН" ? true : false}
              name="ovog"
              rules={[
                {
                  required: true,
                  message: "Овог бүртгэнэ үү!",
                },
              ]}
            >
              <Input
                type="text"
                allowClear
                placeholder="Овог"
                value={khariltsagchState.ovog}
                prefix={<UserOutlined style={iconColor} />}
                onChange={(e) => onChange("ovog", e.target.value)}
              ></Input>
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <Form.Item
              name="ner"
              rules={[
                {
                  required: true,
                  message: "Нэр бүртгэнэ үү!",
                },
              ]}
            >
              <Input
                type="text"
                allowClear
                placeholder="Нэр"
                value={khariltsagchState.ner}
                prefix={<UserOutlined style={iconColor} />}
                onChange={(e) => onChange("ner", e.target.value)}
              ></Input>
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <Form.Item
              name="register"
              rules={[
                {
                  required: true,
                  len: formNuukh === "ААН" ? 7 : 10,
                  pattern:
                    formNuukh === "ААН"
                      ? new RegExp("(\\d{7})")
                      : new RegExp("([А-Я|Ө|Ү]{2})(\\d{8})"),
                  message: "Регистр бүртгэнэ үү!",
                },
              ]}
            >
              <Input
                allowClear
                maxLength={10}
                placeholder="Регистр"
                value={khariltsagchState.register}
                onChange={(e) => onChange("register", e.target.value)}
                prefix={<SolutionOutlined style={iconColor} />}
                onBlur={() => (formNuukh === "ААН" ? "" : checkRegister())}
              ></Input>
            </Form.Item>
          </div>

          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            <Form.Item
              name="khayag"
              rules={[
                {
                  required: true,
                  message: "Хаяг бүртгэнэ үү!",
                },
              ]}
            >
              <Input
                allowClear
                placeholder="Хаяг"
                value={khariltsagchState.khayag}
                onChange={(e) => onChange("khayag", e.target.value)}
                prefix={<HomeOutlined style={iconColor} />}
              ></Input>
            </Form.Item>
          </div>

          <div
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="400"
            className="relative flex flex-wrap"
          >
            <Form.List
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 2) {
                      return Promise.reject(
                        new Error("Утасны дугаар бүртгэнэ үү")
                      );
                    }
                  },
                },
              ]}
              name={"utas"}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        rules={[
                          { required: true, message: "Дугаар оруулна уу" },
                        ]}
                      >
                        <Input
                          placeholder={"Утасны дугаар " + (field.name + 1)}
                          onChange={({ target }) => {
                            setkhariltsagchState((a) => {
                              _.set(a, "utas." + field.name, target.value);
                              return a;
                            });
                          }}
                        />
                      </Form.Item>

                      <MinusCircleOutlined
                        className="mr-3 -ml-1"
                        onClick={() => {
                          remove(field.name);
                          setkhariltsagchState((a) => {
                            a.utas.splice(a.name, 1);
                            return a;
                          });
                        }}
                      />
                    </Space>
                  ))}

                  <Form.Item className="w-full">
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Утасны дугаар нэмэх
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="600"
          >
            <Form.Item name="mail">
              <Input
                type="email"
                placeholder="И-мэйл хаяг"
                value={khariltsagchState.email}
                onChange={(e) => onChange("mail", e.target.value)}
                prefix={<MailOutlined style={iconColor} />}
              />
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="700"
          >
            <Form.Item>
              <Button
                htmlType="submit"
                style={{ backgroundColor: "#209669", color: "#ffffff" }}
              >
                Хадгалах
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="box col-span-12 overflow-auto p-5 md:col-span-6 xl:col-span-9">
        <div className="grid w-full grid-cols-12 gap-6 border-solid">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className={`intro-y zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 lg:col-span-3 ${
                  JSON.stringify(query) === JSON.stringify(mur.query)
                    ? "bg-green-50"
                    : ""
                }`}
                onClick={() => setQuery(mur.query)}
                data-aos="zoom-out-left"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
              >
                <div className="h-full rounded-xl">
                  <div className="rounded-xl p-3">
                    <div className="flex">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {mur.utga}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-2xl text-green-600">
                          {mur.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="mb-5 flex flex-row"
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="300"
        >
          <div></div>
          <div className="ml-auto flex">
            <Popover
              content={() => (
                <div className="flex w-32 flex-col">
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700  "
                    onClick={talbaiOruulakhExcel}
                  >
                    <UploadOutlined style={{ fontSize: "18px" }} />
                    <label>Оруулах</label>
                  </a>
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                    onClick={() => {
                      const { Excel } = require("antd-table-saveas-excel");
                      const excel = new Excel();
                      excel
                        .addSheet("харилцагч")
                        .addColumns([
                          {
                            title: "Төрөл",
                            dataIndex: "turul",
                            align: "center",
                            ellipsis: true,
                            render: (turul) => {
                              return (
                                <Tag
                                  color={turul === "Иргэн" ? "blue" : "orange"}
                                >
                                  {turul}
                                </Tag>
                              );
                            },
                          },
                          {
                            title: "Регистр",
                            dataIndex: "register",
                            ellipsis: true,
                          },
                          { title: "Нэр", dataIndex: "ner", ellipsis: true },
                          {
                            title: "Хаяг",
                            dataIndex: "khayag",
                            ellipsis: true,
                            width: "5rem",
                          },
                          {
                            title: "Утас",
                            dataIndex: "utas",
                            ellipsis: true,
                            render(a) {
                              return a?.join(",");
                            },
                          },
                          {
                            title: "И-мэйл",
                            dataIndex: "mail",
                            ellipsis: true,
                            width: "5rem",
                            align: "center",
                          },
                          {
                            title: "Төлөв",
                            dataIndex: "tuluv",
                            ellipsis: true,
                            align: "center",
                            render: () => {
                              return <Tag color="green">Идэвхтэй</Tag>;
                            },
                          },
                          {
                            title: "Бүртгэгдсэн",
                            dataIndex: "createdAt",
                            ellipsis: true,
                            render: (data) => {
                              return moment(data).format("YYYY-MM-DD");
                            },
                          },
                        ])
                        .addDataSource(khariltsagchiinGaralt?.jagsaalt)
                        .saveAs("харилцагчийн жагсаалт.xlsx");
                    }}
                  >
                    <DownloadOutlined style={{ fontSize: "18px" }} />
                    <label>Татах</label>
                  </a>
                </div>
              )}
              placement="bottom"
              trigger="click"
            >
              <Button
                type="primary"
                style={{ marginTop: "10px" }}
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              >
                <span>Excel</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
          </div>
        </div>
        <div
          className="mt-8 hidden overflow-auto md:block"
          data-aos="fade-up-left"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          <Table
            bordered
            tableLayout={
              khariltsagchiinGaralt?.jagsaalt?.length > 0 ? "auto" : "fixed"
            }
            scroll={{ y: "calc(100vh - 27rem)" }}
            rowKey={(row) => row._id}
            dataSource={khariltsagchiinGaralt?.jagsaalt}
            pagination={{
              current: khariltsagchiinGaralt?.khuudasniiDugaar,
              pageSize: khariltsagchiinGaralt?.khuudasniiKhemjee,
              total: khariltsagchiinGaralt?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            loading={!khariltsagchiinGaralt}
            size="small"
            rowSelection={{
              onSelect: (selectedRowKeys) => {
                console.log("selectedRowKeys changed: ", selectedRowKeys);
              },
            }}
            onChange={onChangeTable}
            columns={[
              {
                title: "№",
                key: "index",
                className: "text-center",
                render: (text, record, index) =>
                  (khariltsagchiinGaralt?.khuudasniiDugaar || 0) *
                    (khariltsagchiinGaralt?.khuudasniiKhemjee || 0) -
                  (khariltsagchiinGaralt?.khuudasniiKhemjee || 0) +
                  index +
                  1,
              },
              {
                title: "Төрөл",
                dataIndex: "turul",
                align: "center",
                ellipsis: true,
                render: (turul) => {
                  return (
                    <Tag
                      className={
                        turul === "Иргэн"
                          ? "dark:bg-blue-600 dark:text-white"
                          : "dark:bg-yellow-600 dark:text-white"
                      }
                      color={turul === "Иргэн" ? "blue" : "orange"}
                    >
                      {turul}
                    </Tag>
                  );
                },
              },
              {
                title: "Регистр",
                dataIndex: "register",
                ellipsis: true,
                showSorterTooltip: false,
                sorter: () => 0,
              },
              {
                title: "Нэр",
                dataIndex: "ner",
                ellipsis: true,
                showSorterTooltip: false,
                sorter: () => 0,
              },
              {
                title: "Хаяг",
                dataIndex: "khayag",
                ellipsis: true,
                width: "5rem",
              },
              {
                title: "Утас",
                dataIndex: "utas",
                ellipsis: true,
                render(a) {
                  return a?.join(",");
                },
              },
              {
                title: "И-мэйл",
                dataIndex: "mail",
                ellipsis: true,
                width: "5rem",
                align: "center",
              },
              {
                title: "Төлөв",
                dataIndex: "idevkhiteiEsekh",
                ellipsis: true,
                align: "center",
                render: (idevkhiteiEsekh) => {
                  return (
                    <Tag
                      className={
                        idevkhiteiEsekh === true
                          ? "dark:bg-green-600 dark:text-white"
                          : "dark:bg-red-700 dark:text-white"
                      }
                      color={idevkhiteiEsekh === true ? "green" : "red"}
                    >
                      {idevkhiteiEsekh === true ? "Идэвхтэй" : "Идэвхгүй"}
                    </Tag>
                  );
                },
                showSorterTooltip: false,
                sorter: () => 0,
              },
              {
                title: "Түүх",
                width: "4rem",
                align: "center",
                render: (data) => {
                  return (
                    <Popover
                      trigger="click"
                      content={
                        <Table
                          bordered
                          style={{
                            display: "flex",
                            width: "800px",
                          }}
                          size="small"
                          dataSource={jagsaaltTuukh?.jagsaalt}
                          columns={[
                            {
                              title: "№",
                              key: "index",
                              className: "text-center",
                              render: (text, record, index) =>
                                (jagsaaltTuukh?.khuudasniiDugaar || 0) *
                                  (jagsaaltTuukh?.khuudasniiKhemjee || 0) -
                                (jagsaaltTuukh?.khuudasniiKhemjee || 0) +
                                index +
                                1,
                            },
                            {
                              title: "Талбай",
                              dataIndex: "talbainDugaar",
                              ellipsis: true,
                            },
                            {
                              title: "Эхлэх",
                              dataIndex: "gereeniiOgnoo",
                              ellipsis: true,
                              render: (gereeniiOgnoo) => {
                                return moment(gereeniiOgnoo).format(
                                  "YYYY-MM-DD"
                                );
                              },
                            },
                            {
                              title: "Дуусах",
                              dataIndex: "duusakhOgnoo",
                              ellipsis: true,
                              render: (duusakhOgnoo) => {
                                return moment(duusakhOgnoo).format(
                                  "YYYY-MM-DD"
                                );
                              },
                            },
                            {
                              title: "Хугацаа",
                              dataIndex: "khugatsaa",
                              ellipsis: true,
                            },
                            {
                              title: "Хэмжээ/m2/",
                              dataIndex: "talbainKhemjee",
                              ellipsis: true,
                            },
                            {
                              title: "Сарын түрээс",
                              dataIndex: "sariinTurees",
                              ellipsis: true,
                              render: (sariinTurees) => {
                                return formatNumber(sariinTurees);
                              },
                            },
                            {
                              title: "Нийт үнэ",
                              dataIndex: "talbainNiitUne",
                              ellipsis: true,
                              render: (talbainNiitUne) => {
                                return formatNumber(talbainNiitUne);
                              },
                            },
                          ]}
                        ></Table>
                      }
                    >
                      <a
                        className=" flex items-center justify-center hover:bg-gray-200"
                        onClick={() => tuukh(data)}
                      >
                        <EyeOutlined style={{ fontSize: "18px" }} />
                      </a>
                    </Popover>
                  );
                },
              },
              {
                title: "Бүртгэгдсэн",
                dataIndex: "createdAt",
                ellipsis: true,
                render: (data) => {
                  return moment(data).format("YYYY-MM-DD");
                },
              },
              {
                title: () => <SettingOutlined />,
                align: "center",
                width: "1rem",
                ellipsis: true,
                render: (data) => (
                  <div className="flex flex-row">
                    <Popover
                      placement="bottom"
                      trigger="click"
                      content={() => (
                        <div className="flex w-24 flex-col space-y-2">
                          <a
                            className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100"
                            onClick={() => zasya(data)}
                          >
                            <EditOutlined style={{ fontSize: "18px" }} />
                            <label>Засах</label>
                          </a>
                          <Popconfirm
                            title="Харилцагч устгах уу?"
                            okText="Тийм"
                            cancelText="Үгүй"
                            onConfirm={() => khariltsagchUstgay(data)}
                          >
                            <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100">
                              <DeleteOutlined
                                style={{ fontSize: "18px", color: "red" }}
                              />
                              <label>Устгах</label>
                            </a>
                          </Popconfirm>
                        </div>
                      )}
                    >
                      <a className="flex items-center justify-center hover:bg-gray-200">
                        <MoreOutlined style={{ fontSize: "18px" }} />
                      </a>
                    </Popover>
                  </div>
                ),
              },
            ]}
          />
        </div>
        <CardList
          keyValue="khariltsagch"
          className="block overflow-auto md:hidden"
          jagsaalt={khariltsagchiinGaralt?.jagsaalt}
          Component={KhariltsagchTile}
          pagination={{
            current: khariltsagchiinGaralt?.khuudasniiDugaar,
            pageSize: khariltsagchiinGaralt?.khuudasniiKhemjee,
            total: khariltsagchiinGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
