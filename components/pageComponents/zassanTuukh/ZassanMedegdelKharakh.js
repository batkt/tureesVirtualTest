import React, { useEffect, useImperativeHandle, useState } from "react";
import { Form } from "antd";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useTranslation } from "react-i18next";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import useAktiinZagvar from "hooks/useAktiinZagvar";

function ZassanMedegdelKharakh(
  { token, barilgiinId, baiguullaga, data, ajiltan, destroy },
  ref
) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { gereeniiZagvarGaralt } = useGereeniiZagvar(token, baiguullaga?._id, barilgiinId);
  const { aktiinZagvarGaralt } = useAktiinZagvar(token, baiguullaga?._id);

  useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
    }),
    [destroy]
  );

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [destroy]);

  function filterZagvarNer(id) {
    return gereeniiZagvarGaralt?.jagsaalt
      .filter((data) => data._id === id)
      .map((b) => b.ner);
  }

  function aktFilterZagvarNer(id) {
    return aktiinZagvarGaralt?.jagsaalt
      .filter((data) => data._id === id)
      .map((b) => b.ner);
  }

  function renderValue(item, val) {
    if (val === undefined || val === null || val === "") return "-";
    
    if (item.utganiiTurul === "number" && 
        item.talbar !== "khugatsaa" && 
        item.talbar !== "baritsaaBairshuulakhKhugatsaa") {
      return <span className="font-mono">{formatNumber(val, 2)}</span>;
    }
    
    if (item.talbar === "gereeniiZagvariinId") return filterZagvarNer(val);
    if (item.talbar === "aktiinZagvariinId") return aktFilterZagvarNer(val);
    
    if (item.utganiiTurul === "date") {
      return moment(val).format("YYYY-MM-DD");
    }

    if (item.utganiiTurul === "object") {
      try {
        const parsed = typeof val === "string" ? JSON.parse(val) : val;
        
        if (item.talbar === "zardluud") {
          return (
            <div className="flex flex-col gap-1 text-[10px] leading-tight text-right">
              {parsed.map((z, i) => (
                <div key={i} className="border-b last:border-0 pb-1 flex justify-between gap-2">
                  <span className="text-gray-400">{z.ner}:</span>
                  <span>{formatNumber(z.tulukhDun, 0)}</span>
                </div>
              ))}
            </div>
          );
        }
        
        if (item.talbar === "segmentuud") {
          return (
            <div className="flex flex-col gap-1 text-[10px] leading-tight text-right">
              {parsed.map((s, i) => (
                <div key={i} className="border-b last:border-0 pb-1 flex justify-between gap-2">
                  <span className="text-gray-400">{s.ner}:</span>
                  <span>{formatNumber(s.utga, 2)}</span>
                </div>
              ))}
            </div>
          );
        }

        if (item.talbar === "khungulultuud") {
          return (
            <div className="flex flex-col gap-1 text-[10px] leading-tight text-right">
              {parsed.map((k, i) => (
                <div key={i} className="border-b last:border-0 pb-1">
                  <div>{moment(k.ognoonuud?.[0]).format("MM.DD")} - {moment(k.ognoonuud?.[1]).format("MM.DD")}</div>
                  <div className="font-bold">{k.khungulukhKhuvi}% / {formatNumber(k.khungulultiinDun, 0)}</div>
                </div>
              ))}
            </div>
          );
        }
        
        return JSON.stringify(parsed);
      } catch (e) {
        return val;
      }
    }

    return !isNaN(parseFloat(val)) && isFinite(val) ? formatNumber(val, 2) : val;
  }

  return (
    <div className="flex flex-col dark:text-gray-400">
      <div className="h-auto max-h-[80vh] w-full overflow-y-auto pr-1 sm:pr-3">
        <div className="mb-4 flex flex-col gap-4 border-b pb-4 text-sm sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <span className="font-bold text-gray-500">{t("Төрөл")}:</span>
              <span className="font-medium">{data.className}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-500">{t("Дугаар")}:</span>
              <span className="font-medium text-blue-600">{data.classDugaar}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <span className="font-bold text-gray-500">{t("Зассан ажилтан")}:</span>
              <span className="font-medium">{data.ajiltniiNer}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-500">{t("Зассан огноо")}:</span>
              <span className="font-medium">{moment(data.createdAt).format("YYYY-MM-DD HH:mm")}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[500px] w-full border-collapse text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border p-2 text-left w-1/4">{t("Талбарын нэр")}</th>
                <th className="border p-2 text-right w-3/8 text-red-500">{t("Өмнох утга")}</th>
                <th className="border p-2 text-right w-3/8 text-green-600">{t("Шинэ утга")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.uurchlult
                ?.filter(
                  (item) =>
                    item.talbar !== "gereeniiTuukhuud" &&
                    item.talbar !== "talbainIdnuud" &&
                    item.talbar !== "avlaga"
                )
                .map((a, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="border p-2 font-medium bg-gray-50/50 dark:bg-transparent">
                      {a.talbarNer}
                    </td>
                    <td className="border p-2 text-right break-words max-w-[150px]">
                      {renderValue(a, a.umnukhUtga)}
                    </td>
                    <td className="border p-2 text-right break-words max-w-[150px]">
                      {renderValue(a, a.shineUtga)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(ZassanMedegdelKharakh);
