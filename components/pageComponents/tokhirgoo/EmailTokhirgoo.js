import React, { useState, useEffect } from "react";
import { Button, Input, InputNumber, notification, Switch, Form } from "antd";
import uilchilgee, { url } from "services/uilchilgee";

import { useAjiltniiJagsaalt } from "hooks/useAjiltan";

function EmailTokhirgoo({ token, baiguullaga, baiguullagaMutate }) {
  const [form] = Form.useForm();
  const [emailTokhirgoo, setEmailTokhirgoo] = useState(null);

  function tokhirgooKhadgalakh() {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: emailTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: "Амжилттай засагдлаа" });
          baiguullagaMutate();
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
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-4">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Нэхэмжлэл и-мэйлээр илгээх тохиргоо
            </h2>
          </div>

          <div className="box">
            <div className="flex  p-5">
              <Form
                form={form}
                name="basic"
                labelCol={{
                  span: 10,
                }}
                wrapperCol={{
                  span: 14,
                }}
                autoComplete={"off"}
                onFinish={tokhirgooKhadgalakh}
              >
                <Form.Item
                  label="И-мэйл хаяг"
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
                  label="Нэвтрэх нууц үг"
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
                  label="Хост"
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
                  label="Порт"
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
                <Button type="primary" htmlType="submit">
                  Хадгалах
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-5"></div>
    </>
  );
}

export default EmailTokhirgoo;
