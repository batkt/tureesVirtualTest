import React, { useState, useEffect } from "react";
import { Button, Input, InputNumber, notification, Switch, Form } from "antd";
import uilchilgee, { url } from "services/uilchilgee";

import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { useTranslation } from "react-i18next";

function EmailTokhirgoo({ token, baiguullaga, baiguullagaMutate, setSongogdsonTsonkhniiIndex }) {
  const { t } = useTranslation()
  const [form] = Form.useForm();
  const [emailTokhirgoo, setEmailTokhirgoo] = useState(null);

  function tokhirgooKhadgalakh() {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: emailTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай засагдлаа") });
          baiguullagaMutate();
          setSongogdsonTsonkhniiIndex(6)
        }
      });
  }

  useEffect(() => {
    if (baiguullaga !== undefined) {
      form.setFieldsValue({
        mailNevtrekhNer: baiguullaga?.tokhirgoo?.mailNevtrekhNer,
        mailPassword: baiguullaga?.tokhirgoo?.mailPassword,
        mailHost: baiguullaga?.tokhirgoo?.mailHost,
        mailPort: baiguullaga?.tokhirgoo?.mailPort,
      });
    }
  }, [baiguullaga]);

  return (
    <>
      <div className="xl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Нэхэмжлэл и-мэйлээр илгээх тохиргоо")}
            </h2>
          </div>

          <div className="box">
            <div className="flex p-5  ">
              <Form
                form={form}
                name="basic"
                labelCol={{
                  span: 12,
                }}
                wrapperCol={{
                  span: 12,
                }}
                autoComplete={"off"}
                onFinish={tokhirgooKhadgalakh}
              >
                <Form.Item
                  label={t("И-мэйл хаяг")}
                  name="mailNevtrekhNer"
                  onChange={({ target }) =>
                    setEmailTokhirgoo((a) => ({
                      ...(a || {}),
                      mailNevtrekhNer: target.value,
                    }))
                  }
                  rules={[
                    {
                      type: "email",
                      required: true,
                      message: "gmail хаяг оруулна уу",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={t("Нэвтрэх нууц үг")}
                  name="mailPassword"
                  onChange={({ target }) =>
                    setEmailTokhirgoo((a) => ({
                      ...(a || {}),
                      mailPassword: target.value,
                    }))
                  }
                  rules={[
                    {
                      required: true,
                      message: "Нууц үг оруулна уу",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label={t("Хост")}
                  name="mailHost"
                  onChange={({ target }) =>
                    setEmailTokhirgoo((a) => ({
                      ...(a || {}),
                      mailHost: target.value,
                    }))
                  }
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={t("Порт")}
                  name="mailPort"
                  onChange={({ target }) =>
                    setEmailTokhirgoo((a) => ({
                      ...(a || {}),
                      mailPort: target.value,
                    }))
                  }
                >
                  <Input />
                </Form.Item>
                <div className="flex w-full justify-end">
                  <Button type="primary" htmlType="submit">
                    {t("Хадгалах")}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmailTokhirgoo;
