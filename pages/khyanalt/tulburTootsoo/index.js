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
import useDans from "hooks/useDans";
import formatNumber from "tools/function/formatNumber";
import sorterCompare from "tools/function/sorterCompare";
import useDansKhuulga from "hooks/khuulga/useDansKhuulga";
import useBankniiGuilgeeToololt from "hooks/khuulga/useBankniiGuilgeeToololt";
import GuilgeeKholbokh from "components/pageComponents/tulbur/GuilgeeNiiluulekh";
import ZardalKholbokh from "components/pageComponents/tulbur/ZardalKholbokh";

import _ from "lodash";
import { modal } from "components/ant/Modal";
import Tulbur from "components/pageComponents/eBarimt/Tulbur";
import useUldegdel from "hooks/khuulga/useUldegdel";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
const { RangePicker } = DatePicker;

function iconAvya(a, bank) {
  let Icon = ExclamationOutlined;
  let color = "red";
  let tailbar = t("Гүйлгээ холбогдоогүй байна");
  // if (
  //   bank === "tdb"
  //     ? a?.TxAddInf.includes("QPAY") || a?.TxAddInf.includes("qpay")
  //     : bank === "golomt"
  //     ? a?.tranDesc.includes("QPAY") || a?.tranDesc.includes("qpay")
  //     : a?.description.includes("QPAY") || a?.description.includes("qpay")
  // ) {
  //   Icon = CheckOutlined;
  //   color = "green";
  //   tailbar = t("Гүйлгээ холбогдсон байна");
  // } else
  if (
    (a?.kholbosonDun < a[`${bank === "tdb" ? "Amt" : "amount"}`] &&
      a?.kholbosonDun > 0) ||
    (a?.magadlaltaiGereenuud?.length > 0 &&
      !(a?.kholbosonGereeniiId?.length > 0))
  ) {
    Icon =
      a?.kholbosonDun < a[`${bank === "tdb" ? "Amt" : "amount"}`] &&
      a?.kholbosonDun > 0
        ? TbEqualNot
        : QuestionOutlined;
    color = "yellow";
    tailbar =
      a?.kholbosonDun < a[`${bank === "tdb" ? "Amt" : "amount"}`] &&
      a?.kholbosonDun > 0
        ? `${formatNumber(
            a?.amount - a?.kholbosonDun || a?.Amt - a?.kholbosonDun || 0,
            0
          )} ₮ ${t("дутуу холбогдсон байна")}`
        : "Холбох боломжтой гэрээнүүд байна";
  } else if (
    (a?.kholbosonGereeniiId && a?.kholbosonDun) ||
    0 === a[`${bank === "tdb" ? "Amt" : "amount"}`]
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

function GuilgeeniiDun({ token, dansniiDugaar, barilgiinId, ognoo, turul, t }) {
  const { data } = useSWR(
    !!token && !!dansniiDugaar && !!barilgiinId
      ? [token, dansniiDugaar, barilgiinId, ognoo, turul]
      : null,
    (token, dansniiDugaar, barilgiinId, ognoo, turul) =>
      uilchilgee(token)
        .post("/dansniiKhuulgaDunAvya", {
          dansniiDugaar,
          barilgiinId,
          turul,
          ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
          duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
        })
        .then((a) => a.data)
        .catch(aldaaBarigch)
  );
  return (
    <div className="font-medium dark:bg-gray-900 dark:text-white">
      {t("Гүйлгээний нийт дүн")}: {formatNumber(_.get(data, "0.dun"))}
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
  const { baiguullaga, barilgiinId, ajiltan } = useAuth();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = React.useState([moment(), moment()]);
  const { dansGaralt } = useDans(token, baiguullaga?._id);
  const [songogdsonDans, setSongogdsonDans] = React.useState(null);
  const [songogdsonTurul, setSongogdsonTurul] = React.useState(null);
  const [loading, setLoading] = useState(false);
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
  } = useDansKhuulga(
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
    if (
      (data.kholbosonDun || 0) - (data.amount || data.tranAmount) === 0 ||
      data.balance - (data.kholbosonDun || 0) === 0
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
        message.info(t("Гүйлгээ гэрээнд холбогдсон байна."));
        return;
      }
      const footer = [
        <div className="pr-[1%]">
          <Button onClick={() => refGuilgee.current.khaaya()}>
            {t("Хаах")}
          </Button>
          ,
          <Button
            type="primary"
            onClick={() =>
              !loading && !loadingBaritsaa && refGuilgee.current.khadgalya()
            }
          >
            {t("Хадгалах")}
          </Button>
        </div>,
      ];
      modal({
        title: "",
        width: "50rem",
        icon: <FileExcelOutlined />,
        content: (
          <GuilgeeKholbokh
            dans={songogdsonDans}
            data={data}
            barilgiinId={barilgiinId}
            ref={refGuilgee}
            token={token}
            baiguullagiinId={baiguullaga?._id}
            onFinish={refreshData}
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
      message.info(t("Зардал холбогдсон байна."));
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
          showSorterTooltip: false,
          sorter: {
            compare: () => 0,
            multiple: 1,
          },
        },
        {
          title: t("Цаг"),
          align: "center",
          showSorterTooltip: false,
          sorter: {
            compare: () => 0,
            multiple: 2,
          },
          dataIndex: "TxTime",
          ellipsis: true,
          width: "4rem",
          render(a) {
            if (_.isString(a)) return `${a}`;
            return "";
          },
        },
        {
          title: t("Гүйлгээний утга"),
          width: "20rem",
          align: "center",
          dataIndex: "TxAddInf",
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
          dataIndex: "Amt",
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
          dataIndex: "CtAcntOrg",
          ellipsis: true,
          width: "10rem",
        },
      ];
      if (khuulgaTurul === "orlogo")
        baganuud = [
          ...baganuud,
          {
            title: t("Төлөв"),
            width: "4rem",
            align: "center",
            render(a) {
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
              if (data.length > 1) {
                return (
                  <Tooltip
                    placement="top"
                    title={
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
          title: t("Шилжүүлсэн данс"),
          align: "center",
          dataIndex: "relatedAccount",
          ellipsis: true,
          width: "10rem",
        },
      ];
      if (khuulgaTurul === "orlogo")
        baganuud = [
          ...baganuud,
          {
            title: "Төлөв",
            width: "4rem",
            align: "center",
            render(a) {
              return (
                <div className="flex items-center justify-center">
                  <Button
                    shape="circle"
                    size="small"
                    onClick={() => guilgeeKholbyo(a)}
                    icon={iconAvya(a)}
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
          },
          {
            title: "НӨАТУС",
            width: "4.5rem",
            align: "center",
            render(a) {
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
      ];
      if (khuulgaTurul === "orlogo")
        baganuud = [
          ...baganuud,
          {
            title: t("Төлөв"),
            width: "4rem",
            align: "center",
            render(a) {
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
              if (data.length > 1) {
                return (
                  <Tooltip
                    placement="top"
                    title={
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
      onSearch={(search) => {
        setDansniiKhuulgaKhuudaslalt((a) => ({
          ...a,
          search,
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
                className={`zoom-in col-span-12 cursor-pointer rounded-xl border-2 border-green-600 md:col-span-6 lg:col-span-3 ${
                  mur.utga === songogdsonTurul
                    ? "bg-green-50 dark:bg-gray-900"
                    : ""
                }`}
                onClick={() => turulSongyo(mur.utga)}
                data-aos="zoom-out-up"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
              >
                <div className="h-full w-[65vw] rounded-xl sm:w-auto">
                  <div className="rounded-xl p-3">
                    <div className="flex">
                      <div>
                        <div className="text-3xl font-bold text-green-600">
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {t(mur.utga)}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-2xl text-green-600">
                          {mur.icon}
                        </div>
                      </div>
                    </div>
                  </div>
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
                      onClick={() => {
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
                              title: t("Талбай"),
                              dataIndex: "kholbosonTalbainId",
                            },
                          ];
                        } else if (
                          songogdsonDans?.bank === "khanbank" ||
                          songogdsonDans?.bank === "bogd"
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
                              title: t("Талбай"),
                              dataIndex: "kholbosonTalbainId",
                            },
                          ];
                        }
                        excelExport
                          .addSheet("Дансны хуулга")
                          .addColumns(baganuud)
                          .addDataSource(dansniiKhuulgaGaralt?.jagsaalt)
                          .saveAs("Дансны хуулга.xlsx");
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
              pageSize: dansniiKhuulgaGaralt?.khuudasniiKhemjee,
              total: dansniiKhuulgaGaralt?.niitMur,
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
