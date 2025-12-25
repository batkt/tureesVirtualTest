import { Button, Checkbox, Col, message, Switch, Divider } from "antd";
import Admin from "components/Admin";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import readMethod from "tools/function/crud/readMethod";
import { useAuth } from "services/auth";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import useKhuudasniiJagsaalt from "hooks/useKhuudasniiJagsaalt";
import formatNumber from "tools/function/formatNumber";
import useJagsaalt from "../../../../hooks/useJagsaalt";
import { khuudasnuud } from "tools/logic/khereglegchiinErkhiinTokhirgoo";
import { toast } from "sonner";

function index({ token, data }) {
  const { khuudasniiJagsaalt } = useKhuudasniiJagsaalt(token);
  const router = useRouter();
  const { t } = useTranslation();
  const [targetKeys, setTargetKeys] = useState(
    _.cloneDeep(data?.tsonkhniiErkhuud) || []
  );
  const [tokhirgoo, setTokhirgoo] = useState(data?.tokhirgoo || {});
  const { baiguullaga } = useAuth();
  const [barilgiinErkh, setBarilgiinErkh] = useState(data?.barilguud || []);
  const [khaalgaErkh, setKhaalgaErkh] = useState(data?.zogsoolKhaalga || []);
  const [bolomjitToonuud, setBolomjitToonuud] = useState([]);
  const [erkhuud, setErkhuud] = useState([]);
  const barilguud = baiguullaga?.barilguud;
  useEffect(() => {
    if (khuudasniiJagsaalt?.moduluud) {
      setBolomjitToonuud(
        khuudasniiJagsaalt?.moduluud?.map((a) => {
          return { zam: a.zam, bolomjit: a.bolomjit - (a.odoogiin || 0) };
        })
      );
    }
  }, [khuudasniiJagsaalt]);

  const khadgalya = () => {
    try {
      uilchilgee(token)
        .post(`/ajiltandErkhUgyu/${data?._id}`, {
          tsonkhniiErkhuud: targetKeys,
          erkhuud: erkhuud,
          barilguud: barilgiinErkh,
          zogsoolKhaalga: khaalgaErkh,
          tokhirgoo,
        })
        .then(({ data }) => {
          if (data === "Amjilttai") {
            toast.success(t("Бүртгэл амжилттай хийгдлээ"));
            router.back();
          }
        });
    } catch (e) {
      toast.error(e);
    }
  };
  const que = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: { $in: barilgiinErkh },
    };
  }, [baiguullaga?._id, barilgiinErkh]);
  const { jagsaalt } = useJagsaalt("/zogsoolJagsaalt", que, { createdAt: -1 });

  return (
    <Admin
      title={"Ажилтны эрхийн тохиргоо"}
      dedKhuudas
      className="p-5 pb-10 lg:pb-0"
    >
      <div className="box col-span-12 flex-row items-center p-2 lg:col-span-4 2xl:col-span-3">
        <div className=" font-medium">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-3 py-1 font-medium text-black dark:text-white dark:text-opacity-90">
              <div className="w-1/2">
                <div className="my-1 flex gap-2 border-l-2 border-green-500 pl-2">
                  <div>{t("Овог")}:</div>{" "}
                  <div className="font-normal text-gray-600 dark:text-gray-300">
                    {data?.ovog}
                  </div>
                </div>
                <div className="my-1 flex gap-2 border-l-2 border-green-500 pl-2">
                  <div>{t("Нэр")}:</div>{" "}
                  <div className="font-normal text-gray-600 dark:text-gray-300">
                    {data?.ner}
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <div className="my-1 flex gap-2 border-l-2 border-green-500 pl-2">
                  <div>{t("Албан тушаал")}:</div>{" "}
                  <div className="font-normal text-gray-600 dark:text-gray-300">
                    {data?.albanTushaal}
                  </div>
                </div>
                <div className="my-1 flex gap-2 border-l-2 border-green-500 pl-2 ">
                  <div>{t("Утас")}:</div>{" "}
                  <div className="font-normal text-gray-600 dark:text-gray-300">
                    {data?.albanTushaal}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 px-3 py-5 font-medium xl:border-t-2">
              <div
                className="flex flex-col overflow-y-auto"
                style={{ height: "calc( 100vh - 18rem )" }}
              >
                <Divider orientation="left">{t("Барилга сонгох")}</Divider>
                {barilguud?.map((a) => (
                  <div
                    key={a._id}
                    className="my-2 grid grid-cols-12 space-x-3 rounded-md bg-gray-100 p-5 py-2  hover:shadow-lg dark:bg-gray-700  "
                  >
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
                            const index = value.findIndex(
                              (row) => row === a._id
                            );
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
                <div className="mt-3"></div>
                {/* <Divider orientation="left">
                  {t("Зогсоолын хаалга сонгох")}
                </Divider> */}
                {/* {jagsaalt?.map((a) => (
                  <div
                    key={a._id}
                    className="my-2 rounded-md bg-gray-100 p-5 py-2 hover:shadow-lg dark:bg-gray-700"
                  >
                    <div className="mx-auto mb-3 w-max font-bold">{a.ner}</div>
                    {a.khaalga?.map((b) => (
                      <Col span={8}>
                        <Checkbox
                          onChange={() => {
                            setKhaalgaErkh((value) => {
                              const index = value.findIndex(
                                (row) => row === b._id
                              );
                              if (index !== -1) value.splice(index, 1);
                              else value.push(b._id);
                              return [...value];
                            });
                          }}
                          checked={!!khaalgaErkh.find((c) => c === b._id)}
                        >
                          {b.ner}
                        </Checkbox>
                      </Col>
                    ))}
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box col-span-12 p-2 lg:col-span-4">
        <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-1 pb-2 pt-5">
          <div className="flex w-1/2 space-x-2">
            <Checkbox
              checked={
                !khuudasniiJagsaalt?.moduluud.find((mur) => {
                  return !targetKeys?.find((a) => a === mur.zam);
                })
              }
              onChange={(e) => {
                setTargetKeys(
                  e.target.checked
                    ? khuudasniiJagsaalt?.moduluud
                        ?.filter((a) => a.bolomjit - (a.odoogiin || 0) > 0)
                        .map((a) => a.zam)
                    : []
                );
                setErkhuud(
                  e.target.checked
                    ? khuudasniiJagsaalt?.moduluud
                        ?.filter(
                          (a) =>
                            !data?.tsonkhniiErkhuud?.find((b) => b === a.zam) &&
                            a.bolomjit - (a.odoogiin || 0) > 0
                        )
                        .map((a) => {
                          return { zam: a.zam, too: 1 };
                        })
                    : khuudasniiJagsaalt?.moduluud
                        ?.filter((a) =>
                          data?.tsonkhniiErkhuud?.find((b) => b === a.zam)
                        )
                        .map((a) => {
                          return { zam: a.zam, too: -1 };
                        })
                );
              }}
            />
            <h2 className=" text-base font-medium dark:text-gray-200">
              {t("Цонхны эрх")}
            </h2>
          </div>
          <div className="flex w-1/2 justify-center ">
            <h2 className="text-center text-base font-medium dark:text-gray-200">
              {t("Эрхийн тоо")}
            </h2>
          </div>
        </div>
        <div
          className="overflow-y-auto"
          style={{ height: "calc( 100vh - 14rem )" }}
        >
          {data?.erkh !== "Zasvarchin" &&
            khuudasnuud
              ?.filter((a) => !a.nuuya)
              ?.map((mur, index) => {
                mur.bolomjit =
                  bolomjitToonuud?.find((a) => a.zam === mur.href)?.bolomjit ||
                  0;
                return (
                  <div>
                    <div
                      className={`flex border ${
                        index % 2 === 0
                          ? "bg-blue-100 dark:bg-gray-700"
                          : "bg-green-100 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        key={`${mur.href}-${index}`}
                        className="flex w-1/2 flex-row space-x-2 p-1"
                      >
                        {!mur?.sub && (
                          <Checkbox
                            disabled={
                              !targetKeys?.find((a) => a === mur.href) &&
                              mur?.bolomjit < 1
                            }
                            checked={!!targetKeys?.find((a) => a === mur.href)}
                            onChange={(e) => {
                              if (e.target.checked === true) {
                                if (
                                  !data?.tsonkhniiErkhuud?.find(
                                    (a) => a === mur.href
                                  )
                                ) {
                                  erkhuud.push({ zam: mur.href, too: 1 });
                                  setErkhuud([...erkhuud]);
                                } else
                                  setErkhuud(
                                    erkhuud.filter((a) => a.zam !== mur.href)
                                  );
                                targetKeys.push(mur.href);
                                if (!!mur?.bolomjit && mur.bolomjit > 0) {
                                  mur.bolomjit = mur.bolomjit - 1;
                                  var i = bolomjitToonuud?.findIndex(
                                    (a) => a.zam === mur.href
                                  );
                                  if (i !== -1)
                                    bolomjitToonuud[i].bolomjit =
                                      bolomjitToonuud[i].bolomjit - 1;
                                  setBolomjitToonuud(bolomjitToonuud);
                                }
                              } else {
                                if (
                                  !!data?.tsonkhniiErkhuud?.find(
                                    (a) => a === mur.href
                                  )
                                ) {
                                  erkhuud.push({ zam: mur.href, too: -1 });
                                  setErkhuud([...erkhuud]);
                                } else
                                  setErkhuud(
                                    erkhuud.filter((a) => a.zam !== mur.href)
                                  );
                                targetKeys.splice(
                                  targetKeys.indexOf(mur.href),
                                  1
                                );
                                mur.bolomjit = (mur?.bolomjit || 0) + 1;
                                var i = bolomjitToonuud?.findIndex(
                                  (a) => a.zam === mur.href
                                );
                                if (i !== -1)
                                  bolomjitToonuud[i].bolomjit =
                                    bolomjitToonuud[i].bolomjit + 1;
                                setBolomjitToonuud(bolomjitToonuud);
                              }

                              setTargetKeys([...targetKeys]);
                            }}
                          />
                        )}
                        <div>{mur.ner}</div>
                      </div>
                      <div className=" flex w-1/2 items-center justify-center border-l py-2 ">
                        {!mur?.sub && (
                          <div className="flex rounded-md border border-gray-700 px-6">
                            {mur.bolomjit}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="divide-y">
                      {mur?.sub &&
                        mur?.sub?.map((a, i) => {
                          a.bolomjit =
                            bolomjitToonuud?.find((b) => b.zam === a.href)
                              ?.bolomjit || 0;
                          return (
                            <div
                              className={`flex ${
                                index % 2 === 0
                                  ? "bg-blue-50 dark:bg-gray-700"
                                  : "bg-green-50 dark:bg-gray-600"
                              }`}
                            >
                              <div
                                key={`${a.href}-${i}`}
                                className="flex w-1/2 flex-row space-x-2 p-1 pl-5"
                              >
                                <Checkbox
                                  disabled={
                                    !targetKeys?.find((b) => b === a.href) &&
                                    a?.bolomjit < 1
                                  }
                                  checked={
                                    !!targetKeys?.find((b) => b === a.href)
                                  }
                                  onChange={(e) => {
                                    if (e.target.checked === true) {
                                      if (
                                        !data?.tsonkhniiErkhuud?.find(
                                          (b) => b === a.href
                                        )
                                      ) {
                                        erkhuud.push({ zam: a.href, too: 1 });
                                        setErkhuud([...erkhuud]);
                                      } else
                                        setErkhuud(
                                          erkhuud.filter(
                                            (b) => b.href !== a.href
                                          )
                                        );
                                      targetKeys.push(a.href);
                                      if (!!a?.bolomjit && a.bolomjit > 0) {
                                        a.bolomjit = a.bolomjit - 1;
                                        var ind = bolomjitToonuud?.findIndex(
                                          (d) => d.zam === a.href
                                        );
                                        if (ind !== -1)
                                          bolomjitToonuud[ind].bolomjit =
                                            bolomjitToonuud[ind].bolomjit - 1;
                                        setBolomjitToonuud(bolomjitToonuud);
                                      }
                                    } else {
                                      if (
                                        !!data?.tsonkhniiErkhuud?.find(
                                          (b) => b === a.href
                                        )
                                      ) {
                                        erkhuud.push({
                                          zam: a.href,
                                          too: -1,
                                        });
                                        setErkhuud([...erkhuud]);
                                      } else
                                        setErkhuud(
                                          erkhuud.filter(
                                            (b) => b.zam !== a.href
                                          )
                                        );
                                      targetKeys.splice(
                                        targetKeys.indexOf(a.href),
                                        1
                                      );
                                      a.bolomjit = (a?.bolomjit || 0) + 1;
                                      var ind = bolomjitToonuud?.findIndex(
                                        (d) => d.zam === a.href
                                      );
                                      if (ind !== -1)
                                        bolomjitToonuud[ind].bolomjit =
                                          bolomjitToonuud[ind].bolomjit + 1;
                                      setBolomjitToonuud(bolomjitToonuud);
                                    }

                                    setTargetKeys([...targetKeys]);
                                  }}
                                />
                                <div>{a.ner}</div>
                              </div>
                              <div className=" flex w-1/2 items-center justify-center border-x py-2 ">
                                <div className="flex rounded-md border border-gray-700 px-6">
                                  {a.bolomjit}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
      <div className="box col-span-12 p-2 lg:col-span-4 2xl:col-span-5">
        <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
          <h2 className="mr-auto text-base font-medium dark:text-gray-200">
            {t("Цонхны эрхийн тохиргоо")}
          </h2>
        </div>
        <div
          className="overflow-y-auto"
          style={{ height: "calc( 100vh - 18rem )" }}
        >
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
              ner: "Гэрээ сунгах эсэх",
              tailbar: "Тухайн барилгын хувьд бүх гэрээг сунгах эсэх",
              value: "gereeSungakhErkh",
            },
            {
              ner: "Гэрээ сэргээх эсэх",
              tailbar: "Тухайн барилгын хувьд бүх гэрээг сэргээх эсэх",
              value: "gereeSergeekhErkh",
            },
            {
              ner: "Гэрээ цуцлах эсэх",
              tailbar: "Тухайн барилгын хувьд бүх гэрээг цуцлах эсэх",
              value: "gereeTsutslakhErkh",
            },
            {
              ner: "Өмнөх сараар хөнгөлөлт идэвхжүүлэх эсэх",
              tailbar: "Өмнөх сараар хөнгөлөлт идэвхжүүлэх эсэх",
              value: "umkhunSaraarKhungulultEsekh",
            },
            {
              ner: "Хөнгөлөлт үзүүлэх эсэх",
              tailbar: "Тухайн барилгын хувьд бүх гэрээг хөнгөлөх эсэх",
              value: "khungulultUzuulekhEsekh",
            },
            {
              ner: "Гүйлгээ хийх эсэх",
              tailbar:
                "Тухайн барилгын хувьд гүйлгээний түүх цонхонд дахь бүх гэрээний гүйлгээ хийх эсэх",
              value: "guilgeeKhiikhEsekh",
            },
            {
              ner: "Алданги засах эрх өгөх эсэх",
              tailbar: "Тухайн барилгын хувьд алдангийн үлдэгдэл засах эсэх",
              value: "aldangiinUldegdelZasakhEsekh",
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
          {!!targetKeys.find((a) => a === "/khyanalt/zogsool/camera") && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Нэгтгэл дүн харах эсэх")}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {t(
                      "Зогсоолын нэгтгэл дүн буюу системд бүртгэгдсэн нийт гүйлгээний задаргаа дүнг харах эсэх."
                    )}
                  </div>
                </div>
                <div className="ml-auto">
                  <Switch
                    checked={_.get(tokhirgoo, `zogsoolNegtgelDunKharakhEsekh`)}
                    onChange={(checked) => {
                      setTokhirgoo((a) => {
                        if (!checked) {
                          _.set(a, `zogsoolNegtgelDunKharakhEsekh`, false);
                        } else _.set(a, `zogsoolNegtgelDunKharakhEsekh`, true);
                        return { ...a };
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {!!targetKeys.find((a) => a === "/khyanalt/togloom/togloomTuv") && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Тоглоомын төвийн нэгтгэл дүн харах эсэх")}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {t(
                      "Тоглоомын төвийн нэгтгэл дүн буюу системд бүртгэгдсэн нийт гүйлгээний задаргаа дүнг харах эсэх."
                    )}
                  </div>
                </div>
                <div className="ml-auto">
                  <Switch
                    checked={_.get(
                      tokhirgoo,
                      `togloomiinTuvNegtgelDunKharakhEsekh`
                    )}
                    onChange={(checked) => {
                      setTokhirgoo((a) => {
                        if (!checked) {
                          _.set(
                            a,
                            `togloomiinTuvNegtgelDunKharakhEsekh`,
                            false
                          );
                        } else
                          _.set(a, `togloomiinTuvNegtgelDunKharakhEsekh`, true);
                        return { ...a };
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {!!targetKeys.find((a) => a === "/khyanalt/zogsool/camera") && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Зогсоолын хөнгөлөлт үзүүлэх эсэх")}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {t(
                      "Тухайн ажилтан зогсоолд зогссон машиныг хөнгөлөлт үзүүлэх эсэх."
                    )}
                  </div>
                </div>
                <div className="ml-auto">
                  <Switch
                    checked={_.get(tokhirgoo, `zogsooliinKhungulultEsekh`)}
                    onChange={(checked) => {
                      setTokhirgoo((a) => {
                        if (!checked) {
                          _.set(a, `zogsooliinKhungulultEsekh`, false);
                        } else _.set(a, `zogsooliinKhungulultEsekh`, true);
                        return { ...a };
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {!!targetKeys.find((a) => a === "/khyanalt/zogsool/camera") && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Ажилтанд бүх төлбөрийн төрлүүдийг харах эсэх")}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {t(
                      "Тухайн ажилтан өдрийн тайлангаа авахдаа бүх төлбөрийн төрлүүдийг харах эсэх."
                    )}
                  </div>
                </div>
                <div className="ml-auto">
                  <Switch
                    checked={_.get(tokhirgoo, `ajiltandBuhTolborHaruulahEseh`)}
                    onChange={(checked) => {
                      setTokhirgoo((a) => {
                        if (!checked) {
                          _.set(a, `ajiltandBuhTolborHaruulahEseh`, false);
                        } else _.set(a, `ajiltandBuhTolborHaruulahEseh`, true);
                        return { ...a };
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {!!targetKeys.find(
            (a) => a === "/khyanalt/zogsool/mashinBurtgel"
          ) && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Машины дугаар өөрчлөх эсэх")}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {t(
                      "Тухайн машин зогсоол орсны дараа дугаар өөрчлөх боломж идэвхжүүлэх эсэх."
                    )}
                  </div>
                </div>
                <div className="ml-auto">
                  <Switch
                    checked={_.get(tokhirgoo, `mashniiDugaarZasakhEsekh`)}
                    onChange={(checked) => {
                      setTokhirgoo((a) => {
                        if (!checked) {
                          _.set(a, `mashniiDugaarZasakhEsekh`, false);
                        } else _.set(a, `mashniiDugaarZasakhEsekh`, true);
                        return { ...a };
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bottom-5 right-3 col-span-12 ml-auto mr-2 flex w-full py-3 lg:absolute lg:w-36">
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
