import { Steps, Button, Spin, message } from "antd"
import React from "react"
import formatNumber from "tools/function/formatNumber"
import { useReactToPrint } from "react-to-print"
import axios from "axios"
import moment from "moment"

import EBarimt from "./EBarimt"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import uilchilgee, { aldaaBarigch } from "services/uilchilgee"
import QRCode from "react-qr-code"
//#endregion

function Tulbur(
  { destroy, zakhialgaMutate, data, token, ajiltan, baiguullaga },
  ref
) {
  const [alkham, setAlkham] = React.useState(
    data?.tulburTulsunEsekh === true ? 2 : 1
  )
  const [khaanbank, setTerminal] = React.useState(false)
  const [tulbur, setTulbur] = React.useState(data?.tulbur || [])
  const [eBarimt, setEBarimt] = React.useState(null)

  const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(false)
  const [irgenEsekh, setIrgenEsekh] = React.useState(false)
  const [register, setRegister] = React.useState("")
  const [baiguullagiinMedeelel, setBaiguullaga] = React.useState()
  const [barimtKhevlekhEsekh, setBarimtKhevlekhEsekh] = React.useState(false)

  const eBarimtRef = React.useRef(null)

  const handlePrint = useReactToPrint({
    content: () => eBarimtRef.current,
  })

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        zakhialgaMutate()
        destroy()
      },
    }),
    []
  )

  function ebarimtAvya(id) {
    debugger
    if (!!eBarimt) handlePrint()
    else {
      if (baiguullagaEsekh === true && register?.toString().length !== 7) {
        message.warning("Байгууллагын регистр оруулна уу")
        return
      }
      const body = {
        zakhialgiinDugaar: id,
      }
      if (baiguullagaEsekh || irgenEsekh) {
        body.register = register
        if (baiguullagaEsekh) body.turul = "3"
        else if (irgenEsekh) body.turul = "1"
      }

      uilchilgee(token)
        .post("/ebarimtShivye", body)
        .then(({ data }) => {
          if (data.success === true) {
            setEBarimt(data)
            handlePrint()
            zakhialgaMutate()
          }
        })
        .catch(aldaaBarigch)
    }
  }

  function khaaya() {
    destroy()
  }

  return (
    <div className="w-full h-full">
      <div className="w-full table text-lg font-medium mt-5">
        {tulbur.length > 0 && (
          <div className="table-row">
            <div className="table-cell p-2 border-dashed border-t-2">
              Төлсөн дүн
            </div>
            <div className="table-cell p-2 text-right border-dashed border-t-2">
              {formatNumber(data.tulsunDun)} ₮
            </div>
          </div>
        )}
      </div>

      <EBarimt
        eBarimtRef={eBarimtRef}
        eBarimt={eBarimt}
        alkham={alkham}
        data={data}
        tulbur={tulbur}
        handlePrint={handlePrint}
        baiguullaga={baiguullaga}
        ajiltan={ajiltan}
        baiguullagaEsekh={baiguullagaEsekh}
        setBaiguullagaEsekh={setBaiguullagaEsekh}
        register={register}
        setRegister={setRegister}
        baiguullagiinMedeelel={baiguullagiinMedeelel}
        setBaiguullaga={setBaiguullaga}
        irgenEsekh={irgenEsekh}
        setIrgenEsekh={setIrgenEsekh}
        barimtKhevlekhEsekh={barimtKhevlekhEsekh}
        setBarimtKhevlekhEsekh={setBarimtKhevlekhEsekh}
      />
      <div>
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
                {"5682458"}
              </td>
            </tr>
            <tr>
              <td className="border" colSpan={3}>
                ДДТД
              </td>
              <td className="border" colSpan={3}>
                {"18956248421214823848"}
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

              <td className="border text-center">Дүн</td>
            </tr>
            <td colSpan={3} className="border text-center">
              {"Түрээсийн төлбөр"}
            </td>
            <td className="border text-center">{"1"}</td>
            <td className="border text-center">
              {formatNumber(data.tulsunDun)}
            </td>

            <tr>
              <td colSpan={5} className="text-right border">
                НӨАТ-гүй дүн
              </td>
              <td className="border text-right">
                {formatNumber(data.tulsunDun / 1.1, 2)}
              </td>
            </tr>

            <tr>
              <td colSpan={5} className="text-right border">
                НӨАТ-н дүн
              </td>
              <td className="border text-right">
                {formatNumber(data.tulsunDun, 2)}
              </td>
            </tr>
            <tr>
              <td colSpan={5} className="text-right border">
                Төлөх дүн
              </td>
              <td className="border text-right">
                {formatNumber(data.tulsunDun)}
              </td>
            </tr>

            <tr>
              <td colSpan={6}>
                <div className="w-full flex justify-center p-5">
                  <div className="w-40 h-40">
                    <div className="font-bold flex justify-center">
                      {" "}
                      {"DEMO45785621"}
                    </div>
                    <QRCode value={"151515151515"} size={160} />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-between mt-5">
        <Button type="primary" danger onClick={khaaya}>
          Хаах
        </Button>

        {barimtKhevlekhEsekh === true && (
          <Button type="primary" onClick={() => ebarimtAvya(data?._id)}>
            Хэвлэх
          </Button>
        )}
      </div>
    </div>
  )
}

export default React.forwardRef(Tulbur)
