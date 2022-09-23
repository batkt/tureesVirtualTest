import React, { useEffect, useState } from "react";
import Admin from "components/Admin";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import LocationPicker from "components/ant/LocationPicker";
import _ from "lodash";
import {
  Button,
  Form,
  Input,
  InputNumber,
  notification,
  Table,
  Upload,
  message,
  TimePicker,
  Image,
} from "antd";
import { EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import updateMethod from "tools/function/crud/updateMethod";
import { useRouter } from "next/router";
import { url } from "services/uilchilgee";

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const format = "HH:mm";

function GereeBaiguulakh({ token }) {
  const { baiguullaga } = useAuth();
  const router = useRouter();
  const { barilga } = router.query;
  const [davkhar, setDavkhar] = useState(
    _.get(baiguullaga, `barilguud.${barilga}.davkharuud`)?.filter(
      (a) => !a.davkhar.includes("B")
    ) || []
  );
  const [bdavkhar, setBDavkhar] = useState(
    _.get(baiguullaga, `barilguud.${barilga}.davkharuud`)?.filter(
      (a) => !!a.davkhar.includes("B")
    ) || []
  );

  const [plantZurag, setPlantZurag] = useState();

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

  function planZuragKharakh(e, planZurag) {
    e.preventDefault();
    e.stopPropagation();
    setPlantZurag(planZurag);
  }

  function onChangePlan(mur, index, v) {
    if (_.isString(mur?.davkhar) && mur?.davkhar?.includes("B")) {
      const index = bdavkhar.findIndex((a) => a.davkhar === mur?.davkhar);
      bdavkhar[index].planZurag = v[0];
      setBDavkhar(bdavkhar);
    } else {
      const index = davkhar.findIndex((a) => a.davkhar === mur?.davkhar);
      davkhar[index].planZurag = v[0];
      setDavkhar(davkhar);
    }
  }

  function onFinish() {
    khadgalya();
  }

  function khadgalya() {
    const burtgekhBarilga = form.getFieldsValue();
    burtgekhBarilga.davkharuud = [...davkhar, ...bdavkhar];
    if (!baiguullaga?.barilguud) baiguullaga.barilguud = [];

    if (barilga === "new") baiguullaga?.barilguud.push(burtgekhBarilga);
    else {
      const { _id } = _.get(baiguullaga, `barilguud.${barilga}`);
      _.set(burtgekhBarilga, `_id`, _id);
      _.set(baiguullaga, `barilguud.${barilga}`, burtgekhBarilga);
    }

    updateMethod("baiguullaga", token, baiguullaga).then(({ data }) => {
      if (data === "Amjilttai") {
        notification.success({ message: "Амжилттай хадгаллаа" });
        router.back();
      } else notification.warning({ message: "Алдаа гарлаа" });
    });
  }

  function m2Uurchilyu(v, mur) {
    if (_.isString(mur?.davkhar) && mur?.davkhar?.includes("B")) {
      const index = bdavkhar.findIndex((a) => a.davkhar === mur?.davkhar);
      bdavkhar[index].tariff = v;
      setBDavkhar(bdavkhar);
    } else {
      const index = davkhar.findIndex((a) => a.davkhar === mur?.davkhar);
      davkhar[index].tariff = v;
      setDavkhar(davkhar);
    }
  }

  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Гэрээ байгуулах"
      className="grid grid-cols-12 gap-6 p-5"
      hideSearch
      dedKhuudas
    >
      <div className="box col-span-12 p-5 md:col-span-6 xl:col-span-4">
        <div className="mb-5 text-lg font-medium">
          <label>Барилга бүртгэл</label>
        </div>
        <Form
          form={form}
          onFinish={onFinish}
          name="barilga"
          {...formItemLayout}
          onValuesChange={onChange}
          initialValues={{
            ..._.get(baiguullaga, `barilguud.${barilga}`),
            davkhar: davkhar?.length,
            bdavkhar: bdavkhar?.length,
          }}
        >
          <Form.Item
            rules={[{ required: true, message: "Барилгын нэр оруулна уу!" }]}
            name="ner"
            label="Нэр"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Барилгын Регистр оруулна уу!" },
            ]}
            name="register"
            label="Регистр"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Барилгын Давхарын тоо оруулна уу!" },
            ]}
            name="davkhar"
            label="Давхар"
          >
            <InputNumber min={1} defaultValue={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Барилгын B Давхарын тоо оруулна уу!",
              },
            ]}
            name="bdavkhar"
            label="B Давхар"
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Барилгын талбайн хэмжээ оруулна уу!",
              },
            ]}
            name="niitTalbai"
            label={
              <label>
                Нийт м<sup>2</sup>
              </label>
            }
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Барилгын Нээх цаг оруулна уу!" },
            ]}
            name="NeekhTsag"
            label="Нээх цаг"
          >
            <TimePicker
              placeholder="Нээх цаг"
              style={{ width: "100%" }}
              format={format}
            />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Барилгын Хаах цаг оруулна уу!" },
            ]}
            name="KhaakhTsag"
            label="Хаах цаг"
          >
            <TimePicker
              placeholder="Хаах цаг"
              style={{ width: "100%" }}
              format={format}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Барилгын Хаяг оруулна уу!" }]}
            name="khayag"
            label="Хаяг"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="bairshil" label="Байршил">
            <LocationPicker />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 16,
              offset: 8,
            }}
          >
            <Button htmlType="submit" type="primary">
              Хадгалах
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="box col-span-12 hidden p-5 md:col-span-6 md:block xl:col-span-8">
        <Table
          size="small"
          pagination={{ pageSize: 100 }}
          columns={[
            { title: "Давхар", dataIndex: "davkhar" },
            {
              title: <label>Нэгж үнэ</label>,

              dataIndex: "tariff",
              render(utga, mur, index) {
                return (
                  <InputNumber
                    placeholder="m2 Үнэ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    defaultValue={utga}
                    onChange={(v) => m2Uurchilyu(v, mur)}
                  />
                );
              },
            },
            {
              title: "План зураг",
              dataIndex: "planZurag",
              render(planZurag, mur, index) {
                return (
                  <Upload
                    multiple={false}
                    name="file"
                    action={`${url}/zuragKhadgalya`}
                    method="POST"
                    data={{ turul: "plan" }}
                    headers={{ Authorization: `bearer ${token}` }}
                    onChange={(v) =>
                      onChangePlan(
                        mur,
                        index,
                        v.fileList.map((v) => v.response?.id)
                      )
                    }
                  >
                    <div className="flex flex-row space-x-2">
                      {!planZurag && (
                        <Button icon={<UploadOutlined />}>
                          План зураг оруулах
                        </Button>
                      )}
                      {!!planZurag && (
                        <Button
                          icon={<EyeOutlined />}
                          onClick={(e) => planZuragKharakh(e, planZurag)}
                        >
                          План зураг харах
                        </Button>
                      )}
                      {!!planZurag && <Button icon={<EditOutlined />}></Button>}
                    </div>
                  </Upload>
                );
              },
            },
          ]}
          dataSource={[...davkhar, ...bdavkhar]}
        />
        <Image
          width={200}
          style={{ display: "none" }}
          preview={{
            visible: !!plantZurag,
            src: `${url}/zuragAvya/plan/${baiguullaga?._id}/${plantZurag}`,
            onVisibleChange: () => {
              setPlantZurag(undefined);
            },
          }}
        />
      </div>
    </Admin>
  );
}

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx);

export default GereeBaiguulakh;
