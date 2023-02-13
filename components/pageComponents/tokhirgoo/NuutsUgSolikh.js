import React, { useState } from "react";
import { Input, message } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import { useTranslation } from "react-i18next";

function NuutsUgSolikh({ ajiltan, token, ajiltanMutate, khadgalsniiDaraa }) {
  const [state, setstate] = useState(ajiltan);
  const { t } = useTranslation()

  function onChange({ target }) {
    setstate((s) => ({ ...s, [target.name]: target.value }));
  }

  function khadgalakh() {
    const {
      odoogiinNuutsUg,
      shineNuutsUg,
      shineNuutsUgDavtan,
      ...ajiltanObject
    } = state;
    if (
      odoogiinNuutsUg === ajiltanObject.nuutsUg &&
      !!shineNuutsUg &&
      shineNuutsUg === shineNuutsUgDavtan
    ) {
      ajiltanObject.nuutsUg = shineNuutsUg;
      updateMethod("ajiltan", token, ajiltanObject).then(({ data, status }) => {
        if (status === 200 && "Amjilttai" === data) {
          message.success("Амжилттай заслаа");
          ajiltanMutate({ ...ajiltanObject });
        }
      });
    } else message.warning("Мэдээлэл буруу оруулсан байна");
  }

  return (
    <div className="col-span-12 lg:col-span-8 xxl:col-span-6">
      <div className="box lg:mt-5">
        <div className="flex items-center p-5 border-b border-gray-200 dark:border-dark-5">
          <h2 className="font-medium text-base mr-auto dark:text-gray-200">
            {t("Нууц үг солих")}
          </h2>
        </div>
        <div className="p-5">
          <div>
            <label className="form-label">{t("Одоо ашиглаж буй нууц үг")}</label>
            <Input.Password
              className="form-control"
              placeholder={t("Одоо ашиглаж буй нууц үг")}
              name="odoogiinNuutsUg"
              onChange={onChange}
            />
          </div>
          <div className="mt-3">
            <label className="form-label">{t("Шинэ нууц үг")}</label>
            <Input.Password
              className="form-control"
              placeholder={t("Шинэ нууц үг")}
              name="shineNuutsUg"
              onChange={onChange}
            />
          </div>
          <div className="mt-3">
            <label className="form-label">{t("Шинэ нууц үг давтан")}</label>
            <Input.Password
              className="form-control"
              placeholder={t("Шинэ нууц үг давтан")}
              name="shineNuutsUgDavtan"
              onChange={onChange}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={khadgalakh}
          >
            {t("Нууц үг солих")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NuutsUgSolikh;
