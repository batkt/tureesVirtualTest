import React, { useEffect } from "react";
import { renderToString } from "react-dom/server";
import SunEditor, { buttonList } from "suneditor-react";
import _ from "lodash";
import { customPlugin } from "../geree/zagvar/ZaaltOruulakh";
import { SolutionOutlined } from "@ant-design/icons";

const undsenTalbaruud = [
  { ner: "Овог", talbar: "ovog" },
  { ner: "Нэр", talbar: "ner" },
  { ner: "Төрөл", talbar: "turul" },
  { ner: "Регистр", talbar: "register" },
  { ner: "Утас", talbar: "utas" },
  { ner: "Хаяг", talbar: "khayag" },
];

function ZaaltZasvar({
  value,
  change,
  onTextChange,
  buttonListCustom = [],
  otherProps,
}) {
  const editorRef = React.useRef();

  useEffect(() => {
    onTextChange && onTextChange(editorRef.current.editor.getText());
  }, [value]);

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
      setContents={value}
      setOptions={{
        plugins: custom,
        buttonList: [...buttonList.formatting, ["undsen"], ...buttonListCustom],
        resizingBar: false,
      }}
      showToolbar={true}
      ref={editorRef}
      {...otherProps}
    />
  );
}

export default ZaaltZasvar;
