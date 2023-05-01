import { Button, Checkbox, message, Switch } from "antd";
import Admin from "components/Admin";
import { useRouter } from "next/router";
import React, { useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee from "services/uilchilgee";
import readMethod from "tools/function/crud/readMethod";
import { useAuth } from "services/auth";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import useKhuudasniiJagsaalt from "hooks/useKhuudasniiJagsaalt";
import formatNumber from "tools/function/formatNumber";

function index({ token, data }) {
  const { khuudasniiJagsaalt } = useKhuudasniiJagsaalt(token)
  const router = useRouter();
  const { t } = useTranslation()
  const [targetKeys, setTargetKeys] = useState(_.cloneDeep(data?.tsonkhniiErkhuud) || []);
  const [tokhirgoo, setTokhirgoo] = useState(data?.tokhirgoo || {});
  const { baiguullaga } = useAuth();
  const [barilgiinErkh, setBarilgiinErkh] = useState(data?.barilguud || []);
  const [erkhuud, setErkhuud] = useState([])
  const barilguud = baiguullaga?.barilguud;

  const khadgalya = () => {
    uilchilgee(token)
      .post(`/ajiltandErkhUgyu/${data?._id}`, {
        tsonkhniiErkhuud: targetKeys,
        erkhuud: erkhuud,
        barilguud: barilgiinErkh,
        tokhirgoo,
      })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          message.success(t("Бүртгэл амжилттай хийгдлээ"));
          router.back();
        }
      });
  };

  return (
    <Admin
      title={"Ажилтны эрхийн тохиргоо"}
      dedKhuudas
      className="p-5 pb-10 lg:pb-0"
    >
      <div className="box col-span-12 lg:col-span-4 2xl:col-span-3 flex-row items-center p-2">
        <div className=" font-medium">
          <div className="flex flex-col gap-3">
            <div className="px-3 py-1 flex items-center gap-3 text-black font-medium dark:text-white dark:text-opacity-90">
              <div className="w-1/2">
                <div className="flex my-1 border-l-2 border-green-500 pl-2 gap-2">
                  <div>{t("Овог")}:</div> <div className="font-normal text-gray-600 dark:text-gray-300">{data?.ovog}</div>
                </div>
                <div className="flex my-1 border-l-2 border-green-500 pl-2 gap-2">
                  <div>{t("Нэр")}:</div> <div className="font-normal text-gray-600 dark:text-gray-300">{data?.ner}</div>
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex my-1 border-l-2 border-green-500 pl-2 gap-2">
                  <div>{t("Албан тушаал")}:</div> <div className="font-normal text-gray-600 dark:text-gray-300">{data?.albanTushaal}</div>
                </div>
                <div className="flex my-1 border-l-2 border-green-500 pl-2 gap-2 ">
                  <div>{t("Утас")}:</div> <div className="font-normal text-gray-600 dark:text-gray-300">{data?.albanTushaal}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3  px-3 font-medium py-5 xl:border-t-2">
              <div>{t("Барилга сонгох")}:</div>
              <div className="flex flex-col overflow-y-auto" style={{ height: "calc( 100vh - 18rem )" }}>
                {barilguud?.map((a) => (
                  <div key={a._id} className="my-2 grid grid-cols-12 space-x-3 rounded-md bg-gray-100 hover:shadow-lg dark:bg-gray-700  p-5 py-2  ">
                    <div className="col-span-2 flex items-center justify-start">
                      <img
                        className="h-10 w-10"
                        alt={baiguullaga?.ner}
                        src={
                          baiguullaga?.zurgiinNer
                            ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}`
                            : "/favicon.ico"
                        }
                      />
                    </div>
                    <div className="col-span-5 flex flex-col space-y-2">
                      <div className="font-bold">{a.ner}</div>
                      <div>{a.register}</div>
                    </div>
                    <div className="col-span-4  flex items-center justify-center ">
                      {formatNumber(a?.niitTalbai)}м<sup> 2</sup>
                    </div>

                    <div className=" col-span-1 ml-auto flex items-center justify-end">
                      <Checkbox
                        onChange={() => {
                          setBarilgiinErkh((value) => {
                            const index = value.findIndex((row) => row === a._id);
                            if (index !== -1) value.splice(index, 1);
                            else value.push(a._id);
                            return [...value];
                          });
                        }}
                        checked={!!barilgiinErkh.find((b) => b === a._id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box col-span-12 p-2 lg:col-span-4">
        <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-1 pt-5 pb-2">
          <div className="flex w-1/2 space-x-2">
            <Checkbox
              checked={
                !khuudasniiJagsaalt?.moduluud

                  ?.filter((a) => !a.nuuya)
                  .find((mur) => {
                    return !targetKeys?.find((a) => a === mur.zam);
                  })
              }
              onChange={(e) => {
                setTargetKeys(
                  e.target.checked
                    ? khuudasniiJagsaalt?.moduluud
                      ?.filter((a) => !a.nuuya).map((a) => a.zam)
                    : []
                );
                setErkhuud(
                  e.target.checked
                    ? khuudasniiJagsaalt?.moduluud
                      ?.filter((a) => !data?.tsonkhniiErkhuud?.find(b => b === a.zam)).map((a) => {
                        return { zam: a.zam, too: 1 }
                      })
                    : khuudasniiJagsaalt?.moduluud
                      ?.filter((a) => data?.tsonkhniiErkhuud?.find(b => b === a.zam)).map((a) => {
                        return { zam: a.zam, too: -1 }
                      })
                )
              }}
            />
            <h2 className=" text-base font-medium dark:text-gray-200">
              {t("Цонхны эрх")}
            </h2>
          </div>
          <div className="flex justify-center w-1/2 ">
            <h2 className="text-center text-base font-medium dark:text-gray-200">
              {t("Эрхийн тоо")}
            </h2>
          </div>
        </div>
        <div className="overflow-y-auto" style={{ height: "calc( 100vh - 14rem )" }}>
          {khuudasniiJagsaalt?.moduluud
            ?.filter((a) => !a.nuuya)
            ?.map((mur, index) => {
              return (
                <div className={`flex ${index % 2 === 0 && "bg-green-50 dark:bg-green-900"}`}>
                  <div
                    key={`${mur.zam}-${index}`}
                    className="flex w-1/2 flex-row space-x-2 p-1"
                  >
                    <Checkbox
                      disabled={!targetKeys?.find((a) => a === mur.zam) && mur?.bolomjit === 0}
                      checked={!!targetKeys?.find((a) => a === mur.zam)}
                      onChange={(e) => {
                        if (e.target.checked === true) {
                          if (!data?.tsonkhniiErkhuud?.find(a => a === mur.zam)) {
                            erkhuud.push({ zam: mur.zam, too: 1 })
                            setErkhuud([...erkhuud]);
                          } else setErkhuud(erkhuud.filter(a => a.zam !== mur.zam));
                          targetKeys.push(mur.zam);
                          if (!!mur?.bolomjit && mur.bolomjit > 0) {
                            mur.bolomjit = mur.bolomjit - 1
                          }
                        } else {
                          if (!!data?.tsonkhniiErkhuud?.find(a => a === mur.zam)) {
                            erkhuud.push({ zam: mur.zam, too: -1 })
                            setErkhuud([...erkhuud]);
                          } else setErkhuud(erkhuud.filter(a => a.zam !== mur.zam));
                          targetKeys.splice(targetKeys.indexOf(mur.zam), 1);
                          mur.bolomjit = (mur?.bolomjit || 0) + 1
                        }

                        setTargetKeys([...targetKeys]);
                      }}
                    />
                    <div>{t(mur.ner)}</div>
                  </div>
                  <div className=" w-1/2 border-x justify-center items-center py-2 flex "><div className="border rounded-md border-gray-700 px-6 flex">{mur.bolomjit}</div></div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="box col-span-12 p-2 lg:col-span-4 2xl:col-span-5">
        <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
          <h2 className="mr-auto text-base font-medium dark:text-gray-200">
            {t("Цонхны эрхийн тохиргоо")}
          </h2>
        </div>
        {[
          {
            ner: "Гэрээ харах эсэх",
            tailbar: "Тухайн барилгын хувьд бүх гэрээг харах эсэх",
            value: "gereeKharakhErkh",
          },
          {
            ner: "Гэрээ засах эсэх",
            tailbar: "Тухайн барилгын хувьд бүх гэрээг засах эсэх",
            value: "gereeZasakhErkh",
          },
          {
            ner: "Хөнгөлөлт үзүүлэх эсэх",
            tailbar: "Тухайн барилгын хувьд бүх гэрээг хөнгөлөх эсэх",
            value: "khungulultUzuulekhEsekh",
          },
          {
            ner: "Гүйлгээ устгах эсэх",
            tailbar: "Тухайн барилгын хувьд бүх гэрээг гүйлгээ устгах эсэх",
            value: "guilgeeUstgakhErkh",
          },
        ].map((mur) => (
          <div className="box" key={mur.ner}>
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t(mur.ner)}</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t(mur.tailbar)}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  checked={
                    !!_.get(tokhirgoo, `${mur?.value}`)?.find((a) =>
                      barilgiinErkh.find((b) => a === b)
                    )
                  }
                  onChange={(checked) => {
                    setTokhirgoo((a) => {
                      if (!checked) {
                        _.set(a, `${mur?.value}`, undefined);
                      } else _.set(a, `${mur?.value}`, barilgiinErkh);
                      return { ...a };
                    });
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="col-span-12 lg:absolute right-3 bottom-5 ml-auto mr-2 flex w-full py-3 lg:w-36">
        <Button className="w-full" type="primary" onClick={khadgalya}>
          {t("Хадгалах")}
        </Button>
      </div>
      </div>
    </Admin>
  );
}

const ugudulAvchirya = async (ctx, session) => {
  const { data } = await readMethod(
    "ajiltan",
    session.tureestoken,
    ctx.query.id
  );
  return data;
};

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx, ugudulAvchirya);

export default index;
