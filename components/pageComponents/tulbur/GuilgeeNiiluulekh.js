import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import {
  Collapse,
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
import useGereeniiJagsaalt, { useGereeGuilgee } from "hooks/useGereeniiJagsaalt";
import useDansKhuulga from "hooks/khuulga/useDansKhuulga";
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

function GereeniiGuilgeeTuukhDisplay({ geree, token, index, onChangeKholbokhDun, onDoubleClickKholbokhDun, guilgeeniiDun, zuruuZun, transactionInputs, setTransactionInputs }) {
  const ognoo = useMemo(() => {
    const endDate = moment().endOf("month");
    const startDate = geree?.gereeniiOgnoo
      ? moment.min(moment(geree.gereeniiOgnoo), moment().subtract(5, "years"))
      : moment().subtract(5, "years");
    return [startDate.startOf("month"), endDate];
  }, [geree?.gereeniiOgnoo]);

  const { guilgeeniiTuukh } = useGereeGuilgee(
    token,
    geree?._id,
    ognoo,
    undefined
  );

  const transactionsByMonth = useMemo(() => {
    if (!geree?._id || !guilgeeniiTuukh || !Array.isArray(guilgeeniiTuukh)) {
      return [];
    }

    let runningUldegdel = 0;
    const transactionsWithUldegdel = guilgeeniiTuukh.map((transaction) => {
      if (transaction.uldegdel === undefined || transaction.uldegdel === null) {
        runningUldegdel =
          runningUldegdel +
          (transaction.tulukhDun || 0) -
          (transaction.tulsunDun || 0) -
          (transaction.khungulult || transaction.khyamdral || 0);
        
        if (transaction.turul === "khungulult" && runningUldegdel < 0) {
          runningUldegdel = 0;
        }
        
        return { ...transaction, uldegdel: runningUldegdel };
      }
      runningUldegdel = transaction.uldegdel;
      return transaction;
    });

    const allGrouped = {};
    transactionsWithUldegdel.forEach((transaction) => {
      const dateField = transaction.ognoo || transaction.guilgeeKhiisenOgnoo;
      if (dateField && moment(dateField).isValid()) {
        const monthKey = moment(dateField).format("YYYY-MM");
        if (!allGrouped[monthKey]) {
          allGrouped[monthKey] = [];
        }
        allGrouped[monthKey].push(transaction);
      }
    });

    const sortedMonthKeys = Object.keys(allGrouped).sort((a, b) => b.localeCompare(a));

    const adjustedTransactionsByMonth = sortedMonthKeys.map((month) => {
      const monthTransactions = allGrouped[month];
      
      const rentTransaction = monthTransactions.find(
        (t) => t.turul === "khuvaari" || (!t.tailbar && t.turul !== "khungulult")
      );
      
      const discounts = monthTransactions.filter(
        (t) => t.turul === "khungulult" && (t.khungulult || t.khyamdral || 0) > 0
      );
      
      const payments = monthTransactions.filter(
        (t) => t.tulsunDun && t.tulsunDun > 0 && t.turul !== "khungulult"
      );
      
      const totalDiscount = discounts.reduce((sum, d) => sum + (d.khungulult || d.khyamdral || 0), 0);
      const totalPayment = payments.reduce((sum, p) => sum + (p.tulsunDun || 0), 0);
      const totalToSubtract = totalDiscount + totalPayment;
      
      if (rentTransaction) {
        const originalRent = rentTransaction.tulukhDun || 0;
        let adjustedRent = originalRent - totalToSubtract;
        
        let carryOver = 0;
        if (adjustedRent < 0) {
          carryOver = Math.abs(adjustedRent);
          adjustedRent = 0;
        }
        
        const adjustedRentTransaction = {
          ...rentTransaction,
          originalTulukhDun: originalRent,
          tulukhDun: adjustedRent,
          carryOver: carryOver,
          totalDiscount: totalDiscount,
          totalPayment: totalPayment,
        };
        
        const otherTransactions = monthTransactions.filter(
          (t) => t._id !== rentTransaction._id && t.turul !== "khungulult"
        );
        
        return {
          month,
          monthLabel: moment(month, "YYYY-MM").format("YYYY оны MM сар"),
          transactions: [adjustedRentTransaction, ...otherTransactions].sort((a, b) => {
            const dateA = moment(a.ognoo || a.guilgeeKhiisenOgnoo);
            const dateB = moment(b.ognoo || b.guilgeeKhiisenOgnoo);
            return dateB.diff(dateA);
          }),
          carryOver: carryOver,
        };
      }
      
      const filtered = monthTransactions.filter(
        (t) => t.uldegdel !== undefined && t.uldegdel !== null && t.uldegdel !== 0 && t.turul !== "khungulult"
      );
      
      return {
        month,
        monthLabel: moment(month, "YYYY-MM").format("YYYY оны MM сар"),
        transactions: filtered.sort((a, b) => {
          const dateA = moment(a.ognoo || a.guilgeeKhiisenOgnoo);
          const dateB = moment(b.ognoo || b.guilgeeKhiisenOgnoo);
          return dateB.diff(dateA);
        }),
        carryOver: 0,
      };
    });
    
    for (let i = 0; i < adjustedTransactionsByMonth.length; i++) {
      const currentMonth = adjustedTransactionsByMonth[i];
      if (currentMonth.carryOver > 0 && i < adjustedTransactionsByMonth.length - 1) {
        const nextMonth = adjustedTransactionsByMonth[i + 1];
        const nextRent = nextMonth.transactions.find(
          (t) => t.turul === "khuvaari" || (!t.tailbar && t.turul !== "khungulult")
        );
        
        if (nextRent) {
          const originalNextRent = nextRent.originalTulukhDun || nextRent.tulukhDun || 0;
          nextRent.tulukhDun = Math.max(0, originalNextRent - currentMonth.carryOver);
          nextRent.carryOverApplied = currentMonth.carryOver;
          if (!nextRent.originalTulukhDun) {
            nextRent.originalTulukhDun = originalNextRent;
          }
        }
      }
    }
    
    return adjustedTransactionsByMonth.filter(
      (month) => month.transactions && month.transactions.length > 0
    );
  }, [geree?._id, guilgeeniiTuukh]);

  const { Panel } = Collapse;

  if (!transactionsByMonth || transactionsByMonth.length === 0) {
    const totalTransactions = guilgeeniiTuukh?.length || 0;
    return (
      <div className="col-span-3 text-sm text-gray-500">
        {totalTransactions > 0
          ? t("Үлдэгдэлтэй гүйлгээ олдсонгүй") +
            ` (${totalTransactions} ${t("гүйлгээ")} ${t("олдсон")})`
          : t("Гүйлгээ олдсонгүй")}
      </div>
    );
  }

  return (
    <>
      <div className="col-span-3 text-sm font-medium mb-2">
        {t("Хуулга")} ({transactionsByMonth.length} {t("сар")})
      </div>
      <div className="col-span-3 max-h-96 overflow-y-auto">
        {transactionsByMonth && transactionsByMonth.length > 0 ? (
          <Collapse ghost defaultActiveKey={[]}>
            {transactionsByMonth.map(({ month, monthLabel, transactions }) => (
              <Panel
                key={month}
                header={
                  <div className="flex justify-between items-center w-full pr-4">
                    <span className="font-medium">{monthLabel}</span>
                    <span className="text-xs text-gray-500">
                      {transactions.length} {t("гүйлгээ")}
                    </span>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead className="bg-gray-200 dark:bg-gray-700">
                      <tr>
                      <th className="border border-gray-300 px-2 py-1 text-center">{t("Авлага")}</th>
                        <th className="border border-gray-300 px-2 py-1 text-center">{t("Дүн")}</th>
              <th className="border border-gray-300 px-2 py-1 text-center">{t("Төлөх дүн")}</th>

                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, idx) => {
                        const transactionId = transaction._id || `${month}-${idx}`;
                        const storedValue = transactionInputs?.[index]?.[transactionId];
                        const numValue = storedValue !== undefined && storedValue !== null 
                          ? (typeof storedValue === 'number' ? storedValue : parseFloat(storedValue) || 0)
                          : undefined;
                        const displayValue = numValue !== undefined 
                          ? formatNumber(Math.round(numValue * 100) / 100, 2) 
                          : "";
                        return (
                        <tr
                          key={`tuukh-${index}-${month}-${idx}`}
                          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="border border-gray-300 px-2 py-1 truncate max-w-xs">
                            {transaction.tailbar || "Түрээс"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            {formatNumber(transaction.tulukhDun || 0, 2)}
                          </td>
                         
                         
                          <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-400 bg-gray-200 px-2 text-right dark:bg-gray-700 dark:text-gray-200"
                    placeholder="0"
                    value={displayValue}
                    onDoubleClick={({ target }) => {
                      const tulukhDun = transaction.tulukhDun;
                      let value = 0;
                      if (tulukhDun !== undefined && tulukhDun !== null) {
                        if (typeof tulukhDun === 'number') {
                          value = tulukhDun;
                        } else if (typeof tulukhDun === 'string') {
                          const cleaned = tulukhDun.replace(/,/g, '').trim();
                          const parsed = parseFloat(cleaned);
                          value = isNaN(parsed) ? 0 : parsed;
                        } else {
                          const num = Number(tulukhDun);
                          value = isNaN(num) ? 0 : num;
                        }
                      }
                      
                      value = Math.round(value * 100) / 100;
                      
                      target.value = formatNumber(value, 2);
                      
                      const transactionId = transaction._id || `${month}-${idx}`;
                      
                      if (setTransactionInputs) {
                        setTransactionInputs((prev) => {
                          const updatedInputs = {
                            ...prev,
                            [index]: {
                              ...(prev[index] || {}),
                              [transactionId]: value,
                            },
                          };
                          const contractInputs = updatedInputs[index] || {};
                          const total = Object.values(contractInputs).reduce((sum, val) => {
                            const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                            return sum + numVal;
                          }, 0);
                          
                          const roundedTotal = Math.round(total * 100) / 100;
                          
                          if (onChangeKholbokhDun) {
                            const syntheticTarget = { value: formatter(roundedTotal) };
                            onChangeKholbokhDun(syntheticTarget, index, "tureesiinTulbur");
                          }
                          
                          return updatedInputs;
                        });
                      } else if (onChangeKholbokhDun) {
                        onChangeKholbokhDun(target, index, "tureesiinTulbur");
                      }
                    }}
                    onChange={({ target }) => {
                      const parsedValue = parser(target.value);
                      const value = Math.round(_.toNumber(parsedValue) * 100) / 100 || 0;
                      const transactionId = transaction._id || `${month}-${idx}`;
                      
                      if (setTransactionInputs) {
                        setTransactionInputs((prev) => {
                          const updatedInputs = {
                            ...prev,
                            [index]: {
                              ...(prev[index] || {}),
                              [transactionId]: value,
                            },
                          };
                          
                          const contractInputs = updatedInputs[index] || {};
                          const total = Object.values(contractInputs).reduce((sum, val) => {
                            const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                            return sum + numVal;
                          }, 0);
                          
                          const roundedTotal = Math.round(total * 100) / 100;
                          
                          if (onChangeKholbokhDun) {
                            const syntheticTarget = { value: formatter(roundedTotal) };
                            onChangeKholbokhDun(syntheticTarget, index, "tureesiinTulbur");
                          }
                          
                          return updatedInputs;
                        });
                      } else if (onChangeKholbokhDun) {
                        onChangeKholbokhDun(target, index, "tureesiinTulbur");
                      }
                    }}
                  />
                </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Panel>
            ))}
          </Collapse>
        ) : (
          <div className="text-xs text-gray-400 p-2">
            {t("Мэдээлэл бэлтгэж байна...")}
          </div>
        )}
      </div>
    </>
  );
}

function DansniiKhuulgaDisplay({ dans, token, baiguullagiinId, data }) {
  const ognoo = useMemo(() => {
    const endDate = moment().endOf("month");
    const startDate = moment().subtract(3, "months").startOf("month");
    return [startDate, endDate];
  }, []);

  const { dansniiKhuulgaGaralt } = useDansKhuulga(
    token,
    baiguullagiinId,
    dans,
    ognoo,
    {},
    {}
  );

  if (!dansniiKhuulgaGaralt) {
    return (
      <div className="col-span-3 text-sm text-gray-500 p-2">
        {t("Мэдээлэл ачаалж байна...")}
      </div>
    );
  }

  if (!dansniiKhuulgaGaralt?.jagsaalt || dansniiKhuulgaGaralt.jagsaalt.length === 0) {
    return (
      <div className="col-span-3 text-sm text-gray-500 p-2">
        {t("Гүйлгээ олдсонгүй")}
      </div>
    );
  }

  return (
    <div className="col-span-3 max-h-96 overflow-y-auto">
      <div className="text-sm font-medium mb-2">
      </div>
    </div>
  );
}

function guilgeeBurduulya(gereenuud, dans, guilgee) {
  let baritsaa = [];
  let undsenGuilgee = [];
  let aldaa = [];
  gereenuud.forEach((mur) => {
    if (mur.tureesiinTulbur > 0 || mur.tulsunAldangi > 0) {
      let guilgeeniiMur = {
        turul: "bank",
        tulsunDun: mur.tureesiinTulbur || 0,
        guilgeeniiId: guilgee._id,
        gereeniiId: mur._id,
        dansniiDugaar: guilgee.dansniiDugaar,
        tulukhAldangi: mur.aldangiinUldegdel,
        tulsunAldangi: mur.tulsunAldangi,
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
    if (mur.baritsaaTulbur > 0) {
      let baritsaaniiMur = {
        gereeniiId: mur._id,
        guilgeeniiId: guilgee._id,
        orlogo: mur.baritsaaTulbur,
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
    var aldangiDun =
      Math.round(
        ((dans.bank === "tdb"
          ? guilgee.Amt
          : guilgee.amount || guilgee.tranAmount) +
          Number.EPSILON) *
          10000
      ) / 10000;
    var aldangiinUldegdel =
      Math.round((mur.aldangiinUldegdel + Number.EPSILON) * 10000) / 10000;
    if (
      aldangiinUldegdel > (mur.tulsunAldangi || 0) &&
      (mur.tulsunAldangi || 0) < aldangiDun - guilgee.kholbosonDun
    ) {
      aldaa.push(
        t("талбайн холбох гүйлгээний алдангийн дүнг түрүүлж төлнө үү", {
          too: mur.talbainDugaar,
        })
      );
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
  const [khaagdsanGereeEsekh, setKhaagdsanGereeEsekh] = useState(false);
  const [guilgeeniiTailbar, setGuilgeeniiTailbar] = useState();
  const [magadlaltaiGereenuud, setMagadlaltaiGereenuud] = React.useState([]);
  const [expandedAldangi, setExpandedAldangi] = React.useState({});
  const [expandedTurees, setExpandedTurees] = React.useState({});
  const [transactionInputs, setTransactionInputs] = React.useState({}); // Store inputs by contract index and transaction ID
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
          }
          setLoadingBaritsaa(false);
        }
        setLoading(true);
        if (!!guilgeeniiTailbar)
          undsenGuilgee?.forEach((mur) => {
            mur.tailbar = guilgeeniiTailbar;
          });

        if (undsenGuilgee.length > 0)
          uilchilgee(token)
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
              if (gereenuud.find((a) => a._id === mur._id)) {
                notification.warning({
                  message: t("Анхаар"),
                  description: t("Гэрээ сонгогдсон байна"),
                });
                return;
              }
              uilchilgee(token)
                .post("/uldegdelBodyo", {
                  barilgiinId,
                  gereeniiDugaar: mur.gereeniiDugaar,
                })
                .then(({ data }) => {
                  if (!!data) {
                    mur.uldegdel = data.uldegdel;
                    setGereenuud((a) => {
                      a.push(mur);
                      return [...a];
                    });
                    setVisible(false);
                  }
                })
                .catch(aldaaBarigch);
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
            value += b[mur] || 0;
          });
      } else {
        value += b.baritsaaTulbur || 0;
        value += b.tureesiinTulbur || 0;
        value += b.tulsunAldangi || 0;
      }
      return _.toNumber(a + value);
    }, 0);
    return sum + (data.kholbosonDun || 0);
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
    let sum = zuruuZun(index, talbar);
    if (sum + _.toNumber(parser(target.value)) > guilgeeniiDun) {
      target.value = formatter(guilgeeniiDun - sum);
      notification.warning({
        message: t("Анхаар"),
        description: t("Гүйлгээний дүнгээс холбох дүн илүү гарсан байна"),
      });
    }
    setGereenuud((a) => {
      _.set(a, `${index}.${talbar}`, _.toNumber(parser(target.value)));
      return [...a];
    });
  }

  function onDoubleClickKholbokhDun(target, index, talbar) {
    let sum = zuruuZun(index, talbar);

    if (
      "tulsunAldangi" === talbar &&
      guilgeeniiDun - sum > gereenuud[index].aldangiinUldegdel
    )
      sum = guilgeeniiDun - gereenuud[index].aldangiinUldegdel;

    if (
      "baritsaaTulbur" === talbar &&
      guilgeeniiDun - sum >
        (gereenuud[index]?.baritsaaAvakhDun || 0) -
          (gereenuud[index]?.baritsaaniiUldegdel || 0)
    ) {
      let baritsaadun =
        (gereenuud[index]?.baritsaaAvakhDun || 0) -
        (gereenuud[index]?.baritsaaniiUldegdel || 0);
      sum += guilgeeniiDun - sum - baritsaadun;
    }

    if (sum < guilgeeniiDun) {
      target.value = formatNumber(guilgeeniiDun - sum);
      setGereenuud((a) => {
        _.set(a, `${index}.${talbar}`, _.toNumber(parser(target.value)));
        return [...a];
      });
    }
  }

  const zuruuDun = useMemo(() => {
    let sum = zuruuZun();
    return guilgeeniiDun - sum;
  }, [gereenuud]);

  function inputChange(e) {
    setGuilgeeniiTailbar(e.target.value);
  }

  return (
    <div className="flex w-full flex-col space-y-2">
      {magadlaltaiGereenuud?.length > 0 && (
        <div>
          <div className="py-2 text-lg font-medium">
            {t("Магадлалтай гэрээ")}
          </div>

          <div className="max-h-[calc(5*2.5rem)] overflow-y-auto">
            {magadlaltaiGereenuud?.map((mur, i) => (
              <div
                className="grid grid-cols-3 gap-2 rounded-md border border-gray-400 p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                key={`gereeniisongolt${i}`}
              >
                <div className="truncate px-2">{mur.talbainDugaar}</div>
                <div className="px-2">{mur.register}</div>
                <div className="px-2">{mur.ner}</div>
              </div>
            ))}
          </div>
        </div>
      )}
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
      <div className="space-y-2 px-2" style={{ height: "25rem" }}>
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
            {(geree?.baritsaaAvakhDun || 0) -
              (geree?.baritsaaniiUldegdel || 0) >
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
            {(geree?.aldangiinUldegdel || 0) > 0 && (
              <div className="w-full space-y-2">
                <div className="box grid w-full grid-cols-3 rounded-md border border-gray-400 bg-gray-100 p-1">
                  <div className="col-span-4">{t("Алдангийн үлдэгдэл")}</div>
                  <div>{formatNumber(geree?.aldangiinUldegdel || 0, 2)}</div>
                  <div>{geree.talbainDugaar}</div>
                  <div className="flex items-center gap-1 text-right text-green-600">
                    <input
                      className="w-full rounded-md border border-gray-400 bg-gray-200 px-2 text-right dark:bg-gray-700"
                      placeholder="Барьцаа дүн"
                      value={formatter(geree.tulsunAldangi)}
                      onDoubleClick={({ target }) =>
                        onDoubleClickKholbokhDun(target, index, "tulsunAldangi")
                      }
                      onChange={({ target }) => {
                        onChangeKholbokhDun(target, index, "tulsunAldangi");
                      }}
                    />
                  </div>
                </div>
                {expandedAldangi[index] && (
                  <div className="box grid w-full grid-cols-3 gap-2 rounded-md border border-gray-400 bg-gray-100 p-2">
                    <DansniiKhuulgaDisplay
                      dans={dans}
                      token={token}
                      baiguullagiinId={baiguullagiinId}
                      data={data}
                    />
                  </div>
                )}
              </div>
            )}

            {geree && (
              <div className="w-full space-y-2">
                <div className="box grid w-full grid-cols-3 rounded-md border border-gray-400 bg-gray-100 p-1">
                  <div className="col-span-4">{t("Түрээсийн үлдэгдэл")}</div>
                  <div
                    className={`text-${
                      geree.uldegdel > 0 ? "red" : "green"
                    }-500`}
                  >
                    {formatNumber(geree.uldegdel, 2)}
                  </div>
                  <div>{geree.talbainDugaar}</div>
                  <div className="flex items-end justify-end gap-1 text-right text-green-600">
                   
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
                    <GereeniiGuilgeeTuukhDisplay
                      geree={geree}
                      token={token}
                      index={index}
                      onChangeKholbokhDun={onChangeKholbokhDun}
                      onDoubleClickKholbokhDun={onDoubleClickKholbokhDun}
                      guilgeeniiDun={guilgeeniiDun}
                      zuruuZun={zuruuZun}
                      transactionInputs={transactionInputs}
                      setTransactionInputs={setTransactionInputs}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <Divider />

        <div className="grid w-full grid-cols-2 divide-x-2 px-2">
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
        <Divider />
      </div>
    </div>
  );
}

export default React.forwardRef(GuilgeeNiiluulekh);
