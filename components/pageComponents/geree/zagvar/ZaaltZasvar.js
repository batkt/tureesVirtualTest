import React from "react";
import { renderToString } from "react-dom/server";
import _ from "lodash";
import { customPlugin } from "./ZaaltOruulakh";
import {
  BankOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  LockOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Input, Modal, Select } from "antd";
import dynamic from "next/dynamic";
import { t } from "i18next";
import TipTapEditor from "components/TipTapEditor";
import { createButtonWithItems } from "components/TipTapEditorHelper";

export const basic = [
  ["font", "fontSize"],
  ["fontColor"],
  ["horizontalRule"],
  ["link", "image"],
];

export const complex = [
  ["undo", "redo"],
  ["font", "fontSize", "formatBlock"],
  ["bold", "underline", "italic", "strike", "subscript", "superscript"],
  ["removeFormat"],
  "/",
  ["fontColor", "hiliteColor"],
  ["outdent", "indent"],
  ["align", "horizontalRule", "list", "table"],
  ["link", "image", "video"],
  ["fullScreen", "showBlocks", "codeView"],
  ["preview", "print"],
  ["save", "template"],
];

export const formatting = [
  ["undo", "redo"],
  ["bold", "underline", "italic", "strike", "subscript", "superscript"],
  ["removeFormat"],
  ["outdent", "indent"],
  ["fullScreen", "showBlocks", "codeView"],
  ["preview", "print"],
];

const undsenTalbaruud = [
  { ner: "Овог", talbar: "ovog" },
  { ner: "Нэр", talbar: "ner" },
  { ner: "Барилгын хаяг", talbar: "barilgiinKhayag" },
  { ner: "Гэрээний дугаар", talbar: "gereeniiDugaar" },
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
  { ner: "И-мэйл хаяг", talbar: "mail" },
  { ner: "Гарын үсэг", talbar: "gariinUseg" },
  { ner: "Тамга", talbar: "tamga" },
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
  { ner: "Талбайн хэмжээ м2", talbar: "talbainKhemjee" },
  { ner: "Талбайн хэмжээ м3", talbar: "talbainKhemjeeMetrKube" },
  { ner: "Түрээсийн талбайн давхар", talbar: "davkhar" },
  { ner: "Зардлын дүн", talbar: "zardliinDun" },
  { ner: "Зориулалт", talbar: "zoriulalt" },
  { ner: "Тусгай зориулалт", talbar: "tusgaiZoriulalt" },
  { ner: "Талбайн нэмэлт нөхцөл", talbar: "talbaiNemeltNukhtsul" },
];

const baritsaaniiTalbaruud = [
  { ner: "Барьцаа авах дүн", talbar: "baritsaaAvakhDun" },
  { ner: "Барьцаа авах дүн үсгээр", talbar: "baritsaaAvakhDunUsgeer" },
  {
    ner: t("Барьцаа байршуулах хугацаа"),
    talbar: "baritsaaBairshuulakhKhugatsaa",
  },
];

const tulburiinTalbaruud = [
  { ner: t("Хөнгөлөх хугацаа"), talbar: "khungulukhKhugatsaa" },
  { ner: t("Сарын түрээс"), talbar: "sariinTurees" },
  { ner: t("Сарын нийлбэр дүн"), talbar: "sariinNiilberDun" },
  { ner: t("Мөнгөн дүн үсгээр"), talbar: "mungunDunUsgeer" },
  { ner: t("Шаталсан хөнгөлөлт"), talbar: "shatalsanKhungulult" },
];

function ZaaltZasvar({ destroy, value, change, zardal }, ref) {
  const editorRef = React.useRef();
  const [utga, setUtga] = React.useState(value);

  function garya() {
    if (utga !== value)
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: destroy,
      });
    else destroy();
  }

  React.useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        change(utga);
        destroy();
      },
      khaaya() {
        garya();
      },
    }),
    [utga]
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
      title: t("Хугацаа"),
      button: renderToString(<ClockCircleOutlined />),
    });
    const talbai = customPlugin({
      songokhTalbaruud: talbainiiTalbaruud,
      name: "talbai",
      title: t("Түрээсийн талбай"),
      button: renderToString(<BankOutlined />),
    });
    const baritsaa = customPlugin({
      songokhTalbaruud: baritsaaniiTalbaruud,
      name: "baritsaa",
      title: t("Барьцаа"),
      button: renderToString(<LockOutlined />),
    });
    const tulbur = customPlugin({
      songokhTalbaruud: tulburiinTalbaruud,
      name: "tulbur",
      title: t("Төлбөр"),
      button: renderToString(<DollarCircleOutlined />),
    });
    let songokhTalbaruud = [];
    zardal?.jagsaalt?.map((a) => {
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
      songokhTalbaruud: songokhTalbaruud,
      name: "zardaluud",
      title: "Ашиглалтын зардал авлага",
      button: renderToString(<DollarCircleOutlined />),
    });
    return [undsen, khugatsaa, baritsaa, talbai, tulbur, zardaluud];
  }, []);

  const customButtons = React.useMemo(() => {
    const buttons = [
      createButtonWithItems(
        {
          name: "undsen",
          title: "Үндсэн мэдээлэл",
          innerHTML: renderToString(<SolutionOutlined />),
        },
        undsenTalbaruud
      ),
      createButtonWithItems(
        {
          name: "khugatsaa",
          title: t("Хугацаа"),
          innerHTML: renderToString(<ClockCircleOutlined />),
        },
        khugatsaaniiTalbaruud
      ),
      createButtonWithItems(
        {
          name: "talbai",
          title: t("Түрээсийн талбай"),
          innerHTML: renderToString(<BankOutlined />),
        },
        talbainiiTalbaruud
      ),
      createButtonWithItems(
        {
          name: "baritsaa",
          title: t("Барьцаа"),
          innerHTML: renderToString(<LockOutlined />),
        },
        baritsaaniiTalbaruud
      ),
      createButtonWithItems(
        {
          name: "tulbur",
          title: t("Төлбөр"),
          innerHTML: renderToString(<DollarCircleOutlined />),
        },
        tulburiinTalbaruud
      ),
    ];

    // Add zardaluud if zardal exists
    if (zardal?.jagsaalt) {
      let songokhTalbaruud = [];
      zardal.jagsaalt.forEach((a) => {
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
        ner: "Нийт ашиглалтын зардал",
        talbar: "niitZardliinDun",
      });
      songokhTalbaruud.push({
        ner: "Нийт ашиглалтын зардал/Нөатгүй/",
        talbar: "niitZardliinNuatguiDun",
      });
      songokhTalbaruud.push({
        ner: "Нөат (10%)",
        talbar: "niitZardliinNuatiinDun",
      });

      buttons.push(
        createButtonWithItems(
          {
            name: "zardaluud",
            title: "Ашиглалтын зардал авлага",
            innerHTML: renderToString(<DollarCircleOutlined />),
          },
          songokhTalbaruud
        )
      );
    }

    return [buttons];
  }, [zardal, t]);

  if (_.isString(value))
    return (
      <TipTapEditor
        onChange={setUtga}
        value={utga}
        defaultValue={utga}
        height={410}
        customButtons={customButtons}
        ref={editorRef}
      />
    );
  return (
    <React.Fragment>
      <div className="flex w-full flex-row">
        <span className="mr-3 w-1/3 text-right dark:text-gray-200">
          {t("Харагдах дугаар")}:
        </span>
        <div className="w-2/3">
          <Input
            placeholder={t("Харагдах дугаар")}
            value={utga?.kharagdakhDugaar}
            onChange={({ target }) =>
              setUtga((a) => ({ ...a, kharagdakhDugaar: target.value }))
            }
          />
        </div>
      </div>
      <div className="mt-5 flex w-full flex-row">
        <span className="mr-3 w-1/3 text-right dark:text-gray-200">
          {t("Хамаарагдах хэсэг")}:
        </span>
        <Select
          placeholder={t("Хамаарагдах хэсэг")}
          className="w-2/3"
          value={utga?.khamaarakhKheseg}
          onChange={(v) => setUtga((a) => ({ ...a, khamaarakhKheseg: v }))}
        >
          {[
            "Ерөнхий мэдээлэл",
            "Гэрээний хугацаа",
            "Түрээсийн талбай",
            "Барьцаа бүртгэл",
            "Төлбөр тооцоо",
          ].map((a) => (
            <Select.Option value={a}>{t(a)}</Select.Option>
          ))}
        </Select>
      </div>
      <div className="mt-5" />
      <TipTapEditor
        onChange={(v) => setUtga((a) => ({ ...a, zaalt: v }))}
        value={utga?.zaalt}
        defaultValue={utga?.zaalt}
        height={410}
        customButtons={customButtons}
      />
    </React.Fragment>
  );
}

export default React.forwardRef(ZaaltZasvar);
