import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Form, Input, message, Modal, Select, DatePicker } from "antd";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import uilchilgee from "services/uilchilgee";
import compareFields from "tools/function/compareFields";
import moment from "moment";
import { t } from "i18next";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import formatNumber from "tools/function/formatNumber";
import { CheckCircleOutlined } from "@ant-design/icons";

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
  },
  ref
) {
  const [form] = Form.useForm();
  const [geree, setGeree] = useState(null);
  const [turulShalgah, setTurulShalgah] = useState(
    data?.turul ? data?.turul : undefined
  );
  const [inputValue, setInputValue] = useState("");
  const [ognoo, setOgnoo] = useState(
    data?.ekhlekhOgnoo && data?.duusakhOgnoo
      ? [moment(data.ekhlekhOgnoo), moment(data.duusakhOgnoo)]
      : [moment(new Date()), moment(new Date()).add(1, "months")]
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

  // console.log(ognoo, "ognooognoo");

  // function mashiniiFormatSolyo(value) {
  //   const too = value.replace(/[^0-9]/g, "").slice(0, 4);
  //   const useg = Array.from(value)
  //     .filter((a) => /[А-Яа-яөӨүҮ]/.test(a))
  //     .slice(0, 3)
  //     .join("");
  //   // const formattedValue = `${too}${useg}`.toUpperCase();
  //   setInputValue(`${too}${useg}`.toUpperCase());
  //   // setInputValue(formattedValue);
  //   // console.log(inputValue, "formattedValueformattedValue");
  // }

  // console.log(inputValue, "inputValueinputValue");

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
    const data = form.getFieldsValue();
    (data.ekhlekhOgnoo = ognoo[0]?.format("YYYY-MM-DD 00:00:00")),
      (data.duusakhOgnoo = ognoo[1]?.format("YYYY-MM-DD 23:59:59")),
      (data.barilgiinId = barilgiinId);
    if (!!geree) {
      data.ezemshigchiinTalbainDugaar = geree?.talbainDugaar;
      data.gereeniiDugaar = geree?.gereeniiDugaar;
    }
    console.log(data, "|dataa");
    const method = data?._id ? updateMethod : createMethod;
    method("mashin", token, data).then(({ data }) => {
      if (data === "Amjilttai") {
        message.success(t("Амжилттай хадгаллаа"));
        onRefresh && onRefresh();
        destroy();
      }
    });
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

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={data}
      className="space-y-2"
      labelCol={{ span: 6 }}
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
            form.getFieldInstance("ezemshigchiinUtas").focus();
            setTurulShalgah(e);
          }}
          placeholder={t("Төрөл")}
        >
          {[
            "Гэрээт",
            "Түрээслэгч",
            "Дотоод",
            "Үнэгүй",
            "Онцгой үйлчлүүлэгч",
          ].map((a) => (
            <Select.Option key={a} value={a}>
              {t(a)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {turulShalgah === "Онцгой үйлчлүүлэгч" && (
        <div>
          <Form.Item name="khariltsagchiinNer" noStyle />
          <Form.Item name="gereeniiDugaar" noStyle />
          <Form.Item
            name={"gereeniiId"}
            requiredMark={"optional"}
            rules={[
              {
                required: true,
                message: t("Гэрээ сонгоно уу!"),
              },
            ]}
            label={t("Гэрээ сонгох")}
          >
            <Select
              onChange={(v) => {
                form.setFieldValue(
                  "khariltsagchiinNer",
                  gereeniiMedeelel?.jagsaalt?.find((a) => a._id === v)?.ner
                );
                form.setFieldValue(
                  "gereeniiDugaar",
                  gereeniiMedeelel?.jagsaalt?.find((a) => a._id === v)
                    ?.gereeniiDugaar
                );
              }}
              showSearch
              filterOption={(o) => o}
              allowClear
              onSearch={(search) =>
                setGereeniiKhuudaslalt((a) => ({
                  ...a,
                  search,
                  khuudasniiDugaar: 1,
                }))
              }
              placeholder={t("Гэрээ сонгох")}
            >
              {gereeniiMedeelel?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option key={mur._id} value={mur._id}>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row space-x-2">
                        <label className="font-semibold">
                          {t("Гэрээний №")}:
                        </label>
                        <div>{mur.gereeniiDugaar}</div>
                      </div>
                      <div className="flex flex-row space-x-2">
                        <label className="font-semibold">
                          {t("Түрээслэгч")}:
                        </label>
                        <div>{mur.ner}</div>
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>
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
            min: 7,
            max: 7,
            pattern: new RegExp("[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{3}"),
            message: t("Машины дугаар 4 тоо 3 үсэг байх ёстой"),
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
            className="flex w-full  rounded-md md:w-auto"
            size="middle"
            allowClear={true}
            placeholder={["Эхлэх огноо", "Дуусах огноо"]}
            value={ognoo}
            onChange={setOgnoo}
          />
        </Form.Item>
      )}
    </Form>
  );
}

export default React.forwardRef(MashinBurtgel);
