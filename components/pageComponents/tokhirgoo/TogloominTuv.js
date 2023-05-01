import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, InputNumber, message } from "antd";
import { modal } from "components/ant/Modal";
import { t } from "i18next";
import React, { useEffect, useMemo, useState } from "react";
import uilchilgee from "services/uilchilgee";
import TariffNemekh from "./TariffNemekh";

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
    <div className="col-span-12 grid grid-cols-12">
      <div className="col-span-8 space-y-5 py-5">
        <div className="box w-full rounded-md border p-5 py-2">
          <div className="pb-4 font-medium">{t("Ажлын өдөр")}</div>
          <div className=" grid grid-cols-7 gap-2">
            {dolooKhonog.map((a, i) => {
              return (
                <button
                  className={`w-full rounded-md border shadow-md ${
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
            className="mt-5 w-full"
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
                  className="relative grid w-full grid-cols-4 items-center justify-between  gap-5 rounded-md border bg-green-50 px-10 py-2 shadow-md 2xl:pr-20"
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
                    className="absolute right-2 top-3 flex text-lg transition-all hover:text-red-500"
                  >
                    <CloseCircleOutlined />
                  </div>
                  <label className="w-40 text-end">{t("Минут хүртэл")}:</label>
                  <InputNumber
                    value={ajliinUdur.tariffuud[i]?.minut}
                    onChange={(v) => {
                      ajliinUdur.tariffuud[i].minut = v;
                      setAjliinUdur({ ...ajliinUdur });
                    }}
                    className="w-full"
                    placeholder={t("Минут")}
                  />
                  <label className="w-40 text-end">{t("Тариф/₮/")}:</label>
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
        <div className="box w-full rounded-md border p-5 py-2">
          <div className="pb-4 font-medium">{t("Амралтын өдөр")}</div>
          <div className=" grid grid-cols-7 gap-2">
            {dolooKhonog.map((a, i) => {
              return (
                <button
                  className={`w-full rounded-md border shadow-md ${
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
            className="mt-5 w-full"
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
                  className="relative grid w-full grid-cols-4 items-center justify-between  gap-5 rounded-md border bg-green-50 px-10 py-2 shadow-md 2xl:pr-20"
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
                    className="absolute right-2 top-3 flex text-lg transition-all hover:text-red-500"
                  >
                    <CloseCircleOutlined />
                  </div>
                  <label className="text-end">{t("Минут хүртэл")}:</label>
                  <InputNumber
                    value={amraltiinUdur.tariffuud[i]?.minut}
                    onChange={(v) => {
                      amraltiinUdur.tariffuud[i].minut = v;
                      setAmraltiinUdur({ ...amraltiinUdur });
                    }}
                    className="w-full"
                    placeholder={t("Минут")}
                  />
                  <label className="w-40 text-end">{t("Тариф/₮/")}:</label>
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
      <div className="col-span-4 p-5 pr-0">
        <div className="box divide-y p-5 py-2">
          <div className="flex items-center justify-between py-2">
            {t("Ажлын өдөр үндсэн Тариф/₮/")}:{" "}
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={ajliinUdur.undsenTariff}
              onChange={(v) =>
                setAjliinUdur({ ...ajliinUdur, undsenTariff: v })
              }
              className=""
            />
          </div>
          <div className="flex items-center justify-between py-2">
            {t("Амралтын өдөр үндсэн Тариф/₮/")}:{" "}
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={amraltiinUdur.undsenTariff}
              onChange={(v) =>
                setAmraltiinUdur({ ...amraltiinUdur, undsenTariff: v })
              }
              className=""
            />
          </div>
          <div className="flex items-center justify-between py-2">
            {t("Нэмэлт асран хамгаалагчийн Тариф")}:{" "}
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={asragchTariff}
              onChange={(v) => setAsragchTariff(v)}
              className=""
            />
          </div>
        </div>
        <div className="box mt-5 flex items-center justify-end px-5 py-2">
          <Button
            className="w-full"
            type="primary"
            onClick={() => khadgalakh()}
          >
            {" "}
            {t("Хадгалах")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TogloominTuv;
