import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Popover,
  Space,
  Table,
  Radio,
  Modal,
  TreeSelect,
  Form,
  message,
  Tooltip,
  Drawer,
  Select,
  notification,
} from "antd";
import {
  StarOutlined,
  CameraOutlined,
  WalletOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  PlusOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  DownOutlined,
  EyeOutlined,
  CloseOutlined,
  FilterOutlined,
  ShareAltOutlined,
  UploadOutlined,
  PrinterOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import useOrder from "tools/function/useOrder";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import useUilchluulegch, {
  useUilchluulegchZogsoolToo,
} from "hooks/useUilchluulegch";
import useJagsaalt from "../../../hooks/useJagsaalt";
import { modal } from "../../../components/ant/Modal";
import Tulbur from "../../../components/pageComponents/zogsool/Tulbur";
import _, { min } from "lodash";
import updateMethod from "../../../tools/function/crud/updateMethod";
import { excelTatajAvya } from "./index";
import useDansKhuulga from "../../../hooks/khuulga/useDansKhuulga";
import axios from "axios";
import { aldaaBarigch, socket } from "services/uilchilgee";
import useSWR from "swr";
import uilchilgee from "services/uilchilgee";
import { t } from "i18next";
import { Excel } from "antd-table-saveas-excel";
import { useKeyboardTovchlol } from "hooks/useKeyboardTovchlol";
import Stream1, { Stream2 } from "./stream";
import StackStream from "./stackStream";
import useUilchluulegchToo from "hooks/useUilchluulegchToo";
import TulburiinDelgerenguiTailan from "components/pageComponents/zogsool/TulburiinDelgerenguiTailan";
import ZogsoolCameraTable from "components/pageComponents/zogsool/ZogsoolCameraTable";

function TsagToololt({ ekhlekhTsag }) {
  const [timeUp, setTimeUp] = useState("Тооцоолж байна");

  const tsagTootsoolur = () => {
    var zoruu = moment(new Date()).diff(ekhlekhTsag, "seconds");
    var tsag = Math.floor(zoruu / 60 / 60);
    var minut = Math.floor((zoruu / 60) % 60);
    var second = zoruu - minut * 60 - tsag * 60 * 60;
    return (
      <div>
        {tsag < 10 && "0"}
        {tsag > 0 ? tsag : "0"} : {minut < 10 && "0"}
        {minut > 0 ? minut : "0"} : {second < 10 && "0"}
        {second > 0 ? second : "0"}
      </div>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setTimeUp(tsagTootsoolur());
    }, 1000);
  }, [ekhlekhTsag, timeUp]);
  return <div>{timeUp}</div>;
}

const usguud = [
  "А",
  "Б",
  "В",
  "Г",
  "Д",
  "Е",
  "Ё",
  "Ж",
  "З",
  "И",
  "Й",
  "К",
  "Л",
  "М",
  "Н",
  "О",
  "Ө",
  "П",
  "Р",
  "С",
  "Т",
  "У",
  "Ү",
  "Ф",
  "Х",
  "Ц",
  "Ч",
  "Ш",
  "Щ",
  "Ъ",
  "Ь",
  "Ы",
  "Э",
  "Ю",
  "Я",
];

function generateChild(mur, turul) {
  if (mur?.length > 0) {
    let res = [];
    for (let i = 0; i < mur.length; i++) {
      const a = mur[i];
      if (!!a?.turul) if (a.turul !== turul) continue;
      res.push({
        value: !!a?.ner ? a.ner : a?.cameraIP,
        title: !!a?.ner ? (
          a.ner + (a?.turul ? " / " + a?.turul : "")
        ) : (
          <b key={a?.cameraIP} className="text-green-400 hover:text-green-800">
            {t("Камер")}-{a?.cameraIP}
          </b>
        ),
        children: generateChild(!!a?.khaalga ? a.khaalga : a?.camera, turul),
        disabled: false,
        disableCheckbox: true,
        selectable: !a?.ner,
        checkable: !a?.ner,
      });
    }
    return res;
  }
  return [];
}

function tulburKhurvuulekh(v) {
  var utga = undefined;
  switch (v) {
    case "belen":
      utga = "Бэлэн";
      break;
    case "khariltsakh":
      utga = "Харилцах";
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
    default:
      utga = v;
      break;
  }
  return utga;
}

/*const TreeComponent = ()=>{
    const { TreeNode } = Tree;

    const TreeComponent = ({ hierarchy }) => {
        const renderTreeNodes = data =>
            data.map(item => {
                if (item.children) {
                    return (
                        <TreeNode title={item.title} key={item.key} dataRef={item}>
                            {renderTreeNodes(item.children)}
                        </TreeNode>
                    )
                }
                return <TreeNode key={item.key} {...item} />
            })

        return (
            <Tree>
                {renderTreeNodes(hierarchy)}
            </Tree>
        )
    }
}*/

/**
 * Эхний байдлаар зөвхөн 1 зогсоол дээр төлбөр тооцхоор шийдлээ
 * дотороо зогсоолтой тохиолдолд өөрчилнө
 * */

function camera({ token }) {
  const { t, i18n } = useTranslation();
  const { baiguullaga, ajiltan, barilgiinId } = useAuth();
  const [ognoo, setOgnoo] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);
  const [turul, setTurul] = useState(undefined);
  // const [songosonMashin, setSongosonMashin] = useState(undefined);
  const tulburRef = React.useRef(null);
  const mashiniiDugaarRef = React.useRef(null);
  const tailanRef = React.useRef(null);
  // const { order, onChangeTable } = useOrder({"tuukh.0.tsagiinTuukh.0.garsanTsag":-1});
  const { order, onChangeTable, setOrder } = useOrder({
    "tuukh.tsagiinTuukh.garsanTsag": -1,
  });
  const [modalOpen, setModalOpen] = useState({
    bool: false,
    item: null,
    type: "",
  });
  const [value, setValue] = useState(null);
  const [camerVal, setCamerVal] = useState([null, null]);
  const [cameraData, setCameraData] = useState([null, null]);
  const [cameraKharakh, setCamerKharakh] = useState(false);
  const [guilgeeKharakh, setGuilgeeKharakh] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [khelber, setKhelber] = useState("");
  const [dun, setDun] = useState("");
  const [khaikh, setKhaikh] = useState("");
  // const [refresh, setRefresh] = useState(true);
  const [modalNeelttei, setModalNeelttei] = useState(false);
  const [form] = Form.useForm();

  const que = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
      "khaalga.ajiltnuud.id": ajiltan?._id,
    };
  }, [baiguullaga?._id, ajiltan, barilgiinId]);

  const { jagsaalt } = useJagsaalt("/zogsoolJagsaalt", que);

  const query = useMemo(() => {
    let result = {};
    if (!!camerVal[1]) {
      if (!!khaikh) {
        // use uilchilgee search hiih regex querynd daragdsan uhchir queryn dotor search regex bijiw
        result = {
          $and: [
            {
              $or: [
                {
                  "tuukh.0.garsanKhaalga": camerVal[1],
                  "tuukh.tsagiinTuukh.garsanTsag": {
                    $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
                    $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
                  },
                },
                {
                  "tuukh.0.garsanKhaalga": { $exists: false },
                  createdAt: {
                    $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
                    $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
                  },
                },
              ],
            },
            {
              $or: [{ mashiniiDugaar: { $regex: khaikh, $options: "i" } }],
            },
          ],
          ...result,
        };
      } else
        result = {
          $or: [
            {
              "tuukh.0.garsanKhaalga": camerVal[1],
              "tuukh.tsagiinTuukh.garsanTsag": {
                $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
              },
            },
            {
              "tuukh.0.garsanKhaalga": { $exists: false },
              createdAt: {
                $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
              },
            },
          ],
          ...result,
        };
    } else
      result = {
        $or: [
          {
            "tuukh.tsagiinTuukh.garsanTsag": {
              $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
              $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
            },
          },
          {
            createdAt: {
              $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
              $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
            },
          },
        ],
      };
    if (!!khelber) {
      if (khelber === "tuluugui") {
        result = {
          "tuukh.tulbur.0": { $exists: false },
          ...result,
        };
      } else
        result = {
          "tuukh.tulbur.turul":
            !!khelber && khelber === "card"
              ? { $in: ["khaan", "tdb", "khas", "golomt", "kapitron", "tur"] }
              : khelber,
          ...result,
        };
    }
    if (!!dun) {
      result = {
        "tuukh.tulukhDun":
          !!dun && dun === "dunBodson"
            ? { $gt: 0 }
            : { $in: [0, null, undefined] },
        ...result,
      };
    }
    return result;
  }, [ognoo, khelber, dun, camerVal, khaikh]);

  const dansQuery = useMemo(() => {
    return { Amt: { $gt: 0, $lt: 1000000 } };
  }, [ognoo]);

  useEffect(() => {
    Aos.init({ once: true });
  });

  useEffect(() => {
    var data = localStorage.getItem("CamerVal");
    data = JSON.parse(data);
    if (!!data) {
      setCamerVal(data);
    }
  }, []);

  useEffect(() => {
    const a1 = generateChild(jagsaalt, "Орох");
    const a2 = generateChild(jagsaalt, "Гарах");
    setCameraData([a1, a2]);
  }, [jagsaalt]);
  useEffect(() => {
    socket().on(`zogsool${baiguullaga?._id}`, (zogsool) => {
      var uilchluulegch = zogsool;
      if (uilchluulegch) {
        console.log("uilchluulegch", uilchluulegch);
        axios
          .get(
            `http://localhost:5000/api/sambar/${uilchluulegch?.tuukh?.[0]?.garsanKhaalga}/${uilchluulegch?.mashiniiDugaar}/${uilchluulegch?.niitDun}`
          )
          .then((res) => {
            if (res) {
              console.log("amjilttai:", res);
            }
          })
          .catch((err) => {
            console.log("aldaa:", err);
          });
      }
      if (
        !!uilchluulegch?.khaalgaTurul &&
        uilchluulegch?.khaalgaTurul === "oroh" &&
        !!uilchluulegch?.cameraIP
      ) {
        console.log("orohKhaalga", uilchluulegch?.cameraIP);
        khaalgaNeey(uilchluulegch?.cameraIP);
      } else {
        onRefresh();
      }
      if (
        uilchluulegch?.turul === "Үнэгүй" ||
        (uilchluulegch?.tuukh &&
          uilchluulegch?.tuukh?.length > 0 &&
          uilchluulegch?.tuukh?.[0]?.tulukhDun === 0 &&
          uilchluulegch?.niitDun === 0)
      ) {
        if (
          uilchluulegch?.tuukh &&
          uilchluulegch?.tuukh?.length > 0 &&
          !!uilchluulegch?.tuukh?.[0]?.garsanKhaalga
        ) {
          console.log(
            "garakhHkaalga",
            uilchluulegch?.tuukh?.[0]?.garsanKhaalga
          );
          khaalgaNeey(uilchluulegch?.tuukh?.[0]?.garsanKhaalga);
        }
      }
      // console.log(uilchluulegch);
      // if (!!uilchluulegch) {
      //   if (uilchluulegchGaralt) {
      //     uilchluulegchGaralt.jagsaalt = uilchluulegchGaralt?.jagsaalt?.filter(
      //       (a) => a.mashiniiDugaar !== uilchluulegch.mashiniiDugaar
      //     );
      //     uilchluulegchGaralt.jagsaalt.unshift(uilchluulegch);
      //     setRefresh(!refresh);
      //   }
      //   console.log(
      //     "uilchluulegchGaralt?.jagsaalt",
      //     uilchluulegchGaralt?.jagsaalt
      //   );
      // }
    });
    return () => {
      socket().off(`zogsool${baiguullaga?._id}`);
    };
  }, [baiguullaga]);

  const {
    uilchluulegchGaralt,
    setUilchluulegchKhuudaslalt,
    uilchluulegchMutate,
    isValidating,
  } = useUilchluulegch(token, baiguullaga?._id, query, order);

  const tooQuery = useMemo(() => {
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();
    return {
      "tuukh.tsagiinTuukh.garsanTsag": { $exists: false },
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd,
      },
      "tuukh.tuluv": { $ne: -2 },
    };
  }, [uilchluulegchGaralt]);

  const { uilchluulegchTooGaralt, uilchluulegchTooMutate } =
    useUilchluulegchToo(token, baiguullaga?._id, tooQuery);

  // console.log("---------", uilchluulegchGaralt);

  useKeyboardTovchlol("F4", f5Darsan);
  useKeyboardTovchlol("F1", f3Darsan);
  useKeyboardTovchlol("F2", f4Darsan);
  useKeyboardTovchlol("+", nemekhDarsan);
  useKeyboardTovchlol("-", khasakhDarsan);

  function f3Darsan() {
    khaalgaNeey(camerVal[0]);
    document.getElementById("neekhKhaalgaID").focus();
  }

  function f4Darsan() {
    khaalgaNeey(camerVal[1]);
    document.getElementById("khaakhkhaalgaID").focus();
  }

  function f5Darsan() {
    const data = uilchluulegchGaralt?.jagsaalt?.[0];
    const mur = data?.tuukh?.[0];
    if (!data) {
      return notification.error({
        message: "Мэдээлэл алга",
        duration: 1,
      });
    }
    if (mur?.tuluv === 0 && (!!mur?.tulukhDun || data?.niitDun)) {
      if (modalNeelttei === false) {
        setModalNeelttei(true);
        return tulburTulyu(mur, data?._id, data?.mashiniiDugaar, data?.niitDun);
      }
    } else
      return notification.warning({
        message: "Төлбөр бодогдох боломжгүй",
        duration: 1,
      });
  }

  function nemekhDarsan() {
    setModalOpen({
      bool: true,
      item: null,
      type: "dugaarBurtgekh",
    });
    !!camerVal[0] && form.setFieldValue("CAMERA_IP", camerVal[0]);
    setTimeout(() => {
      mashiniiDugaarRef.current.focus();
    }, 200);
  }
  function khasakhDarsan() {
    setModalOpen({
      bool: true,
      item: null,
      type: "dugaarBurtgekh",
    });
    !!camerVal[1] && form.setFieldValue("CAMERA_IP", camerVal[1]);
    setTimeout(() => {
      mashiniiDugaarRef.current.focus();
    }, 200);
  }

  const tooQue = useMemo(() => {
    return {
      ekhlekhOgnoo: moment().startOf("day").format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment().endOf("day").format("YYYY-MM-DD 23:59:59"),
    };
  }, [uilchluulegchGaralt]);
  // console.log('----000', uilchluulegchTooGaralt);

  const { zogsoolTusBuriinToo, zogsoolTusBuriinTooMutate } =
    useUilchluulegchZogsoolToo(token, tooQue);
  // console.log('----zogsoolTusBuriinToo', zogsoolTusBuriinToo);
  const dasniiMedeelel = {
    baiguullagiinId: baiguullaga?._id,
    bank: "tdb",
    barilgiinId: barilgiinId,
    corporateAshiglakhEsekh: true,
    corporateNevtrekhNer: "ikhnayd",
    corporateNuutsUg: "Tsetseglen@8888",
    createdAt: "2023-08-23T10:30:21.364Z",
    dansniiNer: "Их Наяд Плаза Зогсоол",
    dugaar: "416075707",
    updatedAt: "2023-08-23T10:30:21.364Z",
    valyut: "MNT",
    __v: 0,
    _id: "61f23b53d75a1b62d86f2987",
  };
  const {
    dansniiKhuulgaGaralt,
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaMutate,
  } = useDansKhuulga(
    token,
    baiguullaga?._id,
    dasniiMedeelel,
    [
      moment().subtract(30, "days").format("YYYY-MM-DD 00:00:00"),
      moment().format("YYYY-MM-DD 23:59:59"),
    ],
    { createdAt: -1 },
    dansQuery
  );

  function onRefresh() {
    uilchluulegchMutate();
    uilchluulegchTooMutate();
    dansniiKhuulgaMutate();
  }
  const minToHour = (m) => {
    let res;
    if (m < 60) res = m + " мин";
    else {
      const h = Math.floor(m / 60);
      const min = m % 60;
      res = h + " цаг " + (min && min + " мин");
    }
    return res;
  };
  function tulburTulyu(data, uilchluugchiinId, mashiniiDugaar, niitDun, index) {
    modal({
      title: (
        <div className="flex w-full flex-row justify-between">
          <div>{t("Тооцоо хийх")}</div>
          <div className="flex items-center">
            {mashiniiDugaar}
            <div
              className="ml-5 text-xl hover:text-red-400"
              onClick={() => tulburRef.current.khaaya()}
            >
              <CloseCircleOutlined />
            </div>
          </div>
        </div>
      ),
      content: (
        <Tulbur
          suuliikhEsekh={index === 0}
          niitDun={niitDun}
          camerVal={camerVal[1]}
          ref={tulburRef}
          data={_.cloneDeep(data)}
          token={token}
          baiguullaga={baiguullaga}
          barilgiinId={barilgiinId}
          ajiltan={ajiltan}
          uilchluugchiinId={uilchluugchiinId}
          onRefresh={onRefresh}
          setModalNeelttei={setModalNeelttei}
        />
      ),
      footer: false,
    });
  }
  const columns = useMemo(() => {
    const col = [
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
        title: t("Дугаар1"),
        align: "center",
        width: "10rem",
        dataIndex: "mashiniiDugaar",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (a) => (
          <div
            onClick={() => {
              navigator.clipboard.writeText(String(a).toUpperCase());
              message.success(`${String(a).toUpperCase()} дугаарыг хууллаа`);
            }}
            className="flex cursor-copy items-center justify-center gap-3"
          >
            {String(a).toUpperCase()}
            <CopyOutlined className="text-lg text-gray-300" />
          </div>
        ),
      },
    ];
    return [
      ...col,
      {
        title: t("Орсон"),
        align: "center",
        width: "10rem",
        dataIndex: "tuukh.tsagiinTuukh.orsonTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v, p) {
          const d = p.tuukh[0]?.tsagiinTuukh[0]?.orsonTsag;
          return d && moment(d).format("MM-DD HH:mm");
        },
      },
      {
        title: t("Гарсан"),
        align: "center",
        width: "10rem",
        dataIndex: "tuukh.tsagiinTuukh.garsanTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v, p) {
          const d = p.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag;
          return d && moment(d).format("MM-DD HH:mm");
        },
      },
      {
        title: (
          <Popover
            placement="bottom"
            content={
              <div className="space-y-2">
                <div
                  onClick={() =>
                    setOrder({
                      "tuukh.0.niitKhugatsaa": -1,
                    })
                  }
                  className={`relative flex ${
                    JSON.stringify(order) ==
                      JSON.stringify({ "tuukh.0.niitKhugatsaa": -1 }) &&
                    "bg-green-500 text-white"
                  } cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Удаан зогссон эхэнд")}
                </div>
                <div
                  onClick={() =>
                    setOrder({
                      "tuukh.tsagiinTuukh.orsonTsag": -1,
                    })
                  }
                  className={`relative ${
                    JSON.stringify(order) ==
                      JSON.stringify({ "tuukh.tsagiinTuukh.orsonTsag": -1 }) &&
                    "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Сүүлд орсон эхэнд")}
                </div>
                <div
                  onClick={() =>
                    setOrder({
                      "tuukh.tsagiinTuukh.garsanTsag": -1,
                    })
                  }
                  className={`relative ${
                    JSON.stringify(order) ==
                      JSON.stringify({ "tuukh.tsagiinTuukh.garsanTsag": -1 }) &&
                    "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Сүүлд гарсан эхэнд")}
                </div>
              </div>
            }
          >
            <div
              className={`flex cursor-pointer items-center justify-center gap-3`}
            >
              <FilterOutlined className="text-lg text-green-600" />
              {t("Хугацаа/мин")}
            </div>
          </Popover>
        ),
        align: "center",
        width: "10rem",
        dataIndex: "tuukh.0.niitKhugatsaa",
        render(v, parents) {
          const d2 = tsagTootsoolur(
            parents?.tuukh[0]?.tsagiinTuukh[0]?.orsonTsag
          );
          if (parents?.zurchil === "Гарсан цаг тодорхойгүй!") {
            return (
              <div className="rounded bg-red-200 px-3 py-1 text-slate-700">
                -- : -- : --
              </div>
            );
          } else
            return !!parents?.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag ? (
              <div
                className={`rounded px-3 py-1 text-slate-700 ${
                  !!parents.zurchil &&
                  parents.zurchil !== "" &&
                  parents?.tuukh[0]?.tuluv === -2
                    ? "bg-red-200"
                    : "bg-green-200"
                }`}
              >
                {minToHour(
                  parents?.tuukh?.reduce(
                    (a, b) => a + (b.niitKhugatsaa || 0),
                    0
                  )
                )}
              </div>
            ) : (
              <div className="rounded bg-blue-200 px-3 py-1 text-slate-700">
                {/* {d2.hours.length < 2 ? "0" + d2.hours : d2.hours} :{" "}
                {d2.minutes.length < 2 ? "0" + d2.minutes : d2.minutes} */}
                <TsagToololt
                  ekhlekhTsag={parents?.tuukh[0]?.tsagiinTuukh[0]?.orsonTsag}
                />
              </div>
            );
        },
      },
      {
        title: t("Төрөл"),
        align: "center",
        width: "10rem",
        dataIndex: "turul",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (a, b) => {
          var ekhlekhOgnoo = moment(b?.mashin?.ekhlekhOgnoo).diff(
            new Date(),
            "d"
          );
          var duusakhOgnoo = moment(b?.mashin?.duusakhOgnoo).diff(
            new Date(),
            "d"
          );
          return !!a ? (
            a === "Гэрээт" ? (
              <Tooltip
                title={`${moment(b.mashin.ekhlekhOgnoo).format(
                  "YYYY-MM-DD"
                )}-/аас⁴/ ${moment(b.mashin.duusakhOgnoo).format(
                  "YYYY-MM-DD"
                )} хүртэл гэрээ байгуулсан ба гэрээ ${
                  duusakhOgnoo < 0
                    ? "дууссан"
                    : ekhlekhOgnoo > 0
                    ? "эхлээгүй"
                    : "идэвхитэй"
                } байна.`}
              >
                <div className="flex items-center justify-center">
                  <div
                    className={`flex cursor-help rounded-md border-white px-3 ${
                      a === "Гэрээт" && duusakhOgnoo < 0
                        ? " border bg-red-400 font-medium text-white"
                        : ekhlekhOgnoo > 0
                        ? " border bg-blue-400 font-medium text-white"
                        : ""
                    }`}
                  >
                    {a}
                  </div>
                </div>
              </Tooltip>
            ) : (
              a
            )
          ) : (
            "Үйлчлүүлэгч"
          );
        },
      },
      {
        title: (
          <Popover
            placement="bottom"
            content={
              <div className="space-y-2">
                <div
                  onClick={() => setDun("")}
                  className={`relative ${
                    dun === "" && "bg-green-500 text-white"
                  } flex cursor-pointer justify-center rounded-md border px-5 py-[2px] font-medium  hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Бүгд1")}
                </div>
                <div
                  onClick={() => setDun("dunBodson")}
                  className={`relative ${
                    dun === "dunBodson" && "bg-green-500 text-white"
                  } flex cursor-pointer justify-center rounded-md border px-5 py-[2px] font-medium  hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Дүн бодсон")}
                </div>
                <div
                  onClick={() => setDun("dunBodoogui")}
                  className={`relative ${
                    dun === "dunBodoogui" && "bg-green-500 text-white"
                  } flex cursor-pointer justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Дүн бодоогүй")}
                </div>
              </div>
            }
          >
            <div
              className={`flex cursor-pointer  items-center justify-center gap-3 `}
            >
              <FilterOutlined className="text-lg text-green-600" />
              {t("Дүн")}
            </div>
          </Popover>
        ),
        align: "right",
        width: "10rem",
        dataIndex: "tuukh.tulukhDun",
        render(v, p) {
          // console.log(p.tuukh[0]?.tulukhDun, '======')
          return p && formatNumber(p.niitDun || p.tuukh[0]?.tulukhDun || 0, 0);
        },
        summary: true,
      },
      {
        title: (
          <Popover
            placement="bottom"
            content={
              <div className="space-y-2">
                <div
                  onClick={() => setKhelber("")}
                  className={`relative ${
                    khelber === "" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Бүгд")}
                </div>
                <div
                  onClick={() => setKhelber("belen")}
                  className={`relative ${
                    khelber === "belen" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Бэлэн")}
                </div>
                <div
                  onClick={() => setKhelber("card")}
                  className={`relative ${
                    khelber === "card" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white`}
                >
                  {t("Карт")}
                </div>
                <div
                  onClick={() => setKhelber("khariltsakh")}
                  className={`relative ${
                    khelber === "khariltsakh" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  {t("Харилцах")}
                </div>
                <div
                  onClick={() => setKhelber("tuluugui")}
                  className={`relative ${
                    khelber === "tuluugui" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  {t("Төлөөгүй")}
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
        align: "center",
        dataIndex: "tuukh",
        width: "7rem",
        showSorterTooltip: false,
        render: (v) => {
          let r = null;
          if (v[0]?.tulbur?.length > 1) {
            r = (
              <div className="flex justify-center">
                <Popover
                  content={() =>
                    v[0]?.tulbur.map((mur) => (
                      <div>
                        {t(tulburKhurvuulekh(mur.turul))}: {mur.dun}
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
          } else r = tulburKhurvuulekh(v[0]?.tulbur[0]?.turul);
          return r && <div>{v[0]?.tulbur?.length > 1 ? r : t(r)}</div>;
        },
      },
      {
        title: t("Төлөв"),
        align: "center",
        width: "10rem",
        dataIndex: "tuukh.tuluv",
        render(v, parent, index) {
          const mur = parent.tuukh[0];
          if (parent.turul === "Үнэгүй") {
            return (
              <div className="mx-auto flex w-max cursor-pointer items-center justify-center space-x-2 rounded bg-gray-500 px-3 text-white">
                <div className="flex items-center justify-center">
                  {t("Үнэгүй")}
                </div>
              </div>
            );
          } else
            return (mur.tuluv === 0 ||
              parent?.zurchil === "Гарсан цаг тодорхойгүй!") &&
              !!mur?.tulukhDun ? (
              <Popover
                placement="bottom"
                trigger="hover"
                content={() => (
                  <div className="flex w-24 flex-col space-y-2">
                    <a
                      className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        !!mur?.tulukhDun
                          ? tulburTulyu(
                              mur,
                              parent._id,
                              parent?.mashiniiDugaar,
                              parent?.niitDun,
                              index
                            )
                          : notification.warn({
                              message: t("Дүн бодогдоогүй байна."),
                            });
                      }}
                    >
                      <WalletOutlined style={{ fontSize: "18px" }} />
                      <label>{t("Төлөх")}</label>
                    </a>
                    <a
                      className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                      onClick={() =>
                        setModalOpen({
                          bool: true,
                          item: parent,
                          type: "unegui",
                        })
                      }
                    >
                      <StarOutlined style={{ fontSize: "18px" }} />
                      <label>{t("Үнэгүй")}</label>
                    </a>
                  </div>
                )}
              >
                <Button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FF8505",
                  }}
                  size="small"
                >
                  <div className="flex items-center  justify-center space-x-2 text-white">
                    <div className="flex items-center justify-center">
                      <DollarCircleOutlined />
                    </div>
                    <div className="flex items-center justify-center">
                      {t("Төлбөр")} {index === 0 && "[ F4 ]"}
                    </div>
                  </div>
                </Button>
              </Popover>
            ) : mur?.tuluv === 0 && !mur?.tsagiinTuukh[0]?.garsanTsag ? (
              <div className="mx-auto flex w-max cursor-pointer items-center justify-center space-x-2 rounded bg-blue-500 px-3 text-white">
                <div className="flex items-center justify-center">
                  {t("Идэвхтэй")}
                </div>
              </div>
            ) : mur?.tuluv === 1 ? (
              mur?.ebarimtAvsanEsekh === false ? (
                <div
                  onClick={() =>
                    tulburTulyu(
                      mur,
                      parent?._id,
                      parent?.mashiniiDugaar,
                      parent?.niitDun
                    )
                  }
                  className="mx-auto flex w-max items-center justify-center space-x-2 rounded bg-blue-500 px-3 text-white"
                >
                  <div className="flex items-center justify-center">
                    {t("И-Баримт")}
                  </div>
                </div>
              ) : (
                <div className="mx-auto flex w-max items-center justify-center space-x-2 rounded bg-lime-500 px-3 text-white">
                  <div className="flex items-center justify-center">
                    {t("Төлөгдсөн")}
                  </div>
                </div>
              )
            ) : !!parent.zurchil &&
              parent.zurchil !== "" &&
              mur?.tuluv === -2 ? (
              <div className="mx-auto flex w-max cursor-pointer items-center justify-center space-x-2 rounded bg-red-500 px-3 text-white">
                <div className="flex items-center justify-center">
                  {t("Зөрчилтэй")}
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-max cursor-pointer items-center justify-center space-x-2 rounded bg-gray-500 px-3 text-white">
                <div className="flex items-center justify-center">
                  {t("Үнэгүй")}
                </div>
              </div>
            ); /*v[0]?.ebarimtAvsanEsekh ? (
                        <div className="mx-auto flex w-max items-center bg-lime-500 rounded justify-center space-x-2 text-white px-3">
                            <div className="flex items-center justify-center">
                                <CheckCircleOutlined />
                            </div>
                            <div className="flex items-center justify-center">
                                {t("Төлөгдсөн")}
                            </div>
                        </div>
                    ) : (
            <Button
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#253985",
              }}
              size="small"
              onClick={() => tulburTulyu(v[0], parent._id)}>
              <div className="flex items-center  justify-center space-x-2 text-white ">
                <div className="flex items-center justify-center">
                  <PaperClipOutlined />
                </div>
                <div className="flex items-center justify-center">
                  {t("И-Баримт")}
                </div>
              </div>
            </Button>
          );*/
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
              <Tooltip placement="top" title={parent?.mashin?.temdeglel}>
                <div className="max-w-[8rem] cursor-help truncate break-words">
                  {parent?.mashin?.temdeglel}
                </div>
              </Tooltip>
            );
          } else if (parent.turul === "Гэрээт") {
            return (
              <div className="max-w-[8rem] cursor-help truncate break-words">
                {!!parent?.zurchil
                  ? parent?.zurchil
                  : parent?.mashin?.temdeglel}
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
        title: () => <SettingOutlined />,
        width: "2rem",
        align: "center",
        render: (data) => {
          return data.tuukh[0].tulbur.length === 0 &&
            data.tuukh[0].tulukhDun !== 0 &&
            data?.zurchil !== "Гарсан цаг тодорхойгүй!" ? (
            <div className="flex flex-row">
              <a
                className="ant-dropdown-link flex w-full items-center justify-center rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                onClick={() =>
                  setModalOpen({
                    bool: true,
                    item: data,
                    type: "zurchil",
                  })
                }
              >
                <ExclamationCircleOutlined
                  style={{ fontSize: "18px", marginRight: "3px" }}
                />
              </a>
            </div>
          ) : null;
        },
      },
    ];
  }, [
    turul,
    i18n.language,
    ajiltan,
    baiguullaga,
    barilgiinId,
    order,
    khelber,
    dun,
    uilchluulegchGaralt,
  ]);

  const baganuud = [
    {
      title: "№",
      width: "2.5rem",
      align: "center",
      dataIndex: "description",
      render: (v, index, key) => key + 1,
    },
    {
      title: t("Огноо"),
      width: "6rem",
      align: "center",
      dataIndex: "createdAt",
      render: (data) => {
        return moment(data).format("MM/DD HH:mm");
      },
    },
    {
      title: t("Утга"),
      width: "10rem",
      align: "center",
      dataIndex: "description",
      render: (_v, e) => {
        return (
          <Tooltip
            placement="top"
            title={e?.description ? e?.description : e?.TxAddInf}
            mouseLeaveDelay={0}
            mouseEnterDelay={1}
          >
            <div className="truncate text-left">
              {e?.description ? e?.description : e?.TxAddInf}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: t("Дүн"),
      width: "4rem",
      dataIndex: "amount",
      align: "center",
      render(_v, e) {
        return (
          (e?.amount || e?.Amt) && (
            <div className="text-right">
              {formatNumber(e?.amount ? e?.amount : e?.Amt, 0)} ₮
            </div>
          )
        );
      },
    },
  ];
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const cameraChange = (e, type) => {
    if (type === 1) {
      setCamerVal([e, camerVal[1]]);
      localStorage.setItem("CamerVal", JSON.stringify([e, camerVal[1]]));
    } else {
      setCamerVal([camerVal[0], e]);
      localStorage.setItem("CamerVal", JSON.stringify([camerVal[0], e]));
      // setGarakhKhaalgaIp(e);
    }
  };
  const khadgalakh = () => {
    uilchilgee(token)
      .get("ognooAvya")
      .then(({ data }) => {
        if (!!data) {
          let body = modalOpen.item;
          if (modalOpen.type === "zurchil") {
            if (!value || value === "" || value === undefined) {
              message.warn("Зөрчлийн шалтгаан оруулна уу!");
              return;
            }
            body.zurchil = value;
            body.tuukh[0].tuluv = -2;
            if (!!camerVal[1] && value === "Зугтаасан") {
              body.tuukh[0].garsanKhaalga = camerVal[1];
              body.tuukh[0].tsagiinTuukh[0].garsanTsag = data;
              body.tuukh[0].niitKhugatsaa = moment(data).diff(
                body.tuukh[0].tsagiinTuukh[0].orsonTsag,
                "minutes"
              );
            }
          } else if (modalOpen.type === "dugaarBurtgekh") {
            form.submit();
          } else {
            body.tuukh[0].uneguiGarsan = value;
            body.tuukh[0].tuluv = -1;
          }
          if (modalOpen.type !== "dugaarBurtgekh") {
            updateMethod("zogsoolUilchluulegch", token, body).then(
              ({ data }) => {
                if (data === "Amjilttai") {
                  message.success(t("Амжилттай хадгаллаа"));
                  onRefresh();
                }
              }
            );
            setModalOpen({ bool: false, item: null, type: "" });
            setValue(null);
          }
        } else message.warn("Уучлаарай дахин оролдоно уу");
      });
  };

  function tulburiinDelgerengui() {
    if (!camerVal[1]) {
      message.warn("Гарах камер сонгоно уу.");
      return;
    }
    const footer = [
      <div className="flex w-full items-center justify-between">
        <Button type="primary" onClick={() => tailanRef.current.khaaya()}>
          {t("Хаах")}
        </Button>
        <Button
          icon={<PrinterOutlined />}
          onClick={() => tailanRef.current.khadgalya()}
        >
          {t("Хэвлэх")}
        </Button>
      </div>,
    ];
    modal({
      title: t("Төлбөрийн дэлгэрэнгүй"),
      icon: <FileExcelOutlined />,
      content: (
        <TulburiinDelgerenguiTailan
          ref={tailanRef}
          defualtOgnoo={ognoo}
          garsanKhaalga={camerVal[1]}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          barilgiinId={barilgiinId}
        />
      ),
      footer,
    });
  }

  const exlCol = () => {
    const aa = columns;
    aa.splice(columns.length - 2, 2, {
      title: t("Төлөв"),
      sorter: () => 0,
      dataIndex: "tuukh",
      render(v) {
        return v[0]?.tuluv === 0 ? (
          <div>{t("Төлөөгүй")}</div>
        ) : v[0]?.tuluv < 0 ? (
          <div>{t("Үнэгүй")}</div>
        ) : v[0]?.ebarimtAvsanEsekh ? (
          <div>{t("Төлөгдсөн")}</div>
        ) : (
          <div>{t("И-Баримт")}</div>
        );
      },
    });
    return aa;
  };
  const khaalgaNeey = (ip) => {
    axios
      .get("http://localhost:5000/api/neeye/" + ip + "")
      .then(function (response) {
        if (!!response) console.log("/api/neeye", response);
      })
      .catch(function (error) {
        console.log("ERROR: /api/neeye", error);
      });
  };
  const keyPadHandler = (v) => {
    const val = form.getFieldValue("mashiniiDugaar");
    if (!val || val.length < 7)
      form.setFieldValue("mashiniiDugaar", val ? val + v : v);
    // console.log(v,' - - ', val)
  };
  const dugaarBurtgekh = () => {
    const body = form.getFieldsValue();
    uilchilgee(token)
      .post("/zogsoolSdkService", body)
      .then((res) => {
        if (res.status === 200) {
          if (!!res?.data) notification.warn({ message: res.data.aldaa });
          else notification.success({ message: t("Амжилттай бүртгэгдлээ") });
          setModalOpen({ bool: false, item: null, type: "" });
          form.resetFields();
          onRefresh();
        }
      })
      .catch(aldaaBarigch);
  };
  const tsagTootsoolur = (v) => {
    const odooginTsag =
      Number(moment(new Date()).format("HH")) * 60 * 60 +
      Number(moment(new Date()).format("mm")) * 60 +
      Number(moment(new Date()).format("ss"));
    const ekhlesenTsag =
      Number(moment(v).format("HH")) * 60 * 60 +
      Number(moment(v).format("mm")) * 60 +
      Number(moment(v).format("ss"));
    const difference = odooginTsag - ekhlesenTsag;
    const tsag = Math.floor(difference / 60 / 60);
    const minut = Math.floor((difference - tsag * 60 * 60) / 60);
    // const second = Math.floor(difference - tsag * 60 * 60 - minut * 60);
    return {
      hours: tsag.toString(),
      minutes: minut.toString(),
    };
  };

  const modalKhaakh = () => {
    form.resetFields();
    setValue();
    setModalOpen({ bool: false, item: null, type: "" });
  };
  const excel = new Excel();
  // console.log('0-0--0', baiguullaga);
  return (
    <Admin
      title="Камер"
      tsonkhniiId={"64474e3e28c37d7cdda15d01"}
      khuudasniiNer="Camera"
      fixedZagvarNeegdsenEsekh={guilgeeKharakh}
      setTurulZagvar={setGuilgeeKharakh}
      className="relative p-2 sm:p-4"
      onSearch={(search) => {
        setUilchluulegchKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
        setKhaikh(search);
      }}
    >
      {jagsaalt?.length > 0 ? (
        <div className="col-span-12">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            <div
              onClick={() => {
                setCamerKharakh(false);
              }}
              className={`w-full ${
                cameraKharakh === 1 &&
                "fixed right-0 top-0 z-50 flex h-screen w-screen items-center justify-center rounded-md bg-black bg-opacity-80 p-2 md:py-[10%]"
              }`}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setCamerKharakh(1);
                }}
                className={`w-full bg-[url('/notPlay.png')] bg-[length:100%_100%] bg-center bg-no-repeat ${
                  cameraKharakh === 1
                    ? "sm:h-[80vh] sm:w-[80%]"
                    : "sm:h-[300px]"
                }`}
              >
                {/*baiguullagiin id ni FoodCity.iin id */}
                {baiguullaga?._id === "63c0f31efe522048bf02086d" ? (
                  <Stream1 ip={camerVal[0]} />
                ) : (
                  ""
                )}
              </div>
              {cameraKharakh === 1 && (
                <div className="absolute right-5 top-5 text-3xl text-white">
                  <CloseOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      setCamerKharakh(false);
                    }}
                  />
                </div>
              )}
              <div
                className={`mt-3 flex flex-col justify-between gap-3 sm:flex-row ${
                  cameraKharakh === 1 && "absolute bottom-5 w-40"
                }`}
              >
                <div className="flex gap-3">
                  <Button
                    onClick={(e) => {
                      khaalgaNeey(camerVal[0]);
                    }}
                    className="w-full sm:w-auto"
                    type="primary"
                    id="neekhKhaalgaID"
                  >
                    {t("Нээх")} [ {t("Орох")} F1 ]
                  </Button>
                  {/*<Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full sm:w-auto"
                    type="primary">
                    Хаах
                  </Button>*/}
                </div>
                <TreeSelect
                  /*onClick={(e) => {
                                        e.stopPropagation();
                                    }}*/
                  placement={cameraKharakh === 1 ? "topRight" : "bottomLeft"}
                  showSearch
                  style={{
                    backgroundColor: "#10B981",
                    borderColor: "#10B981",
                  }}
                  value={camerVal[0]}
                  dropdownStyle={{
                    maxHeight: 600,
                    minWidth: 280,
                    overflow: "auto",
                  }}
                  className="custom-dropdown-bg"
                  placeholder={t("Камер сонгох")}
                  allowClear
                  treeDefaultExpandAll
                  onChange={(e) => cameraChange(e, 1)}
                  treeData={cameraData[0]}
                />
              </div>
            </div>
            <div
              onClick={() => {
                setCamerKharakh(false);
              }}
              className={`w-full ${
                cameraKharakh === 2 &&
                "fixed right-0 top-0 z-50 flex h-screen w-screen items-center justify-center rounded-md bg-black bg-opacity-80 p-2"
              }`}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setCamerKharakh(2);
                }}
                className={`w-full bg-[url('/notPlay.png')] bg-[length:100%_100%] bg-center bg-no-repeat ${
                  cameraKharakh === 2
                    ? "sm:h-[80vh] sm:w-[80%]"
                    : "sm:h-[300px]"
                }`}
              >
                {/*baiguullagiin id ni FoodCity.iin id */}
                {baiguullaga?._id === "63c0f31efe522048bf02086d" ? (
                  <Stream2 ip={camerVal[1]} />
                ) : (
                  ""
                )}
              </div>
              {cameraKharakh === 2 && (
                <div className="absolute right-5 top-5 text-3xl text-white">
                  <CloseOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      setCamerKharakh(false);
                    }}
                  />
                </div>
              )}
              <div
                className={`mt-3 flex flex-col justify-between gap-3 sm:flex-row ${
                  cameraKharakh === 2 && "absolute bottom-5 w-40"
                }`}
              >
                <div className="flex gap-3">
                  <Button
                    onClick={(e) => {
                      khaalgaNeey(camerVal[1]);
                    }}
                    id="khaakhkhaalgaID"
                    className="w-full sm:w-auto"
                    type="primary"
                  >
                    {t("Нээх")} [ {t("Гарах1")} F2 ]
                  </Button>
                  {/*<Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full sm:w-auto"
                    type="primary">
                    Хаах
                  </Button>*/}
                </div>
                <TreeSelect
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  placement={cameraKharakh === 2 ? "topRight" : "bottomRight"}
                  showSearch
                  style={{
                    backgroundColor: "#10B981",
                    borderColor: "#10B981",
                  }}
                  value={camerVal[1]}
                  dropdownStyle={{
                    maxHeight: 600,
                    minWidth: 280,
                    overflow: "auto",
                  }}
                  placeholder={t("Камер сонгох")}
                  allowClear
                  treeDefaultExpandAll
                  onChange={(e) => cameraChange(e, 2)}
                  treeData={cameraData[1]}
                />
              </div>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`fixed right-[8%] top-1/2 z-50 w-[84%] -translate-y-1/2 rounded-lg border bg-white p-5 shadow-xl transition-all xl:relative xl:right-0 xl:z-0 xl:w-auto xl:border-none xl:bg-transparent xl:p-0 xl:shadow-none ${
                guilgeeKharakh === false ? "scale-0 xl:scale-100" : "scale-100"
              }`}
            >
              <div className="text-base font-bold">{t("Сүүлийн гүйлгээ")}</div>
              <div className="absolute right-3 top-3 text-3xl xl:hidden">
                <CloseCircleOutlined
                  onClick={() => setGuilgeeKharakh(false)}
                  className="text-red-400"
                />
              </div>
              <Table
                pagination={false}
                className="mt-3 overflow-auto"
                scroll={{ y: "calc(100vh / 4.5)" }}
                size="small"
                dataSource={dansniiKhuulgaGaralt?.jagsaalt}
                columns={baganuud}
              />
            </div>
          </div>
          <Card className="col-span-12 mt-2">
            <div className="mb-5 xl:hidden">
              <Button
                style={{ width: "100%" }}
                icon={<EyeOutlined />}
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setGuilgeeKharakh(!guilgeeKharakh);
                }}
              >
                {t("Гүйлгээ харах")}
              </Button>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <div
                data-aos="fade-right"
                data-aos-duration="1000"
                className="flex w-full flex-col lg:flex-row"
                data-aos-delay="100"
              >
                <DatePicker.RangePicker
                  allowClear={false}
                  className="w-full md:w-auto"
                  size="middle"
                  value={ognoo}
                  onChange={setOgnoo}
                />
                {/* <div
                  className={`h-3 w-1 bg-slate-100 ${
                    refresh ? "rotate-90" : "rotate-0"
                  }`}
                ></div> */}
              </div>
              <div
                className="mb-5 flex w-full justify-between sm:justify-end md:mb-0 md:ml-auto lg:w-auto"
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                {(ajiltan?.tokhirgoo?.zogsoolNegtgelDunKharakhEsekh === true ||
                  ajiltan?.erkh === "Admin") && (
                  <Button
                    onClick={() => tulburiinDelgerengui()}
                    className="mr-3 w-32 sm:w-auto"
                    icon={<PrinterOutlined />}
                  >
                    {t("Төлбөрийн дэлгэрэнгүй")}
                  </Button>
                )}
                <Button
                  className="mr-3 w-32 sm:w-auto"
                  onClick={() =>
                    setModalOpen({
                      bool: true,
                      item: null,
                      type: "dugaarBurtgekh",
                    })
                  }
                  type="primary"
                >
                  {t("Машин бүртгэх")} [ + ]
                </Button>
                <Popover
                  content={() => (
                    <div className="flex w-32 flex-col">
                      <a
                        className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                        // onClick={() => {
                        //     excelTatajAvya(
                        //         token,
                        //         "zogsoolUilchluulegch",
                        //         uilchluulegchGaralt.niitMur,
                        //         exlCol(),
                        //         query,
                        //         order,
                        //         "Зогсоол"
                        //     );
                        // }}
                        onClick={() => {
                          uilchilgee(token)
                            .get("zogsoolUilchluulegch", {
                              params: {
                                order: order,
                                query: query,
                                khuudasniiKhemjee: uilchluulegchGaralt?.niitMur,
                              },
                            })
                            .then(({ data }) => {
                              excel
                                .addSheet("Камер")
                                .addColumns([
                                  {
                                    title: "№",
                                    align: "center",
                                    dataIndex: "dugaar",
                                    width: "2rem",
                                    __style__: { h: "center" },
                                    render: (text, record, index) =>
                                      (data?.khuudasniiDugaar || 0) *
                                        (data?.khuudasniiKhemjee || 0) -
                                      (data?.khuudasniiKhemjee || 0) +
                                      index +
                                      1,
                                  },
                                  {
                                    title: t("Дугаар1"),
                                    dataIndex: "mashiniiDugaar",
                                    __style__: { h: "center" },
                                    render(v) {
                                      return String(v).toUpperCase();
                                    },
                                  },
                                  {
                                    title: t("Орсон"),
                                    dataIndex: "tuukh.tsagiinTuukh.orsonTsag",
                                    __style__: { h: "center" },
                                    render(v, p) {
                                      const d =
                                        p.tuukh[0]?.tsagiinTuukh[0]?.orsonTsag;
                                      return (
                                        d && moment(d).format("MM-DD HH:mm")
                                      );
                                    },
                                  },
                                  {
                                    title: t("Гарсан"),
                                    __style__: { h: "center" },
                                    dataIndex: "tuukh.tsagiinTuukh.garsanTsag",
                                    render(v, p) {
                                      const d =
                                        p.tuukh[0]?.tsagiinTuukh[0]?.garsanTsag;
                                      return (
                                        d && moment(d).format("MM-DD HH:mm")
                                      );
                                    },
                                  },
                                  {
                                    title: t("Хугацаа/мин"),
                                    dataIndex: "tuukh",
                                    __style__: { h: "center" },
                                    render(v) {
                                      const d1 = moment(
                                        v?.[0]?.tsagiinTuukh[0]?.orsonTsag
                                      );
                                      const d2 = moment(
                                        v?.[0]?.tsagiinTuukh[0]?.garsanTsag
                                      );
                                      const diff = d2.diff(d1, "minutes");
                                      return diff && diff;
                                    },
                                  },
                                  {
                                    title: t("Төрөл"),
                                    __style__: { h: "center" },
                                    dataIndex: "turul",
                                    render: (v) => (!!v ? v : "Үйлчлүүлэгч"),
                                  },
                                  {
                                    title: t("Дүн"),
                                    dataIndex: "tuukh",
                                    __style__: { h: "right" },
                                    render(v, p, i) {
                                      return formatNumber(
                                        v?.[0]?.tulukhDun || 0
                                      );
                                    },
                                  },
                                  {
                                    title: t("Шалтгаан"),
                                    dataIndex: "tuukh",
                                    render: (v, parent) => {
                                      if (parent.turul === "Үнэгүй") {
                                        return t(parent?.mashin?.temdeglel);
                                      } else
                                        return v?.[0]?.tuluv === -1
                                          ? v?.[0]?.uneguiGarsan
                                          : !!v?.[0]?.tsagiinTuukh[0]
                                              ?.garsanTsag &&
                                            v?.[0]?.niitKhugatsaa <= 30
                                          ? t("30 мин")
                                          : t(parent.zurchil);
                                    },
                                  },
                                ])
                                .addDataSource(data?.jagsaalt)
                                .saveAs("Camera.xlsx");
                            });
                        }}
                      >
                        <DownloadOutlined style={{ fontSize: "18px" }} />
                        <label>{t("Татах")}</label>
                      </a>
                    </div>
                  )}
                  style={{ padding: 0 }}
                  placement="bottom"
                  trigger="click"
                >
                  <Button
                    type="primary"
                    className="mr-3 w-32 sm:w-auto"
                    icon={<FileExcelOutlined />}
                  >
                    <span>Excel</span>
                    <DownOutlined width={5} />
                  </Button>
                </Popover>
                <Button
                  className="w-32 sm:w-auto"
                  icon={<CameraOutlined />}
                  onClick={() => setDrawerOpen(true)}
                  type="primary"
                >
                  {t("Камер")}
                </Button>
                <Drawer
                  width={"100vw"}
                  title={t("Камер")}
                  placement="right"
                  onClose={() => setDrawerOpen(false)}
                  visible={drawerOpen}
                >
                  {drawerOpen && (
                    <Card className="col-span-12 row-span-full lg:col-span-4 lg:col-start-9">
                      <div className="w-max">
                        {/*baiguullagiin id ni FoodCity.iin id */}
                        {baiguullaga?._id === "63c0f31efe522048bf02086d" ? (
                          <StackStream tuluv={drawerOpen} />
                        ) : (
                          ""
                        )}
                      </div>
                    </Card>
                  )}
                </Drawer>
              </div>
            </div>
            <div
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="300"
              data-aos-anchor-placement="top-bottom"
            >
              <ZogsoolCameraTable
                isValidating={isValidating}
                uilchluulegchGaralt={uilchluulegchGaralt}
                columns={columns}
                onChangeTable={onChangeTable}
                setUilchluulegchKhuudaslalt={setUilchluulegchKhuudaslalt}
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
          <Modal
            title={
              modalOpen.type !== "zurchil"
                ? modalOpen.type !== "dugaarBurtgekh"
                  ? t("Үнэгүй үйлчлүүлэгчийн төрөл сонгох")
                  : t("Машин бүртгэх")
                : t("Зөрчил оруулах")
            }
            open={modalOpen.bool}
            onCancel={() => modalKhaakh()}
            footer={[
              <Button key="back" onClick={() => modalKhaakh()}>
                {t("Хаах")}
              </Button>,
              <Button type="primary" onClick={khadgalakh}>
                {t("Хадгалах")}
              </Button>,
            ]}
          >
            <Space direction="vertical" className="w-full">
              {modalOpen.type !== "dugaarBurtgekh" ? (
                <>
                  <Radio.Group onChange={onChange} value={value}>
                    {modalOpen.type !== "zurchil" ? (
                      <Space direction="vertical">
                        <Radio value="Цагдаа">{t("Цагдаа")}</Radio>
                        <Radio value="Гал">{t("Гал")}</Radio>
                        <Radio value="Эмнэлэг">{t("Эмнэлэг")}</Radio>
                        <Radio value="Онцгой">{t("Онцгой")}</Radio>
                        <Radio value="Борлуулалтын машин">
                          {t("Борлуулалтын машин")}
                        </Radio>
                        <Radio value="Хөгжлийн бэрхшээлтэй иргэн">
                          {t("Хөгжлийн бэрхшээлтэй иргэн")}
                        </Radio>
                        <Radio value="Хогны машин">{t("Хогны машин")}</Radio>
                      </Space>
                    ) : (
                      <Space direction="vertical">
                        <Radio value="Маргалдсан">{t("Маргалдсан")}</Radio>
                        <Radio value="Журам зөрчсөн">
                          {t("Журам зөрчсөн")}
                        </Radio>
                        <Radio value="Зугтаасан">{t("Зугтаасан")}</Radio>
                      </Space>
                    )}
                  </Radio.Group>
                  <div className="flex w-full items-center">
                    <label>{t("Бусад")}</label>
                    <Input
                      value={value}
                      onChange={onChange}
                      className="ml-[10px] w-full"
                    />
                  </div>
                </>
              ) : (
                <>
                  <Form
                    form={form}
                    className="flex w-full"
                    onFinish={dugaarBurtgekh}
                  >
                    <Form.Item
                      label={t("Дугаар1")}
                      name="mashiniiDugaar"
                      className="w-2/5"
                      normalize={(input) => {
                        const too = input.replace(/[^0-9]/g, "").slice(0, 4);
                        const useg = Array.from(input)
                          .filter((a) => /[А-Яа-яөӨүҮ]/.test(a))
                          .slice(0, 3)
                          .join("");
                        return `${too}${useg}`.toUpperCase();
                      }}
                      rules={[
                        {
                          required: true,
                          message: t("Машины дугаар бүртгэнэ үү!"),
                        },
                        {
                          required:
                            form.getFieldValue("mashiniiDugaar")?.length > 0 &&
                            true,
                          min: 7,
                          max: 7,
                          pattern: new RegExp("[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{3}"),
                          message: t("Машины дугаар 4 тоо 3 үсэг байх ёстой"),
                        },
                      ]}
                    >
                      <Input
                        onDoubleClick={() =>
                          navigator.clipboard
                            .readText()
                            .then(
                              (v) =>
                                !!v && form.setFieldValue("mashiniiDugaar", v)
                            )
                        }
                        maxLength={7}
                        ref={mashiniiDugaarRef}
                        placeholder="1234УБА"
                        className="ml-[10px]"
                      />
                    </Form.Item>
                    {/*{console.log(cameraData)}*/}
                    <Form.Item
                      name="CAMERA_IP"
                      className="w-2/5"
                      rules={[
                        {
                          required: true,
                          message: t("Камер сонгоно уу."),
                        },
                      ]}
                    >
                      <Select className="" placeholder={`${t("Камер")} IP`}>
                        {camerVal[0] && (
                          <Select.Option key={camerVal[0]}>Орох</Select.Option>
                        )}
                        {camerVal[1] && (
                          <Select.Option key={camerVal[1]}>Гарах</Select.Option>
                        )}
                      </Select>
                    </Form.Item>
                    <a
                      onClick={() => form.resetFields()}
                      className="ml-2 flex h-8 items-center rounded border border-red-400 px-2 hover:bg-red-200 dark:text-white"
                    >
                      {t("Цэвэрлэх")}
                    </a>
                  </Form>

                  <div className="flex flex-wrap">
                    <div className="flex w-full flex-wrap">
                      {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                        (n) => (
                          <a
                            onClick={() => keyPadHandler(n)}
                            className="m-1 rounded border px-3 py-2 hover:bg-green-200 dark:text-white"
                          >
                            {n}
                          </a>
                        )
                      )}
                    </div>
                    {usguud.map((useg) => (
                      <a
                        onClick={() => keyPadHandler(useg)}
                        className="m-1 rounded border px-3 py-2 hover:bg-green-200 dark:text-white"
                      >
                        {useg}
                      </a>
                    ))}
                  </div>
                  {/*<div className="flex w-full items-center">
                                            <label>Дугаар</label>

                                        </div>*/}
                </>
              )}
            </Space>
          </Modal>
          <div style={{ position: "absolute", bottom: 45 }}>
            <ZogsooliinToo
              zogsoolTusBuriinToo={zogsoolTusBuriinToo}
              jagsaalt={jagsaalt}
            />
          </div>
        </div>
      ) : (
        <div className="col-span-12 flex justify-center">
          {t("зогсоолын эрх байхгүй байна.", {
            ajiltniiNer: ajiltan?.ner,
          })}
        </div>
      )}
    </Admin>
  );
}

const ZogsooliinToo = ({ zogsoolTusBuriinToo, jagsaalt }) => {
  // const [too, setToo] = useState([]);
  const too = [];
  for (let i = 0; jagsaalt.length > i; i++) {
    const zog = jagsaalt[i];
    // console.log('4444444', zog);
    for (let k = 0; zogsoolTusBuriinToo?.length > k; k++) {
      const to = zogsoolTusBuriinToo[k];
      if (zog._id === to._id.zogsool) {
        too.push({ ner: zog.ner, idevkhtei: to.too, sul: zog.too - to.too });
        // setToo([...too, {ner: zog.ner, idevkhtei: to.too, sul: (zog.too-to.too)}])
      }
      continue;
    }
  }
  return (
    too.length > 0 &&
    too.map((mur) => (
      <div className="ml-10 flex">
        <text style={{ width: 80 }} className="font-bold text-blue-600">
          {mur.ner}
        </text>
        <div style={{ width: 100 }} className="flex text-blue-600">
          {"Идэвхтэй"}: {mur.idevkhtei}
        </div>
        <div className="ml-10 flex text-yellow-600">Сул зогсоол: {mur.sul}</div>
      </div>
    ))
  );
};

export const getServerSideProps = shalgaltKhiikh;

export default camera;
