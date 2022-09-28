import {
  Form,
  Button,
  Input,
  Select,
  notification,
  Popconfirm,
  message,
  InputNumber,
} from "antd";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect } from "react";
import { toWords } from "mon_num";
import uilchilgee from "services/uilchilgee";
import _ from "lodash";
import Aos from "aos";
import useTalbai from "hooks/useTalbai";
import { useAuth } from "services/auth";
import formatNumber from "tools/function/formatNumber";
import getListMethod from "tools/function/crud/getListMethod";

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

  const { talbainiiGaralt, setTalbaiKhuudaslalt } = useTalbai(
    token,
    baiguullaga?._id,
    query
  );

  function onValueChange(v) {
    onChange(talbainiiGaralt.jagsaalt.find((a) => a._id === v));
  }

  return (
    <Select
      placeholder="Талбай"
      filterOption={false}
      value={value}
      mode={mode}
      showSearch
      onChange={onValueChange}
      loading={!talbainiiGaralt}
      onSearch={(search) => setTalbaiKhuudaslalt((a) => ({ ...a, search }))}
    >
      {talbainiiGaralt?.jagsaalt?.map((a) => {
        return (
          <Select.Option key={a._id}>
            <div className="flex ">
              <p className="w-28 border-r-2 text-left">{a.kod}</p>
              <p className="w-24 border-r-2 text-center">
                {a.talbainKhemjee}m<sup>2</sup>
              </p>
              <p className="w-20 border-r-2 text-center">{a.davkhar}F</p>
              <p className="w-full text-right">
                {formatNumber(a.talbainNiitUne ? a.talbainNiitUne : 0)}₮
              </p>
            </div>
          </Select.Option>
        );
      })}
    </Select>
  );
}

const YurunkhiiMedeele = ({
  token,
  next,
  prev,
  onChange,
  value,
  barilgiinId,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!!value.talbainIdnuud && !value.talbainuud) {
      getListMethod("talbai", token, {
        query: { _id: { $in: value.talbainIdnuud } },
      }).then(({ data }) => {
        value.talbainuud = data.jagsaalt;
        onChange({ ...value });
      });
    }
  }, [value]);

  const sulEsekh = (talbainDugaar, callback) => {
    uilchilgee(token)
      .get("/talbainSulEskhiigShalgay", {
        params: {
          talbainDugaar: talbainDugaar,
          barilgiinId: barilgiinId,
        },
      })
      .then(({ data }) => {
        if (data === "OK" || data === value.gereeniiDugaar) {
          callback(data);
        } else
          notification.warning({
            message: (
              <div>
                <b>{talbainDugaar}</b> талбай нь <b>{data}</b> гэрээн дээр
                холбогдсон байна.
              </div>
            ),
          });
      });
  };

  function talbainBurtgelBugulyu(talbainuud) {
    value.baritsaaAvakhDun = talbainuud.reduce(
      (a, b) => a + Number(b.talbainNiitUne || 0),
      0
    );
    value.sariinTurees = talbainuud.reduce(
      (a, b) => a + Number(b.talbainNiitUne || 0),
      0
    );
    value.talbainNegjUne = talbainuud.reduce((a, b) => a + b.talbainNegjUne, 0);
    value.talbainNiitUne = value.baritsaaAvakhDun;
    value.talbainKhemjee = talbainuud.reduce((a, b) => a + b.talbainKhemjee, 0);
    value.talbainNegjUneUsgeer = toWords(value.talbainNegjUne);
    value.talbainNiitUneUsgeer = toWords(value.talbainNiitUne);
    value.davkhar = [...new Set(talbainuud.map((a) => a.davkhar))].join(",");
    value.talbainIdnuud = talbainuud.map((a) => a._id);
    value.talbainDugaar = talbainuud.map((a) => a.kod).join(",");
    form.setFieldsValue(value);
  }

  function onChangeTalbai(v) {
    if (!!value.talbainuud?.find((a) => a.kod === v.kod)) {
      notification.warning({
        message: (
          <div>
            <b>{v.kod}</b> талбай нь гэрээн дээр сонгогдсон байна.
          </div>
        ),
      });
      return;
    }
    sulEsekh(v.kod, () => {
      value.talbainuud = value.talbainuud || [];
      value.talbainuud.push(v);
      talbainBurtgelBugulyu(value.talbainuud);
      onChange({ ...value });
    });
  }

  function talbaiUstgaya(index) {
    value.talbainuud.splice(index, 1);
    talbainBurtgelBugulyu(value.talbainuud);
    onChange({ ...value });
  }

  useEffect(() => {
    Aos.init({ once: true });
  });

  function onFinish() {
    if (value.talbainuud === undefined) {
      message.warning("Талбай бүртгэнэ үү!");
    } else if (value.talbainuud.length <= 0) {
      message.warning("Талбай бүртгэнэ үү!");
    } else next();
  }

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onFinish={onFinish}
      onValuesChange={(values) => onChange({ ...value, ...values })}
    >
      <div data-aos="fade-right" data-aos-duration="1000">
        <Form.Item label="Талбай">
          <TalbaiSongolt value={""} onChange={onChangeTalbai} />
        </Form.Item>
      </div>
      <div
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="100"
        className="space-y-2 pb-4 md:w-3/4"
      >
        {value.talbainuud?.map((talbai, index) => {
          return (
            <div
              key={talbai?._id}
              className="group relative space-y-2 rounded-md border border-gray-400 bg-gray-50 p-2 pb-5 shadow-md dark:bg-gray-800 dark:text-gray-300"
            >
              <div className="text-xl font-medium">Код:{talbai.kod}</div>
              <div className="divide-y-2 border">
                <div className="grid grid-cols-12 divide-x-2">
                  <div className="col-span-4 flex items-center justify-center text-center">
                    Давхар
                  </div>
                  <div className="col-span-4 flex items-center justify-center text-center">
                    m<sup>2</sup>
                  </div>
                  <div className="col-span-4 flex items-center justify-center text-center">
                    Түрээсийн төлбөр
                  </div>
                </div>
                <div className="grid grid-cols-12 divide-x-2 py-1">
                  <div className="col-span-4 text-center">{talbai.davkhar}</div>
                  <div className="col-span-4 text-center">
                    {talbai.talbainKhemjee}
                  </div>
                  <div className="col-span-4 pr-2 text-right">
                    {formatNumber(talbai.talbainNiitUne)}
                  </div>
                </div>
              </div>
              <div className="absolute top-0  right-2 flex items-center justify-center rounded-full bg-gray-100  text-lg dark:bg-gray-800">
                <Popconfirm
                  title={`${talbai.kod} талбай устгах уу?`}
                  okText="Тийм"
                  cancelText="Үгүй"
                  onConfirm={() => talbaiUstgaya(index)}
                >
                  <div className="cursor-pointer text-3xl text-gray-400 transition-colors duration-300 hover:text-red-500 dark:text-gray-200 dark:hover:text-red-600">
                    <CloseCircleOutlined />
                  </div>
                </Popconfirm>
              </div>
            </div>
          );
        })}
      </div>
      <div
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="200"
        className="py-5 dark:text-gray-200"
      >
        <div className="divide-y-2 border">
          <div className="grid grid-cols-12 divide-x-2">
            <div className="col-span-4 text-center">Давхар</div>
            <div className="col-span-4 text-center">
              m<sup>2</sup>
            </div>
            <div className="col-span-4 text-center">Нийт төлбөр</div>
          </div>
          <div className="grid grid-cols-12 divide-x-2">
            <div className="col-span-4 text-center text-base font-medium">
              {value.davkhar}
            </div>
            <div className="col-span-4 text-center text-base font-medium">
              {value.talbainKhemjee}
            </div>
            <div className="col-span-4 pr-2 text-right text-base font-medium">
              {formatNumber(value.sariinTurees)}
            </div>
          </div>
        </div>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="600">
        <Form.Item
          rules={[{ required: true, message: "Зориулалт бүртгэнэ үү!" }]}
          label="Зориулалт"
          name="zoriulalt"
        >
          <Input placeholder="Зориулалт" />
        </Form.Item>
      </div>
      <Form.Item wrapperCol={{ span: 24 }}>
        <div
          className="flex w-full flex-row justify-between"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="700"
        >
          <Button
            onClick={prev}
            icon={<ArrowLeftOutlined />}
            className="mr-4 dark:text-gray-200 dark:hover:text-gray-800"
          >
            Гэрээний хугацаа
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<ArrowRightOutlined />}
          >
            Зардал бүртгэл
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
