import React, { useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useRouter } from "next/router";
import { Button, Form, Input, message, Radio, Select } from "antd";
import _ from "lodash";
import { useAuth } from "services/auth";
import readMethod from "tools/function/crud/readMethod";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { customPlugin } from "components/pageComponents/geree/zagvar/ZaaltOruulakh";
import { renderToString } from "react-dom/server";
import {
  BankOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  LockOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { aldaaBarigch } from "services/uilchilgee";
import useJagsaalt from "hooks/useJagsaalt";

const undsenTalbaruud = [
  { ner: "Овог", talbar: "ovog" },
  { ner: "Нэр", talbar: "ner" },
  { ner: "Гэрээний огноо", talbar: "gereeniiOgnoo" },
  { ner: "Төрөл", talbar: "turul" },
  { ner: "Регистр", talbar: "register" },
  { ner: "Албан тушаал", talbar: "albanTushaal" },
  { ner: "Захиралын овог", talbar: "zakhirliinOvog" },
  { ner: "Захиралын нэр", talbar: "zakhirliinNer" },
  { ner: "Утас", talbar: "utas" },
  { ner: "Хаяг", talbar: "khayag" },
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
  { ner: "Талбайн нийт үнэ үсгээр", talbar: "talbainNiitUneUsgeer" },
  { ner: "Талбайн хэмжээ", talbar: "talbainKhemjee" },
  { ner: "Түрээсийн талбайн давхар", talbar: "davkhar" },
  { ner: "Зардлын дүн", talbar: "zardliinDun" },
  { ner: "Зориулалт", talbar: "zoriulalt" },
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
  { ner: "Нийт ашиглалтын зардал", talbar: "niitAshiglaltiinZardal" },
  { ner: "Алдангын үлдэгдэл", talbar: "aldangiinUldegdel" },
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
  if (orientation === "landscape") return { width: height, height: width };
  return { width, height };
}

function ZakhialgaNemekh({ token }) {
  const router = useRouter();
  const { id } = router.query;
  const [nekhemjlelZagvar, setNekhemjlelZagvar] = React.useState({
    khuudasniiKhemjee: "A4",
    chiglel: "landscape",
  });

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
      title: "Төлбөр",
      button: renderToString(<DollarCircleOutlined />),
    });

    const nekhemjlel = customPlugin({
      songokhTalbaruud: nekhemjlekhiinTalbaruud,
      name: "nekhemjlel",
      title: "Нэхэмжлэл",
      button: renderToString(<DollarCircleOutlined />),
    });

    const nekhemjlelNemelt = customPlugin({
      songokhTalbaruud: nekhemjlekhiinNemelt,
      name: "nekhemjlekhiinNemelt",
      title: "Нэхэмжлэхийн бусад авлага",
      button: renderToString(<DollarCircleOutlined />),
    });

    const zardaluud = customPlugin({
      songokhTalbaruud: ashiglaltiinZardal?.jagsaalt?.map((a) => ({
        ner: a.ner,
        talbar: a.ner,
      })),
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

  function khadgalya() {
    if (nekhemjlelZagvar.ner) {
      setWaiting(true);
      nekhemjlelZagvar.barilgiinId = barilgiinId;
      const method = nekhemjlelZagvar?._id ? updateMethod : createMethod;
      method("nekhemjlekhiinZagvar", token, nekhemjlelZagvar)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success("Амжилттай хадгаллаа");
            router.back();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else message.warning("Нэр оруулна уу!");
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

  return (
    <Admin
      khuudasniiNer="zakhialgiinKhyanalt"
      title="Нэхэмжлэлийн загвар угсрах"
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
          {!ashiglaltiinZardal?.isValidating && (
            <SunEditor
              onChange={(e) => handleChange(e)}
              value={nekhemjlelZagvar?.nekhemjlekh}
              setContents={nekhemjlelZagvar?.nekhemjlekh}
              setOptions={{
                plugins: custom,
                buttonList: [
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
                  ["image", "table", "list", "align", "codeView"],
                  ["font", "fontSize", "fontColor"],
                ],
              }}
              width={width}
              height={height}
            />
          )}
        </div>
        <div className="col-span-3 rounded-xl bg-white p-10 dark:bg-gray-900">
          <div className="space-y-2">
            <Form.Item name="_id" noStyle />
            <Input
              value={nekhemjlelZagvar.ner}
              onChange={inputOnchange}
              placeholder="Нэр"
            />
            <Form.Item
              label="Нэхэмжлэхийн загвар"
              name="nekhemjlekh"
              noStyle
            ></Form.Item>
            <div className="mt-3 flex items-center justify-between">
              <Radio.Group
                className="my-3"
                onChange={onChange}
                value={nekhemjlelZagvar.khuudasniiKhemjee}
              >
                <Radio value={"A4"}>A4</Radio>
                <Radio value={"A5"}>A5</Radio>
              </Radio.Group>
              <Select
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
