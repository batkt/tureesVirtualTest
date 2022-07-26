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

function GuilgeeniiTuukh({ token, data, refreshData, ognoo }, ref) {
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
          }
        })
        .catch(aldaaBarigch);
    else {
      const footer = [
        <Button onClick={() => tailbarRef.current.khaaya()}>Хаах</Button>,
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
    <div className="ml-12">
      <div ref={printRef}>
        <div className="print mb-2">
          <div>Гүйлгээний түүх</div>
          <div className="ml-auto">Талбайн дугаар:{data?.talbainDugaar}</div>
        </div>
        <div className="grid grid-cols-11 border-b border-gray-200 bg-gray-200 p-1 text-gray-700  dark:bg-gray-800 dark:text-gray-400">
          <div>№</div>
          <div>Огноо</div>
          <div>Түрээс</div>
          <div>Төлөх дүн</div>
          <div>Хямдрал</div>
          <div>Төлсөн дүн</div>
          <div>Үлдэгдэл</div>
          <div>Ажилтан</div>
          <div>Хэлбэр</div>
          <div>Бүртгсэн огноо</div>
          <div>Тайлбар</div>

        </div>
        <div className="overflow-y-auto" style={{ height: "calc(40vh)" }}>
          {guilgeeniiTuukh?.map((a, i) => (
            <div className="grid grid-cols-11 border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400">
              <div className="p-1">{i + 1}</div>
              <div className="p-1">{moment(a.ognoo).format("YYYY-MM-DD")}</div>
              <div className="p-1">{formatNumber(a.undsenDun, 0)}</div>
              <div className="p-1">{formatNumber(a.tulukhDun, 0)}</div>
              <div className="p-1">{formatNumber(a.khyamdral, 0)}</div>
              <div className="p-1">{formatNumber(a.tulsunDun, 0)}</div>
              <div
                className={`p-1 ${a?.uldegdel > 0 ? "text-red-500" : "text-green-500"
                  }`}
              >
                {formatNumber(
                  a.turul === "khyamdral" && a.uldegdel < 0 ? 0 : a.uldegdel,
                  0
                )}
              </div>
              <div className="p-1">{a.guilgeeKhiisenAjiltniiNer}</div>
              <div className="p-1">
                {a.turul === "bank"
                  ? a.tulsunDans !== " "
                    ? a.tulsunDans
                    : "Банк"
                  : turulAvya(a.turul)}
              </div>
              <div className="flex justify-between p-1">
                {a.guilgeeKhiisenOgnoo && moment(a.guilgeeKhiisenOgnoo).format("YYYY-MM-DD HH:mm:ss")}
              </div>
              <div className="flex justify-between p-1">
                {a.tailbar}
                {(a.turul === "avlaga" ||
                  a.turul === "voucher" ||
                  a.turul === "barter" ||
                  a.turul === "bank" ||
                  a.turul === "khyamdral" ||
                  a.turul === "baritsaa") && (
                    <div className="contents justify-between">
                      <Popconfirm
                        title="Төлөлт устгах уу?"
                        okText="Тийм"
                        cancelText="Үгүй"
                        onConfirm={() => tulultUstgaya(a)}
                      >
                        <div className="hide-on-print ml-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border p-1 text-red-500">
                          <DeleteOutlined />
                        </div>
                      </Popconfirm>
                    </div>
                  )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(GuilgeeniiTuukh);
