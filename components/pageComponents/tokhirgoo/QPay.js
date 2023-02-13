import React, { useEffect, useState } from "react";
import { Button, Input, notification } from "antd";
import useDans from "hooks/useDans";
import updateMethod from "tools/function/crud/updateMethod";
import Password from "antd/lib/input/Password";
import { useTranslation } from "react-i18next";

function QPay({ token, baiguullaga, baiguullagaMutate, setSongogdsonTsonkhniiIndex }) {
  const { t } = useTranslation()
  const [qpayTokhirgoo, setQpayTokhirgoo] = useState(null);
  const [dansTokhirgoo, setDansTokhirgoo] = useState(null);
  const { dansGaralt } = useDans(token, baiguullaga?._id);

  useEffect(() => {
    const qpay = dansGaralt?.jagsaalt?.find((a) => !!a.qpayUsername);
    if (!!qpay) {
      const { qpayUsername, qpayPassword } = qpay;
      setQpayTokhirgoo({ qpayUsername, qpayPassword });
    }
  }, [dansGaralt]);

  const dansKhadgalya = () => {
    dansTokhirgoo?.map((mur, index, array) =>
      updateMethod("dans", token, { ...mur, ...qpayTokhirgoo }).then(
        ({ data }) => {
          if (data === "Amjilttai" && array.length - 1 === index) {
            notification.success({ message: "Амжилттай хадгаллаа" });
            setSongogdsonTsonkhniiIndex(8)
          }
        }
      )
    );
  };

  const undseneerKhadgalya = () => {
    dansGaralt?.jagsaalt?.map((mur, index, array) =>
      updateMethod("dans", token, { ...mur, ...qpayTokhirgoo }).then(
        ({ data }) => {
          if (data === "Amjilttai" && array.length - 1 === index) {
            notification.success({ message: "Амжилттай хадгаллаа" });
            setSongogdsonTsonkhniiIndex(8)
          }
        }
      )
    );
  };

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("QPay тохиргоо")}
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Qpay Нэвтрэх нэр")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto w-1/3">
                <Input
                  value={qpayTokhirgoo?.qpayUsername}
                  onChange={({ target }) =>
                    setQpayTokhirgoo((a) => ({
                      ...(a || {}),
                      qpayUsername: target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Qpay Нэвтрэх нууц үг")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto w-1/3">
                <Input.Password
                  value={qpayTokhirgoo?.qpayPassword}
                  onChange={({ target }) =>
                    setQpayTokhirgoo((a) => ({
                      ...(a || {}),
                      qpayPassword: target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2 ${!!qpayTokhirgoo ? "flex" : "hidden"
              }`}
          >
            <Button type="primary" onClick={undseneerKhadgalya}>
              {t("Хадгалах")}
            </Button>
          </div>
        </div>
      </div>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Данс тохиргоо")}
            </h2>
          </div>
          {dansGaralt?.jagsaalt?.map((dans) => (
            <div className="box">
              <div className="grid grid-cols-5 gap-2 p-5">
                <div className="">
                  <div className="font-medium">{t("Данс")}</div>
                  <div>{dans.dugaar}</div>
                </div>
                <div className="">
                  <div className="font-medium">{t("Дансны нэр")}</div>
                  <div>{dans.dansniiNer}</div>
                </div>
                <div className="">
                  <div className="font-medium">{t("Валют")}</div>
                  <div>{dans.valyut}</div>
                </div>
                <div className="col-span-2">
                  <Input
                    defaultValue={dans?.qpayInvoiceCode}
                    placeholder={t("Нэхэмжлэхийн дугаар")}
                    onChange={({ target }) =>
                      setDansTokhirgoo((a) => {
                        const index = a?.findIndex((a) => a._id === dans._id);
                        if (!!a && index !== undefined && index !== -1) {
                          (a[index]._id = dans?._id),
                            (a[index].qpayInvoiceCode = target.value);
                          a[index].qpayAshiglakhEsekh = true;
                          return [...a];
                        } else {
                          const jagsaalt = a || [];
                          jagsaalt.push({
                            _id: dans?._id,
                            qpayInvoiceCode: target.value,
                            qpayAshiglakhEsekh: true,
                          });
                          return [...jagsaalt];
                        }
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2 ${!!dansTokhirgoo ? "flex" : "hidden"
              }`}
          >
            <Button type="primary" onClick={dansKhadgalya}>
              Хадгалах
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default QPay;
