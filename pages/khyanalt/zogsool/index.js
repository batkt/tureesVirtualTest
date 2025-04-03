import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import {
  Button,
  Card,
  DatePicker,
  Input,
  message,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Radio,
  Select,
  Table,
  Tabs,
  Tooltip,
  Table as AntdTable
} from "antd";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import useZogsool, { useZogsoolToololt } from "hooks/useZogsool";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import useOrder from "tools/function/useOrder";
import useSWR from "swr";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import useUilchluulegch, {
  useUilchluulegchZogsoolToo,
  useUilchluulegchdiinDunAvay,
} from "hooks/useUilchluulegch";
import { useUilchluulegchToololt } from "hooks/useUilchluulegch";
import BaganiinSongolt from "../../../components/table/BaganiinSongolt";
import useJagsaalt from "hooks/useJagsaalt";
import {
  CloseSquareFilled,
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilterOutlined,
  MoreOutlined,
  SettingOutlined,
  ShareAltOutlined,
  UploadOutlined,
  VideoCameraAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel";
import confirm from "antd/lib/modal/confirm";

export function excelTatajAvya(
  token,
  service,
  mur,
  sheet,
  query,
  order,
  sheetName
) {
  message.loading(t("Өгөгдөл боловсруулж байна та түр хүлээнэ үү!"), 100000);
  uilchilgee(token)
    .get(service, {
      params: { query, order, khuudasniiKhemjee: mur, khuudasniiDugaar: 1 },
    })
    .then(({ data }) => {
      const excel = new Excel();
      excel
        .addSheet(sheetName)
        .addColumns(sheet)
        .addDataSource(data?.jagsaalt)
        .saveAs(sheetName + ".xlsx");
    })
    .catch(aldaaBarigch)
    .finally(() => message.destroy());
}

function tulburKhurvuulekh(v) {
  var utga = undefined;
  switch (v) {
    case "belen":
      utga = "Бэлэн";
      break;
    case "khariltsakh":
      utga = "Данс";
      break;
    case "khaan":
      utga = "Хаан";
      break;
    case "khas":
      utga = "Хас";
      break;
    case "tur":
      utga = "Төр";
      break;
    case "golomt":
      utga = "Голомт";
      break;
    case "tdb":
      utga = "ХХБ";
      break;
    case "kapitron":
      utga = "Капитрон";
      break;
    case "toki":
      utga = "Токи";
      break;
    case "kiosk":
      utga = "Киоск";
      break;
    case "khungulult":
      utga = "Хөнгөлөлт";
      break;
    default:
      utga = v;
      break;
  }
  return utga;
}

function Zogsool({ token }) {
  const { t, i18n } = useTranslation();
  const { baiguullaga, barilgiinId } = useAuth();
  const excelref = useRef(null);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);
  const [zogsoolId, setZogsoolId] = useState();
  const [tulbur, setTulbur] = useState("");
  const [tuluv, setTuluv] = useState("");
  const [ajiltniiNers, setAjiltniiNers] = useState([]);
  const [selectedRowkeys, setSelectedRowkeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowkeys(newSelectedRowKeys);
  };

  const shalgakhTsag = 18; //idevkhtei => todorkhoigui bolgoh shalguur tsag

  const [shaltgaan, setShaltgaan] = useState("Цэвэрлэсэн");
  const [tootsooKhelber, setTootsooKhelber] = useState("");
  const rowSelection = {
    selectedRowKeys: selectedRowkeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => {
      const untraakh =
        !record?.tuukh?.[0]?.uneguiGarsan && !record?.tuukh?.[0]?.garsanKhaalga;
      return {
        disabled: !untraakh,
      };
    },
  };

  const tseverlekh = () => {
    setSelectedRowkeys([]);
    setShaltgaan("Цэвэрлэсэн");
  };

  const [shuult, setShuult] = useState("");

  const tooQuery = useMemo(() => {
    return {
      ...(ognoo && {
        ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      }),
    };
  }, [ognoo]);

  const { uilchiluulegchToololt, uilchiluulegchToololtMutate } =
    useUilchluulegchToololt(token, tooQuery);

  const { order, onChangeTable, setOrder } = useOrder({
    "tuukh.tsagiinTuukh.garsanTsag": -1,
  });
  const que = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
    };
  }, [baiguullaga?._id, barilgiinId]);

  const query = useMemo(() => {
    const aa = !!shuult?.query ? shuult.query : {};
    const baseQuery = {
      ...(ognoo && {
        createdAt: {
          $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
        },
      }),
      ...aa,
    };
    if (!!zogsoolId) {
      baseQuery["tuukh.zogsooliinId"] = zogsoolId;
    }
    if (!!tulbur && tulbur !== "") {
      baseQuery["tuukh.tulbur.turul"] =
        !!tulbur && tulbur === "card"
          ? { $in: ["khaan", "tdb", "khas", "golomt", "kapitron", "tur"] }
          : tulbur;
    }
    if (tuluv !== "") {
      if (tuluv === -2) {
        baseQuery["tuukh.0.tuluv"] = -2;
      } else if (tuluv === 1) {
        baseQuery["tuukh.0.tuluv"] = 1;
      } else if (tuluv === 0) {
        baseQuery["tuukh.0.tuluv"] = 0;
        baseQuery["tuukh.0.garsanKhaalga"] = { $exists: false };
        baseQuery["tuukh.0.uneguiGarsan"] = { $exists: false };
        baseQuery["tuukh.0.tsagiinTuukh.0.garsanTsag"] = { $exists: false };
        baseQuery["tuukh.0.tsagiinTuukh.0.orsonTsag"] = {
          $gt: new Date(Date.now() - shalgakhTsag * 60 * 60 * 1000),
        };
      } else if (tuluv === 4) {
        baseQuery["tuukh.0.tuluv"] = 0;
        baseQuery["tuukh.0.garsanKhaalga"] = { $exists: false };
        baseQuery["tuukh.0.tsagiinTuukh.0.garsanTsag"] = { $exists: false };
        baseQuery["tuukh.0.uneguiGarsan"] = { $exists: false };
        baseQuery["tuukh.0.tsagiinTuukh.0.orsonTsag"] = {
          $lte: new Date(Date.now() - shalgakhTsag * 60 * 60 * 1000),
        };
      } else if (tuluv === 5) {
        baseQuery["tuukh.0.tuluv"] = 0;
        baseQuery["tuukh.0.uneguiGarsan"] = { $exists: false };
        baseQuery["niitDun"] = {
          $gt: 0,
        };
        baseQuery["tuukh"] = { $elemMatch: { tulbur: { $eq: [] } } };
      }
    }
    console.log("tootsooKhelber", tootsooKhelber);
    if (tootsooKhelber == 2) {
      delete baseQuery.createdAt;
      baseQuery["tuukh.tulbur.ognoo"] = {
        $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
        $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      };
    }
    return baseQuery;
  }, [ognoo, zogsoolId, shuult, tuluv, tulbur, shalgakhTsag, tootsooKhelber]);

  const or = useMemo(() => {
    var nemeh;
    if (tuluv !== "") {
      if (tuluv === 2) {
        nemeh = [
          { niitDun: 0, "tuukh.0.tuluv": { $ne: -2 } },
          { turul: "Үнэгүй" },
          { "tuukh.0.uneguiGarsan": { $exists: true } },
        ];
      }
    }
    return nemeh;
  }, [ognoo, zogsoolId, shuult, tuluv, tulbur]);

  const {
    uilchluulegchGaralt,
    setUilchluulegchKhuudaslalt,
    uilchluulegchMutate,
    isValidating,
  } = useUilchluulegch(token, baiguullaga?._id, query, order, or);

  const { jagsaalt } = useJagsaalt("/zogsoolJagsaalt", que, { createdAt: -1 });

  const orlogoQuery = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      zogsooliinId: jagsaalt[0]?._id,
      barilgiinId: barilgiinId,
      ...(ognoo && {
        ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      }),
    };
  }, [ognoo, jagsaalt, uilchluulegchGaralt, barilgiinId]);

  const { uilchluulegchdiinDun } = useUilchluulegchdiinDunAvay(
    token,
    orlogoQuery
  );

  function tseverliy() {
    const songogdson = [...selectedRowkeys];
    if (songogdson && songogdson.length > 0) {
      confirm({
        title: t("Анхаар"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        content: (
          <div>
            <div>Тайлбар:</div>
            <Input
              value={shaltgaan}
              placeholder="Тайлбар оруулна уу..."
              onChange={(v) => setShaltgaan(v)}
            />
          </div>
        ),
        onOk: () => {
          if (!shaltgaan) {
            notification.warn({ message: "Тайлбар оруулна уу", duration: 2 });
          } else {
            uilchilgee(token)
              .post("/uilchluulegchTseverliy", {
                utguud: songogdson,
                shaltgaan: shaltgaan,
              })
              .then(({ data }) => {
                if (data === "Amjilttai") {
                  notification.success({
                    message: "Амжилттай цэвэрлэгдлээ",
                    duration: 2,
                  });
                  uilchluulegchMutate();
                  tseverlekh();
                }
              })
              .catch((err) => aldaaBarigch(err));
          }
        },
      });
    } else {
      notification.warning({
        message: t("Цэвэрлэх үйлчлүүлэгч сонгоно уу!"),
        duration: 1,
      });
    }
  }

  const toololt = useMemo(
    () => [
      {
        name: "Үйлчлүүлэгч",
        too: formatNumber(
          !!uilchiluulegchToololt &&
            uilchiluulegchToololt[0].turul.find((a) => a._id === null)?.too,
          0
        ),
        query: { turul: { $nin: ["Дотоод", "Түрээслэгч", "Гэрээт"] } },
      },
      {
        name: "Түрээслэгч",
        too: formatNumber(
          !!uilchiluulegchToololt &&
            uilchiluulegchToololt[0].turul.find((a) => a._id === "Түрээслэгч")
              ?.too,
          0
        ),
        query: {
          turul: "Түрээслэгч",
        },
      },
      {
        name: "Гэрээт",
        too: formatNumber(
          !!uilchiluulegchToololt &&
            uilchiluulegchToololt[0].turul.find((a) => a._id === "Гэрээт")?.too,
          0
        ),
        query: {
          turul: "Гэрээт",
        },
      },
      {
        name: "Дотоод",
        too: formatNumber(
          !!uilchiluulegchToololt &&
            uilchiluulegchToololt[0].turul.find((a) => a._id === "Дотоод")?.too,
          0
        ),
        query: {
          turul: "Дотоод",
        },
      },
      {
        name: "Зөрчилтэй",
        too: formatNumber(
          !!uilchiluulegchToololt &&
            uilchiluulegchToololt[0].tuluv.find((a) => a._id === -2)?.too,
          0
        ),
        query: { "tuukh.tuluv": -2 },
      },
      {
        name: "Бусад",
        too: formatNumber(
          !!uilchiluulegchToololt &&
            uilchiluulegchToololt[0].tuluv.find((a) => a._id === -1)?.too,
          0
        ),
        query: { "tuukh.tuluv": { $in: [-1, -3] } },
      },
    ],
    [uilchiluulegchToololt, uilchluulegchGaralt]
  );

  /*function mashinOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
        <Button style={{ backgroundColor: "#209669", color: "#ffffff" }}>
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
          <ExceleesOruulakh
              ref={excelref}
              token={token}
              onFinish={onRefresh}
              barilgiinId={barilgiinId}
              zam="mashiniiExcelTatya"
              garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
              tailbar="Машины мэдээлэл оруулах excel файл"
              zagvariinZam="mashiniiExcelAvya"
          />
      ),
      footer,
    });
  }*/

  useEffect(() => {
    var ajiltnuud = [];
    uilchluulegchGaralt?.jagsaalt?.forEach((element) => {
      element.tuukh[0]?.burtgesenAjiltaniiId &&
        !ajiltnuud.find(
          (a) =>
            a.burtgesenAjiltaniiId === element.tuukh[0]?.burtgesenAjiltaniiId
        ) &&
        ajiltnuud.push(element.tuukh[0]?.burtgesenAjiltaniiId);
    });
    ajiltnuud.length > 0 &&
      uilchilgee(token)
        .get("/ajiltan", {
          params: { query: { _id: ajiltnuud.map((a) => a) } },
        })
        .then(({ data }) => {
          if (!!data && data?.jagsaalt?.length > 0) {
            setAjiltniiNers(
              data?.jagsaalt?.map((a) => {
                return { ner: a?.ner, id: a?._id };
              })
            );
          }
        });
  }, [uilchluulegchGaralt?.jagsaalt]);

  const columns = useMemo(() => {
    const shinecol =
      shuult.name === "Түрээслэгч"
        ? [
            {
              title: t("Талбай"),
              align: "center",
              width: "6rem",
              dataIndex: "mashin",
              render(v) {
                return v && v.ezemshigchiinTalbainDugaar;
              },
            },
            {
              title: t("Утас"),
              align: "center",
              width: "8rem",
              dataIndex: "mashin",
              render(v) {
                return v && v.ezemshigchiinUtas;
              },
            },
          ]
        : [];
    return [
      {
        title: "№",
        align: "center",
        dataIndex: "dugaar",
        width: "2rem",
        render: (text, record, index) =>
          (uilchluulegchGaralt?.khuudasniiDugaar || 0) *
            (uilchluulegchGaralt?.khuudasniiKhemjee || 0) -
          (uilchluulegchGaralt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: t("Орсон"),
        align: "center",
        width: "8rem",
        dataIndex: "tuukh.0.tsagiinTuukh.0.orsonTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v, parents) {
          const d = parents?.tuukh[0]?.tsagiinTuukh[0]?.orsonTsag;
          return d && moment(d).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Гарсан"),
        align: "center",
        width: "8rem",
        dataIndex: "tuukh.0.tsagiinTuukh.0.garsanTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v, parents) {
          const d = parents?.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag || parents?.tuukh[1]?.tsagiinTuukh[0]?.garsanTsag;
          return d && moment(d).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Төрөл"),
        align: "center",
        width: "8rem",
        dataIndex: "turul",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (v) => (!!v ? v : "Үйлчлүүлэгч"),
      },
      {
        title: t("Дугаар"),
        align: "center",
        width: "6rem",
        dataIndex: "mashiniiDugaar",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      ...shinecol,
      {
        title: t("Хугацаа/мин"),
        align: "center",
        width: "8rem",
        ellipsis: true,
        dataIndex: "tuukh",
        render(v) {
          const d1 = moment(v[0]?.tsagiinTuukh[0]?.orsonTsag);
          const d2 = moment(v[0]?.tsagiinTuukh[0]?.garsanTsag);
          const diff = d2.diff(d1, "minutes");
          return diff && diff;
        },
      },
      {
        title: t("Бодогдсон"),
        align: "right",
        width: "9rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "niitDun",
        render(v, parents) {
          return v && formatNumber(v, 0);
        },
      },
      {
        title: (
          <Popover
            placement="bottom"
            content={
              <div className="space-y-2">
                <div
                  onClick={() => setTulbur("")}
                  className={`relative ${
                    tulbur === "" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  Бүгд
                </div>
                <div
                  onClick={() => setTulbur("belen")}
                  className={`relative ${
                    tulbur === "belen" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  Бэлэн
                </div>
                <div
                  onClick={() => setTulbur("card")}
                  className={`relative ${
                    tulbur === "card" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  Карт
                </div>
                <div
                  onClick={() => setTulbur("khariltsakh")}
                  className={`relative ${
                    tulbur === "khariltsakh" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  Данс
                </div>
                <div
                  onClick={() => setTulbur("toki")}
                  className={`relative ${
                    tulbur === "toki" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  Токи
                </div>
                <div
                  onClick={() => setTulbur("kiosk")}
                  className={`relative ${
                    tulbur === "kiosk" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  Киоск
                </div>
                <div
                  onClick={() => setTulbur("khungulult")}
                  className={`relative ${
                    tulbur === "khungulult" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  Хөнгөлөлт
                </div>
              </div>
            }
          >
            <div
              className={`flex cursor-pointer items-center justify-center gap-3`}
            >
              <FilterOutlined className="text-lg text-green-600" />
              {t("Төлбөр")}
            </div>
          </Popover>
        ),
        align: "right",
        width: "9rem",
        dataIndex: "tuukh",
        render(v) {
          let r = null;
          let d = null;
          if (v[0]?.tulbur?.length > 1) {
            r = (
              <div className="flex justify-center">
                <Popover
                  content={() =>
                    v[0]?.tulbur.map((mur) => (
                      <div>
                        {tulburKhurvuulekh(mur.turul)}: {mur.dun}
                      </div>
                    ))
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <Button
                    icon={<ShareAltOutlined style={{ fontSize: "16px" }} />}
                  ></Button>
                </Popover>
              </div>
            );
          } else {
            r = tulburKhurvuulekh(v[0]?.tulbur[0]?.turul);
            d = formatNumber(v[0]?.tulbur[0]?.dun, 0);
          }
          return (
            r && (
              <div
                className={`flex items-center ${
                  d ? "justify-between" : "justify-center"
                } `}
              >
                <div>{r}</div>
                {d && <div>{d}</div>}
              </div>
            )
          );
        },
      },
      {
        title: t("И-Баримт"),
        align: "right",
        width: "9rem",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v, data) {
          var ebarimtDun = 0;
          if(data.ebarimtAvsanEsekh && data.tuukh[0]?.tulbur?.length > 0)
            ebarimtDun = data.tuukh[0]?.tulbur?.reduce((a, b) => a + (b.dun || 0), 0);
          return data.ebarimtAvsanEsekh ? formatNumber(ebarimtDun, 0) : "";
        },
      },
      {
        title: (
          <Popover
            placement="bottom"
            content={
              <div className="space-y-2">
                <div
                  onClick={() => {
                    setTuluv("");
                  }}
                  className={`relative ${
                    tuluv === "" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Бүгд")}
                </div>
                <div
                  onClick={() => {
                    setTuluv(1);
                  }}
                  className={`relative ${
                    tuluv === 1 && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Төлсөн")}
                </div>
                <div
                  onClick={() => {
                    setTuluv(0);
                  }}
                  className={`relative ${
                    tuluv === 0 && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Идэвхтэй")}
                </div>
                <div
                  onClick={() => {
                    setTuluv(5);
                  }}
                  className={`relative ${
                    tuluv === 5 && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Төлбөртэй")}
                </div>
                <div
                  onClick={() => {
                    setTuluv(4);
                  }}
                  className={`relative ${
                    tuluv === 4 && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Тодорхойгүй")}
                </div>
                <div
                  onClick={() => {
                    setTuluv(-2);
                  }}
                  className={`relative ${
                    tuluv === -2 && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Зөрчилтэй")}
                </div>
                <div
                  onClick={() => {
                    setTuluv(2);
                  }}
                  className={`relative ${
                    tuluv === 2 && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Үнэгүй")}
                </div>
              </div>
            }
          >
            <div
              className={`flex cursor-pointer items-center justify-center gap-3`}
            >
              <FilterOutlined className="text-lg text-green-600" />
              {t("Төлөв")}
            </div>
          </Popover>
        ),
        align: "center",
        width: "8rem",
        showSorterTooltip: false,
        dataIndex: "tuukh",
        render(v, data) {
          return (
            <div
              className={`${
                // (data.niitDun === 0 && v[0].tuluv !== -2) ||
                // data.turul === "Үнэгүй" ||
                // !!v[0].uneguiGarsan
                //   ? null
                //   :
                v[0].tuluv === 1 || v[0].tuluv === 2
                  ? "bg-green-500 text-white dark:bg-green-700"
                  : // : v[0].tuluv === 0
                  // ? "bg-yellow-500 text-white dark:bg-yellow-700"
                  v[0].tuluv === -2
                  ? "bg-red-500 text-white dark:bg-red-700"
                  : v[0].tuluv === 0 && data.niitDun > 0
                  ? "bg-yellow-500 text-white dark:bg-yellow-700"
                  : v[0]?.tuluv === 0 &&
                    !v[0]?.tsagiinTuukh?.[0]?.garsanTsag &&
                    moment
                      .duration(
                        moment().diff(
                          moment(v[0]?.tsagiinTuukh?.[0]?.orsonTsag)
                        )
                      )
                      .asHours() > shalgakhTsag
                  ? "bg-purple-500 text-white dark:bg-purple-700"
                  : v[0]?.tuluv === 0 && !v[0]?.garsanKhaalga
                  ? "bg-blue-500 text-white dark:bg-blue-700"
                  : v[0]?.tuluv === -3
                  ? "bg-stone-500 text-white dark:bg-stone-700"
                  : "bg-gray-500 text-white dark:bg-gray-700"
              } flex select-none items-center justify-center rounded-md border px-5 py-[2px] font-medium dark:text-white`}
            >
              {
                // (data.niitDun === 0 && v[0].tuluv !== -2) ||
                // (data.turul === "Үнэгүй" && v[0].tuluv !== -2) ||
                // (!!v[0].uneguiGarsan && v[0].tuluv !== -2)
                //   ? "Үнэгүй"
                //   :
                v[0].tuluv === 1 || v[0].tuluv === 2
                  ? "Төлсөн"
                  : v[0].tuluv === -2
                  ? "Зөрчилтэй"
                  : v[0].tuluv === 0 && data.niitDun > 0
                  ? "Төлбөртэй"
                  : v[0]?.tuluv === 0 &&
                    !v[0]?.tsagiinTuukh?.[0]?.garsanTsag &&
                    moment
                      .duration(
                        moment().diff(
                          moment(v[0]?.tsagiinTuukh?.[0]?.orsonTsag)
                        )
                      )
                      .asHours() > shalgakhTsag
                  ? "Тодорхойгүй"
                  : v[0]?.tuluv === 0 && !v[0]?.garsanKhaalga
                  ? "Идэвхтэй"
                  : v[0]?.tuluv === -3
                  ? "Цэвэрлэсэн"
                  : "Үнэгүй"
              }
            </div>
          );
        },
      },
      {
        title: t("Шалтгаан"),
        align: "center",
        dataIndex: "tuukh",
        width: "7rem",
        showSorterTooltip: false,
        render: (v, parent) => {
          if (parent.turul === "Үнэгүй" || parent.turul === "Дотоод") {
            return (
              <Tooltip
                placement="top"
                title={parent?.mashin?.temdeglel || parent?.zurchil}
              >
                <div className="max-w-[8rem] cursor-help truncate break-words">
                  {parent?.mashin?.temdeglel || parent?.zurchil}
                </div>
              </Tooltip>
            );
          } else if (parent.turul === "Гэрээт".trim()) {
            return (
              <div>
                {moment(parent?.mashin?.duusakhOgnoo).format("YYYY-MM-DD")}
              </div>
            );
          } else
            return (
              v && (
                <Tooltip
                  placement="top"
                  title={
                    v[0]?.tuluv === -1 ? v[0]?.uneguiGarsan : t(parent.zurchil)
                  }
                >
                  <div className="max-w-[8rem] cursor-help truncate break-words">
                    {v[0]?.tuluv === -1
                      ? v[0]?.uneguiGarsan
                      : !!parent.zurchil
                      ? t(parent.zurchil)
                      : ""}
                  </div>
                </Tooltip>
              )
            );
        },
      },
      {
        title: "Бүртгэсэн",
        align: "center",
        dataIndex: "tuukh",
        width: "7rem",
        showSorterTooltip: false,
        render: (v, parent) => {
          return (
            v && (
              <div>
                {String(v[0]?.burtgesenAjiltaniiNer).replace(/\D/g, "").length >
                9
                  ? ajiltniiNers.find(
                      (a) => a.id === v[0]?.burtgesenAjiltaniiId
                    )?.ner
                  : v[0]?.burtgesenAjiltaniiNer}
              </div>
            )
          );
        },
      },
      {
        title: () => <VideoCameraAddOutlined />,
        width: "2rem",
        align: "center",
        render: (data) => {
          return (<div className="flex justify-center">
            <Popover
              content={() =>
                data?.tuukh?.map((mur) => (
                  <div className="dark:text-gray-200">
                    {mur.orsonKhaalga}
                  </div>
                ))
              }
              placement="bottom"
              trigger="click"
            >
              <Button
                icon={<ShareAltOutlined style={{ fontSize: "16px" }} />}
              ></Button>
            </Popover>
          </div>)
        },
      },
      {
        title: () => <VideoCameraOutlined />,
        width: "2rem",
        align: "center",
        render: (data) => {
          return (<div className="flex justify-center">
            <Popover
              content={() =>
                data?.tuukh?.map((mur) => (
                  <div className="dark:text-gray-200">
                    {mur.garsanKhaalga}
                  </div>
                ))
              }
              placement="bottom"
              trigger="click"
            >
              <Button
                icon={<ShareAltOutlined style={{ fontSize: "16px" }} />}
              ></Button>
            </Popover>
          </div>)
        },
      },
      /*{
        title: () => <SettingOutlined />,
        width: "2rem",
        align: "center",
        render: (data) => (
          <div className="flex flex-row">
            <Popover
              placement="bottom"
              trigger="hover"
              content={() => (
                <div className="flex w-24 flex-col space-y-2">
                  <a
                    className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                    onClick={() => zogsoolBurtegye(data, "zasah")}
                  >
                    <EditOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Зөрчил нэмэх")}</label>
                  </a>
                </div>
              )}
            >
              <a className=" flex items-center justify-center  hover:scale-150 dark:hover:bg-gray-700">
                <MoreOutlined style={{ fontSize: "18px" }} />
              </a>
            </Popover>
          </div>
        ),
      },*/
    ];
  }, [shuult, i18n.language, ajiltniiNers, tulbur, tuluv, selectedRowkeys]);

  useEffect(() => {
    Aos.init({ once: true });
  });

  const exlCol = () => {
    const aa = columns;
    aa.splice(columns.length - 1, 1);
    return aa;
  };

  return (
    <Admin
      title="Зогсоол"
      khuudasniiNer="zogsool"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setUilchluulegchKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
      tsonkhniiId="61c2c7481c2830c4e6f90ce1"
      loading={isValidating}
    >
      <Card size="small" className="col-span-12 overflow-auto">
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:p-0 md:gap-6 2xl:grid-cols-12">
          {toololt.map((a, i) => (
            <div
              key={i}
              className={`zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2  border-green-600 sm:col-span-3 xl:col-span-2 2xl:col-span-2 ${
                a.name === shuult?.name ? "bg-green-50 dark:bg-gray-900" : ""
              }`}
              onClick={() => {
                setShuult({ query: a.query, name: a.name });
                setTuluv("");
              }}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
              data-aos-delay={1 + i + "00"}
            >
              <div className="h-full w-[67vw] rounded-xl md:w-auto">
                <div className="rounded-xl p-3">
                  <div className="flex flex-row items-center space-x-2">
                    <div className="text-3xl font-bold text-green-600">
                      {a.too || 0}
                    </div>
                    <div className="text-base text-gray-500">{t(a.name)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="col-span-12">
        <div className="grid-cols-2 gap-5 sm:grid xl:flex">
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="100"
            className="w-full xl:w-1/2"
          >
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              size="middle"
              value={ognoo}
              onChange={setOgnoo}
            />
          </div>
          {/*<Select
                defaultValue="lucy"
                style={{ width: 120 }}
                // onChange={handleChange}
                options={[jagsaalt.map((zogsool)=>({value: zogsool._id, label: zogsool.ner}))
                ]}
            />*/}
          <Select
            className="xl:w-[490px]"
            defaultValue="Бүгд"
            onChange={setZogsoolId}
          >
            <Select.Option value={false}>Бүгд</Select.Option>
            {jagsaalt.map((a) => (
              <Select.Option key={a._id} value={a._id}>
                {t(a.ner)}
              </Select.Option>
            ))}
          </Select>
          <div
            className=" flex w-full flex-col sm:flex-row sm:items-center sm:justify-end md:mb-0 md:ml-auto xl:justify-start"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            {/*<div className="flex flex-row space-x-2 p-1 font-medium">
              {t("Зогсоолын орлого")} : {formatNumber(!!uilchluulegchdiinDun[0]?.dun ? uilchluulegchdiinDun[0].dun : 0, 0)}
              ₮
            </div>*/}
            <div className="flex space-x-2 p-1 text-base font-medium xl:ml-5">
              {t("Нийт бодогдсон")} :{" "}
              {formatNumber(
                !!uilchluulegchdiinDun?.[0]?.niitDun
                  ? uilchluulegchdiinDun?.[0]?.niitDun
                  : 0,
                0
              )}
              ₮
            </div>
            <div className="flex space-x-2 p-1 text-base font-medium xl:ml-5">
              {t("Нийт төлсөн")} :{" "}
              {formatNumber(
                !!uilchluulegchdiinDun?.[0]?.dun
                  ? uilchluulegchdiinDun?.[0]?.dun
                  : 0,
                0
              )}
              ₮
            </div>
            <div className="flex space-x-2 p-1 text-base font-medium xl:ml-5">
              {t("Нийт хөнгөлсөн")} :{" "}
              {formatNumber(
                !!uilchluulegchdiinDun?.[0]?.khungulsun
                  ? uilchluulegchdiinDun?.[0]?.khungulsun
                  : 0,
                0
              )}
              ₮
            </div>
          </div>

          {/*<Radio.Group onChange={zogsoolChange} defaultValue={`${jagsaalt[0]?._id}`} buttonStyle="solid">
            <Radio.Button value={undefined}>Бүгд</Radio.Button>
            {
              jagsaalt?.map((zogsool)=>(
                  <Radio.Button value={`${zogsool._id}`}>{zogsool.ner}</Radio.Button>
              ))
            }
          </Radio.Group>*/}
          <div
            className="col-span-1 ml-auto flex w-fit place-content-end justify-start gap-4 xl:justify-end"
            data-aos="zoom-in-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            {/*<Select
                className="mb-3 w-max sm:mb-0 sm:mr-2 sm:w-auto"
                defaultValue="Бүгд"
                onChange={zogsoolChange}
            >
              {jagsaalt?.map((zogsool) => (
                  <Select.Option className="w-1/3 sm:w-auto" key={zogsool._id} value={zogsool._id}>
                    <div>{zogsool.ner}</div>
                  </Select.Option>
              ))}
            </Select>*/}
            <Popover
              content={() => (
                <div className="flex w-32 flex-col space-y-2">
                  {/*<a
                          className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                          onClick={mashinOruulakhExcel}
                      >
                        <UploadOutlined style={{ fontSize: "18px" }} />
                        <label>{t("Оруулах")}</label>
                      </a>*/}
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                    // onClick={() => {
                    //   excelTatajAvya(
                    //     token,
                    //     "zogsoolUilchluulegch",
                    //     uilchluulegchGaralt.niitMur,
                    //     exlCol(),
                    //     query,
                    //     order,
                    //     "Зогсоол"
                    //   );
                    // }}
                    onClick={() => {
                      const excel = new Excel();
                      uilchilgee(token)
                        .get("zogsoolUilchluulegch", {
                          params: {
                            order: order,
                            query: { ...que, ...query, },
                            khuudasniiKhemjee: uilchluulegchGaralt?.niitMur,
                          },
                        })
                        .then(({ data }) => {
                          excel
                            .addSheet("Жагсаалт")
                            .addColumns([
                              {
                                title: "№",
                                align: "center",
                                dataIndex: "dugaar",
                                width: "2rem",
                                render: (text, record, index) =>
                                  (data?.khuudasniiDugaar || 0) *
                                    (data?.khuudasniiKhemjee || 0) -
                                  (data?.khuudasniiKhemjee || 0) +
                                  index +
                                  1,
                              },
                              {
                                title: "Дугаар",
                                __style__: { h: "center" },
                                dataIndex: "mashiniiDugaar",
                                render: (v) => {
                                  return v && String(v).toUpperCase();
                                },
                              },
                              {
                                title: "Орсон",
                                __style__: { h: "center" },
                                dataIndex: "tuukh",
                                render: (v) => {
                                  const d =
                                    v?.length > 0 &&
                                    v[0]?.tsagiinTuukh[0]?.orsonTsag;
                                  return (
                                    d && moment(d).format("YYYY-MM-DD HH:mm")
                                  );
                                },
                              },
                              {
                                title: "Гарсан",
                                dataIndex: "tuukh",
                                __style__: { h: "center" },
                                render: (v) => {
                                  const d =
                                    v?.length > 0 &&
                                    (v[0]?.tsagiinTuukh[0]?.garsanTsag || v[1]?.tsagiinTuukh[0]?.garsanTsag);
                                  return (
                                    d && moment(d).format("YYYY-MM-DD HH:mm")
                                  );
                                },
                              },
                              {
                                title: "Хугацаа/мин",
                                __style__: { h: "center" },
                                dataIndex: "tuukh",
                                render: (v) => {
                                  const d1 = moment(
                                    v?.length > 0 &&
                                      v[0]?.tsagiinTuukh[0]?.orsonTsag
                                  );
                                  const d2 = moment(
                                    v?.length > 0 &&
                                      v[0]?.tsagiinTuukh[0]?.garsanTsag
                                  );
                                  const diff = d2.diff(d1, "minutes");
                                  return v?.length > 0 && diff && diff;
                                },
                              },
                              {
                                title: "Төрөл",
                                dataIndex: "turul",
                                __style__: { h: "center" },
                                render: (v) => (!!v ? v : "Үйлчлүүлэгч"),
                              },
                              {
                                title: "Дүн",
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render: (v) => {
                                  return v[0]?.tulukhDun || v[1]?.tulukhDun;
                                },
                              },
                              {
                                title: "Бодогдсон",
                                dataIndex: "niitDun",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render: (v) => {
                                  return v || 0;
                                },
                              },
                              {
                                title: "Төлбөр",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render: (v, data) => {
                                  return data.tuukh[0]?.tulbur?.reduce((a, b) => a + (b.dun || 0), 0);
                                },
                              },
                              {
                                title: "И-Баримт",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render: (v, data) => {
                                  var ebarimtDun = 0;
                                  if(data.ebarimtAvsanEsekh && data.tuukh[0]?.tulbur?.length > 0)
                                    ebarimtDun = data.tuukh[0]?.tulbur?.reduce((a, b) => a + (b.dun || 0), 0);
                                  return data.ebarimtAvsanEsekh ? ebarimtDun : 0;
                                },
                              },
                              {
                                title: t("Бэлэн"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render(v, p, i) {
                                  return (
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter((e) => e.turul === "belen")
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: t("Зээл"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                render(v, p, i) {
                                  return formatNumber(
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter((e) => e.turul === "zeel")
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: t("Дансаар"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render(v, p, i) {
                                  return (
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter(
                                            (e) => e.turul === "khariltsakh"
                                          )
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: t("Карт"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render(v, p, i) {
                                  return (
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter(
                                            (e) =>
                                              e.turul === "khaan" ||
                                              e.turul === "tdb" ||
                                              e.turul === "khas" ||
                                              e.turul === "golomt" ||
                                              e.turul === "kapitron" ||
                                              e.turul === "tur"
                                          )
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: t("Токи"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                render(v, p, i) {
                                  return formatNumber(
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter((e) => e.turul === "toki")
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: t("Киоск"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                render(v, p, i) {
                                  return formatNumber(
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter((e) => e.turul === "kiosk")
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: t("Хөнгөлөлт"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render(v, p, i) {
                                  return (
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter(
                                            (e) => e.turul === "khungulult"
                                          )
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: t("qpay"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render(v, p, i) {
                                  return (
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter((e) => e.turul === "qpay")
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: t("QPAY Урьдчилсан"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render(v, p, i) {
                                  return (
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter(
                                            (e) => e.turul === "qpayUridchilsan"
                                          )
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: t("Пос бэлэн"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render(v, p, i) {
                                  return (
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter(
                                            (e) => e.turul === "PosBelen"
                                          )
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: t("Пос карт"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render(v, p, i) {
                                  return (
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter((e) => e.turul === "PosCard")
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: t("Пос дансаар"),
                                dataIndex: "tuukh",
                                __style__: { h: "right" },
                                __numFmt__: "#,##0.00",
                                __cellType__: "TypeNumeric",
                                render(v, p, i) {
                                  return (
                                    (v[0]?.tulbur?.length > 0
                                      ? v[0]?.tulbur
                                          ?.filter(
                                            (e) => e.turul === "PosKhariltsakh"
                                          )
                                          .reduce(
                                            (a, b) => a + Number(b.dun || 0),
                                            0
                                          )
                                      : 0) || 0
                                  );
                                },
                              },
                              {
                                title: "Төлөв",
                                dataIndex: "tuukh",
                                __style__: { h: "center" },
                                render: (v) => {
                                  return v[0].tuluv === 1
                                    ? "Төлсөн"
                                    : v[0].tuluv === 0
                                    ? "Төлөөгүй"
                                    : v[0].tuluv === -2
                                    ? "Зөрчилтэй"
                                    : "";
                                },
                              },
                              {
                                title: "Шалтгаан",
                                dataIndex: "tuukh",
                                render: (v, parent) => {
                                  return v?.length > 0 && v[0]?.tuluv === -1
                                    ? v?.length > 0 && v[0]?.uneguiGarsan
                                    : !!parent.zurchil
                                    ? parent.zurchil
                                    : "";
                                },
                              },
                              {
                                title: "Бүртгэсэн",
                                dataIndex: "tuukh",
                                render: (v) => {
                                  return (
                                    v &&
                                    (String(
                                      v[0]?.burtgesenAjiltaniiNer
                                    ).replace(/\D/g, "").length > 9
                                      ? ajiltniiNers.find(
                                          (a) =>
                                            a.id === v[0]?.burtgesenAjiltaniiId
                                        )?.ner
                                      : v[0]?.burtgesenAjiltaniiNer)
                                  );
                                },
                              },
                              {
                                title: t("Орсон хаалга"),
                                dataIndex: "tuukh",
                                render: (v) => {
                                  var khaalguud = "";
                                  v?.map((a) => 
                                  {
                                    khaalguud = khaalguud + (khaalguud ? ", " : "" ) + a.orsonKhaalga;
                                  })
                                  return khaalguud;
                                },
                              },
                              {
                                title: t("Гарсан хаалга"),
                                dataIndex: "tuukh",
                                render: (v) => {
                                  var khaalguud = "";
                                  v?.map((a) => 
                                  {
                                    khaalguud = khaalguud + (khaalguud ? ", " : "" ) + (a.garsanKhaalga || "");
                                  })
                                  return khaalguud;
                                },
                              },
                            ])
                            .addDataSource(data?.jagsaalt)
                            .saveAs("Жагсаалт.xlsx");
                        })
                        .catch((aldaa) => aldaaBarigch(aldaa));
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
            <div className="flex items-start justify-center gap-1">
              <Button
                disabled={
                  selectedRowkeys && selectedRowkeys?.length > 0 ? false : true
                }
                type={`${
                  selectedRowkeys && selectedRowkeys?.length > 0
                    ? "tertiary"
                    : "default"
                }`}
                className="dark:bg-gray-800 dark:text-gray-200"
                onClick={() => tseverliy()}
              >
                Цэвэрлэх
                {selectedRowkeys &&
                  selectedRowkeys?.length > 0 &&
                  `(${selectedRowkeys?.length})`}
              </Button>
              {selectedRowkeys && selectedRowkeys?.length > 0 && (
                <Button onClick={tseverlekh}>
                  <CloseSquareFilled />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="400"
          data-aos-anchor-placement="top-bottom"
        >
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Машинаар",
                children: (
                  <Table
                    className="t-head"
                    loading={!uilchluulegchGaralt}
                    dataSource={uilchluulegchGaralt?.jagsaalt}
                    scroll={{ y: "calc(100vh - 30rem)" }}
                    tableLayout={"fixed"}
                    size="small"
                    rowClassName="hover:bg-blue-100"
                    bordered
                    rowSelection={rowSelection}
                    rowKey={"_id"}
                    columns={columns}
                    onChange={onChangeTable}
                    pagination={{
                      current: uilchluulegchGaralt?.khuudasniiDugaar,
                      pageSize: uilchluulegchGaralt?.khuudasniiKhemjee,
                      total: uilchluulegchGaralt?.niitMur,
                      showSizeChanger: true,
                      onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                        setUilchluulegchKhuudaslalt((kh) => ({
                          ...kh,
                          khuudasniiDugaar,
                          khuudasniiKhemjee,
                        })),
                    }}
                    summary={(e) => (
                      <AntdTable.Summary className="border " fixed={'bottom'}>
                        <AntdTable.Summary.Cell colSpan={7}>
                          <div className="space-x-2 truncate text-base font-bold ">
                            Нийт
                          </div>
                        </AntdTable.Summary.Cell>
                        <AntdTable.Summary.Cell>
                          <div className="truncate text-right font-bold ">
                            {formatNumber(
                              e?.reduce((a, b) => a + (b.niitDun || 0), 0),
                              2
                            )}
                          </div>
                        </AntdTable.Summary.Cell>
                        <AntdTable.Summary.Cell>
                          <div className="truncate text-right font-bold ">
                            {formatNumber(
                              e?.reduce((a, b) => a + (b?.tuukh[0]?.tulbur?.reduce((c, d) => c + (d.dun || 0), 0) || 0), 0),
                              2
                            )}
                          </div>
                        </AntdTable.Summary.Cell>
                        <AntdTable.Summary.Cell>
                          <div className="truncate text-right font-bold ">
                            {formatNumber(
                              e?.reduce((a, b) => a + (b?.ebarimtAvsanEsekh ? b?.tuukh[0]?.tulbur?.reduce((c, d) => c + (d.dun || 0), 0) : 0), 0),
                              2
                            )}
                          </div>
                        </AntdTable.Summary.Cell>
                      </AntdTable.Summary>
                    )}
                  />
                ),
              },
              {
                key: "2",
                label: "Мөнгөн дүнгээр",
                children: (
                  <Table
                    className="mt-8 hidden overflow-auto md:block"
                    tableLayout="auto"
                    loading={!uilchluulegchGaralt}
                    dataSource={uilchluulegchGaralt?.jagsaalt}
                    scroll={{ y: "calc(100vh - 30rem)" }}
                    size="small"
                    bordered
                    rowSelection={rowSelection}
                    rowKey={"_id"}
                    columns={columns}
                    onChange={onChangeTable}
                    pagination={{
                      current: uilchluulegchGaralt?.khuudasniiDugaar,
                      pageSize: uilchluulegchGaralt?.khuudasniiKhemjee,
                      total: uilchluulegchGaralt?.niitMur,
                      showSizeChanger: true,
                      onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                        setUilchluulegchKhuudaslalt((kh) => ({
                          ...kh,
                          khuudasniiDugaar,
                          khuudasniiKhemjee,
                        })),
                    }}
                    summary={(e) => (
                      <AntdTable.Summary className="border " fixed={'bottom'}>
                        <AntdTable.Summary.Cell colSpan={7}>
                          <div className="space-x-2 truncate text-base font-bold ">
                            Нийт
                          </div>
                        </AntdTable.Summary.Cell>
                        <AntdTable.Summary.Cell>
                          <div className="truncate text-right font-bold ">
                            {formatNumber(
                              e?.reduce((a, b) => a + (b.niitDun || 0), 0),
                              2
                            )}
                          </div>
                        </AntdTable.Summary.Cell>
                        <AntdTable.Summary.Cell>
                          <div className="truncate text-right font-bold ">
                            {formatNumber(
                              e?.reduce((a, b) => a + (b?.tuukh[0]?.tulbur?.reduce((c, d) => c + (d.dun || 0), 0) || 0), 0),
                              2
                            )}
                          </div>
                        </AntdTable.Summary.Cell>
                        <AntdTable.Summary.Cell>
                          <div className="truncate text-right font-bold ">
                            {formatNumber(
                              e?.reduce((a, b) => a + (b?.ebarimtAvsanEsekh ? b?.tuukh[0]?.tulbur?.reduce((c, d) => c + (d.dun || 0), 0) : 0), 0),
                              2
                            )}
                          </div>
                        </AntdTable.Summary.Cell>
                      </AntdTable.Summary>
                    )}
                  />

                ),
              },
            ]}
            onChange={(v) => setTootsooKhelber(v)}
          />
          <CardList
            cardListTuluv={"utas"}
            keyValue="uilchluulegch"
            className="block overflow-auto md:hidden"
            jagsaalt={uilchluulegchGaralt?.jagsaalt}
            Component={UilchluulegchTile}
          />
        </div>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Zogsool;
