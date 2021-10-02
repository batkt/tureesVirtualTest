import { Form, Button, Switch, Divider } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import AvlagiinKhuvaariUusgekh from "components/pageComponents/gereebaiguulakh/AvlagaiinKhuvaariUusgekh";
import formatNumber from "tools/function/formatNumber";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const Tulbur = ({ value, onChange, next, prev }) => {

  return (
    <Form
      {...formItemLayout}
      initialValues={value}
      onValuesChange={(values) => onChange({ ...value, ...values })}
    >
      <Form.Item label="Түрээсийн төлбөр" style={{marginBottom:10}}>
        <div className="text-lg font-medium text-right">
          {formatNumber(value.sariinTurees)}
        </div>
      </Form.Item>
      <Form.Item label="Барьцаа төлбөр" style={{marginBottom:10}}>
        <div className="text-lg font-medium text-right">
          {`${formatNumber(
            (value.baritsaaAvakhDun || 0) * (value.baritsaaAvakhKhugatsaa || 0)
          )}`}
        </div>
      </Form.Item>
      {/* <Form.Item label="Алданги" style={{marginBottom:10}}>
        <div className="text-lg font-medium text-right">
          {`${formatNumber(
            0.1,2
          )}%`}
        </div>
      </Form.Item> */}
      <Form.Item label="Нийт дүн" style={{marginBottom:10}}>
        <div className="text-lg font-medium text-right">
          {formatNumber(
            ((value.sariinTurees || 0) * (value.buunTulult || 1)) +
            ((value.baritsaaAvakhDun || 0) *
            (value.baritsaaAvakhKhugatsaa || 0)) -
            (((value.sariinTurees || 0) * 12 / 365) *
            (value.khungulukhKhugatsaa || 0)) -
            (value.khyamdaral || 0)
          )}
        </div>
      </Form.Item>
      <Form.Item label="Төлбөрийн хуваарь" style={{marginBottom:10}}>
        <div className='w-full flex justify-end'>
          <Switch/>
        </div>
      </Form.Item>
      <Divider/>
      <Form.Item name='avlaga' noStyle>
        <AvlagiinKhuvaariUusgekh ugugdul={value}/>
      </Form.Item>
      <Form.Item noStyle wrapperCol={{span: 24}}>
        <div className="w-full flex flex-row justify-between mt-4">
          <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
            Барьцаа бүртгэл
          </Button>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} onClick={()=>next(value)}>
            Хадгалах
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default Tulbur;
