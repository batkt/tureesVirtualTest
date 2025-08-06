import React from "react";
import moment from "moment";
import QRCode from "react-qr-code";
import formatNumber from "tools/function/formatNumber";
import { InputNumber, Input, Switch } from "antd";
import uilchilgee from "services/uilchilgee";
import { t } from "i18next";
import { useQRCode } from "next-qrcode";

function EBarimt({
  alkham,
  eBarimtRef,
  eBarimt,
  data,
  tulbur,
  ajiltan,
  baiguullaga,
  register,
  setRegister,
  baiguullagaEsekh,
  setBaiguullagaEsekh,
  baiguullagiinMedeelel,
  setBaiguullaga,
  irgenEsekh,
  setIrgenEsekh,
  barimtKhevlekhEsekh,
  setBarimtKhevlekhEsekh,
}) {
  function registerShalgaya(register) {
    setRegister(register);
    setBaiguullaga(null);
    if (register?.toString().length === 7 && baiguullagaEsekh)
      uilchilgee()
        .get(`/tatvaraasBaiguullagaAvya/${register}`)
        .then(({ data }) => setBaiguullaga(data));
  }

  if (alkham === 2)
    return (
      <div className={`flex flex-row p-3`}>
        <div className="w-full p-2">
          <div className="flex flex-row border-b-2 border-dashed py-2">
            <div className="dark:text-white">{t("Баримт хэвлэх эсэх")}</div>
            <div className="ml-auto">
              <Switch
                checked={barimtKhevlekhEsekh}
                onChange={setBarimtKhevlekhEsekh}
              />
            </div>
          </div>
          {barimtKhevlekhEsekh && !irgenEsekh && (
            <div className="flex flex-row border-b-2 border-dashed py-2">
              <div className="dark:text-white">{t("ААН эсэх")}</div>
              <div className="ml-auto">
                <Switch
                  checked={baiguullagaEsekh}
                  onChange={setBaiguullagaEsekh}
                />
              </div>
            </div>
          )}
          {barimtKhevlekhEsekh && !baiguullagaEsekh && (
            <div className="flex flex-row border-b-2 border-dashed py-2">
              <div className="dark:text-white">{t("Иргэнд эсэх")}</div>
              <div className="ml-auto">
                <Switch checked={irgenEsekh} onChange={setIrgenEsekh} />
              </div>
            </div>
          )}
          {baiguullagaEsekh && (
            <div className="flex flex-row border-b-2 border-dashed py-2">
              <div className="dark:text-white">{t("ААН регистр")}</div>
              <div className="ml-auto">
                <InputNumber
                  autoComplete="off"
                  size="small"
                  maxLength={7}
                  minLength={7}
                  onChange={registerShalgaya}
                  value={register}
                />
              </div>
            </div>
          )}
          {irgenEsekh && (
            <div className="flex flex-row border-b-2 border-dashed py-2">
              <div className="dark:text-white">{t("Иргэний регистр")}</div>
              <div className="ml-auto">
                <Input
                  autoComplete="off"
                  size="small"
                  maxLength={10}
                  minLength={10}
                  onChange={({ target }) => registerShalgaya(target.value)}
                  value={register}
                />
              </div>
            </div>
          )}
          {baiguullagiinMedeelel?.name && (
            <div className="flex flex-row border-b-2 border-dashed py-2">
              <div>{t("ААН нэр")}</div>
              <div className="ml-auto text-lg font-medium">
                {baiguullagiinMedeelel?.name}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  return <div></div>;
}

export default EBarimt;
