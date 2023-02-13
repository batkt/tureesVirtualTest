import { Button, Checkbox, message, Switch } from "antd";
import Admin from "components/Admin";
import { useRouter } from "next/router";
import React, { useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee from "services/uilchilgee";
import readMethod from "tools/function/crud/readMethod";
import {
  tsonknuud,
  khereglegchiinErkhuud,
} from "tools/logic/khereglegchiinErkhiinTokhirgoo";
import { useAuth } from "services/auth";
import _ from "lodash";
import { useTranslation } from "react-i18next";

function index({ token, data }) {
  const router = useRouter();
  const { t } = useTranslation()
  const [targetKeys, setTargetKeys] = useState(data?.tsonkhniiErkhuud || []);
  const [tokhirgoo, setTokhirgoo] = useState(data?.tokhirgoo || {});
  const { baiguullaga } = useAuth();
  const [barilgiinErkh, setBarilgiinErkh] = useState(data?.barilguud || []);
  const barilguud = baiguullaga?.barilguud;

  const khadgalya = () => {
    uilchilgee(token)
      .post(`/ajiltandErkhUgyu/${data?._id}`, {
        tsonkhniiErkhuud: targetKeys,
        barilguud: barilgiinErkh,
        tokhirgoo,
      })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          message.success("Бүртгэл амжилттай хийгдлээ");
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
      <div className="box col-span-12 flex-row items-center p-2 lg:flex">
        <div className="flex font-medium">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="flex items-center gap-3 text-lg text-black text-opacity-70 dark:text-white dark:text-opacity-70">
              <div className="flex">
                {t("Овог")}: <p className="ml-2">{data?.ovog}</p>
              </div>
              <div className="flex">
                {t("Нэр")}: <p className="ml-2">{data?.ner}</p>
              </div>
            </div>
            <div className="flex flex-col  items-center gap-3   px-3 font-medium lg:flex-row xl:border-t-0  xl:border-l-2">
              <div>{t("Барилга сонгох")}:</div>
              <div className="flex flex-wrap gap-5">
                {barilguud?.map((a) => (
                  <div
                    className={`cursor-pointer gap-2 rounded-md border-2 py-1 px-2`}
                    key={a._id}
                  >
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
                    />{" "}
                    {a.ner}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box col-span-12 p-2 lg:col-span-6">
        <div className="dark:border-dark-5 flex items-center space-x-2 border-b border-gray-200 px-1 pt-5 pb-2">
          <Checkbox
            checked={
              !tsonknuud
                ?.filter((a) => !a.nuuya)
                .find((mur) => {
                  return !targetKeys?.find((a) => a === mur.key);
                })
            }
            onChange={(e) =>
              setTargetKeys(
                e.target.checked
                  ? tsonknuud?.filter((a) => !a.nuuya).map((a) => a.key)
                  : []
              )
            }
          />
          <h2 className="mr-auto text-base font-medium dark:text-gray-200">
            {t("Цонхны эрх")}
          </h2>
        </div>
        {tsonknuud
          ?.filter((a) => !a.nuuya)
          ?.map((mur, index) => {
            return (
              <div
                key={`${mur.key}-${index}`}
                className="flex flex-row space-x-2 p-1"
              >
                <Checkbox
                  checked={!!targetKeys?.find((a) => a === mur.key)}
                  onChange={(e) => {
                    if (e.target.checked === true) {
                      targetKeys.push(mur.key);
                    } else {
                      targetKeys.splice(targetKeys.indexOf(mur.key), 1);
                    }

                    setTargetKeys([...targetKeys]);
                  }}
                />
                <div>{mur.ner}</div>
              </div>
            );
          })}
      </div>
      <div className="box col-span-12 p-2 lg:col-span-6">
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
      </div>
      <div className="col-span-12 ml-auto mr-2 flex w-full py-3 lg:w-36">
        <Button className="w-full" type="primary" onClick={khadgalya}>
          {t("Хадгалах")}
        </Button>
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
