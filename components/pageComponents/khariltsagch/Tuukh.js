import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import React from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { t } from "i18next";

function Tuukh({ destroy, data, token }, ref) {
  const { gereeniiMedeelel, gereeniiMedeelelMutate, setGereeniiKhuudaslalt } =
    useGereeniiJagsaalt(token, data?.baiguullagiinId, data?.register);

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
    }),
    []
  );

  return (
    <div className="space-y-2">
      {gereeniiMedeelel?.jagsaalt?.map((a) => (
        <div key={a._id} className="divide-y rounded-lg p-2 shadow-lg">
          <div className="flex w-full flex-row ">
            <div className="w-1/2">{"Талбайн дугаар"}</div>
            <div className="w-1/2">{a.talbainDugaar}</div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2">{t("Эхэлсэн")}</div>
            <div className="w-1/2">
              {moment(a.gereeniiOgnoo).format("YYYY-MM-DD")}
            </div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2">{t("Талбайн дугаар")}</div>
            <div className="w-1/2">
              {moment(a.duusakhOgnoo).format("YYYY-MM-DD")}
            </div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2">{t("Гэрээ байгуулсан хугацаа")}</div>
            <div className="w-1/2">{a.khugatsaa}</div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2">{t("Түрээсийн төлбөр / сар")}</div>
            <div className="w-1/2">{formatNumber(a.sariinTurees)}₮</div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2">{t("Талбайн хөрөнгө")}</div>
            <div className="w-1/2">{formatNumber(a.sariinTurees)}₮</div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2">{t("Хөнгөлөлт хоног")}</div>
            <div className="w-1/2">{formatNumber(a.khungulukhKhugatsaa)}</div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2">{t("Хөнгөлсөн дүн")}</div>
            <div className="w-1/2">{formatNumber(a.sariinTurees)}₮</div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2">{t("Барьцаа төлбөр")}</div>
            <div className="w-1/2">{formatNumber(a.baritsaaAvakhDun)}₮</div>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-1/2">{t("Чиглэл")}</div>
            <div className="w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.forwardRef(Tuukh);
