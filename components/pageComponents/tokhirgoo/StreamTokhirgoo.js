import React, { useImperativeHandle, useState } from "react";
import { Form, Input, Switch, notification } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import { aldaaBarigch } from "services/uilchilgee";
import { t } from "i18next";

/**
 * khaalga.turul Select.Option value(Орох, Гарах) гэснийг өөрчилж болохгүй
 * Parking.н backend дээр (Орох, Гарах) гэж хадгалсан утгаар хайж байгаа
 */

function StreamTokhirgoo(
  { destroy, token, data, setUnshijBaina, refresh },
  ref
) {
  const [form] = Form.useForm();
  const [socketEsekh, setSocketEsekh] = useState(
    data?.tokhirgoo?.socketEsekh || false
  );

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        setUnshijBaina(true);
        let tokhirgoo = form.getFieldsValue();
        let body = {
          ...data,
          tokhirgoo: {
            ...tokhirgoo,
            ...(tokhirgoo &&
              tokhirgoo.socketEsekh === undefined && {
                socketEsekh: socketEsekh,
              }),
          },
          _id: data?._id,
        };
        updateMethod("parking", token, body)
          .then(({ data }) => {
            if (data === "Amjilttai") {
              notification.success({ message: t("Амжилттай хадгаллаа") });
              destroy();
              refresh();
            }
          })
          .catch((e) => {
            aldaaBarigch(e);
          });
        setTimeout(() => {
          setUnshijBaina(false);
          destroy();
        }, 1000);
      },
      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  const socketShalgakh = Form.useWatch("socketEsekh", form);

  return (
    <Form
      labelAlign="left"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      autoComplete="off"
      initialValues={data?.tokhirgoo}
    >
      <Form.Item
        name={"socketEsekh"}
        label={"Socket эсэх"}
        rules={[{ required: true, message: t("Чеклэнэ үү") }]}
      >
        <Switch checked={socketEsekh} onChange={(v) => setSocketEsekh(v)} />
      </Form.Item>
      {socketShalgakh !== true ? (
        <div>
          <Form.Item
            rules={[{ required: true, message: t("Камер USER оруулна уу") }]}
            name={"USER"}
            label={"USER"}
            autoComplete="off"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: t("Камер PASSWD оруулна уу") }]}
            name={"PASSWD"}
            label={"PASSWD"}
            autoComplete="off"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: t("Камер ROOT оруулна уу") }]}
            name={"ROOT"}
            label={"ROOT"}
            autoComplete="off"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: t("Камер PORT оруулна уу") }]}
            name={"PORT"}
            label={"PORT"}
            autoComplete="off"
          >
            <Input />
          </Form.Item>
        </div>
      ) : (
        <div>
          <Form.Item
            name={"STREAMPORT"}
            label={"STREAMPORT"}
            rules={[
              { required: true, message: t("Камер STREAMPORT оруулна уу") },
            ]}
            autoComplete="off"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"TOKEN"}
            label={"TOKEN"}
            rules={[{ required: true, message: t("Камер TOKEN оруулна уу") }]}
            autoComplete="off"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"CHANNEL"}
            label={"CHANNEL"}
            rules={[{ required: true, message: t("Камер CHANNEL оруулна уу") }]}
            autoComplete="off"
          >
            <Input />
          </Form.Item>
        </div>
      )}
    </Form>
  );
}

export default React.forwardRef(StreamTokhirgoo);
