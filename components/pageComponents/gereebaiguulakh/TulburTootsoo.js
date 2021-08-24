import { Form, Button, InputNumber } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import formatNumber from "tools/function/formatNumber";
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
const customItemLayout = {
  labelCol: {
    span: 18,
  },
  wrapperCol: {
    span: 6,
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
        <div className="text-lg font-medium text-right">
          {formatNumber(value.sariinTurees)}
        </div>
      </Form.Item>
      <Form.Item label="Барьцаа төлбөр">
        <div className="text-lg font-medium text-right">
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
          placeholder="өдөр"
        />
      </Form.Item>
      <Form.Item name="khyamdaral" label="Хөнгөлөх дүн">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder="Хөнгөлөх дүн"
        />
      </Form.Item>
      <Form.Item name="aldangi" label="Алданги" >
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder="Хоног %"
        />
      </Form.Item>
      <div className="p-2 bg-white rounded-md divide-y-2 divide-dashed">
        <Form.Item label="Нийт дүн" {...customItemLayout} style={{marginBottom:0,padding:'8px 0'}}>
          <div className="text-lg font-medium text-right">
            {formatNumber(
              (value.sariinTurees || 0) * (value.buunTulult || 1) +
                (value.baritsaaAvakhDun || 0) *
                  (value.baritsaaAvakhKhugatsaa || 0)
            )}
          </div>
        </Form.Item>
        <Form.Item label="ХӨНГӨЛӨЛТ" {...customItemLayout} style={{marginBottom:0,padding:'8px 0'}}>
          <div className="text-lg font-medium text-red-500 text-right">
            -
            {formatNumber(
              ((value.sariinTurees || 0) * 12 / 365) *
              (value.khungulukhKhugatsaa || 0)
            )}
          </div>
        </Form.Item>
        <Form.Item label="ХАСАГДСАН ДҮН" {...customItemLayout} style={{marginBottom:0,padding:'8px 0'}}>
          <div className="text-lg font-medium text-red-500 text-right">
            -{formatNumber(value.khyamdaral)}
          </div>
        </Form.Item>
        <Form.Item label="НӨАТ" {...customItemLayout} style={{marginBottom:0,padding:'8px 0'}}>
          <div className="text-lg font-medium text-right">{formatNumber(0)}</div>
        </Form.Item>
        <Form.Item label="ТӨЛБӨЛ ЗОХИХ" {...customItemLayout} style={{marginBottom:0,padding:'8px 0'}}>
          <div className="text-lg font-medium text-right">
            {formatNumber(
              ((value.sariinTurees || 0) * (value.buunTulult || 1)) +
                ((value.baritsaaAvakhDun || 0) *
                (value.baritsaaAvakhKhugatsaa || 0)) -
                (((value.sariinTurees || 0) * 12 / 365) *
                (value.khungulukhKhugatsaa || 0)) -
                (value.khyamdaral || 0)
            )}
            ₮
          </div>
        </Form.Item>
      </div>
      <Form.Item noStyle wrapperCol={{span: 24}}>
        <div className="w-full flex flex-row justify-between mt-4">
          <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
            Барьцаа бүртгэл
          </Button>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Хадгалах
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default Tulbur;
