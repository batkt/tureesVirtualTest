import React, { useEffect } from "react";
import { renderToString } from "react-dom/server";
import _ from "lodash";
import { customPlugin } from "../geree/zagvar/ZaaltOruulakh";
import {
  BankOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  LockOutlined,
  SnippetsOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

import { formatting } from "../geree/zagvar/ZaaltZasvar";

// var instance = null;

const undsenTalbaruud = [
  { ner: "Овог", talbar: "ovog" },
  { ner: "Нэр", talbar: "ner" },
  { ner: "Гэрээний огноо", talbar: "gereeniiOgnoo" },
  { ner: "Төрөл", talbar: "turul" },
  { ner: "Регистр", talbar: "register" },
  { ner: "Бүртгэлийн дугаар", talbar: "customerTin" },
  { ner: "Албан тушаал", talbar: "albanTushaal" },
  { ner: "Захиралын овог", talbar: "zakhirliinOvog" },
  { ner: "Захиралын нэр", talbar: "zakhirliinNer" },
  { ner: "Утас", talbar: "utas" },
  { ner: "Хаяг", talbar: "khayag" },
  { ner: "Нэршил", talbar: "khariltsagchiinNershil" },
  { ner: "Гэрээний дугаар", talbar: "gereeniiDugaar" },
];

const khugatsaaniiTalbaruud = [
  { ner: "Хугацаа", talbar: "khugatsaa" },
  { ner: "Эхлэх он", talbar: "ekhlekhOn" },
  { ner: "Эхлэх сар", talbar: "ekhelkhSar" },
  { ner: "Эхлэх өдөр", talbar: "ekhlekhUdur" },
  { ner: "Дуусах он", talbar: "duusakhOn" },
  { ner: "Дуусах сар", talbar: "duusakhSar" },
  { ner: "Дуусах өдөр", talbar: "duusakhUdur" },
  { ner: "Төлөлт хийгдэх огноо", talbar: "tulukhUdur" },
];

const talbainiiTalbaruud = [
  { ner: "Талбайн дугаар", talbar: "talbainDugaar" },
  { ner: "Талбайн нэгж үнэ", talbar: "talbainNegjUne" },
  { ner: "Талбайн нэгж үнэ үсгээр", talbar: "talbainNegjUneUsgeer" },
  { ner: "Талбайн нийт үнэ", talbar: "talbainNiitUne" },
  { ner: "Талбайн нийт үнэ үсгээр", talbar: "talbainNiitUneUsgeer" },
  { ner: "Талбайн хэмжээ", talbar: "talbainKhemjee" },
  { ner: "Түрээсийн талбайн давхар", talbar: "davkhar" },
  { ner: "Зардлын дүн", talbar: "zardliinDun" },
  { ner: "Зориулалт", talbar: "zoriulalt" },
  { ner: "Тусгай зориулалт", talbar: "tusgaiZoriulalt" },
  { ner: "Талбайн нэмэлт нөхцөл", talbar: "talbaiNemeltNukhtsul" },
];

const baritsaaniiTalbaruud = [
  { ner: "Барьцаа авах дүн", talbar: "baritsaaAvakhDun" },
  {
    ner: "Барьцаа байршуулах хугацаа",
    talbar: "baritsaaBairshuulakhKhugatsaa",
  },
];

const tulburiinTalbaruud = [
  { ner: "Хөнгөлөх хугацаа", talbar: "khungulukhKhugatsaa" },
  { ner: "Сарын түрээс", talbar: "sariinTurees" },
  { ner: "Мөнгөн дүн үсгээр", talbar: "mungunDunUsgeer" },
  { ner: "Энэ сард төлөх дүн", talbar: "eneSardTulukhDun" },
  { ner: "Нийт үлдэгдэл", talbar: "niitUldegdel" },
  { ner: "Алдангын үлдэгдэл", talbar: "aldangiinUldegdel" },
  { ner: "Нийт авлагын үлдэгдэл", talbar: "niitAvlagaUldegdel" },
];

const nekhemjlekhiinTalbaruud = [
  { ner: "Нэхэмжлэхийн сар", talbar: "sar" },
  { ner: "Данс", talbar: "dans" },
  { ner: "Дансны нэр", talbar: "dansniiNer" },
  { ner: "Банк", talbar: "bank" },
  { ner: "Хэвлэсэн огноо", talbar: "khevlesenOgnoo" },
  { ner: "Нэхэмжлэхийн дугаар", talbar: "nekhemjlekhiinDugaar" },
  { ner: "Өмнөх хуримтлагдсан өр төлбөр", talbar: "umnukhSariinUrTulbur" },
  { ner: "Энэ сард төлөх үсгээр", talbar: "eneSardTulukhUsgeer" },
  { ner: "Нийт үлдэгдэл үсгээр", talbar: "niitUldegdelUsgeer" },
  { ner: "Нийт авлагын үлдэгдэл үсгээр", talbar: "niitAvlagaUldegdelUsgeer" },
];

const nekhemjlekhiinNemelt = [
  { ner: "Дугаар", talbar: "№" },
  { ner: "Тайлбар", talbar: "nemeltNekhemjlekh.tailbar" },
  { ner: "Төлөх дүн", talbar: "nemeltNekhemjlekh.tulukhDun" },
  { ner: "Огноо", talbar: "nemeltNekhemjlekh.ognoo" },
  { ner: "Бусад авлагын мөр", talbar: "nemeltNekhemjlekh" },
];

function NekhemjlekhZasvar({
  value,
  ashiglaltiinZardal,
  change,
  onTextChange,
  buttonListCustom = [],
  otherProps,
}) {
  useEffect(() => {
    // onTextChange && onTextChange(instance?.getText());
  }, [value]);

  const SunEditor = React.useMemo(
    () => typeof window !== "undefined" && require("suneditor-react").default,
    []
  );

  const custom = React.useMemo(() => {
    const undsen = customPlugin({
      songokhTalbaruud: undsenTalbaruud,
      name: "undsen",
      title: "Үндсэн мэдээлэл",
      button: renderToString(<SolutionOutlined />),
    });
    const khugatsaa = customPlugin({
      songokhTalbaruud: khugatsaaniiTalbaruud,
      name: "khugatsaa",
      title: "Хугацаа",
      button: renderToString(<ClockCircleOutlined />),
    });
    const baritsaa = customPlugin({
      songokhTalbaruud: talbainiiTalbaruud,
      name: "talbai",
      title: "Түрээсийн талбай",
      button: renderToString(<BankOutlined />),
    });
    const talbai = customPlugin({
      songokhTalbaruud: baritsaaniiTalbaruud,
      name: "baritsaa",
      title: "Барьцаа",
      button: renderToString(<LockOutlined />),
    });
    const tulbur = customPlugin({
      songokhTalbaruud: tulburiinTalbaruud,
      name: "tulbur",
      title: "Төлбөр",
      button: renderToString(<DollarCircleOutlined />),
    });
    const nekhemjlel = customPlugin({
      songokhTalbaruud: nekhemjlekhiinTalbaruud,
      name: "nekhemjlel",
      title: "Нэхэмжлэл",
      button: renderToString(<SnippetsOutlined />),
    });
    const nekhemjlelNemelt = customPlugin({
      songokhTalbaruud: nekhemjlekhiinNemelt,
      name: "nekhemjlekhiinNemelt",
      title: "Нэхэмжлэхийн бусад авлага",
      button: renderToString(<DollarCircleOutlined />),
    });
    var songokhTalbaruud = [];
    ashiglaltiinZardal?.jagsaalt?.map((a) => {
      songokhTalbaruud.push({
        ner: `${a.ner}.Дүн`,
        talbar: `${a.ner}.tulukhDun`,
      });

      songokhTalbaruud.push({
        ner: `${a.ner}.Хэмжих нэгж`,
        talbar: `${a.ner}.khemjikhNegj`,
      });

      songokhTalbaruud.push({
        ner: `${a.ner}.Тариф`,
        talbar: `${a.ner}.tariff`,
      });

      songokhTalbaruud.push({
        ner: `${a.ner}.Тариф үсгээр`,
        talbar: `${a.ner}.tariffUsgeer`,
      });

      songokhTalbaruud.push({
        ner: `${a.ner}.Нэгж`,
        talbar: `${a.ner}.negj`,
      });
      if (a.turul == "кВт" || a.turul == "1м3") {
        songokhTalbaruud.push({
          ner: `${a.ner}.Өмнөх заалт`,
          talbar: `${a.ner}.umnukhZaalt`,
        });
        songokhTalbaruud.push({
          ner: `${a.ner}.Сүүлийн заалт`,
          talbar: `${a.ner}.suuliinZaalt`,
        });
      } else {
        songokhTalbaruud.push({
          ner: `${a.ner}.Хөнгөлөлт`,
          talbar: `${a.ner}.khungulult`,
        });
      }
    });

    songokhTalbaruud.push({
      ner: `Нийт ашиглалтын зардал`,
      talbar: `niitZardliinDun`,
    });

    songokhTalbaruud.push({
      ner: `Нийт ашиглалтын зардал/Нөатгүй/`,
      talbar: `niitZardliinNuatguiDun`,
    });

    songokhTalbaruud.push({
      ner: `Нөат (10%)`,
      talbar: `niitZardliinNuatiinDun`,
    });

    const zardaluud = customPlugin({
      songokhTalbaruud,
      name: "zardaluud",
      title: "Ашиглалтын зардал авлага",
      button: renderToString(<DollarCircleOutlined />),
    });
    return [
      undsen,
      khugatsaa,
      baritsaa,
      talbai,
      tulbur,
      nekhemjlel,
      nekhemjlelNemelt,
      zardaluud,
    ];
  }, []);
  if (SunEditor)
    return (
      <SunEditor
        onChange={change}
        defaultValue={value}
        setContents={value}
        setOptions={{
          plugins: custom,
          buttonList: [
            ...formatting,
            [
              "undsen",
              "khugatsaa",
              "talbai",
              "baritsaa",
              "tulbur",
              "nekhemjlel",
              "nekhemjlekhiinNemelt",
              "zardaluud",
            ],
            ...buttonListCustom,
          ],
        }}
        // getSunEditorInstance={(e) => {
        //   instance = e;
        // }}
        showToolbar={true}
        {...otherProps}
      />
    );
  return <div />;
}

export default NekhemjlekhZasvar;
