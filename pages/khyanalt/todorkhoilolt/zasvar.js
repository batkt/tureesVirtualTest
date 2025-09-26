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

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

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
];

const khugatsaaniiTalbaruud = [
  { ner: "Хугацаа", talbar: "khugatsaa" },
  { ner: "Эхлэх өдөр", talbar: "ekhlekhUdur" },
  { ner: "Дуусах өдөр", talbar: "duusakhUdur" },
];

const talbainiiTalbaruud = [
  { ner: "Талбайн дугаар", talbar: "talbainDugaar" },
  { ner: "Талбайн нийт үнэ үсгээр", talbar: "talbainNiitUneUsgeer" },
  { ner: "Талбайн хэмжээ м2", talbar: "talbainKhemjee" },
  { ner: "Талбайн нийт үнэ үсгээр", talbar: "talbainNiitUneUsgeer" },
];
const customPlugin = ({
  name = "custom_example",
  title = t("Талбарийн нэр"),
  button = "T",
  songokhTalbaruud = talbaruud,
}) => ({
  // @Required @Unique
  name: name,
  // @Required
  display: "container" || "command" || "submenu" || "dialog",

  // @options
  // * You can also set from the button list
  // HTML title attribute (tooltip) - default: plugin's name
  title: title,
  // HTML to be append to button (icon)
  // Recommend using the inline svg icon. - default: "<span class="se-icon-text">!</span>"

  innerHTML: `<span style="padding:5px;">${button}</span>`,
  // The class of the button. - default: "se-btn"
  // "se-code-view-enabled": It is not disable when on code view mode.
  // "se-resizing-enabled": It is not disable when on using resizing module.
  buttonClass: "",

  // @Required
  add: function (core, targetElement) {
    // Generate submenu HTML
    // Always bind "core" when calling a plugin function
    let listDiv = this.setSubmenu.call(core);

    // You must bind "core" object when registering an event.
    /** add event listeners */
    var self = this;
    listDiv.querySelectorAll(".se-btn-list").forEach(function (btn) {
      btn.addEventListener("click", self.onClick.bind(core));
    });

    // @Required
    // You must add the "submenu" element using the "core.initMenuTarget" method.
    /** append target button menu */
    core.initMenuTarget(this.name, targetElement, listDiv);
  },

  setSubmenu: function () {
    const listDiv = this.util.createElement("DIV");
    // @Required
    // A "se-submenu" class is required for the top level element.
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
function Zasvar({ value, change, data, read }, ref) {
  const editorRef = React.useRef();
  const plugins = React.useMemo(
    () => require("suneditor/src/plugins")?.default || {},
    []
  );
  console.log(data);
  const initialValue = data?.mail;

  const [utga, setUtga] = useState(initialValue);
  const [editorReady, setEditorReady] = useState(false);

  React.useImperativeHandle(ref, () => ({
    editor: editorRef.current?.editor,
    getContent: () => {
      if (editorRef.current?.editor && editorReady) {
        return editorRef.current.editor.getContents();
      }
      return utga || "";
    },
    setContent: (val) => {
      setUtga(val);
      if (editorRef.current?.editor && editorReady) {
        editorRef.current.editor.setContents(val);
      }
    },
  }));

  React.useEffect(() => {
    if (data) {
      const newValue = data.mail || "";
      setUtga(newValue);

      if (editorRef.current?.editor && editorReady) {
        editorRef.current.editor.setContents(newValue);
      }
    }
  }, [data, editorReady]);

  // function garya() {
  //   const currentValue = data?.mail;
  //   if (utga !== currentValue)
  //     Modal.confirm({
  //       content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
  //       okText: t("Тийм"),
  //       cancelText: t("Үгүй"),
  //       onOk: destroy(),
  //     });
  //   else destroy();
  // }

  // React.useEffect(() => {
  //   function keyUp(e) {
  //     if (e.key === "Escape") {
  //       e.preventDefault();
  //       garya();
  //     }
  //   }
  //   document.addEventListener("keyup", keyUp);
  //   return () => document.removeEventListener("keyup", keyUp);
  // }, [utga]);

  const custom = React.useMemo(() => {
    let songokhTalbaruud = [];
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

    return [undsen, khugatsaa, talbai];
  }, []);

  const handleStringChange = React.useCallback(
    (content) => {
      setUtga(content);
      if (change) {
        change(content);
      }
    },
    [change]
  );

  const handleEditorLoad = React.useCallback(() => {
    setEditorReady(true);

    if (editorRef.current?.editor && initialValue) {
      setTimeout(() => {
        editorRef.current.editor.setContents(initialValue);
      }, 100);
    }
  }, [initialValue]);

  // if (read) {
  //   return (
  //     <div
  //       className="prose max-w-none"
  //       dangerouslySetInnerHTML={{ __html: utga }}
  //     />
  //   );
  // }

  return (
    <SunEditor
      onChange={handleStringChange}
      defaultValue={initialValue}
      setContents={utga}
      onLoad={handleEditorLoad}
      setOptions={{
        height: 410,
        plugins: { ...plugins, ...custom },
        buttonList: [
          ...formatting,
          ["align"],
          ["undsen", "khugatsaa", "talbai", "table", "fontSize", "font"],
        ],
        readonly: read,
        showToolbar: !read,
      }}
      disable={read}
      showToolbar={true}
      ref={editorRef}
    />
  );
}

export default React.forwardRef(Zasvar);
