import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  Button,
  Checkbox,
  Modal,
  message,
  notification,
  Input,
  TreeSelect,
} from "antd";
import {
  PrinterOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { t } from "i18next";
import formatNumber from "tools/function/formatNumber";
import uilchilgee from "services/uilchilgee";
import useAjiltniOdriinTailan from "hooks/useAjiltniOdriinTailan";
import createMethod from "tools/function/crud/createMethod";

const RESTRICTED_PAYMENT_TYPES = new Set([
  "khunglukh",
  "khungulult",
  "qpay",
  "qpayUridchilsan",
  "toki",
  "kiosk",
  "tseneglelt",
  "zeel",
  "Зөрчилтэй",
  "Үнэгүй",
]);

function AjiltniiDelgerenguiTailan(
  {
    destroy,
    ajiltan,
    token,
    baiguullagiinId,
    barilgiinId,
    selectedCamera,
    zogsooliinId,
    cameraData,
  },
  ref
) {
  const [ajiltniiNevtersenTsag, setAjiltniiNevtersenTsag] = useState(null);
  const [ajiltniiGarsanTsag, setAjiltniiGarsanTsag] = useState(null);
  const [songogdsonCamera, setSongogdsonCamera] = useState(null);
  const [loading, setLoading] = useState(false);
  const [haaltDarsan, setHaaltDarsan] = useState(false);

  const ajiltandBuhTolborHarahEsekh =
    ajiltan?.tokhirgoo?.ajiltandBuhTolborHaruulahEseh;
  const [songogdson, setSongogdson] = useState([]);
  const [khaaltOgnoo, setKhaaltOgnoo] = useState(null);
  const [tailanEkhlekhOgnoo, setTailanEkhlekhOgnoo] = useState(null);

  const ajiltniiId = ajiltan?._id;

  const defaultDuusakhOgnoo = useMemo(
    () => moment().format("YYYY-MM-DD 23:59:59"),
    []
  );

  const formattedNevtersenOgnoo = useMemo(() => {
    if (!ajiltniiNevtersenTsag) return null;
    return moment(ajiltniiNevtersenTsag).format("YYYY-MM-DD HH:mm:ss");
  }, [ajiltniiNevtersenTsag]);

  const formattedKhaaltOgnoo = useMemo(() => {
    if (!khaaltOgnoo) return null;
    return moment(khaaltOgnoo).format("YYYY-MM-DD HH:mm:ss");
  }, [khaaltOgnoo]);

  const cameraTreeData = useMemo(() => {
    if (!cameraData || !Array.isArray(cameraData?.[1])) return [];
    return cameraData[1];
  }, [cameraData]);

  const garsanKhaalga = useMemo(() => {
    return songogdsonCamera;
  }, [songogdsonCamera]);

  const query = useMemo(() => {
    if (ajiltniiId) {
      return { burtgesenAjiltaniiId: ajiltniiId };
    }
    return undefined;
  }, [ajiltniiId]);

  const {
    zogsoolTulburMedeelel,
    zogsoolTulburMedeelelMutate,
    zogsooliinUdriinTailanUnshijBaina,
  } = useAjiltniOdriinTailan(
    token,
    barilgiinId,
    formattedKhaaltOgnoo || defaultDuusakhOgnoo,
    tailanEkhlekhOgnoo,
    garsanKhaalga,
    baiguullagiinId,
    query
  );

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    if (!selectedCamera) {
      setSongogdsonCamera(null);
      setAjiltniiNevtersenTsag(null);
      setAjiltniiGarsanTsag(null);
      setKhaaltOgnoo(null);
      setHaaltDarsan(false);
      setTailanEkhlekhOgnoo(null);
      return;
    }
    setSongogdsonCamera(selectedCamera);
    setAjiltniiNevtersenTsag(null);
    setAjiltniiGarsanTsag(null);
    setKhaaltOgnoo(null);
    setHaaltDarsan(false);
    setTailanEkhlekhOgnoo(null);
  }, [selectedCamera]);

  const handleCameraSelect = useCallback((value) => {
    const newValue = value || null;
    setSongogdsonCamera(newValue);
    setAjiltniiNevtersenTsag(null);
    setAjiltniiGarsanTsag(null);
    setKhaaltOgnoo(null);
    setHaaltDarsan(false);
    setTailanEkhlekhOgnoo(null);
  }, []);

  const ajiltniiNevtersenTsagAvya = useCallback(async () => {
    if (!ajiltniiId || !songogdsonCamera || !zogsooliinId) return;

    const fallbackOgnoo = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      const { data } = await uilchilgee(token).post(
        "/ekhniiNevtersenOgnooAvya",
        {
          ajiltniiId,
          barilgiinId,
          garsanCameraIp: songogdsonCamera,
          zogsooliinId,
          baiguullagiinId,
        }
      );

      const nevtersenOgnoo = data?.data?.nevtersenOgnoo || null;
      const khaaltOgnooServer = data?.data?.khaaltOgnoo || null;

      setAjiltniiNevtersenTsag(nevtersenOgnoo);
      setKhaaltOgnoo(khaaltOgnooServer);
      setHaaltDarsan(!!khaaltOgnooServer);

      const nevtersenMoment = nevtersenOgnoo ? moment(nevtersenOgnoo) : null;
      const formattedNevtersenOgnoo =
        nevtersenMoment && nevtersenMoment.isValid()
          ? nevtersenMoment.format("YYYY-MM-DD HH:mm:ss")
          : null;

      setTailanEkhlekhOgnoo(formattedNevtersenOgnoo || fallbackOgnoo);
    } catch (error) {
      console.error("Ажилтны нэвтэрсэн цаг авахад алдаа:", error);
      setTailanEkhlekhOgnoo((prev) => prev || fallbackOgnoo);
    }
  }, [
    ajiltniiId,
    songogdsonCamera,
    zogsooliinId,
    token,
    barilgiinId,
    baiguullagiinId,
  ]);

  useEffect(() => {
    if (!ajiltniiId || !songogdsonCamera || !zogsooliinId) return;
    ajiltniiNevtersenTsagAvya();
  }, [ajiltniiId, songogdsonCamera, zogsooliinId, ajiltniiNevtersenTsagAvya]);

  const ajiltniiAjalAasBuukh = useCallback(async () => {
    if (!ajiltniiNevtersenTsag) {
      message.warning("Ажилтны нэвтэрсэн цаг олдсонгүй");
      return;
    }

    if (!songogdsonCamera) {
      message.warning("Камер сонгоно уу");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      setHaaltDarsan(true);
      const currentTime = moment();
      setAjiltniiGarsanTsag(currentTime);
      setKhaaltOgnoo(currentTime);

      let latestTulbur = zogsoolTulburMedeelel;

      if (!latestTulbur || !latestTulbur.length) {
        const refreshedTulbur = await zogsoolTulburMedeelelMutate();
        if (Array.isArray(refreshedTulbur)) {
          latestTulbur = refreshedTulbur;
        }
      }

      if (!latestTulbur || !latestTulbur.length) {
        message.warning("Өнөөдрийн орлогын мэдээлэл олдсонгүй");
        setHaaltDarsan(false);
        setKhaaltOgnoo(null);
        return;
      }

      const visibleTulbur = latestTulbur.filter((item) => {
        const turul = item?._id;
        if (!ajiltandBuhTolborHarahEsekh && RESTRICTED_PAYMENT_TYPES.has(turul))
          return false;
        return true;
      });

      const transformedTulbur = visibleTulbur.map((item) => ({
        ognoo: currentTime.format("YYYY-MM-DD 23:59:59"),
        turul: item?._id,
        dun: item?.niitDun || 0,
        too: item?.niitToo || 0,
      }));

      const kassCameraKhaaltData = {
        ajiltaniiId: ajiltan._id,
        ajiltaniiNer: ajiltan.ner,
        barilgiinId: barilgiinId,
        baiguullagiinId: baiguullagiinId,
        zogsooliinId: zogsooliinId,
        garsanCameraIp: songogdsonCamera,
        nevtersenOgnoo: ajiltniiNevtersenTsag,
        khaaltOgnoo: currentTime,
        tulbur: transformedTulbur,
      };

      await createMethod("kassCameraKhaalt", token, kassCameraKhaaltData);

      await zogsoolTulburMedeelelMutate();

      setHaaltDarsan(true);
      notification.success({
        message: "Ажлаасаа буух мэдээлэл амжилттай хадгалагдлаа",
      });
      destroy?.();
    } catch (error) {
      console.error("Өдрийн хаалт хадгалахад алдаа:", error);
      notification.error({
        message: "Өдрийн хаалт хадгалахад алдаа гарлаа",
        description: error?.response?.data?.message || "Дахин оролдоно уу",
      });
      setHaaltDarsan(false);
      setKhaaltOgnoo(null);
    } finally {
      setLoading(false);
    }
  }, [
    ajiltniiNevtersenTsag,
    songogdsonCamera,
    loading,
    ajiltan,
    barilgiinId,
    baiguullagiinId,
    zogsooliinId,
    token,
    zogsoolTulburMedeelel,
    zogsoolTulburMedeelelMutate,
    destroy,
    ajiltandBuhTolborHarahEsekh,
  ]);

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
      khadgalya() {
        handlePrint();
      },
      ajiltniiAjalAasBuukh,
    }),
    [destroy, handlePrint, ajiltniiAjalAasBuukh]
  );

  const handleDivClick = (a) => {
    setSongogdson((prev) => {
      if (prev.findIndex((e) => e === a.ner) === -1) {
        return [...prev, a.ner];
      } else {
        return prev.filter((item) => item !== a.ner);
      }
    });
  };

  const tulburiinMedeelel = useMemo(() => {
    var ugugdul = [];
    if (!!zogsoolTulburMedeelel) {
      var niitDun =
        zogsoolTulburMedeelel?.reduce((a, b) => a + b.niitDun, 0) || 0;

      zogsoolTulburMedeelel?.forEach((element) => {
        const tulburiinTurul = element?._id;
        if (
          !ajiltandBuhTolborHarahEsekh &&
          RESTRICTED_PAYMENT_TYPES.has(tulburiinTurul)
        ) {
          return;
        }
        switch (tulburiinTurul) {
          case "khariltsakh":
            ugugdul.push({
              ner: "Данс",
              turul: "khariltsakh",
              icon: "/transaction.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "belen":
            ugugdul.push({
              ner: "Бэлэн",
              turul: "belen",
              icon: "/Cash.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;

          case "khaan":
            ugugdul.push({
              ner: "Карт",
              turul: "khaan",
              icon: "/card.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "tdb":
            ugugdul.push({
              ner: "TDB банк",
              icon: "/tdb.png",
              turul: "tdb",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "khas":
            ugugdul.push({
              ner: "Xac банк",
              turul: "khas",
              icon: "https://cdn6.aptoide.com/imgs/0/6/d/06df97a06fbc7622a775a7c414b69e87_icon.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "golomt":
            ugugdul.push({
              ner: "Голомт банк",
              turul: "golomt",
              icon: "https://play-lh.googleusercontent.com/9tUBesUsI4UIkpgO1MPIMLFvhDa_4vZE75TrVAUHFA7a0bJ7IIgeyh2r1QXs9VlmXmkX",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "kapitron":
            ugugdul.push({
              ner: "Капитрон банк",
              turul: "kapitron",
              icon: "https://play-lh.googleusercontent.com/1PMmu0x2x_07XdPtLyTRe_4cffXDLFCG3xEoUTqUpy3eSJeB-C81dbyzZSnJjW907OA=w240-h480-rw",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "tur":
            ugugdul.push({
              ner: "Төрийн банк",
              turul: "tur",
              icon: "https://play-lh.googleusercontent.com/KYQyVTgP4ZV60gxNOsKYssScNe17NMgHpO_nRY4WRBYj_4YTZ0e8t6zwh38sTFmyCco",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;

          case "PosBelen":
            ugugdul.push({
              ner: "ПОС бэлэн",
              icon: "https://static.vecteezy.com/system/resources/previews/012/487/823/original/3d-hand-press-pay-button-icon-phone-with-credit-card-float-on-transparent-mobile-banking-online-payment-service-withdraw-money-easy-shop-cashless-society-concept-cartoon-minimal-3d-render-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "PosCard":
            ugugdul.push({
              ner: "ПОС карт",
              turul: "PosCard",
              icon: "https://static.vecteezy.com/system/resources/previews/012/487/823/original/3d-hand-press-pay-button-icon-phone-with-credit-card-float-on-transparent-mobile-banking-online-payment-service-withdraw-money-easy-shop-cashless-society-concept-cartoon-minimal-3d-render-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "PosKhariltsakh":
            ugugdul.push({
              ner: "ПОС дансаар",
              turul: "PosKhariltsakh",
              icon: "https://static.vecteezy.com/system/resources/previews/012/487/823/original/3d-hand-press-pay-button-icon-phone-with-credit-card-float-on-transparent-mobile-banking-online-payment-service-withdraw-money-easy-shop-cashless-society-concept-cartoon-minimal-3d-render-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "khunglukh":
            ugugdul.push({
              ner: "Хөнгөлөх",
              icon: "https://static.vecteezy.com/system/resources/previews/012/487/845/original/3d-wallet-floating-in-hand-isolated-on-transparent-business-man-holding-purple-purse-icon-mobile-banking-online-service-cashback-refund-loan-concept-saving-money-wealth-cartoon-3d-render-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "khungulult":
            ugugdul.push({
              ner: "Хөнгөлөлт",
              icon: "/hongololt.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "qpay":
            ugugdul.push({
              ner: element._id,
              icon: "https://qpay.mn/q/img/q.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "qpayUridchilsan":
            ugugdul.push({
              ner: "QPay QR",
              icon: "https://qpay.mn/q/img/q.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "toki":
            ugugdul.push({
              ner: "Токи",
              icon: "/Group_158.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "kiosk":
            ugugdul.push({
              ner: "Киоск",
              icon: "/kiosk.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;

          case "tseneglelt":
            ugugdul.push({
              ner: "Цэнэглэлт",
              icon: "https://static.vecteezy.com/system/resources/previews/012/487/845/original/3d-wallet-floating-in-hand-isolated-on-transparent-business-man-holding-purple-purse-icon-mobile-banking-online-service-cashback-refund-loan-concept-saving-money-wealth-cartoon-3d-render-png.png",
              // icon: "/eWalletIcon.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "zeel":
            ugugdul.push({
              ner: "Зээл",
              icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "Зөрчилтэй":
            ugugdul.push({
              ner: "Зөрчил",
              icon: "/exclamation.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "Үнэгүй":
            ugugdul.push({
              ner: "Үнэгүй",
              icon: "/Unegui.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;

          default:
            ugugdul.push({
              ner: tulburiinTurul,
              icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
        }
      });
    }
    return ugugdul;
  }, [zogsoolTulburMedeelel, ajiltandBuhTolborHarahEsekh]);

  const isDayCloseDisabled = useMemo(() => {
    if (loading) return true;
    if (!!khaaltOgnoo) return true;
    if (haaltDarsan) return true;
    if (zogsooliinUdriinTailanUnshijBaina) return true;
    return !zogsoolTulburMedeelel || zogsoolTulburMedeelel.length === 0;
  }, [
    loading,
    khaaltOgnoo,
    haaltDarsan,
    zogsooliinUdriinTailanUnshijBaina,
    zogsoolTulburMedeelel,
  ]);

  const handleDayCloseClick = useCallback(() => {
    Modal.confirm({
      title: t("Өдрийн хаалт"),
      content: t(
        "Та өнөөдрийн ажлаа дуусгахдаа итгэлтэй байна уу? Өдрийн хаалт хийхдээ машин гаргах боломжгүй дараагын ажилтан заавал нэвтэрсэн байх шаардлагатай."
      ),
      okText: t("Тийм"),
      cancelText: t("Үгүй"),
      onOk: ajiltniiAjalAasBuukh,
    });
  }, [ajiltniiAjalAasBuukh]);

  const columns = [
    {
      title: "№",
      align: "center",
      width: "3rem",
      render: (_, __, index) => index + 1,
    },
    {
      title: t("Дугаар1"),
      align: "center",
      dataIndex: "mashiniiDugaar",
      render: (text) => String(text).toUpperCase(),
    },
    {
      title: t("Орсон"),
      align: "center",
      dataIndex: "tuukh",
      render: (tuukh) => {
        const orsonTsag = tuukh[0]?.tsagiinTuukh[0]?.orsonTsag;
        return orsonTsag ? moment(orsonTsag).format("MM-DD HH:mm") : "";
      },
    },
    {
      title: t("Гарсан"),
      align: "center",
      dataIndex: "tuukh",
      render: (tuukh) => {
        const garsanTsag = tuukh[0]?.tsagiinTuukh[0]?.garsanTsag;
        return garsanTsag ? moment(garsanTsag).format("MM-DD HH:mm") : "";
      },
    },
    {
      title: t("Хугацаа/мин"),
      align: "center",
      dataIndex: "niitKhugatsaa",
      render: (text) => text || 0,
    },
    {
      title: t("Дүн"),
      align: "right",
      dataIndex: "niitDun",
      render: (text) => formatNumber(text || 0, 0),
    },
    {
      title: t("Төлөв"),
      align: "center",
      dataIndex: "tuukh",
      render: (tuukh) => {
        const tuluv = tuukh[0]?.tuluv;
        if (tuluv === 0) return t("Төлөөгүй");
        if (tuluv === 1) return t("Төлөгдсөн");
        if (tuluv === -1) return t("Үнэгүй");
        if (tuluv === -2) return t("Зөрчилтэй");
        return "";
      },
    },
  ];

  return (
    <div>
      <div className="hidden">
        <div className="p-6" ref={printRef}>
          <div className="flex items-center justify-start gap-6">
            <div className="flex gap-6">
              <div>
                Эхлэх огноо:{" "}
                {ajiltniiNevtersenTsag
                  ? moment(ajiltniiNevtersenTsag).format("YYYY-MM-DD HH:mm:ss")
                  : "Ачааллаж байна..."}
              </div>
              <div>
                Дуусах огноо:{" "}
                {khaaltOgnoo
                  ? moment(khaaltOgnoo).format("YYYY-MM-DD HH:mm:ss")
                  : moment().format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start gap-2">
            Ажилтан: {ajiltan?.ovog?.[0]}.{ajiltan?.ner} ({ajiltan?.register})
          </div>

          {tulburiinMedeelel.map((a, i) => {
            return songogdson.length === 0 ? (
              <div className="my-1" key={i}>{`${i + 1}. ${a.ner} (${
                a.too
              }) : ${formatNumber(a.dun)} ₮`}</div>
            ) : (
              songogdson.some((item) => item === a.ner) && (
                <div className="my-1" key={i}>{`${i + 1}. ${a.ner} (${
                  a.too
                }) : ${formatNumber(a.dun)} ₮`}</div>
              )
            );
          })}
          <div className="flex items-center justify-start gap-2">
            <div>
              Нийт дүн
              {`(${tulburiinMedeelel?.reduce((a, b) => a + b?.too, 0) || 0})`}:
            </div>
            <div>
              {formatNumber(
                tulburiinMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0
              )}
              ₮
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ажилтны нэвтэрсэн цаг
          </label>
          <Input
            value={
              ajiltniiNevtersenTsag
                ? moment(ajiltniiNevtersenTsag).format("YYYY-MM-DD HH:mm:ss")
                : "Ачааллаж байна..."
            }
            disabled
            prefix={<ClockCircleOutlined className="text-blue-500" />}
            className="w-full"
            placeholder="Ажилтны нэвтэрсэн цаг ачааллаж байна..."
          />
        </div>

        <div className="min-w-0 flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Бүртгэл хийсэн камер
          </label>
          <TreeSelect
            showSearch
            value={songogdsonCamera}
            placeholder={t("Камер сонгох")}
            allowClear
            treeDefaultExpandAll
            onChange={handleCameraSelect}
            treeData={cameraTreeData}
            className="w-full"
            dropdownStyle={{
              maxHeight: 600,
              minWidth: 280,
              overflow: "auto",
            }}
            suffixIcon={<VideoCameraOutlined className="text-blue-500" />}
            disabled={!cameraTreeData.length}
          />
        </div>
      </div>

      {tulburiinMedeelel.length > 0 ? (
        <div className="mt-5 w-full space-y-3">
          {tulburiinMedeelel
            .sort(function (a, b) {
              return b.khuvi - a.khuvi;
            })
            .map((a, i) => {
              return (
                <div
                  className="relative flex h-14 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 p-2"
                  key={i}
                  onClick={() => handleDivClick(a)}
                >
                  <Checkbox
                    checked={songogdson.some((item) => item === a.ner)}
                  />
                  <div
                    style={{ width: `${String(Math.round(a.khuvi))}%` }}
                    className={`absolute left-0 top-0 z-0 flex h-full items-center bg-green-100 dark:bg-green-500 `}
                  >
                    <div className="absolute -right-1 h-20 w-16 animate-spin-slow rounded-3xl bg-green-100 dark:bg-green-500 " />
                  </div>
                  <img
                    src={a.icon}
                    className="z-10 mx-2 h-11 w-12 overflow-hidden rounded-md"
                  />
                  <div className="z-10 flex w-full justify-between text-lg font-semibold dark:text-gray-200">
                    {a.ner}:
                    <div className="flex font-normal">
                      {formatNumber(a.dun) || 0}₮
                      <div className="ml-3 mr-3 flex w-10 items-center justify-center border-x border-green-600  text-center">
                        <div className="ml-5 mr-5">{a.too}</div>
                      </div>
                      <div className="ml-5 flex w-10 items-center justify-center border-green-600 pr-5 text-center">
                        <div className="ml-10 ">
                          {a.khuvi - Math.floor(a.khuvi) > 0
                            ? Number(a.khuvi).toFixed(2)
                            : a.khuvi || 0}
                        </div>
                        <div className="mr-10">%</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          <div className="border border-dashed bg-gray-600" />
          <div className="flex items-center justify-between text-lg font-[600] dark:text-gray-200">
            <div className="flex ">Бодогдсон дүн:</div>
            <div>
              {formatNumber(
                tulburiinMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0
              ) + "₮"}
            </div>
          </div>
          <div className="flex items-center justify-between text-lg font-[600] dark:text-gray-200">
            <div className="flex ">Бүртгэсэн дүн:</div>
            <div>
              {formatNumber(
                tulburiinMedeelel?.reduce(
                  (a, b) =>
                    a + (b.ner != "Үнэгүй" && b.ner != "Зөрчил" ? b?.dun : 0),
                  0
                ) || 0
              ) + "₮"}
            </div>
          </div>
          <div className="flex items-center justify-between text-lg font-[600] dark:text-gray-200">
            <div className="flex ">Бүртгээгүй дүн:</div>
            <div>
              {formatNumber(
                tulburiinMedeelel?.reduce(
                  (a, b) =>
                    a + (b.ner == "Үнэгүй" || b.ner == "Зөрчил" ? b?.dun : 0),
                  0
                ) || 0
              ) + "₮"}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-52 w-full items-center justify-center">
          <div className="text-lg font-semibold text-black text-opacity-30 dark:text-gray-400">
            Орлогын мэдээлэл байхгүй байна.
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="danger" onClick={() => destroy?.()}>
          {t("Хаах")}
        </Button>
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            {t("Хэвлэх")}
          </Button>
          <Button
            type="primary"
            icon={<ClockCircleOutlined />}
            onClick={handleDayCloseClick}
            disabled={isDayCloseDisabled}
          >
            {t("Өдрийн хаалт")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(AjiltniiDelgerenguiTailan);
