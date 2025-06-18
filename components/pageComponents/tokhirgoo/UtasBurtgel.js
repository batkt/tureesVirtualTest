import React, { useEffect, useImperativeHandle, useState } from "react";
import {
  Form,
  InputNumber,
  notification,
  Modal,
  Radio,
  Button,
  Select,
  Space,
  Input,
  Switch,
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

  useEffect(() => {
    if (baiguullaga?.tokhirgoo?.msgAvakhTurul) {
      if (baiguullaga.tokhirgoo.msgAvakhTurul === "bugd") {
        form.setFieldValue("system", true);
        form.setFieldValue("dans", true);
      }
      if (baiguullaga.tokhirgoo.msgAvakhTurul === "system") {
        form.setFieldValue("system", true);
      }
      if (baiguullaga.tokhirgoo.msgAvakhTurul === "dans") {
        form.setFieldValue("dans", true);
      }
    }
  }, [baiguullaga.tokhirgoo.msgAvakhTurul]);

  const handleSwitchChange = () => {
    const systemChecklsen = form.getFieldValue("system");
    const dansChecklsen = form.getFieldValue("dans");
    if (systemChecklsen && dansChecklsen) {
      setMsgAvakhTurul("bugd");
    } else if (systemChecklsen) {
      setMsgAvakhTurul("system");
    } else if (dansChecklsen) {
      setMsgAvakhTurul("dans");
    } else {
      setMsgAvakhTurul("");
    }
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
      msgAvakhTsag: formValues.msgAvakhTsag,
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
      initialValues={baiguullaga?.tokhirgoo}
      autoComplete={"off"}
    >
      <Form.List name="utasnuud">
        {(fields, { add, remove }) => (
          <div className="flex flex-col gap-2">
            <div
              className="!max-h-[300px] !overflow-auto"
              style={{ width: "100%" }}
            >
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
                  align="baseline"
                >
                  <Form.Item
                    style={{ minWidth: "293px" }}
                    {...restField}
                    name={[name, "utas"]}
                    rules={[
                      {
                        required: true,
                        message: "Утасны дугаар оруулаагүй байна.",
                      },
                    ]}
                  >
                    <InputNumber
                      maxLength={8}
                      style={{
                        width: "100%",
                      }}
                      placeholder="Утасны дугаар"
                    />
                  </Form.Item>
                  <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full fill-current p-2 text-white dark:bg-red-600">
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                </Space>
              ))}
            </div>
            <Form.Item className="flex justify-center">
              <Button
                className="!text-gray-400 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400"
                // className='!w-[100%]'
                style={{ minWidth: "320px" }}
                type="dashed"
                onClick={() => add()}
                // block
                icon={
                  <PlusOutlined className="!text-gray-400 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400" />
                }
              >
                <div className="!text-gray-400 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400">
                  Дугаар нэмэх
                </div>
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
      <div className="flex !max-h-[300px] w-full justify-center !overflow-auto">
        <Form.Item
          style={{ minWidth: "320px" }}
          label={t("Хүлээн авах цаг")}
          name="msgAvakhTsag"
        >
          <Select placeholder="Хүлээн авах цаг">
            <Select.Option key={"07:00"}>{"07:00"}</Select.Option>
            <Select.Option key={"09:30"}>{"09:30"}</Select.Option>
            <Select.Option key={"20:00"}>{"20:00"}</Select.Option>
            <Select.Option key={"22:00"}>{"22:00"}</Select.Option>
          </Select>
        </Form.Item>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-center">
        <Form.Item label={"Системд бүртгэгдсэн дүн"} name={"system"}>
          <Switch
            defaultChecked={
              msgAvakhTurul === "bugd" || msgAvakhTurul === "system"
                ? true
                : false
            }
            checked={
              msgAvakhTurul === "bugd" || msgAvakhTurul === "system"
                ? true
                : false
            }
            onChange={handleSwitchChange}
          />
        </Form.Item>
        <Form.Item label={"Дансанд орсон дүн"} name={"dans"}>
          <Switch
            defaultChecked={
              msgAvakhTurul === "bugd" || msgAvakhTurul === "dans"
                ? true
                : false
            }
            checked={
              msgAvakhTurul === "bugd" || msgAvakhTurul === "dans"
                ? true
                : false
            }
            onChange={handleSwitchChange}
          />
        </Form.Item>
      </div>
    </Form>
  );
}

export default React.forwardRef(UtasBurtgel);
