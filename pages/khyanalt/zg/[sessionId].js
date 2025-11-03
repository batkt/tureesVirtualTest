import { DatePicker, Select, Spin } from "antd";
import locale from "antd/lib/date-picker/locale/mn_MN";
import usezogsooliinUdriinTailan from "hooks/usezogsooliinUdriinTailan";
import React, { useMemo, useState } from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import uilchilgee from "services/uilchilgee";
import { useToololt } from "hooks/useToololt";
import useGuilgeeniiToololtAvya from "hooks/tulburTootsoo/useGuilgeeniiToololtAvya";
import _ from "lodash";
import useTalbainToololt from "hooks/useTalbainToololt";
import useBaiguullagaIdgaarAvya from "hooks/useBaiguullagaIdgaarAvya";

function TulburiinDelgerenguiTailan({ token }) {
  const [barilgiinId, setBarilgiinId] = useState("All");
  const [songogdsonAjiltan, setSongogdsonAjiltan] = useState(null);
  const [turul, setTurul] = useState("Zogsool");
  const [ognoo, setOgnoo] = useState([
    moment().subtract(1, "days").startOf("day"),
    moment().subtract(1, "days").endOf("day"),
  ]);

  const { guilgeeniiToololt, guilgeeniiToololtMutate } =
    useGuilgeeniiToololtAvya(
      turul === "Turees" && token,
      ognoo,
      barilgiinId === "All" ? undefined : barilgiinId
    );
  const { talbainToololt } = useTalbainToololt(
    turul === "Turees" && token,
    barilgiinId === "All" ? undefined : barilgiinId
  );

  const togloomiinDun = useToololt(
    "/togloomiinDunAvya",
    turul === "Togloomiin tuv" && token,
    ognoo
  );
  const { baiguullagaIdgaarAvya, baiguullagaIdgaarAvyaMutate } =
    useBaiguullagaIdgaarAvya(token);

  const query = useMemo(() => {
    if (songogdsonAjiltan) {
      return { burtgesenAjiltaniiId: songogdsonAjiltan };
    }
    return undefined;
  }, [songogdsonAjiltan]);

  const { zogsoolTulburMedeelel, zogsooliinUdriinTailanUnshijBaina } =
    usezogsooliinUdriinTailan(
      turul === "Zogsool" && token,
      barilgiinId === "All" ? undefined : barilgiinId,
      ognoo[1],
      ognoo[0],
      undefined,
      undefined,
      query
    );
  const printRef = React.useRef(null);

  const tulburiinMedeelel = useMemo(() => {
    var ugugdul = [];
    if (turul === "Zogsool") {
      if (zogsoolTulburMedeelel?.length > 0) {
        var niitDun =
          zogsoolTulburMedeelel?.reduce((a, b) => a + b.niitDun, 0) || 0;

        zogsoolTulburMedeelel?.forEach((element) => {
          switch (element?._id) {
            case "khariltsakh":
              ugugdul.push({
                ner: "Данс",
                icon: "/transaction.png",
                dun: element.niitDun,
                too: element.niitToo,
                khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
              });
              break;
            case "belen":
              ugugdul.push({
                ner: "Бэлэн",
                icon: "/Cash.png",
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
            case "khaan":
              ugugdul.push({
                ner: "Карт",
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

                dun: element.niitDun,
                too: element.niitToo,
                khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
              });
              break;
            case "PosBelen":
              ugugdul.push({
                ner: "Aндройд ПОС бэлэн",
                icon: "/androidPosBelen.png",

                dun: element.niitDun,
                too: element.niitToo,
                khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
              });
              break;
            case "PosCard":
              ugugdul.push({
                ner: "Aндройд ПОС карт",
                icon: "/androidpooos.png",

                dun: element.niitDun,
                too: element.niitToo,
                khuvi: (Number(element.niitDun) / Number(niitDun)) * 100,
              });
              break;
            case "PosKhariltsakh":
              ugugdul.push({
                ner: "Aндройд ПОС дансаар",
                icon: "/androidDansPos.png",

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
            case "Авлага":
              ugugdul.push({
                ner: "Авлага",
                icon: "/budgeting.png",

                dun: element.niitDun,
                too: element.niitToo,
                khuvi: 100,
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
    } else if (turul === "Togloomiin tuv") {
      if (!!togloomiinDun?.toololt) {
        var niitDun =
          togloomiinDun?.toololt?.reduce((a, b) => a + b.niitDun, 0) || 0;

        togloomiinDun?.toololt?.forEach((element) => {
          switch (element?._id) {
            case "khariltsakh":
              ugugdul.push({
                ner: "Дансаар",
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

            case "toki":
              ugugdul.push({
                ner: element._id,
                icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.toki.mn%2F&psig=AOvVaw1ej7t5Vo6qLIhInQ0XNMEm&ust=1715243807766000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJjD-6DT_YUDFQAAAAAdAAAAABAE",
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
      }
    } else if (turul === "Turees" && !!guilgeeniiToololt) {
      ugugdul.push({
        icon: "/plan.png",
        ner: "Төлөвлөгөө / сар",
        dun: _.get(guilgeeniiToololt, "eneSardTulukh.0.dun") || 0,
      });
      ugugdul.push({
        icon: "/performance.png",
        ner: "Гүйцэтгэл / сар",
        dun: _.get(guilgeeniiToololt, "eneSardTulsun.0.dun") || 0,
      });
      ugugdul.push({
        icon: "/gift-voucher.png",
        ner: "Ваучер төлөлт",
        dun: _.get(guilgeeniiToololt, "voucher.0.dun") || 0,
      });
      ugugdul.push({
        icon: "/sale.png",
        ner: "Хөнгөлөлт / сар",
        dun: _.get(guilgeeniiToololt, "khungulult.0.dun") || 0,
      });
      ugugdul.push({
        icon: "/avlaga.png",
        ner: "Хуримтлагдсан авлага",
        dun: _.get(guilgeeniiToololt, "avlaga.0.dun") || 0,
      });
      ugugdul.push({
        icon: "/tsutsalsan.png",
        ner: "Цуцлагдсан авлага",
        dun: _.get(guilgeeniiToololt, "tsutslagdsanAvlaga.0.dun") || 0,
      });

      var niitHhemjee = talbainToololt?.reduce((a, b) => a + b.khemjee, 0) || 0;
      ugugdul.push({
        checkToo: true,
        icon: "/niitTurees.png",
        ner: "Нийт талбай",
        dun: talbainToololt?.reduce((a, b) => a + b?.too, 0),
        khemjee: talbainToololt?.reduce((a, b) => a + b?.khemjee, 0),
        khuvi: 100,
      });
      ugugdul.push({
        checkToo: true,
        icon: "/niitTurees.png",
        ner: "Нийт идэвхтэй",
        dun: talbainToololt?.find((a) => a._id === true)?.too || 0,
        khemjee: talbainToololt?.find((a) => a._id === true)?.khemjee || 0,
        khuvi:
          (Number(talbainToololt?.find((a) => a._id === true)?.khemjee || 0) /
            Number(niitHhemjee)) *
          100,
      });
      ugugdul.push({
        icon: "/niitTurees.png",
        checkToo: true,
        ner: "Нийт идэвхгүй",
        dun: talbainToololt?.find((a) => a._id === false)?.too || 0,
        khemjee: talbainToololt?.find((a) => a._id === false)?.khemjee || 0,
        khuvi:
          (Number(talbainToololt?.find((a) => a._id === false)?.khemjee || 0) /
            Number(niitHhemjee)) *
          100,
      });
      ugugdul.push({
        icon: "/niitTurees.png",
        checkToo: true,
        ner: "Нийтийн талбай",
        dun: talbainToololt?.find((a) => a._id === "niitiinTalbai")?.too || 0,
        khemjee:
          talbainToololt?.find((a) => a._id === "niitiinTalbai")?.khemjee || 0,
        khuvi:
          (Number(
            talbainToololt?.find((a) => a._id === "niitiinTalbai")?.khemjee || 0
          ) /
            Number(niitHhemjee)) *
          100,
      });
    }
    return ugugdul;
  }, [
    zogsoolTulburMedeelel,
    turul,
    togloomiinDun,
    guilgeeniiToololt,
    talbainToololt,
  ]);

  return (
    <div className="mx-2">
      <div className="hidden">
        <div className="p-6" ref={printRef}>
          {tulburiinMedeelel.map((a, i) => {
            return (
              <div className="my-1" key={i}>{`${i + 1}. ${a.ner} (${
                a.too
              }) : ${formatNumber(a.dun)} ₮ (${a.too})`}</div>
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
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <DatePicker.RangePicker
            value={ognoo}
            onChange={setOgnoo}
            allowClear={false}
            locale={locale}
            style={{ width: "100%" }}
          />
        </div>
        <Select
          value={turul}
          onChange={(v) => {
            setTurul(v);
          }}
          style={{ width: "100%" }}
          placeholder={"Төрөл"}
          options={[
            {
              label: "Зогсоол",
              value: "Zogsool",
            },
            {
              label: "Түрээс",
              value: "Turees",
            },
            {
              label: "Тоглоомын төв",
              value: "Togloomiin tuv",
            },
          ]}
        />
        <Select
          defaultValue={barilgiinId}
          value={barilgiinId}
          onChange={(v) => setBarilgiinId(v)}
          style={{ width: "100%" }}
          placeholder={"Барилга"}
        >
          <option key={"All"} value={"All"}>
            Бүгд
          </option>
          {baiguullagaIdgaarAvya?.barilguud?.map((a) => (
            <option key={a?._id} value={a?._id}>
              {a?.ner}
            </option>
          ))}
        </Select>
      </div>

      {!togloomiinDun.toololtUnshijBaina &&
      !zogsooliinUdriinTailanUnshijBaina ? (
        turul === "Zogsool" ? (
          tulburiinMedeelel.length > 0 ? (
            <div className="mt-5 space-y-3">
              {tulburiinMedeelel
                .sort(function (a, b) {
                  return b.khuvi - a.khuvi;
                })
                .map((a, i) => {
                  return (
                    <div
                      className="relative flex h-14 w-full items-center overflow-hidden rounded-md border-2 p-2"
                      key={i}
                    >
                      <div
                        style={{ width: `${String(Math.round(a.khuvi))}%` }}
                        className={
                          a.ner == "Зөрчил"
                            ? `absolute left-0 top-0 z-0 flex h-full items-center bg-red-200 dark:bg-red-500 `
                            : `absolute left-0 top-0 z-0 flex h-full items-center bg-green-100 dark:bg-green-500 `
                        }
                      >
                        <div
                          className={
                            a.ner == "Зөрчил"
                              ? "absolute -right-1 h-20 w-16 animate-spin-slow rounded-3xl bg-red-200 dark:bg-red-500 "
                              : "absolute -right-1 h-20 w-16 animate-spin-slow rounded-3xl bg-green-100 dark:bg-green-500 "
                          }
                        />
                      </div>
                      <img
                        src={a.icon}
                        className="z-10 mx-2 h-11 w-12 overflow-hidden rounded-md"
                      />
                      <div className="z-10 flex w-full justify-between text-lg font-semibold dark:text-gray-200">
                        {a.ner}:
                        <div className="flex font-normal">
                          {formatNumber(a.dun) || 0}₮
                          <div className=" ml-3 mr-3 flex w-10 items-center justify-center border-x border-green-600 text-center">
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
                        a +
                        (b.ner != "Үнэгүй" && b.ner != "Зөрчил" ? b?.dun : 0),
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
                        a +
                        (b.ner == "Үнэгүй" || b.ner == "Зөрчил" ? b?.dun : 0),
                      0
                    ) || 0
                  ) + "₮"}
                </div>
              </div>
              {baiguullagaIdgaarAvya?.tokhirgoo?.zurchulMsgeerSanuulakh && (
                <div className="flex items-center justify-between text-lg font-[600] dark:text-gray-200">
                  <div className="flex ">Зөрчилтэй авлага:</div>
                  <div>
                    {formatNumber(
                      zogsoolTulburMedeelel
                        ?.filter((c) => c._id === "Авлага")
                        .reduce((a, b) => a + b.niitDun, 0) || 0
                    ) + "₮"}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-52 w-full items-center justify-center">
              <div className="text-lg font-semibold text-black text-opacity-30 dark:text-gray-400">
                Орлогын мэдээлэл байхгүй байна.
              </div>
            </div>
          )
        ) : turul === "Turees" ? (
          tulburiinMedeelel?.length > 0 ? (
            <div className="mt-5 space-y-3">
              {tulburiinMedeelel
                .sort(function (a, b) {
                  return b.khuvi - a.khuvi;
                })
                .map((a, i) => {
                  return (
                    <div
                      className="relative flex h-14 w-full items-center overflow-hidden rounded-md border-2 p-2"
                      key={i}
                    >
                      {a.checkToo === true ? (
                        <div
                          style={{ width: `${String(Math.round(a.khuvi))}%` }}
                          className={
                            a.ner == "Зөрчил"
                              ? `absolute left-0 top-0 z-0 flex h-full items-center bg-red-200 dark:bg-red-500 `
                              : `absolute left-0 top-0 z-0 flex h-full items-center bg-green-100 dark:bg-green-500 `
                          }
                        >
                          <div
                            className={
                              a.ner == "Зөрчил"
                                ? "absolute -right-1 h-20 w-16 animate-spin-slow rounded-3xl bg-red-200 dark:bg-red-500 "
                                : "absolute -right-1 h-20 w-16 animate-spin-slow rounded-3xl bg-green-100 dark:bg-green-500 "
                            }
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <img
                        src={a.icon}
                        className="z-10 mx-2 h-11 w-12 overflow-hidden rounded-md"
                      />
                      <div className="z-10 flex w-full justify-between text-lg font-semibold dark:text-gray-200">
                        {a.ner}:
                        <div className="flex font-normal">
                          {formatNumber(a.dun, 0) || 0}
                          {a.checkToo === true ? "" : "₮"}
                          {a.checkToo === true ? (
                            <span className="ml-2 border-l border-green-600 pl-2">
                              {" "}
                              {formatNumber(a.khemjee, 0) + "м²"}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex h-52 w-full items-center justify-center">
              <div className="text-lg font-semibold text-black text-opacity-30 dark:text-gray-400">
                Гүйлгээний тоололтын мэдээлэл байхгүй байна.
              </div>
            </div>
          )
        ) : tulburiinMedeelel?.length > 0 ? (
          <div className="mt-5 space-y-3">
            {tulburiinMedeelel.map((a, i) => {
              return (
                <div
                  className="relative flex h-14 w-full items-center overflow-hidden rounded-md border-2 p-2"
                  key={i}
                >
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
        )
      ) : (
        <div className="flex h-52 w-full items-center justify-center">
          <div className="text-lg font-semibold text-black text-opacity-30 dark:text-gray-400">
            <Spin />
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  try {
    let session = null;
    if (!!ctx?.query?.sessionId)
      session = await uilchilgee()
        .get(`/sessionAvya/${ctx?.query?.sessionId}`)
        .then((a) => a.data);
    if (!session) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
        props: {},
      };
    }
    return {
      props: {
        token: session?.sessionToken,
      },
    };
  } catch (error) {
    if (error.response.data.aldaa === "Session олдсонгүй") {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
        props: {},
      };
    }
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }
};

export default TulburiinDelgerenguiTailan;
