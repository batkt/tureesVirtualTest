import { Form, Select, Button, Input, InputNumber } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import { toWords } from "mon_num";
import useTalbai from "hooks/useTalbai";
import uilchilgee from "services/uilchilgee";

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
}) => {
  const [form] = Form.useForm();
  const { talbainiiGaralt, settalbaiKhuudaslalt } = useTalbai(
    token,
    baiguullaga?._id
  );

  const onChangetalbai = (v) => {
    var { _id, ...talbai } = talbainiiGaralt.jagsaalt.find((a) => a._id === v);
    talbai.talbainDugaar =
      (!!value?.talbainDugaar ? `${value?.talbainDugaar},` : "") + talbai.kod;
    talbai.baritsaaAvakhDun =
      (value?.talbainNiitUne || 0) + talbai.talbainNiitUne;
    talbai.sariinTurees = (value?.talbainNiitUne || 0) + talbai.talbainNiitUne;
    talbai.talbainNegjUne =
      (value?.talbainNegjUne || 0) + talbai.talbainNegjUne;
    talbai.talbainNiitUne =
      (value?.talbainNiitUne || 0) + talbai.talbainNiitUne;
    talbai.talbainNegjUneUsgeer = toWords(talbai.talbainNegjUne);
    talbai.talbainNiitUneUsgeer = toWords(talbai.talbainNiitUne);
    form.setFieldsValue(talbai);
    onChange({ ...value, ...talbai });
  };

  function talbainDugaarUurchilyu({ target }) {
    if (typeof target.value !== "string") return;
    const talbainDugaaruud = target.value?.includes(",")
      ? [...new Set(target.value.split(","))]
      : target.value;
    uilchilgee(token)
      .get("/talbai", {
        params: {
          query: {
            kod: talbainDugaaruud,
            baiguullagiinId: baiguullaga._id,
          },
        },
      })
      .then((a) => a.data)
      .then((talbainuud) => {
        var talbai = {};
        talbainuud?.jagsaalt?.forEach((a) => {
          talbai.baritsaaAvakhDun =
            (talbai?.talbainNiitUne || 0) + a.talbainNiitUne;
          talbai.sariinTurees =
            (talbai?.talbainNiitUne || 0) + a.talbainNiitUne;
          talbai.talbainNegjUne =
            (talbai?.talbainNegjUne || 0) + a.talbainNegjUne;
          talbai.talbainNiitUne =
            (talbai?.talbainNiitUne || 0) + a.talbainNiitUne;
          talbai.talbainKhemjee =
            (talbai?.talbainKhemjee || 0) + a.talbainKhemjee;
          talbai.davkhar =
            (!!talbai?.davkhar ? `${talbai?.davkhar},` : "") + a.davkhar;
        });
        talbai.talbainNegjUneUsgeer = toWords(talbai.talbainNegjUne);
        talbai.talbainNiitUneUsgeer = toWords(talbai.talbainNiitUne);
        talbai.davkhar = talbai.davkhar.includes(",")
          ? [...new Set(talbai.davkhar.split(","))].join(",")
          : talbai.davkhar;
        talbai.talbainDugaar = target.value;
        form.setFieldsValue(talbai);
        onChange({ ...value, ...talbai });
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
      <Form.Item label="Түрээсийн талбай" name="tureesiinTalbainId">
        <Select
          showSearch
          placeholder="Талбай сонгох"
          className="w-full"
          placeholder="Талбай сонгох"
          size="large"
          value={null}
          filterOption={(o) => o}
          onSearch={(search) => settalbaiKhuudaslalt((a) => ({ ...a, search,khuudasniiDugaar:1 }))}
          onChange={onChangetalbai}
        >
          {talbainiiGaralt?.jagsaalt?.map((mur) => {
            return <Select.Option key={mur._id}>{mur.kod}</Select.Option>;
          })}
        </Select>
      </Form.Item>
      <Form.Item label="Талбайн дугаар" name="talbainDugaar">
        <Input placeholder="Талбайн дугаар" onChange={talbainDugaarUurchilyu} />
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
        <div className="w-full flex flex-row justify-between">
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
