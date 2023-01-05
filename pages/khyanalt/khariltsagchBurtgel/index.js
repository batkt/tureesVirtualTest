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
  Modal,
} from "antd";
import {
  UserOutlined,
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
  RedoOutlined,
  EnvironmentOutlined,
  CloseCircleOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import shalgaltKhiikh from "services/shalgaltKhiikh";

import Admin from "components/Admin";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useAuth } from "services/auth";
import React, { useState, useRef, useEffect, useCallback } from "react";
import moment from "moment";
import useKhariltsagch from "hooks/useKhariltsagch";
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
import TextArea from "antd/lib/input/TextArea";
import useJagsaalt from "hooks/useJagsaalt";
import { TbBoxMultiple } from "react-icons/tb";
import { GiBackwardTime } from "react-icons/gi";
import { ImFileEmpty, ImFileText2 } from "react-icons/im";

const iconColor = { fontSize: "18px" };

function checkUtas(utasnuud, utga) {
  const utguud = utasnuud || [];
  if (!!utguud.find((a) => a === utga)) {
    message.warning("Энэ утасны дугаарыг бүртгэсэн байна");
    return false;
  }
  return true;
}

const query = { turul: "khariltsagch" };

function YalgakhUtga({
  khariltsagchState,
  fieldKey,
  name,
  remove,
  ...restField
}) {
  const segment = useJagsaalt("/segment", query);
  const [turul, setTurul] = useState();
  const [songosonSegment] = useState({
    ner: undefined,
    utga: undefined,
  });

  function solikh(value) {
    setTurul(segment.jagsaalt.find((a) => a.ner === value));
    songosonSegment.ner = value;
  }
  function solikhtTurul(value) {
    songosonSegment.utga = value;
    shineSolikh();
  }
  function shineSolikh() {
    shine2();
  }

  function shine2() {
    khariltsagchState.segmentuud.push(songosonSegment);
  }

  return (
    <>
      <div className="flex flex-row justify-end space-x-2 ">
        <Form.Item
          className="w-full "
          {...restField}
          name={[name, "ner"]}
          fieldKey={[fieldKey, "ner"]}
        >
          <Select
            style={{ width: "100%" }}
            className=" "
            placeholder="Нэр"
            name="ner"
            onChange={solikh}
            filterOption={(o) => o}
          >
            {segment?.jagsaalt.map((mur, i) => (
              <Select.Option key={i} value={mur?.ner}>
                {mur?.ner}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          className="w-full "
          {...restField}
          name={[name, "utga"]}
          fieldKey={[fieldKey, "utga"]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Утга"
            onChange={solikhtTurul}
          >
            {turul?.utguud?.map((a, i) => (
              <Select.Option key={i} value={a}>
                {a}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <CloseCircleOutlined className="pt-2" onClick={() => remove(name)} />
      </div>
    </>
  );
}

function Tile({ zasya, token, ...a }) {
  return (
    <div className="box dark:text-white">
      <div className="flex items-center py-2 px-5 shadow-none">
        <div className="flex gap-2 border-l-2 border-green-500 pl-4">
          <div className="font-medium">{a.ner}</div>
          <div className="font-medium text-gray-600 dark:text-gray-300">
            ({a.utga})
          </div>
        </div>
      </div>
    </div>
  );
}

function AjiltanBurtgel({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const formRef = useRef();
  const excelref = useRef();
  const [resetForm] = Form.useForm();
  const { ajiltan, barilgiinId } = useAuth();
  const { order, onChangeTable } = useOrder({ createAt: -1 });
  const [query, setQuery] = useState({});
  const {
    setKhariltsagchKhuudaslalt,
    khariltsagchiinGaralt,
    khariltsagchMutate,
  } = useKhariltsagch(token, ajiltan?.baiguullagiinId, 100, query, order);
  const { khariltsagchToololt, khariltsagchToololtMutate, isValidating } =
    useKhariltsagchToololt(token);
  const [formNuukh, setFormNuukh] = useState(false);
  const [jagsaaltTuukh, setJagsaaltTuukh] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [nuutsUgKhariltsagch, setNuutsUgKhariltsagch] = useState();
  const [khariltsagchState, setkhariltsagchState] = useState({
    ner: undefined,
    ovog: undefined,
    register: undefined,
    khayag: undefined,
    segmentuud: [],
    utas: [],
    email: undefined,
    turul: undefined,
    tuluv: undefined,
    temdeglel: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
  });
  const [neesenEsekh, setNeesenEsekh] = useState(false);
  useEffect(() => {
    barilgiinId;
    setKhariltsagchKhuudaslalt((a) => ({
      ...a,
      khuudasniiDugaar: 1,
    }));
  }, [barilgiinId]);
  useEffect(() => {
    formRef.current.resetFields();
  }, [isValidating]);

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
  const nuutsUgModalKhaah = () => {
    setNuutsUgKhariltsagch(false);
  };
  const [utasKhariltsagchNmekh, setUtasKhariltsagchNmekh] = useState(false);

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
            setWaiting(false);
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

  function shineNuutsUgSolikh(talbar, utga) {
    setNuutsUgKhariltsagch((a) => ({ ...a, [talbar]: utga }));
  }

  function nuutsUgSolikh() {
    let { errors } = resetForm.getFieldsError();
    if (!!errors) {
      return;
    }
    if (nuutsUgKhariltsagch.nuutsUg === nuutsUgKhariltsagch.davtanNuutsUg) {
      uilchilgee(token)
        .put(`/khariltsagch/${nuutsUgKhariltsagch._id}`, {
          _id: nuutsUgKhariltsagch._id,
          nuutsUg: nuutsUgKhariltsagch.nuutsUg,
        })
        .then(({ data }) => {
          if (data !== undefined) {
            notification.success({
              message: "Мэдэгдэл",
              description: "Нууц үг амжилттай шинэчлэгдлээ",
            });
            setNuutsUgKhariltsagch(false);
            resetForm.resetFields();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else
      notification.warning({
        message: "Мэдэгдэл",
        description: "Нууц үг таарсангүй",
      });
  }

  function zasya(data) {
    setFormNuukh(data.turul);
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
          khariltsagchToololtMutate();
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

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "control-ref_ovog":
          formRef.current.getFieldInstance("ner").focus();
          break;
        case "control-ref_ner":
          formRef.current.getFieldInstance("register").focus();
          break;
        case "control-ref_register":
          if (khariltsagchState?.turul === "ААН") {
            formRef.current.getFieldInstance("zakhirliinOvog")?.focus();
            break;
          } else formRef.current.getFieldInstance("khayag")?.focus();
        case "control-ref_zakhirliinOvog":
          formRef.current.getFieldInstance("zakhirliinNer")?.focus();
          break;
        case "control-ref_zakhirliinNer":
          formRef.current.getFieldInstance("khayag").focus();
          break;
        case "control-ref_khayag":
          formRef.current.getFieldInstance("mail").focus();
          break;
        case "control-ref_mail":
          formRef.current.getFieldInstance("temdeglel").focus();
          break;
        case "control-ref_temdeglel":
          document.getElementById("khariltsagchBurtgekhButton").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  function checkRegister() {
    var value1 = khariltsagchState.register?.substring(0, 2);
    var value2 = khariltsagchState.register?.substring(2, 10);
    var error = 0;
    for (var i = 0; i < 2; i++) {
      var c = value1?.charCodeAt(i);
      if (c) {
        var alp = value1?.charAt(i);
        if (
          c !== 32 &&
          c !== 45 &&
          c !== 46 &&
          (c < 65 || (c < 97 && c > 90) || c > 122) &&
          (c < 1024 || c > 1535)
        ) {
          value1 = value1?.replace(alp, "");
          error++;
        }
      }
    }
    for (i = 0; i < 8; i++) {
      c = value2?.charCodeAt(i);
      if (c) {
        alp = value2?.charAt(i);
        if (c < 48 || c > 57) {
          value2 = value2?.replace(alp, "");
          error++;
        }
      }
    }
    if (
      khariltsagchState.register?.length <= 2 ||
      khariltsagchState.register?.length > 10 ||
      error > 0
    ) {
      khariltsagchState.register = value1.toUpperCase() + value2;
    }
    if (khariltsagchState.register?.length === 10) {
      var year = parseInt(khariltsagchState.register.substring(2, 4));
      var month = parseInt(khariltsagchState.register.substring(4, 6));
      month = month - 1;
      var day = parseInt(khariltsagchState.register.substring(6, 8));
      var nowYear = new Date().getFullYear().toString().substring(2, 4);
      if (month > 32 || (12 < month && month < 20)) {
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
    formRef.current.resetFields();
    formRef.current.setFieldsValue({ turul: value });

    setFormNuukh(value);
    if (value === "Иргэн") {
      setTimeout(() => {
        formRef.current.getFieldInstance("ovog").focus();
      }, 800);
    } else {
      formRef.current.getFieldInstance("ner").focus();
    }
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
      setNeesenEsekh={setNeesenEsekh}
      onSearch={(search) =>
        setKhariltsagchKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
      tsonkhniiId="61c2c6731c2830c4e6f90c9d"
      loading={waiting || isValidating}
    >
      {utasKhariltsagchNmekh && (
        <div className="col-span-12 mx-5 -mb-4 md:hidden">
          <Button
            type="primary"
            onClick={() => setUtasKhariltsagchNmekh(!utasKhariltsagchNmekh)}
            className="w-full  "
          >
            <EyeInvisibleOutlined className="text-xl" />
          </Button>
        </div>
      )}
      <div
        className={`box col-span-12 p-5 md:col-span-6 xl:col-span-3  ${
          utasKhariltsagchNmekh === true ? "" : "hidden md:block"
        }`}
      >
        <Form
          autoComplete={"off"}
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
        >
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
                autoFocus={true}
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
          {khariltsagchState.turul !== "ААН" && (
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
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
                  onKeyUp={focuser}
                  type="text"
                  allowClear
                  placeholder="Овог"
                  value={khariltsagchState.ovog}
                  prefix={<UserOutlined style={iconColor} />}
                  onChange={(e) => onChange("ovog", e.target.value)}
                ></Input>
              </Form.Item>
            </div>
          )}
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
                onKeyUp={focuser}
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
                onKeyUp={focuser}
                allowClear
                maxLength={10}
                placeholder="Регистр"
                value={khariltsagchState.register}
                onChange={(e) =>
                  onChange("register", e?.target?.value?.toUpperCase())
                }
                prefix={<SolutionOutlined style={iconColor} />}
                onBlur={() => (formNuukh === "ААН" ? "" : checkRegister())}
              ></Input>
            </Form.Item>
          </div>

          {khariltsagchState.turul === "ААН" && (
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
            >
              <Form.Item
                name="zakhirliinOvog"
                rules={[
                  {
                    required: true,
                    message: "Захирлын Овог бүртгэнэ үү!",
                  },
                ]}
              >
                <Input
                  onKeyUp={focuser}
                  type="text"
                  allowClear
                  placeholder="Захирлын Овог"
                  value={khariltsagchState.zakhirliinOvog}
                  prefix={<UserOutlined style={iconColor} />}
                  onChange={(e) => onChange("zakhirliinOvog", e.target.value)}
                ></Input>
              </Form.Item>
            </div>
          )}
          {khariltsagchState.turul === "ААН" && (
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
            >
              <Form.Item
                name="zakhirliinNer"
                rules={[
                  {
                    required: true,
                    message: "Захирлын нэр бүртгэнэ үү!",
                  },
                ]}
              >
                <Input
                  onKeyUp={focuser}
                  type="text"
                  allowClear
                  placeholder="Захирлын нэр"
                  value={khariltsagchState.zakhirliinNer}
                  prefix={<UserOutlined style={iconColor} />}
                  onChange={(e) => onChange("zakhirliinNer", e.target.value)}
                ></Input>
              </Form.Item>
            </div>
          )}

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
                onKeyUp={focuser}
                allowClear
                placeholder="Хаяг"
                value={khariltsagchState.khayag}
                onChange={(e) => onChange("khayag", e.target.value)}
                prefix={<HomeOutlined style={iconColor} />}
              ></Input>
            </Form.Item>
          </div>

          <div
            data-aos="fade-right "
            data-aos-duration="1000"
            data-aos-delay="700"
          >
            <Form.List name="segmentuud" className=" ">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <div key={key}>
                      <YalgakhUtga
                        key={key}
                        khariltsagchState={khariltsagchState}
                        name={name}
                        fieldKey={fieldKey}
                        {...restField}
                        remove={remove}
                      />
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      icon={<PlusOutlined />}
                      className="h-8 w-full rounded-sm bg-white  hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700  "
                      type="dashed"
                      onClick={() => add()}
                      block
                    >
                      Ялгах утга оруулах
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
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
                    if (!names || names.length < 1) {
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
                          {
                            required: true,
                            pattern: new RegExp("(^[0-9]+$)"),
                            message: "Дугаар оруулна уу",
                          },
                          {
                            required: true,
                            max: 8,
                            min: 8,
                            message: "Дугаараа шалгана уу",
                          },
                        ]}
                      >
                        <Input
                          minLength={8}
                          maxLength={8}
                          type="number"
                          className="appearance-none"
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

                  <Form.Item className="w-full  ">
                    <Button
                      icon={<PlusOutlined />}
                      className="h-8 w-full rounded-sm bg-white  hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700  "
                      type="dashed"
                      onClick={() => add()}
                      block
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
            <Form.Item
              name="mail"
              rules={[
                {
                  required: true,
                  message: "И-мейл хаяг бүртгэнэ үү!",
                },
              ]}
            >
              <Input
                onKeyUp={focuser}
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
            <Form.Item name="temdeglel">
              <TextArea
                onKeyDown={focuser}
                style={{ width: "100%" }}
                rows={4}
                placeholder="Тэмдэглэл"
                onChange={(e) => onChange("temdeglel", e.target.value)}
              ></TextArea>
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="700"
            className="flex justify-end"
          >
            <Form.Item>
              <Button
                id="khariltsagchBurtgekhButton"
                onClick={() => {
                  formRef.current.submit();
                }}
                type={"primary"}
              >
                Хадгалах
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="box col-span-12 mb-16 p-5 md:col-span-6 md:mb-0 xl:col-span-9">
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:p-0 md:gap-6 2xl:grid-cols-12">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className={`zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 lg:col-span-3 ${
                  JSON.stringify(query) === JSON.stringify(mur.query)
                    ? "bg-green-50 dark:bg-gray-800"
                    : ""
                }`}
                onClick={() => setQuery(mur.query)}
                data-aos="zoom-out-left"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
              >
                <div className="h-full w-[67vw] rounded-xl md:w-auto">
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
          <div className="flex w-full items-center justify-between md:ml-auto md:justify-end">
            <div className=" md:hidden ">
              <Button
                type="primary"
                style={{ marginTop: "10px" }}
                onClick={() => setUtasKhariltsagchNmekh(!utasKhariltsagchNmekh)}
              >
                Харилцагч нэмэх
              </Button>
            </div>
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
              trigger="hover"
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
            scroll={{ y: "calc(100vh - 27rem)" }}
            rowKey={(row) => row._id}
            dataSource={khariltsagchiinGaralt?.jagsaalt}
            pagination={{
              current: khariltsagchiinGaralt?.khuudasniiDugaar,
              pageSize: khariltsagchiinGaralt?.khuudasniiKhemjee,
              total: khariltsagchiinGaralt?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setKhariltsagchKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            size="small"
            onChange={onChangeTable}
            columns={[
              {
                title: "№",
                width: "2.5rem",
                key: "index",
                align: "center",
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
                width: "4rem",
                dataIndex: "turul",
                align: "center",
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
                width: "6rem",
                align: "center",
                showSorterTooltip: false,
                sorter: () => 0,
              },
              {
                title: "Нэр",
                width: "8rem",
                dataIndex: "ner",
                showSorterTooltip: false,
                sorter: () => 0,
              },
              {
                title: "Утас",
                dataIndex: "utas",
                width: "5rem",
                align: "center",
                render(a) {
                  return a?.join(",");
                },
              },

              {
                title: "Төлөв",
                width: "5rem",
                dataIndex: "idevkhiteiEsekh",
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
                title: "Бүртгэгдсэн",
                dataIndex: "createdAt",
                width: "6rem",
                align: "center",
                render: (data) => {
                  return moment(data).format("YYYY-MM-DD");
                },
              },
              {
                title: "Ангилал",
                dataIndex: "segmentuud",
                width: "5rem",
                align: "center",
                render(segmentuud) {
                  if (segmentuud?.length > 0) {
                    return (
                      <Popover
                        trigger="hover"
                        content={
                          <div>
                            <CardList
                              keyValue="segment"
                              className="max-h-[70vh] overflow-y-scroll rounded-md bg-[#F3F4F6] px-3 py-2"
                              jagsaalt={segmentuud}
                              Component={Tile}
                              componentProps={{ token }}
                            />
                          </div>
                        }
                      >
                        <a className=" flex items-center justify-center  hover:scale-150 ">
                          <ImFileText2 className="text-xl" />
                        </a>
                      </Popover>
                    );
                  } else
                    return (
                      <div className=" flex items-center justify-center">
                        <ImFileEmpty className="text-xl text-gray-500" />
                      </div>
                    );
                },
              },
              {
                title: "И-мэйл",
                dataIndex: "mail",
                width: "4.5rem",
                align: "center",
                render(email) {
                  return (
                    <Popover
                      trigger="hover"
                      content={<div className="dark:text-white">{email}</div>}
                    >
                      <a className=" flex items-center justify-center  hover:scale-150">
                        <MailOutlined style={{ fontSize: "18px" }} />
                      </a>
                    </Popover>
                  );
                },
              },
              {
                title: "Хаяг",
                dataIndex: "khayag",
                width: "3.5rem",
                align: "center",
                render: (khayag) => {
                  return (
                    <Popover
                      trigger="hover"
                      content={<div className="dark:text-white">{khayag}</div>}
                    >
                      <a className=" flex items-center justify-center  hover:scale-150">
                        <EnvironmentOutlined style={{ fontSize: "18px" }} />
                      </a>
                    </Popover>
                  );
                },
              },

              {
                title: "Түүх",
                align: "center",
                width: "3.5rem",
                render: (data) => {
                  return (
                    <Popover
                      placement="left"
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
                        className=" flex items-center justify-center  hover:scale-150"
                        onClick={() => tuukh(data)}
                      >
                        <GiBackwardTime className="text-xl" />
                      </a>
                    </Popover>
                  );
                },
              },
              {
                title: () => <SettingOutlined />,
                width: "2rem",
                align: "center",
                render: (data) => (
                  <div className="flex flex-row">
                    <Popover
                      placement="bottom"
                      trigger="hover"
                      content={() => (
                        <div className="flex w-24 flex-col space-y-2">
                          <a
                            className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                            onClick={() => zasya(data)}
                          >
                            <EditOutlined style={{ fontSize: "18px" }} />
                            <label>Засах</label>
                          </a>
                          <Popconfirm
                            title="Нууц үг сэргээх үү?"
                            okText="Тийм"
                            cancelText="Үгүй"
                            onConfirm={() => setNuutsUgKhariltsagch(data)}
                          >
                            <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700">
                              <RedoOutlined
                                className="text-green-600"
                                style={{ fontSize: "18px" }}
                              />
                              <label className="text-green-600">Нууц үг</label>
                            </a>
                          </Popconfirm>
                          <Popconfirm
                            title="Харилцагч устгах уу?"
                            okText="Тийм"
                            cancelText="Үгүй"
                            onConfirm={() => khariltsagchUstgay(data)}
                          >
                            <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700">
                              <DeleteOutlined
                                className="text-red-600"
                                style={{ fontSize: "18px" }}
                              />
                              <label className="text-red-600">Устгах</label>
                            </a>
                          </Popconfirm>
                        </div>
                      )}
                    >
                      <a className=" flex items-center justify-center  hover:scale-150 dark:hover:bg-gray-700">
                        <MoreOutlined style={{ fontSize: "18px" }} />
                      </a>
                    </Popover>
                  </div>
                ),
              },
            ]}
          />
          <Modal
            title="Нууц үг сэргээх"
            open={!!nuutsUgKhariltsagch}
            onOk={() => nuutsUgSolikh(nuutsUgKhariltsagch)}
            onCancel={nuutsUgModalKhaah}
            okText="Сэргээх"
            cancelText="Цуцлах"
          >
            <Form
              autoComplete={"off"}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              ref={formRef}
            >
              <Form.Item
                label="Нууц үг сэргээх"
                name="sergesenNuutsUg"
                onChange={(e) => shineNuutsUgSolikh("nuutsUg", e.target.value)}
                rules={[
                  {
                    required: true,
                    message: "Нууц үг оруулна уу!",
                  },
                ]}
              >
                <Input.Password style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Нууц үг давтан оруулах" name="davtanNuutsUg">
                <Input.Password
                  onChange={(e) =>
                    shineNuutsUgSolikh("davtanNuutsUg", e.target.value)
                  }
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <p className="py-2 font-medium md:hidden">Харилцагчийн жагсаалт</p>
        <CardList
          keyValue=""
          cardListTuluv={"utas"}
          neesenEsekh={neesenEsekh}
          className="block overflow-auto md:hidden"
          jagsaalt={khariltsagchiinGaralt?.jagsaalt}
          Component={KhariltsagchTile}
          tileProps={{
            khariltsagchUstgay,
            zasya,
            setUtasKhariltsagchNmekh,
            setNuutsUgKhariltsagch,
          }}
          pagination={{
            current: khariltsagchiinGaralt?.khuudasniiDugaar,
            pageSize: khariltsagchiinGaralt?.khuudasniiKhemjee,
            total: khariltsagchiinGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhariltsagchKhuudaslalt((kh) => ({
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
