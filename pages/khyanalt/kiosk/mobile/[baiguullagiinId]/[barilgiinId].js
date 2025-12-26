import {
  CloseCircleFilled,
  LeftCircleFilled,
  LoadingOutlined,
  WarningOutlined,
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
import getTsagiinTariff from "tools/function/getTsagiinTariff";
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
  const [servereesAvsonOdooTsag, setServereesAvsonOdooTsag] = useState();
  const [countdown, setCountdown] = useState(100000);

  const query = useMemo(() => {
    var query = {};
    if (drawerOngoikh) {
      query["tuukh.0.tuluv"] = 0;
      if (baiguullagiinId === "6715ef2ca5cefb3e54505428") {
        query["niitDun"] = { $gt: 0 };
        query["tuukh.0.tulbur"] = { $eq: [] };
      } else query["tuukh.0.garsanKhaalga"] = { $exists: false };
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
    baiguullagiinId,
    query,
    barilgiinId
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
    toast.info(content, {
      duration: 2000,
    });
  };

  function showKhunglult(khungulukhTsag, khungulultTurul) {
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
          khungulukhTsag={khungulukhTsag}
          khungulultTurul={khungulultTurul}
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
          songogdsonData.parking_id
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
    // Ugaalga: time does NOT matter; amounts are always available (1h + 24h)
    if (
      baiguullagiinId === "6115f350b35689cdbf1b9da3" &&
      songogdsonData?.enter_date &&
      !songogdsonData?.ugaalgaHungulult &&
      !songogdsonData?.ugaalgaHungulult24
    ) {
      const undsenUne =
        getTsagiinTariff(zogsool?.tulburuud, servereesAvsonOdooTsag, 60) ||
        zogsool?.undsenUne ||
        2000;
      setSongogdsonData((prev) => {
        const rawPay = Number(prev?.pay_amount) || 0;
        const nextPay = rawPay < undsenUne ? 0 : rawPay - undsenUne;
        return {
          ...prev,
          ugaalgaHungulult: undsenUne,
          ugaalgaHungulult24: undsenUne * 24,
          pay_amount: nextPay,
        };
      });
    }
  }, [songogdsonData?.enter_date, servereesAvsonOdooTsag, baiguullagiinId]);

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

  function qpayAvakh(
    uilchluugchiinId,
    barilgiinId,
    ilgeekhDun,
    mashiniiDugaar
  ) {
    setUnshijBaina(true);
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
      }
      uilchilgee(token)
        .post("/qpayGargaya", yavuulakhBody)
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
              baiguullagiinId: baiguullagiinId,
              barilgiinId: barilgiinId,
              freeze: true,
            },
          }
        );
        if (response.data.success == true) {
          if (response.data?.data?.pay_amount > 0) {
            let car = { ...response.data?.data };
            let payAmount = Number(car?.pay_amount) || 0;
            const anhniiPayAmount = payAmount;
            car.anhniiPayAmount = anhniiPayAmount;

            // Apply Ugaalga discount BEFORE creating QPay invoice
            if (
              baiguullagiinId === "6115f350b35689cdbf1b9da3" &&
              car?.enter_date
            ) {
              const odooTsag = moment(servereesAvsonOdooTsag || new Date());
              const undsenUne =
                getTsagiinTariff(zogsool?.tulburuud, odooTsag, 60) ||
                zogsool?.undsenUne ||
                car?.parkingUndsenUne ||
                2000;
              const enter = moment(car.enter_date);

              if (odooTsag.isAfter(enter.clone().add(24, "hours"))) {
                const discount24 = undsenUne * 24;
                car.ugaalgaHungulult24 = discount24;
                car.ugaalgaHungulult = 0;
                payAmount = payAmount < discount24 ? 0 : payAmount - discount24;
              } else if (odooTsag.isAfter(enter.clone().add(1, "hours"))) {
                const discount1 = undsenUne;
                car.ugaalgaHungulult = discount1;
                car.ugaalgaHungulult24 = 0;
                payAmount = payAmount < discount1 ? 0 : payAmount - discount1;
              }
            }

            if (
              !!data?.tuukh[0]?.tulbur?.find((x) => x.turul == "qpayKhungulult")
            ) {
              setKhungulukhDun(0);
            }
            if (khungulukhDun > 0) {
              if (khungulukhDun < payAmount) {
                const finalPay = payAmount - khungulukhDun;
                setSongogdsonData({ ...car, anhniiPayAmount, pay_amount: finalPay });
                setAlkham(1);
                setTulburiinKhelber("qpay");
                if (finalPay > 0) {
                  qpayAvakh(
                    car?.session_id,
                    barilgiinId,
                    finalPay,
                    car?.plate_number
                  );
                } else {
                  setQpayerTulukh(false);
                  setKhuleegdejBuiQpay();
                }
                setUnshijBaina(false);
              } else {
                setKhungulukhDun(payAmount);
                setSongogdsonData({ ...car, anhniiPayAmount, pay_amount: 0 });
                setAlkham(1);
                setTulburiinKhelber("qpay");
                setUnshijBaina(false);
              }
            } else {
              setSongogdsonData({ ...car, anhniiPayAmount, pay_amount: payAmount });
              setAlkham(1);
              setTulburiinKhelber("qpay");
              if (payAmount > 0) {
                qpayAvakh(
                  car?.session_id,
                  barilgiinId,
                  payAmount,
                  car?.plate_number
                );
              } else {
                setQpayerTulukh(false);
                setKhuleegdejBuiQpay();
              }
              setUnshijBaina(false);
            }
          } else {
            msgNotif(
              <div className="flex items-center justify-center gap-2 rounded-full font-semibold">
                <div className="text-yellow-500">
                  <WarningOutlined style={{ fontSize: "14px" }} />
                </div>
                <div className="text-base">
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
      toast.error(err);
    }
  };

  const eBarimtAvya = (
    uilchluulegchiinId,
    customer_no,
    individual,
    paid_amount,
    customerTin
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
      customerTin
    );
  };

  return (
    <div className="relative flex h-[calc(100vh-25px)] w-screen flex-col overflow-hidden bg-[#1E1E1E]">
      <div className="fixed top-0 z-[9999] flex bg-[#1E1E1E] text-center text-xs text-[#00D987]">
        Төлбөр төлснөөс хойш {zogsool?.garakhTsag || 30} минут дотор та
        зогсоолоос гараагүй бол төлбөр нэмэгдэж бодогдохыг анхаарна уу!
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
          <div className="flex w-full items-center justify-center text-lg">
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
              className="p-2"
            >
              <CloseCircleFilled />
            </div>
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
          <div className={`flex w-full items-center justify-center text-lg`}>
            <div
              onClick={() => {
                setAlkham(0);
                setTulburiinKhelber();
                setQpayerTulukh(false);
                setKhuleegdejBuiQpay();
              }}
              className="p-2"
            ></div>
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
                  <div>
                    {formatNumber(
                      songogdsonData?.anhniiPayAmount ??
                        songogdsonData?.pay_amount,
                      0
                    )}
                    ₮
                  </div>
                </div>
                {khungulukhDun > 0 && (
                  <div className="h-[1px] w-full bg-black dark:bg-black" />
                )}
                {khungulukhDun > 0 && (
                  <div className="flex w-full justify-between px-6 text-red-400">
                    <div>Хөнгөлөлт</div>
                    <div>{formatNumber(khungulukhDun, 0)}₮</div>
                  </div>
                )}
                {baiguullagiinId === "673d88133987e97992f77c02" && (
                  <>
                    <div className="w-full border border-[#1E1E1E]" />
                    <div className="flex w-full justify-between px-6 ">
                      <div className="text-red-400">Хөнгөлөлт</div>
                      <div className="flex gap-4">
                        Энд дар
                        <Button
                          onClick={() => showKhunglult(2, "fitness")}
                          className="cursor-pointer"
                        >
                          <MdOutlineDiscount className="text-green-400" />
                        </Button>
                        {formatNumber(songogdsonData?.fitnessHungulult, 0)}₮
                      </div>
                    </div>
                  </>
                )}
                {baiguullagiinId === "6115f350b35689cdbf1b9da3" && (
                  <>
                    <div className="w-full border border-[#1E1E1E]" />
                    <div className="flex w-full justify-between px-6 ">
                      <div className="text-red-400">Угаалга хөнгөлөлт/1цаг</div>
                      <div className="flex gap-4">
                        <Button
                          disabled={!songogdsonData?.ugaalgaHungulult}
                          onClick={() => showKhunglult(1, "ugaalga")}
                          className="cursor-pointer"
                        >
                          <MdOutlineDiscount className="text-green-400" />
                        </Button>
                        {formatNumber(songogdsonData?.ugaalgaHungulult, 0)}₮
                      </div>
                    </div>
                    <div className="w-full border border-[#1E1E1E]" />
                    <div className="flex w-full justify-between px-6 ">
                      <div className="text-red-400">
                        Угаалга хөнгөлөлт/24цаг
                      </div>
                      <div className="flex gap-4">
                        <Button
                          disabled={!songogdsonData?.ugaalgaHungulult24}
                          onClick={() => showKhunglult(24, "ugaalga")}
                          className="cursor-pointer"
                        >
                          <MdOutlineDiscount className="text-green-400" />
                        </Button>
                        {formatNumber(songogdsonData?.ugaalgaHungulult24, 0)}₮
                      </div>
                    </div>
                  </>
                )}
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
            {khungulukhDun > 0 && (
              <div
                className={`gap mt-auto flex w-full flex-col items-center justify-center text-white`}
              >
                <button
                  onClick={() =>
                    khungulultKhadgalya(
                      songogdsonData.session_id,
                      songogdsonData.parking_id
                    )
                  }
                  className="my-4 flex items-center justify-center gap-1 rounded-xl border border-green-400 bg-green-800 bg-opacity-70 px-4 py-2 text-base font-bold text-green-400 focus:outline-none"
                >
                  <div>Хөнгөлөх</div>
                </button>
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
          <div className="flex w-full items-center justify-center text-base">
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
              className="p-2"
            >
              <CloseCircleFilled />
            </div>
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
          <div className="flex w-full items-center justify-center text-base">
            <div onClick={onTimeout} className="p-2">
              <CloseCircleFilled />
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center text-lg text-zinc-200">
            Амжилттай төлөгдлөө
          </div>
          {eBarimt && eBarimtTurul === "khuviKhun" && (
            <div className="mx-4 mt-8 flex flex-col items-center justify-center gap-2 rounded-xl bg-[#414143] p-2 py-4">
              <div className="flex w-full justify-between pl-4">
                <div>Сугалааны дугаар</div>
                <div>{eBarimt?.lottery}</div>
              </div>
              <div className="h-[1px] w-full bg-black dark:bg-black" />
              <div className="flex w-full justify-between pl-4">
                <div>Баримтын дүн</div>
                <div>
                  {formatNumber(
                    Number(
                      eBarimt?.amount ? eBarimt?.amount : eBarimt?.totalAmount
                    ),
                    0
                  )}
                  ₮
                </div>
              </div>
            </div>
          )}
          {eBarimt && eBarimtTurul === "baiguullaga" && (
            <div className="mx-4 mt-8 flex flex-col items-center justify-center gap-2 rounded-xl bg-[#414143] p-2 py-4">
              <div className="flex w-full justify-between pl-4">
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
                <div>
                  {formatNumber(
                    Number(
                      eBarimt?.amount ? eBarimt?.amount : eBarimt?.totalAmount
                    ),
                    0
                  )}
                  ₮
                </div>
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
          <img className="h-full w-full" src="/ParkEaseLogoShine.png" alt="" />
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
