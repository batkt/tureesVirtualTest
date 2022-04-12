import { Form, Button, Switch, Divider } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import AvlagiinKhuvaariUusgekh from "components/pageComponents/gereebaiguulakh/AvlagaiinKhuvaariUusgekh";
import formatNumber from "tools/function/formatNumber";
import { useEffect } from "react";
import Aos from "aos";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const Tulbur = ({ value, onChange, next, prev, zasvar }) => {
  useEffect(() => {
    Aos.init();
  });

  return (
    <Form
      {...formItemLayout}
      initialValues={value}
      onValuesChange={(values) => onChange({ ...value, ...values })}
    >
      <Form.Item
        label="Түрээсийн төлбөр"
        style={{ marginBottom: 10 }}
        data-aos="fade-right"
        data-aos-duration="1000"
      >
        <div className="text-right text-lg font-medium dark:text-gray-100">
          {formatNumber(value.sariinTurees)}
        </div>
      </Form.Item>
      <Form.Item
        label="Барьцаа төлбөр"
        style={{ marginBottom: 10 }}
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="100"
      >
        <div className="text-right text-lg font-medium dark:text-gray-100">
          {`${formatNumber(
            (value.baritsaaAvakhDun || 0) * (value.baritsaaAvakhKhugatsaa || 0)
          )}`}
        </div>
      </Form.Item>
      <Form.Item
        label="Нийт дүн"
        style={{ marginBottom: 10 }}
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="200"
      >
        <div className="text-right text-lg font-medium dark:text-gray-100">
          {formatNumber(
            (value.sariinTurees || 0) * (value.buunTulult || 1) +
              (value.baritsaaAvakhDun || 0) *
                (value.baritsaaAvakhKhugatsaa || 0) -
              (((value.sariinTurees || 0) * 12) / 365) *
                (value.khungulukhKhugatsaa || 0) -
              (value.khyamdaral || 0)
          )}
        </div>
      </Form.Item>
      <Form.Item
        label="Төлбөрийн хуваарь"
        name="khungulukhEsekh"
        style={{ marginBottom: 10 }}
        className="flex w-full justify-end dark:text-gray-100"
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="300"
      >
        <Switch style={{ marginLeft: "auto" }} />
      </Form.Item>
      <Divider />
      <Form.Item
        name="avlaga"
        noStyle
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="400"
      >
        <AvlagiinKhuvaariUusgekh ugugdul={value} />
      </Form.Item>
      <Form.Item
        wrapperCol={{ span: 24 }}
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="500"
      >
        <div className="mt-4 flex w-full flex-row justify-between">
          <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
            Барьцаа бүртгэл
          </Button>
          {!zasvar && (
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              onClick={() => next(value)}
            >
              Хадгалах
            </Button>
          )}
        </div>
      </Form.Item>
    </Form>
  );
};

export default Tulbur;
