import { Form, Button, Input, InputNumber } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { toWords } from "mon_num";
import uilchilgee from "services/uilchilgee";
import _ from "lodash";
import Aos from "aos";

var timeout = null;

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const YurunkhiiMedeele = ({
  token,
  baiguullaga,
  next,
  prev,
  onChange,
  value,
  barilgiinId,
}) => {
  const [form] = Form.useForm();

  function talbainBurtgelBugulyu(talbainuud, talbainDugaar) {
    var talbai = {};
    talbainuud?.forEach((a) => {
      talbai.baritsaaAvakhDun =
        (talbai?.talbainNiitUne || 0) + a.talbainNiitUne;
      talbai.sariinTurees = (talbai?.talbainNiitUne || 0) + a.talbainNiitUne;
      talbai.talbainNegjUne = (talbai?.talbainNegjUne || 0) + a.talbainNegjUne;
      talbai.talbainNiitUne = (talbai?.talbainNiitUne || 0) + a.talbainNiitUne;
      talbai.talbainKhemjee = (talbai?.talbainKhemjee || 0) + a.talbainKhemjee;
      talbai.davkhar =
        (!!talbai?.davkhar ? `${talbai?.davkhar},` : "") + a.davkhar;
    });
    talbai.talbainNegjUneUsgeer = toWords(talbai.talbainNegjUne);
    talbai.talbainNiitUneUsgeer = toWords(talbai.talbainNiitUne);
    talbai.davkhar = talbai.davkhar?.includes(",")
      ? [...new Set(talbai.davkhar.split(","))].join(",")
      : talbai.davkhar;
    talbai.talbainDugaar = talbainDugaar;
    form.setFieldsValue(talbai);
    onChange({ ...value, ...talbai });
  }

  function utgaTseverleye() {
    var talbai = {};
    talbai.baritsaaAvakhDun = 0;
    talbai.sariinTurees = 0;
    talbai.talbainNegjUne = 0;
    talbai.talbainNiitUne = 0;
    talbai.talbainKhemjee = 0;
    talbai.talbainNegjUneUsgeer = toWords(0);
    talbai.talbainNiitUneUsgeer = toWords(0);
    talbai.davkhar = 0;
    form.setFieldsValue(talbai);
    onChange({ ...value, ...talbai });
  }

  function talbainDugaarUurchilyu({ target }) {
    if (typeof target.value !== "string") {
      utgaTseverleye();
      return;
    }
    const talbainDugaaruud = target.value?.includes(",")
      ? [...new Set(target.value.split(","))].map((mur) => ({
          kod: { $eq: mur },
        }))
      : [{ kod: { $eq: target.value } }];
    uilchilgee(token)
      .get("/talbai", {
        params: {
          query: {
            $or: talbainDugaaruud,
            barilgiinId,
            baiguullagiinId: baiguullaga._id,
            idevkhiteiEsekh: false,
          },
        },
      })
      .then((a) => a.data)
      .then((talbainuud) => {
        if (talbainuud?.jagsaalt?.length === 0) utgaTseverleye();
        talbainBurtgelBugulyu(talbainuud?.jagsaalt, target.value);
      });
  }

  useEffect(() => {
    Aos.init({ once: true });
  });

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onValuesChange={(values) => onChange({ ...value, ...values })}
    >
      <div data-aos="fade-right" data-aos-duration="1000">
        <Form.Item label="Талбайн дугаар" name="talbainDugaar">
          <Input
            placeholder="Талбайн дугаар"
            onChange={(e) => {
              clearTimeout(timeout);
              timeout = setTimeout(function () {
                talbainDugaarUurchilyu(e);
              }, 300);
            }}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
        <Form.Item label="Талбайн нэгж үнэ" name="talbainNegjUne">
          <InputNumber
            placeholder="Талбайн нэгж үнэ"
            disabled
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
        <Form.Item label="Талбайн нийт үнэ" name="talbainNiitUne">
          <InputNumber
            disabled
            placeholder="Талбайн нийт үнэ"
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="300">
        <Form.Item label="Талбайн хэмжээ" name="talbainKhemjee">
          <InputNumber
            disabled
            placeholder="Талбайн хэмжээ"
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400">
        <Form.Item label="Давхар" name="davkhar">
          <InputNumber
            disabled
            placeholder="Давхар"
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="500">
        <Form.Item label="Ашиглалтын зардал" name="zardliinDun">
          <InputNumber
            disabled
            placeholder="Ашиглалтын зардал"
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="600">
        <Form.Item label="Зориулалт" name="zoriulalt">
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
          <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
            Гэрээний хугацаа
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<ArrowRightOutlined />}
            onClick={() => next()}
          >
            Барьцаа бүртгэл
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
