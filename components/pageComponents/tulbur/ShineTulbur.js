import {
  Steps,
  Button,
  message,
  Modal,
  notification,
  Image,
  Popover,
} from "antd";
import React, { useMemo } from "react";
import formatNumber from "tools/function/formatNumber";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import moment from "moment";
import EBarimt from "../togloomiinTuv/EBarimt";
import QRCode from "react-qr-code";
import uilchilgee, { aldaaBarigch, socket } from "services/uilchilgee";
import { useEffect } from "react";
import { t } from "i18next";
import { useQRCode } from "next-qrcode";
import QpayModal from "./ShineQpay";
import { FaMoneyBillWave, FaArrowRight } from "react-icons/fa";
import { BsFillCreditCardFill } from "react-icons/bs";
import { useKeyboardTovchlol } from "hooks/useKeyboardTovchlol";
import ShineEbarimt from "./ShineEbarimt";
import { TbDiscount2 } from "react-icons/tb";
//#endregion
const { confirm } = Modal;
function ShineTulbur(
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
    eBarimtAshiglakhEsekh,
    suuliikhEsekh,
    eBarimtAutomataarShivikh,
    songogdsonZogsool,
  },
  ref
) {
  const { Canvas } = useQRCode();
  const [alkham, setAlkham] = React.useState(
    !!data?.tuluv && data?.tuluv === 1 ? 2 : 1
  );
  const [khaanbank, setTerminal] = React.useState(false);
  const [tulbur, setTulbur] = React.useState(data?.tulbur || []);
  const [eBarimt, setEBarimt] = React.useState(null);
  const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(false);
  const [irgenEsekh, setIrgenEsekh] = React.useState(true);
  const [register, setRegister] = React.useState("");
  const [tin, setTin] = React.useState("");
  const [baiguullagiinMedeelel, setBaiguullaga] = React.useState();
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
  const [qpayModalTuluv, setQpayModalTuluv] = React.useState(false);
  const [turulruuKhiikhDun, setTurulruuKhiikhDun] = React.useState(
    niitDun?.toString() -
      (data?.tulbur?.length > 0 && data?.tulbur?.reduce((a, b) => a + b.dun, 0))
  );

  const khungulultAnkhOrjIrsen = useMemo(() => {
    let orjIrsen = false;
    if (
      data?.tulbur?.length > 0 &&
      data?.tulbur.some((tulbur) => tulbur?.turul === "khungulult")
    ) {
      orjIrsen = true;
    }
    return orjIrsen;
  }, [data]);

  const [refreshdekhEsekh, setRefreshdekhEsekh] = React.useState(true);

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

  const value = React.useMemo(() => {
    const belen = tulbur.find((a) => a.turul === "belen")?.dun;
    const zeel = tulbur.find((a) => a.turul === "zeel")?.dun;
    const khariltsakh = tulbur.find((a) => a.turul === "khariltsakh")?.dun;
    const khunglukh = tulbur.find((a) => a.turul === "khunglukh")?.dun;
    const khaan = tulbur.find((a) => a.turul === "khaan")?.dun;
    const tdb = tulbur.find((a) => a.turul === "tdb")?.dun;
    const khas = tulbur.find((a) => a.turul === "khas")?.dun;
    const golomt = tulbur.find((a) => a.turul === "golomt")?.dun;
    const kapitron = tulbur.find((a) => a.turul === "kapitron")?.dun;
    const tur = tulbur.find((a) => a.turul === "tur")?.dun;
    const qpay = tulbur.find((a) => a.turul === "qpay")?.dun;
    const monpay = tulbur.find((a) => a.turul === "monpay")?.dun;
    const socialpay = tulbur.find((a) => a.turul === "socialpay")?.dun;
    const pocket = tulbur.find((a) => a.turul === "pocket")?.dun;
    const lend = tulbur.find((a) => a.turul === "lend")?.dun;
    const toki = tulbur.find((a) => a.turul === "toki")?.dun;
    const khungulult = tulbur.find((a) => a.turul === "khungulult")?.dun;
    return {
      belen,
      zeel,
      khariltsakh,
      khunglukh,
      khaan,
      tdb,
      khas,
      golomt,
      kapitron,
      tur,
      qpay,
      monpay,
      socialpay,
      pocket,
      lend,
      toki,
      khungulult,
    };
  }, [tulbur]);

  //Keyboard tovchlol ekhlel

  useKeyboardTovchlol("F4", f4Darsan);
  useKeyboardTovchlol("F5", f5darsan);

  function f4Darsan() {
    if (tulbur.length === 0) {
      turulruuTooKhiikhFunction("belen");
    }
    alkham === 1 ? batalgaajuulaltKhiiya() : ebarimtAvya(uilchluugchiinId);
    if (alkham === 1 && eBarimtAshiglakhEsekh === true) {
      eBarimtAutomataarShivikh ? ebarimtAvya(uilchluugchiinId) : setAlkham(2);
    }
  }
  function f5darsan() {
    turulruuTooKhiikhFunction("khaan");
  }
  function ebarimtguiTulburDuusgakh() {
    ref.current.khaaya();
    message.success("Төлбөр амжилттай хадгалагдлаа");
  }
  //Keyboard tovchlol tugsgul

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
        if(baiguullagaEsekh)
        body.customerTin = tin
      }
     

      uilchilgee(token)
        .post("/ebarimtShivye", body)
        .then(({ data }) => {
          if (data.success === true || data.status == "SUCCESS") {
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
        eBarimtAshiglakhEsekh ? setAlkham(2) : ebarimtguiTulburDuusgakh();
        onRefresh();
      });
      setTulbur(tulbur);
    } else if (
      (niitDun ? niitDun : data?.tulukhDun) ===
      tulbur.reduce((a, b) => a + b.dun, 0)
    )
      eBarimtAshiglakhEsekh ? setAlkham(2) : ebarimtguiTulburDuusgakh();
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
        eBarimtAshiglakhEsekh ? setAlkham(2) : ebarimtguiTulburDuusgakh();
        onRefresh();
      });
      eBarimtAshiglakhEsekh ? setAlkham(2) : ebarimtguiTulburDuusgakh();
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
      return notification.warn({
        message: "Төлбөр зөрүүтэй байна!",
        duration: 1,
      });
    }
    //Tuhain tulburiin dun ni too bolon 0 ees ih baih yostoi
    const yavuulakhTulbur = tulbur.filter((a) => a.dun && a.dun > 0);
    uilchilgee(token)
      .post("/zogsooliinTulburTulye", {
        tulbur: yavuulakhTulbur,
        id: uilchluugchiinId,
      })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          eBarimtAshiglakhEsekh ? setAlkham(2) : ebarimtguiTulburDuusgakh();
          onRefresh();
          suuliikhEsekh === true &&
            !songogdsonZogsool?.garakhKhaalgaGarTokhirgoo;
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

  async function batalgaajuulaltKhiiya(qpayTulugdsun, garaasSongosonTurul) {
    setLoading(true);
    if (!tulbur || tulbur.length <= 0) {
      return notification.warn({
        message: "Төлбөрийн хэлбэр сонгоно уу",
        duration: 1,
      });
    }
    const dun = await tulbur.find((a) => a.turul === "khaan")?.dun;
    if (garaasSongosonTurul === "khaan" && dun > 0) {
      setTerminal(true);
      await axios
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
          // guilgeeniiTuukhKhadgalya(tulbur);
        });
    } else if (garaasSongosonTurul === "qpay") {
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

  function handleCancelQpay() {
    setQpayModalTuluv(false);
  }

  const mungunDunNemekh = (newUneValue) => {
    if (refreshdekhEsekh) {
      setTurulruuKhiikhDun(newUneValue.toString());
      setRefreshdekhEsekh(false);
    } else {
      setTurulruuKhiikhDun(turulruuKhiikhDun + newUneValue);
    }
  };

  const hylbarNemekh = (newUneValue) => {
    if (refreshdekhEsekh) {
      setTurulruuKhiikhDun(newUneValue.toString());
      setRefreshdekhEsekh(false);
    } else {
      setTurulruuKhiikhDun(parseInt(turulruuKhiikhDun) + parseInt(newUneValue));
    }
  };

  const turulruuTooKhiikhFunction = (v) => {
    const tulukhDun =
      (niitDun ? niitDun : data?.tulukhDun) -
      tulbur.filter((a) => a.turul !== v).reduce((a, b) => a + b.dun, 0);
    const tuljBuiDun = parseInt(turulruuKhiikhDun);
    const index = tulbur.findIndex((a) => a.turul === v);
    const tukhainTulbur = tulbur.find((a) => a.turul === v);
    if (tulukhDun > 0) {
      const undsenModel = {
        ognoo: new Date(),
        zakhialgiinDugaar: data?.zakhialgiinDugaar,
        baiguullagiinId: data?.baiguullagiinId,
        burtgesenAjiltaniiId: ajiltan?._id,
        burtgesenAjiltaniiNer: ajiltan?.ner,
      };
      if (v === "khunglukh") {
        setKhunglult({ ...khunglult, khungulukhDun: tulukhDun });
        setKhungulukhEsekh(true);
      }
      if (index !== -1) {
        if (tulbur[index]?.turul === "khaan" && tulbur[index]?.dun > 0) {
          setTuluv(1);
          setSongogdsonBank(null);
        }
        setTurulruuKhiikhDun((e) => parseInt(e) + tukhainTulbur?.dun);
        tulbur.splice(index, 1);
      } else {
        if (tuljBuiDun > tulukhDun) {
          return notification.warn({
            message: "Төлөх дүнгээс их байж болохгүй",
          });
        }
        if (tuljBuiDun <= 0) {
          return notification.warn({
            message: `${tuljBuiDun} дүнгээр гүйлгээ хийх боломжгүй`,
          });
        }
        tulbur.push({ ...undsenModel, turul: v, dun: tuljBuiDun });
        const uldegdelTulukhDun = tulukhDun - tuljBuiDun;
        setTurulruuKhiikhDun(uldegdelTulukhDun <= 0 ? 0 : uldegdelTulukhDun);
      }
      setRefreshdekhEsekh(true);
      setTulbur([...tulbur]);
      if (v === "khaan" && tulbur.find((a) => a.turul === v)?.dun > 0) {
        batalgaajuulaltKhiiya(null, v);
      }
      if (v === "qpay" && tulbur.find((a) => a.turul === v)?.dun > 0) {
        batalgaajuulaltKhiiya(null, v);
        setQpayModalTuluv(true);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      const validKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      if (validKeys.includes(key)) {
        if (refreshdekhEsekh) {
          setRefreshdekhEsekh(false);
          setTurulruuKhiikhDun(key.toString());
        } else {
          setTurulruuKhiikhDun(
            (turulruuKhiikhDun?.toString() || "") + key.toString()
          );
        }
      }
      if (event.key === "Backspace") {
        if (turulruuKhiikhDun.toString().slice(0, -1).length > 0) {
          if (refreshdekhEsekh) {
            setRefreshdekhEsekh(false);
            setTurulruuKhiikhDun("0");
          } else {
            setTurulruuKhiikhDun((e) => e.toString().slice(0, -1));
          }
        } else {
          setTurulruuKhiikhDun("0");
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [turulruuKhiikhDun]);

  function handleTseverlekh() {
    setTurulruuKhiikhDun("0");
  }

  return (
    <div className="h-full w-full">
      {eBarimt && (
        <div className="hidden">
          <div
            className="flex w-full min-w-[58mm] flex-col p-2 pr-4 text-sm font-semibold text-black"
            ref={eBarimtRef}
          >
            <div className="text-center">Авто зогсоолын үйлчилгээ</div>
            <div className="text-center">
              {baiguullaga?.tokhirgoo?.zogsoolNer
                ? baiguullaga?.tokhirgoo?.zogsoolNer
                : baiguullaga?.ner}
            </div>
            {/* <div>Борлуулагч:</div> */}
            <div className="flex justify-between">
              <p>Огноо:</p>
              <p>{moment(Date.now()).format("YYYY/MM/DD hh:mm:ss")}</p>
            </div>
            <div className="flex justify-between">
              <p>ТТД:</p>
              <p>{eBarimt?.merchantTin}</p>
            </div>
            <div className="flex justify-between">
              <p>Кассчин:</p>
              <p>{ajiltan?.ner}</p>
            </div>
            <div>
              <p>ДДТД:</p>
            </div>
            <div className="-mt-1 w-[80mm]">
              <div>{eBarimt?.id}</div>
            </div>
            {baiguullagaEsekh && (
              <>
                <div>
                  <p>Худалдан авагч</p>
                </div>
                <div className="flex justify-between">
                  <p>ТТД:</p>
                  <p>{baiguullagiinMedeelel?.tin}</p>
               {   console.log(baiguullagiinMedeelel, "baiguullaga mun uu???????????")}
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
                  {formatNumber(
                    eBarimt.status == "SUCCESS"
                      ? eBarimt?.totalAmount || 0 - eBarimt?.totalVAT || 0
                      : (eBarimt?.amount || 0 - eBarimt?.vat || 0, 2),
                    2
                  )}
                  ₮
                </p>
              </div>
              <div className="flex justify-between">
                <p className="w-1/2 text-right">НӨАТ:</p>
                <p className="text-right">
                  {formatNumber(
                    eBarimt.status == "SUCCESS"
                      ? eBarimt?.totalVAT
                      : eBarimt?.vat,
                    2
                  )}
                  ₮
                </p>
              </div>
              <div className="flex justify-between">
                <p className="w-1/2 text-right">Төлөх дүн:</p>
                <p className="text-right">
                  {formatNumber(
                    eBarimt.status == "SUCCESS"
                      ? eBarimt?.totalAmount
                      : eBarimt?.amount
                  )}
                  ₮
                </p>
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
                {console.log(eBarimt?.qrData, "333")}
                <div className="flex w-full justify-center p-5 pt-3">
                  <div>
                    <QRCode level="L" value={eBarimt?.qrData} size={"100%"} />
                  </div>
                </div>
              </p>
            </div>
            <div className={`flex justify-between border-y-2 border-dashed`}>
              <p className="">Орсон цаг:</p>
              <p className="text-right">
                {data?.tsagiinTuukh?.[0]?.orsonTsag &&
                  moment(data?.tsagiinTuukh[0]?.orsonTsag).format(
                    "YYYY-MM-DD HH:mm"
                  )}
              </p>
            </div>
            <div className={`flex justify-between border-b-2 border-dashed`}>
              <p className="">Гарсан цаг:</p>
              <p className="text-right">
                {data?.tsagiinTuukh?.[0]?.garsanTsag &&
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
          {eBarimtAshiglakhEsekh && (
            <Steps.Step
              key="Төлбөрын баримт"
              subTitle={
                <span className="dark:text-gray-200">
                  {t("Төлбөрын баримт")}
                </span>
              }
              onClick={() => setAlkham(2)}
            />
          )}
        </Steps>
      </div>
      <div
        className={`${
          alkham === 1 ? "flex" : "hidden"
        } h-[750px] w-[1024px] flex-col gap-[60px] p-11 pb-0`}
      >
        <div className="flex h-[220px] w-full items-center justify-center gap-10 ">
          <div className="flex h-full w-[50%] flex-col items-center justify-center gap-5  ">
            <div className="flex gap-8">
              <div
                onClick={() => turulruuTooKhiikhFunction("belen")}
                className={`relative flex h-[85px] w-[184px] cursor-pointer items-center justify-center gap-4 rounded-3xl shadow-xl hover:scale-110 dark:bg-gray-700 ${
                  value.belen > 0 ? "border-[3px] border-green-600" : null
                } `}
              >
                {value.belen > 0 ? (
                  <div className="absolute right-[0] top-[-15px] rounded-xl border-[1px] border-green-600 bg-white p-1">
                    <div className="font-semibold">
                      {formatNumber(value.belen)}₮
                    </div>
                  </div>
                ) : null}
                <FaMoneyBillWave className="text-[30px] text-green-600" />
                <div className="text-[20px] text-lg font-bold text-green-600">
                  Бэлэн
                </div>
              </div>
              <div
                onClick={() => turulruuTooKhiikhFunction("khaan")}
                className={`relative flex h-[85px] w-[184px] cursor-pointer items-center justify-center gap-4 rounded-3xl shadow-xl hover:scale-110 dark:bg-gray-700 ${
                  value.khaan > 0 ? "border-[3px] border-green-600" : null
                } `}
              >
                {value.khaan > 0 ? (
                  <div className="absolute right-[0] top-[-15px] rounded-xl border-[1px] border-green-600 bg-white p-1">
                    <div className="font-semibold">
                      {formatNumber(value.khaan)}₮
                    </div>
                  </div>
                ) : null}
                <BsFillCreditCardFill className="text-[30px] text-green-600" />
                <div className="text-lg font-bold text-green-600">Карт</div>
              </div>
            </div>
            <div className="flex gap-8">
              <div
                onClick={() => turulruuTooKhiikhFunction("khariltsakh")}
                className={`relative flex h-[85px] w-[184px] cursor-pointer items-center justify-center gap-4 rounded-3xl shadow-xl hover:scale-110 dark:bg-gray-700 ${
                  value.khariltsakh > 0 ? "border-[3px] border-green-600" : null
                } `}
              >
                {value.khariltsakh > 0 ? (
                  <div className="absolute right-[0] top-[-15px] rounded-xl border-[1px] border-green-600 bg-white p-1">
                    <div className="font-semibold">
                      {formatNumber(value.khariltsakh)}₮
                    </div>
                  </div>
                ) : null}
                <FaArrowRight className="text-[30px] text-green-600" />
                <div className=" text-lg font-bold text-green-600">Дансаар</div>
              </div>
              <div
                onClick={() => {
                  if (!khungulultAnkhOrjIrsen) {
                    turulruuTooKhiikhFunction("khungulult");
                  }
                }}
                className={`relative flex h-[85px] w-[184px] ${
                  khungulultAnkhOrjIrsen
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } items-center justify-center gap-4 rounded-3xl shadow-xl hover:scale-110 dark:bg-gray-700 ${
                  value.khungulult > 0 ? "border-[3px] border-green-600" : null
                } `}
              >
                {value.khungulult > 0 ? (
                  <div className="absolute right-[0] top-[-15px] rounded-xl border-[1px] border-green-600 bg-white p-1">
                    <div className="font-semibold ">
                      {formatNumber(value.khungulult)}₮
                    </div>
                  </div>
                ) : null}
                <TbDiscount2 className="text-[30px] text-green-600" />
                <div className="text-lg font-bold text-green-600">
                  Хөнгөлөлт
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-full w-[75%] flex-col justify-center gap-4  ">
            <div className="flex gap-[48px]">
              <div
                className={`${
                  value.qpay > 0 && "rounded-3xl border-[3px] border-green-600"
                } relative h-[85px] hover:scale-110`}
                onClick={() => {
                  turulruuTooKhiikhFunction("qpay");
                }}
              >
                {value.qpay > 0 ? (
                  <div className="absolute right-[0] top-[-15px] z-10 rounded-xl border-[1px] border-green-600 bg-white p-1">
                    <div className="font-semibold">
                      {formatNumber(value.qpay)}₮
                    </div>
                  </div>
                ) : null}
                <Image preview={false} width={100} src="/Rectangle56.png" />
              </div>
              <QpayModal
                loading={loading}
                qpayerTulukh={qpayerTulukh}
                baiguullaga={baiguullaga}
                batalgaajuulaltKhiiya={batalgaajuulaltKhiiya}
                token={token}
                setQpayerTulukh={setQpayerTulukh}
                setQpayModalTuluv={setQpayModalTuluv}
                handleCancelQpay={handleCancelQpay}
                qpayModalTuluv={qpayModalTuluv}
                turul={"qpay"}
                khuleegdejBuiQpay={khuleegdejBuiQpay}
                qpayerTulukhDun={value.qpay}
              />
              <div
                className={`h-[85px] cursor-not-allowed rounded-3xl hover:scale-110`}
              >
                <Image
                  id="SocialPay"
                  preview={false}
                  width={100}
                  src="/Rectangle60.png"
                />
              </div>
              <div
                className={`relative h-[85px] cursor-not-allowed rounded-3xl hover:scale-110`}
              >
                <Image preview={false} width={100} src="/Group_158.png" />
                {value.toki > 0 ? (
                  <div className="absolute right-[0] top-[-15px] z-10 rounded-xl border-[1px] border-green-600 bg-white p-1">
                    <div className="font-semibold">
                      {formatNumber(value.toki)}₮
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex gap-[48px]">
              <div
                className={`h-[85px] cursor-not-allowed rounded-3xl hover:scale-110`}
              >
                <Image preview={false} width={100} src="/Rectangle66.png" />
              </div>
              <div
                className={`h-[85px] cursor-not-allowed rounded-3xl hover:scale-110`}
              >
                <Image preview={false} width={100} src="/Rectangle81.png" />
              </div>
              <div
                className={`h-[85px] cursor-not-allowed rounded-3xl  hover:scale-110`}
              >
                <Image preview={false} width={100} src="/Rectangle83.png" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[400px] justify-between gap-4 ">
          <div className="flex h-full w-[186px] flex-col gap-2">
            <div className="flex h-full w-[186px] flex-col gap-4">
              <div
                onClick={() => hylbarNemekh("20000")}
                className="flex h-[53px] cursor-pointer items-center justify-center rounded-full border-[1px] border-green-600 hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                <div className="font-bold">{formatNumber(20000)}</div>
              </div>
              <div
                onClick={() => hylbarNemekh("10000")}
                className="flex h-[53px] cursor-pointer items-center justify-center rounded-full border-[1px] border-green-600 hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                <div className="font-bold">{formatNumber(10000)}</div>
              </div>
              <div
                onClick={() => hylbarNemekh("5000")}
                className="flex h-[53px] cursor-pointer items-center justify-center rounded-full border-[1px] border-green-600 hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                <div className="font-bold">{formatNumber(5000)}</div>
              </div>
              <div
                onClick={() => hylbarNemekh("1000")}
                className="flex h-[53px] cursor-pointer items-center justify-center rounded-full border-[1px] border-green-600 hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                <div className="font-bold">{formatNumber(1000)}</div>
              </div>
              <div
                onClick={() => hylbarNemekh("500")}
                className="flex h-[53px] cursor-pointer items-center justify-center rounded-full border-[1px] border-green-600 hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                <div className="font-bold">{formatNumber(500)}</div>
              </div>
            </div>
            <div
              onClick={() => destroy()}
              style={{ backgroundColor: "rgba(255, 70, 70, 0.1)" }}
              className="flex h-[57px] cursor-pointer items-center justify-center rounded-xl border-[1px] border-[#FF4646] shadow-xl hover:bg-[#FF4646] hover:text-white"
            >
              <div className="font-bold text-[#FF4646]">Цуцлах [ESC]</div>
            </div>
          </div>

          <div className="flex h-full w-[45%] flex-col items-center gap-5">
            <div
              onDoubleClick={() =>
                setTurulruuKhiikhDun(
                  niitDun - tulbur?.reduce((a, b) => a + b?.dun, 0)
                )
              }
              className="flex h-[53px] w-[256px] cursor-pointer items-center justify-center rounded-full  border-[1px] border-green-600"
            >
              <div className="text-[32px] font-bold text-[#00A35E]">
                {formatNumber(turulruuKhiikhDun)}₮
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div
                onClick={() => mungunDunNemekh("1")}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-green-600 text-[32px] font-bold hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                1
              </div>
              <div
                onClick={() => mungunDunNemekh("2")}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-green-600 text-[32px] font-bold hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                2
              </div>
              <div
                onClick={() => mungunDunNemekh("3")}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-green-600 text-[32px] font-bold hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                3
              </div>
              <div
                onClick={() => mungunDunNemekh("4")}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-green-600 text-[32px] font-bold hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                4
              </div>
              <div
                onClick={() => mungunDunNemekh("5")}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-green-600 text-[32px] font-bold hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                5
              </div>
              <div
                onClick={() => mungunDunNemekh("6")}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-green-600 text-[32px] font-bold hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                6
              </div>
              <div
                onClick={() => mungunDunNemekh("7")}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-green-600 text-[32px] font-bold hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                7
              </div>
              <div
                onClick={() => mungunDunNemekh("8")}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-green-600 text-[32px] font-bold hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                8
              </div>
              <div
                onClick={() => mungunDunNemekh("9")}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-green-600 text-[32px] font-bold hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                9
              </div>
              <div
                onClick={() => handleTseverlekh()}
                style={{ backgroundColor: "rgba(255, 92, 0, 0.1)" }}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#FF5C00] text-[32px] font-bold text-[#FF5C00]"
              >
                <svg
                  width="19"
                  height="24"
                  viewBox="0 0 19 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.08 1.688C17.6347 1.96533 17.9547 2.40267 18.04 3C18.1467 3.59733 17.9973 4.14133 17.592 4.632C17.3147 5.016 16.952 5.22933 16.504 5.272C16.0773 5.31467 15.64 5.22933 15.192 5.016C14.68 4.78133 14.136 4.6 13.56 4.472C13.0053 4.344 12.4187 4.28 11.8 4.28C10.648 4.28 9.61333 4.46133 8.696 4.824C7.8 5.18667 7.032 5.70933 6.392 6.392C5.752 7.05333 5.26133 7.84267 4.92 8.76C4.6 9.67733 4.44 10.6907 4.44 11.8C4.44 13.1013 4.62133 14.232 4.984 15.192C5.368 16.152 5.89067 16.952 6.552 17.592C7.21333 18.232 7.992 18.712 8.888 19.032C9.784 19.3307 10.7547 19.48 11.8 19.48C12.376 19.48 12.952 19.4267 13.528 19.32C14.104 19.2133 14.6587 19.0213 15.192 18.744C15.64 18.5307 16.0773 18.456 16.504 18.52C16.952 18.584 17.3253 18.808 17.624 19.192C18.0507 19.7253 18.2 20.28 18.072 20.856C17.9653 21.4107 17.6453 21.816 17.112 22.072C16.5573 22.3493 15.9813 22.584 15.384 22.776C14.808 22.9467 14.2213 23.0747 13.624 23.16C13.0267 23.2667 12.4187 23.32 11.8 23.32C10.264 23.32 8.80267 23.0747 7.416 22.584C6.05067 22.0933 4.824 21.368 3.736 20.408C2.66933 19.448 1.82667 18.2533 1.208 16.824C0.589333 15.3733 0.28 13.6987 0.28 11.8C0.28 10.1573 0.557333 8.64267 1.112 7.256C1.688 5.86933 2.488 4.67467 3.512 3.672C4.55733 2.648 5.784 1.85867 7.192 1.304C8.6 0.727999 10.136 0.439999 11.8 0.439999C12.7387 0.439999 13.656 0.546665 14.552 0.759998C15.448 0.973331 16.2907 1.28267 17.08 1.688Z"
                    fill="#FF5C00"
                  />
                </svg>
              </div>
              <div
                onClick={() => mungunDunNemekh("0")}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-green-600 text-[32px] font-bold hover:bg-green-600 hover:text-white dark:text-gray-200"
              >
                0
              </div>
              <div
                onClick={() =>
                  setTurulruuKhiikhDun(
                    turulruuKhiikhDun.toString().slice(0, -1)
                  )
                }
                style={{ backgroundColor: "rgba(255, 70, 70, 0.1)" }}
                className="flex h-[70px] w-[30%] cursor-pointer items-center justify-center rounded-3xl border-[2px] border-[#FF4646]"
              >
                <svg
                  width="37"
                  height="23"
                  viewBox="0 0 37 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M32.6873 7.31748e-08H11.6484C11.1714 -9.63208e-05 10.699 0.0950439 10.2583 0.279982C9.81763 0.46492 9.41722 0.73603 9.08002 1.07781L0.532016 9.73594C-0.177339 10.4545 -0.177339 11.6191 0.532016 12.3371L9.08002 20.9958C9.761 21.6856 10.6849 22.0736 11.6479 22.0736H32.6873C34.6934 22.0736 36.3192 20.4267 36.3192 18.3946V3.67893C36.3192 1.6469 34.6934 7.31748e-08 32.6873 7.31748e-08ZM27.8813 14.6042C28.236 14.9635 28.236 15.5458 27.8813 15.905L26.5977 17.2053C26.243 17.5646 25.6681 17.5646 25.3134 17.2053L21.7916 13.6379L18.2698 17.2053C17.9152 17.5646 17.3403 17.5646 16.9856 17.2053L15.702 15.905C15.3473 15.5458 15.3473 14.9635 15.702 14.6042L19.2238 11.0368L15.702 7.46938C15.3473 7.11011 15.3473 6.5278 15.702 6.16853L16.9856 4.86826C17.3403 4.50899 17.9152 4.50899 18.2698 4.86826L21.7916 8.43567L25.3134 4.86826C25.6681 4.50899 26.243 4.50899 26.5977 4.86826L27.8813 6.16853C28.236 6.5278 28.236 7.11011 27.8813 7.46938L24.3595 11.0368L27.8813 14.6042Z"
                    fill="#FF4646"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex h-full w-[246px] flex-col items-center justify-end gap-6">
            <div className="flex h-[256px] w-[100%] flex-col justify-between rounded-[25px] border-2 border-dotted border-green-600 p-5">
              <div className="flex flex-col gap-2 font-semibold">
                <div className="flex w-full justify-between font-semibold dark:text-gray-200">
                  <div>Нийт дүн:</div>
                  <div>{formatNumber(niitDun)}₮</div>
                </div>
              </div>
              <div
                className={`flex w-full justify-between font-semibold ${
                  parseInt(turulruuKhiikhDun) - niitDun < 0
                    ? "text-red-400"
                    : "text-[#00A35E]"
                } `}
              >
                <div>
                  {parseInt(turulruuKhiikhDun) -
                    (niitDun - tulbur.reduce((a, b) => a + b.dun, 0)) >
                  0
                    ? "Хариулт:"
                    : "Дутуу:"}
                </div>
                <div>
                  {console.log(turulruuKhiikhDun, "turulruuKhiikhDun")}
                  {formatNumber(
                    parseInt(turulruuKhiikhDun) -
                      (niitDun - tulbur.reduce((a, b) => a + b.dun, 0)) || 0
                  )}
                  ₮
                </div>
              </div>
            </div>
            <div className="flex h-[120px] w-full flex-col items-center justify-center gap-4">
              <Popover
                content={
                  <div>
                    <div className="dark:text-gray-200">
                      1. Бэлнээр хадгалан, хувь хүнээр баримт хэвлэнэ.
                    </div>
                    <div className="dark:text-gray-200">
                      2. Төлбөрийн өөр хэлбэр сонгогдсон бол хувь хүнээр баримт
                      хэвлэнэ.
                    </div>
                  </div>
                }
                trigger={"hover"}
              >
                <button
                  style={{ backgroundColor: "rgba(79, 209, 197, 0.2)" }}
                  type="primary"
                  onClick={f4Darsan}
                  className="h-[57px] w-[186px] rounded-[15px] border-[2px] border-green-600 bg-green-600 text-green-600 shadow-xl"
                >
                  Шууд хадгалах [F4]
                </button>
              </Popover>
              <button
                onClick={loading ? null : batalgaajuulaltKhiiya}
                type="primary"
                className="h-[57px] w-[186px] rounded-[15px] bg-green-600 text-white shadow-xl"
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      </div>
      <ShineEbarimt
        alkham={alkham}
        baiguullagaEsekh={baiguullagaEsekh}
        baiguullagiinMedeelel={baiguullagiinMedeelel}
        irgenEsekh={irgenEsekh}
        register={register}
        tin = {tin}
        setBaiguullaga={setBaiguullaga}
        setBaiguullagaEsekh={setBaiguullagaEsekh}
        setIrgenEsekh={setIrgenEsekh}
        setRegister={setRegister}
        setTin={setTin}
      />
      {alkham === 2 && eBarimtAshiglakhEsekh === true && (
        <div className="mt-5 flex flex-row justify-between">
          <Button type="primary" danger onClick={() => ref.current.khaaya()}>
            {t("Хаах")}
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={() => ebarimtAvya(uilchluugchiinId)}
          >
            {t("Хэвлэх")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(ShineTulbur);
