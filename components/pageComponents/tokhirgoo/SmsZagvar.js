import React, { useEffect, useImperativeHandle } from "react";
import { Form, Input, notification } from "antd";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useTranslation } from "react-i18next";

function SmsZagvar(
  { data, destroy, token, baiguullagaMutate, baiguullaga },
  ref
) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      async khadgalya() {
        try {
          let tokhirgoo = form.getFieldsValue();
          const response = await uilchilgee(token).post(
            "/baiguullagaTokhirgooZasya",
            {
              tokhirgoo,
            }
          );

          if (response.data === "Amjilttai") {
            baiguullagaMutate();
            notification.success({ message: t("Амжилттай хадгаллаа") });
            destroy();
          }
        } catch (e) {
          aldaaBarigch(e);
        }
      },

      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  return (
    <Form
      initialValues={{
        zogsoolMsgZagvar: baiguullaga?.tokhirgoo?.zogsoolMsgZagvar,
      }}
      form={form}
      autoComplete="off"
    >
      <Form.Item name="zogsoolMsgZagvar">
        <Input.TextArea placeholder="Загвар" />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(SmsZagvar);
