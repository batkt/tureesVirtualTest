import { Form, Select, Input, Switch, Button, Upload, Space } from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  SolutionOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import React from "react";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const normFile = (e) => {
  console.log("Upload event:", e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

// ААН	Байгууллага нэр
// 	    Регистр
// 	    Албан тушаал
// 	    Овог
// 	    Нэр
// 	    Утас	Гар утас
// 		Байгууллага
// 	    Хаяг
// 	    Гэрчилгээний хуулбар
// Иргэн	Овог
// 	        Нэр
// 	        Регистр
// 	        Гар утас
// 	        Хаяг
// 	        Зөвшөөрлийн бичгийн хуулбар
// 	        Иргэний үнэмлэхний хуулбар
/*
baiguullagiinNer
register
ovog 
ner
utas1 utas2
baiguullaga
khayag
gerchilgeeniiKhuulbar
zuvshuurliinBichgiinKhuulbar
irgeniiUnemlekhiinKhuulbar
*/
const YurunkhiiMedeele = ({ next, prev, onChange, value }) => {
  const onFinish = (values) => {
    onChange({ ...value, ...values });
    next();
  };

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onFinish={onFinish}
    >
      <Form.Item label="Хө">
        <Form.List name="users">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "ner"]}
                    fieldKey={[fieldKey, "ner"]}
                    rules={[{ required: true, message: "Нэр оруулна уу" }]}
                  >
                    <Input placeholder="Нэр" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "too"]}
                    fieldKey={[fieldKey, "too"]}
                    rules={[{ required: true, message: "too оруулна уу" }]}
                  >
                    <Input placeholder="too" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "unelgee"]}
                    fieldKey={[fieldKey, "unelgee"]}
                    rules={[{ required: true, message: "Үнэлгээ оруулна уу" }]}
                  >
                    <Input placeholder="Үнэлгээ" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Хөрөнгө нэмэх
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item noStyle className="w-full flex flex-row justify-between">
        <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
          Барьцаа бүртгэл
        </Button>
        <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
          Төлбөр тооцоо
        </Button>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
