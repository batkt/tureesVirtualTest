//#region imports
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee from "services/uilchilgee";
import Admin from "components/Admin";
import React, { useMemo, useState, useEffect } from "react";

import { useAuth } from "services/auth";
import {
  Card,
  Table,
  Button,
  DatePicker,
  Spin,
  Tooltip,
  Progress,
  Select,
  Popover,
  Space,
  notification,
} from "antd";
import {
  FileExcelOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  DownOutlined,
  PrinterOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import useOrder from "tools/function/useOrder";

import NekhemjlelIlgeekh from "components/pageComponents/tulbur/NekhemjlelIlgeekh";
import MedegdelIlgeekh from "components/pageComponents/tulbur/MedegdelIlgeekh";
import GuilgeeKhiikh from "components/pageComponents/tulbur/GuilgeeKhiikh";
import OnlyFcGuilgeeExcelees from "components/pageComponents/tulbur/onlyFcGuilgeeExcelees";
import GuilgeeExceleesOruulakhOlnoor from "components/pageComponents/tulbur/GuilgeeExceleesOruulakhOlnoor";
import GuilgeeEkhniiUldegdelExceleesOruulakhOlnoor from "components/pageComponents/tulbur/GuilgeeEkhniiUldegdelExceleesOruulakhOlnoor";
import BaritsaaUdirdlaga from "components/pageComponents/tulbur/BaritsaaUdirdlaga";
import _ from "lodash";
import { modal } from "components/ant/Modal";
import useGuilgeeniiToololtAvya from "hooks/tulburTootsoo/useGuilgeeniiToololtAvya";
import { useTuluugiiGereeniiToololtAvya } from "hooks/tulburTootsoo/useGuilgeeniiToololtAvya";
import useSWR, { mutate } from "swr";
import GuilgeenTuukhTile from "components/pageComponents/tulbur/GuilgeeTuukhTile";
import CardList from "components/cardList";
import Aos from "aos";
import BaganiinSongolt from "components/table/BaganiinSongolt";
import useJagsaalt from "hooks/useJagsaalt";
import useEneSardTuluuguiGereenuudAvya from "hooks/tulburTootsoo/useEneSardTuluuguiGereenuudAvya";
import Khuulga from "components/pageComponents/tulbur/Khuulga";
import KhuulgaAldangi from "components/pageComponents/tulbur/KhuulgaAldangi";
import { useTranslation } from "react-i18next";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import NekhemjlekhiinTuukhTsonkh from "components/pageComponents/tulbur/NekhemjlekhiinTuukhTsonkh";

//#endregion

function GereeniiUldegdel({ ugugdul, token, ognoo, tsutsalsanTurul }) {
  const { barilgiinId } = useAuth();
  const { data, mutate, isValidating } = useSWR(
    !!ugugdul?.gereeniiDugaar && !!barilgiinId
      ? [
          "/uldegdelBodyo",
          barilgiinId,
          ugugdul?.gereeniiDugaar,
          ognoo,
          tsutsalsanTurul,
        ]
      : null,
    (url, barilgiinId, gereeniiDugaar, ognoo) =>
      uilchilgee(token)
        .post(url, { barilgiinId, gereeniiDugaar, ognoo, tsutsalsanTurul })
        .then(({ data }) => data),
    {
      revalidateOnFocus: false,
    }
  );
  ugugdul.uldegdel = data?.uldegdel;
  ugugdul.mutate = mutate;
  return (
    <div
      className={`text-right font-medium ${
        data?.uldegdel > 0 ? "text-red-500" : "text-green-500"
      }`}
    >
      {isValidating ? <Spin size="small" /> : formatNumber(data?.uldegdel, 2)}
    </div>
  );
}

function TableGuilgee({
  columns,
  garalt,
  setKhuudaslalt,
  setLoadingIndex,
  onChange,
}) {
  function UilgelAvya({ garalt, columns }) {
    const [uldegdel, setUldegdel] = useState(0);
    useEffect(() => {
      setTimeout(() => {
        setUldegdel(uldegdel + 1);
      }, 500);
    }, [garalt, setLoadingIndex, columns]);

    return (
      <Table.Summary.Row>
        {columns.map((mur, index) => (
          <Table.Summary.Cell
            className={`${mur.summary !== true ? "border-none" : "font-bold"}`}
            index={index}
            align="right"
          >
            {mur.summary
              ? mur.dataIndex === "avlagiinUldegdel"
                ? formatNumber(
                    garalt?.jagsaalt?.reduce(
                      (a, b) =>
                        a +
                        (parseFloat(b["uldegdel"]) || 0) +
                        (parseFloat(b["aldangiinUldegdel"]) || 0),
                      0
                    )
                  )
                : formatNumber(
                    garalt?.jagsaalt?.reduce(
                      (a, b) => a + (parseFloat(b[mur.dataIndex]) || 0),
                      0
                    )
                  )
              : ""}
          </Table.Summary.Cell>
        ))}
      </Table.Summary.Row>
    );
  }
  return (
    <Table
      scroll={{ y: "calc(100vh - 32rem)" }}
      size="small"
      bordered
      columns={columns}
      loading={!garalt}
      dataSource={garalt?.jagsaalt}
      rowKey={(a) => a._id}
      className="t-head"
      onChange={onChange}
      rowClassName={(record, index) =>
        index % 2 === 0
          ? "bg-white dark:bg-gray-600"
          : "bg-gray-200 dark:bg-gray-800"
      }
      pagination={{
        current: garalt?.khuudasniiDugaar,
        total: garalt?.niitMur,
        pageSizeOptions: [100, 300, 500],
        defaultPageSize: [500],
        showSizeChanger: true,
        onChange: (khuudasniiDugaar, khuudasniiKhemjee) => {
          setLoadingIndex(0);
          setKhuudaslalt((kh) => ({
            ...kh,
            khuudasniiDugaar,
            khuudasniiKhemjee,
          }));
        },
      }}
      summary={() => (
        <Table.Summary fixed>
          {" "}
          <UilgelAvya garalt={garalt} columns={columns} />{" "}
        </Table.Summary>
      )}
    />
  );
}

const searchKeys = [
  "register",
  "customerTin",
  "talbainDugaar",
  "gereeniiDugaar",
  "utas",
  "ovog",
  "ner",
];

function guilgeeniiTuukh({ token }) {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    Aos.init({ once: true });
  });
  //#region state
  const ref = React.useRef(null);
  const excelref = React.useRef();
  const baritsaaref = React.useRef(null);
  const { baiguullaga, barilgiinId, ajiltan } = useAuth();
  const [ognoo, setOgnoo] = React.useState([
    moment(moment().startOf("month").format("YYYY-MM-DD 00:00:00")),
    moment(moment().endOf("month").format("YYYY-MM-DD 23:59:59")),
  ]);
  const [tulukhOgnoo, setTulukhOgnoo] = React.useState();
  const [turul, setTurul] = React.useState("");
  const [neesenEsekh, setNeesenEsekh] = useState(false);
  const [loadingIndex, setLoadingIndex] = React.useState(0);
  const [davkhar, setDavkhar] = React.useState(undefined);
  const { guilgeeniiToololt, guilgeeniiToololtMutate } =
    useGuilgeeniiToololtAvya(token, ognoo, barilgiinId);
  const { tolooguiGereeniiToo, tolooguiGereeniiTooMutate } =
    useTuluugiiGereeniiToololtAvya(token, ognoo);

  const { order, onChangeTable } = useOrder();
  const [shineBagana, setShineBagana] = useState([]);
  function khusnegtOrderChange(r, o, s) {
    if (!JSON.stringify(s).includes("uldegdel")) onChangeTable(r, o, s);
  }

  const { sericeName, query, turulColumns } = React.useMemo(() => {
    let sericeName = "/geree";
    let query = {};
    let turulColumns = [];
    let ekhlekhOgnoo = moment(ognoo && ognoo[0])
      .startOf("month")
      .format("YYYY-MM-DD 00:00:00");
    let duusakhOgnoo = moment(ognoo && ognoo[1])
      .endOf("month")
      .format("YYYY-MM-DD 23:59:59");
    switch (turul) {
      case "voucher":
        sericeName = `/vouchertaiJagsaaltAvya/${ekhlekhOgnoo}/${duusakhOgnoo}`;
        turulColumns.push({
          dataIndex: "voucherDun",
          title: t("Ваучерын дүн"),
          width: "7rem",
          summary: true,
          align: "center",
          render: (v) => (
            <div className="w-full text-right">{formatNumber(v)}</div>
          ),
        });
        break;
      case "khungulult":
        sericeName = `/khungulultteiJagsaaltAvya/${ekhlekhOgnoo}/${duusakhOgnoo}`;
        turulColumns.push({
          dataIndex: "khungulult",
          title: t("Хөнгөлөлт"),
          summary: true,
          width: "6rem",
          align: "center",
          render: (v) => (
            <div className="w-full text-right">{formatNumber(v)}</div>
          ),
        });
        break;
      case "eneSardTulsun":
        sericeName = `/guitsetgelteiJagsaaltAvya/${ekhlekhOgnoo}/${duusakhOgnoo}`;
        turulColumns.push({
          dataIndex: "tulsunDun",
          title: t("Төлсөн дүн"),
          summary: true,
          width: "7rem",
          align: "center",
          render: (v) => (
            <div className="w-full text-right">{formatNumber(v)}</div>
          ),
        });
        break;
      default:
        break;
    }

    if (turul === "avlaga") {
      query = {
        "avlaga.guilgeenuud.ognoo": {
          $lte: duusakhOgnoo,
        },
        davkhar,
        baiguullagiinId: baiguullaga._id,
        tuluv: {
          $ne: -1,
        },
        barilgiinId,
      };
    } else if (turul === "tsutslagdsanAvlaga")
      query = {
        baiguullagiinId: baiguullaga._id,
        davkhar,
        tuluv: -1,
        barilgiinId,
      };
    else if (turul === "eneSardTulukh") {
      sericeName = null;
      query = {
        davkhar,
      };
    } else
      query = {
        davkhar,
        baiguullagiinId: baiguullaga?._id,
        barilgiinId,
        tuluv: {
          $ne: -1,
        },
      };
    if (query && !!tulukhOgnoo) {
      query.daraagiinTulukhOgnoo = {
        $lte: tulukhOgnoo.format("YYYY-MM-DD 23:59:59"),
        $gte: tulukhOgnoo.format("YYYY-MM-DD 00:00:00"),
      };
    }
    return { sericeName, query, turulColumns };
  }, [turul, ognoo, davkhar, barilgiinId, tulukhOgnoo, t]);
  useEffect(() => {
    setShineBagana([]);
  }, [i18n.language]);
  const {
    data,
    mutate,
    onSearch: onSearchMedeelel,
    setKhuudaslalt,
    isValidating,
  } = useJagsaalt(sericeName, query, order, undefined, searchKeys, null, 500);

  const { eneSardTuluuguiGereenuud, setEneSardTuluuguiGereenuud } =
    useEneSardTuluuguiGereenuudAvya(
      turul === "eneSardTulukh" && token,
      ognoo,
      query
    );


  const { gereeniiMedeelel, onSearch } = useMemo(() => {
    return {
      gereeniiMedeelel:
        turul === "eneSardTulukh" ? eneSardTuluuguiGereenuud : data,
      onSearch: (search) => {
        onSearchMedeelel(search);
        setEneSardTuluuguiGereenuud((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
      },
    };
  }, [
    turul,
    eneSardTuluuguiGereenuud,
    data,
    onSearchMedeelel,
    setEneSardTuluuguiGereenuud,
  ]);

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        width: "2.5rem",
        align: "center",
        render: (text, record, index) => index + 1,
      },
      {
        width: "7rem",
        align: "center",
        title: t("Регистр"),
        dataIndex: "register",
      },
      {
        width: "7rem",
        align: "center",
        title: t("Бүртгэлийн дугаар"),
        dataIndex: "customerTin",
      },
      {
        title: t("Талбай"),
        dataIndex: "talbainDugaar",
        ellipsis: true,
        align: "center",
        width: "5rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Утас"),
        dataIndex: "utas",
        ellipsis: true,
        align: "center",
        width: "7rem",
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
        title: t("Үлдэгдэл"),
        width: "calc(18rem - 10rem)",
        dataIndex: "uldegdel",
        align: "center",
        summary: true,
        render(text, record, index) {
          return (
            <GereeniiUldegdel
              tsutsalsanTurul={turul === "tsutslagdsanAvlaga"}
              token={token}
              ugugdul={record}
              index={index}
              show={index === loadingIndex}
              setLoadingIndex={setLoadingIndex}
              urt={gereeniiMedeelel?.jagsaalt?.length}
              ognoo={ognoo}
            />
          );
        },
        showSorterTooltip: false,
        sorter: (a, b) => Number(a.uldegdel || 0) - Number(b.uldegdel || 0),
      },
      {
        width: "9rem",
        align: "center",
        excelHeader: t("Төлөх огноо"),
        title: () => (
          <div className="flex justify-center">
            <div
              className=" flex w-full
             justify-end"
            >
              {t("Төлөх огноо")}
            </div>
            <div className="flex h-full w-[50%] items-center justify-end">
              <Popover
                placement="bottom"
                trigger="click"
                Tooltip={false}
                content={() => (
                  <div>
                    <DatePicker
                      allowClear
                      onChange={(v) => {
                        setTulukhOgnoo(v);
                        setLoadingIndex(0);
                      }}
                      placeholder="Төлөх Огноо Хайх"
                    />
                  </div>
                )}
              >
                <a className="hover:scale-150 ">
                  <FilterOutlined className="text-lg text-green-600" />
                </a>
              </Popover>
            </div>
          </div>
        ),
        dataIndex: "daraagiinTulukhOgnoo",
        render(a) {
          return moment(a).format("YYYY-MM-DD");
        },
        sorter: false,
      },
    ];

    if (turul == "eneSardTulukh") {
      jagsaalt.push({
        title: t("Төлөвлөгөөт"),
        dataIndex: "tuluvluguut",
        align: "center",
        summary: true,
        render: (tuluvluguut) => {
          return (
            <div className="w-full text-right">
              {formatNumber(tuluvluguut || 0)}
            </div>
          );
        },
        ellipsis: true,
        width: "7rem",
      });
    }

    return [
      ...jagsaalt,
      ...shineBagana,
      ...turulColumns,
      {
        title: t("Үйлдэл"),
        width: "10rem",
        align: "center",
        dataIndex: "baritsaaniiUldegdel",
        ellipsis: true,
        render: (text, row) => {
          const khuvi =
            row.baritsaaAvakhDun > 0
              ? (100 * row.baritsaaniiUldegdel) / row.baritsaaAvakhDun
              : 100;

          let strokeColor = "rgba(16, 185, 129,1)";
          if (khuvi < 0) strokeColor = "rgba(245, 158, 18,1)";

          const khuviAldangi =
            row.aldangiinUldegdel > 0
              ? (100 * row.tulsunAldangi) / row.aldangiinUldegdel
              : 100;

          let strokeColorAldangi = "rgba(16, 185, 129,1)";
          if (khuviAldangi < 0) strokeColorAldangi = "rgba(245, 158, 18,1)";

          return (
            <div className="flex w-full flex-row items-center justify-center  divide-x-2 ">
              
              <a
                onClick={() => nekhemjleliinTuukhKharakh(row)}
                className=" text-green-500 hover:scale-110"
              >
                <Tooltip
                  title={t("Нэхэмжлэлийн түүх харах")}
                  className="flex w-full items-center  justify-center px-[6px] "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-folder d-block mx-auto"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </Tooltip>
              </a>
              <a
                onClick={() => khuulgaKharya(row)}
                className="fill-current  text-green-500 hover:scale-110"
              >
                <Tooltip
                  title={t("Хуулга")}
                  className="flex w-full items-center  justify-center px-[6px] "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </Tooltip>
              </a>
              <a
                onClick={() => aldangiinKhuulgaKharya(row)}
                className="fill-current  text-green-500 hover:scale-110"
              >
                <Tooltip
                  title={t("Алдангийн хуулга")}
                  className="flex w-full items-center  justify-center px-[6px] "
                >
                  <LiaMoneyCheckAltSolid className="text-[30px] text-green-500" />
                </Tooltip>
              </a>
              <a
                onClick={() => guilgeeKhiiya(row)}
                className="fill-current  text-green-500  hover:scale-125"
              >
                <Tooltip
                  title={t("Гүйлгээ хийх")}
                  className="flex w-full items-center  justify-center px-[6px] "
                >
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 440.000000 377.000000"
                    preserveAspectRatio="xMidYMid meet"
                    className="h-6 w-8 fill-current  text-green-500"
                  >
                    <g transform="translate(0.000000,377.000000) scale(0.100000,-0.100000)">
                      <path
                        d="M3080 3510 c-52 -14 -88 -40 -106 -77 -17 -34 -19 -67 -22 -285 l-3
                    -248 -549 0 c-418 0 -556 -3 -577 -12 -45 -21 -71 -48 -89 -94 -14 -36 -14
                    -48 -4 -81 20 -58 37 -80 86 -102 43 -21 56 -21 674 -21 545 0 636 2 667 15
                    87 37 103 75 103 246 0 71 3 129 7 129 10 0 693 -683 693 -693 0 -12 -678
                    -687 -690 -687 -6 0 -10 49 -10 130 0 133 -4 150 -44 198 -47 54 -10 52 -938
                    52 l-858 0 0 238 c0 227 -1 240 -22 282 -41 80 -119 110 -199 76 -36 -16
                    -1128 -1102 -1148 -1143 -14 -28 -14 -108 0 -136 6 -12 261 -273 568 -580 632
                    -634 603 -610 704 -564 88 40 91 54 95 350 l3 247 548 0 c581 0 591 1 633 47
                    10 10 25 36 33 58 32 75 -18 168 -102 193 -29 9 -209 12 -662 12 -537 0 -627
                    -2 -658 -15 -86 -36 -103 -76 -103 -241 0 -91 -3 -124 -12 -124 -13 0 -688
                    670 -688 682 0 12 678 688 690 688 6 0 10 -47 10 -124 0 -131 7 -166 43 -204
                    50 -53 24 -52 943 -52 l854 0 0 -236 c0 -215 2 -239 21 -283 14 -34 31 -54 58
                    -69 42 -24 109 -29 144 -11 28 14 1089 1071 1128 1123 23 31 29 50 29 88 0 27
                    -6 61 -14 76 -8 15 -266 277 -573 583 -488 486 -563 558 -598 566 -22 5 -51 6
                    -65 3z"
                      />
                    </g>
                  </svg>
                </Tooltip>
              </a>
              <div
                className=" text-red-500  hover:scale-110"
                onClick={() => baritsaaUdirdya(row)}
              >
                <Tooltip
                  className="flex w-full items-center  justify-center px-[6px] "
                  title={
                    khuvi < 100
                      ? t("Барьцаа дутуу", {
                          too: formatNumber(
                            (row.baritsaaAvakhDun || 0) -
                              (row.baritsaaniiUldegdel || 0)
                          ),
                        })
                      : `${formatNumber(row.baritsaaniiUldegdel)} ${t(
                          "барьцаа төлөгдсөн байна"
                        )}`
                  }
                >
                  <Progress
                    type="circle"
                    percent={1 > khuvi ? khuvi?.toFixed(1) : khuvi?.toFixed(0)}
                    width={22}
                    strokeColor={strokeColor}
                    trailColor={khuvi === 0 && "rgba(239, 68, 68,1)"}
                  />
                </Tooltip>
              </div>
            </div>
          );
        },
        sorter: () => 0,
        showSorterTooltip: false,
      },
    ];
  }, [gereeniiMedeelel, loadingIndex, shineBagana, turulColumns, t]);

  //#endregion
  //#region handlers
  function onChangeTurul(turul) {
    setTurul(turul);
    setKhuudaslalt((a) => ({ ...a, khuudasniiDugaar: 1 }));
  }

  function refreshData() {
    setTimeout(() => {
      tolooguiGereeniiTooMutate();
      guilgeeniiToololtMutate();
      setKhuudaslalt((a) => {
        a.jagsaalt = [];
        return { ...a };
      });
      mutate();
    }, 500);
  }

  function baritsaaUdirdya(data) {
    var baritsaaUdirdanKhadgalyaaId = "baritsaaUdirdanKhadgalyaaId";
    const footer = [
      <Button onClick={() => baritsaaref.current.khaaya()}>{t("Хаах")}</Button>,
      <Button
        type="primary"
        id={baritsaaUdirdanKhadgalyaaId}
        onClick={() => baritsaaref.current.khadgalya()}
      >
        {t("Хадгалах")}
      </Button>,
    ];
    modal({
      title: t("Барьцаа"),
      icon: <FileExcelOutlined />,
      content: (
        <BaritsaaUdirdlaga
          data={data}
          baritsaaUdirdanKhadgalyaaId={baritsaaUdirdanKhadgalyaaId}
          ref={baritsaaref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }

  function guilgeeKhiiya(data) {
    if (
      ajiltan?.erkh !== "Admin" &&
      !_.get(ajiltan, `tokhirgoo.guilgeeKhiikhEsekh`)?.find(
        (a) => a === data.barilgiinId
      )
    ) {
      notification.warning({
        message: t("Таньд гүйлгээ хийх эрх байхгүй байна."),
      });
      return;
    }
    function refresh() {
      setTimeout(() => data.mutate && data.mutate(), 500);
      refreshData();
    }
    var khadgalyaButtonId = "khadgalyaButtonId";
    const footer = [
      <Button type="default" onClick={() => ref.current.khaaya()}>
       {t("Хаах")}
      </Button>,
      <Button
        type="primary"
        id={khadgalyaButtonId}
        onClick={() => ref.current.khadgalya()}
      >
        {t("Хадгалах")}
      </Button>,
    ];
    modal({
      title: t("Гүйлгээ хийх"),
      icon: <FileExcelOutlined />,
      width: "650px",
      content: (
        <GuilgeeKhiikh
          khadgalyaButtonId={khadgalyaButtonId}
          data={data}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          barilgiinId={barilgiinId}
          onFinish={refresh}
          date={ognoo}
          baiguullaga={baiguullaga}
        />
      ),
      footer,
    });
  }

  function nekhemjlelIlgeekh(data) {
    modal({
      title: t("Нэхэмжлэл илгээх"),
      icon: <FileExcelOutlined />,
      content: (
        <NekhemjlelIlgeekh
          t={t}
          data={data}
          ref={ref}
          token={token}
          onFinish={refreshData}
          ajiltan={ajiltan}
          baiguullaga={baiguullaga}
        />
      ),
      footer: [],
    });
  }

  function nekhemjleliinTuukhKharakh(data) {
    const footer = [
      <Button
        type="primary"
        onClick={() => ref.current.khevlekh()}
        icon={<PrinterOutlined />}
      >
        {t("Хэвлэх")}
      </Button>,
      <Button
        onClick={() => ref.current.khaaya()}
        icon={<CloseCircleOutlined />}
      >
        {t("Хаах")}
      </Button>,
    ];
    modal({
      title: (
        <div className=" flex w-full justify-between">
          {t("Нэхэмжлэлийн түүх")}
        </div>
      ),
      icon: <FileExcelOutlined />,
      width: "90vw",
      style: { top: 20 },
      content: (
        <NekhemjlekhiinTuukhTsonkh
          baiguullaga={baiguullaga}
          data={data}
          ajiltan={ajiltan}
          barilgiinId={barilgiinId}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          ognoo={ognoo}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }

  function medegdelIlgeekh(data) {
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <MedegdelIlgeekh
          data={data}
          ref={ref}
          token={token}
          onFinish={refreshData}
        />
      ),
      footer: [],
    });
  }

  function khuulgaKharya(data) {
    const footer = [
      // <Button
      //   type="primary"
      //   onClick={() => ref.current.excelTatakh()}
      //   icon={<FileExcelOutlined />}
      // >
      //   {t("Татах")}
      // </Button>,
      <Button
        type="primary"
        onClick={() => ref.current.khevlekh()}
        icon={<PrinterOutlined />}
      >
        {t("Хэвлэх")}
      </Button>,
      <Button
        onClick={() => ref.current.khaaya()}
        icon={<CloseCircleOutlined />}
      >
        {t("Хаах")}
      </Button>,
    ];
    modal({
      title: (
        <div className="relative flex w-full justify-between">
          {t("Хуулга")}
        </div>
      ),
      icon: <FileExcelOutlined />,
      width: "90vw",
      style: { top: 20 },
      content: (
        <Khuulga
          data={data}
          ajiltan={ajiltan}
          barilgiinId={barilgiinId}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          ognoo={ognoo}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }

  function aldangiinKhuulgaKharya(data) {
    const footer = [
      <Button
        type="primary"
        onClick={() => ref.current.khevlekh()}
        icon={<PrinterOutlined />}
      >
        {t("Хэвлэх")}
      </Button>,
      <Button
        onClick={() => ref.current.khaaya()}
        icon={<CloseCircleOutlined />}
      >
        {t("Хаах")}
      </Button>,
    ];
    modal({
      title: (
        <div className="relative flex w-full justify-between">
          {t("Алдангийн хуулга")}
        </div>
      ),
      icon: <FileExcelOutlined />,
      width: "68vw",
      style: { top: 20 },
      content: (
        <KhuulgaAldangi
          data={data}
          ajiltan={ajiltan}
          barilgiinId={barilgiinId}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          ognoo={ognoo}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }

  function refresh() {
    // gereeniiMedeelelMutate();
    // gereeToolloltMutate();
  }

  function olnoorGuilgeeOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GuilgeeExceleesOruulakhOlnoor
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          baiguullaga={baiguullaga}
          onFinish={refresh}
          zam="tooluurZaaltOruulya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Гүйлгээний загвар excel файл"
          zagvariinZam="tooluurZaaltZagvarAvya"
        />
      ),
      footer,
    });
  }
  function olnoorGuilgeeOruulakhExcelFc() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
      </Space>,
    ];
    modal({
      width: "800px",
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <OnlyFcGuilgeeExcelees
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          baiguullaga={baiguullaga}
          onFinish={refresh}
          zam="tooluurZaaltOruulya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Гүйлгээний загвар excel файл"
          zagvariinZam="tooluurZaaltZagvarAvya"
        />
      ),
      bodyStyle: {
        maxHeight: "80vh",
        overflowY: "auto",
        paddingRight: "12px",
      },
      footer,
    });
  }

  // function olnoorGuilgeeoruulahExcelFc({ baiguullaga }) {
  //   useEffect(() => {
  //     if (baiguullaga === "foodcity") {
  //       showModal();
  //     } else {
  //       closeModal();
  //     }
  //   }, [baiguullaga]);

  //   const showModal = () => {
  //     modal({
  //       title: "",
  //       icon: <FileExcelOutlined />,
  //       content: (
  //         <GuilgeeExceleesOruulakhOlnoor
  //           ref={excelref}
  //           token={token}
  //           barilgiinId={barilgiinId}
  //           baiguullaga={baiguullaga}
  //           onFinish={refresh}
  //           zam="tooluurZaaltOruulya"
  //           garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
  //           tailbar="Гүйлгээний загвар excel файл"
  //           zagvariinZam="tooluurZaaltZagvarAvya"
  //         />
  //       ),
  //       footer: (
  //         <Space>
  //           <Button onClick={() => excelref.current.khaaya()}>
  //             {t("Хаах")}
  //           </Button>
  //         </Space>
  //       ),
  //     });
  //   };

  //   const closeModal = () => {
  //     modal.destroy();
  //   };

  //   return null;
  // }

  //#region Medeeleltatya
  function olnoorEkhniiUldegdelOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GuilgeeEkhniiUldegdelExceleesOruulakhOlnoor
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          baiguullaga={baiguullaga}
          onFinish={refresh}
          zam="ekhniiUldegdelOruulya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Эхний үлдэгдэл excel файл"
          zagvariinZam="ekhniiUldegdelZagvarOruulya"
        />
      ),
      footer,
    });
  }

  const excelColumns = useMemo(() => {
    var forExcel = [];
    columns.forEach((a) => {
      var title = a.title;
      var dataIndex = a.dataIndex;
      const render = a.render;
      if (a.title !== "№" && a.title !== "Үйлдэл") {
        a.dataIndex === "daraagiinTulukhOgnoo" ||
        a.dataIndex === "gereeniiOgnoo"
          ? forExcel.push({
              title: a.excelHeader || a.title,
              dataIndex,
              render,
            })
          : a.dataIndex === "uldegdel" ||
            a.dataIndex === "voucherDun" ||
            a.dataIndex === "khungulult" ||
            a.dataIndex === "tulsunDun" ||
            a.dataIndex === "tuluvluguut" ||
            a.dataIndex === "sariinTurees" ||
            a.dataIndex === "talbainNiitUne" ||
            a.dataIndex === "aldangiinUldegdel" ||
            a.dataIndex === "baritsaaAvakhDun" ||
            a.dataIndex === "baritsaaniiUldegdel"
          ? forExcel.push({
              title: a.excelHeader || a.title,
              __numFmt__: "#,##0.00",
              __cellType__: "TypeNumeric",
              dataIndex,
              render: (val, data) => {
                return a.dataIndex === "baritsaaAvakhDun"
                  ? (val || 0) - (data?.baritsaaniiUldegdel || 0)
                  : val;
              },
            })
          : forExcel.push({ title: a.excelHeader || a.title, dataIndex });
      }
    });
    return forExcel;
  }, [columns]);

  //#endregion

  return (
    <Admin
      title="Гүйлгээний түүх"
      khuudasniiNer="guilgeeniiTuukh"
      className="p-0 md:p-4"
      onSearch={onSearch}
      tsonkhniiId="61c2c6bc1c2830c4e6f90cb5"
      loading={isValidating}
      setNeesenEsekh={setNeesenEsekh}
    >
      <Card className="cardgrid col-span-12">
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:py-2 md:gap-6 2xl:grid-cols-12">
          {[
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "avlaga.0.dun") || 0,
                0
              ),
              selectedColor: "bg-green-50 dark:bg-gray-900",
              turul: "avlaga",
              utga: "Хуримтлагдсан авлага",
              tailbar:
                "Өмнө сарын төлбөрийн үлдэгдлүүдийн нийлбэр болон энэ сарын тооцоо болно.",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "voucher.0.dun") || 0,
                0
              ),
              selectedColor: "bg-green-50 dark:bg-gray-900",
              turul: "voucher",
              utga: "Ваучер төлөлт",
              tailbar: "Огноонд хамаарагдах бүх Ваучер төлөлтийн нийлбэр дүн",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "tsutslagdsanAvlaga.0.dun") || 0,
                0
              ),
              turul: "tsutslagdsanAvlaga",
              selectedColor: "bg-green-50 dark:bg-gray-900",
              utga: "Цуцлагдсан гэрээний авлага",
              tailbar: "Идэвхигүй буюу цуцлагдсан гэрээний нийт авлага",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "eneSardTulukh.0.dun") || 0,
                0
              ),
              turul: "eneSardTulukh",
              selectedColor: "bg-green-50 dark:bg-gray-900",
              utga: "Төлөвлөгөө / сар",
              tailbar: "Энэ сард төлөгдвөл зохих нийт дүн",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "eneSardTulsun.0.dun") || 0,
                0
              ),
              turul: "eneSardTulsun",
              selectedColor: "bg-green-50 dark:bg-gray-900",
              utga: "Гүйцэтгэл / сар",
              tailbar: "Огноонд хамаарагдах бүх төлөгдсөн дүнгийн нийлбэр",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "khungulult.0.dun") || 0,
                0
              ),
              turul: "khungulult",
              selectedColor: "bg-green-50 dark:bg-gray-900",
              utga: "Хөнгөлөлт / сар",
              tailbar: "Огноонд хамаарагдах бүх хөнгөлөлтийн дүнгийн нийлбэр",
            },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className={`zoom-in col-span-12 cursor-pointer rounded-xl border-2 border-green-600 hover:bg-green-600 hover:bg-opacity-25 sm:col-span-12 lg:col-span-2 ${
                  turul === mur?.turul ? mur.selectedColor : ""
                }`}
                onClick={() => onChangeTurul(mur?.turul)}
                data-aos="zoom-out-up"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
              >
                <Tooltip title={<div>{t(mur.tailbar)}</div>}>
                  <div className="h-full w-[65vw] rounded-xl sm:w-auto">
                    <div className="rounded-xl p-3">
                      <div className="flex">
                        <div>
                          <div className="text-xl font-bold text-green-600">
                            {mur.too}
                          </div>
                          <div className="text-base text-gray-500">
                            {t(mur.utga)}
                          </div>
                        </div>
                        <div className="ml-auto flex flex-col text-center">
                          {mur.turul === "eneSardTulukh" && (
                            <>
                              <div className="flex justify-center text-xl">
                                <ExclamationCircleOutlined
                                  style={{
                                    fontSize: "24px",
                                    color: "red",
                                  }}
                                />
                              </div>
                              <div className="text-xl font-bold text-red-500">
                                {tolooguiGereeniiToo?.too}
                              </div>
                            </>
                          )}
                          <div className="text-xl text-green-600">
                            {mur.icon}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>
        <div
          className="mt-5 flex w-full flex-col-reverse gap-5 md:flex-row"
          data-aos="zoom-in-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <div className="flex">
            <DatePicker.RangePicker
              picker="month"
              value={ognoo}
              onChange={(v) => {
                setOgnoo(v);
                setLoadingIndex(0);
              }}
              clearIcon={false}
            />
            <div className="ml-5">
              <Select
                placeholder={t("Давхар")}
                onChange={setDavkhar}
                allowClear
              >
                {baiguullaga?.barilguud
                  ?.find((a) => a._id === barilgiinId)
                  ?.davkharuud.map((a) => (
                    <Select.Option key={a._id} value={a.davkhar}>
                      {a.davkhar}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          </div>
          <div className="ml-auto flex w-full place-content-end gap-2 md:w-auto">
            <div className="hidden md:flex">
              <BaganiinSongolt
                shineBagana={shineBagana}
                setShineBagana={setShineBagana}
                columns={[
                  {
                    title: t("Сарын түрээс"),
                    width: "8rem",
                    dataIndex: "sariinTurees",
                    summary: true,
                    align: "center",
                    render: (a) => {
                      return (
                        <div className="w-full text-right">
                          {formatNumber(a || 0)}
                        </div>
                      );
                    },
                  },
                  {
                    title: t("Талбайн үнэ"),
                    width: "8rem",
                    align: "center",
                    summary: true,
                    dataIndex: "talbainNiitUne",
                    render: (a) => {
                      return (
                        <div className="w-full text-right">
                          {formatNumber(a || 0)}
                        </div>
                      );
                    },
                  },
                  {
                    title: t("Давхар"),
                    dataIndex: "davkhar",
                    ellipsis: true,
                    align: "center",
                    width: "5rem",
                    showSorterTooltip: false,
                    defaultSortOrder: "descend",
                    sorter: () => 0,
                  },
                  {
                    title: t("Түрээслэгч"),
                    dataIndex: "ner",
                    ellipsis: true,
                    align: "center",
                    width: "8rem",
                    render(a) {
                      return <div className="text-left">{a}</div>;
                    },
                  },
                  {
                    title: t("Гэрээний огноо"),
                    width: "11rem",
                    dataIndex: "gereeniiOgnoo",
                    ellipsis: true,
                    align: "center",
                    render(a) {
                      return moment(a).format("YYYY-MM-DD");
                    },
                    sorter: () => 0,
                  },
                  {
                    title: t("Гэрээний дугаар"),
                    width: "11rem",
                    dataIndex: "gereeniiDugaar",
                    ellipsis: true,
                    align: "center",
                    render(a) {
                      return a;
                    },
                    sorter: () => 0,
                  },
                  {
                    title: t("Алданги"),
                    dataIndex: "aldangiinUldegdel",
                    className: "text-center",
                    align: "center",
                    ellipsis: true,
                    width: "7rem",
                    summary: true,
                    render: (aldangiinUldegdel) => {
                      return (
                        <div className="w-full text-right">
                          {formatNumber(aldangiinUldegdel || 0)}
                        </div>
                      );
                    },
                  },
                  {
                    title: t("Авлагын үлдэгдэл"),
                    dataIndex: "avlagiinUldegdel",
                    className: "text-center",
                    align: "center",
                    ellipsis: true,
                    width: "7rem",
                    summary: true,
                    render(text, data, index) {
                      return (
                        <div className="w-full text-right">
                          {formatNumber(
                            (parseFloat(data.uldegdel) || 0) +
                              (data.aldangiinUldegdel || 0)
                          )}
                        </div>
                      );
                    },
                  },
                  {
                    title: t("Барьцааны үлдэгдэл"),
                    dataIndex: "baritsaaAvakhDun",
                    className: "text-center",
                    align: "center",
                    ellipsis: true,
                    width: "7rem",
                    summary: true,
                    render: (baritsaaAvakhDun, data) => {
                      return (
                        <div className="w-full text-right">
                          {formatNumber(
                            (baritsaaAvakhDun || 0) -
                              (data.baritsaaniiUldegdel || 0)
                          )}
                        </div>
                      );
                    },
                  },
                  {
                    title: t("Барьцааны төлөлт"),
                    dataIndex: "baritsaaniiUldegdel",
                    className: "text-center",
                    align: "center",
                    ellipsis: true,
                    width: "7rem",
                    summary: true,
                    render: (baritsaaniiUldegdel) => {
                      return (
                        <div className="w-full text-right">
                          {formatNumber(baritsaaniiUldegdel || 0)}
                        </div>
                      );
                    },
                  },
                ]}
              />
            </div>
            <Popover
              content={() => (
                <div className="flex w-32 flex-col">
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg  hover:bg-green-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={() => {
                      const { Excel } = require("antd-table-saveas-excel");
                      const excelExport = new Excel();
                      excelExport
                        .addSheet("Гүйлгээний түүх")
                        .addColumns(excelColumns)
                        .addDataSource(gereeniiMedeelel?.jagsaalt)
                        .saveAs("Гүйлгээний түүх.xlsx");
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
                className="w-full"
                type="primary"
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              >
                <span>Excel</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
            <Popover>
              <Button
                type="primary"
                onClick={olnoorGuilgeeOruulakhExcel}
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              >
                <span>{t("Заалт оруулах")}</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
            <Popover>
              <Button
                type="primary"
                onClick={olnoorGuilgeeOruulakhExcelFc}
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              >
                <span>{t("Заалт")}</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
            <Popover>
              <Button
                type="primary"
                onClick={olnoorEkhniiUldegdelOruulakhExcel}
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              >
                <span>{t("Эхний үлдэгдэл оруулах")}</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
          </div>
        </div>
        <div
          className="mt-5 hidden overflow-auto md:block"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          <TableGuilgee
            columns={columns}
            garalt={
              turul === "eneSardTulukh"
                ? eneSardTuluuguiGereenuud
                : gereeniiMedeelel
            }
            setKhuudaslalt={
              turul === "eneSardTulukh"
                ? setEneSardTuluuguiGereenuud
                : setKhuudaslalt
            }
            setLoadingIndex={setLoadingIndex}
            onChange={khusnegtOrderChange}
          />
        </div>
        <CardList
          neesenEsekh={neesenEsekh}
          tileProps={{
            GereeniiUldegdel,
            turul,
            khuulgaKharya,
            nekhemjlelIlgeekh,
            guilgeeKhiiya,
            baritsaaUdirdya,
          }}
          cardListTuluv={"utas"}
          keyValue="guilgeeTuukh"
          className="block overflow-auto md:hidden"
          jagsaalt={gereeniiMedeelel?.jagsaalt}
          Component={GuilgeenTuukhTile}
          pagination={{
            current: gereeniiMedeelel?.khuudasniiDugaar,
            pageSize: gereeniiMedeelel?.khuudasniiKhemjee,
            total: gereeniiMedeelel?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default guilgeeniiTuukh;
