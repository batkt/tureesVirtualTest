import { Form, Button, InputNumber } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import formatNumber from "tools/function/formatNumber";
const formItemLayout = {
  labelCol: {
    span: 8,
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
      onValuesChange={(values) => onChange({ ...value, ...values })}
    >
      <Form.Item label="Түрээсийн төлбөр">
        {formatNumber(value.sariinTurees)}₮
      </Form.Item>
      <Form.Item name="khungulukhKhugatsaa" label="Хөнгөлөх хугацаа">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder="Хөнгөлөх хугацаа"
        />
      </Form.Item>
      <Form.Item name="buunTulult" label="Бөөн төлөлт">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder="Бөөн төлөлт"
        />
      </Form.Item>
      <Form.Item name="uramshuulal" label="Урамшуулал">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder="Урамшуулал"
        />
      </Form.Item>
      <div className="p-2 bg-white rounded-md divide-y-2 divide-dashed">
        <Form.Item label="Нийт дүн" className="text-lg">
          {formatNumber(value.sariinTurees)}₮
        </Form.Item>
        <Form.Item label="ХӨНГӨЛӨЛТ" className="text-lg">
          {formatNumber(value.sariinTurees)}₮
        </Form.Item>
        <Form.Item label="ХАСАГДСАН ДҮН" className="text-lg">
          {formatNumber(value.sariinTurees)}₮
        </Form.Item>
        <Form.Item label="НӨАТ" className="text-lg">
          {formatNumber(value.sariinTurees)}₮
        </Form.Item>
        <Form.Item label="ТӨЛБӨЛ ЗОХИХ" className="text-lg">
          {formatNumber(
            value.sariinTurees +
              value.sariinTurees * value.baritsaaAvakhKhugatsaa
          )}
          ₮
        </Form.Item>
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
