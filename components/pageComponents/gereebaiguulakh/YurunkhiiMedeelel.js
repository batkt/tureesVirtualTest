import { Form, Input, Switch, Button, Upload } from "antd";
import {
  UploadOutlined,
  SolutionOutlined,
  ArrowRightOutlined,
  MailOutlined,
} from "@ant-design/icons";
import React from "react";
import uilchilgee, { url, aldaaBarigch } from "services/uilchilgee";
import FormLavlakh from "components/FormLavlakh";
import { useEffect } from "react";
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

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

const YurunkhiiMedeele = ({
  token,
  next,
  onChange,
  value,
  baiguullaga,
  barilgiinId,
}) => {
  const [form] = Form.useForm();
  const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(
    value.baiguullagaEsekh
  );

  function onChangeRegister({ target }) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      uilchilgee(token)
        .get("/khariltsagch", {
          params: {
            query: {
              barilgiinId,
              baiguullagiinId: baiguullaga._id,
              register: target.value,
            },
            select: { ner: 1, utas: 1, ovog: 1, mail: 1 },
          },
        })
        .then(({ data }) => {
          if (data?.jagsaalt.length > 0) {
            const { ner, utas, ovog, mail } = data?.jagsaalt[0];
            var onookhKhariltsagch = {
              ner,
              utas,
              ovog,
              mail,
              register: target.value,
            };
            form.setFieldsValue(onookhKhariltsagch);
            onChange({ ...value, ...onookhKhariltsagch });
          }
        })
        .catch(aldaaBarigch);
    }, 300);
  }
  useEffect(() => {
    Aos.init();
  });

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onValuesChange={(values) => onChange({ ...value, ...values })}
    >
      <Form.Item
        name="gereeniiDugaar"
        label="Гэрээний дугаар"
        data-aos="fade-right"
        data-aos-delay="200"
      >
        <Input
          allowClear
          placeholder="Гэрээний дугаар"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      <Form.Item
        name="baiguullagaEsekh"
        label="Байгууллага эсэх"
        valuePropName="checked"
        data-aos="fade-right"
        data-aos-delay="300"
      >
        <Switch onChange={setBaiguullagaEsekh} />
      </Form.Item>
      <Form.Item
        name="ner"
        hidden={!baiguullagaEsekh}
        label="Байгууллага нэр"
        data-aos="fade-right"
      >
        <Input
          allowClear
          placeholder="Байгууллага нэр"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      {!baiguullagaEsekh && (
        <div data-aos="fade-right" data-aos-delay="100">
          <Form.Item
            hidden={baiguullagaEsekh}
            name="register"
            label="Регистр"
            rules={[
              {
                required: true,
                len: 10,
                pattern: new RegExp("([А-Я|Ө|Ү]{2})(\\d{8})"),
                message: "Регистр бүртгэнэ үү!",
              },
            ]}
          >
            <Input
              allowClear
              maxLength={10}
              placeholder="Регистр"
              prefix={<SolutionOutlined />}
              onChange={onChangeRegister}
            />
          </Form.Item>
        </div>
      )}
      {baiguullagaEsekh && (
        <Form.Item
          hidden={!baiguullagaEsekh}
          name="register"
          label="Регистр"
          rules={[
            {
              required: true,
              len: 7,
              pattern: new RegExp("(\\d{7})"),
              message: "Регистр бүртгэнэ үү!",
            },
          ]}
          data-aos="fade-right"
          data-aos-delay="200"
        >
          <Input
            allowClear
            maxLength={7}
            placeholder="Регистр"
            prefix={<SolutionOutlined />}
            onChange={onChangeRegister}
          />
        </Form.Item>
      )}
      <Form.Item
        hidden={baiguullagaEsekh}
        name="ovog"
        label="Овог"
        data-aos="fade-right"
        data-aos-delay="500"
      >
        <Input allowClear placeholder="Овог" prefix={<SolutionOutlined />} />
      </Form.Item>
      <Form.Item
        hidden={baiguullagaEsekh}
        name="ner"
        label="Нэр"
        data-aos="fade-right"
        data-aos-delay="600"
      >
        <Input allowClear placeholder="Нэр" prefix={<SolutionOutlined />} />
      </Form.Item>
      <Form.Item
        hidden={!baiguullagaEsekh}
        name="zakhirliinOvog"
        label="Захирлын овог"
        data-aos="fade-right"
        data-aos-delay="300"
      >
        <Input allowClear placeholder="Овог" prefix={<SolutionOutlined />} />
      </Form.Item>
      <Form.Item
        hidden={!baiguullagaEsekh}
        name="zakhirliinNer"
        label="Захирлын нэр"
        data-aos="fade-right"
        data-aos-delay="400"
      >
        <Input allowClear placeholder="Нэр" prefix={<SolutionOutlined />} />
      </Form.Item>
      <Form.Item
        name="utas"
        hidden={baiguullagaEsekh}
        label="Утас"
        data-aos="fade-right"
        data-aos-delay="700"
      >
        <Input allowClear placeholder="Утас" prefix={<SolutionOutlined />} />
      </Form.Item>
      <Form.Item
        hidden={!baiguullagaEsekh}
        name="utas"
        label="Утас"
        data-aos="fade-right"
        data-aos-delay="700"
      >
        <Input allowClear placeholder="Утас" prefix={<SolutionOutlined />} />
      </Form.Item>
      <Form.Item
        name="mail"
        hidden={baiguullagaEsekh}
        label="И-мэйл хаяг"
        data-aos="fade-right"
        data-aos-delay="800"
      >
        <Input
          type="email"
          placeholder="И-мэйл хаяг"
          allowClear
          prefix={<MailOutlined />}
        />
      </Form.Item>
      <Form.Item
        name="mail"
        hidden={!baiguullagaEsekh}
        label="И-мэйл хаяг"
        data-aos="fade-right"
        data-aos-delay="800"
      >
        <Input
          type="email"
          placeholder="И-мэйл хаяг"
          allowClear
          prefix={<MailOutlined />}
        />
      </Form.Item>
      <Form.Item
        name="dans"
        hidden={baiguullagaEsekh}
        label="Төлөлт хийх данс"
        data-aos="fade-right"
        data-aos-delay="900"
      >
        <FormLavlakh
          lavlakh="dans"
          token={token}
          valKey="dugaar"
          infoKey="dugaar"
          shuukhTalbaruud={["dugaar", "dansniiNer"]}
          InfoComponent={({ data }) => {
            if (data)
              return (
                <div className="flex flex-row items-center space-x-2 p-1 font-medium">
                  <img
                    className="h-5 w-5"
                    alt="logo"
                    src={`/${data?.bank}.png`}
                  />
                  <div>{data?.dansniiNer}</div>
                  <div>{data?.dugaar}</div>
                  <div>{data?.valyut}</div>
                </div>
              );
            return null;
          }}
        />
      </Form.Item>
      <Form.Item
        name="dans"
        hidden={!baiguullagaEsekh}
        label="Төлөлт хийх данс"
        data-aos="fade-right"
        data-aos-delay="900"
      >
        <FormLavlakh
          lavlakh="dans"
          token={token}
          valKey="dugaar"
          infoKey="dugaar"
          shuukhTalbaruud={["dugaar", "dansniiNer"]}
          InfoComponent={({ data }) => {
            if (data)
              return (
                <div className="flex flex-row items-center space-x-2 p-1 font-medium">
                  <img
                    className="h-5 w-5"
                    alt="logo"
                    src={`/${data?.bank}.png`}
                  />
                  <div>{data?.dansniiNer}</div>
                  <div>{data?.dugaar}</div>
                  <div>{data?.valyut}</div>
                </div>
              );
            return null;
          }}
        />
      </Form.Item>
      <Form.Item
        hidden={!baiguullagaEsekh}
        name="gerchilgeeniiZurag"
        label="Гэрчилгээний хуулбар"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="Гэрчилгээний хуулбар"
        data-aos="fade-right"
        data-aos-delay="500"
      >
        <Upload
          multiple={false}
          name="file"
          listType="picture"
          action={`${url}/zuragKhadgalya`}
          method="POST"
          data={{ turul: "gerchilgeeniiZurag" }}
          headers={{ Authorization: `bearer ${token}` }}
        >
          <Button icon={<UploadOutlined />}>Файл сонгох</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        label="Хавсаргал"
        hidden={baiguullagaEsekh}
        className="w-full"
        data-aos="fade-right"
        data-aos-delay="1000"
      >
        <Form.Item
          name="zuvshuurliinZurag"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Зөвшөөрлийн бичгийн хуулбар"
        >
          <Upload
            multiple={false}
            name="file"
            listType="picture"
            action={`${url}/zuragKhadgalya`}
            method="POST"
            data={{ turul: "zuvshuurliinZurag" }}
            headers={{ Authorization: `bearer ${token}` }}
          >
            <Button icon={<UploadOutlined />}>Файл сонгох</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="unemlekhniiZurag"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Иргэний үнэмлэхний хуулбар"
        >
          <Upload
            multiple={false}
            name="file"
            listType="picture"
            action={`${url}/zuragKhadgalya`}
            method="POST"
            data={{ turul: "unemlekhniiZurag" }}
            headers={{ Authorization: `bearer ${token}` }}
          >
            <Button icon={<UploadOutlined />}>Файл сонгох</Button>
          </Upload>
        </Form.Item>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <div className="flex w-full justify-end">
          <Button
            type="primary"
            htmlType="submit"
            icon={<ArrowRightOutlined />}
            onClick={() => next()}
          >
            Гэрээний хугацаа
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default YurunkhiiMedeele;
