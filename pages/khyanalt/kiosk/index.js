import {
  CloseCircleFilled,
  LeftCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { Drawer, Spin, message } from "antd";
import DugaarKeyboard from "components/pageComponents/kiosk/DugaarKeyboard";
import useUilchluulegchWithQuery from "hooks/useUilchluulegchWithQuery";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "services/auth";
import uilchilgee, { aldaaBarigch, socket } from "services/uilchilgee";
import {
  ebarimtKhelberuud,
  tulburiinKhelberuud,
} from "tools/logic/tulburiinKhelberuud";
import moment, { utc } from "moment";
import axios from "axios";
import Lottie from "lottie-react";
import amjilttaiAnimation from "./amjilttaiAnimation.json";
import QRCode from "react-qr-code";
// import shalgaltKhiikh from "services/shalgaltKhiikh";

const Kiosk = () => {
  const [dugaar, setDugaar] = useState(Array(4).fill(""));
  const [register, setRegister] = useState("");
  const [baiguullagaNer, setBaiguullagaNer] = useState();
  const [eBarimtTurul, setEbarimtTurul] = useState("");
  const [drawerOngoikh, setDrawerOngoikh] = useState(false);
  const [songogdsonData, setSongogdsonData] = useState(null);
  const [terminal, setTerminal] = useState(false);
  const [qpayerTulukh, setQpayerTulukh] = useState(false);
  const [tulburiinKhelber, setTulburiinKhelber] = useState();
  const [khuleegdejBuiQpay, setKhuleegdejBuiQpay] = useState();
  const [butsakhGuideDarsan, setButsakhGuideDarsan] = useState(false);
  const [unshijBaina, setUnshijBaina] = useState(false);
  const [alkham, setAlkham] = useState(0);
  const [eBarimt, setEbarimt] = useState();
  const [seconds, setSeconds] = useState(59);
  const lottieRef = useRef(null);
  const { token, baiguullaga, barilgiinId, ajiltan } = useAuth();
  const query = useMemo(() => {
    var query = {};
    if (drawerOngoikh) {
      query["tuukh.0.tuluv"] = 0;
      query["tuukh.0.garsanKhaalga"] = { $exists: false };
      query["tuukh.0.tsagiinTuukh.0.orsonTsag"] = {
        $gte: moment().subtract(3, "days").startOf("day"),
        $lte: moment().endOf("day"),
      };
      const negtgesenKhail = dugaar.join("");
      query.mashiniiDugaar = { $regex: negtgesenKhail, $options: "i" };
    } else query = undefined;
    return query;
  }, [dugaar, drawerOngoikh]);
  const { uilchluulegchGaralt, isValidating } = useUilchluulegchWithQuery(
    token,
    baiguullaga?._id,
    query
  );

  useEffect(() => {
    if (khuleegdejBuiQpay) {
      socket().on(`qpay/${baiguullaga._id}/${khuleegdejBuiQpay}`, (qpay) => {
        eBarimtTsonkhruuShiljye();
      });
    }
    return () => {
      socket().off(`qpay${khuleegdejBuiQpay}`);
    };
  }, [khuleegdejBuiQpay, baiguullaga]);

  useEffect(() => {
    if (register.length > 6) {
      uilchilgee()
        .get(`/tatvaraasBaiguullagaAvya/${register}`)
        .then(({ data }) => {
          if (data) {
            setBaiguullagaNer(data);
          }
        });
    } else {
      setBaiguullagaNer();
    }
  }, [register]);

  useEffect(() => {
    if (alkham === 4) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            clearInterval(timer);
            if (onTimeout && typeof onTimeout === "function") {
              onTimeout();
            }
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [alkham]);

  function onTimeout() {
    setDrawerOngoikh(false);
    setSongogdsonData(null);
    setTerminal(false);
    setTulburiinKhelber();
    setKhuleegdejBuiQpay(null);
    setDugaar(Array(4).fill(""));
    setEbarimtTurul("");
    setEbarimt();
    setBaiguullagaNer();
    setRegister("");
    setSeconds(59);
    setAlkham(0);
  }

  function qpayAvakh(uilchluugchiinId, barilgiinId, ilgeekhDun) {
    setUnshijBaina(true);
    if (uilchluugchiinId && ilgeekhDun) {
      setKhuleegdejBuiQpay(`${uilchluugchiinId}${ilgeekhDun}`);
      uilchilgee(token)
        .post("/qpayGargaya", {
          barilgiinId: barilgiinId,
          dun: ilgeekhDun,
          zakhialgiinDugaar: `${uilchluugchiinId}${ilgeekhDun}`,
        })
        .then(({ data }) => {
          setQpayerTulukh(data);
          setUnshijBaina(false);
        })
        .catch((e) => {
          aldaaBarigch(e);
          setUnshijBaina(false);
          setTulburiinKhelber();
          setQpayerTulukh(false);
          setKhuleegdejBuiQpay();
        });
    }
  }
  const dugaarRef = useRef(null);
  const shineDugaarRef = useRef(null);
  const handleUrgeljluulekh = () => {
    var ongoilgokhEsekh = true;
    dugaar.forEach((dug) => {
      if (dug === "") {
        ongoilgokhEsekh = false;
      }
    });
    if (ongoilgokhEsekh) {
      setDrawerOngoikh(true);
    } else {
      dugaarRef?.current?.khoosonInputFocusliy();
    }
  };

  const tulburTulyo = async (data) => {
    try {
      setUnshijBaina(true);
      if (data) {
        const response = await uilchilgee().get(
          `/v1/search_car/${data?.mashiniiDugaar}`,
          {
            params: {
              baiguullagiinId: baiguullaga?._id,
            },
          }
        );
        if (response.data.success == true) {
          setSongogdsonData(response.data?.data);
          setAlkham(1);
          setUnshijBaina(false);
        } else {
          setUnshijBaina(false);
        }
      }
    } catch (err) {
      setUnshijBaina(false);
      console.log(err);
    }
  };

  const handleTulburiinKhelberSongolt = async (data) => {
    setTulburiinKhelber(data);
    if (data === "card") {
      setTerminal(true);
      await axios
        .post(
          "http://127.0.0.1:27028",
          {
            service_name: "doSaleTransaction",
            service_params: {
              db_ref_no: moment().format("YYYYMMDDhhmmss00"),
              amount: String(songogdsonData?.pay_amount),
              vatps_bill_type: "1",
            },
          },
          { timeout: 4000000 }
        )
        .then(({ data }) => {
          if (data.status === true && data?.response?.response_code === "000") {
            jinkheneTulburTulyo(
              tulburiinKhelber,
              songogdsonData?.session_id,
              songogdsonData?.pay_amount,
              songogdsonData?.plate_number,
              barilgiinId,
              ajiltan?.ner,
              ajiltan?._id
            );
          } else if (
            data?.status == true &&
            data?.response?.Exception?.ErrorCode === "003"
          ) {
            message.error("Нэг удаагийн гүйлгээний дүн хүрэхгүй");
          }
          setTerminal(false);
        })
        .catch((e) => {
          console.log("posaldaa: ", e.message);
          message.error("Пос алдаа гарлаа. Та дахин оролдоно уу.");
          setTerminal(false);
          jinkheneTulburTulyo(
            tulburiinKhelber,
            songogdsonData?.session_id,
            songogdsonData?.pay_amount,
            songogdsonData?.plate_number,
            barilgiinId,
            ajiltan?.ner,
            ajiltan?._id
          );
        });
    }
    if (data === "qpay") {
      qpayAvakh(
        songogdsonData?.session_id,
        barilgiinId,
        songogdsonData?.pay_amount
      );
    }
    if (data === "pass") {
      // probably same??
    }
  };

  const jinkheneTulburTulyo = (
    turul,
    uilchluulegchiinId,
    paid_amount,
    plate_number,
    barilgiinId,
    ajiltniiNer,
    ajiltniiId
  ) => {
    uilchilgee(token)
      .post("/v1/kioskPay", {
        turul,
        uilchluulegchiinId,
        paid_amount,
        plate_number,
        barilgiinId,
        ajiltniiNer,
        ajiltniiId,
      })
      .then((res) => {
        if (res.data === "Amjilttai") {
          eBarimtTsonkhruuShiljye();
        }
      })
      .catch((err) => {
        aldaaBarigch(err);
      });
  };

  const eBarimtAvya = (
    uilchluulegchiinId,
    customer_no,
    individual,
    paid_amount
  ) => {
    uilchilgee(token)
      .post("/v1/kioskEbarimtAvya", {
        uilchluulegchiinId,
        customer_no,
        individual,
        paid_amount,
      })
      .then(({ data }) => {
        if (!!data) {
          setEbarimt(data.data);
          setAlkham(4);
        }
      })
      .catch((err) => {
        aldaaBarigch(err);
      });
  };

  const butsakhGuide = () => {
    setButsakhGuideDarsan(true);
    setTimeout(() => {
      setButsakhGuideDarsan(false);
    }, 1000);
  };

  const eBarimtTsonkhruuShiljye = () => {
    setAlkham(2);
    lottieRef?.current?.play();
    setTimeout(() => {
      setAlkham(3);
    }, 2000);
  };

  const handleEbarimtAvya = () => {
    eBarimtAvya(
      songogdsonData?.session_id,
      register,
      register !== "" ? false : true,
      songogdsonData?.pay_amount
    );
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="fixed top-0 z-[9999] flex bg-zinc-800 px-[100px] text-center text-2xl text-[#00D987]">
        Төлбөр төлснөөс хойш 30 минут дотор та зогсоолоос гараагүй бол төлбөр
        нэмэгдэж бодогдохыг анхаарна уу!
      </div>
      {unshijBaina && (
        <div className="fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center bg-white bg-opacity-40">
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 128 }} spin />}
          />
        </div>
      )}
      <Drawer
        placement="bottom"
        open={drawerOngoikh}
        height={"78vh"}
        closable={false}
        maskClosable={false}
        className="khuviinDrawer bg-transparent text-5xl font-semibold text-gray-200"
      >
        <div
          className={`absolute left-0 top-5 h-full w-full transition-all duration-300 ${
            alkham === 0 ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <div
            onClick={() => {
              setDrawerOngoikh(false);
              setSongogdsonData(null);
              setTerminal(false);
              setTulburiinKhelber();
              setKhuleegdejBuiQpay(null);
              setDugaar(Array(4).fill(""));
              setEbarimt();
              setAlkham(0);
            }}
            className="flex w-full items-center justify-center text-7xl"
          >
            <CloseCircleFilled />
          </div>
          <div className="mt-8 flex w-full items-center justify-center">
            Дугаар сонгоно уу.
          </div>
          {isValidating ? (
            <div className="mt-24 flex w-full items-center justify-center">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 128 }} spin />}
              />
            </div>
          ) : uilchluulegchGaralt?.jagsaalt?.length > 0 ? (
            <div className="mt-8 grid w-full grid-cols-3 gap-8 overflow-y-scroll p-8">
              {uilchluulegchGaralt?.jagsaalt?.map((mur) => {
                return (
                  <div
                    onClick={() => tulburTulyo(mur)}
                    className="w-fit rounded-xl border-4 border-zinc-600 px-6 py-4"
                  >
                    {mur?.mashiniiDugaar}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              Жагсаалт хоосон байна...
            </div>
          )}
        </div>
        <div
          className={`absolute left-0 top-5 h-full w-full transition-all duration-300 ${
            alkham === 1 ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <div
            onClick={() => {
              if (tulburiinKhelber) {
                setTulburiinKhelber();
                setQpayerTulukh(false);
                setKhuleegdejBuiQpay();
              } else {
                setAlkham(0);
              }
            }}
            className={`flex w-full items-center justify-center text-7xl ${
              butsakhGuideDarsan && "animate-ping"
            }`}
          >
            <LeftCircleFilled />
          </div>
          <div className="mt-8 flex w-full items-center justify-center">
            {!tulburiinKhelber && "Төлбөрийн хэлбэр сонгоно уу."}
            {tulburiinKhelber === "card" && "Картаа уншуулна уу."}
            {tulburiinKhelber === "qpay" && "QR уншуулан төлбөрөө төлнө үү."}
            {tulburiinKhelber === "pass" &&
              "Pass апп-аас төлөн үргэлжлүүлэх дарна уу."}
          </div>
          <div className="mt-8 flex w-full items-center justify-between gap-4 px-12">
            {tulburiinKhelberuud.map((mur) => {
              return (
                <div
                  key={mur.key}
                  onClick={() => {
                    if (!tulburiinKhelber) {
                      handleTulburiinKhelberSongolt(mur.ner);
                    } else {
                      butsakhGuide();
                    }
                  }}
                  className={`flex w-full flex-col items-center justify-center rounded-xl bg-zinc-600 p-4 ${
                    tulburiinKhelber !== mur.ner && "bg-zinc-700"
                  }`}
                >
                  <div className="h-[120px] w-[120px]">
                    <img src={mur.icon} alt="" />
                  </div>
                  <div>{mur.label}</div>
                </div>
              );
            })}
          </div>
          {songogdsonData &&
            (!tulburiinKhelber || tulburiinKhelber === "card") && (
              <div className="mx-12 mt-8 flex flex-col items-center justify-center gap-8 rounded-xl bg-zinc-600 p-4 py-8">
                <div className="w-full pl-4">
                  Улсын дугаар: {songogdsonData.plate_number}
                </div>
                <div className="w-full border border-zinc-800" />
                <div className="w-full pl-4">
                  Орсон:{" "}
                  {moment(songogdsonData.enter_date).format("DD/MM/YYYY HH:mm")}
                </div>
                <div className="w-full border border-zinc-800" />
                <div className="w-full pl-4">
                  Гарсан: {moment().format("DD/MM/YYYY HH:mm")}
                </div>
                <div className="w-full border border-zinc-800" />
                <div className="w-full pl-4">
                  Зогссон хугацаа:{" "}
                  {utc(utc().diff(moment(songogdsonData.enter_date))).format(
                    "HH:mm"
                  )}
                </div>
                <div className="w-full border border-zinc-800" />
                <div className="w-full pl-4 text-red-400">
                  Төлбөр: {songogdsonData.pay_amount}₮
                </div>
              </div>
            )}
          {songogdsonData &&
            tulburiinKhelber &&
            tulburiinKhelber !== "card" && (
              <>
                {qpayerTulukh && qpayerTulukh?.qr_image && (
                  <div className="flex h-[450px] w-full flex-col items-center justify-center gap-[60px] pb-0">
                    <img
                      src={`data:image/png;base64,${qpayerTulukh?.qr_image}`}
                      alt=""
                    />
                  </div>
                )}
                <div className="mx-12 mt-8 flex flex-col items-center justify-center gap-8 rounded-xl bg-zinc-600 p-4 py-8">
                  <div className="w-full pl-4 text-red-400">
                    Төлбөр: {songogdsonData.pay_amount}₮
                  </div>
                </div>
              </>
            )}
        </div>
        <div
          className={`absolute left-0 top-5 h-full w-full transition-all duration-300 ${
            alkham === 2 ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-16">
            <div className="text-4xl font-bold">Гүйлгээ амжилттай</div>
            <Lottie
              lottieRef={lottieRef}
              loop={false}
              animationData={amjilttaiAnimation}
            />
          </div>
        </div>
        <div
          className={`absolute left-0 top-5 h-full w-full px-24 transition-all duration-300 ${
            alkham === 3 ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <div
            onClick={() => {
              setDrawerOngoikh(false);
              setSongogdsonData(null);
              setTerminal(false);
              setTulburiinKhelber();
              setKhuleegdejBuiQpay(null);
              setDugaar(Array(4).fill(""));
              setEbarimtTurul("");
              setAlkham(0);
              setEbarimt();
            }}
            className="flex w-full items-center justify-center text-7xl"
          >
            <CloseCircleFilled />
          </div>
          <div className="mt-8 flex w-full items-center justify-center px-12 text-center">
            И-Баримт төрөл сонгоно уу.
          </div>
          <div className="mt-32 flex w-full items-center justify-between gap-24 px-12">
            {ebarimtKhelberuud.map((mur) => {
              return (
                <div
                  key={mur.key}
                  onClick={() => {
                    setEbarimtTurul(mur.ner);
                    setRegister("");
                    setBaiguullagaNer();
                  }}
                  className={`flex transition-all duration-300 ease-in-out ${
                    eBarimtTurul !== "" ? "h-[200px]" : "h-[400px]"
                  } w-full flex-col items-center justify-center rounded-xl p-4 ${
                    eBarimtTurul === mur.ner ? "bg-zinc-700" : "bg-zinc-600"
                  }`}
                >
                  <div className="h-[120px] w-[120px]">
                    <img src={mur.icon} alt="" />
                  </div>
                  <div>{mur.label}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex w-full items-center justify-center gap-24 px-12">
            <DugaarKeyboard
              dugaar={register}
              setDugaar={setRegister}
              handleUrgeljluulekh={handleEbarimtAvya}
              setRegister={setRegister}
              eBarimtTurul={eBarimtTurul}
              dugaarRef={shineDugaarRef}
              shineTurul={true}
              baiguullagaNer={baiguullagaNer}
            />
          </div>
        </div>
        <div
          className={`absolute left-0 top-5 h-full w-full px-24 transition-all duration-300 ${
            alkham === 4 ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <div
            onClick={onTimeout}
            className="flex w-full items-center justify-center text-7xl"
          >
            <CloseCircleFilled />
          </div>
          <div className="fixed left-[60%] top-3">
            {seconds > 9 ? `0:${seconds}` : `0:0${seconds}`}
          </div>
          <div className="mt-8 flex items-center justify-center px-12 text-5xl text-zinc-200">
            Амжилттай төлөгдлөө
          </div>
          {eBarimt && eBarimtTurul === "khuviKhun" && (
            <div className="mx-12 mt-8 flex flex-col items-center justify-center gap-8 rounded-xl bg-zinc-600 p-4 py-8">
              <div className="flex w-full justify-between  pl-4">
                <div>Сугалааны дугаар</div>
                <div>{eBarimt?.lottery}</div>
              </div>
              <div className="w-full border border-zinc-800" />
              <div className="flex w-full justify-between pl-4">
                <div>Баримтын дүн</div>
                <div>{eBarimt?.amount}</div>
              </div>
            </div>
          )}
          {eBarimt && eBarimtTurul === "baiguullaga" && (
            <div className="mx-12 mt-8 flex flex-col items-center justify-center gap-8 rounded-xl bg-zinc-600 p-4 py-8">
              <div className="flex w-full justify-between  pl-4">
                <div>ТТД</div>
                <div>{eBarimt?.registerNo}</div>
              </div>
              <div className="w-full border border-zinc-800" />
              <div className="flex w-full justify-between pl-4">
                <div>ТТН</div>
                <div>{baiguullagaNer?.name}</div>
              </div>
            </div>
          )}
          {eBarimt?.qrData && (
            <div className="mt-8 flex items-center justify-center px-12">
              <QRCode value={eBarimt?.qrData} size={500} />
            </div>
          )}
        </div>
      </Drawer>
      <div className="flex h-1/3 w-full flex-col items-center justify-center gap-8">
        <div className="">
          <img className="h-full w-full" src="/parkEaseLogo.png" alt="" />
        </div>
        <div className="px-12 text-center text-5xl font-bold text-zinc-800">
          Зогсоолын төлбөрөө энд төлөн хугацаагаа хэмнээрэй
        </div>
      </div>
      <div className="flex h-2/3 w-full flex-col items-center justify-center text-white">
        <DugaarKeyboard
          dugaar={dugaar}
          setDugaar={setDugaar}
          handleUrgeljluulekh={handleUrgeljluulekh}
          dugaarRef={dugaarRef}
        />
      </div>
      <div className="fixed bottom-[-65vh] left-[-55vh] z-[-1] h-[135vh] w-[135vh] rounded-full bg-zinc-800" />
    </div>
  );
};
// export const getServerSideProps = shalgaltKhiikh;

export default Kiosk;
