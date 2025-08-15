import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Form,
  Input,
  message,
  Modal,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Checkbox,
  Switch,
  TimePicker,
} from "antd";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import compareFields from "tools/function/compareFields";
import moment from "moment";
import { t } from "i18next";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import formatNumber from "tools/function/formatNumber";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const order = { createdAt: -1 };

function MashinBurtgel(
  {
    data,
    barilgiinId,
    token,
    destroy,
    onRefresh,
    mashinBurtgekhButtonId,
    baiguullagiinId,
    dotorGadnaTsagEsekh,
    ajiltan,
  },
  ref
) {
  const [form] = Form.useForm();
  const [geree, setGeree] = useState(null);
  const [turulShalgah, setTurulShalgah] = useState(
    data?.turul ? data?.turul : undefined
  );
  const [nemeltTurulShalgah, setNemeltTurulShalgah] = useState(
    data?.tuluv ? data?.tuluv : undefined
  );
  const [khungululttei, setKhungululttei] = useState(
    data?.khungulultTurul ? true : false
  );
  const [khungulultiinTurul, setKhungulultiinTurul] = useState(
    data?.khungulultTurul ? data?.khungulultTurul : undefined
  );
  const [ognoo, setOgnoo] = useState(
    data?.ekhlekhOgnoo && data?.duusakhOgnoo
      ? [moment(data.ekhlekhOgnoo), moment(data.duusakhOgnoo)]
      : [moment(new Date()), moment(new Date()).add(1, "months")]
  );
  const [gereetTulburBodokhEsekh, setGereetTulburBodokhEsekh] = useState(
    data?.gereetTulburBodokhEsekh || false
  );
  const [gereetTulburBodokhEsekhNemelt, setGereetTulburBodokhEsekhNemelt] =
    useState(!!data?.tulburBodokhTsagEkhlekhNeg || false);
  const [tulburBodokhTsag, setTulburBodokhTsag] = useState(
    data?.tulburBodokhTsagEkhlekh
      ? [
          moment()
            .set(
              "hour",
              parseInt(data?.tulburBodokhTsagEkhlekh.split(":")[0], 10)
            )
            .set(
              "minute",
              parseInt(data?.tulburBodokhTsagEkhlekh.split(":")[1], 10)
            ),
          moment()
            .set(
              "hour",
              parseInt(data?.tulburBodokhTsagDuusakh.split(":")[0], 10)
            )
            .set(
              "minute",
              parseInt(data?.tulburBodokhTsagDuusakh.split(":")[1], 10)
            ),
        ]
      : null
  );

  const [tulburBodokhTsagNemelt, setTulburBodokhTsagNemelt] = useState(
    data?.tulburBodokhTsagEkhlekhNeg
      ? [
          moment()
            .set(
              "hour",
              parseInt(data?.tulburBodokhTsagEkhlekhNeg.split(":")[0], 10)
            )
            .set(
              "minute",
              parseInt(data?.tulburBodokhTsagEkhlekhNeg.split(":")[1], 10)
            ),
          moment()
            .set(
              "hour",
              parseInt(data?.tulburBodokhTsagDuusakhNeg.split(":")[0], 10)
            )
            .set(
              "minute",
              parseInt(data?.tulburBodokhTsagDuusakhNeg.split(":")[1], 10)
            ),
        ]
      : null
  );

  const query = React.useMemo(() => {
    return { tuluv: { $nin: [-1] }, barilgiinId };
  }, []);

  const { gereeniiMedeelel, setGereeniiKhuudaslalt } = useGereeniiJagsaalt(
    token,
    baiguullagiinId,
    undefined,
    query,
    undefined,
    undefined,
    order
  );

  const dataOrjIrsenEsekh = !!data ? true : false;

  // function mashiniiFormatSolyo(value) {
  //   const too = value.replace(/[^0-9]/g, "").slice(0, 4);
  //   const useg = Array.from(value)
  //     .filter((a) => /[А-Яа-яөӨүҮ]/.test(a))
  //     .slice(0, 3)
  //     .join("");
  //   // const formattedValue = `${too}${useg}`.toUpperCase();
  //   setInputValue(`${too}${useg}`.toUpperCase());
  //   // setInputValue(formattedValue);
  // }

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        form.submit();
      },
      khaaya() {
        destroy();
      },
    }),
    [form, geree, ognoo]
  );

  function garya() {
    const values = form.getFieldsValue();
    if (
      compareFields(values, data, [
        "turul",
        "ezemshigchiinUtas",
        "dugaar",
        "ezemshigchiinNer",
        "ezemshigchiinRegister",
      ])
    )
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: destroy,
      });
    else destroy();
  }

  function onFinish() {
    const lastData = form.getFieldsValue();
    (lastData.ekhlekhOgnoo = ognoo[0]?.format("YYYY-MM-DD 00:00:00")),
      (lastData.duusakhOgnoo = ognoo[1]?.format("YYYY-MM-DD 23:59:59")),
      (lastData.barilgiinId = barilgiinId);
    if (!!geree) {
      lastData.ezemshigchiinTalbainDugaar = geree?.talbainDugaar;
      lastData.gereeniiDugaar = geree?.gereeniiDugaar;
    }
    if (khungulultiinTurul === "togtmolTsag") {
      lastData.khungulujEkhlesenOgnoo = new Date();

      if (!lastData?.uldegdelKhungulukhKhugatsaa) {
        lastData.uldegdelKhungulukhKhugatsaa = lastData.khungulukhKhugatsaa;
      }
    }

    if (lastData.turul === "Гэрээт") {
      lastData.gereetTulburBodokhEsekh = gereetTulburBodokhEsekh;
      lastData.tulburBodokhTsagEkhlekh = gereetTulburBodokhEsekh
        ? tulburBodokhTsag[0].format("HH:mm")
        : null;
      lastData.tulburBodokhTsagDuusakh = gereetTulburBodokhEsekh
        ? tulburBodokhTsag[1].format("HH:mm")
        : null;
      lastData.tulburBodokhTsagEkhlekhNeg = gereetTulburBodokhEsekhNemelt
        ? tulburBodokhTsagNemelt[0].format("HH:mm")
        : null;
      lastData.tulburBodokhTsagDuusakhNeg = gereetTulburBodokhEsekhNemelt
        ? tulburBodokhTsagNemelt[1].format("HH:mm")
        : null;
    }
    const method = lastData?._id ? updateMethod : createMethod;
    method("mashin", token, lastData).then(({ data }) => {
      if (data === "Amjilttai") {
        message.success(t("Амжилттай хадгаллаа"));
        onRefresh && onRefresh();
        destroy();
      }
    });
    if (
      ajiltan?.erkh === "Admin" ||
      ajiltan?.tokhirgoo?.mashniiDugaarZasakhEsekh
    ) {
      uilchilgee(token)
        .post(`/mashiniiDugaarZasakh`, {
          baiguullagiinId,
          barilgiinId,
          mashin: lastData,
          mashiniiDugaar: lastData.dugaar,
        })
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(
              t("Зогсоолд орсон машины мэдээлэл амжилттай өөрчлөгдсөн")
            );
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    }
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    form.getFieldInstance("turul").focus();
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "ezemshigchiinUtas":
          form.getFieldInstance("dugaar").focus();
          break;
        case "dugaar":
          form.getFieldInstance("ezemshigchiinNer").focus();
          break;
        case "ezemshigchiinNer":
          form.getFieldInstance("ezemshigchiinRegister").focus();
          break;
        case "ezemshigchiinRegister":
          document.getElementById(mashinBurtgekhButtonId).focus();
          break;
        default:
          break;
      }
    }
  }, []);

  function gereeAvya({ target }) {
    if (target.value?.length > 7)
      uilchilgee(token)
        .post("/utasniiDugaaraarGereeAvya", { utas: target.value })
        .then(({ data }) => {
          if (!!data) setGeree({ ...data });
        });
  }

  const tsagValue = Form.useWatch("tsagiinTurul", form);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        khungulukhKhugatsaa:
          data.uldegdelKhungulukhKhugatsaa ?? data.khungulukhKhugatsaa ?? 0,
      });
    }
  }, [data, form]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={data}
      className="space-y-2"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item name="_id" noStyle />
      <Form.Item
        label={t("Төрөл")}
        name="turul"
        requiredMark={"optional"}
        rules={[
          {
            required: true,
            message: t("Төрөл сонгоно уу!"),
          },
        ]}
      >
        <Select
          onChange={(e) => {
            form.setFieldValue("tuluv", undefined);
            form.setFieldValue("nemeltTuluv", undefined);
            form.setFieldValue("khungulultTurul", undefined);
            form.setFieldValue("khungulult", undefined);
            form.setFieldValue("tsagiinTurul", undefined);
            form.setFieldValue("khungulukhKhugatsaa", undefined);
            form.getFieldInstance("ezemshigchiinUtas").focus();
            setTurulShalgah(e);
            setKhungulultiinTurul(undefined);
            setNemeltTurulShalgah(undefined);
          }}
          placeholder={t("Төрөл")}
        >
          {["Гэрээт", "Түрээслэгч", "Дотоод", "Дурын", "СӨХ"].map((a) => (
            <Select.Option key={a} value={a}>
              {t(a)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {turulShalgah === "СӨХ" && (
        <React.Fragment>
          <Form.Item
            label={t("Төлөв")}
            name="tuluv"
            requiredMark={"optional"}
            rules={[
              {
                required: true,
                message: t("Төлөв сонгоно уу!"),
              },
            ]}
          >
            <Select
              onChange={(e) => {
                form.setFieldValue("nemeltTuluv", undefined);
                form.setFieldValue("khungulultTurul", undefined);
                form.setFieldValue("khungulult", undefined);
                form.setFieldValue("tsagiinTurul", undefined);
                form.setFieldValue("khungulukhKhugatsaa", undefined);
                form.getFieldInstance("cameraIP").focus();
                setNemeltTurulShalgah(e);
                setKhungulultiinTurul(undefined);
              }}
              placeholder={t("Төлөв сонгох")}
            >
              {["Дотор", "Гадна"].map((a) => (
                <Select.Option key={a} value={a}>
                  {t(a)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={t("Камер")} name="cameraIP">
            <Input
              style={{ width: "100%" }}
              placeholder="Камер IP оруулна уу..."
            />
          </Form.Item>
        </React.Fragment>
      )}
      {turulShalgah === "Түрээслэгч" && (
        <React.Fragment>
          <Form.Item
            label={t("Төлөв")}
            name="tuluv"
            requiredMark={"optional"}
            rules={[
              {
                required: true,
                message: t("Төлөв сонгоно уу!"),
              },
            ]}
          >
            <Select
              onChange={(e) => {
                form.setFieldValue("nemeltTuluv", undefined);
                form.setFieldValue("khungulultTurul", undefined);
                form.setFieldValue("khungulult", undefined);
                form.setFieldValue("tsagiinTurul", undefined);
                form.setFieldValue("khungulukhKhugatsaa", undefined);
                setNemeltTurulShalgah(e);
                setKhungulultiinTurul(undefined);
              }}
              placeholder={t("Төлөв сонгох")}
            >
              {["Үнэгүй", "Хөнгөлөлттэй", "Харилцагч"].map((a) => (
                <Select.Option key={a} value={a}>
                  {t(a)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {nemeltTurulShalgah === "Харилцагч" && (
            <Form.Item
              label={t("Харилцагч төлөв")}
              name="nemeltTuluv"
              requiredMark={"optional"}
              rules={[
                {
                  required: true,
                  message: t("Харилцагчийн төлөв сонгоно уу!"),
                },
              ]}
            >
              <Select
                onChange={(e) => {
                  form.setFieldValue("khungulultTurul", undefined);
                  form.setFieldValue("khungulult", undefined);
                  form.setFieldValue("tsagiinTurul", undefined);
                  form.setFieldValue("khungulukhKhugatsaa", undefined);
                  setKhungulultiinTurul(undefined);
                  if (e === "Хөнгөлөлттэй") {
                    setKhungululttei(true);
                  } else {
                    setKhungululttei(false);
                  }
                }}
                placeholder={t("Харилцагчийн төлөв сонгох")}
              >
                {["Үнэгүй", "Хөнгөлөлттэй"].map((a) => (
                  <Select.Option key={a} value={a}>
                    {t(a)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          {(nemeltTurulShalgah === "Хөнгөлөлттэй" ||
            khungululttei === true) && (
            <Form.Item
              label={t("Хөнгөлөлт сонгох")}
              name="khungulultTurul"
              requiredMark={"optional"}
              rules={[
                {
                  required: true,
                  message: t("Харилцагчийн хөнгөлөлт сонгоно уу!"),
                },
              ]}
            >
              <Select
                onChange={(e) => {
                  form.setFieldValue("khungulult", undefined);
                  form.setFieldValue("tsagiinTurul", undefined);
                  form.setFieldValue("khungulukhKhugatsaa", undefined);
                  setKhungulultiinTurul(e);
                }}
                placeholder={t("Харилцагчийн хөнгөлөлт сонгох")}
              >
                {[
                  { label: "Хувь хөнгөлөлт", key: 1, value: "khuviKhungulult" },
                  { label: "Тогтмол цаг", key: 2, value: "togtmolTsag" },
                ].map((a) => (
                  <Select.Option key={a.key} value={a.value}>
                    {t(a.label)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          {khungulultiinTurul === "khuviKhungulult" ? (
            <Form.Item
              label={t("Хувь хөнгөлөлт")}
              name="khungulult"
              requiredMark={"optional"}
              rules={[
                {
                  required: true,
                  message: t("Хувь хөнгөлөлт оруулна уу!"),
                },
              ]}
            >
              <InputNumber
                type="number"
                className="w-full"
                min={0}
                max={99}
                placeholder={t("Хувь хөнгөлөлт оруулна уу")}
              />
            </Form.Item>
          ) : khungulultiinTurul === "togtmolTsag" ? (
            <React.Fragment>
              <Form.Item
                label={t("Цагийн төрөл")}
                name="tsagiinTurul"
                requiredMark={"optional"}
                rules={[
                  {
                    required: true,
                    message: t("Цагийн төрөл сонгоно уу!"),
                  },
                ]}
              >
                <Select placeholder={t("Цагийн төрөл сонгоно уу")}>
                  {["Сараар", "Өдрөөр"].map((a) => (
                    <Select.Option key={a} value={a}>
                      {t(a)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {tsagValue && (
                <Form.Item
                  name={"khungulukhKhugatsaa"}
                  requiredMark="optional"
                  rules={[
                    {
                      required: true,
                      message: t("Хөнгөлөх Хугацаа оруулна уу!"),
                    },
                  ]}
                  label={t("Хугацаа/мин")}
                >
                  <InputNumber
                    type="number"
                    className="w-full"
                    min={0}
                    placeholder={t("Хөнгөлөх Хугацаа оруулна уу")}
                  />
                </Form.Item>
              )}

              {dotorGadnaTsagEsekh && (
                <Form.Item label={t("Зогсоолын төрөл")} name="zogsooliinTurul">
                  <Select placeholder={t("Зогсоолын төрөл сонгоно уу!")}>
                    {["Бүгд", "Гадна", "Дотор", ""].map((a) => (
                      <Select.Option key={a} value={a}>
                        {t(a)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </React.Fragment>
          ) : null}
        </React.Fragment>
      )}
      <Form.Item
        requiredMark={"optional"}
        normalize={(input) => {
          const too = input.replace(/[^0-9]+/g, "").slice(0, 8);
          return too;
        }}
        rules={[
          {
            required: true,
            message: t("Утасны дугаар бүртгэнэ үү!"),
          },
          {
            required: true,
            len: 8,
            validator: async (_, names) => {
              if (names?.length < 8 && names?.length > 0) {
                return Promise.reject(
                  new Error("Утасны дугаар аа шалгана уу!")
                );
              }
            },
          },
        ]}
        label={t("Утас")}
        name="ezemshigchiinUtas"
      >
        <Input
          maxLength={8}
          onKeyUp={focuser}
          placeholder={t("Утас")}
          onChange={gereeAvya}
        />
      </Form.Item>
      <Form.Item
        normalize={(input) => {
          const too = input.replace(/[^0-9]/g, "").slice(0, 4);
          const useg = Array.from(input)
            .filter((a) => /[А-Яа-яөӨүҮ]/.test(a))
            .slice(0, 3)
            .join("");
          return `${too}${useg}`.toUpperCase();
        }}
        requiredMark={"optional"}
        rules={[
          {
            required: true,
            message: t("Машины дугаар бүртгэнэ үү!"),
          },
          {
            required: form.getFieldValue("mashiniiDugaar")?.length > 0 && true,
            min: 6,
            max: 7,
            pattern: new RegExp(
              "[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{3}|[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{2}"
            ),
            message: t("Машины дугаар 4 тоо 2 эсвэл 3 үсэг байх ёстой"),
          },
        ]}
        label={t("Машины дугаар")}
        name="dugaar"
      >
        <Input onKeyUp={focuser} placeholder={t("Машины дугаар")} />
      </Form.Item>
      <Form.Item
        requiredMark={"optional"}
        rules={[
          {
            required: true,
            message: t("Нэр бүртгэнэ үү!"),
          },
        ]}
        label={t("Нэр")}
        name="ezemshigchiinNer"
      >
        <Input onKeyUp={focuser} placeholder={t("Нэр")} />
      </Form.Item>
      <Form.Item label={t("Тайлбар")} name="temdeglel">
        <Input onKeyUp={focuser} placeholder={t("Тайлбар")} />
      </Form.Item>
      {turulShalgah === "Гэрээт" && (
        <Form.Item
          rules={[
            {
              required: true,
              message: t("Огноо бүртгэнэ үү!"),
            },
          ]}
          label={t("Огноо")}
        >
          <DatePicker.RangePicker
            onClick={(e) => e.stopPropagation()}
            className="flex w-full rounded-md md:w-auto"
            size="middle"
            allowClear={true}
            placeholder={["Эхлэх огноо", "Дуусах огноо"]}
            value={ognoo}
            onChange={setOgnoo}
          />
        </Form.Item>
      )}
      {turulShalgah === "Гэрээт" && (
        <Form.Item
          rules={[
            {
              required: true,
              message: t("Төлбөр бодох эсэхийг сонгоно уу!"),
            },
          ]}
          label={t("Tөлбөр бодох эсэх")}
        >
          <Switch
            checked={gereetTulburBodokhEsekh}
            onChange={(v) => setGereetTulburBodokhEsekh(v)}
          />
        </Form.Item>
      )}
      {turulShalgah === "Гэрээт" && gereetTulburBodokhEsekh && (
        <Form.Item
          rules={[
            {
              required: true,
              message: t("Төлбөр бодох цаг бүртгэнэ үү!"),
            },
          ]}
          label={t("Төлбөр бодох цаг")}
        >
          <TimePicker.RangePicker
            onClick={(e) => e.stopPropagation()}
            className="flex-end w-full rounded-md md:w-auto"
            size="middle"
            format="HH:mm"
            allowClear={true}
            placeholder={["Эхлэх цаг", "Дуусах цаг"]}
            value={tulburBodokhTsag}
            onChange={setTulburBodokhTsag}
          />
          <Button
            className="ml-1 flex"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setGereetTulburBodokhEsekhNemelt(true)}
          ></Button>
        </Form.Item>
      )}
      {turulShalgah === "Гэрээт" &&
        gereetTulburBodokhEsekh &&
        gereetTulburBodokhEsekhNemelt && (
          <Form.Item
            rules={[
              {
                required: true,
                message: t("Нэмэлт төлбөр бодох цаг бүртгэнэ үү!"),
              },
            ]}
            label={t("Нэмэлт цаг")}
          >
            <TimePicker.RangePicker
              onClick={(e) => e.stopPropagation()}
              className="flex-end w-full rounded-md md:w-auto"
              size="middle"
              format="HH:mm"
              allowClear={true}
              placeholder={["Эхлэх цаг", "Дуусах цаг"]}
              value={tulburBodokhTsagNemelt}
              onChange={setTulburBodokhTsagNemelt}
            />
            <Button
              className="ml-1"
              icon={
                <DeleteOutlined style={{ fontSize: "18px", color: "red" }} />
              }
              onClick={() => setGereetTulburBodokhEsekhNemelt(false)}
            ></Button>
          </Form.Item>
        )}
    </Form>
  );
}

export default React.forwardRef(MashinBurtgel);
