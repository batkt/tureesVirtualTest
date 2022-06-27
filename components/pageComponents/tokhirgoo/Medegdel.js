import React, { useState } from "react";
import { Button, Input, InputNumber, notification, Switch } from "antd";
import uilchilgee, { url } from "services/uilchilgee";

import { useAjiltniiJagsaalt } from "hooks/useAjiltan";

function Medegdel({ token, baiguullaga, baiguullagaMutate }) {
  const [medegdelTokhirgoo, setMedegdelTokhirgoo] = useState(null);

  const khungulultiinTokhirgooKhadgalya = () => {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: medegdelTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: "Амжилттай засагдлаа" });
          setMedegdelTokhirgoo(null);
          baiguullagaMutate();
        }
      });
  };

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-5">
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              СМС тохиргоо
            </h2>
          </div>

          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">СМС илгээх түлхүүр</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  value={baiguullaga?.tokhirgoo?.msgIlgeekhKey}
                  max={100}
                  min={0}
                  onChange={(v) =>
                    setMedegdelTokhirgoo((a) => ({
                      ...(a || {}),
                      "tokhirgoo.msgIlgeekhKey": v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">СМС илгээх дугаар</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  value={baiguullaga?.tokhirgoo?.msgIlgeekhDugaar}
                  max={100}
                  min={0}
                  onChange={(v) =>
                    setMedegdelTokhirgoo((a) => ({
                      ...(a || {}),
                      "tokhirgoo.msgIlgeekhDugaar": v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2 ${
              !!medegdelTokhirgoo ? "flex" : "hidden"
            }`}
          >
            <Button type="primary" onClick={khungulultiinTokhirgooKhadgalya}>
              Хадгалах
            </Button>
          </div>
        </div>
      </div>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-5"></div>
    </>
  );
}

export default Medegdel;
