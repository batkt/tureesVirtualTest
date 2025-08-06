import React, { useState } from "react";
import { Button, DatePicker, notification } from "antd";
import { SolutionOutlined } from "@ant-design/icons";
import uilchilgee from "services/uilchilgee";
import moment from "moment";
import { useTranslation } from "react-i18next";

function AppTokhirgoo({ token, baiguullaga, setSongogdsonTsonkhniiIndex }) {
  const [idvekhtei, setIdvekhgui] = useState(
    !!baiguullaga?.tokhirgoo?.khereglegchEkhlekhOgnoo
  );
  const { t } = useTranslation();

  const [ekhlekhOgnoo, setekhlekhOgnoo] = useState();
  function ekhlehOgnooBurtgey() {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", {
        tokhirgoo: {
          khereglegchEkhlekhOgnoo: moment(ekhlekhOgnoo).format(
            "YYYY-MM-DD 00:00:00"
          ),
        },
      })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай засагдлаа") });
          setIdvekhgui(true);
          setSongogdsonTsonkhniiIndex(11);
        }
      });
  }
  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Аппликейшин тохиргоо")}
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Ашиглаж эхлэх огноо")}</div>
              </div>
              <div className="ml-auto w-1/2">
                <DatePicker
                  disabled={idvekhtei}
                  name="ekhlehOgnoo"
                  style={{ width: "100%" }}
                  defaultValue={
                    baiguullaga?.tokhirgoo?.khereglegchEkhlekhOgnoo &&
                    moment(baiguullaga.tokhirgoo.khereglegchEkhlekhOgnoo)
                  }
                  prefix={<SolutionOutlined />}
                  onChange={setekhlekhOgnoo}
                />
              </div>
            </div>

            <div
              hidden={!idvekhtei}
              className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5"
            >
              <p className="font-meium mr-auto text-xs dark:text-gray-200">
                {t(
                  "Хэрвээ энэхүү тохиргоог өөрчлөхийг хүсвэл манай байгууллагад хандана уу"
                )}
              </p>
            </div>
          </div>
          <div className="dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pb-2 pt-2">
            <Button
              disabled={idvekhtei}
              type="primary"
              onClick={ekhlehOgnooBurtgey}
            >
              {t("Хадгалах")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppTokhirgoo;
