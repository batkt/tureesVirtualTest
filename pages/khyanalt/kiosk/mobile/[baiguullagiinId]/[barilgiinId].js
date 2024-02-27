import {
  CloseCircleFilled,
  LeftCircleFilled,
  LoadingOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Drawer, Spin, message } from "antd";
import useUilchluulegchWithQuery from "hooks/useUilchluulegchWithQuery";
import React, { useEffect, useMemo, useRef, useState } from "react";
import uilchilgee, { aldaaBarigch, socket } from "services/uilchilgee";
import { ebarimtKhelberuud } from "tools/logic/tulburiinKhelberuud";
import moment, { utc } from "moment";
import Lottie from "lottie-react";
import amjilttaiAnimation from "../../amjilttaiAnimation.json";
import QRCode from "react-qr-code";
import formatNumber from "tools/function/formatNumber";
import DugaarKeyboardMobile from "components/pageComponents/kiosk/DugaarKeyboardMobile";
import { useRouter } from "next/router";
import { useZochinToken } from "hooks/useZochinToken";

const Kiosk = () => {
  const [dugaar, setDugaar] = useState(Array(4).fill(""));
  const router = useRouter();
  const queryBaiguullagiinId = router?.query?.baiguullagiinId;
  const barilgiinId = router?.query?.barilgiinId;
  const [messageApi, contextHolder] = message.useMessage();
  const [register, setRegister] = useState("");
  const [baiguullagaNer, setBaiguullagaNer] = useState();
  const [eBarimtTurul, setEbarimtTurul] = useState("");
  const [drawerOngoikh, setDrawerOngoikh] = useState(false);
  const [songogdsonData, setSongogdsonData] = useState(null);
  const [qpayerTulukh, setQpayerTulukh] = useState(false);
  const [tulburiinKhelber, setTulburiinKhelber] = useState("qpay");
  const [khuleegdejBuiQpay, setKhuleegdejBuiQpay] = useState();
  const [unshijBaina, setUnshijBaina] = useState(false);
  const [alkham, setAlkham] = useState(0);
  const [eBarimt, setEbarimt] = useState();
  const [seconds, setSeconds] = useState(59);
  const { token } = useZochinToken(queryBaiguullagiinId);
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
    queryBaiguullagiinId,
    query,
    barilgiinId
  );

  const msgNotif = (content) => {
    messageApi.open({
      content: content,
      style: {
        marginTop: "5rem",
      },
      duration: 3,
    });
  };

  useEffect(() => {
    if (khuleegdejBuiQpay) {
      socket().on(
        `qpay/${queryBaiguullagiinId}/${khuleegdejBuiQpay}`,
        (qpay) => {
          jinkheneTulburTulyo(
            "kiosk",
            songogdsonData?.session_id,
            songogdsonData?.pay_amount,
            songogdsonData?.plate_number,
            barilgiinId,
            "zochin",
            "zochin"
          );
        }
      );
    }
    return () => {
      socket().off(`qpay${khuleegdejBuiQpay}`);
    };
  }, [khuleegdejBuiQpay, queryBaiguullagiinId]);

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

  const mashinSongiy = async (data) => {
    try {
      setUnshijBaina(true);
      if (data) {
        const response = await uilchilgee().get(
          `/v1/search_car/${data?.mashiniiDugaar}`,
          {
            params: {
              baiguullagiinId: queryBaiguullagiinId,
            },
          }
        );
        if (response.data.success == true) {
          if (response.data?.data?.pay_amount > 0) {
            setSongogdsonData(response.data?.data);
            setAlkham(1);
            setTulburiinKhelber("qpay");
            qpayAvakh(
              response.data?.data?.session_id,
              barilgiinId,
              response.data?.data?.pay_amount
            );
            setUnshijBaina(false);
          } else {
            msgNotif(
              <div className="flex items-center justify-center gap-2 rounded-full font-semibold">
                <div className="text-yellow-500">
                  <WarningOutlined style={{ fontSize: "36px" }} size={100} />
                </div>
                <div className="text-4xl">
                  Тухайн машинд төлбөр бодогдоогүй байна.
                </div>
              </div>
            );
            setUnshijBaina(false);
          }
        } else {
          setUnshijBaina(false);
        }
      }
    } catch (err) {
      setUnshijBaina(false);
      console.log(err);
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

  const eBarimtTsonkhruuShiljye = () => {
    setAlkham(2);
    setTimeout(() => {
      setAlkham(3);
    }, 1500);
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
    <div className="relative flex h-[calc(100vh-25px)] w-screen flex-col overflow-hidden bg-[#1E1E1E]">
      {contextHolder}
      <div className="fixed top-0 z-[9999] flex bg-[#1E1E1E] text-center text-xs text-[#00D987]">
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
        className="khuviinDrawerMobile bg-transparent text-base font-semibold text-gray-200 dark:bg-transparent"
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
              setTulburiinKhelber();
              setKhuleegdejBuiQpay(null);
              setDugaar(Array(4).fill(""));
              setEbarimt();
              setAlkham(0);
            }}
            className="flex w-full items-center justify-center text-lg"
          >
            <CloseCircleFilled />
          </div>
          <div className="mt-8 flex w-full items-center justify-center">
            {"Дугаар сонгоно уу."}
          </div>
          {isValidating ? (
            <div className="flex w-full items-center justify-center">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 128 }} spin />}
              />
            </div>
          ) : uilchluulegchGaralt?.jagsaalt?.length > 0 ? (
            <div className="grid w-full grid-cols-2 place-content-center place-items-center gap-8 overflow-y-scroll p-8">
              {uilchluulegchGaralt?.jagsaalt?.map((mur) => {
                return (
                  <div
                    onClick={() => mashinSongiy(mur)}
                    className="w-fit rounded-xl border-[4px] border-[#414143] px-4 py-3 tracking-wider"
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
              setAlkham(0);
              setTulburiinKhelber();
              setQpayerTulukh(false);
              setKhuleegdejBuiQpay();
            }}
            className={`flex w-full items-center justify-center text-lg`}
          >
            <LeftCircleFilled />
          </div>
          <div className="mt-8 flex w-full items-center justify-center">
            {tulburiinKhelber === "qpay" && "Төлбөрийн хэлбэрээ сонгоно уу."}
          </div>
          <>
            {songogdsonData && (
              <div className="relative m-4 flex flex-col items-center justify-center rounded-xl bg-[#414143] p-2 py-4">
                <div className="flex w-full justify-between px-6">
                  <div>Улсын дугаар</div>
                  <div>{songogdsonData.plate_number}</div>
                </div>
                <div className="h-[1px] w-full bg-black dark:bg-black" />
                <div className="flex w-full justify-between px-6">
                  <div>Орсон </div>
                  <div>
                    {moment(songogdsonData.enter_date).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </div>
                </div>
                <div className="h-[1px] w-full bg-black dark:bg-black" />
                <div className="flex w-full justify-between px-6">
                  <div>Гарсан</div>
                  <div>{moment().format("DD/MM/YYYY HH:mm")}</div>
                </div>
                <div className="h-[1px] w-full bg-black dark:bg-black" />
                <div className="flex w-full justify-between px-6">
                  <div>Зогссон хугацаа </div>
                  <div>
                    {utc(utc().diff(moment(songogdsonData.enter_date))).format(
                      "HH:mm"
                    )}
                  </div>
                </div>
                <div className="h-[1px] w-full bg-black dark:bg-black" />
                <div className="flex w-full justify-between px-6 text-red-400">
                  <div>Төлбөр</div>
                  <div>{formatNumber(songogdsonData.pay_amount, 0)}₮</div>
                </div>
              </div>
            )}

            {qpayerTulukh && (
              <div className="mt-2 grid max-h-[400px] w-full grid-cols-4 gap-2 overflow-y-auto px-4 py-2">
                {qpayerTulukh.urls.map((mur) => {
                  return (
                    <a
                      href={mur.link}
                      className="col-span-1 flex w-full flex-col gap-2 overflow-hidden rounded-[15px] border border-[#414143] bg-[#1E1E1E] p-4 hover:border-2"
                    >
                      <div className="flex items-center justify-center rounded-xl">
                        <img
                          className="h-10 w-10 overflow-hidden rounded-xl"
                          src={`${mur?.logo}`}
                          alt=""
                        />
                      </div>
                      <div className="text-center text-buurJijig text-zinc-200">
                        {mur.description}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </>
        </div>
        <div
          className={`absolute left-0 top-5 h-full w-full transition-all duration-300 ${
            alkham === 2 ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-16">
            <div className="text-lg font-bold">Гүйлгээ амжилттай</div>
            <Lottie
              style={{ width: 300, height: 300 }}
              animationData={amjilttaiAnimation}
            />
          </div>
        </div>
        <div
          className={`absolute left-0 top-5 h-full w-full px-4 transition-all duration-300 ${
            alkham === 3 ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <div
            onClick={() => {
              setDrawerOngoikh(false);
              setSongogdsonData(null);
              setTulburiinKhelber();
              setKhuleegdejBuiQpay(null);
              setDugaar(Array(4).fill(""));
              setEbarimtTurul("");
              setAlkham(0);
              setEbarimt();
            }}
            className="flex w-full items-center justify-center text-base"
          >
            <CloseCircleFilled />
          </div>
          <div className="mt-8 flex w-full items-center justify-center">
            {"И-Баримт төрөл сонгоно уу."}
          </div>
          <div className="mt-8 flex w-full items-center justify-between gap-8">
            {ebarimtKhelberuud.map((mur) => {
              return (
                <div
                  key={mur.key}
                  onClick={() => {
                    setEbarimtTurul(mur.ner);
                    setRegister("");
                    setBaiguullagaNer();
                  }}
                  className={`flex h-[100px] w-full flex-col
                  items-center justify-center rounded-xl p-4 transition-all duration-300 ease-in-out ${
                    eBarimtTurul === mur.ner ? "bg-zinc-700" : "bg-[#414143]"
                  }`}
                >
                  <div className="h-12 w-12">
                    <img src={mur.icon} alt="" />
                  </div>
                  <div>{mur.label}</div>
                </div>
              );
            })}
          </div>
          <div className="flex h-2/3 w-full items-center justify-center">
            <DugaarKeyboardMobile
              dugaar={register}
              setDugaar={setRegister}
              handleUrgeljluulekh={handleEbarimtAvya}
              setRegister={setRegister}
              eBarimtTurul={eBarimtTurul}
              dugaarRef={shineDugaarRef}
              shineTurul={true}
              baiguullagaNer={baiguullagaNer}
              className={"!justify-start"}
            />
          </div>
        </div>
        <div
          className={`absolute left-0 top-5 h-full w-full transition-all duration-300 ${
            alkham === 4 ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <div
            onClick={onTimeout}
            className="flex w-full items-center justify-center text-base"
          >
            <CloseCircleFilled />
          </div>
          <div className="fixed left-[55%] top-0">
            {seconds > 9 ? `0:${seconds}` : `0:0${seconds}`}
          </div>
          <div className="mt-8 flex items-center justify-center text-lg text-zinc-200">
            Амжилттай төлөгдлөө
          </div>
          {eBarimt && eBarimtTurul === "khuviKhun" && (
            <div className="mx-4 mt-8 flex flex-col items-center justify-center gap-8 rounded-xl bg-[#414143] p-4 py-8">
              <div className="flex w-full justify-between  pl-4">
                <div>Сугалааны дугаар</div>
                <div>{eBarimt?.lottery}</div>
              </div>
              <div className="h-[1px] w-full bg-black dark:bg-black" />
              <div className="flex w-full justify-between pl-4">
                <div>Баримтын дүн</div>
                <div>{formatNumber(Number(eBarimt?.amount), 0)}₮</div>
              </div>
            </div>
          )}
          {eBarimt && eBarimtTurul === "baiguullaga" && (
            <div className="mx-4 mt-8 flex flex-col items-center justify-center gap-2 rounded-xl bg-[#414143] p-2 py-4">
              <div className="flex w-full justify-between  pl-4">
                <div>ТТД</div>
                <div>{eBarimt?.registerNo}</div>
              </div>
              <div className="h-[1px] w-full bg-black dark:bg-black" />
              <div className="flex w-full justify-between pl-4">
                <div>ТТН</div>
                <div>{baiguullagaNer?.name}</div>
              </div>
              <div className="h-[1px] w-full bg-black dark:bg-black" />
              <div className="flex w-full justify-between pl-4">
                <div>Баримтын дүн</div>
                <div>{formatNumber(Number(eBarimt?.amount), 0)}₮</div>
              </div>
            </div>
          )}
          {eBarimt?.qrData && (
            <div className="mx-4 mt-4 flex items-center justify-center rounded-xl bg-zinc-200 p-4">
              <QRCode value={eBarimt?.qrData} />
            </div>
          )}
        </div>
      </Drawer>
      <div className="flex h-1/3 w-full flex-col items-center justify-center gap-8">
        <div className="mt-24 h-36 w-36 rounded-lg">
          <img className="h-full w-full" src="/ParkEaseLogoShine2.png" alt="" />
        </div>
        <div className="text-center text-lg font-bold text-zinc-200">
          Зогсоолын төлбөрөө энд төлөн хугацаагаа хэмнээрэй
        </div>
      </div>
      <div className="mt-auto flex h-2/3 w-full flex-col items-center justify-center text-white">
        <DugaarKeyboardMobile
          dugaar={dugaar}
          setDugaar={setDugaar}
          handleUrgeljluulekh={handleUrgeljluulekh}
          dugaarRef={dugaarRef}
        />
      </div>
    </div>
  );
};

export default Kiosk;
