import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Form, Input, message, Modal, Select } from "antd";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import uilchilgee from "services/uilchilgee";
import compareFields from "tools/function/compareFields";
import { t } from "i18next";

function MashinBurtgel(
  { data, barilgiinId, token, destroy, onRefresh, mashinBurtgekhButtonId },
  ref
) {
  const [form] = Form.useForm();
  const [geree, setGeree] = useState(null);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const data = form.getFieldsValue();
        data.barilgiinId = barilgiinId;
        if(!!geree){
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
      className="space-y-2"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item name="_id" noStyle />
      <Form.Item label={t("Төрөл")} name="turul">
        <Select
          onChange={() => form.getFieldInstance("ezemshigchiinUtas").focus()}
          placeholder={t("Төрөл")}
        >
          {["Гэрээт", "Түрээслэгч", "Дотоод"].map((a) => (
            <Select.Option key={a} value={a}>
              {t(a)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={t("Утас")} name="ezemshigchiinUtas">
        <Input onKeyUp={focuser} placeholder={t("Утас")} onChange={gereeAvya} />
      </Form.Item>
      <Form.Item label={t("Машины дугаар")} name="dugaar">
        <Input onKeyUp={focuser} placeholder={t("Машины дугаар")} />
      </Form.Item>
      <Form.Item label={t("Нэр")} name="ezemshigchiinNer">
        <Input onKeyUp={focuser} placeholder={t("Нэр")} />
      </Form.Item>
      <Form.Item label={t("Тайлбар")} name="tailbar">
        <Input onKeyUp={focuser} placeholder={t("Тайлбар")} />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(MashinBurtgel);
