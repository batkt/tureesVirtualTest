import React, { useEffect, useImperativeHandle } from "react";
import { Form, Input, InputNumber, Modal } from "antd";
import formatNumber from "tools/function/formatNumber";
function DunZasvar(
  {
    data,
    index,
    setNekhemjleliinJagsaalt,
    destroy,
    nekhemjleliinJagsaalt,
    setWaiting,
  },
  ref
) {
  const [form] = Form.useForm();

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const nekhemjlelChanged = form.getFieldsValue();
        nekhemjleliinJagsaalt[index] = {
          ...nekhemjleliinJagsaalt[index],
          ...nekhemjlelChanged,
        };

        setNekhemjleliinJagsaalt([...nekhemjleliinJagsaalt]);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  function garya() {
    Modal.confirm({
      content: `Та гарахдаа итгэлтэй байна уу?`,
      okText: "Тийм",
      cancelText: "Үгүй",
      onOk: destroy,
    });
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <Form
      form={form}
      initialValues={data}
      labelCol={{ span: 12 }}
      wrapperCol={{ span: 14 }}
      autoComplete={"off"}
    >
      <Form.Item
        label="Өмнөх хуримтлагдсан өр төлбөр"
        name="umnukhSariinUrTulbur"
      >
        <InputNumber
          className="w-[200px]"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Энэ сард төлөх дүн" name="eneSardTulukhDun">
        <InputNumber
          className="w-[200px]"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          precisionc={2}
        />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(DunZasvar);
