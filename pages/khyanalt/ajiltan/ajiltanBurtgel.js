import {
  Button,
  Input,
  message,
  Select,
  Table,
  DatePicker,
  Divider,
  Form,
  Popconfirm,
  Popover,
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
  MoreOutlined,
  SettingOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import shalgaltKhiikh from "services/shalgaltKhiikh";

import Admin from "components/Admin";
import { aldaaBarigch, url } from "services/uilchilgee";
import { useAuth } from "services/auth";
import React, { useState, useRef, useEffect, useCallback } from "react";
import moment from "moment";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import deleteMethod from "tools/function/crud/deleteMethod";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { useRouter } from "next/router";
import CardList from "components/cardList";
import AjiltanTile from "components/pageComponents/ajiltan/AjiltanTile";
import Aos from "aos";
import { useTranslation } from "react-i18next";

const iconColor = { fontSize: "18px" };

function AjiltanBurtgel({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const formRef = useRef();
  const zurag = useRef();
  const empty = useRef();
  const { t } = useTranslation();
  const router = useRouter();
  const { ajiltan, barilgiinId } = useAuth();
  const {
    ajilchdiinGaralt,
    setAjiltniiKhuudaslalt,
    ajiltniiJagsaaltMutate,
    isValidating,
  } = useAjiltniiJagsaalt(token, ajiltan?.baiguullagiinId);

  const [ajiltanState, setAjiltanState] = useState({
    ner: undefined,
    ovog: undefined,
    register: undefined,
    khayag: undefined,
    utas: undefined,
    albanTushaal: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
    ajildOrsonOgnoo: moment(),
  });
  const [waiting, setWaiting] = useState(false);
  const [neesenEsekh, setNeesenEsekh] = useState(false);

  useEffect(() => {
    document.getElementById("input1").focus();
  }, []);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "input1":
          document.getElementById("input2").focus();
          break;
        case "input2":
          document.getElementById("input3").focus();
          break;
        case "input3":
          document.getElementById("input4").focus();
          break;
        case "input4":
          document.getElementById("input5").focus();
          break;
        case "input5":
          document.getElementById("input6").focus();
          break;
        case "input7":
          document.getElementById("input8").focus();
          break;
        case "input8":
          document.getElementById("input9").focus();
          break;
        case "input9":
          document.getElementById("khadgalyaButton").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  function onChange(talbar, utga) {
    setAjiltanState((a) => ({ ...a, [talbar]: utga }));
  }
  function ajiltanBurtgekh() {
    if (ajiltanState.nuutsUg && ajiltanState.nuutsUg.length < 2) {
      message.warning("Нууц үг буруу оруулсан байна.");
      return;
    }
    setWaiting(true);

    var form_data = new FormData();
    ajiltanState.baiguullagiinId = ajiltan?.baiguullagiinId;
    ajiltanState.barilguud = [barilgiinId];

    switch (ajiltanState.albanTushaal) {
      case "Админ":
        ajiltanState.erkh = "Admin";
        break;
      case "Зохион байгуулагч":
        ajiltanState.erkh = "ZokhionBaiguulagch";
        break;
      case "Санхүү":
        ajiltanState.erkh = "Sankhuu";
        break;
      default:
        break;
    }
    for (var key in ajiltanState) {
      form_data.append(key, ajiltanState[key]);
    }
    if (ajiltanState.zasakhEsekh === true) {
      updateMethod("ajiltan", token, ajiltanState)
        .then(({ data }) => {
          if (data !== undefined) {
            setWaiting(false);
            message.success(t("Бүртгэл амжилттай хийгдлээ"));
            formRef.current.resetFields();
            ajiltniiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            );
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else {
      createMethod("ajiltan", token, ajiltanState)
        .then(({ data }) => {
          if (data !== undefined) {
            setWaiting(false);
            message.success(t("Бүртгэл амжилттай хийгдлээ"));
            formRef.current.resetFields();
            ajiltniiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            );
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
    if (!!data.zurgiinNer) {
      zurag.current.src = `${url}/ajiltniiZuragAvya/${data.baiguullagiinId}/${data.zurgiinNer}`;
      zurag.current.classList.remove("hidden");
      empty.current.classList.add("hidden");
    }
    data.ajildOrsonOgnoo = moment(data.ajildOrsonOgnoo);
    formRef.current.setFieldsValue({ ...data });
    setAjiltanState(data);
  }
  useEffect(() => {}, []);

  function ajiltanUstgay(mur) {
    if (ajiltan._id === mur._id) {
      message.warning("Та өөрийгөө устгаж болохгүй!");
      return;
    }
    setWaiting(true);
    deleteMethod("ajiltan", token, mur._id)
      .then(({ data }) => {
        if (data !== undefined || data !== null) {
          setWaiting(false);
          ajiltniiJagsaaltMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
          message.success(t("Устгагдлаа"));
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setWaiting(false);
      });
  }

  function onFinish() {
    ajiltanBurtgekh();
  }

  function tokhiruulya(data) {
    router.push(`/khyanalt/ajiltan/tokhirgoo/${data?._id}`);
  }

  return (
    <Admin
      title="Ажилтан бүртгэл"
      khuudasniiNer="ajiltanBurtgel"
      setNeesenEsekh={setNeesenEsekh}
      className="p-0 md:p-4"
      onSearch={(search) =>
        setAjiltniiKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      tsonkhniiId={"61c2c6571c2830c4e6f90c95"}
      loading={waiting || isValidating}
    >
      <div className="box col-span-12 p-5 md:col-span-6 xl:col-span-3">
        <Form
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          initialValues={{ remember: true, ajildOrsonOgnoo: moment() }}
          autoComplete={"off"}
        >
          <div data-aos="fade-right" data-aos-duration="800">
            <Form.Item
              name="ovog"
              rules={[
                {
                  required: true,
                  message: t("Овог бүртгэнэ үү!"),
                },
              ]}
            >
              <Input
                autoComplete="off"
                id="input1"
                onKeyUp={focuser}
                autoFocus={true}
                type="text"
                allowClear
                placeholder={t("Овог")}
                value={ajiltanState.ovog}
                prefix={<UserOutlined style={iconColor} />}
                onChange={(e) => onChange("ovog", e.target.value)}
              ></Input>
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="100"
          >
            <Form.Item
              name="ner"
              rules={[
                {
                  required: true,
                  message: t("Нэр заавал оруулна уу!"),
                },
              ]}
            >
              <Input
                autoComplete="off"
                id="input2"
                onKeyUp={focuser}
                type="text"
                allowClear
                placeholder={t("Нэр")}
                value={ajiltanState.ner}
                prefix={<UserOutlined style={iconColor} />}
                onChange={(e) => onChange("ner", e.target.value)}
              ></Input>
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="200"
          >
            <Form.Item
              name="register"
              rules={[
                {
                  required: true,
                  len: 10,
                  pattern: new RegExp("([А-Я|Ө|Ү]{2})(\\d{8})"),
                  message: t("Регистр бүртгэнэ үү!"),
                },
              ]}
            >
              <Input
                autoComplete="off"
                id="input3"
                onKeyUp={focuser}
                allowClear
                maxLength={10}
                placeholder={t("Регистр")}
                value={ajiltanState.register}
                onChange={(e) =>
                  onChange("register", e?.target?.value?.toUpperCase())
                }
                prefix={<SolutionOutlined style={iconColor} />}
              ></Input>
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="300"
          >
            <Form.Item
              autoComplete="off"
              name="khayag"
              rules={[
                {
                  required: true,
                  message: t("Хаяг бүртгэнэ үү!"),
                },
              ]}
            >
              <Input
                autoComplete="off"
                id="input4"
                onKeyUp={focuser}
                allowClear
                placeholder={t("Хаяг")}
                value={ajiltanState.khayag}
                onChange={(e) => onChange("khayag", e.target.value)}
                prefix={<HomeOutlined style={iconColor} />}
              ></Input>
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="400"
          >
            <Form.Item
              name="utas"
              rules={[
                {
                  min: 8,
                  required: true,
                  message: t("Утасны дугаар оруулна уу !"),
                },
              ]}
            >
              <Input
                autoComplete="off"
                className="appearance-none"
                type="number"
                id="input5"
                onKeyUp={focuser}
                allowClear
                placeholder={t("Утас")}
                value={ajiltanState.utas}
                onChange={(e) => onChange("utas", e.target.value)}
                prefix={<PhoneOutlined style={iconColor} />}
              ></Input>
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="500"
          >
            <Form.Item
              autoComplete="off"
              name="ajildOrsonOgnoo"
              rules={[
                {
                  required: true,
                  message: t("Ажилд орсон огноо бүртгэнэ үү!"),
                },
              ]}
            >
              <DatePicker
                id="input6"
                style={{ width: "100%" }}
                placeholder={t("Ажилд орсон огноо")}
                onChange={(v) => {
                  onChange("ajildOrsonOgnoo", v);
                  document.getElementById("input7").focus();
                }}
              ></DatePicker>
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="600"
          >
            <Form.Item
              autoComplete="off"
              name="albanTushaal"
              rules={[
                {
                  required: true,
                  message: t("Албан тушаал бүртгэнэ үү!"),
                },
              ]}
            >
              <Input
                autoComplete="off"
                id="input7"
                onKeyDown={focuser}
                allowClear
                placeholder={t("Албан тушаал")}
                value={ajiltanState.albanTushaal}
                onChange={(e) => onChange("albanTushaal", e.target.value)}
                prefix={<ContactsOutlined style={iconColor} />}
              ></Input>
            </Form.Item>
          </div>
          <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="900">
            <Divider orientation="left">{t("Нэвтрэх нэр нууц үг")}</Divider>
            <Form.Item
              autoComplete="off"
              name="nevtrekhNer"
              rules={[
                {
                  required: true,
                  message: t("Нэвтрэх нэр оруулан уу"),
                },
              ]}
            >
              <Input
                autoComplete="off"
                onKeyDown={focuser}
                id="input8"
                placeholder={t("Нэвтрэх нэр")}
                value={ajiltanState.nevtrekhNer}
                onChange={(e) => onChange("nevtrekhNer", e.target.value)}
                prefix={<MailOutlined style={iconColor} />}
              />
            </Form.Item>
            <Form.Item
              autoComplete="off"
              name="nuutsUg"
              rules={
                !!ajiltanState._id
                  ? undefined
                  : [
                      {
                        required: true,
                        message: t("Нэвтрэх нууц үг бүртгэнэ үү!"),
                      },
                    ]
              }
            >
              <Input.Password
                onKeyDown={focuser}
                id="input9"
                placeholder={t("Нууц үг")}
                value={ajiltanState.nuutsUg}
                onChange={(e) => onChange("nuutsUg", e.target.value)}
                prefix={<SecurityScanOutlined style={iconColor} />}
              />
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button
                id="khadgalyaButton"
                onClick={() => formRef.current.submit()}
                type="primary"
              >
                {t("Хадгалах")}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="box col-span-12 mb-16 p-5 md:col-span-6 md:mb-0 xl:col-span-9">
        <div
          className="hidden md:block"
          data-aos="fade-down-left"
          data-aos-duration="1500"
          data-aos-delay="100"
        >
          <Table
            bordered
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
                width: "3rem",
                align: "center",
                key: "index",
                className: "text-center",
                render: (text, record, index) =>
                  (ajilchdiinGaralt?.khuudasniiDugaar || 0) *
                    (ajilchdiinGaralt?.khuudasniiKhemjee || 0) -
                  (ajilchdiinGaralt?.khuudasniiKhemjee || 0) +
                  index +
                  1,
              },
              {
                title: t("Нэр"),
                align: "center",
                dataIndex: "ner",
                ellipsis: true,
                render(a) {
                  return <div className="w-full text-left">{a}</div>;
                },
              },
              {
                title: t("Регистр"),
                dataIndex: "register",
                ellipsis: true,
                align: "center",
              },
              {
                title: t("Хаяг"),
                dataIndex: "khayag",
                ellipsis: true,
                align: "center",
                render(a) {
                  return <div className="w-full text-left">{a}</div>;
                },
              },
              {
                title: t("Утас"),
                dataIndex: "utas",
                ellipsis: true,
                align: "center",
              },
              {
                title: t("Ажилд орсон огноо"),
                dataIndex: "ajildOrsonOgnoo",
                ellipsis: true,
                align: "center",
                render: (ajildOrsonOgnoo) => (
                  <span>
                    {ajildOrsonOgnoo !== null
                      ? moment(ajildOrsonOgnoo).format("YYYY-MM-DD HH:mm")
                      : ""}
                  </span>
                ),
              },
              {
                title: () => <SettingOutlined />,
                align: "center",
                width: "2rem",
                ellipsis: true,
                render: (data) =>
                  ajiltan?.erkh === "Admin" && (
                    <div className="flex flex-row">
                      <Popover
                        placement="bottom"
                        trigger="click"
                        content={() => (
                          <div className="flex w-24 flex-col space-y-2">
                            <a
                              className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                              onClick={() => zasya(data)}
                            >
                              <EditOutlined style={{ fontSize: "18px" }} />
                              <label>{t("Засах")}</label>
                            </a>
                            <a
                              className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                              onClick={() => tokhiruulya(data)}
                            >
                              <SettingOutlined style={{ fontSize: "18px" }} />
                              <label>{t("Эрх")}</label>
                            </a>
                            <Popconfirm
                              title="Ажилтан устгах уу?"
                              okText={t("Тийм")}
                              cancelText={t("Үгүй")}
                              onConfirm={() => ajiltanUstgay(data)}
                            >
                              <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700">
                                <DeleteOutlined
                                  style={{ fontSize: "18px", color: "red" }}
                                />
                                <label>{t("Устгах")}</label>
                              </a>
                            </Popconfirm>
                          </div>
                        )}
                      >
                        <a className=" flex items-center justify-center hover:bg-gray-200">
                          <MoreOutlined style={{ fontSize: "18px" }} />
                        </a>
                      </Popover>
                    </div>
                  ),
              },
            ]}
          />
        </div>
        <p className="font-medium md:hidden">{t("Ажилтны жагсаалт")}</p>
        <CardList
          neesenEsekh={neesenEsekh}
          keyValue="ajiltan"
          cardListTuluv={"utas"}
          className="block overflow-auto md:hidden"
          jagsaalt={ajilchdiinGaralt?.jagsaalt}
          Component={AjiltanTile}
          tileProps={{
            zasya,
            tokhiruulya,
            ajiltanUstgay,
          }}
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
        />
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
