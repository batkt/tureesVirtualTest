import React, { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Form, InputNumber, Select, Input, notification, Modal } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";
import compareFields from "tools/function/compareFields";
import { useTranslation } from "react-i18next";
import numberToWords from "tools/function/numberToWords";

function ZardalBurtgel(
  { data, destroy, baiguullagiinId, barilgiinId, token,togtmolEsekh, refresh },
  ref
) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [hideTariff,setHideTariff] = useState(false)
  const [hideCoefficent,setHideCoefficent] = useState(true)
  const [hideKhaluunus,setHideKhaluunus] = useState(true)
  const [hideKhuitenus,setHideKhuitenus] = useState(true)
  const [hideTogtmol, setHideTogtmol] = useState(true)

  function garya() {
    const values = form.getFieldsValue()
    if(compareFields(values,data,['ner','turul','tariff']))
        Modal.confirm({
          content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
          okText: t("Тийм"),
          cancelText: t("Үгүй"),
          onOk: destroy})
    else
      destroy();
  }

  useEffect(()=>{
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault()
        garya()
      }
    }
    form.getFieldInstance('ner').focus()
    keyDowner()
    document.addEventListener("keyup", keyUp);
    return ()=>document.removeEventListener("keyup", keyUp);
  },[])

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const ugugdul = form.getFieldsValue();

        const method = ugugdul?._id ? updateMethod : createMethod;
        ugugdul["barilgiinId"] = barilgiinId;
        ugugdul["baiguullagiinId"] = baiguullagiinId;
        ugugdul["bodokhArga"] = (ugugdul.ner === "Халуун ус" || ugugdul.ner === "Хүйтэн ус" || ugugdul.ner?.includes("Цахилгаан")) ? "Khatuu" : undefined; 
        method("ashiglaltiinZardluud", token, { ...data, ...ugugdul }).then(
          ({ data }) => {
            if (data === "Amjilttai") {
              notification.success({ message: t("Амжилттай хадгаллаа") });
              refresh();
              destroy();
            }
          }
        );
      },
      khaaya() {
        garya();
      },
    }),
    [form]
  );

  const focuser = useCallback((e)=>{
    if(e.key === 'Enter'){
      e.preventDefault()
      switch (e.target.id) {
        case 'ner':
          form.getFieldInstance('turul').focus()
          break;
        case 'turul':
          form.getFieldInstance('tariff').focus()
          form.getFieldInstance('tariff').select()
          break;
        default:
          break;
      }
    }
  },[])

  const keyDowner = useCallback((e)=>{
    var valueNer = form.getFieldValue('ner');
    setHideTogtmol(valueNer !== "Газ");
    setHideCoefficent(!valueNer?.includes("Цахилгаан"));
    setHideKhaluunus(valueNer !== "Халуун ус");
    setHideKhuitenus(valueNer !== "Халуун ус" && valueNer !== "Хүйтэн ус");
    setHideTariff(valueNer === "Халуун ус" || valueNer === "Хүйтэн ус");
  },[])

  function onChangeTariff(e) {
    form.setFieldValue("tariffUsgeer", numberToWords(e,
      { fixed: 2, suffix: "n" },
      "төгрөг",
      "мөнгө"
    ));
  }

  function onChangeUsTariff(e) {
    form.setFieldValue("tariff", e);
    form.setFieldValue("tariffUsgeer", numberToWords(e,
      { fixed: 2, suffix: "n" },
      "төгрөг",
      "мөнгө"
    ));
  }

  return (
    <Form
      form={form}
      autoComplete={"off"}
      initialValues={data}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item hidden name="_id"></Form.Item>
      <Form.Item label={t("Нэр")} name="ner">
        <Input onKeyUp={focuser} onChange={keyDowner}/>
      </Form.Item>
      <Form.Item label={t("Нэгж")} name="turul">
        {togtmolEsekh ? <Select onChange={(v)=> {
            form.getFieldInstance('tariff').focus()
            form.getFieldInstance('tariff').select()
            setHideTariff(v === 'Дурын')
          }}>
          <Select.Option key="Тогтмол" value="Тогтмол">
            {t("Тогтмол")}
          </Select.Option>
          <Select.Option key="Дурын" value="Дурын">
            {t("Дурын")}
          </Select.Option>
        </Select> : <Select onChange={(v) => { setHideTogtmol(v !== "кг"); }} onKeyUp={focuser}>
          <Select.Option key="кг" value="кг">
            {t("кг")}
          </Select.Option>
          <Select.Option key="кВт" value="кВт">
            {t("кВт")}
          </Select.Option>
          <Select.Option key="1м3" value="1м3">
            1{t("м")}<sup>3</sup>
          </Select.Option>
          <Select.Option key="1м3/талбай" value="1м3/талбай">
            1{t("м")}<sup>3</sup>/талбай
          </Select.Option>
          <Select.Option key="1м2" value="1м2">
            1{t("м")}<sup>2</sup>
          </Select.Option>
        </Select>}
      </Form.Item>
      <Form.Item label={t("Тогтмол")} name="togtmolUtga" hidden={hideTogtmol}>
        <InputNumber
          defaultValue={1}
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />     
      </Form.Item>
     <Form.Item label={t("КВЦТ")} name="tsakhilgaanUrjver" hidden={hideCoefficent}>
        <InputNumber
          defaultValue={1}
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />     
      </Form.Item>
      <Form.Item label={t("Цэвэр усны тариф")} name="tseverUsDun" hidden={hideKhuitenus}>
        <InputNumber
          onChange={(e) => onChangeUsTariff(e)}
          min={0}
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label={t("Бохир усны тариф")} name="bokhirUsDun" hidden={hideKhuitenus}>
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label={t("Ус халаасны тариф")} name="usKhalaasniiDun" hidden={hideKhaluunus}>
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
     <Form.Item label={t("Тариф")} name="tariff" hidden={hideTariff}>
        <InputNumber
          onChange={(e) => onChangeTariff(e)}
          min={0}
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label={t("Тариф үсгээр")} name="tariffUsgeer" hidden={hideTariff}>
        <Input
          disabled={true}
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item label={t("Суурь хураамж")} name="suuriKhuraamj" hidden={hideTariff}>
        <InputNumber
            min={0}
            style={{ width: "100%" }}
            formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(ZardalBurtgel);
