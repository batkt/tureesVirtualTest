import React, { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Form, InputNumber, Select, Input, notification, Modal } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";
import compareFields from "tools/function/compareFields";
import { useTranslation } from "react-i18next";

function ZardalBurtgel(
  { data, destroy, baiguullagiinId, barilgiinId, token,togtmolEsekh, refresh },
  ref
) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [hideTariff,setHideTariff] = useState(false)

  function garya() {
    const values = form.getFieldsValue()
    if(compareFields(values,data,['ner','turul','tariff']))
        Modal.confirm({
          content: `Та хадгалахгүй гарахдаа итгэлтэй байна уу?`,
          okText: "Тийм",
          cancelText: "Үгүй",
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
        method("ashiglaltiinZardluud", token, { ...data, ...ugugdul }).then(
          ({ data }) => {
            if (data === "Amjilttai") {
              notification.success({ message: "Амжилттай хадгаллаа" });
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
        <Input onKeyUp={focuser}/>
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
        </Select> : <Select onKeyUp={focuser}>
          <Select.Option key="кВт" value="кВт">
            кВт
          </Select.Option>
          <Select.Option key="1м3" value="1м3">
            1м<sup>3</sup>
          </Select.Option>
          <Select.Option key="1м2" value="1м2">
            1м<sup>2</sup>
          </Select.Option>
        </Select>}
      </Form.Item>
     <Form.Item label={t("Тариф")} name="tariff" hidden={hideTariff}> 
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
