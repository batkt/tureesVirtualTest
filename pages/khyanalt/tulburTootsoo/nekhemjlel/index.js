import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  DatePicker,
  Table,
  Button,
  Select,
  message,
  Popconfirm,
  Spin,
  notification,
  Switch,
} from "antd";
import {
  EditOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import router from "next/router";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import useNekhemjlekh from "hooks/tulburTootsoo/useNekhemjlekh";
import useNekhemjlekhiinZagvar from "hooks/tulburTootsoo/useNekhemjlekhiinZagvar";
import useNekhemjlekhDugaarlalt from "hooks/tulburTootsoo/useNekhemjlekhDugaarlalt";
import _ from "lodash";
import { useReactToPrint } from "react-to-print";
import DunZasvar from "components/pageComponents/nekhemjlel/DunZasvar";
import { modal } from "components/ant/Modal";
import { useAuth } from "services/auth";
import deleteMethod from "tools/function/crud/deleteMethod";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import Aos from "aos";
import { renderToString } from "react-dom/server";
import ZagvarUusgekh from "components/pageComponents/nekhemjlel/ZagvarUusgekh";
import AppSmsZagvar from "components/pageComponents/nekhemjlel/AppSmsZagvar";
import numberToWords from "tools/function/numberToWords";
import useDans from "hooks/useDans";
import useJagsaalt from "hooks/useJagsaalt";
import { useTranslation } from "react-i18next";
import khatuuZagvar from "tools/zagvar/tur";
import khatuuZagvarKaidu from "tools/zagvar/turKaidu";
import khatuuZagvarUranGan from "tools/zagvar/turUranGan";
import khatuuZagvarFoodCity from "tools/zagvar/turFoodCityTemp";
import khatuuZagvarGotoMPM from "tools/zagvar/turGotoMPM";
import khatuuZagvarGotoMT from "tools/zagvar/turGotoMT";
import khatuuZagvarSoyoljMall from "tools/zagvar/turSoyoljMall";

const ilgeekhTurul = "davkharaar";

function tulburTootsoo({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const printRef = React.useRef(null);
  const printExcelRef = React.useRef(null);
  const dunZasvarRef = React.useRef(null);
  const { baiguullaga, barilgiinId, ajiltan } = useAuth();
  const ref = useRef(null);
  const [ognoo, setOgnoo] = React.useState(moment());
  const { t } = useTranslation();
  const [davkhar, setDavkhar] = React.useState();
  const [turul, setTurul] = useState("Mail");
  const [barimt, setBarimt] = useState();
  const [msj, onTextChange] = useState("");
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [nekhemjleliinJagsaalt, setNekhemjleliinJagsaalt] = React.useState([]);
  const [songogdsonDans, setDans] = React.useState();
  const [olnoorSaraarEsekh, setOlnoorSaraarEsekh] = useState(false);
  const { nekhemjlel, setNekhemjlelKhuudaslalt, isValidating } = useNekhemjlekh(
    token,
    ognoo,
    davkhar,
    ilgeekhTurul,
    olnoorSaraarEsekh
  );
  const [tatsanExcelZagvar, setTatsanExcelZagvar] = useState(null);
  const { dansGaralt } = useDans(token, baiguullaga?._id);
  const { nekhemjlekhiinZagvar, nekhemjlekhiinZagvarMutate } =
    useNekhemjlekhiinZagvar(token);
  const ashiglaltiinZardal = useJagsaalt("/ashiglaltiinZardluud", {
    barilgiinId: barilgiinId,
  });

  const { dugaarlalt, dugaarlaltMutate, dugaarlaltKhadgalya } =
    useNekhemjlekhDugaarlalt(token);
  const [songogdsonGereenuud, setSongogdsonGereenuud] = React.useState([]);
  const [excelZagvarSongogdson, setExcelZagvarSongogdson] =
    React.useState(false);
  const [songogdsonZagvar, setSongogdsonZagvar] = React.useState();
  const [unshijBaina, setUnshijBaina] = React.useState(false);
  useEffect(() => {
    if (!!nekhemjlel) setNekhemjleliinJagsaalt([...nekhemjlel?.jagsaalt]);
  }, [nekhemjlel]);

  useEffect(() => {
    barilgiinId;
    setBarimt(undefined);
    setDans(undefined);
    setSongogdsonGereenuud([]);
  }, [barilgiinId]);

  useEffect(() => {
    setSongogdsonGereenuud([]);
  }, [ognoo]);

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function smsZagvarNemya(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>{t("Хаах")}</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => ref.current.khadgalya(setWaiting(true))}
      >
        {t("Бүртгэл нэмэх")}
      </Button>,
    ];
    modal({
      title: `${turul} ${t("Загвар үүсгэх")}`,
      icon: <FileExcelOutlined />,
      content: (
        <AppSmsZagvar
          ref={ref}
          setWaiting={setWaiting}
          data={data}
          token={token}
          turul={turul}
          barilgiinId={barilgiinId}
          ashiglaltiinZardal={ashiglaltiinZardal}
          onRefresh={nekhemjlekhiinZagvarMutate}
        />
      ),
      footer,
    });
  }

  const nekhemjlekhuud = useMemo(() => {
    if (barimt && songogdsonGereenuud)
      return songogdsonGereenuud
        ?.filter((a) => !!nekhemjleliinJagsaalt?.find((n) => n._id === a))
        ?.map((a, i) => {
          var zagvar = _.cloneDeep(
            nekhemjlekhiinZagvar?.jagsaalt?.find((a) => a._id === barimt)
          );
          const medeelel = _.cloneDeep(
            nekhemjleliinJagsaalt.find((n) => n._id === a)
          );
          const barilga = baiguullaga?.barilguud?.find(
            (a) => a._id === medeelel?.barilgiinId
          );
          if (zagvar?.khatuuZagvarEsekh) {
            if (
              ajiltan?.baiguullagiinId === "63c0f31efe522048bf02086d" &&
              barilgiinId === "6659717af6cab41f3ec723b5"
            )
              // foodcity
              zagvar.nekhemjlekh = khatuuZagvarFoodCity(
                medeelel,
                ajiltan,
                baiguullaga
              );
            else if (
              ajiltan?.baiguullagiinId === "6735c77a7fc60cd66deb2909" &&
              barilgiinId === "67512183c60497546f59513a"
            )
              // goto MPM
              zagvar.nekhemjlekh = khatuuZagvarGotoMPM(
                medeelel,
                ajiltan,
                baiguullaga,
                barilgiinId
              );
            else if (
              (ajiltan?.baiguullagiinId === "6731b43bc23730ac1908da2d" &&
                barilgiinId === "6731b43bc23730ac1908da2e") ||
              (ajiltan?.baiguullagiinId === "6115f350b35689cdbf1b9da3" &&
                (barilgiinId === "622ec99a8e64e5b4f0c3acb6" ||
                  barilgiinId === "619e267fdd4835aa2c168b28" ||
                  barilgiinId === "657955ac70280a9ebe8f11ef")) ||
              (ajiltan?.baiguullagiinId === "612f457d185280db676d0b51" &&
                barilgiinId === "633e52ba9e57e626978b7c47")
            )
              // soyoljMall
              zagvar.nekhemjlekh = khatuuZagvarSoyoljMall(
                medeelel,
                ajiltan,
                baiguullaga,
                barilga,
                barilgiinId
              );
            else if (
              ajiltan?.baiguullagiinId === "6735c77a7fc60cd66deb2909" &&
              barilgiinId === "6735c77a7fc60cd66deb290a"
            )
              // goto MT
              zagvar.nekhemjlekh = khatuuZagvarGotoMT(
                medeelel,
                ajiltan,
                baiguullaga,
                barilgiinId
              );
            else if (ajiltan?.baiguullagiinId === "679aea9032299b7ba8462a77")
              // urangan
              zagvar.nekhemjlekh = khatuuZagvarUranGan(
                medeelel,
                ajiltan,
                baiguullaga,
                barilga,
                barilgiinId
              );
            else if (
              ajiltan?.barilgiinId === "6544bf602143a024b43f16ab" ||
              ajiltan?.baiguullagiinId === "64e855ce37fdc9b105f936e0"
            )
              // kaidu
              zagvar.nekhemjlekh = khatuuZagvarKaidu(
                medeelel,
                ajiltan,
                baiguullaga,
                barilgiinId
              );
            else
              zagvar.nekhemjlekh = khatuuZagvar(
                medeelel,
                ajiltan,
                baiguullaga,
                barilgiinId
              );
          }

          let khungulsunTalbainNiitUne =
            medeelel.talbainNiitUne - (medeelel.khungulult || 0);

          var niilberDunGoto =
            (medeelel.umnukhSariinUrTulbur || 0) +
            (medeelel?.aldangiinUldegdel || 0);
          niilberDunGoto +=
            (medeelel.baritsaaAvakhDun || 0) -
            (medeelel.baritsaaniiUldegdel || 0) +
            khungulsunTalbainNiitUne;

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
          if (ajiltan?.baiguullagiinId === "679aea9032299b7ba8462a77") {
            // Urangan
            medeelel.umnukhSariinUldegdel =
              (medeelel.umnukhSariinUrTulbur || 0) +
              (medeelel?.aldangiinUldegdel || 0);
            medeelel.umnukhSariinUldegdelNUAT =
              (medeelel.umnukhSariinUldegdel / 1.1) * 0.1;
            medeelel.umnukhSariinUldegdelNUATgui =
              medeelel.umnukhSariinUldegdel - medeelel.umnukhSariinUldegdelNUAT;
            medeelel.umnukhSariinUldegdel = formatNumber(
              medeelel.umnukhSariinUldegdel || 0
            );
            medeelel.umnukhSariinUldegdelNUAT = formatNumber(
              medeelel.umnukhSariinUldegdelNUAT || 0
            );
            medeelel.umnukhSariinUldegdelNUATgui = formatNumber(
              medeelel.umnukhSariinUldegdelNUATgui || 0
            );
            let uranganTureesNiitDun = khungulsunTalbainNiitUne;
            medeelel.uranganTureesNiitDun = formatNumber(
              uranganTureesNiitDun || 0
            );
            medeelel.uranganTureesNiitDunUsgeer = numberToWords(
              uranganTureesNiitDun,
              { fixed: 2, suffix: "n" },
              "төгрөг",
              "мөнгө"
            );
          }
          if (
            ajiltan?.baiguullagiinId === "6115f350b35689cdbf1b9da3" &&
            barilgiinId === "622ec99a8e64e5b4f0c3acb6"
          )
            // ikhnayd zuun undur
            medeelel.barilgiinlogo = renderToString(
              <span>
                <img
                  src={`/logo_ikhnayd.jpg`}
                  style={{
                    width: 150,
                    height: 100,
                    transform: "translate(15%, 15%)",
                    opacity: 0.65,
                  }}
                />
              </span>
            );
          // urangan
          else
            medeelel.barilgiinlogo = renderToString(
              <span>
                <img
                  src={`${url}/file?path=logo/${barilga.logo}`}
                  style={{
                    width: 200,
                    height: 50,
                    transform: "translate(5%, -80%)",
                    opacity: 0.65,
                  }}
                />
              </span>
            );
          if (
            zagvar?.khatuuZagvarEsekh &&
            ajiltan?.baiguullagiinId !== "63c0f31efe522048bf02086d" &&
            ajiltan?.baiguullagiinId !== "679aea9032299b7ba8462a77"
          )
            // foodctiy and urangan
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
              medeelel?.talbainNiitUne *
                (medeelel?.talbainNiitUne < 0 ? -1 : 1),
              { fixed: 2, suffix: "n" },
              "төгрөг",
              "мөнгө"
            );

            medeelel.mungunDunUsgeer = numberToWords(
              medeelel?.sariinTurees,
              { fixed: 2, suffix: "n" },
              "төгрөг",
              "мөнгө"
            );
            const dans = dansGaralt?.jagsaalt?.find(
              (a) => a.dugaar === songogdsonDans
            );
            medeelel.dans = dans?.ibanDugaar ? dans.ibanDugaar : dans?.dugaar;
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
            medeelel.ibanDugaar = dans?.ibanDugaar;
            medeelel.niitAvlagaUldegdel = formatNumber(
              medeelel.niitAvlagaUldegdel || 0
            );
            medeelel.aldangiinUldegdel = medeelel.aldangiinUldegdel || 0;
            medeelel.aldangiinUldegdelNuat =
              ((medeelel.aldangiinUldegdel || 0) / 1.1) * 0.1;
            medeelel.aldangiinUldegdelNuatgui = formatNumber(
              medeelel.aldangiinUldegdel - medeelel.aldangiinUldegdelNuat || 0
            );
            medeelel.aldangiinUldegdelNuat = formatNumber(
              medeelel.aldangiinUldegdelNuat || 0
            );
            medeelel.aldangiinUldegdel = formatNumber(
              medeelel.aldangiinUldegdel || 0
            );

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
            medeelel.niitUldegdel = formatNumber(medeelel.niitUldegdel);
            medeelel.talbainNegjUne = formatNumber(medeelel.talbainNegjUne);
            medeelel.talbainNiitUneNuat = (medeelel.talbainNiitUne / 1.1) * 0.1;
            medeelel.talbainNiitUneNuatgui = formatNumber(
              medeelel.talbainNiitUne - medeelel.talbainNiitUneNuat
            );
            medeelel.talbainNiitUneNuat = formatNumber(
              medeelel.talbainNiitUneNuat
            );
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
              <span style={{ position: "absolute" }}>
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
            if (ajiltan?.baiguullagiinId === "6735c77a7fc60cd66deb2909") {
              // goto
              medeelel.tamga = renderToString(
                <span style={{ position: "absolute", zIndex: 1 }}>
                  <img
                    src={`${url}/file?path=tamga/${barilga.tamga}`}
                    style={{
                      width: 200,
                      height: 160,
                      transform: "translate(5%, -80%)",
                      opacity: 0.65,
                    }}
                  />
                </span>
              );
            } else if (ajiltan?.baiguullagiinId === "6731b43bc23730ac1908da2d")
              // soyolj
              medeelel.tamga = renderToString(
                <span style={{ position: "absolute", zIndex: 1 }}>
                  <img
                    src={`${url}/file?path=tamga/${barilga.tamga}`}
                    style={{
                      width: 180,
                      height: 130,
                      transform: "translate(-10%, -50%)",
                      opacity: 0.65,
                    }}
                  />
                </span>
              );
            else
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

            medeelel.umnukhSariinUrTulburNuat =
              ((medeelel.umnukhSariinUrTulbur || 0) / 1.1) * 0.1;
            medeelel.umnukhSariinUrTulburNuatgui = formatNumber(
              (medeelel.umnukhSariinUrTulbur || 0) -
                (medeelel.umnukhSariinUrTulburNuat || 0)
            );
            medeelel.umnukhSariinUrTulburNuat = formatNumber(
              medeelel.umnukhSariinUrTulburNuat
            );
            medeelel.umnukhSariinUrTulbur = formatNumber(
              medeelel.umnukhSariinUrTulbur
            );
            medeelel.baritsaaUldegdel =
              (medeelel.baritsaaAvakhDun || 0) -
              (medeelel.baritsaaniiUldegdel || 0);
            medeelel.baritsaaUldegdelNuat =
              ((medeelel.baritsaaUldegdel || 0) / 1.1) * 0.1;
            medeelel.baritsaaUldegdelNuatgui = formatNumber(
              medeelel.baritsaaUldegdel - medeelel.baritsaaUldegdelNuat || 0
            );

            medeelel.baritsaaUldegdelNuat = formatNumber(
              medeelel.baritsaaUldegdelNuat
            );

            medeelel.baritsaaUldegdel = formatNumber(medeelel.baritsaaUldegdel);

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
                barilgiinId === "6731b43bc23730ac1908da2e"
                  ? 10
                  : barilgiinId === "6735c77a7fc60cd66deb290a" ||
                    barilgiinId === "67512183c60497546f59513a"
                  ? 20
                  : 15
              )
              .format("DD");

            if (ajiltan?.baiguullagiinId === "679aea9032299b7ba8462a77") {
              medeelel.tureesEkhlehUdur = moment(ognoo)
                .startOf("month")
                .format("YYYY.MM.DD");
              medeelel.tureesDuusakhUdur = moment(ognoo)
                .endOf("month")
                .format("YYYY.MM.DD");
              medeelel.khevlesenOgnoo = moment(ognoo).format("YYYY/MM/DD");
              medeelel.sar = moment(ognoo).format("MM");
              medeelel.umnukhSar = moment(ognoo)
                .subtract(1, "month")
                .format("MM");
            } else {
              medeelel.tureesEkhlehUdur = moment(ognoo)
                .add(1, "month")
                .startOf("month")
                .format("MM/DD");
              medeelel.tureesDuusakhUdur = moment(ognoo)
                .add(1, "month")
                .endOf("month")
                .format("MM/DD");
              medeelel.ashiglaltEkhlehUdur = moment(ognoo)
                .subtract(1, "month")
                .startOf("month")
                .format("MM/DD");
              medeelel.ashiglaltDuusakhUdur = moment(ognoo)
                .subtract(1, "month")
                .endOf("month")
                .format("MM/DD");
            }
            medeelel.eneEkhlehUdur = moment(ognoo)
              .startOf("month")
              .format("YYYY/MM/DD");
            medeelel.eneDuusakhUdur = moment(ognoo)
              .endOf("month")
              .format("YYYY/MM/DD");

            medeelel.KhhurunguEkhlekhUdur = moment(ognoo)
              .startOf("month")
              .format("DD");
            medeelel.KhhurunguEkhlekhSar = moment(ognoo)
              .startOf("month")
              .format("MM");
            medeelel.KhhurunguDuusakhUdur = moment(ognoo)
              .endOf("month")
              .format("DD");
            medeelel.KhhurunguDuusakhSar = moment(ognoo)
              .endOf("month")
              .format("MM");

            medeelel.nekhemjlekhiinDugaar =
              moment().format("YY") + "/" + (dugaarlalt + i);

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
            var niilberAshiglaltDunGoTo = 0;
            var niilberNekhemjlelDunGoto = 0;
            var ashiglaltCount = 0;
            var menejmentCount = 0;
            var niilberDunUrangan = 0;
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
                new RegExp(
                  `&lt;${a.tailbar}.khungulultKhassanTulukhDun&gt;`,
                  "g"
                ),
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
                a.tailbar?.includes("Хүйтэн ус") ||
                a.tailbar?.includes("менежмент")
              ) {
                const tariffValue = ashiglaltiinZardal?.jagsaalt?.find(
                  (b) => b.ner === a.tailbar
                )?.tariff;

                a.tariff = tariffValue ?? 0;
              }
              if (a.tailbar === "Цахилгаан нэмэлт") {
                const tariffValue = ashiglaltiinZardal?.jagsaalt?.find(
                  (b) => b.ner === "Цахилгаан"
                )?.tariff;

                a.tariff = tariffValue ?? 0;
              }

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
                a.tailbar === "Цахилгаан нэмэлт" ||
                a.tailbar?.includes("Халуун ус") ||
                a.tailbar?.includes("Хүйтэн ус")
              ) {
                a.zuruuZaalt = (a.suuliinZaalt || 0) - (a.umnukhZaalt || 0);
                zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
                  new RegExp(`&lt;${a.tailbar}.zuruuZaalt&gt;`, "g"),
                  formatNumber(a.zuruuZaalt || 0) || ""
                );
                if (
                  a.tailbar?.includes("Цахилгаан") ||
                  a.tailbar === "Цахилгаан нэмэлт"
                ) {
                  a.tsakhilgaanUrjver = ashiglaltiinZardal?.jagsaalt
                    ?.filter((b) => b.ner?.includes("Цахилгаан"))
                    .map((b) => b.tsakhilgaanUrjver);
                  zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
                    new RegExp(`&lt;${a.tailbar}.tsakhilgaanUrjver&gt;`, "g"),
                    formatNumber(a.tsakhilgaanUrjver || 0) || ""
                  );
                }

                if (
                  a.tailbar?.includes("Халуун ус") ||
                  a.tailbar?.includes("Хүйтэн ус")
                ) {
                  a.tseverusTariff = ashiglaltiinZardal?.jagsaalt
                    ?.filter((b) => b.ner === a.tailbar)
                    .map((b) => b.tseverUsDun);
                  a.boxirusTariff = ashiglaltiinZardal?.jagsaalt
                    ?.filter((b) => b.ner === a.tailbar)
                    .map((b) => b.bokhirUsDun);
                  a.usxalaasniitulburTariff = a.tailbar?.includes("Хүйтэн ус")
                    ? 0
                    : ashiglaltiinZardal?.jagsaalt
                        ?.filter((b) => b.ner === a.tailbar)
                        .map((b) => b.usKhalaasniiDun);

                  zuruuDun += a.zuruuZaalt;
                  tseverusDun += a.zuruuZaalt * a.tseverusTariff; // Халуун ус + Хүйтэн ус
                  boxirusDun += a.zuruuZaalt * a.boxirusTariff; // Халуун ус + Хүйтэн ус
                  usxalaasniitulburDun += a.tailbar?.includes("Хүйтэн ус")
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
                    new RegExp(
                      `&lt;${a.tailbar}.usxalaasniitulburTariff&gt;`,
                      "g"
                    ),
                    formatNumber(a.usxalaasniitulburTariff || 0) || ""
                  );
                }
              }

              kaidudZoriulsanNiitTulburiinNiilber += khungulultKhassanTulukhDun;
              niilberDunUrangan += khungulultKhassanTulukhDun;
              if (
                a.tailbar?.includes("Цахилгаан") ||
                a.tailbar === "Эрүүл ахуйч" ||
                a.tailbar === "Харуул хамгаалалт, ОБЕГ, ХАБ" ||
                a.tailbar === "Дулаан" ||
                a.tailbar === "Ус"
              ) {
                ashiglaltCount++;
                niilberAshiglaltDunGoTo += khungulultKhassanTulukhDun;
              }
              if (
                a.tailbar === "Худалдааны менежмент" ||
                a.tailbar === "Хөрөнгийн менежмент" ||
                a.tailbar === "Тавилга түрээс" ||
                a.tailbar === "Түрээсийн төлбөр нэмэлт"
              ) {
                menejmentCount++;
                niilberNekhemjlelDunGoto += khungulultKhassanTulukhDun;
              }
            });
            medeelel.zuruuDun = zuruuDun;
            medeelel.tseverusDun = tseverusDun;
            medeelel.boxirusDun = boxirusDun;
            medeelel.usxalaasniitulburDun = usxalaasniitulburDun;
            medeelel.niilberDun = niilberDun;
            medeelel.niilberAshiglaltDunGoTo = niilberAshiglaltDunGoTo;
            medeelel.niilberNekhemjlelDunGoto =
              niilberNekhemjlelDunGoto + niilberAshiglaltDunGoTo;
            medeelel.niilberDunGoto =
              (niilberDunGoto || 0) +
              (niilberNekhemjlelDunGoto || 0) +
              (niilberAshiglaltDunGoTo || 0);
            medeelel.ashiglaltCount = ashiglaltCount;
            medeelel.menejmentCount = menejmentCount;
            medeelel.gotoMPMCount = ashiglaltCount + 7;
            medeelel.gotoMTCount = menejmentCount + 6;
            medeelel.niilberDunUrangan = niilberDunUrangan;
            medeelel.niilberDunUranganNUAT = (niilberDunUrangan / 1.1) * 0.1;
            medeelel.niilberDunUranganNUATgui =
              niilberDunUrangan - medeelel.niilberDunUranganNUAT;

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;niilberDunUranganUsgeer&gt;`, "g"),
              capitalize(
                numberToWords(
                  medeelel.niilberDunUrangan,
                  { fixed: 2, suffix: "n" },
                  "төгрөг",
                  "мөнгө"
                )
              )
            );

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;niilberDunUrangan&gt;`, "g"),
              formatNumber(medeelel.niilberDunUrangan || 0)
            );

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;niilberDunUranganNUAT&gt;`, "g"),
              formatNumber(medeelel.niilberDunUranganNUAT || 0)
            );

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;niilberDunUranganNUATgui&gt;`, "g"),
              formatNumber(medeelel.niilberDunUranganNUATgui || 0)
            );

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

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;niilberAshiglaltDunGoTo&gt;`, "g"),
              formatNumber(medeelel.niilberAshiglaltDunGoTo || 0)
            );

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;niilberNekhemjlelDunGoto&gt;`, "g"),
              formatNumber(medeelel.niilberNekhemjlelDunGoto || 0)
            );

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;niilberDunGoto&gt;`, "g"),
              formatNumber(medeelel.niilberDunGoto || 0)
            );

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;niilberDunGotoUsgeer&gt;`, "g"),
              capitalize(
                numberToWords(
                  Math.abs(medeelel.niilberDunGoto),
                  { fixed: 2, suffix: "n" },
                  "төгрөг",
                  "мөнгө"
                )
              )
            );

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;ashiglaltCount&gt;`, "g"),
              formatNumber(medeelel.ashiglaltCount || 0)
            );

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;menejmentCount&gt;`, "g"),
              formatNumber(medeelel.menejmentCount || 0)
            );

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;gotoMPMCount&gt;`, "g"),
              formatNumber(medeelel.gotoMPMCount || 0)
            );

            zagvar.nekhemjlekh = zagvar?.nekhemjlekh?.replace(
              new RegExp(`&lt;gotoMTCount&gt;`, "g"),
              formatNumber(medeelel.gotoMTCount || 0)
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
                new RegExp(
                  `&lt;${a.ner}.khungulultKhassanTulukhDunNuat&gt;`,
                  "g"
                ),
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

              let niitZardliinNoutguiDun =
                niitZardliinDun - niitZardliinNoutiinDun;
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
                numberToWords(
                  Math.abs(garaasBodsonNiitDun),
                  { fixed: 2, suffix: "n" },
                  "төгрөг",
                  "мөнгө"
                )
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
          return {
            zagvar: zagvar?.nekhemjlekh,
            medeelel: medeelel,
            mail: medeelel?.mail,
            khuudasniiKhemjee: zagvar?.khuudasniiKhemjee,
            chiglel: zagvar?.chiglel,
            khatuuZagvarEsekh: zagvar?.khatuuZagvarEsekh,
            zagvariinNer: zagvar?.ner,
          };
        });
    return [];
  }, [
    barimt,
    songogdsonGereenuud,
    ashiglaltiinZardal,
    ashiglaltiinZardal,
    ognoo,
  ]);

  function send() {
    if (!barimt) {
      message.warning(t("Нэхэмжлэхийн төрөл сонгоно уу"));
      return;
    } else if (!songogdsonGereenuud || songogdsonGereenuud?.length === 0) {
      message.warning(t("Гэрээ сонгоно уу"));
      return;
    } else {
      switch (turul) {
        case "App":
          appIlgeeye();
          break;
        case "Mail":
          mailIlgeeye();
          break;
        default:
          msgIlgeeye();
          break;
      }
    }
  }

  function chiglelAvya() {
    return nekhemjlekhiinZagvar?.jagsaalt?.find((a) => a._id === barimt)
      ?.chiglel;
  }

  const handlePrint = useReactToPrint({
    content: () =>
      excelZagvarSongogdson ? printExcelRef.current : printRef.current,
    onAfterPrint: () => {
      if (songogdsonGereenuud?.length > 0)
        dugaarlaltKhadgalya(songogdsonGereenuud?.length + dugaarlalt - 1, () =>
          dugaarlaltMutate()
        );
    },
    pageStyle: `@media print {
      @page { size: A4 ${chiglelAvya()};margin:0;}
    }`,
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
    if (!songogdsonGereenuud || songogdsonGereenuud?.length === 0) {
      message.warning(t("Гэрээ сонгоно уу"));
      return;
    }
    if (excelZagvarSongogdson) {
      excelTatakh().then((res) => {
        if (res === "Amjilttai") {
          notification.info({ message: "Татагдаж эхэллээ" });
        }
      });
    } else {
      handlePrint();
    }
  }

  function turulSongokh(mur) {
    setTurul(mur);
    setBarimt(undefined);
    setDans(undefined);
  }
  var zagvar = nekhemjlekhiinZagvar?.jagsaalt?.find(
    (a) => a._id === barimt
  )?.nekhemjlekh;

  function msgIlgeeye() {
    var msgnuud = [];
    songogdsonGereenuud.map((mur) => {
      var nekhemjlekh = _.cloneDeep(
        nekhemjleliinJagsaalt.find((a) => a._id === mur)
      );

      const songosonZagvar = nekhemjlekhiinZagvar?.jagsaalt?.find(
        (a) => a._id === barimt
      );

      const medeelel = _.cloneDeep(
        nekhemjleliinJagsaalt.find((n) => n._id === barimt)
      );

      var text = songosonZagvar?.khatuuZagvarEsekh
        ? ajiltan?.baiguullagiinId === "63c0f31efe522048bf02086d" &&
          barilgiinId === "6659717af6cab41f3ec723b5"
          ? khatuuZagvarFoodCity(nekhemjlekh, ajiltan, baiguullaga)
          : ajiltan?.baiguullagiinId === "64e855ce37fdc9b105f936e0" ||
            barilgiinId === "6544bf602143a024b43f16ab"
          ? khatuuZagvarKaidu(nekhemjlekh, ajiltan, baiguullaga, barilgiinId)
          : khatuuZagvar(nekhemjlekh, ajiltan, baiguullaga, barilgiinId)
        : nekhemjlekhiinZagvar?.jagsaalt?.find((a) => a._id === barimt)
            ?.nekhemjlekh;

      nekhemjlekh.eneSardTulukhUsgeer = numberToWords(
        nekhemjlekh.eneSardTulukhDun *
          (nekhemjlekh.eneSardTulukhDun < 0 ? -1 : 1),
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );

      nekhemjlekh.niitUldegdelUsgeer = numberToWords(
        nekhemjlekh.niitUldegdel * (nekhemjlekh.niitUldegdel < 0 ? -1 : 1),
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );

      nekhemjlekh.niitAvlagaUldegdelUsgeer = numberToWords(
        nekhemjlekh.niitAvlagaUldegdel *
          (nekhemjlekh.niitAvlagaUldegdel < 0 ? -1 : 1),
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );
      nekhemjlekh.talbainNiitUneUsgeer = numberToWords(
        nekhemjlekh.talbainNiitUneUsgeer *
          (nekhemjlekh.talbainNiitUneUsgeer < 0 ? -1 : 1),
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );
      let khungulsunTalbainNiitUne = Math.abs(
        nekhemjlekh.talbainNiitUne - (nekhemjlekh.khungulult || 0)
      );
      let khungulsunTalbainNiitUneNuat = khungulsunTalbainNiitUne
        ? khungulsunTalbainNiitUne / 11
        : 0;
      let khungulsunTalbainNiitUneNuatgui = khungulsunTalbainNiitUne
        ? khungulsunTalbainNiitUne - khungulsunTalbainNiitUneNuat
        : 0;

      nekhemjlekh.talbainNiitUneUsgeer = numberToWords(
        nekhemjlekh?.talbainNiitUne *
          (nekhemjlekh?.talbainNiitUne < 0 ? -1 : 1),
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );

      nekhemjlekh.mungunDunUsgeer = numberToWords(
        nekhemjlekh.sariinTurees,
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );

      var kaidudZoriulsanNiitTulburiinNiilber = 0;
      var zardluud = nekhemjlekh.zardluud.filter(
        (a) => a.tailbar === "Менежмент төлбөр хуучин"
      );
      if (!zardluud || zardluud.length === 0) {
        kaidudZoriulsanNiitTulburiinNiilber += khungulsunTalbainNiitUne
          ? khungulsunTalbainNiitUne
          : 0;
      }
      kaidudZoriulsanNiitTulburiinNiilber += nekhemjlekh?.aldangiinUldegdel
        ? nekhemjlekh?.aldangiinUldegdel
        : 0;
      kaidudZoriulsanNiitTulburiinNiilber += nekhemjlekh.umnukhSariinUrTulbur
        ? nekhemjlekh.umnukhSariinUrTulbur
        : 0;
      if (
        songosonZagvar?.khatuuZagvarEsekh &&
        ajiltan?.baiguullagiinId !== "63c0f31efe522048bf02086d" &&
        ajiltan?.baiguullagiinId !== "679aea9032299b7ba8462a77"
      )
        kaidudZoriulsanNiitTulburiinNiilber +=
          (nekhemjlekh.baritsaaAvakhDun || 0) -
          (nekhemjlekh.baritsaaniiUldegdel || 0);

      const dans = dansGaralt?.jagsaalt?.find(
        (a) => a.dugaar === songogdsonDans
      );
      nekhemjlekh.dans = dans?.ibanDugaar ? dans.ibanDugaar : dans?.dugaar;

      nekhemjlekh.bank =
        dans?.bank === "khanbank"
          ? "Хаан банк"
          : dans?.bank === "golomt"
          ? "Голомт банк"
          : dans?.bank === "bogd"
          ? "Богд банк"
          : dans?.bank === "tdb"
          ? "Худалдаа хөгжлийн банк"
          : "";
      nekhemjlekh.dansniiNer = dans?.dansniiNer;
      nekhemjlekh.ibanDugaar = dans?.ibanDugaar;
      nekhemjlekh.khayag = nekhemjlekh.khayag || "";
      nekhemjlekh.aldangiinUldegdel = nekhemjlekh.aldangiinUldegdel || 0;
      nekhemjlekh.niitAvlagaUldegdel = formatNumber(
        nekhemjlekh.niitAvlagaUldegdel || 0
      );
      nekhemjlekh.aldangiinUldegdelNuat =
        ((nekhemjlekh.aldangiinUldegdel || 0) / 1.1) * 0.1;
      nekhemjlekh.aldangiinUldegdelNuatgui = formatNumber(
        nekhemjlekh.aldangiinUldegdel - nekhemjlekh.aldangiinUldegdelNuat || 0
      );
      nekhemjlekh.aldangiinUldegdelNuat = formatNumber(
        nekhemjlekh.aldangiinUldegdelNuat || 0
      );
      nekhemjlekh.aldangiinUldegdel = formatNumber(
        nekhemjlekh.aldangiinUldegdel || 0
      );
      nekhemjlekh.albanTushaal = nekhemjlekh.albanTushaal || "";
      nekhemjlekh.zakhirliinOvog = nekhemjlekh.zakhirliinOvog || "";
      nekhemjlekh.zakhirliinNer = nekhemjlekh.zakhirliinNer || "";
      nekhemjlekh.khayag = nekhemjlekh.khayag || "";
      nekhemjlekh.talbainNegjUneUsgeer = nekhemjlekh.talbainNegjUneUsgeer || "";
      nekhemjlekh.zoriulalt = nekhemjlekh.zoriulalt || "";
      nekhemjlekh.khungulukhKhugatsaa = nekhemjlekh.khungulukhKhugatsaa || "";
      nekhemjlekh.nemeltNekhemjlekh.tailbar =
        nekhemjlekh.nemeltNekhemjlekh.tailbar || "";
      nekhemjlekh.nemeltNekhemjlekh.tulukhDun =
        nekhemjlekh.nemeltNekhemjlekh.tulukhDun || "";
      nekhemjlekh.nemeltNekhemjlekh.ognoo =
        nekhemjlekh.nemeltNekhemjlekh.ognoo || "";
      nekhemjlekh.nemeltNekhemjlekh = nekhemjlekh.nemeltNekhemjlekh || "";
      nekhemjlekh.zardliinDun = formatNumber(nekhemjlekh.zardliinDun) || "";
      nekhemjlekh.sariinTurees = formatNumber(nekhemjlekh.sariinTurees);
      nekhemjlekh.eneSardTulukhDun = formatNumber(nekhemjlekh.eneSardTulukhDun);
      nekhemjlekh.niitUldegdel = formatNumber(nekhemjlekh.niitUldegdel);
      nekhemjlekh.talbainNegjUne = formatNumber(nekhemjlekh.talbainNegjUne);
      nekhemjlekh.talbainNiitUne = formatNumber(nekhemjlekh.talbainNiitUne);
      nekhemjlekh.talbainNiitUneNuat = (nekhemjlekh.talbainNiitUne / 1.1) * 0.1;
      nekhemjlekh.talbainNiitUneNuatgui = formatNumber(
        nekhemjlekh.talbainNiitUne - nekhemjlekh.talbainNiitUneNuat
      );
      nekhemjlekh.talbainNiitUneNuat = formatNumber(
        nekhemjlekh.talbainNiitUneNuat
      );
      nekhemjlekh.umnukhSariinUrTulbur = formatNumber(
        nekhemjlekh.umnukhSariinUrTulbur
      );
      nekhemjlekh.umnukhSariinUrTulburNuat = formatNumber(
        (nekhemjlekh.umnukhSariinUrTulbur / 1.1) * 0.1
      );
      nekhemjlekh.umnukhSariinUrTulburNuatgui = formatNumber(
        nekhemjlekh.umnukhSariinUrTulbur -
          nekhemjlekh.umnukhSariinUrTulburNuat || 0
      );

      nekhemjlekh.baritsaaUldegdel = formatNumber(
        (nekhemjlekh.baritsaaAvakhDun || 0) -
          (nekhemjlekh.baritsaaniiUldegdel || 0)
      );

      nekhemjlekh.baritsaaUldegdelNuat = formatNumber(
        (nekhemjlekh.baritsaaUldegdel / 1.1) * 0.1
      );
      nekhemjlekh.baritsaaUldegdelNuatgui = formatNumber(
        nekhemjlekh.baritsaaUldegdel - nekhemjlekh.baritsaaUldegdelNuat || 0
      );

      nekhemjlekh.khevlesenOgnoo = moment().format("YYYY-MM-DD");

      nekhemjlekh.niitAshiglaltiinZardal =
        formatNumber(nekhemjlekh.niitAshiglaltiinZardal) || "";

      nekhemjlekh.sar = moment().format("MM");
      nekhemjlekh.ekhlekhOn = moment().format("YYYY");
      nekhemjlekh.ekhelkhSar = moment().format("MM");
      nekhemjlekh.ekhlekhUdur = moment().format("DD");
      nekhemjlekh.duusakhOn = moment().format("YYYY");
      nekhemjlekh.duusakhSar = moment().format("MM");
      nekhemjlekh.duusakhUdur = moment().format("DD");

      nekhemjlekh?.zardluud?.map((a) => {
        text = text?.replace(
          new RegExp(`&lt;${a.tailbar}.khemjikhNegj&gt;`, "g"),
          a.khemjikhNegj || ""
        );

        text = text?.replace(
          new RegExp(`&lt;${a.tailbar}.tulukhDun&gt;`, "g"),
          formatNumber(a.tulukhDun || 0)
        );
        text = text?.replace(
          new RegExp(`&lt;${a.tailbar}.tulukhDunNuat&gt;`, "g"),
          formatNumber(a.tulukhDun / 10 || 0)
        );
        text = text?.replace(
          new RegExp(`&lt;${a.tailbar}.tulukhDunNuattai&gt;`, "g"),
          formatNumber(a.tulukhDun * 1.1 - a.khungulult || 0 || 0)
        );
        text = text?.replace(
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
        text = text?.replace(
          new RegExp(`&lt;${a.tailbar}.khungulultKhassanTulukhDun&gt;`, "g"),
          formatNumber(khungulultKhassanTulukhDun || 0)
        );
        text = text?.replace(
          new RegExp(
            `&lt;${a.tailbar}.khungulultKhassanTulukhDunNuat&gt;`,
            "g"
          ),
          formatNumber(khungulultKhassanTulukhDunNuat || 0)
        );
        text = text?.replace(
          new RegExp(
            `&lt;${a.tailbar}.khungulultKhassanTulukhDunNuatgui&gt;`,
            "g"
          ),
          formatNumber(khungulultKhassanTulukhDunNuatgui || 0)
        );
        text = text?.replace(
          new RegExp(`&lt;${a.tailbar}.tariff&gt;`, "g"),
          formatNumber(a.tariff || 0)
        );

        text = text?.replace(
          new RegExp(`&lt;${a.tailbar}.negj&gt;`, "g"),
          formatNumber(a.negj || 0) || ""
        );
        text = text?.replace(
          new RegExp(`&lt;${a.tailbar}.suuliinZaalt&gt;`, "g"),
          formatNumber(a.suuliinZaalt || 0) || ""
        );
        text = text?.replace(
          new RegExp(`&lt;${a.tailbar}.umnukhZaalt&gt;`, "g"),
          formatNumber(a.umnukhZaalt || 0) || ""
        );
        text = text?.replace(
          new RegExp(`&lt;${a.tailbar}.khungulult&gt;`, "g"),
          formatNumber(a.khungulult || 0) || ""
        );
        kaidudZoriulsanNiitTulburiinNiilber += khungulultKhassanTulukhDun;
      });

      ashiglaltiinZardal?.jagsaalt?.map((a) => {
        text = text?.replace(
          new RegExp(`&lt;${a.ner}.khemjikhNegj&gt;`, "g"),
          ""
        );

        text = text?.replace(new RegExp(`&lt;${a.ner}.tulukhDun&gt;`, "g"), 0);
        text = text?.replace(
          new RegExp(`&lt;${a.ner}.tulukhDunNuat&gt;`, "g"),
          0
        );
        text = text?.replace(
          new RegExp(`&lt;${a.ner}.tulukhDunNuattai&gt;`, "g"),
          0
        );
        text = text?.replace(
          new RegExp(`&lt;${a.ner}.tulukhDunNuatgui&gt;`, "g"),
          0
        );

        text = text?.replace(new RegExp(`&lt;${a.ner}.tariff&gt;`, "g"), 0);

        text = text?.replace(new RegExp(`&lt;${a.ner}.negj&gt;`, "g"), 0);

        text = text?.replace(
          new RegExp(`&lt;${a.ner}.suuliinZaalt&gt;`, "g"),
          0
        );

        text = text?.replace(
          new RegExp(`&lt;${a.ner}.umnukhZaalt&gt;`, "g"),
          0
        );
        text = text?.replace(new RegExp(`&lt;${a.ner}.khungulult&gt;`, "g"), 0);
      });
      if (nekhemjlekh?.zardluud?.length > 0) {
        const niitZardliinDun = nekhemjlekh?.zardluud.reduce(
          (a, b) => a + b.tulukhDun,
          0
        );
        text = text?.replace(
          new RegExp(`&lt;niitZardliinDun&gt;`, "g"),
          formatNumber(niitZardliinDun || 0)
        );
        let niitZardliinNoutiinDun = (niitZardliinDun / 1.1) * 0.1;

        let niitZardliinNoutguiDun = niitZardliinDun - niitZardliinNoutiinDun;
        text = text?.replace(
          new RegExp(`&lt;niitZardliinNuatguiDun&gt;`, "g"),
          formatNumber(niitZardliinNoutguiDun || 0)
        );

        text = text?.replace(
          new RegExp(`&lt;niitZardliinNuatiinDun&gt;`, "g"),
          formatNumber(niitZardliinNoutiinDun || 0)
        );
      }
      let garaasBodsonNiitDun = kaidudZoriulsanNiitTulburiinNiilber;
      let garaasBodsonNiitDunNuat = garaasBodsonNiitDun / 10;
      let garaasBodsonNiitDunNuatgui = formatNumber(
        garaasBodsonNiitDun - garaasBodsonNiitDunNuat || 0
      );
      text = text?.replace(
        new RegExp(`&lt;garaasBodsonNiitDun&gt;`, "g"),
        formatNumber(garaasBodsonNiitDun || 0)
      );
      text = text?.replace(
        new RegExp(`&lt;garaasBodsonNiitDunNuatgui&gt;`, "g"),
        garaasBodsonNiitDunNuatgui
      );
      text = text?.replace(
        new RegExp(`&lt;garaasBodsonNiitDunUsgeer&gt;`, "g"),
        capitalize(
          numberToWords(
            Math.abs(garaasBodsonNiitDun),
            { fixed: 2, suffix: "n" },
            "төгрөг",
            "мөнгө"
          )
        )
      );
      text = text?.replace(
        new RegExp(`&lt;garaasBodsonNiitDunNuat&gt;`, "g"),
        formatNumber(garaasBodsonNiitDunNuat || 0)
      );
      // var text = msj;
      for (const [key, value] of Object.entries(nekhemjlekh)) {
        if (value !== undefined && value !== null) {
          text = text?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
        } else {
          text = text?.replace(new RegExp(`&lt;${key}&gt;`, "g"), "");
        }
      }
      var tempP = document.createElement("p");
      tempP.innerHTML = text;
      var tempText = tempP.textContent;
      // tempText = text.replace(/<[^>]+>/g, '');
      if (_.isArray(nekhemjlekh.utas))
        nekhemjlekh.utas.map((to) =>
          msgnuud.push({
            to,
            text: t(tempText),
          })
        );
      else
        msgnuud.push({
          to: nekhemjlekh.utas,
          text: t(tempText),
        });
    });
    uilchilgee(token)
      .post(`/msgIlgeeye`, { barilgiinId, msgnuud })
      .then(({ data }) => {
        if (data[0].Result === "SUCCESS") {
          notification.success({ message: t("SMS Амжилттай илгээлээ") });
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }
  function mailIlgeeye() {
    if (!barimt) {
      message.warning(t("Нэхэмжлэхийн төрөл сонгоно уу"));
      return;
    }
    if (!songogdsonGereenuud || songogdsonGereenuud?.length === 0) {
      message.warning(t("Гэрээ сонгоно уу"));
      return;
    }
    if (loading) {
      message.warning(t("И-мэйл илгээгдсэн байна"));
      return;
    }
    if (!excelZagvarSongogdson) {
      const mailuud = [];
      let successCount = 0;
      setLoading(true);
      songogdsonGereenuud.map((mur, index) => {
        var nekhemjlekh = _.cloneDeep(
          nekhemjleliinJagsaalt.find((a) => a._id === mur)
        );
        const songosonZagvar = nekhemjlekhiinZagvar?.jagsaalt?.find(
          (a) => a._id === barimt
        );
        const barilga = baiguullaga?.barilguud?.find(
          (a) => a._id === nekhemjlekh?.barilgiinId
        );

        var text = songosonZagvar?.khatuuZagvarEsekh
          ? ajiltan?.baiguullagiinId === "63c0f31efe522048bf02086d" &&
            barilgiinId === "6659717af6cab41f3ec723b5"
            ? khatuuZagvarFoodCity(nekhemjlekh, ajiltan, baiguullaga)
            : ajiltan?.baiguullagiinId === "6735c77a7fc60cd66deb2909" &&
              barilgiinId === "67512183c60497546f59513a"
            ? khatuuZagvarGotoMPM(
                nekhemjlekh,
                ajiltan,
                baiguullaga,
                barilgiinId
              )
            : ajiltan?.baiguullagiinId === "6735c77a7fc60cd66deb2909" &&
              barilgiinId === "6735c77a7fc60cd66deb290a"
            ? khatuuZagvarGotoMT(nekhemjlekh, ajiltan, baiguullaga, barilgiinId)
            : ajiltan?.baiguullagiinId === "679aea9032299b7ba8462a77"
            ? khatuuZagvarUranGan(
                nekhemjlekh,
                ajiltan,
                baiguullaga,
                barilga,
                barilgiinId
              )
            : (ajiltan?.baiguullagiinId === "6731b43bc23730ac1908da2d" &&
                barilgiinId === "6731b43bc23730ac1908da2e") ||
              (ajiltan?.baiguullagiinId === "6115f350b35689cdbf1b9da3" &&
                (barilgiinId === "622ec99a8e64e5b4f0c3acb6" ||
                  barilgiinId === "619e267fdd4835aa2c168b28" ||
                  barilgiinId === "657955ac70280a9ebe8f11ef"))
            ? khatuuZagvarSoyoljMall(
                nekhemjlekh,
                ajiltan,
                baiguullaga,
                barilga,
                barilgiinId
              )
            : ajiltan?.baiguullagiinId === "64e855ce37fdc9b105f936e0" ||
              barilgiinId === "6544bf602143a024b43f16ab"
            ? khatuuZagvarKaidu(nekhemjlekh, ajiltan, baiguullaga, barilgiinId)
            : khatuuZagvar(nekhemjlekh, ajiltan, baiguullaga, barilgiinId)
          : nekhemjlekhiinZagvar?.jagsaalt?.find((a) => a._id === barimt)
              ?.nekhemjlekh;

        nekhemjlekh.eneSardTulukhUsgeer = numberToWords(
          nekhemjlekh.eneSardTulukhDun *
            (nekhemjlekh.eneSardTulukhDun < 0 ? -1 : 1),
          { fixed: 2, suffix: "n" },
          "төгрөг",
          "мөнгө"
        );

        nekhemjlekh.niitUldegdelUsgeer = numberToWords(
          nekhemjlekh.niitUldegdel * (nekhemjlekh.niitUldegdel < 0 ? -1 : 1),
          { fixed: 2, suffix: "n" },
          "төгрөг",
          "мөнгө"
        );
        nekhemjlekh.niitAvlagaUldegdelUsgeer = numberToWords(
          nekhemjlekh.niitAvlagaUldegdel *
            (nekhemjlekh.niitAvlagaUldegdel < 0 ? -1 : 1),
          { fixed: 2, suffix: "n" },
          "төгрөг",
          "мөнгө"
        );
        nekhemjlekh.talbainNiitUneUsgeer = numberToWords(
          nekhemjlekh?.talbainNiitUne *
            (nekhemjlekh?.talbainNiitUne < 0 ? -1 : 1),
          { fixed: 2, suffix: "n" },
          "төгрөг",
          "мөнгө"
        );

        let khungulsunTalbainNiitUne =
          nekhemjlekh.talbainNiitUne - (nekhemjlekh.khungulult || 0);
        let khungulsunTalbainNiitUneNuat = khungulsunTalbainNiitUne
          ? khungulsunTalbainNiitUne / 11
          : 0;
        let khungulsunTalbainNiitUneNuatgui = khungulsunTalbainNiitUne
          ? khungulsunTalbainNiitUne - khungulsunTalbainNiitUneNuat
          : 0;

        var niilberDunGoto =
          (nekhemjlekh.umnukhSariinUrTulbur || 0) +
          (nekhemjlekh?.aldangiinUldegdel || 0);
        niilberDunGoto +=
          (nekhemjlekh.baritsaaAvakhDun || 0) -
          (nekhemjlekh.baritsaaniiUldegdel || 0) +
          khungulsunTalbainNiitUne;

        nekhemjlekh.mungunDunUsgeer = numberToWords(
          nekhemjlekh.sariinTurees,
          { fixed: 2, suffix: "n" },
          "төгрөг",
          "мөнгө"
        );
        var kaidudZoriulsanNiitTulburiinNiilber = 0;
        var zardluud = nekhemjlekh.zardluud.filter(
          (a) => a.tailbar === "Менежмент төлбөр хуучин"
        );
        if (!zardluud || zardluud.length === 0) {
          kaidudZoriulsanNiitTulburiinNiilber += khungulsunTalbainNiitUne
            ? khungulsunTalbainNiitUne
            : 0;
        }
        kaidudZoriulsanNiitTulburiinNiilber += nekhemjlekh?.aldangiinUldegdel
          ? nekhemjlekh?.aldangiinUldegdel
          : 0;
        kaidudZoriulsanNiitTulburiinNiilber += nekhemjlekh.umnukhSariinUrTulbur
          ? nekhemjlekh.umnukhSariinUrTulbur
          : 0;
        if (ajiltan?.baiguullagiinId === "679aea9032299b7ba8462a77") {
          // Urangan
          nekhemjlekh.umnukhSariinUldegdel =
            (nekhemjlekh.umnukhSariinUrTulbur || 0) +
            (nekhemjlekh?.aldangiinUldegdel || 0);
          nekhemjlekh.umnukhSariinUldegdelNUAT =
            (nekhemjlekh.umnukhSariinUldegdel / 1.1) * 0.1;
          nekhemjlekh.umnukhSariinUldegdelNUATgui =
            nekhemjlekh.umnukhSariinUldegdel -
            nekhemjlekh.umnukhSariinUldegdelNUAT;
          nekhemjlekh.umnukhSariinUldegdel = formatNumber(
            nekhemjlekh.umnukhSariinUldegdel || 0
          );
          nekhemjlekh.umnukhSariinUldegdelNUAT = formatNumber(
            nekhemjlekh.umnukhSariinUldegdelNUAT || 0
          );
          nekhemjlekh.umnukhSariinUldegdelNUATgui = formatNumber(
            nekhemjlekh.umnukhSariinUldegdelNUATgui || 0
          );
          let uranganTureesNiitDun = khungulsunTalbainNiitUne;
          nekhemjlekh.uranganTureesNiitDun = formatNumber(
            uranganTureesNiitDun || 0
          );
          nekhemjlekh.uranganTureesNiitDunUsgeer = numberToWords(
            uranganTureesNiitDun,
            { fixed: 2, suffix: "n" },
            "төгрөг",
            "мөнгө"
          );
        }

        if (
          ajiltan?.baiguullagiinId === "6115f350b35689cdbf1b9da3" &&
          barilgiinId === "622ec99a8e64e5b4f0c3acb6"
        )
          // ikhnayd zuun undur
          nekhemjlekh.barilgiinlogo = renderToString(
            <span>
              <img
                src={`/logo_ikhnayd.jpg`}
                style={{
                  width: 150,
                  height: 100,
                  transform: "translate(15%, 15%)",
                  opacity: 0.65,
                }}
              />
            </span>
          );
        // urangan
        else
          nekhemjlekh.barilgiinlogo = renderToString(
            <span>
              <img
                src={`${url}/file?path=logo/${barilga.logo}`}
                style={{
                  width: 200,
                  height: 50,
                  transform: "translate(5%, -80%)",
                  opacity: 0.65,
                }}
              />
            </span>
          );

        if (
          songosonZagvar?.khatuuZagvarEsekh &&
          ajiltan?.baiguullagiinId !== "63c0f31efe522048bf02086d" &&
          ajiltan?.baiguullagiinId !== "679aea9032299b7ba8462a77"
        )
          kaidudZoriulsanNiitTulburiinNiilber +=
            (nekhemjlekh.baritsaaAvakhDun || 0) -
            (nekhemjlekh.baritsaaniiUldegdel || 0);

        const dans = dansGaralt?.jagsaalt?.find(
          (a) => a.dugaar === songogdsonDans
        );
        nekhemjlekh.dans = dans?.dugaar;
        nekhemjlekh.bank =
          dans?.bank === "khanbank"
            ? "Хаан банк"
            : dans?.bank === "golomt"
            ? "Голомт банк"
            : dans?.bank === "bogd"
            ? "Богд банк"
            : dans?.bank === "tdb"
            ? "Худалдаа хөгжлийн банк"
            : "";
        nekhemjlekh.dansniiNer = dans?.dansniiNer;
        nekhemjlekh.ibanDugaar = dans?.ibanDugaar;
        nekhemjlekh.khayag = nekhemjlekh.khayag || "";
        nekhemjlekh.niitAvlagaUldegdel = formatNumber(
          nekhemjlekh.niitAvlagaUldegdel || 0
        );
        nekhemjlekh.aldangiinUldegdel = nekhemjlekh.aldangiinUldegdel || 0;
        nekhemjlekh.aldangiinUldegdelNuat =
          ((nekhemjlekh.aldangiinUldegdel || 0) / 1.1) * 0.1;
        nekhemjlekh.aldangiinUldegdelNuatgui = formatNumber(
          nekhemjlekh.aldangiinUldegdel - nekhemjlekh.aldangiinUldegdelNuat || 0
        );
        nekhemjlekh.aldangiinUldegdelNuat = formatNumber(
          nekhemjlekh.aldangiinUldegdelNuat || 0
        );
        nekhemjlekh.aldangiinUldegdel = formatNumber(
          nekhemjlekh.aldangiinUldegdel || 0
        );
        nekhemjlekh.khuviinTamga = renderToString(
          <span style={{ position: "absolute", zIndex: 1 }}>
            <img
              src={"/khuviinTamga.png"}
              style={{
                width: 115,
                height: 100,
                transform: "translate(-10%, -50%)",
                opacity: 0.65,
              }}
            />
          </span>
        );
        if (ajiltan?.baiguullagiinId === "6735c77a7fc60cd66deb2909") {
          // goto
          nekhemjlekh.gariinUseg = renderToString(
            <span style={{ position: "relative", zIndex: 9999 }}>
              <img
                src={`${url}/file?path=gariinUseg/${barilga.gariinUseg}`}
                style={{
                  width: 100,
                  height: 60,
                  transform: "translate(100%, -65%)",
                }}
              />
            </span>
          );
        } else {
          nekhemjlekh.gariinUseg = renderToString(
            <span style={{ position: "relative", zIndex: 9999 }}>
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
        }
        if (ajiltan?.baiguullagiinId === "6735c77a7fc60cd66deb2909") {
          // goto
          nekhemjlekh.tamga = renderToString(
            <span>
              <img
                src={`${url}/file?path=tamga/${barilga.tamga}`}
                style={{
                  width: 200,
                  height: 160,
                  transform: "translate(15%, -94%)",
                  opacity: 0.65,
                }}
              />
            </span>
          );
        } else
          nekhemjlekh.tamga = renderToString(
            <span>
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

        nekhemjlekh.albanTushaal = nekhemjlekh.albanTushaal || "";
        nekhemjlekh.zakhirliinOvog = nekhemjlekh.zakhirliinOvog || "";
        nekhemjlekh.zakhirliinNer = nekhemjlekh.zakhirliinNer || "";
        nekhemjlekh.khayag = nekhemjlekh.khayag || "";
        nekhemjlekh.talbainNegjUneUsgeer =
          nekhemjlekh.talbainNegjUneUsgeer || "";
        nekhemjlekh.talbainNiitUneUsgeer =
          nekhemjlekh.talbainNiitUneUsgeer || "";
        nekhemjlekh.zoriulalt = nekhemjlekh.zoriulalt || "";
        nekhemjlekh.khungulukhKhugatsaa = nekhemjlekh.khungulukhKhugatsaa || "";
        nekhemjlekh.nemeltNekhemjlekh.tailbar =
          nekhemjlekh.nemeltNekhemjlekh.tailbar || "";
        nekhemjlekh.nemeltNekhemjlekh.tulukhDun =
          nekhemjlekh.nemeltNekhemjlekh.tulukhDun || "";
        nekhemjlekh.nemeltNekhemjlekh.ognoo =
          nekhemjlekh.nemeltNekhemjlekh.ognoo || "";
        nekhemjlekh.nemeltNekhemjlekh = nekhemjlekh.nemeltNekhemjlekh || "";
        nekhemjlekh.zardliinDun = formatNumber(nekhemjlekh.zardliinDun) || "";
        nekhemjlekh.sariinTurees = formatNumber(nekhemjlekh.sariinTurees);
        nekhemjlekh.eneSardTulukhDun = formatNumber(
          nekhemjlekh.eneSardTulukhDun
        );
        nekhemjlekh.niitUldegdel = formatNumber(nekhemjlekh.niitUldegdel);
        nekhemjlekh.talbainNegjUne = formatNumber(nekhemjlekh.talbainNegjUne);
        nekhemjlekh.talbainNiitUneNuat =
          (nekhemjlekh.talbainNiitUne / 1.1) * 0.1;
        nekhemjlekh.talbainNiitUneNuatgui = formatNumber(
          nekhemjlekh.talbainNiitUne - nekhemjlekh.talbainNiitUneNuat
        );
        nekhemjlekh.talbainNiitUne = formatNumber(
          nekhemjlekh.talbainNiitUne - (nekhemjlekh.khungulult || 0)
        );
        nekhemjlekh.talbainNiitUneNuat = formatNumber(
          nekhemjlekh.talbainNiitUneNuat
        );

        nekhemjlekh.khungulsunTalbainNiitUne = formatNumber(
          khungulsunTalbainNiitUne || 0
        );
        nekhemjlekh.khungulsunTalbainNiitUneNuat = formatNumber(
          khungulsunTalbainNiitUneNuat || 0
        );
        nekhemjlekh.khungulsunTalbainNiitUneNuatgui = formatNumber(
          khungulsunTalbainNiitUneNuatgui || 0
        );
        nekhemjlekh.khungulult = formatNumber(nekhemjlekh.khungulult || 0);

        nekhemjlekh.umnukhSariinUrTulburNuat =
          ((nekhemjlekh.umnukhSariinUrTulbur || 0) / 1.1) * 0.1;
        nekhemjlekh.umnukhSariinUrTulburNuatgui = formatNumber(
          (nekhemjlekh.umnukhSariinUrTulbur || 0) -
            (nekhemjlekh.umnukhSariinUrTulburNuat || 0)
        );
        nekhemjlekh.umnukhSariinUrTulburNuat = formatNumber(
          nekhemjlekh.umnukhSariinUrTulburNuat
        );
        nekhemjlekh.umnukhSariinUrTulbur = formatNumber(
          nekhemjlekh.umnukhSariinUrTulbur
        );

        nekhemjlekh.baritsaaUldegdel =
          (nekhemjlekh.baritsaaAvakhDun || 0) -
          (nekhemjlekh.baritsaaniiUldegdel || 0);
        nekhemjlekh.baritsaaUldegdelNuat =
          ((nekhemjlekh.baritsaaUldegdel || 0) / 1.1) * 0.1;
        nekhemjlekh.baritsaaUldegdelNuatgui = formatNumber(
          nekhemjlekh.baritsaaUldegdel - nekhemjlekh.baritsaaUldegdelNuat || 0
        );

        nekhemjlekh.baritsaaUldegdelNuat = formatNumber(
          nekhemjlekh.baritsaaUldegdelNuat
        );

        nekhemjlekh.baritsaaUldegdel = formatNumber(
          nekhemjlekh.baritsaaUldegdel
        );

        nekhemjlekh.khevlesenOgnoo = moment().format("YYYY-MM-DD");

        nekhemjlekh.niitAshiglaltiinZardal =
          formatNumber(nekhemjlekh.niitAshiglaltiinZardal) || "";

        nekhemjlekh.sar = moment(ognoo).format("MM");
        nekhemjlekh.ekhlekhOn = moment(ognoo).format("YYYY");
        nekhemjlekh.ekhelkhSar = moment(ognoo).format("MM");
        nekhemjlekh.ekhlekhUdur = moment(ognoo).format("DD");
        nekhemjlekh.duusakhOn = moment(ognoo).format("YYYY");
        nekhemjlekh.duusakhSar = moment(ognoo).format("MM");
        nekhemjlekh.duusakhUdur = moment(ognoo)
          .set(
            "date",
            barilgiinId === "6731b43bc23730ac1908da2e"
              ? 10
              : barilgiinId === "6735c77a7fc60cd66deb290a" ||
                barilgiinId === "67512183c60497546f59513a"
              ? 20
              : 15
          )
          .format("DD");

        if (ajiltan?.baiguullagiinId === "679aea9032299b7ba8462a77") {
          nekhemjlekh.tureesEkhlehUdur = moment(ognoo)
            .startOf("month")
            .format("YYYY.MM.DD");
          nekhemjlekh.tureesDuusakhUdur = moment(ognoo)
            .endOf("month")
            .format("YYYY.MM.DD");
          nekhemjlekh.khevlesenOgnoo = moment(ognoo).format("YYYY/MM/DD");
          nekhemjlekh.sar = moment(ognoo).format("MM");
          nekhemjlekh.umnukhSar = moment(ognoo)
            .subtract(1, "month")
            .format("MM");
        } else {
          nekhemjlekh.tureesEkhlehUdur = moment(ognoo)
            .add(1, "month")
            .startOf("month")
            .format("MM/DD");
          nekhemjlekh.tureesDuusakhUdur = moment(ognoo)
            .add(1, "month")
            .endOf("month")
            .format("MM/DD");
          nekhemjlekh.ashiglaltEkhlehUdur = moment(ognoo)
            .subtract(1, "month")
            .startOf("month")
            .format("MM/DD");
          nekhemjlekh.ashiglaltDuusakhUdur = moment(ognoo)
            .subtract(1, "month")
            .endOf("month")
            .format("MM/DD");
        }
        nekhemjlekh.KhhurunguEkhlekhUdur = moment(ognoo)
          .startOf("month")
          .format("DD");
        nekhemjlekh.KhhurunguEkhlekhSar = moment(ognoo)
          .startOf("month")
          .format("MM");
        nekhemjlekh.KhhurunguDuusakhUdur = moment(ognoo)
          .endOf("month")
          .format("DD");
        nekhemjlekh.KhhurunguDuusakhSar = moment(ognoo)
          .endOf("month")
          .format("MM");

        var niilberAshiglaltDunGoTo = 0;
        var niilberNekhemjlelDunGoto = 0;
        var ashiglaltCount = 0;
        var menejmentCount = 0;
        var niilberDunUrangan = 0;
        nekhemjlekh?.zardluud?.map((a) => {
          text = text?.replace(
            new RegExp(`&lt;${a.tailbar}.khemjikhNegj&gt;`, "g"),
            a.khemjikhNegj || ""
          );

          text = text?.replace(
            new RegExp(`&lt;${a.tailbar}.tulukhDun&gt;`, "g"),
            formatNumber(a.tulukhDun || 0)
          );
          text = text?.replace(
            new RegExp(`&lt;${a.tailbar}.tulukhDunNuat&gt;`, "g"),
            formatNumber(a.tulukhDun / 10 || 0)
          );
          text = text?.replace(
            new RegExp(`&lt;${a.tailbar}.tulukhDunNuattai&gt;`, "g"),
            formatNumber(a.tulukhDun * 1.1 - a.khungulult || 0 || 0)
          );
          text = text?.replace(
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
          text = text?.replace(
            new RegExp(`&lt;${a.tailbar}.khungulultKhassanTulukhDun&gt;`, "g"),
            formatNumber(khungulultKhassanTulukhDun || 0)
          );
          text = text?.replace(
            new RegExp(
              `&lt;${a.tailbar}.khungulultKhassanTulukhDunNuat&gt;`,
              "g"
            ),
            formatNumber(khungulultKhassanTulukhDunNuat || 0)
          );
          text = text?.replace(
            new RegExp(
              `&lt;${a.tailbar}.khungulultKhassanTulukhDunNuatgui&gt;`,
              "g"
            ),
            formatNumber(khungulultKhassanTulukhDunNuatgui || 0)
          );
          text = text?.replace(
            new RegExp(`&lt;${a.tailbar}.tariff&gt;`, "g"),
            formatNumber(a.tariff || 0)
          );

          text = text?.replace(
            new RegExp(`&lt;${a.tailbar}.negj&gt;`, "g"),
            formatNumber(a.negj || 0) || ""
          );
          text = text?.replace(
            new RegExp(`&lt;${a.tailbar}.suuliinZaalt&gt;`, "g"),
            formatNumber(a.suuliinZaalt || 0) || ""
          );
          text = text?.replace(
            new RegExp(`&lt;${a.tailbar}.umnukhZaalt&gt;`, "g"),
            formatNumber(a.umnukhZaalt || 0) || ""
          );
          text = text?.replace(
            new RegExp(`&lt;${a.tailbar}.khungulult&gt;`, "g"),
            formatNumber(a.khungulult || 0) || ""
          );
          kaidudZoriulsanNiitTulburiinNiilber += khungulultKhassanTulukhDun;
          niilberDunUrangan += khungulultKhassanTulukhDun;
          if (
            a.tailbar?.includes("Цахилгаан") ||
            a.tailbar === "Эрүүл ахуйч" ||
            a.tailbar === "Харуул хамгаалалт, ОБЕГ, ХАБ" ||
            a.tailbar === "Дулаан" ||
            a.tailbar === "Ус"
          ) {
            ashiglaltCount++;
            niilberAshiglaltDunGoTo += khungulultKhassanTulukhDun;
          }
          if (
            a.tailbar === "Худалдааны менежмент" ||
            a.tailbar === "Хөрөнгийн менежмент" ||
            a.tailbar === "Тавилга түрээс" ||
            a.tailbar === "Түрээсийн төлбөр нэмэлт"
          ) {
            menejmentCount++;
            niilberNekhemjlelDunGoto += khungulultKhassanTulukhDun;
          }
        });

        nekhemjlekh.niilberAshiglaltDunGoTo = niilberAshiglaltDunGoTo;
        nekhemjlekh.niilberNekhemjlelDunGoto =
          niilberNekhemjlelDunGoto + niilberAshiglaltDunGoTo;
        nekhemjlekh.niilberDunGoto =
          (niilberDunGoto || 0) +
          (niilberNekhemjlelDunGoto || 0) +
          (niilberAshiglaltDunGoTo || 0);
        nekhemjlekh.ashiglaltCount = ashiglaltCount;
        nekhemjlekh.menejmentCount = menejmentCount;
        nekhemjlekh.gotoMPMCount = ashiglaltCount + 7;
        nekhemjlekh.gotoMTCount = menejmentCount + 6;
        nekhemjlekh.niilberDunUrangan = niilberDunUrangan;
        nekhemjlekh.niilberDunUranganNUAT = (niilberDunUrangan / 1.1) * 0.1;
        nekhemjlekh.niilberDunUranganNUATgui =
          niilberDunUrangan - nekhemjlekh.niilberDunUranganNUAT;

        text = text?.replace(
          new RegExp(`&lt;niilberDunUranganUsgeer&gt;`, "g"),
          capitalize(
            numberToWords(
              nekhemjlekh.niilberDunUrangan,
              { fixed: 2, suffix: "n" },
              "төгрөг",
              "мөнгө"
            )
          )
        );
        text = text?.replace(
          new RegExp(`&lt;niilberDunUrangan&gt;`, "g"),
          formatNumber(nekhemjlekh.niilberDunUrangan || 0)
        );

        text = text?.replace(
          new RegExp(`&lt;niilberDunUranganNUAT&gt;`, "g"),
          formatNumber(nekhemjlekh.niilberDunUranganNUAT || 0)
        );

        text = text?.replace(
          new RegExp(`&lt;niilberDunUranganNUATgui&gt;`, "g"),
          formatNumber(nekhemjlekh.niilberDunUranganNUATgui || 0)
        );

        text = text?.replace(
          new RegExp(`&lt;niilberAshiglaltDunGoTo&gt;`, "g"),
          formatNumber(nekhemjlekh.niilberAshiglaltDunGoTo || 0)
        );

        text = text?.replace(
          new RegExp(`&lt;niilberNekhemjlelDunGoto&gt;`, "g"),
          formatNumber(nekhemjlekh.niilberNekhemjlelDunGoto || 0)
        );

        text = text?.replace(
          new RegExp(`&lt;niilberDunGoto&gt;`, "g"),
          formatNumber(nekhemjlekh.niilberDunGoto || 0)
        );

        text = text?.replace(
          new RegExp(`&lt;niilberDunGotoUsgeer&gt;`, "g"),
          capitalize(
            numberToWords(
              Math.abs(nekhemjlekh.niilberDunGoto),
              { fixed: 2, suffix: "n" },
              "төгрөг",
              "мөнгө"
            )
          )
        );

        text = text?.replace(
          new RegExp(`&lt;ashiglaltCount&gt;`, "g"),
          formatNumber(nekhemjlekh.ashiglaltCount || 0)
        );

        text = text?.replace(
          new RegExp(`&lt;menejmentCount&gt;`, "g"),
          formatNumber(nekhemjlekh.menejmentCount || 0)
        );

        text = text?.replace(
          new RegExp(`&lt;gotoMPMCount&gt;`, "g"),
          formatNumber(nekhemjlekh.gotoMPMCount || 0)
        );

        text = text?.replace(
          new RegExp(`&lt;gotoMTCount&gt;`, "g"),
          formatNumber(nekhemjlekh.gotoMTCount || 0)
        );

        ashiglaltiinZardal?.jagsaalt?.map((a) => {
          text = text?.replace(
            new RegExp(`&lt;${a.ner}.khemjikhNegj&gt;`, "g"),
            ""
          );

          text = text?.replace(
            new RegExp(`&lt;${a.ner}.tulukhDun&gt;`, "g"),
            0
          );
          text = text?.replace(
            new RegExp(`&lt;${a.ner}.tulukhDunNuat&gt;`, "g"),
            0
          );
          text = text?.replace(
            new RegExp(`&lt;${a.ner}.tulukhDunNuattai&gt;`, "g"),
            0
          );
          text = text?.replace(
            new RegExp(`&lt;${a.ner}.tulukhDunNuatgui&gt;`, "g"),
            0
          );

          text = text?.replace(new RegExp(`&lt;${a.ner}.tariff&gt;`, "g"), 0);

          text = text?.replace(new RegExp(`&lt;${a.ner}.negj&gt;`, "g"), 0);

          text = text?.replace(
            new RegExp(`&lt;${a.ner}.suuliinZaalt&gt;`, "g"),
            0
          );

          text = text?.replace(
            new RegExp(`&lt;${a.ner}.umnukhZaalt&gt;`, "g"),
            0
          );
          text = text?.replace(
            new RegExp(`&lt;${a.ner}.khungulult&gt;`, "g"),
            0
          );
        });
        if (nekhemjlekh?.zardluud?.length > 0) {
          const niitZardliinDun = nekhemjlekh?.zardluud.reduce(
            (a, b) => a + b.tulukhDun,
            0
          );
          text = text?.replace(
            new RegExp(`&lt;niitZardliinDun&gt;`, "g"),
            formatNumber(niitZardliinDun || 0)
          );
          let niitZardliinNoutiinDun = (niitZardliinDun / 1.1) * 0.1;

          let niitZardliinNoutguiDun = niitZardliinDun - niitZardliinNoutiinDun;
          text = text?.replace(
            new RegExp(`&lt;niitZardliinNuatguiDun&gt;`, "g"),
            formatNumber(niitZardliinNoutguiDun || 0)
          );

          text = text?.replace(
            new RegExp(`&lt;niitZardliinNuatiinDun&gt;`, "g"),
            formatNumber(niitZardliinNoutiinDun || 0)
          );
        }
        let garaasBodsonNiitDun = kaidudZoriulsanNiitTulburiinNiilber;
        let garaasBodsonNiitDunNuat = garaasBodsonNiitDun / 10;
        let garaasBodsonNiitDunNuatgui = formatNumber(
          garaasBodsonNiitDun - garaasBodsonNiitDunNuat || 0
        );
        text = text?.replace(
          new RegExp(`&lt;garaasBodsonNiitDun&gt;`, "g"),
          formatNumber(garaasBodsonNiitDun || 0)
        );
        text = text?.replace(
          new RegExp(`&lt;garaasBodsonNiitDunNuatgui&gt;`, "g"),
          garaasBodsonNiitDunNuatgui
        );
        text = text?.replace(
          new RegExp(`&lt;garaasBodsonNiitDunUsgeer&gt;`, "g"),
          capitalize(
            numberToWords(
              Math.abs(garaasBodsonNiitDun),
              { fixed: 2, suffix: "n" },
              "төгрөг",
              "мөнгө"
            )
          )
        );

        text = text?.replace(
          new RegExp(`&lt;garaasBodsonNiitDunNuat&gt;`, "g"),
          formatNumber(garaasBodsonNiitDunNuat || 0)
        );

        for (const [key, value] of Object.entries(nekhemjlekh)) {
          if (value !== undefined && value !== null) {
            text = text?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
          } else {
            text = text?.replace(new RegExp(`&lt;${key}&gt;`, "g"), "");
          }
        }
        if (!!nekhemjlekh.mail) {
          var mail = [
            {
              gereeniiDugaar: nekhemjlekh.gereeniiDugaar,
              mail: nekhemjlekh.mail,
              content: text,
            },
          ];
          const gereenuud = [];
          const dans = dansGaralt?.jagsaalt?.find(
            (a) => a.dugaar === songogdsonDans
          );
          const tempData = _.cloneDeep(
            nekhemjleliinJagsaalt.find((a) => a._id === mur)
          );
          tempData.medeelel = _.cloneDeep(tempData);
          tempData.nekhemjlekh = nekhemjlekh.zagvar;
          tempData.zagvariinNer = nekhemjlekh.zagvariinNer;
          tempData.maililgeesenAjiltniiId = ajiltan.id;
          tempData.maililgeesenAjiltniiNer = ajiltan.ner;
          tempData.nekhemjlekhiinZagvarId = barimt;
          tempData.tsonkhniiNer = "Нэхэмжлэл";
          tempData.nekhemjlekhiinDans = dans?.dugaar;
          tempData.nekhemjlekhiinDansniiNer = dans?.dansniiNer;
          tempData.nekhemjlekhiinIbanDugaar = dans?.ibanDugaar;
          tempData.nekhemjlekhiinBank =
            dans?.bank === "khanbank"
              ? "Хаан банк"
              : dans?.bank === "golomt"
              ? "Голомт банк"
              : dans?.bank === "bogd"
              ? "Богд банк"
              : dans?.bank === "tdb"
              ? "Худалдаа хөгжлийн банк"
              : "";
          gereenuud.push(tempData);
          uilchilgee(token)
            .post(`/mailOlnoorIlgeeye`, {
              mailuud: mail,
              subject: "Түрээсийн төлбөр",
              gereenuud: gereenuud,
              ognoo: ognoo,
            })
            .then(({ data }) => {
              if (data === "Amjilttai") {
                successCount++;
                notification.success({
                  message: (
                    <>
                      {nekhemjlekh.mail +
                        t(
                          " И-мэйл Амжилттай илгээлээ. Амжилттай илгээгдэж буй мэйлийн тоо: "
                        )}
                      <span className="font-semibold text-[#11b980]">
                        {successCount}
                      </span>
                    </>
                  ),
                });
              }
            })
            .catch((e) => {
              aldaaBarigch(e);
            })
            .finally(() => {
              if (index === songogdsonGereenuud.length - 1) {
                setLoading(false);
              }
            });
        }
      });
    } else {
      const mailuud = [];
      nekhemjlekhuud.map((mur, index) => {
        mailuud.push({ mail: mur.mail, content: tatsanExcelZagvar[index] });
      });
      setLoading(true);
      uilchilgee(token)
        .post(`/mailOlnoorIlgeeye`, { mailuud, subject: "Түрээсийн төлбөр" })
        .then(({ data }) => {
          if (data === "Amjilttai") {
            notification.success({ message: t("И-мэйл Амжилттай илгээлээ") });
            setLoading(false);
          }
        })
        .catch((e) => {
          setLoading(false);
          aldaaBarigch(e);
        });
    }
  }
  async function appIlgeeye() {
    if (songogdsonGereenuud.length > 0) {
      setWaiting(true);
      var khariu = { successCount: 0, failureCount: 0 };
      songogdsonGereenuud
        .filter((a) => !a._id)
        .map((a, index, array) => {
          const medeelel = _.cloneDeep(
            nekhemjleliinJagsaalt.find((n) => n._id === a)
          );
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
          medeelel.talbainNiitUneUsgeer = numberToWords(
            medeelel?.talbainNiitUne * (medeelel?.talbainNiitUne < 0 ? -1 : 1),
            { fixed: 2, suffix: "n" },
            "төгрөг",
            "мөнгө"
          );

          medeelel.mungunDunUsgeer = numberToWords(
            medeelel?.sariinTurees,
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
          medeelel.aldangiinUldegdel =
            formatNumber(medeelel.aldangiinUldegdel) || "";
          medeelel.aldangiinUldegdelNuat =
            formatNumber(medeelel.aldangiinUldegdel / 10) || "";
          medeelel.aldangiinUldegdelNuatgui =
            formatNumber(
              medeelel.aldangiinUldegdel - medeelel.aldangiinUldegdelNuat
            ) || "";
          medeelel.albanTushaal = medeelel.albanTushaal || "";
          medeelel.khayag = medeelel.khayag || "";
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
          medeelel.niitUldegdel = formatNumber(medeelel.niitUldegdel);
          medeelel.niitAvlagaUldegdel = formatNumber(
            medeelel.niitAvlagaUldegdel || 0
          );
          medeelel.talbainNegjUne = formatNumber(medeelel.talbainNegjUne);
          medeelel.talbainNiitUne = formatNumber(medeelel.talbainNiitUne);
          medeelel.umnukhSariinUrTulbur = formatNumber(
            medeelel.umnukhSariinUrTulbur
          );
          medeelel.umnukhSariinUrTulburNuat = formatNumber(
            medeelel.umnukhSariinUrTulbur / 10
          );
          medeelel.umnukhSariinUrTulburNuatgui = formatNumber(
            medeelel.umnukhSariinUrTulbur - medeelel.umnukhSariinUrTulburNuat
          );

          medeelel.baritsaaUldegdel = formatNumber(
            (medeelel.baritsaaAvakhDun || 0) -
              (medeelel.baritsaaniiUldegdel || 0)
          );

          medeelel.baritsaaUldegdelNuat = formatNumber(
            medeelel.baritsaaUldegdel / 10 || 0
          );
          medeelel.baritsaaUldegdelNuatgui = formatNumber(
            medeelel.baritsaaUldegdel - medeelel.baritsaaUldegdelNuat || 0
          );

          medeelel.khevlesenOgnoo = moment().format("YYYY-MM-DD");

          medeelel.niitAshiglaltiinZardal =
            formatNumber(medeelel.niitAshiglaltiinZardal) || "";

          medeelel.sar = moment().format("MM");
          medeelel.ekhlekhOn = moment().format("YYYY");
          medeelel.ekhelkhSar = moment().format("MM");
          medeelel.ekhlekhUdur = moment().format("DD");
          medeelel.duusakhOn = moment().format("YYYY");
          medeelel.duusakhSar = moment().format("MM");
          medeelel.duusakhUdur = moment().format("DD");

          let body = msj;
          for (const [key, value] of Object.entries(medeelel)) {
            body = body?.replace(new RegExp(`<${key}>`, "g"), value);
          }
          var garchig = nekhemjlekhiinZagvar?.jagsaalt?.find(
            (a) => a._id === barimt
          )?.ner;

          uilchilgee(token)
            .post(`/sonorduulgaIlgeeye`, {
              firebaseToken: medeelel?.firebaseToken,
              khariltsagchiinId: medeelel?.khariltsagchiinId,
              barilgiinId: medeelel.barilgiinId,
              khariltsagchiinNer: medeelel.ner,
              medeelel: { title: garchig, body: body },
            })
            .then(({ data }) => {
              if (!!data?.successCount) khariu.successCount += 1;
              else if (!!data?.failureCount) khariu.failureCount += 1;
              if (index === array.length - 1) {
                notification.success({
                  message: t("Notification Амжилттай илгээлээ"),
                });
                setWaiting(false);
              }
            });

          return;
        });
      return;
    }

    songogdsonGereenuud.map((mur) => {
      var khariu = { successCount: 0, failureCount: 0 };
      var text = msj;
      var nekhemjlekh = _.cloneDeep(
        nekhemjleliinJagsaalt.find((a) => a._id === mur)
      );
      nekhemjlekh.ekhelkhSar = moment(nekhemjlekh.ekhelkhSar).format("MM");
      nekhemjlekh.ekhlekhOn = moment(nekhemjlekh.ekhlekhOn).format("YYYY");

      nekhemjlekh.eneSardTulukhUsgeer = numberToWords(
        nekhemjlekh.eneSardTulukhDun *
          (nekhemjlekh.eneSardTulukhDun < 0 ? -1 : 1),
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );

      nekhemjlekh.niitUldegdelUsgeer = numberToWords(
        nekhemjlekh.niitUldegdel * (nekhemjlekh.niitUldegdel < 0 ? -1 : 1),
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );
      nekhemjlekh.niitAvlagaUldegdelUsgeer = numberToWords(
        nekhemjlekh.niitAvlagaUldegdel *
          (nekhemjlekh.niitAvlagaUldegdel < 0 ? -1 : 1),
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );
      nekhemjlekh.talbainNiitUneUsgeer = numberToWords(
        nekhemjlekh?.talbainNiitUne *
          (nekhemjlekh?.talbainNiitUne < 0 ? -1 : 1),
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );

      nekhemjlekh.mungunDunUsgeer = numberToWords(
        nekhemjlekh.sariinTurees,
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );
      const dans = dansGaralt?.jagsaalt?.find(
        (a) => a.dugaar === songogdsonDans
      );
      nekhemjlekh.dans = dans?.dugaar;
      nekhemjlekh.bank =
        dans?.bank === "khanbank"
          ? "Хаан банк"
          : dans?.bank === "golomt"
          ? "Голомт банк"
          : dans?.bank === "bogd"
          ? "Богд банк"
          : dans?.bank === "tdb"
          ? "Худалдаа хөгжлийн банк"
          : "";
      nekhemjlekh.dansniiNer = dans?.dansniiNer;
      nekhemjlekh.khayag = nekhemjlekh.khayag || "";
      nekhemjlekh.albanTushaal = nekhemjlekh.albanTushaal || "";
      nekhemjlekh.zakhirliinOvog = nekhemjlekh.zakhirliinOvog || "";
      nekhemjlekh.zakhirliinNer = nekhemjlekh.zakhirliinNer || "";
      nekhemjlekh.khayag = nekhemjlekh.khayag || "";
      nekhemjlekh.talbainNegjUneUsgeer = nekhemjlekh.talbainNegjUneUsgeer || "";
      nekhemjlekh.talbainNiitUneUsgeer = nekhemjlekh.talbainNiitUneUsgeer || "";
      nekhemjlekh.zoriulalt = nekhemjlekh.zoriulalt || "";
      nekhemjlekh.khungulukhKhugatsaa = nekhemjlekh.khungulukhKhugatsaa || "";
      nekhemjlekh.nemeltNekhemjlekh.tailbar =
        nekhemjlekh.nemeltNekhemjlekh.tailbar || "";
      nekhemjlekh.nemeltNekhemjlekh.tulukhDun =
        nekhemjlekh.nemeltNekhemjlekh.tulukhDun || "";
      nekhemjlekh.nemeltNekhemjlekh.ognoo =
        nekhemjlekh.nemeltNekhemjlekh.ognoo || "";
      nekhemjlekh.nemeltNekhemjlekh = nekhemjlekh.nemeltNekhemjlekh || "";
      nekhemjlekh.zardliinDun = formatNumber(nekhemjlekh.zardliinDun) || "";
      nekhemjlekh.sariinTurees = formatNumber(nekhemjlekh.sariinTurees);
      nekhemjlekh.eneSardTulukhDun = formatNumber(nekhemjlekh.eneSardTulukhDun);
      nekhemjlekh.niitUldegdel = formatNumber(nekhemjlekh.niitUldegdel);
      nekhemjlekh.talbainNegjUne = formatNumber(nekhemjlekh.talbainNegjUne);
      nekhemjlekh.talbainNiitUne = formatNumber(nekhemjlekh.talbainNiitUne);
      nekhemjlekh.umnukhSariinUrTulbur = formatNumber(
        nekhemjlekh.umnukhSariinUrTulbur
      );

      nekhemjlekh.khevlesenOgnoo = moment().format("YYYY-MM-DD");

      nekhemjlekh.niitAshiglaltiinZardal =
        formatNumber(nekhemjlekh.niitAshiglaltiinZardal) || "";

      nekhemjlekh.sar = moment().format("MM");
      nekhemjlekh.ekhlekhOn = moment().format("YYYY");
      nekhemjlekh.ekhelkhSar = moment().format("MM");
      nekhemjlekh.ekhlekhUdur = moment().format("DD");
      nekhemjlekh.duusakhOn = moment().format("YYYY");
      nekhemjlekh.duusakhSar = moment().format("MM");
      nekhemjlekh.duusakhUdur = moment().format("DD");

      var medeelel = nekhemjleliinJagsaalt.find((a) => a._id === mur);
      for (const [key, value] of Object.entries(nekhemjlekh)) {
        text = text?.replace(new RegExp(`<${key}>`, "g"), value);
      }
      uilchilgee(token)
        .post(`/sonorduulgaIlgeeye`, {
          firebaseToken: medeelel?.firebaseToken,
          khariltsagchiinId: medeelel?.khariltsagchiinId,
          barilgiinId: medeelel.barilgiinId,
          khariltsagchiinNer: medeelel.ner,
          medeelel: { body: text },
        })
        .then(({ data }) => {
          if (!!data?.successCount) khariu.successCount += 1;
          else if (!!data?.failureCount) khariu.failureCount += 1;

          notification.success({
            message: t("Notification Амжилттай илгээлээ"),
          });
        });
      return;
    });
  }

  function nekhemjlelZasya(mur, index) {
    const footer = [
      <Button onClick={() => dunZasvarRef.current.khaaya()}>
        {t("Хаах")}
      </Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => dunZasvarRef.current.khadgalya()}
      >
        {t("Хадгалах")}
      </Button>,
    ];
    modal({
      title: t("Нэхэмжлэл засвар"),
      icon: <FileExcelOutlined />,
      content: (
        <DunZasvar
          ref={dunZasvarRef}
          data={mur}
          index={index}
          setNekhemjleliinJagsaalt={setNekhemjleliinJagsaalt}
          nekhemjleliinJagsaalt={nekhemjleliinJagsaalt}
          songogdsonGereenuud={songogdsonGereenuud}
          setSongogdsonGereenuud={setSongogdsonGereenuud}
        />
      ),
      footer,
    });
  }
  function zagvarUstgaya(mur) {
    setWaiting(true);
    if (mur.nekhemjlekh === "excel") {
      uilchilgee(token).post("/excelZagvarUstgaya", {
        turul: "nekhemjlel",
        excelNer: mur.ner,
        barilgiinId: barilgiinId,
      });
    }
    deleteMethod("nekhemjlekhiinZagvar", token, mur?._id)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setWaiting(false);
          message.success(t("Устгагдлаа"));
          nekhemjlekhiinZagvarMutate();
        }
      })
      .catch((e) => {
        setWaiting(false);
        aldaaBarigch(e);
      });
  }

  function handleSongosonTurul(v) {
    const songogdsonZagvar = nekhemjlekhiinZagvar?.jagsaalt?.find(
      (a) => a._id === v
    );
    if (songogdsonZagvar.nekhemjlekh === "excel") {
      setExcelZagvarSongogdson(true);
      setSongogdsonZagvar(songogdsonZagvar);
    } else {
      setExcelZagvarSongogdson(false);
      setSongogdsonZagvar();
    }
  }

  async function excelTatakh() {
    try {
      if (songogdsonZagvar) {
        if (songogdsonGereenuud && songogdsonGereenuud?.length > 0) {
          setUnshijBaina(true);
          const songogdsonNekhemjlel = nekhemjleliinJagsaalt.filter((a) =>
            songogdsonGereenuud.includes(a._id)
          );
          const yavuulakhData = {
            excelNer: songogdsonZagvar.ner,
            nekhemjlekhiinJagsaalt: songogdsonNekhemjlel,
            ashiglaltiinZardluud: ashiglaltiinZardal?.jagsaalt,
            barilgiinId: barilgiinId,
          };
          await uilchilgee(token)
            .post("/excelZagvarTatya", yavuulakhData, { responseType: "blob" })
            .then((response) => {})
            .catch((err) => {
              setUnshijBaina(false);
              message.error(err);
            });
        } else {
          notification.warn({
            message: "Гэрээ сонгогдоогүй байна",
            duration: 2,
          });
        }
      } else {
        notification.warn({
          message: "Загвар сонгогдоогүй байна",
          duration: 2,
        });
      }
      return "Amjilttai";
    } catch (err) {
      message.error(err);
    }
  }
  return (
    <Admin
      title="Нэхэмжлэл"
      khuudasniiNer="nekhemjlel"
      className="p-0 pb-12 md:p-4 md:pb-0"
      onSearch={(search) => {
        setNekhemjlelKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
      }}
      tsonkhniiId="65543edf0b4208a0709c7ff2"
      loading={isValidating || waiting}
    >
      <Card
        className="cardgrid col-span-12"
        style={{ minHeight: "calc(100vh - 8rem)" }}
      >
        <Spin spinning={loading}>
          <div
            className={`grid w-full
            ${
              nekhemjlekhuud?.find(
                (a) => a.khuudasniiKhemjee === "A4" || a.chiglel === "portrait"
              )
                ? ""
                : "grid-cols-2"
            } `}
            ref={printRef}
          >
            {nekhemjlekhuud?.map((nekhemjlekh, i) => {
              return (
                <div
                  key={`khevlekhNekhemjlel${i}`}
                  className={
                    !nekhemjlekh.khatuuZagvarEsekh
                      ? `print ${nekhemjlekh.khuudasniiKhemjee}-${nekhemjlekh.chiglel} sun-editor-editable p-10"`
                      : `print p-5 text-xs`
                  }
                  dangerouslySetInnerHTML={{
                    __html: nekhemjlekh.zagvar,
                  }}
                />
              );
            })}
          </div>
          {/* <div
            className={`grid w-full
            ${
              nekhemjlekhuud?.find(
                (a) => a.khuudasniiKhemjee === "A4" || a.chiglel === "portrait"
              )
                ? ""
                : "grid-cols-2"
            } `}
            ref={printExcelRef}
          >
            {nekhemjlekhuud?.map((nekhemjlekh, i) => {
              return (
                <div
                  key={`khevlekhNekhemjlel${i}`}
                  className={`hidden print:block ${nekhemjlekh.khuudasniiKhemjee}-${nekhemjlekh.chiglel} sun-editor-editable p-10" table`}
                  dangerouslySetInnerHTML={{
                    __html: tatsanExcelZagvar?.[i],
                  }}
                />
              );
            })}
          </div> */}
          <div
            className=" flex w-full flex-row"
            data-aos="zoom-in-left"
            data-aos-duration="1000"
          >
            <div className="mb-3  flex w-full flex-col gap-2 md:ml-auto md:w-auto md:flex-row">
              <div className="flex w-full justify-between gap-2">
                <label>{t("Олон сараар нэхэмжлэх эсэх")}:</label>
                <Switch
                  checked={olnoorSaraarEsekh}
                  onChange={setOlnoorSaraarEsekh}
                />
              </div>
              <div className="flex w-full justify-between gap-2">
                <DatePicker
                  className="w-1/2 lg:w-auto"
                  clearIcon
                  placeholder={t("Огноо сонгох")}
                  value={ognoo}
                  onChange={setOgnoo}
                />
                <Select
                  className="w-1/2 lg:w-auto"
                  placeholder={t("Данс сонгох")}
                  value={songogdsonDans}
                  onChange={setDans}
                >
                  {dansGaralt?.jagsaalt?.map((a) => (
                    <Select.Option key={a.dugaar} value={a.dugaar}>
                      <div>{a.dugaar}</div>
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="flex w-full justify-between gap-2">
                <Select
                  className="w-1/2 lg:w-auto"
                  allowClear
                  placeholder={t("Давхар сонгох")}
                  onChange={(v) => {
                    setDavkhar(v);
                    setSongogdsonGereenuud([]);
                  }}
                >
                  {baiguullaga?.barilguud
                    ?.find((a) => a._id === barilgiinId)
                    ?.davkharuud.map((a) => (
                      <Select.Option key={a._id} value={a.davkhar}>
                        {a.davkhar}
                      </Select.Option>
                    ))}
                </Select>
                <Select
                  className="w-1/2 lg:w-[200px]"
                  placeholder={t("Төрөл сонгох")}
                  value={barimt}
                  onChange={(content) => {
                    setBarimt(content);
                    handleSongosonTurul(content);
                  }}
                >
                  {nekhemjlekhiinZagvar?.jagsaalt?.map((a) =>
                    turul === a.turul ? (
                      <Select.Option key={a._id} value={a._id}>
                        {a.ner}
                      </Select.Option>
                    ) : turul === "Mail" ? (
                      a.turul === undefined ? (
                        <Select.Option key={a._id} value={a._id}>
                          {a.ner}
                        </Select.Option>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )
                  )}
                </Select>
              </div>
              <div className="hidden justify-end  gap-2 md:flex">
                {turul === "Mail" ? (
                  <Button
                    hidden={turul !== "Mail"}
                    loading={unshijBaina}
                    type="primary"
                    onClick={hevlekh}
                  >
                    {t("Хэвлэх")}
                    {/*  */}
                  </Button>
                ) : (
                  ""
                )}
                <Button onClick={send}>
                  <div className="dark:text-[#E5E7EB]">{t("Илгээх")} </div>
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-8 gap-2">
            <div
              className="col-span-8 rounded-md md:col-span-2 lg:p-2"
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="500"
            >
              <div className="mb-3 rounded-md border p-2 shadow-md">
                <div
                  className="grid grid-cols-3 gap-1  font-medium"
                  role="tablist"
                >
                  {["Mail", "SMS", "App"].map((mur) => (
                    <div
                      key={mur}
                      className={`flex-1 cursor-pointer rounded-md py-2 text-center transition-colors ${
                        turul === mur
                          ? "bg-green-500 text-white"
                          : "border-x hover:bg-green-500"
                      }`}
                      onClick={() => turulSongokh(mur)}
                    >
                      {mur}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex w-full justify-between gap-1 lg:justify-end">
                {turul === "Mail" ? (
                  <div className="w-1/3 lg:hidden">
                    <Button
                      className="w-full"
                      hidden={turul !== "Mail"}
                      type="primary"
                      onClick={hevlekh}
                    >
                      {t("Хэвлэх")}
                    </Button>
                  </div>
                ) : (
                  ""
                )}
                <div className="w-1/3 lg:hidden">
                  <Button className="w-full" onClick={send}>
                    {t("Илгээх")}
                  </Button>
                </div>
                <Button
                  className="w-1/3 lg:w-auto"
                  type="primary"
                  onClick={() =>
                    turul === "SMS"
                      ? smsZagvarNemya()
                      : turul === "App"
                      ? smsZagvarNemya()
                      : router.push("/khyanalt/tulburTootsoo/nekhemjlel/new")
                  }
                >
                  {t("Загвар үүсгэх")}
                </Button>
              </div>
              <div className="my-4 space-y-2">
                {nekhemjlekhiinZagvar?.jagsaalt?.map((a, i) =>
                  a.turul === turul ? (
                    <div
                      key={`zagvar${i}`}
                      className="flex flex-row items-center space-x-2 rounded-md border border-gray-200 p-2 shadow-md"
                    >
                      {a.nekhemjlekh !== "excel" ? (
                        <Image src="/invoice.png" width={32} height={32} />
                      ) : (
                        <div className="h-8 w-8 text-xl text-green-500">
                          <FileExcelOutlined />
                        </div>
                      )}
                      <div className="font-medium">{a.ner}</div>
                      {!a.khatuuZagvarEsekh && (
                        <div style={{ marginLeft: "auto" }}>
                          <Popconfirm
                            title="Загвар устгах уу?"
                            okText={t("Тийм")}
                            cancelText={t("Үгүй")}
                            onConfirm={() => zagvarUstgaya(a)}
                          >
                            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 fill-current  p-2  text-white dark:bg-gray-700">
                              <DeleteOutlined
                                style={{ color: "red", display: "flex" }}
                              />
                            </div>
                          </Popconfirm>
                        </div>
                      )}
                      {!a.khatuuZagvarEsekh && (
                        <div
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100   fill-current  p-2 text-white dark:bg-gray-700"
                          onClick={() =>
                            turul === "SMS" || turul === "App"
                              ? smsZagvarNemya(a)
                              : router.push(
                                  `/khyanalt/tulburTootsoo/nekhemjlel/${a._id}`
                                )
                          }
                        >
                          {a.nekhemjlekh !== "excel" ? (
                            <EditOutlined
                              style={{ display: "flex", color: "#85C1E9" }}
                            />
                          ) : (
                            <EyeOutlined
                              style={{ display: "flex", color: "#85C1E9" }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ) : turul === "Mail" ? (
                    a.turul === undefined ? (
                      <div
                        key={`zagvar${i}`}
                        className="flex flex-row items-center space-x-2 rounded-md border border-gray-200 p-2 shadow-md"
                      >
                        <Image src="/invoice.png" width={32} height={32} />
                        <div className="font-medium">{a.ner}</div>
                        {!a.khatuuZagvarEsekh && (
                          <div style={{ marginLeft: "auto" }}>
                            <Popconfirm
                              title="Загвар устгах уу?"
                              okText={t("Тийм")}
                              cancelText={t("Үгүй")}
                              onConfirm={() => zagvarUstgaya(a)}
                            >
                              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 fill-current  p-2  text-white dark:bg-gray-700">
                                <DeleteOutlined
                                  style={{ color: "red", display: "flex" }}
                                />
                              </div>
                            </Popconfirm>
                          </div>
                        )}
                        <div
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100   fill-current  p-2 text-white dark:bg-gray-700"
                          onClick={() =>
                            router.push(
                              `/khyanalt/tulburTootsoo/nekhemjlel/${a._id}`
                            )
                          }
                        >
                          <EditOutlined
                            style={{ display: "flex", color: "#85C1E9" }}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )
                )}
              </div>
            </div>
            <div
              className="col-span-8 md:col-span-6"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div className="hidden">
                <ZagvarUusgekh value={zagvar} onTextChange={onTextChange} />
              </div>
              <Table
                bordered
                size="small"
                scroll={{ y: "calc(100vh - 22rem)" }}
                rowSelection={{
                  type: "checkbox",
                  selectedRowKeys: songogdsonGereenuud,
                  onChange: (selectedRowKeys) => {
                    setSongogdsonGereenuud(selectedRowKeys);
                  },
                }}
                columns={[
                  {
                    title: "№",
                    width: "3rem",
                    align: "center",
                    render: (text, record, index) => index + 1,
                  },
                  {
                    title: t("Түрээслэгч"),
                    dataIndex: "ner",
                    width: "7rem",
                    align: "center",
                  },
                  {
                    title: t("Гэрээ"),
                    dataIndex: "gereeniiDugaar",
                    width: "7rem",
                    align: "center",
                  },
                  {
                    title: t("Талбай"),
                    showSorterTooltip: false,
                    sorter: (a, b) => a.talbainDugaar - b.talbainDugaar,
                    dataIndex: "talbainDugaar",
                    width: "7rem",
                    align: "center",
                  },
                  {
                    title: t("Дараагийн төлөх"),
                    showSorterTooltip: false,
                    width: "7rem",
                    sorter: (a, b) =>
                      moment(a.talbainDugaar).diff(
                        moment(b.talbainDugaar),
                        "hour"
                      ),
                    dataIndex: "daraagiinTulukhOgnoo",
                    render(a) {
                      return moment(a).format("YYYY-MM-DD");
                    },
                    ellipsis: true,
                    align: "center",
                  },
                  {
                    title: t("Хуримтлагдсан"),
                    showSorterTooltip: false,
                    width: "7rem",
                    sorter: (a, b) =>
                      a.umnukhSariinUrTulbur - b.umnukhSariinUrTulbur,
                    dataIndex: "umnukhSariinUrTulbur",
                    render(a) {
                      return formatNumber(a);
                    },
                    ellipsis: true,
                    align: "center",
                  },
                  {
                    title: t("Энэ сард төлөх"),
                    showSorterTooltip: false,
                    width: "7rem",
                    sorter: (a, b) => a.eneSardTulukhDun - b.eneSardTulukhDun,
                    dataIndex: "eneSardTulukhDun",
                    render(a) {
                      return formatNumber(a);
                    },
                    ellipsis: true,
                    align: "center",
                  },
                  {
                    title: t("Алданги"),
                    width: "7rem",
                    showSorterTooltip: false,
                    sorter: (a, b) => a.aldangiinUldegdel - b.aldangiinUldegdel,
                    dataIndex: "aldangiinUldegdel",
                    render(a) {
                      return formatNumber(a);
                    },
                    ellipsis: true,
                    align: "center",
                  },
                  {
                    title: t("Үлдэгдэл"),
                    width: "7rem",
                    showSorterTooltip: false,
                    sorter: (a, b) => a.niitUldegdel - b.niitUldegdel,
                    dataIndex: "niitUldegdel",
                    render(a) {
                      return formatNumber(a);
                    },
                    ellipsis: true,
                    align: "center",
                  },
                  {
                    title: t("Төлөв"),
                    width: "4rem",
                    dataIndex: "tuluv",
                    align: "center",
                    render(a, record, index) {
                      return (
                        <div className="flex items-center justify-center">
                          <Button
                            className=" dark:bg-gray-700 "
                            shape="circle"
                            size="small"
                            icon={
                              <div
                                className={`flex items-center justify-center  dark:bg-gray-700 `}
                                onClick={() => nekhemjlelZasya(record, index)}
                              >
                                <EditOutlined
                                  style={{ fontSize: "18px", color: "#85C1E9" }}
                                  className=" dark:bg-gray-700 "
                                />
                              </div>
                            }
                          />
                        </div>
                      );
                    },
                  },
                ]}
                dataSource={nekhemjleliinJagsaalt}
                pagination={false}
                rowKey={(a) => a._id}
              />
            </div>
          </div>
        </Spin>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default tulburTootsoo;
