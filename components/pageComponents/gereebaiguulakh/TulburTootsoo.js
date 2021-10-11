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
        <div className="text-lg font-medium text-right dark:text-gray-100">
          {formatNumber(value.sariinTurees)}
        </div>
      </Form.Item>
      <Form.Item label="Барьцаа төлбөр" style={{marginBottom:10}}>
        <div className="text-lg font-medium text-right dark:text-gray-100">
          {`${formatNumber(
            (value.baritsaaAvakhDun || 0) * (value.baritsaaAvakhKhugatsaa || 0)
          )}`}
        </div>
      </Form.Item>
      <Form.Item label="Нийт дүн" style={{marginBottom:10}}>
        <div className="text-lg font-medium text-right dark:text-gray-100">
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
      <Form.Item label="Төлбөрийн хуваарь" name='khungulukhEsekh' style={{marginBottom:10}} className='w-full flex justify-end dark:text-gray-100'>
          <Switch style={{marginLeft:'auto'}}/>
      </Form.Item>
      <Divider/>
      {!!value?.khungulukhEsekh && <Form.Item name='avlaga' noStyle>
        <AvlagiinKhuvaariUusgekh ugugdul={value}/>
      </Form.Item>}
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
