import { DeleteOutlined, EditOutlined, FileExcelOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { modal } from "components/ant/Modal";
import React from "react"
import formatNumber from "tools/function/formatNumber"
import moment from "moment";
import { useRouter } from "next/router";
import { t } from "i18next";

const Delegrengui = React.forwardRef(({ destroy,
  talbainKhemjee,
  talbainNegjUne,
  talbainNiitUne,
  davkhar,
  zasakhLink,
  tileProps,
  ugugdul }, ref) => {
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
    <div className="space-y-5 ">
      <div className="dark:text-gray-200">
        <h1 className="font-medium dark:text-gray-300 text-base border-b">{t("Талбайн мэдээлэл")}</h1>
        <div className="dark:text-gray-200">
          <div className="flex justify-between border-b p-1 bg-green-500 bg-opacity-10"><p className="font-medium ">{t("Бүртгэсэн Огноо")}:</p> <p>{moment(ugugdul.createdAt).format("YYYY-MM-DD hh:mm")}</p></div>
          <div className="flex justify-between border-b p-1"><p className="font-medium ">{t("Давхар")}:</p> <p>{davkhar}</p></div>
          <div className="flex justify-between border-b p-1 bg-green-500 bg-opacity-10"><p className="font-medium ">{t("Талбай/м2/")}:</p> <p>{talbainKhemjee}</p></div>
          <div className="flex justify-between border-b p-1"><p className="font-medium ">{t("Нийт үнэ/₮/")}:</p> <p>{formatNumber(talbainNiitUne)}</p></div>
          <div className="flex justify-between border-b p-1 bg-green-500 bg-opacity-10"><p className="font-medium ">{t("Зардал")}:</p> <p>{ugugdul.niitAshiglaltiinZardal}</p></div>
          <div className="flex justify-between border-b p-1"><p className="font-medium ">{t("Төлбөр")}:</p> <p>{formatNumber(ugugdul.tureesiinTulbur)}₮</p></div>
          <div className="flex justify-between border-b p-1 bg-green-500 bg-opacity-10"><p className="font-medium ">{t("Тайлбар")}:</p> <p>{ugugdul.tailbar || "хоосон"}</p></div>
          <div className="flex justify-between border-b p-1"><p className="font-medium ">{t("Төлөв")}:</p> <p>{ugugdul.idevkhiteiEsekh ? "Идэвхтэй" : "Идэвхгүй"}</p></div>
          <div className="flex justify-between border-b p-1 bg-green-500 bg-opacity-10"><p className="font-medium ">{t("Талбайн төрөл")}:</p> <p>{ugugdul.niitiinTalbaiEsekh ? "Нийтийн талбай" : "Үндсэн"}</p></div>
        </div>
      </div>
      <div className="flex w-full gap-2 justify-between">
        <Button onClick={() => zasakhLink()} className="w-full" icon={<EditOutlined style={{ fontSize: "18px" }} />}>{t("Засах")}</Button>
        <Popconfirm
          title="Харилцагч устгах уу?"
          okText={t("Тийм")}
          cancelText={t("Үгүй")}
          onConfirm={() => { tileProps?.talbaiUstgay(ugugdul), destroy() }}
        >
          <Button className="w-full" icon={<DeleteOutlined
            style={{ fontSize: "18px", color: "red" }}
          />}>{t("Устгах")}</Button>
        </Popconfirm>
      </div>
    </div>
  )
})

function TalbaiTile({
  kod,
  talbainKhemjee,
  talbainNegjUne,
  talbainNiitUne,
  davkhar,
  tileProps,
  ...ugugdul
}) {
  const router = useRouter()
  const delgerenguiRef = React.useRef(null)

  function zasakhLink() {
    delgerenguiRef.current?.khaaya()
    router.push({
      pathname: `/khyanalt/talbaiBurtgel/talbaiBurtgekh/${ugugdul._id}`,
      query: {
        data: JSON.stringify({
          ...ugugdul,
          talbainKhemjee,
          kod,
          talbainNegjUne,
          talbainNiitUne,
          davkhar,
        }),
        barilgiinId: tileProps.barilgiinId,
      },
    })
  }

  function delgerenguiKharakh() {
    const footer = [
      <Button onClick={() => delgerenguiRef.current.khaaya()}>{t("Хаах")}</Button>,
    ];
    modal({
      title: `${t("Талбайн Дугаар")}: ${kod}`,
      icon: <FileExcelOutlined />,
      content: (
        <Delegrengui
          ref={delgerenguiRef}
          talbainKhemjee={talbainKhemjee}
          talbainNegjUne={talbainNegjUne}
          talbainNiitUne={talbainNiitUne}
          davkhar={davkhar}
          tileProps={tileProps}
          ugugdul={ugugdul}
          zasakhLink={zasakhLink}
        />
      ),
      footer,
    });
  }

  return (
    <div onClick={() => delgerenguiKharakh()} className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{kod}</div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {talbainKhemjee + "м2"}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{formatNumber(talbainNegjUne)}₮</div>
        <div className="ml-auto font-medium">{formatNumber(talbainNiitUne)}₮</div>
      </div>

    </div>
  )
}

export default TalbaiTile
