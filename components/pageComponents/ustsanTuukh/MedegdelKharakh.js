import React, { useEffect, useImperativeHandle } from "react";
import { Form, Modal } from "antd";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useTranslation } from "react-i18next";

function MedegdelKharakh({ data, destroy }, ref) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  function garya() {
    Modal.confirm({
      content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
      okText: t("Тийм"),
      cancelText: t("Үгүй"),
      onOk: destroy,
    });
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <>
    <div className="flex flex-col gap-4 p-2 text-sm text-gray-800 dark:text-gray-100">
      <div className="space-y-3 rounded-xl bg-gray-50/50 p-4 dark:bg-gray-800/30">
        {data.class === "mailiinZagvar" && (
          <div className="flex justify-between border-b border-gray-100 pb-2 last:border-0 dark:border-gray-700">
            <span className="text-gray-500">{t("Загварын нэр")}: </span>
            <span className="font-semibold">{data.object.ner}</span>
          </div>
        )}

        {data.class === "gereeniiGuilgee" && (
          <>
            <div className="flex justify-between border-b border-gray-100 pb-2 last:border-0 dark:border-gray-700">
              <span className="text-gray-500">{t("Хийсэн ажилтан")}: </span>
              <span className="font-semibold">{data.object.guilgeeKhiisenAjiltniiNer}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2 last:border-0 dark:border-gray-700">
              <span className="text-gray-500">{t("Гэрээний дугаар")}: </span>
              <span className="font-semibold text-blue-600">{data.object.gereeniiDugaar}</span>
            </div>
          </>
        )}

        {(data.object?.turul === "baritsaa" || data.class === "Khariltsagch") && (
          <div className="flex justify-between border-b border-gray-100 pb-2 last:border-0 dark:border-gray-700">
            <span className="text-gray-500">{t(data.class === "Khariltsagch" ? "Нэр" : "Гэрээний дугаар")}: </span>
            <span className="font-semibold">{data.object.ner || data.object.gereeniiDugaar}</span>
          </div>
        )}

        {data.class === "Talbai" && (
          <div className="flex justify-between border-b border-gray-100 pb-2 last:border-0 dark:border-gray-700">
            <span className="text-gray-500">{t("Талбай")}: </span>
            <span className="font-semibold">{data.object.kod}</span>
          </div>
        )}

        {data.class === "blockMashin" && (
          <>
            <div className="flex justify-between border-b border-gray-100 pb-2 last:border-0 dark:border-gray-700">
              <span className="text-gray-500">{t("Машины дугаар")}: </span>
              <span className="font-semibold">{data.object.dugaar}</span>
            </div>
            <div className="flex flex-col gap-1 border-b border-gray-100 pb-2 last:border-0 dark:border-gray-700">
              <span className="text-gray-500">{t("Тайлбар")}: </span>
              <span className="italic">{data.object.tailbar}</span>
            </div>
          </>
        )}

        {data.class === "gereeniiGuilgee" && (
          <div className="flex justify-between border-b border-gray-100 pb-2 last:border-0 dark:border-gray-700">
            <span className="text-gray-500">{t("Гүйлгээний огноо")}: </span>
            <span className="font-semibold">{moment(data.object.guilgeeKhiisenOgnoo).format("YYYY-MM-DD")}</span>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-xl bg-blue-50/30 p-4 dark:bg-blue-900/10">
        <div className="flex justify-between border-b border-blue-100/50 pb-2 last:border-0 dark:border-blue-800/20">
          <span className="text-blue-600/70 dark:text-blue-400/70">{t("Устгасан ажилтан")}: </span>
          <span className="font-bold text-blue-700 dark:text-blue-300">{data.ajiltniiNer}</span>
        </div>

        <div className="flex justify-between border-b border-blue-100/50 pb-2 last:border-0 dark:border-blue-800/20">
          <span className="text-blue-600/70 dark:text-blue-400/70">{t("Устгасан огноо")}: </span>
          <span className="font-semibold dark:text-blue-300">
            {moment(data?.createdAt || data?.object?.updatedAt).format("YYYY-MM-DD HH:mm")}
          </span>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
        {data.object.turul === "baritsaa" && (
          <>
            {data.object.orlogo !== undefined && data.object.orlogo !== 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t("Орлого")}: </span>
                <span className="font-bold text-green-600">{formatNumber(data.object.orlogo, 0)}₮</span>
              </div>
            )}
            {data.object.zarlaga !== undefined && data.object.zarlaga !== 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t("Зарлага")}: </span>
                <span className="font-bold text-red-500">{formatNumber(data.object.zarlaga, 0)}₮</span>
              </div>
            )}
          </>
        )}

        {(data.object.khuuchinAldangiDun || data.object.tulukhDun || data.object.tulsunDun) && (
          <div className="flex justify-between">
            <span className="text-gray-500">{t("Устгасан дүн")}: </span>
            <span className="font-bold text-red-500">
              {formatNumber(data.object.khuuchinAldangiDun || data.object.tulukhDun || data.object.tulsunDun || 0)}₮
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-500">{t("Хийсэн огноо")}: </span>
          <span className="font-medium">{moment(data?.object?.createdAt).format("YYYY-MM-DD")}</span>
        </div>

        {data.object.tulsunAldangi && (
          <div className="flex justify-between border-t pt-2 dark:border-gray-800">
            <span className="text-gray-500">{t("Төлсөн алдангүй")}: </span>
            <span className={data.object.tulsunAldangi > 0 ? "text-green-500" : "text-red-500"}>
              {formatNumber(data.object.tulsunAldangi)}₮
            </span>
          </div>
        )}

        {data.object.tulsunDun && (
          <div className="flex justify-between">
            <span className="text-gray-500">{t("Төлсөн дүн")}: </span>
            <span className="font-bold text-green-600">{formatNumber(data.object.tulsunDun, 0)}₮</span>
          </div>
        )}

        {data.object.tulukhAldangi && (
          <div className="flex justify-between">
            <span className="text-gray-500">{t("Төлөх алдангүй")}: </span>
            <span className="font-bold text-red-500">{formatNumber(data.object.tulukhAldangi)}₮</span>
          </div>
        )}

        {data.object.tulukhDun && (
          <div className="flex justify-between">
            <span className="text-gray-500">{t("Төлөх дүн")}: </span>
            <span className="font-bold text-green-600">{formatNumber(data.object.tulukhDun, 0)}₮</span>
          </div>
        )}
      </div>
    </div>

    </>
  );
}

export default React.forwardRef(MedegdelKharakh);
