import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { modal } from "components/ant/Modal";
import React from "react";
import moment from "moment";
import { t } from "i18next";

const Delegrengui = React.forwardRef(
  (
    { destroy, ovog, ner, utas, register, turul, mail, tileProps, ugugdul },
    ref
  ) => {
    React.useImperativeHandle(
      ref,
      () => ({
        khaaya() {
          destroy();
        },
      }),
      []
    );
    return (
      <div className="space-y-5 dark:text-gray-200">
        <div>
          <h1 className="border-b text-base font-medium dark:text-gray-300">
            {t("Харилцагчийн мэдээлэл")}
          </h1>
          <div>
            <div className="flex justify-between border-b bg-green-500 bg-opacity-10 p-1">
              <p className="font-medium ">{t("Бүртгэгдсэн Огноо")}:</p>{" "}
              <p>{moment(ugugdul.createdAt).format("YYYY-MM-DD hh:mm")}</p>
            </div>
            <div className="flex justify-between border-b p-1">
              <p className="font-medium ">{t("Овог")}:</p> <p>{ovog}</p>
            </div>
            <div className="flex justify-between border-b bg-green-500 bg-opacity-10 p-1">
              <p className="font-medium ">{t("Төрөл")}:</p> <p>{turul}</p>
            </div>
            <div className="flex justify-between border-b p-1">
              <p className="font-medium ">{t("Регистр")}:</p> <p>{register}</p>
            </div>
            <div className="flex justify-between border-b bg-green-500 bg-opacity-10 p-1">
              <p className="font-medium ">{t("Нэр")}:</p> <p>{ner}</p>
            </div>
            <div className="flex justify-between border-b p-1">
              <p className="font-medium ">{t("Утас")}:</p> <p>{utas}</p>
            </div>
            <div className="flex justify-between border-b bg-green-500 bg-opacity-10 p-1">
              <p className="font-medium ">{t("И-мэйл")}:</p> <p>{mail}</p>
            </div>
            <div className="flex justify-between border-b p-1">
              <p className="font-medium ">{t("Төлөв")}:</p>{" "}
              <p>{ugugdul.idevkhiteiEsekh ? "Идэвхтэй" : "Идэвхгүй"}</p>
            </div>
            <div className="flex justify-between border-b bg-green-500 bg-opacity-10 p-1">
              <p className="font-medium ">{t("Хаяг")}:</p>{" "}
              <p>{ugugdul.khayg}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between gap-2">
          <Popconfirm
            title="Харилцагч устгах уу?"
            okText={t("Тийм")}
            cancelText={t("Үгүй")}
            onConfirm={() => {
              tileProps?.khariltsagchUstgay(ugugdul), destroy();
            }}
          >
            <Button
              className="w-full"
              icon={
                <DeleteOutlined style={{ fontSize: "18px", color: "red" }} />
              }
            >
              {t("Устгах")}
            </Button>
          </Popconfirm>
          <Button
            onClick={() => {
              tileProps?.zasya({
                ovog,
                ner,
                utas,
                register,
                turul,
                mail,
                ...ugugdul,
              }),
                destroy(),
                tileProps.setUtasKhariltsagchNmekh(true);
            }}
            className="w-full"
            icon={<EditOutlined style={{ fontSize: "18px" }} />}
          >
            {t("Засах")}
          </Button>
        </div>
        <Popconfirm
          title="Нууц үг сэргээх үү?"
          okText={t("Тийм")}
          cancelText={t("Үгүй")}
          onConfirm={() =>
            tileProps?.setNuutsUgKhariltsagch({
              ovog,
              ner,
              utas,
              register,
              turul,
              mail,
              ...ugugdul,
            })
          }
        >
          <Button
            className="w-full"
            icon={
              <RedoOutlined
                className="mr-1 text-green-600"
                style={{ fontSize: "18px" }}
              />
            }
          >
            <label className="text-green-600">{t("Нууц үг")}</label>
          </Button>
        </Popconfirm>
      </div>
    );
  }
);

function KhariltsagchTile({
  ovog,
  ner,
  utas,
  register,
  turul,
  mail,
  tileProps,
  ...ugugdul
}) {
  const delgerenguiRef = React.useRef(null);

  function delgerenguiKharakh() {
    const footer = [
      <Button onClick={() => delgerenguiRef.current.khaaya()}>
        {t("Хаах")}
      </Button>,
    ];
    modal({
      title: `${ovog} ${ner}`,
      icon: <FileExcelOutlined />,
      content: (
        <Delegrengui
          ref={delgerenguiRef}
          ovog={ovog}
          ner={ner}
          utas={utas}
          register={register}
          turul={turul}
          mail={mail}
          tileProps={tileProps}
          ugugdul={ugugdul}
        />
      ),
      footer,
    });
  }

  return (
    <div
      onClick={() => delgerenguiKharakh()}
      className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900"
    >
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
            {turul}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KhariltsagchTile;
