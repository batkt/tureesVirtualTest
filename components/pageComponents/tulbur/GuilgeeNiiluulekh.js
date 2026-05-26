import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import {
  Button,
  Divider,
  Dropdown,
  Input,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Switch,
  Tooltip,
} from "antd";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import { formatter, parser } from "tools/function/inputFormatter";
import {
  CloseCircleOutlined,
  CloseOutlined,
  FormOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import getListMethod from "../../../tools/function/crud/getListMethod";
import { t } from "i18next";

var timeout = null;

function guilgeeBurduulya(gereenuud, dans, guilgee) {
  let baritsaa = [];
  let undsenGuilgee = [];
  let aldaa = [];
  gereenuud.forEach((mur) => {
    if ((parseFloat(mur.tureesiinTulbur) || 0) > 0 || (parseFloat(mur.tulsunAldangi) || 0) > 0) {
      let guilgeeniiMur = {
        turul: "bank",
        tulsunDun: parseFloat(mur.tureesiinTulbur) || 0,
        guilgeeniiId: guilgee._id,
        gereeniiId: mur._id,
        dansniiDugaar: guilgee.dansniiDugaar,
        tulukhAldangi: mur.aldangiinUldegdel,
        tulsunAldangi: parseFloat(mur.tulsunAldangi) || 0,
        avlaguud:
          mur.avlaguud ||
          (() => {
            let remainingPayment = mur.tureesiinTulbur || 0;
            const currentAllocations = [];
            mur.sarUldegdel?.forEach((monthDebt) => {
              let allocate = Math.min(remainingPayment, monthDebt.debt);
              if (allocate < 0) allocate = 0;
              remainingPayment -= allocate;
              if (allocate > 0) {
                currentAllocations.push({
                  tulukhDun: monthDebt.debt,
                  tulsunDun: allocate,
                  ognoo: monthDebt.ognoo,
                  turul: monthDebt.turul,
                });
              }
            });
            return currentAllocations;
          })(),
        talbainId: mur.talbainIdnuud && mur.talbainIdnuud[0],
        talbainDugaar: mur.talbainDugaar,
        register: mur.register,
        gereeniiDugaar: mur.gereeniiDugaar,
        baiguullagiinId: mur.baiguullagiinId,
        barilgiinId: mur.barilgiinId,
        bankniiGuilgeeniiDun:
          dans.bank === "tdb"
            ? guilgee.Amt
            : guilgee.amount || guilgee.tranAmount,
      };

      switch (dans.bank) {
        case "tdb":
          guilgeeniiMur.ognoo = guilgee.TxDt;
          guilgeeniiMur.tulsunDans = guilgee.CtAcntOrg;
          break;
        case "khanbank":
        case "bogd":
          guilgeeniiMur.ognoo = guilgee.tranDate;
          guilgeeniiMur.tulsunDans = guilgee.relatedAccount;
          break;
        case "golomt":
          guilgeeniiMur.ognoo = guilgee.tranDate;
          guilgeeniiMur.tulsunDans = guilgee.accNum;
          break;
        default:
          aldaa.push(
            `${mur.talbainDugaar} талбайн холбох гүйлгээний данс тодорхоогүй байна`
          );
          break;
      }
      undsenGuilgee.push(guilgeeniiMur);
    }
    if ((parseFloat(mur.baritsaaTulbur) || 0) > 0) {
      let baritsaaniiMur = {
        gereeniiId: mur._id,
        guilgeeniiId: guilgee._id,
        orlogo: parseFloat(mur.baritsaaTulbur) || 0,
        zarlaga: 0,
      };
      switch (dans.bank) {
        case "tdb":
          baritsaaniiMur.ognoo = guilgee.TxDt;
          break;
        case "khanbank":
        case "golomt":
          baritsaaniiMur.ognoo = guilgee.tranDate;
          break;
        default:
          break;
      }
      var baritsaaDun =
        Math.round(
          ((mur?.baritsaaAvakhDun || 0) -
            (mur?.baritsaaniiUldegdel || 0) +
            Number.EPSILON) *
          10000
        ) / 10000;
      if (baritsaaDun < mur.baritsaaTulbur)
        aldaa.push(
          `${mur.talbainDugaar} талбайн холбох гүйлгээний барьцааны дүн хэтэрсэн байна`
        );
      baritsaa.push(baritsaaniiMur);
    }
    var baritsaaUldegdel =
      Math.round(
        ((mur?.baritsaaAvakhDun || 0) -
          (mur?.baritsaaniiUldegdel || 0) +
          Number.EPSILON) *
        100
      ) / 100;
    var aldangiinUldegdel =
      Math.round((mur.aldangiinUldegdel + Number.EPSILON) * 100) / 100;

    if (mur.tureesiinTulbur > 0 || mur.baritsaaTulbur > 0) {
      if (aldangiinUldegdel > (mur.tulsunAldangi || 0)) {
        aldaa.push(
          t("талбайн алдангийн үлдэгдлийг түрүүлж төлнө үү", {
            too: mur.talbainDugaar,
          })
        );
      }
    }
  });

  return {
    baritsaa,
    undsenGuilgee,
    aldaa,
  };
}

async function baritsaaniiGuilgeeKhiiya(token, guilgeenuud) {
  let aldaa = [];
  for await (const geree of guilgeenuud) {
    const khariu = await uilchilgee(token)
      .post("/baritsaaniiGuilgeeKhiie", geree)
      .then(({ data }) => data)
      .catch((e) => {
        aldaaBarigch(e);
        aldaa.push(`${e.message}`);
      });
    if (khariu !== "Amjilttai") break;
  }
  return { aldaa };
}

function GuilgeeNiiluulekh(
  {
    data,
    dans,
    token,
    baiguullagiinId,
    destroy,
    onFinish,
    barilgiinId,
    setLoading,
    setLoadingBaritsaa,
  },
  ref
) {
  const [gereenuud, setGereenuud] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [khaagdsanGereeEsekh, setKhaagdsanGereeEsekh] = useState(false);
  const [guilgeeniiTailbar, setGuilgeeniiTailbar] = useState();
  const [magadlaltaiGereenuud, setMagadlaltaiGereenuud] = React.useState([]);
  const [showMagadlalModal, setShowMagadlalModal] = useState(false);
  const [expandedAldangi, setExpandedAldangi] = React.useState({});
  const [expandedTurees, setExpandedTurees] = React.useState({});
  const inputRef = React.useRef();

  const query = useMemo(() => {
    return { tuluv: khaagdsanGereeEsekh ? -1 : { $nin: [-1] }, barilgiinId };
  }, [khaagdsanGereeEsekh]);

  const { gereeniiMedeelel, setGereeniiKhuudaslalt } = useGereeniiJagsaalt(
    token,
    baiguullagiinId,
    undefined,
    query,
    undefined,
    5
  );
  useEffect(() => {
    inputRef.current.focus();
  }, [guilgeeniiTailbar]);

  useEffect(() => {
    data?.magadlaltaiGereenuud &&
      getListMethod("geree", token, {
        query: { _id: data?.magadlaltaiGereenuud, barilgiinId },
      }).then(({ data }) => {
        setMagadlaltaiGereenuud(data?.jagsaalt);
      });
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
      async khadgalya() {
        const { aldaa, baritsaa, undsenGuilgee } = guilgeeBurduulya(
          gereenuud,
          dans,
          data
        );
        if (aldaa.length > 0) {
          notification.warning({
            message: t("Анхаар"),
            description: aldaa.join(","),
          });
          return;
        }
        if (undsenGuilgee.length === 0 && baritsaa.length === 0) {
          notification.warning({
            message: t("Анхаар гүйлгээний дүн холбоно уу!"),
            description: aldaa.join(","),
          });
          return;
        }
        if (baritsaa.length > 0) {
          setLoadingBaritsaa(true);
          try {
            const baritsaaniiGuilgee = await baritsaaniiGuilgeeKhiiya(
              token,
              baritsaa
            );
            if (baritsaaniiGuilgee.aldaa.length > 0) {
              notification.warning({
                message: t("Анхаар"),
                description: baritsaaniiGuilgee.aldaa.join(","),
              });
              return;
            }
            if (undsenGuilgee.length === 0) {
              notification.success({
                message: t("Амжилттай"),
                description: t("Гүйлгээ амжилттай холбогдлоо"),
              });
              _.isFunction(onFinish) && onFinish();
              destroy();
              return; 
            }
          } finally {
            setLoadingBaritsaa(false);
          }
        }
        setLoading(true);
        try {
          undsenGuilgee?.forEach((mur) => {
            let prefix = "";
            let prefixParts = [];
            if (Array.isArray(mur.avlaguud) && mur.avlaguud.length > 0) {
              const months = Array.from(
                new Set(
                  mur.avlaguud.map((a) => moment(a.ognoo).format("YYYY-MM"))
                )
              );
              prefixParts.push(months.join(", ") + " " + t("түрээс төлөлт"));
            }
            if (mur.tulsunAldangi > 0) {
              prefixParts.push(t("алданги төлөлт"));
            }
            prefix = prefixParts.join(", ");
            mur.tailbar =
              (guilgeeniiTailbar || "") +
              (guilgeeniiTailbar && prefix ? " (" : "") +
              prefix +
              (guilgeeniiTailbar && prefix ? ")" : "");
          });

          if (undsenGuilgee.length > 0)
            return uilchilgee(token)
              .post("/tulultOlnoorKhadgalya", { guilgeenuud: undsenGuilgee })
              .then(({ data }) => {
                if (data === "Amjilttai") {
                  notification.success({
                    message: t("Амжилттай"),
                    description: t("Гүйлгээ амжилттай холбогдлоо"),
                  });
                  _.isFunction(onFinish) && onFinish();
                  destroy();
                }
              })
              .catch(aldaaBarigch)
              .finally(() => setLoading(false));
        } finally {
         
          if (undsenGuilgee.length === 0) setLoading(false);
        }
      },
    }),
    [gereenuud]
  );

  function garya() {
    if (
      gereenuud.length > 0 ||
      khaagdsanGereeEsekh === true ||
      guilgeeniiTailbar !== data.description
    )
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: destroy,
      });
    else destroy();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }

    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [gereenuud, khaagdsanGereeEsekh, guilgeeniiTailbar]);

  useEffect(() => {
    document.getElementById("gereeSongokh").focus();
  }, []);

  const content = useMemo(
    () => (
      <div className=" relative space-y-1 bg-white p-3  shadow-xl drop-shadow-xl dark:bg-gray-900 dark:text-gray-200 lg:absolute lg:left-0 lg:w-[180%]">
        {gereeniiMedeelel?.jagsaalt?.map((mur, i) => (
          <div
            className="grid cursor-pointer grid-cols-3 gap-2 rounded-md border border-gray-400 p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            key={`gereeniisongolt${i}`}
            onClick={() => {
              if (isSelecting || gereenuud.find((a) => a._id === mur._id)) {
                notification.warning({
                  message: t("Анхаар"),
                  description: t("Гэрээ сонгогдсон байна. Түр хүлээнэ үү."),
                });
                return;
              }
              setIsSelecting(true);
              uilchilgee(token)
                .post("/uldegdelBodyo", {
                  barilgiinId,
                  gereeniiDugaar: mur.gereeniiDugaar,
                })
                .then(({ data }) => {
                  if (!!data) {
                    mur.uldegdel = data.uldegdel;

                     
                    uilchilgee(token)
                      .get(
                        `/gereeniiTulultAvya/${mur._id
                        }?duusakhOgnoo=${moment().add(10, "year").toISOString()}`,
                      )
                      .then(({ data: history }) => {
                        
                        const poolOfMoney = (history || []).reduce(
                          (acc, x) =>
                            acc + (x.tulsunDun || 0) + (x.khyamdral || 0),
                          0,
                        );
                        const allInvoices = (history || [])
                          .filter(
                            (x) =>
                              (x.tulukhDun || 0) > 0 &&
                              !["aldangi", "baritsaa"].includes(x.turul),
                          )
                          .sort(
                            (a, b) => new Date(a.ognoo) - new Date(b.ognoo),
                          );

                        let remainingPool = poolOfMoney;
                        const unpaidLines = [];

                        allInvoices.forEach((inv) => {
                          if (remainingPool >= inv.tulukhDun) {
                            remainingPool -= inv.tulukhDun;
                          } else {
                            const unpaidAmount = inv.tulukhDun - remainingPool;
                            remainingPool = 0;
                            unpaidLines.push({
                              ...inv,
                              debt: unpaidAmount,
                            });
                          }
                        });

                         
                        const monthsMap = {};
                        unpaidLines.forEach((line) => {
                          const mKey = moment(line.ognoo).format("YYYY-MM");
                          if (!monthsMap[mKey]) {
                            monthsMap[mKey] = {
                              year: moment(line.ognoo).year(),
                              month: moment(line.ognoo).month() + 1,
                              debt: 0,
                              ognoo: line.ognoo,
                              turul: t("Сарын нийт"),
                            };
                          }
                          monthsMap[mKey].debt += line.debt;
                        });

                        const currentMonthEnd = moment().endOf("month");
                        mur.sarUldegdel = Object.values(monthsMap)
                          .filter((a) => moment(a.ognoo).isSameOrBefore(currentMonthEnd))
                          .sort(
                            (a, b) => new Date(a.ognoo) - new Date(b.ognoo),
                          );

                         
                        uilchilgee(token)
                          .get(
                            `/avlagaTulsunTuukh?query={"gereeniiId":"${mur._id}"}`,
                          )
                          .then(({ data: tData }) => {
                            mur.pastAllocations = tData.jagsaalt || [];
                            setGereenuud((a) => {
                              if (a.find((x) => x._id === mur._id)) return a;
                              return [...a, mur];
                            });
                            setVisible(false);
                            setIsSelecting(false);
                          });
                      })
                      .catch(() => setIsSelecting(false));
                  } else {
                    setIsSelecting(false);
                  }
                })
                .catch((e) => {
                  setIsSelecting(false);
                  aldaaBarigch(e);
                });
            }}
          >
            <div className="truncate px-2">{mur.talbainDugaar}</div>
            <div className="px-2">{mur.register}</div>
            <div className="px-2">{mur.ner}</div>
          </div>
        ))}
      </div>
    ),
    [gereeniiMedeelel, gereenuud, magadlaltaiGereenuud]
  );

  function zuruuZun(index, talbar) {
    let sum = gereenuud.reduce((a, b, currentIndex) => {
      let value = 0;
      if (currentIndex === index) {
        ["baritsaaTulbur", "tureesiinTulbur", "tulsunAldangi"]
          .filter((a) => a !== talbar)
          .forEach((mur) => {
            value += parseFloat(b[mur]) || 0;
          });
      } else {
        value += parseFloat(b.baritsaaTulbur) || 0;
        value += parseFloat(b.tureesiinTulbur) || 0;
        value += parseFloat(b.tulsunAldangi) || 0;
      }
      return _.toNumber(a + value);
    }, 0);
    return Math.round((sum + (data.kholbosonDun || 0)) * 100) / 100;
  }

  function onChange({ target }) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      setGereeniiKhuudaslalt((a) => ({ ...a, search: target.value }));
    }, 300);
  }

  const guilgeeniiDun = useMemo(() => {
    return dans.bank === "tdb" ? data.Amt : data.amount || data.tranAmount;
  }, [dans, data]);

  function onChangeKholbokhDun(target, index, talbar) {
    if (talbar === "tureesiinTulbur") {
      const mur = gereenuud[index];
      const aldangiinUldegdel =
        Math.round((mur.aldangiinUldegdel + Number.EPSILON) * 100) / 100;
      const baritsaaUldegdel =
        Math.round(
          ((mur?.baritsaaAvakhDun || 0) -
            (mur?.baritsaaniiUldegdel || 0) +
            Number.EPSILON) *
          100
        ) / 100;

      if (aldangiinUldegdel > (mur.tulsunAldangi || 0)) {
        notification.warning({
          message: t("Анхаар"),
          description: t("талбайн алдангийн үлдэгдлийг түрүүлж төлнө үү", {
            too: mur.talbainDugaar,
          }),
        });
        target.value = 0;
        return;
      }
    }
    if (talbar === "baritsaaTulbur") {
      const mur = gereenuud[index];
      const aldangiinUldegdel =
        Math.round((mur.aldangiinUldegdel + Number.EPSILON) * 100) / 100;

      if (aldangiinUldegdel > (mur.tulsunAldangi || 0)) {
        notification.warning({
          message: t("Анхаар"),
          description: t("талбайн алдангийн үлдэгдлийг түрүүлж төлнө үү", {
            too: mur.talbainDugaar,
          }),
        });
        target.value = 0;
        return;
      }
    }
    if (talbar === "baritsaaTulbur") {
      const mur = gereenuud[index];
      const aldangiinUldegdel =
        Math.round((mur.aldangiinUldegdel + Number.EPSILON) * 100) / 100;

      if (aldangiinUldegdel > (mur.tulsunAldangi || 0)) {
        notification.warning({
          message: t("Анхаар"),
          description: t("талбайн алдангийн үлдэгдлийг түрүүлж төлнө үү", {
            too: mur.talbainDugaar,
          }),
        });
        target.value = 0;
        return;
      }
    }
    let sum = zuruuZun(index, talbar);
    const parsedStr = parser(target.value);
    const numVal = _.toNumber(parsedStr);
    if (sum + numVal > guilgeeniiDun) {
      target.value = formatNumber(guilgeeniiDun - sum, 2);
      notification.warning({
        message: t("Анхаар"),
        description: t("Гүйлгээний дүнгээс холбох дүн илүү гарсан байна"),
      });
    }
    setGereenuud((a) => {
      const hasDecimal = parsedStr.includes(".");
      _.set(a, `${index}.${talbar}`, hasDecimal ? parsedStr : numVal);
      return [...a];
    });
  }

  function onDoubleClickKholbokhDun(target, index, talbar) {
    if (talbar === "tureesiinTulbur") {
      const mur = gereenuud[index];
      const aldangiinUldegdel =
        Math.round((mur.aldangiinUldegdel + Number.EPSILON) * 100) / 100;
      const baritsaaUldegdel =
        Math.round(
          ((mur?.baritsaaAvakhDun || 0) -
            (mur?.baritsaaniiUldegdel || 0) +
            Number.EPSILON) *
          100
        ) / 100;

      if (aldangiinUldegdel > (mur.tulsunAldangi || 0)) {
        notification.warning({
          message: t("Анхаар"),
          description: t("талбайн алдангийн үлдэгдлийг түрүүлж төлнө үү", {
            too: mur.talbainDugaar,
          }),
        });
        target.value = 0;
        return;
      }
    }
    if (talbar === "baritsaaTulbur") {
      const mur = gereenuud[index];
      const aldangiinUldegdel =
        Math.round((mur.aldangiinUldegdel + Number.EPSILON) * 100) / 100;

      if (aldangiinUldegdel > (mur.tulsunAldangi || 0)) {
        notification.warning({
          message: t("Анхаар"),
          description: t("талбайн алдангийн үлдэгдлийг түрүүлж төлнө үү", {
            too: mur.talbainDugaar,
          }),
        });
        target.value = 0;
        return;
      }
    }
    const currentSumOfOthers = zuruuZun(index, talbar);
    const remainingBankFunds =
      Math.round((guilgeeniiDun - currentSumOfOthers) * 100) / 100;

    if (remainingBankFunds <= 0) return;

    let debtToPay = 0;
    if (talbar === "tulsunAldangi") {
      debtToPay = gereenuud[index].aldangiinUldegdel || 0;
    } else if (talbar === "tureesiinTulbur") {
      debtToPay = gereenuud[index].uldegdel || 0;
    } else if (talbar === "baritsaaTulbur") {
      debtToPay =
        (gereenuud[index]?.baritsaaAvakhDun || 0) -
        (gereenuud[index]?.baritsaaniiUldegdel || 0);
    }

    const absDebtToPay =
      Math.round((Math.abs(debtToPay || 0) + Number.EPSILON) * 100) / 100;

    const aldangiBalance =
      Math.round((gereenuud[index]?.aldangiinUldegdel || 0) * 100) / 100;
    const baritsaaBalance =
      Math.round(
        ((gereenuud[index]?.baritsaaAvakhDun || 0) -
          (gereenuud[index]?.baritsaaniiUldegdel || 0) +
          Number.EPSILON) *
        100
      ) / 100;

    const currentTulsunAldangi = gereenuud[index]?.tulsunAldangi || 0;
    const currentTulsunBaritsaa = gereenuud[index]?.baritsaaTulbur || 0;

    const isAldangiAddressed =
      aldangiBalance <= 0 || currentTulsunAldangi >= aldangiBalance - 0.01;
    const isBaritsaaAddressed =
      baritsaaBalance <= 0 || currentTulsunBaritsaa >= baritsaaBalance - 0.01;

    let amountToAllocate = 0;

    if (talbar === "tureesiinTulbur") {
      amountToAllocate = remainingBankFunds;
    } else {
      amountToAllocate =
        Math.abs(remainingBankFunds - absDebtToPay) <= 1
          ? remainingBankFunds
          : Math.max(0, Math.min(remainingBankFunds, absDebtToPay));
    }

    if (amountToAllocate > 0) {
      target.value = formatNumber(amountToAllocate, 2);
      setGereenuud((a) => {
        const newData = [...a];
        _.set(newData, `${index}.${talbar}`, amountToAllocate);
        return newData;
      });
    }
  }

  const zuruuDun = useMemo(() => {
    let sum = zuruuZun();
    const result = Math.round((guilgeeniiDun - sum) * 100) / 100;
    return Math.abs(result) < 1 ? 0 : result;
  }, [gereenuud]);

  function inputChange(e) {
    setGuilgeeniiTailbar(e.target.value);
  }

  return (
    <div className="flex w-full flex-col space-y-2 overflow-hidden" style={{ height: "calc(100vh - 250px)" }}>
      {magadlaltaiGereenuud?.length > 0 && (
        <div
          className="flex items-center justify-between gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 cursor-pointer hover:bg-blue-100 transition-all duration-200 group mt-2"
          onClick={() => setShowMagadlalModal(true)}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50">
              <span className="font-bold">{magadlaltaiGereenuud.length}</span>
            </div>
            <div>
              <div className="text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-tight">
                {t("Магадлалтай гэрээ")}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {t("Энэ гүйлгээнд тохирох байж болзошгүй гэрээнүүд")}
              </div>
            </div>
          </div>
          <Button type="primary" size="small" className="rounded-full px-4 font-medium transition-transform group-hover:scale-105">
            {t("Харах")}
          </Button>
        </div>
      )}

      <Modal
        title={t("Магадлалтай гэрээний жагсаалт")}
        visible={showMagadlalModal}
        onCancel={() => setShowMagadlalModal(false)}
        footer={null}
        width={700}
        centered
        className="rounded-3xl"
      >
        <div className="space-y-3 p-2">
          {magadlaltaiGereenuud?.map((mur, i) => (
            <div
              className="grid grid-cols-3 gap-4 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
              key={`magadlalmodal${i}`}
              onClick={() => {
                setShowMagadlalModal(false);
              }}
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">{t("Талбай")}</span>
                <span className="font-bold text-gray-800 dark:text-white">{mur.talbainDugaar}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">{t("Регистр")}</span>
                <span className="font-bold text-gray-800 dark:text-white">{mur.register}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">{t("Нэр")}</span>
                <span className="font-bold text-gray-800 dark:text-white truncate">{mur.ner}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
      <div className="space-y-2 ">
        <div className="flex justify-between">
          <span className="text-sm font-medium dark:text-gray-100 lg:text-xl">
            {t("Гүйлгээний мэдээлэл")}
          </span>
          <span className="dark:text-gray-200">
            {moment().format("YYYY-MM-DD")}
          </span>
        </div>
        <div className="box grid w-full grid-cols-4 rounded-md border border-gray-400 bg-gray-100 p-2 ">
          <div className="col-span-4 lg:col-span-1">
            {data.CtAcct || data.relatedAccount || data.accNum}
          </div>
          <div className="col-span-4 lg:col-span-1">
            {data.CtActnName || data.accName}
          </div>
          <div className="col-span-2 text-center lg:col-span-1">
            {moment(data.TxDt || data.tranDate).format("YYYY-MM-DD")}
          </div>
          <div className="col-span-2 text-right text-red-600 lg:col-span-1">
            {formatNumber(guilgeeniiDun)}
          </div>
          <div className="relative col-span-4 mt-2 flex justify-between rounded-md lg:mt-0">
            <Input
              ref={inputRef}
              className="rounded-md pr-7"
              value={
                guilgeeniiTailbar === undefined
                  ? data.TxAddInf?.split("-&gt;")[0] ||
                  data.description ||
                  data.tranDesc
                  : guilgeeniiTailbar
              }
              onChange={inputChange}
              disabled={guilgeeniiTailbar === undefined}
            />
            {guilgeeniiTailbar === undefined ? (
              <FormOutlined
                onClick={() =>
                  setGuilgeeniiTailbar(
                    data.TxAddInf?.split("-&gt;")[0] || data.description
                  )
                }
                className="absolute right-2 cursor-pointer text-lg hover:text-yellow-600"
              />
            ) : (
              <CloseOutlined
                onClick={() => setGuilgeeniiTailbar(undefined)}
                className="absolute right-2 cursor-pointer text-lg hover:text-green-600"
              />
            )}
          </div>
          {data.kholbosonDun > 0 && (
            <div className="col-span-4 flex justify-between">
              <span>
                {t("Холбогдсон талбай")}:
                {data.kholbosonTalbainId &&
                  [...new Set(data.kholbosonTalbainId)].join(",")}
              </span>
              <span>
                {t("Холбогдсон дүн")}:{formatNumber(data.kholbosonDun || 0)}
              </span>
            </div>
          )}
        </div>
        <div className="font-medium dark:text-gray-200 lg:text-xl">
          {t("Гүйлгээ холбох")}
        </div>
        <div className="flex grid-cols-2 flex-col-reverse gap-3 lg:grid ">
          <Dropdown
            className="w-[100%]"
            placement="bottom"
            title={t("Гэрээний жагсаалт")}
            overlay={content}
            open={visible}
            trigger="click"
            onOpenChange={(v) => setVisible(v)}
          >
            <input
              autoComplete="off"
              id="gereeSongokh"
              onFocus={() =>
                setTimeout(() => {
                  setVisible(true);
                }, 300)
              }
              className=" rounded-md border border-gray-400 p-1 px-2 dark:text-gray-200 lg:w-[114%]"
              placeholder={t("Гэрээ сонгох")}
              onChange={onChange}
            />
          </Dropdown>
          <div className="flex items-center justify-end">
            <label className="pr-2 text-sm font-bold text-gray-600">
              {t("Хаагдсан гэрээ холбох эсэх")}{" "}
            </label>
            <Tooltip title={t("Хаагдсан гэрээ холбох эсэх")}>
              <Switch
                checked={khaagdsanGereeEsekh}
                onChange={setKhaagdsanGereeEsekh}
                title={t("Хаагдсан гэрээ холбох эсэх")}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-2 px-2 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {gereenuud.map((geree, index) => (
            <div
              key={`${index}geree-kholbolt`}
              className="space-y-2 rounded-md border border-gray-400 p-2"
            >
              <div className="flex w-full justify-between text-right text-base font-medium dark:text-gray-200 lg:text-xl">
                <span>
                  {geree?.talbainDugaar} -- {geree?.register} -- {geree?.ner}
                </span>
                <Popconfirm
                  title={`${geree?.talbainDugaar} талбайн мөр бичилт устгах уу?`}
                  okText={t("Тийм")}
                  cancelText={t("Үгүй")}
                  trigger={"click"}
                  onConfirm={() =>
                    setGereenuud((a) => {
                      a.splice(index, 1);
                      return [...a];
                    })
                  }
                >
                  <span className="h-10 w-10 p-1 text-2xl text-red-500">
                    <CloseCircleOutlined />
                  </span>
                </Popconfirm>
              </div>
              {Math.round(
                ((geree?.baritsaaAvakhDun || 0) -
                  (geree?.baritsaaniiUldegdel || 0) +
                  Number.EPSILON) *
                100
              ) /
                100 >
                0 && (
                  <div className="box grid w-full grid-cols-3 rounded-md border bg-gray-100 p-1">
                    <div className="col-span-4">{t("Барьцааны үлдэгдэл")}</div>
                    <div>
                      {formatNumber(
                        (geree?.baritsaaAvakhDun || 0) -
                        (geree.baritsaaniiUldegdel || 0),
                        2
                      )}
                    </div>
                    <div>{geree.talbainDugaar}</div>
                    <div className="text-right text-green-600">
                      <input
                        className="w-full rounded-md border border-gray-400 bg-gray-200 px-2 text-right dark:bg-gray-700"
                        placeholder={t("Барьцаа дүн")}
                        value={formatter(geree.baritsaaTulbur)}
                        onDoubleClick={({ target }) =>
                          onDoubleClickKholbokhDun(target, index, "baritsaaTulbur")
                        }
                        onChange={({ target }) => {
                          onChangeKholbokhDun(target, index, "baritsaaTulbur");
                        }}
                      />
                    </div>
                  </div>
                )}
              {Math.round((geree?.aldangiinUldegdel || 0) * 100) / 100 > 0 && (
                <div className="w-full space-y-2">
                  <div className="box grid w-full grid-cols-3 rounded-md border border-gray-400 bg-gray-100 p-1">
                    <div className="col-span-4">{t("Алдангийн үлдэгдэл")}</div>
                    <div>{formatNumber(geree?.aldangiinUldegdel || 0, 2)}</div>
                    <div>{geree.talbainDugaar}</div>
                    <div className="flex items-center gap-1 text-right text-green-600">
                      <input
                        className="w-full rounded-md border border-gray-400 bg-gray-200 px-2 text-right dark:bg-gray-700"
                        placeholder={t("Төлөх дүн")}
                        value={formatter(geree.tulsunAldangi)}
                        onDoubleClick={({ target }) =>
                          onDoubleClickKholbokhDun(target, index, "tulsunAldangi")
                        }
                        onChange={({ target }) => {
                          onChangeKholbokhDun(target, index, "tulsunAldangi");
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedAldangi((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                        className="flex h-6 w-6 items-center justify-center rounded border border-gray-400 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        {expandedAldangi[index] ? (
                          <UpOutlined />
                        ) : (
                          <DownOutlined />
                        )}
                      </button>
                    </div>
                  </div>
                  {expandedAldangi[index] && (
                    <div className="box grid w-full grid-cols-3 gap-2 rounded-md border border-gray-400 bg-gray-100 p-2">
                      <div className="col-span-3 text-sm font-medium">
                        {t("Нэмэлт мэдээлэл")}
                      </div>
                      <div className="col-span-3 text-sm">
                        {t("Энд нэмэлт агуулга харагдана")}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {geree && (
                <div className="w-full space-y-2">
                  <div className="box grid w-full grid-cols-3 rounded-md border border-gray-400 bg-gray-100 p-1">
                    <div className="col-span-4">{t("Түрээсийн үлдэгдэл")}</div>
                    <div
                      className={`text-${geree.uldegdel > 0 ? "red" : "green"
                        }-500`}
                    >
                      {formatNumber(geree.uldegdel, 2)}
                    </div>
                    <div>{geree.talbainDugaar}</div>
                    <div className="flex items-center gap-1 text-right text-green-600">
                      <input
                        className="w-full rounded-md border border-gray-400 bg-gray-200 px-2 text-right dark:bg-gray-700 "
                        placeholder={t("Төлөх дүн")}
                        value={formatter(geree.tureesiinTulbur)}
                        onDoubleClick={({ target }) =>
                          onDoubleClickKholbokhDun(
                            target,
                            index,
                            "tureesiinTulbur"
                          )
                        }
                        onChange={({ target }) => {
                          onChangeKholbokhDun(target, index, "tureesiinTulbur");
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedTurees((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                        className="flex h-6 w-6 items-center justify-center rounded border border-gray-400 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        {expandedTurees[index] ? (
                          <UpOutlined />
                        ) : (
                          <DownOutlined />
                        )}
                      </button>
                    </div>
                  </div>
                  {expandedTurees[index] && (
                    <div className="box grid w-full grid-cols-3 gap-2 rounded-md border border-gray-400 bg-gray-100 p-2">
                      <div className="col-span-3 text-sm font-medium">
                        {t("Нэмэлт мэдээлэл")}
                      </div>
                      <div className="col-span-3 text-sm">
                        {t("Энд нэмэлт агуулга харагдана")}
                      </div>
                    </div>
                  )}
                </div>
              )}


              {geree.sarUldegdel && geree.sarUldegdel.length > 0 && (
                <div className="mt-2 w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm dark:bg-gray-800 dark:border-gray-600">
                  <div className="mb-2 font-semibold uppercase text-gray-600 dark:text-gray-300">
                    {t("Төлбөр хуваарилалт")}
                  </div>
                  {(() => {
                    let remainingPayment = parseFloat(geree.tureesiinTulbur) || 0;
                    const currentAllocations = [];
                    const rows = geree.sarUldegdel.map((monthDebt, mi) => {
                      let allocate = Math.min(remainingPayment, monthDebt.debt);
                      if (allocate < 0) allocate = 0;
                      remainingPayment -= allocate;
                      let finalUldegdel = monthDebt.debt - allocate;

                      if (allocate > 0) {
                        currentAllocations.push({
                          tulukhDun: monthDebt.debt,
                          tulsunDun: allocate,
                          ognoo: monthDebt.ognoo,
                          turul: monthDebt.turul,
                        });
                      }

                      return (
                        <div
                          key={mi}
                          className="flex flex-col space-y-1 border-b border-gray-200 pb-2 pt-2 last:border-0 dark:border-gray-600"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-800 dark:text-gray-100">
                              {monthDebt.year}-{monthDebt.month} ({monthDebt.turul})
                            </span>
                            {finalUldegdel <= 0 ? (
                              <span className="rounded bg-green-100 px-1 text-[10px] text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                {t("Бүрэн төлөгдөнө")}
                              </span>
                            ) : allocate > 0 ? (
                              <span className="rounded bg-blue-100 px-1 text-[10px] text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                {t("Хэсэгчилсэн")}
                              </span>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap gap-x-4 text-[13px]">
                            <span className="text-gray-500 dark:text-gray-400">
                              {t("Хуримтлагдсан өр")}:{" "}
                              <b className="text-gray-700 dark:text-gray-200">
                                {formatNumber(monthDebt.debt, 2)}
                              </b>
                            </span>
                            <span className="text-blue-500">
                              {t("Төлөх")}:{" "}
                              <b className="text-blue-600 font-bold">
                                {formatNumber(allocate, 2)}
                              </b>
                            </span>
                            <span className="text-red-500">
                              {t("Үлдэгдэл")}:{" "}
                              <b className="font-bold">
                                {formatNumber(finalUldegdel, 2)}
                              </b>
                            </span>
                          </div>
                        </div>
                      );
                    });
                    // Store current calculated allocations in the geree object for later saving
                    geree.avlaguud = currentAllocations;
                    return rows;
                  })()}
                </div>
              )}

              {geree.pastAllocations && geree.pastAllocations.length > 0 && (
                <div className="mt-2 w-full rounded-md border border-blue-200 bg-blue-50/50 p-2 text-xs dark:bg-blue-900/10 dark:border-blue-800">
                  <div className="mb-1 font-semibold uppercase text-blue-600 dark:text-blue-400">
                    {t("Өмнөх хуваарилалтын түүх")}
                  </div>
                  {geree.pastAllocations.slice(0, 5).map((p, pi) => (
                    <div
                      key={pi}
                      className="mb-1 border-b border-blue-100 pb-1 last:border-0 dark:border-blue-900/30"
                    >
                      <div className="flex justify-between font-medium">
                        <span>{moment(p.tulsunOgnoo).format("YYYY-MM-DD")}</span>
                        <span className="text-blue-700 dark:text-blue-400">
                          {formatNumber(p.tulsunDun)}₮
                        </span>
                      </div>
                      <div className="space-y-0.5 pl-2 text-[10px] text-gray-500">
                        {p.avlaguud?.map((a, ai) => (
                          <div key={ai} className="flex justify-between">
                            <span>
                              • {moment(a.ognoo).format("YYYY-MM")} ({a.turul})
                            </span>
                            <span>{formatNumber(a.tulsunDun)}₮</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <Divider className="my-1" />

        <div className="sticky bottom-0 z-10 grid w-full grid-cols-2 divide-x-2 bg-white px-2 py-2 items-center border-t dark:bg-gray-900">
          <div className="flex flex-col justify-between pr-2 lg:flex-row">
            <div className="dark:text-gray-200">{t("Холбосон дүн")}:</div>
            <div className="text-right text-xl text-green-600">
              {formatNumber(guilgeeniiDun - zuruuDun)}
            </div>
          </div>
          <div className="flex flex-col justify-between pl-2 lg:flex-row">
            <div className="dark:text-gray-200">{t("Холбоогүй дүн")}:</div>
            <div className="text-right text-xl text-red-600">
              {formatNumber(zuruuDun)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(GuilgeeNiiluulekh);
