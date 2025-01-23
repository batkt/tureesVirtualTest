import React, { useCallback, useEffect } from "react";
import formatNumber from "tools/function/formatNumber";
import uilchilgee from "services/uilchilgee";
import { t } from "i18next";
const { DatePicker, InputNumber, message, Modal } = require("antd");
const moment = require("moment");

const Sungakh = React.forwardRef(({ token, destroy, confirm, data }, ref) => {
  const [sar, setSar] = React.useState(1);
  const [duusakhOgnoo, setDuusakhOgnoo] = React.useState(
    moment(data?.duusakhOgnoo).add(1, data?.turGereeEsekh === true ? "day" : "month")
  );
  React.useEffect(() => {
    setDuusakhOgnoo(moment(data?.duusakhOgnoo).add(sar, data?.turGereeEsekh === true ? "day" : "month"));
  }, [sar]);
  function garya() {
    if (
      moment(data?.duusakhOgnoo).add(1, data?.turGereeEsekh === true ? "day" : "month").format("YYYY-MM-DD") !=
      moment(duusakhOgnoo).format("YYYY-MM-DD")
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
    document.getElementById("sungakhSar").focus();
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [duusakhOgnoo]);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "sungakhSar":
          document.getElementById("ognoo").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        uilchilgee(token)
          .post("/gereeSungaya", {
            gereeniiId: data?._id,
            barilgiinId: data?.barilgiinId,
            duusakhOgnoo,
            sar,
          })
          .then(({ data }) => {
            if (data === "Amjilttai") {
              message.success(t("Гэрээ амжилттай сунгалаа"));
              confirm(duusakhOgnoo);
              destroy();
            }
          });
      },
      khaaya() {
        destroy();
      },
    }),
    [duusakhOgnoo]
  );

  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-2">
        <div className="flex w-full flex-row justify-between">
          <div className="text-right">{t("Эхлэх огноо")}:</div>
          <div className="font-medium">{moment(data?.gereeniiOgnoo).format("YYYY-MM-DD")}</div>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-right">{t("Дуусах огноо")}:</div>
          <div className="font-medium">{moment(data?.duusakhOgnoo).format("YYYY-MM-DD")}</div>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-right">{t("Ашигласан хоног")}:</div>
          <div className="font-medium">
            {moment(new Date()).diff(moment(data?.gereeniiOgnoo), "day")}
          </div>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-right">{t("Авлагын дүн")}:</div>
          <div className="font-medium">{formatNumber(data?.uldegdel)}</div>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-right">{data?.turGereeEsekh === true ? "Сунгах өдөр:" : "Сунгах сар:"}</div>
          <InputNumber
            id="sungakhSar"
            onKeyUp={focuser}
            style={{ width: "60%" }}
            value={sar}
            onChange={setSar}
            className="font-medium"
          />
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="text-right">{t("Дуусгах огноо")}:</div>
          <DatePicker
            id="ognoo"
            className="font-medium"
            allowClear={false}
            style={{ width: "60%" }}
            value={duusakhOgnoo}
            onChange={setDuusakhOgnoo}
            disabledDate={(current) => {
              let minDate = moment(duusakhOgnoo).startOf("month").format("YYYY-MM-DD");
              let maxDate = moment(duusakhOgnoo).endOf("month").format("YYYY-MM-DD");
              return (current <= moment(maxDate, "YYYY-MM-DD") && current >= moment(minDate, "YYYY-MM-DD")) === false;
            }} 
          />
        </div>
      </div>
    </div>
  );
});

export default Sungakh;
