import React, { useMemo } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

function ZassanTuukhTile(props) {
  const { t } = useTranslation();

  return (
    <div className="mb-3 rounded-xl border border-solid border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
            {t(props.className)}
          </span>
          <span className="mt-1 text-base font-bold dark:text-gray-100">
            {props.classDugaar}
          </span>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {moment(props.createdAt).format("YYYY-MM-DD")}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {moment(props.createdAt).format("HH:mm")}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-gray-800">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {t("Зассан ажилтан")}:
          </span>
          <span className="font-medium dark:text-gray-200">
            {props.ajiltniiNer}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {t("Зассан огноо")}:
          </span>
          <span className="dark:text-gray-200">
            {moment(props.createdAt).format("YYYY-MM-DD HH:mm")}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {t("Огноо")}:
          </span>
          <span className="dark:text-gray-200">
            {moment(props.classOgnoo).format("YYYY-MM-DD")}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => props.onView(props)}
          className="w-full rounded-lg bg-gray-50 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
        >
          {t("Өөрчлөлт харах")}
        </button>
      </div>
    </div>
  );
}

export default ZassanTuukhTile;
