import React, { useState } from "react";
import { Button, Input, notification } from "antd";
import uilchilgee from "services/uilchilgee";
import { useTranslation } from "react-i18next";

function Medegdel({ token, baiguullaga, baiguullagaMutate, setSongogdsonTsonkhniiIndex }) {
  const [medegdelTokhirgoo, setMedegdelTokhirgoo] = useState(null);
  const { t } = useTranslation()

  const khungulultiinTokhirgooKhadgalya = () => {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: medegdelTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай засагдлаа") });
          setMedegdelTokhirgoo(null);
          baiguullagaMutate();
          setSongogdsonTsonkhniiIndex(5)
        }
      });
  };

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("СМС тохиргоо")}
            </h2>
          </div>

          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("СМС илгээх түлхүүр")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  defaultValue={baiguullaga?.tokhirgoo?.msgIlgeekhKey}
                  onChange={({ target }) =>
                    setMedegdelTokhirgoo((a) => ({
                      ...(a || {}),
                      msgIlgeekhKey: target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("СМС илгээх дугаар")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  defaultValue={baiguullaga?.tokhirgoo?.msgIlgeekhDugaar}
                  onChange={({ target }) =>
                    setMedegdelTokhirgoo((a) => ({
                      ...(a || {}),
                      msgIlgeekhDugaar: target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2 ${!!medegdelTokhirgoo ? "flex" : "hidden"
              }`}
          >
            <Button type="primary" onClick={khungulultiinTokhirgooKhadgalya}>
              {t("Хадгалах")}
            </Button>
          </div>
        </div>
      </div>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-5"></div>
    </>
  );
}

export default Medegdel;
