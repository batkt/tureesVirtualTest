import React, { useMemo, useState } from "react";
import {
  Button,
  Form,
  Image,
  InputNumber,
  notification,
  Switch,
  Upload,
} from "antd";
import uilchilgee, { url } from "services/uilchilgee";

import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import updateMethod from "tools/function/crud/updateMethod";
import { useRouter } from "next/router";

function KhuviinMedeelel({
  ajiltan = {},
  token,
  barilgiinId,
  baiguullaga,
  baiguullagaMutate,
}) {
  const { ajilchdiinGaralt, ajiltniiJagsaaltMutate } = useAjiltniiJagsaalt(
    token,
    ajiltan?.baiguullagiinId
  );

  const [form] = Form.useForm();
  const [tamga, setTamga] = useState();
  const [gariinUseg, setGariinUseg] = useState();
  const barilga = useMemo(
    () => baiguullaga.barilguud.find((a) => a._id === barilgiinId),
    [barilgiinId]
  );
  const [kharakhZurgiinZam, setKharakhZurgiinZam] = useState(false);
  const [gariinUsegKharakhZam, setGariinUsegKharakhZam] = useState(false);
  const [gereeTokhirgoo, setGereeTokhirgoo] = useState(null);


  const gereeTokhirgooKhadgalya = () => {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: gereeTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: "Амжилттай засагдлаа" });
          setGereeTokhirgoo(null);
          baiguullagaMutate();
        }
      });
  };
  function khadgalakh() {
    const index = baiguullaga.barilguud.findIndex((a) => a._id === barilgiinId);
    gariinUseg && (baiguullaga.barilguud[index].gariinUseg = gariinUseg);
    tamga && (baiguullaga.barilguud[index].tamga = tamga);
    _.set(baiguullaga, `barilguud.${index}`, baiguullaga.barilguud[index]);
    updateMethod("baiguullaga", token, baiguullaga).then(({ data }) => {
      if (data === "Amjilttai") {
        tamga &&
          uilchilgee(token).post("/confirmFile", {
            filename: tamga,
            path: "tamga",
          });
        gariinUseg &&
          uilchilgee(token).post("/confirmFile", {
            filename: gariinUseg,
            path: "gariinUseg",
          });
        notification.success({ message: "Амжилттай хадгаллаа" });
        baiguullagaMutate();
      } else notification.warning({ message: "Алдаа гарлаа" });
    });
  }
  function tamgaZuragKharakh(e, path) {
    setKharakhZurgiinZam(path);
    e.preventDefault();
    e.stopPropagation();
  }
  function gariinUsegKharakh(e, path) {
    setGariinUsegKharakhZam(path);
    e.preventDefault();
    e.stopPropagation();
  }
  return (
    <>
      <div className="col-span-12 xl:gap-5 grid grid-cols-1 xl:grid-cols-3">
        <div className="box col-span-2 mt-5">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Нийтээр тохируулах
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Гэрээ автоматаар сунгах</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    baiguullaga?.tokhirgoo?.gereeAvtomataarSungakhEsekh
                  }
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      gereeAvtomataarSungakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Гэрээ нийтээр засвар оруулах</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    baiguullaga?.tokhirgoo
                      ?.bukhAjiltanGereendZasvarOruulakhEsekh
                  }
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      bukhAjiltanGereendZasvarOruulakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Барьцаа авах /сараар/</div>
                <div className="text-gray-600">
                  Гэрээ байгуулсны дараа сараар тооцож барьцаа авна
                </div>
              </div>
              <div className="ml-auto">
                <InputNumber
                  min={0}
                  defaultValue={baiguullaga?.tokhirgoo?.baritsaaAvakhSar}
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      baritsaaAvakhSar: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Барьцаа хөрөнгө авах эсэх</div>
                <div className="text-gray-600">
                  Гэрээ байгуулахад барьцаа хөрөнгө авах эсэх
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={baiguullaga?.tokhirgoo?.baritsaaAvakhEsekh}
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      baritsaaAvakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Алдангийн хувь</div>
                <div className="text-gray-600">
                  Гэрээний төлөлт хугацаа хэтэрсэн үед тооцох алдангийн хувь
                </div>
              </div>
              <div className="ml-auto">
                <InputNumber
                  min={0}
                  max={100}
                  defaultValue={baiguullaga?.tokhirgoo?.aldangiinKhuvi}
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      aldangiinKhuvi: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Алданги чөлөөлөх хоног</div>
                <div className="text-gray-600">
                  Алданги хугацаа хэтэрсэн хоногоос хэд хоногийн дараагаас бодож
                  эхлэх хоног
                </div>
              </div>
              <div className="ml-auto">
                <InputNumber
                  min={0}
                  max={100}
                  defaultValue={baiguullaga?.tokhirgoo?.aldangiChuluulukhKhonog}
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      aldangiChuluulukhKhonog: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2 ${!!gereeTokhirgoo ? "flex" : "hidden"
              }`}
          >
            <Button type="primary" onClick={gereeTokhirgooKhadgalya}>
              Хадгалах
            </Button>
          </div>
        </div>

        <div className="box mt-5 lg:mt-5">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Тамга болон гарын үсэг
            </h2>
          </div>
          <div className="flex justify-between p-5 ">
            <div>
              <Form form={form} autoComplete="off" className="">
                <Form.Item name="turul">
                  <Upload
                    showUploadList={false}
                    multiple={false}
                    name="file"
                    action={`${url}/upload`}
                    method="POST"
                    onChange={(v) => setTamga(v.file.response)}
                    onChanged={(a) => soligdsonZurag(a.file.response)}
                  >
                    <div className="flex flex-row space-x-1">
                      {!barilga?.tamga && (
                        <Button icon={<UploadOutlined />}>
                          Тамга зураг оруулах
                        </Button>
                      )}
                      {!!barilga?.tamga && (
                        <Button
                          icon={<EyeOutlined />}
                          onClick={(e) =>
                            tamgaZuragKharakh(e, `tamga/${barilga.tamga}`)
                          }
                        >
                          Тамга зураг харах
                        </Button>
                      )}
                      {!!barilga?.tamga && (
                        <Button icon={<EditOutlined />}></Button>
                      )}
                    </div>
                  </Upload>
                </Form.Item>
                <Form.Item name="turul">
                  <Upload
                    showUploadList={false}
                    multiple={false}
                    name="file"
                    action={`${url}/upload`}
                    method="POST"
                    onChange={(v) => setGariinUseg(v.file.response)}
                  >
                    <div className="flex flex-row space-x-1">
                      {!barilga?.gariinUseg && (
                        <Button icon={<UploadOutlined />}>
                          Гарын үсэг зураг оруулах
                        </Button>
                      )}
                      {!!barilga?.gariinUseg && (
                        <Button
                          icon={<EyeOutlined />}
                          onClick={(e) =>
                            gariinUsegKharakh(
                              e,
                              `gariinUseg/${barilga.gariinUseg}`
                            )
                          }
                        >
                          Гарын үсэг зураг харах
                        </Button>
                      )}
                      {!!barilga?.gariinUseg && (
                        <Button icon={<EditOutlined />}></Button>
                      )}
                    </div>
                  </Upload>
                </Form.Item>
              </Form>

              <Image
                width={200}
                preview={{
                  visible: !!kharakhZurgiinZam,
                  src: `https://turees.zevtabs.mn/api/file?path=${kharakhZurgiinZam}`,
                  onVisibleChange: (value) => {
                    setKharakhZurgiinZam(undefined);
                  },
                }}
              />
              <Image
                width={200}
                preview={{
                  visible: !!gariinUsegKharakhZam,
                  src: `https://turees.zevtabs.mn/api/file?path=${gariinUsegKharakhZam}`,
                  onVisibleChange: (value) => {
                    setGariinUsegKharakhZam(undefined);
                  },
                }}
              />
            </div>
          </div>
          <div className="w-full flex px-3 pb-3 justify-end">
            <Button onClick={khadgalakh} type="primary">
              Хадгалах
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default KhuviinMedeelel;
