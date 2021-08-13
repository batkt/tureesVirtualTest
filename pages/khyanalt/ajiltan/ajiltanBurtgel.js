import {
  Button,
  Input,
  message,
  Select,
  Table,
  Space,
  DatePicker,
  Divider,
  Upload,
  Form,
  Popconfirm,
  Popover,
  Empty,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  SolutionOutlined,
  MailOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import shalgaltKhiikh from "../../../services/shalgaltKhiikh";

import Admin from "../../../components/Admin";
import uilchilgee, { aldaaBarigch, url } from "../../../services/uilchilgee";
import { useAuth } from "../../../services/auth";
import React, { useState, useRef } from "react";
import moment from "moment";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import getBase64 from "tools/function/getBase64";

const iconColor = { fontSize: "18px" };

function AjiltanBurtgel({ token }) {
  const formRef = useRef();
  const zurag = useRef();
  const empty = useRef();

  const { ajiltan, baiguullaga } = useAuth();
  const { ajilchdiinGaralt, setAjiltniiKhuudaslalt, ajiltniiJagsaaltMutate } =
    useAjiltniiJagsaalt(token, baiguullaga?._id);

  const [ajiltanState, setAjiltanState] = useState({
    ner: undefined,
    ovog: undefined,
    register: undefined,
    khayag: undefined,
    utas: undefined,
    albanTushaal: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
  });

  const { Option } = Select;

  function onChange(talbar, utga) {
    setAjiltanState((a) => ({ ...a, [talbar]: utga }));
  }
  function ajiltanBurtgekh() {
    if (ajiltanState.nuutsUg && ajiltanState.nuutsUg.length < 2) {
      message.warning("Нууц үг буруу оруулсан байна.");
      return;
    }

    var form_data = new FormData();
    ajiltanState.baiguullagiinId = ajiltan?.baiguullagiinId;
    switch (ajiltanState.albanTushaal) {
      case "Засварчин":
        ajiltanState.erkh = "Zasvarchin";
        break;
      case "Захиалгын менежер":
        ajiltanState.erkh = "ZakhialgiinManager";
        break;
      case "Инженер":
        ajiltanState.erkh = "Injener";
        break;
      default:
        break;
    }
    for (var key in ajiltanState) {
      form_data.append(key, ajiltanState[key]);
    }
    uilchilgee(token)
      .post("/ajiltan", form_data)
      .then(({ data }) => {
        if (data !== undefined) {
          message.success("Бүртгэл амжилттай хийгдлээ");
          formRef.current.resetFields();
          zurag.current.classList.add("hidden");
          empty.current.classList.remove("hidden");
          ajiltniiJagsaaltMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
        }
      })
      .catch(aldaaBarigch);
  }

  function zasya(data) {
    data.zasakhEsekh = true;
    if (!!data.zurgiinNer) {
      zurag.current.src = `${url}/ajiltniiZuragAvya/${data.baiguullagiinId}/${data.zurgiinNer}`;
      zurag.current.classList.remove("hidden");
      empty.current.classList.add("hidden");
    }
    data.ajildOrsonOgnoo = moment(data.ajildOrsonOgnoo);
    formRef.current.setFieldsValue({ ...data });
    setAjiltanState(data);
  }

  function ajiltanUstgay(mur) {
    if (ajiltan._id === mur._id) {
      message.warning("Та өөрийгөө устгаж болохгүй!");
      return;
    }
    uilchilgee(token)
      .post("/ajiltanUstgay", { id: mur._id })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          ajiltniiJagsaaltMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
          message.success("Устгагдлаа");
        }
      });
  }

  const props = {
    listType: "picture",
    showUploadList: false,
    className: "avatar-uploader",
    name: "avatar",
    multiple: false,
    beforeUpload: (file) => {
      getBase64(file, (img) => (zurag.current.src = img));
      zurag.current.classList.remove("hidden");
      empty.current.classList.add("hidden");
      onChange("zurag", file);
      return false;
    },
  };

  function onFinish() {
    ajiltanBurtgekh();
  }
  function checkRegister() {
    var value1 = ajiltanState.register.substring(0, 2);
    var value2 = ajiltanState.register.substring(2, 10);
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
      ajiltanState.register.length <= 2 ||
      ajiltanState.register.length > 10 ||
      error > 0
    ) {
      ajiltanState.register = value1.toUpperCase() + value2;
    }
    if (ajiltanState.register.length === 10) {
      var year = parseInt(ajiltanState.register.substring(2, 4));
      var month = parseInt(ajiltanState.register.substring(4, 6));
      month = month - 1;
      var day = parseInt(ajiltanState.register.substring(6, 8));
      var nowYear = new Date().getFullYear().toString().substring(2, 4);
      if (month > 32 || (12 < month && month < 21)) {
        message.warning("Регистерийн дугаарын сар буруу байна!");
        ajiltanState.register = "";
        return;
      } else if (year > nowYear && 21 <= month && month <= 32) {
        message.warning("Регистерийн дугаарын жил, сарын хослол буруу байна!");
        ajiltanState.register = "";
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
  return (
    <Admin
      title="Ажилтан бүртгэл"
      khuudasniiNer="ajiltanBurtgel"
      className="p-0 md:p-4"
    >
      <div className="col-span-12 md:col-span-6 xl:col-span-3 box p-5">
        {/* <div>
          <Upload {...props}>
            <div ref={empty}>
              <Empty
                className="w-24 h-24 border border-dashed border-blue-500 zurag"
                description=""
              />
            </div>
            <img
              ref={zurag}
              alt="Зураг сонгох"
              className="w-24 h-24 border border-dashed border-blue-500 hidden"
            />
          </Upload>
        </div> */}
        <Form
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <Form.Item
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
              value={ajiltanState.ovog}
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
              value={ajiltanState.ner}
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
              value={ajiltanState.register}
              onChange={(e) => onChange("register", e.target.value)}
              prefix={<SolutionOutlined style={iconColor} />}
              onBlur={() => checkRegister()}
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
              value={ajiltanState.khayag}
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
              value={ajiltanState.utas}
              onChange={(e) => onChange("utas", e.target.value)}
              prefix={<PhoneOutlined style={iconColor} />}
            ></Input>
          </Form.Item>
          <Form.Item
            name="ajildOrsonOgnoo"
            rules={[
              {
                required: true,
                message: "Ажилд орсон огноо бүртгэнэ үү!",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="ажилд орсон огноо"
              onChange={({}, v) => onChange("ajildOrsonOgnoo", v)}
            ></DatePicker>
          </Form.Item>
          <Form.Item
            name="albanTushaal"
            rules={[
              {
                required: true,
                message: "Албан тушаал бүртгэнэ үү!",
              },
            ]}
          >
            <Select
              placeholder="албан тушаал"
              value={ajiltanState.albanTushaal}
              style={{ width: "100%" }}
              onChange={(v) => onChange("albanTushaal", v)}
            >
              <Option value="Админ">Админ</Option>
              <Option value="Зохион байгуулагч">Зохион байгуулагч</Option>
              <Option value="Санхүү">Санхүү</Option>
            </Select>
          </Form.Item>

          <Divider orientation="left">Нэвтрэх нэр нууц үг</Divider>
          <Form.Item
            name="mail"
            rules={[
              {
                required: true,
                message: "Нэвтрэх нэр бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              placeholder="Нэвтрэх нэр"
              value={ajiltanState.mail}
              onChange={(e) => onChange("mail", e.target.value)}
              prefix={<MailOutlined style={iconColor} />}
            />
          </Form.Item>
          <Form.Item
            name="nuutsUg"
            rules={[
              {
                required: true,
                message: "Нууц үг бүртгэнэ үү!",
              },
            ]}
          >
            <Input.Password
              placeholder="Нууц үг"
              value={ajiltanState.nuutsUg}
              onChange={(e) => onChange("nuutsUg", e.target.value)}
              prefix={<SecurityScanOutlined style={iconColor} />}
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              //onClick={ajiltanBurtgekh}
              style={{ backgroundColor: "#209669", color: "#ffffff" }}
            >
              хадгалах
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-9 box p-5 overflow-auto">
        <Table
          bordered
          tableLayout={
            ajilchdiinGaralt?.jagsaalt?.length > 0 ? "auto" : "fixed"
          }
          rowKey={(row) => row._id}
          dataSource={ajilchdiinGaralt?.jagsaalt}
          pagination={{
            current: ajilchdiinGaralt?.khuudasniiDugaar,
            pageSize: ajilchdiinGaralt?.khuudasniiKhemjee,
            total: ajilchdiinGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setAjiltniiKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
          size="small"
          columns={[
            {
              title: "№",
              key: "index",
              className: "text-center",
              render: (text, record, index) =>
                (ajilchdiinGaralt?.khuudasniiDugaar || 0) *
                  (ajilchdiinGaralt?.khuudasniiKhemjee || 0) -
                (ajilchdiinGaralt?.khuudasniiKhemjee || 0) +
                index +
                1,
            },
            { title: "Нэр", dataIndex: "ner", ellipsis: true },
            { title: "Регистр", dataIndex: "register", ellipsis: true },
            { title: "Хаяг", dataIndex: "khayag", ellipsis: true },
            { title: "Утас", dataIndex: "utas", ellipsis: true },
            {
              title: "Ажилд орсон огноо",
              dataIndex: "ajildOrsonOgnoo",
              ellipsis: true,
              render: (data) => (
                <span>
                  {data?.ajildOrsonOgnoo !== null
                    ? moment(data?.ajildOrsonOgnoo).format("YYYY-MM-DD")
                    : ""}
                </span>
              ),
            },

            // {
            //   title: "Зураг",
            //   dataIndex: "",
            //   ellipsis: true,
            //   render: (record) => {
            //     if (record.zurgiinNer !== undefined)
            //       var zuragcomp = (
            //         <img
            //           src={
            //             record?.zurgiinNer
            //               ? `${url}/ajiltniiZuragAvya/${record?.baiguullagiinId}/${record?.zurgiinNer}`
            //               : "/profile.svg"
            //           }
            //           style={{ borderRadius: "50%" }}
            //         />
            //       )
            //     return (
            //       zuragcomp && (
            //         <Popover
            //           content={
            //             <div className="h-24 w-24 flex">{zuragcomp}</div>
            //           }
            //         >
            //           <div className="h-8 w-8 inline-flex justify-center rounded-full p-1 shadow-xl bg-gray-200">
            //             {zuragcomp}
            //           </div>
            //         </Popover>
            //       )
            //     )
            //   }
            // },
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
                      title="Ажилтан устгах уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => ajiltanUstgay(data)}
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
