import React, { useState, useEffect, useMemo } from "react";
import { Button, Input, notification } from "antd";
import uilchilgee from "services/uilchilgee";

function Zogsool({ token, baiguullaga, baiguullagaMutate, setSongogdsonTsonkhniiIndex }) {
  const [zogsoolTokhirgoo, setZogsoolTokhirgoo] = useState(null);

  useEffect(() => {
    if (baiguullaga !== undefined) {
      setZogsoolTokhirgoo({
        zogsooliinMinut: baiguullaga?.tokhirgoo?.zogsooliinMinut,
        zogsooliinDun: baiguullaga?.tokhirgoo?.zogsooliinDun,
        zogsooliinKhungulukhMinut:
          baiguullaga?.tokhirgoo?.zogsooliinKhungulukhMinut,
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
          setSongogdsonTsonkhniiIndex(10);
        }
      });
  }

  const isChanged = useMemo(() => {
    if (!zogsoolTokhirgoo) return false;
    return (
      baiguullaga?.tokhirgoo?.zogsooliinMinut !==
      zogsoolTokhirgoo["zogsooliinMinut"] ||
      baiguullaga?.tokhirgoo?.zogsooliinDun !==
      zogsoolTokhirgoo["zogsooliinDun"] ||
      baiguullaga?.tokhirgoo?.zogsooliinKhungulukhMinut !==
      zogsoolTokhirgoo["zogsooliinKhungulukhMinut"]
    );
  }, [zogsoolTokhirgoo, baiguullaga]);

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
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
                  value={zogsoolTokhirgoo?.["zogsooliinMinut"]}
                  onChange={({ target }) =>
                    setZogsoolTokhirgoo((a) => ({
                      ...(a || {}),
                      zogsooliinMinut: target.value,
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
                  value={zogsoolTokhirgoo?.["zogsooliinDun"]}
                  onChange={({ target }) =>
                    setZogsoolTokhirgoo((a) => ({
                      ...(a || {}),
                      zogsooliinDun: target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Хөнгөлөх минут</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  value={zogsoolTokhirgoo?.["zogsooliinKhungulukhMinut"]}
                  onChange={({ target }) =>
                    setZogsoolTokhirgoo((a) => ({
                      ...(a || {}),
                      zogsooliinKhungulukhMinut: target.value,
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
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6"></div>
    </>
  );
}

export default Zogsool;
