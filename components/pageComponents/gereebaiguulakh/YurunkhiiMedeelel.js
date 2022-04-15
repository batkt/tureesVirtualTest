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
      <div
      data-aos="fade-right"
      data-aos-delay="200">
      <Form.Item
        name="gereeniiDugaar"
        label="Гэрээний дугаар"
      >
        <Input
          allowClear
          placeholder="Гэрээний дугаар"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      </div>
      <div
      data-aos="fade-right"
      data-aos-delay="300">
      <Form.Item
        name="baiguullagaEsekh"
        label="Байгууллага эсэх"
        valuePropName="checked"
      >
        <Switch onChange={setBaiguullagaEsekh} />
      </Form.Item>
      </div>
      <div
      data-aos="fade-right">
      <Form.Item
        name="ner"
        hidden={!baiguullagaEsekh}
        label="Байгууллага нэр"
      >
        <Input
          allowClear
          placeholder="Байгууллага нэр"
          prefix={<SolutionOutlined />}
        />
      </Form.Item>
      </div>
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
        <div
        data-aos="fade-right"
          data-aos-delay="200">
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
          
        >
          <Input
            allowClear
            maxLength={7}
            placeholder="Регистр"
            prefix={<SolutionOutlined />}
            onChange={onChangeRegister}
          />
        </Form.Item>
        </div>
      )}
      <div
       data-aos="fade-right"
       data-aos-delay="500">
      <Form.Item
        hidden={baiguullagaEsekh}
        name="ovog"
        label="Овог"
      >
        <Input allowClear placeholder="Овог" prefix={<SolutionOutlined />} />
      </Form.Item>
      </div>
      <div
       data-aos="fade-right"
       data-aos-delay="600">
      <Form.Item
        hidden={baiguullagaEsekh}
        name="ner"
        label="Нэр"
      >
        <Input allowClear placeholder="Нэр" prefix={<SolutionOutlined />} />
      </Form.Item>
      </div>
      <div
      data-aos="fade-right"
      data-aos-delay="300">
      <Form.Item
        hidden={!baiguullagaEsekh}
        name="zakhirliinOvog"
        label="Захирлын овог"
      >
        <Input allowClear placeholder="Овог" prefix={<SolutionOutlined />} />
      </Form.Item>
      </div>
      <div
       data-aos="fade-right"
       data-aos-delay="400">
      <Form.Item
        hidden={!baiguullagaEsekh}
        name="zakhirliinNer"
        label="Захирлын нэр"
      >
        <Input allowClear placeholder="Нэр" prefix={<SolutionOutlined />} />
      </Form.Item>
      </div>
      <div
        data-aos="fade-right"
        data-aos-delay="700">
      <Form.Item
        name="utas"
        hidden={baiguullagaEsekh}
        label="Утас"
      >
        <Input allowClear placeholder="Утас" prefix={<SolutionOutlined />} />
      </Form.Item>
      </div>
      <div
       data-aos="fade-right"
       data-aos-delay="700">
      <Form.Item
        hidden={!baiguullagaEsekh}
        name="utas"
        label="Утас"
      >
        <Input allowClear placeholder="Утас" prefix={<SolutionOutlined />} />
      </Form.Item>
      </div>
      <div
       data-aos="fade-right"
       data-aos-delay="800">
      <Form.Item
        name="mail"
        hidden={baiguullagaEsekh}
        label="И-мэйл хаяг"
      >
        <Input
          type="email"
          placeholder="И-мэйл хаяг"
          allowClear
          prefix={<MailOutlined />}
        />
      </Form.Item>
      </div>
      <div
       data-aos="fade-right"
       data-aos-delay="800">
      <Form.Item
        name="mail"
        hidden={!baiguullagaEsekh}
        label="И-мэйл хаяг"
      >
        <Input
          type="email"
          placeholder="И-мэйл хаяг"
          allowClear
          prefix={<MailOutlined />}
        />
      </Form.Item>
      </div>
      <div
        data-aos="fade-right"
        data-aos-delay="900">
      <Form.Item
        name="dans"
        hidden={baiguullagaEsekh}
        label="Төлөлт хийх данс"
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
      </div>
      <div
      data-aos="fade-right"
      data-aos-delay="900">
      <Form.Item
        name="dans"
        hidden={!baiguullagaEsekh}
        label="Төлөлт хийх данс"
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
      </div>
      <div
      data-aos="fade-right"
      data-aos-delay="500">
      <Form.Item
        hidden={!baiguullagaEsekh}
        name="gerchilgeeniiZurag"
        label="Гэрчилгээний хуулбар"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="Гэрчилгээний хуулбар"
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
      </div>
      <div
       data-aos="fade-right"
       data-aos-delay="1000">
      <Form.Item
        label="Хавсаргал"
        hidden={baiguullagaEsekh}
        className="w-full"
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
      </div>
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
