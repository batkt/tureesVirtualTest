import { Steps, Button, Spin, message, Switch, Form } from "antd";
import React from "react";
import formatNumber from "tools/function/formatNumber";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import moment from "moment";
import KhuvaajTulukh from "./KhuvaajTulukh";
import EBarimt from "./EBarimt";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useEffect } from "react";
import { t } from "i18next";
//#endregion

function Tulbur(
  { destroy, data, token, ajiltan, baiguullaga, barilgiinId, onRefresh },
  ref
) {
  const [alkham, setAlkham] = React.useState(
    data?.tulburTulsunEsekh === true ? 2 : 1
  );
  const [khaanbank, setTerminal] = React.useState(false);
  const [tulbur, setTulbur] = React.useState((data?.dutuuDun ? [] : data?.tulbur) || []);
  const [eBarimt, setEBarimt] = React.useState(null);
  const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(false);
  const [irgenEsekh, setIrgenEsekh] = React.useState(false);
  const [register, setRegister] = React.useState("");
  const [baiguullagiinMedeelel, setBaiguullaga] = React.useState();
  const [barimtKhevlekhEsekh, setBarimtKhevlekhEsekh] = React.useState(true);
  const [khunglult, setKhunglult] = React.useState({khungulukhDun: undefined , tailbar: undefined, tailbarTurul: undefined})
  const [khungulukhEsekh, setKhungulukhEsekh] = React.useState(false);

  const eBarimtRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    content: () => eBarimtRef.current,
  });

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        onRefresh();
        destroy();
      },
    }),
    []
  );

  function ebarimtAvya(id) {
    if (!!eBarimt) handlePrint();
    else {
      if (baiguullagaEsekh === true && register?.toString().length !== 7) {
        message.warning("Байгууллагын регистр оруулна уу");
        return;
      }
      const body = {
        id,
        ebarimtiinTurul: "togloom"
      };
      if (baiguullagaEsekh || irgenEsekh) {
        body.register = register;
        if (baiguullagaEsekh) body.turul = "3";
        else if (irgenEsekh) body.turul = "1";
      }

      uilchilgee(token)
        .post("/ebarimtShivye", body)
        .then(({ data }) => {
          if (data.success === true) {
            setEBarimt(data);
            handlePrint();
            onRefresh();
          }
        })
        .catch(aldaaBarigch);
    }
  }

  function batalgaajuulya(turul, val) {    
    if (turul === "khaan") {
      tulbur.find((a) => a.turul === "khaan").khariu = val;
      guilgeeniiTuukhKhadgalya(tulbur, () => {setAlkham(2); onRefresh()});
      setTulbur(tulbur);
    } else if ((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) === tulbur.reduce((a, b) => a + b.dun, 0))
      setAlkham(2);
  }

  function batalgaajuuljDuusgakh() {
    setTerminal(false);
    tulbur.find((a) => a.turul === "khaan").isPayed = true;
    setTulbur([...tulbur]);
    if ((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) === tulbur.reduce((a, b) => a + b.dun, 0)) {
      guilgeeniiTuukhKhadgalya(tulbur, () => {setAlkham(2); onRefresh()});
      setAlkham(2);
    }
  }

  function guilgeeniiTuukhKhadgalya(tulbur, callback) {
    if (khungulukhEsekh === true) {
      if (!khunglult.khungulukhDun || khunglult.khungulukhDun === "") {
        message.warn("Хөнгөлөх дүн оруулна уу")
        return
      }
      if (!khunglult.tailbar || khunglult.tailbar === "") {
        message.warn("Хөнгөлөх шалтгаан оруулна уу")
        return
      }
      
    }
    var index = tulbur.findIndex(a=> a.turul === "khunglukh")
    if (index > -1) {
      tulbur[index].tailbar = khunglult.tailbar
    }
    
    tulbur.forEach((a) => {
      a.ognoo = new Date();
        (a.baiguullagiinId = baiguullaga?._id),
        (a.barilgiinId = barilgiinId),
        (a.burtgesenAjiltan = ajiltan._id),
        (a.burtgesenAjiltaniiNer = ajiltan.ner),
        (a.togloominId = data._id)
    });
    uilchilgee(token)
      .post("/togloomiinTulburTulye", { tulbur, id:data._id })
      .then(callback)
      .catch(aldaaBarigch);
  }

  function batalgaajuulaltKhiiya() {
    const dun = tulbur.find((a) => a.turul === "khaan")?.dun;
    if (dun > 0) {
      axios
        .post(
          "http://127.0.0.1:27028",
          {
            service_name: "doSaleTransaction",
            service_params: {
              db_ref_no: moment().format("YYYYMMDDhhmmss00"),
              amount: String(dun),
              vatps_bill_type: "1",
            },
          },
          { timeout: 4000000 }
        )
        .then(({ data }) => {
          if (data.status === true && data?.response?.response_code === "000") {
            batalgaajuulya("khaan", data?.response);
          } else if (
            data.status === true &&
            data?.response?.response_code === "366"
          ) {
            tulbur.find((a) => a.turul === "khaan").msg =
              data?.response?.response_msg;
            setTulbur(tulbur);
            message.warning(data?.response?.response_msg);
          }
          setSongogdsonBank(null);
        })
        .catch(aldaaBarigch);
      setTerminal(true);
    } else if (
      (data?.dutuuDun ? data?.dutuuDun : data?.niitDun) ===
      tulbur.reduce((a, b) => {
        if (b.turul === "khariult") return a - b.dun;
        return a + b.dun;
      }, 0)
    )
      guilgeeniiTuukhKhadgalya(tulbur, () => {setAlkham(2); onRefresh()});
  }

  function khaaya() {
    destroy();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="pb-2">
        <Steps className="hidden" current={alkham}>
          <Steps.Step
            key="Төлбөр төлөх"
            subTitle={<span className="dark:text-gray-200">Төлбөр төлөх</span>}
            onClick={() => setAlkham(1)}
          />
          <Steps.Step
            key="Төлбөрын баримт"
            subTitle={
              <span className="dark:text-gray-200">Төлбөрын баримт</span>
            }
            onClick={() => setAlkham(2)}
          />
        </Steps>
      </div>
      <div className={`${alkham === 1 ? "" : "hidden"}`}>
        <div className="w-full table text-lg font-medium">
          <div className="table-row">
            <div className="table-cell p-2 border-dashed border-b-2 dark:text-gray-200">
              Төлөх дүн
            </div>
            <div className="table-cell p-2 text-right border-dashed border-b-2 dark:text-gray-200">
              {formatNumber(
                (data?.dutuuDun ? data?.dutuuDun : data?.niitDun) -
                tulbur
                  .filter((a) => a.turul !== "khariult")
                  .reduce((a, b) => a + b.dun, 0) || 0
              )}{" "}
              ₮
            </div>
          </div>
        </div>
        <KhuvaajTulukh
          tulbur={tulbur}
          data={data}
          khunglult={khunglult}
          setKhunglult={setKhunglult}
          setTulbur={setTulbur}
          batalgaajuulya={batalgaajuulya}
          ajiltan={ajiltan}
          khungulukhEsekh={khungulukhEsekh}
          setKhungulukhEsekh={setKhungulukhEsekh}
        />
        {khaanbank && tulbur.find((a) => a.turul === "khaan") && (
          <div className="col-span-3 flex flex-col items-center space-y-2 relative mt-5">
            <img
              src={"https://www.khanbank.com/assets/logos/khanbank-mn.png"}
              className="w-1/2"
            />
            <div id="loading">
              <Spin
                style={{ fontSize: "1.5rem" }}
                size="large"
                tip="Карт аа уншуулна уу!!"
              />
            </div>
            <div className="flex flex-row space-x-5">
              <Button
                danger
                onClick={() => setTerminal(false)}
                icon={<CloseOutlined />}
              >
                Цуцлах
              </Button>
              <Button
                type="primary"
                onClick={batalgaajuuljDuusgakh}
                icon={<CheckOutlined />}
              >
                Баталгаажуулах
              </Button>
            </div>
          </div>
        )}
        <div className="w-full table text-lg font-medium mt-5">
          {tulbur.length > 0 && (
            <div className="table-row">
              <div className="table-cell p-2 border-dashed border-t-2 dark:text-gray-200">
                Төлсөн дүн
              </div>
              <div className="table-cell p-2 text-right border-dashed border-t-2 dark:text-gray-200">
                {formatNumber(
                  tulbur
                    .filter((a) => a.turul !== "khariult")
                    .reduce((a, b) => a + b.dun, 0)
                )}{" "}
                ₮
              </div>
            </div>
          )}
          {!!(tulbur.find((a) => a.turul === "khariult")?.dun || 0) > 0 && (
            <div className="table-row">
              <div className="table-cell p-2 border-dashed border-b-2 dark:text-gray-200">
                {t("Хариулт")}
              </div>
              <div className="table-cell p-2 text-right border-dashed border-b-2 dark:text-gray-200">
                {formatNumber(tulbur.find((a) => a.turul === "khariult").dun)}₮
              </div>
            </div>
          )}
        </div>
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
      <div className="flex flex-row justify-between mt-5">
        <Button type="primary" danger onClick={khaaya}>
          Хаах
        </Button>
        {alkham === 1 && (
          <Button type="primary" onClick={batalgaajuulaltKhiiya}>
            Төлбөр төлөх
          </Button>
        )}

        {alkham === 2 && barimtKhevlekhEsekh === true && (
          <Button type="primary" onClick={() => ebarimtAvya(data?._id)}>
            Хэвлэх
          </Button>
        )}
      </div>
    </div>
  );
}

export default React.forwardRef(Tulbur);
