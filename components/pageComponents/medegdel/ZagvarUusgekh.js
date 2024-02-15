import React, { useEffect, useMemo } from "react";
import { renderToString } from "react-dom/server";
import _ from "lodash";
import { customPlugin } from "../geree/zagvar/ZaaltOruulakh";
import { SolutionOutlined } from "@ant-design/icons";
import { formatting } from "../geree/zagvar/ZaaltZasvar";

var instance = null;

function ZaaltZasvar({
  value,
  change,
  zogsoolEsekh,
  onTextChange,
  buttonListCustom = [],
  otherProps,
}) {
  useEffect(() => {
    onTextChange && onTextChange(instance?.getText());
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
    return [undsen];
  }, []);

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
        buttonList: [...formatting, ["undsen"], ...buttonListCustom],
        resizingBar: false,
      }}
      showToolbar={true}
      {...otherProps}
    />
  );
}

export default ZaaltZasvar;
