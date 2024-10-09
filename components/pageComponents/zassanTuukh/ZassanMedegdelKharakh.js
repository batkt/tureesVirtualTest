import React, { useEffect, useImperativeHandle } from "react";
import { Form, Modal } from "antd";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useTranslation } from "react-i18next";
function ZassanMedegdelKharakh({ data, destroy }, ref) {
  const { t } = useTranslation()
  const [form] = Form.useForm();

  useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  return (
    <>
      <div className="flex dark:text-gray-400">
        <div className="border-2 p-5 w-1/4">
          <div className="flex justify-between">
            <div> {t("Төрөл")}:</div>
            <div> {data.className} </div>
          </div>  
          <div className="flex justify-between">   
            <div> {t("Дугаар")}:</div>
            <div> {data.classDugaar} </div>
          </div>  
          <div className="flex justify-between">   
            <div> {t("Зассан ажилтан")}:</div>
            <div> {data.ajiltniiNer} </div>
          </div>  
          <div className="flex justify-between">     
            <div> {t("Зассан онгоо")}:</div>
            <div> {moment(data.createdAt).format("YYYY-MM-DD HH:mm")} </div>
          </div>
        </div>
        <div className="border-2 ml-5 p-5 w-3/4 overflow-y-scroll h-[600px]">
          <th className="w-full">
            <td className="w-[10rem] overflow-hidden p-1 text-center">
              {t("Талбарын нэр")}
            </td>
            <td className="w-[35rem] overflow-hidden p-1 text-center">
              {t("Өмнөх утга")}
            </td>
            <td className="w-[35rem] overflow-hidden p-1 text-center">
              {t("Шинэ утга")}
            </td>
          </th>
          <tbody>
            {data?.uurchlult?.map((a) => (
              <tr className="flex border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400">
                <td className="w-[10rem] overflow-hidden p-1 text-center">
                  <div> {a.talbarNer} </div>
                </td>
                <td className="w-[35rem] overflow-hidden p-1 text-right">
                  {a.utganiiTurul === "number" ? formatNumber(a.umnukhUtga, 2) 
                    : a.utganiiTurul === "date" ? moment(a.umnukhUtga).format("YYYY-MM-DD HH:mm")  
                    : a.utganiiTurul === "object" && a.talbar === "zardluud" ? 
                      (
                        <div className="w-full">
                          <th>
                            <td className="w-[10rem] overflow-hidden p-1 text-center">
                              {t("Нэр")}
                            </td>
                            <td className="w-[8rem] overflow-hidden p-1 text-center">
                              {t("Төрөл")}
                            </td>
                            <td className="w-[8rem] overflow-hidden p-1 text-center">
                              {t("Үнэ")}
                            </td>
                            <td className="w-[8rem] overflow-hidden p-1 text-center">
                              {t("Төлөх дүн")}
                            </td>
                          </th>
                          <tbody className="overflow-y-scroll" style={{ height: "calc(30vh - 15rem)" }}>
                            {JSON.parse(a.umnukhUtga)?.map((b) => (
                              <tr className="flex border-b">
                                <td className="w-[10rem] overflow-hidden p-1 text-center">
                                  {b.ner}
                                </td>
                                <td className="w-[8rem] overflow-hidden p-1 text-center">
                                  {b.turul}
                                </td>
                                <td className="w-[8rem] overflow-hidden p-1 text-right">
                                  {formatNumber(b.tariff)}
                                </td>
                                <td className="w-[8rem] overflow-hidden p-1 text-right">
                                  {formatNumber(b.tulukhDun)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </div>
                      )
                    : a.umnukhUtga}
                </td>
                <td className="w-[35rem] overflow-hidden p-1 text-right">
                  {a.utganiiTurul === "number" ? formatNumber(a.shineUtga, 2) 
                        : a.utganiiTurul === "date" ? moment(a.shineUtga).format("YYYY-MM-DD HH:mm")
                        : a.utganiiTurul === "object" && a.talbar === "zardluud" ? 
                        (
                          <div className="w-full">
                            <th>
                              <td className="w-[10rem] overflow-hidden p-1 text-center">
                                {t("Нэр")}
                              </td>
                              <td className="w-[8rem] overflow-hidden p-1 text-center">
                                {t("Төрөл")}
                              </td>
                              <td className="w-[8rem] overflow-hidden p-1 text-center">
                                {t("Үнэ")}
                              </td>
                              <td className="w-[8rem] overflow-hidden p-1 text-center">
                                {t("Төлөх дүн")}
                              </td>
                            </th>
                            <tbody className="overflow-y-scroll" style={{ height: "calc(30vh - 15rem)" }}>
                              {JSON.parse(a.shineUtga)?.map((b) => (
                                <tr className="flex border-b">
                                  <td className="w-[10rem] overflow-hidden p-1 text-center">
                                    {b.ner}
                                  </td>
                                  <td className="w-[8rem] overflow-hidden p-1 text-center">
                                    {b.turul}
                                  </td>
                                  <td className="w-[8rem] overflow-hidden p-1 text-right">
                                    {formatNumber(b.tariff)}
                                  </td>
                                  <td className="w-[8rem] overflow-hidden p-1 text-right">
                                    {formatNumber(b.tulukhDun)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </div>
                        )
                        : a.shineUtga}
                </td>
              </tr>
            ))}
          </tbody>  
        </div>
      </div>
    </>
  );
}

export default React.forwardRef(ZassanMedegdelKharakh);
