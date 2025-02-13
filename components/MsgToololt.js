import React, { useMemo } from "react";
import useMsgToololJagsaalt from "../hooks/useMsgToololJagsaalt";
import { Modal, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import useOrder from "tools/function/useOrder";

function MsgToololt({ token, baiguullagiinId, barilgiinId }) {
  
  const { order } = useOrder({ createdAt: -1 });
  const query = useMemo(() => {
    return { baiguullagiinId: baiguullagiinId, barilgiinId: barilgiinId };
  });

  const msjTuukh = useMsgToololJagsaalt("/msgTuukh", query, order);
  const niitToo = useMemo(() => {
    return <span className="font-bold text-green-500">{msjTuukh?.jagsaalt?.length}</span>;
  }, [msjTuukh]);

  const zogsool = useMemo(() => {
    return <span className="font-bold text-green-500">{msjTuukh?.jagsaalt?.filter((a) => !!a.mashiniiDugaar)?.length}</span>;
  }, [msjTuukh]);

  const geree = useMemo(() => {
    return <span className="font-bold text-green-500">{msjTuukh?.jagsaalt?.filter((a) => !!a.gereeniiId)?.length}</span>;
  }, [msjTuukh]);

  const busad = useMemo(() => {
    return <span className="font-bold text-green-500">{msjTuukh?.jagsaalt?.length - msjTuukh?.jagsaalt?.filter((a) => !!a.mashiniiDugaar)?.length - msjTuukh?.jagsaalt?.filter((a) => !!a.gereeniiId)?.length}</span>;
  }, [msjTuukh, niitToo, zogsool, geree]);

  const { t, i18n } = useTranslation();

  const toololtKharya = () => {
    Modal.info({
      className: "p-0",
      title: t("Мессеж дэлгэрэнгүй"),
      content: (
        <div>
          Зогсоол: {zogsool}, Гэрээ: {geree}, Бусад: {busad} 
        </div>
      ),
      okText: t("Хаах"),
      style: { minWidth: "10vw" },
    });
  };
  if (!!msjTuukh)
    return (
      <div className="cursor-pointer" style={{ lineHeight: 0 }}>
        <Tooltip title={t("Мессеж")} onClick={toololtKharya}>
          Мессеж: {niitToo}
        </Tooltip>
      </div>
    );
  else return null;
}

export default MsgToololt;
