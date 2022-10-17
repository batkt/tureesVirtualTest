import React, { useState } from "react";
import { Button, InputNumber, notification, Switch } from "antd";
import uilchilgee, { url } from "services/uilchilgee";

import { useAjiltniiJagsaalt } from "hooks/useAjiltan";

function KhuviinMedeelel({
  ajiltan = {},
  token,
  baiguullaga,
  baiguullagaMutate,
}) {
  const { ajilchdiinGaralt, ajiltniiJagsaaltMutate } = useAjiltniiJagsaalt(
    token,
    ajiltan?.baiguullagiinId
  );

  const [ajiltniiTokhirgoo, setAjiltniiTokhirgoo] = useState(null);
  const [khungulultiinTokhirgoo, setKhungulultiinTokhirgoo] = useState(null);

  const ajiltniiTokhirgooKhadgalya = () => {
    const ajiltnuud = [];
    for (const ajiltan in ajiltniiTokhirgoo)
      ajiltnuud.push({ _id: ajiltan, utga: ajiltniiTokhirgoo[ajiltan] });
    ajiltniiTokhirgoo.turul = "tokhirgoo.khungulultUzuulekhEsekh";
    ajiltniiTokhirgoo.ajiltnuud = ajiltnuud;
    uilchilgee(token)
      .post("/ajiltniiTokhirgooZasya", ajiltniiTokhirgoo)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          ajiltniiJagsaaltMutate();
          notification.success({ message: "Амжилттай засагдлаа" });
          setAjiltniiTokhirgoo(null);
        }
      });
  };

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
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Ажилтнаар хөнгөлөлт оруулах
            </h2>
          </div>
          {ajilchdiinGaralt?.jagsaalt?.map((a) => (
            <div className="box" key={a?._id}>
              <div className="flex flex-col items-center p-5 lg:flex-row">
                <div className="image-fit h-24 w-24 lg:mr-1 lg:h-12 lg:w-12">
                  <img
                    alt={a?.ner}
                    src={
                      a?.zurgiinNer
                        ? `${url}/ajiltniiZuragAvya/${a?.baiguullagiinId}/${a?.zurgiinNer}`
                        : ((a?.register?.replace(/^\D+/g, "") % 100) / 10) % 2 <
                          1
                        ? "/profileFemale.svg"
                        : "/profile.svg"
                    }
                    className="rounded-full"
                  />
                </div>
                <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:mt-0 lg:text-left">
                  <a className="font-medium">{a?.ner}</a>
                  <div className="mt-0.5 text-xs text-gray-600">{a?.erkh}</div>
                </div>
                <div className="mt-4 flex lg:mt-0">
                  <Switch
                    defaultChecked={
                      a?.tokhirgoo?.khungulultUzuulekhEsekh || false
                    }
                    onChange={(v) =>
                      setAjiltniiTokhirgoo((o) => ({
                        ...(o || {}),
                        [a._id]: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2 ${
              !!ajiltniiTokhirgoo ? "flex" : "hidden"
            }`}
          >
            <Button type="primary" onClick={ajiltniiTokhirgooKhadgalya}>
              Хадгалах
            </Button>
          </div>
        </div>
      </div>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
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
                  value={baiguullaga?.tokhirgoo?.deedKhungulultiinKhuvi}
                  max={100}
                  min={0}
                  onChange={(v) =>
                    setKhungulultiinTokhirgoo((a) => ({
                      ...(a || {}),
                      deedKhungulultiinKhuvi: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2 ${
              !!khungulultiinTokhirgoo ? "flex" : "hidden"
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
