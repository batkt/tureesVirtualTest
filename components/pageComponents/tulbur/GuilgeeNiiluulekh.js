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
      <div className="col-span-3">
        {transactionsByMonth && transactionsByMonth.length > 0 ? (
          <>
            {transactionsByMonth.map(({ month, monthLabel, transactions }) => {
              // Calculate total for this month's transactions
              const monthTotal = transactions.reduce((sum, transaction, idx) => {
                // Make transactionId unique by combining _id, month, idx, and tailbar
                // This ensures each transaction row has a unique ID even if _id is duplicated
                const transactionId = transaction._id 
                  ? `${transaction._id}-${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}` 
                  : `${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}`;
                const storedValue = transactionInputs?.[index]?.[transactionId];
                const numValue = storedValue !== undefined && storedValue !== null 
                  ? (typeof storedValue === 'number' ? storedValue : parseFloat(storedValue) || 0)
                  : 0;
                return sum + numValue;
              }, 0);
              const roundedMonthTotal = Math.round(monthTotal * 100) / 100;
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
                  <div className="px-3 py-2">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                    <thead className="bg-gray-200 dark:bg-gray-700">
                      <tr>
                      <th className="border border-gray-300 px-4 py-2 text-center text-base font-semibold">{t("Авлага")}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-base font-semibold">{t("Дүн")}</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-base font-semibold">{t("Төлөх дүн")}</th>

                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, idx) => {
                        // Make transactionId unique by combining _id, month, idx, and tailbar
                        // This ensures each transaction row has a unique ID even if _id is duplicated
                        const transactionId = transaction._id 
                          ? `${transaction._id}-${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}` 
                          : `${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}`;
                        const storedValue = transactionInputs?.[index]?.[transactionId];
                        const isFocused = focusedInputs[transactionId];
                        const rawValue = rawInputValues[transactionId];
                        
                        // When focused, use raw input value to avoid rounding issues
                        // When not focused, use stored value and format it
                        let displayValue = "";
                        if (isFocused && rawValue !== undefined) {
                          // Show raw input while typing (already formatted by formatNumber)
                          displayValue = rawValue;
                        } else {
                          const numValue = storedValue !== undefined && storedValue !== null 
                            ? (typeof storedValue === 'number' ? storedValue : parseFloat(storedValue) || 0)
                            : undefined;
                          if (numValue !== undefined && numValue !== null) {
                            displayValue = formatNumber(Math.round(numValue * 100) / 100, 2);
                          }
                        }
                        return (
                        <tr
                          key={`tuukh-${index}-${month}-${idx}`}
                          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="border border-gray-300 px-4 py-2 truncate max-w-xs text-sm">
                            {transaction.tailbar || "Түрээс"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                            {formatNumber(transaction.tulukhDun || 0, 2)}
                          </td>
                         
                         
                          <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-400 bg-gray-200 px-3 py-2 text-right text-sm dark:bg-gray-700 dark:text-gray-200"
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
                      
                      // Use the same transactionId generation logic as in the map function
                      const transactionId = transaction._id 
                        ? `${transaction._id}-${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}` 
                        : `${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}`;
                      
                      // Update rawInputValues and focusedInputs immediately for instant display
                      const formattedValue = formatNumber(value, 2);
                      setRawInputValues((prev) => ({
                        ...prev,
                        [transactionId]: formattedValue
                      }));
                      setFocusedInputs((prev) => ({ ...prev, [transactionId]: true }));
                      
                      // Focus the input so user sees the change immediately
                      e.target.focus();
                      e.target.select();
                      
                      if (setTransactionInputs) {
                        setTransactionInputs((prev) => {
                          // Get current total before adding this value
                          const currentTotal = prev[index] 
                            ? Object.values(prev[index]).reduce((sum, val) => {
                                const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                                return sum + numVal;
                              }, 0)
                            : 0;
                          const currentTotalRounded = Math.round(currentTotal * 100) / 100;
                          
                          // Calculate what the new total would be
                          const newTotal = currentTotalRounded - (prev[index]?.[transactionId] || 0) + value;
                          const newTotalRounded = Math.round(newTotal * 100) / 100;
                          
                          // Validate: Check if new total would exceed guilgeeniiDun
                          if (zuruuZun && guilgeeniiDun !== undefined && guilgeeniiDun !== null) {
                            const sum = zuruuZun(index, "tureesiinTulbur");
                            const totalWouldBe = Math.round((sum + newTotalRounded) * 100) / 100;
                            const guilgeeniiDunRounded = Math.round(guilgeeniiDun * 100) / 100;
                            
                            if (totalWouldBe > guilgeeniiDunRounded) {
                              // Cap the value to what's available
                              const maxAllowed = Math.max(0, guilgeeniiDunRounded - sum - (currentTotalRounded - (prev[index]?.[transactionId] || 0)));
                              value = Math.max(0, Math.round(maxAllowed * 100) / 100);
                              // Update rawInputValues with capped value
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
                      // Use the same transactionId generation logic
                      const transactionId = transaction._id 
                        ? `${transaction._id}-${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}` 
                        : `${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}`;
                      setFocusedInputs((prev) => ({ ...prev, [transactionId]: true }));
                      // Initialize raw value with current formatted value
                      const currentValue = transactionInputs?.[index]?.[transactionId];
                      if (currentValue !== undefined && currentValue !== null) {
                        const numVal = typeof currentValue === 'number' ? currentValue : parseFloat(currentValue) || 0;
                        setRawInputValues((prev) => ({
                          ...prev,
                          [transactionId]: formatNumber(Math.round(numVal * 100) / 100, 2)
                        }));
                      }
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                      const { target } = e;
                      let inputValue = target.value;
                      // Use the same transactionId generation logic
                      const transactionId = transaction._id 
                        ? `${transaction._id}-${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}` 
                        : `${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}`;
                      
                      // Allow empty input
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
                      
                      // Remove commas and parse
                      const cleaned = inputValue.replace(/,/g, '').trim();
                      
                      // Allow typing numbers and decimal point
                      if (!/^-?\d*\.?\d*$/.test(cleaned)) {
                        return; // Invalid input, don't update
                      }
                      
                      // Parse the value - preserve exact decimal precision
                      const parsedValue = parseFloat(cleaned);
                      let value = isNaN(parsedValue) ? 0 : parsedValue;
                      
                      // Validate: Төлөх дүн cannot exceed Дүн - prevent input if exceeds
                      const maxDun = transaction.tulukhDun || 0;
                      if (value > maxDun && maxDun > 0) {
                        // Don't allow the input - return without updating
                        return;
                      }
                      
                      // Format with commas - preserve exact decimal places from user input
                      let formattedValue = '';
                      if (cleaned === '' || cleaned === '.') {
                        formattedValue = cleaned;
                      } else {
                        const parts = cleaned.split('.');
                        const intPart = parts[0] || '0';
                        const decPart = parts[1] || '';
                        
                        // Format integer part with commas
                        const formattedInt = parseInt(intPart, 10).toLocaleString('en-US');
                        
                        // Preserve exact decimal part (max 2 digits)
                        if (decPart) {
                          const limitedDec = decPart.length > 2 ? decPart.substring(0, 2) : decPart;
                          formattedValue = `${formattedInt}.${limitedDec}`;
                        } else {
                          formattedValue = formattedInt;
                        }
                      }
                      
                      // Store formatted value for display
                      setRawInputValues((prev) => ({ ...prev, [transactionId]: formattedValue }));
                      
                      // Store the exact value without any rounding
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
                          
                          // Validate: Total cannot exceed guilgeeniiDun (same validation as Барьцааны үлдэгдэл)
                          // Use the same validation logic as onChangeKholbokhDun
                          if (zuruuZun && guilgeeniiDun !== undefined && guilgeeniiDun !== null) {
                            // Get current tureesiinTulbur from gereenuud to calculate the correct sum
                            // zuruuZun(index, "tureesiinTulbur") excludes tureesiinTulbur for this contract
                            // So we need to add the new roundedTotal to check if it exceeds guilgeeniiDun
                            const sum = zuruuZun(index, "tureesiinTulbur");
                            
                            // Check if roundedTotal would exceed guilgeeniiDun
                            // sum already excludes tureesiinTulbur for this contract, so sum + roundedTotal is the total
                            const totalWouldBe = Math.round((sum + roundedTotal) * 100) / 100;
                            const guilgeeniiDunRounded = Math.round(guilgeeniiDun * 100) / 100;
                            
                            if (totalWouldBe > guilgeeniiDunRounded) {
                              // Don't allow the input - return without updating
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
                      // Round and format on blur
                      const { target } = e;
                      // Use the same transactionId generation logic
                      const transactionId = transaction._id 
                        ? `${transaction._id}-${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}` 
                        : `${month}-${idx}-${(transaction.tailbar || 'turees').replace(/\s+/g, '-')}`;
                      setFocusedInputs((prev) => {
                        const updated = { ...prev };
                        delete updated[transactionId];
                        return updated;
                      });
                      
                      // Clear raw input value
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
                            const roundedValue = Math.round(numValue * 100) / 100;
                            
                            // Check total on blur and show warning if needed
                            const contractInputs = {
                              ...(prev[index] || {}),
                              [transactionId]: roundedValue,
                            };
                            const total = Object.values(contractInputs).reduce((sum, val) => {
                              const numVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
                              return sum + numVal;
                            }, 0);
                            const roundedTotal = Math.round(total * 100) / 100;
                            
                            // Validate on blur - if exceeds, cap it to the maximum allowed
                            if (zuruuZun && guilgeeniiDun !== undefined && guilgeeniiDun !== null) {
                              const sum = zuruuZun(index, "tureesiinTulbur");
                              const totalWouldBe = Math.round((sum + roundedTotal) * 100) / 100;
                              const guilgeeniiDunRounded = Math.round(guilgeeniiDun * 100) / 100;
                              
                              if (totalWouldBe > guilgeeniiDunRounded) {
                                // Cap the total to the maximum allowed
                                const maxAllowed = Math.max(0, guilgeeniiDunRounded - sum);
                                const cappedTotal = Math.round(maxAllowed * 100) / 100;
                                
                                // Calculate the capped value for this input
                                const currentTotalWithoutThis = roundedTotal - roundedValue;
                                const cappedValue = Math.max(0, cappedTotal - currentTotalWithoutThis);
                                
                                // Update with capped value
                                return {
                                  ...prev,
                                  [index]: {
                                    ...(prev[index] || {}),
                                    [transactionId]: Math.round(cappedValue * 100) / 100,
                                  },
                                };
                              }
                            }
                            
                            if (onChangeKholbokhDun) {
                              const syntheticTarget = { value: formatter(roundedTotal) };
                              // Don't skip validation on blur - show warning if total exceeds
                              onChangeKholbokhDun(syntheticTarget, index, "tureesiinTulbur", false);
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
    // Ensure numeric values are not empty strings
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
    // Ensure baritsaaTulbur is a number, not empty string
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
  // Sanitize all numeric fields before sending to backend
  const sanitizedGuilgeenuud = guilgeenuud.map((geree) => {
    const sanitized = { ...geree };
    // Ensure all numeric fields are numbers, not empty strings
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
  const [expandedAldangi, setExpandedAldangi] = React.useState({});
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

        // Sanitize all numeric fields before sending to backend
        const sanitizedGuilgeenuud = undsenGuilgee.map((mur) => {
          const sanitized = { ...mur };
          // Ensure all numeric fields are numbers, not empty strings
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
            const val = b[mur];
            const numVal = val === '' || val === null || val === undefined 
              ? 0 
              : (typeof val === 'number' ? val : parseFloat(val) || 0);
            value += numVal;
          });
      } else {
        const baritsaa = b.baritsaaTulbur === '' || b.baritsaaTulbur === null || b.baritsaaTulbur === undefined 
          ? 0 
          : (typeof b.baritsaaTulbur === 'number' ? b.baritsaaTulbur : parseFloat(b.baritsaaTulbur) || 0);
        const turees = b.tureesiinTulbur === '' || b.tureesiinTulbur === null || b.tureesiinTulbur === undefined 
          ? 0 
          : (typeof b.tureesiinTulbur === 'number' ? b.tureesiinTulbur : parseFloat(b.tureesiinTulbur) || 0);
        const aldangi = b.tulsunAldangi === '' || b.tulsunAldangi === null || b.tulsunAldangi === undefined 
          ? 0 
          : (typeof b.tulsunAldangi === 'number' ? b.tulsunAldangi : parseFloat(b.tulsunAldangi) || 0);
        value += baritsaa + turees + aldangi;
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

  function onChangeKholbokhDun(target, index, talbar, skipValidation = false) {
    let sum = zuruuZun(index, talbar);
    const parsedValue = parser(target.value);
    const numValue = parsedValue === '' || parsedValue === null || parsedValue === undefined 
      ? 0 
      : _.toNumber(parsedValue) || 0;
    
    // Only show warning if not skipping validation (i.e., not during typing in transaction inputs)
    // And limit warnings to once every 2 seconds per contract index
    if (!skipValidation && sum + numValue > guilgeeniiDun) {
      const now = Date.now();
      const lastWarningTime = lastWarningTimeRef.current[index] || 0;
      const timeSinceLastWarning = now - lastWarningTime;
      
      // Only show warning if at least 2 seconds have passed since last warning
      if (timeSinceLastWarning >= 2000) {
        target.value = formatter(guilgeeniiDun - sum);
        lastWarningTimeRef.current[index] = now;
        notification.warning({
          message: t("Анхаар"),
          description: t("Гүйлгээний дүнгээс холбох дүн илүү гарсан байна"),
        });
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
              <span 
                className="h-10 w-10 p-1 text-2xl text-red-500 cursor-pointer"
                onClick={() =>
                  setGereenuud((a) => {
                    a.splice(index, 1);
                    return [...a];
                  })
                }
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
                      geree.uldegdel > 0 ? "red" : "green"
                    }-500`}
                  >
                    {formatNumber(geree.uldegdel, 2)}
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
