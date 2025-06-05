import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Drawer, InputNumber, Switch, notification, message, Image } from "antd";
import Zaavar from "components/Zaavar";
import { useAuth } from "services/auth";
import { BsBackspaceFill } from "react-icons/bs";
import formatNumber from "tools/function/formatNumber";
import axios from "axios";
import moment from "moment";
import uilchilgee, { aldaaBarigch, socket, zogsoolUilchilgee } from "services/uilchilgee";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";
import Barcode from 'react-barcode';

export function useThemeValue() {
        const { theme, setTheme } = useTheme();
        const [themeValue, setThemeValue] = useState(false);
        useEffect(() => {
            setThemeValue(theme === "dark");
        }, [theme]);
    return { themeValue, setTheme };
 }

const TogloomKiosk = () => {
    const { t, i18n } = useTranslation();
    const { themeValue, setTheme } = useThemeValue();
    const [tsonkhniiId, setTsonkhniiId] = useState("66ab276bd5a5012b78e05f9e");
    const [drawerOngoikh, setDrawerOngoikh] = useState(false);
    const [minutes, setMinutes] = useState(4);
    const [seconds, setSeconds] = useState(59);
    const [alkham, setAlkham] = useState(0);
    const { token, baiguullaga, baiguullagiinId, barilgiinId, ajiltan } = useAuth();
    const numbers = [1, 2, 3, "Butsakh", 4, 5, 6, 7, 8, 9, 0];
    const [tasalbarTariff, setTasalbarTariff] = useState();
    const [tasalbarDun, setTasalbarDun] = useState();
    const [tasalbarShirkheg, setTasalbarShirkheg] = useState(1);
    const [tulbur, setTulbur] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [khaanbank, setTerminal] = React.useState(false);
    const [khuleegdejBuiQpay, setKhuleegdejBuiQpay] = React.useState();
    const [qpayerTulukh, setQpayerTulukh] = React.useState(false);
    const [eBarimt, setEbarimt] = useState();
    const [tasalbariinGuilgeeId, setTasalbariinGuilgeeId] = useState();
    const [baiguullagaNer, setBaiguullagaNer] = useState();
    const [register, setRegister] = useState("");
    const [barCodes, setBarCodes] = useState([]);
    
    const eBarimtRef = React.useRef(null);
    
    const handlePrint = useReactToPrint({
        content: () => eBarimtRef.current,
      });

    function khaaya() {
        khaalgaNeey(barCodes);
        setAlkham(0);
        setDrawerOngoikh(false);
        setMinutes(4);
        setSeconds(59);
        setTasalbarTariff(0);
        setTasalbarDun(0);
        setTasalbarShirkheg(1);
        setTulbur([]);
        setTerminal(false);
        setKhuleegdejBuiQpay();
        setQpayerTulukh(false);
        setEbarimt();
        setTasalbariinGuilgeeId();
        setBaiguullagaNer();
        setRegister("");
        setBarCodes([]);
    }

    const khaalgaNeey = (barCodes) => {
        zogsoolUilchilgee()
        .get("/userKhadgalakh/" + barCodes + "")
        .then(function (response) {
            if (!!response.message) message.error("/api/userKhadgalakh", response);
        })
        .catch(function (error) {
            message.error("ERROR: /api/userKhadgalakh", error);
        });
    };

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
        // const pocket = tulbur.find((a) => a.turul === "pocket")?.dun;
        // const lend = tulbur.find((a) => a.turul === "lend")?.dun;
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
            // pocket,
            // lend,
            toki,
            khungulult,
        };
    }, [tulbur]);

    const turulruuTooKhiikhFunction = (v) => {
        const index = tulbur.findIndex((a) => a.turul === v);
        if (tasalbarDun > 0) {
            const undsenModel = {
            ognoo: new Date(),
            baiguullagiinId: baiguullaga?._id,
            barilgiinId: barilgiinId,
            burtgesenAjiltaniiId: ajiltan?._id,
            burtgesenAjiltaniiNer: ajiltan?.ner,
            tasalbarTariff: tasalbarTariff, 
            tasalbarDun: tasalbarDun, 
            tasalbarShirkheg: tasalbarShirkheg, 
            };
            if (index !== -1) {
                tulbur.splice(index, 1);
            } 
            else 
            {
                if (tasalbarDun <= 0) {
                    return notification.warn({
                    message: `${tasalbarDun} дүнгээр гүйлгээ хийх боломжгүй`,
                    });
                }
                tulbur.push({ ...undsenModel, turul: v, dun: tasalbarDun });
            }
            setTulbur([...tulbur]);
            setAlkham(v === "khaan" ? 3 : (v === "qpay" ? 2 : 1))
            if (tulbur.find((a) => a.turul === v)?.dun > 0) 
                batalgaajuulaltKhiiya(null, v);
        }
        else
            return notification.warn({ message: `${tasalbarDun} дүнгээр гүйлгээ хийх боломжгүй`, });
    };

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
                setTerminal(false);
            })
            .catch((e) => {
                setTerminal(false);
                setLoading(false);
                message.error(e.message);
            });
        } 
        else if (garaasSongosonTurul === "qpay") {
            qpayTulugdsun === "qpayTulugdsun" ? guilgeeniiTuukhKhadgalya(tulbur, true) : qpayAvakh();
        }
    }

    function checkQpay() {
        if (khuleegdejBuiQpay) {
            socket().on(`qpay/${baiguullaga._id}/${khuleegdejBuiQpay}`, (qpay) => {
                batalgaajuulaltKhiiya("qpayTulugdsun", "qpay");
                setAlkham(4);
                setQpayerTulukh("Tulugdsun");
                message.success("Qpay Амжилттай төлөгдлөө");
            });
        }
        return () => {
            socket().off(`qpay${khuleegdejBuiQpay}`);
        };
    }

    useEffect(() => {
    if (khuleegdejBuiQpay) {
        socket().on(`qpay/${baiguullaga._id}/${khuleegdejBuiQpay}`, (qpay) => {
        if (qpayerTulukh !== "Tulugdsun") {
            message.success("Qpay Амжилттай төлөгдлөө");
            batalgaajuulaltKhiiya("qpayTulugdsun", "qpay");
            setQpayerTulukh("Tulugdsun");
            setAlkham(4);
        }
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
        const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
        const id = timestamp + 'aaaaaaaaaaaaaaaa'.replace(/[a]/g, _ => (Math.random() * 16 | 0).toString(16)).toLowerCase();
        setKhuleegdejBuiQpay(`${id}${ilgeekhDun}`);
        uilchilgee(token)
          .post("/qpayGargaya", {
            barilgiinId: barilgiinId,
            dun: ilgeekhDun,
            zakhialgiinDugaar: `${id}${ilgeekhDun}`,
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

    function batalgaajuulya(turul, val) {
        if (turul === "khaan") {
            tulbur.find((a) => a.turul === "khaan").khariu = val;
            setAlkham(4);
            guilgeeniiTuukhKhadgalya(tulbur, false);
            setTulbur(tulbur);
        }
    }

    function guilgeeniiTuukhKhadgalya(tulbur, qpayEsekh) {
        tulbur.forEach((a) => {
            a.ognoo = new Date();
            a.baiguullagiinId = baiguullaga?._id;
            a.barilgiinId = barilgiinId,
            a.burtgesenAjiltaniiId = ajiltan._id;
            a.burtgesenAjiltaniiNer = ajiltan.ner;
            a.barCodes = barCodes;
        });
        const tulukhGejBuiNiitDun = tulbur.reduce((a, b) => a + b?.dun, 0);
        if (tulukhGejBuiNiitDun !== tasalbarDun) {
            setLoading(false);
            return notification.warn({
            message: "Төлбөр зөрүүтэй байна!",
            duration: 1,
            });
        }
        //Tuhain tulburiin dun ni too bolon 0 ees ih baih yostoi
        const yavuulakhTulbur = tulbur.filter((a) => a.dun && a.dun > 0);
        uilchilgee(token)
            .post("/tasalbariinTulburTulye", { tulbur: yavuulakhTulbur, })
            .then(({ data }) => {
                if (!!data) {
                    setTasalbariinGuilgeeId(data);
                    setLoading(false);
                    message.success("Төлбөр амжилттай хадгалагдлаа");
                }
                if (!!qpayEsekh && qpayEsekh === true) {
                    setQpayerTulukh("Tulugdsun");
                }
            })
            .catch(aldaaBarigch);
    }
    
    const handleUrgeljluulekh = () => {
        uilchilgee(token).get("/tasalbar", { baiguullagiinId: baiguullaga?._id, barilgiinId: barilgiinId})
        .then(({ data }) => {
            if(!!data?.jagsaalt && data?.jagsaalt.length > 0)
            {
                setTasalbarTariff(data?.jagsaalt[0].tasalbarTariff);
                setTasalbarDun(data?.jagsaalt[0].tasalbarTariff * tasalbarShirkheg);
            }
        });
        setDrawerOngoikh(true);
        setMinutes(4);
        setSeconds(59);
    };

    useEffect(() => {
        if(alkham === 6 && !!eBarimt)
        {
            khaaya();
            handlePrint();
        }
    }, [eBarimt]);

    useEffect(() => {
        setTsonkhniiId("66ab276bd5a5012b78e05f9e")
        if (drawerOngoikh) {
          const timer = setInterval(() => {
            setSeconds((prevSeconds) => {
              if (prevSeconds > 0) {
                return prevSeconds - 1;
              } else {
                if (minutes > 0) {
                  setMinutes((prevMinutes) => prevMinutes - 1);
                  return 59;
                } else {
                  clearInterval(timer);
                  if (onTimeout && typeof onTimeout === "function") {
                    onTimeout();
                  }
                  return 0;
                }
              }
            });
          }, 1000);
          return () => clearInterval(timer);
        }
    }, [minutes, drawerOngoikh]);

    function onTimeout() {
        setDrawerOngoikh(false);
        setMinutes(0);
        setSeconds(59);
        setAlkham(0);
    }

    useEffect(() => {
        setTasalbarDun(tasalbarShirkheg * tasalbarTariff);
    }, [tasalbarDun, tasalbarShirkheg, barCodes]);

    const decrementShirkheg = (val) => {
        if(val > 0)
            setTasalbarShirkheg(val - 1);
    }

    const incrementShirkheg = (val) => {
        setTasalbarShirkheg(val + 1);
    }

    const eBarimtAvya = (
        id,
        customer_no,
        individual,
        paid_amount
        ) => {
        uilchilgee(token)
            .post("/v1/tasalbarEbarimtAvya", {
            id,
            customer_no,
            individual,
            paid_amount,
            })
            .then(({ data }) => {
                if (!!data) {
                    setEbarimt(data.data);
                    setMinutes((prev) => {
                    return prev + 1;
                    });
                }
            })
            .catch((err) => {
            aldaaBarigch(err);
        });
    };

    useEffect(() => {
        if (register.length > 6) {
            uilchilgee()
            .get(`/tatvaraasBaiguullagaAvya/${register}`)
            .then(({ data }) => {
                if (data) {
                setBaiguullagaNer(data);
                }
            })
            .catch((e) => {
                aldaaBarigch(e);
            });
        } else {
            setBaiguullagaNer();
        }
    }, [register]);

    const normalize = (input) => {
        const too = input.replace(/[^0-9]/g, "").slice(0, 8);
        const useg = Array.from(input)
            .filter((a) => /[А-Яа-яөӨүҮ]/.test(a))
            .slice(0, 2)
            .join("");
        return `${useg}${too}`.toUpperCase();
    };

    const handleButtonClick = (num) => {
        if (num !== "Butsakh") {
            if (register.length < 10) {
                setRegister((prevDugaar) => normalize(prevDugaar + num));
            }
            } else {
            if (register.length > 0) {
                setRegister((prevDugaar) => normalize(prevDugaar.slice(0, -1)));
            }
        }
    };

    const handleTasalbariinBarCode = () => {
        barCodes = [];
        setBarCodes([])
        if(!!tasalbarShirkheg && tasalbarShirkheg > 0)
            for(var i = 0; i < tasalbarShirkheg; i++)
            {
                const nowDate = new Date();
                const year = nowDate.getFullYear();
                const month = nowDate.getMonth() + 1;
                const day = nowDate.getDate();
                const hours = nowDate.getHours();
                const minutes = nowDate.getMinutes();
                const seconds = nowDate.getSeconds();
                const value = ((year-2000)*12*31 + (month -1)*31 + (day-1))*(24*60*60) + hours* 60 *60 + minutes*60 + seconds + i;
                barCodes.push(value);
            }
        setBarCodes(barCodes);   
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#1DB771] dark:bg-gray-800 dark:text-white">
            <div className="fixed right-10 top-6 flex w-10 gap-2 transition-all hover:scale-105">
            {i18n.language === "en" ? (
                <img
                onClick={() => {
                    i18n.changeLanguage("mn");
                    window.localStorage.setItem("Localelanguage", "mn");
                }}
                className={`w-full cursor-pointer object-contain transition-all`}
                src="/MN.png"
                />
            ) : (
                <img
                onClick={() => {
                    i18n.changeLanguage("en");
                    window.localStorage.setItem("Localelanguage", "en");
                }}
                className={`w-full cursor-pointer object-contain transition-all`}
                src="/UK.png"
                />
            )}
            </div>
            <div className="flex justify-items-stretch items-stretch w-full h-1/2">
                <div className="justify-self-center self-end text-7xl text-center text-[#FFFFFF] pl-32 pr-32">
                    {t("Цонжин цогцолбороор зочилж Монгол орны түүх, уламжлалтай танилцаарай.")}
                </div>    
            </div>
            <div className="flex justify-center gap-8 text-5xl mt-36 w-full h-1/2">
                <button
                    onClick={handleUrgeljluulekh}
                    className="mx-2 flex-center rounded-80 bg-[#FFFFFF] py-10 dark:bg-black h-1/3">
                    <div className="text-[#1DB771] font-bold dark:text-white p-5">{t("Тасалбар авах")}</div>
                </button>
            </div>
            <Drawer
                placement="bottom"
                open={drawerOngoikh}
                height={"78vh"}
                closable={false}
                maskClosable={false}
                className="togloomDrawer relative bg-transparent text-5xl font-semibold text-gray-200 md:text-xl"
            >
                <div className="w-full">
                    <div className="absolute left-[15vw] top-5 font-bold text-black text-5xl">
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </div>
                    <div className={`absolute top-0 left-0 h-full w-full transition-all duration-300 ${alkham === 0 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                        {tsonkhniiId && <div className="absolute right-[15vw] top-5 hidden items-center justify-center md:flex">
                            <Zaavar token={token} id={tsonkhniiId}/>
                        </div>}
                        <div className={`flex top-0 justify-center transition-all duration-300`}>
                            <button
                                onClick={() => {
                                    setDrawerOngoikh(false);
                                    setAlkham(0);
                                    setSeconds(59);
                                    setMinutes(4);
                                    setTasalbarShirkheg(1);
                                }}
                                className="flex togloomKhaakh items-center justify-center"
                                >
                                <img className="h-16" src="/close.png" />
                            </button>
                        </div>
                        <div className="flex mt-36 justify-center">
                            <img className="w-[386px] mt-10" src="/ticket.png" />
                        </div>
                        <div className="flex justify-center mt-2 font-bold text-[#1DB771] text-8xl">
                            {formatNumber(tasalbarDun, 2)}₮
                        </div>
                        <div className="flex justify-center mt-20 font-bold text-black text-6xl dark:text-pink-600 leading-[34px]">
                            <button className="flex items-stretch justify-center mr-12 w-32 h-28 rounded-45 border-5 border-[#1DB771]" onClick={() => { decrementShirkheg(tasalbarShirkheg) }} >
                                <img className="w-8 h-8 self-center" src="/minus2.png"/>    
                            </button>
                            <InputNumber className="w-32 antdInputTextCenter text-6xl border-none hover:border-[#00000]" controls={false} value={tasalbarShirkheg} onChange={(v) => setTasalbarShirkheg(v)} />
                            <button className="flex items-stretch justify-center ml-12 w-32 h-28 rounded-45 border-5 border-[#1DB771] bg-[#1DB771]" onClick={() => { incrementShirkheg(tasalbarShirkheg) }} >
                                <img className="w-8 h-8 self-center" src="/plus1.png"/>    
                            </button>
                        </div>
                        <div className="flex justify-center mt-20">
                            <button
                                className="flex h-[151px] w-[449px] items-center justify-center gap-4 rounded-3xl bg-[#1DB771] px-4 py-2 text-5xl font-bold text-white focus:outline-none"
                                onClick={() => {
                                    setAlkham(1);
                                    handleTasalbariinBarCode();
                                }}>
                                <div className="pl-10 pr-10">{t("Төлөх")}</div>
                                <div className="mt-2 font-[800]">
                                    <img src="/VectorContiune.png" />
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className={`absolute top-0 left-0 h-full w-full transition-all duration-300 ${alkham === 1 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                        {tsonkhniiId && <div className="absolute right-[15vw] top-5 hidden items-center justify-center md:flex">
                            <Zaavar token={token} id={tsonkhniiId}/>
                        </div>}
                        <div className={`flex top-0 justify-center transition-all duration-300`}>
                            <button
                                onClick={() => {
                                    setAlkham(0);
                                }}
                                className="flex togloomKhaakh items-center justify-center"
                                >
                                <img className="h-16" src="/Vector.png" />
                            </button>
                        </div>            
                        <div className="flex mt-16 justify-center font-bold text-black text-6xl">
                            {t("Төлбөрийн аргыг сонгоно уу")}
                        </div>
                        <div className="flex mt-16 justify-center">
                            <button
                                onClick={() => {
                                    turulruuTooKhiikhFunction("khaan")
                                }}
                                className={`flex relative cursor-pointer shadow-xl mr-10 togloomKhaakh45 rounded-3xl bg-black; items-center justify-center hover:scale-110 dark:bg-gray-700`}>
                                <img className="fixed mb-5" src="/creditCards.png" />
                                <div className="self-end mb-5 mt-20 font-bold text-black text-4xl">
                                    {t("Карт")}
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    turulruuTooKhiikhFunction("qpay");
                                }}
                                className="flex relative cursor-pointer shadow-xl togloomKhaakh45 rounded-3xl bg-black; items-center justify-center hover:scale-110 dark:bg-gray-700"
                                >
                                <img className="fixed mb-5" style={{width: "120px", height: "120px"}} src="/Rectangle56.png" />
                                <div className="self-end mb-5 mt-20 font-bold text-black text-4xl">
                                    Qpay
                                </div>
                            </button>
                            <button className="flex cursor-not-allowed ml-10 togloomKhaakh45 rounded-3xl bg-black; items-center justify-center">
                                <img className="fixed mb-5" style={{width: "120px", height: "120px"}} src="/Rectangle81.png" />
                                <div className="self-end mb-5 mt-20 font-bold text-black text-4xl">
                                    Pass
                                </div>
                            </button>
                        </div>
                        <div className="flex mt-10 justify-center">
                            <button className="flex cursor-not-allowed mr-10 togloomKhaakh45 rounded-3xl bg-black; items-center justify-center">
                                <img className="fixed mb-5" style={{width: "120px", height: "120px"}} src="/SocialPay.png" />
                                <div className="self-end mb-5 mt-20 font-bold text-black text-4xl">
                                    Social pay
                                </div>
                            </button>
                            <button className="flex cursor-not-allowed togloomKhaakh45 rounded-3xl bg-white; items-center justify-center">
                                <img className="fixed mb-5" style={{width: "120px", height: "120px", borderRadius: "25px"}} src="/tokiPNG.png" />
                                <div className="self-end mb-5 mt-20 font-bold text-black text-4xl">
                                    {t("Токи")}
                                </div>
                            </button>
                            <button className="flex ml-10 bg-white togloomKhaakhNone"></button>
                        </div>
                        <div className="flex justify-center mt-20 font-bold text-[#1DB771] text-8xl">
                            {formatNumber(tasalbarDun, 2)}₮   
                        </div>
                        {/* <div className="flex justify-center mt-10">
                            <button
                                className="flex h-[110px] w-[350px] items-center justify-center gap-4 rounded-3xl bg-[#1DB771] px-4 py-2 text-4xl font-bold text-white focus:outline-none"
                                onClick={() => {
                                    setAlkham(value.khaan > 0 ? 3 : 2);
                                    loading ? null : batalgaajuulaltKhiiya(null, value.khaan > 0 ? "khaan" : "qpay")
                                }}>
                                <div>{t("Үргэлжлүүлэх")}</div>
                                <div className="mt-2 font-[800]">
                                    <img src="/VectorContiune.png" />
                                </div>
                            </button>
                        </div> */}
                    </div>
                    <div className={`absolute top-0 left-0 h-full w-full transition-all duration-300 ${alkham === 2 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                        {tsonkhniiId && <div className="absolute right-[15vw] top-5 hidden items-center justify-center md:flex">
                            <Zaavar token={token} id={tsonkhniiId}/>
                        </div>}
                        <div className={`flex top-0 justify-center transition-all duration-300`}>
                            <button
                                onClick={() => {
                                    setAlkham(1);
                                }}
                                className="flex togloomKhaakh items-center justify-center"
                                >
                                <img className="h-16" src="/Vector.png" />
                            </button>
                        </div>            
                        <div className="flex mt-16 justify-center font-bold text-black text-6xl">
                            {t("QR код уншуулах")}
                        </div>
                        <div className="flex w-full mt-16 justify-center">
                            <div className="bg-[#E9E9E9] rounded-3xl h-[450px] w-[450px]">
                                {/* <img className="mb-5 p-5 w-full" src="/qpayQRCode.png" /> */}
                                <img className="mb-5 p-5 w-full" src={`data:image/png;base64,${qpayerTulukh?.qr_image}`} />
                            </div>
                        </div>
                        <div className="flex justify-center mt-16 font-bold text-[#1DB771] text-8xl">
                            {formatNumber(tasalbarDun, 2)}₮           
                        </div>
                        <div className="flex justify-center mt-16">
                            <button
                                className="flex h-[151px] w-[450px] items-center justify-center gap-4 rounded-3xl bg-[#1DB771] px-4 py-2 text-5xl font-bold text-white focus:outline-none"
                                onClick={() => {
                                    checkQpay();
                                }}>
                                <div className="pl-10 pr-10">{t("Шалгах")}</div>
                                <div className="mt-2 font-[800]">
                                    <img src="/VectorContiune.png" />
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className={`absolute top-0 left-0 h-full w-full transition-all duration-300 ${alkham === 3 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                        {tsonkhniiId && <div className="absolute right-[15vw] top-5 hidden items-center justify-center md:flex">
                            <Zaavar token={token} id={tsonkhniiId}/>
                        </div>}
                        <div className={`flex top-0 justify-center transition-all duration-300`}>
                            <button
                                onClick={() => {
                                    setAlkham(1);
                                }}
                                className="flex togloomKhaakh items-center justify-center"
                                >
                                <img className="h-16" src="/Vector.png" />
                            </button>
                        </div>            
                        <div className="flex mt-16 justify-center font-bold text-black text-6xl">
                            {t("Картаа оруулна уу.")}
                        </div>
                        <div className="flex mt-10 justify-center">
                            <div className="flex items-stretch">
                                <div className="fixed self-center justify-center ml-10">
                                    <div className="rounded-full bg-[#1DB771]">
                                        <img className="p-6 rounded-full h-32 w-32" src="/checkIcon.png" />
                                    </div>
                                </div> 
                            </div>
                            <img src="/insertCardPOS.png" />
                        </div>
                        <div className="flex justify-center mt-2 font-bold text-[#1DB771] text-8xl">
                            {formatNumber(tasalbarDun, 2)}₮           
                        </div>
                    </div>
                    <div className={`absolute top-0 left-0 h-full w-full transition-all duration-300 ${alkham === 4 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                        {tsonkhniiId && <div className="absolute right-[15vw] top-5 hidden items-center justify-center md:flex">
                            <Zaavar token={token} id={tsonkhniiId}/>
                        </div>}
                        <div className={`flex top-0 justify-center transition-all duration-300`}>
                            <button
                                onClick={() => {
                                    setAlkham(1);
                                }}
                                className="flex togloomKhaakh items-center justify-center"
                                >
                                <img className="h-16" src="/Vector.png" />
                            </button>
                        </div>            
                        <div className="flex mt-16 justify-center font-bold text-black text-6xl">
                            {t("Баримтын төрлийг сонгоно уу")}
                        </div>
                        <div className="flex mt-10 justify-center">
                            <button
                                onClick={() => {
                                    setAlkham(5);
                                    eBarimtAvya(tasalbariinGuilgeeId, "", true, tasalbarDun);
                                }}
                                className="flex mr-20 h-[348px] w-[256px] rounded-45 bg-[#1DB771] items-center justify-center"
                                >
                                <img className="fixed self-center" src="/User.png" />
                                <div className="self-end mb-6 text-4xl font-bold text-white">
                                    {t("Хувь хүн")}
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setAlkham(6);
                                }}
                                className="flex ml-20 h-[348px] w-[256px] rounded-45 bg-[#1DB771] items-center justify-center"
                                >
                                <img className="fixed self-center" src="/Company.png" />
                                <div className="self-end mb-6 text-4xl font-bold text-white">
                                    {t("Байгууллага")}
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className={`absolute top-0 left-0 h-full w-full transition-all duration-300 ${alkham === 5 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                        {tsonkhniiId && <div className="absolute right-[15vw] top-5 hidden items-center justify-center md:flex">
                            <Zaavar token={token} id={tsonkhniiId}/>
                        </div>}
                        <div className={`flex top-0 justify-center transition-all duration-300`}>
                            <button
                                onClick={() => {
                                    setAlkham(4);
                                }}
                                className="flex togloomKhaakh items-center justify-center"
                                >
                                <img className="h-16" src="/Vector.png" />
                            </button>
                        </div>            
                        <div className="flex mt-20 justify-center font-bold text-black text-6xl">
                            {t("Амжилттай төлсөн")}
                        </div>
                        <div className="flex w-full mt-16 justify-center">
                            {/* <div className="bg-[#E9E9E9] rounded-45 h-[450px] w-[450px]">
                                <img className="mb-5 p-10 w-full" src="/qpayQRCode.png" />
                            </div> */}
                            {eBarimt?.qrData && (
                            <div className="bg-[#E9E9E9] rounded-45 h-[450px] w-[450px]">
                                <QRCode className="mb-5 p-10 w-full h-full" value={eBarimt?.qrData} />
                            </div>
                            )}
                        </div>
                        <div className="flex w-full mt-10 justify-center">
                            <div className="rounded-3xl w-full bg-[#1DB771] font-bold text-black text-4xl p-10 ml-20 mr-20">
                                <div className="border-b-2 border-[#000000] mb-5 pb-5">
                                    <div className="flex fixed justify-center">
                                        {t("Сугалааны дугаар")}
                                    </div>
                                    <div className="flex justify-end">
                                        {/* {t("QH 20649522")}  */}
                                        {eBarimt?.lottery}
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <div className="flex fixed justify-center">
                                        {t("Баримтын дүн")} 
                                    </div>
                                    <div className="flex justify-end">
                                        {formatNumber(tasalbarDun, 2)}₮
                                    </div>
                                </div>
                            </div>     
                        </div>
                        <div className="flex justify-center mt-10">
                            <button
                                className="flex h-[151px] w-[450px] items-center justify-center gap-4 rounded-45 bg-[#1DB771] px-4 py-2 text-5xl font-bold text-white focus:outline-none"
                                onClick={() => {  khaaya(); handlePrint(); }}>
                                <div className="pl-10 pr-10">{t("Хэвлэх")}</div>
                                <div className="mt-2 font-[800]">
                                    <img src="/VectorContiune.png" />
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className={`absolute top-0 left-0 h-full w-full transition-all duration-300 overflow-y-scroll ${alkham === 6 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                        {tsonkhniiId && <div className="absolute right-[15vw] top-5 hidden items-center justify-center md:flex">
                            <Zaavar token={token} id={tsonkhniiId}/>
                        </div>}            
                        <div className={`flex top-0 justify-center transition-all duration-300`}>
                            <button
                                onClick={() => {
                                    setAlkham(4);
                                }}
                                className="flex togloomKhaakh items-center justify-center"
                                >
                                <img className="h-16" src="/Vector.png" />
                            </button>
                        </div>            
                        <div className="flex mt-16 justify-center font-bold text-black text-5xl">
                            {t("Байгууллагын регистр оруулна уу")}
                        </div>
                        <div className="flex mt-24 justify-center font-bold text-black text-5xl">
                            {/* {t("Зэв ТАБС ХХК")} */}
                            {baiguullagaNer?.name}
                        </div>
                        <div className="flex mt-10 justify-center">
                            <input className="h-[120px] w-[537px] text-center rounded-3xl bg-[#1DB771] font-bold text-white text-6xl" 
                                type="text" value={register} onChange={(e) => setRegister(e.target.value)} maxLength={7}/>
                        </div>
                        <div className="flex mt-5 justify-center">
                            <div className="grid grid-cols-4 place-items-center gap-1 pt-4 text-5xl font-bold">
                                {numbers.map((num, index) => (
                                    <div
                                    key={index}
                                    className={`col-span-1 flex items-center justify-center rounded-xl cursor-pointer ${
                                        num === "Butsakh"
                                        ? "row-span-2 h-full w-[130px] bg-[#EB3223] bg-opacity-20 text-red-500"
                                        : "h-[130px] w-[130px] bg-[#1DB771]"
                                    }`}
                                    onClick={() => handleButtonClick(num)}>
                                    {num === "Butsakh" ? <BsBackspaceFill /> : num}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center mt-10">
                            <button
                                className="flex h-[151px] w-[450px] items-center justify-center gap-4 rounded-45 bg-[#1DB771] px-4 py-2 text-5xl font-bold text-white focus:outline-none"
                                onClick={() => {
                                    eBarimtAvya(tasalbariinGuilgeeId, register, false, tasalbarDun);
                                }}>
                                <div className="pl-10 pr-10">{t("Хэвлэх")}</div>
                                <div className="mt-2 font-[800]">
                                    <img src="/VectorContiune.png" />
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className={`absolute top-0 left-0 h-full w-full transition-all duration-300 ${alkham === 7 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                        {tsonkhniiId && <div className="absolute right-[15vw] top-5 hidden items-center justify-center md:flex">
                            <Zaavar token={token} id={tsonkhniiId}/>
                        </div>}
                        <div className={`flex top-0 justify-center transition-all duration-300`}>
                            <button
                                onClick={() => {
                                    setAlkham(1);
                                }}
                                className="flex togloomKhaakh items-center justify-center"
                                >
                                <img className="h-16" src="/Vector.png" />
                            </button>
                        </div>            
                        <div className="flex mt-20 justify-center">
                            <img className="mt-20" src="/transactionSuccessful.png" />
                        </div>
                        <div className="flex justify-center mt-24 font-bold text-black text-6xl">
                            {t("Гүйлгээ амжилттай")}
                        </div>
                    </div>
                    <div className={`absolute top-0 left-0 h-full w-full transition-all duration-300 ${alkham === 8 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                        {tsonkhniiId && <div className="absolute right-[15vw] top-5 hidden items-center justify-center md:flex">
                            <Zaavar token={token} id={tsonkhniiId}/>
                        </div>}
                        <div className={`flex top-0 justify-center transition-all duration-300`}>
                            <button
                                onClick={() => {
                                    setAlkham(1);
                                }}
                                className="flex togloomKhaakh items-center justify-center"
                                >
                                <img className="h-16" src="/Vector.png" />
                            </button>
                        </div>            
                        <div className="flex mt-20 justify-center">
                            <img className="mt-20" src="/transactionFailed.png" />
                        </div>
                        <div className="flex justify-center mt-24 font-bold text-black text-6xl">
                            {t("Гүйлгээ амжилтгүй")}
                        </div>
                    </div>
                </div>
            </Drawer>    
            
            <div className="fixed w-full bottom-0 mb-10 mr-10">
                <div className="flex w-full justify-center gap-8 md:pt-[100px]">
                    <Switch
                        checked={themeValue}
                        onClick={() => setTheme(themeValue ? "green" : "dark")}
                        className="dark-mode-switcher"
                        checkedChildren="Dark"
                        unCheckedChildren="Light"
                    >    
                    </Switch>
                </div>
            </div>
            {eBarimt && alkham === 5 && (
            <div className="hidden">
                <div id="testaaa" className="p-2" style={{ minWidth: "20rem" }} ref={eBarimtRef}>
                    <table className="w-full">
                        <colgroup>
                            <col className="w-1/2" />
                            <col className="w-1/2" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td colSpan={2} className="text-center font-bold text-black text-2xl">
                                    {t("Амжилттай төлсөн")}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="text-center">
                                    {eBarimt?.qrData && (
                                    <div className="bg-[#E9E9E9] rounded-45">
                                        <QRCode className="mb-5 p-10 w-full h-full" value={eBarimt?.qrData} />
                                    </div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-bold text-black">
                                    {t("Сугалааны дугаар")}
                                </td>
                                <td className="font-bold text-black text-right">
                                    {eBarimt?.lottery}
                                </td>
                            </tr>
                            <tr>
                                <td className="border-t-2 border-black font-bold text-black">
                                    {t("Баримтын дүн")}
                                </td>
                                <td className="border-t-2 border-black font-bold text-black text-right">
                                    {formatNumber(tasalbarDun, 2)}₮
                                </td>
                            </tr>
                            {barCodes?.map((mur, index) => {
                                index++
                                return (
                                    <tr>
                                        <td colSpan={2} className="pagebreak text-center border-dashed border-b-4 border-black">
                                            <div className="text-5xl font-bold text-black m-5">
                                                {index}
                                            </div>
                                            <div className="flex w-full items-center justify-center mb-20">
                                                <Barcode value={mur}/>
                                            </div>
                                        </td>
                                    </tr>  
                                );
                            })}
                        </tbody>
                    </table>    
                </div>
            </div>
            )}
            {eBarimt && alkham === 6 && (
            <div className="hidden"> 
                <div className="p-2" style={{ minWidth: "20rem" }} ref={eBarimtRef}>
                    <table className="w-full">
                        <colgroup>
                            <col className="w-1/2" />
                            <col className="w-1/2" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td colSpan={2} className="text-center font-bold text-black text-2xl">
                                    {t("Амжилттай төлсөн")}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-bold text-black">
                                    {t("Байгууллага")}
                                </td>
                                <td className="font-bold text-black text-right">
                                    {baiguullagaNer?.name}
                                </td>
                            </tr>
                            <tr>
                                <td className="border-t-2 border-black font-bold text-black">
                                    {t("Регистр")}
                                </td>
                                <td className="border-t-2 border-black font-bold text-black text-right">
                                    {register}
                                </td>
                            </tr>
                            <tr>
                                <td className="border-t-2 border-black font-bold text-black">
                                    {t("Баримтын дүн")}
                                </td>
                                <td className="border-t-2 border-black font-bold text-black text-right">
                                    {formatNumber(tasalbarDun, 2)}₮
                                </td>
                            </tr>
                            {barCodes?.map((mur, index) => {
                                index++
                                return (
                                    <tr>
                                        <td colSpan={2} className="pagebreak text-center border-dashed border-b-4 border-black">
                                            <div className="text-5xl font-bold text-black m-5">
                                                {index}
                                            </div>
                                            <div className="flex w-full items-center justify-center mb-20">
                                                <Barcode value={mur}/>
                                            </div>
                                        </td>
                                    </tr>  
                                );
                            })}
                        </tbody>
                    </table>    
                </div>
            </div>
            )}
        </div>
    );
};
export default TogloomKiosk