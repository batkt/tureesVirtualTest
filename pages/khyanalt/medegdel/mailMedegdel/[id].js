import React, { useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useRouter } from "next/router";
import { Button, Form, Input, message, Radio, Select } from "antd";
import _ from "lodash";
import { useAuth } from "services/auth";
import readMethod from "tools/function/crud/readMethod";
import { customPlugin } from "components/pageComponents/geree/zagvar/ZaaltOruulakh";
import { renderToString } from "react-dom/server";
import { SolutionOutlined } from "@ant-design/icons";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { aldaaBarigch } from "services/uilchilgee";
import dynamic from "next/dynamic";
import { t } from "i18next";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const undsenTalbaruud = [
  { ner: "Овог", talbar: "ovog" },
  { ner: "Нэр", talbar: "ner" },
  { ner: "Төрөл", talbar: "turul" },
  { ner: "Регистр", talbar: "register" },
  { ner: "Утас", talbar: "utas" },
  { ner: "Хаяг", talbar: "khayag" },
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

  const custom = React.useMemo(() => {
    if (typeof window === "undefined") return [];
    const undsen = customPlugin({
      songokhTalbaruud: undsenTalbaruud,
      name: "undsen",
      title: "Үндсэн мэдээлэл",
      button: renderToString(<SolutionOutlined />),
    });

    return [undsen];
  }, []);

  function khadgalya() {
    if (mailiinZagvar.ner) {
      setWaiting(true);
      mailiinZagvar.barilgiinId = barilgiinId;
      const method = mailiinZagvar?._id ? updateMethod : createMethod;
      method("mailiinZagvar", token, mailiinZagvar)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(t("Амжилттай хадгаллаа"));
            router.back();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else message.warning("Нэр оруулна уу!");
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
          <SunEditor
            onChange={(e) => handleChange(e)}
            value={mailiinZagvar?.mail}
            setContents={mailiinZagvar?.mail}
            setOptions={{
              plugins: custom,
              buttonList: [
                ["undsen"],
                ["list", "align", "codeView"],
                ["font", "fontSize", "fontColor"],
              ],
            }}
            width={width}
            height={height}
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
