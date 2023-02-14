import React, { forwardRef, useImperativeHandle } from "react";
import { Form, Input, Upload, Modal, message } from "antd";
import getBase64 from "tools/function/getBase64";
import uilchilgee, { url } from "../../../services/uilchilgee";
import otoFormData from "tools/function/otoFormData";
import { t } from "i18next";
const { TextArea } = Input;
const { confirm } = Modal;

const BarilgaBurtgekh = forwardRef(
  ({ ugugdul, readonly, tuvEsekh, destroy, token, salbarMutate }, ref) => {
    const [form] = Form.useForm();

    useImperativeHandle(
      ref,
      () => ({
        khadgalya() {
          var { ...baiguullagaData } = form.getFieldsValue();
          let formData = otoFormData(baiguullagaData);
          uilchilgee(token)
            .post("/baiguullaga", baiguullagaData)
            .then(({ data }) => {
              if (data === "Amjilttai") {
                message.destroy();
                message.success(t("Амжилттай хадгаллаа"));
                salbarMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }));
                destroy();
              } else {
                message.destroy();
                message.warning(t("Алдаа гарлаа"));
              }
            });
        },
        khaaya() {
          if (readonly) destroy();
          else
            confirm({
              title: t("Анхаар"),
              okText: "Тийм",
              cancelText: "Үгүй",
              content: "Та хадгалахгүй гарахдаа итгэлтэй байна уу",
              onOk: destroy,
            });
        },
      }),
      [form]
    );

    function beforeUpload(file) {
      document.getElementById("zurag").classList.add("visible");
      function after(base64) {
        let image = document.getElementById("zurag");
        let stringutga = document.getElementById("string-utga");
        image.classList.remove("hidden");
        stringutga.classList.add("hidden");
        image.src = base64;
      }
      getBase64(file, after);
      return false;
    }

    return (
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 24 }}
        initialValues={ugugdul}
        layout="horizontal"
        size="small"
      >
        {tuvEsekh && (
          <Form.Item
            label="Лого"
            name="logo"
            rules={[
              {
                required: ugugdul?.zurgiinNer ? false : true,
                message: t("Лого заавал оруулна уу!"),
              },
            ]}
          >
            <Upload
              name="logo"
              multiple={false}
              showUploadList={false}
              listType="picture-card"
              beforeUpload={beforeUpload}
            >
              <img
                id="zurag"
                className={`${ugugdul?.zurgiinNer ? "" : "hidden"} h-24 w-24`}
                alt={ugugdul?.ner}
                src={
                  ugugdul?.zurgiinNer
                    ? `${url}/logoAvya/${ugugdul?.zurgiinNer}`
                    : "/car.png"
                }
              />
              <span
                id="string-utga"
                className={`${ugugdul?.zurgiinNer ? "hidden" : ""}`}
              >
                {t("Лого оруулах")}
              </span>
            </Upload>
          </Form.Item>
        )}
        <Form.Item
          label={t("Байгууллагын нэр")}
          name="ner"
          rules={[{ required: true, message: t("Нэр заавал оруулна уу!") }]}
        >
          <Input disabled={readonly} />
        </Form.Item>
        <Form.Item
          label={t("Утас")}
          name="utas"
          rules={[{ required: true, message: t("Утас заавал оруулна уу!") }]}
        >
          <Input disabled={readonly} type={"tel"} />
        </Form.Item>
        <Form.Item
          label={t("Хаяг")}
          name="khayag"
          rules={[{ required: true, message: t("Хаяг заавал оруулна уу!") }]}
        >
          <TextArea disabled={readonly} />
        </Form.Item>
      </Form>
    );
  }
);

export default BarilgaBurtgekh;
