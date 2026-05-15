import { Button, Spin, message, Modal } from "antd";
import React, { useState } from "react";
import { useReactToPrint } from "react-to-print";

import EBarimt from "./EBarimt";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { t } from "i18next";

function Tulbur(
  {
    destroy,
    dansniiKhuulgaMutate,
    data,
    token,
    ajiltan,
    baiguullaga,
    onRefresh,
    defaultRegister,
    eBarimtAutomataarShivikh,
    defaultTurul,
  },
  ref
) {
  const [tulbur, setTulbur] = React.useState(data?.tulbur || []);
  const [eBarimt, setEBarimt] = React.useState(null);
  const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(
    defaultTurul === "ААН" || (defaultRegister && defaultRegister.toString().length === 7) ? true : false
  );

  const [irgenEsekh, setIrgenEsekh] = React.useState(
    defaultTurul === "Иргэн" || (defaultRegister && defaultRegister.toString().length === 10) ? true : false
  );
  const [register, setRegister] = React.useState(defaultRegister || "");
  const [customerTin, setCustomerTin] = React.useState();
  const [baiguullagiinMedeelel, setBaiguullaga] = React.useState();
  const [barimtKhevlekhEsekh, setBarimtKhevlekhEsekh] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = React.useState(false);
  const eBarimtRef = React.useRef(null);
  const pageStyle = `
  @page {
    size: A4;
    margin: 0;
}

@media print {
    body, html {
        width: 80mm !important;
        height: 60mm !important;
        margin: 0;
    }
    .print-preview {
        width: 100mm;
        height: 80mm;
        margin: 0;
        
    }
}
`;

  const handlePrint = useReactToPrint({
    pageStyle,
    contentRef: eBarimtRef,
    onAfterPrint: () => khaaya(),
  });

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        eBarimtMutate();
        dansniiKhuulgaMutate();
        destroy();
      },
    }),
    []
  );

  function ebarimtAvya(id) {
    if (!!eBarimt) handlePrint();
    else {
      if (
        (baiguullagaEsekh === true && register?.toString().length !== 7) ||
        (irgenEsekh === true && register?.toString().length !== 10)
      ) {
        toast.warning(t("Байгууллагын регистр оруулна уу"));
        return;
      }
      const sendRequest = () => {
        setLoading(true);
        const body = {
          id: id,
          barilgiinId: data.barilgiinId,
        };

        if (baiguullagaEsekh === true) {
          body.turul = "3";
          body.register = register;
          body.customerTin = customerTin;
        } else if (irgenEsekh === true) {
          body.turul = "1";
          body.register = register;
        }

        uilchilgee(token)
          .post("/ebarimtShivye", body)
          .then(({ data }) => {
            if (data.success === true || data.status == "SUCCESS") {
              setEBarimt(data);
              handlePrint();
            }
          })
          .catch(aldaaBarigch)
          .finally(() => setLoading(false));
      };
      if (!baiguullagiinMedeelel?.name) {
        Modal.confirm({
          title: t("Иргэнээр гаргахдаа итгэлтэй байна уу?"),
          onOk: () => sendRequest(),
        });
      } else {
        sendRequest();
      }
    }
  }

  function khaaya() {
    onRefresh();
    destroy();
  }

  return (
    <div>
      <EBarimt
        eBarimtRef={eBarimtRef}
        eBarimt={eBarimt}
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
        eBarimtAutomataarShivikh={eBarimtAutomataarShivikh}
        setCustomerTin={setCustomerTin}
        searching={searching}
        setSearching={setSearching}
        isFromKhuulga={true}
      />
      <div className="mt-5 flex flex-row justify-between">
        <Button type="primary" danger onClick={khaaya}>
          {t("Хаах")}
        </Button>
        {(barimtKhevlekhEsekh === true ||
          baiguullagaEsekh === true ||
          irgenEsekh === true) && (
          <Spin spinning={loading}>
            <Button
              type="primary"
              disabled={searching}
              onClick={() => ebarimtAvya(data?._id)}
            >
              {t("Хэвлэх")}
            </Button>
          </Spin>
        )}
      </div>
    </div>
  );
}

export default React.forwardRef(Tulbur);
