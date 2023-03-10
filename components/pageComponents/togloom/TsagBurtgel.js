import React, { useEffect, useImperativeHandle, useState } from "react";
import { Form, Input, message, Select, TimePicker, InputNumber, Switch } from "antd";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { t } from "i18next";
import moment from "moment"
import uilchilgee from "services/uilchilgee";

function TsagBurtgel(
  { data, barilgiinId, token, destroy, onRefresh },
  ref
) {
  const [form] = Form.useForm();
  const [tsag, setTsag] = useState({ekhlekhtsag: moment(Date.now()), duusakhTsag: undefined})

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        form.submit()
      },
      khaaya() {
        destroy();
      },
    }),
    [form, {}]
  );

  function khugatsaaTootsoloy(khugatsaa) {
    setTsag({ekhlekhtsag: moment(Date.now()), duusakhTsag: moment(Date.now()).add(khugatsaa, "minute")})
    if (khugatsaa > 1) {
      uilchilgee(token)
      .post("/togloomiinDunBoduulya", {minut: khugatsaa})
      .then(({data})=> {
        form.setFieldValue("niitDun", data?.dun)
      })
    }      
  }

  function onFinish(formData) {
    const data = formData;
    if (!data.turul) {
      data.turul= "Үйлчлүүлэгч"
    }
        data.ognoo = moment(tsag.ekhlekhtsag).format("YYYY-MM-DD 00:00:00")
        data.barilgiinId = barilgiinId;
        const method = data?._id ? updateMethod : createMethod;
        method("togloomiinTuv", token, data).then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(t("Амжилттай хадгаллаа"));
            onRefresh && onRefresh();
            destroy();
          }
        });
  }

  useEffect(()=> {
    form.setFieldValue("ekhlekhTsag", tsag.ekhlekhtsag);
    form.setFieldValue("duusakhTsag", tsag.duusakhTsag)
  },[tsag])

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={data}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item name="_id" noStyle />
      <Form.Item rules={[
                      {
                        required: true,
                        message: t("Овог бүртгэнэ үү!"),
                      },
                    ]} label="Овог" name="ovog">
        <Input placeholder="Овог" autoComplete="off" />
      </Form.Item>
      <Form.Item 
      rules={[
        {
          required: true,
          message: t("Нэр бүртгэнэ үү!"),
        },
      ]} label="Нэр" name="ner">
        <Input placeholder="Нэр" autoComplete="off" />
      </Form.Item>
      <Form.Item rules={[
                      {
                        required: true,
                        message: t("Хүйс бүртгэнэ үү!"),
                      },
                    ]} label="Хүйс" name="khuis">
        <Select placeholder="Эрэгтэй">
          {[{utga:"Эрэгтэй", v:1}, {utga:"Эмэгтэй", v:0}].map((a) => (
            <Select.Option key={a.v} value={a.v}>{t(a.utga)}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item rules={[
                      {
                        required: true,
                        message: t("Нас бүртгэнэ үү!"),
                      },
                    ]} label="Нас" name="nas">
        <InputNumber className="w-40" placeholder="Нас" min="1" max="12" />
      </Form.Item>
      <Form.Item rules={[
                      {
                        required: true,
                        message: t("Утас бүртгэнэ үү!"),
                      },
                    ]} label="Утас" name="utas">
        <Input placeholder="Утас" autoComplete="off" />
      </Form.Item> 
      <Form.Item rules={[
                      {
                        required: true,
                        message: t("Асран хамгаалагч бүртгэнэ үү!"),
                      },
                    ]}  label="Асран хамгаалагч" name="asragchiinTurul">
        <Select placeholder="Асран хамгаалагч">
          {["Аав", "Ээж", "Өвөө", "Эмээ", "Ах", "Эгч", "Бусад"].map((a)=> {
            return <Select.Option key={a}>{a}</Select.Option>
          })}        
        </Select>
      </Form.Item>     
      <Form.Item rules={[
                      {
                        required: true,
                        message: t("Тоглох цаг /Мин/ бүртгэнэ үү!"),
                      },
                    ]} label="Тоглох цаг /Мин/" name="khugatsaa">
        <InputNumber className="w-40" onChange={(v)=> khugatsaaTootsoloy(v)} placeholder="Тоглох цаг /Мин/ " autoComplete="off" />
      </Form.Item>
      <Form.Item rules={[
                      {
                        required: true,
                        message: t("Эхлэх цаг бүртгэнэ үү!"),
                      },
                    ]} label="Эхлэх цаг" name="ekhlekhTsag">
        <TimePicker value={tsag.ekhlekhtsag} className="w-40" onChange={(v)=> setTsag({...tsag, ekhlekhtsag:v})} showSecond={false} placeholder="Эхлэх цаг /Мин/ " autoComplete="off" />
      </Form.Item>
      <Form.Item label="Дуусах цаг" name="duusakhTsag">
        <TimePicker showSecond={false} placeholder="Дуусах цаг /Мин/ " disabled className="w-40" value={tsag.duusakhTsag} onChange={(v)=> setTsag({...tsag, duusakhTsag:v})} autoComplete="off" />
      </Form.Item>
      <Form.Item  label="Дүн" name="niitDun">
        <InputNumber formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")} disabled={true} placeholder="Дүн" min="1" className="w-40" />
      </Form.Item>
      <Form.Item  label="Төрөл" name="turul">
        <Select placeholder="Төрөл" defaultValue={"Үйлчлүүлэгч"}>
          <Select.Option key={"Үйлчлүүлэгч"}>Үйлчлүүлэгч</Select.Option>
          <Select.Option key={"Гишүүн"}>Гишүүн</Select.Option>
        </Select>
      </Form.Item>      
    </Form>
  );
}

export default React.forwardRef(TsagBurtgel);
