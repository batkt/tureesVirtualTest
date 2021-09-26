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
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  SolutionOutlined,
  MailOutlined,
  BellOutlined,
  FileTextOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import shalgaltKhiikh from "../../../services/shalgaltKhiikh";

import Admin from "../../../components/Admin";
import Tuukh from "components/pageComponents/khariltsagch/Tuukh";
import { aldaaBarigch } from "../../../services/uilchilgee";
import { useAuth } from "../../../services/auth";
import React, { useState, useRef } from "react";
import moment from "moment";
import { useKhariltsagch } from "hooks/useKhariltsagch";
import getBase64 from "tools/function/getBase64";
import deleteMethod from "tools/function/crud/deleteMethod";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh";
import { modal } from "components/ant/Modal";

const iconColor = { fontSize: "18px" };

function AjiltanBurtgel({ token }) {
  const formRef = useRef();
  const excelref = useRef();
  const tuukhref = useRef();

  const { ajiltan } = useAuth();
  const { setKhuudaslalt, khariltsagchiinGaralt, khariltsagchMutate } =
    useKhariltsagch(token, ajiltan?.baiguullagiinId);
  const [formNuukh, setFormNuukh] = useState(false);

  const [khariltsagchState, setkhariltsagchState] = useState({
    ner: undefined,
    ovog: undefined,
    register: undefined,
    khayag: undefined,
    utas: undefined,
    email: undefined,
    turul: undefined,
    tuluv: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
  });

  const khyanaltiinDun = [
    {
      too: khariltsagchiinGaralt?.niitMur,
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
    },
    {
      too: 20,
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
    },
    {
      too: 100,
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
      utga: "Аж ахуй нэгж",
    },
    {
      too: 5,
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
  ];

  const { Option } = Select;

  function onChange(talbar, utga) {
    setkhariltsagchState((a) => ({ ...a, [talbar]: utga }));
  }
  function khariltsagchBurtgekh() {
    khariltsagchState.baiguullagiinId = ajiltan?.baiguullagiinId;
    if (khariltsagchState.zasakhEsekh === true) {
      updateMethod("khariltsagch", token, khariltsagchState)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Бүртгэл амжилттай засагдлаа");
            formRef.current.resetFields();
            khariltsagchMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
          }
        })
        .catch(aldaaBarigch);
    } else {
      createMethod("khariltsagch", token, khariltsagchState)
        .then(({ data }) => {
          if (data !== undefined) {
            message.success("Бүртгэл амжилттай хийгдлээ");
            formRef.current.resetFields();
            khariltsagchMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
          }
        })
        .catch(aldaaBarigch);
    }
  }

  function zasya(data) {
    data.zasakhEsekh = true;
    formRef.current.setFieldsValue({ ...data });
    setkhariltsagchState(data);
  }

  function khariltsagchUstgay(mur) {
    deleteMethod("khariltsagch", token, mur._id).then(({ data }) => {
      if (data !== undefined) {
        khariltsagchMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
        message.success("Устгагдлаа");
      }
    });
  }

  function onFinish() {
    khariltsagchBurtgekh();
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
    setFormNuukh(value);
  }

  function tuukhKharya(mur) {
    const footer = [
      <Space>
        <Button onClick={() => tuukhref.current.khaaya()}>Хаах</Button>,
        <Button
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          onClick={() => tuukhref.current.khaaya()}
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
        <Tuukh
          ref={tuukhref}
          token={token}
          data={mur}
          onFinish={khariltsagchMutate}
        />
      ),
      footer,
    });
  }

  function talbaiOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>Хаах</Button>,
        <Button
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          onClick={() => excelref.current.khaaya()}
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
          zam="irgenTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Харилцагч загварын excel файл"
          zagvariinZam="irgenZagvarAvya"
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
    >
      <div className="col-span-12 md:col-span-6 xl:col-span-3 box p-5">
        <Form
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
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
              placeholder="овог"
              value={khariltsagchState.ovog}
              prefix={<UserOutlined style={iconColor} />}
              onChange={(e) => onChange("ovog", e.target.value)}
            ></Input>
          </Form.Item>
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
              placeholder="нэр"
              value={khariltsagchState.ner}
              prefix={<UserOutlined style={iconColor} />}
              onChange={(e) => onChange("ner", e.target.value)}
            ></Input>
          </Form.Item>
          <Form.Item
            name="register"
            rules={[
              {
                required: true,
                len: 10,
                pattern: new RegExp("([А-Я|Ө|Ү]{2})(\\d{8})"),
                message: "Регистр бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              allowClear
              maxLength={10}
              placeholder="регистр"
              value={khariltsagchState.register}
              onChange={(e) => onChange("register", e.target.value)}
              prefix={<SolutionOutlined style={iconColor} />}
              onBlur={() => (formNuukh === "ААН" ? "" : checkRegister())}
            ></Input>
          </Form.Item>
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
              placeholder="хаяг"
              value={khariltsagchState.khayag}
              onChange={(e) => onChange("khayag", e.target.value)}
              prefix={<HomeOutlined style={iconColor} />}
            ></Input>
          </Form.Item>

          <Form.Item
            name="utas"
            rules={[
              {
                required: true,
                message: "Утас бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              allowClear
              placeholder="утас"
              value={khariltsagchState.utas}
              onChange={(e) => onChange("utas", e.target.value)}
              prefix={<PhoneOutlined style={iconColor} />}
            ></Input>
          </Form.Item>
          <Form.Item name="mail">
            <Input
              type="email"
              placeholder="и-мэйл хаяг"
              value={khariltsagchState.email}
              onChange={(e) => onChange("mail", e.target.value)}
              prefix={<MailOutlined style={iconColor} />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              //htmlType="submit"
              onClick={khariltsagchBurtgekh}
              style={{ backgroundColor: "#209669", color: "#ffffff" }}
            >
              хадгалах
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-9 box p-5 overflow-auto">
        <div className="w-full flex border-solid  grid-cols-12 gap-6">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className="w-full block justify-between border-2 h-20 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-2 intro-y cursor-pointer zoom-in"
              >
                <div className="h-full rounded-xl">
                  <div className="p-3 rounded-xl">
                    <div className="flex">
                      <div>
                        <div className="text-2xl text-green-600 font-bold">
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {mur.utga}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-green-600 text-2xl">
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
        <div className="flex flex-row mb-5">
          <div>
            <Button
              style={{
                alignItems: "end",
                backgroundColor: "#209669",
                color: "#ffffff",
                marginTop: "20px",
              }}
              icon={<BellOutlined style={{ fontSize: "16px" }} />}
            >
              Мэдэгдэл илгээх
            </Button>
          </div>
          <div className="ml-auto">
            <Button
              style={{
                alignItems: "end",
                backgroundColor: "#209669",
                color: "#ffffff",
                marginTop: "20px",
              }}
              icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              onClick={talbaiOruulakhExcel}
            >
              Excel -ээс Харилцагч татах
            </Button>
          </div>
        </div>
        <Table
          bordered
          tableLayout={
            khariltsagchiinGaralt?.jagsaalt?.length > 0 ? "auto" : "fixed"
          }
          scroll={{ y: "calc(100vh - 19rem)" }}
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
          size="small"
          rowSelection={{
            onSelect: (selectedRowKeys) => {
              console.log("selectedRowKeys changed: ", selectedRowKeys);
            },
          }}
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
              ellipsis: true,
              render: (turul) => {
                return (
                  <Tag color={turul === "Иргэн" ? "blue" : "orange"}>
                    {turul}
                  </Tag>
                );
              },
            },
            { title: "Регистр", dataIndex: "register", ellipsis: true },
            { title: "Нэр", dataIndex: "ner", ellipsis: true },
            { title: "Хаяг", dataIndex: "khayag", ellipsis: true },
            { title: "Утас", dataIndex: "utas", ellipsis: true },
            { title: "И-мэйл хаяг", dataIndex: "mail", ellipsis: true },
            {
              title: "Төлөв",
              dataIndex: "tuluv",
              ellipsis: true,
              render: () => {
                return <Tag color="green">Идэвхтэй</Tag>;
              },
            },
            {
              title: "Түүх",
              ellipsis: true,
              render: (mur) => (
                <a
                  className="p-2 rounded-full hover:bg-gray-200 flex items-center justify-center"
                  onClick={() => tuukhKharya(mur)}
                >
                  <FileTextOutlined style={{ fontSize: "18px" }} />
                </a>
              ),
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
              title: "Тохиргоо",
              ellipsis: true,
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
                      title="Харилцагч устгах уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => khariltsagchUstgay(data)}
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
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
