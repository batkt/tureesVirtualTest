import React, { useState } from "react";
import { Button, InputNumber, notification, Switch, Select, Input } from "antd";
import uilchilgee, { url } from "services/uilchilgee";

import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { useTranslation } from "react-i18next";

function KhuviinMedeelel({
  ajiltan = {},
  token,
  baiguullaga,
  baiguullagaMutate,
  barilgiinId,
  setSongogdsonTsonkhniiIndex
}) {
  const { t } = useTranslation()
  const { ajilchdiinGaralt, ajiltniiJagsaaltMutate } = useAjiltniiJagsaalt(
    token,
    ajiltan?.baiguullagiinId
  );

  const [khungulultiinTokhirgoo, setKhungulultiinTokhirgoo] = useState(null);
  const [khungulukhKhuvi, setKhungulukhKhuvi] = useState(baiguullaga?.tokhirgoo?.deedKhungulultiinKhuvi);
  const [sarBurAutoKhungulultOruulakhEsekh, setSarBurAutoKhungulultOruulakhEsekh] = useState(baiguullaga?.tokhirgoo?.sarBurAutoKhungulultOruulakhEsekh);
  const [khungulukhSarBuriinShalguurDun, setKhungulukhSarBuriinShalguurDun] = useState(baiguullaga?.tokhirgoo?.khungulukhSarBuriinShalguurDun ? baiguullaga?.tokhirgoo?.khungulukhSarBuriinShalguurDun : 0);
  const [khungulukhSarBuriinTurul, setKhungulukhSarBuriinTurul] = useState(baiguullaga?.tokhirgoo?.khungulukhSarBuriinTurul ? baiguullaga?.tokhirgoo?.khungulukhSarBuriinTurul : "");
  const [khungulukhSarBuriinUtga, setKhungulukhSarBuriinUtga] = useState(baiguullaga?.tokhirgoo?.khungulukhSarBuriinUtga ? baiguullaga?.tokhirgoo?.khungulukhSarBuriinUtga : 0);
  const [khungulukhSarBuriinTulburEkhlekhUdur, setKhungulukhSarBuriinTulburEkhlekhUdur] = useState(baiguullaga?.tokhirgoo?.khungulukhSarBuriinTulburEkhlekhUdur ? baiguullaga?.tokhirgoo?.khungulukhSarBuriinTulburEkhlekhUdur : 0);
  const [khungulukhSarBuriinTulburDuusakhUdur, setKhungulukhSarBuriinTulburDuusakhUdur] = useState(baiguullaga?.tokhirgoo?.khungulukhSarBuriinTulburDuusakhUdur ? baiguullaga?.tokhirgoo?.khungulukhSarBuriinTulburDuusakhUdur : 0);
  
  const khungulultiinTokhirgooKhadgalya = () => {
    if(sarBurAutoKhungulultOruulakhEsekh)
    {
      if(khungulukhSarBuriinTulburEkhlekhUdur === 0)   
      {
        notification.warning({ message: t("Хөнгөлөлт тооцож эхлэх өдрөө оруулна уу!!!") });
        return
      }
      if(khungulukhSarBuriinTulburDuusakhUdur === 0)   
      {
        notification.warning({ message: t("Хөнгөлөлт тооцож дуусах өдрөө оруулна уу!!!") });
        return
      }
      if(!khungulukhSarBuriinTurul)
      {
        notification.warning({ message: t("Хөнгөлөх төрлөө сонгож өгнө үү!!") });
        return
      }
    }
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: khungulultiinTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай засагдлаа") });
          setKhungulultiinTokhirgoo(null);
          baiguullagaMutate();
          setSongogdsonTsonkhniiIndex(2)
        }
      });
  };

  return (
    <>
      <div className=" col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Нийтээр хөнгөлөх")}
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Хөнгөлөлт идэвхжүүлэх")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    baiguullaga?.tokhirgoo?.bukhAjiltanKhungulultOruulakhEsekh
                  }
                  onChange={(v) =>
                    setKhungulultiinTokhirgoo((a) => ({
                      ...(a || {}),
                      bukhAjiltanKhungulultOruulakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Хөнгөлөлтийн хувь тохируулах")}</div>
                <div className="text-gray-600">
                  {t("Гараас гэрээ байгуулахад хөнгөлж болох дээд хувь")}
                </div>
              </div>
              <div className="ml-auto">
                <InputNumber
                  value={khungulukhKhuvi}
                  max={100}
                  min={0}
                  onChange={(v) => {
                    setKhungulultiinTokhirgoo((a) => ({
                      ...(a || {}),
                      deedKhungulultiinKhuvi: v,
                    }))
                    setKhungulukhKhuvi(v)
                  }
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Хоногоор хөнгөлөлт идэвхжүүлэх")}</div>
                <div className="text-gray-600">{t("Хөнгөлөлтийн цонхноос хоногоор хөнгөлөлт оруулах боломж идэвхжүүлэх")}</div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    baiguullaga?.tokhirgoo?.khonogKhungulultOruulakhEsekh
                  }
                  onChange={(v) =>
                    setKhungulultiinTokhirgoo((a) => ({
                      ...(a || {}),
                      khonogKhungulultOruulakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-3">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Автомат хөнгөлөлт идэвхжүүлэх")}</div>
                <div className="text-gray-600">{t("Сар бүр тогтмол өдөр буюу түрээсийн авлагын дараагийн өдөр хөнгөлөлт үүсгэх боломж идэвхжүүлэх")}</div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    baiguullaga?.tokhirgoo?.sarBurAutoKhungulultOruulakhEsekh
                  }
                  onChange={(v) => {
                      setKhungulultiinTokhirgoo((a) => ({
                        ...(a || {}),
                        sarBurAutoKhungulultOruulakhEsekh: v,
                      }))
                      setSarBurAutoKhungulultOruulakhEsekh(v)
                    }
                  }
                />
              </div>
            </div>
          </div>
          {sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-3">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">{t("Хөнгөлөлтийн өдөр тохируулах")}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <InputNumber
                    value={khungulukhSarBuriinTulburEkhlekhUdur}
                    min={1}
                    onChange={(v) => {
                      setKhungulultiinTokhirgoo((a) => ({
                        ...(a || {}),
                        khungulukhSarBuriinTulburEkhlekhUdur: v,
                      }))
                      setKhungulukhSarBuriinTulburEkhlekhUdur(v)
                    }
                    }
                  />
                </div>
                <div className="ml-auto">
                  <InputNumber
                    value={khungulukhSarBuriinTulburDuusakhUdur}
                    min={1}
                    onChange={(v) => {
                      setKhungulultiinTokhirgoo((a) => ({
                        ...(a || {}),
                        khungulukhSarBuriinTulburDuusakhUdur: v,
                      }))
                      setKhungulukhSarBuriinTulburDuusakhUdur(v)
                    }
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-3">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">{t("Түрээсийн төлбөрөөс хөнгөлөлт бодох эсэх")}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Switch
                    defaultChecked={
                      baiguullaga?.tokhirgoo?.tureesiinDungeesKhungulukhEsekh
                    }
                    onChange={(v) => {
                        setKhungulultiinTokhirgoo((a) => ({
                          ...(a || {}),
                          tureesiinDungeesKhungulukhEsekh: v,
                        }))
                      }
                    }
                  /> 
                </div>
              </div>
            </div>
          )}
          {sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-3">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">{t("Хөнгөлөлтийн өдөр тохируулах")}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Switch
                    defaultChecked={
                      baiguullaga?.tokhirgoo?.ashiglaltDungeesKhungulukhEsekh
                    }
                    onChange={(v) => {
                        setKhungulultiinTokhirgoo((a) => ({
                          ...(a || {}),
                          ashiglaltDungeesKhungulukhEsekh: v,
                        }))
                      }
                    }
                  /> 
                </div>
              </div>
            </div>
          )}
          {sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-3">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">{t("Хөнгөлөлт бодох шалгуурын дээд мөнгөн дүн тохируулах")}</div>
                  <div className="text-gray-600">{t("Өмнөх сарын авлагын үлдэгдлийг шалгуурын дээд мөнгөн дүнтэй харьцуулж хөнгөлөлт идэвхжүүлэх")}</div>
                </div>
                <div className="ml-auto">
                  <InputNumber
                    style={{ width: "100%" }}
                    value={khungulukhSarBuriinShalguurDun}
                    min={0}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    onChange={(v) => {
                      setKhungulultiinTokhirgoo((a) => ({
                        ...(a || {}),
                        khungulukhSarBuriinShalguurDun: v,
                      }))
                      setKhungulukhSarBuriinShalguurDun(v)
                    }
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-3">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">{t("Хөнгөлөх төрөл")}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Select
                    placeholder="Хөнгөлөх төрөл"
                    className="w-32"
                    value={khungulukhSarBuriinTurul}
                    onChange={(v) => {
                      setKhungulultiinTokhirgoo((a) => ({
                        ...(a || {}),
                        khungulukhSarBuriinTurul: v,
                      }))
                      setKhungulukhSarBuriinTurul(v),
                      setKhungulukhSarBuriinUtga(0)
                    }}
                  >
                    <Select.Option key={"khuvi"}>Хувь</Select.Option>
                    <Select.Option key={"mungunDun"}>
                      Мөнгөн дүн
                    </Select.Option>
                  </Select>  
                </div>
              </div>
            </div>
          )}
          {sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-3">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">{khungulukhSarBuriinTurul === "khuvi" ? t("Хөнгөлөх хувь") : t("Хөнгөлөх дүн")}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      placeholder={
                        khungulukhSarBuriinTurul === "khuvi"
                          ? "Хөнгөлөх хувь"
                          : "Хөнгөлөх дүн"
                      }
                      value={khungulukhSarBuriinUtga}
                      onChange={(v) => {
                        setKhungulultiinTokhirgoo((a) => ({
                          ...(a || {}),
                          khungulukhSarBuriinUtga: v,
                        }))
                        setKhungulukhSarBuriinUtga(v)
                      }}
                    />
                </div>
              </div>
            </div>
          )}
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2 ${!!khungulultiinTokhirgoo ? "flex" : "hidden"
              }`}
          >
            <Button type="primary" onClick={khungulultiinTokhirgooKhadgalya}>
              {t("Хадгалах")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default KhuviinMedeelel;
