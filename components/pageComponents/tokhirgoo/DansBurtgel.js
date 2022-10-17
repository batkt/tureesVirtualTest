import React, { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Form, InputNumber, Select, Input, notification, Switch, Modal } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";

function DansBurtgel(
  { data, destroy, baiguullagiinId, barilgiinId, token, dansMutate },
  ref
) {
  const [form] = Form.useForm();
  const [bank, setBank] = useState(data?.bank);

  function garya() {
    const values = form.getFieldsValue()
    values["barilgiinId"] = barilgiinId;
    values["baiguullagiinId"] = baiguullagiinId;
    if(JSON.stringify(data) !== JSON.stringify(values))
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
    form.getFieldInstance('bank').focus()
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

        method("dans", token, { ...data, ...ugugdul }).then(({ data }) => {
          if (data === "Amjilttai") {
            notification.success({ message: "Амжилттай хадгаллаа" });
            dansMutate();
            destroy();
          }
        });
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
        case 'bank':
          form.getFieldInstance('dugaar').focus()
          form.getFieldInstance('dugaar').select()
          break;
        case 'dugaar':
          form.getFieldInstance('dansniiNer').focus()
          form.getFieldInstance('dansniiNer').select()
          break;
        case 'dansniiNer':
          form.getFieldInstance('valyut').focus()
          break;
        default:
          break;
      }
    }
  },[]);

  return (
    <Form
      form={form}
      initialValues={data}
      labelCol={{ span: 10 }}
      autoComplete={"off"}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item hidden name="_id"></Form.Item>
      <Form.Item label="Банкны нэр" name="bank">
        <Select onSelect={setBank} onKeyUp={focuser}>
          <Select.Option key="khanbank" value="khanbank">
            Хаан банк
          </Select.Option>
          <Select.Option key="tdb" value="tdb">
            Худалдаа хөгжилийн банк
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Дансны дугаар" name="dugaar">
        <InputNumber style={{ width: "100%" }} onKeyUp={focuser}/>
      </Form.Item>
      <Form.Item label="Дансны нэр" name="dansniiNer" > 
        <Input onKeyUp={focuser}/>
      </Form.Item>
      <Form.Item label="Валют" name="valyut" >
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
