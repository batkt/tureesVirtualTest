import { Button, Image, message, Modal, notification } from "antd";
import React, { useEffect, useState } from "react";
import { socket } from "services/uilchilgee";
import formatNumber from "tools/function/formatNumber";

function QpayModal({
  qpayerTulukh,
  khuleegdejBuiQpay,
  baiguullaga,
  batalgaajuulaltKhiiya,
  handleCancelQpay,
  qpayModalTuluv,
  setQpayerTulukh,
  setQpayModalTuluv,
  qpayerTulukhDun,
  setQpayTulsun,
}) {
  useEffect(() => {
    if (khuleegdejBuiQpay) {
      socket().on(`qpay/${baiguullaga._id}/${khuleegdejBuiQpay}`, (qpay) => {
        if (qpayerTulukh !== "Tulugdsun") {
          notification.success({ message: "Qpay Амжилттай төлөгдлөө" });
          batalgaajuulaltKhiiya("qpayTulugdsun");
          setQpayerTulukh("Tulugdsun");
          setQpayModalTuluv(false);
          setQpayTulsun(true);
        }
      });
    }
    return () => {
      socket().off(`qpay${khuleegdejBuiQpay}`);
    };
  }, [khuleegdejBuiQpay]);

  return (
    <>
      <Modal
        width={"438px"}
        okText="Бүртгэх"
        footer={false}
        header={false}
        cancelButtonProps={{ style: { display: "none" } }}
        title={false}
        open={qpayModalTuluv}
        onCancel={handleCancelQpay}
      >
        <div className="flex h-[450px] w-full flex-col items-center justify-center gap-[60px] pb-0">
          <img src={`data:image/png;base64,${qpayerTulukh?.qr_image}`} />
        </div>
        <div className="w-full text-center text-green-400">
          {formatNumber(qpayerTulukhDun)} ₮
        </div>
      </Modal>
    </>
  );
}
export default QpayModal;
