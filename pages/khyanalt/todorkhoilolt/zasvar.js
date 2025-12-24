import React, { useState } from "react";
import { renderToString } from "react-dom/server";
import _ from "lodash";
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
  { ner: "Гэрээний дугаар", talbar: "gereeniiDugaar" },
  { ner: "Регистр", talbar: "register" },
  { ner: "Утас", talbar: "utas" },
  { ner: "Хаяг", talbar: "khayag" },
  { ner: "И-мэйл хаяг", talbar: "mail" },
  { ner: "Ажилтан", talbar: "ajiltan" },
];

const talbainiiTalbaruud = [
  { ner: "Талбайн дугаар", talbar: "talbainDugaar" },
  { ner: "Талбайн хэмжээ м2", talbar: "talbainKhemjee" },
];

const uldegdelTalbaruud = [
  { ner: "Авлагын үлдэгдэл", talbar: "avalagiUldegdel" },
  { ner: "Барьцаа үлдэгдэл", talbar: "baritsaaUldegdel" },
  { ner: "Үлдэгдэл", talbar: "ulegdel" },
  { ner: "Алданги", talbar: "aldangi" },
];
const customPlugin = ({
  name = "custom_example",
  title = t("Талбарийн нэр"),
  button = "T",
  songokhTalbaruud = [],
}) => ({
  name,
  display: "container",
  title,
  innerHTML: `<span style="padding:5px;">${button}</span>`,
  buttonClass: "",
  add: function (core, targetElement) {
    let listDiv = this.setSubmenu.call(core);
    const self = this;
    listDiv.querySelectorAll(".se-btn-list").forEach(function (btn) {
      btn.addEventListener("click", self.onClick.bind(core));
    });
    core.initMenuTarget(this.name, targetElement, listDiv);
  },
  setSubmenu: function () {
    const listDiv = this.util.createElement("DIV");
    listDiv.className = "se-submenu se-list-layer";
    listDiv.innerHTML =
      '<div class="se-list-inner se-list-font-size"><ul class="se-list-basic">' +
      songokhTalbaruud
        .map(
          (a) =>
            `<li><button type="button" class="se-btn-list" value="&lt;${a.talbar}&gt;">{${a.ner}}</button></li>`
        )
        .join("") +
      "</ul></div>";
    return listDiv;
  },
  onClick: function (e) {
    const value = e.target.value;
    const node = this.util.createElement("span");
    this.util.addClass(node, "se-custom-tag");
    node.textContent = value;
    this.insertNode(node);
    const zeroWidthSpace = this.util.createTextNode(this.util.zeroWidthSpace);
    node.parentNode.insertBefore(zeroWidthSpace, node.nextSibling);
    this.submenuOff();
  },
});

function Zasvar({ value, change, data, read, height }, ref) {
  const editorRef = React.useRef();
  const [utga, setUtga] = useState(data?.mail || "");

  React.useImperativeHandle(ref, () => ({
    editor: editorRef.current?.editor,
    getContent: () => {
      if (editorRef.current?.editor) {
        return editorRef.current.editor.getContents();
      }
      return utga || "";
    },
    setContent: (val) => {
      setUtga(val);
      if (editorRef.current?.editor) {
        editorRef.current.editor.setContent(val);
      }
    },
  }));

  React.useEffect(() => {
    if (data) {
      const newValue = data.mail || "";
      setUtga(newValue);
    }
  }, [data]);

  const customButtons = React.useMemo(() => {
    return [
      createButtonWithItems(
        { name: "undsen", title: "Үндсэн мэдээлэл", innerHTML: renderToString(<SolutionOutlined />) },
        undsenTalbaruud
      ),
      createButtonWithItems(
        { name: "talbai", title: t("Түрээсийн талбай"), innerHTML: renderToString(<DollarCircleOutlined />) },
        talbainiiTalbaruud
      ),
      createButtonWithItems(
        { name: "uldegdel", title: t("Түрээсийн үлдэгдэл"), innerHTML: renderToString(<BankOutlined />) },
        uldegdelTalbaruud
      ),
    ];
  }, []);

  const handleStringChange = React.useCallback(
    (content) => {
      setUtga(content);
      if (change) change(content);
    },
    [change]
  );

  return (
    <TipTapEditor
      onChange={handleStringChange}
      value={utga}
      defaultValue={utga}
      setContents={utga}
      height={height || 400}
      readonly={read}
      customButtons={[customButtons]}
      ref={editorRef}
    />
  );
}

export default React.forwardRef(Zasvar);
