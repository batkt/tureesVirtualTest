import React, { useMemo } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import formatNumber from "tools/function/formatNumber";

function UstsanTuukhTile(props) {
  const { t } = useTranslation();
  const turul = props.class;
  const turulMemo = useMemo(() => {
    var text;
    switch (turul) {
      case "gereeniiZagvar":
        text = "Гэрээний загвар";
        break;
      case "talbai":
      case "Talbai":
        text = "Талбай";
        break;
      case "ajiltan":
      case "ajiltanBurtgel":
        text = "Ажилтан бүртгэл";
        break;
      case "Khariltsagch":
      case "khariltsagch":
        text = "Харилцагч";
        break;
      case "asuult":
        text = "Асуулт";
        break;
      case "nekhemjlekhiinZagvar":
        text = "Нэхэмжлэл загвар";
        break;
      case "zardal":
        text = "Зардлын жагсаалт";
        break;
      case "eBarimt":
        text = "И-баримтын бүртгэл";
        break;
      case "mashin":
      case "zogsool":
        text = "Зогсоол";
        break;
      case "anket":
        text = "Анкетын асуулга бэлдэх";
        break;
      case "gereeniiGuilgee":
        text = "Гэрээний гүйлгээ";
        break;
      case "mailiinZagvar":
        text = "И-мэйл загвар";
        break;
      case "baritsaa":
        text = "Барьцаа";
        break;
      case "blockMashin":
        text = "Блок машин";
        break;
      case "khungulult":
        text = "Хөнгөлөлт";
        break;
      default:
        text = turul || "Тодорхойгүй";
        break;
    }
    return text;
  }, [turul]);

  const objectDetail = useMemo(() => {
    if (!props.object) return null;
    const { object } = props;
    if (object.gereeniiDugaar) return object.gereeniiDugaar;
    if (object.kod) return object.kod;
    if (object.ner) return object.ner;
    if (object.dugaar) return object.dugaar;
    if (object.register) return object.register;
    return null;
  }, [props.object]);

  const dun = useMemo(() => {
    if (!props.object) return null;
    const { object } = props;
    return (
      object.tulsunDun ||
      object.tulukhDun ||
      object.orlogo ||
      object.zarlaga ||
      object.khuuchinAldangiDun
    );
  }, [props.object]);

  return (
    <div className="mb-3 rounded-xl border border-solid border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t(turulMemo)}
          </span>
          {objectDetail && (
            <span className="mt-1 text-base font-bold dark:text-gray-100">
              {objectDetail}
            </span>
          )}
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
            {t("Устгасан")}:
          </span>
          <span className="font-medium dark:text-gray-200">
            {props.ajiltniiNer}
          </span>
        </div>

        {props.tailbar && (
          <div className="flex flex-col text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {t("Шалтгаан")}:
            </span>
            <span className="italic dark:text-gray-300">{props.tailbar}</span>
          </div>
        )}

        {dun !== undefined && dun !== null && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">{t("Дүн")}:</span>
            <span
              className={`font-bold ${
                dun > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {formatNumber(dun, 0)}₮
            </span>
          </div>
        )}
      </div>

      {props.object && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 p-2 text-xs dark:bg-gray-800/50">
          <div className="flex flex-col">
            <span className="text-gray-400">{t("Хийсэн огноо")}</span>
            <span className="dark:text-gray-300">
              {moment(
                props.object.createdAt || props.object.guilgeeKhiisenOgnoo
              ).format("YYYY-MM-DD")}
            </span>
          </div>
          {props.object.guilgeeKhiisenAjiltniiNer && (
            <div className="flex flex-col items-end">
              <span className="text-gray-400">{t("Хийсэн ажилтан")}</span>
              <span className="dark:text-gray-300">
                {props.object.guilgeeKhiisenAjiltniiNer}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => props.onView(props)}
          className="w-full rounded-lg bg-blue-50 py-2.5 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-100 active:scale-[0.98] dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
        >
          {t("Дэлгэрэнгүй харах")}
        </button>
      </div>
    </div>
  );
}

export default UstsanTuukhTile;

