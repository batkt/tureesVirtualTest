import {
  Button,
  DatePicker,
  Input,
  message,
  Popconfirm,
} from "antd";
import React, { useEffect, useImperativeHandle, useMemo, useState } from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useReactToPrint } from "react-to-print";
import _ from "lodash";
import useGereeAldangiGuilgee from "hooks/useGereeniiAldangiJagsaalt";
import { useTranslation } from "react-i18next";
import locale from "antd/lib/date-picker/locale/mn_MN";
import axios, { aldaaBarigch } from "services/uilchilgee";
import { DeleteOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";

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

function GuilgeeniiTuukhAldangi(
  { token, data, refreshData, ognoo, ajiltan, barilgiinId },
  ref
) {
  const { t, i18n } = useTranslation();
  const [shineOgnoo, setShineOgnoo] = useState(undefined);
  const [aldangiinUldegdel, setAldangiinUldegdel] = useState(undefined);
  const { guilgeeniiAldangiTuukh, guilgeeniiAldangiTuukhMutate } = useGereeAldangiGuilgee(
    token,
    data?._id,
    ognoo,
    shineOgnoo
  );
  const [sortOrders, setSortOrders] = useState({
    ognoo: null,
    tulukhAldangi: null,
    tulsunAldangi: null,
    dansniiDugaar: null,
    tulsunDans: null,
    ajiltan: null,
    tailbar: null,
    burtgesenOgnoo: null,
  });
  const [sortColumn, setSortColumn] = useState(null);
  const tailbarRef = React.useRef(null);
  const printRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const toggleSortOrder = (column) => {
    const newSortOrders = { ...sortOrders };
    newSortOrders[column] = sortOrders[column] === "asc" ? "desc" : "asc";
    setSortOrders(newSortOrders);
    setSortColumn(column);
  };

  const sortedData = React.useMemo(() => {
    if (!guilgeeniiAldangiTuukh) {
      return [];
    }
    const khuulsanData = [...guilgeeniiAldangiTuukh];
    khuulsanData.sort((a, b) => {
      const sortDaraalal = sortOrders[sortColumn];
      if (sortDaraalal === "asc") {
        if (sortColumn === "ognoo") {
          return new Date(a[sortColumn]) - new Date(b[sortColumn]);
        }
        return a[sortColumn] - b[sortColumn];
      } else if (sortDaraalal === "desc") {
        if (sortColumn === "ognoo") {
          return new Date(b[sortColumn]) - new Date(a[sortColumn]);
        }
        return b[sortColumn] - a[sortColumn];
      }
      return 0;
    });

    return khuulsanData;
  }, [guilgeeniiAldangiTuukh, sortOrders, sortColumn, shineOgnoo]);

  useImperativeHandle(
    ref,
    () => ({
      khevlekh() {
        handlePrint();
      },
      excelTatakh() {
        
      },
      refreshData() {
        guilgeeniiAldangiTuukhMutate();
        setAldangiinUldegdel(undefined);
      },
    }),
    [printRef]
  );

  useEffect(() => {
    if(!aldangiinUldegdel)
      axios(token)
          .get("/geree", {
            params: {
              query: { _id: data?._id, tuluv: { $ne: -1 } },
              select: { aldangiinUldegdel: 1 },
            },
          })
          .then(({ data }) => {
            if (!!data && data.jagsaalt?.length > 0) {
              setAldangiinUldegdel(data.jagsaalt[0].aldangiinUldegdel)
            }
          });
  }, [guilgeeniiAldangiTuukh]);

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
            guilgeeniiAldangiTuukhMutate();
          }
        })
        .catch(aldaaBarigch);
    else {
      const footer = [
        <Button onClick={() => tailbarRef.current.khaaya()}>
          {t("Хаах")}
        </Button>,
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
                    refreshData();
                    guilgeeniiAldangiTuukhMutate();
                    setAldangiinUldegdel(undefined);
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

  return (
    <div className="">
      <div ref={printRef} className="flex flex-col">
        <div className="flex w-full items-center justify-start gap-8">
          <div className="">
            <DatePicker.RangePicker
              value={shineOgnoo}
              onChange={(v) => setShineOgnoo(v)}
              locale={i18n.language === "mn" && locale}
              allowClear
              picker="month"
              disabledDate={(e) => e && e > moment().endOf("day")}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="font-bold">{t("Гэрээний дугаар")}:</div>
              <div>{data?.gereeniiDugaar}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold">{t("Талбайн дугаар")}:</div>
              <div>{data?.talbainDugaar}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="font-bold">{t("Нэр")}:</div>
              <div>{data?.ner}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold">{t("Утас")}:</div>
              <div>{data?.utas.join(",")}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="font-bold">{t("Регистр")}:</div>
              <div>{data?.register}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold">{t("Алдангийн үлдэгдэл")}:</div>
              <div>{formatNumber(aldangiinUldegdel, 2)}</div>
            </div>
          </div>
        </div>
        <th className="w-full">
          <tr className="flex min-w-[50rem] divide-x divide-white border-b border-gray-200 bg-gray-200 pr-1 text-gray-700  dark:bg-gray-800 dark:text-gray-400">
            <td
              onClick={() => toggleSortOrder("ognoo")}
              className="min-w-[8rem] overflow-hidden p-1 text-center">
              {t("Огноо")}
            </td>
            <td
              onClick={() => toggleSortOrder("ajiltan")}
              className="min-w-[8rem] overflow-hidden p-1 text-center">
              {t("Ажилтан")}
            </td>
            <td
              onClick={() => toggleSortOrder("tulukhAldangi")}
              className="min-w-[8rem] overflow-hidden p-1 text-center">
              {t("Төлөх алданги")}
            </td>
            <td
              onClick={() => toggleSortOrder("tulsunAldangi")}
              className="min-w-[8rem] overflow-hidden p-1 text-center">
              {t("Төлсөн алданги")}
            </td>
            <td
              onClick={() => toggleSortOrder("dansniiDugaar")}
              className="min-w-[8rem] overflow-hidden p-1 text-center">
              {t("Данс")}
            </td>
            <td
              onClick={() => toggleSortOrder("tulsunDans")}
              className="min-w-[8rem] overflow-hidden p-1 text-center">
              {t("Төлсөн данс")}
            </td>
            <td
              onClick={() => toggleSortOrder("tailbar")}
              className="w-full min-w-[8rem] overflow-hidden p-1 text-center">
              {t("Тайлбар")}
            </td>
            <td
              onClick={() => toggleSortOrder("burtgesenOgnoo")}
              className="min-w-[10rem] p-1 text-center">
              {t("Бүртгэсэн огноо")}
            </td>
            <td className="min-w-[3rem] border-none p-1 text-center"></td>
          </tr>
        </th>
        <tbody className="min-w-[50rem] overflow-y-scroll" style={{ height: "calc(90vh - 15rem)" }}>
          {sortedData
            ?.map((a, i) => (
              <tr className="flex min-w-[50rem] divide-x border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400">
                <td className="min-w-[8rem] overflow-hidden p-1 text-center">
                  {moment(a.ognoo).format("YYYY-MM-DD")}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1">
                  {a.guilgeeKhiisenAjiltniiNer}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1 text-end">
                  {formatNumber(a.tulukhAldangi, 0)}
                </td>
                <td className="min-w-[8rem] overflow-hidden p-1 text-end">
                  {formatNumber(a.tulsunAldangi, 0)}
                </td>
                <td className="flex min-w-[8rem] justify-center p-1 text-center ">
                  {a.dansniiDugaar}
                </td>
                <td className="flex min-w-[8rem] justify-center p-1 text-center ">
                  {a.tulsunDans}
                </td>
                <td className="flex w-full min-w-[8rem] justify-between overflow-hidden p-1">
                  {a.tailbar}
                </td>
                <td className="flex min-w-[10rem] justify-center p-1 text-center ">
                  {a.guilgeeKhiisenOgnoo &&
                    moment(a.guilgeeKhiisenOgnoo).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td className="flex min-w-[3rem] justify-center border-none">
                  {(ajiltan?.erkh === "Admin" ||
                    !!_.get(ajiltan, `tokhirgoo.guilgeeUstgakhErkh`)?.find(
                      (a) => a === barilgiinId
                    )) &&
                    (a.turul === "avlaga" ||
                      a.turul === "voucher" ||
                      a.turul === "barter" ||
                      a.turul === "bank" ||
                      a.turul === "khyamdral" ||
                      a.turul === "aldangi" ||
                      a.turul === "zalruulga" ||
                      a.turul === "baritsaa" ||
                      a.turul === "qpay" ||
                      a.turul === "tulultBurtgekh") && (
                      <Popconfirm
                        title={t("Төлөлт устгах уу?")}
                        okText={t("Тийм")}
                        cancelText={t("Үгүй")}
                        onConfirm={() => tulultUstgaya(a)}>
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

export default React.forwardRef(GuilgeeniiTuukhAldangi);
