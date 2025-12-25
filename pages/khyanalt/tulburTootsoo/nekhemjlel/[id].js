import React, { useRef, useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useRouter } from "next/router";
import { Button, Form, Input, message, Radio, Select } from "antd";
import _ from "lodash";
import { toast } from "sonner";
import { useAuth } from "services/auth";
import readMethod from "tools/function/crud/readMethod";
import { customPlugin } from "components/pageComponents/geree/zagvar/ZaaltOruulakh";
import { renderToString } from "react-dom/server";
import {
  BankOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  FileExcelOutlined,
  LockOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import useJagsaalt from "hooks/useJagsaalt";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import ZagvarExceleesOruulakh from "components/pageComponents/geree/zagvar/ZagvarExceleesOruulakh";
import { modal } from "components/ant/Modal";
import NekhemjlekhZasvar from "components/pageComponents/nekhemjlel/ZagvarUusgekh";

export const complex = [
  ["undo", "redo"],
  ["font", "fontSize", "formatBlock"],
  ["bold", "underline", "italic", "strike", "subscript", "superscript"],
  ["removeFormat"],

  ["fontColor", "hiliteColor"],
  ["outdent", "indent"],
  ["align", "horizontalRule", "list", "table"],
  ["image"],
  ["fullScreen", "showBlocks", "codeView"],
  ["preview", "print"],
];

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
];

const talbainiiTalbaruud = [
  { ner: "Талбайн дугаар", talbar: "talbainDugaar" },
  { ner: "Талбайн нэгж үнэ", talbar: "talbainNegjUne" },
  { ner: "Талбайн нэгж үнэ үсгээр", talbar: "talbainNegjUneUsgeer" },
  { ner: "Талбайн нийт үнэ", talbar: "talbainNiitUne" },
  { ner: "Талбайн нийт үнэ/Нөатгүй/", talbar: "talbainNiitUneNuatgui" },
  { ner: "Талбайн нийт үнэ/Нөат/", talbar: "talbainNiitUneNuat" },
  { ner: "Талбайн нийт үнэ үсгээр", talbar: "talbainNiitUneUsgeer" },
  { ner: "Талбайн хэмжээ", talbar: "talbainKhemjee" },
  { ner: "Түрээсийн талбайн давхар", talbar: "davkhar" },
  { ner: "Зардлын дүн", talbar: "zardliinDun" },
  { ner: "Зориулалт", talbar: "zoriulalt" },
  { ner: "Тусгай зориулалт", talbar: "tusgaiZoriulalt" },
  { ner: "Талбайн нэмэлт нөхцөл", talbar: "talbaiNemeltNukhtsul" },
];

const baritsaaniiTalbaruud = [
  { ner: t("Барьцаа авах дүн"), talbar: "baritsaaAvakhDun" },
  {
    ner: t("Барьцаа байршуулах хугацаа"),
    talbar: "baritsaaBairshuulakhKhugatsaa",
  },
];

const tulburiinTalbaruud = [
  { ner: "Хөнгөлөх хугацаа", talbar: "khungulukhKhugatsaa" },
  { ner: "Сарын түрээс", talbar: "sariinTurees" },
  { ner: "Мөнгөн дүн үсгээр", talbar: "mungunDunUsgeer" },
  { ner: "Энэ сард төлөх дүн", talbar: "eneSardTulukhDun" },
  { ner: "Нийт үлдэгдэл", talbar: "niitUldegdel" },
  { ner: "Нийт үлдэгдэл/Нөатгүй/", talbar: "niitUldegdelNuatgui" },
  { ner: "Нийт үлдэгдэл/Нөат/", talbar: "niitUldegdelNuat" },
  { ner: "Алдангын үлдэгдэл", talbar: "aldangiinUldegdel" },
  { ner: "Нийт авлагын үлдэгдэл", talbar: "niitAvlagaUldegdel" },
  { ner: "Түрээсийн хөнгөлөлт", talbar: "khungulult" },
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

function getSize(khemjee, orientation) {
  let width = "210mm";
  let height = "297mm";
  switch (khemjee) {
    case "A4":
      width = "210mm";
      height = "297mm";
      break;
    case "A5":
      width = "148mm";
      height = "210mm";
      break;

    default:
      break;
  }
  if (
    (khemjee !== "A5" && orientation === "landscape") ||
    (khemjee === "A5" && orientation !== "landscape")
  )
    return { width: height, height: width };
  return { width, height };
}

function ZakhialgaNemekh({ token }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [nekhemjlelZagvar, setNekhemjlelZagvar] = React.useState({
    khuudasniiKhemjee: "A4",
    chiglel: "landscape",
  });
  const [kharuulakhExcel, setKharuulakhExcel] = React.useState(null);
  const excelRef = useRef(null);
  const { barilgiinId } = useAuth();
  const [waiting, setWaiting] = useState(false);
  const ashiglaltiinZardal = useJagsaalt("/ashiglaltiinZardluud", {
    barilgiinId: barilgiinId,
  });

  React.useEffect(() => {
    if (id !== "new")
      readMethod("nekhemjlekhiinZagvar", token, id).then(({ data }) => {
        if (data) {
          setNekhemjlelZagvar({ ...data });
        }
      });
  }, [id]);

  React.useEffect(() => {
    if (
      nekhemjlelZagvar &&
      nekhemjlelZagvar?._id &&
      nekhemjlelZagvar?.nekhemjlekh === "excel"
    ) {
      uilchilgee(token)
        .post("/excelZagvarKharya", {
          excelNer: nekhemjlelZagvar?.ner,
          barilgiinId: barilgiinId,
        })
        .then((res) => {
          setKharuulakhExcel(res.data);
        });
    }
  }, [nekhemjlelZagvar]);

  const { width, height } = React.useMemo(() => {
    return getSize(
      nekhemjlelZagvar?.khuudasniiKhemjee,
      nekhemjlelZagvar?.chiglel
    );
  }, [nekhemjlelZagvar.khuudasniiKhemjee, nekhemjlelZagvar.chiglel]);

  const custom = React.useMemo(() => {
    if (typeof window === "undefined") return [];
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
      title: t("Төлбөр"),
      button: renderToString(<DollarCircleOutlined />),
    });

    const nekhemjlel = customPlugin({
      songokhTalbaruud: nekhemjlekhiinTalbaruud,
      name: "nekhemjlel",
      title: t("Нэхэмжлэл"),
      button: renderToString(<DollarCircleOutlined />),
    });

    const nekhemjlelNemelt = customPlugin({
      songokhTalbaruud: nekhemjlekhiinNemelt,
      name: "nekhemjlekhiinNemelt",
      title: t("Нэхэмжлэхийн бусад авлага"),
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
  }, [ashiglaltiinZardal]);

  function khadgalya(e) {
    if (nekhemjlelZagvar.ner) {
      setWaiting(true);
      nekhemjlelZagvar.barilgiinId = barilgiinId;
      if (e === "excel") {
        nekhemjlelZagvar.nekhemjlekh = "excel";
      }
      const method = nekhemjlelZagvar?._id ? updateMethod : createMethod;
      method("nekhemjlekhiinZagvar", token, nekhemjlelZagvar)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            toast.success(t("Амжилттай хадгаллаа"));
            router.back();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else toast.warning(t("Нэр оруулна уу!"));
  }
  function onChange(e) {
    setNekhemjlelZagvar((nekhemjlelZagvar) => ({
      ...nekhemjlelZagvar,
      khuudasniiKhemjee: e.target.value,
    }));
  }
  function rotate(e) {
    setNekhemjlelZagvar((nekhemjlelZagvar) => ({
      ...nekhemjlelZagvar,
      chiglel: e,
    }));
  }
  function handleChange(e) {
    setNekhemjlelZagvar((nekhemjlelZagvar) => ({
      ...nekhemjlelZagvar,
      nekhemjlekh: e,
    }));
  }
  function inputOnchange(e) {
    setNekhemjlelZagvar((nekhemjlelZagvar) => ({
      ...nekhemjlelZagvar,
      ner: e.target.value,
      turul: "Mail",
    }));
  }

  function zagvarOruulakhExcel() {
    const footer = [
      <Button onClick={() => excelRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button
        type="primary"
        onClick={() => {
          khadgalya("excel");
          excelRef.current.khaaya();
        }}
      >
        {t("Хадгалах")}
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <ZagvarExceleesOruulakh
          ref={excelRef}
          token={token}
          nekhemjlelZagvar={nekhemjlelZagvar}
          zam="excelZagvarOruulya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Нэхэмжлэл загварын excel файл"
          barilgiinId={barilgiinId}
        />
      ),
      footer,
    });
  }

  return (
    <Admin
      khuudasniiNer="zakhialgiinKhyanalt"
      title="Нэхэмжлэлийн загвар угсрах"
      tsonkhniiId={"655445520b4208a0709c8105"}
      hideSearch
      dedKhuudas
      className="p-4"
      loading={waiting}
    >
      <div className=" relative col-span-12 flex grid-cols-12 flex-col-reverse lg:grid ">
        <div
          style={{ height: "calc(100vh - 7rem)" }}
          className="col-span-12 overflow-auto p-10 lg:col-span-9"
        >
          {!ashiglaltiinZardal?.isValidating && !kharuulakhExcel && (
            <NekhemjlekhZasvar
              onChange={(e) => handleChange(e)}
              value={nekhemjlelZagvar?.nekhemjlekh}
              setContents={nekhemjlelZagvar?.nekhemjlekh}
              ashiglaltiinZardal={ashiglaltiinZardal}
              height={height}
            />
          )}
          {kharuulakhExcel && (
            <div className="flex h-full w-full select-none overflow-y-auto rounded-lg bg-white p-4 shadow-lg ">
              <div
                className="flex h-full w-full"
                dangerouslySetInnerHTML={{
                  __html: kharuulakhExcel,
                }}
              />
            </div>
          )}
        </div>
        <div className="col-span-12 rounded-xl bg-white p-10 dark:bg-gray-900 lg:col-span-3">
          <div className="space-y-2">
            <Form.Item name="_id" noStyle />
            <Input
              disabled={!!kharuulakhExcel}
              value={nekhemjlelZagvar.ner}
              onChange={(v) => inputOnchange(v)}
              placeholder={t("Нэр")}
            />
            <Form.Item
              label="Нэхэмжлэхийн загвар"
              name="nekhemjlekh"
              noStyle
            ></Form.Item>

            <div className="mt-3 flex items-center justify-between">
              <Radio.Group
                disabled={!!kharuulakhExcel}
                className="my-3"
                onChange={onChange}
                value={nekhemjlelZagvar.khuudasniiKhemjee}
              >
                <Radio value={"A4"}>A4</Radio>
                <Radio value={"A5"}>A5</Radio>
              </Radio.Group>
              <Select
                disabled={!!kharuulakhExcel}
                className="w-28"
                value={nekhemjlelZagvar.chiglel}
                onChange={rotate}
                menuItemSelectedIcon={<CheckOutlined />}
                suffixIcon={<img src="/rotate.svg" width={"16px"} />}
              >
                <Select.Option value={"portrait"}>portrait</Select.Option>
                <Select.Option value={"landscape"}>landscape</Select.Option>
              </Select>
            </div>
            <Form.Item>
              <Button
                onClick={khadgalya}
                disabled={!!kharuulakhExcel}
                style={{
                  backgroundColor: "#209669",
                  color: "#ffffff",
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                {t("Хадгалах")}
              </Button>
            </Form.Item>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default ZakhialgaNemekh;
