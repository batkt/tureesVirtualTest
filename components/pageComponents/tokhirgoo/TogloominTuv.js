import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, InputNumber, message } from "antd";
import { t } from "i18next";
import React, { useEffect, useMemo, useState } from "react";
import uilchilgee from "services/uilchilgee";

const dolooKhonog = [
  { id: "1", ner: "Даваа" },
  { id: "2", ner: "Мягмар" },
  { id: "3", ner: "Лхагва" },
  { id: "4", ner: "Пүрэв" },
  { id: "5", ner: "Баасан" },
  { id: "6", ner: "Бямба" },
  { id: "0", ner: "Ням" },
];

function TogloominTuv({ token, baiguullaga, barilgiinId }) {
  const [ajliinUdur, setAjliinUdur] = useState({
    _id: undefined,
    udur: [],
    tariffuud: [],
    undsenTariff: undefined,
    asragchTariff: undefined,
  });
  const [amraltiinUdur, setAmraltiinUdur] = useState({
    _id: undefined,
    udur: [],
    tariffuud: [],
    undsenTariff: undefined,
    asragchTariff: undefined,
  });

  const [asragchTariff, setAsragchTariff] = useState();

  function khadgalakh() {
    var duussan = [];
    ajliinUdur.baiguullagiinId = baiguullaga._id;
    ajliinUdur.asragchTariff = asragchTariff;
    ajliinUdur.barilgiinId = barilgiinId;
    amraltiinUdur.baiguullagiinId = baiguullaga._id;
    amraltiinUdur.asragchTariff = asragchTariff;
    amraltiinUdur.barilgiinId = barilgiinId;
    if (!!ajliinUdur._id) {
      uilchilgee(token)
        .put(`/togloomiinTariff/${ajliinUdur._id}`, ajliinUdur)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(t("Амжилттай хадгаллаа"));
          } else {
            return;
          }
        });
    } else {
      uilchilgee(token)
        .post("/togloomiinTariff", ajliinUdur)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(t("Амжилттай хадгаллаа"));
          } else {
            return;
          }
        });
    }
    if (!!amraltiinUdur._id) {
      uilchilgee(token)
        .put(`/togloomiinTariff/${amraltiinUdur._id}`, amraltiinUdur)
        .then(({ data }) => {
          if (data === "Amjilttai") {
          } else {
            return;
          }
        });
    } else {
      uilchilgee(token)
        .post("/togloomiinTariff", amraltiinUdur)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(t("Амжилттай хадгаллаа"));
          } else {
            return;
          }
        });
    }
  }

  useEffect(() => {
    uilchilgee(token)
      .get("/togloomiinTariff", { baiguullagiinId: baiguullaga._id })
      .then(({ data }) => {
        if (!!data?.jagsaalt) {
          if (data.jagsaalt.length > 0) {
            setAjliinUdur({
              ...ajliinUdur,
              udur: data?.jagsaalt[0].udur,
              tariffuud: data?.jagsaalt[0].tariffuud,
              _id: data?.jagsaalt[0]._id,
              undsenTariff: data?.jagsaalt[0].undsenTariff,
            });
            setAsragchTariff(data?.jagsaalt[0].asragchTariff);
          }
          if (data.jagsaalt.length > 1) {
            setAmraltiinUdur({
              ...ajliinUdur,
              udur: data?.jagsaalt[1].udur,
              tariffuud: data?.jagsaalt[1].tariffuud,
              _id: data?.jagsaalt[1]._id,
              undsenTariff: data?.jagsaalt[1].undsenTariff,
            });
          }
        }
      });
  }, [baiguullaga]);
  return (
    <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12">
      <div className="col-span-1 space-y-5 py-5 lg:col-span-8">
        <div className="box w-full rounded-md border p-3 py-2 sm:p-5">
          <div className="pb-4 font-medium">{t("Ажлын өдөр")}</div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
            {dolooKhonog.map((a, i) => {
              return (
                <button
                  className={`w-full rounded-md border py-2 text-xs shadow-md sm:text-sm ${
                    ajliinUdur?.udur?.find((c) => c === a.id) !== undefined &&
                    "bg-blue-800 text-white"
                  }`}
                  key={i}
                  onClick={() => {
                    ajliinUdur.udur.find((c) => c === a.id) === undefined
                      ? setAjliinUdur({
                          ...ajliinUdur,
                          udur: [...ajliinUdur.udur, a.id],
                        })
                      : setAjliinUdur({
                          ...ajliinUdur,
                          udur: ajliinUdur.udur.filter((d) => d !== a.id),
                        });
                    setAmraltiinUdur({
                      ...amraltiinUdur,
                      udur: amraltiinUdur.udur.filter((b) => b !== a.id),
                    });
                  }}
                >
                  {t(a.ner)}
                </button>
              );
            })}
          </div>
          <Button
            icon={<PlusOutlined />}
            className="mt-5 w-full dark:bg-gray-700 dark:text-white"
            type="dashed"
            onClick={() => {
              setAjliinUdur({
                ...ajliinUdur,
                tariffuud: [...ajliinUdur.tariffuud, {}],
              });
            }}
          >
            {t("Тариф нэмэх")}
          </Button>
          <div
            className="my-5 space-y-3 overflow-y-auto py-2"
            style={{ maxHeight: "calc( 100vh - 80vh )" }}
          >
            {ajliinUdur.tariffuud?.map((a, i) => {
              return (
                <div
                  className="relative grid w-full grid-cols-1 items-center gap-3 rounded-md border bg-green-50 px-4 py-3 shadow-md dark:bg-gray-700 sm:grid-cols-2 sm:gap-5 sm:px-10 sm:py-2 lg:grid-cols-4"
                  key={i}
                >
                  <div
                    onClick={() =>
                      setAjliinUdur({
                        ...ajliinUdur,
                        tariffuud: ajliinUdur.tariffuud.filter(
                          (a, index) => index !== i
                        ),
                      })
                    }
                    className="absolute right-2 top-2 flex cursor-pointer text-lg transition-all hover:text-red-500 sm:top-3"
                  >
                    <CloseCircleOutlined />
                  </div>

                  <label className="text-start text-sm sm:text-end sm:text-base">
                    {t("Минут хүртэл")}:
                  </label>
                  <InputNumber
                    value={ajliinUdur.tariffuud[i]?.minut}
                    onChange={(v) => {
                      ajliinUdur.tariffuud[i].minut = v;
                      setAjliinUdur({ ...ajliinUdur });
                    }}
                    className="w-full"
                    placeholder={t("Минут")}
                  />
                  <label className="text-start text-sm sm:text-end sm:text-base">
                    {t("Тариф/₮/")}:
                  </label>
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    value={ajliinUdur.tariffuud[i]?.tariff}
                    onChange={(v) => {
                      ajliinUdur.tariffuud[i].tariff = v;
                      setAjliinUdur({ ...ajliinUdur });
                    }}
                    className="w-full"
                    placeholder={t("тариф")}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="box w-full rounded-md border p-3 py-2 sm:p-5">
          <div className="pb-4 font-medium">{t("Амралтын өдөр")}</div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
            {dolooKhonog.map((a, i) => {
              return (
                <button
                  className={`w-full rounded-md border py-2 text-xs shadow-md sm:text-sm ${
                    amraltiinUdur.udur?.find((c) => c === a.id) !== undefined &&
                    "bg-green-600 text-white"
                  }`}
                  key={i}
                  onClick={() => {
                    amraltiinUdur.udur.find((c) => c === a.id) === undefined
                      ? setAmraltiinUdur({
                          ...amraltiinUdur,
                          udur: [...amraltiinUdur.udur, a.id],
                        })
                      : setAmraltiinUdur({
                          ...amraltiinUdur,
                          udur: amraltiinUdur.udur.filter((d) => d !== a.id),
                        });
                    setAjliinUdur({
                      ...ajliinUdur,
                      udur: ajliinUdur.udur.filter((b) => b !== a.id),
                    });
                  }}
                >
                  {t(a.ner)}
                </button>
              );
            })}
          </div>
          <Button
            icon={<PlusOutlined />}
            type="dashed"
            className="mt-5 w-full dark:bg-gray-700 dark:text-white"
            onClick={() => {
              setAmraltiinUdur({
                ...amraltiinUdur,
                tariffuud: [...amraltiinUdur.tariffuud, {}],
              });
            }}
          >
            {t("Тариф нэмэх")}
          </Button>
          <div
            className="my-5 space-y-3 overflow-y-auto py-2"
            style={{ maxHeight: "calc( 100vh - 80vh )" }}
          >
            {amraltiinUdur.tariffuud.map((a, i) => {
              return (
                <div
                  className="relative grid w-full grid-cols-1 items-center gap-3 rounded-md border bg-green-50 px-4 py-3 shadow-md dark:bg-gray-700 sm:grid-cols-2 sm:gap-5 sm:px-10 sm:py-2 lg:grid-cols-4"
                  key={i}
                >
                  <div
                    onClick={() =>
                      setAmraltiinUdur({
                        ...amraltiinUdur,
                        tariffuud: amraltiinUdur.tariffuud.filter(
                          (a, index) => index !== i
                        ),
                      })
                    }
                    className="absolute right-2 top-2 flex cursor-pointer text-lg transition-all hover:text-red-500 sm:top-3"
                  >
                    <CloseCircleOutlined />
                  </div>
                  <label className="text-start text-sm sm:text-end sm:text-base">
                    {t("Минут хүртэл")}:
                  </label>
                  <InputNumber
                    value={amraltiinUdur.tariffuud[i]?.minut}
                    onChange={(v) => {
                      amraltiinUdur.tariffuud[i].minut = v;
                      setAmraltiinUdur({ ...amraltiinUdur });
                    }}
                    className="w-full"
                    placeholder={t("Минут")}
                  />
                  <label className="text-start text-sm sm:text-end sm:text-base">
                    {t("Тариф/₮/")}:
                  </label>
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    value={amraltiinUdur.tariffuud[i]?.tariff}
                    onChange={(v) => {
                      amraltiinUdur.tariffuud[i].tariff = v;
                      setAmraltiinUdur({ ...amraltiinUdur });
                    }}
                    className="w-full"
                    placeholder={t("тариф")}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="col-span-1 p-3 sm:p-5 lg:col-span-4 lg:pr-0">
        <div className="box divide-y p-3 py-2 sm:p-5">
          <div className="flex flex-col justify-between gap-2 py-2 sm:flex-row sm:items-center">
            <span className="text-sm sm:text-base">
              {t("Ажлын өдөр үндсэн Тариф/₮/")}:
            </span>
            <InputNumber
              placeholder="Ажлын өдөр"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={ajliinUdur.undsenTariff}
              onChange={(v) =>
                setAjliinUdur({ ...ajliinUdur, undsenTariff: v })
              }
              className="w-full sm:w-auto"
            />
          </div>
          <div className="flex flex-col justify-between gap-2 py-2 sm:flex-row sm:items-center">
            <span className="text-sm sm:text-base">
              {t("Амралтын өдөр үндсэн Тариф/₮/")}:
            </span>
            <InputNumber
              placeholder="Амралтын өдөр"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={amraltiinUdur.undsenTariff}
              onChange={(v) =>
                setAmraltiinUdur({ ...amraltiinUdur, undsenTariff: v })
              }
              className="w-full sm:w-auto"
            />
          </div>
          <div className="flex flex-col justify-between gap-2 py-2 sm:flex-row sm:items-center">
            <span className="text-sm sm:text-base">
              {t("Нэмэлт асран хамгаалагчийн Тариф")}:
            </span>
            <InputNumber
              placeholder="Асран хамгаалагч"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={asragchTariff}
              onChange={(v) => setAsragchTariff(v)}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
        <div className="box mt-5 flex items-center justify-end px-3 py-2 sm:px-5">
          <Button
            className="w-full"
            type="primary"
            onClick={() => khadgalakh()}
          >
            {t("Хадгалах")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TogloominTuv;
