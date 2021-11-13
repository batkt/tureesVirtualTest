import React, { useEffect, useState } from "react";
import Admin from "components/Admin";
import readMethod from "tools/function/crud/readMethod";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import LocationPicker from "components/ant/LocationPicker";
import _ from "lodash";
import { Button, Form, Input, InputNumber, Table } from "antd";
import axios from "axios";

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function GereeBaiguulakh({ token, data }) {
  const { baiguullaga } = useAuth();
  const [davkhar, setDavkhar] = useState([]);
  const [bdavkhar, setBDavkhar] = useState([]);

  const [form] = Form.useForm();

  const onChange = (v) => {
    if (!!v?.davkhar) {
      const davkhar = new Array(v?.davkhar)
        .fill("")
        .map((a, i) => ({
          davkhar: i + 1,
          tariff: 0,
        }))
        .reverse();
      setDavkhar([...davkhar]);
    }
    if (!!v?.bdavkhar) {
      const bdavkhar = new Array(v?.bdavkhar).fill("").map((a, i) => ({
        davkhar: `B${i + 1}`,
        tariff: 0,
      }));
      setBDavkhar([...bdavkhar]);
    }
    if (!!v?.register && v?.register?.length === 7)
      axios
        .get(
          `http://103.50.205.33:8080/tatvaraasBaiguullagaAvya/${v?.register}`,
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `bearer ${token}`,
            },
          }
        )
        .then(({ data }) => {
          if (data?.found === true) form.setFieldsValue({ ner: data?.name });
        });
  };

  function khadgalya() {
    console.log(form.getFieldsValue());
  }

  function m2Uurchilyu(params) {}

  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Гэрээ байгуулах"
      className="grid grid-cols-12 gap-6 p-5"
      hideSearch
      dedKhuudas
    >
      <div className="col-span-12 md:col-span-6 xl:col-span-4 p-5 box">
        <div className="mb-5 text-lg font-medium">
          <label>Барилга бүртгэл</label>
        </div>
        <Form
          form={form}
          name="barilga"
          {...formItemLayout}
          onValuesChange={onChange}
        >
          <Form.Item name="ner" label="Нэр">
            <Input />
          </Form.Item>
          <Form.Item
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
            <Input />
          </Form.Item>
          <Form.Item name="davkhar" label="Давхар">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="bdavkhar" label="B Давхар">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="khayag" label="Хаяг">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="bairshil" label="Байршил">
            <LocationPicker />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 14,
              offset: 10,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => khadgalya()}
            >
              Хадгалах
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-8 p-5 box">
        <Table
          columns={[
            { title: "Давхар", dataIndex: "davkhar" },
            {
              title: "m2 Үнэ",
              dataIndex: "tariff",
              render() {
                return (
                  <InputNumber
                    placeholder="m2 Үнэ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                );
              },
            },
          ]}
          dataSource={[...davkhar, ...bdavkhar]}
        />
      </div>
    </Admin>
  );
}

const ugudulAvchirya = async (ctx, session) => {
  if (ctx.query.barilga === "new") return null;
  const { data } = await readMethod(
    "barilga",
    session.tureestoken,
    ctx.query.barilga
  );
  return data;
};

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx, ugudulAvchirya);

export default GereeBaiguulakh;
