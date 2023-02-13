import React, { useCallback, useEffect, useState } from "react";
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
  TimePicker,
  Image,
  Modal,
} from "antd";
import { EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import updateMethod from "tools/function/crud/updateMethod";
import { useRouter } from "next/router";
import uilchilgee, { url } from "services/uilchilgee";
import moment from "moment";
import compareFields from "tools/function/compareFields";
import { useTranslation } from "react-i18next";

var ankhniiUtga = {
  bairshil: undefined,
  bdavkhar: undefined,
  davkhar: undefined,
  khaakhTsag: undefined,
  khayag: undefined,
  logo: undefined,
  neekhTsag: undefined,
  ner: undefined,
  niitTalbai: undefined,
  register: undefined,
};

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
  const { t } = useTranslation()
  const { baiguullaga, baiguullagaMutate } = useAuth();
  const router = useRouter();
  const { barilga } = router.query;
  const [davkhar, setDavkhar] = useState([]);
  const [bdavkhar, setBDavkhar] = useState([]);

  const [plantZurag, setPlantZurag] = useState();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!!baiguullaga) {
      let data = _.get(baiguullaga, `barilguud.${barilga}`);
      if (!!data) {
        let davkhar =
          _.get(baiguullaga, `barilguud.${barilga}.davkharuud`)?.filter(
            (a) => !a?.davkhar?.includes("B")
          ) || [];

        let bdavkhar =
          _.get(baiguullaga, `barilguud.${barilga}.davkharuud`)?.filter(
            (a) => !!a?.davkhar?.includes("B")
          ) || [];
        setDavkhar(_.cloneDeep(davkhar));
        setBDavkhar(_.cloneDeep(bdavkhar));

        data.neekhTsag = moment(data.neekhTsag);
        data.khaakhTsag = moment(data.khaakhTsag);
        form.setFieldsValue({
          ...data,
          davkhar: davkhar.length,
          bdavkhar: bdavkhar.length,
        });
        ankhniiUtga = {
          ...data,
          davkhar: davkhar.length,
          bdavkhar: bdavkhar.length,
        };
      }
    }
  }, [baiguullaga]);

  function planAvya(davkhar, bEsekh) {
    if (bEsekh) {
      let data =
        _.get(baiguullaga, `barilguud.${barilga}.davkharuud`)?.filter(
          (a) => !!a?.davkhar?.includes("B")
        ) || [];
      return data?.find((b) => b.davkhar === davkhar);
    }
    let data =
      _.get(baiguullaga, `barilguud.${barilga}.davkharuud`)?.filter(
        (a) => !a?.davkhar?.includes("B")
      ) || [];
    return data?.find((b) => b.davkhar === davkhar);
  }

  const onChange = (v) => {
    if (!!v?.davkhar) {
      const value = new Array(v?.davkhar)
        .fill("")
        .map((a, i) => ({
          ...(davkhar.find((b) => b.davkhar === `${i + 1}`) ||
            planAvya(`${i + 1}`) ||
            {}),
          davkhar: `${i + 1}`,
        }))
        .reverse();
      setDavkhar([...value]);
    }
    if (_.isNumber(v?.bdavkhar)) {
      const value = new Array(v?.bdavkhar).fill("").map((a, i) => ({
        ...(bdavkhar.find((b) => b.davkhar === `B${i + 1}`) ||
          planAvya(`B${i + 1}`, true) ||
          {}),
        davkhar: `B${i + 1}`,
      }));
      setBDavkhar([...value]);
    }
    if (!!v?.register && v?.register?.length === 7)
      axios
        .get(`/hicarapi/tatvaraasBaiguullagaAvya/${v?.register}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: `bearer ${token}`,
          },
        })
        .then(({ data }) => {
          if (data?.found === true) {
            form.setFieldsValue({ ner: data?.name });
          }
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

  const [logo, setLogo] = useState();

  const logoMedeelel = _.get(baiguullaga, `barilguud.${barilga}`) || [];

  useEffect(() => {
    form.getFieldInstance("ner").focus();
  }, []);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "barilga_ner":
          form.getFieldInstance("register").focus();
          break;
        case "barilga_register":
          form.getFieldInstance("davkhar").focus();
          break;
        case "barilga_davkhar":
          form.getFieldInstance("bdavkhar").focus();
          break;
        case "barilga_bdavkhar":
          form.getFieldInstance("niitTalbai").focus();
          break;
        case "barilga_niitTalbai":
          form.getFieldInstance("neekhTsag").focus();
          break;
        case "barilga_khayag":
          document.getElementById("barilgaButton").focus();
          break;
        default:
          break;
      }
    }
  }, []);

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
    let data = _.get(baiguullaga, `barilguud.${barilga}`) || [];
    const index = baiguullaga.barilguud.findIndex((a) => a._id === data._id);
    logo && (baiguullaga.barilguud[index].logo = logo);
    updateMethod("baiguullaga", token, baiguullaga)
      .then(({ data }) => {
        logo &&
          uilchilgee(token).post("/confirmFile", {
            filename: logo,
            path: "logo",
          });
        if (data === "Amjilttai") {
          notification.success({ message: "Амжилттай хадгаллаа" });
          router.back();
        } else notification.warning({ message: "Алдаа гарлаа" });
      })
      .finally(() => baiguullagaMutate());
  }

  function m2Uurchilyu(v, mur) {
    if (_.isString(mur?.davkhar) && mur?.davkhar?.includes("B")) {
      const index = bdavkhar.findIndex((a) => a.davkhar === mur?.davkhar);
      bdavkhar[index].talbai = v;
      setBDavkhar(bdavkhar);
    } else {
      const index = davkhar.findIndex((a) => a.davkhar === mur?.davkhar);
      davkhar[index].talbai = v;
      setDavkhar(davkhar);
    }
  }
  function garya() {
    const values = form.getFieldsValue();
    if (
      compareFields(values, ankhniiUtga, [
        "bairshil",
        "bdavkhar",
        "davkhar",
        "khaakhTsag",
        "khayag",
        "logo",
        "neekhTsag",
        "ner",
        "niitTalbai",
        "register",
      ])
    )
      Modal.confirm({
        content: `Та гарахдаа итгэлтэй байна уу?`,
        okText: "Тийм",
        cancelText: "Үгүй",
        onOk: router.back,
      });
    else router.back();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [ankhniiUtga]);
  const [kharakhZurgiinZam, setKharakhZurgiinZam] = useState(false);
  function logoZuragKharakh(e, path) {
    setKharakhZurgiinZam(path);
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Барилга бүртгэл"
      className="grid grid-cols-12 gap-6 p-5"
      hideSearch
      dedKhuudas
    >
      <div className="box col-span-12 p-5 md:col-span-6 xl:col-span-4">
        <div className="mb-5 text-lg font-medium">
          <label>Барилга бүртгэл</label>
        </div>
        <Form
          autoComplete={"off"}
          form={form}
          onFinish={onFinish}
          name="barilga"
          {...formItemLayout}
          onValuesChange={onChange}
        >
          <Form.Item label={t("Лого")} name="logo">
            <Upload
              multiple={false}
              // name="file"
              action={`${url}/upload`}
              method="POST"
              onChange={(v) => setLogo(v.file.response)}
            >
              <div className="flex flex-row space-x-1">
                {!logoMedeelel?.logo && (
                  <Button icon={<UploadOutlined />}>{t("Лого зураг оруулах")}</Button>
                )}
                {!!logoMedeelel?.logo && (
                  <Button
                    icon={<EyeOutlined />}
                    onClick={(e) =>
                      logoZuragKharakh(e, `logo/${logoMedeelel.logo}`)
                    }
                  >
                    Тамга зураг харах
                  </Button>
                )}
                {!!logoMedeelel?.logo && (
                  <Button icon={<EditOutlined />}></Button>
                )}
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Барилгын нэр оруулна уу!" }]}
            name="ner"
            label={t("Нэр")}
          >
            <Input onKeyUp={focuser} />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Барилгын Регистр оруулна уу!" },
            ]}
            name="register"
            label={t("Регистр")}
          >
            <Input onKeyUp={focuser} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Барилгын Давхарын тоо оруулна уу!",
              },
            ]}
            name="davkhar"
            label={t("Давхар")}
          >
            <InputNumber
              onKeyUp={focuser}
              parser={(value) =>
                value.includes(".") ? value.split(".")[0] : value
              }
              min={1}
              max={40}
              step="1"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Барилгын B Давхарын тоо оруулна уу!",
              },
            ]}
            name="bdavkhar"
            label={t("B Давхар")}
          >
            <InputNumber
              onKeyUp={focuser}
              parser={(value) =>
                value.includes(".") ? value.split(".")[0] : value
              }
              min={0}
              max={30}
              step="1"
              style={{ width: "100%" }}
            />
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
              <div className="text-black dark:text-gray-400">
                {t("Нийт м")}<sup>2</sup>
              </div>
            }
          >
            <InputNumber onKeyUp={focuser} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Барилгын Нээх цаг оруулна уу!" },
            ]}
            name="neekhTsag"
            label={t("Нээх цаг")}
          >
            <TimePicker
              onChange={() => form.getFieldInstance("khaakhTsag").focus()}
              placeholder={t("Нээх цаг")}
              style={{ width: "100%" }}
              format={format}
            />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Барилгын Хаах цаг оруулна уу!" },
            ]}
            name="khaakhTsag"
            label={t("Хаах цаг")}
          >
            <TimePicker
              onChange={() => form.getFieldInstance("khayag").focus()}
              placeholder={t("Хаах цаг")}
              style={{ width: "100%" }}
              format={format}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Барилгын Хаяг оруулна уу!" }]}
            name="khayag"
            label={t("Хаяг")}
          >
            <Input.TextArea onKeyDown={focuser} />
          </Form.Item>
          <Form.Item name="bairshil" label={t("Байршил")}>
            <LocationPicker />
          </Form.Item>
          <Form.Item className="flex w-full justify-end">
            <Button
              id="barilgaButton"
              onClick={() => form.submit()}
              type="primary"
            >
              {t("Хадгалах")}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="box col-span-12 hidden p-5 md:col-span-6 md:block xl:col-span-8">
        <Table
          size="small"
          pagination={{ pageSize: 100 }}
          columns={[
            { title: t("Давхар"), dataIndex: "davkhar" },
            {
              title: (
                <label>
                  {t("Давхарын м")}<sup>2</sup>
                </label>
              ),
              dataIndex: "talbai",
              render(utga, mur, index) {
                return (
                  <InputNumber
                    placeholder="м2"
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
              title: t("План зураг"),
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
          preview={{
            visible: !!kharakhZurgiinZam,
            src: `${url}/file?path=${kharakhZurgiinZam}`,
            onVisibleChange: (value) => {
              setKharakhZurgiinZam(undefined);
            },
          }}
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
