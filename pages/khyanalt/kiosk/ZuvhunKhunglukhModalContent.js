import React from "react";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import _ from "lodash";
import { t } from "i18next";

function ZuvhunKhunglukhModalContent(
  { destroy, songogdsonData, barilgiinId, ajiltan, token },
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
        uilchilgee(token)
          .post("/v1/kioskPay", {
            turul: "kiosk",
            uilchluulegchiinId: songogdsonData?.session_id,
            paid_amount: 0,
            plate_number: songogdsonData?.plate_number,
            barilgiinId,
            ajiltniiNer: ajiltan?.ner,
            ajiltniiId: ajiltan?._id,
          })
          .then((res) => {
            if (res.data === "Amjilttai") {
              destroy();
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

  return <div>Та хөнгөлөхдөө итгэлтэй байна уу?</div>;
}

export default React.forwardRef(ZuvhunKhunglukhModalContent);
