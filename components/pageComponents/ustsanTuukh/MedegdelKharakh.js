import React, { useEffect, useImperativeHandle } from "react";
import { Form, Modal } from "antd";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useTranslation } from "react-i18next";
function MedegdelKharakh({ data, destroy }, ref) {
  const { t } = useTranslation()
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
      <div className="dark:text-gray-400">
        <div>
          {!!data.object.ner ? (
            <div className="flex w-full justify-between ">
              <div> {t("Нэр")}:</div>
              <div> {data.object.ner} </div>
            </div>
          ) : (
            <div className="flex justify-between">
              <div> {t("Тайлбар")}:</div>
              <div> {data.object.tailbar}</div>{" "}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <div>{t("Хийсэн ажилтан")}: </div>
          <div>{data.object.guilgeeKhiisenAjiltniiNer || data.ajiltniiNer}</div>
        </div>

        <div className="flex justify-between">
          <div>{t("Хийсэн огноо")}:</div>
          <div>
            {moment(
              data.object.guilgeeKhiisenOgnoo || data.object.createdAt
            ).format("YYYY-MM-DD")}
          </div>
        </div>
        {data.object.tulsunAldangi ? (
          <div className="flex justify-between">
            <div>{t("Төлсөн алдаги")} :</div>
            <div
              className={`${
                data.object.tulsunAldangi > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {formatNumber(data.object.tulsunAldangi)}
            </div>
          </div>
        ) : (
          ""
        )}
        {data.object.tulsunDun ? (
          <div className="flex justify-between">
            <div>{t("Төлсөн дүн")} :</div>
            <div
              className={`${
                data.object.tulsunDun > 0
                  ? "font-bold text-green-600"
                  : "text-red-500"
              }`}
            >
              {formatNumber(data.object.tulsunDun, 0)}
            </div>
          </div>
        ) : (
          ""
        )}
        {data.object.tulukhAldangi ? (
          <div className="flex justify-between">
            <div>{t("Төлөх алдаги")} :</div>
            <div
              className={`${
                data.object.tulukhAldangi > 0
                  ? "font-bold text-green-600"
                  : "text-red-500"
              }`}
            >
              {formatNumber(data.object.tulukhAldangi)}
            </div>
          </div>
        ) : (
          ""
        )}
        {data.object.tulukhDun ? (
          <div className="flex justify-between">
            <div> {t("Төлөх дүн")}: </div>
            <div
              className={`${
                data.object.tulukhDun > 0
                  ? "font-bold text-green-600"
                  : "text-red-500"
              }`}
            >
              {formatNumber(data.object.tulukhDun, 0)}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default React.forwardRef(MedegdelKharakh);
