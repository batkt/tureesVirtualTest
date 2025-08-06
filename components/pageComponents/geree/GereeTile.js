import {
  EditOutlined,
  EyeOutlined,
  FieldTimeOutlined,
  MinusCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { Popover, Modal } from "antd";
import moment from "moment";
import React, { useState } from "react";
import formatNumber from "tools/function/formatNumber";
import router from "next/router";
import { t } from "i18next";

function GereeTile({
  ovog,
  ner,
  utas,
  gereeniiDugaar,
  talbainDugaar,
  talbainKhemjee,
  sariinTurees,
  gereeniiOgnoo,
  duusakhOgnoo,
  burtgesenAjiltaniiNer,
  turGereeEsekh,
  tileProps,
  ...ugugdul
}) {
  const [popoverKharakh, setPopoverKharakh] = useState(false);
  return (
    <Popover
      onVisibleChange={(visible) =>
        setPopoverKharakh(visible === true ? ugugdul?._id : null)
      }
      visible={ugugdul?._id === popoverKharakh}
      content={() => (
        <div className="flex w-24 flex-col">
          <a
            className="ant-dropdown-link flex h-full w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              tileProps.gereeKharya(ugugdul);
              setPopoverKharakh(false);
            }}
          >
            <EyeOutlined style={{ fontSize: "18px" }} />{" "}
            <label> {t("Харах")}</label>
          </a>
          {tileProps.shuult?.utga !== "Цуцласан" && (
            <a
              className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPopoverKharakh(false);
                if (
                  tileProps.ajiltan?.erkh === "Admin" ||
                  !!_.get(tileProps.ajiltan, `tokhirgoo.gereeZasakhErkh`)?.find(
                    (a) => a === ugugdul.barilgiinId
                  )
                )
                  router.push(`/khyanalt/geree/gereeBaiguulakh/${ugugdul._id}`);
                else
                  notification.warning({
                    message: t("Таньд гэрээ засах эрх байхгүй байна."),
                  });
              }}
            >
              <EditOutlined style={{ fontSize: "18px" }} />
              <label> {t("Засах")}</label>
            </a>
          )}
          {tileProps.shuult?.utga !== "Цуцласан" && (
            <a
              className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                tileProps.gereeSungaya(ugugdul);
                setPopoverKharakh(false);
              }}
            >
              <FieldTimeOutlined style={{ fontSize: "18px" }} />
              <label> {t("Сунгах")}</label>
            </a>
          )}
          {tileProps.shuult?.utga !== "Цуцласан" && (
            <a
              className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                Modal.confirm({
                  content: `Цуцлахдаа итгэлтэй байна уу?`,
                  okText: t("Тийм"),
                  cancelText: t("Үгүй"),
                  onOk: () => tileProps.gereeTsutsalya(ugugdul),
                });
                setPopoverKharakh(false);
              }}
            >
              <MinusCircleOutlined style={{ fontSize: "18px" }} />
              <label> {t("Цуцлах")}</label>
            </a>
          )}
          {tileProps.shuult?.utga === "Цуцласан" && (
            <a
              className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                Modal.confirm({
                  content: `Сэргээх үйлдэл хийхдээ итгэлтэй байна уу?`,
                  okText: t("Тийм"),
                  cancelText: t("Үгүй"),
                  onOk: () => tileProps.gereeSergeeye(ugugdul),
                });
                setPopoverKharakh(false);
              }}
            >
              <RedoOutlined style={{ fontSize: "18px" }} />
              <label> {t("Сэргээх")}</label>
            </a>
          )}
        </div>
      )}
      placement="bottom"
      trigger="click"
    >
      <div
        className={`mb-3 rounded-md border border-solid border-gray-400 bg-white bg-opacity-30 p-2 shadow-2xl dark:bg-gray-900 dark:bg-opacity-30 ${
          turGereeEsekh === true
            ? "bg-purple-600 dark:bg-purple-400"
            : "bg-blue-500 dark:bg-blue-400"
        }`}
      >
        <div className="flex w-full flex-row">
          <div className="font-bold dark:text-gray-100">{ner}</div>
          <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
            {gereeniiDugaar}
          </div>
        </div>
        <div className="flex w-full flex-row dark:text-gray-100">
          <div>{utas}</div>
          <div className="ml-auto font-medium">{talbainDugaar}</div>
        </div>

        <div className="flex w-full flex-row dark:text-gray-100">
          <div>{moment(gereeniiOgnoo).format("YYYY-MM-DD")}</div>
          <div className="ml-auto font-medium">
            {moment(duusakhOgnoo).format("YYYY-MM-DD")}
          </div>
        </div>
        <div className="flex w-full flex-row dark:text-gray-100">
          <div>{talbainKhemjee + "м2"}</div>
          <div className="ml-auto font-medium">
            {formatNumber(sariinTurees)}₮
          </div>
        </div>
      </div>
    </Popover>
  );
}

export default GereeTile;
