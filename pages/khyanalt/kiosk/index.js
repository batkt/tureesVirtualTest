import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  LeftCircleFilled,
  LoadingOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Spin, message } from "antd";
import DugaarKeyboard from "components/pageComponents/kiosk/DugaarKeyboard";
import useUilchluulegchWithQuery from "hooks/useUilchluulegchWithQuery";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "services/auth";
import uilchilgee, { aldaaBarigch, socket } from "services/uilchilgee";
import {
  ebarimtKhelberuud,
  tulburiinKhelberuud,
} from "tools/logic/tulburiinKhelberuud";
import { MdOutlineDiscount } from "react-icons/md";
import moment, { utc } from "moment";
import axios from "axios";
import amjilttaiAnimation from "./amjilttaiAnimation.json";
import QRCode from "react-qr-code";
import formatNumber from "tools/function/formatNumber";
import { modal } from "components/ant/Modal";
import ZuvhunKhunglukhModalContent from "./ZuvhunKhunglukhModalContent";
import ShineDugaarKeyboard from "components/pageComponents/kiosk/ShineKeyboard";
import dynamic from "next/dynamic";
import useJagsaalt from "../../../hooks/useJagsaalt";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const Kiosk = () => {
  const [dugaar, setDugaar] = useState(Array(4).fill(""));
  const [messageApi, contextHolder] = message.useMessage();
  const [register, setRegister] = useState("");
  const [baiguullagaNer, setBaiguullagaNer] = useState();
  const [customerTin, setCustomerTin] = useState();
  const [eBarimtTurul, setEbarimtTurul] = useState("");
  const [drawerOngoikh, setDrawerOngoikh] = useState(false);
  const [songogdsonData, setSongogdsonData] = useState(null);
  const [terminal, setTerminal] = useState();
  const [qpayerTulukh, setQpayerTulukh] = useState(false);
  const [passaarTulukh, setPassaarTulukh] = useState(false);
  const [tulburiinKhelber, setTulburiinKhelber] = useState();
  const [khuleegdejBuiQpay, setKhuleegdejBuiQpay] = useState();
  const [khuleegdejBuiPass, setKhuleegdejBuiPass] = useState();
  const [butsakhGuideDarsan, setButsakhGuideDarsan] = useState(false);
  const [servereesAvsonOdooTsag, setServereesAvsonOdooTsag] = useState();
  const [unshijBaina, setUnshijBaina] = useState(false);
  const [alkham, setAlkham] = useState(0);
  const [eBarimt, setEbarimt] = useState();
  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(30);

  const { token, baiguullaga, barilgiinId, ajiltan } = useAuth();
  const khungulultRef = React.useRef(null);

  const streamQuery = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
      zogsooliinDans: { $exists: true },
    };
  }, [baiguullaga?._id, barilgiinId]);

  const { jagsaalt: parkingJagsaalt, mutate: parkingMutate } = useJagsaalt(
    "/parking",
    streamQuery
  );

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

  const msgNotif = useCallback(
    (content) => {
      messageApi.open({
        content: content,
        style: {
          marginTop: "5rem",
        },
        duration: 3,
      });
    },
    [messageApi]
  );

  function showKhunglult(khungulukhTsag) {
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
          ajiltan={ajiltan}
          token={token}
          ref={khungulultRef}
          zogsool={parkingJagsaalt?.[0]}
          khungulukhTsag={khungulukhTsag}
        />
      ),
      footer,
    });
  }

  useEffect(() => {
    if (khuleegdejBuiQpay) {
      socket().on(`qpay/${baiguullaga._id}/${khuleegdejBuiQpay}`, (qpay) => {
        jinkheneTulburTulyo(
          "kiosk",
          songogdsonData?.session_id,
          songogdsonData?.pay_amount,
          songogdsonData?.plate_number,
          barilgiinId,
          ajiltan?.ner,
          ajiltan?._id
        );
      });
    }
    return () => {
      socket().off(`qpay${khuleegdejBuiQpay}`);
    };
  }, [khuleegdejBuiQpay, baiguullaga]);

  useEffect(() => {
    if (khuleegdejBuiPass) {
      socket().on(`pass/${baiguullaga._id}/${khuleegdejBuiPass}`, (pass) => {
        jinkheneTulburTulyo(
          "kiosk",
          songogdsonData?.session_id,
          songogdsonData?.pay_amount,
          songogdsonData?.plate_number,
          barilgiinId,
          ajiltan?.ner,
          ajiltan?._id
        );
      });
    }
    return () => {
      socket().off(`pass${khuleegdejBuiPass}`);
    };
  }, [khuleegdejBuiPass, baiguullaga]);

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
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else {
      setBaiguullagaNer();
    }
  }, [register]);

  useEffect(() => {
    if (!drawerOngoikh) return;

    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        }

        setMinutes((prevMinutes) => {
          if (prevMinutes > 0) {
            return prevMinutes - 1;
          } else {
            clearInterval(timer);
            onTimeout?.();
            return 0;
          }
        });

        return 59;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [drawerOngoikh]);

  useEffect(() => {
    if (
      (ajiltan?._id === "66384a9061eeda747d01a320" ||
        ajiltan?._id === "6746b7b1e3a4bd05bbac6880" ||
        ajiltan?._id == "67d92062513ec21e26bdb604" ||
        ajiltan?._id == "68357e846653c13643908698") &&
      songogdsonData?.enter_date &&
      !songogdsonData?.fitnessHungulult
    ) {
      const odooTsag = moment(servereesAvsonOdooTsag);

      const hoyrTsagiinDaraa = moment(songogdsonData.enter_date).add(
        2,
        "hours"
      );
      const hoyrTsagiinDataaGarsanEsekh = odooTsag.isAfter(hoyrTsagiinDaraa);
      if (hoyrTsagiinDataaGarsanEsekh) {
        setSongogdsonData((prev) => {
          return {
            ...prev,
            fitnessHungulult:
              ajiltan?._id == "67d92062513ec21e26bdb604" ? 7000 : 4000,
            pay_amount:
              prev?.pay_amount -
              (ajiltan?._id == "67d92062513ec21e26bdb604" ? 7000 : 4000),
          };
        });
      }
    }
    if (
      ajiltan?._id == "68357e846653c13643908698" &&
      songogdsonData?.enter_date &&
      !songogdsonData?.fitnessHungulult24
    ) {
      const odooTsag = moment(servereesAvsonOdooTsag);

      const hoyrTsagiinDaraa = moment(songogdsonData.enter_date).add(
        24,
        "hours"
      );
      const hoyrTsagiinDataaGarsanEsekh = odooTsag.isAfter(hoyrTsagiinDaraa);
      if (hoyrTsagiinDataaGarsanEsekh) {
        setSongogdsonData((prev) => {
          return {
            ...prev,
            fitnessHungulult24: (parkingJagsaalt?.[0]?.undsenUne || 2000) * 24,
            pay_amount:
              prev?.pay_amount - (parkingJagsaalt?.[0]?.undsenUne || 2000) * 24,
          };
        });
      }
    }
    if (ajiltan?._id === "68425acd7611dd8da7e7a7d2") {
      setSongogdsonData((prev) => {
        return {
          ...prev,
          fitnessHungulult: prev?.pay_amount,
        };
      });
    }
  }, [songogdsonData?.enter_date, servereesAvsonOdooTsag, ajiltan?._id]);
  function onTimeout() {
    setDrawerOngoikh(false);
    setSongogdsonData(null);
    setTerminal();
    setTulburiinKhelber();
    setKhuleegdejBuiQpay(null);
    setKhuleegdejBuiPass(null);
    setDugaar(Array(4).fill(""));
    setEbarimtTurul("");
    setEbarimt();
    setBaiguullagaNer();
    setRegister("");
    setMinutes(0);
    setSeconds(59);
    setAlkham(0);
  }

  function qpayAvakh(uilchluugchiinId, barilgiinId, ilgeekhDun) {
    setUnshijBaina(true);
    if (uilchluugchiinId && ilgeekhDun) {
      setKhuleegdejBuiQpay(`${uilchluugchiinId}${ilgeekhDun}`);
      let yavuulakhBody = {
        barilgiinId: barilgiinId,
        dun: ilgeekhDun,
        zakhialgiinDugaar: `${uilchluugchiinId}${ilgeekhDun}`,
        mashiniiDugaar: songogdsonData?.plate_number + "kiosk",
        turul: "kiosk",
        zogsooliinId: parkingJagsaalt?.[0]?._id,
        zogsoolUilchluulegchiinId: uilchluugchiinId,
        tulukhDun: ilgeekhDun,
      };
      if (parkingJagsaalt?.[0]?.zogsooliinDans) {
        yavuulakhBody["dansniiDugaar"] = parkingJagsaalt?.[0]?.zogsooliinDans;
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
          setPassaarTulukh(false);
          setKhuleegdejBuiQpay();
        });
    }
  }

  function passAvakh(uilchluugchiinId, barilgiinId, ilgeekhDun) {
    setUnshijBaina(true);
    if (uilchluugchiinId && ilgeekhDun) {
      setKhuleegdejBuiPass(`${uilchluugchiinId}${ilgeekhDun}`);
      let yavuulakhBody = {
        barilgiinId: barilgiinId,
        dun: ilgeekhDun,
        zakhialgiinDugaar: `${uilchluugchiinId}${ilgeekhDun}`,
      };
      uilchilgee(token)
        .post("/passGargaya", yavuulakhBody)
        .then(({ data }) => {
          //setQpayerTulukh(data);
          setPassaarTulukh(data);
          setUnshijBaina(false);
        })
        .catch((e) => {
          aldaaBarigch(e);
          setUnshijBaina(false);
          setTulburiinKhelber();
          //setQpayerTulukh(false);
          setPassaarTulukh(data);
          setKhuleegdejBuiPass();
        });
    }
  }
  const dugaarRef = useRef(null);
  const shineDugaarRef = useRef(null);
  const autoSelectRef = useRef(null);
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

  useEffect(() => {
    const dugaarBugdBolsn = dugaar.every((dug) => dug !== "");
    if (dugaarBugdBolsn && !drawerOngoikh) {
      setDrawerOngoikh(true);
    }
  }, [dugaar, drawerOngoikh]);

  useEffect(() => {
    if (!drawerOngoikh) return;

    if (!isValidating && uilchluulegchGaralt?.jagsaalt?.length === 0) {
      msgNotif(
        <div className="flex items-center justify-center gap-2 rounded-full font-semibold">
          <div className="text-yellow-500">
            <WarningOutlined style={{ fontSize: "36px" }} size={100} />
          </div>
          <div className="text-4xl">Таны машин бүртгэгдээгүй байна.</div>
        </div>
      );
      setDrawerOngoikh(false);
      setSongogdsonData(null);
      setTulburiinKhelber();
      setKhuleegdejBuiQpay(null);
      setKhuleegdejBuiPass(null);
      setDugaar(Array(4).fill(""));
      setEbarimtTurul("");
      setEbarimt();
      setRegister("");
      setMinutes(3);
      setSeconds(30);
      setAlkham(0);
    }
  }, [drawerOngoikh, isValidating, uilchluulegchGaralt?.jagsaalt, msgNotif]);

  useEffect(() => {
    if (!drawerOngoikh) {
      autoSelectRef.current = null;
      return;
    }
    const negMashin = uilchluulegchGaralt?.jagsaalt?.length === 1;
    const gantsMashin = uilchluulegchGaralt?.jagsaalt?.[0];
    const uniq = gantsMashin?._id || gantsMashin?.mashiniiDugaar;
    if (
      negMashin &&
      alkham === 0 &&
      !songogdsonData &&
      !unshijBaina &&
      uniq &&
      autoSelectRef.current !== uniq
    ) {
      autoSelectRef.current = uniq;
      mashinSongiy(gantsMashin);
    }
  }, [
    alkham,
    drawerOngoikh,
    songogdsonData,
    uilchluulegchGaralt?.jagsaalt,
    unshijBaina,
  ]);

  const mashinSongiy = async (data) => {
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
          if (response.data?.data?.pay_amount > 0) {
            setSongogdsonData(response.data?.data);
            setAlkham(1);
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
            setDrawerOngoikh(false);
            setSongogdsonData(null);
            setTulburiinKhelber();
            setKhuleegdejBuiQpay(null);
            setKhuleegdejBuiPass(null);
            setDugaar(Array(4).fill(""));
            setEbarimtTurul("");
            setEbarimt();
            setRegister("");
            setMinutes(3);
            setSeconds(30);
            setAlkham(0);
          }
        } else {
          setUnshijBaina(false);
        }
      }
    } catch (err) {
      setUnshijBaina(false);
      message.error(err);
    }
  };

  const handleTulburiinKhelberSongolt = async (data) => {
    if (data === "card") {
      setTulburiinKhelber(data);
      setTerminal("waiting");
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
              "kiosk",
              songogdsonData?.session_id,
              songogdsonData?.pay_amount,
              songogdsonData?.plate_number,
              barilgiinId,
              ajiltan?.ner,
              ajiltan?._id
            );
            setTerminal("success");
            setTimeout(() => {
              setTerminal();
            }, 1000);
          } else if (
            data?.status == true &&
            data?.response?.Exception?.ErrorCode === "003"
          ) {
            msgNotif(
              <div className="flex items-center justify-center gap-2 font-semibold">
                <div className="text-red-500">
                  <CloseOutlined style={{ fontSize: "36px" }} size={100} />
                </div>
                <div className="text-4xl">
                  Нэг удаагийн гүйлгээний дүн хүрэхгүй.
                </div>
              </div>
            );
            setTerminal();
          } else if (
            data?.status == true &&
            data?.response?.response_code === "366"
          ) {
            setTerminal("canceled");
            setTimeout(() => {
              setTerminal();
            }, 1000);
          }
        })
        .catch((e) => {
          msgNotif(
            <div className="flex items-center justify-center gap-2 font-semibold">
              <div className="text-red-500">
                <CloseOutlined style={{ fontSize: "36px" }} size={100} />
              </div>
              <div className="text-4xl">
                Пос алдаа гарлаа. Та дахин оролдоно уу.
              </div>
            </div>
          );
          setTerminal();
        });
    }
    if (data === "qpay") {
      setTulburiinKhelber(data);
      qpayAvakh(
        songogdsonData?.session_id,
        barilgiinId,
        songogdsonData?.pay_amount
      );
    }
    if (data === "pass") {
      setTulburiinKhelber(data);
      passAvakh(
        songogdsonData?.session_id,
        barilgiinId,
        songogdsonData?.pay_amount
      );
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
          setMinutes((prev) => {
            return prev + 1;
          });
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
    setTimeout(() => {
      setAlkham(3);
    }, 1500);
  };

  const handleEbarimtAvya = () => {
    const too = register.replace(/[^0-9]/g, "").slice(0, 8);
    const useg = Array.from(register)
      .filter((a) => /[А-Яа-яөӨүҮ]/.test(a))
      .slice(0, 2)
      .join("");

    if (eBarimtTurul !== "khuviKhun") {
      if (
        (too.length == 8 && useg.length == 2) ||
        (too.length == 7 && useg.length == 0)
      ) {
        eBarimtAvya(
          songogdsonData?.session_id,
          register,
          register !== "" ? false : true,
          songogdsonData?.pay_amount,
          customerTin
        );
      }
    } else {
      eBarimtAvya(
        songogdsonData?.session_id,
        register,
        register !== "" ? false : true,
        songogdsonData?.pay_amount,
        null
      );
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      {contextHolder}
      <div className="fixed top-0 z-[9999] flex bg-[#1E1E1E] px-[100px] text-center text-2xl text-[#00D987]">
        Төлбөр төлснөөс хойш{" "}
        {parkingJagsaalt?.find((e) => e?.garakhTsag)?.garakhTsag || 30} минут
        дотор та зогсоолоос гараагүй бол төлбөр нэмэгдэж бодогдохыг анхаарна уу!
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
        className="khuviinDrawer relative bg-transparent text-5xl font-semibold text-gray-200 md:text-xl"
      >
        <div className="relative !h-full !w-full">
          <div className="absolute right-[35vw] top-10">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <div
            className={`absolute left-0 top-5 h-full w-full transition-all duration-300 ${
              alkham === 0 ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div
              onClick={() => {
                setDrawerOngoikh(false);
                setSongogdsonData(null);
                setTerminal();
                setTulburiinKhelber();
                setKhuleegdejBuiQpay(null);
                setKhuleegdejBuiPass(null);
                setDugaar(Array(4).fill(""));
                setEbarimt();
                setAlkham(0);
                setSeconds(30);
                setMinutes(2);
              }}
              className="flex w-full items-center justify-center text-7xl md:text-3xl"
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
              <div className="mt-8 grid w-full grid-cols-2 place-content-center place-items-center gap-8 overflow-y-scroll p-8">
                {uilchluulegchGaralt?.jagsaalt?.map((mur) => {
                  return (
                    <div
                      onClick={() => mashinSongiy(mur)}
                      className="w-fit rounded-xl border-[6px] border-[#414143] px-8 py-6 tracking-wider"
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
                  setPassaarTulukh(false);
                  setKhuleegdejBuiQpay();
                  setKhuleegdejBuiPass();
                } else {
                  setAlkham(0);
                }
              }}
              className={`flex w-full items-center justify-center text-7xl md:text-3xl ${
                butsakhGuideDarsan && "animate-ping"
              }`}
            >
              <LeftCircleFilled />
            </div>

            <div className="mt-8 flex w-full items-center justify-center md:mt-3">
              {!tulburiinKhelber && "Төлбөрийн хэлбэр сонгоно уу."}
              {tulburiinKhelber === "card" && "Картаа уншуулна уу."}
              {tulburiinKhelber === "qpay" && "QR уншуулан төлбөрөө төлнө үү."}
              {tulburiinKhelber === "pass" &&
                "Pass апп-аас төлөн үргэлжлүүлэх дарна уу."}
            </div>
            <div
              className={`my-16 flex w-full items-center justify-${
                baiguullaga?._id === "6646fab6ae3f7ecc2ea5ecd9"
                  ? "center"
                  : "between"
              } px-12 md:my-10`}
            >
              {tulburiinKhelberuud.map((mur) => {
                return baiguullaga?._id === "6646fab6ae3f7ecc2ea5ecd9" &&
                  (mur.key === "card" || mur.key === "pass") ? (
                  ""
                ) : (
                  <div
                    key={mur.key}
                    onClick={() => {
                      if (!tulburiinKhelber) {
                        handleTulburiinKhelberSongolt(mur.ner);
                      } else {
                        butsakhGuide();
                      }
                    }}
                    className={`flex h-[240px] w-[280px] flex-col items-center justify-center gap-4 rounded-xl bg-[#414143] p-4 md:h-[130px] md:w-[130px] md:gap-1 ${
                      tulburiinKhelber &&
                      tulburiinKhelber !== mur.ner &&
                      "opacity-50"
                    }`}
                  >
                    <div className="h-[120px] w-[120px] overflow-hidden md:h-[60px] md:w-[60px]">
                      <img src={mur.icon} alt="" />
                    </div>
                    <div>{mur.label}</div>
                  </div>
                );
              })}
            </div>
            {songogdsonData &&
              (!tulburiinKhelber || tulburiinKhelber === "card") && (
                <div className="relative mx-12 flex flex-col items-center justify-center gap-8 rounded-xl bg-[#414143] p-4 py-8 md:gap-3">
                  <div className="flex w-full justify-between px-6">
                    <div>Улсын дугаар</div>
                    <div>{songogdsonData.plate_number}</div>
                  </div>
                  <div className="w-full border border-[#1E1E1E]" />
                  <div className="flex w-full justify-between px-6">
                    <div>Орсон </div>
                    <div>
                      {moment(songogdsonData.enter_date).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </div>
                  </div>
                  <div className="w-full border border-[#1E1E1E]" />
                  <div className="flex w-full justify-between px-6">
                    <div>Гарсан</div>
                    <div>{moment().format("DD/MM/YYYY HH:mm")}</div>
                  </div>
                  <div className="w-full border border-[#1E1E1E]" />
                  <div className="flex w-full justify-between px-6">
                    <div>Зогссон хугацаа </div>
                    <div>
                      {utc(
                        utc().diff(moment(songogdsonData?.enter_date))
                      ).format("HH:mm")}
                    </div>
                  </div>
                  <div className="w-full border border-[#1E1E1E]" />
                  <div className="flex w-full justify-between px-6 text-red-400">
                    <div>Төлбөр</div>
                    <div>{formatNumber(songogdsonData?.pay_amount, 0)}₮</div>
                  </div>

                  {(ajiltan?._id === "66384a9061eeda747d01a320" ||
                    ajiltan?._id === "6746b7b1e3a4bd05bbac6880" ||
                    ajiltan?._id == "67d92062513ec21e26bdb604" ||
                    ajiltan?._id == "68357e846653c13643908698" ||
                    ajiltan?._id === "68425acd7611dd8da7e7a7d2") && (
                    <>
                      <div className="w-full border border-[#1E1E1E]" />
                      <div className="flex w-full justify-between px-6 ">
                        <div className="text-red-400">Хөнгөлөлт</div>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => showKhunglult()}
                            className="cursor-pointer"
                          >
                            <MdOutlineDiscount className="text-green-400" />
                          </Button>
                          {formatNumber(songogdsonData?.fitnessHungulult, 0)}₮
                        </div>
                      </div>
                    </>
                  )}
                  {ajiltan?._id === "68357e846653c13643908698" && (
                    <>
                      <div className="w-full border border-[#1E1E1E]" />
                      <div className="flex w-full justify-between px-6 ">
                        <div className="text-red-400">Хөнгөлөлт/24</div>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => showKhunglult(24)}
                            className="cursor-pointer"
                          >
                            <MdOutlineDiscount className="text-green-400" />
                          </Button>
                          {formatNumber(songogdsonData?.fitnessHungulult24, 0)}₮
                        </div>
                      </div>
                    </>
                  )}
                  {terminal && (
                    <div className="absolute top-[50%] z-[500] flex h-[100px] w-1/2 items-center justify-center bg-zinc-200">
                      {terminal === "waiting" ? (
                        <div className="flex w-full items-center justify-center gap-8">
                          <div>
                            <Spin />
                          </div>
                          <div className="text-4xl text-[#1E1E1E]">
                            Пос хүлээгдэж байна
                          </div>
                        </div>
                      ) : terminal === "canceled" ? (
                        <div className="flex w-full items-center justify-center gap-8">
                          <div className="text-red-500">
                            <CloseCircleFilled />
                          </div>
                          <div className="text-4xl text-[#1E1E1E]">
                            Пос цуцлагдлаа
                          </div>
                        </div>
                      ) : terminal === "success" ? (
                        <div className="flex w-full items-center justify-center gap-8">
                          <div className="text-green-500">
                            <CheckCircleFilled />
                          </div>
                          <div className="text-4xl text-[#1E1E1E]">
                            Пос амжилттай
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
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
                  <div className="flex items-center justify-center">
                    {passaarTulukh && passaarTulukh?.qr_image && (
                      <QRCode
                        className=" border-8 border-white"
                        value={passaarTulukh?.qr_image}
                      />
                    )}
                  </div>

                  <div className="mx-12 mt-8 flex flex-col items-center justify-center gap-8 rounded-xl bg-[#414143] p-4 py-8">
                    <div className="flex w-full justify-between px-6 text-red-400">
                      <div>Төлбөр:</div>
                      <div>{formatNumber(songogdsonData.pay_amount, 0)}₮</div>
                    </div>
                  </div>
                </>
              )}
          </div>
          <div
            className={`absolute !top-5 left-0 !h-full w-full transition-all duration-300 ${
              alkham === 2 ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-16">
              <div className="text-4xl font-bold">Гүйлгээ амжилттай</div>
              <Lottie animationData={amjilttaiAnimation} />
            </div>
          </div>
          <div
            className={`absolute left-0 top-5 h-full w-full px-3 transition-all duration-300 ${
              alkham === 3 ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div
              onClick={() => {
                setDrawerOngoikh(false);
                setSongogdsonData(null);
                setTerminal();
                setTulburiinKhelber();
                setKhuleegdejBuiQpay(null);
                setKhuleegdejBuiPass(null);
                setDugaar(Array(4).fill(""));
                setEbarimtTurul("");
                setAlkham(0);
                setEbarimt();
                setSeconds(30);
                setMinutes(2);
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
                      eBarimtTurul === mur.ner ? "bg-zinc-700" : "bg-[#414143]"
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
            <div className="mt-8 flex w-full items-center justify-center gap-24  ">
              <ShineDugaarKeyboard
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

            <div className="mt-8 flex items-center justify-center px-12 text-5xl text-zinc-200">
              Амжилттай төлөгдлөө
            </div>
            {eBarimt?.lottery && (
              <div>
                <p className="mt-16 flex w-full items-center justify-center rounded-xl pl-4 text-center text-[24px] text-zinc-200 dark:!text-black">
                  Та и-баримт аппликейшн ашиглаж баримтаа уншуулах эсвэл зургийн
                  дараад боломжтой үедээ уншуулна уу.
                </p>
              </div>
            )}
            {eBarimt && eBarimtTurul === "khuviKhun" && (
              <div className="mt-16 flex flex-col items-center justify-center gap-8 rounded-xl bg-[#414143] p-4 py-8">
                <div className="flex w-full justify-between  pl-4">
                  <div>Сугалааны дугаар</div>
                  <div>{eBarimt?.lottery}</div>
                </div>
                <div className="w-full border border-[#1E1E1E]" />
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
              <div className="mt-16 flex flex-col items-center justify-center gap-8 rounded-xl bg-[#414143] p-4 py-8">
                <div className="flex w-full justify-between  pl-4">
                  <div>ТТД</div>
                  <div>{eBarimt?.registerNo}</div>
                </div>
                <div className="w-full border border-[#1E1E1E]" />
                <div className="flex w-full justify-between pl-4">
                  <div>ТТН</div>
                  <div>{baiguullagaNer?.name}</div>
                </div>
                <div className="w-full border border-[#1E1E1E]" />
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
              <div className="mx-36 mt-16 flex flex-col items-center justify-center gap-3 bg-zinc-200 p-4">
                <QRCode value={eBarimt?.qrData} />
              </div>
            )}
          </div>
        </div>
      </Drawer>
      <div className="flex h-1/3 w-full flex-col items-center justify-center gap-8 md:pt-[100px]">
        <div className="">
          <img
            className="h-[300px] w-[300px]"
            src="/ParkEaseLogoShine.png"
            alt=""
          />
        </div>
        <div className="px-12 text-center text-5xl text-[22px] font-bold text-[#1E1E1E] dark:text-white">
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
      <div className="fixed bottom-[-65vh] left-[-55vh] z-[-1] h-[135vh] w-[135vh] rounded-full bg-[#1E1E1E]" />
    </div>
  );
};

export default Kiosk;
