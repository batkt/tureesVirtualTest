import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useState, useMemo, useCallback } from "react";
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
  InputNumber,
  Popconfirm,
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
  ReloadOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
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
import Stream1, { SocketStream, Stream2 } from "./stream";
import StackStream from "./stackStream";
import TulburiinDelgerenguiTailan from "components/pageComponents/zogsool/TulburiinDelgerenguiTailan";
import ZogsoolCameraTable from "components/pageComponents/zogsool/ZogsoolCameraTable";
import R2WPlayerComponent from "components/streamPlayer";
import StackIkhNaydStream from "./StackIkhNaydStream";
import ShineTulbur from "components/pageComponents/tulbur/ShineTulbur";
import KhungulukhTsonkh from "components/pageComponents/zogsool/KhungulukhTsonkh";
import { CiDiscount1 } from "react-icons/ci";

export function TsagToololt({ ekhlekhTsag }) {
  const [timeUp, setTimeUp] = useState("Тооцоолж байна");

  const tsagTootsoolur = () => {
    var zoruu = moment.duration(moment(new Date()).diff(ekhlekhTsag));
    var tsag = Math.floor(zoruu.asHours());
    var minut = Math.floor(zoruu.minutes());
    var second = Math.floor(zoruu.seconds());
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
    case "zeel":
      utga = "Зээл";
      break;
    case "khariltsakh":
      utga = "Дансаар";
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
    case "tseneglelt":
      utga = "Цэнэглэлт";
      break;
    case "qpayUridchilsan":
      utga = "QPay QR";
      break;
    case "PosBelen":
      utga = "Пос бэлэн";
      break;
    case "PosCard":
      utga = "Пос карт";
      break;
    case "PosKhariltsakh":
      utga = "Пос дансаар";
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
  const khungulultRef = React.useRef(null);
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
  const [guilgeeDrawerOpen, setGuilgeeDrawerOpen] = useState(false);
  const [songogdsonBurtgel, setSongogdsonBurtgel] = useState("");
  const [form] = Form.useForm();
  const searchUtga = useRef(null);

  const que = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
      "khaalga.ajiltnuud.id": ajiltan?._id,
    };
  }, [baiguullaga?._id, ajiltan, barilgiinId]);

  const { jagsaalt, mutate: toololtMutate } = useJagsaalt(
    "/zogsoolJagsaalt",
    que
  );

  const streamQuery = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
    };
  }, [baiguullaga?._id, barilgiinId]);

  const { jagsaalt: parkingJagsaalt, mutate: parkingMutate } = useJagsaalt(
    "/parking",
    streamQuery
  );

  const songogdzonZogsool = useMemo(() => {
    var zogsool = {};
    if (parkingJagsaalt && camerVal[1]) {
      parkingJagsaalt?.forEach((item) => {
        item?.khaalga?.forEach((khaalgaItem) => {
          khaalgaItem?.camera?.forEach((cameraItem) => {
            if (cameraItem?.cameraIP === camerVal[1]) {
              zogsool = item;
            }
          });
        });
      });
    }
    return zogsool;
  }, [parkingJagsaalt, camerVal]);

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
    if (!!khaikh) {
      // use uilchilgee search hiih regex querynd daragdsan uhchir queryn dotor search regex bijiw
      result = {
        $and: [
          {
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
          },
          {
            $or: [{ mashiniiDugaar: { $regex: khaikh, $options: "i" } }],
          },
        ],
        ...result,
      };
    }
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
      let uilchluulegch = zogsool;

      if (uilchluulegch) {
        var yanzalsanMashiniiDugaar = uilchluulegch?.mashiniiDugaar?.replace(
          "???",
          ""
        );
        if (
          !!uilchluulegch?.khaalgaTurul &&
          uilchluulegch?.khaalgaTurul === "oroh" &&
          !!uilchluulegch?.cameraIP
        ) {
          console.log("orohKhaalga", uilchluulegch?.cameraIP);
          var url = `http://localhost:5000/api/sambar/${
            uilchluulegch?.cameraIP
          }/${yanzalsanMashiniiDugaar}/${moment().format("HH:mm:ss")}`;

          axios
            .get(url)
            .then((res) => {
              if (res) {
                console.log("amjilttai:", res);
              }
            })
            .catch((err) => {
              console.log("aldaa:", err);
            });

          khaalgaNeey(uilchluulegch?.cameraIP);
          onRefresh();
        } else {
          const garsanKhaalga = uilchluulegch?.tuukh?.[0]?.garsanKhaalga;
          // var yanzalsanMashiniiDugaar = uilchluulegch?.mashiniiDugaar?.replace(
          //   "???",
          //   ""
          // );
          let yanzalsanNiitDun = uilchluulegch?.niitDun;
          if (uilchluulegch?.tuukh?.[0]?.tulbur?.length > 0) {
            yanzalsanNiitDun =
              uilchluulegch?.niitDun -
              uilchluulegch?.tuukh?.reduce(
                (sav, niit) =>
                  sav + niit?.tulbur?.reduce((a, b) => a + b?.dun, 0),
                0
              );
          }
          if (yanzalsanNiitDun < 0) yanzalsanNiitDun = 0;
          var url = `http://localhost:5000/api/sambar/${garsanKhaalga}/${yanzalsanMashiniiDugaar}/${yanzalsanNiitDun}`;
          if (
            baiguullaga?._id == "65cf2f027fbc788f85e50b90" ||
            baiguullaga?._id == "6549bbe0d437e6d25d557341"
          ) {
            var ekhlekhOgnoo = moment(uilchluulegch?.createdAt).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            var duusakhOgnoo = moment().format("YYYY-MM-DD HH:mm:ss");
            url = `http://localhost:5000/api/sambarOgnootoi/${garsanKhaalga}/${yanzalsanMashiniiDugaar}/${yanzalsanNiitDun}/${ekhlekhOgnoo}/${duusakhOgnoo}`;
          }

          axios
            .get(url)
            .then((res) => {
              if (res) {
                console.log("amjilttai:", res);
              }
            })
            .catch((err) => {
              console.log("aldaa:", err);
            });

          if (
            uilchluulegch?.turul === "Үнэгүй" ||
            // (uilchluulegch?.tuukh &&
            //   uilchluulegch?.tuukh?.length > 0 &&
            // dunTuluv &&
            uilchluulegch?.niitDun === 0
            // )
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
              toololtMutate();
              zogsoolTusBuriinTooMutate();
              if (songogdzonZogsool?.garakhKhaalgaGarTokhirgoo !== true) {
                khaalgaNeey(uilchluulegch?.tuukh?.[0]?.garsanKhaalga);
              }
            }
          }
          onRefresh();
        }
      }
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
  } = useUilchluulegch(token, baiguullaga?._id, query, order, undefined, 10);

  const tooQuery = useMemo(() => {
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();
    return {
      "tuukh.tsagiinTuukh.garsanTsag": { $exists: false },
      "tuukh.tuluv": { $ne: -2 },
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd,
      },
    };
  }, [uilchluulegchGaralt]);

  const f5Darsan = useCallback(() => {
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
  }, [uilchluulegchGaralt, modalNeelttei]);

  // console.log("---------", uilchluulegchGaralt);

  useKeyboardTovchlol("F4", f5Darsan);
  useKeyboardTovchlol("F1", f3Darsan);
  useKeyboardTovchlol("F2", f4Darsan);
  useKeyboardTovchlol("F8", f8Darsan);
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
  function f8Darsan() {
    setModalOpen({
      bool: true,
      item: null,
      type: "orlogo",
    });
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
      "tuukh.tsagiinTuukh.garsanTsag": { $exists: false },
      "tuukh.tuluv": { $ne: -2 },
    };
  }, [uilchluulegchGaralt]);

  const { zogsoolTusBuriinToo, zogsoolTusBuriinTooMutate } =
    useUilchluulegchZogsoolToo(token, tooQue);
  // console.log('----zogsoolTusBuriinToo', zogsoolTusBuriinToo);
  const dasniiMedeelel = {
    baiguullagiinId: baiguullaga?._id,
    dugaar:
      baiguullaga?._id === "64fe8edc54a669717ad657ac"
        ? "432002947"
        : "416075707",
    bank: "tdb",
  };
  const {
    dansniiKhuulgaGaralt,
    dansniiKhuulgaMutate,
    isValidating: dansKhuleelt,
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
    toololtMutate();
    zogsoolTusBuriinTooMutate();
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
        <div className="flex w-full flex-row justify-between dark:text-gray-200">
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
      style: { top: 25 },
      content: (
        <ShineTulbur
          suuliikhEsekh={index === 0}
          niitDun={niitDun}
          camerVal={camerVal[1]}
          ref={tulburRef}
          data={_.cloneDeep(data)}
          eBarimtAshiglakhEsekh={
            baiguullaga?.barilguud?.find((e) => e._id === barilgiinId)
              ?.tokhirgoo?.eBarimtAshiglakhEsekh
          }
          eBarimtAutomataarShivikh={
            baiguullaga?.tokhirgoo?.eBarimtAutomataarShivikh
          }
          token={token}
          baiguullaga={baiguullaga}
          barilgiinId={barilgiinId}
          ajiltan={ajiltan}
          uilchluugchiinId={uilchluugchiinId}
          onRefresh={onRefresh}
          setModalNeelttei={setModalNeelttei}
          songogdsonZogsool={songogdzonZogsool}
        />
        // <Tulbur
        //   suuliikhEsekh={index === 0}
        //   niitDun={niitDun}
        //   camerVal={camerVal[1]}
        //   ref={tulburRef}
        //   data={_.cloneDeep(data)}
        //   token={token}
        //   baiguullaga={baiguullaga}
        //   barilgiinId={barilgiinId}
        //   ajiltan={ajiltan}
        //   uilchluugchiinId={uilchluugchiinId}
        //   onRefresh={onRefresh}
        //   setModalNeelttei={setModalNeelttei}
        // />
      ),
      footer: false,
      className: "!w-fit",
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
    if (baiguullaga?._id === "63c0f31efe522048bf02086d") {
      col.push({
        title: "Зогсоол",
        align: "center",
        width: "5rem",
        render: (data) => {
          var zogsojBuiTuluv = "Гадна";
          if (data?.tuukh?.length > 1) {
            if (!!data.tuukh?.[1].tsagiinTuukh?.[0]?.garsanTsag) {
              zogsojBuiTuluv = "Дотор";
            } else {
              zogsojBuiTuluv = "Гадна";
            }
          }
          return (
            <div
              className={`flex w-full items-center justify-center rounded-lg px-2 py-1 font-[500] text-gray-600 dark:text-gray-200 ${
                zogsojBuiTuluv === "Дотор" ? "bg-blue-300" : "bg-green-300"
              } `}
            >
              {zogsojBuiTuluv}
            </div>
          );
        },
      });
    }
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
                      JSON.stringify({
                        "tuukh.tsagiinTuukh.orsonTsag": -1,
                      }) && "bg-green-500 text-white"
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
                      JSON.stringify({
                        "tuukh.tsagiinTuukh.garsanTsag": -1,
                      }) && "bg-green-500 text-white"
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
        title: t("Хөнгөлөлт"),
        align: "center",
        width: "10rem",
        dataIndex: "mashin",
        showSorterTooltip: false,
        render: (a) => {
          if (a?.khungulultTurul === "togtmolTsag") {
            return (
              <div className="flex items-center justify-center">
                {a && (
                  <div
                    className={`flex w-[8rem] items-center justify-center rounded-lg px-2 py-1 font-[600] text-white ${
                      a?.uldegdelKhungulukhKhugatsaa > 0
                        ? "bg-green-400 dark:bg-green-700"
                        : "bg-yellow-400 dark:bg-yellow-700"
                    }`}
                  >
                    {a?.uldegdelKhungulukhKhugatsaa}
                    {"/"}
                    {""}
                    {a?.khungulukhKhugatsaa}
                    {t("мин")}
                  </div>
                )}
              </div>
            );
          }
          if (a?.khungulultTurul === "khuviKhungulult") {
            return (
              <div className="flex items-center justify-center">
                {a?.khungulultTurul && (
                  <div className="flex w-[8rem] items-center justify-center rounded-lg bg-blue-400 px-2 py-1 font-[600] text-white dark:bg-blue-700">
                    {a?.khungulult}
                    {"%"}
                  </div>
                )}
              </div>
            );
          }
          if (a?.gereetTulburBodokhEsekh) {
            return (
              <Tooltip
                title={`${a?.tulburBodokhTsagEkhlekh}-аас ${a?.tulburBodokhTsagDuusakh} хүртэл төлбөр бодогдоно.`}
              >
                <div className="flex cursor-help items-center justify-center">
                  {a?.tulburBodokhTsagEkhlekh} - {a?.tulburBodokhTsagDuusakh}
                </div>
              </Tooltip>
            );
          }
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
                  {t("Дансаар")}
                </div>
                <div
                  onClick={() => setKhelber("tuluugui")}
                  className={`relative ${
                    khelber === "tuluugui" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  {t("Төлөөгүй")}
                </div>
                <div
                  onClick={() => setKhelber("toki")}
                  className={`relative ${
                    khelber === "toki" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  {t("Токи")}
                </div>
                <div
                  onClick={() => setKhelber("khungulult")}
                  className={`relative ${
                    khelber === "khungulult" && "bg-green-500 text-white"
                  } flex cursor-pointer items-center justify-center rounded-md border px-5 py-[2px] font-medium hover:bg-green-600 hover:bg-opacity-20 dark:text-white `}
                >
                  {t("Хөнгөлөлт")}
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
                      <div className="dark:text-gray-200">
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
          return (
            r && (
              <div>
                {v[0]?.tulbur?.length > 1 ? r : t(r)}{" "}
                {v[0]?.tulbur?.length === 1 && `: ${v[0]?.tulbur[0]?.dun}`}
              </div>
            )
          );
        },
      },
      {
        title: t("Төлөв"),
        align: "center",
        width: "10rem",
        dataIndex: "tuukh.tuluv",
        render(v, parent, index) {
          let dunTuluv = false;
          parent?.tuukh?.map((mur) => {
            if (mur.tulukhDun > 0) dunTuluv = true;
          });
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
              dunTuluv ? (
              <Popover
                placement="bottom"
                trigger="hover"
                content={() => (
                  <div className="flex w-24 flex-col space-y-2">
                    <a
                      className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        parent?.niitDun && parent?.niitDun > 0
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
              <Popover
                trigger="click"
                content={
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div
                      onClick={() => khungulyu(parent, parent?._id)}
                      className="flex w-28 cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 py-1 hover:border-2 dark:bg-gray-600 dark:text-gray-200"
                    >
                      <div className="flex items-center justify-center">
                        <CiDiscount1 />
                      </div>
                      <div className="flex items-center justify-center">
                        Хөнгөлөх
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        dugaarGaraasBurtgekh(parent);
                      }}
                      className="flex w-28 cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 py-1 hover:border-2 dark:bg-gray-600 dark:text-gray-200"
                    >
                      <div className="flex items-center justify-center">
                        <ArrowRightOutlined />
                      </div>
                      <div className="flex items-center justify-center">
                        Гаргах
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="mx-auto flex w-max cursor-pointer items-center justify-center space-x-2 rounded bg-blue-500 px-3 text-white">
                  <div className="flex items-center justify-center">
                    {t("Идэвхтэй")}
                  </div>
                </div>
              </Popover>
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
            ) : mur?.tuluv === 2 ? (
              <div className="mx-auto flex w-max items-center justify-center space-x-2 rounded bg-lime-500 px-3 text-white">
                <div className="flex items-center justify-center">
                  {t("Төлөгдсөн")}
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
            body.tuukh[0].burtgesenAjiltaniiId = ajiltan?._id;
            body.tuukh[0].burtgesenAjiltaniiNer = ajiltan?.ner;
            if (!!camerVal[1] && value === "Зугтаасан") {
              body.tuukh[0].garsanKhaalga = camerVal[1];
              body.tuukh[0].tsagiinTuukh[0].garsanTsag = data;
              body.tuukh[0].niitKhugatsaa = moment(data).diff(
                body.tuukh[0].tsagiinTuukh[0].orsonTsag,
                "minutes"
              );
            }
          } else if (
            modalOpen.type === "dugaarBurtgekh" ||
            modalOpen.type === "orlogo"
          ) {
            form.submit();
          } else {
            if (value) {
              body.tuukh[0].uneguiGarsan = value;
              body.tuukh[0].tuluv = -1;
            } else if (songogdzonZogsool?.zurchilZaavalBurtgekhEsekh) {
              return notification.warn({
                message: "Шалтгаан оруулна уу",
                duration: 2,
              });
            }
          }
          if (modalOpen.type !== "dugaarBurtgekh") {
            updateMethod("zogsoolUilchluulegch", token, body).then(
              ({ data }) => {
                if (data === "Amjilttai") {
                  message.success(t("Амжилттай хадгаллаа"));
                  if (
                    value !== "Маргалдсан" ||
                    value !== "Журам зөрчсөн" ||
                    value !== "Зугтаасан"
                  ) {
                    khaalgaNeey(body?.tuukh?.[0]?.garsanKhaalga);
                  }
                  if (searchUtga.current?.value) {
                    searchUtga.current.value = "";
                    setUilchluulegchKhuudaslalt((e) => ({
                      ...e,
                      khuudasniiDugaar: 1,
                      search: "",
                    }));
                    setKhaikh("");
                  }
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
    // if (!camerVal[1]) {
    //   message.warn("Гарах камер сонгоно уу.");
    //   return;
    // }
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
          ajiltan={ajiltan}
          garsanKhaalga={camerVal[1]}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          barilgiinId={barilgiinId}
          cameraData={cameraData}
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
          if (searchUtga.current?.value) {
            searchUtga.current.value = "";
            setUilchluulegchKhuudaslalt((e) => ({
              ...e,
              khuudasniiDugaar: 1,
              search: "",
            }));
            setKhaikh("");
          }
          form.resetFields();
          onRefresh();
        }
      })
      .catch(aldaaBarigch);
  };

  const dugaarGaraasBurtgekh = (data) => {
    if (data) {
      if (!camerVal[1]) {
        return notification.warn({
          message: "Гарах камер сонгоно уу.",
          duration: 2,
        });
      }
      const yavuulakhData = {
        mashiniiDugaar: data.mashiniiDugaar,
        CAMERA_IP: camerVal[1],
      };
      uilchilgee(token)
        .post("/zogsoolSdkService", yavuulakhData)
        .then((res) => {
          if (res.status === 200) {
            if (!!res?.data) notification.warn({ message: res.data.aldaa });
            else notification.success({ message: t("Амжилттай бүртгэгдлээ") });
            if (searchUtga.current?.value) {
              searchUtga.current.value = "";
              setUilchluulegchKhuudaslalt((a) => ({
                ...a,
                search: "",
                khuudasniiDugaar: 1,
              }));
              setKhaikh("");
            }
            form.resetFields();
            onRefresh();
          }
        })
        .catch(aldaaBarigch);
    }
  };

  const khungulyu = (data, uilchluulegchiinId) => {
    console.log("tukhainData: ", data);
    const footer = [
      <div className="flex w-full items-center justify-between">
        <Button type="primary" onClick={() => khungulultRef?.current.khaaya()}>
          {t("Хаах")}
        </Button>
        <Button
          icon={<CiDiscount1 />}
          onClick={() => khungulultRef?.current.khadgalya()}
        >
          {t("Хөнгөлөх")}
        </Button>
      </div>,
    ];
    modal({
      title: t("Хөнгөлөх"),
      icon: <FileExcelOutlined />,
      content: (
        <KhungulukhTsonkh
          ref={khungulultRef}
          token={token}
          uilchluulegchiinId={uilchluulegchiinId}
          data={data}
          songogdsonZogsool={songogdzonZogsool}
          mutate={uilchluulegchMutate}
          ajiltan={ajiltan}
          baiguullaga={baiguullaga}
          barilgiinId={barilgiinId}
        />
      ),
      footer,
    });
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
  const orlogoGaraasOruulya = () => {
    const body = form.getFieldsValue();
    let yavuulakhData = {};
    yavuulakhData.mashiniiDugaar = body.mashiniiDugaar;
    yavuulakhData.tulukhDun = body.tulukhDun;
    yavuulakhData.barilgiinId = barilgiinId;
    yavuulakhData.orsonCamera = camerVal[0];
    yavuulakhData.garsanCamera = camerVal[1];
    uilchilgee(token)
      .post("/zogsoolOrlogoGaraas", yavuulakhData)
      .then((res) => {
        if (res.status === 200) {
          notification.success({ message: t("Амжилттай бүртгэгдлээ") });
          setModalOpen({ bool: false, item: null, type: "" });
          form.resetFields();
          onRefresh();
          tulburTulyu(
            res.data.tuukh[0],
            res.data._id,
            res.data.mashiniiDugaar,
            res.data.niitDun,
            0
          );
        }
      })
      .catch(aldaaBarigch);
  };

  const modalKhaakh = () => {
    form.resetFields();
    setValue();
    setModalOpen({ bool: false, item: null, type: "" });
  };

  function guilgeeDrawerOngoilgokh() {
    setGuilgeeDrawerOpen(true);
  }
  function guilgeeDrawerKhaakh() {
    setGuilgeeDrawerOpen(false);
  }

  function khailtDoubleClick() {
    navigator.clipboard.readText().then((v) => {
      if (!!v) {
        searchUtga.current.value = v;
        setUilchluulegchKhuudaslalt((a) => ({
          ...a,
          search: v,
          khuudasniiDugaar: 1,
        }));
      }
    });
  }
  const excel = new Excel();
  return (
    <Admin
      title="Камер"
      tsonkhniiId={"64474e3e28c37d7cdda15d01"}
      khuudasniiNer="Camera"
      dedKhuudas={true}
      fixedZagvarNeegdsenEsekh={guilgeeKharakh}
      setTurulZagvar={setGuilgeeKharakh}
      searchUtga={searchUtga}
      suggestionData={uilchluulegchGaralt?.jagsaalt}
      className="relative p-2 pb-24 sm:p-4"
      onSearch={(search) => {
        setUilchluulegchKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
        setKhaikh(search);
      }}
      khailtDoubleClick={khailtDoubleClick}
    >
      {jagsaalt?.length > 0 ? (
        <div className="col-span-12">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="fixed left-6 top-24 z-[10000] hidden h-[400px] md:block">
              <div
                className="h-12 w-12 cursor-pointer rounded-r-full border-y border-r bg-yellow-500 text-xl"
                onClick={guilgeeDrawerOngoilgokh}
              >
                <DollarCircleOutlined />
              </div>
              <Drawer
                title={t("Сүүлийн гүйлгээ")}
                placement="left"
                size="large"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onClose={guilgeeDrawerKhaakh}
                open={guilgeeDrawerOpen}
                getContainer={false}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="absolute right-4 top-3">
                    <Button
                      className={`${
                        guilgeeKharakh === false ? "mr-0" : "mr-8"
                      }`}
                      type="tertiary"
                      onClick={(e) => {
                        e.stopPropagation();
                        dansniiKhuulgaMutate();
                      }}
                    >
                      Шалгах
                    </Button>
                  </div>
                  <Table
                    pagination={false}
                    tableLayout="fixed"
                    className="mt-3"
                    scroll={{ y: "calc(100vh / 4.5)" }}
                    size="small"
                    loading={dansKhuleelt}
                    dataSource={dansniiKhuulgaGaralt?.jagsaalt}
                    columns={baganuud}
                  />
                </div>
              </Drawer>
            </div>
            <div
              onClick={() => {
                setCamerKharakh(false);
              }}
              className={`w-full ${
                cameraKharakh === 1 &&
                "fixed right-0 top-0 z-10 flex h-screen w-screen items-center justify-center rounded-md bg-black bg-opacity-80 p-2 md:py-[10%]"
              }`}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setCamerKharakh(1);
                }}
                className={`w-full rounded-md bg-[url('/notPlay.png')] bg-[length:100%_100%] bg-center bg-no-repeat ${
                  cameraKharakh === 1
                    ? "sm:h-[80vh] sm:w-[80%]"
                    : "sm:h-[450px]"
                }`}
              >
                {/*baiguullagiin id ni FoodCity.iin id */}
                {baiguullaga?._id === "63c0f31efe522048bf02086d" ? (
                  camerVal[0] === "192.168.2.75" ? (
                    <R2WPlayerComponent
                      USER={"admin"}
                      ROOT={"stream"}
                      PASSWD={"123456"}
                      Camer={camerVal[0]}
                      PORT={554}
                    />
                  ) : (
                    <Stream1 ip={camerVal[0]} />
                  )
                ) : baiguullaga?._id === "6115f350b35689cdbf1b9da3" ? (
                  <R2WPlayerComponent
                    // USER={"admin"}
                    // ROOT={"stream"}
                    // PASSWD={"123456"}
                    // Camer={camerVal[0]}
                    // PORT={554}
                    USER={parkingJagsaalt?.[0]?.tokhirgoo?.USER}
                    ROOT={parkingJagsaalt?.[0]?.tokhirgoo?.ROOT}
                    PASSWD={parkingJagsaalt?.[0]?.tokhirgoo?.PASSWD}
                    Camer={camerVal[0]}
                    PORT={parkingJagsaalt?.[0]?.tokhirgoo?.PORT}
                  />
                ) : parkingJagsaalt?.[0]?.tokhirgoo ? (
                  parkingJagsaalt?.[0]?.tokhirgoo?.socketEsekh === true ? (
                    <SocketStream
                      ip={camerVal[0]}
                      CHANNEL={parkingJagsaalt?.[0]?.tokhirgoo?.CHANNEL}
                      PORT={parkingJagsaalt?.[0]?.tokhirgoo?.PORT}
                      TOKEN={parkingJagsaalt?.[0]?.tokhirgoo?.TOKEN}
                    />
                  ) : parkingJagsaalt?.[0]?.tokhirgoo?.socketEsekh === false ? (
                    <R2WPlayerComponent
                      USER={parkingJagsaalt?.[0]?.tokhirgoo?.USER}
                      ROOT={parkingJagsaalt?.[0]?.tokhirgoo?.ROOT}
                      PASSWD={parkingJagsaalt?.[0]?.tokhirgoo?.PASSWD}
                      Camer={camerVal[0]}
                      PORT={parkingJagsaalt?.[0]?.tokhirgoo?.PORT}
                    />
                  ) : (
                    ""
                  )
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
                "fixed right-0 top-0 z-10 flex h-screen w-screen items-center justify-center rounded-md bg-black bg-opacity-80 p-2"
              }`}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setCamerKharakh(2);
                }}
                className={`w-full rounded-md bg-[url('/notPlay.png')] bg-[length:100%_100%] bg-center bg-no-repeat ${
                  cameraKharakh === 2
                    ? "sm:h-[80vh] sm:w-[80%]"
                    : "sm:h-[450px]"
                }`}
              >
                {/*baiguullagiin id ni FoodCity.iin id */}
                {baiguullaga?._id === "63c0f31efe522048bf02086d" ? (
                  camerVal[1] === "192.168.2.76" ? (
                    <R2WPlayerComponent
                      USER={"admin"}
                      ROOT={"stream"}
                      PASSWD={"123456"}
                      Camer={camerVal[1]}
                      PORT={554}
                    />
                  ) : (
                    <Stream2 ip={camerVal[1]} />
                  )
                ) : baiguullaga?._id === "6115f350b35689cdbf1b9da3" ? (
                  <R2WPlayerComponent
                    // USER={"admin"}
                    // PASSWD={"123456"}
                    // ROOT={"stream"}
                    // Camer={camerVal[1]}
                    // PORT={554}
                    Camer={camerVal[1]}
                    PASSWD={parkingJagsaalt?.[0]?.tokhirgoo?.PASSWD}
                    PORT={parkingJagsaalt?.[0]?.tokhirgoo?.PORT}
                    ROOT={parkingJagsaalt?.[0]?.tokhirgoo?.ROOT}
                    USER={parkingJagsaalt?.[0]?.tokhirgoo?.USER}
                  />
                ) : parkingJagsaalt?.[0]?.tokhirgoo ? (
                  parkingJagsaalt?.[0]?.tokhirgoo?.socketEsekh === true ? (
                    <SocketStream
                      ip={camerVal[1]}
                      CHANNEL={parkingJagsaalt?.[0]?.tokhirgoo?.CHANNEL}
                      PORT={parkingJagsaalt?.[0]?.tokhirgoo?.STREAMPORT}
                      TOKEN={parkingJagsaalt?.[0]?.tokhirgoo?.TOKEN}
                    />
                  ) : parkingJagsaalt?.[0]?.tokhirgoo?.socketEsekh === false ? (
                    <R2WPlayerComponent
                      Camer={camerVal[1]}
                      PASSWD={parkingJagsaalt?.[0]?.tokhirgoo?.PASSWD}
                      PORT={parkingJagsaalt?.[0]?.tokhirgoo?.PORT}
                      ROOT={parkingJagsaalt?.[0]?.tokhirgoo?.ROOT}
                      USER={parkingJagsaalt?.[0]?.tokhirgoo?.USER}
                    />
                  ) : (
                    ""
                  )
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
          </div>
          <div className="col-span-12 mt-1 pt-1 dark:bg-gray-800">
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
            <div className="flex flex-col gap-1 lg:flex-row">
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
                className="mb-5 flex w-full flex-col justify-between gap-2 sm:justify-end md:mb-0 md:ml-auto lg:w-auto lg:flex-row lg:gap-0"
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                {(ajiltan?.tokhirgoo?.zogsoolNegtgelDunKharakhEsekh === true ||
                  ajiltan?.erkh === "Admin") && (
                  <Button
                    onClick={() => tulburiinDelgerengui()}
                    className="mr-3 w-auto"
                    icon={<PrinterOutlined />}
                  >
                    {t("Төлбөрийн дэлгэрэнгүй")}
                  </Button>
                )}
                <div className="flex w-full items-center justify-center">
                  <Button
                    className="mr-3 w-auto text-ellipsis"
                    onClick={() => {
                      setModalOpen({
                        bool: true,
                        item: null,
                        type: "orlogo",
                      });
                    }}
                    type="primary"
                  >
                    {t("Орлого")} [ F8 ]
                  </Button>
                  <Button
                    className="mr-3 w-auto text-ellipsis"
                    onClick={() => {
                      setModalOpen({
                        bool: true,
                        item: null,
                        type: "dugaarBurtgekh",
                      });
                      setTimeout(() => {
                        mashiniiDugaarRef.current.focus();
                      }, 200);
                    }}
                    type="primary"
                  >
                    {t("Машин")} [ + ]
                  </Button>
                  <Popover
                    content={() => (
                      <div className="flex flex-col text-ellipsis">
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
                                  khuudasniiKhemjee:
                                    uilchluulegchGaralt?.niitMur,
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
                                          p.tuukh[0]?.tsagiinTuukh[0]
                                            ?.orsonTsag;
                                        return (
                                          d && moment(d).format("MM-DD HH:mm")
                                        );
                                      },
                                    },
                                    {
                                      title: t("Гарсан"),
                                      __style__: { h: "center" },
                                      dataIndex:
                                        "tuukh.tsagiinTuukh.garsanTsag",
                                      render(v, p) {
                                        const d =
                                          p.tuukh[0]?.tsagiinTuukh[0]
                                            ?.garsanTsag;
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
                      className="mr-3 w-auto text-ellipsis"
                      icon={<FileExcelOutlined />}
                    >
                      <span>Excel</span>
                      <DownOutlined width={5} />
                    </Button>
                  </Popover>
                  <Button
                    className="w-auto text-ellipsis"
                    icon={<CameraOutlined />}
                    onClick={() => setDrawerOpen(true)}
                    type="primary"
                  >
                    {t("Камер")}
                  </Button>
                </div>
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
                        ) : baiguullaga?._id === "6115f350b35689cdbf1b9da3" ? (
                          <StackIkhNaydStream
                            barilgiinId={barilgiinId}
                            token={token}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </Card>
                  )}
                </Drawer>
              </div>
            </div>
            <div>
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
          </div>
          <Modal
            title={
              modalOpen.type !== "zurchil"
                ? modalOpen.type !== "dugaarBurtgekh"
                  ? modalOpen.type !== "orlogo"
                    ? t("Үнэгүй үйлчлүүлэгчийн төрөл сонгох")
                    : t("Орлого")
                  : t("Машин бүртгэх")
                : t("Зөрчил оруулах")
            }
            open={modalOpen.bool}
            onCancel={() => modalKhaakh()}
            width={564}
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
              {modalOpen.type !== "dugaarBurtgekh" &&
              modalOpen.type !== "orlogo" ? (
                <>
                  <Radio.Group onChange={onChange} value={value}>
                    {modalOpen.type !== "zurchil" ? (
                      <Space align="start">
                        <Space.Compact direction="vertical">
                          <Radio value="Цагдаа">{t("Цагдаа")}</Radio>
                          <Radio value="Гал">{t("Гал")}</Radio>
                          <Radio value="Эмнэлэг">{t("Эмнэлэг")}</Radio>
                          <Radio value="Онцгой">{t("Онцгой")}</Radio>
                          <Radio value="Борлуулалтын машин">
                            {t("Борлуулалтын машин")}
                          </Radio>
                          <Radio value="Хөгжлийн бэрхшээлтэй">
                            {t("Хөгжлийн бэрхшээлтэй")}
                          </Radio>
                          <Radio value="Хогны машин">{t("Хогны машин")}</Radio>
                          <Radio value="Шуудан">Шуудан</Radio>
                          <Radio value="Дэлгүүрийн үйлчлүүлэгч">
                            {t("Дэлгүүрийн үйлчлүүлэгч")}
                          </Radio>
                          {baiguullaga?._id === "63c0f31efe522048bf02086d" && (
                            <>
                              <Radio value="Түрээслэгч">
                                {t("Түрээслэгч")}
                              </Radio>
                              <Radio value="Барилга">{t("Барилга")}</Radio>
                            </>
                          )}
                        </Space.Compact>
                        <Space.Compact direction="vertical">
                          <Radio value="Бүртгэл хийгдээгүй айл">
                            Бүртгэл хийгдээгүй айл
                          </Radio>
                          <Radio value="Бүртгэл хийгдээгүй үйлчилгээ эрхлэгч">
                            Бүртгэл хийгдээгүй үйлчилгээ эрхлэгч
                          </Radio>
                          <Radio value="Хүргэлтийн машин">
                            Хүргэлтийн машин
                          </Radio>
                          <Radio value="Компанийн ажилчдын машин">
                            Компанийн ажилчдын машин
                          </Radio>
                          <Radio value="Такси">Такси</Radio>
                          <Radio value="Бүртгэл хийгдэх тоот">
                            Бүртгэл хийгдэх тоот
                          </Radio>
                          <Radio value="Тусгай зочид">Тусгай зочид</Radio>
                          <Radio value="Банк хамгаалалт">Банк хамгаалалт</Radio>
                        </Space.Compact>
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
              ) : modalOpen.type === "orlogo" ? (
                <Form
                  form={form}
                  className="flex w-full gap-4"
                  onFinish={orlogoGaraasOruulya}
                >
                  <Form.Item
                    label={t("Дугаар1")}
                    name="mashiniiDugaar"
                    className="w-1/2"
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
                        pattern: new RegExp(
                          "[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{3}|[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{2}"
                        ),
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
                    name="tulukhDun"
                    label={t("Дүн")}
                    className="w-1/2"
                    rules={[
                      {
                        required: true,
                        message: t("Үнийн дүн оруулна уу."),
                      },
                    ]}
                  >
                    <InputNumber
                      className="w-fit"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      placeholder={t("Төлөх дүн...")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      min={0}
                      step={500}
                    />
                  </Form.Item>
                  <a
                    onClick={() => form.resetFields()}
                    className="ml-2 flex h-8 items-center rounded border border-red-400 px-2 hover:bg-red-200 dark:text-white"
                  >
                    {t("Цэвэрлэх")}
                  </a>
                </Form>
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
                            songogdsonBurtgel !== "Гарах" &&
                            true,
                          min: songogdsonBurtgel == "Гарах" ? 6 : 7,
                          max: 7,
                          pattern:
                            songogdsonBurtgel == "Гарах"
                              ? new RegExp(
                                  "[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{3}|[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{2}"
                                )
                              : new RegExp("[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{3}"),
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
                      <Select
                        onChange={(_, e) => setSongogdsonBurtgel(e.children)}
                        className=""
                        placeholder={`${t("Камер")} IP`}
                      >
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
          <div style={{ position: "absolute", bottom: 25 }}>
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
        <text
          style={{
            width: 120,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
          className="font-bold text-blue-600"
        >
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
