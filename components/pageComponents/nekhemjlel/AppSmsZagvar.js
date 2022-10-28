import React, { useEffect, useImperativeHandle, useState } from "react";
import { Form, Input, message, Modal } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";
import ZagvarUusgekh from "./ZagvarUusgekh";
import compareFields from "tools/function/compareFields";
import { aldaaBarigch } from "services/uilchilgee";

function ZagvarForm({ value, onChange }) {
  const [context, setContext] = useState(value);
  return (
    <ZagvarUusgekh
      value={context}
      change={setContext}
      onTextChange={onChange}
    />
  );
}

function ZagvarBurtgel(
  { barilgiinId, destroy, token, setWaiting, data, turul, onRefresh },
  ref
) {
  const [form] = Form.useForm();
  const [nekhemjlelZagvar] = React.useState({});
  function garya() {
    const values = form.getFieldsValue();
    if (compareFields(values, data, ["ner", "mail"]))
      Modal.confirm({
        content: `Та хадгалахгүй гарахдаа итгэлтэй байна уу?`,
        okText: "Тийм",
        cancelText: "Үгүй",
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
    form.getFieldInstance("ner").focus();
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const zagvar = form.getFieldsValue();
        setWaiting(true);
        nekhemjlelZagvar.barilgiinId = barilgiinId;
        const method = data?._id ? updateMethod : createMethod;
        method("nekhemjlekhiinZagvar", token, {
          turul,
          barilgiinId,
          ...data,
          ...zagvar,
        })
          .then(({ data }) => {
            if (data === "Amjilttai") {
              message.success("Амжилттай хадгаллаа");
              onRefresh();
              destroy();
              setWaiting(false);
            }
          })
          .catch((e) => {
            aldaaBarigch(e);
            setWaiting(false);
          });
      },

      khaaya() {
        destroy();
      },
    }),
    [form, barilgiinId]
  );

  return (
    <>
      <Form autoComplete={"off"} form={form} initialValues={data}>
        <Form.Item name="ner">
          <Input placeholder="Нэр" />
        </Form.Item>
        <Form.Item name="nekhemjlekh">
          <ZagvarForm />
        </Form.Item>
      </Form>
    </>
  );
}

export default React.forwardRef(ZagvarBurtgel);
