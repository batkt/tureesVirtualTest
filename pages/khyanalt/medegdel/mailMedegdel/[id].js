import React, { useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useRouter } from "next/router";
import { Button, Form, Input, message } from "antd";
import _ from "lodash";
import { useAuth } from "services/auth";
import readMethod from "tools/function/crud/readMethod";
import { customPlugin } from "components/pageComponents/geree/zagvar/ZaaltOruulakh";
import { renderToString } from "react-dom/server";
import {
  SolutionOutlined,
  ClockCircleOutlined,
  BankOutlined,
  LockOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { aldaaBarigch } from "services/uilchilgee";
import dynamic from "next/dynamic";
import { t } from "i18next";
import TipTapEditor from "components/TipTapEditor";
import { createButtonWithItems } from "components/TipTapEditorHelper";

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
  if (orientation === "landscape") return { width: height, height: width };
  return { width, height };
}

function ZakhialgaNemekh({ token }) {
  const router = useRouter();
  const { id } = router.query;
  const [mailiinZagvar, setMailiinZagvar] = React.useState({
    khuudasniiKhemjee: "A4",
    chiglel: "portrait",
  });
  const { barilgiinId } = useAuth();
  const [waiting, setWaiting] = useState(false);

  React.useEffect(() => {
    if (id !== "new")
      readMethod("mailiinZagvar", token, id).then(({ data }) => {
        if (data) {
          setMailiinZagvar({ ...data });
        }
      });
  }, [id]);

  const { width, height } = React.useMemo(() => {
    return getSize(mailiinZagvar?.khuudasniiKhemjee, mailiinZagvar?.chiglel);
  }, [mailiinZagvar.khuudasniiKhemjee, mailiinZagvar.chiglel]);

  const customButtons = React.useMemo(() => {
    if (typeof window === "undefined") return [];

    return [
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
          title: "Хугацаа",
          innerHTML: renderToString(<ClockCircleOutlined />),
        },
        khugatsaaniiTalbaruud
      ),
      createButtonWithItems(
        {
          name: "talbai",
          title: "Түрээсийн талбай",
          innerHTML: renderToString(<BankOutlined />),
        },
        talbainiiTalbaruud
      ),
      createButtonWithItems(
        {
          name: "baritsaa",
          title: "Барьцаа",
          innerHTML: renderToString(<LockOutlined />),
        },
        baritsaaniiTalbaruud
      ),
      createButtonWithItems(
        {
          name: "tulbur",
          title: "Төлбөр",
          innerHTML: renderToString(<DollarCircleOutlined />),
        },
        tulburiinTalbaruud
      ),
    ];
  }, []);

  function khadgalya() {
    if (mailiinZagvar.ner) {
      setWaiting(true);
      mailiinZagvar.barilgiinId = barilgiinId;
      const method = mailiinZagvar?._id ? updateMethod : createMethod;
      method("mailiinZagvar", token, mailiinZagvar)
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
    } else toast.warning("Нэр оруулна уу!");
  }

  function handleChange(e) {
    setMailiinZagvar((mailiinZagvar) => ({
      ...mailiinZagvar,
      mail: e,
    }));
  }
  function inputOnchange(e) {
    setMailiinZagvar((mailiinZagvar) => ({
      ...mailiinZagvar,
      ner: e.target.value,
      turul: "Mail",
    }));
  }

  return (
    <Admin
      khuudasniiNer="MailZagvarKhyanalt"
      title="Mail загвар угсрах"
      hideSearch
      dedKhuudas
      className="p-4"
      loading={waiting}
    >
      <div className=" relative col-span-12 grid grid-cols-12 ">
        <div
          style={{ height: "calc(100vh - 7rem)" }}
          className="col-span-9 overflow-auto p-10"
        >
          <TipTapEditor
            onChange={(e) => handleChange(e)}
            value={mailiinZagvar?.mail}
            setContents={mailiinZagvar?.mail}
            height={height}
            customButtons={[customButtons]}
          />
        </div>
        <div className="col-span-3 rounded-xl bg-white p-10 dark:bg-gray-900">
          <div className="space-y-2">
            <Form.Item name="_id" noStyle />
            <Input
              value={mailiinZagvar.ner}
              onChange={inputOnchange}
              placeholder="Нэр"
            />
            <Form.Item
              label="Нэхэмжлэхийн загвар"
              name="nekhemjlekh"
              noStyle
            ></Form.Item>

            <Form.Item>
              <Button
                onClick={khadgalya}
                style={{
                  backgroundColor: "#209669",
                  color: "#ffffff",
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                Хадгалах
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
