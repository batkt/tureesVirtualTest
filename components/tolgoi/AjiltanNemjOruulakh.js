import React, { useImperativeHandle } from "react";
import { Form, Input } from "antd";
const { Password } = Input;
function AjiltanNemjOruulakh({ ajiltanNemya, destroy }, ref) {
  const [form] = Form.useForm();
  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        ajiltanNemya(form.getFieldsValue());
      },
      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  return (
    <Form
      autoComplete={"off"}
      form={form}
      onKeyDown={(e) => {
        if (e.key === "Enter") ajiltanNemya(form.getFieldsValue());
      }}
    >
      <Form.Item name="mail">
        <h2 className="intro-x text-center text-2xl font-bold dark:text-gray-300 xl:text-3xl ">
          Хяналт
        </h2>
      </Form.Item>
      <Form.Item name="mail">
        <Input placeholder="Нэвтрэх нэр" type="email" className="login-input" />
      </Form.Item>
      <Form.Item name="nuutsUg">
        <Password placeholder="Нууц үг" className="login-input" />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(AjiltanNemjOruulakh);
