import { Form, Select, Input, Switch, Button, Upload, InputNumber } from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  SolutionOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  DollarCircleOutlined,
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
  const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(false);

  const onFinish = (values) => {
    onChange({ ...value, ...values });
    next();
  };

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      onFinish={onFinish}
      onValuesChange={(values) => onChange({ ...value, ...values })}
      initialValues={value}
    >
      <Form.Item name="baritsaaAvakhDun" label="Барьцаа дүн">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item name="baritsaaAvakhKhugatsaa" label="Барьцаа авах хугацаа">
        <Select placeholder="Барьцаа авах хугацаа">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="baritsaaBairshuulakhKhugatsaa"
        label="Барьцаа байршуулалтын хугацаа"
      >
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item noStyle className="w-full flex flex-row justify-between">
        <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
          Түрээсийн талбай
        </Button>
        <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
          Төлбөр тооцоо
        </Button>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
