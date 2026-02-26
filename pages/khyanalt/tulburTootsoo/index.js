import { Input, Button as AntButton } from "antd";
import createMethod from "../../../tools/function/crud/createMethod";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useMemo, useEffect, useState } from "react";
import { useAuth } from "services/auth";
import {
  Card,
  DatePicker,
  Table,
  Select,
  Button,
  Tooltip,
  message,
  Spin,
  notification,
  Popover,
} from "antd";
import {
  CheckOutlined,
  DownloadOutlined,
  DownOutlined,
  ExclamationOutlined,
  FileExcelOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import { TbEqualNot } from "react-icons/tb";
import moment from "moment";
import { t } from "i18next";
import useDans from "hooks/useDans";
import formatNumber from "tools/function/formatNumber";
import sorterCompare from "tools/function/sorterCompare";
import useDansniiKhuulgaJagsaalt from "hooks/khuulga/useDansniiKhuulgaJagsaalt";
import useBankniiGuilgeeToololt from "hooks/khuulga/useBankniiGuilgeeToololt";
import GuilgeeKholbokh from "components/pageComponents/tulbur/GuilgeeNiiluulekh";
import ZardalKholbokh from "components/pageComponents/tulbur/ZardalKholbokh";
import { toast } from "sonner";
import _ from "lodash";
import { modal } from "components/ant/Modal";
import Tulbur from "components/pageComponents/eBarimt/Tulbur";
import useUldegdel from "hooks/khuulga/useUldegdel";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import Aos from "aos";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;

function iconAvya(a, bank) {
  let Icon = ExclamationOutlined;
  let color = "red";
  let tailbar = t("Гүйлгээ холбогдоогүй байна");

  const shiljuulegDun =
    bank === "tdb" ? a?.Amt : bank === "golomt" ? a?.tranAmount : a?.amount;

  const kholbogdsonDun = a?.kholbosonDun || 0;

  if (kholbogdsonDun > 0 && kholbogdsonDun < shiljuulegDun) {
    Icon = TbEqualNot;
    color = "yellow";
    tailbar = `${formatNumber(shiljuulegDun - kholbogdsonDun, 0)} ₮ ${t(
      "дутуу холбогдсон байна"
    )}`;
  } else if (
    a?.magadlaltaiGereenuud?.length > 0 &&
    !(a?.kholbosonGereeniiId?.length > 0)
  ) {
    Icon = QuestionOutlined;
    color = "yellow";
    tailbar = "Холбох боломжтой гэрээнүүд байна";
  } else if (
    (a?.kholbosonGereeniiId && a?.kholbosonDun) ||
    shiljuulegDun === 0
  ) {
    Icon = CheckOutlined;
    color = "green";
    tailbar = t("Гүйлгээ холбогдсон байна");
  }

  return (
    <Tooltip title={tailbar}>
      <div className={`text-${color}-500 flex items-center justify-center`}>
        <Icon style={{ fontSize: "16px" }} />
      </div>
    </Tooltip>
  );
}

function iconAvyaZardal(a, bank) {
  let Icon = ExclamationOutlined;
  let color = "red";
  let tailbar = t("Гүйлгээ холбогдоогүй байна");

  if (!!a.zardliinBulgiinId) {
    Icon = CheckOutlined;
    color = "green";
    tailbar = t("Гүйлгээ холбогдсон байна");
  }

  return (
    <Tooltip title={tailbar}>
      <div className={`text-${color}-500 flex items-center justify-center`}>
        <Icon style={{ fontSize: "16px" }} />
      </div>
    </Tooltip>
  );
}

function GuilgeeniiDun({
  token,
  dansniiDugaar,
  barilgiinId,
  ognoo,
  turul,
  baiguullagiinId,
  t,
}) {
  const { data } = useSWR(
    !!token && !!dansniiDugaar && !!barilgiinId
      ? [token, dansniiDugaar, barilgiinId, ognoo, turul, baiguullagiinId]
      : null,
    async (
      token,
      dansniiDugaar,
      barilgiinId,
      ognoo,
      turul,
      baiguullagiinId
    ) => {
      try {
        const res = await uilchilgee(token).post("/dansniiKhuulgaDunAvya", {
          dansniiDugaar,
          barilgiinId,
          turul,
          ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
          duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
        });

        const body = res.data;

        // If endpoint returned precomputed dun, return it
        if (
          _.get(body, "0.dun") !== undefined ||
          _.get(body, "dun") !== undefined
        ) {
          return body;
        }

        // If it returned a list (array) or jagsaalt array, sum numeric fields
        const list = Array.isArray(body)
          ? body
          : Array.isArray(body?.jagsaalt)
          ? body.jagsaalt
          : null;

        if (Array.isArray(list) && list.length > 0) {
          let dun = 0;
          list.forEach((item) => {
            if (!item) return;
            if (item.tranAmount !== undefined)
              dun += Number(item.tranAmount) || 0;
            else if (item.Amt !== undefined) dun += Number(item.Amt) || 0;
            else if (item.amount !== undefined) dun += Number(item.amount) || 0;
            else if (item.income !== undefined) dun += Number(item.income) || 0;
          });
          return [{ dun }];
        }

        // Last resort: query bankniiGuilgee endpoint to get records and sum
        try {
          const dateRange = {
            $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
          };

          const query = {
            dansniiDugaar,
            barilgiinId,
            baiguullagiinId,
            $and: [
              {
                $or: [
                  { amount: { $gt: 0 } },
                  { tranAmount: { $gt: 0 } },
                  { Amt: { $gt: 0 } },
                  { income: { $gt: 0 } },
                ],
              },
              { $or: [{ TxDt: dateRange }, { tranDate: dateRange }] },
            ],
          };

          const res2 = await uilchilgee(token).get("/bankniiGuilgee", {
            params: { query, khuudasniiKhemjee: 1000 },
          });
          const list2 = Array.isArray(res2.data)
            ? res2.data
            : Array.isArray(res2.data?.jagsaalt)
            ? res2.data.jagsaalt
            : [];
          let dun2 = 0;
          list2.forEach((item) => {
            if (!item) return;
            if (item.tranAmount !== undefined)
              dun2 += Number(item.tranAmount) || 0;
            else if (item.Amt !== undefined) dun2 += Number(item.Amt) || 0;
            else if (item.amount !== undefined)
              dun2 += Number(item.amount) || 0;
            else if (item.income !== undefined)
              dun2 += Number(item.income) || 0;
          });
          return [{ dun: dun2 }];
        } catch (e) {
          // fallback to original body if this fails
        }

        return body;
      } catch (e) {
        return aldaaBarigch(e);
      }
    }
  );

  return (
    <div className="font-medium dark:bg-gray-900 dark:text-white">
      {t("Гүйлгээний нийт дүн")}: {formatNumber(_.get(data, "0.dun") || 0)}
    </div>
  );
}

function tulburTootsoo({ token }) {
  const { t } = useTranslation();
  useEffect(() => {
    Aos.init({ once: true });
  });
  const refGuilgee = React.useRef(null);
  const zardalRef = React.useRef(null);
  const isSavingRef = React.useRef(false);
  const { baiguullaga, barilgiinId, ajiltan } = useAuth();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = React.useState([moment(), moment()]);
  const { dansGaralt } = useDans(token, baiguullaga?._id);
  const [songogdsonDans, setSongogdsonDans] = React.useState(null);
  const [garDun, setGarDun] = React.useState("");
  const [songogdsonTurul, setSongogdsonTurul] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [garDunFormatted, setGarDunFormatted] = React.useState("");
  const [tailbar, setTailbar] = React.useState("");
  const [loadingBaritsaa, setLoadingBaritsaa] = useState(false);

  const [khuulgaTurul, setKhuulgaTurul] = React.useState("orlogo");

  const { bankniiGuilgeeToololt, bankniiGuilgeeToololtMutate } =
    useBankniiGuilgeeToololt(token, ekhlekhOgnoo, songogdsonDans);
  const { uldegdel } = useUldegdel(token, songogdsonDans?.dugaar);

  const [order, setOrder] = React.useState({});

  const query = React.useMemo(() => {
    let query = {};
    if (songogdsonTurul === "Тодорхойгүй") {
      query.magadlaltaiGereenuud = { $eq: null };
      query.kholbosonGereeniiId = { $size: 0 };
    } else if (songogdsonTurul === "Холбогдсон")
      query["kholbosonGereeniiId.0"] = { $exists: true };
    else if (songogdsonTurul === "Магадлалтай") {
      query.magadlaltaiGereenuud = { $exists: true, $ne: null };
      query.kholbosonGereeniiId = { $size: 0 };
    }

    query[
      `${
        songogdsonDans?.bank === "tdb"
          ? "Amt"
          : songogdsonDans?.bank === "golomt"
          ? "drOrCr"
          : "amount"
      }`
    ] =
      songogdsonDans?.bank === "golomt"
        ? khuulgaTurul === "orlogo"
          ? "Credit"
          : "Debit"
        : {
            [khuulgaTurul === "orlogo" ? "$gt" : "$lt"]: 0,
          };

    return query;
  }, [songogdsonTurul, khuulgaTurul, songogdsonDans]);
  useEffect(() => {
    setSongogdsonDans(null);
  }, [barilgiinId]);

  const {
    dansniiKhuulgaGaralt,
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaMutate,
    isValidating,
  } = useDansniiKhuulgaJagsaalt(
    token,
    baiguullaga?._id,
    songogdsonDans,
    ekhlekhOgnoo,
    order,
    query
  );

  function refreshData() {
    dansniiKhuulgaMutate();
    bankniiGuilgeeToololtMutate();
  }

  function dansSongoy(dugaar) {
    let songogdsonDans = dansGaralt?.jagsaalt?.find((a) => a.dugaar === dugaar);
    setDansniiKhuulgaKhuudaslalt((a) => ({ ...a, khuudasniiDugaar: 1 }));
    setOrder(() => ({
      ...{},
      [`${
        songogdsonDans?.bank === "tdb"
          ? "TxDt"
          : songogdsonDans?.bank === "golomt"
          ? "tranDate"
          : "createdAt"
      }`]: -1,
      [`${songogdsonDans?.bank === "tdb" ? "TxTime" : "time"}`]: undefined,
    }));
    setSongogdsonDans(songogdsonDans);
  }

  function guilgeeKholbyo(data) {
    const erkhteyu =
      ajiltan?.erkh === "Admin" ||
      _.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`)?.includes(
        data.barilgiinId
      );

    if (!erkhteyu) {
      notification.warning({
        message: t("Таньд гүйлгээ хийх эрх байхгүй байна."),
      });
      return;
    }

    function refresh() {
      setTimeout(() => data.mutate && data.mutate(), 500);
      refreshData();
    }

    const hasLinkedGereen =
      Array.isArray(data?.kholbosonGereeniiId) &&
      data.kholbosonGereeniiId.length > 0;

    const kholbosonDunNum = Number(data.kholbosonDun || 0);
    const amountNum = Number(data.amount || data.tranAmount || 0);
    const balanceNum = Number(data.balance || 0);

    if (
      hasLinkedGereen &&
      (kholbosonDunNum - amountNum === 0 || balanceNum - kholbosonDunNum === 0)
    ) {
      notification.success({
        message: t("Гүйлгээ холбогдсон байна"),
      });
    } else {
      if (
        data?.kholbosonGereeniiId?.length > 0 &&
        (data?.kholbosonDun ===
          data[
            `${
              songogdsonDans?.bank === "tdb"
                ? "Amt"
                : songogdsonDans?.bank === "golomt"
                ? "tranAmount"
                : "amount"
            }`
          ] || songogdsonDans?.bank === "tdb"
          ? data?.TxAddInf?.includes("QPAY") || data?.TxAddInf?.includes("qpay")
          : songogdsonDans?.bank === "golomt"
          ? data?.tranDesc?.includes("QPAY") || data?.tranDesc?.includes("qpay")
          : data?.description.includes("QPAY") ||
            data?.description.includes("qpay"))
      ) {
        toast.info(t("Гүйлгээ гэрээнд холбогдсон байна."));
        return;
      }

      const footer = [
        <div className="pr-[1%]">
          <Button onClick={() => refGuilgee.current.khaaya()}>
            {t("Хаах")}
          </Button>

          <Button
            type="primary"
            onClick={() => {
              if (!loading && !loadingBaritsaa && !isSavingRef.current) {
                isSavingRef.current = true;
                refGuilgee.current.khadgalya();
              }
            }}
          >
            {t("Хадгалах")}
          </Button>
        </div>,
      ];

      modal({
        wrapClassName: "guilgee-modal",
        title: (
          <div className="flex items-center justify-between">
            <span className="text-black dark:text-white">Гүйлгээ холбох</span>
          </div>
        ),
        width: "95%",
        style: { maxWidth: "1400px" },
        icon: <FileExcelOutlined />,
        content: (
          <GuilgeeKholbokh
            dans={songogdsonDans}
            data={data}
            barilgiinId={barilgiinId}
            ref={refGuilgee}
            token={token}
            baiguullagiinId={baiguullaga?._id}
            onFinish={() => {
              refreshData();
              isSavingRef.current = false;
            }}
            setLoading={setLoading}
            setLoadingBaritsaa={setLoadingBaritsaa}
          />
        ),
        footer,
      });
    }
  }

  function zardalKholbyo(data) {
    if (!!data?.zardliinBulgiinId) {
      toast.info(t("Зардал холбогдсон байна."));
      return;
    }

    const footer = [
      <div className="pr-[1%]">
        <Button onClick={() => zardalRef.current.khaaya()}>{t("Хаах")}</Button>,
        <Button type="primary" onClick={() => zardalRef.current.khadgalya()}>
          {t("Хадгалах")}
        </Button>
        ,
      </div>,
    ];
    modal({
      title: "",
      width: "780px",
      icon: <FileExcelOutlined />,
      content: (
        <ZardalKholbokh
          dans={songogdsonDans}
          data={data}
          barilgiinId={barilgiinId}
          ref={zardalRef}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }

  function turulSongyo(utga) {
    setSongogdsonTurul(utga);
    setDansniiKhuulgaKhuudaslalt((a) => ({ ...a, khuudasniiDugaar: 1 }));
  }

  function ebarimtUgukh(data) {
    function barimtShivya(register, turul) {
      modal({
        title: (
          <div className="flex w-full flex-row justify-between">
            <div>{t("Түрээсийн төлбөрийн и-баримт")}</div>
          </div>
        ),
        content: (
          <Tulbur
            data={data}
            token={token}
            ajiltan={ajiltan}
            defaultRegister={register}
            defaultTurul={turul}
            eBarimtAutomataarShivikh={
              baiguullaga?.tokhirgoo?.eBarimtAutomataarShivikh
            }
            baiguullaga={baiguullaga}
            barilgiinId={barilgiinId}
            dansniiKhuulgaMutate={dansniiKhuulgaMutate}
            onRefresh={refreshData}
          />
        ),
        footer: false,
      });
    }
    if (baiguullaga?.tokhirgoo?.eBarimtAutomataarShivikh === true) {
      uilchilgee(token)
        .get("/geree", {
          params: {
            query: { _id: data.kholbosonGereeniiId },
            select: { register: 1, turul: 1 },
          },
        })
        .then(({ data }) => {
          if (data.jagsaalt.length > 0) {
            barimtShivya(data.jagsaalt[0].register, data.jagsaalt[0].turul);
          }
        });
    } else barimtShivya();
  }

  const columns = useMemo(() => {
    let baganuud = [];
    const nuukh =
      ajiltan?.erkh === "Admin" ||
      (_.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`) || []).length > 0;
    const ajiltanBagana = {
      title: t("Ажилтан"),
      dataIndex: "burtgesenAjiltaniiNer",
      align: "center",
      width: "8rem",
      render(value, record) {
        if (!record?.kholbosonGereeniiId?.length) return "-";
        if (!value) return "-";
        return (
          <Tooltip placement="top" title={<div>{value}</div>}>
            <div className="flex w-full justify-center truncate">{value}</div>
          </Tooltip>
        );
      },
    };
    if (songogdsonDans?.bank === "tdb") {
      baganuud = [
        {
          title: t("Огноо"),
          dataIndex: "TxDt",
          align: "center",
          width: "7rem",
          render(date) {
            return moment(date).format("YYYY-MM-DD");
          },
        },
        {
          title: t("Цаг"),
          dataIndex: "TxTime",
          align: "center",
          width: "4rem",
          render(a, data) {
            return a && _.isString(a) ? `${a}` : moment(data.TxDt).format("HH:mm");
          },
        },
        {
          title: t("Гүйлгээний утга"),
          dataIndex: "TxAddInf",
          width: "20rem",
          align: "center",
          render(a) {
            return (
              <Tooltip title={<div>{a}</div>}>
                <div className="flex w-full truncate">{a}</div>
              </Tooltip>
            );
          },
        },
        {
          title: t("Гүйлгээний дүн"),
          dataIndex: "Amt",
          align: "right",
          width: "9rem",
          render(a) {
            return `${formatNumber(a, 2)}₮`;
          },
        },
        {
          title: t("Данс"),
          dataIndex: "CtAcntOrg",
          align: "center",
          width: "10rem",
        },
        {
          title: t("Холбосон"),
          dataIndex: "updatedAt",
          align: "center",
          width: "8rem",
          render(date) {
            return date ? moment(date).format("YYYY-MM-DD HH:mm") : "-";
          },
        },
        ajiltanBagana,
      ];

      if (khuulgaTurul === "orlogo")
        baganuud = [
          ...baganuud,
          ...(ajiltan?.erkh === "Admin" ||
          (_.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`) || []).length > 0
            ? [
                {
                  title: "Төлөв",
                  width: "4rem",
                  align: "center",
                  render(a) {
                    const erkhteyu =
                      ajiltan?.erkh === "Admin" ||
                      _.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`)?.includes(
                        a.barilgiinId
                      );

                    if (!erkhteyu) return null;

                    return (
                      <div className="flex items-center justify-center">
                        <Button
                          shape="circle"
                          size="small"
                          onClick={() => guilgeeKholbyo(a)}
                          icon={iconAvya(a, "tdb")}
                        />
                      </div>
                    );
                  },
                },
                {
                  title: t("Талбай"),
                  dataIndex: "kholbosonTalbainId",
                  ellipsis: true,
                  align: "center",
                  width: "5rem",
                  render(data) {
                    if (data && data.length > 1) {
                      return (
                        <Tooltip
                          placement="top"
                          title={
                            <div className="flex justify-center truncate">
                              {data.map((a, i) => (
                                <div
                                  key={i}
                                  className={`${
                                    data.length - 1 !== i && "pr-1"
                                  }`}
                                >
                                  {a}
                                  {data.length - 1 !== i && ","}
                                </div>
                              ))}
                            </div>
                          }
                        >
                          <div className="flex justify-center truncate">
                            {data.map((a, i) => (
                              <div
                                key={i}
                                className={`${data.length - 1 !== i && "pr-1"}`}
                              >
                                {a}
                                {data.length - 1 !== i && ","}
                              </div>
                            ))}
                          </div>
                        </Tooltip>
                      );
                    } else
                      return (
                        <Tooltip placement="top" title={<div>{data}</div>}>
                          <div>{data}</div>
                        </Tooltip>
                      );
                  },
                },
                {
                  title: "НӨАТУС",
                  width: "4.5rem",
                  align: "center",
                  render(a) {
                    const erkhteyu =
                      ajiltan?.erkh === "Admin" ||
                      _.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`)?.includes(
                        a.barilgiinId
                      );

                    if (!erkhteyu) return null;

                    return (
                      <div className="flex items-center justify-center">
                        <Button
                          size="small"
                          shape="circle"
                          icon={
                            <div className="text-500 flex items-center justify-center">
                              {a?.kholbosonGereeniiId &&
                              a?.ebarimtAvsanEsekh === true ? (
                                <Tooltip title="И-баримт хэвлэсэн байна">
                                  <CheckOutlined
                                    style={{ fontSize: "16px", color: "green" }}
                                  />
                                </Tooltip>
                              ) : (
                                <ExclamationOutlined
                                  style={{ fontSize: "16px", color: "red" }}
                                  onClick={() => ebarimtUgukh(a)}
                                />
                              )}
                            </div>
                          }
                        />
                      </div>
                    );
                  },
                },
              ]
            : []),
        ];
    } else if (
      songogdsonDans?.bank === "khanbank" ||
      songogdsonDans?.bank === "bogd"
    ) {
      baganuud = [
        {
          title: t("Огноо"),
          showSorterTooltip: false,
          sorter: {
            compare: () => 0,
            multiple: 1,
          },
          dataIndex: "tranDate",
          align: "center",
          width: "7rem",
          render(date) {
            return moment(date).format("YYYY-MM-DD");
          },
        },
        {
          title: t("Цаг"),
          showSorterTooltip: false,
          sorter: {
            compare: () => 0,
            multiple: 2,
          },
          dataIndex: "time",
          ellipsis: true,
          width: "4rem",
          render(a) {
            if (songogdsonDans?.bank === "bogd") return a;
            else if (_.isString(a))
              return `${a.substring(0, 2)}:${a.substring(2, 4)}`;
            return "";
          },
        },
        {
          title: t("Гүйлгээний утга"),
          width: "20rem",
          align: "center",
          dataIndex: "description",
          render(a) {
            return (
              <Tooltip title={<div>{a}</div>}>
                <div className="flex w-full truncate">{a}</div>
              </Tooltip>
            );
          },
        },
        {
          title: t("Гүйлгээний дүн"),
          showSorterTooltip: false,
          sorter: () => 0,
          dataIndex: "amount",
          ellipsis: true,
          width: "9rem",
          className: "text-right",
          render(a) {
            return `${formatNumber(a, 2)}₮`;
          },
        },
        {
          title: t("Данс"),
          align: "center",
          dataIndex: "relatedAccount",
          ellipsis: true,
          width: "10rem",
        },
        {
          title: t("Холбосон"),
          dataIndex: "updatedAt",
          align: "center",
          width: "8rem",
          render(date) {
            return date ? moment(date).format("YYYY-MM-DD HH:mm") : "-";
          },
        },
        ajiltanBagana,
      ];
      if (khuulgaTurul === "orlogo")
        baganuud = [
          ...baganuud,
          ...(ajiltan?.erkh === "Admin" ||
          (_.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`) || []).length > 0
            ? [
                {
                  title: "Төлөв",
                  width: "4rem",
                  align: "center",
                  render(a) {
                    const erkhteyu =
                      ajiltan?.erkh === "Admin" ||
                      _.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`)?.includes(
                        a.barilgiinId
                      );

                    if (!erkhteyu) return null;

                    return (
                      <div className="flex items-center justify-center">
                        <Button
                          shape="circle"
                          size="small"
                          onClick={() => guilgeeKholbyo(a)}
                          icon={iconAvya(a, "khanbank")}
                        />
                      </div>
                    );
                  },
                },
                {
                  title: t("Талбай"),
                  dataIndex: "kholbosonTalbainId",
                  ellipsis: true,
                  align: "center",
                  width: "5rem",
                  render(data) {
                    if (data && data.length > 1) {
                      return (
                        <Tooltip
                          placement="top"
                          title={
                            <div className="flex justify-center truncate">
                              {data.map((a, i) => (
                                <div
                                  key={i}
                                  className={`${
                                    data.length - 1 !== i && "pr-1"
                                  }`}
                                >
                                  {a}
                                  {data.length - 1 !== i && ","}
                                </div>
                              ))}
                            </div>
                          }
                        >
                          <div className="flex justify-center truncate">
                            {data.map((a, i) => (
                              <div
                                key={i}
                                className={`${data.length - 1 !== i && "pr-1"}`}
                              >
                                {a}
                                {data.length - 1 !== i && ","}
                              </div>
                            ))}
                          </div>
                        </Tooltip>
                      );
                    } else
                      return (
                        <Tooltip placement="top" title={<div>{data}</div>}>
                          <div>{data}</div>
                        </Tooltip>
                      );
                  },
                },
                {
                  title: "НӨАТУС",
                  width: "4.5rem",
                  align: "center",
                  render(a) {
                    const erkhteyu =
                      ajiltan?.erkh === "Admin" ||
                      _.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`)?.includes(
                        a.barilgiinId
                      );

                    if (!erkhteyu) return null;

                    return (
                      <div className="flex items-center justify-center">
                        <Button
                          size="small"
                          shape="circle"
                          icon={
                            <div
                              className={`text-500 flex items-center justify-center`}
                            >
                              {a?.kholbosonGereeniiId &&
                              a?.ebarimtAvsanEsekh === true ? (
                                <Tooltip title="И-баримт хэвлэсэн байна">
                                  <CheckOutlined
                                    style={{ fontSize: "16px", color: "green" }}
                                  />
                                </Tooltip>
                              ) : (
                                <ExclamationOutlined
                                  style={{ fontSize: "16px", color: "red" }}
                                  onClick={() => ebarimtUgukh(a)}
                                />
                              )}
                            </div>
                          }
                        />
                      </div>
                    );
                  },
                },
              ]
            : []),
        ];
    } else if (songogdsonDans?.bank === "golomt") {
      baganuud = [
        {
          title: t("Огноо"),
          dataIndex: "tranPostedDate",
          align: "center",
          width: "7rem",
          render(date) {
            return moment(date).format("YYYY-MM-DD HH:mm:ss");
          },
          showSorterTooltip: false,
          sorter: {
            compare: () => 0,
            multiple: 1,
          },
        },
        {
          title: t("Гүйлгээний утга"),
          width: "20rem",
          align: "center",
          dataIndex: "tranDesc",
          render(a) {
            return (
              <Tooltip title={<div>{a}</div>}>
                <div className="flex w-full truncate">{a}</div>
              </Tooltip>
            );
          },
        },
        {
          title: t("Гүйлгээний дүн"),
          sorter: () => 0,
          dataIndex: "tranAmount",
          ellipsis: true,
          width: "9rem",
          className: "text-right",
          showSorterTooltip: false,
          render(a) {
            return `${formatNumber(a, 2)}₮`;
          },
        },
        {
          title: t("Шилжүүлсэн данс"),
          align: "center",
          dataIndex: "accNum",
          ellipsis: true,
          width: "10rem",
        },
        {
          title: t("Холбосон"),
          dataIndex: "updatedAt",
          align: "center",
          width: "8rem",
          render(date) {
            return date ? moment(date).format("YYYY-MM-DD HH:mm") : "-";
          },
        },
        ajiltanBagana,
      ];
      if (khuulgaTurul === "orlogo")
        baganuud = [
          ...baganuud,
          ...(ajiltan?.erkh === "Admin" ||
          (_.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`) || []).length > 0
            ? [
                {
                  title: t("Төлөв"),
                  width: "4rem",
                  align: "center",
                  render(a) {
                    const erkhteyu =
                      ajiltan?.erkh === "Admin" ||
                      _.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`)?.includes(
                        a.barilgiinId
                      );

                    if (!erkhteyu) return null;

                    return (
                      <div className="flex items-center justify-center">
                        <Button
                          shape="circle"
                          size="small"
                          onClick={() => guilgeeKholbyo(a)}
                          icon={iconAvya(a, "golomt")}
                        />
                      </div>
                    );
                  },
                },
                {
                  title: t("Талбай"),
                  dataIndex: "kholbosonTalbainId",
                  ellipsis: true,
                  align: "center",
                  width: "5rem",
                  render(data) {
                    if (data && data.length > 1) {
                      return (
                        <Tooltip
                          placement="top"
                          title={
                            <div className="flex justify-center truncate">
                              {data.map((a, i) => (
                                <div
                                  key={i}
                                  className={`${
                                    data.length - 1 !== i && "pr-1"
                                  }`}
                                >
                                  {a}
                                  {data.length - 1 !== i && ","}
                                </div>
                              ))}
                            </div>
                          }
                        >
                          <div className="flex justify-center truncate">
                            {data.map((a, i) => (
                              <div
                                key={i}
                                className={`${data.length - 1 !== i && "pr-1"}`}
                              >
                                {a}
                                {data.length - 1 !== i && ","}
                              </div>
                            ))}
                          </div>
                        </Tooltip>
                      );
                    } else
                      return (
                        <Tooltip placement="top" title={<div>{data}</div>}>
                          <div>{data}</div>
                        </Tooltip>
                      );
                  },
                },
                {
                  title: "НӨАТУС",
                  width: "5rem",
                  align: "center",
                  render(a) {
                    const erkhteyu =
                      ajiltan?.erkh === "Admin" ||
                      _.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`)?.includes(
                        a.barilgiinId
                      );

                    if (!erkhteyu) return null;

                    return (
                      <div className="flex items-center justify-center">
                        <Button
                          size="small"
                          shape="circle"
                          icon={
                            <div
                              className={`text-500 flex items-center justify-center`}
                            >
                              {a?.kholbosonGereeniiId &&
                              a?.ebarimtAvsanEsekh === true ? (
                                <Tooltip title="И-баримт хэвлэсэн байна">
                                  <CheckOutlined
                                    style={{ fontSize: "16px", color: "green" }}
                                  />
                                </Tooltip>
                              ) : (
                                <ExclamationOutlined
                                  style={{ fontSize: "16px", color: "red" }}
                                  onClick={() => ebarimtUgukh(a)}
                                />
                              )}
                            </div>
                          }
                        />
                      </div>
                    );
                  },
                },
              ]
            : []),
        ];
    }
    if (khuulgaTurul === "zarlaga")
      baganuud.push({
        title: "Төлөв",
        width: "4rem",
        align: "center",
        render(a) {
          return (
            <div className="flex items-center justify-center">
              <Button
                shape="circle"
                size="small"
                onClick={() => zardalKholbyo(a)}
                icon={iconAvyaZardal(a)}
              />
            </div>
          );
        },
      });

    return baganuud;
  }, [songogdsonDans, khuulgaTurul]);

  return (
    <Admin
      title="Дансны хуулга"
      khuudasniiNer="khuulga"
      className="p-0 md:p-4"
      onSearch={(searchValue) => {
        setDansniiKhuulgaKhuudaslalt((a) => ({
          ...a,
          search: searchValue,
          khuudasniiDugaar: 1,
        }));
      }}
      tsonkhniiId="61c2c6a51c2830c4e6f90cad"
      loading={isValidating}
    >
      {dansniiKhuulgaGaralt?.jagsaalt.length > 0 &&
        Number(bankniiGuilgeeToololt?.niit || 0) -
          Number(bankniiGuilgeeToololt?.kholboson || 0) >
          0 &&
        notification.error({
          message: t("Холболт хийгдээгүй гэрээ байна", {
            too:
              Number(bankniiGuilgeeToololt?.niit || 0) -
              Number(bankniiGuilgeeToololt?.kholboson || 0),
          }),
        })}
      <Card className="cardgrid col-span-12 md:p-5">
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:py-0 md:gap-6 2xl:grid-cols-12">
          {[
            { too: bankniiGuilgeeToololt?.niit || 0, utga: "Нийт" },
            {
              too: bankniiGuilgeeToololt?.todorkhoigui || 0,
              utga: "Тодорхойгүй",
            },
            { too: bankniiGuilgeeToololt?.kholboson || 0, utga: "Холбогдсон" },
            {
              too: bankniiGuilgeeToololt?.magadlaltai || 0,
              utga: "Магадлалтай",
            },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className={`group relative w-[65vw] cursor-pointer overflow-hidden rounded-2xl 
                  transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl 
                  hover:shadow-gray-300 dark:hover:shadow-gray-800 md:col-span-6 md:w-auto lg:col-span-3 ${
                    mur.utga === songogdsonTurul
                      ? "border-2 border-green-500 bg-green-50/60 dark:border-green-900 dark:bg-green-950/40"
                      : "border-2 border-green-200 bg-green-50/60 dark:border-green-900 dark:bg-green-950/40"
                  }`}
                onClick={() => turulSongyo(mur.utga)}
                data-aos="zoom-out-up"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
              >
                <div className="relative h-full w-[65vw] overflow-hidden rounded-2xl sm:w-auto">
                  <div className="absolute inset-0 bg-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                  <div className="relative h-full rounded-2xl p-3 sm:p-2.5">
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <div className="mb-0.5 bg-gradient-to-r from-green-900 to-green-700 bg-clip-text text-3xl font-bold text-transparent dark:from-green-100 dark:to-green-300">
                          {mur.too}
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {t(mur.utga)}
                        </div>
                        <div className="text-2xl text-green-600 dark:text-green-400">
                          {mur.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-500 transition-all duration-500 group-hover:w-full"></div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="mt-5 flex w-full flex-col md:flex-row"
          data-aos="zoom-out-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <div className="md:flex">
            <RangePicker
              className="min-w-max"
              style={{ marginBottom: "20px" }}
              value={ekhlekhOgnoo}
              onChange={setEkhlekhOgnoo}
            />
            {ajiltan?.erkh === "Admin" && (
              <div className="mb-5 ml-4 flex flex-row space-x-2 rounded-md">
                {["orlogo", "zarlaga"].map((text) => (
                  <div
                    className={`cursor-pointer rounded-md p-2 ${
                      khuulgaTurul === text
                        ? "dark bg-green-500 text-gray-50"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                    onClick={() => setKhuulgaTurul(text)}
                  >
                    {t(text === "orlogo" ? "Орлого" : "Зарлага")}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex w-full md:pt-1">
            <div className="mb-1 w-40 md:ml-4">
              <Select
                placeholder={t("Данс")}
                style={{ width: "100%" }}
                onChange={dansSongoy}
                value={songogdsonDans?.dugaar}
              >
                {dansGaralt?.jagsaalt?.map((a) => (
                  <Select.Option key={a.dugaar} value={a.dugaar}>
                    <div>{a.dugaar}</div>
                  </Select.Option>
                ))}
              </Select>
            </div>

            {baiguullaga?._id === "612f457d185280db676d0b51" ||
              (baiguullaga?._id === "695c57511a8a4aebc1d65b02" && (
                <div className="mb-4 ml-3 flex items-center space-x-2">
                  <Input
                    placeholder={t("Тест дүн бичих")}
                    value={garDunFormatted}
                    onChange={(e) => {
                      const inputValue = e.target.value;

                      const numericValue = inputValue.replace(/[^0-9.]/g, "");

                      setGarDun(numericValue);

                      if (numericValue === "" || numericValue === ".") {
                        setGarDunFormatted(numericValue);
                      } else {
                        const parsed = parseFloat(numericValue);
                        if (!isNaN(parsed)) {
                          setGarDunFormatted(formatNumber(parsed, 0));
                        } else {
                          setGarDunFormatted(numericValue);
                        }
                      }
                    }}
                    style={{ width: 220 }}
                  />
                  <Input
                    placeholder={t("Гүйлгээний утга бичих")}
                    value={tailbar}
                    onChange={(e) => { setTailbar(e.target.value); }}
                    style={{ width: 220 }}
                  />
                  <AntButton
                    type="primary"
                    onClick={async () => {
                      if (!songogdsonDans) {
                        notification.warning({ message: t("Данс сонгоно уу") });
                        return;
                      }
                      try {
                        setLoading(true);

                        const bank = songogdsonDans?.bank;
                        const dugaar =
                          bank === "khanbank"
                            ? garDun || ""
                            : bank === "golomt"
                            ? garDun || ""
                            : bank === "bogd"
                            ? garDun || ""
                            : bank === "tran"
                            ? garDun || ""
                            : bank === "tdb"
                            ? garDun || ""
                            : garDun || "";

                        const mungunDun = Number(garDun) || 0;

                        const payload = {
                          tranDate: new Date(),
                          balance: 0,
                          requestId: garDun || undefined,

                          ...(bank === "golomt" ? { tranId: dugaar } : {}),
                          ...(bank === "khanbank" ? { record: dugaar } : {}),
                          ...(bank === "bogd" ? { recNum: dugaar } : {}),
                          ...(bank === "tran" ? { jrno: dugaar } : {}),
                          ...(bank === "tdb"
                            ? {
                                NtryRef: dugaar,
                                TxDt: new Date().toISOString(),
                                TxTime: moment().format("HH:mm"),
                              }
                            : {}),
                          drOrCr: bank === "golomt" ? "Credit" : undefined,
                          tranPostedDate: new Date().toISOString(),
                          tranCrnCode: songogdsonDans?.currency || "MNT",
                          exchRate: 1,
                          accName: songogdsonDans?.accName || "",
                          accNum: songogdsonDans?.dugaar || "",
                          kholbosonGereeniiId: [],
                          kholbosonTalbainId: [],
                          dansniiDugaar: songogdsonDans?.dugaar,
                          bank: songogdsonDans?.bank,
                          baiguullagiinId: baiguullaga?._id,
                          barilgiinId: barilgiinId,
                          indexTalbar:
                            barilgiinId +
                            (songogdsonDans?.bank || "") +
                            (songogdsonDans?.dugaar || "") +
                            (dugaar || "") +
                            mungunDun.toString() +
                            "_" +
                            new Date().getTime(),

                          description: "Тест дүн бичих tailbar",
                        };

                        if (bank === "golomt") payload.tranAmount = mungunDun;
                        else if (bank === "khanbank" || bank === "bogd")
                          payload.amount = mungunDun;
                        else if (bank === "tdb") payload.Amt = mungunDun;
                        else if (bank === "tran") {
                          payload.income = mungunDun;
                          payload.outcome = 0;
                        } else {
                          payload.amount = mungunDun;
                        }

                        const desc = tailbar || `Тест гүйлгээ`;
                        if (bank === "golomt") {
                          payload.tranDesc = desc;
                          // also keep generic description
                          payload.description = desc;
                        } else if (bank === "tdb") {
                          payload.TxAddInf = desc;
                          payload.description = desc;
                        } else if (bank === "khanbank" || bank === "bogd") {
                          payload.description = desc;
                        } else {
                          payload.description = desc;
                        }

                        Object.keys(payload).forEach(
                          (k) => payload[k] === undefined && delete payload[k]
                        );

                        await createMethod("bankniiGuilgee", token, payload);

                        notification.success({
                          message: t("Амжилттай хадгалагдлаа"),
                        });

                        bankniiGuilgeeToololtMutate &&
                          bankniiGuilgeeToololtMutate();
                        dansniiKhuulgaMutate && dansniiKhuulgaMutate();
                        setGarDun("");
                        setGarDunFormatted("");
                      } catch (e) {
                        aldaaBarigch(e);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {t("Хадгалах")}
                  </AntButton>
                </div>
              ))}

            {songogdsonDans && (
              <div className="mb-1 ml-5 flex-row space-x-2 p-1 font-medium md:flex">
                {t("Үлдэгдэл")}:{" "}
                {uldegdel ? (
                  songogdsonDans?.bank === "tdb" &&
                  songogdsonDans?.dugaar?.includes("MN") ? (
                    formatNumber(uldegdel)
                  ) : songogdsonDans?.bank === "tdb" ? (
                    uldegdel
                  ) : (
                    formatNumber(uldegdel)
                  )
                ) : (
                  <Spin />
                )}{" "}
                {songogdsonDans.currency}
              </div>
            )}
          </div>
          <div className="w-full md:flex md:pt-1">
            <div className="ml-auto">
              <Popover
                content={() => (
                  <div className="flex w-32 flex-col">
                    <a
                      className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700"
                      onClick={async () => {
                        try {
                          const response = await uilchilgee(token).get(
                            "/bankniiGuilgee",
                            {
                              params: {
                                order: order,
                                query: {
                                  baiguullagiinId: baiguullaga?._id,
                                  dansniiDugaar: songogdsonDans?.dugaar,
                                  barilgiinId,
                                  [`${
                                    songogdsonDans?.bank === "tdb"
                                      ? "Amt"
                                      : songogdsonDans?.bank === "golomt"
                                      ? "tranAmount"
                                      : "amount"
                                  }`]: { $gt: 0 },
                                  [`${
                                    songogdsonDans?.bank === "tdb"
                                      ? "TxDt"
                                      : "tranDate"
                                  }`]: {
                                    $gte: moment(ekhlekhOgnoo[0]).format(
                                      "YYYY-MM-DD 00:00:00"
                                    ),
                                    $lte: moment(ekhlekhOgnoo[1]).format(
                                      "YYYY-MM-DD 23:59:59"
                                    ),
                                  },
                                  ...query,
                                },
                                khuudasniiKhemjee: 100,
                              },
                            }
                          );
                          const data = response.data?.jagsaalt;
                          const { Excel } = require("antd-table-saveas-excel");
                          const excelExport = new Excel();
                          var baganuud = [];
                          if (songogdsonDans?.bank === "tdb") {
                            baganuud = [
                              {
                                title: t("Огноо"),
                                align: "center",
                                dataIndex: "TxDt",
                                render(date) {
                                  return moment(date).format("YYYY-MM-DD");
                                },
                              },
                              {
                                title: t("Цаг"),
                                dataIndex: "TxTime",
                                render(a) {
                                  if (_.isString(a)) return `${a}`;
                                  return "";
                                },
                              },
                              {
                                title: t("Гүйлгээний утга"),
                                dataIndex: "TxAddInf",
                                __style__: { width: 120 },
                              },
                              {
                                title: t("Гүйлгээний дүн"),
                                dataIndex: "Amt",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render(a) {
                                  return a;
                                },
                              },
                              {
                                title: t("Шилжүүлсэн данс"),
                                dataIndex: "CtAcntOrg",
                                __style__: { h: "center" },
                              },
                              {
                                title: t("Ажилтан"),
                                dataIndex: "burtgesenAjiltaniiNer",
                                __style__: { h: "center" },
                              },
                              {
                                title: t("Талбай"),
                                dataIndex: "kholbosonTalbainId",
                              },
                            ];
                          } else if (
                            songogdsonDans?.bank === "khanbank" ||
                            songogdsonDans?.bank === "bogd" ||
                            songogdsonDans?.bank === "tdb"
                          ) {
                            baganuud = [
                              {
                                title: t("Огноо"),
                                align: "center",
                                dataIndex: "tranDate",
                                render(date) {
                                  return moment(date).format("YYYY-MM-DD");
                                },
                              },
                              {
                                title: t("Цаг"),
                                dataIndex: "time",
                                render(a) {
                                  if (songogdsonDans?.bank === "bogd") return a;
                                  else if (_.isString(a))
                                    return `${a.substring(0, 2)}:${a.substring(
                                      2,
                                      4
                                    )}`;
                                  return "";
                                },
                              },
                              {
                                title: t("Гүйлгээний утга"),
                                dataIndex: "description",
                                __style__: { width: 120 },
                              },
                              {
                                title: t("Гүйлгээний дүн"),
                                dataIndex: "amount",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                              },
                              {
                                title: t("Шилжүүлсэн данс"),
                                dataIndex: "relatedAccount",
                                __style__: { h: "center" },
                              },
                              {
                                title: t("Ажилтан"),
                                dataIndex: "burtgesenAjiltaniiNer",
                                __style__: { h: "center" },
                              },
                              {
                                title: t("Талбай"),
                                dataIndex: "kholbosonTalbainId",
                              },
                            ];
                          } else if (songogdsonDans?.bank === "golomt") {
                            baganuud = [
                              {
                                title: t("Огноо"),
                                dataIndex: "tranPostedDate",
                                render(date) {
                                  return moment(date).format(
                                    "YYYY-MM-DD HH:mm:ss"
                                  );
                                },
                              },
                              {
                                title: t("Цаг"),
                                dataIndex: "TxTime",
                                render(a) {
                                  if (_.isString(a)) return `${a}`;
                                  return "";
                                },
                              },
                              {
                                title: t("Гүйлгээний утга"),
                                dataIndex: "tranDesc",
                                __style__: { width: 120 },
                              },
                              {
                                title: t("Гүйлгээний дүн"),
                                dataIndex: "tranAmount",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                              },
                              {
                                title: t("Шилжүүлсэн данс"),
                                align: "center",
                                dataIndex: "accNum",
                                __style__: { h: "center" },
                              },
                              {
                                title: t("Ажилтан"),
                                dataIndex: "burtgesenAjiltaniiNer",
                                __style__: { h: "center" },
                              },
                              {
                                title: t("Талбай"),
                                dataIndex: "kholbosonTalbainId",
                              },
                            ];
                          }
                          excelExport
                            .addSheet("Дансны хуулга")
                            .addColumns(baganuud)
                            .addDataSource(data)
                            .saveAs("Дансны хуулга.xlsx");
                        } catch (error) {
                          aldaaBarigch(error);
                        }
                      }}
                    >
                      <DownloadOutlined style={{ fontSize: "18px" }} />
                      <label>{t("Татах")}</label>
                    </a>
                  </div>
                )}
                placement="bottom"
                trigger="click"
              >
                <Button
                  type="primary"
                  icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
                >
                  <span>Excel</span>
                  <DownOutlined width={5} />
                </Button>
              </Popover>
            </div>
          </div>
        </div>
        <div
          className="mt-5 overflow-auto "
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="500"
        >
          <Table
            bordered
            size="small"
            scroll={{ y: "calc(100vh - 34rem)" }}
            columns={columns}
            dataSource={dansniiKhuulgaGaralt?.jagsaalt}
            onChange={(p, f, s) => sorterCompare(s, setOrder)}
            pagination={{
              current: dansniiKhuulgaGaralt?.khuudasniiDugaar,
              total: dansniiKhuulgaGaralt?.niitMur,
              pageSizeOptions: [10, 20, 100, 300, 500],
              defaultPageSize: [500],
              showSizeChanger: true,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setDansniiKhuulgaKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            rowKey={(a) => a._id}
            footer={() => (
              <GuilgeeniiDun
                t={t}
                token={token}
                barilgiinId={barilgiinId}
                dansniiDugaar={songogdsonDans?.dugaar}
                ognoo={ekhlekhOgnoo}
                turul={khuulgaTurul}
                baiguullagiinId={baiguullaga?._id}
              />
            )}
          />
        </div>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default tulburTootsoo;
