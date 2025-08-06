import { Button, InputNumber, message } from "antd";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import uilchilgee from "services/uilchilgee";

function Tasalbar({ token, baiguullaga, barilgiinId }) {
  const [tasalbar, setTasalbar] = useState({
    _id: undefined,
    turul: undefined,
    khemjee: undefined,
    tasalbarTariff: undefined,
  });

  const [tasalbarTariff, setTasalbarTariff] = useState();

  function khadgalakh() {
    tasalbar.baiguullagiinId = baiguullaga._id;
    tasalbar.barilgiinId = barilgiinId;
    tasalbar.tasalbarTariff = tasalbarTariff;
    if (!!tasalbar._id) {
      uilchilgee(token)
        .put(`/tasalbar/${tasalbar._id}`, tasalbar)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(t("Амжилттай хадгаллаа"));
          } else {
            return;
          }
        });
    } else {
      uilchilgee(token)
        .post("/tasalbar", tasalbar)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            uilchilgee(token)
              .get("/tasalbar", {
                baiguullagiinId: baiguullaga._id,
                barilgiinId: barilgiinId,
              })
              .then(({ data }) => {
                if (!!data?.jagsaalt && data.jagsaalt.length > 0) {
                  setTasalbarTariff(data?.jagsaalt[0].tasalbarTariff);
                  setTasalbar(data?.jagsaalt[0]);
                }
              });
            message.success(t("Амжилттай хадгаллаа"));
          } else {
            return;
          }
        });
    }
  }

  useEffect(() => {
    if (!tasalbar._id) {
      uilchilgee(token)
        .get("/tasalbar", {
          baiguullagiinId: baiguullaga._id,
          barilgiinId: barilgiinId,
        })
        .then(({ data }) => {
          if (!!data?.jagsaalt && data.jagsaalt.length > 0) {
            setTasalbarTariff(data?.jagsaalt[0].tasalbarTariff);
            setTasalbar(data?.jagsaalt[0]);
          }
        });
    }
  }, [baiguullaga]);
  return (
    <div className="col-span-12 grid grid-cols-12">
      <div className="col-span-4 p-5 pr-0">
        <div className="box divide-y p-5 py-2">
          <div className="flex items-center justify-between py-2">
            {t("Тасалбарын тариф")}:{" "}
            <InputNumber
              controls={false}
              placeholder="Тасалбарын тариф"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={tasalbarTariff}
              onChange={(v) => setTasalbarTariff(v)}
              className="antdInputTextRight w-[45%]"
            />
          </div>
        </div>
        <div className="box mt-5 flex items-center justify-end px-5 py-2">
          <Button
            className="w-full"
            type="primary"
            onClick={() => khadgalakh()}
          >
            {" "}
            {t("Хадгалах")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Tasalbar;
