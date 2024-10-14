import React, { useEffect, useImperativeHandle, useState } from "react";
import { Form, Table, Modal } from "antd";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useTranslation } from "react-i18next";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import useAktiinZagvar from "hooks/useAktiinZagvar";

function ZassanMedegdelKharakh({ token, barilgiinId, baiguullaga, data, ajiltan, destroy }, ref) {
  const { t } = useTranslation()
  const [form] = Form.useForm();
  const { gereeniiZagvarGaralt, setGereeniiZagvarKhuudaslalt } = useGereeniiZagvar(token, baiguullaga?._id, barilgiinId);
  const { aktiinZagvarGaralt, aktiinZagvarMutate } = useAktiinZagvar(token, baiguullaga?._id);
  const [zardluudId, setZardluudId] = useState([]);
  const [segmentuudId, setSegmentuudId] = useState([]);

  useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
    }),
    [form]
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
  }, []);

  useEffect(() => {
    const zardluud = data?.uurchlult.filter((a) => a.utganiiTurul === "object" && a.talbar === "zardluud"); 
    if(zardluudId?.length === 0 && zardluud?.length > 0)
    {
      zardluud.forEach(element => {
        const umnukhUtgaId = JSON.parse(element.umnukhUtga)?.map((b) => b._id);
        const shineUtgaId = JSON.parse(element.shineUtga)?.map((b) => b._id);
        setZardluudId([...new Set([...umnukhUtgaId, ...shineUtgaId])]);
      });
    }
    const segmentuud = data?.uurchlult.filter((a) => a.utganiiTurul === "object" && a.talbar === "segmentuud"); 
    if(segmentuudId?.length === 0 && segmentuud?.length > 0)
    {
      segmentuud.forEach(element => {
        const umnukhUtgaId = JSON.parse(element.umnukhUtga)?.map((b) => b._id);
        const shineUtgaId = JSON.parse(element.shineUtga)?.map((b) => b._id);
        setSegmentuudId([...new Set([...umnukhUtgaId, ...shineUtgaId])]);
      });
    }
  }, []);

  function filterZagvarNer(id){
   return gereeniiZagvarGaralt?.jagsaalt.filter((data) => data._id === id).map((b) => b.ner);
  }

  function aktFilterZagvarNer(id){
    return aktiinZagvarGaralt?.jagsaalt.filter((data) => data._id === id).map((b) => b.ner);
  }

  return (
    <>
      <div className="flex dark:text-gray-400">
        <div className="w-full overflow-y-scroll h-[600px] pr-3">
          <div className="flex pl-1 pr-1 w-full">
            <div className="flex flex-col mr-5">
              <div className="flex gap-2">
                <div className="font-bold"> {t("Төрөл")}:</div>
                <div> {data.className} </div>
              </div>
              <div className="flex gap-2">
                <div className="font-bold"> {t("Дугаар")}:</div>
                <div> {data.classDugaar} </div> 
              </div>
            </div>  
            <div className="flex flex-col">   
              <div className="flex gap-2">
                <div className="font-bold"> {t("Зассан ажилтан")}:</div>
                <div> {data.ajiltniiNer} </div>
              </div>
              <div className="flex gap-2">
                <div className="font-bold"> {t("Зассан онгоо")}:</div>
                <div> {moment(data.createdAt).format("YYYY-MM-DD HH:mm")} </div>
              </div>
            </div>  
          </div>
          <table className="w-full font-semibold">
            <th className="flex border-b">
              <td className="w-2/12 overflow-hidden p-1 text-center">
                {t("Талбарын нэр")}
              </td>
              <td className="w-5/12 overflow-hidden p-1 text-center">
                {t("Өмнөх утга")}
              </td>
              <td className="w-5/12 overflow-hidden p-1 text-center">
                {t("Шинэ утга")}
              </td>
            </th>
            <tbody>
              {data?.uurchlult?.filter((data) => data.talbar !== "gereeniiTuukhuud" && data.talbar !== "talbainIdnuud" && data.talbar !== "avlaga").map((a) => (
                <tr className="flex border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400">
                  <td className="w-2/12 border-r border-l overflow-hidden p-1 flex items-center justify-center">
                    <div>{a.talbarNer}</div>
                  </td>
                  <td className="w-5/12 border-r overflow-hidden p-1 text-right">
                    {a.utganiiTurul === "number" && a.talbar !== "khugatsaa" && a.talbar !== "baritsaaBairshuulakhKhugatsaa" ? formatNumber(a.umnukhUtga, 2) 
                      : a.talbar === "gereeniiZagvariinId" ? filterZagvarNer(a.umnukhUtga)
                      : a.talbar === "aktiinZagvariinId" ? aktFilterZagvarNer(a.umnukhUtga)
                      : a.utganiiTurul === "date" ? moment(a.umnukhUtga).format("YYYY-MM-DD")  
                      : a.utganiiTurul === "object" && a.talbar === "zardluud" ? 
                        (
                          <table className="w-full">
                            <th className="flex">
                              <td className="w-1/3 overflow-hidden p-1 text-center">
                                {t("Нэр")}
                              </td>
                              <td className="w-1/6 overflow-hidden p-1 text-center">
                                {t("Төрөл")}
                              </td>
                              <td className="w-1/4 overflow-hidden p-1 text-center">
                                {t("Үнэ")}
                              </td>
                              <td className="w-1/4 overflow-hidden p-1 text-center">
                                {t("Төлөх дүн")}
                              </td>
                            </th>
                            <tbody className="overflow-y-scroll" style={{ height: "calc(30vh - 15rem)" }}>
                              {zardluudId?.map((z) => {
                                return JSON.parse(a.umnukhUtga)?.filter((b) => b._id === z)?.length > 0 ? JSON.parse(a.umnukhUtga)?.filter(c => c._id === z).map((b) => 
                                  (
                                    <tr className="flex border-t">
                                      <td className="w-1/3 border-r overflow-hidden p-1 text-left">
                                        {b.ner}
                                      </td>
                                      <td className="w-1/6 border-r overflow-hidden p-1 text-center">
                                        {b.turul}
                                      </td>
                                      <td className="w-1/4 border-r overflow-hidden p-1 text-right">
                                        {formatNumber(b.turul === "Дурын" ? b.dun : b.tariff)}
                                      </td>
                                      <td className="w-1/4 overflow-hidden p-1 text-right">
                                        {formatNumber(b.tulukhDun)}
                                      </td>
                                    </tr>
                                  )) : (
                                    <tr className="flex border-t">
                                      <td className="w-1/3 border-r overflow-hidden p-1 text-left">
                                        &nbsp;
                                      </td>
                                      <td className="w-1/6 border-r overflow-hidden p-1 text-center">
                                      </td>
                                      <td className="w-1/4 border-r overflow-hidden p-1 text-right">
                                      </td>
                                      <td className="w-1/4 overflow-hidden p-1 text-right">
                                      </td>
                                    </tr>
                                  )
                              })}
                            </tbody>
                          </table>
                        )
                        : a.utganiiTurul === "object" && a.talbar === "segmentuud" ? 
                        (
                          <table className="w-full">
                            <th className="flex">
                              <td className="w-1/3 overflow-hidden p-1 text-center">
                                {t("Нэр")}
                              </td>
                              <td className="w-2/3 overflow-hidden p-1 text-center">
                                {t("Утга")}
                              </td>
                            </th>
                            <tbody className="overflow-y-scroll" style={{ height: "calc(30vh - 15rem)" }}>
                              {segmentuudId?.map((z) => {
                                return JSON.parse(a.umnukhUtga)?.filter((b) => b._id === z)?.length > 0 ? JSON.parse(a.umnukhUtga)?.filter(c => c._id === z).map((b) => 
                                  (
                                    <tr className="flex border-t">
                                      <td className="w-1/3 border-r overflow-hidden p-1 text-left">
                                        {b.ner}
                                      </td>
                                      <td className="w-2/3 overflow-hidden p-1 text-center">
                                        {b.utga}
                                      </td>
                                    </tr>
                                  )) : (
                                    <tr className="flex border-t">
                                      <td className="w-1/3 border-r overflow-hidden p-1 text-left">
                                        &nbsp;
                                      </td>
                                      <td className="w-2/3 overflow-hidden p-1 text-center">
                                      </td>
                                    </tr>
                                  )
                              })}
                            </tbody>
                          </table>
                        )    
                      : a.umnukhUtga}
                  </td>
                  <td className="w-5/12 border-r overflow-hidden p-1 text-right">
                    {a.utganiiTurul === "number" && a.talbar !== "khugatsaa" && a.talbar !== "baritsaaBairshuulakhKhugatsaa" ? formatNumber(a.shineUtga, 2) 
                          : a.talbar === "gereeniiZagvariinId" ? filterZagvarNer(a.shineUtga)
                          : a.talbar === "aktiinZagvariinId" ? aktFilterZagvarNer(a.shineUtga)
                          : a.utganiiTurul === "date" ? moment(a.shineUtga).format("YYYY-MM-DD")
                          : a.utganiiTurul === "object" && a.talbar === "zardluud" ? 
                          (
                            <table className="w-full" style={{emptyCells: "show"}}>
                              <th className="flex">
                                <td className="w-1/3 overflow-hidden p-1 text-center">
                                  {t("Нэр")}
                                </td>
                                <td className="w-1/6 overflow-hidden p-1 text-center">
                                  {t("Төрөл")}
                                </td>
                                <td className="w-1/4 overflow-hidden p-1 text-center">
                                  {t("Үнэ")}
                                </td>
                                <td className="w-1/4 overflow-hidden p-1 text-center">
                                  {t("Төлөх дүн")}
                                </td>
                              </th>
                              <tbody className="overflow-y-scroll" style={{ height: "calc(30vh - 15rem)" }}>
                                {console.log(zardluudId)}
                                {zardluudId?.map((z) => {
                                  return JSON.parse(a.shineUtga)?.filter((b) => b._id === z)?.length > 0 ? JSON.parse(a.shineUtga)?.filter(c => c._id === z).map((b) => 
                                    (
                                      <tr className="flex border-t">
                                        <td className="w-1/3 border-r overflow-hidden p-1 text-left">
                                          {b.ner}
                                        </td>
                                        <td className="w-1/6 border-r overflow-hidden p-1 text-center">
                                          {b.turul}
                                        </td>
                                        <td className="w-1/4 border-r overflow-hidden p-1 text-right">
                                          {formatNumber(b.turul === "Дурын" ? b.dun : b.tariff)}
                                        </td>
                                        <td className="w-1/4 overflow-hidden p-1 text-right">
                                          {formatNumber(b.tulukhDun)}
                                        </td>
                                      </tr>
                                    )) : (
                                      <tr className="flex border-t">
                                        <td className="w-1/3 border-r overflow-hidden p-1 text-left">
                                          &nbsp;
                                        </td>
                                        <td className="w-1/6 border-r overflow-hidden p-1 text-center">
                                        </td>
                                        <td className="w-1/4 border-r overflow-hidden p-1 text-right">
                                        </td>
                                        <td className="w-1/4 overflow-hidden p-1 text-right">
                                        </td>
                                      </tr>
                                    )
                                })}
                              </tbody>
                            </table>
                          )
                          : a.utganiiTurul === "object" && a.talbar === "segmentuud" ? 
                          (
                            <table className="w-full">
                              <th className="flex">
                                <td className="w-1/3 overflow-hidden p-1 text-center">
                                  {t("Нэр")}
                                </td>
                                <td className="w-2/3 overflow-hidden p-1 text-center">
                                  {t("Утга")}
                                </td>
                              </th>
                              <tbody className="overflow-y-scroll" style={{ height: "calc(30vh - 15rem)" }}>
                                {segmentuudId?.map((z) => {
                                  return JSON.parse(a.shineUtga)?.filter((b) => b._id === z)?.length > 0 ? JSON.parse(a.shineUtga)?.filter(c => c._id === z).map((b) => 
                                    (
                                      <tr className="flex border-t">
                                        <td className="w-1/3 border-r overflow-hidden p-1 text-left">
                                          {b.ner}
                                        </td>
                                        <td className="w-2/3 overflow-hidden p-1 text-center">
                                          {b.utga}
                                        </td>
                                      </tr>
                                    )) : (
                                      <tr className="flex border-t">
                                        <td className="w-1/3 border-r overflow-hidden p-1 text-left">
                                          &nbsp;
                                        </td>
                                        <td className="w-2/3 overflow-hidden p-1 text-center">
                                        </td>
                                      </tr>
                                    )
                                })}
                              </tbody>
                            </table>
                          ) 
                          : a.utganiiTurul === "object" && a.talbar === "avlaga" ?
                          (
                            <div className="w-full">
                              <th>
                                <td className="w-[10rem] overflow-hidden p-1 text-center">
                                  {t("№")}
                                </td>
                                <td className="w-[8rem] overflow-hidden p-1 text-center">
                                  {t("Огноо")}
                                </td>
                                <td className="w-[8rem] overflow-hidden p-1 text-center">
                                  {t("Төлөх дүн")}
                                </td>
                                <td className="w-[8rem] overflow-hidden p-1 text-center">
                                  {t("Тайлбар")}
                                </td>
                              </th>
                              <tbody className="overflow-y-scroll" style={{ height: "calc(30vh - 15rem)" }}>
                                {JSON.parse(JSON.stringify(a?.shineUtga))}
                              </tbody>
                            </div>
                          )
                          : a.shineUtga}
                  </td>
                </tr>
              ))}
            </tbody>  
          </table>  
        </div>
      </div>
    </>
  );
}

export default React.forwardRef(ZassanMedegdelKharakh);
