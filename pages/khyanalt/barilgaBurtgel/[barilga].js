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
  TimePicker,
  Image,
} from "antd";
import { EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import updateMethod from "tools/function/crud/updateMethod";
import { useRouter } from "next/router";
import uilchilgee, { url } from "services/uilchilgee";
import moment from "moment";

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
    if (!!v?.bdavkhar) {
      const value = new Array(v.bdavkhar).fill("").map((a, i) => ({
        ...(bdavkhar.find((b) => b.davkhar === `B${i + 1}`) ||
          planAvya(`B${i + 1}`,true) ||
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

  const [logo, setLogo]=useState()

  
  const logokharakh =_.get(baiguullaga, `barilguud.${barilga}`)|| [];
  

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
    let data =_.get(baiguullaga, `barilguud.${barilga}`)|| [];
    const index = baiguullaga.barilguud.findIndex(a=>a._id === data._id)
    logo && (baiguullaga.barilguud[index].logo = logo)
    
    // updateMethod("baiguullaga", token, baiguullaga).then(({ data }) => {
    //   logo && uilchilgee(token).post('/confirmFile',{filename:logo,path:'logo'})
    //   if (data === "Amjilttai") {
    //     notification.success({ message: "Амжилттай хадгаллаа" });
    //     // router.back();
    //   } else notification.warning({ message: "Алдаа гарлаа" });
    // });
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
  const [kharakhZurgiinZam , setKharakhZurgiinZam]=useState(false)
  function tamgaZuragKharakh(e,path ) {
    setKharakhZurgiinZam(path)
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
           <Form.Item label="Лого"  name="logo">
              <Upload
                      multiple={false}
                      // name="file"
                      action={`${url}/upload`}
                      method="POST"
                      onChange={(v) =>
                        setLogo(v.file.response)
                      }
                    >
                      <div className="flex flex-row space-x-1">
                          {!logokharakh?.logo && (
                          <Button icon={<UploadOutlined />}>
                          Лого зураг оруулах
                          </Button>
                        )}
                        {!!logokharakh?.logo && (
                          <Button
                            icon={<EyeOutlined />}
                            onClick={(e) => tamgaZuragKharakh(e,`logo/${logokharakh.logo}`)}
                          >
                          Тамга зураг харах
                          </Button>
                        )}
                        {!!logokharakh?.logo && <Button icon={<EditOutlined />}></Button>}
                      </div>
              </Upload>
            </Form.Item>
          
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
            { 
              required: true, 
              message: "Барилгын Давхарын тоо оруулна уу!",
              
              
            },
            ]}
            name="davkhar"
            label="Давхар"
          >  
             <InputNumber
              parser={(value) => value.includes('.') ? value.split('.')[0] : value}
              min={1}
              max={40}
              step="1"
              defaultValue={1}
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
            label="B Давхар"
          >
             <InputNumber
              parser={(value) => value.includes('.') ? value.split('.')[0] : value}
              max={30}
              step="1"
              defaultValue={1}
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
                Нийт м<sup>2</sup>
              </div>
            }
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Барилгын Нээх цаг оруулна уу!" },
            ]}
            name="neekhTsag"
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
            name="khaakhTsag"
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
              title: (
                <label>
                  Давхарын м<sup>2</sup>
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
          preview={{
            visible:!!kharakhZurgiinZam,
            src: `https://turees.zevtabs.mn/api/file?path=${kharakhZurgiinZam}`,
            onVisibleChange: value => {
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
