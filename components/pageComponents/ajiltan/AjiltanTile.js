import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Popconfirm, Popover, Tag } from "antd";
import { t } from "i18next";
import React from "react";

function AjiltanTile({
  ovog,
  ner,
  utas,
  register,
  albanTushaal,
  mail,
  tileProps,
  ...ugugdul
}) {
  return (
    <Popover
      placement="bottom"
      trigger="click"
      content={() => (
        <div className="flex w-24 flex-col space-y-2">
          <a
            className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
            onClick={() =>
              tileProps.zasya({
                ...ugugdul,
                ovog,
                ner,
                utas,
                register,
                albanTushaal,
                mail,
              })
            }
          >
            <EditOutlined style={{ fontSize: "18px" }} />
            <label>{t("Засах")}</label>
          </a>
          <a
            className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
            onClick={() =>
              tileProps.tokhiruulya({
                ...ugugdul,
                ovog,
                ner,
                utas,
                register,
                albanTushaal,
                mail,
              })
            }
          >
            <SettingOutlined style={{ fontSize: "18px" }} />
            <label>{t("Эрх")}</label>
          </a>
          <Popconfirm
            title="Ажилтан устгах уу?"
            okText={t("Тийм")}
            cancelText={t("Үгүй")}
            onConfirm={() =>
              tileProps.ajiltanUstgay({
                ...ugugdul,
                ovog,
                ner,
                utas,
                register,
                albanTushaal,
                mail,
              })
            }
          >
            <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700">
              <DeleteOutlined style={{ fontSize: "18px", color: "red" }} />
              <label>{t("Устгах")}</label>
            </a>
          </Popconfirm>
        </div>
      )}
    >
      <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
        <div className="flex w-full flex-row">
          <div className="font-bold dark:text-gray-100">{register}</div>

          <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
            {mail}
          </div>
        </div>
        <div className="flex w-full flex-row dark:text-gray-100">
          <div>{ovog + " " + ner}</div>
          <div className="ml-auto font-medium">{utas}</div>
        </div>
        <div className="mt-1 flex flex-row justify-between border-t-2">
          <div className="flex flex-col">
            <div className="font-medium text-green-500 dark:text-green-400">
              <Tag color={"blue"}>
                <span>{albanTushaal}</span>
              </Tag>
            </div>
          </div>
        </div>
      </div>
    </Popover>
  );
}

export default AjiltanTile;
