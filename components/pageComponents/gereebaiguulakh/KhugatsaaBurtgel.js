import { Form, Select, Input, Switch, Button, Upload, DatePicker } from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  SolutionOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import React from "react";

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
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
      onValuesChange={(values) => onChange({ ...value, ...values })}
      onFinish={onFinish}
    >
      <Form.Item name="gereeniiOgnoo">
        <DatePicker
          style={{ width: "100%" }}
          allowClear
          placeholder="Гэрээ дуусах хугацаа"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item name="khugatsaa">
        <Input
          allowClear
          maxLength={10}
          placeholder="Гэрээний хугацаа"
          prefix={<ClockCircleOutlined />}
        />
      </Form.Item>
      <Form.Item name="khungulukhKhugatsaa">
        <Input
          allowClear
          placeholder="Хөнгөлөх хугацаа"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Input
          allowClear
          placeholder="Төлөлт хийх огноо сар бүрийн / өдөр"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item name="duusakhOgnoo">
        <DatePicker
          style={{ width: "100%" }}
          allowClear
          placeholder="Гэрээ дуусах хугацаа"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Input
          allowClear
          placeholder="Гэрээний хугацааг сунгах"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Input
          allowClear
          placeholder="Хугацаа хэтрэвэл төлөлт хийх боломжит хугацаа"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Input
          allowClear
          placeholder="Төлөлт сануулах мэдээлэл хугацаа дуусахаас /өдрийн өмнө"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item noStyle className="w-full flex flex-row justify-between">
        <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
          Хөрөнгийн бүртгэл
        </Button>
        <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
          Төлбөр тооцоо
        </Button>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
