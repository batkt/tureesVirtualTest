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
} from "antd";
import {
  EditOutlined,
  FileExcelOutlined,
  DeleteOutlined,
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
import { toWords } from "mon_num";
import DunZasvar from "components/pageComponents/nekhemjlel/DunZasvar";
import { modal } from "components/ant/Modal";
import { useAuth } from "services/auth";
import deleteMethod from "tools/function/crud/deleteMethod";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Aos from "aos";
import { renderToString } from "react-dom/server";
import ZagvarUusgekh from "components/pageComponents/nekhemjlel/ZagvarUusgekh";

import AppSmsZagvar from "components/pageComponents/nekhemjlel/AppSmsZagvar";
import numberToWords from "tools/function/numberToWords";
import useDans from "hooks/useDans";

const ilgeekhTurul = "davkharaar";

function tulburTootsoo({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const printRef = React.useRef(null);
  const dunZasvarRef = React.useRef(null);
  const { baiguullaga, barilgiinId } = useAuth();
  const ref = useRef(null);
  const [ognoo, setOgnoo] = React.useState(moment());

  const [davkhar, setDavkhar] = React.useState();
  const [turul, setTurul] = useState("SMS");
  const [barimt, setBarimt] = useState();
  const [msj, onTextChange] = useState("");
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [nekhemjleliinJagsaalt, setNekhemjleliinJagsaalt] = React.useState([]);
  const [songogdsonDans, setDans] = React.useState();
  const { nekhemjlel, setNekhemjlelKhuudaslalt, isValidating } = useNekhemjlekh(
    token,
    ognoo,
    davkhar,
    ilgeekhTurul
  );
  const [content, setContent] = React.useState();
  const { dansGaralt } = useDans(token, baiguullaga?._id);
  const { nekhemjlekhiinZagvar, nekhemjlekhiinZagvarMutate } =
    useNekhemjlekhiinZagvar(token);

  const { dugaarlalt, dugaarlaltMutate, dugaarlaltKhadgalya } =
    useNekhemjlekhDugaarlalt(token);
  const [songogdsonGereenuud, setSongogdsonGereenuud] = React.useState([]);

  useEffect(() => {
    if (!!nekhemjlel) setNekhemjleliinJagsaalt([...nekhemjlel?.jagsaalt]);
  }, [nekhemjlel]);

  useEffect(() => {
    barilgiinId;
    setBarimt(undefined);
    setDans(undefined);
    setSongogdsonGereenuud([]);
  }, [barilgiinId]);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      if (songogdsonGereenuud?.length > 0)
        dugaarlaltKhadgalya(songogdsonGereenuud?.length + dugaarlalt - 1, () =>
          dugaarlaltMutate()
        );
    },
  });

  function smsZagvarNemya(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => ref.current.khadgalya(setWaiting(true))}
      >
        Бүртгэл нэмэх
      </Button>,
    ];
    modal({
      title: `${turul} Загвар үүсгэх`,
      icon: <FileExcelOutlined />,
      content: (
        <AppSmsZagvar
          ref={ref}
          setWaiting={setWaiting}
          data={data}
          token={token}
          turul={turul}
          barilgiinId={barilgiinId}
          onRefresh={nekhemjlekhiinZagvarMutate}
        />
      ),
      footer,
    });
  }

  function hevlekh() {
    if (!songogdsonDans) {
      message.warning("Данс сонгоно уу");
      return;
    }
    if (!barimt) {
      message.warning("Нэхэмжлэхийн төрөл сонгоно уу");
      return;
    }
    if (!songogdsonGereenuud || songogdsonGereenuud?.length === 0) {
      message.warning("Гэрээ сонгоно уу");
      return;
    }
    handlePrint();
  }

  const nekhemjlekhuud = useMemo(() => {
    if (barimt && songogdsonGereenuud)
      return songogdsonGereenuud?.map((a, i) => {
        var zagvar = nekhemjlekhiinZagvar?.jagsaalt?.find(
          (a) => a._id === barimt
        )?.nekhemjlekh;
        var khuudasniiKhemjee = nekhemjlekhiinZagvar?.jagsaalt?.find(
          (a) => a._id === barimt
        )?.khuudasniiKhemjee;
        var chiglel = nekhemjlekhiinZagvar?.jagsaalt?.find(
          (a) => a._id === barimt
        )?.chiglel;
        const medeelel = _.cloneDeep(
          nekhemjleliinJagsaalt.find((n) => n._id === a)
        );
        const barilga = baiguullaga.barilguud.find(
          (a) => a._id === medeelel?.barilgiinId
        );

        if (!!zagvar) {
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
            dans?.bank === "tdb" ? "Худалдаа хөгжлийн банк" : "Хаан банк";
          medeelel.dansniiNer = dans?.dansniiNer;
          medeelel.aldangiinUldegdel =
            formatNumber(medeelel.aldangiinUldegdel) || "";
          medeelel.albanTushaal = medeelel.albanTushaal || "";
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
          medeelel.talbainNegjUne = formatNumber(medeelel.talbainNegjUne);
          medeelel.talbainNiitUne = formatNumber(medeelel.talbainNiitUne);

          medeelel.gariinUseg = renderToString(
            <span style={{ position: "absolute" }}>
              <img
                src={`https://turees.zevtabs.mn/api/file?path=gariinUseg/${barilga.gariinUseg}`}
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
                src={`https://turees.zevtabs.mn/api/file?path=tamga/${barilga.tamga}`}
                style={{
                  width: 115,
                  height: 100,
                  transform: "translate(-10%, -50%)",
                  opacity: 0.65,
                }}
              />
            </span>
          );
          medeelel.umnukhSariinUrTulbur = formatNumber(
            medeelel.umnukhSariinUrTulbur
          );

          medeelel.khevlesenOgnoo = moment().format("YYYY-MM-DD");

          medeelel.niitAshiglaltiinZardal = formatNumber(
            medeelel.niitAshiglaltiinZardal
          );

          medeelel.sar = moment().format("MM");
          medeelel.ekhlekhOn = moment().format("YYYY");
          medeelel.ekhelkhSar = moment().format("MM");
          medeelel.ekhlekhUdur = moment().format("DD");
          medeelel.duusakhOn = moment().format("YYYY");
          medeelel.duusakhSar = moment().format("MM");
          medeelel.duusakhUdur = moment().format("DD");

          medeelel.nekhemjlekhiinDugaar =
            moment().format("YY") + "/" + (dugaarlalt + i);

          for (const [key, value] of Object.entries(medeelel)) {
            if (key !== "nemeltNekhemjlekh")
              zagvar = zagvar?.replace(
                new RegExp(`&lt;${key}&gt;`, "g"),
                value
              );
          }
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
          zagvar = zagvar?.replace(
            new RegExp(
              `<tr><td colspan="12" rowspan="1"><div>​<span class="se-custom-tag">&lt;nemeltNekhemjlekh&gt;</span>​​<br></div></td></tr>`
            ),
            nemeltNekhemjlekh
          );
        }
        return { zagvar, mail: medeelel.mail, khuudasniiKhemjee, chiglel };
      });
    return [];
  }, [barimt, songogdsonGereenuud]);

  function send() {
    if (!barimt) {
      message.warning("Нэхэмжлэхийн төрөл сонгоно уу");
      return;
    } else if (!songogdsonGereenuud || songogdsonGereenuud?.length === 0) {
      message.warning("Гэрээ сонгоно уу");
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

  function turulSongokh(mur) {
    setTurul(mur);
    setContent(undefined);
    setBarimt(undefined);
    setDans(undefined);
  }
  var zagvar = nekhemjlekhiinZagvar?.jagsaalt?.find(
    (a) => a._id === barimt
  )?.nekhemjlekh;

  async function msgIlgeeye() {
    var msgnuud = [];
    songogdsonGereenuud.map((mur) => {
      var nekhemjlekh = _.cloneDeep(
        nekhemjleliinJagsaalt.find((a) => a._id === mur)
      );
      var text = msj;
      for (const [key, value] of Object.entries(nekhemjlekh)) {
        text = text?.replace(new RegExp(`<${key}>`, "g"), value);
      }
      if (_.isArray(nekhemjlekh.utas))
        nekhemjlekh.utas.map((to) =>
          msgnuud.push({
            to,
            text,
          })
        );
      else
        msgnuud.push({
          to: nekhemjlekh.utas,
          text,
        });
    });

    uilchilgee(token)
      .post(`/msgIlgeeye`, { barilgiinId, msgnuud })
      .then(({ data }) => {
        if (data && data[0].Result === "SUCCESS") {
          notification.success({ message: "SMS Амжилттай илгээлээ" });
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  function mailIlgeeye() {
    if (!barimt) {
      message.warning("Нэхэмжлэхийн төрөл сонгоно уу");
      return;
    }
    if (!songogdsonGereenuud || songogdsonGereenuud?.length === 0) {
      message.warning("Гэрээ сонгоно уу");
      return;
    }
    if (loading) {
      message.warning("И-мэйл илгээгдсэн байна");
      return;
    }
    const mailuud = [];
    songogdsonGereenuud.map((mur) => {
      var nekhemjlekh = _.cloneDeep(
        nekhemjleliinJagsaalt.find((a) => a._id === mur)
      );
      var text = nekhemjlekhiinZagvar?.jagsaalt?.find(
        (a) => a._id === barimt
      )?.nekhemjlekh;

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
        dans?.bank === "tdb" ? "Худалдаа хөгжлийн банк" : "Хаан банк";
      nekhemjlekh.dansniiNer = dans?.dansniiNer;

      nekhemjlekh.aldangiinUldegdel =
        formatNumber(nekhemjlekh.aldangiinUldegdel) || "";
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

      nekhemjlekh.niitAshiglaltiinZardal = formatNumber(
        nekhemjlekh.niitAshiglaltiinZardal
      );

      nekhemjlekh.sar = moment().format("MM");
      nekhemjlekh.ekhlekhOn = moment().format("YYYY");
      nekhemjlekh.ekhelkhSar = moment().format("MM");
      nekhemjlekh.ekhlekhUdur = moment().format("DD");
      nekhemjlekh.duusakhOn = moment().format("YYYY");
      nekhemjlekh.duusakhSar = moment().format("MM");
      nekhemjlekh.duusakhUdur = moment().format("DD");

      for (const [key, value] of Object.entries(nekhemjlekh)) {
        text = text?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
      }
      if (!!nekhemjlekh.mail) {
        mailuud.push({
          mail: nekhemjlekh.mail,
          content: text,
        });
      }
    });
    setLoading(true);
    uilchilgee(token)
      .post(`/mailOlnoorIlgeeye`, { mailuud, subject: "Түрээсийн төлбөр" })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: "И-мэйл Амжилттай илгээлээ" });
          setLoading(false);
        }
      })
      .catch((e) => {
        setLoading(false);
        aldaaBarigch(e);
      });
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
            dans?.bank === "tdb" ? "Худалдаа хөгжлийн банк" : "Хаан банк";
          medeelel.dansniiNer = dans?.dansniiNer;
          medeelel.aldangiinUldegdel =
            formatNumber(medeelel.aldangiinUldegdel) || "";
          medeelel.albanTushaal = medeelel.albanTushaal || "";
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
          medeelel.talbainNegjUne = formatNumber(medeelel.talbainNegjUne);
          medeelel.talbainNiitUne = formatNumber(medeelel.talbainNiitUne);
          medeelel.umnukhSariinUrTulbur = formatNumber(
            medeelel.umnukhSariinUrTulbur
          );

          medeelel.khevlesenOgnoo = moment().format("YYYY-MM-DD");

          medeelel.niitAshiglaltiinZardal = formatNumber(
            medeelel.niitAshiglaltiinZardal
          );

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
                  message: `Notification Амжилттай илгээлээ`,
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

      nekhemjlekh.mungunDunUsgeer = numberToWords(
        nekhemjlekh.sariinTurees,
        { fixed: 2, suffix: "n" },
        "төгрөг",
        "мөнгө"
      );
      nekhemjlekh.dans = dans?.dugaar;
      nekhemjlekh.bank =
        dans?.bank === "tdb" ? "Худалдаа хөгжлийн банк" : "Хаан банк";
      nekhemjlekh.dansniiNer = dans?.dansniiNer;

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

      nekhemjlekh.niitAshiglaltiinZardal = formatNumber(
        nekhemjlekh.niitAshiglaltiinZardal
      );

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
            message: `Notification Амжилттай илгээлээ`,
          });
        });
      return;
    });
  }

  function nekhemjlelZasya(mur, index) {
    const footer = [
      <Button onClick={() => dunZasvarRef.current.khaaya()}>Хаах</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => dunZasvarRef.current.khadgalya()}
      >
        Хадгалах
      </Button>,
    ];
    modal({
      title: "Нэхэмжлэл засвар",
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
    deleteMethod("nekhemjlekhiinZagvar", token, mur?._id)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setWaiting(false);
          message.success("Устгагдлаа");
          nekhemjlekhiinZagvarMutate();
        }
      })
      .catch((e) => {
        setwaiting(false);
        aldaaBarigch(e);
      });
  }

  return (
    <Admin
      title="Нэхэмжлэл"
      khuudasniiNer="nekhemjlel"
      className="p-0 md:p-4"
      onSearch={(search) => {
        setNekhemjlelKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
      }}
      tsonkhniiId="61c2c6d91c2830c4e6f90cbd"
      loading={isValidating || waiting}
    >
      <Card
        className="cardgrid col-span-12"
        style={{ minHeight: "calc(100vh - 12rem)" }}
      >
        <Spin spinning={loading}>
          <div className="grid w-full grid-cols-2" ref={printRef}>
            {nekhemjlekhuud?.map((nekhemjlekh, i) => {
              return (
                <div
                  key={`khevlekhNekhemjlel${i}`}
                  className={`print ${nekhemjlekh.khuudasniiKhemjee} sun-editor-editable p-10"`}
                  dangerouslySetInnerHTML={{ __html: nekhemjlekh.zagvar }}
                />
              );
            })}
          </div>
          <div
            className="mt-5 flex w-full flex-row"
            data-aos="zoom-in-left"
            data-aos-duration="1000"
          >
            <div className="ml-auto space-x-2  ">
              <DatePicker
                clearIcon
                placeholder="Огноо сонгох"
                style={{ marginBottom: "20px" }}
                value={ognoo}
                onChange={setOgnoo}
              />
              <Select
                placeholder="Дансны төрөл"
                value={songogdsonDans}
                onChange={setDans}
              >
                {dansGaralt?.jagsaalt?.map((a) => (
                  <Select.Option key={a.dugaar} value={a.dugaar}>
                    <div>{a.dugaar}</div>
                  </Select.Option>
                ))}
              </Select>
              <Select
                allowClear
                placeholder="Давхар"
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
                className="w-[200px]"
                placeholder="Нэхэмжлэхийн төрөл"
                value={barimt}
                onChange={(content) => {
                  setBarimt(content);
                  setContent(content);
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
              {turul === "Mail" ? (
                <Button
                  hidden={turul !== "Mail"}
                  type="primary"
                  onClick={hevlekh}
                >
                  Хэвлэх
                </Button>
              ) : (
                ""
              )}
              <Button onClick={send}>Илгээх</Button>
            </div>
          </div>
          <div className="grid grid-cols-8 gap-2">
            <div
              className="col-span-2 rounded-md px-2 "
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="500"
            >
              <div className="box mb-3 space-y-3 bg-gray-100 p-2">
                <div
                  className="grid grid-cols-3 gap-1  font-medium"
                  role="tablist"
                >
                  {["SMS", "App", "Mail"].map((mur) => (
                    <div
                      key={mur}
                      className={`flex-1 cursor-pointer rounded-md py-2 text-center ${
                        turul === mur ? "bg-green-500 text-white" : ""
                      }`}
                      onClick={() => turulSongokh(mur)}
                    >
                      {mur}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex w-full justify-between">
                <Button
                  className="ml-auto bg-green-500 text-white"
                  onClick={() =>
                    turul === "SMS"
                      ? smsZagvarNemya()
                      : turul === "App"
                      ? smsZagvarNemya()
                      : router.push("/khyanalt/tulburTootsoo/nekhemjlel/new")
                  }
                >
                  Загвар үүсгэх
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                {nekhemjlekhiinZagvar?.jagsaalt?.map((a, i) =>
                  a.turul === turul ? (
                    <div
                      key={`zagvar${i}`}
                      className="flex flex-row items-center space-x-2 rounded-md border border-gray-200 p-2 shadow-md"
                    >
                      <Image src="/invoice.png" width={32} height={32} />
                      <div className="font-medium">{a.ner}</div>
                      <div style={{ marginLeft: "auto" }}>
                        <Popconfirm
                          title="Загвар устгах уу?"
                          okText="Тийм"
                          cancelText="Үгүй"
                          onConfirm={() => zagvarUstgaya(a)}
                        >
                          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 fill-current  p-2  text-white dark:bg-gray-700">
                            <DeleteOutlined
                              style={{ color: "red", display: "flex" }}
                            />
                          </div>
                        </Popconfirm>
                      </div>
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
                        <EditOutlined
                          style={{ display: "flex", color: "#85C1E9" }}
                        />
                      </div>
                    </div>
                  ) : turul === "Mail" ? (
                    a.turul === undefined ? (
                      <div
                        key={`zagvar${i}`}
                        className="flex flex-row items-center space-x-2 rounded-md border border-gray-200 p-2 shadow-md"
                      >
                        <Image src="/invoice.png" width={32} height={32} />
                        <div className="font-medium">{a.ner}</div>
                        <div style={{ marginLeft: "auto" }}>
                          <Popconfirm
                            title="Загвар устгах уу?"
                            okText="Тийм"
                            cancelText="Үгүй"
                            onConfirm={() => zagvarUstgaya(a)}
                          >
                            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 fill-current  p-2  text-white dark:bg-gray-700">
                              <DeleteOutlined
                                style={{ color: "red", display: "flex" }}
                              />
                            </div>
                          </Popconfirm>
                        </div>
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
              className="col-span-6"
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
                    title: "Гэрээ №",
                    dataIndex: "gereeniiDugaar",
                    width: "7rem",
                    align: "center",
                  },
                  {
                    title: "Талбай №",
                    showSorterTooltip: false,
                    sorter: (a, b) => a.talbainDugaar - b.talbainDugaar,
                    dataIndex: "talbainDugaar",
                    width: "7rem",
                    align: "center",
                  },
                  {
                    title: "Дараагийн төлөх огноо",
                    showSorterTooltip: false,
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
                    title: "Өмнөх хуримтлагдсан өр төлбөр",
                    showSorterTooltip: false,
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
                    title: "Энэ сард төлөх дүн",
                    showSorterTooltip: false,
                    sorter: (a, b) => a.eneSardTulukhDun - b.eneSardTulukhDun,
                    dataIndex: "eneSardTulukhDun",
                    render(a) {
                      return formatNumber(a);
                    },
                    ellipsis: true,
                    align: "center",
                  },
                  {
                    title: "Нийт үлдэгдэл",
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
                    title: "Төлөв",
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
