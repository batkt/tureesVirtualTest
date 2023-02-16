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

const fetcher = (url, token, gereeniiId, ognoo) =>
  axios(token)
    .get(`${url}/${gereeniiId}`, {
      params: {
        duusakhOgnoo: moment(ognoo[1])
          .endOf("month")
          .format("YYYY-MM-DD 23:59:59"),
      },
    })
    .then((res) => {
      var uldegdel = 0;
      res.data.forEach((x) => {
        uldegdel =
          uldegdel +
          (x?.tulukhDun || 0 - (x?.tulsunDun || 0) - (x?.khyamdral || 0));
        if (x.turul === "khyamdral" && uldegdel < 0) x.uldegdel = 0;
        else x.uldegdel = uldegdel;
      });
      return res.data;
    })
    .catch(aldaaBarigch);

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

function useGuilgee(token, gereeniiId, ognoo) {
  const { data, mutate } = useSWR(
    !!token ? ["/gereeniiTulultAvya", token, gereeniiId, ognoo] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    guilgeeniiTuukh: data,
    guilgeeniiTuukhMutate: mutate,
  };
}

function GuilgeeniiTuukh({ token, data, refreshData, ognoo, ajiltan, barilgiinId }, ref) {
  const { guilgeeniiTuukh, guilgeeniiTuukhMutate } = useGuilgee(
    token,
    data?._id,
    ognoo
  );
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
            message.success("Төлөлт амжилттай устгагдлаа!");
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
                    message.success("Төлөлт амжилттай устгагдлаа!");
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
      <div ref={printRef}>
        <div className="print mb-2 p-2">
          <div>{t("Гүйлгээний түүх")}</div>
          <div className="ml-auto">{t("Талбайн дугаар")}:{data?.talbainDugaar}</div>
        </div>
        <div className="flex pr-1 border-b divide-white divide-x min-w-[93rem] border-gray-200 bg-gray-200 text-gray-700  dark:bg-gray-800 dark:text-gray-400">
          <div className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Огноо")}</div>
          <div className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Түрээс")}</div>
          <div className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Төлөх дүн")}</div>
          <div className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Хямдрал")}</div>
          <div className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Төлсөн алданги")}</div>
          <div className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Төлсөн дүн")}</div>
          <div className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Үлдэгдэл")}</div>

          <div className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Ажилтан")}</div>
          <div className="min-w-[8rem] overflow-hidden p-1 text-center">{t("Хэлбэр")}</div>
          <div className="min-w-[8rem] overflow-hidden p-1 w-full text-center">{t("Тайлбар")}</div>
          <div className="min-w-[10rem] text-center p-1">{t("Бүртгсэн огноо")}</div>
          <div className="min-w-[3rem] border-none p-1 text-center"></div>
        </div>
        <div className=" overflownone min-w-[93.4rem] overflow-y-scroll" style={{ height: "calc(100vh - 15rem)" }}>
          {guilgeeniiTuukh
            ?.map((a, i) => (
              <div className="flex divide-x min-w-[93rem] border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400">
                <div className="p-1 min-w-[8rem] text-center overflow-hidden">
                  {moment(a.ognoo).format("YYYY-MM-DD")}
                </div>
                <div className="p-1 min-w-[8rem] overflow-hidden text-end">{formatNumber(a.undsenDun, 2)}</div>
                <div className="p-1 min-w-[8rem] overflow-hidden text-end">{formatNumber(a.tulukhDun, 2)}</div>
                <div className="p-1 min-w-[8rem] overflow-hidden text-end">{formatNumber(a.khyamdral, 2)}</div>
                <div className="p-1 min-w-[8rem] overflow-hidden text-end">{formatNumber(a.tulsunAldangi, 2)}</div>
                <div className="p-1 min-w-[8rem] overflow-hidden text-end">{formatNumber(a.tulsunDun, 2)}</div>
                <div
                  className={`p-1 min-w-[8rem] overflow-hidden text-end ${a?.uldegdel > 0 ? "text-red-500" : "text-green-500"
                    }`}
                >
                  {formatNumber(
                    a.turul === "khyamdral" && a.uldegdel < 0 ? 0 : a.uldegdel,
                    2
                  )}
                </div>

                <div className="p-1 min-w-[8rem] overflow-hidden">{a.guilgeeKhiisenAjiltniiNer}</div>
                <div className="p-1 text-center min-w-[8rem] overflow-hidden">
                  {a.turul === "bank"
                    ? a.tulsunDans !== " "
                      ? a.tulsunDans
                      : t("Банк")
                    : turulAvya(a.turul)}
                </div>
                <div className="flex min-w-[8rem] overflow-hidden w-full justify-between p-1">
                  {a.tailbar}
                </div>
                <div className="flex min-w-[10rem] text-center justify-center p-1 ">
                  {a.guilgeeKhiisenOgnoo &&
                    moment(a.guilgeeKhiisenOgnoo).format("YYYY-MM-DD HH:mm:ss")}
                </div>
                <div className="flex min-w-[3rem] border-none justify-center">
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
                        title="Төлөлт устгах уу?"
                        okText={t("Тийм")}
                        cancelText={t("Үгүй")}
                        onConfirm={() => tulultUstgaya(a)}
                      >
                        <div className="hide-on-print flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border p-1 text-red-500">
                          <DeleteOutlined />
                        </div>
                      </Popconfirm>
                    )}
                </div>
              </div>
            ))
            .reverse()}
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(GuilgeeniiTuukh);