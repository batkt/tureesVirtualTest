import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useLayoutEffect, useMemo, useState } from "react";
import TableRenderers from "react-pivottable/TableRenderers";
import "react-pivottable/pivottable.css";
import useTailan from "hooks/tailan/useTailan";
import moment from "moment";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import dynamic from "next/dynamic";
import _ from "lodash";
import PivotTableUI from "react-pivottable/PivotTableUI";
import { useAuth } from "services/auth";
import formatNumber from "tools/function/formatNumber";
import { t } from "i18next";

const DynamicPlot = dynamic(import("react-plotly.js"), {
  ssr: false,
});

const service = "analitikTailanAvya";

function converter(key) {
  let ret = undefined;
  switch (key) {
    case "aldangiinUldegdel":
      ret = "Алдангийн үлдэгдэл";
      break;
    case "baiguullagiinNer":
      ret = "Байгууллагын нэр";
      break;
    case "baritsaaAvakhDun":
      ret = "Барьцаа авах дүн";
      break;
    case "baritsaaAvakhKhugatsa":
      ret = "Барьцаа авах хугацаа";
      break;
    case "baritsaaBairshuulakhKhugatsaa":
      ret = "Барьцаа байршуулах хугацаа";
      break;
    case "baritsaaniiUldegdel":
      ret = "Барьцааны үлдэгдэл";
      break;
    case "khariltsagchiinKhayag":
      ret = "Хаяг";
      break;
    case "dans":
      ret = "Данс";
      break;
    case "daraagiinTulukhOgnoo":
      ret = "Дараагийн төлөх огноо";
      break;
    case "davkhar":
      ret = "Давхар";
      break;
    case "duusakhOgnoo":
      ret = "Дуусах огноо";
      break;
    case "gereeniiDugaar":
      ret = "Гэрээний дугаар";
      break;
    case "gereeniiOgnoo":
      ret = "Гэрээний огноо";
      break;
    case "idevkhiteiEsekh":
      ret = "Идэвхтэй эсэх";
      break;
    case "khugatsaa":
      ret = "Хугацаа";
      break;
    case "khungulukhEsekh":
      ret = "Хөнгөлөх эсэх";
      break;
    case "mail":
      ret = "И-мэйл";
      break;
    case "ner":
      ret = "Нэр";
      break;
    case "ovog":
      ret = "Овог";
      break;
    case "register":
      ret = "Регистр";
      break;
    case "sariinTurees":
      ret = "Сарын түрээс";
      break;
    case "segmentuud":
      ret = "Ангилал";
      break;
    case "talbainDugaar":
      ret = "Талбайн дугаар";
      break;
    case "talbainKhemjee":
      ret = "Талбайн хэмжээ";
      break;
    case "talbainNegjUne":
      ret = "Талбайн нэгж үнэ";
      break;
    case "talbainNiitUne":
      ret = "Тайлан нийт үнэ";
      break;
    case "tulukhUdur":
      ret = "Төлөх өдөр";
      break;
    case "tuluv":
      ret = "Төлөв";
      break;
    case "turul":
      ret = "Төрөл";
      break;
    case "uldegdel":
      ret = "Үлдэгдэл";
      break;
    case "utas":
      ret = "Утас";
      break;
    case "zardluud":
      ret = "Зардлууд";
      break;
    default:
      break;
  }
  return ret;
}

function Tailan({ token }) {
  const { barilgiinId } = useAuth();

  const query = useMemo(
    () => ({
      barilgiinId,
    }),
    [barilgiinId]
  );

  const tailan = useTailan(service, token, query);
  const [table, setTable] = useState({});
  const [SSR, setSSR] = useState(false);

  const data = useMemo(() => {
    let array = [];
    //return tailan?.tailanGaralt || [];

    if (tailan?.tailanGaralt?.length > 0) {
      tailan?.tailanGaralt.forEach((tmur) => {
        tmur.aldangiinUldegdel = formatNumber(tmur.aldangiinUldegdel) || 0;
        tmur.baiguullagiinNer = tmur.baiguullagiinNer || "";
        tmur.baritsaaAvakhDun = formatNumber(tmur.baritsaaAvakhDun) || 0;
        tmur.baritsaaAvakhKhugatsa = tmur.baritsaaAvakhKhugatsa || "";
        tmur.baritsaaBairshuulakhKhugatsaa =
          tmur.baritsaaBairshuulakhKhugatsaa || "";
        tmur.baritsaaniiUldegdel = formatNumber(tmur.baritsaaniiUldegdel) || 0;
        tmur.khariltsagchiinKhayag = tmur.khariltsagchiinKhayag || "";
        tmur.dans = tmur.dans || "";
        tmur.daraagiinTulukhOgnoo = tmur.daraagiinTulukhOgnoo || "";
        tmur.davkhar = tmur.davkhar || "";
        tmur.duusakhOgnoo = tmur.duusakhOgnoo || "";
        tmur.gereeniiDugaar = tmur.gereeniiDugaar || "";
        tmur.gereeniiOgnoo = tmur.gereeniiOgnoo || "";
        tmur.idevkhiteiEsekh = tmur.idevkhiteiEsekh || 0;
        tmur.khugatsaa = tmur.khugatsaa || "";
        tmur.khungulukhEsekh = tmur.khungulukhEsekh || "";
        tmur.mail = tmur.mail || "";
        tmur.ner = tmur.ner || "";
        tmur.ovog = tmur.ovog || "";
        tmur.register = tmur.register || "";
        tmur.sariinTurees = formatNumber(tmur.sariinTurees) || 0;
        tmur.segmentuud = tmur.segmentuud || "";
        tmur.talbainDugaar = tmur.talbainDugaar || "";
        tmur.talbainKhemjee = formatNumber(tmur.talbainKhemjee) || "";
        tmur.talbainNegjUne = formatNumber(tmur.talbainNegjUne) || "";
        tmur.talbainNiitUne = formatNumber(tmur.talbainNiitUne) || "";
        tmur.tulukhUdur = tmur.tulukhUdur || "";
        tmur.tuluv = tmur.tuluv || "";
        tmur.turul = tmur.turul || "";
        tmur.uldegdel = formatNumber(tmur.uldegdel) || 0;
        tmur.utas = tmur.utas || 0;
        tmur.zardluud = tmur.zardluud || 0;

        let mur = {};
        Object.entries(tmur).map((v) => {
          if (_.isObject(v[1]) || _.isArray(v[1])) tmur[v[0]] = "";
          else if (_.isNumber(v[1])) tmur[v[0]] = v[1];
          else if (moment(v[1], moment.ISO_8601, true).isValid()) {
            tmur[v[0]] = moment(v[1]).format("YYYY-MM-DD");
          }
          let key = t(converter(v[0]));
          if (key) {
            mur[key] = tmur[v[0]];
          }
        });
        array.push(mur);
      });
    }
    return array;
  }, [tailan]);

  const PlotlyRenderers = useMemo(() => {
    if (!SSR) {
      return createPlotlyRenderers(DynamicPlot);
    }
    return undefined;
  }, [SSR]);

  useLayoutEffect(() => {
    setSSR(typeof window === "undefined");
  }, []);

  return (
    <Admin
      title="Тайлан"
      khuudasniiNer="analytictailan"
      className="p-0 md:p-4"
      tsonkhniiId={"630448aaa612b4cdd5f1fc08"}
    >
      <div className="ag-theme-alpine col-span-12 h-[88vh] overflow-auto">
        {!SSR && !!PlotlyRenderers && (
          <PivotTableUI
            data={data}
            onChange={setTable}
            renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
            {...table}
          />
        )}
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Tailan;
