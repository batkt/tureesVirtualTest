import React, { useImperativeHandle } from "react";
import { Form, Input } from "antd";
import { toast } from "sonner";
import TextArea from "antd/lib/input/TextArea";
import uilchilgee from "services/uilchilgee";
import { t } from "i18next";
function SanalKhuseltIlgeekh({ destroy, ajiltan }, ref) {
  const [form] = Form.useForm();
  useImperativeHandle(
    ref,
    () => ({
      ilgeeye() {
        form.submit();
      },
      khaaya() {
        destroy();
      },
    }),
    [form]
  );
  function sanalYwuulya() {
    const ilgeekhOgogdol = form.getFieldsValue();
    ilgeekhOgogdol.ajiltniiNer = ajiltan?.ner;
    ilgeekhOgogdol.ajiltniiId = ajiltan?._id;
    ilgeekhOgogdol.baiguullagiinId = ajiltan?.baiguullagiinId;
    ilgeekhOgogdol.baiguullagiinNer = ajiltan?.baiguullagiinNer;
    ilgeekhOgogdol.utas = ajiltan?.utas;
    ilgeekhOgogdol.turul = "DotoodSystemes";
    uilchilgee()
      .post(
        "https://admin.zevtabs.mn/api/kholbooBarikhKhadgalya",
        ilgeekhOgogdol
      )
      .then((response) => {
        if (response.data === "Amjilttai") {
          destroy();
          toast.success("Амжилттай илгээлээ", {
            duration: 3000,
          });
        }
      })
      .catch((error) => {
        toast.error("Алдаа гарлаа", {
          description: error?.message || error,
          duration: 4000,
        });
      });
  }

  return (
    <Form autoComplete={"off"} form={form} onFinish={() => sanalYwuulya()}>
      <Form.Item
        rules={[{ required: true, message: t("Гарчиг бичнэ үү.") }]}
        name={"garchig"}
      >
        <Input placeholder={t("Гарчиг")} />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: t("Санал хүсэлтээ энд бичнэ үү.") }]}
        name={"tailbar"}
      >
        <TextArea placeholder={t("Санал хүсэлтээ бичнэ үү.")} />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(SanalKhuseltIlgeekh);
