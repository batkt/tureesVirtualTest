import React, { useEffect } from "react";
import moment from "moment";
import QRCode from "react-qr-code";
import formatNumber from "tools/function/formatNumber";
import { InputNumber, Input, Switch } from "antd";
import axios from "axios";
import { isString } from "lodash";
import { t } from "i18next";
import { useAuth } from "services/auth";
import uilchilgee from "services/uilchilgee";

function EBarimt({
  eBarimtRef,
  eBarimt,
  data,
  ajiltan,
  tulbur,
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
  eBarimtAutomataarShivikh,
  setCustomerTin,
}) {
  // const { ajiltan } = useAuth();
  function registerShalgaya(register) {
    if (isString(register) && irgenEsekh === true)
      register = register?.toUpperCase();
    setRegister(register);
    setBaiguullaga(null);
    setCustomerTin();
    if (
      register?.toString().length === 7 ||
      (irgenEsekh && register?.toString().length === 10)
    )
      uilchilgee()
        .get(`/tatvaraasBaiguullagaAvya/${register}`)
        .then(({ data }) => {
          if (data?.found === true)
          {
            setBaiguullaga(data);
            setCustomerTin(data?.tin);
          }
        });
  }

  console.log(baiguullagiinMedeelel, "dddsadsa");

  useEffect(() => {
    if (register.length > 6)
      registerShalgaya(register);
  }, [irgenEsekh, register]);

  return (
    <div className="flex flex-row">
      <div className="w-full p-2 dark:text-gray-100">
        <div className="flex flex-row justify-between border-b-2 border-dashed py-2">
          <div>
            {t(`${irgenEsekh ? "Татвар төлөгч иргэн" : "ААН"} регистр`)}
          </div>
          <div className="text-base font-medium">{register}</div>
        </div>
        {baiguullagiinMedeelel?.name && (
          <div className="flex flex-row border-b-2 border-dashed py-2">
            <div>{t(`${irgenEsekh ? "Татвар төлөгч иргэн" : "ААН"} нэр`)}</div>
            <div className="ml-auto text-lg font-medium">
              {baiguullagiinMedeelel?.name}
            </div>
          </div>
        )}
      </div>
      {eBarimt && (
        <div className="hidden">
          <div className="p-2" style={{ minWidth: "20rem" }} ref={eBarimtRef}>
            <table className="w-full">
              <colgroup>
                <col className="w-1/6" />
                <col className="w-1/6" />
                <col className="w-1/6" />
                <col className="w-1/6" />
                <col className="w-1/6" />
                <col className="w-1/6" />
              </colgroup>
              <tbody>
                <tr>
                  <td colSpan={6} className="border text-center">
                    {`${baiguullagaEsekh ? "ААН-д" : "Иргэнд"} очих баримт`}
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} className="border text-center">
                    {baiguullaga?.ner}
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} className="border font-medium">
                    {t("Борлуулагч")}
                  </td>
                </tr>
                <tr>
                  <td className="border" colSpan={3}>
                    {t("Огноо")}
                  </td>
                  <td className="border" colSpan={3}>
                    {moment(Date.now()).format("YYYY/MM/DD hh:mm:ss")}
                  </td>
                </tr>
                <tr>
                  <td className="border" colSpan={3}>
                    {t("ТТД")}
                  </td>
                  <td className="border" colSpan={3}>
                    {eBarimt?.merchantTin}
                  </td>
                </tr>
                <tr>
                  <td className="border" colSpan={3}>
                    {t("ДДТД")}
                  </td>
                  <td className="border" colSpan={3}>
                    {eBarimt?.id}
                  </td>
                </tr>
                <tr>
                  <td className="border" colSpan={3}>
                    {t("Касс")}
                  </td>
                  <td className="border" colSpan={3}>
                    {eBarimt?.posNo}
                  </td>
                </tr>
                <tr>
                  <td className="border" colSpan={3}>
                    {t("Кассчин")}
                  </td>
                  <td className="border" colSpan={3}>
                    {ajiltan?.ner}
                  </td>
                </tr>
                {baiguullagaEsekh && (
                  <>
                    <tr>
                      <td className="border" colSpan={6}>
                        {t("Худалдан авагч")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border" colSpan={1}>
                        {t("ТТД")}
                      </td>
                      <td className="border" colSpan={5}>
                        {baiguullagiinMedeelel?.tin}
                      </td>
                    </tr>
                    <tr>
                      <td className="border" colSpan={1}>
                        {t("Нэр")}
                      </td>
                      <td className="border" colSpan={5}>
                        {baiguullagiinMedeelel?.name}
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td colSpan={6} className="border">
                    <br />
                  </td>
                </tr>
                <tr>
                  <td className="border text-center" colSpan={3}>
                    {t("Барааны нэр")}
                  </td>
                  <td className="border text-center">{t("Тоо")}</td>
                  <td className="border text-center">{t("Нэгж")}</td>
                  <td className="border text-center">{t("Дүн")}</td>
                </tr>
                {eBarimt?.stocks?.map((mur, index) => (
                  <tr key={`${index}-zakhialga`}>
                    <td colSpan={3} className="border text-right">
                      {mur.name}
                    </td>
                    <td className="border text-right">{mur.qty}</td>
                    <td className="border text-right">
                      {formatNumber(mur.unitPrice, 2)}
                    </td>
                    <td className="border text-right">
                      {formatNumber(mur.totalAmount, 2)}
                    </td>
                  </tr>
                ))}
                {data?.khungulukhKhuvi && (
                  <tr>
                    <td colSpan={5} className="border text-right">
                      {t("Хөнгөлөлт")}
                    </td>
                    <td className="border text-right">
                      {formatNumber(data.niitUndsenDun - data.niitDun)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={5} className="border text-right">
                    {t("НӨАТ-н дүн")}
                  </td>
                  <td className="border text-right">
                    {formatNumber(
                      eBarimt.status == "SUCCESS"
                        ? eBarimt?.totalVAT
                        : eBarimt?.vat,
                      2
                    )}
                    ₮
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="border text-right">
                    {t("Төлөх дүн")}
                  </td>
                  <td className="border text-right">
                    {formatNumber(
                      eBarimt.status == "SUCCESS"
                        ? eBarimt?.totalAmount
                        : eBarimt?.amount
                    )}
                    ₮
                  </td>
                </tr>
                {tulbur?.belen && (
                  <tr>
                    <td colSpan={5} className="border text-right">
                      {t("Бэлнээр")}
                    </td>
                    <td className="border text-right">
                      {formatNumber(tulbur?.belen)}
                    </td>
                  </tr>
                )}
                {tulbur?.belenBus && (
                  <tr>
                    <td colSpan={5} className="border text-right">
                      {t("Бэлэн бусаар")}
                    </td>
                    <td className="border text-right">
                      {formatNumber(tulbur?.belenBus)}
                    </td>
                  </tr>
                )}
                {tulbur?.khariult && (
                  <tr>
                    <td colSpan={5} className="border text-right">
                      {t("Хариулт")}
                    </td>
                    <td className="border text-right">
                      {formatNumber(tulbur?.khariult)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={4} className="border">{`Е-Баримт ${
                    baiguullagaEsekh ? "" : "уншуулах"
                  } дүн`}</td>
                  <td colSpan={2} className="border text-right">
                    {formatNumber(
                      eBarimt.status == "SUCCESS"
                        ? eBarimt?.totalAmount
                        : eBarimt?.amount
                    )}
                    ₮
                  </td>
                </tr>
                {/* hamaarahq */}
                {!!irgenEsekh && (
                  <tr>
                    <td colSpan={4} className="border">
                      {t("Сугалааны дугаар")}
                    </td>
                    <td colSpan={2} className="border">
                      {eBarimt?.lottery}
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={6}>
                    <div className="flex w-full justify-center p-5">
                      <div className="h-40 w-40">
                        {eBarimt?.qrData && (
                          <QRCode value={eBarimt?.qrData} size={160} />
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
  return <div></div>;
}

export default EBarimt;
