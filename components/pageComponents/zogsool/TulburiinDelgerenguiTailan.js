import { Checkbox, DatePicker, Select, TreeSelect } from "antd";
import locale from "antd/lib/date-picker/locale/mn_MN";
import usezogsooliinUdriinTailan from "hooks/usezogsooliinUdriinTailan";
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useReactToPrint } from "react-to-print";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { t } from "i18next";
import { CloseCircleOutlined } from "@ant-design/icons";
import { FaCar } from "react-icons/fa";

const order = { createdAt: -1 };

function TulburiinDelgerenguiTailan(
  {
    barilgiinId,
    baiguullagiinId,
    token,
    destroy,
    defualtOgnoo,
    ajiltan,
    cameraData,
  },
  ref,
) {
  const [songogdsonAjiltan, setSongogdsonAjiltan] = useState(null);
  const [camerVal, setCamerVal] = useState([null, null]);
  const [songogdson, setSongogdson] = useState([]);
  const [ognoo, setOgnoo] = useState([
    moment(defualtOgnoo[0]),
    moment(defualtOgnoo[1]),
  ]);

  const cameraChange = (e) => {
    setCamerVal([camerVal[0], e]);
  };
  const zogsooAjiltanQuery = useMemo(() => {
    const paths = new Set([
      "/khyanalt/zogsool",
      "/khyanalt/zogsool/camera",
      "/khyanalt/kiosk",
    ]);

    if (typeof window !== "undefined" && window.location?.pathname) {
      paths.add(window.location.pathname);
    }

    return {
      tsonkhniiErkhuud: { $in: Array.from(paths) },
    };
  }, [baiguullagiinId, barilgiinId]);

  const query = useMemo(() => {
    if (songogdsonAjiltan) {
      return { burtgesenAjiltaniiId: songogdsonAjiltan };
    }
    return undefined;
  }, [songogdsonAjiltan]);

  const garsanKhaalga = useMemo(() => {
    return camerVal[1];
  }, [camerVal[1]]);

  const { zogsoolTulburMedeelel, zogsoolTulburMedeelelMutate } =
    usezogsooliinUdriinTailan(
      token,
      barilgiinId,
      ognoo[1],
      ognoo[0],
      garsanKhaalga,
      baiguullagiinId,
      query,
    );
  const { ajilchdiinGaralt, setAjiltniiKhuudaslalt } = useAjiltniiJagsaalt(
    token,
    baiguullagiinId,
    barilgiinId,
    zogsooAjiltanQuery,
  );

  const printRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const handleDivClick = (a) => {
    setSongogdson((prev) => {
      if (prev.findIndex((e) => e === a.ner) === -1) {
        return [...prev, a.ner];
      } else {
        return prev.filter((item) => item !== a.ner);
      }
    });
  };

  const {
    tulburiinMedeelel,
    hongololtMedeelel,
    zorchilMedeelel,
    tulburteiMedeelel,
  } = useMemo(() => {
    var tulbur = [];
    var hongololt = [];
    var zorchil = [];
    var tulburtei = [];

    const hongololtNames = ["Хөнгөлөлт", "Фитнес", "Хөнгөлөх"];
    const zorchilNames = ["Үнэгүй", "Зөрчилтэй", "Зөрчил"];

    if (!!zogsoolTulburMedeelel) {
      const mergedTulbur = Array.from(
        zogsoolTulburMedeelel
          .reduce((acc, item) => {
            const key = item?._id === "PosCard" ? "PosKart" : item?._id;
            const merged = acc.get(key) || {
              ...item,
              _id: key,
              niitDun: 0,
              niitToo: 0,
            };

            merged.niitDun += item?.niitDun || 0;
            merged.niitToo += item?.niitToo || 0;

            acc.set(key, merged);
            return acc;
          }, new Map())
          .values(),
      );

      var niitDun = mergedTulbur?.reduce((a, b) => a + b.niitDun, 0) || 0;

      mergedTulbur?.forEach((element) => {
        const elementId = element?._id?.toLowerCase() || "";
        let item = null;
        let category = "tulbur"; // default category

        if (elementId.startsWith("ugaalga")) {
          const is24h =
            elementId.includes("24") || element?._id?.includes("24");
          const IconComponent = FaCar;
          item = {
            ner: is24h ? "Угаалга-24" : "Угаалга-1",
            icon: is24h ? "REACT_ICON_24H" : "REACT_ICON_1H",
            iconComponent: IconComponent,
            dun: element.niitDun,
            too: element.niitToo,
            khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
          };
          hongololt.push(item);
          return;
        }

        switch (element?._id) {
          case "khariltsakh":
            item = {
              ner: "Данс",
              icon: "/transaction.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "belen":
            item = {
              ner: "Бэлэн",
              icon: "/Cash.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "khunglukh":
            item = {
              ner: "Хөнгөлөх",
              icon: "https://static.vecteezy.com/system/resources/previews/012/487/845/original/3d-wallet-floating-in-hand-isolated-on-transparent-business-man-holding-purple-purse-icon-mobile-banking-online-service-cashback-refund-loan-concept-saving-money-wealth-cartoon-3d-render-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            category = "hongololt";
            break;
          case "khungulult":
            item = {
              ner: "Хөнгөлөлт",
              icon: "/hongololt.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            category = "hongololt";
            break;
          case "khaan":
            item = {
              ner: "Карт",
              icon: "/card.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "tdb":
            item = {
              ner: "TDB банк",
              icon: "/tdb.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "khas":
            item = {
              ner: "Xac банк",
              icon: "https://cdn6.aptoide.com/imgs/0/6/d/06df97a06fbc7622a775a7c414b69e87_icon.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "golomt":
            item = {
              ner: "Голомт банк",
              icon: "https://play-lh.googleusercontent.com/9tUBesUsI4UIkpgO1MPIMLFvhDa_4vZE75TrVAUHFA7a0bJ7IIgeyh2r1QXs9VlmXmkX",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "kapitron":
            item = {
              ner: "Капитрон банк",
              icon: "https://play-lh.googleusercontent.com/1PMmu0x2x_07XdPtLyTRe_4cffXDLFCG3xEoUTqUpy3eSJeB-C81dbyzZSnJjW907OA=w240-h480-rw",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "tur":
            item = {
              ner: "Төрийн банк",
              icon: "https://play-lh.googleusercontent.com/KYQyVTgP4ZV60gxNOsKYssScNe17NMgHpO_nRY4WRBYj_4YTZ0e8t6zwh38sTFmyCco",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "bankQR":
            item = {
              ner: "Банк QR",
              icon: "/Bank.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "DotorQR":
            item = {
              ner: "Дотор QR",
              icon: "/QR.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "GadaaQR":
            item = {
              ner: "Гадаа QR",
              icon: "/GadaaQR.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "toki":
            item = {
              ner: "Токи",
              icon: "/Group_158.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "kiosk":
            item = {
              ner: "Киоск",
              icon: "/kiosk.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "PosBelen":
            item = {
              ner: "ПОС Бэлэн",
              icon: "/androidPosBelen.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "PosKart":
            item = {
              ner: "ПОС Карт",
              icon: "/androidpooos.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "PosKhariltsakh":
            item = {
              ner: "ПОС Данс",
              icon: "/androidDansPos.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "zeel":
            item = {
              ner: "Зээл",
              icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "pass":
            item = {
              ner: "Пасс",
              icon: "/pass.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "Зөрчилтэй":
            item = {
              ner: "Зөрчилтэй",
              icon: "/exclamation.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            category = "zorchil";
            break;
          case "Төлбөртэй":
            item = {
              ner: "Төлбөртэй",
              icon: "/tulburtei.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            category = "tulburtei";
            break;
          case "Үнэгүй":
            item = {
              ner: "Үнэгүй",
              icon: "/Unegui.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "Fitness":
            item = {
              ner: "Фитнес",
              icon: "/hongololt.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            category = "hongololt";
            break;
          case "qpayUridchilsan":
          case "Түрээслэгч":
          case "Гэрээт":
          case "qpay":
            item = {
              ner: "QPay",
              icon: "/qpay.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
          case "Ugaalga":
            const is24hUgaalga =
              element?._id?.includes("24") ||
              element?._id?.toLowerCase()?.includes("24");
            const UgaalgaIconComponent = FaCar;
            item = {
              ner: is24hUgaalga ? "CarWash 24h" : "CarWash 1h",
              icon: is24hUgaalga ? "REACT_ICON_24H" : "REACT_ICON_1H",
              iconComponent: UgaalgaIconComponent,
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            category = "hongololt";
            break;
          default:
            item = {
              ner: element._id,
              icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            };
            break;
        }

        if (item) {
          if (category === "hongololt") {
            hongololt.push(item);
          } else if (category === "zorchil") {
            zorchil.push(item);
          } else if (category === "tulburtei") {
            tulburtei.push(item);
          } else {
            tulbur.push(item);
          }
        }
      });
    }
    return {
      tulburiinMedeelel: tulbur,
      hongololtMedeelel: hongololt,
      zorchilMedeelel: zorchil,
      tulburteiMedeelel: tulburtei,
    };
  }, [zogsoolTulburMedeelel]);

  // Combined list for print and checkbox selection
  const buhMedeelel = useMemo(() => {
    return [
      ...tulburiinMedeelel,
      ...hongololtMedeelel,
      ...zorchilMedeelel,
      ...tulburteiMedeelel,
    ];
  }, [
    tulburiinMedeelel,
    hongololtMedeelel,
    zorchilMedeelel,
    tulburteiMedeelel,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        handlePrint();
      },
      khaaya() {
        destroy();
      },
    }),
    [],
  );

  function garya() {
    destroy();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <div>
      <div className="hidden">
        <div className="p-6" ref={printRef}>
          <div className="flex items-center justify-start gap-6">
            <div className="flex gap-6">
              <div>Огноо: {moment(ognoo[0]).format("YYYY-MM-DD")}</div>
              <div>{moment(ognoo[1]).format("YYYY-MM-DD")}</div>
            </div>
          </div>
          <div className="flex items-center justify-start gap-2">
            Ажилтан:{" "}
            {songogdsonAjiltan === null || songogdsonAjiltan === undefined
              ? "Бүх ажилтан"
              : ajilchdiinGaralt?.jagsaalt
                  ?.filter((a) => a._id === songogdsonAjiltan)
                  .map((b) => b.ovog[0] + "." + b.ner + "     " + b.register)}
          </div>

          {buhMedeelel.map((a, i) => {
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
              {`(${buhMedeelel?.reduce((a, b) => a + b?.too, 0) || 0})`}:
            </div>
            <div>
              {formatNumber(buhMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0)}₮
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <DatePicker.RangePicker
          value={ognoo}
          onChange={setOgnoo}
          allowClear={false}
          locale={locale}
          style={
            cameraData[1].length > 1 ? { width: "100%" } : { width: "49%" }
          }
        />
        {cameraData[1].length > 1 && (
          <TreeSelect
            showSearch
            style={{
              backgroundColor: "#10B981",
              borderColor: "#10B981",
              width: "49%",
            }}
            value={camerVal[1]}
            dropdownStyle={{
              maxHeight: 600,
              minWidth: 280,
              overflow: "auto",
            }}
            className="custom-dropdown-bg"
            placeholder={t("Камер сонгох")}
            allowClear
            treeDefaultExpandAll
            onChange={(e) => cameraChange(e)}
            treeData={cameraData[1]}
          />
        )}
        <Select
          id="ajiltanSongokhInput"
          placeholder={t("Ажилтан")}
          allowClear
          showSearch
          clearIcon={() => (
            <div className="dark:bg-gray-800 dark:text-gray-200 hover:dark:text-gray-400">
              <CloseCircleOutlined />
            </div>
          )}
          style={{ width: "49%" }}
          filterOption={(o) => o}
          onChange={(e) => setSongogdsonAjiltan(e)}
          onSearch={(search) =>
            setAjiltniiKhuudaslalt((a) => ({
              ...a,
              search,
              khuudasniiDugaar: 1,
            }))
          }
        >
          {ajilchdiinGaralt?.jagsaalt?.map((mur) => (
            <Select.Option key={`${mur._id}ajiltan`} value={mur._id}>
              <div className="flex flex-row justify-between">
                <span className="truncate">
                  {mur.ovog && mur.ovog[0]}.{mur.ner}
                </span>
                <span>{mur.register}</span>
              </div>
            </Select.Option>
          ))}
        </Select>
      </div>
      {buhMedeelel.length > 0 ? (
        <div className="mt-5 w-full space-y-3">
          {/* Section 1: Payment Methods */}
          {tulburiinMedeelel.length > 0 && (
            <>
              <div className="border-b-2 border-green-500 pb-1 text-lg font-bold dark:text-gray-200">
                Төлбөрийн хэлбэр
              </div>
              {tulburiinMedeelel
                .sort(function (a, b) {
                  if (a.ner === "Үнэгүй") return 1;
                  if (b.ner === "Үнэгүй") return -1;
                  return b.khuvi - a.khuvi;
                })
                .map((a, i) => {
                  return (
                    <div
                      className="relative flex h-14 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 p-2"
                      key={`tulbur-${i}`}
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
                      {a.iconComponent ? (
                        <div className="z-10 mx-2 flex h-11 w-12 items-center justify-center overflow-hidden rounded-md">
                          {React.createElement(a.iconComponent, {
                            className: "h-8 w-8 text-blue-600",
                          })}
                        </div>
                      ) : (
                        <img
                          src={a.icon}
                          className="z-10 mx-2 h-11 w-12 overflow-hidden rounded-md"
                          alt={a.ner}
                        />
                      )}
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
            </>
          )}

          {/* Хямдрал шүү дараа нь засах хүнээ */}
          {hongololtMedeelel.length > 0 && (
            <>
              <div className="mt-4 border-b-2 border-yellow-500 pb-1 text-lg font-bold dark:text-gray-200">
                Хөнгөлөлт
              </div>
              {hongololtMedeelel
                .sort(function (a, b) {
                  return b.khuvi - a.khuvi;
                })
                .map((a, i) => {
                  return (
                    <div
                      className="relative flex h-14 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 p-2"
                      key={`hongololt-${i}`}
                      onClick={() => handleDivClick(a)}
                    >
                      <Checkbox
                        checked={songogdson.some((item) => item === a.ner)}
                      />
                      <div
                        style={{ width: `${String(Math.round(a.khuvi))}%` }}
                        className={`absolute left-0 top-0 z-0 flex h-full items-center bg-yellow-100 dark:bg-yellow-500 `}
                      >
                        <div className="absolute -right-1 h-20 w-16 animate-spin-slow rounded-3xl bg-yellow-100 dark:bg-yellow-500 " />
                      </div>
                      {a.iconComponent ? (
                        <div className="z-10 mx-2 flex h-11 w-12 items-center justify-center overflow-hidden rounded-md">
                          {React.createElement(a.iconComponent, {
                            className: "h-8 w-8 text-blue-600",
                          })}
                        </div>
                      ) : (
                        <img
                          src={a.icon}
                          className="z-10 mx-2 h-11 w-12 overflow-hidden rounded-md"
                          alt={a.ner}
                        />
                      )}
                      <div className="z-10 flex w-full justify-between text-lg font-semibold dark:text-gray-200">
                        {a.ner}:
                        <div className="flex font-normal">
                          {formatNumber(a.dun) || 0}₮
                          <div className="ml-3 mr-3 flex w-10 items-center justify-center border-x border-yellow-600  text-center">
                            <div className="ml-5 mr-5">{a.too}</div>
                          </div>
                          <div className="ml-5 flex w-10 items-center justify-center border-yellow-600 pr-5 text-center">
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
            </>
          )}

          {/* Зөрчил шүү дараа нь засах хүнээ */}
          {zorchilMedeelel.length > 0 && (
            <>
              <div className="mt-4 border-b-2 border-red-500 pb-1 text-lg font-bold dark:text-gray-200">
                Зөрчил
              </div>
              {zorchilMedeelel
                .sort(function (a, b) {
                  return b.khuvi - a.khuvi;
                })
                .map((a, i) => {
                  return (
                    <div
                      className="relative flex h-14 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 p-2"
                      key={`zorchil-${i}`}
                      onClick={() => handleDivClick(a)}
                    >
                      <Checkbox
                        checked={songogdson.some((item) => item === a.ner)}
                      />
                      <div
                        style={{ width: `${String(Math.round(a.khuvi))}%` }}
                        className={`absolute left-0 top-0 z-0 flex h-full items-center bg-red-100 dark:bg-red-500 `}
                      >
                        <div className="absolute -right-1 h-20 w-16 animate-spin-slow rounded-3xl bg-red-100 dark:bg-red-500 " />
                      </div>
                      {a.iconComponent ? (
                        <div className="z-10 mx-2 flex h-11 w-12 items-center justify-center overflow-hidden rounded-md">
                          {React.createElement(a.iconComponent, {
                            className: "h-8 w-8 text-blue-600",
                          })}
                        </div>
                      ) : (
                        <img
                          src={a.icon}
                          className="z-10 mx-2 h-11 w-12 overflow-hidden rounded-md"
                          alt={a.ner}
                        />
                      )}
                      <div className="z-10 flex w-full justify-between text-lg font-semibold dark:text-gray-200">
                        {a.ner}:
                        <div className="flex font-normal">
                          {formatNumber(a.dun) || 0}₮
                          <div className="ml-3 mr-3 flex w-10 items-center justify-center border-x border-red-600  text-center">
                            <div className="ml-5 mr-5">{a.too}</div>
                          </div>
                          <div className="ml-5 flex w-10 items-center justify-center border-red-600 pr-5 text-center">
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
            </>
          )}

          {tulburteiMedeelel.length > 0 && (
            <>
              <div className="mt-4 border-b-2 border-purple-500 pb-1 text-lg font-bold dark:text-gray-200">
                Төлбөртэй
              </div>
              {tulburteiMedeelel
                .sort(function (a, b) {
                  return b.khuvi - a.khuvi;
                })
                .map((a, i) => {
                  return (
                    <div
                      className="relative flex h-14 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 p-2"
                      key={`tulburtei-${i}`}
                      onClick={() => handleDivClick(a)}
                    >
                      <Checkbox
                        checked={songogdson.some((item) => item === a.ner)}
                      />
                      <div
                        style={{ width: `${String(Math.round(a.khuvi))}%` }}
                        className={`absolute left-0 top-0 z-0 flex h-full items-center bg-purple-100 dark:bg-purple-500 `}
                      >
                        <div className="absolute -right-1 h-20 w-16 animate-spin-slow rounded-3xl bg-purple-100 dark:bg-purple-500 " />
                      </div>
                      <img
                        src={a.icon}
                        className="z-10 mx-2 h-11 rounded-md object-contain"
                        alt=""
                      />
                      <div className="z-10 flex w-full justify-between text-lg font-semibold dark:text-gray-200">
                        {a.ner}:
                        <div className="flex font-normal">
                          {formatNumber(a.dun) || 0}₮
                          <div className="ml-3 mr-3 flex w-10 items-center justify-center border-x border-purple-600 text-center">
                            <div className="ml-5 mr-5">{a.too}</div>
                          </div>
                          <div className="ml-5 flex w-10 items-center justify-center border-purple-600 pr-5 text-center">
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
            </>
          )}

          {/* Нийт */}
          <div className="mt-4 border border-dashed bg-gray-600" />
          <div className="mt-2 flex items-center justify-between text-lg font-[600] dark:text-gray-200">
            <div className="flex ">Бодогдсон дүн:</div>
            <div>
              {formatNumber(buhMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0) +
                "₮"}
            </div>
          </div>
          <div className="">
            {tulburiinMedeelel.length > 0 && (
              <div className="flex items-center justify-between rounded bg-transparent p-2 text-lg font-[600]  dark:text-gray-200">
                <div className="flex">Төлбөр авсан:</div>
                <div>
                  {formatNumber(
                    tulburiinMedeelel
                      ?.filter((a) => a?.ner !== "Үнэгүй")
                      ?.reduce((a, b) => a + b?.dun, 0) || 0,
                  ) + "₮"}
                </div>
              </div>
            )}
            {(zorchilMedeelel.length > 0 || tulburteiMedeelel.length > 0) && (
              <div className="flex items-center justify-between rounded bg-transparent p-2 text-lg font-[600]   dark:text-gray-200">
                <div className="flex">Төлбөр аваагүй:</div>
                <div>
                  {formatNumber(
                    (zorchilMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0) +
                      (tulburteiMedeelel?.reduce((a, b) => a + b?.dun, 0) ||
                        0) +
                      (tulburiinMedeelel
                        ?.filter((a) => a?.ner === "Үнэгүй")
                        ?.reduce((a, b) => a + b?.dun, 0) || 0),
                  ) + "₮"}
                </div>
              </div>
            )}
            {hongololtMedeelel.length > 0 && (
              <div className="flex items-center justify-between rounded bg-transparent p-2 text-lg font-[600]  dark:text-gray-200">
                <div className="flex">Нийт хөнгөлөлт:</div>
                <div>
                  {formatNumber(
                    hongololtMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0,
                  ) + "₮"}
                </div>
              </div>
            )}
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

export default React.forwardRef(TulburiinDelgerenguiTailan);
