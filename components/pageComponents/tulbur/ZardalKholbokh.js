import { Cascader, Modal, notification } from "antd";
import useZardal from "hooks/useZardal";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import formatNumber from "../../../tools/function/formatNumber";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { t } from "i18next";

function ZardalKholbokh(
  { data, token, baiguullagiinId, barilgiinId, onFinish, destroy, dans },
  ref
) {
  const query = useMemo(() => {
    return {
      barilgiinId,
    };
  }, [barilgiinId]);

  const { zardalGaralt } = useZardal(token, baiguullagiinId, query);
  const [songogdsonZardal, setSongogdsonZardal] = useState();

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        const zardliinId = songogdsonZardal[songogdsonZardal?.length - 1];
        uilchilgee(token)
          .post("/zardalKhuvaarilya", { guilgeeniiId: data?._id, zardliinId })
          .then(({ data }) => {
            if (data === "Amjilttai") {
              notification.success({ message: t("Амжилттай") });
              _.isFunction(onFinish) && onFinish();
              destroy();
            }
          })
          .catch(aldaaBarigch);
      },
    }),
    [songogdsonZardal]
  );

  function garya() {
    if (songogdsonZardal !== undefined)
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

    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [songogdsonZardal]);

  useEffect(() => {
    document.getElementById("cascader").focus();
  }, []);

  function onChange(v) {
    setSongogdsonZardal(v);
  }

  return (
    <div className="flex w-full flex-col space-y-4 dark:text-gray-100">
      <label className="text-lg font-medium">{t("Гүйлгээний мэдээлэл")}</label>
      <div className="grid grid-cols-2">
        <div className="space-x-2 p-2">
          <span className="font-medium">{t("Данс")}:</span>
          <span>{data?.dansniiDugaar}</span>
        </div>
        <div className="space-x-2 p-2 text-right">
          <span className="font-medium">{t("Гүйлгээний дүн")}:</span>
          <span>
            {formatNumber(
              data[`${dans?.bank === "tdb" ? "Amt" : "amount"}`],
              2
            )}
            ₮
          </span>
        </div>
        <div className="col-span-2 flex flex-row space-x-2 border-t p-2">
          <div className="font-medium">{t("Тайлбар")}:</div>
          <div>
            {data[`${dans?.bank === "tdb" ? "TxAddInf" : "description"}`]}
          </div>
        </div>
      </div>
      <Cascader
        id="cascader"
        fieldNames={{ label: "ner", value: "_id", children: "dedKhesguud" }}
        options={zardalGaralt?.jagsaalt}
        value={songogdsonZardal}
        onChange={onChange}
        style={{ width: "100%" }}
        dropdownMenuColumnStyle={{ maxWidth: "20rem" }}
        changeOnSelect
        placeholder={t("Зардал сонгох")}
      />
    </div>
  );
}

export default React.forwardRef(ZardalKholbokh);
