import { Form, Select, Button, Input, InputNumber } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import {toWords} from "mon_num";
import useTalbai from "hooks/useTalbai";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const YurunkhiiMedeele = ({
  token,
  baiguullaga,
  next,
  prev,
  onChange,
  value,
}) => {
  const [form] = Form.useForm();
  const { talbainiiGaralt, settalbaiKhuudaslalt } = useTalbai(
    token,
    baiguullaga?._id
  );

  const onChangetalbai = (v) => {
    var {_id,...talbai} = talbainiiGaralt.jagsaalt.find((a) => a._id === v);
    talbai.talbainiiDugaar = talbai.kod;
    talbai.baritsaaAvakhDun = talbai.talbainNiitUne;
    talbai.sariinTurees = talbai.talbainNiitUne;
    talbai.talbainNegjUneUsgeer = toWords(talbai.talbainNegjUne)
    talbai.talbainNiitUneUsgeer = toWords(talbai.talbainNiitUne)
    form.setFieldsValue(talbai);
    onChange({ ...value, ...talbai });
  };

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onValuesChange={(values) => onChange({ ...value, ...values })}
    >
      <Form.Item label="Түрээсийн талбай" name="tureesiinTalbainId">
        <Select
          showSearch
          placeholder="Талбай сонгох"
          className="w-full"
          placeholder="Талбай сонгох"
          size="large"
          value={null}
          filterOption={(o) => o}
          onSearch={(search) => settalbaiKhuudaslalt((a) => ({ ...a, search }))}
          onChange={onChangetalbai}
        >
          {talbainiiGaralt?.jagsaalt?.map((mur) => {
            return <Select.Option key={mur._id}>{mur.kod}</Select.Option>;
          })}
        </Select>
      </Form.Item>
      <Form.Item label="Талбайн дугаар" name="talbainiiDugaar">
        <Input placeholder='Талбайн дугаар'/>
      </Form.Item>
      <Form.Item label="Талбайн нэгж үнэ" name="talbainNegjUne">
        <InputNumber
          placeholder='Талбайн нэгж үнэ'
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Талбайн нийт үнэ" name="talbainNiitUne">
        <InputNumber
          placeholder='Талбайн нийт үнэ'
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Талбайн хэмжээ" name="talbainKhemjee">
        <InputNumber
          placeholder='Талбайн хэмжээ'
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Давхар" name="davkhar">
        <InputNumber
          placeholder='Давхар'
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Ашиглалтын зардал" name="zardliinDun">
        <InputNumber
          placeholder='Ашиглалтын зардал'
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Зориулалт" name="zoriulalt">
        <Input placeholder='Зориулалт'/>
      </Form.Item>
      <Form.Item wrapperCol={{span: 24}}>
        <div className="w-full flex flex-row justify-between">
          <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
            Гэрээний хугацаа
          </Button>
          <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />} onClick={()=>next()}>
            Барьцаа бүртгэл
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
