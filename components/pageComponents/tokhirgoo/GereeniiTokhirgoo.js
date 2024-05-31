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
import ImgCrop from "antd-img-crop";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import uilchilgee, { url } from "services/uilchilgee";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import updateMethod from "tools/function/crud/updateMethod";

function KhuviinMedeelel({
  ajiltan = {},
  token,
  barilgiinId,
  baiguullaga,
  baiguullagaMutate,
  setSongogdsonTsonkhniiIndex,
}) {
  const { t } = useTranslation();
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
          notification.success({ message: t("Амжилттай засагдлаа") });
          setGereeTokhirgoo(null);
          baiguullagaMutate();
          setSongogdsonTsonkhniiIndex(3);
        }
      });
  };

  const zuragKhadgalakh = (v, turul) => {
    if (v.file.status === "done") {
      if (turul === "tamga") {
        setTamga(v.file.response);
      } else if (turul === "gariinUseg") {
        setGariinUseg(v.file.response);
      }
    }
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
        notification.success({ message: t("Амжилттай хадгаллаа") });
        baiguullagaMutate();
        setSongogdsonTsonkhniiIndex(3);
      } else notification.warning({ message: t("Алдаа гарлаа") });
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
      <div className="col-span-12 grid grid-cols-1 xl:grid-cols-3 xl:gap-5">
        <div className="box relative col-span-2 mt-5 pb-20">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Нийтээр тохируулах")}
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Гэрээ автоматаар сунгах")}
                </div>
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
                <div className="font-medium">
                  {t("Гэрээ нийтээр засвар оруулах")}
                </div>
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
                <div className="font-medium">{t("Барьцаа авах /сараар/")}</div>
                <div className="text-gray-600">
                  {t("Гэрээ байгуулсны дараа сараар тооцож барьцаа авна")}
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
                <div className="font-medium">
                  {t("Барьцаа хөрөнгө авах эсэх")}
                </div>
                <div className="text-gray-600">
                  {t("Гэрээ байгуулахад барьцаа хөрөнгө авах эсэх")}
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
                <div className="font-medium">
                  {t("Гэрээнд 'Акт' ашиглах эсэх")}
                </div>
                <div className="text-gray-600">
                  {t("Гэрээнд дуусах үед хүлээлцэх актыг идэвхжүүлэх")}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={baiguullaga?.tokhirgoo?.aktAshiglakhEsekh}
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      aktAshiglakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`dark:border-dark-5 absolute bottom-5 right-1 flex items-center justify-end border-gray-200 px-5 pb-2 pt-2 ${
              !!gereeTokhirgoo ? "flex" : "hidden"
            }`}
          >
            <Button type="primary" onClick={gereeTokhirgooKhadgalya}>
              {t("Хадгалах")}
            </Button>
          </div>
        </div>

        <div className="box relative mt-5 pb-10 lg:mt-5">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-5 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Тамга болон гарын үсэг")}
            </h2>
          </div>
          <div className="flex justify-between p-5 ">
            <div>
              <Form form={form} autoComplete="off" className="">
                <div className="flex w-full justify-between">
                  <Form.Item name="turul">
                    <ImgCrop modalTitle="Зураг засах" rotationSlider>
                      <Upload
                        showUploadList={false}
                        multiple={false}
                        name="file"
                        action={`${url}/upload`}
                        method="POST"
                        onChange={(v) => zuragKhadgalakh(v, "tamga")}
                      >
                        <div className="flex flex-row space-x-1">
                          <Button
                            icon={<EyeOutlined />}
                            onClick={(e) =>
                              tamgaZuragKharakh(e, `tamga/${barilga.tamga}`)
                            }
                          >
                            {t("Тамга зураг харах")}
                          </Button>
                        </div>
                      </Upload>
                    </ImgCrop>
                  </Form.Item>

                  {console.log(`${url}/file?path=${kharakhZurgiinZam}`)}
                  {console.log(`${url}/file?path=${barilga.tamga}`)}

                  {(!!tamga || !!barilga.tamga) && (
                    <div className="h-[54px] w-[115px] border">
                      {!!tamga ? (
                        <>
                          <img
                            src={`${url}/file?path=tmp/${tamga}`}
                            alt="image"
                            style={{
                              height: "50px",
                              width: "115px",
                              objectFit: "contain",
                            }}
                          />
                        </>
                      ) : (
                        barilga?.tamga && (
                          <>
                            <img
                              src={`${url}/file?path=tamga/${barilga.tamga}`}
                              alt="image"
                              style={{
                                height: "50px",
                                width: "115px",
                                objectFit: "contain",
                              }}
                            />
                          </>
                        )
                      )}
                    </div>
                  )}
                </div>
                <div className="flex w-full justify-between">
                  <Form.Item name="turul">
                    <ImgCrop modalTitle="Зураг засах" rotationSlider>
                      <Upload
                        showUploadList={false}
                        multiple={false}
                        name="file"
                        action={`${url}/upload`}
                        method="POST"
                        onChange={(v) => zuragKhadgalakh(v, "gariinUseg")}
                      >
                        <div className="flex flex-row space-x-1">
                          <Button icon={<UploadOutlined />}>
                            {t("Гарын үсэг зураг оруулах")}
                          </Button>
                        </div>
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                  <div className="h-[54px] w-[115px] border">
                    {!!gariinUseg ? (
                      <img
                        src={`${url}/file?path=tmp/${gariinUseg}`}
                        alt="image"
                        style={{
                          height: "50px",
                          width: "115px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      barilga?.gariinUseg && (
                        <img
                          src={`${url}/gariinUseg/${barilga.gariinUseg}}`}
                          alt="image"
                          style={{
                            height: "50px",
                            width: "115px",
                            objectFit: "contain",
                          }}
                        />
                      )
                    )}
                  </div>

                  {/* {!!barilga?.gariinUseg ? (
                    <img
                      src={`${url}/gariinUseg/${barilga.gariinUseg}}`}
                      alt="image"
                      style={{
                        height: "104px",
                        width: "115px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    gariinUseg && (
                      <img
                        src={`${url}/file?path=tmp/${gariinUseg}`}
                        alt="image"
                        style={{
                          height: "104px",
                          width: "115px",
                          objectFit: "cover",
                        }}
                      />
                    )
                  )} */}
                </div>
              </Form>

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
                preview={{
                  visible: !!gariinUsegKharakhZam,
                  src: `${url}/file?path=${gariinUsegKharakhZam}`,
                  onVisibleChange: (value) => {
                    setGariinUsegKharakhZam(undefined);
                  },
                }}
              />
            </div>
          </div>
          <div className="absolute bottom-3 right-2 flex w-full justify-end px-3 pb-3">
            <Button onClick={khadgalakh} type="primary">
              {t("Хадгалах")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default KhuviinMedeelel;
