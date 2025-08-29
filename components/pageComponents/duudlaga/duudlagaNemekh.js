import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { Select, notification, Modal } from "antd";

function duudlagaNemekh(
  { token, destroy, baiguullaga, setDuudlaga, duudlaga, t },
  ref
) {
  const { ajilchdiinGaralt } = useAjiltniiJagsaalt(token, baiguullaga?._id);

  const [songogdsonAjiltan, setSongogdsonAjiltan] = useState();
  
  useEffect(() => {
    if (!!duudlaga?.ajiltniiNer && !!duudlaga?.ajiltniiId) {
      setSongogdsonAjiltan({
        _id: duudlaga.ajiltniiId,
        ner: duudlaga?.ajiltniiNer,
      });
    }
  }, [duudlaga]);

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
      khadgalya() {
        if (!songogdsonAjiltan) {
          notification.warn({
            description: t("Ажилтан сонгоно уу !"),
            message: t("Анхаар"),
          });
          return;
        }
        setDuudlaga((v) => ({
          ...v,
          ["ajiltniiId"]: songogdsonAjiltan._id,
          ["ajiltniiNer"]: songogdsonAjiltan.ner,
        }));
        destroy();
      },
    }),
    [songogdsonAjiltan]
  );

  function garya() {
    if (songogdsonAjiltan !== undefined)
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
    if (songogdsonAjiltan !== undefined) {
      document.getElementById("ajiltanSongokhButton").focus();
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [songogdsonAjiltan]);

  useEffect(() => {
    document.getElementById("ajiltanSongokhInput").focus();
  }, []);

  return (
    <Select
      id="ajiltanSongokhInput"
      placeholder={t("Ажилтан")}
      defaultValue={duudlaga?.ajiltniiId}
      style={{ width: "100%" }}
      onChange={(e) =>
        setSongogdsonAjiltan(
          ajilchdiinGaralt?.jagsaalt.find((a) => a._id === e)
        )
      }
    >
      {ajilchdiinGaralt?.jagsaalt?.map((mur) => (
        <Select.Option key={`${mur._id}ajiltan`} value={mur._id}>
          <div className="flex flex-row justify-between">
            <span>
              {mur.ovog && mur.ovog[0]}.{mur.ner}
            </span>
            <span>{mur.register}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
}

export default React.forwardRef(duudlagaNemekh);
