import React, { useState } from "react"
import { Button, Input, InputNumber, notification, Switch, Form } from "antd"
import uilchilgee, { url } from "services/uilchilgee"

import { useAjiltniiJagsaalt } from "hooks/useAjiltan"

function EmailTokhirgoo({ token, baiguullaga, baiguullagaMutate }) {
  const [form] = Form.useForm()
  const [emailTokhirgoo, setEmailTokhirgoo] = useState(null)

  function tokhirgooKhadgalakh() {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: emailTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: "Амжилттай засагдлаа" })

          baiguullagaMutate()
        }
      })
  }

  return (
    <>
      <div className="col-span-12 lg:col-span-4 xxl:col-span-4 mt-5">
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
            <h2 className="font-medium text-base mr-auto dark:text-gray-200">
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
                onFinish={tokhirgooKhadgalakh}
              >
                <Form.Item
                  label="И-мэйл хаяг"
                  name="mailNevtrekhNer"
                  value={baiguullaga?.tokhirgoo?.mailNevtrekhNer}
                  onChange={({ target }) =>
                    setEmailTokhirgoo((a) => ({
                      ...(a || {}),
                      "tokhirgoo.mailNevtrekhNer": target.value,
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
                  value={baiguullaga?.tokhirgoo?.mailPassword}
                  onChange={({ target }) =>
                    setEmailTokhirgoo((a) => ({
                      ...(a || {}),
                      "tokhirgoo.mailPassword": target.value,
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
                <Button type="primary" htmlType="submit">
                  Хадгалах
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-5 xxl:col-span-4 mt-5"></div>
    </>
  )
}

export default EmailTokhirgoo
