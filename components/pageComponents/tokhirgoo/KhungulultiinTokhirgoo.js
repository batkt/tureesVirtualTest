import React, { useState } from "react";
import { Button, InputNumber, notification, Switch } from "antd";
import uilchilgee, { url } from "services/uilchilgee";

import { useAjiltniiJagsaalt } from "hooks/useAjiltan";

function KhuviinMedeelel({
  ajiltan = {},
  token,
  baiguullaga,
  baiguullagaMutate,
  barilgiinId
}) {
  const { ajilchdiinGaralt, ajiltniiJagsaaltMutate } = useAjiltniiJagsaalt(
    token,
    ajiltan?.baiguullagiinId
  );

  const [khungulultiinTokhirgoo, setKhungulultiinTokhirgoo] = useState(null);
  const [khungulukhKhuvi, setKhungulukhKhuvi] = useState(baiguullaga?.tokhirgoo?.deedKhungulultiinKhuvi)

  const khungulultiinTokhirgooKhadgalya = () => {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: khungulultiinTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: "Амжилттай засагдлаа" });
          setKhungulultiinTokhirgoo(null);
          baiguullagaMutate();
        }
      });
  };

  return (
    <>
      <div className=" col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Нийтээр хөнгөлөх
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Хөнгөлөлт идэвхжүүлэх</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    baiguullaga?.tokhirgoo?.bukhAjiltanKhungulultOruulakhEsekh
                  }
                  onChange={(v) =>
                    setKhungulultiinTokhirgoo((a) => ({
                      ...(a || {}),
                      bukhAjiltanKhungulultOruulakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Хөнгөлөлтийн хувь тохируулах</div>
                <div className="text-gray-600">
                  Гараас гэрээ байгуулахад хөнгөлж болох дээд хувь
                </div>
              </div>
              <div className="ml-auto">
                <InputNumber
                  value={khungulukhKhuvi}
                  max={100}
                  min={0}
                  onChange={(v) => {
                    setKhungulultiinTokhirgoo((a) => ({
                      ...(a || {}),
                      deedKhungulultiinKhuvi: v,
                    }))
                    setKhungulukhKhuvi(v)
                  }
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2 ${!!khungulultiinTokhirgoo ? "flex" : "hidden"
              }`}
          >
            <Button type="primary" onClick={khungulultiinTokhirgooKhadgalya}>
              Хадгалах
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default KhuviinMedeelel;
