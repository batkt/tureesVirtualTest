import { Form, Select, Button, InputNumber } from "antd";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Aos from "aos";
import { useAuth } from "services/auth";
import useJagsaalt from "hooks/useJagsaalt";
import formatNumber from "tools/function/formatNumber";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const query = {};

function TalbaiSongolt({ value, onChange, mode }) {
  const { token, baiguullaga } = useAuth();

  const ashiglaltiinZardal = useJagsaalt("/ashiglaltiinZardluud", query);

  function onValueChange(v) {
    onChange(ashiglaltiinZardal.jagsaalt.find((a) => a._id === v));
  }

  return (
    <Select
      placeholder="Зардалын төрөл"
      filterOption={false}
      value={value}
      mode={mode}
      showSearch
      onChange={onValueChange}
      loading={!ashiglaltiinZardal}
      onSearch={(search) => setTalbaiKhuudaslalt((a) => ({ ...a, search }))}
    >
      {ashiglaltiinZardal?.jagsaalt?.map((a) => {
        return (
          <Select.Option key={a._id}>
            <div className="flex justify-between">
              <p className=" ">{a.ner}</p>

              <p className="flex gap-1">
                {a.turul} {a.turul && a.tariff && <p>=</p>}
                <p>{a.tariff}</p>
              </p>
            </div>
          </Select.Option>
        );
      })}
    </Select>
  );
}

const YurunkhiiMedeele = ({ next, prev, onChange, value }) => {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const [zardlinTurul, setZardlinTurul] = useState([]);
  const [niitKhemjee, setNiitKhemjee] = useState();

  function onFinish() {
    next();
  }

  function zardlinTurulUstgay(index) {
    zardlinTurul.splice(index, 1);
    setZardlinTurul([...zardlinTurul]);
  }

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      onValuesChange={(values) => onChange({ ...value, ...values })}
      initialValues={value}
      onFinish={onFinish}
    >
      <div data-aos="fade-right" data-aos-duration="1000">
        <Form.Item label="Зардалын төрөл">
          <TalbaiSongolt
            value={""}
            onChange={(v) => setZardlinTurul([...zardlinTurul, v])}
          />
        </Form.Item>
      </div>
      <div className="space-y-5">
        {zardlinTurul?.map((mur, index) => {
          return (
            <div className="rounded-lg border border-black p-2" key={index}>
              <div className="flex">
                {" "}
                {zardlinTurul !== undefined && (
                  <div className="relative flex w-full justify-between rounded-md rounded-b-none border bg-white p-2 py-1 dark:bg-gray-700">
                    <p>{mur?.ner}</p>
                    <div className="flex gap-1">
                      <p>{mur?.turul}</p>
                      <p>=</p>
                      <p>{mur?.tariff}</p>
                      <div
                        onClick={() => zardlinTurulUstgay(index)}
                        className="absolute -right-6 -top-4 rounded-full bg-white text-3xl text-red-600"
                      >
                        <CloseCircleOutlined />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <table className=" w-full">
                <thead>
                  <tr>
                    <th className="w-1/4 border-2">Нэр</th>
                    <th className="w-1/4 border-2">{mur?.turul || "Үнэ"}</th>
                    <th className="w-1/4 border-2">Нийт хэмжээ</th>
                    <th className="w-1/4 border-2">Нийт үнэ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="border-2">{mur?.ner}</th>
                    <th className="border-2">{formatNumber(mur?.tariff)}</th>
                    <th className="border-2">
                      <InputNumber
                        onChange={(v) => setNiitKhemjee(v)}
                        className="w-full"
                        value={niitKhemjee}
                        placeholder={`хэмжээ (${mur?.turul})`}
                      />
                    </th>
                    <th className="border-2">
                      {formatNumber(mur?.tariff * niitKhemjee)}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      <div className="mt-5">
        <Form.Item label={"Нийт хэмжээ"}>
          <InputNumber className=" w-full" disabled value={niitKhemjee} />
        </Form.Item>
      </div>

      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
        <Form.Item wrapperCol={{ span: 24 }}>
          <div className="mt-5 flex w-full flex-row justify-between">
            <Button
              onClick={prev}
              icon={<ArrowLeftOutlined />}
              className="mr-4"
            >
              Түрээсийн талбай
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<ArrowRightOutlined />}
            >
              Төлбөр тооцоо
            </Button>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default YurunkhiiMedeele;
