import React from "react";
import moment from "moment";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import useAjiltan from "hooks/useAjiltan";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function hrefAvya(turul, _id, daalgavriinId, ajiltan, object) {
  var href = "";
  if (ajiltan.erkh === "Admin") {
    if (!!object.daalgavriinId) {
      href = `/khyanalt/daalgavar/admin?id=${daalgavriinId}`;
    } else
      href = `/khyanalt/medegdel/sanalKhuselt?id=${object.khariltsagchiinId}`;
  } else if (!!object.daalgavriinId) {
    href = `/khyanalt/daalgavar?id=${daalgavriinId}`;
  } else
    href = `/khyanalt/medegdel/sanalKhuselt?id=${object.khariltsagchiinId}`;
  return href;
}

function Zakhialga({ onClose, token, ...object }) {
  const { turul, message, khariltsagchiinNer, createdAt, _id, daalgavriinId } =
    object || {};
  const { ajiltan } = useAjiltan(token);
  const { t } = useTranslation();

  function sonorduulgaKharlaa() {
    const href = hrefAvya(turul, _id, daalgavriinId, ajiltan, object);
    window.location.href = href;
    uilchilgee(token).post("/sanalKharlaa", { id: _id }).catch(aldaaBarigch);
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="notification-with-split-buttons-content"
      className="max-w-md"
      onClick={onClose}
    >
      <div className="md:mr-40">
        <div className="font-medium">
          {turul}
          {khariltsagchiinNer}
        </div>
        <div className="mt-1 text-gray-600">
          {moment(createdAt).format("YYYY-MM-DD")}
        </div>
        <div className="mt-1 max-h-24 max-w-xs truncate text-gray-600">
          {message}
        </div>
      </div>
      <div className="dark:border-dark-5 absolute bottom-0 right-0 top-0 hidden flex-col border-l border-gray-200 md:flex">
        <a
          className="text-theme-1 dark:border-dark-5 flex flex-1 items-center justify-center border-b border-gray-200 px-6 font-medium dark:text-gray-500"
          onClick={sonorduulgaKharlaa}
        >
          {t("Дэлгэрэнгүй")}
        </a>
        <a
          data-dismiss="notification"
          className="flex flex-1 items-center justify-center px-6 font-medium text-gray-600"
          onClick={onClose}
        >
          {t("Хаах")}
        </a>
      </div>
    </div>
  );
}

export default Zakhialga;
