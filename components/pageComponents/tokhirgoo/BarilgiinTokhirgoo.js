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

function BarilgiinTokhirgoo({
  token,
  barilgiinId,
  baiguullaga,
  baiguullagaMutate,
  setSongogdsonTsonkhniiIndex,
}) {
  const { t } = useTranslation();
  const [songogdsonBarilga, setSongogdsonBarilga] = useState(
    barilgiinId || null
  );
  const [barilgaTokhirgoo, setBarilgaTokhirgoo] = useState();

  const barilga = useMemo(
    () => baiguullaga?.barilguud?.find((a) => a._id === songogdsonBarilga),
    [songogdsonBarilga]
  );
  const duurguud = [
    {
      branchCode: "0001",
      branchName: "Архангай",
    },
    {
      branchCode: "0002",
      branchName: "Баян-Өлгий",
    },
    {
      branchCode: "0003",
      branchName: "Баянхонгор",
    },
    {
      branchCode: "0004",
      branchName: "Булган",
    },
    {
      branchCode: "0005",
      branchName: "Говь-Алтай",
    },
    {
      branchCode: "0006",
      branchName: "Дорноговь",
    },
    {
      branchCode: "0007",
      branchName: "Дорнод",
    },
    {
      branchCode: "0008",
      branchName: "Дундговь",
    },
    {
      branchCode: "0009",
      branchName: "Завхан",
    },
    {
      branchCode: "0010",
      branchName: "Өвөрхангай",
    },
    {
      branchCode: "0011",
      branchName: "Өмнөговь",
    },
    {
      branchCode: "0012",
      branchName: "Сүхбаатар",
    },
    {
      branchCode: "0013",
      branchName: "Сэлэнгэ",
    },
    {
      branchCode: "0014",
      branchName: "Төв",
    },
    {
      branchCode: "0015",
      branchName: "Увс",
    },
    {
      branchCode: "0016",
      branchName: "Ховд",
    },
    {
      branchCode: "0017",
      branchName: "Хөвсгөл",
    },
    {
      branchCode: "0018",
      branchName: "Хэнтий",
    },
    {
      branchCode: "0019",
      branchName: "Дархан-Уул",
    },
    {
      branchCode: "0020",
      branchName: "Орхон",
    },
    {
      branchCode: "0023",
      branchName: "Хан-Уул",
    },
    {
      branchCode: "0024",
      branchName: "Баянзүрх",
    },
    {
      branchCode: "0025",
      branchName: "Сүхбаатар дүүрэг",
    },
    {
      branchCode: "0026",
      branchName: "Баянгол",
    },
    {
      branchCode: "0027",
      branchName: "Багануур",
    },
    {
      branchCode: "0028",
      branchName: "Багахангай",
    },
    {
      branchCode: "0029",
      branchName: "Налайх",
    },
    {
      branchCode: "0032",
      branchName: "Говьсүмбэр",
    },
    {
      branchCode: "0034",
      branchName: "Сонгинохайрхан",
    },
    {
      branchCode: "0035",
      branchName: "Чингэлтэй",
    },
  ];

  useEffect(() => {
    if (barilga) {
      setBarilgaTokhirgoo({
        ...barilga?.tokhirgoo,
        aldangiBodojEkhlekhOgnoo: barilga?.tokhirgoo?.aldangiBodojEkhlekhOgnoo
          ? moment(barilga?.tokhirgoo?.aldangiBodojEkhlekhOgnoo)
          : undefined,
        eBarimtAshiglakhEsekh: barilga?.tokhirgoo?.eBarimtAshiglakhEsekh
          ? barilga?.tokhirgoo?.eBarimtAshiglakhEsekh
          : undefined,
        eBarimtShine: barilga?.tokhirgoo?.eBarimtShine
          ? barilga?.tokhirgoo?.eBarimtShine
          : undefined,
        merchantTin: barilga?.tokhirgoo?.merchantTin
          ? barilga?.tokhirgoo?.merchantTin
          : undefined,
        districtCode: barilga?.tokhirgoo?.districtCode
          ? barilga?.tokhirgoo?.districtCode
          : undefined,
        eBarimtAutomataarIlgeekh: barilga?.tokhirgoo?.eBarimtAutomataarIlgeekh
          ? barilga?.tokhirgoo?.eBarimtAutomataarIlgeekh
          : undefined,
        nuatTulukhEsekh: barilga?.tokhirgoo?.nuatTulukhEsekh
          ? barilga?.tokhirgoo?.nuatTulukhEsekh
          : undefined,
      });
    }
  }, [barilga, songogdsonBarilga]);

  const barilgaTokhirgooKhadgalya = () => {
    const yavuulakhData = { ...baiguullaga };
    const barilguudCopy = [...yavuulakhData?.barilguud];
    const tukhainBarilgiinIndex = barilguudCopy.findIndex(
      (a) => a._id === songogdsonBarilga
    );

    if (tukhainBarilgiinIndex !== -1) {
      const updatedBarilga = {
        ...barilguudCopy[tukhainBarilgiinIndex],
        tokhirgoo: barilgaTokhirgoo,
      };
      barilguudCopy[tukhainBarilgiinIndex] = updatedBarilga;
      yavuulakhData.barilguud = barilguudCopy;
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
                <div className="font-medium">{t("Алдангийн хувь")}</div>
                <div className="text-gray-600">
                  {t(
                    "Гэрээний төлөлт хугацаа хэтэрсэн үед тооцох алдангийн хувь"
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
                <div className="font-medium">{t("Алданги чөлөөлөх хоног")}</div>
                <div className="text-gray-600">
                  {t(
                    "Алданги хугацаа хэтэрсэн хоногоос хэд хоногийн дараагаас бодож эхлэх хоног"
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
                  value={barilgaTokhirgoo?.aldangiBodojEkhlekhOgnoo}
                  onChange={(v) =>
                    setBarilgaTokhirgoo((a) => ({
                      ...(a || {}),
                      aldangiBodojEkhlekhOgnoo: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
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
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">{t("Дүүрэг")}</div>
                  <div className="text-gray-600"></div>
                </div>
                <div className="ml-auto">
                  <Select
                    className="min-w-[150px]"
                    value={barilgaTokhirgoo?.districtCode}
                    onChange={(v) => (a) => ({
                      ...(a || {}),
                      districtCode: target.value,
                    })}
                  >
                    {duurguud.map((duureg) => {
                      return (
                        <Select.Option value={duureg?.branchCode}>
                          {duureg?.branchName}
                        </Select.Option>
                      );
                    })}
                  </Select>
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
