import React, { useCallback, useEffect, useImperativeHandle } from "react";
import { Form, Input, message, Modal } from "antd";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import compareFields from "tools/function/compareFields";
import { t } from "i18next";

function BlockMashinBurtgel(
  {
    data,
    ajiltan,
    barilgiinId,
    token,
    destroy,
    onRefreshBlock,
    baiguullagiinId,
  },
  ref
) {
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

  function garya() {
    const values = form.getFieldsValue();
    if (compareFields(values, data, ["dugaar", "tailbar"]))
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: destroy,
      });
    else destroy();
  }

  function onFinish() {
    const data = form.getFieldsValue();
    data.barilgiinId = data.barilgiinId ? data.barilgiinId : barilgiinId;
    data.burtgesenAjiltaniiId = ajiltan?._id;
    data.burtgesenAjiltaniiNer = ajiltan?.ner;
    const method = data?._id ? updateMethod : createMethod;
    method("blockMashin", token, data).then(({ data }) => {
      if (data === "Amjilttai") {
        toast.success(t("Амжилттай хадгаллаа"));
        onRefreshBlock && onRefreshBlock();
        destroy();
      }
    });
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    form.getFieldInstance("dugaar").focus();
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "dugaar":
          form.getFieldInstance("tailbar").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={data}
      className="space-y-2"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item name="_id" noStyle />
      <Form.Item name="barilgiinId" noStyle />
      <Form.Item
        normalize={(input) => {
          const too = input.replace(/[^0-9]/g, "").slice(0, 4);
          const useg = Array.from(input)
            .filter((a) => /[А-Яа-яөӨүҮ]/.test(a))
            .slice(0, 3)
            .join("");
          return `${too}${useg}`.toUpperCase();
        }}
        requiredMark={"optional"}
        rules={[
          {
            required: true,
            message: t("Машины дугаар бүртгэнэ үү!"),
          },
          {
            required: form.getFieldValue("dugaar")?.length > 0 && true,
            min: 6,
            max: 7,
            pattern: new RegExp(
              "[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{3}|[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{2}"
            ),
            message: t("Машины дугаар 4 тоо 2 эсвэл 3 үсэг байх ёстой"),
          },
        ]}
        label={t("Машины дугаар")}
        name="dugaar"
      >
        <Input onKeyUp={focuser} placeholder={t("Машины дугаар")} />
      </Form.Item>
      <Form.Item label={t("Тайлбар")} name="tailbar">
        <Input onKeyUp={focuser} placeholder={t("Тайлбар")} />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(BlockMashinBurtgel);
