import React, { useState } from "react";
import { Button, Input, message } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import { useTranslation } from "react-i18next";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

function NuutsUgSolikh({ ajiltan, token, ajiltanMutate, khadgalsniiDaraa }) {
  const [state, setstate] = useState(ajiltan);
  const { t } = useTranslation();

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

    if (!shineNuutsUg || shineNuutsUg !== shineNuutsUgDavtan) {
      toast.warning(t("Шинэ нууц үгүүд таарахгүй байна"));
      return;
    }

    uilchilgee(token)
      .post("/nuutsUgShalgakhAjiltan", {
        id: ajiltanObject._id,
        nuutsUg: odoogiinNuutsUg,
      })
      .then(({ data }) => {
        if (data.success === true) {
          setstate(odoogiinNuutsUg);
          ajiltanObject.nuutsUg = shineNuutsUg;
          updateMethod("ajiltan", token, ajiltanObject).then(
            ({ data, status }) => {
              if (status === 200 && "Amjilttai" === data) {
                toast.success(t("Амжилттай засагдлаа"));
                ajiltanMutate({ ...ajiltanObject });
              }
            }
          );
        } else {
          toast.warning(t(data.message));
        }
      })
      .catch((e) => aldaaBarigch(e));
  }

  return (
    <div className="xxl:col-span-6 col-span-12 lg:col-span-8">
      <div className="box lg:mt-5">
        <div className="dark:border-dark-5 flex items-center border-b border-gray-200 p-5">
          <h2 className="mr-auto text-base font-medium dark:text-gray-200">
            {t("Нууц үг солих")}
          </h2>
        </div>
        <div className="p-5">
          <div>
            <label className="form-label">
              {t("Одоо ашиглаж буй нууц үг")}
            </label>
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
          <div className="flex w-full justify-end">
            <Button
              type="primary"
              className="btn btn-primary mt-4"
              onClick={khadgalakh}
            >
              {t("Нууц үг солих")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NuutsUgSolikh;
