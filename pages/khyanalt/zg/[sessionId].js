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
import { FaCar } from "react-icons/fa";

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
      barilgiinId === "All" ? undefined : barilgiinId,
      undefined,
      false
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

    if (turul === "Zogsool") {
      if (zogsoolTulburMedeelel?.length > 0) {
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
            .values()
        );

        var niitDun = mergedTulbur?.reduce((a, b) => a + b.niitDun, 0) || 0;

        mergedTulbur?.forEach((element) => {
          let item = null;
          let category = "tulbur";
          const elementId = element?._id?.toLowerCase() || "";

          if (elementId.startsWith("ugaalga")) {
            const is24h = elementId.includes("24") || element?._id?.includes("24");
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
              item = { ner: "Данс", icon: "/transaction.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "belen":
              item = { ner: "Бэлэн", icon: "/Cash.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "khunglukh":
              item = { ner: "Хөнгөлөх", icon: "https://static.vecteezy.com/system/resources/previews/012/487/845/original/3d-wallet-floating-in-hand-isolated-on-transparent-business-man-holding-purple-purse-icon-mobile-banking-online-service-cashback-refund-loan-concept-saving-money-wealth-cartoon-3d-render-png.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              category = "hongololt";
              break;
            case "khungulult":
              item = { ner: "Хөнгөлөлт", icon: "/hongololt.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              category = "hongololt";
              break;
            case "Fitness":
              item = { ner: "Фитнес", icon: "/hongololt.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              category = "hongololt";
              break;
            case "Ugaalga":
              item = { ner: "Угаалга", icon: "/hongololt.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              category = "hongololt";
              break;
            case "khaan":
              item = { ner: "Карт", icon: "/card.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "tdb":
              item = { ner: "TDB банк", icon: "/tdb.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "khas":
              item = { ner: "Xac банк", icon: "https://cdn6.aptoide.com/imgs/0/6/d/06df97a06fbc7622a775a7c414b69e87_icon.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "golomt":
              item = { ner: "Голомт банк", icon: "https://play-lh.googleusercontent.com/9tUBesUsI4UIkpgO1MPIMLFvhDa_4vZE75TrVAUHFA7a0bJ7IIgeyh2r1QXs9VlmXmkX", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "kapitron":
              item = { ner: "Капитрон банк", icon: "https://play-lh.googleusercontent.com/1PMmu0x2x_07XdPtLyTRe_4cffXDLFCG3xEoUTqUpy3eSJeB-C81dbyzZSnJjW907OA=w240-h480-rw", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "tur":
              item = { ner: "Төрийн банк", icon: "https://play-lh.googleusercontent.com/KYQyVTgP4ZV60gxNOsKYssScNe17NMgHpO_nRY4WRBYj_4YTZ0e8t6zwh38sTFmyCco", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "qpay":
              item = { ner: "QPay", icon: "https://qpay.mn/q/img/q.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "DotorQR":
              item = { ner: "Дотор QR", icon: "/QR.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "GadaaQR":
              item = { ner: "Гадаа QR", icon: "/GadaaQR.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "bankQR":
              item = { ner: "Банк QR", icon: "/Bank.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "toki":
              item = { ner: "Токи", icon: "/Group_158.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "kiosk":
              item = { ner: "Киоск", icon: "/kiosk.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "monpay":
              item = { ner: "MonPay", icon: "https://play-lh.googleusercontent.com/GofyFzRM2Kwf3d47fl6FibZB7kE16Aljaodzc-ghiJmdiPpGljaqeop2T6JaURd8rw=s480-rw", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "socialpay":
              item = { ner: "SocialPay", icon: "https://play-lh.googleusercontent.com/Jg_jjsNezlkTuxWT5ADzfqhjwHVvqZEDqQGbXJlkplNrYPyyMGXtmLA6dGrH37_paOY=w240-h480-rw", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "tseneglelt":
              item = { ner: "Хэтэвч", icon: "https://static.vecteezy.com/system/resources/previews/012/487/845/original/3d-wallet-floating-in-hand-isolated-on-transparent-business-man-holding-purple-purse-icon-mobile-banking-online-service-cashback-refund-loan-concept-saving-money-wealth-cartoon-3d-render-png.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "PosBelen":
              item = { ner: "ПОС Бэлэн", icon: "/androidPosBelen.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "PosKart":
              item = { ner: "ПОС Карт", icon: "/androidpooos.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "PosKhariltsakh":
              item = { ner: "ПОС Данс", icon: "/androidDansPos.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "Зөрчилтэй":
              item = { ner: "Зөрчилтэй", icon: "/exclamation.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              category = "zorchil";
              break;
            case "Төлбөртэй":
              item = { ner: "Төлбөртэй", icon: "/tulburtei.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              category = "tulburtei";
              break;
            case "Үнэгүй":
              item = { ner: "Үнэгүй", icon: "/Unegui.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
            case "Авлага":
              item = { ner: "Авлага", icon: "/budgeting.png", dun: element.niitDun, too: element.niitToo, khuvi: 100 };
              break;
            default:
              item = { ner: element._id, icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png", dun: element.niitDun, too: element.niitToo, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 };
              break;
          }

          if (item) {
            if (category === "hongololt") hongololt.push(item);
            else if (category === "zorchil") zorchil.push(item);
            else if (category === "tulburtei") tulburtei.push(item);
            else tulbur.push(item);
          }
        });
      }
    } else if (turul === "Togloomiin tuv") {
      if (!!togloomiinDun?.toololt) {
        var niitDun = togloomiinDun?.toololt?.reduce((a, b) => a + b.niitDun, 0) || 0;
        togloomiinDun?.toololt?.forEach((element) => {
          switch (element?._id) {
            case "khariltsakh": tulbur.push({ ner: "Дансаар", icon: "https://static.vecteezy.com/system/resources/previews/012/487/823/original/3d-hand-press-pay-button-icon-phone-with-credit-card-float-on-transparent-mobile-banking-online-payment-service-withdraw-money-easy-shop-cashless-society-concept-cartoon-minimal-3d-render-png.png", dun: element.niitDun, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 }); break;
            case "belen": tulbur.push({ ner: "Бэлэн", icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png", dun: element.niitDun, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 }); break;
            case "khaan": tulbur.push({ ner: "Хаан банк", icon: "https://play-lh.googleusercontent.com/Aw4bwCDJgAzu6AFAbbcfCFpheVMB6ZKiEM3JlrJ3cAM65fK-1QaTZZs_Vk4UFBzykQ=s480-rw", dun: element.niitDun, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 }); break;
            default: tulbur.push({ ner: element._id, icon: "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png", dun: element.niitDun, khuvi: (Number(element.niitDun) / Number(niitDun)) * 100 }); break;
          }
        });
      }
    } else if (turul === "Turees" && !!guilgeeniiToololt) {
      const niitHhemjee = talbainToololt?.reduce((a, b) => a + b.khemjee, 0) || 0;
      tulbur.push({ icon: "/plan.png", ner: "Төлөвлөгөө / сар", dun: _.get(guilgeeniiToololt, "eneSardTulukh.0.dun") || 0 });
      tulbur.push({ icon: "/performance.png", ner: "Гүйцэтгэл / сар", dun: _.get(guilgeeniiToololt, "eneSardTulsun.0.dun") || 0 });
      tulbur.push({ icon: "/gift-voucher.png", ner: "Ваучер төлөлт", dun: _.get(guilgeeniiToololt, "voucher.0.dun") || 0 });
      hongololt.push({ icon: "/sale.png", ner: "Хөнгөлөлт / сар", dun: _.get(guilgeeniiToololt, "khungulult.0.dun") || 0 });
      zorchil.push({ icon: "/avlaga.png", ner: "Хуримтлагдсан авлага", dun: _.get(guilgeeniiToololt, "avlaga.0.dun") || 0 });
      zorchil.push({ icon: "/tsutsalsan.png", ner: "Цуцлагдсан авлага", dun: _.get(guilgeeniiToololt, "tsutslagdsanAvlaga.0.dun") || 0 });
      tulbur.push({ checkToo: true, icon: "/niitTurees.png", ner: "Нийт талбай", dun: talbainToololt?.reduce((a, b) => a + b?.too, 0), khemjee: talbainToololt?.reduce((a, b) => a + b?.khemjee, 0), khuvi: 100 });
      tulbur.push({ checkToo: true, icon: "/niitTurees.png", ner: "Нийт идэвхтэй", dun: talbainToololt?.find((a) => a._id === true)?.too || 0, khemjee: talbainToololt?.find((a) => a._id === true)?.khemjee || 0, khuvi: (Number(talbainToololt?.find((a) => a._id === true)?.khemjee || 0) / Number(niitHhemjee)) * 100 });
      tulbur.push({ checkToo: true, icon: "/niitTurees.png", ner: "Нийт идэвхгүй", dun: talbainToololt?.find((a) => a._id === false)?.too || 0, khemjee: talbainToololt?.find((a) => a._id === false)?.khemjee || 0, khuvi: (Number(talbainToololt?.find((a) => a._id === false)?.khemjee || 0) / Number(niitHhemjee)) * 100 });
      tulbur.push({ checkToo: true, icon: "/niitTurees.png", ner: "Нийтийн талбай", dun: talbainToololt?.find((a) => a._id === "niitiinTalbai")?.too || 0, khemjee: talbainToololt?.find((a) => a._id === "niitiinTalbai")?.khemjee || 0, khuvi: (Number(talbainToololt?.find((a) => a._id === "niitiinTalbai")?.khemjee || 0) / Number(niitHhemjee)) * 100 });
    }
    return { tulburiinMedeelel: tulbur, hongololtMedeelel: hongololt, zorchilMedeelel: zorchil, tulburteiMedeelel: tulburtei };
  }, [
    zogsoolTulburMedeelel,
    turul,
    togloomiinDun,
    guilgeeniiToololt,
    talbainToololt,
  ]);

  const buhMedeelel = [
    ...tulburiinMedeelel,
    ...hongololtMedeelel,
    ...zorchilMedeelel,
    ...tulburteiMedeelel,
  ];

  function renderRow(a, i, accentColor = "green") {
    const colors = {
      green: { bg: "bg-green-100 dark:bg-green-500", border: "border-green-600" },
      yellow: { bg: "bg-yellow-100 dark:bg-yellow-500", border: "border-yellow-600" },
      red: { bg: "bg-red-100 dark:bg-red-500", border: "border-red-600" },
      purple: { bg: "bg-purple-100 dark:bg-purple-500", border: "border-purple-600" },
    };
    const c = colors[accentColor] || colors.green;
    return (
      <div
        className="relative flex h-14 w-full items-center overflow-hidden rounded-md border-2 p-2"
        key={i}
      >
        <div
          style={{ width: `${String(Math.round(a.khuvi || 0))}%` }}
          className={`absolute left-0 top-0 z-0 flex h-full items-center ${c.bg}`}
        >
          <div className={`absolute -right-1 h-20 w-16 animate-spin-slow rounded-3xl ${c.bg}`} />
        </div>
        {a.iconComponent ? (
          <div className="z-10 mx-2 flex h-11 w-12 items-center justify-center overflow-hidden rounded-md">
            {React.createElement(a.iconComponent, {
              className: "h-8 w-8 text-blue-600",
            })}
          </div>
        ) : (
          <img src={a.icon} className="z-10 mx-2 h-11 w-12 overflow-hidden rounded-md" alt={a.ner} />
        )}
        <div className="z-10 flex w-full justify-between text-lg font-semibold dark:text-gray-200">
          <span className="inline-flex items-center text-[15px] leading-none sm:text-lg">{a.ner}:</span>
          <div className="flex font-normal">
            {a.checkToo === true ? (
              <>
                {formatNumber(a.dun, 0) || 0}
                <span className={`ml-2 border-l ${c.border} pl-2`}>{formatNumber(a.khemjee, 0)}м²</span>
              </>
            ) : (
              <>
                {formatNumber(a.dun) || 0}₮
                <div className={`ml-3 mr-3 flex w-10 items-center justify-center border-x ${c.border} text-center`}>
                  <div className="ml-5 mr-5">{a.too}</div>
                </div>
                <div className={`ml-5 flex w-10 items-center justify-center ${c.border} pr-5 text-center`}>
                  <div className="ml-10">{a.khuvi - Math.floor(a.khuvi || 0) > 0 ? Number(a.khuvi).toFixed(2) : a.khuvi || 0}</div>
                  <div className="mr-10">%</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="hidden">
        <div className="p-6" ref={printRef}>
          {buhMedeelel.map((a, i) => (
            <div className="my-1" key={i}>{`${i + 1}. ${a.ner} (${a.too}) : ${formatNumber(a.dun)} ₮`}</div>
          ))}
          <div className="flex items-center justify-start gap-2">
            <div>Нийт дүн ({buhMedeelel?.reduce((a, b) => a + (b?.too || 0), 0) || 0}):</div>
            <div>{formatNumber(buhMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0)}₮</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <DatePicker.RangePicker
          value={ognoo}
          onChange={setOgnoo}
          allowClear={false}
          locale={locale}
          style={{ flex: 1 }}
        />
        <Select
          value={turul}
          onChange={(v) => { setTurul(v); }}
          style={{ width: 150 }}
          placeholder={"Төрөл"}
          options={[
            { label: "Зогсоол", value: "Zogsool" },
            { label: "Түрээс", value: "Turees" },
            { label: "Тоглоомын төв", value: "Togloomiin tuv" },
          ]}
        />
        <Select
          defaultValue={barilgiinId}
          value={barilgiinId}
          onChange={(v) => setBarilgiinId(v)}
          style={{ width: 150 }}
          placeholder={"Барилга"}
        >
          <option key={"All"} value={"All"}>Бүгд</option>
          {baiguullagaIdgaarAvya?.barilguud?.map((a) => (
            <option key={a?._id} value={a?._id}>{a?.ner}</option>
          ))}
        </Select>
      </div>

      {!togloomiinDun.toololtUnshijBaina && !zogsooliinUdriinTailanUnshijBaina ? (
        <div className="mt-5 space-y-3">
          {/* Payment methods — green */}
          {tulburiinMedeelel.length > 0 && (
            <>
              <div className="border-b-2 border-green-500 pb-1 text-lg font-bold dark:text-gray-200">Төлбөрийн хэлбэр</div>
              {tulburiinMedeelel.sort((a, b) => b.khuvi - a.khuvi).map((a, i) => renderRow(a, i, "green"))}
            </>
          )}

          {/* Discounts — yellow */}
          {hongololtMedeelel.length > 0 && (
            <>
              <div className="mt-4 border-b-2 border-yellow-500 pb-1 text-lg font-bold dark:text-gray-200">Хөнгөлөлт</div>
              {hongololtMedeelel.sort((a, b) => b.khuvi - a.khuvi).map((a, i) => renderRow(a, i, "yellow"))}
            </>
          )}

          {/* Violations — red */}
          {zorchilMedeelel.length > 0 && (
            <>
              <div className="mt-4 border-b-2 border-red-500 pb-1 text-lg font-bold dark:text-gray-200">Зөрчил</div>
              {zorchilMedeelel.sort((a, b) => b.khuvi - a.khuvi).map((a, i) => renderRow(a, i, "red"))}
            </>
          )}

          {/* Unpaid — purple */}
          {tulburteiMedeelel.length > 0 && (
            <>
              <div className="mt-4 border-b-2 border-purple-500 pb-1 text-lg font-bold dark:text-gray-200">Төлбөртэй</div>
              {tulburteiMedeelel.sort((a, b) => b.khuvi - a.khuvi).map((a, i) => renderRow(a, i, "purple"))}
            </>
          )}

          {buhMedeelel.length === 0 && (
            <div className="flex h-52 w-full items-center justify-center">
              <div className="text-lg font-semibold text-black text-opacity-30 dark:text-gray-400">
                Орлогын мэдээлэл байхгүй байна.
              </div>
            </div>
          )}

          {buhMedeelel.length > 0 && (
            <>
              <div className="border border-dashed bg-gray-600" />
              <div className="flex items-center justify-between text-lg font-[600] dark:text-gray-200">
                <div className="flex">Бодогдсон дүн:</div>
                <div>{formatNumber(buhMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0) + "₮"}</div>
              </div>
              {tulburiinMedeelel.length > 0 && (
                <div className="flex items-center justify-between text-lg font-[600] dark:text-gray-200">
                  <div className="flex">Төлбөр авсан:</div>
                  <div>{formatNumber(tulburiinMedeelel.filter((a) => a?.ner !== "Үнэгүй").reduce((a, b) => a + b?.dun, 0) || 0) + "₮"}</div>
                </div>
              )}
              {(zorchilMedeelel.length > 0 || tulburteiMedeelel.length > 0) && (
                <div className="flex items-center justify-between text-lg font-[600] dark:text-gray-200">
                  <div className="flex">Төлбөр аваагүй:</div>
                  <div>{formatNumber(
                    (zorchilMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0) +
                    (tulburteiMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0) +
                    (tulburiinMedeelel?.filter((a) => a?.ner === "Үнэгүй")?.reduce((a, b) => a + b?.dun, 0) || 0)
                  ) + "₮"}</div>
                </div>
              )}
              {hongololtMedeelel.length > 0 && (
                <div className="flex items-center justify-between text-lg font-[600] dark:text-gray-200">
                  <div className="flex">Нийт хөнгөлөлт:</div>
                  <div>{formatNumber(hongololtMedeelel?.reduce((a, b) => a + b?.dun, 0) || 0) + "₮"}</div>
                </div>
              )}
              {baiguullagaIdgaarAvya?.tokhirgoo?.zurchulMsgeerSanuulakh && (
                <div className="flex items-center justify-between text-lg font-[600] dark:text-gray-200">
                  <div className="flex">Зөрчилтэй авлага:</div>
                  <div>{formatNumber(zogsoolTulburMedeelel?.filter((c) => c._id === "Авлага").reduce((a, b) => a + b.niitDun, 0) || 0) + "₮"}</div>
                </div>
              )}
            </>
          )}
        </div>
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
