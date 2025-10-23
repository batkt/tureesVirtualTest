import React, { useRef, useEffect, useMemo, useState } from "react";
import locale from "antd/lib/date-picker/locale/mn_MN";

import {
  Button,
  Table,
  DatePicker,
  Space,
  Card,
  Checkbox,
  TreeSelect,
  message,
  notification,
  Input,
} from "antd";
import {
  PrinterOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { t } from "i18next";
import formatNumber from "tools/function/formatNumber";
import uilchilgee from "services/uilchilgee";
import { Excel } from "antd-table-saveas-excel";
import useAjiltniOdriinTailan from "hooks/useAjiltniOdriinTailan";
import createMethod from "tools/function/crud/createMethod";
const { RangePicker } = DatePicker;

function AjiltniiDelgerenguiTailan(
  {
    destroy,
    ajiltan,
    token,
    baiguullagiinId,
    barilgiinId,
    defualtOgnoo,
    selectedCamera,
    zogsooliinId,
  },
  ref
) {
  const [ajiltniiNevtersenTsag, setAjiltniiNevtersenTsag] = useState(null);
  const [ajiltniiGarsanTsag, setAjiltniiGarsanTsag] = useState(null);
  const [songogdsonCamera, setSongogdsonCamera] = useState(null);
  const [loading, setLoading] = useState(false);
  const [haaltDarsan, setHaaltDarsan] = useState(false);

  const [songogdson, setSongogdson] = useState([]);
  const [khaaltOgnoo, setKhaaltOgnoo] = useState(null);

  const garsanKhaalga = useMemo(() => {
    return songogdsonCamera;
  }, [songogdsonCamera]);

  const query = useMemo(() => {
    if (ajiltan?._id) {
      return { burtgesenAjiltaniiId: ajiltan._id };
    }
    return undefined;
  }, [ajiltan]);

  const { zogsoolTulburMedeelel, zogsoolTulburMedeelelMutate } =
    useAjiltniOdriinTailan(
      token,
      barilgiinId,
      ajiltniiGarsanTsag
        ? moment(ajiltniiGarsanTsag).format("YYYY-MM-DD HH:mm:ss")
        : moment().format("YYYY-MM-DD HH:mm:ss"),
      ajiltniiNevtersenTsag
        ? moment(ajiltniiNevtersenTsag).format("YYYY-MM-DD HH:mm:ss")
        : moment().format("YYYY-MM-DD HH:mm:ss"),
      garsanKhaalga,
      baiguullagiinId,
      query
    );

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
      khadgalya() {
        handlePrint();
      },
    }),
    []
  );

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    if (selectedCamera) {
      setSongogdsonCamera(selectedCamera);
    }
  }, [selectedCamera]);

  useEffect(() => {
    if (ajiltan?._id) {
      ajiltniiNevtersenTsagAvya();
    }
  }, [ajiltan]);

  const ajiltniiNevtersenTsagAvya = () => {
    if (!ajiltan?._id) return;

    uilchilgee(token)
      .post("/ekhniiNevtersenOgnooAvya", {
        ajiltniiId: ajiltan._id,
        barilgiinId: barilgiinId,
        garsanCameraIp: selectedCamera,
        zogsooliinId: zogsooliinId,
        baiguullagiinId: baiguullagiinId,
      })
      .then(({ data }) => {
        if (data?.data?.nevtersenOgnoo) {
          setAjiltniiNevtersenTsag(data.data.nevtersenOgnoo);
        }
        if (data?.data?.khaaltOgnoo) {
          setKhaaltOgnoo(data.data.khaaltOgnoo);
        } else {
          setKhaaltOgnoo(null);
        }
      })
      .catch((error) => {
        console.error("Ажилтны нэвтэрсэн цаг авахад алдаа:", error);
      });
  };

  const ajiltniiAjalAasBuukh = async () => {
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

      const transformedTulbur = tulburiinMedeelel.map((item) => ({
        ognoo: currentTime.format("YYYY-MM-DD 23:59:59"),
        turul: item.turul,
        dun: item.dun,
      }));

      const kassCameraKhaaltData = {
        ajiltaniiId: ajiltan._id,
        ajiltaniiNer: ajiltan.ner,
        barilgiinId: barilgiinId,
        baiguullagiinId: baiguullagiinId,
        zogsooliinId: zogsooliinId,
        garsanCameraIp: songogdsonCamera,
        nevtersenOgnoo: ajiltniiNevtersenTsag,
        khaaltOgnoo: currentTime.format("YYYY-MM-DD 23:59:59"),
        tulbur: transformedTulbur,
      };

      await createMethod("kassCameraKhaalt", token, kassCameraKhaaltData);

      await zogsoolTulburMedeelelMutate();

      setHaaltDarsan(true);
      notification.success({
        message: "Ажлаасаа буух мэдээлэл амжилттай хадгалагдлаа",
      });
    } catch (error) {
      console.error("Өдрийн хаалт хадгалахад алдаа:", error);
      notification.error({
        message: "Өдрийн хаалт хадгалахад алдаа гарлаа",
        description: error?.response?.data?.message || "Дахин оролдоно уу",
      });
    } finally {
      setLoading(false);
    }
  };

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
        switch (element?._id) {
          case "khariltsakh":
            ugugdul.push({
              ner: "Данс",
              turul: "khariltsakh",
              icon: "/mobile.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "belen":
            ugugdul.push({
              ner: "Бэлэн",
              turul: "belen",
              icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;

          case "khaan":
            ugugdul.push({
              ner: "Карт",
              turul: "khaan",
              icon: "/cartniiZurag.png",
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

          default:
            ugugdul.push({
              ner: element._id,
              turul: element.tailbar,
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
  }, [zogsoolTulburMedeelel]);

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
                {ajiltniiGarsanTsag
                  ? moment(ajiltniiGarsanTsag).format("YYYY-MM-DD HH:mm:ss")
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

      {/* Ажилтны нэвтэрсэн цаг */}
      <div className="mb-4">
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

      {/* Камер сонгох */}
      <div className="mb-4">
        <Input
          value={songogdsonCamera || "Камер сонгогдоогүй"}
          disabled
          prefix={<ClockCircleOutlined className="text-blue-500" />}
          className="w-full lg:w-64"
          placeholder="Камер сонгогдоогүй"
        />
      </div>

      <div className="mb-4">
        <Button
          type="primary"
          icon={<ClockCircleOutlined />}
          onClick={ajiltniiAjalAasBuukh}
          loading={loading}
          disabled={
            !!khaaltOgnoo || haaltDarsan || tulburiinMedeelel.length === 0
          }
        >
          Өдрийн хаалт
        </Button>
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
            <div className="flex ">Төлбөр авсан:</div>
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
            <div className="flex ">Төлбөр аваагүй:</div>
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
    </div>
  );
}

export default React.forwardRef(AjiltniiDelgerenguiTailan);
