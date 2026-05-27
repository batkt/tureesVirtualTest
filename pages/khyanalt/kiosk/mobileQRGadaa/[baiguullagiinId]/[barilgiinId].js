import {
  CloseCircleFilled,
  LeftCircleFilled,
  LoadingOutlined,
  CarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Spin } from "antd";
import { toast } from "sonner";
import useUilchluulegchWithQuery from "hooks/useUilchluulegchWithQuery";
import React, { useEffect, useMemo, useRef, useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { ebarimtKhelberuud } from "tools/logic/tulburiinKhelberuud";
import moment, { utc } from "moment";
import amjilttaiAnimation from "../../amjilttaiAnimation.json";
import QRCode from "react-qr-code";
import formatNumber from "tools/function/formatNumber";
import DugaarKeyboardMobile from "components/pageComponents/kiosk/DugaarKeyboardMobile";
import useQpayObject from "hooks/useQpayObject";
import ZuvhunKhunglukhModalContent from "../../ZuvhunKhunglukhModalContent";
import { MdOutlineDiscount } from "react-icons/md";
import { modal } from "components/ant/Modal";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const KioskMobile = ({
  token,
  zogsool,
  baiguullagiinId,
  barilgiinId,
  khungulukh,
}) => {
  const [dugaar, setDugaar] = useState(Array(4).fill(""));
  const [register, setRegister] = useState("");
  const [baiguullagaNer, setBaiguullagaNer] = useState();
  const [customerTin, setCustomerTin] = useState();
  const [eBarimtTurul, setEbarimtTurul] = useState("");
  const [drawerOngoikh, setDrawerOngoikh] = useState(false);
  const [songogdsonData, setSongogdsonData] = useState(null);
  const [qpayerTulukh, setQpayerTulukh] = useState(false);
  const [tulburiinKhelber, setTulburiinKhelber] = useState("qpay");
  const [khuleegdejBuiQpay, setKhuleegdejBuiQpay] = useState();
  const [unshijBaina, setUnshijBaina] = useState(false);
  const [alkham, setAlkham] = useState(0);
  const [eBarimt, setEbarimt] = useState();
  const [khungulukhDun, setKhungulukhDun] = useState(khungulukh);
  const [cameraIP, setCameraIP] = useState();
  const khungulultRef = React.useRef(null);
  const endTimeRef = useRef(null);
  const [servereesAvsonOdooTsag, setServereesAvsonOdooTsag] = useState();
  const [countdown, setCountdown] = useState(100000);
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);
  const order = { "tuukh.0.tsagiinTuukh.0.garsanTsag": -1 };

  const query = useMemo(() => {
    var query = {};
    if (drawerOngoikh) {
      query["tuukh.0.tuluv"] = 0;
      query["niitDun"] = { $gt: 0 };
      query["tuukh.0.tulbur"] = { $eq: [] };
      query["tuukh.0.tsagiinTuukh.0.orsonTsag"] = {
        $gte: moment().subtract(3, "days").startOf("day"),
        $lte: moment().endOf("day"),
      };
      const negtgesenKhail = dugaar.join("");
      query.mashiniiDugaar = { $regex: negtgesenKhail, $options: "i" };
    } else query = undefined;
    return query;
  }, [dugaar, drawerOngoikh]);
  const { uilchluulegchGaralt, isValidating, uilchluulegchMutate } =
    useUilchluulegchWithQuery(
      token,
      baiguullagiinId,
      query,
      barilgiinId,
      order,
    );

  const { qpayObject } = useQpayObject(token, qpayerTulukh?.id);

  useEffect(() => {
    if (token)
      uilchilgee(token)
        .get("/ognooAvya")
        .then(({ data }) => {
          if (!!data) {
            setServereesAvsonOdooTsag(data);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
  }, [token]);

  const msgNotif = (content) => {
    toast.warning(content, { duration: 2000 });
  };

  function showKhunglult() {
    const footer = [
      <Button onClick={() => khungulultRef.current.khaaya()}>Үгүй</Button>,
      <Button
        className="space-x-2"
        type="primary"
        onClick={() => khungulultRef.current.ilgeeye()}
      >
        Тийм
      </Button>,
    ];
    modal({
      title: "Хөнгөлөлт",
      content: (
        <ZuvhunKhunglukhModalContent
          songogdsonData={songogdsonData}
          barilgiinId={barilgiinId}
          token={token}
          ref={khungulultRef}
        />
      ),
      footer,
    });
  }

  useEffect(() => {
    if (qpayObject && qpayObject.tulsunEsekh) {
      eBarimtTsonkhruuShiljye();
      if (khungulukhDun > 0)
        khungulultKhadgalya(
          songogdsonData.session_id,
          songogdsonData.parking_id,
        );
    }
  }, [qpayObject]);

  useEffect(() => {
    setCustomerTin();
    if (register.length > 6) {
      uilchilgee()
        .get(`/tatvaraasBaiguullagaAvya/${register}`)
        .then(({ data }) => {
          if (data) {
            setBaiguullagaNer(data);
            setCustomerTin(data?.tin);
          }
        });
    } else {
      setBaiguullagaNer();
    }
  }, [register]);

  useEffect(() => {
    if (
      baiguullagiinId === "673d88133987e97992f77c02" &&
      songogdsonData?.enter_date &&
      !songogdsonData?.fitnessHungulult
    ) {
      setSongogdsonData((prev) => {
        return {
          ...prev,
          fitnessHungulult: 3000,
          pay_amount: prev?.pay_amount < 3000 ? 0 : prev?.pay_amount - 3000,
        };
      });
    }
  }, [songogdsonData?.enter_date, servereesAvsonOdooTsag, baiguullagiinId]);

  useEffect(() => {
    if (!drawerOngoikh) return;

    endTimeRef.current = Date.now() + 15 * 60 * 1000;
    let timer;

    const tick = () => {
      const remaining = Math.max(0, endTimeRef.current - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      setMinutes(Math.floor(totalSeconds / 60));
      setSeconds(totalSeconds % 60);
      if (remaining <= 0) {
        clearInterval(timer);
        onTimeout();
      }
    };

    tick();
    timer = setInterval(tick, 1000);

    const handleVisibility = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [drawerOngoikh]);

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
    setAlkham(0);
  }

  const clearObjects = () => {
    setDrawerOngoikh(false);
    setSongogdsonData(null);
    setTulburiinKhelber();
    setKhuleegdejBuiQpay(null);
    setDugaar(Array(4).fill(""));
    setEbarimtTurul("");
    setEbarimt();
    setBaiguullagaNer();
    setRegister("");
    setAlkham(0);
    setKhungulukhDun(0);
    setServereesAvsonOdooTsag();
    setCustomerTin();
    setQpayerTulukh(false);
  };

  function qpayAvakh(
    uilchluugchiinId,
    barilgiinId,
    ilgeekhDun,
    mashiniiDugaar,
    garsanCameraIP,
  ) {
    setUnshijBaina(true);
    const safetyTimeout = setTimeout(() => setUnshijBaina(false), 15000);

    if (uilchluugchiinId && ilgeekhDun) {
      setKhuleegdejBuiQpay(`${uilchluugchiinId}${ilgeekhDun}`);
      let yavuulakhBody = {
        barilgiinId: barilgiinId,
        dun: ilgeekhDun,
        zakhialgiinDugaar: `${uilchluugchiinId}${ilgeekhDun}`,
      };
      if (zogsool?.zogsooliinDans) {
        yavuulakhBody["dansniiDugaar"] = zogsool?.zogsooliinDans;
      }
      if (!!mashiniiDugaar) {
        yavuulakhBody["zogsooliinId"] = zogsool?._id;
        yavuulakhBody["tulukhDun"] = ilgeekhDun;
        yavuulakhBody["zogsoolUilchluulegchiinId"] = uilchluugchiinId;
        yavuulakhBody["mashiniiDugaar"] = mashiniiDugaar;
        yavuulakhBody["turul"] = "QRGadaa";
        yavuulakhBody["cameraIP"] = garsanCameraIP;
      }
      uilchilgee(token)
        .post("/qpayGargaya", yavuulakhBody)
        .then(({ data }) => {
          clearTimeout(safetyTimeout);
          setQpayerTulukh(data);
          setUnshijBaina(false);
        })
        .catch((e) => {
          clearTimeout(safetyTimeout);
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
      if (data?._id) {
        const response = await uilchilgee().get(
          `/v1/search_carQR/${data?.mashiniiDugaar}`,
          {
            params: {
              baiguullagiinId: baiguullagiinId,
              freeze: true,
            },
          },
        );
        if (response.data.success == true) {
          if (
            response.data?.data?.pay_amount > 0 &&
            response.data?.data?.session_id === data?._id
          ) {
            if (
              !!data?.tuukh[0]?.tulbur?.find((x) => x.turul == "qpayKhungulult")
            ) {
              setKhungulukhDun(0);
            }
            if (khungulukhDun > 0) {
              if (khungulukhDun < response.data?.data?.pay_amount) {
                setSongogdsonData({
                  ...response.data?.data,
                  pay_amount: response.data?.data?.pay_amount - khungulukhDun,
                });
                setAlkham(1);
                setTulburiinKhelber("qpay");
                qpayAvakh(
                  response.data?.data?.session_id,
                  barilgiinId,
                  response.data?.data?.pay_amount - khungulukhDun,
                  response.data?.data?.plate_number,
                  response.data?.data?.garsanCameraIP,
                );
                setUnshijBaina(false);
              } else {
                setKhungulukhDun(response.data?.data?.pay_amount);
                setSongogdsonData(response.data?.data);
                setAlkham(1);
                setTulburiinKhelber("qpay");
                setUnshijBaina(false);
              }
            } else {
              setSongogdsonData(response.data?.data);
              setAlkham(1);
              setTulburiinKhelber("qpay");
              qpayAvakh(
                response.data?.data?.session_id,
                barilgiinId,
                response.data?.data?.pay_amount,
                response.data?.data?.plate_number,
                response.data?.data?.garsanCameraIP,
              );
              setUnshijBaina(false);
            }
          } else {
            setUnshijBaina(false);
            if ((uilchluulegchGaralt?.jagsaalt?.length ?? 0) < 2)
              msgNotif("Тухайн машинд төлбөр бодогдоогүй байна.");
          }
        } else {
          setUnshijBaina(false);
          if ((uilchluulegchGaralt?.jagsaalt?.length ?? 0) < 2)
            msgNotif("Тухайн машинд төлбөр бодогдоогүй байна.");
        }
      } else {
        setUnshijBaina(false);
        clearObjects();
      }
    } catch (err) {
      clearObjects();
      setUnshijBaina(false);
      toast.error(err);
    }
  };

  const eBarimtAvya = (
    uilchluulegchiinId,
    customer_no,
    individual,
    paid_amount,
    customerTin,
  ) => {
    uilchilgee(token)
      .post("/v1/kioskEbarimtAvya", {
        uilchluulegchiinId,
        customer_no,
        individual,
        paid_amount,
        customerNo: customer_no,
        customerTin,
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

  const khungulultKhadgalya = (uilchluulegchiinId, zogsooliinId) => {
    uilchilgee(token)
      .post("/v1/kioskPay", {
        uilchluulegchiinId,
        turul: "qpayKhungulult",
        zogsooliinId,
        paid_amount: khungulukhDun,
      })
      .then(({ data }) => {
        if (!!data) {
          setAlkham(4);
          setKhungulukhDun(0);
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
      songogdsonData?.pay_amount,
      customerTin,
    );
  };

  return (
    <div
      className="relative flex h-[100dvh] w-screen flex-col overflow-hidden bg-[#0F0F14]"
      style={{ touchAction: "manipulation" }}
    >
      {/* Notice banner */}
      <div
        className="fixed top-0 z-[9999] w-full px-4 py-2 text-center text-[11px] font-medium text-[#00C97A]"
        style={{
          background: "rgba(0,200,120,0.06)",
          borderBottom: "1px solid rgba(0,200,120,0.10)",
        }}
      >
        Төлбөр төлснөөс хойш {zogsool?.garakhTsag || 30} минут дотор гараагүй
        бол нэмэлт төлбөр бодогдохыг анхаарна уу!
      </div>

      {/* Loading overlay */}
      {unshijBaina && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 56, color: "#00D987" }}
                spin
              />
            }
          />
          <div className="animate-pulse text-sm text-[#00C97A]">
            Уншиж байна...
          </div>
        </div>
      )}

      {/* Bottom drawer */}
      <Drawer
        placement="bottom"
        open={drawerOngoikh}
        height={"92dvh"}
        closable={false}
        maskClosable={false}
        className="khuviinDrawerMobile bg-transparent text-base font-semibold text-gray-200 dark:bg-transparent"
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-t-3xl bg-[#17171E]">
          {/* Drag handle */}
          <div className="flex w-full shrink-0 justify-center pb-1 pt-3">
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>

          {/* Countdown timer */}
          <div
            className={`absolute right-4 top-4 z-50 flex min-w-[68px] items-center justify-center rounded-2xl px-4 py-2 shadow-lg transition-all duration-300 ${
              minutes === 0 && seconds <= 10
                ? "animate-pulse bg-red-600 ring-2 ring-red-400/50"
                : minutes === 0 && seconds <= 20
                ? "bg-orange-500 ring-2 ring-orange-400/40"
                : "bg-[#2A1010]"
            }`}
          >
            <div
              className={`font-mono text-2xl font-bold tracking-wider text-white ${
                minutes === 0 && seconds <= 10 ? "animate-pulse" : ""
              }`}
            >
              {minutes > 0 ? `${minutes}:` : ""}
              {seconds < 10 ? `0${seconds}` : seconds}
            </div>
          </div>

          {/* Screens container */}
          <div className="relative flex-1 overflow-hidden">
            {/* ── Alkham 0: Vehicle list ── */}
            <div
              className={`absolute inset-0 flex flex-col transition-all duration-300 ${
                alkham === 0
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-0 opacity-0"
              }`}
            >
              <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-1">
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
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white/60 active:bg-white/20"
                >
                  <CloseCircleFilled />
                </div>
                <div className="flex-1 text-center text-sm font-semibold text-white/80">
                  Машин сонгоно уу
                </div>
                <div className="w-9" />
              </div>

              {isValidating ? (
                <div className="flex flex-1 items-center justify-center">
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 48, color: "#00D987" }}
                        spin
                      />
                    }
                  />
                </div>
              ) : uilchluulegchGaralt?.jagsaalt?.length > 0 ? (
                <div className="flex-1 overflow-y-auto px-4 pb-6">
                  <div className="flex flex-col gap-3">
                    {uilchluulegchGaralt?.jagsaalt?.map((mur) => (
                      <div
                        key={mur?._id}
                        onClick={() => mashinSongiy(mur)}
                        className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition-colors active:bg-white/10"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00C97A]/8">
                          <CarOutlined className="text-xl text-[#00C97A]" />
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-bold tracking-widest text-white">
                            {mur?.mashiniiDugaar}
                          </div>
                          {mur?.tuukh?.[0]?.tsagiinTuukh?.[0]?.orsonTsag && (
                            <div className="mt-0.5 text-xs text-white/40">
                              {moment(
                                mur.tuukh[0].tsagiinTuukh[0].orsonTsag,
                              ).format("MM/DD HH:mm")}{" "}
                              орсон
                            </div>
                          )}
                        </div>
                        <div className="text-2xl font-light text-white/25">
                          ›
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white/25">
                  <CarOutlined className="text-5xl" />
                  <div className="text-sm">Жагсаалт хоосон байна</div>
                </div>
              )}
            </div>

            {/* ── Alkham 1: Payment ── */}
            <div
              className={`absolute inset-0 flex flex-col transition-all duration-300 ${
                alkham === 1
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-0 opacity-0"
              }`}
            >
              <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-1">
                <div
                  onClick={() => {
                    setAlkham(0);
                    setTulburiinKhelber();
                    setQpayerTulukh(false);
                    setKhuleegdejBuiQpay();
                    uilchluulegchMutate();
                  }}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white/60 active:bg-white/20"
                >
                  <LeftCircleFilled />
                </div>
                <div className="flex-1 text-center text-sm font-semibold text-white/80">
                  Төлбөрийн мэдээлэл
                </div>
                <div className="w-9" />
              </div>

              <div className="flex-1 overflow-y-auto pb-6">
                {songogdsonData && (
                  <div className="mx-4 mt-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <div className="border-white/8 flex items-center gap-3 border-b px-5 py-3.5">
                      <CarOutlined className="shrink-0 text-[#00C97A]" />
                      <span className="flex-1 text-xs text-white/50">
                        Улсын дугаар
                      </span>
                      <span className="font-bold tracking-widest text-white">
                        {songogdsonData.plate_number}
                      </span>
                    </div>
                    <div className="border-white/8 flex items-center gap-3 border-b px-5 py-3.5">
                      <CalendarOutlined className="shrink-0 text-sky-300" />
                      <span className="flex-1 text-xs text-white/50">
                        Орсон цаг
                      </span>
                      <span className="text-sm text-white">
                        {moment(songogdsonData.enter_date).format(
                          "DD/MM/YYYY HH:mm",
                        )}
                      </span>
                    </div>
                    <div className="border-white/8 flex items-center gap-3 border-b px-5 py-3.5">
                      <CalendarOutlined className="shrink-0 text-violet-300" />
                      <span className="flex-1 text-xs text-white/50">
                        Гарсан цаг
                      </span>
                      <span className="text-sm text-white">
                        {songogdsonData.garsanTsag
                          ? moment(songogdsonData.garsanTsag).format(
                              "DD/MM/YYYY HH:mm",
                            )
                          : moment().format("DD/MM/YYYY HH:mm")}
                      </span>
                    </div>
                    <div className="border-white/8 flex items-center gap-3 border-b px-5 py-3.5">
                      <ClockCircleOutlined className="shrink-0 text-amber-300" />
                      <span className="flex-1 text-xs text-white/50">
                        Зогссон хугацаа
                      </span>
                      <span className="text-sm text-white">
                        {(() => {
                          const garsanTsag = songogdsonData.garsanTsag
                            ? moment(songogdsonData.garsanTsag)
                            : moment();
                          const diff = garsanTsag.diff(
                            moment(songogdsonData.enter_date),
                          );
                          const dur = moment.duration(diff);
                          return `${String(dur.hours()).padStart(
                            2,
                            "0",
                          )}:${String(dur.minutes()).padStart(2, "0")}`;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-red-500/8 px-5 py-4">
                      <WalletOutlined className="shrink-0 text-lg text-red-300" />
                      <span className="flex-1 text-sm text-white/70">
                        Нийт төлбөр
                      </span>
                      <span className="text-2xl font-bold text-red-300">
                        {formatNumber(songogdsonData.pay_amount, 0)}₮
                      </span>
                    </div>
                    {khungulukhDun > 0 && (
                      <div className="border-white/8 flex items-center gap-3 border-t bg-emerald-500/8 px-5 py-3.5">
                        <MdOutlineDiscount className="shrink-0 text-lg text-emerald-300" />
                        <span className="flex-1 text-xs text-white/50">
                          Хөнгөлөлт
                        </span>
                        <span className="font-semibold text-emerald-300">
                          -{formatNumber(khungulukhDun, 0)}₮
                        </span>
                      </div>
                    )}
                    {baiguullagiinId === "673d88133987e97992f77c02" && (
                      <div className="border-white/8 flex items-center gap-3 border-t px-5 py-3.5">
                        <MdOutlineDiscount className="shrink-0 text-lg text-emerald-300" />
                        <span className="flex-1 text-xs text-white/50">
                          Хөнгөлөлт
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/60">
                            {formatNumber(songogdsonData?.fitnessHungulult, 0)}₮
                          </span>
                          <Button
                            onClick={() => showKhunglult()}
                            size="small"
                            className="border-emerald-500/25 text-emerald-300"
                          >
                            Энд дар
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {qpayerTulukh && (
                  <div className="mt-4 px-4">
                    <div className="mb-3 text-xs font-medium uppercase tracking-wider text-white/30">
                      Банк сонгоно уу
                    </div>
                    {qpayerTulukh?.urls?.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2.5">
                        {qpayerTulukh?.urls?.map((mur) => (
                          <a
                            key={mur.link}
                            href={mur.link}
                            className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-2 py-3 transition-colors active:bg-white/10"
                          >
                            <img
                              className="h-10 w-10 rounded-xl"
                              src={`${mur?.logo}`}
                              alt=""
                            />
                            <div className="text-center text-[10px] leading-tight text-zinc-400">
                              {mur.description}
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-sm text-white/30">
                        QPay тохиргоо хийгдээгүй байна
                      </div>
                    )}
                  </div>
                )}

                {khungulukhDun > 0 && (
                  <div className="mt-4 flex justify-center px-4">
                    <button
                      onClick={() =>
                        khungulultKhadgalya(
                          songogdsonData.session_id,
                          songogdsonData.parking_id,
                        )
                      }
                      className="flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-900/30 px-6 py-3 text-base font-semibold text-emerald-300 focus:outline-none active:bg-green-800/50"
                    >
                      <MdOutlineDiscount className="text-lg" />
                      Хөнгөлөлт ашиглах
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Alkham 2: Success animation ── */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center gap-6 transition-all duration-300 ${
                alkham === 2
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-0 opacity-0"
              }`}
            >
              <div className="text-xl font-bold text-white">
                Гүйлгээ амжилттай!
              </div>
              <Lottie
                style={{ width: 260, height: 260 }}
                animationData={amjilttaiAnimation}
              />
            </div>

            {/* ── Alkham 3: E-receipt selection ── */}
            <div
              className={`absolute inset-0 flex flex-col transition-all duration-300 ${
                alkham === 3
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-0 opacity-0"
              }`}
            >
              <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-1">
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
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white/60 active:bg-white/20"
                >
                  <CloseCircleFilled />
                </div>
                <div className="flex-1 text-center text-sm font-semibold text-white/80">
                  И-Баримт авах
                </div>
                <div className="w-9" />
              </div>

              <div className="shrink-0 px-4 pb-3">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/30">
                  Баримтын төрөл
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {ebarimtKhelberuud.map((mur) => (
                    <div
                      key={mur.key}
                      onClick={() => {
                        setEbarimtTurul(mur.ner);
                        setRegister("");
                        setBaiguullagaNer();
                      }}
                      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-200 ${
                        eBarimtTurul === mur.ner
                          ? "border-[#00C97A]/35 bg-[#00C97A]/8 text-[#00C97A]"
                          : "border-white/10 bg-white/5 text-white/60"
                      }`}
                    >
                      <div className="h-10 w-10">
                        <img src={mur.icon} alt="" className="h-full w-full" />
                      </div>
                      <div className="text-sm font-medium">{mur.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center overflow-hidden px-2">
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

            {/* ── Alkham 4: Receipt display ── */}
            <div
              className={`absolute inset-0 flex flex-col transition-all duration-300 ${
                alkham === 4
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-0 opacity-0"
              }`}
            >
              <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-1">
                <div
                  onClick={onTimeout}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white/60 active:bg-white/20"
                >
                  <CloseCircleFilled />
                </div>
                <div className="flex-1 text-center text-sm font-semibold text-white/80">
                  Амжилттай төлөгдлөө
                </div>
                <div className="w-9" />
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-6">
                <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  <span className="text-sm font-medium text-emerald-300">
                    Төлбөр баталгаажсан
                  </span>
                </div>

                {eBarimt && eBarimtTurul === "khuviKhun" && (
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <div className="border-white/8 flex items-center justify-between border-b px-5 py-3.5">
                      <span className="text-xs text-white/50">
                        Сугалааны дугаар
                      </span>
                      <span className="font-bold text-white">
                        {eBarimt?.lottery}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-xs text-white/50">
                        Баримтын дүн
                      </span>
                      <span className="font-bold text-emerald-300">
                        {formatNumber(
                          Number(
                            eBarimt?.amount
                              ? eBarimt?.amount
                              : eBarimt?.totalAmount,
                          ),
                          0,
                        )}
                        ₮
                      </span>
                    </div>
                  </div>
                )}

                {eBarimt && eBarimtTurul === "baiguullaga" && (
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <div className="border-white/8 flex items-center justify-between border-b px-5 py-3.5">
                      <span className="text-xs text-white/50">ТТД</span>
                      <span className="font-semibold text-white">
                        {eBarimt?.registerNo}
                      </span>
                    </div>
                    <div className="border-white/8 flex items-center justify-between border-b px-5 py-3.5">
                      <span className="text-xs text-white/50">ТТН</span>
                      <span className="max-w-[60%] truncate text-sm text-white">
                        {baiguullagaNer?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-xs text-white/50">
                        Баримтын дүн
                      </span>
                      <span className="font-bold text-emerald-300">
                        {formatNumber(
                          Number(
                            eBarimt?.amount
                              ? eBarimt?.amount
                              : eBarimt?.totalAmount,
                          ),
                          0,
                        )}
                        ₮
                      </span>
                    </div>
                  </div>
                )}

                {eBarimt?.qrData && (
                  <div className="mt-4 flex flex-col items-center gap-3">
                    <div className="text-xs text-white/30">
                      QR код уншуулна уу
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <QRCode value={eBarimt?.qrData} size={200} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* ── Main screen: Hero + Keyboard ── */}
      <div className="flex h-[32%] w-full flex-col items-center justify-center gap-4 pt-8">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-2xl blur-2xl"
            style={{ background: "rgba(0,200,120,0.15)" }}
          />
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl sm:h-28 sm:w-28">
            <img
              className="h-full w-full object-contain"
              src="/ParkEaseLogoShine.png"
              alt=""
            />
          </div>
        </div>
        <div className="px-6 text-center">
          <div className="text-base font-bold text-white sm:text-xl">
            Зогсоолын Төлбөр
          </div>
          <div className="mt-1 text-xs text-white/40 sm:text-sm">
            Дугаараа оруулж шуурхай төлөөрэй
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center overflow-hidden">
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

export const getServerSideProps = async (ctx) => {
  try {
    let token = null;
    let zogsool = null;
    if (!!ctx?.query?.baiguullagiinId && ctx.query.barilgiinId)
      token = await uilchilgee()
        .get(`/zochiniiTokenAvya/${ctx?.query?.baiguullagiinId}`)
        .then((a) => a.data);
    var barilgiinId = ctx.query.barilgiinId;
    var khungululttei = false;
    if (barilgiinId.length == 25) {
      barilgiinId = barilgiinId.substring(0, barilgiinId.length - 1);
      khungululttei = true;
    }
    zogsool = await uilchilgee(token)
      .get("/zogsoolJagsaalt", {
        params: {
          query: {
            baiguullagiinId: ctx.query.baiguullagiinId,
            barilgiinId: barilgiinId,
          },
        },
      })
      .then((a) => {
        if (a.data && a.data?.jagsaalt?.length > 0) {
          return a.data?.jagsaalt?.[0];
        } else {
          return false;
        }
      });
    if (!zogsool) {
      return {
        redirect: {
          destination: "/khyanalt/zogsool/404",
          permanent: false,
        },
        props: {},
      };
    }
    return {
      props: {
        token,
        zogsool,
        baiguullagiinId: ctx.query.baiguullagiinId,
        barilgiinId,
        khungulukh:
          khungululttei && zogsool?.qrKhungulukhDun
            ? zogsool?.qrKhungulukhDun
            : 0,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }
};

export default KioskMobile;
