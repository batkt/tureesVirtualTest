import React from "react";
import { message, Upload } from "antd";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import _ from "lodash";
import { t } from "i18next";
import { toast } from "sonner";

function ZuvhunKhunglukhModalContent(
  {
    destroy,
    songogdsonData,
    barilgiinId,
    ajiltan,
    token,
    zogsool,
    khungulukhTsag,
    khungulultTurul,
  },
  ref
) {
  const [aldaa, setAldaa] = React.useState(null);

  function garya() {
    destroy();
  }

  React.useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      ilgeeye() {
        const turul = khungulultTurul || "fitness";
        const tsag = Number(khungulukhTsag) || 2;
        const khungulult =
          turul === "ugaalga"
            ? tsag === 24
              ? songogdsonData?.ugaalgaHungulult24
              : songogdsonData?.ugaalgaHungulult
            : tsag === 24
            ? songogdsonData?.fitnessHungulult24
            : songogdsonData?.fitnessHungulult;

        const dun = Number(khungulult) || 0;
        if (dun <= 0) {
          toast.error(t("Хөнгөлөлтийн дүн 0 байна"));
          return;
        }
        uilchilgee(token)
          .post("/v1/kioskPay", {
            turul: "kiosk",
            uilchluulegchiinId: songogdsonData?.session_id,
            paid_amount: 0,
            plate_number: songogdsonData?.plate_number,
            barilgiinId,
            ajiltniiNer: ajiltan?.ner,
            ajiltniiId: ajiltan?._id,
            zogsoolUndsenUne:
              Number(songogdsonData?.ugaalgaHungulult) ||
              Number(songogdsonData?.parkingUndsenUne) ||
              Number(zogsool?.undsenUne) ||
              2000,
            khungulukhTsag: tsag,
            khungulult: dun,
          })
          .then((res) => {
            if (res.data === "Amjilttai") {
              destroy();
              toast.success(t("Амжилттай хөнгөлөлт орууллаа"));
            }
          })
          .catch((err) => {
            aldaaBarigch(err);
          });
      },
      khaaya() {
        destroy();
      },
    }),
    []
  );

  return (
    <div className="dark:text-white">
      Та уг машины дугаараар хөнгөлөлт оруулах гэж байна, Зөв уу?
    </div>
  );
}

export default React.forwardRef(ZuvhunKhunglukhModalContent);
