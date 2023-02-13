import React, { useMemo, useRef } from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import useJagsaalt from "hooks/useJagsaalt";
import { useAuth } from "services/auth";
import ZardalBurtgel from "./ZardalBurtgel";
import { modal } from "components/ant/Modal";
import formatNumber from "tools/function/formatNumber";
import deleteMethod from "tools/function/crud/deleteMethod";
import { useTranslation } from "react-i18next";

function AshiglaltiinZardal({ baiguullaga, token }) {
  const { t } = useTranslation()
  const { barilgiinId } = useAuth();
  const khuvisakhQuery = useMemo(() => ({ barilgiinId,turul:{$nin:['Дурын','Тогтмол']} }), [barilgiinId]);
  const togtmolQuery = useMemo(() => ({ barilgiinId,turul:{$in:['Дурын','Тогтмол']}}), [barilgiinId]);
  const khuvisakhZardal = useJagsaalt("/ashiglaltiinZardluud", khuvisakhQuery);
  const togtmolZardal = useJagsaalt("/ashiglaltiinZardluud", togtmolQuery);
  const ref = useRef();

  function zardalBurtgeye(data,togtmolEsekh) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        {t("Хадгалах")}
      </Button>,
    ];
    modal({
      title: t("Зардал бүртгэл"),
      icon: <PlusOutlined />,
      content: (
        <ZardalBurtgel
          ref={ref}
          data={data}
          token={token}
          barilgiinId={barilgiinId}
          togtmolEsekh={togtmolEsekh}
          baiguullagiinId={baiguullaga?._id}
          refresh={togtmolEsekh ? togtmolZardal.refresh : khuvisakhZardal.refresh}
        />
      ),
      footer,
    });
  }

  function ustgaya(mur,togtmolEsekh) {
    deleteMethod("ashiglaltiinZardluud", token, mur?._id).then(
      ({ data }) => data === "Amjilttai" && (togtmolEsekh ? togtmolZardal : khuvisakhZardal).refresh()
    );
  }

  return (
    <>
     <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Хувьсах зардал")}
            </h2>
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-500 fill-current p-2 text-white"
              onClick={() => zardalBurtgeye()}
            >
              <Tooltip title={t("Нэмэх")}>
                <PlusOutlined />
              </Tooltip>
            </div>
          </div>
          {khuvisakhZardal.jagsaalt?.map((mur) => {
            return (
              <div className="box" key={mur._id}>
                <div className="flex items-center p-5">
                  <div className="border-l-2 border-green-500 pl-4">
                    <div className="font-medium">{mur.ner}</div>
                    <div className="text-gray-600">{mur.turul}</div>
                  </div>
                  <div className="ml-auto">{formatNumber(mur.tariff,2)}</div>
                  <div className="ml-5 flex space-x-2">
                    <Popconfirm
                      title={`${mur.ner} зардал устгах уу?`}
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => ustgaya(mur)}
                    >
                      <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 fill-current p-2 text-white">
                        <Tooltip title={t("Устгах")}>
                          <DeleteOutlined size={20} />
                        </Tooltip>
                      </div>
                    </Popconfirm>
                    <div
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-yellow-500 fill-current p-2 text-white"
                      onClick={() => zardalBurtgeye(mur)}
                    >
                      <Tooltip title={t("Засах")}>
                        <EditOutlined />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Тогтмол зардал")}
            </h2>
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-500 fill-current p-2 text-white"
              onClick={() => zardalBurtgeye(undefined,true)}
            >
              <Tooltip title={t("Нэмэх")}>
                <PlusOutlined />
              </Tooltip>
            </div>
          </div>
          {togtmolZardal.jagsaalt?.map((mur) => {
            return (
              <div className="box" key={mur._id}>
                <div className="flex items-center p-5">
                  <div className="border-l-2 border-green-500 pl-4">
                    <div className="font-medium">{mur.ner}</div>
                    <div className="text-gray-600">{mur.turul}</div>
                  </div>
                  <div className="ml-auto">{formatNumber(mur.tariff,2)}</div>
                  <div className="ml-5 flex space-x-2">
                    <Popconfirm
                      title={`${mur.ner} зардал устгах уу?`}
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => ustgaya(mur,true)}
                    >
                      <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 fill-current p-2 text-white">
                        <Tooltip title="Устгах">
                          <DeleteOutlined size={20} />
                        </Tooltip>
                      </div>
                    </Popconfirm>
                    <div
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-yellow-500 fill-current p-2 text-white"
                      onClick={() => zardalBurtgeye(mur,true)}
                    >
                      <Tooltip title={t("Засах")}>
                        <EditOutlined />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default AshiglaltiinZardal;
