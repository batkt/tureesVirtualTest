import React, { useEffect, useImperativeHandle } from "react";
import { Form, InputNumber, notification } from "antd";
import { t } from "i18next";
import uilchilgee from "services/uilchilgee";

function Tseneglekh({ data, destroy, token, barilgiinId, mutate }, ref) {
  const [form] = Form.useForm();

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
    [form]
  );

  function khadgalya(formData) {
    const yavuulakhData = {
      barilgiinId: barilgiinId,
      mashiniiId: formData._id,
      dun: formData.dun,
    };
    if (yavuulakhData.mashiniiId && yavuulakhData.dun) {
      uilchilgee(token)
        .post("/tsenegleltKhiiy", yavuulakhData)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            notification.success({
              message: "Амжилттай хадгалагдлаа",
              duration: 2,
            });
            mutate();
            destroy();
          }
        });
    } else {
      return notification.warn({ message: "Талбар дутуу байна", duration: 2 });
    }
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    form.getFieldInstance("dun").focus();
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <Form
      form={form}
      onFinish={khadgalya}
      initialValues={data}
      className="space-y-2"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item hidden name={"_id"} />
      <Form.Item
        rules={[
          {
            required: true,
            message: "Цэнэглэх дүн оруулна уу",
          },
        ]}
        name={"dun"}
        label={"Цэнэглэх дүн:"}
      >
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          min={0}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder={t("Цэнэглэх дүн оруулна уу...")}
        />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(Tseneglekh);
