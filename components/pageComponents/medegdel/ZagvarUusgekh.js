import React, { useEffect } from "react";
import { renderToString } from "react-dom/server";
import _ from "lodash";
import { customPlugin } from "../geree/zagvar/ZaaltOruulakh";
import { SolutionOutlined } from "@ant-design/icons";
import { formatting } from "../geree/zagvar/ZaaltZasvar";

const undsenTalbaruud = [
  { ner: "Овог", talbar: "ovog" },
  { ner: "Нэр", talbar: "ner" },
  { ner: "Төрөл", talbar: "turul" },
  { ner: "Регистр", talbar: "register" },
  { ner: "Утас", talbar: "utas" },
  { ner: "Хаяг", talbar: "khayag" },
];

var instance = null;

function ZaaltZasvar({
  value,
  change,
  onTextChange,
  buttonListCustom = [],
  otherProps,
}) {
  useEffect(() => {
    onTextChange && onTextChange(instance?.getText());
  }, [value]);

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
