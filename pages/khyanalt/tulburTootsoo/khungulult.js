import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  notification,
  Popconfirm,
  Select,
  Table,
  Tabs,
} from "antd";
import Admin from "components/Admin";
import useGereeniiJagsaalt, {
  useGereeGuilgee,
} from "hooks/useGereeniiJagsaalt";
import useKhungulultTuukh from "hooks/tulburTootsoo/useKhungulultTuukh";
import _, { set } from "lodash";
import moment from "moment";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import createMethod from "tools/function/crud/createMethod";
import formatNumber from "tools/function/formatNumber";
import Aos from "aos";
import { modal } from "components/ant/Modal";
import { useTranslation } from "react-i18next";
import useJagsaalt from "hooks/useJagsaalt";

const Tailbar = React.forwardRef(({ destroy, confirm }, ref) => {
  const [tailbar, setTailbar] = useState("");
  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(tailbar);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [tailbar]
  );
  return (
    <div>
      <Input.TextArea
        value={tailbar}
        onChange={({ target }) => setTailbar(target?.value)}
      />
    </div>
  );
});

function tulburTootsoo() {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const { t, i18n } = useTranslation();
  const { token, baiguullaga, barilgiinId, ajiltan } = useAuth();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([moment(), moment()]);
  const formRef = useRef();
  const [songogdsonGereenuud, setSongogdsonGereenuud] = useState([]);
  const [ognoonuud, setOgnoonuud] = useState([]);
  const [turul, setTurul] = useState("turees");
  const tailbarRef = React.useRef(null);
  const [shuult, setShuult] = React.useState({
    query: { tuluv: { $ne: -1 } },
  });
  const [songogdsonNuur, setSongogdsonNuur] = useState("1");
  const query = useMemo(() => {
    return {
      createdAt: ekhlekhOgnoo
        ? {
            $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };
  }, [ekhlekhOgnoo]);
  const [form] = Form.useForm();
  const { gereeniiMedeelel, setGereeniiKhuudaslalt, isValidating } =
    useGereeniiJagsaalt(
      songogdsonNuur === "1" && token,
      baiguullaga?._id,
      undefined,
      shuult?.query,
      undefined,
      1000
    );
  const {
    khungulultTuukh,
    khungulultTuukhMutate,
    setKhuudaslalt,
    isValidating2,
  } = useKhungulultTuukh(
    songogdsonNuur === "2" && token,
    baiguullaga?._id,
    query
  );

  const [tootsoolol, setTootsoolol] = useState({
    niitTalbai: 0,
    niitSariinTurees: 0,
    khunglugdsunDun: 0,
    niitTulukhDun: 0,
  });
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [khungulukh, setKhungulukh] = useState("khuvi");
  const [songogdsonZardal, setSongogdsonZardal] = useState({});

  const { Option } = Select;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const qZardal = useMemo(
    () => ({
      turul: { $in: ["Тогтмол", "1м2", "1м3/талбай"] },
      tariff: { $exists: true },
      barilgiinId,
    }),
    [barilgiinId]
  );

  const zardal = useJagsaalt(
    "/ashiglaltiinZardluud",
    qZardal,
    undefined,
    undefined,
    undefined,
    token
  );
  useEffect(() => {
    if (form.getFieldValue("turul") === "Бүгд") {
      onSelectChange(
        gereeniiMedeelel?.jagsaalt.map((r) => r._id),
        gereeniiMedeelel?.jagsaalt
      );
    }
  }, [shuult, form]);

  useEffect(() => {
    khungulukhDunTootsoolyo();
  }, [songogdsonGereenuud]);

  function disabledDate(current) {
    return current && current < moment().startOf("day");
  }
  function handleChange(value) {
    if (value.length > 0) {
      setShuult({
        query: { davkhar: value, tuluv: { $nin: -1 } },
      });
    } else {
      setShuult({ query: { tuluv: { $ne: -1 } } });
      setRowKeys([]);
      setSongogdsonGereenuud([]);
    }
  }
  function nukhtulSongokh(value) {
    if (value === "Бүгд") {
      setShuult({ query: { tuluv: { $ne: -1 } } });
      form.setFieldValue("davkhar", []);
    } else {
      setRowKeys([]);
      setSongogdsonGereenuud([]);
    }
  }

  function dundakhSaruudAvya(ekhlekhOgnoo, duusakhOgnoo) {
    const months = [];
    let odooginOgnoo = moment(ekhlekhOgnoo).startOf("month");

    while (odooginOgnoo.isSameOrBefore(moment(duusakhOgnoo).startOf("month"))) {
      months.push(odooginOgnoo.format("YYYY-MM-01 00:00:00"));
      odooginOgnoo.add(1, "months");
    }

    return months;
  }

  function khungulultKhadgalya() {
    setWaiting(true);
    if (
      ajiltan?.erkh !== "Admin" &&
      !_.get(ajiltan, `tokhirgoo.khungulultUzuulekhEsekh`)?.find(
        (a) => a === barilgiinId
      )
    ) {
      setWaiting(false);
      notification.warning({
        message: t("Таньд гэрээ хөнгөлөх эрх байхгүй байна."),
      });
      return;
    }
    if (baiguullaga.tokhirgoo.bukhAjiltanKhungulultOruulakhEsekh === false) {
      setWaiting(false);
      notification.warning({
        message: t("Хөнгөлөлт оруулах эрх хаагдсан байна."),
      });
      return;
    }
    if (songogdsonGereenuud.length > 0) {
      var ugugdul = form.getFieldsValue();
      ugugdul.ognoonuud = dundakhSaruudAvya(ognoonuud[0], ognoonuud[1]);
      ugugdul.barilgiinId = barilgiinId;
      if (turul === "zardal") {
        ugugdul.tailbar = songogdsonZardal.ner;
      } else {
        ugugdul.tailbar = "Түрээс";
      }
      ugugdul.tulukhDun = tootsoolol.niitSariinTurees;
      ugugdul.khungulsunDun = tootsoolol.niitTulukhDun;
      ugugdul.khungulultiinDun = tootsoolol.khunglugdsunDun;
      ugugdul.khamaataiGereenuud = songogdsonGereenuud.map(
        (x) => (x._id = x._id)
      );
      if (
        khungulukh === "khuvi" &&
        baiguullaga.tokhirgoo.deedKhungulultiinKhuvi < ugugdul.khungulukhKhuvi
      ) {
        setWaiting(false);
        notification.warning({
          message: "Тохируулсан хөнгөлөх хувиас хэтэрсэн байна!",
        });
        return;
      }
      createMethod("khungulultKhadgalya", token, ugugdul)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            setWaiting(false);
            message.success("Хөнгөлөлт амжилттай хийгдлээ");
            formRef.current.resetFields();
            setTootsoolol({});
            setOgnoonuud([]);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else {
      setWaiting(false);
      message.warning("Хөнгөлөх талбай сонгоно уу");
    }
  }
  function ustgaya(mur) {
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        {t("Устгах")}
      </Button>,
    ];
    modal({
      title: "Хөнгөлөлт устгах шалтгаан",
      icon: <DeleteOutlined />,
      content: (
        <Tailbar
          ref={tailbarRef}
          confirm={(tailbar) =>
            uilchilgee(token)
              .post("/khungulultUstgaya", {
                id: mur?._id,
                tailbar,
              })
              .then(({ data }) => {
                if (data !== undefined) {
                  khungulultTuukhMutate(
                    (s) => ({ ...s, jagsaalt: s.jagsaalt }),
                    true
                  );
                  message.success(t("Устгагдлаа"));
                }
              })
          }
        />
      ),
      footer,
    });
  }
  function tseverlekh() {
    formRef.current.resetFields();
    setShuult({ query: { tuluv: { $ne: -1 } } });
    setRowKeys([]);
  }

  const columns = useMemo(() => {
    return [
      {
        title: t("Огноо"),
        dataIndex: "createdAt",
        ellipsis: true,
        align: "center",
        width: "7rem",
        render: (data) => {
          return moment(data).format("YYYY-MM-DD hh:mm:ss");
        },
      },
      {
        title: t("Хөнгөлөлт %"),
        dataIndex: "khungulukhKhuvi",
        ellipsis: true,
        width: "7rem",
        align: "center",
      },
      {
        title: t("Хугацаа"),
        width: "7rem",
        dataIndex: "ognoonuud",
        ellipsis: true,
        align: "center",
        render: (data) => {
          return moment(data && data[0]).format("YYYY-MM-DD");
        },
      },
      {
        title: t("Төрөл"),
        dataIndex: "khungulukhTurul",
        ellipsis: true,
        width: "7rem",
        align: "center",
        render: (data) => {
          switch (data) {
            case "turees":
              return (
                <div className="flex items-center justify-center rounded-lg bg-green-400 px-2 py-1 dark:bg-green-700 dark:text-gray-200 ">
                  Түрээс
                </div>
              );
            case "zardal":
              return (
                <div className="flex items-center justify-center rounded-lg bg-yellow-400 px-2 py-1 dark:bg-yellow-700 dark:text-gray-200 ">
                  Зардал
                </div>
              );
            default:
              return data;
          }
        },
      },
      {
        title: t("Төлөх дүн"),
        summary: true,
        width: "7rem",
        dataIndex: "tulukhDun",
        align: "right",
        render: (data) => {
          return formatNumber(data) + "₮";
        },
      },
      {
        title: t("Хөнгөлөх дүн"),
        summary: true,
        width: "7rem",
        dataIndex: "khungulultiinDun",
        align: "right",
        render: (data) => {
          return formatNumber(data) + "₮";
        },
      },
      {
        title: t("Төлсөн дүн"),
        width: "7rem",
        summary: true,
        dataIndex: "khungulsunDun",
        align: "right",
        render: (data) => {
          return formatNumber(data) + "₮";
        },
      },
      {
        title: t("Төрөл"),
        width: "7rem",
        dataIndex: "turul",
        ellipsis: true,
        align: "center",
      },
      {
        title: t("Шалтгаан"),
        width: "7rem",
        dataIndex: "shaltgaan",
        ellipsis: true,
        align: "center",
      },
      {
        title: t("Ажилтан"),
        width: "7rem",
        dataIndex: "guilgeeKhiisenAjiltniiNer",
        align: "center",
        showSorterTooltip: false,
        sorter: true,
      },
      {
        title: () => <SettingOutlined />,
        width: "60px",
        align: "center",
        render(data) {
          return (
            <Popconfirm
              title={t("Хөнгөлөлт устгах уу?")}
              okText={t("Тийм")}
              cancelText={t("Үгүй")}
              onConfirm={() => ustgaya(data)}
            >
              <Button
                danger
                size="small"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          );
        },
      },
    ];
  });

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "control-ref_davkhar":
          formRef.current.getFieldInstance("khungulukhKhuvi").focus();
          break;
        case "control-ref_khungulukhDun":
          formRef.current.getFieldInstance("shaltgaan").focus();
          break;
        case "control-ref_shaltgaan":
          document.getElementById("khungulultKhadgalya").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  function onSelectChange(selectedRowKeys, selectedRows) {
    setRowKeys(selectedRowKeys);
    setSongogdsonGereenuud(selectedRows);
  }

  function khungulukhDunTootsoolyo() {
    let dun = form?.getFieldValue("khungulukhKhuvi");
    if (turul === "turees")
      tootsoolol.niitSariinTurees = songogdsonGereenuud?.reduce(
        (a, b) => a + Number(b?.sariinTurees || 0),
        0
      );
    else {
      tootsoolol.niitSariinTurees = 0;
      const fVal = form.getFieldValue("zardliinId");
      songogdsonGereenuud.map((e) => {
        const zardal = e?.zardluud.find((a) => a._id === fVal);
        setSongogdsonZardal(zardal);
        if (!!zardal) {
          if (zardal.turul === "1м2")
            tootsoolol.niitSariinTurees =
              tootsoolol.niitSariinTurees + e.talbainKhemjee * zardal.tariff;
          else if (zardal.turul === "1м3/талбай")
            tootsoolol.niitSariinTurees =
              tootsoolol.niitSariinTurees +
              e.talbainKhemjeeMetrKube * zardal.tariff;
          else
            tootsoolol.niitSariinTurees =
              zardal.tariff + tootsoolol.niitSariinTurees;
        }
      });
    }
    if (khungulukh === "khuvi" && dun > 100) {
      form.setFieldsValue({ khungulukhKhuvi: 100 });
      dun = 100;
    }
    tootsoolol.niitTalbai = songogdsonGereenuud?.length;
    tootsoolol.khunglugdsunDun =
      khungulukh === "khuvi"
        ? (Number(tootsoolol.niitSariinTurees) * dun) / 100
        : dun;
    tootsoolol.niitTulukhDun =
      Number(tootsoolol.niitSariinTurees) - Number(tootsoolol.khunglugdsunDun);
    setTootsoolol({ ...tootsoolol });
  }
  return (
    <Admin
      title="Хөнгөлөлт"
      khuudasniiNer="khungulult"
      className="p-0 px-3 pb-12 md:p-4 md:px-4 md:pb-0"
      onSearch={(search) => {
        setKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }));
        setGereeniiKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
      }}
      loading={waiting || isValidating || isValidating2}
      tsonkhniiId="61c2c6eb1c2830c4e6f90cc5"
    >
      <div className="col-span-12">
        <Tabs size="large" onChange={(v) => setSongogdsonNuur(v)}>
          <Tabs.TabPane tab={t("Хөнгөлөлт оруулах")} key="1">
            <div className="grid w-full grid-cols-12 gap-6">
              <div
                className="col-span-12 rounded-md border border-solid border-green-300 bg-white p-5 dark:bg-gray-900 md:col-span-8 xl:col-span-3"
                data-aos="fade-right"
                data-aos-duration="1000"
              >
                <Form
                  onFinish={khungulultKhadgalya}
                  form={form}
                  autoComplete={"off"}
                  ref={formRef}
                  name="control-ref"
                  initialValues={{ remember: true }}
                  labelCol={{
                    span: 9,
                  }}
                  wrapperCol={{
                    span: 14,
                  }}
                  layout="horizontal"
                >
                  <Form.Item name="khungulukhTurul" label={t("Төрөл")}>
                    <Select
                      className="ml-1 mr-3 flex-1"
                      defaultValue="turees"
                      onChange={(e) => {
                        setTurul(e);
                        if (e === "turees") {
                          setShuult({
                            query: !!shuult?.query?.davkhar
                              ? {
                                  davkhar: shuult.query.davkhar,
                                  tuluv: shuult.query.tuluv,
                                }
                              : { tuluv: shuult.query.tuluv },
                          });
                          form.setFieldsValue({ zardliinId: undefined });
                        }
                        setRowKeys([]);
                        setTootsoolol({
                          niitTalbai: 0,
                          niitSariinTurees: 0,
                          khunglugdsunDun: 0,
                          niitTulukhDun: 0,
                        });
                      }}
                    >
                      <Select.Option value={"turees"}>Түрээс</Select.Option>
                      <Select.Option value={"zardal"}>Зардал</Select.Option>
                    </Select>
                  </Form.Item>
                  {turul === "zardal" &&
                    zardal &&
                    zardal?.jagsaalt.length > 0 && (
                      <Form.Item
                        name="zardliinId"
                        label={t("Зардал сонгох")}
                        rules={[
                          {
                            required: true,
                            message: t("Зардал сонгоно уу!"),
                          },
                        ]}
                      >
                        <Select
                          className="ml-1 mr-3 flex-1"
                          onChange={(e) => {
                            setShuult({
                              query: !!shuult?.query?.davkhar
                                ? {
                                    davkhar: shuult.query.davkhar,
                                    tuluv: shuult.query.tuluv,
                                    "zardluud._id": e,
                                  }
                                : {
                                    tuluv: shuult.query.tuluv,
                                    "zardluud._id": e,
                                  },
                            });
                            // setShuult({ query: { tuluv: { $ne: -1 } } });
                          }}
                        >
                          {zardal.jagsaalt.map((z) => (
                            <Select.Option value={z._id}>{z.ner}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                  {/* {ognoonuud.length > 0 && (
                    <>
                      <div className="mb-2">Сонгогдсон сарууд:</div>
                      <div className="flex w-full flex-row flex-wrap">
                        {ognoonuud.map((a, index) => (
                          <div
                            key={index}
                            className="m mb-2 mr-2 flex items-center rounded bg-gray-200 px-2 py-1"
                          >
                            {moment(a).format("YYYY-MM")}
                            <div
                              onClick={() => {
                                const uOgnoonuud = [...ognoonuud];
                                uOgnoonuud.splice(index, 1);
                                setOgnoonuud(uOgnoonuud);
                              }}
                              className="ml-1 flex h-[15px] w-[15px] cursor-pointer items-center justify-center rounded-full bg-red-400 text-[10px] text-white"
                            >
                              x
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )} */}
                  <Form.Item
                    name="ognoonuud"
                    label={t("Хөнгөлөх сар")}
                    rules={[
                      {
                        required: true,
                        message: t("Хөнгөлөх сар бүртгэнэ үү!"),
                      },
                    ]}
                  >
                    <DatePicker.RangePicker
                      allowClear={false}
                      style={{ width: "100%" }}
                      disabledDate={disabledDate}
                      picker="month"
                      placeholder={[t("Эхлэх сар"), t("Дуусах сар")]}
                      onChange={(v) => {
                        setOgnoonuud(v);
                        console.log("v:", v);
                      }}
                    />
                  </Form.Item>
                  <Form.Item name="turul" label={t("Нөхцөл")}>
                    <Select
                      placeholder={t("Нөхцөл")}
                      onChange={(v) => {
                        nukhtulSongokh(v);
                        formRef.current.getFieldInstance("davkhar").focus();
                      }}
                    >
                      <Option value="Давхраар">{t("Давхраар")}</Option>
                      <Option value="Бүгд">{t("Бүгд")}</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="davkhar" label={t("Давхар")}>
                    <Select
                      mode="multiple"
                      placeholder={t("Давхар")}
                      onChange={handleChange}
                      disabled={
                        form?.getFieldValue("turul") === "Бүгд" ? true : false
                      }
                    >
                      {baiguullaga?.barilguud
                        ?.find((b) => b._id === barilgiinId)
                        ?.davkharuud.map((a) => (
                          <Select.Option key={a.davkhar} value={a.davkhar}>
                            {a.davkhar}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label={t("Хөнгөлөх төрөл")}>
                    <Select
                      placeholder="Хөнгөлөх төрөл"
                      className="w-32"
                      value={khungulukh}
                      onChange={(v) => {
                        setKhungulukh(v);
                        form.setFieldsValue({ khungulukhKhuvi: null });
                      }}
                    >
                      <Select.Option key={"khuvi"}>Хувь</Select.Option>
                      <Select.Option key={"mungunDun"}>
                        Мөнгөн дүн
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={
                      khungulukh === "khuvi" ? "Хөнгөлөх хувь" : "Хөнгөлөх дүн"
                    }
                    name="khungulukhKhuvi"
                  >
                    <Input
                      // formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      onKeyDown={focuser}
                      type={"number"}
                      placeholder={
                        khungulukh === "khuvi"
                          ? "Хөнгөлөх хувь"
                          : "Хөнгөлөх дүн"
                      }
                      onChange={khungulukhDunTootsoolyo}
                    />
                  </Form.Item>
                  <Form.Item label={t("Шалтгаан")} name="shaltgaan">
                    <Input.TextArea
                      onKeyDown={focuser}
                      placeholder={t("Шалтгаан")}
                    />
                  </Form.Item>
                  <div className="flex-column mt-12 grid text-base dark:text-gray-50">
                    <div className="flex justify-between">
                      {t("Нийт талбайн тоо")} :<a>{tootsoolol.niitTalbai}</a>
                    </div>
                    <div className="flex justify-between">
                      {turul === "turees"
                        ? t("Нийт түрээсийн орлого")
                        : "Нийт зардлын дүн"}{" "}
                      :<a>{formatNumber(tootsoolol.niitSariinTurees || 0)}</a>
                    </div>
                    <div className="flex justify-between">
                      {t("Нийт хөнгөлөгдсөн дүн")} :
                      <a className="text-red-400">
                        {formatNumber(tootsoolol.khunglugdsunDun || 0)}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      {t("Нийт төлөх дүн")} :
                      <a className="text-green-500">
                        {formatNumber(tootsoolol.niitTulukhDun || 0)}
                      </a>
                    </div>
                  </div>
                  <div className="mt-10 flex flex-row justify-between">
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        onClick={tseverlekh}
                        //style={{ backgroundColor: "#209669", color: "#ffffff" }}
                        className="border-red-400 dark:border-red-400 dark:bg-gray-900 "
                      >
                        <span className="text-red-400 dark:text-red-400">
                          {t("Цэвэрлэх")}
                        </span>
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        id="khungulultKhadgalya"
                        onClick={() => form.submit()}
                        type="primary"
                      >
                        <span className="text-white">{t("Хадгалах")}</span>
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>

              <div
                className="box col-span-12 overflow-auto p-5 md:col-span-3 xl:col-span-9"
                data-aos="fade-right"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                <Table
                  rowSelection={rowSelection}
                  bordered
                  scroll={{ y: "calc(100vh - 20rem)" }}
                  size="small"
                  loading={!gereeniiMedeelel}
                  rowKey={(row) => row._id}
                  dataSource={gereeniiMedeelel?.jagsaalt}
                  columns={[
                    {
                      title: t("Түрээслэгч"),
                      dataIndex: "ner",
                      className: "text-center",
                      align: "center",
                      width: "5rem",
                      showSorterTooltip: false,
                      sorter: (a, b) => a.ner?.localeCompare(b.ner),
                    },
                    {
                      title: t("Гэрээ"),
                      dataIndex: "gereeniiDugaar",
                      className: "text-center",
                      align: "center",
                      width: "7rem",
                      showSorterTooltip: false,
                      sorter: (a, b) =>
                        a.gereeniiDugaar?.localeCompare(b.gereeniiDugaar),
                    },
                    {
                      title: t("Талбай"),
                      dataIndex: "talbainDugaar",
                      className: "text-center",
                      align: "center",
                      width: "7rem",
                      showSorterTooltip: false,
                      sorter: (a, b) =>
                        a.talbainDugaar?.localeCompare(b.talbainDugaar),
                    },
                    {
                      title: t("Давхар"),
                      dataIndex: "davkhar",
                      align: "center",
                      width: "5rem",
                      className: "text-center",
                      showSorterTooltip: false,
                      sorter: (a, b) =>
                        Number(a.davkhar || 0) - Number(b.davkhar || 0),
                    },
                    {
                      title: t("Талбай /м2/"),
                      dataIndex: "talbainKhemjee",
                      align: "center",
                      width: "7rem",
                      className: "text-center",
                      render: (talbainKhemjee) => {
                        return `${talbainKhemjee} м2`;
                      },
                      showSorterTooltip: false,

                      sorter: (a, b) =>
                        Number(a.talbainKhemjee || 0) -
                        Number(b.talbainKhemjee || 0),
                    },
                    {
                      title: t("Төлбөр"),
                      dataIndex: "sariinTurees",
                      className: "text-center",
                      width: "7rem",
                      align: "center",
                      render: (sariinTurees) => {
                        return formatNumber(sariinTurees || 0);
                      },
                      showSorterTooltip: false,
                      sorter: (a, b) =>
                        Number(a.sariinTurees || 0) -
                        Number(b.sariinTurees || 0),
                    },
                  ]}
                  pagination={false}
                />
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={t("Хөнгөлөлт түүх")} key="2">
            <div className="grid w-full grid-cols-12 gap-6">
              <div className="box col-span-12 p-5 md:col-span-8 xl:col-span-12">
                <div className="mt-5 flex w-full flex-row justify-between">
                  <DatePicker.RangePicker
                    style={{ marginBottom: "20px" }}
                    size="middle"
                    value={ekhlekhOgnoo}
                    onChange={setEkhlekhOgnoo}
                  />
                </div>

                <Table
                  bordered
                  tableLayout={"fixed"}
                  size="small"
                  rowClassName="hover:bg-blue-100"
                  dataSource={khungulultTuukh?.jagsaalt}
                  summary={() => (
                    <Table.Summary fixed>
                      {" "}
                      {!!columns && !!khungulultTuukh && (
                        <Table.Summary.Row>
                          {columns?.map((mur, index) => (
                            <Table.Summary.Cell
                              className={`${
                                mur.summary !== true
                                  ? "border-none"
                                  : "font-bold"
                              }`}
                              index={index}
                              align="right"
                            >
                              {mur.summary
                                ? formatNumber(
                                    khungulultTuukh?.jagsaalt?.reduce(
                                      (a, b) => a + (b[mur.dataIndex] || 0),
                                      0
                                    )
                                  )
                                : ""}
                              {mur.summary && "₮"}
                            </Table.Summary.Cell>
                          ))}
                        </Table.Summary.Row>
                      )}
                    </Table.Summary>
                  )}
                  pagination={{
                    current: khungulultTuukh?.khuudasniiDugaar,
                    pageSize: 100,
                    total: khungulultTuukh?.niitMur,
                    showSizeChanger: true,
                    onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                      setKhuudaslalt((kh) => ({
                        ...kh,
                        khuudasniiDugaar,
                        khuudasniiKhemjee,
                      })),
                  }}
                  scroll={{ y: "calc(100vh - 26rem)" }}
                  rowKey={(row) => row._id}
                  className="t-head"
                  columns={columns}
                />
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default tulburTootsoo;
