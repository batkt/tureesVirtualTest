import React, { useState, useEffect, useMemo } from "react";
import { Button, Input, notification } from "antd";
import uilchilgee from "services/uilchilgee";

function Zogsool({ token, baiguullaga, baiguullagaMutate }) {
  const [zogsoolTokhirgoo, setZogsoolTokhirgoo] = useState(null);

  useEffect(() => {
    if (baiguullaga !== undefined) {
      setZogsoolTokhirgoo({
        "tokhirgoo.zogsooliinMinut": baiguullaga?.tokhirgoo?.zogsooliinMinut,
        "tokhirgoo.zogsooliinDun": baiguullaga?.tokhirgoo?.zogsooliinDun,
      });
    }
  }, [baiguullaga]);

  function tokhirgooKhadgalakh() {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: zogsoolTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: "Амжилттай засагдлаа" });
          baiguullagaMutate();
        }
      });
  }

  const isChanged = useMemo(() => {
    if (!zogsoolTokhirgoo) return false;
    return (
      baiguullaga?.tokhirgoo?.zogsooliinMinut !==
        zogsoolTokhirgoo["tokhirgoo.zogsooliinMinut"] ||
      baiguullaga?.tokhirgoo?.zogsooliinDun !==
        zogsoolTokhirgoo["tokhirgoo.zogsooliinDun"]
    );
  }, [zogsoolTokhirgoo, baiguullaga]);

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-5">
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Зогсоол тохиргоо
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Төлбөр тооцох хугацаа/минут/</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  value={zogsoolTokhirgoo?.["tokhirgoo.zogsooliinMinut"]}
                  onChange={({ target }) =>
                    setZogsoolTokhirgoo((a) => ({
                      ...(a || {}),
                      "tokhirgoo.zogsooliinMinut": target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Хугацааны үнэ</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  value={zogsoolTokhirgoo?.["tokhirgoo.zogsooliinDun"]}
                  onChange={({ target }) =>
                    setZogsoolTokhirgoo((a) => ({
                      ...(a || {}),
                      "tokhirgoo.zogsooliinDun": target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          {isChanged && (
            <div
              className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2`}
            >
              <Button type="primary" onClick={tokhirgooKhadgalakh}>
                Хадгалах
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-5"></div>
    </>
  );
}

export default Zogsool;
