import React from "react"
import moment from "moment"
import QRCode from "react-qr-code"
import formatNumber from "tools/function/formatNumber"
import { InputNumber, Input, Switch } from "antd"
import uilchilgee from "services/uilchilgee"

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
    setRegister(register)
    setBaiguullaga(null)
    if (register?.toString().length === 7 && baiguullagaEsekh)
      uilchilgee()
        .get(`/tatvaraasBaiguullagaAvya/${register}`)
        .then(({ data }) => setBaiguullaga(data))
  }

  return (
    <div className=" flex flex-row">
      <div className="p-2 w-full">
        <div className="flex flex-row border-b-2 border-dashed py-2">
          <div>Баримт хэвлэх эсэх</div>
          <div className="ml-auto">
            <Switch
              checked={barimtKhevlekhEsekh}
              onChange={setBarimtKhevlekhEsekh}
            />
          </div>
        </div>
        {barimtKhevlekhEsekh && !irgenEsekh && (
          <div className="flex flex-row border-b-2 border-dashed py-2">
            <div>ААН эсэх</div>
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
            <div>Иргэнд эсэх</div>
            <div className="ml-auto">
              <Switch checked={irgenEsekh} onChange={setIrgenEsekh} />
            </div>
          </div>
        )}
        {baiguullagaEsekh && (
          <div className="flex flex-row border-b-2 border-dashed py-2">
            <div>ААН регистр</div>
            <div className="ml-auto">
              <InputNumber
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
            <div>Иргэний регистр</div>
            <div className="ml-auto">
              <Input
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
            <div>ААН нэр</div>
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
                  <td colSpan={6} className="text-center border">
                    {`${baiguullagaEsekh ? "ААН-д" : "Иргэнд"} очих баримт`}
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} className="text-center border">
                    {baiguullaga?.ner}
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} className="font-medium border">
                    Борлуулагч
                  </td>
                </tr>
                <tr>
                  <td className="border" colSpan={3}>
                    Огноо
                  </td>
                  <td className="border" colSpan={3}>
                    {moment(eBarimt?.date).format("YYYY/MM/DD hh:mm:ss")}
                  </td>
                </tr>
                <tr>
                  <td className="border" colSpan={3}>
                    ТТД
                  </td>
                  <td className="border" colSpan={3}>
                    {eBarimt?.registerNo}
                  </td>
                </tr>
                <tr>
                  <td className="border" colSpan={3}>
                    ДДТД
                  </td>
                  <td className="border" colSpan={3}>
                    {eBarimt?.billId}
                  </td>
                </tr>
                <tr>
                  <td className="border" colSpan={3}>
                    Касс
                  </td>
                  <td className="border" colSpan={3}>
                    {eBarimt?.posNo}
                  </td>
                </tr>
                <tr>
                  <td className="border" colSpan={3}>
                    Кассчин
                  </td>
                  <td className="border" colSpan={3}>
                    {ajiltan?.ner}
                  </td>
                </tr>
                {baiguullagaEsekh && (
                  <>
                    <tr>
                      <td className="border" colSpan={6}>
                        Худалдан авагч
                      </td>
                    </tr>
                    <tr>
                      <td className="border" colSpan={1}>
                        ТТД
                      </td>
                      <td className="border" colSpan={5}>
                        {register}
                      </td>
                    </tr>
                    <tr>
                      <td className="border" colSpan={1}>
                        Нэр
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
                    Барааны нэр
                  </td>
                  <td className="border text-center">Тоо</td>
                  <td className="border text-center">Нэгж</td>
                  <td className="border text-center">Дүн</td>
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
                    <td colSpan={5} className="text-right border">
                      Хөнгөлөлт
                    </td>
                    <td className="border text-right">
                      {formatNumber(data.niitUndsenDun - data.niitDun)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={5} className="text-right border">
                    НӨАТ-н дүн
                  </td>
                  <td className="border text-right">
                    {formatNumber(eBarimt?.vat, 2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="text-right border">
                    Төлөх дүн
                  </td>
                  <td className="border text-right">
                    {formatNumber(eBarimt?.amount)}
                  </td>
                </tr>
                {tulbur?.belen && (
                  <tr>
                    <td colSpan={5} className="text-right border">
                      Бэлнээр
                    </td>
                    <td className="border text-right">
                      {formatNumber(tulbur?.belen)}
                    </td>
                  </tr>
                )}
                {tulbur?.belenBus && (
                  <tr>
                    <td colSpan={5} className="text-right border">
                      Бэлэн бусаар
                    </td>
                    <td className="border text-right">
                      {formatNumber(tulbur?.belenBus)}
                    </td>
                  </tr>
                )}
                {tulbur?.khariult && (
                  <tr>
                    <td colSpan={5} className="text-right border">
                      Хариулт
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
                    {formatNumber(eBarimt?.amount)}
                  </td>
                </tr>
                {!baiguullagaEsekh && (
                  <tr>
                    <td colSpan={4} className="border">
                      Сугалааны дугаар
                    </td>
                    <td colSpan={2} className="border">
                      {eBarimt?.lottery}
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={6}>
                    <div className="w-full flex justify-center p-5">
                      <div className="w-40 h-40">
                        <QRCode value={eBarimt?.qrData} size={160} />
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
  )
  return <div></div>
}

export default EBarimt
