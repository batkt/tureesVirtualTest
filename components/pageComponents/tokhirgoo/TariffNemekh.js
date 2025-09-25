import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, InputNumber } from "antd";
import React, { useImperativeHandle, useState } from "react";

function TariffNemekh({ data, baiguullaga, barilgiinId, token, destroy }, ref) {
  const [ajliinUdur, setAjliinUdur] = useState([]);
  const [tariff, setTariff] = useState([]);
  useImperativeHandle(
    ref,
    () => ({
      ilgeeye() {},
      khaaya() {
        destroy();
      },
    }),
    [ajliinUdur, tariff, baiguullaga, barilgiinId, token]
  );

  const dolooKhonog = [
    { id: "1", ner: "Даваа" },
    { id: "2", ner: "Мягмар" },
    { id: "3", ner: "Лхагва" },
    { id: "4", ner: "Пүрэв" },
    { id: "5", ner: "Баасан" },
    { id: "6", ner: "Бямба" },
    { id: "0", ner: "Ням" },
  ];

  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {dolooKhonog.map((a, i) => {
          return (
            <button
              className={`w-full rounded-md border shadow-md ${
                ajliinUdur?.find((c) => c === a.id) !== undefined &&
                "bg-blue-800 text-white"
              }`}
              key={i}
              onClick={() => {
                ajliinUdur.find((c) => c === a.id) === undefined
                  ? setAjliinUdur([...ajliinUdur, a.id])
                  : setAjliinUdur(ajliinUdur.filter((d) => d !== a.id));
              }}
            >
              {a.ner}
            </button>
          );
        })}
      </div>
      <Button
        className="mt-5"
        onClick={() => {
          setTariff([...tariff, { id: tariff.length }]);
        }}
      >
        Tariff нэмэх
      </Button>
      <div className="mt-5 space-y-3">
        {tariff.map((a, i) => {
          return (
            <div
              className="relative flex w-full justify-between gap-5 rounded-md border bg-green-50 px-10 py-2 shadow-md"
              key={i}
            >
              <div
                onClick={() =>
                  setTariff(tariff.filter((a, index) => index !== i))
                }
                className="absolute right-2 top-3 flex text-lg transition-all hover:text-red-500"
              >
                <CloseCircleOutlined />
              </div>
              <InputNumber
                onChange={(v) => {
                  tariff[i].minut = v;
                  setTariff(tariff);
                }}
                className="w-full"
                placeholder="Минут"
              />
              <InputNumber
                onChange={(v) => {
                  tariff[i].tariff = v;
                  setTariff(tariff);
                }}
                className="w-full"
                placeholder="Tariff"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.forwardRef(TariffNemekh);
