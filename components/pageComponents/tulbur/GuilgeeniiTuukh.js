import { Badge, Button, Input, message, Popconfirm } from "antd";
import React, { useImperativeHandle, useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { DeleteOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import { useReactToPrint } from "react-to-print";
import _ from "lodash";
import { t } from "i18next";
import {useGereeGuilgee} from "hooks/useGereeniiJagsaalt";

const Tailbar = React.forwardRef(({ destroy, confirm }, ref) => {
  const [tailbar, setTailbar] = useState("");
  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(tailbar);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [tailbar]
  );
  return (
    <div>
      <Input.TextArea
        value={tailbar}
        onChange={({ target }) => setTailbar(target?.value)}
      />
    </div>
  );
});

const turulAvya = (turul) => {
  if (turul === "avlaga") return "Авлага";
  else if (turul === "voucher") return "Ваучер";
  else if (turul === "bank") return "Банк";
  else if (turul === "khyamdral") return "Хямдрал";
  else if (turul === "barter") return "Бартер";
  else if (turul === "baritsaa") return "Барьцаа";
  else if (turul === "zalruulga") return "Залруулга";
  else if (turul === "qpay") return "QPay";
};

function GuilgeeniiTuukh({ token, data, refreshData, ognoo, ajiltan, barilgiinId }, ref) {
  const { guilgeeniiTuukh, guilgeeniiTuukhMutate } = useGereeGuilgee(
    token,
    data?._id,
    ognoo
  );
  const [sortOrders, setSortOrders] = useState({
    ognoo: null,
    turees: null,
    tulukhDun: null,
    khyamdral: null,
    tulsunAldangi: null,
    tulsunDun: null,
    uldegdel: null,
    ajiltan: null,
    helber: null,
    tailbar: null,
    burtgesenOgnoo: null
  });
  const [sortColumn, setSortColumn] = useState(null);
  const tailbarRef = React.useRef(null);
  const printRef = React.useRef(null);
  function uldegdelMutate() {
    _.isFunction(data.mutate) && data.mutate();
  }
  function tulultUstgaya({
    guilgeeniiId,
    tulsunDun,
    tulukhDun,
    _id,
    turul,
    khyamdral,
  }) {
    if (turul === "baritsaa")
      axios(token)
        .post("/baritsaaniiGuilgeeUstgaya", {
          gereeniiId: data?._id,
          objectiinId: _id,
          zarlaga: tulsunDun || 0,
          orlogo: tulukhDun || 0,
          barilgiinId: data?.barilgiinId,
        })
        .then(({ data }) => {
          if (data) {
            message.success(t("Төлөлт амжилттай устгагдлаа!"));
            refreshData();
            guilgeeniiTuukhMutate()
          }
        })
        .catch(aldaaBarigch);
    else {
      const footer = [
        <Button onClick={() => tailbarRef.current.khaaya()}>{t("Хаах")}</Button>,
        <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
          Устгах
        </Button>,
      ];
      modal({
        title: "Төлөлт устгах шалтгаан",
        icon: <DeleteOutlined />,
        content: (
          <Tailbar
            ref={tailbarRef}
            confirm={(tailbar) =>
              axios(token)
                .post("/tulultUstgaya", {
                  turul,
                  guilgeeniiId,
                  gereeniiId: data?._id,
                  tulsunDun,
                  tulukhDun,
                  khyamdral,
                  objectiinId: _id,
                  tailbar,
                  talbainDugaar: data?.talbainDugaar,
                  barilgiinId: data?.barilgiinId,
                })
                .then(({ data }) => {
                  if (data) {
                    message.success(t("Төлөлт амжилттай устгагдлаа!"));
                    uldegdelMutate();
                    guilgeeniiTuukhMutate()
                    refreshData();
                  }
                })
                .catch(aldaaBarigch)
            }
          />
        ),
        footer,
      });
    }
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const toggleSortOrder = (column) => {
    const newSortOrders = { ...sortOrders };
    newSortOrders[column] = sortOrders[column] === 'asc' ? 'desc' : 'asc';
    setSortOrders(newSortOrders);
    setSortColumn(column);
  };

  const sortedData = React.useMemo(() => {
    if(!guilgeeniiTuukh){
      return [];
    }
    const khuulsanData = [...guilgeeniiTuukh];
    khuulsanData.sort((a, b) => {
      const sortDaraalal = sortOrders[sortColumn];
      if (sortDaraalal === 'asc') {
        if (sortColumn === 'ognoo') {
          return new Date(a[sortColumn]) - new Date(b[sortColumn]);
        }
        return a[sortColumn] - b[sortColumn];
      } else if (sortDaraalal === 'desc') {
        if (sortColumn === 'ognoo') {
          return new Date(b[sortColumn]) - new Date(a[sortColumn]);
        }
        return b[sortColumn] - a[sortColumn];
      }
      return 0;
    });

    return khuulsanData;
  }, [guilgeeniiTuukh, sortOrders, sortColumn]);

  useImperativeHandle(
    ref,
    () => ({
      khevlekh() {
        handlePrint();
      },
      refreshData() {
        guilgeeniiTuukhMutate();
      },
    }),
    [printRef]
  );

  return (
    <div className="">
      <div ref={printRef} className="flex flex-col">
        <div className="print mb-2 p-2">
          <div>{t("Гүйлгээний түүх")}</div>
          <div className="ml-auto">{t("Талбайн дугаар")}:{data?.talbainDugaar}</div>
        </div>
        <th className="w-full">
          <tr className="flex pr-1 border-b divide-white divide-x min-w-[93rem] border-gray-200 bg-gray-200 text-gray-700  dark:bg-gray-800 dark:text-gray-400">
            <td onClick={()=>toggleSortOrder("ognoo")} className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Огноо")}</td>
            <td onClick={()=>toggleSortOrder("turees")} className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Түрээс")}</td>
            <td onClick={()=>toggleSortOrder("tulukhDun")} className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Төлөх дүн")}</td>
            <td onClick={()=>toggleSortOrder("khyamdral")} className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Хямдрал")}</td>
            <td onClick={()=>toggleSortOrder("tulsunAldangi")} className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Төлсөн алданги")}</td>
            <td onClick={()=>toggleSortOrder("tulsunDun")} className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Төлсөн дүн")}</td>
            <td onClick={()=>toggleSortOrder("uldegdel")} className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Үлдэгдэл")}</td>
            <td onClick={()=>toggleSortOrder("ajiltan")} className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Ажилтан")}</td>
            <td onClick={()=>toggleSortOrder("helber")} className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Хэлбэр")}</td>
            <td onClick={()=>toggleSortOrder("tailbar")} className="min-w-[8rem] overflow-hidden p-1 w-full text-center">{t("Тайлбар")}</td>
            <td onClick={()=>toggleSortOrder("burtgesenOgnoo")} className="min-w-[10rem] text-center p-1">{t("Бүртгсэн огноо")}</td>
            <td className="min-w-[3rem] border-none p-1 text-center"></td>
          </tr>
        </th>
        <tbody className=" overflownone min-w-[93.4rem] overflow-y-scroll" style={{ height: "calc(100vh - 15rem)" }}>
          {sortedData
            ?.map((a, i) => (
              <tr className="flex divide-x min-w-[93rem] border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400">
                <td className="p-1 min-w-[8rem] text-center overflow-hidden">
                  {moment(a.ognoo).format("YYYY-MM-DD")}
                </td>
                <td className="p-1 min-w-[8rem] overflow-hidden text-end">{formatNumber(a.undsenDun, 2)}</td>
                <td className="p-1 min-w-[8rem] overflow-hidden text-end">{formatNumber(a.tulukhDun, 2)}</td>
                <td className="p-1 min-w-[8rem] overflow-hidden text-end">{formatNumber(a.khyamdral, 2)}</td>
                <td className="p-1 min-w-[8rem] overflow-hidden text-end">{formatNumber(a.tulsunAldangi, 2)}</td>
                <td className="p-1 min-w-[8rem] overflow-hidden text-end">{formatNumber(a.tulsunDun, 2)}</td>
                <td
                  className={`p-1 min-w-[8rem] overflow-hidden text-end ${a?.uldegdel > 0 ? "text-red-500" : "text-green-500"
                    }`}
                >
                  {formatNumber(
                    a.turul === "khyamdral" && a.uldegdel < 0 ? 0 : a.uldegdel,
                    2
                  )}
                </td>

                <td className="p-1 min-w-[8rem] overflow-hidden">{a.guilgeeKhiisenAjiltniiNer}</td>
                <td className="p-1 text-center min-w-[8rem] overflow-hidden">
                  {a.turul === "bank"
                    ? a.tulsunDans !== " "
                      ? a.tulsunDans
                      : t("Банк")
                    : turulAvya(a.turul)}
                </td>
                <td className="flex min-w-[8rem] overflow-hidden w-full justify-between p-1">
                  {a.tailbar}
                </td>
                <td className="flex min-w-[10rem] text-center justify-center p-1 ">
                  {a.guilgeeKhiisenOgnoo &&
                    moment(a.guilgeeKhiisenOgnoo).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td className="flex min-w-[3rem] border-none justify-center">
                  {(ajiltan?.erkh === "Admin" || !!_.get(ajiltan, `tokhirgoo.guilgeeUstgakhErkh`)?.find(
                    (a) => a === barilgiinId
                  )) && (a.turul === "avlaga" ||
                    a.turul === "voucher" ||
                    a.turul === "barter" ||
                    a.turul === "bank" ||
                    a.turul === "khyamdral" ||
                    a.turul === "aldangi" ||
                    a.turul === "zalruulga" ||
                    a.turul === "baritsaa" ||
                    a.turul === "qpay") && (
                      <Popconfirm
                        title={t("Төлөлт устгах уу?")}
                        okText={t("Тийм")}
                        cancelText={t("Үгүй")}
                        onConfirm={() => tulultUstgaya(a)}
                      >
                        <div className="hide-on-print flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border p-1 text-red-500">
                          <DeleteOutlined />
                        </div>
                      </Popconfirm>
                    )}
                </td>
              </tr>
            ))
            .reverse()}
        </tbody>
      </div>
    </div>
  );
}

export default React.forwardRef(GuilgeeniiTuukh);
