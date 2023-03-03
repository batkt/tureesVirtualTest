import React, { useEffect, useImperativeHandle, useState } from "react";
import { Form, Input, message, Select, TimePicker, InputNumber } from "antd";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { t } from "i18next";
import moment from "moment"

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
        const data = form.getFieldsValue();
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
      },
      khaaya() {
        destroy();
      },
    }),
    [form, tsag, {}]
  );

  function khugatsaaTootsoloy(khugatsaa) {
    setTsag({ekhlekhtsag: moment(Date.now()), duusakhTsag: moment(Date.now()).add(khugatsaa, "minute")})
  }

  useEffect(()=> {
    form.setFieldValue("ekhlekhTsag", tsag.ekhlekhtsag);
    form.setFieldValue("duusakhTsag", tsag.duusakhTsag)
  },[tsag])

  return (
    <Form
      form={form}
      initialValues={data}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item name="_id" noStyle />
      <Form.Item label="Овог" name="ovog">
        <Input placeholder="Овог" autoComplete="off" />
      </Form.Item>
      <Form.Item label="Нэр" name="ner">
        <Input placeholder="Нэр" autoComplete="off" />
      </Form.Item>
      <Form.Item label="Хүйс" name="khuis">
        <Select placeholder="Эрэгтэй">
          {[{utga:"Эрэгтэй", v:1}, {utga:"Эмэгтэй", v:0}].map((a) => (
            <Select.Option key={a.v} value={a.v}>{t(a.utga)}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Нас" name="nas">
        <InputNumber placeholder="Нас" min="1" max="12" />
      </Form.Item>
      <Form.Item label="Утас" name="utas">
        <Input placeholder="Утас" autoComplete="off" />
      </Form.Item>
      <Form.Item label="Дүн" name="niitDun">
        <InputNumber placeholder="Дүн" min="1" className="w-40" />
      </Form.Item>
      <Form.Item label="Тоглох цаг /Мин/" name="khugatsaa">
        <InputNumber className="w-40" onChange={(v)=> khugatsaaTootsoloy(v)} placeholder="Тоглох цаг /Мин/ " autoComplete="off" />
      </Form.Item>
      <Form.Item label="Эхлэх цаг" name="ekhlekhTsag">
        <TimePicker value={tsag.ekhlekhtsag} className="w-40" onChange={(v)=> setTsag({...tsag, ekhlekhtsag:v})} showSecond={false} placeholder="Эхлэх цаг /Мин/ " autoComplete="off" />
      </Form.Item>
      <Form.Item label="Дуусах цаг" name="duusakhTsag">
        <TimePicker showSecond={false} placeholder="Дуусах цаг /Мин/ " disabled className="w-40" value={tsag.duusakhTsag} onChange={(v)=> setTsag({...tsag, duusakhTsag:v})} autoComplete="off" />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(TsagBurtgel);
