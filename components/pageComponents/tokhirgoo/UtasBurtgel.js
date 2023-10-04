import React, { useEffect, useImperativeHandle, useState } from "react";
import {
  Form,
  InputNumber,
  notification,
  Modal,
  Radio,
  Button,
  Space,
  Input,
} from "antd";
import compareFields from "tools/function/compareFields";
import { useTranslation } from "react-i18next";
import uilchilgee from "services/uilchilgee";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "services/auth";

function UtasBurtgel(
  { data, destroy, token, baiguullaga, baiguullagaMutate },
  ref
) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [msgAvakhTurul, setMsgAvakhTurul] = useState(
    baiguullaga.tokhirgoo.msgAvakhTurul
      ? baiguullaga.tokhirgoo.msgAvakhTurul
      : ""
  );

  const handleRadioChange = (e) => {
    setMsgAvakhTurul(e.target.value);
  };

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
        onFinish();
      },
      khaaya() {
        garya();
      },
    }),
    [msgAvakhTurul]
  );

  useEffect(() => {
    if (
      baiguullaga.tokhirgoo.msgAvakhDugaar &&
      baiguullaga.tokhirgoo.msgAvakhDugaar.length > 0
    ) {
      const initialValues = baiguullaga.tokhirgoo.msgAvakhDugaar.map(
        (value) => ({
          utas: value,
        })
      );

      form.setFieldsValue({ utasnuud: initialValues });
    }
  }, [baiguullaga.tokhirgoo.msgAvakhDugaar]);

  function onFinish() {
    const formValues = form.getFieldsValue();
    const utasnuudArray = formValues.utasnuud.map((item) =>
      item.utas.toString()
    );

    var medegdelTokhirgoo = {
      msgAvakhTurul,
      msgAvakhDugaar: utasnuudArray,
    };
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: medegdelTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай хадгаллаа") });
          baiguullagaMutate();
          destroy();
        }
      });
  }

  return (
    <Form
      style={{ width: "100%" }}
      form={form}
      onFinish={onFinish}
      initialValues={data}
      autoComplete={"off"}>
      <Form.List name='utasnuud'>
        {(fields, { add, remove }) => (
          <div className='flex flex-col gap-2'>
            <div
              className='!max-h-[300px] !overflow-auto'
              style={{ width: "100%" }}>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  width={"100%"}
                  key={key}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                  align='baseline'>
                  <Form.Item
                    style={{ minWidth: "293px" }}
                    {...restField}
                    name={[name, "utas"]}
                    rules={[
                      {
                        required: true,
                        message: "Утасны дугаар оруулаагүй байна.",
                      },
                    ]}>
                    <InputNumber
                      maxLength={8}
                      style={{
                        width: "100%",
                      }}
                      placeholder='Утасны дугаар'
                    />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
            </div>
            <Form.Item className='flex justify-center'>
              <Button
                // className='!w-[100%]'
                style={{ minWidth: "320px" }}
                type='dashed'
                onClick={() => add()}
                // block
                icon={<PlusOutlined className='text-black dark:text-white' />}>
                <div className='text-black dark:text-white'>Дугаар нэмэх</div>
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
      <div className='flex flex-wrap sm:justify-center'>
        <Radio.Group onChange={handleRadioChange} value={msgAvakhTurul}>
          <Radio value='system'>Системд бүртгэгдсэн дүн</Radio>
          <Radio value='dans'>Дансанд орсон дүн</Radio>
        </Radio.Group>
      </div>
    </Form>
  );
}

export default React.forwardRef(UtasBurtgel);
