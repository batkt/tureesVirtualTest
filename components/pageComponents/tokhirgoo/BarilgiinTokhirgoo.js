import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  InputNumber,
  notification,
  Select,
  Switch,
  Input,
} from "antd";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useTranslation } from "react-i18next";
import moment from "moment";
import useJagsaalt from "hooks/useJagsaalt";

function BarilgiinTokhirgoo({
  token,
  barilgiinId,
  baiguullaga,
  baiguullagaMutate,
  setSongogdsonTsonkhniiIndex,
}) {
  const { t } = useTranslation();
  const [songogdsonBarilga, setSongogdsonBarilga] = useState(
    barilgiinId || null,
  );
  const [barilgaTokhirgoo, setBarilgaTokhirgoo] = useState();

  const [songogdsonDuureg, setSongogdsonDuureg] = useState();
  const [songogdsonDuuregKod, setSongogdsonDuuregKod] = useState();
  const [songogdsonHoroo, setSongogdsonHoroo] = useState();
  const [songogdsonHorooKod, setSongogdsonHorooKod] = useState();

  const barilga = useMemo(
    () => baiguullaga?.barilguud?.find((a) => a._id === songogdsonBarilga),
    [songogdsonBarilga],
  );

  const duurguud = useJagsaalt("/tatvariinAlba");

  useEffect(() => {
    if (barilga && duurguud.jagsaalt) {
      setBarilgaTokhirgoo({
        ...barilga?.tokhirgoo,
        aldangiGereeTusBur: barilga?.tokhirgoo?.aldangiGereeTusBur ?? false,
        aldangiBodojEkhlekhOgnoo: barilga?.tokhirgoo?.aldangiBodojEkhlekhOgnoo
          ? moment(barilga?.tokhirgoo?.aldangiBodojEkhlekhOgnoo)
          : undefined,
        aldangiOgnoo: barilga?.tokhirgoo?.aldangiOgnoo
          ? moment(barilga?.tokhirgoo?.aldangiOgnoo)
          : undefined,
        eBarimtAshiglakhEsekh: barilga?.tokhirgoo?.eBarimtAshiglakhEsekh ?? false,
        eBarimtShine: barilga?.tokhirgoo?.eBarimtShine ?? false,
        eBarimtAutomataarIlgeekh: barilga?.tokhirgoo?.eBarimtAutomataarIlgeekh ?? false,
        nuatTulukhEsekh: barilga?.tokhirgoo?.nuatTulukhEsekh ?? false,
        eBarimtBugdShivikh: barilga?.tokhirgoo?.eBarimtBugdShivikh ?? false,
      });
      setSongogdsonDuuregKod(barilga?.tokhirgoo?.districtCode?.substring(0, 2));

      setSongogdsonDuureg(
        duurguud?.jagsaalt?.find(
          (e) => e.kod === barilga?.tokhirgoo?.districtCode?.substring(0, 2),
        ),
      );

      setSongogdsonHorooKod(barilga?.tokhirgoo?.districtCode?.substring(2));
    }
  }, [barilga, songogdsonBarilga, duurguud.jagsaalt]);

  const barilgaTokhirgooKhadgalya = () => {
    const yavuulakhData = { ...baiguullaga };
    const barilguudCopy = [...yavuulakhData?.barilguud];
    const tukhainBarilgiinIndex = barilguudCopy.findIndex(
      (a) => a._id === songogdsonBarilga,
    );

    if (tukhainBarilgiinIndex !== -1) {
      const updatedBarilga = {
        ...barilguudCopy[tukhainBarilgiinIndex],
        tokhirgoo: barilgaTokhirgoo,
      };
      barilguudCopy[tukhainBarilgiinIndex] = updatedBarilga;
      yavuulakhData.barilguud = barilguudCopy;
      if (!!barilgaTokhirgoo?.eBarimtShine) {
        if (
          !!barilgaTokhirgoo?.districtCode &&
          !!barilgaTokhirgoo?.merchantTin
        ) {
          uilchilgee(token)
            .put(`/baiguullaga/${baiguullaga?._id}`, yavuulakhData)
            .then(({ data }) => {
              if (data === "Amjilttai") {
                notification.success({
                  message: "Амжилттай хадгалагдлаа",
                  duration: 2,
                });
                baiguullagaMutate();
                setSongogdsonTsonkhniiIndex(0);
              }
            })
            .catch((err) => {
              aldaaBarigch(err);
            });
        } else {
          notification.warning({
            description: "ТИН дугаар, дүүрэг, хороо сонгоогүй байна.",
          });
        }
      } else {
        uilchilgee(token)
          .put(`/baiguullaga/${baiguullaga?._id}`, yavuulakhData)
          .then(({ data }) => {
            if (data === "Amjilttai") {
              notification.success({
                message: "Амжилттай хадгалагдлаа",
                duration: 2,
              });
              baiguullagaMutate();
              setSongogdsonTsonkhniiIndex(0);
            }
          })
          .catch((err) => {
            aldaaBarigch(err);
          });
      }
    }
  };
  return (
    <>
      <div className="col-span-12 grid grid-cols-1 xl:grid-cols-3 xl:gap-5">
        <div className="box relative col-span-2 mt-5 pb-20">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Барилгын тохиргоо")}
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Барилга")}</div>
                <div className="text-gray-600">
                  {t("Өөрчлөлт оруулах барилга сонгоно уу")}
                </div>
              </div>
              <div className="ml-auto">
                <Select
                  className="min-w-[150px]"
                  value={songogdsonBarilga}
                  onChange={(v) => setSongogdsonBarilga(v)}
                >
                  {baiguullaga?.barilguud?.map((barilga) => {
                    return (
                      <Select.Option value={barilga?._id}>
                        {barilga?.ner}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Гэрээ тус бүрээр алданги бодох эсэх")}
                </div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Switch
                  checked={barilgaTokhirgoo?.aldangiGereeTusBur}
                  onChange={(v) =>
                    setBarilgaTokhirgoo((a) => ({
                      ...(a || {}),
                      aldangiGereeTusBur: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          {!barilgaTokhirgoo?.aldangiGereeTusBur && (
            <>
              <div className="box">
                <div className="flex items-center p-5">
                  <div className="border-l-2 border-green-500 pl-4">
                    <div className="font-medium">{t("Алдангийн хувь")}</div>
                    <div className="text-gray-600">
                      {t(
                        "Гэрээний төлөлт хугацаа хэтэрсэн үед тооцох алдангийн хувь",
                      )}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <InputNumber
                      min={0}
                      max={0.5}
                      value={barilgaTokhirgoo?.aldangiinKhuvi}
                      onChange={(v) =>
                        setBarilgaTokhirgoo((a) => ({
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
                    <div className="font-medium">
                      {t("Алданги чөлөөлөх хоног")}
                    </div>
                    <div className="text-gray-600">
                      {t(
                        "Алданги хугацаа хэтэрсэн хоногоос хэд хоногийн дараагаас бодож эхлэх хоног",
                      )}
                    </div>
                  </div>

                  <div className="ml-auto">
                    <InputNumber
                      min={0}
                      max={100}
                      value={barilgaTokhirgoo?.aldangiChuluulukhKhonog}
                      onChange={(v) =>
                        setBarilgaTokhirgoo((a) => ({
                          ...(a || {}),
                          aldangiChuluulukhKhonog: v,
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
                      {t("Алданги бодож эхлэх огноо")}
                    </div>
                    <div className="text-gray-600">
                      {t("Хугацаа хэтэрсэн огноо бодож эхлэх огноо")}
                    </div>
                  </div>

                  <div className="ml-auto">
                    <DatePicker
                      placeholder="Огноо сонгоно уу"
                      value={barilgaTokhirgoo?.aldangiOgnoo}
                      onChange={(v) =>
                        setBarilgaTokhirgoo((a) => ({
                          ...(a || {}),
                          aldangiOgnoo: v,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("И-Баримт ашиглах эсэх")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Switch
                  checked={barilgaTokhirgoo?.eBarimtAshiglakhEsekh}
                  onChange={(v) =>
                    setBarilgaTokhirgoo((a) => ({
                      ...(a || {}),
                      eBarimtAshiglakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("И-Баримт 3.0 эсэх")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Switch
                  checked={barilgaTokhirgoo?.eBarimtShine}
                  onChange={(v) =>
                    setBarilgaTokhirgoo((a) => ({
                      ...(a || {}),
                      eBarimtShine: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          {barilgaTokhirgoo?.eBarimtShine && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">{t("ТИН дугаар")}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Input
                    value={barilgaTokhirgoo?.merchantTin}
                    onChange={({ target }) =>
                      setBarilgaTokhirgoo((a) => ({
                        ...(a || {}),
                        merchantTin: target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {barilgaTokhirgoo?.eBarimtShine && (
            <div>
              <div className="box">
                <div className="flex items-center p-5">
                  <div className="border-l-2 border-green-500 pl-4">
                    <div className="font-medium">{t("Дүүрэг")}</div>
                    <div className="text-gray-600"></div>
                  </div>
                  <div className="ml-auto">
                    <Select
                      className="min-w-[150px]"
                      value={songogdsonDuuregKod}
                      onChange={(v) => {
                        setSongogdsonDuureg(
                          duurguud?.jagsaalt?.find((e) => e.kod === v),
                        );
                        setSongogdsonDuuregKod(v);
                        setSongogdsonHoroo();
                        setSongogdsonHorooKod();
                        setBarilgaTokhirgoo((a) => ({
                          ...(a || {}),
                          districtCode: undefined,
                        }));
                      }}
                    >
                      {duurguud.jagsaalt.map((duureg) => {
                        return (
                          <Select.Option value={duureg?.kod}>
                            {duureg?.ner}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="box">
                <div className="flex items-center p-5">
                  <div className="border-l-2 border-green-500 pl-4">
                    <div className="font-medium">{t("Хороо")}</div>
                    <div className="text-gray-600"></div>
                  </div>
                  <div className="ml-auto">
                    <Select
                      className="min-w-[150px]"
                      value={songogdsonHorooKod}
                      onChange={(v) => {
                        setSongogdsonHoroo(
                          songogdsonDuureg?.ded?.find((e) => e.kod === v),
                        );
                        setSongogdsonHorooKod(v);
                        setBarilgaTokhirgoo((a) => ({
                          ...(a || {}),
                          districtCode: songogdsonDuureg.kod + v,
                        }));
                      }}
                    >
                      {songogdsonDuureg?.ded.map((duureg) => {
                        return (
                          <Select.Option value={duureg?.kod}>
                            {duureg?.ner}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
          {barilgaTokhirgoo?.eBarimtShine && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Бүх баримт татвар руу илгээх")}
                  </div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Switch
                    checked={barilgaTokhirgoo?.eBarimtBugdShivikh}
                    onChange={(v) =>
                      setBarilgaTokhirgoo((a) => ({
                        ...(a || {}),
                        eBarimtBugdShivikh: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("И-Баримт автоматаар илгээх эсэх")}{" "}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  checked={barilgaTokhirgoo?.eBarimtAutomataarIlgeekh}
                  onChange={(v) =>
                    setBarilgaTokhirgoo((a) => ({
                      ...(a || {}),
                      eBarimtAutomataarIlgeekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("И-Баримт нөат эсэх")} </div>
              </div>
              <div className="ml-auto">
                <Switch
                  checked={barilgaTokhirgoo?.nuatTulukhEsekh}
                  onChange={(v) =>
                    setBarilgaTokhirgoo((a) => ({
                      ...(a || {}),
                      nuatTulukhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Corporate ашиглах үед")}</div>
                <div className="text-gray-600">
                  {t(
                    "И Баримтын сугалааны дугаар болон төлсөн дүнг хэрэглэгч руу мессежээр илгээх эсэх",
                  )}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  checked={barilgaTokhirgoo?.eBarimtMessageIlgeekhEsekh}
                  onChange={(v) =>
                    setBarilgaTokhirgoo((a) => ({
                      ...(a || {}),
                      eBarimtMessageIlgeekhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`dark:border-dark-5 absolute bottom-5 right-1 flex items-center justify-end border-gray-200 px-5 pb-2 pt-2 ${
              !!barilgaTokhirgoo ? "flex" : "hidden"
            }`}
          >
            <Button type="primary" onClick={barilgaTokhirgooKhadgalya}>
              {t("Хадгалах")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BarilgiinTokhirgoo;
