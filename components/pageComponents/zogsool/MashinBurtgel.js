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

function MashinBurtgel(
  { data, barilgiinId, token, destroy, onRefresh, mashinBurtgekhButtonId },
  ref
) {
  const [form] = Form.useForm();
  const [geree, setGeree] = useState(null);
  const [turulShalgah, setTurulShalgah] = useState();
  const [inputValue, setInputValue] = useState("");
  const [ognoo, setOgnoo] = useState([
    // moment(new Date()).subtract(1, "months"),
    // moment(new Date()),
  ]);

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

  console.log(inputValue, "inputValueinputValue");

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const data = form.getFieldsValue();
        (data.ekhlekhOgnoo = ognoo[0]?.format("YYYY-MM-DD 00:00:00")),
          (data.duusakhOgnoo = ognoo[1]?.format("YYYY-MM-DD 23:59:59")),
          (data.barilgiinId = barilgiinId);
        if (!!geree) {
          data.ezemshigchiinTalbainDugaar = geree?.talbainDugaar;
          data.gereeniiDugaar = geree?.gereeniiDugaar;
        }
        const method = data?._id ? updateMethod : createMethod;
        method("mashin", token, data).then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(t("Амжилттай хадгаллаа"));
            onRefresh && onRefresh();
            destroy();
          }
        });
      },
      khaaya() {
        destroy();
      },
    }),
    [form, geree]
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
      initialValues={data}
      className='space-y-2'
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 24 }}>
      <Form.Item name='_id' noStyle />
      <Form.Item label={t("Төрөл")} name='turul'>
        <Select
          onChange={(e) => {
            form.getFieldInstance("ezemshigchiinUtas").focus();
            setTurulShalgah(e);
          }}
          placeholder={t("Төрөл")}>
          {["Гэрээт", "Түрээслэгч", "Дотоод"].map((a) => (
            <Select.Option key={a} value={a}>
              {t(a)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={t("Утас")} name='ezemshigchiinUtas'>
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
        label={t("Машины дугаар")}
        name='dugaar'>
        <Input onKeyUp={focuser} placeholder={t("Машины дугаар")} />
      </Form.Item>
      <Form.Item label={t("Нэр")} name='ezemshigchiinNer'>
        <Input onKeyUp={focuser} placeholder={t("Нэр")} />
      </Form.Item>
      <Form.Item label={t("Тайлбар")} name='tailbar'>
        <Input onKeyUp={focuser} placeholder={t("Тайлбар")} />
      </Form.Item>
      {turulShalgah === "Гэрээт" && (
        <Form.Item label={t("Огноо")}>
          <DatePicker.RangePicker
            onClick={(e) => e.stopPropagation()}
            className='flex w-full  rounded-md md:w-auto'
            size='middle'
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
