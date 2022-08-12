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
  Menu,
  Checkbox,
} from "antd";
import {
  FileExcelOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import useOrder from "tools/function/useOrder";

import GuilgeeKhiikh from "components/pageComponents/tulbur/GuilgeeKhiikh";
import BaritsaaUdirdlaga from "components/pageComponents/tulbur/BaritsaaUdirdlaga";

import Khungulukh from "components/pageComponents/tulbur/Khungulukh";
import GuilgeeniiTuukh from "components/pageComponents/tulbur/GuilgeeniiTuukh";
import _ from "lodash";
import { modal } from "components/ant/Modal";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import useGuilgeeniiToololtAvya from "hooks/tulburTootsoo/useGuilgeeniiToololtAvya";
import { useTuluugiiGereeniiToololtAvya } from "hooks/tulburTootsoo/useGuilgeeniiToololtAvya";
import useSWR from "swr";
import GuilgeenTuukhTile from "components/pageComponents/tulbur/GuilgeeTuukhTile";
import CardList from "components/cardList";
import useEneSardTuluuguiGereenuudAvya from "hooks/tulburTootsoo/useEneSardTuluuguiGereenuudAvya";
import Aos from "aos";
import BaganiinSongolt from "components/table/BaganiinSongolt";
//#endregion

function GereeniiUldegdel({ ugugdul, token }) {
  const { barilgiinId } = useAuth();
  const { data, mutate } = useSWR(
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
      {!data ? <Spin size="small" /> : formatNumber(data?.uldegdel)}
    </div>
  );
}

function TableGuilgee({
  columns,
  garalt,
  setKhuudaslalt,
  delgegdsenGeree,
  setDelgegdsenGeree,
  refTuukh,
  token,
  ognoo,
  refreshData,
  setLoadingIndex,
  onChange,
}) {
  return (
    <Table
      scroll={{ y: "calc(100vh - 26rem)" }}
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
      expandable={{
        expandedRowRender: (mur) =>
          mur?._id === delgegdsenGeree && (
            <GuilgeeniiTuukh
              ref={refTuukh}
              mur={mur}
              token={token}
              ognoo={ognoo}
              data={mur}
              refreshData={refreshData}
            />
          ),
        expandedRowKeys: [delgegdsenGeree],
        expandedRowClassName: (a, index) =>
          index % 2 === 0
            ? "bg-white dark:bg-gray-600"
            : "bg-gray-200 dark:bg-gray-800",
        onExpand: (a, b) => setDelgegdsenGeree(a === true && b._id),
      }}
    />
  );
}

function guilgeeniiTuukh({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  //#region state
  const ref = React.useRef(null);
  const refTuukh = React.useRef(null);
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

  const query = React.useMemo(() => {
    if (turul === "voucher")
      return {
        davkhar,
        baiguullagiinId: baiguullaga._id,
        "avlaga.guilgeenuud": {
          $elemMatch: {
            ognoo: {
              $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
              $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
            },
            tulsunDun: { $gte: 0 },
            turul: "voucher",
          },
        },
      };
    else if (turul === "avlaga")
      return {
        "avlaga.guilgeenuud.ognoo": {
          $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
        },
        davkhar,
        baiguullagiinId: baiguullaga._id,
        tuluv: {
          $ne: -1,
        },
      };
    else if (turul === "tsutslagdsanAvlaga")
      return {
        baiguullagiinId: baiguullaga._id,
        davkhar,
        tuluv: -1,
      };
    else if (turul === "eneSardTulukh")
      return {
        davkhar,
      };
    else if (turul === "eneSardTulsun")
      return {
        davkhar,
        tuluv: { $ne: -1 },
        baiguullagiinId: baiguullaga?._id,
        "avlaga.guilgeenuud": {
          $elemMatch: {
            ognoo: {
              $gte: moment(ognoo[0])
                .startOf("month")
                .format("YYYY-MM-DD 00:00:00"),
              $lte: moment(ognoo[1])
                .endOf("month")
                .format("YYYY-MM-DD 23:59:59"),
            },
            tulsunDun: {
              $gt: 0,
            },
          },
        },
      };
    else if (turul === "khungulult")
      return {
        davkhar,
        "avlaga.guilgeenuud.ognoo": {
          $gte: moment(ognoo[0]).startOf("month").format("YYYY-MM-DD 00:00:00"),
          $lte: moment(ognoo[1]).endOf("month").format("YYYY-MM-DD 23:59:59"),
        },
        baiguullagiinId: baiguullaga?._id,
        "avlaga.guilgeenuud.khyamdral": {
          $gt: 0,
        },
        tuluv: { $ne: -1 },
      };
    return { davkhar, tuluv: { $ne: -1 } };
  }, [turul, ognoo, davkhar]);

  const { gereeniiMedeelel, setGereeniiKhuudaslalt, gereeniiMedeelelMutate } =
    useGereeniiJagsaalt(
      turul !== "eneSardTulukh" && token,
      baiguullaga?._id,
      undefined,
      query,
      undefined,
      undefined,
      order
    );

  const { eneSardTuluuguiGereenuud, setEneSardTuluuguiGereenuud } =
    useEneSardTuluuguiGereenuudAvya(
      turul === "eneSardTulukh" && token,
      ognoo,
      query
    );

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        width: "3rem",
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
      {
        title: "Үйлдэл",
        width: "6rem",
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
            <div className="flex w-full flex-row items-center justify-center divide-x-2 ">
              <a
                onClick={() => guilgeeKhiiya(row)}
                className="fill-current px-2 text-green-500"
              >
                <Tooltip
                  title="Гүйлгээ хийх"
                  className="flex w-full items-center justify-center "
                >
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="440.000000pt"
                    height="377.000000pt"
                    viewBox="0 0 440.000000 377.000000"
                    preserveAspectRatio="xMidYMid meet"
                    className="h-6 w-8 fill-current p-1 text-green-500"
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

              {row?._id === delgegdsenGeree && (
                <a className="px-2" onClick={() => refTuukh.current.khevlekh()}>
                  <Tooltip title="Хэвлэх">
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="428.000000pt"
                      height="438.000000pt"
                      viewBox="0 0 428.000000 438.000000"
                      preserveAspectRatio="xMidYMid meet"
                      className="h-6 w-6 fill-current p-1 text-green-500"
                    >
                      <g transform="translate(0.000000,438.000000) scale(0.100000,-0.100000)">
                        <path
                          d="M1104 4166 c-62 -19 -130 -73 -167 -130 l-32 -51 -3 -507 -3 -508
                  -74 0 -75 0 0 -445 0 -445 1365 0 1365 0 0 445 0 445 -79 0 -80 0 -3 278 -3
                  277 -27 58 c-19 39 -58 90 -125 159 -54 56 -111 116 -128 133 -113 120 -222
                  230 -249 250 -73 55 -75 55 -890 54 -586 0 -760 -3 -792 -13z m1500 -157 c51
                  -40 56 -64 56 -251 0 -195 8 -224 69 -265 32 -21 45 -23 185 -23 173 0 209
                  -10 238 -70 16 -31 18 -69 18 -322 l0 -288 -1060 0 -1060 0 0 563 c0 638 -3
                  610 80 654 l43 23 702 0 c697 0 703 0 729 -21z"
                        />
                        <path
                          d="M346 2909 c-54 -13 -91 -42 -115 -92 -21 -43 -21 -53 -21 -830 l0
                  -787 345 0 345 0 0 -320 c0 -176 0 -322 0 -325 0 -3 11 -26 24 -53 39 -75 91
                  -123 161 -146 40 -14 166 -16 1029 -16 666 -1 992 3 1012 10 50 18 76 34 108
                  66 80 81 86 116 86 482 l0 302 350 0 350 0 0 788 c0 502 -4 800 -10 822 -27
                  91 -80 111 -290 107 l-135 -2 -3 -467 -2 -468 -1465 0 -1465 0 -2 468 -3 467
                  -130 1 c-72 1 -147 -3 -169 -7z m3454 -1419 l0 -70 -70 0 -70 0 0 70 0 70 70
                  0 70 0 0 -70z m-630 -412 c0 -285 -4 -477 -10 -500 -6 -20 -24 -48 -41 -62
                  l-31 -26 -971 0 c-757 0 -977 3 -997 13 -13 7 -35 28 -47 46 l-23 34 0 478 0
                  479 1060 0 1060 0 0 -462z"
                        />
                        <path d="M1330 1255 l0 -75 785 0 785 0 0 75 0 75 -785 0 -785 0 0 -75z" />
                        <path d="M1332 898 l3 -73 780 0 780 1 3 72 3 72 -786 0 -786 0 3 -72z" />
                      </g>
                    </svg>
                  </Tooltip>
                </a>
              )}
              <div
                className="px-2 text-red-500"
                onClick={() => baritsaaUdirdya(row)}
              >
                <Tooltip
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
                    width={25}
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
  }, [gereeniiMedeelel, loadingIndex, delgegdsenGeree, shineBagana]);

  //#endregion

  //#region handlers
  function onChangeTurul(turul) {
    setTurul(turul);
    setGereeniiKhuudaslalt((a) => ({ ...a, khuudasniiDugaar: 1 }));
  }

  function refreshData() {
    gereeniiMedeelelMutate();
    tolooguiGereeniiTooMutate();
    refTuukh.current?.refreshData();
  }

  function baritsaaUdirdya(data) {
    const footer = [
      <Button onClick={() => baritsaaref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => baritsaaref.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <BaritsaaUdirdlaga
          data={data}
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
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GuilgeeKhiikh
          data={data}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }

  function khungulultKhiiya(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <Khungulukh
          data={data}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
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
      onSearch={(search) => {
        if (loadingIndex !== 0) setLoadingIndex(0);
        if (turul !== "eneSardTulukh")
          setGereeniiKhuudaslalt((a) => ({
            ...a,
            search,
            khuudasniiDugaar: 1,
          }));
        else
          setEneSardTuluuguiGereenuud((a) => ({
            ...a,
            search,
            khuudasniiDugaar: 1,
          }));
      }}
      tsonkhniiId="61c2c6bc1c2830c4e6f90cb5"
    >
      <Card className="cardgrid col-span-12 p-5">
        <div className="grid w-full grid-cols-12 gap-4">
          {[
            {
              too: formatNumber(_.get(guilgeeniiToololt, "avlaga.0.dun") || 0),
              turul: "avlaga",
              utga: "Хуримтлагдсан авлага",
              tailbar:
                "Өмнө сарын төлбөрийн үлдэгдлүүдийн нийлбэр буюу энэ сарыг тооцоогүй болно.",
            },
            {
              too: formatNumber(_.get(guilgeeniiToololt, "voucher.0.dun") || 0),
              turul: "voucher",
              utga: "Ваучер төлөлт",
              tailbar: "Огноонд хамаарагдах бүх Ваучер төлөлтийн нийлбэр дүн",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "tsutslagdsanAvlaga.0.dun") || 0
              ),
              turul: "tsutslagdsanAvlaga",
              utga: "Цуцлагдсан гэрээний авлага",
              tailbar: "Идэвхигүй буюу цуцлагдсан гэрээний нийт авлага",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "eneSardTulukh.0.dun") || 0
              ),
              turul: "eneSardTulukh",
              utga: "Төлөвлөлгөө / сар",
              tailbar: "Энэ сард төлөгдвөл зохих нийт дүн",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "eneSardTulsun.0.dun") || 0
              ),
              turul: "eneSardTulsun",
              utga: "Гүйцэтгэл / сар",
              tailbar: "Огноонд хамаарагдах бүх төлөгдсөн дүнгийн нийлбэр",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "khungulult.0.dun") || 0
              ),
              turul: "khungulult",
              utga: "Хөнгөлөлт / сар",
              tailbar: "Огноонд хамаарагдах бүх хөнгөлөлтийн дүнгийн нийлбэр",
            },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className="intro-y zoom-in col-span-12 cursor-pointer rounded-xl border-2 border-green-600 hover:bg-green-600 hover:bg-opacity-25 sm:col-span-12 lg:col-span-2"
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
                                {eneSardTuluuguiGereenuud?.niitMur ||
                                  tolooguiGereeniiToo?.too}
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
                  dataIndex: "sariinTurees",
                  align: "right",
                  render: (a) => {
                    return formatNumber(a || 0);
                  },
                },
                {
                  title: "Талбайн үнэ",
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
                  dataIndex: "gereeniiOgnoo",
                  ellipsis: true,
                  align: "center",
                  render(a) {
                    return moment(a).format("YYYY-MM-DD");
                  },
                },
              ]}
            />

            <Popover
              content={() => (
                <div className="flex w-32 flex-col">
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700"
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
            garalt={
              turul === "eneSardTulukh"
                ? eneSardTuluuguiGereenuud
                : gereeniiMedeelel
            }
            setKhuudaslalt={
              turul === "eneSardTulukh"
                ? setEneSardTuluuguiGereenuud
                : setGereeniiKhuudaslalt
            }
            setLoadingIndex={setLoadingIndex}
            refTuukh={refTuukh}
            token={token}
            ognoo={ognoo}
            refreshData={refreshData}
            delgegdsenGeree={delgegdsenGeree}
            setDelgegdsenGeree={setDelgegdsenGeree}
            onChange={khusnegtOrderChange}
          />
        </div>
        <CardList
          keyValue="guilgeeTuukh"
          className="block overflow-auto md:hidden"
          jagsaalt={
            turul === "eneSardTulukh"
              ? eneSardTuluuguiGereenuud?.jagsaalt
              : gereeniiMedeelel?.jagsaalt
          }
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
