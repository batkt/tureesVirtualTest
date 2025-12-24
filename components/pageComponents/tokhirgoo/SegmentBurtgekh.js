import React, { useCallback, useEffect, useImperativeHandle } from "react";
import { Form, Select, Input, Button, notification, Modal } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { aldaaBarigch } from "services/uilchilgee";
import compareFields from "tools/function/compareFields";
import { useTranslation } from "react-i18next";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 0 },
  },
};

function SegmentBurtgekh({ data, destroy, token, refresh }, ref) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  function garya() {
    const values = form.getFieldsValue();
    if (compareFields(values, data, ["ner", "turul", "tariff"]))
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
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

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const utga = form.getFieldsValue();
        const method = data?._id ? updateMethod : createMethod;
        method("segment", token, { ...data, ...utga })
          .then(({ data }) => {
            if (data === "Amjilttai") {
              notification.success({ message: t("Амжилттай хадгаллаа") });
              refresh();
              destroy();
            }
          })
          .catch((e) => {
            aldaaBarigch(e);
          });
      },
      khaaya() {
        garya();
      },
    }),
    [form]
  );

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "turul":
          form.getFieldInstance("ner").focus();
          break;
        case "ner":
          form.getFieldInstance("ner").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  return (
    <Form
      form={form}
      autoComplete="off"
      initialValues={data}
      {...formItemLayout}
    >
      <Form.Item label={t("Төрөл")} name="turul">
        <Select placeholder="Төрөл" onKeyUp={focuser}>
          <Select.Option key="khariltsagch" value="khariltsagch">
            {t("Харилцагч")}
          </Select.Option>
          <Select.Option key="talbai" value="talbai">
            {t("Талбай")}
          </Select.Option>
          <Select.Option key="geree" value="geree">
            {t("Гэрээ")}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="ner"
        label={t("Нэр")}
        rules={[
          {
            required: true,
            message: t("Нэр өгнө үү"),
          },
        ]}
      >
        <Input placeholder="Нэр" onKeyUp={focuser}></Input>
      </Form.Item>
      <Form.List name="utguud">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? t("Утгууд") : ""}
                required={false}
                key={field.key}
                className="mb-2"
              >
                <div className="flex items-center gap-2">
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: t("Та утга нэмэх юм уу энэ хэсгийг устагна уу."),
                      },
                    ]}
                    noStyle
                    className="flex-1 mb-0"
                  >
                    <Input placeholder={t("Утга")} className="w-full" />
                  </Form.Item>

                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      className="text-lg text-gray-500 transition-colors hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 flex-shrink-0 cursor-pointer"
                      onClick={() => remove(field.name)}
                    />
                  )}
                </div>
              </Form.Item>
            ))}
            <Form.Item {...formItemLayoutWithOutLabel} className="mb-0">
              <Button
                type="dashed"
                onClick={() => add()}
                className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                icon={<PlusOutlined />}
              >
                {t("Утга нэмэх")}
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
}

export default React.forwardRef(SegmentBurtgekh);
