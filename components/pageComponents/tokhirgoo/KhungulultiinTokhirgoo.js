import React, { useEffect, useState, useMemo } from "react";
import { Button, InputNumber, notification, Switch, Select } from "antd";
import uilchilgee from "services/uilchilgee";

import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { useTranslation } from "react-i18next";

function KhungulultiinTokhirgoo({
  ajiltan = {},
  token,
  baiguullaga,
  baiguullagaMutate,
  barilgiinId,
  setSongogdsonTsonkhniiIndex,
}) {
  const { t } = useTranslation();
  const barilga = useMemo(
    () => baiguullaga?.barilguud?.find((a) => a._id === barilgiinId),
    [barilgiinId]
  );
  const { ajilchdiinGaralt, ajiltniiJagsaaltMutate } = useAjiltniiJagsaalt(
    token,
    ajiltan?.baiguullagiinId
  );

  const [khungulultiinTokhirgoo, setKhungulultiinTokhirgoo] = useState(null);
  const [khungulukhKhuvi, setKhungulukhKhuvi] = useState(
    baiguullaga?.tokhirgoo?.deedKhungulultiinKhuvi
  );
  const [barilgaTokhirgoo, setBarilgaTokhirgoo] = useState({
    ...barilga?.tokhirgoo,
    sarBurAutoKhungulultOruulakhEsekh:
      barilga?.tokhirgoo?.sarBurAutoKhungulultOruulakhEsekh ?? false,
    khungulukhSarBuriinShalguurDun: barilga?.tokhirgoo
      ?.khungulukhSarBuriinShalguurDun
      ? barilga?.tokhirgoo?.khungulukhSarBuriinShalguurDun
      : undefined,
    khungulukhSarBuriinTurul: barilga?.tokhirgoo?.khungulukhSarBuriinTurul
      ? barilga?.tokhirgoo?.khungulukhSarBuriinTurul
      : undefined,
    khungulukhSarBuriinUtga: barilga?.tokhirgoo?.khungulukhSarBuriinUtga
      ? barilga?.tokhirgoo?.khungulukhSarBuriinUtga
      : undefined,
    khungulukhSarBuriinTulburEkhlekhUdur: barilga?.tokhirgoo
      ?.khungulukhSarBuriinTulburEkhlekhUdur
      ? barilga?.tokhirgoo?.khungulukhSarBuriinTulburEkhlekhUdur
      : undefined,
    khungulukhSarBuriinTulburDuusakhUdur: barilga?.tokhirgoo
      ?.khungulukhSarBuriinTulburDuusakhUdur
      ? barilga?.tokhirgoo?.khungulukhSarBuriinTulburDuusakhUdur
      : undefined,
  });

  useEffect(() => {
    if (barilga) {
      setBarilgaTokhirgoo({
        ...barilga?.tokhirgoo,
        sarBurAutoKhungulultOruulakhEsekh:
          barilga?.tokhirgoo?.sarBurAutoKhungulultOruulakhEsekh ?? false,
        khungulukhSarBuriinShalguurDun: barilga?.tokhirgoo
          ?.khungulukhSarBuriinShalguurDun
          ? barilga?.tokhirgoo?.khungulukhSarBuriinShalguurDun
          : undefined,
        khungulukhSarBuriinTurul: barilga?.tokhirgoo?.khungulukhSarBuriinTurul
          ? barilga?.tokhirgoo?.khungulukhSarBuriinTurul
          : undefined,
        khungulukhSarBuriinUtga: barilga?.tokhirgoo?.khungulukhSarBuriinUtga
          ? barilga?.tokhirgoo?.khungulukhSarBuriinUtga
          : undefined,
        khungulukhSarBuriinTulburEkhlekhUdur: barilga?.tokhirgoo
          ?.khungulukhSarBuriinTulburEkhlekhUdur
          ? barilga?.tokhirgoo?.khungulukhSarBuriinTulburEkhlekhUdur
          : undefined,
        khungulukhSarBuriinTulburDuusakhUdur: barilga?.tokhirgoo
          ?.khungulukhSarBuriinTulburDuusakhUdur
          ? barilga?.tokhirgoo?.khungulukhSarBuriinTulburDuusakhUdur
          : undefined,
      });
    }
  }, [barilgiinId]);

  const khungulultiinTokhirgooKhadgalya = () => {
    if (barilgaTokhirgoo) {
      if (
        (barilgaTokhirgoo?.sarBurAutoKhungulultOruulakhEsekh &&
          !barilgaTokhirgoo?.khungulukhSarBuriinTulburEkhlekhUdur) ||
        barilgaTokhirgoo?.khungulukhSarBuriinTulburEkhlekhUdur === 0
      ) {
        notification.warning({
          message: t("Хөнгөлөлт тооцож эхлэх өдрөө оруулна уу!!!"),
        });
        return;
      }
      if (
        (barilgaTokhirgoo?.sarBurAutoKhungulultOruulakhEsekh &&
          !barilgaTokhirgoo?.khungulukhSarBuriinTulburDuusakhUdur) ||
        barilgaTokhirgoo?.khungulukhSarBuriinTulburDuusakhUdur === 0
      ) {
        notification.warning({
          message: t("Хөнгөлөлт тооцож дуусах өдрөө оруулна уу!!!"),
        });
        return;
      }
      if (
        barilgaTokhirgoo?.sarBurAutoKhungulultOruulakhEsekh &&
        !barilgaTokhirgoo?.khungulukhSarBuriinTurul
      ) {
        notification.warning({
          message: t("Хөнгөлөх төрлөө сонгож өгнө үү!!"),
        });
        return;
      }
      const yavuulakhData = { ...baiguullaga };
      const barilguudCopy = [...yavuulakhData?.barilguud];
      const tukhainBarilgiinIndex = barilguudCopy.findIndex(
        (a) => a._id === barilgiinId
      );
      if (tukhainBarilgiinIndex !== -1) {
        const updatedBarilga = {
          ...barilguudCopy[tukhainBarilgiinIndex],
          tokhirgoo: barilgaTokhirgoo,
        };
        barilguudCopy[tukhainBarilgiinIndex] = updatedBarilga;
        yavuulakhData.barilguud = barilguudCopy;

        // Merge global tokhirgoo changes into yavuulakhData to avoid race conditions
        if (khungulultiinTokhirgoo) {
          yavuulakhData.tokhirgoo = {
            ...(yavuulakhData.tokhirgoo || {}),
            ...khungulultiinTokhirgoo,
          };
        }

        uilchilgee(token)
          .put(`/baiguullaga/${baiguullaga?._id}`, yavuulakhData)
          .then(({ data }) => {
            if (data === "Amjilttai") {
              notification.success({
                message: "Амжилттай хадгалагдлаа",
                duration: 2,
              });
              setKhungulultiinTokhirgoo(null);
              baiguullagaMutate();
              setSongogdsonTsonkhniiIndex(0);
            }
          })
          .catch((err) => {
            aldaaBarigch(err);
          });
      }
    } else if (khungulultiinTokhirgoo) {
      uilchilgee(token)
        .post("/baiguullagaTokhirgooZasya", {
          baiguullagiinId: baiguullaga?._id,
          tokhirgoo: khungulultiinTokhirgoo,
        })
        .then(({ data }) => {
          if (data === "Amjilttai") {
            notification.success({ message: t("Амжилттай засагдлаа") });
            setKhungulultiinTokhirgoo(null);
            baiguullagaMutate();
            setSongogdsonTsonkhniiIndex(2);
          }
        });
    }
  };

  return (
    <>
      <div className="col-span-12 mt-5  lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
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
                <div className="font-medium">
                  {t("Хөнгөлөлтийн хувь тохируулах")}
                </div>
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
                    }));
                    setKhungulukhKhuvi(v);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Хоногоор хөнгөлөлт идэвхжүүлэх")}
                </div>
                <div className="text-gray-600">
                  {t(
                    "Хөнгөлөлтийн цонхноос хоногоор хөнгөлөлт оруулах боломж идэвхжүүлэх"
                  )}
                </div>
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
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Автомат хөнгөлөлт идэвхжүүлэх")}
                </div>
                <div className="text-gray-600">
                  {t("Сар бүрийн тогтмол өдрөөр авлагын хөнгөлөлт тохируулах")}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  checked={barilgaTokhirgoo?.sarBurAutoKhungulultOruulakhEsekh}
                  onChange={(v) => {
                    setBarilgaTokhirgoo((a) => ({
                      ...(a || {}),
                      sarBurAutoKhungulultOruulakhEsekh: v,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          {barilgaTokhirgoo?.sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Хөнгөлөлтийн өдөр тохируулах")}
                  </div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <InputNumber
                    value={
                      barilgaTokhirgoo?.khungulukhSarBuriinTulburEkhlekhUdur
                    }
                    min={1}
                    onChange={(v) =>
                      setBarilgaTokhirgoo((a) => ({
                        ...(a || {}),
                        khungulukhSarBuriinTulburEkhlekhUdur: v,
                      }))
                    }
                  />
                </div>
                <div className="ml-auto">
                  <InputNumber
                    value={
                      barilgaTokhirgoo?.khungulukhSarBuriinTulburDuusakhUdur
                    }
                    min={1}
                    onChange={(v) =>
                      setBarilgaTokhirgoo((a) => ({
                        ...(a || {}),
                        khungulukhSarBuriinTulburDuusakhUdur: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {barilgaTokhirgoo?.sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Түрээсийн төлбөрөөс хөнгөлөлт бодох эсэх")}
                  </div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Switch
                    defaultChecked={
                      barilgaTokhirgoo?.tureesiinDungeesKhungulukhEsekh
                    }
                    onChange={(v) =>
                      setBarilgaTokhirgoo((a) => ({
                        ...(a || {}),
                        tureesiinDungeesKhungulukhEsekh: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {barilgaTokhirgoo?.sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Ашиглалтын төлбөрөөс хөнгөлөлт бодох эсэх")}
                  </div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Switch
                    defaultChecked={
                      barilgaTokhirgoo?.ashiglaltDungeesKhungulukhEsekh
                    }
                    onChange={(v) =>
                      setBarilgaTokhirgoo((a) => ({
                        ...(a || {}),
                        ashiglaltDungeesKhungulukhEsekh: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {barilgaTokhirgoo?.sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Хөнгөлөлт бодох шалгуурын дээд мөнгөн дүн тохируулах")}
                  </div>
                  <div className="text-gray-600">
                    {t(
                      "Өмнөх сарын авлагын үлдэгдлийг шалгуурын дээд мөнгөн дүнтэй харьцуулж хөнгөлөлт идэвхжүүлэх"
                    )}
                  </div>
                </div>
                <div className="ml-auto">
                  <InputNumber
                    style={{ width: "100%" }}
                    value={barilgaTokhirgoo?.khungulukhSarBuriinShalguurDun}
                    min={0}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    onChange={(v) =>
                      setBarilgaTokhirgoo((a) => ({
                        ...(a || {}),
                        khungulukhSarBuriinShalguurDun: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {barilgaTokhirgoo?.sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">{t("Хөнгөлөх төрөл")}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Select
                    placeholder={t("Хөнгөлөх төрөл")}
                    className="w-32"
                    value={barilgaTokhirgoo?.khungulukhSarBuriinTurul}
                    onChange={(v) =>
                      setBarilgaTokhirgoo((a) => ({
                        ...(a || {}),
                        khungulukhSarBuriinTurul: v,
                        khungulukhSarBuriinUtga: 0,
                      }))
                    }
                  >
                    <Select.Option key={"khuvi"}>{t("Хувь")}</Select.Option>
                    <Select.Option key={"mungunDun"}>{t("Мөнгөн дүн")}</Select.Option>
                  </Select>
                </div>
              </div>
            </div>
          )}
          {barilgaTokhirgoo?.sarBurAutoKhungulultOruulakhEsekh && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {barilgaTokhirgoo?.khungulukhSarBuriinTurul === "khuvi"
                      ? t("Хөнгөлөх хувь")
                      : t("Хөнгөлөх дүн")}
                  </div>
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
                      barilgaTokhirgoo?.khungulukhSarBuriinTurul === "khuvi"
                        ? t("Хөнгөлөх хувь")
                        : t("Хөнгөлөх дүн")
                    }
                    value={barilgaTokhirgoo?.khungulukhSarBuriinUtga}
                    onChange={(v) =>
                      setBarilgaTokhirgoo((a) => ({
                        ...(a || {}),
                        khungulukhSarBuriinUtga: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <div
            className={`dark:border-dark-5 flex  items-center justify-end border-b border-gray-200 px-5 pb-2 pt-2`}
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

export default KhungulultiinTokhirgoo;
