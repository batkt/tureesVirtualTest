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
import useJagsaalt from "hooks/useJagsaalt";
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

const getTransactionId = (transaction, month, idx, prefix = 'turees') => 
  transaction._id ? `${transaction._id}-${month}-${idx}-${(transaction.tailbar || prefix).replace(/\s+/g, '-')}` 
  : `${month}-${idx}-${(transaction.tailbar || prefix).replace(/\s+/g, '-')}`;

const parseNum = (val) => val === '' || val === null || val === undefined ? 0 : (typeof val === 'number' ? val : parseFloat(val) || 0);

function GereeniiGuilgeeTuukhDisplay({ geree, token, index, onChangeKholbokhDun, onDoubleClickKholbokhDun, guilgeeniiDun, zuruuZun, zuruuDun, transactionInputs, setTransactionInputs }) {
  const [focusedInputs, setFocusedInputs] = React.useState({});
  const [rawInputValues, setRawInputValues] = React.useState({});
  const [expandedMonths, setExpandedMonths] = useState({});
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
    if (!geree?._id || !guilgeeniiTuukh?.length) return [];

    let balance = 0;
    const byMonth = {};
    guilgeeniiTuukh.forEach((t) => {
      if (t.uldegdel == null) {
        balance += (t.tulukhDun || 0) - (t.tulsunDun || 0) - (t.khungulult || t.khyamdral || 0);
        if (t.turul === "khungulult" && balance < 0) balance = 0;
        t.uldegdel = balance;
      } else balance = t.uldegdel;
      
      const date = t.ognoo || t.guilgeeKhiisenOgnoo;
      if (date && moment(date).isValid()) {
        const month = moment(date).format("YYYY-MM");
        (byMonth[month] = byMonth[month] || []).push(t);
      }
    });

    const months = Object.keys(byMonth).sort((a, b) => b.localeCompare(a));

    return months.map((month, i) => {
      const ts = byMonth[month];
      const expenses = ts.filter(t => t.turul !== "khungulult" && (t.tulukhDun || 0) > 0);
      
      let toSubtract = ts.reduce((sum, t) => sum + (t.tulsunDun || 0) + (t.turul === "khungulult" ? (t.khungulult || t.khyamdral || 0) : 0), 0);
      if (i < months.length - 1) {
        const prev = byMonth[months[i + 1]].filter(t => t.uldegdel != null);
        if (prev.length) {
          const lastBalance = [...prev].sort((a, b) => moment(b.ognoo || b.guilgeeKhiisenOgnoo).diff(moment(a.ognoo || a.guilgeeKhiisenOgnoo)))[0].uldegdel;
          if (lastBalance < 0) toSubtract += Math.abs(lastBalance);
        }
      }

      let remaining = toSubtract;
      const adjusted = expenses.map((t) => {
        const orig = t.tulukhDun || 0;
        if (orig === 0 || remaining <= 0) return { ...t, originalTulukhDun: orig, tulukhDun: orig };
        const red = Math.min(orig, remaining);
        remaining -= red;
        return { ...t, originalTulukhDun: orig, tulukhDun: orig - red };
      });

      const filtered = adjusted.filter(t => (t.tulukhDun || 0) > 0 || (t.uldegdel != null && t.uldegdel !== 0));
      filtered.sort((a, b) => moment(b.ognoo || b.guilgeeKhiisenOgnoo).diff(moment(a.ognoo || a.guilgeeKhiisenOgnoo)));

      return { month, monthLabel: moment(month, "YYYY-MM").format("YYYY оны MM сар"), transactions: filtered, carryOver: remaining };
    }).map((m, i, arr) => {
      if (m.carryOver > 0 && i < arr.length - 1) {
        let rem = m.carryOver;
        arr[i + 1].transactions.forEach((t) => {
          if (rem <= 0 || !(t.tulukhDun || 0)) return;
          if (!t.originalTulukhDun) t.originalTulukhDun = t.tulukhDun || 0;
          const red = Math.min(t.tulukhDun || 0, rem);
          t.tulukhDun -= red;
          rem -= red;
        });
        if (rem > 0) arr[i + 1].carryOver = (arr[i + 1].carryOver || 0) + rem;
      }
      return m;
    }).filter(m => m.transactions.length > 0);
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
      <div className="col-span-3">
        {transactionsByMonth && transactionsByMonth.length > 0 ? (
          <>
            {transactionsByMonth.map(({ month, monthLabel, transactions }) => {
              const monthTotal = transactions.reduce((sum, transaction, idx) => {
                const transactionId = transaction._id 
                  ? `${transaction._id}-${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}` 
                  : `${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}`;
                const storedValue = transactionInputs?.[index]?.[transactionId];
                const inputAmount = storedValue !== undefined && storedValue !== null 
                  ? (typeof storedValue === 'number' ? storedValue : parseFloat(storedValue) || 0)
                  : 0;
                return sum + inputAmount;
              }, 0);
              const roundedMonthTotal = Math.round(monthTotal * 100) / 100;
              
              const hasNonZeroValue = transactions.some((transaction, idx) => {
                const transactionId = getTransactionId(transaction, month, idx);
                const originalAmount = transaction.tulukhDun || 0;
                const inputAmount = parseNum(transactionInputs?.[index]?.[transactionId]);
                return originalAmount !== 0 || inputAmount !== 0;
              });
              
              if (!hasNonZeroValue && roundedMonthTotal === 0) {
                return null;
              }
              
              const isExpanded = expandedMonths[month] || false;

              return (
              <div key={month} className="border-2 border-gray-400 rounded-md mb-4 overflow-hidden">
                <div 
                  className="flex justify-between items-center w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-3 border-b border-gray-300"
                  onClick={() => {
                    setExpandedMonths(prev => ({
                      ...prev,
                      [month]: !prev[month]
                    }));
                  }}
                >
                  <span className="font-medium text-lg">{monthLabel}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base text-gray-500">
                      {transactions.length} {t("гүйлгээ")}
                    </span>
                    {isExpanded ? <UpOutlined /> : <DownOutlined />}
                  </div>
                </div>
                <div className="px-4 py-3 border-b border-gray-300 bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-start items-start">
                    <span className="font-semibold text-lg mr-4">{t("Нийт")}:</span>
                    <span className="font-semibold text-lg">{formatNumber(roundedMonthTotal, 2)}</span>
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-2 py-1.5">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                    <thead className="bg-gray-200 dark:bg-gray-700">
                      <tr>
                        <th className="border border-gray-300 px-3 py-1.5 text-center text-sm font-semibold">{t("Огноо")}</th>
                        <th className="border border-gray-300 px-3 py-1.5 text-center text-sm font-semibold">{t("Авлага")}</th>
                        <th className="border border-gray-300 px-3 py-1.5 text-center text-sm font-semibold">{t("Дүн")}</th>
                        <th className="border border-gray-300 px-3 py-1.5 text-center text-sm font-semibold">{t("Төлөх дүн")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, idx) => {
                        const transactionId = getTransactionId(transaction, month, idx);
                        const storedValue = transactionInputs?.[index]?.[transactionId];
                        const isFocused = focusedInputs[transactionId];
                        const rawValue = rawInputValues[transactionId];
                        
                        const originalAmount = transaction.tulukhDun || 0;
                        const inputAmount = parseNum(storedValue);
                        
                        if (originalAmount === 0 && inputAmount === 0) {
                          return null;
                        }
                        
                        let displayValue = "";
                        if (isFocused && rawValue !== undefined) {
                          displayValue = rawValue;
                        } else {
                          const numValue = storedValue !== undefined && storedValue !== null 
                            ? (typeof storedValue === 'number' ? storedValue : parseFloat(storedValue) || 0)
                            : undefined;
                          if (numValue !== undefined && numValue !== null && numValue !== 0) {
                            displayValue = formatNumber(Math.round(numValue * 100) / 100, 2);
                          }
                        }
                        const dateField = transaction.ognoo || transaction.guilgeeKhiisenOgnoo;
                        const displayDate = dateField && moment(dateField).isValid() 
                          ? moment(dateField).format("YYYY-MM-DD")
                          : "";
                        
                        return (
                        <tr
                          key={`tuukh-${index}-${month}-${idx}`}
                          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="border border-gray-300 px-3 py-1.5 text-center text-sm">
                            {displayDate}
                          </td>
                          <td className="border border-gray-300 px-3 py-1.5 truncate max-w-xs text-sm">
                            {transaction.tailbar || "Түрээс"}
                          </td>
                          <td className="border border-gray-300 px-3 py-1.5 text-right text-sm">
                            {/* Display adjusted amount (after subtracting payments/discounts and carryover) */}
                            {(transaction.tulukhDun && transaction.tulukhDun !== 0) ? formatNumber(transaction.tulukhDun, 2) : ""}
                          </td>
                         
                         
                          <td className="border border-gray-300 px-3 py-1.5">
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-400 bg-gray-200 px-2 py-1.5 text-right text-sm dark:bg-gray-700 dark:text-gray-200"
                    placeholder="0.00"
                    value={displayValue}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
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
                      
                      const transactionId = getTransactionId(transaction, month, idx);
                      
                      const formattedValue = value !== 0 ? formatNumber(value, 2) : "";
                      setRawInputValues((prev) => ({
                        ...prev,
                        [transactionId]: formattedValue
                      }));
                      setFocusedInputs((prev) => ({ ...prev, [transactionId]: true }));
                      
                      e.target.focus();
                      e.target.select();
                      
                      if (setTransactionInputs) {
                        setTransactionInputs((prev) => {
                          const currentTotal = prev[index] 
                            ? Object.values(prev[index]).reduce((sum, val) => {
                                const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                                return sum + numVal;
                              }, 0)
                            : 0;
                          const currentTotalRounded = Math.round(currentTotal * 100) / 100;
                          
                          const newTotal = currentTotalRounded - (prev[index]?.[transactionId] || 0) + value;
                          const newTotalRounded = Math.round(newTotal * 100) / 100;
                          
                          if (zuruuZun && guilgeeniiDun !== undefined && guilgeeniiDun !== null) {
                            const sum = zuruuZun(index, "tureesiinTulbur");
                            const totalWouldBe = Math.round((sum + newTotalRounded) * 100) / 100;
                            const guilgeeniiDunRounded = Math.round(guilgeeniiDun * 100) / 100;
                            
                            if (totalWouldBe > guilgeeniiDunRounded) {
                              const maxAllowed = Math.max(0, guilgeeniiDunRounded - sum - (currentTotalRounded - (prev[index]?.[transactionId] || 0)));
                              value = Math.max(0, Math.round(maxAllowed * 100) / 100);
                              const cappedFormattedValue = formatNumber(value, 2);
                              setRawInputValues((prev) => ({
                                ...prev,
                                [transactionId]: cappedFormattedValue
                              }));
                            }
                          }
                          
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
                            onChangeKholbokhDun(syntheticTarget, index, "tureesiinTulbur", true);
                          }
                          
                          return updatedInputs;
                        });
                      } else if (onChangeKholbokhDun) {
                        onChangeKholbokhDun(e.target, index, "tureesiinTulbur");
                      }
                    }}
                    onFocus={(e) => {
                      e.stopPropagation();
                      const transactionId = transaction._id 
                        ? `${transaction._id}-${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}` 
                        : `${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}`;
                      setFocusedInputs((prev) => ({ ...prev, [transactionId]: true }));
                      const currentValue = transactionInputs?.[index]?.[transactionId];
                      if (currentValue !== undefined && currentValue !== null) {
                        const numVal = typeof currentValue === 'number' ? currentValue : parseFloat(currentValue) || 0;
                        const roundedVal = Math.round(numVal * 100) / 100;
                        setRawInputValues((prev) => ({
                          ...prev,
                          [transactionId]: roundedVal !== 0 ? formatNumber(roundedVal, 2) : ""
                        }));
                      }
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                      const { target } = e;
                      let inputValue = target.value;
                      const transactionId = transaction._id 
                        ? `${transaction._id}-${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}` 
                        : `${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}`;
                      
                      if (inputValue === '') {
                        setRawInputValues((prev) => ({ ...prev, [transactionId]: '' }));
                        if (setTransactionInputs) {
                          setTransactionInputs((prev) => {
                            const updatedInputs = {
                              ...prev,
                              [index]: {
                                ...(prev[index] || {}),
                                [transactionId]: 0,
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
                        }
                        return;
                      }
                      
                      const cleaned = inputValue.replace(/,/g, '').trim();
                      
                      if (!/^-?\d*\.?\d*$/.test(cleaned)) {
                        return; // Invalid input, don't update
                      }
                      
                      let formattedValue = '';
                      let value = 0;
                      let isValidNumber = false;
                      
                      if (cleaned === '' || cleaned === '.') {
                        formattedValue = cleaned;
                      } else {
                        const parts = cleaned.split('.');
                        const intPart = parts[0] || '';
                        const decPart = parts[1] || '';
                        
                        if (intPart === '') {
                          if (decPart) {
                            const limitedDec = decPart.length > 2 ? decPart.substring(0, 2) : decPart;
                            formattedValue = `.${limitedDec}`;
                            const parsedValue = parseFloat(`0.${limitedDec}`);
                            value = isNaN(parsedValue) ? 0 : parsedValue;
                            isValidNumber = !isNaN(parsedValue);
                          } else {
                            formattedValue = '.';
                          }
                        } else {
                          const formattedInt = parseInt(intPart, 10).toLocaleString('en-US');
                          
                          if (decPart) {
                            const limitedDec = decPart.length > 2 ? decPart.substring(0, 2) : decPart;
                            formattedValue = `${formattedInt}.${limitedDec}`;
                            const parsedValue = parseFloat(cleaned);
                            value = isNaN(parsedValue) ? 0 : parsedValue;
                            isValidNumber = !isNaN(parsedValue);
                          } else {
                            if (cleaned.endsWith('.')) {
                              formattedValue = `${formattedInt}.`;
                            } else {
                              formattedValue = formattedInt;
                              const parsedValue = parseFloat(cleaned);
                              value = isNaN(parsedValue) ? 0 : parsedValue;
                              isValidNumber = !isNaN(parsedValue);
                            }
                          }
                        }
                      }
                      
                      setRawInputValues((prev) => ({ ...prev, [transactionId]: formattedValue }));
                      
                      const maxDun = transaction.tulukhDun || 0;
                      let cappedValue = value;
                      if (isValidNumber && maxDun > 0 && value > maxDun) {
                        cappedValue = Math.round(maxDun * 100) / 100;
                        const cappedFormatted = formatNumber(cappedValue, 2);
                        setRawInputValues((prev) => ({
                          ...prev,
                          [transactionId]: cappedFormatted
                        }));
                      }
                      
                      if (setTransactionInputs) {
                        setTransactionInputs((prev) => {
                          const valueToStore = isValidNumber ? cappedValue : (prev[index]?.[transactionId] || 0);
                          
                          const updatedInputs = {
                            ...prev,
                            [index]: {
                              ...(prev[index] || {}),
                              [transactionId]: valueToStore,
                            },
                          };
                          
                          const contractInputs = updatedInputs[index] || {};
                          const total = Object.values(contractInputs).reduce((sum, val) => {
                            const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                            return sum + numVal;
                          }, 0);
                          
                          const roundedTotal = Math.round(total * 100) / 100;
                          
                          if (zuruuZun && guilgeeniiDun !== undefined && guilgeeniiDun !== null) {
                            const sum = zuruuZun(index, "tureesiinTulbur");
                            
                            const totalWouldBe = Math.round((sum + roundedTotal) * 100) / 100;
                            const guilgeeniiDunRounded = Math.round(guilgeeniiDun * 100) / 100;
                            
                            if (totalWouldBe > guilgeeniiDunRounded) {
                              return prev;
                            }
                          }
                          
                          if (onChangeKholbokhDun) {
                            const syntheticTarget = { value: formatter(roundedTotal) };
                            onChangeKholbokhDun(syntheticTarget, index, "tureesiinTulbur", true); // Skip validation since we already validated
                          }
                          
                          return updatedInputs;
                        });
                      } else if (onChangeKholbokhDun) {
                        onChangeKholbokhDun(target, index, "tureesiinTulbur");
                      }
                    }}
                    onBlur={(e) => {
                      e.stopPropagation();
                      const { target } = e;
                      const transactionId = transaction._id 
                        ? `${transaction._id}-${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}` 
                        : `${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}`;
                      setFocusedInputs((prev) => {
                        const updated = { ...prev };
                        delete updated[transactionId];
                        return updated;
                      });
                      
                      setRawInputValues((prev) => {
                        const updated = { ...prev };
                        delete updated[transactionId];
                        return updated;
                      });
                      
                      if (setTransactionInputs) {
                        setTransactionInputs((prev) => {
                          const storedValue = prev[index]?.[transactionId];
                          if (storedValue !== undefined && storedValue !== null) {
                            const numValue = typeof storedValue === 'number' ? storedValue : parseFloat(storedValue) || 0;
                            let roundedValue = Math.round(numValue * 100) / 100;
                            
                            const maxDun = transaction.tulukhDun || 0;
                            if (roundedValue > maxDun && maxDun > 0) {
                              roundedValue = Math.round(maxDun * 100) / 100;
                            }
                            
                            const contractInputs = {
                              ...(prev[index] || {}),
                              [transactionId]: roundedValue,
                            };
                            const total = Object.values(contractInputs).reduce((sum, val) => {
                              const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                              return sum + numVal;
                            }, 0);
                            const roundedTotal = Math.round(total * 100) / 100;
                            
                            let finalValue = roundedValue;
                            if (zuruuZun && guilgeeniiDun !== undefined && guilgeeniiDun !== null) {
                              const sum = zuruuZun(index, "tureesiinTulbur");
                              const totalWouldBe = Math.round((sum + roundedTotal) * 100) / 100;
                              const guilgeeniiDunRounded = Math.round(guilgeeniiDun * 100) / 100;
                              
                              if (totalWouldBe > guilgeeniiDunRounded) {
                                const maxAllowed = Math.max(0, guilgeeniiDunRounded - sum);
                                const cappedTotal = Math.round(maxAllowed * 100) / 100;
                                
                                const currentTotalWithoutThis = roundedTotal - roundedValue;
                                finalValue = Math.max(0, cappedTotal - currentTotalWithoutThis);
                                finalValue = Math.round(finalValue * 100) / 100;
                              }
                            }
                            
                            if (finalValue !== numValue) {
                              setRawInputValues((prev) => ({
                                ...prev,
                                [transactionId]: finalValue !== 0 ? formatNumber(finalValue, 2) : ""
                              }));
                            }
                            
                            const finalContractInputs = {
                              ...(prev[index] || {}),
                              [transactionId]: finalValue,
                            };
                            const finalTotal = Object.values(finalContractInputs).reduce((sum, val) => {
                              const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                              return sum + numVal;
                            }, 0);
                            const finalRoundedTotal = Math.round(finalTotal * 100) / 100;
                            
                            if (onChangeKholbokhDun) {
                              const syntheticTarget = { value: formatter(finalRoundedTotal) };
                              onChangeKholbokhDun(syntheticTarget, index, "tureesiinTulbur", false);
                            }
                            
                            return {
                              ...prev,
                              [index]: finalContractInputs,
                            };
                          }
                          return prev;
                        });
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
                  </div>
                )}
              </div>
              );
            })}
          </>
        ) : (
          <div className="text-xs text-gray-400 p-2">
            {t("Мэдээлэл бэлтгэж байна...")}
          </div>
        )}
      </div>
    </>
  );
}

function TureesiinUldegdelDisplay({ geree, token, index, expandedTurees, setExpandedTurees, onChangeKholbokhDun, onDoubleClickKholbokhDun, guilgeeniiDun, zuruuZun, zuruuDun, transactionInputs, setTransactionInputs }) {
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

  const calculatedBalance = useMemo(() => {
    if (!guilgeeniiTuukh || !Array.isArray(guilgeeniiTuukh) || guilgeeniiTuukh.length === 0) {
      return geree.uldegdel || 0;
    }

    let netBalance = 0;
    guilgeeniiTuukh.forEach((transaction) => {
      netBalance += (transaction.tulukhDun || 0);
      netBalance -= (transaction.tulsunDun || 0);
      netBalance -= (transaction.khungulult || transaction.khyamdral || 0);
    });

    return netBalance;
  }, [guilgeeniiTuukh, geree.uldegdel]);

  return (
    <div className="w-full space-y-2">
      <div 
        onClick={() =>
          setExpandedTurees((prev) => ({
            ...prev,
            [index]: !prev[index],
          }))
        }
        className="box grid w-full grid-cols-3 cursor-pointer rounded-md border border-gray-400 bg-gray-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <div className="col-span-4">{t("Түрээсийн үлдэгдэл")}</div>
        <div
          className={`text-${
            calculatedBalance > 0 ? "red" : "green"
          }-500`}
        >
          {formatNumber(calculatedBalance, 2)}
        </div>
        <div>{geree.talbainDugaar}</div>
        <div className="flex items-end justify-end gap-1 text-right text-green-600">
          {expandedTurees[index] ? (
            <UpOutlined />
          ) : (
            <DownOutlined />
          )}
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
            zuruuDun={zuruuDun}
            transactionInputs={transactionInputs}
            setTransactionInputs={setTransactionInputs}
          />
        </div>
      )}
    </div>
  );
}

function AldangiinMonthlySummary({ geree, token }) {
  const [expandedMonths, setExpandedMonths] = useState({});
  
  const query = useMemo(() => {
    return {
      gereeniiId: geree?._id,
    };
  }, [geree?._id]);

  const aldangiinTuukh = useJagsaalt(
    "/aldangiinTuukh",
    query,
    undefined,
    undefined,
    undefined,
    token
  );

  const monthlyPenaltySummaries = useMemo(() => {
    if (!geree?._id || !aldangiinTuukh?.jagsaalt) {
      return [];
    }

    const penaltyRecords = aldangiinTuukh.jagsaalt || [];

    if (!Array.isArray(penaltyRecords) || penaltyRecords.length === 0) {
      return [];
    }

    const monthlyData = {};
    
    penaltyRecords.forEach((penaltyRecord) => {
      const dateField = penaltyRecord.aldangiBodsonOgnoo || 
                       penaltyRecord.ognoo || 
                       penaltyRecord.aldangiinOgnoo;
      
      if (dateField && moment(dateField).isValid()) {
        const monthKey = moment(dateField).format("YYYY-MM");
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            monthLabel: moment(monthKey, "YYYY-MM").format("YYYY оны MM сар"),
            totalAldangi: 0,
            totalTulsunAldangi: 0,
            transactions: [],
          };
        }
        
        const penaltyAmount = penaltyRecord.aldangi || 0; // Алданги field
        const calculatedPenalty = penaltyRecord.niitAldangi || 0; // Нийт алданги (total penalty)
        
        monthlyData[monthKey].transactions.push({
          ...penaltyRecord,
          tailbar: penaltyRecord.tailbar || t("Алданг"),
          tulukhAldangi: penaltyAmount,
          tulsunAldangi: calculatedPenalty,
          ognoo: dateField,
        });
        
        if (penaltyAmount && penaltyAmount !== 0) {
          monthlyData[monthKey].totalAldangi += penaltyAmount;
        }
        
        if (calculatedPenalty && calculatedPenalty !== 0) {
          monthlyData[monthKey].totalTulsunAldangi += calculatedPenalty;
        }
      }
    });

    const summaries = Object.values(monthlyData)
      .map((data) => ({
        ...data,
        netAldangi: Math.round((data.totalAldangi - data.totalTulsunAldangi) * 100) / 100,
      }))
      .filter((data) => data.totalAldangi > 0 || data.totalTulsunAldangi > 0)
      .sort((a, b) => b.month.localeCompare(a.month));
    
    if (summaries.length === 0 && geree?.aldangiinUldegdel && geree.aldangiinUldegdel > 0) {
      return [{
        month: 'no-breakdown',
        monthLabel: t("Сар бүрийн дэлгэрэнгүй олдсонгүй"),
        totalAldangi: geree.aldangiinUldegdel || 0,
        totalTulsunAldangi: 0,
        netAldangi: geree.aldangiinUldegdel || 0,
        isTotalOnly: true,
      }];
    }
    
    return summaries;
  }, [geree?._id, aldangiinTuukh, geree?.aldangiinUldegdel]);

  if (!monthlyPenaltySummaries || monthlyPenaltySummaries.length === 0) {
    return null;
  }

  const dropdownContent = (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 min-w-[600px] max-h-[600px] overflow-y-auto">
      <div className="space-y-2">
        {monthlyPenaltySummaries.map((summary) => {
          const isExpanded = expandedMonths[summary.month];
          const hasTransactions = summary.transactions && summary.transactions.length > 0;
          
          return (
            <div key={summary.month} className="border border-gray-300 rounded-md">
              <div
                className={`flex justify-between items-center p-2 ${summary.isTotalOnly ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'} rounded-t-md`}
                onClick={() => {
                  if (!summary.isTotalOnly && hasTransactions) {
                    setExpandedMonths(prev => ({
                      ...prev,
                      [summary.month]: !prev[summary.month]
                    }));
                  }
                }}
              >
                <span className={`text-sm ${summary.isTotalOnly ? 'text-gray-500 italic' : 'font-medium'}`}>
                  {summary.monthLabel}
                  {hasTransactions && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({summary.transactions.length} {t("гүйлгээ")})
                    </span>
                  )}
                </span>
                <div className="flex flex-col items-end">
                  {!summary.isTotalOnly && (
                    <>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t("Алданги")}: {formatNumber(summary.totalAldangi, 2)}
                      </span>
                      {summary.totalTulsunAldangi > 0 && (
                        <span className="text-sm text-red-600">
                          {t("Бодогдсон алданги")}: -{formatNumber(summary.totalTulsunAldangi, 2)}
                        </span>
                      )}
                    </>
                  )}
                  <span className="text-sm font-semibold text-green-600">
                    {summary.isTotalOnly ? t("Нийт үлдэгдэл") : t("Нийт")}: {formatNumber(summary.netAldangi, 2)}
                  </span>
                </div>
              </div>
              
              {isExpanded && hasTransactions && (
                <div className="border-t border-gray-300 p-2">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead className="bg-gray-200 dark:bg-gray-700">
                        <tr>
                          <th className="border border-gray-300 px-2 py-1 text-center font-semibold">{t("Авлага")}</th>
                          <th className="border border-gray-300 px-2 py-1 text-center font-semibold">{t("Алданги")}</th>
                          <th className="border border-gray-300 px-2 py-1 text-center font-semibold">{t("Бодогдсон алданги")}</th>
                          <th className="border border-gray-300 px-2 py-1 text-center font-semibold">{t("Огноо")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.transactions.map((transaction, idx) => {
                          const dateField = transaction.ognoo || transaction.guilgeeKhiisenOgnoo;
                          const displayDate = dateField && moment(dateField).isValid() 
                            ? moment(dateField).format("YYYY-MM-DD")
                            : "";
                          
                          return (
                            <tr
                              key={`${summary.month}-${idx}`}
                              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="border border-gray-300 px-2 py-1 truncate max-w-xs">
                                {transaction.tailbar || t("Алданги")}
                              </td>
                              <td className="border border-gray-300 px-2 py-1 text-right">
                                {(transaction.tulukhAldangi && transaction.tulukhAldangi !== 0) 
                                  ? formatNumber(transaction.tulukhAldangi, 2) 
                                  : ""}
                              </td>
                              <td className="border border-gray-300 px-2 py-1 text-right text-red-600">
                                {(transaction.tulsunAldangi && transaction.tulsunAldangi !== 0) 
                                  ? formatNumber(transaction.tulsunAldangi, 2) 
                                  : ""}
                              </td>
                              <td className="border border-gray-300 px-2 py-1 text-center">
                                {displayDate}
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
        })}
      </div>
    </div>
  );

  return (
    <Dropdown
      overlay={dropdownContent}
      trigger={["click"]}
      placement="bottomLeft"
    >
      <span 
        className="cursor-pointer text-blue-600 hover:text-blue-800 underline text-sm ml-2"
        onClick={(e) => e.stopPropagation()}
      >
        {t("Сар бүрийн дүн")}
      </span>
    </Dropdown>
  );
}

function AldangiinTuukhDisplay({ geree, token, index, onChangeKholbokhDun, transactionInputs, setTransactionInputs }) {
  const [focusedInputs, setFocusedInputs] = React.useState({});
  const [rawInputValues, setRawInputValues] = React.useState({});
  const [expandedMonths, setExpandedMonths] = useState({});
  
  const query = useMemo(() => {
    return {
      gereeniiId: geree?._id,
    };
  }, [geree?._id]);

  const aldangiinTuukh = useJagsaalt(
    "/aldangiinTuukh",
    query,
    undefined,
    undefined,
    undefined,
    token
  );

  const penaltyTransactionsByMonth = useMemo(() => {
    if (!geree?._id || !aldangiinTuukh?.jagsaalt) {
      return [];
    }

    const penaltyRecords = aldangiinTuukh.jagsaalt || [];

    if (!Array.isArray(penaltyRecords) || penaltyRecords.length === 0) {
      return [];
    }

    const allGrouped = {};
    penaltyRecords.forEach((penaltyRecord) => {
      const dateField = penaltyRecord.aldangiBodsonOgnoo || 
                       penaltyRecord.ognoo || 
                       penaltyRecord.aldangiinOgnoo;
      
      if (dateField && moment(dateField).isValid()) {
        const monthKey = moment(dateField).format("YYYY-MM");
        if (!allGrouped[monthKey]) {
          allGrouped[monthKey] = [];
        }
        
        const penaltyAmount = penaltyRecord.aldangi || 0; // Алданги field
        const calculatedPenalty = penaltyRecord.niitAldangi || 0; // Нийт алданги (total penalty)
        
        allGrouped[monthKey].push({
          ...penaltyRecord,
          tailbar: penaltyRecord.tailbar || t("Алданг"),
          tulukhAldangi: penaltyAmount,
          tulsunAldangi: calculatedPenalty,
          ognoo: dateField,
        });
      }
    });

    const sortedMonthKeys = Object.keys(allGrouped).sort((a, b) => b.localeCompare(a));

    return sortedMonthKeys.map((month) => ({
      month,
      monthLabel: moment(month, "YYYY-MM").format("YYYY оны MM сар"),
      transactions: allGrouped[month].sort((a, b) => {
        const dateA = moment(a.ognoo || a.guilgeeKhiisenOgnoo);
        const dateB = moment(b.ognoo || b.guilgeeKhiisenOgnoo);
        return dateB.diff(dateA);
      }),
    })).filter((month) => month.transactions && month.transactions.length > 0);
  }, [geree?._id, aldangiinTuukh]);

  if (!penaltyTransactionsByMonth || penaltyTransactionsByMonth.length === 0) {
    return null;
  }

  return (
    <div className="col-span-3">
      {penaltyTransactionsByMonth.map(({ month, monthLabel, transactions }) => {
        const totalAmount = transactions.reduce((sum, transaction) => {
          return sum + (transaction.tulukhAldangi || 0);
        }, 0);
        const roundedTotalAmount = Math.round(totalAmount * 100) / 100;
        
        const summaryTransactionId = `aldangi-summary-${month}`;
        const storedValue = transactionInputs?.[index]?.[summaryTransactionId];
        const monthTotal = storedValue !== undefined && storedValue !== null 
          ? (typeof storedValue === 'number' ? storedValue : parseFloat(storedValue) || 0)
          : 0;
        const roundedMonthTotal = Math.round(monthTotal * 100) / 100;
        
        if (roundedTotalAmount === 0 && roundedMonthTotal === 0) {
          return null;
        }
        
        const isExpanded = expandedMonths[month] || false;

        return (
          <div key={month} className="border-2 border-gray-400 rounded-md mb-4 overflow-hidden">
            <div 
              className="flex justify-between items-center w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-3 border-b border-gray-300"
              onClick={() => {
                setExpandedMonths(prev => ({
                  ...prev,
                  [month]: !prev[month]
                }));
              }}
            >
              <span className="font-medium text-lg">{monthLabel}</span>
              <div className="flex items-center gap-2">
                <span className="text-base text-gray-500">
                  {transactions.length} {t("гүйлгээ")}
                </span>
                {isExpanded ? <UpOutlined /> : <DownOutlined />}
              </div>
            </div>
            <div className="px-4 py-3 border-b border-gray-300 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-start items-start">
                <span className="font-semibold text-lg mr-4">{t("Нийт")}:</span>
                <span className="font-semibold text-lg">{formatNumber(roundedMonthTotal, 2)}</span>
              </div>
            </div>
            {isExpanded && (
              <div className="px-2 py-1.5">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-200 dark:bg-gray-700">
                      <tr>
                        <th className="border border-gray-300 px-3 py-1.5 text-center text-sm font-semibold">{t("Авлага")}</th>
                        <th className="border border-gray-300 px-3 py-1.5 text-center text-sm font-semibold">{t("Дүн")}</th>
                        <th className="border border-gray-300 px-3 py-1.5 text-center text-sm font-semibold">{t("Төлөх дүн")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const totalAmount = transactions.reduce((sum, transaction) => {
                          return sum + (transaction.tulukhAldangi || 0);
                        }, 0);
                        const roundedTotalAmount = Math.round(totalAmount * 100) / 100;
                        
                        const totalInputAmount = transactions.reduce((sum, transaction, idx) => {
                          const transactionId = transaction._id 
                            ? `${transaction._id}-aldangi-${month}-${idx}-${(transaction.tailbar || 'aldangi').replace(/\s+/g, '-')}` 
                            : `aldangi-${month}-${idx}-${(transaction.tailbar || 'aldangi').replace(/\s+/g, '-')}`;
                          const storedValue = transactionInputs?.[index]?.[transactionId];
                          const numValue = storedValue !== undefined && storedValue !== null 
                            ? (typeof storedValue === 'number' ? storedValue : parseFloat(storedValue) || 0)
                            : 0;
                          return sum + numValue;
                        }, 0);
                        const roundedTotalInputAmount = Math.round(totalInputAmount * 100) / 100;
                        
                        const summaryTransactionId = `aldangi-summary-${month}`;
                        const summaryStoredValue = transactionInputs?.[index]?.[summaryTransactionId];
                        const isFocused = focusedInputs[summaryTransactionId];
                        const rawValue = rawInputValues[summaryTransactionId];
                        
                        let displayValue = "";
                        if (isFocused && rawValue !== undefined) {
                          displayValue = rawValue;
                        } else {
                          const numValue = summaryStoredValue !== undefined && summaryStoredValue !== null 
                            ? (typeof summaryStoredValue === 'number' ? summaryStoredValue : parseFloat(summaryStoredValue) || 0)
                            : undefined;
                          if (numValue !== undefined && numValue !== null && numValue !== 0) {
                            displayValue = formatNumber(Math.round(numValue * 100) / 100, 2);
                          }
                        }
                        
                        return (
                          <tr
                            key={`aldangi-summary-${index}-${month}`}
                            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="border border-gray-300 px-3 py-1.5 truncate max-w-xs text-sm font-semibold">
                              {t("Алданги")}
                            </td>
                            <td className="border border-gray-300 px-3 py-1.5 text-right text-sm font-semibold">
                              {roundedTotalAmount > 0 ? formatNumber(roundedTotalAmount, 2) : ""}
                            </td>
                            <td className="border border-gray-300 px-3 py-1.5">
                              <input
                                type="text"
                                className="w-full rounded-md border border-gray-400 bg-gray-200 px-2 py-1.5 text-right text-sm dark:bg-gray-700 dark:text-gray-200"
                                placeholder="0.00"
                                value={displayValue}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  const value = Math.round(roundedTotalAmount * 100) / 100;
                                  const formattedValue = value !== 0 ? formatNumber(value, 2) : "";
                                  setRawInputValues((prev) => ({
                                    ...prev,
                                    [summaryTransactionId]: formattedValue
                                  }));
                                  setFocusedInputs((prev) => ({ ...prev, [summaryTransactionId]: true }));
                                  e.target.focus();
                                  e.target.select();
                                  
                                  if (setTransactionInputs) {
                                    setTransactionInputs((prev) => {
                                      const penaltyInputs = prev[index] 
                                        ? Object.entries(prev[index]).filter(([id]) => id.includes("aldangi"))
                                        : [];
                                      const currentTotal = penaltyInputs.reduce((sum, [, val]) => {
                                        const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                                        return sum + numVal;
                                      }, 0);
                                      const currentTotalRounded = Math.round(currentTotal * 100) / 100;
                                      const newTotal = currentTotalRounded - (prev[index]?.[summaryTransactionId] || 0) + value;
                                      const roundedNewTotal = Math.round(newTotal * 100) / 100;
                                      
                                      if (onChangeKholbokhDun) {
                                        const syntheticTarget = { value: formatter(roundedNewTotal) };
                                        onChangeKholbokhDun(syntheticTarget, index, "tulsunAldangi");
                                      }
                                      
                                      return {
                                        ...prev,
                                        [index]: {
                                          ...(prev[index] || {}),
                                          [summaryTransactionId]: value,
                                        },
                                      };
                                    });
                                  }
                                }}
                                onFocus={(e) => {
                                  e.stopPropagation();
                                  setFocusedInputs((prev) => ({ ...prev, [summaryTransactionId]: true }));
                                  const currentValue = transactionInputs?.[index]?.[summaryTransactionId];
                                  if (currentValue !== undefined && currentValue !== null) {
                                    const numVal = typeof currentValue === 'number' ? currentValue : parseFloat(currentValue) || 0;
                                    const roundedVal = Math.round(numVal * 100) / 100;
                                    setRawInputValues((prev) => ({
                                      ...prev,
                                      [summaryTransactionId]: roundedVal !== 0 ? formatNumber(roundedVal, 2) : ""
                                    }));
                                  }
                                }}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  const { target } = e;
                                  let inputValue = target.value;
                                  
                                  if (inputValue === '') {
                                    setRawInputValues((prev) => ({ ...prev, [summaryTransactionId]: '' }));
                                    if (setTransactionInputs) {
                                      setTransactionInputs((prev) => {
                                        const updatedInputs = {
                                          ...prev,
                                          [index]: {
                                            ...(prev[index] || {}),
                                            [summaryTransactionId]: 0,
                                          },
                                        };
                                        const contractInputs = updatedInputs[index] || {};
                                        const penaltyInputs = Object.entries(contractInputs).filter(([id]) => id.includes("aldangi"));
                                        const total = penaltyInputs.reduce((sum, [, val]) => {
                                          const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                                          return sum + numVal;
                                        }, 0);
                                        const roundedTotal = Math.round(total * 100) / 100;
                                        if (onChangeKholbokhDun) {
                                          const syntheticTarget = { value: formatter(roundedTotal) };
                                          onChangeKholbokhDun(syntheticTarget, index, "tulsunAldangi");
                                        }
                                        return updatedInputs;
                                      });
                                    }
                                    return;
                                  }
                                  
                                  const parsed = parser(inputValue);
                                  if (parsed === '' || parsed === null || parsed === undefined) {
                                    setRawInputValues((prev) => ({ ...prev, [summaryTransactionId]: inputValue }));
                                    return;
                                  }
                                  
                                  const numValue = parseFloat(parsed) || 0;
                                  const roundedValue = Math.round(numValue * 100) / 100;
                                  const maxDun = roundedTotalAmount;
                                  
                                  let finalValue = roundedValue;
                                  if (maxDun > 0 && roundedValue > maxDun) {
                                    finalValue = Math.round(maxDun * 100) / 100;
                                    const cappedFormatted = formatNumber(finalValue, 2);
                                    setRawInputValues((prev) => ({
                                      ...prev,
                                      [summaryTransactionId]: cappedFormatted
                                    }));
                                  } else {
                                    const formatted = formatNumber(roundedValue, 2);
                                    setRawInputValues((prev) => ({
                                      ...prev,
                                      [summaryTransactionId]: formatted
                                    }));
                                  }
                                  
                                  if (setTransactionInputs) {
                                    setTransactionInputs((prev) => {
                                      const contractInputs = {
                                        ...(prev[index] || {}),
                                        [summaryTransactionId]: finalValue,
                                      };
                                      const penaltyInputs = Object.entries(contractInputs).filter(([id]) => id.includes("aldangi"));
                                      const total = penaltyInputs.reduce((sum, [, val]) => {
                                        const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                                        return sum + numVal;
                                      }, 0);
                                      const roundedTotal = Math.round(total * 100) / 100;
                                      
                                      if (onChangeKholbokhDun) {
                                        const syntheticTarget = { value: formatter(roundedTotal) };
                                        onChangeKholbokhDun(syntheticTarget, index, "tulsunAldangi");
                                      }
                                      
                                      return {
                                        ...prev,
                                        [index]: contractInputs,
                                      };
                                    });
                                  }
                                }}
                                onBlur={(e) => {
                                  e.stopPropagation();
                                  setFocusedInputs((prev) => {
                                    const newState = { ...prev };
                                    delete newState[summaryTransactionId];
                                    return newState;
                                  });
                                  
                                  if (setTransactionInputs) {
                                    setTransactionInputs((prev) => {
                                      const storedValue = prev[index]?.[summaryTransactionId];
                                      if (storedValue !== undefined && storedValue !== null) {
                                        const numValue = typeof storedValue === 'number' ? storedValue : parseFloat(storedValue) || 0;
                                        let roundedValue = Math.round(numValue * 100) / 100;
                                        
                                        const maxDun = roundedTotalAmount;
                                        if (roundedValue > maxDun && maxDun > 0) {
                                          roundedValue = Math.round(maxDun * 100) / 100;
                                        }
                                        
                                        const contractInputs = {
                                          ...(prev[index] || {}),
                                          [summaryTransactionId]: roundedValue,
                                        };
                                        const penaltyInputs = Object.entries(contractInputs).filter(([id]) => id.includes("aldangi"));
                                        const total = penaltyInputs.reduce((sum, [, val]) => {
                                          const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                                          return sum + numVal;
                                        }, 0);
                                        const roundedTotal = Math.round(total * 100) / 100;
                                        
                                        if (onChangeKholbokhDun) {
                                          const syntheticTarget = { value: formatter(roundedTotal) };
                                          onChangeKholbokhDun(syntheticTarget, index, "tulsunAldangi", false);
                                        }
                                        
                                        if (roundedValue !== numValue) {
                                          setRawInputValues((prev) => ({
                                            ...prev,
                                            [summaryTransactionId]: roundedValue !== 0 ? formatNumber(roundedValue, 2) : ""
                                          }));
                                        }
                                        
                                        return {
                                          ...prev,
                                          [index]: contractInputs,
                                        };
                                      }
                                      return prev;
                                    });
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
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
    const tureesiinTulbur = mur.tureesiinTulbur === '' || mur.tureesiinTulbur === null || mur.tureesiinTulbur === undefined 
      ? 0 
      : (typeof mur.tureesiinTulbur === 'number' ? mur.tureesiinTulbur : parseFloat(mur.tureesiinTulbur) || 0);
    const tulsunAldangi = mur.tulsunAldangi === '' || mur.tulsunAldangi === null || mur.tulsunAldangi === undefined 
      ? 0 
      : (typeof mur.tulsunAldangi === 'number' ? mur.tulsunAldangi : parseFloat(mur.tulsunAldangi) || 0);
    
    if (tureesiinTulbur > 0 || tulsunAldangi > 0) {
      let guilgeeniiMur = {
        turul: "bank",
        tulsunDun: tureesiinTulbur,
        guilgeeniiId: guilgee._id,
        gereeniiId: mur._id,
        dansniiDugaar: guilgee.dansniiDugaar,
        tulukhAldangi: mur.aldangiinUldegdel || 0,
        tulsunAldangi: tulsunAldangi,
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
    const baritsaaTulbur = mur.baritsaaTulbur === '' || mur.baritsaaTulbur === null || mur.baritsaaTulbur === undefined 
      ? 0 
      : (typeof mur.baritsaaTulbur === 'number' ? mur.baritsaaTulbur : parseFloat(mur.baritsaaTulbur) || 0);
    
    if (baritsaaTulbur > 0) {
      let baritsaaniiMur = {
        gereeniiId: mur._id,
        guilgeeniiId: guilgee._id,
        orlogo: baritsaaTulbur,
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
  const sanitizedGuilgeenuud = guilgeenuud.map((geree) => {
    const sanitized = { ...geree };
    if (sanitized.orlogo !== undefined) {
      sanitized.orlogo = sanitized.orlogo === '' || sanitized.orlogo === null 
        ? 0 
        : (typeof sanitized.orlogo === 'number' ? sanitized.orlogo : parseFloat(sanitized.orlogo) || 0);
    }
    if (sanitized.zarlaga !== undefined) {
      sanitized.zarlaga = sanitized.zarlaga === '' || sanitized.zarlaga === null 
        ? 0 
        : (typeof sanitized.zarlaga === 'number' ? sanitized.zarlaga : parseFloat(sanitized.zarlaga) || 0);
    }
    return sanitized;
  });
  
  for await (const geree of sanitizedGuilgeenuud) {
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
  const [expandedTurees, setExpandedTurees] = React.useState({});
  const [transactionInputs, setTransactionInputs] = React.useState({}); // Store inputs by contract index and transaction ID
  const inputRef = React.useRef();
  const lastWarningTimeRef = React.useRef({}); // Track last warning time per contract index

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

        const sanitizedGuilgeenuud = undsenGuilgee.map((mur) => {
          const sanitized = { ...mur };
          if (sanitized.tulsunDun !== undefined) {
            sanitized.tulsunDun = sanitized.tulsunDun === '' || sanitized.tulsunDun === null 
              ? 0 
              : (typeof sanitized.tulsunDun === 'number' ? sanitized.tulsunDun : parseFloat(sanitized.tulsunDun) || 0);
          }
          if (sanitized.tulukhAldangi !== undefined) {
            sanitized.tulukhAldangi = sanitized.tulukhAldangi === '' || sanitized.tulukhAldangi === null 
              ? 0 
              : (typeof sanitized.tulukhAldangi === 'number' ? sanitized.tulukhAldangi : parseFloat(sanitized.tulukhAldangi) || 0);
          }
          if (sanitized.tulsunAldangi !== undefined) {
            sanitized.tulsunAldangi = sanitized.tulsunAldangi === '' || sanitized.tulsunAldangi === null 
              ? 0 
              : (typeof sanitized.tulsunAldangi === 'number' ? sanitized.tulsunAldangi : parseFloat(sanitized.tulsunAldangi) || 0);
          }
          return sanitized;
        });

        if (undsenGuilgee.length > 0)
          uilchilgee(token)
            .post("/tulultOlnoorKhadgalya", { guilgeenuud: sanitizedGuilgeenuud })
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
                    mur.tureesiinTulbur = 0;
                    mur.baritsaaTulbur = 0;
                    mur.tulsunAldangi = 0;
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
    const getFieldValue = (contract, field) => parseNum(contract[field]);
    const hasInputs = (idx, type) => transactionInputs[idx] && Object.keys(transactionInputs[idx]).some(id => 
      type === 'monthly' ? !id.includes("aldangi") : id.includes("aldangi")
    );
    
    return gereenuud.reduce((sum, contract, i) => {
      let value = 0;
      if (i === index) {
        ["baritsaaTulbur", "tureesiinTulbur", "tulsunAldangi"]
          .filter(f => f !== talbar)
          .forEach(field => {
            if (field === "tureesiinTulbur" && hasInputs(i, 'monthly')) return;
            if (field === "tulsunAldangi" && hasInputs(i, 'penalty')) return;
            value += getFieldValue(contract, field);
          });
        
        if (transactionInputs[i]) {
          Object.entries(transactionInputs[i]).forEach(([id, val]) => {
            if (talbar === "tulsunAldangi" && id.includes("aldangi")) return;
            if (talbar === "tureesiinTulbur" && !id.includes("aldangi")) return;
            value += parseNum(val);
          });
        }
      } else {
        value += getFieldValue(contract, "baritsaaTulbur");
        value += hasInputs(i, 'monthly') ? 0 : getFieldValue(contract, "tureesiinTulbur");
        value += hasInputs(i, 'penalty') ? 0 : getFieldValue(contract, "tulsunAldangi");
        
        if (transactionInputs[i]) {
          Object.values(transactionInputs[i]).forEach(val => value += parseNum(val));
        }
      }
      return sum + value;
    }, 0) + (data.kholbosonDun || 0);
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

  function onChangeKholbokhDun(target, index, talbar, skipValidation = false) {
    let sum = zuruuZun(index, talbar);
    const parsedValue = parser(target.value);
    let numValue = parsedValue === '' || parsedValue === null || parsedValue === undefined 
      ? 0 
      : _.toNumber(parsedValue) || 0;
    
    if (!skipValidation) {
      const now = Date.now();
      const lastWarningTime = lastWarningTimeRef.current[index] || 0;
      const timeSinceLastWarning = now - lastWarningTime;
      let valueChanged = false;
      
      if (talbar === "tulsunAldangi") {
        const currentZuruuDun = guilgeeniiDun - sum;
        const aldangiinUldegdel = gereenuud[index]?.aldangiinUldegdel || 0;
        const maxAllowed = Math.min(currentZuruuDun, aldangiinUldegdel);
        
        if (numValue > maxAllowed) {
          numValue = Math.max(0, maxAllowed);
          valueChanged = true;
          if (timeSinceLastWarning >= 2000) {
            lastWarningTimeRef.current[index] = now;
            notification.warning({
              message: t("Анхаар"),
              description: t("Алдангийн дүн хэтэрсэн байна. Холбоогүй дүн эсвэл алдангийн үлдэгдэлээс хэтэрч болохгүй"),
            });
          }
        }
      }
      
      if (talbar === "baritsaaTulbur") {
        const currentZuruuDun = guilgeeniiDun - sum;
        const baritsaaAvakhDun = gereenuud[index]?.baritsaaAvakhDun || 0;
        const baritsaaniiUldegdel = gereenuud[index]?.baritsaaniiUldegdel || 0;
        const availableBaritsaa = baritsaaAvakhDun - baritsaaniiUldegdel;
        const maxAllowed = Math.min(currentZuruuDun, availableBaritsaa);
        
        if (numValue > maxAllowed) {
          numValue = Math.max(0, maxAllowed);
          valueChanged = true;
          if (timeSinceLastWarning >= 2000) {
            lastWarningTimeRef.current[index] = now;
            notification.warning({
              message: t("Анхаар"),
              description: t("Барьцааны дүн хэтэрсэн байна. Холбоогүй дүн эсвэл барьцааны үлдэгдэлээс хэтэрч болохгүй"),
            });
          }
        }
      }
      
      if (sum + numValue > guilgeeniiDun) {
        numValue = Math.max(0, guilgeeniiDun - sum);
        valueChanged = true;
        if (timeSinceLastWarning >= 2000) {
          lastWarningTimeRef.current[index] = now;
          notification.warning({
            message: t("Анхаар"),
            description: t("Гүйлгээний дүнгээс холбох дүн илүү гарсан байна"),
          });
        }
      }
      
      if (valueChanged) {
        target.value = formatter(numValue);
      }
    }
    setGereenuud((a) => {
      _.set(a, `${index}.${talbar}`, numValue);
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
      const parsedValue = parser(target.value);
      const numValue = parsedValue === '' || parsedValue === null || parsedValue === undefined 
        ? 0 
        : _.toNumber(parsedValue) || 0;
      setGereenuud((a) => {
        _.set(a, `${index}.${talbar}`, numValue);
        return [...a];
      });
    }
  }

  const zuruuDun = useMemo(() => {
    let sum = zuruuZun();
    return guilgeeniiDun - sum;
  }, [gereenuud, transactionInputs]);

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
              <span 
                className="h-10 w-10 p-1 text-2xl text-red-500 cursor-pointer"
                onClick={() => {
                  const geree = gereenuud[index];
                  const baritsaaTulbur = geree?.baritsaaTulbur === '' || geree?.baritsaaTulbur === null || geree?.baritsaaTulbur === undefined 
                    ? 0 
                    : (typeof geree.baritsaaTulbur === 'number' ? geree.baritsaaTulbur : parseFloat(geree.baritsaaTulbur) || 0);
                  const tulsunAldangi = geree?.tulsunAldangi === '' || geree?.tulsunAldangi === null || geree?.tulsunAldangi === undefined 
                    ? 0 
                    : (typeof geree.tulsunAldangi === 'number' ? geree.tulsunAldangi : parseFloat(geree.tulsunAldangi) || 0);
                  const tureesiinTulbur = geree?.tureesiinTulbur === '' || geree?.tureesiinTulbur === null || geree?.tureesiinTulbur === undefined 
                    ? 0 
                    : (typeof geree.tureesiinTulbur === 'number' ? geree.tureesiinTulbur : parseFloat(geree.tureesiinTulbur) || 0);
                  
                  const contractTransactionInputs = transactionInputs[index] || {};
                  const hasTransactionInputs = Object.values(contractTransactionInputs).some(val => {
                    const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                    return numVal > 0;
                  });
                  
                  const hasChanges = baritsaaTulbur > 0 || tulsunAldangi > 0 || tureesiinTulbur > 0 || hasTransactionInputs;
                  
                  if (hasChanges) {
                    Modal.confirm({
                      content: t("Та энэ гэрээг устгахдаа итгэлтэй байна уу? Хийсэн өөрчлөлтүүд алдагдана."),
                      okText: t("Тийм"),
                      cancelText: t("Үгүй"),
                      onOk: () => {
                        setTransactionInputs((prev) => {
                          const updated = { ...prev };
                          delete updated[index];
                          const reindexed = {};
                          Object.keys(updated).forEach((key) => {
                            const keyNum = parseInt(key, 10);
                            if (keyNum > index) {
                              reindexed[keyNum - 1] = updated[key];
                            } else if (keyNum < index) {
                              reindexed[key] = updated[key];
                            }
                          });
                          return reindexed;
                        });
                        
                        setExpandedTurees((prev) => {
                          const updated = { ...prev };
                          delete updated[index];
                          const reindexed = {};
                          Object.keys(updated).forEach((key) => {
                            const keyNum = parseInt(key, 10);
                            if (keyNum > index) {
                              reindexed[keyNum - 1] = updated[key];
                            } else if (keyNum < index) {
                              reindexed[key] = updated[key];
                            }
                          });
                          return reindexed;
                        });
                        
                        setGereenuud((a) => {
                          const newGereenuud = [...a];
                          newGereenuud.splice(index, 1);
                          return newGereenuud;
                        });
                      },
                    });
                  } else {
                    setTransactionInputs((prev) => {
                      const updated = { ...prev };
                      delete updated[index];
                      const reindexed = {};
                      Object.keys(updated).forEach((key) => {
                        const keyNum = parseInt(key, 10);
                        if (keyNum > index) {
                          reindexed[keyNum - 1] = updated[key];
                        } else if (keyNum < index) {
                          reindexed[key] = updated[key];
                        }
                      });
                      return reindexed;
                    });
                    
                    setExpandedTurees((prev) => {
                      const updated = { ...prev };
                      delete updated[index];
                      const reindexed = {};
                      Object.keys(updated).forEach((key) => {
                        const keyNum = parseInt(key, 10);
                        if (keyNum > index) {
                          reindexed[keyNum - 1] = updated[key];
                        } else if (keyNum < index) {
                          reindexed[key] = updated[key];
                        }
                      });
                      return reindexed;
                    });
                    
                    setGereenuud((a) => {
                      const newGereenuud = [...a];
                      newGereenuud.splice(index, 1);
                      return newGereenuud;
                    });
                  }
                }}
              >
                <CloseCircleOutlined />
              </span>
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
              <div className="box grid w-full grid-cols-3 rounded-md border bg-gray-100 p-1">
                <div className="col-span-4">{t("Алдангийн үлдэгдэл")}</div>
                <div>{formatNumber(geree?.aldangiinUldegdel || 0, 2)}</div>
                <div>{geree.talbainDugaar}</div>
                <div className="text-right text-green-600">
                  <input
                    className="w-full rounded-md border border-gray-400 bg-gray-200 px-2 text-right dark:bg-gray-700"
                    placeholder={t("Алданги дүн")}
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
            )}

            {geree && (
              <TureesiinUldegdelDisplay
                geree={geree}
                token={token}
                index={index}
                expandedTurees={expandedTurees}
                setExpandedTurees={setExpandedTurees}
                onChangeKholbokhDun={onChangeKholbokhDun}
                onDoubleClickKholbokhDun={onDoubleClickKholbokhDun}
                guilgeeniiDun={guilgeeniiDun}
                zuruuZun={zuruuZun}
                zuruuDun={zuruuDun}
                transactionInputs={transactionInputs}
                setTransactionInputs={setTransactionInputs}
              />
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
