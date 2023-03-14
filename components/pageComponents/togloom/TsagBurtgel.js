import React, { useCallback, useEffect, useImperativeHandle, useState } from "react";
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
    setTsag({ekhlekhtsag: moment(tsag.ekhlekhtsag), duusakhTsag: moment(tsag.ekhlekhtsag).add(khugatsaa, "minute")})
    if (khugatsaa > 0) {
      uilchilgee(token)
      .post("/togloomiinDunBoduulya", {minut: khugatsaa})
      .then(({data})=> {
        console.log(data)
        if (!!data) {
          form.setFieldValue("niitDun", data?.dun)
        } else form.setFieldValue("niitDun", undefined)        
      })
    } else form.setFieldValue("niitDun", undefined)      
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

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "ovog":
          form.getFieldInstance("ner").focus();
          break;
        case "ner":
          form.getFieldInstance("khuis").focus();
          break;
          case "nas":
            form.getFieldInstance("utas").focus();
          break;
          case "utas":
            form.getFieldInstance("asragchiinTurul").focus();
          break;
          case "khugatsaa":
            document.getElementById("khuukhedBurtgekhButtonId").focus();
          break;
        default:
          break;
      }
    }
  }, []);

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
        <Input onKeyDown={focuser} placeholder="Овог" autoComplete="off" />
      </Form.Item>
      <Form.Item 
      rules={[
        {
          required: true,
          message: t("Нэр бүртгэнэ үү!"),
        },
      ]} label="Нэр" name="ner">
        <Input onKeyDown={focuser} placeholder="Нэр" autoComplete="off" />
      </Form.Item>
      <Form.Item rules={[
                      {
                        required: true,
                        message: t("Хүйс бүртгэнэ үү!"),
                      },
                    ]} label="Хүйс" name="khuis">
        <Select onChange={()=> form.getFieldInstance("nas").focus()} placeholder="Эрэгтэй">
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
        <InputNumber onKeyDown={focuser} className="w-40" placeholder="Нас" min="1" max="12" />
      </Form.Item>
      <Form.Item rules={[
                      {
                        required: true,
                        message: t("Утас бүртгэнэ үү!"),
                      },
                    ]} label="Утас" name="utas">
        <Input onKeyDown={focuser} placeholder="Утас" autoComplete="off" />
      </Form.Item> 
      <Form.Item rules={[
                      {
                        required: true,
                        message: t("Асран хамгаалагч бүртгэнэ үү!"),
                      },
                    ]}  label="Асран хамгаалагч" name="asragchiinTurul">
        <Select onChange={()=> form.getFieldInstance("khugatsaa").focus()} placeholder="Асран хамгаалагч">
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
        <InputNumber onKeyDown={focuser} className="w-40" onChange={(v)=> khugatsaaTootsoloy(v)} placeholder="Тоглох цаг /Мин/ " autoComplete="off" />
      </Form.Item>
      <Form.Item rules={[
                      {
                        required: true,
                        message: t("Эхлэх цаг бүртгэнэ үү!"),
                      },
                    ]} label="Эхлэх цаг" name="ekhlekhTsag">
        <TimePicker value={tsag.ekhlekhtsag} className="w-40" onChange={(v)=> setTsag({ekhlekhtsag: v, duusakhTsag: moment(v).add((form.getFieldValue("khugatsaa") || 0), "minute")})} showSecond={false} placeholder="Эхлэх цаг /Мин/ " autoComplete="off" />
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
