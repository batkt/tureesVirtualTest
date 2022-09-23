import React, { useMemo, useRef } from "react";
import { Button, InputNumber, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import useJagsaalt from "hooks/useJagsaalt";
import { useAuth } from "services/auth";
import ZardalBurtgel from "./ZardalBurtgel";
import { modal } from "components/ant/Modal";
import formatNumber from "tools/function/formatNumber";
import deleteMethod from "tools/function/crud/deleteMethod";

function AshiglaltiinZardal({ baiguullaga, token }) {
  const { barilgiinId } = useAuth();
  const query = useMemo(() => ({ barilgiinId }), [barilgiinId]);
  const ashiglaltiinZardal = useJagsaalt("/ashiglaltiinZardluud", query);
  const ref = useRef();

  function zardalBurtgeye(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "Дансны бүртгэл",
      icon: <PlusOutlined />,
      content: (
        <ZardalBurtgel
          ref={ref}
          data={data}
          token={token}
          barilgiinId={barilgiinId}
          baiguullagiinId={baiguullaga?._id}
          refresh={ashiglaltiinZardal.refresh}
        />
      ),
      footer,
    });
  }

  function ustgaya(mur) {
    deleteMethod("ashiglaltiinZardluud", token, mur?._id).then(
      ({ data }) => data === "Amjilttai" && ashiglaltiinZardal.refresh()
    );
  }

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Ашиглалтын зардал
            </h2>
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-500 fill-current p-2 text-white"
              onClick={() => zardalBurtgeye()}
            >
              <Tooltip title="Нэмэх">
                <PlusOutlined />
              </Tooltip>
            </div>
          </div>
          {ashiglaltiinZardal.jagsaalt?.map((mur) => {
            return (
              <div className="box" key={mur._id}>
                <div className="flex items-center p-5">
                  <div className="border-l-2 border-green-500 pl-4">
                    <div className="font-medium">{mur.ner}</div>
                    <div className="text-gray-600">{mur.turul}</div>
                  </div>
                  <div className="ml-auto">{formatNumber(mur.tariff)}</div>
                  <div className="ml-5 flex space-x-2">
                    <Popconfirm
                      title={`${mur.ner} данс устгах уу?`}
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => ustgaya(mur)}
                    >
                      <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 fill-current p-2 text-white">
                        <Tooltip title="Устгах">
                          <DeleteOutlined size={20} />
                        </Tooltip>
                      </div>
                    </Popconfirm>
                    <div
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-yellow-500 fill-current p-2 text-white"
                      onClick={() => zardalBurtgeye(mur)}
                    >
                      <Tooltip title="Засах">
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
