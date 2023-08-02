import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Form,
  InputNumber,
  Select,
  Input,
  notification,
  Switch,
  Modal,
  Checkbox,
} from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";
import compareFields from "tools/function/compareFields";
import { useTranslation } from "react-i18next";

function UtasBurtgel(
  { data, destroy, baiguullagiinId, barilgiinId, token, dansMutate },
  ref
) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  function garya() {
    const values = form.getFieldsValue();
    if (compareFields(values, data, ["dugaar"]))
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: destroy,
      });
    else destroy();
  }

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        destroy();
        // const ugugdul = form.getFieldsValue();

        // const method = ugugdul?._id ? updateMethod : createMethod;
        // ugugdul["barilgiinId"] = barilgiinId;
        // ugugdul["baiguullagiinId"] = baiguullagiinId;

        // method("dans", token, { ...data, ...ugugdul }).then(({ data }) => {
        //   if (data === "Amjilttai") {
        //     notification.success({ message: t("Амжилттай хадгаллаа") });
        //     dansMutate();
        //   }
        // });
      },
      khaaya() {
        garya();
      },
    }),
    [form]
  );

  return (
    <Form
      form={form}
      initialValues={data}
      labelCol={{ span: 10 }}
      autoComplete={"off"}
      wrapperCol={{ span: 14 }}>
      <Form.Item hidden name='_id'></Form.Item>
      <Form.Item label={"Утасны дугаар"} name='dugaar'>
        <InputNumber style={{ width: "100%" }} min={0} maxLength={8} />
      </Form.Item>
      <div className='flex flex-wrap sm:justify-center'>
        <Checkbox className='text-base dark:text-gray-200'>
          Системд бүртгэгдсэн дүн
        </Checkbox>
        <Checkbox className='text-base dark:text-gray-200'>
          Дансанд орсон дүн
        </Checkbox>
      </div>
    </Form>
  );
}

export default React.forwardRef(UtasBurtgel);
