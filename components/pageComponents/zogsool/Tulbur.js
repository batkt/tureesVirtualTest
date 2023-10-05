import {
  Steps,
  Button,
  Spin,
  message,
  Switch,
  Form,
  Modal,
  notification,
} from "antd";
import React from "react";
import formatNumber from "tools/function/formatNumber";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import moment from "moment";
import KhuvaajTulukh from "./KhuvaajTulukh";
import EBarimt from "../togloomiinTuv/EBarimt";
import QRCode from "react-qr-code";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import uilchilgee, { aldaaBarigch, socket } from "services/uilchilgee";
import { useEffect } from "react";
import { t } from "i18next";
import { useQRCode } from "next-qrcode";
import updateMethod from "../../../tools/function/crud/updateMethod";
//#endregion
const { confirm } = Modal;
function Tulbur(
  {
    destroy,
    data,
    token,
    ajiltan,
    baiguullaga,
    barilgiinId,
    uilchluugchiinId,
    onRefresh,
    setModalNeelttei,
    camerVal,
    niitDun,
    suuliikhEsekh,
  },
  ref
) {
  // console.log('----data-----', data);
  const { Canvas } = useQRCode();
  const [alkham, setAlkham] = React.useState(
    !!data?.tuluv && data?.tuluv === 1 ? 2 : 1
  );
  const [khaanbank, setTerminal] = React.useState(false);
  const [tulbur, setTulbur] = React.useState(
    (niitDun ? [] : data?.tulbur) || []
  );
  const [eBarimt, setEBarimt] = React.useState(null);
  const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(false);
  const [irgenEsekh, setIrgenEsekh] = React.useState(false);
  const [register, setRegister] = React.useState("");
  const [baiguullagiinMedeelel, setBaiguullaga] = React.useState();
  const [barimtKhevlekhEsekh, setBarimtKhevlekhEsekh] = React.useState(true);
  const [khunglult, setKhunglult] = React.useState({
    khungulukhDun: undefined,
    tailbar: undefined,
    tailbarTurul: undefined,
  });
  const [khungulukhEsekh, setKhungulukhEsekh] = React.useState(false);
  const [qpayerTulukh, setQpayerTulukh] = React.useState(false);
  const [songogdTulburiinKhelber, setSongogdsonTulburiinKhelber] =
    React.useState();
  const [songogdsonBank, setSongogdsonBank] = React.useState();
  const [songogdsonBusadTurul, setSongogdsonBusadTurul] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [tuluv, setTuluv] = React.useState(2);
  const [khuleegdejBuiQpay, setKhuleegdejBuiQpay] = React.useState();

  const eBarimtRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    content: () => eBarimtRef.current,
  });

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        setModalNeelttei(false);
        destroy();
      },
    }),
    [tulbur]
  );

  function ebarimtAvya(id) {
    setLoading(true);
    if (!!eBarimt) handlePrint();
    else {
      if (baiguullagaEsekh === true && register?.toString().length !== 7) {
        message.warning(t("Байгууллагын регистр оруулна уу"));
        setLoading(false);
        return;
      }
      const body = {
        id,
        ebarimtiinTurul: "zogsool",
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
            setLoading(false);
            onRefresh();
            destroy();
          }
        })
        .catch(aldaaBarigch);
    }
  }

  useEffect(() => {
    if (!!eBarimt) {
      handlePrint();
    }
  }, [eBarimt]);

  useEffect(() => {
    if (loading === true) {
      setTimeout(() => {
        setLoading(false);
      }, 8000);
    }
  }, [loading]);

  function batalgaajuulya(turul, val) {
    if (turul === "khaan") {
      tulbur.find((a) => a.turul === "khaan").khariu = val;
      guilgeeniiTuukhKhadgalya(tulbur, () => {
        setAlkham(2);
        onRefresh();
      });
      setTulbur(tulbur);
    } else if (
      (niitDun ? niitDun : data?.tulukhDun) ===
      tulbur.reduce((a, b) => a + b.dun, 0)
    )
      setAlkham(2);
    else {
      setTuluv(tuluv === 1 ? 2 : tuluv === 2 ? 3 : 1);
      setLoading(false);
    }
  }

  function batalgaajuuljDuusgakh() {
    setTerminal(false);
    tulbur.find((a) => a.turul === "khaan").isPayed = true;
    setTulbur([...tulbur]);
    if (
      (niitDun ? niitDun : data?.tulukhDun) ===
      tulbur.reduce((a, b) => a + b.dun, 0)
    ) {
      guilgeeniiTuukhKhadgalya(tulbur, () => {
        setAlkham(2);
        onRefresh();
      });
      setAlkham(2);
    } else {
      setTuluv(tuluv === 1 ? 2 : tuluv === 2 ? 3 : 1);
      setLoading(false);
    }
  }

  function guilgeeniiTuukhKhadgalya(tulbur, qpayEsekh) {
    if (khungulukhEsekh === true) {
      if (!khunglult.khungulukhDun || khunglult.khungulukhDun === "") {
        message.warn(t("Хөнгөлөх дүн оруулна уу"));
        return;
      }
      if (!khunglult.tailbar || khunglult.tailbar === "") {
        message.warn(t("Хөнгөлөх шалтгаан оруулна уу"));
        return;
      }
    }
    var index = tulbur.findIndex((a) => a.turul === "khunglukh");
    if (index > -1) {
      tulbur[index].tailbar = khunglult.tailbar;
    }
    tulbur.forEach((a) => {
      a.ognoo = new Date();
      a.baiguullagiinId = baiguullaga?._id;
      a.barilgiinId = barilgiinId;
      a.burtgesenAjiltaniiId = ajiltan._id;
      a.burtgesenAjiltaniiNer = ajiltan.ner;
      a.zogsooliinId = data?.zogsooliinId;
    });
    const tulukhGejBuiNiitDun = tulbur.reduce((a, b) => a + b?.dun, 0);

    if (tulukhGejBuiNiitDun !== niitDun) {
      setLoading(false);
      return notification.warn({ message: "Төлбөр дутуу байна!", duration: 1 });
    }
    // console.log('3434', tulbur)
    uilchilgee(token)
      .post("/zogsooliinTulburTulye", { tulbur, id: uilchluugchiinId })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setAlkham(2);
          onRefresh();
          suuliikhEsekh === true &&
            axios
              .get("http://localhost:5000/api/neeye/" + camerVal + "")
              .then(function (response) {
                if (!!response) console.log("/api/neeye", response);
              })
              .catch(function (error) {
                console.log("ERROR: /api/neeye", error);
              });
          setLoading(false);
        } else {
          setTuluv(tuluv === 1 ? 2 : tuluv === 2 ? 3 : 1);
          message.success("Төлбөр амжилттай хадгалагдлаа");
          setLoading(false);
        }
        if (!!qpayEsekh && qpayEsekh === true) {
          setSongogdsonTulburiinKhelber();
          setQpayerTulukh("Tulugdsun");
        }
      })
      .catch(aldaaBarigch);
  }

  useEffect(() => {
    if (khuleegdejBuiQpay) {
      socket().on(`qpay/${baiguullaga._id}/${khuleegdejBuiQpay}`, (qpay) => {
        batalgaajuulaltKhiiya("qpayTulugdsun");
        message.success("Qpay Амжилттай төлөгдлөө");
      });
    }
    return () => {
      socket().off(`qpay${khuleegdejBuiQpay}`);
    };
  }, [khuleegdejBuiQpay, baiguullaga]);

  function qpayAvakh() {
    var ilgeekhDun = tulbur.find((a) => a.turul === "qpay")?.dun;
    if (!ilgeekhDun || ilgeekhDun <= 0) {
      message.warning("Төлөх дүн оруулна уу");
      setLoading(false);
      return;
    }
    setKhuleegdejBuiQpay(`${uilchluugchiinId}${ilgeekhDun}`);
    uilchilgee(token)
      .post("/qpayGargaya", {
        barilgiinId: barilgiinId,
        dun: ilgeekhDun,
        zakhialgiinDugaar: `${uilchluugchiinId}${ilgeekhDun}`,
      })
      .then(({ data }) => {
        setQpayerTulukh(data);
        setLoading(false);
      })
      .catch((e) => {
        aldaaBarigch(e);
        setLoading(false);
      });
  }

  function batalgaajuulaltKhiiya(qpayTulugdsun) {
    setLoading(true);
    const dun = tulbur.find((a) => a.turul === "khaan")?.dun;
    if (tuluv === 2 && songogdsonBank?.talbar === "khaan" && dun > 0) {
      setTerminal(true);
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
            data?.status == true &&
            data?.response?.response_code !== "000"
          ) {
            message.success(data?.response?.response_msg);
          } else if (
            data.status === true &&
            data?.response?.response_code === "366"
          ) {
            tulbur.find((a) => a.turul === "khaan").msg =
              data?.response?.response_msg;
            setTulbur(tulbur);
            message.warning(data?.response?.response_msg);
            setLoading(false);
          }
          setSongogdsonBank(null);
          setTerminal(false);
        })
        .catch((e) => {
          // tulbur.find((a) => a.turul === "khaan") ? null : aldaaBarigch(e);
          setTerminal(false);
          setLoading(false);
          guilgeeniiTuukhKhadgalya(tulbur);
        });
    } else if (tuluv === 3 && songogdTulburiinKhelber?.ner === "qpay") {
      qpayTulugdsun === "qpayTulugdsun"
        ? guilgeeniiTuukhKhadgalya(tulbur, true)
        : qpayAvakh();
    } else {
      guilgeeniiTuukhKhadgalya(tulbur);
      if (tuluv === 1) {
        setSongogdsonBusadTurul();
      }
      if (tuluv === 2) {
        setSongogdsonBank();
      }
    }
  }
  const minToHour = (m) => {
    let res;
    if (m < 60) res = m + " мин";
    else {
      const h = Math.floor(m / 60);
      const min = m % 60;
      res = h + " цаг " + (min && min + " мин");
    }
    return res;
  };
  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        ref.current.khaaya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <div className="h-full w-full">
      {eBarimt && (
        <div className="hidden">
          <div
            className="flex w-full min-w-[58mm] flex-col p-2 pr-4 text-sm font-semibold text-black"
            ref={eBarimtRef}
          >
            <div className="text-center">Авто зогсоолын үйлчилгээ</div>
            <div className="text-center">{baiguullaga?.ner}</div>
            {/* <div>Борлуулагч:</div> */}
            <div className="flex justify-between">
              <p>Огноо:</p>
              <p>{moment(Date.now()).format("YYYY/MM/DD hh:mm:ss")}</p>
            </div>
            <div className="flex justify-between">
              <p>ТТД:</p>
              <p>{eBarimt?.registerNo}</p>
            </div>
            <div className="flex justify-between">
              <p>Кассчин:</p>
              <p>{ajiltan?.ner}</p>
            </div>
            <div>
              <p>ДДТД:</p>
            </div>
            <div className="-mt-1 w-[80mm]">
              <div>{eBarimt?.billId}</div>
            </div>
            {baiguullagaEsekh && (
              <>
                <div>
                  <p>Худалдан авагч</p>
                </div>
                <div className="flex justify-between">
                  <p>ТТД:</p>
                  <p>{register}</p>
                </div>
                <div className="flex justify-between">
                  <p>Нэр:</p>
                  <p>{baiguullagiinMedeelel?.name}</p>
                </div>
              </>
            )}
            <div>
              <p></p>
            </div>
            {/* {eBarimt?.stocks?.map((mur, index) => (
              <div
                className={`flex flex-col items-stretch justify-between border-b-2 border-dashed py-1 ${
                  index === 0 && "border-t-2"
                }`}
                key={`${index}-zakhialga`}
              >
                <div className="">{mur.name}:</div>
                <div className="-mt-1 text-right">
                  {formatNumber(mur.totalAmount, 2)}₮
                </div>
              </div>
            ))} */}
            <div>
              <p>
                <br />
              </p>
            </div>
            <div className="grid grid-cols-2 text-sm">
              <div className="flex justify-between">
                <p className="w-1/2 text-right">НӨАТ-гүй:</p>
                <p className="text-right">
                  {formatNumber(data.tulukhDun / 1.1, 2)}₮
                </p>
              </div>
              <div className="flex justify-between">
                <p className="w-1/2 text-right">НӨАТ:</p>
                <p className="text-right">{formatNumber(eBarimt?.vat, 2)}₮</p>
              </div>
              <div className="flex justify-between">
                <p className="w-1/2 text-right">Төлөх дүн:</p>
                <p className="text-right">{formatNumber(eBarimt?.amount)}₮</p>
              </div>
              {tulbur?.belen && (
                <div className="flex justify-between">
                  <p className="w-1/2 text-right">Бэлнээр:</p>
                  <p className="text-right">{formatNumber(tulbur?.belen)}₮</p>
                </div>
              )}
              {tulbur?.belenBus && (
                <div className="flex justify-between">
                  <p className="w-1/2 text-right">Бэлэн бусаар:</p>
                  <p className="text-right">
                    {formatNumber(tulbur?.belenBus)}₮
                  </p>
                </div>
              )}
              {tulbur?.khariult && (
                <div className="flex justify-between">
                  <p className="w-1/2 text-right">Хариулт:</p>
                  <p className="text-right">
                    {formatNumber(tulbur?.khariult)}₮
                  </p>
                </div>
              )}
            </div>
            {!baiguullagaEsekh && (
              <div className="flex items-end justify-between pt-2">
                <p className="w-1/2 text-right">Сугалааны дугаар:</p>
                <p className=" text-end">{eBarimt?.lottery}</p>
              </div>
            )}
            <div>
              <p>
                <div className="flex w-full justify-center p-5 pt-3">
                  <div>
                    <QRCode level="L" value={eBarimt?.qrData} size={100} />
                  </div>
                </div>
              </p>
            </div>
            <div className={`flex justify-between border-y-2 border-dashed`}>
              <p className="">Орсон цаг:</p>
              <p className="text-right">
                {data?.tsagiinTuukh[0]?.orsonTsag &&
                  moment(data?.tsagiinTuukh[0]?.orsonTsag).format(
                    "YYYY-MM-DD HH:mm"
                  )}
              </p>
            </div>
            <div className={`flex justify-between border-b-2 border-dashed`}>
              <p className="">Гарсан цаг:</p>
              <p className="text-right">
                {data?.tsagiinTuukh[0]?.garsanTsag &&
                  moment(data?.tsagiinTuukh[0]?.garsanTsag).format(
                    "YYYY-MM-DD HH:mm"
                  )}
              </p>
            </div>
            <div className={`flex justify-between border-b-2 border-dashed`}>
              <p className="">Нийт Хугацаа:</p>
              <p className="text-right">
                {minToHour(data?.niitKhugatsaa || 0)}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="pb-2">
        <Steps className="hidden" current={alkham}>
          <Steps.Step
            key="Төлбөр төлөх"
            subTitle={
              <span className="dark:text-gray-200">{t("Төлбөр төлөх")}</span>
            }
            onClick={() => setAlkham(1)}
          />
          <Steps.Step
            key="Төлбөрын баримт"
            subTitle={
              <span className="dark:text-gray-200">{t("Төлбөрын баримт")}</span>
            }
            onClick={() => setAlkham(2)}
          />
        </Steps>
      </div>
      <div className={`${alkham === 1 ? "" : "hidden"}`}>
        <div className="table w-full text-lg font-medium">
          <div className="table-row">
            <div className="table-cell border-b-2 border-dashed p-2 dark:text-gray-200">
              {t("Төлөх дүн")}
            </div>
            <div className="table-cell border-b-2 border-dashed p-2 text-right dark:text-gray-200">
              {formatNumber(
                (niitDun ? niitDun : data?.tulukhDun) -
                  tulbur.reduce((a, b) => a + b.dun, 0) || 0
              )}{" "}
              ₮
            </div>
          </div>
        </div>
        <KhuvaajTulukh
          khuleegdejBuiQpay={khuleegdejBuiQpay}
          setKhuleegdejBuiQpay={setKhuleegdejBuiQpay}
          token={token}
          tulbur={tulbur}
          niitDun={niitDun}
          data={data}
          batalgaajuulaltKhiiya={batalgaajuulaltKhiiya}
          songogdsonBusadTurul={songogdsonBusadTurul}
          setSongogdsonBusadTurul={setSongogdsonBusadTurul}
          songogdsonBank={songogdsonBank}
          setSongogdsonBank={setSongogdsonBank}
          songogdTulburiinKhelber={songogdTulburiinKhelber}
          setSongogdsonTulburiinKhelber={setSongogdsonTulburiinKhelber}
          qpayerTulukh={qpayerTulukh}
          setQpayerTulukh={setQpayerTulukh}
          tuluv={tuluv}
          setTuluv={setTuluv}
          khunglult={khunglult}
          setKhunglult={setKhunglult}
          setTulbur={setTulbur}
          batalgaajuulya={batalgaajuulya}
          ajiltan={ajiltan}
          khungulukhEsekh={khungulukhEsekh}
          setKhungulukhEsekh={setKhungulukhEsekh}
          setLoading={setLoading}
          setTerminal={setTerminal}
          khaanbank={khaanbank}
          guilgeeniiTuukhKhadgalya={guilgeeniiTuukhKhadgalya}
        />
        {!!qpayerTulukh && qpayerTulukh !== "Tulugdsun" && (
          <div className="col-span-3 flex w-full items-center justify-center">
            <img src={qpayerTulukh?.qr_image} />
          </div>
        )}
        {khaanbank && tulbur.find((a) => a.turul === "khaan") && (
          <div className="relative col-span-3 mt-5 flex flex-col items-center space-y-2">
            <img
              src={"https://www.khanbank.com/assets/logos/khanbank-mn.png"}
              className="w-1/2"
            />
            <div id="loading">
              <Spin
                style={{ fontSize: "1.5rem" }}
                size="large"
                tip={t("Карт аа уншуулна уу!!")}
              />
            </div>
            <div className="flex flex-row space-x-5">
              <Button
                danger
                onClick={() => setTerminal(false)}
                icon={<CloseOutlined />}
              >
                {t("Цуцлах")}
              </Button>
              {/* <Button
                type='primary'
                onClick={batalgaajuuljDuusgakh}
                icon={<CheckOutlined />}>
                {t("Баталгаажуулах")}
              </Button> */}
            </div>
          </div>
        )}
        <div className="mt-5 table w-full text-lg font-medium">
          {tulbur.length > 0 && (
            <div className="table-row">
              <div className="table-cell border-t-2 border-dashed p-2 dark:text-gray-200">
                {t("Төлсөн дүн")}
              </div>
              <div className="table-cell border-t-2 border-dashed p-2 text-right dark:text-gray-200">
                {formatNumber(tulbur.reduce((a, b) => a + b.dun, 0))} ₮
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
      <div className="mt-5 flex flex-row justify-between">
        <Button type="primary" danger onClick={() => ref.current.khaaya()}>
          {t("Хаах")}
        </Button>
        {alkham === 1 && !qpayerTulukh && (
          <Button
            type="primary"
            loading={loading}
            id="TogloomiinTuvTulburTovch"
            onClick={batalgaajuulaltKhiiya}
          >
            {t("Төлбөр төлөх")}
          </Button>
        )}

        {alkham === 2 && barimtKhevlekhEsekh === true && (
          <Button
            type="primary"
            loading={loading}
            onClick={() => ebarimtAvya(uilchluugchiinId)}
          >
            {t("Хэвлэх")}
          </Button>
        )}
      </div>
    </div>
  );
}

export default React.forwardRef(Tulbur);
