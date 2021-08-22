import { Form, Select, Button, Input, InputNumber } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import useLanguu from "hooks/useLanguu";

const formItemLayout = {
  labelCol: {
    span: 16,
  },
  wrapperCol: {
    span: 8,
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
  const { languuniiGaralt, setLanguuKhuudaslalt } = useLanguu(
    token,
    baiguullaga?._id
  );

  const onFinish = (values) => {
    values.baritsaaAvakhDun = values.talbainNiitUne;
    values.sariinTurees = values.talbainNiitUne;
    onChange({ ...value, ...values });
    next();
  };

  const onChangeLanguu = (v) => {
    var languu = languuniiGaralt.jagsaalt.find((a) => a._id === v);
    languu.languuniiDugaar = languu.kod;
    form.setFieldsValue(languu);
    onChange({ ...value, ...languu });
  };

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onValuesChange={(values) => onChange({ ...value, ...values })}
      onFinish={onFinish}
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
          onSearch={(search) => setLanguuKhuudaslalt((a) => ({ ...a, search }))}
          onChange={onChangeLanguu}
        >
          {languuniiGaralt?.jagsaalt?.map((mur) => {
            return <Select.Option key={mur._id}>{mur.kod}</Select.Option>;
          })}
        </Select>
      </Form.Item>
      <Form.Item label="Лангууний дугаар" name="languuniiDugaar">
        <Input />
      </Form.Item>
      <Form.Item label="Талбайн нэгж үнэ" name="talbainNegjUne">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Талбайн нийт үнэ" name="talbainNiitUne">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Талбайн хэмжээ" name="talbainKhemjee">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Давхар" name="davkhar">
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item noStyle className="w-full flex flex-row justify-between">
        <Button onClick={prev} icon={<ArrowLeftOutlined />} className="mr-4">
          Гэрээний хугацаа
        </Button>
        <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
          Барьцаа бүртгэл
        </Button>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
