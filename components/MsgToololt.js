import React, { useMemo, useState } from "react";
import useMsgToololJagsaalt from "../hooks/useMsgToololJagsaalt";
import { DatePicker, Modal, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import useOrder from "tools/function/useOrder";
import moment from "moment";
import { CloseCircleOutlined } from "@ant-design/icons";
import formatNumber from "tools/function/formatNumber";

function MsgToololt({ token, baiguullagiinId, barilgiinId, msgNegjUne }) {
  const { order } = useOrder({ createdAt: -1 });
  const [ognoonuud, setOgnoonuud] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const query = useMemo(() => {
    return {
      baiguullagiinId: baiguullagiinId,
      barilgiinId: barilgiinId,
      createdAt:
        ognoonuud?.length > 0
          ? {
              $gte: moment(ognoonuud[0])
                .startOf("month")
                .format("YYYY-MM-DD 00:00:00"),
              $lte: moment(ognoonuud[1])
                .endOf("month")
                .format("YYYY-MM-DD 23:59:59"),
            }
          : undefined,
    };
  }, [ognoonuud, barilgiinId]);

  const msjTuukh = useMsgToololJagsaalt("/msgTuukh", query, order);
  const niitToo = useMemo(() => {
    return msjTuukh?.jagsaalt?.length || 0;
  }, [msjTuukh, ognoonuud]);

  const zogsool = useMemo(() => {
    return (
      msjTuukh?.jagsaalt?.filter((a) => !!a.mashiniiDugaar && !a.turul)
        ?.length || 0
    );
  }, [msjTuukh, ognoonuud]);

  const zogsoolAvlaga = useMemo(() => {
    return (
      msjTuukh?.jagsaalt?.filter(
        (a) => !!a.mashiniiDugaar && a.turul === "zurchil"
      )?.length || 0
    );
  }, [msjTuukh, ognoonuud]);

  const geree = useMemo(() => {
    return msjTuukh?.jagsaalt?.filter((a) => !!a.gereeniiId)?.length || 0;
  }, [msjTuukh, ognoonuud]);

  const busad = useMemo(() => {
    return niitToo - zogsool - zogsoolAvlaga - geree;
  }, [msjTuukh, niitToo, zogsool, geree, ognoonuud]);

  const { t, i18n } = useTranslation();

  const toololtKharya = () => {
    setModalOpen(true);
  };
  const handleCancel = () => {
    setModalOpen(false);
  };
  if (!!msjTuukh)
    return (
      <div className="cursor-pointer" style={{ lineHeight: 0 }}>
        Мессеж:
        <Tooltip
          title={t("Мессеж")}
          className="p-1 font-bold text-green-500"
          onClick={toololtKharya}
        >
          {niitToo}
        </Tooltip>
        <Modal
          open={modalOpen}
          className="p-0"
          title={t("Мессеж дэлгэрэнгүй")}
          okText={t("Хаах")}
          cancelButtonProps={{ style: { display: "none" } }}
          style={{ minWidth: "10vw" }}
          onCancel={handleCancel}
          closeIcon={
            <div className={`flex p-4 text-xl hover:text-red-400`}>
              {" "}
              <CloseCircleOutlined />{" "}
            </div>
          }
          footer={false}
        >
          <div>
            <DatePicker.RangePicker
              allowClear={false}
              style={{ width: "100%" }}
              picker="month"
              placeholder={[t("Эхлэх сар"), t("Дуусах сар")]}
              onChange={(v) => {
                setOgnoonuud(v);
              }}
            />
            <table className="mt-2 w-full border-2 border-gray-500">
              <thead>
                <tr className="bg-gray-400 text-center text-white">
                  <td className="border border-gray-400 text-mashJijigiinJijig"></td>
                  <td className="border border-gray-400 text-mashJijigiinJijig">
                    Тоо
                  </td>
                  <td className="border border-gray-400 text-mashJijigiinJijig">
                    Нэгж
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 text-mashJijigiinJijig">
                    Гэрээ
                  </td>
                  <td className="border border-gray-400 text-center text-mashJijigiinJijig">
                    {geree}
                  </td>
                  <td
                    className="border border-gray-400 text-center text-mashJijigiinJijig"
                    rowSpan={4}
                  >
                    {msgNegjUne}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 text-mashJijigiinJijig">
                    Зогсоол
                  </td>
                  <td className="border border-gray-400 text-center text-mashJijigiinJijig">
                    {zogsool}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 text-mashJijigiinJijig">
                    Зогсоолын Авлага
                  </td>
                  <td className="border border-gray-400 text-center text-mashJijigiinJijig">
                    {zogsoolAvlaga}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 text-mashJijigiinJijig">
                    Гараас
                  </td>
                  <td className="border border-gray-400 text-center text-mashJijigiinJijig">
                    {busad}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 text-mashJijigiinJijig">
                    Нийт
                  </td>
                  <td className="border border-gray-400 text-center text-mashJijigiinJijig">
                    {niitToo}
                  </td>
                  <td className="border border-gray-400 text-right text-mashJijigiinJijig font-bold">
                    {formatNumber(msgNegjUne * niitToo, 2)}₮
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
    );
  else return null;
}

export default MsgToololt;
