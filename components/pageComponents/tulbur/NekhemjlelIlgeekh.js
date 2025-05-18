import { Button, DatePicker, message, Modal, notification, Select } from "antd";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import useNekhemjlekhiinZagvar from "hooks/tulburTootsoo/useNekhemjlekhiinZagvar";
import useDans from "hooks/useDans";
import { useReactToPrint } from "react-to-print";
import useNekhemjlekh from "hooks/tulburTootsoo/useNekhemjlekh";
import { toWords } from "mon_num";
import formatNumber from "tools/function/formatNumber";
import moment from "moment";
import useNekhemjlekhDugaarlalt from "hooks/tulburTootsoo/useNekhemjlekhDugaarlalt";
import { renderToString } from "react-dom/server";
import useJagsaalt from "hooks/useJagsaalt";
import numberToWords from "tools/function/numberToWords";
import khatuuZagvar from "tools/zagvar/tur";
import khatuuZagvarFoodCity from "tools/zagvar/turFoodCityTemp";

const ilgeekhTurul = "davkharaar";

function GuilgeeKhiikh(
  { data, token, onFinish, destroy, t, ajiltan, baiguullaga },
  ref
) {
  const { dansGaralt } = useDans(token, data?.baiguullagiinId);
  const printRef = React.useRef(null);
  const [songogdsonDans, setDans] = React.useState();
  const [barimt, setBarimt] = React.useState();
  const { nekhemjlekhiinZagvar } = useNekhemjlekhiinZagvar(
    token,
    data.barilgiinId
  );

  const ashiglaltiinZardal = useJagsaalt("/ashiglaltiinZardluud", {
    barilgiinId: data.barilgiinId,
  });

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function khaaya() {
    _.isFunction(onFinish) && onFinish();
    destroy();
  }
  const [nekhemjleliinJagsaalt] = React.useState([]);
  const { dugaarlalt } = useNekhemjlekhDugaarlalt(token);
  const [loading, setLoading] = useState(false);
  const [ognoo, setOgnoo] = React.useState(moment());

  const { nekhemjlel } = useNekhemjlekh(
    token,
    ognoo,
    data.davkhar,
    ilgeekhTurul,
    false,
    data.barilgiinId,
    data._id
  );

  const nekhemjlekh = useMemo(() => {
    if (barimt && data)
      var zagvar = nekhemjlekhiinZagvar?.jagsaalt?.find(
        (a) => a._id === barimt
      );
    const medeelel = _.get(nekhemjlel, "jagsaalt.0");
    if (!!zagvar && !!medeelel) {
      if (zagvar?.khatuuZagvarEsekh) {
        zagvar.nekhemjlekh =
          ajiltan?.baiguullagiinId === "63c0f31efe522048bf02086d" &&
          barilgiinId === "6659717af6cab41f3ec723b5"
            ? khatuuZagvarFoodCity(medeelel, ajiltan, baiguullaga)
            : khatuuZagvar(medeelel, ajiltan, baiguullaga, barilgiinId);
      }
      const barilga = baiguullaga?.barilguud?.find(
        (a) => a._id === data.barilgiinId
      );

      let khungulsunTalbainNiitUne = Math.abs(
        medeelel.talbainNiitUne - (medeelel.khungulult || 0)
      );

      let khungulsunTalbainNiitUneNuat = khungulsunTalbainNiitUne
        ? (khungulsunTalbainNiitUne / 1.1) * 0.1
        : 0;
      let khungulsunTalbainNiitUneNuatgui = khungulsunTalbainNiitUne
        ? khungulsunTalbainNiitUne - khungulsunTalbainNiitUneNuat
        : 0;

      var kaidudZoriulsanNiitTulburiinNiilber = 0;

      var zardluud = medeelel.zardluud.filter(
        (a) => a.tailbar === "Менежмент төлбөр хуучин"
      );
      if (!zardluud || zardluud.length === 0) {
        kaidudZoriulsanNiitTulburiinNiilber += khungulsunTalbainNiitUne
          ? khungulsunTalbainNiitUne
          : 0;
      }

      kaidudZoriulsanNiitTulburiinNiilber += medeelel?.aldangiinUldegdel
        ? medeelel?.aldangiinUldegdel
        : 0;
      kaidudZoriulsanNiitTulburiinNiilber += medeelel.umnukhSariinUrTulbur
        ? medeelel.umnukhSariinUrTulbur
        : 0;

      if (
        zagvar?.khatuuZagvarEsekh &&
        ajiltan?.baiguullagiinId !== "63c0f31efe522048bf02086d"
      )
        kaidudZoriulsanNiitTulburiinNiilber +=
          (medeelel.baritsaaAvakhDun || 0) -
          (medeelel.baritsaaniiUldegdel || 0);

      if (!!zagvar?.nekhemjlekh) {
        medeelel.eneSardTulukhUsgeer = numberToWords(
          medeelel?.eneSardTulukhDun *
            (medeelel?.eneSardTulukhDun < 0 ? -1 : 1),
          { fixed: 2, suffix: "n" },
          "төгрөг",
          "мөнгө"
        );

        medeelel.niitUldegdelUsgeer = numberToWords(
          medeelel?.niitUldegdel * (medeelel?.niitUldegdel < 0 ? -1 : 1),
          { fixed: 2, suffix: "n" },
          "төгрөг",
          "мөнгө"
        );

        medeelel.niitAvlagaUldegdelUsgeer = numberToWords(
          medeelel.niitAvlagaUldegdel *
            (medeelel.niitAvlagaUldegdel < 0 ? -1 : 1),
          { fixed: 2, suffix: "n" },
          "төгрөг",
          "мөнгө"
        );

        medeelel.talbainNiitUneUsgeer = numberToWords(
          medeelel?.talbainNiitUne * (medeelel?.talbainNiitUne < 0 ? -1 : 1),
          { fixed: 2, suffix: "n" },
          "төгрөг",
          "мөнгө"
        );

        medeelel.mungunDunUsgeer = numberToWords(
          medeelel?.sariinTurees * 1,
          { fixed: 2, suffix: "n" },
          "төгрөг",
          "мөнгө"
        );

        const dans = dansGaralt?.jagsaalt?.find(
          (a) => a.dugaar === songogdsonDans
        );
        medeelel.dans = dans?.dugaar;
        medeelel.bank =
          dans?.bank === "khanbank"
            ? "Хаан банк"
            : dans?.bank === "golomt"
            ? "Голомт банк"
            : dans?.bank === "bogd"
            ? "Богд банк"
            : dans?.bank === "tdb"
            ? "Худалдаа хөгжлийн банк"
            : "";
        medeelel.dansniiNer = dans?.dansniiNer;
        medeelel.niitAvlagaUldegdel = formatNumber(
          medeelel.niitAvlagaUldegdel || 0
        );
        medeelel.aldangiinUldegdel = formatNumber(
          medeelel.aldangiinUldegdel || 0
        );
        medeelel.aldangiinUldegdelNuat = formatNumber(
          medeelel.aldangiinUldegdel / 10 || 0
        );
        medeelel.aldangiinUldegdelNuatgui =
          formatNumber(
            medeelel.aldangiinUldegdel - medeelel.aldangiinUldegdelNuat || 0
          ) || "";
        medeelel.albanTushaal = medeelel.albanTushaal || "";
        medeelel.khayag = medeelel.khayag || "";
        medeelel.customerTin = medeelel.customerTin || "";
        medeelel.zakhirliinOvog = medeelel.zakhirliinOvog || "";
        medeelel.zakhirliinNer = medeelel.zakhirliinNer || "";
        medeelel.khayag = medeelel.khayag || "";
        medeelel.talbainNegjUneUsgeer = medeelel.talbainNegjUneUsgeer || "";
        medeelel.talbainNiitUneUsgeer = medeelel.talbainNiitUneUsgeer || "";
        medeelel.zoriulalt = medeelel.zoriulalt || "";
        medeelel.khungulukhKhugatsaa = medeelel.khungulukhKhugatsaa || "";
        medeelel.nemeltNekhemjlekh.tailbar =
          medeelel.nemeltNekhemjlekh.tailbar || "";
        medeelel.nemeltNekhemjlekh.tulukhDun =
          medeelel.nemeltNekhemjlekh.tulukhDun || "";
        medeelel.nemeltNekhemjlekh.ognoo =
          medeelel.nemeltNekhemjlekh.ognoo || "";
        medeelel.nemeltNekhemjlekh = medeelel.nemeltNekhemjlekh || "";
        medeelel.zardliinDun = formatNumber(medeelel.zardliinDun) || "";

        medeelel.sariinTurees = formatNumber(medeelel.sariinTurees);
        medeelel.eneSardTulukhDun = formatNumber(medeelel.eneSardTulukhDun);
        medeelel.niitUldegdelNuat = (medeelel.niitUldegdel / 1.1) * 0.1;
        medeelel.niitUldegdelNuatgui = formatNumber(
          medeelel.niitUldegdel - medeelel.niitUldegdelNuat
        );
        medeelel.niitUldegdelNuat = formatNumber(medeelel.niitUldegdelNuat);
        // medeelel.niitUldegdel = formatNumber(medeelel.niitUldegdel);
        medeelel.talbainNegjUne = formatNumber(medeelel.talbainNegjUne);
        medeelel.talbainNiitUneNuat = (medeelel.talbainNiitUne / 1.1) * 0.1;
        medeelel.talbainNiitUneNuatgui = formatNumber(
          medeelel.talbainNiitUne - medeelel.talbainNiitUneNuat
        );
        medeelel.talbainNiitUneNuat = formatNumber(medeelel.talbainNiitUneNuat);
        medeelel.talbainNiitUne = formatNumber(
          medeelel.talbainNiitUne - medeelel.khungulult
        );
        medeelel.khungulsunTalbainNiitUne = formatNumber(
          khungulsunTalbainNiitUne || 0
        );
        medeelel.khungulsunTalbainNiitUneNuat = formatNumber(
          khungulsunTalbainNiitUneNuat || 0
        );
        medeelel.khungulsunTalbainNiitUneNuatgui = formatNumber(
          khungulsunTalbainNiitUneNuatgui || 0
        );
        medeelel.khungulult = formatNumber(medeelel.khungulult);

        medeelel.gariinUseg = renderToString(
          <span>
            <img
              src={`${url}/file?path=gariinUseg/${barilga.gariinUseg}`}
              style={{
                width: 100,
                height: 50,
                transform: "translate(10%, -30%)",
              }}
            />
          </span>
        );
        medeelel.tamga = renderToString(
          <span style={{ position: "absolute", zIndex: 1 }}>
            <img
              src={`${url}/file?path=tamga/${barilga.tamga}`}
              style={{
                width: 115,
                height: 100,
                transform: "translate(-10%, -50%)",
                opacity: 0.65,
              }}
            />
          </span>
        );
        medeelel.khuviinTamga = renderToString(
          <span style={{ position: "absolute", zIndex: 1 }}>
            <img
              src={"/Tamga1.png"}
              style={{
                width: 250,
                height: 150,
                transform: "translate(-10%, -50%)",
                opacity: 0.65,
              }}
            />
          </span>
        );

        medeelel.signature1 = renderToString(
          <span style={{ position: "absolute" }}>
            <img
              src={"/signature1.png"}
              style={{
                width: 320,
                height: 85,
                transform: "translate(-45%, -45%)",
              }}
            />
          </span>
        );

        medeelel.signature2 = renderToString(
          <span style={{ position: "absolute" }}>
            <img
              src={"/signature2.png"}
              style={{
                width: 330,
                height: 135,
                transform: "translate(-28%, -44%)",
              }}
            />
          </span>
        );

        medeelel.umnukhSariinUrTulbur = formatNumber(
          medeelel.umnukhSariinUrTulbur
        );
        medeelel.umnukhSariinUrTulburNuat = formatNumber(
          medeelel.umnukhSariinUrTulbur / 10 || 0
        );
        medeelel.umnukhSariinUrTulburNuatgui = formatNumber(
          medeelel.umnukhSariinUrTulbur - medeelel.umnukhSariinUrTulburNuat || 0
        );

        medeelel.baritsaaUldegdel = formatNumber(
          (medeelel.baritsaaAvakhDun || 0) - (medeelel.baritsaaniiUldegdel || 0)
        );
        medeelel.baritsaaUldegdelNuat = formatNumber(
          medeelel.baritsaaUldegdel / 10 || 0
        );
        medeelel.baritsaaUldegdelNuatgui = formatNumber(
          medeelel.baritsaaUldegdel - medeelel.baritsaaUldegdelNuat || 0
        );

        medeelel.khevlesenOgnoo = moment(ognoo).format("YYYY-MM-DD");

        medeelel.niitAshiglaltiinZardal =
          formatNumber(medeelel.niitAshiglaltiinZardal) || "";

        medeelel.sar = moment().format("MM");
        medeelel.ekhlekhOn = moment(ognoo).format("YYYY");
        medeelel.ekhelkhSar = moment(ognoo).format("MM");
        medeelel.ekhlekhUdur = moment(ognoo).format("DD");
        medeelel.duusakhOn = moment(ognoo).format("YYYY");
        medeelel.duusakhSar = moment(ognoo).format("MM");
        medeelel.duusakhUdur = moment(ognoo)
          .set(
            "date",
            data.barilgiinId === "6735c77a7fc60cd66deb290a" ||
              data.barilgiinId === "67512183c60497546f59513a"
              ? 20
              : 15
          )
          .format("DD");
        medeelel.eneEkhlehUdur = moment(ognoo)
          .startOf("month")
          .format("YYYY/MM/DD");
        medeelel.eneDuusakhUdur = moment(ognoo)
          .endOf("month")
          .format("YYYY/MM/DD");

        medeelel.nekhemjlekhiinDugaar =
          moment().format("YY") + "/" + (dugaarlalt + 1);

        for (const [key, value] of Object.entries(medeelel)) {
          if (key !== "nemeltNekhemjlekh") {
            if (value !== undefined && value !== null) {
              zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
                new RegExp(`&lt;${key}&gt;`, "g"),
                value
              );
            } else {
              zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
                new RegExp(`&lt;${key}&gt;`, "g"),
                ""
              );
            }
          }
        }
        var zuruuDun = 0;
        var tseverusDun = 0;
        var boxirusDun = 0;
        var usxalaasniitulburDun = 0;
        var niilberDun = 0;
        medeelel?.zardluud?.map((a) => {
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.tailbar}.khemjikhNegj&gt;`, "g"),
            a.khemjikhNegj || ""
          );

          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.tailbar}.tulukhDun&gt;`, "g"),
            formatNumber(a.tulukhDun || 0)
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.tailbar}.tulukhDunNuat&gt;`, "g"),
            formatNumber(a.tulukhDun / 10 || 0)
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.tailbar}.tulukhDunNuattai&gt;`, "g"),
            formatNumber(a.tulukhDun * 1.1 || 0)
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.tailbar}.tulukhDunNuatgui&gt;`, "g"),
            a?.tulukhDun
              ? formatNumber(a?.tulukhDun - a.tulukhDun / 10 || 0)
              : " "
          );
          let khungulultKhassanTulukhDun = a.tulukhDun
            ? a.khungulult
              ? a.tulukhDun - a.khungulult
              : a.tulukhDun
            : 0;
          let khungulultKhassanTulukhDunNuat = a.tulukhDun
            ? khungulultKhassanTulukhDun / 11
            : 0;
          let khungulultKhassanTulukhDunNuatgui = a.tulukhDun
            ? khungulultKhassanTulukhDun - khungulultKhassanTulukhDunNuat
            : 0;

          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.tailbar}.khungulultKhassanTulukhDun&gt;`, "g"),
            formatNumber(khungulultKhassanTulukhDun || 0)
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(
              `&lt;${a.tailbar}.khungulultKhassanTulukhDunNuat&gt;`,
              "g"
            ),
            formatNumber(khungulultKhassanTulukhDunNuat || 0)
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(
              `&lt;${a.tailbar}.khungulultKhassanTulukhDunNuatgui&gt;`,
              "g"
            ),
            formatNumber(khungulultKhassanTulukhDunNuatgui || 0)
          );

          if (
            a.tailbar?.includes("Цахилгаан") ||
            a.tailbar?.includes("Халуун ус") ||
            a.tailbar?.includes("Хүйтэн ус")
          )
            a.tariff = ashiglaltiinZardal?.jagsaalt
              ?.filter((b) => b.ner === a.tailbar)
              .map((b) => b.tariff);

          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.tailbar}.tariff&gt;`, "g"),
            formatNumber(a.tariff || 0)
          );

          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.tailbar}.negj&gt;`, "g"),
            formatNumber(a.negj || 0) || ""
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.tailbar}.suuliinZaalt&gt;`, "g"),
            formatNumber(a.suuliinZaalt || 0) || ""
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.tailbar}.umnukhZaalt&gt;`, "g"),
            formatNumber(a.umnukhZaalt || 0) || ""
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.tailbar}.khungulult&gt;`, "g"),
            formatNumber(a.khungulult || 0) || ""
          );

          // { tailbar : "Халуун ус", umnukhzaalt, suuliin zaalt, dun, nuat, boxirus, tseverus, usxalaasniitulbur }
          // { tailbar : "Хүйтэн ус", umnukhzaalt, suuliin zaalt, dun, nuat, boxirus, tseverus, usxalaasniitulbur }
          if (
            a.tailbar?.includes("Цахилгаан") ||
            a.tailbar?.includes("Халуун ус") ||
            a.tailbar?.includes("Хүйтэн ус")
          ) {
            a.zuruuZaalt = (a.suuliinZaalt || 0) - (a.umnukhZaalt || 0);
            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;${a.tailbar}.zuruuZaalt&gt;`, "g"),
              formatNumber(a.zuruuZaalt || 0) || ""
            );
            if (a.tailbar?.includes("Цахилгаан")) {
              a.tsakhilgaanUrjver = ashiglaltiinZardal?.jagsaalt
                ?.filter((b) => b.ner === a.tailbar)
                .map((b) => b.tsakhilgaanUrjver);
              zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
                new RegExp(`&lt;${a.tailbar}.tsakhilgaanUrjver&gt;`, "g"),
                formatNumber(a.tsakhilgaanUrjver || 0) || ""
              );
            }

            if (a.tailbar?.includes("Халуун ус") || a.tailbar?.includes("Хүйтэн ус")) {
              a.tseverusTariff = ashiglaltiinZardal?.jagsaalt
                ?.filter((b) => b.ner === a.tailbar)
                .map((b) => b.tseverUsDun);
              a.boxirusTariff = ashiglaltiinZardal?.jagsaalt
                ?.filter((b) => b.ner === a.tailbar)
                .map((b) => b.bokhirUsDun);
              a.usxalaasniitulburTariff =
                a.tailbar?.includes("Хүйтэн ус")
                  ? 0
                  : ashiglaltiinZardal?.jagsaalt
                      ?.filter((b) => b.ner === a.tailbar)
                      .map((b) => b.usKhalaasniiDun);

              zuruuDun += a.zuruuZaalt;
              tseverusDun += a.zuruuZaalt * a.tseverusTariff; // Халуун ус + Хүйтэн ус
              boxirusDun += a.zuruuZaalt * a.boxirusTariff; // Халуун ус + Хүйтэн ус
              usxalaasniitulburDun +=
                a.tailbar?.includes("Хүйтэн ус")
                  ? 0
                  : a.zuruuZaalt * a.usxalaasniitulburTariff; // Халуун ус
              // niilberDun += a.zuruuZaalt * a.tseverusTariff + a.zuruuZaalt * a.boxirusTariff + (a.tailbar?.includes("Хүйтэн ус") ? 0 : (a.zuruuZaalt * a.usxalaasniitulburTariff))
              niilberDun += a.tulukhDun;

              zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
                new RegExp(`&lt;${a.tailbar}.tseverusTariff&gt;`, "g"),
                formatNumber(a.tseverusTariff || 0) || ""
              );
              zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
                new RegExp(`&lt;${a.tailbar}.boxirusTariff&gt;`, "g"),
                formatNumber(a.boxirusTariff || 0) || ""
              );
              zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
                new RegExp(`&lt;${a.tailbar}.usxalaasniitulburTariff&gt;`, "g"),
                formatNumber(a.usxalaasniitulburTariff || 0) || ""
              );
            }
          }

          kaidudZoriulsanNiitTulburiinNiilber += khungulultKhassanTulukhDun;
        });
        medeelel.zuruuDun = zuruuDun;
        medeelel.tseverusDun = tseverusDun;
        medeelel.boxirusDun = boxirusDun;
        medeelel.usxalaasniitulburDun = usxalaasniitulburDun;
        medeelel.niilberDun = niilberDun;

        zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
          new RegExp(`&lt;zuruuDun&gt;`, "g"),
          formatNumber(medeelel.zuruuDun || 0)
        );

        zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
          new RegExp(`&lt;tseverusDun&gt;`, "g"),
          formatNumber(medeelel.tseverusDun || 0)
        );

        zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
          new RegExp(`&lt;boxirusDun&gt;`, "g"),
          formatNumber(medeelel.boxirusDun || 0)
        );

        zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
          new RegExp(`&lt;usxalaasniitulburDun&gt;`, "g"),
          formatNumber(medeelel.usxalaasniitulburDun || 0)
        );

        zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
          new RegExp(`&lt;niilberDun&gt;`, "g"),
          formatNumber(medeelel.niilberDun || 0)
        );

        ashiglaltiinZardal?.jagsaalt?.map((a) => {
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.khemjikhNegj&gt;`, "g"),
            ""
          );

          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.tulukhDun&gt;`, "g"),
            0
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.tulukhDunNuat&gt;`, "g"),
            0
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.tulukhDunNuattai&gt;`, "g"),
            0
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.tulukhDunNuatgui&gt;`, "g"),
            0
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.khungulultKhassanTulukhDun&gt;`, "g"),
            0
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.khungulultKhassanTulukhDunNuat&gt;`, "g"),
            0
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(
              `&lt;${a.ner}.khungulultKhassanTulukhDunNuattai&gt;`,
              "g"
            ),
            0
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(
              `&lt;${a.ner}.khungulultKhassanTulukhDunNuatgui&gt;`,
              "g"
            ),
            0
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.tariff&gt;`, "g"),
            0
          );

          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.negj&gt;`, "g"),
            0
          );

          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.suuliinZaalt&gt;`, "g"),
            0
          );

          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.umnukhZaalt&gt;`, "g"),
            0
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;${a.ner}.khungulult&gt;`, "g"),
            0
          );
        });
        if (medeelel?.zardluud?.length > 0) {
          const niitZardliinDun = medeelel?.zardluud.reduce(
            (a, b) => a + b.tulukhDun,
            0
          );
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;niitZardliinDun&gt;`, "g"),
            formatNumber(niitZardliinDun || 0)
          );
          let niitZardliinNoutiinDun = (niitZardliinDun / 1.1) * 0.1;

          let niitZardliinNoutguiDun = niitZardliinDun - niitZardliinNoutiinDun;
          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;niitZardliinNuatguiDun&gt;`, "g"),
            formatNumber(niitZardliinNoutguiDun || 0)
          );

          zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
            new RegExp(`&lt;niitZardliinNuatiinDun&gt;`, "g"),
            formatNumber(niitZardliinNoutiinDun || 0)
          );
        }
        let garaasBodsonNiitDun = kaidudZoriulsanNiitTulburiinNiilber;
        console.log("garaasBodsonNiitDun ", garaasBodsonNiitDun);
        let garaasBodsonNiitDunNuat = garaasBodsonNiitDun / 10;
        let garaasBodsonNiitDunNuatgui = formatNumber(
          garaasBodsonNiitDun - garaasBodsonNiitDunNuat || 0
        );
        zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
          new RegExp(`&lt;garaasBodsonNiitDun&gt;`, "g"),
          formatNumber(garaasBodsonNiitDun || 0)
        );
        zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
          new RegExp(`&lt;garaasBodsonNiitDunNuatgui&gt;`, "g"),
          garaasBodsonNiitDunNuatgui
        );
        zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
          new RegExp(`&lt;garaasBodsonNiitDunUsgeer&gt;`, "g"),
          capitalize(
            `${toWords(Math.abs(garaasBodsonNiitDun), {
              fixed: 2,
              suffix: "n",
            })} төгрөг`
          )
        );

        zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
          new RegExp(`&lt;garaasBodsonNiitDunNuat&gt;`, "g"),
          formatNumber(garaasBodsonNiitDunNuat || 0)
        );
        let nemeltNekhemjlekh = "";
        if (medeelel.hasOwnProperty("nemeltNekhemjlekh")) {
          medeelel.nemeltNekhemjlekh.forEach((a, index) => {
            let mur = `<tr><td><div style="text-align: center"><span class="se-custom-tag">${
              2 + (index + 1)
            }</span>​​<br /></div></td><td colspan="4" rowspan="1"><div>​<span class="se-custom-tag">&lt;nemeltNekhemjlekh.tailbar&gt;</span>​​<br /></div></td><td colspan="5" rowspan="1"><div>​<span class="se-custom-tag">&lt;nemeltNekhemjlekh.ognoo&gt;</span>​​<br /></div></td><td colspan="2" rowspan="1"><div style="text-align: right"><span class="se-custom-tag">&lt;nemeltNekhemjlekh.tulukhDun&gt;</span>​​<br /></div></td></tr>`;
            a.ognoo = moment(a.ognoo).format("YYYY-MM-DD");
            a.tulukhDun = formatNumber(a.tulukhDun);
            for (const [key, value] of Object.entries(a)) {
              mur = mur?.replace(
                new RegExp(`&lt;nemeltNekhemjlekh.${key}&gt;`, "g"),
                value
              );
            }
            nemeltNekhemjlekh += mur;
          });
        }
        zagvar.nekhemjlekhr = zagvar?.nekhemjlekh?.replace(
          new RegExp(
            `<tr><td colspan="12" rowspan="1"><div>​<span class="se-custom-tag">&lt;nemeltNekhemjlekh&gt;</span>​​<br></div></td></tr>`
          ),
          nemeltNekhemjlekh
        );
      }
    }
    return {
      zagvar: zagvar?.nekhemjlekhr,
      mail: medeelel?.mail,
      medeelel: medeelel,
      zagvariinNer: zagvar?.ner,
    };
  }, [barimt, nekhemjleliinJagsaalt, nekhemjlel, ashiglaltiinZardal]);

  function maileerIlgeekh() {
    if (!barimt) {
      message.warning(t("Нэхэмжлэхийн төрөл сонгоно уу"));
      return;
    }
    if (loading) {
      message.warning(t("И-мэйл илгээгдсэн байна"));
      return;
    }
    var mailuud = [];
    mailuud.push({
      mail: nekhemjlekh.mail,
      content: nekhemjlekh.zagvar,
    });
    data.maililgeesenAjiltniiId = ajiltan.id;
    data.maililgeesenAjiltniiNer = ajiltan.ner;
    data.nekhemjlekhiinZagvarId = barimt;
    data.tsonkhniiNer = "Гүйлгээний түүх";
    data.medeelel = nekhemjlekh.medeelel;
    data.nekhemjlekh = nekhemjlekh.zagvar;
    data.zagvariinNer = nekhemjlekh.zagvariinNer;
    const tempGereenuud = [];
    tempGereenuud.push(data);
    setLoading(true);
    uilchilgee(token)
      .post(`/mailOlnoorIlgeeye`, {
        mailuud,
        subject: "Түрээсийн төлбөр",
        gereenuud: tempGereenuud,
      })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("И-мэйл Амжилттай илгээлээ") });
          setLoading(false);
          destroy();
        }
      })
      .catch((e) => {
        setLoading(false);
        aldaaBarigch(e);
      });
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {},
  });
  function hevlekh() {
    if (!songogdsonDans) {
      message.warning(t("Данс сонгоно уу"));
      return;
    }
    if (!barimt) {
      message.warning(t("Нэхэмжлэхийн төрөл сонгоно уу"));
      return;
    }
    handlePrint();
  }

  function garya() {
    if (songogdsonDans !== undefined || barimt !== undefined)
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: destroy,
      });
    else destroy();
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
  }, [songogdsonDans, barimt]);

  useEffect(() => {
    document.getElementById("dansniiTurul").focus();
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      khevlekh() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        uilchilgee(token)
          .then(() => {
            notification.success({
              message: t("Амжилттай"),
            });
            destroy();
          })
          .catch(aldaaBarigch);
      },
    }),
    []
  );

  return (
    <div className=" flex flex-col space-y-3">
      <div className="grid w-full grid-cols-2" ref={printRef}>
        <div
          key={`khevlekhNekhemjlel${nekhemjlekh}`}
          className="print a5 sun-editor-editable p-10"
          dangerouslySetInnerHTML={{ __html: nekhemjlekh.zagvar }}
        />
      </div>
      <DatePicker
        value={ognoo}
        onChange={(v) => {
          setOgnoo(v);
          document.getElementById("dansniiTurul").focus();
        }}
      />
      <Select
        id="dansniiTurul"
        placeholder={t("Дансны төрөл")}
        onChange={(v) => {
          setDans(v);
          document.getElementById("nekhemjlekhTurul").focus();
        }}
      >
        {dansGaralt?.jagsaalt?.map((a) => (
          <Select.Option key={a.dugaar} value={a.dugaar}>
            <div>{a.dugaar}</div>
          </Select.Option>
        ))}
      </Select>

      <Select
        id="nekhemjlekhTurul"
        placeholder={t("Нэхэмжлэхийн төрөл")}
        onChange={(v) => {
          setBarimt(v);
          document.getElementById("nekhemjlelIlgeekhButton").focus();
        }}
      >
        {nekhemjlekhiinZagvar?.jagsaalt?.map((a) => (
          <Select.Option key={a._id} value={a._id}>
            {a.ner}
          </Select.Option>
        ))}
      </Select>
      <div className="flex w-full justify-between">
        <Button onClick={khaaya}>{t("Хаах")}</Button>
        <div className="flex gap-2">
          <Button onClick={hevlekh}>{t("Хэвлэх")}</Button>
          <Button
            type="primary"
            id="nekhemjlelIlgeekhButton"
            onClick={maileerIlgeekh}
          >
            {t("Нэхэмжлэл илгээх")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(GuilgeeKhiikh);
