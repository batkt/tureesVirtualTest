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

function MashinBurtgel(
  { data, barilgiinId, token, destroy, onRefresh, mashinBurtgekhButtonId },
  ref
) {
  const [form] = Form.useForm();

  const [geree, setGeree] = useState();

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const data = form.getFieldsValue();
        data.barilgiinId = barilgiinId;
        data.ezemshigchiinTalbainDugaar = geree.talbainDugaar;
        data.gereeniiDugaar = geree.gereeniiDugaar;
        const method = data?._id ? updateMethod : createMethod;
        method("mashin", token, data).then(({ data }) => {
          if (data === "Amjilttai") {
            message.success("Амжилттай хадгаллаа");
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
        content: `Та хадгалахгүй гарахдаа итгэлтэй байна уу?`,
        okText: "Тийм",
        cancelText: "Үгүй",
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
        case "turul":
          form.getFieldInstance("ezemshigchiinUtas").focus();
          break;
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
      <Form.Item label="Төрөл" name="turul">
        <Select onKeyUp={focuser} placeholder="Төрөл">
          {["Гэрээт", "Түрээслэгч", "Дотоод"].map((a) => (
            <Select.Option key={a} value={a}>
              {a}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Утас" name="ezemshigchiinUtas">
        <Input onKeyUp={focuser} placeholder="Утас" onChange={gereeAvya} />
      </Form.Item>
      <Form.Item label="Машины дугаар" name="dugaar">
        <Input onKeyUp={focuser} placeholder="Машины дугаар" />
      </Form.Item>
      <Form.Item label="Нэр" name="ezemshigchiinNer">
        <Input onKeyUp={focuser} placeholder="Нэр" />
      </Form.Item>
      <Form.Item label="Регистр" name="ezemshigchiinRegister">
        <Input onKeyUp={focuser} placeholder="Регистр" />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(MashinBurtgel);
