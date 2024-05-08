import { DatePicker, Select } from "antd";
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

const order = { createdAt: -1 };

function TulburiinDelgerenguiTailan(
  {
    barilgiinId,
    baiguullagiinId,
    token,
    destroy,
    defualtOgnoo,
    garsanKhaalga,
    ajiltan,
  },
  ref
) {
  const [songogdsonAjiltan, setSongogdsonAjiltan] = useState(null);
  const [ognoo, setOgnoo] = useState([
    moment(defualtOgnoo[0]),
    moment(defualtOgnoo[1]),
  ]);

  const zogsooAjiltanQuery = useMemo(() => {
    return undefined;
  }, [baiguullagiinId, barilgiinId]);

  const query = useMemo(() => {
    if (songogdsonAjiltan) {
      return { burtgesenAjiltaniiId: songogdsonAjiltan };
    }
    return undefined;
  }, [songogdsonAjiltan]);

  const { zogsoolTulburMedeelel, zogsoolTulburMedeelelMutate } =
    usezogsooliinUdriinTailan(
      token,
      barilgiinId,
      ognoo[1],
      ognoo[0],
      garsanKhaalga,
      baiguullagiinId,
      query
    );
  const { ajilchdiinGaralt } = useAjiltniiJagsaalt(
    token,
    baiguullagiinId,
    zogsooAjiltanQuery
  );

  console.log("ajilchdiinGaralt", ajilchdiinGaralt);
  const printRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const tulburiinMedeelel = useMemo(() => {
    var ugugdul = [];
    if (!!zogsoolTulburMedeelel) {
      var niitDun =
        zogsoolTulburMedeelel?.reduce((a, b) => a + b.niitDun, 0) || 0;

      zogsoolTulburMedeelel?.forEach((element) => {
        switch (element?._id) {
          case "khariltsakh":
            ugugdul.push({
              ner: "Дансаар",
              icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png",

              // icon: "https://static.vecteezy.com/system/resources/previews/012/487/823/original/3d-hand-press-pay-button-icon-phone-with-credit-card-float-on-transparent-mobile-banking-online-payment-service-withdraw-money-easy-shop-cashless-society-concept-cartoon-minimal-3d-render-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "belen":
            ugugdul.push({
              ner: "Бэлэн",
              icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png",
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
              icon: "/discount.png",
              // icon: "https://static.vecteezy.com/system/resources/previews/012/487/845/original/3d-wallet-floating-in-hand-isolated-on-transparent-business-man-holding-purple-purse-icon-mobile-banking-online-service-cashback-refund-loan-concept-saving-money-wealth-cartoon-3d-render-png.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "khaan":
            ugugdul.push({
              ner: "Карт", //tur cart bolgiy Хаан банк
              icon: "/cartniiZurag.png", // "https://play-lh.googleusercontent.com/Aw4bwCDJgAzu6AFAbbcfCFpheVMB6ZKiEM3JlrJ3cAM65fK-1QaTZZs_Vk4UFBzykQ=s480-rw",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "tdb":
            ugugdul.push({
              ner: "TDB банк",
              icon: "/tdb.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "khas":
            ugugdul.push({
              ner: "Xac банк",
              icon: "https://cdn6.aptoide.com/imgs/0/6/d/06df97a06fbc7622a775a7c414b69e87_icon.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "golomt":
            ugugdul.push({
              ner: "Голомт банк",
              icon: "https://play-lh.googleusercontent.com/9tUBesUsI4UIkpgO1MPIMLFvhDa_4vZE75TrVAUHFA7a0bJ7IIgeyh2r1QXs9VlmXmkX",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "kapitron":
            ugugdul.push({
              ner: "Капитрон банк",
              icon: "https://play-lh.googleusercontent.com/1PMmu0x2x_07XdPtLyTRe_4cffXDLFCG3xEoUTqUpy3eSJeB-C81dbyzZSnJjW907OA=w240-h480-rw",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "tur":
            ugugdul.push({
              ner: "Төрийн банк",
              icon: "https://play-lh.googleusercontent.com/KYQyVTgP4ZV60gxNOsKYssScNe17NMgHpO_nRY4WRBYj_4YTZ0e8t6zwh38sTFmyCco",
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
          case "monpay":
            ugugdul.push({
              ner: element._id,
              icon: "https://play-lh.googleusercontent.com/GofyFzRM2Kwf3d47fl6FibZB7kE16Aljaodzc-ghiJmdiPpGljaqeop2T6JaURd8rw=s480-rw",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          case "socialpay":
            ugugdul.push({
              ner: element._id,
              icon: "https://play-lh.googleusercontent.com/Jg_jjsNezlkTuxWT5ADzfqhjwHVvqZEDqQGbXJlkplNrYPyyMGXtmLA6dGrH37_paOY=w240-h480-rw",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;
          // case "pocket":
          //   ugugdul.push({
          //     ner: element._id,
          //     icon: "https://play-lh.googleusercontent.com/l0PMiUcleEv4dTZslRa9psOfrlB3S8NpBwctOoxQ6vlqfjamIf2ZxVlynfqiSelbTg=w240-h480-rw",
          //     dun: element.niitDun,
          //     too: element.niitToo,
          //     khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
          //   });
          //   break;
          case "toki":
            ugugdul.push({
              ner: element._id,
              icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.toki.mn%2F&psig=AOvVaw1ej7t5Vo6qLIhInQ0XNMEm&ust=1715243807766000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJjD-6DT_YUDFQAAAAAdAAAAABAE",
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

          case "PosBelen":
            ugugdul.push({
              ner: "Pos бэлэн",
              icon: "https://static.vecteezy.com/system/resources/previews/012/487/823/original/3d-hand-press-pay-button-icon-phone-with-credit-card-float-on-transparent-mobile-banking-online-payment-service-withdraw-money-easy-shop-cashless-society-concept-cartoon-minimal-3d-render-png.png",
              // icon: "/eWalletIcon.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;

          case "PosCard":
            ugugdul.push({
              ner: "Pos карт",
              icon: "https://static.vecteezy.com/system/resources/previews/012/487/823/original/3d-hand-press-pay-button-icon-phone-with-credit-card-float-on-transparent-mobile-banking-online-payment-service-withdraw-money-easy-shop-cashless-society-concept-cartoon-minimal-3d-render-png.png",
              // icon: "/eWalletIcon.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;

          case "PosKhariltsakh":
            ugugdul.push({
              ner: "Pos харилцах",
              icon: "https://static.vecteezy.com/system/resources/previews/012/487/823/original/3d-hand-press-pay-button-icon-phone-with-credit-card-float-on-transparent-mobile-banking-online-payment-service-withdraw-money-easy-shop-cashless-society-concept-cartoon-minimal-3d-render-png.png",
              // icon: "/eWalletIcon.png",
              dun: element.niitDun,
              too: element.niitToo,
              khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
            });
            break;

          default:
            ugugdul.push({
              ner: element._id,
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
    []
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
          {tulburiinMedeelel.map((a, i) => {
            return (
              <div className="my-1" key={i}>{`${i + 1}. ${a.ner} (${
                a.too
              }) : ${formatNumber(a.dun)} ₮`}</div>
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
      <div className="flex items-center justify-between gap-2">
        <DatePicker.RangePicker
          value={ognoo}
          onChange={setOgnoo}
          allowClear={false}
          locale={locale}
          style={{ width: "50%" }}
        />
        <Select
          id="ajiltanSongokhInput"
          placeholder={t("Ажилтан")}
          allowClear
          clearIcon={() => (
            <div className="dark:bg-gray-800 dark:text-gray-200  hover:dark:text-gray-400">
              <CloseCircleOutlined />
            </div>
          )}
          style={{ width: "50%" }}
          onChange={(e) => setSongogdsonAjiltan(e)}>
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
      {tulburiinMedeelel.length > 0 ? (
        <div className="mt-5 space-y-3">
          {tulburiinMedeelel.map((a, i) => {
            return (
              <div
                className="relative flex h-14 w-full items-center overflow-hidden rounded-md border-2 p-2"
                key={i}>
                <div
                  style={{ width: `${String(Math.round(a.khuvi))}%` }}
                  className={`absolute left-0 top-0 z-0 flex h-full items-center bg-green-100 dark:bg-green-500 `}>
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
          <div className="border border-dashed bg-gray-600" />
          <div className="flex items-center justify-between text-lg font-[600] dark:text-gray-200">
            <div className="flex ">Нийт дүн:</div>
            <div>
              {formatNumber(
                tulburiinMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0
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

export default React.forwardRef(TulburiinDelgerenguiTailan);
