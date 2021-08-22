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

const Tulbur = ({ value, onChange, next, prev }) => {
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
        <div className="text-lg font-medium">
          {formatNumber(value.sariinTurees)}
        </div>
      </Form.Item>
      <Form.Item label="Барьцаа төлбөр">
        <div className="text-lg font-medium">
          {`${formatNumber(value.baritsaaAvakhDun)} x ${
            value.baritsaaAvakhKhugatsaa
          } сар = ${formatNumber(
            value.baritsaaAvakhDun * value.baritsaaAvakhKhugatsaa
          )}`}
        </div>
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
      <Form.Item name="khyamdaral" label="Хямдрал">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder="Хямдрал"
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
        <Form.Item label="Нийт дүн">
          <div className="text-lg font-medium">
            {formatNumber(
              (value.sariinTurees || 0) * (value.buunTulult || 0) +
                (value.baritsaaAvakhDun || 0) *
                  (value.baritsaaAvakhKhugatsaa || 0)
            )}
          </div>
        </Form.Item>
        <Form.Item label="ХӨНГӨЛӨЛТ">
          <div className="text-lg font-medium text-red-500">
            -
            {formatNumber(
              (value.khungulukhKhugatsaa || 0) * (value.sariinTurees || 0)
            )}
          </div>
        </Form.Item>
        <Form.Item label="ХАСАГДСАН ДҮН">
          <div className="text-lg font-medium text-red-500">
            -{formatNumber(value.khyamdaral)}
          </div>
        </Form.Item>
        <Form.Item label="НӨАТ">
          <div className="text-lg font-medium">{formatNumber(0)}</div>
        </Form.Item>
        <Form.Item label="ТӨЛБӨЛ ЗОХИХ">
          <div className="text-lg font-medium">
            {formatNumber(
              (value.sariinTurees || 0) * (value.buunTulult || 0) +
                (value.baritsaaAvakhDun || 0) *
                  (value.baritsaaAvakhKhugatsaa || 0) -
                (value.khungulukhKhugatsaa || 0) * (value.sariinTurees || 0) -
                (value.khyamdaral || 0)
            )}
            ₮
          </div>
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

export default Tulbur;
