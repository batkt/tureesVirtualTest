import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import {
  Button,
  Card,
  DatePicker,
  Input,
  InputNumber,
  message,
  notification,
  Popconfirm,
  Popover,
  Select,
  Space,
  Table,
  TimePicker,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  DollarTwoTone,
  DownloadOutlined,
  DownOutlined,
  EyeOutlined,
  FieldTimeOutlined,
  FileExcelOutlined,
  MoreOutlined,
  PaperClipOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import { modal } from "components/ant/Modal";
import _ from "lodash";
import useOrder from "tools/function/useOrder";
import uilchilgee, {
  aldaaBarigch,
  togloomUilchilgee,
} from "services/uilchilgee";
import Aos from "aos";
import KhuukhedBurtgel from "components/pageComponents/togloom/TsagBurtgel";
import useJagsaalt from "hooks/useJagsaalt";
import { useToololt } from "hooks/useToololt";
import Tulbur from "components/pageComponents/togloomiinTuv/Tulbur";
import { useTranslation } from "react-i18next";
import BaganiinSongolt from "components/table/BaganiinSongolt";
import { excelTatajAvya } from "../zogsool";
import { t } from "i18next";
import { ImQrcode } from "react-icons/im";
import { useQRCode } from "next-qrcode";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useKeyboardTovchlol } from "hooks/useKeyboardTovchlol";
import TogloomTile from "components/pageComponents/togloom/TogloomTile";

const DelegrenguiKharakh = React.forwardRef(
  ({ data, destroy, confirm }, ref) => {
    React.useImperativeHandle(
      ref,
      () => ({
        khaaya() {
          destroy();
        },
      }),
      []
    );

    const tulburiinMedeelel = useMemo(() => {
      var ugugdul = [];
      var niitDun = data?.reduce((a, b) => a + b.niitDun, 0) || 0;

      data?.forEach((element) => {
        switch (element?._id) {
          case "khariltsakh":
            ugugdul.push({
              ner: "Харилцах",
              icon: "https://static.vecteezy.com/system/resources/previews/012/487/823/original/3d-hand-press-pay-button-icon-phone-with-credit-card-float-on-transparent-mobile-banking-online-payment-service-withdraw-money-easy-shop-cashless-society-concept-cartoon-minimal-3d-render-png.png",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "belen":
            ugugdul.push({
              ner: "Бэлэн",
              icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "khunglukh":
            ugugdul.push({
              ner: "Хөнгөлөх",
              icon: "https://static.vecteezy.com/system/resources/previews/012/487/845/original/3d-wallet-floating-in-hand-isolated-on-transparent-business-man-holding-purple-purse-icon-mobile-banking-online-service-cashback-refund-loan-concept-saving-money-wealth-cartoon-3d-render-png.png",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "khaan":
            ugugdul.push({
              ner: "Хаан банк",
              icon: "https://play-lh.googleusercontent.com/Aw4bwCDJgAzu6AFAbbcfCFpheVMB6ZKiEM3JlrJ3cAM65fK-1QaTZZs_Vk4UFBzykQ=s480-rw",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "tdb":
            ugugdul.push({
              ner: "TDB банк",
              icon: "https://tz.mn/storage/uploads/slider/45adc5a14070aa.jpg",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "khas":
            ugugdul.push({
              ner: "Xac банк",
              icon: "https://cdn6.aptoide.com/imgs/0/6/d/06df97a06fbc7622a775a7c414b69e87_icon.png",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "golomt":
            ugugdul.push({
              ner: "Голомт банк",
              icon: "https://play-lh.googleusercontent.com/9tUBesUsI4UIkpgO1MPIMLFvhDa_4vZE75TrVAUHFA7a0bJ7IIgeyh2r1QXs9VlmXmkX",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "kapitron":
            ugugdul.push({
              ner: "Капитрон банк",
              icon: "https://play-lh.googleusercontent.com/1PMmu0x2x_07XdPtLyTRe_4cffXDLFCG3xEoUTqUpy3eSJeB-C81dbyzZSnJjW907OA=w240-h480-rw",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "tur":
            ugugdul.push({
              ner: "Төрийн банк",
              icon: "https://play-lh.googleusercontent.com/KYQyVTgP4ZV60gxNOsKYssScNe17NMgHpO_nRY4WRBYj_4YTZ0e8t6zwh38sTFmyCco",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "qpay":
            ugugdul.push({
              ner: element._id,
              icon: "https://qpay.mn/q/img/q.png",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "monpay":
            ugugdul.push({
              ner: element._id,
              icon: "https://play-lh.googleusercontent.com/GofyFzRM2Kwf3d47fl6FibZB7kE16Aljaodzc-ghiJmdiPpGljaqeop2T6JaURd8rw=s480-rw",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "socialpay":
            ugugdul.push({
              ner: element._id,
              icon: "https://play-lh.googleusercontent.com/Jg_jjsNezlkTuxWT5ADzfqhjwHVvqZEDqQGbXJlkplNrYPyyMGXtmLA6dGrH37_paOY=w240-h480-rw",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "pocket":
            ugugdul.push({
              ner: element._id,
              icon: "https://play-lh.googleusercontent.com/l0PMiUcleEv4dTZslRa9psOfrlB3S8NpBwctOoxQ6vlqfjamIf2ZxVlynfqiSelbTg=w240-h480-rw",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "lend":
            ugugdul.push({
              ner: element._id,
              icon: "https://play-lh.googleusercontent.com/VEPdS1mrQMl-tmGa86GLKXiYt1WJFSSGrKeW83liDogKSTE5P0p0bei8i_QwatQhI0k=w240-h480-rw",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;

          default:
            ugugdul.push({
              ner: element._id,
              icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png",
              dun: element.niitDun,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
        }
      });

      return ugugdul;
    }, [data]);

    useEffect(() => {
      function keyUp(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          destroy();
        }
      }
      document.addEventListener("keyup", keyUp);
      return () => document.removeEventListener("keyup", keyUp);
    }, []);

    return tulburiinMedeelel.length > 0 ? (
      <div className="space-y-3">
        {tulburiinMedeelel.map((a, i) => {
          return (
            <div
              className="relative flex h-14 w-full items-center overflow-hidden rounded-md border-2 p-2"
              key={i}
            >
              <div
                style={{ width: `${String(Math.round(a.khuvi))}%` }}
                className={`absolute left-0 top-0 z-0 flex h-full items-center bg-green-100 `}
              >
                <div className="absolute -right-1 h-20 w-16 animate-spin-slow rounded-3xl bg-green-100 " />
              </div>
              <img
                src={a.icon}
                className="z-10 mx-2 h-11 w-12 overflow-hidden rounded-md"
              />
              <div className="z-10 flex w-full justify-between text-lg font-semibold">
                {a.ner}:
                <div className="flex font-normal">
                  {formatNumber(a.dun) || 0}₮
                  <div className="ml-3 flex w-14 items-center justify-center border-l border-green-600 pl-2 text-center">
                    <div>
                      {a.khuvi - Math.floor(a.khuvi) > 0
                        ? Number(a.khuvi).toFixed(2)
                        : a.khuvi || 0}
                    </div>
                    %
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="flex h-52 w-full items-center justify-center">
        <div className="text-lg font-semibold text-black text-opacity-30 dark:text-gray-400">
          Орлогын мэдээлэл байхгүй байна.
        </div>
      </div>
    );
  }
);

const QrCodeAvakh = React.forwardRef(
  ({ destroy, duusakhTsag, ekhlekhTsag }, ref) => {
    const khevlekhRef = useRef(null);
    const { Canvas } = useQRCode();
    const handlePrint = useReactToPrint({
      content: () => khevlekhRef.current,
    });

    React.useImperativeHandle(
      ref,
      () => ({
        khadgalya() {
          handlePrint();
          destroy();
        },
        khaaya() {
          destroy();
        },
      }),
      [duusakhTsag]
    );

    return (
      <div className="">
        <div
          ref={khevlekhRef}
          className="flex h-full w-full flex-col items-center justify-center gap-5"
        >
          <div className="w-[80%] max-w-[400px] text-justify">
            <div>
              Эхлэх хугацаа: {moment(ekhlekhTsag).format("YYYY-MM-DD HH:mm")}
            </div>{" "}
            <div>
              Дуусах хугацаа: {moment(duusakhTsag).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>
          {!!duusakhTsag ? (
            <Canvas
              text={moment(duusakhTsag).format("YYYYMMDDHHmmss")}
              options={{
                level: "M",
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                  dark: "#000000",
                  light: "#FFFFFF",
                },
              }}
            />
          ) : (
            <div>Хоосон</div>
          )}
          <div className="max-w-[400px] text-center">
            Энэхүү QR код нь тоглох хүчинтэй хугацаанд зөвхөн нэг удаа нэвтэрч
            ороход ашиглагдахыг анхаарна уу!
          </div>
        </div>
      </div>
    );
  }
);

const TsutsalsanShaltgaan = React.forwardRef(({ destroy, confirm }, ref) => {
  const [shaltgaan, setTsutsalsanShaltgaan] = useState("");
  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(shaltgaan);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [shaltgaan]
  );
  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);
  return (
    <div>
      <Input.TextArea
        value={shaltgaan}
        onChange={({ target }) => setTsutsalsanShaltgaan(target?.value)}
      />
    </div>
  );
});

const TsagSungakh = React.forwardRef(
  ({ data, destroy, confirm, token }, ref) => {
    const [niitDun, setNiitDun] = useState();
    const [khugatsaa, setKhugatsaa] = useState();
    const [ekhlekhTsag, setEkhlekhTsag] = useState(data?.duusakhTsag);
    const [duusakhTsag, setDuusakhTsag] = useState(data?.duusakhTsag);
    const [asragch, setAsragch] = useState(data?.asragchiinTurul);

    React.useImperativeHandle(
      ref,
      () => ({
        khadgalya() {
          if (!khugatsaa) {
            message.warn("Сунгах хугацаа оруулна уу!");
            setKhugatsaa(false);
            return;
          }
          confirm(niitDun, khugatsaa, ekhlekhTsag, duusakhTsag, data);
          destroy();
        },
        khaaya() {
          destroy();
        },
      }),
      [niitDun, khugatsaa, ekhlekhTsag, duusakhTsag, data]
    );
    function onChangeKhugatsaa(v) {
      setDuusakhTsag(moment(ekhlekhTsag).add("minutes", v));
      setKhugatsaa(v);
    }

    useEffect(() => {
      if (khugatsaa > 0 || asragch.length > 0) {
        uilchilgee(token)
          .post("/togloomiinDunBoduulya", {
            niitMinut:
              (data?.khugatsaa || 0) +
              (data?.sungasanMinut || 0) +
              (khugatsaa || 0),
            minut: khugatsaa || 0,
            tulugdsunDun: data?.niitTulbur?.reduce((a, b) => a + b.dun, 0) || 0,
            asragchiinToo: asragch.length || 0,
          })
          .then(({ data }) => {
            if (!!data) {
              setNiitDun(data?.dun);
            } else {
              setNiitDun(undefined);
            }
          });
      } else {
        setNiitDun(undefined);
      }
    }, [khugatsaa, asragch]);
    useEffect(() => {
      function keyUp(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          destroy();
        }
      }
      document.addEventListener("keyup", keyUp);
      return () => document.removeEventListener("keyup", keyUp);
    }, []);
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <label className="w-48 pr-4 text-end">{t("Асран хамгаалагч")}:</label>
          <Select
            className="w-full"
            mode="multiple"
            value={asragch}
            onChange={(v) => {
              setAsragch(v);
            }}
            placeholder="Асран хамгаалагч"
          >
            {["Аав", "Ээж", "Өвөө", "Эмээ", "Ах", "Эгч", "Бусад"].map((a) => {
              return <Select.Option key={a}>{t(a)}</Select.Option>;
            })}
          </Select>
        </div>
        <div className="flex items-center">
          <label className="w-48 pr-4 text-end">{t("Хугацаа/мин/")}:</label>
          <InputNumber
            className="w-full"
            value={khugatsaa}
            status={khugatsaa === false && "error"}
            placeholder={t("Сунгах хугацаа/мин/")}
            onChange={(v) => onChangeKhugatsaa(v)}
          />
        </div>
        <div className="flex items-center">
          <label className="w-48 pr-4 text-end">{t("Эхлэх цаг/мин/")}:</label>
          <TimePicker
            showSecond={false}
            placeholder={t("Эхлэх цаг/мин/")}
            disabled
            className="w-full"
            value={moment(ekhlekhTsag)}
            autoComplete="off"
          />
        </div>
        <div className="flex items-center">
          <label className="w-48 pr-4 text-end">{t("Дуусах цаг/мин/")}:</label>
          <TimePicker
            showSecond={false}
            placeholder={t("Дуусах цаг/мин/")}
            disabled
            className="w-full"
            value={moment(duusakhTsag)}
            autoComplete="off"
          />
        </div>
        <div className="flex items-center">
          <label className="w-48 pr-4 text-end">{t("Дүн")}:</label>
          <InputNumber
            value={niitDun}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            disabled={true}
            placeholder={t("Дүн")}
            min="1"
            className="w-full"
          />
        </div>
      </div>
    );
  }
);

function DuusakhTsagAvii({ v, data, onRefresh }) {
  const [duussan, setDuussan] = useState(false);
  const tsagTootsoolur = () => {
    const today = moment(new Date()).format("YYYYMMDD");
    const duusakhUdur = moment(v).format("YYYYMMDD");
    const odooginTsag =
      Number(moment(new Date()).format("HH")) * 60 * 60 +
      Number(moment(new Date()).format("mm")) * 60 +
      Number(moment(new Date()).format("ss"));
    const ekhlekhTsag =
      Number(moment(data?.ekhlekhTsag).format("HH")) * 60 * 60 +
      Number(moment(data?.ekhlekhTsag).format("mm")) * 60 +
      Number(moment(data?.ekhlekhTsag).format("ss"));
    const duusakhTsag =
      Number(moment(v).format("HH")) * 60 * 60 +
      Number(moment(v).format("mm")) * 60 +
      Number(moment(v).format("ss"));

    const difference = duusakhTsag - odooginTsag;
    const difference2 = duusakhTsag - ekhlekhTsag;
    let timeLeft = "Дууссан";
    if (Number(today) <= Number(duusakhUdur)) {
      if (ekhlekhTsag > odooginTsag) {
        var tsag = Math.floor(difference2 / 60 / 60);
        var minut = Math.floor((difference2 - tsag * 60 * 60) / 60);
        var second = Math.floor(difference2 - tsag * 60 * 60 - minut * 60);
        timeLeft = {
          hours: tsag,
          minutes: minut,
          seconds: second,
          ekhlekhTsagBoloogui: true,
        };
      } else if (difference > 0) {
        var tsag = Math.floor(difference / 60 / 60);
        var minut = Math.floor((difference - tsag * 60 * 60) / 60);
        var second = Math.floor(difference - tsag * 60 * 60 - minut * 60);
        timeLeft = {
          hours: tsag,
          minutes: minut,
          seconds: second,
        };
        if (difference < 300 && duussan === false) {
          setDuussan("duhsun");
        }
      } else if (difference === 0) {
        notification.warning({
          duration: 0,
          message: t("Цаг дууслаа"),
          description:
            data?.khuukhdiinToo > 1
              ? `${data.ner} /${data?.khuukhdiinToo}/ бүлгийн цаг дууссан байна!`
              : `${data.ovog} овогтой ${data.ner} цаг дууссан байна!`,
        });
      } else if (duussan === "duhsun") {
        setDuussan(true);
        onRefresh();
      }
    }

    return timeLeft;
  };

  useEffect(() => {
    if (duussan === true) {
      setTimeout(() => {
        setDuussan(false);
      }, 5000);
    }
  }, [duussan]);

  function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
      r = "0" + r;
    }
    return r;
  }

  const [timeLeft, setTimeLeft] = useState("Тооцоолж байна");

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(tsagTootsoolur());
    }, 1000);
  }, [timeLeft, v]);

  if (timeLeft === "Тооцоолж байна") {
    return <div className="animate-pulse">{t("Тооцоолж байна")}</div>;
  } else if (timeLeft === "Дууссан") {
    return (
      <div
        className={`bg-red-500 ${
          duussan === true && "animate-bounce-fast "
        } cursor-default rounded-lg border font-medium text-white`}
      >
        {t("Дууссан")}
      </div>
    );
  } else
    return (
      <Popover
        content={
          timeLeft?.ekhlekhTsagBoloogui === true && (
            <div>{moment(data?.ekhlekhTsag).format("HH:mm")}-аас эхэлнэ</div>
          )
        }
      >
        <div
          className={`${
            duussan === "duhsun"
              ? "bg-yellow-500"
              : timeLeft?.ekhlekhTsagBoloogui === true
              ? "bg-blue-600"
              : "bg-green-500"
          } cursor-default rounded-lg border font-medium text-white transition-colors`}
        >
          {FormatNumberLength(timeLeft.hours, 2)}:
          {FormatNumberLength(timeLeft.minutes, 2)}:
          {FormatNumberLength(timeLeft.seconds, 2)}
        </div>
      </Popover>
    );
}
const searchKeys = ["ner", "utas", "ovog"];

function togloom1() {
  const { t, i18n } = useTranslation();
  const { token, baiguullaga, barilgiinId, ajiltan } = useAuth();

  const [ognoo, setOgnoo] = useState([moment(), moment()]);
  const mashinref = useRef(null);
  const [turul, setTurul] = useState({ shuult: { tuluv: undefined } });
  const tulburRef = React.useRef(null);
  const [shineBagana, setShineBagana] = useState([]);
  const [khaalga, setKhaalga] = useState(["a", "b"]);

  const { toololt, toololtMutate } = useToololt(
    "/togloomiinToololtAvya",
    token,
    ognoo
  );

  useEffect(() => {
    togloomUilchilgee()
      .get("/khaalguudAvya")
      .then((res) => {
        setKhaalga(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const togloomiinDun = useToololt("/togloomiinDunAvya", token, ognoo);
  const { order, onChangeTable } = useOrder({ createdAt: -1 });
  const [khaaltPopoverNeegdsen, setKhaaltPopoverNeegdsen] = useState(false);
  const delegrenhuiRef = React.useRef(null);

  function khaaltNeey(id) {
    togloomUilchilgee()
      .get(`/neeye/${id}`)
      .then((res) => {
        if (res.data === "Amjilttai") {
          notification.success({ message: `${id} хаалга амжилттай нээгдлээ` });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function tsutslakh(data) {
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        {t("Цуцлах")}
      </Button>,
    ];
    modal({
      title: (
        <div className="flex w-full items-center justify-between">
          {t("Цуцлах шалтгаан")}{" "}
          <div
            className="text-xl hover:text-red-400"
            onClick={() => tailbarRef.current.khaaya()}
          >
            <CloseCircleOutlined />
          </div>
        </div>
      ),
      content: (
        <TsutsalsanShaltgaan
          ref={tailbarRef}
          confirm={(shaltgaan) =>
            uilchilgee(token)
              .post("/togloomTsutslaya", {
                id: data._id,
                shaltgaan,
              })
              .then(({ data }) => {
                if (data === "Amjilttai") {
                  message.success("Цуцлагдлаа");
                }
              })
              .finally(() => onRefresh())
          }
        />
      ),
      footer,
    });
  }
  function sungakh(data) {
    const footer = [
      <Button onClick={() => sungakhRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => sungakhRef.current.khadgalya()}>
        {t("Сунгах")}
      </Button>,
    ];
    modal({
      title: (
        <div className="flex w-full items-center justify-between">
          {t("Цаг сунгах")}
          <div
            className="text-xl hover:text-red-400"
            onClick={() => sungakhRef.current.khaaya()}
          >
            <CloseCircleOutlined />
          </div>
        </div>
      ),
      content: (
        <TsagSungakh
          ref={sungakhRef}
          token={token}
          data={data}
          confirm={(niitDun, khugatsaa, ekhlekhTsag, duusakhTsag, data) =>
            uilchilgee(token)
              .post("/togloomSungaya", {
                khugatsaa,
                niitDun,
                ekhlekhTsag,
                duusakhTsag,
                id: data?._id,
              })
              .then(({ data }) => {
                if (data === "Amjilttai") {
                  message.success(t("Цаг амжилттай сунагдлаа"));
                  togloominTuviinGaralt.mutate();
                }
              })
              .catch(aldaaBarigch)
              .finally(() => onRefresh())
          }
        />
      ),
      footer,
    });
  }

  const query = useMemo(() => {
    return {
      ognoo: ognoo
        ? {
            $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
      ...turul.shuult,
    };
  }, [ognoo, turul]);

  const togloominTuviinGaralt = useJagsaalt(
    "togloomiinTuv",
    query,
    order,
    undefined,
    searchKeys
  );
  const tailbarRef = React.useRef(null);
  const sungakhRef = React.useRef(null);

  const toololtGaralt = useMemo(
    () => [
      {
        name: "Нийт",
        too:
          toololt?.length > 0 &&
          toololt[0]?.tsutsalsan +
            toololt[0]?.tulsun +
            toololt[0]?.tuluugui +
            toololt[0]?.ekhlesen,
        shuult: { tuluv: undefined },
      },
      {
        name: "Эхэлсэн",
        too: formatNumber(toololt?.length > 0 ? toololt[0]?.ekhlesen : 0, 0),
        shuult: {
          $and: [
            {
              ekhlekhTsag: { $lte: new Date() },
            },
            {
              duusakhTsag: { $gt: new Date() },
            },
            {
              tuluv: { $ne: -1 },
            },
          ],
        },
      },
      {
        name: "Цуцлагдсан",
        too: formatNumber(toololt?.length > 0 ? toololt[0]?.tsutsalsan : 0, 0),
        shuult: { tuluv: -1 },
      },
      {
        name: "Төлсөн",
        too: formatNumber(toololt?.length > 0 ? toololt[0]?.tulsun : 0, 0),
        shuult: {
          $and: [
            {
              duusakhTsag: { $lte: new Date() },
            },
            {
              tulburTulsunEsekh: { $eq: true },
            },
          ],
        },
      },
      {
        name: "Төлөөгүй",
        too: formatNumber(toololt?.length > 0 ? toololt[0].tuluugui : 0, 0),
        shuult: {
          $and: [
            {
              duusakhTsag: { $lte: new Date() },
            },
            {
              tuluv: { $ne: -1 },
            },
            {
              $or: [
                {
                  tulburTulsunEsekh: { $eq: false },
                },
                {
                  tulburTulsunEsekh: { $not: { $eq: true } },
                },
              ],
            },
          ],
        },
      },
      {
        name: "Хөнгөлсөн",
        too: formatNumber(toololt?.length > 0 ? toololt[0]?.khungulsun : 0, 0),
        shuult: { khungulsunEsekh: true },
      },
    ],
    [toololt]
  );

  function onRefresh() {
    toololtMutate();
    togloomiinDun.toololtMutate();
    togloominTuviinGaralt.mutate();
  }

  useEffect(() => {
    setShineBagana([]);
  }, [i18n.language]);

  function tulburTulyu(data) {
    modal({
      title: (
        <div className="flex w-full flex-row justify-between">
          <div>{t("Тооцоо хийх")}</div>
          <div className="flex items-center">
            {data?.ovog?.charAt(0)}.{data?.ner}
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
          ref={tulburRef}
          data={_.cloneDeep(data)}
          token={token}
          baiguullaga={baiguullaga}
          barilgiinId={barilgiinId}
          ajiltan={ajiltan}
          onRefresh={onRefresh}
        />
      ),
      footer: false,
    });
  }

  const qrRef = useRef();

  function qrKhevlekh(duusakhTsag, ekhlekhTsag) {
    const today = moment(new Date()).format("YYYYMMDD");
    const duusakhUdur = moment(duusakhTsag).format("YYYYMMDD");
    const odooginTsag =
      Number(moment(new Date()).format("HH")) * 60 * 60 +
      Number(moment(new Date()).format("mm")) * 60 +
      Number(moment(new Date()).format("ss"));
    const duusakhTsag2 =
      Number(moment(duusakhTsag).format("HH")) * 60 * 60 +
      Number(moment(duusakhTsag).format("mm")) * 60 +
      Number(moment(duusakhTsag).format("ss"));
    const difference =
      Number(String(duusakhUdur) + String(duusakhTsag2)) -
      Number(String(today) + String(odooginTsag));

    if (Number(today) <= Number(duusakhUdur)) {
      if (difference > 0) {
        const footer = [
          <Button onClick={() => qrRef.current.khaaya()}>{t("Хаах")}</Button>,
          <Button onClick={() => qrRef.current.khadgalya()}>
            {t("Хэвлэх")}
          </Button>,
        ];
        modal({
          title: `Нэвтрэх QRcode`,
          icon: <ImQrcode />,
          content: (
            <QrCodeAvakh
              ref={qrRef}
              duusakhTsag={duusakhTsag}
              ekhlekhTsag={ekhlekhTsag}
            />
          ),
          footer,
        });
      } else message.warn("Цаг дууссан байна!");
    } else message.warn("Цаг дууссан байна!");
  }

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        align: "center",
        width: "2.5rem",
        render: (text, record, index) =>
          (togloominTuviinGaralt?.data?.khuudasniiDugaar || 0) *
            (togloominTuviinGaralt?.data?.khuudasniiKhemjee || 0) -
          (togloominTuviinGaralt?.data?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: t("Хүүхдийн мэдээлэл"),
        align: "center",
        width: "10rem",
        showSorterTooltip: false,
        render: (data) => (
          <Popover
            content={
              data?.khuukhdiinToo === 1 && (
                <div className="min-w-[210px] border ">
                  {
                    <div>
                      <div className="flex w-full justify-between bg-green-50 p-1 px-2">
                        <div className="font-medium">Овог:</div>{" "}
                        <div>{data?.ovog}</div>
                      </div>
                      <div className="flex w-full justify-between border-y p-1 px-2">
                        <div className="font-medium">Нэр:</div>{" "}
                        <div>{data?.ner}</div>
                      </div>
                      <div className="flex w-full justify-between bg-green-50 p-1 px-2">
                        <div className="font-medium">Нас:</div>{" "}
                        <div>{data?.nas}</div>
                      </div>
                    </div>
                  }
                </div>
              )
            }
          >
            <div
              className={`flex w-full cursor-default justify-center gap-2 px-3 font-medium text-white transition-colors ${
                data?.khuukhdiinToo > 1
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "bg-green-500 hover:bg-green-400"
              } items-center rounded-md`}
            >
              <div className="w-full text-center">{data?.ner}</div>{" "}
              {data?.khuukhdiinToo > 1 ? (
                <div className="px-1">{data.khuukhdiinToo}</div>
              ) : (
                <EyeOutlined className="text-xl" />
              )}
            </div>
          </Popover>
        ),
      },
      // {
      //   title: t("Нэр"),
      //   align: "center",
      //   dataIndex: "ner",
      //   width: "10rem",
      //   showSorterTooltip: false,
      //   render: (v) => <div className="w-full text-left">{v}</div>
      // },
      // {
      //   title: t("Нас"),
      //   align: "center",
      //   dataIndex: "nas",
      //   width: "4rem",
      //   showSorterTooltip: false,
      //   sorter: () => 0,
      // },
      {
        title: t("Утас"),
        align: "center",
        dataIndex: "utas",
        width: "6rem",
        showSorterTooltip: false,
      },
      {
        title: t("Хугацаа/мин/"),
        align: "center",
        width: "8rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "khugatsaa",
      },
      {
        title: t("Эхлэх цаг"),
        align: "center",
        width: "9rem",
        dataIndex: "ekhlekhTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (v) => {
          return moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Сунгасан/мин/"),
        align: "center",
        width: "8.5rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "sungasanMinut",
        render: (data) => (!!data ? data : 0),
      },
      {
        title: t("Төлөв"),
        align: "center",
        width: "10rem",
        dataIndex: "tuluv",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (v, data) => {
          return data.tuluv === -1 ? (
            <Popover
              content={
                <div className="dark:text-gray-200">
                  <div className="font-medium">{t("Тайлбар")}:</div>{" "}
                  <div className="text-center">
                    -{data?.tsutsalsanShaltgaan}
                  </div>
                </div>
              }
            >
              <div className="cursor-pointer rounded-lg border bg-gray-500 font-medium text-white">
                {t("Цуцлагдсан")}
              </div>
            </Popover>
          ) : data.tuluv === 3 ? (
            <div className="cursor-pointer rounded-lg border bg-green-500 font-medium text-white">
              {t("Гарсан")}
            </div>
          ) : (
            <DuusakhTsagAvii
              v={data.duusakhTsag}
              data={data}
              onRefresh={onRefresh}
            />
          );
        },
      },
    ];
    return [
      ...jagsaalt,
      ...shineBagana,
      {
        title: t("нийт дүн"),
        align: "center",
        width: "9rem",
        dataIndex: "niitDun",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (v) => {
          return <div className="w-full text-right">{formatNumber(v, 0)}</div>;
        },
      },
      {
        title: t("Хөнгөлсөн дүн"),
        dataIndex: "khungulsunDun",
        align: "center",
        width: "10rem",
        showSorterTooltip: false,
        render: (v, data) => {
          const khunglukh = data?.tulbur?.find((a) => a.turul === "khunglukh");
          return (
            <div className="flex w-full items-center">
              {!!khunglukh?.tailbar && (
                <Popover
                  content={
                    <div className="dark:text-gray-200">
                      <div className="font-medium">Тайлбар:</div>{" "}
                      <div className="text-center">{khunglukh?.tailbar}</div>
                    </div>
                  }
                >
                  <div className="flex w-full justify-center text-lg text-blue-500">
                    <EyeOutlined className="cursor-pointer" />
                  </div>
                </Popover>
              )}{" "}
              <div className="w-full text-right">
                {khunglukh ? formatNumber(v, 0) : 0}
              </div>
            </div>
          );
        },
      },
      {
        fixed: "right",
        width: "5rem",
        title: "QR",
        align: "center",
        render: (a, data) => (
          <div className="flex w-full justify-center">
            <div
              onClick={() => qrKhevlekh(data?.duusakhTsag, data?.ekhlekhTsag)}
              className="cursor-pointer rounded-xl border-2 border-white bg-gray-200 p-1 px-3 transition-all hover:bg-white hover:text-black dark:text-black"
            >
              <ImQrcode />
            </div>
          </div>
        ),
      },
      {
        fixed: "right",
        width: "10rem",
        title: t("Төлбөр"),
        align: "center",
        ellipsis: true,
        render: (data) => {
          return data.tuluv !== -1 &&
            (data?.tulburTulsunEsekh !== true ||
              data?.ebarimtAvsanEsekh !== true) ? (
            <div className="flex justify-center">
              <Button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    data?.tulburTulsunEsekh !== true ? "#FF8505" : "#253985",
                }}
                // type={`${data?.tulbur === [] ? "primary" : "warning"}`}
                size="small"
                // danger={data?.tuluv === "3"}
                // icon={<DollarCircleOutlined className="text-white" />}
                onClick={() => tulburTulyu(data)}
              >
                {data?.tulburTulsunEsekh !== true ? (
                  <div className="flex items-center  justify-center space-x-2 text-white">
                    <div className="flex items-center justify-center">
                      <DollarCircleOutlined />
                    </div>
                    <div className="flex items-center justify-center">
                      {t("Төлбөр")}
                    </div>
                    {togloominTuviinGaralt?.jagsaalt?.find(
                      (a) => a?.tulburTulsunEsekh !== true
                    )?._id === data?._id && "[ F2 ]"}
                  </div>
                ) : (
                  <div className="flex items-center  justify-center space-x-2 text-white ">
                    <div className="flex items-center justify-center">
                      <PaperClipOutlined />
                    </div>
                    <div className="flex items-center justify-center">
                      {t("И-Баримт")}
                    </div>
                  </div>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#0CB20C",
                }}
                // type={`${data?.tulbur === [] ? "primary" : "warning"}`}
                size="small"
                // danger={data?.tuluv === "3"}
                // icon={<DollarCircleOutlined className="text-white" />}
              >
                <div className="flex items-center  justify-center space-x-2 text-white">
                  <div className="flex items-center justify-center">
                    <CheckCircleOutlined />
                  </div>
                  <div className="flex items-center justify-center">
                    {t("Дууссан")}
                  </div>
                </div>
              </Button>
            </div>
          );
        },
      },
      {
        title: () => <SettingOutlined />,
        ellipsis: true,
        fixed: "right",
        width: "3rem",
        align: "center",
        render: (data, v) => {
          const today = moment(new Date()).format("YYYYMMDD");
          const duusakhUdur = moment(data.duusakhTsag).format("YYYYMMDD");
          const odooginTsag =
            Number(moment(new Date()).format("HH")) * 60 * 60 +
            Number(moment(new Date()).format("mm")) * 60 +
            Number(moment(new Date()).format("ss"));
          const duusakhTsag =
            Number(moment(data.duusakhTsag).format("HH")) * 60 * 60 +
            Number(moment(data.duusakhTsag).format("mm")) * 60 +
            Number(moment(data.duusakhTsag).format("ss"));
          const difference =
            Number(String(duusakhUdur) + String(duusakhTsag)) -
            Number(String(today) + String(odooginTsag));
          const ner = data?.ner;
          const ovog = data?.ovog;
          if (
            -1 !== data?.tuluv &&
            3 !== data?.tuluv &&
            (data.tulburTulsunEsekh === true ||
              (Number(today) <= Number(duusakhUdur) && difference > 0))
          ) {
            return (
              <div className="flex flex-row justify-center">
                <Popover
                  zIndex={10}
                  placement="bottom"
                  trigger="hover"
                  content={() => (
                    <div className="flex flex-col space-y-2">
                      {data?.tuluv !== 3 && data?.khuukhdiinToo === 1 && (
                        <Popconfirm
                          disabled={data?.tuluv === 3}
                          title={
                            <div>
                              Та үйлчлүүлэгчийн цаг сунгах гэж байна
                              <div>үргэлжлүүлэх бол тийм товчийг дарна уу</div>
                            </div>
                          }
                          okText={t("Тийм")}
                          cancelText={t("Үгүй")}
                          onConfirm={() => sungakh(data)}
                        >
                          <div
                            className={`text-md cursor-pointer rounded-full bg-green-500 px-3 py-1 text-center font-medium text-gray-50`}
                          >
                            {t("Сунгах")}
                          </div>
                        </Popconfirm>
                      )}
                      {Number(today) <= Number(duusakhUdur) &&
                        difference > 0 &&
                        data?.tulburTulsunEsekh !== true && (
                          <Popconfirm
                            title={`Та цуцлахдаа итгэлтэй байна уу?`}
                            okText={t("Тийм")}
                            cancelText={t("Үгүй")}
                            onConfirm={() => {
                              tsutslakh(data);
                            }}
                          >
                            <div
                              className={`text-md cursor-pointer rounded-full bg-yellow-500 px-3 py-1 font-medium text-gray-50`}
                            >
                              {t("Цуцлах")}
                            </div>
                          </Popconfirm>
                        )}
                      {data.tulburTulsunEsekh === true && (
                        <Popconfirm
                          disabled={data?.tuluv === 3}
                          title={`Та үйлчлүүлэгчийг гаргахдаа итгэлтэй байна уу?`}
                          okText={t("Тийм")}
                          cancelText={t("Үгүй")}
                          onConfirm={() =>
                            uilchilgee(token)
                              .post("/khuukhedGargaya", { id: data._id })
                              .then(({ data }) => {
                                if (data === "Amjilttai") {
                                  message.success(
                                    `${ovog && ovog.charAt(0)}.${ner} гарлаа`
                                  );
                                }
                              })
                              .finally(() => onRefresh())
                          }
                        >
                          <div
                            className={`text-md cursor-pointer rounded-full bg-${
                              3 === data?.tuluv ? "green" : "blue"
                            }-500 px-3 py-1 font-medium text-gray-50`}
                          >
                            {3 === data?.tuluv ? t("Гарсан") : t("Гаргах")}
                          </div>
                        </Popconfirm>
                      )}
                    </div>
                  )}
                >
                  <a className=" flex items-center justify-center  hover:scale-150">
                    <MoreOutlined style={{ fontSize: "18px" }} />
                  </a>
                </Popover>
              </div>
            );
          }
        },
      },
    ];
  }, [
    turul,
    token,
    baiguullaga,
    barilgiinId,
    shineBagana,
    ajiltan,
    togloominTuviinGaralt,
    t,
    onRefresh,
  ]);

  function orlogiinDelegrengui(data) {
    const footer = [
      <div>
        <Button type="primary" onClick={() => delegrenhuiRef.current.khaaya()}>
          Хаах
        </Button>
      </div>,
    ];
    modal({
      title: (
        <div className="flex w-full justify-between">
          Орлогын дэлгэрэнгүй
          <div>
            /{moment(ognoo[0]).format("YYYY-MM-DD")}/ - /
            {moment(ognoo[1]).format("YYYY-MM-DD")}/
          </div>
        </div>
      ),
      content: <DelegrenguiKharakh data={data} ref={delegrenhuiRef} />,
      footer,
    });
  }

  useEffect(() => {
    Aos.init({ once: true });
  });
  function khuukhedBurtgekh(data) {
    modal({
      title: (
        <div className="flex w-full items-center justify-between">
          {t("Хүүхдийн цаг бүртгэл")}{" "}
          <div
            className="text-xl hover:text-red-400"
            onClick={() => mashinref.current.khaaya()}
          >
            <CloseCircleOutlined />
          </div>
        </div>
      ),
      icon: <FileExcelOutlined />,
      content: (
        <KhuukhedBurtgel
          ref={mashinref}
          token={token}
          onRefresh={onRefresh}
          barilgiinId={barilgiinId}
          data={data}
        />
      ),
      footer: false,
    });
  }

  useKeyboardTovchlol(
    "+",
    () => mashinref?.current === null && khuukhedBurtgekh()
  );
  useKeyboardTovchlol("F2", () => {
    var data = togloominTuviinGaralt?.jagsaalt?.find(
      (a) => a?.tulburTulsunEsekh !== true
    );
    tulburRef.current === null &&
      (!!data
        ? tulburTulyu(data)
        : message.warn("Төлбөр төлөх үйлчлүүлэгч байхгүй байна"));
  });

  return (
    <Admin
      title="Тоглоомын төв"
      khuudasniiNer="togloomTuv"
      onSearch={(search) =>
        togloominTuviinGaralt.setKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
      className="p-0 md:p-4"
      tsonkhniiId={"64472c1628c37d7cdda11a3a"}
    >
      <Card size="small" className="col-span-12 overflow-auto">
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:p-0 md:gap-6 2xl:grid-cols-12">
          {toololtGaralt.map((a, i) => (
            <div
              key={i}
              className={`zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 md:col-span-2 ${
                a.name === turul?.name ? "bg-green-50 dark:bg-gray-900" : ""
              }`}
              onClick={() => setTurul({ shuult: a.shuult, name: a.name })}
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
                    <div className="text-base text-gray-500">
                      {t(`${a.name}`)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="col-span-12">
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-5 xl:flex">
          <div
            className="w-full items-center gap-3 xl:flex"
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="100"
          >
            <DatePicker.RangePicker
              inputReadOnly
              className="w-full md:w-auto"
              size="large"
              allowClear={false}
              value={ognoo}
              onChange={setOgnoo}
            />
            <div
              onClick={() => orlogiinDelegrengui(togloomiinDun?.toololt)}
              className="group flex h-11 cursor-pointer flex-row items-center gap-3 space-x-2 rounded-md border px-3 text-lg font-medium transition-colors hover:border-blue-500 hover:text-blue-500"
            >
              {t("Тоглоомын орлого")} :{" "}
              {!!togloomiinDun?.toololt
                ? formatNumber(
                    togloomiinDun?.toololt?.reduce((a, b) => a + b.niitDun, 0)
                  )
                : 0}
              ₮
              <EyeOutlined className="opacity-30 transition-opacity group-hover:opacity-100" />
            </div>
          </div>

          <div
            className="mb-5 flex w-full items-center justify-end md:mb-0 md:ml-auto"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <div className="grid w-full grid-cols-2 gap-2 sm:w-auto xl:flex">
              <Popover
                open={khaaltPopoverNeegdsen}
                onOpenChange={() => setKhaaltPopoverNeegdsen((e) => !e)}
                trigger="click"
                placement="bottom"
                content={
                  <div className="flex flex-col gap-2">
                    {khaalga.map((a, index) => {
                      return (
                        <div
                          onClick={() => {
                            khaaltNeey(a);
                            setKhaaltPopoverNeegdsen(false);
                          }}
                          className="cursor-pointer select-none rounded-lg bg-green-300 p-2 dark:bg-gray-600 dark:text-gray-200"
                        >
                          {t("Хаалт") + (index + 1)}
                        </div>
                      );
                    })}
                  </div>
                }
              >
                <Button type="primary">
                  <span>{t("Хаалт нээх")}</span>
                </Button>
              </Popover>
              <Button
                className="col-span-2 w-full sm:w-auto"
                type="primary"
                onClick={() => khuukhedBurtgekh()}
              >
                {t("Бүртгэл")} [ + ]
              </Button>
              <BaganiinSongolt
                ButtonStyle="w-full sm:w-auto"
                shineBagana={shineBagana}
                setShineBagana={setShineBagana}
                columns={[
                  {
                    title: t("Хүйс"),
                    align: "center",
                    dataIndex: "khuis",
                    width: "6rem",
                    showSorterTooltip: false,
                    render: (a) => <div>{a === 1 ? "Эрэгтэй" : "Эмэгтэй"}</div>,
                  },
                  {
                    title: t("Төрөл"),
                    align: "center",
                    dataIndex: "turul",
                    width: "7rem",
                    showSorterTooltip: false,
                  },
                  {
                    title: t("Хэлбэр"),
                    align: "center",
                    dataIndex: "khelber",
                    width: "7rem",
                    showSorterTooltip: false,
                    render: (v, data) => {
                      const jagsaalt =
                        data?.niitTulbur?.length > 0
                          ? data?.niitTulbur.filter(
                              (a) => a.turul !== "khunglukh"
                            )
                          : data?.tulbur.filter((a) => a.turul !== "khunglukh");
                      var utga = [];
                      if (jagsaalt.length > 0) {
                        for (let index = 0; index < jagsaalt.length; index++) {
                          const element = jagsaalt[index];
                          switch (element.turul) {
                            case "belen":
                              utga.push({
                                ner: "Бэлэн",
                                dun: element.dun,
                              });
                              break;
                            case "khariltsakh":
                              utga.push({
                                ner: "Харилцах",
                                dun: element.dun,
                              });
                              break;
                            default:
                              utga.push({
                                ner: element.turul,
                                dun: element.dun,
                              });
                              break;
                          }
                        }
                      }
                      return jagsaalt.length === 1 ? (
                        <div className="font-semibold capitalize">
                          {utga?.[0]?.ner}
                        </div>
                      ) : jagsaalt.length > 0 ? (
                        <Popover
                          placement="bottom"
                          trigger="hover"
                          content={() => (
                            <div className="flex w-32 flex-col space-y-2 divide-y">
                              {utga.map((a, i) => {
                                return (
                                  <div key={i} className="flex justify-between">
                                    <div className="font-medium">{a.ner}:</div>
                                    {formatNumber(a.dun)}₮
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        >
                          <a className=" flex items-center justify-center  hover:scale-150 dark:hover:bg-gray-700">
                            <DollarTwoTone style={{ fontSize: "18px" }} />
                          </a>
                        </Popover>
                      ) : (
                        <FieldTimeOutlined style={{ fontSize: "18px" }} />
                      );
                    },
                  },
                  {
                    title: t("Асран хамгаалагч"),
                    align: "center",
                    dataIndex: "asragchiinTurul",
                    width: "10rem",
                    showSorterTooltip: false,
                    render: (data) => {
                      return (
                        <Popover
                          content={
                            <div>
                              {data?.map((data, index) => (
                                <div key={index}>{data}</div>
                              ))}
                            </div>
                          }
                        >
                          <div className="flex w-full justify-center text-lg text-blue-500">
                            <EyeOutlined className="cursor-pointer" />
                          </div>
                        </Popover>
                      );
                    },
                  },
                ]}
              />
              <Popover
                content={() => (
                  <div className="flex w-32 flex-col">
                    <a
                      className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                      onClick={() => {
                        excelTatajAvya(
                          token,
                          "togloomiinTuv",
                          togloominTuviinGaralt.data?.niitMur,
                          [
                            {
                              columnWidth: "2rem",
                              title: "№",
                              align: "center",
                              render: (text, record, index) =>
                                (togloominTuviinGaralt?.data
                                  ?.khuudasniiDugaar || 0) *
                                  (togloominTuviinGaralt?.data
                                    ?.khuudasniiKhemjee || 0) -
                                (togloominTuviinGaralt?.data
                                  ?.khuudasniiKhemjee || 0) +
                                index +
                                1,
                              __style__: { h: "center", width: "3rem" },
                            },
                            {
                              title: t("Овог"),
                              dataIndex: "ovog",
                              ellipsis: true,
                            },
                            {
                              title: t("Нэр"),
                              dataIndex: "ner",
                              ellipsis: true,
                            },
                            {
                              title: t("Нэр"),
                              dataIndex: "ner",
                              ellipsis: true,
                              width: "5rem",
                            },
                            {
                              title: t("Нас"),
                              dataIndex: "nas",
                              ellipsis: true,
                              align: "center",
                              __style__: { h: "center" },
                            },
                            {
                              title: t("Хүүхдийн тоо"),
                              dataIndex: "khuukhdiinToo",
                              ellipsis: true,
                              align: "center",
                              __style__: { h: "center" },
                            },
                            {
                              title: t("Хүйс"),
                              dataIndex: "khuis",
                              ellipsis: true,
                              __style__: { h: "center" },
                              align: "center",
                              render: (a) => (
                                <div>{a === 1 ? "Эрэгтэй" : "Эмэгтэй"}</div>
                              ),
                            },
                            {
                              title: t("Утас"),
                              dataIndex: "utas",
                              ellipsis: true,
                              align: "center",
                              __style__: { h: "center" },
                            },
                            {
                              title: t("Хугацаа /мин/"),
                              dataIndex: "khugatsaa",
                              __style__: { h: "center" },
                              ellipsis: true,
                              align: "center",
                            },
                            {
                              title: t("Эхлэх цаг"),
                              dataIndex: "ekhlekhTsag",
                              __style__: { h: "center" },
                              ellipsis: true,
                              render: (data) => {
                                return moment(data).format("YYYY-MM-DD HH:mm");
                              },
                            },
                            {
                              title: t("Сунгасан/мин/"),
                              dataIndex: "sungsanMinut",
                              render: (data) => (!!data ? data : 0),
                              __style__: { h: "center" },
                            },
                            {
                              title: t("Дуусах цаг"),
                              dataIndex: "duusakhTsag",
                              __style__: { h: "center" },
                              ellipsis: true,

                              render: (data) => {
                                return moment(data).format("YYYY-MM-DD HH:mm");
                              },
                            },
                            {
                              title: t("нийт дүн"),
                              dataIndex: "niitDun",
                              ellipsis: true,
                              __style__: { h: "right" },
                              render: (data) => {
                                return formatNumber(data, 0);
                              },
                            },
                            {
                              title: t("Хөнгөлсөн дүн"),
                              dataIndex: "khungulsunDun",
                              __style__: { h: "right" },
                              ellipsis: true,
                              render: (data) => {
                                return formatNumber(data, 0);
                              },
                            },
                            {
                              title: t("Хэлбэр"),
                              align: "center",
                              dataIndex: "tulbur",
                              ellipsis: true,
                              render: (data) => {
                                const jagsaalt = data?.filter(
                                  (a) => a.turul !== "khunglukh"
                                );
                                var utga = "";
                                if (jagsaalt?.length > 0) {
                                  switch (jagsaalt[0].turul) {
                                    case "belen":
                                      utga = "Бэлэн";
                                      break;
                                    case "khariltsakh":
                                      utga = "Харилцах";
                                      break;
                                    default:
                                      utga = data?.[0].turul;
                                      break;
                                  }
                                }
                                return t(utga);
                              },
                            },
                            {
                              title: t("Асран хамгаалагч"),
                              dataIndex: "asragchiinTurul",
                              ellipsis: true,
                              render: (data) => {
                                return data?.map((data) => data)?.join(",");
                              },
                            },
                          ],
                          query,
                          order,
                          "Тоглоомын төв"
                        );
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
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="300"
          data-aos-anchor-placement="top-bottom"
        >
          <Table
            className="mt-8 hidden overflow-auto md:block"
            dataSource={togloominTuviinGaralt?.jagsaalt}
            scroll={{ y: "calc(100vh - 30rem)" }}
            size="small"
            bordered
            rowKey={(row) => row._id}
            columns={columns}
            onChange={onChangeTable}
            pagination={{
              current: togloominTuviinGaralt?.data?.khuudasniiDugaar,
              pageSize: togloominTuviinGaralt?.data?.khuudasniiKhemjee,
              total: togloominTuviinGaralt?.data?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                togloominTuviinGaralt.setKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />
          <CardList
            cardListTuluv={"utas"}
            keyValue="uilchluulegch"
            className="block overflow-auto md:hidden"
            jagsaalt={togloominTuviinGaralt?.jagsaalt}
            Component={TogloomTile}
          />
        </div>
      </Card>
    </Admin>
  );
}

export default togloom1;
