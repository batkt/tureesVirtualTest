import { Form, Button } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import formatNumber from "tools/function/formatNumber";
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const Demo = ({ value, onChange, next, prev }) => {
  const onFinish = (values) => {
    onChange({ ...value, ...values });
    next({ ...value, ...values });
  };

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onFinish={onFinish}
    >
      <div className="p-2 bg-white rounded-md space-y-3 text-lg divide-y-2 divide-dashed">
        <div>Сарын түрээс {formatNumber(value.sariinTurees)}₮</div>
        <div>
          Барьцаа төлбөр {formatNumber(value.sariinTurees)}₮ x{" "}
          {value.baritsaaAvakhKhugatsaa} сар ={" "}
          {formatNumber(value.sariinTurees * value.baritsaaAvakhKhugatsaa)}₮
        </div>
        <div>
          Нийт төлөх дүн{" "}
          {formatNumber(
            value.sariinTurees +
              value.sariinTurees * value.baritsaaAvakhKhugatsaa
          )}
          ₮
        </div>
      </div>
      <Form.Item noStyle className="w-full flex flex-row justify-between">
        <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
          Барьцаа бүртгэл
        </Button>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
          Хадгалах
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Demo;
