import { Cascader, notification } from "antd";
import useZardal from "hooks/useZardal";
import _ from "lodash";
import React, { useState } from "react";
import formatNumber from "../../../tools/function/formatNumber";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

function ZardalKholbokh(
  { data, token, baiguullagiinId, onFinish, destroy, dans },
  ref
) {
  const { zardalGaralt } = useZardal(token, baiguullagiinId);
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
              notification.success({ message: "Амжилттай" });
              _.isFunction(onFinish) && onFinish();
              destroy();
            }
          })
          .catch(aldaaBarigch);
      },
    }),
    [songogdsonZardal]
  );

  function onChange(v) {
    setSongogdsonZardal(v);
  }

  return (
    <div className="flex w-full flex-col space-y-4 dark:text-gray-100">
      <label className="text-lg font-medium">Гүйлгээний мэдээлэл</label>
      <div className="grid grid-cols-2">
        <div className="space-x-2 p-2">
          <span className="font-medium">Данс:</span>
          <span>{data?.dansniiDugaar}</span>
        </div>
        <div className="space-x-2 p-2 text-right">
          <span className="font-medium">Гүйлгээний дүн:</span>
          <span>
            {formatNumber(
              data[`${dans?.bank === "tdb" ? "Amt" : "amount"}`],
              2
            )}
            ₮
          </span>
        </div>
        <div className="col-span-2 flex flex-row space-x-2 border-t p-2">
          <div className="font-medium">Тайлбар:</div>
          <div>
            {data[`${dans?.bank === "tdb" ? "TxAddInf" : "description"}`]}
          </div>
        </div>
      </div>
      <Cascader
        fieldNames={{ label: "ner", value: "_id", children: "dedKhesguud" }}
        options={zardalGaralt?.jagsaalt}
        value={songogdsonZardal}
        onChange={onChange}
        style={{width:'100%'}}
        changeOnSelect
        placeholder="Зардал сонгох"
      />
    </div>
  );
}

export default React.forwardRef(ZardalKholbokh);
