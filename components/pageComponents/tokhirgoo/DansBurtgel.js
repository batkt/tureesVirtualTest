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
} from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";
import compareFields from "tools/function/compareFields";
import { useTranslation } from "react-i18next";
import useDans from "hooks/useDans";

function DansBurtgel(
  { data, destroy, baiguullagiinId, barilgiinId, token, dansMutate },
  ref
) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [bank, setBank] = useState(data?.bank);
  const { dansGaralt } = useDans(token, baiguullagiinId);

  console.log("dansGaralt", dansGaralt);

  function garya() {
    const values = form.getFieldsValue();
    if (compareFields(values, data, ["bank", "dugaar", "dansniiNer", "valyut"]))
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
    form.getFieldInstance("bank").focus();
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const ugugdul = form.getFieldsValue();

        const method = ugugdul?._id ? updateMethod : createMethod;
        ugugdul["barilgiinId"] = barilgiinId;
        ugugdul["baiguullagiinId"] = baiguullagiinId;
        var dansDavkhatssanEsekh = false;
        if (dansGaralt?.jagsaalt && dansGaralt?.jagsaalt?.length > 0) {
          for (const a of dansGaralt.jagsaalt) {
            if (ugugdul.dugaar == a.dugaar) {
              dansDavkhatssanEsekh = true;
            }
          }
        }
        if (!dansDavkhatssanEsekh) {
          method("dans", token, { ...data, ...ugugdul }).then(({ data }) => {
            if (data === "Amjilttai") {
              notification.success({ message: t("Амжилттай хадгаллаа") });
              dansMutate();
              destroy();
            }
          });
        } else {
          notification.warn({ message: "Данс давхардсан байна", duration: 3 });
        }
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
        case "bank":
          form.getFieldInstance("dugaar").focus();
          form.getFieldInstance("dugaar").select();
          break;
        case "dugaar":
          form.getFieldInstance("dansniiNer").focus();
          form.getFieldInstance("dansniiNer").select();
          break;
        case "dansniiNer":
          form.getFieldInstance("valyut").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  return (
    <Form
      form={form}
      initialValues={data}
      labelCol={{ span: 10 }}
      autoComplete={"off"}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item hidden name="_id"></Form.Item>
      <Form.Item label={t("Банкны нэр")} name="bank">
        <Select onSelect={setBank} onKeyUp={focuser}>
          <Select.Option key="khanbank" value="khanbank">
            {t("Хаан банк")}
          </Select.Option>
          <Select.Option key="tdb" value="tdb">
            {t("Худалдаа хөгжлийн банк")}
          </Select.Option>
          <Select.Option key="golomt" value="golomt">
            {t("Голомт банк")}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label={t("Дансны дугаар")} name="dugaar">
        <InputNumber style={{ width: "100%" }} min={0} onKeyUp={focuser} />
      </Form.Item>
      <Form.Item label={t("Дансны нэр")} name="dansniiNer">
        <Input onKeyUp={focuser} />
      </Form.Item>
      <Form.Item label={t("Валют")} name="valyut">
        <Select onKeyUp={focuser}>
          <Select.Option key="MNT" value="MNT">
            MNT
          </Select.Option>
          <Select.Option key="USD" value="USD">
            USD
          </Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(DansBurtgel);
