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
} from "antd";
import {
  FileExcelOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  DownOutlined,
  PrinterOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import useOrder from "tools/function/useOrder";

import NekhemjlelIlgeekh from "components/pageComponents/tulbur/NekhemjlelIlgeekh";
import MedegdelIlgeekh from "components/pageComponents/tulbur/MedegdelIlgeekh";
import GuilgeeKhiikh from "components/pageComponents/tulbur/GuilgeeKhiikh";
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
//#endregion

function GereeniiUldegdel({ ugugdul, token }) {
  const { barilgiinId } = useAuth();
  const { data, mutate, isValidating } = useSWR(
    !!ugugdul?.gereeniiDugaar && !!barilgiinId
      ? ["/uldegdelBodyo", barilgiinId, ugugdul?.gereeniiDugaar]
      : null,
    (url, barilgiinId, gereeniiDugaar) =>
      uilchilgee(token)
        .post(url, { barilgiinId, gereeniiDugaar })
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
  return (
    <Table
      scroll={{ y: "calc(94vh - 26rem)" }}
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
        pageSize: garalt?.khuudasniiKhemjee,
        total: garalt?.niitMur,
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
    />
  );
}

const searchKeys = [
  "register",
  "talbainDugaar",
  "gereeniiDugaar",
  "utas",
  "ovog",
  "ner",
];

function guilgeeniiTuukh({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  //#region state
  const ref = React.useRef(null);
  const baritsaaref = React.useRef(null);
  const { baiguullaga, barilgiinId } = useAuth();
  const [delgegdsenGeree, setDelgegdsenGeree] = React.useState(null);
  const [ognoo, setOgnoo] = React.useState([
    moment(moment().startOf("month").format("YYYY-MM-DD 00:00:00")),
    moment(moment().endOf("month").format("YYYY-MM-DD 23:59:59")),
  ]);
  const [turul, setTurul] = React.useState("");
  const [loadingIndex, setLoadingIndex] = React.useState(0);
  const [davkhar, setDavkhar] = React.useState(undefined);

  const { guilgeeniiToololt } = useGuilgeeniiToololtAvya(token, ognoo);
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
          title: "Ваучерын дүн",
          width: "7rem",
          align: "right",
          render: (v) => formatNumber(v),
        });
        break;
      case "khungulult":
        sericeName = `/khungulultteiJagsaaltAvya/${ekhlekhOgnoo}/${duusakhOgnoo}`;
        turulColumns.push({
          dataIndex: "khungulult",
          title: "Хөнгөлөлт",
          width: "6rem",
          align: "right",
          render: (v) => formatNumber(v),
        });
        break;
      case "eneSardTulsun":
        sericeName = `/guitsetgelteiJagsaaltAvya/${ekhlekhOgnoo}/${duusakhOgnoo}`;
        turulColumns.push({
          dataIndex: "tulsunDun",
          title: "Төлсөн дүн",
          width: "6rem",
          align: "right",
          render: (v) => formatNumber(v),
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
    } else
      query = {
        davkhar,
        baiguullagiinId: baiguullaga?._id,
        barilgiinId,
        tuluv: {
          $ne: -1,
        },
      };
    return { sericeName, query, turulColumns };
  }, [turul, ognoo, davkhar, barilgiinId]);

  const {
    data,
    mutate,
    onSearch: onSearchMedeelel,
    setKhuudaslalt,
    refresh,
    isValidating,
  } = useJagsaalt(sericeName, query, order, undefined, searchKeys);

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
        width: "2rem",
        align: "center",
        render: (text, record, index) => index + 1,
      },
      {
        width: "7rem",
        align: "center",
        title: "Регистр",
        dataIndex: "register",
      },
      {
        title: "Талбай",
        dataIndex: "talbainDugaar",
        ellipsis: true,
        align: "center",
        width: "5rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: "Утас",
        dataIndex: "utas",
        ellipsis: true,
        align: "center",
        width: "7rem",
      },
      {
        title: "Үлдэгдэл",
        width: "calc(18rem - 10rem)",
        dataIndex: "uldegdel",
        align: "center",
        render(text, record, index) {
          return (
            <GereeniiUldegdel
              token={token}
              ugugdul={record}
              index={index}
              show={index === loadingIndex}
              setLoadingIndex={setLoadingIndex}
              urt={gereeniiMedeelel?.jagsaalt?.length}
            />
          );
        },
        showSorterTooltip: false,
        sorter: (a, b) => Number(a.uldegdel || 0) - Number(b.uldegdel || 0),
      },
    ];
    return [
      ...jagsaalt,
      ...shineBagana,
      ...turulColumns,
      {
        title: "Үйлдэл",
        width: "8rem",
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

          return (
            <div className="flex w-full flex-row items-center justify-center  divide-x-2 ">
              <a
                onClick={() => nekhemjlelIlgeekh(row)}
                className=" text-green-500 hover:scale-110"
              >
                <Tooltip
                  title="Нэхэмжлэл илгээх"
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
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </Tooltip>
              </a>
              <a
                onClick={() => khuulgaKharya(row)}
                className="fill-current  text-green-500 hover:scale-110"
              >
                <Tooltip
                  title="Хуулга"
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
                onClick={() => guilgeeKhiiya(row)}
                className="fill-current  text-green-500  hover:scale-125"
              >
                <Tooltip
                  title="Гүйлгээ хийх"
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
                      ? `Барьцаа ${formatNumber(
                          (row.baritsaaAvakhDun || 0) -
                            (row.baritsaaniiUldegdel || 0)
                        )} дутуу`
                      : `${formatNumber(
                          row.baritsaaniiUldegdel
                        )} барьцаа төлөгдсөн байна`
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
  }, [
    gereeniiMedeelel,
    loadingIndex,
    delgegdsenGeree,
    shineBagana,
    turulColumns,
  ]);

  //#endregion
  //#region handlers
  function onChangeTurul(turul) {
    setTurul(turul);
    setKhuudaslalt((a) => ({ ...a, khuudasniiDugaar: 1 }));
  }

  function refreshData() {
    refresh();
    tolooguiGereeniiTooMutate();
  }

  function baritsaaUdirdya(data) {
    var baritsaaUdirdanKhadgalyaaId = "baritsaaUdirdanKhadgalyaaId";
    const footer = [
      <Button onClick={() => baritsaaref.current.khaaya()}>Хаах</Button>,
      <Button
        type="primary"
        id={baritsaaUdirdanKhadgalyaaId}
        onClick={() => baritsaaref.current.khadgalya()}
      >
        Хадгалах
      </Button>,
    ];
    modal({
      title: "",
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
    function refreshdata() {
      data.mutate && data.mutate();
      refreshData();
    }
    var khadgalyaButtonId = "khadgalyaButtonId";
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button
        type="primary"
        id={khadgalyaButtonId}
        onClick={() => ref.current.khadgalya()}
      >
        Хадгалах
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GuilgeeKhiikh
          khadgalyaButtonId={khadgalyaButtonId}
          data={data}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          barilgiinId={barilgiinId}
          onFinish={refreshdata}
        />
      ),
      footer,
    });
  }

  function nekhemjlelIlgeekh(data) {
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <NekhemjlelIlgeekh
          data={data}
          ref={ref}
          token={token}
          onFinish={refreshData}
        />
      ),
      footer: [],
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
      <Button
        type="primary"
        onClick={() => ref.current.khevlekh()}
        icon={<PrinterOutlined />}
      >
        Хэвлэх
      </Button>,
      <Button
        onClick={() => ref.current.khaaya()}
        icon={<CloseCircleOutlined />}
      >
        Хаах
      </Button>,
    ];
    modal({
      title: "Хуулга",
      icon: <FileExcelOutlined />,
      width: "90vw",
      style: { top: 20 },
      content: (
        <Khuulga
          data={data}
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

  //#endregion

  return (
    <Admin
      title="Гүйлгээний түүх"
      khuudasniiNer="guilgeeniiTuukh"
      className="p-0 md:p-4"
      onSearch={onSearch}
      tsonkhniiId="61c2c6bc1c2830c4e6f90cb5"
      loading={isValidating}
    >
      <Card className="cardgrid col-span-12 p-5">
        <div className="grid w-full grid-cols-12 gap-4">
          {[
            {
              too: formatNumber(_.get(guilgeeniiToololt, "avlaga.0.dun") || 0),
              selectedColor: "bg-green-50 dark:bg-gray-900",
              turul: "avlaga",
              utga: "Хуримтлагдсан авлага",
              tailbar:
                "Өмнө сарын төлбөрийн үлдэгдлүүдийн нийлбэр буюу энэ сарыг тооцоогүй болно.",
            },
            {
              too: formatNumber(_.get(guilgeeniiToololt, "voucher.0.dun") || 0),
              selectedColor: "bg-green-50 dark:bg-gray-900",
              turul: "voucher",
              utga: "Ваучер төлөлт",
              tailbar: "Огноонд хамаарагдах бүх Ваучер төлөлтийн нийлбэр дүн",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "tsutslagdsanAvlaga.0.dun") || 0
              ),
              turul: "tsutslagdsanAvlaga",
              selectedColor: "bg-green-50 dark:bg-gray-900",
              utga: "Цуцлагдсан гэрээний авлага",
              tailbar: "Идэвхигүй буюу цуцлагдсан гэрээний нийт авлага",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "eneSardTulukh.0.dun") || 0
              ),
              turul: "eneSardTulukh",
              selectedColor: "bg-green-50 dark:bg-gray-900",
              utga: "Төлөвлөлгөө / сар",
              tailbar: "Энэ сард төлөгдвөл зохих нийт дүн",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "eneSardTulsun.0.dun") || 0
              ),
              turul: "eneSardTulsun",
              selectedColor: "bg-green-50 dark:bg-gray-900",
              utga: "Гүйцэтгэл / сар",
              tailbar: "Огноонд хамаарагдах бүх төлөгдсөн дүнгийн нийлбэр",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "khungulult.0.dun") || 0
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
                <Tooltip title={<div>{mur.tailbar}</div>}>
                  <div className="h-full rounded-xl">
                    <div className="rounded-xl p-3">
                      <div className="flex">
                        <div>
                          <div className="text-xl font-bold text-green-600">
                            {mur.too}
                          </div>
                          <div className="text-base text-gray-500">
                            {mur.utga}
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
          className="mt-5 flex w-full flex-row"
          data-aos="zoom-in-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
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
            <Select placeholder="Давхар" onChange={setDavkhar} allowClear>
              {baiguullaga?.barilguud
                ?.find((a) => a._id === barilgiinId)
                ?.davkharuud.map((a) => (
                  <Select.Option key={a._id} value={a.davkhar}>
                    {a.davkhar}
                  </Select.Option>
                ))}
            </Select>
          </div>
          <div className="ml-auto flex place-content-end">
            <BaganiinSongolt
              shineBagana={shineBagana}
              setShineBagana={setShineBagana}
              columns={[
                {
                  width: "9rem",
                  align: "center",
                  title: " Төлөх огноо",
                  dataIndex: "daraagiinTulukhOgnoo",
                  render(a) {
                    return moment(a).format("YYYY-MM-DD");
                  },
                },
                {
                  title: "Сарын түрээс",
                  width: "8rem",
                  dataIndex: "sariinTurees",
                  align: "right",
                  render: (a) => {
                    return formatNumber(a || 0);
                  },
                },
                {
                  title: "Талбайн үнэ",
                  width: "8rem",
                  align: "right",
                  dataIndex: "talbainNiitUne",
                  render: (a) => {
                    return formatNumber(a || 0);
                  },
                },
                {
                  title: "Давхар",
                  dataIndex: "davkhar",
                  ellipsis: true,
                  align: "center",
                  width: "5rem",
                  showSorterTooltip: false,
                  defaultSortOrder: "descend",
                  sorter: () => 0,
                },
                {
                  title: "Түрээслэгч",
                  dataIndex: "ner",
                  ellipsis: true,
                  align: "left",
                  width: "8rem",
                },
                {
                  title: "Гэрээний огноо",
                  width: "11rem",
                  dataIndex: "gereeniiOgnoo",
                  ellipsis: true,
                  align: "center",
                  render(a) {
                    return moment(a).format("YYYY-MM-DD");
                  },
                },
                {
                  title: "Алдангийн үлдэгдэл",
                  dataIndex: "aldangiinUldegdel",
                  className: "text-center",
                  align: "right",
                  ellipsis: true,
                  width: "7rem",
                  render: (aldangiinUldegdel) => {
                    return formatNumber(aldangiinUldegdel || 0);
                  },
                },
              ]}
            />

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
                        .addColumns([
                          {
                            title: "Гэрээний дугаар",
                            dataIndex: "gereeniiDugaar",
                          },
                          {
                            title: "Талбай",
                            dataIndex: "talbainDugaar",
                          },
                          {
                            title: "Давхар",
                            dataIndex: "davkhar",
                          },
                          {
                            title: "Түрээслэгч",
                            dataIndex: "ner",
                          },
                          {
                            title: "Утас",
                            dataIndex: "utas",
                          },
                          {
                            title: "Үлдэгдэл",
                            dataIndex: "uldegdel",
                            render(a) {
                              return formatNumber(a);
                            },
                          },
                          {
                            title: "Гэрээний огноо",
                            dataIndex: "gereeniiOgnoo",
                            width: "15rem",
                            align: "center",
                            render(a) {
                              return moment(a).format("YYYY-MM-DD");
                            },
                          },
                          {
                            title: "Дуусах огноо",
                            dataIndex: "duusakhOgnoo",

                            render(a) {
                              return moment(a).format("YYYY-MM-DD");
                            },
                          },
                        ])
                        .addDataSource(gereeniiMedeelel?.jagsaalt)
                        .saveAs("Гүйлгээний түүх.xlsx");
                    }}
                  >
                    <DownloadOutlined style={{ fontSize: "18px" }} />
                    <label>Татах</label>
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
        <div
          className="mt-5 hidden overflow-auto md:block"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          <TableGuilgee
            columns={columns}
            garalt={gereeniiMedeelel}
            setKhuudaslalt={setKhuudaslalt}
            setLoadingIndex={setLoadingIndex}
            onChange={khusnegtOrderChange}
          />
        </div>
        <CardList
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
