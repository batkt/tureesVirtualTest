import { Button, DatePicker, message, Modal, notification, Select } from "antd";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import useNekhemjlekhiinZagvar from "hooks/tulburTootsoo/useNekhemjlekhiinZagvar";
import useDans from "hooks/useDans";
import { useReactToPrint } from "react-to-print";
import useNekhemjlekh from "hooks/tulburTootsoo/useNekhemjlekh";
import { toWords } from "mon_num";
import formatNumber from "tools/function/formatNumber";
import moment from "moment";
import useNekhemjlekhDugaarlalt from "hooks/tulburTootsoo/useNekhemjlekhDugaarlalt";

const ilgeekhTurul = "davkharaar";

function GuilgeeKhiikh({ data, token, onFinish, destroy, t }, ref) {
  const { dansGaralt } = useDans(token, data?.baiguullagiinId);
  const printRef = React.useRef(null);
  const [songogdsonDans, setDans] = React.useState();
  const [barimt, setBarimt] = React.useState();
  const { nekhemjlekhiinZagvar } = useNekhemjlekhiinZagvar(
    token,
    data.barilgiinId
  );

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
    data.barilgiinId,
    data._id
  );

  const nekhemjlekh = useMemo(() => {
    if (barimt && data)
      var zagvar = nekhemjlekhiinZagvar?.jagsaalt?.find(
        (a) => a._id === barimt
      )?.nekhemjlekh;
    const medeelel = _.get(nekhemjlel, "jagsaalt.0");
    if (!!zagvar && !!medeelel) {
      medeelel.eneSardTulukhUsgeer = `${toWords(
        medeelel.eneSardTulukhDun * (medeelel.eneSardTulukhDun < 0 ? -1 : 1),
        { suffix: "n" }
      )} төгрөг`;
      medeelel.niitUldegdelUsgeer = `${toWords(
        medeelel.niitUldegdel * (medeelel.niitUldegdel < 0 ? -1 : 1),
        { suffix: "n" }
      )} төгрөг`;
      medeelel.mungunDunUsgeer = `${toWords(medeelel.sariinTurees, {
        suffix: "n",
      })} төгрөг`;
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
      const dans = dansGaralt?.jagsaalt?.find(
        (a) => a.dugaar === songogdsonDans
      );
      medeelel.dans = dans?.dugaar;
      medeelel.bank =
        dans?.bank === "tdb" ? "Худалдаа хөгжлийн банк" : "Хаан банк";
      medeelel.dansniiNer = dans?.dansniiNer;

      medeelel.nekhemjlekhiinDugaar = moment().format("YY") + "/" + dugaarlalt;

      for (const [key, value] of Object.entries(medeelel)) {
        if (key !== "nemeltNekhemjlekh")
          zagvar = zagvar?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
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
    return { zagvar, mail: medeelel?.mail };
  }, [barimt, nekhemjleliinJagsaalt, nekhemjlel]);

  function maileerIlgeekh() {
    if (!barimt) {
      message.warning("Нэхэмжлэхийн төрөл сонгоно уу");
      return;
    }
    if (loading) {
      message.warning("И-мэйл илгээгдсэн байна");
      return;
    }
    var mailuud = [];
    mailuud.push({
      mail: nekhemjlekh.mail,
      content: nekhemjlekh.zagvar,
    });
    setLoading(true);
    uilchilgee(token)
      .post(`/mailOlnoorIlgeeye`, { mailuud, subject: "Түрээсийн төлбөр" })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: "И-мэйл Амжилттай илгээлээ" });
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
      message.warning("Данс сонгоно уу");
      return;
    }
    if (!barimt) {
      message.warning("Нэхэмжлэхийн төрөл сонгоно уу");
      return;
    }
    handlePrint();
  }

  function garya() {
    if (songogdsonDans !== undefined || barimt !== undefined)
      Modal.confirm({
        content: `Та хадгалахгүй гарахдаа итгэлтэй байна уу?`,
        okText: "Тийм",
        cancelText: "Үгүй",
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
              message: "Амжилттай",
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
        placeholder="Дансны төрөл"
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
        placeholder="Нэхэмжлэхийн төрөл"
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
