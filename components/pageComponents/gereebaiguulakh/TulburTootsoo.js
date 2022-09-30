import { Form, Button, Switch, Divider, InputNumber } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import AvlagiinKhuvaariUusgekh from "components/pageComponents/gereebaiguulakh/AvlagaiinKhuvaariUusgekh";
import formatNumber from "tools/function/formatNumber";
import { useEffect, useState } from "react";
import Aos from "aos";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const Tulbur = ({
  value,
  onChange,
  next,
  prev,
  zasvar,
  token,
  gereeniiZagvar,
}) => {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const [khuvaari, setKhuvaari] = useState();

  useEffect(() => {
    const zardluud = (value.zardluud = value.zardluud.filter(function (item) {
      return item.dun !== undefined;
    }));
    uilchilgee(token)
      .post(`/khuvaariUusgey`, {
        dun: value.talbainNiitUne,
        khugatsaa: value.khugatsaa,
        tulukhUdruud: value.tulukhUdur,
        ekhlekhOgnoo: value.gereeniiOgnoo,
        duusakhOgnoo: value.duusakhOgnoo,
        zardluud: zardluud,
      })
      .then(({ data }) => {
        setKhuvaari(data);
        _.set(value, "avlaga.guilgeenuud", data);
        onChange({ ...value });
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }, []);

  function onFinish() {
    next(value);
  }

  return (
    <Form
      {...formItemLayout}
      initialValues={value}
      onValuesChange={(values) => onChange({ ...value, ...values })}
      onFinish={onFinish}
    >
      <div data-aos="fade-right" data-aos-duration="1000">
        <Form.Item label="Түрээсийн төлбөр" style={{ marginBottom: 10 }}>
          <div className="text-right text-lg font-medium dark:text-gray-100">
            {formatNumber(value.sariinTurees)}
          </div>
        </Form.Item>
      </div>

      {gereeniiZagvar?.turGereeEsekh !== true ? (
        <div>
          <div data-aos="fade-right" data-aos-duration="1000">
            <Form.Item name="baritsaaAvakhDun" label="Барьцаа дүн">
              <InputNumber
                disabled
                placeholder="Барьцаа дүн"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="100"
          >
            <Form.Item
              name="baritsaaBairshuulakhKhugatsaa"
              label="Хугацаа"
              rules={[
                {
                  required: true,
                  message: "Барьцаа байршуулалтын хугацаа бүртгэнэ үү!",
                },
              ]}
            >
              <InputNumber
                placeholder="Барьцаа байршуулалтын хугацаа"
                style={{ width: "100%" }}
                min={0}
              />
            </Form.Item>
          </div>
        </div>
      ) : null}
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
        <Form.Item label="Нийт дүн" style={{ marginBottom: 10 }}>
          <div className="text-right text-lg font-medium dark:text-gray-100">
            {formatNumber(
              (value.sariinTurees || 0) * (value.buunTulult || 1) +
                (value.baritsaaAvakhDun || 0) *
                  (value.baritsaaAvakhKhugatsaa || 0) -
                (((value.sariinTurees || 0) * 12) / 365) *
                  (value.khungulukhKhugatsaa || 0) -
                (value.khyamdaral || 0) +
                value.zardluud?.reduce((a, b) => a + b.dun, 0)
            )}
          </div>
        </Form.Item>
      </div>

      <Divider />
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400">
        <Form.Item name="avlaga" noStyle>
          <AvlagiinKhuvaariUusgekh ugugdul={khuvaari} />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="500">
        <Form.Item wrapperCol={{ span: 24 }}>
          <div className="mt-4 flex w-full flex-row justify-between">
            <Button
              onClick={prev}
              icon={<ArrowLeftOutlined />}
              className="mr-4 dark:text-gray-200 dark:hover:text-gray-800"
            >
              Зардал бүртгэл
            </Button>
            {!zasvar && (
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Хадгалах
              </Button>
            )}
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default Tulbur;
