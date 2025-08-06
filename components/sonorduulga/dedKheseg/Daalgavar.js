import React, { useEffect } from "react";
import moment from "moment";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useTranslation } from "react-i18next";

function hrefAvya(turul, _id, ajiltan, object) {
  var href = "";
  if (ajiltan?.erkh === "Admin") {
    if (!!object.daalgavriinId) {
      href = `/khyanalt/daalgavar/admin?id=${object.daalgavriinId}`;
    } else
      href = `/khyanalt/medegdel/sanalKhuselt?id=${object.khariltsagchiinId}`;
  } else if (!!object._id) {
    href = `/khyanalt/daalgavar?id=${object._id}`;
  } else
    href = `/khyanalt/medegdel/sanalKhuselt?id=${object.khariltsagchiinId}`;
  return href;
}

function Daalgavar({ onClose, token, ajiltan, ...object }) {
  const { turul, tailbar, duusakhOgnoo, _id } = object || {};
  const { t } = useTranslation();
  function sonorduulgaKharlaa() {
    const href = hrefAvya(turul, _id, ajiltan, object);
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
      className="flex flex-row items-center "
      onClick={onClose}
    >
      <div className="mr-2 flex"></div>
      <div className="md:mr-40">
        <div className="font-medium">
          <div className="w-36 rounded-md bg-red-400 px-2 text-center text-white">
            {t("Даалгавар")}
          </div>
        </div>
        <div className="mt-1 text-gray-600">
          {moment(duusakhOgnoo).format("YYYY-MM-DD")}
        </div>
        <div className="mt-1 max-h-24 max-w-xs space-x-10 truncate text-gray-600">
          {tailbar}
        </div>
      </div>
      <div className="dark:border-dark-5 absolute bottom-0 right-0 top-0 hidden flex-col border-l border-gray-200 md:flex">
        <a
          className="text-theme-1 dark:border-dark-5 flex flex-1 items-center justify-center border-b border-gray-200 px-6 font-medium dark:text-gray-500"
          onClick={(event) => {
            event.stopPropagation();
            sonorduulgaKharlaa();
          }}
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

export default Daalgavar;
