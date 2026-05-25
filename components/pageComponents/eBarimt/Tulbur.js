import { Button, Spin, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
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
  ref,
) {
  const [tulbur, setTulbur] = React.useState(data?.tulbur || []);
  const [eBarimt, setEBarimt] = React.useState(null);
  const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(
   
    defaultRegister && defaultRegister.toString().length === 10
      ? false
      : defaultTurul === "ААН" ||
          (defaultRegister && defaultRegister.toString().length === 7)
        ? true
        : false,
  );

  const [irgenEsekh, setIrgenEsekh] = React.useState(
  
    defaultRegister && defaultRegister.toString().length === 7
      ? false
      : defaultTurul === "Иргэн" ||
          (defaultRegister && defaultRegister.toString().length === 10)
        ? true
        : false,
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
    [],
  );

  useEffect(() => {
    if (eBarimt) {
      if (!!customerTin) khaaya();
      else handlePrint();
    }
  }, [eBarimt, customerTin]);

  const sendRequest = (id) => {
    setLoading(true);
    const body = {
      id: id,
      barilgiinId: data.barilgiinId,
    };
    if (baiguullagaEsekh === true && baiguullagiinMedeelel?.name && customerTin) {
      body.turul = "3";
      body.register = register;
      body.customerTin = customerTin;
      body.customerName = baiguullagiinMedeelel?.name;
    } else {
      body.turul = "1";
      body.register = register;
    }

    uilchilgee(token)
      .post("/ebarimtShivye", body)
      .then(({ data }) => {
        if ((data.success === true || data.status == "SUCCESS") && data.id) {
          setEBarimt(data);
          setCustomerTin(null);
          setBaiguullaga(null);
        }
      })
      .catch(aldaaBarigch)
      .finally(() => setLoading(false));
  };

  function ebarimtAvya(id) {
    if (!!eBarimt) handlePrint();
    else {
      if (
        (baiguullagaEsekh === true && register?.toString().length !== 7) ||
        (irgenEsekh === true && register?.toString().length !== 10)
      ) {
        message.toast(t("Байгууллагын регистр оруулна уу"));
        return;
      }
      if ((baiguullagaEsekh || irgenEsekh) && !baiguullagiinMedeelel?.name) {
        message.toast(t("Регистр буруу байна"));
        return;
      }
      if (!baiguullagiinMedeelel?.name) {
        Modal.confirm({
          title: t("Иргэнээр гаргахдаа итгэлтэй байна уу?"),
          onOk: () => sendRequest(id),
        });
      } else {
        sendRequest(id);
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
