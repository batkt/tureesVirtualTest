import { Form, Select, Button, Input, InputNumber, notification } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import { toWords } from "mon_num";
import useTalbai from "hooks/useTalbai";
import uilchilgee from "services/uilchilgee";
import _ from "lodash";

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
  const { talbainiiGaralt, setTalbaiKhuudaslalt } = useTalbai(
    token,
    baiguullaga?._id
  );

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

  function talbainuudShalgaya(talbainuud, talbainDugaar) {
    let sultalbainuud = [];
    talbainuud.forEach((mur, index) => {
      if (talbainuud.length > index)
        sulEsekh(mur.kod, () => {
          sultalbainuud.push(mur);
          if (talbainuud.length - 1 === index)
            talbainBurtgelBugulyu(sultalbainuud, talbainDugaar);
        });
    });
  }

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
      ? [...new Set(target.value.split(","))]
      : target.value;
    uilchilgee(token)
      .get("/talbai", {
        params: {
          query: {
            kod: talbainDugaaruud,
            barilgiinId,
            baiguullagiinId: baiguullaga._id,
          },
        },
      })
      .then((a) => a.data)
      .then((talbainuud) => {
        if (talbainuud?.jagsaalt?.length === 0) utgaTseverleye();
        talbainuudShalgaya(talbainuud?.jagsaalt, target.value);
      });
  }

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onValuesChange={(values) => onChange({ ...value, ...values })}
    >
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
      <Form.Item label="Талбайн нэгж үнэ" name="talbainNegjUne">
        <InputNumber
          placeholder="Талбайн нэгж үнэ"
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Талбайн нийт үнэ" name="talbainNiitUne">
        <InputNumber
          placeholder="Талбайн нийт үнэ"
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Талбайн хэмжээ" name="talbainKhemjee">
        <InputNumber
          placeholder="Талбайн хэмжээ"
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Давхар" name="davkhar">
        <InputNumber
          placeholder="Давхар"
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Ашиглалтын зардал" name="zardliinDun">
        <InputNumber
          placeholder="Ашиглалтын зардал"
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Зориулалт" name="zoriulalt">
        <Input placeholder="Зориулалт" />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <div className="flex w-full flex-row justify-between">
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
