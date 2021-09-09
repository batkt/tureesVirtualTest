import { Form, Input, Switch, Button, Upload } from "antd";
import {
  UploadOutlined,
  SolutionOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import React from "react";
import { url } from "services/uilchilgee";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

const YurunkhiiMedeele = ({ token, next, onChange, value }) => {
  const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(
    value.baiguullagaEsekh
  );

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onValuesChange={(values) => onChange({ ...value, ...values })}
    >
      <Form.Item name="gereeniiDugaar" label="Гэрээний дугаар">
        <Input
          allowClear
          placeholder="Гэрээний дугаар"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item
        name="baiguullagaEsekh"
        label="Байгууллага эсэх"
        valuePropName="checked"
      >
        <Switch onChange={setBaiguullagaEsekh} />
      </Form.Item>
      <Form.Item
        name="ner"
        hidden={!baiguullagaEsekh}
        label="Байгууллага нэр"
      >
        <Input
          allowClear
          placeholder="Байгууллага нэр"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      {!baiguullagaEsekh && (
        <Form.Item
          hidden={baiguullagaEsekh}
          name="register"
          label="Регистр"
          rules={[
            {
              required: true,
              len: 10,
              pattern: new RegExp("([А-Я|Ө|Ү]{2})(\\d{8})"),
              message: "Регистр бүртгэнэ үү!",
            },
          ]}
        >
          <Input
            allowClear
            maxLength={10}
            placeholder="Регистр"
            prefix={<SolutionOutlined />}
          />
        </Form.Item>
      )}
      {baiguullagaEsekh && (
        <Form.Item
          hidden={!baiguullagaEsekh}
          name="register"
          label="Регистр"
          rules={[
            {
              required: true,
              len: 7,
              pattern: new RegExp("(\\d{7})"),
              message: "Регистр бүртгэнэ үү!",
            },
          ]}
        >
          <Input
            allowClear
            maxLength={7}
            placeholder="Регистр"
            prefix={<SolutionOutlined />}
          />
        </Form.Item>
      )}
      <Form.Item hidden={baiguullagaEsekh} name="ovog" label="Овог">
        <Input allowClear placeholder="Овог" prefix={<SolutionOutlined />} />
      </Form.Item>
      <Form.Item hidden={baiguullagaEsekh} name="ner" label="Нэр">
        <Input allowClear placeholder="Нэр" prefix={<SolutionOutlined />} />
      </Form.Item>
      <Form.Item
        hidden={!baiguullagaEsekh}
        name="zakhirliinOvog"
        label="Захирлын овог"
      >
        <Input allowClear placeholder="Овог" prefix={<SolutionOutlined />} />
      </Form.Item>
      <Form.Item
        hidden={!baiguullagaEsekh}
        name="zakhirliinNer"
        label="Захирлын нэр"
      >
        <Input allowClear placeholder="Нэр" prefix={<SolutionOutlined />} />
      </Form.Item>
      <Form.Item name="utas" label="Утас">
        <Input allowClear placeholder="Утас" prefix={<SolutionOutlined />} />
      </Form.Item>
      <Form.Item
        hidden={!baiguullagaEsekh}
        name="gerchilgeeniiZurag"
        label="Гэрчилгээний хуулбар"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="Гэрчилгээний хуулбар"
      >
        <Upload
          multiple={false}
          name="file"
          listType="picture"
          action={`${url}/zuragKhadgalya`}
          method="POST"
          data={{ turul: "gerchilgeeniiZurag" }}
          headers={{ Authorization: `bearer ${token}` }}
        >
          <Button icon={<UploadOutlined />}>Файл сонгох</Button>
        </Upload>
      </Form.Item>
      <Form.Item label="Хавсаргал" hidden={baiguullagaEsekh} className="w-full">
        <Form.Item
          name="zuvshuurliinZurag"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Зөвшөөрлийн бичгийн хуулбар"
        >
          <Upload
            multiple={false}
            name="file"
            listType="picture"
            action={`${url}/zuragKhadgalya`}
            method="POST"
            data={{ turul: "zuvshuurliinZurag" }}
            headers={{ Authorization: `bearer ${token}` }}
          >
            <Button icon={<UploadOutlined />}>Файл сонгох</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="unemlekhniiZurag"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Иргэний үнэмлэхний хуулбар"
        >
          <Upload
            multiple={false}
            name="file"
            listType="picture"
            action={`${url}/zuragKhadgalya`}
            method="POST"
            data={{ turul: "unemlekhniiZurag" }}
            headers={{ Authorization: `bearer ${token}` }}
          >
            <Button icon={<UploadOutlined />}>Файл сонгох</Button>
          </Upload>
        </Form.Item>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          span: 14,
          offset: 10,
        }}
      >
        <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />} onClick={()=>next()}>
          Гэрээний хугацаа
        </Button>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
