import React, { useEffect, useImperativeHandle, useRef } from "react";
import { Form, Input, message, Modal, notification } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";
import Zasvar from "./zasvar";
import compareFields from "tools/function/compareFields";
import { t } from "i18next";

const Burtgel = React.forwardRef(
  (
    {
      read,
      barilgiinId,
      destroy,
      token,
      data,
      onRefresh,
      turul,
      setContent,
      setWaiting,
    },
    ref
  ) => {
    const [form] = Form.useForm();
    const zagvarFormRef = useRef();

    function garya() {
      try {
        const values = form.getFieldsValue();
        const hasChanges = compareFields(values, data, ["ner", "text"]);

        if (hasChanges) {
          Modal.confirm({
            content: t("Та хадгалахгүй арахдаа итгэлтэй байна уу?"),
            okText: t("Тийм"),
            cancelText: t("Үгүй"),
            onOk: () => {
              destroy();
            },
          });
        } else {
          destroy();
        }
      } catch (error) {
        notification(error);
      }
    }

    useImperativeHandle(
      ref,
      () => ({
        khadgalya() {
          const formValues = form.getFieldsValue();

          const editorContent = zagvarFormRef.current?.getContent() || "";

          const zagvar = {
            ner: formValues.ner || "",
            text: editorContent,
            mail: editorContent,
          };

          if (!!zagvar.ner) {
            const method = data?._id ? updateMethod : createMethod;
            method("mailiinZagvar", token, {
              barilgiinId,
              ...data,
              ...zagvar,
              turul,
            })
              .then(({ data: responseData }) => {
                if (responseData === "Amjilttai") {
                  setWaiting(false);
                  message.success(t("Амжилттай хадгаллаа"));
                  onRefresh();
                  destroy();
                }
              })
              .catch((error) => {
                notification.error({
                  message: t("Хадгалахад алдаа гарлаа"),
                  description: error.message,
                });
                setWaiting(false);
              });
          } else {
            notification.warning({ message: t("Нэр заавал оруулна уу!") });
            setWaiting(false);
          }
        },

        khaaya() {
          destroy();
          setWaiting(false);
        },
        getContent() {
          return zagvarFormRef.current?.getContent() || "";
        },
      }),
      [
        form,
        barilgiinId,
        zagvarFormRef,
        data,
        token,
        onRefresh,
        turul,
        setWaiting,
      ]
    );

    useEffect(() => {
      if (data) {
        form.setFieldsValue({
          ner: data.ner || "",
        });
      }
    }, [data, form]);
    return (
      <Form
        form={form}
        initialValues={{
          ner: data?.ner || "",
        }}
      >
        <Form.Item name="ner">
          <Input placeholder="Нэр" />
        </Form.Item>

        <Zasvar
          ref={zagvarFormRef}
          read={read}
          data={data}
          setContent={setContent}
        />
      </Form>
    );
  }
);

export default Burtgel;
