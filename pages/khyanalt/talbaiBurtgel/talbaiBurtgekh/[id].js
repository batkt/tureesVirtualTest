import {
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Admin from "components/Admin";
import _, { values } from "lodash";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Aos from "aos";
import {
  Drawer,
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Switch,
  Modal,
  Popconfirm,
} from "antd";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { url } from "services/uilchilgee";
import createMethod from "tools/function/crud/createMethod";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import useJagsaalt from "hooks/useJagsaalt";
import compareFields from "tools/function/compareFields";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const Konva = dynamic(() => import("components/konva"), { ssr: false });

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e[0]?.response?.id || undefined;
  }
  return e?.file?.response?.id || undefined;
};

const query = { turul: "talbai" };

function YalgakhUtga({ fieldKey, name, remove, ...restField }) {
  const segment = useJagsaalt("/segment", query);
  const [turul, setTurul] = useState();
  const [songosonSegment, setSongosonSegment] = useState();

  function solikh(value) {
    setTurul(segment.jagsaalt.find((a) => a.ner === value));
    shineSolikh("ner", value);
  }
  function solikhtTurul(value) {
    shineSolikh("utga", value);
  }
  function shineSolikh(talbar, utga) {
    setSongosonSegment((a) => ({ ...a, [talbar]: utga }));
  }
  return (
    <>
      <div className="flex flex-row justify-end gap-2 lg:gap-0 lg:pl-[33%] ">
        <Form.Item
          className="w-2/4 lg:w-full"
          {...restField}
          name={[name, "ner"]}
          fieldKey={[fieldKey, "ner"]}
        >
          <Select
            style={{ width: "100%" }}
            className=""
            placeholder={t("Төрөл")}
            name="ner"
            onChange={solikh}
          >
            {segment?.jagsaalt?.map((mur) => (
              <Select.Option value={mur?.ner}>{mur?.ner}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          className="w-2/4 lg:w-full"
          {...restField}
          name={[name, "utga"]}
          fieldKey={[fieldKey, "utga"]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder={t("Утга")}
            onChange={solikhtTurul}
          >
            {turul?.utguud?.map((a) => (
              <Select.Option value={a}>{a}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </>
  );
}

function KhurunguudCard({
  key,
  name,
  fieldKey,
  remove,
  token,
  data,
  baiguullaga,
  formRef,
  t,
  ...restField
}) {
  const niitUneRef = useRef();
  const tooRef = useRef();
  const uneRef = useRef();
  const [zurgiinId, setZurgiinId] = useState(
    formRef.current?.getFieldValue(["khurunguud", name, "zurgiinId"]) ||
      data?.khurunguud?.[name]?.zurgiinId
  );
  const [fileList, setFileList] = useState(
    formRef.current?.getFieldValue(["khurunguud", name, "fileList"]) || []
  );

  useEffect(() => {
    const formZurgiinId = formRef.current?.getFieldValue([
      "khurunguud",
      name,
      "zurgiinId",
    ]);
    const dataZurgiinId = data?.khurunguud?.[name]?.zurgiinId;
    if (dataZurgiinId && !formZurgiinId) {
      const currentValues = formRef.current?.getFieldsValue();
      if (currentValues.khurunguud?.[name]) {
        currentValues.khurunguud[name].zurgiinId = dataZurgiinId;
        currentValues.khurunguud[name].fileList = [];
        formRef.current?.setFieldsValue(currentValues);
      }
      setZurgiinId(dataZurgiinId);
    }
  }, [data, name, formRef]);

  useEffect(() => {
    const formZurgiinId = formRef.current?.getFieldValue([
      "khurunguud",
      name,
      "zurgiinId",
    ]);
    if (formZurgiinId !== zurgiinId) {
      setZurgiinId(formZurgiinId);
    }
  }, [formRef.current?.getFieldsValue()?.khurunguud?.[name]?.zurgiinId]);

  const clearImage = () => {
    const currentValues = formRef.current?.getFieldsValue();
    if (currentValues.khurunguud?.[name]) {
      currentValues.khurunguud[name].zurgiinId = undefined;
      currentValues.khurunguud[name].fileList = [];
      formRef.current?.setFieldsValue(currentValues);
      setZurgiinId(undefined);
      setFileList([]);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -right-2 -top-2 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600">
        <CloseCircleOutlined
          className="text-sm"
          onClick={() => {
            remove(name);
          }}
        />
      </div>

      <Card className="shadow-md">
        <div key={key}>
          <div className="grid grid-cols-12">
            <div className="col-span-12 row-span-2 flex items-center justify-center -space-y-4 lg:col-span-2 lg:space-y-0">
              <Form.Item
                {...restField}
                name={[name, "zurgiinId"]}
                fieldKey={[fieldKey, "zurgiinId"]}
                getValueFromEvent={normFile}
              >
                <div className="relative h-24 w-24">
                  <Upload
                    showUploadList={false}
                    className="avatar-uploader flex h-24 w-24 items-center justify-center overflow-hidden"
                    multiple={false}
                    listType="picture-card"
                    name="file"
                    action={`${url}/zuragKhadgalya`}
                    method="POST"
                    data={{ turul: "khurungu" }}
                    headers={{ Authorization: `bearer ${token}` }}
                    fileList={fileList}
                    onChange={(e) => {
                      console.log("Upload onChange:", e);
                      let newFileList = e.fileList;

                      newFileList = newFileList.map((file) => ({
                        ...file,
                        url: file.response?.id
                          ? `${url}/zuragAvya/khurungu/${baiguullaga._id}/${file.response.id}?token=${token}`
                          : file.url,
                      }));

                      setFileList(newFileList);

                      if (e.file.status === "done" && e.file.response?.id) {
                        const currentValues = formRef.current?.getFieldsValue();
                        currentValues.khurunguud[name].zurgiinId =
                          e.file.response.id;
                        currentValues.khurunguud[name].fileList = newFileList;
                        formRef.current?.setFieldsValue(currentValues);
                        setZurgiinId(e.file.response.id);
                      } else if (e.file.status === "removed") {
                        clearImage();
                      }
                    }}
                    beforeUpload={() => true}
                  >
                    <div
                      className={zurgiinId ? "hidden" : "text-center text-sm"}
                      id={`${name}-upload-image`}
                    >
                      {t("Зураг оруулах")}
                    </div>
                    {zurgiinId && baiguullaga?._id ? (
                      <img
                        className="h-full w-full object-contain"
                        src={`${url}/zuragAvya/khurungu/${baiguullaga._id}/${zurgiinId}?token=${token}`}
                        id={`${name}-image`}
                        alt=""
                        onError={(e) => {
                          console.log("Image load error:", e);
                          e.target.src = "";
                          setZurgiinId(undefined);
                          clearImage();
                        }}
                      />
                    ) : null}
                  </Upload>
                  {zurgiinId && (
                    <div className="absolute right-0 top-0 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600">
                      <CloseCircleOutlined onClick={clearImage} />
                    </div>
                  )}
                </div>
              </Form.Item>
            </div>
            <div className="col-span-12 flex flex-col justify-center -space-y-4 lg:col-span-5 lg:space-y-0">
              <Form.Item
                {...restField}
                label={t("Нэр")}
                name={[name, "ner"]}
                fieldKey={[fieldKey, "ner"]}
                rules={[
                  {
                    required: true,
                    message: t("Нэр бүртгэнэ үү!"),
                  },
                ]}
              >
                <Input
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      uneRef.current.focus();
                    }
                  }}
                  style={{ width: "100%" }}
                  placeholder={t("Нэр")}
                />
              </Form.Item>
              <Form.Item
                {...restField}
                label={t("Тоо")}
                name={[name, "too"]}
                fieldKey={[fieldKey, "too"]}
                rules={[
                  {
                    required: true,
                    message: t("Тоо ширхэг бүртгэнэ үү"),
                  },
                ]}
              >
                <InputNumber
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      niitUneRef.current.focus();
                    }
                  }}
                  onChange={(e) => {
                    const ads = formRef.current?.getFieldsValue();
                    ads.khurunguud[name].niit =
                      e * ads.khurunguud[name].une || 0;
                    formRef.current?.setFieldsValue(ads);
                  }}
                  style={{ width: "100%" }}
                  placeholder={t("Тоо ширхэг")}
                  ref={tooRef}
                />
              </Form.Item>
            </div>
            <div className="col-span-12 flex flex-col justify-center -space-y-4 lg:col-span-5 lg:space-y-0">
              <Form.Item
                {...restField}
                label={t("Үнэ")}
                name={[name, "une"]}
                fieldKey={[fieldKey, "une"]}
                rules={[
                  {
                    required: true,
                    message: t("Үнэ бүртгэнэ үү"),
                  },
                ]}
              >
                <InputNumber
                  ref={uneRef}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      tooRef.current.focus();
                    }
                  }}
                  onChange={(e) => {
                    const ads = formRef.current?.getFieldsValue();
                    ads.khurunguud[name].niit =
                      e * ads.khurunguud[name].too || 0;
                    formRef.current?.setFieldsValue(ads);
                  }}
                  style={{ width: "100%" }}
                  placeholder={t("Нэгж үнэ")}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
              <Form.Item
                {...restField}
                label={t("Нийт")}
                name={[name, "niit"]}
                fieldKey={[fieldKey, "niit"]}
                rules={[
                  {
                    required: false,
                    message: t("Нийт бүртгэнэ үү"),
                  },
                ]}
              >
                <InputNumber
                  ref={niitUneRef}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      document.getElementById("khurunguBurtgekh").focus();
                    }
                  }}
                  style={{ width: "100%" }}
                  placeholder={t("Нийт үнэ")}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TalbaiBurtgekh({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const router = useRouter();
  const { t } = useTranslation();
  const query = router.query;
  const data = JSON.parse(query.data || "{}");
  const barilgiinId = query.barilgiinId;
  const formRef = useRef();
  const { TextArea } = Input;
  const { ajiltan, baiguullaga } = useAuth();
  const [waiting, setWaiting] = useState(false);

  const [gereeteiEsekh, setGereeteiEsekh] = React.useState(false);

  React.useEffect(() => {
    if (!!data?._id)
      uilchilgee(token)
        .get("/geree", {
          params: {
            query: { talbainIdnuud: data?._id, tuluv: { $ne: -1 } },
            select: { gereeniiDugaar: 1 },
          },
        })
        .then(({ data }) => {
          if (data) {
            setGereeteiEsekh(data.jagsaalt.length > 0);
          }
        });
  }, []);

  const [talbaiState, settalbaiState] = useState({
    kod: undefined,
    talbainKhemjee: undefined,
    talbainKhemjeeMetrKube: undefined,
    tailbar: undefined,
    talbainNegjUne: undefined,
    talbainNiitUne: undefined,
    ashiglaltiinZardal: undefined,
    niitAshiglaltiinZardal: undefined,
    tooluuriinDugaar: undefined,
    tureesiinTulbur: undefined,
    niitiinTalbaiEsekh: false,
    davkhar: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
    ...data,
  });

  function onChange(talbar, utga) {
    if (talbar === "tooluuriinDugaar") {
      talbaiState.tooluuriinDugaar = utga;
      formRef.current.setFieldsValue({ tooluuriinDugaar: utga });
    }
    if (talbar === "talbainNegjUne") {
      talbaiState.talbainNiitUne = (
        Number(utga || 0) * Number(talbaiState.talbainKhemjee || 0)
      ).toFixed(2);
      talbaiState.tureesiinTulbur =
        Number(talbaiState.niitAshiglaltiinZardal || 0) +
        Number(talbaiState.talbainNiitUne || 0);
      formRef.current.setFieldsValue({
        talbainNiitUne: talbaiState.talbainNiitUne,
      });
      formRef.current.setFieldsValue({
        tureesiinTulbur: talbaiState.tureesiinTulbur,
      });
    }
    if (talbar === "ashiglaltiinZardal") {
      talbaiState.niitAshiglaltiinZardal = (
        utga * talbaiState.talbainKhemjee || 0
      ).toFixed(2);
      formRef.current.setFieldsValue({
        niitAshiglaltiinZardal: talbaiState.niitAshiglaltiinZardal,
      });
      talbaiState.tureesiinTulbur =
        Number(talbaiState.niitAshiglaltiinZardal || 0) +
        Number(talbaiState.talbainNiitUne || 0);
      formRef.current.setFieldsValue({
        tureesiinTulbur: talbaiState.tureesiinTulbur,
      });
    }
    if (talbar === "talbainNiitUne") {
      talbaiState.talbainNegjUne = (
        Number(utga || 0) / Number(talbaiState.talbainKhemjee || 1)
      ).toFixed(2);
      formRef.current.setFieldsValue({
        talbainNegjUne: talbaiState.talbainNegjUne,
      });
      talbaiState.tureesiinTulbur =
        Number(talbaiState.niitAshiglaltiinZardal) + Number(utga);
      formRef.current.setFieldsValue({
        tureesiinTulbur: talbaiState.tureesiinTulbur,
      });
    }
    if (talbar === "talbainKhemjee") {
      talbaiState.niitAshiglaltiinZardal = (
        utga * talbaiState.ashiglaltiinZardal || 0
      ).toFixed(2);
      if (!!talbaiState.niitAshiglaltiinZardal)
        formRef.current.setFieldsValue({
          niitAshiglaltiinZardal: talbaiState.niitAshiglaltiinZardal,
        });

      let value =
        talbaiState.talbainNegjUne === undefined
          ? Number(talbaiState.talbainNiitUne || 0) / Number(utga || 1)
          : Number(utga) * Number(talbaiState.talbainNegjUne || 0);
      talbaiState.talbainNiitUne = value.toFixed(2);
      formRef.current.setFieldsValue({ talbainNiitUne: value.toFixed(2) });
      if (
        talbaiState.talbainNiitUne > 0 &&
        talbaiState.niitAshiglaltiinZardal > 0
      ) {
        talbaiState.tureesiinTulbur =
          Number(talbaiState.talbainNiitUne) +
          Number(talbaiState.niitAshiglaltiinZardal);
        formRef.current.setFieldsValue({
          tureesiinTulbur: talbaiState.tureesiinTulbur,
        });
      }
    }
    if (talbar === "khurunguUne") {
      talbaiState.talbainNiitUne = (
        utga * (talbaiState.talbainKhemjee || 0)
      ).toFixed(2);
      formRef.current.setFieldsValue({});
    }
    settalbaiState((a) => ({ ...a, [talbar]: utga }));
  }

  function talbaiBurtgekh() {
    const khurunguud = formRef.current.getFieldsValue(khurunguud);
    talbaiState.tooluuriinDugaar =
      formRef.current.getFieldValue("tooluuriinDugaar");

    talbaiState.baiguullagiinId = ajiltan?.baiguullagiinId;
    talbaiState.barilgiinId = barilgiinId;
    talbaiState.khurunguud = khurunguud.khurunguud;
    talbaiState.talbainKhemjee = parseFloat(
      talbaiState.talbainKhemjee?.toFixed(2)
    );
    talbaiState.talbainKhemjeeMetrKube = parseFloat(
      talbaiState.talbainKhemjeeMetrKube?.toFixed(2)
    );
    if (khurunguud?.khurunguud?.length > 0) {
      talbaiState.khurunguud.forEach((item) => {
        if (Array.isArray(item.zurgiinId) && item.zurgiinId[0]?.response?.id) {
          item.zurgiinId = item.zurgiinId[0].response.id;
        }
      });
    }

    const segmentuud = formRef.current.getFieldsValue(segmentuud);
    talbaiState.segmentuud = segmentuud.segmentuud;
    if (talbaiState.niitiinTalbaiEsekh)
      talbaiState.sulKhemjee =
        talbaiState.sulKhemjee || talbaiState.talbainKhemjee;
    setWaiting(true);
    if (!!talbaiState._id) {
      uilchilgee(token)
        .post("/talbaiZasya", talbaiState)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            setWaiting(false);
            message.success(t("Бүртгэл амжилттай засагдлаа"));
            formRef.current.resetFields();
            router.back();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else
      createMethod("talbai", token, talbaiState)
        .then(({ data }) => {
          if (data !== undefined) {
            setWaiting(false);
            message.success(t("Бүртгэл амжилттай хийгдлээ"));
            formRef.current.resetFields();
            router.back();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
  }

  function onFinish() {
    talbaiBurtgekh();
    if (!talbaiState.ashiglaltiinZardal) {
      talbaiState.ashiglaltiinZardal = 0;
    }
  }

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  function garya() {
    const values = formRef.current.getFieldsValue();
    if (
      compareFields(values, data, [
        "kod",
        "talbainKhemjee",
        "talbainKhemjeeMetrKube",
        "talbainNegjUne",
        "talbainNiitUne",
        "tooluuriinDugaar",
        "davkhar",
        "tailbar",
        "khurunguud",
        "segmentuud",
        "niitiinTalbaiEsekh",
      ])
    )
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: router.back,
      });
    else router.back();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }

    if (formRef.current) {
      const fieldInstance = formRef.current.getFieldInstance("kod");
      if (fieldInstance) {
        fieldInstance.focus();
      }
    }

    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "control-ref_kod":
          formRef.current.getFieldInstance("talbainKhemjee").focus();
          break;
        case "control-ref_talbainKhemjee":
          formRef.current.getFieldInstance("talbainNegjUne").focus();
          break;
        case "control-ref_talbainNegjUne":
          formRef.current.getFieldInstance("talbainNiitUne").focus();
          break;
        case "control-ref_talbainNiitUne":
          formRef.current.getFieldInstance("davkhar").focus();
          break;

        case "control-ref_tailbar":
          document.getElementById("talbaiBurtgekhButton").focus();
          break;

        default:
          break;
      }
    }
  }, []);

  return (
    <Admin
      title="Талбай бүртгэл"
      khuudasniiNer="talbaiBurtgekh"
      tsonkhniiId={"61c2c63e1c2830c4e6f90c8d"}
      className="p-3 pb-11 md:p-4 lg:pb-0"
      dedKhuudas
      loading={waiting}
    >
      <Form
        ref={formRef}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 15 }}
        autoComplete={"off"}
        name="control-ref"
        onFinish={onFinish}
        initialValues={{ ...data, remember: true }}
        className="col-span-12 grid grid-cols-12 gap-6"
      >
        <div className="box col-span-12 max-h-screen overflow-y-scroll overscroll-contain p-5 md:col-span-6 xl:col-span-4">
          <div>
            <div data-aos="fade-right" data-aos-duration="1000">
              <Form.Item
                name="kod"
                label={t("Дугаар")}
                rules={[
                  {
                    required: true,
                    message: t("Дугаар бүртгэнэ үү!"),
                  },
                ]}
              >
                <Input
                  onKeyUp={focuser}
                  type="text"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder={t("Дугаар")}
                  value={talbaiState.kod}
                  onChange={(e) => onChange("kod", e.target.value)}
                ></Input>
              </Form.Item>
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
            >
              <Form.Item
                label={t("Хэмжээ")}
                name="talbainKhemjee"
                rules={[
                  {
                    required: true,
                    message: t("Талбайн хэмжээ бүртгэнэ үү!"),
                  },
                ]}
              >
                <InputNumber
                  onKeyUp={focuser}
                  style={{ width: "100%" }}
                  allowClear
                  placeholder={t("Талбайн хэмжээ/м2/")}
                  value={talbaiState.talbainKhemjee}
                  onChange={(v) => onChange("talbainKhemjee", v)}
                ></InputNumber>
              </Form.Item>
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
            >
              <Form.Item
                label={t("Хэмжээ м3")}
                name="talbainKhemjeeMetrKube"
                rules={[
                  {
                    required: false,
                    message: t("Талбайн хэмжээ бүртгэнэ үү!"),
                  },
                ]}
                normalize={(value) => {
                  return value === null || value === undefined || value === ""
                    ? 0
                    : value;
                }}
              >
                <InputNumber
                  onKeyUp={focuser}
                  style={{ width: "100%" }}
                  allowClear
                  placeholder={t("Талбайн хэмжээ/м3/")}
                  value={talbaiState.talbainKhemjeeMetrKube}
                  onChange={(v) => onChange("talbainKhemjeeMetrKube", v)}
                  onBlur={() => {
                    if (
                      talbaiState.talbainKhemjeeMetrKube === null ||
                      talbaiState.talbainKhemjeeMetrKube === undefined ||
                      talbaiState.talbainKhemjeeMetrKube === ""
                    ) {
                      onChange("talbainKhemjeeMetrKube", 0);
                    }
                  }}
                />
              </Form.Item>
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <Form.Item
                name="talbainNegjUne"
                label={t("Нэгж үнэ")}
                rules={[
                  {
                    required: true,
                    message: t("Нэгж үнэ бүртгэнэ үү!"),
                  },
                ]}
              >
                <InputNumber
                  onKeyUp={focuser}
                  style={{ width: "100%" }}
                  placeholder={t("Нэгж үнэ")}
                  value={talbaiState.talbainNegjUne}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(target) => onChange("talbainNegjUne", target)}
                />
              </Form.Item>
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="300"
            >
              <Form.Item
                name="talbainNiitUne"
                label={t("Нийт үнэ")}
                rules={[
                  {
                    required: true,
                    message: t("Нийт үнэ бүртгэнэ үү!"),
                  },
                ]}
              >
                <InputNumber
                  onKeyUp={focuser}
                  style={{ width: "100%" }}
                  placeholder={t("Нийт үнэ")}
                  value={talbaiState.talbainNiitUne}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(target) => onChange("talbainNiitUne", target)}
                />
              </Form.Item>
            </div>

            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="300"
            >
              <Form.Item
                name="tooluuriinDugaar"
                label={t("Тоолуурын дугаар")}
                rules={[]}
              >
                <Input
                  onKeyUp={focuser}
                  style={{ width: "100%" }}
                  placeholder={t("Тоолуурын дугаар")}
                  value={talbaiState.tooluuriinDugaar}
                  onChange={(e) => onChange("tooluuriinDugaar", e.target.value)}
                />
              </Form.Item>
            </div>

            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="700"
            >
              <Form.Item
                name="davkhar"
                label={t("Давхар")}
                rules={[
                  {
                    required: true,
                    message: t("Давхар бүртгэнэ үү!"),
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder={t("Давхар")}
                  value={talbaiState.davkhar}
                  onChange={(e) => {
                    onChange("davkhar", e);
                    formRef.current.getFieldInstance("tailbar").focus();
                  }}
                  allowClear
                >
                  {baiguullaga?.barilguud
                    ?.find((a) => a._id === barilgiinId)
                    ?.davkharuud.map((a) => (
                      <Select.Option key={a._id} value={a.davkhar}>
                        {a.davkhar}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="niitiinTalbaiEsekh"
                label={t("Нийтийн талбай эсэх")}
                hidden={data.idevkhiteiEsekh && !data.niitiinTalbaiEsekh}
              >
                <Switch
                  disabled={gereeteiEsekh}
                  defaultChecked={talbaiState.niitiinTalbaiEsekh}
                  onChange={(e) => onChange("niitiinTalbaiEsekh", e)}
                />
              </Form.Item>
              <div
                data-aos="fade-right "
                data-aos-duration="1000"
                data-aos-delay="700"
              >
                <Form.List name="segmentuud" className="">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <div key={key}>
                          <YalgakhUtga
                            key={key}
                            name={name}
                            fieldKey={fieldKey}
                            {...restField}
                            remove={remove}
                          />
                        </div>
                      ))}
                      <div className="flex w-full justify-end pb-5 sm:px-6 sm:pl-[33%]">
                        <Button
                          icon={<PlusOutlined />}
                          className="h-8 rounded-sm bg-white hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 "
                          type="dashed"
                          onClick={() => add()}
                          block
                        >
                          {t("Ялгах утга оруулах")}
                        </Button>
                      </div>
                    </>
                  )}
                </Form.List>
              </div>
              <Form.Item name="tailbar" label={t("Тайлбар")}>
                <TextArea
                  onKeyDown={focuser}
                  style={{ width: "100%" }}
                  rows={4}
                  placeholder={t("Тайлбар")}
                  value={talbaiState.tailbar}
                  onChange={(e) => onChange("tailbar", e.target.value)}
                ></TextArea>
              </Form.Item>
              <div className="flex w-full justify-end space-x-5 pr-[4%] md:pl-[33%] ">
                <div className="w-full">
                  <Button onClick={showDrawer} type="primary">
                    <span className="mr-2 text-white">
                      <SettingOutlined />
                    </span>
                    <span className="text-white ">
                      {t("План зураг тохируулах")}
                    </span>
                  </Button>
                  <Drawer
                    width={"100vw"}
                    title={t("План зураг тохируулах")}
                    placement="left"
                    onClose={onClose}
                    visible={open}
                  >
                    {open && (
                      <Konva
                        token={token}
                        _id={talbaiState}
                        davkhar={talbaiState.davkhar}
                        baiguullaga={baiguullaga}
                        barilgiinId={barilgiinId}
                        points={
                          talbaiState.bairshil &&
                          JSON.parse(JSON.stringify(talbaiState.bairshil))
                        }
                        onFinish={(v) => {
                          onChange("bairshil", v);
                          onClose();
                        }}
                      />
                    )}
                  </Drawer>
                </div>
                <div className="w-2/4 ">
                  {!!gereeteiEsekh && (
                    <Popconfirm
                      title="Гэрээтэй байна. Засварлахдаа итгэлтэй байна уу?"
                      okText={t("Тийм")}
                      cancelText={t("Үгүй")}
                      onConfirm={() => {
                        formRef.current.submit();
                      }}
                    >
                      <Button
                        className="w-full"
                        id="talbaiBurtgekhButton"
                        type="primary"
                      >
                        {t("Хадгалах")}
                      </Button>
                    </Popconfirm>
                  )}
                  {!gereeteiEsekh && (
                    <Button
                      className="w-full"
                      id="talbaiBurtgekhButton"
                      onClick={() => formRef.current.submit()}
                      type="primary"
                    >
                      {t("Хадгалах")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box col-span-12 p-5 md:col-span-12 xl:col-span-8">
          <Divider className="pb-5">{t("Хөрөнгийн бүртгэл")}</Divider>
          <div className="">
            <Form.List name="khurunguud">
              {(fields, { add, remove }) => (
                <>
                  <div
                    className={`max-h-maxScrollH space-y-4 overflow-y-scroll ${
                      fields.length > 0 && "px-3 py-5 pb-10 lg:px-10"
                    }`}
                  >
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <KhurunguudCard
                        t={t}
                        key={key}
                        name={name}
                        fieldKey={fieldKey}
                        restField={restField}
                        token={token}
                        remove={remove}
                        data={data}
                        baiguullaga={baiguullaga}
                        formRef={formRef}
                      />
                    ))}
                  </div>
                  <div className="-mt-4 flex justify-center gap-5 px-2">
                    <Button
                      className="h-8 w-full rounded-sm bg-white hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 "
                      type="dashed"
                      onClick={() => add()}
                      id={"khurunguBurtgekh"}
                      block
                      icon={<PlusOutlined />}
                    >
                      {t("Хөрөнгө бүртгэх")}
                    </Button>
                  </div>
                </>
              )}
            </Form.List>
          </div>
        </div>
      </Form>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default TalbaiBurtgekh;
