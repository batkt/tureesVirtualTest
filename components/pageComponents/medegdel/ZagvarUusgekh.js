import React, { useEffect, useMemo } from "react";
import { renderToString } from "react-dom/server";
import _ from "lodash";
import { customPlugin } from "../geree/zagvar/ZaaltOruulakh";
import { SolutionOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { formatting } from "../geree/zagvar/ZaaltZasvar";

var instance = null;

function ZaaltZasvar({
  value,
  change,
  zogsoolEsekh,
  onTextChange,
  buttonListCustom = [],
  otherProps,
  height,
}) {
  useEffect(() => {
    if (instance && typeof instance.getText === "function") {
      onTextChange && onTextChange(instance.getText());
    }
  }, [value]);

  const undsenTalbaruud = useMemo(() => {
    if (zogsoolEsekh) {
      return [
        { ner: "Нэр", talbar: "ezemshigchiinNer" },
        { ner: "Машины дугаар", talbar: "dugaar" },
        { ner: "Төрөл", talbar: "turul" },
        { ner: "Гэрээ эхлэх огноо", talbar: "ekhlekhOgnoo" },
        { ner: "Гэрээ дуусах огноо", talbar: "duusakhOgnoo" },
      ];
    } else {
      return [
        { ner: "Овог", talbar: "ovog" },
        { ner: "Нэр", talbar: "ner" },
        { ner: "Төрөл", talbar: "turul" },
        { ner: "Регистр", talbar: "register" },
        { ner: "Утас", talbar: "utas" },
        { ner: "Хаяг", talbar: "khayag" },
      ];
    }
  }, [zogsoolEsekh]);

  const SunEditor = React.useMemo(() => require("suneditor-react").default, []);

  const custom = React.useMemo(() => {
    const undsen = customPlugin({
      songokhTalbaruud: undsenTalbaruud,
      name: "undsen",
      title: "Үндсэн мэдээлэл",
      button: renderToString(<SolutionOutlined />),
    });

    const tulburiinTalbaruud = [
      { ner: "Хөнгөлөх хугацаа", talbar: "khungulukhKhugatsaa" },
      { ner: "Сарын түрээс", talbar: "sariinTurees" },
      { ner: "Сарын нийлбэр дүн", talbar: "sariinNiilberDun" },
      { ner: "Мөнгөн дүн үсгээр", talbar: "mungunDunUsgeer" },
    ];

    const tulbur = customPlugin({
      songokhTalbaruud: tulburiinTalbaruud,
      name: "tulbur",
      title: "Төлбөр",
      button: renderToString(<DollarCircleOutlined />),
    });

    return [undsen, tulbur];
  }, [undsenTalbaruud]);

  return (
    <SunEditor
      onChange={change}
      defaultValue={value}
      getSunEditorInstance={(e) => {
        instance = e;
      }}
      setContents={value}
      setOptions={{
        plugins: custom,
        buttonList: [
          ...formatting,
          ["undsen"],
          ["tulbur"],
          ...buttonListCustom,
        ],
        resizingBar: true,
        height: height,
      }}
      showToolbar={true}
      {...otherProps}
    />
  );
}

export default ZaaltZasvar;
